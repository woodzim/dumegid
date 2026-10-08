'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ServiceItem {
    id: string;
    number: string;
    tag: string;
    title: string;
    desc: string;
}

const SERVICES: ServiceItem[] = [
    {
        id: 'end-to-end',
        number: '01',
        tag: 'Full Visibility',
        title: 'End to End Logistik',
        desc: 'Pantau arus peti kemas dan muatan kargo dari hulu ke hilir secara real-time. Hilangkan bottleneck, optimasi kerja lapangan, dan pastikan data operasional kamu konsisten. Bikin closing bulanan jauh lebih cepat dan akurat.',
    },
    {
        id: 'tally-digital',
        number: '02',
        tag: 'Mobile Field',
        title: 'Tally Digital YADRI',
        desc: 'Pencatatan tally peti kemas dan kargo langsung dari tablet di dermaga & lapangan secara real-time, terverifikasi otomatis, dan bebas dari resiko dokumen fisik yang tercecer.',
    },
    {
        id: 'aplikasi-pendukung',
        number: '03',
        tag: 'Yard & Fleet',
        title: 'Aplikasi Pendukung',
        desc: 'Kelola armada truk pengangkut kontainer, izin gerbang (gate pass) otomatis, serta penataan tata letak penumpukan (yard layout) dalam satu ekosistem terpadu.',
    },
    {
        id: 'monitoring-analytics',
        number: '04',
        tag: 'Real-Time Sync',
        title: 'Monitoring & Integrasi',
        desc: 'Sinkronisasi data multi-entitas antar cabang, pelabuhan, dan bea cukai dengan pelaporan instan serta dashboard analitik performa operasional 24/7.',
    },
];

export default function ServicesSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollToCard = useCallback((index: number) => {
        const container = scrollContainerRef.current;
        const target = cardRefs.current[index];
        if (container && target) {
            const scrollLeft = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2);
            container.scrollTo({
                left: Math.max(0, scrollLeft),
                behavior: 'smooth',
            });
        }
    }, []);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => {
            const next = (prev + 1) % SERVICES.length;
            scrollToCard(next);
            return next;
        });
    }, [scrollToCard]);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => {
            const next = (prev - 1 + SERVICES.length) % SERVICES.length;
            scrollToCard(next);
            return next;
        });
    }, [scrollToCard]);

    const handleSelectCard = (index: number) => {
        setActiveIndex(index);
        scrollToCard(index);
    };

    // Auto-advance loop (moves continuously)
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            handleNext();
        }, 3600);
        return () => clearInterval(interval);
    }, [isPaused, handleNext]);

    // Initial scroll sync
    useEffect(() => {
        scrollToCard(activeIndex);
    }, [activeIndex, scrollToCard]);

    return (
        <section id="layanan" className="dmg-section" aria-label="Layanan Unggulan">
            <div className="dmg-container">
                {/* Header Row */}
                <div className="dmg-section-header">
                    <div style={{ maxWidth: 540 }}>
                        <span className="dmg-section-tag">LAYANAN</span>
                        <h2 className="dmg-section-title">
                            Membuka Potensi Penuh Operasional Kamu
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: 14, color: '#cbd8fc', maxWidth: 360, lineHeight: 1.55 }}>
                            Dari multi-cabang sampai multi-perusahaan, kami bikin sistem yang menyambungkan seluruh lini operasional hingga pelaporan kamu.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="dmg-arrow-btn"
                                aria-label="Previous service"
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="dmg-arrow-btn"
                                aria-label="Next service"
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animated Carousel Track */}
                <div
                    className="dmg-services-carousel-wrap"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        ref={scrollContainerRef}
                        className="dmg-services-track no-scrollbar"
                    >
                        {SERVICES.map((item, idx) => {
                            const isActive = idx === activeIndex;

                            return (
                                <div
                                    key={item.id}
                                    ref={(el) => {
                                        cardRefs.current[idx] = el;
                                    }}
                                    onClick={() => handleSelectCard(idx)}
                                    className={`dmg-service-card ${
                                        isActive
                                            ? 'dmg-service-card-active'
                                            : 'dmg-service-card-inactive'
                                    }`}
                                >
                                    {/* Top Metadata */}
                                    <div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: isActive ? 20 : 14,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    letterSpacing: '0.08em',
                                                    color: isActive ? '#3c4eef' : 'rgba(255,255,255,0.7)',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {item.number} • {item.tag}
                                            </span>

                                            {isActive && (
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 6,
                                                        background: 'rgba(60, 78, 239, 0.08)',
                                                        color: '#2739da',
                                                        padding: '4px 10px',
                                                        borderRadius: 9999,
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: 9999,
                                                            background: '#2739da',
                                                            boxShadow: '0 0 6px #2739da',
                                                        }}
                                                    />
                                                    Aktif
                                                </span>
                                            )}
                                        </div>

                                        <h3
                                            style={{
                                                fontSize: isActive ? 25 : 19,
                                                fontWeight: 700,
                                                marginBottom: isActive ? 16 : 12,
                                                color: isActive ? '#0d1428' : '#ffffff',
                                                letterSpacing: '-0.025em',
                                                lineHeight: 1.25,
                                                transition: 'font-size 0.5s ease',
                                            }}
                                        >
                                            {item.title}
                                        </h3>

                                        <p
                                            style={{
                                                fontSize: isActive ? 14 : 13,
                                                lineHeight: 1.62,
                                                color: isActive ? '#4b5563' : '#cbd8fc',
                                                transition: 'color 0.4s ease',
                                            }}
                                        >
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Bottom CTA Button */}
                                    <div style={{ paddingTop: isActive ? 28 : 20 }}>
                                        {isActive ? (
                                            <a
                                                href="#kontak"
                                                className="dmg-btn-pill-black"
                                                style={{ width: '100%', justifyContent: 'space-between' }}
                                            >
                                                <span>Pelajari Solusi Ini</span>
                                                <span
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: 9999,
                                                        background: 'rgba(255,255,255,0.2)',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </span>
                                            </a>
                                        ) : (
                                            <button
                                                type="button"
                                                className="dmg-btn-pill-white"
                                                style={{ padding: '8px 16px', fontSize: 12.5 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectCard(idx);
                                                }}
                                            >
                                                <span>Lihat Detail</span>
                                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Progress Bar & Dot Indicators */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
                        <div className="dmg-service-progress-container">
                            {SERVICES.map((s, idx) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => handleSelectCard(idx)}
                                    aria-label={`Slide ${idx + 1}`}
                                    className={`dmg-service-pill-indicator ${idx === activeIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
