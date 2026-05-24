import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { productsQueryOptions } from "@/data/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Svanelle" },
      { name: "description", content: "Browse all Svanelle handmade necklaces, rings, bracelets and earrings." },
    ],
  }),
  component: Shop,
});

const cats = ["all", "necklaces", "bracelets", "sets"] as const;

function Shop() {
  const [cat, setCat] = useState<(typeof cats)[number]>("all");
  const { data: products = [], isLoading, isError } = useQuery(productsQueryOptions);

  const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <header className="text-center max-w-2xl mx-auto">
          <h1 className="font-display text-5xl">The Shop</h1>
          <p className="mt-3 text-muted-foreground">
            A small, ever-changing collection. Each piece is one of a few — when it's gone, it's gone.
          </p>
        </header>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-sm capitalize transition ${
                cat === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:bg-secondary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-soft overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-1/3 bg-muted rounded-full" />
                  <div className="h-5 w-2/3 bg-muted rounded-full" />
                  <div className="h-3 w-full bg-muted rounded-full" />
                  <div className="h-3 w-4/5 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-16 text-center text-muted-foreground">
            <p>Couldn't load products right now. Please try again shortly.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">
                No products in this category yet.
              </p>
            ) : (
              filtered.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}
