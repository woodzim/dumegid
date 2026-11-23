'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, type Project } from '../data/content';
import { Arrow } from '../TitleDesc';

gsap.registerPlugin(ScrollTrigger);

/**
 * One project row: the big name overlaps a 46px ruled strip that holds
 * (client), category, logo and arrow. Hovering reveals the cover full-width below.
 */
export function ProjectRow({ p, reveal = false, onHover }: { p: Project; reveal?: boolean; onHover?: (p: Project | null) => void }) {
    return (
        <Link
            href={`/work/${p.slug}`}
            onMouseEnter={() => onHover?.(p)}
            onMouseLeave={() => onHover?.(null)}
            className="project-row group relative z-10 block w-full cursor-pointer tracking-tighter"
            data-row
        >
            <span className="absolute left-0 text-[2rem] leading-[0.75] text-ink transition-transform duration-300 ease-out group-hover:translate-x-2 md:text-[3.8rem]">
                {p.name}
            </span>
            <div className="relative flex w-full items-center justify-between overflow-clip border-y border-line">
                <span className="pointer-events-none invisible select-none whitespace-nowrap text-[2rem] leading-[0.75] md:text-[3.5rem]" aria-hidden="true">
                    {p.name}
                </span>
                <div className="relative grid w-1/2 grid-cols-5 items-center whitespace-nowrap text-[14px] leading-5 text-ink transition-transform duration-300 ease-out group-hover:-translate-x-3">
                    <div className="col-span-2 hidden 2xl:block">
                        <span className="text-muted">( {p.client} )</span>
                    </div>
                    <span className="hidden text-muted md:block">{p.category}</span>
                    <div className="relative col-span-5 flex h-11 items-center justify-end gap-2 md:col-span-4 md:justify-center xl:col-span-2">
                        {p.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.logo} alt={`Logo ${p.name}`} className="mr-5 h-6 w-auto max-w-[110px] object-contain grayscale md:mr-0 md:h-11" />
                        ) : (
                            <span className="mr-5 font-display text-[18px] font-bold md:mr-0">{p.client}</span>
                        )}
                        <span className="absolute right-0 flex w-3 min-w-3 items-center justify-center overflow-hidden text-muted">
                            <Arrow className="w-3 transition-transform duration-0 ease-out group-hover:translate-x-[120%] group-hover:duration-200" />
                            <Arrow className="absolute w-3 -translate-x-[120%] transition-transform duration-0 ease-out group-hover:translate-x-0 group-hover:duration-200" />
                        </span>
                    </div>
                </div>
            </div>
            {reveal && (
                <div className="pointer-events-none absolute left-1/2 top-[46px] w-screen max-w-none -translate-x-1/2 px-[var(--gutter)] opacity-0 transition-[opacity,clip-path] duration-500 ease-out [clip-path:inset(0_0_100%_0)] group-hover:opacity-100 group-hover:[clip-path:inset(0_0_0%_0)] md:top-[76px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt="" loading="lazy" className="aspect-[4/6] h-auto w-full object-cover md:aspect-video" />
                </div>
            )}
        </Link>
    );
}

export default function WorksList() {
    const rootRef = useRef<HTMLDivElement>(null);
    const half = Math.ceil(PROJECTS.length / 2);
    // small cover that trails the cursor while a row is hovered
    const [hover, setHover] = useState<Project | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
    const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

    useEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.set('[data-row]', { opacity: 0, filter: 'blur(8px)', y: 16 });
            ScrollTrigger.batch('[data-row]', {
                start: 'top 90%',
                once: true,
                onEnter: (els) => gsap.to(els, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }),
            });
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={rootRef}
            className="relative flex w-full flex-col px-[var(--gutter)] pb-20 pt-32 md:pb-40 md:pt-44"
            onMouseMove={(e) => {
                const r = rootRef.current!.getBoundingClientRect();
                x.set(e.clientX - r.left);
                y.set(e.clientY - r.top);
            }}
        >
            <div className="mt-8 flex w-full flex-col gap-8 xl:flex-row xl:gap-0">
                {[PROJECTS.slice(0, half), PROJECTS.slice(half)].map((col, c) => (
                    <div key={c} className={`flex w-full flex-col gap-8 xl:w-1/2 ${c === 0 ? 'xl:pr-4' : 'xl:pl-4'}`}>
                        {col.map((p) => (
                            <ProjectRow key={p.slug} p={p} onHover={setHover} />
                        ))}
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {hover && (
                    <motion.div
                        key={hover.slug}
                        className="pointer-events-none absolute left-0 top-0 z-30 hidden w-[clamp(240px,18vw,340px)] overflow-hidden md:block"
                        style={{ x: sx, y: sy, translateX: '24px', translateY: '-50%' }}
                        initial={{ opacity: 0, scale: 0.85, clipPath: 'inset(50% 0% 50% 0%)' }}
                        animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={hover.cover} alt="" className="aspect-video w-full bg-ink-strong object-cover" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
