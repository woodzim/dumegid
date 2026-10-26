'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Asterisk, CircleButton, Marks, Notch, SectionHead } from './DmgKit';

interface ServiceItem {
    id: string;
    number: string;
    tag: string;
    title: string;
    desc: string;
    tags: string[];
}

const SERVICES: ServiceItem[] = [
    {
        id: 'end-to-end',
        number: '01',
        tag: 'Full Visibility',
        title: 'End to End Logistik',
        desc: 'Pantau arus peti kemas dan muatan kargo dari hulu ke hilir secara real-time. Hilangkan bottleneck, optimasi kerja lapangan, dan pastikan data operasional kamu konsisten. Bikin closing bulanan jauh lebih cepat dan akurat.',
        tags: ['Real-time', 'Peti kemas', 'Kargo', 'Closing bulanan'],
    },
    {
        id: 'tally-digital',
        number: '02',
        tag: 'Mobile Field',
        title: 'Tally Digital YADRI',
        desc: 'Pencatatan tally peti kemas dan kargo langsung dari tablet di dermaga & lapangan secara real-time, terverifikasi otomatis, dan bebas dari resiko dokumen fisik yang tercecer.',
        tags: ['Tablet', 'Dermaga', 'Verifikasi otomatis', 'Paperless'],
    },
    {
        id: 'aplikasi-pendukung',
        number: '03',
        tag: 'Yard & Fleet',
        title: 'Aplikasi Pendukung',
        desc: 'Kelola armada truk pengangkut kontainer, izin gerbang (gate pass) otomatis, serta penataan tata letak penumpukan (yard layout) dalam satu ekosistem terpadu.',
        tags: ['Armada truk', 'Gate pass', 'Yard layout'],
    },
    {
        id: 'monitoring-analytics',
        number: '04',
        tag: 'Real-Time Sync',
        title: 'Monitoring & Integrasi',
        desc: 'Sinkronisasi data multi-entitas antar cabang, pelabuhan, dan bea cukai dengan pelaporan instan serta dashboard analitik performa operasional 24/7.',
        tags: ['Multi-entitas', 'Bea cukai', 'Dashboard 24/7'],
    },
];

// Auto-advance interval; drives the timeline progress fill.
const ADVANCE_MS = 5000;

