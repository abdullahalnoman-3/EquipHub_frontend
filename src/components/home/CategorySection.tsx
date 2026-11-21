"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Cpu,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

interface CategoryMeta {
  name: string;
  shortTitle: string;
  description: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  accentColor: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    name: "Construction Equipment",
    shortTitle: "Construction",
    description: "Excavators, compactors, jackhammers & scaffolding",
    count: "15+ Items",
    icon: HardHat,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=600&q=80",
    accentColor: "from-amber-500/20 to-orange-500/10",
  },
  {
    name: "Photography Equipment",
    shortTitle: "Photography",
    description: "Cinema 4K cameras, drone kits, prime lenses & stabilizers",
    count: "22+ Items",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    accentColor: "from-purple-500/20 to-pink-500/10",
  },
  {
    name: "Vehicles & Transportation",
    shortTitle: "Vehicles & Transport",
    description: "Flatbed trucks, cargo haulers, forklifts & transport vans",
    count: "10+ Items",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1586191582056-a6021f005a76?auto=format&fit=crop&w=600&q=80",
    accentColor: "from-blue-500/20 to-sky-500/10",
  },
  {
    name: "Agriculture Equipment",
    shortTitle: "Agriculture & Farming",
    description: "Utility tractors, grain seeders, rotary tillers & plows",
    count: "12+ Items",
    icon: Tractor,
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80",
    accentColor: "from-emerald-500/20 to-teal-500/10",
  },
  {
    name: "Electronics",
    shortTitle: "Electronics & Power",
    description: "Silent generators, high-capacity UPS, cabling & sound meters",
    count: "18+ Items",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    accentColor: "from-cyan-500/20 to-blue-500/10",
  },
  {
    name: "Event Equipment",
    shortTitle: "Event & Production",
    description: "Stage lighting, PA arrays, wireless mics & DJ booths",
    count: "14+ Items",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    accentColor: "from-rose-500/20 to-red-500/10",
  },
];

export function CategorySection() {
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/equipment?category=${encodeURIComponent(categoryName)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Explore By Sector</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Browse Equipment Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              From heavy earthmoving machines to cinema lenses, find specialized rental gear tailored to your exact industry.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors shrink-0 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6-Card Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.name}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative h-72 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between p-6 bg-slate-900"
              >
                {/* Background Image with Dark Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 dark:opacity-45"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.accentColor} mix-blend-overlay`} />
                </div>

                {/* Top Row: Icon Badge & Count Pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-105 transition-all">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-xs">
                    {cat.count}
                  </span>
                </div>

                {/* Bottom Content: Title, Description & Action */}
                <div className="relative z-10 space-y-1.5">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>{cat.shortTitle}</span>
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-blue-400 group-hover:translate-x-1.5 transition-all" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default CategorySection;
