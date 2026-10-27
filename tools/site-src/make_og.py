"""Makes the 1200×630 share images (images/og/<page>.png) shown when an app page is shared on WhatsApp, Facebook, X or LinkedIn.
Needs Pillow (python -m pip install pillow). Run again after changing a tagline or icon."""
import pathlib
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).parent
SITE = HERE.parents[1]
OUT = SITE / "images" / "og"
FONTS = pathlib.Path("C:/Windows/Fonts")

# page slug, name, tagline, icon, two gradient colours
APPS = [
    ("pulsehmis", "PulseHMIS", "Hospital management that works with no internet", "pulsehmis-icon-384.webp", "#0E6E62", "#0FB9A4"),
    ("pulselmis", "PulseLMIS", "Laboratory information system that works offline", "pulselmis-icon-384.webp", "#0B4F57", "#0E7C86"),
    ("edupulse", "EduPulse", "School administration that works offline", "edupulse-icon-384.webp", "#2F2DA8", "#5E5CE6"),
    ("pulseremit-pro", "PulseRemit Pro", "Branch banking, SACCO & money transfer", "pulseremit-icon-384.webp", "#0A3A7A", "#007AFF"),
    ("pulsestock", "PulseStock", "Pharmacy, supermarket & inventory, offline", "pulsestock-icon-384.webp", "#7A2E00", "#FF7A00"),
    ("pulseproperty", "PulseProperty Pro", "Property & rent management that works offline", "pulseproperty-icon-384.webp", "#3B1F73", "#AF52DE"),
    ("lwasa-ludo", "Lwasa Ludo", "The classic board game in 3D, in Luganda", "ludo-icon-384.webp", "#05070F", "#1B2A6B"),
]

def font(bold, size):
    return ImageFont.truetype(str(FONTS / ("segoeuib.ttf" if bold else "segoeui.ttf")), size)

def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def wrap(draw, text, f, width):
    lines, line = [], ""
    for word in text.split():
        test = (line + " " + word).strip()
        if draw.textlength(test, font=f) <= width: line = test
        else: lines.append(line); line = word
    return lines + [line]

def make(slug, name, tagline, icon, c1, c2):
    platforms = "Android · Windows" if slug == "pulselmis" else "Android · Windows · Mac"
    W, H = 1200, 630
    a, b = hex2rgb(c1), hex2rgb(c2)
    img = Image.new("RGB", (W, H))
    px = img.load()
    for y in range(H):
        for x in range(0, W):
            t = (x / W) * .65 + (y / H) * .35
            px[x, y] = tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
    d = ImageDraw.Draw(img)
    ic = Image.open(SITE / "site" / "img" / icon).convert("RGBA").resize((220, 220), Image.LANCZOS)
    mask = Image.new("L", ic.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 219, 219), radius=50, fill=255)
    img.paste(ic, (90, 205), mask)
    d.text((360, 190), name, font=font(True, 84), fill="white")
    y = 300
    for line in wrap(d, tagline, font(False, 42), 760):
        d.text((362, y), line, font=font(False, 42), fill=(235, 240, 255)); y += 56
    d.text((362, 520), "pulsegenerationug.com  ·  " + platforms, font=font(True, 28), fill=(255, 255, 255, 200))
    OUT.mkdir(parents=True, exist_ok=True)
    img.save(OUT / f"{slug}.png", optimize=True)
    print("wrote", f"images/og/{slug}.png")

if __name__ == "__main__":
    for app in APPS:
        make(*app)
