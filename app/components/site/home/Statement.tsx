'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BIG = 'text-5xl md:text-9xl xl:text-[13.5rem] tracking-[-0.05em] font-bold';

/** Big word whose letters roll over on hover (each letter has a twin waiting below). */
function Rolling({ text }: { text: string }) {
    return (
        <span data-q className={`${BIG} group/roll inline-flex leading-[1.6] md:leading-[1.2]`} aria-label={text}>
            {text.split('').map((ch, i) =>
                ch === ' ' ? (
                    <span key={i} className="inline-block w-[0.22em]" />
                ) : (
                    <span key={i} className="relative inline-flex overflow-hidden leading-[0.8]" aria-hidden="true">
                        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/roll:-translate-y-full" style={{ transitionDelay: `${i * 18}ms` }}>
                            {ch}
                        </span>
                        <span className="absolute left-0 top-0 inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/roll:translate-y-0" style={{ transitionDelay: `${i * 18}ms` }}>
                            {ch}
                        </span>
                    </span>
                ),
            )}
        </span>
    );
}

/** "Satu input, satu data, banyak proses tanpa hambatan" in the reference's quote layout. */
export default function Statement() {
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>('[data-line]').forEach((line, i) => {
                gsap.fromTo(
                    line.querySelectorAll('[data-q]'),
                    { yPercent: 110 },
                    { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.08, delay: i * 0.12, scrollTrigger: { trigger: root, start: 'top 70%', once: true } },
                );
            });
            gsap.utils.toArray<HTMLElement>('[data-angel]').forEach((img, i) => {
                gsap.fromTo(img, { filter: 'blur(8px)', opacity: 0, scale: 0.9 }, { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 1.2, delay: 0.4 + i * 0.2, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 70%', once: true } });
                gsap.to(img, { yPercent: i ? -12 : 12, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
            });
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef} className="relative z-10 flex w-full flex-col items-center px-[var(--gutter)] md:py-24" aria-label="Satu input, satu data, banyak proses tanpa hambatan">
            <div className="relative flex w-fit max-w-[95rem] flex-col whitespace-nowrap leading-none text-ink md:w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    data-angel
                    src="/images/engravings/rocket.png"
                    alt=""
                    className="absolute left-[-25%] top-[-12%] z-10 w-44 -rotate-[1.6deg] md:bottom-[14%] md:left-auto md:right-[-5%] md:top-auto md:w-64 md:rotate-0"
                />

                <div data-line className="flex w-full flex-row items-end justify-center gap-2 overflow-clip md:gap-3">
                    <Rolling text="SATU INPUT" />
                    <div data-q className="absolute right-0 top-0 mb-5 flex flex-row items-end gap-4 md:relative md:mb-[26px] md:ml-1 md:gap-7 xl:mb-11">
                        <span className="font-editorial text-[16px] italic leading-none tracking-tighter md:text-[36px] xl:text-[60px]">SATU DATA</span>
                        <span className="-mb-[2.5%] -ml-[5%] font-script text-[18px] lowercase leading-none md:text-[30px] xl:text-[48px]">satu sumber</span>
                    </div>
                </div>

                <div data-line className="z-0 -ml-4 mt-1 flex w-full flex-row items-end justify-start gap-3 overflow-clip md:mt-3">
                    <span data-q className="-mr-4 block font-editorial text-[20px] md:mb-3 md:text-[48px] xl:-mr-10 xl:mb-6">
                        lalu
                    </span>
                    <Rolling text="BANYAK" />
                </div>

                <div data-line className="mt-1 flex w-full flex-row items-end justify-end gap-2 overflow-clip md:mt-3 md:gap-3">
                    <Rolling text="PROSES" />
                    <div className="relative flex flex-col">
                        <span data-q className="mb-1 -ml-1 text-[20px] font-bold lowercase tracking-tighter md:mb-2 md:ml-0 md:text-[3.5rem] xl:mb-5">
                            tanpa hambatan
                        </span>
                    </div>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    data-angel
                    src="/images/engravings/dolphin.png"
                    alt=""
                    className="absolute right-[-25%] top-[3%] w-44 rotate-[-7deg] md:left-[-7%] md:right-auto md:top-[-35%] md:w-64 md:rotate-0 xl:top-0"
                />
            </div>
        </section>
    );
}
