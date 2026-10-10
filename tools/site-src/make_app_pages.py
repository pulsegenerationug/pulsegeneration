"""Writes pages/pulseproperty.html and pages/pulsestock.html (the bodies of the
PulseProperty Pro and PulseStock pages). Run before build.py when editing them."""
import pathlib

HERE = pathlib.Path(__file__).parent

APPS = {
    "pulseproperty": dict(
        name="PulseProperty Pro", tagline="Property, rent & estate management", color="#0E6E62", grad="grad-prop",
        headline='Rent collected on time.<br><span class="grad-prop">Every unit accounted for.</span>',
        lead="PulseProperty Pro runs landlords’, agents’ and estate companies’ portfolios: units, tenants, leases, automatic invoices, payments with receipts, deposits, meters, repairs and owner statements. It works with no internet, on your own network, across branches.",
        video="BL5p3M6Q5lc", shot="pulseproperty-dashboard_light", shot2="pulseproperty-occupancy_light", phone="pulseproperty-phone_home",
        strip=[("Version", "1.0.0", "Latest"), ("Platforms", "2", "Android · Windows"), ("Internet", "None", "for daily work"), ("Free trial", "30 days", "everything on"), ("From", "100k", "UGX / month")],
        features=[
            ("Occupancy board", "See every unit at a glance.", ["Colour board: vacant, occupied, overdue, reserved, under repair", "Properties, blocks, floors and units in bulk", "Search any tenant, unit or receipt instantly"]),
            ("Tenants & KYC", "Know who lives in every unit.", ["Scan the national ID or passport: details read on the device", "Next of kin, photos, documents and consent", "Duplicate-tenant checks by ID and phone"]),
            ("Leases & sales", "Rent, lease or sell with clean records.", ["Monthly, quarterly or yearly billing on any day", "Prorated first month and yearly escalation", "Plot and unit sales with instalment plans"]),
            ("Automatic billing", "Invoices write themselves.", ["Daily run creates rent, service charges and meter bills", "Late fees with grace days and caps", "Credit on file applied to the next invoice"]),
            ("Payments & receipts", "Every shilling traceable.", ["Cash, Mobile Money, bank and cheque", "Receipts with a QR code anyone can verify", "Bluetooth thermal printing that retries by itself"]),
            ("Deposits & meters", "No more disputes at move-out.", ["Deposits held, deducted and refunded with approval", "Water and power readings with photos", "Move-in / move-out inspections"]),
            ("Maintenance", "Repairs that get finished.", ["Work orders with priority and deadlines", "Before / after photos and contractor costs", "Costs charged to the landlord or tenant"]),
            ("Landlords & reports", "Owners see exactly what happened.", ["Landlord statements with commission", "Arrears ageing, collections and occupancy reports", "Cash sessions, expenses and profit & loss"]),
            ("Security & approvals", "Four eyes on what matters.", ["Roles for every job, branch-level access", "Fingerprint / Windows Hello approvals", "Tamper-evident audit trail of every change"]),
        ],
        prices=[("Monthly", "100,000"), ("6 months", "500,000"), ("1 year", "900,000"), ("Lifetime", "3,500,000")],
        faqs=[
            ("Does it need internet?", "No. One computer is the Host; every other computer, tablet or phone on the same WiFi or cable connects to it. Internet is only used, when available, for branch totals, licence delivery and support messages."),
            ("Can we run several branches?", "Yes. Each branch has its own Host and works on its own. The head office sees every branch’s totals and receives messages; tenant records never leave the branch."),
            ("How are tenants’ IDs captured?", "Take a photo of the ID or passport. The text is read on the device itself (no upload), and you confirm the details before saving."),
            ("How do we pay for the licence?", "MTN Mobile Money, Airtel Money, bank or card. Send the payment from Settings › Subscription; the key arrives in the app, or on WhatsApp for offline activation."),
        ],
    ),
    "pulsestock": dict(
        name="PulseStock", tagline="Retail, pharmacy & inventory", color="#1E40AF", grad="grad-stock",
        headline='Every item. Every batch.<br><span class="grad-stock">Never an expired sale.</span>',
        lead="PulseStock runs supermarkets, shops, wholesalers, retail and hospital pharmacies: barcode tills that keep selling offline, batches and expiry dates first-to-expire-first-out, prescriptions with dose checks, purchasing, transfers between branches and honest cash-ups.",
        video="BL5p3M6Q5lc", shot="pulsestock-pos_light", shot2="pulsestock-expiry_light", phone="pulsestock-phone_pos",
        strip=[("Version", "1.0.0", "Latest"), ("Platforms", "2", "Android · Windows"), ("Internet", "None", "for selling"), ("Free trial", "30 days", "everything on"), ("From", "80k", "UGX / month")],
        features=[
            ("Fast tills", "Scan, pay, next customer.", ["USB and phone-camera barcode scanning", "Cartons and pieces, retail and wholesale prices", "Tills keep selling if the Host is off, then catch up"]),
            ("Batches & expiry", "Expired stock can never be sold.", ["First-to-expire-first-out on every sale", "Do-not-sell window locks stock automatically", "Expiry dashboard: 30, 60 and 90 days"]),
            ("Pharmacy", "Dispense safely, label clearly.", ["Prescription capture with scan and pharmacist verification", "Weight-based dose checks for children (your formulary)", "Plain-language labels: “Give 5 ml THREE times a day”"]),
            ("Controlled drugs", "A register inspectors trust.", ["Append-only register with running balances", "Register vs. physical balance check", "Witnessed destruction of expired stock"]),
            ("Receiving & purchasing", "Buy right, pay right.", ["Goods received with batch, expiry and cost", "Purchase orders from automatic re-order suggestions", "Supplier payables, ageing and payments"]),
            ("Stock control", "Know what you really have.", ["Blind stock counts while you keep selling", "Adjustments and write-offs always approved", "Transfers between stores and branches, in transit"]),
            ("Recalls", "Act in minutes, not days.", ["Recall a batch: blocked everywhere at once", "See which customers and patients received it", "Head-office recalls reach every branch"]),
            ("Cash & customers", "Every till balances.", ["Shifts with opening float and blind cash-up", "Credit customers with limits and statements", "Receipts with a QR code anyone can verify"]),
            ("PulseHMIS link", "Hospital and pharmacy, one stock.", ["Dispensing in PulseHMIS deducts PulseStock", "Signed, never counted twice", "Works on the hospital network, no internet"]),
        ],
        prices=[("Monthly", "80,000"), ("6 months", "400,000"), ("1 year", "750,000"), ("Lifetime", "3,000,000")],
        faqs=[
            ("Is it for a shop or a pharmacy?", "Both. At setup choose Retail, Pharmacy or Mega store (a shop floor and a pharmacy counter under one roof). Each gets the right locations and screens."),
            ("What happens to expired medicines?", "They are locked the moment they enter the do-not-sell window and moved to an expired-stock location every day. Even an offline till cannot sell them. Write-off needs approval and records the destruction."),
            ("Does PulseStock know the right doses?", "It ships with no dosing data on purpose. Your pharmacist enters rules from your national formulary, with the source. Checks are advisory and every override is recorded."),
            ("Does it need internet?", "No. One computer is the Host and the tills connect over your own network. Internet is used, when available, for branch totals, recalls, catalog updates, licences and support."),
        ],
    ),
}

