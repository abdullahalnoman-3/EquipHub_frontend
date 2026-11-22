"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Package,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  MapPin,
  DollarSign,
  Loader2,
  User,
  Filter,
} from "lucide-react";

export default function AdminEquipmentModerationPage() {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/equipment");
      if (res.data?.success) {
        setEquipmentList(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin equipment list:", err);
    } finally {
      setLoading(false);
    }
  };

  // Moderate equipment status (Approved, Rejected, Pending)
  const handleStatusUpdate = async (id: string, name: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const res = await api.patch(`/admin/equipment/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        setEquipmentList((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );

        toast.success(`"${name}" marked as ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update equipment status.");
    } finally {
      setProcessingId(null);
    }
  };

  // Delete equipment as admin
  const handleDelete = async (id: string, name: string) => {
    const confirm = await Swal.fire({
      title: "Delete Equipment Listing?",
      text: `Are you sure you want to permanently remove "${name}" from the system?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete It",
    });

    if (!confirm.isConfirmed) return;

    setProcessingId(id);
    try {
      const res = await api.delete(`/admin/equipment/${id}`);
      if (res.data?.success) {
        setEquipmentList((prev) => prev.filter((item) => item._id !== id));
        toast.success("Equipment removed successfully.");
      }
    } catch (err: any) {
      const hasOrders = err.response?.data?.hasOrders;
      const msg = err.response?.data?.message || err.message || "Failed to delete equipment.";

      if (hasOrders) {
        Swal.fire({
          icon: "warning",
          title: "Cannot Delete Equipment",
          html: `
            <p class="text-sm text-slate-700 dark:text-slate-300 font-medium mb-3">${msg}</p>
            <div class="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs rounded-xl border border-amber-200 dark:border-amber-800 text-left">
              <strong>Order Dependency:</strong> All rental orders linked to this equipment must be deleted first before deleting this equipment listing.
            </div>
          `,
          showCancelButton: true,
          confirmButtonColor: "#2563eb",
          cancelButtonColor: "#64748b",
          confirmButtonText: "Go to Bookings",
          cancelButtonText: "Cancel",
        }).then((modalRes) => {
          if (modalRes.isConfirmed) {
            window.location.href = "/dashboard/admin/bookings";
          }
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Filter list
  const filteredList = equipmentList.filter((item) => {
    const name = item.name || "";
    const category = item.category || "";
    const ownerEmail = item.owner?.email || "";
    const ownerName = item.owner?.name || "";
    const location = item.location || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && item.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const pendingCount = equipmentList.filter((i) => i.status === "Pending").length;
  const approvedCount = equipmentList.filter((i) => i.status === "Approved").length;
  const rejectedCount = equipmentList.filter((i) => i.status === "Rejected").length;

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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
          Equipment Moderation & Approval
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review newly submitted listings from equipment owners and approve or reject them.
        </p>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Listings</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{equipmentList.length}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Pending Review</p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Approved & Live</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Rejected Items</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{rejectedCount}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Items" },
            { id: "pending", label: "Pending Review" },
            { id: "approved", label: "Approved" },
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
            placeholder="Search equipment or owner..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Equipment Moderation Table */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading equipment...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No equipment found</h3>
          <p className="text-xs text-slate-400 mt-1">No equipment listings match your filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Owner</th>
                  <th className="py-4 px-6">Rate & Stock</th>
                  <th className="py-4 px-6">Moderation Status</th>
                  <th className="py-4 px-6 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80";
                          }}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                          <span className="text-xs text-slate-400">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white">{item.owner?.name || "Owner"}</p>
                        <p className="text-slate-400">{item.owner?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          ${item.rentalPrice}
                        </span>
                        <span className="text-slate-400"> / {item.rentalType?.toLowerCase()}</span>
                        <p className="text-slate-500 mt-0.5">{item.availableQuantity} in stock</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <Link
                          href={`/equipment/${item._id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Approve Button */}
                        {item.status !== "Approved" && (
                          <button
                            onClick={() => handleStatusUpdate(item._id, item.name, "Approved")}
                            disabled={processingId === item._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition"
                            title="Approve Equipment"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Reject Button */}
                        {item.status !== "Rejected" && (
                          <button
                            onClick={() => handleStatusUpdate(item._id, item.name, "Rejected")}
                            disabled={processingId === item._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 transition"
                            title="Reject Equipment"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          disabled={processingId === item._id}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Delete Listing"
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
