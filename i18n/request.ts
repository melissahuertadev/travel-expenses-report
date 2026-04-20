import { getRequestConfig } from 'next-intl/server'
import { routing } from '@/i18n.config'

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale || routing.defaultLocale
  return {
    locale: validLocale,
    messages: (
      await import(`@/messages/${validLocale}.json`)
    ).default,
  }
})
