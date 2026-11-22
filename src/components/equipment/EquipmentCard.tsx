"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FavoriteButton } from "@/components/equipment/FavoriteButton";
import toast from "react-hot-toast";
import { MapPin, Star, Eye } from "lucide-react";

export interface EquipmentItem {
  _id: string;
  name: string;
  category: string;
  description?: string;
  rentalPrice: number;
  rentalType?: string;
  location: string;
  image?: string;
  images?: string[];
  imageURL?: string;
  imageUrl?: string;
  availableQuantity?: number;
  rating?: number;
  totalReviews?: number;
}

export function EquipmentCard({ item }: { item: EquipmentItem }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const displayImage =
    item.image ||
    item.imageURL ||
    item.imageUrl ||
    (item.images && item.images[0]) ||
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80";

  const isAvailable = (item.availableQuantity ?? 1) > 0;

  const handleDetailsClick = () => {
    if (isAuthenticated) {
      router.push(`/equipment/${item._id}`);
    } else {
      toast("Please sign in to view complete equipment details", { icon: "🔒" });
      router.push(`/login?redirect=/equipment/${item._id}`);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Uniform Image Frame */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={displayImage}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            {item.category}
          </span>
        </div>

        {/* Top Right: Favorite Button & Availability */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
          {/* Favorite Toggle Button */}
          <div className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs">
            <FavoriteButton equipmentId={item._id} />
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md shadow-xs ${isAvailable
                ? "bg-emerald-600/90 text-white"
                : "bg-slate-700/90 text-slate-200"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-slate-400"
                }`}
            />
            <span>{isAvailable ? "Available" : "Booked"}</span>
          </span>
        </div>
      </div>

      {/* Uniform Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 truncate max-w-[170px]">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            {(() => {
              const total = typeof (item as any).reviewCount === "number"
                ? (item as any).reviewCount
                : (typeof item.totalReviews === "number" ? item.totalReviews : 0);
              const rating = typeof (item as any).averageRating === "number"
                ? (item as any).averageRating
                : (typeof item.rating === "number" ? item.rating : 0);
              return (
                <div className="flex items-center gap-1 font-semibold shrink-0">
                  <Star
                    className={`w-3.5 h-3.5 ${total > 0 ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                      }`}
                  />
                  {total > 0 ? (
                    <>
                      <span className="text-amber-500 font-bold">{Number(rating).toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({total})</span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-normal text-[11px]">No reviews yet</span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Title */}
          <h3
            onClick={handleDetailsClick}
            className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
            title={item.name}
          >
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description ||
              "Top tier equipment inspected and verified for professional contractors and high-performance projects."}
          </p>
        </div>

        {/* Bottom Pricing & Action Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">
              Daily Rate
            </span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              ${item.rentalPrice}
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {" "}
                / {item.rentalType ? item.rentalType.toLowerCase() : "day"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleDetailsClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EquipmentCard;
