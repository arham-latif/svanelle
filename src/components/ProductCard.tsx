import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const outOfStock = product.quantity === 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem(product, 1);
    openCart();
  }

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <article className="card-soft overflow-hidden group cursor-pointer">
        <div className="aspect-square overflow-hidden bg-muted isolate relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className={`h-[102%] w-[102%] -translate-x-[1%] -translate-y-[1%] object-cover group-hover:scale-105 transition-transform duration-700 will-change-transform ${outOfStock ? "opacity-50 grayscale" : ""}`}
          />
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-background/90 border border-border text-xs font-medium tracking-wide">
                Out of stock
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
          <h3 className="font-display text-xl mt-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-medium">
              {product.prices.length > 1
                ? `from Rs ${Math.min(...product.prices).toLocaleString()}`
                : `Rs ${product.price.toLocaleString()}`}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full transition ${
                outOfStock
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <ShoppingBag className="h-3 w-3" />
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
