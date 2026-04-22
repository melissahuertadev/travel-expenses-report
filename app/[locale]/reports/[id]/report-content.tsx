'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useExpenses, Expense } from '@/hooks/use-expenses'
import { tr } from 'date-fns/locale'

const CURRENCIES = ['USD', 'UYU', 'ARS', 'BRL', 'CLP', 'COP', 'MXN', 'EUR', 'PEN', 'BOB']
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  UYU: 0.025,
  ARS: 0.0087,
  BRL: 0.2,
  CLP: 0.0011,
  COP: 0.00025,
  MXN: 0.058,
  EUR: 1.1,
  PEN: 0.27,
  BOB: 0.145,
}

export function ReportContent() {
  const t = useTranslations()
  const params = useParams()
  const reportId = params.id as string
  const locale = params.locale as string
  const { getReport, addExpense, deleteExpense, calculateTotalSpent, isLoaded } = useExpenses()
  const [report, setReport] = useState<any>(null)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    concept: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: 'USD',
    exchangeRate: 1,
    includeInReport: true,
    receipt: '',
  })

  useEffect(() => {
    if (isLoaded) {
      const foundReport = getReport(reportId)
      setReport(foundReport)
    }
  }, [isLoaded, reportId, getReport])

  if (!isLoaded) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" />
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-12 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md border border-blue-200">
          <p className="text-blue-600 text-lg mb-4">Report not found</p>
          <Link href={`/${locale}/expenses`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t('report.back_to_reports')}</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.concept && formData.amount) {
      addExpense(reportId, {
        ...formData,
        amount: parseFloat(formData.amount as any),
        exchangeRate: parseFloat(formData.exchangeRate as any),
      })
      const updated = getReport(reportId)
      setReport(updated)
      setFormData({
        concept: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        currency: 'USD',
        exchangeRate: 1,
        includeInReport: true,
        receipt: '',
      })
      setShowExpenseForm(false)
    }
  }

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpense(reportId, expenseId)
    const updated = getReport(reportId)
    setReport(updated)
  }

  const handleCurrencyChange = (currency: string) => {
    setFormData({
      ...formData,
      currency,
      exchangeRate: EXCHANGE_RATES[currency] || 1,
    })
  }

  const totalSpent = calculateTotalSpent(report.expenses)
  const remaining = report.initialAmount - totalSpent

  const generatePDF = async () => {
    const element = document.getElementById('report-content')
    if (element) {
      // Dynamically import html2canvas and jsPDF to avoid SSR issues
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')
      
      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${report.name}.pdf`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${locale}/expenses`}>
            <Button variant="outline" className="border-blue-200 text-blue-700">
              ← {t('report.back_to_reports')}
            </Button>
          </Link>
          <Button
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t('report.generate_pdf')}
          </Button>
        </div>

        <div id="report-content" className="space-y-6">
          <Card className="p-8 border border-blue-200 rounded-xl">
            <h1 className="text-4xl font-bold text-blue-900 mb-6">{report.name}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-lg">
                <p className="text-blue-600 text-sm font-medium mb-1">{t('report.total_initial')}</p>
                <p className="text-3xl font-bold text-blue-900">${report.initialAmount.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-lg">
                <p className="text-red-600 text-sm font-medium mb-1">{t('report.total_spent')}</p>
                <p className="text-3xl font-bold text-red-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div className={`bg-gradient-to-br ${remaining >= 0 ? 'from-green-100 to-green-50' : 'from-orange-100 to-orange-50'} p-6 rounded-lg`}>
                <p className={`${remaining >= 0 ? 'text-green-600' : 'text-orange-600'} text-sm font-medium mb-1`}>
                  {t('report.remaining')}
                </p>
                <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-900' : 'text-orange-900'}`}>
                  ${remaining.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          {!showExpenseForm ? (
            <Button
              onClick={() => setShowExpenseForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              {t('report.add_expense')}
            </Button>
          ) : (
            <Card className="p-6 border border-blue-200 rounded-xl">
              <h2 className="text-xl font-bold text-blue-900 mb-4">{t('report.expense_form_title')}</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    {t('report.concept')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('report.concept_placeholder')}
                    value={formData.concept}
                    onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                    required
                    className="border-blue-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      {t('report.date')}
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      {t('report.amount')}
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      required
                      step="0.01"
                      min="0"
                      className="border-blue-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      {t('report.currency')}
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg text-blue-900"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      {t('report.exchange_rate')}
                    </label>
                    <Input
                      type="number"
                      placeholder="1.0"
                      value={formData.exchangeRate}
                      onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) })}
                      required
                      step="0.001"
                      min="0"
                      className="border-blue-200"
                    />
                  </div>

                  
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  >
                    {t('report.add_expense')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowExpenseForm(false)}
                    className="flex-1"
                  >
                    {t('report.cancel')}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {report.expenses.length === 0 ? (
            <Card className="p-12 text-center border border-blue-200 rounded-xl">
              <p className="text-blue-600 text-lg">No expenses yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {report.expenses.map((expense: Expense) => (
                <Card
                  key={expense.id}
                  className="p-4 border border-blue-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-lg">{expense.concept}</h4>
                      <p className="text-sm text-blue-600">
                        {new Date(expense.date).toLocaleDateString()} • {expense.currency}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-blue-600">{expense.amount.toFixed(2)} {expense.currency}</p>
                        <p className="font-semibold text-blue-900">
                          ${(expense.amount * expense.exchangeRate).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {t('report.delete_expense')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
