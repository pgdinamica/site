/* Sala de estudo dos cursos abertos.
 *
 * - Player do YouTube (domínio youtube-nocookie) sem recomendações de outros canais.
 *   Nas telas de pausa e de fim, onde o YouTube sugere outros vídeos, mostramos
 *   a nossa própria camada: "continuar" e "próxima aula".
 * - Progresso, ponto em que o vídeo parou e anotações ficam salvos neste navegador
 *   (localStorage). Nada é enviado a servidor algum.
 */
(function () {
  "use strict";

  /* ---------------- armazenamento ---------------- */
  var store = {
    get: function (key, fallback) {
      try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* modo privado: segue sem salvar */ }
    }
  };
  var progressKey = function (course) { return "pd-course:" + course; };
  var notesKey = function (course, lesson) { return "pd-notes:" + course + ":" + lesson; };
  var loadProgress = function (course) {
    var p = store.get(progressKey(course), {});
    return { done: p.done || [], last: p.last || "", pos: p.pos || {} };
  };

  /* ---------------- página do curso: "continuar de onde parei" ---------------- */
  var resumeBar = document.getElementById("resumeBar");
  if (resumeBar) {
    var rCourse = resumeBar.getAttribute("data-course");
    var rTotal = parseInt(resumeBar.getAttribute("data-total"), 10);
    var rp = loadProgress(rCourse);
    var base = location.pathname.replace(/\/?$/, "/");
    if (rp.last || rp.done.length) {
      var lastUrl = base + "aulas/" + (rp.last || "") + "/";
      document.getElementById("resumeText").textContent = rp.done.length + " de " + rTotal + " aulas concluídas.";
      document.getElementById("resumeFill").style.width = Math.round(rp.done.length / rTotal * 100) + "%";
      if (rp.last) {
        document.getElementById("resumeLink").href = lastUrl;
        document.querySelectorAll("[data-resume-course]").forEach(function (a) { a.href = lastUrl; });
      }
      resumeBar.hidden = false;
    }
    document.querySelectorAll("[data-progress-list] li[data-lesson]").forEach(function (li) {
      li.classList.toggle("is-done", rp.done.indexOf(li.getAttribute("data-lesson")) >= 0);
    });
  }

  /* ---------------- página da aula ---------------- */
  var room = document.querySelector(".classroom");
  if (!room) return;

  var course = room.getAttribute("data-course");
  var lesson = room.getAttribute("data-lesson");
  var total = parseInt(room.getAttribute("data-total"), 10);
  var locked = room.hasAttribute("data-locked");
  var progress = loadProgress(course);
  var save = function () { store.set(progressKey(course), progress); };
  if (!locked) { progress.last = lesson; save(); }

  var doneBtn = document.getElementById("doneBtn");
  var render = function () {
    var isDone = progress.done.indexOf(lesson) >= 0;
    if (doneBtn) {
      doneBtn.setAttribute("aria-pressed", String(isDone));
      doneBtn.querySelector("span").textContent = isDone ? "Aula concluída" : "Marcar como concluída";
    }
    document.querySelectorAll(".class-side li[data-lesson]").forEach(function (li) {
      li.classList.toggle("is-done", progress.done.indexOf(li.getAttribute("data-lesson")) >= 0);
    });
    var n = progress.done.length;
    document.getElementById("progressText").textContent = n + " de " + total + " aulas concluídas";
    document.getElementById("progressFill").style.width = Math.round(n / total * 100) + "%";
  };
  var setDone = function (value) {
    var i = progress.done.indexOf(lesson);
    if (value && i < 0) progress.done.push(lesson);
    if (!value && i >= 0) progress.done.splice(i, 1);
    save();
    render();
  };
  if (doneBtn) doneBtn.addEventListener("click", function () { setDone(progress.done.indexOf(lesson) < 0); });
  render();

  /* Lista de aulas no celular */
  var toggle = document.getElementById("lessonsToggle");
  var side = document.getElementById("lessonsPanel");
  toggle.addEventListener("click", function () {
    var open = !side.classList.contains("open");
    side.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  var current = side.querySelector(".is-current");
  if (current) current.scrollIntoView({ block: "center" });

  if (locked) return;

  /* Abas: material / anotações */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".lesson-tabs .tab"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    });
  });

  /* Anotações (salvas automaticamente) */
  var notes = document.getElementById("notes");
  var status = document.getElementById("notesStatus");
  notes.value = store.get(notesKey(course, lesson), "");
  var timer;
  notes.addEventListener("input", function () {
    status.textContent = "Salvando…";
    clearTimeout(timer);
    timer = setTimeout(function () {
      store.set(notesKey(course, lesson), notes.value);
      status.textContent = "Salvo neste navegador";
    }, 500);
  });
  document.getElementById("notesDownload").addEventListener("click", function () {
    var slugs = JSON.parse(document.getElementById("lessonIndex").textContent);
    var titles = JSON.parse(document.getElementById("lessonTitles").textContent);
    var title = document.querySelector(".class-course a").textContent.trim();
    var out = ["# Anotações — " + title, ""];
    slugs.forEach(function (s, i) {
      var text = store.get(notesKey(course, s), "");
      if (text.trim()) out.push("## Aula " + (i + 1) + ": " + titles[i], "", text.trim(), "");
    });
    if (out.length === 2) out.push("_Nenhuma anotação ainda._");
    var blob = new Blob([out.join("\n")], { type: "text/markdown;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "anotacoes-" + course + ".md";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  });

  /* ---------------- player ---------------- */
  var holder = document.getElementById("player");
  var videoId = holder && holder.getAttribute("data-video");
  if (!videoId) return;
  var pauseOverlay = document.getElementById("pauseOverlay");
  var endOverlay = document.getElementById("endOverlay");
  var player, pauseTimer, saveTimer;

  var start = Math.floor(progress.pos[lesson] || 0);

  var gate = document.getElementById("memberGate");
  var MEMBER_KEY = "pd-member";
  var autoplay = 0;

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("player", {
      host: holder.getAttribute("data-host") || "https://www.youtube-nocookie.com",
      videoId: videoId,
      playerVars: { rel: 0, modestbranding: 1, iv_load_policy: 3, playsinline: 1, start: start, autoplay: autoplay, cc_lang_pref: "pt", hl: "pt-BR" },
      events: { onStateChange: onState }
    });
  };

  function onState(e) {
    var S = YT.PlayerState;
    clearTimeout(pauseTimer);
    if (e.data === S.PLAYING) {
      pauseOverlay.hidden = true;
      endOverlay.hidden = true;
      clearInterval(saveTimer);
      saveTimer = setInterval(remember, 5000);
    } else {
      clearInterval(saveTimer);
      remember();
    }
    if (e.data === S.PAUSED) {
      // Pequeno atraso: ao arrastar a barra de tempo o YouTube pausa por instantes.
      pauseTimer = setTimeout(function () { pauseOverlay.hidden = false; }, 350);
    }
    if (e.data === S.ENDED) {
      progress.pos[lesson] = 0;
      setDone(true);
      pauseOverlay.hidden = true;
      endOverlay.hidden = false;
    }
  }

  function remember() {
    if (!player || !player.getCurrentTime) return;
    var t = player.getCurrentTime();
    var d = player.getDuration() || 0;
    progress.pos[lesson] = d && t > d - 15 ? 0 : t;
    if (d && t / d >= 0.9 && progress.done.indexOf(lesson) < 0) setDone(true);
    else save();
  }

  pauseOverlay.addEventListener("click", function () { if (player) player.playVideo(); });
  var replay = document.getElementById("replayBtn");
  if (replay) replay.addEventListener("click", function () {
    endOverlay.hidden = true;
    if (player) { player.seekTo(0, true); player.playVideo(); }
  });
  window.addEventListener("pagehide", remember);

  var loadPlayer = function () {
    var api = document.createElement("script");
    api.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(api);
  };

  // Gravação para membros: só carrega o vídeo depois que a pessoa confirma que é membro
  // (a confirmação fica lembrada neste navegador para as próximas aulas).
  if (gate) {
    if (store.get(MEMBER_KEY, false)) {
      gate.hidden = true;
      loadPlayer();
    } else {
      document.getElementById("memberLoad").addEventListener("click", function () {
        store.set(MEMBER_KEY, true);
        gate.hidden = true;
        autoplay = 1;
        loadPlayer();
      });
    }
  } else {
    loadPlayer();
  }
})();
