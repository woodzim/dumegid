'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO, SITE } from '../data/content';
import TitleDesc from '../TitleDesc';
import { Wordmark } from '../SiteFooter';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero: sky backdrop, the DUMEG wordmark across the top, and the crew photo standing
 * in front of it. On scroll the wordmark drifts slower than the photo.
 */
export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.fromTo('[data-hero-mark]', { yPercent: 12, opacity: 0, filter: 'blur(12px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out', delay: 0.15 });
            gsap.fromTo('[data-hero-crew]', { yPercent: 6, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.35 });
            gsap.to('[data-hero-mark-inner]', { yPercent: 35, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } });
        }, section);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative flex h-svh w-full items-end overflow-hidden px-[var(--gutter)] pb-6 md:h-screen md:pb-12">
            <h1 className="sr-only">
                {SITE.name}: {SITE.tagline}
            </h1>
            {/* sky backdrop */}
            <Image src="/images/sky_bg.jpg" alt="" fill sizes="100vw" fetchPriority="high" className="z-0 object-cover" />
            {/* DUMEG / Duta Meta Graha across the top, behind the crew */}
            <div data-hero-mark className="pointer-events-none absolute inset-x-0 top-[96px] z-[1] md:top-[7vh]" aria-hidden="true">
                <div data-hero-mark-inner>
                    {/* half-white letters over the sky; the script in the logo's navy so it reads over both */}
                    <Wordmark ink="#ffffff" inkOpacity={0.5} script="#0b2462" scriptOpacity={0.85} />
                </div>
            </div>
            {/* the DUMEG crew, full bleed, in front of the wordmark */}
            <div data-hero-crew className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] z-[2] md:top-0">
                <Image src="/images/model_dumeg_v2.png" alt="Tim DUMEG berseragam biru" fill sizes="100vw" fetchPriority="high" className="object-cover object-bottom" />
            </div>
            {/* soft shade so the white lead reads over the uniforms */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[55%] bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            <TitleDesc label={HERO.label} text={HERO.text} immediate tone="light" className="relative z-20" textClassName="max-w-[560px] md:max-w-[620px]" />
        </section>
    );
}
