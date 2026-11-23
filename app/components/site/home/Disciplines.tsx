'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES, type Service } from '../data/content';
import { Arrow } from '../TitleDesc';

gsap.registerPlugin(ScrollTrigger);

const ServiceCarousel = dynamic(() => import('./ServiceCarousel'), { ssr: false });

/** Full-width coloured strip with a looping call to action (links to the contact page). */
export function ColorBand({ color, text, href = '/contact' }: { color: string; text: string; href?: string }) {
    const chunk = `${text} — `;
    return (
        <Link href={href} className="block w-full transition-transform duration-300 ease-out hover:scale-[1.02]" aria-label={text}>
            <div className="flex w-full overflow-hidden py-2" style={{ background: color }} aria-hidden="true">
                <div className="marquee" style={{ ['--marquee-speed' as string]: '60s' }}>
                    {Array.from({ length: 16 }, (_, i) => (
                        <span key={i} className="whitespace-nowrap pr-1 text-[14px] uppercase leading-5 text-black">
                            {chunk}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}

/** Script numeral drawn as an outline, then filled (the reference animates an SVG path). */
function Numeral({ n }: { n: number }) {
    return (
        <svg viewBox="0 0 176 177" className="w-24 overflow-visible md:w-44" aria-hidden="true">
            <text
                data-num
                x="6"
                y="168"
                className="font-script"
                fontSize="230"
                fill="transparent"
                stroke="#434343"
                strokeWidth="1.2"
                style={{ strokeDasharray: 1400, strokeDashoffset: 1400 }}
            >
                {n}
            </text>
        </svg>
    );
}

function ServiceBlock({ svc }: { svc: Service }) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = gsap.context(() => {
            if (reduced) {
                gsap.set('[data-num]', { strokeDashoffset: 0, fill: '#434343' });
                return;
            }
            const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 85%', once: true } });
            tl.fromTo('[data-svc-line]', { width: 0 }, { width: '100%', duration: 1.2, ease: 'power3.inOut', stagger: 0.04 }, 0)
                .fromTo('[data-svc-text]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.04 }, 0.15)
                .to('[data-num]', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.1)
                .to('[data-num]', { fill: '#434343', duration: 0.6 }, 0.25)
                .fromTo('[data-svc-scene]', { opacity: 0, y: 24, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' }, 0.2); // filled almost at once, the outline keeps drawing over it
            gsap.fromTo(
                '[data-svc-anim]',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: root.querySelector('[data-examples]'), start: 'top 80%', once: true } },
            );
        }, root);
        return () => ctx.revert();
    }, []);

    return (
        <article ref={ref} className="flex w-full flex-col pt-12" aria-labelledby={`svc-${svc.id}`}>
            <div className="relative mt-12 grid w-full grid-cols-2 px-[var(--gutter)] tracking-tight text-ink">
                <span data-svc-text className="hidden text-[16px] leading-6 md:block">
                    Nomor
                </span>
                <span data-svc-text className="hidden text-[16px] leading-6 md:block">
                    Layanan
                </span>
                <div className="col-span-2 flex w-full items-end justify-between md:hidden">
                    <div className="t-label">( {svc.category} )</div>
                    <span className="block size-5 rounded-full" style={{ background: svc.color }} />
                </div>
                <div data-svc-line className="col-span-2 mb-12 mt-2 h-px w-full bg-rule md:mb-24" />
                {svc.driving && (
                    // a truck driving past on a thin road line level with the numeral's foot, then coming round again
                    <div
                        className="pointer-events-none absolute left-[calc(var(--gutter)+13rem)] right-1/2 top-[75px] z-0 hidden h-[230px] overflow-hidden [container-type:inline-size] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] md:block"
                        aria-hidden="true"
                    >
                        <div className="absolute inset-x-0 bottom-[3px] h-px bg-rule" />
                        <div className="truck-drive absolute bottom-0 left-0 w-[clamp(240px,21vw,380px)]">
                            <div className="truck-bob">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={svc.driving} alt="" loading="lazy" className="block h-auto w-full" />
                            </div>
                        </div>
                    </div>
                )}
                {svc.scene && (
                    // engraved still life beside the numeral (people at work)
                    <div className="pointer-events-none absolute left-[calc(var(--gutter)+13rem)] top-[56px] z-0 hidden w-[clamp(280px,23vw,440px)] md:block" aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img data-svc-scene src={svc.scene} alt="" loading="lazy" className="block h-auto w-full" />
                    </div>
                )}
                {svc.hanging && (
                    // container on a crane hook: the rope starts at the rule, the load swings gently
                    <div className="pointer-events-none absolute left-[calc(var(--gutter)+15rem)] top-[32px] z-0 hidden w-[clamp(170px,13vw,250px)] md:block" aria-hidden="true">
                        <div className="hang-swing origin-top">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={svc.hanging} alt="" loading="lazy" className="block h-auto w-full" />
                        </div>
                    </div>
                )}

                <div className="col-span-2 flex w-full flex-row items-end justify-between gap-16 md:col-span-1 md:items-start md:gap-0">
                    <Numeral n={svc.number} />
                    <h3 className="text-right text-[30px] leading-none md:hidden">{svc.title}</h3>
                </div>

                <div className="relative col-span-2 flex flex-col gap-6 pb-12 md:col-span-1 md:pb-24">
                    <div data-svc-text className="t-label hidden md:flex">
                        ( {svc.category} )
                    </div>
                    <div data-svc-text className="z-[1] hidden items-center gap-2 md:flex">
                        <span className="block size-5 rounded-full" style={{ background: svc.color }} />
                        <span id={`svc-${svc.id}`} className="text-[30px] leading-9">
                            {svc.title}
                        </span>
                    </div>
                    <dl className="z-[1] mt-6 flex w-full flex-col md:mt-0">
                        {svc.rows.map(([k, v]) => (
                            <div key={k}>
                                <div data-svc-line className="h-px w-full bg-rule" />
                                <div data-svc-text className="flex w-full items-center justify-between gap-2 py-1 text-[14px] leading-6 md:text-[16px]">
                                    <dt>{k}</dt>
                                    <dd className="text-right text-muted">{v}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                    <div data-svc-text className="z-[1]">
                        <Link href={`/contact?layanan=${svc.id}`} className="btn-ink">
                            Pelajari Lebih Lanjut <Arrow className="btn-arrow w-2" />
                        </Link>
                    </div>
                </div>
            </div>

            <div data-examples className="flex w-full flex-col py-12 text-ink md:py-24">
                <div data-svc-anim className="t-label ml-[var(--gutter)]">
                    ( Tentang &amp; Contoh )
                </div>
                <p data-svc-anim className="ml-[var(--gutter)] mt-4 w-[calc(100%-2rem)] text-pretty text-[20px] leading-none tracking-tight md:w-1/2 md:text-[30px] xl:w-1/3">
                    {svc.about}
                </p>
                <div data-svc-anim className="mt-6 w-full md:mt-12">
                    <ServiceCarousel images={svc.images} />
                </div>
            </div>

            <ColorBand color={svc.color} text={`Pelajari lebih lanjut tentang ${svc.title} — Mari bekerja sama`} href={`/contact?layanan=${svc.id}`} />
        </article>
    );
}

export default function Disciplines() {
    return (
        <div className="relative z-10 flex w-full flex-col pb-20 pt-14 md:pt-36">
            {SERVICES.map((svc) => (
                <ServiceBlock key={svc.id} svc={svc} />
            ))}
        </div>
    );
}
