"""Placeholder website/app mockups for the sky-launch tour monitors.

Renders public/screens/<id>.jpg with headless Chromium (Playwright).
These are stand-ins: replace any file with a real screenshot of the same name.

usage:  python3 render_screens.py <project_root>
"""
import asyncio
import html
import random
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
OUT = ROOT / "public" / "screens"
FONTS = ROOT / "public" / "fonts" / "helvetica"
LOGOS = ROOT / "public" / "images" / "asosiasi" / "logo_asosiasi"

# ----------------------------------------------------------------------------- data
ASSOC = {
    "gpei": dict(name="GPEI", full="Gabungan Perusahaan Ekspor Indonesia", accent="#c8102e", logo="gpei_logo.png",
                 head="Membina Eksportir, Menggerakkan Nusantara.",
                 sub="Portal ExportLane & Direktori Eksportir Terpadu",
                 desc="Asosiasi eksportir dengan jaringan DPD di seluruh provinsi. Direktori anggota, verifikasi, dan fasilitasi pasar ekspor dalam satu portal.",
                 facts=[("Total Anggota", "2.500+"), ("Jaringan Wilayah", "14 DPD"), ("Program", "ExportLane"), ("Sejak", "1961")],
                 nav=["Beranda", "Tentang", "Keanggotaan", "Direktori", "Berita", "Kontak"]),
    "depalindo": dict(name="DEPALINDO", full="Dewan Pengguna Angkutan & Logistik Indonesia", accent="#1d4ed8", logo="depalindo_logo.png",
                      head="Suara Pemilik Kargo untuk Logistik yang Adil.",
                      sub="Platform Advokasi Tarif & Integrasi Pemilik Kargo",
                      desc="Transparansi tarif freight dan demurrage, serta integrasi ekosistem logistik multimoda nasional.",
                      facts=[("Didirikan", "1975"), ("Fokus", "Advokasi Tarif"), ("Moda", "Darat & Laut"), ("Jaringan", "Global")],
                      nav=["Beranda", "Tentang", "Advokasi", "Anggota", "Publikasi", "Kontak"]),
    "apbmi": dict(name="APBMI Kaltim", full="Asosiasi Perusahaan Bongkar Muat Indonesia", accent="#3730a3", accent2="#f5b700", logo="apbmi_logo.webp",
                  head="Sinergi Bongkar Muat, Menggerakkan Nusantara!",
                  sub="Sistem E-PBM & Pengawasan Bongkar Muat Borneo",
                  desc="Koordinasi stevedoring di pelabuhan strategis Kalimantan Timur dengan pelaporan E-PBM digital.",
                  facts=[("Wilayah", "Kalimantan Timur"), ("Komoditas", "Batu bara, CPO"), ("Sistem", "E-PBM Digital"), ("Integrasi", "YADRI")],
                  nav=["Beranda", "Profil", "E-PBM", "Anggota", "Berita", "Kontak"], dark=True),
    "aptmi": dict(name="APTMI", full="Asosiasi Perusahaan Tally Mandiri Indonesia", accent="#0369a1", accent2="#a3e635", logo="aptmi_logo.png",
                  head="Pelopor Transparansi & Standardisasi Tally Mandiri.",
                  sub="Platform Digitalisasi YADRI & Tally Mandiri Nasional",
                  desc="Pencatatan muatan pelabuhan yang akurat, independen, dan bebas manipulasi untuk seluruh pelabuhan Indonesia.",
                  facts=[("Cakupan", "Nasional"), ("Regulasi", "PM 59/2021"), ("Fungsi", "Inspeksi Independen"), ("Platform", "YADRI")],
                  nav=["Beranda", "Tentang", "Anggota", "Regulasi", "Berita", "Kontak"]),
    "atti": dict(name="ATTI", full="Asosiasi TUKS dan TERSUS Indonesia", accent="#0b2a5b", accent2="#facc15", logo="atti_logo.png",
                 head="Standar Operasional Terminal Khusus Indonesia.",
                 sub="Sistem Standarisasi & Pelayanan Terminal Khusus Korporasi",
                 desc="Rumah bagi pengelola TUKS dan TERSUS: standarisasi operasional, sertifikasi kru, dan kepatuhan regulasi.",
                 facts=[("Tipe", "TUKS & TERSUS"), ("Mitra", "Kemenhub & Pelindo"), ("Layanan", "Sertifikasi"), ("Portal", "ATTI Digital")],
                 nav=["Beranda", "Tentang", "Anggota", "Sertifikasi", "Berita", "Kontak"], dark=True),
}

# kind: dashboard | crm | chat | doc | pos | portal
PRODUCTS = {
    "muara": dict(name="MUARA", cat="Data Center", accent="#f26b1d", kind="dashboard", domain="data"),
    "porta": dict(name="PORTA", cat="Data Center", accent="#0f766e", kind="dashboard", domain="port"),
    "survlus": dict(name="SURVLUS", cat="Data Center", accent="#6d28d9", kind="dashboard", domain="survey"),
    "lpksm": dict(name="LPKSM", cat="Layanan Publik", accent="#2563eb", kind="portal", domain="consumer"),
    "karsa": dict(name="KARSA", cat="HR", accent="#1d8fe1", kind="dashboard", domain="hr"),
    "hubdmg": dict(name="HUBDMG", cat="HR", accent="#2563eb", kind="dashboard", domain="hub"),
    "hello-dumeg": dict(name="Hello Dumeg", cat="HR", accent="#3b82f6", kind="chat", domain="hello"),
    "narahubung": dict(name="Narahubung", cat="Utilitas", accent="#2d6cdf", kind="crm", domain="crm"),
    "diittoo": dict(name="DIITTOO", cat="Utilitas", accent="#0b1f4b", kind="dashboard", domain="task"),
    "ratih": dict(name="Ratih", cat="Utilitas", accent="#0891b2", kind="dashboard", domain="asset"),
    "docr": dict(name="DOCR", cat="Utilitas", accent="#111827", kind="doc", domain="doc"),
    "fay-ai": dict(name="Fay AI", cat="Utilitas", accent="#7c3aed", kind="chat", domain="ai"),
    "titecash": dict(name="Titecash", cat="Finance", accent="#ea8a0c", kind="dashboard", domain="finance"),
    "vet": dict(name="VET", cat="Bisnis", accent="#0d9488", kind="dashboard", domain="vet"),
    "semakmur": dict(name="Semakmur", cat="Bisnis", accent="#0ea5a4", kind="dashboard", domain="sales"),
    "d-lsp": dict(name="D-LSP", cat="Bisnis", accent="#e04b2b", kind="portal", domain="lsp"),
    "d-pos-lilo": dict(name="D-POS · LILO Resto", cat="Bisnis", accent="#15803d", kind="pos", domain="pos"),
    "lsp-tami": dict(name="LSP Tami", cat="Bisnis", accent="#0369a1", kind="portal", domain="lsp2"),
}

