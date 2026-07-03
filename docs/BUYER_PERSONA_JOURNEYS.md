# Buyer Persona Journeys — Live-Browsed Intent Audit

Companion to [`BUYER_JOURNEYS.md`](BUYER_JOURNEYS.md), which mapped every journey from the code outward (routes, props, links). This document works the other direction: six realistic buyer personas, each actually driven through the live app with a real browser (Playwright against a local production build), checking one thing at every screen transition — **did this buyer's intent survive, or did they have to re-explain themselves?**

Two findings below were caught and corrected *during* this audit, not left in: an initial test run appeared to show a search-resolution regression and a shortlist-reset-on-every-navigation bug — both turned out to be flaws in the test method itself (an early `waitForURL` assertion racing a server redirect, and using a hard `page.goto()` where a real buyer would have clicked an in-app link). Both are re-verified below with the corrected method and reported accurately. This mirrors the same discipline applied earlier in this project to the BF-06/HP-05/CF-09 test cases — a failure is only reported as a product defect after an isolated, correct reproduction confirms it.

---

## The personas

| # | Name | Who they are | What they already know | What "success" looks like for them |
|---|---|---|---|---|
| 1 | Priya | Plant engineer at a mid-size factory | The exact spec she needs — she's done her homework | Type it once, land on the right product, done |
| 2 | Ramesh | New factory owner, first time buying this equipment | The product category, nothing about brands | Compare brands, narrow by spec, pick one, without losing her place |
| 3 | Anita | Corporate procurement manager | A brand she already trusts from past dealings | See everything that brand offers, drill into the line she needs |
| 4 | Vikram | Cost-conscious SME owner | Wants to weigh multiple sellers before committing | A clean side-by-side comparison, scoped to what he actually needs |
| 5 | Sunil | Was forwarded a link by a colleague (WhatsApp/email) | Nothing — he's never been to this site before | The linked page just works, and he can go one step further if curious |
| 6 | Meera | Has used the site before this week | Already shortlisted things, submitted a quote request | Picking up where she left off, later, without starting over |

---

## Persona 1 — Priya, the exact-spec engineer

**Journey:** Homepage → hero search → "Kirloskar 62.5 kVA diesel generator" → Enter.

**What happened:** ✅ Server-side resolution correctly identifies this as a single confident product match and redirects to `/products/kirloskar-dg-625` — landing page title: *"Kirloskar Brothers Limited KG1-62.5AS — Prime Power: 62.5 kVA / 50 kW | IndiaMART Brands"*. Full specs, sellers scoped to this exact model, and a "Get Quote" CTA prefilled with the complete spec table are all present on arrival.

*(An earlier pass of this same check, using a looser `waitForURL` pattern that matched the intermediate `/search?q=...` URL before the client-side transition finished settling, appeared to show this landing on the fallback search-results grid instead. Re-run with `waitForLoadState('networkidle')` confirms the direct redirect works correctly — the first result was a test-timing artifact, not a real regression.)*

**Verdict:** Priya's intent — the exact model — is honored immediately. Zero re-explaining. This is the shortest possible path in the entire app and it works.

---

## Persona 2 — Ramesh, category-first and brand-agnostic

**Journey:** `/categories/diesel-generators` → filter by "62.5 kVA / 50 kW" → tap Kirloskar's brand card → Brand Hub → tap "Continue with KG1-62.5AS" → Brand-MCat page → "Get Quotes".

**What happened, screen by screen:**
1. **Category page:** filter applies correctly; one `<h1>` (not two). Brand card's outbound link is `/brands/kirloskar?fromCategory=diesel-generators&spec=62.5+kVA+%2F+50+kW`.
2. **Brand Hub:** lands with that context → banner reads "You were exploring Kirloskar 62.5 kVA / 50 kW Diesel Generators", Products tab is already open (no manual tap needed), the Diesel Generators product line is marked "You were here". "Continue with KG1-62.5AS" link → `/brands/kirloskar/diesel-generators?model=kirloskar-dg-625`.
3. **Brand-MCat page:** lands with the 62.5 kVA model **already selected** — not defaulted to whatever the first array entry happens to be. One `<h1>`. "Get Quotes for KG1-62.5AS" opens with the full spec table.

**Verdict:** ✅ This is the same mechanism verified for the Atlas Copco/air-compressors case, confirmed here to generalize correctly to a *different* category and brand (Diesel Generators / Kirloskar) — not a one-off fix that only worked for the exact case the mentor reviewed.

---

## Persona 3 — Anita, brand-loyal

**Journey:** Homepage Popular Brands rail → Kirloskar → (no incoming context — she came straight from the homepage, not a filtered category page) → manually taps "Products" tab → picks the Industrial Pumps line → Brand-MCat page.

