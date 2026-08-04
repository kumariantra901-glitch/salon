// ---- active location comes from the URL (?loc=elm) so it carries across pages ----
function getActiveLocId(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get('loc');
  return LOCATIONS.some(l => l.id === id) ? id : LOCATIONS[0].id;
}

function switcherHref(id){
  const url = new URL(window.location.href);
  url.searchParams.set('loc', id);
  return url.pathname + url.search;
}

// Renders every element with class="switcher" on the page as a row of seals
function buildSwitchers(){
  const activeId = getActiveLocId();
  document.querySelectorAll('.switcher').forEach(el => {
    el.innerHTML = '';
    LOCATIONS.forEach(loc => {
      const seal = document.createElement('a');
      seal.className = 'seal' + (loc.id === activeId ? ' active' : '');
      seal.href = switcherHref(loc.id);
      seal.innerHTML = `<span class="seal-city">${loc.city}</span><span class="seal-dot"></span>`;
      el.appendChild(seal);
    });
  });
}

// Fills in the hero photo on index.html to match the active studio
function renderHeroPhoto(){
  const img = document.getElementById('heroPhoto');
  if (!img) return;
  const loc = LOCATIONS.find(l => l.id === getActiveLocId());
  img.src = loc.img;
  img.alt = loc.name;
}

// Fills in location-detail fields if present on the page (locations.html)
function renderLocationDetail(){
  const el = document.getElementById('locName');
  if (!el) return;
  const loc = LOCATIONS.find(l => l.id === getActiveLocId());

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  const img = document.getElementById('locImg');
  if (img) img.src = loc.img;

  setText('locName', loc.name);
  setText('locAddr', loc.addr);
  setText('locHours', loc.hours);
  setText('locChairs', loc.chairs);
  setText('locParking', loc.parking);
  setText('locYear', loc.year);
  setText('locDesc', loc.desc);

  const bookLink = document.getElementById('locBookLink');
  if (bookLink) bookLink.href = switcherHref(loc.id).replace(/^.*\/(locations\.html)?/, 'book.html?loc=' + loc.id);
}

// Fills in the stylist grid if present (stylists.html)
function renderStylists(){
  const grid = document.getElementById('stylistGrid');
  if (!grid) return;
  const loc = LOCATIONS.find(l => l.id === getActiveLocId());
  const heading = document.getElementById('stylistHeading');
  if (heading) heading.textContent = `Who's at ${loc.city}.`;
  grid.innerHTML = '';
  loc.stylists.forEach(s => {
    const card = document.createElement('div');
    card.className = 'stylist-card';
    card.innerHTML = `
      <div class="stylist-photo"><img src="${s.img}" alt="${s.name}"></div>
      <h4>${s.name}</h4>
      <div class="role">${s.role}</div>`;
    grid.appendChild(card);
  });
}

// Fills in the testimonial block if present (index.html)
function renderTestimonial(){
  const q = document.getElementById('tQuote');
  if (!q) return;
  const activeId = getActiveLocId();
  const loc = LOCATIONS.find(l => l.id === activeId);
  q.textContent = `"${loc.quote}"`;
  document.getElementById('tName').textContent = loc.client;
  document.getElementById('tLoc').textContent = loc.city;
  const dots = document.getElementById('tDots');
  dots.innerHTML = '';
  LOCATIONS.forEach(l => {
    const d = document.createElement('a');
    d.href = switcherHref(l.id) + '#testimonial';
    d.className = l.id === activeId ? 'active' : '';
    dots.appendChild(d);
  });
}

// Populates a <select id="bookLocationSelect"> if present (book.html)
function renderBookingForm(){
  const select = document.getElementById('bookLocationSelect');
  if (!select) return;
  const activeId = getActiveLocId();
  select.innerHTML = '';
  LOCATIONS.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = l.city;
    if (l.id === activeId) opt.selected = true;
    select.appendChild(opt);
  });
}

function highlightCurrentNav(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('?')[0];
    if (href === path) a.classList.add('current');
  });
}

function setupRevealObserver(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, {threshold: 0.15});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupMobileMenu(){
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const isOpen = links.style.display === 'flex';
    links.style.display = isOpen ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '64px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'var(--bg)';
    links.style.padding = '24px 32px';
    links.style.borderBottom = '1px solid var(--line)';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildSwitchers();
  renderHeroPhoto();
  renderLocationDetail();
  renderStylists();
  renderTestimonial();
  renderBookingForm();
  highlightCurrentNav();
  setupRevealObserver();
  setupMobileMenu();
});
