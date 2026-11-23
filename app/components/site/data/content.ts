/**
 * All DUMEG copy and data for the site. Pages and sections read from here only,
 * so wording changes happen in one place. Facts come from the previous site
 * (associations, products, services, partners, contact); nothing is invented.
 */

export const SITE = {
    name: 'DUMEG',
    legal: 'PT Duta Meta Graha',
    tagline: 'Solusi Digital Maritim, Pelabuhan & Logistik',
    email: 'dumegid@dumeg.com',
    phone: '+62 822-1878-8724',
    phoneHref: 'tel:+6282218788724',
    country: 'Indonesia',
    year: 2026,
};

export const NAV = [
    { href: '/', label: 'Ekosistem' },
    { href: '/tentang', label: 'Tentang' },
    { href: '/work', label: 'Karya' },
    { href: '/clients', label: 'Klien' },
    { href: '/universe', label: 'Semesta' },
    { href: '/contact', label: 'Kontak' },
];

export const HERO = {
    label: 'Ekosistem',
    text: 'Rumah teknologi maritim dari Indonesia. Kami menghubungkan angkutan, gudang, dan pelabuhan dalam satu ekosistem end to end, lengkap dengan aplikasi pendukung dan media center.',
};

// ------------------------------------------------------------------ projects (works + case studies)
export interface ProjectFact {
    label: string;
    value: string;
}

export interface Project {
    slug: string;
    name: string;
    /** shown in brackets next to the name, like the agency column of the reference */
    client: string;
    category: string;
    logo?: string;
    cover: string;
    gallery: string[];
    fullName: string;
    system: string;
    tagline: string;
    description: string;
    scope: string;
    facts: ProjectFact[];
    note?: string;
    accent: string;
}

const s = (id: string) => `/screens/${id}.jpg`;

