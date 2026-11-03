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

  /* ---------- Team: a card slides up out of the row ---------- */
  const team = document.querySelector("[data-team]");
  if (team) {
    const people = [...team.querySelectorAll(".person")];
    const track = team.querySelector(".carousel__track");
    const card = team.querySelector(".person-card");
    const photo = card.querySelector("[data-card-photo]");
    const name = card.querySelector("[data-card-name]");
    const role = card.querySelector("[data-card-role]");
    const bio = card.querySelector("[data-card-bio]");
    let active = null, run = 0;

    const slide = (keyframes, duration, easing) => {
      if (reduceMotion.matches || !card.animate) return Promise.resolve();
      return card.animate(keyframes, { duration, easing }).finished.catch(() => {});
    };
    const slideOut = (duration = 200) => slide([{ transform: "none" }, { transform: "translateY(100%)" }], duration, "cubic-bezier(.55, 0, .8, .2)");
    const slideIn = () => slide([{ transform: "translateY(100%)" }, { transform: "none" }], 560, easeOut);
    const mark = (person) => people.forEach((p) => p.setAttribute("aria-expanded", String(p === person)));

    // A photo goes live once its path is written in data-photo; until then the card shows initials.
    const fill = (person) => {
      const fullName = person.querySelector(".person__name").textContent;
      const mono = Object.assign(document.createElement("span"), { className: "person-card__mono", textContent: person.dataset.initials });
      const img = Object.assign(new Image(), { src: person.dataset.photo, alt: fullName });
      photo.replaceChildren(person.dataset.photo ? img : mono);
      name.textContent = fullName;
      role.textContent = person.dataset.full;
      bio.textContent = person.dataset.bio || "";
      bio.hidden = !person.dataset.bio;
    };
    const place = (person) => {
      const box = team.getBoundingClientRect();
      const chip = person.getBoundingClientRect();
      const x = chip.left - box.left + chip.width / 2 - card.offsetWidth / 2;
      card.style.setProperty("--card-x", `${Math.max(0, Math.min(x, box.width - card.offsetWidth))}px`);
    };
    const keepInView = () => {
      const top = card.getBoundingClientRect().top - document.querySelector(".site-header").offsetHeight - 12;
      if (top < 0) window.scrollBy({ top, behavior: reduceMotion.matches ? "auto" : "smooth" });
    };
    const close = async () => {
      if (!active) return;
      const id = ++run;
      active = null;
      mark(null);
      await slideOut();
      if (id === run) card.hidden = true;
    };
    const open = async (person) => {
      const swapping = Boolean(active);
      const id = ++run;
      active = person;
      mark(person);
      if (swapping) await slideOut(130);
      if (id !== run) return;
      fill(person);
      card.hidden = false;
      place(person);
      keepInView();
      await slideIn();
    };

    people.forEach((person) => person.addEventListener("click", () => (person === active ? close() : open(person))));
    card.querySelector(".person-card__close").addEventListener("click", () => {
      const person = active;
      close();
      person?.focus();
    });
    document.addEventListener("click", (e) => { if (active && !e.target.closest(".person, .person-card")) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !active) return;
      const person = active;
      close();
      person.focus();
    });
    track.addEventListener("scroll", () => { if (active) place(active); }, { passive: true });
    window.addEventListener("resize", () => { if (active) place(active); });
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
