# API Reference

All routes live under `src/app/api/` and are implemented as Next.js Route Handlers. They exist for **client-side use only** — Server Component pages read data directly from `src/lib/data.ts` and never call these routes internally (see [ARCHITECTURE.md](ARCHITECTURE.md#server-only-data-access-vs-client-side-services)).

Base URL in development: `http://localhost:3000`

---

### `GET /api/health`

Liveness check.

**Response `200`:**
```json
{ "status": "ok", "time": "2026-07-02T10:15:00.000Z" }
```

---

### `GET /api/categories`

Returns all MCats (micro-categories).

**Response `200`:** `MCat[]` — see [DATA_MODEL.md](DATA_MODEL.md#mcat--micro-category)

---

### `GET /api/brands`

Returns all brands.

**Response `200`:** `Brand[]`

---

### `GET /api/brands/:brandId`

**Response `200`:** `Brand`
**Response `404`:** `{ "error": "Brand not found" }`

---

### `GET /api/products`

**Query params:**

| Param | Required | Description |
|---|---|---|
| `mcatId` | No | Filter to products in this MCat |
| `brandId` | No | Filter to products from this brand |

Both can be combined. Omit both to get the full 112-product catalog.

**Response `200`:** `Product[]`

---

### `GET /api/products/:productId`

**Response `200`:** `Product`
**Response `404`:** `{ "error": "Product not found" }`

---

### `GET /api/suppliers`

**Query params:**

| Param | Required | Description |
|---|---|---|
| `brandId` | No | Filter to this brand's suppliers |
| `productId` | No | Filter to sellers of this exact product |

**Response `200`:** `Supplier[]`

---

### `GET /api/leads`

Returns all quote requests submitted so far in this server process.

**Response `200`:** `BuyLead[]`

> In-memory only — resets on server restart. There is no persistence layer.

---

### `POST /api/leads`

Creates a new quote request (buyer-facing copy calls this "Get Quotes" / "Send Requirement" — never "BuyLead" in the UI; see [PRODUCT.md](PRODUCT.md#buyer-facing-language)).

**Request body:**

| Field | Type | Required |
|---|---|---|
| `productName` | string | Yes |
| `brandName` | string | No |
| `quantity` | string | Yes |
| `location` | string | Yes |
| `requirement` | string | Yes |

**Success — `201 Created`:** the created `BuyLead`, with `id`, `timestamp`, and `status: 'pending'` assigned server-side.

**Error — `400 Bad Request`:**
```json
{ "error": "productName, quantity, location, and requirement are required." }
```

---

### `POST /api/gemini/assistant`

Powers the AI Assistant component (`src/components/AIAssistant.tsx`). **This component is not currently linked from any page in the app** — the route is fully implemented but dormant from a user's perspective.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `message` | string | Yes |
| `previousMessages` | `{ sender: 'user' \| string, text: string }[]` | No — conversation history for context |

**Behavior:**
- If `GEMINI_API_KEY` is set to a real key, calls the Gemini API (`gemini-3.5-flash`) with a system prompt scoped to this catalog's brands, and returns a structured JSON response (`reply`, `recommendedBrandId`, `recommendedCategory`, `draftedBuyLead`).
- If `GEMINI_API_KEY` is unset or still the placeholder value, **falls back gracefully** to keyword-matched canned responses (checks the message for "ksb"/"submersible", "siemens"/"plc", "motor"/"crompton", else defaults to Kirloskar) and returns the same response shape with `_isFallback: true` and an `_apiKeyMsg` explaining why.

**Response `200`:**
```json
{
  "reply": "markdown-formatted recommendation text",
  "recommendedBrandId": "kirloskar",
  "recommendedCategory": "machinery",
  "draftedBuyLead": {
    "productName": "...", "brandName": "...", "quantity": "...",
    "location": "...", "requirement": "..."
  },
  "_isFallback": true,
  "_apiKeyMsg": "GEMINI_API_KEY is not configured..."
}
```

**⚠️ Known documentation-time finding:** this endpoint's system prompt and fallback logic still reference the pre-rename category vocabulary (`'machinery'`, `'electrical'`, `'automation'`, `'tools'`) and only name 6 of the current 8 catalog brands (missing Voltas, Atlas Copco). These are stale from before the [PMcat/MCat taxonomy rename](adr/0001-pmcat-mcat-taxonomy.md) and the later 100-product catalog expansion. Since this component isn't linked from any page, it hasn't surfaced as a user-facing bug — but it should be updated before this component is ever wired in.

---

## Client usage pattern

Client Components call these routes through thin wrappers in `src/services/*.ts`, never `fetch()` directly:

```ts
// src/services/products.ts
export async function getProducts(filter?: { mcatId?: string; brandId?: string }): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filter?.mcatId) params.set('mcatId', filter.mcatId);
  if (filter?.brandId) params.set('brandId', filter.brandId);
  const qs = params.toString();
  const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`);
  return res.json();
}
```

This keeps the fetch URL/query-param logic in one place per entity, rather than scattered across every component that needs data client-side.

`src/services/{brands,categories,leads,suppliers,assistant}.ts` follow the same wrapper pattern, one file per entity. `services/products.ts`'s `getProducts`/`getProduct` are currently unused by any component (same dormant status as the AI Assistant) — their filter param was found and corrected from a stale `category` to `mcatId` while writing this documentation, since it had silently drifted from the API route's actual accepted param during the PMcat/MCat rename and wasn't caught by `tsc` (the mismatch was between two independently-typed objects, not a type error).
