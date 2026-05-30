/* ================================================
   BILLIARD 805 PARUNG — Main App JavaScript
   ================================================ */

'use strict';

// ==================== DATABASE (localStorage) ====================
const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem('b805_' + key)); } catch { return null; } },
  set(key, val) { try { localStorage.setItem('b805_' + key, JSON.stringify(val)); } catch {} },
  del(key) { localStorage.removeItem('b805_' + key); }
};

// ==================== DEFAULT DATA ====================
const DEFAULT_TABLES = [
  { id: 1, name: 'Meja 1', type: 'Standard', status: 'available', price: 25000, timer: null, bookedBy: null, fav: false },
  { id: 2, name: 'Meja 2', type: 'Standard', status: 'occupied', price: 25000, timer: 72, bookedBy: 'Reza A.', fav: false },
  { id: 3, name: 'Meja 3', type: 'Premium', status: 'available', price: 35000, timer: null, bookedBy: null, fav: false },
  { id: 4, name: 'Meja 4', type: 'Premium', status: 'booked', price: 35000, timer: null, bookedBy: 'Andi S.', fav: false },
  { id: 5, name: 'Meja 5', type: 'Standard', status: 'available', price: 25000, timer: null, bookedBy: null, fav: false },
  { id: 6, name: 'Meja 6', type: 'VIP Lounge', status: 'available', price: 50000, timer: null, bookedBy: null, fav: false },
  { id: 7, name: 'Meja 7', type: 'Standard', status: 'occupied', price: 25000, timer: 45, bookedBy: 'Bagas P.', fav: false },
  { id: 8, name: 'Meja 8', type: 'Premium', status: 'available', price: 35000, timer: null, bookedBy: null, fav: false },
  { id: 9, name: 'Meja 9', type: 'Standard', status: 'available', price: 25000, timer: null, bookedBy: null, fav: false },
  { id: 10, name: 'Meja 10', type: 'VIP Lounge', status: 'booked', price: 50000, timer: null, bookedBy: 'Farhan D.', fav: false },
  { id: 11, name: 'Meja 11', type: 'Standard', status: 'available', price: 25000, timer: null, bookedBy: null, fav: false },
  { id: 12, name: 'Meja 12', type: 'Premium', status: 'occupied', price: 35000, timer: 120, bookedBy: 'Kevin M.', fav: false },
];

const DEFAULT_MENU = [
  { id: 1, name: 'Es Teh Lemon Segar', cat: 'Minuman', price: 15000, emoji: '🍋', desc: 'Teh dengan lemon segar', badge: 'Best Seller' },
  { id: 2, name: 'Kopi Susu Signature', cat: 'Minuman', price: 22000, emoji: '☕', desc: 'Kopi susu dengan racikan sendiri', badge: '' },
  { id: 3, name: 'Thai Tea Ori', cat: 'Minuman', price: 18000, emoji: '🧋', desc: 'Thai tea otentik creamy', badge: '' },
  { id: 4, name: 'Matcha Latte', cat: 'Minuman', price: 25000, emoji: '🍵', desc: 'Matcha premium dengan susu', badge: 'New' },
  { id: 5, name: 'Juice Alpukat', cat: 'Minuman', price: 20000, emoji: '🥑', desc: 'Alpukat fresh blend susu', badge: '' },
  { id: 6, name: 'Es Jeruk Peras', cat: 'Minuman', price: 12000, emoji: '🍊', desc: 'Jeruk peras fresh', badge: '' },
  { id: 7, name: 'Nasi Goreng Spesial', cat: 'Makanan', price: 30000, emoji: '🍳', desc: 'Nasi goreng dengan telur + ayam', badge: 'Best Seller' },
  { id: 8, name: 'Mie Goreng Premium', cat: 'Makanan', price: 28000, emoji: '🍜', desc: 'Mie goreng dengan topping komplit', badge: '' },
  { id: 9, name: 'Ayam Goreng Crispy', cat: 'Makanan', price: 35000, emoji: '🍗', desc: 'Ayam crispy sambal spesial', badge: '' },
  { id: 10, name: 'Kentang Goreng', cat: 'Snack', price: 20000, emoji: '🍟', desc: 'Kentang goreng + saus mayo', badge: '' },
  { id: 11, name: 'Pisang Goreng Keju', cat: 'Snack', price: 18000, emoji: '🍌', desc: 'Pisang goreng coklat keju', badge: '' },
  { id: 12, name: 'Roti Bakar Nutella', cat: 'Snack', price: 22000, emoji: '🍞', desc: 'Roti bakar dengan nutella coklat', badge: 'Favorit' },
  { id: 13, name: 'Paket Hemat A', cat: 'Paket', price: 55000, emoji: '🎯', desc: 'Nasi goreng + Es teh + Main 1 Jam', badge: 'Bundling' },
  { id: 14, name: 'Paket VIP B', cat: 'Paket', price: 90000, emoji: '⭐', desc: 'Ayam crispy + 2 minuman + Main 2 Jam', badge: 'Bundling' },
];

