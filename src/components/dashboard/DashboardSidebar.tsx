"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Heart,
  CalendarCheck,
  PlusCircle,
  FolderKanban,
  FileCheck2,
  Users,
  ShieldCheck,
  ClipboardList,
  Mail,
  UserCheck,
  Home,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function DashboardSidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isAdmin, isOwner, isCustomer } = useAuth();

  // Navigation Items according to user role
  const getNavSections = () => {
    const sections: {
      title: string;
      items: { name: string; href: string; icon: any }[];
    }[] = [
      {
        title: "Overview",
        items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
      },
    ];

    // Customer Navigation
    if (isCustomer || (!isOwner && !isAdmin)) {
      sections.push({
        title: "Customer Space",
        items: [
          { name: "My Rentals", href: "/dashboard/my-rentals", icon: CalendarCheck },
          { name: "Saved Favorites", href: "/dashboard/favorites", icon: Heart },
        ],
      });
    }

    // Owner Navigation
    if (isOwner || isAdmin) {
      sections.push({
        title: "Owner Space",
        items: [
          { name: "Add Equipment", href: "/dashboard/owner/add-equipment", icon: PlusCircle },
          { name: "My Equipment", href: "/dashboard/owner/my-equipment", icon: Package },
          { name: "Rental Orders", href: "/dashboard/owner/rental-orders", icon: FolderKanban },
        ],
      });
    }

    // Admin Navigation
    if (isAdmin) {
      sections.push({
        title: "Administration",
        items: [
          { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
          { name: "Equipment Approval", href: "/dashboard/admin/equipment", icon: ShieldCheck },
          { name: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
          { name: "SMTP Settings", href: "/dashboard/admin/smtp", icon: Mail },
        ],
      });
    }

    // Account & General
    sections.push({
      title: "Account",
      items: [
        { name: "My Profile", href: "/dashboard/profile", icon: UserCheck },
        { name: "Back to Home", href: "/", icon: Home },
      ],
    });

    return sections;
  };

  const navSections = getNavSections();

  const getRoleBadgeColor = () => {
    if (isAdmin) return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    if (isOwner) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  };

  const SidebarContent = (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <span className="font-black text-lg">E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Equip<span className="text-blue-600 dark:text-blue-400">Hub</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
              Portal
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile Card */}
      <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          {user?.photoURL || user?.avatar ? (
            <img
              src={user.photoURL || user.avatar}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || "User"}
            </p>
            <span
              className={`inline-block px-2 py-0.5 mt-0.5 text-[10px] font-bold rounded-full border ${getRoleBadgeColor()}`}
            >
              {user?.role || "Customer"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6 custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Logout Footer Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition border border-rose-200/50 dark:border-rose-900/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {SidebarContent}
      </div>
    </>
  );
}
