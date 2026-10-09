'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ScrollExpand from './ScrollExpand';

export default function VisionMissionSection() {
  const [timeStr, setTimeStr] = useState('16:20');
  const [dateStr, setDateStr] = useState('8 Oktober 2026');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="visi-misi"
      className="relative w-full"
      style={{
        backgroundImage: "url('/images/sky_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="Visi dan Misi DUMEG"
    >
      <ScrollExpand
        mediaType="color"
        src="#ffffff"
        title="VISI & MISI"
        scrollHint="SCROLL ↓"
        titleClassName="font-black tracking-tight"
        titleStyle={{
          backgroundImage: "url('/images/sky_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
        hintClassName="text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] font-bold tracking-widest text-[0.8rem]"
        startWidth={40}
        startHeight={54}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.05}
        scrollDistance={1.4}
        holdDistance={0.9}
        smoothing={0.1}
        overlayScrim={1}
        scrimClassName="bg-[linear-gradient(120deg,#1d5bf6_0%,#2f72f7_35%,#5292fa_70%,#7db3ff_100%)]"
        overlayClassName="absolute inset-0 flex flex-col items-center justify-between bg-[linear-gradient(120deg,#1d5bf6_0%,#2f72f7_35%,#5292fa_70%,#7db3ff_100%)]"
        useWindowScroll={true}
      >
        <div
          className="w-full flex flex-col h-full select-none"
          style={{
            maxWidth: 1260,
            width: '100%',
            margin: '0 auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: 'var(--font-main)',
            paddingTop: 80,
            paddingBottom: 36,
            paddingLeft: 20,
            paddingRight: 20,
            boxSizing: 'border-box',
          }}
        >
          {/* ── BENTO GRID LAYOUT (Inspired by Reference) ── */}
          <div
            className="bento-container"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridAutoRows: 'minmax(80px, auto)',
              gap: 12,
              width: '100%',
              flex: 1,
            }}
          >
            {/* ── CARD 1: MAIN VISION FEATURE CARD (Top Left, Spans 5 cols, 2 rows) - White #FFFFFF ── */}
            <div
              className="bento-card bento-vision-card"
              style={{
                gridColumn: 'span 5',
                gridRow: 'span 2',
                background: '#FFFFFF',
                color: '#000000',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.8)',
                padding: '28px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 14px 36px -4px rgba(0, 30, 100, 0.22), 0 4px 12px -2px rgba(0, 30, 100, 0.1)',
                position: 'relative',
              }}
            >
              {/* Header: Logo Icon & Live Clock */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                {/* DUMEG Emblem */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: '#0056FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#0056FF',
                    }}
                  >
                    DUMEG VISION
                  </span>
                </div>

                {/* Date & Time */}
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#6b7280',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {dateStr}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: '#0056FF',
                      lineHeight: 1.1,
                      marginTop: 2,
                    }}
                  >
                    {timeStr}
                  </div>
                </div>
              </div>

              {/* Middle: Big Bold Vision Headline */}
              <div style={{ margin: '24px 0 16px 0' }}>
                <h3
                  style={{
                    fontSize: 'clamp(20px, 2.1vw, 29px)',
                    fontWeight: 800,
                    lineHeight: 1.25,
                    letterSpacing: '-0.03em',
                    color: '#000000',
                    fontFamily: 'var(--font-main)',
                  }}
                >
                  MENJADI PENYEDIA SOLUSI DIGITAL TERDEPAN DALAM INDUSTRI MARITIM &amp; LOGISTIK GLOBAL. ⚓
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: '#475569',
                    lineHeight: 1.45,
                    marginTop: 10,
                    fontWeight: 500,
                  }}
                >
                  Menghadirkan inovasi teknologi yang mengakselerasi transformasi digital pada operasional kepelabuhanan modern di seluruh Nusantara.
                </p>
              </div>

              {/* Footer: Tags & Indonesia Flag */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 14,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6b7280',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ color: '#0056FF' }}>TALLY DIGITAL</span>
                  <span>PELABUHAN</span>
                  <span>LOGISTIK</span>
                </div>
                <span style={{ fontSize: 16 }}>🇮🇩</span>
              </div>
            </div>

            {/* ── CARD 2: MISI 01 (Top Center, Spans 4 cols, 1 row) - Royal Blue #0056FF ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 4',
                gridRow: 'span 1',
                background: '#0056FF',
                color: '#FFFFFF',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 14px 36px -4px rgba(0, 30, 100, 0.28)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#0056FF',
                    background: '#FFFFFF',
                    padding: '3px 9px',
                    borderRadius: 999,
                  }}
                >
                  MISI 01
                </span>
                <h4 style={{ fontSize: 15, fontWeight: 800, marginTop: 8, color: '#FFFFFF' }}>
                  Sistem Digital Efisien &amp; Aman
                </h4>
                <p style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.85)', marginTop: 4, lineHeight: 1.35, maxWidth: 220 }}>
                  Solusi terpusat untuk kelancaran bongkar muat &amp; kepelabuhanan.
                </p>
              </div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
            </div>

            {/* ── CARD 3: PHOTO CARD (Top Right, Spans 3 cols, 1 row) ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 3',
                gridRow: 'span 1',
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 14px 36px -4px rgba(0, 30, 100, 0.22)',
                minHeight: 110,
              }}
            >
              <Image
                src="/images/model/model_1.jpg"
                alt="DUMEG Engineers at Work"
                fill
                sizes="(max-width: 1024px) 50vw, 400px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 35%',
                }}
              />
            </div>

            {/* ── CARD 4: MISI 02 (Middle Center Left, Spans 2 cols, 1 row) - Soft Lavender #E3E7FC ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 2',
                gridRow: 'span 1',
                background: '#E3E7FC',
                color: '#000000',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 14px 36px -4px rgba(0, 30, 100, 0.18)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: '#0056FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                MISI 02
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#000000', marginTop: 4, lineHeight: 1.2 }}>
                RESPONSIF INDUSTRI
              </div>
              <div style={{ fontSize: 10, color: '#4b5563', marginTop: 4 }}>
                Sesuai Kebutuhan Lapangan
              </div>
            </div>

            {/* ── CARD 5: PHOTO CARD (Middle Center Right, Spans 2 cols, 1 row) ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 2',
                gridRow: 'span 1',
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid rgba(226, 232, 240, 0.95)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
                minHeight: 110,
              }}
            >
              <Image
                src="/images/model/model_3.jpg"
                alt="DUMEG Engineering Team"
                fill
                sizes="(max-width: 1024px) 50vw, 300px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 25%',
                }}
              />
            </div>

            {/* ── CARD 6: PHOTO CARD (Middle Right, Spans 3 cols, 1 row) ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 3',
                gridRow: 'span 1',
                background: '#ffffff',
                borderRadius: 24,
                border: '1px solid rgba(226, 232, 240, 0.95)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
                minHeight: 110,
              }}
            >
              <Image
                src="/images/model/model_2.jpg"
                alt="DUMEG Lead Software Engineer"
                fill
                sizes="(max-width: 1024px) 50vw, 400px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                }}
              />
            </div>

            {/* ── CARD 7: MISI 04 (Bottom Left, Spans 4 cols, 1 row) - Soft Lavender #E3E7FC ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 4',
                gridRow: 'span 1',
                background: '#E3E7FC',
                color: '#000000',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.6)',
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 14px 36px -4px rgba(0, 30, 100, 0.18)',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#FFFFFF',
                  border: '1px solid rgba(0, 86, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0056FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#0056FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  MISI 04
                </span>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginTop: 2, color: '#000000' }}>
                  Penguatan Logistik Nasional
                </h4>
                <p style={{ fontSize: 11.5, color: '#475569', marginTop: 2, lineHeight: 1.3 }}>
                  Konektivitas antar-dermaga dan terminal kargo.
                </p>
              </div>
            </div>

            {/* ── CARD 8: MISI 05 (Bottom Center, Spans 4 cols, 1 row) - Lime rgb(132, 204, 22) ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 4',
                gridRow: 'span 1',
                background: 'rgb(132, 204, 22)',
                color: '#000000',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 14px 36px -4px rgba(0, 30, 100, 0.18)',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'rgba(0, 0, 0, 0.12)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
              </div>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#ffffff',
                    background: '#000000',
                    padding: '3px 9px',
                    borderRadius: 999,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  MISI 05
                </span>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginTop: 4, color: '#000000' }}>
                  Transformasi Berkelanjutan
                </h4>
                <p style={{ fontSize: 11.5, color: 'rgba(0, 0, 0, 0.75)', marginTop: 2, lineHeight: 1.3 }}>
                  Modernisasi sistem pelayaran jangka panjang.
                </p>
              </div>
            </div>

            {/* ── CARD 9: MISI 06 (Bottom Right, Spans 4 cols, 1 row) - Azure Blue #2277FF ── */}
            <div
              className="bento-card"
              style={{
                gridColumn: 'span 4',
                gridRow: 'span 1',
                background: '#2277FF',
                color: '#FFFFFF',
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 14px 36px -4px rgba(0, 30, 100, 0.28)',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#2277FF',
                    background: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: 999,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  MISI 06
                </span>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginTop: 4, color: '#FFFFFF' }}>
                  Keputusan Real-Time
                </h4>
                <p style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.88)', marginTop: 2, lineHeight: 1.3 }}>
                  Dashboard analitik terpercaya tanpa jeda waktu.
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom Meta Bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 14,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            <span>DUMEG • PT DUTA META GRAHA</span>
            <span>2026 DIGITAL MARITIME BLUEPRINT</span>
          </div>
        </div>
      </ScrollExpand>

      {/* Responsive overrides */}
      <style>{`
        .bento-card {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        }
        .bento-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35) !important;
        }
        @media (max-width: 1024px) {
          .bento-container {
            grid-template-columns: repeat(6, 1fr) !important;
          }
          .bento-vision-card {
            grid-column: span 6 !important;
            grid-row: span 1 !important;
          }
          .bento-card {
            grid-column: span 3 !important;
          }
        }
        @media (max-width: 640px) {
          .bento-container {
            grid-template-columns: 1fr !important;
          }
          .bento-card {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
