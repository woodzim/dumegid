import type { Metadata, Viewport } from 'next';
import { Ballet, Bodoni_Moda, Instrument_Serif, Sometype_Mono } from 'next/font/google';
import SmoothScroll from './components/site/SmoothScroll';
import SiteHeader from './components/site/SiteHeader';
import './globals.css';

// script (Ballet), editorial serif, display serif and mono stand-ins for the reference's type
const ballet = Ballet({ subsets: ['latin'], variable: '--font-ballet', display: 'swap' });
const instrument = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni', display: 'swap' });
const sometype = Sometype_Mono({ subsets: ['latin'], variable: '--font-sometype', display: 'swap' });

const title = 'DUMEG: Solusi Digital Maritim, Pelabuhan & Logistik';
const description =
    'PT Duta Meta Graha (DUMEG) membangun ekosistem digital terpadu untuk operasional maritim, pelabuhan, dan logistik di Indonesia. Satu input, satu data, banyak proses tanpa hambatan.';

export const metadata: Metadata = {
    metadataBase: new URL('https://dumeg.id'),
    title: { default: title, template: '%s · DUMEG' },
    description,
    keywords: ['maritim', 'logistik', 'pelabuhan', 'digitalisasi', 'DUMEG', 'tally digital', 'YADRI', 'APTMI'],
    openGraph: { title, description, type: 'website', locale: 'id_ID', siteName: 'DUMEG' },
    twitter: { card: 'summary_large_image', title, description },
};

export const viewport: Viewport = { themeColor: '#f5f5f5' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="id" className={`${ballet.variable} ${instrument.variable} ${bodoni.variable} ${sometype.variable}`}>
            <body>
                <SmoothScroll />
                <SiteHeader />
                {children}
            </body>
        </html>
    );
}
