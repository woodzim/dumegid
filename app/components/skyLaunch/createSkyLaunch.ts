import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BAYS, STATIONS } from './content';
import { sampleTimeline, type SegmentKind, type TourSample } from './timeline';

/**
 * Scroll-driven tour rendered from /models/dumeg-skyship.glb.
 *
 *   hero      the vessel waits in the cloud sea, nine lights hover behind it
 *   stations  the camera visits each light; a convex monitor shows its website
 *   cabin     the camera flies through the front window; four monitors (HR,
 *             Utilitas, Finance, Bisnis) cycle through their apps
 *   departure the camera backs out, the vessel and the lights leave, the camera
 *             sinks into the clouds and the page continues
 *
 * Framework-agnostic: React feeds `setScroll(u)` with u in vh of scroll (see timeline.ts).
 */

export interface SkyLaunchOptions {
    modelUrl: string;
    reducedMotion?: boolean;
    onReady?: () => void;
    onError?: (err: unknown) => void;
}

export interface SkyLaunchHandle {
    setScroll: (u: number) => void;
    setActive: (active: boolean) => void;
    resize: () => void;
    dispose: () => void;
}

// ------------------------------------------------------------------ math helpers
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
};
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Pose {
    pos: THREE.Vector3;
    target: THREE.Vector3;
}
const pose = (px: number, py: number, pz: number, tx: number, ty: number, tz: number): Pose => ({
    pos: new THREE.Vector3(px, py, pz),
    target: new THREE.Vector3(tx, ty, tz),
});
const lerpPose = (a: Pose, b: Pose, t: number, out: Pose, arc = 0) => {
    out.pos.lerpVectors(a.pos, b.pos, t);
    out.target.lerpVectors(a.target, b.target, t);
    if (arc) out.pos.y += Math.sin(Math.PI * t) * arc;
    return out;
};

// ------------------------------------------------------------------ scene constants
const PAD_Y = 0.9; // vessel sits slightly above the cloud sea
const SUN_DIR = new THREE.Vector3(0.493, 0.531, -0.691).normalize();
const INTRO = pose(0, 6.4, 33, 0, 4.4, 0);
const HERO = pose(0, 4.1, 23, 0, 5.0, 0);
const FRONT = pose(0, PAD_Y + 4.85, 8.5, 0, PAD_Y + 4.85, 0);
const EXIT = pose(0, 4.6, 24, 0, 5.0, 0);

const STATION_W = 16; // world width of a station monitor
const CABIN_Y = 4.85; // ship-local height of the cabin monitors
const CABIN_R = 0.98; // ship-local radius of the cabin monitors
const CABIN_W = 1.15;
const MON_RATIO = 0.625; // 16:10
const MON_SAG = 0.05; // matches the GLB template
const bayAngle = (b: number) => Math.PI - (b * Math.PI) / 2; // HR at -Z, then clockwise

const ORDER: SegmentKind[] = ['intro', 'hero', 'travel', 'station', 'return', 'enter', 'turn', 'swap', 'app', 'exit', 'launch', 'dive'];

// Flat list of every screen in tour order, used to prefetch textures.
const SCREEN_ORDER: string[] = [...STATIONS.map((s) => s.screen), ...BAYS.flatMap((b) => b.apps.map((a) => a.screen))];
const BAY_OFFSET = BAYS.reduce<number[]>((acc, _b, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + BAYS[i - 1].apps.length);
    return acc;
}, []);

// ------------------------------------------------------------------ shaders
const CLOUD_VERT = /* glsl */ `
    attribute vec3 _center;
    attribute vec4 color;
    uniform float uTime;
    uniform float uPlume;
    uniform float uIsPlume;
    varying vec2 vUv;
    varying vec3 vTint;
    varying float vFog;
    varying float vNear;
    varying float vLift;

    float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }

    void main() {
        vUv = uv;
        vTint = color.rgb;
        vec3 offset = position - _center;
        vec3 c = _center;
        float h = hash(_center);
        float grow = 1.0;
        vLift = 0.0;
        if (uIsPlume > 0.5) {
            vec2 dir = normalize(c.xz + 0.0001);
            float k = uPlume * (0.6 + 0.8 * h);
            c.xz += dir * k * (1.6 + 3.0 * h);
            c.y += k * (1.0 + 3.2 * h) + sin(uTime * 0.6 + h * 6.28) * 0.12 * uPlume;
            grow = 1.0 + k * 1.0;
            vLift = k;
        } else {
            c.x += sin(uTime * 0.05 + h * 6.28) * 0.6 + uTime * 0.12;
        }
        vec4 mv = modelViewMatrix * vec4(c, 1.0);
        mv.xy += offset.xy * grow;
        gl_Position = projectionMatrix * mv;
        float d = -mv.z;
        vFog = smoothstep(70.0, 460.0, d) * 0.88;
        vNear = smoothstep(0.6, 4.0, d);
    }
`;

