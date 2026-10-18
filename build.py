#!/usr/bin/env python3
"""Gerador do site Programação Dinâmica.

Lê o conteúdo em Markdown (content/), os dados (data/) e os templates (templates/)
e gera o site estático em _site/.

    python build.py            # gera o site em _site/
    python build.py --serve    # gera, serve em http://localhost:8000 e regera ao salvar
"""
from __future__ import annotations

import argparse
import datetime as dt
import functools
import http.server
import os
import re
import shutil
import sys
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import markdown
from markdown.extensions.toc import slugify_unicode
import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup, escape

ROOT = Path(__file__).resolve().parent
CONTENT, DATA, TEMPLATES, ASSETS = (ROOT / d for d in ("content", "data", "templates", "assets"))
OUT = ROOT / "_site"

MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
          "agosto", "setembro", "outubro", "novembro", "dezembro"]
HIGHLIGHT_NAMES = ("Kizzy Terra", "Hallison Paz", "Programação Dinâmica")
WORDS_PER_MINUTE = 200


class BuildError(Exception):
    """Problema no conteúdo — mostrado ao autor com o arquivo responsável."""


# ---------------------------------------------------------------- markdown

def youtube_id(url: str) -> str | None:
    u = urlparse(url.strip())
    host = u.netloc.lower().removeprefix("www.").removeprefix("m.")
    if host == "youtu.be":
        return u.path.strip("/").split("/")[0] or None
    if host in ("youtube.com", "youtube-nocookie.com"):
        if u.path == "/watch":
            return parse_qs(u.query).get("v", [None])[0]
        parts = u.path.strip("/").split("/")
        if len(parts) >= 2 and parts[0] in ("embed", "shorts", "live"):
            return parts[1]
    return None


def social_embed(network: str, url: str) -> str | None:
    """URL incorporável (iframe) para um post de YouTube, Instagram ou LinkedIn."""
    if network == "youtube":
        vid = youtube_id(url)
        return f"https://www.youtube-nocookie.com/embed/{vid}?rel=0&modestbranding=1" if vid else None
    if network == "instagram":
        m = re.search(r"instagram\.com/(p|reel|tv)/([\w-]+)", url)
        kind = "p" if m and m.group(1) == "tv" else (m.group(1) if m else "")  # IGTV antigo → post
        return f"https://www.instagram.com/{kind}/{m.group(2)}/embed" if m else None
    if network == "linkedin":
        m = re.search(r"(activity|ugcPost|share)[-:](\d{10,})", url)
        return f"https://www.linkedin.com/embed/feed/update/urn:li:{m.group(1)}:{m.group(2)}" if m else None
    return None


def video_embed(vid: str, title: str = "Vídeo do YouTube") -> str:
    return (f'<figure class="embed-video"><iframe src="https://www.youtube-nocookie.com/embed/{vid}'
            f'?rel=0&amp;modestbranding=1" title="{escape(title)}" loading="lazy" '
            'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" '
            'allowfullscreen></iframe></figure>')


_md = markdown.Markdown(extensions=["extra", "sane_lists", "toc"],
                        extension_configs={"toc": {"slugify": slugify_unicode}})

_LONE_URL = re.compile(r'<p>\s*(?:<a href="([^"]+)">[^<]*</a>|(https?://[^\s<]+))\s*</p>')


def render_markdown(text: str) -> Markup:
    _md.reset()
    html = _md.convert(text)

    # Um link do YouTube sozinho num parágrafo vira um player incorporado.
    def embed(m):
        url = m.group(1) or m.group(2)
        vid = youtube_id(url)
        return video_embed(vid) if vid else m.group(0)

    html = _LONE_URL.sub(embed, html)
    html = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', html)
    html = html.replace("<img ", '<img loading="lazy" decoding="async" ')
    html = re.sub(r"(<table>.*?</table>)", r'<div class="table-wrap">\1</div>', html, flags=re.S)
    return Markup(html)


def plain_text(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).strip()


# ---------------------------------------------------------------- arquivos .md

