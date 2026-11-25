/* Página de vendas: contagem regressiva e troca automática quando a oferta termina.
 * [data-until="data"] some depois da data; [data-after="data"] aparece depois dela. */
(function () {
  "use strict";
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var pad = function (n) { return n < 10 ? "0" + n : String(n); };
  function tick() {
    var now = Date.now();
    all("[data-until]").forEach(function (e) { e.hidden = now > Date.parse(e.getAttribute("data-until")); });
    all("[data-after]").forEach(function (e) { e.hidden = now <= Date.parse(e.getAttribute("data-after")); });
    all("[data-countdown]").forEach(function (e) {
      var s = Math.max(0, Math.floor((Date.parse(e.getAttribute("data-countdown")) - now) / 1000));
      if (e.hasAttribute("data-boxes")) {
        var v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
        Array.prototype.forEach.call(e.querySelectorAll("b"), function (b, i) { b.textContent = pad(v[i]); });
        return;
      }
      e.textContent = Math.floor(s / 86400) + "d " + pad(Math.floor(s / 3600) % 24) + "h " + pad(Math.floor(s / 60) % 60) + "min " + pad(s % 60) + "s";
    });
  }
  tick();
  setInterval(tick, 1000);
})();
