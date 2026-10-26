"""Builds dumeg-skyship.glb: organic launch vessel + cloud sea + sky dome + light trails.

Units are metres, +Y up, the hero camera looks down -Z.  Node names are
the contract with the web runtime (SkyLaunch scene):
  SkyShip            root of the vessel (origin = between the feet)
    Ship_Shell / Ship_ShellInner / Ship_Core / Ship_Struts / Ship_Legs / Ship_Feet / Ship_Nozzle / Ship_EngineGlow
  SkyDome            unlit equirect sphere
  CloudSea           merged billboard puffs (attribute _CENTER = puff centre)
  CloudPlume         puffs hugging the launch pad
  LightTrails        LightTrail_XX (streak, origin at the head) + LightTrail_XX_Head (glow)
  Sun                directional light,  HeroCamera  perspective camera
"""
import json
import struct
import numpy as np
from scipy.interpolate import PchipInterpolator

rng = np.random.default_rng(2026)
OUT = "out/"

# ===================================================================== GLB writer


class GLB:
    def __init__(self):
        self.bin = bytearray()
        self.j = {"asset": {"version": "2.0", "generator": "DUMEG skyship builder"},
                  "scene": 0, "scenes": [{"name": "SkyLaunch", "nodes": []}],
                  "nodes": [], "meshes": [], "materials": [], "accessors": [],
                  "bufferViews": [], "buffers": [], "textures": [], "images": [],
                  "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 33071, "wrapT": 33071}],
                  "extensionsUsed": [], "cameras": []}

    def _ext(self, name):
        if name not in self.j["extensionsUsed"]:
            self.j["extensionsUsed"].append(name)

    def _view(self, data, target=None):
        while len(self.bin) % 4:
            self.bin.append(0)
        v = {"buffer": 0, "byteOffset": len(self.bin), "byteLength": len(data)}
        if target:
            v["target"] = target
        self.bin += data
        self.j["bufferViews"].append(v)
        return len(self.j["bufferViews"]) - 1

    def accessor(self, arr, kind):
        arr = np.ascontiguousarray(arr)
        if kind == "index":
            arr = arr.astype(np.uint16 if arr.max() < 65535 else np.uint32)
            ct = 5123 if arr.dtype == np.uint16 else 5125
            bv = self._view(arr.tobytes(), 34963)
            acc = {"bufferView": bv, "componentType": ct, "count": int(arr.size), "type": "SCALAR"}
        else:
            arr = arr.astype(np.float32)
            n = arr.shape[1]
            bv = self._view(arr.tobytes(), 34962)
            acc = {"bufferView": bv, "componentType": 5126, "count": int(arr.shape[0]),
                   "type": {2: "VEC2", 3: "VEC3", 4: "VEC4"}[n]}
            if kind == "position":
                acc["min"] = arr.min(0).tolist()
                acc["max"] = arr.max(0).tolist()
        self.j["accessors"].append(acc)
        return len(self.j["accessors"]) - 1

    def image(self, path, mime, name):
        data = open(path, "rb").read()
        bv = self._view(data)
        self.j["images"].append({"bufferView": bv, "mimeType": mime, "name": name})
        self.j["textures"].append({"sampler": 0, "source": len(self.j["images"]) - 1, "name": name})
        return len(self.j["textures"]) - 1

    def material(self, m):
        for e in m.get("extensions", {}):
            self._ext(e)
        self.j["materials"].append(m)
        return len(self.j["materials"]) - 1

    def mesh(self, name, prims):
        out = []
        for p in prims:
            attrs = {"POSITION": self.accessor(p["pos"], "position")}
            if "nrm" in p:
                attrs["NORMAL"] = self.accessor(p["nrm"], "normal")
            if "uv" in p:
                attrs["TEXCOORD_0"] = self.accessor(p["uv"], "uv")
            if "col" in p:
                attrs["COLOR_0"] = self.accessor(p["col"], "color")
            for k, v in p.get("extra", {}).items():
                attrs[k] = self.accessor(v, "attr")
            out.append({"attributes": attrs, "indices": self.accessor(p["idx"], "index"),
                        "material": p["mat"], "mode": 4})
        self.j["meshes"].append({"name": name, "primitives": out})
        return len(self.j["meshes"]) - 1

    def node(self, name, parent=None, **kw):
        n = {"name": name}
        n.update(kw)
        self.j["nodes"].append(n)
        i = len(self.j["nodes"]) - 1
        if parent is None:
            self.j["scenes"][0]["nodes"].append(i)
        else:
            self.j["nodes"][parent].setdefault("children", []).append(i)
        return i

    def save(self, path):
        while len(self.bin) % 4:
            self.bin.append(0)
        self.j["buffers"] = [{"byteLength": len(self.bin)}]
        for k in [k for k, v in self.j.items() if v == []]:
            del self.j[k]
        js = json.dumps(self.j, separators=(",", ":")).encode()
        js += b" " * ((4 - len(js) % 4) % 4)
        total = 12 + 8 + len(js) + 8 + len(self.bin)
        with open(path, "wb") as f:
            f.write(struct.pack("<III", 0x46546C67, 2, total))
            f.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
            f.write(struct.pack("<II", len(self.bin), 0x004E4942) + bytes(self.bin))
        return total