export const PROJECTS: Project[] = [
    {
        slug: 'aptmi',
        name: 'APTMI',
        client: 'Tally Mandiri',
        category: 'Asosiasi',
        logo: '/images/asosiasi/logo_asosiasi/aptmi_logo.png',
        cover: '/images/asosiasi/cover/APTMI_COVER.png',
        gallery: ['/images/asosiasi/cover/APTMI_COVER.png', s('aptmi'), s('survlus'), s('porta')],
        fullName: 'Asosiasi Perusahaan Tally Mandiri Indonesia',
        system: 'Platform Digitalisasi YADRI & Tally Mandiri Nasional',
        tagline: 'Tulang punggung data statistik pelabuhan dan inspeksi muatan kargo nasional.',
        description:
            'APTMI menyatukan seluruh perusahaan tally mandiri di Indonesia untuk memastikan pencatatan muatan pelabuhan yang akurat, independen, dan bebas manipulasi. Setiap anggota menjalankan inspeksi kargo secara mandiri: tidak berpihak ke pengangkut maupun pemilik muatan.',
        scope: 'Nasional: Seluruh Pelabuhan Indonesia',
        facts: [
            { label: 'Regulasi Dasar', value: 'PM 59 / 2021 + SE DJPL No. 4 / 2022' },
            { label: 'Fungsi Utama', value: 'Inspeksi independen & data statistik nasional' },
            { label: 'Pelaporan Resmi', value: 'Penyelenggara Pelabuhan & Gubernur' },
            { label: 'Mitra Teknologi', value: 'Platform YADRI oleh DUMEG' },
        ],
        note: 'Pasal 2 & 37 PM 59/2021 menetapkan Tally Mandiri sebagai layanan independen wajib yang mencakup jasa menghitung, mengukur, menimbang, dan membuat catatan muatan demi kepentingan pemilik muatan atau pengangkut.',
        accent: '#d8a35a',
    },
    {
        slug: 'gpei',
        name: 'GPEI',
        client: 'Ekspor Indonesia',
        category: 'Asosiasi',
        logo: '/images/asosiasi/logo_asosiasi/gpei_logo.png',
        cover: '/images/asosiasi/cover/GPEI_COVER.png',
        gallery: ['/images/asosiasi/cover/GPEI_COVER.png', s('gpei'), s('muara'), s('narahubung')],
        fullName: 'Gabungan Perusahaan Ekspor Indonesia',
        system: 'Portal ExportLane & Direktori Eksportir Terpadu',
        tagline: 'Mesin penggerak ekspor Indonesia dan fasilitasi pasar global sejak 1961.',
        description:
            'GPEI adalah asosiasi eksportir tertua dan terbesar di Indonesia dengan lebih dari 2.500 anggota aktif tersebar di 14 DPD provinsi. Membantu UMKM dan korporasi ekspor menembus pasar internasional melalui digitalisasi dokumen dan fasilitasi perjanjian dagang bebas.',
        scope: '14 DPD Provinsi: Pasar Ekspor Global',
        facts: [
            { label: 'Total Anggota', value: '2.500+ Eksportir Terverifikasi' },
            { label: 'Jaringan Wilayah', value: '14 DPD Provinsi' },
            { label: 'Program Unggulan', value: 'ExportLane, IEU-CEPA & ICA-CEPA' },
            { label: 'Sistem Terintegrasi', value: 'Portal Direktori & Verifikasi Anggota' },
        ],
        accent: '#5a8ed8',
    },
    {
        slug: 'atti',
        name: 'ATTI',
        client: 'Terminal Khusus',
        category: 'Asosiasi',
        logo: '/images/asosiasi/logo_asosiasi/atti_logo.png',
        cover: '/images/asosiasi/cover/ATTI_COVER.png',
        gallery: ['/images/asosiasi/cover/ATTI_COVER.png', s('atti'), s('docr'), s('vet')],
        fullName: 'Asosiasi TUKS dan TERSUS Indonesia',
        system: 'Sistem Standarisasi & Pelayanan Terminal Khusus Korporasi',
        tagline: 'Wadah resmi pengelola terminal khusus industri migas, tambang, dan manufaktur.',
        description:
            'ATTI adalah rumah bagi perusahaan pengelola Terminal Khusus (TUKS) dan Terminal Untuk Kepentingan Sendiri (TERSUS). Mengintegrasikan standarisasi operasional, sertifikasi pelatihan kru terminal, serta kepatuhan regulasi Kemenhub dan Pelindo.',
        scope: 'Seluruh Terminal Khusus & TERSUS Indonesia',
        facts: [
            { label: 'Tipe Terminal', value: 'TUKS (luar pelabuhan) & TERSUS (dalam pelabuhan)' },
            { label: 'Mitra Regulator', value: 'Kemenhub RI & PT Pelindo' },
            { label: 'Layanan Anggota', value: 'Sertifikasi pelatihan & advokasi operasional' },
            { label: 'Infrastruktur IT', value: 'Portal Digital ATTI by DUMEG' },
        ],
        accent: '#8c7ad8',
    },
    {
        slug: 'depalindo',
        name: 'DEPALINDO',
        client: 'Pengguna Logistik',
        category: 'Asosiasi',
        logo: '/images/asosiasi/logo_asosiasi/depalindo_logo.png',
        cover: '/images/asosiasi/cover/DEPALINDO_COVER.png',
        gallery: ['/images/asosiasi/cover/DEPALINDO_COVER.png', s('depalindo'), s('titecash'), s('semakmur')],
        fullName: 'Dewan Pengguna Angkutan & Logistik Indonesia',
        system: 'Platform Advokasi Tarif & Integrasi Pemilik Kargo',
        tagline: 'Pelindung hak dan kepentingan pemilik kargo dari biaya logistik tidak proporsional.',
        description:
            'Diakui pemerintah sejak 1975 dan didirikan oleh entitas strategis nasional seperti BULOG dan GAPKINDO. DEPALINDO (INSC) aktif memperjuangkan transparansi tarif freight, demurrage, serta integrasi ekosistem logistik multimoda nasional.',
        scope: 'Nasional: Semua Moda Angkutan Darat & Laut',
        facts: [
            { label: 'Didirikan Sejak', value: 'Tahun 1975 (Diakui Pemerintah)' },
            { label: 'Inisiator Awal', value: 'BULOG, GAPKINDO, dkk.' },
            { label: 'Fokus Utama', value: 'Advokasi tarif kargo & analisis pasar' },
            { label: 'Jaringan Bisnis', value: 'Aliansi Pengguna Logistik Global' },
        ],
        accent: '#c86fb8',
    },
    {
        slug: 'apbmi-kaltim',
        name: 'APBMI Kaltim',
        client: 'Bongkar Muat',
        category: 'Asosiasi',
        logo: '/images/asosiasi/logo_asosiasi/apbmi_logo.webp',
        cover: '/images/asosiasi/cover/APBMI_COVER.png',
        gallery: ['/images/asosiasi/cover/APBMI_COVER.png', s('apbmi'), s('lpksm'), s('ratih')],
        fullName: 'APBMI Kaltim & LPKSM',
        system: 'Sistem E-PBM & Pengawasan Bongkar Muat Borneo',
        tagline: 'Koordinasi stevedoring dan perlindungan konsumen maritim Kalimantan Timur.',
        description:
            'APBMI Kaltim mengkoordinasi kegiatan stevedoring bongkar muat barang khusus di wilayah pelabuhan strategis Kalimantan Timur (batu bara, CPO, dan kargo tambang). Memastikan efisiensi rantai pasok maritim dan kepatuhan standar keselamatan kerja pelabuhan.',
        scope: 'Wilayah Kerja Seluruh Pelabuhan Kalimantan Timur',
        facts: [
            { label: 'Cakupan Wilayah', value: 'Pelabuhan Utama Kalimantan Timur' },
            { label: 'Komoditas Unggulan', value: 'Batu bara, CPO, hasil tambang & agro' },
            { label: 'Sistem Terapan', value: 'E-PBM Digital & Integrasi YADRI' },
            { label: 'Layanan Pendukung', value: 'LPKSM Pengawasan Konsumen Ritel' },
        ],
        accent: '#3fb88c',
    },
    {
        slug: 'ekosistem-internal',
        name: 'Ekosistem',
        client: 'DUMEG',
        category: 'Aplikasi Pendukung',
        cover: s('karsa'),
        gallery: [s('karsa'), s('hubdmg'), s('hello-dumeg'), s('narahubung'), s('fay-ai'), s('d-pos-lilo')],
        fullName: 'Aplikasi Pendukung DUMEG',
        system: 'HR, Utilitas, Finance & Bisnis',
        tagline: 'HR, Utilitas, Finance, dan Bisnis: empat belas aplikasi, satu data.',
        description:
            'Rangkaian aplikasi yang kami bangun untuk divisi HR (KARSA, HUBDMG, Hello Dumeg), Utilitas (Narahubung CRM, DIITTOO, Ratih, DOCR, Fay AI), Finance (Titecash), dan Bisnis (VET, Semakmur, D-LSP, D-POS / LILO Resto, LSP Tami).',
        scope: 'HR, Utilitas, Finance & Bisnis',
        facts: [
            { label: 'HR', value: 'KARSA, HUBDMG, Hello Dumeg' },
            { label: 'Utilitas', value: 'Narahubung (CRM), DIITTOO, Ratih, DOCR, Fay AI' },
            { label: 'Finance', value: 'Titecash' },
            { label: 'Bisnis', value: 'VET, Semakmur, D-LSP, D-POS / LILO Resto, LSP Tami' },
        ],
        accent: '#d86a5a',
    },
];

