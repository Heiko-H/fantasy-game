import {useEffect} from 'react';
import {useAdventureStore} from '../store/adventureStore';
import type {Answer} from '../types/game';
import QuestionCard from '../components/QuestionCard';
import EndScreen from '../components/EndScreen';

const AdventurePage = () => {
    const {
        data,
        isLoading,
        error,
        gameState,
        loadAdventure,
        updateGameState,
        resetGame
    } = useAdventureStore();

    useEffect(() => {
        loadAdventure('adventure.json');
    }, [loadAdventure]);

    const handleAnswer = (answer: Answer) => {
        if (!data) return;
        const newHistory = [...gameState.history, answer.id];

        if (data.epilogues[answer.nextQuestionId]) {
            updateGameState({
                history: newHistory,
                isFinished: true,
                finalEpilogueId: answer.nextQuestionId,
                currentQuestionId: null
            });
        } else if (data.questions[answer.nextQuestionId]) {
            updateGameState({
                history: newHistory,
                currentQuestionId: answer.nextQuestionId
            });
        } else {
            console.error("Next ID not found in QUESTIONS or EPILOGUES:", answer.nextQuestionId);
        }
    };

    if (isLoading) {
        return <div className="text-center text-xl">Abenteuer wird geladen...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Fehler beim Laden des Abenteuers: {error}</div>;
    }

    if (!data) return null;

    const currentQuestion = gameState.currentQuestionId ? data.questions[gameState.currentQuestionId] : null;
    const currentEpilogue = gameState.finalEpilogueId ? data.epilogues[gameState.finalEpilogueId] : null;

    return (
        <>
            {!gameState.isFinished && currentQuestion && (
                <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                />
            )}

            {gameState.isFinished && currentEpilogue && (
                <EndScreen
                    epilogue={currentEpilogue}
                    onRestart={resetGame}
                />
            )}

            {!gameState.isFinished && !currentQuestion && (
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Ein Fehler ist aufgetreten oder das
                        Abenteuer ist zu Ende.</h1>
                    <button onClick={resetGame}
                            className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Neustart
                    </button>
                </div>
            )}
        </>
    );
};

export default AdventurePage;
