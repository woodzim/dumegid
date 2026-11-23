import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import WorkIndex from '../components/site/work/WorkIndex';
import SiteFooter from '../components/site/SiteFooter';
import TitleDesc from '../components/site/TitleDesc';
import { WORKS } from '../components/site/data/content';

export const metadata: Metadata = {
    title: 'Karya',
    description: 'Etalase semua aplikasi dan website DUMEG: Angkutan, Simpul, Aplikasi Pendukung, dan Media Center. Cari dengan nama atau kebutuhan.',
};

export default function WorkPage() {
    return (
        <>
            <main className="relative z-10 w-full pb-32 pt-40 md:pb-48 md:pt-52">
                <h1 className="sr-only">Karya DUMEG</h1>
                <div className="px-[var(--gutter)]">
                    <div className="flex w-full justify-between text-[16px] leading-6 tracking-tight text-ink">
                        <span>Karya</span>
                        <span className="tracking-[-0.08em]">{WORKS.length} aplikasi</span>
                    </div>
                    <div className="mt-2 h-px w-full bg-rule" />
                    <h2 className="mt-10 font-script text-[6rem] leading-[0.9] text-ink md:mt-14 md:text-[12rem]">Karya</h2>
                    <TitleDesc
                        label="Etalase Aplikasi DUMEG"
                        text="Semua aplikasi dan website buatan DUMEG ada di sini. Pilih kategori, atau ketik nama aplikasi yang Anda cari."
                        className="mb-12 mt-8 md:mb-16 md:mt-10"
                        textClassName="max-w-[760px]"
                    />
                </div>
                <Suspense
                    fallback={
                        // crawlable list while the interactive index loads
                        <ul className="px-[var(--gutter)] text-[18px] leading-8 tracking-tight">
                            {WORKS.map((w) => (
                                <li key={w.name}>
                                    {w.href ? <Link href={w.href}>{w.name}</Link> : w.name}: {w.desc}
                                </li>
                            ))}
                        </ul>
                    }
                >
                    <WorkIndex />
                </Suspense>
            </main>
            <SiteFooter />
        </>
    );
}
