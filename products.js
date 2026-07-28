/* =========================================================
   Product listing page
   ========================================================= */

let ALL_PRODUCTS = [];
let state = { search: "", category: "all" };

async function initListingPage() {
  initHeader();
  initUIKit();

  const grid = document.getElementById("product-grid");
  grid.innerHTML = Array.from({ length: 8 })
    .map(() => `<div class="skeleton"></div>`)
    .join("");

  try {
    ALL_PRODUCTS = await Store.api.fetchProducts();
    const categories = [...new Set(ALL_PRODUCTS.map((p) => p.category))].sort();
    renderChips(categories);
    render();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load products right now. Try refreshing the page.</div>`;
    console.error(err);
  }

  document.getElementById("search-input").addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    render();
  });
}

function renderChips(categories) {
  const row = document.getElementById("chip-row");
  const chips = ["all", ...categories];
  row.innerHTML = chips
    .map(
      (c) =>
        `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${c}">${c}</button>`
    )
    .join("");

  row.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.cat;
      row.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      render();
    });
  });
}

function getFiltered() {
  return ALL_PRODUCTS.filter((p) => {
    const matchesCategory = state.category === "all" || p.category === state.category;
    const matchesSearch = p.title.toLowerCase().includes(state.search);
    return matchesCategory && matchesSearch;
  });
}

function render() {
  const grid = document.getElementById("product-grid");
  const meta = document.getElementById("results-meta");
  const filtered = getFiltered();

  meta.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"}${
    state.category !== "all" ? ` in “${state.category}”` : ""
  }${state.search ? ` matching “${state.search}”` : ""}`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Nothing matches that search. Try a different term or category.</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
    <a href="product.html?id=${p.id}" class="card" data-id="${p.id}">
      <div class="card-media"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <span class="card-title">${p.title}</span>
        <div class="card-foot">
          <span class="price">${Store.ui.money(p.price)}</span>
          <button class="btn btn-primary btn-sm" data-add="${p.id}">Add</button>
        </div>
      </div>
    </a>`
    )
    .join("");

  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.dataset.add);
      const product = ALL_PRODUCTS.find((p) => p.id === id);
      Store.cart.addItem(product, 1);
      Store.ui.showToast(`Added “${truncate(product.title, 32)}” to cart`);
    });
  });
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

document.addEventListener("DOMContentLoaded", initListingPage);
