"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  Sparkles,
  MapPin,
  Star,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface EquipmentItem {
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

// Fallback seed data in case API is loading or network is offline
const fallbackEquipment: EquipmentItem[] = [
  {
    _id: "673f8b01a1b2c3d4e5f60001",
    name: "CAT 320 Hydraulic Excavator",
    category: "Heavy Machinery",
    rentalPrice: 350,
    rentalType: "Daily",
    location: "Dhaka Central",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 2,
    rating: 4.9,
    totalReviews: 18,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60002",
    name: "DeWalt 20V Max Cordless Drill Kit",
    category: "Power Tools",
    rentalPrice: 25,
    rentalType: "Daily",
    location: "Chittagong Port",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 5,
    rating: 4.8,
    totalReviews: 24,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60003",
    name: "John Deere 5075E Utility Tractor",
    category: "Farming Equipment",
    rentalPrice: 220,
    rentalType: "Daily",
    location: "Bogra Farm Zone",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 1,
    rating: 5.0,
    totalReviews: 12,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60004",
    name: "Sony FX3 Full-Frame Cinema Camera Kit",
    category: "Audio/Visual & Event Tech",
    rentalPrice: 150,
    rentalType: "Daily",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 3,
    rating: 4.9,
    totalReviews: 31,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60005",
    name: "Bosch Professional Rotary Hammer Drill",
    category: "Construction & Hand Tools",
    rentalPrice: 35,
    rentalType: "Daily",
    location: "Sylhet Sadar",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 4,
    rating: 4.7,
    totalReviews: 15,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60006",
    name: "Yamaha 5.5kVA Silent Inverter Generator",
    category: "Outdoor & Adventure Gear",
    rentalPrice: 75,
    rentalType: "Daily",
    location: "Cox's Bazar",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 2,
    rating: 4.8,
    totalReviews: 9,
  },
];

export function FeaturedEquipment() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await api.get("/equipment?limit=6");
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          if (response.data.data.length > 0) {
            setEquipmentList(response.data.data.slice(0, 6));
          } else {
            setEquipmentList(fallbackEquipment);
          }
        } else {
          setEquipmentList(fallbackEquipment);
        }
      } catch (err) {
        // Fallback to static seed data gracefully on network limits
        setEquipmentList(fallbackEquipment);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Auth-aware "View Details" handler
  const handleViewDetails = (equipmentId: string) => {
    if (isAuthenticated) {
      router.push(`/equipment/${equipmentId}`);
    } else {
      toast("Please login to view equipment details & booking", { icon: "🔒" });
      router.push(`/login?redirect=/equipment/${equipmentId}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Featured Equipment For Rent
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Discover top-rated machinery and professional tools currently available with instant booking confirmation.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors shrink-0 group"
          >
            <span>Browse All Equipment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 animate-pulse"
              >
                <div className="w-full h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="flex justify-between pt-2">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {equipmentList.map((item) => {
              const displayImage =
                item.image ||
                item.imageURL ||
                item.imageUrl ||
                (item.images && item.images[0]) ||
                "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80";

              const isAvailable = (item.availableQuantity ?? 1) > 0;

              return (
                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Image Wrapper */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={displayImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                        {item.category}
                      </span>
                    </div>

                    {/* Availability Dot */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                          isAvailable
                            ? "bg-emerald-500/90 text-white"
                            : "bg-slate-600/90 text-slate-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable ? "bg-white animate-pulse" : "bg-slate-300"
                          }`}
                        />
                        <span>{isAvailable ? "Available" : "Booked"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Location & Rating row */}
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
                                className={`w-3.5 h-3.5 ${
                                  total > 0 ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
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

                      {/* Equipment Title */}
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    {/* Bottom Pricing & Auth-Aware Details Button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">
                          Rental Rate
                        </span>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          ${item.rentalPrice}
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {" "}
                            / {item.rentalType ? item.rentalType.toLowerCase() : "day"}
                          </span>
                        </p>
                      </div>

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => handleViewDetails(item._id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View All Bottom Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all"
          >
            <span>Explore All 10+ Equipment Items</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedEquipment;
