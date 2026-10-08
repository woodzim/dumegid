'use client';
import { useEffect, useRef, useState } from 'react';

interface Stat {
    number: string;
    label: string;
    sub?: string;
    bg: string;
    color: string;
    wide?: boolean;
}

const STATS: Stat[] = [
    {
        number: '40+',
        label: 'Aplikasi &\nSolusi Digital',
        bg: '#FFE566',
        color: '#111',
        wide: false,
    },
    {
        number: '3',
        label: 'Pilar Utama\nEkosistem',
        sub: 'Logistik · Supporting · Media Center',
        bg: '#004EE0',
        color: '#fff',
        wide: true,
    },
    {
        number: '∞',
        label: 'Multi-Platform',
        sub: 'Web · Mobile · Hardware IoT',
        bg: '#FFB3D9',
        color: '#111',
        wide: false,
    },
    {
        number: '100%',
        label: 'Made in\nIndonesia',
        bg: '#99CAFF',
        color: '#042E7B',
        wide: true,
    },
    {
        number: '24/7',
        label: 'Support &\nMaintenance',
        bg: '#FF8C5A',
        color: '#fff',
        wide: false,
    },
];

// Animated counter hook
function useCounter(target: number, duration = 1200) {
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
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) { requestAnimationFrame(step); }
        };
        requestAnimationFrame(step);
    }, [started, target, duration]);

    return { count, ref };
}

function StatPill({ stat }: { stat: Stat }) {
    const [hovered, setHovered] = useState(false);
    const isNumeric = /^\d+/.test(stat.number);
    const numericVal = parseInt(stat.number);
    const { count, ref } = useCounter(isNumeric ? numericVal : 0);

    const displayNumber = isNumeric
        ? `${count}${stat.number.replace(/^\d+/, '')}`
        : stat.number;

    return (
        <div
            ref={ref}
            style={{
                flexShrink: 0,
                flexGrow: stat.wide ? 1.5 : 1,
                minWidth: stat.wide ? 260 : 180,
                maxWidth: stat.wide ? 380 : 260,
                background: stat.bg,
                borderRadius: 999,
                padding: '28px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 4,
                cursor: 'default',
                transform: hovered ? 'translateY(-6px) scale(1.025)' : 'translateY(0) scale(1)',
                transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1)',
                userSelect: 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Big number */}
            <div style={{
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 400,
                color: stat.color,
                lineHeight: 1,
                fontFamily: "'Helvetica', 'Arial', sans-serif",
                letterSpacing: '-0.03em',
            }}>
                {displayNumber}
            </div>

            {/* Label */}
            <div style={{
                fontSize: 14,
                fontWeight: 400,
                color: stat.color,
                opacity: 0.85,
                fontFamily: "'Helvetica', 'Arial', sans-serif",
                lineHeight: 1.35,
                whiteSpace: 'pre-line',
            }}>
                {stat.label}
            </div>

            {/* Sub label */}
            {stat.sub && (
                <div style={{
                    fontSize: 11,
                    color: stat.color,
                    opacity: 0.55,
                    fontFamily: "'Helvetica', 'Arial', sans-serif",
                    marginTop: 2,
                    letterSpacing: '0.01em',
                }}>
                    {stat.sub}
                </div>
            )}
        </div>
    );
}

export default function StatsSection() {
    return (
        <section style={{
            padding: '48px 40px',
            borderTop: '1.5px solid #111',
            background: '#fff',
        }}>
            {/* Section label */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
            }}>
                <span style={{
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#888',
                    fontFamily: "'Helvetica', 'Arial', sans-serif",
                }}>
                    Statistik Ringkas
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
            </div>

            {/* Pills row */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                alignItems: 'stretch',
            }}>
                {STATS.map((s, i) => (
                    <StatPill key={i} stat={s} />
                ))}
            </div>
        </section>
    );
}
