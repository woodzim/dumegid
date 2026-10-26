'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ScrollExpand from './ScrollExpand';
import { Asterisk, Notch } from './DmgKit';

const MISSIONS = [
  { title: 'Sistem Digital Efisien & Aman', sub: 'Bongkar muat & kepelabuhanan' },
  { title: 'Responsif Industri', sub: 'Sesuai kebutuhan lapangan' },
  { title: 'Penguatan Logistik Nasional', sub: 'Antar-dermaga & terminal kargo' },
  { title: 'Transformasi Berkelanjutan', sub: 'Modernisasi sistem pelayaran' },
  { title: 'Keputusan Real-Time', sub: 'Dashboard analitik tanpa jeda' },
];

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

  const missionCard = (m: (typeof MISSIONS)[number], i: number) => (
    <div key={m.title} className="dmg-card vm-card vm-mission">
      <Notch corner="tr">Misi</Notch>
      <div className="dmg-num vm-fraction">
        {i + 1}/{MISSIONS.length}
      </div>
      <div>
        <h4 className="dmg-mono vm-mission-title">{m.title}</h4>
        <p className="dmg-label vm-mission-sub">{m.sub}</p>
      </div>
    </div>
  );

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
        src="var(--dmg-bg)"
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
        hintClassName="text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)] font-bold tracking-widest text-[0.75rem]"
        startWidth={40}
        startHeight={54}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.05}
        scrollDistance={1.4}
        holdDistance={0.9}
        smoothing={0.1}
        overlayScrim={0}
        overlayClassName="absolute inset-0 flex flex-col"
        useWindowScroll={true}
      >
        <div className="vm-wrap select-none">
          <div className="vm-grid">
            {/* Vision: accent feature card */}
            <div className="dmg-card dmg-card-accent vm-card vm-vision">
              <Notch corner="tl" className="dmg-notch-icon">
                <Asterisk size={28} />
              </Notch>

              <div className="vm-vision-top">
                <div className="dmg-num vm-clock">{timeStr}</div>
                <div className="dmg-mono vm-date">{dateStr} / WIB</div>
              </div>

              <div className="vm-vision-body">
                <span className="dmg-mono vm-kicker">Visi DUMEG</span>
                <h3 className="vm-vision-title">
                  Menjadi penyedia solusi digital terdepan dalam industri maritim &amp; logistik global.
                </h3>
                <p className="dmg-mono vm-vision-desc">
                  Inovasi teknologi yang mengakselerasi transformasi digital operasional kepelabuhanan di seluruh Nusantara.
                </p>
              </div>

              <Notch corner="br">dumeg.id</Notch>
            </div>

            {missionCard(MISSIONS[0], 0)}
            {missionCard(MISSIONS[1], 1)}
            {missionCard(MISSIONS[2], 2)}

            {/* Photo */}
            <div className="dmg-card dmg-card-photo vm-card vm-photo">
              <Image
                src="/images/model/model_1.jpg"
                alt="Engineer DUMEG di lapangan"
                fill
                sizes="(max-width: 1024px) 50vw, 320px"
                style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
              />
              <Notch corner="br">Tim DUMEG</Notch>
            </div>

            {missionCard(MISSIONS[3], 3)}
            {missionCard(MISSIONS[4], 4)}

            {/* Focus: ink card */}
            <div className="dmg-card dmg-card-dark vm-card vm-focus">
              <Notch corner="tr" style={{ width: '36%' }} />
              <div>
                <span className="dmg-mono vm-focus-label">Fokus:</span>
                <div className="dmg-mono vm-focus-value">
                  Tally digital
                  <br />
                  Pelabuhan &amp; logistik
                </div>
              </div>
              <div className="vm-focus-foot">
                <div>
                  <span className="dmg-mono vm-focus-label">Entitas:</span>
                  <div className="dmg-mono vm-focus-small">PT Duta Meta Graha</div>
                </div>
                <div className="dmg-mono vm-focus-small vm-focus-tag">[2026 Digital Maritime Blueprint]</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollExpand>

      <style>{`
        .vm-wrap {
          width: 100%;
          max-width: var(--dmg-max);
          height: 100%;
          margin: 0 auto;
          padding: 88px var(--dmg-gutter) 24px;
          display: flex;
          flex-direction: column;
          color: var(--dmg-ink);
        }
        .vm-grid {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-template-rows: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .vm-card {
          grid-column: span 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }
        .vm-vision {
          grid-column: span 6;
          grid-row: span 2;
          padding: 28px;
        }
        .vm-focus { grid-column: span 6; }

        .vm-vision-top {
          align-self: flex-end;
          text-align: right;
        }
        .vm-clock { font-size: clamp(36px, 4.4vw, 64px); }
        .vm-date { font-size: 10px; margin-top: 8px; }
        .vm-vision-body { max-width: 560px; padding-bottom: 32px; }
        .vm-kicker { display: block; font-size: 10.5px; margin-bottom: 16px; }
        .vm-vision-title {
          font-family: var(--font-main);
          font-size: clamp(24px, 2.7vw, 40px);
          font-weight: 400;
          line-height: 1.04;
          letter-spacing: -0.035em;
        }
        .vm-vision-desc {
          font-size: 10px;
          line-height: 1.7;
          margin-top: 16px;
          max-width: 420px;
        }

        .vm-fraction { font-size: clamp(32px, 3.4vw, 52px); }
        .vm-mission-title {
          font-size: clamp(11px, 1vw, 14px);
          line-height: 1.3;
          font-weight: 400;
        }
        .vm-mission-sub { margin-top: 8px; font-size: 9.5px; }

        .vm-focus { padding: 28px; }
        .vm-focus-label { display: block; font-size: 10px; color: var(--dmg-on-dark-soft); margin-bottom: 8px; }
        .vm-focus-value { font-size: clamp(16px, 1.8vw, 26px); line-height: 1.2; }
        .vm-focus-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
        .vm-focus-small { font-size: 11px; }
        .vm-focus-tag { color: var(--dmg-accent); text-align: right; }

        @media (max-width: 1024px) {
          .vm-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
          }
          .vm-card { grid-column: span 2; }
          .vm-vision { grid-column: span 6; grid-row: span 1; }
          .vm-focus { grid-column: span 2; padding: 24px; }
          .vm-photo, .vm-vision-desc, .vm-focus-foot { display: none; }
          .vm-vision-body { padding-bottom: 0; }
        }
        @media (max-width: 640px) {
          .vm-wrap { padding: 84px 12px 16px; }
          .vm-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: auto repeat(3, minmax(0, 1fr));
            gap: 8px;
          }
          .vm-card { grid-column: span 1; padding: 16px; }
          .vm-vision { grid-column: span 2; padding: 56px 20px 20px; justify-content: flex-end; }
          .vm-vision-top { display: none; }
          .vm-vision-title { font-size: 22px; }
          .vm-focus { grid-column: span 1; padding: 16px; }
          .vm-mission .dmg-notch { display: none; }
          .vm-mission-sub { display: none; }
          .vm-fraction { font-size: 28px; }
          .vm-focus-value { font-size: 12px; }
          .vm-vision > .dmg-notch-br { display: none; }
        }
      `}</style>
    </section>
  );
}
