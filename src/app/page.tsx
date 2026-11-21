"use client";

import Link from "next/link";
import { Wrench, ShieldCheck, Sparkles, CheckCircle2, User, LogOut, LogIn, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  return (
    <main className="min-h-screen flex flex-col justify-between p-6">
      {/* Header bar with Theme Toggle and Auth buttons */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            E
          </div>
          <span className="text-xl font-bold tracking-tight">
            Equip<span className="text-blue-600">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden sm:inline-block">
                Hi, <strong className="text-blue-600">{user.name}</strong> ({user.role})
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto space-y-6 text-center py-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>EquipHub Platform Architecture</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Welcome to <span className="text-blue-600">EquipHub</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Your premier smart equipment rental solution. Rent tools, heavy machinery,
          and production gear with confidence, security, and flexible pricing.
        </p>

        {/* Feature Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
            <Wrench className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Verified Equipment</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top grade gear inspected and approved for hassle-free performance.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-semibold text-lg">Secure Bookings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Protected transactions powered by Stripe with instant confirmation.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
            <CheckCircle2 className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="font-semibold text-lg">Live Backend</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Connected to our live Express + MongoDB API server at equiphubadmin.
            </p>
          </div>
        </div>

        {/* Status Callout */}
        <div className="pt-8">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Step 3 Complete • Axios Interceptors & Persistent AuthContext Active
          </p>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        © {new Date().getFullYear()} EquipHub. All rights reserved.
      </footer>
    </main>
  );
}
