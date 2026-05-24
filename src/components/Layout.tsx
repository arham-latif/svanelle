import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Flower2, Instagram, Mail, ShoppingBag, Search } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/custom", label: "Custom Order" },
  { to: "/about", label: "About" },
  { to: "/sizes", label: "Size Guide" },
  { to: "/payment", label: "Payment" },
  { to: "/shipping", label: "Shipping" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { toggleCart, totalItems } = useCartStore();
  const cartCount = totalItems();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-5 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Flower2 className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-display text-2xl tracking-tight text-gradient font-semibold">
              Svanelle
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-2 text-sm rounded-full transition-colors ${
                    active
                      ? "bg-primary/20 text-foreground font-medium"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-secondary/40 transition"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-full hover:bg-secondary/40 transition"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden p-2 rounded-full hover:bg-secondary/40"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur">
            <nav className="px-5 py-3 flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-foreground/80 hover:text-primary"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <CartDrawer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <footer className="mt-20 border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Flower2 className="h-5 w-5 text-primary" />
              <span className="font-display text-xl text-gradient font-semibold">Svanelle</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Handmade jewellery and small wonders, made with petals and patience.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {nav.slice(1).map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-primary">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg mb-3">Stay close</h4>
            <div className="flex gap-3">
              <a href="https://instagram.com/_svanelle_" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-card border border-border hover:bg-primary/20" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="mailto:swanfragile@gmail.com" className="p-2 rounded-full bg-card border border-border hover:bg-primary/20" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Svanelle — made with love.
        </div>
      </footer>
    </div>
  );
}