export default function ServicesSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    }, []);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
    }, []);

    const active = SERVICES[activeIndex];

    return (
        <section id="layanan" className="dmg-section" aria-label="Layanan Unggulan">
            <div className="dmg-container">
                <SectionHead
                    index="02"
                    label="Layanan"
                    title={
                        <>
                            Membuka potensi
                            <Marks />
                            <br />
                            operasional kamu
                        </>
                    }
                    aside={
                        <p>
                            Dari multi-cabang sampai multi-perusahaan, kami bikin sistem yang menyambungkan seluruh lini operasional hingga pelaporan kamu.
                        </p>
                    }
                />

                <div
                    className="dmg-panel sv-panel"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Left rail: intro card, timeline, tags */}
                    <div className="sv-rail">
                        <div className="sv-intro">
                            <div className="sv-thumb">
                                <Image
                                    src="/images/model/model_2.jpg"
                                    alt="Engineer DUMEG"
                                    fill
                                    sizes="96px"
                                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                                />
                            </div>
                            <div className="sv-intro-body">
                                <p>Satu input, satu data, banyak proses terpadu untuk operasional pelabuhan kamu.</p>
                                <a href="#kontak" className="dmg-btn">
                                    <span className="dmg-btn-label">Diskusi</span>
                                    <span className="dmg-btn-icon" aria-hidden="true">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M7 17L17 7M8 7h9v9" />
                                        </svg>
                                    </span>
                                </a>
                            </div>
                        </div>

                        <ol className="sv-timeline">
                            {SERVICES.map((item, idx) => {
                                const isActive = idx === activeIndex;
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            className={`sv-step ${isActive ? 'is-active' : ''}`}
                                            onClick={() => setActiveIndex(idx)}
                                            aria-current={isActive ? 'step' : undefined}
                                        >
                                            <span className="sv-step-marker" aria-hidden="true">
                                                <span className="sv-step-dot" />
                                                <span className="sv-step-track">
                                                    {isActive && (
                                                        <span
                                                            key={item.id}
                                                            className="sv-step-fill"
                                                            style={{
                                                                animationDuration: `${ADVANCE_MS}ms`,
                                                                animationPlayState: isPaused ? 'paused' : 'running',
                                                            }}
                                                            onAnimationEnd={handleNext}
                                                        />
                                                    )}
                                                </span>
                                            </span>
                                            <span className="sv-step-text">
                                                <span className="dmg-mono sv-step-title">
                                                    {item.number} / {item.title}
                                                </span>
                                                <span className="dmg-label">{item.tag}</span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>

                        <div>
                            <div className="dmg-pill-row" key={active.id}>
                                {active.tags.map((t, i) => (
                                    <span key={t} className={`dmg-pill dmg-fade-in ${i === 0 ? 'dmg-pill-dark' : ''}`}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <p className="dmg-mono sv-rail-note">
                                Sistem yang menyambungkan lapangan, kantor, dan pelaporan dalam satu alur.
                            </p>
                        </div>
                    </div>

                    {/* Stage: active service */}
                    <div className="dmg-card dmg-card-dark sv-stage">
                        <div className="sv-stage-top">
                            <span className="dmg-pill dmg-pill-ghost">
                                {active.number} / {active.tag}
                            </span>
                            <div className="sv-stage-nav">
                                <CircleButton onClick={handlePrev} label="Layanan sebelumnya" direction="prev" tone="light" />
                                <CircleButton onClick={handleNext} label="Layanan berikutnya" direction="next" tone="light" />
                            </div>
                        </div>

                        <div key={active.id} className="sv-stage-body dmg-fade-in">
                            <div className="dmg-num sv-stage-num" aria-hidden="true">
                                {active.number}
                            </div>
                            <h3 className="sv-stage-title">{active.title}</h3>
                            <p className="sv-stage-desc">{active.desc}</p>
                        </div>

                        <div className="dmg-mono sv-stage-foot">
                            {SERVICES.length} layanan <Asterisk size={12} />
                        </div>

                        <Notch corner="bl" className="sv-stage-notch">
                            <a href="#kontak" className="dmg-btn">
                                <span className="dmg-btn-label">Pelajari solusi ini</span>
                                <span className="dmg-btn-icon" aria-hidden="true">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </span>
                            </a>
                        </Notch>
                    </div>
                </div>
            </div>

            <style>{`
                .sv-panel {
                    display: grid;
                    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
                    gap: 24px;
                }
                .sv-rail {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 32px;
                    padding: 8px;
                }
                .sv-intro {
                    display: flex;
                    gap: 16px;
                    padding: 12px;
                    border-radius: 20px;
                    background: var(--dmg-bg);
                }
                .sv-thumb {
                    position: relative;
                    flex: none;
                    width: 96px;
                    height: 112px;
                    border-radius: 12px;
                    overflow: hidden;
                    background: var(--dmg-dark);
                }
                .sv-intro-body {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 12px;
                }
                .sv-intro-body p {
                    font-size: 13px;
                    line-height: 1.45;
                    color: var(--dmg-ink);
                }

                .sv-timeline { list-style: none; }
                .sv-step {
                    display: flex;
                    gap: 16px;
                    width: 100%;
                    padding: 0;
                    background: none;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                    color: var(--dmg-ink-mute);
                    transition: color 0.2s ease;
                }
                .sv-step:hover, .sv-step.is-active { color: var(--dmg-ink); }
                .sv-step:focus-visible { outline: 2px solid var(--dmg-accent); outline-offset: 4px; border-radius: 8px; }
                .sv-step-marker {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: none;
                    width: 12px;
                }
                .sv-step-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 9999px;
                    background: var(--dmg-muted);
                    margin-top: 4px;
                    transition: background 0.2s ease;
                }
                .sv-step.is-active .sv-step-dot { background: var(--dmg-ink); }
                .sv-step-track {
                    position: relative;
                    width: 4px;
                    flex: 1;
                    min-height: 40px;
                    margin: 4px 0;
                    border-radius: 4px;
                    background: var(--dmg-muted);
                    overflow: hidden;
                }
                .sv-timeline li:last-child .sv-step-track { min-height: 32px; }
                .sv-step-fill {
                    position: absolute;
                    inset: 0;
                    background: var(--dmg-accent);
                    transform-origin: top;
                    animation-name: sv-progress;
                    animation-timing-function: linear;
                    animation-fill-mode: both;
                }
                @keyframes sv-progress {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                .sv-step-text {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding-bottom: 16px;
                }
                .sv-step-title { font-size: 12px; }
                .sv-step:not(.is-active) .dmg-label { color: var(--dmg-ink-mute); }
                .sv-rail-note {
                    font-size: 10.5px;
                    line-height: 1.7;
                    margin-top: 20px;
                    max-width: 320px;
                }

                .sv-stage {
                    --notch-bg: var(--dmg-surface);
                    display: flex;
                    flex-direction: column;
                    min-height: 600px;
                    padding: 28px;
                    overflow: hidden;
                }
                .sv-stage-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                }
                .sv-stage-nav { display: flex; gap: 8px; }
                .sv-stage-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding-bottom: 88px;
                }
                .sv-stage-num {
                    align-self: flex-end;
                    font-size: clamp(120px, 15vw, 220px);
                    color: var(--dmg-accent);
                    margin-bottom: auto;
                    padding-top: 16px;
                }
                .sv-stage-title {
                    font-family: var(--font-main);
                    font-size: clamp(32px, 3.6vw, 56px);
                    font-weight: 400;
                    line-height: 0.98;
                    letter-spacing: -0.04em;
                    margin-top: 24px;
                }
                .sv-stage-desc {
                    font-size: 14.5px;
                    line-height: 1.6;
                    color: var(--dmg-on-dark-soft);
                    margin-top: 16px;
                    max-width: 520px;
                }
                .sv-stage-foot {
                    position: absolute;
                    right: 28px;
                    bottom: 28px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 10px;
                    color: var(--dmg-on-dark-soft);
                }
                .sv-stage-notch { padding: 16px 20px 0 0; --notch-r: 24px; }

                @media (max-width: 900px) {
                    .sv-panel { grid-template-columns: 1fr; padding: 16px; }
                    .sv-stage { min-height: 520px; }
                }
                @media (max-width: 520px) {
                    .sv-stage { padding: 20px; }
                    .sv-stage-foot { display: none; }
                    .sv-stage-notch .dmg-btn-label { padding: 0 16px; }
                }
            `}</style>
        </section>
    );
}
