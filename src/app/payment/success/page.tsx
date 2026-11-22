"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Copy,
  Check,
  FileCheck,
  Home,
} from "lucide-react";
import Swal from "sweetalert2";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryTxnId = searchParams.get("txn_id");
  const alreadyConfirmed = searchParams.get("confirmed") === "true";

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [transactionId, setTransactionId] = useState<string>(queryTxnId || "");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const hasProcessedRef = React.useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const processBooking = async () => {
      try {
        setLoading(true);

        // Retrieve booking data from session storage
        const confirmedRaw = sessionStorage.getItem("equiphub_confirmed_booking");
        const pendingRaw = sessionStorage.getItem("equiphub_pending_booking");
        sessionStorage.removeItem("equiphub_pending_booking"); // clear immediately

        let parsedBooking: any = null;
        if (confirmedRaw) {
          try {
            parsedBooking = JSON.parse(confirmedRaw);
          } catch (e) {}
        } else if (pendingRaw) {
          try {
            parsedBooking = JSON.parse(pendingRaw);
          } catch (e) {}
        }

        if (parsedBooking) {
          setBookingDetails(parsedBooking);
        }

        let txnId = queryTxnId || "txn_" + Date.now();

        // Verify session with backend if session_id is present
        if (sessionId && !queryTxnId) {
          try {
            const verifyRes = await api.get(`/payments/verify-session/${sessionId}`);
            if (verifyRes.data?.success) {
              txnId = verifyRes.data.transactionId || sessionId;
            }
          } catch (e) {
            txnId = sessionId;
          }
        }
        setTransactionId(txnId);

        // Only persist if this was an external Stripe redirect and not already submitted
        if (!alreadyConfirmed && parsedBooking && parsedBooking.equipmentId) {
          try {
            await api.post("/bookings", {
              equipmentId: parsedBooking.equipmentId,
              startDate: parsedBooking.startDate,
              endDate: parsedBooking.endDate,
              quantity: parsedBooking.quantity,
              totalAmount: parsedBooking.totalAmount,
              transactionId: txnId,
              deliveryAddress: parsedBooking.deliveryAddress,
              contactNumber: parsedBooking.contactNumber,
              notes: parsedBooking.notes || "",
            });
          } catch (bookErr) {
            console.error("Booking record notice:", bookErr);
          }
        }

        setVerified(true);
      } finally {
        setLoading(false);
      }
    };

    processBooking();
  }, [sessionId]);

  const handleCopyTransaction = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Confirming Your Rental Payment...
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Securing Stripe escrow reservation and recording booking data.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 lg:py-16 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8 animate-in zoom-in-95 duration-300">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Rental Payment Confirmed!
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Your rental reservation has been successfully placed. Your payment is safely held in Stripe Escrow.
          </p>
        </div>

        {/* Transaction Reference Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Stripe Transaction ID
            </span>
            <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white truncate">
              {transactionId || "txn_live_confirmed"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyTransaction}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 shrink-0 cursor-pointer transition-colors"
            title="Copy Transaction ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Booking Summary Card */}
        {bookingDetails && (
          <div className="p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              <span>Rental Summary</span>
            </h3>

            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-blue-100 dark:border-blue-900">
                <span className="text-slate-500">Equipment:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {bookingDetails.equipmentName || "Approved Rental Equipment"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-blue-100 dark:border-blue-900">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold">
                  {bookingDetails.startDate} to {bookingDetails.endDate} ({bookingDetails.daysCount} days)
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-blue-100 dark:border-blue-900">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold">{bookingDetails.quantity} Unit(s)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-blue-100 dark:border-blue-900">
                <span className="text-slate-500">Refundable Deposit:</span>
                <span className="font-semibold text-emerald-600">${bookingDetails.refundableDeposit}</span>
              </div>

              <div className="flex justify-between py-1 pt-2 font-bold text-base text-slate-900 dark:text-white">
                <span>Total Amount Paid:</span>
                <span className="text-blue-600 dark:text-blue-400 font-black">
                  ${bookingDetails.totalAmount}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Protection Note */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          <p className="leading-relaxed">
            Your funds are safely held in escrow. Funds will only be released to the equipment owner once you confirm delivery/handover. An automated email receipt has also been dispatched.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/dashboard/my-rentals"
            className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>My Rentals Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/equipment"
            className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Browse More Gear</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
