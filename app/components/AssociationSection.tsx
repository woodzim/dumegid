'use client';

import { useState } from 'react';
import AccordionGallery, { AccordionItem } from './AccordionGallery';

interface AssociationData extends AccordionItem {
    id: string;
    abbr: string;
    fullName: string;
    systemName: string;
    tagline: string;
    description: string;
    scope: string;
    keyFacts: { label: string; value: string }[];
    regulatoryBasis?: string;
    accentBg: string;
    accentText: string;
}

const ASSOCIATIONS: AssociationData[] = [
    {
        id: 'aptmi',
        abbr: 'APTMI',
        label: 'APTMI — Tally Mandiri',
        fullName: 'Asosiasi Perusahaan Tally Mandiri Indonesia',
        systemName: 'Platform Digitalisasi YADRI & Tally Mandiri Nasional',
        tagline: 'Tulang punggung data statistik pelabuhan dan inspeksi muatan kargo nasional.',
        description:
            'APTMI menyatukan seluruh perusahaan tally mandiri di Indonesia untuk memastikan pencatatan muatan pelabuhan yang akurat, independen, dan bebas manipulasi. Setiap anggota menjalankan inspeksi kargo secara mandiri — tidak berpihak ke pengangkut maupun pemilik muatan.',
        scope: 'Nasional — Seluruh Pelabuhan Indonesia',
        image: '/images/asosiasi/cover/APTMI_COVER.png',
        accentColor: '#38bdf8',
        accentBg: 'rgba(56, 189, 248, 0.12)',
        accentText: '#38bdf8',
        keyFacts: [
            { label: 'Regulasi Dasar', value: 'PM 59 / 2021 + SE DJPL No. 4 / 2022' },
            { label: 'Fungsi Utama', value: 'Inspeksi independen & data statistik nasional' },
            { label: 'Pelaporan Resmi', value: 'Penyelenggara Pelabuhan & Gubernur' },
            { label: 'Mitra Teknologi', value: 'Platform YADRI oleh DUMEG' },
        ],
        regulatoryBasis:
            'Pasal 2 & 37 PM 59/2021 menetapkan Tally Mandiri sebagai layanan independen wajib yang mencakup jasa menghitung, mengukur, menimbang, dan membuat catatan muatan demi kepentingan pemilik muatan atau pengangkut.',
    },
    {
        id: 'gpei',
        abbr: 'GPEI',
        label: 'GPEI — Ekspor Indonesia',
        fullName: 'Gabungan Perusahaan Ekspor Indonesia',
        systemName: 'Portal ExportLane & Direktori Eksportir Terpadu',
        tagline: 'Mesin penggerak ekspor Indonesia dan fasilitasi pasar global sejak 1961.',
        description:
            'GPEI adalah asosiasi eksportir tertua dan terbesar di Indonesia dengan lebih dari 2.500 anggota aktif tersebar di 14 DPD provinsi. Membantu UMKM dan korporasi ekspor menembus pasar internasional melalui digitalisasi dokumen dan fasilitasi perjanjian dagang bebas.',
        scope: '14 DPD Provinsi — Pasar Ekspor Global',
        image: '/images/asosiasi/cover/GPEI_COVER.png',
        accentColor: '#60a5fa',
        accentBg: 'rgba(96, 165, 250, 0.12)',
        accentText: '#60a5fa',
        keyFacts: [
            { label: 'Total Anggota', value: '2.500+ Eksportir Terverifikasi' },
            { label: 'Jaringan Wilayah', value: '14 DPD Provinsi' },
            { label: 'Program Unggulan', value: 'ExportLane, IEU-CEPA & ICA-CEPA' },
            { label: 'Sistem Terintegrasi', value: 'Portal Direktori & Verifikasi Anggota' },
        ],
    },
    {
        id: 'atti',
        abbr: 'ATTI',
        label: 'ATTI — Terminal Khusus',
        fullName: 'Asosiasi TUKS dan TERSUS Indonesia',
        systemName: 'Sistem Standarisasi & Pelayanan Terminal Khusus Korporasi',
        tagline: 'Wadah resmi pengelola terminal khusus industri migas, tambang, dan manufaktur.',
        description:
            'ATTI adalah rumah bagi perusahaan pengelola Terminal Khusus (TUKS) dan Terminal Untuk Kepentingan Sendiri (TERSUS). Mengintegrasikan standarisasi operasional, sertifikasi pelatihan kru terminal, serta kepatuhan regulasi Kemenhub dan Pelindo.',
        scope: 'Seluruh Terminal Khusus & TERSUS Indonesia',
        image: '/images/asosiasi/cover/ATTI_COVER.png',
        accentColor: '#818cf8',
        accentBg: 'rgba(129, 140, 248, 0.12)',
        accentText: '#818cf8',
        keyFacts: [
            { label: 'Tipe Terminal', value: 'TUKS (luar pelabuhan) & TERSUS (dalam pelabuhan)' },
            { label: 'Mitra Regulator', value: 'Kemenhub RI & PT Pelindo' },
            { label: 'Layanan Anggota', value: 'Sertifikasi pelatihan & advokasi operasional' },
            { label: 'Infrastruktur IT', value: 'Portal Digital ATTI by DUMEG' },
        ],
    },
    {
        id: 'depalindo',
        abbr: 'DEPALINDO',
        label: 'DEPALINDO — Pengguna Logistik',
        fullName: 'Dewan Pengguna Angkutan & Logistik Indonesia',
        systemName: 'Platform Advokasi Tarif & Integrasi Pemilik Kargo',
        tagline: 'Pelindung hak dan kepentingan pemilik kargo dari biaya logistik tidak proporsional.',
        description:
            'Diakui pemerintah sejak 1975 dan didirikan oleh entitas strategis nasional seperti BULOG dan GAPKINDO. DEPALINDO (INSC) aktif memperjuangkan transparansi tarif freight, demurrage, serta integrasi ekosistem logistik multimoda nasional.',
        scope: 'Nasional — Semua Moda Angkutan Darat & Laut',
        image: '/images/asosiasi/cover/DEPALINDO_COVER.png',
        accentColor: '#c084fc',
        accentBg: 'rgba(192, 132, 252, 0.12)',
        accentText: '#c084fc',
        keyFacts: [
            { label: 'Didirikan Sejak', value: 'Tahun 1975 (Diakui Pemerintah)' },
            { label: 'Inisiator Awal', value: 'BULOG, GAPKINDO, dkk.' },
            { label: 'Fokus Utama', value: 'Advokasi tarif kargo & analisis pasar' },
            { label: 'Jaringan Bisnis', value: 'Aliansi Pengguna Logistik Global' },
        ],
    },
    {
        id: 'apbmi',
        abbr: 'APBMI Kaltim',
        label: 'APBMI Kaltim — Bongkar Muat',
        fullName: 'APBMI Kaltim & LPKSM',
        systemName: 'Sistem E-PBM & Pengawasan Bongkar Muat Borneo',
        tagline: 'Koordinasi stevedoring dan perlindungan konsumen maritim Kalimantan Timur.',
        description:
            'APBMI Kaltim mengkoordinasi kegiatan stevedoring bongkar muat barang khusus di wilayah pelabuhan strategis Kalimantan Timur (batu bara, CPO, dan kargo tambang). Memastikan efisiensi rantai pasok maritim dan kepatuhan standar keselamatan kerja pelabuhan.',
        scope: 'Wilayah Kerja Seluruh Pelabuhan Kalimantan Timur',
        image: '/images/asosiasi/cover/APBMI_COVER.png',
        accentColor: '#34d399',
        accentBg: 'rgba(52, 211, 153, 0.12)',
        accentText: '#34d399',
        keyFacts: [
            { label: 'Cakupan Wilayah', value: 'Pelabuhan Utama Kalimantan Timur' },
            { label: 'Komoditas Unggulan', value: 'Batu bara, CPO, hasil tambang & agro' },
            { label: 'Sistem Terapan', value: 'E-PBM Digital & Integrasi YADRI' },
            { label: 'Layanan Pendukung', value: 'LPKSM Pengawasan Konsumen Ritel' },
        ],
    },
];

