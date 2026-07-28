# Field Notes — Capstone Storefront

A small, fully client-side e-commerce demo built as a five-week capstone: product
listing with search/filtering, a persistent cart, a product detail view, and a
mock checkout — no build tools, no framework, just HTML/CSS/JS and a shared UI kit.

## Run it locally

No build step required.

```bash
# from the project folder
python3 -m http.server 5500
# then open http://localhost:5500 in a browser
```

(Opening `index.html` directly with `file://` also works, except the API fetch
may be blocked by the browser's CORS rules for local files in some browsers —
the dev server avoids that.)

## Project structure

```
storefront/
├── index.html        product listing page
├── product.html       product detail page (?id=<product id>)
├── checkout.html       cart summary + mock checkout form
├── css/style.css       design tokens + reusable UI kit styles
├── js/
│   ├── api.js          fetch layer (Fake Store API + local fallback)
│   ├── cart.js          cart state + localStorage persistence
│   ├── ui.js            toast / modal / cart drawer (reusable UI kit)
│   ├── header.js         reusable header component
│   ├── products.js        listing page logic (search, filters, render)
│   ├── product-detail.js  detail page logic
│   └── checkout.js        checkout form + order summary
└── data/products.json  fallback data if the live API is unreachable
```

## Case study

I built a three-page storefront — listing, product detail, and checkout — backed
by the Fake Store API, with a local JSON file as a fallback so the app still
works if the network call fails or is offline. The biggest technical decision
was keeping cart state in one small module (`cart.js`) that wraps `localStorage`
and exposes a subscribe pattern (`onChange`), so the header count, the cart
drawer, and the checkout summary all stay in sync without a framework or any
global event bus. I reused the same button, card, modal, and toast styles across
every page by centralizing them as CSS classes plus two shared JS components
(`ui.js` for toast/modal/drawer, `header.js` for the nav bar), rather than
re-implementing them per page. For animation I focused on a few purposeful
moments rather than scattering effects everywhere: the cart drawer slides in,
the running total "ticks" when it changes, product cards lift on hover, and a
skeleton shimmer covers the initial fetch instead of a blank screen. Given more
time, I'd add pagination or infinite scroll for the product grid, real client-side
routing instead of query-string navigation between static pages, and a proper
form-validation library so checkout errors are more specific than the browser's
default `required` messages.

## Notes on scope

- Checkout is a **mock** flow: submitting the form clears the cart and shows a
  generated order ID. No payment is processed and nothing is sent to a server.
- "Routing" between the product list, detail view, and checkout is done with
  static pages and a `?id=` query string rather than a client-side router,
  which keeps the project dependency-free.
