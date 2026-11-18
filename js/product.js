(function () {
  const { $, $$, esc, money, icon, pcard, reveal, qs, toast } = SH, S = SH.store;
  const root = $('#pd-root');
  const p = S.products.byId(qs('id'));
  if (!p) { root.innerHTML = '<div class="notfound"><h1>Piece not found</h1><p class="muted">This product may have been removed.</p><a class="btn" href="shop.html">Back to the shop</a></div>'; return; }
  const cat = S.categories.byId(p.category) || {};
  const off = p.compare > p.price ? Math.round((1 - p.price / p.compare) * 100) : 0;
  document.title = `${p.name} — SHILPIKA`;
  $('meta[name=description]').content = p.short;

  const stars = (n) => `<span class="stars" aria-label="${n.toFixed(1)} out of 5">${[1, 2, 3, 4, 5].map((i) => `<svg viewBox="0 0 24 24" class="${i <= Math.round(n) ? '' : 'e'}"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/></svg>`).join('')}</span>`;
  function deliveryText() {
    const a = p.leadDays || 1, d1 = new Date(Date.now() + (a + 3) * 864e5), d2 = new Date(Date.now() + (a + 7) * 864e5);
    const f = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${f(d1)} – ${f(d2)}`;
  }

  function render() {
    const cur = S.products.byId(p.id);
    const stockCls = cur.stock <= 0 ? 'out' : cur.stock <= S.settings.get().lowStock ? 'low' : '';
    const stockTxt = cur.stock <= 0 ? 'Sold out' : cur.stock <= S.settings.get().lowStock ? `Only ${cur.stock} left` : 'In stock';
    const avg = S.reviews.avg(p.id), rv = S.reviews.for(p.id);
    const d = p.details || {};
    root.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a>/<a href="shop.html">Shop</a>/<a href="shop.html?cat=${esc(p.category)}">${esc(cat.name || '')}</a>/<span>${esc(p.name)}</span></nav>
      <div class="pd">
        <div class="gallery">
          <div class="thumbs" role="tablist" aria-label="Product images">${p.images.map((im, i) => `<button class="${i ? '' : 'on'}" data-i="${i}" role="tab" aria-label="Image ${i + 1}"><img src="${SH.src(im)}" alt="" loading="lazy"></button>`).join('')}</div>
          <div class="stage" id="stage" tabindex="0" role="button" aria-label="Zoom product image"><img id="main-img" src="${SH.src(p.images[0])}" alt="${esc(p.name)}" width="800" height="1000"><span class="stage__hint">${icon('zoom')} Hover to zoom · click to enlarge</span></div>
        </div>
        <div class="pd__info">
          <p class="eyebrow" style="margin-bottom:6px">${esc(cat.name || '')}</p>
          <h1>${esc(p.name)}</h1>
          ${p.bn ? `<div class="pd__bn bn">${esc(p.bn)}</div>` : ''}
          ${rv.length ? `<a href="#reviews" class="link-u" style="font-size:13px">${stars(avg)} <span class="muted">${rv.length} review${rv.length > 1 ? 's' : ''}</span></a>` : ''}
          <div class="pd__price">${money(p.price)}${off ? `<s>${money(p.compare)}</s><span class="off">Save ${off}%</span>` : ''}</div>
          <p>${esc(p.short)}</p>
          <div class="stock ${stockCls}">${stockTxt}${cur.stock > 0 ? ` · SKU ${esc(p.sku || '—')}` : ''}</div>
          <form id="buy" novalidate>
            ${p.customizable ? `<div class="custom"><h3>Make it yours</h3><p>Personalised to order. Please check spellings — we paint exactly what you enter.</p>
              <div class="field"><label for="c-name">Name(s) <span class="opt">(required)</span></label><input id="c-name" maxlength="60" placeholder="e.g. Ananya &amp; Rohit" autocomplete="off"><span class="field__err">Please enter the name(s) to personalise.</span></div>
              <div class="field"><label for="c-date">Wedding date <span class="opt">(optional)</span></label><input id="c-date" type="date" min="${new Date().toISOString().slice(0, 10)}"><span class="field__err">Please choose a date in the future.</span><span class="field__hint">Made to order — usually ${p.leadDays || 1}+ days to prepare.</span></div>
              <div class="field"><label for="c-col">Colour preference</label><select id="c-col">${(p.colours || []).map((c) => `<option>${esc(c)}</option>`).join('')}<option>Other — I’ll describe below</option></select></div>
              <div class="field"><label for="c-notes">Special instructions <span class="opt">(optional)</span></label><textarea id="c-notes" maxlength="300" placeholder="Head size for topor, message for the tag, preferred motifs…"></textarea></div></div>` : ''}
            <div class="buy">
              <div class="qty" role="group" aria-label="Quantity"><button type="button" id="qm" aria-label="Decrease quantity">−</button><span id="q" aria-live="polite">1</span><button type="button" id="qp" aria-label="Increase quantity">+</button></div>
              <button class="btn" type="submit" id="add" ${cur.stock <= 0 ? 'disabled' : ''}>Add to bag</button>
              <button class="btn btn--terra" type="button" id="now" ${cur.stock <= 0 ? 'disabled' : ''}>Buy now</button>
            </div>
            <button class="btn btn--ghost btn--block" type="button" data-wish="${esc(p.id)}"><span id="wtxt">${S.wishlist.has(p.id) ? '♥ In your wishlist' : '♡ Add to wishlist'}</span></button>
          </form>
          <div class="ship-note" style="margin-top:22px">${icon('truck')}<div><b>Estimated delivery: ${deliveryText()}</b><br><span class="muted">${p.leadDays > 3 ? `Includes ${p.leadDays} days to handcraft. ` : ''}Free shipping over ${money(S.settings.get().freeShippingMin)}.</span></div></div>
          <div class="tabs" style="margin-top:20px">
            <details open><summary>Description</summary><div class="tb"><p>${esc(p.description)}</p></div></details>
            <details><summary>Handmade details</summary><div class="tb"><dl class="dl"><dt>Material</dt><dd>${esc(d.material || '—')}</dd><dt>Dimensions</dt><dd>${esc(d.dimensions || '—')}</dd><dt>Weight</dt><dd>${esc(d.weight || '—')}</dd><dt>Care</dt><dd>${esc(d.care || '—')}</dd><dt>Made in</dt><dd>West Bengal, India</dd></dl></div></details>
            <details><summary>Shipping &amp; returns</summary><div class="tb"><p>Ships across India and internationally. Personalised pieces are made to order and are not returnable unless damaged or incorrect. <a class="link-u" href="policy.html?p=returns">Read our return policy</a>.</p></div></details>
          </div>
        </div>
      </div>
      <section class="reviews" id="reviews"><div class="sec__head"><div><p class="eyebrow">Reviews</p><h2>What people <em>say</em></h2></div></div>
        ${rv.length ? rv.map((r) => `<div class="rev">${stars(r.rating)} <b style="margin-left:8px">${esc(r.name)}</b> ${r.demo ? '<span class="demo-tag">Demo content</span>' : ''}<p>${esc(r.text)}</p></div>`).join('') : '<p class="muted">No reviews yet — be the first.</p>'}
        <form class="rform" id="rform" novalidate><h3 style="margin:34px 0 14px">Write a review</h3>
          <div class="field"><span class="label">Rating</span><div class="stk" role="radiogroup" aria-label="Rating">${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="rt" id="rt${n}" value="${n}" ${n === 5 ? 'checked' : ''}><label for="rt${n}" title="${n} stars">★</label>`).join('')}</div></div>
          <div class="field"><label for="rv-name">Your name</label><input id="rv-name" required maxlength="40" autocomplete="name"><span class="field__err">Please enter your name.</span></div>
          <div class="field"><label for="rv-text">Review</label><textarea id="rv-text" required maxlength="500"></textarea><span class="field__err">Please write a few words.</span></div>
          <button class="btn" type="submit">Submit review</button><p class="muted" style="font-size:12.5px;margin-top:10px">Demo: reviews are saved in this browser only.</p></form></section>
      <section class="sec" style="padding-top:20px"><div class="sec__head"><div><p class="eyebrow">You may also like</p><h2>Related <em>pieces</em></h2></div></div><div class="pgrid">${S.products.related(p, 4).map(pcard).join('')}</div></section>`;
    wire(cur); reveal();
  }

  function wire(cur) {
    let qty = 1;
    const stage = $('#stage'), mi = $('#main-img');
    $$('.thumbs button').forEach((b) => (b.onclick = () => { $$('.thumbs button').forEach((x) => x.classList.toggle('on', x === b)); mi.src = SH.src(p.images[b.dataset.i]); }));
    stage.addEventListener('mousemove', (e) => { const r = stage.getBoundingClientRect(); mi.style.setProperty('--ox', ((e.clientX - r.left) / r.width) * 100 + '%'); mi.style.setProperty('--oy', ((e.clientY - r.top) / r.height) * 100 + '%'); stage.classList.add('zoom'); });
    stage.addEventListener('mouseleave', () => stage.classList.remove('zoom'));
    const lb = $('#lb'); const openLb = () => { $('#lb-img').src = mi.src; lb.classList.add('open'); };
    stage.onclick = openLb; stage.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(); } };
    $('#lb-x').onclick = () => lb.classList.remove('open'); lb.onclick = (e) => { if (e.target === lb) lb.classList.remove('open'); };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.classList.remove('open'); });

    const qv = $('#q');
    $("#qm").onclick = () => { qty = Math.max(1, qty - 1); qv.textContent = qty; };
    $("#qp").onclick = () => { if (qty >= cur.stock) return toast(`Only ${cur.stock} available`, 'err'); qty++; qv.textContent = qty; };
    $$('.wish, [data-wish]', root).forEach(() => {});
    S.on('wishlist', () => { const w = $('#wtxt'); if (w) w.textContent = S.wishlist.has(p.id) ? '♥ In your wishlist' : '♡ Add to wishlist'; });

    function custom() {
      if (!p.customizable) return { ok: true, c: null };
      let ok = true;
      const name = $('#c-name'), date = $('#c-date');
      const setErr = (el, bad) => { el.closest('.field').classList.toggle('has-err', bad); if (bad) ok = false; };
      setErr(name, !name.value.trim());
      setErr(date, !!date.value && new Date(date.value) < new Date(new Date().toDateString()));
      if (!ok) { ($('.has-err input') || name).focus(); return { ok }; }
      return { ok, c: { name: name.value.trim(), date: date.value, colour: $('#c-col').value, notes: $('#c-notes').value.trim() } };
    }
    $('#buy').addEventListener('submit', (e) => { e.preventDefault(); const c = custom(); if (c.ok) SH.addToCart(p.id, qty, c.c, $('#add')); });
    $('#now').onclick = () => { const c = custom(); if (!c.ok) return; const r = S.cart.add(p.id, qty, c.c); if (!r.ok) return toast(r.msg, 'err'); location.href = 'checkout.html'; };

    $('#rform').addEventListener('submit', (e) => {
      e.preventDefault(); const n = $('#rv-name'), t = $('#rv-text'); let ok = true;
      [n, t].forEach((el) => { const bad = !el.value.trim(); el.closest('.field').classList.toggle('has-err', bad); if (bad) ok = false; });
      if (!ok) return;
      S.reviews.add(p.id, { name: n.value.trim(), text: t.value.trim(), rating: +document.querySelector('[name=rt]:checked').value, demo: false });
      toast('Thanks — your review was added'); render(); location.hash = '#reviews';
    });
  }
  render();
})();
