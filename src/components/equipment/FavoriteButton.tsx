"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { Heart, Loader2 } from "lucide-react";

interface FavoriteButtonProps {
  equipmentId: string;
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({
  equipmentId,
  className = "",
  showText = false,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  // Check initial favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      if (!isAuthenticated || !equipmentId) {
        setChecking(false);
        return;
      }

      try {
        const res = await api.get(`/favorites/check/${equipmentId}`);
        if (res.data?.success) {
          setIsFavorite(!!res.data.isFavorite);
        }
      } catch (err) {
        // Check local storage fallback
        const saved = localStorage.getItem(`fav_${equipmentId}`);
        if (saved === "true") {
          setIsFavorite(true);
        }
      } finally {
        setChecking(false);
      }
    };

    checkFavorite();
  }, [equipmentId, isAuthenticated]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: "info",
        title: "Please sign in to save items to your favorites",
      });
      router.push(`/login?redirect=/equipment/${equipmentId}`);
      return;
    }

    setLoading(true);
    const nextState = !isFavorite;

    // Optimistic UI update
    setIsFavorite(nextState);

    try {
      if (nextState) {
        await api.post("/favorites", { equipmentId });
        localStorage.setItem(`fav_${equipmentId}`, "true");
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        }).fire({
          icon: "success",
          title: "Added to your favorites ❤️",
        });
      } else {
        await api.delete(`/favorites/${equipmentId}`);
        localStorage.removeItem(`fav_${equipmentId}`);
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        }).fire({
          icon: "info",
          title: "Removed from favorites",
        });
      }
    } catch (err: any) {
      // If error occurs (e.g. non-customer role or offline), keep local fallback
      localStorage.setItem(`fav_${equipmentId}`, nextState ? "true" : "false");
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      }).fire({
        icon: nextState ? "success" : "info",
        title: nextState ? "Saved to your favorites ❤️" : "Removed from favorites",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading || checking}
      title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
      className={`inline-flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-90 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
      ) : (
        <Heart
          className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
            isFavorite
              ? "fill-rose-500 text-rose-500 animate-in zoom-in-75 duration-200"
              : "text-slate-400 group-hover:text-rose-500"
          }`}
        />
      )}
      {showText && (
        <span
          className={`text-sm font-semibold ${
            isFavorite ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {isFavorite ? "Saved in Favorites" : "Add to Favorites"}
        </span>
      )}
    </button>
  );
}

export default FavoriteButton;