# ===================================================================== geometry helpers


def grid_indices(nu, ns, flip=False):
    a = np.arange(nu - 1)[:, None] * ns + np.arange(ns - 1)[None, :]
    b, c, d = a + 1, a + ns, a + ns + 1
    t = np.stack([a, c, b, b, c, d], -1) if not flip else np.stack([a, b, c, b, d, c], -1)
    return t.reshape(-1)


def param_surface(P, us, ss, outward_hint):
    """P(U,S)->(...,3). Returns pos, normals, indices with winding matched to normals."""
    U, S = np.meshgrid(us, ss, indexing="ij")
    pos = P(U, S)
    e = 1e-4
    dU = P(U + e, S) - P(U - e, S)
    dS = P(U, S + e) - P(U, S - e)
    n = np.cross(dS, dU)
    ln = np.linalg.norm(n, axis=-1, keepdims=True)
    n = np.where(ln > 1e-12, n / np.maximum(ln, 1e-12), np.array([0, 1.0, 0]))
    # orient normals with a hint function (vector field that should be "outside")
    hint = outward_hint(pos)
    if (n * hint).sum() < 0:
        n = -n
    nu, ns = len(us), len(ss)
    pos = pos.reshape(-1, 3)
    n = n.reshape(-1, 3)
    idx = grid_indices(nu, ns)
    tri = idx.reshape(-1, 3)
    fn = np.cross(pos[tri[:, 1]] - pos[tri[:, 0]], pos[tri[:, 2]] - pos[tri[:, 0]])
    if (fn * n[tri[:, 0]]).sum() < 0:
        idx = grid_indices(nu, ns, flip=True)
    return pos, n, idx


def radial_hint(p):
    h = p.copy()
    h[..., 1] = 0
    return h


def revolution(ys, rs, nseg=64, rows=None, inward=False):
    prof = PchipInterpolator(ys, rs)
    lo, hi = min(ys), max(ys)
    us = np.linspace(0, 1, rows or 80)
    th = np.linspace(0, 2 * np.pi, nseg + 1)

    def P(U, T):
        y = lo + (hi - lo) * U
        r = np.maximum(prof(np.clip(y, lo, hi)), 0)
        return np.stack([r * np.sin(T), y, r * np.cos(T)], -1)

    hint = (lambda p: -radial_hint(p)) if inward else radial_hint
    return param_surface(P, us, th, hint)


def tube(points, radii, nseg=12):
    """Swept circle along a polyline (parallel transport frames)."""
    pts = np.asarray(points, float)
    m = len(pts)
    T = np.gradient(pts, axis=0)
    T /= np.linalg.norm(T, axis=1, keepdims=True)
    ref = np.array([1.0, 0, 0]) if abs(T[0, 0]) < 0.9 else np.array([0, 0, 1.0])
    N = [np.cross(T[0], ref)]
    N[0] /= np.linalg.norm(N[0])
    for i in range(1, m):
        v = N[-1] - np.dot(N[-1], T[i]) * T[i]
        N.append(v / np.linalg.norm(v))
    N = np.array(N)
    B = np.cross(T, N)
    th = np.linspace(0, 2 * np.pi, nseg + 1)
    c, s = np.cos(th), np.sin(th)
    nrm = c[None, :, None] * N[:, None, :] + s[None, :, None] * B[:, None, :]
    pos = pts[:, None, :] + nrm * np.asarray(radii)[:, None, None]
    pos, nrm = pos.reshape(-1, 3), nrm.reshape(-1, 3)
    idx = grid_indices(m, nseg + 1)
    tri = idx.reshape(-1, 3)
    fn = np.cross(pos[tri[:, 1]] - pos[tri[:, 0]], pos[tri[:, 2]] - pos[tri[:, 0]])
    if (fn * nrm[tri[:, 0]]).sum() < 0:
        idx = grid_indices(m, nseg + 1, flip=True)
    return pos, nrm, idx


