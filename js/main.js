/* Neue Welt Agentur — Interaktion */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var header = doc.querySelector(".site-header");
  var overlay = doc.getElementById("menu");
  var closeBtn = doc.querySelector(".menu-close");
  // Menü wird auf der Landing-Page über den Kompass oben rechts geöffnet
  var opener = doc.querySelector(".header-kompass");
  var menuMarker = overlay ? overlay.querySelector(".menu-marker") : null;
  var menuKompass = overlay ? overlay.querySelector(".menu-kompass") : null;
  var menuIndex = overlay ? overlay.querySelector(".menu-index") : null;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------- *
   * Jahr im Footer
   * --------------------------------------------------------------------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------------------------------------------------- *
   * Passwort-Gate (einfacher Zugangsschutz, clientseitig)
   * --------------------------------------------------------------------- */
  (function () {
    var gate = doc.getElementById("nwa-gate");
    if (!gate || root.classList.contains("nwa-unlocked")) return;
    var form = doc.getElementById("nwa-gate-form");
    var input = doc.getElementById("nwa-pass");
    var error = doc.getElementById("nwa-gate-error");
    var PASS = "dirtysouth";

    if (input) input.focus();

    if (form)
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var val = (input && input.value) || "";
        if (val === PASS) {
          try {
            localStorage.setItem("nwa_unlocked", PASS);
          } catch (e2) {}
          root.classList.add("nwa-unlocked");
        } else {
          if (error) error.hidden = false;
          gate.classList.remove("is-wrong");
          void gate.offsetWidth; // Reflow → Shake erneut auslösen
          gate.classList.add("is-wrong");
          if (input) {
            input.value = "";
            input.focus();
          }
        }
      });
  })();

  /* --------------------------------------------------------------------- *
   * Menü-Overlay öffnen / schließen
   * --------------------------------------------------------------------- */
  /* Scroll-Menü: Eintrag in der Mitte am größten (Grotesk), Rest Garamond */
  var scroller = overlay ? overlay.querySelector(".menu-scroller") : null;
  var menuItems = scroller ? scroller.querySelectorAll(".menu-item") : [];
  var menuRaf = null;
  var kompassDeg = 0;
  var lastScrollTop = 0;

  function menuUpdate() {
    menuRaf = null;
    if (!scroller) return;
    var rect = scroller.getBoundingClientRect();
    if (rect.height < 1) return;
    var center = rect.top + rect.height / 2;
    var best = null;
    var bestD = Infinity;
    var bestIndex = 0;
    menuItems.forEach(function (it, i) {
      var r = it.getBoundingClientRect();
      var c = r.top + r.height / 2;
      var d = Math.abs(c - center);
      var norm = Math.min(d / (rect.height / 2), 1);
      it.style.transform = "scale(" + (1 - 0.4 * norm).toFixed(3) + ")";
      it.style.opacity = (1 - 0.62 * norm).toFixed(3);
      if (d < bestD) {
        bestD = d;
        best = it;
        bestIndex = i;
      }
    });
    menuItems.forEach(function (it) {
      it.classList.toggle("is-center", it === best);
    });

    // Marker (Zähler + Kompass) auf die Mitte setzen
    if (menuMarker) menuMarker.style.top = Math.round(center) + "px";
    // Abschnitts-Zähler 01, 02, 03 …
    if (menuIndex) {
      var num = bestIndex + 1;
      menuIndex.textContent = (num < 10 ? "0" : "") + num;
    }
    // Kompass dreht mit der Scroll-Richtung (runter = rechts rum, hoch = links)
    if (menuKompass) {
      var st = scroller.scrollTop;
      var delta = st - lastScrollTop;
      lastScrollTop = st;
      kompassDeg += delta * 0.6;
      menuKompass.style.transform = "rotate(" + kompassDeg.toFixed(1) + "deg)";
    }
  }
  function menuSchedule() {
    if (menuRaf === null && window.requestAnimationFrame)
      menuRaf = window.requestAnimationFrame(menuUpdate);
    else if (!window.requestAnimationFrame) menuUpdate();
  }
  if (scroller) {
    scroller.addEventListener("scroll", menuSchedule, { passive: true });
    window.addEventListener("resize", menuSchedule);
  }

  function openMenu() {
    if (!overlay) return;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    if (opener && opener.tagName === "BUTTON")
      opener.setAttribute("aria-expanded", "true");
    doc.body.style.overflow = "hidden";
    // Menü mittig ausrichten und Skalierung initialisieren
    if (scroller) {
      var mid = menuItems[Math.floor(menuItems.length / 2)];
      if (mid) mid.scrollIntoView({ block: "center" });
      lastScrollTop = scroller.scrollTop;
      menuUpdate();
    }
  }

  function closeMenu() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    if (opener && opener.tagName === "BUTTON")
      opener.setAttribute("aria-expanded", "false");
    doc.body.style.overflow = "";
  }

  // Öffner ist der Kompass oben rechts (nur auf der Landing-Page ein Button;
  // auf Unterseiten ein Link zur Startseite → dann kein Menü).
  if (opener && opener.tagName === "BUTTON")
    opener.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  if (overlay) {
    overlay
      .querySelectorAll(".menu-scroller a, .menu-meta a")
      .forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open"))
        closeMenu();
    });
  }

  /* --------------------------------------------------------------------- *
   * Header-Farbe je Sektion (IntersectionObserver)
   * --------------------------------------------------------------------- */
  var sections = doc.querySelectorAll("[data-color]");
  var observed = Array.prototype.filter.call(sections, function (s) {
    return !s.classList.contains("site-header");
  });

  if (header && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var color = entry.target.getAttribute("data-color") || "rot";
            header.setAttribute("data-color", color);
          }
        });
      },
      { rootMargin: "0px 0px -92% 0px", threshold: 0 }
    );
    observed.forEach(function (s) {
      io.observe(s);
    });
  }

  /* --------------------------------------------------------------------- *
   * Work-Videos: zuverlässig stumm abspielen, sobald im Viewport
   * (verhindert den nativen Play-Button, wenn Autoplay geblockt wird)
   * --------------------------------------------------------------------- */
  (function () {
    var vids = doc.querySelectorAll(
      ".work-card__video, .project__video video, .project__intro-bg"
    );
    if (!vids.length) return;

    function play(v) {
      if (!v._want) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }

    Array.prototype.forEach.call(vids, function (v) {
      // muted als Property (nicht nur Attribut) → erlaubt Autoplay überall
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.removeAttribute("controls");
      v._want = false;
      // Wird das Video vom Browser (Stromsparen o. ä.) ungewollt pausiert,
      // während es im Bild sein soll → sofort wieder starten.
      v.addEventListener("pause", function () {
        if (v._want) window.requestAnimationFrame(function () { play(v); });
      });
      v.addEventListener("canplay", function () { play(v); });
    });

    if ("IntersectionObserver" in window) {
      var vio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            var v = e.target;
            v._want = e.isIntersecting;
            if (e.isIntersecting) play(v);
            else v.pause();
          });
        },
        { threshold: 0.15 }
      );
      Array.prototype.forEach.call(vids, function (v) {
        vio.observe(v);
      });
    } else {
      Array.prototype.forEach.call(vids, function (v) {
        v._want = true;
        play(v);
      });
    }

    // Falls der Tab wieder aktiv wird, sichtbare Videos weiterlaufen lassen
    doc.addEventListener("visibilitychange", function () {
      if (!doc.hidden)
        Array.prototype.forEach.call(vids, function (v) {
          if (v._want) play(v);
        });
    });

    // Fallback: bei erster Nutzer-Interaktion nachstarten (sehr strikte Policies)
    var kick = function () {
      Array.prototype.forEach.call(vids, function (v) {
        if (v._want && v.paused) play(v);
      });
      doc.removeEventListener("pointerdown", kick);
      doc.removeEventListener("touchstart", kick);
    };
    doc.addEventListener("pointerdown", kick, { passive: true });
    doc.addEventListener("touchstart", kick, { passive: true });
  })();

  /* --------------------------------------------------------------------- *
   * Custom Cursor — rAF-geführt, kein CSS-Transform-Transition (kein Lag)
   * --------------------------------------------------------------------- */
  (function () {
    var fine =
      window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    var cursor = doc.querySelector(".cursor");
    if (!fine || !cursor) return;

    root.classList.add("has-custom-cursor");

    var px = window.innerWidth / 2;
    var py = window.innerHeight / 2;
    var raf = null;
    var seen = false;

    function render() {
      raf = null;
      // ganzzahlig runden → keine Subpixel-Zittern
      cursor.style.transform =
        "translate3d(" + Math.round(px) + "px," + Math.round(py) + "px,0)";
    }
    function schedule() {
      if (raf === null) raf = window.requestAnimationFrame(render);
    }

    window.addEventListener(
      "mousemove",
      function (e) {
        px = e.clientX;
        py = e.clientY;
        if (!seen) {
          seen = true;
          cursor.classList.add("is-visible");
        }
        schedule();
      },
      { passive: true }
    );

    // Über Links/Buttons: Kompass-Cursor
    var interactiveSel = "a, button, [role='button']";
    doc.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(interactiveSel))
        cursor.classList.add("is-link");
    });
    doc.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(interactiveSel))
        cursor.classList.remove("is-link");
    });

    // Sichtbarkeit beim Verlassen/Betreten des Fensters
    doc.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-visible");
    });
    doc.addEventListener("mouseenter", function () {
      if (seen) cursor.classList.add("is-visible");
    });

    // Wenn ein natives Element (input/textarea) den Zeiger braucht,
    // blenden wir den Custom-Cursor aus.
    doc.addEventListener("mouseover", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest("input, textarea, select, [contenteditable]"))
        cursor.classList.add("is-text");
    });
    doc.addEventListener("mouseout", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest("input, textarea, select, [contenteditable]"))
        cursor.classList.remove("is-text");
    });
  })();

  /* --------------------------------------------------------------------- *
   * Hero-Wortmarke: beim Scrollen fixiert, wird nur kleiner ("Zoom"),
   * Farb-Cut an der Grenze Bild → rote Fläche (oben rot, unten dunkel),
   * parkt über dem Manifesto-Text.
   * --------------------------------------------------------------------- */
  (function () {
    var markOverlay = doc.querySelector(".mark-overlay");
    var manifesto = doc.getElementById("manifesto");
    var manifestoMark = manifesto
      ? manifesto.querySelector(".manifesto__wortmarke")
      : null;
    var heroMark = doc.querySelector(".hero__wortmarke--1z");
    if (!markOverlay || !manifesto || !manifestoMark || !heroMark) return;

    var layerRot = markOverlay.querySelector(".mark-overlay__layer--rot");
    var layerDun = markOverlay.querySelector(".mark-overlay__layer--dunkel");
    var WM_RATIO = 221.62 / 1838.26; // Höhe / Breite der Wortmarke

    var enabled = false;
    var m = null; // gemessene Kennwerte
    var raf = null;

    function vpW() {
      return window.innerWidth || root.clientWidth || 0;
    }
    function vpH() {
      return window.innerHeight || root.clientHeight || 0;
    }

    function canEnable() {
      return (
        !reduceMotion &&
        window.matchMedia("(min-width: 769px)").matches &&
        vpH() > 480
      );
    }

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function measure() {
      var vw = vpW();
      var vh = vpH();
      var scrollY = window.pageYOffset;

      var mfTop = manifesto.getBoundingClientRect().top + scrollY; // Doc-Y der roten Fläche
      if (mfTop < 1) mfTop = vh; // Sicherheitsnetz

      // Start = natürliche Hero-Wortmarke (Position UND Größe).
      // Der Hero liegt am Dokumentanfang → Doc-Y == Screen-Y bei Scroll 0.
      var hr = heroMark.getBoundingClientRect();
      var startWidth = hr.width;
      var anchorCenter = hr.top + scrollY + hr.height / 2; // hier bleibt sie stehen

      // Ziel = Manifesto-Wortmarke; ihre Mitte wird per Margin exakt auf den
      // Anker geschoben, sobald die rote Fläche oben anliegt → nahtloser Cut.
      manifestoMark.style.marginTop = "";
      var mr = manifestoMark.getBoundingClientRect();
      var endWidth = mr.width;
      var endHeight = endWidth * WM_RATIO;
      var curCenterDoc = mr.top + scrollY + endHeight / 2;
      var delta = mfTop + anchorCenter - curCenterDoc;
      manifestoMark.style.marginTop = Math.round(delta) + "px";

      m = {
        vw: vw,
        vh: vh,
        mfTop: mfTop,
        anchorCenter: anchorCenter,
        startWidth: startWidth,
        startHeight: startWidth * WM_RATIO,
        endWidth: endWidth,
        endHeight: endHeight,
      };
    }

    function update() {
      raf = null;
      if (!enabled || !m) return;

      var scrollY = window.pageYOffset;
      var p = m.mfTop > 0 ? scrollY / m.mfTop : 1;
      if (p < 0) p = 0;
      if (p > 1) p = 1;

      // Nach Abschluss: statische Manifesto-Wortmarke übernimmt nahtlos
      if (p >= 1) {
        markOverlay.style.display = "none";
        manifestoMark.style.visibility = "";
        return;
      }
      markOverlay.style.display = "block";
      manifestoMark.style.visibility = "hidden";

      var e = easeInOut(p);
      var w = m.startWidth + (m.endWidth - m.startWidth) * e;
      var h = w * WM_RATIO;
      var top = m.anchorCenter - h / 2; // Mitte bleibt fix → "bewegt sich nicht"
      var left = (m.vw - w) / 2;

      markOverlay.style.width = w + "px";
      markOverlay.style.height = h + "px";
      markOverlay.style.transform =
        "translate3d(" + Math.round(left) + "px," + Math.round(top) + "px,0)";

      // Farb-Cut: Oberkante der roten Fläche im Viewport
      var splitView = m.mfTop - scrollY;
      var splitWithin = splitView - top;
      if (splitWithin < 0) splitWithin = 0;
      if (splitWithin > h) splitWithin = h;

      // oberhalb der Grenze (über dem Bild) → rot
      layerRot.style.clipPath =
        "inset(0 0 " + (h - splitWithin) + "px 0)";
      // unterhalb der Grenze (über der roten Fläche) → dunkel
      layerDun.style.clipPath = "inset(" + splitWithin + "px 0 0 0)";
    }

    function schedule() {
      if (raf === null) raf = window.requestAnimationFrame(update);
    }

    function enable() {
      enabled = true;
      root.classList.add("has-mark-scroll");
      measure();
      update();
    }
    function disable() {
      enabled = false;
      root.classList.remove("has-mark-scroll");
      markOverlay.style.display = "none";
      markOverlay.removeAttribute("style");
      markOverlay.style.display = "none";
      manifestoMark.style.visibility = "";
      manifestoMark.style.marginTop = "";
    }

    function evaluate() {
      if (canEnable()) {
        if (!enabled) enable();
        else {
          measure();
          update();
        }
      } else if (enabled) {
        disable();
      }
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", function () {
      evaluate();
    });
    window.addEventListener("load", evaluate);
    // Fonts können die Wortmarken-Größe verschieben → neu vermessen
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(evaluate);

    evaluate();
  })();

  /* --------------------------------------------------------------------- *
   * Team-Bios: per +-Button ein-/ausklappen (Progressive Enhancement)
   * --------------------------------------------------------------------- */
  (function () {
    var cards = doc.querySelectorAll(".team-card");
    Array.prototype.forEach.call(cards, function (card) {
      var btn = card.querySelector(".team-card__toggle");
      if (!btn) return;
      card.classList.add("is-collapsible"); // erst ab hier eingeklappt (kein JS = offen)
      btn.addEventListener("click", function () {
        var open = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  })();

  /* --------------------------------------------------------------------- *
   * Milan (Scroll-Hinweis): beim Runterscrollen nach oben fliegen + ausfaden
   * --------------------------------------------------------------------- */
  (function () {
    var scrollEl = doc.querySelector(".hero__scroll");
    var hero = doc.querySelector(".hero");
    if (!scrollEl || !hero) return;
    var raf = null;

    function upd() {
      raf = null;
      var h = hero.offsetHeight || window.innerHeight || 1;
      var q = window.pageYOffset / (h * 0.5); // über die erste halbe Hero-Höhe
      if (q < 0) q = 0;
      if (q > 1) q = 1;
      // fliegt weiter nach oben UND wird grösser, während er ausfadet
      var y = -q * 300; // Flughöhe
      var s = 1 + q * 1.6; // wächst bis ~2.6x
      scrollEl.style.transform =
        "translate(-50%," + y.toFixed(1) + "px) scale(" + s.toFixed(3) + ")";
      scrollEl.style.opacity = (1 - q).toFixed(3);
    }
    function sched() {
      if (raf === null) raf = window.requestAnimationFrame(upd);
    }
    window.addEventListener("scroll", sched, { passive: true });
    window.addEventListener("resize", sched);
    upd();
  })();
})();
