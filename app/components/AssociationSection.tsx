'use client';

import { useState } from 'react';
import Image from 'next/image';
import AccordionGallery, { AccordionItem } from './AccordionGallery';
import { Marks, Notch, SectionHead } from './DmgKit';

interface AssociationData extends AccordionItem {
    id: string;
    abbr: string;
    fullName: string;
    systemName: string;
    tagline: string;
    description: string;
    scope: string;
    logo: string;
    keyFacts: { label: string; value: string }[];
    regulatoryBasis?: string;
}

const ASSOCIATIONS: AssociationData[] = [
    {
        id: 'aptmi',
        abbr: 'APTMI',
        label: 'APTMI: Tally Mandiri',
        fullName: 'Asosiasi Perusahaan Tally Mandiri Indonesia',
        systemName: 'Platform Digitalisasi YADRI & Tally Mandiri Nasional',
        tagline: 'Tulang punggung data statistik pelabuhan dan inspeksi muatan kargo nasional.',
        description:
            'APTMI menyatukan seluruh perusahaan tally mandiri di Indonesia untuk memastikan pencatatan muatan pelabuhan yang akurat, independen, dan bebas manipulasi. Setiap anggota menjalankan inspeksi kargo secara mandiri: tidak berpihak ke pengangkut maupun pemilik muatan.',
        scope: 'Nasional: Seluruh Pelabuhan Indonesia',
        image: '/images/asosiasi/cover/APTMI_COVER.png',
        logo: '/images/asosiasi/logo_asosiasi/aptmi_logo.png',
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
        label: 'GPEI: Ekspor Indonesia',
        fullName: 'Gabungan Perusahaan Ekspor Indonesia',
        systemName: 'Portal ExportLane & Direktori Eksportir Terpadu',
        tagline: 'Mesin penggerak ekspor Indonesia dan fasilitasi pasar global sejak 1961.',
        description:
            'GPEI adalah asosiasi eksportir tertua dan terbesar di Indonesia dengan lebih dari 2.500 anggota aktif tersebar di 14 DPD provinsi. Membantu UMKM dan korporasi ekspor menembus pasar internasional melalui digitalisasi dokumen dan fasilitasi perjanjian dagang bebas.',
        scope: '14 DPD Provinsi: Pasar Ekspor Global',
        image: '/images/asosiasi/cover/GPEI_COVER.png',
        logo: '/images/asosiasi/logo_asosiasi/gpei_logo.png',
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
        label: 'ATTI: Terminal Khusus',
        fullName: 'Asosiasi TUKS dan TERSUS Indonesia',
        systemName: 'Sistem Standarisasi & Pelayanan Terminal Khusus Korporasi',
        tagline: 'Wadah resmi pengelola terminal khusus industri migas, tambang, dan manufaktur.',
        description:
            'ATTI adalah rumah bagi perusahaan pengelola Terminal Khusus (TUKS) dan Terminal Untuk Kepentingan Sendiri (TERSUS). Mengintegrasikan standarisasi operasional, sertifikasi pelatihan kru terminal, serta kepatuhan regulasi Kemenhub dan Pelindo.',
        scope: 'Seluruh Terminal Khusus & TERSUS Indonesia',
        image: '/images/asosiasi/cover/ATTI_COVER.png',
        logo: '/images/asosiasi/logo_asosiasi/atti_logo.png',
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
        label: 'DEPALINDO: Pengguna Logistik',
        fullName: 'Dewan Pengguna Angkutan & Logistik Indonesia',
        systemName: 'Platform Advokasi Tarif & Integrasi Pemilik Kargo',
        tagline: 'Pelindung hak dan kepentingan pemilik kargo dari biaya logistik tidak proporsional.',
        description:
            'Diakui pemerintah sejak 1975 dan didirikan oleh entitas strategis nasional seperti BULOG dan GAPKINDO. DEPALINDO (INSC) aktif memperjuangkan transparansi tarif freight, demurrage, serta integrasi ekosistem logistik multimoda nasional.',
        scope: 'Nasional: Semua Moda Angkutan Darat & Laut',
        image: '/images/asosiasi/cover/DEPALINDO_COVER.png',
        logo: '/images/asosiasi/logo_asosiasi/depalindo_logo.png',
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
        label: 'APBMI Kaltim: Bongkar Muat',
        fullName: 'APBMI Kaltim & LPKSM',
        systemName: 'Sistem E-PBM & Pengawasan Bongkar Muat Borneo',
        tagline: 'Koordinasi stevedoring dan perlindungan konsumen maritim Kalimantan Timur.',
        description:
            'APBMI Kaltim mengkoordinasi kegiatan stevedoring bongkar muat barang khusus di wilayah pelabuhan strategis Kalimantan Timur (batu bara, CPO, dan kargo tambang). Memastikan efisiensi rantai pasok maritim dan kepatuhan standar keselamatan kerja pelabuhan.',
        scope: 'Wilayah Kerja Seluruh Pelabuhan Kalimantan Timur',
        image: '/images/asosiasi/cover/APBMI_COVER.png',
        logo: '/images/asosiasi/logo_asosiasi/apbmi_logo.webp',
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
                <SectionHead
                    index="03"
                    label="Portfolio sistem asosiasi"
                    title={
                        <>
                            Asosiasi
                            <Marks />
                            <br />
                            maritim nasional
                        </>
                    }
                    aside={
                        <p>
                            DUMEG dipercaya mengembangkan dan mengoperasikan ekosistem digital terpadu untuk asosiasi-asosiasi penggerak logistik Indonesia.
                        </p>
                    }
                />

                <AccordionGallery
                    items={ASSOCIATIONS}
                    defaultIndex={0}
                    accentColor="var(--dmg-accent)"
                    height={420}
                    gap={12}
                    radius={24}
                    expandRatio={0.48}
                    duration={0.65}
                    onActiveChange={(idx) => setActiveIndex(idx)}
                />

                {/* Active association detail */}
                <div className="as-detail">
                    <div className="dmg-card dmg-card-dark as-id">
                        <Notch corner="tr">
                            {activeIndex + 1}/{ASSOCIATIONS.length}
                        </Notch>
                        <div key={activeAssoc.id} className="dmg-fade-in as-id-inner">
                            <div>
                                <span className="dmg-mono as-k">Asosiasi:</span>
                                <div className="dmg-num as-abbr">{activeAssoc.abbr}</div>
                                <div className="dmg-mono as-full">{activeAssoc.fullName}</div>
                            </div>
                            <div className="as-logo">
                                <Image
                                    src={activeAssoc.logo}
                                    alt={`Logo ${activeAssoc.abbr}`}
                                    fill
                                    sizes="96px"
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <div>
                                <span className="dmg-mono as-k">Sistem:</span>
                                <div className="dmg-mono as-system">[{activeAssoc.systemName}]</div>
                            </div>
                        </div>
                    </div>

                    <div className="dmg-card as-info">
                        <Notch corner="tr">{activeAssoc.scope}</Notch>
                        <div key={activeAssoc.id} className="dmg-fade-in">
                            <h3 className="as-tagline">{activeAssoc.tagline}</h3>
                            <p className="as-desc">{activeAssoc.description}</p>
                            <dl className="as-facts">
                                {activeAssoc.keyFacts.map((f) => (
                                    <div key={f.label} className="as-fact">
                                        <dt className="dmg-label">{f.label}</dt>
                                        <dd>{f.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            {activeAssoc.regulatoryBasis && (
                                <p className="dmg-mono as-reg">{activeAssoc.regulatoryBasis}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .as-detail {
                    display: grid;
                    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
                    gap: 12px;
                    margin-top: 12px;
                }
                .as-id { padding: 28px; }
                .as-id-inner {
                    height: 100%;
                    min-height: 320px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 32px;
                }
                .as-k {
                    display: block;
                    font-size: 10px;
                    color: var(--dmg-on-dark-soft);
                    margin-bottom: 12px;
                }
                .as-abbr {
                    font-size: clamp(36px, 4.4vw, 64px);
                    text-transform: uppercase;
                    color: var(--dmg-accent);
                    word-break: break-word;
                }
                .as-full { font-size: 12px; line-height: 1.5; margin-top: 16px; max-width: 360px; }
                .as-system { font-size: 13px; line-height: 1.5; }
                .as-logo {
                    position: relative;
                    width: 96px;
                    height: 96px;
                    border-radius: 20px;
                    background: var(--dmg-surface);
                    overflow: hidden;
                }
                .as-logo img { padding: 12px; }

                .as-info { padding: 28px; }
                .as-info .dmg-notch { max-width: 70%; overflow: hidden; text-overflow: ellipsis; }
                .as-tagline {
                    font-family: var(--font-main);
                    font-size: clamp(22px, 2.2vw, 32px);
                    font-weight: 400;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    max-width: 640px;
                    padding-top: 48px;
                }
                .as-desc {
                    font-size: 14px;
                    line-height: 1.65;
                    color: var(--dmg-ink-soft);
                    margin-top: 16px;
                    max-width: 680px;
                }
                .as-facts {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 8px;
                    margin-top: 24px;
                }
                .as-fact {
                    padding: 16px;
                    border-radius: 16px;
                    background: var(--dmg-bg);
                }
                .as-fact dd {
                    font-size: 13px;
                    line-height: 1.45;
                    margin-top: 8px;
                }
                .as-reg {
                    font-size: 10px;
                    line-height: 1.7;
                    color: var(--dmg-ink-soft);
                    margin-top: 20px;
                }

                @media (max-width: 900px) {
                    .as-detail { grid-template-columns: 1fr; }
                    .as-id-inner { min-height: 0; }
                }
                @media (max-width: 520px) {
                    .as-facts { grid-template-columns: 1fr; }
                    .as-info .dmg-notch { display: none; }
                    .as-tagline { padding-top: 0; }
                }
            `}</style>
        </section>
    );
}
