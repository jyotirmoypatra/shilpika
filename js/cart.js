(function () {
  const { $, esc, money, icon, reveal, toast } = SH, S = SH.store;
  const root = $('#root');
  let pinMsg = '', couponErr = '';

  function estimate(pin) {
    if (!/^\d{6}$/.test(pin)) return { err: 'Enter a valid 6-digit PIN code.' };
    const lead = Math.max(0, ...S.cart.items().map((i) => i.product.leadDays || 0));
    const bengal = /^(7[0-4])/.test(pin), a = lead + (bengal ? 2 : 4), b = lead + (bengal ? 4 : 8);
    const f = (d) => new Date(Date.now() + d * 864e5).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return { ok: `Estimated delivery ${f(a)} – ${f(b)}${lead ? ` (includes ${lead} days to handcraft)` : ''}. This is an estimate, not a guarantee.` };
  }

  function render() {
    const code = S.cart.coupon(); const t = S.cart.totals(code);
    if (t.error && code) { couponErr = t.error; S.cart.setCoupon(''); return render(); }
    if (!t.items.length) {
      root.innerHTML = `<div class="phead"><h1>Your <em>bag</em></h1></div><div class="empty" style="padding-bottom:110px">${icon('bag')}<h3>Your bag is empty</h3><p class="muted">Nothing here yet — let’s find something made by hand.</p><a class="btn" href="shop.html">Continue shopping</a>
        <p style="margin-top:34px"><a class="link-u" href="wishlist.html">View your wishlist</a></p></div>`; return;
    }
    const left = Math.max(0, t.freeShippingMin - t.subtotal + t.discount);
    root.innerHTML = `<div class="phead"><div class="steps"><span class="on">1 Bag</span><i>—</i><span>2 Details</span><i>—</i><span>3 Confirmation</span></div><h1>Your <em>bag</em></h1></div>
      <div class="cart"><section aria-label="Items in your bag">
        <hr class="stitch">${t.items.map(SH.lineHTML).join('')}
        <p style="margin-top:26px"><a class="link" href="shop.html">← Continue shopping</a></p></section>
      <aside class="box sticky"><h3>Order summary</h3>
        <div class="sumrow"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
        ${t.discount ? `<div class="sumrow"><span>Discount (${esc(t.coupon.code)})</span><span class="disc">− ${money(t.discount)}</span></div>` : ''}
        <div class="sumrow"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
        ${left > 0 && !t.coupon?.type?.startsWith('free') ? `<p class="muted" style="font-size:12.5px;margin:2px 0">Add ${money(left)} more for free shipping in India.</p>` : ''}
        <div class="sumrow total"><span>Total</span><span>${money(t.total)}</span></div>
        <form class="coupon" id="cform" novalidate><label class="sr-only" for="cc">Coupon code</label><input id="cc" placeholder="Coupon code" value="${esc(code)}" autocomplete="off"><button class="btn btn--sm" type="submit">${code ? 'Update' : 'Apply'}</button></form>
        <p id="cmsg" style="font-size:13px;margin:6px 0 0;color:${couponErr ? 'var(--err)' : 'var(--ok)'}" role="status">${couponErr ? esc(couponErr) : t.coupon ? `“${esc(t.coupon.code)}” applied` : ''}</p>
        ${code ? '<button class="rm" id="crm">Remove coupon</button>' : '<p class="muted" style="font-size:12px;margin:6px 0 0">Demo codes: SHILPIKA10, BIYE200, FREESHIP</p>'}
        <form class="coupon" id="pform" novalidate style="margin-top:22px"><label class="sr-only" for="pin">PIN code</label><input id="pin" placeholder="Delivery PIN code" inputmode="numeric" maxlength="6" style="text-transform:none"><button class="btn btn--sm btn--ghost" type="submit">Check</button></form>
        <p id="pmsg" style="font-size:13px;margin:6px 0 20px;color:var(--ink-2)" role="status">${esc(pinMsg)}</p>
        <a class="btn btn--block" href="checkout.html">Proceed to checkout</a>
        <p class="muted" style="font-size:12px;margin-top:12px;text-align:center">Demo store — no real payment is taken.</p></aside></div>`;
    $('#cform').onsubmit = (e) => { e.preventDefault(); const v = $('#cc').value.trim(); if (!v) return; const r = S.cart.totals(v); if (r.error) { couponErr = r.error; } else { couponErr = ''; S.cart.setCoupon(r.coupon.code); toast('Coupon applied'); } render(); };
    const cr = $('#crm'); if (cr) cr.onclick = () => { S.cart.setCoupon(''); couponErr = ''; render(); };
    $('#pform').onsubmit = (e) => { e.preventDefault(); const r = estimate($('#pin').value.trim()); pinMsg = r.err || r.ok; $('#pmsg').textContent = pinMsg; $('#pmsg').style.color = r.err ? 'var(--err)' : 'var(--ink-2)'; };
    reveal();
  }
  S.on('cart', render);
  render();
})();
