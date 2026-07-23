/* ============================================================================
   Amirul Hafiz — Portfolio interactions
   Vanilla JS, progressive enhancement. Everything degrades gracefully.
   ----------------------------------------------------------------------------
   Contents: 1) Helpers  2) Theme  3) Mobile nav  4) Scroll spy + nav bg
             5) Reveal on scroll  6) Counters  7) Skill/learn bars
             8) Typing animation  9) Project filter + modal  10) Tilt
             11) Contact form  12) Scroll-to-top  13) Particles  14) Year
   ============================================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Toast helper ---------- */
  var toastEl = $("#toast");
  var toastTimer;
  function toast(msg, type) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = "toast show" + (type ? " " + type : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = "toast"; }, 2400);
  }

  /* ---------- 2. Theme toggle ---------- */
  var themeToggle = $("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "light" ? "#eef2fb" : "#070b18");
      toast(next === "light" ? "Light mode" : "Dark mode");
    });
  }

  /* ---------- 3. Mobile nav ---------- */
  var burger = $("#navBurger");
  var navLinks = $("#navLinks");
  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (burger) { burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
  }
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("a", navLinks).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- 4. Nav background + scroll spy ---------- */
  var nav = $("#nav");
  var sections = $$("main section[id]");
  var linkFor = {};
  $$(".nav-links a").forEach(function (a) {
    var id = a.getAttribute("href").replace("#", "");
    linkFor[id] = a;
  });

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);

    // scroll spy — pick the section whose top is closest above the trigger line
    var trigger = window.scrollY + window.innerHeight * 0.32;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= trigger) current = sec.id;
    });
    // near page bottom → force last nav target
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = "contact";
    }
    $$(".nav-links a").forEach(function (a) { a.classList.remove("active"); });
    if (current && linkFor[current]) linkFor[current].classList.add("active");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 5. Reveal on scroll + counters + bars ----------
     Content is visible by default (CSS). We only switch on the hidden/animated
     state (html.anim-ready) once we trust IntersectionObserver. A safety
     timeout reveals everything if IO never fires, so the page is never blank. */
  var reveals = $$(".reveal");

  function revealAll() { reveals.forEach(function (el) { el.classList.add("in"); }); }
  function forceCountersAndBars() {
    $$("[data-counter]").forEach(function (el) {
      el.textContent = (parseFloat(el.getAttribute("data-counter")) || 0) + (el.getAttribute("data-suffix") || "");
    });
    fillBars(document);
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    root.classList.add("anim-ready");

    var revObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); revObserver.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revObserver.observe(el); });

    // Counters (stats) + progress bars (about-side) run once when in view
    var once = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$("[data-counter]", en.target).forEach(runCounter);
        fillBars(en.target);
        once.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    var statsEl = $(".stats"); if (statsEl) once.observe(statsEl);
    var sideEl = $(".about-side"); if (sideEl) once.observe(sideEl);

    // Safety bail-out: if IO hasn't revealed any above-the-fold element shortly
    // after load, assume it is unavailable and show everything statically.
    setTimeout(function () {
      if (!reveals.some(function (el) { return el.classList.contains("in"); })) {
        revObserver.disconnect(); once.disconnect();
        root.classList.remove("anim-ready");
        revealAll();
        forceCountersAndBars();
      }
    }, 1000);
  } else {
    // No IO support or reduced motion → fully visible, no animation
    revealAll();
    forceCountersAndBars();
  }

  /* ---------- 6. Animated counters ---------- */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-counter")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 7. Skill / learn bars helper ---------- */
  function fillBars(scope) { $$(".bar", scope).forEach(function (b) { b.classList.add("filled"); }); }

  /* ---------- 8. Typing animation ---------- */
  var typingEl = $("#typing");
  if (typingEl) {
    var words = ["Software Development", "Mobile Applications", "Web Development", "UI/UX", "Artificial Intelligence"];
    if (reduceMotion) {
      typingEl.textContent = words[0];
    } else {
      var wi = 0, ci = 0, deleting = false;
      (function type() {
        var word = words[wi];
        typingEl.textContent = word.substring(0, ci);
        if (!deleting && ci < word.length) { ci++; setTimeout(type, 70); }
        else if (deleting && ci > 0) { ci--; setTimeout(type, 34); }
        else if (!deleting && ci === word.length) { deleting = true; setTimeout(type, 1500); }
        else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 320); }
      })();
    }
  }

  /* ---------- 9. Project filter + modal ---------- */
  var filters = $$(".filter");
  var projects = $$(".project");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
      var cat = btn.getAttribute("data-filter");
      var shown = 0;
      projects.forEach(function (p) {
        var match = cat === "all" || (p.getAttribute("data-cat") || "").indexOf(cat) !== -1;
        p.classList.toggle("hide", !match);
        if (match) { shown++; p.classList.remove("filtering"); void p.offsetWidth; p.classList.add("filtering"); }
      });
      toast(shown + " project" + (shown === 1 ? "" : "s") + " • " + btn.textContent);
    });
  });

  // Modal
  var modal = $("#projectModal");
  var mCover = $("#modalCover"), mCats = $("#modalCats"), mTitle = $("#modalTitle"),
      mTags = $("#modalTags"), mDetail = $("#modalDetail"), mLinks = $("#modalLinks");
  var lastFocused = null;

  function openModal(project) {
    if (!modal) return;
    lastFocused = document.activeElement;
    var accent = ($(".project-cover", project) || {}).getAttribute ? $(".project-cover", project).getAttribute("data-accent") : "cyan";

    mCats.innerHTML = ($(".project-cats", project) || {}).innerHTML || "";
    mTitle.textContent = ($(".project-title", project) || {}).textContent || "Project";
    mTags.innerHTML = ($(".tags", project) || {}).innerHTML || "";

    var tpl = $(".project-detail", project);
    mDetail.innerHTML = tpl ? tpl.innerHTML : "";

    // rebuild links (skip the "Case Study" button)
    mLinks.innerHTML = "";
    $$(".project-links a", project).forEach(function (a) {
      var clone = a.cloneNode(true);
      clone.classList.add("link-btn");
      mLinks.appendChild(clone);
    });

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var x = $(".modal-x", modal); if (x) x.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  projects.forEach(function (p) {
    var btn = $(".view-details", p);
    if (btn) btn.addEventListener("click", function () { openModal(p); });
  });
  if (modal) {
    $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("show")) closeModal(); });
  }

  /* ---------- 10. Subtle tilt effect ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-py * 4).toFixed(2) + "deg) rotateY(" + (px * 4).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- 11. Contact form validation ---------- */
  var form = $("#contactForm");
  if (form) {
    var fields = {
      name:    { el: $("#cName"),    err: $("#errName"),    test: function (v) { return v.trim().length >= 2; },  msg: "Please enter your name (min 2 characters)." },
      email:   { el: $("#cEmail"),   err: $("#errEmail"),   test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: "Please enter a valid email address." },
      subject: { el: $("#cSubject"), err: $("#errSubject"), test: function (v) { return v.trim().length >= 3; },  msg: "Please add a short subject." },
      message: { el: $("#cMessage"), err: $("#errMessage"), test: function (v) { return v.trim().length >= 10; }, msg: "Your message is a little short (min 10 characters)." }
    };

    function validateField(f) {
      var ok = f.test(f.el.value);
      f.el.closest(".field").classList.toggle("invalid", !ok);
      f.err.textContent = ok ? "" : f.msg;
      return ok;
    }

    Object.keys(fields).forEach(function (k) {
      var f = fields[k];
      f.el.addEventListener("blur", function () { validateField(f); });
      f.el.addEventListener("input", function () {
        if (f.el.closest(".field").classList.contains("invalid")) validateField(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = true, firstBad = null;
      Object.keys(fields).forEach(function (k) {
        var ok = validateField(fields[k]);
        if (!ok && !firstBad) firstBad = fields[k].el;
        allOk = allOk && ok;
      });
      if (!allOk) { if (firstBad) firstBad.focus(); toast("Please fix the highlighted fields.", "error"); return; }

      // Prototype behaviour: open the user's mail client with a prefilled draft.
      var name = fields.name.el.value.trim();
      var email = fields.email.el.value.trim();
      var subject = fields.subject.el.value.trim();
      var message = fields.message.el.value.trim();
      var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
      var mailto = "mailto:amirul.hafiz73@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + body;

      toast("Thanks, " + name + "! Opening your email client…", "success");
      form.reset();
      setTimeout(function () { window.location.href = mailto; }, 700);
    });
  }

  /* ---------- 12. Scroll to top ---------- */
  var toTop = $("#toTop");
  if (toTop) {
    window.addEventListener("scroll", function () { toTop.classList.toggle("show", window.scrollY > 600); }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- 13. Lightweight particle field ---------- */
  var canvas = $("#particles");
  if (canvas && !reduceMotion && window.innerWidth > 720) {
    var ctx = canvas.getContext("2d");
    var pts = [], W, H, raf;
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      var count = Math.min(60, Math.floor(W / 26));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.6 + .6 });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,170,255,.6)";
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(130,150,240," + (0.14 * (1 - d / 120)) + ")";
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 200); });
    // pause when tab hidden (save battery)
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) cancelAnimationFrame(raf); else draw();
    });
  }

  /* ---------- 14. Footer year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
