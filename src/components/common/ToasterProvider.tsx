"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#0f172a",
          color: "#f8fafc",
          fontSize: "13px",
          fontWeight: 600,
          borderRadius: "14px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
          padding: "12px 18px",
          border: "1px solid #334155",
        },
        success: {
          style: {
            background: "#0f172a",
            color: "#ffffff",
            border: "1px solid #10b981",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          style: {
            background: "#0f172a",
            color: "#ffffff",
            border: "1px solid #ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
