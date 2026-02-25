import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Language = 'ID' | 'EN';

interface LanguageStore {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create(
    persist<LanguageStore>(
        (set) => ({
            language: 'ID',
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'app-language',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
