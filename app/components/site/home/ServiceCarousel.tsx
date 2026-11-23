'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/free-mode';

/**
 * Draggable 16:9 strip starting at the page gutter, with the reference's round
 * "drag" cursor following the pointer. Client-only: Swiper reads the clock while rendering.
 */
export default function ServiceCarousel({ images }: { images: string[] }) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);
    const [down, setDown] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 500, damping: 40 });
    const sy = useSpring(y, { stiffness: 500, damping: 40 });
    const gutter = typeof window !== 'undefined' && window.innerWidth >= 768 ? 48 : 24;

    return (
        <div
            ref={boxRef}
            className="relative md:cursor-none"
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onPointerDown={() => setDown(true)}
            onPointerUp={() => setDown(false)}
            onPointerMove={(e) => {
                const r = boxRef.current!.getBoundingClientRect();
                x.set(e.clientX - r.left);
                y.set(e.clientY - r.top);
            }}
        >
            <Swiper
                modules={[FreeMode, Mousewheel]}
                slidesPerView={1.15}
                spaceBetween={6}
                slidesOffsetBefore={gutter}
                slidesOffsetAfter={gutter}
                freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6 }}
                mousewheel={{ forceToAxis: true }}
                breakpoints={{ 768: { slidesPerView: 2.32 } }}
                grabCursor={false}
                className="w-full"
            >
                {images.map((src, i) => (
                    <SwiperSlide key={`${src}-${i}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" draggable={false} className="aspect-video h-auto w-full bg-ink-strong object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>
            <motion.div
                className="pointer-events-none absolute left-0 top-0 z-[100] hidden size-14 items-center justify-center gap-2 rounded-full border border-ink/20 bg-white text-black shadow-[0_0_0_3px_#fff] md:flex"
                style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
                animate={{ opacity: hover ? 1 : 0, scale: hover ? (down ? 0.85 : 1) : 0.4 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
            >
                <svg width="7" height="10" viewBox="0 0 7 10" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="M6 1 2 5l4 4" />
                </svg>
                <svg width="7" height="10" viewBox="0 0 7 10" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="m1 1 4 4-4 4" />
                </svg>
            </motion.div>
        </div>
    );
}
