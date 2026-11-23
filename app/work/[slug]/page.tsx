import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../components/site/data/content';
import { ColorBand } from '../../components/site/home/Disciplines';
import ScriptMarquee from '../../components/site/ScriptMarquee';
import { Arrow } from '../../components/site/TitleDesc';
import { CaseBoard, CaseFrames, CaseGrid, CaseHero, CaseLabel, CaseNext, CaseStory, MonoBand } from '../../components/site/case/CaseParts';

export function generateStaticParams() {
    return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const p = PROJECTS.find((x) => x.slug === slug);
    if (!p) return {};
    return { title: p.name, description: `${p.system}. ${p.tagline}`, openGraph: { images: [p.cover] } };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const index = PROJECTS.findIndex((x) => x.slug === slug);
    if (index < 0) notFound();
    const p = PROJECTS[index];
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    const facts = [{ label: 'Tentang', value: `${p.name} oleh DUMEG` }, { label: 'Nama', value: p.fullName }, { label: 'Sistem', value: p.system }, { label: 'Cakupan', value: p.scope }, ...p.facts];

    return (
        <main className="relative w-screen overflow-x-clip">
            <h1 className="sr-only">
                {p.name}: {p.system}
            </h1>

            <section className="relative z-10 flex min-h-svh w-screen flex-col justify-between pt-40">
                <CaseHero p={p} />
                <div className="flex w-full flex-col gap-8 md:mt-24 md:gap-24">
                    <div className="my-12 md:my-32">
                        <ScriptMarquee word={p.name} text="Oleh DUMEG" />
                    </div>
                    <MonoBand text={`${p.name} oleh DUMEG — Scroll ke bawah`} />
                </div>
            </section>

            <section className="relative z-10 flex w-screen flex-col px-[var(--gutter)] py-16 md:py-32">
                <CaseLabel className="mb-4">Tentang</CaseLabel>
                <p className="w-full text-balance text-[20px] leading-none tracking-tight text-ink md:w-2/3 lg:text-[36px] xl:w-[45%]">{p.description}</p>
                <CaseLabel className="mt-12 lg:mt-28">Contoh &amp; Karya</CaseLabel>
                <div className="-mx-[var(--gutter)]">
                    <CaseBoard p={p} />
                </div>
            </section>

            <CaseStory p={p} />

            <section className="relative z-10 flex w-screen flex-col gap-16 px-[var(--gutter)] py-8 md:py-16">
                <CaseGrid p={p} />
                <div>
                    <CaseLabel className="mb-4">Tentang</CaseLabel>
                    <p className="w-full text-balance text-[20px] leading-none tracking-tight text-ink md:w-2/3 md:text-[36px] xl:w-1/2">
                        {p.tagline} {p.note ?? ''}
                    </p>
                </div>
            </section>

            <CaseFrames p={p} />

            <div className="flex w-full flex-col pt-12">
                <div className="grid w-full grid-cols-2 px-[var(--gutter)] pb-4 tracking-tight text-ink md:pb-12">
                    <span className="hidden text-[16px] leading-6 md:block">Proyek</span>
                    <span className="hidden text-[16px] leading-6 md:block">Detail Proyek</span>
                    <div className="col-span-2 flex items-center justify-between md:hidden">
                        <div className="t-label">( Tentang {p.name} )</div>
                        <span className="size-5 rounded-full" style={{ background: p.accent }} />
                    </div>
                    <div className="col-span-2 mb-12 mt-2 h-px w-full bg-rule md:mb-24" />
                    <div className="flex flex-row items-start md:mb-6">
                        <span className="font-script text-[88px] leading-[0.9] md:text-[176px]" aria-hidden="true">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                    <div className="col-span-2 mt-8 flex flex-col gap-6 pb-12 md:col-span-1 md:mt-0">
                        <div className="t-label hidden md:flex">( Informasi )</div>
                        <div className="hidden flex-row items-center gap-2 md:flex">
                            <span className="size-5 rounded-full" style={{ background: p.accent }} />
                            <h2 className="text-[24px] leading-none md:text-[30px]">Tentang {p.name}</h2>
                        </div>
                        <dl className="flex w-full flex-col">
                            {facts.map((f, k) => (
                                <div key={f.label} className={`flex w-full flex-row items-center justify-between gap-2 border-b border-rule py-1 text-[14px] leading-6 md:text-[16px] ${k === 0 ? 'border-t' : ''}`}>
                                    <dt>{f.label}</dt>
                                    <dd className="text-right text-muted">{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <div>
                            <Link href={`/contact?proyek=${p.slug}`} className="btn-ink">
                                Diskusikan Proyek Serupa <Arrow className="btn-arrow w-2" />
                            </Link>
                        </div>
                    </div>
                </div>
                <ColorBand color={p.accent} text={`Pelajari lebih lanjut tentang ${p.name} — Mari bekerja sama`} href={`/contact?proyek=${p.slug}`} />
            </div>

            <CaseNext next={next} />
        </main>
    );
}
