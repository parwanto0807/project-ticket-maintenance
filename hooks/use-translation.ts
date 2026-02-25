"use client";

import { useLanguageStore } from './use-language-store';
import { translations, TranslationKeys } from '@/lib/translations';

export const useTranslation = () => {
    const { language } = useLanguageStore();

    const t = (key: TranslationKeys) => {
        return translations[language][key] || key;
    };

    return { t, language };
};
