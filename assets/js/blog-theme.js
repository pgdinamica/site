/* Modo claro/escuro do blog. A escolha fica salva neste navegador. */
(function () {
  "use strict";
  var root = document.documentElement;
  var buttons = document.querySelectorAll("[data-theme-toggle]");
  function sync() {
    var dark = root.getAttribute("data-blog-theme") === "dark";
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(dark));
      b.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo escuro");
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-blog-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-blog-theme", next);
      try { localStorage.setItem("pd-blog-theme", next); } catch (e) { /* modo privado */ }
      sync();
    });
  });
  sync();
})();