// ------------------------------------------------------------------ clients page
export interface ClientEntry {
    name: string;
    group: string;
    title: string;
    text: string;
    image: string;
    logo?: string;
    href?: string;
}

export const CLIENTS: ClientEntry[] = [
    ...PROJECTS.filter((p) => p.category === 'Asosiasi').map((p) => ({
        name: p.name,
        group: p.fullName,
        title: p.system,
        text: p.description,
        image: p.gallery[1],
        logo: p.logo,
        href: `/work/${p.slug}`,
    })),
    { name: 'LPKSM', group: 'Layanan Publik', title: 'Pengawasan & Perlindungan Konsumen', text: 'Sistem pengawasan dan perlindungan konsumen yang mendampingi APBMI Kaltim di wilayah kerja Kalimantan Timur.', image: s('lpksm') },
    { name: 'MUARA', group: 'Data Center', title: 'Data Center', text: 'Bagian dari layanan data center DUMEG bersama PORTA dan SURVLUS.', image: s('muara') },
    { name: 'PORTA', group: 'Data Center', title: 'Data Center', text: 'Bagian dari layanan data center DUMEG bersama MUARA dan SURVLUS.', image: s('porta') },
    { name: 'SURVLUS', group: 'Data Center', title: 'Data Center', text: 'Bagian dari layanan data center DUMEG bersama MUARA dan PORTA.', image: s('survlus') },
];

// ------------------------------------------------------------------ home: trusted by + reach
export const TRUSTED = {
    label: 'Dipercaya oleh',
    text: 'Dari asosiasi nasional, data center, sampai layanan publik, kami membangun sistem yang membuat operasional lebih rapi, akurat, dan transparan.',
    // only the entities in the official DUMEG ecosystem: associations, data center, public service
    logos: [
        { name: 'APTMI', src: '/images/asosiasi/logo_asosiasi/aptmi_logo.png' },
        { name: 'GPEI', src: '/images/asosiasi/logo_asosiasi/gpei_logo.png' },
        { name: 'ATTI', src: '/images/asosiasi/logo_asosiasi/atti_logo.png' },
        { name: 'DEPALINDO', src: '/images/asosiasi/logo_asosiasi/depalindo_logo.png' },
        { name: 'APBMI Kaltim', src: '/images/asosiasi/logo_asosiasi/apbmi_logo.webp' },
        { name: 'MUARA' },
        { name: 'PORTA' },
        { name: 'SURVLUS' },
        { name: 'LPKSM' },
    ] as { name: string; src?: string }[],
};

export const REACH = {
    from: { label: 'Dari', place: 'Sabang', coords: '(5.8946, 95.3214)' },
    to: { label: 'Ke', place: 'Merauke', coords: '(-8.4932, 140.3855)' },
    note: '14+ wilayah operasi',
};

// ------------------------------------------------------------------ services (disciplines)
export interface Service {
    id: string;
    number: number;
    category: string;
    title: string;
    color: string;
    rows: [string, string][];
    about: string;
    images: string[];
    /** optional illustration hung from the header rule, next to the numeral */
    hanging?: string;
    /** optional illustration that drives across the numeral column */
    driving?: string;
    /** optional still illustration set beside the numeral */
    scene?: string;
}

