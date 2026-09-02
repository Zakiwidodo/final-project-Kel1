# 🧠 Sahabat Dengar — Mental Health Chatbot

> Pendamping kesehatan mental berbasis Gen AI dengan Express.js backend, PostgreSQL database, dan frontend web yang modern dan responsif.

---

## 📌 Fitur Utama

- **Empathetic AI Companion**: Chatbot pendengar empatik yang responsif dan tidak menghakimi.
- **Mode Anonim (100% Privacy)**: Pengguna anonim mendapatkan 15 token gratis; percakapan tidak pernah disimpan ke database.
- **Mode Pengguna Terdaftar**: Pengguna mendapatkan 50 token awal dan dapat menyimpan riwayat sesi serta refleksi.
- **Deteksi Gejala & Tingkat Risiko**: Ekstraksi mood, gejala emosional, dan tingkat risiko (rendah, sedang, tinggi) secara otomatis di akhir setiap sesi.
- **Protokol Penanganan Krisis**: Respons darurat otomatis dengan hotline Layanan Sejiwa (119 ext 8).
- **Dashboard Administrator**: Monitoring sesi pengguna, ringkasan analisis klinis/gejala, dan manajemen token.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js 5, pg (PostgreSQL Client), JWT, bcryptjs, dotenv, cors
- **Frontend**: Vanilla JavaScript (ES Modules), HTML5 Semantic, Modern CSS Design System (Glassmorphism, CSS Custom Properties)
- **Database**: PostgreSQL / Supabase
- **AI Integration**: OpenAI Compatible Chat Completions API (`gpt-4o-mini` / Gemini / etc.)

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- Node.js (v18+)
- PostgreSQL (via pgAdmin atau Supabase)

### 2. Konfigurasi Backend
1. Masuk ke folder backend:
   ```bash
   cd sahabat-dengar/backend
   ```
2. Salin template environment:
   ```bash
   cp .env.example .env
   ```
3. Edit file `.env` sesuai kredensial PostgreSQL dan API Key LLM Anda:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sahabat_dengar
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=super_secret_jwt_key_min_32_chars
   LLM_API_KEY=your_openai_or_gemini_key
   LLM_BASE_URL=https://api.openai.com/v1
   LLM_MODEL=gpt-4o-mini
   ANON_TOKEN_LIMIT=15
   ```

### 3. Inisialisasi Database
Jalankan script pembuatan tabel:
```bash
npm run db:init
```

### 4. Menjalankan Server
```bash
npm run dev
# atau
npm start
```
Buka browser di: **`http://localhost:5000`**

---

## 🗺️ API Endpoints

### Auth
- `POST /api/auth/register` — Daftar user baru
- `POST /api/auth/login` — Login user & generate JWT
- `GET /api/auth/me` — Profil user saat ini (JWT Required)

### Chat
- `POST /api/chat/anonymous/start` — Inisialisasi sesi anonim
- `POST /api/chat/message` — Kirim pesan percakapan (Mendukung Login & Anonim)

### Session & Analisis
- `POST /api/session/end` — Akhiri sesi, ekstrak gejala & hasilkan ringkasan
- `GET /api/session/history` — Riwayat sesi user (JWT Required)
- `GET /api/session/:id` — Detail 1 sesi beserta percakapan (JWT Required)
- `GET /api/session/:id/summary` — Ringkasan analisis 1 sesi (JWT Required)

### Admin
- `GET /api/admin/users` — Daftar seluruh user
- `GET /api/admin/sessions` — Daftar seluruh sesi & status
- `GET /api/admin/session/:id` — Detail percakapan lengkap
- `GET /api/admin/summaries` — Seluruh rekap gejala & tingkat risiko

---

## 🔒 Aturan Privasi & Keamanan
1. API Key LLM hanya ada di server (`backend/.env`).
2. Pesan sesi anonim tidak pernah masuk ke tabel database `messages`.
3. System prompt strictly dilarang memberikan diagnosis klinis atau resep obat.
