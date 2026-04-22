"use client"

import { useEffect, useState } from "react"
import { useExpenses } from "@/hooks/use-expenses"
import type { Report } from "@/hooks/use-expenses"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
export default function ReportsPage() {
  const { reports, isLoaded, calculateTotalSpent } = useExpenses()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Travel Expense Tracker
          </h1>
          <p className="text-blue-700 text-lg">
            Track your travel expenses across multiple currencies and generate detailed PDF reports.
          </p>
        </div>

        {/* Button */}
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg w-full sm:w-auto">
          Create New Report
        </Button>
        
        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report: Report) => (
            <Card key={report.id} className="p-6 border border-blue-200 rounded-xl hover:shadow-md transition">
              <div className="flex gap-12">
                <div>
                  <p className="text-blue-600">Initial Amount</p>
                  <p className="font-semibold text-blue-900">
                    ${report.initialAmount.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-blue-600">Created</p>
                  <p>{report.createdAt}</p>
                </div>

                <div>
                  <p className="text-blue-600">Spent</p>
                  <p>${calculateTotalSpent(report.expenses).toFixed(2)} expenses</p>
                </div>
              </div>

              <Link href={`/${report.locale}/reports/${report.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  View
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}