import { useCartStore } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

// ── Update this to your WhatsApp number (international format, no + or spaces) ──
const WHATSAPP_NUMBER = "923095017612";

function buildWhatsAppUrl(items: ReturnType<typeof useCartStore.getState>["items"], total: number) {
  const itemLines = items.map((item) => {
    const sizePart = item.size ? ` | Size: ${item.size}` : "";
    const colorPart = item.color ? ` | Colour: ${item.color}` : "";
    const lineTotal = item.product.price * item.quantity;
    return [
      `*${item.product.name}*`,
      `   Qty: ${item.quantity}${sizePart}${colorPart}`,
      `   Rs ${lineTotal.toLocaleString()}`,
    ].join("\n");
  });

  const shipping = "Rs 250";
  const grandTotal = total + 250;

  const message = [
    "*New Order \u2014 Svanelle*",
    "\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015",
    "",
    itemLines.join("\n\n"),
    "",
    "\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015",
    `Subtotal:  Rs ${total.toLocaleString()}`,
    `Shipping:  ${shipping}`,
    `*Total:     Rs ${grandTotal.toLocaleString()}*`,
    "",
    "\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015",
    "Please share payment details to confirm my order. Thank you!",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  const total = totalPrice();
  const count = totalItems();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl">Your cart</h2>
            {count > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-secondary/40 transition"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">Your cart is empty.</p>
              <button
                onClick={closeCart}
                className="text-sm text-primary hover:underline"
              >
                Continue shopping →
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.size ?? ""}-${item.color ?? ""}`}
                  className="flex gap-4 py-4 border-b border-border last:border-0"
                >
                  {/* Image */}
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {item.product.category}
                    </p>
                    <p className="font-medium text-sm leading-snug mt-0.5 truncate">
                      {item.product.name}
                    </p>
                    {item.size && (
                      <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-xs text-muted-foreground mt-0.5">Colour: {item.color}</p>
                    )}
                    <p className="text-sm font-medium mt-1">
                      Rs {(item.product.price * item.quantity).toLocaleString()}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-secondary/40 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-secondary/40 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="ml-auto p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-3">

            {/* Subtotal + shipping */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span className="font-medium">Rs {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-foreground">Rs 250</span>
            </div>
            <div className="flex items-center justify-between font-semibold border-t border-border pt-2">
              <span>Total</span>
              <span>Rs {(total + 250).toLocaleString()}</span>
            </div>

            <p className="text-xs text-muted-foreground">
              You'll confirm your order and arrange payment over WhatsApp.
            </p>
            <a
              href={buildWhatsAppUrl(items, total)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25D366] text-white font-medium text-center hover:opacity-90 transition shadow-lg shadow-[#25D366]/30"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>
            <button
              onClick={closeCart}
              className="block w-full py-2 text-sm text-center text-muted-foreground hover:text-foreground transition"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
