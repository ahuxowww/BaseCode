import 'intl-pluralrules';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './en.json';
import vi from './vi.json';
import {Language} from '@src/hooks/language/useI18n';
import {useLanguageStore} from '@src/store/languageStore';

export const defaultNS = 'odoo_rn_app' as const;

export const resources = {
  en_US: en,
  vi_VN: vi,
} as const satisfies Record<Language, unknown>;

export const initI18n = async () => {
  // Get current language from Zustand store
  const language = useLanguageStore.getState().activeLanguage;

  await i18n.use(initReactI18next).init({
    defaultNS,
    fallbackLng: 'en_US',
    lng: language,
    resources,
  });

  // Add custom formatter
  i18n.services.formatter?.add(
    'capitalize',
    (value: string) =>
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  );

  return i18n;
};

export default i18n;
