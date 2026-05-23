(function () {
  "use strict";

  const header = document.getElementById("header");
  const navLinks = document.querySelectorAll("[data-nav]");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const contactForm = document.getElementById("contact-form");
  const cursorGlow = document.querySelector(".cursor-glow");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    updateActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const sections = [...navLinks]
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href")?.slice(1) === current);
    });
  }

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    function animateGlow() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      cursorGlow.style.left = cx + "px";
      cursorGlow.style.top = cy + "px";
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty("--mx", x + "%");
      btn.style.setProperty("--my", y + "%");
    });

    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const cat = card.dataset.category;
        card.classList.toggle("hidden", filter !== "all" && cat !== filter);
      });
    });
  });

  const revealEls = document.querySelectorAll(".reveal, .skill-bar");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.classList.contains("skill-bar")) {
            entry.target.classList.add("in-view");
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  projectCards.forEach((card, i) => {
    card.style.transitionDelay = (i % 4) * 0.08 + "s";
    revealObserver.observe(card);
    card.classList.add("reveal");
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = "<span>Terima kasih! ✓</span>";
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      contactForm.reset();
    }, 2500);
  });

  // Toolkit lock/unlock toggle
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card) => {
    card.addEventListener('click', () => {
      const locked = card.getAttribute('data-locked') === 'true';
      if (locked) {
        card.setAttribute('data-locked', 'false');
        card.classList.remove('skill-card--locked');
        card.classList.add('skill-card--unlocked');
        const lockEl = card.querySelector('.skill-card-lock');
        if (lockEl) lockEl.style.display = 'none';
      } else {
        card.setAttribute('data-locked', 'true');
        card.classList.remove('skill-card--unlocked');
        card.classList.add('skill-card--locked');
        const lockEl = card.querySelector('.skill-card-lock');
        if (lockEl) lockEl.style.display = '';
      }
    });
  });
})();