DOMAINS = {
    "data": dict(nav=["Ringkasan", "Dataset", "Pipeline", "Integrasi", "Laporan", "Pengaturan"],
                 kpi=[("Dataset Aktif", "1.284"), ("Sinkronisasi / Hari", "86,4 rb"), ("Uptime", "99,98%"), ("Sumber Data", "42")],
                 chart="Throughput Data", donut="Sumber", table=("Pipeline Terbaru", ["Nama", "Sumber", "Status", "Diperbarui"]),
                 rows=[["Manifest Kapal", "Pelabuhan", "Berjalan", "2 mnt"], ["Data Kargo", "Terminal", "Selesai", "8 mnt"], ["Statistik Bongkar", "Tally", "Selesai", "15 mnt"], ["Arus Peti Kemas", "Gate", "Antre", "21 mnt"], ["Laporan Bea Cukai", "API", "Selesai", "34 mnt"]]),
    "port": dict(nav=["Dashboard", "Kunjungan Kapal", "Dermaga", "Lapangan", "Tagihan", "Laporan"],
                 kpi=[("Kapal Sandar", "18"), ("Bongkar Muat (TEU)", "4.920"), ("Okupansi Dermaga", "76%"), ("Waktu Tunggu", "3,2 jam")],
                 chart="Arus Bongkar Muat", donut="Jenis Kargo", table=("Jadwal Kapal", ["Kapal", "Dermaga", "Status", "ETA"]),
                 rows=[["MV Nusantara Jaya", "D-03", "Sandar", "08:30"], ["KM Borneo Star", "D-01", "Bongkar", "10:15"], ["MV Samudra Biru", "D-05", "Antre", "13:40"], ["TB Mahakam 7", "D-02", "Muat", "15:00"], ["MV Selat Makassar", "D-04", "Berangkat", "17:20"]]),
    "survey": dict(nav=["Ringkasan", "Survei", "Responden", "Petugas", "Analitik", "Ekspor"],
                   kpi=[("Survei Aktif", "36"), ("Respons Masuk", "12.480"), ("Tingkat Selesai", "91%"), ("Petugas Lapangan", "214")],
                   chart="Respons per Hari", donut="Wilayah", table=("Survei Berjalan", ["Judul", "Wilayah", "Progres", "Tenggat"]),
                   rows=[["Survei Kepuasan Layanan", "Kaltim", "82%", "24 Okt"], ["Pendataan Armada", "Jatim", "64%", "30 Okt"], ["Inspeksi Gudang", "Sulsel", "47%", "2 Nov"], ["Audit Peralatan", "Kalsel", "93%", "20 Okt"], ["Survei Harga Kargo", "Nasional", "38%", "8 Nov"]]),
    "hr": dict(nav=["Beranda", "Karyawan", "Kehadiran", "Cuti", "Penggajian", "Rekrutmen"],
               kpi=[("Total Karyawan", "248"), ("Hadir Hari Ini", "231"), ("Pengajuan Cuti", "7"), ("Posisi Terbuka", "5")],
               chart="Tren Kehadiran", donut="Divisi", table=("Pengajuan Terbaru", ["Nama", "Jenis", "Status", "Tanggal"]),
               rows=[["Rina Wulandari", "Cuti Tahunan", "Disetujui", "21 Okt"], ["Andi Pratama", "Lembur", "Menunggu", "20 Okt"], ["Siti Rahma", "Izin Sakit", "Disetujui", "19 Okt"], ["Bayu Saputra", "Dinas Luar", "Menunggu", "19 Okt"], ["Dewi Lestari", "Cuti Tahunan", "Ditolak", "18 Okt"]]),
    "hub": dict(nav=["Beranda", "Pengumuman", "Direktori", "Dokumen", "Agenda", "Forum"],
                kpi=[("Pengumuman Baru", "12"), ("Dokumen Dibagikan", "386"), ("Agenda Minggu Ini", "9"), ("Anggota Aktif", "241")],
                chart="Aktivitas Internal", donut="Kanal", table=("Agenda Terdekat", ["Agenda", "Divisi", "Status", "Waktu"]),
                rows=[["Town Hall Q4", "Semua", "Terjadwal", "Sen 09:00"], ["Review Sprint", "Engineering", "Terjadwal", "Sel 14:00"], ["Onboarding Batch 7", "HR", "Berjalan", "Rab 10:00"], ["Rapat Klien", "Bisnis", "Terjadwal", "Kam 13:30"], ["Pelatihan K3", "Operasional", "Terjadwal", "Jum 08:00"]]),
    "task": dict(nav=["Beranda", "Proyek", "Tugas", "Tim", "Kalender", "Laporan"],
                 kpi=[("Tugas Aktif", "142"), ("Selesai Minggu Ini", "58"), ("Terlambat", "4"), ("Proyek Berjalan", "11")],
                 chart="Penyelesaian Tugas", donut="Prioritas", table=("Tugas Prioritas", ["Tugas", "Proyek", "Status", "Tenggat"]),
                 rows=[["Integrasi API Gate", "YADRI", "Dikerjakan", "Hari ini"], ["Desain Dashboard", "MUARA", "Review", "Besok"], ["Uji Beban Server", "PORTA", "Dikerjakan", "23 Okt"], ["Migrasi Data", "KARSA", "Antre", "25 Okt"], ["Dokumentasi Rilis", "Titecash", "Selesai", "20 Okt"]]),
    "asset": dict(nav=["Ringkasan", "Aset", "Pemeliharaan", "Peminjaman", "Lokasi", "Laporan"],
                  kpi=[("Total Aset", "3.412"), ("Dalam Pemeliharaan", "27"), ("Dipinjam", "164"), ("Nilai Aset", "Rp 18,2 M")],
                  chart="Jadwal Pemeliharaan", donut="Kategori Aset", table=("Pemeliharaan Terdekat", ["Aset", "Lokasi", "Status", "Jadwal"]),
                  rows=[["Forklift FL-09", "Gudang B", "Terjadwal", "22 Okt"], ["Genset 500 kVA", "Dermaga 2", "Dikerjakan", "21 Okt"], ["Server Rack 03", "Data Center", "Terjadwal", "24 Okt"], ["Reach Stacker RS-2", "Lapangan C", "Selesai", "19 Okt"], ["AC Ruang Kontrol", "Kantor", "Terjadwal", "28 Okt"]]),
    "finance": dict(nav=["Ringkasan", "Kas & Bank", "Tagihan", "Pembayaran", "Anggaran", "Laporan"],
                    kpi=[("Saldo Kas", "Rp 4,82 M"), ("Pemasukan Bulan Ini", "Rp 2,16 M"), ("Pengeluaran", "Rp 1,37 M"), ("Tagihan Jatuh Tempo", "14")],
                    chart="Arus Kas", donut="Pengeluaran", table=("Transaksi Terbaru", ["Keterangan", "Akun", "Status", "Nominal"]),
                    rows=[["Pembayaran Vendor IT", "Bank Mandiri", "Lunas", "Rp 86,5 jt"], ["Tagihan Klien #0921", "Piutang", "Menunggu", "Rp 142 jt"], ["Gaji Oktober", "Bank BCA", "Terjadwal", "Rp 612 jt"], ["Langganan Cloud", "Kartu Korporat", "Lunas", "Rp 23,4 jt"], ["Reimburse Dinas", "Kas Kecil", "Lunas", "Rp 4,8 jt"]]),
    "vet": dict(nav=["Beranda", "Program", "Peserta", "Kelas", "Sertifikat", "Laporan"],
                kpi=[("Peserta Aktif", "1.126"), ("Kelas Berjalan", "38"), ("Kelulusan", "88%"), ("Mitra Industri", "64")],
                chart="Pendaftaran Peserta", donut="Program", table=("Kelas Terdekat", ["Kelas", "Instruktur", "Status", "Mulai"]),
                rows=[["Operator Crane", "Hendra S.", "Dibuka", "23 Okt"], ["Tally Digital", "Maya P.", "Penuh", "25 Okt"], ["K3 Pelabuhan", "Ridwan A.", "Dibuka", "28 Okt"], ["Admin Logistik", "Nadia F.", "Berjalan", "18 Okt"], ["Forklift Dasar", "Yusuf R.", "Dibuka", "1 Nov"]]),
    "sales": dict(nav=["Beranda", "Penjualan", "Produk", "Pelanggan", "Stok", "Laporan"],
                  kpi=[("Omzet Bulan Ini", "Rp 742 jt"), ("Pesanan", "1.906"), ("Pelanggan Baru", "128"), ("Stok Menipis", "9")],
                  chart="Tren Penjualan", donut="Kategori", table=("Pesanan Terbaru", ["Pelanggan", "Produk", "Status", "Total"]),
                  rows=[["Toko Sinar Jaya", "Beras 25 kg", "Dikirim", "Rp 4,2 jt"], ["CV Makmur Abadi", "Minyak 2 L", "Diproses", "Rp 8,9 jt"], ["UD Berkah", "Gula 1 kg", "Selesai", "Rp 2,1 jt"], ["Koperasi Tani", "Pupuk", "Dikirim", "Rp 12,6 jt"], ["Toko Amanah", "Tepung", "Selesai", "Rp 1,7 jt"]]),
}

