/* Neue Welt Agentur — Sprachumschaltung DE / ENG
 *
 * Kein Build-Schritt: Die Seite liegt auf Deutsch im HTML, dieses Skript
 * tauscht die Texte anhand von data-i18n-Attributen aus.
 *
 *   data-i18n="key"                  → textContent
 *   data-i18n-html="key"             → innerHTML (Text mit Markup)
 *   data-i18n-attr="attr:key|attr:key" → beliebige Attribute (alt, aria-label, content …)
 *
 * Das Skript laeuft synchron am Ende des <body> (also nach dem Parsen des
 * Markups, aber vor dem ersten Paint) — kein Aufblitzen der falschen Sprache.
 */
(function () {
  "use strict";

  var STORE = "nwa_lang";
  var DEFAULT = "de";

  var DICT = {
    en: {
      "meta.title": "Neue Welt Agentur — Brand Studio in Stuttgart",
      "meta.desc":
        "Neue Welt Agentur is a brand studio in Stuttgart. Our conviction: a brief has two clients — the company that pays and the people it reaches.",

      "nav.home": "Home",
      "nav.close": "Close",
      "nav.work": "Work",
      "nav.manifesto": "Manifesto",
      "nav.team": "Team",
      "nav.contact": "Contact",
      "nav.office": "Office",
      "nav.imprint": "Imprint",
      "nav.privacy": "Privacy",
      "nav.back": "Back",
      "nav.menuOpen": "Open menu",
      "nav.langLabel": "Choose language",
      "nav.footerAria": "Legal",
      "nav.homeAria": "Home",

      "work.title": "Work",
      "work.count": "Selected work",
      "work.oaceTag": "Brand Design",

      "manifesto.claim": "a brief has two clients.",
      "manifesto.p1":
        "the company that pays and the people it reaches. both should walk away with something. that only works when what a project gives to the public and its commercial interests are married in the same idea.",
      "manifesto.p2":
        "we work across disciplines: industrial design, graphic design, communication design. object, system and message are three tools to bring one idea to life.",
      "manifesto.p3":
        "so we work inside commercial briefs rather than outside of them. a media budget is the widest distribution channel a creative will ever be handed — we would rather aim it than refuse it.",

      "team.title": "Team",
      "team.intro": "Creatives & partners of Neue Welt Agentur",
      "team.role": "Partner",
      "team.bioDaryl": "Show Daryl Kastenholz's bio",
      "team.bioMarco": "Show Marco Pröfrock's bio",
      "team.bioDavid": "Show David Bosch's bio",
      "team.textDaryl":
        "Daryl spent years as Head of Design at OACE, where he was responsible for the brand's visual identity as well as several collections and the campaigns that carried them. For the past few years he has been working independently for renowned brands.",
      "team.textMarco":
        "Marco is a creative focused on concept, advertising and design. His work has been recognised with numerous international awards, among them Cannes Lions and the New York Type Directors Club. At just 25 he has collected more than 20 awards and is a member of The One Club for Creativity in New York and of the Institute of Creative Advertising and Design in Ireland.",
      "team.textDavid":
        "David started out as a self-taught designer focused on graphic design and fashion and shaped the OLAKALA brand strongly in its early years. He is co-founder of the streetwear brand BRUVERS — and a lifeguard.",

      "contact.label": "Contact",
      "contact.callAria": "Call +49 159 08323432",
      "contact.mailAria": "Write an e-mail to hello@marco.ad",

      "office.label": "Office",
      "office.route": "Get directions",
      "office.mapAria": "Rotebühlstraße 108, Stuttgart on Google Maps",
      "office.mapAlt":
        "Stylised map showing the location of Neue Welt Agentur at Rotebühlstraße 108 in Stuttgart",

      /* Projektseite OACE */
      "oace.metaTitle": "OACE — Neue Welt Agentur",
      "oace.metaDesc":
        "OACE branding — brand design for a holistic brand development. A project by Neue Welt Agentur.",
      "oace.eyebrow": "Work — Brand Design",
      "oace.subtitle": "Brand design for a holistic brand development",
      "oace.lead":
        "The OACE branding has taken shape dramatically over the past years. From a set of already working elements that laid a perfect foundation from the start, towards a system that grew clearer and more settled with every collection and every campaign. Earlier this year OACE let go of its original wordmark. The brand is growing up, and that is exactly what the new lettering reflects: it makes every touchpoint feel refined and premium. Combined with a clear language of colour and form, the result is a very clean look — legible, yet flexible. Extended by production concepts, the brand represents a new vibe each time without ever losing its own identity.",
      "oace.quote1":
        "“A clear design language, complemented by exceptional imagery, creates the perfect symbiosis in visual communication.”",
      "oace.quote2":
        "“Clear rules let measures be adapted both digitally and in physical space.”",
      "oace.alt1": "OACE — building the brand identity, showcase",
      "oace.alt2": "OACE — brand application, showcase",
      "oace.altBag": "OACE — branded bag",
      "oace.altSign": "OACE — store signage",
      "oace.altHangtag": "OACE — hangtag",
      "oace.altWeb": "OACE — digital presence",
      "oace.videoCampaign": "OACE — moving image, campaign",
      "oace.videoProduct": "OACE — moving image, product",
      "oace.navAria": "Project navigation",
      "oace.backWork": "← Back to Work",

      /* Rechtliche Seiten */
      "legal.imprintTitle": "Imprint — Neue Welt Agentur",
      "legal.imprintH1": "Imprint",
      "legal.imprintH2Info": "Information pursuant to § 5 DDG",
      "legal.imprintH2Contact": "Contact",
      "legal.imprintH2Resp": "Responsible for the content",
      "legal.imprintPhone": "Phone:",
      "legal.imprintMail": "E-mail:",
      "legal.note":
        "Placeholder — the complete details will be added before going live.",
      "legal.back": "← Back to the homepage",

      "legal.privacyTitle": "Privacy — Neue Welt Agentur",
      "legal.privacyH1": "Privacy",
      "legal.privacyH2Glance": "Privacy at a glance",
      "legal.privacyGlance":
        "This website is deliberately built lean: no cookies, no tracking, no analytics services. Fonts are served locally (no external font CDN).",
      "legal.privacyH2Hosting": "Hosting",
      "legal.privacyHosting":
        "The site is served via GitHub Pages (GitHub, Inc.). On access, technically necessary log data (e.g. IP address, timestamp, requested file) is processed server-side.",
      "legal.privacyH2Rights": "Your rights",
      "legal.privacyRights":
        "You have the right to information, correction, deletion and restriction of the processing of your personal data. To exercise it, please contact the address given in the <a href=\"impressum.html\">imprint</a>.",
      "legal.privacyNote":
        "Placeholder — the full privacy policy will be added before going live."
    }
  };

  var root = document.documentElement;

  function stored() {
    try {
      return localStorage.getItem(STORE);
    } catch (e) {
      return null;
    }
  }
  function remember(lang) {
    try {
      localStorage.setItem(STORE, lang);
    } catch (e) {}
  }

  function fromBrowser() {
    var list = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < list.length; i++) {
      var tag = String(list[i] || "").toLowerCase();
      if (tag.indexOf("de") === 0) return "de";
      if (tag.indexOf("en") === 0) return "en";
    }
    return "en"; // kein Deutsch in der Browserliste -> englische Fassung
  }

  function fromUrl() {
    var m = /[?&]lang=(de|en)\b/i.exec(location.search);
    return m ? m[1].toLowerCase() : null;
  }

  /* Deutsche Originaltexte einmalig sichern, damit beim Zurueckschalten
     nichts verloren geht (das HTML ist die DE-Quelle). */
  var nodes = [];
  function collect() {
    var els = document.querySelectorAll("[data-i18n], [data-i18n-html], [data-i18n-attr]");
    Array.prototype.forEach.call(els, function (el) {
      var entry = { el: el, attrs: [] };
      if (el.hasAttribute("data-i18n")) {
        entry.textKey = el.getAttribute("data-i18n");
        entry.textDe = el.textContent.replace(/\s+/g, " ").trim();
      }
      if (el.hasAttribute("data-i18n-html")) {
        entry.htmlKey = el.getAttribute("data-i18n-html");
        entry.htmlDe = el.innerHTML;
      }
      if (el.hasAttribute("data-i18n-attr")) {
        el.getAttribute("data-i18n-attr")
          .split("|")
          .forEach(function (pair) {
            var i = pair.indexOf(":");
            if (i < 0) return;
            var name = pair.slice(0, i).trim();
            var key = pair.slice(i + 1).trim();
            entry.attrs.push({ name: name, key: key, de: el.getAttribute(name) });
          });
      }
      nodes.push(entry);
    });
  }

  function apply(lang) {
    var dict = DICT[lang] || null; // null == Deutsch, also die Originalwerte
    nodes.forEach(function (n) {
      if (n.textKey) {
        var t = dict ? dict[n.textKey] : n.textDe;
        if (t != null) n.el.textContent = t;
      }
      if (n.htmlKey) {
        var h = dict ? dict[n.htmlKey] : n.htmlDe;
        if (h != null) n.el.innerHTML = h;
      }
      n.attrs.forEach(function (a) {
        var v = dict ? dict[a.key] : a.de;
        if (v != null) n.el.setAttribute(a.name, v);
      });
    });
    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);

    Array.prototype.forEach.call(
      document.querySelectorAll(".lang-switch__btn"),
      function (b) {
        var on = b.getAttribute("data-lang") === lang;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      }
    );
  }

  var current = fromUrl() || stored() || fromBrowser() || DEFAULT;
  collect();
  apply(current);
  if (fromUrl()) remember(current);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".lang-switch__btn");
    if (!btn) return;
    var lang = btn.getAttribute("data-lang");
    if (!lang || lang === current) return;
    current = lang;
    remember(lang);
    apply(lang);
  });

  /* Fuer andere Skripte (z. B. Debugging in der Konsole) */
  window.nwaSetLang = function (lang) {
    if (lang !== "de" && lang !== "en") return;
    current = lang;
    remember(lang);
    apply(lang);
  };
})();