ICO = ["ico-teal", "ico-indigo", "ico-blue", "ico-orange", "ico-pink", "ico-gray", "ico-teal", "ico-indigo", "ico-blue"]


def page(slug, a):
    strip = "\n".join(f'          <div><small>{k}</small><b>{v}</b><span>{s}</span></div>' for k, v, s in a["strip"])
    feats = "\n".join(
        f'      <div class="feature reveal" style="--d:{(i % 3) * .05:.2f}s"><div class="t-ico {ICO[i]}">{{{{icon:check}}}}</div><h3>{t}</h3><p>{p}</p><ul>{"".join(f"<li>{x}</li>" for x in li)}</ul></div>'
        for i, (t, p, li) in enumerate(a["features"]))
    plans = "\n".join(
        f'      <div class="plan{" pop" if n == "1 year" else ""} reveal">{"<span class=pop-tag>Best value</span>" if n == "1 year" else ""}<h3>{n}</h3><div class="price">{p} <small>UGX</small></div><p class="per">Per organisation · every computer & phone</p>'
        f'<ul><li>{{{{icon:check}}}}All modules, all users</li><li>{{{{icon:check}}}}Branches report to head office</li><li>{{{{icon:check}}}}Updates and support</li></ul>'
        f'<a class="{"btn" if n == "1 year" else "btn btn-gray"}" href="/?product={a["name"].replace(" ", "%20")}#contact">Get {n.lower()}</a></div>'
        for n, p in a["prices"])
    faqs = "\n".join(f'      <details class="disc"><summary>{q}<span class="plus">{{{{icon:plus}}}}</span></summary><div class="disc-body"><p>{ans}</p></div></details>' for q, ans in a["faqs"])
    return f'''<section class="app-hero" aria-labelledby="app-title">
  <div class="ambient" aria-hidden="true"><div class="blob b2" style="opacity:.5"></div><div class="blob b1" style="opacity:.3"></div></div>
  <div class="grid-fade" aria-hidden="true"></div>
  <div class="wrap">
    <div class="app-hero-grid">
      <div>
        <div class="app-id reveal">
          <img class="app-icon" src="/site/img/{slug}-icon-384.webp" alt="{a["name"]} app icon" width="112" height="112">
          <div><h1 id="app-title">{a["name"]}</h1><p>{a["tagline"]}</p><p class="caption">Pulse Generation UG</p></div>
        </div>
        <h2 class="display reveal" style="font-size:clamp(40px,6vw,76px);--d:.05s">{a["headline"]}</h2>
        <p class="lead mt-24 reveal" style="--d:.1s">{a["lead"]}</p>
        <div class="app-actions reveal" style="--d:.15s">
          <a class="btn btn-lg btn-shine" href="#download" data-smart-dl="{a["name"]}" style="--b-bg:{a["color"]}"><span class="os-ico" style="display:contents">{{{{icon:download}}}}</span><span class="label">Download</span></a>
          <button class="btn btn-lg btn-glass" type="button" data-video="{a["video"]}">{{{{icon:play}}}}Watch our video</button>
        </div>
        <div class="info-strip reveal" style="--d:.2s">
{strip}
        </div>
      </div>
      <div class="reveal-scale app-shots" style="--d:.15s">
        <img class="shot shot-main" src="/site/img/{a["shot"]}.webp" alt="{a["name"]} on a computer" loading="eager" width="1200" height="800">
        <img class="shot shot-phone" src="/site/img/{a["phone"]}.webp" alt="{a["name"]} on a phone" loading="lazy" width="420" height="900">
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="features" aria-labelledby="feat-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="dot" style="color:{a["color"]}"></span>Everything included</span>
      <h2 class="title-1" id="feat-title">Built for the way you work.<br>Offline first, branches included.</h2>
    </div>
    <div class="features">
{feats}
    </div>
    <div class="shot-band mt-48 reveal-scale"><img class="shot" src="/site/img/{a["shot2"]}.webp" alt="{a["name"]} screen" loading="lazy" width="1200" height="800"></div>
  </div>
</section>

<section class="section" id="pricing" aria-labelledby="pricing-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="dot" style="color:{a["color"]}"></span>Simple pricing</span>
      <h2 class="title-1" id="pricing-title">30 days free. Then one price per organisation.</h2>
      <p class="lead">Install on every computer and phone you have. Pay once per organisation, not per device. Activate online or with a 16-character key sent on WhatsApp.</p>
    </div>
    <div class="pricing pricing-4">
{plans}
    </div>
  </div>
</section>

<section class="section section-alt" id="videos" aria-labelledby="videos-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="dot" style="color:var(--red)"></span>Video</span>
      <h2 class="title-1" id="videos-title">See Pulse Generation in action.</h2>
    </div>
    <div class="videos" data-videos="{a["name"]}" data-feature></div>
  </div>
</section>

<section class="section" id="download" aria-labelledby="dl-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="dot" style="color:var(--blue)"></span>Download</span>
      <h2 class="title-1" id="dl-title">Install {a["name"]}.</h2>
      <p class="lead">Use the Windows installer on the main (Host) computer and the Android app on tablets and phones on the same network.</p>
    </div>
    <div class="dl-grid" data-downloads="{a["name"]}"></div>
    <div class="dl-note"><span>{{{{icon:shield}}}}Straight from our <a href="https://github.com/pulsegenerationug/pulsegeneration/releases" target="_blank" rel="noopener">official GitHub release</a></span></div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="pfaq-title">
  <div class="wrap">
    <div class="section-head reveal"><h2 class="title-2" id="pfaq-title">{a["name"]} questions</h2></div>
    <div class="faq"><div data-faq>
{faqs}
    </div></div>
  </div>
</section>

<section class="section tight" aria-label="Get started">
  <div class="wrap">
    <div class="cta-band reveal-scale">
      <h2 class="title-1">Start your free 30 days.</h2>
      <p class="lead">Install today, or let us set up your network and train your team.</p>
      <div class="hero-cta"><a class="btn btn-lg btn-white" href="#download">{{{{icon:download}}}}Download free</a><a class="btn btn-lg btn-glass" href="/?product={a["name"].replace(" ", "%20")}#contact">Request a demo</a></div>
    </div>
  </div>
</section>
'''


for slug, a in APPS.items():
    (HERE / "pages" / f"{slug}.html").write_text(page(slug, a), encoding="utf-8", newline="\n")
print("pages written")
