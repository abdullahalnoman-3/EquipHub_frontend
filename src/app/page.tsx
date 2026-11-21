"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { Wrench, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Animated Hero/Banner Section (Step 7) */}
      <HeroBanner />

      {/* 2. Featured Equipment Section (Step 8 - 6 Items Limit) */}
      <FeaturedEquipment />

      {/* 3. Trust & Highlights Bar */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 shadow-xs flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Industrial-Grade Equipment
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Every tool and machine undergoes safety inspection and owner verification before listing.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 shadow-xs flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Stripe Escrow Protection
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Your payment is safely held until you receive and approve the rented gear in working condition.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 shadow-xs flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Live API Server Connected
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Synchronized with our high-speed live MongoDB and Express API on equiphubadmin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
