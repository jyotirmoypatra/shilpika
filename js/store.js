/* SHILPIKA — DEMO DATA LAYER (localStorage)
 * ---------------------------------------------------------------
 * ALL persistence goes through SH.store. UI code never touches
 * localStorage directly. To connect a real backend, reimplement
 * these methods against your API (they would become async) —
 * see README.md "Backend integration".
 *
 * Nothing here is secure: passwords are only lightly hashed,
 * orders/payments are NOT real, and admin auth is client-side.
 */
(function () {
  const SH = (window.SH = window.SH || {});
  const NS = 'shilpika.v2.';
  const mem = {};
  const read = (k, d) => {
    try { const v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; }
  };
  const write = (k, v) => {
    mem[k] = v;
    try { localStorage.setItem(NS + k, JSON.stringify(v)); return true; } catch (e) { console.warn('Storage full or unavailable', e); return false; }
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return 'h' + (h >>> 0).toString(36); }; // DEMO ONLY
  const uid = (p) => p + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
  const listeners = {};
  const emit = (ev) => (listeners[ev] || []).forEach((fn) => fn());
  const on = (ev, fn) => (listeners[ev] = (listeners[ev] || []).concat(fn));

  // ---------- seed ----------
  function init() {
    const s = SH.seed;
    if (!read('seeded', false)) {
      write('products', clone(s.products));
      write('categories', clone(s.categories));
      write('coupons', clone(s.coupons));
      write('settings', clone(s.settings));
      write('reviews', clone(s.reviews));
      write('orders', s.demoOrders());
      write('users', []);
      write('seeded', true);
    }
  }
  function reset() {
    ['products', 'categories', 'coupons', 'settings', 'reviews', 'orders', 'users', 'cart', 'wishlist', 'session', 'seeded', 'messages', 'subscribers', 'admin'].forEach((k) => { try { localStorage.removeItem(NS + k); } catch (e) {} delete mem[k]; });
    init(); emit('cart'); emit('wishlist');
  }

  // ---------- catalogue ----------
  const products = {
    all: () => read('products', []),
    byId: (id) => products.all().find((p) => p.id === id),
    save(p) {
      const all = products.all(); const i = all.findIndex((x) => x.id === p.id);
      if (i >= 0) all[i] = p; else all.unshift(p);
      return write('products', all);
    },
    remove(id) { write('products', products.all().filter((p) => p.id !== id)); },
    setStock(id, n) { const p = products.byId(id); if (p) { p.stock = Math.max(0, n | 0); products.save(p); } },
    slug(name) { return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid('p'); },
    related(p, n) { return products.all().filter((x) => x.id !== p.id && x.category === p.category).concat(products.all().filter((x) => x.id !== p.id && x.category !== p.category)).slice(0, n || 4); },
    search(q) {
      q = q.trim().toLowerCase(); if (!q) return [];
      const cats = categories.all();
      return products.all().filter((p) => {
        const c = cats.find((c) => c.id === p.category) || {};
        return [p.name, p.bn, p.short, c.name, c.bn, p.tags.join(' ')].join(' ').toLowerCase().includes(q);
      });
    }
  };
  const categories = {
    all: () => read('categories', []),
    byId: (id) => categories.all().find((c) => c.id === id),
    save(c) { const all = categories.all(); const i = all.findIndex((x) => x.id === c.id); if (i >= 0) all[i] = c; else all.push(c); write('categories', all); },
    remove(id) { write('categories', categories.all().filter((c) => c.id !== id)); }
  };
  const settings = { get: () => Object.assign({}, SH.seed.settings, read('settings', {})), save: (s) => write('settings', s) };

  // ---------- cart ----------
  const lineKey = (pid, c) => pid + '|' + (c ? [c.name, c.date, c.colour, c.notes].map((x) => (x || '').trim()).join('~') : '');
  const cart = {
    lines: () => read('cart', []),
    // hydrated lines: join with live product data, dropping deleted products
    items() {
      return cart.lines().map((l) => ({ l, p: products.byId(l.productId) })).filter((x) => x.p).map(({ l, p }) => Object.assign({}, l, { product: p, qty: Math.min(l.qty, Math.max(p.stock, 0)) || 0 })).filter((x) => x.qty > 0);
    },
    count: () => cart.items().reduce((s, i) => s + i.qty, 0),
    add(productId, qty, custom) {
      const p = products.byId(productId); if (!p) return { ok: false, msg: 'Product not found' };
      if (p.stock <= 0) return { ok: false, msg: 'Sorry, this piece is sold out' };
      const lines = cart.lines(), id = lineKey(productId, custom);
      const ex = lines.find((l) => l.id === id); const have = ex ? ex.qty : 0;
      if (have + qty > p.stock) return { ok: false, msg: `Only ${p.stock} available${have ? ` (you already have ${have})` : ''}` };
      if (ex) ex.qty += qty; else lines.push({ id, productId, qty, custom: custom || null });
      write('cart', lines); emit('cart'); return { ok: true, product: p };
    },
    setQty(id, qty) {
      const lines = cart.lines(); const l = lines.find((x) => x.id === id); if (!l) return { ok: false };
      const p = products.byId(l.productId); const max = p ? p.stock : 0;
      if (qty < 1) return cart.remove(id);
      l.qty = Math.min(qty, max); write('cart', lines); emit('cart');
      return { ok: true, capped: qty > max, max };
    },
    remove(id) { write('cart', cart.lines().filter((l) => l.id !== id)); emit('cart'); return { ok: true }; },
    clear() { write('cart', []); write('coupon', ''); emit('cart'); },
    coupon: () => read('coupon', ''),
    setCoupon(c) { write('coupon', c || ''); },
    // price breakdown — keep this logic server-side in production
    totals(code, country) {
      const items = cart.items(), st = settings.get();
      const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
      let discount = 0, freeship = false, coupon = null, error = '';
      if (code) {
        const c = coupons.find(code);
        if (!c || !c.active) error = 'That coupon code isn’t valid.';
        else if (subtotal < c.min) error = `This code needs a minimum order of ₹${c.min.toLocaleString('en-IN')}.`;
        else { coupon = c; if (c.type === 'percent') discount = Math.round((subtotal * c.value) / 100); else if (c.type === 'flat') discount = Math.min(c.value, subtotal); else freeship = true; }
      }
      const intl = country && country !== 'India';
      let shipping = !items.length ? 0 : intl ? st.shippingIntl : subtotal - discount >= st.freeShippingMin ? 0 : st.shippingFlat;
      if (freeship) shipping = 0;
      return { items, subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping), coupon, error, freeShippingMin: st.freeShippingMin };
    }
  };

  // ---------- wishlist ----------
  const wishlist = {
    ids: () => read('wishlist', []),
    has: (id) => wishlist.ids().includes(id),
    toggle(id) { let ids = wishlist.ids(); const had = ids.includes(id); ids = had ? ids.filter((x) => x !== id) : ids.concat(id); write('wishlist', ids); emit('wishlist'); return !had; },
    remove(id) { write('wishlist', wishlist.ids().filter((x) => x !== id)); emit('wishlist'); },
    items: () => wishlist.ids().map(products.byId).filter(Boolean)
  };

  // ---------- coupons ----------
  const coupons = {
    all: () => read('coupons', []),
    find: (code) => coupons.all().find((c) => c.code === String(code || '').trim().toUpperCase()),
    save(c) { c.code = c.code.trim().toUpperCase(); const all = coupons.all(); const i = all.findIndex((x) => x.code === c.code); if (i >= 0) all[i] = c; else all.push(c); write('coupons', all); },
    remove(code) { write('coupons', coupons.all().filter((c) => c.code !== code)); }
  };

  // ---------- users / session ----------
  const users = {
    all: () => read('users', []),
    current() { const id = read('session', null); return id ? users.all().find((u) => u.id === id) || null : null; },
    register({ name, email, phone, password }) {
      email = email.trim().toLowerCase();
      if (users.all().some((u) => u.email === email)) return { ok: false, msg: 'An account with this email already exists. Try signing in.' };
      const u = { id: uid('u_'), name: name.trim(), email, phone: (phone || '').trim(), pass: hash(password), addresses: [], createdAt: Date.now() };
      write('users', users.all().concat(u)); write('session', u.id); emit('session'); return { ok: true, user: u };
    },
    login(email, password) {
      const u = users.all().find((x) => x.email === email.trim().toLowerCase());
      if (!u || u.pass !== hash(password)) return { ok: false, msg: 'Email or password is incorrect.' };
      write('session', u.id); emit('session'); return { ok: true, user: u };
    },
    logout() { write('session', null); emit('session'); },
    update(patch) { const all = users.all(); const i = all.findIndex((u) => u.id === read('session', null)); if (i < 0) return false; Object.assign(all[i], patch); return write('users', all); },
    changePassword(oldP, newP) { const u = users.current(); if (!u || u.pass !== hash(oldP)) return { ok: false, msg: 'Current password is incorrect.' }; users.update({ pass: hash(newP) }); return { ok: true }; },
    saveAddress(a) { const u = users.current(); const list = (u.addresses || []).slice(); if (!a.id) { a.id = uid('a_'); list.push(a); } else list[list.findIndex((x) => x.id === a.id)] = a; if (a.isDefault) list.forEach((x) => (x.isDefault = x.id === a.id)); if (!list.some((x) => x.isDefault)) list[0].isDefault = true; users.update({ addresses: list }); },
    removeAddress(id) { const u = users.current(); let list = (u.addresses || []).filter((a) => a.id !== id); if (list.length && !list.some((x) => x.isDefault)) list[0].isDefault = true; users.update({ addresses: list }); }
  };
  const admin = {
    // DEMO ONLY: hard-coded credentials, client-side check. Replace with real server-side auth.
    CREDENTIALS: { email: 'admin@shilpika.demo', password: 'admin123' },
    isIn: () => read('admin', false) === true,
    login(e, p) { if (e.trim().toLowerCase() === admin.CREDENTIALS.email && p === admin.CREDENTIALS.password) { write('admin', true); return true; } return false; },
    logout() { write('admin', false); }
  };

  // ---------- orders ----------
  const STATUSES = [['placed', 'Order placed'], ['confirmed', 'Confirmed'], ['crafting', 'Being handcrafted'], ['shipped', 'Shipped'], ['delivered', 'Delivered']];
  const orders = {
    STATUSES,
    all: () => read('orders', []).sort((a, b) => b.createdAt - a.createdAt),
    byId: (id) => orders.all().find((o) => o.id.toLowerCase() === String(id).trim().toLowerCase()),
    mine() { const u = users.current(); return u ? orders.all().filter((o) => o.userId === u.id || (o.customer.email || '').toLowerCase() === u.email) : []; },
    nextId() { const nums = orders.all().map((o) => parseInt(o.id.replace(/\D/g, ''), 10) || 0); return 'SHP-' + (Math.max(10000, ...nums) + 1); },
    // checkout → returns {ok, order}. In production this is a server call that validates price & stock.
    create({ customer, address, payment, couponCode, note }) {
      const t = cart.totals(couponCode, address.country);
      if (!t.items.length) return { ok: false, msg: 'Your bag is empty.' };
      for (const i of t.items) { const p = products.byId(i.productId); if (p.stock < i.qty) return { ok: false, msg: `${p.name} no longer has enough stock.` }; }
      const now = Date.now(), u = users.current();
      const order = {
        id: orders.nextId(), createdAt: now, status: 'placed', demo: true, customer, address,
        items: t.items.map((i) => ({ productId: i.productId, name: i.product.name, price: i.product.price, qty: i.qty, image: i.product.images[0], custom: i.custom })),
        subtotal: t.subtotal, discount: t.discount, coupon: t.coupon ? t.coupon.code : '', shipping: t.shipping, total: t.total,
        payment, note: note || '', userId: u ? u.id : null, timeline: [{ status: 'placed', at: now }]
      };
      t.items.forEach((i) => { const p = products.byId(i.productId); p.stock -= i.qty; products.save(p); });
      write('orders', read('orders', []).concat(order)); cart.clear();
      return { ok: true, order };
    },
    setStatus(id, status) {
      const all = read('orders', []); const o = all.find((x) => x.id === id); if (!o || o.status === status) return;
      const wasCancelled = o.status === 'cancelled';
      if (status === 'cancelled' && !wasCancelled) o.items.forEach((i) => { const p = products.byId(i.productId); if (p) { p.stock += i.qty; products.save(p); } });
      if (wasCancelled && status !== 'cancelled') o.items.forEach((i) => { const p = products.byId(i.productId); if (p) { p.stock = Math.max(0, p.stock - i.qty); products.save(p); } });
      o.status = status; o.timeline = (o.timeline || []).concat({ status, at: Date.now() }); write('orders', all);
    },
    customers() {
      const map = {};
      users.all().forEach((u) => (map[u.email] = { name: u.name, email: u.email, phone: u.phone, joined: u.createdAt, orders: 0, spent: 0, account: true }));
      orders.all().forEach((o) => {
        const e = (o.customer.email || '').toLowerCase(); const c = map[e] || (map[e] = { name: o.customer.name, email: e, phone: o.customer.phone, joined: o.createdAt, orders: 0, spent: 0, account: false });
        c.orders++; if (o.status !== 'cancelled') c.spent += o.total; c.joined = Math.min(c.joined, o.createdAt);
      });
      return Object.values(map).sort((a, b) => b.joined - a.joined);
    }
  };

  const reviews = {
    for: (pid) => read('reviews', {})[pid] || [],
    add(pid, r) { const all = read('reviews', {}); (all[pid] = all[pid] || []).unshift(r); write('reviews', all); },
    avg(pid) { const l = reviews.for(pid); return l.length ? l.reduce((s, r) => s + r.rating, 0) / l.length : 0; }
  };
  const misc = {
    addMessage(m) { write('messages', read('messages', []).concat(Object.assign({ at: Date.now() }, m))); },
    messages: () => read('messages', []),
    subscribe(email) { const l = read('subscribers', []); if (!l.includes(email)) write('subscribers', l.concat(email)); },
    subscribers: () => read('subscribers', [])
  };

  // Payment gateway adapters — each `start(order)` would open the real gateway in production.
  const payments = {
    razorpay: { label: 'Cards, Netbanking, Wallets', sub: 'via Razorpay (not connected — demo)', start: (o) => Promise.resolve({ method: 'razorpay', status: 'demo-no-payment' }) },
    upi: { label: 'UPI', sub: 'GPay, PhonePe, Paytm (not connected — demo)', start: (o) => Promise.resolve({ method: 'upi', status: 'demo-no-payment' }) },
    cod: { label: 'Cash on Delivery', sub: 'Pay when your order arrives', start: (o) => Promise.resolve({ method: 'cod', status: 'cod-pending' }) }
  };

  init();
  SH.store = { products, categories, settings, cart, wishlist, coupons, users, admin, orders, reviews, misc, payments, reset, on, emit, uid, init };
})();
