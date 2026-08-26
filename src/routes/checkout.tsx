// import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
// import { useState } from "react";
// import { Layout } from "@/components/Layout";
// import { useCartStore } from "@/store/cart";
// import {
//   CreditCard,
//   Smartphone,
//   Shield,
//   ChevronRight,
//   ArrowLeft,
//   Copy,
//   Check,
//   Lock,
// } from "lucide-react";
// import giftBagImage from "@/assets/gift-bag.jpeg";

// // export const Route = createFileRoute("/checkout")({
// //   head: () => ({
// //     meta: [
// //       { title: "Checkout — Svanelle" },
// //       { name: "description", content: "Complete your Svanelle order." },
// //     ],
// //   }),
// //   component: Checkout,
// // });

// type PaymentMethod = "card" | "manual" | "cod";

// // ── Payment method definitions ──────────────────────────────────────────────
// const paymentMethods: {
//   id: PaymentMethod;
//   icon: React.ElementType;
//   label: string;
//   sub: string;
// }[] = [
//   {
//     id: "card",
//     icon: CreditCard,
//     label: "Credit / Debit Card",
//     sub: "Visa, Mastercard, Amex",
//   },
//   {
//     id: "manual",
//     icon: Smartphone,
//     label: "Bank / JazzCash / EasyPaisa",
//     sub: "Manual transfer — send screenshot to confirm",
//   },
//   {
//     id: "cod",
//     icon: Shield,
//     label: "Cash on Delivery",
//     sub: "Pakistan only",
//   },
// ];

// // ── Manual transfer account details (edit these) ────────────────────────────
// const TRANSFER_ACCOUNTS = [
//   {
//     method: "JazzCash",
//     accountNumber: "0300-1234567",
//     accountHolder: "Svanelle Studio",
//   },
//   {
//     method: "EasyPaisa",
//     accountNumber: "0311-7654321",
//     accountHolder: "Svanelle Studio",
//   },
//   {
//     method: "Bank Transfer (HBL)",
//     accountNumber: "0123-4567890-001",
//     accountHolder: "Svanelle Studio Pvt.",
//     extra: "IBAN: PK36HABB0000123456789001",
//   },
// ];
// const WHATSAPP_NUMBER = "+92 300 000 0000";

// // ── Card field formatting helpers ────────────────────────────────────────────
// function formatCardNumber(v: string) {
//   return v
//     .replace(/\D/g, "")
//     .slice(0, 16)
//     .replace(/(.{4})/g, "$1 ")
//     .trim();
// }
// function formatExpiry(v: string) {
//   const digits = v.replace(/\D/g, "").slice(0, 4);
//   if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
//   return digits;
// }

// // ────────────────────────────────────────────────────────────────────────────

// function Checkout() {
//   const navigate = useNavigate();
//   const { items, totalPrice, clearCart } = useCartStore();
//   const total = totalPrice();
  
//   const [payment, setPayment] = useState<PaymentMethod>("card");
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [copiedField, setCopiedField] = useState<string | null>(null);
//   const [giftBox, setGiftBox] = useState(false);

//   const shipping = 250;
//   const giftBoxPrice = giftBox ? 300 : 0;
//   const grandTotal = total + shipping + giftBoxPrice;

//   // Shipping address
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     province: "",
//     postalCode: "",
//     notes: "",
//   });

//   // Card details
//   const [card, setCard] = useState({
//     number: "",
//     name: "",
//     expiry: "",
//     cvv: "",
//   });

//   function setField(field: keyof typeof form, value: string) {
//     setForm((f) => ({ ...f, [field]: value }));
//     if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
//   }

//   function setCardField(field: keyof typeof card, value: string) {
//     setCard((c) => ({ ...c, [field]: value }));
//     if (errors[`card_${field}`]) setErrors((e) => ({ ...e, [`card_${field}`]: "" }));
//   }

//   function validate() {
//     const e: Record<string, string> = {};

//     // Address
//     if (!form.firstName.trim()) e.firstName = "Required";
//     if (!form.lastName.trim()) e.lastName = "Required";
//     if (!form.email.trim()) e.email = "Required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
//     if (!form.phone.trim()) e.phone = "Required";
//     if (!form.address.trim()) e.address = "Required";
//     if (!form.city.trim()) e.city = "Required";
//     if (!form.province.trim()) e.province = "Required";

