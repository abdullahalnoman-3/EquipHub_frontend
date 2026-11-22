"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { uploadToImgBB } from "@/utils/uploadImage";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  Package,
  UploadCloud,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Eye,
  Trash2,
} from "lucide-react";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];
const CONDITIONS = ["New", "Good", "Fair"];

export default function AddEquipmentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    brand: "",
    model: "",
    condition: "Good",
    rentalPrice: "",
    rentalType: "Daily",
    availableQuantity: "1",
    location: "",
    description: "",
    terms: "Security deposit required upon delivery. Return in same condition.",
    image: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload handler via ImgBB
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadToImgBB(file);
      setFormData((prev) => ({ ...prev, image: url }));
      setImagePreview(url);

      toast.success("Photo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Could not upload image. You can also paste an image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error("Please provide equipment name, description, and location.");
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Please upload an equipment photo or provide an image URL.");
      return;
    }

    if (Number(formData.rentalPrice) <= 0 || Number(formData.availableQuantity) <= 0) {
      toast.error("Rental price and quantity must be positive numbers greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        condition: formData.condition,
        rentalPrice: Number(formData.rentalPrice),
        rentalType: formData.rentalType,
        availableQuantity: Number(formData.availableQuantity),
        location: formData.location.trim(),
        terms: formData.terms.trim(),
        image: formData.image.trim(),
      };

      const res = await api.post("/equipment", payload);

      if (res.data?.success) {
        toast.success("Equipment submitted! It will appear on the catalog once approved.");
        router.push("/dashboard/owner/my-equipment");
      } else {
        throw new Error(res.data?.message || "Failed to add equipment");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to create equipment listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Add New Equipment
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            List your tools, vehicles, and machinery for high-yield verified rentals.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container (2 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Section 1: General Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              General Equipment Specifications
            </h3>

            {/* Equipment Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Equipment Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Caterpillar 320 Hydraulic Excavator"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Machine Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond} Condition
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brand & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Caterpillar, Sony, DeWalt"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Model / Series
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. CAT-320D"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe key features, technical capabilities, fuel requirements, operating instructions, and included accessories..."
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
              />
            </div>
          </div>

          {/* Section 2: Pricing, Stock & Location */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Rental Rates & Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Rental Price (USD $) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    name="rentalPrice"
                    min="1"
                    step="any"
                    value={formData.rentalPrice}
                    onChange={handleChange}
                    required
                    placeholder="120"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Rental Rate Type
                </label>
                <select
                  name="rentalType"
                  value={formData.rentalType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  {RENTAL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      Per {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Available Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="availableQuantity"
                  min="1"
                  value={formData.availableQuantity}
                  onChange={handleChange}
                  required
                  placeholder="1"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Physical Hub / Depot Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tejgaon Industrial Area, Dhaka"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Image Upload & Link */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              Equipment Photography & Media
            </h3>

            {/* ImgBB Upload Box */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Upload image directly to ImgBB
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG or WEBP (Max 10MB)
              </p>

              <label
                htmlFor="equipment-img-file"
                className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-sm transition"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading Image...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Choose File from Computer</span>
                  </>
                )}
                <input
                  id="equipment-img-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct Image URL Alternative */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Or Direct Image URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={(e) => {
                  handleChange(e);
                  setImagePreview(e.target.value);
                }}
                required
                placeholder="https://images.unsplash.com/... or ImgBB URL"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Section 4: Terms & Conditions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Owner Rental Terms & Guidelines
            </h3>

            <div>
              <textarea
                name="terms"
                rows={3}
                value={formData.terms}
                onChange={handleChange}
                placeholder="Security deposit terms, delivery clauses, cancellation policies..."
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Link
              href="/dashboard/owner/my-equipment"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Listing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for Admin Approval</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Marketplace Preview Card (Right Column) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Card Preview
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Default: Pending
              </span>
            </div>

            {/* Preview Card Shell */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
              <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {imagePreview || formData.image ? (
                  <img
                    src={imagePreview || formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-medium">Image Preview will appear here</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-sm">
                    {formData.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[130px]">{formData.location || "Location not set"}</span>
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formData.availableQuantity || 0} in stock
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                  {formData.name || "Equipment Title"}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {formData.description || "Equipment description will be displayed here for customers."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Rental Rate</span>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400 leading-tight">
                      ${formData.rentalPrice || "0"}
                      <span className="text-xs font-normal text-slate-400"> / {formData.rentalType.toLowerCase()}</span>
                    </p>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-800">
                    View Details
                  </span>
                </div>
              </div>
            </div>

            {/* Helper Info Note */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Moderation Standard
              </p>
              <p className="text-[11px] leading-relaxed text-blue-800/80 dark:text-blue-300/80">
                To guarantee safety, all equipment submissions undergo automated & admin verification before going live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
