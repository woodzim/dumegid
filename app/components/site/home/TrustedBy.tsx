'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INDONESIA_PATH, INDONESIA_VIEWBOX, MERAUKE, NEIGHBOURS_PATH, SABANG } from '../data/indonesia';
import { REACH, TRUSTED } from '../data/content';
import TitleDesc from '../TitleDesc';

gsap.registerPlugin(ScrollTrigger);

type Logo = { name: string; src?: string };

function LogoMark({ l }: { l: Logo }) {
    return l.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={l.src} alt={l.name} loading="lazy" className="h-full w-full select-none object-contain grayscale" />
    ) : (
        <span className="whitespace-nowrap font-display text-[clamp(14px,1.3vw,24px)] font-bold tracking-[0.08em] text-ink">{l.name}</span>
    );
}

/** Bordered 16:9 box that trades its logo for a second one every few seconds. */
function LogoBox({ a, b, flip }: { a: Logo; b: Logo; flip: boolean }) {
    const layer = (l: Logo, on: boolean) => (
        <div
            className="absolute flex h-[30%] w-1/2 items-center justify-center transition-[opacity,transform,filter] duration-700 ease-out"
            style={{ opacity: on ? 1 : 0, transform: on ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(12%)', filter: on ? 'blur(0)' : 'blur(6px)' }}
            aria-hidden={!on}
        >
            <LogoMark l={l} />
        </div>
    );
    return (
        <div data-logo-box className="relative flex aspect-video w-full items-center justify-center border border-line">
            {layer(a, !flip)}
            {layer(b, flip)}
        </div>
    );
}

/** Coordinates that count up from zero when they scroll into view. */
function Coords({ lat, lon }: { lat: number; lon: number }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const [k, setK] = useState(0);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const o = { v: 0 };
        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => gsap.to(o, { v: 1, duration: 1.6, ease: 'power3.out', onUpdate: () => setK(o.v) }),
        });
        return () => st.kill();
    }, []);
    return (
        <p ref={ref} className="mt-2 whitespace-nowrap text-[12px] tabular-nums leading-4 tracking-tighter text-muted md:mt-5 md:text-[16px] md:leading-6">
            ( {(lat * k).toFixed(6)}, {(lon * k).toFixed(6)} )
        </p>
    );
}

/** Pin on the map: a solid dot with a slow pulsing ring. */
function Pin({ x, y }: { x: number; y: number }) {
    return (
        <g>
            <circle cx={x} cy={y} r="6" fill="none" stroke="#1e1e1e" strokeWidth="1.5">
                <animate attributeName="r" values="6;22" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={x} cy={y} r="6.5" fill="#ffffff" stroke="#1e1e1e" strokeWidth="2.5" />
        </g>
    );
}

/** The whole archipelago, edge to edge; neighbours stay light so Indonesia reads at a glance. */
function FullMap() {
    return (
        <svg viewBox={INDONESIA_VIEWBOX} className="block h-auto w-full" role="img" aria-label="Peta Indonesia dari Sabang sampai Merauke">
            <path d={NEIGHBOURS_PATH} fill="#d9d9d9" />
            <path d={INDONESIA_PATH} fill="#434343" />
            <Pin x={SABANG.x} y={SABANG.y} />
            <Pin x={MERAUKE.x} y={MERAUKE.y} />
        </svg>
    );
}

