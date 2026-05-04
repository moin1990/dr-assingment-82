"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface QuantitySelectorProps {
  price:   number;
  inStock: boolean;
  title:   string;
}

export default function QuantitySelector({
  price,
  inStock,
  title,
}: QuantitySelectorProps) {
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  const change = (delta: number) =>
    setQty((q) => Math.max(1, Math.min(99, q + delta)));

  const total = (price * qty).toFixed(2);

  function handleAddToCart() {
    toast.success(`${qty}× "${title}" added to cart`, {
      icon: "🛒",
    });
  }

  function handleSave() {
    setSaved((v) => !v);
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist", {
      icon: saved ? "💔" : "❤️",
    });
  }

  return (
    <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-base-200">
      {/* Price + total */}
      <div className="flex items-end justify-between">
        <div>
          <span className="font-display text-[42px] font-light leading-none">
            €{price.toFixed(2)}
          </span>
          <span className="font-body text-[12px] text-base-content/40 ml-1.5">
            per tile
          </span>
        </div>
        <div className="text-right">
          <p className="font-body text-[13px] font-medium text-base-content/70">
            €{total}
          </p>
          <p className="font-body text-[10px] text-base-content/35 tracking-wide">
            total for {qty} tile{qty !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Quantity control */}
      <div className="flex items-center gap-4">
        <span className="font-body text-[10px] tracking-[.2em] uppercase text-base-content/50 shrink-0">
          Qty
        </span>
        <div className="flex items-center border border-base-300">
          <button
            onClick={() => change(-1)}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="w-9 h-9 flex items-center justify-center
                       text-base-content/50 hover:text-base-content hover:bg-base-200
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors duration-150"
          >
            −
          </button>
          <span className="w-10 text-center font-body text-[14px] font-medium
                           text-base-content select-none">
            {qty}
          </span>
          <button
            onClick={() => change(1)}
            disabled={qty >= 99}
            aria-label="Increase quantity"
            className="w-9 h-9 flex items-center justify-center
                       text-base-content/50 hover:text-base-content hover:bg-base-200
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-colors duration-150"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2">
        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex-1 h-12 flex items-center justify-center gap-2.5
                     font-body text-[10.5px] tracking-[.2em] uppercase font-medium
                     bg-neutral text-neutral-content
                     hover:bg-primary hover:text-primary-content
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-250"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
          </svg>
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>

        {/* Wishlist */}
        <button
          onClick={handleSave}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className={[
            "w-12 h-12 flex items-center justify-center shrink-0",
            "border transition-all duration-250",
            saved
              ? "border-primary bg-primary/10 text-primary"
              : "border-base-300 text-base-content/50 hover:border-base-content/40 hover:text-base-content",
          ].join(" ")}
        >
          <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"}
               viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
          </svg>
        </button>
      </div>

      {!inStock && (
        <p className="font-body text-[11px] text-base-content/40 text-center">
          This tile is currently out of stock. Check back soon.
        </p>
      )}
    </div>
  );
}
