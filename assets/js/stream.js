/* Página de cursos: destaque rotativo, "continuar assistindo" e progresso das aulas.
 * O progresso vem do que a sala de estudo salva neste navegador (localStorage). */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var INTERVAL = 8000;

  /* ---------------- destaque rotativo ---------------- */
  var bb = document.getElementById("billboard");
  if (bb) {
    var slides = Array.prototype.slice.call(bb.querySelectorAll(".bb-slide"));
    var dots = Array.prototype.slice.call(bb.querySelectorAll(".bb-dot"));
    var current = 0, timer = null, paused = false;
    bb.style.setProperty("--bb-interval", INTERVAL / 1000 + "s");

    var show = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === current;
        s.hidden = !on;
        s.classList.toggle("is-active", on);
        var img = s.querySelector(".bb-art");
        if (on && img) img.loading = "eager";
      });
      dots.forEach(function (d, k) {
        d.setAttribute("aria-selected", String(k === current));
        // reinicia a animação da barrinha
        var bar = d.querySelector("span");
        bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
      });
    };
    var start = function () {
      if (reduceMotion || slides.length < 2) return;
      stop();
      bb.classList.add("is-playing");
      timer = setInterval(function () { if (!paused) show(current + 1); }, INTERVAL);
    };
    var stop = function () { clearInterval(timer); timer = null; };
    var setPaused = function (value) { paused = value; bb.classList.toggle("is-paused", value); };

    dots.forEach(function (d, k) {
      d.addEventListener("click", function () { show(k); start(); });
    });
    bb.addEventListener("mouseenter", function () { setPaused(true); });
    bb.addEventListener("mouseleave", function () { setPaused(false); });
    bb.addEventListener("focusin", function () { setPaused(true); });
    bb.addEventListener("focusout", function () { setPaused(false); });
    document.addEventListener("visibilitychange", function () { setPaused(document.hidden); });
    bb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { show(current + 1); start(); }
      if (e.key === "ArrowLeft") { show(current - 1); start(); }
    });
    start();
  }

  /* ---------------- progresso ---------------- */
  var dataEl = document.getElementById("streamData");
  if (!dataEl) return;
  var courses = JSON.parse(dataEl.textContent);
  var read = function (slug) {
    try { var p = JSON.parse(localStorage.getItem("pd-course:" + slug) || "{}"); return { done: p.done || [], last: p.last || "", pos: p.pos || {} }; }
    catch (e) { return { done: [], last: "", pos: {} }; }
  };

  var continueRail = document.getElementById("rail-continue");
  var items = 0;
  courses.forEach(function (course) {
    var p = read(course.slug);

    // aulas concluídas na fileira de episódios
    document.querySelectorAll('[data-progress-list="' + course.slug + '"] li[data-lesson]').forEach(function (li) {
      li.classList.toggle("is-done", p.done.indexOf(li.getAttribute("data-lesson")) >= 0);
    });

    if (!p.last) return;
    var lesson = course.lessons.filter(function (l) { return l.slug === p.last; })[0];
    if (!lesson) return;

    // botões "Assistir agora" levam de volta para onde a pessoa parou
    document.querySelectorAll('[data-resume-course="' + course.slug + '"]').forEach(function (a) {
      a.href = lesson.url;
      var label = a.querySelector("span");
      if (label) label.textContent = "Continuar assistindo";
    });

    // card em "Continuar assistindo"
    var pct = Math.round(p.done.length / course.total * 100);
    var li = document.createElement("li");
    li.innerHTML =
      '<a class="ep-card" href="' + lesson.url + '">' +
        '<span class="ep-thumb"><img alt="" loading="lazy" width="320" height="180">' +
        '<span class="ep-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
        '<span class="ep-progress" aria-hidden="true"><span></span></span></span>' +
        '<span class="ep-text"><span class="ep-n"></span><span class="ep-title"></span><span class="ep-course"></span></span>' +
      "</a>";
    li.querySelector("img").src = lesson.thumb;
    li.querySelector(".ep-progress span").style.width = Math.max(pct, 3) + "%";
    li.querySelector(".ep-n").textContent = "Aula " + lesson.number + " de " + course.total;
    li.querySelector(".ep-title").textContent = lesson.title;
    li.querySelector(".ep-course").textContent = course.title + " · " + pct + "% concluído";
    continueRail.appendChild(li);
    items++;
  });
  if (items) document.getElementById("rowContinue").hidden = false;
})();
