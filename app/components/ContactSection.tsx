'use client';
import { useState } from 'react';

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
        <section id="kontak" className="dmg-section">
            <div className="dmg-container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 48,
                    alignItems: 'center',
                }}>
                    {/* Left Column: Heading & Contact Buttons */}
                    <div style={{ maxWidth: 520 }}>
                        <span className="dmg-section-tag">KONTAK</span>
                        <h2 className="dmg-section-title">
                            Siap Mulai? Yuk, Diskusi Bisnis Bareng Kita
                        </h2>
                        <p style={{ marginTop: 20, fontSize: 15.5, lineHeight: 1.6, color: '#cbd8fc' }}>
                            Tinggalkan cara manual yang ribet. Hubungi kami sekarang dan temukan solusi tepat untuk logistik kamu.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
                            <a
                                href="tel:+6282218788724"
                                className="dmg-btn-pill-white"
                                style={{ textDecoration: 'none' }}
                            >
                                <svg width="15" height="15" fill="none" stroke="#1432e3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+62 822-1878-8724</span>
                            </a>

                            <a
                                href="mailto:dumegid@dumeg.com"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '11px 22px',
                                    borderRadius: 9999,
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#ffffff',
                                    fontSize: 13.5,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <svg width="15" height="15" fill="none" stroke="#a4beff" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>dumegid@dumeg.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: White Form Card */}
                    <div>
                        <div
                            className="dmg-card-white"
                            style={{
                                padding: '36px 32px',
                                borderRadius: 28,
                                maxWidth: 440,
                                margin: '0 auto',
                            }}
                        >
                            <h3 style={{
                                fontSize: 21,
                                fontWeight: 700,
                                color: '#0d1428',
                                marginBottom: 24,
                                lineHeight: 1.3,
                                letterSpacing: '-0.02em',
                            }}>
                                Mulai transformasi <span style={{ color: '#1432e3' }}>digital kamu hari ini</span>
                            </h3>

                            {sent ? (
                                <div style={{
                                    padding: 24,
                                    borderRadius: 16,
                                    background: '#ecfdf5',
                                    border: '1px solid #a7f3d0',
                                    textAlign: 'center',
                                }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 9999,
                                        background: '#10b981',
                                        color: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 10px auto',
                                    }}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#065f46' }}>Pesan Terkirim!</h4>
                                    <p style={{ fontSize: 12.5, color: '#047857', marginTop: 4 }}>
                                        Tim teknis DUMEG akan segera menghubungi kamu.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nama kamu"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '14px 20px',
                                            borderRadius: 9999,
                                            border: '1px solid transparent',
                                            background: '#f1f4f9',
                                            color: '#0d1428',
                                            fontSize: 13.5,
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email kamu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '14px 20px',
                                            borderRadius: 9999,
                                            border: '1px solid transparent',
                                            background: '#f1f4f9',
                                            color: '#0d1428',
                                            fontSize: 13.5,
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="dmg-btn-pill-black"
                                        style={{
                                            width: '100%',
                                            padding: '14px 24px',
                                            justifyContent: 'center',
                                            fontSize: 14,
                                            marginTop: 6,
                                        }}
                                    >
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>Kirim pesan</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