def read_markdown(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"\A---\s*\n(.*?)\n---\s*(?:\n|\Z)(.*)", text, re.S)
    if not m:
        raise BuildError(f"{rel(path)}: falta o cabeçalho entre linhas '---' no início do arquivo.")
    try:
        meta = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        raise BuildError(f"{rel(path)}: erro no cabeçalho (YAML): {e}") from None
    if not isinstance(meta, dict):
        raise BuildError(f"{rel(path)}: o cabeçalho deve ter pares 'campo: valor'.")
    return meta, m.group(2)


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def require(meta: dict, path: Path, *fields: str) -> None:
    missing = [f for f in fields if not meta.get(f)]
    if missing:
        raise BuildError(f"{rel(path)}: campo(s) obrigatório(s) ausente(s): {', '.join(missing)}")


def md_files(folder: Path):
    """Arquivos .md da pasta, ignorando README e rascunhos começando com '_'."""
    return sorted(p for p in folder.glob("*.md")
                  if not p.name.startswith("_") and p.stem.upper() != "README")


def as_date(value, path: Path) -> dt.date:
    if isinstance(value, dt.datetime):
        return value.date()
    if isinstance(value, dt.date):
        return value
    try:
        return dt.date.fromisoformat(str(value))
    except ValueError:
        raise BuildError(f"{rel(path)}: data inválida '{value}' (use AAAA-MM-DD).") from None


# ---------------------------------------------------------------- modelos

class MetaFields:
    """Campos do cabeçalho do .md acessíveis como atributos; opcionais ausentes viram None."""

    def __getattr__(self, name):
        if name.startswith("__") or name == "meta":
            raise AttributeError(name)
        return self.meta.get(name)


@dataclass
class Author(MetaFields):
    slug: str
    meta: dict
    bio: Markup
    posts: list = field(default_factory=list)
    courses: list = field(default_factory=list)
    press: list = field(default_factory=list)


    @property
    def url(self):
        return f"/autores/{self.slug}/"

    @property
    def first_name(self):
        return self.meta["name"].split()[0]


@dataclass
class Post(MetaFields):
    slug: str
    meta: dict
    date: dt.date
    author: Author
    html: Markup
    minutes: int


    @property
    def url(self):
        return f"/blog/{self.slug}/"

    @property
    def kicker(self):
        """O 'chapéu' acima do título: campo `chapeu`, o `subtitle` ou a primeira tag."""
        if self.meta.get("chapeu") or self.meta.get("subtitle"):
            return self.meta.get("chapeu") or self.meta["subtitle"]
        tags = self.meta.get("tags") or []
        return str(tags[0]).replace("-", " ") if tags else ""


@dataclass
class Lesson(MetaFields):
    slug: str
    number: int
    meta: dict
    html: Markup
    video_id: str | None
    course: "Course" = None


    @property
    def url(self):
        return f"{self.course.url}aulas/{self.slug}/"

    @property
    def thumb(self):
        return f"https://i.ytimg.com/vi/{self.video_id}/mqdefault.jpg" if self.video_id else self.course.thumb

    @property
    def is_locked(self):
        """Aula disponível só no curso completo (pago)."""
        return bool(self.meta.get("locked"))

    @property
    def is_members(self):
        """Gravação exclusiva para membros do canal no YouTube."""
        return bool(self.course.members_only) and not self.meta.get("open") and not self.is_locked


@dataclass
class Course(MetaFields):
    slug: str
    meta: dict
    html: Markup
    instructors: list
    lessons: list


    @property
    def url(self):
        return f"/cursos/{self.slug}/"

    @property
    def total_minutes(self):
        total = 0
        for lesson in self.lessons:
            parts = [int(x) for x in str(lesson.duration or "0").split(":") if x.isdigit()]
            secs = 0
            for x in parts:
                secs = secs * 60 + x
            total += secs
        return round(total / 60)

    @property
    def free_lessons(self):
        return [l for l in self.lessons if not l.is_locked]

    @property
    def open_lessons(self):
        """Aulas com vídeo aberto a todos (num curso para membros, as marcadas com `open: true`)."""
        return [l for l in self.lessons if l.video_id and not l.is_locked and not l.is_members]

    @property
    def stream_data(self):
        """Dados mínimos para a página de cursos (continuar assistindo, progresso)."""
        return {"slug": self.slug, "title": self.title, "url": self.url, "total": len(self.free_lessons),
                "lessons": [{"slug": l.slug, "title": l.title, "url": l.url, "thumb": l.thumb,
                             "number": l.number, "module": l.module} for l in self.free_lessons]}

    @property
    def classroom_url(self):
        free = self.free_lessons
        return free[0].url if free else None

    @property
    def modules(self):
        """Aulas agrupadas por módulo, na ordem dos arquivos."""
        groups: list[tuple[str, list]] = []
        for lesson in self.lessons:
            name = lesson.module or "Aulas"
            if not groups or groups[-1][0] != name:
                groups.append((name, []))
            groups[-1][1].append(lesson)
        return groups