//     // Card fields
//     if (payment === "card") {
//       const rawNumber = card.number.replace(/\s/g, "");
//       if (!rawNumber) e.card_number = "Required";
//       else if (rawNumber.length < 16) e.card_number = "Enter a valid 16-digit card number";
//       if (!card.name.trim()) e.card_name = "Required";
//       if (!card.expiry.trim()) e.card_expiry = "Required";
//       else if (!/^\d{2}\s*\/\s*\d{2}$/.test(card.expiry)) e.card_expiry = "Use MM / YY format";
//       if (!card.cvv.trim()) e.card_cvv = "Required";
//       else if (card.cvv.length < 3) e.card_cvv = "Invalid CVV";
//     }

//     return e;
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length > 0) {
//       setErrors(errs);
//       // Scroll to first error
//       const firstErrEl = document.querySelector("[data-error]");
//       firstErrEl?.scrollIntoView({ behavior: "smooth", block: "center" });
//       return;
//     }

//     setSubmitting(true);
//     await new Promise((r) => setTimeout(r, 1200));

//     const orderId = `SVN-${Date.now().toString(36).toUpperCase()}`;

//     sessionStorage.setItem(
//       "svanelle-order",
//       JSON.stringify({
//         orderId,
//         items,
//         total: grandTotal,
//         shipping,
//         giftBox,
//         giftBoxPrice,
//         address: form,
//         payment,
//       }),
//     );

//     clearCart();
//     navigate({ to: "/order-confirmation" });
//   }

//   function copyToClipboard(text: string, key: string) {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopiedField(key);
//       setTimeout(() => setCopiedField(null), 2000);
//     });
//   }

//   if (items.length === 0) {
//     return (
//       <Layout>
//         <section className="mx-auto max-w-xl px-5 py-32 text-center">
//           <h1 className="font-display text-4xl">Your cart is empty</h1>
//           <p className="mt-3 text-muted-foreground">Add some pieces before checking out.</p>
//           <Link
//             to="/shop"
//             className="mt-6 inline-block px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
//           >
//             Browse the shop
//           </Link>
//         </section>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <section className="mx-auto max-w-7xl px-5 py-12">
//         <Link
//           to="/shop"
//           className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Continue shopping
//         </Link>

//         <h1 className="font-display text-4xl mb-10">Checkout</h1>

//         <form onSubmit={handleSubmit} noValidate>
//           <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

//             {/* ── Left column ── */}
//             <div className="space-y-8">

//               {/* Shipping address */}
//               <div className="card-soft p-7">
//                 <h2 className="font-display text-2xl mb-6">Shipping address</h2>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <Field label="First name" error={errors.firstName}>
//                     <input
//                       value={form.firstName}
//                       onChange={(e) => setField("firstName", e.target.value)}
//                       className={inputCls(errors.firstName)}
//                       placeholder="Aisha"
//                     />
//                   </Field>
//                   <Field label="Last name" error={errors.lastName}>
//                     <input
//                       value={form.lastName}
//                       onChange={(e) => setField("lastName", e.target.value)}
//                       className={inputCls(errors.lastName)}
//                       placeholder="Khan"
//                     />
//                   </Field>
//                   <Field label="Email" error={errors.email} className="sm:col-span-2">
//                     <input
//                       type="email"
//                       value={form.email}
//                       onChange={(e) => setField("email", e.target.value)}
//                       className={inputCls(errors.email)}
//                       placeholder="aisha@example.com"
//                     />
//                   </Field>
//                   <Field label="Phone" error={errors.phone} className="sm:col-span-2">
//                     <input
//                       type="tel"
//                       value={form.phone}
//                       onChange={(e) => setField("phone", e.target.value)}
//                       className={inputCls(errors.phone)}
//                       placeholder="+92 300 0000000"
//                     />
//                   </Field>
//                   <Field label="Street address" error={errors.address} className="sm:col-span-2">
//                     <input
//                       value={form.address}
//                       onChange={(e) => setField("address", e.target.value)}
//                       className={inputCls(errors.address)}
//                       placeholder="House 12, Street 4, Block B"
//                     />
//                   </Field>
//                   <Field label="City" error={errors.city}>
//                     <input
//                       value={form.city}
//                       onChange={(e) => setField("city", e.target.value)}
//                       className={inputCls(errors.city)}
//                       placeholder="Lahore"
//                     />
//                   </Field>
//                   <Field label="Province" error={errors.province}>
//                     <select
//                       value={form.province}
//                       onChange={(e) => setField("province", e.target.value)}
//                       className={inputCls(errors.province)}
//                     >
//                       <option value="">Select province</option>
//                       {[
//                         "Punjab",
//                         "Sindh",
//                         "KPK",
//                         "Balochistan",
//                         "Islamabad (ICT)",
//                         "AJK",
//                         "Gilgit-Baltistan",
//                       ].map((p) => (
//                         <option key={p} value={p}>
//                           {p}
//                         </option>
//                       ))}
//                     </select>
//                   </Field>
//                   <Field label="Postal code (optional)">
//                     <input
//                       value={form.postalCode}
//                       onChange={(e) => setField("postalCode", e.target.value)}
//                       className={inputCls()}
//                       placeholder="54000"
//                     />
//                   </Field>
//                 </div>
//                 <Field label="Order notes (optional)" className="mt-4">
//                   <textarea
//                     value={form.notes}
//                     onChange={(e) => setField("notes", e.target.value)}
//                     rows={3}
//                     className={inputCls()}
//                     placeholder="Gift wrapping, special instructions…"
//                   />
//                 </Field>
//               </div>

//               {/* Payment method */}
//               <div className="card-soft p-7">
//                 <h2 className="font-display text-2xl mb-6">Payment method</h2>

//                 {/* Method selector */}
//                 <div className="grid gap-3 sm:grid-cols-3">
//                   {paymentMethods.map((m) => (
//                     <button
//                       key={m.id}
//                       type="button"
//                       onClick={() => setPayment(m.id)}
//                       className={`flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition ${
//                         payment === m.id
//                           ? "border-primary bg-primary/10"
//                           : "border-border bg-card hover:bg-secondary/30"
//                       }`}
//                     >
//                       <div
//                         className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
//                           payment === m.id ? "bg-primary/20" : "bg-muted"
//                         }`}
//                       >
//                         <m.icon
//                           className={`h-5 w-5 ${
//                             payment === m.id ? "text-primary" : "text-muted-foreground"
//                           }`}
//                         />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium leading-snug">{m.label}</p>
//                         <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 {/* ── Card form ── */}
//                 {payment === "card" && (
//                   <div className="mt-6 space-y-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Lock className="h-4 w-4 text-primary" />
//                       <span className="text-sm font-medium">Enter your card details</span>
//                       <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
//                         <Lock className="h-3 w-3" /> Secure & encrypted
//                       </span>
//                     </div>

//                     <Field label="Card number" error={errors.card_number}>
//                       <div className="relative">
//                         <input
//                           value={card.number}
//                           onChange={(e) =>
//                             setCardField("number", formatCardNumber(e.target.value))
//                           }
//                           className={inputCls(errors.card_number) + " pr-12"}
//                           placeholder="1234 5678 9012 3456"
//                           inputMode="numeric"
//                           maxLength={19}
//                         />
//                         <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       </div>
//                     </Field>

//                     <Field label="Cardholder name" error={errors.card_name}>
//                       <input
//                         value={card.name}
//                         onChange={(e) => setCardField("name", e.target.value)}
//                         className={inputCls(errors.card_name)}
//                         placeholder="AISHA KHAN"
//                         autoComplete="cc-name"
//                       />
//                     </Field>

//                     <div className="grid grid-cols-2 gap-4">
//                       <Field label="Expiry date" error={errors.card_expiry}>
//                         <input
//                           value={card.expiry}
//                           onChange={(e) =>
//                             setCardField("expiry", formatExpiry(e.target.value))
//                           }
//                           className={inputCls(errors.card_expiry)}
//                           placeholder="MM / YY"
//                           inputMode="numeric"
//                           maxLength={7}
//                           autoComplete="cc-exp"
//                         />
//                       </Field>
//                       <Field label="CVV" error={errors.card_cvv}>
//                         <input
//                           value={card.cvv}
//                           onChange={(e) =>
//                             setCardField(
//                               "cvv",
//                               e.target.value.replace(/\D/g, "").slice(0, 4),
//                             )
//                           }
//                           className={inputCls(errors.card_cvv)}
//                           placeholder="123"
//                           inputMode="numeric"
//                           maxLength={4}
//                           autoComplete="cc-csc"
//                           type="password"
//                         />
//                       </Field>
//                     </div>

//                     {/* Card brand logos (text-based) */}
//                     <div className="flex items-center gap-2 pt-1">
//                       {["VISA", "MC", "AMEX"].map((b) => (
//                         <span
//                           key={b}
//                           className="px-2.5 py-1 rounded border border-border text-[10px] font-bold tracking-wider text-muted-foreground bg-muted"
//                         >
//                           {b}
//                         </span>
//                       ))}
//                       <span className="text-xs text-muted-foreground ml-1">accepted</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* ── Manual transfer details ── */}
//                 {payment === "manual" && (
//                   <div className="mt-6 space-y-4">
//                     <p className="text-sm text-muted-foreground">
//                       Transfer the exact order amount to any of the accounts below, then send a
//                       screenshot to our WhatsApp to confirm your order.
//                     </p>

//                     {TRANSFER_ACCOUNTS.map((acc) => (
//                       <div
//                         key={acc.method}
//                         className="rounded-2xl border border-border bg-muted/40 p-4 space-y-2"
//                       >
//                         <p className="text-xs uppercase tracking-widest text-primary font-medium">
//                           {acc.method}
//                         </p>

//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-muted-foreground">Account number</p>
//                             <p className="font-mono font-medium text-sm">{acc.accountNumber}</p>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               copyToClipboard(acc.accountNumber, `${acc.method}-num`)
//                             }
//                             className="p-2 rounded-full hover:bg-secondary/40 transition"
//                             aria-label="Copy account number"
//                           >
//                             {copiedField === `${acc.method}-num` ? (
//                               <Check className="h-4 w-4 text-primary" />
//                             ) : (
//                               <Copy className="h-4 w-4 text-muted-foreground" />
//                             )}
//                           </button>
//                         </div>

//                         <div>
//                           <p className="text-xs text-muted-foreground">Account holder</p>
//                           <p className="text-sm font-medium">{acc.accountHolder}</p>
//                         </div>

//                         {acc.extra && (
//                           <div className="flex items-center justify-between">
//                             <p className="font-mono text-xs text-muted-foreground">{acc.extra}</p>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 copyToClipboard(acc.extra!, `${acc.method}-extra`)
//                               }
//                               className="p-2 rounded-full hover:bg-secondary/40 transition"
//                               aria-label="Copy IBAN"
//                             >
//                               {copiedField === `${acc.method}-extra` ? (
//                                 <Check className="h-4 w-4 text-primary" />
//                               ) : (
//                                 <Copy className="h-4 w-4 text-muted-foreground" />
//                               )}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}

//                     {/* WhatsApp confirmation note */}
//                     <div className="rounded-2xl bg-primary/10 border border-primary/30 p-4 flex items-start gap-3">
//                       <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-medium">Send screenshot for confirmation</p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           After transferring, send a screenshot of your payment to our WhatsApp:
//                         </p>
//                         <div className="flex items-center gap-2 mt-2">
//                           <p className="font-mono font-semibold text-sm">{WHATSAPP_NUMBER}</p>
//                           <button
//                             type="button"
//                             onClick={() => copyToClipboard(WHATSAPP_NUMBER, "whatsapp")}
//                             className="p-1.5 rounded-full hover:bg-primary/20 transition"
//                             aria-label="Copy WhatsApp number"
//                           >
//                             {copiedField === "whatsapp" ? (
//                               <Check className="h-3.5 w-3.5 text-primary" />
//                             ) : (
//                               <Copy className="h-3.5 w-3.5 text-muted-foreground" />
//                             )}
//                           </button>
//                         </div>
//                         <p className="text-xs text-muted-foreground mt-2">
//                           Your order will be confirmed and dispatched once payment is verified
//                           (usually within a few hours).
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ── COD note ── */}
//                 {payment === "cod" && (
//                   <div className="mt-5 p-4 rounded-2xl bg-secondary/30 border border-border text-sm text-muted-foreground">
//                     Pay in cash when your order arrives at your door. Available for deliveries
//                     within Pakistan only.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ── Right column — order summary ── */}
//             <div>
//               <div className="card-soft p-6 sticky top-28">
//                 <h2 className="font-display text-2xl mb-5">Order summary</h2>

