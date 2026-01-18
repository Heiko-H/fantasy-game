import {create} from 'zustand';
import type {DndData, DndGameState, DndQuestion} from '../types/index';

interface DndStore {
    data: DndData | null;
    questions: DndQuestion[] | null;
    isLoading: boolean;
    error: string | null;

    gameState: DndGameState | null;

    loadData: () => Promise<void>;
    startQuiz: () => void;
    submitAnswer: (answerIndex: number) => void;
    resetQuiz: () => void;
}

const initialScores = (data: DndData) => ({
    races: Object.fromEntries(data.races.map(r => [r.id, 0])),
    classes: Object.fromEntries(data.classes.map(c => [c.id, 0])),
    backgrounds: Object.fromEntries(data.backgrounds.map(b => [b.id, 0])),
});

export const useDndStore = create<DndStore>((set, get) => ({
    data: null,
    questions: null,
    isLoading: false,
    error: null,
    gameState: null,

    loadData: async () => {
        // Only skip if data is already loaded
        if (get().data && get().questions) return;

        set({isLoading: true, error: null});
        try {
            const baseUrl = import.meta.env.BASE_URL || '/';

            const [dataRes, questionsRes] = await Promise.all([
                fetch(`${baseUrl}data/dnd_data.json`),
                fetch(`${baseUrl}data/dnd_questions.json`)
            ]);

            if (!dataRes.ok) throw new Error(`Failed to load data: ${dataRes.statusText}`);
            if (!questionsRes.ok) throw new Error(`Failed to load questions: ${questionsRes.statusText}`);

            const data: DndData = await dataRes.json();
            const questions: DndQuestion[] = await questionsRes.json();

            set({
                data,
                questions,
                isLoading: false,
            });
        } catch (err) {
            set({error: err instanceof Error ? err.message : 'Unknown error', isLoading: false});
        }
    },

    startQuiz: () => {
        const {questions, data} = get();
        if (!questions || !data || questions.length === 0) return;

        // Use a better shuffle algorithm
        const shuffled = [...questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const selectedIds = shuffled.slice(0, 25).map(q => q.id);

        set({
            gameState: {
                randomQuestionIds: selectedIds,
                currentIndex: 0,
                scores: initialScores(data),
                isFinished: false,
                extraQuestionsCount: 0,
            }
        });
    },

    submitAnswer: (answerIndex: number) => {
        const {gameState, questions, data} = get();
        if (!gameState || !questions || !data) return;

        const currentQuestionId = gameState.randomQuestionIds[gameState.currentIndex];
        const question = questions.find(q => q.id === currentQuestionId);
        if (!question) return;

        const selectedAttributes = question.attributeIds[answerIndex];
        const newScores = {
            races: {...gameState.scores.races},
            classes: {...gameState.scores.classes},
            backgrounds: {...gameState.scores.backgrounds},
        };

        selectedAttributes.forEach(attrId => {
            // Find which category this attribute belongs to
            const race = data.races.find(r => r.attributeIds.includes(attrId));
            if (race) {
                newScores.races[race.id] = (newScores.races[race.id] || 0) + 1;
            }
            const cls = data.classes.find(c => c.attributeIds.includes(attrId));
            if (cls) {
                newScores.classes[cls.id] = (newScores.classes[cls.id] || 0) + 1;
            }
            const bg = data.backgrounds.find(b => b.attributeIds.includes(attrId));
            if (bg) {
                newScores.backgrounds[bg.id] = (newScores.backgrounds[bg.id] || 0) + 1;
            }
        });

        // Debug output
        console.log('--- D&D Quiz Scores ---');
        console.log('Races:', Object.entries(newScores.races).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]));
        console.log('Classes:', Object.entries(newScores.classes).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]));
        console.log('Backgrounds:', Object.entries(newScores.backgrounds).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]));

        const isLastFixedQuestion = gameState.currentIndex === gameState.randomQuestionIds.length - 1;

        if (isLastFixedQuestion) {
            // Check for ties
            const hasTie = (scores: Record<string, number>) => {
                const values = Object.values(scores);
                const max = Math.max(...values);
                return values.filter(v => v === max).length > 1;
            };

            if (hasTie(newScores.races) || hasTie(newScores.classes) || hasTie(newScores.backgrounds)) {
                // Need more questions
                const usedIds = new Set(gameState.randomQuestionIds);
                const availableQuestions = questions.filter(q => !usedIds.has(q.id));
                if (availableQuestions.length > 0) {
                    const nextQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
                    set({
                        gameState: {
                            ...gameState,
                            scores: newScores,
                            currentIndex: gameState.currentIndex + 1,
                            randomQuestionIds: [...gameState.randomQuestionIds, nextQ.id],
                            extraQuestionsCount: gameState.extraQuestionsCount + 1,
                        }
                    });
                    return;
                }
            }

            set({
                gameState: {
                    ...gameState,
                    scores: newScores,
                    isFinished: true
                }
            });
        } else {
            set({
                gameState: {
                    ...gameState,
                    scores: newScores,
                    currentIndex: gameState.currentIndex + 1
                }
            });
        }
    },

    resetQuiz: () => {
        set({gameState: null});
    }
}));
