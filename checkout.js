/* =========================================================
   Checkout page
   No real payment processing — this validates a shipping
   form, "places" the order client-side, and clears the cart.
   ========================================================= */

function initCheckoutPage() {
  initHeader({ showSearch: false });
  initUIKit();
  renderSummary(Store.cart.getItems());
  Store.cart.onChange(renderSummary);

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
}

function renderSummary(items) {
  const summaryEl = document.getElementById("order-summary");
  const submitBtn = document.getElementById("place-order-btn");
  if (!summaryEl) return;

  if (items.length === 0 && !document.getElementById("confirm-panel")) {
    summaryEl.innerHTML = `<div class="empty-state">Your cart is empty. <a href="index.html">Go find something to buy</a></div>`;
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  const subtotal = Store.cart.getSubtotal();
  const shipping = items.length ? 6.5 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  summaryEl.innerHTML = `
    ${items
      .map(
        (i) => `
      <div class="summary-line">
        <span>${i.qty} × ${truncate(i.title, 30)}</span>
        <span>${Store.ui.money(i.price * i.qty)}</span>
      </div>`
      )
      .join("")}
    <div class="summary-line"><span>Subtotal</span><span>${Store.ui.money(subtotal)}</span></div>
    <div class="summary-line"><span>Shipping</span><span>${Store.ui.money(shipping)}</span></div>
    <div class="summary-line"><span>Tax (8%)</span><span>${Store.ui.money(tax)}</span></div>
    <div class="summary-line grand"><span>Total</span><span>${Store.ui.money(total)}</span></div>
  `;

  if (submitBtn) submitBtn.disabled = items.length === 0;
}

function handleSubmit(e) {
  e.preventDefault();
  const items = Store.cart.getItems();
  if (items.length === 0) return;

  const form = e.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const orderId = "FN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const total = Store.cart.getSubtotal() * 1.08 + 6.5;

  document.getElementById("checkout-page-body").innerHTML = `
    <div class="confirm-panel" id="confirm-panel">
      <div class="confirm-icon">✓</div>
      <h2>Order placed</h2>
      <p style="color:var(--ink-soft);">Thanks — a confirmation would normally land in your inbox.<br>This is a demo checkout, so no payment was charged.</p>
      <div class="order-id">${orderId} · ${Store.ui.money(total)}</div>
      <div style="margin-top:28px;">
        <a href="index.html" class="btn btn-primary">Continue shopping</a>
      </div>
    </div>
  `;

  Store.cart.clear();
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

document.addEventListener("DOMContentLoaded", initCheckoutPage);