const DEFAULT_GALLERY = [
  { id: 1, emoji: '🎱', label: 'Suasana Meja Billiard Premium', color: 'rgba(0,212,255,0.15)' },
  { id: 2, emoji: '💡', label: 'Pencahayaan Neon Eksklusif', color: 'rgba(180,0,255,0.15)' },
  { id: 3, emoji: '☕', label: 'Area Cafe Modern', color: 'rgba(0,255,204,0.1)' },
  { id: 4, emoji: '🏆', label: 'Momen Tournament Epik', color: 'rgba(255,215,0,0.1)' },
  { id: 5, emoji: '🌙', label: 'Nuansa Malam Premium', color: 'rgba(57,255,20,0.08)' },
  { id: 6, emoji: '👥', label: 'Komunitas Billiard 805', color: 'rgba(0,212,255,0.1)' },
  { id: 7, emoji: '🎮', label: 'Gaming Zone Eksklusif', color: 'rgba(180,0,255,0.1)' },
  { id: 8, emoji: '🥂', label: 'Lounge VIP Area', color: 'rgba(255,215,0,0.08)' },
];

const DEFAULT_TOURNAMENT = [
  { id: 1, title: '805 Open Championship June 2026', desc: 'Turnamen bergengsi bulanan dengan sistem eliminasi. Terbuka untuk semua level.', day: '15', month: 'JUN', prize: 'Rp 5.000.000', format: '8-Ball', slots: '32 Slot', status: 'open', regUrl: '#' },
  { id: 2, title: 'Parung Cup — Doubles Tournament', desc: 'Kompetisi beregu 2 orang. Daftar bersama partner terbaikmu!', day: '22', month: 'JUN', prize: 'Rp 3.000.000', format: '9-Ball Doubles', slots: '16 Tim', status: 'open', regUrl: '#' },
  { id: 3, title: 'Rookie Tournament — Under 21', desc: 'Khusus pemain muda berbakat usia 17–21 tahun. Gratis pendaftaran untuk member!', day: '29', month: 'JUN', prize: 'Rp 2.000.000', format: '8-Ball', slots: '24 Slot', status: 'soon', regUrl: '#' },
  { id: 4, title: 'Community Night League — Mei 2026', desc: 'Turnamen santai komunitas, cocok untuk pemula dan pemain reguler.', day: '18', month: 'MEI', prize: 'Rp 1.500.000', format: 'Straight Pool', slots: '20 Slot', status: 'done', regUrl: '#' },
];

const DEFAULT_TESTIMONI = [
  { id: 1, text: 'Tempat billiard paling nyaman di Bogor! Mejanya bagus, pencahayaannya aesthetic banget. Cafenya juga enak. Wajib balik lagi!', name: 'Rizky A.', badge: 'Member Gold', stars: 5 },
  { id: 2, text: 'Sering nongkrong di sini bareng teman-teman komunitas. Mejanya terawat, AC dingin, WiFi kencang. Pelayanannya ramah banget.', name: 'Sarah M.', badge: 'Member Silver', stars: 5 },
  { id: 3, text: 'Turnamennya seru abis! Sistem kompetisinya rapi, hadiahnya jelas, dan tempatnya bikin semangat banget buat main.', name: 'Dani P.', badge: 'Turnamen Champion', stars: 5 },
  { id: 4, text: 'Booking onlinenya gampang banget, langsung konfirmasi via WhatsApp. Mejanya ready pas datang. 10/10 recommended!', name: 'Fara N.', badge: 'Member Platinum', stars: 5 },
  { id: 5, text: 'Baru pertama main billiard di sini, langsung jatuh cinta! Staff nya sabar ngajarin. Suasananya keren, worth it banget.', name: 'Kevin B.', badge: 'Pengunjung Baru', stars: 5 },
];

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: 'RIZKY', pts: 9850, games: 142, wins: 120, badge: 'Grand Master' },
  { rank: 2, name: 'DANI', pts: 8740, games: 130, wins: 108, badge: 'Master' },
  { rank: 3, name: 'FARHAN', pts: 7620, games: 115, wins: 95, badge: 'Expert' },
  { rank: 4, name: 'BAGAS', pts: 6500, games: 98, wins: 76, badge: 'Pro' },
  { rank: 5, name: 'SARAH', pts: 5800, games: 90, wins: 65, badge: 'Pro' },
  { rank: 6, name: 'KEVIN', pts: 4900, games: 85, wins: 58, badge: 'Advanced' },
  { rank: 7, name: 'FARA', pts: 4200, games: 70, wins: 48, badge: 'Advanced' },
  { rank: 8, name: 'ANDRE', pts: 3500, games: 60, wins: 38, badge: 'Intermediate' },
];

