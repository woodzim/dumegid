'use client';
import { useState } from 'react';
import { Asterisk, HalfDisc, Notch, SectionHead } from './DmgKit';

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

    return (
        <section id="tim" className="dmg-section" aria-label="Tim Engineer">
            <div className="dmg-container">
                <SectionHead
                    index="04"
                    label="Tim"
                    title={
                        <>
                            Engineer di balik
                            <HalfDisc />
                            <br />
                            sistem kamu
                            <Asterisk />
                        </>
                    }
                    aside={
                        <p>Engineer yang bikin sistem logistik kamu jalan tanpa hambatan, dari infrastruktur sampai aplikasi lapangan.</p>
                    }
                />

                <div className="tm-grid">
                    {MEMBERS.map((member, idx) => {
                        const isActive = member.id === selectedId;

                        return (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => setSelectedId(member.id)}
                                aria-pressed={isActive}
                                className={`dmg-card tm-card ${isActive ? 'dmg-card-dark' : ''}`}
                            >
                                <Notch corner="tr">
                                    {idx + 1}/{MEMBERS.length}
                                </Notch>

                                <span className="dmg-num tm-initials">{member.initials}</span>

                                <span className="tm-info">
                                    <span className="dmg-mono tm-name">{member.name}</span>
                                    <span className="dmg-mono tm-role">{member.role}</span>
                                    {isActive && (
                                        <span className="dmg-pill-row tm-skills">
                                            {member.skills.map((skill) => (
                                                <span key={skill} className="dmg-pill dmg-pill-ghost dmg-fade-in">
                                                    {skill}
                                                </span>
                                            ))}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .tm-grid {
                    display: grid;
                    grid-template-columns: repeat(5, minmax(0, 1fr));
                    gap: 12px;
                }
                .tm-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 24px;
                    min-height: 320px;
                    border: none;
                    text-align: left;
                    font: inherit;
                    cursor: pointer;
                    transition: background 0.25s ease, color 0.25s ease;
                }
                .tm-card:not(.dmg-card-dark):hover { background: var(--dmg-muted); }
                .tm-card:focus-visible { outline: 2px solid var(--dmg-accent); outline-offset: 2px; }
                .tm-initials { font-size: clamp(48px, 5vw, 72px); }
                .tm-card.dmg-card-dark .tm-initials { color: var(--dmg-accent); }
                .tm-info { display: flex; flex-direction: column; gap: 8px; }
                .tm-name { font-size: 13px; line-height: 1.3; }
                .tm-role { font-size: 10px; color: var(--dmg-ink-mute); }
                .tm-card.dmg-card-dark .tm-role { color: var(--dmg-on-dark-soft); }
                .tm-skills { margin-top: 8px; }

                @media (max-width: 1024px) {
                    .tm-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (max-width: 640px) {
                    .tm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .tm-card { min-height: 240px; padding: 20px; }
                }
            `}</style>
        </section>
    );
}
