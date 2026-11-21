"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
  MessageSquare,
  Package,
  User,
  Loader2,
  Filter,
} from "lucide-react";

export default function AdminReviewModerationPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reviews");
      if (res.data?.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // Moderate review status (Approved / Rejected)
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await api.patch(`/admin/reviews/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Review marked as ${newStatus}`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || err.message || "Failed to update review status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle active/inactive state
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setUpdatingId(id);
    try {
      const newActive = !currentActive;
      const res = await api.patch(`/admin/reviews/${id}/status`, { isActive: newActive });
      if (res.data?.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isActive: newActive } : r))
        );

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Review is now ${newActive ? "Active" : "Hidden"}`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Toggle Failed",
        text: err.response?.data?.message || err.message || "Failed to toggle review.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const equipName = r.equipmentName || "";
    const customerName = r.customerName || "";
    const customerEmail = r.customerEmail || "";
    const comment = r.comment || "";

    const matchesSearch =
      equipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && r.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const pendingCount = reviews.filter((r) => r.status === "Pending").length;
  const rejectedCount = reviews.filter((r) => r.status === "Rejected").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customer Review Moderation
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Moderate customer reviews, verify authentic testimonials, and toggle visibility on the public platform.
        </p>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reviews</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{reviews.length}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Approved Reviews</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Pending Review</p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Rejected</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{rejectedCount}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Reviews" },
            { id: "approved", label: "Approved" },
            { id: "pending", label: "Pending" },
            { id: "rejected", label: "Rejected" },
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
            placeholder="Search review comments or users..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No reviews found</h3>
          <p className="text-xs text-slate-400 mt-1">No reviews match your selected filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Reviewer</th>
                  <th className="py-4 px-6">Rating & Feedback</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Visibility</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredReviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.equipmentImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                          alt={r.equipmentName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{r.equipmentName}</p>
                          <span className="text-[11px] text-slate-400">{r.category || "Equipment"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">{r.customerName || "Customer"}</p>
                        <p className="text-slate-400 truncate max-w-[150px]">{r.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 max-w-sm">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                            {r.rating}.0
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                          "{r.comment}"
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(r.status)}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(r._id, r.isActive !== false)}
                        disabled={updatingId === r._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                          r.isActive !== false
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                        }`}
                      >
                        {r.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{r.isActive !== false ? "Visible" : "Hidden"}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.status !== "Approved" && (
                          <button
                            onClick={() => handleStatusUpdate(r._id, "Approved")}
                            disabled={updatingId === r._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {r.status !== "Rejected" && (
                          <button
                            onClick={() => handleStatusUpdate(r._id, "Rejected")}
                            disabled={updatingId === r._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
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
