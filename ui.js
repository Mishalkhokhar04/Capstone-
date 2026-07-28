/* =========================================================
   UI kit
   Small, dependency-free components reused on every page:
   toasts, a confirm modal, and the cart drawer.
   Injects its own markup so pages just need one empty
   <div id="ui-root"></div>.
   ========================================================= */

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function initUIKit() {
  const root = document.getElementById("ui-root");
  root.innerHTML = `
    <div class="toast-stack" id="toast-stack"></div>

    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal" id="modal-body"></div>
    </div>

    <div class="drawer-backdrop" id="drawer-backdrop"></div>
    <aside class="drawer" id="cart-drawer" aria-label="Shopping cart">
      <div class="drawer-head">
        <h3 style="margin:0;font-size:18px;">Your cart</h3>
        <button class="btn-icon" id="drawer-close" aria-label="Close cart">✕</button>
      </div>
      <div class="drawer-items" id="drawer-items"></div>
      <div class="drawer-foot">
        <div class="total-row">
          <span class="label">Subtotal</span>
          <span class="value" id="drawer-total">$0.00</span>
        </div>
        <a class="btn btn-primary btn-block" href="checkout.html" id="checkout-btn">Checkout</a>
        <button class="btn btn-secondary btn-block btn-sm" id="clear-cart-btn">Clear cart</button>
      </div>
    </aside>
  `;

  document.getElementById("drawer-backdrop").addEventListener("click", closeDrawer);
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("clear-cart-btn").addEventListener("click", () => {
    showModal({
      title: "Clear your cart?",
      body: "This removes every item currently in your cart.",
      confirmLabel: "Clear cart",
      onConfirm: () => {
        Store.cart.clear();
        showToast("Cart cleared");
      },
    });
  });

  document.querySelectorAll("[data-open-cart]").forEach((btn) =>
    btn.addEventListener("click", openDrawer)
  );

  Store.cart.onChange(renderDrawer);
  renderDrawer(Store.cart.getItems());
  updateCartCount();
}

/* ---------- toast ---------- */
function showToast(message) {
  const stack = document.getElementById("toast-stack");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="dot"></span><span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add("leaving");
    setTimeout(() => el.remove(), 300);
  }, 2200);
}

/* ---------- modal ---------- */
function showModal({ title, body, confirmLabel = "Confirm", onConfirm }) {
  const backdrop = document.getElementById("modal-backdrop");
  const el = document.getElementById("modal-body");
  el.innerHTML = `
    <h3>${title}</h3>
    <p style="color:var(--ink-soft);font-size:14px;">${body}</p>
    <div class="modal-actions">
      <button class="btn btn-secondary btn-block" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary btn-block" id="modal-confirm">${confirmLabel}</button>
    </div>
  `;
  backdrop.classList.add("open");
  const close = () => backdrop.classList.remove("open");
  document.getElementById("modal-cancel").onclick = close;
  backdrop.onclick = (e) => { if (e.target === backdrop) close(); };
  document.getElementById("modal-confirm").onclick = () => {
    onConfirm && onConfirm();
    close();
  };
}

/* ---------- cart drawer ---------- */
function openDrawer() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("drawer-backdrop").classList.add("open");
}
function closeDrawer() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("drawer-backdrop").classList.remove("open");
}

function renderDrawer(items) {
  const wrap = document.getElementById("drawer-items");
  const totalEl = document.getElementById("drawer-total");
  if (!wrap) return;

  if (items.length === 0) {
    wrap.innerHTML = `<div class="drawer-empty">Your cart is empty.<br>Add something you like the look of.</div>`;
  } else {
    wrap.innerHTML = items
      .map(
        (i) => `
      <div class="cart-item" data-id="${i.id}">
        <img src="${i.image}" alt="">
        <div class="cart-item-info">
          <div class="cart-item-title">${i.title}</div>
          <div class="qty-row">
            <button class="btn-icon" data-step="-1">−</button>
            <span class="qty-val">${i.qty}</span>
            <button class="btn-icon" data-step="1">+</button>
          </div>
          <button class="remove-link" data-remove>Remove</button>
        </div>
        <div class="cart-item-price">${money(i.price * i.qty)}</div>
      </div>`
      )
      .join("");

    wrap.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.closest(".cart-item").dataset.id);
        const item = Store.cart.getItems().find((i) => i.id === id);
        const step = Number(btn.dataset.step);
        Store.cart.setQty(id, item.qty + step);
      });
    });
    wrap.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.closest(".cart-item").dataset.id);
        Store.cart.removeItem(id);
        showToast("Removed from cart");
      });
    });
  }

  const newTotal = money(Store.cart.getSubtotal());
  if (totalEl.textContent !== newTotal) {
    totalEl.textContent = newTotal;
    totalEl.classList.remove("tick");
    void totalEl.offsetWidth; // restart animation
    totalEl.classList.add("tick");
  }
  updateCartCount();
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const n = Store.cart.getCount();
    el.textContent = n;
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  });
}

window.Store = window.Store || {};
window.Store.ui = { showToast, showModal, openDrawer, closeDrawer, money };
