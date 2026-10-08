'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

export interface AccordionItem {
  image: string;
  label: string;
  alt?: string;
  link?: string;
  abbr?: string;
  fullName?: string;
  systemName?: string;
  description?: string;
  scope?: string;
  keyFacts?: { label: string; value: string }[];
  accentColor?: string;
}

export interface AccordionGalleryProps {
  items: AccordionItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  onActiveChange?: (index: number) => void;
}

export default function AccordionGallery({
  items,
  defaultIndex = 0,
  accentColor = '#3c4eef',
  overlayColor = '#060e3a',
  textColor = '#ffffff',
  height = 480,
  gap = 12,
  radius = 20,
  expandRatio = 0.48,
  orientation = 'horizontal',
  duration = 0.65,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 6,
  stagger = 0.05,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
  onActiveChange,
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const overlay = overlayRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              filter: isActive
                ? 'grayscale(0%) brightness(100%) contrast(100%)'
                : 'grayscale(100%) brightness(75%) contrast(95%)',
              duration: dur,
              ease,
            },
            0
          );
        }

        if (overlay) {
          tl.to(
            overlay,
            {
              opacity: isActive ? 0 : 1,
              duration: dur,
              ease,
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced,
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.25);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleActive = (i: number) => {
    setActive(i);
    onActiveChange?.(i);
  };

  const handleEnter = (i: number) => {
    if (trigger === 'hover') handleActive(i);
  };

  const handleClick = (i: number, e: React.MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      handleActive(i);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`flex ${
        vertical ? 'flex-col' : 'flex-row'
      } w-full max-w-full [perspective:1400px] max-[640px]:!flex-col max-[640px]:[perspective:none] ${className}`}
      style={{
        gap: `${gap}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
      }}
      role="list"
      aria-label="Portfolio Asosiasi Gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const currentAccent = item.accentColor || accentColor;
        const Tag = item.link ? 'a' : 'div';

        return (
          <Tag
            key={item.label + i}
            ref={(el: HTMLElement | null) => {
              panelRefs.current[i] = el;
            }}
            className="group relative block min-w-0 min-h-0 flex-[1_1_0] cursor-pointer overflow-hidden bg-[#070e3a] no-underline outline-none [transform-style:preserve-3d] [transform-origin:center] [box-shadow:0_12px_36px_-12px_rgba(0,0,0,0.6)] focus-visible:[box-shadow:0_0_0_2px_var(--ag-accent),0_12px_36px_-12px_rgba(0,0,0,0.6)] max-[640px]:min-h-[96px] max-[640px]:!transform-none"
            style={{
              borderRadius: `${radius}px`,
              border: isActive ? `1px solid rgba(255,255,255,0.4)` : `1px solid rgba(255,255,255,0.08)`,
              boxShadow: isActive
                ? `0 20px 40px -12px ${currentAccent}35, 0 12px 30px -10px rgba(0,0,0,0.7)`
                : '0 12px 28px -10px rgba(0,0,0,0.5)',
              willChange: 'flex-grow, transform',
            }}
            href={item.link || undefined}
            onClick={(e) => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => handleActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            {/* Background Media */}
            <span className="absolute inset-0 overflow-hidden [border-radius:inherit]">
              <span
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: vertical ? '100%' : 'var(--ag-media-size, 320px)',
                  height: vertical ? 'var(--ag-media-size, 320px)' : '100%',
                  willChange: 'transform, filter',
                  filter: isActive ? 'grayscale(0%) brightness(100%)' : 'grayscale(100%) brightness(75%)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  draggable="false"
                  className="block h-full w-full select-none object-cover [-webkit-user-drag:none]"
                />
              </span>

              {/* Inactive card dim/faded overlay - hidden (opacity 0) when card is active */}
              <span
                ref={(el) => {
                  overlayRefs.current[i] = el;
                }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `color-mix(in srgb, ${overlayColor} 65%, transparent)`,
                  opacity: isActive ? 0 : 1,
                  willChange: 'opacity',
                }}
                aria-hidden="true"
              />

              {/* Active card bottom gradient scrim so text remains readable without muting the main visual */}
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(to top, rgba(3, 7, 28, 0.85) 0%, rgba(3, 7, 28, 0.3) 50%, transparent 100%)',
                  opacity: isActive ? 1 : 0,
                }}
                aria-hidden="true"
              />
            </span>

            {/* Permanent subtle badge when inactive */}
            {!isActive && (
              <span
                className="pointer-events-none absolute bottom-4 left-4 z-[1] flex items-center gap-2 max-[640px]:hidden"
                aria-hidden="true"
              >
                <span
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.abbr || item.label}
                </span>
              </span>
            )}

            {/* Animated Bar & Label When Active */}
            {showLabels && (
              <span
                className="pointer-events-none absolute bottom-6 left-6 right-6 z-[2] flex items-center gap-3"
                aria-hidden="true"
              >
                <span
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  className="h-[30px] w-[4px] flex-none rounded-[4px] opacity-0"
                  style={{
                    background: currentAccent,
                    boxShadow: `0 0 16px ${currentAccent}`,
                  }}
                />
                <div
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                  className="overflow-hidden opacity-0"
                >
                  <span
                    className="block text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: currentAccent }}
                  >
                    {item.abbr || 'ASOSIASI'}
                  </span>
                  <span
                    className="block overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(1.1rem,1.6vw,1.5rem)] font-bold tracking-[-0.01em] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]"
                    style={{ color: textColor }}
                  >
                    {item.label}
                  </span>
                </div>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}
