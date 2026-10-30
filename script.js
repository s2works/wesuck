/* ============================================================
   We Suck — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state + scroll progress ---------- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("scrolled", y > 40);

    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
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
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
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
        heroBg.style.transform = "scale(1.12) translateY(" + y * 0.18 + "px)";
      }
    }, { passive: true });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");
  var submitBtn = document.getElementById("formSubmit");

  // "How many seats?" only makes sense for seating — hide it (and disable it,
  // so it's left out of the submission) for other items.
  var interestSelect = document.getElementById("interest");
  var seatsField = document.getElementById("seatsField");
  var seatsSelect = document.getElementById("seats");
  var SEAT_INTERESTS = ["Couch", "Sectional"];

  function updateSeatsVisibility() {
    if (!interestSelect || !seatsField || !seatsSelect) return;
    var show = SEAT_INTERESTS.indexOf(interestSelect.value) !== -1;
    seatsField.hidden = !show;
    seatsSelect.disabled = !show;
  }

  if (interestSelect) {
    interestSelect.addEventListener("change", updateSeatsVisibility);
    updateSeatsVisibility();
  }

  if (form && statusEl) {
    function setStatus(msg, type) {
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
        updateSeatsVisibility();
        setStatus("Thanks — your request is on its way. We'll be in touch shortly.", "success");
      }).catch(function () {
        setStatus("Network error. Please try again, or call/text us.", "error");
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = btnText; }
      });
    });
  }

  /* ---------- Results carousel: arrows advance one card, wrapping at either end ---------- */
  function makeCarousel(grid, prevBtn, nextBtn) {
    if (!grid || !prevBtn || !nextBtn) return;
    function maxScroll() { return grid.scrollWidth - grid.clientWidth; }

    function updateEdges() {
      var overflow = maxScroll() > 4;
      prevBtn.hidden = !overflow;
      nextBtn.hidden = !overflow;
    }

    function cardStep() {
      var first = grid.querySelector(".listing");
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
    window.addEventListener("resize", updateEdges);
    updateEdges();
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
      var duration = setWidth / REVIEWS_SPEED_PX_PER_SEC;
      reviewsTrack.style.setProperty("--reviews-duration", duration + "s");
    }
    sizeReviewsMarquee();
    window.addEventListener("resize", sizeReviewsMarquee);
  }

})();
