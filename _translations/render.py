"""Render the six standalone editions from index.html. Requires beautifulsoup4."""

import json
import re
from pathlib import Path
from urllib.parse import urljoin

from bs4 import BeautifulSoup, Comment, Doctype


FOLDER = Path(__file__).resolve().parent
ROOT = FOLDER.parent
REGIONS = {"ba": "RU", "tt": "RU", "en": "GB", "uz": "UZ", "kk": "KZ", "be": "BY"}
ATTRIBUTES = (
    "alt", "aria-label", "title", "content", "data-full", "data-bio",
    "data-caption", "data-read", "data-view", "data-status",
)


def render(source, language):
    phrases = json.loads((FOLDER / f"{language}.json").read_text(encoding="utf-8"))
    page = BeautifulSoup(source, "html.parser")

    def translate(value):
        key = " ".join(value.split())
        if key in phrases:
            return value.replace(value.strip(), phrases[key])
        if re.search("[а-яё]", key, re.I):
            raise ValueError(f"{language}: missing translation for {key!r}")
        return value

    for node in page.find_all(string=True):
        if isinstance(node, (Comment, Doctype)):
            continue
        parent = node.parent
        # Keep the alphabet samples and the language switcher in native spelling.
        if parent.get("lang") or parent.has_attr("data-name") or parent.has_attr("hreflang"):
            continue
        node.replace_with(translate(str(node)))

    for tag in page.find_all(True):
        for attr in ATTRIBUTES:
            if attr not in tag.attrs:
                continue
            if tag.has_attr("hreflang") and attr in ("title", "aria-label"):
                continue
            tag[attr] = translate(tag[attr])

    page.html["lang"] = language
    if language == "ba":
        subtitle = page.select_one(".brand__sub")
        subtitle.string = "ЮРТА ЗНАНИЙ"
        subtitle["lang"] = "ru"
    page.select_one('[aria-current="page"]').attrs.pop("aria-current")
    selected = page.select_one(f".langcard__tabs [hreflang={language}]")
    selected["aria-current"] = "page"
    face = page.select_one(".langcard__face")
    word = face.select_one("[data-word]")
    word.string, word["lang"] = selected["data-word"], language
    face.select_one("[data-name]").string = selected["title"]
    status = face.select_one("[data-status]")
    status.string = selected["data-status"]
    if selected.has_attr("data-in-development"):
        status["class"].append("is-wip")

    if language in ("en", "uz"):
        for person in page.select(".person[data-initials]"):
            words = person.select_one(".person__name").get_text().split()
            person["data-initials"] = words[0][0] + words[-1][0]

    canonical = page.select_one('link[rel="canonical"]')
    canonical["href"] = urljoin(canonical["href"], f"{language}.html")
    page.select_one('[property="og:url"]')["content"] = canonical["href"]
    page.select_one('[property="og:locale"]')["content"] = f"{language}_{REGIONS[language]}"
    return page.decode(formatter="minimal").rstrip() + "\n"


if __name__ == "__main__":
    template = (ROOT / "index.html").read_text(encoding="utf-8")
    editions = {language: render(template, language) for language in REGIONS}
    for language, html in editions.items():
        (ROOT / f"{language}.html").write_text(html, encoding="utf-8", newline="\n")
