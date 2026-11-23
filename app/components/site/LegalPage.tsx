import SiteFooter from './SiteFooter';

export interface LegalSection {
    title: string;
    body: string[];
}

/** Plain text page for the policies, in the site's label / lead typography. */
export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
    return (
        <>
            <main className="px-[var(--gutter)] pb-24 pt-52 md:pt-64">
                <div className="flex justify-between border-b border-rule pb-2 text-[16px] leading-6 tracking-tight">
                    <span>Dokumen</span>
                    <span className="tracking-[-0.08em]">Diperbarui {updated}</span>
                </div>
                <h1 className="mt-12 text-[3.8rem] leading-[0.9] tracking-tighter md:mt-24 md:text-[10rem]">{title}</h1>
                <div className="mt-[clamp(40px,5vw,80px)] grid gap-y-10 md:grid-cols-2 md:gap-x-[var(--gutter)]">
                    {sections.map((s, i) => (
                        <section key={s.title} className="md:col-start-2">
                            <div className="t-label mb-3">( {String(i + 1).padStart(2, '0')} )</div>
                            <h2 className="text-[24px] leading-none md:text-[30px]">{s.title}</h2>
                            {s.body.map((p) => (
                                <p key={p.slice(0, 32)} className="mt-4 max-w-[640px] text-[16px] leading-6 tracking-tight text-muted">
                                    {p}
                                </p>
                            ))}
                        </section>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </>
    );
}
