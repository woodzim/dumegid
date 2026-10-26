'use client';

import { useState, useEffect } from 'react';
import { Asterisk, HalfDisc, Notch } from './DmgKit';

const LINKS = [
    { href: '#visi-misi', label: 'Visi & Misi' },
    { href: '#layanan', label: 'Layanan' },
    { href: '#asosiasi', label: 'Asosiasi' },
    { href: '#ekosistem', label: 'Ekosistem' },
    { href: '#tim', label: 'Tim' },
    { href: '#kontak', label: 'Kontak' },
];

export default function FooterSection() {
    const [year, setYear] = useState('2026');

    useEffect(() => {
        setYear(new Date().getFullYear().toString());
    }, []);

    return (
        <footer className="ft-wrap">
            <div className="dmg-container">
                <div className="dmg-panel ft-panel">
                    <div className="ft-top">
                        <div className="dmg-mono ft-brand">
                            PT Duta Meta Graha
                            <br />
                            <span>Solusi digital maritim, pelabuhan & logistik</span>
                        </div>
                        <nav className="ft-links" aria-label="Footer">
                            {LINKS.map((l) => (
                                <a key={l.href} href={l.href} className="dmg-mono">
                                    {l.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="ft-word" aria-hidden="true">
                        dumeg
                        <HalfDisc />
                        <Asterisk />
                    </div>

                    <Notch corner="br" className="ft-notch">
                        &copy; {year} All rights reserved <Asterisk size={12} />
                    </Notch>
                </div>
            </div>

            <style>{`
                .ft-wrap { padding: 48px 0 24px; color: var(--dmg-ink); }
                .ft-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 48px;
                    padding: 32px 32px 24px;
                    overflow: hidden;
                }
                .ft-top {
                    display: flex;
                    justify-content: space-between;
                    gap: 32px;
                    flex-wrap: wrap;
                }
                .ft-brand { font-size: 12px; line-height: 1.6; }
                .ft-brand span { color: var(--dmg-ink-mute); font-size: 10px; }
                .ft-links {
                    display: grid;
                    grid-template-columns: repeat(2, auto);
                    gap: 8px 48px;
                }
                .ft-links a {
                    font-size: 11px;
                    color: var(--dmg-ink);
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                .ft-links a:hover { color: var(--dmg-accent); }
                .ft-word {
                    font-family: var(--font-main);
                    font-size: clamp(72px, 16vw, 232px);
                    line-height: 0.8;
                    letter-spacing: -0.06em;
                    white-space: nowrap;
                    user-select: none;
                    padding-bottom: 0.24em;
                }
                .ft-word .dmg-asterisk {
                    width: 0.6em;
                    height: 0.6em;
                    margin-left: 0.08em;
                }
                .ft-notch { padding: 12px 24px; }

                @media (max-width: 640px) {
                    .ft-panel { padding: 24px 20px 64px; }
                    .ft-word { font-size: 19vw; }
                }
            `}</style>
        </footer>
    );
}