**What happened:** Brand Hub correctly opens to Overview (the default, since there's no category context to justify skipping it) — no continuity banner renders, which is correct: there's nothing to preserve yet, since Anita hasn't stated a specific spec or model anywhere. She taps Products herself, picks a line, lands on the Brand-MCat page for Industrial Pumps with one `<h1>` and the (reasonable, since she gave no spec) first model preselected.

**Verdict:** ✅ Coherent and correct. The intent-continuity mechanism is additive, not forced — it only activates when there's real context to carry, and stays out of the way otherwise. Worth naming explicitly: Anita's journey is the control case that shows the fix isn't overreaching into journeys that don't need it.

---

## Persona 4 — Vikram, comparison shopper

**Two entry points tested:**

**4a. Cold, via bottom-nav "Compare":** `/compare` with no params → correctly shows a category picker rather than preloading every seller across every category into one nonsensical comparison.

**4b. Scoped, from a category page:** `/categories/industrial-pumps` → "Compare Brands" CTA → `/compare?category=industrial-pumps` → sellers for that category are preloaded automatically (19 of them, in this case — see note below), each with a "View Profile" link back to its brand.

**Verdict:** ✅ Both entry modes work as designed and the scoped link is fully shareable/bookmarkable (the scope lives in the URL, not client state).

⚠️ **Adjacent observation, not an intent-continuity issue:** the category-scoped Compare view preloaded all 19 industrial-pumps sellers at once. Since "Add Seller" only appears when fewer than 5 sellers are currently compared, it never appeared in this test — not a bug (the guard is working exactly as coded), but 19 side-by-side comparison cards is a lot to scroll through for what's meant to be a considered decision. Worth a UX look separately from the intent-continuity work this document is scoped to.

---

## Persona 5 — Sunil, arriving cold via a shared link

**Journey:** No prior visit to the site at all — lands directly on `/products/atlascopco-ga11`, as if a colleague had forwarded the link.

**What worked correctly on the cold landing:** full specs, sellers scoped to this exact product, Compare Alternatives, shortlist, add-to-basket, and the RFQ button (fully spec-populated) — all render correctly with zero dependency on prior navigation, since the route itself carries everything needed.

**What didn't:**
- ⚠️ **No way to reach the brand from here.** `product.brandName` ("Atlas Copco India") is plain text in three places on the page — never a link to `/brands/atlascopco`. Sunil, curious what else this manufacturer makes, has no in-page path there.
- ⚠️ **The back button is `router.back()`, not a real link.** Tested directly: with only the single history entry a genuinely fresh tab would have, clicking it does nothing (`window.history.length` was too short for `back()` to have anywhere to go). That's the *milder* of two possible bad outcomes — the more concerning one (documented in `BUYER_JOURNEYS.md`) is a tab that *does* have one prior entry, e.g. the search engine results page Sunil came from, in which case `router.back()` would carry him out of the app entirely, not to any page inside it. Either way, the button doesn't reliably do anything useful for a cold landing, because it was written assuming in-app history that doesn't exist here.

**Verdict:** ⚠️ The two gaps here are exactly the ones this task asked about explicitly — a buyer landing directly on a product page hits a real dead end trying to explore further, even though everything about the product itself displays correctly.

---

## Persona 6 — Meera, returning to pick up where she left off

**Journey, tested in two distinct modes to get an honest answer:**

**6a. Same session (real buyer behavior — she shortlists something, then clicks an in-app link to check her shortlist, all without closing the tab):** Shortlists KSB from its Brand Hub → clicks the "Shortlist" link in the nav (a real `<Link>` click, not a reload) → `/shortlist` correctly shows KSB.
✅ **State persists correctly within a continuous session**, exactly as it should — this confirms the `ShortlistProvider`/`QuoteBasketProvider`/`RecentlyViewedProvider` client Context works fine for the overwhelmingly common case of "I did three things in a row without closing the tab."

*(An earlier version of this check used `page.goto()` between every step — a hard page reload — which incorrectly showed the shortlist as empty immediately after adding KSB. That's not what a real buyer experiences when clicking a nav link; it's what happens on an actual full-page reload, which is a different and much rarer scenario, tested separately below.)*

**6b. Genuinely returning later (new browser session, e.g. she closes the tab and comes back the next day, or opens the site on a different device):** A brand-new session loading `/shortlist` shows the three hardcoded seed brands/products (`kirloskar`, `voltas-water-cooler`, `machinery`) — not Meera's actual KSB pick, and not an honest empty state either.

**Verdict:** Mixed. ✅ for the common case (same-session navigation, which is most of what "browsing" means). ⚠️ for the genuine return-visit case: nothing in Shortlist, Quote Basket, or Recently Viewed is durable past a session boundary, and the shortlist's specific failure mode (showing plausible-looking but wrong seed data) is worse than a plain empty state, since it doesn't even signal to Meera that something reset. `/leads` (her actual submitted quote requests) *is* server-backed and does survive — so the conversion event itself is durable, only the browsing aids around it aren't.

---

## Summary — where intent survives vs. where it doesn't

| Persona | Journey | Intent preserved? |
|---|---|---|
| 1. Priya | Exact search → product | ✅ Immediate, no friction |
| 2. Ramesh | Category → spec filter → brand → model | ✅ Fixed this session; confirmed to generalize beyond the one case reviewed |
| 3. Anita | Brand-first, no prior context | ✅ Correctly a no-op — nothing to preserve, doesn't overreach |
| 4. Vikram | Compare, cold and scoped | ✅ Both entry modes correct; scoped links are shareable |
| 5. Sunil | Cold landing on a product page | ⚠️ Product itself is fine; can't reach the brand; back button unreliable |
| 6. Meera | Same-session vs. returning later | ✅ same-session / ⚠️ genuine return visit (browsing aids reset, quote requests don't) |

Every ⚠️ above was already identified in `BUYER_JOURNEYS.md` §8's ranked gap list from the code-reading pass — this persona audit's main contribution is confirming those gaps hold up under live browsing (not just static analysis) and ruling out several *other* suspected issues that turned out to be test-method artifacts once reproduced carefully. Nothing here has been implemented — same as before, this is the audit, ready for you to say which gap(s) to act on.
