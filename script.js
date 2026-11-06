/* ============================================================
   We Suck — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scrolled state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("scrolled", y > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    // Tap outside the panel (on the scrim) to close
    document.addEventListener("click", function (e) {
      if (!document.body.classList.contains("menu-open")) return;
      if (nav.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll(".stat__num[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var start = null;
        var dur = 1400;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ---------- Hero parallax ---------- */
  var heroBg = document.querySelector(".hero__bg");
  if (heroBg && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY || window.pageYOffset;
      if (y < window.innerHeight) {
        heroBg.style.transform = "scale(1.08) translateY(" + y * 0.18 + "px)";
      }
    }, { passive: true });
  }

  /* ---------- Quote forms (hero quick quote + main form) ---------- */
  // "How many seats?" only makes sense for seating — hide it (and disable it,
  // so it's left out of the submission) for other items.
  var SEAT_INTERESTS = ["Couch", "Sectional"];

  function updateSeats(form) {
    var interest = form.querySelector(".js-interest");
    var field = form.querySelector(".js-seats-field");
    var select = form.querySelector(".js-seats");
    if (!interest || !field || !select) return;
    var show = SEAT_INTERESTS.indexOf(interest.value) !== -1;
    field.hidden = !show;
    select.disabled = !show;
  }

  document.querySelectorAll(".js-quote-form").forEach(function (form) {
    var statusEl = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var interest = form.querySelector(".js-interest");

    if (interest) {
      interest.addEventListener("change", function () { updateSeats(form); });
      updateSeats(form);
    }

    function setStatus(msg, type) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = "form-status" + (type ? " form-status--" + type : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Endpoint not configured yet — don't pretend the message was sent.
      if (form.getAttribute("action").indexOf("YOUR_") === 0) {
        setStatus("The form isn't connected yet — please call or text us for now.", "error");
        return;
      }

      var btnText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      setStatus("", "");

      // Fire-and-forget submit (works with Apps Script web apps, which don't
      // return browser-readable CORS responses).
      fetch(form.action, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(form)
      }).then(function () {
        form.reset();
        updateSeats(form);
        setStatus("Thanks — your request is on its way. We'll be in touch shortly.", "success");
      }).catch(function () {
        setStatus("Network error. Please try again, or call/text us.", "error");
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = btnText; }
      });
    });
  });

  // Service / pricing buttons pre-select what needs cleaning in the main form.
  var mainForm = document.getElementById("contactForm");
  var mainInterest = mainForm && mainForm.querySelector(".js-interest");
  if (mainInterest) {
    document.querySelectorAll("[data-interest]").forEach(function (el) {
      el.addEventListener("click", function () {
        mainInterest.value = el.getAttribute("data-interest");
        updateSeats(mainForm);
      });
    });
  }

  /* ---------- Mobile sticky CTA: hidden over the hero and the quote form ---------- */
  var sticky = document.getElementById("stickyCta");
  var hero = document.getElementById("home");
  var contact = document.getElementById("contact");
  if (sticky && hero && contact && "IntersectionObserver" in window) {
    var heroVisible = true, contactVisible = false;
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
      });
      sticky.classList.toggle("show", !heroVisible && !contactVisible);
    }, { threshold: 0.05 });
    sObs.observe(hero);
    sObs.observe(contact);
  }

  /* ---------- Results carousel: arrows advance one card, wrapping at either end ---------- */
  function makeCarousel(grid, prevBtn, nextBtn) {
    if (!grid || !prevBtn || !nextBtn) return;
    var navEl = prevBtn.parentElement;
    function maxScroll() { return grid.scrollWidth - grid.clientWidth; }

    function updateNav() { navEl.hidden = maxScroll() <= 4; }

    function cardStep() {
      var first = grid.firstElementChild;
      if (!first) return grid.clientWidth;
      var gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    [[prevBtn, -1], [nextBtn, 1]].forEach(function (cfg) {
      var btn = cfg[0], dir = cfg[1];
      btn.addEventListener("click", function () {
        var max = maxScroll();
        if (dir < 0 && grid.scrollLeft <= 2) {
          grid.scrollTo({ left: max, behavior: "smooth" });
        } else if (dir > 0 && grid.scrollLeft >= max - 2) {
          grid.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          grid.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
        }
      });
    });
    window.addEventListener("resize", updateNav);
    updateNav();
  }

  makeCarousel(
    document.getElementById("resultsGrid"),
    document.getElementById("resultsPrev"),
    document.getElementById("resultsNext")
  );

  /* ---------- Reviews marquee (continuous auto-scroll) ---------- */
  var reviewsTrack = document.getElementById("reviewsTrack");
  if (reviewsTrack) {
    // Duplicate the original card set once so translating the track exactly
    // -50% loops seamlessly, forever, in one direction.
    var originalReviews = Array.prototype.slice.call(reviewsTrack.children);
    originalReviews.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      reviewsTrack.appendChild(clone);
    });

    // Keep a constant visual speed regardless of how many cards exist.
    var REVIEWS_SPEED_PX_PER_SEC = 40;
    function sizeReviewsMarquee() {
      var setWidth = reviewsTrack.scrollWidth / 2;
      reviewsTrack.style.setProperty("--reviews-duration", setWidth / REVIEWS_SPEED_PX_PER_SEC + "s");
    }
    sizeReviewsMarquee();
    window.addEventListener("resize", sizeReviewsMarquee);
  }

})();
