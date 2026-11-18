/* SHILPIKA — generated product illustrations (placeholder photography)
 * Strings like "art:kulo:clay:1:mini" => kind : palette : view : option
 * Replace with real photos by putting normal image URLs in product.images.
 */
(function () {
  const SH = (window.SH = window.SH || {});
  const PAL = {
    sand:  { bg: '#ece1cf', bg2: '#dfcdb3', a: '#a8472f', b: '#f7f0e3', c: '#47382b', d: '#c79a45', w: '#b98f66' },
    clay:  { bg: '#ead7c5', bg2: '#d8bda4', a: '#b4623f', b: '#f6ecdf', c: '#4a3426', d: '#c98f4a', w: '#a9794f' },
    ivory: { bg: '#f2eadd', bg2: '#e4d8c3', a: '#9c4a34', b: '#fbf6ec', c: '#3e3328', d: '#c4983f', w: '#c09a70' },
    olive: { bg: '#dedac5', bg2: '#cbc6a8', a: '#6c7350', b: '#f6f1e4', c: '#3b3d2c', d: '#b78a43', w: '#9d7b55' },
    rose:  { bg: '#eed9ce', bg2: '#dfc1b2', a: '#a14a3c', b: '#fbf3ea', c: '#43302a', d: '#c9964a', w: '#b4886a' }
  };

  const f = (n) => Math.round(n * 10) / 10;
  const petals = (cx, cy, r, n, len, w, fill, stroke, rot) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + (rot || 0);
      s += `<ellipse cx="${cx}" cy="${cy - r}" rx="${w}" ry="${len}" transform="rotate(${a} ${cx} ${cy})" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="2"` : ''}/>`;
    }
    return s;
  };
  const alpona = (cx, cy, R, c1, c2) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${c1}" stroke-width="4"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R * 0.9}" fill="none" stroke="${c1}" stroke-width="2" stroke-dasharray="3 9"/>`;
    s += petals(cx, cy, R * 0.52, 12, R * 0.34, R * 0.1, 'none', c1);
    s += petals(cx, cy, R * 0.3, 8, R * 0.2, R * 0.08, c2, c1);
    for (let i = 0; i < 24; i++) {
      const a = (Math.PI * 2 * i) / 24;
      s += `<circle cx="${f(cx + Math.cos(a) * R * 0.78)}" cy="${f(cy + Math.sin(a) * R * 0.78)}" r="${R * 0.03}" fill="${c1}"/>`;
    }
    return s + `<circle cx="${cx}" cy="${cy}" r="${R * 0.1}" fill="${c1}"/>`;
  };
  const flower = (cx, cy, r, P) =>
    petals(cx, cy, r * 0.55, 8, r * 0.5, r * 0.28, '#fffdf7', '#d8cdb8', 0) + `<circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="${P.d}"/>`;

  const D = {
    topor(P, o) {
      let s = `<path d="M400 120 C420 290 560 470 620 650 L180 650 C240 470 380 290 400 120 Z" fill="#fbf7ee" stroke="#d6c8b0" stroke-width="3"/>`;
      for (let i = 0; i < 7; i++) {
        const y = 640 - i * 66, hw = 190 - i * 24, n = Math.max(3, 7 - i);
        s += `<path d="M${400 - hw} ${y} Q400 ${y - 36} ${400 + hw} ${y}" fill="none" stroke="#d6c8b0" stroke-width="3"/>`;
        for (let k = 0; k < n; k++) {
          const x = 400 - hw + (hw * 2 * (k + 0.5)) / n;
          s += `<ellipse cx="${f(x)}" cy="${y - 20 - Math.abs(x - 400) * 0.04}" rx="${f(hw / n * 0.62)}" ry="26" fill="#fffdf8" stroke="#d6c8b0" stroke-width="2.5"/>`;
        }
      }
      s += `<circle cx="400" cy="118" r="16" fill="#fffdf8" stroke="#d6c8b0" stroke-width="3"/><path d="M400 100 L400 62" stroke="#d6c8b0" stroke-width="4"/>${flower(400, 52, 40, P)}`;
      s += `<rect x="200" y="648" width="400" height="64" rx="12" fill="${P.a}"/>`;
      for (let x = 224; x < 590; x += 30) s += `<circle cx="${x}" cy="680" r="7" fill="${P.d}"/>`;
      if (o === 'zari') s += `<path d="M200 700 H600" stroke="${P.d}" stroke-width="4"/><path d="M200 660 H600" stroke="${P.d}" stroke-width="3" stroke-dasharray="6 6"/>`;
      return s;
    },
    kulo(P, o) {
      const k = o === 'mini' ? 0.62 : 1;
      let s = `<g transform="translate(400 520) scale(${k}) translate(-400 -520)">`;
      s += `<path d="M110 360 H690 A290 380 0 0 1 110 360 Z" fill="#d9b574" stroke="#8a6a3c" stroke-width="10" stroke-linejoin="round"/>`;
      for (let i = 0; i < 17; i++) s += `<path d="M${130 + i * 35} 362 Q${400 + (i - 8) * 14} 600 400 735" fill="none" stroke="#b78c4e" stroke-width="2" opacity=".55"/>`;
      s += `<path d="M150 395 H650 A250 335 0 0 1 150 395 Z" fill="${P.b}" opacity=".94"/>`;
      s += alpona(400, 540, 160, P.a, P.d);
      s += `<path d="M110 360 L690 360" stroke="#8a6a3c" stroke-width="16" stroke-linecap="round"/>`;
      s += '</g>';
      return s;
    },
    kouto(P, o) {
      let s = `<path d="M262 510 L262 680 Q262 720 302 720 L498 720 Q538 720 538 680 L538 510 Z" fill="${P.a}"/>`;
      s += `<rect x="262" y="575" width="276" height="70" fill="${P.b}"/>`;
      if (o === 'tree') {
        s += `<path d="M400 640 V590" stroke="${P.c}" stroke-width="5"/>`;
        [[400, 585, 22], [370, 600, 15], [430, 600, 15], [385, 575, 13], [415, 575, 13]].forEach(([x, y, r]) => (s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#6c7350"/>`));
        for (let x = 285; x < 360; x += 24) s += `<circle cx="${x}" cy="610" r="6" fill="${P.a}"/><circle cx="${x + 190}" cy="610" r="6" fill="${P.a}"/>`;
      } else s += petals(400, 610, 14, 8, 20, 7, P.a) + `<circle cx="400" cy="610" r="7" fill="${P.d}"/>`;
      s += `<path d="M254 510 C254 380 546 380 546 510 Z" fill="${P.a}" stroke="${P.c}" stroke-opacity=".25" stroke-width="3"/><path d="M290 480 C300 420 360 400 400 400" stroke="#fff" stroke-opacity=".25" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      s += `<ellipse cx="400" cy="510" rx="146" ry="14" fill="${P.d}"/><circle cx="400" cy="402" r="20" fill="${P.d}"/>`;
      return s;
    },
    dala(P) {
      let s = `<ellipse cx="400" cy="660" rx="270" ry="86" fill="#8a6a2e"/><ellipse cx="400" cy="640" rx="270" ry="86" fill="${P.d}"/><ellipse cx="400" cy="640" rx="232" ry="68" fill="${P.b}" stroke="#a37c2c" stroke-width="3"/>`;
      [[290, 640], [510, 640], [345, 668], [455, 668]].forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="${i % 2 ? 20 : 26}" fill="${i % 2 ? '#c46a3a' : '#d0a24b'}"/>`));
      s += petals(400, 610, 50, 8, 40, 14, '#f3b2a0', '#b84a3a');
      s += `<ellipse cx="400" cy="640" rx="40" ry="18" fill="${P.a}"/><path d="M400 585 C380 560 392 530 400 510 C408 530 420 560 400 585 Z" fill="#f2a13a"/><path d="M400 574 C392 562 397 548 400 540 C403 548 408 562 400 574 Z" fill="#fff2c4"/>`;
      s += `<path d="M205 610 Q400 470 595 610" fill="none" stroke="${P.a}" stroke-width="6"/>`;
      for (let i = 0; i < 9; i++) s += `<path d="M${200 + i * 18} 622 q8 -46 -4 -80" stroke="#d9b45f" stroke-width="5" fill="none" opacity=".9"/>`;
      return s;
    },
    cushion(P) {
      let s = `<g transform="rotate(-5 400 540)"><path d="M215 360 Q400 330 585 360 Q612 540 585 720 Q400 750 215 720 Q188 540 215 360 Z" fill="${P.b}" stroke="#d2c4a8" stroke-width="3"/>`;
      for (let r = 0; r < 9; r++) {
        const y = 392 + r * 40, col = r % 2 ? P.a : P.c;
        s += `<path d="M240 ${y} H560" stroke="${col}" stroke-width="5" stroke-dasharray="12 9" stroke-linecap="round" opacity=".8"/>`;
      }
      s += `<circle cx="400" cy="540" r="76" fill="${P.b}" stroke="${P.a}" stroke-width="4"/>` + petals(400, 540, 38, 8, 32, 11, P.a) + petals(400, 540, 18, 6, 14, 6, P.d) + `<circle cx="400" cy="540" r="7" fill="${P.c}"/></g>`;
      return s;
    },
    owl(P) {
      let s = `<ellipse cx="400" cy="730" rx="130" ry="18" fill="#0000001a"/>`;
      s += `<path d="M400 330 C560 330 590 520 560 660 C540 730 260 730 240 660 C210 520 240 330 400 330 Z" fill="${P.d}" stroke="#8a6a2e" stroke-width="5"/>`;
      for (let i = 0; i < 14; i++) s += `<path d="M${260 + i * 9} ${560 + i * 5} Q400 ${520 + i * 14} ${540 - i * 9} ${560 + i * 5}" fill="none" stroke="#8a6a2e" stroke-width="2.5" opacity=".6"/>`;
      s += `<path d="M300 380 L330 320 L370 360 M500 380 L470 320 L430 360" fill="${P.d}" stroke="#8a6a2e" stroke-width="5"/>`;
      s += `<circle cx="340" cy="450" r="58" fill="${P.b}" stroke="#8a6a2e" stroke-width="5"/><circle cx="460" cy="450" r="58" fill="${P.b}" stroke="#8a6a2e" stroke-width="5"/><circle cx="340" cy="450" r="24" fill="${P.c}"/><circle cx="460" cy="450" r="24" fill="${P.c}"/><circle cx="348" cy="442" r="7" fill="#fff"/><circle cx="468" cy="442" r="7" fill="#fff"/>`;
      s += `<path d="M385 490 L415 490 L400 530 Z" fill="${P.a}"/><path d="M300 560 Q340 620 400 600 Q460 620 500 560" fill="none" stroke="#8a6a2e" stroke-width="4"/><path d="M360 710 v18 M440 710 v18" stroke="#8a6a2e" stroke-width="10" stroke-linecap="round"/>`;
      return s;
    },
    diya(P) {
      const one = (x, y, k) =>
        `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-110 0 Q-110 80 0 86 Q110 80 110 0 Q60 20 0 20 Q-60 20 -110 0 Z" fill="${P.a}"/><path d="M-110 0 Q0 -26 110 0 Q60 20 0 20 Q-60 20 -110 0 Z" fill="#c97c50"/><ellipse cx="0" cy="2" rx="62" ry="10" fill="#6b3a24"/><path d="M0 -6 C-22 -40 -8 -78 0 -100 C8 -78 22 -40 0 -6 Z" fill="#f4a63a"/><path d="M0 -10 C-9 -28 -3 -50 0 -62 C3 -50 9 -28 0 -10 Z" fill="#fff0bd"/></g>`;
      return one(400, 480, 1.1) + one(250, 650, 0.9) + one(550, 650, 0.9);
    },
    frame(P) {
      let s = `<rect x="205" y="320" width="390" height="470" fill="${P.w}" stroke="#7a5a3a" stroke-width="4"/><rect x="236" y="351" width="328" height="408" fill="${P.b}" stroke="#7a5a3a" stroke-width="3"/>`;
      [[330, 450, 50], [470, 430, 44], [400, 540, 64], [320, 620, 42], [480, 625, 52], [400, 690, 36]].forEach(([x, y, r]) => (s += flower(x, y, r, P)));
      [[270, 540, -30], [530, 520, 30], [275, 690, 20], [530, 700, -20], [400, 420, 0]].forEach(([x, y, a]) => (s += `<ellipse cx="${x}" cy="${y}" rx="14" ry="42" transform="rotate(${a} ${x} ${y})" fill="${P.a}" opacity=".85"/>`));
      return s;
    },
    plate(P) {
      return `<circle cx="400" cy="555" r="250" fill="#00000012"/><circle cx="400" cy="540" r="250" fill="${P.a}"/><circle cx="400" cy="540" r="228" fill="${P.b}"/>` + alpona(400, 540, 205, P.a, P.d);
    },
    hanging(P) {
      let s = `<rect x="200" y="300" width="400" height="22" rx="8" fill="${P.w}"/><path d="M220 300 q-20 -50 0 -90 M580 300 q20 -50 0 -90" stroke="#8a6a3c" stroke-width="5" fill="none"/>`;
      for (let i = 0; i < 24; i++) {
        const x = 216 + i * 16.3, len = 250 + Math.abs(Math.sin(i * 0.5)) * 110 + (Math.abs(i - 12) * -6 + 70);
        s += `<path d="M${x} 322 q4 ${len / 2} -2 ${len}" stroke="#c9a56b" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      }
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4 - r; c++) s += `<path d="M${280 + c * 80 + r * 40} ${350 + r * 70} l36 36 l-36 36 l-36 -36 Z" fill="none" stroke="#f3e5c8" stroke-width="5"/>`;
      return s;
    },
    giftbox(P) {
      let s = `<rect x="240" y="500" width="320" height="230" fill="${P.a}"/><rect x="224" y="450" width="352" height="74" fill="#8d3b29"/><rect x="383" y="450" width="34" height="280" fill="${P.d}"/>`;
      s += `<path d="M400 450 C340 380 290 420 330 450 Z M400 450 C460 380 510 420 470 450 Z" fill="${P.d}" stroke="#a37c2c" stroke-width="3"/><circle cx="400" cy="448" r="16" fill="#a37c2c"/>`;
      s += petals(310, 610, 26, 8, 22, 8, P.b) + petals(490, 610, 26, 8, 22, 8, P.b) + `<circle cx="310" cy="610" r="7" fill="${P.d}"/><circle cx="490" cy="610" r="7" fill="${P.d}"/>`;
      s += `<g transform="rotate(10 560 520)"><rect x="520" y="510" width="80" height="54" rx="4" fill="${P.b}" stroke="${P.d}" stroke-width="3"/><text x="560" y="548" text-anchor="middle" font-size="34" fill="${P.a}" font-family="'Noto Serif Bengali',serif">শি</text></g>`;
      return s;
    },
    bookmark(P) {
      const bm = (x, rot, col, i) => {
        let s = `<g transform="rotate(${rot} ${x + 55} 540)"><rect x="${x}" y="330" width="110" height="400" rx="6" fill="${col}" stroke="#00000018" stroke-width="2"/><circle cx="${x + 55}" cy="362" r="9" fill="${P.bg}"/>`;
        if (i % 2 === 0) s += `<ellipse cx="${x + 55}" cy="520" rx="34" ry="18" fill="${P.b}"/><path d="M${x + 85} 520 l24 -20 v40 Z" fill="${P.b}"/><circle cx="${x + 38}" cy="515" r="4" fill="${P.c}"/>`;
        else s += petals(x + 55, 520, 22, 8, 22, 9, P.b);
        for (let y = 600; y < 700; y += 24) s += `<path d="M${x + 12} ${y} H${x + 98}" stroke="${P.b}" stroke-width="3" stroke-dasharray="4 7"/>`;
        return s + `<path d="M${x + 55} 730 v50" stroke="${P.d}" stroke-width="5"/><path d="M${x + 45} 780 h20 l-4 36 h-12 Z" fill="${P.d}"/></g>`;
      };
      return bm(200, -6, P.a, 0) + bm(345, 2, '#6c7350', 1) + bm(490, 7, '#b8793f', 0);
    },
    plaque(P) {
      let s = `<path d="M330 400 V350 M470 400 V350" stroke="#8a6a3c" stroke-width="5"/><rect x="190" y="400" width="420" height="300" rx="12" fill="${P.w}" stroke="#7a5a3a" stroke-width="4"/><rect x="214" y="424" width="372" height="252" rx="6" fill="${P.b}" stroke="${P.a}" stroke-width="3"/>`;
      s += petals(400, 478, 14, 8, 18, 7, P.a) + `<circle cx="400" cy="478" r="6" fill="${P.d}"/>`;
      s += `<text x="400" y="580" text-anchor="middle" font-size="62" fill="${P.a}" font-family="'Noto Serif Bengali',serif" font-weight="600">শুভ বিবাহ</text><path d="M260 618 H540" stroke="${P.d}" stroke-width="3" stroke-dasharray="8 6"/><text x="400" y="652" text-anchor="middle" font-size="22" fill="${P.c}" letter-spacing="6" font-family="DM Sans,sans-serif">NAME  &amp;  NAME</text>`;
      return s;
    },
    pida(P) {
      let s = `<ellipse cx="400" cy="730" rx="240" ry="26" fill="#0000001a"/><rect x="230" y="640" width="46" height="90" fill="${P.a}"/><rect x="524" y="640" width="46" height="90" fill="${P.a}"/>`;
      s += `<path d="M300 440 H500 L600 560 H200 Z" fill="${P.w}"/><rect x="200" y="560" width="400" height="86" fill="${P.a}"/><path d="M200 560 H600" stroke="${P.d}" stroke-width="6"/>`;
      s += `<path d="M300 440 H500 L600 560 H200 Z" fill="${P.b}" stroke="${P.w}" stroke-width="6"/><g transform="translate(400 508) scale(1 .38)">${alpona(0, 0, 118, P.a, P.d)}</g>`;
      return s;
    }
  };

  function svg(kind, pal, view, opt) {
    const P = PAL[pal] || PAL.sand, draw = D[kind] || D.plate;
    const inner = draw(P, opt);
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">`;
    s += `<rect width="800" height="1000" fill="${view === 1 ? P.bg2 : P.bg}"/>`;
    if (view === 1) s += `<g opacity=".28">${alpona(400, 500, 330, P.a, P.d)}</g><circle cx="400" cy="500" r="318" fill="none" stroke="${P.b}" stroke-width="2" opacity=".6"/>`;
    if (view === 0) s += `<ellipse cx="400" cy="745" rx="270" ry="28" fill="#2a1d1220"/>`;
    const tf = view === 2 ? 'translate(400 520) scale(1.75) translate(-400 -560)' : view === 1 ? 'translate(400 500) scale(.86) translate(-400 -500)' : '';
    s += `<g ${tf ? `transform="${tf}"` : ''}>${inner}</g>`;
    if (view === 2) s += `<rect width="800" height="1000" fill="${P.bg}" opacity="0"/>`;
    return s + '</svg>';
  }

  const cache = {};
  SH.art = function (spec) {
    if (cache[spec]) return cache[spec];
    const [, kind, pal, view, opt] = spec.split(':');
    return (cache[spec] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(kind, pal, +view || 0, opt)));
  };
  SH.src = (s) => (typeof s === 'string' && s.indexOf('art:') === 0 ? SH.art(s) : s);
})();
