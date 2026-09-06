/* =====================================================
   Cast — interaction layer
   Vanilla JS, no dependencies, no build step.
===================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById("site-header");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrolled = window.scrollY > 24;
    header.classList.toggle("is-scrolled", scrolled);
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function closeMenu() {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Active nav link while scrolling ---------- */
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = "#" + entry.target.id;
          const link = navLinks.find((l) => l.getAttribute("href") === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ---------- Hero spotlight (cursor-driven light) ---------- */
  const heroStage = document.getElementById("heroStage");

  if (heroStage && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    heroStage.addEventListener("pointermove", (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroStage.style.setProperty("--spot-x", x + "%");
      heroStage.style.setProperty("--spot-y", y + "%");
    });
  } else if (heroStage) {
    // Touch devices / reduced motion: keep a fixed, gentle glow
    heroStage.style.setProperty("--spot-x", "60%");
    heroStage.style.setProperty("--spot-y", "20%");
  }

  /* ---------- Interactive sun-position demo ---------- */
  const sunSlider = document.getElementById("sunSlider");
  const sunEl = document.getElementById("sunEl");
  const shadowEl = document.getElementById("shadowEl");
  const daylightRoom = document.getElementById("daylightRoom");
  const timeReadout = document.getElementById("timeReadout");

  function formatTime(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h >= 12 ? "pm" : "am";
    const displayHour = ((h + 11) % 12) + 1;
    return `${displayHour}:${m.toString().padStart(2, "0")}${period}`;
  }

  function updateSun(hour) {
    // Map 6 (sunrise) -> 18 (sunset) across a 0-100% arc.
    const progress = (hour - 6) / 12; // 0 to 1
    const sunX = 8 + progress * 84; // percent across the sky
    const arcHeight = Math.sin(progress * Math.PI); // 0 at edges, 1 at noon
    const sunY = 55 - arcHeight * 45; // percent from top

    daylightRoom.style.setProperty("--sun-x", sunX + "%");
    daylightRoom.style.setProperty("--sun-y", sunY + "%");

    // Sky brightens toward noon, darkens toward dawn/dusk
    const brightness = 0.25 + arcHeight * 0.75;
    const topColor = mixColor("#0b0d10", "#3a5a86", brightness);
    const bottomColor = mixColor("#0b0d10", "#0f1520", brightness);
    daylightRoom.style.setProperty("--sky-top", topColor);
    daylightRoom.style.setProperty("--sky-bottom", bottomColor);

    // Shadow lengthens and points away from the sun as it lowers
    const shadowLength = 20 + (1 - arcHeight) * 90;
    const direction = progress < 0.5 ? 1 : -1;
    shadowEl.style.setProperty("--shadow-x", direction * shadowLength * 0.4 + "px");
    shadowEl.style.setProperty("--shadow-scale", (0.6 + (1 - arcHeight) * 1.1).toFixed(2));
    shadowEl.style.setProperty("--shadow-opacity", (0.25 + arcHeight * 0.35).toFixed(2));

    timeReadout.textContent = formatTime(hour);
  }

  function mixColor(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r}, ${g}, ${bl})`;
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }

  if (sunSlider) {
    sunSlider.addEventListener("input", (e) => {
      updateSun(parseFloat(e.target.value));
    });
    updateSun(parseFloat(sunSlider.value));
  }

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll(".stat__value");

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && statEls.length) {
    const statObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statEls.forEach((el) => statObserver.observe(el));
  } else {
    statEls.forEach(animateCount);
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".section-head, .feature-card, .showcase__text, .showcase__demo, .story__mark, .story__content, .final-cta"
  );
  revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Waitlist form (client-side only) ---------- */
  const ctaForm = document.getElementById("ctaForm");
  const ctaStatus = document.getElementById("ctaStatus");

  if (ctaForm) {
    ctaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("ctaEmail");
      const email = emailInput.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValid) {
        ctaStatus.textContent = "Enter a valid work email to continue.";
        ctaStatus.dataset.state = "error";
        emailInput.focus();
        return;
      }

      // No backend on GitHub Pages: this is where you'd wire in
      // a form service such as Formspree, Netlify Forms, or your own API.
      ctaStatus.dataset.state = "success";
      ctaStatus.textContent = `Thanks — we'll reach out at ${email} when your spot opens up.`;
      ctaForm.reset();
    });
  }
})();
