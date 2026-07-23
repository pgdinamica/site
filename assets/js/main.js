/* Programação Dinâmica — interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header background on scroll ---- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var setMenu = function (open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    links.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---- Scroll reveal ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Animated stat counters ---- */
  var counters = Array.prototype.slice.call(document.querySelectorAll(".num[data-count]"));
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.querySelector(".plus");
    var suffixHTML = suffix ? suffix.outerHTML : "";
    if (reduceMotion) { el.innerHTML = target + suffixHTML; return; }
    var start = null, dur = 1400;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(0);
      el.innerHTML = val + suffixHTML;
      if (p < 1) requestAnimationFrame(step);
      else el.innerHTML = target + suffixHTML;
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---- Active nav link highlighting ---- */
  var sections = ["sobre", "canal", "midia", "cursos", "servicos", "palestras", "fundadores"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navAnchors = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var id = a.getAttribute("href").replace("#", "");
    navAnchors[id] = a;
  });
  if ("IntersectionObserver" in window && sections.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = navAnchors[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) {
          Object.keys(navAnchors).forEach(function (k) { navAnchors[k].classList.remove("active"); });
          a.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { so.observe(s); });
  }
})();
