import * as THREE from 'three';

/**
 * Dark "universe": image cards scattered over an endless field facing the camera, stars behind.
 * Drag / wheel pans the field, cards drift and show a slight RGB split; hover lifts
 * a card and reports it, click opens its link.
 */

export interface UniverseItem {
    src: string;
    label: string;
    href?: string;
}

export interface UniverseHandle {
    dispose: () => void;
}

const CARD_VERT = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const CARD_FRAG = /* glsl */ `
    uniform sampler2D uMap;
    uniform float uHover;
    uniform float uShift;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
        vec2 d = vec2(uShift * (1.0 - uHover) * (0.6 + 0.4 * sin(uTime * 0.7)), 0.0);
        float r = texture2D(uMap, vUv + d).r;
        float g = texture2D(uMap, vUv).g;
        float b = texture2D(uMap, vUv - d).b;
        vec3 col = vec3(r, g, b);
        vec2 q = vUv - 0.5;
        col *= 1.0 - dot(q, q) * 0.5;
        col *= mix(0.72, 1.0, uHover);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
    }
`;

export function createUniverse(
    canvas: HTMLCanvasElement,
    items: UniverseItem[],
    onHover: (item: UniverseItem | null, x: number, y: number) => void,
    onOpen: (item: UniverseItem) => void,
): UniverseHandle {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0x0a0a0a);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 11, 22);
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);

    // stars
    const starGeo = new THREE.BufferGeometry();
    const sp = new Float32Array(1600 * 3);
    for (let i = 0; i < 1600; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 30);
        sp.set([v.x, v.y, v.z], i * 3);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, sizeAttenuation: true, fog: false }));
    scene.add(stars);

    // cards on a wide, endlessly wrapping field facing the camera
    const field = new THREE.Group();
    scene.add(field);
    const loader = new THREE.TextureLoader();
    const geo = new THREE.PlaneGeometry(1, 1);
    const cards: { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; item: UniverseItem; base: THREE.Vector3; phase: number; hover: number; size: number }[] = [];
    const n = items.length;
    const cols = Math.ceil(Math.sqrt(n * 1.9));
    const rows = Math.ceil(n / cols);
    const CW = 6.6;
    const CH = 4.8;
    const W = cols * CW;
    const H = rows * CH;
    const rand = (k: number) => {
        const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
        return x - Math.floor(x);
    };
    items.forEach((item, i) => {
        const mat = new THREE.ShaderMaterial({
            vertexShader: CARD_VERT,
            fragmentShader: CARD_FRAG,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: { uMap: { value: null }, uHover: { value: 0 }, uShift: { value: 0.006 }, uTime: { value: 0 } },
        });
        const mesh = new THREE.Mesh(geo, mat);
        const c = i % cols;
        const r = Math.floor(i / cols);
        // jittered grid cell, rows offset like brickwork, a little depth for parallax
        const base = new THREE.Vector3(
            c * CW + (r % 2) * CW * 0.5 + (rand(i) - 0.5) * CW * 0.35,
            r * CH + (rand(i + 50) - 0.5) * CH * 0.35,
            -rand(i + 90) * 2.5,
        );
        const size = 2.1 + rand(i + 20) * 1.1; // card height
        mesh.scale.set(size * 1.6, size, 1);
        loader.load(item.src, (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            mat.uniforms.uMap.value = t;
            const img = t.image as { width: number; height: number };
            mesh.scale.set(Math.min(size * 1.9, size * (img.width / img.height)), size, 1);
        });
        field.add(mesh);
        cards.push({ mesh, mat, item, base, phase: rand(i + 7) * 6.28, hover: 0, size });
    });

    // interaction: drag / wheel pans the field with inertia, pointer parallax, hover + click
    const off = new THREE.Vector2();
    const vel = new THREE.Vector2(0.004, 0.0015);
    let dragging = false;
    let moved = 0;
    const lastP = new THREE.Vector2();
    const pointer = new THREE.Vector2(9, 9);
    const look = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    let hovered: (typeof cards)[number] | null = null;

    const onDown = (e: PointerEvent) => {
        dragging = true;
        moved = 0;
        lastP.set(e.clientX, e.clientY);
        canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        if (dragging) {
            const dx = e.clientX - lastP.x;
            const dy = e.clientY - lastP.y;
            lastP.set(e.clientX, e.clientY);
            moved += Math.abs(dx) + Math.abs(dy);
            const k = 9.3 / r.height; // pixels -> world units at the card plane
            vel.set(dx * k, -dy * k);
        }
    };
    const onUp = (e: PointerEvent) => {
        dragging = false;
        canvas.releasePointerCapture(e.pointerId);
        if (moved < 6 && hovered) onOpen(hovered.item);
    };
    const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        vel.x -= e.deltaX * 0.0012;
        vel.y += e.deltaY * 0.0012;
    };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    const wrap = (v: number, m: number) => ((v % m) + m) % m;
    let raf = 0;
    let time = 0;
    let last = performance.now();
    const tmp = new THREE.Vector3();
    const drift = new THREE.Vector2(0.004, 0.0015);
    const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        time += dt;
        if (!dragging) vel.lerp(drift, 1 - Math.exp(-dt * 1.4));
        off.add(vel);
        look.lerp(pointer.x > 5 ? new THREE.Vector2() : pointer, 1 - Math.exp(-dt * 3));
        camera.position.set(look.x * 0.6, look.y * 0.4, 10);
        camera.lookAt(look.x * 0.2, look.y * 0.15, 0);
        stars.position.set(off.x * 0.08, off.y * 0.08, 0);

        cards.forEach((c) => {
            // parallax by depth, then wrap into a window centred on the camera
            const pf = 1 + c.base.z * 0.08;
            c.mesh.position.set(wrap(c.base.x + off.x * pf + W / 2, W) - W / 2, wrap(c.base.y + off.y * pf + H / 2, H) - H / 2, c.base.z);
            c.mesh.position.y += Math.sin(time * 0.5 + c.phase) * 0.12;
        });

        ray.setFromCamera(pointer, camera);
        const hit = ray.intersectObjects(cards.map((c) => c.mesh))[0];
        const next = hit ? cards.find((c) => c.mesh === hit.object) ?? null : null;
        if (next !== hovered) {
            hovered = next;
            canvas.style.cursor = hovered?.item.href ? 'pointer' : 'grab';
        }
        cards.forEach((c) => {
            c.hover += ((c === hovered ? 1 : 0) - c.hover) * (1 - Math.exp(-dt * 8));
            c.mesh.position.z += c.hover * 0.8;
            c.mat.uniforms.uHover.value = c.hover;
            c.mat.uniforms.uTime.value = time + c.phase;
        });
        if (hovered) {
            tmp.copy(hovered.mesh.position).project(camera);
            const r = canvas.getBoundingClientRect();
            onHover(hovered.item, (tmp.x * 0.5 + 0.5) * r.width, (-tmp.y * 0.5 + 0.5) * r.height);
        } else onHover(null, 0, 0);
        renderer.render(scene, camera);
    };

    const resize = () => {
        const w = canvas.clientWidth || 1;
        const h = canvas.clientHeight || 1;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.fov = camera.aspect < 1 ? 70 : 50;
        camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(frame);

    return {
        dispose() {
            cancelAnimationFrame(raf);
            ro.disconnect();
            canvas.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            canvas.removeEventListener('wheel', onWheel);
            cards.forEach((c) => {
                (c.mat.uniforms.uMap.value as THREE.Texture | null)?.dispose();
                c.mat.dispose();
            });
            geo.dispose();
            starGeo.dispose();
            renderer.dispose();
        },
    };
}
