/* ============================================================
   Coach Veseli – main.js
   ============================================================ */
// ===== NAVBAR: scroll state + mobile menu =====
(function () {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggleBtn = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const iconMenu = document.querySelector(".icon-menu");
  const iconClose = document.querySelector(".icon-close");

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      if (iconMenu && iconClose) {
        iconMenu.style.display = isOpen ? "none" : "block";
        iconClose.style.display = isOpen ? "block" : "none";
      }
    });

    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        if (iconMenu && iconClose) {
          iconMenu.style.display = "block";
          iconClose.style.display = "none";
        }
      });
    });
  }
})();

// ===== SCROLL REVEAL (replaces framer-motion whileInView) =====
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

// ===== COUNTERS (stats section) =====
(function () {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-counter"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const step = Math.ceil(target / 60);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = current + suffix;
      }
    }, 20);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((el) => observer.observe(el));
})();

// ===== SKILL BARS (about page) =====
(function () {
  const bars = document.querySelectorAll(".skill-fill");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const pct = el.getAttribute("data-pct");
          requestAnimationFrame(() => {
            el.style.width = pct + "%";
          });
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((el) => observer.observe(el));
})();

// ===== KONTAKT FORMA (AJAX submit na send.php) =====
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.innerHTML : "";

  const setStatus = (message, isError) => {
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? "#ef4444" : "var(--c-primary)";
    status.style.display = message ? "block" : "none";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setStatus("", false);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Šalje se...";
    }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json().catch(() => ({ success: false, message: "Neočekivan odgovor servera." })))
      .then((data) => {
        setStatus(
          data.message || (data.success ? "Poruka je poslata!" : "Došlo je do greške."),
          !data.success
        );
        if (data.success) form.reset();
      })
      .catch(() => {
        setStatus("Greška u konekciji. Provjeri internet i pokušaj ponovo.", true);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitLabel;
        }
      });
  });
})();

// ===== TESTIMONIALS CAROUSEL =====
(function () {
  const cards = document.querySelectorAll(".testi-card");
  const dots = document.querySelectorAll(".testi-dot");
  const prevBtn = document.querySelector(".testi-nav.prev");
  const nextBtn = document.querySelector(".testi-nav.next");
  if (!cards.length) return;

  let current = 0;
  const total = cards.length;

  const show = (index) => {
    cards.forEach((c, i) => {
      c.classList.remove("active", "leaving-left");
      if (i === index) c.classList.add("active");
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    current = index;
  };

  const next = () => show((current + 1) % total);
  const prev = () => show((current - 1 + total) % total);

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));

  show(0);
  setInterval(next, 45000);
})();
