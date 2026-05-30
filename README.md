# BILLIARD 805 Parung — Website Premium

> Play • Chill • Compete | Jl. Raya Parung, Bogor, Jawa Barat

Website billiard premium modern untuk **BILLIARD 805 Parung**, dibangun dengan HTML, CSS, JavaScript murni dan localStorage sebagai database. Siap upload ke GitHub Pages.

---

## 🚀 Fitur Lengkap

### Frontend Publik
- ✅ Landing page premium modern (dark/neon aesthetic)
- ✅ Dark mode & Light mode (toggle + auto)
- ✅ Loading screen cinematic
- ✅ Navbar sticky modern + hamburger mobile
- ✅ Hero section full-screen dengan animasi partikel
- ✅ Live digital clock di navbar
- ✅ Animated stats counter
- ✅ Promo banner slider otomatis (marquee)
- ✅ Tentang kami + jam operasional
- ✅ **Live Table Status** — status meja realtime (kosong/dipakai/booking)
- ✅ Filter & search meja
- ✅ Sistem favorit meja
- ✅ Timer bermain per meja
- ✅ **Booking meja online** dengan form modern
- ✅ Estimasi harga otomatis
- ✅ Booking via WhatsApp
- ✅ Riwayat booking (localStorage)
- ✅ Export/Import data booking JSON
- ✅ **Menu Cafe** dengan filter kategori
- ✅ **Paket Member VIP** (Silver/Gold/Platinum)
- ✅ **Event & Tournament** section
- ✅ **Gallery** interaktif dengan lightbox
- ✅ Testimoni slider otomatis
- ✅ **Leaderboard pemain** dengan podium
- ✅ FAQ accordion
- ✅ Google Maps embed
- ✅ Statistik pengunjung
- ✅ Floating WhatsApp button
- ✅ Back to top button
- ✅ Toast notification
- ✅ Ripple button effect
- ✅ Custom cursor (desktop)
- ✅ Scroll reveal animation
- ✅ PWA support + install popup
- ✅ Service Worker (offline mode basic)
- ✅ SEO meta lengkap + Open Graph + Schema

### Sistem Member
- ✅ Login & Register member
- ✅ Paket Silver/Gold/Platinum
- ✅ Profil member dengan QR code (dummy)
- ✅ Sistem poin reward
- ✅ Riwayat booking per member

### Admin Dashboard (`dashboard.html`)
**Cara masuk:** Klik logo "805" di navbar sebanyak **5x** → popup login admin

**Default login:**
- Email: `admin@billiard.com`  
- Password: `admin123`

**Fitur Admin:**
- ✅ Dashboard statistik dengan chart
- ✅ Kelola meja (tambah/edit/hapus/ganti status)
- ✅ Kelola booking (konfirmasi/hapus/export)
- ✅ Kelola menu cafe
- ✅ Kelola gallery
- ✅ Kelola promo & harga
- ✅ Kelola member VIP
- ✅ Kelola turnamen
- ✅ Kelola leaderboard
- ✅ Kelola testimoni
- ✅ Pengaturan website
- ✅ Manajemen database (export/import/reset)
- ✅ Dark/light mode dashboard
- ✅ Sidebar modern responsive

---

## 📁 Struktur File

```
billiard805/
├── index.html          ← Halaman utama
├── style.css           ← Semua styling website
├── app.js              ← Logic website utama
├── dashboard.html      ← Admin panel
├── dashboard.css       ← Styling admin
├── dashboard.js        ← Logic admin
├── manifest.json       ← PWA manifest
├── service-worker.js   ← PWA service worker
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

---

## 🌐 Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal: `billiard805`)
2. Upload semua file ini
3. Masuk ke Settings → Pages → Source: `main` branch
4. Website live di: `https://username.github.io/billiard805`

---

## 💾 Database (localStorage)

Semua data disimpan di `localStorage` browser dengan prefix `b805_`:

| Key | Isi |
|-----|-----|
| `b805_tables` | Data meja billiard |
| `b805_bookings` | Data booking |
| `b805_members` | Data member |
| `b805_menu` | Menu cafe |
| `b805_gallery` | Gallery foto |
| `b805_tournament` | Data turnamen |
| `b805_leaderboard` | Ranking pemain |
| `b805_testimoni` | Review pelanggan |
| `b805_adminSession` | Session admin |

---

## 🎨 Tech Stack

- HTML5 semantic
- CSS3 (Glassmorphism, CSS Variables, Animations)
- Vanilla JavaScript ES6+
- Font: Orbitron + Rajdhani + Inter
- Icons: Font Awesome 6.5
- localStorage (database)
- Service Worker (PWA)

---

## 📞 Info Tempat

**BILLIARD 805 Parung**  
📍 Jl. Raya Parung No.Km.47, Jabon Mekar, Kec. Parung, Kabupaten Bogor, Jawa Barat 16330  
📱 +62 812-3456-7890  
🕐 Setiap Hari 10.00 – 02.00 WIB  

---

*Built with ❤️ for the Billiard 805 community — 2026*
