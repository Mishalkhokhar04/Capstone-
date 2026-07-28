/* =========================================================
   API layer
   Talks to the Fake Store API (https://fakestoreapi.com).
   Falls back to a bundled local JSON file if the network
   request fails, so the app still works offline/in a sandbox.
   ========================================================= */

const API_BASE = "https://fakestoreapi.com";
const LOCAL_FALLBACK = "data/products.json";

let _cache = null; // in-memory cache for the lifetime of the tab

async function fetchProducts() {
  if (_cache) return _cache;
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const data = await res.json();
    _cache = data;
    return data;
  } catch (err) {
    console.warn("Falling back to local product data:", err.message);
    const res = await fetch(LOCAL_FALLBACK);
    const data = await res.json();
    _cache = data;
    return data;
  }
}

async function fetchProductById(id) {
  const all = await fetchProducts();
  const found = all.find((p) => String(p.id) === String(id));
  if (found) return found;
  // last resort: hit the API directly for a single product
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error("not found");
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchCategories() {
  const all = await fetchProducts();
  return [...new Set(all.map((p) => p.category))].sort();
}

window.Store = window.Store || {};
window.Store.api = { fetchProducts, fetchProductById, fetchCategories };
