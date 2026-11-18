/* SHILPIKA — DEMO SEED DATA
 * ---------------------------------------------------------------
 * Everything in this file is SAMPLE content used to populate the
 * localStorage-backed demo store. Replace with real catalogue data
 * (or load it from your backend API) before launch.
 * Image strings beginning with "art:" are generated illustrations
 * (see art.js) — swap for real product photography.
 */
(function () {
  const SH = (window.SH = window.SH || {});

  const colours = ['Classic red & white', 'Ivory & gold', 'Terracotta & cream', 'Maroon & gold', 'Pastel pink & ivory'];

  const categories = [
    { id: 'gachkouto', name: 'Biyer Gachkouto', bn: 'বিয়ের গাছকৌটো', desc: 'Hand-painted keepsake boxes for the wedding rituals.', art: 'art:kouto:sand:1' },
    { id: 'kulo', name: 'Handmade Kulo', bn: 'কুলো', desc: 'Painted winnowing fans, alpona-decorated by hand.', art: 'art:kulo:clay:1' },
    { id: 'topor', name: 'Handmade Topor', bn: 'টোপর', desc: 'Shola-pith wedding crowns, crafted to order.', art: 'art:topor:rose:1' },
    { id: 'wedding-accessories', name: 'Wedding Accessories', bn: 'বিয়ের সামগ্রী', desc: 'Dala, pida, sindoor kouto and more.', art: 'art:dala:sand:1' },
    { id: 'handicrafts', name: 'Bengali Handicrafts', bn: 'হস্তশিল্প', desc: 'Kantha, dokra, shola and pattachitra.', art: 'art:owl:ivory:1' },
    { id: 'home-decor', name: 'Home Décor', bn: 'ঘর সাজানো', desc: 'Alpona, terracotta and jute for everyday living.', art: 'art:plate:olive:1' },
    { id: 'gifts', name: 'Gifts & Keepsakes', bn: 'উপহার', desc: 'Considered gifts with a Bengali heart.', art: 'art:giftbox:rose:1' }
  ];

  const P = (o) => Object.assign({ compare: 0, badge: '', customizable: false, tags: [], leadDays: 2, stock: 10, colours: colours }, o);

  const products = [
    P({ id: 'biyer-gachkouto-classic-pair', name: 'Biyer Gachkouto — Classic Pair', bn: 'বিয়ের গাছকৌটো', category: 'gachkouto', price: 1450, compare: 1650, stock: 14, sku: 'SH-GK-001', badge: 'Bestseller', tags: ['wedding', 'bestseller'], customizable: true, leadDays: 6,
      short: 'A hand-painted pair of keepsake boxes, finished in vermilion and ivory.',
      description: 'A matched pair of wooden keepsake boxes, painted by hand with a tree-of-life motif in the traditional Bengali wedding palette. Each pair is made to order, and we can paint the couple’s names and wedding date on the base. A piece to use for the ritual and keep for years.',
      details: { material: 'Seasoned wood, natural pigments, food-safe lacquer', dimensions: 'Each box ≈ 9 cm × 9 cm × 8 cm', weight: '≈ 320 g (pair)', care: 'Wipe with a dry cloth. Keep away from moisture.' },
      images: ['art:kouto:sand:0:tree', 'art:kouto:sand:1:tree', 'art:kouto:sand:2:tree'] }),
    P({ id: 'biyer-gachkouto-bridal-heirloom-set', name: 'Biyer Gachkouto — Bridal Heirloom Set', bn: 'গাছকৌটো সেট', category: 'gachkouto', price: 2850, compare: 3299, stock: 6, sku: 'SH-GK-002', badge: 'New', tags: ['wedding', 'new'], customizable: true, leadDays: 9,
      short: 'Our fullest gachkouto set with a lacquered presentation tray.',
      description: 'The heirloom edition: a pair of larger gachkouto boxes with gold detailing, set on a hand-finished presentation tray. Designed to be displayed after the wedding. Personalised with the couple’s names.',
      details: { material: 'Seasoned wood, natural pigments, gold-tone leaf', dimensions: 'Boxes ≈ 11 cm × 11 cm × 10 cm; tray ≈ 32 cm', weight: '≈ 780 g', care: 'Wipe with a dry cloth. Avoid direct sunlight.' },
      images: ['art:kouto:rose:1:tree', 'art:kouto:rose:0:tree', 'art:kouto:rose:2:tree'] }),
    P({ id: 'bridal-kulo-hand-painted', name: 'Bridal Kulo — Hand-painted', bn: 'বিয়ের কুলো', category: 'kulo', price: 1950, compare: 2399, stock: 8, sku: 'SH-KL-001', badge: 'Bestseller', tags: ['wedding', 'bestseller'], customizable: true, leadDays: 7,
      short: 'A woven kulo painted with alpona and lotus motifs.',
      description: 'A traditional woven kulo (winnowing fan), primed and painted by hand with an alpona-inspired lotus design. Made for wedding rituals and equally lovely as a wall piece. Colourways can be matched to your wedding palette.',
      details: { material: 'Woven cane and bamboo, acrylic & natural pigments', dimensions: '≈ 40 cm × 34 cm', weight: '≈ 450 g', care: 'Dust gently. Do not wash.' },
      images: ['art:kulo:clay:0', 'art:kulo:clay:1', 'art:kulo:clay:2'] }),
    P({ id: 'mini-kulo-favour-set-of-6', name: 'Mini Kulo Favours — Set of 6', bn: 'ছোট কুলো', category: 'kulo', price: 899, compare: 1099, stock: 25, sku: 'SH-KL-002', badge: 'New', tags: ['new', 'wedding'], customizable: true, leadDays: 5,
      short: 'Palm-sized painted kulo, for guest favours or table décor.',
      description: 'Six miniature kulo, each painted by hand. A charming return gift for wedding guests or a cluster for a festive table. Tie-on name tags are available on request.',
      details: { material: 'Cane, natural pigments', dimensions: 'Each ≈ 10 cm × 8 cm', weight: '≈ 180 g (set)', care: 'Dust gently.' },
      images: ['art:kulo:rose:0:mini', 'art:kulo:rose:1:mini', 'art:kulo:rose:2:mini'] }),
    P({ id: 'shola-topor-classic', name: 'Shola Topor — Classic', bn: 'শোলার টোপর', category: 'topor', price: 1650, compare: 1999, stock: 9, sku: 'SH-TP-001', badge: 'Bestseller', tags: ['wedding', 'bestseller'], customizable: true, leadDays: 8,
      short: 'A hand-cut shola-pith groom’s crown, built tier by tier.',
      description: 'Carved and assembled from shola (sponge-wood pith) by hand — every petal cut individually and set into rising tiers. Light enough to wear comfortably. Made to order, with the head size noted in your instructions.',
      details: { material: 'Shola pith, cotton thread, natural adhesive', dimensions: '≈ 30 cm tall; fits head circumference up to 58 cm', weight: '≈ 120 g', care: 'Handle with care; keep dry; store in the box provided.' },
      images: ['art:topor:rose:0', 'art:topor:rose:1', 'art:topor:rose:2'] }),
    P({ id: 'shola-topor-pearl-zari', name: 'Shola Topor — Pearl & Zari', bn: 'মুক্তো টোপর', category: 'topor', price: 2450, compare: 2750, stock: 4, sku: 'SH-TP-002', badge: 'Sale', tags: ['wedding'], customizable: true, leadDays: 10,
      short: 'Shola crown with pearl beading and zari trim.',
      description: 'A richer variation on the classic: shola tiers edged with pearl beading and zari. Designed for the groom who wants something extra for the photographs.',
      details: { material: 'Shola pith, faux pearls, zari thread', dimensions: '≈ 32 cm tall; fits up to 58 cm', weight: '≈ 150 g', care: 'Handle with care; keep dry.' },
      images: ['art:topor:sand:0:zari', 'art:topor:sand:1:zari', 'art:topor:sand:2:zari'] }),
    P({ id: 'sindoor-kouto-painted', name: 'Sindoor Kouto — Hand-painted', bn: 'সিঁদুর কৌটো', category: 'wedding-accessories', price: 650, compare: 799, stock: 30, sku: 'SH-WA-001', tags: ['wedding'], customizable: true, leadDays: 4,
      short: 'A small wooden vermilion box with a painted lid.',
      description: 'A compact wooden sindoor kouto with a domed lid, hand-painted in vermilion and ivory. Works as a ritual piece or a lovely small gift.',
      details: { material: 'Wood, natural pigments, lacquer', dimensions: '≈ 6 cm × 6 cm × 6 cm', weight: '≈ 90 g', care: 'Wipe with a dry cloth.' },
      images: ['art:kouto:clay:0', 'art:kouto:clay:1', 'art:kouto:clay:2'] }),
    P({ id: 'boron-dala-bridal-tray', name: 'Boron Dala — Bridal Welcome Tray', bn: 'বরণ ডালা', category: 'wedding-accessories', price: 1350, compare: 1599, stock: 12, sku: 'SH-WA-002', badge: 'New', tags: ['wedding', 'new'], customizable: true, leadDays: 5,
      short: 'A decorated brass-tone tray for the boron welcome ritual.',
      description: 'A boron dala arranged and finished for the welcome ritual, with space for the diya, sheaf and sweets. Supplied decorated; ritual items are not included.',
      details: { material: 'Brass-tone metal, cotton thread, dried grain sheaf', dimensions: '≈ 30 cm diameter', weight: '≈ 540 g', care: 'Polish gently with a soft cloth.' },
      images: ['art:dala:sand:0', 'art:dala:sand:1', 'art:dala:sand:2'] }),
    P({ id: 'alpona-pida-ritual-seat', name: 'Alpona Pida — Ritual Seat', bn: 'আলপনা পিঁড়ি', category: 'wedding-accessories', price: 980, compare: 1249, stock: 11, sku: 'SH-WA-003', tags: ['wedding'], customizable: true, leadDays: 5,
      short: 'A low wooden pida with a hand-painted alpona top.',
      description: 'A traditional low wooden seat (pida) with an alpona pattern painted in rice-paste white on a warm ground. Made for ceremonies, and equally at home as a plant stand.',
      details: { material: 'Mango wood, water-based pigments', dimensions: '≈ 30 cm × 30 cm × 12 cm', weight: '≈ 1.1 kg', care: 'Wipe with a dry cloth.' },
      images: ['art:pida:ivory:0', 'art:pida:ivory:1', 'art:pida:ivory:2'] }),
    P({ id: 'kantha-cushion-cover', name: 'Kantha Stitch Cushion Cover', bn: 'কাঁথা কুশন কভার', category: 'handicrafts', price: 1150, compare: 1399, stock: 18, sku: 'SH-HC-001', tags: ['new'], badge: 'New',
      short: 'Running-stitch kantha on cotton, 40 × 40 cm.',
      description: 'A cotton cushion cover worked in running stitches in the kantha tradition. Each cover is stitched by hand, so spacing and motifs differ slightly — that’s the point.',
      details: { material: '100% cotton, cotton thread', dimensions: '40 cm × 40 cm (insert not included)', weight: '≈ 140 g', care: 'Cold hand-wash separately; dry in shade.' },
      images: ['art:cushion:ivory:0', 'art:cushion:ivory:1', 'art:cushion:ivory:2'] }),
    P({ id: 'dokra-owl-figurine', name: 'Dokra Owl — Brass Figurine', bn: 'ডোকরা পেঁচা', category: 'handicrafts', price: 1250, compare: 1499, stock: 7, sku: 'SH-HC-002', tags: ['bestseller'], badge: 'Bestseller',
      short: 'Lost-wax cast brass owl with wire-like texture.',
      description: 'In the dokra (lost-wax) tradition, finished with the characteristic wire-textured surface. A small statement object for a shelf or desk.',
      details: { material: 'Brass (lost-wax cast)', dimensions: '≈ 12 cm tall', weight: '≈ 380 g', care: 'Wipe with a dry cloth; do not use harsh polish.' },
      images: ['art:owl:sand:0', 'art:owl:sand:1', 'art:owl:sand:2'] }),
    P({ id: 'shola-flower-wall-frame', name: 'Shola Flower Wall Frame', bn: 'শোলার ফুলের ফ্রেম', category: 'handicrafts', price: 1890, compare: 2299, stock: 5, sku: 'SH-HC-003', tags: ['new'],
      short: 'A framed bouquet of hand-carved shola blossoms.',
      description: 'Shola blossoms, cut and assembled by hand and mounted in a wooden frame. Delicate and luminous on a dark wall.',
      details: { material: 'Shola pith, wooden frame, linen backing', dimensions: '≈ 35 cm × 45 cm', weight: '≈ 600 g', care: 'Keep dry; dust with a soft brush.' },
      images: ['art:frame:olive:0', 'art:frame:olive:1', 'art:frame:olive:2'] }),
    P({ id: 'pattachitra-bookmark-set', name: 'Pattachitra-style Bookmarks — Set of 3', bn: 'পটচিত্র বুকমার্ক', category: 'gifts', price: 390, compare: 499, stock: 40, sku: 'SH-GF-003', tags: ['bestseller'],
      short: 'Three hand-painted bookmarks with fish and lotus motifs.',
      description: 'Three bookmarks painted in the scroll-painting spirit of Bengal’s patachitra. A small, genuinely useful gift.',
      details: { material: 'Handmade paper, natural pigments, cotton tassel', dimensions: 'Each ≈ 5 cm × 15 cm', weight: '≈ 30 g (set)', care: 'Keep dry.' },
      images: ['art:bookmark:ivory:0', 'art:bookmark:ivory:1', 'art:bookmark:ivory:2'] }),
    P({ id: 'alpona-terracotta-wall-plate', name: 'Alpona Terracotta Wall Plate', bn: 'আলপনা টেরাকোটা প্লেট', category: 'home-decor', price: 740, compare: 899, stock: 20, sku: 'SH-HD-001', tags: ['new'],
      short: 'A terracotta wall plate painted with a rice-paste alpona.',
      description: 'A round terracotta plate, hand-painted with a concentric alpona pattern. Hang alone or in a cluster.',
      details: { material: 'Terracotta, water-based pigments', dimensions: '≈ 22 cm diameter', weight: '≈ 420 g', care: 'Dust only.' },
      images: ['art:plate:olive:0', 'art:plate:olive:1', 'art:plate:olive:2'] }),
    P({ id: 'terracotta-diya-set-of-6', name: 'Terracotta Diya Set of 6', bn: 'মাটির প্রদীপ', category: 'home-decor', price: 520, compare: 649, stock: 35, sku: 'SH-HD-002', tags: ['bestseller'],
      short: 'Six hand-thrown clay diyas with a warm slip finish.',
      description: 'Six small diyas, thrown and fired by hand. Use them for festivals, or as little votives on any evening.',
      details: { material: 'Terracotta clay', dimensions: 'Each ≈ 6.5 cm diameter', weight: '≈ 360 g (set)', care: 'Hand-wash gently; dry thoroughly.' },
      images: ['art:diya:clay:0', 'art:diya:clay:1', 'art:diya:clay:2'] }),
    P({ id: 'jute-macrame-wall-hanging', name: 'Jute Macramé Wall Hanging', bn: 'পাটের ঝুলন', category: 'home-decor', price: 960, compare: 1199, stock: 3, sku: 'SH-HD-003', tags: [],
      short: 'Knotted jute fringe on a driftwood-toned bar.',
      description: 'Knotted from natural jute rope on a wooden bar. A tactile, quiet piece for a sunny wall.',
      details: { material: 'Jute, wood', dimensions: '≈ 40 cm wide × 60 cm long', weight: '≈ 260 g', care: 'Dust with a soft brush.' },
      images: ['art:hanging:sand:0', 'art:hanging:sand:1', 'art:hanging:sand:2'] }),
    P({ id: 'wedding-keepsake-gift-box', name: 'Wedding Keepsake Gift Box', bn: 'বিয়ের উপহার বাক্স', category: 'gifts', price: 1250, compare: 1599, stock: 15, sku: 'SH-GF-001', tags: ['wedding', 'new'], badge: 'New', customizable: true, leadDays: 4,
      short: 'A ribboned gift box with a hand-painted lid.',
      description: 'A rigid gift box with a hand-painted lid and a ribbon, ready to fill. Add a message in the instructions and we’ll tie it on a tag.',
      details: { material: 'Board, cotton ribbon, natural pigments', dimensions: '≈ 20 cm × 20 cm × 9 cm', weight: '≈ 300 g', care: 'Keep dry.' },
      images: ['art:giftbox:rose:0', 'art:giftbox:rose:1', 'art:giftbox:rose:2'] }),
    P({ id: 'name-keepsake-plaque', name: 'Shubho Bibaho Name Plaque', bn: 'শুভ বিবাহ ফলক', category: 'gifts', price: 780, compare: 999, stock: 22, sku: 'SH-GF-002', tags: ['wedding'], customizable: true, leadDays: 5,
      short: 'A painted wooden plaque, lettered with the couple’s names.',
      description: 'A small wooden plaque lettered in Bengali with “শুভ বিবাহ” and the couple’s names and date. A keepsake gift for newlyweds.',
      details: { material: 'Wood, acrylic paint', dimensions: '≈ 25 cm × 18 cm', weight: '≈ 280 g', care: 'Wipe with a dry cloth.' },
      images: ['art:plaque:ivory:0', 'art:plaque:ivory:1', 'art:plaque:ivory:2'] })
  ];

  const coupons = [
    { code: 'SHILPIKA10', type: 'percent', value: 10, min: 999, active: true, note: 'Demo: 10% off orders above ₹999' },
    { code: 'BIYE200', type: 'flat', value: 200, min: 1500, active: true, note: 'Demo: ₹200 off orders above ₹1,500' },
    { code: 'SET10', type: 'percent', value: 10, min: 0, active: true, note: 'Applied automatically to wedding packages' },
    { code: 'FREESHIP', type: 'freeship', value: 0, min: 0, active: true, note: 'Demo: free shipping' }
  ];

  const settings = {
    storeName: 'SHILPIKA', tagline: 'Handmade with Meaning.',
    email: 'hello@shilpika.example', phone: '+91 00000 00000',
    announcement: 'Free shipping across India on orders above ₹2,500|Use code SHILPIKA10 for 10% off orders above ₹999|Handmade to order · personalised for your wedding|Cash on Delivery available in India',
    whatsapp: '',
    freeShippingMin: 2500, shippingFlat: 90, shippingIntl: 1800, lowStock: 5,
    pay: { razorpay: true, upi: true, cod: true }, codMax: 5000
  };

  const reviews = {
    'shola-topor-classic': [
      { name: 'Sample reviewer', rating: 5, text: 'Sample review text for demo purposes — replace with genuine customer reviews.', demo: true },
      { name: 'Sample reviewer', rating: 4, text: 'Sample review text for demo purposes. This area will list real reviews once a backend is connected.', demo: true }
    ],
    'biyer-gachkouto-classic-pair': [
      { name: 'Sample reviewer', rating: 5, text: 'Sample review text for demo purposes — replace with genuine customer reviews.', demo: true }
    ]
  };

  // Demo orders (clearly flagged demo:true). Dates are relative to first run.
  function demoOrders() {
    const mk = (n, daysAgo, status, name, city, state, lines, pay) => {
      const items = lines.map(([id, qty]) => {
        const p = products.find((x) => x.id === id);
        return { productId: id, name: p.name, price: p.price, qty, image: p.images[0], custom: null };
      });
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shipping = subtotal >= settings.freeShippingMin ? 0 : settings.shippingFlat;
      const at = Date.now() - daysAgo * 864e5;
      const order = { id: 'SHP-' + n, createdAt: at, status, demo: true,
        customer: { name, email: name.toLowerCase().replace(/\s+/g, '.') + '@example.com', phone: '9000000000' },
        address: { line1: '12 Demo Street', line2: '', city, state, pin: '700001', country: 'India' },
        items, subtotal, discount: 0, coupon: '', shipping, total: subtotal + shipping,
        payment: { method: pay, status: pay === 'cod' ? 'cod-pending' : 'demo-no-payment' }, userId: null,
        timeline: [{ status: 'placed', at }] };
      const flow = ['placed', 'confirmed', 'crafting', 'shipped', 'delivered'];
      const upto = flow.indexOf(status);
      for (let i = 1; i <= upto; i++) order.timeline.push({ status: flow[i], at: at + i * 864e5 });
      return order;
    };
    return [
      mk(10021, 1, 'placed', 'Demo Customer A', 'Kolkata', 'West Bengal', [['shola-topor-classic', 1]], 'upi'),
      mk(10020, 3, 'crafting', 'Demo Customer B', 'Howrah', 'West Bengal', [['biyer-gachkouto-classic-pair', 1], ['sindoor-kouto-painted', 2]], 'razorpay'),
      mk(10019, 6, 'shipped', 'Demo Customer C', 'Mumbai', 'Maharashtra', [['bridal-kulo-hand-painted', 1]], 'cod'),
      mk(10018, 9, 'delivered', 'Demo Customer D', 'Bengaluru', 'Karnataka', [['dokra-owl-figurine', 1], ['pattachitra-bookmark-set', 2]], 'upi'),
      mk(10017, 12, 'delivered', 'Demo Customer E', 'Delhi', 'Delhi', [['boron-dala-bridal-tray', 1]], 'razorpay'),
      mk(10016, 15, 'cancelled', 'Demo Customer F', 'Pune', 'Maharashtra', [['kantha-cushion-cover', 2]], 'cod')
    ];
  }

  SH.seed = { categories, products, coupons, settings, reviews, demoOrders, colours };
})();
