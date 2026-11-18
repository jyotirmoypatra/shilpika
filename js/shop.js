(function () {
  const { $, $$, esc, money, pcard, skeletons, reveal, qs } = SH, S = SH.store;
  const PAGE = 9;
  const st = { cats: new Set(), wed: false, min: '', max: '', stock: false, q: '', sort: 'featured', shown: PAGE };
  const params = new URLSearchParams(location.search);
  if (params.get('cat')) params.get('cat').split(',').forEach((c) => st.cats.add(c));
  if (params.get('collection') === 'wedding') st.wed = true;
  st.q = params.get('q') || ''; st.sort = params.get('sort') || 'featured';
  const PRESETS = [['Under ₹700', '', 700], ['₹700 – ₹1,500', 700, 1500], ['₹1,500 +', 1500, '']];

  if (matchMedia('(max-width:900px)').matches) $$('#filters details').forEach((d) => (d.open = false));
  const cats = S.categories.all();
  function drawFilters() {
    const all = S.products.all();
    $('#f-cats').innerHTML = cats.map((c) => `<label class="fopt"><span><input type="checkbox" value="${esc(c.id)}" ${st.cats.has(c.id) ? 'checked' : ''}> ${esc(c.name)}</span><small>${all.filter((p) => p.category === c.id).length}</small></label>`).join('');
    $('#f-presets').innerHTML = PRESETS.map(([l, a, b], i) => `<button class="chip" data-pre="${i}" type="button">${l}</button>`).join('');
    $('#f-wed').checked = st.wed; $('#f-stock').checked = st.stock; $('#f-q').value = st.q; $('#f-sort').value = st.sort; $('#f-sort-m').innerHTML = $('#f-sort').innerHTML; $('#f-sort-m').value = st.sort;
    $('#f-min').value = st.min; $('#f-max').value = st.max;
  }

  function filtered() {
    let list = S.products.all();
    if (st.q.trim()) { const ids = new Set(S.products.search(st.q).map((p) => p.id)); list = list.filter((p) => ids.has(p.id)); }
    if (st.cats.size) list = list.filter((p) => st.cats.has(p.category));
    if (st.wed) list = list.filter((p) => p.tags.includes('wedding'));
    if (st.min !== '') list = list.filter((p) => p.price >= +st.min);
    if (st.max !== '') list = list.filter((p) => p.price <= +st.max);
    if (st.stock) list = list.filter((p) => p.stock > 0);
    const s = st.sort;
    if (s === 'low') list.sort((a, b) => a.price - b.price);
    else if (s === 'high') list.sort((a, b) => b.price - a.price);
    else if (s === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (s === 'popular') list.sort((a, b) => b.tags.includes('bestseller') - a.tags.includes('bestseller'));
    else if (s === 'newest') list.sort((a, b) => b.tags.includes('new') - a.tags.includes('new'));
    return list;
  }

  function sync() {
    const p = new URLSearchParams();
    if (st.cats.size) p.set('cat', [...st.cats].join(','));
    if (st.wed) p.set('collection', 'wedding');
    if (st.q) p.set('q', st.q);
    if (st.sort !== 'featured') p.set('sort', st.sort);
    try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '')); } catch (e) { /* file:// pages can't rewrite their URL; filters still work */ }
  }

  function render(resetPage) {
    if (resetPage) st.shown = PAGE;
    const list = filtered(), vis = list.slice(0, st.shown);
    $('#grid').classList.remove('skels');
    $('#count').textContent = `${list.length} piece${list.length === 1 ? '' : 's'}`; $('#f-count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`; $('#f-apply').textContent = `Apply (${list.length})`;
    $('#grid').innerHTML = list.length ? vis.map(pcard).join('') : '';
    $('#more').innerHTML = !list.length
      ? `<div class="empty"><h3>No pieces match your filters</h3><p class="muted">Try removing a filter or searching for something else.</p><button class="btn btn--ghost" id="reset">Clear all filters</button></div>`
      : list.length > vis.length ? `<p>Showing ${vis.length} of ${list.length}</p><button class="btn btn--ghost" id="loadmore">Load more</button>` : `<p>You’ve seen all ${list.length} pieces</p>`;
    // title + active chips
    const only = st.cats.size === 1 ? S.categories.byId([...st.cats][0]) : null;
    $('#shop-title').innerHTML = only ? esc(only.name) : st.wed && !st.cats.size ? 'Bengali <em>wedding</em>' : st.q ? `Results for <em>“${esc(st.q)}”</em>` : 'All <em>pieces</em>';
    $('#shop-sub').textContent = only ? only.desc : st.wed ? 'Gachkouto, kulo, topor and wedding accessories — personalised to order.' : 'Handmade wedding essentials, handicrafts, décor and gifts.';
    document.title = (only ? only.name : 'Shop') + ' — SHILPIKA';
    const chips = [...[...st.cats].map((c) => [`c:${c}`, (S.categories.byId(c) || {}).name || c])];
    if (st.wed) chips.push(['wed', 'Bengali wedding']);
    if (st.min !== '' || st.max !== '') chips.push(['price', `${st.min !== '' ? money(st.min) : '₹0'} – ${st.max !== '' ? money(st.max) : 'any'}`]);
    if (st.stock) chips.push(['stock', 'In stock']);
    if (st.q) chips.push(['q', `“${st.q}”`]);
    $('#active').innerHTML = chips.map(([k, l]) => `<button class="chip on" data-frm="${esc(k)}" aria-label="Remove filter ${esc(l)}">${esc(l)} ×</button>`).join('');
    sync(); reveal();
  }
  function clearAll() { st.cats.clear(); st.wed = false; st.min = st.max = ''; st.stock = false; st.q = ''; drawFilters(); render(true); }

  $('#grid').innerHTML = skeletons(6);
  drawFilters();
  setTimeout(() => render(true), 300);

  $('#f-cats').addEventListener('change', (e) => { e.target.checked ? st.cats.add(e.target.value) : st.cats.delete(e.target.value); render(true); });
  $('#f-wed').onchange = (e) => { st.wed = e.target.checked; render(true); };
  $('#f-stock').onchange = (e) => { st.stock = e.target.checked; render(true); };
  $('#f-sort').onchange = (e) => { st.sort = e.target.value; $('#f-sort-m').value = st.sort; render(true); };
  $('#f-sort-m').onchange = (e) => { st.sort = e.target.value; $('#f-sort').value = st.sort; render(true); };
  let qt; $('#f-q').addEventListener('input', (e) => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value; render(true); }, 200); });
  ['min', 'max'].forEach((k) => $('#f-' + k).addEventListener('input', (e) => { st[k] = e.target.value; render(true); }));
  $('#f-presets').addEventListener('click', (e) => { const b = e.target.closest('[data-pre]'); if (!b) return; const [, a, c] = PRESETS[b.dataset.pre]; st.min = a; st.max = c; $('#f-min').value = a; $('#f-max').value = c; render(true); });
  $('#f-clear').onclick = clearAll; $('#f-clear-d').onclick = clearAll;
  $('#more').addEventListener('click', (e) => { if (e.target.id === 'loadmore') { st.shown += PAGE; render(); } if (e.target.id === 'reset') clearAll(); });
  $('#active').addEventListener('click', (e) => {
    const b = e.target.closest('[data-frm]'); if (!b) return; const k = b.dataset.frm;
    if (k.startsWith('c:')) st.cats.delete(k.slice(2)); else if (k === 'wed') st.wed = false; else if (k === 'price') st.min = st.max = ''; else if (k === 'stock') st.stock = false; else if (k === 'q') st.q = '';
    drawFilters(); render(true);
  });
  const f = $('#filters'), sc = $('#scrim');
  const grid = $('.shop'), mq = matchMedia('(max-width:900px)');
  const place = () => { if (mq.matches) document.body.appendChild(f); else grid.insertBefore(f, grid.firstChild); };
  place(); (mq.addEventListener ? mq.addEventListener('change', place) : mq.addListener(place));
  $('#f-open').onclick = () => { f.classList.add('open'); sc.classList.add('show'); document.body.style.overflow = 'hidden'; };
  const closeF = () => { f.classList.remove('open'); document.body.style.overflow = ''; if (!document.querySelector('.drawer.open,.search.open,.mnav.open')) sc.classList.remove('show'); };
  $('#f-close').onclick = closeF; $('#f-apply').onclick = closeF; sc.addEventListener('click', closeF);
})();