export const SERVICES: Service[] = [
    // the official DUMEG ecosystem: End to End Logistik (Angkutan + Simpul), Aplikasi Pendukung, Media Center
    {
        id: 'angkutan',
        number: 1,
        category: 'End to End Logistik',
        title: 'Angkutan',
        color: '#2dff4a',
        rows: [
            ['Darat', 'Truk, Mobil Box, Kereta Api'],
            ['Laut', 'Kapal Peti Kemas, Curah, Tanker, Kargo Umum, RO-RO, Tongkang & Tugboat, LCT'],
            ['Udara', 'Pesawat Penumpang Komersial, Kargo, Helikopter, Charter, Khusus'],
            ['Pelacakan', 'Y-Track, GPS Tracking, Sensor Load Cell'],
        ],
        about: 'Semua moda angkutan dalam satu alur: darat, laut, dan udara. Armada darat dipantau lewat Y-Track, GPS Tracking, dan Sensor Load Cell, sehingga posisi dan muatan selalu terlihat dari keberangkatan sampai tujuan.',
        images: ['/images/asosiasi/cover/ATTI_COVER.png', s('semakmur'), s('porta'), s('muara'), s('survlus')],
        driving: '/images/site/truck-driving.png',
    },
    {
        id: 'simpul',
        number: 2,
        category: 'End to End Logistik',
        title: 'Simpul',
        color: '#ff6bd6',
        rows: [
            ['Gudang', 'Bahan Baku, Pendingin, Fulfillment Center, Pusat Distribusi/DC, Cross-Docking, Gudang Berikat'],
            ['Konvensional & Peti Kemas', 'Y-Terminal'],
            ['Ship to Ship', 'Libat Transhipment, Y-RKBM, E-PBM, Y-TALLY / YADRI, Y-TALLY Mobile, Y-Monitor'],
            ['TUKS / TERSUS', 'Mine Logistic, Y-PBM Jetty, Y-Track, GPS Tracking, Sensor Load Cell'],
            ['Dry Port', 'Pelabuhan darat'],
        ],
        about: 'Titik temu barang: gudang dan pelabuhan. Dari Y-Terminal untuk pelabuhan konvensional dan peti kemas, Y-TALLY / YADRI dan E-PBM untuk ship to ship, sampai Mine Logistic dan Y-PBM Jetty untuk TUKS dan TERSUS.',
        images: ['/images/asosiasi/cover/APTMI_COVER.png', s('aptmi'), '/images/asosiasi/cover/APBMI_COVER.png', s('apbmi'), s('docr')],
        hanging: '/images/site/container-hanging.png',
    },
    {
        id: 'aplikasi-pendukung',
        number: 3,
        category: 'Aplikasi Pendukung',
        title: 'Aplikasi Pendukung',
        color: '#ff1458',
        rows: [
            ['HR', 'KARSA, HUBDMG, Hello Dumeg'],
            ['Utilitas', 'Narahubung (CRM), DIITTOO, Ratih, DOCR, Fay AI'],
            ['Finance', 'Titecash'],
            ['Bisnis', 'VET, Semakmur, D-LSP, D-POS / LILO Resto, LSP Tami'],
        ],
        about: 'Aplikasi yang menopang operasional sehari-hari: HR, utilitas, keuangan, dan bisnis. Semuanya berbagi data yang sama, jadi satu input cukup untuk banyak proses.',
        images: [s('karsa'), s('hubdmg'), s('narahubung'), s('titecash'), s('vet')],
        scene: '/images/site/people-working.png',
    },
    {
        id: 'media-center',
        number: 4,
        category: 'Media Center',
        title: 'Media Center',
        color: '#b8ff1f',
        rows: [
            ['Asosiasi', 'GPEI, DEPALINDO, APBMI Kaltim, APTMI, ATTI'],
            ['Data Center', 'MUARA, PORTA, SURVLUS'],
            ['Layanan Publik', 'LPKSM'],
        ],
        about: 'Portal dan pusat data untuk asosiasi, data center, dan layanan publik di sektor maritim dan logistik: tempat informasi anggota, regulasi, dan pelaporan dikelola dalam satu ekosistem.',
        images: ['/images/asosiasi/cover/GPEI_COVER.png', '/images/asosiasi/cover/DEPALINDO_COVER.png', s('muara'), s('survlus'), s('lpksm')],
    },
];

// ------------------------------------------------------------------ work index: every system, grouped by the four services
export interface WorkItem {
    name: string;
    /** SERVICES id */
    service: string;
    /** sub-group from the official structure (HR, Ship to Ship, Asosiasi, ...): searchable, not shown */
    group: string;
    /** one plain sentence anyone can follow (no jargon) */
    desc: string;
    /** case study / clients page when there is one; otherwise the card leads to the contact form */
    href?: string;
    /** extra search words: what people would type for this need */
    tags?: string[];
    /** official logo (public/images/logos), shown 48px tall */
    logo?: string;
    /** letter monogram in the product colour, for apps whose logo is a plain letter tile */
    mark?: { letter: string; color: string };
    /** line icon for systems without a logo yet */
    icon?: WorkIcon;
}

