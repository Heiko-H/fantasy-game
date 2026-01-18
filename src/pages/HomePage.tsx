import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-4xl md:text-6xl font-serif font-black mb-8 text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 uppercase tracking-widest drop-shadow-lg">
                {t('home.title')}
            </h2>
            <p className="text-xl md:text-2xl font-sans text-gray-300 mb-12 max-w-2xl">
                {t('home.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <button
                    onClick={() => navigate('adventure')}
                    className="group relative p-8 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden"
                >
                    <div
                        className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    <h3 className="text-2xl font-serif font-bold text-yellow-500 mb-4 uppercase tracking-wider">{t('home.adventure_title')}</h3>
                    <p className="text-gray-400">{t('home.adventure_desc')}</p>
                </button>

                <button
                    onClick={() => navigate('dnd')}
                    className="group relative p-8 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden"
                >
                    <div
                        className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    <h3 className="text-2xl font-serif font-bold text-yellow-500 mb-4 uppercase tracking-wider">{t('home.dnd_title')}</h3>
                    <p className="text-gray-400">{t('home.dnd_desc')}</p>
                </button>
            </div>
        </div>
    );
};

export default HomePage;
