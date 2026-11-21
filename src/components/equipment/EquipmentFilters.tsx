"use client";

import React from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  DollarSign,
  X,
} from "lucide-react";

export interface FilterState {
  search: string;
  category: string;
  rentalType: string;
  availableOnly: boolean;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

interface EquipmentFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onReset: () => void;
  totalResults: number;
}

const CATEGORIES = [
  "All Categories",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["All Types", "Daily", "Weekly", "Monthly"];

const SORT_OPTIONS = [
  { label: "Recently Added", value: "recent" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export function EquipmentFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: EquipmentFiltersProps) {
  const isFiltered =
    filters.search !== "" ||
    filters.category !== "All Categories" ||
    filters.rentalType !== "All Types" ||
    filters.availableOnly ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.sortBy !== "recent";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Search Bar & Sort Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input (Takes 7 cols on md) */}
        <div className="md:col-span-7 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by equipment name, brand, or location..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown (Takes 5 cols on md) */}
        <div className="md:col-span-5 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline-block">
            Sort By:
          </span>
          <div className="relative flex-1">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Attributes Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* Category Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Rental Type Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Rental Type
          </label>
          <div className="relative">
            <select
              value={filters.rentalType}
              onChange={(e) => onFilterChange("rentalType", e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {RENTAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Price Range Inputs */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Price Range ($)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={filters.minPrice}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Availability Toggle & Reset */}
        <div className="flex flex-col justify-end">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Availability
          </label>
          <div className="flex items-center justify-between gap-2 h-[42px]">
            {/* Checkbox Button */}
            <button
              type="button"
              onClick={() => onFilterChange("availableOnly", !filters.availableOnly)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filters.availableOnly
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  filters.availableOnly
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-400"
                }`}
              >
                {filters.availableOnly && <Check className="w-2.5 h-2.5" />}
              </div>
              <span>In Stock Only</span>
            </button>

            {/* Reset Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={onReset}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges & Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-slate-500">
          <span>Found {totalResults} matching results</span>
          {filters.category !== "All Categories" && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
              Category: {filters.category}
            </span>
          )}
          {filters.rentalType !== "All Types" && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium">
              Type: {filters.rentalType}
            </span>
          )}
          {filters.availableOnly && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
              Available Only
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default EquipmentFilters;
