import {SupportedLanguages} from '@src/hooks/language/useI18n';
import {zustandStorage} from '@src/untils/storage/zustandStorage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

interface LanguageStore {
  activeLanguage: string;
}
export const useLanguageStore = create<LanguageStore>()(
  persist(
    set => ({
      activeLanguage: SupportedLanguages.EN_US,
      updateActiveLanguage: (language: string) =>
        set({activeLanguage: language}),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