//                 <ul className="space-y-4 mb-5">
//                   {items.map((item) => (
//                     <li
//                       key={`${item.product.id}-${item.size ?? ""}`}
//                       className="flex gap-3"
//                     >
//                       <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
//                         <img
//                           src={item.product.image}
//                           alt={item.product.name}
//                           className="h-full w-full object-cover"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium leading-snug truncate">
//                           {item.product.name}
//                         </p>
//                         {item.size && (
//                           <p className="text-xs text-muted-foreground">Size: {item.size}</p>
//                         )}
//                         <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
//                       </div>
//                       <p className="text-sm font-medium shrink-0">
//                         Rs {(item.product.price * item.quantity).toLocaleString()}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>

//                 <div className="border-t border-border pt-4 space-y-3">
//                   <div className="bg-yellow-100 text-black p-2 text-xs">DEBUG: Gift box section loaded</div>
                  
//                   {/* Gift box option */}
//                   <label className="flex items-start gap-3 p-3 rounded-2xl border border-border hover:bg-secondary/30 transition cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={giftBox}
//                       onChange={(e) => setGiftBox(e.target.checked)}
//                       className="mt-1 h-4 w-4 rounded border-border accent-primary cursor-pointer"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start gap-3">
//                         <img
//                           src={giftBagImage}
//                           alt="Gift box"
//                           className="h-12 w-12 rounded-lg object-cover shrink-0"
//                         />
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">Pack in gift box</p>
//                           <p className="text-xs text-muted-foreground mt-0.5">
//                             Beautiful gift packaging
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <span className="text-sm font-medium shrink-0">Rs 300</span>
//                   </label>