export type WorkIcon = 'truck' | 'pin' | 'scale' | 'crane' | 'clipboard' | 'phone' | 'boxes' | 'calendar' | 'monitor' | 'transfer' | 'mine' | 'anchor';

const APPS = '/work/ekosistem-internal';
const logo = (slug: string) => `/images/logos/${slug}.png`;

export const WORKS: WorkItem[] = [
    // Angkutan
    { name: 'Y-Track', service: 'angkutan', group: 'Pelacakan', desc: 'Lacak posisi truk dan armada langsung di peta.', tags: ['truk', 'lacak', 'armada'], logo: logo('y-track') },
    { name: 'GPS Tracking', service: 'angkutan', group: 'Pelacakan', desc: 'Lihat lokasi kendaraan setiap saat, dari mana saja.', tags: ['lokasi', 'kendaraan'], icon: 'pin' },
    { name: 'Sensor Load Cell', service: 'angkutan', group: 'Pelacakan', desc: 'Timbang berat muatan truk secara otomatis.', tags: ['timbang', 'berat', 'muatan'], icon: 'scale' },
    // Simpul
    { name: 'Y-Terminal', service: 'simpul', group: 'Konvensional & Peti Kemas', desc: 'Atur kegiatan harian di terminal pelabuhan.', tags: ['pelabuhan', 'peti kemas', 'kontainer'], logo: logo('y-terminal') },
    { name: 'Y-TALLY / YADRI', service: 'simpul', group: 'Ship to Ship', desc: 'Catat jumlah muatan kapal dengan rapi dalam satu alur data.', href: '/work/aptmi', tags: ['tally', 'kapal', 'muatan', 'aptmi'], logo: logo('yadri') },
    { name: 'Y-TALLY Mobile', service: 'simpul', group: 'Ship to Ship', desc: 'Catat muatan kapal langsung dari ponsel.', tags: ['tally', 'hp', 'ponsel'], icon: 'phone' },
    { name: 'E-PBM', service: 'simpul', group: 'Ship to Ship', desc: 'Kelola pekerjaan bongkar muat barang di pelabuhan.', href: '/work/apbmi-kaltim', tags: ['bongkar muat'], logo: logo('e-pbm') },
    { name: 'Y-RKBM', service: 'simpul', group: 'Ship to Ship', desc: 'Susun rencana bongkar muat sebelum kapal datang.', tags: ['rencana', 'bongkar muat'], icon: 'calendar' },
    { name: 'Y-Monitor', service: 'simpul', group: 'Ship to Ship', desc: 'Pantau kegiatan bongkar muat saat itu juga.', tags: ['pantau', 'monitoring'], icon: 'monitor' },
    { name: 'Libat Transhipment', service: 'simpul', group: 'Ship to Ship', desc: 'Atur pemindahan muatan dari satu kapal ke kapal lain.', tags: ['pindah muatan', 'kapal'], logo: logo('libat-bat') },
    { name: 'Mine Logistic', service: 'simpul', group: 'TUKS / TERSUS', desc: 'Atur pengiriman hasil tambang dari lokasi sampai dermaga.', tags: ['tambang', 'batubara'], icon: 'mine' },
    { name: 'Y-PBM Jetty', service: 'simpul', group: 'TUKS / TERSUS', desc: 'Kelola bongkar muat di dermaga milik perusahaan.', tags: ['jetty', 'dermaga'], icon: 'anchor' },
    // Aplikasi Pendukung
    { name: 'KARSA', service: 'aplikasi-pendukung', group: 'HR', desc: 'Absensi, cuti, dan gaji karyawan dalam satu aplikasi.', href: APPS, tags: ['absen', 'absensi', 'cuti', 'gaji', 'karyawan', 'hris'], logo: logo('karsa') },
    { name: 'HUBDMG', service: 'aplikasi-pendukung', group: 'HR', desc: 'Catat kas, transaksi, dan tim keuangan di satu tempat.', href: APPS, tags: ['kas', 'transaksi'], logo: logo('hubdmg') },
    { name: 'Hello Dumeg', service: 'aplikasi-pendukung', group: 'HR', desc: 'Ngobrol dan berbagi tugas dengan rekan kerja.', href: APPS, tags: ['chat', 'obrolan', 'tim'], logo: logo('hello-dumeg') },
    { name: 'Narahubung', service: 'aplikasi-pendukung', group: 'Utilitas', desc: 'Balas pesan WhatsApp pelanggan dari satu kotak masuk.', href: APPS, tags: ['crm', 'whatsapp', 'pelanggan'], logo: logo('narahubung') },
    { name: 'DIITTOO', service: 'aplikasi-pendukung', group: 'Utilitas', desc: 'Tanda tangan dokumen secara digital, tanpa dicetak.', href: APPS, tags: ['tanda tangan', 'e-sign', 'ttd'], logo: logo('diittoo') },
    { name: 'Ratih', service: 'aplikasi-pendukung', group: 'Utilitas', desc: 'Simpan dan bagikan file penting dengan aman.', href: APPS, tags: ['file', 'penyimpanan', 'cloud'], logo: logo('ratih') },
    { name: 'DOCR', service: 'aplikasi-pendukung', group: 'Utilitas', desc: 'Ubah foto dokumen menjadi data yang rapi dan siap pakai.', href: APPS, tags: ['ocr', 'scan', 'dokumen', 'ktp'], logo: logo('docr') },
    { name: 'Fay AI', service: 'aplikasi-pendukung', group: 'Utilitas', desc: 'Asisten pintar untuk bertanya dan merangkum dokumen.', href: APPS, tags: ['ai', 'asisten', 'chatbot'], logo: logo('fay-ai') },
    { name: 'Titecash', service: 'aplikasi-pendukung', group: 'Finance', desc: 'Pembukuan dan keuangan usaha yang mudah dibaca.', href: APPS, tags: ['akuntansi', 'pembukuan', 'keuangan'], logo: logo('titecash') },
    { name: 'VET', service: 'aplikasi-pendukung', group: 'Bisnis', desc: 'Layanan perawatan untuk hewan peliharaan.', href: APPS, tags: ['hewan', 'klinik', 'dokter hewan'], logo: logo('vet') },
    { name: 'Semakmur', service: 'aplikasi-pendukung', group: 'Bisnis', desc: 'Pasar online untuk produk ekspor UMKM Indonesia.', href: APPS, tags: ['ekspor', 'umkm', 'jualan'], logo: logo('semakmur') },
    { name: 'D-LSP', service: 'aplikasi-pendukung', group: 'Bisnis', desc: 'Ujian dan sertifikasi keahlian kerja secara daring.', href: APPS, tags: ['sertifikasi', 'lsp'], logo: logo('d-lsp') },
    { name: 'D-POS / LILO Resto', service: 'aplikasi-pendukung', group: 'Bisnis', desc: 'Mesin kasir untuk restoran dan kafe.', href: APPS, tags: ['kasir', 'pos', 'restoran'], logo: logo('lilo-resto') },
    { name: 'LSP Tami', service: 'aplikasi-pendukung', group: 'Bisnis', desc: 'Website lembaga sertifikasi profesi.', href: APPS, tags: ['sertifikasi', 'lsp'], logo: logo('lsp-tami') },
    // Media Center
    { name: 'GPEI', service: 'media-center', group: 'Asosiasi', desc: 'Website Gabungan Perusahaan Ekspor Indonesia.', href: '/work/gpei', tags: ['asosiasi', 'ekspor'], logo: logo('gpei') },
    { name: 'DEPALINDO', service: 'media-center', group: 'Asosiasi', desc: 'Website Dewan Pengguna Angkutan & Logistik Indonesia.', href: '/work/depalindo', tags: ['asosiasi'], logo: logo('depalindo') },
    { name: 'APBMI Kaltim', service: 'media-center', group: 'Asosiasi', desc: 'Website asosiasi bongkar muat di Kalimantan Timur.', href: '/work/apbmi-kaltim', tags: ['asosiasi', 'bongkar muat'], logo: logo('apbmi-kaltim') },
    { name: 'APTMI', service: 'media-center', group: 'Asosiasi', desc: 'Website Asosiasi Perusahaan Tally Mandiri Indonesia.', href: '/work/aptmi', tags: ['asosiasi', 'tally'], logo: logo('aptmi') },
    { name: 'ATTI', service: 'media-center', group: 'Asosiasi', desc: 'Website Asosiasi TUKS dan TERSUS Indonesia.', href: '/work/atti', tags: ['asosiasi', 'tuks', 'tersus'], logo: logo('atti') },
    { name: 'MUARA', service: 'media-center', group: 'Data Center', desc: 'Pusat data yang mengumpulkan laporan pelabuhan dan kargo.', href: '/clients', tags: ['data'], logo: logo('muara') },
    { name: 'PORTA', service: 'media-center', group: 'Data Center', desc: 'Pusat data kunjungan kapal dan dermaga.', href: '/clients', tags: ['data', 'kapal', 'dermaga'], mark: { letter: 'P', color: '#09796d' } },
    { name: 'SURVLUS', service: 'media-center', group: 'Data Center', desc: 'Pusat data survei dan petugas lapangan.', href: '/clients', tags: ['data', 'survei'], logo: logo('survlus') },
    { name: 'LPKSM', service: 'media-center', group: 'Layanan Publik', desc: 'Layanan pengaduan dan perlindungan konsumen.', href: '/clients', tags: ['pengaduan', 'konsumen'], logo: logo('lpksm') },
];

