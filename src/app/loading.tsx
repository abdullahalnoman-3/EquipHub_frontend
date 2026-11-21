"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-6 animate-fadeIn">
      {/* Brand Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Loading EquipHub...
        </h3>
        <p className="text-xs text-slate-400">
          Fetching live equipment data and secure assets
        </p>
      </div>

      {/* Pulsing Skeleton Placeholder Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 opacity-50">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 animate-pulse"
          >
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
