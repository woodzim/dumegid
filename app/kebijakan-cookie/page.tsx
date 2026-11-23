import type { Metadata } from 'next';
import LegalPage from '../components/site/LegalPage';
import { SITE } from '../components/site/data/content';

export const metadata: Metadata = { title: 'Kebijakan Cookie' };

export default function CookiePage() {
    return (
        <LegalPage
            title="Kebijakan Cookie"
            updated="November 2026"
            sections={[
                {
                    title: 'Cookie di situs ini',
                    body: ['Situs DUMEG tidak memasang cookie untuk pelacakan, analitik pihak ketiga, maupun iklan.'],
                },
                {
                    title: 'Cache browser',
                    body: ['Browsermu dapat menyimpan cache standar (misalnya font, gambar, dan model 3D) agar halaman lebih cepat dimuat saat kunjungan berikutnya. Cache ini dapat kamu hapus kapan saja dari pengaturan browser.'],
                },
                {
                    title: 'Perubahan',
                    body: ['Jika suatu saat kami menambahkan cookie atau alat analitik, halaman ini akan diperbarui terlebih dahulu.'],
                },
                {
                    title: 'Kontak',
                    body: [`Pertanyaan dapat dikirim ke ${SITE.email}.`],
                },
            ]}
        />
    );
}
