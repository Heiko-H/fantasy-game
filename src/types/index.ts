export interface Answer {
    id: string;
    text: string;
    nextQuestionId: string;
}

export interface Question {
    id: string;
    story: string;
    questionText: string;
    answers: Answer[];
}

export interface Epilogue {
    id: string;
    title: string;
    text: string;
}

export interface GameState {
    currentQuestionId: string | null;
    history: string[];
    isFinished: boolean;
    finalEpilogueId: string | null;
}

export interface DndData {
    races: Array<{ id: string; name: Record<string, string>; attributeIds: string[] }>;
    classes: Array<{ id: string; name: Record<string, string>; attributeIds: string[] }>;
    backgrounds: Array<{ id: string; name: Record<string, string>; attributeIds: string[] }>;
    attributes: Record<string, Record<string, string>>;
}

export interface DndQuestion {
    id: string;
    attributeIds: string[][];
    translations: Record<string, {
        question: string;
        answers: string[];
    }>;
}

export interface DndQuestionTranslation {
    id: string;
    questionText: string;
    answers: Array<{
        id: string;
        text: string;
    }>;
}

export interface DndTranslations {
    races: Record<string, string>;
    classes: Record<string, string>;
    backgrounds: Record<string, string>;
    attributes: Record<string, string>;
}

export interface DndGameState {
    randomQuestionIds: string[];
    currentIndex: number;
    scores: {
        races: Record<string, number>;
        classes: Record<string, number>;
        backgrounds: Record<string, number>;
    };
    isFinished: boolean;
    extraQuestionsCount: number;
}
