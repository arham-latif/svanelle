import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Truck, Package, ArrowLeftRight, Ban } from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping — Svanelle" },
      { name: "description", content: "How and when your Svanelle order arrives." },
    ],
  }),
  component: Shipping,
});

function Shipping() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-5 py-20">
        <header className="text-center">
          <h1 className="font-display text-5xl">Shipping</h1>
          <p className="mt-3 text-muted-foreground">Sent with care, straight to your door.</p>
        </header>

        <div className="mt-12 grid gap-5 md:grid-cols-2">

          {/* Shipping */}
          <div className="card-soft p-6">
            <Truck className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Local shipping</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              1–2 weeks within Pakistan. Free on orders Rs 1,000 and above, Rs 250 below that.
            </p>
          </div>

          {/* Packaging */}
          <div className="card-soft p-6">
            <Package className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Wrapped sweetly</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every order arrives in a sealed pouch with a thank-you note.
            </p>
          </div>

          {/* Exchange */}
          <div className="card-soft p-6">
            <ArrowLeftRight className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Exchange policy</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Exchanges are only accepted if the product delivered is{" "}
              <span className="font-medium text-foreground">damaged or defective</span>. Contact
              us within <span className="font-medium text-foreground">48 hours</span> of receiving
              your order with clear photos of the damage.
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              The cost of returning the damaged item and re-delivery of the replacement is borne
              entirely by the customer.
            </p>
          </div>

          {/* No returns */}
          <div className="card-soft p-6">
            <Ban className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">No returns</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              All sales are final. We do not accept returns for change of mind, incorrect size
              selection, or any reason other than a damaged delivery.
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Please review your order carefully before placing it, and refer to our{" "}
              <a href="/sizes" className="text-primary hover:underline">
                size guide
              </a>{" "}
              if you are unsure about sizing.
            </p>
          </div>

        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions about your order?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Write to us
          </a>{" "}
          and we'll get back to you within two days.
        </p>
      </section>
    </Layout>
  );
}
