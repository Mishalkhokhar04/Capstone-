/* =========================================================
   Cart module
   Owns cart state and persists it to localStorage so it
   survives a page refresh or a jump between pages.
   ========================================================= */

const CART_KEY = "field-notes:cart";
const listeners = [];

function _read() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function _write(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  listeners.forEach((fn) => fn(items));
}

let _items = _read();

function getItems() {
  return _items;
}

function onChange(fn) {
  listeners.push(fn);
}

function addItem(product, qty = 1) {
  const existing = _items.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    _items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty,
    });
  }
  _write(_items);
}

function removeItem(id) {
  _items = _items.filter((i) => i.id !== id);
  _write(_items);
}

function setQty(id, qty) {
  const item = _items.find((i) => i.id === id);
  if (!item) return;
  if (qty <= 0) {
    removeItem(id);
    return;
  }
  item.qty = qty;
  _write(_items);
}

function clear() {
  _items = [];
  _write(_items);
}

function getCount() {
  return _items.reduce((sum, i) => sum + i.qty, 0);
}

function getSubtotal() {
  return _items.reduce((sum, i) => sum + i.qty * i.price, 0);
}

window.Store = window.Store || {};
window.Store.cart = {
  getItems,
  addItem,
  removeItem,
  setQty,
  clear,
  getCount,
  getSubtotal,
  onChange,
};