def ellipsoid(center, radii, nu=12, nv=16):
    th = np.linspace(0, np.pi, nu)
    ph = np.linspace(0, 2 * np.pi, nv + 1)
    TH, PH = np.meshgrid(th, ph, indexing="ij")
    d = np.stack([np.sin(TH) * np.sin(PH), np.cos(TH), np.sin(TH) * np.cos(PH)], -1).reshape(-1, 3)
    r = np.asarray(radii)
    pos = d * r + center
    nrm = d / r
    nrm /= np.linalg.norm(nrm, axis=1, keepdims=True)
    idx = grid_indices(nu, nv + 1)
    tri = idx.reshape(-1, 3)
    fn = np.cross(pos[tri[:, 1]] - pos[tri[:, 0]], pos[tri[:, 2]] - pos[tri[:, 0]])
    if (fn * nrm[tri[:, 0]]).sum() < 0:
        idx = grid_indices(nu, nv + 1, flip=True)
    return pos, nrm, idx


def merge(parts):
    P, N, I, off = [], [], [], 0
    for p, n, i in parts:
        P.append(p); N.append(n); I.append(i + off); off += len(p)
    return np.concatenate(P), np.concatenate(N), np.concatenate(I)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ===================================================================== the vessel
NRIB = 4
# outer silhouette (height y, mid-surface radius R)
PROF_Y = [0.05, 0.22, 0.55, 1.00, 1.60, 2.10, 2.80, 3.40, 4.20, 4.90, 5.40, 6.00, 6.60, 7.30, 8.00, 8.60, 9.20, 9.60, 9.86, 10.0]
PROF_R = [1.10, 0.97, 0.66, 0.42, 0.50, 0.62, 0.82, 1.02, 1.32, 1.45, 1.42, 1.18, 0.93, 0.69, 0.53, 0.43, 0.33, 0.23, 0.13, 0.0]
Rf = PchipInterpolator(PROF_Y, PROF_R)
Y0, Y1 = PROF_Y[0], PROF_Y[-1]
GAP_A, GAP_B, GAP_MAX = 1.25, 8.9, 0.54


def gap(y):
    t = np.clip((y - GAP_A) / (GAP_B - GAP_A), 0, 1)
    return GAP_MAX * np.sin(np.pi * t ** 0.75) ** 0.55


def rib_halfwidth(y):
    upper = np.pi / NRIB + 0.035 - gap(y)
    leg = 0.075 / np.maximum(Rf(y), 0.2)          # thin legs below the waist
    k = smoothstep(0.45, 1.05, y)
    return leg * (1 - k) + upper * k


def rib_thick(y):
    r = np.maximum(Rf(y), 0)
    upper = np.minimum(0.14, 0.40 * r)
    leg = 0.07
    k = smoothstep(0.45, 1.05, y)
    return leg * (1 - k) + upper * k


def arc_sampling(n):
    yy = np.linspace(Y0, Y1 - 1e-3, 4000)
    rr = Rf(yy)
    seg = np.hypot(np.diff(yy), np.diff(rr) * 1.6)
    cum = np.concatenate([[0], np.cumsum(seg)])
    return np.interp(np.linspace(0, cum[-1], n), cum, yy)


SE = 2.6  # superellipse exponent of the rib cross-section


def rib_surface(phi_c, half):
    """half=+1 outer skin (pearl), -1 inner skin (champagne)."""
    ys = arc_sampling(190)
    ss = np.linspace(0, np.pi, 30) if half > 0 else np.linspace(np.pi, 2 * np.pi, 30)

    def P(Y, S):
        y = np.clip(Y, Y0, Y1 - 1e-4)
        c, sn = np.cos(S), np.sin(S)
        ex = np.sign(c) * np.abs(c) ** (2 / SE)
        ey = np.sign(sn) * np.abs(sn) ** (2 / SE)
        phi = phi_c + rib_halfwidth(y) * ex
        r = np.maximum(Rf(y) + rib_thick(y) * ey, 0)
        return np.stack([r * np.sin(phi), y, r * np.cos(phi)], -1)

    def hint(p):
        h = radial_hint(p) * half
        return h

    return param_surface(P, ys, ss, hint)


