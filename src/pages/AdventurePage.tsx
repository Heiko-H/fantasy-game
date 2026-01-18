import {useEffect} from 'react';
import {useAdventureStore} from '../store/adventureStore';
import type {Answer} from '../types/index';
import QuestionCard from '../components/adventure/QuestionCard';
import EndScreen from '../components/adventure/EndScreen';
import {useTranslation} from 'react-i18next';

const AdventurePage = () => {
    const {t, i18n} = useTranslation();
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
        const lang = i18n.language.startsWith('de') ? 'de' : 'en';
        const filename = `adventure_${lang}.json`;
        loadAdventure(filename);
    }, [loadAdventure, i18n.language]);

    const handleRestart = () => {
        resetGame();
        // Force reload of adventure data if language changed
        const lang = i18n.language.startsWith('de') ? 'de' : 'en';
        const filename = `adventure_${lang}.json`;
        loadAdventure(filename);
    };

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
        return <div className="text-center text-xl">{t('adventure.loading')}</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{t('adventure.error', {error})}</div>;
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
                    onRestart={handleRestart}
                />
            )}

            {!gameState.isFinished && !currentQuestion && (
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">{t('adventure.error_title')}</h1>
                    <button onClick={handleRestart}
                            className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">{t('adventure.restart')}
                    </button>
                </div>
            )}
        </>
    );
};

export default AdventurePage;
