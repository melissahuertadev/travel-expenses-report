export const routing = {
  locales: ['en', 'es'],
  defaultLocale: 'en',
} as const

export type Locale = (typeof routing.locales)[number]
