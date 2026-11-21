import Link from "next/link";
import { Wrench, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
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
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <Wrench className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Verified Equipment</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top grade gear inspected and approved for hassle-free performance.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-semibold text-lg">Secure Bookings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Protected transactions powered by Stripe with instant confirmation.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
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
            Step 1 Complete • Next.js App Router Architecture Initialized
          </p>
        </div>
      </div>
    </main>
  );
}
