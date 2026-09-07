# Neue Welt Agentur — Website

Statische Website der Neue Welt Agentur. Reines HTML/CSS/Vanilla-JS, kein
Build-Schritt, gehostet über **GitHub Pages** unter `neueweltagentur.com`.

## Struktur

```
index.html            One-Pager (Hero · Manifesto · Team · Contact · Office)
oace.html             Case Study OACE — lebt weiter, ist aber aktuell
                      bewusst NICHT von der Startseite verlinkt (noindex)
impressum.html        Rechtliche Seite (noch Platzhalter!)
datenschutz.html      Rechtliche Seite (noch Platzhalter!)
team.html             Alt-URL, leitet auf index.html#team weiter
css/style.css         Design-System + Layout
js/i18n.js            Sprachumschaltung DE / ENG
js/main.js            Menü-Overlay, Header-Farbwechsel, Scroll-Wortmarke,
                      Custom-Cursor, Team-Bios
sitemap.xml           Startseite + Rechtsseiten
assets/
  svg/                Wortmarke, Kompass, Stern, Milan, Karte, Cursor
  img/                Team-Portraits, Hero, OACE-Showcases
  video/              Hero- und Work-Videos
  fonts/              EB Garamond (self-hosted, woff2)
```

## Sprachen (DE / ENG)

Das Markup ist die **deutsche Quelle**. `js/i18n.js` tauscht beim Umschalten
die Texte gegen das englische Wörterbuch aus:

| Attribut | Wirkung |
| --- | --- |
| `data-i18n="key"` | ersetzt den Textinhalt |
| `data-i18n-html="key"` | ersetzt `innerHTML` (Text mit Links/Markup) |
| `data-i18n-attr="alt:key\|aria-label:key"` | ersetzt beliebige Attribute |

- Beim ersten Besuch entscheidet die **Browsersprache** (Deutsch → DE, sonst
  ENG), danach gilt die zuletzt gewählte Sprache (`localStorage`).
- Direkt verlinkbar über `?lang=de` bzw. `?lang=en`.
- **Neuen Text ergänzen:** deutsches Original ins HTML schreiben, `data-i18n`
  mit neuem Key setzen, denselben Key im `DICT.en`-Block in `js/i18n.js`
  eintragen. Fehlt der Key, bleibt schlicht das Deutsche stehen.

## Work

Die drei Work-Kacheln sind aktuell **ausgeblendet** — Sektion, Menüpunkt und
Footer-Link sind aus `index.html` entfernt. Das CSS (`.work`, `.work-card`)
und die Videos liegen unverändert bereit; zum Reaktivieren die Sektion samt
Menü- und Footer-Eintrag wieder einsetzen (Reihenfolge der `.menu-item`s muss
weiterhin der Reihenfolge der `.menu-media__panel`s entsprechen) und in
`oace.html` das `noindex` entfernen.

## Design

- **Farben:** Rot `#ff2c3b`, Dunkel/Schwarz `#000`
- **Schrift:** EB Garamond (self-hosted); zentrierter Menüpunkt in Grotesk
- Wortmarke & Icons liegen als SVG vor und werden per CSS-`mask` eingefärbt,
  daher pro Sektion umschaltbar (Rot ↔ Dunkel).

## Offen vor dem Livegang

- **Impressum und Datenschutz sind Platzhalter** (`Musterstraße 1`). Für eine
  in Deutschland öffentlich erreichbare Website ist ein vollständiges
  Impressum nach § 5 DDG Pflicht.
- `hello@neueweltagentur.com` ist eingetragen, das Postfach existiert noch
  nicht.

## Lokal ansehen

```bash
python3 -m http.server 5751
# → http://localhost:5751
```

## Deployment

Push auf `main` → GitHub Pages baut automatisch. Live: `neueweltagentur.com`

## Schrift-Lizenz

EB Garamond steht unter der SIL Open Font License 1.1
(`assets/fonts/OFL.txt`).