def build_ship():
    outer, inner = [], []
    for k in range(NRIB):
        phi = np.pi / NRIB + k * 2 * np.pi / NRIB  # gaps face +Z/-Z/+X/-X
        outer.append(rib_surface(phi, +1))
        inner.append(rib_surface(phi, -1))
    shell = merge(outer)
    shell_in = merge(inner)

    # golden core spindle
    core = revolution([0.30, 0.55, 0.90, 1.50, 2.40, 3.60, 4.90, 6.20, 7.40, 8.60, 9.45],
                      [0.20, 0.22, 0.20, 0.15, 0.13, 0.19, 0.24, 0.19, 0.12, 0.08, 0.0], nseg=40, rows=90)

    # struts inside each window
    struts = []
    ys = np.linspace(1.55, 8.1, 60)
    for k in range(NRIB):
        base = k * 2 * np.pi / NRIB
        for off in (-0.085, 0.085):
            r = Rf(ys) - rib_thick(ys) * 0.35
            pts = np.stack([r * np.sin(base + off), ys, r * np.cos(base + off)], -1)
            rad = 0.028 + 0.012 * np.sin(np.pi * (ys - ys[0]) / (ys[-1] - ys[0]))
            struts.append(tube(pts, rad, 10))
    struts = merge(struts)

    # secondary legs (between the main rib legs) + feet
    legs, feet = [], []
    t = np.linspace(0, 1, 30)
    for k in range(NRIB):
        a = k * 2 * np.pi / NRIB
        r = 0.28 + 0.62 * t ** 1.6
        y = 1.05 - 0.98 * t ** 0.9
        pts = np.stack([r * np.sin(a), y, r * np.cos(a)], -1)
        legs.append(tube(pts, 0.055 - 0.02 * t, 10))
        feet.append(ellipsoid(pts[-1] + [0, -0.01, 0], (0.11, 0.035, 0.11)))
        a2 = np.pi / NRIB + k * 2 * np.pi / NRIB
        feet.append(ellipsoid(np.array([Rf(0.06) * np.sin(a2), 0.04, Rf(0.06) * np.cos(a2)]), (0.17, 0.045, 0.17)))
    legs, feet = merge(legs), merge(feet)

    # engine bell (outer + inner skin) and glow disk
    n_out = revolution([0.12, 0.25, 0.42, 0.62], [0.30, 0.25, 0.19, 0.17], nseg=40, rows=12)
    n_in = revolution([0.12, 0.25, 0.42, 0.62], [0.28, 0.23, 0.17, 0.15], nseg=40, rows=12, inward=True)
    nozzle = merge([n_out, n_in])
    th = np.linspace(0, 2 * np.pi, 41)
    gpos = np.concatenate([[[0, 0.30, 0]], np.stack([0.2 * np.sin(th), np.full_like(th, 0.30), 0.2 * np.cos(th)], -1)])
    gidx = np.stack([np.zeros(40, int), np.arange(2, 42), np.arange(1, 41)], -1).reshape(-1)
    glow = (gpos, np.tile([0, -1.0, 0], (len(gpos), 1)), gidx)
    return dict(shell=shell, shell_in=shell_in, core=core, struts=struts, legs=legs, feet=feet,
                nozzle=nozzle, glow=glow)


# ===================================================================== sky dome


def sky_dome(radius=420.0, nlat=48, nlon=96):
    v = np.linspace(0, 1, nlat + 1)        # glTF v: 0 = top row of the image (zenith)
    u = np.linspace(0, 1, nlon + 1)
    V, U = np.meshgrid(v, u, indexing="ij")
    el = (0.5 - V) * np.pi
    az = (U - 0.5) * 2 * np.pi
    d = np.stack([np.cos(el) * np.cos(az), np.sin(el), np.cos(el) * np.sin(az)], -1)
    pos = (d * radius).reshape(-1, 3)
    nrm = (-d).reshape(-1, 3)
    uv = np.stack([U, V], -1).reshape(-1, 2)
    idx = grid_indices(nlat + 1, nlon + 1)
    tri = idx.reshape(-1, 3)
    fn = np.cross(pos[tri[:, 1]] - pos[tri[:, 0]], pos[tri[:, 2]] - pos[tri[:, 0]])
    if (fn * nrm[tri[:, 0]]).sum() < 0:
        idx = grid_indices(nlat + 1, nlon + 1, flip=True)
    return pos, nrm, uv, idx


# ===================================================================== clouds
CAM_Z = 24.0
ATLAS = [(0.0, 0.0), (0.5, 0.0), (0.0, 0.5), (0.5, 0.5)]


def noise2(x, z, seed):
    r = np.random.default_rng(seed)
    acc = 0
    for o, (f, a) in enumerate([(0.013, 1.0), (0.031, 0.5), (0.07, 0.25)]):
        ph = r.random(2) * 100
        acc = acc + a * np.sin(x * f + ph[0] + np.sin(z * f * 0.7 + ph[1])) * np.cos(z * f * 1.3 + ph[1] * 0.5)
    return acc / 1.75


