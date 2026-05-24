import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { productsQueryOptions } from "@/data/products";
import hero from "@/assets/hero.jpg";
import { Sparkles, Heart, Leaf } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Svanelle — Whimsical handmade jewellery" },
      { name: "description", content: "Discover Svanelle's pastel handmade jewellery — necklaces, rings, earrings and bracelets in pink and mint." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products = [] } = useQuery(productsQueryOptions);
  const featured = products.filter((p) => p.featured);
  const [email, setEmail] = useState("");

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    toast.success("You're on the list!", {
      description: `We'll send studio letters to ${email}.`,
    });
    setEmail("");
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Full width, cropped to upper portion of the painting */}
        <img
          src={hero}
          alt=""
          width={1920}
          height={800}
          className="absolute inset-0 h-full w-full object-cover object-top opacity-50"
        />
        {/* Gradient to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        {/* Subtle pink tint to tie into theme */}
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
        <div className="relative mx-auto max-w-7xl px-5 py-28 md:py-40 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 border border-border text-xs uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-primary" /> New collection · Spring
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.05]">
            Woven from daydreams, <br />
            <span className="text-gradient">sculpted like poetry.</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-foreground/70">
            Svanelle is a tiny studio crafting jewellery in petal pinks and quiet greens —
            each piece tied with care, daydreams and a little glitter.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-lg shadow-primary/20">
              Shop the collection
            </Link>
            <Link to="/about" className="px-7 py-3 rounded-full bg-card border border-border hover:bg-secondary/40 transition">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-5 py-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: Heart, title: "Made by hand", text: "Every piece is wired, beaded and knotted in our small studio." },
          { icon: Leaf, title: "Soft & sustainable", text: "Pure freshwater pearls and carefully chosen beads — nothing rushed." },
          { icon: Sparkles, title: "Wrapped with love", text: "Your order arrives in a hand-tied bundle, ready to gift." },
        ].map((v) => (
          <div key={v.title} className="card-soft p-7">
            <v.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-2xl">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl">Picked for you</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">See all →</Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-soft overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-1/3 bg-muted rounded-full" />
                  <div className="h-5 w-2/3 bg-muted rounded-full" />
                  <div className="h-3 w-full bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <div className="card-soft p-10 md:p-14 text-center bg-gradient-to-br from-primary/15 to-secondary/40">
          <h2 className="font-display text-3xl md:text-4xl">Letters from the studio</h2>
          <p className="mt-3 text-muted-foreground">Soft news, early peeks and the occasional discount.</p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletter}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
