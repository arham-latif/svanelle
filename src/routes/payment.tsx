import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Banknote, Smartphone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment Methods — Svanelle" },
      { name: "description", content: "Accepted payment options at Svanelle." },
    ],
  }),
  component: Payment,
});

// ── Active payment methods ───────────────────────────────────────────────────
const methods = [
  {
    icon: MessageCircle,
    title: "Order via WhatsApp",
    text: "Browse the shop, add items to your cart, then tap 'Order via WhatsApp'. We'll confirm your order and share payment details in the chat.",
  },
  {
    icon: Smartphone,
    title: "JazzCash / EasyPaisa",
    text: "Send the exact order amount to our mobile wallet and share a screenshot on WhatsApp to confirm.",
  },
  {
    icon: Banknote,
    title: "Bank Transfer",
    text: "Direct bank deposit available. Account details are shared after you place your order on WhatsApp.",
  },
];

// ── Commented out — not currently offered ────────────────────────────────────
// const oldMethods = [
//   { icon: CreditCard, title: "Credit & Debit Cards", text: "Visa, Mastercard, American Express. Charged securely at checkout." },
//   { icon: Wallet,     title: "Mobile wallets",       text: "Apple Pay, Google Pay, JazzCash and EasyPaisa." },
//   { icon: Shield,     title: "Cash on delivery",     text: "Available for local orders within Pakistan." },
// ];

function Payment() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-5 py-20">
        <header className="text-center">
          <h1 className="font-display text-5xl">Payment Methods</h1>
          <p className="mt-3 text-muted-foreground">Simple, personal, and handled over WhatsApp.</p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {methods.map((m) => (
            <div key={m.title} className="card-soft p-6 flex flex-col gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <m.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 card-soft p-6 bg-secondary/30">
          <h3 className="font-display text-xl">How it works</h3>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Add your favourite pieces to the cart.</li>
            <li>Tap <span className="text-foreground font-medium">Order via WhatsApp</span> — your order summary is sent automatically.</li>
            <li>We confirm availability and share payment details in the chat.</li>
            <li>Transfer the amount and send a screenshot to confirm.</li>
            <li>We dispatch your order once payment is verified.</li>
          </ol>
        </div>
      </section>
    </Layout>
  );
}
