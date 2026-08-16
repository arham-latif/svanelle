import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/sizes")({
  head: () => ({
    meta: [
      { title: "Size Guide — Svanelle" },
      { name: "description", content: "Find your perfect bracelet and necklace size." },
    ],
  }),
  component: Sizes,
});

const bracelets = [
  { size: "XS", cm: "10.2–12.7", inches: "4–5" },
  { size: "S",  cm: "12.7–15.2", inches: "5–6" },
  { size: "M",  cm: "15.2–17.8", inches: "6–7" },
  { size: "L",  cm: "17.8–20.3", inches: "7–8" },
];

const necklaces = [
  { name: "XS", cm: "38.1–40.6", inches: "15–16" },
  { name: "S",  cm: "40.6–45.7", inches: "16–18" },
  { name: "M",  cm: "45.7–50.8", inches: "18–20" },
  { name: "L",  cm: "50.8–58.4", inches: "20–23" },
];


function Sizes() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-5 py-20">
        <header className="text-center">
          <h1 className="font-display text-5xl">Size Guide</h1>
          <p className="mt-3 text-muted-foreground">
            A little measuring tape and a quiet moment is all you need.
          </p>
        </header>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Bracelets */}
          <div className="card-soft p-6">
            <h2 className="font-display text-2xl">Bracelets</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Wrap a strip of paper snug around your wrist and measure the length.
            </p>
            <table className="mt-4 w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">Size</th>
                  <th>cm</th>
                  <th>inches</th>
                </tr>
              </thead>
              <tbody>
                {bracelets.map((b) => (
                  <tr key={b.size} className="border-t border-border">
                    <td className="py-2 font-medium">{b.size}</td>
                    <td>{b.cm} cm</td>
                    <td>{b.inches} in</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Necklaces */}
          <div className="card-soft p-6">
            <h2 className="font-display text-2xl">Necklaces</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Measure from the back of your neck to where you'd like the pendant to sit.
            </p>
            <table className="mt-4 w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">Size</th>
                  <th>cm</th>
                  <th>inches</th>
                </tr>
              </thead>
              <tbody>
                {necklaces.map((n) => (
                  <tr key={n.name} className="border-t border-border">
                    <td className="py-2 font-medium">{n.name}</td>
                    <td>{n.cm} cm</td>
                    <td>{n.inches} in</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Still unsure?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Write to us
          </a>{" "}
          — we'll help you find your fit.
        </p>
      </section>
    </Layout>
  );
}
