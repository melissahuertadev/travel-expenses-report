'use client'

import dynamic from 'next/dynamic'

const ReportContent = dynamic(() => import('./report-content').then(mod => ({ default: mod.ReportContent })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" />
})

export default function ReportPage() {
  return <ReportContent />
}
