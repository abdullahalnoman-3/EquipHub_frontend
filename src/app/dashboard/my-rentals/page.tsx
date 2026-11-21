"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import ReviewModal from "@/components/reviews/ReviewModal";
import {
  CalendarCheck,
  Search,
  ExternalLink,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Package,
  Calendar,
  MapPin,
  X,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function MyRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [reviewItem, setReviewItem] = useState<any | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/my-rentals");
      if (res.data?.success) {
        setRentals(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch customer rentals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter rentals based on search and status tab
  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      (rental.equipmentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rental.transactionId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rental.category || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && rental.bookingStatus?.toLowerCase() === statusFilter.toLowerCase();
  });

  // Calculate summary metrics
  const totalSpent = rentals.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const activeCount = rentals.filter(
    (r) => r.bookingStatus === "Active" || r.bookingStatus === "Confirmed"
  ).length;
  const completedCount = rentals.filter((r) => r.bookingStatus === "Completed").length;

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            {status || "Pending"}
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    if (status?.toLowerCase() === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Rental History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your equipment reservations, rental durations, and download invoices.
          </p>
        </div>
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition self-start md:self-auto"
        >
          <Package className="w-4 h-4" />
          <span>Rent More Equipment</span>
        </Link>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bookings</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{rentals.length}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Rentals</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Expenditure</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">${totalSpent.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Rentals" },
            { id: "active", label: "Active" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search equipment or txn..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Rentals Table / Card Content */}
      {loading ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading your rentals...</p>
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No rentals found</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "No booking records match your filter criteria."
              : "You haven't rented any equipment yet. Explore our verified listings to get started!"}
          </p>
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 px-5 py-2.5 mt-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <span>Browse Available Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Rental Period</th>
                  <th className="py-4 px-6">Quantity & Total</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredRentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={rental.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                          alt={rental.equipmentName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <Link
                            href={`/equipment/${rental.equipmentId}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                          >
                            {rental.equipmentName}
                          </Link>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {rental.category || "General Equipment"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {rental.startDate} → {rental.endDate}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Booked on: {new Date(rental.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          ${rental.totalAmount}
                        </span>
                        <p className="text-[11px] text-slate-400">Qty: {rental.quantity}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getPaymentBadge(rental.paymentStatus)}</td>
                    <td className="py-4 px-6">{getStatusBadge(rental.bookingStatus)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setReviewItem(rental)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 transition"
                          title="Write Review"
                        >
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(rental)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRentals.map((rental) => (
              <div key={rental._id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rental.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                    alt={rental.equipmentName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/equipment/${rental.equipmentId}`}
                      className="font-bold text-slate-900 dark:text-white truncate block hover:text-blue-600"
                    >
                      {rental.equipmentName}
                    </Link>
                    <p className="text-xs text-slate-400">{rental.category}</p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                      ${rental.totalAmount} (Qty: {rental.quantity})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{rental.startDate} → {rental.endDate}</span>
                  <div>{getStatusBadge(rental.bookingStatus)}</div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div>{getPaymentBadge(rental.paymentStatus)}</div>
                  <button
                    onClick={() => setSelectedInvoice(rental)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  E
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Rental Invoice Receipt
                  </h3>
                  <p className="text-[11px] text-slate-400">EquipHub Smart Rental Service</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Transaction ID</p>
                  <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                    {selectedInvoice.transactionId || "txn_offline_manual"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Booking ID</p>
                  <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                    {selectedInvoice._id}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Equipment Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedInvoice.equipmentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Rental Duration</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedInvoice.startDate} to {selectedInvoice.endDate}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Quantity</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedInvoice.quantity} Units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Delivery Address</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right max-w-xs truncate">
                    {selectedInvoice.customerInfo?.deliveryAddress || "Standard Hub Pickup"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedInvoice.customerInfo?.contactNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold pt-3">
                  <span className="text-slate-900 dark:text-white">Total Amount Paid</span>
                  <span className="text-blue-600 dark:text-blue-400 text-base">${selectedInvoice.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal (Step 24) */}
      {reviewItem && (
        <ReviewModal
          isOpen={!!reviewItem}
          onClose={() => setReviewItem(null)}
          equipmentId={reviewItem.equipmentId}
          equipmentName={reviewItem.equipmentName}
        />
      )}
    </div>
  );
}
