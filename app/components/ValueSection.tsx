'use client';
import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass = '', className = '', ...rest }, ref) => (
    <div
        ref={ref}
        {...rest}
        className={`rounded-3xl bg-[#0a0d14] text-white p-8 flex flex-col justify-between select-none shadow-2xl ${customClass} ${className}`.trim()}
    />
));
Card.displayName = 'Card';

export interface CardSwapProps {
    children?: React.ReactNode;
    [key: string]: any;
}

export function CardSwap({ children }: CardSwapProps) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{children}</div>;
}

export interface CardData {
    num: string;
    title: string;
    desc: string;
    bg: string;
    textColor: string;
    descColor: string;
    lineColor: string;
    hasRings?: boolean;
    shadowHover?: string;
}

const VALUE_ITEMS: CardData[] = [
    {
        num: '01',
        title: 'End-to-End Integration',
        desc: 'Menghubungkan aset fisik (kapal, truk, gudang) langsung dengan dashboard manajemen melalui IoT dan kecerdasan buatan.',
        bg: 'bg-[#004EE0]',
        textColor: 'text-white',
        descColor: 'text-white/90',
        lineColor: 'bg-white',
        shadowHover: 'hover:shadow-[#004EE0]/30',
    },
    {
        num: '02',
        title: 'Multi-Platform Access',
        desc: 'Akses mudah dari berbagai perangkat—Web, Mobile (iOS/Android), hingga Perangkat IoT khusus.',
        bg: 'bg-[#E3F2FF]',
        textColor: 'text-[#042E7B]',
        descColor: 'text-[#042E7B]/80',
        lineColor: 'bg-[#042E7B]',
        shadowHover: 'hover:shadow-[#004EE0]/15',
    },
    {
        num: '03',
        title: 'Penyederhanaan Silo Data',
        desc: 'Informasi tersentralisasi demi percepatan siklus operasional serta menekan Dwelling Time & Demurrage.',
        bg: 'bg-[#042E7B]',
        textColor: 'text-white',
        descColor: 'text-white/85',
        lineColor: 'bg-[#99CAFF]',
        hasRings: true,
        shadowHover: 'hover:shadow-[#042E7B]/40',
    },
    {
        num: '04',
        title: 'Kepatuhan & Standardisasi',
        desc: 'Didukung oleh sistem sertifikasi profesi (LSP) dan kepatuhan penuh terhadap asosiasi industri nasional.',
        bg: 'bg-[#E3F2FF]',
        textColor: 'text-[#042E7B]',
        descColor: 'text-[#042E7B]/80',
        lineColor: 'bg-[#042E7B]',
        shadowHover: 'hover:shadow-[#004EE0]/15',
    },
];

export default function ValueSection() {
    return (
        <section className="bg-white py-16 md:py-24 text-[#111111] overflow-hidden font-sans border-t border-[#111]">
            <div className="w-full px-6 sm:px-10">
                {/* Header section */}
                <div className="mb-12 md:mb-16 max-w-3xl">

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.1] text-[#111111] mb-5">
                        Mengapa{' '}
                        <span style={{ fontFamily: "'Melodrame', 'Georgia', serif", fontStyle: 'italic' }} className="font-normal">
                            Bermitra
                        </span>{' '}
                        dengan DUMEG{' '}
                        <span style={{ fontFamily: "'Melodrame', 'Georgia', serif", fontStyle: 'italic' }} className="font-normal">
                            Digital Ecosystem
                        </span>
                        ?
                    </h2>

                    <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl">
                        Solusi maritim dan logistik terpadu untuk efisiensi tinggi, meminimalisir keterlambatan, dan memberikan kontrol penuh atas seluruh rantai pasok.
                    </p>
                </div>

                {/* 4 Pillars Card Layout - Matching exact 40px side padding of other sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                    {VALUE_ITEMS.map((item) => (
                        <div
                            key={item.num}
                            className={`relative ${item.bg} ${item.textColor} rounded-[32px] p-8 lg:p-9 flex flex-col justify-between min-h-[440px] sm:min-h-[480px] lg:min-h-[510px] transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-2xl ${item.shadowHover} group select-none overflow-hidden`}
                        >
                            {/* Decorative Concentric Rings overlay for Card 03 */}
                            {item.hasRings && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    <svg
                                        className="absolute right-[-25%] bottom-[-15%] w-[140%] h-[140%] text-white/20 transition-transform duration-700 ease-out group-hover:scale-105"
                                        viewBox="0 0 400 400"
                                        fill="none"
                                    >
                                        <circle cx="270" cy="250" r="170" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.25" />
                                        <circle cx="270" cy="250" r="130" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.2" />
                                        <circle cx="270" cy="250" r="90" stroke="currentColor" strokeWidth="1" strokeOpacity="0.18" />
                                        <circle cx="210" cy="190" r="150" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
                                        <circle cx="310" cy="310" r="110" stroke="#99CAFF" strokeWidth="1.2" strokeOpacity="0.4" />
                                    </svg>
                                </div>
                            )}

                            {/* Top Content */}
                            <div className="relative z-10">
                                <h3 className="text-2xl lg:text-[26px] font-bold tracking-tight mb-3 leading-snug">
                                    {item.title}
                                </h3>
                                <p className={`text-sm lg:text-[15px] leading-relaxed ${item.descColor} font-normal`}>
                                    {item.desc}
                                </p>
                            </div>

                            {/* Bottom Content: Huge Number & Underline */}
                            <div className="relative z-10 mt-8 pt-4">
                                <span
                                    style={{ fontFamily: "'Melodrame', 'Georgia', serif" }}
                                    className="block text-7xl sm:text-7xl lg:text-8xl font-normal tracking-tight leading-none"
                                >
                                    {item.num}
                                </span>
                                <div className={`h-[3.5px] w-full ${item.lineColor} mt-3.5 rounded-full`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