const DEFAULT_FAQ = [
  { q: 'Berapa harga main billiard per jam?', a: 'Harga meja Standard Rp 25.000/jam, Premium Rp 35.000/jam, dan VIP Lounge Rp 50.000/jam. Member VIP mendapat diskon khusus.' },
  { q: 'Apakah bisa booking meja sebelumnya?', a: 'Bisa! Booking bisa dilakukan via website ini atau WhatsApp kami. Konfirmasi booking maksimal 1 jam sebelum jam main.' },
  { q: 'Apakah ada paket bundling cafe + billiard?', a: 'Ada! Paket Hemat mulai Rp 55.000 sudah termasuk makan + minum + 1 jam main billiard. Cek menu cafe kami.' },
  { q: 'Bagaimana cara daftar member VIP?', a: 'Daftar bisa langsung di sini lewat tombol "Daftar Member" atau datang langsung ke kasir. Tersedia paket Silver, Gold, dan Platinum.' },
  { q: 'Apakah ada turnamen rutin?', a: 'Ya! Kami mengadakan turnamen setiap bulan. Open Championship, Doubles Tournament, dan Community League. Pantau section Tournament kami.' },
  { q: 'Apakah ada parkir?', a: 'Tersedia parkir motor dan mobil yang luas. Gratis untuk pengunjung selama jam operasional.' },
  { q: 'Apa jam operasional Billiard 805?', a: 'Kami buka setiap hari. Senin–Jumat: 10.00–02.00 WIB. Sabtu–Minggu & Hari Libur: 09.00–03.00 WIB.' },
];

const PRICE_LIST = [
  { name: 'Meja Standard', price: 'Rp 25.000/jam' },
  { name: 'Meja Premium', price: 'Rp 35.000/jam' },
  { name: 'VIP Lounge', price: 'Rp 50.000/jam' },
  { name: 'Happy Hour (10–14)', price: 'Rp 20.000/jam' },
  { name: 'Member Silver (-10%)', price: 'Mulai Rp 22.500/jam' },
  { name: 'Member Gold (-20%)', price: 'Mulai Rp 20.000/jam' },
  { name: 'Member Platinum (-30%)', price: 'Mulai Rp 17.500/jam' },
];

const ADMIN_CREDS = { email: 'admin@billiard.com', password: 'admin123' };

// ==================== APP STATE ====================
let state = {
  tables: DB.get('tables') || DEFAULT_TABLES,
  menu: DB.get('menu') || DEFAULT_MENU,
  gallery: DB.get('gallery') || DEFAULT_GALLERY,
  tournament: DB.get('tournament') || DEFAULT_TOURNAMENT,
  testimoni: DB.get('testimoni') || DEFAULT_TESTIMONI,
  leaderboard: DB.get('leaderboard') || DEFAULT_LEADERBOARD,
  faq: DB.get('faq') || DEFAULT_FAQ,
  bookings: DB.get('bookings') || [],
  members: DB.get('members') || [],
  currentMember: DB.get('currentMember') || null,
  tableFilter: 'all',
  tableSearch: '',
  testimoniIdx: 0,
  cafeCat: 'Semua',
  logoTapCount: 0,
  logoTapTimer: null,
  musicPlaying: false,
  themeMode: DB.get('theme') || 'dark',
  visitorCount: DB.get('visitorCount') || Math.floor(Math.random() * 40 + 50),
  pageViews: DB.get('pageViews') || 0,
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initCursor();
  initTheme();
  initClock();
  initParticles();
  initNavbar();
  initScrollReveal();
  initCounters();
  initTables();
  initBookingForm();
  initCafe();
  initGallery();
  initTestimoni();
  initLeaderboard();
  initFaq();
  initFAB();
  initMemberSystem();
  initAdminTrigger();
  initVisitorStats();
  initPWA();
  // Auto-save defaults
  DB.set('tables', state.tables);
  DB.set('menu', state.menu);
  DB.set('gallery', state.gallery);
  DB.set('tournament', state.tournament);
  DB.set('testimoni', state.testimoni);
  DB.set('leaderboard', state.leaderboard);
  DB.set('faq', state.faq);
  renderTournament();
  renderPriceList();
  renderBookingHistory();
  startTableTimers();
});

// ==================== LOADING ====================
function initLoading() {
  const ls = document.getElementById('loadingScreen');
  setTimeout(() => {
    ls.classList.add('hidden');
    document.body.style.cursor = '';
  }, 2200);
}

// ==================== CUSTOM CURSOR (Desktop) ====================
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return; // no cursor on touch
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx - 4 + 'px'; dot.style.top = my - 4 + 'px';
  });
  setInterval(() => {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    ring.style.left = rx - 18 + 'px'; ring.style.top = ry - 18 + 'px';
  }, 16);
  document.addEventListener('mousedown', () => { dot.style.transform = 'scale(0.6)'; ring.style.transform = 'scale(0.8)'; });
  document.addEventListener('mouseup', () => { dot.style.transform = 'scale(1)'; ring.style.transform = 'scale(1)'; });
  document.querySelectorAll('a, button, .table-card, .cafe-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.marginLeft = '-10px'; ring.style.marginTop = '-10px'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.marginLeft = '0'; ring.style.marginTop = '0'; });
  });
}

// ==================== THEME ====================
function initTheme() {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  function applyTheme(mode) {
    body.className = mode + '-mode';
    body.setAttribute('data-theme', mode);
    icon.className = mode === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    state.themeMode = mode;
    DB.set('theme', mode);
  }
  applyTheme(state.themeMode);
  btn.addEventListener('click', () => applyTheme(state.themeMode === 'dark' ? 'light' : 'dark'));
}

// ==================== CLOCK ====================
function initClock() {
  const el = document.getElementById('liveClock');
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick(); setInterval(tick, 1000);
}

