import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDndStore} from '../store/dndStore';
import DndQuestionCard from '../components/dnd/DndQuestionCard';
import DndResultScreen from '../components/dnd/DndResultScreen';
import type {DndQuestionTranslation} from '../types/index';

const DndRacePage: React.FC = () => {
    const {t, i18n} = useTranslation();
    const {
        loadData,
        startQuiz,
        submitAnswer,
        resetQuiz,
        gameState,
        questions,
        data,
        isLoading,
        error
    } = useDndStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (isLoading) {
        return <div className="text-center text-xl text-red-500 animate-pulse">{t('dnd_page.loading')}</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 font-bold">{t('dnd_page.error', {error})}</div>;
    }

    if (!gameState) {
        return (
            <div
                className="max-w-2xl mx-auto text-center p-8 bg-gray-900/50 backdrop-blur-md border border-red-900/30 rounded-3xl shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-serif font-black mb-8 text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-red-600 to-red-900 uppercase tracking-widest leading-tight">
                    {t('dnd_page.title')}
                </h2>
                <p className="text-xl md:text-2xl font-sans text-gray-300 mb-10 leading-relaxed">
                    {t('dnd_page.intro')}
                </p>
                <button
                    onClick={startQuiz}
                    className="px-10 py-4 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg shadow-red-900/20"
                >
                    {t('dnd_page.start_quiz')}
                </button>
            </div>
        );
    }

    if (gameState.isFinished && data) {
        return (
            <DndResultScreen
                scores={gameState.scores}
                data={data}
                onRestart={resetQuiz}
            />
        );
    }

    const currentQuestionId = gameState.randomQuestionIds[gameState.currentIndex];
    const questionData = gameState && questions ? questions.find(q => q.id === currentQuestionId) : null;
    const lang = i18n.language.split('-')[0]; // Handle cases like 'de-DE'

    if (!questionData) {
        return <div className="text-center text-red-500">{t('dnd_page.calculating')}</div>;
    }

    const currentQuestion: DndQuestionTranslation = {
        id: questionData.id,
        questionText: questionData.translations[lang]?.question || questionData.translations['en']?.question || '',
        answers: (questionData.translations[lang]?.answers || questionData.translations['en']?.answers || []).map((text, index) => ({
            id: `${questionData.id}_a_${index}`,
            text: text
        }))
    };

    return (
        <DndQuestionCard
            question={currentQuestion}
            onAnswer={submitAnswer}
            currentIndex={gameState.currentIndex}
            totalQuestions={gameState.randomQuestionIds.length}
        />
    );
};

export default DndRacePage;
