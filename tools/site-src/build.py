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
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8TWBX69GCB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'G-8TWBX69GCB');
</script>
<meta charset="utf-8">
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
<link rel="stylesheet" href="/site/site.css?v=5">
<script>(function(){{{theme}}})();</script>
{extra}</head>
'''

def nav(active=""):
    links = [("PulseHMIS", "/pulsehmis/"), ("EduPulse", "/edupulse/"), ("PulseRemit Pro", "/pulseremit-pro/"), ("PulseProperty", "/pulseproperty/"), ("PulseStock", "/pulsestock/"), ("Lwasa Ludo", "/lwasa-ludo/"),
             ("Downloads", "/#downloads"), ("Tutorials", "/#tutorials"), ("Contact", "/#contact")]
    li = "".join(f'<a href="{u}"{" aria-current=\"page\" data-keep-active" if n == active else ""}>{n}</a>' for n, u in links)
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Pulse Generation UG home">
      <img src="/brand/pulse-logo-64.png" srcset="/brand/pulse-logo-128.png 2x" alt="" width="34" height="34">
      <span>Pulse Generation<small>Uganda</small></span>
    </a>
    <nav class="nav-links" aria-label="Main">{li}</nav>
    <div class="nav-actions">
      <button class="search-pill" type="button" data-search-open aria-label="Search">{ICON["search"]}<span>Search</span><kbd data-kbd>Ctrl K</kbd></button>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle dark mode">{ICON["moon"]}{ICON["sun"]}</button>
      <a class="icon-btn acct-btn" href="/account/" data-account-link aria-label="My account" title="My account">{ICON["person"]}</a>
      <a class="btn btn-sm nav-cta" href="/#downloads">{ICON["download"]}Download</a>
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
          <li><a href="/lwasa-ludo/">Lwasa Ludo</a></li>
          <li><a href="/#downloads">All downloads</a></li>
          <li><a href="https://github.com/pulsegenerationug/pulsegeneration/releases" target="_blank" rel="noopener">Release notes</a></li>
        </ul>
      </div>
      <div>
        <h4>Learn</h4>
        <ul>
          <li><a href="/#tutorials">Video tutorials</a></li>
          <li><a href="/tutorial.html">PulseHMIS interactive guide</a></li>
          <li><a href="/#faq">Help &amp; FAQ</a></li>
          <li><a href="/#about">About us</a></li>
          <li><a href="/edupulse/privacy-policy.html">EduPulse privacy</a></li>
          <li><a href="/pulsehmis/privacy-policy.html">PulseHMIS privacy</a></li>
          <li><a href="/pulseremit-pro/privacy-policy.html">PulseRemit Pro privacy</a></li>
          <li><a href="/lwasa-ludo/privacy-policy.html">Lwasa Ludo privacy</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
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
      <span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="/account/">My account</a> · <a href="/support/">Support</a></span>
    </div>
  </div>
</footer>
'''

PRICES = {  # UGX, as shipped in each app (lib/.../license*.dart)
    "edupulse": ("EduPulse", "one school (all its campuses)", [50000, 200000, 400000, 1500000]),
    "pulsehmis": ("PulseHMIS", "one facility (all its branches)", [50000, 200000, 400000, 1500000]),
    "pulseremit": ("PulseRemit Pro", "one institution (all its branches)", [150000, 750000, 1300000, 5000000]),
}

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
      <a class="btn btn-lg btn-glass" href="/?product={name.replace(" ", "+")}#contact">{ICON["chat-fill"]}Book a free demo</a></div>
  </div>
