# 🌙 Zakat Report System

Sistem manajemen dan pelaporan zakat berbasis web yang dibangun dengan React, TypeScript, dan Supabase. Aplikasi ini memudahkan pengelolaan berbagai jenis zakat termasuk Zakat Fitrah, Zakat Maal, Fidyah, dan Infaq/Sedekah.

## Fitur Utama

-  **Dashboard Interaktif** - Visualisasi data dengan summary cards dan charts
-  **Multi-Jenis Zakat** - Support untuk Zakat Fitrah, Zakat Maal, Fidyah, dan Infaq
-  **CRUD Operations** - Tambah, edit, lihat, dan hapus catatan zakat
-  **Export Data** - Export laporan dalam format pdf dan csv
-  **Authentication** - Sistem login yang aman
-  **Responsive Design** - Tampilan optimal di semua perangkat
-  **Modern UI** - Menggunakan Shadcn/ui components

## Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Backend:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **State Management:** React Context API
- **Form Handling:** Custom hooks

## Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall atau memiliki:

- Node.js (v18 atau lebih baru)
- npm atau yarn
- Akun Supabase

## Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd zakat-report-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Buat file `.env` di root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Supabase Database**
   
   Jalankan migrations di Supabase:
   - Buka Supabase Dashboard
   - Jalankan SQL scripts dari folder `supabase/migrations/`

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:5173`

## 📁 Struktur Project

```
src/
├── components/          # Komponen React
│   ├── dashboard/      # Komponen dashboard
│   ├── ui/             # Shadcn/ui components
│   ├── zakat-form/     # Form sections
│   ├── zakat-list/     # List components
│   └── zakat-table/    # Table components
├── contexts/           # React Context (Auth)
├── hooks/              # Custom React hooks
├── integrations/       # Integrasi eksternal (Supabase)
├── lib/                # Utility libraries
├── pages/              # Halaman aplikasi
├── services/           # Business logic & API calls
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## Cara Penggunaan

### 1. Login
- Buka aplikasi dan masuk ke halaman login
- Masukkan kredensial

### 2. Dashboard
- Lihat ringkasan total zakat
- Analisis data melalui charts
- Review laporan terbaru

### 3. Tambah Catatan Zakat
- Klik "Add Record" atau "Tambah Data"
- Isi form dengan informasi muzakki
- Pilih jenis zakat yang akan dicatat:
  - **Zakat Fitrah** - Zakat wajib di bulan Ramadan
  - **Zakat Maal** - Zakat harta (emas, perak, uang, dll)
  - **Fidyah** - Pengganti puasa yang tidak dilakukan
  - **Infaq** - Sedekah sukarela
- Submit form

### 4. Kelola Data
- **View** - Lihat detail catatan
- **Edit** - Ubah data yang sudah ada
- **Delete** - Hapus catatan
- **Export** - Download laporan

## Database Schema

### Tabel `zakat_records`
- `id` - UUID primary key
- `name` - Nama muzakki
- `address` - Alamat
- `phone` - Nomor telepon
- `zakat_fitrah_amount` - Jumlah zakat fitrah
- `zakat_maal_amount` - Jumlah zakat maal
- `fidyah_amount` - Jumlah fidyah
- `infaq_amount` - Jumlah infaq
- `total_amount` - Total keseluruhan
- `payment_date` - Tanggal pembayaran
- `notes` - Catatan tambahan
- `created_at` - Timestamp pembuatan
- `updated_at` - Timestamp update

## Security

- Authentication menggunakan Supabase Auth
- Row Level Security (RLS) enabled
- Environment variables untuk sensitive data
- Input validation pada semua form

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Lampiran
<img width="1920" height="928" alt="Screenshot (194)" src="https://github.com/user-attachments/assets/c028ddde-97e5-4b8c-90ea-e999dd1b0c16" />
<img width="1920" height="931" alt="image" src="https://github.com/user-attachments/assets/539d1b22-e178-4bab-b7fc-20cc2811a365" />


---



Made with ❤️ for better zakat management
