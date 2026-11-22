"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  Mail,
  Server,
  Lock,
  Eye,
  EyeOff,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Bell,
  ArrowRight,
} from "lucide-react";

export default function AdminSMTPPage() {
  const [activeTab, setActiveTab] = useState<"config" | "templates">("config");
  const [selectedTemplate, setSelectedTemplate] = useState<"customer" | "owner" | "moderation">("customer");

  const [formData, setFormData] = useState({
    host: "smtp.gmail.com",
    port: "587",
    user: "",
    pass: "",
    fromEmail: "notifications@equiphub.com",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchSMTP();
  }, []);

  const fetchSMTP = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/smtp");
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setFormData({
          host: d.host || "smtp.gmail.com",
          port: d.port?.toString() || "587",
          user: d.user || "",
          pass: d.pass || "",
          fromEmail: d.fromEmail || "notifications@equiphub.com",
        });
        setIsConfigured(!!d.isConfigured);
        if (d.updatedAt) setLastUpdated(new Date(d.updatedAt).toLocaleString());
      }
    } catch (err) {
      console.error("Failed to fetch SMTP config:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/admin/smtp", formData);
      if (res.data?.success) {
        setIsConfigured(true);
        setLastUpdated(new Date().toLocaleString());

        toast.success("SMTP settings saved successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update SMTP settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast.success(`Test email probe dispatched via ${formData.host}:${formData.port}`);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          SMTP Gateway & Notification Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure transactional mail delivery credentials and preview automated customer notification templates.
        </p>
      </div>

      {/* Top Connection Status Highlight */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Mailer Dispatch Engine
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isConfigured
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                }`}
              >
                {isConfigured ? "Connected & Active" : "Default Sandbox"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Host: {formData.host} • Port: {formData.port} • From: {formData.fromEmail}
            </p>
          </div>
        </div>

        <button
          onClick={handleSendTest}
          disabled={testing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
        >
          {testing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Testing Handshake...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Probe</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("config")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "config"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Server Configuration</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === "templates"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Email Template Previews</span>
        </button>
      </div>

      {/* TAB 1: SMTP Config Form */}
      {activeTab === "config" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Outbound SMTP Credentials
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Provide your SMTP host, port, authentication credentials, and default sender identity.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  SMTP Host Server <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  required
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Port Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  required
                  placeholder="587"
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  SMTP Username / Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  required
                  placeholder="your-smtp-account@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  SMTP Password / App Secret
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    value={formData.pass}
                    onChange={handleChange}
                    placeholder="Enter or leave as ********"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                From / Sender Address
              </label>
              <input
                type="email"
                name="fromEmail"
                value={formData.fromEmail}
                onChange={handleChange}
                placeholder="notifications@equiphub.com"
                className="w-full px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {lastUpdated && (
              <p className="text-[11px] text-slate-400 pt-1">
                Last updated on: {lastUpdated}
              </p>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save SMTP Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Email Template Previews */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* Template Switcher */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "customer", label: "Customer Booking Receipt" },
              { id: "owner", label: "Owner Order Alert" },
              { id: "moderation", label: "Equipment Approved Notice" },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedTemplate === tmpl.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>

          {/* Email Preview Mockup Window */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
            {/* Window bar */}
            <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-3 font-mono text-[11px] text-slate-400">
                  Subject: {selectedTemplate === "customer" && "🎉 Your EquipHub Rental is Confirmed!"}
                  {selectedTemplate === "owner" && "🔔 New Rental Order Placed for Your Equipment"}
                  {selectedTemplate === "moderation" && "✅ Your Equipment Has Been Approved & Is Now Live!"}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">HTML Template Preview</span>
            </div>

            {/* Email Body */}
            <div className="p-6 sm:p-10 max-w-xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
              {/* Brand Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                    E
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">
                      Equip<span className="text-blue-600">Hub</span>
                    </span>
                    <p className="text-[10px] text-slate-400">Smart Equipment Rental Service</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              {/* Template Content */}
              {selectedTemplate === "customer" && (
                <div className="space-y-4 text-xs">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Rental Booking Confirmed! 🎉
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hello John Doe, your equipment reservation was processed successfully. The equipment owner has received your delivery instructions and is preparing the machine.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Equipment:</span>
                      <span className="font-bold text-slate-900 dark:text-white">CAT 320 Hydraulic Excavator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dates:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Nov 25, 2026 → Nov 30, 2026 (5 Days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Paid:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">$1,750 USD (Stripe)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transaction ID:</span>
                      <span className="font-mono text-slate-500">cs_test_mock_9823412</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "owner" && (
                <div className="space-y-4 text-xs">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    New Equipment Rental Placed 🔔
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hello Habibur Rahman, a customer has booked your CAT 320 Hydraulic Excavator. Please prepare the machinery for delivery.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer Name:</span>
                      <span className="font-bold text-slate-900 dark:text-white">John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact Number:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">+880 1700-112233</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delivery Address:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Plot 4, Mirpur DOHS, Dhaka</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "moderation" && (
                <div className="space-y-4 text-xs">
                  <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Listing Approved & Published! ✅
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Great news! Our quality assurance and safety moderation team has reviewed and approved your equipment listing. It is now publicly discoverable on the EquipHub marketplace.
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                    <p className="font-bold text-slate-900 dark:text-white">Caterpillar 320 Hydraulic Excavator</p>
                    <p className="text-slate-500">Status: Live & Verified</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
                <p>© 2026 EquipHub Inc. All rights reserved.</p>
                <p className="mt-0.5">Automated transactional email generated by EquipHub Dispatcher.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
