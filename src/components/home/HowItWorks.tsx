"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, CreditCard, Wrench, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Browse & Select Equipment",
      description:
        "Filter by sector, location, and rental rates. View high-res photos, detailed specifications, and verified past reviews.",
    },
    {
      step: "02",
      icon: CreditCard,
      title: "Book with Escrow Protection",
      description:
        "Select your rental dates, check live price calculation, and pay safely via Stripe. Your funds stay protected in escrow.",
    },
    {
      step: "03",
      icon: Wrench,
      title: "Operate & Return Seamlessly",
      description:
        "Pick up from the owner or receive direct site delivery. Power your project, finish on time, and return hassle-free.",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How Renting On EquipHub Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            From search to project completion, experience a fast and secure rental workflow designed for productivity.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Step Number Watermark */}
                <span className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute top-4 right-6 select-none pointer-events-none">
                  {st.step}
                </span>

                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-bold text-xl text-slate-900 dark:text-white pt-2">
                    {st.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Step {st.step} Verified</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <span>Start Renting Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