PORTAL_EXTRA = {
    "lpksm": dict(full="Lembaga Perlindungan Konsumen Swadaya Masyarakat", head="Lindungi Hak Konsumen, Wujudkan Pasar yang Adil.",
                  sub="Pengawasan & Perlindungan Konsumen",
                  desc="Layanan pengaduan, mediasi, dan edukasi konsumen secara daring. Ajukan pengaduan dan pantau statusnya kapan saja.",
                  facts=[("Pengaduan Diproses", "1.240"), ("Mediasi Berhasil", "86%"), ("Edukasi", "52 Kegiatan"), ("Respons", "< 2 x 24 jam")],
                  nav=["Beranda", "Profil", "Pengaduan", "Cek Status", "Edukasi", "Kontak"], cta="Ajukan Pengaduan"),
    "d-lsp": dict(full="Sistem Informasi Lembaga Sertifikasi Profesi", head="Sertifikasi Kompetensi yang Terukur dan Terpercaya.",
                  sub="Pendaftaran, asesmen, dan sertifikat dalam satu sistem",
                  desc="Kelola skema sertifikasi, jadwal uji kompetensi, asesor, hingga penerbitan sertifikat secara digital.",
                  facts=[("Skema Aktif", "24"), ("Asesi Terdaftar", "3.580"), ("Asesor", "112"), ("Sertifikat Terbit", "2.940")],
                  nav=["Beranda", "Skema", "Jadwal Uji", "Asesor", "Verifikasi", "Kontak"], cta="Daftar Uji Kompetensi"),
    "lsp-tami": dict(full="Lembaga Sertifikasi Profesi", head="Kompeten, Tersertifikasi, Siap Bersaing.",
                     sub="Portal Sertifikasi Profesi",
                     desc="Informasi skema, jadwal asesmen, dan verifikasi sertifikat untuk tenaga kerja profesional.",
                     facts=[("Skema", "18"), ("TUK", "9 Lokasi"), ("Peserta / Tahun", "1.200+"), ("Verifikasi", "Online")],
                     nav=["Beranda", "Tentang", "Skema", "Jadwal", "Verifikasi", "Kontak"], cta="Cek Jadwal Asesmen"),
}

# ----------------------------------------------------------------------------- helpers
E = html.escape


def monogram(name, accent, size=40, radius=11):
    letter = E(name.strip()[0].upper())
    return (f'<span class="mono" style="width:{size}px;height:{size}px;border-radius:{radius}px;background:{accent};'
            f'font-size:{int(size*0.52)}px">{letter}</span>')


def logo_html(pid, info, size=40):
    if pid in ASSOC:
        return f'<img class="logo-img" src="{(LOGOS / ASSOC[pid]["logo"]).as_uri()}" style="height:{size}px">'
    return monogram(info["name"], info["accent"], size)


