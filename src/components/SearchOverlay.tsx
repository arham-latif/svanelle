import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions, type Product } from "@/data/products";
import { useCartStore } from "@/store/cart";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: products = [] } = useQuery(productsQueryOptions);
  const { addItem, openCart } = useCartStore();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const trimmed = query.trim().toLowerCase();
  const results: Product[] = trimmed.length < 2
    ? []
    : products.filter((p) => p.name.toLowerCase().includes(trimmed));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 bg-background border-b border-border shadow-2xl">
        {/* Search input */}
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground/50"
            aria-label="Search products"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/40 transition"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        {trimmed.length >= 2 && (
          <div className="mx-auto max-w-3xl px-5 pb-5 max-h-[70vh] overflow-y-auto">
            {results.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No products found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <ul className="space-y-2">
                  {results.map((p) => (
                    <li key={`${p.id}-${p.category}`}>
                      <Link
                        to="/product/$productId"
                        params={{ productId: p.id }}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary/40 transition group"
                      >
                        {/* Thumbnail */}
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {p.category}
                          </p>
                          <p className="font-medium text-sm leading-snug truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {p.prices.length > 1
                              ? `from Rs ${Math.min(...p.prices).toLocaleString()}`
                              : `Rs ${p.price.toLocaleString()}`}
                          </p>
                        </div>

                        {/* Out of stock / add to cart */}
                        {p.quantity === 0 ? (
                          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full border border-border shrink-0">
                            Out of stock
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addItem(p, 1);
                              openCart();
                              onClose();
                            }}
                            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition shrink-0"
                            aria-label={`Add ${p.name} to cart`}
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </button>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Hint when empty */}
        {trimmed.length < 2 && (
          <p className="mx-auto max-w-3xl px-5 pb-5 text-xs text-muted-foreground">
            Type at least 2 characters to search
          </p>
        )}
      </div>
    </div>
  );
}
