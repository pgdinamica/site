/* Slider de fotos (topo da página de palestras).
 * Troca sozinho a cada 6 s; pausa com o mouse em cima, com foco no teclado ou com a aba oculta.
 * Respeita "reduzir movimento": nesse caso só troca quando a pessoa pede. */
(function () {
  "use strict";
  document.querySelectorAll("[data-slider]").forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".talks-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".slider-dots button"));
    if (slides.length < 2) return;
    var current = 0, timer = null, paused = false;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === current;
        s.classList.toggle("is-active", on);
        if (on) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true");
        var img = s.querySelector("img");
        if (on && img.loading === "lazy") img.loading = "eager";
      });
      dots.forEach(function (d, n) {
        if (n === current) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
    }
    function start() {
      clearInterval(timer);
      if (!still && !paused) timer = setInterval(function () { show(current + 1); }, 6000);
    }

    root.querySelectorAll("[data-slide]").forEach(function (b) {
      b.addEventListener("click", function () { show(current + parseInt(b.getAttribute("data-slide"), 10)); start(); });
    });
    dots.forEach(function (d) {
      d.addEventListener("click", function () { show(parseInt(d.getAttribute("data-to"), 10)); start(); });
    });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(current - 1); start(); }
      if (e.key === "ArrowRight") { show(current + 1); start(); }
    });
    // Arrastar para o lado no celular
    var x0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); start(); }
      x0 = null;
    });
    function pause(v) { paused = v; if (v) clearInterval(timer); else start(); }
    root.addEventListener("mouseenter", function () { pause(true); });
    root.addEventListener("mouseleave", function () { pause(false); });
    root.addEventListener("focusin", function () { pause(true); });
    root.addEventListener("focusout", function () { pause(false); });
    document.addEventListener("visibilitychange", function () { pause(document.hidden); });
    start();
  });
})();
