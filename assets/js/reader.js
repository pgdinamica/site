/* Leitura de posts: tamanho do texto (A−/A/A+), barra de progresso e copiar link. */
(function () {
  "use strict";
  var KEY = "pd-reading-scale";
  var STEPS = [0.88, 1, 1.12, 1.26, 1.42];
  var root = document.documentElement;

  var read = function () { try { return parseFloat(localStorage.getItem(KEY)); } catch (e) { return NaN; } };
  var save = function (v) { try { localStorage.setItem(KEY, String(v)); } catch (e) { /* modo privado */ } };

  var scale = STEPS.indexOf(read()) >= 0 ? read() : 1;
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-font]"));
  var apply = function () {
    root.style.setProperty("--reading-scale", scale);
    var i = STEPS.indexOf(scale);
    buttons.forEach(function (b) {
      var d = parseInt(b.getAttribute("data-font"), 10);
      if (d === 0) b.classList.toggle("is-active", scale === 1);
      if (d === -1) b.disabled = i <= 0;
      if (d === 1) b.disabled = i >= STEPS.length - 1;
    });
  };
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var d = parseInt(b.getAttribute("data-font"), 10);
      var i = STEPS.indexOf(scale);
      scale = d === 0 ? 1 : STEPS[Math.max(0, Math.min(STEPS.length - 1, i + d))];
      save(scale);
      apply();
    });
  });
  apply();

  /* Barra de progresso de leitura */
  var bar = document.getElementById("readingBar");
  var prose = document.getElementById("prose");
  if (bar && prose) {
    var tick = function () {
      var r = prose.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      bar.style.width = (p * 100).toFixed(1) + "%";
    };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();
  }

  /* Copiar link */
  var copy = document.querySelector('[data-share="copy"]');
  if (copy) {
    copy.addEventListener("click", function () {
      var done = function () {
        copy.classList.add("is-copied");
        copy.setAttribute("aria-label", "Link copiado!");
        setTimeout(function () { copy.classList.remove("is-copied"); copy.setAttribute("aria-label", "Copiar link do texto"); }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () {});
    });
  }
})();
