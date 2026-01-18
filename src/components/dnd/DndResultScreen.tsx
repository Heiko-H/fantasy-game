import React from 'react';
import {useTranslation} from 'react-i18next';
import type {DndData} from '../types/index';

interface DndResultScreenProps {
    scores: {
        races: Record<string, number>;
        classes: Record<string, number>;
        backgrounds: Record<string, number>;
    };
    data: DndData;
    onRestart: () => void;
}

const DndResultScreen: React.FC<DndResultScreenProps> = ({scores, data, onRestart}) => {
    const {t, i18n} = useTranslation();
    const lang = i18n.language.split('-')[0];

    const getWinner = (categoryScores: Record<string, number>) => {
        return Object.entries(categoryScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    };

    const winnerRaceId = getWinner(scores.races);
    const winnerClassId = getWinner(scores.classes);
    const winnerBgId = getWinner(scores.backgrounds);

    const winnerRace = data.races.find(r => r.id === winnerRaceId)?.name[lang] || data.races.find(r => r.id === winnerRaceId)?.name['en'] || winnerRaceId;
    const winnerClass = data.classes.find(c => c.id === winnerClassId)?.name[lang] || data.classes.find(c => c.id === winnerClassId)?.name['en'] || winnerClassId;
    const winnerBg = data.backgrounds.find(b => b.id === winnerBgId)?.name[lang] || data.backgrounds.find(b => b.id === winnerBgId)?.name['en'] || winnerBgId;

    return (
        <div
            className="max-w-4xl mx-auto p-8 bg-gray-900/90 backdrop-blur-xl border border-red-900/40 rounded-3xl shadow-[0_0_80px_rgba(220,38,38,0.15)] animate-in fade-in zoom-in duration-700">
            <div className="text-center mb-12">
                <div
                    className="inline-block px-4 py-1 rounded-full bg-red-900/30 border border-red-700/50 text-red-400 text-sm font-bold uppercase tracking-widest mb-4">
                    {t('dnd_page.destiny_revealed')}
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                    {t('dnd_page.result_title')}
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    {label: t('dnd_page.race'), value: winnerRace, icon: '🧝‍♂️', color: 'from-amber-600/20'},
                    {label: t('dnd_page.class'), value: winnerClass, icon: '⚔️', color: 'from-red-600/20'},
                    {label: t('dnd_page.background'), value: winnerBg, icon: '📜', color: 'from-blue-600/20'}
                ].map((item, i) => (
                    <div key={i}
                         className={`relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br ${item.color} to-gray-800/40 border border-gray-700/50 flex flex-col items-center text-center group hover:border-red-500/50 transition-all duration-500`}>
                        <div
                            className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                        <div
                            className="text-red-500 font-mono text-xs uppercase tracking-[0.2em] mb-2">{item.label}</div>
                        <div
                            className="text-2xl md:text-3xl font-serif font-bold text-white group-hover:text-red-100 transition-colors">{item.value}</div>
                        <div
                            className="absolute -bottom-4 -right-4 text-white/5 text-6xl font-black italic select-none">
                            {item.label[0]}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={onRestart}
                    className="px-10 py-4 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95"
                >
                    {t('dnd_page.restart')}
                </button>
            </div>
        </div>
    );
};

export default DndResultScreen;
