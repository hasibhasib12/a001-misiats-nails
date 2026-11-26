/* ================================================================
   Misiats Nails – ALLE PREISE & KONTAKTDATEN AN EINER STELLE
   !!! Preise sind PLATZHALTER aus der alten Preisliste und müssen
   vor dem Livegang von der Inhaberin bestätigt werden. !!!
   price: Zahl in € (null = "Preis folgt"), from: true = "ab"
   prefix "+": Aufpreis (z. B. French +5 €)
   photo: Dateiname in /photos ohne Endung (null = Platzhalter)
   ================================================================ */
window.MN = {
  pricesConfirmed: false,
  whatsapp: "491726127991",           // +49 172 6127991 (bestätigt 26.11.2026)
  locations: {
    langerfeld: {
      name: "Wuppertal-Langerfeld",
      address: "Spitzenstraße 30, 42389 Wuppertal",
      map: "https://www.google.com/maps/search/?api=1&query=Spitzenstra%C3%9Fe+30%2C+42389+Wuppertal",
      hours: null,                     // null = "Öffnungszeiten werden noch bestätigt"
      services: {
        manikuere: [
          { id: "mani",        name: "Maniküre",                  price: 30, photo: "langerfeld-17-blur", alt: "Gepflegte Hände mit rosa Nägeln" },
          { id: "mani-lack",   name: "Maniküre mit Nagellack",    price: 35, photo: "g-crystal-s",        alt: "Hand mit pinkem Nagellack am Kristallglas" },
          { id: "mani-gel",    name: "Maniküre mit Gel-Lack",     price: 45, photo: "g-sage-s",           alt: "Nägel mit salbeigrünem Gel-Lack" },
          { id: "french",      name: "French",                    price: 5, prefix: "+", photo: "g-french-s", alt: "Klassische French-Maniküre" },
          { id: "design",      name: "Nageldesign",               price: 1, from: true, photo: "hero-signature", alt: "Nude-Nägel mit feinem Blattdesign" }
        ],
        pedikuere: [
          { id: "pedi",        name: "Pediküre",                  price: 35, photo: "g-ped12-s", alt: "Gepflegte Füße mit weißem Nagellack" },
          { id: "pedi-lack",   name: "Pediküre mit Nagellack",    price: 40, photo: null },
          { id: "pedi-gel",    name: "Pediküre mit Gel-Lack",     price: 45, photo: null },
          { id: "herren",      name: "Herren-Pediküre",           price: 40, photo: null }
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
          { id: "s-pedi",      name: "Pediküre",                  price: null, photo: "schwelm-signature", alt: "Gepflegte Füße mit weißem Nagellack" },
          { id: "s-pedi-lack", name: "Pediküre mit Nagellack",    price: null, photo: null },
          { id: "s-pedi-gel",  name: "Pediküre mit Gel-Lack",     price: null, photo: null },
          { id: "s-herren",    name: "Herren-Pediküre",           price: null, photo: null }
        ]
      }
    }
  }
};
