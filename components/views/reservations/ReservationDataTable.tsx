"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Settings2Icon, BaggageClaim } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ShowButton, UpdateButton } from "@/components/ui/btn-action";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReservationForm } from "@/hooks/useReservationForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStatusClasses, STATUS_BASE_CLASSES } from "@/components/ui/status-badge";
import { DeleteReservation } from "@/components/views/reservations/DeleteReservation";

export default function ReservationDataTable() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const {
    loading,
    data: filtered,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    rawList: reservations,
  } = useReservationForm();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <BaggageClaim className="h-6 w-6 text-blue-600" />
            <h3 className="text-sm text-gray-500">
                {reservations.length} Flight Reservations
            </h3>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, destination, carrier..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-10 w-full"
            />
          </div>
          {/* Filter berdasarkan Status Reservasi */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 rounded-md px-3 py-2 flex items-center space-x-2" aria-label="Filter status">
                <Settings2Icon className="h-5 w-5 text-gray-400" />
                { !isMobile && <span className="text-gray-400">Filter</span> }
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Add Reservasi */}
          <div>
            <Link href="/dashboard/reservations/add">
              <Button className="h-10 text-white bg-[#377dec] hover:bg-[#2e61b5] flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                { !isMobile && <span>Add Reservation</span> }
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full rounded-lg bg-white overflow-hidden">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Ticket ID</th>
              <th className="px-4 py-2 text-left">Customer Name</th>
              <th className="px-4 py-3 text-left">Destination</th>
              <th className="px-4 py-3 text-left">Carrier</th>
              <th className="px-4 py-3 text-left">Transport</th>
              <th className="px-4 py-3 text-left">Departure Date</th>
              <th className="px-4 py-3 text-left">Total Price</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center">
                  Loading data, please wait...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-center">
                  No reservation data found that matches your criteria.
                  </td>
                </tr>
            ) : (
              filtered.map((resv) => (
                <tr key={resv._id} className="hover:bg-gray-50 ">
                  <td className="px-4 py-2 text-gray-700">{resv.ticket_id}</td>
                  <td className="px-4 py-2 text-gray-700">{resv.name}</td>
                  <td className="px-4 py-2 text-gray-700">{resv.destination}</td>
                  <td className="px-4 py-2 text-gray-700">{resv.carrier_name}</td>
                  <td className="px-4 py-2 text-gray-700">{resv.transport_type}</td>
                  <td className="px-4 py-2 text-gray-700">{new Date(resv.departure_date).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-2 text-gray-700 font-semibold">Rp {resv.total_price.toLocaleString('id-ID')}</td>
                  {/* <td className="px-4 py-2">Rp {resv.estimated_budget.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2">Rp {resv.total_price.toLocaleString('id-ID')}</td> */}
                  <td className="px-4 py-2">
                    <span
                      className={`${STATUS_BASE_CLASSES} ${getStatusClasses(
                        resv.status
                      )}`}
                    >
                      {resv.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-row gap-2">
                      <ShowButton
                        onClick={() => 
                          router.push(`/dashboard/reservations/${resv._id}?view=flight`)} 
                      />
                      <UpdateButton
                        onClick={() =>
                          router.push(`/dashboard/reservations/${resv._id}/update`)
                        }
                      />
                      <DeleteReservation 
                        id={resv._id || ''}
                        onSuccess={() => router.refresh()}
                      />
                    </div>
                  </td>
                </tr>
              ))                        
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}