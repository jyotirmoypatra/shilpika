(function () {
  const { $, esc, money, pcard, icon, toast } = SH, S = SH.store;
  const root = $('#root');
  function render() {
    const items = S.wishlist.items();
    if (!items.length) { root.innerHTML = `<div class="phead"><h1>Your <em>wishlist</em></h1></div><div class="empty" style="padding-bottom:110px">${icon('heart')}<h3>Nothing saved yet</h3><p class="muted">Tap the heart on any piece to save it here.</p><a class="btn" href="shop.html">Explore the shop</a></div>`; return; }
    root.innerHTML = `<div class="phead"><h1>Your <em>wishlist</em></h1><p>${items.length} saved piece${items.length > 1 ? 's' : ''}</p></div>
      <div class="pgrid" style="padding-bottom:90px">${items.map((p) => `<div>${pcard(p, { noAdd: true })}<div style="display:flex;gap:10px;margin-top:10px"><button class="btn btn--sm" style="flex:1" data-move="${esc(p.id)}">${p.customizable ? 'Customise' : p.stock <= 0 ? 'Sold out' : 'Move to bag'}</button><button class="btn btn--sm btn--ghost" data-del="${esc(p.id)}" aria-label="Remove ${esc(p.name)} from wishlist">Remove</button></div></div>`).join('')}</div>`;
  }
  root.addEventListener('click', (e) => {
    const m = e.target.closest('[data-move]');
    if (m) {
      const p = S.products.byId(m.dataset.move);
      if (p.customizable) return (location.href = 'product.html?id=' + p.id);
      const r = S.cart.add(p.id, 1); if (!r.ok) return toast(r.msg, 'err');
      S.wishlist.remove(p.id); toast('Moved to your bag'); SH.openCart(); return;
    }
    const d = e.target.closest('[data-del]'); if (d) { S.wishlist.remove(d.dataset.del); }
  });
  // hearts inside this page: re-render after the global handler toggles them
  S.on('wishlist', render);
  render();
})();
