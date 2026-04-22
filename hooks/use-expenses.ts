'use client'

import { useState, useEffect } from 'react'

export interface Expense {
  id: string
  concept: string
  date: string
  amount: number
  currency: string
  exchangeRate: number
  includeInReport: boolean
  receipt?: string
}

export interface Report {
  id: string
  name: string
  initialAmount: number
  createdAt: string
  expenses: Expense[]
}

const STORAGE_KEY = 'travel-expense-reports'

export function useExpenses() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load reports from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setReports(JSON.parse(stored))
      } catch (error) {
        console.error('[v0] Failed to parse stored reports:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save reports to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
    }
  }, [reports, isLoaded])

  const createReport = (name: string, initialAmount: number): Report => {
    const newReport: Report = {
      id: Date.now().toString(),
      name,
      initialAmount,
      createdAt: new Date().toISOString(),
      expenses: [],
    }
    setReports([...reports, newReport])
    return newReport
  }

  const deleteReport = (reportId: string) => {
    setReports(reports.filter((r) => r.id !== reportId))
  }

  const addExpense = (reportId: string, expense: Omit<Expense, 'id'>) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              expenses: [
                ...report.expenses,
                { ...expense, id: Date.now().toString() },
              ],
            }
          : report
      )
    )
  }

  const deleteExpense = (reportId: string, expenseId: string) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              expenses: report.expenses.filter((e) => e.id !== expenseId),
            }
          : report
      )
    )
  }

  const getReport = (reportId: string) => {
    return reports.find((r) => r.id === reportId)
  }

  const calculateTotalSpent = (expenses: Expense[]) => {
    return expenses.reduce((sum, expense) => {
      return sum + expense.amount * expense.exchangeRate
    }, 0)
  }

  return {
    reports,
    isLoaded,
    createReport,
    deleteReport,
    addExpense,
    deleteExpense,
    getReport,
    calculateTotalSpent,
  }
}
