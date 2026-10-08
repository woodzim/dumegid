'use client';

import ScrollExpand from './ScrollExpand';

interface MissionItem {
  number: string;
  title: string;
  desc: string;
  span: number;
}

const MISSIONS: MissionItem[] = [
  {
    number: '01',
    title: 'Sistem Digital Efisien dan Aman',
    desc: 'Mengembangkan sistem digital yang efisien, aman, dan mudah digunakan untuk seluruh operasional maritim.',
    span: 2,
  },
  {
    number: '02',
    title: 'Layanan Responsif Industri',
    desc: 'Menyediakan layanan responsif yang disesuaikan secara presisi dengan kebutuhan spesifik industri.',
    span: 1,
  },
  {
    number: '03',
    title: 'Transparansi dan Akurasi Data',
    desc: 'Mendorong transparansi operasional dan akurasi data kepelabuhanan.',
    span: 1,
  },
  {
    number: '04',
    title: 'Penguatan Ekosistem Logistik',
    desc: 'Memperkuat ekosistem logistik nasional secara terintegrasi melalui pemanfaatan teknologi.',
    span: 1,
  },
  {
    number: '05',
    title: 'Transformasi Berkelanjutan',
    desc: 'Mendukung transformasi digital berkelanjutan di sektor pelabuhan dan pelayaran.',
    span: 1,
  },
  {
    number: '06',
    title: 'Keputusan Berbasis Data Real-Time',
    desc: 'Meningkatkan pengambilan keputusan dengan data operasional real-time yang andal.',
    span: 2,
  },
];

export default function VisionMissionSection() {
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
        src="#080e3a"
        title="VISI & MISI"
        scrollHint="SCROLL ↓"
        startWidth={40}
        startHeight={54}
        startRadius={20}
        endRadius={0}
        mediaZoom={1.05}
        scrollDistance={1.4}
        holdDistance={0.9}
        smoothing={0.1}
        overlayScrim={0}
        scrimClassName="bg-transparent"
        overlayClassName="absolute inset-0 flex flex-col items-center justify-between"
        useWindowScroll={true}
      >
        <div
          className="w-full flex flex-col h-full select-none"
          style={{
            maxWidth: 1240,
            width: '100%',
            margin: '0 auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: 'var(--font-main)',
            paddingTop: 96,
            paddingBottom: 40,
            paddingLeft: 24,
            paddingRight: 24,
            boxSizing: 'border-box',
          }}
        >
          {/* ── Vision Block: centered ── */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 56,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: 'rgba(255, 255, 255, 0.48)',
                marginBottom: 20,
              }}
            >
              Visi Perusahaan
            </span>
            <p
              style={{
                fontSize: 'clamp(20px, 2.4vw, 32px)',
                fontFamily: 'var(--font-main)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.36,
                letterSpacing: '-0.02em',
                maxWidth: 720,
                margin: '0 auto',
              }}
            >
              Menjadi penyedia solusi digital terdepan dalam industri maritim
              dan logistik global, menghadirkan inovasi teknologi yang
              mengakselerasi transformasi digital pada operasional
              kepelabuhanan.
            </p>
          </div>

          {/* ── Mission Bento Grid ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255, 255, 255, 0.48)',
                }}
              >
                6 Pilar Misi
              </span>
            </div>

            <div
              className="vm-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 4,
                flex: 1,
              }}
            >
              {MISSIONS.map((item, idx) => {
                const isAccent = idx === 0 || idx === 5;
                return (
                  <div
                    key={item.number}
                    className="vm-card"
                    style={{
                      gridColumn: `span ${item.span}`,
                      backgroundColor: isAccent
                        ? 'rgba(60, 78, 239, 0.52)'
                        : 'rgba(255, 255, 255, 0.04)',
                      padding: 28,
                      borderRadius: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      minHeight: 'clamp(148px, 18vh, 192px)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Large background number */}
                    <span
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: 16,
                        fontSize: 96,
                        fontWeight: 700,
                        fontFamily: 'var(--font-main)',
                        lineHeight: 1,
                        color: isAccent
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(255, 255, 255, 0.04)',
                        letterSpacing: '-0.04em',
                        userSelect: 'none',
                        pointerEvents: 'none',
                      }}
                    >
                      {item.number}
                    </span>

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h4
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          fontFamily: 'var(--font-main)',
                          color: '#ffffff',
                          lineHeight: 1.32,
                          marginBottom: 8,
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 13,
                          fontFamily: 'var(--font-main)',
                          color: 'rgba(255, 255, 255, 0.56)',
                          lineHeight: 1.52,
                          fontWeight: 400,
                          maxWidth: 400,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 24,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255, 255, 255, 0.24)',
            }}
          >
            <span>DUMEG Digital Maritime</span>
            <span className="vm-bottom-right">2026</span>
          </div>
        </div>
      </ScrollExpand>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .vm-grid {
            grid-template-columns: 1fr !important;
          }
          .vm-grid > div {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 480px) {
          .vm-bottom-right {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