// ==================== PARTICLES ====================
function initParticles() {
  const wrap = document.getElementById('particles');
  if (!wrap) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const colors = ['var(--neon-cyan)', 'var(--neon-purple)', 'var(--neon-green)'];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    wrap.appendChild(p);
  }
}

// ==================== NAVBAR ====================
function initNavbar() {
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    document.getElementById('backToTop').style.display = window.scrollY > 400 ? 'flex' : 'none';
  });
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { ham.classList.remove('open'); links.classList.remove('open'); });
  });
  // Music toggle
  const musicBtn = document.getElementById('musicToggle');
  musicBtn.addEventListener('click', () => {
    state.musicPlaying = !state.musicPlaying;
    musicBtn.classList.toggle('active', state.musicPlaying);
    showToast(state.musicPlaying ? '🎵 Ambience music ON' : '🔇 Music OFF', 'info');
  });
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ==================== COUNTERS ====================
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target);
          let cur = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = Math.floor(cur).toLocaleString('id-ID');
            if (cur >= target) clearInterval(timer);
          }, 25);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  const hero = document.querySelector('.hero-stats');
  if (hero) obs.observe(hero);
}

// ==================== LIVE TABLE SYSTEM ====================
function initTables() {
  renderTables();
  // Search
  document.getElementById('tableSearch').addEventListener('input', e => {
    state.tableSearch = e.target.value.toLowerCase();
    renderTables();
  });
  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.tableFilter = btn.dataset.filter;
      renderTables();
    });
  });
  // Update booking select
  updateMejaSelect();
}

function renderTables() {
  const grid = document.getElementById('tablesGrid');
  let tables = state.tables;
  if (state.tableFilter !== 'all') tables = tables.filter(t => t.status === state.tableFilter);
  if (state.tableSearch) tables = tables.filter(t =>
    t.name.toLowerCase().includes(state.tableSearch) || t.type.toLowerCase().includes(state.tableSearch)
  );
  grid.innerHTML = '';
  if (tables.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px">Tidak ada meja yang sesuai filter.</div>';
    return;
  }
  tables.forEach(t => {
    const card = document.createElement('div');
    card.className = `table-card ${t.status}`;
    card.innerHTML = `
      <div class="table-status-dot"></div>
      <div class="table-num">${String(t.id).padStart(2,'0')}</div>
      <div class="table-name">${t.name}</div>
      <div class="table-type">${t.type}</div>
      <div class="table-price">Rp ${t.price.toLocaleString('id-ID')}/jam</div>
      <div class="table-status-text">${getStatusLabel(t.status)}</div>
      ${t.status === 'occupied' && t.timer ? `<div class="table-timer"><i class="fas fa-clock"></i> ${formatTimer(t.timer)}</div>` : ''}
      ${t.status === 'booked' ? `<div style="font-size:11px;color:var(--text-muted);margin-top:4px"><i class="fas fa-user"></i> ${t.bookedBy}</div>` : ''}
      <button class="table-fav ${t.fav ? 'active' : ''}" onclick="toggleFav(event, ${t.id})" title="Favorit"><i class="${t.fav ? 'fas' : 'far'} fa-heart"></i></button>
    `;
    if (t.status === 'available') {
      card.addEventListener('click', () => openTableModal(t.id));
      card.style.cursor = 'pointer';
    }
    grid.appendChild(card);
  });
}

function getStatusLabel(s) {
  return { available: '● Kosong', occupied: '● Sedang Dipakai', booked: '● Sudah Dibooking' }[s] || s;
}

