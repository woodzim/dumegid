'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT_BLOCK } from '../data/content';
import { RuleHeader } from '../TitleDesc';

gsap.registerPlugin(ScrollTrigger);

const COPIES = 7;
const FONT = { fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, letterSpacing: '-0.045em' } as const;

interface Fit {
    viewBox: string;
    /** letter band inside the box, in % of its height (the rest above is room for the echoes) */
    band: { top: number; height: number };
    bar: { left: number; top: number; width: number; height: number } | null; // % of the word box
    iIndex: number;
}

/**
 * Giant contact word. Scrolling fans out stacked copies of it, each a little larger and
 * masked by the paper-coloured box of the copy in front, so only their top edges
 * echo upward. The word's "I" becomes a tilted bar that links to the contact page.
 */
export default function BuildContact() {
    const word = CONTACT_BLOCK.word;
    const iIndex = word.lastIndexOf('I');
    const rootRef = useRef<HTMLElement>(null);
    const sizerRef = useRef<SVGTextElement>(null);
    const [fit, setFit] = useState<Fit | null>(null);

    // size every copy from one hidden measuring text: tight viewBox + the I's box
    useEffect(() => {
        const t = sizerRef.current;
        if (!t) return;
        let cancelled = false;
        const measure = () => {
            if (cancelled) return;
            const bb = t.getBBox();
            // SVG boxes are em boxes; canvas metrics give the real cap height / descent
            const g = document.createElement('canvas').getContext('2d')!;
            g.font = `${FONT.fontWeight} 100px ${FONT.fontFamily}`;
            const m = g.measureText(word);
            const asc = m.actualBoundingBoxAscent;
            const desc = Math.max(0, m.actualBoundingBoxDescent);
            const h = asc + desc;
            const pad = h * 0.6; // headroom for the fanned copies
            const total = h + pad;
            let bar: Fit['bar'] = null;
            if (iIndex >= 0) {
                const e = t.getExtentOfChar(iIndex);
                const capI = g.measureText('I').actualBoundingBoxAscent;
                // the I's stem: its advance box minus side bearings, roughly the middle 64%
                const stem = e.width * 0.64;
                bar = {
                    left: ((e.x + (e.width - stem) / 2 - bb.x) / bb.width) * 100,
                    top: ((pad + asc - capI) / total) * 100,
                    width: (stem / bb.width) * 100,
                    height: (capI / total) * 100,
                };
            }
            setFit({ viewBox: `${bb.x} ${-asc - pad} ${bb.width} ${total}`, band: { top: (pad / total) * 100, height: (h / total) * 100 }, bar, iIndex });
        };
        void document.fonts.ready.then(measure);
        return () => {
            cancelled = true;
        };
    }, [iIndex, word]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || !fit || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>('[data-cta-item]');
            const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 70%', scrub: 0.6 } });
            items.forEach((el, j) => {
                const k = items.length - 1 - j; // distance from the front copy
                tl.fromTo(el, { scale: 1 }, { scale: 1 + k * 0.085, ease: 'power2.out' }, 0);
            });
            tl.fromTo('[data-cta-bar]', { rotate: 0 }, { rotate: 18, ease: 'power2.out' }, 0);
        }, root);
        return () => ctx.revert();
    }, [fit]);

    const text = (hideI: boolean) => (
        <text x="0" y="0" fontSize="100" fill="currentColor" style={FONT} dominantBaseline="alphabetic">
            {word.split('').map((ch, i) => (
                <tspan key={i} fillOpacity={hideI && i === iIndex ? 0 : 1}>
                    {ch}
                </tspan>
            ))}
        </text>
    );

    return (
        <section ref={rootRef} className="relative z-10 flex w-full flex-col items-center px-[var(--gutter)] pb-52 pt-8 md:pb-64 md:pt-16" aria-labelledby="cta-word">
            <RuleHeader left={CONTACT_BLOCK.label} />
            <h2 id="cta-word" className="sr-only">
                {word}: {CONTACT_BLOCK.cta}
            </h2>

            <div className="relative z-[1] mt-4 w-full md:mt-9">
            {/* measuring copy (also reserves the height) */}
            <svg className="pointer-events-none block w-full opacity-0" viewBox={fit?.viewBox ?? '0 -72 330 74'} aria-hidden="true">
                <text ref={sizerRef} x="0" y="0" fontSize="100" style={FONT}>
                    {word}
                </text>
            </svg>

            {fit && (
                <div className="absolute inset-0">
                    {Array.from({ length: COPIES }, (_, j) => {
                        const front = j === COPIES - 1;
                        return (
                            <div key={j} data-cta-item className="absolute inset-x-0 top-0 origin-bottom text-ink" aria-hidden={!front}>
                                {front && fit.bar && (
                                    <Link
                                        href="/contact"
                                        data-cta-bar
                                        aria-label={CONTACT_BLOCK.cta}
                                        className="group/bar absolute z-20 flex origin-center items-center justify-center bg-ink text-white transition-colors duration-300 hover:bg-ink-strong"
                                        style={{ left: `${fit.bar.left}%`, top: `${fit.bar.top}%`, width: `${fit.bar.width}%`, height: `${fit.bar.height * 1.12}%` }}
                                    >
                                        <span className="block -rotate-90 whitespace-nowrap text-[clamp(10px,1.25vw,24px)] uppercase tracking-tight opacity-0 transition-opacity duration-300 group-hover/bar:opacity-100">
                                            {CONTACT_BLOCK.cta}
                                        </span>
                                    </Link>
                                )}
                                <svg className="relative z-10 block w-full" viewBox={fit.viewBox} aria-hidden="true">
                                    {text(front)}
                                </svg>
                                {/* paper block that hides the copies behind, except their upper edges */}
                                <div
                                    className="absolute left-1/2 z-0 w-[200vw] -translate-x-1/2 bg-paper md:w-[103%]"
                                    style={{ top: `${fit.band.top - 0.6}%`, height: `${fit.band.height + 1.2}%` }}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
            </div>
        </section>
    );
}