//                   {/* Totals */}
//                   <div className="space-y-2 text-sm pt-2">
//                     <div className="flex justify-between text-muted-foreground">
//                       <span>Subtotal</span>
//                       <span>Rs {total.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-muted-foreground">
//                       <span>Shipping</span>
//                       <span>Rs {shipping.toLocaleString()}</span>
//                     </div>
//                     {giftBox && (
//                       <div className="flex justify-between text-muted-foreground">
//                         <span>Gift box</span>
//                         <span>Rs {giftBoxPrice.toLocaleString()}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
//                       <span>Total</span>
//                       <span>Rs {grandTotal.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-lg shadow-primary/20 disabled:opacity-60"
//                 >
//                   {submitting ? (
//                     <span className="flex items-center gap-2">
//                       <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
//                       Placing order…
//                     </span>
//                   ) : (
//                     <>
//                       Place order <ChevronRight className="h-4 w-4" />
//                     </>
//                   )}
//                 </button>

//                 <p className="mt-3 text-xs text-center text-muted-foreground">
//                   By placing your order you agree to our terms.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </section>
//     </Layout>
//   );
// }

// // ── Helpers ──────────────────────────────────────────────────────────────────

// function inputCls(error?: string) {
//   return `w-full px-4 py-3 rounded-xl bg-background border ${
//     error ? "border-destructive" : "border-border"
//   } focus:outline-none focus:ring-2 focus:ring-primary text-sm`;
// }

// function Field({
//   label,
//   error,
//   children,
//   className = "",
// }: {
//   label: string;
//   error?: string;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className={className} data-error={error ? true : undefined}>
//       <label className="text-sm font-medium block mb-1">{label}</label>
//       {children}
//       {error && <p className="text-xs text-destructive mt-1">{error}</p>}
//     </div>
//   );
// }