def series(seed, n=24, base=50, vol=12, trend=0.8):
    r = random.Random(seed)
    v, out = base, []
    for i in range(n):
        v = max(8, v + r.uniform(-vol, vol) + trend)
        out.append(v)
    return out


def area_svg(vals, w, h, color, color2=None):
    mx, mn = max(vals) * 1.1, 0
    pts = [(i * w / (len(vals) - 1), h - (v - mn) / (mx - mn) * h) for i, v in enumerate(vals)]
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    grid = "".join(f'<line x1="0" x2="{w}" y1="{h*k/4:.0f}" y2="{h*k/4:.0f}" stroke="#e5e8ef" stroke-width="1"/>' for k in range(5))
    s2 = ""
    if color2:
        v2 = [v * 0.62 + 6 for v in vals[::-1]]
        p2 = [(i * w / (len(v2) - 1), h - (v - mn) / (mx - mn) * h) for i, v in enumerate(v2)]
        s2 = f'<path d="M{" L".join(f"{x:.1f},{y:.1f}" for x, y in p2)}" fill="none" stroke="{color2}" stroke-width="2.5" stroke-dasharray="6 6"/>'
    return (f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}">{grid}'
            f'<defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="{color}" stop-opacity=".28"/>'
            f'<stop offset="1" stop-color="{color}" stop-opacity="0"/></linearGradient></defs>'
            f'<path d="{d} L{w},{h} L0,{h} Z" fill="url(#g)"/><path d="{d}" fill="none" stroke="{color}" stroke-width="3"/>{s2}</svg>')


def donut_svg(seed, color, size=180):
    r = random.Random(seed)
    parts = [r.uniform(1, 3) for _ in range(4)]
    tot = sum(parts)
    import math
    cx = cy = size / 2
    rad = size / 2 - 16
    circ = 2 * math.pi * rad
    off, segs = 0, ""
    ops = [1, 0.7, 0.45, 0.22]
    for p, o in zip(parts, ops):
        L = p / tot * circ
        segs += (f'<circle cx="{cx}" cy="{cy}" r="{rad}" fill="none" stroke="{color}" stroke-opacity="{o}" stroke-width="26" '
                 f'stroke-dasharray="{L-3:.1f} {circ-L+3:.1f}" stroke-dashoffset="{-off:.1f}" transform="rotate(-90 {cx} {cy})"/>')
        off += L
    return f'<svg width="{size}" height="{size}">{segs}</svg>', [round(p / tot * 100) for p in parts]


def bars_svg(seed, w, h, color):
    r = random.Random(seed)
    n = 12
    bw = w / n * 0.56
    out = ""
    for i in range(n):
        v = r.uniform(0.3, 1.0) * h
        x = i * w / n + (w / n - bw) / 2
        out += f'<rect x="{x:.1f}" y="{h-v:.1f}" width="{bw:.1f}" height="{v:.1f}" rx="5" fill="{color}" fill-opacity="{0.35 + 0.65 * (i == n - 2)}"/>'
    return f'<svg width="{w}" height="{h}">{out}</svg>'


ICON = '<span class="ico"></span>'
STATUS_GOOD = {"Selesai", "Disetujui", "Lunas", "Berangkat", "Dikirim", "Berjalan", "Dibuka", "Terjadwal", "Sandar"}


def status_pill(s, accent):
    good = s in STATUS_GOOD
    bg = f"{accent}1f" if good else "#f1f2f5"
    col = accent if good else "#6b7280"
    return f'<span class="pill" style="background:{bg};color:{col}">{E(s)}</span>'


# ----------------------------------------------------------------------------- CSS
def base_css(accent):
    return f"""
@font-face {{ font-family: H; src: url('{(FONTS / 'Helvetica.ttf').as_uri()}'); font-weight: 400; }}
@font-face {{ font-family: H; src: url('{(FONTS / 'Helvetica-Bold.ttf').as_uri()}'); font-weight: 700; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: H, Arial, sans-serif; color: #0f172a; background: #f5f7fb; -webkit-font-smoothing: antialiased; }}
.mono {{ display:inline-flex; align-items:center; justify-content:center; color:#fff; font-weight:700; flex:none; }}
.logo-img {{ display:block; object-fit:contain; }}
.ico {{ width:18px; height:18px; border-radius:5px; border:2px solid currentColor; opacity:.7; flex:none; }}
.pill {{ display:inline-block; padding:5px 12px; border-radius:999px; font-size:13px; font-weight:700; }}
.card {{ background:#fff; border-radius:18px; border:1px solid #e8ebf2; }}
.muted {{ color:#64748b; }}
.btn {{ display:inline-flex; align-items:center; gap:8px; padding:13px 22px; border-radius:12px; font-weight:700; font-size:15px; }}
.btn.primary {{ background:{accent}; color:#fff; }}
.btn.ghost {{ border:1.5px solid #cbd5e1; color:#0f172a; }}
"""


# ----------------------------------------------------------------------------- templates
def app_shell(pid, p, main, title, subtitle=""):
    d = DOMAINS.get(p["domain"], DOMAINS["data"])
    nav = "".join(
        f'<div class="nav-item{" on" if i == 0 else ""}">{ICON}<span>{E(n)}</span></div>' for i, n in enumerate(d["nav"]))
    return f"""<html><head><style>{base_css(p['accent'])}
body {{ width:1600px; height:1000px; overflow:hidden; display:flex; }}
.side {{ width:250px; background:#fff; border-right:1px solid #e8ebf2; padding:26px 18px; display:flex; flex-direction:column; gap:6px; }}
.brand {{ display:flex; align-items:center; gap:12px; font-weight:700; font-size:20px; margin:0 8px 26px; }}
.brand small {{ display:block; font-size:12px; color:#94a3b8; font-weight:400; margin-top:2px; }}
.nav-item {{ display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; color:#475569; font-size:15px; }}
.nav-item.on {{ background:{p['accent']}14; color:{p['accent']}; font-weight:700; }}
.side .foot {{ margin-top:auto; padding:16px; border-radius:14px; background:{p['accent']}; color:#fff; font-size:13px; line-height:1.5; }}
.main {{ flex:1; padding:26px 34px; display:flex; flex-direction:column; gap:22px; min-width:0; }}
.top {{ display:flex; align-items:center; gap:18px; }}
.top h1 {{ font-size:28px; letter-spacing:-.01em; }}
.top .search {{ margin-left:auto; width:320px; height:44px; border-radius:12px; background:#fff; border:1px solid #e8ebf2; color:#94a3b8; display:flex; align-items:center; padding:0 16px; font-size:14px; }}
.avatar {{ width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,{p['accent']},#94a3b8); }}
</style></head><body>
<aside class="side"><div class="brand">{logo_html(pid, p, 40)}<div>{E(p['name'])}<small>{E(p['cat'])} · DUMEG</small></div></div>{nav}
<div class="foot"><b>Butuh bantuan?</b><br>Tim DUMEG siap membantu 24/7.</div></aside>
<section class="main"><div class="top"><div><h1>{E(title)}</h1><div class="muted" style="margin-top:4px;font-size:14px">{E(subtitle)}</div></div>
<div class="search">Cari…</div><div class="avatar"></div></div>{main}</section></body></html>"""


