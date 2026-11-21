"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, MessageSquare, Wrench } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8 text-center space-y-6">
        {/* Cancel Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-md">
          <XCircle className="w-10 h-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payment Cancelled
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your Stripe checkout session was cancelled or timed out. No funds have been deducted from your card.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-left space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Why did this happen?
          </p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>You chose to cancel the payment process.</li>
            <li>The browser session expired.</li>
            <li>You can retry whenever you are ready.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/equipment"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again & Browse Equipment</span>
          </Link>

          <Link
            href="/contact"
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Need Help? Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
