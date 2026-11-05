# Kampung Mini — React + Supabase

Migrasi Kampung Mini ke React, JavaScript ES Modules, Vite, dan Supabase. Canvas 2D village engine tetap dipertahankan sebagai modul mandiri agar animasi peta tidak bercampur dengan state/UI React.

## Stack

- React 18 + Vite
- JavaScript ES Modules
- Canvas 2D engine untuk peta isometrik, rumah, warga, animasi, cuaca/waktu, sungai, air terjun, dan interaksi zoom/pan
- Supabase Auth, PostgreSQL, Row Level Security, dan Realtime
- Cloudflare Pages untuk hosting static build

## Struktur

```text
src/
├── components/       # Header, navigasi, peta
├── engine/           # Canvas engine terisolasi dari React
├── features/
│   ├── account/      # Daftar, login, profil warga
│   ├── chat/         # Chat realtime
│   └── village/      # Ruang untuk fitur kampung berikutnya
├── services/         # Supabase queries dan subscriptions
├── styles/           # Global styling
├── App.jsx           # Komposisi halaman dan state aplikasi
├── config.js         # Env configuration
└── main.jsx          # React entry point
```

## Menjalankan lokal

1. Install Node.js 20+.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi konfigurasi Supabase:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

5. Jalankan SQL pada `supabase-setup.sql` melalui Supabase SQL Editor.
6. Jalankan `npm run dev`.
7. Buat production build dengan `npm run build`.

> Gunakan Publishable/anon key saja di browser. Jangan pernah masukkan `service_role` atau secret key ke frontend.

## Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
- Branch produksi: sesuaikan dengan branch deployment repo.

Tambahkan domain Cloudflare Pages ke Supabase Authentication → URL Configuration → Redirect URLs. Site URL diarahkan ke domain produksi.

## Catatan migrasi

- Engine gambar peta dipertahankan dari versi HTML terakhir, lalu dibungkus sebagai `createVillageEngine(canvas)` dengan lifecycle `destroy()` agar aman dipakai di React.
- Data warga dan chat dipindahkan ke React state.
- Akses database dipusatkan di `src/services/community.js`.
- Pengaturan Supabase menggunakan environment variables Vite, bukan nilai rahasia yang ditanam langsung di source.
- Belum ada koneksi ke project Supabase tertentu sampai `.env.local` diisi.
