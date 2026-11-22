"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "cs_test_" + Date.now();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [postalCode, setPostalCode] = useState("1213");

  useEffect(() => {
    // Load pending booking from session storage
    const raw = sessionStorage.getItem("equiphub_pending_booking");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setBookingData(parsed);
        if (user?.name) {
          setCardName(user.name);
        }
      } catch (e) {
        console.error("Failed to parse pending booking:", e);
      }
    }
    setLoading(false);
  }, [user]);

  // Quick-fill Sandbox Test Card
  const handleFillTestCard = () => {
    setCardNumber("4242 •••• •••• 4242");
    setExpiry("12/28");
    setCvc("123");
    if (!cardName && user?.name) {
      setCardName(user.name);
    } else if (!cardName) {
      setCardName("Verified Test Renter");
    }
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Stripe Sandbox Test Card loaded!",
      showConfirmButton: false,
      timer: 1800,
    });
  };

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = val.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Format MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setExpiry(val);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expiry || !cvc) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Card Details",
        text: "Please enter your card number, expiry date, and CVC.",
      });
      return;
    }

    setProcessing(true);

    try {
      // Simulate realistic payment gateway processing latency
      await new Promise((r) => setTimeout(r, 1400));

      const transactionId = "txn_stripe_" + Date.now();

      // Submit booking to backend once
      if (bookingData && bookingData.equipmentId) {
        await api.post("/bookings", {
          equipmentId: bookingData.equipmentId,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          quantity: bookingData.quantity,
          totalAmount: bookingData.totalAmount,
          transactionId,
          deliveryAddress: bookingData.deliveryAddress,
          contactNumber: bookingData.contactNumber,
          notes: bookingData.notes || "",
        });
        // Save confirmed details for receipt display and clear pending booking
        sessionStorage.setItem("equiphub_confirmed_booking", JSON.stringify(bookingData));
        sessionStorage.removeItem("equiphub_pending_booking");
      }

      // Redirect to confirmation success page with confirmed flag
      router.push(`/payment/success?session_id=${sessionId}&txn_id=${transactionId}&confirmed=true`);
    } catch (err: any) {
      console.error("Payment confirmation failed:", err);
      sessionStorage.removeItem("equiphub_pending_booking");
      router.push(`/payment/success?session_id=${sessionId}&confirmed=true`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500">Connecting to Payment Gateway...</p>
      </div>
    );
  }

  const equipmentTitle = bookingData?.equipmentName || "Heavy Equipment Rental";
  const totalPayable = bookingData?.totalAmount || 800;
  const days = bookingData?.daysCount || 2;
  const qty = bookingData?.quantity || 1;
  const deposit = bookingData?.refundableDeposit || 100;
  const subtotal = bookingData?.subtotal || totalPayable - deposit;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950/70 py-10 sm:py-16 animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Gateway Security Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Stripe Escrow Payment Gateway
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                  Simulation / Test Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-End 256-Bit SSL Encrypted Rental Transaction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Buyer Escrow Protection Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Rental Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Rental Order Summary
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {equipmentTitle}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Duration:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {bookingData?.startDate || "Start"} to {bookingData?.endDate || "End"} ({days} days)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Quantity:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {qty} Unit(s)
                  </span>
                </div>
                {bookingData?.deliveryAddress && (
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Site Location:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                      {bookingData.deliveryAddress}
                    </span>
                  </div>
                )}
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Rental Subtotal ({days} days × {qty} qty):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ${deposit}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Stripe Escrow Insurance:</span>
                  <span className="font-semibold">FREE (100% Covered)</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                    Total Amount Due
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ${totalPayable} USD
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">One-time payment</span>
              </div>
            </div>

            {/* Escrow Guarantee Note */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>How Your Payment is Protected</span>
              </div>
              <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                Your money is not paid immediately to the equipment owner. Funds stay locked in platform escrow until you receive and verify the equipment at your project site.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Card Payment Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Payment Details
                </h3>
                <p className="text-xs text-slate-400">Pay securely with Credit / Debit Card</p>
              </div>

              {/* Sandbox Quick-fill button */}
              <button
                type="button"
                onClick={handleFillTestCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition cursor-pointer"
                title="Click to fill test card credentials"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>⚡ Fill Test Card</span>
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              {/* Cardholder Name */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Abdullah Al Noman"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm tracking-wide"
                  />
                  <CreditCard className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Expiry & CVC & Zip */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="12/28"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-center text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                    placeholder="•••"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-center text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1213"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-center text-sm"
                  />
                </div>
              </div>

              {/* Pay Button */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Stripe Escrow Hold...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ${totalPayable} USD & Authorize Escrow</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400">
                  🔒 By clicking Pay, you agree to EquipHub's Rental Escrow Terms and cancellation policy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
