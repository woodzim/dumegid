import type { Metadata } from 'next';
import { Suspense } from 'react';
import EcosystemIndex from './components/site/ecosystem/EcosystemIndex';
import SiteFooter from './components/site/SiteFooter';
import TitleDesc from './components/site/TitleDesc';
import { ECOSYSTEM } from './components/site/data/content';

export const metadata: Metadata = {
    description: 'Ekosistem DUMEG: semua aplikasi dan website DUMEG dalam satu halaman. Cari, lalu klik untuk langsung membuka.',
};

/** Home: the ecosystem launcher (every live DUMEG app and website). The company story lives at /tentang. */
export default function Home() {
    const apps = ECOSYSTEM.filter((e) => e.kind === 'aplikasi').length;
    return (
        <>
            <main className="relative z-10 w-full pb-32 pt-40 md:pb-48 md:pt-52">
                <h1 className="sr-only">Ekosistem DUMEG</h1>
                <div className="px-[var(--gutter)]">
                    <div className="flex w-full justify-between text-[16px] leading-6 tracking-tight text-ink">
                        <span>Ekosistem</span>
                        <span className="tracking-[-0.08em]">
                            {apps} aplikasi · {ECOSYSTEM.length - apps} website
                        </span>
                    </div>
                    <div className="mt-2 h-px w-full bg-rule" />
                    <h2 className="mt-10 font-script text-[5rem] leading-[0.9] text-ink md:mt-14 md:text-[11rem]">Ekosistem</h2>
                    <TitleDesc
                        label="Dashboard Ekosistem DUMEG"
                        text="Semua aplikasi dan website DUMEG dalam satu halaman. Cari yang Anda butuhkan, lalu klik untuk langsung membukanya."
                        className="mb-12 mt-8 md:mb-16 md:mt-10"
                        textClassName="max-w-[760px]"
                    />
                </div>
                <Suspense
                    fallback={
                        <ul className="px-[var(--gutter)] text-[18px] leading-8 tracking-tight">
                            {ECOSYSTEM.map((e) => (
                                <li key={e.url}>
                                    <a href={e.url}>{e.name}</a>: {e.label}
                                </li>
                            ))}
                        </ul>
                    }
                >
                    <EcosystemIndex />
                </Suspense>
            </main>
            <SiteFooter />
        </>
    );
}