def dashboard(pid, p):
    d = DOMAINS[p["domain"]]
    a = p["accent"]
    kpis = "".join(
        f'<div class="card kpi"><div class="muted" style="font-size:14px">{E(k)}</div><div class="v">{E(v)}</div>'
        f'<div class="delta" style="color:{a}">▲ {random.Random(pid + k).randint(2, 18)}% <span class="muted">vs bulan lalu</span></div></div>'
        for k, v in d["kpi"])
    donut, pct = donut_svg(pid, a)
    legend = "".join(
        f'<div style="display:flex;align-items:center;gap:10px;font-size:14px"><span style="width:12px;height:12px;border-radius:4px;background:{a};opacity:{o}"></span>'
        f'<span class="muted">Segmen {chr(65+i)}</span><b style="margin-left:auto">{v}%</b></div>'
        for i, (v, o) in enumerate(zip(pct, [1, .7, .45, .22])))
    th = "".join(f"<th>{E(h)}</th>" for h in d["table"][1])
    rows = "".join(
        "<tr>" + "".join(f"<td>{status_pill(c, a) if j == 2 else E(c)}</td>" for j, c in enumerate(r)) + "</tr>" for r in d["rows"])
    main = f"""<style>
.kpis {{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }}
.kpi {{ padding:20px 22px; }} .kpi .v {{ font-size:32px; font-weight:700; margin:10px 0 8px; letter-spacing:-.02em; }} .kpi .delta {{ font-size:13px; font-weight:700; }}
.row {{ display:grid; grid-template-columns:2.1fr 1fr; gap:18px; }}
.panel {{ padding:22px 24px; }} .panel h3 {{ font-size:17px; margin-bottom:14px; display:flex; align-items:center; }}
.panel h3 span {{ margin-left:auto; font-size:13px; font-weight:400; }}
table {{ width:100%; border-collapse:collapse; font-size:15px; }} th {{ text-align:left; color:#94a3b8; font-weight:400; font-size:13px; padding:0 0 10px; }}
td {{ padding:11px 0; border-top:1px solid #eef0f5; }}
</style>
<div class="kpis">{kpis}</div>
<div class="row"><div class="card panel"><h3>{E(d['chart'])}<span class="muted">12 bulan terakhir</span></h3>{area_svg(series(pid, 24), 860, 230, a, '#94a3b8')}</div>
<div class="card panel"><h3>{E(d['donut'])}</h3><div style="display:flex;gap:20px;align-items:center">{donut}<div style="flex:1;display:flex;flex-direction:column;gap:12px">{legend}</div></div></div></div>
<div class="row"><div class="card panel"><h3>{E(d['table'][0])}<span class="muted">Lihat semua</span></h3><table><tr>{th}</tr>{rows}</table></div>
<div class="card panel"><h3>Aktivitas Mingguan</h3>{bars_svg(pid + 'b', 400, 230, a)}</div></div>"""
    return app_shell(pid, p, main, d["nav"][0], f"{p['name']} · {p['cat']}")


def crm(pid, p):
    a = p["accent"]
    cols = [("Prospek", ["PT Samudra Logistik", "CV Mitra Kargo", "PT Borneo Energi"]),
            ("Kualifikasi", ["PT Pelayaran Nusa", "Koperasi Nelayan Maju"]),
            ("Proposal", ["PT Terminal Teluk", "PT Agro Kaltim", "CV Gudang Prima"]),
            ("Negosiasi", ["PT Depo Petikemas"]),
            ("Deal", ["PT Tally Andalan", "PT Bahari Raya"])]
    r = random.Random(pid)
    html_cols = ""
    for name, cards in cols:
        cs = "".join(
            f'<div class="card deal"><b>{E(c)}</b><div class="muted" style="font-size:13px;margin:6px 0 12px">Kontak: {E(r.choice(["Budi", "Sari", "Agus", "Lina", "Rudi"]))} · {r.randint(1, 9)} aktivitas</div>'
            f'<div style="display:flex;align-items:center"><span class="pill" style="background:{a}1a;color:{a}">Rp {r.randint(40, 900)} jt</span>'
            f'<span class="avatar" style="width:28px;height:28px;margin-left:auto"></span></div></div>' for c in cards)
        html_cols += f'<div class="col"><div class="colh">{E(name)} <span class="muted">{len(cards)}</span></div>{cs}</div>'
    main = f"""<style>.board {{ display:grid; grid-template-columns:repeat(5,1fr); gap:16px; flex:1; }}
.col {{ background:#eef1f7; border-radius:16px; padding:14px; display:flex; flex-direction:column; gap:12px; }}
.colh {{ font-weight:700; font-size:15px; padding:4px 4px 6px; }} .deal {{ padding:16px; font-size:15px; }}
.stats {{ display:flex; gap:14px; }} .stats .card {{ padding:14px 20px; font-size:14px; }} .stats b {{ font-size:22px; display:block; margin-top:4px; }}</style>
<div class="stats"><div class="card"><span class="muted">Nilai Pipeline</span><b>Rp 6,4 M</b></div><div class="card"><span class="muted">Deal Bulan Ini</span><b>12</b></div>
<div class="card"><span class="muted">Konversi</span><b>27%</b></div><div class="card"><span class="muted">Follow-up Hari Ini</span><b>18</b></div>
<span class="btn primary" style="margin-left:auto;align-self:center">+ Tambah Prospek</span></div>
<div class="board">{html_cols}</div>"""
    p = dict(p, domain="crm")
    DOMAINS.setdefault("crm", dict(nav=["Pipeline", "Kontak", "Perusahaan", "Aktivitas", "Kampanye", "Laporan"]))
    return app_shell(pid, p, main, "Pipeline Penjualan", "Narahubung · CRM")


