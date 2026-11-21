"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import Swal from "sweetalert2";
import {
  X,
  Calendar,
  Layers,
  MapPin,
  Phone,
  FileText,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Lock,
  Loader2,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: {
    _id: string;
    name: string;
    category: string;
    rentalPrice: number;
    rentalType?: string;
    availableQuantity: number;
    location: string;
    image?: string;
  };
}

export function BookingModal({
  isOpen,
  onClose,
  equipment,
}: BookingModalProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Helper for date string (YYYY-MM-DD)
  const getTodayString = () => new Date().toISOString().split("T")[0];
  const getTomorrowString = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 2);
    return tmr.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState<string>(getTodayString());
  const [endDate, setEndDate] = useState<string>(getTomorrowString());
  const [quantity, setQuantity] = useState<number>(1);
  const [contactNumber, setContactNumber] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>(equipment.location || "");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const maxStock = equipment.availableQuantity || 1;

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const daysCount = calculateDays();
  const dailyRate = equipment.rentalPrice || 0;
  const subtotal = dailyRate * daysCount * quantity;
  const refundableDeposit = 100; // Flat refundable security deposit
  const totalAmount = subtotal + refundableDeposit;

  // Quantity handlers
  const handleIncreaseQty = () => {
    if (quantity < maxStock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please sign in to complete your equipment booking.",
      });
      router.push(`/login?redirect=/equipment/${equipment._id}`);
      return;
    }

    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Dates",
        text: "Please select both a start and end rental date.",
      });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Dates",
        text: "Rental end date must be after the start date.",
      });
      return;
    }

    if (!contactNumber.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Contact Phone Required",
        text: "Please enter a valid phone number so the owner can coordinate handover.",
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Delivery / Site Address Required",
        text: "Please specify the site address where equipment will be operated.",
      });
      return;
    }

    const bookingPayload = {
      equipmentId: equipment._id,
      equipmentName: equipment.name,
      startDate,
      endDate,
      quantity,
      daysCount,
      subtotal,
      refundableDeposit,
      totalAmount,
      contactNumber,
      deliveryAddress,
      notes,
    };

    // Save pending booking details in session storage for the confirmation page
    sessionStorage.setItem("equiphub_pending_booking", JSON.stringify(bookingPayload));

    setSubmitting(true);
    try {
      const res = await api.post("/payments/create-checkout-session", {
        equipmentId: equipment._id,
        startDate,
        endDate,
        quantity,
        contactNumber,
        deliveryAddress,
        notes,
      });

      if (res.data?.success && res.data?.url) {
        // Redirect directly to Stripe Checkout
        window.location.href = res.data.url;
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: res.data?.message || "Failed to create checkout session.",
        });
        setSubmitting(false);
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Checkout Error",
        text: err.response?.data?.message || err.message || "Failed to initiate payment.",
      });
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Book Equipment Rental
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {equipment.name} • ${equipment.rentalPrice} / day
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Rental Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  min={getTodayString()}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Rental End Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  min={startDate || getTodayString()}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quantity Selector & Stock Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Required Quantity
              </label>
              <span className="text-xs text-slate-400">
                In Stock: <strong className="text-emerald-600">{maxStock} units</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={handleDecreaseQty}
                  disabled={quantity <= 1 || submitting}
                  className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseQty}
                  disabled={quantity >= maxStock || submitting}
                  className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                × ${dailyRate} per day for {daysCount} day{daysCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Contact & Delivery Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+880 1700-000000"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Site / Delivery Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Street, City, Project Location"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Specific pickup time, operator requirements, site access instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dynamic Price Breakdown Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center justify-between">
              <span>Rental Cost Calculation</span>
              <span className="font-semibold">{daysCount} Days Duration</span>
            </h4>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>
                  Base Rate (${dailyRate} × {quantity} unit × {daysCount} day{daysCount > 1 ? "s" : ""})
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>Refundable Security Deposit</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">(Refunded on return)</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">${refundableDeposit}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Total Payable Now:
              </span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                ${totalAmount}
              </span>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirecting to Stripe Checkout...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Stripe Checkout (${totalAmount})</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Escrow protected checkout via Stripe • 100% refund policy</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
