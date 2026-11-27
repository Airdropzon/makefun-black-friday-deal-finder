// DealHound's behaviour: list page with live search and filters, and one page per
// deal, on hash routes. The list state can also be preset from the URL query
// string (?q=…&cat=…&store=…&min=…&sort=…), so a filtered view has an address.
//
//   #/            the list, with search and filters
//   #/deal/<id>   one deal
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./data.js";
import { dealPage, dealRows, listPage, missingPage } from "./views.js";

const app = document.getElementById("app");

const VERDICT_RANK = { "NEW LOW": 0, "STRONG DEAL": 1, ROUTINE: 2, INFLATED: 3 };

const discountOf = (d) => Math.round((1 - d.price / d.was) * 100);
const savingOf = (d) => d.was - d.price;

const counts = {
  total: deals.length,
  stores: new Set(deals.map((d) => d.store)).size,
  categories: new Set(deals.map((d) => d.category)).size,
  biggest: Math.max(...deals.map(discountOf)),
  newLows: deals.filter((d) => d.verdict === "NEW LOW").length,
};

const categories = [...new Set(deals.map((d) => d.category))].sort();
const stores = [...new Set(deals.map((d) => d.store))].sort();

// Filters live in one object so the list, the controls and the URL agree.
function readStateFromUrl() {
  const params = new URLSearchParams(location.search);
  return {
    q: params.get("q") ?? "",
    cat: params.get("cat") ?? "All",
    store: params.get("store") ?? "All",
    min: Number(params.get("min") ?? 0),
    sort: params.get("sort") ?? "off",
  };
}

function applyFilters(state) {
  const q = state.q.trim().toLowerCase();
  let shown = deals.filter(
    (d) =>
      (state.cat === "All" || d.category === state.cat) &&
      (state.store === "All" || d.store === state.store) &&
      discountOf(d) >= state.min &&
      (q === "" ||
        `${d.title} ${d.store} ${d.category} ${d.verdict}`.toLowerCase().includes(q)),
  );
  const byOff = (a, b) => discountOf(b) - discountOf(a) || savingOf(b) - savingOf(a);
  const bySaved = (a, b) => savingOf(b) - savingOf(a) || discountOf(b) - discountOf(a);
  const byPrice = (a, b) => a.price - b.price || discountOf(b) - discountOf(a);
  const byNew = (a, b) =>
    VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || byOff(a, b);
  const sorts = { off: byOff, saved: bySaved, price: byPrice, new: byNew };
  shown = [...shown].sort(sorts[state.sort] ?? byOff);
  return shown;
}

function fillOptions(select, values, current) {
  select.innerHTML =
    `<option value="All">All</option>` +
    values.map((v) => `<option value="${v}">${v}</option>`).join("");
  select.value = values.includes(current) ? current : "All";
}

function renderList(state) {
  document.title = "DealHound — Real Black Friday deals, checked today";
  app.innerHTML = listPage(applyFilters(state), counts);
  const search = app.querySelector("#search");
  const category = app.querySelector("#category");
  const store = app.querySelector("#store");
  const minOff = app.querySelector("#minOff");
  const sort = app.querySelector("#sort");
  const grid = app.querySelector("#dealGrid");
  const resultCount = app.querySelector("#resultCount");
  const clear = app.querySelector("#clearFilters");

  fillOptions(category, categories, state.cat);
  fillOptions(store, stores, state.store);
  search.value = state.q;
  minOff.value = String([0, 20, 30, 40, 50].includes(state.min) ? state.min : 0);
  sort.value = ["off", "saved", "price", "new"].includes(state.sort) ? state.sort : "off";

  const refresh = () => {
    const shown = applyFilters(state);
    grid.innerHTML = dealRows(shown);
    resultCount.textContent = `Showing ${shown.length} of ${deals.length} deals`;
  };

  search.addEventListener("input", () => {
    state.q = search.value;
    refresh();
  });
  category.addEventListener("change", () => {
    state.cat = category.value;
    refresh();
  });
  store.addEventListener("change", () => {
    state.store = store.value;
    refresh();
  });
  minOff.addEventListener("change", () => {
    state.min = Number(minOff.value);
    refresh();
  });
  sort.addEventListener("change", () => {
    state.sort = sort.value;
    refresh();
  });
  clear.addEventListener("click", () => {
    Object.assign(state, { q: "", cat: "All", store: "All", min: 0, sort: "off" });
    search.value = "";
    category.value = "All";
    store.value = "All";
    minOff.value = "0";
    sort.value = "off";
    refresh();
  });
  refresh();
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Deal not found"} | DealHound`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    renderList(readStateFromUrl());
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
