import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { CheckCircle2, Package, Mail, ArrowRight } from "lucide-react";
import type { CartItem } from "@/store/cart";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Svanelle" },
      { name: "description", content: "Your Svanelle order has been placed." },
    ],
  }),
  component: OrderConfirmation,
});

type OrderData = {
  orderId: string;
  items: CartItem[];
  total: number;
  shipping: number;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    notes: string;
  };
  payment: string;
};

const paymentLabels: Record<string, string> = {
  card: "Credit / Debit Card",
  manual: "Bank / JazzCash / EasyPaisa (Manual Transfer)",
  cod: "Cash on Delivery",
};

function OrderConfirmation() {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("svanelle-order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as OrderData);
        // Keep it in session so refresh still works, but clear on next navigation
      } catch {
        // ignore
      }
    }
  }, []);

  if (!order) {
    return (
      <Layout>
        <section className="mx-auto max-w-xl px-5 py-32 text-center">
          <h1 className="font-display text-4xl">No order found</h1>
          <p className="mt-3 text-muted-foreground">
            It looks like you haven't placed an order yet.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
          >
            Browse the shop
          </Link>
        </section>
      </Layout>
    );
  }

  const subtotal = order.total - order.shipping;

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-5 py-16">
        {/* Success header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/15 mb-5">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl">Order placed!</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Thank you, {order.address.firstName}. Your order is confirmed and being lovingly
            prepared.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
            <span className="text-muted-foreground">Order ID:</span>
            <span className="font-medium font-mono">{order.orderId}</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Items */}
          <div className="card-soft p-6">
            <h2 className="font-display text-2xl mb-5 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Your items
            </h2>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li
                  key={`${item.product.id}-${item.size ?? ""}`}
                  className="flex gap-4 py-3 border-b border-border last:border-0"
                >
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    {item.size && (
                      <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium shrink-0">
                    Rs {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `Rs ${order.shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                <span>Total paid</span>
                <span>Rs {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery & payment details */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card-soft p-6">
              <h2 className="font-display text-xl mb-3">Shipping to</h2>
              <address className="not-italic text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.address}</p>
                <p>
                  {order.address.city}, {order.address.province}
                  {order.address.postalCode ? ` ${order.address.postalCode}` : ""}
                </p>
                <p>{order.address.phone}</p>
              </address>
            </div>

            <div className="card-soft p-6">
              <h2 className="font-display text-xl mb-3">Payment</h2>
              <p className="text-sm text-muted-foreground">
                {paymentLabels[order.payment] ?? order.payment}
              </p>
              {order.payment === "manual" && (
                <p className="mt-2 text-xs text-primary">
                  Please send your payment screenshot to WhatsApp to confirm your order.
                </p>
              )}
              {order.payment === "cod" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Pay when your order arrives.
                </p>
              )}
            </div>
          </div>

          {/* Email notice */}
          <div className="card-soft p-6 bg-secondary/30 flex items-start gap-4">
            <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Confirmation email on its way</p>
              <p className="text-xs text-muted-foreground mt-1">
                We'll send order updates to{" "}
                <span className="text-foreground">{order.address.email}</span>. Most orders
                ship within 5–7 business days.
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.address.notes && (
            <div className="card-soft p-6">
              <h2 className="font-display text-xl mb-2">Your notes</h2>
              <p className="text-sm text-muted-foreground">{order.address.notes}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
          >
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="px-7 py-3 rounded-full bg-card border border-border hover:bg-secondary/40 transition"
          >
            Back to home
          </Link>
        </div>
      </section>
    </Layout>
  );
}
