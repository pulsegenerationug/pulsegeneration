/* Pulse Generation UG — site behaviour.
   Downloads and tutorials are read from /content.json, so adding an app version
   or a video never needs a code change. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {}
    return null;
  }

  /* ================= ICONS ================= */
  var I = {
    android: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22a11.4 11.4 0 0 0-9.84 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>',
    windows: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.1 10.4 4v7.2H3zm8.3-1.2L21 2.5v8.7h-9.7zM3 12.1h7.4v7.2L3 18.2zm8.3 0H21v8.8l-9.7-1.4z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.1-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    page: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
    hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>'
  };

  /* ================= APP CATALOGUE ================= */
  var APPS = {
    "PulseHMIS": {
      slug: "pulsehmis", icon: "/site/img/pulsehmis-icon-192.webp",
      subtitle: "Hospital management that works with no internet",
      category: "Health & Medical", color: "ico-teal"
    },
    "EduPulse": {
      slug: "edupulse", icon: "/site/img/edupulse-icon.svg",
      subtitle: "School, college & university administration, offline-first",
      category: "Education", color: "ico-indigo"
    },
    "Lwasa Ludo": {
      slug: "lwasa-ludo", icon: "/site/img/ludo-icon-192.webp",
      subtitle: "The classic board game in 3D, with Luganda commentary",
      category: "Board game", color: "ico-blue"
    }
  };
  var RELEASES_URL = "https://github.com/pulsegenerationug/pulsegeneration/releases/latest";

  /* Used until /content.json loads, and if it ever fails to. Keep in step with content.json. */
  var FALLBACK = {
    tutorials: [
      { title: "PulseHMIS full tutorial", video: "https://youtu.be/0zYYHmW_cd0", product: "PulseHMIS", description: "A complete walkthrough of hospital software that works with no internet, from reception to pharmacy." },
      { title: "PulseHMIS video tutorial 1", video: "https://youtu.be/ql-2STHf8xc", product: "PulseHMIS", description: "Watch PulseHMIS in action." },
      { title: "PulseHMIS video tutorial 2", video: "https://youtu.be/N5Jh59oMvws", product: "PulseHMIS", description: "Watch PulseHMIS in action." },
      { title: "Lwasa Ludo", video: "https://youtu.be/qHFgzQnEiSc", product: "Lwasa Ludo", description: "The classic board game in 3D, with Luganda commentary." }
    ],
    downloads: [
      { app: "PulseHMIS", platform: "Android", version: "1.0.0", size: "74 MB", url: "https://github.com/pulsegenerationug/pulsegeneration/releases/download/v1.0.0/PulseHMIS.apk" },
      { app: "PulseHMIS", platform: "Windows", version: "1.0.0", size: "16 MB", url: "https://github.com/pulsegenerationug/pulsegeneration/releases/download/v1.0.0/PulseHMIS-Setup-1.0.0.exe" },
      { app: "EduPulse", platform: "Android", version: "1.4.0", size: "80 MB", url: "https://github.com/pulsegenerationug/pulsegeneration/releases/download/v1.0.0/EduPulse-1.4.0.apk" },
      { app: "EduPulse", platform: "Windows", version: "1.4.0", size: "18 MB", url: "https://github.com/pulsegenerationug/pulsegeneration/releases/download/v1.0.0/EduPulse_Setup_1.4.0.exe" },
      { app: "Lwasa Ludo", platform: "Android", version: "1.0.0", size: "62 MB", url: "https://github.com/pulsegenerationug/pulsegeneration/releases/download/v1.0.0/Lwasa_Ludo.apk" },
      { app: "Lwasa Ludo", platform: "Windows", version: "1.0.0", size: "13 MB", url: "https://github.com/pulsegenerationug/pulsegeneration/releases/download/v1.0.0/LwasaLudoSetup-1.0.0.exe" }
    ]
  };

  function ytId(v) {
    var t = String(v || "").trim();
    if (/^[\w-]{11}$/.test(t)) return t;
    var m = t.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  function normalise(data) {
    data = data || {};
    var seen = {};
    var tutorials = (Array.isArray(data.tutorials) ? data.tutorials : []).map(function (t) {
      var id = ytId(t && (t.video || t.youtubeId));
      if (!id || !t.title || seen[id]) return null;
      seen[id] = 1;
      return { id: id, title: String(t.title), product: String(t.product || ""), description: String(t.description || "") };
    }).filter(Boolean);
    var downloads = (Array.isArray(data.downloads) ? data.downloads : []).map(function (d) {
      if (!d || !d.app || !d.platform || !/^https:\/\//i.test(d.url || "")) return null;
      var file = "";
      try { file = decodeURIComponent(String(d.url).split("?")[0].split("/").pop()); } catch (e) {}
      return { app: String(d.app), platform: String(d.platform), version: d.version ? String(d.version) : "", size: d.size ? String(d.size) : "", url: String(d.url), file: d.filename || file };
    }).filter(Boolean);
    return { tutorials: tutorials, downloads: downloads };
  }
  var CONTENT = normalise(FALLBACK);
  var contentListeners = [];
  function onContent(fn) { contentListeners.push(fn); fn(CONTENT); }
  fetch("/content.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (json) {
      if (!json) return;
      var n = normalise(json);
      if (n.downloads.length) CONTENT.downloads = n.downloads;
      if (n.tutorials.length) CONTENT.tutorials = n.tutorials;
      contentListeners.forEach(function (fn) { fn(CONTENT); });
    })
    .catch(function () {});

  /* ================= PLATFORM ================= */
  var ua = navigator.userAgent || "";
  var PLATFORM = /Android/i.test(ua) ? "android"
    : /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "ios"
    : /Windows/i.test(ua) ? "windows"
    : /Macintosh|Mac OS X/i.test(ua) ? "mac"
    : /Linux|CrOS/i.test(ua) ? "linux" : "other";
  root.setAttribute("data-platform", PLATFORM);
  function pickFor(list) {
    if (PLATFORM === "android") return list.filter(function (d) { return /android/i.test(d.platform); })[0];
    if (PLATFORM === "windows") return list.filter(function (d) { return /windows/i.test(d.platform); })[0];
    return null;
  }

  /* ================= THEME ================= */
  var mql = window.matchMedia("(prefers-color-scheme: dark)");
  function applyTheme() {
    var pref = store("pg_theme");
    if (pref === "light" || pref === "dark") root.setAttribute("data-theme", pref); else root.removeAttribute("data-theme");
    var mode = pref === "light" || pref === "dark" ? pref : (mql.matches ? "dark" : "light");
    if (document.body && document.body.classList.contains("ludo-page")) mode = "dark";
    root.setAttribute("data-theme-mode", mode);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "dark" ? "#000000" : "#F2F2F7");
  }
  applyTheme();
  if (mql.addEventListener) mql.addEventListener("change", applyTheme);
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme-mode");
      store("pg_theme", cur === "dark" ? "light" : "dark");
      applyTheme();
      toast(cur === "dark" ? "Light appearance" : "Dark appearance", "info");
    });
  });

  /* ================= NAV ================= */
  var nav = $(".nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight the nav/tab item for the section in view (home page sections, or product-page subnav).
  var spyLinks = $$('.nav-links a[href^="/#"], .nav-links a[href^="#"], .tabbar a[href^="/#"], .tabbar a[href^="#"], .subnav nav a[href^="#"]');
  var spyIds = {};
  spyLinks.forEach(function (a) {
    var id = a.getAttribute("href").split("#")[1];
    if (id && document.getElementById(id)) (spyIds[id] = spyIds[id] || []).push(a);
  });
  if (Object.keys(spyIds).length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (a) { if (!a.hasAttribute("data-keep-active")) a.classList.remove("active"); });
        (spyIds[e.target.id] || []).forEach(function (a) { a.classList.add("active"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(spyIds).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ================= REVEAL + COUNTERS ================= */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    $$(".reveal, .reveal-scale").forEach(function (el) { rev.observe(el); });
  } else {
    $$(".reveal, .reveal-scale").forEach(function (el) { el.classList.add("in"); });
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    var pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = pre + target.toLocaleString(undefined, { minimumFractionDigits: dec }) + suf; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + (target * e).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
    }, { threshold: .4 });
    $$("[data-count]").forEach(function (el) { co.observe(el); });
  }

  /* Pointer tilt on hero devices */
  $$("[data-tilt]").forEach(function (stage) {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    var items = $$("[data-depth]", stage);
    stage.addEventListener("pointermove", function (ev) {
      var r = stage.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      items.forEach(function (it) {
        var d = parseFloat(it.getAttribute("data-depth"));
        it.style.transform = (it.classList.contains("laptop") ? "translateX(-50%) " : "") +
          "rotateY(" + (x * d * 10) + "deg) rotateX(" + (-y * d * 8) + "deg) translate3d(" + (x * d * 18) + "px," + (y * d * 14) + "px,0)";
      });
    });
    stage.addEventListener("pointerleave", function () {
      items.forEach(function (it) { it.style.transform = ""; });
    });
  });

  /* ================= SEGMENTED CONTROLS ================= */
  function segmented(el, onChange) {
    var btns = $$("button", el);
    var thumb = $(".thumb", el);
    if (!thumb) { thumb = document.createElement("span"); thumb.className = "thumb"; el.insertBefore(thumb, el.firstChild); }
    function place(btn) {
      thumb.style.width = btn.offsetWidth + "px";
      thumb.style.transform = "translateX(" + (btn.offsetLeft - 3) + "px)";
    }
    function select(btn, silent) {
      btns.forEach(function (b) { b.setAttribute("aria-selected", b === btn ? "true" : "false"); });
      place(btn);
      if (!silent && onChange) onChange(btn.getAttribute("data-value"), btn);
    }
    el.setAttribute("role", "tablist");
    btns.forEach(function (b) {
      b.setAttribute("role", "tab");
      b.addEventListener("click", function () { select(b); });
    });
    var initial = btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0] || btns[0];
    select(initial, true);
    window.addEventListener("resize", function () {
      var cur = btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0];
      if (cur) place(cur);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { select(initial, true); });
    var api = { select: function (v) { var b = btns.filter(function (x) { return x.getAttribute("data-value") === v; })[0]; if (b) select(b); } };
    el._seg = api;
    return api;
  }
  $$(".segmented[data-static]").forEach(function (el) { segmented(el); });

  /* ================= SHEETS ================= */
  var sheetEl, backdropEl, lastFocus;
  function closeSheet() {
    if (!sheetEl) return;
    document.body.classList.remove("sheet-open");
    var s = sheetEl, b = backdropEl;
    sheetEl = backdropEl = null;
    setTimeout(function () { s.remove(); b.remove(); document.body.classList.remove("lock"); }, 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openSheet(opts) {
    if (sheetEl) { sheetEl.remove(); backdropEl.remove(); }
    lastFocus = document.activeElement;
    backdropEl = document.createElement("div");
    backdropEl.className = "sheet-backdrop";
    sheetEl = document.createElement("div");
    sheetEl.className = "sheet" + (opts.small ? " small" : "");
    sheetEl.setAttribute("role", "dialog");
    sheetEl.setAttribute("aria-modal", "true");
    sheetEl.setAttribute("aria-label", opts.title || "Dialog");
    sheetEl.innerHTML = '<div class="sheet-grabber"></div><div class="sheet-head"><div style="flex:1;min-width:0"><h2>' + esc(opts.title) + '</h2>' +
      (opts.sub ? '<p>' + esc(opts.sub) + '</p>' : '') + '</div><button class="sheet-close" type="button" aria-label="Close">' + I.close + '</button></div><div class="sheet-body"></div>';
    $(".sheet-body", sheetEl).innerHTML = opts.html;
    document.body.appendChild(backdropEl);
    document.body.appendChild(sheetEl);
    document.body.classList.add("lock");
    backdropEl.addEventListener("click", closeSheet);
    $(".sheet-close", sheetEl).addEventListener("click", closeSheet);
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add("sheet-open"); }); });
    setTimeout(function () { var c = $(".sheet-close", sheetEl || document); if (c) c.focus(); }, 60);

    // Swipe the sheet down to dismiss, as on iOS.
    var grab = $(".sheet-grabber", sheetEl), head = $(".sheet-head", sheetEl), y0 = null, dy = 0, s = sheetEl;
    [grab, head].forEach(function (h) {
      h.addEventListener("touchstart", function (e) { y0 = e.touches[0].clientY; s.style.transition = "none"; }, { passive: true });
      h.addEventListener("touchmove", function (e) {
        if (y0 == null) return;
        dy = Math.max(0, e.touches[0].clientY - y0);
        s.style.transform = "translate(-50%," + dy + "px)";
      }, { passive: true });
      h.addEventListener("touchend", function () {
        s.style.transition = ""; s.style.transform = "";
        if (dy > 110) closeSheet();
        y0 = null; dy = 0;
      });
    });
    return sheetEl;
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (spotOpen) closeSpot(); else closeSheet(); }
    if (e.key === "Tab" && sheetEl) {
      var f = $$('a[href], button, input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])', sheetEl);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ================= TOASTS ================= */
  var toastRegion = $(".toast-region");
  if (!toastRegion) {
    toastRegion = document.createElement("div");
    toastRegion.className = "toast-region";
    toastRegion.setAttribute("aria-live", "polite");
    document.body.appendChild(toastRegion);
  }
  function toast(msg, kind) {
    var el = document.createElement("div");
    el.className = "toast";
    var bg = kind === "info" ? "var(--blue)" : kind === "warn" ? "var(--orange)" : "var(--green)";
    el.innerHTML = '<span class="t-ico" style="background:' + bg + '">' + (kind === "info" ? I.info : kind === "warn" ? I.warn : I.check) + '</span><span></span>';
    el.lastChild.textContent = msg;
    toastRegion.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("show"); }); });
    setTimeout(function () { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 400); }, 3200);
  }

  /* ================= DOWNLOADS ================= */
  function installSteps(d) {
    var android = /android/i.test(d.platform);
    var steps = android
      ? ["Wait for <b>" + esc(d.file) + "</b> to finish downloading.", "Open it from your notifications or the <b>Downloads</b> folder.", "If Android asks, allow <b>Install unknown apps</b> for your browser or file manager.", "Tap <b>Install</b>, then open " + esc(d.app) + "."]
      : ["Wait for <b>" + esc(d.file) + "</b> to finish downloading.", "Open the installer from your <b>Downloads</b> folder.", "If SmartScreen appears, choose <b>More info → Run anyway</b>.", "Follow the setup steps, then open " + esc(d.app) + " from the Start menu or desktop."];
    var note = android
      ? "Android shows an “unknown sources” prompt for any app installed outside the Play Store. This is expected."
      : "Windows SmartScreen can warn about new publishers. The installer comes straight from our official GitHub release.";
    return '<ol class="steps">' + steps.map(function (s) { return "<li><span>" + s + "</span></li>"; }).join("") + "</ol>" +
      '<div class="callout mt-16">' + I.warn + "<span>" + note + "</span></div>";
  }
  function onDownloadClick(d) {
    toast("Downloading " + d.app + " for " + d.platform + "…");
    var app = APPS[d.app] || {};
    openSheet({
      title: "Installing " + d.app,
      sub: d.platform + (d.version ? " · v" + d.version : "") + (d.size ? " · " + d.size : ""),
      small: true,
      html: '<div class="callout ok" style="margin-bottom:18px">' + I.check + "<span>Your download has started. If it didn’t, <a href=\"" + esc(d.url) + "\">tap here to try again</a>.</span></div>" +
        installSteps(d) +
        (app.slug ? '<div class="mt-24 wrap-gap"><a class="btn btn-tinted btn-sm" href="/' + app.slug + '/#videos">' + I.play + "Watch tutorials</a>" +
          '<a class="btn btn-gray btn-sm" href="/#contact">' + I.chat + "Get help</a></div>" : "")
    });
  }
  function dlButton(d, recommended) {
    var android = /android/i.test(d.platform);
    var kind = android ? "APK" : /windows/i.test(d.platform) ? "Installer (.exe)" : "Download";
    return '<a class="dl-btn' + (recommended ? " recommended" : "") + '" href="' + esc(d.url) + '" rel="noopener" data-dl="' + esc(d.app + "|" + d.platform) + '" aria-label="Download ' + esc(d.app) + " for " + esc(d.platform) + (d.size ? ", " + esc(d.size) : "") + '">' +
      (recommended ? '<span class="rec">For this device</span>' : "") +
      '<span class="os ' + (android ? "android" : "windows") + '">' + (android ? I.android : I.windows) + "</span>" +
      '<span class="txt"><b>' + esc(d.platform) + "</b><small>" + esc(kind) + (d.size ? " · " + esc(d.size) : "") + (d.version ? " · v" + esc(d.version) : "") + "</small></span>" +
      '<span class="arrow">' + I.download + "</span></a>";
  }
  function appCard(name, list) {
    var app = APPS[name] || { subtitle: "", icon: "/brand/pulse-logo-192.png" };
    var rec = pickFor(list);
    var version = list[0] && list[0].version;
    var platforms = list.map(function (d) { return d.platform; }).join(" & ");
    return '<article class="dl-app">' +
      '<img class="app-icon" src="' + esc(app.icon) + '" alt="" width="96" height="96" loading="lazy">' +
      "<div>" +
      '<div class="dl-head"><h3>' + esc(name) + "</h3>" + (version ? '<span class="pill blue">v' + esc(version) + "</span>" : "") + '<span class="pill green">' + I.check + "Free download</span></div>" +
      '<p class="dl-sub">' + esc(app.subtitle) + "</p>" +
      '<div class="dl-buttons">' + list.map(function (d) { return dlButton(d, rec === d); }).join("") + "</div>" +
      '<div class="dl-meta"><span>' + I.shield + "Official GitHub release</span><span>" + I.box + esc(platforms) + "</span>" +
      (app.slug ? '<span><a href="/' + app.slug + '/">' + "Learn more about " + esc(name) + " ›</a></span>" : "") + "</div>" +
      "</div></article>";
  }
  function renderDownloads(container, filter) {
    var groups = {}, order = [];
    CONTENT.downloads.forEach(function (d) {
      if (filter && filter !== "all" && d.app !== filter) return;
      if (!groups[d.app]) { groups[d.app] = []; order.push(d.app); }
      groups[d.app].push(d);
    });
    container.innerHTML = order.length
      ? order.map(function (a) { return appCard(a, groups[a]); }).join("")
      : '<p class="center muted">Downloads are being prepared. Check the <a href="' + RELEASES_URL + '">GitHub release</a>.</p>';
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-dl]");
    if (!a) return;
    var key = a.getAttribute("data-dl").split("|");
    var d = CONTENT.downloads.filter(function (x) { return x.app === key[0] && x.platform === key[1]; })[0];
    if (d) setTimeout(function () { onDownloadClick(d); }, 60);
  });

  $$("[data-downloads]").forEach(function (box) {
    var filter = box.getAttribute("data-downloads");
    var seg = box.parentNode.querySelector("[data-downloads-filter]");
    var current = filter;
    if (seg) segmented(seg, function (v) { current = v; renderDownloads(box, current); });
    onContent(function () { renderDownloads(box, current); });
  });

  // "Download" on a product card opens the downloads list filtered to that app.
  $$("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () {
      var seg = $("[data-downloads-filter]");
      if (seg && seg._seg) seg._seg.select(a.getAttribute("data-pick"));
    });
  });

  // Smart one-tap buttons: "Download for Windows" on a PC, "Download for Android" on a phone.
  $$("[data-smart-dl]").forEach(function (btn) {
    var appName = btn.getAttribute("data-smart-dl");
    var label = $(".label", btn);
    onContent(function () {
      var list = CONTENT.downloads.filter(function (d) { return d.app === appName; });
      var d = pickFor(list);
      if (d) {
        btn.href = d.url;
        btn.setAttribute("data-dl", d.app + "|" + d.platform);
        btn.setAttribute("rel", "noopener");
        if (label) label.textContent = "Download for " + d.platform;
        var ico = $(".os-ico", btn);
        if (ico) ico.innerHTML = /android/i.test(d.platform) ? I.android : I.windows;
      } else {
        btn.removeAttribute("data-dl");
        if (label) label.textContent = PLATFORM === "ios" || PLATFORM === "mac" ? "Get it for Android or Windows" : "Download";
      }
    });
  });
  // Version / size labels filled from content.json
  onContent(function () {
    $$("[data-app-version]").forEach(function (el) {
      var d = CONTENT.downloads.filter(function (x) { return x.app === el.getAttribute("data-app-version"); })[0];
      if (d && d.version) el.textContent = d.version;
    });
    $$("[data-app-size]").forEach(function (el) {
      var parts = el.getAttribute("data-app-size").split("|");
      var d = CONTENT.downloads.filter(function (x) { return x.app === parts[0] && x.platform === parts[1]; })[0];
      if (d && d.size) el.textContent = d.size;
    });
  });

  /* ================= VIDEOS ================= */
  function videoCard(t, featured) {
    var thumb = "https://i.ytimg.com/vi/" + t.id + "/" + (featured ? "maxresdefault" : "hqdefault") + ".jpg";
    return '<button type="button" class="video-card' + (featured ? " video-featured" : "") + '" data-video="' + esc(t.id) + '" aria-label="Play ' + esc(t.title) + '">' +
      '<div class="thumb"><img src="' + thumb + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + t.id + '/hqdefault.jpg\'"><span class="play">' + I.play + "</span></div>" +
      '<div class="v-body">' + (t.product ? '<span class="pill ' + (t.product === "PulseHMIS" ? "teal" : t.product === "EduPulse" ? "indigo" : "blue") + '" style="align-self:flex-start">' + esc(t.product) + "</span>" : "") +
      "<h3>" + esc(t.title) + "</h3>" + (t.description ? "<p>" + esc(t.description) + "</p>" : "") +
      (featured ? '<span class="btn btn-sm" style="align-self:flex-start;margin-top:8px">' + I.play + "Watch now</span>" : "") +
      "</div></button>";
  }
  function renderVideos(box, filter) {
    var list = CONTENT.tutorials.filter(function (t) { return !filter || filter === "all" || t.product === filter; });
    var max = parseInt(box.getAttribute("data-max") || "0", 10);
    if (max) list = list.slice(0, max);
    if (!list.length) {
      box.innerHTML = '<div class="video-empty"><p class="headline" style="color:var(--label)">Tutorials are on the way</p><p class="mt-8">New walkthroughs land on our YouTube channel first.</p>' +
        '<a class="btn btn-tinted btn-sm mt-16" href="https://www.youtube.com/@pulsegeneration_ug" target="_blank" rel="noopener">Visit YouTube</a></div>';
      return;
    }
    var feature = box.hasAttribute("data-feature");
    box.innerHTML = list.map(function (t, i) { return videoCard(t, feature && i === 0); }).join("");
  }
  $$("[data-videos]").forEach(function (box) {
    var current = box.getAttribute("data-videos");
    var seg = box.parentNode.querySelector("[data-videos-filter]");
    if (seg) segmented(seg, function (v) { current = v; renderVideos(box, current); });
    onContent(function () { renderVideos(box, current); });
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-video]");
    if (!b) return;
    var id = b.getAttribute("data-video");
    var t = CONTENT.tutorials.filter(function (x) { return x.id === id; })[0] || { title: "Video", product: "" };
    openSheet({
      title: t.title, sub: t.product,
      html: '<div class="sheet-video"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(id) + '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="' + esc(t.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' +
        '<div class="flex mt-16" style="flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between"><p class="body-2" style="flex:1;min-width:220px">' + esc(t.description) + '</p>' +
        '<a class="btn btn-gray btn-sm" href="https://youtu.be/' + esc(id) + '" target="_blank" rel="noopener">Open on YouTube</a></div>'
    });
  });

  /* ================= SPOTLIGHT SEARCH ================= */
  var PAGES = [
    { t: "Home", s: "Pulse Generation UG", u: "/", k: "home start company" },
    { t: "PulseHMIS", s: "Hospital management system", u: "/pulsehmis/", k: "hospital clinic hmis medical patient doctor lab pharmacy cashier reception injection", img: APPS.PulseHMIS.icon },
    { t: "PulseHMIS pricing", s: "20,000 UGX / month · free trial", u: "/pulsehmis/#pricing", k: "price subscription trial cost license" },
    { t: "PulseHMIS LAN sync", s: "Host and client, no internet", u: "/pulsehmis/#sync", k: "network wifi host client sync offline" },
    { t: "PulseHMIS interactive guide", s: "Getting started walkthrough", u: "/tutorial.html", k: "guide tutorial getting started" },
    { t: "EduPulse", s: "School administration system", u: "/edupulse/", k: "school college university students teachers fees report card attendance exams payroll education", img: APPS.EduPulse.icon },
    { t: "EduPulse report cards", s: "Automatic grading & report cards", u: "/edupulse/#academics", k: "marks grades report card exam results" },
    { t: "EduPulse fees & finance", s: "Fees, receipts, expenses, payroll", u: "/edupulse/#finance", k: "fees receipts payments salary payroll expenses money" },
    { t: "Lwasa Ludo", s: "3D board game in Luganda", u: "/lwasa-ludo/", k: "game ludo board dice play multiplayer luganda", img: APPS["Lwasa Ludo"].icon },
    { t: "Lwasa Ludo privacy policy", s: "What the game collects", u: "/lwasa-ludo/privacy-policy.html", k: "privacy data policy" },
    { t: "All downloads", s: "Android APK & Windows installers", u: "/#downloads", k: "download apk exe install windows android get" },
    { t: "Video tutorials", s: "Learn by watching", u: "/#tutorials", k: "video youtube tutorial watch learn" },
    { t: "About the founder", s: "Lwasa George", u: "/#about", k: "founder lwasa george about company team" },
    { t: "Help & FAQ", s: "Questions, answered", u: "/#faq", k: "help faq questions support" },
    { t: "Contact us", s: "WhatsApp, phone, email", u: "/#contact", k: "contact whatsapp phone email call message demo support" },
    { t: "WhatsApp", s: "+256 700 677 555", u: "https://wa.me/256700677555", k: "whatsapp chat message", ext: 1 },
    { t: "Privacy", s: "Website privacy notice", u: "/privacy/", k: "privacy data" },
    { t: "Terms", s: "Terms of use", u: "/terms/", k: "terms legal" }
  ];
  var spotOpen = false, spotEls = null, spotSel = 0, spotItems = [];
  function spotIndex() {
    var items = PAGES.map(function (p) { return { group: "Pages", t: p.t, s: p.s, u: p.u, k: p.k, img: p.img, ico: p.ext ? I.chat : I.page, c: "ico-gray", ext: p.ext }; });
    CONTENT.downloads.forEach(function (d) {
      items.push({ group: "Downloads", t: d.app + " for " + d.platform, s: (d.version ? "v" + d.version + " · " : "") + (d.size || "") + " · " + d.file, u: d.url, k: "download get install " + d.app + " " + d.platform + " apk exe", ico: /android/i.test(d.platform) ? I.android : I.windows, c: /android/i.test(d.platform) ? "ico-green" : "ico-blue", dl: d.app + "|" + d.platform });
    });
    CONTENT.tutorials.forEach(function (t) {
      items.push({ group: "Videos", t: t.title, s: t.product + " · video", video: t.id, k: "video watch tutorial " + t.product, ico: I.play, c: "ico-red" });
    });
    $$("details.disc summary").forEach(function (s) {
      var d = s.parentNode;
      if (!d.id) d.id = "q-" + Math.random().toString(36).slice(2, 8);
      var q = s.cloneNode(true); $$(".tag, .plus", q).forEach(function (x) { x.remove(); });
      items.push({ group: "Answers on this page", t: q.textContent.replace(/\s+/g, " ").trim(), s: "FAQ", u: "#" + d.id, k: (d.textContent || "").toLowerCase(), ico: I.help, c: "ico-orange", faq: 1 });
    });
    $$("main section[id] h2").forEach(function (h) {
      var sec = h.closest("section[id]");
      items.push({ group: "On this page", t: h.textContent.replace(/\s+/g, " ").trim(), s: "Jump to section", u: "#" + sec.id, k: sec.id, ico: I.hash, c: "ico-indigo" });
    });
    return items;
  }
  function spotScore(item, q) {
    if (!q) return item.group === "Pages" || item.group === "Downloads" ? 1 : 0;
    var hay = (item.t + " " + item.s + " " + (item.k || "")).toLowerCase();
    var words = q.toLowerCase().split(/\s+/).filter(Boolean), score = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (item.t.toLowerCase().indexOf(w) === 0) score += 6;
      else if (item.t.toLowerCase().indexOf(w) > -1) score += 4;
      else if (hay.indexOf(w) > -1) score += 1;
      else return 0;
    }
    return score;
  }
  function renderSpot() {
    var q = spotEls.input.value.trim();
    var all = spotIndex().map(function (it) { return { it: it, sc: spotScore(it, q) }; }).filter(function (x) { return x.sc > 0; });
    all.sort(function (a, b) { return b.sc - a.sc; });
    var groups = {}, order = [];
    all.slice(0, 40).forEach(function (x) { if (!groups[x.it.group]) { groups[x.it.group] = []; order.push(x.it.group); } if (groups[x.it.group].length < 8) groups[x.it.group].push(x.it); });
    spotItems = [];
    var html = order.map(function (g) {
      return '<div class="spot-group">' + esc(g) + "</div>" + groups[g].map(function (it) {
        var idx = spotItems.push(it) - 1;
        return '<button type="button" class="spot-item" data-i="' + idx + '"><span class="s-ico ' + (it.img ? "" : it.c) + '">' + (it.img ? '<img src="' + esc(it.img) + '" alt="">' : it.ico) + "</span><span><b>" + esc(it.t) + "</b><small>" + esc(it.s) + "</small></span></button>";
      }).join("");
    }).join("");
    spotEls.results.innerHTML = html || '<div class="spot-empty">No results for “' + esc(q) + '”.<br>Try “download”, “fees” or “WhatsApp”.</div>';
    spotSel = 0; markSel();
  }
  function markSel() {
    $$(".spot-item", spotEls.results).forEach(function (b, i) { b.classList.toggle("sel", i === spotSel); if (i === spotSel) b.scrollIntoView({ block: "nearest" }); });
  }
  function runSpot(it) {
    closeSpot();
    if (!it) return;
    if (it.video) { var fake = document.createElement("button"); fake.setAttribute("data-video", it.video); document.body.appendChild(fake); fake.click(); fake.remove(); return; }
    if (it.dl) { var d = CONTENT.downloads.filter(function (x) { return x.app + "|" + x.platform === it.dl; })[0]; if (d) { window.location.href = d.url; onDownloadClick(d); } return; }
    if (it.ext) { window.open(it.u, "_blank", "noopener"); return; }
    if (it.u.charAt(0) === "#") {
      var el = document.querySelector(it.u);
      if (el) { if (it.faq) el.open = true; el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); history.replaceState(null, "", it.u); }
      return;
    }
    window.location.href = it.u;
  }
  function openSpot() {
    if (spotOpen) return;
    spotOpen = true;
    lastFocus = document.activeElement;
    var bd = document.createElement("div"); bd.className = "spot-backdrop";
    var box = document.createElement("div"); box.className = "spotlight"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Search");
    box.innerHTML = '<div class="spot-input">' + I.search + '<input type="search" placeholder="Search apps, downloads, videos, help…" aria-label="Search the site" autocomplete="off" spellcheck="false"><kbd>esc</kbd></div><div class="spot-results" role="listbox"></div>';
    document.body.appendChild(bd); document.body.appendChild(box);
    spotEls = { bd: bd, box: box, input: $("input", box), results: $(".spot-results", box) };
    bd.addEventListener("click", closeSpot);
    spotEls.input.addEventListener("input", renderSpot);
    spotEls.input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); spotSel = Math.min(spotItems.length - 1, spotSel + 1); markSel(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); spotSel = Math.max(0, spotSel - 1); markSel(); }
      else if (e.key === "Enter") { e.preventDefault(); runSpot(spotItems[spotSel]); }
    });
    spotEls.results.addEventListener("click", function (e) { var b = e.target.closest(".spot-item"); if (b) runSpot(spotItems[+b.getAttribute("data-i")]); });
    spotEls.results.addEventListener("mousemove", function (e) { var b = e.target.closest(".spot-item"); if (b && +b.getAttribute("data-i") !== spotSel) { spotSel = +b.getAttribute("data-i"); markSel(); } });
    renderSpot();
    document.body.classList.add("lock");
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add("spot-open"); spotEls.input.focus(); }); });
  }
  function closeSpot() {
    if (!spotOpen) return;
    spotOpen = false;
    document.body.classList.remove("spot-open");
    var els = spotEls; spotEls = null;
    setTimeout(function () { els.bd.remove(); els.box.remove(); if (!sheetEl) document.body.classList.remove("lock"); }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$("[data-search-open]").forEach(function (b) { b.addEventListener("click", openSpot); });
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); spotOpen ? closeSpot() : openSpot(); }
    else if (e.key === "/" && !spotOpen && tag !== "input" && tag !== "textarea" && tag !== "select") { e.preventDefault(); openSpot(); }
  });
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || ua);
  $$("[data-kbd]").forEach(function (k) { k.textContent = isMac ? "⌘K" : "Ctrl K"; });

  /* ================= FAQ ================= */
  $$("[data-faq]").forEach(function (wrap) {
    var input = $("input", wrap.parentNode.querySelector(".faq-search") || wrap);
    var items = $$("details", wrap), empty = $(".faq-empty", wrap);
    var seg = wrap.parentNode.querySelector("[data-faq-filter]"), cat = "all";
    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "", shown = 0;
      items.forEach(function (d) {
        var ok = (cat === "all" || d.getAttribute("data-cat") === cat) && (!q || d.textContent.toLowerCase().indexOf(q) > -1);
        d.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    }
    if (input) input.addEventListener("input", apply);
    if (seg) segmented(seg, function (v) { cat = v; apply(); });
    // One open at a time feels calmer.
    items.forEach(function (d) {
      d.addEventListener("toggle", function () { if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; }); });
    });
  });
  if (location.hash && /^#q-/.test(location.hash)) { var qd = $(location.hash); if (qd) qd.open = true; }

  /* ================= COPY / SHARE ================= */
  document.addEventListener("click", function (e) {
    var c = e.target.closest && e.target.closest("[data-copy]");
    if (c) {
      e.preventDefault();
      var text = c.getAttribute("data-copy");
      var done = function () { toast("Copied " + text); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {}); else done();
      return;
    }
    var s = e.target.closest && e.target.closest("[data-share]");
    if (s) {
      e.preventDefault();
      var data = { title: document.title, url: location.href.split("#")[0] };
      if (navigator.share) navigator.share(data).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { toast("Link copied"); });
    }
  });

  /* ================= CONTACT FORM ================= */
  var SB_URL = "https://gmfrgbrdpfdalydnxwdb.supabase.co";
  var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZnJnYnJkcGZkYWx5ZG54d2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDYzODIsImV4cCI6MjEwNTMyMjM4Mn0.SRmeSVwGMLpr6l9OExNaPQ_i6FYg3nO_-o8TRD66_k4";
  function insertMessage(row) {
    return fetch(SB_URL + "/rest/v1/contact_messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, Prefer: "return=minimal" },
      body: JSON.stringify(row)
    }).then(function (r) {
      if (r.ok) return true;
      return r.text().then(function (t) { var err = new Error(t || ("HTTP " + r.status)); err.status = r.status; throw err; });
    });
  }
  $$("[data-contact-form]").forEach(function (form) {
    var status = $(".form-status", form);
    var kind = "message";
    var seg = $("[data-kind]", form);
    var demoOnly = $$("[data-demo-only]", form);
    function syncKind() { demoOnly.forEach(function (el) { el.style.display = kind === "demo" ? "" : "none"; }); }
    if (seg) segmented(seg, function (v) { kind = v; syncKind(); });
    syncKind();
    var pre = new URLSearchParams(location.search).get("product");
    if (pre && form.product) form.product.value = pre;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return; // bot trap
      var f = form;
      var name = f.name.value.trim(), email = f.email.value.trim(), message = f.message.value.trim();
      status.className = "form-status";
      if (!name || !email || !message) { status.textContent = "Please add your name, email and a message."; status.classList.add("err"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = "That email address doesn’t look right."; status.classList.add("err"); return; }
      var product = f.product ? f.product.value : "";
      var btn = $('button[type="submit"]', f);
      btn.disabled = true; btn.style.opacity = .6;
      status.textContent = "Sending…";
      var row = {
        name: name, email: email, message: message,
        subject: (f.subject && f.subject.value.trim()) || (kind === "demo" ? "Demo request" : null),
        phone: (f.phone && f.phone.value.trim()) || null,
        organization: (f.organization && f.organization.value.trim()) || null,
        country: (f.country && f.country.value.trim()) || null,
        product: product || null, kind: kind, consent: true,
        details: kind === "demo" ? { preferred_contact: f.preferred_contact ? f.preferred_contact.value : null, deployment_size: f.deployment_size ? f.deployment_size.value : null } : {}
      };
      insertMessage(row).catch(function (err) {
        if (/too many/i.test(err.message)) throw err;
        // Older table versions only accept the original product names; keep the app in the subject instead.
        var retry = Object.assign({}, row);
        delete retry.product;
        retry.subject = "[" + (product || "General") + "] " + (row.subject || "Message");
        return insertMessage(retry);
      }).then(function () {
        status.textContent = "Thank you, " + name.split(" ")[0] + ". Your message is in. We’ll reply soon.";
        status.classList.add("ok");
        toast(kind === "demo" ? "Demo request sent" : "Message sent");
        f.reset(); if (pre && f.product) f.product.value = pre;
      }).catch(function (err) {
        var wa = "https://wa.me/256700677555?text=" + encodeURIComponent("Hello Pulse Generation, I'm " + name + " (" + email + ").\n" + (product ? "About: " + product + "\n" : "") + message);
        status.innerHTML = (/too many/i.test(err.message) ? "You’ve sent several messages in a short time. " : "We couldn’t send that just now. ") +
          'Please <a href="' + wa + '" target="_blank" rel="noopener">send it on WhatsApp</a> or <a href="mailto:pulsegenerationug@gmail.com?subject=' + encodeURIComponent(product || "Website message") + "&body=" + encodeURIComponent(message) + '">email us</a>.';
        status.classList.add("err");
      }).then(function () { btn.disabled = false; btn.style.opacity = ""; });
    });
  });

  /* ================= PULSEHMIS: patient journey ================= */
  $$("[data-journey]").forEach(function (box) {
    var STAGES = [
      { n: "Reception", t: "Register once. Route instantly.", d: "New or returning patients are registered in one form: name, age, gender, phone, allergies and payment method. Cash, Insurance or Credit is locked in here and carried to every department automatically.", tags: ["Patient search", "Insurance companies", "Allergy capture", "Visit routing"], rows: [["Patient", "Nakato Sarah · 34 F"], ["Payment", "Insurance (company)"], ["Allergies", "Penicillin"], ["Next", "Doctor’s office →"]] },
      { n: "Doctor", t: "Vitals, diagnosis, prescriptions.", d: "Capture vitals with automatic BMI, record complaints and diagnoses, order lab tests and prescribe. PulseHMIS calculates the billable quantity from strength, frequency and duration, and shows the maths.", tags: ["Auto BMI", "Allergy banner", "Lab orders", "THEN CONTINUE WITH…"], rows: [["Temp / Pulse", "37.8 °C · 88 bpm"], ["BMI", "23.5 · healthy"], ["Diagnosis", "Malaria (suspected)"], ["Lab", "Malaria RDT, FBC"]] },
      { n: "Laboratory", t: "Results in the right format.", d: "Text, numeric with reference ranges, paragraphs or full parameter tables with age- and gender-specific ranges. Abnormal values are flagged, and technicians can add a follow-up test on the spot.", tags: ["Reference ranges", "Abnormal flags", "Add test", "Lab counter payments"], rows: [["Malaria RDT", "Positive ⚑"], ["Haemoglobin", "11.2 g/dL"], ["WBC", "7.4 ×10⁹/L"], ["Status", "Back to doctor →"]] },
      { n: "Cashier", t: "Every shilling accounted for.", d: "Consultation, lab and pharmacy totals in one bill, with discounts, partial payments and a full payment history. Lab fees already paid at the counter are deducted, so nobody is charged twice.", tags: ["Installments", "Credit on file", "Over-payment check", "Branded receipts"], rows: [["Consultation", "UGX 20,000"], ["Laboratory", "UGX 15,000"], ["Pharmacy", "UGX 25,000"], ["Paid · Balance", "UGX 60,000 · 0"]] },
      { n: "Pharmacy", t: "Dispense exactly what was prescribed.", d: "The full prescription in chained order, with per-medicine dispensed toggles for partial dispensing and compact labels for a thermal printer. The bill status is visible at a glance.", tags: ["Per-item dispensing", "Prescription labels", "Balance visibility", "Send back to cashier"], rows: [["Artemether-Lumefantrine", "Dispensed ✓"], ["Paracetamol 500 mg", "Dispensed ✓"], ["Label", "Printed"], ["Bill", "Settled"]] },
      { n: "Injection", t: "Every dose, every shift.", d: "A medication administration record for each injectable course: doses planned, given and remaining. Each dose is logged with a time of day, and a 10 Rights safety checklist runs every session.", tags: ["Dose tracking", "Morning/Evening labels", "10 Rights checklist", "Shift handover"], rows: [["Artesunate IV", "Dose 2 of 3"], ["Last given", "Morning · 08:14"], ["Next", "Evening"], ["Checklist", "10/10 ✓"]] }
    ];
    var btns = $$(".journey button", box), panel = $("[data-jpanel]", box), bar = $(".j-progress i", box);
    var prev = $("[data-jprev]", box), next = $("[data-jnext]", box), auto = $("[data-jauto]", box);
    var idx = 0, timer = null;
    function show(i) {
      idx = (i + STAGES.length) % STAGES.length;
      var s = STAGES[idx];
      btns.forEach(function (b, k) { b.classList.toggle("active", k === idx); b.classList.toggle("done", k < idx); b.setAttribute("aria-selected", k === idx); });
      bar.style.width = ((idx + 1) / STAGES.length * 100) + "%";
      panel.innerHTML = '<div class="j-panel"><div><span class="pill teal">Station ' + (idx + 1) + " of 6 · " + s.n + "</span><h3 class=\"mt-16\">" + s.t + "</h3><p>" + s.d + '</p><div class="tags">' + s.tags.map(function (t) { return '<span class="pill">' + t + "</span>"; }).join("") + "</div></div>" +
        '<div class="j-screen">' + s.rows.map(function (r) { return '<div class="line"><span>' + r[0] + "</span><b>" + r[1] + "</b></div>"; }).join("") + "</div></div>";
    }
    function play() { stop(); timer = setInterval(function () { show(idx + 1); }, 4200); if (auto) auto.checked = true; }
    function stop() { clearInterval(timer); timer = null; }
    btns.forEach(function (b, k) { b.addEventListener("click", function () { stop(); if (auto) auto.checked = false; show(k); }); });
    if (prev) prev.addEventListener("click", function () { stop(); if (auto) auto.checked = false; show(idx - 1); });
    if (next) next.addEventListener("click", function () { stop(); if (auto) auto.checked = false; show(idx + 1); });
    if (auto) auto.addEventListener("change", function () { auto.checked ? play() : stop(); });
    show(0);
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting && auto && auto.checked && !timer) play(); else if (!e.isIntersecting) stop(); }); }, { threshold: .3 }).observe(box);
    }
  });

  /* ================= PULSEHMIS: BMI ================= */
  $$("[data-bmi]").forEach(function (box) {
    var w = $("[name=w]", box), h = $("[name=h]", box), out = $("[data-bmi-out]", box), lab = $("[data-bmi-label]", box), wl = $("[data-w]", box), hl = $("[data-h]", box);
    function calc() {
      var bmi = +w.value / Math.pow(+h.value / 100, 2);
      out.textContent = bmi.toFixed(1); wl.textContent = w.value; hl.textContent = h.value;
      var c = bmi < 18.5 ? ["Underweight", "orange"] : bmi < 25 ? ["Healthy range", "green"] : bmi < 30 ? ["Overweight", "orange"] : ["Obese range", "red"];
      lab.textContent = c[0]; lab.className = "pill " + c[1];
    }
    w.addEventListener("input", calc); h.addEventListener("input", calc); calc();
  });

  /* ================= EDUPULSE: report card ================= */
  $$("[data-reportcard]").forEach(function (box) {
    var scale = [[80, "A", "Excellent"], [70, "B", "Very good"], [60, "C", "Good"], [50, "D", "Satisfactory"], [40, "E", "Fair"], [0, "F", "Needs improvement"]];
    function grade(t) { for (var i = 0; i < scale.length; i++) if (t >= scale[i][0]) return scale[i]; return scale[scale.length - 1]; }
    function calc() {
      var totals = [];
      $$("tbody tr", box).forEach(function (tr) {
        var ins = $$("input", tr);
        ins.forEach(function (inp) { var max = +inp.max; if (+inp.value > max) inp.value = max; if (+inp.value < 0) inp.value = 0; });
        var total = (+ins[0].value || 0) + (+ins[1].value || 0);
        var g = grade(total);
        $("[data-total]", tr).textContent = total;
        var ge = $("[data-grade]", tr); ge.textContent = g[1]; ge.className = "grade g-" + g[1];
        $("[data-remark]", tr).textContent = g[2];
        totals.push(total);
      });
      var sum = totals.reduce(function (a, b) { return a + b; }, 0), avg = sum / totals.length;
      $("[data-rc-total]", box).textContent = sum + " / " + totals.length * 100;
      $("[data-rc-avg]", box).textContent = avg.toFixed(1) + "%";
      var g = grade(avg);
      var ge = $("[data-rc-grade]", box); ge.textContent = g[1]; ge.className = "grade g-" + g[1];
      $("[data-rc-comment]", box).textContent = g[2];
    }
    box.addEventListener("input", calc); calc();
  });

  /* ================= EDUPULSE: attendance ================= */
  $$("[data-attendance]").forEach(function (box) {
    var order = ["PRESENT", "ABSENT", "LATE", "EXCUSED", "SICK"];
    var list = $(".attn", box), ring = $(".ring", box), pct = $("[data-attn-pct]", box), sumEl = $("[data-attn-sum]", box);
    function update() {
      var sts = $$(".st", list).map(function (s) { return s.textContent; });
      var present = sts.filter(function (s) { return s === "PRESENT" || s === "LATE"; }).length;
      var p = Math.round(present / sts.length * 100);
      ring.style.setProperty("--p", p);
      ring.style.setProperty("--ring-c", p >= 80 ? "var(--green)" : p >= 60 ? "var(--orange)" : "var(--red)");
      pct.textContent = p + "%";
      var counts = {}; sts.forEach(function (s) { counts[s] = (counts[s] || 0) + 1; });
      sumEl.innerHTML = order.filter(function (o) { return counts[o]; }).map(function (o) { return '<span class="pill st-' + o + '">' + counts[o] + " " + o.toLowerCase() + "</span>"; }).join("");
    }
    list.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var st = $(".st", b), i = (order.indexOf(st.textContent) + 1) % order.length;
      st.textContent = order[i]; st.className = "st st-" + order[i];
      update();
    });
    var all = $("[data-attn-all]", box);
    if (all) all.addEventListener("click", function () { $$(".st", list).forEach(function (s) { s.textContent = "PRESENT"; s.className = "st st-PRESENT"; }); update(); toast("All marked present"); });
    var save = $("[data-attn-save]", box);
    if (save) save.addEventListener("click", function () { toast("Attendance saved, offline"); });
    update();
  });

  /* ================= EDUPULSE: fee account ================= */
  $$("[data-fees]").forEach(function (box) {
    var slider = $("input[type=range]", box), total = +box.getAttribute("data-total");
    var paidEl = $("[data-paid]", box), balEl = $("[data-bal]", box), ring = $(".ring", box), pct = $("[data-fee-pct]", box), rec = $("[data-rec]", box);
    function fmt(n) { return n.toLocaleString("en-UG"); }
    function upd() {
      var paid = +slider.value, p = Math.round(paid / total * 100);
      paidEl.textContent = fmt(paid); balEl.textContent = fmt(total - paid);
      ring.style.setProperty("--p", p); ring.style.setProperty("--ring-c", p >= 100 ? "var(--green)" : "var(--edu)");
      pct.textContent = p + "%";
      rec.textContent = "REC-2026-" + String(1 + Math.round(paid / 50000)).padStart(6, "0");
    }
    slider.addEventListener("input", upd); upd();
  });

  /* ================= EDUPULSE: letterhead ================= */
  $$("[data-letterhead-ctl]").forEach(function (seg) {
    var lh = document.getElementById(seg.getAttribute("data-letterhead-ctl"));
    segmented(seg, function (v) { lh.setAttribute("data-layout", v); });
  });

  /* ================= LUDO: dice ================= */
  $$("[data-dice]").forEach(function (box) {
    var dice = $(".dice", box), word = $(".callout-word", box), btn = $("button", box), hist = $("[data-dice-hist]", box);
    // Rotation that brings each face to the front.
    var faces = { 1: [0, 0], 2: [0, -90], 3: [-90, 0], 4: [90, 0], 5: [0, 90], 6: [0, 180] };
    var words = { 1: "Emu!", 2: "Bbiri!", 3: "Ssatu!", 4: "Nnya!", 5: "Ttaano!", 6: "Mukaga!" };
    var spins = 0, rolling = false, sixes = 0;
    btn.addEventListener("click", function () {
      if (rolling) return;
      rolling = true; btn.disabled = true;
      var n = 1 + Math.floor(Math.random() * 6);
      spins += 2;
      var f = faces[n];
      dice.style.transform = "rotateX(" + (f[0] - 360 * spins) + "deg) rotateY(" + (f[1] + 360 * spins) + "deg)";
      word.classList.remove("pop"); word.textContent = "";
      setTimeout(function () {
        word.textContent = words[n];
        word.style.color = n === 6 ? "var(--yellow)" : "";
        void word.offsetWidth; word.classList.add("pop");
        sixes = n === 6 ? sixes + 1 : 0;
        if (hist) {
          var chip = document.createElement("span");
          chip.className = "pill" + (n === 6 ? " orange" : "");
          chip.textContent = n;
          hist.insertBefore(chip, hist.firstChild);
          while (hist.children.length > 8) hist.removeChild(hist.lastChild);
        }
        if (n === 6) toast(sixes > 1 ? "Another six! Roll again." : "Mukaga! A six lets a token out. Roll again.", "info");
        rolling = false; btn.disabled = false;
      }, reduceMotion ? 50 : 1300);
    });
  });

  /* ================= LUDO: quick chat ================= */
  $$("[data-quickchat]").forEach(function (box) {
    var area = $(".bubbles", box);
    var replies = ["Good luck!", "Nice move!", "Almost!", "Well played!", "😂", "👏", "Oops!"];
    function add(text, me) {
      var b = document.createElement("div"); b.className = "bubble" + (me ? " me" : ""); b.textContent = text;
      area.appendChild(b);
      while (area.children.length > 5) area.removeChild(area.firstChild);
    }
    $$(".quickchat button", box).forEach(function (btn) {
      btn.addEventListener("click", function () {
        add(btn.textContent, true);
        setTimeout(function () { add(replies[Math.floor(Math.random() * replies.length)], false); }, 700);
      });
    });
  });

  /* ================= MISC ================= */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  if (PLATFORM === "ios" || PLATFORM === "mac") {
    $$("[data-apple-note]").forEach(function (el) { el.hidden = false; });
  }
  window.PG = { openSheet: openSheet, toast: toast, openSearch: openSpot };
})();
