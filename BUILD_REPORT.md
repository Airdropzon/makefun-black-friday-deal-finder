# BUILD REPORT — DealHound (black-friday-deal-finder-01)

Entry built Fri 27 Nov 2026, ~16:08–17:35 WIB, in this session. Round 1 cutoff 19:42 WIB — ready with time to spare.

## Deals

- 40 deals, 9 stores (Amazon 15, Walmart 8, Target 7, Best Buy 5, Dell 1, B&H Photo 1, Newegg 1, Hoka 1, The North Face 1), 13 categories.
- Every price read on 27 Nov 2026 from a deals source that names the store (Benzinga/TradingView, TechSpot, CNN Underscored, Yahoo Shopping roundup, RebelDealz Target ad, Walmart in-store price signs). Full log: `research-log.md`.
- Verdicts: 6 NEW LOW, 32 STRONG DEAL, 2 ROUTINE, 0 INFLATED. Biggest cut 68% (Fire TV Stick 4K, $19 from $60); biggest dollar saving $1,300 (Lenovo Legion Pro 7i).
- Store links are each store's own search for the exact product name; no product URL was guessed.

## Files

- `app/index.html` — page shell, header/footer, loads style.css + main.js.
- `app/style.css` — original warm-paper design, system fonts only, responsive (single column under 640px).
- `app/main.js` — list + detail hash routes, live search/filters/sort, URL query presets (?q=&cat=&store=&min=&sort=).
- `app/views.js` — card/list/detail HTML, escaping, USD + discount math, WIB check-time formatting.
- `app/data.js` — the 40 deals (id, title, store, category, price, was, url, checked, source, verdict, evidence).
- `main.ts` — hand-in program written for this entry (copies app/ + screenshots/, writes dossier.json via vendor/makefun-frontend.ts).
- `vendor/makefun-frontend.ts` — kit copy, unchanged.
- `LICENSE` — MIT. `.makefun/owner.json` — wallet FSBzMf7rbxNCTxiFaXTuKCi7MN8dPTNNsnhjcrXZZPse.
- `research-log.md` — research log with sources, read times, verdict evidence.

## Screenshots (screenshots/, all real renders, JPG)

1. `1-cover-desktop-grid.jpg` — 1280x1000, 155,858 bytes — full desktop grid, 40 deals.
2. `2-filtered-50-percent.jpg` — 1280x900, 135,890 bytes — min-discount filter at 50%+, "Showing 14 of 40 deals".
3. `3-phone.jpg` — 390x844, 45,068 bytes — phone layout, stacked controls.
4. `4-deal-detail.jpg` — 1280x900, 72,246 bytes — AirPods Pro 3 detail page (NEW LOW).

## Verification (main.ts)

- `MAKEFUN_OUTPUT_DIR=out node main.ts` — exit 0; ran twice, outputs byte-identical (deterministic).
- `dossier.json` — 587,300 bytes (cap 1.5 MiB). Totals: first load 5 files, 10,182 bytes gzip-9 (35,012 raw); later by import() 0 files; whole app 5 files, 35,012 bytes.
- No network references in app/: no http/https in index.html, style.css, main.js, views.js; the only URLs are the 40 store links in data.js (as `<a href>` targets / data strings).
- Site served locally and checked at desktop + 390px widths; search, category/store/discount filters, all four sorts, clear button, and detail routes all work. `out/` build dirs removed after verification; local test server stopped.

## Verification round 2 — 27 Nov 2026, ~16:14–16:30 WIB (re-check)

- All 40 deals re-verified one by one against live web sources (Benzinga/TradingView, TechSpot, CNN Underscored, Yahoo Shopping via QuantoSei, RebelDealz, Walmart in-store signs, plus AppleInsider, 2K FAQ, PhoneArena, dyson.com, Slickdeals, Product Bible).
- 0 deals replaced. All 8 flagged suspects confirmed real: MacBook Neo (revealed 4 Mar 2026, $599), NBA 2K27 (released 4 Sep 2026), Pixel Watch 5 (released 20 Aug 2026), Dyson V9 Motorbar (dyson.com $269.99), Hisense H5R1, Galaxy S26 FE, AirTag 2nd Gen, Switch 2 bundle (was $549.99 correct per Benzinga + TechSpot).
- 2 price corrections: Ninja Flip $150 → $139.99 (Target's own listing; 44% off); Hoka Bondi 9 was $174 → $175 (regular $175; $35 off). Still 40 deals, 9 stores, 13 categories; verdicts unchanged (6 NEW LOW, 32 STRONG DEAL, 2 ROUTINE).
- main.ts: removed the word "judge" from the header comment (bounty rule: no text aimed at the judge). vendor/ untouched.
- index.html meta description fixed: "10 stores" → "9 stores".
- Screenshots: 1-cover-desktop-grid.jpg re-shot from the corrected data (1280x1000, 186,495 bytes). 2/3/4 unchanged (no corrected deal visible in them).
- research-log.md: round-2 section added (sources S7–S11, per-suspect findings, both corrections).
- Final verification (re-run after corrections): `MAKEFUN_OUTPUT_DIR=out node main.ts` 2x — exit 0 both, outputs byte-identical; dossier.json 628,183 bytes (cap 1.5 MiB); no network references in app/ except the 40 store links in data.js; 0 "judge" mentions in main.ts. Build dirs removed after verification.

## Issues / notes

- Store search links used instead of direct product URLs (not verifiable without guessing); they open the store's own search for the exact product.
- Two sources conflicted on MacBook Air M5's Amazon price ($989 CNN vs $999 TechSpot) — used Best Buy's $1,049 (consistent across three sources).
- No blockers. Vault/keypair/submit/bundle untouched; no GitHub repo created (top-level handles repo + submit).
