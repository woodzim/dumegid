'use client';

import { useEffect, useRef, useState } from 'react';
import type { SkyLaunchHandle } from './skyLaunch/createSkyLaunch';
import { BAYS, STATIONS } from './skyLaunch/content';
import { TIMELINE, sampleTimeline, segmentStart } from './skyLaunch/timeline';

/**
 * Scroll-driven 3D tour between "Layanan" and "Tim".
 * The camera visits the nine lights around the DUMEG vessel (each shows its
 * website on a convex monitor), flies into the vessel to the four division
 * monitors (HR, Utilitas, Finance, Bisnis), then the vessel and the lights
 * leave and the page continues. three.js and the GLB are only fetched when the
 * section approaches the viewport. Pacing lives in skyLaunch/timeline.ts,
 * content in skyLaunch/content.ts.
 */

const MODEL_URL = '/models/dumeg-skyship.glb';
const TOTAL_VH = TIMELINE.total;
// "#asosiasi" (navbar/footer) lands on the first light of the tour
const ANCHOR_VH = segmentStart('station') - 100 + 5;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
};
const pad = (n: number) => String(n).padStart(2, '0');

interface Caption {
    key: string;
    label: string;
    title: string;
    sub?: string;
    step: number; // index in the 13-step rail, -1 = none
}

const HERO_CAPTION: Caption = {
    key: 'hero',
    label: 'Ekosistem DUMEG',
    title: 'Scroll untuk menjelajah',
    sub: '9 sistem di sekitar pesawat, 4 divisi di dalamnya.',
    step: -1,
};

function stationCaption(i: number): Caption {
    const st = STATIONS[i];
    const group = STATIONS.filter((s) => s.group === st.group);
    const idx = group.indexOf(st);
    return {
        key: `st-${i}`,
        label: `${st.group} · ${pad(idx + 1)} / ${pad(group.length)}`,
        title: st.name,
        sub: st.subtitle,
        step: i,
    };
}

function bayCaption(b: number, a: number): Caption {
    const bay = BAYS[b];
    const app = bay.apps[a];
    return {
        key: `bay-${b}-${a}`,
        label: `Di dalam DUMEG · ${bay.name}`,
        title: app.name,
        sub: bay.apps.length > 1 ? `Aplikasi ${a + 1} dari ${bay.apps.length}` : undefined,
        step: STATIONS.length + b,
    };
}

/** Which caption is on screen at scroll position u (vh), and how visible it is. */
function captionAt(u: number): { cap: Caption | null; opacity: number } {
    const { seg, s } = sampleTimeline(u);
    switch (seg.kind) {
        case 'intro':
            return { cap: HERO_CAPTION, opacity: smooth(0.6, 1, s) };
        case 'hero':
            return { cap: HERO_CAPTION, opacity: 1 - smooth(0.6, 1, s) };
        case 'travel': {
            const k = seg.station!;
            if (s < 0.5) return k === 0 ? { cap: null, opacity: 0 } : { cap: stationCaption(k - 1), opacity: 1 - smooth(0, 0.35, s) };
            return { cap: stationCaption(k), opacity: smooth(0.65, 1, s) };
        }
        case 'station':
            return { cap: stationCaption(seg.station!), opacity: 1 };
        case 'return':
            return { cap: stationCaption(STATIONS.length - 1), opacity: 1 - smooth(0, 0.3, s) };
        case 'enter':
            return { cap: bayCaption(0, 0), opacity: smooth(0.7, 1, s) };
        case 'app':
            return { cap: bayCaption(seg.bay!, seg.app!), opacity: 1 };
        case 'swap':
            return s < 0.5
                ? { cap: bayCaption(seg.bay!, seg.app! - 1), opacity: 1 - smooth(0.1, 0.45, s) }
                : { cap: bayCaption(seg.bay!, seg.app!), opacity: smooth(0.55, 0.9, s) };
        case 'turn': {
            const b = seg.bay!;
            return s < 0.5
                ? { cap: bayCaption(b - 1, BAYS[b - 1].apps.length - 1), opacity: 1 - smooth(0.05, 0.4, s) }
                : { cap: bayCaption(b, 0), opacity: smooth(0.6, 0.95, s) };
        }
        case 'exit': {
            const b = BAYS.length - 1;
            return { cap: bayCaption(b, BAYS[b].apps.length - 1), opacity: 1 - smooth(0, 0.3, s) };
        }
        default:
            return { cap: null, opacity: 0 };
    }
}

const RAIL = [...STATIONS.map((s) => s.name), ...BAYS.map((b) => b.name)];

