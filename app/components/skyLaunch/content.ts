/**
 * Content of the sky-launch tour.
 *
 * Every product has a screen image at `public/screens/<id>.jpg`. The files that
 * ship with the project are placeholder mockups; drop a real screenshot in with
 * the same file name (any 16:10 or taller full-page capture works; tall
 * captures auto-scroll on the monitor) and it replaces the mockup.
 */

export interface TourProduct {
    id: string;
    name: string;
    subtitle?: string;
    screen: string;
}

export interface Station extends TourProduct {
    group: string;
}

export interface Bay {
    id: string;
    name: string;
    apps: TourProduct[];
}

const screen = (id: string) => `/screens/${id}.jpg`;

/** The nine lights that orbit the vessel, visited left to right. */
export const STATIONS: Station[] = [
    { id: 'gpei', group: 'Asosiasi', name: 'GPEI', subtitle: 'Portal ExportLane & Direktori Eksportir Terpadu', screen: screen('gpei') },
    { id: 'depalindo', group: 'Asosiasi', name: 'DEPALINDO', subtitle: 'Platform Advokasi Tarif & Integrasi Pemilik Kargo', screen: screen('depalindo') },
    { id: 'apbmi', group: 'Asosiasi', name: 'APBMI Kaltim', subtitle: 'Sistem E-PBM & Pengawasan Bongkar Muat Borneo', screen: screen('apbmi') },
    { id: 'aptmi', group: 'Asosiasi', name: 'APTMI', subtitle: 'Platform Digitalisasi YADRI & Tally Mandiri Nasional', screen: screen('aptmi') },
    { id: 'atti', group: 'Asosiasi', name: 'ATTI', subtitle: 'Sistem Standarisasi & Pelayanan Terminal Khusus Korporasi', screen: screen('atti') },
    { id: 'muara', group: 'Data Center', name: 'MUARA', screen: screen('muara') },
    { id: 'porta', group: 'Data Center', name: 'PORTA', screen: screen('porta') },
    { id: 'survlus', group: 'Data Center', name: 'SURVLUS', screen: screen('survlus') },
    { id: 'lpksm', group: 'Layanan Publik', name: 'LPKSM', subtitle: 'Pengawasan & Perlindungan Konsumen', screen: screen('lpksm') },
];

/** The four monitors inside the vessel, shown clockwise from the entry. */
export const BAYS: Bay[] = [
    {
        id: 'hr',
        name: 'HR',
        apps: [
            { id: 'karsa', name: 'KARSA', screen: screen('karsa') },
            { id: 'hubdmg', name: 'HUBDMG', screen: screen('hubdmg') },
            { id: 'hello-dumeg', name: 'Hello Dumeg', screen: screen('hello-dumeg') },
        ],
    },
    {
        id: 'utilitas',
        name: 'Utilitas',
        apps: [
            { id: 'narahubung', name: 'Narahubung (CRM)', screen: screen('narahubung') },
            { id: 'diittoo', name: 'DIITTOO', screen: screen('diittoo') },
            { id: 'ratih', name: 'Ratih', screen: screen('ratih') },
            { id: 'docr', name: 'DOCR', screen: screen('docr') },
            { id: 'fay-ai', name: 'Fay AI', screen: screen('fay-ai') },
        ],
    },
    {
        id: 'finance',
        name: 'Finance',
        apps: [{ id: 'titecash', name: 'Titecash', screen: screen('titecash') }],
    },
    {
        id: 'bisnis',
        name: 'Bisnis',
        apps: [
            { id: 'vet', name: 'VET', screen: screen('vet') },
            { id: 'semakmur', name: 'Semakmur', screen: screen('semakmur') },
            { id: 'd-lsp', name: 'D-LSP', screen: screen('d-lsp') },
            { id: 'd-pos-lilo', name: 'D-POS / LILO Resto', screen: screen('d-pos-lilo') },
            { id: 'lsp-tami', name: 'LSP Tami', screen: screen('lsp-tami') },
        ],
    },
];
