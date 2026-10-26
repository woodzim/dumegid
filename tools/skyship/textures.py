"""Procedural textures for the DUMEG sky-launch scene.

Outputs (in ./out):
  sky.jpg          2048x1024 equirectangular sky (three.js equirect convention)
  clouds.png       1024x1024 RGBA atlas, 2x2 cumulus puffs
  trail.png        128x1024  RGBA light streak (head at top)
  glow.png         256x256   RGBA radial glow
"""
import numpy as np
from PIL import Image
import cv2

rng = np.random.default_rng(7)
OUT = "out/"


def value_noise(h, w, cells, seed):
    r = np.random.default_rng(seed)
    g = r.random((cells + 1, cells + 1)).astype(np.float32)
    return cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)


def fbm(h, w, base=4, octaves=5, seed=0, gain=0.5):
    acc = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        acc += amp * value_noise(h, w, base * 2 ** o, seed + o * 13)
        tot += amp
        amp *= gain
    return acc / tot


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def mix(a, b, t):
    t = np.asarray(t)[..., None]
    return np.asarray(a) * (1 - t) + np.asarray(b) * t


# ---------------------------------------------------------------- sky
def make_sky(W=2048, H=1024):
    v = (np.arange(H) + 0.5) / H
    u = (np.arange(W) + 0.5) / W
    U, V = np.meshgrid(u, v)
    el = (0.5 - V) * np.pi
    az = (U - 0.5) * 2 * np.pi
    d = np.stack([np.cos(el) * np.cos(az), np.sin(el), np.cos(el) * np.sin(az)], -1)

    zen = np.array([0.26, 0.39, 0.55])
    mid = np.array([0.45, 0.58, 0.72])
    hor = np.array([0.84, 0.88, 0.92])
    below = np.array([0.90, 0.92, 0.95])
    deep = np.array([0.74, 0.79, 0.85])

    t = np.clip(el / (np.pi / 2), 0, 1)
    up = mix(mix(hor, mid, smoothstep(0.0, 0.22, t)), zen, smoothstep(0.22, 0.9, t))
    dn = mix(below, deep, smoothstep(0, 0.6, np.clip(-el / (np.pi / 2), 0, 1)))
    col = np.where((el >= 0)[..., None], up, dn)
    # thin bright haze band right at the horizon
    col = col + 0.06 * np.exp(-((el / 0.035) ** 2))[..., None]

    # sun: upper right of a camera looking down -Z
    saz, sel = -np.pi / 2 + 0.62, 0.56
    s = np.array([np.cos(sel) * np.cos(saz), np.sin(sel), np.cos(sel) * np.sin(saz)])
    c = np.clip((d * s).sum(-1), -1, 1)
    ang = np.arccos(c)
    warm = np.array([1.0, 0.98, 0.94])
    glow = 1.6 * np.exp(-ang * ang * 900) + 0.55 * np.exp(-ang * ang * 40) + 0.22 * np.exp(-ang * 2.2)

    # god rays radiating from the sun
    ref = np.array([0.0, 1.0, 0.0])
    t1 = np.cross(s, ref); t1 /= np.linalg.norm(t1)
    t2 = np.cross(s, t1)
    ray_a = np.arctan2((d * t2).sum(-1), (d * t1).sum(-1))
    k = (ray_a / (2 * np.pi) + 0.5)
    n1 = np.interp(k * 512, np.arange(513), rng.random(513))
    n2 = np.interp(k * 160, np.arange(161), rng.random(161))
    rays = np.clip(n1 * 0.6 + n2 * 0.7 - 0.55, 0, 1) ** 1.5
    rays = rays * np.exp(-ang * 2.4) * smoothstep(0.02, 0.15, ang) * (el > -0.05)
    glow = glow + 0.42 * rays

    # wispy high streaks swept away from the sun
    wisp = fbm(H, W, base=6, octaves=4, seed=31)
    wisp = cv2.resize(cv2.resize(wisp, (W // 16, H)), (W, H))
    wisp = smoothstep(0.55, 0.8, wisp) * smoothstep(0.05, 0.3, el) * 0.10
    col = col + glow[..., None] * warm + wisp[..., None]

    img = np.clip(col, 0, 1) ** (1 / 1.0)
    Image.fromarray((img * 255).astype(np.uint8)).save(OUT + "sky.jpg", quality=90)


# ---------------------------------------------------------------- clouds
def billow(S, seed, base, octaves):
    acc = np.zeros((S, S), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        nz = value_noise(S, S, base * 2 ** o, seed + 17 * o)
        acc += amp * (1 - np.abs(nz * 2 - 1)); tot += amp; amp *= 0.55
    return acc / tot


def puff(S, seed, flat=False):
    r = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32) / S
    E = np.zeros((S, S), np.float32)
    for i in range(30):
        cx = r.uniform(0.16, 0.84)
        spread = 1 - abs(cx - 0.5) * 2
        top = 0.64 - (0.17 if flat else 0.27) * spread ** 0.7
        cy = r.uniform(top, 0.68)
        rad = r.uniform(0.06, 0.13) * (0.75 + 0.5 * spread)
        d2 = ((xx - cx) ** 2 + (yy - cy) ** 2) / rad ** 2
        E = np.maximum(E, np.clip(1 - d2, 0, 1) ** 0.8)
    B = cv2.GaussianBlur(billow(S, seed + 3, 5, 5), (0, 0), 1.6)
    D = E * (0.45 + 0.95 * B) - 0.3
    soft = smoothstep(0.0, 0.22, D)
    alpha = soft * (1 - smoothstep(0.6, 0.84, yy + (B - 0.5) * 0.1))
    edge = np.minimum.reduce([xx, 1 - xx, yy, 1 - yy])
    alpha *= smoothstep(0.0, 0.06, edge)

    Hf = cv2.GaussianBlur(E, (0, 0), S * 0.02) * 0.8 + B * 0.22 + cv2.GaussianBlur(B, (0, 0), S * 0.01) * 0.4
    gy, gx = np.gradient(Hf * S * 0.08)
    nrm = np.stack([-gx, gy, np.ones_like(gx)], -1)
    nrm /= np.linalg.norm(nrm, axis=-1, keepdims=True)
    L = np.array([0.45, 0.65, 0.6]); L /= np.linalg.norm(L)
    lam = np.clip((nrm * L).sum(-1), 0, 1)
    ao = np.clip((Hf - cv2.GaussianBlur(Hf, (0, 0), S * 0.025)) * 6 + 0.8, 0, 1)
    vert = 1 - smoothstep(0.25, 0.8, yy)
    shade = np.clip(0.5 * lam + 0.35 * vert + 0.2, 0, 1) * (0.6 + 0.4 * ao)
    shadow = np.array([0.56, 0.63, 0.73])
    lit = np.array([1.0, 1.0, 1.0])
    col = mix(shadow, lit, smoothstep(0.2, 0.85, shade))
    rim = (1 - smoothstep(0.15, 0.7, alpha)) * (1 - smoothstep(0.35, 0.6, yy))
    col = np.clip(col + rim[..., None] * 0.14, 0, 1)
    rgba = np.dstack([col, alpha])
    return (rgba * 255).astype(np.uint8)


def make_clouds():
    S = 512
    atlas = np.zeros((S * 2, S * 2, 4), np.uint8)
    for i, (seed, flat) in enumerate([(11, False), (23, False), (37, True), (41, True)]):
        y, x = divmod(i, 2)
        atlas[y * S:(y + 1) * S, x * S:(x + 1) * S] = puff(S, seed, flat)
    Image.fromarray(atlas, "RGBA").save(OUT + "clouds.png", optimize=True)


# ---------------------------------------------------------------- trail + glow
def make_trail(W=128, H=1024):
    y = (np.arange(H) + 0.5) / H          # 0 = top (head)
    x = (np.arange(W) + 0.5) / W - 0.5
    X, Y = np.meshgrid(x, y)
    n = fbm(H, W, base=3, octaves=4, seed=5)
    nl = cv2.resize(fbm(H // 8, W, base=6, octaves=3, seed=8), (W, H))
    wob = (fbm(H, 1, base=6, octaves=3, seed=9)[:, 0] - 0.5) * 0.05 * Y[:, 0]
    dx = X - wob[:, None]
    fade = (1 - Y) ** 1.4
    core = np.exp(-(dx / (0.035 - 0.02 * Y)) ** 2) * (1 - Y) ** 2.2
    halo = np.exp(-(dx / (0.07 + 0.05 * Y)) ** 2) * fade * 0.55
    smoke = np.exp(-(dx / (0.10 + 0.22 * Y)) ** 2) * (0.25 + 0.75 * n * nl * 1.6) * fade * 0.45
    head = np.exp(-((dx / 0.055) ** 2 + ((Y - 0.018) / 0.018) ** 2))
    a = np.clip(core + halo + smoke + head, 0, 1)
    a *= smoothstep(0.0, 0.01, Y)
    col = np.ones((H, W, 3), np.float32)
    rgba = np.dstack([col, a])
    Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").save(OUT + "trail.png", optimize=True)


def make_glow(S=256):
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    r = np.hypot(xx - S / 2 + 0.5, yy - S / 2 + 0.5) / (S / 2)
    a = np.clip(np.exp(-r * r * 18) + 0.35 * np.exp(-r * 4.5) * (1 - r), 0, 1)
    a *= 1 - smoothstep(0.85, 1.0, r)
    rgba = np.dstack([np.ones((S, S, 3)), a])
    Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").save(OUT + "glow.png", optimize=True)


if __name__ == "__main__":
    make_sky()
    make_clouds()
    make_trail()
    make_glow()
    print("ok")
