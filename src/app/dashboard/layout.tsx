"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated, isAdmin, isOwner } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Authentication check & redirect
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Loading screen prevents flashing and avoids false logouts on page refresh
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Loading Dashboard...
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Validating your session and permissions
        </p>
      </div>
    );
  }

  // If not authenticated (while router is redirecting)
  if (!isAuthenticated) {
    return null;
  }

  // Strict Role-Based Route Guards
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isOwnerRoute = pathname.startsWith("/dashboard/owner");

  const isForbidden =
    (isAdminRoute && !isAdmin) ||
    (isOwnerRoute && !isOwner && !isAdmin);

  if (isForbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 rounded-full mb-3">
            403 - Forbidden Access
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You do not have the required permissions to view this section. This page is
            restricted to authorized {isAdminRoute ? "Administrators" : "Equipment Owners"}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Role-based Sidebar */}
      <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
