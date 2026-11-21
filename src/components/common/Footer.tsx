"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide public marketing footer entirely on all dashboard routes
  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Mission (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Equip<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              EquipHub is the modern smart equipment rental marketplace connecting verified equipment
              owners with professionals, contractors, and event creators.
            </p>

            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>support@equiphub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>+880 1700-000000</span>
              </div>
            </div>

            {/* Social Icons with Updated X Branding */}
            <div className="flex items-center gap-3 pt-2">
              {/* New X (formerly Twitter) Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-700 hover:border-blue-500 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/abdullahalnoman-3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-slate-400 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="hover:text-blue-600 transition-colors">
                  All Equipment
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/equipment?category=Heavy+Machinery" className="hover:text-blue-600 transition-colors">
                  Heavy Machinery
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Power+Tools" className="hover:text-blue-600 transition-colors">
                  Power Tools
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Farming+Equipment" className="hover:text-blue-600 transition-colors">
                  Farming Equipment
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Audio%2FVisual+%26+Event+Tech" className="hover:text-blue-600 transition-colors">
                  Audio/Visual Gear
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Construction+%26+Hand+Tools" className="hover:text-blue-600 transition-colors">
                  Construction Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & Security
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-500">Stripe Escrow Payments</span>
              </li>
              <li>
                <span className="text-slate-500">Verified Equipment Owners</span>
              </li>
              <li>
                <span className="text-slate-500">Security Deposit Policy</span>
              </li>
              <li>
                <span className="text-slate-500">24/7 Customer Care</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            © {currentYear} <strong className="text-slate-700 dark:text-slate-300">EquipHub</strong>. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Connected
            </span>
            <span>•</span>
            <span>Assignment 9 - Category 003</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