def load_authors() -> dict[str, Author]:
    authors = {}
    for path in md_files(CONTENT / "autores"):
        meta, body = read_markdown(path)
        require(meta, path, "name", "role")
        authors[path.stem] = Author(path.stem, meta, render_markdown(body))
    return authors


def load_posts(authors) -> list[Post]:
    posts = []
    for path in md_files(CONTENT / "blog"):
        meta, body = read_markdown(path)
        require(meta, path, "title", "date", "author")
        if meta.get("draft"):
            continue
        author = authors.get(meta["author"])
        if not author:
            known = ", ".join(sorted(authors))
            raise BuildError(f"{rel(path)}: autor '{meta['author']}' não existe. Use um de: {known}")
        html = render_markdown(body)
        words = len(plain_text(html).split())
        slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", path.stem)
        meta.setdefault("description", plain_text(html)[:180])
        posts.append(Post(slug, meta, as_date(meta["date"], path), author, html,
                          max(1, round(words / WORDS_PER_MINUTE))))
    posts.sort(key=lambda p: (p.date, p.slug), reverse=True)
    slugs = [p.slug for p in posts]
    dupes = {s for s in slugs if slugs.count(s) > 1}
    if dupes:
        raise BuildError(f"content/blog: há posts com o mesmo endereço: {', '.join(dupes)}")
    for p in posts:
        p.author.posts.append(p)
    return posts


def load_courses(authors) -> list[Course]:
    courses = []
    folder = CONTENT / "cursos"
    sources = [(p.stem, p, None) for p in md_files(folder)]
    sources += [(d.name, d / "curso.md", d / "aulas") for d in sorted(folder.iterdir())
                if d.is_dir() and (d / "curso.md").exists()]
    for slug, path, lessons_dir in sources:
        meta, body = read_markdown(path)
        require(meta, path, "title")
        instructors = []
        for a in meta.get("instructors") or []:
            if a not in authors:
                raise BuildError(f"{rel(path)}: instrutor '{a}' não existe em content/autores/.")
            instructors.append(authors[a])
        course = Course(slug, meta, render_markdown(body), instructors, [])
        if lessons_dir and lessons_dir.exists():
            for n, lp in enumerate(md_files(lessons_dir), 1):
                lmeta, lbody = read_markdown(lp)
                require(lmeta, lp, "title")
                if not lmeta.get("video") and not lmeta.get("locked"):
                    raise BuildError(f"{rel(lp)}: informe `video:` (link do YouTube) ou marque `locked: true`.")
                vid = youtube_id(str(lmeta["video"])) if lmeta.get("video") else None
                if lmeta.get("video") and not vid:
                    raise BuildError(f"{rel(lp)}: não reconheci o link do YouTube em 'video'.")
                lslug = re.sub(r"^\d+-", "", lp.stem)
                course.lessons.append(Lesson(lslug, n, lmeta, render_markdown(lbody), vid, course))
        courses.append(course)
        for a in instructors:
            a.courses.append(course)
    courses.sort(key=lambda c: (c.order or 99, c.title))
    return courses


def with_thumbs(items: list, prefix: str) -> list:
    """Miniatura local (assets/img/<prefix><id>.jpg) se existir; senão a do próprio YouTube."""
    for item in items:
        name = f"{prefix}{str(item['id']).lstrip('-')}.jpg"
        local = ASSETS / "img" / name
        item["thumb"] = f"/assets/img/{name}" if local.exists() else f"https://i.ytimg.com/vi/{item['id']}/hqdefault.jpg"
    return items


def load_yaml(name: str):
    return yaml.safe_load((DATA / name).read_text(encoding="utf-8"))


# ---------------------------------------------------------------- filtros

def date_long(d: dt.date) -> str:
    return f"{d.day} de {MONTHS[d.month - 1]} de {d.year}"


def date_short(d: dt.date) -> str:
    return f"{d.day:02d} {MONTHS[d.month - 1][:3]} {d.year}"


