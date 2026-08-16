// ── Product type ─────────────────────────────────────────────────────────────
export type Product = {
  id: string;
  name: string;
  /** One price per size. If only one price, it applies to all sizes. */
  prices: number[];
  /** Convenience: the lowest price (used for display on cards) */
  price: number;
  /** Primary image URL */
  image: string;
  /** All gallery image URLs */
  images: string[];
  category: "necklaces" | "bracelets" | "sets" | "keepsakes";
  /** Short tagline shown on cards */
  description: string;
  /** Available sizes, e.g. ["Choker", "Princess", "Matinee", "Opera"] */
  sizes: string[];
  /** Care instructions */
  care: string[];
  /** Colors, e.g. ["Deep Red", "Gold"] — empty if not specified */
  colors: string[];
  /** Whether to show in "Picked for you" section */
  featured: boolean;
  /** Stock quantity — 0 means out of stock */
  quantity: number;
};

// ── Google Sheet config ───────────────────────────────────────────────────────
const SHEET_ID = "1QEKf7yBom0pFJrFp3nZY-Nk80xykPDuHhOyt-WxkF-o";
const SHEET_NAME = "products";

export const PRODUCTS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

// ── CSV parser ────────────────────────────────────────────────────────────────
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(csv: string): Record<string, string>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

// ── Normalize category ────────────────────────────────────────────────────────
function normalizeCategory(raw: string): Product["category"] | null {
  const val = raw.toLowerCase().trim();
  if (val === "necklace" || val === "necklaces") return "necklaces";
  if (val === "bracelet" || val === "bracelets") return "bracelets";
  if (val === "set" || val === "sets") return "sets";
  if (val === "keepsake" || val === "keepsakes") return "keepsakes";
  return null;
}

// ── Row → Product ─────────────────────────────────────────────────────────────
function rowToProduct(row: Record<string, string>): Product | null {
  const name = row["name"]?.trim();
  const image = row["image"]?.trim();
  const category = normalizeCategory(row["category"] ?? "");

  if (!name || !image || !category) return null;

  // id: slugify the row id + name to keep unique across sets/bracelets/necklaces
  const rawId = row["id"]?.trim();
  const id = rawId
    ? rawId.toLowerCase().replace(/\s+/g, "-")
    : name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Prices: may be "990" or "800|870|940|1010"
  const rawPrice = row["price"]?.trim() ?? "";
  const prices = rawPrice
    .split("|")
    .map((p) => parseFloat(p.trim()))
    .filter((p) => !isNaN(p));

  if (prices.length === 0) return null;

  // Images: always start with the main image, then append anything in the images column.
  // This ensures the cover photo is always first even if images column omits it.
  const rawImages = row["images"]?.trim();
  const extraImages: string[] = rawImages
    ? rawImages.split("|").map((u) => u.trim()).filter(Boolean)
    : [];
  const images: string[] = [image, ...extraImages];

  // Sizes — normalize to short form for consistency
  const sizeMap: Record<string, string> = {
    small: "S",
    medium: "M",
    large: "L",
  };
  const rawSizes = (row["sizes"] ?? row["size"] ?? "").trim();
  const sizes = rawSizes
    .split("|")
    .map((s) => {
      const trimmed = s.trim();
      return sizeMap[trimmed.toLowerCase()] ?? trimmed;
    })
    .filter(Boolean);

  // For bracelets: auto-prepend XS if sizes start with S but not XS
  if (
    category === "bracelets" &&
    sizes.length > 0 &&
    sizes[0] === "S" &&
    !sizes.some((s) => s === "XS")
  ) {
    sizes.unshift("XS");
    prices.unshift(Math.max(0, prices[0] - 70));
  }

  // Care
  const rawCare = (row["care"] ?? "").trim();
  const care = rawCare.split("|").map((c) => c.trim()).filter(Boolean);

  const rawColors = (row["color"] ?? row["colors"] ?? "").trim();
  const colors = rawColors.split("|").map((c) => c.trim()).filter(Boolean);

  // Featured ("pick for you" column)
  const rawFeatured = (row["pick for you"] ?? row["featured"] ?? "").trim().toLowerCase();
  const featured = rawFeatured === "yes";

  const quantity = parseInt(row["quantity"] ?? "1", 10);
  const stock = isNaN(quantity) ? 1 : quantity;

  return {
    id,
    name,
    prices,
    price: prices[0], // lowest / default price
    image,
    images,
    category,
    description: (row["description"]?.trim() ?? "").replace(/^["'""]|["'""]$/g, "").trim() +
      (category === "sets" ? " — includes a matching necklace & bracelet." : ""),
    sizes,
    care,
    colors,
    featured,
    quantity: stock,
  };
}

// ── Fetch function ────────────────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const csv = await res.text();
  const rows = parseCsv(csv);
  return rows.map(rowToProduct).filter((p): p is Product => p !== null);
}

// ── Query options ─────────────────────────────────────────────────────────────
export const productsQueryOptions = {
  queryKey: ["products"] as const,
  queryFn: fetchProducts,
  staleTime: 1000 * 60 * 5,
};
