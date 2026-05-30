/* ================================================
   BILLIARD 805 — Admin Dashboard JavaScript
   ================================================ */

'use strict';

// ==================== AUTH CHECK ====================
(function checkAuth() {
  const session = localStorage.getItem('b805_adminSession');
  if (!session) {
    alert('Akses ditolak! Silakan login dari halaman utama.');
    window.location.href = 'index.html';
  }
})();

// ==================== ADMIN STATE ====================
let adminState = {
  currentPage: 'dashboard',
  theme: DB.get('adminTheme') || 'dark',
  tableFilter: 'all',
  tableSearch: '',
  bookingFilter: 'all',
  memberFilter: 'all',
  currentPage_num: 1,
  itemsPerPage: 10,
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initAdminTheme();
  initAdminClock();
  initSidebar();
  initNavigation();
  initAdminLogout();
  updateNavBadges();
  renderPage('dashboard');
});

// ==================== THEME ====================
function initAdminTheme() {
  document.body.className = adminState.theme + '-mode';
  const btn = document.getElementById('themeToggleAdmin');
  btn.innerHTML = `<i class="fas fa-${adminState.theme === 'dark' ? 'moon' : 'sun'}"></i>`;
  btn.addEventListener('click', () => {
    adminState.theme = adminState.theme === 'dark' ? 'light' : 'dark';
    document.body.className = adminState.theme + '-mode';
    btn.innerHTML = `<i class="fas fa-${adminState.theme === 'dark' ? 'moon' : 'sun'}"></i>`;
    DB.set('adminTheme', adminState.theme);
  });
}

// ==================== CLOCK ====================
function initAdminClock() {
  const el = document.getElementById('adminClock');
  function tick() {
    el.textContent = new Date().toLocaleTimeString('id-ID');
  }
  tick(); setInterval(tick, 1000);
}

// ==================== SIDEBAR ====================
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const close = document.getElementById('sidebarClose');
  const main = document.getElementById('mainWrap');

  toggle.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('expanded');
    }
  });
  close.addEventListener('click', () => sidebar.classList.remove('open'));

  // Close on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ==================== NAVIGATION ====================
function initNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (!page) return;
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      renderPage(page);
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });

  // Admin search
  document.getElementById('adminSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

function initAdminLogout() {
  document.getElementById('adminLogout').addEventListener('click', () => {
    if (confirm('Yakin ingin logout dari admin panel?')) {
      DB.del('adminSession');
      window.location.href = 'index.html';
    }
  });
}

function updateNavBadges() {
  document.getElementById('navBadgeTables').textContent = state.tables.length;
  const pendingBookings = state.bookings.filter(b => b.status === 'pending').length;
  const badge = document.getElementById('navBadgeBookings');
  badge.textContent = pendingBookings;
  badge.className = 'nav-badge' + (pendingBookings > 0 ? ' nav-badge-alert' : '');
}

// ==================== RENDER PAGE ====================
function renderPage(page) {
  adminState.currentPage = page;
  const titles = {
    dashboard: 'Dashboard', tables: 'Kelola Meja', bookings: 'Kelola Booking',
    menu: 'Menu Cafe', gallery: 'Gallery', promo: 'Promo & Harga',
    members: 'Member VIP', tournament: 'Turnamen', leaderboard: 'Leaderboard',
    testimoni: 'Testimoni', settings: 'Pengaturan', database: 'Database'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  const content = document.getElementById('pageContent');
  const renders = {
    dashboard: renderDashboard, tables: renderTablesPage,
    bookings: renderBookingsPage, menu: renderMenuPage,
    gallery: renderGalleryPage, promo: renderPromoPage,
    members: renderMembersPage, tournament: renderTournamentPage,
    leaderboard: renderLeaderboardPage, testimoni: renderTestimoniPage,
    settings: renderSettingsPage, database: renderDatabasePage,
  };
  if (renders[page]) { content.innerHTML = ''; renders[page](content); }
}

// ==================== DASHBOARD PAGE ====================
function renderDashboard(el) {
  const available = state.tables.filter(t => t.status === 'available').length;
  const occupied = state.tables.filter(t => t.status === 'occupied').length;
  const booked = state.tables.filter(t => t.status === 'booked').length;
  const todayRevenue = occupied * 25000 + booked * 35000;

  el.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fas fa-table-tennis-paddle-ball"></i></div>
        <div class="stat-info">
          <div class="stat-label">Total Meja</div>
          <div class="stat-value">${state.tables.length}</div>
          <div class="stat-sub"><i class="fas fa-circle" style="font-size:7px"></i> ${available} kosong</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fas fa-calendar-check"></i></div>
        <div class="stat-info">
          <div class="stat-label">Total Booking</div>
          <div class="stat-value">${state.bookings.length}</div>
          <div class="stat-sub" style="color:orange">${state.bookings.filter(b=>b.status==='pending').length} pending</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i class="fas fa-users"></i></div>
        <div class="stat-info">
          <div class="stat-label">Member Aktif</div>
          <div class="stat-value">${state.members.length}</div>
          <div class="stat-sub">+${state.members.filter(m=>m.paket==='gold').length} Gold</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gold"><i class="fas fa-coins"></i></div>
        <div class="stat-info">
          <div class="stat-label">Est. Revenue Hari Ini</div>
          <div class="stat-value" style="font-size:16px">Rp ${todayRevenue.toLocaleString('id-ID')}</div>
          <div class="stat-sub">${occupied + booked} meja aktif</div>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <h4><i class="fas fa-chart-bar"></i> Booking Per Hari (7 Hari Terakhir)</h4>
        <div class="bar-chart" id="barChart"></div>
      </div>
      <div class="chart-card">
        <h4><i class="fas fa-circle-half-stroke"></i> Status Meja</h4>
        <div class="donut-chart">
          <div class="donut-wrap">
            <svg class="donut-svg" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3.5"/>
              <circle class="donut-circle" cx="18" cy="18" r="15.9" fill="none" stroke="var(--neon-green)" stroke-width="3.5"
                stroke-dasharray="${(available/state.tables.length*100).toFixed(1)} 100" stroke-dashoffset="0"/>
              <circle class="donut-circle" cx="18" cy="18" r="15.9" fill="none" stroke="#ff4444" stroke-width="3.5"
                stroke-dasharray="${(occupied/state.tables.length*100).toFixed(1)} 100"
                stroke-dashoffset="${-(available/state.tables.length*100).toFixed(1)}"/>
              <circle class="donut-circle" cx="18" cy="18" r="15.9" fill="none" stroke="var(--neon-gold)" stroke-width="3.5"
                stroke-dasharray="${(booked/state.tables.length*100).toFixed(1)} 100"
                stroke-dashoffset="${-((available+occupied)/state.tables.length*100).toFixed(1)}"/>
            </svg>
            <div class="donut-label">
              <div class="donut-num">${state.tables.length}</div>
              <div class="donut-sub">MEJA</div>
            </div>
          </div>
          <div class="donut-legend">
            <div class="dl-item"><div class="dl-dot" style="background:var(--neon-green)"></div>Kosong: ${available}</div>
            <div class="dl-item"><div class="dl-dot" style="background:#ff4444"></div>Dipakai: ${occupied}</div>
            <div class="dl-item"><div class="dl-dot" style="background:var(--neon-gold)"></div>Booking: ${booked}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="recent-row">
      <div class="recent-card">
        <div class="recent-header">
          <h4><i class="fas fa-history"></i> Booking Terbaru</h4>
          <button class="btn-export" onclick="renderPage('bookings')">Lihat Semua</button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr><th>Nama</th><th>Meja</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              ${state.bookings.slice(0,6).map(b => `
                <tr>
                  <td>${b.nama}</td>
                  <td>${b.mejaNama || 'Meja '+b.meja}</td>
                  <td>${b.tanggal}</td>
                  <td style="color:var(--neon-cyan)">${b.total}</td>
                  <td><span class="td-status ${b.status}">${b.status}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">Belum ada booking</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
      <div class="recent-card">
        <div class="recent-header">
          <h4><i class="fas fa-users"></i> Member Terbaru</h4>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr><th>Nama</th><th>Paket</th><th>Poin</th></tr></thead>
            <tbody>
              ${state.members.slice(0,6).map(m => `
                <tr>
                  <td>${m.nama}</td>
                  <td><span class="td-status ${m.paket}">${m.paket}</span></td>
                  <td style="color:var(--neon-cyan)">${m.poin}</td>
                </tr>
              `).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">Belum ada member</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Render bar chart
  const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  const vals = days.map(() => Math.floor(Math.random() * 12 + 2));
  const max = Math.max(...vals);
  const barChart = document.getElementById('barChart');
  if (barChart) {
    barChart.innerHTML = vals.map((v, i) => `
      <div class="bar-item">
        <div class="bar-val">${v}</div>
        <div class="bar-fill" style="height:${(v/max*100)}%"></div>
        <div class="bar-label">${days[i]}</div>
      </div>
    `).join('');
  }
}

// ==================== TABLES PAGE ====================
function renderTablesPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-table-tennis-paddle-ball"></i> Kelola Meja Billiard</h3>
      <div class="section-actions">
        <button class="btn-add" onclick="openAddTableModal()"><i class="fas fa-plus"></i> Tambah Meja</button>
        <button class="btn-export" onclick="exportTableData()"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>
    <div class="filter-bar">
      <select class="filter-select" id="tableFilterSelect" onchange="filterTables()">
        <option value="all">Semua Status</option>
        <option value="available">Kosong</option>
        <option value="occupied">Dipakai</option>
        <option value="booked">Booking</option>
      </select>
      <div class="search-inline">
        <i class="fas fa-search"></i>
        <input type="text" id="tableSearchAdmin" placeholder="Cari meja..." oninput="filterTables()"/>
      </div>
    </div>
    <div class="data-table-wrap">
      <table class="data-table" id="adminTablesTable">
        <thead><tr><th>#</th><th>Nama</th><th>Tipe</th><th>Harga/Jam</th><th>Status</th><th>Dipakai Oleh</th><th>Aksi</th></tr></thead>
        <tbody id="adminTablesTbody"></tbody>
      </table>
    </div>
    <div class="pagination" id="tablesPagination"></div>
  `;
  renderTablesTableBody();
}

function filterTables() {
  renderTablesTableBody();
}

function renderTablesTableBody() {
  const filter = document.getElementById('tableFilterSelect')?.value || 'all';
  const search = (document.getElementById('tableSearchAdmin')?.value || '').toLowerCase();
  let tables = state.tables;
  if (filter !== 'all') tables = tables.filter(t => t.status === filter);
  if (search) tables = tables.filter(t => t.name.toLowerCase().includes(search) || t.type.toLowerCase().includes(search));
  const tbody = document.getElementById('adminTablesTbody');
  if (!tbody) return;
  tbody.innerHTML = tables.map(t => `
    <tr>
      <td><span style="font-family:'Orbitron',monospace;font-weight:700;color:var(--neon-cyan)">${String(t.id).padStart(2,'0')}</span></td>
      <td>${t.name}</td>
      <td>${t.type}</td>
      <td>Rp ${t.price.toLocaleString('id-ID')}</td>
      <td><span class="td-status ${t.status}">${{available:'Kosong',occupied:'Dipakai',booked:'Booking'}[t.status]}</span></td>
      <td>${t.bookedBy || '—'}</td>
      <td>
        <div class="td-actions">
          <button class="btn-action" onclick="openEditTableModal(${t.id})" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-action" onclick="changeTableStatus(${t.id})" title="Ganti Status"><i class="fas fa-arrows-rotate"></i></button>
          <button class="btn-action danger" onclick="deleteTable(${t.id})" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:24px">Tidak ada data</td></tr>';
}

function openAddTableModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Meja Baru';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Nama Meja</label><input type="text" class="form-input" id="ftName" placeholder="Meja 13" /></div>
    <div class="form-group"><label>Tipe</label><select class="form-select" id="ftType"><option>Standard</option><option>Premium</option><option>VIP Lounge</option></select></div>
    <div class="form-group"><label>Harga / Jam (Rp)</label><input type="number" class="form-input" id="ftPrice" placeholder="25000" /></div>
    <button class="btn-full" onclick="saveAddTable()"><i class="fas fa-plus"></i> Tambah Meja</button>
  `;
  openAdminModal();
}

function saveAddTable() {
  const name = document.getElementById('ftName').value.trim();
  const type = document.getElementById('ftType').value;
  const price = parseInt(document.getElementById('ftPrice').value);
  if (!name || !price) { showAdminToast('Lengkapi data meja!', 'error'); return; }
  const newId = Math.max(...state.tables.map(t => t.id)) + 1;
  state.tables.push({ id: newId, name, type, status: 'available', price, timer: null, bookedBy: null, fav: false });
  DB.set('tables', state.tables);
  closeAdminModal();
  renderPage('tables');
  updateNavBadges();
  showAdminToast('✅ Meja berhasil ditambahkan!', 'success');
}

function openEditTableModal(id) {
  const t = state.tables.find(t => t.id === id);
  if (!t) return;
  document.getElementById('adminModalTitle').textContent = `Edit ${t.name}`;
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Nama Meja</label><input type="text" class="form-input" id="etName" value="${t.name}" /></div>
    <div class="form-group"><label>Tipe</label>
      <select class="form-select" id="etType">
        ${['Standard','Premium','VIP Lounge'].map(tp => `<option ${tp===t.type?'selected':''}>${tp}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Harga / Jam (Rp)</label><input type="number" class="form-input" id="etPrice" value="${t.price}" /></div>
    <div class="form-group"><label>Status</label>
      <select class="form-select" id="etStatus">
        ${['available','occupied','booked'].map(s => `<option value="${s}" ${s===t.status?'selected':''}>${{available:'Kosong',occupied:'Dipakai',booked:'Booking'}[s]}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Dipakai Oleh</label><input type="text" class="form-input" id="etBookedBy" value="${t.bookedBy||''}" placeholder="Nama pemakai..." /></div>
    <button class="btn-full" onclick="saveEditTable(${id})"><i class="fas fa-save"></i> Simpan Perubahan</button>
  `;
  openAdminModal();
}

function saveEditTable(id) {
  const t = state.tables.find(t => t.id === id);
  if (!t) return;
  t.name = document.getElementById('etName').value;
  t.type = document.getElementById('etType').value;
  t.price = parseInt(document.getElementById('etPrice').value);
  t.status = document.getElementById('etStatus').value;
  t.bookedBy = document.getElementById('etBookedBy').value || null;
  DB.set('tables', state.tables);
  closeAdminModal();
  renderPage('tables');
  showAdminToast('✅ Meja berhasil diupdate!', 'success');
}

function changeTableStatus(id) {
  const t = state.tables.find(t => t.id === id);
  if (!t) return;
  const statuses = ['available', 'occupied', 'booked'];
  const next = statuses[(statuses.indexOf(t.status) + 1) % statuses.length];
  t.status = next;
  if (next === 'available') { t.bookedBy = null; t.timer = null; }
  DB.set('tables', state.tables);
  renderTablesTableBody();
  showAdminToast(`Meja ${t.name} → ${next}`, 'info');
}

function deleteTable(id) {
  if (!confirm(`Hapus Meja ${id}? Data tidak bisa dikembalikan.`)) return;
  state.tables = state.tables.filter(t => t.id !== id);
  DB.set('tables', state.tables);
  renderPage('tables');
  updateNavBadges();
  showAdminToast('🗑️ Meja dihapus!', 'info');
}

function exportTableData() {
  const blob = new Blob([JSON.stringify(state.tables, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'tables-billiard805.json'; a.click();
  showAdminToast('📥 Data meja diexport!', 'success');
}

// ==================== BOOKINGS PAGE ====================
function renderBookingsPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-calendar-check"></i> Kelola Booking</h3>
      <div class="section-actions">
        <button class="btn-export" onclick="exportBookingsAdmin()"><i class="fas fa-download"></i> Export JSON</button>
        <button class="btn-danger" onclick="clearAllBookings()"><i class="fas fa-trash"></i> Hapus Semua</button>
      </div>
    </div>
    <div class="filter-bar">
      <select class="filter-select" id="bookingFilterSel" onchange="renderBookingTable()">
        <option value="all">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
      </select>
      <div class="search-inline">
        <i class="fas fa-search"></i>
        <input type="text" id="bookingSearchAdmin" placeholder="Cari booking..." oninput="renderBookingTable()"/>
      </div>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Nama</th><th>WA</th><th>Meja</th><th>Tanggal</th><th>Jam</th><th>Durasi</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody id="bookingsTbody"></tbody>
      </table>
    </div>
  `;
  renderBookingTable();
}

function renderBookingTable() {
  const filter = document.getElementById('bookingFilterSel')?.value || 'all';
  const search = (document.getElementById('bookingSearchAdmin')?.value || '').toLowerCase();
  let bookings = state.bookings;
  if (filter !== 'all') bookings = bookings.filter(b => b.status === filter);
  if (search) bookings = bookings.filter(b => b.nama.toLowerCase().includes(search) || b.meja.toString().includes(search));
  const tbody = document.getElementById('bookingsTbody');
  if (!tbody) return;
  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${b.nama}</td>
      <td><a href="https://wa.me/${b.wa}" target="_blank" style="color:var(--neon-green)">${b.wa}</a></td>
      <td>${b.mejaNama || 'Meja ' + b.meja}</td>
      <td>${b.tanggal}</td>
      <td>${b.jam}</td>
      <td>${b.durasi}</td>
      <td style="color:var(--neon-cyan)">${b.total}</td>
      <td><span class="td-status ${b.status}">${b.status}</span></td>
      <td>
        <div class="td-actions">
          <button class="btn-action" onclick="confirmBooking(${b.id})" title="Konfirmasi"><i class="fas fa-check"></i></button>
          <button class="btn-action danger" onclick="deleteBooking(${b.id})" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:24px">Belum ada booking</td></tr>';
}

function confirmBooking(id) {
  const b = state.bookings.find(b => b.id === id);
  if (b) { b.status = 'confirmed'; DB.set('bookings', state.bookings); renderBookingTable(); updateNavBadges(); showAdminToast('✅ Booking dikonfirmasi!', 'success'); }
}

function deleteBooking(id) {
  if (!confirm('Hapus booking ini?')) return;
  state.bookings = state.bookings.filter(b => b.id !== id);
  DB.set('bookings', state.bookings); renderBookingTable(); updateNavBadges();
  showAdminToast('🗑️ Booking dihapus!', 'info');
}

function clearAllBookings() {
  if (!confirm('Hapus SEMUA data booking? Tindakan tidak bisa dibatalkan!')) return;
  state.bookings = []; DB.set('bookings', state.bookings); renderBookingTable(); updateNavBadges();
  showAdminToast('🗑️ Semua booking dihapus!', 'info');
}

function exportBookingsAdmin() {
  const blob = new Blob([JSON.stringify(state.bookings, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'bookings-billiard805.json'; a.click();
  showAdminToast('📥 Booking diexport!', 'success');
}

// ==================== MENU PAGE ====================
function renderMenuPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-utensils"></i> Kelola Menu Cafe</h3>
      <div class="section-actions">
        <button class="btn-add" onclick="openAddMenuModal()"><i class="fas fa-plus"></i> Tambah Menu</button>
      </div>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Ikon</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Deskripsi</th><th>Badge</th><th>Aksi</th></tr></thead>
        <tbody>
          ${state.menu.map(m => `
            <tr>
              <td style="font-size:22px">${m.emoji}</td>
              <td>${m.name}</td>
              <td>${m.cat}</td>
              <td style="color:var(--neon-cyan)">Rp ${m.price.toLocaleString('id-ID')}</td>
              <td style="color:var(--text-muted)">${m.desc}</td>
              <td>${m.badge ? `<span class="td-status available">${m.badge}</span>` : '—'}</td>
              <td>
                <div class="td-actions">
                  <button class="btn-action" onclick="openEditMenuModal(${m.id})" title="Edit"><i class="fas fa-pen"></i></button>
                  <button class="btn-action danger" onclick="deleteMenu(${m.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAddMenuModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Menu Baru';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-row">
      <div class="form-group"><label>Nama Menu</label><input type="text" class="form-input" id="mnName" placeholder="Nama menu..." /></div>
      <div class="form-group"><label>Emoji</label><input type="text" class="form-input" id="mnEmoji" placeholder="☕" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Kategori</label>
        <select class="form-select" id="mnCat">
          <option>Minuman</option><option>Makanan</option><option>Snack</option><option>Paket</option>
        </select>
      </div>
      <div class="form-group"><label>Harga (Rp)</label><input type="number" class="form-input" id="mnPrice" placeholder="15000" /></div>
    </div>
    <div class="form-group"><label>Deskripsi</label><input type="text" class="form-input" id="mnDesc" placeholder="Deskripsi singkat..." /></div>
    <div class="form-group"><label>Badge (opsional)</label><input type="text" class="form-input" id="mnBadge" placeholder="Best Seller / New / dll" /></div>
    <button class="btn-full" onclick="saveAddMenu()"><i class="fas fa-plus"></i> Tambah Menu</button>
  `;
  openAdminModal();
}

function saveAddMenu() {
  const nm = document.getElementById('mnName').value.trim();
  const em = document.getElementById('mnEmoji').value.trim() || '🍽️';
  const cat = document.getElementById('mnCat').value;
  const price = parseInt(document.getElementById('mnPrice').value);
  const desc = document.getElementById('mnDesc').value.trim();
  const badge = document.getElementById('mnBadge').value.trim();
  if (!nm || !price) { showAdminToast('Lengkapi nama dan harga!', 'error'); return; }
  const newId = Math.max(...state.menu.map(m => m.id), 0) + 1;
  state.menu.push({ id: newId, name: nm, cat, price, emoji: em, desc, badge });
  DB.set('menu', state.menu);
  closeAdminModal(); renderPage('menu');
  showAdminToast('✅ Menu ditambahkan!', 'success');
}

function openEditMenuModal(id) {
  const m = state.menu.find(m => m.id === id);
  if (!m) return;
  document.getElementById('adminModalTitle').textContent = 'Edit Menu';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-row">
      <div class="form-group"><label>Nama</label><input type="text" class="form-input" id="emnName" value="${m.name}" /></div>
      <div class="form-group"><label>Emoji</label><input type="text" class="form-input" id="emnEmoji" value="${m.emoji}" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Kategori</label>
        <select class="form-select" id="emnCat">
          ${['Minuman','Makanan','Snack','Paket'].map(c => `<option ${c===m.cat?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Harga (Rp)</label><input type="number" class="form-input" id="emnPrice" value="${m.price}" /></div>
    </div>
    <div class="form-group"><label>Deskripsi</label><input type="text" class="form-input" id="emnDesc" value="${m.desc}" /></div>
    <div class="form-group"><label>Badge</label><input type="text" class="form-input" id="emnBadge" value="${m.badge||''}" /></div>
    <button class="btn-full" onclick="saveEditMenu(${id})"><i class="fas fa-save"></i> Simpan</button>
  `;
  openAdminModal();
}

function saveEditMenu(id) {
  const m = state.menu.find(m => m.id === id);
  if (!m) return;
  m.name = document.getElementById('emnName').value;
  m.emoji = document.getElementById('emnEmoji').value || '🍽️';
  m.cat = document.getElementById('emnCat').value;
  m.price = parseInt(document.getElementById('emnPrice').value);
  m.desc = document.getElementById('emnDesc').value;
  m.badge = document.getElementById('emnBadge').value;
  DB.set('menu', state.menu);
  closeAdminModal(); renderPage('menu');
  showAdminToast('✅ Menu diupdate!', 'success');
}

function deleteMenu(id) {
  if (!confirm('Hapus menu ini?')) return;
  state.menu = state.menu.filter(m => m.id !== id);
  DB.set('menu', state.menu); renderPage('menu');
  showAdminToast('🗑️ Menu dihapus!', 'info');
}

// ==================== GALLERY PAGE ====================
function renderGalleryPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-images"></i> Kelola Gallery</h3>
      <button class="btn-add" onclick="openAddGalleryModal()"><i class="fas fa-plus"></i> Tambah Foto</button>
    </div>
    <div class="admin-cards-grid" id="galleryAdminGrid">
      ${state.gallery.map(g => `
        <div class="admin-gallery-card">
          <div class="agc-img" style="background:${g.color||'rgba(0,212,255,0.06)'}">${g.emoji}</div>
          <div class="agc-body">
            <div class="agc-label">${g.label}</div>
            <div class="agc-actions">
              <button class="btn-action" onclick="openEditGalleryModal(${g.id})"><i class="fas fa-pen"></i></button>
              <button class="btn-action danger" onclick="deleteGallery(${g.id})"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openAddGalleryModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Gallery';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Emoji / Ikon</label><input type="text" class="form-input" id="glEmoji" placeholder="🎱" /></div>
    <div class="form-group"><label>Keterangan</label><input type="text" class="form-input" id="glLabel" placeholder="Deskripsi foto..." /></div>
    <div class="form-group"><label>Warna Background (CSS)</label><input type="text" class="form-input" id="glColor" placeholder="rgba(0,212,255,0.1)" /></div>
    <button class="btn-full" onclick="saveAddGallery()"><i class="fas fa-plus"></i> Tambah</button>
  `;
  openAdminModal();
}

function saveAddGallery() {
  const emoji = document.getElementById('glEmoji').value.trim() || '🎱';
  const label = document.getElementById('glLabel').value.trim();
  const color = document.getElementById('glColor').value.trim() || 'rgba(0,212,255,0.08)';
  if (!label) { showAdminToast('Masukkan keterangan!', 'error'); return; }
  const newId = Math.max(...state.gallery.map(g => g.id), 0) + 1;
  state.gallery.push({ id: newId, emoji, label, color });
  DB.set('gallery', state.gallery);
  closeAdminModal(); renderPage('gallery');
  showAdminToast('✅ Gallery ditambahkan!', 'success');
}

function openEditGalleryModal(id) {
  const g = state.gallery.find(g => g.id === id);
  if (!g) return;
  document.getElementById('adminModalTitle').textContent = 'Edit Gallery';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Emoji</label><input type="text" class="form-input" id="eglEmoji" value="${g.emoji}" /></div>
    <div class="form-group"><label>Keterangan</label><input type="text" class="form-input" id="eglLabel" value="${g.label}" /></div>
    <div class="form-group"><label>Warna Background</label><input type="text" class="form-input" id="eglColor" value="${g.color||''}" /></div>
    <button class="btn-full" onclick="saveEditGallery(${id})"><i class="fas fa-save"></i> Simpan</button>
  `;
  openAdminModal();
}

function saveEditGallery(id) {
  const g = state.gallery.find(g => g.id === id);
  if (!g) return;
  g.emoji = document.getElementById('eglEmoji').value || '🎱';
  g.label = document.getElementById('eglLabel').value;
  g.color = document.getElementById('eglColor').value;
  DB.set('gallery', state.gallery);
  closeAdminModal(); renderPage('gallery');
  showAdminToast('✅ Gallery diupdate!', 'success');
}

function deleteGallery(id) {
  if (!confirm('Hapus foto ini?')) return;
  state.gallery = state.gallery.filter(g => g.id !== id);
  DB.set('gallery', state.gallery); renderPage('gallery');
  showAdminToast('🗑️ Foto dihapus!', 'info');
}

// ==================== PROMO PAGE ====================
function renderPromoPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-tag"></i> Kelola Promo & Harga</h3>
      <button class="btn-add" onclick="openAddPromoModal()"><i class="fas fa-plus"></i> Tambah Promo</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Nama</th><th>Harga</th><th>Aksi</th></tr></thead>
        <tbody id="promoTableBody">
          ${PRICE_LIST.map((p, i) => `
            <tr>
              <td>${p.name}</td>
              <td style="color:var(--neon-cyan)">${p.price}</td>
              <td><button class="btn-action" onclick="openEditPromoModal(${i})"><i class="fas fa-pen"></i></button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:24px">
      <h4 style="font-family:'Rajdhani',sans-serif;font-size:15px;letter-spacing:1px;color:var(--neon-cyan);margin-bottom:16px"><i class="fas fa-bullhorn"></i> Banner Promo Aktif</h4>
      <div style="background:var(--bg-card);border:1px solid var(--border-glass);border-radius:12px;padding:20px">
        <p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">Edit teks promo yang ditampilkan di running banner website.</p>
        <textarea class="form-textarea" id="promoTextarea" rows="6">${[
          'Weekday Special — Main 3 Jam Bayar 2 Jam!',
          'Daftar Member VIP — Diskon 20% Setiap Kunjungan',
          'Open Tournament Bulanan — Hadiah Total 5 Juta!',
          'Bundling Cafe + Main — Mulai 50K/Jam',
          'Happy Hour 10.00–14.00 — Harga Spesial!'
        ].join('\n')}</textarea>
        <button class="btn-full" style="margin-top:12px" onclick="showAdminToast('✅ Promo banner disimpan!','success')"><i class="fas fa-save"></i> Simpan Banner</button>
      </div>
    </div>
  `;
}

function openAddPromoModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Harga Baru';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Nama</label><input type="text" class="form-input" id="prName" placeholder="Meja Weekend" /></div>
    <div class="form-group"><label>Harga</label><input type="text" class="form-input" id="prPrice" placeholder="Rp 30.000/jam" /></div>
    <button class="btn-full" onclick="showAdminToast('✅ Harga ditambahkan!','success');closeAdminModal()"><i class="fas fa-plus"></i> Tambah</button>
  `;
  openAdminModal();
}

function openEditPromoModal(idx) {
  const p = PRICE_LIST[idx];
  document.getElementById('adminModalTitle').textContent = 'Edit Harga';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Nama</label><input type="text" class="form-input" id="eprName" value="${p.name}" /></div>
    <div class="form-group"><label>Harga</label><input type="text" class="form-input" id="eprPrice" value="${p.price}" /></div>
    <button class="btn-full" onclick="PRICE_LIST[${idx}].name=document.getElementById('eprName').value;PRICE_LIST[${idx}].price=document.getElementById('eprPrice').value;closeAdminModal();renderPage('promo');showAdminToast('✅ Harga diupdate!','success')"><i class="fas fa-save"></i> Simpan</button>
  `;
  openAdminModal();
}

// ==================== MEMBERS PAGE ====================
function renderMembersPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-users"></i> Kelola Member VIP</h3>
      <div class="section-actions">
        <button class="btn-add" onclick="openAddMemberModal()"><i class="fas fa-plus"></i> Tambah Member</button>
        <button class="btn-export" onclick="exportMembers()"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>
    <div class="filter-bar">
      <select class="filter-select" id="memberFilterSel" onchange="renderMemberTable()">
        <option value="all">Semua Paket</option>
        <option value="silver">Silver</option>
        <option value="gold">Gold</option>
        <option value="platinum">Platinum</option>
      </select>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Nama</th><th>Email</th><th>WA</th><th>Paket</th><th>Poin</th><th>Bergabung</th><th>Aksi</th></tr></thead>
        <tbody id="membersTbody"></tbody>
      </table>
    </div>
  `;
  renderMemberTable();
}

function renderMemberTable() {
  const filter = document.getElementById('memberFilterSel')?.value || 'all';
  let members = state.members;
  if (filter !== 'all') members = members.filter(m => m.paket === filter);
  const tbody = document.getElementById('membersTbody');
  if (!tbody) return;
  tbody.innerHTML = members.map(m => `
    <tr>
      <td style="font-family:'Orbitron',monospace;font-size:11px;color:var(--text-muted)">B805-${String(m.id).slice(-6)}</td>
      <td>${m.nama}</td>
      <td>${m.email}</td>
      <td><a href="https://wa.me/${m.wa}" target="_blank" style="color:var(--neon-green)">${m.wa}</a></td>
      <td><span class="td-status ${m.paket}">${m.paket}</span></td>
      <td style="color:var(--neon-cyan)">${m.poin}</td>
      <td>${m.bergabung}</td>
      <td>
        <div class="td-actions">
          <button class="btn-action" onclick="addMemberPoin(${m.id})" title="Tambah Poin"><i class="fas fa-plus"></i></button>
          <button class="btn-action" onclick="upgradeMember(${m.id})" title="Upgrade Paket"><i class="fas fa-arrow-up"></i></button>
          <button class="btn-action danger" onclick="deleteMember(${m.id})" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px">Belum ada member terdaftar</td></tr>';
}

function openAddMemberModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Member Manual';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Nama</label><input type="text" class="form-input" id="amNama" placeholder="Nama member..." /></div>
    <div class="form-group"><label>Email</label><input type="email" class="form-input" id="amEmail" placeholder="email@..." /></div>
    <div class="form-group"><label>WhatsApp</label><input type="tel" class="form-input" id="amWa" placeholder="08xx..." /></div>
    <div class="form-group"><label>Password</label><input type="password" class="form-input" id="amPass" placeholder="Min 6 karakter" /></div>
    <div class="form-group"><label>Paket</label>
      <select class="form-select" id="amPaket"><option value="silver">Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option></select>
    </div>
    <div class="form-group"><label>Poin Awal</label><input type="number" class="form-input" id="amPoin" value="100" /></div>
    <button class="btn-full" onclick="saveAddMember()"><i class="fas fa-plus"></i> Tambah Member</button>
  `;
  openAdminModal();
}

function saveAddMember() {
  const nm = document.getElementById('amNama').value.trim();
  const em = document.getElementById('amEmail').value.trim();
  const wa = document.getElementById('amWa').value.trim();
  const ps = document.getElementById('amPass').value;
  const pk = document.getElementById('amPaket').value;
  const poin = parseInt(document.getElementById('amPoin').value) || 100;
  if (!nm || !em || !wa || !ps) { showAdminToast('Lengkapi semua data!', 'error'); return; }
  state.members.push({ id: Date.now(), nama: nm, email: em, wa, password: ps, paket: pk, poin, bergabung: new Date().toLocaleDateString('id-ID'), visits: 0 });
  DB.set('members', state.members);
  closeAdminModal(); renderPage('members'); updateNavBadges();
  showAdminToast('✅ Member ditambahkan!', 'success');
}

function addMemberPoin(id) {
  const m = state.members.find(m => m.id === id);
  if (!m) return;
  m.poin += 50;
  DB.set('members', state.members); renderMemberTable();
  showAdminToast(`+50 poin untuk ${m.nama}!`, 'success');
}

function upgradeMember(id) {
  const m = state.members.find(m => m.id === id);
  if (!m) return;
  const tiers = ['silver', 'gold', 'platinum'];
  const next = tiers[Math.min(tiers.indexOf(m.paket) + 1, 2)];
  m.paket = next;
  DB.set('members', state.members); renderMemberTable();
  showAdminToast(`${m.nama} → ${next.toUpperCase()}!`, 'success');
}

function deleteMember(id) {
  if (!confirm('Hapus member ini?')) return;
  state.members = state.members.filter(m => m.id !== id);
  DB.set('members', state.members); renderPage('members'); updateNavBadges();
  showAdminToast('🗑️ Member dihapus!', 'info');
}

function exportMembers() {
  const blob = new Blob([JSON.stringify(state.members.map(m => ({...m, password: '***'})), null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'members-billiard805.json'; a.click();
  showAdminToast('📥 Data member diexport!', 'success');
}

// ==================== TOURNAMENT PAGE ====================
function renderTournamentPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-trophy"></i> Kelola Turnamen</h3>
      <button class="btn-add" onclick="openAddTournamentModal()"><i class="fas fa-plus"></i> Tambah Turnamen</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Tanggal</th><th>Judul</th><th>Hadiah</th><th>Format</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          ${state.tournament.map(t => `
            <tr>
              <td>${t.day} ${t.month}</td>
              <td>${t.title}</td>
              <td style="color:var(--neon-gold)">${t.prize}</td>
              <td>${t.format}</td>
              <td><span class="td-status ${{open:'available',soon:'booked',done:'occupied'}[t.status]}">${{open:'OPEN',soon:'SOON',done:'DONE'}[t.status]}</span></td>
              <td>
                <div class="td-actions">
                  <button class="btn-action" onclick="openEditTournamentModal(${t.id})"><i class="fas fa-pen"></i></button>
                  <button class="btn-action danger" onclick="deleteTournament(${t.id})"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAddTournamentModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Turnamen';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Judul</label><input type="text" class="form-input" id="tnTitle" placeholder="Nama turnamen..." /></div>
    <div class="form-group"><label>Deskripsi</label><textarea class="form-textarea" id="tnDesc" placeholder="Deskripsi..."></textarea></div>
    <div class="form-row">
      <div class="form-group"><label>Tanggal (angka)</label><input type="text" class="form-input" id="tnDay" placeholder="15" /></div>
      <div class="form-group"><label>Bulan (singkat)</label><input type="text" class="form-input" id="tnMonth" placeholder="JUN" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Hadiah</label><input type="text" class="form-input" id="tnPrize" placeholder="Rp 5.000.000" /></div>
      <div class="form-group"><label>Format</label><input type="text" class="form-input" id="tnFormat" placeholder="8-Ball" /></div>
    </div>
    <div class="form-group"><label>Slot</label><input type="text" class="form-input" id="tnSlots" placeholder="32 Slot" /></div>
    <div class="form-group"><label>Status</label>
      <select class="form-select" id="tnStatus"><option value="open">Open</option><option value="soon">Soon</option><option value="done">Done</option></select>
    </div>
    <button class="btn-full" onclick="saveAddTournament()"><i class="fas fa-plus"></i> Tambah Turnamen</button>
  `;
  openAdminModal();
}

function saveAddTournament() {
  const title = document.getElementById('tnTitle').value.trim();
  if (!title) { showAdminToast('Masukkan judul!', 'error'); return; }
  const newId = Math.max(...state.tournament.map(t => t.id), 0) + 1;
  state.tournament.push({
    id: newId,
    title, desc: document.getElementById('tnDesc').value,
    day: document.getElementById('tnDay').value,
    month: document.getElementById('tnMonth').value,
    prize: document.getElementById('tnPrize').value,
    format: document.getElementById('tnFormat').value,
    slots: document.getElementById('tnSlots').value,
    status: document.getElementById('tnStatus').value,
    regUrl: '#'
  });
  DB.set('tournament', state.tournament);
  closeAdminModal(); renderPage('tournament');
  showAdminToast('✅ Turnamen ditambahkan!', 'success');
}

function openEditTournamentModal(id) {
  const t = state.tournament.find(t => t.id === id);
  if (!t) return;
  document.getElementById('adminModalTitle').textContent = 'Edit Turnamen';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Judul</label><input type="text" class="form-input" id="etnTitle" value="${t.title}" /></div>
    <div class="form-row">
      <div class="form-group"><label>Tanggal</label><input type="text" class="form-input" id="etnDay" value="${t.day}" /></div>
      <div class="form-group"><label>Bulan</label><input type="text" class="form-input" id="etnMonth" value="${t.month}" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Hadiah</label><input type="text" class="form-input" id="etnPrize" value="${t.prize}" /></div>
      <div class="form-group"><label>Format</label><input type="text" class="form-input" id="etnFormat" value="${t.format}" /></div>
    </div>
    <div class="form-group"><label>Status</label>
      <select class="form-select" id="etnStatus">
        ${['open','soon','done'].map(s => `<option value="${s}" ${s===t.status?'selected':''}>${s.toUpperCase()}</option>`).join('')}
      </select>
    </div>
    <button class="btn-full" onclick="saveEditTournament(${id})"><i class="fas fa-save"></i> Simpan</button>
  `;
  openAdminModal();
}

function saveEditTournament(id) {
  const t = state.tournament.find(t => t.id === id);
  if (!t) return;
  t.title = document.getElementById('etnTitle').value;
  t.day = document.getElementById('etnDay').value;
  t.month = document.getElementById('etnMonth').value;
  t.prize = document.getElementById('etnPrize').value;
  t.format = document.getElementById('etnFormat').value;
  t.status = document.getElementById('etnStatus').value;
  DB.set('tournament', state.tournament);
  closeAdminModal(); renderPage('tournament');
  showAdminToast('✅ Turnamen diupdate!', 'success');
}

function deleteTournament(id) {
  if (!confirm('Hapus turnamen ini?')) return;
  state.tournament = state.tournament.filter(t => t.id !== id);
  DB.set('tournament', state.tournament); renderPage('tournament');
  showAdminToast('🗑️ Turnamen dihapus!', 'info');
}

// ==================== LEADERBOARD PAGE ====================
function renderLeaderboardPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-ranking-star"></i> Kelola Leaderboard</h3>
      <button class="btn-add" onclick="openAddPlayerModal()"><i class="fas fa-plus"></i> Tambah Pemain</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Rank</th><th>Nama</th><th>Poin</th><th>Game</th><th>Menang</th><th>Badge</th><th>Aksi</th></tr></thead>
        <tbody>
          ${state.leaderboard.map((p, i) => `
            <tr>
              <td style="font-family:'Orbitron',monospace;font-weight:700;color:${i===0?'var(--neon-gold)':i===1?'#C0C0C0':i===2?'#CD7F32':'var(--text-muted)'}">#${p.rank}</td>
              <td>${p.name}</td>
              <td style="color:var(--neon-cyan)">${p.pts.toLocaleString('id-ID')}</td>
              <td>${p.games}</td>
              <td>${p.wins}</td>
              <td><span class="td-status available" style="font-size:10px">${p.badge}</span></td>
              <td>
                <div class="td-actions">
                  <button class="btn-action" onclick="openEditPlayerModal(${i})"><i class="fas fa-pen"></i></button>
                  <button class="btn-action danger" onclick="deletePlayer(${i})"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAddPlayerModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Pemain';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-row">
      <div class="form-group"><label>Nama</label><input type="text" class="form-input" id="plName" placeholder="NAMA" /></div>
      <div class="form-group"><label>Poin</label><input type="number" class="form-input" id="plPts" placeholder="1000" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Games</label><input type="number" class="form-input" id="plGames" placeholder="10" /></div>
      <div class="form-group"><label>Menang</label><input type="number" class="form-input" id="plWins" placeholder="7" /></div>
    </div>
    <div class="form-group"><label>Badge</label><input type="text" class="form-input" id="plBadge" placeholder="Intermediate" /></div>
    <button class="btn-full" onclick="saveAddPlayer()"><i class="fas fa-plus"></i> Tambah Pemain</button>
  `;
  openAdminModal();
}

function saveAddPlayer() {
  const name = document.getElementById('plName').value.trim().toUpperCase();
  const pts = parseInt(document.getElementById('plPts').value) || 0;
  if (!name) { showAdminToast('Masukkan nama!', 'error'); return; }
  state.leaderboard.push({ rank: state.leaderboard.length + 1, name, pts, games: parseInt(document.getElementById('plGames').value)||0, wins: parseInt(document.getElementById('plWins').value)||0, badge: document.getElementById('plBadge').value || 'Beginner' });
  state.leaderboard.sort((a,b) => b.pts - a.pts).forEach((p,i) => p.rank = i+1);
  DB.set('leaderboard', state.leaderboard);
  closeAdminModal(); renderPage('leaderboard');
  showAdminToast('✅ Pemain ditambahkan!', 'success');
}

function openEditPlayerModal(idx) {
  const p = state.leaderboard[idx];
  document.getElementById('adminModalTitle').textContent = 'Edit Pemain';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-row">
      <div class="form-group"><label>Nama</label><input type="text" class="form-input" id="eplName" value="${p.name}" /></div>
      <div class="form-group"><label>Poin</label><input type="number" class="form-input" id="eplPts" value="${p.pts}" /></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Games</label><input type="number" class="form-input" id="eplGames" value="${p.games}" /></div>
      <div class="form-group"><label>Menang</label><input type="number" class="form-input" id="eplWins" value="${p.wins}" /></div>
    </div>
    <div class="form-group"><label>Badge</label><input type="text" class="form-input" id="eplBadge" value="${p.badge}" /></div>
    <button class="btn-full" onclick="saveEditPlayer(${idx})"><i class="fas fa-save"></i> Simpan</button>
  `;
  openAdminModal();
}

function saveEditPlayer(idx) {
  const p = state.leaderboard[idx];
  p.name = document.getElementById('eplName').value.toUpperCase();
  p.pts = parseInt(document.getElementById('eplPts').value);
  p.games = parseInt(document.getElementById('eplGames').value);
  p.wins = parseInt(document.getElementById('eplWins').value);
  p.badge = document.getElementById('eplBadge').value;
  state.leaderboard.sort((a,b) => b.pts - a.pts).forEach((p,i) => p.rank = i+1);
  DB.set('leaderboard', state.leaderboard);
  closeAdminModal(); renderPage('leaderboard');
  showAdminToast('✅ Pemain diupdate!', 'success');
}

function deletePlayer(idx) {
  if (!confirm('Hapus pemain ini?')) return;
  state.leaderboard.splice(idx, 1);
  state.leaderboard.forEach((p,i) => p.rank = i+1);
  DB.set('leaderboard', state.leaderboard); renderPage('leaderboard');
  showAdminToast('🗑️ Pemain dihapus!', 'info');
}

// ==================== TESTIMONI PAGE ====================
function renderTestimoniPage(el) {
  el.innerHTML = `
    <div class="section-header">
      <h3><i class="fas fa-star"></i> Kelola Testimoni</h3>
      <button class="btn-add" onclick="openAddTestimoniModal()"><i class="fas fa-plus"></i> Tambah Review</button>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead><tr><th>Nama</th><th>Badge</th><th>Bintang</th><th>Review</th><th>Aksi</th></tr></thead>
        <tbody>
          ${state.testimoni.map((t, i) => `
            <tr>
              <td>${t.name}</td>
              <td>${t.badge}</td>
              <td style="color:var(--neon-gold)">${'★'.repeat(t.stars)}</td>
              <td style="color:var(--text-muted);max-width:300px">${t.text.substring(0,80)}...</td>
              <td>
                <div class="td-actions">
                  <button class="btn-action danger" onclick="deleteTestimoni(${i})"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAddTestimoniModal() {
  document.getElementById('adminModalTitle').textContent = 'Tambah Testimoni';
  document.getElementById('adminModalBody').innerHTML = `
    <div class="form-group"><label>Nama</label><input type="text" class="form-input" id="tsName" placeholder="Nama pelanggan..." /></div>
    <div class="form-group"><label>Badge / Status</label><input type="text" class="form-input" id="tsBadge" placeholder="Member Gold / Pengunjung..." /></div>
    <div class="form-group"><label>Bintang (1-5)</label><input type="number" class="form-input" id="tsStars" value="5" min="1" max="5" /></div>
    <div class="form-group"><label>Review</label><textarea class="form-textarea" id="tsText" placeholder="Tulis review..."></textarea></div>
    <button class="btn-full" onclick="saveAddTestimoni()"><i class="fas fa-plus"></i> Tambah</button>
  `;
  openAdminModal();
}

function saveAddTestimoni() {
  const name = document.getElementById('tsName').value.trim();
  const badge = document.getElementById('tsBadge').value.trim();
  const stars = parseInt(document.getElementById('tsStars').value) || 5;
  const text = document.getElementById('tsText').value.trim();
  if (!name || !text) { showAdminToast('Lengkapi data!', 'error'); return; }
  state.testimoni.push({ id: Date.now(), name, badge, stars, text });
  DB.set('testimoni', state.testimoni);
  closeAdminModal(); renderPage('testimoni');
  showAdminToast('✅ Testimoni ditambahkan!', 'success');
}

function deleteTestimoni(idx) {
  if (!confirm('Hapus testimoni ini?')) return;
  state.testimoni.splice(idx, 1);
  DB.set('testimoni', state.testimoni); renderPage('testimoni');
  showAdminToast('🗑️ Testimoni dihapus!', 'info');
}

// ==================== SETTINGS PAGE ====================
function renderSettingsPage(el) {
  el.innerHTML = `
    <div class="section-header"><h3><i class="fas fa-cog"></i> Pengaturan Website</h3></div>
    <div class="settings-grid">
      <div class="settings-card">
        <h4><i class="fas fa-info-circle"></i> Info Website</h4>
        <div class="form-group"><label>Nama Tempat</label><input type="text" class="form-input" value="BILLIARD 805 Parung" /></div>
        <div class="form-group"><label>Tagline</label><input type="text" class="form-input" value="Play • Chill • Compete" /></div>
        <div class="form-group"><label>Nomor WhatsApp</label><input type="text" class="form-input" value="+6281234567890" /></div>
        <div class="form-group"><label>Alamat</label><textarea class="form-textarea" rows="2">Jl. Raya Parung No.Km.47, Bogor</textarea></div>
        <button class="btn-full" onclick="showAdminToast('✅ Pengaturan disimpan!','success')"><i class="fas fa-save"></i> Simpan</button>
      </div>
      <div class="settings-card">
        <h4><i class="fas fa-clock"></i> Jam Operasional</h4>
        <div class="form-group"><label>Senin – Jumat</label><input type="text" class="form-input" value="10.00 – 02.00 WIB" /></div>
        <div class="form-group"><label>Sabtu – Minggu</label><input type="text" class="form-input" value="09.00 – 03.00 WIB" /></div>
        <div class="form-group"><label>Hari Libur</label><input type="text" class="form-input" value="09.00 – 03.00 WIB" /></div>
        <button class="btn-full" onclick="showAdminToast('✅ Jam operasional disimpan!','success')"><i class="fas fa-save"></i> Simpan</button>
      </div>
      <div class="settings-card">
        <h4><i class="fas fa-share-alt"></i> Sosial Media</h4>
        <div class="form-group"><label>Instagram</label><input type="text" class="form-input" placeholder="@billiard805" /></div>
        <div class="form-group"><label>TikTok</label><input type="text" class="form-input" placeholder="@billiard805" /></div>
        <div class="form-group"><label>YouTube</label><input type="text" class="form-input" placeholder="Billiard 805" /></div>
        <button class="btn-full" onclick="showAdminToast('✅ Sosmed disimpan!','success')"><i class="fas fa-save"></i> Simpan</button>
      </div>
      <div class="settings-card">
        <h4><i class="fas fa-toggle-on"></i> Fitur Website</h4>
        <div class="toggle-row"><span class="toggle-label">Booking Online Aktif</span><label class="toggle-switch"><input type="checkbox" checked /><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><span class="toggle-label">Live Table Status</span><label class="toggle-switch"><input type="checkbox" checked /><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><span class="toggle-label">Member Registration</span><label class="toggle-switch"><input type="checkbox" checked /><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><span class="toggle-label">Ambience Music</span><label class="toggle-switch"><input type="checkbox" checked /><span class="toggle-slider"></span></label></div>
        <div class="toggle-row"><span class="toggle-label">PWA Install Popup</span><label class="toggle-switch"><input type="checkbox" checked /><span class="toggle-slider"></span></label></div>
      </div>
    </div>
  `;
}

// ==================== DATABASE PAGE ====================
function renderDatabasePage(el) {
  const dbKeys = ['tables','menu','gallery','tournament','testimoni','leaderboard','bookings','members'];
  const sizes = dbKeys.map(k => {
    const val = localStorage.getItem('b805_' + k) || '';
    return { key: k, size: (val.length / 1024).toFixed(2) };
  });
  const totalSize = sizes.reduce((a, s) => a + parseFloat(s.size), 0).toFixed(2);

  el.innerHTML = `
    <div class="section-header"><h3><i class="fas fa-database"></i> Manajemen Database</h3></div>
    <div class="db-cards">
      <div class="db-card">
        <h4><i class="fas fa-hdd"></i> Total Penyimpanan</h4>
        <div class="db-size">${totalSize} KB</div>
        <p>dari ~5MB localStorage limit</p>
      </div>
      <div class="db-card">
        <h4><i class="fas fa-table-list"></i> Total Record</h4>
        <div class="db-size">${state.tables.length + state.bookings.length + state.members.length}</div>
        <p>Meja + Booking + Member</p>
      </div>
      <div class="db-card">
        <h4><i class="fas fa-clock-rotate-left"></i> Last Modified</h4>
        <div class="db-size" style="font-size:16px">${new Date().toLocaleDateString('id-ID')}</div>
        <p>${new Date().toLocaleTimeString('id-ID')}</p>
      </div>
    </div>

    <div style="background:var(--bg-card);border:1px solid var(--border-glass);border-radius:var(--radius);padding:22px;margin-bottom:20px">
      <h4 style="font-family:'Rajdhani',sans-serif;font-size:15px;letter-spacing:1px;color:var(--neon-cyan);margin-bottom:16px"><i class="fas fa-chart-bar"></i> Detail Per Koleksi</h4>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Koleksi</th><th>Jumlah</th><th>Ukuran</th><th>Aksi</th></tr></thead>
          <tbody>
            ${sizes.map(s => `
              <tr>
                <td style="font-family:'Rajdhani',sans-serif;font-weight:700">${s.key}</td>
                <td style="color:var(--neon-cyan)">${(state[s.key]||[]).length || '—'}</td>
                <td>${s.size} KB</td>
                <td><button class="btn-action danger" onclick="resetCollection('${s.key}')"><i class="fas fa-trash"></i> Reset</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
      <button class="btn-export" onclick="exportAllData()"><i class="fas fa-download"></i> Export Semua Data (JSON)</button>
      <button class="btn-add" onclick="document.getElementById('importAllFile').click()"><i class="fas fa-upload"></i> Import Data JSON</button>
      <input type="file" id="importAllFile" accept=".json" style="display:none" onchange="importAllData(event)" />
      <button class="btn-danger" onclick="resetAllData()"><i class="fas fa-exclamation-triangle"></i> RESET SEMUA DATA</button>
    </div>
  `;
}

function exportAllData() {
  const allData = {};
  ['tables','menu','gallery','tournament','testimoni','leaderboard','bookings','members'].forEach(k => { allData[k] = state[k]; });
  const blob = new Blob([JSON.stringify(allData, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `billiard805-backup-${Date.now()}.json`; a.click();
  showAdminToast('📥 Semua data berhasil diexport!', 'success');
}

function importAllData(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      Object.keys(data).forEach(k => { if (state[k] !== undefined) { state[k] = data[k]; DB.set(k, data[k]); } });
      showAdminToast('📤 Data berhasil diimport!', 'success');
      renderPage(adminState.currentPage);
    } catch { showAdminToast('File tidak valid!', 'error'); }
  };
  reader.readAsText(file);
}

function resetCollection(key) {
  if (!confirm(`Reset koleksi "${key}"? Data tidak bisa dikembalikan!`)) return;
  const defaults = { tables: DEFAULT_TABLES, menu: DEFAULT_MENU, gallery: DEFAULT_GALLERY, tournament: DEFAULT_TOURNAMENT, testimoni: DEFAULT_TESTIMONI, leaderboard: DEFAULT_LEADERBOARD, bookings: [], members: [], faq: DEFAULT_FAQ };
  state[key] = defaults[key] || [];
  DB.set(key, state[key]);
  renderPage('database');
  showAdminToast(`✅ Koleksi "${key}" direset ke default!`, 'success');
}

function resetAllData() {
  if (!confirm('RESET SEMUA DATA ke default? Semua booking & member akan terhapus!')) return;
  if (!confirm('Konfirmasi sekali lagi — ini tidak bisa dibatalkan!')) return;
  ['tables','menu','gallery','tournament','testimoni','leaderboard','bookings','members','faq'].forEach(k => {
    const defaults = { tables: DEFAULT_TABLES, menu: DEFAULT_MENU, gallery: DEFAULT_GALLERY, tournament: DEFAULT_TOURNAMENT, testimoni: DEFAULT_TESTIMONI, leaderboard: DEFAULT_LEADERBOARD, bookings: [], members: [], faq: DEFAULT_FAQ };
    state[k] = defaults[k] || [];
    DB.set(k, state[k]);
  });
  renderPage('database');
  showAdminToast('🔄 Semua data direset!', 'info');
}

// ==================== MODAL UTILS ====================
function openAdminModal() {
  document.getElementById('adminModal').classList.add('active');
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('active');
}

document.getElementById('adminModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('adminModal')) closeAdminModal();
});

// ==================== TOAST ====================
function showAdminToast(msg, type = 'info') {
  const container = document.getElementById('adminToastContainer');
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 3500);
}
