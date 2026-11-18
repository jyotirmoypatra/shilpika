/* SHILPIKA admin — DEMO. Data lives in this browser (see ../js/store.js).
 * Admin auth is client-side only and NOT secure. Replace with server auth + API. */
(function () {
  const S = SH.store;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
  const fdate = (t) => new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const app = $('#app');
  let tt; const toast = (m, e) => { const el = $('.toast'); el.className = 'toast show' + (e ? ' err' : ''); el.textContent = m; clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600); };
  const LBL = Object.fromEntries(S.orders.STATUSES.concat([['cancelled', 'Cancelled']]));
  const X = '<svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.6"><path d="M5 5l14 14M19 5L5 19"/></svg>';
  const fld = (id, label, val, extra, err) => `<div class="field"><label for="${id}">${label}</label><input id="${id}" value="${esc(val == null ? '' : val)}" ${extra || ''}><span class="field__err">${err || 'Required.'}</span></div>`;
  const bad = (id, cond) => { $('#' + id).closest('.field').classList.toggle('has-err', cond); return !cond; };

  const NAV = [['dashboard', 'Dashboard'], ['orders', 'Orders'], ['products', 'Products'], ['inventory', 'Inventory'], ['categories', 'Categories'], ['customers', 'Customers'], ['coupons', 'Coupons'], ['messages', 'Messages'], ['settings', 'Store settings']];

  function modal(title, html, mount) {
    const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="modal__c"><button class="icon-btn modal__x" aria-label="Close">${X}</button><h2>${title}</h2>${html}</div>`;
    document.body.appendChild(m); document.body.style.overflow = 'hidden';
    const close = () => { m.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esc_); };
    const esc_ = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc_); $('.modal__x', m).onclick = close; m.addEventListener('mousedown', (e) => { if (e.target === m) close(); });
    mount && mount(m, close); const f = $('input,select,textarea', m); f && f.focus(); return close;
  }
  const route = () => (location.hash.replace('#', '') || 'dashboard').split('/')[0];

  // ---------- login ----------
  function login() {
    app.innerHTML = `<div class="login"><form class="login__card" id="lf" novalidate><div class="logo-a">SHILPIKA<small>শিল্পিকা · Admin</small></div><h1>Sign in</h1><div id="lm"></div>
      ${fld('le', 'Email', '', 'type="email" autocomplete="username"', 'Enter your email.')}${fld('lp', 'Password', '', 'type="password" autocomplete="current-password"', 'Enter your password.')}
      <button class="btn btn--block" type="submit">Sign in</button>
      <p class="login-hint"><b>Demo only.</b> Email <code>${S.admin.CREDENTIALS.email}</code> · Password <code>${S.admin.CREDENTIALS.password}</code>. This check runs in your browser and is not secure — replace with real server-side authentication.</p><p style="margin:16px 0 0"><a class="link-u" href="../index.html">← Back to the store</a></p></form></div>`;
    $('#lf').onsubmit = (e) => { e.preventDefault(); if (!(bad('le', !$('#le').value.trim()) & bad('lp', !$('#lp').value))) return; if (S.admin.login($('#le').value, $('#lp').value)) boot(); else $('#lm').innerHTML = '<div class="form-msg err">Incorrect email or password.</div>'; };
  }

  // ---------- shell ----------
  function boot() {
    if (!S.admin.isIn()) return login();
    const r = route(), oc = S.orders.all().filter((o) => o.status === 'placed').length;
    app.innerHTML = `<div class="shell"><aside class="side" id="side"><div class="logo-a">SHILPIKA<small>শিল্পিকা · Admin</small></div>
      ${NAV.map(([k, l]) => `<a href="#${k}" class="${r === k ? 'on' : ''}">${l}${k === 'orders' && oc ? `<span class="pill">${oc} new</span>` : ''}</a>`).join('')}<div class="sp"></div><a href="../index.html">View store ↗</a><a href="#" id="out">Log out</a></aside>
      <div class="main"><div class="top"><div style="display:flex;gap:12px;align-items:center"><button class="icon-btn menu-b" id="mb" aria-label="Open menu"><svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button><h1 id="h1"></h1></div><div id="topact"></div></div>
      <div class="demo-banner"><b>Demo admin.</b> Orders, payments and customers shown here are mock data stored in this browser — nothing is real.</div><div id="view"></div></div></div>`;
    $('#out').onclick = (e) => { e.preventDefault(); S.admin.logout(); login(); };
    $('#mb').onclick = () => { $('#side').classList.add('open'); const s = document.createElement('div'); s.className = 'scrim-a'; s.onclick = () => { $('#side').classList.remove('open'); s.remove(); }; document.body.appendChild(s); };
    $$('.side a[href^="#"]').forEach((a) => a.addEventListener('click', () => { $('#side').classList.remove('open'); $('.scrim-a') && $('.scrim-a').remove(); }));
    view();
  }
  const VIEWS = { dashboard, orders, products, inventory, categories, customers, coupons, messages, settings };
  function view() { const r = route(); $$('.side a[href^="#"]').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + r)); $('#h1').textContent = (NAV.find(([k]) => k === r) || NAV[0])[1]; $('#topact').innerHTML = ''; const old = $('#view'), fresh = old.cloneNode(false); old.replaceWith(fresh); (VIEWS[r] || dashboard)(fresh); window.scrollTo(0, 0); }
  window.addEventListener('hashchange', () => { if (S.admin.isIn()) view(); });

  // ---------- dashboard ----------
  function dashboard(v) {
    const orders = S.orders.all(), live = orders.filter((o) => o.status !== 'cancelled'), sales = live.reduce((s, o) => s + o.total, 0);
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i)); return d; });
    const per = days.map((d) => live.filter((o) => { const t = new Date(o.createdAt); t.setHours(0, 0, 0, 0); return +t === +d; }).reduce((s, o) => s + o.total, 0)), mx = Math.max(...per, 1);
    const low = S.products.all().filter((p) => p.stock <= S.settings.get().lowStock).sort((a, b) => a.stock - b.stock);
    v.innerHTML = `<div class="stats"><div class="stat"><small>Total sales</small><b>${money(sales)}</b></div><div class="stat"><small>Total orders</small><b>${orders.length}</b></div><div class="stat"><small>Products</small><b>${S.products.all().length}</b></div><div class="stat"><small>Customers</small><b>${S.orders.customers().length}</b></div></div>
      <div class="two"><div class="panel"><h2>Sales — last 7 days</h2><div class="chart" role="img" aria-label="Sales per day for the last 7 days">${per.map((x, i) => `<div><i style="height:${(x / mx) * 100}%" title="${money(x)}"></i><span>${days[i].toLocaleDateString('en-IN', { weekday: 'short' })}</span></div>`).join('')}</div></div>
      <div class="panel"><h2>Low stock</h2>${low.length ? `<ul class="mini-l">${low.slice(0, 6).map((p) => `<li><span>${esc(p.name)}</span><span class="status ${p.stock ? 'low' : 'out'}">${p.stock ? p.stock + ' left' : 'Out'}</span></li>`).join('')}</ul>` : '<p class="muted">All products are well stocked.</p>'}</div></div>
      <div class="panel"><h2>Recent orders</h2><div class="tw"><table class="t"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>${orders.slice(0, 6).map((o) => `<tr><td><a class="link-u" href="#orders/${esc(o.id)}">${esc(o.id)}</a></td><td>${esc(o.customer.name)}</td><td>${fdate(o.createdAt)}</td><td><span class="status ${o.status}">${LBL[o.status]}</span></td><td>${money(o.total)}</td></tr>`).join('')}</tbody></table></div></div>`;
  }

  // ---------- orders ----------
  function orders(v) {
    let f = '', q = '';
    const draw = () => {
      const list = S.orders.all().filter((o) => (!f || o.status === f) && (!q || (o.id + o.customer.name + o.customer.email).toLowerCase().includes(q.toLowerCase())));
      $('#ot').innerHTML = list.length ? list.map((o) => `<tr><td><b>${esc(o.id)}</b>${o.demo ? ' <span class="status" title="Demo order">Demo</span>' : ''}</td><td>${esc(o.customer.name)}<br><small class="muted">${esc(o.customer.email)}</small></td><td>${fdate(o.createdAt)}</td><td>${money(o.total)}<br><small class="muted">${esc(o.payment.method)}</small></td>
        <td><label class="sr-only" for="st-${esc(o.id)}">Status for ${esc(o.id)}</label><select class="stk-in" style="width:150px" id="st-${esc(o.id)}" data-st="${esc(o.id)}">${S.orders.STATUSES.concat([['cancelled', 'Cancelled']]).map(([k, l]) => `<option value="${k}" ${o.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select></td><td class="act"><button data-view="${esc(o.id)}">View</button></td></tr>`).join('') : '<tr><td colspan="6" class="muted" style="text-align:center;padding:36px">No orders match.</td></tr>';
    };
    v.innerHTML = `<div class="panel"><div class="bar"><input class="input" id="oq" placeholder="Search order, name, email" aria-label="Search orders"><select id="of" aria-label="Filter by status"><option value="">All statuses</option>${S.orders.STATUSES.concat([['cancelled', 'Cancelled']]).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></div><div class="tw"><table class="t"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody id="ot"></tbody></table></div></div>`;
    draw();
    $('#oq').oninput = (e) => { q = e.target.value; draw(); }; $('#of').onchange = (e) => { f = e.target.value; draw(); };
    v.addEventListener('change', (e) => { const s = e.target.closest('[data-st]'); if (s) { S.orders.setStatus(s.dataset.st, s.value); toast(`${s.dataset.st} → ${LBL[s.value]}`); } });
    v.addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (b) orderModal(b.dataset.view, draw); });
    const id = location.hash.split('/')[1]; if (id && S.orders.byId(decodeURIComponent(id))) orderModal(decodeURIComponent(id), draw);
  }
  function orderModal(id, after) {
    const o = S.orders.byId(id); if (!o) return;
    modal(`Order ${esc(o.id)}`, `<p><span class="status ${o.status}">${LBL[o.status]}</span> &nbsp; ${fdate(o.createdAt)} ${o.demo ? '<span class="status">Demo order</span>' : ''}</p>
      <div class="grid2a" style="margin:18px 0"><div><b>Customer</b><p style="margin:4px 0">${esc(o.customer.name)}<br>${esc(o.customer.email)}<br>${esc(o.customer.phone)}</p></div><div><b>Ship to</b><p style="margin:4px 0">${esc(o.address.line1)} ${esc(o.address.line2 || '')}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.pin)}<br>${esc(o.address.country)}</p></div></div>
      <div class="tw"><table class="t" style="min-width:0"><thead><tr><th></th><th>Item</th><th>Qty</th><th>Price</th></tr></thead><tbody>${o.items.map((i) => `<tr><td><img src="${SH.src(i.image)}" alt=""></td><td>${esc(i.name)}${i.custom ? `<br><small class="muted">${esc([i.custom.name, i.custom.date, i.custom.colour, i.custom.notes].filter(Boolean).join(' · '))}</small>` : ''}</td><td>${i.qty}</td><td>${money(i.price * i.qty)}</td></tr>`).join('')}</tbody></table></div>
      <p style="text-align:right;margin:14px 0 0">Subtotal ${money(o.subtotal)}${o.discount ? ` · Discount −${money(o.discount)} (${esc(o.coupon)})` : ''} · Shipping ${o.shipping ? money(o.shipping) : 'Free'}<br><b style="font-size:20px">Total ${money(o.total)}</b></p>
      <p class="muted" style="font-size:13px">Payment: ${esc(o.payment.method)} — ${esc(o.payment.status)} (demo; no money moved)</p>${o.note ? `<p><b>Customer note:</b> ${esc(o.note)}</p>` : ''}`);
  }

  // ---------- products ----------
  function products(v) {
    $('#topact').innerHTML = '<button class="btn btn--sm" id="padd">Add product</button>';
    let q = '';
    const draw = () => {
      const cats = S.categories.all(), list = S.products.all().filter((p) => !q || (p.name + p.sku).toLowerCase().includes(q.toLowerCase()));
      $('#pt').innerHTML = list.length ? list.map((p) => `<tr><td><img src="${SH.src(p.images[0])}" alt=""></td><td><b>${esc(p.name)}</b><br><small class="muted">${esc(p.sku || '')}</small></td><td>${esc((cats.find((c) => c.id === p.category) || {}).name || '—')}</td><td>${money(p.price)}${p.compare > p.price ? `<br><small class="muted"><s>${money(p.compare)}</s></small>` : ''}</td><td>${p.stock}</td><td><span class="status ${p.stock <= 0 ? 'out' : p.stock <= S.settings.get().lowStock ? 'low' : 'ok'}">${p.stock <= 0 ? 'Sold out' : p.stock <= S.settings.get().lowStock ? 'Low' : 'In stock'}</span></td><td class="act"><button data-e="${esc(p.id)}">Edit</button><button class="d" data-d="${esc(p.id)}">Delete</button></td></tr>`).join('') : '<tr><td colspan="7" class="muted" style="text-align:center;padding:36px">No products.</td></tr>';
    };
    v.innerHTML = `<div class="panel"><div class="bar"><input class="input" id="pq" placeholder="Search products" aria-label="Search products"></div><div class="tw"><table class="t"><thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody id="pt"></tbody></table></div></div>`;
    draw(); $('#pq').oninput = (e) => { q = e.target.value; draw(); }; $('#padd').onclick = () => productForm(null, draw);
    v.addEventListener('click', (e) => {
      const ed = e.target.closest('[data-e]'), de = e.target.closest('[data-d]');
      if (ed) productForm(S.products.byId(ed.dataset.e), draw);
      if (de) { const p = S.products.byId(de.dataset.d); if (confirm(`Delete “${p.name}”? This cannot be undone.`)) { S.products.remove(p.id); toast('Product deleted'); draw(); } }
    });
  }
  function resizeImg(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader(); fr.onerror = rej;
      fr.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.8)); }; im.src = fr.result; };
      fr.readAsDataURL(file);
    });
  }
  function productForm(p, done) {
    const isNew = !p; p = p || { name: '', bn: '', category: (S.categories.all()[0] || {}).id, price: '', compare: 0, stock: 10, sku: '', badge: '', short: '', description: '', details: {}, tags: [], customizable: false, leadDays: 2, images: [] };
    let imgs = p.images.slice(); const d = p.details || {};
    modal(isNew ? 'Add product' : 'Edit product', `<form id="pf" novalidate>
      <div class="grid2a">${fld('f-name', 'Name', p.name, 'maxlength="90"')}${fld('f-bn', 'Bengali name (optional)', p.bn)}</div>
      <div class="grid3"><div class="field"><label for="f-cat">Category</label><select id="f-cat">${S.categories.all().map((c) => `<option value="${esc(c.id)}" ${c.id === p.category ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>${fld('f-price', 'Price (₹)', p.price, 'type="number" min="1" step="1" inputmode="numeric"', 'Enter a price above 0.')}${fld('f-comp', 'Compare-at price (optional)', p.compare || '', 'type="number" min="0" step="1"', 'Must be higher than price.')}</div>
      <div class="grid3">${fld('f-stock', 'Stock', p.stock, 'type="number" min="0" step="1"', 'Enter 0 or more.')}${fld('f-sku', 'SKU', p.sku)}${fld('f-lead', 'Crafting days', p.leadDays, 'type="number" min="0"')}</div>
      <div class="field"><label for="f-badge">Badge</label><select id="f-badge">${['', 'New', 'Bestseller', 'Sale', 'Limited'].map((b) => `<option ${p.badge === b ? 'selected' : ''} value="${b}">${b || 'None'}</option>`).join('')}</select></div>
      ${fld('f-short', 'Short description', p.short, 'maxlength="140"')}
      <div class="field"><label for="f-desc">Full description</label><textarea id="f-desc">${esc(p.description)}</textarea></div>
      <div class="grid2a">${fld('f-mat', 'Material', d.material, '', '')}${fld('f-dim', 'Dimensions', d.dimensions, '', '')}${fld('f-wt', 'Weight', d.weight, '', '')}${fld('f-care', 'Care', d.care, '', '')}</div>
      <div class="chk"><label class="check"><input type="checkbox" id="f-cz" ${p.customizable ? 'checked' : ''}> Personalisable (name, date, colour, notes)</label>${['wedding', 'bestseller', 'new'].map((t) => `<label class="check"><input type="checkbox" data-tag="${t}" ${p.tags.includes(t) ? 'checked' : ''}> ${t[0].toUpperCase() + t.slice(1)}</label>`).join('')}</div>
      <div class="field"><label for="f-img">Product images <span class="opt">(JPG/PNG, resized to 900px; first is the main image)</span></label><input id="f-img" type="file" accept="image/*" multiple><div class="imgs" id="imgs"></div><span class="field__err" id="img-err">Add at least one image.</span></div>
      <div id="pf-msg"></div><button class="btn" type="submit">${isNew ? 'Add product' : 'Save changes'}</button></form>`, (m, close) => {
      const drawI = () => { $('#imgs', m).innerHTML = imgs.map((im, i) => `<div><img src="${SH.src(im)}" alt="Image ${i + 1}"><button type="button" data-rmi="${i}" aria-label="Remove image ${i + 1}">×</button></div>`).join(''); };
      drawI();
      $('#imgs', m).onclick = (e) => { const b = e.target.closest('[data-rmi]'); if (b) { imgs.splice(+b.dataset.rmi, 1); drawI(); } };
      $('#f-img', m).onchange = async (e) => { for (const f of [...e.target.files].slice(0, 6)) { try { imgs.push(await resizeImg(f)); } catch (x) { toast('Could not read ' + f.name, true); } } imgs = imgs.slice(0, 6); e.target.value = ''; drawI(); $('#img-err', m).parentElement.classList.remove('has-err'); };
      $('#pf', m).onsubmit = (e) => {
        e.preventDefault(); const price = +$('#f-price').value, comp = +$('#f-comp').value || 0;
        const ok = [bad('f-name', !$('#f-name').value.trim()), bad('f-price', !(price > 0)), bad('f-comp', comp && comp <= price), bad('f-stock', $('#f-stock').value === '' || +$('#f-stock').value < 0)];
        const noImg = !imgs.length; $('#img-err', m).parentElement.classList.toggle('has-err', noImg);
        if (ok.includes(false) || noImg) return;
        const prod = Object.assign({}, p, { id: isNew ? S.products.slug($('#f-name').value) + (S.products.byId(S.products.slug($('#f-name').value)) ? '-' + Date.now().toString(36) : '') : p.id, name: $('#f-name').value.trim(), bn: $('#f-bn').value.trim(), category: $('#f-cat').value, price, compare: comp, stock: +$('#f-stock').value | 0, sku: $('#f-sku').value.trim(), leadDays: +$('#f-lead').value || 0, badge: $('#f-badge').value, short: $('#f-short').value.trim(), description: $('#f-desc').value.trim(), details: { material: $('#f-mat').value, dimensions: $('#f-dim').value, weight: $('#f-wt').value, care: $('#f-care').value }, customizable: $('#f-cz').checked, tags: $$('[data-tag]', m).filter((c) => c.checked).map((c) => c.dataset.tag), images: imgs, colours: p.colours || SH.seed.colours });
        if (!S.products.save(prod)) { $('#pf-msg').innerHTML = '<div class="form-msg err">Browser storage is full — remove some images and try again.</div>'; return; }
        toast(isNew ? 'Product added' : 'Product saved'); close(); done();
      };
    });
  }

  // ---------- inventory ----------
  function inventory(v) {
    let only = false;
    const draw = () => { const lo = S.settings.get().lowStock; $('#it').innerHTML = S.products.all().filter((p) => !only || p.stock <= lo).map((p) => `<tr><td><img src="${SH.src(p.images[0])}" alt=""></td><td><b>${esc(p.name)}</b><br><small class="muted">${esc(p.sku || '')}</small></td><td><label class="sr-only" for="s-${esc(p.id)}">Stock for ${esc(p.name)}</label><input class="stk-in" type="number" min="0" id="s-${esc(p.id)}" data-s="${esc(p.id)}" value="${p.stock}"></td><td><span class="status ${p.stock <= 0 ? 'out' : p.stock <= lo ? 'low' : 'ok'}">${p.stock <= 0 ? 'Sold out' : p.stock <= lo ? 'Low stock' : 'In stock'}</span></td></tr>`).join('') || '<tr><td colspan="4" class="muted" style="text-align:center;padding:36px">Nothing to show.</td></tr>'; };
    v.innerHTML = `<div class="panel"><div class="bar"><label class="check"><input type="checkbox" id="lo"> Show low-stock only (≤ ${S.settings.get().lowStock})</label></div><div class="tw"><table class="t"><thead><tr><th></th><th>Product</th><th>Stock (edit)</th><th>Status</th></tr></thead><tbody id="it"></tbody></table></div></div>`;
    draw(); $('#lo').onchange = (e) => { only = e.target.checked; draw(); };
    v.addEventListener('change', (e) => { const i = e.target.closest('[data-s]'); if (!i) return; const n = Math.max(0, parseInt(i.value, 10) || 0); S.products.setStock(i.dataset.s, n); toast('Stock updated'); draw(); });
  }

  // ---------- categories ----------
  function categories(v) {
    $('#topact').innerHTML = '<button class="btn btn--sm" id="cadd">Add category</button>';
    const draw = () => { const ps = S.products.all(); $('#ct').innerHTML = S.categories.all().map((c) => `<tr><td><b>${esc(c.name)}</b><br><small class="bn" style="color:var(--terra)">${esc(c.bn || '')}</small></td><td>${esc(c.id)}</td><td>${ps.filter((p) => p.category === c.id).length}</td><td class="act"><button data-e="${esc(c.id)}">Edit</button><button class="d" data-d="${esc(c.id)}">Delete</button></td></tr>`).join(''); };
    v.innerHTML = '<div class="panel"><div class="tw"><table class="t"><thead><tr><th>Name</th><th>Slug</th><th>Products</th><th></th></tr></thead><tbody id="ct"></tbody></table></div></div>'; draw();
    const form = (c) => { const isNew = !c; c = c || { name: '', bn: '', desc: '', art: 'art:plate:sand:1' };
      modal(isNew ? 'Add category' : 'Edit category', `<form id="cf" novalidate>${fld('c-name', 'Name', c.name)}${fld('c-bn', 'Bengali name (optional)', c.bn)}${fld('c-desc', 'Description', c.desc)}<button class="btn" type="submit">Save</button></form>`, (m, close) => {
        $('#cf', m).onsubmit = (e) => { e.preventDefault(); if (!bad('c-name', !$('#c-name').value.trim())) return; const id = isNew ? S.products.slug($('#c-name').value) : c.id; if (isNew && S.categories.byId(id)) return toast('A category with this name exists', true); S.categories.save(Object.assign({}, c, { id, name: $('#c-name').value.trim(), bn: $('#c-bn').value.trim(), desc: $('#c-desc').value.trim() })); toast('Category saved'); close(); draw(); }; }); };
    $('#cadd').onclick = () => form(null);
    v.addEventListener('click', (e) => { const ed = e.target.closest('[data-e]'), de = e.target.closest('[data-d]'); if (ed) form(S.categories.byId(ed.dataset.e)); if (de) { const n = S.products.all().filter((p) => p.category === de.dataset.d).length; if (n) return toast(`Move or delete its ${n} product(s) first`, true); if (confirm('Delete this category?')) { S.categories.remove(de.dataset.d); draw(); toast('Category deleted'); } } });
  }

  // ---------- customers ----------
  function customers(v) {
    const list = S.orders.customers();
    v.innerHTML = `<div class="panel"><div class="tw"><table class="t"><thead><tr><th>Customer</th><th>Phone</th><th>Account</th><th>Orders</th><th>Spent</th><th>Since</th></tr></thead><tbody>${list.map((c) => `<tr><td><b>${esc(c.name)}</b><br><small class="muted">${esc(c.email)}</small></td><td>${esc(c.phone || '—')}</td><td><span class="status ${c.account ? 'ok' : ''}">${c.account ? 'Registered' : 'Guest'}</span></td><td>${c.orders}</td><td>${money(c.spent)}</td><td>${fdate(c.joined)}</td></tr>`).join('')}</tbody></table></div></div>`;
  }

  // ---------- coupons ----------
  function coupons(v) {
    $('#topact').innerHTML = '<button class="btn btn--sm" id="kadd">Add coupon</button>';
    const T = { percent: '% off', flat: '₹ off', freeship: 'Free shipping' };
    const draw = () => { $('#kt').innerHTML = S.coupons.all().map((c) => `<tr><td><b>${esc(c.code)}</b></td><td>${c.type === 'percent' ? c.value + '%' : c.type === 'flat' ? money(c.value) : 'Free shipping'}</td><td>${money(c.min)}</td><td><span class="status ${c.active ? 'on' : 'off'}">${c.active ? 'Active' : 'Disabled'}</span></td><td class="act"><button data-e="${esc(c.code)}">Edit</button><button class="d" data-d="${esc(c.code)}">Delete</button></td></tr>`).join('') || '<tr><td colspan="5" class="muted" style="text-align:center;padding:30px">No coupons.</td></tr>'; };
    v.innerHTML = '<div class="panel"><div class="tw"><table class="t"><thead><tr><th>Code</th><th>Discount</th><th>Min. order</th><th>Status</th><th></th></tr></thead><tbody id="kt"></tbody></table></div></div>'; draw();
    const form = (c) => { const isNew = !c; c = c || { code: '', type: 'percent', value: 10, min: 0, active: true };
      modal(isNew ? 'Add coupon' : 'Edit coupon', `<form id="kf" novalidate>${fld('k-code', 'Code', c.code, isNew ? 'style="text-transform:uppercase" maxlength="20"' : 'readonly')}<div class="grid2a"><div class="field"><label for="k-type">Type</label><select id="k-type">${Object.entries(T).map(([k, l]) => `<option value="${k}" ${c.type === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>${fld('k-val', 'Value', c.value, 'type="number" min="0"', 'Enter a value above 0 (max 100 for %).')}</div>${fld('k-min', 'Minimum order (₹)', c.min, 'type="number" min="0"', 'Enter 0 or more.')}<label class="check" style="margin-bottom:18px"><input type="checkbox" id="k-on" ${c.active ? 'checked' : ''}> Active</label><button class="btn" type="submit">Save coupon</button></form>`, (m, close) => {
        $('#kf', m).onsubmit = (e) => { e.preventDefault(); const t = $('#k-type').value, val = +$('#k-val').value;
          const ok = [bad('k-code', !/^[A-Za-z0-9]{3,20}$/.test($('#k-code').value.trim())), bad('k-val', t !== 'freeship' && (!(val > 0) || (t === 'percent' && val > 100))), bad('k-min', +$('#k-min').value < 0)]; if (ok.includes(false)) return;
          if (isNew && S.coupons.find($('#k-code').value)) return toast('That code already exists', true);
          S.coupons.save({ code: $('#k-code').value, type: t, value: t === 'freeship' ? 0 : val, min: +$('#k-min').value || 0, active: $('#k-on').checked }); toast('Coupon saved'); close(); draw(); }; }); };
    $('#kadd').onclick = () => form(null);
    v.addEventListener('click', (e) => { const ed = e.target.closest('[data-e]'), de = e.target.closest('[data-d]'); if (ed) form(S.coupons.find(ed.dataset.e)); if (de && confirm('Delete coupon ' + de.dataset.d + '?')) { S.coupons.remove(de.dataset.d); draw(); toast('Coupon deleted'); } });
  }

  // ---------- messages ----------
  function messages(v) {
    const m = S.misc.messages().slice().reverse(), sub = S.misc.subscribers();
    v.innerHTML = `<div class="panel"><h2>Contact messages</h2>${m.length ? `<div class="tw"><table class="t"><thead><tr><th>From</th><th>Topic</th><th>Message</th><th>Date</th></tr></thead><tbody>${m.map((x) => `<tr><td><b>${esc(x.name)}</b><br><small class="muted">${esc(x.email)}</small></td><td>${esc(x.topic)}</td><td style="max-width:420px">${esc(x.message)}</td><td>${fdate(x.at)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No messages yet. Messages from the Contact page appear here.</p>'}</div>
      <div class="panel"><h2>Newsletter subscribers (${sub.length})</h2>${sub.length ? `<p>${sub.map(esc).join(', ')}</p>` : '<p class="muted">No subscribers yet.</p>'}</div>`;
  }

  // ---------- settings ----------
  function settings(v) {
    const s = S.settings.get();
    v.innerHTML = `<form class="panel" id="sf" novalidate style="max-width:760px"><h2>Store settings</h2>
      <div class="grid2a">${fld('s-name', 'Store name', s.storeName)}${fld('s-tag', 'Tagline', s.tagline)}${fld('s-email', 'Contact email', s.email, 'type="email"', 'Enter a valid email.')}${fld('s-phone', 'Phone', s.phone)}</div>
      ${fld('s-ann', 'Offer ticker text (separate messages with |)', s.announcement)}${fld('s-wa', 'WhatsApp number (country code + digits, e.g. 919876543210)', s.whatsapp, 'inputmode="numeric"', '')}
      <div class="grid3">${fld('s-free', 'Free shipping above (₹)', s.freeShippingMin, 'type="number" min="0"', '≥ 0')}${fld('s-flat', 'Shipping in India (₹)', s.shippingFlat, 'type="number" min="0"', '≥ 0')}${fld('s-intl', 'International shipping (₹)', s.shippingIntl, 'type="number" min="0"', '≥ 0')}</div>
      <div class="grid2a">${fld('s-low', 'Low-stock threshold', s.lowStock, 'type="number" min="0"', '≥ 0')}${fld('s-cod', 'COD limit (₹)', s.codMax, 'type="number" min="0"', '≥ 0')}</div>
      <p class="label" style="margin:6px 0 10px">Payment methods shown at checkout</p><div class="chk">${[['razorpay', 'Razorpay (cards / netbanking)'], ['upi', 'UPI'], ['cod', 'Cash on Delivery']].map(([k, l]) => `<label class="check"><input type="checkbox" data-pay="${k}" ${s.pay[k] ? 'checked' : ''}> ${l}</label>`).join('')}</div>
      <p class="muted" style="font-size:13px">Payment gateways are not connected in this demo — see README for the integration points.</p>
      <button class="btn" type="submit">Save settings</button></form>
      <div class="panel" style="max-width:760px"><h2>Demo data</h2><p>Reset the catalogue, orders, customers, coupons and settings to the original sample data. This clears the cart, wishlist and accounts in this browser.</p><button class="btn btn--ghost" id="reset">Reset demo data</button></div>`;
    $('#sf').onsubmit = (e) => { e.preventDefault(); const n = (id) => +$('#' + id).value;
      const ok = [bad('s-email', !/^\S+@\S+\.\S+$/.test($('#s-email').value)), bad('s-free', !(n('s-free') >= 0)), bad('s-flat', !(n('s-flat') >= 0)), bad('s-intl', !(n('s-intl') >= 0)), bad('s-low', !(n('s-low') >= 0)), bad('s-cod', !(n('s-cod') >= 0))]; if (ok.includes(false)) return;
      S.settings.save({ storeName: $('#s-name').value.trim() || 'SHILPIKA', tagline: $('#s-tag').value.trim(), email: $('#s-email').value.trim(), phone: $('#s-phone').value.trim(), announcement: $('#s-ann').value.trim(), whatsapp: $('#s-wa').value.replace(/\D/g, ''), freeShippingMin: n('s-free'), shippingFlat: n('s-flat'), shippingIntl: n('s-intl'), lowStock: n('s-low'), codMax: n('s-cod'), pay: Object.fromEntries($$('[data-pay]').map((c) => [c.dataset.pay, c.checked])) }); toast('Settings saved'); };
    $('#reset').onclick = () => { if (confirm('Reset ALL demo data in this browser?')) { S.reset(); S.admin.login(S.admin.CREDENTIALS.email, S.admin.CREDENTIALS.password); toast('Demo data reset'); view(); } };
  }

  boot();
})();
