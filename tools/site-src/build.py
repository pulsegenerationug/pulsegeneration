"""Assembles the static pages from shared partials + per-page bodies."""
import pathlib, re

HERE = pathlib.Path(__file__).parent
SITE = HERE.parents[1]  # repository root
BASE = "https://pulsegenerationug.com"

ICON = {
 "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 "moon": '<svg class="theme-ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
 "sun": '<svg class="theme-ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 "download": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/></svg>',
 "home": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.3 3.3a1 1 0 0 1 1.4 0l8 7.6A1 1 0 0 1 20 12.6h-1V20a1 1 0 0 1-1 1h-4v-5.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V21H6a1 1 0 0 1-1-1v-7.4H4a1 1 0 0 1-.7-1.7z"/></svg>',
 "apps": '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2.4"/><rect x="13" y="3" width="8" height="8" rx="2.4"/><rect x="3" y="13" width="8" height="8" rx="2.4"/><rect x="13" y="13" width="8" height="8" rx="2.4"/></svg>',
 "dl-fill": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.2 10.7-3.5 3.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l1.8 1.8V7.5a1 1 0 1 1 2 0v5.6l1.8-1.8a1 1 0 0 1 1.4 1.4z"/></svg>',
 "play-fill": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zm6.3 2.6v6.8a.6.6 0 0 0 .9.5l5.4-3.4a.6.6 0 0 0 0-1l-5.4-3.4a.6.6 0 0 0-.9.5z"/></svg>',
 "chat-fill": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.6 1.3 4.9 3.4 6.5L4.6 21a.6.6 0 0 0 .8.7l3.6-1.6c1 .3 2 .4 3 .4 5.5 0 10-3.9 10-8.8S17.5 3 12 3z"/></svg>',
 "check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
 "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
 "chev": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
 "plus": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 "android": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22a11.4 11.4 0 0 0-9.84 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>',
 "windows": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.1 10.4 4v7.2H3zm8.3-1.2L21 2.5v8.7h-9.7zM3 12.1h7.4v7.2L3 18.2zm8.3 0H21v8.8l-9.7-1.4z"/></svg>',
 "play": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.1-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z"/></svg>',
 "wifi-off": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 20 20M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 4.2-2.6M19 12.9a10 10 0 0 0-2.6-1.8M1.4 9a15 15 0 0 1 4.3-2.8M22.6 9A15 15 0 0 0 11 5.1M12 20h.01"/></svg>',
 "shield": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
 "flag": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V4m0 0h12l-2 4 2 4H4"/></svg>',
 "sparkle": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z"/></svg>',
 "devices": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="14" height="10" rx="2"/><path d="M6 18h6"/><rect x="17" y="8" width="5" height="12" rx="1.5"/></svg>',
 "support": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="6" rx="2"/><rect x="17" y="14" width="5" height="6" rx="2"/></svg>',
 "phone": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
 "mail": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a2 2 0 0 1 2 2v.4l-10 6.2L2 6.4V6a2 2 0 0 1 2-2zm-2 4.8V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.8l-9.5 5.9a1 1 0 0 1-1 0z"/></svg>',
 "globe": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
 "person": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
 "wa": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.5 3.5 0 0 0-1.1 2.6 6 6 0 0 0 1.3 3.2c.2.2 2.2 3.4 5.4 4.7 2 .9 2.8.9 3.8.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0z"/></svg>',
 "share": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
}
SOCIAL = {
 "whatsapp": ("WhatsApp", "https://wa.me/256700677555", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.5 3.5 0 0 0-1.1 2.6 6 6 0 0 0 1.3 3.2c.2.2 2.2 3.4 5.4 4.7 2 .9 2.8.9 3.8.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0z"/></svg>'),
 "telegram": ("Telegram", "https://t.me/pulsegeneration_ug", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.2l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 3c.9-.3 1.6.2 1.4 1.3z"/></svg>'),
 "youtube": ("YouTube", "https://www.youtube.com/@pulsegeneration_ug", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg>'),
 "tiktok": ("TikTok", "https://tiktok.com/@pulsegeneration_ug", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 5 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z"/></svg>'),
 "instagram": ("Instagram", "https://www.instagram.com/pulsegeneration_ug", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'),
 "x": ("X (Twitter)", "https://x.com/lwasapulse_ug", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.3l-7.2 8.2L22.4 21h-6.6l-5.2-6.8L4.7 21H1.4l7.7-8.8L1 3h6.8l4.7 6.2zm-1.2 16h1.8L7.5 4.9H5.5z"/></svg>'),
 "facebook": ("Facebook", "https://www.facebook.com/share/18yDouKsLP/", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>'),
 "github": ("GitHub", "https://github.com/pulsegenerationug", '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>'),
}

def head(title, desc, path, image="/og-image.png", force_dark=False, extra=""):
    theme = ("document.documentElement.setAttribute('data-theme-mode','dark');" if force_dark else
             "var t=null;try{t=localStorage.getItem('pg_theme')}catch(e){}var d=document.documentElement;"
             "if(t==='light'||t==='dark')d.setAttribute('data-theme',t);"
             "d.setAttribute('data-theme-mode',(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));")
    return f'''<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<!-- Google Analytics + Meta Pixel load only after the visitor accepts cookies (site.js shows the banner) -->
<script>
window.pgLoadTracking = function () {{
  if (window.pgTrackingOn) return; window.pgTrackingOn = 1;
  var s = document.createElement('script'); s.async = 1; s.src = 'https://www.googletagmanager.com/gtag/js?id=G-8TWBX69GCB'; document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {{ dataLayer.push(arguments); }};
  gtag('js', new Date()); gtag('config', 'G-8TWBX69GCB');
  !function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1334570271975920'); fbq('track', 'PageView');
}};
try {{ if (localStorage.getItem('pg_consent') === 'yes') window.pgLoadTracking(); }} catch (e) {{}}
</script>
<meta name="facebook-domain-verification" content="qp306huf4f7utiey0cvfrvxd8tr2wj" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{BASE}{path}">
<meta name="theme-color" content="#F2F2F7">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pulse Generation UG">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{BASE}{path}">
<meta property="og:image" content="{BASE}{image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@lwasapulse_ug">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/pulse-logo-32.png">
<link rel="apple-touch-icon" href="/brand/pulse-logo-180.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
<link rel="stylesheet" href="/site/site.css?v=11">
<script>(function(){{{theme}}})();</script>
{extra}</head>
'''

# (nav name, page, icon, who it is for) – feeds the Products menu, the Pricing page and the app chooser
APPS = [
    ("PulseHMIS", "/pulsehmis/", "/site/img/pulsehmis-icon-96.webp", "Hospitals & clinics"),
    ("PulseLMIS", "/pulselmis/", "/site/img/pulselmis-icon-96.webp", "Medical laboratories"),
    ("EduPulse", "/edupulse/", "/site/img/edupulse-icon-96.webp", "Schools, colleges & universities"),
    ("PulseRemit Pro", "/pulseremit-pro/", "/site/img/pulseremit-icon-96.webp", "Banks, SACCOs & money transfer"),
    ("PulseStock", "/pulsestock/", "/site/img/pulsestock-icon-96.webp", "Pharmacies, supermarkets & shops"),
    ("PulseProperty Pro", "/pulseproperty/", "/site/img/pulseproperty-icon-96.webp", "Landlords & property managers"),
    ("Lwasa Ludo", "/lwasa-ludo/", "/site/img/ludo-icon-96.webp", "Free 3D Ludo game in Luganda"),
]

def nav(active=""):
    apps = "".join(
        f'<a class="pm-item" href="{u}"{" aria-current=\"page\"" if n == active else ""}><img src="{i}" alt="" width="40" height="40" loading="lazy"><span><b>{n}</b><small>{w}</small></span></a>'
        for n, u, i, w in APPS)
    on = active in [a[0] for a in APPS]
    links = [("Pricing", "/pricing/"), ("Customers", "/customers/"), ("Security", "/security/"), ("Help", "/help/"), ("Company", "/company/")]
    li = "".join(f'<a href="{u}"{" data-needs=\"stories\" hidden" if n == "Customers" else ""}{" aria-current=\"page\" data-keep-active" if n == active else ""}>{n}</a>' for n, u in links)
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Pulse Generation UG home">
      <img src="/brand/pulse-logo-64.png" srcset="/brand/pulse-logo-128.png 2x" alt="" width="34" height="34">
      <span>Pulse Generation<small>Uganda</small></span>
    </a>
    <nav class="nav-links" aria-label="Main">
      <div class="prodmenu" data-products-menu>
        <button class="pm-btn{" active" if on else ""}" type="button" aria-expanded="false" aria-controls="pm-panel">Products<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="pm-panel" id="pm-panel" hidden>
          <div class="pm-grid">{apps}</div>
          <div class="pm-foot"><a href="/pricing/">Compare prices{ICON["arrow"]}</a><a href="/#downloads">All downloads{ICON["arrow"]}</a><a href="/changelog/">What’s new{ICON["arrow"]}</a></div>
        </div>
      </div>{li}</nav>
    <div class="nav-actions">
      <button class="search-pill" type="button" data-search-open aria-label="Search">{ICON["search"]}<span>Search</span><kbd data-kbd>Ctrl K</kbd></button>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle dark mode">{ICON["moon"]}{ICON["sun"]}</button>
      <a class="icon-btn acct-btn" href="/account/" data-account-link aria-label="My account" title="My account">{ICON["person"]}</a>
      <a class="btn btn-sm btn-gray nav-cta nav-dl" href="/#downloads">{ICON["download"]}<span>Download</span></a>
      <a class="btn btn-sm nav-cta" href="/demo/">Book a demo</a>
    </div>
  </div>
</header>
'''

def tabbar(active="home"):
    tabs = [("home", "Home", "/", ICON["home"]), ("apps", "Apps", "/#products", ICON["apps"]),
            ("downloads", "Downloads", "/#downloads", ICON["dl-fill"]), ("tutorials", "Videos", "/#tutorials", ICON["play-fill"]),
            ("contact", "Contact", "/#contact", ICON["chat-fill"])]
    items = "".join(f'<li><a href="{u}"{" class=\"active\" data-keep-active" if k == active else ""}>{i}<span>{n}</span></a></li>' for k, n, u, i in tabs)
    return f'<nav class="tabbar" aria-label="Quick navigation"><ul>{items}</ul></nav>\n'

def socials():
    return "".join(f'<a href="{u}" target="_blank" rel="noopener" aria-label="{n}">{svg}</a>' for n, u, svg in SOCIAL.values())

def footer():
    return f'''<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="/"><img src="/brand/pulse-logo-64.png" srcset="/brand/pulse-logo-128.png 2x" alt="" width="34" height="34"><span>Pulse Generation UG</span></a>
        <p class="about">Offline-first software for hospitals, schools, banks and play. Designed and built in Uganda, for the real conditions of East Africa.</p>
        <div class="socials">{socials()}</div>
      </div>
      <div>
        <h4>Apps</h4>
        <ul>
          <li><a href="/pulsehmis/">PulseHMIS</a></li>
          <li><a href="/edupulse/">EduPulse</a></li>
          <li><a href="/pulseremit-pro/">PulseRemit Pro</a></li>
          <li><a href="/pulseproperty/">PulseProperty Pro</a></li>
          <li><a href="/pulsestock/">PulseStock</a></li>
          <li><a href="/pulselmis/">PulseLMIS</a></li>
          <li><a href="/lwasa-ludo/">Lwasa Ludo</a></li>
          <li><a href="/pricing/">Pricing</a></li>
          <li><a href="/#downloads">All downloads</a></li>
          <li><a href="/changelog/">What’s new (changelog)</a></li>
        </ul>
      </div>
      <div>
        <h4>Learn</h4>
        <ul>
          <li><a href="/help/">Help Center</a></li>
          <li><a href="/#tutorials">Video tutorials</a></li>
          <li><a href="/tutorial.html">PulseHMIS interactive guide</a></li>
          <li><a href="/#faq">FAQ</a></li>
          <li><a href="/edupulse/privacy-policy.html">EduPulse privacy</a></li>
          <li><a href="/pulsehmis/privacy-policy.html">PulseHMIS privacy</a></li>
          <li><a href="/pulseremit-pro/privacy-policy.html">PulseRemit Pro privacy</a></li>
          <li><a href="/lwasa-ludo/privacy-policy.html">Lwasa Ludo privacy</a></li>
          <li><a href="/pulseproperty/privacy-policy.html">PulseProperty Pro privacy</a></li>
          <li><a href="/pulsestock/privacy-policy.html">PulseStock privacy</a></li>
          <li><a href="/pulselmis/privacy-policy.html">PulseLMIS privacy</a></li>
          <li><a href="/delete-account/">Delete your account</a></li>
          <li><a href="/refund-policy/">Refund &amp; return policy</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/company/">About us</a></li>
          <li><a href="/customers/" data-needs="stories" hidden>Customer stories</a></li>
          <li><a href="/security/">Security &amp; your data</a></li>
          <li><a href="/demo/">Book a demo</a></li>
        </ul>
        <h4 class="mt-24">Contact</h4>
        <ul>
          <li><a href="https://wa.me/256700677555" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="tel:+256700677555">+256 700 677 555</a></li>
          <li><a href="tel:+256761174741">+256 761 174 741</a></li>
          <li><a href="tel:+211920677555">+211 920 677 555</a></li>
          <li><a href="mailto:pulsegenerationug@gmail.com">pulsegenerationug@gmail.com</a></li>
        </ul>
      </div>
    </div>
    <form class="newsletter" data-newsletter novalidate>
      <div><h4>Release news &amp; tips</h4><p>New versions, features and training videos. No spam; leave any time.</p></div>
      <div class="nl-row"><input type="email" name="email" placeholder="Your email address" aria-label="Your email address" autocomplete="email" required>
        <button class="btn" type="submit">Subscribe</button></div>
      <p class="form-status" aria-live="polite"></p>
    </form>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Pulse Generation UG. All rights reserved.</span>
      <span class="motto">INNOVATE. BUILD. TRANSFORM.</span>
      <span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="/refund-policy/">Refunds</a> · <a href="/account/">My account</a> · <a href="/delete-account/">Delete account</a> · <a href="/support/">Support</a> · <button type="button" class="linklike" data-cookie-settings>Cookie settings</button></span>
    </div>
  </div>
</footer>
'''

PRICES = {  # UGX, as shipped in each app (lib/.../licen[cs]e*.dart, app_info.dart): 1 month, 6 months, 1 year, lifetime
    "pulsehmis": ("PulseHMIS", "one facility (all its branches)", [50000, 200000, 400000, 1500000]),
    "pulselmis": ("PulseLMIS", "one laboratory (all its branches)", [60000, 300000, 550000, 2000000]),
    "edupulse": ("EduPulse", "one school (all its campuses)", [50000, 200000, 400000, 1500000]),
    "pulseremit": ("PulseRemit Pro", "one institution (all its branches)", [150000, 750000, 1300000, 5000000]),
    "pulsestock": ("PulseStock", "one business (all its branches)", [80000, 400000, 750000, 3000000]),
    "pulseproperty": ("PulseProperty Pro", "one landlord or agency (all its properties)", [100000, 500000, 900000, 3500000]),
}

def price_table():
    """The Pricing page: one row per app, so buyers compare everything at a glance."""
    rows = "".join(
        f'<tr><th scope="row"><a href="{next(a[1] for a in APPS if a[0] == n)}">{n}</a><small>{scope}</small></th>'
        + "".join(f'<td data-label="{lab}"{" class=\"best\"" if i == 2 else ""}>UGX {v:,}</td>' for i, (lab, v) in enumerate(zip(("1 month", "6 months", "1 year", "Lifetime"), p)))
        + f'<td><a class="btn btn-sm btn-gray" href="/demo/?product={n.replace(" ", "+")}">Demo</a></td></tr>'
        for n, scope, p in PRICES.values())
    return f'''<div class="table-scroll"><table class="price-table">
  <thead><tr><th scope="col">App</th><th scope="col">1 month</th><th scope="col">6 months</th><th scope="col" class="best">1 year <span class="price-tag-inline">Best value</span></th><th scope="col">Lifetime</th><th scope="col"><span class="sr-only">Demo</span></th></tr></thead>
  <tbody>{rows}
  <tr><th scope="row"><a href="/lwasa-ludo/">Lwasa Ludo</a><small>the game</small></th><td colspan="4" data-label="Price">Free, no ads</td><td></td></tr></tbody>
</table></div>'''

def stories_section(product=""):
    """Customer stories from content.json; the section stays hidden until real stories exist."""
    return f'''<section class="section" hidden aria-labelledby="stories-title{product.replace(" ", "")}" data-stories-section>
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow"><span class="dot" style="color:var(--green)"></span>Customer stories</span>
      <h2 class="title-1" id="stories-title{product.replace(" ", "")}">Trusted where it matters.</h2></div>
    {"" if product else '<div class="stats" data-stats hidden></div>'}
    <div class="story-grid" data-stories="{product}"></div>
    <p class="center mt-24"><a class="btn btn-gray" href="/customers/">More customer stories{ICON["arrow"]}</a></p>
  </div>
</section>'''

def pricing(key):
    name, scope, p = PRICES[key]
    plans = [("1 Month", p[0], "Great for getting started", False), ("6 Months", p[1], "Save vs paying monthly", False),
             ("1 Year", p[2], "Best value for most", True), ("Lifetime", p[3], "One payment, permanent licence", False)]
    cards = "".join(
        f'<div class="price-card{" best" if best else ""}">{"<span class=\"price-tag\">Best value</span>" if best else ""}'
        f'<h3>{n}</h3><p class="price">UGX {v:,}</p><p class="muted">{blurb}</p></div>' for n, v, blurb, best in plans)
    return f'''<section class="section section-alt" id="pricing">
  <div class="wrap">
    <div class="section-head center"><p class="eyebrow">Pricing</p><h2 class="title-1">Simple plans. 30 days free.</h2>
      <p class="lead">One licence covers {scope}. Every computer and phone on your network is included. Pay by MTN or Airtel Mobile Money; the key activates by itself.</p></div>
    <div class="price-grid">{cards}</div>
    <div class="hero-cta center mt-24"><a class="btn btn-lg" href="/#downloads">{ICON["download"]}Start the free trial</a>
      <a class="btn btn-lg btn-glass" href="/demo/?product={name.replace(" ", "+")}">{ICON["chat-fill"]}Book a free demo</a></div>
  </div>
</section>'''

def faq_block(home):
    """The FAQ list from the home page, so the Help Center and home never disagree."""
    start = home.index('<div class="faq">')
    end = home.index("</section>", start)
    return home[start:home.rindex("</div>", start, end)].replace('href="#contact"', 'href="/#contact"')

def md(text):
    """Just enough Markdown for our release notes: headings, lists, bold, code and links."""
    import html as h
    def inline(t):
        t = h.escape(t, quote=False)
        t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
        t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
        return re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', t)
    out, lists = [], []  # lists: stack of open list tags
    def close(to=0):
        while len(lists) > to: out.append(f"</{lists.pop()}>")
    for line in text.replace("\r", "").split("\n"):
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)", line)
        if m:
            depth = len(m.group(1)) // 2 + 1
            tag = "ol" if m.group(2)[0].isdigit() else "ul"
            close(depth) if len(lists) > depth else None
            while len(lists) < depth: out.append(f"<{tag}>"); lists.append(tag)
            out.append(f"<li>{inline(m.group(3))}</li>")
            continue
        close()
        if not line.strip(): continue
        hm = re.match(r"^(#{1,4})\s+(.*)", line)
        if hm: out.append(f"<h{min(len(hm.group(1)) + 2, 5)}>{inline(hm.group(2))}</h{min(len(hm.group(1)) + 2, 5)}>")
        else: out.append(f"<p>{inline(line)}</p>")
    close()
    return "\n".join(out)

def changelog_page():
    """Release notes from changelog.json (refresh it with: gh api repos/pulsegenerationug/pulsegeneration/releases)."""
    import json, datetime
    rels = json.loads((HERE / "changelog.json").read_text(encoding="utf-8"))
    items = []
    for r in rels:
        d = datetime.date.fromisoformat(r["date"])
        body = re.sub(r"^# .*\n+", "", (r["body"] or "").replace("\r", ""))  # the title is shown already
        items.append(f'''<article class="cl-item" id="{r["tag"]}">
      <div class="cl-date"><time datetime="{r["date"]}">{d.day} {d:%b %Y}</time><a href="{r["url"]}" target="_blank" rel="noopener">{r["tag"]}</a></div>
      <div class="cl-body tile"><h2 class="title-3">{r["name"].strip()}</h2>{md(body)}
        <p class="mt-16"><a class="btn btn-sm btn-gray" href="{r["url"]}" target="_blank" rel="noopener">Files for this release{ICON["arrow"]}</a></p></div>
    </article>''')
    return f'''<section class="section" style="padding-top:110px">
  <div class="wrap" style="max-width:980px">
    <p class="eyebrow">Changelog</p>
    <h1 class="title-1">What’s new</h1>
    <p class="lead">Every release of every Pulse app, newest first. To update, download the new version from <a href="/#downloads">Downloads</a>.</p>
    <div class="cl-list mt-32">{"".join(items)}</div>
  </div>
</section>'''

def page(out, title, desc, path, body, active="", tab="home", body_class="", force_dark=False, image="/og-image.png", jsonld=""):
    html = (head(title, desc, path, image=image, force_dark=force_dark, extra=jsonld) +
            f'<body class="{body_class}">\n' + nav(active) + '<main id="main">\n' + body + '\n</main>\n' + footer() + tabbar(tab) +
            f'<a class="wa-float" href="https://wa.me/256700677555?text=Hello%20Pulse%20Generation%20UG" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">{ICON["wa"]}</a>\n'
            '<div class="toast-region" aria-live="polite"></div>\n<script src="/site/site.js?v=11" defer></script>\n</body>\n</html>\n')
    # tiny template helpers inside bodies: {{icon:name}} and {{social:name}}
    html = re.sub(r"\{\{icon:([\w-]+)\}\}", lambda m: ICON[m.group(1)], html)
    html = re.sub(r"\{\{socials\}\}", lambda m: socials(), html)
    html = re.sub(r"\{\{pricing:([\w-]+)\}\}", lambda m: pricing(m.group(1)), html)
    html = html.replace("{{price-table}}", price_table())
    html = html.replace("{{apps-grid}}", "".join(
        f'<a class="pm-item tile" href="{u}"><img src="{i}" alt="" width="40" height="40" loading="lazy"><span><b>{n}</b><small>{w}</small></span></a>' for n, u, i, w in APPS))
    html = re.sub(r"\{\{stories(?::([^}]*))?\}\}", lambda m: stories_section(m.group(1) or ""), html)
    target = SITE / out
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding="utf-8", newline="\n")
    print("wrote", out, len(html) // 1024, "KB")

if __name__ == "__main__":
    import json
    org = '<script type="application/ld+json">' + json.dumps({
        "@context": "https://schema.org", "@type": "Organization", "name": "Pulse Generation UG",
        "url": BASE, "logo": BASE + "/brand/pulse-logo-512.png", "founder": {"@type": "Person", "name": "Lwasa George"},
        "email": "pulsegenerationug@gmail.com", "telephone": "+256700677555",
        "sameAs": [v[1] for v in SOCIAL.values()]}) + "</script>\n"
    def app_ld(name, cat, desc, path, os="Android, Windows, macOS"):
        p = next((v[2] for v in PRICES.values() if v[0] == name), None)
        offers = ({"@type": "AggregateOffer", "lowPrice": p[0], "highPrice": p[3], "priceCurrency": "UGX", "offerCount": 4} if p
                  else {"@type": "Offer", "price": "0", "priceCurrency": "UGX"})
        return '<script type="application/ld+json">' + json.dumps({
            "@context": "https://schema.org", "@type": "SoftwareApplication", "name": name, "operatingSystem": os,
            "applicationCategory": cat, "description": desc, "url": BASE + path, "image": BASE + "/images/og/" + path.strip("/") + ".png",
            "offers": offers,
            "publisher": {"@type": "Organization", "name": "Pulse Generation UG"}}) + "</script>\n"

    P = HERE / "pages"
    page("index.html", "Pulse Generation UG · Offline-first apps for hospitals, schools, banks and play",
         "Offline-first apps for hospitals, laboratories, schools, money transfer, property and stock: PulseHMIS, PulseLMIS, EduPulse, PulseRemit Pro, PulseProperty Pro, PulseStock and Lwasa Ludo. Built in Uganda for Android, Windows and Mac.",
         "/", (P / "home.html").read_text(encoding="utf-8"), tab="home", jsonld=org)
    page("pulsehmis/index.html", "PulseHMIS · Hospital management that works with no internet",
         "PulseHMIS runs your whole clinic, from reception to the injection room, over your own local network. Offline-first, for Android, Windows and Mac.",
         "/pulsehmis/", (P / "pulsehmis.html").read_text(encoding="utf-8") + "{{stories:PulseHMIS}}", active="PulseHMIS", tab="apps", image="/images/og/pulsehmis.png",
         jsonld=app_ld("PulseHMIS", "MedicalApplication", "Offline-first hospital management information system.", "/pulsehmis/"))
    page("edupulse/index.html", "EduPulse · School administration that works offline",
         "EduPulse manages students, attendance, fees, payroll, exams and automatic report cards for schools, colleges and universities. Offline-first, for Android, Windows and Mac.",
         "/edupulse/", (P / "edupulse.html").read_text(encoding="utf-8") + "{{stories:EduPulse}}", active="EduPulse", tab="apps", image="/images/og/edupulse.png",
         jsonld=app_ld("EduPulse", "EducationalApplication", "Offline-first school, college and university administration system.", "/edupulse/"))
    page("pulseremit-pro/index.html", "PulseRemit Pro · Branch banking, SACCO & money transfer",
         "Savings accounts, deposits, withdrawals, balance enquiries, loans, money transfers and cash control for banks, MFIs and SACCOs. Works on the branch network without internet. Android, Windows and Mac.",
         "/pulseremit-pro/", (P / "pulseremit.html").read_text(encoding="utf-8") + "{{stories:PulseRemit Pro}}", active="PulseRemit Pro", tab="apps", image="/images/og/pulseremit-pro.png",
         jsonld=app_ld("PulseRemit Pro", "FinanceApplication", "Branch banking, SACCO and money-transfer system for financial institutions.", "/pulseremit-pro/"))
    page("lwasa-ludo/index.html", "Lwasa Ludo · The classic board game in 3D, in Luganda",
         "Play Ludo in 3D against the computer, with friends on one device or online with players anywhere. Blitz mode, trophies, unlockable dice and boards and Luganda commentary. Android, Windows and Mac.",
         "/lwasa-ludo/", (P / "ludo.html").read_text(encoding="utf-8"), active="Lwasa Ludo", tab="apps", image="/images/og/lwasa-ludo.png", body_class="ludo-page", force_dark=True,
         jsonld=app_ld("Lwasa Ludo", "GameApplication", "3D Ludo board game with Luganda commentary.", "/lwasa-ludo/"))
    page("pulseproperty/index.html", "PulseProperty Pro · Property & rent management that works offline",
         "PulseProperty Pro manages units, tenants, leases, automatic invoices, rent receipts, deposits, meters, repairs and landlord statements. Offline-first, for Android, Windows and Mac.",
         "/pulseproperty/", (P / "pulseproperty.html").read_text(encoding="utf-8") + "{{stories:PulseProperty Pro}}", active="PulseProperty", tab="apps", image="/images/og/pulseproperty.png",
         jsonld=app_ld("PulseProperty Pro", "BusinessApplication", "Offline-first property, rent and estate management.", "/pulseproperty/"))
    page("pulsestock/index.html", "PulseStock · Pharmacy, supermarket & inventory software that works offline",
         "PulseStock runs pharmacies, supermarkets and shops: offline barcode tills, batches and expiry, prescriptions with dose checks, purchasing and branch transfers. For Android, Windows and Mac.",
         "/pulsestock/", (P / "pulsestock.html").read_text(encoding="utf-8") + "{{stories:PulseStock}}", active="PulseStock", tab="apps", image="/images/og/pulsestock.png",
         jsonld=app_ld("PulseStock", "BusinessApplication", "Offline-first point of sale, pharmacy and inventory management.", "/pulsestock/"))
    page("pulselmis/index.html", "PulseLMIS · Laboratory information system that works offline",
         "PulseLMIS runs medical and reference laboratories: reception, barcoded specimens, result entry with critical alerts, validation, branded reports, QC, analyser interfaces, billing and branches. For Android and Windows.",
         "/pulselmis/", (P / "pulselmis.html").read_text(encoding="utf-8") + "{{stories:PulseLMIS}}", active="PulseLMIS", tab="apps", image="/images/og/pulselmis.png",
         jsonld=app_ld("PulseLMIS", "MedicalApplication", "Offline-first laboratory information system.", "/pulselmis/", os="Android, Windows"))
    page("support/index.html", "Support · Pulse Generation UG", "Read our reply to your message and answer back.", "/support/",
         (P / "support.html").read_text(encoding="utf-8"), tab="home")
    page("account/index.html", "My account · Pulse Generation UG", "Your Pulse account: conversations with us, your details and release news.", "/account/",
         (P / "account.html").read_text(encoding="utf-8"), tab="home")
    page("delete-account/index.html", "Delete your account or data · Pulse Generation UG",
         "How to delete your account or your organisation's data in PulseHMIS, EduPulse, PulseRemit Pro, PulseProperty Pro, PulseStock, PulseLMIS and Lwasa Ludo: in the app, by e-mail or on WhatsApp.",
         "/delete-account/", (P / "delete-account.html").read_text(encoding="utf-8"), tab="home")
    page("refund-policy/index.html", "Refund & return policy · Pulse Generation UG",
         "Free 30-day trials, full refunds within 7 days if a licence doesn't work, exchanges between plans and apps, and how to ask for a refund.",
         "/refund-policy/", (P / "refund-policy.html").read_text(encoding="utf-8"), tab="home")
    page("pricing/index.html", "Pricing · Pulse Generation UG",
         "Prices for PulseHMIS, PulseLMIS, EduPulse, PulseRemit Pro, PulseStock and PulseProperty Pro: 30 days free, then monthly, 6-month, yearly or lifetime licences paid by Mobile Money.",
         "/pricing/", (P / "pricing.html").read_text(encoding="utf-8"), active="Pricing", tab="apps")
    page("demo/index.html", "Book a free demo · Pulse Generation UG",
         "Book a free demo of PulseHMIS, PulseLMIS, EduPulse, PulseRemit Pro, PulseStock or PulseProperty Pro, online or at your premises.",
         "/demo/", (P / "demo.html").read_text(encoding="utf-8"), tab="contact")
    page("customers/index.html", "Customer stories · Pulse Generation UG",
         "How hospitals, laboratories, schools, SACCOs, shops and landlords run on Pulse apps.",
         "/customers/", (P / "customers.html").read_text(encoding="utf-8"), active="Customers", tab="apps")
    page("security/index.html", "Security & your data · Pulse Generation UG",
         "Where your data lives, how passwords and network traffic are protected, who can see what, backups, and how to report a security problem.",
         "/security/", (P / "security.html").read_text(encoding="utf-8"), active="Security")
    page("company/index.html", "About Pulse Generation UG · Offline-first software from Uganda",
         "Who we are, what we build, how we work and how to reach Pulse Generation UG, the Ugandan software company behind PulseHMIS, EduPulse and more.",
         "/company/", (P / "company.html").read_text(encoding="utf-8"), active="Company", jsonld=org)
    page("help/index.html", "Help Center · Pulse Generation UG",
         "Guides, videos, answers and support for every Pulse app: getting started, licences, backups, networks and updates.",
         "/help/", (P / "help.html").read_text(encoding="utf-8").replace("{{faq}}", faq_block((P / "home.html").read_text(encoding="utf-8"))), active="Help")
    page("changelog/index.html", "What’s new · Pulse Generation UG changelog",
         "Every Pulse app release, newest first: new features, fixes and how to update.",
         "/changelog/", changelog_page(), tab="downloads")
    page("404.html", "Page not found · Pulse Generation UG", "This page doesn't exist.", "/404",
         (P / "404.html").read_text(encoding="utf-8"), tab="home")
