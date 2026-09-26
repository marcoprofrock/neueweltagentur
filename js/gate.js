/* Passwort-Gate (einfacher Zugangsschutz, clientseitig) */
(function () {
  var root = document.documentElement;
  var PASS = "dirtysouth";
  if (root.classList.contains("nwa-unlocked")) return;
  function init() {
    var gate = document.createElement("div");
    gate.className = "nwa-gate";
    gate.id = "nwa-gate";
    gate.innerHTML =
      '<form class="nwa-gate__form" id="nwa-gate-form">' +
      '<span class="nwa-gate__mark mask mask--kompass" aria-hidden="true"></span>' +
      '<label class="nwa-gate__label" for="nwa-pass">Neue Welt Agentur</label>' +
      '<input class="nwa-gate__input" id="nwa-pass" type="password" placeholder="Passwort" aria-label="Passwort" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />' +
      '<button class="nwa-gate__btn" type="submit">Eintreten</button>' +
      '<p class="nwa-gate__error" role="alert" hidden>Falsches Passwort</p>' +
      "</form>";
    document.body.insertBefore(gate, document.body.firstChild);
    var form = gate.querySelector("form");
    var input = gate.querySelector("input");
    var error = gate.querySelector(".nwa-gate__error");
    input.focus();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value === PASS) {
        try { localStorage.setItem("nwa_unlocked", PASS); } catch (e2) {}
        root.classList.add("nwa-unlocked");
      } else {
        error.hidden = false;
        gate.classList.remove("is-wrong");
        void gate.offsetWidth;
        gate.classList.add("is-wrong");
        input.value = "";
        input.focus();
      }
    });
  }
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