def chat(pid, p):
    a = p["accent"]
    if p["domain"] == "ai":
        msgs = [("u", "Ringkas laporan bongkar muat minggu ini dan tandai yang perlu perhatian."),
                ("b", "Ringkasan minggu ini:<br>• Total bongkar muat <b>4.920 TEU</b>, naik 6% dari minggu lalu.<br>• Waktu tunggu rata-rata <b>3,2 jam</b>.<br>• Perlu perhatian: Dermaga D-05 mencatat antrean di atas 5 jam pada Rabu dan Kamis."),
                ("u", "Buatkan draf email untuk tim operasional soal D-05."),
                ("b", "Tentu. Berikut drafnya:<br><i>Subjek: Antrean Dermaga D-05</i><br>Tim operasional, mohon evaluasi penjadwalan sandar di D-05 karena antrean melebihi 5 jam…")]
        title, sub, nav = "Fay AI", "Asisten AI · DUMEG", ["Percakapan Baru", "Riwayat", "Dokumen", "Template", "Integrasi", "Pengaturan"]
    else:
        msgs = [("b", "Halo! Selamat datang di Hello Dumeg. Ada yang bisa dibantu hari ini?"),
                ("u", "Sisa cuti tahunan saya berapa?"),
                ("b", "Sisa cuti tahunan kamu <b>9 hari</b>. Mau sekalian ajukan cuti?"),
                ("u", "Ya, tanggal 4–6 November."),
                ("b", "Pengajuan cuti <b>4–6 Nov</b> sudah dibuat dan dikirim ke atasan untuk persetujuan. ✓")]
        title, sub, nav = "Hello Dumeg", "Layanan Karyawan", ["Obrolan", "Pengajuan", "Slip Gaji", "Kehadiran", "Info Kantor", "Profil"]
    DOMAINS[p["domain"]] = dict(nav=nav)
    bubbles = "".join(
        f'<div class="msg {w}"><div class="bub">{t}</div></div>' for w, t in msgs)
    chips = "".join(f'<span class="chip">{E(c)}</span>' for c in ["Ringkas dokumen", "Buat laporan", "Cek jadwal", "Analisis data"])
    main = f"""<style>.chatwrap {{ flex:1; display:grid; grid-template-columns:1fr 330px; gap:18px; min-height:0; }}
.chat {{ padding:26px 30px; display:flex; flex-direction:column; gap:16px; }}
.msg {{ display:flex; }} .msg.u {{ justify-content:flex-end; }}
.bub {{ max-width:68%; padding:16px 20px; border-radius:18px; font-size:16px; line-height:1.55; background:#f1f4f9; }}
.msg.u .bub {{ background:{a}; color:#fff; border-bottom-right-radius:6px; }} .msg.b .bub {{ border-bottom-left-radius:6px; }}
.input {{ margin-top:auto; display:flex; align-items:center; gap:12px; border:1.5px solid #e2e8f0; border-radius:16px; padding:14px 18px; color:#94a3b8; }}
.chip {{ padding:8px 14px; border-radius:999px; background:{a}14; color:{a}; font-size:13px; font-weight:700; }}
.info {{ padding:22px; display:flex; flex-direction:column; gap:14px; }}</style>
<div class="chatwrap"><div class="card chat">{bubbles}<div style="display:flex;gap:8px;flex-wrap:wrap">{chips}</div>
<div class="input">Ketik pesan…<span class="btn primary" style="margin-left:auto;padding:10px 18px">Kirim</span></div></div>
<div class="card info"><b style="font-size:17px">Konteks</b><div class="muted" style="font-size:14px;line-height:1.6">Terhubung ke data internal DUMEG dengan izin akses sesuai peran pengguna.</div>
{''.join(f'<div class="card" style="padding:14px;font-size:14px"><b>{E(x)}</b><div class="muted" style="margin-top:4px">Diperbarui hari ini</div></div>' for x in ['Laporan Operasional', 'Kebijakan Cuti 2026', 'Jadwal Kapal'])}</div></div>"""
    return app_shell(pid, p, main, title, sub)


def doc(pid, p):
    a = p["accent"]
    DOMAINS["doc"] = dict(nav=["Dokumen", "Unggah", "Ekstraksi", "Validasi", "Arsip", "Pengaturan"])
    lines = "".join(f'<div style="height:10px;border-radius:5px;background:#e5e7eb;width:{w}%;margin:9px 0"></div>' for w in
                    [92, 86, 95, 70, 88, 60, 93, 81, 77, 90, 66, 85, 72, 94, 58])
    fields = [("Nomor Dokumen", "BL/2026/10/00412"), ("Nama Kapal", "MV Nusantara Jaya"), ("Pelabuhan Muat", "Balikpapan"),
              ("Pelabuhan Bongkar", "Tanjung Perak"), ("Jumlah Muatan", "1.240 ton"), ("Tanggal", "18 Oktober 2026")]
    fh = "".join(
        f'<div class="fld"><div class="muted" style="font-size:13px">{E(k)}</div><div class="val">{E(v)}<span class="pill" style="background:{a}14;color:{a};margin-left:auto">98%</span></div></div>'
        for k, v in fields)
    main = f"""<style>.docwrap {{ flex:1; display:grid; grid-template-columns:1.1fr 1fr; gap:18px; }}
.paper {{ background:#fff; margin:22px auto; width:78%; padding:40px 44px; box-shadow:0 10px 30px rgba(15,23,42,.12); border-radius:6px; position:relative; }}
.hl {{ position:absolute; left:40px; right:120px; height:24px; border:2px solid {a}; border-radius:6px; background:{a}10; }}
.fld {{ padding:14px 0; border-top:1px solid #eef0f5; }} .val {{ display:flex; align-items:center; font-size:17px; font-weight:700; margin-top:6px; }}</style>
<div class="docwrap"><div class="card" style="background:#eef1f6;overflow:hidden"><div class="paper"><b style="font-size:20px">BILL OF LADING</b>
<div class="hl" style="top:84px"></div><div class="hl" style="top:150px;right:200px"></div>{lines}</div></div>
<div class="card" style="padding:24px 26px"><div style="display:flex;align-items:center"><b style="font-size:18px">Hasil Ekstraksi</b>
<span class="pill" style="background:{a};color:#fff;margin-left:auto">Selesai · 2,4 dtk</span></div>{fh}
<div style="display:flex;gap:10px;margin-top:18px"><span class="btn primary">Validasi & Simpan</span><span class="btn ghost">Ekspor JSON</span></div></div></div>"""
    return app_shell(pid, p, main, "Ekstraksi Dokumen", "DOCR · OCR dokumen logistik")


