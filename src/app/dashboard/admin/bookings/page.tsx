"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  ClipboardList,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  User,
  Package,
  Receipt,
  ExternalLink,
  Filter,
  Trash2,
} from "lucide-react";

export default function AdminAllBookingsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAllRentals();
  }, []);

  const fetchAllRentals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/rentals");
      if (res.data?.success) {
        setRentals(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch all rentals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter rentals
  const filteredRentals = rentals.filter((r) => {
    const equipName = r.equipmentName || "";
    const customerName = r.customerInfo?.name || "";
    const customerEmail = r.customerInfo?.email || "";
    const ownerEmail = r.ownerEmail || "";
    const txn = r.transactionId || "";

    const matchesSearch =
      equipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && r.bookingStatus?.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalVolume = rentals.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const activeCount = rentals.filter((r) => r.bookingStatus === "Active" || r.bookingStatus === "Confirmed").length;
  const completedCount = rentals.filter((r) => r.bookingStatus === "Completed").length;

  // Handle Delete Order for Admin
  const handleDeleteOrder = async (orderId: string, equipmentName: string) => {
    const confirm = await Swal.fire({
      title: "Delete Rental Order?",
      text: `Are you sure you want to permanently delete this order for "${equipmentName}"? (All orders for an equipment must be deleted before deleting the equipment).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete Order",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.delete(`/bookings/${orderId}`);
        if (res.data?.success) {
          setRentals((prev) => prev.filter((r) => r._id !== orderId));
          toast.success("Rental order deleted.");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || "Failed to delete order.");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "active":
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "rejected":
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            {status?.toLowerCase() === "rejected" ? "Rejected" : "Cancelled"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All Platform Bookings & Rentals
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor all cross-platform equipment leases, Stripe transaction logs, and customer fulfillments.
        </p>
      </div>

      {/* KPI Highlight Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bookings</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{rentals.length}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">Active Leases</p>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{activeCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Completed Rentals</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">Gross Volume</p>
          <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">${totalVolume.toLocaleString()}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Bookings" },
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
            placeholder="Search equipment, client, txn..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bookings Master Table */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading master bookings...</p>
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No rental bookings found</h3>
          <p className="text-xs text-slate-400 mt-1">No transactions match your search or filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Owner</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Gross Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredRentals.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                          alt={r.equipmentName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{r.equipmentName}</p>
                          <span className="text-xs text-slate-400">Qty: {r.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">{r.customerInfo?.name || "Customer"}</p>
                        <p className="text-slate-400 truncate max-w-[150px]">{r.customerInfo?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate max-w-[150px] block">
                        {r.ownerEmail || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {r.startDate} → {r.endDate}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-extrabold text-sm ${r.paymentStatus?.toLowerCase().includes("refund") ? "text-slate-700 dark:text-slate-300 line-through" : "text-slate-900 dark:text-white"}`}>
                        ${r.totalAmount}
                      </span>
                      {r.paymentStatus?.toLowerCase().includes("refund") ? (
                        <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Refund Processing</p>
                      ) : (
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Paid (Stripe)</p>
                      )}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(r.bookingStatus)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                          {r.transactionId ? r.transactionId.slice(-10) : "txn_mock"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(r._id, r.equipmentName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition cursor-pointer"
                          title="Delete rental order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
