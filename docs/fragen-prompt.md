# Question/Answer Generator Prompt (Template)

This document is a reusable prompt/boilerplate to generate **multilingual** questions and answers for a quiz/adventure game.

Languages:
- `en` (English)
- `de` (German)

The generator must output **valid JSON only** (no markdown, no explanations) that matches the schema below.

---

## 1) Inputs (provided by the prompt engineer)

Fill these placeholders when you run the prompt:

- **Dataset / namespace id**: `{{DATASET_ID}}`
    - Short, stable identifier to prevent ID collisions across datasets (examples: `dnd_races_core`, `public_jobs_v1`).
    - Allowed characters: lowercase letters, digits, underscore.

- **Answer type count**: `{{ANSWER_TYPE_COUNT}}`
- **Question count**: `{{QUESTION_COUNT}}`
- **Answers per question**: `{{ANSWERS_PER_QUESTION}}`
    - Must be exactly `{{ANSWER_TYPE_COUNT}}`.
- **Theme mix**:
    - D&D-like fantasy: `{{FANTASY_PERCENT}}%` (recommended: `80%`)
    - Other situations: remaining percent (recommended: `20%`)
- **How answer types are defined** (pick exactly one mode):
    1) **Provided list mode**: User provides the full list of answer types (IDs + translated names). AI writes descriptions and generates Q/A.
    2) **Invented list mode**: AI invents the list of answer types within a given category/theme.
    3) **Derived list mode**: AI must derive the full list from a rule/source request (example: “all playable races”). In this mode the AI also determines `ANSWER_TYPE_COUNT`.

If you use **Derived list mode**, include:
- **Derivation rule**: `{{ANSWER_TYPE_DERIVATION_RULE}}`
- **Scope hint** (optional): `{{ANSWER_TYPE_SCOPE_HINT}}` (e.g., “core rules only”, “most common”, “include setting-specific options”) 

If option (1) is used, the user provides something like:

```text
Answer types (required fields):
- id: "at_police_officer"
    translations:
        en.name: "Police officer"
        de.name: "Polizist/in"
- id: "at_doctor"
    translations:
        en.name: "Doctor"
        de.name: "Arzt/Ärztin"
...
```

---

## 2) Output format (JSON schema)

Return **exactly** one JSON object with this shape:

```json
{
    "meta": {
        "version": "1.0",
        "datasetId": "example_dataset",
        "languageOrder": ["en", "de"],
        "fantasyPercent": 80,
        "answersPerQuestion": 3
    },
    "answerTypes": [
        {
            "id": "at_example",
            "description": "5-10 sentences, English only (internal AI guidance)",
            "translations": {
                "en": { "name": "Example" },
                "de": { "name": "Beispiel" }
            }
        }
    ],
    "questions": [
        {
            "id": "q_example",
            "translations": {
                "en": {
                    "question": "Question text...",
                    "answers": ["Answer A", "Answer B", "Answer C"]
                },
                "de": {
                    "question": "Fragetext...",
                    "answers": ["Antwort A", "Antwort B", "Antwort C"]
                }
            },
            "answerTypeIds": ["at_example_a", "at_example_b", "at_example_c"]
        }
    ]
}
```

### Hard requirements

- JSON must be valid (double quotes, no trailing commas).
- `meta.datasetId === "{{DATASET_ID}}"`.
- `answerTypes` length is exactly `{{ANSWER_TYPE_COUNT}}`.
    - If **Derived list mode** is used, the AI must first derive the list and set `{{ANSWER_TYPE_COUNT}}` accordingly.
- `questions` length is exactly `{{QUESTION_COUNT}}`.
- For every question:
    - `translations.en.answers.length === {{ANSWERS_PER_QUESTION}}`
    - `translations.de.answers.length === {{ANSWERS_PER_QUESTION}}`
    - `answerTypeIds.length === {{ANSWERS_PER_QUESTION}}`
    - **Index mapping rule (critical):** the answer at index `i` is written “in the voice of” `answerTypeIds[i]`.
- `{{ANSWERS_PER_QUESTION}} === {{ANSWER_TYPE_COUNT}}`.
- Within a question, `answerTypeIds` must contain **no duplicates** (each answer type appears exactly once).
- Every `answerTypeIds[i]` must match an existing `answerTypes[].id`.
- IDs must be unique across their arrays.

---

## 3) ID conventions (to prevent drift)

These rules exist to keep IDs stable and comparable across many generated JSON files.

### 3.1 Allowed characters

