/**
 * Scroll timeline of the sky-launch tour. Durations are in `vh` of scroll, so
 * the section height is simply `TIMELINE.total` vh. Tune the pacing here.
 */
import { BAYS, STATIONS } from './content';

export const DURATION = {
    intro: 100, // section slides in, camera glides toward the vessel
    hero: 50, // hold on the vessel
    firstTravel: 80, // vessel -> first light
    travel: 45, // light -> next light
    station: 50, // hold on a light's monitor
    return: 90, // last light -> front window of the vessel
    enter: 60, // fly through the window into the cabin
    turn: 45, // rotate to the next cabin monitor
    swap: 22, // switch app on the same monitor
    app: 45, // hold on an app
    exit: 80, // monitors retract, camera backs out of the vessel
    launch: 120, // vessel and lights leave
    dive: 70, // camera sinks into the clouds, page fades into the next section
};

export type SegmentKind =
    | 'intro'
    | 'hero'
    | 'travel'
    | 'station'
    | 'return'
    | 'enter'
    | 'turn'
    | 'swap'
    | 'app'
    | 'exit'
    | 'launch'
    | 'dive';

export interface Segment {
    kind: SegmentKind;
    start: number;
    end: number;
    station?: number;
    bay?: number;
    app?: number;
}

export interface Timeline {
    segments: Segment[];
    total: number;
}

function build(): Timeline {
    const segments: Segment[] = [];
    let at = 0;
    const push = (kind: SegmentKind, dur: number, extra: Partial<Segment> = {}) => {
        segments.push({ kind, start: at, end: at + dur, ...extra });
        at += dur;
    };
    push('intro', DURATION.intro);
    push('hero', DURATION.hero);
    STATIONS.forEach((_, i) => {
        push('travel', i === 0 ? DURATION.firstTravel : DURATION.travel, { station: i });
        push('station', DURATION.station, { station: i });
    });
    push('return', DURATION.return);
    push('enter', DURATION.enter, { bay: 0, app: 0 });
    BAYS.forEach((bay, b) => {
        bay.apps.forEach((_, a) => {
            if (a === 0 && b > 0) push('turn', DURATION.turn, { bay: b, app: 0 });
            if (a > 0) push('swap', DURATION.swap, { bay: b, app: a });
            push('app', DURATION.app, { bay: b, app: a });
        });
    });
    push('exit', DURATION.exit);
    push('launch', DURATION.launch);
    push('dive', DURATION.dive);
    return { segments, total: at };
}

export const TIMELINE: Timeline = build();

export interface TourSample {
    seg: Segment;
    index: number;
    /** 0..1 inside the segment */
    s: number;
    /** absolute position in vh units */
    u: number;
}

export function sampleTimeline(u: number, tl: Timeline = TIMELINE): TourSample {
    const x = Math.min(Math.max(u, 0), tl.total - 1e-6);
    const segs = tl.segments;
    // binary search
    let lo = 0;
    let hi = segs.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (segs[mid].end <= x) lo = mid + 1;
        else hi = mid;
    }
    const seg = segs[lo];
    return { seg, index: lo, s: (x - seg.start) / (seg.end - seg.start), u: x };
}

/** Start (in vh units) of the first segment of a kind, handy for overlays. */
export function segmentStart(kind: SegmentKind, tl: Timeline = TIMELINE): number {
    return tl.segments.find((s) => s.kind === kind)?.start ?? 0;
}
