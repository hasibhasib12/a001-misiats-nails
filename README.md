# Misiats Nails – statische Website

Reines HTML/CSS/Vanilla-JS. Kein Framework, kein Server, keine Datenbank, keine Cookies, kein Tracking,
keine externen Schriften/Skripte/Einbettungen. Läuft direkt auf GitHub Pages oder Netlify.

## Struktur
```
index.html  langerfeld.html  schwelm.html  leistungen.html  galerie.html  kontakt.html
impressum.html  datenschutz.html (nur Deutsch, Platzhalter)  404.html
en/ (englische Fassung aller 6 Hauptseiten)
css/styles.css   js/prices.js (alle Preise + Kontaktdaten)   js/main.js (Menü, Chat, Formular, Galerie)
fonts/ (Cormorant Garamond, Jost – selbst gehostet)   assets/misiats-nails-logo.png   photos/
sitemap.xml  robots.txt  .nojekyll
```

## Preise ändern
Nur `js/prices.js` bearbeiten. `price: 35` = 35 €, `price: null` = „Preis folgt“, `from: true` = „ab“,
`prefix: "+"` = Aufpreis. Alle Seiten, der Chat-Assistent und das Formular lesen die Preise von dort.
**Alle Preise sind Platzhalter aus der alten Preisliste und müssen vor dem Livegang bestätigt werden.**
Schwelm hat noch keine Preise (alle „Preis folgt“).

## WhatsApp-Nummer ändern
In `js/prices.js`: `whatsapp: "491726127991"` (internationales Format, ohne + und Leerzeichen).

## Adressen / Öffnungszeiten
Adressen und Karten-Links stehen in `js/prices.js`. Öffnungszeiten sind noch Platzhalter
(„[Öffnungszeiten folgen]“) direkt in `langerfeld.html`, `schwelm.html` und `kontakt.html`.

## Fotos ändern
Fotos liegen in `photos/` als JPG (Original) plus `-720.webp` und `-1440.webp`.
Neues Foto: JPG ablegen, WebP-Versionen in 720 px und 1440 px Breite erzeugen, Dateinamen (ohne Endung)
in `js/prices.js` bei `photo:` eintragen. `photo: null` zeigt `photos/platzhalter-foto-folgt.svg`.

## Bildnachweis
Startseiten-Hero: Foto von Valeria Boltneva, Pexels (https://www.pexels.com/photo/hand-holding-flowers-12982840/), Pexels License. Stockfoto, keine eigene Arbeit des Studios. Das alte Hero-Foto (`photos/hero-signature*`) liegt weiterhin im Ordner.

## Chat-Assistent & Buchungsformular
Geführte Fragen: Sprache (DE/EN/UA) → Standort → Leistung (Schwelm: nur Pediküre) → Behandlung →
Wunschtermin → Vorname. Danach öffnet sich `https://wa.me/<Nummer>?text=…` mit vorbereiteter Nachricht.
Nichts wird gespeichert oder an einen Server gesendet. Keine E-Mail, keine Telefonnummer, keine Gesundheitsdaten.
Termine werden ausschließlich persönlich per WhatsApp bestätigt.

## Noch benötigt (vor Livegang)
- Bestätigung aller Preise (Langerfeld) und Preise für Schwelm
- Öffnungszeiten beider Standorte
- Impressum- und Datenschutztext nach rechtlicher Prüfung (aktuell „[Text folgt nach rechtlicher Prüfung]“)
- Fotos für: Pediküre mit Nagellack, Pediküre mit Gel-Lack, Herren-Pediküre (beide Standorte)
- Bestätigung der Bildrechte/Einwilligungen für alle Fotos; Zuordnung Foto ↔ Behandlung prüfen
- Echte Domain (aktuell Platzhalter `https://www.misiats-nails.de/` in sitemap.xml, robots.txt, og:image)
- Englische und ukrainische Seiten (`/en/`, `/uk/`) – aktuell nur Hinweis „folgt“

## Veröffentlichen auf GitHub Pages
1. Repository auf GitHub anlegen und diese Dateien hochladen (bzw. `git push`).
2. Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
3. Optional eigene Domain unter Settings → Pages → Custom domain eintragen.
Lokal testen: `python3 -m http.server` im Ordner starten und http://localhost:8000 öffnen.

## Sprachen
Deutsch (Hauptsprache, Wurzelverzeichnis) und Englisch (`en/`). Die Seiten werden mit dem Generator `gen.py` (Build-Notizen) erzeugt;
Texte stehen dort in den Wörterbüchern `UI` und `TX`, Behandlungsnamen auf Englisch in `js/prices.js` (`en`, `alt_en`).
Cache-Busting: Version `?v=` für CSS/JS in `gen.py` (`V`) erhöhen.
SITE-URL (canonical, hreflang, sitemap) ist aktuell die GitHub-Pages-Adresse – bei eigener Domain in `gen.py` ändern.
