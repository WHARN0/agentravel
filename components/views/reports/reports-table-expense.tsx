"use client"

import Link from "next/link"
import { Plus, Search, Settings2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useReportForm } from "@/hooks/useReportForm"

export function ReportsTableExpense() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    amountRange,
    setAmountRange,
    filteredReports
  } = useReportForm("Expense")

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Expense Reports</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-sm text-gray-500 mb-2 sm:mb-0">
          {filteredReports.length} Expense Reports
        </h3>
        <div className="flex items-center space-x-2">
          <div className="relative inline-block">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-30"
            />
          </div>
          <Select value={amountRange} onValueChange={setAmountRange}>
            <SelectTrigger className="h-10 border border-gray-300 px-3 py-2 flex items-center space-x-2">
              <Settings2Icon className="h-5 w-5 grayscale-50" />
              <span>Filter</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="lt1jt">Less than Rp1.000.000</SelectItem>
              <SelectItem value="1to5jt">Rp1.000.000 – Rp5.000.000</SelectItem>
              <SelectItem value="gt5jt">More than Rp5.000.000</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/dashboard/reports/add">
            <Button className="h-10 text-white bg-[#377dec] hover:bg-[#2e61b5] flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#E7E7E7] text-[#888888] rounded-t-xl">
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredReports.length ? (
              filteredReports.map(r => (
                <TableRow key={r._id}>
                  <TableCell>Rp{r.amount.toLocaleString("id-ID")}</TableCell>
                  <TableCell>{r.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">No expense reports found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}