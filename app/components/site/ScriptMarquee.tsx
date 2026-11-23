'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getLenis } from './SmoothScroll';

/**
 * "Works (01) [engraving] By ... —" band: a 115px strip between two hairlines that the
 * huge script word and sans line overflow. Drifts endlessly; scrolling speeds it up.
 */
export default function ScriptMarquee({
    word,
    index,
    image,
    text,
    imageAlt = '',
    wideImage = false,
}: {
    word: string;
    index?: string;
    image?: string;
    text: string;
    imageAlt?: string;
    /** landscape engravings get the wider slot (w-64 md:w-96 in the reference) */
    wideImage?: boolean;
}) {
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let x = 0;
        let boost = 0;
        const tick = (_t: number, dt: number) => {
            const unit = track.firstElementChild as HTMLElement | null;
            if (!unit) return;
            const w = unit.offsetWidth;
            const v = getLenis()?.velocity ?? 0;
            boost += (Math.abs(v) * 0.6 - boost) * 0.1;
            x -= (0.04 + boost * 0.02) * dt;
            if (x <= -w) x += w;
            track.style.transform = `translate3d(${x}px,0,0)`;
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
    }, []);

    const unit = (k: number) => (
        <div key={k} className="flex shrink-0" aria-hidden={k > 0}>
            <div className="relative mt-2 pr-4 font-script text-[128px] leading-none md:mt-5 md:pr-2 md:text-[16rem]">
                {word}
                {index && (
                    <span className="absolute -right-4 top-[26px] font-sans text-[14px] italic leading-5 tracking-tight text-muted md:-right-8 md:top-[21.5%] md:text-[18px] md:leading-7">
                        ( {index} )
                    </span>
                )}
            </div>
            <div className="-mt-1 flex items-center gap-6 whitespace-nowrap px-8 text-[5rem] leading-[1.5] tracking-tight md:-mt-2 md:gap-12 md:px-16 md:text-[10rem]">
                {image && (
                    <div className={`relative flex h-full items-center justify-center ${wideImage ? 'w-64 md:w-96' : 'w-36 md:w-64'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={k === 0 ? imageAlt : ''} className="absolute h-auto w-full" />
                    </div>
                )}
                {text}
                <span className="h-1.5 w-10 bg-ink md:h-2 md:w-16" />
            </div>
        </div>
    );

    return (
        <div className="relative z-10 w-full overflow-x-clip">
            <div className="flex h-[3.7rem] items-center border-y border-line text-ink md:h-[7.2rem]">
                <div ref={trackRef} className="flex will-change-transform">
                    {[0, 1, 2].map(unit)}
                </div>
            </div>
        </div>
    );
}
