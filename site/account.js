/* Pulse account (website): sign up, log in, password reset, profile and
   conversations, on the Pulse hub (Supabase Auth). The public key can only
   reach the signed-in visitor's own data (see 31_website_accounts.sql). */
(function () {
  "use strict";
  var HUB_URL = "https://nouvrneiwiwamcxmvizj.supabase.co";
  var HUB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdXZybmVpd2l3YW1jeG12aXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzAzMTEsImV4cCI6MjEwNjcwNjMxMX0.oCKDzxWhPdWhvFaZHz-DSdJKKlKt8YMpytPg87CN1g0";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(iso) { try { return new Date(iso).toLocaleString(); } catch (e) { return iso || ""; } }

  var out = $("[data-acct-out]"), inn = $("[data-acct-in]"), resetForm = $('[data-form="reset"]');
  if (!out) return;

  if (!window.supabase || !window.supabase.createClient) {
    $("[data-acct-offline]").hidden = false;
    return;
  }
  var sb = window.supabase.createClient(HUB_URL, HUB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  function friendly(err) {
    var m = (err && (err.message || err.error_description)) || String(err || "");
    if (/Invalid login credentials/i.test(m)) return "Wrong email or password.";
    if (/already registered|already been registered|User already/i.test(m)) return "An account with this email already exists. Log in instead, or reset your password.";
    if (/Password should be|weak/i.test(m)) return "Choose a stronger password (at least 8 characters, mixing letters and numbers).";
    if (/rate limit|too many/i.test(m)) return "Too many attempts. Please wait a few minutes and try again.";
    if (/Email not confirmed/i.test(m)) return "Please confirm your email first: open the link we sent you.";
    if (/Failed to fetch|NetworkError|network/i.test(m)) return "No connection. Check your internet and try again.";
    if (/Could not find the function|schema cache/i.test(m)) return "Accounts are being set up. Please try again soon.";
    return m.replace(/^[A-Z_]{4,}:\s*/, "");
  }
  function status(form, text, kind) {
    var s = $("[data-status]", form);
    if (!s) return;
    s.className = "form-status" + (kind ? " " + kind : "");
    s.textContent = text || "";
  }
  function busy(form, on) {
    var b = $(".acct-submit", form);
    if (b) { b.disabled = on; b.style.opacity = on ? ".6" : ""; }
  }

  // ---------------------------------------------------------------- tabs
  function showTab(name) {
    $$("[data-acct-tabs] button").forEach(function (b) { var on = b.getAttribute("data-tab") === name; b.classList.toggle("active", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
    ["login", "signup", "forgot"].forEach(function (n) { $('[data-form="' + n + '"]').hidden = n !== name; });
  }
  $$("[data-acct-tabs] button").forEach(function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); }); });
  var want = new URLSearchParams(location.search).get("tab");
  if (want === "signup" || want === "forgot") showTab(want);

  // show / hide password
  $$("[data-pw-eye]").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = b.parentNode.querySelector("input");
      i.type = i.type === "password" ? "text" : "password";
      b.setAttribute("aria-label", i.type === "password" ? "Show password" : "Hide password");
    });
  });
  // strength meter
  var meter = $("[data-pw-meter]");
  if (meter) {
    var pw = $('[data-form="signup"] input[name="password"]');
    pw.addEventListener("input", function () {
      var v = pw.value, n = 0;
      if (v.length >= 8) n++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) n++;
      if (/\d/.test(v)) n++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) n++;
      $$("i", meter).forEach(function (bar, k) { bar.className = k < n ? "on s" + n : ""; });
      $("b", meter).textContent = v ? ["Too short", "Weak", "Fair", "Good", "Strong"][n] : "";
    });
  }

  // ---------------------------------------------------------------- auth forms
  $('[data-form="login"]').addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    busy(f, true); status(f, "Logging in…");
    sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.password.value }).then(function (r) {
      if (r.error) throw r.error;
      status(f, "");
    }).catch(function (err) { status(f, friendly(err), "err"); }).then(function () { busy(f, false); });
  });

  $('[data-form="signup"]').addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var name = f.full_name.value.trim(), email = f.email.value.trim(), pass = f.password.value;
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return status(f, "Please add your name and a valid email.", "err");
    if (pass.length < 8) return status(f, "Use a password of at least 8 characters.", "err");
    if (!f.terms.checked) return status(f, "Please accept the Terms and Privacy Policy.", "err");
    busy(f, true); status(f, "Creating your account…");
    sb.auth.signUp({
      email: email, password: pass,
      options: { data: { full_name: name, organization: f.organization.value.trim(), news_opt_in: f.news.checked }, emailRedirectTo: location.origin + "/account/" }
    }).then(function (r) {
      if (r.error) throw r.error;
      if (r.data && r.data.session) {
        status(f, "");
      } else {
        status(f, "Almost done: open the confirmation link we sent to " + email + ", then log in.", "ok");
      }
    }).catch(function (err) { status(f, friendly(err), "err"); }).then(function () { busy(f, false); });
  });

  $('[data-form="forgot"]').addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return status(f, "Please enter a valid email.", "err");
    busy(f, true); status(f, "Sending…");
    sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/account/?reset=1" }).then(function (r) {
      if (r.error) throw r.error;
      status(f, "If an account exists for " + email + ", a reset link is on its way. Check your inbox and spam folder.", "ok");
    }).catch(function (err) { status(f, friendly(err), "err"); }).then(function () { busy(f, false); });
  });

  resetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (f.password.value.length < 8) return status(f, "Use at least 8 characters.", "err");
    busy(f, true);
    sb.auth.updateUser({ password: f.password.value }).then(function (r) {
      if (r.error) throw r.error;
      status(f, "Password changed. You are logged in.", "ok");
      setTimeout(function () { resetForm.hidden = true; render(); }, 1200);
    }).catch(function (err) { status(f, friendly(err), "err"); }).then(function () { busy(f, false); });
  });

  // ---------------------------------------------------------------- signed in
  function tickets() { try { return JSON.parse(localStorage.getItem("pg_tickets") || "[]"); } catch (e) { return []; } }

  function loadConvos() {
    var box = $("[data-acct-convos]");
    sb.rpc("web_my_conversations").then(function (r) {
      if (r.error) throw r.error;
      var list = r.data || [];
      box.innerHTML = list.length
        ? '<div class="sup-list">' + list.map(function (c) {
            var st = c.status === "REPLIED" ? '<span class="pill green">We replied</span>' : c.status === "CLOSED" ? '<span class="pill">Closed</span>' : '<span class="pill blue">Waiting for our reply</span>';
            return '<a class="sup-item" href="/support/?t=' + encodeURIComponent(c.ticket || "") + '"><span class="grow"><b>' + esc(c.subject || c.product || "Message") +
              "</b><br><small>" + esc(c.message) + "</small></span><span>" + st + "<br><small>" + esc(fmt(c.last_activity_at)) + "</small></span></a>";
          }).join("") + "</div>"
        : '<p class="muted">No conversations yet. Messages you send while logged in appear here, with our replies.</p>';
    }).catch(function (err) { box.innerHTML = '<p class="muted">' + esc(friendly(err)) + "</p>"; });
  }

  function fillProfile(a) {
    var f = $('[data-form="profile"]');
    ["full_name", "organization", "phone", "country"].forEach(function (k) { f[k].value = a[k] || ""; });
    f.news_opt_in.checked = !!a.news_opt_in;
    var set = a.interests || [];
    $$("[data-interests] input", f).forEach(function (i) { i.checked = set.indexOf(i.value) >= 0; });
    $("[data-acct-name]").textContent = "Hello, " + ((a.full_name || "").split(" ")[0] || "there");
    $("[data-acct-email]").textContent = a.email || "";
    $("[data-acct-avatar]").textContent = ((a.full_name || a.email || "?").trim()[0] || "?").toUpperCase();
  }

  function render() {
    sb.auth.getSession().then(function (s) {
      var session = s.data && s.data.session;
      var resetting = /reset=1/.test(location.search) || /type=recovery/.test(location.hash);
      if (session && resetting && !render.resetShown) {
        render.resetShown = true;
        out.hidden = true; inn.hidden = true; resetForm.hidden = false;
        return;
      }
      if (!session) { out.hidden = false; inn.hidden = true; return; }
      out.hidden = true; inn.hidden = false;
      $("[data-acct-title]").textContent = "My account";
      // link conversations started on this device before logging in
      var t = tickets().map(function (x) { return x.t; }).filter(Boolean);
      var claim = t.length ? sb.rpc("web_claim_tickets", { p_tickets: t }) : Promise.resolve();
      Promise.resolve(claim).then(function () { return sb.rpc("web_account_get"); }).then(function (r) {
        if (r.error) throw r.error;
        fillProfile(r.data || {});
        loadConvos();
      }).catch(function (err) {
        $("[data-acct-convos]").innerHTML = '<p class="muted">' + esc(friendly(err)) + "</p>";
        $("[data-acct-email]").textContent = session.user.email;
      });
    });
  }

  $('[data-form="profile"]').addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    busy(f, true);
    sb.rpc("web_account_save", { p: {
      full_name: f.full_name.value, organization: f.organization.value, phone: f.phone.value, country: f.country.value,
      news_opt_in: f.news_opt_in.checked,
      interests: $$("[data-interests] input:checked", f).map(function (i) { return i.value; })
    } }).then(function (r) {
      if (r.error) throw r.error;
      fillProfile(r.data || {});
      status(f, "Saved.", "ok");
    }).catch(function (err) { status(f, friendly(err), "err"); }).then(function () { busy(f, false); });
  });

  $('[data-form="password"]').addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (f.password.value.length < 8) return status(f, "Use at least 8 characters.", "err");
    busy(f, true);
    sb.auth.updateUser({ password: f.password.value }).then(function (r) {
      if (r.error) throw r.error;
      f.reset(); status(f, "Password updated.", "ok");
    }).catch(function (err) { status(f, friendly(err), "err"); }).then(function () { busy(f, false); });
  });

  $("[data-acct-signout]").addEventListener("click", function () { sb.auth.signOut().then(render); });

  $("[data-acct-delete]").addEventListener("click", function () {
    if (!confirm("Delete your website account? This cannot be undone.")) return;
    sb.rpc("web_account_delete").then(function (r) {
      if (r.error) throw r.error;
      return sb.auth.signOut();
    }).then(function () { alert("Your account has been deleted."); render(); })
      .catch(function (err) { alert(friendly(err)); });
  });

  sb.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") {
      out.hidden = true; inn.hidden = true; resetForm.hidden = false;
      render.resetShown = true;
      return;
    }
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") render();
  });
  render();
})();
