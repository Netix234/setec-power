(() => {
  const root = document.querySelector('#product');
  if (!root || !window.PRODUCTS) return;
  const { fmt, esc, art, uri } = window.ProductUtil;
  const list = window.PRODUCTS;
  const id = new URLSearchParams(location.search).get('id');
  const i = list.findIndex(p => p.id === id);
  const p = list[i];

  if (!p) {
    root.innerHTML = '<div class="pp-missing"><h1>Товар не знайдено</h1><p>Можливо, посилання застаріло.</p><a class="pill pill-solid" href="catalog.html">Перейти до каталогу</a></div>';
    return;
  }
  document.title = p.name + ' — SETEC POWER';
  const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
  const opt = p.options ? `<label class="pp-field">${esc(p.options.label)}<select id="ppOption">${p.options.values.map(v => `<option>${esc(v)}</option>`).join('')}</select></label>` : '';

  root.innerHTML = `
    <div class="pp-crumbs"><div><a href="index.html">Головна</a> / <a href="catalog.html">Каталог</a> / <span>${esc(p.categoryLabel)}</span> / <span>${esc(p.name)}</span></div>
      <div><a href="product.html?id=${prev.id}">‹ Назад</a><i>|</i><a href="product.html?id=${next.id}">Далі ›</a></div></div>
    <div class="pp-grid">
      <div class="pp-media"><div class="pp-image">${art(p)}</div></div>
      <div class="pp-info">
        <h1>${esc(p.name)}</h1>
        <div class="pp-price ${p.price == null ? 'ask' : ''}">${fmt(p)}</div>
        ${opt}
        <div class="pp-field">Кількість
          <div class="pp-qty"><button type="button" data-q="-1" aria-label="Менше">−</button><input id="ppQty" type="number" min="1" value="1" aria-label="Кількість"><button type="button" data-q="1" aria-label="Більше">+</button></div>
        </div>
        <button class="pp-order" id="ppOrder" type="button">Замовити</button>
        <details class="pp-acc" open><summary>Опис</summary><p>${esc(p.desc)}</p></details>
        <details class="pp-acc"><summary>Доставка та оплата</summary><p>Спосіб і строки доставки узгоджуються індивідуально. Докладніше — на сторінці <a href="delivery.html">«Доставка та оплата»</a>.</p></details>
      </div>
    </div>
    <div class="pp-specs"><h2>Характеристики</h2><dl>${p.specs.map(s => `<div><dt>${esc(s[0])}</dt><dd>${esc(s[1])}</dd></div>`).join('')}</dl></div>`;

  const qty = root.querySelector('#ppQty');
  const clamp = () => { qty.value = Math.max(1, parseInt(qty.value, 10) || 1); };
  root.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => { qty.value = (parseInt(qty.value, 10) || 1) + Number(b.dataset.q); clamp(); }));
  qty.addEventListener('change', clamp);

  root.querySelector('#ppOrder').addEventListener('click', () => {
    clamp();
    const sel = root.querySelector('#ppOption');
    const label = sel ? ` (${p.options.label}: ${sel.value})` : '';
    window.SolarCart.add({ id: p.id + (sel ? '|' + sel.value : ''), name: p.name + label, category: p.categoryLabel, image: uri(p), price: p.price }, parseInt(qty.value, 10));
    window.SolarCart.open();
  });
})();
