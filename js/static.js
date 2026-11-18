(function () {
  const { $, esc, qs, toast, reveal } = SH, S = SH.store;
  const root = $('#root'), page = document.body.dataset.page, st = S.settings.get();
  const head = (eb, t, sub) => `<div class="phead"><p class="eyebrow" style="justify-content:center">${eb}</p><h1>${t}</h1>${sub ? `<p>${sub}</p>` : ''}</div>`;

  const POLICIES = {
    shipping: ['Shipping policy', `<p>We ship handmade pieces across India and to selected international destinations. Every order is prepared with care and packed to protect delicate materials such as shola and hand-painted surfaces.</p>
      <h2>Processing time</h2><p>Ready-to-ship items are dispatched within 1–2 working days. Personalised and made-to-order pieces (gachkouto, kulo, topor and others) need additional crafting time shown on each product page — usually 5–10 days.</p>
      <h2>Delivery estimates</h2><p>Within West Bengal: about 2–4 working days after dispatch. Rest of India: about 4–8 working days. International: about 7–14 working days. These are estimates and may vary with courier conditions.</p>
      <h2>Shipping charges</h2><p>Shipping within India is ₹${st.shippingFlat}, and free on orders above ₹${st.freeShippingMin.toLocaleString('en-IN')}. International shipping is a flat ₹${st.shippingIntl.toLocaleString('en-IN')}. Customs duties, if any, are the buyer’s responsibility.</p>
      <h2>Tracking</h2><p>You can follow your order from the <a class="link-u" href="account.html#orders">My orders</a> page.</p>`],
    returns: ['Return &amp; refund policy', `<p>We want you to love your piece. Because most Shilpika products are handmade and many are personalised, our policy is as follows.</p>
      <h2>Ready-to-ship items</h2><p>You may request a return within 7 days of delivery if the item is unused and in its original packaging. Return shipping costs are borne by the customer unless the item arrived damaged or incorrect.</p>
      <h2>Personalised &amp; made-to-order items</h2><p>These are made specifically for you and cannot be returned or exchanged, unless they arrive damaged or do not match the details you provided.</p>
      <h2>Damaged in transit</h2><p>Please photograph the parcel and item and contact us within 48 hours of delivery. We will repair, replace or refund.</p>
      <h2>Refunds</h2><p>Approved refunds are issued to the original payment method within 7–10 working days of us receiving the return. Cash-on-delivery refunds are made by bank transfer.</p>`],
    privacy: ['Privacy policy', `<p>This policy explains what information SHILPIKA collects and how it is used.</p>
      <h2>What we collect</h2><p>Details you give us to fulfil an order or answer an enquiry: name, email, phone number, delivery address and order contents.</p>
      <h2>How we use it</h2><p>To process and deliver orders, send order updates, provide support, and (only if you subscribe) send our newsletter. We do not sell your personal information.</p>
      <h2>Payments</h2><p>Card and UPI payments are processed by third-party payment providers. We do not store card numbers.</p>
      <h2>Your choices</h2><p>You can ask us to access, correct or delete your data, and unsubscribe from emails at any time by contacting ${esc(st.email)}.</p>
      <p class="muted"><b>Demo note:</b> In this demo, data you enter is stored only in your own browser.</p>`],
    terms: ['Terms &amp; conditions', `<p>By using this website and placing an order you agree to these terms.</p>
      <h2>Products</h2><p>Our products are handmade, so slight variations in colour, size and finish are natural and are part of their character. Photographs are indicative.</p>
      <h2>Pricing &amp; orders</h2><p>Prices are in Indian Rupees. We may cancel an order if an item is unavailable or a pricing error occurred, and will refund any payment received.</p>
      <h2>Personalisation</h2><p>You are responsible for the accuracy of names, dates and instructions you provide for personalised items.</p>
      <h2>Intellectual property</h2><p>Site content, designs and imagery belong to SHILPIKA and may not be reused without permission.</p>
      <h2>Governing law</h2><p>These terms are governed by the laws of India.</p>`]
  };

  if (page === 'policy') {
    const key = qs('p') in POLICIES ? qs('p') : 'shipping', [title, body] = POLICIES[key];
    document.title = title.replace(/&amp;/g, '&') + ' — SHILPIKA';
    root.innerHTML = `${head('Policies', title)}<div class="prose"><div class="notice">Template policy text for the demo store — review with your legal advisor and adjust to your real terms before launch.</div>
      <div class="search__chips" style="margin-bottom:30px">${Object.entries(POLICIES).map(([k, [t]]) => `<a class="chip ${k === key ? 'on' : ''}" href="policy.html?p=${k}">${t}</a>`).join('')}</div>${body}</div>`;
  }

  if (page === 'about') {
    root.innerHTML = `${head('Our story', 'Handmade with <em>Meaning.</em>', 'শিল্পিকা — the little artisan. A small studio keeping Bengali craft alive in modern homes.')}
      <div class="split reveal"><div class="split__img"><img src="${SH.art('art:kouto:sand:1:tree')}" alt="Hand-painted gachkouto" loading="lazy"></div>
        <div><p class="eyebrow">Where it begins</p><h2 style="margin-bottom:22px">A craft that <em>carries</em> a celebration</h2>
        <p>In a Bengali wedding, small handmade objects carry big meaning — the painted gachkouto, the kulo, the shola topor. Each one is a piece of folk art, made for a single day and remembered for decades.</p>
        <p>SHILPIKA was started to make those pieces easier to find, to personalise for each couple, and to bring the same craft to everyday living — in kantha, terracotta, brass and jute.</p>
        <p class="demo-tag">Sample copy — replace with the real SHILPIKA founder story.</p></div></div>
      <div class="values reveal"><div><h3>Made by hand</h3><p>Every piece is painted, cut or stitched by an artisan. Nothing is mass-produced.</p></div><div><h3>Made for you</h3><p>Names, dates and colours — we personalise so your piece is unmistakably yours.</p></div><div><h3>Made to last</h3><p>Natural materials, careful finishing, and designs meant to be kept.</p></div></div>`;
  }

  if (page === 'faq') {
    const F = [['How long does a personalised order take?', 'Made-to-order pieces usually take 5–10 days to craft, plus shipping. The exact lead time is shown on each product page. Ordering for a specific wedding date? Order at least 3–4 weeks ahead.'],
      ['Can I change the colours or add names?', 'Yes. On wedding products you’ll find fields for names, wedding date, colour preference and special instructions. For anything bespoke, contact us before ordering.'],
      ['Do you ship internationally?', `Yes. International shipping is a flat ₹${st.shippingIntl.toLocaleString('en-IN')} per order. Cash on delivery is available in India only.`],
      ['Which payment methods do you accept?', 'The checkout is designed for UPI, cards and netbanking via Razorpay, and Cash on Delivery. In this demo store no real payment is taken.'],
      ['Can I return a personalised item?', 'Personalised items can’t be returned unless they arrive damaged or incorrect. See the Returns & refund policy for details.'],
      ['How do I track my order?', 'Sign in and open My orders, or use the “Track an order” form with your order number and email.'],
      ['How should I care for my piece?', 'Keep handmade pieces dry, away from direct sunlight and moisture, and dust gently with a soft cloth. Care notes are on each product page.']];
    root.innerHTML = `${head('Help', 'Frequently asked <em>questions</em>')}<div class="faq">${F.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}<p style="margin-top:40px;text-align:center">Still have a question? <a class="link-u" href="contact.html">Contact us</a></p></div>`;
  }

  if (page === 'contact') {
    root.innerHTML = `${head('Contact', 'Let’s <em>talk</em>', 'Questions about an order, a custom wedding piece or a gift? Write to us.')}
      <div class="contact"><div><div class="notice">Demo contact details — replace with SHILPIKA’s real details.</div><dl><dt>Email</dt><dd>${esc(st.email)}</dd><dt>Phone / WhatsApp</dt><dd>${esc(st.phone)}</dd><dt>Studio</dt><dd>West Bengal, India</dd><dt>Hours</dt><dd>Mon–Sat, 10am–6pm IST</dd></dl></div>
      <form id="cf" novalidate><div id="cf-msg"></div><div class="row2"><div class="field"><label for="c-n">Name</label><input id="c-n" autocomplete="name"><span class="field__err">Please enter your name.</span></div><div class="field"><label for="c-e">Email</label><input id="c-e" type="email" autocomplete="email"><span class="field__err">Enter a valid email address.</span></div></div>
        <div class="field"><label for="c-t">Topic</label><select id="c-t"><option>Order enquiry</option><option>Custom wedding piece</option><option>Gifting</option><option>Wholesale</option><option>Other</option></select></div>
        <div class="field"><label for="c-m">Message</label><textarea id="c-m" rows="6"></textarea><span class="field__err">Please write a message.</span></div><button class="btn" type="submit">Send message</button></form></div>`;
    $('#cf').onsubmit = (e) => {
      e.preventDefault(); const chk = (id, ok) => { $('#' + id).closest('.field').classList.toggle('has-err', !ok); return ok; };
      const ok = [chk('c-n', $('#c-n').value.trim().length > 1), chk('c-e', /^\S+@\S+\.\S+$/.test($('#c-e').value)), chk('c-m', $('#c-m').value.trim().length > 4)];
      if (ok.includes(false)) return;
      S.misc.addMessage({ name: $('#c-n').value.trim(), email: $('#c-e').value.trim(), topic: $('#c-t').value, message: $('#c-m').value.trim() });
      $('#cf-msg').innerHTML = '<div class="form-msg ok">Thank you — your message was saved. (Demo: no email is sent until a backend is connected.)</div>'; e.target.reset();
    };
  }
  reveal();
})();