function formatTimer(mins) {
  if (!mins) return '';
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}j ${m}m tersisa` : `${m} menit tersisa`;
}

function startTableTimers() {
  setInterval(() => {
    state.tables.forEach(t => {
      if (t.status === 'occupied' && t.timer > 0) {
        t.timer -= 1;
        if (t.timer <= 0) { t.status = 'available'; t.timer = null; t.bookedBy = null; }
      }
    });
    DB.set('tables', state.tables);
    // Only re-render if grid exists and visible
    if (document.getElementById('tablesGrid')) renderTables();
  }, 60000);
}

function toggleFav(e, id) {
  e.stopPropagation();
  const t = state.tables.find(t => t.id === id);
  if (t) {
    t.fav = !t.fav;
    DB.set('tables', state.tables);
    renderTables();
    showToast(t.fav ? `❤️ Meja ${id} ditambahkan ke favorit` : `💔 Meja ${id} dihapus dari favorit`, 'info');
  }
}

function openTableModal(id) {
  const t = state.tables.find(t => t.id === id);
  if (!t) return;
  document.getElementById('tableModalTitle').textContent = `Booking ${t.name}`;
  document.getElementById('tableModalContent').innerHTML = `
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-family:'Orbitron',monospace;font-size:48px;font-weight:900;color:var(--neon-green)">${String(t.id).padStart(2,'0')}</div>
      <div style="font-size:13px;color:var(--text-muted);letter-spacing:2px">${t.type.toUpperCase()}</div>
    </div>
    <div class="price-item" style="margin-bottom:16px">
      <span class="price-item-name">Harga per Jam</span>
      <span class="price-item-val">Rp ${t.price.toLocaleString('id-ID')}</span>
    </div>
    <p style="color:var(--text-secondary);font-size:14px;margin-bottom:20px">Meja ini tersedia! Klik booking untuk mengamankan meja ini.</p>
    <a href="#booking" class="btn-primary full" onclick="closeModal('tableModal');document.getElementById('bkMeja').value='${t.id}'">
      <i class="fas fa-calendar-check"></i> Booking Meja ${t.id}
    </a>
    <a href="https://wa.me/6281234567890?text=Halo%20saya%20mau%20booking%20Meja%20${t.id}%20(${t.type})" class="btn-wa full" style="margin-top:10px;display:flex">
      <i class="fab fa-whatsapp"></i> WhatsApp Booking
    </a>
  `;
  openModal('tableModal');
}

function updateMejaSelect() {
  const sel = document.getElementById('bkMeja');
  sel.innerHTML = '<option value="">-- Pilih Meja --</option>';
  state.tables.filter(t => t.status === 'available').forEach(t => {
    sel.innerHTML += `<option value="${t.id}">Meja ${t.id} — ${t.type} (Rp ${t.price.toLocaleString('id-ID')}/jam)</option>`;
  });
}

// ==================== BOOKING FORM ====================
function initBookingForm() {
  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bkTanggal').min = today;
  document.getElementById('bkTanggal').value = today;

  // Price preview
  ['bkMeja','bkDurasi'].forEach(id => {
    document.getElementById(id).addEventListener('change', updatePricePreview);
  });
  updatePricePreview();

  // Submit
  document.getElementById('bookingSubmit').addEventListener('click', submitBooking);

  // WA button
  document.getElementById('waBookingBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const nm = document.getElementById('bkNama').value;
    const mj = document.getElementById('bkMeja').value;
    const tgl = document.getElementById('bkTanggal').value;
    const jm = document.getElementById('bkJam').value;
    if (!nm || !mj) { showToast('Lengkapi nama dan pilih meja dulu!', 'error'); return; }
    const msg = `Halo Billiard 805!\n\nSaya mau booking:\n- Nama: ${nm}\n- Meja: ${mj}\n- Tanggal: ${tgl}\n- Jam: ${jm}`;
    window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
  });

  // Export / Import
  document.getElementById('exportBooking').addEventListener('click', () => {
    const data = JSON.stringify(state.bookings, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'booking-billiard805.json'; a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Data booking berhasil diexport!', 'success');
  });
  document.getElementById('importBookingBtn').addEventListener('click', () => document.getElementById('importBookingFile').click());
  document.getElementById('importBookingFile').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) {
          state.bookings = data; DB.set('bookings', state.bookings);
          renderBookingHistory();
          showToast('📤 Data berhasil diimport!', 'success');
        }
      } catch { showToast('File tidak valid!', 'error'); }
    };
    reader.readAsText(file);
  });
}

function updatePricePreview() {
  const mejaId = parseInt(document.getElementById('bkMeja').value);
  const durasi = parseInt(document.getElementById('bkDurasi').value);
  if (!mejaId || !durasi) { document.getElementById('priceVal').textContent = 'Rp 0'; return; }
  const meja = state.tables.find(t => t.id === mejaId);
  if (!meja) return;
  const total = meja.price * durasi;
  document.getElementById('priceVal').textContent = 'Rp ' + total.toLocaleString('id-ID');
}

function submitBooking() {
  const nm = document.getElementById('bkNama').value.trim();
  const wa = document.getElementById('bkWa').value.trim();
  const tgl = document.getElementById('bkTanggal').value;
  const jm = document.getElementById('bkJam').value;
  const mejaId = document.getElementById('bkMeja').value;
  const durasi = document.getElementById('bkDurasi').value;
  const catatan = document.getElementById('bkCatatan').value;
  if (!nm || !wa || !tgl || !jm || !mejaId) {
    showToast('Lengkapi semua data booking!', 'error'); return;
  }
  const meja = state.tables.find(t => t.id === parseInt(mejaId));
  const booking = {
    id: Date.now(),
    nama: nm, wa, tanggal: tgl, jam: jm,
    meja: mejaId, mejaNama: meja?.name, mejaType: meja?.type,
    durasi: durasi + ' jam',
    total: meja ? 'Rp ' + (meja.price * parseInt(durasi)).toLocaleString('id-ID') : '-',
    catatan, status: 'pending', time: new Date().toLocaleString('id-ID')
  };
  state.bookings.unshift(booking);
  DB.set('bookings', state.bookings);
  // Update table status
  if (meja) { meja.status = 'booked'; meja.bookedBy = nm; DB.set('tables', state.tables); renderTables(); updateMejaSelect(); }
  renderBookingHistory();
  showToast(`✅ Booking ${meja?.name} berhasil! Konfirmasi via WA segera.`, 'success');
  // Reset form
  document.getElementById('bkNama').value = '';
  document.getElementById('bkWa').value = '';
  document.getElementById('bkMeja').value = '';
  document.getElementById('bkCatatan').value = '';
  updatePricePreview();
  // WA notification
  setTimeout(() => {
    const msg = `Konfirmasi booking:\n- Nama: ${nm}\n- Meja: ${meja?.name} (${meja?.type})\n- Tgl: ${tgl} Jam ${jm}\n- Durasi: ${durasi} jam\n- Total: ${booking.total}`;
    window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
  }, 800);
}

function renderBookingHistory() {
  const el = document.getElementById('bookingHistory');
  if (!el) return;
  if (state.bookings.length === 0) {
    el.innerHTML = '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px">Belum ada riwayat booking.</div>';
    return;
  }
  el.innerHTML = state.bookings.slice(0,5).map(b => `
    <div class="booking-history-item">
      <strong>${b.mejaNama || 'Meja ' + b.meja} — ${b.mejaType || ''}</strong>
      ${b.nama} · ${b.tanggal} ${b.jam} · ${b.durasi} · <span style="color:var(--neon-cyan)">${b.total}</span>
    </div>
  `).join('');
}

function renderPriceList() {
  const el = document.getElementById('priceList');
  if (!el) return;
  el.innerHTML = PRICE_LIST.map(p => `
    <div class="price-item">
      <span class="price-item-name">${p.name}</span>
      <span class="price-item-val">${p.price}</span>
    </div>
  `).join('');
}

// ==================== CAFE ====================
function initCafe() {
  renderCafeCats();
  renderCafe();
}

function renderCafeCats() {
  const cats = ['Semua', ...new Set(state.menu.map(m => m.cat))];
  const el = document.getElementById('cafeCats');
  el.innerHTML = cats.map(c => `
    <button class="cafe-cat-btn ${state.cafeCat === c ? 'active' : ''}" onclick="setCafeCat('${c}')">${c}</button>
  `).join('');
}

function setCafeCat(cat) {
  state.cafeCat = cat;
  renderCafeCats();
  renderCafe();
}

function renderCafe() {
  const el = document.getElementById('cafeGrid');
  const items = state.cafeCat === 'Semua' ? state.menu : state.menu.filter(m => m.cat === state.cafeCat);
  el.innerHTML = items.map(m => `
    <div class="cafe-card">
      <div class="cafe-img" style="background:linear-gradient(135deg,rgba(0,212,255,0.05),rgba(180,0,255,0.05))">
        <span style="position:relative;z-index:1">${m.emoji}</span>
      </div>
      <div class="cafe-info">
        <div class="cafe-name">${m.name}${m.badge ? `<span class="cafe-badge">${m.badge}</span>` : ''}</div>
        <div class="cafe-desc">${m.desc}</div>
        <div class="cafe-price">Rp ${m.price.toLocaleString('id-ID')}</div>
      </div>
    </div>
  `).join('');
}

// ==================== GALLERY ====================
function initGallery() {
  const el = document.getElementById('galleryGrid');
  el.innerHTML = state.gallery.map((g, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})">
      <div class="gallery-bg" style="background:${g.color || 'rgba(0,212,255,0.08)'}">
        <span>${g.emoji}</span>
      </div>
      <div class="gallery-overlay">
        <span class="gallery-caption">${g.label}</span>
      </div>
      <i class="fas fa-expand gallery-icon"></i>
    </div>
  `).join('');
}

