'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HeroSlide {
    id: number;
    giantText: string;
    tag: string;
    title: string;
    desc: string;
}

const SLIDES: HeroSlide[] = [
    {
        id: 1,
        giantText: 'DUMEG DIGITAL.',
        tag: '— Solusi Logistik Modern',
        title: 'Solusi Digital untuk Maritim, Pelabuhan & Logistik',
        desc: 'Dari multi-cabang sampai multi-perusahaan — kami bikin operasional kamu rapi, akurat, dan transparan. Nggak pakai ribet.',
    },
    {
        id: 2,
        giantText: 'MOVE BEYOND.',
        tag: '— Efisiensi Maksimal',
        title: 'Satu Input, Satu Data, Banyak Proses Terpadu',
        desc: 'Hilangkan bottleneck lapangan dengan pencatatan tally digital dan sinkronisasi otomatis antar-dermaga.',
    },
    {
        id: 3,
        giantText: 'CONNECT STRONG.',
        tag: '— 9 Miliar Data Diolah',
        title: 'Infrastruktur Andal untuk Ekosistem Pelabuhan',
        desc: 'Dipercaya 30+ aplikasi maritim dan 6 industri terkemuka untuk keandalan data operasional tanpa henti.',
    },
];

export default function HeroSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    }, []);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, []);

    // Keyboard navigation support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext]);

    const currentSlide = SLIDES[activeIndex];

    return (
        <section className="dmg-hero-ref" aria-label="DUMEG Hero Showcase">
            {/* Layer 1: Background Sky with Clouds */}
            <div className="dmg-hero-bg-layer">
                <Image
                    src="/images/sky_bg.jpg"
                    alt="Atmospheric Sky"
                    fill
                    priority
                    sizes="100vw"
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center center',
                    }}
                />
            </div>

            {/* Layer 2: Giant Typography Layer (Behind Crew Heads & Torso) */}
            <div className="dmg-hero-text-layer">
                <h1
                    key={currentSlide.giantText}
                    className="dmg-hero-giant-title"
                >
                    {currentSlide.giantText}
                </h1>
            </div>

            {/* Layer 3: Foreground DUMEG Crew Cutout (Pops in front of Giant Text) */}
            <div className="dmg-hero-cutout-layer">
                <div className="dmg-hero-model-wrap">
                    <Image
                        src="/images/model_dumeg_v2.png"
                        alt="DUMEG Modern Team & Engineers"
                        fill
                        priority
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 1400px"
                        style={{
                            objectFit: 'contain',
                            objectPosition: 'center bottom',
                        }}
                    />
                </div>
            </div>

            {/* Layer 4: Clean bottom transition to white base */}
            <div className="dmg-hero-bottom-transition" />

            {/* Layer 5: Floating Frosted Glass Card & Navigation Controls */}
            <div className="dmg-hero-card-layer">
                <div className="dmg-hero-floating-card">
                    <div className="dmg-hero-tag">
                        {currentSlide.tag}
                    </div>

                    <h2 className="dmg-hero-card-heading">
                        {currentSlide.title}
                    </h2>

                    <p className="dmg-hero-card-desc">
                        {currentSlide.desc}
                    </p>

                    {/* Navigation Buttons Row */}
                    <div className="dmg-hero-nav-row">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="dmg-hero-nav-btn"
                            aria-label="Previous slide"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="dmg-hero-nav-btn"
                            aria-label="Next slide"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </button>

                        <span className="dmg-hero-indicator">
                            0{activeIndex + 1} / 0{SLIDES.length}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
