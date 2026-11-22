"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import {
  Share2,
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  HelpCircle,
  Globe,
  Check,
  Info,
  Sparkles,
} from "lucide-react";

interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  isEnabled: boolean;
  redirectUri: string;
  originUri?: string;
  homepageUrl?: string;
}

export default function AdminSocialSettingsPage() {
  const [google, setGoogle] = useState<ProviderConfig>({
    clientId: "",
    clientSecret: "",
    isEnabled: true,
    redirectUri: "http://localhost:3000/api/auth/callback/google",
    originUri: "http://localhost:3000",
  });

  const [github, setGithub] = useState<ProviderConfig>({
    clientId: "",
    clientSecret: "",
    isEnabled: true,
    redirectUri: "http://localhost:3000/api/auth/callback/github",
    homepageUrl: "http://localhost:3000",
  });

  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [showGithubSecret, setShowGithubSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchSocialSettings();
  }, []);

  const fetchSocialSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/social-settings");
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        if (d.google) {
          setGoogle({
            clientId: d.google.clientId || "",
            clientSecret: d.google.clientSecret || "",
            isEnabled: d.google.isEnabled !== false,
            redirectUri: d.google.redirectUri || "http://localhost:3000/api/auth/callback/google",
            originUri: d.google.originUri || "http://localhost:3000",
          });
        }
        if (d.github) {
          setGithub({
            clientId: d.github.clientId || "",
            clientSecret: d.github.clientSecret || "",
            isEnabled: d.github.isEnabled !== false,
            redirectUri: d.github.redirectUri || "http://localhost:3000/api/auth/callback/github",
            homepageUrl: d.github.homepageUrl || "http://localhost:3000",
          });
        }
        if (d.updatedAt) {
          setLastUpdated(new Date(d.updatedAt).toLocaleString());
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch social settings:", err);
      toast.error(err.response?.data?.message || "Failed to load social login credentials");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(label);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        google,
        github,
      };

      const res = await api.patch("/admin/social-settings", payload);
      if (res.data?.success) {
        toast.success("Social login credentials and redirect URLs saved successfully!");
        setLastUpdated(new Date().toLocaleString());
        if (res.data.data?.google?.clientSecret) {
          setGoogle((prev) => ({ ...prev, clientSecret: "********" }));
        }
        if (res.data.data?.github?.clientSecret) {
          setGithub((prev) => ({ ...prev, clientSecret: "********" }));
        }
      } else {
        toast.error(res.data?.message || "Failed to save settings");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving credentials");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
        <p className="text-slate-500 font-medium">Loading Social Login credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-14">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <span>Administration</span>
            <span>•</span>
            <span>Authentication</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Share2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Social Login Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Configure Google OAuth 2.0 and GitHub OAuth App credentials, secrets, and copy
            authorized redirect URIs for your external developer consoles.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {lastUpdated && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Updated: {lastUpdated}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Google OAuth Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-red-500/5 via-amber-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Google OAuth 2.0 Credentials
                  {google.isEnabled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Disabled
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Allow customers and owners to sign in seamlessly using their Google accounts.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {google.isEnabled ? "Enabled" : "Disabled"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={google.isEnabled}
                  onChange={(e) =>
                    setGoogle((prev) => ({ ...prev, isEnabled: e.target.checked }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    google.isEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                />
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                    google.isEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google Client ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Google Client ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={google.clientId}
                    onChange={(e) =>
                      setGoogle((prev) => ({ ...prev, clientId: e.target.value }))
                    }
                    placeholder="e.g. 1234567890-abcdefgh.apps.googleusercontent.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Generated inside the Google Cloud Console &gt; APIs &amp; Services &gt; Credentials.
                </p>
              </div>

              {/* Google Client Secret */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Google Client Secret
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showGoogleSecret ? "text" : "password"}
                    value={google.clientSecret}
                    onChange={(e) =>
                      setGoogle((prev) => ({ ...prev, clientSecret: e.target.value }))
                    }
                    placeholder="Enter or replace secret..."
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGoogleSecret(!showGoogleSecret)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showGoogleSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Stored securely in database. Enter new secret to overwrite.
                </p>
              </div>
            </div>

            {/* Google Redirect URIs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Authorized Redirect URI */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    Authorized Redirect URI
                    <span className="text-[10px] lowercase font-normal px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      required in google
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(google.redirectUri, "Google Redirect URI")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                  >
                    {copiedKey === "Google Redirect URI" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy URI
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={google.redirectUri}
                    onChange={(e) =>
                      setGoogle((prev) => ({ ...prev, redirectUri: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70 text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Paste this exact callback URI in your Google Cloud Console OAuth 2.0 Web Client.
                </p>
              </div>

              {/* Authorized JavaScript Origin */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Authorized JavaScript Origin
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(google.originUri || "http://localhost:3000", "Google Origin")
                    }
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                  >
                    {copiedKey === "Google Origin" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Origin
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={google.originUri || "http://localhost:3000"}
                    onChange={(e) =>
                      setGoogle((prev) => ({ ...prev, originUri: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70 text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Domain origin allowed to execute Google Sign-In requests.
                </p>
              </div>
            </div>

            {/* Quick Steps Guide Box */}
            <div className="rounded-xl p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Google Cloud Console Configuration Instructions:
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-600 dark:text-slate-300">
                <li>
                  Visit{" "}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-600 dark:text-blue-400 inline-flex items-center gap-0.5"
                  >
                    Google Cloud Credentials <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </li>
                <li>Click <strong>+ CREATE CREDENTIALS</strong> &gt; <strong>OAuth client ID</strong>.</li>
                <li>Select Application Type: <strong>Web application</strong>.</li>
                <li>Under <strong>Authorized redirect URIs</strong>, paste the copyable Redirect URI shown above.</li>
                <li>Save and copy your <strong>Client ID</strong> and <strong>Client secret</strong> into the form above.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* GitHub OAuth App Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-500/5 via-indigo-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-950 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  GitHub OAuth App Credentials
                  {github.isEnabled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Disabled
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Allow developers, engineering clients, and owners to sign in using their GitHub profiles.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {github.isEnabled ? "Enabled" : "Disabled"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={github.isEnabled}
                  onChange={(e) =>
                    setGithub((prev) => ({ ...prev, isEnabled: e.target.checked }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    github.isEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                />
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                    github.isEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Client ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  GitHub Client ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={github.clientId}
                    onChange={(e) =>
                      setGithub((prev) => ({ ...prev, clientId: e.target.value }))
                    }
                    placeholder="e.g. Iv1.8a2b3c4d5e6f7g8h"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Generated inside GitHub &gt; Settings &gt; Developer settings &gt; OAuth Apps.
                </p>
              </div>

              {/* GitHub Client Secret */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  GitHub Client Secret
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showGithubSecret ? "text" : "password"}
                    value={github.clientSecret}
                    onChange={(e) =>
                      setGithub((prev) => ({ ...prev, clientSecret: e.target.value }))
                    }
                    placeholder="Enter or replace secret..."
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGithubSecret(!showGithubSecret)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showGithubSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Stored securely in database. Enter new secret to overwrite.
                </p>
              </div>
            </div>

            {/* GitHub Redirect & Homepage URIs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Authorization Callback URL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    Authorization Callback URL
                    <span className="text-[10px] lowercase font-normal px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      required in github
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(github.redirectUri, "GitHub Callback URL")
                    }
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                  >
                    {copiedKey === "GitHub Callback URL" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy URL
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={github.redirectUri}
                    onChange={(e) =>
                      setGithub((prev) => ({ ...prev, redirectUri: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70 text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Paste this exact callback URL into your GitHub OAuth App settings.
                </p>
              </div>

              {/* Homepage URL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Homepage URL
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        github.homepageUrl || "http://localhost:3000",
                        "GitHub Homepage URL"
                      )
                    }
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                  >
                    {copiedKey === "GitHub Homepage URL" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy URL
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={github.homepageUrl || "http://localhost:3000"}
                    onChange={(e) =>
                      setGithub((prev) => ({ ...prev, homepageUrl: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70 text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Application website homepage URL entered in GitHub Developer portal.
                </p>
              </div>
            </div>

            {/* Quick Steps Guide Box */}
            <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                GitHub OAuth App Setup Instructions:
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-slate-600 dark:text-slate-300">
                <li>
                  Go to{" "}
                  <a
                    href="https://github.com/settings/developers"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-600 dark:text-blue-400 inline-flex items-center gap-0.5"
                  >
                    GitHub Developer Settings <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </li>
                <li>Select <strong>OAuth Apps</strong> &gt; Click <strong>New OAuth App</strong>.</li>
                <li>Application name: <strong>EquipHub Rental Platform</strong>.</li>
                <li>Homepage URL: paste the Homepage URL copied above.</li>
                <li>Authorization callback URL: paste the Authorization Callback URL copied above.</li>
                <li>Click <strong>Register application</strong>, then click <strong>Generate a new client secret</strong>.</li>
                <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong> into the inputs above and click Save Changes.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Configuration...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Social Login Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