def quads(puffs):
    """puffs: list of (cx, cy, cz, w, h, variant, tint). Quads face +Z, sorted far->near."""
    puffs = sorted(puffs, key=lambda p: p[2])
    P, UV, C, CEN, I = [], [], [], [], []
    for i, (cx, cy, cz, w, h, var, tint) in enumerate(puffs):
        u0, v0 = ATLAS[var]
        hw, hh = w / 2, h / 2
        P += [[cx - hw, cy + hh, cz], [cx + hw, cy + hh, cz], [cx - hw, cy - hh, cz], [cx + hw, cy - hh, cz]]
        UV += [[u0, v0], [u0 + 0.5, v0], [u0, v0 + 0.5], [u0 + 0.5, v0 + 0.5]]
        C += [tint] * 4
        CEN += [[cx, cy, cz]] * 4
        b = 4 * i
        I += [b, b + 2, b + 1, b + 1, b + 2, b + 3]
    P = np.array(P); n = np.tile([0, 0, 1.0], (len(P), 1))
    return P, n, np.array(UV), np.array(C), np.array(CEN), np.array(I)


def cloud_sea():
    """A full disk of puffs around the pad: the tour looks out in every direction."""
    puffs = []
    r = 3.0
    while r < 440:
        size = 4.0 + 0.11 * r if r < 100 else 15.0 + 0.16 * (r - 100)
        n = max(6, int(2 * np.pi * r / (size * 0.52)))
        phase = rng.uniform(0, 2 * np.pi)
        for k in range(n):
            a = phase + 2 * np.pi * (k + rng.uniform(-0.3, 0.3)) / n
            rr = r + rng.uniform(-0.25, 0.25) * size * 0.4
            x, z = rr * np.sin(a), -rr * np.cos(a)
            w = size * rng.uniform(0.85, 1.35)
            h = w * rng.uniform(0.62, 0.8) * (0.85 if r > 140 else 1.0)
            amp = 0.7 + 0.012 * r
            nz = noise2(x * 0.6, z * 0.6, 3)
            top = 1.45 + amp * nz + rng.normal(0, 0.12 * amp)
            # shallow valley between the hero camera and the pad so the hull stays readable
            top -= 1.2 * smoothstep(-6.0, 10.0, z) * (1 - smoothstep(8.0, 26.0, abs(x)))
            cy = top - h * 0.12
            if abs(z) < 2.2 and abs(x) < 1.6 + w * 0.3:
                continue
            var = int(rng.integers(0, 4)) if r < 110 else int(rng.integers(2, 4))
            shade = rng.uniform(0.9, 1.0)
            tint = [shade * 0.98, shade * 0.99, shade, 1.0]
            puffs.append((x, cy, z, w, h, var, tint))
            if nz > 0.25 and r > 8:   # towering billow on the crests
                w2 = w * rng.uniform(0.55, 0.75)
                puffs.append((x + rng.uniform(-0.2, 0.2) * w, cy + h * rng.uniform(0.28, 0.42), z, w2, w2 * 0.75,
                              int(rng.integers(0, 2)), [1.0, 1.0, 1.0, 1.0]))
        r += 0.9 + 0.075 * r
    return quads(puffs)


def cloud_plume():
    puffs = []
    for i in range(120):
        a = rng.uniform(0, 2 * np.pi)
        rad = rng.uniform(1.3, 3.8)
        x, z = rad * np.sin(a) * 1.25, rad * np.cos(a)
        y = rng.uniform(0.8, 2.4) + max(0, 2.6 - rad) * rng.uniform(0, 0.9)
        w = rng.uniform(1.8, 3.6) * (1.1 - (y - 1) * 0.08)
        h = w * 0.78
        if abs(z) < 1.7 and abs(x) - w * 0.32 < 1.25:
            continue
        shade = rng.uniform(0.92, 1.0)
        puffs.append((x, y, z, w, h, int(rng.integers(0, 4)), [shade, shade, shade, 1.0]))
    return quads(puffs)


# ===================================================================== light trails
# nine light stations on an arc behind the vessel (left -> right); order matches content.ts
STATION_IDS = ["gpei", "depalindo", "apbmi", "aptmi", "atti", "muara", "porta", "survlus", "lpksm"]
STATION_R = 80.0
STATION_Y = [19.0, 22.5, 17.5, 23.0, 20.0, 22.0, 18.0, 23.5, 19.5]


def station_trails():
    out = []
    n = len(STATION_IDS)
    for i in range(n):
        a = np.radians(-56 + 112 * i / (n - 1))
        x, z = STATION_R * np.sin(a), -STATION_R * np.cos(a)
        out.append((float(x), STATION_Y[i], float(z), 1.0, 22.0 + 4 * (i % 3)))
    return out


TRAILS = station_trails()


MON_H = 0.625     # 16:10
MON_SAG = 0.05    # how far the screen bulges toward the viewer


