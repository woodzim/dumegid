'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reel: a 16:9 film that grows from half width to the full gutter-to-gutter width
 * while it scrolls through the viewport. A round cursor toggles play / pause.
 */
export default function Reel({ src, poster }: { src: string; poster?: string }) {
    const boxRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hover, setHover] = useState(false);
    const [playing, setPlaying] = useState(true);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 500, damping: 40 });
    const sy = useSpring(y, { stiffness: 500, damping: 40 });

    useEffect(() => {
        const box = boxRef.current;
        const video = videoRef.current;
        if (!box || !video) return;
        const mq = window.matchMedia('(min-width: 768px)');
        const ctx = gsap.context(() => {
            if (mq.matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.fromTo(video, { scale: 0.5 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'center center', scrub: true } });
            }
        }, box);
        // only decode while visible
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && playing) void video.play().catch(() => {});
            else video.pause();
        });
        io.observe(box);
        return () => {
            ctx.revert();
            io.disconnect();
        };
    }, [playing]);

    const toggle = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            void v.play().catch(() => {});
            setPlaying(true);
        } else {
            v.pause();
            setPlaying(false);
        }
    };

    return (
        <div ref={boxRef} className="relative z-10 mt-12 flex w-full items-center justify-center px-[var(--gutter)] md:mt-0">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                preload="metadata"
                onClick={toggle}
                onPointerEnter={() => setHover(true)}
                onPointerLeave={() => setHover(false)}
                onPointerMove={(e) => {
                    const r = boxRef.current!.getBoundingClientRect();
                    x.set(e.clientX - r.left);
                    y.set(e.clientY - r.top);
                }}
                className="z-0 aspect-video h-auto w-full origin-top object-cover md:scale-50 md:cursor-none"
                aria-label="Cuplikan operasional pelabuhan"
            />
            <motion.div
                className="pointer-events-none absolute left-0 top-0 z-[100] hidden size-10 items-center justify-center rounded-full border border-ink/20 bg-white text-ink shadow-[0_0_0_3px_#fff] md:flex"
                style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
                animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.4 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
            >
                {playing ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <rect x="2" y="1.5" width="2.6" height="9" />
                        <rect x="7.4" y="1.5" width="2.6" height="9" />
                    </svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M3 1.5v9l7.5-4.5z" />
                    </svg>
                )}
            </motion.div>
        </div>
    );
}
