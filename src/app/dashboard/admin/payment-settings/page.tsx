"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import {
  CreditCard,
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  RefreshCw,
  Zap,
  DollarSign,
  Percent,
  Sliders,
  Shield,
  ExternalLink,
  HelpCircle,
  ArrowRight,
} from "lucide-react";



export default function AdminPaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState<"credentials" | "escrow">("credentials");

  const [formData, setFormData] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
    currency: "USD",
    mode: "test",
    escrowPercentage: 10,
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/payment-settings");
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setFormData({
          publishableKey: d.publishableKey || "",
          secretKey: d.secretKey || "",
          webhookSecret: d.webhookSecret || "",
          currency: d.currency || "USD",
          mode: d.mode || "test",
          escrowPercentage: d.escrowPercentage ?? 10,
        });
        setIsConfigured(!!d.isConfigured);
        if (d.updatedAt) setLastUpdated(new Date(d.updatedAt).toLocaleString());
      }
    } catch (err) {
      console.error("Failed to fetch payment gateway settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/admin/payment-settings", formData);
      if (res.data?.success) {
        setIsConfigured(true);
        setLastUpdated(new Date().toLocaleString());

        toast.success("Payment gateway credentials saved successfully!");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update payment settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.post("/admin/payment-settings/test", {
        secretKey: formData.secretKey,
      });
      if (res.data?.success) {
        setTestResult({
          success: true,
          message: res.data.message || "Stripe Gateway is operational!",
        });

        toast.success("Stripe connection verified successfully!");
      } else {
        throw new Error(res.data?.message || "Verification failed");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not connect to Stripe API.";
      setTestResult({
        success: false,
        message: msg,
      });

      toast.error(msg);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Financial Infrastructure Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Payment Gateway & Escrow Settings 💳
          </h1>
          <p className="mt-2 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Configure live Stripe credentials, switch transaction modes, adjust platform escrow
            fee percentages, and test live checkout connectivity.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 -mb-10 w-48 h-48 rounded-full bg-purple-400/20 blur-xl pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("credentials")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === "credentials"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Stripe API Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab("escrow")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === "escrow"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Escrow Protocol & Security</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading Payment Gateway Configuration...
          </p>
        </div>
      ) : activeTab === "credentials" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Credentials Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <form
              onSubmit={handleSave}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Sliders className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Stripe Gateway Parameters
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      formData.mode === "live"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.mode === "live" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                      }`}
                    />
                    {formData.mode === "live" ? "Live Mode" : "Test / Sandbox"}
                  </span>
                </div>
              </div>

              {/* Mode & Currency Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Environment Mode
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="test">Test / Sandbox (Simulation)</option>
                    <option value="live">Live / Production (Real Cards)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Settlement Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                    <option value="EUR">EUR (€) - Eurozone</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>
              </div>

              {/* Stripe Publishable Key */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Stripe Publishable Key <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="publishableKey"
                    value={formData.publishableKey}
                    onChange={handleChange}
                    required
                    placeholder="pk_test_51MockStripeKey..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Publicly exposed key used by Next.js Stripe Elements for secure tokenization.
                </p>
              </div>

              {/* Stripe Secret Key */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Stripe Secret Key <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSecretKey ? "text" : "password"}
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    required
                    placeholder="sk_test_..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Restricted to backend only. Encrypted and never shared with client-side code.
                </p>
              </div>

              {/* Webhook Secret */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Stripe Webhook Signing Secret
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showWebhookSecret ? "text" : "password"}
                    name="webhookSecret"
                    value={formData.webhookSecret}
                    onChange={handleChange}
                    placeholder="whsec_..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Validates incoming Stripe checkout webhook events against tampering.
                </p>
              </div>

              {/* Platform Escrow Fee Percentage */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Platform Escrow Commission Fee (%)
                </label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    name="escrowPercentage"
                    min="0"
                    max="50"
                    value={formData.escrowPercentage}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Platform cut retained from gross rental volume upon customer completion.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying with Stripe...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Test Stripe Connection</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Gateway Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Test Connection Result Notice */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 animate-fadeIn ${
                  testResult.success
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {testResult.success ? "Connection Verified!" : "Connection Test Failed"}
                  </h4>
                  <p className="text-xs mt-0.5 leading-relaxed">{testResult.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Gateway Status & Help Cards */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <CreditCard className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Gateway Operational Status
                </h3>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Integration</span>
                  <span className="font-bold text-slate-900 dark:text-white">Stripe Escrow API</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Configuration</span>
                  <span
                    className={`font-bold ${
                      isConfigured
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isConfigured ? "Active & Configured" : "Default Test Keys"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Base Currency</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formData.currency}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Escrow Hold Rate</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formData.escrowPercentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">Last Synchronized</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {lastUpdated || "System Default"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Guide Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>How to Get Stripe API Keys</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                <li>Log in to your <strong>dashboard.stripe.com</strong> account.</li>
                <li>Go to <strong>Developers &gt; API keys</strong>.</li>
                <li>Copy the <strong>Publishable key</strong> (`pk_...`) and paste it above.</li>
                <li>Reveal and copy the <strong>Secret key</strong> (`sk_...`) and paste it above.</li>
                <li>Click <strong>Test Stripe Connection</strong> to verify live validity.</li>
              </ol>
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
              >
                <span>Open Stripe Developer Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Escrow Protocol Tab */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              EquipHub Smart Escrow Payment Protocol
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              EquipHub safeguards both equipment owners and customers through a two-sided escrow hold.
              Transactions are pre-authorized and captured into platform escrow upon checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Customer Checkout
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Customer pays total rental price plus refundable security deposit via Stripe.
                Funds are immediately locked in escrow.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Active Rental Period
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The equipment owner delivers or coordinates pickup. The equipment is marked Active.
                Funds stay frozen to prevent dispute fraud.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Automated Payout
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Once the owner and customer verify safe equipment return, {100 - (formData.escrowPercentage || 10)}%
                is released to the owner and the security deposit is refunded.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
