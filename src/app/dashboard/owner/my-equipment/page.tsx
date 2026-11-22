"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  Package,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  X,
  Save,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  Camera,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { uploadToImgBB } from "@/utils/uploadImage";

export default function MyEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    rentalPrice: "",
    rentalType: "Daily",
    availableQuantity: "1",
    condition: "Good",
    location: "",
    description: "",
    image: "",
  });
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchMyEquipment();
  }, []);

  const fetchMyEquipment = async () => {
    setLoading(true);
    try {
      const res = await api.get("/equipment/my-equipment");
      if (res.data?.success) {
        setEquipmentList(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch owner equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name || "",
      rentalPrice: item.rentalPrice?.toString() || "0",
      rentalType: item.rentalType || "Daily",
      availableQuantity: item.availableQuantity?.toString() || "1",
      condition: item.condition || "Good",
      location: item.location || "",
      description: item.description || "",
      image: item.image || "",
    });
  };

  // Handle Image Upload for Edit Modal
  const handleEditImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingEditImage(true);
      const url = await uploadToImgBB(file);
      setEditFormData((prev) => ({ ...prev, image: url }));

      toast.success("Photo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Could not upload image. You can also paste an image URL directly.");
    } finally {
      setUploadingEditImage(false);
    }
  };

  // Handle Edit Submit
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setUpdating(true);
    try {
      const res = await api.patch(`/equipment/${editingItem._id}`, {
        name: editFormData.name,
        rentalPrice: Number(editFormData.rentalPrice),
        rentalType: editFormData.rentalType,
        availableQuantity: Number(editFormData.availableQuantity),
        condition: editFormData.condition,
        location: editFormData.location,
        description: editFormData.description,
        image: editFormData.image,
      });

      if (res.data?.success) {
        setEquipmentList((prev) =>
          prev.map((eq) =>
            eq._id === editingItem._id
              ? {
                  ...eq,
                  name: editFormData.name,
                  rentalPrice: Number(editFormData.rentalPrice),
                  rentalType: editFormData.rentalType,
                  availableQuantity: Number(editFormData.availableQuantity),
                  condition: editFormData.condition,
                  location: editFormData.location,
                  description: editFormData.description,
                  image: editFormData.image,
                }
              : eq
          )
        );

        setEditingItem(null);
        toast.success("Equipment updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update item.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete Equipment
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Delete Equipment?",
      text: `Are you sure you want to remove "${name}" from your catalog? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete It",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/equipment/${id}`);
        if (res.data?.success) {
          setEquipmentList((prev) => prev.filter((item) => item._id !== id));
          toast.success("Equipment deleted successfully.");
        }
      } catch (err: any) {
        const hasOrders = err.response?.data?.hasOrders;
        const msg = err.response?.data?.message || err.message || "Failed to delete item.";

        if (hasOrders) {
          Swal.fire({
            icon: "warning",
            title: "Cannot Delete Equipment",
            html: `
              <p class="text-sm text-slate-700 dark:text-slate-300 font-medium mb-3">${msg}</p>
              <div class="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs rounded-xl border border-amber-200 dark:border-amber-800 text-left">
                <strong>Important:</strong> To safeguard booking and invoice histories, you must first delete or clear the associated customer orders before deleting this equipment listing.
              </div>
            `,
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Go to Rental Orders",
            cancelButtonText: "Cancel",
          }).then((modalRes) => {
            if (modalRes.isConfirmed) {
              window.location.href = "/dashboard/owner/rental-orders";
            }
          });
        } else {
          toast.error(msg);
        }
      }
    }
  };

  // Filter items
  const filteredList = equipmentList.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && item.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  // Calculate status counts
  const approvedCount = equipmentList.filter((i) => i.status === "Approved").length;
  const pendingCount = equipmentList.filter((i) => i.status === "Pending").length;
  const rejectedCount = equipmentList.filter((i) => i.status === "Rejected").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved & Live
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
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
            My Equipment Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your registered machinery, update rental rates, and track approval statuses.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Equipment</span>
        </Link>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Listings</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{equipmentList.length}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Approved & Live</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Under Review</p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Rejected</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{rejectedCount}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Items" },
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
            placeholder="Search equipment or location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Equipment Table */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading your inventory...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No equipment found</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "No items match your active filters."
              : "You haven't listed any equipment yet. Add your first item to start earning rental revenue!"}
          </p>
          <Link
            href="/dashboard/owner/add-equipment"
            className="inline-flex items-center gap-2 px-5 py-2.5 mt-5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Equipment Now</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">Equipment</th>
                  <th className="py-4 px-6">Rental Rate</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Actions</th>
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
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                          <span className="text-xs text-slate-400">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        ${item.rentalPrice}
                      </span>
                      <span className="text-xs text-slate-400"> / {item.rentalType?.toLowerCase()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                        {item.availableQuantity} units
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-xs text-slate-400 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View in marketplace */}
                        {item.status === "Approved" && (
                          <Link
                            href={`/equipment/${item._id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                            title="View in Marketplace"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition"
                          title="Edit Equipment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Delete Equipment"
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

      {/* Edit Equipment Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  Edit Equipment
                </h3>
                <p className="text-xs text-slate-400">Update rates, stock, and descriptions</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              {/* Equipment Photo / Media Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold uppercase tracking-wider text-slate-500">
                    Equipment Photo
                  </label>
                  {uploadingEditImage && (
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading photo...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Photo Thumbnail Preview */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 shrink-0 shadow-inner group">
                    <img
                      src={editFormData.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"}
                      alt="Equipment Preview"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80";
                      }}
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor="edit-equipment-image-file"
                      className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Upload new image"
                    >
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-bold">Change</span>
                    </label>
                  </div>

                  {/* Actions & URL Input */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="edit-equipment-image-file"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-xs transition"
                      >
                        {uploadingEditImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload New Photo</span>
                          </>
                        )}
                      </label>
                      <input
                        id="edit-equipment-image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageFileChange}
                        disabled={uploadingEditImage}
                        className="hidden"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="url"
                        value={editFormData.image}
                        onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                        placeholder="Or paste photo URL directly..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Rental Rate ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={editFormData.rentalPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, rentalPrice: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.availableQuantity}
                    onChange={(e) => setEditFormData({ ...editFormData, availableQuantity: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Rental Type
                  </label>
                  <select
                    value={editFormData.rentalType}
                    onChange={(e) => setEditFormData({ ...editFormData, rentalType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Condition
                  </label>
                  <select
                    value={editFormData.condition}
                    onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
