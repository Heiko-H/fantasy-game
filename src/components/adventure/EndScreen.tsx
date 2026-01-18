import React from 'react';
import type {Epilogue} from '../types/index';
import {useTranslation} from 'react-i18next';

interface EndScreenProps {
    epilogue: Epilogue;
    onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({epilogue, onRestart}) => {
    const {t} = useTranslation();
    return (
        <div
            className="max-w-3xl mx-auto p-6 md:p-10 bg-gray-900/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-[0_0_100px_rgba(37,99,235,0.2)] text-center animate-fadeIn">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700 mb-6 md:mb-8 uppercase tracking-tighter">
                {t('end_screen.title')}
            </h1>

            <div className="mb-8 md:mb-12 p-6 md:p-8 bg-gray-800/50 rounded-2xl border border-gray-700 shadow-inner">
                <h2 className="text-xl md:text-3xl font-bold text-blue-100 mb-4 md:mb-6 tracking-widest uppercase">
                    {epilogue.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-serif italic">
                    "{epilogue.text}"
                </p>
            </div>

            <button
                onClick={onRestart}
                className="group relative px-6 md:px-10 py-3 md:py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-[0_10px_20px_rgba(37,99,235,0.4)] overflow-hidden"
            >
                <span
                    className="relative z-10 uppercase tracking-widest text-sm md:text-base">{t('end_screen.restart')}</span>
                <div
                    className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
        </div>
    );
};

export default EndScreen;
