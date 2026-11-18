# SHILPIKA — Handmade with Meaning

Static storefront + admin, built with plain HTML, CSS and vanilla JavaScript (no frameworks, no build step).
It is a **frontend demo**: all data lives in your browser's `localStorage`. No real orders, payments or logins exist.

## Run it
Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Admin: `/admin/index.html` — demo login `admin@shilpika.demo` / `admin123` (client-side check, **not secure**).
Admin → Store settings → *Reset demo data* restores the sample catalogue.

## Structure
```
index.html shop.html product.html cart.html checkout.html wishlist.html account.html
about.html contact.html faq.html policy.html?p=shipping|returns|privacy|terms
admin/index.html  admin.js  admin.css
css/  base.css (tokens, forms, buttons) · components.css (header, cards, drawer, search, footer)
      pages.css (page layouts) · home.css (retail home: slider, packages, deals)
js/   data.js   SAMPLE seed data (products, coupons, settings, demo orders)
      art.js    generated product illustrations (placeholder for real photos)
      store.js  THE data layer — every read/write goes through SH.store
      ui.js     header/footer/cart drawer/search/toast/product card
      home.js shop.js product.js cart.js checkout.js account.js wishlist.js static.js
_original/      your original index.html, script.js, style.css (kept for reference)
```

## Replace before launch
- **Product photos:** images are generated SVG illustrations. Put real image URLs in `product.images`
  (or upload via Admin → Products). Add `alt` text and compress for web.
- **Sample content:** product copy, prices, compare-at prices, package contents, testimonials, FAQ, policies and
  the About story are all placeholders. Testimonials and reviews are labelled "Demo".
- **Contact details / WhatsApp:** Admin → Store settings (WhatsApp number enables the floating chat button).

## Backend integration still needed
| Area | Today (demo) | What to build |
|---|---|---|
| Catalogue, stock, categories, coupons | `SH.store.products/categories/coupons` → localStorage | REST/DB endpoints; make `store.js` methods async |
| Cart & price totals | `SH.store.cart.totals()` computed in the browser | **Recompute price, discount, shipping and stock on the server** at checkout |
| Orders | `SH.store.orders.create()` | Server-created orders, order emails/SMS |
| Payments | `SH.store.payments.{razorpay,upi,cod}.start()` stubs | Razorpay Orders API + signature verification; UPI via gateway; COD rules |
| Auth | localStorage users, weak hash | Real accounts (hashed passwords/sessions or an auth provider), password reset |
| Admin auth | hard-coded credentials | Server-side admin login, roles, protect `/admin` |
| Image uploads | resized to data-URLs in localStorage (~5 MB limit) | Object storage / CDN |
| Shipping | flat rates + PIN-based delivery *estimate* | Courier API (Shiprocket, Delhivery…) for rates & tracking |
| Newsletter, contact form, reviews | saved locally | Email service + moderation |

## Accessibility & performance notes
Semantic landmarks, skip link, labelled forms with inline validation, keyboard-operable drawers/search/menus,
`prefers-reduced-motion` respected (animations, ticker and slider autoplay), lazy-loaded images, no dependencies
beyond Google Fonts.