def pos(pid, p):
    a = p["accent"]
    DOMAINS["pos"] = dict(nav=["Kasir", "Pesanan", "Meja", "Menu", "Stok", "Laporan"])
    r = random.Random(pid)
    items = ["Nasi Goreng Kampung", "Mie Ayam Bakso", "Ayam Bakar Madu", "Soto Banjar", "Es Teh Manis", "Kopi Susu Gula Aren",
             "Sate Ayam", "Ikan Bakar", "Jus Alpukat", "Pisang Goreng", "Nasi Kuning", "Teh Tarik"]
    tiles = "".join(
        f'<div class="card tile"><div class="ph" style="background:linear-gradient(135deg,{a}33,{a}0d)"></div><b>{E(n)}</b>'
        f'<div style="display:flex;align-items:center;margin-top:6px"><span style="color:{a};font-weight:700">Rp {r.randint(8, 45)}.000</span>'
        f'<span class="add" style="background:{a}">+</span></div></div>' for n in items)
    order = [("Nasi Goreng Kampung", 2, 32), ("Es Teh Manis", 2, 8), ("Sate Ayam", 1, 35), ("Kopi Susu Gula Aren", 1, 22)]
    oh = "".join(f'<div class="oi"><span>{q}×</span><b>{E(n)}</b><span style="margin-left:auto">Rp {q*pr}.000</span></div>' for n, q, pr in order)
    main = f"""<style>.poswrap {{ flex:1; display:grid; grid-template-columns:1fr 380px; gap:18px; min-height:0; }}
.cats {{ display:flex; gap:10px; margin-bottom:16px; }} .cats span {{ padding:10px 18px; border-radius:999px; background:#fff; border:1px solid #e8ebf2; font-size:14px; }}
.cats span.on {{ background:{a}; color:#fff; border-color:{a}; }}
.grid {{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }} .tile {{ padding:12px; font-size:15px; }}
.ph {{ height:92px; border-radius:12px; margin-bottom:10px; }} .add {{ margin-left:auto; width:30px; height:30px; border-radius:9px; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; }}
.order {{ padding:22px; display:flex; flex-direction:column; gap:4px; }} .oi {{ display:flex; gap:10px; padding:12px 0; border-top:1px solid #eef0f5; font-size:15px; }}</style>
<div class="poswrap"><div><div class="cats"><span class="on">Semua</span><span>Makanan</span><span>Minuman</span><span>Camilan</span><span>Promo</span></div><div class="grid">{tiles}</div></div>
<div class="card order"><div style="display:flex;align-items:center"><b style="font-size:18px">Pesanan · Meja 07</b><span class="pill" style="background:{a}1a;color:{a};margin-left:auto">Dine-in</span></div>{oh}
<div style="margin-top:auto;border-top:2px dashed #e2e8f0;padding-top:14px;display:flex;font-size:15px"><span class="muted">Subtotal</span><span style="margin-left:auto">Rp 137.000</span></div>
<div style="display:flex;font-size:15px;margin:6px 0 14px"><span class="muted">Pajak 10%</span><span style="margin-left:auto">Rp 13.700</span></div>
<div style="display:flex;font-size:22px;font-weight:700;margin-bottom:16px"><span>Total</span><span style="margin-left:auto">Rp 150.700</span></div>
<span class="btn primary" style="justify-content:center">Bayar</span></div></div>"""
    return app_shell(pid, p, main, "Kasir", "D-POS · LILO Resto")


