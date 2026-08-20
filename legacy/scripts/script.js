  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- collection data ----
  const pieces = [
    {n:'01', name:'Bespoke Caftan', mat:'Shadda · Hand embroidery', occ:'Made to measure', img:'./images/476025.jpg'},
    {n:'02', name:'Bespoke Agbada', mat:'Brocade · Gold thread', occ:'Ceremonial · Made to measure', img:'./images/476031.jpg'},
    {n:'03', name:'Ready-to-Wear Caftan', mat:'Cotton blend', occ:'Ready to wear', img:'./images/476034.jpg'},
    {n:'04', name:'Vest', mat:'Structured cotton', occ:'Ready to wear', img:'./images/476040.jpg'},
    {n:'05', name:'Trousers', mat:'Tapered fit', occ:'Ready to wear · Bespoke', img:'./images/476043.jpg'},
    {n:'06', name:'Shadda', mat:'Traditional weave', occ:'Sold by the yard', img:'./images/476046.jpg'},
    {n:'07', name:'Yards &amp; Brocade', mat:'Guinea brocade · Atiku', occ:'Sold by the yard', img:'./images/476049.jpg'},
    {n:'08', name:'Shoes', mat:'Leather loafers', occ:'Ready to wear', img:'./images/476058.jpg'},
    {n:'09', name:'Watches', mat:'Classic &amp; contemporary', occ:'Accessory', img:'./images/476061.jpg'},
    {n:'10', name:'Wristbands', mat:'Beaded &amp; leather', occ:'Accessory', img:'./images/476064.jpg'},
    {n:'11', name:'Perfumes', mat:'Oils &amp; sprays', occ:'Fragrance', img:'./images/476072.jpg'},
    {n:'12', name:'Caps', mat:'Hand embroidered', occ:'Accessory', img:'./images/476079.jpg'}
  ];
  const row = document.getElementById('marqueeRow');
  function renderPieces(){
    let html = '';
    [...pieces, ...pieces].forEach(p => {
      html += `<article class="piece-card">
        <div class="photo-frame"><div class="pf-content"><img src="${p.img}" alt="${p.name}" loading="lazy"></div></div>
        <div class="piece-meta">
          <span class="num">№ ${p.n}</span>
          <h3>${p.name}</h3>
          <p class="mat">${p.mat}</p>
          <p class="occ">${p.occ}</p>
        </div>
      </article>`;
    });
    row.innerHTML = html;
  }
  renderPieces();

  // ---- nav scroll state ----
  const nav = document.getElementById('siteNav');
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    backTop.classList.toggle('show', window.scrollY > 700);
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const menuIcon = document.getElementById('menuIcon');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    menuIcon.innerHTML = open ? '<use href="#ic-close"/>' : '<use href="#ic-menu"/>';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    menuIcon.innerHTML = '<use href="#ic-menu"/>';
  }));

  backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, {threshold:.12});
  revealEls.forEach(el => io.observe(el));

  const form = document.getElementById('bespokeForm');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Thank you — your enquiry has been noted. We will reach out shortly.';
    form.reset();
  });
