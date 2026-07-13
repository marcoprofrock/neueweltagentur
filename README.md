# Neue Welt Agentur — Website

Statische Website der Neue Welt Agentur. Reines HTML/CSS/Vanilla-JS, kein
Build-Schritt, gehostet über **GitHub Pages**.

## Struktur

```
index.html            One-Pager (Hero · Manifesto · Work)
impressum.html        Rechtliche Seite (Platzhalter)
datenschutz.html      Rechtliche Seite (Platzhalter)
css/style.css         Design-System + Layout
js/main.js            Menü-Overlay, Header-Farbwechsel, Custom-Cursor
assets/
  svg/                Wortmarke, Kompass, Stern, NN-Monogramm, Cursor
  img/                S/W-Bilder (aktuell Platzhalter, Pexels)
  fonts/              EB Garamond (self-hosted, woff2)
```

## Design

- **Farben:** Rot `#ff2c3b`, Dunkel `#20201e`
- **Schrift:** EB Garamond (self-hosted); Menüpunkt „Work" in Helvetica Neue
- Wortmarke & Icons liegen als SVG vor und werden per CSS-`mask` eingefärbt,
  daher pro Sektion umschaltbar (Rot ↔ Dunkel).

## Bilder austauschen

Die grauen Flächen sind Platzhalter. Für echte Motive einfach die Dateien in
`assets/img/` ersetzen (gleiche Namen beibehalten) — S/W wird per CSS-Filter
erzwungen, Originale dürfen also farbig sein.

- `hero-1920.jpg` / `hero-1080.jpg` — Hero-Hintergrund
- `work-placeholder.jpg` — Work-Kacheln

## Lokal ansehen

```bash
python3 -m http.server 5738
# → http://localhost:5738
```

## Deployment

Push auf `main` → GitHub Pages baut automatisch.
Live: `https://<account>.github.io/neue-welt-agentur/`

## Schrift-Lizenz

EB Garamond steht unter der SIL Open Font License 1.1
(`assets/fonts/OFL.txt`).
