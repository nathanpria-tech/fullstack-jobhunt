# JobHunt Frontend

Frontend portal lowongan kerja dan rekrutmen **JobHunt** yang dibangun dengan React + Vite, Tailwind CSS, TanStack Query, dan Axios. Seluruh komponen, halaman, autentikasi berbasis role (Job Seeker & Recruiter), serta integrasi API backend telah diimplementasikan secara komprehensif.

---

## 🚀 Panduan Menjalankan Frontend

### 1. Masuk ke Direktori Frontend
```bash
cd frontend
```

### 2. Instal Dependensi (jika belum diinstal)
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Server Vite akan berjalan secara default pada port `3000`:
- **Frontend URL**: [http://localhost:3000](http://localhost:3000)

### 4. Menjalankan Build Produksi
```bash
npm run build
npm run preview
```

---

## 🔌 Integrasi Backend

Frontend berkomunikasi dengan backend lokal di `http://localhost:5001/api`. Atur base URL melalui `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5001/api
```

Untuk panduan setup database, backend, migrasi, dan deployment, lihat [README proyek](../README.md).

### Seluruh Endpoint yang Berhasil Terhubung:
| Endpoint | Method | Role | Status Integrasi | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Public | ✅ Berhasil | Registrasi akun baru (`job_seeker` / `recruiter`) |
| `/auth/login` | `POST` | Public | ✅ Berhasil | Login & penerimaan JWT token |
| `/auth/me` | `GET` | Authenticated | ✅ Berhasil | Pengambilan data profil pengguna yang login |
| `/jobs` | `GET` | Public | ✅ Berhasil | Katalog lowongan, pencarian keyword, lokasi, tipe, gaji min/max, sort, & pagination |
| `/jobs/:id` | `GET` | Public | ✅ Berhasil | Detail spesifik lowongan, perusahaan, dan recruiter |
| `/jobs/mine` | `GET` | Recruiter | ✅ Berhasil | Daftar seluruh lowongan yang dibuat recruiter |
| `/jobs` | `POST` | Recruiter | ✅ Berhasil | Pembuatan lowongan pekerjaan baru |
| `/jobs/:id` | `PUT` | Recruiter | ✅ Berhasil | Edit data lowongan & toggle status aktif/tutup |
| `/jobs/:id` | `DELETE` | Recruiter | ✅ Berhasil | Penghapusan lowongan pekerjaan |
| `/jobs/:id/apply` | `POST` | Job Seeker | ✅ Berhasil | Pengiriman lamaran kerja & cover letter |
| `/jobs/:id/applicants`| `GET` | Recruiter | ✅ Berhasil | Daftar pelamar untuk lowongan tertentu |
| `/applications/mine` | `GET` | Job Seeker | ✅ Berhasil | Riwayat lamaran yang dikirim & statusnya |
| `/applications/:id` | `PUT` | Recruiter | ✅ Diimplementasikan | Pembaruan status lamaran (`pending`, `reviewed`, `rejected`) |

---

## 📁 Struktur Direktori Frontend

```text
frontend/
├── index.html                  # HTML entry point dengan SEO meta tags & font
├── vite.config.js              # Konfigurasi Vite & Tailwind CSS v4
├── package.json
└── src/
    ├── App.jsx                 # Provider root (QueryClient, Auth, Toast, Router)
    ├── main.jsx                # DOM mounting
    ├── index.css               # Tema warna cream, aksen oranye, dan utility Tailwind
    ├── components/
    │   └── common/
    │       ├── Badge.jsx       # Badges (Tipe Pekerjaan, Status Lamaran, Role)
    │       ├── EmptyState.jsx  # Tampilan state kosong yang informatif
    │       ├── ErrorState.jsx  # Tampilan state gagal dengan tombol coba lagi
    │       ├── Footer.jsx      # Footer modern & informatif
    │       ├── JobCard.jsx     # Card lowongan dengan hover effect & detail gaji
    │       ├── Modal.jsx       # Modal dialog aksesibel
    │       ├── Navbar.jsx      # Navigasi responsif (Desktop & Mobile drawer)
    │       ├── ProtectedRoute.jsx # Guard route berbasis status login & role
    │       └── Skeleton.jsx    # Shimmer skeleton loader
    ├── contexts/
    │   ├── AuthContext.jsx     # State autentikasi JWT, role, & sinkronisasi user
    │   └── ToastContext.jsx    # Sistem notifikasi toast melayang
    ├── layouts/
    │   └── MainLayout.jsx      # Layout utama (Navbar, Content, Footer)
    ├── lib/
    │   └── api.js              # Axios instance dengan interceptor Bearer JWT & 401 handler
    ├── pages/
    │   ├── public/
    │   │   ├── LandingPage.jsx # Hero, pencarian cepat, statistik, & lowongan unggulan
    │   │   ├── JobsPage.jsx    # Katalog lowongan dengan filter lengkap & pagination
    │   │   ├── JobDetailPage.jsx # Detail pekerjaan & modal pengiriman lamaran
    │   │   ├── LoginPage.jsx   # Form masuk dengan validasi
    │   │   ├── RegisterPage.jsx# Form registrasi dengan selector role
    │   │   └── NotFoundPage.jsx# Halaman 404
    │   ├── job_seeker/
    │   │   ├── ApplicationsPage.jsx # Riwayat lamaran dengan filter status & cover letter
    │   │   └── ProfilePage.jsx # Profil akun pencari kerja
    │   └── recruiter/
    │       ├── DashboardPage.jsx # Ringkasan metrik, tabel lowongan, & aksi cepat
    │       ├── CreateJobPage.jsx # Form pembuatan lowongan baru
    │       ├── EditJobPage.jsx   # Form pengeditan lowongan
    │       └── ApplicantsPage.jsx# Daftar kandidat pelamar & pengubah status lamaran
    ├── routes/
    │   └── AppRoutes.jsx       # Konfigurasi routing aplikasi
    └── utils/
        └── formatters.js       # Formatter mata uang Rupiah, rentang gaji, & tanggal
```

---

## 🎨 Desain & UI/UX
- **Palette**: Warna dasar warm cream (`#FFFDF9`, `#FAF6F0`) dipadukan dengan aksen oranye (`#EA580C`, `#F97316`) yang ramah dan profesional.
- **Card**: Sudut membulat modern (`rounded-2xl`, `rounded-3xl`) dengan bayangan halus.
- **Responsif**: Mendukung tampilan layar mobile, tablet, hingga desktop lebar.
- **Feedback Interaktif**: Dilengkapi loading skeleton, empty state, error state dengan retry, serta toast alert otomatis saat aksi berhasil atau gagal.
