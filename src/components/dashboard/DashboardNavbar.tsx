"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Menu, Sun, Moon, Bell, Shield, ChevronRight } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function DashboardNavbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Compute clean breadcrumb title from pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/my-rentals")) return "My Rentals";
    if (pathname.includes("/favorites")) return "Saved Favorites";
    if (pathname.includes("/owner/add-equipment")) return "Add New Equipment";
    if (pathname.includes("/owner/my-equipment")) return "My Equipment Inventory";
    if (pathname.includes("/owner/rental-orders")) return "Customer Rental Orders";
    if (pathname.includes("/admin/users")) return "User Management";
    if (pathname.includes("/admin/equipment")) return "Equipment Moderation";
    if (pathname.includes("/admin/bookings")) return "All Platform Bookings";
    if (pathname.includes("/admin/smtp")) return "SMTP & Notifications";
    if (pathname.includes("/profile")) return "Profile Settings";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition"
          >
            Dashboard
          </Link>
          {pathname !== "/dashboard" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {getPageTitle()}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions (Theme Toggle, Notifications, User) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Mini Pill */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          {user?.photoURL || user?.avatar ? (
            <img
              src={user.photoURL || user.avatar}
              alt={user.name || "User"}
              className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center"
            style={{ display: user?.photoURL || user?.avatar ? "none" : "flex" }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {user?.name?.split(" ")[0] || "Account"}
          </span>
        </Link>
      </div>
    </header>
  );
}
