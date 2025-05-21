
"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Settings2Icon, Plus } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

import { Select } from "@/components/ui/select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ----------------------------------
// Tipe data sesuai tabel History
// ----------------------------------

type History = {
  _id: string
  reference_id: string
  reference_type: "Reservation" | "Invoice"
  date: Date
  description: string
  actor: "Finance Admin" | "Travel Admin"
}

export function HistoryTable() {
  const [histories, setHistories] = useState<History[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const isMobile = useIsMobile()

  // -----------------------------
  // Ambil data history dari API
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch("/api/log-transaksi")
        const json = await res.json()
        if (json.status === "berhasil") {
          setHistories(json.data)
        } else {
          console.error("Failed to fetch:", json)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // -----------------------------
  // Filter & Pencarian
  // -----------------------------
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return histories.filter((h) => {
      const refId = String(h.reference_id).toLowerCase();   // ← konversi aman
      const matchesSearch =
        refId.includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.actor.toLowerCase().includes(q);

      const matchesType = typeFilter === "all" || h.reference_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [histories, searchQuery, typeFilter]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-sm text-gray-500 mb-2 sm:mb-0">
          {histories.length} History
        </h3>
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative inline-block">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reference, description, actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-fit"
            />
          </div>
          {/* Filter by type */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10 rounded-md border border-input border-gray-300 bg-background px-3 py-2 flex items-center space-x-2" aria-label="Filter type">
              <Settings2Icon className="h-5 w-5 grayscale-50" />
              <span>Filter</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Type</SelectItem>
              <SelectItem value="Reservation">Reservation</SelectItem>
              <SelectItem value="Invoice">Invoice</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#E7E7E7] text-[#888888] rounded-t-xl">
            <TableRow>
              <TableHead>No. History</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length ? (
              filtered.map((h) => (
                <TableRow key={h._id} className="hover:bg-gray-50">
                  <TableCell>{h.reference_id}</TableCell>
                  <TableCell>{h.reference_type}</TableCell>
                  <TableCell>{new Date(h.date).toLocaleDateString()}</TableCell>
                  <TableCell>{h.description}</TableCell>
                  <TableCell>{h.actor}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