</section>'''

def page(out, title, desc, path, body, active="", tab="home", body_class="", force_dark=False, image="/og-image.png", jsonld=""):
    html = (head(title, desc, path, image=image, force_dark=force_dark, extra=jsonld) +
            f'<body class="{body_class}">\n' + nav(active) + '<main id="main">\n' + body + '\n</main>\n' + footer() + tabbar(tab) +
            f'<a class="wa-float" href="https://wa.me/256700677555?text=Hello%20Pulse%20Generation%20UG" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">{ICON["wa"]}</a>\n'
            '<div class="toast-region" aria-live="polite"></div>\n<script src="/site/site.js?v=5" defer></script>\n</body>\n</html>\n')
    # tiny template helpers inside bodies: {{icon:name}} and {{social:name}}
    html = re.sub(r"\{\{icon:([\w-]+)\}\}", lambda m: ICON[m.group(1)], html)
    html = re.sub(r"\{\{socials\}\}", lambda m: socials(), html)
    html = re.sub(r"\{\{pricing:([\w-]+)\}\}", lambda m: pricing(m.group(1)), html)
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
    def app_ld(name, cat, desc, path):
        return '<script type="application/ld+json">' + json.dumps({
            "@context": "https://schema.org", "@type": "SoftwareApplication", "name": name, "operatingSystem": "Android, Windows",
            "applicationCategory": cat, "description": desc, "url": BASE + path,
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "UGX"},
            "publisher": {"@type": "Organization", "name": "Pulse Generation UG"}}) + "</script>\n"

    P = HERE / "pages"
    page("index.html", "Pulse Generation UG · Offline-first apps for hospitals, schools, banks and play",
         "PulseHMIS, EduPulse, PulseRemit Pro and Lwasa Ludo: offline-first apps for Android and Windows, built in Uganda for East Africa. Download free.",
         "/", (P / "home.html").read_text(encoding="utf-8"), tab="home", jsonld=org)
    page("pulsehmis/index.html", "PulseHMIS · Hospital management that works with no internet",
         "PulseHMIS runs your whole clinic, from reception to the injection room, over your own local network. Offline-first, for Android and Windows.",
         "/pulsehmis/", (P / "pulsehmis.html").read_text(encoding="utf-8"), active="PulseHMIS", tab="apps",
         jsonld=app_ld("PulseHMIS", "MedicalApplication", "Offline-first hospital management information system.", "/pulsehmis/"))
    page("edupulse/index.html", "EduPulse · School administration that works offline",
         "EduPulse manages students, attendance, fees, payroll, exams and automatic report cards for schools, colleges and universities. Offline-first, for Android and Windows.",
         "/edupulse/", (P / "edupulse.html").read_text(encoding="utf-8"), active="EduPulse", tab="apps",
         jsonld=app_ld("EduPulse", "EducationalApplication", "Offline-first school, college and university administration system.", "/edupulse/"))
    page("pulseremit-pro/index.html", "PulseRemit Pro · Branch banking, SACCO & money transfer",
         "Savings accounts, deposits, withdrawals, balance enquiries, loans, money transfers and cash control for banks, MFIs and SACCOs. Works on the branch network without internet. Android and Windows.",
         "/pulseremit-pro/", (P / "pulseremit.html").read_text(encoding="utf-8"), active="PulseRemit Pro", tab="apps",
         jsonld=app_ld("PulseRemit Pro", "FinanceApplication", "Branch banking, SACCO and money-transfer system for financial institutions.", "/pulseremit-pro/"))
    page("lwasa-ludo/index.html", "Lwasa Ludo · The classic board game in 3D, in Luganda",
         "Play Ludo in 3D against the computer, with friends on one device or online with players anywhere. Blitz mode, trophies, unlockable dice and boards and Luganda commentary. Android and Windows.",
         "/lwasa-ludo/", (P / "ludo.html").read_text(encoding="utf-8"), active="Lwasa Ludo", tab="apps", body_class="ludo-page", force_dark=True,
         jsonld=app_ld("Lwasa Ludo", "GameApplication", "3D Ludo board game with Luganda commentary.", "/lwasa-ludo/"))
    page("pulseproperty/index.html", "PulseProperty Pro · Property & rent management that works offline",
         "PulseProperty Pro manages units, tenants, leases, automatic invoices, rent receipts, deposits, meters, repairs and landlord statements. Offline-first, for Android and Windows.",
         "/pulseproperty/", (P / "pulseproperty.html").read_text(encoding="utf-8"), active="PulseProperty", tab="apps",
         jsonld=app_ld("PulseProperty Pro", "BusinessApplication", "Offline-first property, rent and estate management.", "/pulseproperty/"))
    page("pulsestock/index.html", "PulseStock · Pharmacy, supermarket & inventory software that works offline",
         "PulseStock runs pharmacies, supermarkets and shops: offline barcode tills, batches and expiry, prescriptions with dose checks, purchasing and branch transfers. For Android and Windows.",
         "/pulsestock/", (P / "pulsestock.html").read_text(encoding="utf-8"), active="PulseStock", tab="apps",
         jsonld=app_ld("PulseStock", "BusinessApplication", "Offline-first point of sale, pharmacy and inventory management.", "/pulsestock/"))
    page("support/index.html", "Support · Pulse Generation UG", "Read our reply to your message and answer back.", "/support/",
         (P / "support.html").read_text(encoding="utf-8"), tab="home")
    page("account/index.html", "My account · Pulse Generation UG", "Your Pulse account: conversations with us, your details and release news.", "/account/",
         (P / "account.html").read_text(encoding="utf-8"), tab="home")
    page("404.html", "Page not found · Pulse Generation UG", "This page doesn't exist.", "/404",
         (P / "404.html").read_text(encoding="utf-8"), tab="home")