export default function SkyLaunchTransition() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const topFadeRef = useRef<HTMLDivElement>(null);
    const bottomFadeRef = useRef<HTMLDivElement>(null);
    const captionRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle');
    const [caption, setCaption] = useState<Caption | null>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const canvas = canvasRef.current;
        if (!section || !canvas) return;

        let handle: SkyLaunchHandle | null = null;
        let cancelled = false;
        let loading = false;
        let visible = false;
        let captionKey = '';
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // u = 0 when the section's top enters at the bottom of the viewport,
        // u = TOTAL_VH when its bottom reaches the bottom of the viewport (end of the sticky stage)
        const scrollU = () => {
            const rect = section.getBoundingClientRect();
            return ((window.innerHeight - rect.top) / window.innerHeight) * 100;
        };

        const onScroll = () => {
            const u = scrollU();
            if (topFadeRef.current) topFadeRef.current.style.opacity = String(1 - smooth(40, 95, u));
            if (bottomFadeRef.current) bottomFadeRef.current.style.opacity = String(smooth(TOTAL_VH - 35, TOTAL_VH - 2, u));
            const { cap, opacity } = captionAt(u);
            const key = cap?.key ?? '';
            if (key !== captionKey) {
                captionKey = key;
                setCaption(cap);
            }
            if (captionRef.current) captionRef.current.style.opacity = String(cap ? opacity : 0);
            handle?.setScroll(u);
        };

        const load = async () => {
            if (loading) return;
            loading = true;
            try {
                const { createSkyLaunch } = await import('./skyLaunch/createSkyLaunch');
                if (cancelled) return;
                handle = createSkyLaunch(canvas, {
                    modelUrl: MODEL_URL,
                    reducedMotion,
                    onReady: () => {
                        if (!cancelled) setStatus('ready');
                    },
                    onError: () => {
                        if (!cancelled) setStatus('error');
                    },
                });
                handle.setScroll(scrollU());
                handle.setActive(visible);
            } catch {
                // WebGL unavailable: the static sky backdrop + captions stay in place
                if (!cancelled) setStatus('error');
            }
        };

        // start fetching three.js + the model well before the section is on screen
        const preload = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    load();
                    preload.disconnect();
                }
            },
            { rootMargin: '150% 0px' },
        );
        // only render frames while the stage is actually visible
        const view = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) load();
            handle?.setActive(visible);
        });
        preload.observe(section);
        view.observe(section);

        const resize = new ResizeObserver(() => {
            handle?.resize();
            onScroll();
        });
        resize.observe(canvas);

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            cancelled = true;
            preload.disconnect();
            view.disconnect();
            resize.disconnect();
            window.removeEventListener('scroll', onScroll);
            handle?.dispose();
            handle = null;
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="sl-section"
            style={{ height: `${TOTAL_VH}vh` }}
            aria-label="Ekosistem DUMEG: sistem asosiasi, data center, layanan publik, dan divisi internal"
        >
            <span id="asosiasi" className="sl-anchor" style={{ top: `${ANCHOR_VH}vh` }} aria-hidden="true" />
            <div className={`sl-stage is-${status}`}>
                <canvas ref={canvasRef} className="sl-canvas" aria-hidden="true" />
                <div ref={topFadeRef} className="sl-fade-top" aria-hidden="true" />

                <div ref={captionRef} className="sl-caption" aria-live="polite">
                    {caption && (
                        <>
                            <div className="sl-cap-label dmg-mono">{caption.label}</div>
                            <div className="sl-cap-title">{caption.title}</div>
                            {caption.sub && <div className="sl-cap-sub">{caption.sub}</div>}
                            {caption.step >= 0 && (
                                <ol className="sl-rail" aria-hidden="true">
                                    {RAIL.map((name, i) => (
                                        <li
                                            key={name}
                                            className={`${i === caption.step ? 'is-on' : ''} ${i === STATIONS.length ? 'is-gap' : ''}`}
                                        />
                                    ))}
                                </ol>
                            )}
                        </>
                    )}
                </div>

                <div ref={bottomFadeRef} className="sl-fade-bottom" aria-hidden="true" />
            </div>

            <style>{`
                .sl-section {
                    position: relative;
                    background: var(--dmg-bg);
                }
                .sl-anchor {
                    position: absolute;
                    left: 0;
                    width: 1px;
                    height: 1px;
                    pointer-events: none;
                }
                .sl-stage {
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    height: 100svh;
                    overflow: hidden;
                    background: linear-gradient(to bottom, var(--dmg-accent) 0%, var(--dmg-muted) 45%, var(--dmg-surface) 70%);
                }
                .sl-canvas {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    opacity: 0;
                    transition: opacity 0.8s ease;
                }
                .sl-stage.is-ready .sl-canvas { opacity: 1; }
                .sl-fade-top {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    height: 45%;
                    background: linear-gradient(to bottom, var(--dmg-bg) 0%, transparent 100%);
                    pointer-events: none;
                }
                .sl-fade-bottom {
                    position: absolute;
                    inset: 0;
                    background: var(--dmg-bg);
                    opacity: 0;
                    pointer-events: none;
                }
                .sl-caption {
                    position: absolute;
                    left: var(--dmg-gutter);
                    bottom: clamp(16px, 4vh, 40px);
                    max-width: min(440px, calc(100% - 2 * var(--dmg-gutter)));
                    padding: 18px 22px;
                    border-radius: 18px;
                    background: color-mix(in srgb, var(--dmg-surface) 82%, transparent);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    color: var(--dmg-ink);
                    opacity: 0;
                    pointer-events: none;
                }
                .sl-cap-label {
                    font-size: 11px;
                    color: var(--dmg-ink-soft);
                }
                .sl-cap-title {
                    margin-top: 6px;
                    font-size: clamp(24px, 2.4vw, 34px);
                    font-weight: 700;
                    line-height: 1.05;
                    letter-spacing: -0.01em;
                }
                .sl-cap-sub {
                    margin-top: 8px;
                    font-size: 14px;
                    line-height: 1.45;
                    color: var(--dmg-ink-soft);
                }
                .sl-rail {
                    display: flex;
                    gap: 4px;
                    margin-top: 14px;
                    list-style: none;
                }
                .sl-rail li {
                    width: 14px;
                    height: 3px;
                    border-radius: 2px;
                    background: var(--dmg-muted);
                }
                .sl-rail li.is-gap { margin-left: 10px; }
                .sl-rail li.is-on { background: var(--dmg-ink); }
            `}</style>
        </section>
    );
}
