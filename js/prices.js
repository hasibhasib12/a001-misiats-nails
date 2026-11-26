/* ================================================================
   Misiats Nails – ALLE PREISE & KONTAKTDATEN AN EINER STELLE
   Preise = gedruckte Preisliste (Misiats-Nails-Preisliste-A5.pdf,
   Langerfeld + Schwelm), von der Inhaberin bestätigt am 26.11.2026 20:27.
   name/en, alt/alt_en: deutscher / englischer Text
   price: Zahl in € (null = "Preis folgt"), from: true = "ab"
   prefix "+": Aufpreis (z. B. French +5 €)
   photo: Dateiname in /photos ohne Endung (null = Platzhalter), dim: echte Maße (720er) → unbeschnitten
   card: Text-Karte neben dem Foto im Instagram-Stil (bg/ac aus der Fotopalette, Text NIE auf dem Foto)
   ================================================================ */
window.MN = {
  pricesConfirmed: true,
  whatsapp: "491726127991",
  /* Wunschuhrzeit-Auswahl (Chat + Formular). Öffnungszeiten bestätigt 26.11.2026:
     Mo–Sa 10:00–20:00, So geschlossen (beide Standorte). Hier anpassen: erste/letzte Uhrzeit, Abstand in Minuten, geschlossene Wochentage
     (0 = Sonntag, 1 = Montag … 6 = Samstag), z. B. closedDays: [0] */
  booking: { first: "10:00", last: "19:30", stepMin: 30, closedDays: [0] },           // +49 172 6127991 (bestätigt 26.11.2026)
  locations: {
    langerfeld: {
      name: "Wuppertal-Langerfeld",
      address: "Spitzenstraße 30, 42389 Wuppertal",
      map: "https://www.google.com/maps/search/?api=1&query=Spitzenstra%C3%9Fe+30%2C+42389+Wuppertal",
      hours: { de: "Mo–Sa 10:00–20:00, So geschlossen", en: "Mon–Sat 10:00–20:00, Sun closed" },
      services: {
        manikuere: [
          { id: "mani",        name: "Maniküre", en: "Manicure",                  price: 30, photo: "langerfeld-17-blur", alt: "Gepflegte Hände mit rosa Nägeln", alt_en: "Well-groomed hands with pink nails" },
          { id: "mani-lack",   name: "Maniküre mit Nagellack", en: "Manicure with nail polish",    price: 35, photo: "g-crystal-s",        alt: "Hand mit pinkem Nagellack am Kristallglas", alt_en: "Hand with pink nail polish holding a crystal glass" },
          { id: "mani-gel",    name: "Maniküre mit Gel-Lack", en: "Manicure with gel polish",     price: 45, photo: "g-sage-s",           alt: "Nägel mit salbeigrünem Gel-Lack", alt_en: "Nails with sage green gel polish" },
          { id: "french",      name: "French", en: "French",                    price: 5, prefix: "+", photo: "g-french-s", alt: "Klassische French-Maniküre", alt_en: "Classic French manicure" },
          { id: "design",      name: "Nageldesign", en: "Nail design",               price: 1, from: true, photo: "hero-signature", alt: "Nude-Nägel mit feinem Blattdesign", alt_en: "Nude nails with a delicate leaf design" }
        ],
        pedikuere: [
          { id: "pedi", name: "Pediküre", en: "Pedicure", price: 35, photo: "ped-red-reel", dim: [720, 875], alt: "Gepflegte Füße mit rotem Nagellack und kleinem Design", alt_en: "Well-groomed feet with red polish and a small design",
            card: { bg: "#1E0C0E", ac: "#E2574F", h: { de: "GEPFLEGTE", en: "CARED-FOR" }, s: { de: "Füße", en: "Feet" }, side: { de: "Pflege mit Gefühl", en: "Care with a gentle touch" } } },
          { id: "pedi-lack", name: "Pediküre mit Nagellack", en: "Pedicure with nail polish", price: 40, photo: "ped-white-wood", dim: [720, 1158], alt: "Pediküre mit weißem Nagellack auf Holzboden", alt_en: "Pedicure with white nail polish on a wooden floor",
            card: { bg: "#1C1916", ac: "#C9A27E", h: { de: "GLÄNZEND", en: "GLOSSY" }, s: { de: "Weiß", en: "White" }, side: { de: "Klassisch schön", en: "Classic beauty" } } },
          { id: "pedi-gel", name: "Pediküre mit Gel-Lack", en: "Pedicure with gel polish", price: 45, photo: "ped-brown", dim: [720, 1168], alt: "Pediküre mit schokobraunem Gel-Lack", alt_en: "Pedicure with chocolate brown gel polish",
            card: { bg: "#2B2523", ac: "#C99A86", h: { de: "LANGER", en: "LONG-" }, s: { de: "Halt", en: "lasting" }, side: { de: "Glanz für Wochen", en: "Shine for weeks" } } },
          { id: "herren",      name: "Herren-Pediküre", en: "Men’s pedicure",           price: 40, photo: null }
        ]
      }
    },
    schwelm: {
      name: "Schwelm",
      address: "Wilhelmstraße 11, 58332 Schwelm",
      map: "https://www.google.com/maps/search/?api=1&query=Wilhelmstra%C3%9Fe+11%2C+58332+Schwelm",
      hours: { de: "Mo–Sa 10:00–20:00, So geschlossen", en: "Mon–Sat 10:00–20:00, Sun closed" },
      services: {
        /* Schwelm: NUR Pediküre – Preise laut Druck-Preisliste Schwelm */
        pedikuere: [
          { id: "s-pedi", name: "Pediküre", en: "Pedicure", price: 35, photo: "ped-blue", dim: [720, 378], alt: "Gepflegte Füße mit dunkelblauem Nagellack", alt_en: "Well-groomed feet with dark blue nail polish",
            card: { bg: "#16212D", ac: "#8FA889", h: { de: "SAUBER", en: "CLEAN" }, s: { de: "Sicher", en: "Safe" }, side: { de: "In sicheren Händen", en: "In safe hands" } } },
          { id: "s-pedi-lack", name: "Pediküre mit Nagellack", en: "Pedicure with nail polish", price: 40, photo: "ped-red-denim", dim: [720, 1042], alt: "Pediküre mit rotem Nagellack", alt_en: "Pedicure with red nail polish",
            card: { bg: "#1A1A18", ac: "#E0503F", h: { de: "ZEITLOS", en: "TIMELESS" }, s: { de: "Rot", en: "Red" }, side: { de: "Rot geht immer", en: "Red always works" } } },
          { id: "s-pedi-gel", name: "Pediküre mit Gel-Lack", en: "Pedicure with gel polish", price: 45, photo: "ped-red-christmas", dim: [720, 1119], alt: "Pediküre mit rotem Gel-Lack im festlichen Weihnachtsambiente", alt_en: "Pedicure with red gel polish in a festive Christmas setting",
            card: { bg: "#2B3140", ac: "#E9BC8E", h: { de: "FESTLICH", en: "FESTIVE" }, s: { de: "Glanz", en: "Shine" }, side: { de: "Für die Feiertage", en: "For the holidays" } } },
          { id: "s-herren",    name: "Herren-Pediküre", en: "Men’s pedicure",           price: 40, photo: null }
        ]
      }
    }
  }
};
