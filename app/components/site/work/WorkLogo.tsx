import Image from 'next/image';
import type { WorkItem, WorkIcon } from '../data/content';

/** Line icons (24px grid) for systems that have no logo of their own yet. */
const ICONS: Record<WorkIcon, React.ReactNode> = {
    truck: (
        <>
            <path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z" />
            <circle cx="6" cy="17" r="1.8" />
            <circle cx="17" cy="17" r="1.8" />
        </>
    ),
    pin: (
        <>
            <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
            <circle cx="12" cy="10" r="2.4" />
        </>
    ),
    scale: (
        <>
            <path d="M5 8h14l2 12H3z" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 12v3l2 1" />
        </>
    ),
    crane: <path d="M5 21V4h2v17M3 21h8M7 5h13M7 5l4-2M18 5v5M16.5 10h3v3h-3z" />,
    clipboard: (
        <>
            <path d="M8 4h8v3H8z" />
            <path d="M8 5.5H5V21h14V5.5h-3M8.5 12l2 2 4.5-4.5M8.5 17.5h7" />
        </>
    ),
    phone: (
        <>
            <path d="M7 2.5h10v19H7z" />
            <path d="M10.5 18.5h3M9.5 8l1.5 1.5 3-3" />
        </>
    ),
    boxes: <path d="M3 13h8v8H3zM13 13h8v8h-8zM8 4h8v9H8zM12 4v3" />,
    calendar: (
        <>
            <path d="M3.5 5.5h17V21h-17zM3.5 10h17M8 3v4M16 3v4" />
            <path d="M8 14.5h2M14 14.5h2M8 17.5h2" />
        </>
    ),
    monitor: (
        <>
            <path d="M2.5 4h19v12.5h-19zM9 20.5h6M12 16.5v4" />
            <path d="M6 13l3.5-3.5 2.5 2.5 5-5" />
        </>
    ),
    transfer: <path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" />,
    mine: <path d="M2 20l7-11 4 6 2.5-3.5L22 20zM8 4.5l3 3M11 4.5l-3 3" />,
    anchor: (
        <>
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v14M8 10.5h8M4.5 13.5a7.5 7.5 0 0 0 15 0" />
        </>
    ),
};

/**
 * The logo slot of a work tile, always 48px tall:
 * official lockup image, a letter monogram in the product's colour, or a neutral line icon.
 */
export default function WorkLogo({ w }: { w: Pick<WorkItem, 'name' | 'logo' | 'mark' | 'icon'> }) {
    if (w.logo)
        return (
            <div className="relative h-12 w-full max-w-[220px]">
                <Image src={w.logo} alt={`Logo ${w.name}`} fill sizes="220px" className="object-contain object-left" />
            </div>
        );
    if (w.mark)
        return (
            <span className="flex size-12 items-center justify-center rounded-[11px] text-[22px] font-bold leading-none text-white" style={{ background: w.mark.color }} role="img" aria-label={`Logo ${w.name}`}>
                {w.mark.letter}
            </span>
        );
    return (
        <span className="flex size-12 items-center justify-center rounded-[11px] border border-ink/15 bg-paper text-ink-strong" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[w.icon ?? 'boxes']}
            </svg>
        </span>
    );
}
