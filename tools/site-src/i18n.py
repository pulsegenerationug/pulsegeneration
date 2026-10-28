"""Website translations, the same 13 languages as the apps.

    python tools/site-src/build.py          # English pages first
    python tools/site-src/i18n.py extract   # writes i18n/en.json: every English text, with a short id
    python tools/site-src/i18n.py build     # writes /fr/, /sw/, /zh/ … from i18n/<lang>*.json

Translations live in i18n/t-*.json as {id: [fr, sw, zh, ar, es, pt, de, it, ru, tr, id, hi]}, like the apps' tables;
an i18n/<lang>.json file of {id: text} can override single texts.
Any text without a translation stays in English, so a new sentence never breaks a page.
"""
import hashlib, html, json, pathlib, re, sys

HERE = pathlib.Path(__file__).parent
SITE = HERE.parents[1]
I18N = HERE / "i18n"
BASE = "https://pulsegenerationug.com"

LANGS = {"fr": "fr_FR", "sw": "sw_KE", "zh": "zh_CN", "ar": "ar_AR", "es": "es_ES", "pt": "pt_BR", "de": "de_DE",
         "it": "it_IT", "ru": "ru_RU", "tr": "tr_TR", "id": "id_ID", "hi": "hi_IN"}
RTL = {"ar"}
# URL path → built file. Legal pages, privacy policies and the changelog stay in English.
PAGES = {"/": "index.html", "/pulsehmis/": "pulsehmis/index.html", "/pulselmis/": "pulselmis/index.html",
         "/edupulse/": "edupulse/index.html", "/pulseremit-pro/": "pulseremit-pro/index.html", "/pulsestock/": "pulsestock/index.html",
         "/pulseproperty/": "pulseproperty/index.html", "/motopulse/": "motopulse/index.html", "/lwasa-ludo/": "lwasa-ludo/index.html", "/pricing/": "pricing/index.html",
         "/demo/": "demo/index.html", "/customers/": "customers/index.html", "/security/": "security/index.html",
         "/company/": "company/index.html", "/help/": "help/index.html", "/status/": "status/index.html",
         "/support/": "support/index.html", "/account/": "account/index.html"}

SKIP = {"script", "style", "code", "kbd", "svg", "noscript", "time"}
ATTRS = ("alt", "placeholder", "aria-label", "title")
META = ("description", "og:title", "og:description", "twitter:title", "twitter:description")
# Names that are the same in every language: a text made only of these needs no translation.
NAMES = re.compile(r"Pulse ?Generation( UG)?|PulseHMIS|PulseLMIS|EduPulse|PulseRemit( Pro)?|PulseStock|PulseProperty( Pro)?|Lwasa( Ludo| George)?|"
                   r"WhatsApp|YouTube|TikTok|Instagram|Facebook|Telegram|GitHub|Android|Windows|Mac(OS)?|iPhone|Google( Drive| Meet)?|Zoom|MTN|Airtel|UGX|USD|KES|SSP|TZS|RWF|EUR|"
                   r"Ctrl|Wi-Fi|LAN|APK|PDF|SMS|QR|BMI|FBC|RDT|ISO|AES-GCM|INNOVATE\. BUILD\. TRANSFORM\.")
TOKEN = re.compile(r"(<!--.*?-->|<[^>]+>)", re.S)

def sid(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:8]

def worth(text):
    t = NAMES.sub("", text)
    if re.fullmatch(r"[\w.+-]+@[\w.-]+\.\w+|https?://\S+", text.strip()): return False
    return bool(re.search(r"[A-Za-z]{3}|[A-Za-z]{2}\W", t))

def norm(text):
    return re.sub(r"\s+", " ", text).strip()

def walk(page_html, on_text, on_attr):
    """Calls on_text(text) for every visible text and on_attr(tag, name, value) for translatable attributes;
    each callback returns the replacement (or None to keep it). Returns the rebuilt HTML."""
    out, skip = [], []
    for tok in TOKEN.split(page_html):
        if not tok: continue
        if tok.startswith("<!--"): out.append(tok); continue
        if tok.startswith("<"):
            m = re.match(r"<(/?)([a-zA-Z][\w-]*)", tok)
            if m:
                name = m.group(2).lower()
                if m.group(1):
                    if skip and skip[-1] == name: skip.pop()
                else:
                    if name in SKIP and not tok.endswith("/>"): skip.append(name)
                    if not skip or name in SKIP: tok = attrs(tok, name, on_attr)
            out.append(tok); continue
        if skip or not tok.strip():
            out.append(tok); continue
        text = norm(html.unescape(tok))
        new = on_text(text) if worth(text) else None
        if new is None: out.append(tok)
        else:
            lead = tok[:len(tok) - len(tok.lstrip())]; trail = tok[len(tok.rstrip()):]
            out.append(lead + html.escape(new, quote=False) + trail)
    return "".join(out)

def attrs(tok, tag, on_attr):
    def sub(m):
        k, v = m.group(1), m.group(3)
        val = html.unescape(v)
        if k in ATTRS or (k == "content" and tag == "meta" and re.search(r'(name|property)="(%s)"' % "|".join(META), tok)):
            if worth(val):
                new = on_attr(tag, k, norm(val))
                if new is not None: return f'{k}={m.group(2)}{html.escape(new, quote=True)}{m.group(2)}'
        return m.group(0)
    return re.sub(r'\b([a-z-]+)=(["\'])(.*?)\2', sub, tok)

