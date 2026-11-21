"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { EquipmentCard, EquipmentItem } from "@/components/equipment/EquipmentCard";
import { EquipmentFilters, FilterState } from "@/components/equipment/EquipmentFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { Layers, Loader2, AlertCircle, RotateCcw } from "lucide-react";

// Fallback seed equipment in case of offline/network issues
const fallbackItems: EquipmentItem[] = [
  {
    _id: "673f8b01a1b2c3d4e5f60001",
    name: "CAT 320 Hydraulic Excavator",
    category: "Construction Equipment",
    description: "Heavy duty excavator for earthmoving, digging trenches, and demolition work.",
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
    category: "Construction Equipment",
    description: "High speed industrial cordless drill kit with dual lithium batteries and charger.",
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
    category: "Agriculture Equipment",
    description: "75HP 4WD tractor suitable for tilling, seeding, and hauling heavy agricultural payloads.",
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
    category: "Photography Equipment",
    description: "Full-frame 4K cinema line camera with XLR handle, prime lenses, and 3x batteries.",
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
    category: "Construction Equipment",
    description: "High impact 800W rotary hammer drill with SDS-plus chuck for masonry and stone.",
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
    category: "Electronics",
    description: "Ultra quiet pure sine wave inverter generator for sensitive electronics and outdoor film shoots.",
    rentalPrice: 75,
    rentalType: "Daily",
    location: "Cox's Bazar",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 2,
    rating: 4.8,
    totalReviews: 9,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60007",
    name: "Isuzu 5-Ton Commercial Flatbed Truck",
    category: "Vehicles & Transportation",
    description: "Heavy logistics flatbed truck for equipment transportation and machinery haulage.",
    rentalPrice: 200,
    rentalType: "Daily",
    location: "Gazipur Industrial Zone",
    image: "https://images.unsplash.com/photo-1586191582056-a6021f005a76?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 2,
    rating: 4.9,
    totalReviews: 14,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60008",
    name: "JBL Line Array Concert PA Sound System",
    category: "Event Equipment",
    description: "Professional concert line array speakers with dual 18-inch subwoofers and digital mixing console.",
    rentalPrice: 300,
    rentalType: "Daily",
    location: "Dhanmondi, Dhaka",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 2,
    rating: 5.0,
    totalReviews: 20,
  },
  {
    _id: "673f8b01a1b2c3d4e5f60009",
    name: "DJI Inspire 3 8K Cinema Drone Kit",
    category: "Photography Equipment",
    description: "Full-frame 8K ProRes RAW cinema drone with dual-operator remote control and RTK positioning.",
    rentalPrice: 280,
    rentalType: "Daily",
    location: "Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 1,
    rating: 4.9,
    totalReviews: 11,
  },
];

const initialFilters: FilterState = {
  search: "",
  category: "All Categories",
  rentalType: "All Types",
  availableOnly: false,
  minPrice: "",
  maxPrice: "",
  sortBy: "recent",
};

function EquipmentCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial params from URL if navigated from home categories or search
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    category: initialCategory,
    search: initialSearch,
  });

  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Debounce the text search to avoid hammering the backend on fast typing
  const debouncedSearch = useDebounce(filters.search, 350);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Fetch from backend API whenever debounced search or filter attributes change
  useEffect(() => {
    const fetchFilteredEquipment = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (debouncedSearch.trim()) {
          params.append("search", debouncedSearch.trim());
        }

        if (filters.category && filters.category !== "All Categories") {
          params.append("category", filters.category);
        }

        if (filters.rentalType && filters.rentalType !== "All Types") {
          params.append("rentalType", filters.rentalType);
        }

        if (filters.availableOnly) {
          params.append("available", "true");
        }

        if (filters.minPrice) {
          params.append("minPrice", filters.minPrice);
        }

        if (filters.maxPrice) {
          params.append("maxPrice", filters.maxPrice);
        }

        if (filters.sortBy) {
          params.append("sortBy", filters.sortBy);
        }

        // Keep URL in sync without triggering full page reload
        const queryString = params.toString();
        const newUrl = queryString ? `/equipment?${queryString}` : "/equipment";
        window.history.replaceState(null, "", newUrl);

        const response = await api.get(`/equipment?${queryString}`);

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setEquipmentList(response.data.data);
        } else {
          // Client-side fallback filter
          let filtered = [...fallbackItems];
          if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            filtered = filtered.filter(
              (i) => i.name.toLowerCase().includes(q) || i.location.toLowerCase().includes(q)
            );
          }
          if (filters.category !== "All Categories") {
            filtered = filtered.filter((i) => i.category === filters.category);
          }
          if (filters.availableOnly) {
            filtered = filtered.filter((i) => (i.availableQuantity ?? 1) > 0);
          }
          if (filters.minPrice) {
            filtered = filtered.filter((i) => i.rentalPrice >= Number(filters.minPrice));
          }
          if (filters.maxPrice) {
            filtered = filtered.filter((i) => i.rentalPrice <= Number(filters.maxPrice));
          }
          if (filters.sortBy === "price_asc") {
            filtered.sort((a, b) => a.rentalPrice - b.rentalPrice);
          } else if (filters.sortBy === "price_desc") {
            filtered.sort((a, b) => b.rentalPrice - a.rentalPrice);
          }
          setEquipmentList(filtered);
        }
      } catch (err) {
        // Fallback filter gracefully
        let filtered = [...fallbackItems];
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          filtered = filtered.filter(
            (i) => i.name.toLowerCase().includes(q) || i.location.toLowerCase().includes(q)
          );
        }
        if (filters.category !== "All Categories") {
          filtered = filtered.filter((i) => i.category === filters.category);
        }
        if (filters.availableOnly) {
          filtered = filtered.filter((i) => (i.availableQuantity ?? 1) > 0);
        }
        if (filters.minPrice) {
          filtered = filtered.filter((i) => i.rentalPrice >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
          filtered = filtered.filter((i) => i.rentalPrice <= Number(filters.maxPrice));
        }
        if (filters.sortBy === "price_asc") {
          filtered.sort((a, b) => a.rentalPrice - b.rentalPrice);
        } else if (filters.sortBy === "price_desc") {
          filtered.sort((a, b) => b.rentalPrice - a.rentalPrice);
        }
        setEquipmentList(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEquipment();
  }, [
    debouncedSearch,
    filters.category,
    filters.rentalType,
    filters.availableOnly,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Count Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Equipment Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              All Available Equipment
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Browse approved tools and machinery available for rent across Bangladesh.
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Searching catalog...</span>
              </span>
            ) : (
              <span>Showing {equipmentList.length} Items</span>
            )}
          </div>
        </div>

        {/* Dynamic Search, Filter & Sort Controls (Step 12) */}
        <EquipmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={equipmentList.length}
        />

        {/* 3-Column Responsive Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 animate-pulse h-96"
              >
                <div className="w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No Equipment Matches Your Criteria
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                We couldn&apos;t find any rental equipment matching your active search and filter options.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {equipmentList.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <EquipmentCatalogContent />
    </Suspense>
  );
}