function openLightbox(idx) {
  const g = state.gallery[idx];
  document.getElementById('lightboxImg').src = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${g.color?.replace('rgba','rgb').replace(/,\s*[\d.]+\)/, ')') || '#111'}"/><text x="400" y="250" text-anchor="middle" dominant-baseline="middle" font-size="120">${g.emoji}</text><text x="400" y="380" text-anchor="middle" font-size="22" fill="rgba(255,255,255,0.6)" font-family="Inter">${g.label}</text></svg>`);
  document.getElementById('lightboxCaption').textContent = g.label;
  openModal('lightboxModal');
}

// ==================== TESTIMONI ====================
function initTestimoni() {
  renderTestimoni();
}

function renderTestimoni() {
  const slider = document.getElementById('testimoniSlider');
  const dots = document.getElementById('testimoniDots');
  slider.innerHTML = `
    <div class="testimoni-track" id="testimoniTrack">
      ${state.testimoni.map(t => `
        <div class="testimoni-card">
          <div class="testimoni-inner glass">
            <div class="test-stars">${'★'.repeat(t.stars)}</div>
            <div class="test-text">${t.text}</div>
            <div class="test-author">
              <div class="test-avatar">${t.name[0]}</div>
              <div class="test-info">
                <div class="test-name">${t.name}</div>
                <div class="test-badge">${t.badge}</div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  dots.innerHTML = state.testimoni.map((_, i) => `
    <div class="t-dot ${i === 0 ? 'active' : ''}" onclick="goTestimoni(${i})"></div>
  `).join('');
  // Auto-slide
  setInterval(() => {
    state.testimoniIdx = (state.testimoniIdx + 1) % state.testimoni.length;
    updateTestimoniSlider();
  }, 5000);
}

function goTestimoni(idx) {
  state.testimoniIdx = idx;
  updateTestimoniSlider();
}

function updateTestimoniSlider() {
  const track = document.getElementById('testimoniTrack');
  if (track) track.style.transform = `translateX(-${state.testimoniIdx * 100}%)`;
  document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === state.testimoniIdx));
}

