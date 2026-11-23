'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV, PROJECTS, SITE } from './data/content';
import { getLenis, scrollToTop } from './SmoothScroll';
import { Arrow } from './TitleDesc';

const ease = [0.2, 0, 0, 1] as const;

/** Official DUMEG mark (sail over waves), cropped to its artwork and 72px wide like the reference logo. */
export function Logo({ className = '' }: { className?: string; light?: boolean }) {
    return (
        <span className={`relative block aspect-[430/320] w-[64px] overflow-hidden md:w-[72px] ${className}`} aria-label="DUMEG">
            {/* the PNG has ~35/90px of transparent margin around a 430x320 artwork */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dumeg-logo.png" alt="DUMEG" className="absolute left-[-8.14%] top-[-28.1%] w-[116.3%] max-w-none" />
        </span>
    );
}

function IconButton({ label, onClick, className = '', children }: { label: string; onClick: () => void; className?: string; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`chamfer pointer-events-auto grid size-11 place-items-center bg-ink-strong/80 text-white backdrop-blur transition-colors hover:bg-ink-strong ${className}`}
        >
            {children}
        </button>
    );
}

/** Highlights column of the open menu: one card per case study (no invented news). */
function Highlights({ onNavigate }: { onNavigate: () => void }) {
    return (
        <div className="hidden w-[clamp(33rem,40vw,39rem)] max-w-[calc(72vw-7rem)] flex-col gap-4 overflow-y-auto pr-1 lg:flex" data-lenis-prevent>
            {PROJECTS.slice(0, 5).map((p, i) => (
                <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: 0.25 + i * 0.06 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                    <Link
                        href={`/work/${p.slug}`}
                        onClick={onNavigate}
                        className="chamfer group flex min-h-[172px] justify-between gap-8 bg-ink-strong/80 p-5 backdrop-blur-lg transition-colors hover:bg-ink-strong/60"
                    >
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-x-2 text-[20px] font-bold leading-7 text-white">
                                    <span>{p.name}</span>
                                    <Arrow className="w-4" />
                                    <span>{p.category}</span>
                                    <span className="text-[14px] font-light italic">( {SITE.year} )</span>
                                </div>
                                <p className="max-w-[30rem] text-balance text-[14px] leading-[1.1] text-faint">{p.tagline}</p>
                            </div>
                            <span className="text-[14px] font-medium tracking-tighter text-muted">( Studi Kasus )</span>
                        </div>
                        <div className="grid aspect-square h-[132px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">
                            {p.logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.logo} alt="" className="max-h-[62%] max-w-[70%] object-contain transition-transform duration-200 group-hover:scale-105" />
                            ) : (
                                <span className="font-display text-[22px] font-bold text-ink">{p.name}</span>
                            )}
                        </div>
                    </Link>
                </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} exit={{ opacity: 0 }}>
                <Link
                    href="/work"
                    onClick={onNavigate}
                    className="group flex h-[52px] items-center justify-between rounded-2xl bg-white px-4 text-[16px] leading-none text-ink-strong"
                >
                    <span className="origin-left transition-transform duration-200 group-hover:scale-105">Semua Karya</span>
                    <Arrow className="w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            </motion.div>
        </div>
    );
}

export default function SiteHeader() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const close = () => setOpen(false);

    // the menu covers the page: freeze smooth scrolling while it is open
    useEffect(() => {
        const l = getLenis();
        if (open) l?.stop();
        else l?.start();
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <>
            <Link href="/" aria-label="DUMEG, ke halaman utama" className="fixed left-[var(--gutter)] top-0 z-[997] pt-8 md:pt-10">
                <Logo />
            </Link>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="overlay"
                        className="fixed inset-0 z-[990] bg-black/70 backdrop-blur-[6px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={close}
                    />
                )}
            </AnimatePresence>

            <header className="pointer-events-none fixed right-0 top-0 z-[999] flex w-full justify-end gap-4 px-[var(--gutter)] pt-10">
                <AnimatePresence>{open && <Highlights key="hl" onNavigate={close} />}</AnimatePresence>

                <div className="relative">
                    {!open && (
                        <IconButton label="Kembali ke atas" onClick={() => scrollToTop()} className="absolute right-[52px] top-0 hidden md:grid">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                                <path d="M7 12V2M2.8 6 7 1.8 11.2 6" />
                            </svg>
                        </IconButton>
                    )}

                    <motion.div
                        className="chamfer pointer-events-auto relative origin-top-right overflow-hidden bg-ink-strong/80 backdrop-blur"
                        initial={false}
                        animate={
                            open
                                ? { width: 'min(538px, calc(100vw - 48px))', height: 'calc(92dvh)' }
                                : { width: 44, height: 44 }
                        }
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <button
                            type="button"
                            aria-label={open ? 'Tutup menu' : 'Buka menu'}
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                            className="absolute right-0 top-0 z-20 grid size-11 place-items-center text-white"
                        >
                            <span className="relative block h-[10px] w-[15px]" aria-hidden="true">
                                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? 'top-[4px] rotate-45' : 'top-0'}`} />
                                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${open ? 'top-[4px] -rotate-45' : 'top-[8px]'}`} />
                            </span>
                        </button>

                        <AnimatePresence>
                            {open && (
                                <motion.nav
                                    key="nav"
                                    aria-label="Menu utama"
                                    className="flex h-full w-[min(538px,calc(100vw-48px))] flex-col justify-between pl-6 pr-6 md:pl-10 md:pr-16"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                >
                                    <ul className="mt-16 flex flex-col gap-4 md:mt-[72px]">
                                        {NAV.map((item, i) => (
                                            <motion.li
                                                key={item.href}
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: 0.3 + i * 0.06 } }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={close}
                                                    className={`group flex flex-col gap-3 text-[36px] leading-10 tracking-tight transition-colors duration-200 hover:text-white md:gap-4 md:text-[60px] md:leading-[60px] ${
                                                        pathname === item.href ? 'text-white' : 'text-[#5b5b5b]'
                                                    }`}
                                                >
                                                    <span className="flex items-center justify-between">
                                                        <span className="origin-left transition-transform duration-200 group-hover:scale-105">{item.label}</span>
                                                        <Arrow className="w-[14px] transition-transform duration-200 group-hover:translate-x-1" />
                                                    </span>
                                                    <motion.span
                                                        className="block h-px w-full origin-left bg-[#383838]"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1, transition: { duration: 0.8, ease, delay: 0.35 + i * 0.06 } }}
                                                    />
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <div className="flex w-fit flex-col gap-1 pb-8 text-[16px] leading-6 tracking-tighter md:pb-12">
                                        <span className="mb-4 text-faint md:mb-8">Kontak</span>
                                        <a href={`mailto:${SITE.email}`} className="text-white hover:underline">
                                            {SITE.email}
                                        </a>
                                        <a href={SITE.phoneHref} className="text-white hover:underline">
                                            {SITE.phone}
                                        </a>
                                        <span className="text-white">{SITE.legal}</span>
                                    </div>
                                </motion.nav>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </header>
        </>
    );
}
