// «Юрта знаний»: карточка языков, фильтр каталога, просмотр писем, активный раздел в меню.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const easeOut = "cubic-bezier(.16, 1, .3, 1)";

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
      if (reduceMotion.matches || !panel.animate) { render(tabs[i]); return; }
      busy = true;
      try {
        await panel.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(90deg)" }], { duration: 160, easing: "cubic-bezier(.55, 0, .8, .2)" }).finished;
        render(tabs[i]);
        await panel.animate([{ transform: "rotateY(-90deg)" }, { transform: "rotateY(0deg)" }], { duration: 460, easing: easeOut }).finished;
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

  /* ---------- Letters: full-size viewer ---------- */
  const dialog = document.querySelector(".lightbox");
  const docs = [...document.querySelectorAll("[data-lightbox]")];
  if (dialog && typeof dialog.showModal === "function" && docs.length) {
    const cap = dialog.querySelector(".lightbox__cap");
    const img = document.createElement("img"); // created here so the page never ships an <img> without a source
    img.className = "lightbox__img";
    cap.before(img);
    let current = 0;
    const show = (i) => {
      current = (i + docs.length) % docs.length;
      const a = docs[current];
      img.removeAttribute("src");
      img.src = a.getAttribute("href");
      img.alt = a.querySelector("img")?.alt || "";
      cap.textContent = a.dataset.caption || "";
    };
    docs.forEach((a, i) => a.addEventListener("click", (e) => {
      e.preventDefault();
      show(i);
      dialog.showModal();
    }));
    dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
    dialog.querySelector(".lightbox__prev").addEventListener("click", () => show(current - 1));
    dialog.querySelector(".lightbox__next").addEventListener("click", () => show(current + 1));
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
