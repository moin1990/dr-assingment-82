"use client";

import { Toaster } from "react-hot-toast";

/**
 * Wraps react-hot-toast's <Toaster> so it can live inside the
 * server-rendered root layout without marking it "use client".
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          fontSize: "13px",
          borderRadius: "0px",          // sharp corners match gallery aesthetic
          border: "1px solid #e7e5e4",
          background: "#fafaf9",
          color: "#1c1917",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "12px 16px",
          maxWidth: "360px",
        },
        success: {
          iconTheme: { primary: "#c8a97e", secondary: "#fafaf9" },
          style: {
            border: "1px solid #c8a97e",
          },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fafaf9" },
          style: {
            border: "1px solid #fca5a5",
          },
        },
      }}
    />
  );
}
