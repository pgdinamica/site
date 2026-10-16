/* Carrosséis horizontais da vitrine: botões anterior/próximo. */
(function () {
  "use strict";
  document.querySelectorAll(".carousel-btn").forEach(function (btn) {
    var track = document.getElementById(btn.getAttribute("data-target"));
    if (!track) return;
    var update = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      document.querySelectorAll('[data-target="' + track.id + '"]').forEach(function (b) {
        b.disabled = b.getAttribute("data-dir") === "-1" ? track.scrollLeft <= 2 : track.scrollLeft >= max;
      });
    };
    btn.addEventListener("click", function () {
      var item = track.querySelector("li");
      var step = item ? item.getBoundingClientRect().width + 18 : track.clientWidth * 0.8;
      track.scrollBy({ left: step * parseInt(btn.getAttribute("data-dir"), 10), behavior: "smooth" });
    });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
})();