// ==================== LEADERBOARD ====================
function initLeaderboard() {
  const podium = document.getElementById('lbPodium');
  const table = document.getElementById('lbTable');
  const top3 = state.leaderboard.slice(0, 3);
  // Reorder for podium: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  podium.innerHTML = podiumOrder.filter(Boolean).map((p, i) => {
    const rankClass = i === 1 ? 'rank-1' : i === 0 ? 'rank-2' : 'rank-3';
    const realRank = i === 1 ? 1 : i === 0 ? 2 : 3;
    return `
      <div class="lb-podium-item">
        <div class="lb-rank-badge ${rankClass}">${realRank}</div>
        <div class="lb-avatar">${p.name[0]}</div>
        <div class="lb-name">${p.name}</div>
        <div class="lb-pts">${p.pts.toLocaleString('id-ID')} pts</div>
        <div class="lb-podium-bar"></div>
      </div>
    `;
  }).join('');
  table.innerHTML = state.leaderboard.slice(3).map(p => `
    <div class="lb-row">
      <div class="lb-row-rank">${p.rank}</div>
      <div class="lb-row-avatar">${p.name[0]}</div>
      <div class="lb-row-name">${p.name}<br><span style="font-size:11px;color:var(--text-muted)">${p.wins}W/${p.games}G</span></div>
      <div class="lb-row-pts">${p.pts.toLocaleString('id-ID')}</div>
      <div class="lb-row-badge">${p.badge}</div>
    </div>
  `).join('');
}

// ==================== FAQ ====================
function initFaq() {
  const el = document.getElementById('faqList');
  el.innerHTML = state.faq.map((f, i) => `
    <div class="faq-item" id="faq-${i}">
      <div class="faq-q" onclick="toggleFaq(${i})">
        <span>${f.q}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="faq-a">${f.a}</div>
    </div>
  `).join('');
}

