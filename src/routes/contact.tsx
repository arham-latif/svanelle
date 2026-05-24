import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Mail, Instagram, MapPin, Send, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Svanelle" },
      { name: "description", content: "Get in touch with Svanelle." },
    ],
  }),
  component: Contact,
});

// ─── Replace this with your key from https://web3forms.com ───────────────────
const WEB3FORMS_KEY = "8bf33f55-64a7-40d0-9a82-6018d24d846c";
// ─────────────────────────────────────────────────────────────────────────────

type Status = "idle" | "sending" | "success" | "error";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [emailCopied, setEmailCopied] = useState(false);

  const EMAIL = "swanfragile@gmail.com";

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setEmailCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `New message from ${form.name} — Svanelle`,
        }),
      });

      const data = (await res.json()) as { success: boolean };

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        toast.success("Message sent!", {
          description: "We'll get back to you within two days.",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      setStatus("error");
      toast.error("Couldn't send your message.", {
        description: "Please try again or email us directly.",
      });
    }
  }

  const inputCls =
    "mt-1 w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-5 py-20 grid gap-12 lg:grid-cols-2">

        {/* Left — contact info */}
        <div>
          <h1 className="font-display text-5xl">Say hello.</h1>
          <p className="mt-4 text-foreground/70">
            Custom orders, questions, friendly notes — we read every message and reply within
            two days.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href="mailto:swanfragile@gmail.com" className="hover:text-primary transition">
                swanfragile@gmail.com
              </a>
              <button
                onClick={copyEmail}
                className="p-1 rounded-full hover:bg-secondary/40 transition text-muted-foreground hover:text-foreground"
                aria-label="Copy email address"
              >
                {emailCopied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="h-4 w-4 text-primary shrink-0" />
              <a
                href="https://instagram.com/_svanelle_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition"
              >
                @_svanelle_
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">Made in a small room, somewhere quiet.</span>
            </li>
          </ul>
        </div>

        {/* Right — form */}
        {status === "success" ? (
          <div className="card-soft p-7 flex flex-col items-center justify-center text-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h2 className="font-display text-2xl">Message received ♡</h2>
            <p className="text-sm text-muted-foreground">
              Thank you for reaching out. We'll reply to{" "}
              <span className="text-foreground font-medium">{form.email || "you"}</span> within
              two days.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-soft p-7 space-y-4" noValidate>
            <div>
              <label className="text-sm font-medium">Your name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className={inputCls}
                placeholder="Aisha Khan"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={inputCls}
                placeholder="aisha@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                className={inputCls}
                placeholder="I'd love a custom order…"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Couldn't send — please try again or email us directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send message
                </>
              )}
            </button>
          </form>
        )}
      </section>
    </Layout>
  );
}
