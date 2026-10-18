/* Leitura de posts: tamanho do texto (slider), barra de progresso e copiar link. */
(function () {
  "use strict";
  var KEY = "pd-reading-scale";
  var MIN = 0.85, MAX = 1.45;
  var root = document.documentElement;

  var read = function () { try { return parseFloat(localStorage.getItem(KEY)); } catch (e) { return NaN; } };
  var save = function (v) { try { localStorage.setItem(KEY, String(v)); } catch (e) { /* modo privado */ } };
  var clamp = function (v) { return Math.min(MAX, Math.max(MIN, v)); };

  /* Tamanho do texto: slider contínuo (salvo neste navegador). Duplo clique volta ao padrão. */
  var saved = read();
  var scale = isNaN(saved) ? 1 : clamp(saved);
  var slider = document.getElementById("readerSize");
  var apply = function () {
    root.style.setProperty("--reading-user", scale.toFixed(2));
    if (slider) {
      slider.value = scale;
      slider.setAttribute("aria-valuetext", Math.round(scale * 100) + "%");
      slider.style.setProperty("--fill", ((scale - MIN) / (MAX - MIN) * 100).toFixed(1) + "%");
    }
  };
  if (slider) {
    slider.addEventListener("input", function () { scale = clamp(parseFloat(slider.value)); apply(); });
    slider.addEventListener("change", function () { save(scale); });
    slider.addEventListener("dblclick", function () { scale = 1; apply(); save(scale); });
  }
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
