/* ==========================================================================
   equipo.js — Comportamiento e interactividad de las sub-páginas de equipo
   Requiere: js/vendor/anime.min.js cargado antes que este archivo.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------- Tilt 3D del escudo del hero ---------------------- */
  function setupCrestTilt() {
    var wrap = document.querySelector(".team-crest-xl");
    var inner = wrap && wrap.querySelector(".crest-inner");
    if (!wrap || !inner) return;

    wrap.addEventListener("mousemove", function (e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform =
        "rotateY(" + (x * 34).toFixed(2) + "deg) rotateX(" + (-y * 34).toFixed(2) + "deg)";
    });
    wrap.addEventListener("mouseleave", function () {
      inner.style.transform = "";
    });
  }

  /* ---------------------- Entrada del hero con Anime.js ---------------------- */
  function animateHero() {
    if (typeof anime === "undefined") return;
    anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: ".team-crest-xl",
        opacity: [0, 1],
        scale: [0.6, 1],
        rotate: [-12, 0],
        duration: 800,
      })
      .add(
        {
          targets: ".team-hero .eyebrow, .team-hero h1, .team-hero .team-meta",
          opacity: [0, 1],
          translateY: [26, 0],
          duration: 700,
          delay: anime.stagger(110),
        },
        "-=450"
      );
  }

  /* ---------------------- Revelado al hacer scroll ---------------------- */
  function animateScrollReveals() {
    if (typeof anime === "undefined") return;

    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    targets.forEach(function (el) {
      el.style.opacity = "0";
    });

    var obs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          anime({
            targets: el,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 750,
            delay: delay,
            easing: "easeOutQuad",
          });
          observer.unobserve(el);
        });
      },
      { threshold: 0.05 }
    );

    targets.forEach(function (el) {
      obs.observe(el);
    });
  }

  /* ---------------------- Conteo animado del palmarés ---------------------- */
  function runTitleCounter(el) {
    if (el.dataset.counted === "1") return;
    el.dataset.counted = "1";
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (typeof anime === "undefined") {
      el.textContent = target;
      return;
    }
    var counter = { val: 0 };
    anime({
      targets: counter,
      val: target,
      round: 1,
      duration: 1200,
      easing: "easeOutExpo",
      update: function () {
        el.textContent = counter.val;
      },
    });
  }

  function animateTitleCounters() {
    var nums = document.querySelectorAll(".title-num[data-count]");
    if (!nums.length) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runTitleCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    nums.forEach(function (el) {
      obs.observe(el);
    });

    setTimeout(function () {
      nums.forEach(runTitleCounter);
    }, 3000);
  }

  // Red de seguridad: si el navegador no dispara el IntersectionObserver
  // (o Anime.js no cargó), nos aseguramos de que ningún contenido quede
  // invisible para siempre.
  function revealFallback() {
    document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]').forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupCrestTilt();
    animateHero();
    animateScrollReveals();
    animateTitleCounters();
    setTimeout(revealFallback, 2200);
    window.addEventListener("beforeprint", revealFallback);
  });
})();
