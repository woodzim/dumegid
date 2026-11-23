import type { Metadata } from 'next';
import LegalPage from '../components/site/LegalPage';
import { SITE } from '../components/site/data/content';

export const metadata: Metadata = { title: 'Kebijakan Privasi' };

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Kebijakan Privasi"
            updated="November 2026"
            sections={[
                {
                    title: 'Data yang kami terima',
                    body: [
                        'Situs ini tidak memiliki backend dan tidak menyimpan data pengunjung di server DUMEG.',
                        'Formulir kontak menyusun email di perangkatmu sendiri. Data baru sampai ke kami saat kamu mengirim email tersebut dari aplikasi emailmu.',
                    ],
                },
                {
                    title: 'Hosting',
                    body: [
                        'Situs ini dihosting di Vercel. Seperti layanan hosting pada umumnya, Vercel dapat mencatat log teknis (misalnya alamat IP dan waktu akses) untuk keamanan dan keandalan layanan, sesuai kebijakan privasi Vercel.',
                    ],
                },
                {
                    title: 'Penggunaan data',
                    body: ['Email yang kamu kirim hanya kami gunakan untuk membalas pertanyaan atau menindaklanjuti kebutuhan proyekmu.'],
                },
                {
                    title: 'Kontak',
                    body: [`Pertanyaan tentang privasi dapat dikirim ke ${SITE.email}.`],
                },
            ]}
        />
    );
}
