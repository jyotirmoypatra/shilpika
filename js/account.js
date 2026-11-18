(function () {
  const { $, $$, esc, money, icon, fmtDate, toast } = SH, S = SH.store;
  const root = $('#root');
  const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Other'];
  const LBL = Object.fromEntries(S.orders.STATUSES.concat([['cancelled', 'Cancelled']]));
  const tracked = (id) => { try { return sessionStorage.getItem('shilpika.track.' + id) === '1'; } catch (e) { return false; } };
  const markTracked = (id) => { try { sessionStorage.setItem('shilpika.track.' + id, '1'); } catch (e) {} };
  const fld = (id, label, val, extra) => `<div class="field"><label for="${id}">${label}</label><input id="${id}" value="${esc(val || '')}" ${extra || ''}><span class="field__err"></span></div>`;
  const setErr = (id, msg) => { const f = $('#' + id).closest('.field'); f.classList.toggle('has-err', !!msg); f.querySelector('.field__err').textContent = msg || ''; return !msg; };
  const route = () => (location.hash || '').replace(/^#/, '');

  function authView(which) {
    document.title = 'Sign in — SHILPIKA';
    root.innerHTML = `<div class="phead"><h1>My <em>account</em></h1><p>Sign in to see your orders, addresses and wishlist.</p></div>
      <div class="notice" style="max-width:980px;margin:0 auto 26px">Demo accounts are stored only in this browser. Real authentication needs a backend.</div>
      <div class="authbox"><form id="login" novalidate><h2 style="font-size:36px;margin-bottom:22px" id="login-h">Sign in</h2><div id="l-msg"></div>
        ${fld('l-email', 'Email', '', 'type="email" autocomplete="email"')}${fld('l-pass', 'Password', '', 'type="password" autocomplete="current-password"')}<button class="btn btn--block" type="submit">Sign in</button></form>
      <form id="reg" novalidate><h2 style="font-size:36px;margin-bottom:22px" id="reg-h">Create account</h2><div id="r-msg"></div>
        ${fld('r-name', 'Full name', '', 'autocomplete="name"')}${fld('r-email', 'Email', '', 'type="email" autocomplete="email"')}${fld('r-phone', 'Phone (optional)', '', 'type="tel" autocomplete="tel"')}${fld('r-pass', 'Password (min. 8 characters)', '', 'type="password" autocomplete="new-password"')}<button class="btn btn--ghost btn--block" type="submit">Create account</button></form></div>
      <div class="authbox" style="padding-top:0;grid-template-columns:1fr"><form id="track" novalidate style="border-top:1px dashed var(--terra);padding-top:34px"><h2 style="font-size:30px;margin-bottom:6px">Track an order</h2><p class="muted">Placed an order as a guest? Enter your order number and email.</p><div id="t-msg"></div>
        <div class="row2">${fld('t-id', 'Order number', '', 'placeholder="SHP-10021"')}${fld('t-email', 'Email', '', 'type="email"')}</div><button class="btn btn--ghost" type="submit">Track order</button></form></div>`;
    $('#login').onsubmit = (e) => {
      e.preventDefault(); const a = setErr('l-email', /^\S+@\S+\.\S+$/.test($('#l-email').value) ? '' : 'Enter a valid email.'), b = setErr('l-pass', $('#l-pass').value ? '' : 'Enter your password.');
      if (!a || !b) return; const r = S.users.login($('#l-email').value, $('#l-pass').value);
      if (!r.ok) return ($('#l-msg').innerHTML = `<div class="form-msg err">${esc(r.msg)}</div>`);
      toast('Welcome back, ' + r.user.name.split(' ')[0]); location.hash = '#orders'; main();
    };
    $('#reg').onsubmit = (e) => {
      e.preventDefault();
      const ok = [setErr('r-name', $('#r-name').value.trim().length > 1 ? '' : 'Enter your name.'), setErr('r-email', /^\S+@\S+\.\S+$/.test($('#r-email').value) ? '' : 'Enter a valid email.'), setErr('r-phone', !$('#r-phone').value || /^\+?[\d\s-]{7,16}$/.test($('#r-phone').value) ? '' : 'Enter a valid phone number.'), setErr('r-pass', $('#r-pass').value.length >= 8 ? '' : 'Use at least 8 characters.')];
      if (ok.includes(false)) return;
      const r = S.users.register({ name: $('#r-name').value, email: $('#r-email').value, phone: $('#r-phone').value, password: $('#r-pass').value });
      if (!r.ok) return ($('#r-msg').innerHTML = `<div class="form-msg err">${esc(r.msg)}</div>`);
      toast('Account created'); location.hash = '#profile'; main();
    };
    $('#track').onsubmit = (e) => {
      e.preventDefault(); const o = S.orders.byId($('#t-id').value);
      if (!o || (o.customer.email || '').toLowerCase() !== $('#t-email').value.trim().toLowerCase()) return ($('#t-msg').innerHTML = '<div class="form-msg err">We couldn’t find an order with that number and email.</div>');
      markTracked(o.id); location.hash = '#order/' + o.id;
    };
    if (which === 'register') $('#r-name').focus();
  }

  function shell(active, inner) {
    const u = S.users.current();
    root.innerHTML = `<div class="phead"><h1>Hello, <em>${esc(u.name.split(' ')[0])}</em></h1></div>
      <div class="acct"><nav class="anav" aria-label="Account"><a href="#profile" class="${active === 'profile' ? 'on' : ''}">Profile</a><a href="#addresses" class="${active === 'addresses' ? 'on' : ''}">Saved addresses</a><a href="#orders" class="${active === 'orders' ? 'on' : ''}">My orders</a><a href="wishlist.html">Wishlist <span class="muted">${S.wishlist.ids().length}</span></a><button id="logout">Log out</button></nav><section id="pane" aria-live="polite">${inner}</section></div>`;
    $('#logout').onclick = () => { S.users.logout(); toast('Logged out'); location.hash = ''; main(); };
  }

  function profile() {
    const u = S.users.current(); shell('profile', `<h2 style="font-size:38px;margin-bottom:24px">Profile</h2><div id="p-msg"></div>
      <form id="pf" novalidate style="max-width:520px">${fld('p-name', 'Full name', u.name, 'autocomplete="name"')}${fld('p-email', 'Email', u.email, 'type="email" autocomplete="email"')}${fld('p-phone', 'Phone', u.phone, 'type="tel"')}<button class="btn" type="submit">Save changes</button></form>
      <hr class="stitch" style="margin:44px 0 30px"><h3 style="margin-bottom:16px">Change password</h3><div id="pw-msg"></div>
      <form id="pw" novalidate style="max-width:520px">${fld('pw-old', 'Current password', '', 'type="password" autocomplete="current-password"')}${fld('pw-new', 'New password (min. 8)', '', 'type="password" autocomplete="new-password"')}<button class="btn btn--ghost" type="submit">Update password</button></form>`);
    $('#pf').onsubmit = (e) => {
      e.preventDefault(); const em = $('#p-email').value.trim().toLowerCase();
      const ok = [setErr('p-name', $('#p-name').value.trim().length > 1 ? '' : 'Enter your name.'), setErr('p-email', /^\S+@\S+\.\S+$/.test(em) ? '' : 'Enter a valid email.')];
      if (ok.includes(false)) return;
      if (S.users.all().some((x) => x.email === em && x.id !== u.id)) return setErr('p-email', 'That email is used by another account.');
      S.users.update({ name: $('#p-name').value.trim(), email: em, phone: $('#p-phone').value.trim() }); toast('Profile saved'); profile();
    };
    $('#pw').onsubmit = (e) => {
      e.preventDefault(); if (!setErr('pw-new', $('#pw-new').value.length >= 8 ? '' : 'Use at least 8 characters.')) return;
      const r = S.users.changePassword($('#pw-old').value, $('#pw-new').value);
      $('#pw-msg').innerHTML = `<div class="form-msg ${r.ok ? 'ok' : 'err'}">${r.ok ? 'Password updated.' : esc(r.msg)}</div>`; if (r.ok) { $('#pw-old').value = $('#pw-new').value = ''; }
    };
  }

  function addresses(editId) {
    const u = S.users.current(), list = u.addresses || [];
    const a = editId === 'new' ? {} : list.find((x) => x.id === editId);
    shell('addresses', `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;gap:16px;flex-wrap:wrap"><h2 style="font-size:38px">Saved addresses</h2><button class="btn btn--sm" id="a-new">Add address</button></div>
      ${a ? `<form id="af" novalidate class="box" style="margin-bottom:30px"><h3>${a.id ? 'Edit' : 'New'} address</h3>
        <div class="row2">${fld('a-label', 'Label (Home, Work…)', a.label)}${fld('a-name', 'Recipient name', a.name || u.name)}</div>${fld('a-l1', 'Address line 1', a.line1)}${fld('a-l2', 'Address line 2 (optional)', a.line2)}
        <div class="row2">${fld('a-city', 'City', a.city)}<div class="field"><label for="a-state">State</label><select id="a-state"><option value="">Select…</option>${STATES.map((s) => `<option ${a.state === s ? 'selected' : ''}>${s}</option>`).join('')}</select><span class="field__err"></span></div></div>
        <div class="row2">${fld('a-pin', 'PIN code', a.pin, 'inputmode="numeric" maxlength="6"')}${fld('a-phone', 'Phone', a.phone || u.phone)}</div>
        <label class="check" style="margin-bottom:18px"><input type="checkbox" id="a-def" ${a.isDefault ? 'checked' : ''}> Make this my default address</label>
        <button class="btn" type="submit">Save address</button> <button class="btn btn--ghost" type="button" id="a-cancel">Cancel</button></form>` : ''}
      ${list.length ? `<div class="grid2">${list.map((x) => `<div class="addr">${x.isDefault ? '<span class="status delivered def">Default</span>' : ''}<b>${esc(x.label || 'Address')}</b><p style="margin:6px 0 14px;color:var(--ink-2)">${esc(x.name || '')}<br>${esc(x.line1)}${x.line2 ? ', ' + esc(x.line2) : ''}<br>${esc(x.city)}, ${esc(x.state)} ${esc(x.pin)}<br>${esc(x.phone || '')}</p><button class="link-u" data-edit="${x.id}">Edit</button> &nbsp; <button class="rm" data-del="${x.id}">Delete</button></div>`).join('')}</div>` : a ? '' : '<div class="empty"><h3>No saved addresses</h3><p class="muted">Add one to speed up checkout.</p></div>'}`);
    $('#a-new').onclick = () => addresses('new');
    $$('[data-edit]').forEach((b) => (b.onclick = () => addresses(b.dataset.edit)));
    $$('[data-del]').forEach((b) => (b.onclick = () => { if (confirm('Delete this address?')) { S.users.removeAddress(b.dataset.del); addresses(); } }));
    if (a) {
      $('#a-cancel').onclick = () => addresses();
      $('#af').onsubmit = (e) => {
        e.preventDefault();
        const ok = [setErr('a-name', $('#a-name').value.trim() ? '' : 'Required.'), setErr('a-l1', $('#a-l1').value.trim().length > 3 ? '' : 'Enter the address.'), setErr('a-city', $('#a-city').value.trim() ? '' : 'Required.'), setErr('a-state', $('#a-state').value ? '' : 'Select a state.'), setErr('a-pin', /^\d{6}$/.test($('#a-pin').value) ? '' : 'Enter a 6-digit PIN.'), setErr('a-phone', /^[6-9]\d{9}$/.test($('#a-phone').value.replace(/\s/g, '')) ? '' : 'Enter a 10-digit mobile number.')];
        if (ok.includes(false)) return;
        S.users.saveAddress({ id: a.id, label: $('#a-label').value.trim() || 'Home', name: $('#a-name').value.trim(), line1: $('#a-l1').value.trim(), line2: $('#a-l2').value.trim(), city: $('#a-city').value.trim(), state: $('#a-state').value, pin: $('#a-pin').value, phone: $('#a-phone').value.trim(), country: 'India', isDefault: $('#a-def').checked });
        toast('Address saved'); addresses();
      };
    }
  }

  function orders() {
    const list = S.orders.mine();
    shell('orders', `<h2 style="font-size:38px;margin-bottom:24px">My orders</h2>${list.length ? `<table class="otbl"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>${list.map((o) => `<tr><td><b>${esc(o.id)}</b></td><td>${fmtDate(o.createdAt)}</td><td><span class="status ${o.status}">${LBL[o.status]}</span></td><td>${money(o.total)}</td><td><a class="link-u" href="#order/${esc(o.id)}">View &amp; track</a></td></tr>`).join('')}</tbody></table>` : '<div class="empty"><h3>No orders yet</h3><p class="muted">Your demo orders will appear here.</p><a class="btn" href="shop.html">Start shopping</a></div>'}`);
  }

  function orderView(id) {
    const o = S.orders.byId(id), u = S.users.current();
    const allowed = o && ((u && (o.userId === u.id || (o.customer.email || '').toLowerCase() === u.email)) || tracked(o.id));
    if (!allowed) { if (u) { shell('orders', '<div class="empty"><h3>Order not found</h3><a class="btn" href="#orders">Back to orders</a></div>'); } else authView(); return; }
    const flow = S.orders.STATUSES, idx = flow.findIndex(([k]) => k === o.status), cancelled = o.status === 'cancelled';
    const at = (k) => ((o.timeline || []).find((t) => t.status === k) || {}).at;
    const body = `<p><a class="link" href="${u ? '#orders' : 'account.html'}">← All orders</a></p>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;align-items:center;margin:14px 0 6px"><h2 style="font-size:40px">Order ${esc(o.id)}</h2><span class="status ${o.status}">${LBL[o.status]}</span></div>
      <p class="muted">Placed ${fmtDate(o.createdAt)} · ${o.demo ? '<span class="demo-tag">Demo order</span>' : ''}</p>
      <div class="grid2" style="margin-top:28px;align-items:start"><div><h3 style="margin-bottom:18px">Tracking</h3>${cancelled ? '<div class="form-msg err">This order was cancelled.</div>' : `<ol class="tl">${flow.map(([k, l], i) => `<li class="${i < idx || (i === idx && k === 'delivered') ? 'done' : i === idx ? 'cur' : ''}"><i></i><b>${l}</b><small>${at(k) ? fmtDate(at(k)) : i > idx ? 'Pending' : ''}</small></li>`).join('')}</ol>`}</div>
      <div><h3 style="margin-bottom:12px">Items</h3>${o.items.map((i) => `<div class="mini"><img src="${SH.src(i.image)}" alt=""><span><b>${esc(i.name)}</b><small>Qty ${i.qty}${i.custom ? ' · ' + SH.customSummary(i.custom).replace(/<br>/g, ' · ') : ''}</small></span><span>${money(i.price * i.qty)}</span></div>`).join('')}
        <hr class="stitch" style="margin:12px 0"><div class="sumrow"><span>Subtotal</span><span>${money(o.subtotal)}</span></div>${o.discount ? `<div class="sumrow"><span>Discount ${esc(o.coupon)}</span><span class="disc">− ${money(o.discount)}</span></div>` : ''}<div class="sumrow"><span>Shipping</span><span>${o.shipping ? money(o.shipping) : 'Free'}</span></div><div class="sumrow total"><span>Total</span><span>${money(o.total)}</span></div>
        <p class="muted" style="font-size:13.5px;margin-top:14px"><b>Ship to:</b> ${esc(o.address.line1)}, ${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.pin)}<br><b>Payment:</b> ${esc(o.payment.method.toUpperCase())} — ${o.payment.status === 'cod-pending' ? 'pay on delivery' : 'demo, no payment taken'}</p></div></div>`;
    u ? shell('orders', body) : (root.innerHTML = `<div class="phead"><h1>Order <em>tracking</em></h1></div><div style="max-width:900px;margin:0 auto;padding-bottom:90px">${body}</div>`);
  }

  function main() {
    const r = route(), u = S.users.current();
    if (r.startsWith('order/')) return orderView(decodeURIComponent(r.slice(6)));
    if (!u) return authView(r);
    document.title = 'My Account — SHILPIKA';
    if (r === 'addresses') return addresses(); if (r === 'orders') return orders(); return profile();
  }
  window.addEventListener('hashchange', main);
  main();
})();
