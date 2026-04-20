'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useExpenses } from '@/hooks/use-expenses'

const CURRENCIES = ['USD', 'UYU', 'ARS', 'BRL', 'CLP', 'COP', 'MXN', 'EUR']

export default function ExpensesPage() {
  const t = useTranslations()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const { reports, isLoaded, createReport } = useExpenses()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    initialAmount: '',
  })

  if (!isLoaded) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" />
  }

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.initialAmount) {
      const report = createReport(formData.name, parseFloat(formData.initialAmount))
      setFormData({ name: '', initialAmount: '' })
      setShowForm(false)
      router.push(`/${locale}/reports/${report.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            {t('landing.title')}
          </h1>
          <p className="text-blue-700 text-lg">
            {t('landing.subtitle')}
          </p>
        </div>

        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg mb-8 w-full sm:w-auto"
          >
            {t('landing.cta_new_report')}
          </Button>
        ) : (
          <Card className="p-8 mb-8 border border-blue-200 rounded-xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">{t('report.title')}</h2>
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  {t('report.name_label')}
                </label>
                <Input
                  type="text"
                  placeholder={t('report.name_placeholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  {t('report.initial_amount')}
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={formData.initialAmount}
                  onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                  required
                  step="0.01"
                  min="0"
                  className="border-blue-200"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  {t('report.create_button')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  {t('report.cancel')}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid gap-6">
          {reports.length === 0 ? (
            <Card className="p-12 text-center border border-blue-200 rounded-xl">
              <p className="text-blue-600 text-lg">{t('reports.no_reports')}</p>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="p-6 border border-blue-200 rounded-xl hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-blue-900 mb-3">{report.name}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600 mb-1">{t('reports.initial')}</p>
                        <p className="font-semibold text-blue-900">${report.initialAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-blue-600 mb-1">{t('reports.created')}</p>
                        <p className="font-semibold text-blue-900">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600 mb-1">{t('reports.spent')}</p>
                        <p className="font-semibold text-blue-900">${report.expenses.length} expenses</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/${locale}/reports/${report.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                      {t('reports.view')}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
