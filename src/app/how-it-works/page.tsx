"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Lock,
  Layers,
  Award,
  Clock,
  ChevronDown,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"renter" | "owner">("renter");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const renterSteps = [
    {
      step: "01",
      title: "Discover & Choose Equipment",
      description:
        "Browse verified construction machinery, camera kits, farming tractors, and event audio equipment across Bangladesh. Filter by price, location, condition, and availability.",
      icon: Search,
      badge: "Real-Time Catalog",
    },
    {
      step: "02",
      title: "Reserve with Stripe Escrow",
      description:
        "Select your rental start and end dates. Your rental payment is safely held in EquipHub Escrow and only released to the owner after you safely receive and inspect the equipment.",
      icon: CreditCard,
      badge: "100% Protected",
    },
    {
      step: "03",
      title: "Fast Delivery or Depot Pickup",
      description:
        "Coordinate physical depot pickup or request flatbed delivery straight to your job site with full condition documentation and operation safety guidelines.",
      icon: Truck,
      badge: "On-Site Delivery",
    },
    {
      step: "04",
      title: "Safe Return & Genuine Review",
      description:
        "Once your project is completed, return the machinery in good order, conclude the contract, and share verified feedback and rating for the community.",
      icon: RotateCcw,
      badge: "Reputation System",
    },
  ];

  const ownerSteps = [
    {
      step: "01",
      title: "List Machinery & Set Rates",
      description:
        "Upload high-resolution equipment photos, specifications, daily rental pricing, physical depot address, and custom terms in less than 3 minutes.",
      icon: PlusCircle,
      badge: "Free Listing",
    },
    {
      step: "02",
      title: "Admin Review & Live Approval",
      description:
        "Our operations team verifies your machine specifications, ownership credentials, and safety standards to guarantee top-tier marketplace trust.",
      icon: ShieldCheck,
      badge: "Quality Guaranteed",
    },
    {
      step: "03",
      title: "Receive Verified Bookings",
      description:
        "Accept rental requests from verified corporate contractors and individuals with automated contracts, deposit locks, and contact management.",
      icon: Layers,
      badge: "Automated Bookings",
    },
    {
      step: "04",
      title: "Guaranteed Escrow Payouts",
      description:
        "Rental revenue is deposited securely into your bank or preferred gateway with zero chargeback risk, transparent platform fees, and tracking.",
      icon: Award,
      badge: "On-Time Settlements",
    },
  ];

  const faqs = [
    {
      q: "How does the Escrow Payment system protect me?",
      a: "When you book equipment on EquipHub, your funds are safely locked in platform escrow. The owner does not receive the funds until you physically receive the equipment in working condition. If the equipment is damaged or not delivered, our dispute system guarantees a 100% refund.",
    },
    {
      q: "Who is responsible for fuel and routine maintenance?",
      a: "As standard industry policy, equipment is delivered with a full fuel tank and must be returned with a full fuel tank unless otherwise stated in the owner's rental terms.",
    },
    {
      q: "How does EquipHub verify equipment owners and quality?",
      a: "All equipment listings undergo strict administrator moderation. We verify physical serial numbers, operational health checkups, and national ID credentials of all owners before approving listings to public marketplace search.",
    },
    {
      q: "Can I rent equipment for several weeks or months?",
      a: "Yes! Many listings feature discounted weekly and monthly rental rates for infrastructure contractors and long-term project planners.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 animate-fadeIn pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 sm:py-24">
        <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-900/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How EquipHub Works</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto">
            Smart, Safe & Simple Machinery Rentals
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Whether you need heavy construction excavators for a major jobsite or want to monetize idle tools, EquipHub makes peer-to-peer equipment rentals effortless.
          </p>

          {/* User Type Switcher Tabs */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("renter")}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "renter"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                For Renters & Contractors
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("owner")}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "owner"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                For Equipment Owners & Fleets
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {activeTab === "renter"
              ? "Your 4-Step Rental Journey"
              : "Start Earning with Your Machines in 4 Steps"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === "renter"
              ? "From search to job completion with zero friction and total peace of mind"
              : "Maximize your machinery ROI with guaranteed verified renters and automated payments"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === "renter" ? renterSteps : ownerSteps).map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700 font-mono">
                      {stepItem.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/40">
                      {stepItem.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          {activeTab === "renter" ? (
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Browse Equipment Catalog</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/owner/add-equipment"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Equipment Today</span>
            </Link>
          )}
        </div>
      </section>

      {/* Security & Guarantees Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto md:mx-0">
                <Lock className="w-5 h-5 text-blue-300" />
              </div>
              <h4 className="font-bold text-base">Stripe Escrow Protection</h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Funds are held in secure escrow vaults until delivery inspection is signed off by both sides.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto md:mx-0">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <h4 className="font-bold text-base">100% Verified Equipment</h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Every listed machine is verified for serial validity, functional status, and owner authenticity.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto md:mx-0">
                <Clock className="w-5 h-5 text-amber-300" />
              </div>
              <h4 className="font-bold text-base">24/7 Breakdown Hotline</h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Instant swap support or emergency technician assistance if mechanical failures occur on site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
