import React from 'react';
import type {Answer, Question} from '../types/index';

interface QuestionCardProps {
    question: Question;
    onAnswer: (answer: Answer) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({question, onAnswer}) => {
    const [isExiting, setIsExiting] = React.useState(false);

    const handleAnswerClick = (answer: Answer) => {
        setIsExiting(true);
        setTimeout(() => {
            onAnswer(answer);
            setIsExiting(false);
        }, 400); // Match this with the duration-400 in transition
    };

    return (
        <div
            className={`max-w-3xl mx-auto p-6 md:p-8 bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-400 transform ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0 animate-in fade-in zoom-in duration-500'}`}>
            <div className="mb-6 md:mb-10">
                <div
                    className="w-12 h-1 bg-blue-500 mb-4 md:mb-6 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-serif whitespace-pre-line">
                    {question.story}
                </p>
            </div>

            <div className="mb-6 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-blue-600 pl-4 py-1">
                    {question.questionText}
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {question.answers.map((answer, index) => (
                    <button
                        key={answer.id}
                        onClick={() => handleAnswerClick(answer)}
                        style={{transitionDelay: `${index * 50}ms`}}
                        className="group relative p-4 md:p-5 text-left transition-all duration-300 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-blue-900/30 hover:border-blue-500/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 flex items-center">
              <span
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-700 group-hover:bg-blue-600 text-sm font-bold mr-4 transition-colors">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm md:text-base">{answer.text}</span>
            </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
