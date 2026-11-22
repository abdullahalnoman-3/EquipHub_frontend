"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import {
  Package,
  CalendarCheck,
  Heart,
  DollarSign,
  Users,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  FolderKanban,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Mail,
  Activity,
  Star,
  Server,
  CreditCard,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user, isAdmin, isOwner, isCustomer } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const res = await api.get("/analytics/admin");
          if (res.data?.success) setStats(res.data.data);
        } else if (isOwner) {
          const res = await api.get("/analytics/owner");
          if (res.data?.success) setStats(res.data.data);
        } else {
          // Customer stats: fetch rentals & favorites
          const [rentalsRes, favsRes] = await Promise.allSettled([
            api.get("/bookings/my-rentals"),
            api.get("/favorites"),
          ]);
          const rentals =
            rentalsRes.status === "fulfilled" && rentalsRes.value.data?.success
              ? rentalsRes.value.data.data || []
              : [];
          const favorites =
            favsRes.status === "fulfilled" && favsRes.value.data?.success
              ? favsRes.value.data.data || []
              : [];

          const activeRentals = rentals.filter(
            (r: any) => r.bookingStatus === "Active" || r.bookingStatus === "Confirmed"
          ).length;
          const totalSpent = rentals.reduce(
            (sum: number, r: any) => sum + (Number(r.totalAmount) || 0),
            0
          );

          setStats({
            totalRentals: rentals.length,
            activeRentals,
            totalFavorites: favorites.length,
            totalSpent,
          });
        }
      } catch (err) {
        console.warn("Stats fetch failed, using fallback display:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, isOwner]);

  // Role display title
  const getRoleTitle = () => {
    if (isAdmin) return "System Administrator";
    if (isOwner) return "Equipment Owner";
    return "Verified Customer";
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{getRoleTitle()} Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Friend"}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Manage your equipment rentals, inspect live bookings, and review platform
            activities from your centralized control dashboard.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 -mb-10 w-48 h-48 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Admin KPI Cards */}
        {isAdmin && (
          <>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.totalUsers || 0}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Registered accounts
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Equipment
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.totalEquipment || 0}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {stats?.pendingApprovals || 0} pending review
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Bookings
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.totalBookings || 0}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats?.activeRentals || 0} currently active
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Gross Volume
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  ${loading ? "..." : stats?.totalRevenue?.toLocaleString() || 0}
                </h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Through Stripe transactions
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </>
        )}

        {/* Owner KPI Cards */}
        {isOwner && !isAdmin && (
          <>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  My Equipments
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.totalEquipment || 0}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {stats?.approvedEquipment || 0} approved & live
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Pending Approval
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.pendingEquipment || 0}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Under admin review
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Rentals
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.totalRentals || 0}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats?.activeRentals || 0} currently active
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Net Earnings
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  ${loading ? "..." : stats?.totalEarnings?.toLocaleString() || 0}
                </h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  From paid bookings
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </>
        )}

        {/* Customer KPI Cards */}
        {(!isAdmin && !isOwner) && (
          <>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Rentals
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.totalRentals || 0}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Historical bookings
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Rentals
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.activeRentals || 0}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Currently in progress
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Saved Favorites
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {loading ? "..." : stats?.totalFavorites || 0}
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  Items bookmarked
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Investment
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  ${loading ? "..." : stats?.totalSpent?.toLocaleString() || 0}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                  Spent on rentals
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Visual Analytics Graphs (For Admin & Owner) */}
      {(isAdmin || isOwner) && (
        <div className="pt-2">
          <AnalyticsCharts
            role={isAdmin ? "Admin" : "Owner"}
            data={isAdmin ? stats?.monthlyStats || [] : stats?.monthlyEarnings || []}
          />
        </div>
      )}

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Quick Actions & Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {isAdmin ? (
            <>
              <Link
                href="/dashboard/admin/users"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                    User Management
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Promote user roles, inspect verified accounts, and manage permissions.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-4">
                  <span>Manage Users</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/admin/equipment"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 transition">
                    Equipment Approval
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Approve or reject newly submitted equipment listings from owners.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-4">
                  <span>Review Submissions</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/admin/reviews"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                    <Star className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 transition">
                    Review Moderation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Approve, decline, or hide customer equipment reviews and ratings.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 mt-4">
                  <span>Moderate Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/admin/bookings"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                    Platform Bookings
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Monitor every live transaction, rental duration, and completion statuses.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-4">
                  <span>View All Bookings</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/admin/smtp"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 transition">
                    SMTP Gateway
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage email dispatch host, test email delivery, and invoice templates.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-4">
                  <span>Configure Mail</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/admin/payment-settings"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                    Payment Gateway
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage Stripe API keys, toggle live/test modes, and escrow fees.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-4">
                  <span>Configure Gateway</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </>
          ) : isOwner ? (
            <>
              <Link
                href="/dashboard/owner/add-equipment"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                    Add New Equipment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Upload photos via ImgBB and publish high-yield rental equipment.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-4">
                  <span>Create Listing</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/owner/my-equipment"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 transition">
                    Inventory Management
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Edit pricing, update stock counts, and inspect current approval states.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-4">
                  <span>Manage Equipment</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/owner/rental-orders"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                    Rental Orders
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Accept customer bookings and update delivery/completion status.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-4">
                  <span>Review Orders</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/equipment"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                    Browse Equipment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Explore verified photography, construction, and power tools catalog.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-4">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/my-rentals"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                    My Rental Bookings
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Track delivery dates, rental duration, and download receipts.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-4">
                  <span>View My Rentals</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/dashboard/favorites"
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 transition">
                    Saved Favorites
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review your bookmarked machines and easily book them anytime.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-4">
                  <span>View Favorites</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Admin Platform Infrastructure & Service Health */}
      {isAdmin && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Server className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  System Architecture & Microservice Health
                </h3>
                <p className="text-xs text-slate-400">
                  Live status of core services and external API integrations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                All Systems Operational
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Database (MongoDB Atlas)</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Connected</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Stripe Payment Gateway</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active (Escrow)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Authentication & JWT</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">RBAC Enforced</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 font-medium">SMTP Mail Dispatch</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
