/* SHILPIKA — shared UI: layout, drawers, search, toast, helpers */
(function () {
  const SH = (window.SH = window.SH || {});
  const S = SH.store;
  document.documentElement.classList.add('js');

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const fmtDate = (t) => new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const ICON = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    heart: '<path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 15 12 20.5 12 20.5z"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M5 5l14 14M19 5L5 19"/>',
    truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.5-2.7L4 15.5a1.5 1.5 0 0 1 2.3-1.9L8 15"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    gift: '<rect x="3" y="8" width="18" height="5"/><path d="M5 13v8h14v-8M12 8v13M12 8S10 3 7.5 4.5 8 8 12 8zm0 0s2-5 4.5-3.5S16 8 12 8z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    star: '<path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8 11h6M11 8v6"/>'
  };
  const icon = (n, cls) => `<svg viewBox="0 0 24 24" aria-hidden="true" ${cls ? `class="${cls}"` : ''}>${ICON[n]}</svg>`;

  // ---------- toast ----------
  let tt;
  function toast(msg, type) {
    const el = $('.toast'); if (!el) return;
    el.className = 'toast show' + (type === 'err' ? ' err' : ''); el.textContent = msg;
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // ---------- product card ----------
  function realRating(id) { const l = S.reviews.for(id).filter((r) => !r.demo); return l.length ? l.reduce((t, r) => t + r.rating, 0) / l.length : 0; }
  function pcard(p, o) {
    o = o || {};
    const off = p.compare > p.price ? Math.round((1 - p.price / p.compare) * 100) : 0;
    const out = p.stock <= 0, on = S.wishlist.has(p.id), rt = realRating(p.id);
    const tag = out ? '<span class="tag out">Sold out</span>' : p.badge ? `<span class="tag">${esc(p.badge)}</span>` : '';
    const quick = out ? `<a class="btn btn--sm btn--block btn--ghost" href="product.html?id=${esc(p.id)}">View details</a>`
      : p.customizable ? `<a class="btn btn--sm btn--block" href="product.html?id=${esc(p.id)}">Customise &amp; add</a>`
      : `<button class="btn btn--sm btn--block" data-add="${esc(p.id)}">Add to cart</button>`;
    return `<article class="pcard">
      <div class="pcard__img">${tag}
        <button class="wish ${on ? 'on' : ''}" data-wish="${esc(p.id)}" aria-pressed="${on}" aria-label="${on ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">${icon('heart')}</button>
        <a href="product.html?id=${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${SH.src(p.images[0])}" alt="" loading="lazy" width="400" height="500">${p.images[1] ? `<img src="${SH.src(p.images[1])}" alt="" loading="lazy" width="400" height="500">` : ''}</a>
        ${rt ? `<span class="rate">★ ${rt.toFixed(1)}</span>` : ''}
      </div>
      <div class="pcard__body"><a class="pcard__name" href="product.html?id=${esc(p.id)}">${esc(p.name)}</a>
        <div class="price"><b>${money(p.price)}</b>${p.compare > p.price ? `<s>${money(p.compare)}</s>` : ''}</div>${off ? `<span class="off">${off}% OFF</span>` : ''}</div>
      ${o.noAdd ? '' : `<div class="pcard__add">${quick}</div>`}
    </article>`;
  }
  const skeletons = (n) => Array.from({ length: n }, () => '<div class="pcard"><div class="pcard__img skel"></div><div class="pcard__body"><div class="skel" style="height:16px;width:85%;margin-bottom:10px"></div><div class="skel" style="height:16px;width:40%"></div></div></div>').join('');

  // ---------- layout ----------
  function layout() {
    const page = document.body.dataset.page || '';
    const st = S.settings.get();
    const cats = S.categories.all();
    const cc = (id) => S.categories.byId(id);
    const sub = (ids) => ids.map(cc).filter(Boolean).map((c) => [c.name, 'shop.html?cat=' + c.id]);
    const NAV = [
      { l: 'Home', h: 'index.html', k: 'home' },
      { l: 'Shop', h: 'shop.html', k: 'shop', dd: [['All products', 'shop.html']].concat(cats.map((c) => [c.name, 'shop.html?cat=' + c.id])) },
      { l: 'Wedding', h: 'shop.html?collection=wedding', k: 'wedding', dd: sub(['gachkouto', 'kulo', 'topor', 'wedding-accessories']).concat([['Wedding packages', 'index.html#packages']]) },
      { l: 'Handicrafts', h: 'shop.html?cat=handicrafts', k: 'handicrafts' },
      { l: 'Home Décor', h: 'shop.html?cat=home-decor', k: 'decor' },
      { l: 'Gifts', h: 'shop.html?cat=gifts', k: 'gifts' },
      { l: 'Our Story', h: 'about.html', k: 'about' }
    ];
    const here = location.pathname.split('/').pop() + location.search;
    const isOn = (n) => (n.k === 'home' ? page === 'home' : n.h === here || (n.k === 'shop' && page === 'shop' && !location.search) || (n.k === 'about' && page === 'about'));
    const logo = `<a class="logo" href="index.html" aria-label="SHILPIKA — home"><span class="logo__en">SHILPIKA</span><span class="logo__bn">শিল্পিকা</span></a>`;
    const msgs = String(st.announcement || '').split('|').map((x) => x.trim()).filter(Boolean);
    const track = msgs.concat(msgs, msgs, msgs).map((m) => `<span>${esc(m)}</span><i>✦</i>`).join('');
    $('#app-header').innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <div class="announce" aria-label="Offers"><div class="announce__t">${track}</div></div>
      <header class="hdr"><div class="wrap hdr__in">
        <button class="icon-btn hdr__menu" id="menu-open" aria-label="Open menu">${icon('menu')}</button>
        ${logo}
        <nav class="hdr__nav" aria-label="Primary">${NAV.map((n) => `<div class="nv ${n.dd ? 'has-dd' : ''}"><a href="${n.h}" class="${isOn(n) ? 'on' : ''}">${n.l}${n.dd ? '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg>' : ''}</a>${n.dd ? `<div class="dd">${n.dd.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join('')}</div>` : ''}</div>`).join('')}</nav>
        <div class="hdr__act">
          <button class="icon-btn" data-search-open aria-label="Search">${icon('search')}</button>
          <a class="icon-btn hide-m" href="account.html" aria-label="Account">${icon('user')}</a>
          <a class="icon-btn hide-m" href="wishlist.html" aria-label="Wishlist">${icon('heart')}<span class="badge-n" data-wish-count></span></a>
          <button class="icon-btn" data-cart-open aria-label="Open shopping bag">${icon('bag')}<span class="badge-n" data-cart-count></span></button>
        </div></div></header>
      <div class="scrim" id="scrim"></div>
      <aside class="mnav" id="mnav" aria-label="Menu"><div class="mnav__top">${logo}<button class="icon-btn" id="menu-close" aria-label="Close menu">${icon('close')}</button></div>
        ${NAV.map((n) => `<a class="big" href="${n.h}">${n.l}</a>${n.dd ? `<div class="msub">${n.dd.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join('')}</div>` : ''}`).join('')}
        <div class="small"><a href="account.html">My account</a><a href="wishlist.html">Wishlist</a><a href="contact.html">Contact</a><a href="faq.html">FAQ</a></div></aside>
      <aside class="drawer" id="drawer" aria-label="Shopping bag" aria-hidden="true">
        <div class="drawer__head"><h2>Your bag</h2><button class="icon-btn" data-cart-close aria-label="Close bag">${icon('close')}</button></div>
        <div id="drawer-inner" style="display:flex;flex-direction:column;flex:1;min-height:0"></div></aside>
      <div class="search" id="search" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true"><div class="wrap">
        <div class="search__bar">${icon('search')}<input id="search-in" type="search" placeholder="Search kulo, topor, gachkouto…" autocomplete="off" aria-label="Search products"><button class="icon-btn" data-search-close aria-label="Close search">${icon('close')}</button></div>
        <div id="search-out"></div></div></div>
      <div class="toast" role="status" aria-live="polite"></div>`;

    $('#app-footer').innerHTML = `<footer class="ftr"><div class="wrap">
      <div class="ftr__top"><div>${logo}<p>Traditional Bengali handmade products — wedding essentials, handicrafts and gifts, made with meaning.</p></div>
        <div><h4>Shop</h4><ul>${cats.slice(0, 6).map((c) => `<li><a href="shop.html?cat=${c.id}">${esc(c.name)}</a></li>`).join('')}</ul></div>
        <div><h4>Help</h4><ul><li><a href="contact.html">Contact</a></li><li><a href="faq.html">FAQ</a></li><li><a href="policy.html?p=shipping">Shipping policy</a></li><li><a href="policy.html?p=returns">Returns &amp; refunds</a></li><li><a href="account.html#orders">Track an order</a></li></ul></div>
        <div><h4>Shilpika</h4><ul><li><a href="about.html">Our story</a></li><li><a href="policy.html?p=privacy">Privacy policy</a></li><li><a href="policy.html?p=terms">Terms &amp; conditions</a></li><li><a href="admin/index.html">Admin (demo)</a></li></ul></div></div>
      <div class="ftr__bot"><span>© ${new Date().getFullYear()} SHILPIKA · Handmade with Meaning.</span><span class="demo-pill">Demo storefront · no real orders or payments · build 4</span></div></div></footer>`;

    const wa = String(st.whatsapp || '').replace(/\D/g, '');
    $('#app-footer').insertAdjacentHTML('beforeend', `<a class="wa" href="${wa ? 'https://wa.me/' + wa : 'contact.html'}" ${wa ? 'target="_blank" rel="noopener"' : ''} aria-label="Chat with us"><span class="wa__tip"><b>Need help?</b> Ask about custom wedding orders.</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8.5c.2 3.1 2.4 5.6 5.8 6.4l1.2-1.3-2-1-.8.7c-1-.4-1.8-1.2-2.2-2.2l.7-.8-1-2z" fill="#fff"/></svg></a>`);
    // header events
    const scrim = $('#scrim'), mnav = $('#mnav'), drawer = $('#drawer'), search = $('#search');
    const closeAll = () => { mnav.classList.remove('open'); drawer.classList.remove('open'); search.classList.remove('open'); scrim.classList.remove('show'); drawer.setAttribute('aria-hidden', 'true'); search.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    const openPanel = (el) => { closeAll(); el.classList.add('open'); scrim.classList.add('show'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    SH.closePanels = closeAll;
    SH.openCart = () => { renderDrawer(); openPanel(drawer); setTimeout(() => $('[data-cart-close]', drawer).focus(), 50); };
    $('#menu-open').onclick = () => openPanel(mnav); $('#menu-close').onclick = closeAll; scrim.onclick = closeAll;
    $$('[data-cart-open]').forEach((b) => (b.onclick = SH.openCart)); $$('[data-cart-close]').forEach((b) => (b.onclick = closeAll));
    $$('[data-search-open]').forEach((b) => (b.onclick = () => { openPanel(search); renderSearch(''); setTimeout(() => $('#search-in').focus(), 80); }));
    $$('[data-search-close]').forEach((b) => (b.onclick = closeAll));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
    $('#search-in').addEventListener('input', (e) => renderSearch(e.target.value));
    $('#search-in').addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.value.trim()) location.href = 'shop.html?q=' + encodeURIComponent(e.target.value.trim()); });
    $('#search-out').addEventListener('click', (e) => { const c = e.target.closest('[data-term]'); if (c) { $('#search-in').value = c.dataset.term; renderSearch(c.dataset.term); } });

    // counts
    const counts = () => {
      $$('[data-cart-count]').forEach((e) => { const n = S.cart.count(); e.textContent = n; e.dataset.n = n; });
      $$('[data-wish-count]').forEach((e) => { const n = S.wishlist.ids().length; e.textContent = n; e.dataset.n = n; });
    };
    counts(); S.on('cart', () => { counts(); renderDrawer(); }); S.on('wishlist', counts);
  }

  function renderSearch(q) {
    const out = $('#search-out'); q = q.trim();
    if (!q) {
      const pop = ['Topor', 'Kulo', 'Gachkouto', 'Alpona', 'Kantha', 'Gift'];
      out.innerHTML = `<p class="label" style="margin-top:22px">Popular searches</p><div class="search__chips">${pop.map((t) => `<button class="chip" data-term="${t}">${t}</button>`).join('')}</div>
        <p class="label" style="margin-top:26px">Browse categories</p><div class="search__chips">${S.categories.all().map((c) => `<a class="chip" href="shop.html?cat=${c.id}">${esc(c.name)}</a>`).join('')}</div>`;
      return;
    }
    const res = S.products.search(q);
    out.innerHTML = res.length
      ? `<p class="label" style="margin-top:22px">${res.length} result${res.length > 1 ? 's' : ''} — press Enter to see all</p><div class="sres">${res.slice(0, 8).map((p) => `<a href="product.html?id=${esc(p.id)}"><img src="${SH.src(p.images[0])}" alt="" loading="lazy"><span><b>${esc(p.name)}</b><small>${money(p.price)}</small></span></a>`).join('')}</div>`
      : `<div class="empty"><h3>No pieces found for “${esc(q)}”</h3><p class="muted">Try “topor”, “kulo” or “gift” — or browse the whole collection.</p><a class="btn btn--ghost" href="shop.html">Shop all</a></div>`;
  }

  function renderDrawer() {
    const box = $('#drawer-inner'); if (!box) return;
    const t = S.cart.totals();
    if (!t.items.length) { box.innerHTML = `<div class="empty">${icon('bag')}<h3>Your bag is empty</h3><p class="muted">Let’s find something made by hand.</p><a class="btn" href="shop.html">Explore the shop</a></div>`; return; }
    const left = Math.max(0, t.freeShippingMin - t.subtotal), pct = Math.min(100, (t.subtotal / t.freeShippingMin) * 100);
    box.innerHTML = `<div class="ship-bar">${left ? `You’re <b>${money(left)}</b> away from free shipping` : '<b>You’ve unlocked free shipping</b> ✦'}<div class="ship-bar__t"><i style="width:${pct}%"></i></div></div>
      <div class="drawer__body">${t.items.map(lineHTML).join('')}</div>
      <div class="drawer__foot"><div class="sumrow"><span>Subtotal</span><b>${money(t.subtotal)}</b></div><p class="muted" style="font-size:12.5px;margin:2px 0 14px">Shipping and coupons are applied at checkout.</p>
        <a class="btn btn--block" href="checkout.html">Checkout</a><a class="btn btn--ghost btn--block" style="margin-top:10px" href="cart.html">View bag</a></div>`;
  }
  function customSummary(c) {
    if (!c) return '';
    return [c.name && `Name: ${esc(c.name)}`, c.date && `Date: ${esc(c.date)}`, c.colour && `Colour: ${esc(c.colour)}`, c.notes && `Note: ${esc(c.notes)}`].filter(Boolean).join('<br>');
  }
  function lineHTML(i) {
    const p = i.product;
    return `<div class="line"><a href="product.html?id=${esc(p.id)}"><img class="line__img" src="${SH.src(p.images[0])}" alt="" width="76" height="95"></a>
      <div><a class="line__name" href="product.html?id=${esc(p.id)}">${esc(p.name)}</a><p class="line__meta">${customSummary(i.custom) || money(p.price)}</p>
        <div class="qty" role="group" aria-label="Quantity"><button data-q="${esc(i.id)}" data-d="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-q="${esc(i.id)}" data-d="1" aria-label="Increase quantity">+</button></div></div>
      <div class="line__price"><span>${money(p.price * i.qty)}</span><button class="rm" data-rm="${esc(i.id)}">Remove</button></div></div>`;
  }
  SH.lineHTML = lineHTML; SH.customSummary = customSummary;

  // ---------- global delegated events ----------
  function addToCart(id, qty, custom, btn) {
    const r = S.cart.add(id, qty || 1, custom);
    if (!r.ok) { toast(r.msg, 'err'); return r; }
    $$('[data-cart-count]').forEach((e) => { e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); });
    if (btn) { const t = btn.textContent; btn.textContent = 'Added ✓'; setTimeout(() => (btn.textContent = t), 1400); }
    SH.openCart(); return r;
  }
  SH.addToCart = addToCart;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add]'); if (a) { e.preventDefault(); addToCart(a.dataset.add, 1, null, a); return; }
    const w = e.target.closest('[data-wish]');
    if (w) {
      e.preventDefault(); const on = S.wishlist.toggle(w.dataset.wish);
      $$(`[data-wish="${w.dataset.wish}"]`).forEach((b) => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      toast(on ? 'Saved to your wishlist' : 'Removed from wishlist'); return;
    }
    const q = e.target.closest('[data-q]'); if (q) { const l = S.cart.lines().find((x) => x.id === q.dataset.q); if (l) { const r = S.cart.setQty(q.dataset.q, l.qty + +q.dataset.d); if (r.capped) toast(`Only ${r.max} in stock`, 'err'); } return; }
    const rm = e.target.closest('[data-rm]'); if (rm) { S.cart.remove(rm.dataset.rm); return; }
    // page transitions
    const link = e.target.closest('a[href]');
    if (link && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !link.target && link.origin === location.origin && !link.hasAttribute('download')) {
      const same = link.pathname === location.pathname && link.search === location.search;
      if (same || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
      e.preventDefault(); document.body.classList.add('leaving'); setTimeout(() => (location.href = link.href), 150);
    }
  });
  window.addEventListener('pageshow', () => document.body.classList.remove('leaving'));

  // ---------- scroll reveal ----------
  function reveal(root) {
    const els = $$('.reveal:not(.in)', root);
    if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('in'));
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  function newsletter(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); const inp = form.querySelector('input'); const msg = form.parentElement.querySelector('.nl-msg');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value)) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = 'var(--err)'; return; }
      S.misc.subscribe(inp.value.trim().toLowerCase()); msg.style.color = 'var(--ok)'; msg.textContent = 'Thank you — you’re on the list. (Demo: stored in this browser only.)'; inp.value = '';
    });
  }

  Object.assign(SH, { $, $$, esc, money, qs, fmtDate, icon, toast, pcard, skeletons, reveal, newsletter, renderDrawer });
  layout(); renderDrawer();
})();