// ------------------------------------------------------------------ ecosystem launcher: every live DUMEG app and website, opened directly
export interface EcoItem {
    name: string;
    /** 'aplikasi' needs an account to sign in; 'website' is open to anyone */
    kind: 'aplikasi' | 'website';
    /** a few plain words on what it is */
    label: string;
    url: string;
    logo?: string;
    mark?: { letter: string; color: string };
    icon?: WorkIcon;
    tags?: string[];
}

export const ECOSYSTEM: EcoItem[] = [
    // websites
    { name: 'Profil DUMEG', kind: 'website', label: 'Website profil perusahaan', url: 'https://profile.dumeg.id/', logo: logo('dumeg'), tags: ['profile', 'company'] },
    { name: 'YADRI', kind: 'website', label: 'Tally & operasi kargo', url: 'https://yadri.id/', logo: logo('yadri'), tags: ['tally'] },
    { name: 'APTMI', kind: 'website', label: 'Asosiasi tally mandiri', url: 'https://aptmi.id/', logo: logo('aptmi'), tags: ['asosiasi'] },
    { name: 'ATTI', kind: 'website', label: 'Asosiasi TUKS & TERSUS', url: 'https://tukstersus.com/', logo: logo('atti'), tags: ['asosiasi'] },
    { name: 'GPEI', kind: 'website', label: 'Asosiasi eksportir Indonesia', url: 'https://gpei.id/', logo: logo('gpei'), tags: ['asosiasi', 'ekspor'] },
    { name: 'DEPALINDO', kind: 'website', label: 'Dewan pengguna angkutan & logistik', url: 'https://depalindo.com/', logo: logo('depalindo'), tags: ['asosiasi'] },
    { name: 'APBMI Kaltim', kind: 'website', label: 'Asosiasi bongkar muat Kaltim', url: 'https://apbmikaltim.com/', logo: logo('apbmi-kaltim'), tags: ['asosiasi', 'bongkar muat'] },
    { name: 'LSP Tami', kind: 'website', label: 'Lembaga sertifikasi profesi', url: 'https://lsptami.id/', logo: logo('lsp-tami'), tags: ['sertifikasi'] },
    { name: 'MUARA', kind: 'website', label: 'Pusat data pelabuhan & kargo', url: 'https://muara.id/', logo: logo('muara'), tags: ['data center'] },
    { name: 'SURVLUS', kind: 'website', label: 'Data & survei lapangan', url: 'https://survlus.com/', logo: logo('survlus'), tags: ['data center', 'survei'] },
    { name: 'LPKSM', kind: 'website', label: 'Pengaduan & perlindungan konsumen', url: 'https://lpksm.dumeg.com/', logo: logo('lpksm'), tags: ['pengaduan'] },
    { name: 'Semakmur', kind: 'website', label: 'Pasar online ekspor UMKM', url: 'https://semakmur.com/', logo: logo('semakmur'), tags: ['e-commerce', 'ekspor'] },
    { name: 'VET', kind: 'website', label: 'Klinik hewan di Samarinda', url: 'https://vet.co.id/', logo: logo('vet'), tags: ['hewan'] },
    // applications
    { name: 'E-Tally', kind: 'aplikasi', label: 'Pencatatan tally digital', url: 'https://yadri.dumeg.id/', logo: logo('yadri'), tags: ['tally', 'yadri'] },
    { name: 'E-PBM', kind: 'aplikasi', label: 'Sistem bongkar muat pelabuhan', url: 'https://e-pbm.dumeg.id/', logo: logo('e-pbm'), tags: ['stevedore', 'bongkar muat'] },
    { name: 'E-RKBM', kind: 'aplikasi', label: 'Rencana bongkar muat kapal', url: 'https://e-rkbm.yadri.co.id/', icon: 'calendar', tags: ['rkbm', 'rencana'] },
    { name: 'Monitoring', kind: 'aplikasi', label: 'Pantau kegiatan secara langsung', url: 'https://monitoring.dumeg.id/', icon: 'monitor', tags: ['realtime', 'pantau'] },
    { name: 'Terminal', kind: 'aplikasi', label: 'Sistem terminal pelabuhan', url: 'https://terminal.dumeg.com/', logo: logo('y-terminal'), tags: ['y-terminal', 'pelabuhan'] },
    { name: 'Y-Track', kind: 'aplikasi', label: 'Lacak armada dengan GPS', url: 'https://ytrack.dumeg.com/', logo: logo('y-track'), tags: ['gps', 'truk', 'lacak'] },
    { name: 'Y-AIS', kind: 'aplikasi', label: 'Peta posisi kapal langsung', url: 'https://y-ais.dumeg.com/', logo: logo('y-ais'), tags: ['kapal', 'ais', 'peta'] },
    { name: 'Palka', kind: 'aplikasi', label: 'Ruang muat kapal digital', url: 'https://palka.dumeg.com/', logo: logo('palka'), tags: ['kapal', 'kargo'] },
    { name: 'Libat Transhipment', kind: 'aplikasi', label: 'Pindah muatan kapal ke kapal', url: 'https://libat.dumeg.com/', logo: logo('libat-bat'), tags: ['transhipment', 'bat'] },
    { name: 'KARSA', kind: 'aplikasi', label: 'Absensi, cuti & gaji karyawan', url: 'https://karsa.dumeg.com/', logo: logo('karsa'), tags: ['absen', 'hris', 'gaji'] },
    { name: 'HUBDMG', kind: 'aplikasi', label: 'Kas & transaksi keuangan', url: 'https://hub.dumeg.com/', logo: logo('hubdmg'), tags: ['keuangan', 'kas'] },
    { name: 'Hello Dumeg', kind: 'aplikasi', label: 'Obrolan & tugas tim', url: 'https://hello.dumeg.com/', logo: logo('hello-dumeg'), tags: ['chat'] },
    { name: 'Diittoo', kind: 'aplikasi', label: 'Tanda tangan digital (e-Sign)', url: 'https://diittoo.dumeg.com/', logo: logo('diittoo'), tags: ['e-sign', 'esign', 'tanda tangan'] },
    { name: 'Ratih', kind: 'aplikasi', label: 'Simpan & bagikan file', url: 'https://ratih.co.id/', logo: logo('ratih'), tags: ['cloud', 'file'] },
    { name: 'Dumeg OCR', kind: 'aplikasi', label: 'Ubah dokumen jadi data', url: 'https://ocr.dumeg.com/', logo: logo('docr'), tags: ['ocr', 'scan', 'docr'] },
    { name: 'Fay AI', kind: 'aplikasi', label: 'Asisten pintar (AI)', url: 'https://fay.dumeg.com/', logo: logo('fay-ai'), tags: ['ai', 'asisten'] },
    { name: 'Titecash', kind: 'aplikasi', label: 'Pembukuan & keuangan usaha', url: 'https://titecash.com/', logo: logo('titecash'), tags: ['akuntansi'] },
    { name: 'D-LSP', kind: 'aplikasi', label: 'Sertifikasi kompetensi daring', url: 'https://lsp.dumeg.com/', logo: logo('d-lsp'), tags: ['sertifikasi', 'lsp'] },
    { name: 'LILO Resto', kind: 'aplikasi', label: 'Kasir restoran & kafe', url: 'https://pos.dumeg.com/', logo: logo('lilo-resto'), tags: ['kasir', 'pos', 'd-pos'] },
];

