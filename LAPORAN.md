# Laporan Pengerjaan Website DUMEG

**Proyek:** Website PT Duta Meta Graha (DUMEG)
**Periode:** 8 Oktober – 16 November 2026
**Disusun oleh:** Indra Maulana
**Tanggal laporan:** 16 November 2026

---

## Ringkasan

Website DUMEG sudah didesain ulang total dengan tampilan baru yang lebih modern dan bergaya editorial. Isinya sudah disesuaikan dengan struktur layanan resmi DUMEG: End to End Logistik (Angkutan dan Simpul), Aplikasi Pendukung, dan Media Center. Website terdiri dari 7 halaman dan menampilkan 35 aplikasi/sistem DUMEG. Semuanya sudah berjalan dan sudah diuji di komputer lokal. Perubahan sejak 26 Oktober belum diunggah ke GitHub/Vercel.

## Hasil saat ini

| Halaman | Isi |
|---|---|
| Beranda | Hero dengan foto tim DUMEG, empat layanan beserta ilustrasinya, daftar proyek, mitra yang dipercaya, dan ajakan kontak |
| Karya | Etalase 35 aplikasi lengkap dengan logo, pencarian, dan filter kategori |
| Klien | Daftar klien dan asosiasi |
| Kontak | Formulir kontak yang otomatis terisi sesuai layanan yang dipilih |
| Universe | Peta interaktif ekosistem DUMEG |
| Kebijakan Privasi dan Kebijakan Cookie | Halaman legal |

**Teknologi:** Next.js 16, Tailwind CSS, GSAP, Framer Motion, dan Three.js. Website ini tanpa backend dan siap di-hosting di Vercel.

---

## Kronologi pengerjaan

### 8 Oktober 2026
- Membuat landing page awal DUMEG dengan tema digital maritim.
- Memperbaiki hero agar memenuhi satu layar penuh.

### 9 Oktober 2026
- Menata ulang section Visi & Misi (layout bento grid, palet warna, dan aset gambar).

### 17 Oktober 2026
- Mendesain ulang section setelah hero mengikuti referensi.
- Mengganti warna ke palet light blue DUMEG.
- Melebarkan jarak kiri-kanan konten.

### 26 Oktober 2026
- Menyelesaikan redesain section setelah hero dan menambahkan section Ekosistem 3D.
- Mengunggah hasilnya ke GitHub.

### 4 November 2026
- Membuat ulang model 3D roket/skyship di hero.

### 9 November 2026
- Mencoba konsep tema "menyelam ke laut" dengan kapal selam 3D. Konsep ini tidak dilanjutkan.

### 10 November 2026: redesain total
- Membangun ulang seluruh website dengan gaya tata letak editorial baru: Beranda, Karya, Klien, Kontak, Universe, dan halaman legal.
- Menghapus aset 3D kapal selam dari konsep sebelumnya.
- Hero baru: latar langit, foto tim DUMEG full layar, dan tulisan "DUMEG" di belakang foto.
- Memasang logo resmi DUMEG di navigasi.
- Menyesuaikan isi layanan dengan struktur resmi DUMEG.
- Merapikan bagian "Dipercaya oleh" agar hanya menampilkan mitra yang benar-benar ada: APTMI, GPEI, ATTI, DEPALINDO, APBMI Kaltim, MUARA, PORTA, SURVLUS, dan LPKSM.
- Mengecilkan preview proyek saat disorot kursor dan membuatnya mengikuti kursor.
- Membuat ilustrasi bergaya gravir: container yang tergantung di crane, di samping layanan nomor 2.

### 11 November 2026
- Menambahkan ilustrasi gravir truk logistik yang bergerak melintas (layanan nomor 1).
- Menambahkan ilustrasi gravir orang-orang sedang bekerja (layanan nomor 3).
- Memperbaiki angka layanan yang sempat tidak terlihat saat halaman dibuka.

### 12 November 2026
- Membagi halaman Karya per 4 kategori layanan, dengan filter dan pencarian.
- Memasang thumbnail resmi untuk aplikasi pendukung.

### 14 November 2026
- Mengubah halaman Karya menjadi etalase sederhana seperti dashboard lama dumeg.id, dengan desain branding baru.
- Membuat tampilan yang mudah dipahami semua umur, termasuk orang tua:
  - huruf besar dan tombol kategori besar, masing-masing dengan penjelasan singkat;
  - setiap aplikasi diberi satu kalimat penjelasan dalam bahasa sehari-hari;
  - pencarian bisa memakai kata kebutuhan, misalnya "absensi", "kasir", atau "kapal".
- Menambahkan logo di setiap kartu aplikasi.

### 15 November 2026
- Mencari dan memasang 11 logo resmi langsung dari situs masing-masing aplikasi: Y-Track, Y-Terminal, YADRI, E-PBM, Libat (BAT), D-LSP, LILO Resto, LSP Tami, MUARA, SURVLUS, dan LPKSM.
- Total 27 dari 35 aplikasi sekarang memakai logo asli.

### 16 November 2026
- Menyusun laporan ini.

---

## Yang masih perlu diselesaikan

1. **Logo 8 aplikasi belum tersedia:** GPS Tracking, Sensor Load Cell, Y-TALLY Mobile, Y-RKBM, Y-Monitor, Mine Logistic, Y-PBM Jetty, dan PORTA. Sementara ini memakai ikon.
2. **Pemeriksaan isi:** penjelasan singkat beberapa aplikasi perlu dicek oleh tim terkait, yaitu Y-RKBM, Mine Logistic, MUARA, PORTA, dan SURVLUS.
3. **Aplikasi tambahan:** perlu diputuskan apakah ACC Pedia, Palka, dan Y-AIS (ada di dashboard lama) dimasukkan ke etalase.
4. **Link aplikasi:** perlu diputuskan apakah kartu di etalase langsung membuka situs aplikasinya, seperti dashboard lama.
5. **Publikasi:** hasil pekerjaan perlu disimpan ke GitHub lalu dipublikasikan ke Vercel.