export default function AssociationSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeAssoc = ASSOCIATIONS[activeIndex];

    return (
        <section id="asosiasi" className="dmg-section" aria-label="Portfolio Sistem Asosiasi">
            <div className="dmg-container">
                {/* Header */}
                <div className="dmg-section-header">
                    <div style={{ maxWidth: 620 }}>
                        <span className="dmg-section-tag">PORTFOLIO SISTEM ASOSIASI</span>
                        <h2 className="dmg-section-title">
                            Digitalisasi Terpercaya untuk Asosiasi Maritim & Logistik Nasional
                        </h2>
                    </div>
                    <p style={{ fontSize: 14.5, color: '#cbd8fc', maxWidth: 420, lineHeight: 1.6 }}>
                        DUMEG dipercaya mengembangkan dan mengoperasikan ekosistem digital terpadu untuk asosiasi-asosiasi penggerak logistik Indonesia.
                    </p>
                </div>

                {/* 3D GSAP Accordion Gallery */}
                <div style={{ marginTop: 24 }}>
                    <AccordionGallery
                        items={ASSOCIATIONS}
                        defaultIndex={0}
                        accentColor={activeAssoc.accentColor}
                        height={460}
                        gap={12}
                        radius={22}
                        expandRatio={0.48}
                        duration={0.65}
                        onActiveChange={(idx) => setActiveIndex(idx)}
                    />
                </div>
            </div>
        </section>
    );
}