const CLOUD_FRAG = /* glsl */ `
    uniform sampler2D map;
    uniform vec3 uFogColor;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vTint;
    varying float vFog;
    varying float vNear;
    varying float vLift;

    void main() {
        vec4 t = texture2D(map, vUv);
        vec3 col = t.rgb * vTint;
        col = mix(col, uFogColor, vFog);
        float a = t.a * uOpacity * vNear * (1.0 - vLift * 0.35);
        if (a < 0.003) discard;
        gl_FragColor = vec4(col, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`;

const SCREEN_VERT = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const SCREEN_FRAG = /* glsl */ `
    uniform sampler2D mapA;
    uniform sampler2D mapB;
    uniform float hasA;
    uniform float hasB;
    uniform float aspA;
    uniform float aspB;
    uniform float scrollA;
    uniform float scrollB;
    uniform float uMix;
    uniform float uPower;
    uniform float uTime;
    varying vec2 vUv;
    const float SCREEN = 1.6;

    // width-fit; captures taller than 16:10 show their top and scroll down
    vec2 fitUv(vec2 uv, float asp, float scroll) {
        if (asp >= SCREEN) {
            uv.x = 0.5 + (uv.x - 0.5) * SCREEN / asp;
            return uv;
        }
        float k = asp / SCREEN;
        uv.y = uv.y * k + scroll * (1.0 - k);
        return uv;
    }

    vec3 idle(vec2 uv) {
        vec3 c = mix(vec3(0.10, 0.16, 0.28), vec3(0.03, 0.06, 0.12), uv.y);
        float grid = step(0.975, fract(uv.x * 24.0)) + step(0.96, fract(uv.y * 15.0));
        c += grid * 0.025;
        c += 0.025 * (0.5 + 0.5 * sin((uv.y * 3.0 - uTime * 0.8) * 6.2831));
        return c;
    }

    void main() {
        vec3 ca = hasA > 0.5 ? texture2D(mapA, fitUv(vUv, aspA, scrollA)).rgb : idle(vUv);
        vec3 cb = hasB > 0.5 ? texture2D(mapB, fitUv(vUv, aspB, scrollB)).rgb : idle(vUv);
        // top-to-bottom wipe from A to B with a scan line
        float edge = uMix * 1.1 - 0.05;
        float m = 1.0 - smoothstep(edge - 0.015, edge + 0.015, vUv.y);
        vec3 col = mix(ca, cb, m);
        float wiping = step(0.001, uMix) * step(uMix, 0.999);
        col += vec3(0.55, 0.8, 1.0) * exp(-pow((vUv.y - edge) / 0.006, 2.0)) * wiping;
        // glass: soft sheen and a gentle vignette
        vec2 q = vUv - 0.5;
        col *= 1.0 - dot(q * vec2(0.8, 1.1), q * vec2(0.8, 1.1)) * 0.3;
        col += smoothstep(0.6, 0.0, distance(vUv, vec2(0.15, 0.02))) * 0.06;
        col *= uPower;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
    }
`;

