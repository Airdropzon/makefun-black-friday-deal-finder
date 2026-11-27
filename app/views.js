// DealHound's page HTML: every value is escaped before it goes into the page.
// Builds the deal cards, the list page and the single-deal page.

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const usd = (n) =>
  `$${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);

const saved = (d) => d.was - d.price;

// "27 Nov 2026, 16:12 WIB" from the stored UTC timestamp.
const checkedAt = (iso) => {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
  return `${parts} WIB`;
};

const verdictClass = (v) =>
  v === "NEW LOW"
    ? "badge-new-low"
    : v === "STRONG DEAL"
      ? "badge-strong"
      : v === "INFLATED"
        ? "badge-inflated"
        : "badge-routine";

export function dealCard(d) {
  return `<article class="card">
  <div class="card-top">
    <span class="chip store-chip">${escape(d.store)}</span>
    <span class="chip">${escape(d.category)}</span>
    <span class="badge ${verdictClass(d.verdict)}">${escape(d.verdict)}</span>
  </div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="price-line">
    <span class="price">${usd(d.price)}</span>
    <s class="was">${usd(d.was)}</s>
    <span class="off">${percentOff(d)}% off</span>
  </p>
  <p class="save">You save ${usd(saved(d))}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <p class="meta">Checked ${checkedAt(d.checked)} &middot; Source: ${escape(d.source)}</p>
  <p class="card-link"><a href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
</article>`;
}

export function dealRows(deals) {
  if (deals.length === 0) {
    return `<li class="empty">No deal matches those filters. Try clearing the search or lowering the minimum discount.</li>`;
  }
  return deals.map((d) => `<li>${dealCard(d)}</li>`).join("");
}

export function listPage(deals, counts) {
  return `<section class="hero">
  <h1>Real Black Friday deals, checked today</h1>
  <p class="hero-sub">Every price below was read at its store or in a deals source that names the store on
  Friday 27 Nov 2026. Each deal carries an honest verdict: a new low, a strong price, or a routine cut.</p>
  <p class="stats" id="stats">${counts.total} deals &middot; ${counts.stores} stores &middot; ${counts.categories} categories &middot; biggest cut ${counts.biggest}% &middot; ${counts.newLows} new lows</p>
</section>
<section class="controls" aria-label="Search and filter deals">
  <label class="control search-control">Search
    <input id="search" type="search" placeholder="Try &ldquo;headphones&rdquo; or &ldquo;TV&rdquo;" autocomplete="off">
  </label>
  <label class="control">Category
    <select id="category"></select>
  </label>
  <label class="control">Store
    <select id="store"></select>
  </label>
  <label class="control">Min. discount
    <select id="minOff">
      <option value="0">Any discount</option>
      <option value="20">20% or more</option>
      <option value="30">30% or more</option>
      <option value="40">40% or more</option>
      <option value="50">50% or more</option>
    </select>
  </label>
  <label class="control">Sort by
    <select id="sort">
      <option value="off">Biggest discount</option>
      <option value="saved">Biggest saving ($)</option>
      <option value="price">Lowest price</option>
      <option value="new">New lows first</option>
    </select>
  </label>
  <button id="clearFilters" type="button">Clear filters</button>
</section>
<p class="result-count" id="resultCount" aria-live="polite"></p>
<ul class="deal-grid" id="dealGrid">${dealRows(deals)}</ul>`;
}

export function dealPage(d) {
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top">
    <span class="chip store-chip">${escape(d.store)}</span>
    <span class="chip">${escape(d.category)}</span>
    <span class="badge ${verdictClass(d.verdict)}">${escape(d.verdict)}</span>
  </div>
  <h1>${escape(d.title)}</h1>
  <p class="price-line big">
    <span class="price">${usd(d.price)}</span>
    <s class="was">${usd(d.was)}</s>
    <span class="off">${percentOff(d)}% off</span>
  </p>
  <p class="save">You save ${usd(saved(d))} off the usual ${usd(d.was)}.</p>
  <dl class="facts">
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Verdict</dt><dd><strong>${escape(d.verdict)}</strong> — ${escape(d.evidence)}</dd>
    <dt>Price checked</dt><dd>${checkedAt(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p class="card-link"><a href="${escape(d.url)}" target="_blank" rel="noopener">View it at ${escape(d.store)} &rarr;</a></p>
  <p class="fineprint">Prices move fast on Black Friday — confirm the price at the store before you buy.</p>
</article>`;
}

export function missingPage() {
  return `<h1>Deal not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