/** Faint embossed paper relief that drifts behind the grid (the reference's terrain canvases). */
function Relief({ className = '', seed = 3, flip = false }: { className?: string; seed?: number; flip?: boolean }) {
    const id = `relief-${seed}`;
    return (
        <svg viewBox="0 0 600 600" className={`pointer-events-none absolute aspect-square ${className}`} style={{ transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden="true">
            <defs>
                <filter id={id} x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="5" seed={seed} result="n" />
                    <feDiffuseLighting in="n" surfaceScale="9" lightingColor="#ffffff" result="l">
                        <feDistantLight azimuth="225" elevation="38" />
                    </feDiffuseLighting>
                    <feColorMatrix in="l" type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.96  0 0 0 0 0.96  -1.6 0 0 0 1.25" />
                </filter>
                <radialGradient id={`${id}-m`}>
                    <stop offset="0.35" stopColor="#fff" />
                    <stop offset="1" stopColor="#000" />
                </radialGradient>
                <mask id={`${id}-mask`}>
                    <rect width="600" height="600" fill={`url(#${id}-m)`} />
                </mask>
            </defs>
            <rect width="600" height="600" filter={`url(#${id})`} mask={`url(#${id}-mask)`} opacity="0.9" />
        </svg>
    );
}

const parse = (s: string) => s.replace(/[()]/g, '').split(',').map((v) => parseFloat(v));

/** "(Trusted by)" lead, a 5-column logo grid, and Sabang / Merauke at the page edges. */
export default function TrustedBy() {
    const rootRef = useRef<HTMLElement>(null);
    const [flip, setFlip] = useState<boolean[]>(() => Array(5).fill(false));
    const logos = TRUSTED.logos;
    const BOXES = 5; // one row; each box trades its logo for the one five places later
    const [fromLat, fromLon] = parse(REACH.from.coords);
    const [toLat, toLon] = parse(REACH.to.coords);

    // pairs of boxes (i, i+5) swap together so a logo never shows twice at once
    useEffect(() => {
        let i = 0;
        const id = window.setInterval(() => {
            setFlip((f) => f.map((v, k) => (k === i % 5 ? !v : v)));
            i++;
        }, 1400);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.set('[data-logo-box]', { opacity: 0, y: 50 });
            ScrollTrigger.batch('[data-logo-box]', {
                start: 'top 92%',
                once: true,
                onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06 }),
            });
            gsap.utils.toArray<HTMLElement>('[data-map-text]').forEach((el) =>
                gsap.fromTo(el, { opacity: 0, filter: 'blur(8px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
            );
            gsap.fromTo('[data-map-full]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '[data-map-full]', start: 'top 85%', once: true } });
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef} className="relative z-10 flex w-full flex-col px-[var(--gutter)] pb-32 md:pb-48" aria-label="Dipercaya oleh">
            <TitleDesc label={TRUSTED.label} text={TRUSTED.text} className="pr-8 md:pr-0" />
            <div className="relative mt-8 grid w-full grid-cols-2 gap-4 md:mt-12 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
                {logos.slice(0, BOXES).map((l, i) => (
                    <LogoBox key={l.name} a={l} b={logos[i + BOXES] ?? l} flip={logos[i + BOXES] ? flip[i] : false} />
                ))}
            </div>

            {/* the whole map, Sabang (top left) to Merauke (bottom right) */}
            <div className="relative mt-24 md:mt-40">
                <Relief seed={7} flip className="-top-[20%] right-[10%] z-0 w-[40vw]" />
                <Relief seed={11} className="-bottom-[20%] left-[20%] z-0 hidden w-[30vw] md:block" />

                <div className="relative z-[1] flex flex-col" data-map-text>
                    <span className="text-[28px] leading-none tracking-tighter text-ink md:text-[48px] xl:text-[64px]">
                        {REACH.from.label} {REACH.from.place}
                    </span>
                    <Coords lat={fromLat} lon={fromLon} />
                </div>

                <div className="relative z-[1] -mx-[calc(var(--gutter)/2)] mt-6 md:mt-8" data-map-full>
                    <FullMap />
                </div>

                <div className="relative z-[1] mt-6 flex flex-col items-end text-right md:mt-8" data-map-text>
                    <span className="text-[28px] leading-none tracking-tighter text-ink md:text-[48px] xl:text-[64px]">
                        {REACH.to.label} {REACH.to.place}
                    </span>
                    <Coords lat={toLat} lon={toLon} />
                </div>
            </div>
        </section>
    );
}
