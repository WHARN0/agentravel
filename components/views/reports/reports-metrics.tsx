"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { useReportForm } from "@/hooks/useReportForm"

export function ReportsMetrics() {
  const { loading, reports } = useReportForm("Income")

  const totalRevenue = reports
    .filter(r => r.type === "Income")
    .reduce((sum, r) => sum + r.amount, 0)

  const revenueThisMonth = (() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return reports
      .filter(r => {
        if (r.type !== "Income") return false
        const date = objectIdToDate(r._id)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      .reduce((sum, r) => sum + r.amount, 0)
  })()

  const totalIncome = reports.filter(r => r.type === "Income").length
  const totalExpense = reports.filter(r => r.type === "Expense").length

  const formatCurrency = (amount: number) =>
    "Rp. " + amount.toLocaleString("id-ID")

  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="text-white" />,
    },
    {
      title: "Revenue This Month",
      value: formatCurrency(revenueThisMonth),
      icon: <CalendarDays className="text-white" />,
    },
    {
      title: "Income Transactions",
      value: totalIncome.toString(),
      icon: <TrendingUp className="text-white" />,
    },
    {
      title: "Expense Transactions",
      value: totalExpense.toString(),
      icon: <TrendingDown className="text-white" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map(m => (
        <Card key={m.title} className="bg-white rounded-2x2 shadow-md border-0">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">{m.title}</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? "..." : m.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-[#377dec]">{m.icon}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Fungsi bantu untuk konversi ObjectId ke Date
function objectIdToDate(objectId: string) {
  const timestampHex = objectId.substring(0, 8)
  const timestamp = parseInt(timestampHex, 16) * 1000
  return new Date(timestamp)
}
