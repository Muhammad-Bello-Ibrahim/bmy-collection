
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============ CONFIG ============ */
  // TODO: replace with the real business WhatsApp number, digits only, country code first.
  const WHATSAPP_NUMBER = '234XXXXXXXXXX';

  /* ============ PRODUCT DATA (sample pricing — replace with real figures) ============ */
  const PRODUCTS = [
    {id:'p01', name:'Bespoke Caftan', cat:'bespoke', tag:'Bespoke', price:null, mat:'Shadda or brocade · hand embroidery', desc:'A one-of-one caftan cut to your measurements. Choose your fabric, embroidery pattern and finish at consultation.', img:'./images/476025.jpg'},
    {id:'p02', name:'Bespoke Agbada', cat:'bespoke', tag:'Bespoke', price:null, mat:'Brocade · gold thread embroidery', desc:'Full three-piece ceremonial agbada, tailored for weddings, Sallah and formal occasions.', img:'./images/476031.jpg'},
    {id:'p03', name:'Ready-to-Wear Caftan — Indigo', cat:'rtw', tag:'Ready to Wear', price:35000, mat:'Cotton blend, pre-finished', desc:'A pre-finished caftan in deep indigo, ready to take home today. True to size, available S–XXL.', img:'./images/476034.jpg'},
    {id:'p04', name:'Ready-to-Wear Caftan — Ivory', cat:'rtw', tag:'Ready to Wear', price:35000, mat:'Cotton blend, pre-finished', desc:'The same silhouette in ivory — a versatile piece for daytime and formal wear alike.', img:'./images/476037.jpg'},
    {id:'p05', name:'Tailored Vest', cat:'rtw', tag:'Ready to Wear', price:18000, mat:'Structured cotton', desc:'A structured waistcoat to layer over a caftan or shirt. Available in charcoal and navy.', img:'./images/476040.jpg'},
    {id:'p06', name:'Tapered Trousers', cat:'rtw', tag:'Ready to Wear', price:22000, mat:'Cotton twill, tapered fit', desc:'Classic tapered trousers, made in-house. Can also be tailored to your exact measurements.', img:'./images/476043.jpg'},
    {id:'p07', name:'Shadda Fabric', cat:'fabric', tag:'Fabric · Per Yard', price:12000, mat:'Traditional shadda weave', desc:'Premium traditional shadda cloth, sold by the yard for your own tailoring project.', img:'./images/476046.jpg'},
    {id:'p08', name:'Guinea Brocade', cat:'fabric', tag:'Fabric · Per Yard', price:15000, mat:'Guinea brocade', desc:'Rich brocade yardage, popular for agbada and formal caftans.', img:'./images/476049.jpg'},
    {id:'p09', name:'Atiku Fabric', cat:'fabric', tag:'Fabric · Per Yard', price:13000, mat:'Atiku weave', desc:'A lighter-weight yard fabric, well suited to daily-wear caftans.', img:'./images/476052.jpg'},
    {id:'p10', name:'Leather Loafers', cat:'accessory', tag:'Footwear', price:40000, mat:'Genuine leather', desc:'Hand-finished leather loafers to complete a caftan or agbada look.', img:'./images/476058.jpg'},
    {id:'p11', name:'Classic Watch', cat:'accessory', tag:'Watch', price:55000, mat:'Stainless steel, leather strap', desc:'A timeless finishing piece for any outfit, formal or casual.', img:'./images/476061.jpg'},
    {id:'p12', name:'Beaded Wristband', cat:'accessory', tag:'Wristband', price:8000, mat:'Natural beads', desc:'Worn solo or stacked with a watch — a subtle traditional accent.', img:'./images/476064.jpg'},
    {id:'p13', name:'Leather Wristband', cat:'accessory', tag:'Wristband', price:9500, mat:'Genuine leather', desc:'A minimal leather cuff, easy to pair with any watch.', img:'./images/476067.jpg'},
    {id:'p14', name:'Perfume Oil', cat:'accessory', tag:'Fragrance', price:12000, mat:'Concentrated oil, 6ml', desc:'A long-lasting oil-based fragrance, alcohol-free.', img:'./images/476072.jpg'},
    {id:'p15', name:'Perfume Spray', cat:'accessory', tag:'Fragrance', price:18000, mat:'Eau de parfum, 50ml', desc:'A daily-wear spray fragrance, curated for the modern gentleman.', img:'./images/476075.jpg'},
    {id:'p16', name:'Embroidered Cap — Black', cat:'accessory', tag:'Cap', price:10000, mat:'Hand embroidered cotton', desc:'A traditional embroidered cap, finished by hand.', img:'./images/476079.jpg'},
    {id:'p17', name:'Embroidered Cap — Green', cat:'accessory', tag:'Cap', price:10000, mat:'Hand embroidered cotton', desc:'The same cap in a rich forest green, embroidered to order.', img:'./images/476082.jpg'},
    {id:'p18', name:'Group &amp; Aṣọ-ẹbí Package', cat:'group', tag:'Group Order', price:null, mat:'Coordinated fabric, quoted by group', desc:'One fabric, unified across grooms, groomsmen and family — quoted per group size and fabric choice.', img:'./images/476085.jpg'}
  ];

  const fmt = n => n == null ? 'Price on Request' : '₦' + n.toLocaleString('en-NG');

  /* ============ STATE ============ */
  let activeCat = 'all';
  let searchTerm = '';
  let sortMode = 'default';
  const wishlist = new Set();
  const cart = {}; // id -> qty

  /* ============ RENDER GRID ============ */
  const grid = document.getElementById('productGrid');
  const resultCount = document.getElementById('resultCount');

  function getFiltered(){
    let list = PRODUCTS.filter(p => (activeCat === 'all' || p.cat === activeCat)
      && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortMode === 'price-asc') list = [...list].sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sortMode === 'price-desc') list = [...list].sort((a,b) => (b.price ?? -1) - (a.price ?? -1));
    if (sortMode === 'name-asc') list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }

  function renderGrid(){
    const list = getFiltered();
    resultCount.textContent = `${list.length} piece${list.length !== 1 ? 's' : ''}`;
    grid.innerHTML = list.map(p => `
      <article class="product-card">
        <div class="p-media" data-open="${p.id}">
          <span class="p-tag">${p.tag}</span>
          <button class="p-wish ${wishlist.has(p.id) ? 'active' : ''}" data-wish="${p.id}" aria-label="Toggle wishlist">
            <svg><use href="#ic-heart"/></svg>
          </button>
          <div class="pf-content"><img class="pf-img" src="${p.img}" alt="${p.name}" loading="lazy"></div>
          <span class="p-quick">Quick View</span>
        </div>
        <div class="p-body">
          <h3 class="p-name" data-open="${p.id}">${p.name}</h3>
          <p class="p-mat">${p.mat}</p>
          <div class="p-price-row">
            <span class="p-price ${p.price == null ? 'poa' : ''}">${fmt(p.price)}</span>
          </div>
          ${p.price == null
            ? `<a href="index.html#contact" class="btn btn-line btn-full">Enquire</a>`
            : `<button class="btn btn-solid btn-full" data-add="${p.id}">Add to Bag</button>`}
        </div>
      </article>
    `).join('');
  }
  renderGrid();

  /* ============ FILTER / SEARCH / SORT ============ */
  document.getElementById('chipRow').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeCat = chip.dataset.cat;
    renderGrid();
  });
  document.getElementById('searchInput').addEventListener('input', e => {
    searchTerm = e.target.value;
    renderGrid();
  });
  document.getElementById('sortSelect').addEventListener('change', e => {
    sortMode = e.target.value;
    renderGrid();
  });

  /* ============ WISHLIST + ADD TO CART + QUICK VIEW (delegated) ============ */
  grid.addEventListener('click', e => {
    const wishBtn = e.target.closest('[data-wish]');
    const addBtn = e.target.closest('[data-add]');
    const openTarget = e.target.closest('[data-open]');

    if (wishBtn) {
      const id = wishBtn.dataset.wish;
      wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
      wishBtn.classList.toggle('active');
      return;
    }
    if (addBtn) {
      addToCart(addBtn.dataset.add, 1);
      showToast('Added to bag');
      return;
    }
    if (openTarget) {
      openModal(openTarget.dataset.open);
    }
  });

  /* ============ CART LOGIC ============ */
  function addToCart(id, qty){
    cart[id] = (cart[id] || 0) + qty;
    renderCart();
  }
  function setQty(id, qty){
    if (qty <= 0) { delete cart[id]; } else { cart[id] = qty; }
    renderCart();
  }
  function removeFromCart(id){
    delete cart[id];
    renderCart();
  }
  function cartEntries(){
    return Object.entries(cart).map(([id, qty]) => ({...PRODUCTS.find(p => p.id === id), qty}));
  }
  function cartSubtotal(){
    return cartEntries().reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
  }
  function cartCountTotal(){
    return Object.values(cart).reduce((a,b) => a+b, 0);
  }

  const cartBody = document.getElementById('cartBody');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartCountEl = document.getElementById('cartCount');
  const waCheckout = document.getElementById('whatsappCheckout');

  function renderCart(){
    const entries = cartEntries();
    cartCountEl.textContent = cartCountTotal();
    cartSubtotalEl.textContent = fmt(cartSubtotal());

    if (entries.length === 0) {
      cartBody.innerHTML = '<p class="cart-empty">Your bag is empty. Browse the collection to add pieces.</p>';
    } else {
      cartBody.innerHTML = entries.map(item => `
        <div class="cart-item">
          <div class="ci-thumb"><img class="pf-img" src="${item.img}" alt="${item.name}"></div>
          <div class="ci-info">
            <span class="ci-name">${item.name}</span>
            <span class="ci-price">${fmt(item.price)}</span>
            <div class="ci-qty">
              <button data-dec="${item.id}"><svg width="10" height="10"><use href="#ic-minus"/></svg></button>
              <span>${item.qty}</span>
              <button data-inc="${item.id}"><svg width="10" height="10"><use href="#ic-plus"/></svg></button>
            </div>
          </div>
          <button class="ci-remove" data-remove="${item.id}"><svg><use href="#ic-trash"/></svg></button>
        </div>
      `).join('');
    }

    const message = buildOrderMessage(entries);
    waCheckout.href = entries.length
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
      : '#';
  }

  function buildOrderMessage(entries){
    if (!entries.length) return '';
    let msg = `Hello BMY Collection, I'd like to order:%0A`;
    entries.forEach(item => {
      msg += `- ${item.name} x${item.qty} — ${fmt(item.price)}%0A`;
    });
    msg += `%0ASubtotal: ${fmt(cartSubtotal())}`;
    return decodeURIComponent(msg).replace(/%0A/g, '\n');
  }

  cartBody.addEventListener('click', e => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    const rem = e.target.closest('[data-remove]');
    if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
    if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
    if (rem) removeFromCart(rem.dataset.remove);
  });

  document.getElementById('copyOrderBtn').addEventListener('click', () => {
    const entries = cartEntries();
    if (!entries.length) { showToast('Your bag is empty'); return; }
    const text = buildOrderMessage(entries);
    navigator.clipboard?.writeText(text).then(() => showToast('Order summary copied'));
  });

  /* ============ CART DRAWER OPEN/CLOSE ============ */
  const overlay = document.getElementById('overlay');
  const cartDrawer = document.getElementById('cartDrawer');
  function openCart(){ cartDrawer.classList.add('open'); overlay.classList.add('show'); }
  function closeCart(){ cartDrawer.classList.remove('open'); overlay.classList.remove('show'); }
  document.getElementById('cartOpenBtn').addEventListener('click', openCart);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
  overlay.addEventListener('click', () => { closeCart(); closeModal(); });

  /* ============ QUICK VIEW MODAL ============ */
  const modal = document.getElementById('quickModal');
  const modalCard = document.getElementById('modalCard');
  let modalQty = 1;

  function openModal(id){
    const p = PRODUCTS.find(x => x.id === id);
    modalQty = 1;
    modalCard.innerHTML = `
      <div class="modal-media">
        <button class="modal-close" id="modalCloseBtn"><svg><use href="#ic-close"/></svg></button>
        <img class="pf-img" src="${p.img}" alt="${p.name}">
      </div>
      <div class="modal-body">
        <span class="modal-tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p class="modal-price">${fmt(p.price)}</p>
        <p class="modal-desc">${p.desc}<br><br><em style="color:var(--ivory-50);font-size:.85rem;">${p.mat}</em></p>
        ${p.price == null
          ? `<a href="index.html#contact" class="btn btn-solid btn-full">Enquire About This Piece</a>`
          : `<div class="modal-row">
               <div class="qty-stepper">
                 <button id="modalDec"><svg width="11" height="11"><use href="#ic-minus"/></svg></button>
                 <span id="modalQtyVal">1</span>
                 <button id="modalInc"><svg width="11" height="11"><use href="#ic-plus"/></svg></button>
               </div>
             </div>
             <button class="btn btn-solid btn-full" id="modalAddBtn">Add to Bag</button>`}
      </div>
    `;
    modal.classList.add('show');
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    const decBtn = document.getElementById('modalDec');
    const incBtn = document.getElementById('modalInc');
    const addBtn = document.getElementById('modalAddBtn');
    if (decBtn) decBtn.addEventListener('click', () => { modalQty = Math.max(1, modalQty-1); document.getElementById('modalQtyVal').textContent = modalQty; });
    if (incBtn) incBtn.addEventListener('click', () => { modalQty += 1; document.getElementById('modalQtyVal').textContent = modalQty; });
    if (addBtn) addBtn.addEventListener('click', () => { addToCart(p.id, modalQty); showToast('Added to bag'); closeModal(); });
  }
  function closeModal(){ modal.classList.remove('show'); }
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  /* ============ TOAST ============ */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ============ REVEAL ============ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  renderCart();
