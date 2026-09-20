# 🎬 Promptly - Video Teleprompter Studio

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloud%20Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://promptly-video-teleprompter-studio-1082313180414.asia-southeast1.run.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/G-than12/Promly-video-telepromter-studio)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-3.8%20Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

**Studio teleprompter video profesional berbasis web lengkap dengan floating overlay interaktif, perekam kamera HD, analisis kecepatan bicara, dan asisten naskah bertenaga AI Google Gemini.**

[🌐 Kunjungi Aplikasi Live](https://promptly-video-teleprompter-studio-1082313180414.asia-southeast1.run.app/) • [📦 Repositori GitHub](https://github.com/G-than12/Promly-video-telepromter-studio) • [✨ Fitur Utama](#-fitur-unggulan) • [🚀 Cara Menjalankan](#-panduan-instalasi--menjalankan-lokal)

</div>

---

## 📖 Tentang Promptly (Promly Studio)

**Promptly** adalah studio teleprompter video modern yang dirancang khusus untuk kreator konten (TikTok, Instagram Reels, YouTube Shorts, podcast, webinar, dan presentasi profesional). Aplikasi ini memungkinkan Anda membaca naskah dengan lancar tanpa kehilangan kontak mata dengan lensa kamera, sekaligus merekam video langsung dari browser tanpa perlu software tambahan yang berat.

Dilengkapi dengan integrasi **Google Gemini 3.8 Flash**, Promptly dapat menyusun naskah viral dengan struktur retensi tinggi, memoles skrip agar mudah dilafalkan di depan kamera, mendeteksi kata-kata pengisi (*filler words*), dan mengestimasi durasi bicara secara akurat.

---

## ✨ Fitur Unggulan

### 1. 🪟 Interactive Floating Teleprompter Overlay
- **Bebas Geser & Ubah Ukuran**: Posisikan kotak teks teleprompter persis di dekat lensa kamera untuk menjaga tatapan mata tetap alami.
- **Kustomisasi Tipografi Lengkap**: Pilihan font (Inter, Poppins, Roboto, Montserrat, Open Sans), ukuran font (16px - 72px), ketebalan (*weight*), perataan teks, dan *line height*.
- **Desain & Kontras Fleksibel**: Atur warna teks, warna latar belakang, transparansi (*opacity* 0-100%), sudut melengkung (*border-radius*), efek *backdrop blur*, dan bayangan (*shadow*).
- **Auto-Scroll Halus & Kecepatan Adaptif**: Kecepatan gulir teks dapat disesuaikan (0.25x hingga 5.0x) dengan opsi *reverse scroll*.
- **Smart Reading Indicator & Sentence Highlight**: Garis panduan baca visual dan penyorot kalimat aktif agar Anda tidak pernah tersesat saat membaca.
- **Mirror Text Mode**: Mendukung pembalikan teks horizontal untuk penggunaan dengan perangkat keras kaca reflektor (*beam-splitter teleprompter rig*).

### 2. 🎥 Perekam Video & Audio Studio
- **Rasio Aspek Fleksibel**:
  - `9:16` Portrait (TikTok, Instagram Reels, YouTube Shorts)
  - `16:9` Widescreen (YouTube, presentasi, kursus online)
  - `1:1` Square (Feed media sosial)
  - `4:5` Social Portrait
- **Kualitas HD**: Pilihan resolusi **720p HD** dan **1080p Full HD**.
- **Pemilih Perangkat Kamera & Mikrofon**: Beralih antar webcam eksternal atau mikrofon USB dengan mudah.
- **Live Audio VU Meter**: Indikator visual level volume suara real-time untuk memastikan audio tidak *peaking* atau terlalu hening.
- **Dual Recording Modes**:
  - **Clean Mode**: Merekam video kamera murni tanpa teks teleprompter (hasil akhir untuk dipublikasikan).
  - **Overlay Mode**: Merekam video kamera beserta tampilan teks teleprompter di atasnya (ideal untuk latihan, konten tutorial, atau *behind-the-scenes*).
- **Countdown & Kontrol Rekaman**: Hitung mundur 3 detik sebelum merekam, timer durasi, jeda (*pause*), lanjutkan (*resume*), dan simpan.
- **Pratinjau & Download Instan**: Tinjau hasil rekaman (*take*) secara langsung, putar ulang, dan unduh dalam format video WebM/MP4.

### 3. 🧠 AI Script Assistant (Google Gemini 3.8 Flash)
- **AI Script Generator**: Buat naskah video berdurasi 30, 60, 90, atau 120 detik dengan struktur formula retensi teruji:
  - `[HOOK]` — Penarik perhatian 0-5 detik pertama.
  - `[PROBLEM / CURIOSITY]` — Membangun rasa penasaran dan empati.
  - `[CORE VALUE / SOLUTION]` — Poin utama yang mudah diingat.
  - `[REAL EXAMPLE / STORY]` — Studi kasus atau contoh singkat.
  - `[CALL TO ACTION]` — Ajakan bertindak yang jelas.
- **AI Script Polisher**:
  - Format naskah khusus pembacaan teleprompter dengan kalimat pendek dan jeda `[pause]`.
  - Hapus kata-kata sulit atau kalimat berbelit (*tongue twisters*).
  - Opsi ringkas (*shorten 30%*) atau perluas (*expand*).
- **AI Speech & Pacing Analyzer**:
  - Menghitung jumlah kata, karakter, dan estimasi waktu bicara pada 3 tempo (Lambat: 120 WPM, Normal: 150 WPM, Cepat: 180 WPM).
  - Deteksi otomatis *filler words* (Bahasa Indonesia: *kayak, gitu, nah, terus, ya kan, anu*; Bahasa Inggris: *uh, um, literally, actually, basically*).
  - Rekomendasi AI terkait dinamika vokal (*vocal energy*) dan momen kontak mata lensa.
- **Smart Local Fallback**: Tetap dapat menghasilkan template skrip berstruktur meskipun API key belum dipasang.

### 4. 📁 Manajemen Proyek & Preset
- **Auto-Save**: Semua naskah, konfigurasi teleprompter, dan riwayat rekaman tersimpan otomatis di *localStorage* browser.
- **Multi-Project Support**: Buat naskah baru, duplikasi, ganti judul, atau hapus proyek kapan saja.
- **Preset Siap Pakai**:
  - *Creator (TikTok / Reels)* — Rasio 9:16, font Poppins tebal, semi-transparan di dekat kamera atas.
  - *Executive Presentation* — Rasio 16:9, font Inter, kontras tinggi dan garis panduan fokus.
  - *High-Contrast Neon* — Teks kuning terang di atas latar hitam pekat untuk keterbacaan maksimal.
  - *Minimal Clean* — Teks sederhana dengan latar belakang bersih.
- **Simpan Preset Kustom**: Simpan preferensi ukuran, posisi, dan warna Anda sendiri.

---

## ⌨️ Pintasan Keyboard (Keyboard Shortcuts)

Kendalikan teleprompter tanpa perlu menyentuh mouse saat merekam:

| Tombol | Fungsi |
| :--- | :--- |
| <kbd>Space</kbd> | Mulai / Jeda gulir teks teleprompter (*Play / Pause Scroll*) |
| <kbd>↑ Panah Atas</kbd> | Tingkatkan kecepatan gulir (+0.25x) |
| <kbd>↓ Panah Bawah</kbd> | Turunkan kecepatan gulir (-0.25x) |
| <kbd>R</kbd> | Reset naskah kembali ke posisi awal |
| <kbd>M</kbd> | Balik teks horizontal (*Mirror Mode* untuk kaca prompter) |
| <kbd>F</kbd> | Masuk / Keluar Mode Fokus (*Focus Mode* - sembunyikan sidebar) |
| <kbd>Esc</kbd> | Tutup modal / Batalkan hitung mundur rekaman |

---

## 🛠️ Arsitektur & Teknologi

Promptly dibangun dengan standar web modern dan arsitektur *full-stack* yang ringan dan cepat:

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend Layer                        │
│  React 19 • TypeScript • Tailwind CSS v4 • Lucide Icons     │
│  Motion (Framer) • Canvas Composite API • Web Audio API     │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (/api/*)
┌──────────────────────────────┴──────────────────────────────┐
│                    Express Backend Service                  │
│   Node.js • Express • tsx • Vite Dev / Static Production    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Google Gen AI SDK
┌──────────────────────────────┴──────────────────────────────┐
│                  Google Gemini 3.8 Flash                    │
│   Naskah Video • Optimasi Pelafalan • Pacing & Filler Analisis│
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)
- **Backend**: [Express](https://expressjs.com/), [Node.js](https://nodejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/), [esbuild](https://esbuild.github.io/)
- **AI Engine**: `@google/genai` dengan model **Gemini 3.8 Flash** (`gemini-3.8-flash`)
- **Browser APIs**:
  - `navigator.mediaDevices.getUserMedia`: Perekaman kamera dan mikrofon
  - `MediaRecorder`: Pengambilan data video dan audio menjadi Blob WebM/MP4
  - `HTML5 Canvas`: Penggabungan (*compositing*) aliran kamera dan teks overlay pada mode Overlay
  - `Web Audio API (AudioContext & AnalyserNode)`: Kalkulasi amplitudo audio untuk VU meter real-time

---

## 📁 Struktur Repositori

```plaintext
promly-video-telepromter-studio/
├── src/
│   ├── components/
│   │   ├── AIAssistantModal.tsx        # Modal AI generator, polisher, dan analisis naskah
│   │   ├── CameraControls.tsx         # Kontrol kamera, mikrofon, rasio aspek, dan resolusi
│   │   ├── CameraView.tsx             # Tampilan kamera langsung + overlay teks interaktif
│   │   ├── CountdownOverlay.tsx       # Animasi hitung mundur sebelum rekaman dimulai
│   │   ├── Header.tsx                 # Navigasi atas, status proyek, dan tombol aksi
│   │   ├── PresetsModal.tsx           # Pilihan template konfigurasi teleprompter
│   │   ├── ProjectManagerModal.tsx    # Manajemen daftar proyek (buat, ganti, hapus)
│   │   ├── RecordingBar.tsx           # Bar kontrol bawah (play prompter, record, VU meter)
│   │   ├── ScriptEditor.tsx           # Editor teks naskah dengan statistik kata & WPM
│   │   ├── ShortcutsModal.tsx         # Bantuan pintasan keyboard
│   │   ├── TeleprompterControls.tsx   # Pengaturan visual prompter (font, posisi, warna)
│   │   └── VideoPreviewModal.tsx      # Pemutar pratinjau hasil rekaman & unduhan
│   ├── data/
│   │   └── defaultPresets.ts          # Konfigurasi preset bawaan dan naskah awal
│   ├── utils/
│   │   ├── audio.ts                   # Utilitas Web Audio API & VU meter
│   │   └── storage.ts                 # Penyimpanan lokal (localStorage) proyek
│   ├── types.ts                       # Definisi antarmuka & tipe TypeScript
│   ├── App.tsx                        # Komponen utama aplikasi
│   ├── index.css                      # Styling dasar Tailwind CSS
│   └── main.tsx                       # Entry point React
├── index.html                         # Template HTML utama
├── server.ts                          # Server Express & integrasi Gemini API
├── package.json                       # Dependensi dan skrip proyek
├── tsconfig.json                      # Konfigurasi TypeScript
├── vite.config.ts                     # Konfigurasi Vite
└── README.md                          # Dokumentasi proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

Ikuti langkah-langkah berikut untuk menjalankan Promptly Studio di komputer lokal Anda:

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- Kamera webcam dan mikrofon yang terhubung ke komputer.
- Browser modern yang mendukung WebRTC (Chrome, Edge, Firefox, Brave, Safari).
- *(Opsional)* Kunci API Google Gemini dari [Google AI Studio](https://aistudio.google.com/).

### Langkah-langkah

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/G-than12/Promly-video-telepromter-studio.git
   cd Promly-video-telepromter-studio
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**:
   Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan isi dengan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   APP_URL="http://localhost:3000"
   ```
   *(Catatan: Jika Anda tidak mengisi `GEMINI_API_KEY`, aplikasi tetap dapat berjalan normal dan fitur naskah akan menggunakan template bawaan studio).*

4. **Jalankan Mode Pengembangan (Development)**:
   ```bash
   npm run dev
   ```

5. **Buka di Browser**:
   Buka [http://localhost:3000](http://localhost:3000) pada peramban Anda. Pastikan memberikan izin akses kamera dan mikrofon saat diminta.

---

## 🚢 Build & Deployment

### Build Produksi
Untuk membangun versi produksi:
```bash
npm run build
```
Perintah ini akan mengompilasi aset frontend ke folder `dist` dan membundel backend `server.ts` menjadi `dist/server.cjs`.

### Menjalankan Server Produksi
```bash
npm start
```
Aplikasi akan aktif pada port `3000` (atau port yang ditentukan oleh environment `PORT`).

### Deployment di Cloud Run / Docker
Aplikasi ini kompatibel untuk dideploy ke **Google Cloud Run**, Docker container, atau platform cloud modern lainnya dengan mengatur variabel lingkungan:
- `GEMINI_API_KEY`: Kunci API Google Gemini Anda.
- `NODE_ENV`: `production`
- `PORT`: `8080` atau `3000`

Tautan versi produksi yang sedang aktif:
🔗 **[https://promptly-video-teleprompter-studio-1082313180414.asia-southeast1.run.app/](https://promptly-video-teleprompter-studio-1082313180414.asia-southeast1.run.app/)**

---

## 🎯 Panduan Mode Rekam (Clean vs Overlay)

| Mode | Cara Kerja | Penggunaan Terbaik |
| :--- | :--- | :--- |
| **Clean Mode (Default)** | Mengambil rekaman langsung dari sensor kamera murni. Teks teleprompter hanya terlihat di layar Anda dan **tidak muncul** pada video hasil rekaman. | Membuat video YouTube, konten TikTok/Reels, video promosi profesional, dan presentasi formal. |
| **Overlay Mode** | Menggunakan HTML5 Canvas untuk menggabungkan video kamera dan teks teleprompter ke dalam satu rekaman gabungan. | Video latihan (*rehearsal*), konten edukasi/tutorial cara membaca naskah, dokumentasi evaluasi bicara, atau konten *behind-the-scenes*. |

---

## 🤝 Kontribusi

Kontribusi selalu disambut dengan baik! Jika Anda menemukan bug atau memiliki ide fitur baru:
1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b fitur/FiturKeren`)
3. Lakukan commit perubahan (`git commit -m 'Menambahkan fitur keren'`)
4. Push ke branch Anda (`git push origin fitur/FiturKeren`)
5. Buka **Pull Request**

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE). Bebas digunakan dan dikembangkan untuk keperluan personal maupun komersial.

<div align="center">
  <sub>Dibuat dengan ❤️ untuk para kreator konten dan pembicara profesional.</sub>
</div>
