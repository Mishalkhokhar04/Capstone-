/* =========================================================
   Reusable header component.
   Every page has a single <header id="site-header"></header>
   and calls initHeader() to fill it in — keeps the search
   box, brand mark, and cart button defined in one place.
   ========================================================= */

function initHeader({ showSearch = true } = {}) {
  const header = document.getElementById("site-header");
  header.innerHTML = `
    <div class="container header-row">
      <a href="index.html" class="brand">
        Field Notes <span class="brand-mark">GOODS</span>
      </a>
      ${
        showSearch
          ? `<div class="header-search field">
               <input type="search" id="search-input" placeholder="Search products…" aria-label="Search products">
             </div>`
          : `<div></div>`
      }
      <button class="cart-toggle" data-open-cart aria-label="Open cart">
        Cart <span class="cart-count" data-cart-count>0</span>
      </button>
    </div>
  `;
}
