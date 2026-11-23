'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ECOSYSTEM, type EcoItem } from '../data/content';
import { CategoryButton } from '../work/WorkIndex';
import WorkLogo from '../work/WorkLogo';

type Kind = 'semua' | EcoItem['kind'];
const KINDS: { id: Kind; title: string; hint: string }[] = [
    { id: 'semua', title: 'Semua', hint: 'Aplikasi dan website' },
    { id: 'aplikasi', title: 'Aplikasi', hint: 'Masuk dengan akun Anda' },
    { id: 'website', title: 'Website', hint: 'Bisa dibuka siapa saja' },
];

const norm = (v: string) => v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const host = (url: string) => new URL(url).host.replace(/^www\./, '');
const haystack = (e: EcoItem) => norm([e.name, e.label, host(e.url), ...(e.tags ?? [])].join(' '));

function ExternalIcon({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.3" className={className} aria-hidden="true">
            <path d="M4.5 2.5h5v5M9.5 2.5 2.5 9.5" />
        </svg>
    );
}

function EcoTile({ e }: { e: EcoItem }) {
    return (
        <a
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col border border-ink/15 bg-white p-5 text-ink-strong transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink-strong hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong md:p-6"
        >
            <div className="flex items-start justify-between gap-3">
                <WorkLogo w={e} />
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ink/15 text-muted transition-colors duration-200 group-hover:border-ink-strong group-hover:bg-ink-strong group-hover:text-white">
                    <ExternalIcon />
                </span>
            </div>
            <h3 className="mt-6 text-[22px] leading-[1.1] tracking-tighter md:text-[24px]">{e.name}</h3>
            <p className="mt-1.5 text-[16px] leading-[1.4] tracking-tight text-ink">{e.label}</p>
            <span className="mt-auto flex items-center gap-2 pt-5 font-mono text-[12px] leading-4 tracking-tight text-muted">
                <span className={`block size-2 shrink-0 rounded-full ${e.kind === 'aplikasi' ? 'bg-ink-strong' : 'border border-ink-strong'}`} />
                {e.kind === 'aplikasi' ? 'Aplikasi' : 'Website'} · {host(e.url)}
            </span>
        </a>
    );
}

/**
 * Ecosystem launcher: every live DUMEG app and website on one page, like the old
 * dumeg.id dashboard. Search + Semua / Aplikasi / Website, tiles open the site in a new tab.
 */
export default function EcosystemIndex() {
    const params = useSearchParams();
    const [kind, setKind] = useState<Kind>(() => (KINDS.some((k) => k.id === params.get('jenis')) ? (params.get('jenis') as Kind) : 'semua'));
    const [query, setQuery] = useState(() => params.get('q') ?? '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const qs = new URLSearchParams();
        if (kind !== 'semua') qs.set('jenis', kind);
        if (query.trim()) qs.set('q', query.trim());
        const next = `${window.location.pathname}${qs.size ? `?${qs}` : ''}`;
        if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, '', next);
    }, [kind, query]);

    useEffect(() => {
        const onKey = (ev: KeyboardEvent) => {
            const t = ev.target as HTMLElement;
            if (ev.key === '/' && t.tagName !== 'INPUT' && t.tagName !== 'TEXTAREA') {
                ev.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const q = norm(query);
    const byQuery = useMemo(() => (q ? ECOSYSTEM.filter((e) => haystack(e).includes(q)) : ECOSYSTEM), [q]);
    const shown = kind === 'semua' ? byQuery : byQuery.filter((e) => e.kind === kind);
    const reset = () => {
        setKind('semua');
        setQuery('');
    };

    return (
        <div className="px-[var(--gutter)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                {/* search */}
                <div className="w-full lg:max-w-[560px]">
                    <label htmlFor="eco-search" className="block text-[16px] leading-6 tracking-tight text-ink">
                        Cari aplikasi atau website
                    </label>
                    <div className="mt-2 flex h-16 w-full items-center gap-3 border border-ink/25 bg-white px-5 focus-within:border-ink-strong">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0 text-muted" aria-hidden="true">
                            <circle cx="7" cy="7" r="5.2" />
                            <path d="m11 11 3.6 3.6" />
                        </svg>
                        <input
                            id="eco-search"
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={(ev) => setQuery(ev.target.value)}
                            placeholder="Contoh: karsa, kapal, tanda tangan"
                            autoComplete="off"
                            className="h-full w-full bg-transparent text-[17px] tracking-tight text-ink-strong outline-none placeholder:text-faint md:text-[19px] [&::-webkit-search-cancel-button]:hidden"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery('')} className="shrink-0 px-1 text-[15px] tracking-tight text-muted underline underline-offset-4 hover:text-ink-strong">
                                Hapus
                            </button>
                        )}
                    </div>
                </div>

                {/* kinds */}
                <div className="grid w-full grid-cols-3 gap-2 lg:w-[600px]" role="group" aria-label="Pilih jenis">
                    {KINDS.map((k) => (
                        <CategoryButton
                            key={k.id}
                            active={kind === k.id}
                            onClick={() => setKind(k.id)}
                            title={k.title}
                            hint={k.hint}
                            count={k.id === 'semua' ? byQuery.length : byQuery.filter((e) => e.kind === k.id).length}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule pb-3 text-[16px] tracking-tight text-ink" aria-live="polite">
                <span>
                    Menampilkan <strong className="font-normal text-ink-strong">{shown.length}</strong> dari {ECOSYSTEM.length}
                    {query.trim() && <> untuk &ldquo;{query.trim()}&rdquo;</>}
                </span>
                {(kind !== 'semua' || query) && (
                    <button type="button" onClick={reset} className="text-ink-strong underline underline-offset-4">
                        Tampilkan semua
                    </button>
                )}
                <span className="ml-auto hidden items-center gap-1.5 text-muted md:flex">
                    <ExternalIcon /> Terbuka di tab baru
                </span>
            </div>

            {shown.length ? (
                <motion.ul layout className="mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {shown.map((e) => (
                            <motion.li
                                key={e.url}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                            >
                                <EcoTile e={e} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            ) : (
                <div className="flex flex-col items-start gap-5 py-16">
                    <p className="t-lead text-ink-strong">Belum ada yang cocok{query.trim() ? <> dengan &ldquo;{query.trim()}&rdquo;</> : null}.</p>
                    <button type="button" onClick={reset} className="btn-mono">
                        Tampilkan semua
                    </button>
                </div>
            )}

            <p className="mt-16 max-w-[720px] text-[17px] leading-7 tracking-tight text-ink">
                Aplikasi membutuhkan akun untuk masuk. Belum punya akun atau lupa kata sandi?{' '}
                <Link href="/contact" className="text-ink-strong underline underline-offset-4">
                    Hubungi tim DUMEG
                </Link>
                .
            </p>
        </div>
    );
}
