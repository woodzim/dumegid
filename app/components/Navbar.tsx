'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="dmg-header-float-wrapper">
            <div className="dmg-header-glass-bar">
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

                {/* Right Button (Matching reference with lime arrow badge) */}
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