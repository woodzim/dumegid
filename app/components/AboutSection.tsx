'use client';
import { useState, useEffect, useRef } from 'react';
import VariableProximity from './VariableProximity';

function useCounter(target: number, duration = 1400) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) { return; }
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
            { threshold: 0.3 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) { return; }
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) { start = ts; }
            const p = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(p * target));
            if (p < 1) { requestAnimationFrame(step); }
        };
        requestAnimationFrame(step);
    }, [started, target, duration]);

    return { count, ref };
}

const MINI_STATS = [
    { value: 2023, suffix: '', label: 'Didirikan' },
    { value: 20, suffix: '+', label: 'Sistem Digital Operasional' },
    { value: 25, suffix: '+', label: 'Tenaga Ahli Profesional' },
];

function MiniStat({ value, suffix, label }: typeof MINI_STATS[0]) {
    const { count, ref } = useCounter(value);
    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: 400,
                fontFamily: "'Helvetica', 'Arial', sans-serif",
                letterSpacing: '-0.04em',
                color: '#111',
                lineHeight: 1,
            }}>
                {count}{suffix}
            </span>
            <span style={{
                fontSize: 12,
                color: '#777',
                fontFamily: "'Helvetica', 'Arial', sans-serif",
                fontWeight: 400,
                letterSpacing: '0.01em',
            }}>
                {label}
            </span>
        </div>
    );
}

export default function AboutSection() {
    const containerRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={containerRef}
            style={{
                borderTop: '1.5px solid #111',
                background: '#fff',
                padding: '64px 40px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 64,
                alignItems: 'start',
            }}
        >
            {/* ── Left: big statement ── */}
            <div>
                {/* Section label */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
                }}>
                    <span style={{
                        fontSize: 11, fontWeight: 400, letterSpacing: '0.14em',
                        textTransform: 'uppercase', color: '#888',
                        fontFamily: "'Helvetica', 'Arial', sans-serif",
                    }}>Tentang Kami</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                </div>

                {/* Big headline */}
                <h2 style={{
                    fontSize: 'clamp(36px, 5vw, 72px)',
                    fontWeight: 400,
                    fontFamily: "'Helvetica', 'Arial', sans-serif",
                    letterSpacing: '-0.045em',
                    lineHeight: 0.95,
                    color: '#111',
                    margin: '0 0 32px',
                }}>
                    <VariableProximity
                        label="Digitalisasi"
                        fromFontVariationSettings="'wght' 400"
                        toFontVariationSettings="'wght' 900"
                        containerRef={containerRef}
                        radius={180}
                        falloff="gaussian"
                    />
                    <br />
                    <span style={{
                        fontFamily: "'Melodrame', 'Georgia', serif",
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em',
                    }}>
                        <VariableProximity
                            label="Ekosistem"
                            fromFontVariationSettings="'wght' 400"
                            toFontVariationSettings="'wght' 900"
                            containerRef={containerRef}
                            radius={180}
                            falloff="gaussian"
                        />
                    </span>
                    <br />
                    <VariableProximity
                        label="Maritim &"
                        fromFontVariationSettings="'wght' 400"
                        toFontVariationSettings="'wght' 900"
                        containerRef={containerRef}
                        radius={180}
                        falloff="gaussian"
                    />
                    <br />
                    <VariableProximity
                        label="Logistik Global."
                        fromFontVariationSettings="'wght' 400"
                        toFontVariationSettings="'wght' 900"
                        containerRef={containerRef}
                        radius={180}
                        falloff="gaussian"
                    />
                </h2>

                {/* CTA pill */}
                <a href="#" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    border: '1.5px solid #111', borderRadius: 999,
                    padding: '10px 22px', textDecoration: 'none',
                    fontFamily: "'Helvetica', 'Arial', sans-serif",
                    fontSize: 13.5, fontWeight: 400, color: '#111',
                    transition: 'background 0.2s, color 0.2s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                >
                    Kenali Lebih Jauh
                    <span style={{ fontSize: 16 }}>→</span>
                </a>
            </div>

            {/* ── Right: description + mini stats ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {/* Description */}
                <p style={{
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: '#555',
                    fontFamily: "'Helvetica', 'Arial', sans-serif",
                    fontWeight: 400,
                    margin: 0,
                    marginTop: 60,
                }}>
                    PT Duta Meta Graha adalah perusahaan teknologi yang berfokus pada digitalisasi dan optimasi sistem operasional di sektor <strong style={{ color: '#111', fontWeight: 400 }}>maritim, pelabuhan, dan logistik global</strong>. Kami menghadirkan solusi manajemen operasional terintegrasi — mulai dari otomasi proses, akurasi data, hingga peningkatan performa layanan — untuk mitra strategis di seluruh ekosistem kepelabuhanan Indonesia.
                </p>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }} />

                {/* Mini stats row */}
                <div style={{
                    display: 'flex',
                    gap: 40,
                    flexWrap: 'wrap',
                }}>
                    {MINI_STATS.map((s, i) => (
                        <MiniStat key={i} {...s} />
                    ))}
                </div>
            </div>
        </section>
    );
}
