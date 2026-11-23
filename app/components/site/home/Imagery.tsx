'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMAGERY } from '../data/content';
import TitleDesc, { RuleHeader } from '../TitleDesc';

gsap.registerPlugin(ScrollTrigger);

// frame widths (vw) per row, as in the reference showcase: small, large, medium, small
const ROW_1 = ['w-[32.2vw] md:w-[22.2vw]', 'w-[47.2vw] md:w-[37.2vw]', 'w-[35.6vw] md:w-[25.6vw]', 'w-[32.2vw] md:w-[22.2vw]'];
const ROW_2 = ['w-[32.2vw] md:w-[22.2vw]', 'w-[35.6vw] md:w-[25.6vw]', 'w-[47.2vw] md:w-[37.2vw]', 'w-[32.2vw] md:w-[22.2vw]'];

/** "Imagery": lead line, then two rows of 16:9 frames sliding against each other on scroll. */
export default function Imagery() {
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            const st = { trigger: '[data-showcase]', start: 'top bottom', end: 'bottom top', scrub: true };
            gsap.fromTo('[data-row-1]', { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: st });
            gsap.fromTo('[data-row-2]', { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: st });
            gsap.fromTo('[data-showcase] img', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.05, scrollTrigger: { trigger: '[data-showcase]', start: 'top 85%', once: true } });
        }, root);
        return () => ctx.revert();
    }, []);

    const imgs = IMAGERY.images;

    return (
        <section ref={rootRef} className="relative z-10 mt-12 flex w-full flex-col md:mt-24" aria-label={IMAGERY.label}>
            <div className="flex flex-col px-[var(--gutter)]">
                <RuleHeader left={IMAGERY.label} />
                <TitleDesc text={IMAGERY.text} className="mt-8 md:mt-12" textClassName="max-w-[620px]" />
            </div>
            <div data-showcase className="mt-32 flex scale-[1.7] flex-col items-center gap-[1.5vw] overflow-x-hidden md:mt-24 md:scale-100">
                <div data-row-1 className="flex flex-row items-end gap-[1.5vw]">
                    {ROW_1.map((w, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={imgs[i]} alt="" loading="lazy" className={`${w} aspect-video shrink-0 bg-ink-strong object-cover`} />
                    ))}
                </div>
                <div data-row-2 className="flex w-full flex-row items-start justify-end gap-[1.5vw]">
                    {ROW_2.map((w, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={imgs[i + 4]} alt="" loading="lazy" className={`${w} aspect-video shrink-0 bg-ink-strong object-cover`} />
                    ))}
                </div>
            </div>
        </section>
    );
}
