/* Misiats Nails – main.js (kein Tracking, keine Cookies, kein Speicher) */
(function () {
  "use strict";
  var D = window.MN, body = document.body;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var params = new URLSearchParams(location.search);
  var base = body.getAttribute("data-base") || "";

  /* ---------- Preise ---------- */
  function priceText(s, lang) {
    if (s.price == null) return { t: ({ de: "Preis folgt", en: "price tbc", uk: "ціна уточнюється" })[lang || "de"], tbc: true };
    return { t: (s.prefix || "") + (s.from ? (lang === "en" ? "from " : lang === "uk" ? "від " : "ab ") : "") + s.price + " €", tbc: false };
  }
  function photoEl(s) {
    var box = el("div", "ph-img");
    var img = document.createElement("img");
    img.loading = "lazy"; img.decoding = "async"; img.width = 720; img.height = 540;
    if (s.photo) {
      img.sizes = "(max-width:640px) 92vw, 380px";
      img.srcset = base + "photos/" + s.photo + "-720.webp 720w, " + base + "photos/" + s.photo + "-1440.webp 1440w";
      img.src = base + "photos/" + s.photo + "-720.webp";
      img.alt = s.alt || s.name;
    } else {
      img.src = base + "photos/platzhalter-foto-folgt.svg";
      img.alt = "Platzhalter – Foto für " + s.name + " folgt";
    }
    box.appendChild(img); return box;
  }
  $$("[data-prices]").forEach(function (ul) {
    var p = ul.getAttribute("data-prices").split(".");
    D.locations[p[0]].services[p[1]].forEach(function (s) {
      var li = el("li"); li.appendChild(el("span", "", s.name));
      var pt = priceText(s); li.appendChild(el("b", pt.tbc ? "tbc" : "", pt.t)); ul.appendChild(li);
    });
  });
  $$("[data-services]").forEach(function (wrap) {
    var p = wrap.getAttribute("data-services").split(".");
    D.locations[p[0]].services[p[1]].forEach(function (s) {
      var a = el("article", "svc-item"); a.appendChild(photoEl(s));
      var row = el("div", "row"); row.appendChild(el("h4", "", s.name));
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
    de: { hi: "Hallo! Ich helfe Ihnen, Ihre Terminanfrage für WhatsApp vorzubereiten. In welcher Sprache möchten Sie schreiben?",
          loc: "An welchem Standort möchten Sie Ihren Termin?", schwelmOnly: "In Schwelm bieten wir ausschließlich Pediküre an.",
          svc: "Maniküre oder Pediküre?", treat: "Welche Behandlung wünschen Sie?", date: "Wann hätten Sie gern Ihren Termin? (Wunsch – wir bestätigen persönlich)",
          name: "Wie ist Ihr Vorname?", namePh: "Vorname", ok: "Weiter", flex: "Ich bin flexibel",
          done: "Danke, {n}! Ihre Anfrage ist vorbereitet. Tippen Sie unten, um sie per WhatsApp zu senden. Ihr Termin wird persönlich per WhatsApp bestätigt.",
          wa: "Termin per WhatsApp anfragen", note: "Ihr Termin wird persönlich per WhatsApp bestätigt. Es wird nichts gespeichert – bitte keine Gesundheitsdaten angeben.",
          restart: "Neu beginnen", sub: "Assistent · Terminanfrage", mani: "Maniküre", pedi: "Pediküre",
          slots: ["Vormittag", "Mittag", "Nachmittag", "Abend"], pickDate: "Bitte ein Datum wählen.",
          msg: ["Hallo Misiats Nails, ich möchte gern einen Termin anfragen.", "Standort", "Behandlung", "Wunschtermin", "Name", "flexibel", "Bitte bestätigen Sie mir den Termin per WhatsApp. Danke!"] },
    en: { hi: "", loc: "Which location would you like to visit?", schwelmOnly: "Our Schwelm studio offers pedicures only.",
          svc: "Manicure or pedicure?", treat: "Which treatment would you like?", date: "When would you like your appointment? (preference – we confirm personally)",
          name: "What is your first name?", namePh: "First name", ok: "Next", flex: "I'm flexible",
          done: "Thank you, {n}! Your request is ready. Tap below to send it via WhatsApp. Your appointment will be confirmed personally via WhatsApp.",
          wa: "Request appointment via WhatsApp", note: "Your appointment is confirmed personally via WhatsApp. Nothing is stored – please do not share health information.",
          restart: "Start again", sub: "Assistant · Appointment request", mani: "Manicure", pedi: "Pedicure",
          slots: ["Morning", "Midday", "Afternoon", "Evening"], pickDate: "Please choose a date.",
          msg: ["Hello Misiats Nails, I would like to request an appointment.", "Location", "Treatment", "Preferred date", "Name", "flexible", "Please confirm the appointment via WhatsApp. Thank you!"] },
    uk: { hi: "", loc: "У якому салоні ви бажаєте записатися?", schwelmOnly: "У Швельмі ми пропонуємо лише педикюр.",
          svc: "Манікюр чи педикюр?", treat: "Яку процедуру ви бажаєте?", date: "Коли вам було б зручно? (побажання – ми підтвердимо особисто)",
          name: "Як вас звати (ім'я)?", namePh: "Ім'я", ok: "Далі", flex: "Мені підходить будь-коли",
          done: "Дякуємо, {n}! Ваш запит готовий. Натисніть нижче, щоб надіслати його у WhatsApp. Запис підтверджується особисто у WhatsApp.",
          wa: "Записатися через WhatsApp", note: "Запис підтверджується особисто у WhatsApp. Нічого не зберігається – будь ласка, не вказуйте дані про здоров'я.",
          restart: "Почати знову", sub: "Асистент · Запис", mani: "Манікюр", pedi: "Педикюр",
          slots: ["Зранку", "Опівдні", "Після обіду", "Увечері"], pickDate: "Будь ласка, оберіть дату.",
          msg: ["Добрий день, Misiats Nails! Я хочу записатися.", "Салон", "Процедура", "Бажаний час", "Ім'я", "будь-коли", "Будь ласка, підтвердьте запис у WhatsApp. Дякую!"] }
  };
  function fmtDate(iso) { if (!iso) return ""; var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function buildWa(d) {
    var t = T[d.lang || "de"], L = D.locations[d.loc];
    var svcName = (d.svc === "manikuere" ? T.de.mani : T.de.pedi);
    var when = d.flex ? t.msg[5] : [fmtDate(d.date), d.slot].filter(Boolean).join(", ");
    var m = [t.msg[0], "", t.msg[1] + ": " + L.name, t.msg[2] + ": " + (d.treat.indexOf(svcName) === 0 ? d.treat : svcName + " – " + d.treat), t.msg[3] + ": " + when, t.msg[4] + ": " + d.name, "", t.msg[6]].join("\n");
    return "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(m);
  }
  window.MNbuildWa = buildWa;
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
      if (url) { waBtn.href = url; waBtn.removeAttribute("aria-disabled"); waBtn.removeAttribute("tabindex"); }
      else { waBtn.href = "#"; waBtn.setAttribute("aria-disabled", "true"); waBtn.setAttribute("tabindex", "-1"); }
    }
    function uiLang() { waBtn.textContent = t().wa; noteEl.textContent = t().note; $(".chat-head small", panel).textContent = t().sub; restartBtn.textContent = t().restart; }
    var restartBtn = $(".chat-restart", panel);
    function start(preset) {
      st = { lang: "de" }; cb.textContent = ""; setWa(null); uiLang();
      bot(T.de.hi);
      chips([{ label: "Deutsch", value: "de" }, { label: "English", value: "en" }, { label: "Українська", value: "uk" }], function (v) {
        st.lang = v; uiLang();
        if (preset) { st.loc = preset[0]; afterLoc(preset[1]); } else askLoc();
      });
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
        var p = priceText(s, st.lang); return { label: s.name + (p.tbc ? "" : " · " + p.t), value: s.name };
      }), function (v) { st.treat = v; askDate(); });
    }
    function askDate() {
      bot(t().date);
      var row = el("div", "chat-in"), di = el("input"), sl = el("select"), ok = el("button", "", t().ok);
      di.type = "date"; di.min = today(); di.setAttribute("aria-label", "Datum");
      sl.setAttribute("aria-label", "Uhrzeit");
      t().slots.forEach(function (s) { var o = el("option", "", s); o.value = s; sl.appendChild(o); });
      ok.type = "button"; row.appendChild(di); row.appendChild(sl); row.appendChild(ok); cb.appendChild(row);
      var fx = el("div", "chips"), fb = el("button", "chip", t().flex); fb.type = "button"; fx.appendChild(fb); cb.appendChild(fx);
      cb.scrollTop = cb.scrollHeight;
      ok.addEventListener("click", function () {
        if (!di.value) { di.focus(); return bot(t().pickDate); }
        st.date = di.value; st.slot = sl.value; st.flex = false; row.remove(); fx.remove(); me(fmtDate(st.date) + ", " + st.slot); askName();
      });
      fb.addEventListener("click", function () { st.flex = true; row.remove(); fx.remove(); me(t().flex); askName(); });
    }
    function askName() {
      bot(t().name);
      var row = el("form", "chat-in"), ni = el("input"), ok = el("button", "", t().ok);
      ni.type = "text"; ni.maxLength = 30; ni.autocomplete = "given-name"; ni.placeholder = t().namePh; ni.setAttribute("aria-label", t().namePh); ni.required = true;
      ok.type = "submit"; row.appendChild(ni); row.appendChild(ok); cb.appendChild(row); cb.scrollTop = cb.scrollHeight; ni.focus({ preventScroll: true });
      row.addEventListener("submit", function (e) {
        e.preventDefault(); var n = cleanName(ni.value); if (!n) return ni.focus();
        st.name = n; row.remove(); me(n);
        bot(t().done.replace("{n}", n)); setWa(buildWa(st)); waBtn.focus({ preventScroll: true });
      });
    }
    function openChat(preset) { body.classList.add("chat-open"); fab.setAttribute("aria-expanded", "true"); if (preset || !st) start(preset); }
    function closeChat() { body.classList.remove("chat-open"); fab.setAttribute("aria-expanded", "false"); fab.focus(); }
    window.MNcloseChat = closeChat;
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
      var o0 = el("option", "", loc && svc ? "Bitte wählen" : "Erst Standort und Leistung wählen"); o0.value = ""; sel.appendChild(o0);
      if (loc && svc) D.locations[loc].services[svc].forEach(function (s) {
        var p = priceText(s), o = el("option", "", s.name + " – " + p.t); o.value = s.name; sel.appendChild(o);
      });
    }
    $$("input[type=radio]", form).forEach(function (r) { r.addEventListener("change", sync); });
    var pl = params.get("loc"), ps = params.get("svc");
    if (pl && D.locations[pl]) { $("#f-" + pl, form).checked = true; }
    if (ps === "manikuere" || ps === "pedikuere") { $(ps === "manikuere" ? "#f-mani" : "#f-pedi", form).checked = true; }
    sync();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = { lang: "de", loc: val("loc"), svc: val("svc"), treat: sel.value, date: di.value, slot: $("#f-slot", form).value, name: cleanName($("#f-name", form).value) };
      if (!d.loc || !d.svc || !d.treat || !d.date || !d.name) { err.textContent = "Bitte alle Felder ausfüllen."; return; }
      if (d.loc === "schwelm" && d.svc !== "pedikuere") { err.textContent = "In Schwelm nur Pediküre."; return; }
      err.textContent = ""; var url = buildWa(d); form.setAttribute("data-wa", url);
      window.open(url, "_blank", "noopener");
    });
  }
})();
