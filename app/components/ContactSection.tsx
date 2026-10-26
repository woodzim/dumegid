'use client';
import { useState } from 'react';
import { Marks, Notch, SectionHead } from './DmgKit';

export default function ContactSection() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            setSent(true);
            setTimeout(() => {
                setName('');
                setEmail('');
                setSent(false);
            }, 4000);
        }
    };

    return (
        <section id="kontak" className="dmg-section" aria-label="Kontak">
            <div className="dmg-container">
                <SectionHead
                    index="05"
                    label="Kontak"
                    title={
                        <>
                            Siap mulai?
                            <Marks />
                            <br />
                            Yuk, diskusi.
                        </>
                    }
                />

                <div className="ct-grid">
                    {/* Direct contact */}
                    <div className="dmg-card ct-direct">
                        <Notch corner="tr">Kontak langsung</Notch>
                        <p className="ct-lead">
                            Tinggalkan cara manual yang ribet. Hubungi kami sekarang dan temukan solusi tepat untuk logistik kamu.
                        </p>

                        <div className="ct-lines">
                            <a href="tel:+6282218788724" className="ct-line">
                                <span className="dmg-label">Telepon:</span>
                                <span className="dmg-mono ct-line-value">+62 822-1878-8724</span>
                            </a>
                            <a href="mailto:dumegid@dumeg.com" className="ct-line">
                                <span className="dmg-label">Email:</span>
                                <span className="dmg-mono ct-line-value">dumegid@dumeg.com</span>
                            </a>
                        </div>

                        <a href="tel:+6282218788724" className="dmg-btn">
                            <span className="dmg-btn-label">Telepon sekarang</span>
                            <span className="dmg-btn-icon" aria-hidden="true">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </span>
                        </a>
                    </div>

                    {/* Form: ink card */}
                    <div className="dmg-card dmg-card-dark ct-form-card">
                        <Notch corner="tr" style={{ width: '40%', minHeight: 56 }} />

                        <div className="ct-form-head">
                            <span className="dmg-mono ct-k">Kirim ke:</span>
                            <div className="dmg-mono ct-to">
                                Tim
                                <br />
                                DUMEG.ID
                            </div>
                        </div>

                        {sent ? (
                            <div className="ct-sent dmg-fade-in" role="status">
                                <span className="dmg-mono ct-k">Status:</span>
                                <div className="dmg-mono ct-sent-title">[Pesan terkirim]</div>
                                <p className="ct-sent-desc">Tim teknis DUMEG akan segera menghubungi kamu.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="ct-form">
                                <label className="ct-field">
                                    <span className="dmg-mono ct-k">Nama:</span>
                                    <input
                                        type="text"
                                        required
                                        placeholder="[Nama kamu]"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </label>
                                <label className="ct-field">
                                    <span className="dmg-mono ct-k">Email:</span>
                                    <input
                                        type="email"
                                        required
                                        placeholder="[Email kamu]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </label>
                                <button type="submit" className="dmg-btn ct-submit">
                                    <span className="dmg-btn-label">Kirim pesan</span>
                                    <span className="dmg-btn-icon" aria-hidden="true">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .ct-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
                    gap: 12px;
                }
                .ct-direct {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 32px;
                    padding: 28px;
                }
                .ct-lead {
                    font-size: 15px;
                    line-height: 1.6;
                    color: var(--dmg-ink-soft);
                    max-width: 420px;
                    padding-top: 24px;
                }
                .ct-lines { display: flex; flex-direction: column; gap: 24px; width: 100%; }
                .ct-line {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    color: var(--dmg-ink);
                    text-decoration: none;
                }
                .ct-line-value {
                    font-size: clamp(18px, 2.6vw, 36px);
                    letter-spacing: -0.04em;
                    text-transform: none;
                    transition: color 0.2s ease;
                    overflow-wrap: anywhere;
                }
                .ct-line:hover .ct-line-value { color: var(--dmg-accent); }

                .ct-form-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 40px;
                    min-height: 480px;
                    padding: 28px;
                }
                .ct-k { display: block; font-size: 10px; color: var(--dmg-on-dark-soft); }
                .ct-to { font-size: clamp(22px, 2.2vw, 30px); line-height: 1.15; margin-top: 12px; }
                .ct-form { display: flex; flex-direction: column; gap: 16px; }
                .ct-field { display: flex; flex-direction: column; gap: 8px; }
                .ct-field input {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px;
                    border: none;
                    border-radius: 12px;
                    background: var(--dmg-dark-2);
                    color: var(--dmg-on-dark);
                    font-family: var(--font-mono);
                    font-size: 12px;
                    outline: none;
                }
                .ct-field input::placeholder { color: var(--dmg-on-dark-soft); }
                .ct-field input:focus-visible { outline: 2px solid var(--dmg-accent); outline-offset: 0; }
                .ct-submit { margin-top: 8px; align-self: flex-start; }
                .ct-submit .dmg-btn-label { background: var(--dmg-surface); color: var(--dmg-ink); }
                .ct-submit:hover .dmg-btn-label { background: var(--dmg-muted); }
                .ct-sent-title { font-size: 20px; color: var(--dmg-accent); margin-top: 12px; }
                .ct-sent-desc { font-size: 14px; color: var(--dmg-on-dark-soft); margin-top: 8px; }

                @media (max-width: 900px) {
                    .ct-grid { grid-template-columns: 1fr; }
                    .ct-form-card { min-height: 0; }
                }
                @media (max-width: 520px) {
                    .ct-direct, .ct-form-card { padding: 20px; }
                    .ct-direct .dmg-notch { display: none; }
                }
            `}</style>
        </section>
    );
}
