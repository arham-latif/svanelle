import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Svanelle" },
      { name: "description", content: "The story behind Svanelle — a tiny handmade jewellery studio." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="font-display text-5xl text-center">Hello, we're Svanelle.</h1>

        {/* Brand verse */}
        <div className="mt-10 text-center space-y-1">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Born from heritage, shaped by modern elegance</p>
          <div className="mt-5 font-display text-xl md:text-2xl leading-relaxed text-foreground/80 space-y-1">
            <p>Where pearls of purity, swans of grace,</p>
            <p>and water lilies of quiet resilience</p>
            <p>come together in soft, handmade harmony.</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground italic">
            A tribute to the nurturing, radiant feminine spirit.
          </p>
        </div>

        <div className="mt-10 border-t border-border" />

        <p className="mt-10 text-lg text-foreground/80 leading-relaxed">
          Svanelle began on a quiet afternoon, with a handful of beads scattered across a kitchen
          table and a longing for something soft. Today, it's still that — only a little bigger,
          and shared with you.
        </p>
        <p className="mt-4 text-foreground/70 leading-relaxed">
          Every piece in our shop is made in small batches by hand. We work with pure freshwater
          pearls and stones we choose one by one. We believe jewellery should feel
          like a love note — small, specific, and just a little bit secret.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="card-soft p-6">
            <h3 className="font-display text-2xl">Our promise</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Every piece is made with care and attention. If something arrives damaged, write to us and we'll make it right.
            </p>
          </div>
          <div className="card-soft p-6">
            <h3 className="font-display text-2xl">Made slowly</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Most pieces ship within 5–7 days. Some take longer, because they're being born.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
