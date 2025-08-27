import {z} from 'zod';

export const enum SupportedLanguages {
  EN_US = 'en_US',
  VI_VN = 'vi_VN',
}

export const languageSchema = z.enum([
  SupportedLanguages.EN_US,
  SupportedLanguages.VI_VN,
]);

export type Language = z.infer<typeof languageSchema>;
