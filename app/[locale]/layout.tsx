import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n.config'
import Navigation from '@/components/navigation'
import { NextIntlClientProvider } from 'next-intl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'es' ? 'TravelTrack - Rastreador de Gastos' : 'TravelTrack - Expense Tracker',
    description: locale === 'es' 
      ? 'Rastrea tus gastos de viaje en múltiples monedas y genera reportes PDF detallados.'
      : 'Track your travel expenses across multiple currencies and generate detailed PDF reports.'
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Navigation locale={locale} />
        <main>{children}</main>
      </NextIntlClientProvider>
    </>
  )
}
