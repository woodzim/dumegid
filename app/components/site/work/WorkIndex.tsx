'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SERVICES, WORKS, type WorkItem } from '../data/content';
import { Arrow } from '../TitleDesc';
import WorkLogo from './WorkLogo';

const ALL = 'semua';
const norm = (v: string) => v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const serviceOf = (id: string) => SERVICES.find((s) => s.id === id)!;

/** One line per category, in everyday words, so anyone knows what to pick. */
const HINT: Record<string, string> = {
    [ALL]: 'Tampilkan semua aplikasi',
    angkutan: 'Memantau truk dan muatan',
    simpul: 'Kegiatan di pelabuhan',
    'aplikasi-pendukung': 'Untuk kantor dan usaha',
    'media-center': 'Website asosiasi dan pusat data',
};

/** Matched against the query: name, plain description, category, sub-group, extra words. */
const haystack = (w: WorkItem) => norm([w.name, w.desc, w.group, serviceOf(w.service).title, ...(w.tags ?? [])].join(' '));

export function CategoryButton({ active, onClick, title, hint, count, color, className = '' }: { active: boolean; onClick: () => void; title: string; hint: string; count: number; color?: string; className?: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`${className} flex min-h-[64px] flex-col items-start justify-center gap-1 border px-4 py-3 text-left transition-colors duration-200 ${
                active ? 'border-ink-strong bg-ink-strong text-white' : 'border-ink/20 bg-white text-ink-strong hover:border-ink-strong'
            }`}
        >
            <span className="flex w-full items-center gap-2 text-[18px] leading-6 tracking-tight">
                {color && <span className="block size-3 shrink-0 rounded-full" style={{ background: color }} />}
                {title}
                <span className={`ml-auto font-mono text-[13px] ${active ? 'text-white/70' : 'text-muted'}`}>{count}</span>
            </span>
            <span className={`text-[14px] leading-5 tracking-tight ${active ? 'text-white/75' : 'text-muted'}`}>{hint}</span>
        </button>
    );
}

function WorkTile({ w }: { w: WorkItem }) {
    const svc = serviceOf(w.service);
    const href = w.href ?? `/contact?layanan=${w.service}`;
    return (
        <Link
            href={href}
            className="group flex h-full min-h-[260px] flex-col border border-ink/15 bg-white p-6 text-ink-strong transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink-strong hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
        >
            <WorkLogo w={w} />
            <span className="mt-6 flex items-center gap-2 font-mono text-[12px] uppercase leading-4 tracking-tight text-muted">
                <span className="block size-2.5 shrink-0 rounded-full" style={{ background: svc.color }} />
                {svc.title}
            </span>
            <h3 className="mt-2 text-[26px] leading-[1.05] tracking-tighter md:text-[28px]">{w.name}</h3>
            <p className="mt-2 text-[17px] leading-[1.45] tracking-tight text-ink">{w.desc}</p>
            <span className="mt-auto flex items-center gap-2 pt-6 text-[15px] tracking-tight underline decoration-ink/30 underline-offset-4 transition-colors group-hover:decoration-ink-strong">
                {w.href ? 'Lihat detail' : 'Tanya kami'}
                <Arrow className="w-2.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
        </Link>
    );
}

/**
 * Showcase of every DUMEG app and website: a big search box, one row of category
 * buttons with a plain-language hint each, then a simple grid of tiles.
 * Filters live in the URL (?kategori, ?q) so a filtered view can be shared.
 */
