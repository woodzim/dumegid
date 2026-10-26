import type { CSSProperties, ReactNode } from 'react';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

/**
 * Cut-out tab on a card corner with inverted rounded joins (reference "REMOTE" tab).
 * Its fill must match whatever sits behind the card, set through `--notch-bg`.
 */
export function Notch({
    corner = 'tr',
    children,
    className = '',
    style,
}: {
    corner?: Corner;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <span className={`dmg-notch dmg-notch-${corner} ${className}`.trim()} style={style}>
            {children}
        </span>
    );
}

/** Thin eight-arm asterisk glyph. */
export function Asterisk({ size = '1em', className = '' }: { size?: number | string; className?: string }) {
    return (
        <svg
            className={`dmg-asterisk ${className}`.trim()}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="square"
            aria-hidden="true"
        >
            <path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2L4.2 19.8" />
        </svg>
    );
}

/** Solid half disc used as an inline headline mark. */
export function HalfDisc({ className = '' }: { className?: string }) {
    return <span className={`dmg-halfdisc ${className}`.trim()} aria-hidden="true" />;
}

/** Half disc + asterisk pair, kept on one line when the headline wraps. */
export function Marks() {
    return (
        <span style={{ whiteSpace: 'nowrap' }}>
            <HalfDisc />
            <Asterisk />
        </span>
    );
}

/** Section header: indexed mono label row, large display title, optional aside. */
export function SectionHead({
    index,
    label,
    title,
    aside,
}: {
    index: string;
    label: string;
    title: ReactNode;
    aside?: ReactNode;
}) {
    return (
        <div className="dmg-sec-head">
            <div className="dmg-sec-meta">
                <span>({index})</span>
                <span>{label}</span>
                <span className="dmg-sec-meta-end">DUMEG.ID</span>
            </div>
            <div className="dmg-sec-row">
                <h2 className="dmg-display">{title}</h2>
                {aside ? <div className="dmg-sec-aside">{aside}</div> : null}
            </div>
        </div>
    );
}

/** Circular icon button (reference "MENU" circle). */
export function CircleButton({
    onClick,
    label,
    direction,
    tone = 'dark',
}: {
    onClick: () => void;
    label: string;
    direction: 'prev' | 'next';
    tone?: 'dark' | 'light';
}) {
    return (
        <button type="button" onClick={onClick} className={`dmg-circle-btn dmg-circle-btn-${tone}`} aria-label={label}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {direction === 'prev' ? <path d="M19 12H5M11 18l-6-6 6-6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
            </svg>
        </button>
    );
}