function toggleFaq(idx) {
  const item = document.getElementById('faq-' + idx);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ==================== TOURNAMENT ====================
function renderTournament() {
  const el = document.getElementById('tournamentList');
  if (!el) return;
  el.innerHTML = state.tournament.map(t => `
    <div class="tournament-card glass">
      <div class="tournament-date">
        <div class="td-day">${t.day}</div>
        <div class="td-month">${t.month}</div>
      </div>
      <div class="tournament-info">
        <div class="tournament-title">${t.title}</div>
        <div class="tournament-desc">${t.desc}</div>
        <div class="tournament-tags">
          <span class="ttag prize"><i class="fas fa-trophy"></i> ${t.prize}</span>
          <span class="ttag format"><i class="fas fa-gamepad"></i> ${t.format}</span>
          <span class="ttag slots"><i class="fas fa-users"></i> ${t.slots}</span>
        </div>
      </div>
      <div class="tournament-status">
        <span class="t-status ${t.status}">${{open:'DAFTAR TERBUKA',soon:'SEGERA DIBUKA',done:'SELESAI'}[t.status]}</span>
        ${t.status !== 'done' ? `<a href="https://wa.me/6281234567890?text=Halo%20saya%20mau%20daftar%20${encodeURIComponent(t.title)}" class="btn-sm t-regbtn" target="_blank"><i class="fab fa-whatsapp"></i> Daftar</a>` : ''}
      </div>
    </div>
  `).join('');
}

// ==================== FAB & BACK TO TOP ====================
function initFAB() {
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== MEMBER SYSTEM ====================
function initMemberSystem() {
  const loginBtn = document.getElementById('memberLoginBtn');
  loginBtn.addEventListener('click', () => {
    if (state.currentMember) openProfileModal();
    else openModal('memberModal');
  });
  document.getElementById('memberLoginSubmit').addEventListener('click', loginMember);
  document.getElementById('memberRegSubmit').addEventListener('click', registerMember);
  // Update button text if logged in
  updateMemberBtn();
}

function updateMemberBtn() {
  const btn = document.getElementById('memberLoginBtn');
  if (state.currentMember) {
    btn.innerHTML = `<i class="fas fa-user-check"></i> ${state.currentMember.nama.split(' ')[0]}`;
  } else {
    btn.innerHTML = '<i class="fas fa-user"></i> Member';
  }
}

function switchMemberTab(tab) {
  document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
  document.querySelector(`.mtab[onclick*="${tab}"]`)?.classList.add('active');
  document.getElementById('memberLoginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('memberRegForm').style.display = tab === 'register' ? 'block' : 'none';
}

function loginMember() {
  const email = document.getElementById('mEmail').value;
  const pass = document.getElementById('mPassword').value;
  const member = state.members.find(m => m.email === email && m.password === pass);
  if (!member) { showToast('Email atau password salah!', 'error'); return; }
  state.currentMember = member;
  DB.set('currentMember', member);
  closeModal('memberModal');
  updateMemberBtn();
  showToast(`👋 Selamat datang, ${member.nama}!`, 'success');
  setTimeout(openProfileModal, 500);
}

function registerMember() {
  const nm = document.getElementById('rNama').value.trim();
  const em = document.getElementById('rEmail').value.trim();
  const wa = document.getElementById('rWa').value.trim();
  const ps = document.getElementById('rPass').value;
  const pk = document.getElementById('rPaket').value;
  if (!nm || !em || !wa || !ps) { showToast('Lengkapi semua data!', 'error'); return; }
  if (ps.length < 6) { showToast('Password minimal 6 karakter!', 'error'); return; }
  if (state.members.find(m => m.email === em)) { showToast('Email sudah terdaftar!', 'error'); return; }
  const member = {
    id: Date.now(), nama: nm, email: em, wa, password: ps, paket: pk,
    poin: 100, bergabung: new Date().toLocaleDateString('id-ID'), visits: 0
  };
  state.members.push(member);
  DB.set('members', state.members);
  state.currentMember = member;
  DB.set('currentMember', member);
  closeModal('memberModal');
  updateMemberBtn();
  showToast(`🎉 Selamat bergabung, ${nm}! Member ${pk.toUpperCase()} aktif.`, 'success');
  setTimeout(openProfileModal, 500);
}

function openProfileModal() {
  if (!state.currentMember) return;
  const m = state.currentMember;
  const tierColors = { silver: '#C0C0C0', gold: '#ffd700', platinum: 'var(--neon-cyan)' };
  document.getElementById('profileContent').innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${m.nama[0]}</div>
      <div>
        <div class="profile-name">${m.nama}</div>
        <div class="profile-tier" style="color:${tierColors[m.paket]}">${m.paket.toUpperCase()} MEMBER</div>
      </div>
    </div>
    <div class="member-card-display">
      <div class="mc-name">${m.nama}</div>
      <div class="mc-id">ID: B805-${String(m.id).slice(-6)}</div>
      <div class="mc-tier">${m.paket.toUpperCase()}</div>
      <div class="mc-pts">${m.poin}</div>
      <div class="mc-pts-label">POIN REWARD</div>
    </div>
    <div class="qr-card-wrap">
      <div class="qr-display">🎱</div>
      <div style="font-size:12px;color:var(--text-muted)">QR Code Member (dummy)</div>
    </div>
    <div class="profile-stats" style="margin-top:20px">
      <div class="ps-item"><div class="ps-num">${m.poin}</div><div class="ps-label">Total Poin</div></div>
      <div class="ps-item"><div class="ps-num">${m.visits || 0}</div><div class="ps-label">Kunjungan</div></div>
      <div class="ps-item"><div class="ps-num">${state.bookings.filter(b => b.wa === m.wa).length}</div><div class="ps-label">Booking</div></div>
      <div class="ps-item"><div class="ps-num">${m.bergabung}</div><div class="ps-label">Bergabung</div></div>
    </div>
    <button class="logout-btn" onclick="logoutMember()"><i class="fas fa-sign-out-alt"></i> Logout</button>
  `;
  openModal('profileModal');
}

function logoutMember() {
  state.currentMember = null;
  DB.del('currentMember');
  closeModal('profileModal');
  updateMemberBtn();
  showToast('👋 Berhasil logout!', 'info');
}

function openMemberModal(tier) {
  document.getElementById('rPaket').value = tier;
  switchMemberTab('register');
  openModal('memberModal');
}

// ==================== ADMIN TRIGGER ====================
function initAdminTrigger() {
  const logo = document.getElementById('logoTap');
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    state.logoTapCount++;
    clearTimeout(state.logoTapTimer);
    state.logoTapTimer = setTimeout(() => state.logoTapCount = 0, 2000);
    if (state.logoTapCount >= 5) {
      state.logoTapCount = 0;
      openModal('adminLoginModal');
    }
  });
  document.getElementById('adminLoginSubmit').addEventListener('click', () => {
    const em = document.getElementById('adminEmail').value;
    const ps = document.getElementById('adminPassword').value;
    if (em === ADMIN_CREDS.email && ps === ADMIN_CREDS.password) {
      DB.set('adminSession', true);
      closeModal('adminLoginModal');
      showToast('🔐 Login admin berhasil! Membuka dashboard...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } else {
      showToast('Email atau password admin salah!', 'error');
    }
  });
}

// ==================== VISITOR STATS ====================
function initVisitorStats() {
  state.pageViews++;
  DB.set('pageViews', state.pageViews);
  // Increment visitor occasionally
  if (Math.random() > 0.7) { state.visitorCount++; DB.set('visitorCount', state.visitorCount); }
  document.getElementById('visitorCount').textContent = state.visitorCount;
  document.getElementById('pageViews').textContent = state.pageViews;
}

// ==================== PWA ====================
let deferredPrompt;
function initPWA() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e;
    const banner = document.getElementById('pwaInstall');
    banner.classList.remove('hidden');
    document.getElementById('pwaInstallBtn').addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => { deferredPrompt = null; banner.classList.add('hidden'); });
    });
    document.getElementById('pwaClose').addEventListener('click', () => banner.classList.add('hidden'));
  });
}

// ==================== MODAL UTILS ====================
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', (e) => {
    if (e.target === el) closeModal(el.id);
  });
});

// ==================== TOAST ====================
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==================== RIPPLE EFFECT ====================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-primary, .btn-outline, .btn-wa');
  if (!btn) return;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);
    width:${size}px;height:${size}px;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY - rect.top - size/2}px;
    animation:rippleAnim 0.6s ease-out forwards;
    pointer-events:none;
  `;
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim{from{transform:scale(0);opacity:1}to{transform:scale(2.5);opacity:0}}';
    document.head.appendChild(style);
  }
  btn.style.position = btn.style.position || 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});