export default function WorkIndex() {
    const params = useSearchParams();
    const [cat, setCat] = useState(() => (SERVICES.some((s) => s.id === params.get('kategori')) ? params.get('kategori')! : ALL));
    const [query, setQuery] = useState(() => params.get('q') ?? '');
    const inputRef = useRef<HTMLInputElement>(null);

    // keep the URL in step without a navigation
    useEffect(() => {
        const qs = new URLSearchParams();
        if (cat !== ALL) qs.set('kategori', cat);
        if (query.trim()) qs.set('q', query.trim());
        const next = `/work${qs.size ? `?${qs}` : ''}`;
        if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, '', next);
    }, [cat, query]);

    // "/" jumps to the search box
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement;
            if (e.key === '/' && t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const q = norm(query);
    const byQuery = useMemo(() => (q ? WORKS.filter((w) => haystack(w).includes(q)) : WORKS), [q]);
    const shown = cat === ALL ? byQuery : byQuery.filter((w) => w.service === cat);
    const reset = () => {
        setCat(ALL);
        setQuery('');
    };

    return (
        <div className="px-[var(--gutter)]">
            {/* search */}
            <label htmlFor="work-search" className="block text-[16px] leading-6 tracking-tight text-ink">
                Cari aplikasi dengan nama atau kebutuhan
            </label>
            <div className="mt-2 flex h-16 w-full items-center gap-3 border border-ink/25 bg-white px-5 focus-within:border-ink-strong lg:w-[640px]">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0 text-muted" aria-hidden="true">
                    <circle cx="7" cy="7" r="5.2" />
                    <path d="m11 11 3.6 3.6" />
                </svg>
                <input
                    id="work-search"
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Contoh: absensi, kapal, kasir"
                    autoComplete="off"
                    className="h-full w-full bg-transparent text-[17px] md:text-[19px] tracking-tight text-ink-strong outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                    <button type="button" onClick={() => setQuery('')} className="shrink-0 px-1 text-[15px] tracking-tight text-muted underline underline-offset-4 hover:text-ink-strong">
                        Hapus
                    </button>
                )}
            </div>

            {/* categories */}
            <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5" role="group" aria-label="Pilih kategori">
                <CategoryButton active={cat === ALL} onClick={() => setCat(ALL)} title="Semua" hint={HINT[ALL]} count={byQuery.length} className="col-span-2 md:col-span-1" />
                {SERVICES.map((svc) => (
                    <CategoryButton
                        key={svc.id}
                        active={cat === svc.id}
                        onClick={() => setCat(svc.id)}
                        title={svc.title}
                        hint={HINT[svc.id] ?? svc.category}
                        count={byQuery.filter((w) => w.service === svc.id).length}
                        color={svc.color}
                    />
                ))}
            </div>

            {/* result count */}
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule pb-3 text-[16px] tracking-tight text-ink" aria-live="polite">
                <span>
                    Menampilkan <strong className="font-normal text-ink-strong">{shown.length}</strong> dari {WORKS.length} aplikasi
                    {query.trim() && <> untuk &ldquo;{query.trim()}&rdquo;</>}
                </span>
                {(cat !== ALL || query) && (
                    <button type="button" onClick={reset} className="text-ink-strong underline underline-offset-4">
                        Tampilkan semua
                    </button>
                )}
            </div>

            {/* tiles */}
            {shown.length ? (
                <motion.ul layout className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {shown.map((w) => (
                            <motion.li
                                key={w.name}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                            >
                                <WorkTile w={w} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            ) : (
                <div className="flex flex-col items-start gap-5 py-16">
                    <p className="t-lead text-ink-strong">Belum ada yang cocok{query.trim() ? <> dengan &ldquo;{query.trim()}&rdquo;</> : null}.</p>
                    <p className="text-[17px] tracking-tight text-ink">Coba kata lain, atau tanyakan langsung ke tim kami.</p>
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={reset} className="btn-mono">
                            Tampilkan semua
                        </button>
                        <Link href="/contact" className="btn-ink">
                            Hubungi Kami <Arrow className="btn-arrow w-2" />
                        </Link>
                    </div>
                </div>
            )}

            {/* help line for anyone who is unsure */}
            <p className="mt-16 text-[17px] leading-7 tracking-tight text-ink">
                Bingung memilih?{' '}
                <Link href="/contact" className="text-ink-strong underline underline-offset-4">
                    Ceritakan kebutuhan Anda
                </Link>
                , tim kami bantu carikan aplikasi yang pas.
            </p>
        </div>
    );
}
