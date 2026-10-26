'use client';
import { useState } from 'react';
import { Asterisk, CircleButton, Notch } from './DmgKit';

const TESTIMONIALS = [
    {
        quote: '“Efisiensi operasional naik drastis, dan layanannya luar biasa. Tim kami nggak balik lagi ke cara lama”',
        author: 'Direktur Logistik Surabaya',
        sub: 'Mitra Tally & Port sejak 2022',
    },
    {
        quote: '“Pencatatan tally peti kemas di dermaga jadi 100% akurat. Selisih kontainer langsung tereliminasi sejak hari pertama.”',
        author: 'Kepala Operasional Pelabuhan Tanjung Perak',
        sub: 'Mitra Pengguna YADRI',
    },
];

const PARTNERS = [
    { name: 'BPRTL', active: true },
    { name: 'PELNI', active: false },
    { name: 'IKPT', active: false },
    { name: 'BUANA MEG', active: false },
    { name: 'ANUGERAH', active: false },
    { name: 'IP CAB', active: false },
];

export default function TestimonialAndPartners() {
    const [testiIndex, setTestiIndex] = useState(0);

    const handlePrev = () => {
        setTestiIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const handleNext = () => {
        setTestiIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const currentTesti = TESTIMONIALS[testiIndex];

    return (
        <section className="dmg-section" aria-label="Testimoni dan Rekan Kerjasama">
            <div className="dmg-container tp-grid">
                {/* Testimonial */}
                <div className="dmg-card dmg-card-dark tp-testi">
                    <Notch corner="tl" className="dmg-notch-icon">
                        <Asterisk size={28} />
                    </Notch>

                    <div className="tp-testi-head">
                        <span className="dmg-mono tp-k">Kata mereka</span>
                        <span className="dmg-mono tp-k">
                            {testiIndex + 1}/{TESTIMONIALS.length}
                        </span>
                    </div>

                    <blockquote key={testiIndex} className="tp-quote dmg-fade-in">
                        {currentTesti.quote}
                    </blockquote>

                    <div className="tp-testi-foot">
                        <div>
                            <div className="dmg-mono tp-author">{currentTesti.author}</div>
                            <div className="dmg-mono tp-k" style={{ marginTop: 8 }}>{currentTesti.sub}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <CircleButton onClick={handlePrev} label="Testimoni sebelumnya" direction="prev" tone="light" />
                            <CircleButton onClick={handleNext} label="Testimoni berikutnya" direction="next" tone="light" />
                        </div>
                    </div>
                </div>

                {/* Partners */}
                <div className="dmg-card tp-partners">
                    <Notch corner="tr">Rekan kerjasama</Notch>

                    <div className="tp-reach">
                        <span className="dmg-num tp-reach-num">14+</span>
                        <span className="dmg-mono tp-reach-label">Wilayah operasi</span>
                    </div>

                    <div>
                        <h3 className="tp-title">Bersama perusahaan tally maritim Indonesia</h3>
                        <p className="tp-desc">
                            Didukung puluhan mitra maritim andalan di seluruh Indonesia untuk percepatan digitalisasi operasional pelabuhan modern yang transparan dan akurat.
                        </p>
                        <div className="dmg-pill-row" style={{ marginTop: 20 }}>
                            {PARTNERS.map((partner) => (
                                <span key={partner.name} className={`dmg-pill ${partner.active ? 'dmg-pill-dark' : ''}`}>
                                    {partner.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .tp-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
                    gap: 12px;
                }
                .tp-testi {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 32px;
                    min-height: 440px;
                    padding: 28px;
                }
                .tp-testi-head {
                    display: flex;
                    justify-content: space-between;
                    padding-left: 72px;
                    padding-top: 8px;
                }
                .tp-k { font-size: 10px; color: var(--dmg-on-dark-soft); }
                .tp-quote {
                    font-family: var(--font-main);
                    font-size: clamp(24px, 2.6vw, 38px);
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    max-width: 640px;
                }
                .tp-testi-foot {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 16px;
                }
                .tp-author { font-size: 12px; color: var(--dmg-accent); }

                .tp-partners {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 32px;
                    padding: 28px;
                }
                .tp-reach { display: flex; flex-direction: column; gap: 12px; }
                .tp-reach-num { font-size: clamp(72px, 8vw, 120px); }
                .tp-reach-label { font-size: 12px; }
                .tp-title {
                    font-family: var(--font-main);
                    font-size: clamp(22px, 2vw, 28px);
                    font-weight: 400;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                }
                .tp-desc {
                    font-size: 13.5px;
                    line-height: 1.6;
                    color: var(--dmg-ink-soft);
                    margin-top: 12px;
                }

                @media (max-width: 900px) {
                    .tp-grid { grid-template-columns: 1fr; }
                    .tp-testi { min-height: 380px; }
                }
                @media (max-width: 520px) {
                    .tp-testi, .tp-partners { padding: 20px; }
                    .tp-partners .dmg-notch { display: none; }
                }
            `}</style>
        </section>
    );
}
