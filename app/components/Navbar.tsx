'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    // Glass bar stays over the hero; past it the bar turns solid ink so it reads on the light sections.
    const [solid, setSolid] = useState(false);

    useEffect(() => {
        const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className="dmg-header-float-wrapper">
            <div className={`dmg-header-glass-bar ${solid ? 'is-solid' : ''}`}>
                {/* Logo */}
                <Link href="/" className="dmg-nav-brand">
                    <div className="dmg-logo-icon">
                        <div className="dmg-logo-dot" />
                    </div>
                    <span className="dmg-logo-text">dumeg</span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="dmg-nav-links">
                    <a href="#visi-misi" className="dmg-nav-link">Visi &amp; Misi</a>
                    <a href="#layanan" className="dmg-nav-link">Layanan</a>
                    <a href="#asosiasi" className="dmg-nav-link">Asosiasi</a>
                    <a href="#ekosistem" className="dmg-nav-link">Ekosistem</a>
                    <a href="#tim" className="dmg-nav-link">Tim</a>
                    <a href="#kontak" className="dmg-nav-link">Kontak</a>
                </nav>

                {/* Right Button with accent arrow badge */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href="#kontak" className="dmg-header-cta-btn">
                        <span>Hubungi Kami</span>
                        <span className="dmg-cta-badge" aria-hidden="true">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M7 17L17 7" />
                                <path d="M7 7h10v10" />
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
        </header>
    );
}
