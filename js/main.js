/* ==========================================================================
   main.js — Landing page principal (LaLiga 2026/27)
   Requiere: js/vendor/anime.min.js y data/teams-browser.js cargados antes.
   ========================================================================== */

(function () {
  "use strict";

  var TEAMS = window.LALIGA_TEAMS || [];

  /* ------------------------------------------------------------------
     IMÁGENES — cómo funciona el sistema de escudos
     ------------------------------------------------------------------
     Cada escudo se intenta cargar primero como imagen real desde
     assets/logos/<slug>.png. Si el archivo no existe (que es el estado
     inicial del proyecto), el <img> dispara "onerror" y lo sustituimos
     automáticamente por una insignia de respaldo con las iniciales del
     equipo y sus colores oficiales — así la página nunca se ve rota.

     PARA ADRIÁN: para usar los escudos reales,
       1) Descarga el escudo oficial de cada club en PNG con fondo
          transparente (Wikipedia > ficha del club, o el sitio oficial).
       2) Guárdalo en assets/logos/ con el nombre exacto "<slug>.png"
          (ej. assets/logos/real-madrid.png). Los 20 slugs están en
          data/teams.js.
       3) Recarga la página: los escudos reales reemplazan automático
          a las insignias de iniciales. No hay que tocar el código.
     Tamaño recomendado: 256x256 px, fondo transparente.
     ------------------------------------------------------------------ */

  function getInitials(name) {
    var stop = ["CF", "FC", "CD", "RC", "RCD", "UD", "CA", "DE", "REAL", "CLUB", "BALOMPIÉ"];
    var parts = name
      .toUpperCase()
      .split(" ")
      .filter(function (w) {
        return w && stop.indexOf(w) === -1;
      });
    if (parts.length === 0) return name.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2);
    return parts[0][0] + parts[1][0];
  }

  function crestHTML(team, sizeClass) {
    var initials = getInitials(team.name);
    var c1 = team.colors.primary;
    var c2 = team.colors.secondary;
    return (
      '<div class="crest-wrap ' + (sizeClass || "") + '">' +
      '<img src="assets/logos/' + team.slug + '.png" alt="Escudo de ' + team.name + '" ' +
      'class="crest-img" style="width:100%;height:100%;object-fit:contain;border-radius:50%;" ' +
      'onerror="this.onerror=null;this.outerHTML=\'' +
      '<div class=&quot;crest-fallback&quot; style=&quot;--c1:' + c1 + ';--c2:' + c2 + '&quot;>' + initials + '</div>' +
      "';\" />" +
      "</div>"
    );
  }

  /* ---------------------- Render Top 4 ---------------------- */
  function renderTop4() {
    var grid = document.getElementById("top4Grid");
    if (!grid) return;
    var top4 = TEAMS.filter(function (t) {
      return t.isTop4;
    });

    grid.innerHTML = top4
      .map(function (team) {
        var titlesLi = team.titles
          .slice(0, 4)
          .map(function (t) {
            return "<li>" + t.label + " <b>" + t.count + "</b></li>";
          })
          .join("");

        return (
          '<article class="flip-card">' +
          '<div class="flip-card-inner">' +
          '<div class="flip-face flip-front" style="--c1:' + team.colors.secondary + ";--c2:#0a0a0a\">" +
          crestHTML(team, "") +
          "<div>" +
          "<h3>" + team.name + "</h3>" +
          '<p class="team-category">' + team.category + "</p>" +
          "</div>" +
          '<span class="flip-cue">Voltear ↻</span>' +
          "</div>" +
          '<div class="flip-face flip-back">' +
          "<div>" +
          "<h4>Palmarés</h4>" +
          '<ul class="titles-mini">' + titlesLi + "</ul>" +
          "</div>" +
          '<a class="view-link" href="equipos/' + team.slug + '.html">Ver página completa →</a>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------------------- Render carril de 20 equipos ----------------------
     Rediseñado a pedido para que se vean "más 3D", tipo tarjeta de
     colección: foto de fondo (assets/photos/<slug>-1.jpg, la misma que ya
     se usa en la sub-página del equipo) teñida con los colores del club,
     brillo tipo plástico/cristal que se desliza, y una inclinación de
     "abanico" fija (cada tarjeta nace un poco girada, alternando de lado,
     como una baraja desplegada) que se endereza y "salta" hacia adelante
     al pasar el mouse — combinando la pose fija con el tilt dinámico
     mediante variables CSS (--fan-... para la pose de reposo, --tilt-...
     y --pop-... para el hover) en vez de pisar el transform completo
     desde JS. */
  var FAN_ANGLES = [-7, 4, -3, 7, -5, 2, -8, 5];
  var FAN_OFFSETS = [10, -8, 6, -12, 8, -4, 11, -7];

  // Sin mouse (pantallas táctiles) no hay forma de "enderezar" una
  // tarjeta al pasar el cursor, así que ahí el abanico de reposo se
  // desactiva (nacen derechas) — se calcula una sola vez al cargar.
  var SUPPORTS_FAN =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (min-width: 721px)").matches;

  function teamCardHTML(team, index) {
    var fanRot = SUPPORTS_FAN ? FAN_ANGLES[index % FAN_ANGLES.length] : 0;
    var fanY = SUPPORTS_FAN ? FAN_OFFSETS[index % FAN_OFFSETS.length] : 0;
    var c1 = team.colors.primary;
    var c2 = team.colors.secondary;
    var photo = "assets/photos/" + team.slug + "-1.jpg";

    return (
      '<a class="team-chip" href="equipos/' + team.slug + '.html" data-tilt ' +
      'style="--fan-rot:' + fanRot + "deg;--fan-y:" + fanY + 'px;--c1:' + c1 + ";--c2:" + c2 + '">' +
        '<div class="team-chip__media">' +
          '<img src="' + photo + '" alt="" loading="lazy" ' +
          'onerror="this.onerror=null;this.style.display=\'none\';this.parentElement.classList.add(\'no-photo\');" />' +
        "</div>" +
        '<div class="team-chip__tint" aria-hidden="true"></div>' +
        '<div class="team-chip__scrim" aria-hidden="true"></div>' +
        '<div class="team-chip__sheen" aria-hidden="true"></div>' +
        '<div class="team-chip__top">' +
          crestHTML(team, "team-chip__crest") +
        "</div>" +
        '<div class="team-chip__body">' +
          '<span class="team-chip__name">' + team.name + "</span>" +
          '<span class="team-chip__city">' + team.city + "</span>" +
          '<span class="team-chip__cue">Ver equipo →</span>' +
        "</div>" +
      "</a>"
    );
  }

  function renderCarousel() {
    var track = document.getElementById("carouselTrack");
    if (!track) return;

    track.innerHTML = TEAMS.map(function (team, i) {
      return teamCardHTML(team, i);
    }).join("");

    // Tilt 3D dinámico al mover el mouse (se suma a la pose de abanico fija
    // de arriba, no la reemplaza — ver --fan-rot/--fan-y en la regla base
    // de .team-chip en css/style.css). Al salir el mouse, la tarjeta no
    // vuelve a quedar plana: vuelve a su pose de abanico.
    var chips = track.querySelectorAll("[data-tilt]");
    chips.forEach(function (chip) {
      chip.addEventListener("mousemove", function (e) {
        var r = chip.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        chip.style.setProperty("--tilt-x", (-y * 16).toFixed(2) + "deg");
        chip.style.setProperty("--tilt-y", (x * 16).toFixed(2) + "deg");
        chip.style.setProperty("--pop-z", "36px");
        chip.style.setProperty("--pop-scale", "1.05");
        chip.style.setProperty("--glare-x", ((x + 0.5) * 100).toFixed(1) + "%");
        chip.style.setProperty("--glare-y", ((y + 0.5) * 100).toFixed(1) + "%");
      });
      chip.addEventListener("mouseleave", function () {
        chip.style.setProperty("--tilt-x", "0deg");
        chip.style.setProperty("--tilt-y", "0deg");
        chip.style.setProperty("--pop-z", "0px");
        chip.style.setProperty("--pop-scale", "1");
      });
    });
  }

  /* ---------------------- Carrusel: botones prev/next ---------------------- */
  function setupCarouselControls() {
    var track = document.getElementById("carouselTrack");
    var prev = document.getElementById("prevBtn");
    var next = document.getElementById("nextBtn");
    if (!track || !prev || !next) return;

    var step = 340; // tarjetas más anchas ahora (ver .team-chip en css/style.css)
    prev.addEventListener("click", function () {
      track.scrollBy({ left: -step, behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      track.scrollBy({ left: step, behavior: "smooth" });
    });
  }

  /* ---------------------- Menú móvil ---------------------- */
  function setupNavToggle() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------- Animaciones con Anime.js ---------------------- */
  function animateHero() {
    if (typeof anime === "undefined") return;

    anime.timeline({ easing: "easeOutExpo" })
      .add({
        targets: "#heroTitle .line span",
        translateY: ["110%", "0%"],
        duration: 900,
        delay: anime.stagger(120),
      })
      .add(
        {
          targets: ".hero-sub, .hero-cta, .eyebrow",
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 700,
          delay: anime.stagger(90),
        },
        "-=500"
      )
      .add(
        {
          // OJO: Anime.js NUNCA debe animar .ballon-stage directamente:
          // ese elemento se centra con transform: translateX(-50%) puesto
          // en CSS (ver style.css), y en cuanto Anime.js le escribe
          // cualquier cosa a su "transform" inline (aunque sea "none")
          // se pierde el centrado. Por eso la aparición (fade + zoom) se
          // hace en #ballonInner, un hijo que no tiene transform propio
          // que proteger.
          targets: "#ballonInner",
          opacity: [0, 1],
          scale: [0.85, 1],
          duration: 900,
        },
        "-=450"
      );

    // Flotación continua del trofeo 3D (transform CSS animado con Anime.js)
    anime({
      targets: "#ballonWrap",
      translateY: [-10, 10],
      rotateZ: [-1.4, 1.4],
      duration: 3600,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
    });

    anime({
      targets: ".ballon-glow",
      scale: [0.94, 1.06],
      opacity: [0.55, 0.9],
      duration: 2600,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
    });
  }

  function runCounter(el) {
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
      duration: 1400,
      easing: "easeOutExpo",
      update: function () {
        el.textContent = counter.val;
      },
    });
  }

  function animateCounters() {
    var cards = document.querySelectorAll(".stat-num");
    if (!cards.length) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(function (c) {
      obs.observe(c);
    });

    // Red de seguridad: si el observer no dispara (scroll muy rápido,
    // navegador atípico), forzamos el conteo tras un momento.
    setTimeout(function () {
      cards.forEach(runCounter);
    }, 3000);
  }

  function animateScrollReveals() {
    if (typeof anime === "undefined") return;

    // OJO con .team-chip: a diferencia de .flip-card, esa tarjeta YA
    // tiene su propio transform permanente en CSS (la pose de abanico +
    // el tilt de hover, manejados con variables --fan-*/--tilt-*/--pop-*
    // en style.css). Anime.js escribe la propiedad "transform" COMPLETA
    // como estilo inline al animar "translateY" — eso pisaba y borraba
    // el abanico apenas la tarjeta entraba en pantalla (se veían todas
    // derechas). Por eso aquí .team-chip solo anima opacity, nunca
    // translateY/transform.
    var groups = [
      { selector: ".flip-card", translateY: 40 },
      { selector: ".team-chip", translateY: 0 },
    ];

    groups.forEach(function (group) {
      var els = document.querySelectorAll(group.selector);
      if (!els.length) return;

      els.forEach(function (el) {
        el.style.opacity = "0";
      });

      var obs = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var animConfig = {
              targets: entry.target,
              opacity: [0, 1],
              duration: 700,
              easing: "easeOutQuad",
              delay: 60,
            };
            if (group.translateY) {
              animConfig.translateY = [group.translateY, 0];
            }
            anime(animConfig);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.05 }
      );

      els.forEach(function (el) {
        obs.observe(el);
      });
    });
  }

  // Red de seguridad: si por alguna razón el navegador no dispara el
  // IntersectionObserver (o Anime.js no cargó), nos aseguramos de que
  // ningún contenido quede invisible para siempre. Se usa removeProperty
  // en vez de pisar con "none": en .team-chip el transform de verdad
  // (abanico + tilt) vive en CSS con variables --fan-*/--tilt-*/--pop-*,
  // así que sacar el inline style deja que ese transform de CSS se vea;
  // en .flip-card no hay transform propio, así que el resultado visual
  // es el mismo que poner "none".
  function revealFallback() {
    document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]').forEach(function (el) {
      el.style.opacity = "1";
      el.style.removeProperty("transform");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTop4();
    renderCarousel();
    setupCarouselControls();
    setupNavToggle();
    animateHero();
    animateCounters();
    animateScrollReveals();
    setTimeout(revealFallback, 2200);
    window.addEventListener("beforeprint", revealFallback);
  });
})();
