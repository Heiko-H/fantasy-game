import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import deYaml from './locales/de.yaml?raw';
import enYaml from './locales/en.yaml?raw';
import yaml from 'js-yaml';

const resources = {
    de: {
        translation: yaml.load(deYaml)
    },
    en: {
        translation: yaml.load(enYaml)
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;