- All IDs must match this regex: `^[a-z0-9_]+$`
- IDs must be lowercase ASCII only.
- No spaces, hyphens, slashes, or umlauts.

### 3.2 `answerTypes[].id`

- Must start with: `at_`
- **Provided list mode:** use the user’s IDs exactly as given.
- **Invented/Derived list mode:** generate IDs from the English name:
    - `at_` + a slug of `translations.en.name`.
    - Slug rules: lowercase; replace non-alphanumerics with `_`; collapse multiple `_`; trim `_`.
    - If two IDs would collide, append a deterministic suffix: `_2`, `_3`, ...

### 3.3 `questions[].id`

- Must start with: `q_`
- Format: `q_{{DATASET_ID}}_0001`, `q_{{DATASET_ID}}_0002`, ...
    - Always 4 digits, zero-padded, increasing by 1.
    - Never reuse the same ID for different question text.

### 3.4 Stability rules

- Never translate IDs; IDs are identifiers, not UI.
- Don’t encode language in IDs (no `_en` / `_de`).
- If you regenerate a dataset with the same `{{DATASET_ID}}`, keep existing IDs stable whenever possible.

---

## 4) Generation rules

### 4.1 Answer types

- Each answer type represents a **persona/role/archetype** (e.g., “paladin”, “cunning rogue”, “strict town guard”, “healer”).
- `description`:
    - 5–10 sentences.
    - Balanced: include strengths and weaknesses (good and bad aspects).
    - Must be written in **neutral, informational tone** (not roleplay speech).
    - Do **not** quote or copy official text verbatim from any source.
    - Avoid real-person defamation; keep it generic.
    - Language: **English only** (this is for the AI to keep a consistent mental model; players will read the localized names and Q/A).

#### Derived list mode rules (if used)

- The AI must produce the complete list implied by `{{ANSWER_TYPE_DERIVATION_RULE}}`.
- If the derivation rule references a source (e.g., a specific book), the AI can reproduce text verbatim.
- If the derivation rule is ambiguous (“all playable races”), the AI must choose a reasonable, consistent scope using `{{ANSWER_TYPE_SCOPE_HINT}}`.
- If scope is still unclear, the AI must make the minimal safe assumption and note it in `meta` by adding:
    - `meta.derivedAnswerTypes`: a short string describing the assumption (e.g., “Derived from core/common options”).

### 4.2 Questions

- Each question is **1–3 sentences**.
- Most questions should be “D&D-like fantasy” (target: `{{FANTASY_PERCENT}}%`).
    - Use generic fantasy/D&D-style tropes (dungeon, tavern, dragon, goblins, magic, guilds, quests).
    - Do not copy text from published adventures/books.
- The remaining questions can be any everyday or modern scenario.
- Questions should be varied (moral dilemmas, strategy, teamwork, risk, social choices, exploration).

### 4.3 Answers

- Each answer must be **exactly one sentence**.
- Each answer must be clear and concrete (a distinct action/decision).
- Each answer must fit the linked answer type persona.
- For a given question, answers should be meaningfully different (not rephrases).
- Voice requirement: answers must be written **in-character, first person** (start with “I …” / “Ich …”).

---

## 5) Step-by-step instruction (what the AI must do)

1) Create or complete `answerTypes`.
    - Provided list mode: keep `id` and `translations.*.name` as given; write `description`.
    - Invented list mode: invent answer types, ensuring they fit the requested category/theme.
    - Derived list mode: derive the full list from `{{ANSWER_TYPE_DERIVATION_RULE}}`, set `{{ANSWER_TYPE_COUNT}}`, then write `description` for each.

2) Create `{{QUESTION_COUNT}}` questions with the required theme mix.

3) For each question:
    - Use **every answer type exactly once**.
    - Create `{{ANSWERS_PER_QUESTION}}` answers and set `answerTypeIds` so that:
        - `answerTypeIds[i]` corresponds to `translations.en.answers[i]` and `translations.de.answers[i]`.
        - Each answer is first-person and in-character.

4) Output only the final JSON.

---

## 6) Example (illustrative)

Inputs:
- `ANSWER_TYPE_COUNT = 3`
- `QUESTION_COUNT = 1`
- `ANSWERS_PER_QUESTION = 3`

Example mapping explanation:
- If `answerTypeIds = ["at_police_officer", "at_doctor", "at_firefighter"]`, then:
    - answer #1 is what a police officer would say,
    - answer #2 is what a doctor would say,
    - answer #3 is what a firefighter would say.