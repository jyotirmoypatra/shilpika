(function () {
  const { $, $$, esc, money, icon, pcard, skeletons, reveal, newsletter, toast } = SH, S = SH.store;
  $$('img[data-art]').forEach((i) => (i.src = SH.art(i.dataset.art)));
  ['hand', 'gift', 'truck', 'shield'].forEach((n, i) => ($('#ic' + (i + 1)).innerHTML = icon(n)));

  // ---------- hero slider ----------
  (function () {
    const track = $('#hs-track'), slides = $$('.slide', track), dots = $('#hs-dots');
    let cur = 0, timer, paused = false;
    dots.innerHTML = slides.map((_, i) => `<button aria-label="Go to slide ${i + 1}"></button>`).join('');
    const show = (i) => {
      cur = (i + slides.length) % slides.length; track.style.transform = `translateX(-${cur * 100}%)`;
      slides.forEach((s, k) => s.setAttribute('aria-hidden', k !== cur));
      $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === cur));
    };
    $('#hs-prev').onclick = () => { show(cur - 1); restart(); }; $('#hs-next').onclick = () => { show(cur + 1); restart(); };
    dots.onclick = (e) => { const b = e.target.closest('button'); if (b) { show($$('button', dots).indexOf(b)); restart(); } };
    const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const restart = () => { clearInterval(timer); if (!still) timer = setInterval(() => { if (!paused && !document.hidden) show(cur + 1); }, 6500); };
    $('.hs').addEventListener('mouseenter', () => (paused = true)); $('.hs').addEventListener('mouseleave', () => (paused = false));
    $('.hs').addEventListener('focusin', () => (paused = true)); $('.hs').addEventListener('focusout', () => (paused = false));
    let x0 = null; track.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) { show(cur + (dx < 0 ? 1 : -1)); restart(); } x0 = null; });
    show(0); restart();
  })();

  // ---------- round categories ----------
  $('#cats').innerHTML = S.categories.all().map((c) => `<a class="rc" href="shop.html?cat=${esc(c.id)}"><span class="rc__c"><img src="${SH.src(c.art || 'art:plate:sand:1')}" alt="" loading="lazy" width="120" height="120"></span><b>${esc(c.name)}</b></a>`).join('');

  // ---------- tabbed rail ----------
  const rail = $('#rail');
  function tab(k) {
    $$('.tabs-h button').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === k));
    const list = S.products.all().filter((p) => p.tags.includes(k));
    rail.innerHTML = (list.length ? list : S.products.all()).map((p) => pcard(p)).join(''); rail.scrollLeft = 0;
  }
  $('.tabs-h').onclick = (e) => { const b = e.target.closest('[data-tab]'); if (b) tab(b.dataset.tab); };
  $$('.rail__b').forEach((b) => (b.onclick = () => rail.scrollBy({ left: (b.classList.contains('next') ? 1 : -1) * rail.clientWidth * 0.8, behavior: 'smooth' })));

  // ---------- wedding packages ----------
  const PACKAGES = [
    { name: 'Premium', tone: 'Essentials', ids: ['shola-topor-classic', 'biyer-gachkouto-classic-pair', 'sindoor-kouto-painted', 'boron-dala-bridal-tray'] },
    { name: 'Royal', tone: 'Most popular', ids: ['shola-topor-classic', 'biyer-gachkouto-classic-pair', 'bridal-kulo-hand-painted', 'boron-dala-bridal-tray', 'alpona-pida-ritual-seat', 'sindoor-kouto-painted'] },
    { name: 'Grand', tone: 'The full ceremony', ids: ['shola-topor-pearl-zari', 'biyer-gachkouto-bridal-heirloom-set', 'bridal-kulo-hand-painted', 'mini-kulo-favour-set-of-6', 'boron-dala-bridal-tray', 'alpona-pida-ritual-seat', 'sindoor-kouto-painted', 'wedding-keepsake-gift-box'] }
  ];
  function drawPackages() {
    $('#pk').innerHTML = PACKAGES.map((pk, n) => {
      const items = pk.ids.map(S.products.byId).filter(Boolean), sum = items.reduce((t, p) => t + p.price, 0), now = Math.round(sum * 0.9);
      return `<article class="pkc ${n === 1 ? 'pkc--feat' : ''}"><span class="pkc__t">${pk.tone}</span><h3>${pk.name} Collection</h3><p class="pkc__n">${items.length} pieces</p>
        <div class="pkc__imgs">${items.slice(0, 5).map((p) => `<img src="${SH.src(p.images[0])}" alt="" loading="lazy">`).join('')}</div>
        <ul>${items.map((p) => `<li>${esc(p.name)}</li>`).join('')}</ul>
        <div class="pkc__p"><b>${money(now)}</b><s>${money(sum)}</s><span class="off">10% OFF</span></div>
        <button class="btn btn--gold btn--block" data-pk="${n}">Add this package</button></article>`;
    }).join('');
  }
  $('#pk').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pk]'); if (!b) return;
    const pk = PACKAGES[b.dataset.pk]; let added = 0; const skipped = [];
    pk.ids.forEach((id) => { const r = S.cart.add(id, 1); r.ok ? added++ : skipped.push((S.products.byId(id) || {}).name); });
    if (!S.coupons.find('SET10')) S.coupons.save({ code: 'SET10', type: 'percent', value: 10, min: 0, active: true });
    if (added) S.cart.setCoupon('SET10');
    if (skipped.length) toast(`${added} added. Skipped (unavailable or at stock limit): ${skipped.join(', ')}`, 'err');
    if (added) { S.cart.emit ? 0 : 0; S.emit('cart'); SH.openCart(); }
  });

  // ---------- wedding tiles ----------
  const TILES = [['gachkouto', 'The ritual box, hand-painted'], ['kulo', 'Alpona on woven cane'], ['topor', 'Shola, tier by tier'], ['wedding-accessories', 'Dala, pida & sindoor kouto']];
  $('#wt').innerHTML = TILES.map(([id, line]) => { const c = S.categories.byId(id); if (!c) return ''; return `<a class="wtile" href="shop.html?cat=${id}"><div class="arch"><img src="${SH.src(c.art)}" alt="" loading="lazy"></div><b>${esc(c.name)}</b><span class="bn">${esc(c.bn || '')}</span><small>${line}</small></a>`; }).join('');

  // ---------- grids ----------
  $('#deals').innerHTML = skeletons(8); $('#new').innerHTML = skeletons(4);
  setTimeout(() => {
    const all = S.products.all(), disc = (p) => (p.compare > p.price ? 1 - p.price / p.compare : 0);
    tab('bestseller'); drawPackages();
    $('#deals').classList.remove('skels'); $('#deals').innerHTML = all.filter((p) => p.stock > 0).sort((a, b) => disc(b) - disc(a)).slice(0, 8).map((p) => pcard(p)).join('');
    $('#new').classList.remove('skels'); $('#new').innerHTML = all.filter((p) => p.tags.includes('new')).slice(0, 4).map((p) => pcard(p)).join('');
    reveal();
  }, 300);

  $('#gal').innerHTML = ['art:kouto:rose:2:tree', 'art:kulo:clay:2', 'art:topor:sand:1:zari', 'art:dala:sand:1', 'art:cushion:ivory:2', 'art:diya:clay:0']
    .map((a) => `<a href="shop.html" class="gal__i" aria-label="Shilpika studio"><img src="${SH.art(a)}" alt="" loading="lazy" width="300" height="375"></a>`).join('');
  newsletter($('#nl')); reveal();
})();