def portal(pid, info):
    """Public website / landing page (full page, taller than the monitor -> auto-scrolls)."""
    a = info["accent"]
    a2 = info.get("accent2", a)
    dark = info.get("dark", False)
    hero_bg = f"linear-gradient(135deg,{a} 0%,#0b1220 120%)" if dark else f"linear-gradient(180deg,{a}12,#f5f7fb)"
    hero_ink = "#fff" if dark else "#0f172a"
    nav = "".join(f'<span{" class=on" if i == 0 else ""}>{E(n)}</span>' for i, n in enumerate(info["nav"]))
    facts = "".join(f'<div class="fact"><div class="fv">{E(v)}</div><div class="muted">{E(k)}</div></div>' for k, v in info["facts"])
    r = random.Random(pid)
    news = "".join(
        f'<div class="card news"><div class="nimg" style="background:linear-gradient({r.randint(100,160)}deg,{a}55,{a2}22,#e2e8f0)"></div>'
        f'<div style="padding:18px"><span class="muted" style="font-size:13px">{r.randint(1,28)} Oktober 2026</span><b style="display:block;font-size:18px;margin-top:8px;line-height:1.35">{E(t)}</b></div></div>'
        for t in ["Rapat kerja tahunan bahas digitalisasi layanan anggota", "Sosialisasi regulasi terbaru bersama regulator",
                  "Peluncuran portal layanan terpadu versi baru"])
    services = "".join(
        f'<div class="card svc"><span class="sico" style="background:{a}"></span><b style="font-size:19px">{E(t)}</b><p class="muted">{E(d)}</p></div>'
        for t, d in [("Layanan Anggota", "Registrasi, verifikasi, dan pembaruan data anggota secara daring."),
                     ("Informasi & Regulasi", "Akses peraturan, surat edaran, dan pengumuman resmi terbaru."),
                     ("Pelaporan Digital", "Kirim dan pantau laporan berkala langsung dari dashboard.")])
    visual = f"""<div class="vis"><div class="card vcard" style="top:0;left:40px;width:420px"><div style="display:flex;gap:10px;align-items:center">{logo_html(pid, info, 34)}<b>{E(info['name'])}</b><span class="pill" style="background:{a}1a;color:{a};margin-left:auto">Live</span></div>
{area_svg(series(pid, 16), 380, 120, a)}</div>
<div class="card vcard" style="top:200px;left:0;width:300px"><div class="muted" style="font-size:13px">{E(info['facts'][0][0])}</div><div style="font-size:30px;font-weight:700;margin-top:6px">{E(info['facts'][0][1])}</div></div>
<div class="card vcard" style="top:230px;left:320px;width:220px;background:{a};color:#fff;border:none"><div style="font-size:13px;opacity:.8">{E(info['facts'][1][0])}</div><div style="font-size:24px;font-weight:700;margin-top:6px">{E(info['facts'][1][1])}</div></div></div>"""
    return f"""<html><head><style>{base_css(a)}
body {{ width:1600px; background:#fff; }}
header {{ display:flex; align-items:center; gap:16px; padding:22px 64px; background:{'transparent' if dark else '#fff'}; position:absolute; left:0; right:0; color:{hero_ink}; }}
header .org {{ font-weight:700; font-size:17px; line-height:1.2; }} header .org small {{ display:block; font-weight:400; font-size:12px; opacity:.65; }}
nav {{ display:flex; gap:30px; margin-left:auto; font-size:15px; }} nav .on {{ font-weight:700; color:{a2 if dark else a}; }}
.hero {{ background:{hero_bg}; color:{hero_ink}; padding:170px 64px 110px; display:grid; grid-template-columns:1.05fr 1fr; gap:40px; align-items:center; }}
.eyebrow {{ display:inline-block; padding:8px 14px; border-radius:999px; font-size:13px; font-weight:700; background:{a2 if dark else a}; color:{'#0b1220' if dark else '#fff'}; }}
.hero h1 {{ font-size:64px; line-height:1.04; letter-spacing:-.025em; margin:22px 0; }}
.hero p {{ font-size:19px; line-height:1.6; opacity:.8; max-width:600px; }}
.vis {{ position:relative; height:360px; }} .vcard {{ position:absolute; padding:20px; color:#0f172a; box-shadow:0 20px 50px rgba(15,23,42,.18); }}
.facts {{ display:grid; grid-template-columns:repeat(4,1fr); margin:-50px 64px 0; background:#fff; border-radius:20px; box-shadow:0 18px 50px rgba(15,23,42,.10); position:relative; }}
.fact {{ padding:28px 30px; border-left:1px solid #eef0f5; }} .fact:first-child {{ border:none; }} .fv {{ font-size:28px; font-weight:700; margin-bottom:6px; color:{a}; }}
section {{ padding:80px 64px 0; }} h2 {{ font-size:40px; letter-spacing:-.02em; margin-bottom:28px; }}
.svcs {{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }} .svc {{ padding:28px; }} .svc p {{ margin-top:10px; line-height:1.6; font-size:15px; }}
.sico {{ display:block; width:46px; height:46px; border-radius:14px; margin-bottom:18px; }}
.newsg {{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }} .news {{ overflow:hidden; }} .nimg {{ height:190px; }}
footer {{ margin-top:90px; background:#0b1220; color:#cbd5e1; padding:50px 64px; display:flex; gap:60px; font-size:15px; }}
</style></head><body>
<header>{logo_html(pid, info, 46)}<div class="org">{E(info['name'])}<small>{E(info['full'])}</small></div><nav>{nav}</nav>
<span class="btn primary" style="padding:11px 20px;{'background:'+a2+';color:#0b1220' if dark else ''}">{E(info.get('cta', 'Masuk Anggota'))}</span></header>
<div class="hero"><div><span class="eyebrow">{E(info['sub'])}</span><h1>{E(info['head'])}</h1><p>{E(info['desc'])}</p>
<div style="display:flex;gap:12px;margin-top:30px"><span class="btn primary" style="{'background:'+a2+';color:#0b1220' if dark else ''}">{E(info.get('cta', 'Daftar Anggota'))}</span>
<span class="btn ghost" style="{'color:#fff;border-color:#ffffff55' if dark else ''}">Pelajari Lebih Lanjut</span></div></div>{visual}</div>
<div class="facts">{facts}</div>
<section><h2>Layanan</h2><div class="svcs">{services}</div></section>
<section><h2>Berita Terkini</h2><div class="newsg">{news}</div></section>
<footer><div><b style="color:#fff;font-size:18px">{E(info['name'])}</b><p style="margin-top:10px;max-width:360px;line-height:1.6">{E(info['full'])}</p></div>
<div>Beranda<br>Tentang<br>Layanan</div><div>Berita<br>Kontak<br>Kebijakan Privasi</div><div style="margin-left:auto;opacity:.6">Dikembangkan oleh DUMEG</div></footer>
</body></html>"""


def build_all():
    pages = {}
    for pid, info in ASSOC.items():
        pages[pid] = (portal(pid, dict(info)), True)
    for pid, p in PRODUCTS.items():
        if p["kind"] == "portal":
            info = dict(p, **PORTAL_EXTRA[pid])
            pages[pid] = (portal(pid, info), True)
        elif p["kind"] == "dashboard":
            pages[pid] = (dashboard(pid, p), False)
        elif p["kind"] == "crm":
            pages[pid] = (crm(pid, p), False)
        elif p["kind"] == "chat":
            pages[pid] = (chat(pid, p), False)
        elif p["kind"] == "doc":
            pages[pid] = (doc(pid, p), False)
        elif p["kind"] == "pos":
            pages[pid] = (pos(pid, p), False)
    return pages


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path("/tmp/claude-0/screens_html")
    tmp.mkdir(parents=True, exist_ok=True)
    pages = build_all()
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(viewport={"width": 1600, "height": 1000})
        for pid, (doc_html, full) in pages.items():
            f = tmp / f"{pid}.html"
            f.write_text(doc_html, encoding="utf-8")
            await pg.goto(f.as_uri())
            await pg.wait_for_timeout(150)
            if full:
                h = await pg.evaluate("document.documentElement.scrollHeight")
                await pg.set_viewport_size({"width": 1600, "height": min(h, 2600)})
            await pg.screenshot(path=str(OUT / f"{pid}.jpg"), type="jpeg", quality=82, full_page=False)
            await pg.set_viewport_size({"width": 1600, "height": 1000})
            print("rendered", pid)
        await b.close()


if __name__ == "__main__":
    asyncio.run(main())
