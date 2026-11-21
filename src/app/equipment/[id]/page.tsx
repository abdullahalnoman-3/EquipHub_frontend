"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Tag,
  Package,
  Wrench,
  UserCheck,
  Mail,
  Calendar,
  AlertCircle,
  Loader2,
  FileText,
  CreditCard,
  Lock,
  Heart,
  Share2,
} from "lucide-react";

interface EquipmentDetail {
  _id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType?: string;
  availableQuantity: number;
  condition?: string;
  brand?: string;
  model?: string;
  image: string;
  images?: string[];
  terms?: string;
  status?: string;
  owner?: {
    id?: string;
    name: string;
    email: string;
  };
  location: string;
  rating?: number;
  totalReviews?: number;
}

// Fallback seed equipment in case of offline/network issues
const fallbackItems: Record<string, EquipmentDetail> = {
  "673f8b01a1b2c3d4e5f60001": {
    _id: "673f8b01a1b2c3d4e5f60001",
    name: "CAT 320 Hydraulic Excavator",
    category: "Construction Equipment",
    description:
      "The Cat 320 excavator brings premium performance with simple-to-use technologies like Cat Grade with 2D, Grade Assist, and Payload — all standard equipment from the factory to boost your operator efficiency up to 45%. Features an eco-mode engine with low fuel burn and heavy-duty reinforced boom.",
    rentalPrice: 350,
    rentalType: "Daily",
    availableQuantity: 2,
    condition: "Excellent",
    brand: "Caterpillar",
    model: "CAT 320-GC",
    location: "Dhaka Central",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
    terms:
      "Operator must hold valid heavy equipment certification. Daily maintenance checklist required. Renter responsible for diesel refuel to original level upon return. $500 refundable security deposit held in Stripe escrow.",
    owner: {
      name: "Habibur Rahman (Heavy Fleet Rentals)",
      email: "owner@equiphub.com",
    },
    rating: 4.9,
    totalReviews: 18,
  },
};

export default function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  // Private route guard: Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/equipment/${id}`);
    }
  }, [authLoading, isAuthenticated, id, router]);

  // Fetch equipment details from API
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/equipment/${id}`);

        if (res.data?.success && res.data?.data) {
          const item = res.data.data;
          setEquipment(item);
          setActiveImage(
            item.image ||
              item.imageURL ||
              (item.images && item.images[0]) ||
              "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80"
          );
        } else {
          // Fallback to static seed item if present
          const fallback = fallbackItems[id];
          if (fallback) {
            setEquipment(fallback);
            setActiveImage(fallback.image);
          } else {
            setError("Equipment details not found or item has been unlisted.");
          }
        }
      } catch (err: any) {
        const fallback = fallbackItems[id];
        if (fallback) {
          setEquipment(fallback);
          setActiveImage(fallback.image);
        } else {
          setError(err.response?.data?.message || "Failed to load equipment details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDetails();
    }
  }, [id, isAuthenticated]);

  // Loading skeleton state
  if (authLoading || (loading && !equipment)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Equipment Not Available
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error || "We could not find the equipment you requested."}
          </p>
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Equipment</span>
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = (equipment.availableQuantity ?? 1) > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              Private Specification View
            </span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Image Gallery & Full View (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
              <img
                src={activeImage}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />

              {/* Category Badge on Image */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white shadow-md border border-slate-200/60 dark:border-slate-700/60">
                  {equipment.category}
                </span>
              </div>

              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-md ${
                    isAvailable
                      ? "bg-emerald-600/90 text-white"
                      : "bg-slate-700/90 text-slate-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? "bg-white animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  <span>
                    {isAvailable
                      ? `${equipment.availableQuantity} Unit(s) In Stock`
                      : "Currently Rented"}
                  </span>
                </span>
              </div>
            </div>

            {/* Thumbnail list if multiple images are available */}
            {equipment.images && equipment.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {equipment.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img
                        ? "border-blue-600 scale-95 shadow-md"
                        : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Equipment Overview & Specifications</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {equipment.description}
              </p>
            </div>

            {/* Rental Terms and Conditions */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Owner Terms & Rental Conditions</span>
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {equipment.terms ||
                  "Standard rental agreement applies: Renter agrees to inspect equipment upon receipt. Proper operation according to manufacturer guidelines required. Routine daily fluid checks and safe storage required during active rental duration."}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Specs Card & Owner Info (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Primary Booking & Price Action Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg space-y-6">
              {/* Header Title & Rating */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-medium">{equipment.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{equipment.rating || "4.9"}</span>
                    <span className="text-slate-400 font-normal">
                      ({equipment.totalReviews || 18} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {equipment.name}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold block">
                    Rental Price
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      ${equipment.rentalPrice}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      / {equipment.rentalType ? equipment.rentalType.toLowerCase() : "day"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                    ✓ Escrow Protected
                  </span>
                  <span className="text-[11px] text-slate-400">No hidden fees</span>
                </div>
              </div>

              {/* Key Technical Specifications Table */}
              <div className="space-y-2.5 pt-1 text-sm border-y border-slate-100 dark:border-slate-800 py-4">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-slate-400" />
                    Category:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {equipment.category}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    Condition:
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {equipment.condition || "Excellent"}
                  </span>
                </div>

                {equipment.brand && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-slate-400" />
                      Brand:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {equipment.brand}
                    </span>
                  </div>
                )}

                {equipment.model && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-slate-400" />
                      Model:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {equipment.model}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Availability:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {equipment.availableQuantity} Unit(s) ready
                  </span>
                </div>
              </div>

              {/* Booking CTA Button (Prepares for Step 15 modal) */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={!isAvailable}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Book Equipment Now</span>
                </button>

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure 256-bit encrypted checkout via Stripe</span>
                </p>
              </div>
            </div>

            {/* Owner Information Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Equipment Owner Details
              </h4>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                  {equipment.owner?.name?.charAt(0) || "O"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                      {equipment.owner?.name || "Verified Equipment Partner"}
                    </p>
                    <UserCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{equipment.owner?.email || "owner@equiphub.com"}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                🛡️ Verified host with 100% equipment delivery track record and verified ID documents.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
