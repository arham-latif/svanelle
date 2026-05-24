import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Svanelle" },
      { name: "description", content: "Frequently asked questions about Svanelle jewellery." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  { q: "Are your pieces handmade?", a: "Yes — every Svanelle piece is wired, beaded and finished by hand in our small studio." },
  { q: "Will my jewellery tarnish?", a: "With gentle care (kept dry, away from perfume) your piece will stay lovely for years." },
  { q: "Can I customise an order?", a: "Often, yes. Send us a note via the contact page and we'll see what we can dream up together." },
  { q: "How do I care for my piece?", a: "Store flat in the pouch it arrived in. Clean gently with a soft dry cloth. Avoid water, lotions and perfume." },
  { q: "Do you restock sold-out pieces?", a: "Sometimes. Subscribe to our letters and we'll whisper when something returns." },
  { q: "Why advance payment?", a: "We're a small, independent studio — every piece is made to order by hand. Advance payment allows us to source materials and dedicate our time to crafting your piece with full care. Orders are confirmed and production begins only after full payment is received. We appreciate your trust, and we take it seriously." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-5 py-20">
        <header className="text-center">
          <h1 className="font-display text-5xl">Questions, answered.</h1>
          <p className="mt-3 text-muted-foreground">Anything else? Write to us — we love a letter.</p>
        </header>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card-soft overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-display text-lg">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
