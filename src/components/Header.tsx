import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const {t, i18n} = useTranslation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const closeMenu = () => setIsMenuOpen(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const activePage = location.pathname;

    return (
        <header
            className="w-full py-4 px-6 border-b border-gray-800/50 backdrop-blur-md bg-black/30 relative z-50">
            <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={closeMenu}
                >
                    <img src={`${import.meta.env.BASE_URL}logo.svg`} alt={t('header.logo_alt')}
                         className="h-10 w-auto md:h-12 transition-transform group-hover:scale-110"/>
                    <h1 className="text-xl md:text-3xl font-serif font-black tracking-[0.1em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [text-shadow:_1px_1px_0_rgb(0_0_0_/_40%)]">
                        Fantasy Decision
                    </h1>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="hidden md:flex items-center gap-2 mr-4 border-r border-gray-800/50 pr-4">
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`text-sm font-bold transition-colors ${i18n.language.startsWith('en') ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            EN
                        </button>
                        <span className="text-gray-700">|</span>
                        <button
                            onClick={() => changeLanguage('de')}
                            className={`text-sm font-bold transition-colors ${i18n.language.startsWith('de') ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            DE
                        </button>
                    </div>

                    {/* Burger Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-yellow-500 hover:text-yellow-400 focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between items-center">
                            <span
                                className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span
                                className={`block h-0.5 w-full bg-current transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span
                                className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div
                    className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border-b border-gray-800/50 animate-fadeInFast">
                    <nav className="max-w-7xl mx-auto flex flex-col p-4 gap-2">
                        <Link
                            to="/"
                            onClick={closeMenu}
                            className={`text-left px-4 py-3 rounded-md transition-colors ${activePage === '/' || activePage === '' ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                        >
                            {t('header.home')}
                        </Link>
                        <Link
                            to="adventure"
                            onClick={closeMenu}
                            className={`text-left px-4 py-3 rounded-md transition-colors ${activePage.includes('/adventure') ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                        >
                            {t('header.adventure')}
                        </Link>
                        <Link
                            to="dnd"
                            onClick={closeMenu}
                            className={`text-left px-4 py-3 rounded-md transition-colors ${activePage.includes('/dnd') ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                        >
                            {t('header.dnd')}
                        </Link>
                        {/* Mobile Language Switcher */}
                        <div className="flex md:hidden items-center gap-4 px-4 py-3 border-t border-gray-800/50 mt-2">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`text-sm font-bold transition-colors ${i18n.language.startsWith('en') ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                ENGLISH
                            </button>
                            <button
                                onClick={() => changeLanguage('de')}
                                className={`text-sm font-bold transition-colors ${i18n.language.startsWith('de') ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                DEUTSCH
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
