// «Юрта знаний»: карточка языков, фильтр каталога, карусели, команда, просмотр документов, активный раздел в меню.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const easeOut = "cubic-bezier(.16, 1, .3, 1)";

  // Turns a card over; `swap` runs while the card is edge-on.
  const flip = async (card, swap) => {
    if (reduceMotion.matches || !card.animate) { swap(); return; }
    await card.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(90deg)" }], { duration: 160, easing: "cubic-bezier(.55, 0, .8, .2)" }).finished;
    swap();
    await card.animate([{ transform: "rotateY(-90deg)" }, { transform: "rotateY(0deg)" }], { duration: 460, easing: easeOut }).finished;
  };

  /* ---------- Hero card: one word, many languages ---------- */
  const langcard = document.querySelector("[data-langcard]");
  if (langcard) {
    const tabs = [...langcard.querySelectorAll('[role="tab"]')];
    const panel = langcard.querySelector('[role="tabpanel"]');
    const face = panel.querySelector(".langcard__face");
    const plus = panel.querySelector(".langcard__plus");
    const word = panel.querySelector("[data-word]");
    const name = panel.querySelector("[data-name]");
    const status = panel.querySelector("[data-status]");
    let index = 0, pending = null, busy = false, timer = null, stopped = false, inView = false;

    const render = (tab) => {
      const isPlus = tab.hasAttribute("data-plus");
      face.hidden = isPlus;
      plus.hidden = !isPlus;
      panel.classList.toggle("is-plus", isPlus);
      panel.setAttribute("aria-labelledby", tab.id);
      if (isPlus) return;
      word.textContent = tab.dataset.word;
      word.lang = name.lang = tab.dataset.lang;
      name.textContent = tab.dataset.name;
      status.textContent = tab.dataset.status;
      status.classList.toggle("is-wip", tab.dataset.status !== "в продаже");
    };

    const select = async (i, focus = false) => {
      if (busy) { pending = i; return; }
      if (i === index) return;
      index = i;
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      if (focus) tabs[i].focus();
      busy = true;
      try {
        await flip(panel, () => render(tabs[i]));
      } finally {
        busy = false;
        if (pending !== null) { const p = pending; pending = null; select(p); }
      }
    };

    const schedule = () => {
      clearTimeout(timer);
      if (stopped || !inView || document.hidden || reduceMotion.matches) return;
      const onPlus = tabs[index].hasAttribute("data-plus");
      timer = setTimeout(async () => { await select((index + 1) % tabs.length); schedule(); }, onPlus ? 4200 : 2400);
    };
    const takeOver = () => { stopped = true; clearTimeout(timer); };

    tabs.forEach((tab, i) => tab.addEventListener("click", () => { takeOver(); select(i); }));
    langcard.querySelector('[role="tablist"]').addEventListener("keydown", (e) => {
      const keys = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      takeOver();
      select((keys[e.key] + tabs.length) % tabs.length, true);
    });
    langcard.addEventListener("pointerenter", () => clearTimeout(timer));
    langcard.addEventListener("pointerleave", schedule);
    langcard.addEventListener("focusin", () => clearTimeout(timer));
    document.addEventListener("visibilitychange", schedule);
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; inView ? schedule() : clearTimeout(timer); }, { threshold: .4 }).observe(langcard);
  }

  /* ---------- Catalogue filter by language ---------- */
  const filter = document.querySelector(".filter");
  const games = [...document.querySelectorAll("[data-games] .game")];
  if (filter) {
    filter.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn || btn.classList.contains("is-active")) return;
      const f = btn.dataset.filter;
      filter.querySelectorAll("[data-filter]").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      let shown = 0;
      games.forEach((g) => {
        const visible = f === "all" || g.dataset.lang.split(" ").includes(f);
        g.hidden = !visible;
        g.classList.remove("will-deal", "is-dealt");
        if (visible && !reduceMotion.matches && g.animate) {
          g.animate([{ transform: "translateY(18px) rotate(-1deg)" }, { transform: "none" }],
            { duration: 620, delay: Math.min(shown, 8) * 45, easing: easeOut, fill: "backwards" });
        }
        if (visible) shown++;
      });
    });
  }

  /* ---------- Carousels ---------- */
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const prev = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    const update = () => {
      const end = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= end - 4;
      carousel.classList.toggle("is-static", end <= 4);
    };
    const move = (direction) => {
      const [first, second] = track.children;
      const step = second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
      track.scrollBy({ left: direction * step, behavior: reduceMotion.matches ? "auto" : "smooth" });
    };
    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    track.addEventListener("scroll", update, { passive: true });
    new ResizeObserver(update).observe(track);
  });

  /* ---------- Team: the author card turns to the chosen person ---------- */
  const team = document.querySelector("[data-team]");
  const people = [...document.querySelectorAll(".person")];
  if (team && people.length) {
    const photo = team.querySelector("[data-team-photo]");
    const img = photo.querySelector("img");
    const mono = photo.querySelector("[data-team-mono]");
    const text = team.querySelector(".author__text");
    const name = team.querySelector("[data-team-name]");
    const role = team.querySelector("[data-team-role]");
    const bio = team.querySelector("[data-team-bio]");
    const story = team.querySelector("[data-team-story]");
    let busy = false;

    // A photo goes live once its path is written in data-photo; until then the card shows initials.
    people.forEach((person) => {
      const slot = person.querySelector(".person__photo");
      if (!person.dataset.photo || slot.querySelector("img")) return;
      slot.replaceChildren(Object.assign(new Image(), { src: person.dataset.photo, alt: "", loading: "lazy", decoding: "async" }));
    });

    const render = (person) => {
      const src = person.dataset.photo;
      const fullName = person.querySelector(".person__name").textContent;
      const isAuthor = person.hasAttribute("data-author");
      img.hidden = !src;
      if (src) { img.src = src; img.alt = fullName; }
      mono.hidden = Boolean(src);
      mono.textContent = person.querySelector(".person__mono")?.textContent || "";
      name.textContent = person.dataset.title || fullName;
      role.hidden = isAuthor;
      role.textContent = person.querySelector(".person__role").textContent;
      bio.hidden = !person.dataset.bio;
      bio.textContent = person.dataset.bio || "";
      story.hidden = !isAuthor;
    };

    people.forEach((person) => person.addEventListener("click", async () => {
      if (busy || person.classList.contains("is-active")) return;
      people.forEach((p) => {
        p.classList.toggle("is-active", p === person);
        p.setAttribute("aria-pressed", String(p === person));
      });
      // Side by side, keep the strip below still when short text replaces the long author story.
      if (window.matchMedia("(min-width: 901px)").matches && !text.style.minHeight) text.style.minHeight = `${text.offsetHeight}px`;
      busy = true;
      await flip(photo, () => render(person));
      busy = false;
    }));
  }

  /* ---------- Documents: full-size viewer, paged within one carousel ---------- */
  const dialog = document.querySelector(".lightbox");
  const docs = [...document.querySelectorAll("[data-lightbox]")];
  if (dialog && typeof dialog.showModal === "function" && docs.length) {
    const cap = dialog.querySelector(".lightbox__cap");
    const prev = dialog.querySelector(".lightbox__prev");
    const next = dialog.querySelector(".lightbox__next");
    const img = document.createElement("img"); // created here so the page never ships an <img> without a source
    img.className = "lightbox__img";
    cap.before(img);
    let group = [], current = 0;
    const show = (i) => {
      current = (i + group.length) % group.length;
      const a = group[current];
      img.removeAttribute("src");
      img.src = a.getAttribute("href");
      img.alt = a.querySelector("img")?.alt || "";
      cap.textContent = a.dataset.caption || "";
    };
    docs.forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      const carousel = a.closest("[data-carousel]");
      group = carousel ? [...carousel.querySelectorAll("[data-lightbox]")] : [a];
      prev.hidden = next.hidden = group.length < 2;
      show(group.indexOf(a));
      dialog.showModal();
    }));
    dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
    prev.addEventListener("click", () => show(current - 1));
    next.addEventListener("click", () => show(current + 1));
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  }

  /* ---------- Current section in the header tabs ---------- */
  const nav = document.querySelector(".site-nav");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.removeAttribute("aria-current"));
      const link = byId.get(en.target.id);
      if (!link) return;
      link.setAttribute("aria-current", "true");
      if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: link.offsetLeft - 16, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main > section[id]").forEach((s) => spy.observe(s));

  /* ---------- The deal: cards below the fold settle into place once ---------- */
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const groups = new Map();
    document.querySelectorAll("[data-deal]").forEach((el) => {
      const list = groups.get(el.parentElement) || [];
      list.push(el);
      groups.set(el.parentElement, list);
    });
    const dealer = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add("is-dealt");
        el.addEventListener("transitionend", () => el.classList.remove("will-deal", "is-dealt"), { once: true });
        dealer.unobserve(el);
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    groups.forEach((list) => list.forEach((el, k) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.setProperty("--deal-delay", `${(k % 4) * 70}ms`);
      el.style.setProperty("--deal-rot", `${k % 2 ? 1.5 : -1.5}deg`);
      el.classList.add("will-deal");
      dealer.observe(el);
    }));
  }
})();
