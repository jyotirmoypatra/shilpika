(function () {
  const { $, $$, esc, money, icon, qs, fmtDate, toast } = SH, S = SH.store;
  const root = $('#root');
  const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Other'];
  const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates', 'Singapore', 'Bangladesh', 'Other'];
  const PAYLBL = { razorpay: 'Razorpay (cards / netbanking)', upi: 'UPI', cod: 'Cash on Delivery' };

  if (qs('done')) return done(qs('done'));
  if (!S.cart.items().length) {
    root.innerHTML = `<div class="phead"><h1><em>Checkout</em></h1></div><div class="empty" style="padding-bottom:110px">${icon('bag')}<h3>Your bag is empty</h3><p class="muted">Add something lovely before checking out.</p><a class="btn" href="shop.html">Explore the shop</a></div>`; return;
  }
  const u = S.users.current(), st = S.settings.get();
  let country = 'India', pay = 'upi';
  const def = u && (u.addresses || []).find((a) => a.isDefault) || (u && u.addresses && u.addresses[0]) || null;

  const field = (id, label, extra = '', opt) => `<div class="field"><label for="${id}">${label}${opt ? ' <span class="opt">(optional)</span>' : ''}</label><input id="${id}" ${extra}><span class="field__err"></span></div>`;
  root.innerHTML = `<div class="phead"><div class="steps"><a href="cart.html">1 Bag</a><i>—</i><span class="on">2 Details</span><i>—</i><span>3 Confirmation</span></div><h1><em>Checkout</em></h1></div>
    <div class="notice"><b>Demo checkout.</b> No payment is taken and no real order is placed. Payment methods below are interface placeholders for Razorpay, UPI and Cash on Delivery.</div>
    <form class="co" id="co" novalidate><div>
      ${u ? '' : `<p class="muted" style="margin-bottom:24px">Have an account? <a class="link-u" href="account.html#login">Sign in</a> for faster checkout. Or continue as guest.</p>`}
      <fieldset><legend>Contact</legend>
        <div class="row2">${field('f-name', 'Full name', 'autocomplete="name" required value="' + esc(u ? u.name : '') + '"')}${field('f-phone', 'Phone number', 'type="tel" inputmode="tel" autocomplete="tel" required value="' + esc(u ? u.phone : '') + '"')}</div>
        ${field('f-email', 'Email', 'type="email" autocomplete="email" required value="' + esc(u ? u.email : '') + '"')}</fieldset>
      <fieldset><legend>Delivery address</legend>
        ${u && u.addresses && u.addresses.length ? `<div class="field"><label for="f-saved">Saved addresses</label><select id="f-saved"><option value="">Enter a new address</option>${u.addresses.map((a) => `<option value="${a.id}" ${def && def.id === a.id ? 'selected' : ''}>${esc(a.label || 'Address')} — ${esc(a.line1)}, ${esc(a.city)}</option>`).join('')}</select></div>` : ''}
        <div class="field"><label for="f-country">Country</label><select id="f-country">${COUNTRIES.map((c) => `<option>${c}</option>`).join('')}</select></div>
        ${field('f-l1', 'Address line 1', 'autocomplete="address-line1" required')}${field('f-l2', 'Address line 2', 'autocomplete="address-line2"', true)}
        <div class="row2">${field('f-city', 'City', 'autocomplete="address-level2" required')}
          <div class="field"><label for="f-state">State / region</label><select id="f-state" autocomplete="address-level1"><option value="">Select…</option>${STATES.map((s) => `<option>${s}</option>`).join('')}</select><span class="field__err"></span></div></div>
        ${field('f-pin', 'PIN / postal code', 'autocomplete="postal-code" required inputmode="numeric"')}
        <div class="field"><label for="f-note">Order notes <span class="opt">(optional)</span></label><textarea id="f-note" maxlength="300" placeholder="Delivery instructions, gift message…"></textarea></div></fieldset>
      <fieldset><legend>Payment</legend><div id="pays"></div></fieldset>
      <div id="co-err"></div>
      <button class="btn btn--terra btn--block" type="submit" id="place" style="min-height:56px">Place demo order</button>
      <p class="muted" style="font-size:12.5px;margin-top:12px">By placing this order you agree to our <a class="link-u" href="policy.html?p=terms">Terms</a> and <a class="link-u" href="policy.html?p=privacy">Privacy policy</a>.</p></div>
      <aside class="box sticky" id="sum" aria-label="Order summary"></aside></form>`;

  function fillAddr(a) {
    $('#f-country').value = a.country || 'India'; $('#f-l1').value = a.line1 || ''; $('#f-l2').value = a.line2 || ''; $('#f-city').value = a.city || ''; $('#f-state').value = a.state || ''; $('#f-pin').value = a.pin || '';
    country = $('#f-country').value; summary(); drawPays();
  }
  function drawPays() {
    const t = S.cart.totals(S.cart.coupon(), country), intl = country !== 'India';
    const opts = [['upi', st.pay.upi && !intl], ['razorpay', st.pay.razorpay], ['cod', st.pay.cod && !intl && t.total <= st.codMax]];
    if (!opts.some(([k, ok]) => k === pay && ok)) pay = (opts.find(([, ok]) => ok) || [])[0] || '';
    $('#pays').innerHTML = opts.map(([k, ok]) => `<label class="pay" style="${ok ? '' : 'opacity:.5;cursor:not-allowed'}"><input type="radio" name="pay" value="${k}" ${pay === k ? 'checked' : ''} ${ok ? '' : 'disabled'}><span><b>${S.payments[k].label}</b><small>${ok ? S.payments[k].sub : k === 'cod' ? `Available in India for orders up to ${money(st.codMax)}` : 'Not available for this order'}</small></span></label>`).join('');
  }
  function summary() {
    const code = S.cart.coupon(), t = S.cart.totals(code, country);
    $('#sum').innerHTML = `<h3>Order summary</h3>${t.items.map((i) => `<div class="mini"><img src="${SH.src(i.product.images[0])}" alt=""><span><b>${esc(i.product.name)}</b><small>Qty ${i.qty}${i.custom && i.custom.name ? ' · ' + esc(i.custom.name) : ''}</small></span><span>${money(i.product.price * i.qty)}</span></div>`).join('')}
      <div class="coupon"><label class="sr-only" for="cc">Coupon</label><input id="cc" placeholder="Coupon code" value="${esc(code)}" autocomplete="off"><button class="btn btn--sm" type="button" id="capply">Apply</button></div>
      <p id="cmsg" style="font-size:13px;margin:6px 0 14px;min-height:18px;color:${t.error ? 'var(--err)' : 'var(--ok)'}" role="status">${t.error ? esc(t.error) : t.coupon ? `“${esc(t.coupon.code)}” applied` : ''}</p>
      <div class="sumrow"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>${t.discount ? `<div class="sumrow"><span>Discount</span><span class="disc">− ${money(t.discount)}</span></div>` : ''}
      <div class="sumrow"><span>Shipping${country !== 'India' ? ' (international)' : ''}</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
      <div class="sumrow total"><span>Total</span><span>${money(t.total)}</span></div><p class="muted" style="font-size:12px;margin:8px 0 0">Prices in INR. Taxes included where applicable.</p>`;
    $('#capply').onclick = () => { const v = $('#cc').value.trim(); const r = S.cart.totals(v, country); if (v && r.error) { S.cart.setCoupon(''); summary(); $('#cmsg').textContent = r.error; $('#cmsg').style.color = 'var(--err)'; return; } S.cart.setCoupon(v ? r.coupon.code : ''); summary(); drawPays(); };
  }
  summary(); drawPays(); if (def) { $('#f-saved').dispatchEvent(new Event('change')); fillAddr(def); }
  const sv = $('#f-saved'); if (sv) sv.onchange = () => { const a = u.addresses.find((x) => x.id === sv.value); if (a) fillAddr(a); };
  $('#f-country').onchange = (e) => { country = e.target.value; summary(); drawPays(); };
  $('#pays').addEventListener('change', (e) => { pay = e.target.value; });

  const rules = {
    'f-name': [(v) => v.trim().length >= 2, 'Please enter your full name.'],
    'f-email': [(v) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v), 'Enter a valid email address.'],
    'f-phone': [(v) => (country === 'India' ? /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, '')) : /^\+?[\d\s-]{7,16}$/.test(v)), 'Enter a valid phone number (10 digits for India).'],
    'f-l1': [(v) => v.trim().length >= 4, 'Please enter your address.'],
    'f-city': [(v) => v.trim().length >= 2, 'Please enter your city.'],
    'f-state': [(v) => v !== '', 'Please select a state / region.'],
    'f-pin': [(v) => (country === 'India' ? /^\d{6}$/.test(v.trim()) : v.trim().length >= 3), 'Enter a valid PIN / postal code (6 digits for India).']
  };
  function validate(id) { const el = $('#' + id), [fn, msg] = rules[id], bad = !fn(el.value), f = el.closest('.field'); f.classList.toggle('has-err', bad); f.querySelector('.field__err').textContent = bad ? msg : ''; return !bad; }
  Object.keys(rules).forEach((id) => $('#' + id).addEventListener('blur', () => validate(id)));

  $('#co').addEventListener('submit', async (e) => {
    e.preventDefault(); $('#co-err').innerHTML = '';
    const bad = Object.keys(rules).filter((id) => !validate(id));
    if (bad.length) { $('#' + bad[0]).focus(); return; }
    if (!pay) { $('#co-err').innerHTML = '<div class="form-msg err">No payment method is available for this order.</div>'; return; }
    const btn = $('#place'); btn.disabled = true; btn.textContent = 'Placing order…';
    const customer = { name: $('#f-name').value.trim(), email: $('#f-email').value.trim().toLowerCase(), phone: $('#f-phone').value.trim() };
    const address = { country, line1: $('#f-l1').value.trim(), line2: $('#f-l2').value.trim(), city: $('#f-city').value.trim(), state: $('#f-state').value, pin: $('#f-pin').value.trim() };
    try {
      const payment = await S.payments[pay].start();   // ← gateway hook (Razorpay / UPI / COD)
      const r = S.orders.create({ customer, address, payment, couponCode: S.cart.coupon(), note: $('#f-note').value.trim() });
      if (!r.ok) throw new Error(r.msg);
      if ($('#f-note').value.trim()) { /* notes are kept on the order in a real backend */ }
      location.replace('checkout.html?done=' + encodeURIComponent(r.order.id));
    } catch (err) { btn.disabled = false; btn.textContent = 'Place demo order'; $('#co-err').innerHTML = `<div class="form-msg err">${esc(err.message || 'Something went wrong. Please try again.')}</div>`; }
  });

  function done(id) {
    const o = S.orders.byId(id);
    if (!o) { root.innerHTML = '<div class="notfound"><h1>Order not found</h1><a class="btn" href="shop.html">Back to the shop</a></div>'; return; }
    try { sessionStorage.setItem('shilpika.track.' + o.id, '1'); } catch (e) {}
    root.innerHTML = `<div class="done"><div class="tick">${icon('check')}</div><p class="eyebrow" style="justify-content:center">Demo order placed</p><h1>Thank <em>you</em>, ${esc(o.customer.name.split(' ')[0])}</h1>
      <p class="muted" style="margin-top:14px">Order <b>${esc(o.id)}</b> · ${fmtDate(o.createdAt)}. A confirmation would be emailed to ${esc(o.customer.email)} once email is connected.</p>
      <div class="notice" style="text-align:left">This is a <b>demo order</b> stored only in this browser — no payment was taken and nothing will be shipped.</div>
      <div class="box">${o.items.map((i) => `<div class="mini"><img src="${SH.src(i.image)}" alt=""><span><b>${esc(i.name)}</b><small>Qty ${i.qty}${i.custom && i.custom.name ? ' · ' + esc(i.custom.name) : ''}</small></span><span>${money(i.price * i.qty)}</span></div>`).join('')}
        <div class="sumrow total"><span>Total (${esc(PAYLBL[o.payment.method])})</span><span>${money(o.total)}</span></div>
        <p class="muted" style="margin:10px 0 0;font-size:13.5px">Ship to: ${esc(o.address.line1)}, ${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.pin)}, ${esc(o.address.country)}</p></div>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap"><a class="btn" href="account.html#order/${esc(o.id)}">Track this order</a><a class="btn btn--ghost" href="shop.html">Continue shopping</a></div></div>`;
  }
})();