def mon_z(x):
    return MON_SAG * (1 - (2 * x) ** 2)


def curved_sheet(w, h, z_off, nx=48, flip=False):
    xs = np.linspace(-w / 2, w / 2, nx + 1)
    ys = np.array([h / 2, -h / 2])
    X, Y = np.meshgrid(xs, ys)
    Z = mon_z(X) + z_off
    pos = np.stack([X, Y, Z], -1).reshape(-1, 3)
    dz = -MON_SAG * 8 * X
    nrm = np.stack([-dz, np.zeros_like(X), np.ones_like(X)], -1)
    nrm /= np.linalg.norm(nrm, axis=-1, keepdims=True)
    nrm = nrm.reshape(-1, 3)
    uv = np.stack([(X + w / 2) / w, (h / 2 - Y) / h], -1).reshape(-1, 2)
    if flip:
        nrm = -nrm
    idx = grid_indices(2, nx + 1)
    tri = idx.reshape(-1, 3)
    fn = np.cross(pos[tri[:, 1]] - pos[tri[:, 0]], pos[tri[:, 2]] - pos[tri[:, 0]])
    if (fn * nrm[tri[:, 0]]).sum() < 0:
        idx = grid_indices(2, nx + 1, flip=True)
    return pos, nrm, uv, idx


def monitor_template():
    W, H = 1.0, MON_H
    sp, sn, suv, si = curved_sheet(W, H, 0.0)
    # bezel: front frame + back shell + four sides, slightly larger than the glass
    bw, bh, d = W + 0.035, H + 0.035, 0.035
    fp, fn_, _, fi = curved_sheet(bw, bh, -0.004)
    bp, bn, _, bi = curved_sheet(bw, bh, -0.004 - d, flip=True)
    sides = []
    xs = np.linspace(-bw / 2, bw / 2, 49)
    for yv, ny in ((bh / 2, 1.0), (-bh / 2, -1.0)):
        p = []
        for x in xs:
            z = mon_z(x) - 0.004
            p += [[x, yv, z], [x, yv, z - d]]
        p = np.array(p)
        n = np.tile([0, ny, 0], (len(p), 1))
        i = grid_indices(len(xs), 2)
        tri = i.reshape(-1, 3)
        f = np.cross(p[tri[:, 1]] - p[tri[:, 0]], p[tri[:, 2]] - p[tri[:, 0]])
        if (f * n[tri[:, 0]]).sum() < 0:
            i = grid_indices(len(xs), 2, flip=True)
        sides.append((p, n, i))
    for xv, nx in ((-bw / 2, -1.0), (bw / 2, 1.0)):
        z = mon_z(xv) - 0.004
        p = np.array([[xv, bh / 2, z], [xv, -bh / 2, z], [xv, bh / 2, z - d], [xv, -bh / 2, z - d]])
        n = np.tile([nx, 0, 0], (4, 1))
        i = np.array([0, 1, 2, 2, 1, 3])
        f = np.cross(p[i[1]] - p[i[0]], p[i[2]] - p[i[0]])
        if f @ n[0] < 0:
            i = np.array([0, 2, 1, 2, 3, 1])
        sides.append((p, n, i))
    bezel = merge([(fp, fn_, fi), (bp, bn, bi)] + sides)
    # thin glowing rim hugging the glass edge
    rims = []
    xs = np.linspace(-W / 2, W / 2, 40)
    for yv in (H / 2 + 0.006, -H / 2 - 0.006):
        pts = np.stack([xs, np.full_like(xs, yv), mon_z(xs) + 0.004], -1)
        rims.append(tube(pts, np.full(len(xs), 0.0035), 6))
    for xv in (-W / 2 - 0.006, W / 2 + 0.006):
        ys = np.linspace(-H / 2, H / 2, 6)
        pts = np.stack([np.full_like(ys, xv), ys, np.full_like(ys, mon_z(xv) + 0.004)], -1)
        rims.append(tube(pts, np.full(len(ys), 0.0035), 6))
    rim = merge(rims)
    return dict(screen={"pos": sp, "nrm": sn, "uv": suv, "idx": si}, bezel=bezel, rim=rim)


