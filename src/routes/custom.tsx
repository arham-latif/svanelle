import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Ruler, MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/custom")({
  head: () => ({
    meta: [
      { title: "Custom Order — Svanelle" },
      { name: "description", content: "Order a custom-length piece from Svanelle. Rs 70 per extra inch." },
    ],
  }),
  component: CustomOrder,
});

const WHATSAPP_NUMBER = "923095017612";
const PRICE_PER_INCH = 70;

// Base lengths in inches per size (approximate, for reference)
const SIZE_REFERENCE: Record<string, { label: string; inches: number }[]> = {
  necklace: [
    { label: 'XS (14.6–15")', inches: 14.8 },
    { label: 'S (17.7–18.1")', inches: 17.9 },
    { label: 'M (20–20.5")', inches: 20.2 },
    { label: 'L (23.6–24")', inches: 23.8 },
  ],
  bracelet: [
    { label: 'XS (6.7–7.1")', inches: 6.9 },
    { label: 'S (7.1–7.5")', inches: 7.3 },
    { label: 'M (7.5–7.9")', inches: 7.7 },
    { label: 'L (7.9–8.3")', inches: 8.1 },
  ],
};

function CustomOrder() {
  const [category, setCategory] = useState<"necklace" | "bracelet">("necklace");
  const [baseProduct, setBaseProduct] = useState("");
  const [length, setLength] = useState<string>("");
  const [notes, setNotes] = useState("");

  const lengthNum = parseFloat(length);
  const isValidLength = !isNaN(lengthNum) && lengthNum > 0;
  const estimatedPrice = isValidLength ? Math.ceil(lengthNum) * PRICE_PER_INCH : null;

  function buildMessage() {
    const lines = [
      "*Custom Order \u2014 Svanelle*",
      "\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015",
      "",
      `Type:      ${category === "necklace" ? "Necklace" : "Bracelet"}`,
      baseProduct ? `Design:    ${baseProduct}` : null,
      `Length:    ${lengthNum}\"`,
      `Est. Price: Rs ${estimatedPrice?.toLocaleString()}`,
      notes ? `Notes:     ${notes}` : null,
      "",
      "\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015",
      "Please confirm availability and final price. Thank you!",
    ]
      .filter((l) => l !== null)
      .join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
  }

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-5 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border text-xs uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3 text-primary" /> Made just for you
          </span>
          <h1 className="font-display text-5xl">Custom Order</h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Want a specific length? Every inch is Rs {PRICE_PER_INCH}. Tell us what you have in mind and we'll make it.
          </p>
        </div>

        <div className="card-soft p-8 space-y-8">

          {/* Category */}
          <div>
            <label className="text-sm font-medium block mb-3">What would you like?</label>
            <div className="grid grid-cols-2 gap-3">
              {(["necklace", "bracelet"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`py-3 rounded-2xl border text-sm font-medium capitalize transition ${
                    category === c
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card hover:bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Base design */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Base design <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Name a piece from our shop you'd like customised, or describe your idea.
            </p>
            <input
              value={baseProduct}
              onChange={(e) => setBaseProduct(e.target.value)}
              placeholder="e.g. The Swan Lake, or a pearl necklace in ivory"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Length */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Desired length <span className="text-muted-foreground font-normal">(in inches)</span>
            </label>

            {/* Size reference chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {SIZE_REFERENCE[category].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setLength(String(s.inches))}
                  className="px-3 py-1 rounded-full text-xs border border-border bg-muted hover:bg-secondary/40 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                min="1"
                step="0.5"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 18"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                inches
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Not sure of your size?{" "}
                <a href="/sizes" className="text-primary hover:underline">
                  Check the size guide
                </a>
              </p>
            </div>
          </div>

          {/* Price estimate */}
          {isValidLength && estimatedPrice !== null && (
            <div className="rounded-2xl bg-primary/10 border border-primary/20 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Estimated price</p>
                <p className="font-display text-3xl mt-0.5">Rs {estimatedPrice.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.ceil(lengthNum)} inches × Rs {PRICE_PER_INCH} / inch
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-primary/40" />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Additional notes <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Colour preferences, bead style, clasp type…"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>

          {/* WhatsApp button */}
          <a
            href={isValidLength ? buildMessage() : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!isValidLength}
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-full font-medium text-base transition shadow-lg ${
              isValidLength
                ? "bg-[#25D366] text-white hover:opacity-90 shadow-[#25D366]/30 cursor-pointer"
                : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
            }`}
            onClick={(e) => { if (!isValidLength) e.preventDefault(); }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {isValidLength ? "Send Custom Order via WhatsApp" : "Enter a length to continue"}
          </a>

          <p className="text-xs text-center text-muted-foreground">
            The price shown is an estimate. We'll confirm the final price on WhatsApp before you pay.
          </p>
        </div>
      </section>
    </Layout>
  );
}
