"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShieldCheck,
  CalendarCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: DollarSign,
      title: "Affordable & Transparent Rates",
      description:
        "Direct peer-to-peer equipment rentals with zero hidden markups. Save up to 40% compared to traditional rental fleets.",
      badge: "Cost-Effective",
      accent: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60",
    },
    {
      icon: ShieldCheck,
      title: "100% Verified Equipment & Owners",
      description:
        "Every owner is identity-checked, and every machine undergoes regular maintenance and condition logs before listing.",
      badge: "Quality Assured",
      accent: "text-blue-600 bg-blue-100 dark:bg-blue-950/60",
    },
    {
      icon: CalendarCheck,
      title: "Flexible Rental Durations",
      description:
        "Rent by the day, week, or month. Extend your booking anytime with one click right from your personal dashboard.",
      badge: "Zero Friction",
      accent: "text-purple-600 bg-purple-100 dark:bg-purple-950/60",
    },
    {
      icon: Lock,
      title: "Stripe Escrow Protected Payments",
      description:
        "Your payment is held safely in escrow and only released to the owner after you inspect and accept the gear on-site.",
      badge: "Buyer Protection",
      accent: "text-amber-600 bg-amber-100 dark:bg-amber-950/60",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why EquipHub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built For Contractors, Creators & Smart Owners
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            We solve the headaches of equipment access with guaranteed safety, transparent pricing, and instant escrow assurance.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Verified Guarantee</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
