/* =========================================================
   Product detail page
   ========================================================= */

let CURRENT_PRODUCT = null;
let qty = 1;

async function initDetailPage() {
  initHeader({ showSearch: false });
  initUIKit();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const wrap = document.getElementById("detail-root");

  if (!id) {
    wrap.innerHTML = `<div class="empty-state">No product selected. <a href="index.html">Back to shop</a></div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="detail-grid">
      <div class="skeleton"></div>
      <div>
        <div class="skeleton" style="aspect-ratio:auto;height:22px;width:60%;margin-bottom:14px;"></div>
        <div class="skeleton" style="aspect-ratio:auto;height:38px;width:90%;"></div>
      </div>
    </div>`;

  CURRENT_PRODUCT = await Store.api.fetchProductById(id);

  if (!CURRENT_PRODUCT) {
    wrap.innerHTML = `<div class="empty-state">We couldn't find that product. <a href="index.html">Back to shop</a></div>`;
    return;
  }

  render();
}

function render() {
  const p = CURRENT_PRODUCT;
  const wrap = document.getElementById("detail-root");
  const stars = "★".repeat(Math.round(p.rating?.rate || 0)) + "☆".repeat(5 - Math.round(p.rating?.rate || 0));

  wrap.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Shop</a> &nbsp;/&nbsp; <span style="text-transform:capitalize;">${p.category}</span>
    </div>
    <div class="detail-grid">
      <div class="detail-media"><img src="${p.image}" alt="${p.title}"></div>
      <div>
        <span class="card-cat">${p.category}</span>
        <h1 style="font-size:28px;margin-top:6px;">${p.title}</h1>
        <div class="rating-row">
          <span class="stars">${stars}</span>
          <span>${p.rating?.rate ?? "—"} · ${p.rating?.count ?? 0} reviews</span>
        </div>
        <div class="detail-price">${Store.ui.money(p.price)}</div>
        <p class="detail-desc">${p.description}</p>
        <div class="detail-actions">
          <div class="stepper">
            <button class="btn-icon" id="qty-minus">−</button>
            <span class="qty-val" id="qty-display" style="min-width:24px;text-align:center;">1</span>
            <button class="btn-icon" id="qty-plus">+</button>
          </div>
          <button class="btn btn-primary" id="add-to-cart-btn">Add to cart</button>
        </div>
      </div>
    </div>
  `;

  qty = 1;
  document.getElementById("qty-minus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    document.getElementById("qty-display").textContent = qty;
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    qty += 1;
    document.getElementById("qty-display").textContent = qty;
  });
  document.getElementById("add-to-cart-btn").addEventListener("click", (e) => {
    Store.cart.addItem(CURRENT_PRODUCT, qty);
    Store.ui.showToast(`Added ${qty} × “${truncate(CURRENT_PRODUCT.title, 28)}” to cart`);
    const btn = e.currentTarget;
    btn.style.transform = "scale(0.94)";
    setTimeout(() => (btn.style.transform = ""), 150);
  });
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

document.addEventListener("DOMContentLoaded", initDetailPage);
