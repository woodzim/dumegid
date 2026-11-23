'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * "+ ( Label )" over a lead paragraph. On entering the viewport the label slides in
 * and the paragraph resolves word by word out of a blur.
 */
export default function TitleDesc({
    label,
    text,
    className = '',
    textClassName = 'max-w-[704px]',
    immediate = false,
    tone = 'dark',
}: {
    label?: string;
    text: string;
    className?: string;
    textClassName?: string;
    /** play on mount instead of on scroll (hero) */
    immediate?: boolean;
    /** light text for use over photos */
    tone?: 'dark' | 'light';
}) {
    const light = tone === 'light';
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                paused: true,
                defaults: { ease: 'power3.out' },
            });
            tl.fromTo('[data-td-label]', { x: 16, opacity: 0, filter: 'blur(4px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 });
            tl.fromTo(
                '[data-td-word]',
                { opacity: 0, filter: 'blur(10px)' },
                { opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.025 },
                0.1,
            );
            if (immediate) tl.delay(0.4).play();
            else ScrollTrigger.create({ trigger: root, start: 'top 85%', once: true, onEnter: () => tl.play() });
        }, root);
        return () => ctx.revert();
    }, [immediate]);

    return (
        <div ref={rootRef} className={`flex flex-col gap-2 md:gap-4 ${light ? 'text-white' : 'text-ink'} ${className}`}>
            {label && (
                <div data-td-label className={`t-label ${light ? 'text-white/85' : ''}`}>
                    ( {label} )
                </div>
            )}
            <p className={`t-lead text-pretty ${light ? 'text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.25)]' : ''} ${textClassName}`}>
                {text.split(' ').map((w, i) => (
                    <span key={i} data-td-word className="inline-block whitespace-pre">
                        {w}{' '}
                    </span>
                ))}
            </p>
        </div>
    );
}

/** Small "Label ......... 2026" header with a rule underneath (Contact / Imagery). */
export function RuleHeader({ left, right = '2026', className = '' }: { left: string; right?: string; className?: string }) {
    return (
        <div className={`relative z-10 flex w-full flex-col gap-2 ${className}`}>
            <div className="flex w-full justify-between text-[16px] leading-6 tracking-tight text-ink">
                <span>{left}</span>
                <span className="tracking-[-0.08em]">{right}</span>
            </div>
            <div className="h-px w-full bg-rule" />
        </div>
    );
}

/** The small arrow used in buttons and rows. */
export function Arrow({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 12 9" className={className} width="12" height="9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M0 4.5h11M7 0.8l3.8 3.7L7 8.2" />
        </svg>
    );
}