// ------------------------------------------------------------------ home: statement, contact, imagery
export const STATEMENT = {
    // "Satu input, satu data, banyak proses tanpa hambatan" in the reference's mixed-type layout
    lines: [
        { big: 'SATU INPUT', serif: 'SATU DATA', script: 'satu sumber' },
        { serifBefore: 'lalu', big: 'BANYAK' },
        { big: 'PROSES', serif: 'tanpa hambatan' },
    ],
};

export const CONTACT_BLOCK = { label: 'Kontak', word: 'MULAI', cta: 'Hubungi Kami' };

export const IMAGERY = {
    label: 'Galeri',
    text: 'Kami membantu pelabuhan, asosiasi, dan perusahaan logistik bergerak lebih cepat lewat sistem yang membuat setiap muatan tercatat, terlacak, dan terlaporkan.',
    images: [
        '/images/asosiasi/cover/GPEI_COVER.png', s('karsa'), '/images/model/model_1.jpg', s('titecash'), '/images/asosiasi/cover/ATTI_COVER.png',
        s('fay-ai'), '/images/model/model_2.jpg', s('narahubung'), '/images/asosiasi/cover/DEPALINDO_COVER.png', s('semakmur'),
        '/images/model/model_3.jpg', s('hello-dumeg'),
    ],
};

