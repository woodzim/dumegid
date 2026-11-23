'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { SITE, type Project } from '../data/content';
import { ProjectRow } from '../home/WorksList';

gsap.registerPlugin(ScrollTrigger);

/** "+ (About it)" style label used on the case pages (grey #707070, 14px). */
export function CaseLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`flex items-center gap-2 text-[14px] leading-5 text-[#707070] ${className}`}>
            <span className="text-[16px] leading-none">+</span>
            <span className="tracking-tight">({children})</span>
        </div>
    );
}

/** Black strip with a mono, uppercase loop ("NAME OLEH DUMEG — SCROLL KE BAWAH —"). */
export function MonoBand({ text, bg = '#000', color = '#fff' }: { text: string; bg?: string; color?: string }) {
    return (
        <div className="relative z-10 flex w-full overflow-hidden py-2" style={{ background: bg, color }} aria-hidden="true">
            <div className="marquee" style={{ ['--marquee-speed' as string]: '50s' }}>
                {Array.from({ length: 14 }, (_, i) => (
                    <span key={i} className="whitespace-nowrap pr-1 font-mono text-[14px] uppercase leading-5">
                        {text} —{' '}
                    </span>
                ))}
            </div>
        </div>
    );
}

/** Case hero: the project's row with its cover opened full width underneath. */
export function CaseHero({ p }: { p: Project }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('[data-hero-img]', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut', delay: 0.2 });
            gsap.fromTo('[data-hero-img] img', { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'power3.out', delay: 0.2 });
        }, el);
        return () => ctx.revert();
    }, []);
    return (
        <div ref={ref} className="w-full px-[var(--gutter)]">
            <div className="relative">
                <ProjectRow p={p} reveal={false} />
                <div data-hero-img className="pointer-events-none absolute left-1/2 top-[46px] w-screen max-w-none -translate-x-1/2 overflow-hidden px-[var(--gutter)] md:top-[76px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt={p.fullName} fetchPriority="high" className="aspect-[4/6] h-auto w-full object-cover md:aspect-video" />
                </div>
            </div>
            <div className="mt-8 aspect-[4/6] h-auto w-full md:aspect-video" aria-hidden="true" />
        </div>
    );
}

/** Round "drag" cursor that follows the pointer inside its parent. */
function useFollowCursor() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 500, damping: 40 });
    const sy = useSpring(y, { stiffness: 500, damping: 40 });
    const [on, setOn] = useState(false);
    const handlers = {
        onPointerEnter: () => setOn(true),
        onPointerLeave: () => setOn(false),
        onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
            const r = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - r.left);
            y.set(e.clientY - r.top);
        },
    };
    return { sx, sy, on, handlers };
}

// scattered placement of the "Examples & Work" board: left, top, width, height (% of the board)
const SCATTER: [number, number, number, number][] = [
    [6.5, 10, 18, 30], [30.8, 1.2, 22, 32.2], [58, 6, 13, 20], [4.5, 52, 18, 30],
    [20.7, 68.7, 19.5, 28.5], [43.5, 56, 14, 21], [60, 40, 18, 27], [76, 15, 15, 22],
];

