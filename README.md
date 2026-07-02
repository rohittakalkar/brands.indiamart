# IndiaMART Brands

A B2B marketplace vertical for discovering, comparing, and requesting quotes for **branded industrial products** — pumps, diesel generators, motors, power tools, automation systems, and more — from verified brands and their authorized sellers.

Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4.

📄 **Deeper documentation:**
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — what this product is, who it's for, and how the information architecture works
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — technical architecture, rendering strategy, state management
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — full entity/type reference
- [`docs/API.md`](docs/API.md) — API route reference
- [`docs/adr/`](docs/adr/) — architecture decision records

---

## Quick Start

**Prerequisites:** Node.js 20+

```bash
git clone <repo-url>
cd brands.indiamart
npm install
cp .env.example .env.local   # optional — see Configuration below
npm run dev
```

Visit **http://localhost:3000** — you should land on the homepage with a hero search bar, category tiles, and popular brands.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | No | Enables real AI-assisted answers in the (currently unwired) AI Assistant component. Without it, the app runs fully functional with all other features — this key gates one optional integration only. |

No database is required. All data (brands, products, suppliers) is served from an in-memory catalog in [`src/lib/data.ts`](src/lib/data.ts) — see [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md).

## Available Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start         # run the production build locally
npm run typecheck    # tsc --noEmit
npm run lint          # next lint
```

## Project Structure

```
src/
  app/               # Next.js App Router — pages and API routes
    api/             # REST API routes (brands, products, categories, leads, suppliers)
    brands/          # Brand Hub + Brand-MCat pages
    categories/      # Category Brands pages
    products/        # Product detail pages
    compare/         # Compare page
    ...
  components/        # React components (Server + Client)
  lib/
    data.ts          # Server-only in-memory data source + query helpers
    generatedCatalog.ts  # Programmatically generated product catalog (100 products)
    search.ts        # Search query resolution logic
  services/           # Client-side fetch wrappers around the API routes
  types.ts            # Shared TypeScript entity definitions
```

## Deployment

Deployed on Vercel. See [`vercel.json`](vercel.json) for build configuration — this file exists specifically because the Vercel project's dashboard settings still had a stale `vite build` command from before this project migrated off Vite, so the build/output settings are pinned explicitly in-repo rather than relying on dashboard config.

## Current Scope & Limitations

This is a prototype, not a production marketplace:
- No authentication or real user accounts
- No real database — all data resets on server restart (in-memory `BuyLead` submissions, etc.)
- Product catalogues and service-center listings are illustrative/pseudo data, not real files or real support contacts
- The AI Assistant component exists but is not wired into any page

See [`docs/PRODUCT.md`](docs/PRODUCT.md#scope--limitations) for the full list.