def main():
    g = GLB()
    sky_tex = g.image(OUT + "sky.jpg", "image/jpeg", "sky")
    cloud_tex = g.image(OUT + "clouds.png", "image/png", "clouds")
    trail_tex = g.image(OUT + "trail.png", "image/png", "trail")
    glow_tex = g.image(OUT + "glow.png", "image/png", "glow")

    M = {}
    M["pearl"] = g.material({"name": "Ship_Pearl", "pbrMetallicRoughness": {
        "baseColorFactor": [0.97, 0.955, 0.93, 1], "metallicFactor": 0.0, "roughnessFactor": 0.32},
        "extensions": {"KHR_materials_clearcoat": {"clearcoatFactor": 0.55, "clearcoatRoughnessFactor": 0.12},
                       "KHR_materials_iridescence": {"iridescenceFactor": 0.3, "iridescenceIor": 1.3,
                                                     "iridescenceThicknessMinimum": 160, "iridescenceThicknessMaximum": 420}}})
    M["champagne"] = g.material({"name": "Ship_Champagne", "pbrMetallicRoughness": {
        "baseColorFactor": [0.93, 0.82, 0.64, 1], "metallicFactor": 0.65, "roughnessFactor": 0.24}})
    M["gold"] = g.material({"name": "Ship_GoldCore", "pbrMetallicRoughness": {
        "baseColorFactor": [0.80, 0.60, 0.33, 1], "metallicFactor": 1.0, "roughnessFactor": 0.28}})
    M["chrome"] = g.material({"name": "Ship_Chrome", "pbrMetallicRoughness": {
        "baseColorFactor": [0.92, 0.92, 0.93, 1], "metallicFactor": 1.0, "roughnessFactor": 0.12}})
    M["nozzle"] = g.material({"name": "Ship_Nozzle", "pbrMetallicRoughness": {
        "baseColorFactor": [0.22, 0.23, 0.25, 1], "metallicFactor": 0.85, "roughnessFactor": 0.38}, "doubleSided": True})
    M["engine"] = g.material({"name": "Ship_EngineGlow", "pbrMetallicRoughness": {
        "baseColorFactor": [0.8, 0.9, 1.0, 1], "metallicFactor": 0, "roughnessFactor": 1},
        "emissiveFactor": [0.75, 0.88, 1.0], "doubleSided": True,
        "extensions": {"KHR_materials_emissive_strength": {"emissiveStrength": 4.0}, "KHR_materials_unlit": {}}})
    M["sky"] = g.material({"name": "Sky", "pbrMetallicRoughness": {
        "baseColorTexture": {"index": sky_tex}, "metallicFactor": 0, "roughnessFactor": 1},
        "extensions": {"KHR_materials_unlit": {}}})
    M["cloud"] = g.material({"name": "Cloud", "alphaMode": "BLEND", "doubleSided": True, "pbrMetallicRoughness": {
        "baseColorTexture": {"index": cloud_tex}, "metallicFactor": 0, "roughnessFactor": 1},
        "extensions": {"KHR_materials_unlit": {}}})
    M["trail"] = g.material({"name": "LightTrail", "alphaMode": "BLEND", "doubleSided": True, "pbrMetallicRoughness": {
        "baseColorTexture": {"index": trail_tex}, "baseColorFactor": [0.95, 0.98, 1.0, 1],
        "metallicFactor": 0, "roughnessFactor": 1}, "extensions": {"KHR_materials_unlit": {}}})
    M["glow"] = g.material({"name": "Glow", "alphaMode": "BLEND", "doubleSided": True, "pbrMetallicRoughness": {
        "baseColorTexture": {"index": glow_tex}, "metallicFactor": 0, "roughnessFactor": 1},
        "extensions": {"KHR_materials_unlit": {}}})

    # --- vessel
    s = build_ship()

    def prim(t, mat):
        return {"pos": t[0], "nrm": t[1], "idx": t[2], "mat": M[mat]}

    root = g.node("SkyShip", extras={"height": 10.0})
    for name, key, mat in [("Ship_Shell", "shell", "pearl"), ("Ship_ShellInner", "shell_in", "champagne"),
                           ("Ship_Core", "core", "gold"), ("Ship_Struts", "struts", "chrome"),
                           ("Ship_Legs", "legs", "pearl"), ("Ship_Feet", "feet", "chrome"),
                           ("Ship_Nozzle", "nozzle", "nozzle"), ("Ship_EngineGlow", "glow", "engine")]:
        mi = g.mesh(name, [prim(s[key], mat)])
        g.node(name, parent=root, mesh=mi)

    # --- sky
    p, n, uv, idx = sky_dome()
    g.node("SkyDome", mesh=g.mesh("SkyDome", [{"pos": p, "nrm": n, "uv": uv, "idx": idx, "mat": M["sky"]}]))

    # --- clouds
    for name, data in [("CloudSea", cloud_sea()), ("CloudPlume", cloud_plume())]:
        p, n, uv, col, cen, idx = data
        mi = g.mesh(name, [{"pos": p, "nrm": n, "uv": uv, "col": col, "idx": idx, "mat": M["cloud"],
                            "extra": {"_CENTER": cen}}])
        g.node(name, mesh=mi, extras={"puffs": int(len(p) // 4), "billboard": True})
        print(name, len(p) // 4, "puffs")

    # --- light trails (unit quad, origin at the head, hanging down)
    tq = {"pos": np.array([[-0.5, 0.05, 0], [0.5, 0.05, 0], [-0.5, -1, 0], [0.5, -1, 0]]),
          "nrm": np.tile([0, 0, 1.0], (4, 1)), "uv": np.array([[0, 0], [1, 0], [0, 1], [1, 1.0]]),
          "idx": np.array([0, 2, 1, 1, 2, 3]), "mat": M["trail"]}
    gq = dict(tq, pos=np.array([[-0.5, 0.5, 0], [0.5, 0.5, 0], [-0.5, -0.5, 0], [0.5, -0.5, 0]]), mat=M["glow"])
    trail_mesh = g.mesh("LightTrailQuad", [tq])
    glow_mesh = g.mesh("GlowQuad", [gq])
    lt = g.node("LightTrails")
    for i, (x, y, z, w, L) in enumerate(TRAILS):
        g.node(f"LightTrail_{i:02d}", parent=lt, mesh=trail_mesh, translation=[x, y, z], scale=[w * 3.0, L, 1],
               extras={"length": L, "speed": float(rng.uniform(0.8, 1.2)), "station": STATION_IDS[i]})
        g.node(f"LightTrail_{i:02d}_Head", parent=lt, mesh=glow_mesh, translation=[x, y + 0.2, z + 0.1],
               scale=[w * 5, w * 5, 1])
    eg = g.node("EngineGlowSprite", parent=root, mesh=glow_mesh, translation=[0, 0.2, 0], scale=[3.5, 3.5, 1])

    # --- curved (convex) monitor template, cloned at runtime for every screen
    M["rim"] = g.material({"name": "Monitor_Rim", "pbrMetallicRoughness": {
        "baseColorFactor": [0.85, 0.93, 1.0, 1], "metallicFactor": 0, "roughnessFactor": 1},
        "emissiveFactor": [0.85, 0.93, 1.0], "extensions": {"KHR_materials_emissive_strength": {"emissiveStrength": 2.5}, "KHR_materials_unlit": {}}})
    M["screen"] = g.material({"name": "Monitor_Screen", "pbrMetallicRoughness": {
        "baseColorFactor": [0.03, 0.05, 0.09, 1], "metallicFactor": 0, "roughnessFactor": 0.2}})
    mon = monitor_template()
    tpl = g.node("MonitorTemplate", translation=[0, -60, 0], extras={"template": True, "width": 1.0, "height": MON_H})
    g.node("Monitor_Screen", parent=tpl, mesh=g.mesh("Monitor_Screen", [dict(mon["screen"], mat=M["screen"])]))
    g.node("Monitor_Bezel", parent=tpl, mesh=g.mesh("Monitor_Bezel", [prim(mon["bezel"], "pearl")]))
    g.node("Monitor_Rim", parent=tpl, mesh=g.mesh("Monitor_Rim", [prim(mon["rim"], "rim")]))

    # --- light + camera
    g._ext("KHR_lights_punctual")
    g.j["extensions"] = {"KHR_lights_punctual": {"lights": [
        {"name": "Sun", "type": "directional", "color": [1.0, 0.97, 0.92], "intensity": 2.6}]}}
    sd = np.array([0.493, 0.531, -0.691])          # direction TO the sun (matches sky.jpg)
    # a directional light shines along its local -Z: rotate -Z onto -sd
    fwd = np.array([0, 0, -1.0]); to = -sd / np.linalg.norm(sd)
    ax = np.cross(fwd, to); ang = np.arccos(np.clip(fwd @ to, -1, 1)); ax /= np.linalg.norm(ax)
    q = list(np.append(ax * np.sin(ang / 2), np.cos(ang / 2)))
    g.node("Sun", rotation=q, extensions={"KHR_lights_punctual": {"light": 0}})
    g.j["cameras"].append({"name": "HeroCamera", "type": "perspective",
                           "perspective": {"yfov": np.radians(35), "znear": 0.1, "zfar": 1200, "aspectRatio": 16 / 9}})
    pitch = np.arctan2(1.6, CAM_Z)
    g.node("HeroCamera", camera=0, translation=[0, 3.6, CAM_Z], rotation=[np.sin(pitch / 2), 0, 0, np.cos(pitch / 2)])

    size = g.save(OUT + "dumeg-skyship.glb")
    print("GLB bytes", size)


if __name__ == "__main__":
    main()
