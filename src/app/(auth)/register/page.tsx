"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { uploadToImgBB } from "@/utils/uploadImage";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, socialLogin, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Customer",
    avatar: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Live password validation checks
  const password = formData.password;
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const passwordsMatch = password.length > 0 && password === formData.confirmPassword;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // Handle image file selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadToImgBB(file);
      setFormData((prev) => ({ ...prev, avatar: url }));
      setImagePreview(url);
    } catch (err: any) {
      toast.error(err.message || "Could not upload image. You can also paste an image URL directly.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please enter your name and email address.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password must have at least 6 characters, including 1 uppercase and 1 lowercase letter.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Please make sure your password and confirmation match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      });

      if (result.success) {
        if (formData.role === "Owner") {
          toast.success("Account registered! Your Owner application has been submitted to Admin for review.", { duration: 5000 });
        } else {
          toast.success("Registration successful! Welcome to EquipHub.");
        }
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to complete registration.");
    } finally {
      setSubmitting(false);
    }
  };

  // One-click Google Social Sign Up
  const handleGoogleLogin = async () => {
    setSocialLoading("google");
    try {
      const demoGoogleUser = {
        name: "Google Customer",
        email: "google.customer@equiphub.com",
        photoURL:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        provider: "Google",
      };

      const result = await socialLogin(demoGoogleUser);
      if (result.success) {
        toast.success("Signed in with Google!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Could not complete Google authentication.");
      }
    } catch (err: any) {
      toast.error(err.message || "Google sign-in encountered an error.");
    } finally {
      setSocialLoading(null);
    }
  };

  // One-click GitHub Social Sign Up
  const handleGitHubLogin = async () => {
    setSocialLoading("github");
    try {
      const demoGitHubUser = {
        name: "GitHub Developer",
        email: "github.developer@equiphub.com",
        photoURL:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        provider: "GitHub",
      };

      const result = await socialLogin(demoGitHubUser);
      if (result.success) {
        toast.success("Signed in with GitHub!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Could not complete GitHub authentication.");
      }
    } catch (err: any) {
      toast.error(err.message || "GitHub sign-in encountered an error.");
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-md">
            E
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Join EquipHub to rent or list equipment with ease.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "Customer" })}
                className={`py-2 px-3 text-sm font-medium rounded-xl border text-center transition-all ${
                  formData.role === "Customer"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                    : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                Rent Equipment
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "Owner" })}
                className={`py-2 px-3 text-sm font-medium rounded-xl border text-center transition-all ${
                  formData.role === "Owner"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                    : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                List / Own Gear
              </button>
            </div>
            {formData.role === "Owner" && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Owner Review Note:</strong> Your application to list machinery will be submitted to the Admin for approval. You can browse and rent immediately while review is completed.
                </span>
              </div>
            )}
          </div>

          {/* Avatar Photo (Upload or URL) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950/40 dark:file:text-blue-400 cursor-pointer"
                />
                {uploadingImage && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Real-time Password Rules Checklist */}
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div
                className={`flex items-center gap-1.5 ${
                  hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                }`}
              >
                {hasMinLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>At least 6 characters long</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                }`}
              >
                {hasUppercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasLowercase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                }`}
              >
                {hasLowercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>At least one lowercase letter (a-z)</span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-rose-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploadingImage || !isPasswordValid || !passwordsMatch}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social Sign Up Buttons (Google & GitHub) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting || !!socialLoading}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {socialLoading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            )}
            <span>Google</span>
          </button>

          {/* GitHub Button */}
          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={submitting || !!socialLoading}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-800 dark:border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {socialLoading === "github" ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span>GitHub</span>
          </button>
        </div>

        {/* Redirect to Login */}
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
