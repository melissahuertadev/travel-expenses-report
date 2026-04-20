import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n.config'

export default createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
})

export const config = {
  matcher: ['/', '/(en|es)/:path*']
}