def js_strings():
    """User-facing English strings written by site.js (headings, buttons, messages)."""
    src = (SITE / "site" / "site.js").read_text(encoding="utf-8")
    found = []
    for m in re.finditer(r'"((?:[^"\\\n]|\\.)*)"', src):
        s = m.group(1)
        if not re.match(r"[A-Z“(¿0-9]", s) or re.search(r"[<>{}=;\\]|^M[\d.]|^\d+(\.\d+)?$", s): continue
        if not re.search(r"[a-z]{2}", s) or not worth(s): continue
        if re.match(r"\(|[A-Z][a-z]+[A-Z]\w*$", s) or re.search(r"\d(px|ms)", s) or s in ("Escape", "Tab", "Enter", "Lead", "Bearer"): continue
        found.append(s.strip())
    return list(dict.fromkeys(x for x in found if x))

def extract():
    seen = {}
    def grab(t):
        seen.setdefault(sid(t), t); return None
    for f in PAGES.values():
        walk((SITE / f).read_text(encoding="utf-8"), grab, lambda tag, k, v: grab(v))
    js = {sid(s): s for s in js_strings()}
    I18N.mkdir(exist_ok=True)
    (I18N / "en.json").write_text(json.dumps({"pages": seen, "js": js}, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(v.split()) for v in list(seen.values()) + list(js.values()))
    print(f"i18n/en.json: {len(seen)} page texts + {len(js)} script texts, {words} words")

ORDER = ["fr", "sw", "zh", "ar", "es", "pt", "de", "it", "ru", "tr", "id", "hi"]  # same order as the apps' i18n tables

def catalog(lang):
    """Merges i18n/t-*.json ({id: [12 translations in ORDER]}) and any i18n/<lang>*.json ({id: text}) fixes."""
    cat = {}
    for f in sorted(I18N.glob("t-*.json")):
        for i, row in json.loads(f.read_text(encoding="utf-8")).items():
            v = row[ORDER.index(lang)] if len(row) == len(ORDER) else ""
            if v: cat[i] = v
    for f in sorted(I18N.glob(f"{lang}.json")) + sorted(I18N.glob(f"{lang}.*.json")):
        cat.update(json.loads(f.read_text(encoding="utf-8")))
    return cat

def alternates(path):
    links = [f'<link rel="alternate" hreflang="en" href="{BASE}{path}">', f'<link rel="alternate" hreflang="x-default" href="{BASE}{path}">']
    links += [f'<link rel="alternate" hreflang="{l}" href="{BASE}/{l}{path}">' for l in LANGS]
    return "\n".join(links) + "\n"

def local_links(page_html, lang):
    def sub(m):
        url = m.group(2)
        path, rest = re.match(r"([^?#]*)(.*)", url).groups()
        if path in PAGES: return f'{m.group(1)}"/{lang}{path}{rest}"'
        return m.group(0)
    return re.sub(r'(<a\b[^>]*?\bhref=)"(/[^"/][^"]*|/)"', sub, page_html)

def build():
    en = json.loads((I18N / "en.json").read_text(encoding="utf-8"))
    report = []
    for path, f in PAGES.items():
        src = (SITE / f).read_text(encoding="utf-8")
        src = re.sub(r'<link rel="alternate" hreflang="[^"]+" href="[^"]+">\n', "", src)
        src = src.replace("</head>", alternates(path) + "</head>", 1)
        (SITE / f).write_text(src, encoding="utf-8", newline="\n")
        for lang, locale in LANGS.items():
            cat = catalog(lang)
            done = [0, 0]
            def tr(text):
                done[1] += 1
                v = cat.get(sid(text))
                if v: done[0] += 1
                return v
            out = walk(src, tr, lambda tag, k, v: tr(v))
            out = out.replace('<html lang="en"', f'<html lang="{lang}"' + (' dir="rtl"' if lang in RTL else ""), 1)
            out = re.sub(r'(<link rel="canonical" href=")' + re.escape(BASE + path) + '"', rf'\1{BASE}/{lang}{path}"', out)
            out = re.sub(r'(<meta property="og:url" content=")' + re.escape(BASE + path) + '"', rf'\1{BASE}/{lang}{path}"', out)
            out = out.replace('<meta property="og:type"', f'<meta property="og:locale" content="{locale}">\n<meta property="og:type"', 1)
            out = local_links(out, lang)
            js = {s: cat[i] for i, s in en["js"].items() if cat.get(i)}
            inject = ("<script>window.PG_I18N=" + json.dumps(js, ensure_ascii=False).replace("</", "<\\/") +
                      ";window.PG_LANG_PATHS=" + json.dumps(list(PAGES)) + ";</script>\n")
            out = out.replace('<script src="/site/site.js', inject + '<script src="/site/site.js', 1)
            target = SITE / lang / f
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(out, encoding="utf-8", newline="\n")
            report.append((lang, path, done[0], done[1]))
    by = {}
    for lang, _, a, b in report: by.setdefault(lang, [0, 0]); by[lang][0] += a; by[lang][1] += b
    for lang, (a, b) in by.items(): print(f"{lang}: {a}/{b} texts translated ({100 * a // max(b, 1)}%)")
    sitemap()

def sitemap():
    p = SITE / "sitemap.xml"
    s = p.read_text(encoding="utf-8")
    s = re.sub(r"  <url><loc>%s/(%s)/[^<]*</loc>[^\n]*\n" % (re.escape(BASE), "|".join(LANGS)), "", s)
    rows = "".join(f"  <url><loc>{BASE}/{l}{path}</loc><priority>0.5</priority></url>\n" for l in LANGS for path in PAGES)
    p.write_text(s.replace("</urlset>", rows + "</urlset>"), encoding="utf-8", newline="\n")

if __name__ == "__main__":
    {"extract": extract, "build": build}[sys.argv[1] if len(sys.argv) > 1 else "build"]()
