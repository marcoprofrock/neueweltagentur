/* Neue Welt Agentur — Interaktion */
(function () {
  "use strict";

  var doc = document;
  var header = doc.querySelector(".site-header");
  var overlay = doc.getElementById("menu");
  var toggle = doc.querySelector(".menu-toggle");
  var closeBtn = doc.querySelector(".menu-close");

  /* --------------------------------------------------------------------- *
   * Jahr im Footer
   * --------------------------------------------------------------------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------------------------------------------------- *
   * Menü-Overlay öffnen / schließen
   * --------------------------------------------------------------------- */
  function openMenu() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    doc.body.style.overflow = "hidden";
  }

  function closeMenu() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    doc.body.style.overflow = "";
  }

  if (toggle) toggle.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  // Klick auf einen Menüpunkt: schließen (Anker-Scroll übernimmt der Browser)
  overlay.querySelectorAll(".menu-nav a, .menu-meta a").forEach(function (a) {
    a.addEventListener("click", function () {
      // interne Anker sanft schließen; externe Links (html-Seiten) navigieren ohnehin
      closeMenu();
    });
  });

  // ESC schließt das Menü
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeMenu();
    }
  });

  /* --------------------------------------------------------------------- *
   * Header-Farbe je Sektion (IntersectionObserver)
   * Die Sektion, die gerade die Header-Zone kreuzt, bestimmt die Farbe.
   * --------------------------------------------------------------------- */
  var sections = doc.querySelectorAll("[data-color]");
  // nur echte Layout-Sektionen beobachten (nicht den Header selbst)
  var observed = Array.prototype.filter.call(sections, function (s) {
    return !s.classList.contains("site-header");
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var color = entry.target.getAttribute("data-color") || "rot";
            header.setAttribute("data-color", color);
          }
        });
      },
      // schmales Band direkt unter der Oberkante = Header-Höhe
      { rootMargin: "0px 0px -92% 0px", threshold: 0 }
    );
    observed.forEach(function (s) {
      io.observe(s);
    });
  }

  /* --------------------------------------------------------------------- *
   * Custom Cursor (nur bei präzisem Zeiger / Maus)
   * --------------------------------------------------------------------- */
  var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  var cursor = doc.querySelector(".cursor");

  if (fine && cursor) {
    doc.documentElement.classList.add("has-custom-cursor");

    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;

    window.addEventListener(
      "mousemove",
      function (e) {
        x = e.clientX;
        y = e.clientY;
        cursor.style.transform = "translate(" + x + "px," + y + "px)";
      },
      { passive: true }
    );

    // Über Links/Buttons: Kompass-Cursor
    var interactiveSel = "a, button, [role='button']";
    doc.addEventListener("mouseover", function (e) {
      if (e.target.closest(interactiveSel)) cursor.classList.add("is-link");
    });
    doc.addEventListener("mouseout", function (e) {
      if (e.target.closest(interactiveSel)) cursor.classList.remove("is-link");
    });

    // Cursor ausblenden, wenn das Fenster verlassen wird
    doc.addEventListener("mouseleave", function () {
      cursor.style.opacity = "0";
    });
    doc.addEventListener("mouseenter", function () {
      cursor.style.opacity = "1";
    });
  }
})();
