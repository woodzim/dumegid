import type { Metadata } from 'next';
import Link from 'next/link';
import { CLIENTS } from '../components/site/data/content';
import SiteFooter from '../components/site/SiteFooter';
import { Arrow } from '../components/site/TitleDesc';

export const metadata: Metadata = {
    title: 'Klien',
    description: 'Asosiasi, layanan publik, dan data center yang menjalankan sistem DUMEG.',
};

/** One block per client: "Merek | Informasi" header rule, logo left, story + frame right. */
export default function ClientsPage() {
    return (
        <>
            <main className="pb-16 md:pb-64">
                <h1 className="sr-only">Klien DUMEG</h1>
                <section className="relative z-10 flex w-screen flex-col gap-16 pt-52 md:pt-64">
                    {CLIENTS.map((c) => (
                        <article key={c.name} className="flex w-full flex-col gap-8 pb-12 md:pb-20" aria-labelledby={`client-${c.name}`}>
                            <div className="grid w-full grid-cols-2 px-[var(--gutter)] tracking-tight text-ink">
                                <div className="t-label col-span-2 md:hidden">( {c.name} )</div>
                                <span className="hidden text-[16px] leading-6 md:block">Merek</span>
                                <span className="hidden text-[16px] leading-6 md:block">Informasi</span>
                                <div className="col-span-2 mb-8 mt-2 h-px w-full bg-rule md:mb-16" />
                                {c.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={c.logo} alt={`Logo ${c.name}`} loading="lazy" className="max-h-28 w-32 object-contain object-left-top grayscale md:max-h-36 md:w-44" />
                                ) : (
                                    <span className="font-display text-[clamp(28px,2.6vw,48px)] font-black leading-none tracking-[0.02em] text-ink-strong">{c.name}</span>
                                )}
                                <div className="col-span-2 mt-10 flex flex-col gap-3 md:col-span-1 md:mt-0 md:gap-6">
                                    <div className="t-label hidden md:flex">( {c.group} )</div>
                                    <h2 id={`client-${c.name}`} className="text-[24px] leading-8 md:text-[30px] md:leading-9">
                                        {c.title}
                                    </h2>
                                    <p className="text-[14px] leading-6 md:text-[16px]">{c.text}</p>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={c.image} alt={`${c.name}: ${c.title}`} loading="lazy" className="aspect-video w-full bg-ink-strong object-cover" />
                                    {c.href && (
                                        <Link href={c.href} className="btn-ink">
                                            Lihat Studi Kasus <Arrow className="btn-arrow w-2" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
            <SiteFooter />
        </>
    );
}