def highlight(text) -> Markup:
    out = str(escape(text))
    for name in HIGHLIGHT_NAMES:
        out = out.replace(name, f'<mark class="hl">{name}</mark>')
    return Markup(out)


def rfc822(d: dt.date) -> str:
    return dt.datetime(d.year, d.month, d.day, 12, tzinfo=dt.timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")


# ---------------------------------------------------------------- build

def build() -> int:
    t0 = time.time()
    site = load_yaml("site.yml")
    press = load_yaml("imprensa.yml")
    talks_data = load_yaml("palestras.yml")
    talks, talk_photos = talks_data["items"], talks_data.get("photos") or {}
    marcas = load_yaml("marcas.yml")
    youtube_videos = with_thumbs(load_yaml("youtube.yml")["items"], "videos/vid-")
    participacoes = with_thumbs(load_yaml("participacoes.yml")["items"], "events/ev-")
    ads_meta, ads_body = read_markdown(CONTENT / "publicidade.md")
    ads = {**ads_meta, "intro": render_markdown(ads_body)}
    authors = load_authors()
    posts = load_posts(authors)
    courses = load_courses(authors)
    outlets = press.get("outlets") or {}
    for item in press["items"]:
        info = outlets.get(item["outlet"]) or {}
        item.setdefault("logo", info.get("logo"))
        item.setdefault("color", info.get("color"))
        for slug in item.get("people") or []:
            if slug not in authors:
                raise BuildError(f"data/imprensa.yml: pessoa '{slug}' não existe em content/autores/.")
            authors[slug].press.append(item)
    # Veículos únicos com logo, na ordem em que aparecem (faixa de logos)
    press["logos"] = []
    for item in press["items"]:
        if item.get("logo") and item["outlet"] not in [o["outlet"] for o in press["logos"]]:
            press["logos"].append({"outlet": item["outlet"], "name": item["outlet"].split(" · ")[0], "logo": item["logo"]})
    for talk in talks:
        talk["speakers"] = [authors[a] for a in talk.get("speakers") or authors]
    for network in ("youtube", "instagram", "linkedin"):
        items = ads.get(network) or []
        for item in items:
            item["embed"] = social_embed(network, str(item.get("url", "")))
            if not item["embed"]:
                raise BuildError(f"content/publicidade.md: não reconheci o link de {network}: {item.get('url')}")
        ads[network] = items

    env = Environment(loader=FileSystemLoader(TEMPLATES), autoescape=select_autoescape(["html", "xml"]),
                      trim_blocks=True, lstrip_blocks=True)
    env.filters.update(date_long=date_long, date_short=date_short, highlight=highlight, rfc822=rfc822,
                       md=lambda t: render_markdown(str(t or "")))
    env.tests["contains_author"] = lambda speakers, author: author in (speakers or [])
    env.globals.update(site=site, authors=authors, courses=courses, press=press, posts=posts,
                       talks=talks, talk_photos=talk_photos, marcas=marcas, ads=ads, youtube_videos=youtube_videos,
                       participacoes=participacoes,
                       year=dt.date.today().year, video_embed=lambda v, t="": Markup(video_embed(v, t)))

    if OUT.exists():
        for child in OUT.iterdir():
            shutil.rmtree(child) if child.is_dir() else child.unlink()
    else:
        OUT.mkdir()
    shutil.copytree(ASSETS, OUT / "assets")
    # Domínio próprio no GitHub Pages (vem de `url:` em data/site.yml)
    (OUT / "CNAME").write_text(urlparse(site["url"]).netloc + "\n", encoding="utf-8")
    pages: list[str] = []

    def render(template: str, url: str, sitemap: bool = True, **ctx):
        target = OUT / url.lstrip("/")
        if url.endswith("/"):
            target = target / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        ctx["page"] = {"title": None, "description": None, "image": None, "type": "website",
                       "active": None, "url": url, **ctx.get("page", {})}
        target.write_text(env.get_template(template).render(**ctx), encoding="utf-8")
        if sitemap:
            pages.append(url)

    render("home.html", "/", page={"active": "home"})
    render("imprensa.html", "/imprensa/", page={"active": "imprensa", "title": "Programação Dinâmica na imprensa"})
    render("palestras.html", "/palestras/", page={"active": "palestras", "title": "Palestras",
               "description": "Palestras de Kizzy Terra e Hallison Paz sobre inteligência artificial, dados, educação e carreira em tecnologia.",
               "image": ((talk_photos.get("hero") or [{}])[0]).get("src")})
    render("publicidade.html", "/publicidade/", page={"active": "servicos", "title": "Publicidade",
               "description": "Vitrine de publicidade do Programação Dinâmica: formatos, audiência e marcas que já trabalharam com a gente."})
    render("blog.html", "/blog/", page={"active": "blog", "title": "Blog"})
    for i, post in enumerate(posts):
        newer = posts[i - 1] if i > 0 else None
        older = posts[i + 1] if i + 1 < len(posts) else None
        more = [p for p in post.author.posts if p is not post][:3]
        render("post.html", post.url, post=post, newer=newer, older=older, more=more,
               page={"active": "blog", "title": post.title, "description": post.description,
                     "image": post.cover, "type": "article"})
    render("autores.html", "/autores/", page={"active": "autores", "title": "Autores"})
    for author in authors.values():
        render("autor.html", author.url, author=author,
               page={"active": "autores", "title": author.name, "description": author.tagline,
                     "image": author.photo, "type": "profile"})
    render("cursos.html", "/cursos/", page={"active": "cursos", "title": "Cursos"})
    for course in courses:
        render("curso.html", course.url, course=course,
               page={"active": "cursos", "title": course.title, "description": course.summary,
                     "image": course.cover})
        for i, lesson in enumerate(course.lessons):
            prev_l = course.lessons[i - 1] if i > 0 else None
            next_l = course.lessons[i + 1] if i + 1 < len(course.lessons) else None
            next_free = next((l for l in course.lessons[i + 1:] if not l.is_locked), None)
            render("aula.html", lesson.url, course=course, lesson=lesson, prev_lesson=prev_l, next_lesson=next_l,
                   next_free=next_free,
                   page={"active": "cursos", "title": f"{lesson.title} — {course.title}",
                         "description": f"Aula {lesson.number} do curso {course.title}.",
                         "image": f"https://i.ytimg.com/vi/{lesson.video_id}/hqdefault.jpg" if lesson.video_id else course.cover})
    render("404.html", "/404.html", sitemap=False, page={"title": "Página não encontrada"})
    render("feed.xml", "/blog/feed.xml", sitemap=False)
    render("sitemap.xml", "/sitemap.xml", sitemap=False, urls=list(pages))

    lessons = sum(len(c.lessons) for c in courses)
    print(f"✓ site gerado em {OUT.name}/ — {len(posts)} posts, {len(authors)} autores, "
          f"{len(courses)} cursos, {lessons} aulas ({time.time() - t0:.2f}s)")
    return 0


# ---------------------------------------------------------------- servidor local

def snapshot() -> dict:
    watched = [CONTENT, DATA, TEMPLATES, ASSETS]
    return {p: p.stat().st_mtime for d in watched for p in d.rglob("*") if p.is_file()}


class DevHandler(http.server.SimpleHTTPRequestHandler):
    """Serve _site/ sem cache (para ver cada alteração na hora) e com a página 404."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        page = OUT / "404.html"
        if code == 404 and page.exists():
            body = page.read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, *args):
        pass


def serve(port: int) -> None:
    handler = functools.partial(DevHandler, directory=str(OUT))
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    print(f"→ http://localhost:{port}  (Ctrl+C para sair; o site é regerado ao salvar arquivos)")
    state = snapshot()
    me = Path(__file__).stat().st_mtime
    try:
        while True:
            time.sleep(1)
            if Path(__file__).stat().st_mtime != me:  # o próprio gerador mudou: reinicia
                print("↻ build.py alterado — reiniciando o servidor")
                server.shutdown()
                server.server_close()
                os.execv(sys.executable, [sys.executable] + sys.argv)
            now = snapshot()
            if now != state:
                state = now
                safe_build(keep_alive=True)
    except KeyboardInterrupt:
        server.shutdown()


def safe_build(keep_alive: bool = False) -> int:
    try:
        return build()
    except BuildError as e:
        print(f"✗ {e}", file=sys.stderr)
        return 1
    except Exception:  # erro de template etc.: no modo --serve, mostra e continua rodando
        if not keep_alive:
            raise
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--serve", action="store_true", help="servir localmente e regerar ao salvar")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    code = safe_build(keep_alive=args.serve)
    if args.serve:
        serve(args.port)
    sys.exit(code)
