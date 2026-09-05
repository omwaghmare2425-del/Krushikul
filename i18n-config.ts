export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'hi', 'mr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
