'use client';
import { useState, useRef } from 'react';

interface Member {
    id: string;
    initials: string;
    name: string;
    role: string;
    skills: string[];
}

const MEMBERS: Member[] = [
    {
        id: 'ti',
        initials: 'TI',
        name: 'Teguh Irawan',
        role: 'DevOps Engineer',
        skills: ['Kubernetes', 'Docker', 'AWS'],
    },
    {
        id: 'an',
        initials: 'AN',
        name: 'Arya Nugraha',
        role: 'Fullstack Engineer',
        skills: ['Node.js', 'React', 'Redis'],
    },
    {
        id: 'dg',
        initials: 'DG',
        name: 'Dava Geraldo',
        role: 'Fullstack Engineer',
        skills: ['React & Next.js', 'Go', 'PostgreSQL'],
    },
    {
        id: 'nf',
        initials: 'NF',
        name: 'Naufal Fadhil',
        role: 'Frontend Engineer',
        skills: ['Next.js', 'Tailwind', 'TypeScript'],
    },
    {
        id: 'rp',
        initials: 'RP',
        name: 'Raya Prasetya',
        role: 'Backend Engineer',
        skills: ['Go', 'PostgreSQL', 'Microservices'],
    },
];

export default function TeamSection() {
    const [selectedId, setSelectedId] = useState<string>('dg');
    const scrollRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        const curr = MEMBERS.findIndex((m) => m.id === selectedId);
        const prev = (curr - 1 + MEMBERS.length) % MEMBERS.length;
        setSelectedId(MEMBERS[prev].id);
        scrollRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
    };

    const handleNext = () => {
        const curr = MEMBERS.findIndex((m) => m.id === selectedId);
        const next = (curr + 1) % MEMBERS.length;
        setSelectedId(MEMBERS[next].id);
        scrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
    };

    return (
        <section id="tim" className="dmg-section">
            <div className="dmg-container">
                {/* Header */}
                <div className="dmg-section-header">
                    <div>
                        <span className="dmg-section-tag">TIM</span>
                        <h2 className="dmg-section-title" style={{ maxWidth: 640 }}>
                            Engineer Yang Bikin Sistem Logistik Kamu Jalan Tanpa Hambatan
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="dmg-arrow-btn"
                            aria-label="Previous engineer"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="dmg-arrow-btn"
                            aria-label="Next engineer"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Team Cards Row */}
                <div
                    ref={scrollRef}
                    className="no-scrollbar"
                    style={{
                        display: 'flex',
                        gap: 20,
                        overflowX: 'auto',
                        paddingBottom: 20,
                        scrollSnapType: 'x mandatory',
                    }}
                >
                    {MEMBERS.map((member) => {
                        const isActive = member.id === selectedId;

                        return (
                            <div
                                key={member.id}
                                onClick={() => setSelectedId(member.id)}
                                className={isActive ? 'dmg-card-white' : 'dmg-card-glass'}
                                style={{
                                    flex: '0 0 auto',
                                    width: 250,
                                    padding: 0,
                                    overflow: 'hidden',
                                    borderRadius: 24,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    scrollSnapAlign: 'start',
                                }}
                            >
                                {/* Top Monogram Box */}
                                <div
                                    style={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: isActive ? '#d8e4ff' : 'transparent',
                                        transition: 'background 0.25s ease',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 54,
                                            fontWeight: 700,
                                            letterSpacing: '-0.03em',
                                            color: isActive ? '#1432e3' : 'rgba(255,255,255,0.35)',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {member.initials}
                                    </span>
                                </div>

                                {/* Bottom Info Box */}
                                <div style={{ padding: '20px 22px' }}>
                                    <h3
                                        style={{
                                            fontSize: 16.5,
                                            fontWeight: 700,
                                            color: isActive ? '#0d1428' : '#ffffff',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {member.name}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: 12,
                                            color: isActive ? '#64748b' : '#cbd8fc',
                                            marginTop: 4,
                                        }}
                                    >
                                        {member.role}
                                    </p>

                                    {/* Tech tags */}
                                    {isActive && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 6,
                                            marginTop: 14,
                                            paddingTop: 12,
                                            borderTop: '1px solid #f1f5f9',
                                        }}>
                                            {member.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        background: '#f1f5f9',
                                                        color: '#334155',
                                                        padding: '3px 8px',
                                                        borderRadius: 9999,
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
