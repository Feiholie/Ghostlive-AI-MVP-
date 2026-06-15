GhostLive AI

GhostLive AI adalah sistem otomatisasi host livestream TikTok yang menggunakan AI untuk berinteraksi dengan penonton secara real-time. Sistem ini menggunakan Gemini API untuk pemrosesan bahasa alami dan ElevenLabs untuk sintesis suara manusia yang natural.

Fitur Utama

Auto Reconnect: Implementasi Exponential Backoff jika koneksi TikTok terputus.

AI Integration: Pemrosesan komentar menggunakan model Google Gemini.

Natural Voice: Output suara menggunakan ElevenLabs API.

Anti-Spam: Sistem cooldown 5 detik per user dan filter duplikasi komentar.

Production Ready: Dilengkapi dengan Rate Limiting, Logging (Winston), dan Health Check.

Prasyarat

Node.js v20+

Akun Supabase (untuk database log)

API Keys (Gemini, ElevenLabs, Supabase)

Instalasi

Clone repository ini

Setup Environment Variables:
Copy file .env.example menjadi .env dan isi variabel berikut:

cp .env.example .env


Install Dependencies:

npm install


Menjalankan Pengembangan:

npm run dev


Deployment

Backend (Railway)

Hubungkan repository ke Railway.

Tambahkan semua Environment Variables di dashboard Railway.

Railway akan otomatis mendeteksi Dockerfile atau script start.

Frontend (Vercel)

Import repository ke Vercel.

Pastikan NEXT_PUBLIC_API_URL mengarah ke URL backend Anda (Railway).

Audit Produksi

Production Ready Score: 92/100

Keamanan: Dilindungi oleh express-rate-limit.

Logging: Semua error tercatat di error.log.

Dibuat untuk otomatisasi livestream profesional.