// ------------------------------------------------------------------ contact page flow
export const CONTACT_FLOW = {
    question: 'Apa yang membawamu ke sini hari ini?',
    choices: [
        { id: 'project', label: 'Mulai proyek' },
        { id: 'message', label: 'Kirim pesan singkat' },
        { id: 'copy', label: 'Salin email kami' },
    ],
    steps: {
        project: [
            { key: 'name', q: 'Siapa yang ada di balik ide ini?', placeholder: 'Nama kamu' },
            { key: 'company', q: 'Dari perusahaan atau asosiasi mana?', placeholder: 'Nama perusahaan' },
            { key: 'email', q: 'Ke mana kami membalas?', placeholder: 'Email kamu', type: 'email' },
            { key: 'service', q: 'Layanan apa yang kamu butuhkan?', placeholder: 'Contoh: Y-TALLY / YADRI, Y-Track, Media Center' },
            { key: 'scope', q: 'Ceritakan sedikit tentang operasionalmu.', placeholder: 'Pelabuhan, armada, cabang...' },
            { key: 'timeline', q: 'Kapan kamu ingin mulai?', placeholder: 'Contoh: kuartal depan' },
        ],
        message: [
            { key: 'name', q: 'Siapa namamu?', placeholder: 'Nama kamu' },
            { key: 'email', q: 'Ke mana kami membalas?', placeholder: 'Email kamu', type: 'email' },
            { key: 'message', q: 'Apa yang ingin kamu sampaikan?', placeholder: 'Pesan singkat' },
        ],
    } as Record<string, { key: string; q: string; placeholder: string; type?: string }[]>,
};