function makeFlareTexture(kind: 'ring' | 'disc'): THREE.CanvasTexture {
    const s = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const g = cv.getContext('2d')!;
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    if (kind === 'ring') {
        grd.addColorStop(0.0, 'rgba(255,255,255,0)');
        grd.addColorStop(0.62, 'rgba(255,255,255,0)');
        grd.addColorStop(0.74, 'rgba(255,255,255,0.55)');
        grd.addColorStop(0.86, 'rgba(255,255,255,0.15)');
        grd.addColorStop(1.0, 'rgba(255,255,255,0)');
    } else {
        grd.addColorStop(0.0, 'rgba(255,255,255,0.55)');
        grd.addColorStop(0.7, 'rgba(255,255,255,0.35)');
        grd.addColorStop(1.0, 'rgba(255,255,255,0)');
    }
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

interface Monitor {
    root: THREE.Object3D;
    mat: THREE.ShaderMaterial;
    width: number;
}

interface Station {
    trail: THREE.Object3D;
    head?: THREE.Object3D;
    headPos: THREE.Vector3; // hover position of the light head
    len: number;
    sx: number;
    speed: number;
    normal: THREE.Vector3; // horizontal, from the light toward the vessel
    monitor?: Monitor;
}

export function createSkyLaunch(canvas: HTMLCanvasElement, opts: SkyLaunchOptions): SkyLaunchHandle {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.autoClear = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.03, 1500);
    const fogColor = new THREE.Color().setRGB(0.86, 0.9, 0.93, THREE.SRGBColorSpace);
    scene.background = fogColor.clone();

    // ---------------------------------------------------------------- lens flares
    const flareScene = new THREE.Scene();
    const flareCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    const ringTex = makeFlareTexture('ring');
    const discTex = makeFlareTexture('disc');
    const flares = [
        { t: 0.35, size: 0.16, tex: discTex, color: 0xff9ad8, o: 0.22 },
        { t: 0.55, size: 0.07, tex: discTex, color: 0x9fe8ff, o: 0.25 },
        { t: 0.82, size: 0.3, tex: ringTex, color: 0xbfd9ff, o: 0.22 },
        { t: 1.25, size: 0.1, tex: discTex, color: 0xc9ffd8, o: 0.16 },
        { t: 1.55, size: 0.22, tex: ringTex, color: 0xffc6f0, o: 0.14 },
    ].map((f) => {
        const m = new THREE.SpriteMaterial({
            map: f.tex,
            color: f.color,
            transparent: true,
            opacity: f.o,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            toneMapped: false,
        });
        const s = new THREE.Sprite(m);
        flareScene.add(s);
        return { ...f, sprite: s, base: f.o };
    });

    // ---------------------------------------------------------------- lights
    const sunLight = new THREE.DirectionalLight(0xfff6ea, 2.2);
    sunLight.position.copy(SUN_DIR).multiplyScalar(50);
    scene.add(sunLight);
    scene.add(new THREE.HemisphereLight(0xdfe9f5, 0xf4f6f8, 0.9));
    const front = new THREE.DirectionalLight(0xeef3fa, 1.1);
    front.position.set(-12, 10, 30);
    scene.add(front);

    // ---------------------------------------------------------------- state
    let disposed = false;
    let active = false;
    let raf = 0;
    let ready = false;
    let targetU = 0;
    let shownU = 0;
    let time = 0;
    let last = performance.now();

    let ship: THREE.Object3D | null = null;
    let sky: THREE.Object3D | null = null;
    let engineSprite: THREE.Object3D | null = null;
    let exhaust: THREE.Mesh | null = null;
    const cabinHide: THREE.Object3D[] = [];
    let cloudMats: THREE.ShaderMaterial[] = [];
    let plumeMat: THREE.ShaderMaterial | null = null;
    let template: THREE.Object3D | null = null;
    const stations: Station[] = [];
    const bays: Monitor[] = [];
    const disposables: { dispose: () => void }[] = [ringTex, discTex];

    // cloud sorting (the sea is seen from every direction during the tour)
    let seaGeo: THREE.BufferGeometry | null = null;
    let seaCenters: Float32Array | null = null;
    let seaOrder: Uint32Array | null = null;
    let seaDist: Float32Array | null = null;
    const lastSortPos = new THREE.Vector3(1e9, 0, 0);
    const lastSortDir = new THREE.Vector3();

    // ---------------------------------------------------------------- screen textures
    const texLoader = new THREE.TextureLoader();
    const texCache = new Map<string, { tex: THREE.Texture | null; aspect: number }>();
    const requestTex = (url: string) => {
        const hit = texCache.get(url);
        if (hit) return hit;
        const entry = { tex: null as THREE.Texture | null, aspect: 1.6 };
        texCache.set(url, entry);
        texLoader.load(
            url,
            (t) => {
                if (disposed) {
                    t.dispose();
                    return;
                }
                t.colorSpace = THREE.SRGBColorSpace;
                t.flipY = false; // GLB uv origin is top-left
                t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
                const img = t.image as { width: number; height: number };
                entry.aspect = img.width / img.height;
                entry.tex = t;
                t.needsUpdate = true;
                disposables.push(t);
            },
            undefined,
            () => {
                /* missing screen: the monitor keeps its idle pattern */
            },
        );
        return entry;
    };
    const bindScreen = (m: THREE.ShaderMaterial, slot: 'A' | 'B', url: string | undefined) => {
        const u = m.uniforms;
        if (!url) {
            u[`has${slot}`].value = 0;
            return;
        }
        const e = requestTex(url);
        u[`map${slot}`].value = e.tex;
        u[`has${slot}`].value = e.tex ? 1 : 0;
        u[`asp${slot}`].value = e.aspect;
    };

    const makeScreenMaterial = () =>
        new THREE.ShaderMaterial({
            vertexShader: SCREEN_VERT,
            fragmentShader: SCREEN_FRAG,
            uniforms: {
                mapA: { value: null },
                mapB: { value: null },
                hasA: { value: 0 },
                hasB: { value: 0 },
                aspA: { value: 1.6 },
                aspB: { value: 1.6 },
                scrollA: { value: 0 },
                scrollB: { value: 0 },
                uMix: { value: 0 },
                uPower: { value: 1 },
                uTime: { value: 0 },
            },
            toneMapped: false,
        });

    const makeMonitor = (width: number): Monitor => {
        const root = template!.clone(true);
        root.visible = false;
        root.position.set(0, 0, 0);
        root.scale.setScalar(width);
        const mat = makeScreenMaterial();
        root.traverse((o) => {
            const m = o as THREE.Mesh;
            if (m.isMesh && o.name.startsWith('Monitor_Screen')) m.material = mat;
        });
        return { root, mat, width };
    };

    // ---------------------------------------------------------------- load
    const loader = new GLTFLoader();
    loader.load(
        opts.modelUrl,
        (gltf) => {
            if (disposed) return;
            const root = gltf.scene;
            root.traverse((o) => {
                if ((o as THREE.Light).isLight) o.visible = false;
            });

            sky = root.getObjectByName('SkyDome') ?? null;
            ship = root.getObjectByName('SkyShip') ?? null;
            engineSprite = root.getObjectByName('EngineGlowSprite') ?? null;
            template = root.getObjectByName('MonitorTemplate') ?? null;
            template?.removeFromParent();
            ['Ship_Core', 'Ship_Struts'].forEach((n) => {
                const o = root.getObjectByName(n);
                if (o) cabinHide.push(o);
            });
            const plumeNode = root.getObjectByName('CloudPlume');
            if (plumeNode) plumeNode.position.y += PAD_Y * 0.8;

            // sky dome: unlit, follows the camera, and lights the vessel through PMREM
            if (sky) {
                sky.traverse((o) => {
                    const m = o as THREE.Mesh;
                    if (m.isMesh) {
                        const mat = m.material as THREE.MeshBasicMaterial;
                        mat.depthWrite = false;
                        mat.fog = false;
                        mat.toneMapped = false;
                        m.renderOrder = -10;
                        m.frustumCulled = false;
                    }
                });
                const pmrem = new THREE.PMREMGenerator(renderer);
                const envScene = new THREE.Scene();
                envScene.add(sky.clone());
                const envRT = pmrem.fromScene(envScene, 0.02, 0.1, 1000);
                scene.environment = envRT.texture;
                scene.environmentIntensity = 1.05;
                disposables.push(envRT, pmrem);
            }

            // clouds: billboard shader driven by the _center attribute
            const makeCloudMat = (src: THREE.MeshBasicMaterial, isPlume: boolean) =>
                new THREE.ShaderMaterial({
                    vertexShader: CLOUD_VERT,
                    fragmentShader: CLOUD_FRAG,
                    uniforms: {
                        map: { value: src.map },
                        uFogColor: { value: fogColor },
                        uOpacity: { value: 1 },
                        uTime: { value: 0 },
                        uPlume: { value: 0 },
                        uIsPlume: { value: isPlume ? 1 : 0 },
                    },
                    transparent: true,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                });
            for (const name of ['CloudSea', 'CloudPlume']) {
                root.getObjectByName(name)?.traverse((o) => {
                    const m = o as THREE.Mesh;
                    if (!m.isMesh) return;
                    const mat = makeCloudMat(m.material as THREE.MeshBasicMaterial, name === 'CloudPlume');
                    m.material = mat;
                    m.frustumCulled = false;
                    m.renderOrder = name === 'CloudPlume' ? 2 : 1;
                    cloudMats.push(mat);
                    if (name === 'CloudPlume') plumeMat = mat;
                    if (name === 'CloudSea' && m.geometry.index) {
                        seaGeo = m.geometry;
                        const c = m.geometry.getAttribute('_center') as THREE.BufferAttribute;
                        const n = c.count / 4;
                        seaCenters = new Float32Array(n * 3);
                        for (let i = 0; i < n; i++) {
                            seaCenters[i * 3] = c.getX(i * 4);
                            seaCenters[i * 3 + 1] = c.getY(i * 4);
                            seaCenters[i * 3 + 2] = c.getZ(i * 4);
                        }
                        seaOrder = new Uint32Array(n);
                        seaDist = new Float32Array(n);
                    }
                });
            }

            // additive glows and trails
            let trailMap: THREE.Texture | null = null;
            root.traverse((o) => {
                const m = o as THREE.Mesh;
                if (!m.isMesh) return;
                const mat = m.material as THREE.MeshBasicMaterial;
                if (mat.name === 'LightTrail' || mat.name === 'Glow') {
                    mat.blending = THREE.AdditiveBlending;
                    mat.depthWrite = false;
                    mat.fog = false;
                    m.renderOrder = 0;
                    if (mat.name === 'Glow') mat.opacity = 0.75;
                    if (mat.name === 'LightTrail') trailMap = mat.map;
                }
                if (mat.name === 'Ship_Pearl') (mat as unknown as THREE.MeshPhysicalMaterial).envMapIntensity = 0.9;
            });

            // light stations + their monitors
            const lt = root.getObjectByName('LightTrails');
            lt?.children
                .filter((c) => !c.name.endsWith('_Head'))
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach((c) => {
                    const head = lt.getObjectByName(`${c.name}_Head`) ?? undefined;
                    if (head) head.userData.baseScale = head.scale.x;
                    stations.push({
                        trail: c,
                        head,
                        headPos: c.position.clone(),
                        len: c.scale.y,
                        sx: c.scale.x,
                        speed: (c.userData?.speed as number) ?? 1,
                        normal: new THREE.Vector3(-c.position.x, 0, -c.position.z).normalize(),
                    });
                });
            if (template) {
                stations.forEach((st) => {
                    const mon = makeMonitor(STATION_W);
                    mon.root.position.copy(st.headPos).addScaledVector(st.normal, 3);
                    mon.root.rotation.y = Math.atan2(st.normal.x, st.normal.z);
                    scene.add(mon.root);
                    st.monitor = mon;
                });
                BAYS.forEach((_, b) => {
                    const mon = makeMonitor(CABIN_W);
                    const a = bayAngle(b);
                    mon.root.position.set(Math.sin(a) * CABIN_R, CABIN_Y, Math.cos(a) * CABIN_R);
                    mon.root.rotation.y = a + Math.PI;
                    ship?.add(mon.root);
                    bays.push(mon);
                });
            }

            // exhaust streak under the vessel (reuses the trail texture)
            if (ship && trailMap) {
                const g = new THREE.PlaneGeometry(1, 1);
                g.translate(0, -0.5, 0);
                const m = new THREE.MeshBasicMaterial({
                    map: trailMap,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    color: new THREE.Color(1.0, 0.98, 0.95),
                    opacity: 0,
                });
                exhaust = new THREE.Mesh(g, m);
                exhaust.position.set(0, 0.35, 0);
                ship.add(exhaust);
                disposables.push(g, m);
            }

            scene.add(root);
            ready = true;
            update();
            renderer.compile(scene, camera);
            render();
            opts.onReady?.();
        },
        undefined,
        (err) => opts.onError?.(err),
    );

    // ---------------------------------------------------------------- framing helpers
    const fitDistance = (w: number, h: number) => {
        const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        return Math.max(h / 2 / tv, w / 2 / (tv * camera.aspect)) * 1.06 + MON_SAG * w;
    };
    const stationMonitorY = (st: Station, bob: number) => st.headPos.y + bob - (STATION_W * MON_RATIO) / 2 - 2.2;
    const stationPose = (k: number, out: Pose) => {
        const st = stations[k];
        const H = STATION_W * MON_RATIO;
        out.target.copy(st.headPos).addScaledVector(st.normal, 3);
        // frame = monitor + light head above it + room for the caption below
        out.target.y = stationMonitorY(st, 0) + 0.6;
        out.pos.copy(out.target).addScaledVector(st.normal, fitDistance(STATION_W * 1.04, H + 5.2));
        return out;
    };
    const bayPoseAt = (angle: number, out: Pose) => {
        const y = (ship ? ship.position.y : PAD_Y) + CABIN_Y;
        const dx = Math.sin(angle);
        const dz = Math.cos(angle);
        // stay inside the hull: on portrait screens the monitor is cropped at the sides instead
        const d = Math.min(fitDistance(CABIN_W * 1.08, CABIN_W * MON_RATIO * 1.18 + 0.2), 1.75);
        out.target.set(dx * CABIN_R, y - 0.1, dz * CABIN_R);
        out.pos.set(dx * (CABIN_R - d), y, dz * (CABIN_R - d));
        return out;
    };

    const tmpA = pose(0, 0, 0, 0, 0, 0);
    const tmpB = pose(0, 0, 0, 0, 0, 0);
    const cam = pose(0, 0, 0, 0, 0, 0);
    const tmpV = new THREE.Vector3();
    const tmpDir = new THREE.Vector3();

    /** progress (0..1) of a phase: 0 before it, 1 after it */
    const phase = (smp: TourSample, kind: SegmentKind) => {
        if (smp.seg.kind === kind) return smp.s;
        return ORDER.indexOf(smp.seg.kind) > ORDER.indexOf(kind) ? 1 : 0;
    };

    function computeCamera(smp: TourSample) {
        const { seg, s } = smp;
        switch (seg.kind) {
            case 'intro':
                lerpPose(INTRO, HERO, ease(smooth(0, 0.9, s)), cam);
                break;
            case 'hero':
                cam.pos.copy(HERO.pos).setZ(HERO.pos.z - s * 0.8);
                cam.target.copy(HERO.target);
                break;
            case 'travel': {
                const k = seg.station!;
                if (k === 0) {
                    tmpA.pos.copy(HERO.pos).setZ(HERO.pos.z - 0.8);
                    tmpA.target.copy(HERO.target);
                } else stationPose(k - 1, tmpA);
                stationPose(k, tmpB);
                lerpPose(tmpA, tmpB, ease(s), cam, k === 0 ? 6 : 2.5);
                break;
            }
            case 'station':
                stationPose(seg.station!, cam);
                cam.pos.lerp(cam.target, 0.04 * s);
                break;
            case 'return':
                stationPose(stations.length - 1, tmpA);
                lerpPose(tmpA, FRONT, ease(s), cam, 4);
                break;
            case 'enter':
                bayPoseAt(bayAngle(0), tmpB);
                lerpPose(FRONT, tmpB, ease(s), cam);
                break;
            case 'app':
            case 'swap':
                bayPoseAt(bayAngle(seg.bay!), cam);
                break;
            case 'turn':
                bayPoseAt(lerp(bayAngle(seg.bay! - 1), bayAngle(seg.bay!), ease(s)), cam);
                break;
            case 'exit': {
                const lastA = bayAngle(BAYS.length - 1);
                const back = lastA - Math.PI / 2; // keep turning clockwise until facing -Z again
                if (s < 0.4) bayPoseAt(lerp(lastA, back, ease(s / 0.4)), cam);
                else {
                    bayPoseAt(back, tmpA);
                    lerpPose(tmpA, EXIT, ease((s - 0.4) / 0.6), cam);
                }
                break;
            }
            case 'launch':
            case 'dive':
                cam.pos.copy(EXIT.pos);
                cam.target.copy(EXIT.target);
                break;
        }
    }

    function update() {
        const smp = sampleTimeline(shownU);
        const { seg, s } = smp;

        // ---------------- departure (vessel + lights leave)
        const launchS = phase(smp, 'launch');
        const ignite = smooth(0.0, 0.3, launchS);
        const launchRaw = smooth(0.2, 1.0, launchS);
        const launch = launchRaw * launchRaw * (1.2 - 0.2 * launchRaw);
        const dive = ease(phase(smp, 'dive'));

        const shipY = PAD_Y + launch * 36;
        if (ship) {
            const shake = ignite * (1 - launchRaw) * 0.025;
            ship.position.set(Math.sin(time * 37) * shake, shipY + Math.sin(time * 29) * shake, 0);
        }

        // ---------------- camera
        computeCamera(smp);
        if (seg.kind === 'launch' || seg.kind === 'dive') {
            cam.pos.y += (shipY - PAD_Y) * 0.42;
            cam.target.y += (shipY - PAD_Y) * 0.55;
            cam.pos.y = lerp(cam.pos.y, 1.2, dive);
            cam.pos.z = lerp(cam.pos.z, cam.pos.z - 8, dive);
            cam.target.y = lerp(cam.target.y, -4, dive);
        }
        camera.position.copy(cam.pos);
        camera.lookAt(cam.target);
        if (sky) sky.position.copy(camera.position);

        // cabin: hide the spindle/struts while the camera is in (or entering) the hull
        const inside =
            (seg.kind === 'enter' && s > 0.45) ||
            seg.kind === 'app' ||
            seg.kind === 'swap' ||
            seg.kind === 'turn' ||
            (seg.kind === 'exit' && s < 0.75);
        cabinHide.forEach((o) => (o.visible = !inside));

        // ---------------- engine
        if (engineSprite) {
            engineSprite.visible = ignite > 0.01;
            const sc = 2.5 + ignite * 4 + launch * 3;
            engineSprite.scale.set(sc, sc, 1);
        }
        if (exhaust) {
            (exhaust.material as THREE.MeshBasicMaterial).opacity = ignite * 0.95;
            exhaust.visible = ignite > 0.01;
            exhaust.scale.set(2.2 + launch * 1.5, 1.5 + ignite * 3 + launch * 34, 1);
        }

        // ---------------- light stations
        let focusStation = -1;
        let focusStrength = 0;
        if (seg.kind === 'station') {
            focusStation = seg.station!;
            focusStrength = 1;
        } else if (seg.kind === 'travel') {
            focusStation = s > 0.5 ? seg.station! : seg.station! - 1;
            focusStrength = Math.abs(s - 0.5) * 2;
        } else if (seg.kind === 'return') {
            focusStation = stations.length - 1;
            focusStrength = 1 - smooth(0, 0.4, s);
        }
        const departRaw = smooth(0.15, 1.0, launchS);
        stations.forEach((st, i) => {
            const bob = opts.reducedMotion ? 0 : Math.sin(time * 0.6 + i * 1.7) * 0.35;
            const depart = departRaw * departRaw * 180 * st.speed;
            st.trail.position.set(st.headPos.x, st.headPos.y + bob + depart, st.headPos.z);
            st.trail.scale.set(st.sx * 0.55, st.len * (1 + departRaw * 2.5), 1);
            // trails always face the camera around their vertical axis
            st.trail.rotation.y = Math.atan2(camera.position.x - st.trail.position.x, camera.position.z - st.trail.position.z);
            const lit = i === focusStation ? focusStrength : 0;
            if (st.head) {
                const base = st.head.userData.baseScale as number;
                const f = (1 + Math.sin(time * 3 + i) * 0.06) * (1 + lit * 0.8);
                st.head.position.set(st.trail.position.x, st.trail.position.y + 0.2, st.trail.position.z);
                st.head.scale.set(base * 0.32 * f, base * 0.32 * f, 1);
                st.head.quaternion.copy(camera.quaternion);
            }

            // monitor pops in while the camera is parked at its light
            const mon = st.monitor;
            if (!mon) return;
            let v = 0;
            if (seg.kind === 'station' && seg.station === i) v = 1;
            else if (seg.kind === 'travel' && seg.station === i) v = smooth(0.55, 0.95, s);
            else if (seg.kind === 'travel' && seg.station === i + 1) v = 1 - smooth(0.05, 0.4, s);
            else if (seg.kind === 'return' && i === stations.length - 1) v = 1 - smooth(0.05, 0.35, s);
            mon.root.visible = v > 0.001;
            if (!mon.root.visible) return;
            mon.root.scale.set(
                mon.width * Math.max(0.02, smooth(0, 0.5, v)),
                mon.width * Math.max(0.02, smooth(0.35, 1, v)),
                mon.width,
            );
            mon.root.position.y = stationMonitorY(st, bob);
            bindScreen(mon.mat, 'A', STATIONS[i]?.screen);
            const u = mon.mat.uniforms;
            u.uMix.value = 0;
            u.scrollA.value = seg.kind === 'station' && seg.station === i ? smooth(0.15, 0.95, s) : seg.kind === 'station' || seg.kind === 'return' || (seg.kind === 'travel' && seg.station === i + 1) ? 1 : 0;
            u.uPower.value = 0.35 + 0.65 * smooth(0.5, 1, v);
            u.uTime.value = time;
        });

        // ---------------- cabin monitors
        let cabinV = 0;
        if (seg.kind === 'enter') cabinV = smooth(0.84, 1.0, s); // after the camera has passed the front monitor
        else if (seg.kind === 'app' || seg.kind === 'swap' || seg.kind === 'turn') cabinV = 1;
        else if (seg.kind === 'exit') cabinV = 1 - smooth(0.05, 0.35, s);
        const curBay = seg.bay ?? (seg.kind === 'exit' ? BAYS.length : 0);
        bays.forEach((mon, b) => {
            mon.root.visible = cabinV > 0.001;
            if (!mon.root.visible) return;
            mon.root.scale.set(
                mon.width * Math.max(0.02, smooth(0, 0.5, cabinV)),
                mon.width * Math.max(0.02, smooth(0.35, 1, cabinV)),
                mon.width,
            );
            const apps = BAYS[b].apps;
            let aIdx = 0;
            let scroll = 0;
            if (b < curBay) {
                aIdx = apps.length - 1;
                scroll = 1;
            } else if (b === curBay && seg.app !== undefined) {
                aIdx = seg.app;
                if (seg.kind === 'app') scroll = smooth(0.1, 0.95, s);
            }
            const swapping = seg.kind === 'swap' && b === curBay;
            bindScreen(mon.mat, 'A', (swapping ? apps[aIdx - 1] : apps[aIdx])?.screen);
            bindScreen(mon.mat, 'B', apps[aIdx]?.screen);
            const u = mon.mat.uniforms;
            u.uMix.value = swapping ? ease(s) : 1;
            u.scrollA.value = 1;
            u.scrollB.value = scroll;
            const focus = b === curBay || (seg.kind === 'turn' && b === curBay - 1);
            u.uPower.value = (0.45 + 0.55 * smooth(0.5, 1, cabinV)) * (focus ? 1 : 0.75);
            u.uTime.value = time;
        });

        // prefetch screens around the current position of the tour
        let focusIdx = 0;
        if (seg.station !== undefined) focusIdx = seg.station;
        else if (seg.bay !== undefined) focusIdx = STATIONS.length + BAY_OFFSET[seg.bay] + (seg.app ?? 0);
        else if (seg.kind === 'return') focusIdx = STATIONS.length;
        if (ORDER.indexOf(seg.kind) < ORDER.indexOf('exit')) {
            for (let i = Math.max(0, focusIdx - 1); i < Math.min(SCREEN_ORDER.length, focusIdx + 4); i++) requestTex(SCREEN_ORDER[i]);
            if (seg.kind === 'enter' || seg.kind === 'return') BAYS.forEach((b) => requestTex(b.apps[0].screen));
        }

        // ---------------- clouds
        for (const m of cloudMats) m.uniforms.uTime.value = time;
        if (plumeMat) plumeMat.uniforms.uPlume.value = ignite * 0.55 + launch * 0.45;
        sortClouds();

        // ---------------- lens flares follow the sun
        tmpV.copy(camera.position).addScaledVector(SUN_DIR, 400).project(camera);
        const vis = !inside && tmpV.z < 1 ? clamp01(1.4 - Math.hypot(tmpV.x, tmpV.y) * 0.55) : 0;
        for (const f of flares) {
            f.sprite.position.set(tmpV.x * (1 - f.t), tmpV.y * (1 - f.t), -1);
            f.sprite.scale.set(f.size / camera.aspect, f.size, 1);
            (f.sprite.material as THREE.SpriteMaterial).opacity = f.base * vis * (1 - dive);
        }
    }

    function sortClouds() {
        if (!seaGeo || !seaCenters || !seaOrder || !seaDist) return;
        camera.getWorldDirection(tmpDir);
        if (camera.position.distanceToSquared(lastSortPos) < 2.0 && tmpDir.dot(lastSortDir) > 0.995) return;
        lastSortPos.copy(camera.position);
        lastSortDir.copy(tmpDir);
        const n = seaOrder.length;
        const { x: cx, y: cy, z: cz } = camera.position;
        const centers = seaCenters;
        const dist = seaDist;
        for (let i = 0; i < n; i++) {
            const dx = centers[i * 3] - cx;
            const dy = centers[i * 3 + 1] - cy;
            const dz = centers[i * 3 + 2] - cz;
            dist[i] = dx * dx + dy * dy + dz * dz;
            seaOrder[i] = i;
        }
        seaOrder.sort((a, b) => dist[b] - dist[a]);
        const index = seaGeo.index!;
        const arr = index.array as Uint16Array | Uint32Array;
        for (let j = 0; j < n; j++) {
            const b = seaOrder[j] * 4;
            const o = j * 6;
            arr[o] = b;
            arr[o + 1] = b + 2;
            arr[o + 2] = b + 1;
            arr[o + 3] = b + 1;
            arr[o + 4] = b + 2;
            arr[o + 5] = b + 3;
        }
        index.needsUpdate = true;
    }

    function render() {
        renderer.clear();
        renderer.render(scene, camera);
        renderer.render(flareScene, flareCam);
    }

    function frame(now: number) {
        if (disposed || !active) return;
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!opts.reducedMotion) time += dt;
        const k = opts.reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
        shownU += (targetU - shownU) * k;
        if (Math.abs(targetU - shownU) < 1e-3) shownU = targetU;
        if (!ready) return;
        update();
        render();
    }

    function resize() {
        const w = canvas.clientWidth || 1;
        const h = canvas.clientHeight || 1;
        const dpr = Math.min(window.devicePixelRatio || 1, w < 800 ? 2 : 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = camera.aspect < 1 ? 50 : camera.aspect < 1.4 ? 42 : 35;
        camera.updateProjectionMatrix();
        if (ready && !active) {
            update();
            render();
        }
    }

    resize();

    return {
        setScroll(u: number) {
            targetU = u;
            if (!active && ready) {
                shownU = targetU;
                update();
                render();
            }
        },
        setActive(a: boolean) {
            if (a === active || disposed) return;
            active = a;
            if (a) {
                last = performance.now();
                raf = requestAnimationFrame(frame);
            } else {
                cancelAnimationFrame(raf);
            }
        },
        resize,
        dispose() {
            disposed = true;
            cancelAnimationFrame(raf);
            scene.traverse((o) => {
                const m = o as THREE.Mesh;
                if (m.isMesh) {
                    m.geometry?.dispose();
                    const mats = Array.isArray(m.material) ? m.material : [m.material];
                    mats.forEach((mm) => mm.dispose());
                }
            });
            cloudMats.forEach((m) => m.dispose());
            flares.forEach((f) => f.sprite.material.dispose());
            disposables.forEach((d) => d.dispose());
            cloudMats = [];
            renderer.dispose();
        },
    };
}
