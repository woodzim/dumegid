'use client';

import { useState, useEffect } from 'react';

export default function FooterSection() {
    const [year, setYear] = useState('2025');

    useEffect(() => {
        setYear(new Date().getFullYear().toString());
    }, []);

    return (
        <footer style={{
            position: 'relative',
            paddingTop: 60,
            paddingBottom: 48,
            overflow: 'hidden',
        }}>
            {/* Giant DUMEG Watermark on light/white gradient bottom */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                userSelect: 'none',
                pointerEvents: 'none',
                paddingBottom: 24,
            }}>
                <div
                    className="dmg-watermark"
                    style={{
                        color: 'rgba(60, 78, 239, 0.14)',
                    }}
                >
                    DUMEG
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="dmg-container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    paddingTop: 24,
                    borderTop: '1px solid rgba(8, 14, 58, 0.1)',
                    fontSize: 13,
                    color: '#64748b',
                    fontWeight: 500,
                }}>
                    <div>
                        &copy; {year} PT Duta Meta Graha (DUMEG). Hak Cipta Dilindungi.
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <a href="#layanan" style={{ color: '#475569', textDecoration: 'none' }}>Layanan</a>
                        <a href="#ekosistem" style={{ color: '#475569', textDecoration: 'none' }}>Ekosistem</a>
                        <a href="#fitur" style={{ color: '#475569', textDecoration: 'none' }}>Misi</a>
                        <a href="#tim" style={{ color: '#475569', textDecoration: 'none' }}>Tim</a>
                        <a href="#kontak" style={{ color: '#475569', textDecoration: 'none' }}>Kontak</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
