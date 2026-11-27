// Repassa a origem da visita (UTMs) para os links de checkout da Kiwify,
// para cada venda aparecer na Kiwify com o canal de onde a pessoa veio.
// - Se o endereço traz utm_*/src/sck, guarda (30 dias, só neste navegador).
// - Origens internas (lab, site) não apagam uma origem externa já guardada.
// - Sem UTMs, usa o site de onde a pessoa veio (ex.: youtube.com) ou "direto".
// - sck recebe a página do site em que a pessoa clicou para comprar.
(function () {
  var CHAVES = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src"];
  var INTERNAS = ["lab", "site", "pgdinamica"];
  var KEY = "pd_origem", DIAS = 30;

  function ler() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && Date.now() - o.t < DIAS * 864e5) return o.p;
    } catch (e) {}
    return null;
  }
  function gravar(p) {
    try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), p: p })); } catch (e) {}
  }

  var params = new URLSearchParams(location.search), novos = {}, tem = false;
  CHAVES.forEach(function (k) { var v = params.get(k); if (v) { novos[k] = v; tem = true; } });
  var salvos = ler();
  if (tem) {
    if (!(salvos && INTERNAS.indexOf(novos.utm_source) >= 0)) { salvos = novos; gravar(novos); }
  } else if (!salvos) {
    var host = "";
    try { host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : ""; } catch (e) {}
    if (host && !/(^|\.)pgdinamica\.com$/.test(host)) { salvos = { utm_source: host, utm_medium: "referral" }; gravar(salvos); }
  }
  var origem = salvos || { utm_source: "direto", utm_medium: "site" };
  var pagina = location.pathname.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";

  function decorar(a) {
    try {
      var u = new URL(a.href);
      if (!/(^|\.)kiwify\.com\.br$/.test(u.hostname)) return;
      Object.keys(origem).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, origem[k]); });
      if (!u.searchParams.has("sck")) u.searchParams.set("sck", pagina);
      a.href = u.href;
    } catch (e) {}
  }
  function todos() { document.querySelectorAll('a[href*="kiwify.com.br"]').forEach(decorar); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", todos); else todos();
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="kiwify.com.br"]');
    if (a) decorar(a);
  }, true);
})();
