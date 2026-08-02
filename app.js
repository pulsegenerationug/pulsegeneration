(function () {
  "use strict";

  /* ================= CONFIG ================= */
  var SUPABASE_URL = "https://vjbjaxjthxvqaiyolzyz.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYmpheGp0aHh2cWFpeW9senl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2ODY5MTgsImV4cCI6MjEwMTI2MjkxOH0.J94rM7qXsSVzv4n1ENMz3VufYScKRujpSdk3mdn0giE";

  /* Generic form submission -> Supabase REST (PostgREST) table insert.
     Tables expected: contact_messages, demo_requests, interest_registrations.
     If the table doesn't exist yet, this fails gracefully and still shows a
     clear message to the user rather than a false success state. */
  function submitToSupabase(table, payload) {
    return fetch(SUPABASE_URL + "/rest/v1/" + table, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + SUPABASE_ANON_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("Request failed: " + res.status);
      return true;
    });
  }

  /* ================= TOASTS ================= */
  var toastRegion = document.getElementById("toastRegion");
  function toast(message) {
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
    el.querySelector("span").textContent = message;
    toastRegion.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 350);
    }, 3200);
  }

  /* ================= THEME ================= */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("pg_theme"); } catch (e) {}
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("pg_theme", next); } catch (e) {}
  });

  /* Keyboard shortcut hint (Mac vs Windows) */
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var kbdHint = document.getElementById("kbdHint");
  if (kbdHint) kbdHint.textContent = isMac ? "⌘K" : "Ctrl K";

  /* ================= NAVBAR SCROLL ================= */
  var navbar = document.getElementById("navbar");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var bottomNavLinks = Array.prototype.slice.call(document.querySelectorAll(".bottom-nav a"));

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
    var scrollPos = window.scrollY + 140;
    var current = sections.length ? sections[0].id : null;
    sections.forEach(function (s) {
      if (scrollPos >= s.offsetTop) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.dataset.section === current);
    });
    bottomNavLinks.forEach(function (a) {
      a.classList.toggle("active", a.dataset.bn === current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ================= MOBILE MENU ================= */
  var hamburgerBtn = document.getElementById("hamburgerBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }
  hamburgerBtn.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("open");
    hamburgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobileMenu);
  });

  /* ================= REVEAL ON SCROLL ================= */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ================= HERO PARALLAX + PULSE ================= */
  var heroBg = document.getElementById("heroBg");
  var hero = document.querySelector(".hero");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hero && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      heroBg.style.setProperty("--mx", x + "%");
      heroBg.style.setProperty("--my", y + "%");
    });
  }
  var pulsePath = document.getElementById("pulsePath");
  if (pulsePath && !reduceMotion) pulsePath.classList.add("animate");

  /* ================= PRODUCT CARD TILT + SPOTLIGHT ================= */
  var productCards = Array.prototype.slice.call(document.querySelectorAll(".product-card"));
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    productCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotX = ((y / rect.height) - 0.5) * -4;
        var rotY = ((x / rect.width) - 0.5) * 4;
        card.style.transform = "perspective(800px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) translateY(-2px)";
        card.style.setProperty("--px", x + "px");
        card.style.setProperty("--py", y + "px");
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ================= MODALS ================= */
  var lastFocusedEl = null;
  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    var focusable = modal.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    modal.__trap = function (e) {
      if (e.key === "Escape") { closeModal(modal); return; }
      if (e.key !== "Tab" || !focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", modal.__trap);
  }
  function closeModal(modal) {
    if (typeof modal === "string") modal = document.getElementById(modal);
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (modal.__trap) document.removeEventListener("keydown", modal.__trap);
    // stop video iframe on close
    if (modal.id === "modal-video") {
      var wrap = document.getElementById("videoFrameWrap");
      wrap.innerHTML = "";
    }
    if (lastFocusedEl) lastFocusedEl.focus();
  }
  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openModal(btn.dataset.openModal);
    });
  });
  document.querySelectorAll(".product-card[data-modal]").forEach(function (card) {
    card.addEventListener("click", function () { openModal(card.dataset.modal); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card.dataset.modal); }
    });
  });
  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeModal(btn.closest(".modal-overlay"));
    });
  });
  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  /* ================= COMMAND PALETTE ================= */
  var cmdkOverlay = document.getElementById("cmdkOverlay");
  var cmdkInput = document.getElementById("cmdkInput");
  var cmdkList = document.getElementById("cmdkList");
  var cmdkTrigger = document.getElementById("cmdkTrigger");

  var COMMANDS = [
    { label: "Products", hint: "See PulseHMIS & FixIt Enterprise", action: function () { go("#products"); } },
    { label: "PulseHMIS", hint: "Hospital management system", action: function () { go("#pulsehmis"); } },
    { label: "FixIt Enterprise", hint: "Financial auditing platform", action: function () { go("#fixit"); } },
    { label: "Downloads", hint: "Get the apps", action: function () { go("#downloads"); } },
    { label: "Tutorials", hint: "Watch demo videos", action: function () { go("#tutorials"); } },
    { label: "Support", hint: "FAQ and help", action: function () { go("#support"); } },
    { label: "Contact", hint: "Get in touch", action: function () { go("#contact"); } },
    { label: "Register interest", hint: "Join the list", action: function () { go("#contact"); openModal("modal-register"); } },
    { label: "Request a demo", hint: "Talk to the team", action: function () { go("#contact"); openModal("modal-demo"); } },
    { label: "About", hint: "Founder & company", action: function () { go("#about"); } }
  ];
  function go(hash) {
    closeCmdk();
    var target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  var cmdkActiveIndex = 0;
  function renderCmdk(filter) {
    filter = (filter || "").toLowerCase();
    var results = COMMANDS.filter(function (c) {
      return c.label.toLowerCase().indexOf(filter) !== -1 || c.hint.toLowerCase().indexOf(filter) !== -1;
    });
    cmdkList.innerHTML = "";
    if (!results.length) {
      cmdkList.innerHTML = '<div class="cmdk-empty">No results found.</div>';
      return;
    }
    cmdkActiveIndex = 0;
    results.forEach(function (c, i) {
      var item = document.createElement("div");
      item.className = "cmdk-item" + (i === 0 ? " active" : "");
      item.setAttribute("role", "option");
      item.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg><span>' + c.label + " — " + c.hint + "</span>";
      item.addEventListener("click", c.action);
      item.__cmd = c;
      cmdkList.appendChild(item);
    });
  }
  function openCmdk() {
    cmdkOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    cmdkInput.value = "";
    renderCmdk("");
    setTimeout(function () { cmdkInput.focus(); }, 50);
  }
  function closeCmdk() {
    cmdkOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  cmdkTrigger.addEventListener("click", openCmdk);
  cmdkOverlay.addEventListener("click", function (e) { if (e.target === cmdkOverlay) closeCmdk(); });
  cmdkInput.addEventListener("input", function () { renderCmdk(cmdkInput.value); });
  document.addEventListener("keydown", function (e) {
    var mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      cmdkOverlay.classList.contains("open") ? closeCmdk() : openCmdk();
    }
    if (e.key === "Escape" && cmdkOverlay.classList.contains("open")) closeCmdk();
    if (cmdkOverlay.classList.contains("open") && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      var items = Array.prototype.slice.call(cmdkList.querySelectorAll(".cmdk-item"));
      if (!items.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); cmdkActiveIndex = Math.min(cmdkActiveIndex + 1, items.length - 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); cmdkActiveIndex = Math.max(cmdkActiveIndex - 1, 0); }
      if (e.key === "Enter") { items[cmdkActiveIndex].__cmd.action(); return; }
      items.forEach(function (it, i) { it.classList.toggle("active", i === cmdkActiveIndex); });
      items[cmdkActiveIndex].scrollIntoView({ block: "nearest" });
    }
  });

  /* ================= PULSEHMIS WORKFLOW ================= */
  var WORKFLOW = {
    reception: {
      title: "Reception",
      desc: "Front-desk staff register new patients, detect duplicates, and create visits before routing patients onward.",
      features: ["Patient registration", "Duplicate patient detection", "Visit creation"],
      mock: [["Patient", "Akello J."], ["Visit type", "New visit"], ["Duplicate check", "No match found"], ["Routed to", "Doctor's Office"]]
    },
    doctor: {
      title: "Doctor's Office",
      desc: "Clinicians capture structured vitals, review automatic BMI, and record diagnoses and prescriptions.",
      features: ["Structured vitals", "Automatic BMI calculation", "Diagnoses & prescriptions"],
      mock: [["Weight / Height", "62kg / 1.68m"], ["BMI", "22.0 (auto)"], ["Diagnosis", "Malaria (suspected)"], ["Action", "Order lab test"]]
    },
    lab: {
      title: "Laboratory",
      desc: "Lab staff receive structured test orders and record results directly against the patient's visit.",
      features: ["Laboratory ordering", "Structured lab results", "Linked to visit record"],
      mock: [["Test ordered", "Malaria RDT"], ["Status", "Result recorded"], ["Result", "Positive"], ["Routed to", "Doctor's Office"]]
    },
    cashier: {
      title: "Cashier",
      desc: "Billing is entered manually per department — reflecting how pediatric and vial-based dosing make automatic pricing unreliable.",
      features: ["Manual billing", "Cash / insurance / credit", "Installment support"],
      mock: [["Consultation", "10,000 UGX"], ["Lab test", "5,000 UGX"], ["Payment method", "Cash"], ["Balance", "0 UGX"]]
    },
    pharmacy: {
      title: "Pharmacy",
      desc: "Pharmacy staff dispense prescribed medication, tracking stock and dosage against the prescription.",
      features: ["Prescription dispensing", "Stock-aware dispensing", "Dose tracking"],
      mock: [["Medicine", "Artesunate"], ["Dose", "60mg (vial split)"], ["Dispensed by", "Pharmacy"], ["Status", "Dispensed"]]
    },
    injection: {
      title: "Injection Room",
      desc: "Shift-based dose administration is tracked from the actual prescribing time, avoiding clock-skew issues across networked computers.",
      features: ["Shift-based dose tracking", "DoseEvent logging", "Local network sync"],
      mock: [["Medication", "IV Artesunate"], ["Shift", "Rotated from Rx time"], ["Dose 1", "Administered"], ["Dose 2", "Due next shift"]]
    }
  };
  var workflowTabs = document.getElementById("workflowTabs");
  var workflowPanel = document.getElementById("workflowPanel");
  function renderWorkflow(key) {
    var w = WORKFLOW[key];
    var featuresHtml = w.features.map(function (f) {
      return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>' + f + "</li>";
    }).join("");
    var rowsHtml = w.mock.map(function (r) {
      return '<div class="mock-row"><span>' + r[0] + "</span><b>" + r[1] + "</b></div>";
    }).join("");
    workflowPanel.innerHTML =
      '<div class="workflow-info">' +
        "<h3>" + w.title + "</h3>" +
        "<p>" + w.desc + "</p>" +
        '<ul class="feature-list">' + featuresHtml + "</ul>" +
      "</div>" +
      '<div class="mock-window">' +
        '<div class="mock-titlebar"><span></span><span></span><span></span><span class="mock-label">PulseHMIS — ' + w.title + '</span></div>' +
        '<div class="mock-body">' + rowsHtml + '</div>' +
      "</div>" +
      '<p class="demo-flag" style="grid-column:1/-1;">Demonstration interface using fictional data.</p>';
  }
  renderWorkflow("reception");
  workflowTabs.querySelectorAll(".workflow-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      workflowTabs.querySelectorAll(".workflow-tab").forEach(function (t) {
        t.classList.remove("active"); t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active"); tab.setAttribute("aria-selected", "true");
      renderWorkflow(tab.dataset.stage);
    });
  });

  /* ================= FIXIT DASHBOARD ANIMATION ================= */
  var dashboardGrid = document.getElementById("dashboardGrid");
  var chartBars = document.getElementById("chartBars");
  var dashboardAnimated = false;
  function animateDashboard() {
    if (dashboardAnimated) return;
    dashboardAnimated = true;
    dashboardGrid.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var prefix = el.dataset.prefix || "";
      var start = 0;
      var duration = 1100;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = Math.floor(start + (target - start) * eased);
        el.textContent = prefix + val.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    chartBars.querySelectorAll(".bar").forEach(function (bar) {
      requestAnimationFrame(function () { bar.style.height = bar.dataset.h + "%"; });
    });
  }
  var dashboardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) animateDashboard(); });
  }, { threshold: 0.3 });
  dashboardObserver.observe(document.getElementById("fixit"));

  /* ================= TUTORIALS ================= */
  var TUTORIALS = [
    { id: "bxSTnOdNZz8", title: "PulseHMIS Demo", product: "PulseHMIS" },
    { id: "dMrJpAykf70", title: "FixIt Enterprise Demo", product: "FixIt Enterprise" },
    { id: "uppHKfx9Vok", title: "PulseHMIS Workflow", product: "PulseHMIS" },
    { id: "SQKLZs2AqjE", title: "PulseHMIS Short", product: "PulseHMIS" },
    { id: "M2JtWKP7gDU", title: "FixIt Enterprise Short", product: "FixIt Enterprise" },
    { id: "N5Jh59oMvws", title: "Pulse Generation UG", product: "Pulse Generation UG" }
  ];
  var tutorialsGrid = document.getElementById("tutorialsGrid");
  TUTORIALS.forEach(function (t, i) {
    var card = document.createElement("div");
    card.className = "tutorial-card";
    card.style.setProperty("--i", i);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML =
      '<div class="tutorial-thumb">' +
        '<img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/' + t.id + '/hqdefault.jpg" alt="' + t.title + ' thumbnail">' +
        '<div class="play-btn"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div>' +
      "</div>" +
      '<div class="tutorial-info"><div class="tutorial-tag">' + t.product + '</div><div class="tutorial-title">' + t.title + "</div></div>";
    function openVideo() {
      document.getElementById("videoTitle").textContent = t.title;
      document.getElementById("videoProduct").textContent = t.product;
      document.getElementById("videoFrameWrap").innerHTML =
        '<iframe src="https://www.youtube.com/embed/' + t.id + '?autoplay=1&rel=0" title="' + t.title + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      openModal("modal-video");
    }
    card.addEventListener("click", openVideo);
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openVideo(); } });
    tutorialsGrid.appendChild(card);
  });

  /* ================= SOCIAL CARDS ================= */
  var SOCIALS = [
    { name: "WhatsApp", desc: "Message the team directly.", url: "https://wa.me/256700677555" },
    { name: "Telegram", desc: "@pulsegeneration_ug", url: "https://t.me/pulsegeneration_ug" },
    { name: "YouTube", desc: "Demos & tutorials.", url: "https://www.youtube.com/@pulsegeneration_ug" },
    { name: "Instagram", desc: "Behind the scenes.", url: "https://www.instagram.com/pulsegeneration_ug" },
    { name: "TikTok", desc: "Quick product looks.", url: "https://tiktok.com/@pulsegeneration_ug" },
    { name: "X", desc: "Updates & announcements.", url: "https://x.com/lwasapulse_ug" },
    { name: "Facebook", desc: "Follow the page.", url: "https://www.facebook.com/share/18yDouKsLP/" }
  ];
  var socialScroll = document.getElementById("socialScroll");
  SOCIALS.forEach(function (s) {
    var a = document.createElement("a");
    a.className = "social-card";
    a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.innerHTML =
      '<div class="social-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg></div>' +
      "<h5>" + s.name + "</h5><p>" + s.desc + "</p>" +
      '<span class="btn btn-ghost btn-sm">Follow</span>';
    socialScroll.appendChild(a);
  });

  /* ================= FAQ ================= */
  var FAQS = [
    { cat: "getting-started", q: "Is PulseHMIS offline?", a: "Yes. PulseHMIS is built offline-first and runs over a local network, so it doesn't require internet access to operate day-to-day." },
    { cat: "getting-started", q: "Which devices does PulseHMIS support?", a: "PulseHMIS currently supports Windows (primary) and Android (secondary)." },
    { cat: "pulsehmis", q: "Can PulseHMIS work over a local network?", a: "Yes. PulseHMIS uses a host/client architecture over a local network so multiple stations in a facility can stay in sync without internet." },
    { cat: "downloads", q: "How do I install the Android APK?", a: "Download the APK, open it, allow installation from unknown sources if prompted, then install and launch the app." },
    { cat: "downloads", q: "How do I install PulseHMIS on Windows?", a: "Download the installer, run it, follow the setup steps, then launch PulseHMIS from the Start menu." },
    { cat: "fixit", q: "What is FixIt Enterprise?", a: "FixIt Enterprise is a financial auditing and expense management app supporting real-time balances, reporting, and 150+ ISO currencies." },
    { cat: "downloads", q: "How do I download the applications?", a: "Visit the Downloads section above and choose the platform card for PulseHMIS or FixIt Enterprise." },
    { cat: "getting-started", q: "How do I request a demo?", a: "Use the \"Request a Demo\" button in the Contact section, or message us directly on WhatsApp or email." },
    { cat: "account", q: "How do I contact Pulse Generation UG?", a: "WhatsApp, Telegram, or email — all listed in the Contact section, with a contact form as an alternative." },
    { cat: "account", q: "Can I request a feature?", a: "Yes — use the contact form and select \"Feedback\" or \"Other\" as your reason for contact." }
  ];
  var faqList = document.getElementById("faqList");
  function renderFaq(cat) {
    faqList.innerHTML = "";
    FAQS.filter(function (f) { return cat === "all" || f.cat === cat; }).forEach(function (f) {
      var item = document.createElement("div");
      item.className = "faq-item";
      item.innerHTML =
        '<button class="faq-q">' + f.q + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>' +
        '<div class="faq-a"><p>' + f.a + "</p></div>";
      faqList.appendChild(item);
    });
    bindFaqToggles();
  }
  function bindFaqToggles() {
    document.querySelectorAll(".faq-q").forEach(function (btn) {
      btn.onclick = function () {
        var item = btn.closest(".faq-item");
        var answer = item.querySelector(".faq-a");
        var isOpen = item.classList.contains("open");
        // close siblings within the same list
        item.parentElement.querySelectorAll(".faq-item.open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("open");
            openItem.querySelector(".faq-a").style.maxHeight = null;
          }
        });
        item.classList.toggle("open", !isOpen);
        answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
      };
    });
  }
  renderFaq("all");
  document.getElementById("faqCats").querySelectorAll(".faq-cat").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#faqCats .faq-cat").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      renderFaq(btn.dataset.cat);
    });
  });
  bindFaqToggles(); // for install-guide accordions already in DOM

  /* ================= COPY TO CLIPBOARD ================= */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.dataset.copy;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () { toast("Copied."); });
      } else {
        toast("Copied.");
      }
    });
  });
  document.querySelectorAll("[data-toast]").forEach(function (el) {
    el.addEventListener("click", function () { toast(el.dataset.toast); });
  });

  /* ================= DOWNLOAD EXPERIENCE ================= */
  document.querySelectorAll(".download-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var url = btn.dataset.url;
      var filename = btn.dataset.filename;
      var label = btn.querySelector(".btn-label");
      var progress = btn.querySelector(".progress");
      var originalLabel = label.textContent;
      btn.disabled = true;
      label.textContent = "Preparing download…";
      progress.style.width = "0%";
      requestAnimationFrame(function () { progress.style.width = "100%"; });
      setTimeout(function () {
        var a = document.createElement("a");
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        toast("Download started.");
        label.textContent = originalLabel;
        btn.disabled = false;
        progress.style.width = "0%";
      }, 1100);
    });
  });

  /* Platform detection */
  (function detectPlatform() {
    var ua = navigator.userAgent;
    var suggestion = document.getElementById("platformSuggestion");
    var text = document.getElementById("platformSuggestionText");
    var msg = null;
    if (/Android/i.test(ua)) msg = "You're on Android — grab <strong>PulseHMIS</strong> or <strong>FixIt Enterprise</strong> as an APK below.";
    else if (/Windows/i.test(ua)) msg = "You're on Windows — the <strong>PulseHMIS installer</strong> below is built for your platform.";
    else if (/Mac/i.test(ua)) msg = "PulseHMIS and FixIt Enterprise currently support Android and Windows. macOS support isn't available yet.";
    else if (/iPhone|iPad/i.test(ua)) msg = "PulseHMIS and FixIt Enterprise currently support Android and Windows. iOS isn't available yet.";
    if (msg) { text.innerHTML = msg; suggestion.hidden = false; }
  })();

  /* ================= CONTACT / DEMO / REGISTER FORMS ================= */
  function validateForm(form) {
    var valid = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var field = input.closest(".field");
      var ok = input.type === "checkbox" ? input.checked : input.value.trim().length > 0;
      if (input.type === "email" && ok) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      }
      if (field) field.classList.toggle("error", !ok);
      if (!ok) valid = false;
    });
    return valid;
  }

  function wireForm(formId, statusId, table, mapFn) {
    var form = document.getElementById(formId);
    var status = document.getElementById(statusId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm(form)) {
        status.className = "form-status show error";
        status.textContent = "Please fill in the required fields.";
        return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending…';
      status.className = "form-status show";
      status.textContent = "";

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      var payload = mapFn ? mapFn(data) : data;
      payload.submitted_at = new Date().toISOString();

      submitToSupabase(table, payload).then(function () {
        status.className = "form-status show success";
        status.innerHTML = "✓ Request received. Pulse Generation UG will be in touch.";
        toast("Message sent successfully.");
        form.reset();
      }).catch(function () {
        status.className = "form-status show error";
        status.innerHTML = "Something went wrong. Please try again or contact us directly via WhatsApp or email.";
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  }
  wireForm("contactForm", "contactStatus", "contact_messages");
  wireForm("demoForm", "demoStatus", "demo_requests");
  wireForm("registerForm", "registerStatus", "interest_registrations");

  /* ================= PWA ================= */
  var deferredPrompt = null;
  var pwaBanner = document.getElementById("pwaBanner");
  var pwaDismissed = false;
  try { pwaDismissed = localStorage.getItem("pg_pwa_dismissed") === "1"; } catch (e) {}
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (!pwaDismissed) pwaBanner.classList.add("show");
  });
  document.getElementById("pwaInstallBtn").addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      pwaBanner.classList.remove("show");
      deferredPrompt = null;
    });
  });
  document.getElementById("pwaDismissBtn").addEventListener("click", function () {
    pwaBanner.classList.remove("show");
    try { localStorage.setItem("pg_pwa_dismissed", "1"); } catch (e) {}
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
