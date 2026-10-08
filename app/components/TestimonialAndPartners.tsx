'use client';
import { useState } from 'react';

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
        <section className="dmg-section">
            <div className="dmg-container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 24,
                    alignItems: 'stretch',
                }}>
                    {/* Left Card: Testimonial */}
                    <div
                        className="dmg-card-glass"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: 340,
                            padding: 36,
                        }}
                    >
                        <div>
                            <span className="dmg-section-tag" style={{ marginBottom: 20 }}>
                                KATA MEREKA
                            </span>
                            <blockquote style={{
                                fontSize: 'clamp(20px, 2.2vw, 26px)',
                                fontWeight: 600,
                                lineHeight: 1.35,
                                color: '#ffffff',
                                letterSpacing: '-0.02em',
                            }}>
                                {currentTesti.quote}
                            </blockquote>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            paddingTop: 24,
                            marginTop: 24,
                            borderTop: '1px solid rgba(255,255,255,0.14)',
                        }}>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>
                                    {currentTesti.author}
                                </div>
                                <div style={{ fontSize: 12, color: '#cbd8fc', marginTop: 2 }}>
                                    {currentTesti.sub}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="dmg-arrow-btn"
                                    aria-label="Previous testimonial"
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="dmg-arrow-btn"
                                    aria-label="Next testimonial"
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Rekan Kerjasama (White Card) */}
                    <div
                        className="dmg-card-white"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: 340,
                            padding: 36,
                        }}
                    >
                        <div>
                            <span style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: '#94a3b8',
                                display: 'block',
                                marginBottom: 18,
                            }}>
                                REKAN KERJASAMA
                            </span>

                            {/* Partner badges row */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                                {PARTNERS.map((partner) => (
                                    <span
                                        key={partner.name}
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            padding: '6px 14px',
                                            borderRadius: 9999,
                                            background: partner.active ? '#1432e3' : '#f1f5f9',
                                            color: partner.active ? '#ffffff' : '#334155',
                                        }}
                                    >
                                        {partner.name}
                                    </span>
                                ))}
                            </div>

                            <h3 style={{
                                fontSize: 'clamp(22px, 2.3vw, 28px)',
                                fontWeight: 700,
                                color: '#0d1428',
                                lineHeight: 1.25,
                                marginBottom: 12,
                                letterSpacing: '-0.02em',
                            }}>
                                Bersama Perusahaan Tally Maritim Indonesia
                            </h3>

                            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#64748b' }}>
                                Didukung puluhan mitra maritim andalan di seluruh Indonesia untuk percepatan digitalisasi operasional pelabuhan modern yang transparan dan akurat.
                            </p>
                        </div>

                        <div style={{
                            paddingTop: 20,
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 12,
                            color: '#64748b',
                            fontWeight: 600,
                        }}>
                            <span>Jangkauan Pelabuhan Nasional</span>
                            <span style={{ color: '#1432e3', fontWeight: 700 }}>14+ Wilayah Operasi</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
