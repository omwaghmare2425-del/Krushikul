import 'server-only';
import type { Locale } from '../../i18n-config';

const dictionaries = {
  en: () => import('@/lib/dictionaries/en.json').then((module) => module.default),
  hi: () => import('@/lib/dictionaries/hi.json').then((module) => module.default),
  mr: () => import('@/lib/dictionaries/mr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
