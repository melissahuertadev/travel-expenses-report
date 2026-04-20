'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            {t('landing.title')}
          </h1>
          <p className="text-lg md:text-xl text-blue-700 mb-12 leading-relaxed">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/expenses`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg w-full sm:w-auto">
                {t('landing.cta_new_report')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
            {t('landing.features_title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 rounded-2xl border border-blue-200 bg-white hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">💱</div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{t('landing.feature_1')}</h3>
              <p className="text-blue-700 text-sm">{t('landing.feature_1_desc')}</p>
            </Card>
            <Card className="p-6 rounded-2xl border border-blue-200 bg-white hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">📸</div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{t('landing.feature_2')}</h3>
              <p className="text-blue-700 text-sm">{t('landing.feature_2_desc')}</p>
            </Card>
            <Card className="p-6 rounded-2xl border border-blue-200 bg-white hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">📄</div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{t('landing.feature_3')}</h3>
              <p className="text-blue-700 text-sm">{t('landing.feature_3_desc')}</p>
            </Card>
            <Card className="p-6 rounded-2xl border border-blue-200 bg-white hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-2xl">⚡</div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">{t('landing.feature_4')}</h3>
              <p className="text-blue-700 text-sm">{t('landing.feature_4_desc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Ready to track your travels?</h2>
          <p className="text-blue-700 mb-8 text-lg">Start managing your expenses in multiple currencies today.</p>
          <Link href={`/${locale}/expenses`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg rounded-lg">
              {t('landing.cta_new_report')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
