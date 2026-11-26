/* ================================================================
   Misiats Nails – ALLE PREISE & KONTAKTDATEN AN EINER STELLE
   !!! Preise sind PLATZHALTER aus der alten Preisliste und müssen
   vor dem Livegang von der Inhaberin bestätigt werden. !!!
   name/en, alt/alt_en: deutscher / englischer Text
   price: Zahl in € (null = "Preis folgt"), from: true = "ab"
   prefix "+": Aufpreis (z. B. French +5 €)
   photo: Dateiname in /photos ohne Endung (null = Platzhalter)
   ================================================================ */
window.MN = {
  pricesConfirmed: false,
  whatsapp: "491726127991",
  /* Wunschuhrzeit-Auswahl (Chat + Formular). Öffnungszeiten noch NICHT bestätigt –
     hier anpassen: erste/letzte Uhrzeit, Abstand in Minuten, geschlossene Wochentage
     (0 = Sonntag, 1 = Montag … 6 = Samstag), z. B. closedDays: [0] */
  booking: { first: "10:00", last: "19:30", stepMin: 30, closedDays: [] },           // +49 172 6127991 (bestätigt 26.11.2026)
  locations: {
    langerfeld: {
      name: "Wuppertal-Langerfeld",
      address: "Spitzenstraße 30, 42389 Wuppertal",
      map: "https://www.google.com/maps/search/?api=1&query=Spitzenstra%C3%9Fe+30%2C+42389+Wuppertal",
      hours: null,                     // null = "Öffnungszeiten werden noch bestätigt"
      services: {
        manikuere: [
          { id: "mani",        name: "Maniküre", en: "Manicure",                  price: 30, photo: "langerfeld-17-blur", alt: "Gepflegte Hände mit rosa Nägeln", alt_en: "Well-groomed hands with pink nails" },
          { id: "mani-lack",   name: "Maniküre mit Nagellack", en: "Manicure with nail polish",    price: 35, photo: "g-crystal-s",        alt: "Hand mit pinkem Nagellack am Kristallglas", alt_en: "Hand with pink nail polish holding a crystal glass" },
          { id: "mani-gel",    name: "Maniküre mit Gel-Lack", en: "Manicure with gel polish",     price: 45, photo: "g-sage-s",           alt: "Nägel mit salbeigrünem Gel-Lack", alt_en: "Nails with sage green gel polish" },
          { id: "french",      name: "French", en: "French",                    price: 5, prefix: "+", photo: "g-french-s", alt: "Klassische French-Maniküre", alt_en: "Classic French manicure" },
          { id: "design",      name: "Nageldesign", en: "Nail design",               price: 1, from: true, photo: "hero-signature", alt: "Nude-Nägel mit feinem Blattdesign", alt_en: "Nude nails with a delicate leaf design" }
        ],
        pedikuere: [
          { id: "pedi",        name: "Pediküre", en: "Pedicure",                  price: 35, photo: "g-ped12-s", alt: "Gepflegte Füße mit weißem Nagellack", alt_en: "Well-groomed feet with white nail polish" },
          { id: "pedi-lack",   name: "Pediküre mit Nagellack", en: "Pedicure with nail polish",    price: 40, photo: null },
          { id: "pedi-gel",    name: "Pediküre mit Gel-Lack", en: "Pedicure with gel polish",     price: 45, photo: null },
          { id: "herren",      name: "Herren-Pediküre", en: "Men’s pedicure",           price: 40, photo: null }
        ]
      }
    },
    schwelm: {
      name: "Schwelm",
      address: "Wilhelmstraße 11, 58332 Schwelm",
      map: "https://www.google.com/maps/search/?api=1&query=Wilhelmstra%C3%9Fe+11%2C+58332+Schwelm",
      hours: null,
      services: {
        /* Schwelm: NUR Pediküre – Preise noch offen */
        pedikuere: [
          { id: "s-pedi",      name: "Pediküre", en: "Pedicure",                  price: null, photo: "schwelm-signature", alt: "Gepflegte Füße mit weißem Nagellack", alt_en: "Well-groomed feet with white nail polish" },
          { id: "s-pedi-lack", name: "Pediküre mit Nagellack", en: "Pedicure with nail polish",    price: null, photo: null },
          { id: "s-pedi-gel",  name: "Pediküre mit Gel-Lack", en: "Pedicure with gel polish",     price: null, photo: null },
          { id: "s-herren",    name: "Herren-Pediküre", en: "Men’s pedicure",           price: null, photo: null }
        ]
      }
    }
  }
};