/** "Examples & Work": a wide board of frames and accent chips you can drag around. */
export function CaseBoard({ p }: { p: Project }) {
    const boxRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const { sx, sy, on, handlers } = useFollowCursor();
    const [down, setDown] = useState(false);

    useEffect(() => {
        const board = boardRef.current;
        if (!board) return;
        let tx = 0;
        let x = 0;
        let start = 0;
        let base = 0;
        let dragging = false;
        let raf = 0;
        const limits = () => {
            const over = board.offsetWidth - window.innerWidth * 0.8;
            return [-Math.max(0, over), window.innerWidth * 0.08];
        };
        const loop = () => {
            x += (tx - x) * 0.12;
            board.style.transform = `translate3d(${x}px,0,0)`;
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        const downH = (e: PointerEvent) => {
            dragging = true;
            start = e.clientX;
            base = tx;
            board.setPointerCapture(e.pointerId);
        };
        const moveH = (e: PointerEvent) => {
            if (!dragging) return;
            const [min, max] = limits();
            tx = Math.min(max, Math.max(min, base + (e.clientX - start) * 1.2));
        };
        const upH = () => (dragging = false);
        board.addEventListener('pointerdown', downH);
        board.addEventListener('pointermove', moveH);
        window.addEventListener('pointerup', upH);
        return () => {
            cancelAnimationFrame(raf);
            board.removeEventListener('pointerdown', downH);
            board.removeEventListener('pointermove', moveH);
            window.removeEventListener('pointerup', upH);
        };
    }, []);

    const imgs = p.gallery;
    const chips = [p.name, p.client, p.category];
    const items = SCATTER.map((pos, i) => (i % 3 === 2 && chips.length ? { chip: chips[(i / 3) | 0] ?? p.name, pos } : { src: imgs[i % imgs.length], pos }));

    return (
        <div ref={boxRef} className="relative md:cursor-none" {...handlers} onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)}>
            <div ref={boardRef} className="relative z-10 mt-8 aspect-[25/9] w-[200vw] cursor-grab touch-pan-y select-none active:cursor-grabbing md:-mt-[5%] md:ml-[10vw] md:w-[130vw]">
                {items.map((it, i) => {
                    const [left, top, w, h] = it.pos;
                    return (
                        <div
                            key={i}
                            className="absolute isolate overflow-hidden"
                            style={{ left: `${left}%`, top: `${top}%`, width: `${it.chip ? w * 0.55 : w}%`, height: `${it.chip ? h * 0.38 : h}%`, background: it.chip ? p.accent : undefined }}
                        >
                            {it.chip ? (
                                <span className="absolute inset-0 grid place-items-center font-display text-[clamp(12px,1.1vw,22px)] font-black uppercase tracking-[0.06em] text-ink-strong">
                                    {it.chip}
                                </span>
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={it.src} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" />
                            )}
                        </div>
                    );
                })}
            </div>
            <motion.div
                className="pointer-events-none absolute left-0 top-0 z-[100] hidden size-14 items-center justify-center gap-2 rounded-full border border-ink/20 bg-white text-black shadow-[0_0_0_3px_#fff] md:flex"
                style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
                animate={{ opacity: on ? 1 : 0, scale: on ? (down ? 0.85 : 1) : 0.4 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
            >
                <span className="text-[12px]">‹</span>
                <span className="text-[12px]">›</span>
            </motion.div>
        </div>
    );
}

/** Full-screen story: frames advance on a timer (or by tapping a half), progress bars on top. */
export function CaseStory({ p }: { p: Project }) {
    const frames = p.gallery;
    const [i, setI] = useState(0);
    const [t, setT] = useState(0);
    const ref = useRef<HTMLElement>(null);
    const DURATION = 4200;

    useEffect(() => {
        let raf = 0;
        let last = performance.now();
        let acc = 0;
        let visible = false;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        if (ref.current) io.observe(ref.current);
        const loop = (now: number) => {
            const dt = now - last;
            last = now;
            if (visible) {
                acc += dt;
                if (acc >= DURATION) {
                    acc = 0;
                    setI((v) => (v + 1) % frames.length);
                }
                setT(acc / DURATION);
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
        };
    }, [frames.length, i]);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const tw = gsap.fromTo(el, { clipPath: 'inset(8% 8% 8% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true } });
        return () => {
            tw.scrollTrigger?.kill();
            tw.kill();
        };
    }, []);

    const go = (d: number) => {
        setI((v) => (v + d + frames.length) % frames.length);
        setT(0);
    };

    return (
        <section ref={ref} className="relative z-10 h-svh w-full select-none overflow-hidden" aria-label={`Cerita ${p.name}`}>
            {frames.map((src, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src + k} src={src} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700" style={{ opacity: k === i ? 1 : 0 }} />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,transparent_25%,transparent_75%,rgba(0,0,0,0.5))]" />
            <div className="absolute inset-0 z-10 flex">
                <button type="button" aria-label="Sebelumnya" className="h-full w-1/2 cursor-w-resize" onClick={() => go(-1)} />
                <button type="button" aria-label="Berikutnya" className="h-full w-1/2 cursor-e-resize" onClick={() => go(1)} />
            </div>
            <div className="pointer-events-none absolute left-1/2 top-6 z-20 flex w-[calc(100%-3rem)] -translate-x-1/2 flex-col gap-4 md:top-20 md:w-1/2 xl:w-1/5">
                <div className="flex flex-row gap-1">
                    {frames.map((_, k) => (
                        <div key={k} className="h-[2px] flex-1 overflow-hidden rounded-full bg-[#949494]">
                            <div className="h-full bg-[#d3d3d3]" style={{ width: `${k < i ? 100 : k === i ? t * 100 : 0}%` }} />
                        </div>
                    ))}
                </div>
                <div className="flex flex-row items-center gap-2">
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-black">
                        {p.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.logo} alt="" className="h-[50%] w-[60%] object-contain invert" />
                        ) : (
                            <span className="font-display text-[10px] font-bold text-white">D</span>
                        )}
                    </div>
                    <span className="text-[20px] font-light tracking-tight text-white">{p.name}</span>
                </div>
            </div>
            <div className="pointer-events-none absolute bottom-6 left-6 z-20 w-1/2 text-[14px] font-light text-white md:bottom-20 md:left-[35%] md:w-[40%] md:-translate-x-1/2 lg:text-[24px] xl:left-1/2 xl:w-1/5">
                <p>Sistem untuk</p>
                <p>
                    {p.fullName}. <em>({SITE.year})</em>
                </p>
            </div>
            <div className="absolute bottom-6 right-6 z-20 md:bottom-20 md:left-[55%] md:right-auto">
                <Link
                    href={`/contact?proyek=${p.slug}`}
                    className="flex items-center gap-2 bg-white/20 px-4 py-2 font-mono text-[14px] font-medium uppercase text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                    Diskusikan
                    <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor" aria-hidden="true">
                        <polygon points="0,0 9,5.5 0,11" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}

/** Two-column frame grid on the project colour; hovering insets a frame and shows its number. */
export function CaseGrid({ p }: { p: Project }) {
    const imgs = [...p.gallery.slice(1), p.cover].slice(0, 4);
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {imgs.map((src, k) => (
                <div key={src + k} className="group relative aspect-square w-full" style={{ background: p.accent }}>
                    <span className="absolute left-12 top-12 z-10 text-[24px] text-white opacity-0 blur-sm transition-[opacity,filter] duration-300 ease-out group-hover:opacity-100 group-hover:blur-none">
                        {k + 1}
                    </span>
                    <div className="absolute inset-0 z-[5] transition-[padding] duration-300 ease-out group-hover:p-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/** "Video frames": full-screen frames with a NEXT cursor and big frame numbers. */
export function CaseFrames({ p }: { p: Project }) {
    const frames = p.gallery.slice(0, 3);
    const [i, setI] = useState(0);
    const ref = useRef<HTMLElement>(null);
    const { sx, sy, on, handlers } = useFollowCursor();
    return (
        <section
            ref={ref}
            className="relative z-10 aspect-video h-auto w-full cursor-none select-none overflow-hidden md:h-svh"
            {...handlers}
            onClick={() => setI((v) => (v + 1) % frames.length)}
            aria-label="Bingkai sistem"
        >
            <motion.div
                className="pointer-events-none absolute left-0 top-0 z-50 hidden font-mono md:block"
                style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%', background: p.accent }}
                animate={{ opacity: on ? 1 : 0 }}
                aria-hidden="true"
            >
                <div className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium tracking-tight text-ink">
                    LANJUT <span>→</span>
                </div>
            </motion.div>
            <div className="absolute left-6 top-6 z-50 flex flex-row items-center gap-4 text-white md:left-24 md:top-24">
                <span className="size-3" style={{ background: p.accent }} />
                <span className="text-[20px] font-light md:text-[36px]">Bingkai Sistem</span>
            </div>
            <div className="absolute right-6 top-8 z-50 flex flex-row items-center leading-[0.85] text-white md:right-24 md:top-24">
                {frames.map((_, k) => (
                    <span key={k} className="text-6xl transition-colors duration-300 ease-out md:text-[10rem]" style={{ color: k === i ? p.accent : 'white' }}>
                        {k + 1}
                    </span>
                ))}
            </div>
            {frames.map((src, k) => (
                <div key={src + k} className="absolute left-0 top-0 h-full w-full transition-[transform,opacity] duration-500 ease-out" style={{ opacity: k === i ? 1 : 0, transform: k === i ? 'scale(1)' : 'scale(1.1)', zIndex: k === i ? 1 : 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
            ))}
            <div className="absolute inset-0 z-[2] bg-black/25" />
        </section>
    );
}

/**
 * Next project: scrolling fills the next project's row (with a % readout), fans out an
 * echoed word and grows its cover from a thumbnail; at 100% it opens that project.
 */
export function CaseNext({ next }: { next: Project }) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [pct, setPct] = useState(0);
    const fired = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        router.prefetch(`/work/${next.slug}`);
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.4,
                    onUpdate: (self) => {
                        setPct(Math.round(self.progress * 100));
                        if (self.progress > 0.995 && !fired.current) {
                            fired.current = true;
                            router.push(`/work/${next.slug}`);
                        }
                    },
                },
            });
            tl.fromTo('[data-next-bar]', { width: '0%' }, { width: '100%', ease: 'none' }, 0);
            tl.fromTo('[data-next-img]', { scale: 0.1 }, { scale: 1, ease: 'power1.in' }, 0);
            gsap.utils.toArray<HTMLElement>('[data-next-item]').forEach((it, j, all) => {
                tl.fromTo(it, { scale: 1 }, { scale: 1 + (all.length - 1 - j) * 0.09, ease: 'power2.out' }, 0);
            });
        }, el);
        return () => ctx.revert();
    }, [next.slug, router]);

    const word = 'BERIKUTNYA';
    return (
        <div ref={ref} className="relative z-10 h-[200vh] w-full">
            <div className="sticky top-0 h-svh overflow-clip px-[var(--gutter)] pt-40">
                <div className="absolute left-0 top-40 w-full px-[var(--gutter)]">
                    <div className="relative">
                        <span className="absolute -top-5 -ml-5 font-mono text-[14px]">{pct} %</span>
                        <div className="relative">
                            <ProjectRow p={next} reveal={false} />
                            <div data-next-bar className="pointer-events-none absolute left-0 top-0 z-10 h-[46px] mix-blend-multiply" style={{ background: next.accent, width: 0 }} />
                        </div>
                    </div>
                </div>
                <div className="relative z-[1] mt-12 w-full md:mt-20">
                    <svg viewBox="0 -73 1000 76" className="pointer-events-none block w-full opacity-0" aria-hidden="true">
                        <text x="0" y="0" fontSize="100" textLength="1000" lengthAdjust="spacingAndGlyphs" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700 }}>
                            {word}
                        </text>
                    </svg>
                    {Array.from({ length: 6 }, (_, j) => (
                        <div key={j} data-next-item className="absolute inset-x-0 top-0 origin-bottom text-[#d9d9d9]" aria-hidden="true">
                            <svg viewBox="0 -73 1000 76" className="relative z-[1] block w-full">
                                <text x="0" y="0" fontSize="100" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="currentColor" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700 }}>
                                    {word}
                                </text>
                            </svg>
                            <div className="absolute left-1/2 top-[2%] z-0 h-[100%] w-[200vw] -translate-x-1/2 bg-paper md:w-[103%]" />
                        </div>
                    ))}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    data-next-img
                    src={next.cover}
                    alt={next.name}
                    className="absolute left-1/2 top-[13rem] z-10 aspect-[4/6] w-[calc(100%-3rem)] -translate-x-1/2 origin-bottom scale-[0.1] object-cover md:top-[15rem] md:aspect-video md:w-[calc(100%-6rem)]"
                />
            </div>
        </div>
    );
}
