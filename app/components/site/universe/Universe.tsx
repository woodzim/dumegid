'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UniverseItem } from './createUniverse';
import { CLIENTS, PROJECTS } from '../data/content';
import { getLenis } from '../SmoothScroll';

const SCREENS = ['karsa', 'hubdmg', 'hello-dumeg', 'narahubung', 'diittoo', 'ratih', 'docr', 'fay-ai', 'titecash', 'vet', 'semakmur', 'd-lsp', 'd-pos-lilo', 'lsp-tami'];

const ITEMS: UniverseItem[] = [
    ...PROJECTS.map((p) => ({ src: p.cover, label: p.name, href: `/work/${p.slug}` })),
    ...CLIENTS.filter((c) => !c.href).map((c) => ({ src: c.image, label: c.name, href: '/clients' })),
    ...SCREENS.map((id) => ({ src: `/screens/${id}.jpg`, label: id.replace(/-/g, ' ').toUpperCase(), href: '/work/ekosistem-internal' })),
];

/** Full-screen WebGL universe of every DUMEG product, with a hover label. */
export default function Universe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const [label, setLabel] = useState('');
    const router = useRouter();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        getLenis()?.stop();
        let handle: { dispose: () => void } | null = null;
        let cancelled = false;
        let current = '';
        import('./createUniverse').then(({ createUniverse }) => {
            if (cancelled) return;
            try {
                handle = createUniverse(
                    canvas,
                    ITEMS,
                    (item, x, y) => {
                        const next = item?.label ?? '';
                        if (next !== current) {
                            current = next;
                            setLabel(next);
                        }
                        if (labelRef.current) labelRef.current.style.transform = `translate(${x}px, ${y}px)`;
                    },
                    (item) => item.href && router.push(item.href),
                );
            } catch {
                /* no WebGL */
            }
        });
        return () => {
            cancelled = true;
            handle?.dispose();
            getLenis()?.start();
        };
    }, [router]);

    return (
        <div className="relative h-[100svh] overflow-hidden bg-[#0a0a0a] text-paper">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-grab touch-none" aria-hidden="true" />
            <div ref={labelRef} className="pointer-events-none absolute left-0 top-0" aria-hidden="true">
                {label && <span className="ml-3 inline-block -translate-y-1/2 bg-paper px-2 py-1 text-[10px] uppercase tracking-[0.04em] text-ink-strong">{label}</span>}
            </div>
            <div className="pointer-events-none absolute bottom-[var(--gutter)] left-[var(--gutter)] text-[11px] text-paper/70">
                ({ITEMS.length} sistem) · seret atau scroll untuk menjelajah
            </div>
        </div>
    );
}
