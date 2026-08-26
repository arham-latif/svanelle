import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { fetchProducts, type Product } from "@/data/products";
import { useCartStore } from "@/store/cart";
import {
  ArrowLeft,
  ShoppingBag,
  Ruler,
  Truck,
  Heart,
  Leaf,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => ({
    meta: [
      { title: `Product — Svanelle` },
      { name: "description", content: `View product details on Svanelle.` },
    ],
  }),
  loader: async ({ params }): Promise<{ product: Product; allProducts: Product[] }> => {
    const products = await fetchProducts();
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product, allProducts: products };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const loaderData = Route.useLoaderData() as { product: Product; allProducts: Product[] };
  const { product, allProducts } = loaderData;
  const { addItem, openCart } = useCartStore();
  const sizes = product.sizes;
  const outOfStock = product.quantity === 0;

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors.length > 0 ? product.colors[0] : undefined,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = sizes[selectedSizeIndex] as string | undefined;
  const currentPrice =
    product.prices.length > 1
      ? (product.prices[selectedSizeIndex] ?? product.prices[0])
      : product.prices[0];

  function handleAddToCart() {
    if (outOfStock) return;
    const productWithPrice = { ...product, price: currentPrice };
    addItem(productWithPrice, quantity, selectedSize, selectedColor);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  function lightboxPrev() {
    setLightboxIndex((i) => (i - 1 + product.images.length) % product.images.length);
  }

  function lightboxNext() {
    setLightboxIndex((i) => (i + 1) % product.images.length);
  }

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <Layout>
      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 p-2 rounded-full bg-card/20 hover:bg-card/40 text-white transition"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {product.images.length > 1 && (
            <>
              <button
                className="absolute left-4 p-2 rounded-full bg-card/20 hover:bg-card/40 text-white transition"
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 p-2 rounded-full bg-card/20 hover:bg-card/40 text-white transition"
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={product.images[lightboxIndex]}
            alt={`${product.name} — view ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === lightboxIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-5 py-12">
        {/* Back */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        {/* Main grid */}
        <div className="grid gap-12 lg:grid-cols-2">

          {/* ── Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-muted cursor-zoom-in group"
              onClick={() => openLightbox(activeImage)}
            >
              <img
                src={product.images[activeImage]}
                alt={`${product.name} — view ${activeImage + 1}`}
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                Click to enlarge
              </div>
              {/* Image counter */}
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur text-xs font-medium">
                {activeImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition ${
                      activeImage === i
                        ? "border-primary shadow-md shadow-primary/20"
                        : "border-transparent hover:border-border"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col">
            {/* Category + name */}
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {product.category}
            </p>
            <h1 className="font-display text-4xl md:text-5xl mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-medium mt-4">
              Rs {currentPrice.toLocaleString()}
            </p>

            {/* Short description */}
            <p className="mt-4 text-foreground/70 leading-relaxed text-base">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-5">
                <span className="text-sm font-medium block mb-3">Colour</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        selectedColor === color
                          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                          : "bg-card border-border hover:bg-secondary/40"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Size</span>
                  <Link
                    to="/sizes"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Ruler className="h-3 w-3" />
                    Size guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s, i) => {
                    const sizePrice = product.prices.length > 1 ? product.prices[i] : null;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSizeIndex(i)}
                        className={`px-4 py-2 rounded-full text-sm border transition ${
                          selectedSizeIndex === i
                            ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                            : "bg-card border-border hover:bg-secondary/40"
                        }`}
                      >
                        {s}
                        {sizePrice !== null && (
                          <span className="ml-1.5 opacity-75 text-xs">
                            Rs {sizePrice.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-7">
              <span className="text-sm font-medium block mb-3">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary/40 transition text-xl font-light"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary/40 transition text-xl font-light"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-full font-medium text-base transition shadow-lg ${
                outOfStock
                  ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                  : added
                  ? "bg-secondary text-secondary-foreground shadow-secondary/20"
                  : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              {outOfStock ? "Out of stock" : added ? "Added to cart ✓" : "Add to cart"}
            </button>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-2xl bg-muted/50">
                <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Handmade in small batches</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-2xl bg-muted/50">
                <Leaf className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Pearls & beads</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Care instructions ── */}
        {product.care.length > 0 && (
          <div className="mt-16 card-soft p-7 md:p-10">
            <h2 className="font-display text-2xl mb-4">Care instructions</h2>
            <ul className="space-y-3">
              {product.care.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary-foreground/40 shrink-0" />
                  <span className="text-sm text-foreground/80">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl">You might also like</h2>
              <Link to="/shop" className="text-sm text-primary hover:underline">
                See all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

function RelatedCard({ product: p }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  return (
    <Link
      to="/product/$productId"
      params={{ productId: p.id }}
      className="card-soft overflow-hidden group block"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</p>
        <h3 className="font-display text-xl mt-1">{p.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-medium">Rs {p.price.toLocaleString()}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(p, 1);
              openCart();
            }}
            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <ShoppingBag className="h-3 w-3" />
            Add to cart
          </button>
        </div>
      </div>
    </Link>
  );
}
