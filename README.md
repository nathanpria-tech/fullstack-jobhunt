# JobHunt

Job board fullstack untuk pencari kerja dan recruiter. Frontend menggunakan React, Vite, Tailwind CSS, React Router, TanStack Query, dan Axios. Backend menggunakan Node.js, Express, JWT, bcrypt, dan MySQL.

## Fitur

- Registrasi, login JWT, profil, dan pembatasan akses berbasis role.
- Katalog lowongan aktif dengan pencarian debounce, filter tipe/lokasi/gaji, sorting, dan pagination.
- Recruiter dapat membuat, mengubah, menutup, dan menghapus lowongan serta mengelola lamaran.
- Job seeker dapat melamar dan melihat status lamaran.
- Fitur tambahan: filter rentang gaji.

## Persiapan lokal

Prasyarat: Node.js, npm, dan MySQL.

1. Buat konfigurasi backend dengan menyalin `backend/.env.example` menjadi `backend/.env`, lalu isi kredensial MySQL dan secret JWT. `JWT_SECRET` wajib berisi minimal 32 karakter acak.
2. Buat database dan tabel:

   ```bash
   mysql -u root -p < backend/schema.sql
   ```

3. Instal dan jalankan backend:

   ```bash
   cd backend
   npm install
   npx nodemon .
   ```

   Backend lokal berjalan pada `http://localhost:5001`; health check: `http://localhost:5001/api/health`.

4. Salin `frontend/.env.example` menjadi `frontend/.env.local` (atau buat file tersebut) dengan isi:

   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

5. Di terminal lain, instal dan jalankan frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend lokal berjalan pada `http://localhost:3000`.

Untuk menguji build frontend, jalankan `cd frontend`, lalu `npm run build`. Untuk menjalankan backend production, jalankan `cd backend`, lalu `npm start`.

## Konfigurasi environment backend

| Variabel                                                  | Keterangan                                                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `PORT`                                                    | Port server (default lokal: `5001`; platform hosting biasanya menyediakan nilainya) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Koneksi MySQL                                                                       |
| `JWT_SECRET`                                              | Secret acak minimal 32 karakter; atur di `.env` dan wajib di production             |
| `JWT_EXPIRES_IN`                                          | Masa berlaku token, default `7d`                                                    |
| `FRONTEND_URL`                                            | Origin frontend yang diizinkan CORS                                                 |

Jangan mengunggah file `.env` atau memasukkan secret ke source code. Untuk hosting, isi variabel melalui dashboard penyedia layanan.

## Database dan migrasi

`backend/schema.sql` adalah skema untuk database baru dan menggunakan kolom `password_hash` seperti yang dibaca oleh backend. Jika database sudah berisi akun, jangan drop atau buat ulang tabel `users`; perubahan kode login ini menjaga penggunaan kolom hash yang sudah ada.

## API

Semua endpoint API memakai prefix `/api`.

| Area         | Endpoint                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| Auth         | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`                                             |
| Jobs         | `GET /jobs`, `GET /jobs/:id`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`, `GET /jobs/mine`     |
| Applications | `POST /jobs/:id/apply`, `GET /applications/mine`, `GET /jobs/:id/applicants`, `PUT /applications/:id` |
| Health       | `GET /api/health`                                                                                     |

## Deployment

Deployment belum dilakukan dari repository ini. Catat URL sebenarnya di bawah setelah layanan berhasil di-deploy; jangan menganggap placeholder sebagai URL aktif.

- Frontend (Vercel): **[isi URL production Vercel di sini]**
- Backend (Railway/Render): **[isi URL production backend di sini]**
- Health check: **`<URL_BACKEND>/api/health`**

### Frontend ke Vercel

1. Import repository ke Vercel dan atur **Root Directory** ke `frontend`.
2. Tambahkan environment variable `VITE_API_URL` dengan nilai `https://<URL_BACKEND>/api`.
3. Deploy, kemudian salin URL production Vercel ke `FRONTEND_URL` backend.

### Backend dan MySQL ke Railway/Render

1. Buat service Node.js dari repository dengan **Root Directory** `backend`; start command adalah `npm start`.
2. Tambahkan MySQL ke project. Petakan kredensial koneksi MySQL penyedia hosting ke `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME`.
3. Set `JWT_SECRET` dengan nilai acak minimal 32 karakter, `JWT_EXPIRES_IN=7d`, dan `FRONTEND_URL` ke URL Vercel production. Biarkan platform menyediakan `PORT` jika diwajibkan oleh penyedia layanan.
4. Jalankan `backend/schema.sql` satu kali terhadap database production yang masih baru. Untuk database lama, gunakan prosedur migrasi di atas setelah backup.
5. Setelah deploy, verifikasi `GET <URL_BACKEND>/api/health` menghasilkan `{ "status": "ok" }`, lalu uji register, login, browse jobs, apply, dan recruiter posting melalui frontend production.

## Struktur utama

```text
backend/
  index.js
  schema.sql
  migrations/
  src/{config,controllers,middleware,models,routes,utils}/
frontend/
  src/{components,contexts,hooks,layouts,lib,pages,routes,utils}/
```
