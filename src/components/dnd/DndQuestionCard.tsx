import React from 'react';
import {useTranslation} from 'react-i18next';
import type {DndQuestionTranslation} from '../types/index';

interface DndQuestionCardProps {
    question: DndQuestionTranslation;
    onAnswer: (index: number) => void;
    currentIndex: number;
    totalQuestions: number;
}

const DndQuestionCard: React.FC<DndQuestionCardProps> = ({question, onAnswer, currentIndex, totalQuestions}) => {
    const {t} = useTranslation();
    const [isExiting, setIsExiting] = React.useState(false);

    const handleAnswerClick = (index: number) => {
        setIsExiting(true);
        setTimeout(() => {
            onAnswer(index);
            setIsExiting(false);
        }, 400);
    };

    return (
        <div
            className={`max-w-3xl mx-auto p-6 md:p-8 bg-gray-900/80 backdrop-blur-md border border-red-900/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] transition-all duration-400 transform ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in duration-500'}`}
        >
            <div className="mb-6 md:mb-8">
                <div className="flex justify-between items-center mb-2">
                    <div className="w-12 h-1 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                    <span className="text-xs font-mono text-red-500/50 uppercase tracking-[0.2em]">
                        {t('dnd_page.progress')}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden border border-red-900/20">
                    <div
                        className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                        style={{width: `${Math.min(((currentIndex + 1) / Math.max(totalQuestions, 25)) * 100, 100)}%`}}
                    ></div>
                </div>
            </div>

            <div className="mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight border-l-4 border-red-700 pl-6 py-2 leading-tight">
                    {question.questionText}
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {question.answers.map((answer, index) => (
                    <button
                        key={answer.id}
                        onClick={() => handleAnswerClick(index)}
                        style={{transitionDelay: `${index * 50}ms`}}
                        className="group relative p-5 md:p-6 text-left transition-all duration-300 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-red-950/20 hover:border-red-600/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 flex items-center">
                            <span
                                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-700/50 group-hover:bg-red-700 text-base font-bold mr-5 transition-all transform group-hover:rotate-3 shadow-lg">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-base md:text-lg font-medium leading-snug">{answer.text}</span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DndQuestionCard;
