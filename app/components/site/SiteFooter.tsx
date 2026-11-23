'use client';

import Link from 'next/link';
import { NAV, SITE } from './data/content';
import { scrollToTop } from './SmoothScroll';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} className="group flex flex-row items-center tracking-tighter text-muted transition-colors duration-200 ease-out hover:text-ink">
            <span className="flex w-3 origin-left scale-0 items-center justify-center transition-transform duration-200 ease-out group-hover:scale-100" aria-hidden="true">
                →
            </span>
            <span className="-translate-x-3 transition-transform duration-200 ease-out group-hover:translate-x-1.5">{children}</span>
        </a>
    );
}

/** Full-width serif DUMEG with the legal name in script across it and the flag rules (footer + hero). */
export function Wordmark({
    className = 'block w-full',
    ink = '#434343',
    inkOpacity = 1,
    script = '#9a9a9a',
    scriptOpacity = 0.55,
    shadow = false,
}: {
    className?: string;
    ink?: string;
    inkOpacity?: number;
    script?: string;
    scriptOpacity?: number;
    /** soft drop shadow, for use over photos */
    shadow?: boolean;
}) {
    return (
        <svg viewBox="0 0 1920 686" className={className} style={shadow ? { filter: 'drop-shadow(0 6px 24px rgba(6, 25, 83, 0.25))' } : undefined}>
            <text
                x="960"
                y="500"
                textAnchor="middle"
                textLength="1960"
                lengthAdjust="spacingAndGlyphs"
                className="font-display"
                fontSize="560"
                fontWeight="800"
                fill={ink}
                fillOpacity={inkOpacity}
                letterSpacing="-10"
            >
                DUMEG
            </text>
            <rect x="0" y="514" width="640" height="5" fill="#e0242c" />
            <rect x="1280" y="514" width="640" height="5" fill="#ffffff" />
            <rect x="1280" y="514" width="640" height="5" fill="none" stroke="#d6d6d6" strokeWidth="1" />
            <text x="1010" y="610" textAnchor="middle" className="font-script" fontSize="330" fill={script} fillOpacity={scriptOpacity}>
                Duta Meta Graha
            </text>
        </svg>
    );
}

/** Full-width serif wordmark with the legal name in script across it, then menu / contact / legal. */
export default function SiteFooter() {
    return (
        <footer className="relative flex w-full flex-col justify-center overflow-hidden">
            <div className="relative z-[1] flex w-full items-center justify-center pt-24 md:pt-32" aria-hidden="true">
                <Wordmark />
            </div>

            <div className="relative z-[1] flex w-full items-center justify-center whitespace-nowrap px-6 pb-6 pt-12 md:px-[72px] md:pb-14 md:pt-0">
                <div className="flex w-full flex-col md:flex-row">
                    <div className="flex flex-col">
                        <span className="text-[20px] leading-7 tracking-tighter text-black">Menu</span>
                        <div className="mt-14 flex flex-col">
                            {NAV.map((n) => (
                                <Link key={n.href} href={n.href} className="group flex flex-row items-center text-[30px] leading-9 tracking-tight text-ink">
                                    <span className="block w-3 origin-left scale-0 text-[18px] text-muted transition-transform duration-200 ease-out group-hover:scale-100" aria-hidden="true">
                                        →
                                    </span>
                                    <span className="-translate-x-3 transition-transform duration-200 ease-out group-hover:translate-x-2">{n.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col md:ml-24 md:mt-0 xl:ml-64">
                        <span className="hidden text-[20px] leading-7 tracking-tighter text-black md:block">Kontak</span>
                        <div className="mt-6 flex h-full flex-col justify-between gap-8 text-[16px] leading-6 md:mt-14 md:gap-4">
                            <div className="flex flex-col">
                                <span className="tracking-tight text-ink">{SITE.legal}</span>
                                <FooterLink href={SITE.phoneHref}>{SITE.phone}</FooterLink>
                            </div>
                            <div className="flex flex-col">
                                <span className="tracking-tight text-ink">Email</span>
                                <FooterLink href={`mailto:${SITE.email}`}>{SITE.email}</FooterLink>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col justify-end md:flex-row">
                        <div className="flex h-full flex-col justify-between md:items-end">
                            <button
                                type="button"
                                onClick={() => scrollToTop()}
                                className="group absolute right-6 top-12 flex flex-row items-center gap-1.5 text-[20px] leading-7 tracking-tighter text-black md:relative md:right-auto md:top-auto md:-mt-10 md:translate-x-8 md:gap-2"
                            >
                                <span>Kembali ke atas</span>
                                <span className="flex size-6 items-center justify-center rounded-full bg-ink text-[11px] text-white transition-[width,height] duration-200 ease-out md:size-0 md:overflow-hidden md:group-hover:size-6" aria-hidden="true">
                                    ↑
                                </span>
                            </button>
                            <div className="mt-8 flex flex-col text-[16px] leading-6 xl:mt-0 xl:flex-row xl:gap-8">
                                <span className="tracking-tight text-ink xl:hidden">Situs</span>
                                <Link href="/kebijakan-cookie" className="tracking-tighter text-muted transition-colors duration-200 hover:text-ink">
                                    Kebijakan Cookie
                                </Link>
                                <Link href="/kebijakan-privasi" className="tracking-tighter text-muted transition-colors duration-200 hover:text-ink">
                                    Kebijakan Privasi
                                </Link>
                                <span className="mt-10 tracking-tighter text-muted md:mt-0">
                                    © {SITE.year} Hak cipta dilindungi, {SITE.legal}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
