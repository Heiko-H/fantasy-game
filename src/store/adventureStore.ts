import {create} from 'zustand';
import type {Epilogue, GameState, Question} from '../types/game';

interface AdventureData {
    questions: Record<string, Question>;
    epilogues: Record<string, Epilogue>;
}

interface AdventureStore {
    // Data state
    data: AdventureData | null;
    isLoading: boolean;
    error: string | null;

    // Game state
    gameState: GameState;

    // Actions
    loadAdventure: (filename: string) => Promise<void>;
    updateGameState: (newState: Partial<GameState>) => void;
    resetGame: () => void;
}

const initialGameState: GameState = {
    currentQuestionId: 'start',
    history: [],
    isFinished: false,
    finalEpilogueId: null,
};

// Helper to get saved state from sessionStorage
const getSavedState = (): GameState => {
    const saved = sessionStorage.getItem('chatgame_state');
    return saved ? JSON.parse(saved) : initialGameState;
};

export const useAdventureStore = create<AdventureStore>((set, get) => ({
    data: null,
    isLoading: false,
    error: null,
    gameState: getSavedState(),

    loadAdventure: async (filename: string) => {
        // Only load if not already loaded or if different (for future flexibility)
        // For now, simple check
        if (get().data && !get().error) return;

        set({isLoading: true, error: null});
        try {
            const baseUrl = import.meta.env.BASE_URL || '/';
            const response = await fetch(`${baseUrl}data/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load adventure: ${response.statusText}`);
            }
            const jsonData = await response.json();
            set({data: jsonData, isLoading: false});
        } catch (err) {
            set({error: err instanceof Error ? err.message : 'Unknown error', isLoading: false});
        }
    },

    updateGameState: (newState: Partial<GameState>) => {
        set((state) => {
            const updatedState = {...state.gameState, ...newState};
            sessionStorage.setItem('chatgame_state', JSON.stringify(updatedState));
            return {gameState: updatedState};
        });
    },

    resetGame: () => {
        sessionStorage.setItem('chatgame_state', JSON.stringify(initialGameState));
        set({gameState: initialGameState});
    },
}));
