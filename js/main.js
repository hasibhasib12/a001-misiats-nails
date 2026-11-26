/* Misiats Nails – main.js (kein Tracking, keine Cookies, kein Speicher) */
(function () {
  "use strict";
  var D = window.MN, body = document.body;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var params = new URLSearchParams(location.search);
  var base = body.getAttribute("data-base") || "";
  var LANG = document.documentElement.lang === "en" ? "en" : "de";
  function sname(s, lg) { return ((lg || LANG) === "en" && s.en) || s.name; }
  function salt(s) { return (LANG === "en" && s.alt_en) || s.alt || sname(s); }
  function findSvc(loc, svc, id) { var r = null; D.locations[loc].services[svc].forEach(function (s) { if (s.id === id) r = s; }); return r; }

  /* ---------- Preise ---------- */
  function priceText(s, lang) {
    lang = lang || LANG;
    if (s.price == null) return { t: lang === "en" ? "Price to follow" : "Preis folgt", tbc: true };
    return { t: (s.prefix || "") + (s.from ? (lang === "en" ? "from " : "ab ") : "") + s.price + " €", tbc: false };
  }
  function photoEl(s) {
    var box = el("div", "ph-img");
    var img = document.createElement("img");
    img.loading = "lazy"; img.decoding = "async"; img.width = 720; img.height = 540;
    if (s.photo) {
      img.sizes = "(max-width:640px) 92vw, 380px";
      img.srcset = base + "photos/" + s.photo + "-720.webp 720w, " + base + "photos/" + s.photo + "-1440.webp 1440w";
      img.src = base + "photos/" + s.photo + "-720.webp";
      img.alt = salt(s);
    } else {
      img.src = base + "photos/platzhalter-foto-folgt.svg";
      img.alt = LANG === "en" ? "Placeholder – photo of " + sname(s) + " to follow" : "Platzhalter – Foto für " + s.name + " folgt";
    }
    box.appendChild(img); return box;
  }
  $$("[data-prices]").forEach(function (ul) {
    var p = ul.getAttribute("data-prices").split(".");
    D.locations[p[0]].services[p[1]].forEach(function (s) {
      var li = el("li"); li.appendChild(el("span", "", sname(s)));
      var pt = priceText(s); li.appendChild(el("b", pt.tbc ? "tbc" : "", pt.t)); ul.appendChild(li);
    });
  });
  $$("[data-services]").forEach(function (wrap) {
    var p = wrap.getAttribute("data-services").split(".");
    D.locations[p[0]].services[p[1]].forEach(function (s) {
      var a = el("article", "svc-item"); a.appendChild(photoEl(s));
      var row = el("div", "row"); row.appendChild(el("h4", "", sname(s)));
      var pt = priceText(s); row.appendChild(el("b", pt.tbc ? "tbc" : "", pt.t));
      a.appendChild(row); wrap.appendChild(a);
    });
  });
  $$("[data-addr]").forEach(function (e) { e.textContent = D.locations[e.getAttribute("data-addr")].address; });
  $$("[data-map]").forEach(function (a) { a.href = D.locations[a.getAttribute("data-map")].map; });

  /* ---------- Menü ---------- */
  var menuBtn = $(".menu-btn"), menuClose = $(".menu-close");
  function openMenu() { body.classList.add("menu-open"); menuBtn.setAttribute("aria-expanded", "true"); menuClose.focus(); }
  function closeMenu() { if (!body.classList.contains("menu-open")) return; body.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); }
  menuBtn.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  $(".menu-backdrop").addEventListener("click", closeMenu);
  $$(".menu-panel a").forEach(function (a) { a.addEventListener("click", function () { body.classList.remove("menu-open"); }); });
  $(".menu-panel").addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var f = $$("a,button", this), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  if (params.get("menu") === "1") body.classList.add("menu-open");

  /* ---------- Sprache ---------- */
  var lang = $(".lang"), langBtn = $(".lang-pill");
  langBtn.addEventListener("click", function (e) { e.stopPropagation(); var o = lang.classList.toggle("open"); langBtn.setAttribute("aria-expanded", o); });
  document.addEventListener("click", function () { lang.classList.remove("open"); langBtn.setAttribute("aria-expanded", "false"); });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (body.classList.contains("lb-open")) closeLb();
    else if (body.classList.contains("menu-open")) closeMenu();
    else if (body.classList.contains("chat-open")) closeChat();
    lang.classList.remove("open");
  });

  /* ---------- Galerie-Lightbox ---------- */
  var lb = $(".lb"), lbImg = lb && $("img", lb), lbLast, lbKb = false;
  function closeLb() { lb.classList.remove("on"); body.classList.remove("lb-open"); if (lbLast) { if (!lbKb) lbLast.classList.add("no-ring"); try { lbLast.focus({ preventScroll: true, focusVisible: lbKb }); } catch (e) { lbLast.focus(); } } }
  if (lb) {
    $$(".mag button").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = $("img", b); lbLast = b; lbKb = false; lbImg.src = b.getAttribute("data-full"); lbImg.alt = i.alt;
        lb.classList.add("on"); body.classList.add("lb-open"); $(".lb-x", lb).focus();
      });
    });
    $(".lb-x", lb).addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  }


  /* ---------- Galerie: Magazin-Split ---------- */
  var kw = $(".kc-wrap");
  if (kw) {
    var KD = JSON.parse(kw.getAttribute("data-items")), km = $$(".kc-m", kw), kt = $$(".kc-t", kw), kc = 0;
    var kreduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, kstage = $(".kc-stage", kw);
    function kpad(i) { return (i < 9 ? "0" : "") + (i + 1); }
    function kshow(i) {
      i = (i + km.length) % km.length; if (i === kc) return;
      km[kc].classList.remove("on"); kt[kc].classList.remove("on"); kt[kc].removeAttribute("aria-current");
      kc = i; km[kc].classList.add("on"); kt[kc].classList.add("on"); kt[kc].setAttribute("aria-current", "true");
      var im = $("img", km[kc]); if (im.loading === "lazy") im.loading = "eager";
      var nx = $("img", km[(kc + 1) % km.length]); if (nx.loading === "lazy") nx.loading = "eager";
      $(".kc-no", kw).textContent = kpad(kc); $(".kc-cap", kw).textContent = KD[kc][0]; $(".kc-alt", kw).textContent = KD[kc][1]; $(".kc-count b", kw).textContent = kpad(kc);
      var st = $(".kc-strip", kw), t = kt[kc]; st.scrollTo({ left: t.offsetLeft - (st.clientWidth - t.offsetWidth) / 2, behavior: kreduce ? "auto" : "smooth" });
    }
    kt.forEach(function (b, i) { b.addEventListener("click", function () { kshow(i); }); });
    $(".kc-next", kw).addEventListener("click", function () { kshow(kc + 1); });
    $(".kc-prev", kw).addEventListener("click", function () { kshow(kc - 1); });
    var kx = null, kdx = 0, kmoved = false;
    kstage.addEventListener("pointerdown", function (e) { kx = e.clientX; kdx = 0; kmoved = false; if (e.pointerType === "mouse") e.preventDefault(); });
    kstage.addEventListener("dragstart", function (e) { e.preventDefault(); });
    kstage.addEventListener("pointermove", function (e) { if (kx !== null) { kdx = e.clientX - kx; if (Math.abs(kdx) > 8) kmoved = true; } });
    function kup() { if (kx === null) return; kx = null; if (kdx < -45) kshow(kc + 1); else if (kdx > 45) kshow(kc - 1); }
    kstage.addEventListener("pointerup", kup); kstage.addEventListener("pointercancel", kup);
    function kopen(kb) { if (!lb) return; lbKb = !!kb; lbLast = kstage; lbImg.src = km[kc].getAttribute("data-full"); lbImg.alt = $("img", km[kc]).alt; lb.classList.add("on"); body.classList.add("lb-open"); $(".lb-x", lb).focus(); }
    kstage.addEventListener("blur", function () { kstage.classList.remove("no-ring"); });
    kstage.addEventListener("keydown", function (e) { if (e.key === "Tab" || e.key === "ArrowLeft" || e.key === "ArrowRight") kstage.classList.remove("no-ring"); });
    kstage.addEventListener("click", function () { if (!kmoved) kopen(); kmoved = false; });
    kw.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); kshow(kc + 1); } else if (e.key === "ArrowLeft") { e.preventDefault(); kshow(kc - 1); }
      else if ((e.key === "Enter" || e.key === " ") && e.target === kstage) { e.preventDefault(); kopen(true); }
    });
  }

  /* ---------- WhatsApp-Nachricht (nur im Browser) ---------- */
  var T = {
    de: { hi: "Hallo! Ich helfe Ihnen, Ihre Terminanfrage für WhatsApp vorzubereiten.",
          loc: "An welchem Standort möchten Sie Ihren Termin?", schwelmOnly: "In Schwelm bieten wir ausschließlich Pediküre an.",
          svc: "Maniküre oder Pediküre?", treat: "Welche Behandlung wünschen Sie?", date: "Wählen Sie bitte Ihr Wunschdatum und Ihre Wunschuhrzeit.",
          name: "Wie ist Ihr Vorname?", namePh: "Vorname", ok: "Weiter", flex: "Ich bin flexibel",
          done: "Danke, {n}! Ihre Anfrage ist vorbereitet. Tippen Sie unten, um sie per WhatsApp zu senden. Ihr Termin wird persönlich per WhatsApp bestätigt.",
          wa: "Termin per WhatsApp anfragen", note: "Ihr Termin wird persönlich per WhatsApp bestätigt. Es wird nichts gespeichert – bitte keine Gesundheitsdaten angeben.",
          restart: "Neu beginnen", sub: "Assistent · Terminanfrage", mani: "Maniküre", pedi: "Pediküre",
          pickDate: "Bitte ein Datum wählen.", dateL: "Datum", slotL: "Tageszeit", wDate: "Wunschdatum", wTime: "Wunschuhrzeit", timeL: "Wunschuhrzeit", tNote: "Ihr Termin wird persönlich per WhatsApp bestätigt.", flexT: "flexibel", pickTime: "Bitte eine Wunschuhrzeit wählen.", closed: "An diesem Tag ist leider geschlossen – bitte ein anderes Datum wählen.",
          days: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
          choose: "Bitte wählen", first: "Erst Standort und Leistung wählen", fill: "Bitte alle Felder ausfüllen.", sOnly: "In Schwelm nur Pediküre.",
          msg: ["Hallo Misiats Nails, ich möchte gern einen Termin anfragen.", "Standort", "Behandlung", "Wunschtermin", "Name", "flexibel", "Bitte bestätigen Sie mir den Termin per WhatsApp. Danke!"] },
    en: { hi: "Hello! I’ll help you prepare your appointment request for WhatsApp.", loc: "Which location would you like to visit?", schwelmOnly: "Our Schwelm studio offers pedicures only.",
          svc: "Manicure or pedicure?", treat: "Which treatment would you like?", date: "Please choose your preferred date and time.",
          name: "What is your first name?", namePh: "First name", ok: "Next", flex: "I'm flexible",
          done: "Thank you, {n}! Your request is ready. Tap below to send it via WhatsApp. Your appointment will be confirmed personally via WhatsApp.",
          wa: "Request appointment via WhatsApp", note: "Your appointment is confirmed personally via WhatsApp. Nothing is stored – please do not share health information.",
          restart: "Start again", sub: "Assistant · Appointment request", mani: "Manicure", pedi: "Pedicure",
          pickDate: "Please choose a date.", dateL: "Date", slotL: "Time of day", wDate: "Preferred date", wTime: "Preferred time", timeL: "Preferred time", tNote: "Your appointment will be confirmed personally via WhatsApp.", flexT: "flexible", pickTime: "Please choose a preferred time.", closed: "Sorry, we are closed on that day – please choose another date.",
          days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          choose: "Please choose", first: "Choose location and service first", fill: "Please fill in all fields.", sOnly: "Pedicure only in Schwelm.",
          msg: ["Hello Misiats Nails, I would like to request an appointment.", "Location", "Treatment", "Preferred date", "Name", "flexible", "Please confirm the appointment via WhatsApp. Thank you!"] }
  };
  function pd(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function longDate(iso, lg) { if (!iso) return ""; var d = pd(iso), t = T[lg || LANG];
    return lg === "en" ? t.days[d.getDay()] + ", " + d.getDate() + " " + t.months[d.getMonth()] + " " + d.getFullYear() : t.days[d.getDay()] + ", " + fmtDate(iso); }
  function slotsList() { var B = D.booking || { first: "10:00", last: "19:30", stepMin: 30 }, r = [];
    function m(x) { var p = x.split(":"); return +p[0] * 60 + +p[1]; }
    for (var x = m(B.first); x <= m(B.last); x += B.stepMin) r.push((x < 600 ? "0" : "") + Math.floor(x / 60) + ":" + (x % 60 < 10 ? "0" : "") + (x % 60));
    return r; }
  function isClosed(iso) { var c = (D.booking && D.booking.closedDays) || []; return !!iso && c.indexOf(pd(iso).getDay()) >= 0; }
  function fmtDate(iso) { if (!iso) return ""; var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function buildWa(d) {
    var t = T[d.lang || "de"], L = D.locations[d.loc];
    var lg = d.lang || "de", svcName = (d.svc === "manikuere" ? t.mani : t.pedi), sv = findSvc(d.loc, d.svc, d.treat), tn = sv ? sname(sv, lg) : d.treat;
    var whenLines = (d.flex && !d.date) ? [t.msg[3] + ": " + t.msg[5]] : [t.wDate + ": " + longDate(d.date, lg), t.wTime + ": " + (d.time && d.time !== "flex" ? d.time : t.flexT)];
    var m = [t.msg[0], "", t.msg[1] + ": " + L.name, t.msg[2] + ": " + (tn.toLowerCase().indexOf(svcName.toLowerCase()) >= 0 ? tn : svcName + " – " + tn)].concat(whenLines, [t.msg[4] + ": " + d.name, "", t.msg[6]]).join("\n");
    return "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(m);
  }
  window.MNbuildWa = buildWa;
  /* WhatsApp-Übergabe: echter Link (<a href="https://wa.me/...">), Tap navigiert nativ.
     Auf Touch-Geräten im selben Tab (kein target=_blank / window.open → kein Popup-Blocker,
     funktioniert auch in In-App-Browsern von Instagram/Facebook/TikTok und öffnet die App). */
  var DESK = !((window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || /Android|iPhone|iPad|iPod|Mobile|FBAN|FBAV|Instagram/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)));
  function linkWa(a, url) { a.href = url; if (DESK) a.target = "_blank"; else a.removeAttribute("target"); a.rel = "noopener"; }
  var FB = { de: ["Öffnet sich WhatsApp nicht?", "Hier tippen", "oder direkt schreiben an +49 172 6127991."],
             en: ["WhatsApp didn’t open?", "Tap here", "or message us directly at +49 172 6127991."] }[LANG];
  function fallback(box, url) { box.textContent = ""; box.appendChild(document.createTextNode(FB[0] + " ")); var a = el("a", "", FB[1]); linkWa(a, url); box.appendChild(a); box.appendChild(document.createTextNode(" " + FB[2])); box.hidden = false; }
  function today() { var n = new Date(); n.setMinutes(n.getMinutes() - n.getTimezoneOffset()); return n.toISOString().slice(0, 10); }
  function cleanName(v) { return v.replace(/[<>{}\[\]\\\/@0-9]/g, "").replace(/\s+/g, " ").trim().slice(0, 30); }

  /* ---------- Chat-Assistent (geführt) ---------- */
  var panel = $(".chat-panel"), fab = $(".chat-fab");
  if (panel) {
    var cb = $(".chat-body", panel), waBtn = $(".chat-wa", panel), noteEl = $(".chat-note", panel), st;
    function bot(text) { var m = el("div", "msg bot", text); cb.appendChild(m); cb.scrollTop = cb.scrollHeight; }
    function me(text) { var m = el("div", "msg me", text); cb.appendChild(m); }
    function chips(list, fn) {
      var c = el("div", "chips");
      list.forEach(function (it) {
        var b = el("button", "chip", it.label); b.type = "button";
        b.addEventListener("click", function () { c.remove(); me(it.label); fn(it.value); });
        c.appendChild(b);
      });
      cb.appendChild(c); cb.scrollTop = cb.scrollHeight; var f = $("button", c); if (f && body.classList.contains("chat-open")) f.focus({ preventScroll: true });
    }
    function t() { return T[st.lang]; }
    function setWa(url) {
      if (url) { linkWa(waBtn, url); waBtn.removeAttribute("aria-disabled"); waBtn.removeAttribute("tabindex"); }
      else { waBtn.href = "https://wa.me/" + D.whatsapp; waBtn.removeAttribute("target"); waBtn.setAttribute("aria-disabled", "true"); waBtn.setAttribute("tabindex", "-1"); }
    }
    function uiLang() { waBtn.textContent = t().wa; noteEl.textContent = t().note; $(".chat-head small", panel).textContent = t().sub; restartBtn.textContent = t().restart; }
    var restartBtn = $(".chat-restart", panel);
    waBtn.addEventListener("click", function (e) { if (waBtn.getAttribute("aria-disabled") === "true") e.preventDefault(); });
    function start(preset) {
      st = { lang: LANG }; cb.textContent = ""; setWa(null); uiLang();
      bot(t().hi);
      if (preset) { st.loc = preset[0]; afterLoc(preset[1]); } else askLoc();
    }
    function askLoc() {
      bot(t().loc);
      chips([{ label: "Wuppertal-Langerfeld", value: "langerfeld" }, { label: "Schwelm", value: "schwelm" }], function (v) { st.loc = v; afterLoc(); });
    }
    function afterLoc(svc) {
      if (st.loc === "schwelm") { bot(t().schwelmOnly); st.svc = "pedikuere"; return askTreat(); }
      if (svc) { st.svc = svc; return askTreat(); }
      bot(t().svc);
      chips([{ label: t().mani, value: "manikuere" }, { label: t().pedi, value: "pedikuere" }], function (v) { st.svc = v; askTreat(); });
    }
    function askTreat() {
      bot(t().treat);
      chips(D.locations[st.loc].services[st.svc].map(function (s) {
        var p = priceText(s, st.lang); return { label: sname(s, st.lang) + (p.tbc ? "" : " · " + p.t), value: s.id };
      }), function (v) { st.treat = v; askDate(); });
    }
    function askDate() {
      bot(t().date);
      var box = el("div", "chat-time"), di = el("input");
      di.type = "date"; di.min = today(); di.setAttribute("aria-label", t().wDate); di.className = "ct-date";
      box.appendChild(el("p", "ct-l", t().wDate)); box.appendChild(di);
      box.appendChild(el("p", "ct-l", t().timeL));
      var grid = el("div", "slot-grid");
      slotsList().forEach(function (tm) {
        var bt = el("button", "slot", tm); bt.type = "button"; bt.setAttribute("aria-label", t().timeL + " " + tm);
        bt.addEventListener("click", function () {            /* Werte werden beim Tippen gelesen */
          if (!di.value) { di.focus(); return bot(t().pickDate); }
          if (isClosed(di.value)) { di.focus(); return bot(t().closed); }
          st.date = di.value; st.time = tm; st.flex = false; box.remove(); me(longDate(st.date, st.lang) + " · " + tm); askName();
        });
        grid.appendChild(bt);
      });
      box.appendChild(grid);
      box.appendChild(el("p", "ct-note", t().tNote));
      var fb = el("button", "chip ct-flex", t().flex); fb.type = "button"; box.appendChild(fb);
      cb.appendChild(box); cb.scrollTop = cb.scrollHeight;
      fb.addEventListener("click", function () {
        st.flex = true; st.time = "flex"; st.date = (di.value && !isClosed(di.value)) ? di.value : ""; box.remove();
        me(st.date ? longDate(st.date, st.lang) + " · " + t().flex : t().flex); askName();
      });
    }
    function askName() {
      bot(t().name);
      var row = el("form", "chat-in"), ni = el("input"), ok = el("button", "", t().ok);
      ni.type = "text"; ni.maxLength = 30; ni.autocomplete = "given-name"; ni.placeholder = t().namePh; ni.setAttribute("aria-label", t().namePh); ni.required = true;
      ok.type = "submit"; row.appendChild(ni); row.appendChild(ok); cb.appendChild(row); cb.scrollTop = cb.scrollHeight; ni.focus({ preventScroll: true });
      row.addEventListener("submit", function (e) {
        e.preventDefault(); var n = cleanName(ni.value); if (!n) return ni.focus();
        st.name = n; row.remove(); me(n);
        bot(t().done.replace("{n}", n)); var u = buildWa(st); setWa(u);
        var fb = el("div", "msg bot wa-fb"); fallback(fb, u); cb.appendChild(fb); cb.scrollTop = cb.scrollHeight; waBtn.focus({ preventScroll: true });
      });
    }
    function openChat(preset) { body.classList.add("chat-open"); fab.setAttribute("aria-expanded", "true"); if (preset || !st) start(preset); }
    function closeChat() { body.classList.remove("chat-open"); fab.setAttribute("aria-expanded", "false"); fab.focus(); }
    window.MNcloseChat = closeChat;
    window.MNopenChat = openChat; window.MNchatOpen = function () { return body.classList.contains("chat-open"); };
    fab.addEventListener("click", function () { body.classList.contains("chat-open") ? closeChat() : openChat(); });
    $(".chat-head .x", panel).addEventListener("click", closeChat);
    restartBtn.addEventListener("click", function () { start(); });
    $$("[data-chat]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openChat(a.getAttribute("data-chat").split(":")); });
    });
    if (params.get("chat") === "1") openChat();
  }
  function closeChatFn() { if (window.MNcloseChat) window.MNcloseChat(); }
  var closeChat = closeChatFn;

  /* ---------- Buchungsformular (Kontakt) ---------- */
  var form = $("#bform");
  if (form) {
    var sel = $("#f-treat", form), err = $(".ferr", form), di = $("#f-date", form);
    di.min = today();
    function val(n) { var c = $("input[name=" + n + "]:checked", form); return c ? c.value : ""; }
    function sync() {
      var loc = val("loc"), maniR = $("#f-mani", form);
      maniR.disabled = loc === "schwelm";
      if (loc === "schwelm") $("#f-pedi", form).checked = true;
      var svc = val("svc"); sel.textContent = "";
      var o0 = el("option", "", loc && svc ? T[LANG].choose : T[LANG].first); o0.value = ""; sel.appendChild(o0);
      if (loc && svc) D.locations[loc].services[svc].forEach(function (s) {
        var p = priceText(s), o = el("option", "", sname(s) + " – " + p.t); o.value = s.id; sel.appendChild(o);
      });
    }
    $$("input[type=radio]", form).forEach(function (r) { r.addEventListener("change", sync); });
    var pl = params.get("loc"), ps = params.get("svc");
    if (pl && D.locations[pl]) { $("#f-" + pl, form).checked = true; }
    if (ps === "manikuere" || ps === "pedikuere") { $(ps === "manikuere" ? "#f-mani" : "#f-pedi", form).checked = true; }
    sync();
    var fwa = $(".f-wa", form), ffb = $(".f-fb", form);
    function collect() { var d = { lang: LANG, loc: val("loc"), svc: val("svc"), treat: sel.value, date: di.value, time: val("time"), name: cleanName($("#f-name", form).value) }; d.flex = d.time === "flex"; return d; }
    function problem(d) { if (!d.loc || !d.svc || !d.treat || !d.date || !d.time || !d.name) return (!d.time && d.loc && d.svc && d.treat && d.date && d.name) ? T[LANG].pickTime : T[LANG].fill; if (isClosed(d.date)) return T[LANG].closed; if (d.loc === "schwelm" && d.svc !== "pedikuere") return T[LANG].sOnly; return ""; }
    function refresh() {   /* href wird bei jeder Änderung synchron aktualisiert */
      var d = collect(), pr = problem(d);
      if (pr) { fwa.href = "https://wa.me/" + D.whatsapp; fwa.removeAttribute("target"); fwa.setAttribute("data-ready", "0"); ffb.hidden = true; form.removeAttribute("data-wa"); return null; }
      var url = buildWa(d); linkWa(fwa, url); fwa.setAttribute("data-ready", "1"); form.setAttribute("data-wa", url); err.textContent = ""; fallback(ffb, url); return url;
    }
    var sg = $("[data-slots]", form);
    slotsList().concat(["flex"]).forEach(function (tm, i) {
      var id = "f-t" + i, inp = el("input"), lab = el("label", tm === "flex" ? "flex" : "", tm === "flex" ? T[LANG].flex : tm);
      inp.type = "radio"; inp.name = "time"; inp.id = id; inp.value = tm; lab.htmlFor = id; sg.appendChild(inp); sg.appendChild(lab);
      inp.addEventListener("change", refresh);
    });
    ["input", "change"].forEach(function (ev) { form.addEventListener(ev, function () { setTimeout(refresh, 0); }); });
    form.addEventListener("change", function (e) { if (e.target.name === "loc" || e.target.name === "svc") refresh(); });
    fwa.addEventListener("click", function (e) {
      var url = refresh();
      if (!url) { e.preventDefault(); err.textContent = problem(collect()); }
      /* sonst: native Navigation über den echten Link */
    });
    form.addEventListener("submit", function (e) {   /* Enter-Taste */
      e.preventDefault(); var url = refresh();
      if (!url) { err.textContent = problem(collect()); return; }
      if (DESK) window.open(url, "_blank", "noopener"); else location.href = url;
    });
    refresh();
  }

  /* ---------- Mobile Schnellaktionsleiste ---------- */
  var bbar = $(".bbar");
  if (bbar) {
    var bChat = $(".bb-chat", bbar), bRoute = $(".bb-route", bbar), bPop = $(".bb-pop", bbar);
    function popClose() { bPop.hidden = true; bRoute.setAttribute("aria-expanded", "false"); }
    bChat.addEventListener("click", function (e) { e.stopPropagation(); popClose();
      if (window.MNchatOpen && window.MNchatOpen()) { if (window.MNcloseChat) window.MNcloseChat(); } else if (window.MNopenChat) window.MNopenChat(); });
    bRoute.addEventListener("click", function (e) { e.stopPropagation(); var o = bPop.hidden; bPop.hidden = !o; bRoute.setAttribute("aria-expanded", String(o)); if (o && window.MNcloseChat && window.MNchatOpen && window.MNchatOpen()) window.MNcloseChat(); });
    bPop.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", popClose);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") popClose(); });
  }
})();
