"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  FolderKanban,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Package,
  Loader2,
  ArrowRight,
  Filter,
  Play,
  Trash2,
} from "lucide-react";

export default function OwnerRentalOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/owner-rentals");
      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch owner rental orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status (Pending, Approved, Active, Completed, Rejected, Cancelled)
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await api.patch(`/bookings/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, bookingStatus: newStatus } : order
          )
        );

        toast.success(`Order marked as ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Reject / Cancel Order with confirmation modal
  const handleRejectOrder = async (orderId: string, equipmentName: string, isCancel: boolean = false) => {
    const actionName = isCancel ? "Cancel" : "Reject";
    const targetStatus = isCancel ? "Cancelled" : "Rejected";

    const confirm = await Swal.fire({
      title: `${actionName} Rental Order?`,
      text: `Are you sure you want to ${actionName.toLowerCase()} this rental for "${equipmentName}"? The reserved inventory will be released and returned to available stock.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionName} Order`,
    });

    if (confirm.isConfirmed) {
      await handleStatusChange(orderId, targetStatus);
    }
  };

  // Handle Delete Order with confirmation modal
  const handleDeleteOrder = async (orderId: string, equipmentName: string) => {
    const confirm = await Swal.fire({
      title: "Delete Rental Order?",
      text: `Are you sure you want to delete this order for "${equipmentName}"? This record will be permanently deleted. (Note: All associated orders must be deleted before deleting equipment).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete Order",
    });

    if (confirm.isConfirmed) {
      setUpdatingId(orderId);
      try {
        const res = await api.delete(`/bookings/${orderId}`);
        if (res.data?.success) {
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
          toast.success("Rental order deleted successfully.");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || "Failed to delete order.");
      } finally {
        setUpdatingId(null);
      }
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const equipName = order.equipmentName || "";
    const customerName = order.customerInfo?.name || "";
    const customerEmail = order.customerInfo?.email || "";
    const txnId = order.transactionId || "";

    const matchesSearch =
      equipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txnId.toLowerCase().includes(searchTerm.toLowerCase());

    const bStatus = order.bookingStatus?.toLowerCase();

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "pending") return matchesSearch && bStatus === "pending";
    if (statusFilter === "approved") return matchesSearch && bStatus === "approved";
    if (statusFilter === "active") return matchesSearch && bStatus === "active";
    if (statusFilter === "completed") return matchesSearch && bStatus === "completed";
    if (statusFilter === "cancelled") {
      return matchesSearch && (bStatus === "cancelled" || bStatus === "rejected");
    }
    return matchesSearch && bStatus === statusFilter.toLowerCase();
  });

  // Calculate counts
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrders = orders.filter((o) => o.bookingStatus?.toLowerCase() === "pending").length;
  const approvedOrders = orders.filter((o) => o.bookingStatus?.toLowerCase() === "approved").length;
  const activeOrders = orders.filter((o) => o.bookingStatus?.toLowerCase() === "active").length;
  const completedOrders = orders.filter((o) => o.bookingStatus?.toLowerCase() === "completed").length;
  const cancelledOrders = orders.filter(
    (o) => o.bookingStatus?.toLowerCase() === "cancelled" || o.bookingStatus?.toLowerCase() === "rejected"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Pending Approval
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Active Lease
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "rejected":
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            {status?.toLowerCase() === "rejected" ? "Rejected" : "Cancelled"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Rental Orders
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track client reservations, customer delivery details, and manage fulfillment status.
          </p>
        </div>
      </div>

      {/* Metrics Counter Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{orders.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pending</p>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingOrders}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Approved</p>
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{approvedOrders}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Leases</p>
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{activeOrders}</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Earnings</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">${totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "pending", label: "Pending", count: pendingOrders },
            { id: "approved", label: "Approved", count: approvedOrders },
            { id: "active", label: "Active", count: activeOrders },
            { id: "completed", label: "Completed", count: completedOrders },
            { id: "cancelled", label: "Cancelled", count: cancelledOrders },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === "pending" && pendingOrders > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
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
            placeholder="Search equipment or client..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading rental orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No rental orders found</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "No orders match your filter criteria."
              : "When customers book your machinery, orders will automatically show up here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Rental Duration</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions / Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredOrders.map((order) => {
                  const bStatus = order.bookingStatus?.toLowerCase();
                  return (
                    <tr key={order._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                            alt={order.equipmentName}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80";
                            }}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{order.equipmentName}</p>
                            <span className="text-xs text-slate-400">Qty: {order.quantity} Units</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {order.customerInfo?.name || "Customer"}
                          </p>
                          <p className="text-slate-400">{order.customerInfo?.email}</p>
                          {order.customerInfo?.contactNumber && (
                            <p className="text-slate-400">{order.customerInfo.contactNumber}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.startDate} → {order.endDate}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Booked: {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className={`font-extrabold text-base ${order.paymentStatus?.toLowerCase().includes("refund") ? "text-slate-700 dark:text-slate-300 line-through" : "text-slate-900 dark:text-white"}`}>
                            ${order.totalAmount}
                          </span>
                          {order.paymentStatus?.toLowerCase().includes("refund") ? (
                            <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                              <span>●</span> Refund Processing
                            </p>
                          ) : (
                            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Paid via Stripe</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(order.bookingStatus)}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1. Pending: Can Approve or Reject */}
                          {bStatus === "pending" && (
                            <>
                              <button
                                type="button"
                                disabled={updatingId === order._id}
                                onClick={() => handleStatusChange(order._id, "Approved")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition disabled:opacity-50 cursor-pointer"
                                title="Approve this rental reservation"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                disabled={updatingId === order._id}
                                onClick={() => handleRejectOrder(order._id, order.equipmentName, false)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition disabled:opacity-50 cursor-pointer"
                                title="Reject this rental reservation"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {/* 2. Approved: Can Start Rental (Active) OR can still Cancel */}
                          {bStatus === "approved" && (
                            <>
                              <button
                                type="button"
                                disabled={updatingId === order._id}
                                onClick={() => handleStatusChange(order._id, "Active")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition disabled:opacity-50 cursor-pointer"
                                title="Mark as Active Lease (Handover machine to customer)"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Start Lease</span>
                              </button>
                              <button
                                type="button"
                                disabled={updatingId === order._id}
                                onClick={() => handleRejectOrder(order._id, order.equipmentName, true)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 transition disabled:opacity-50 cursor-pointer"
                                title="Cancel approved order (Returns stock to inventory)"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}

                          {/* 3. Active: Rental in progress. CANNOT be cancelled! Only Completed */}
                          {bStatus === "active" && (
                            <button
                              type="button"
                              disabled={updatingId === order._id}
                              onClick={() => handleStatusChange(order._id, "Completed")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 transition disabled:opacity-50 cursor-pointer"
                              title="Mark rental completed upon return"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Completed</span>
                            </button>
                          )}

                          {/* Status Select dropdown */}
                          <div className="inline-flex items-center gap-1">
                            <select
                              value={order.bookingStatus || "Pending"}
                              disabled={updatingId === order._id}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Active">Active</option>
                              <option value="Completed">Completed</option>
                              <option value="Rejected" disabled={bStatus === "active"}>
                                {bStatus === "active" ? "Rejected (Locked)" : "Rejected"}
                              </option>
                              <option value="Cancelled" disabled={bStatus === "active"}>
                                {bStatus === "active" ? "Cancelled (Locked)" : "Cancelled"}
                              </option>
                            </select>
                            {updatingId === order._id && (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                            )}
                          </div>

                          {/* 4. Delete Order Button */}
                          <button
                            type="button"
                            disabled={updatingId === order._id}
                            onClick={() => handleDeleteOrder(order._id, order.equipmentName)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition cursor-pointer"
                            title="Delete this rental order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredOrders.map((order) => {
              const bStatus = order.bookingStatus?.toLowerCase();
              return (
                <div key={order._id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                      alt={order.equipmentName}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80";
                      }}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{order.equipmentName}</p>
                      <p className="text-xs text-slate-400">
                        Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{order.customerInfo?.name}</span>
                      </p>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                        ${order.totalAmount} ({order.quantity} Units)
                      </p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                    <p className="text-slate-500">
                      <span className="font-semibold">Duration:</span> {order.startDate} to {order.endDate}
                    </p>
                    {order.customerInfo?.contactNumber && (
                      <p className="text-slate-500">
                        <span className="font-semibold">Contact:</span> {order.customerInfo.contactNumber}
                      </p>
                    )}
                    {order.customerInfo?.deliveryAddress && (
                      <p className="text-slate-500 truncate">
                        <span className="font-semibold">Address:</span> {order.customerInfo.deliveryAddress}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div>{getStatusBadge(order.bookingStatus)}</div>

                    <div className="flex items-center gap-1.5">
                      {/* Pending actions */}
                      {bStatus === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={updatingId === order._id}
                            onClick={() => handleStatusChange(order._id, "Approved")}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === order._id}
                            onClick={() => handleRejectOrder(order._id, order.equipmentName, false)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Approved actions */}
                      {bStatus === "approved" && (
                        <>
                          <button
                            type="button"
                            disabled={updatingId === order._id}
                            onClick={() => handleStatusChange(order._id, "Active")}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
                          >
                            Start Lease
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === order._id}
                            onClick={() => handleRejectOrder(order._id, order.equipmentName, true)}
                            className="px-2 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* Active actions */}
                      {bStatus === "active" && (
                        <button
                          type="button"
                          disabled={updatingId === order._id}
                          onClick={() => handleStatusChange(order._id, "Completed")}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 transition"
                        >
                          Complete
                        </button>
                      )}

                      {/* Manual select */}
                      <select
                        value={order.bookingStatus || "Pending"}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected" disabled={bStatus === "active"}>
                          {bStatus === "active" ? "Rejected (Locked)" : "Rejected"}
                        </option>
                        <option value="Cancelled" disabled={bStatus === "active"}>
                          {bStatus === "active" ? "Cancelled (Locked)" : "Cancelled"}
                        </option>
                      </select>

                      {/* Delete */}
                      <button
                        type="button"
                        disabled={updatingId === order._id}
                        onClick={() => handleDeleteOrder(order._id, order.equipmentName)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
