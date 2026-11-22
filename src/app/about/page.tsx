"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Award,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Building2,
  Cpu,
  Layers,
} from "lucide-react";

export default function AboutUsPage() {
  const stats = [
    { label: "Verified Machines", value: "1,200+", description: "Inspected and ready for rent" },
    { label: "Active Renters", value: "5,000+", description: "Contractors, filmmakers & farmers" },
    { label: "Rental Cap-Ex Saved", value: "$2.4M+", description: "Compared to buying new machinery" },
    { label: "Districts Covered", value: "64", description: "Nationwide availability in BD" },
  ];

  const values = [
    {
      title: "Radical Transparency",
      description:
        "No hidden depot fees or surprise surcharges. What you see on EquipHub is the complete, honest cost of operation.",
      icon: Target,
    },
    {
      title: "Bank-Grade Escrow Security",
      description:
        "Every single transaction is safeguarded by automated platform escrow, ensuring neither party is ever compromised.",
      icon: ShieldCheck,
    },
    {
      title: "Strict Mechanical Standards",
      description:
        "We verify maintenance logs, physical serial numbers, and equipment safety before approving any machinery to catalog.",
      icon: Wrench,
    },
    {
      title: "Local Economy Empowerment",
      description:
        "Helping equipment owners convert idle fleet downtime into predictable, high-yield revenue while assisting SMEs.",
      icon: TrendingUp,
    },
  ];

  const team = [
    {
      name: "Abdullah Al Noman",
      role: "Founder & Chief Architect",
      bio: "Full-stack engineer and operations specialist focused on infrastructure marketplaces and secure fintech escrow systems.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Tariqul Islam",
      role: "Head of Fleet Operations",
      bio: "12+ years in civil engineering and heavy equipment logistics across major national infrastructure projects in Bangladesh.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Sarah Chowdhury",
      role: "Lead Quality & Safety Inspector",
      bio: "Certified machinery technician specializing in hydraulic systems, drone electronics, and on-site operator safety compliance.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 animate-fadeIn pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 sm:py-24">
        <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-900/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto">
            Powering Bangladesh's Builders, Creators & Farmers
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            EquipHub is Bangladesh's pioneering smart equipment rental platform. We bridge the gap between heavy machinery fleet owners and growing enterprises who need reliable tools on demand.
          </p>
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center"
            >
              <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                {stat.value}
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                {stat.label}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Origin Story & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>The Problem We Solve</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Machinery Shouldn't Sit Idle While Projects Wait for Capital
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every year, thousands of contractors in Bangladesh face crippling capital expense hurdles. A brand new hydraulic excavator or high-end cinema drone demands tens of thousands of dollars in upfront cash.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              At the same time, existing fleet owners experience 40% idle downtime during project transition gaps. EquipHub eliminates this friction: giving renters instant access to verified tools, and giving equipment owners secure, automated returns on their capital.
            </p>

            <div className="pt-2">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition"
              >
                <span>Explore the Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Leadership & Machinery Specialists
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Passionate technologists, mechanical engineers, and logistics experts dedicated to building the future of peer-to-peer industrial rentals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm space-y-4 hover:border-blue-500 transition"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-950 shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {member.role}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
