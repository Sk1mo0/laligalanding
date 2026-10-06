#!/usr/bin/env node
/**
 * generate.js
 * -----------------------------------------------------------------------
 * Genera las 20 sub-páginas de equipo (/equipos/<slug>.html) a partir de
 * la plantilla definida en este archivo y los datos de data/teams.js.
 * También genera data/teams-browser.js, que la landing page (index.html)
 * usa para construir el Top 4 y el carril de 20 equipos con JavaScript.
 *
 * Uso:
 *   node generate.js
 *
 * Si editas data/teams.js (por ejemplo para poner el roster real de un
 * equipo, corregir una cifra o añadir un logro), vuelve a correr este
 * comando para regenerar las páginas.
 * -----------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");
const TEAMS = require("./data/teams.js");

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, "equipos");

/* ------------------------- utilidades de color ------------------------- */

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// Brillo perceptual (fórmula YIQ) — usado para decidir texto claro/oscuro
function brightness(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function isLight(hex) {
  return brightness(hex) > 150;
}

function textOn(hex) {
  return isLight(hex) ? "#141414" : "#f5f5f4";
}

// Elige el color "banda" más vistoso y con buen contraste para un equipo
function pickBand(colors) {
  const candidates = [colors.primary, colors.secondary, colors.accent].filter(Boolean);
  const nonLight = candidates.find((c) => !isLight(c));
  return nonLight || candidates[candidates.length - 1] || "#141414";
}

function fmtNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* --------------------------- escudo (crest) --------------------------- */

function getInitials(name) {
  const stop = ["CF", "FC", "CD", "RC", "RCD", "UD", "CA", "DE", "REAL", "CLUB", "BALOMPIÉ"];
  const parts = name
    .toUpperCase()
    .split(" ")
    .filter((w) => w && !stop.includes(w));
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

function crestHTML(team, big) {
  const initials = getInitials(team.name);
  const size = big ? "" : "";
  return `<img src="../assets/logos/${team.slug}.png" alt="Escudo de ${team.name}" class="crest-img" style="width:100%;height:100%;object-fit:contain;border-radius:50%;" onerror="this.onerror=null;this.outerHTML='<div class=&quot;crest-fallback&quot; style=&quot;--c1:${team.colors.primary};--c2:${team.colors.secondary}&quot;>${initials}</div>';" />`;
}

/* --------------------------- bloques repetibles --------------------------- */

function doodles() {
  return `
    <svg class="doodle" style="top:-6%; right:8%;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 19L19 5M19 5H9M19 5v10" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <svg class="doodle" style="bottom:-4%; left:4%;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>`;
}

function titlesOrAchievements(team) {
  if (team.titles && team.titles.length > 0) {
    return team.titles
      .map(
        (t) => `
      <div class="title-card">
        <p class="title-num" data-count="${t.count}">0</p>
        <p class="title-label">${t.label}</p>
      </div>`
      )
      .join("");
  }
  return team.achievements
    .map(
      (a) => `
      <div class="title-card is-achievement">
        <p class="title-num">★</p>
        <p class="title-label">${a}</p>
      </div>`
    )
    .join("");
}

function achievementsList(team) {
  return team.achievements.map((a) => `<li>${a}</li>`).join("");
}

// Fila de la plantilla: si data/teams.js define team.roster (array de
// {num, name, role}), se usa esa información real. Si no, se generan
// filas de ejemplo para que Adrián las reemplace fácilmente.
function rosterRows(team) {
  const placeholderRoles = ["Portero", "Defensa", "Centrocampista", "Delantero", "Delantero"];
  const rows =
    team.roster && team.roster.length
      ? team.roster
      : placeholderRoles.map((role, i) => ({ num: i + 1, name: "Nombre del jugador", role }));

  return rows
    .map(
      (p, i) => `
      <div class="roster-row">
        <span class="roster-num">${p.num}</span>
        <span class="roster-photo">
          <!--
            Foto del jugador ${i + 1}: guarda una imagen cuadrada en
            assets/players/${team.slug}-${p.num}.jpg y descomenta el <img>
            de abajo (o simplemente agrega el archivo: si existe, se
            mostrará automáticamente en vez del ícono de silueta).
          -->
          <img src="../assets/players/${team.slug}-${p.num}.jpg" alt="${p.name}"
            onerror="this.onerror=null;this.outerHTML='<span class=&quot;photo-placeholder&quot;>🧑</span>';" />
        </span>
        <span class="roster-name">${p.name}</span>
        <span class="roster-role">${p.role}</span>
      </div>`
    )
    .join("");
}

/* ------------------------------ plantilla HTML ------------------------------ */

function renderTeamPage(team) {
  const band = pickBand(team.colors);
  const bandText = textOn(band);
  const rival = team.rival || "Por definir";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${team.name} — Historia, títulos y datos | LaLiga 26/27</title>
<meta name="description" content="Historia, palmarés, estadio y datos de ${team.name}, club de LaLiga temporada 2026/27." />

<!--
  Sub-página generada automáticamente por generate.js a partir de
  data/teams.js (equipo: ${team.slug}). No edites este archivo a mano:
  tus cambios se perderán la próxima vez que se corra "node generate.js".
  Para cambiar contenido, edita data/teams.js y vuelve a generar.
-->

<link rel="stylesheet" href="../css/base.css" />
<link rel="stylesheet" href="../css/equipo.css" />
</head>
<body class="team-page" style="--team-band:${band}; --team-band-text:${bandText};">

<a class="visually-hidden" href="#contenido">Saltar al contenido</a>

<header class="team-topbar">
  <div class="container">
    <a href="../index.html" class="back-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      LaLiga 26/27
    </a>
    <nav class="pill-nav" aria-label="Secciones del equipo">
      <a href="#historia">Historia</a>
      <a href="#palmares">Palmarés</a>
      <a href="#estadio">Estadio</a>
      <a href="#plantilla">Plantilla</a>
    </nav>
  </div>
</header>

<main id="contenido">

  <!-- ============================= HERO ============================= -->
  <section class="team-hero">
    <div class="section-watermark" aria-hidden="true"><span>${team.name}</span></div>
    <div class="team-hero-content">
      <div class="team-crest-xl" data-reveal>
        <div class="crest-inner">${crestHTML(team, true)}</div>
      </div>
      <p class="eyebrow">${team.category}</p>
      <h1>${team.name}</h1>
      <p class="team-meta">
        <span>${team.nickname}</span>
        <span>${team.city}</span>
        <span>Fundado en ${team.founded}</span>
      </p>
    </div>
  </section>

  <!-- ============================ HISTORIA ============================ -->
  <section id="historia" class="section-paper torn-edge" style="--tear-color:${band};">
    <div class="section-watermark" aria-hidden="true"><span>Historia</span></div>
    <div class="container history-grid">
      <div style="position:relative;" data-reveal>
        <p class="founded-year">${team.founded}</p>
        <p class="founded-caption">Año de fundación del club</p>
        ${doodles()}
      </div>
      <div class="history-copy" data-reveal data-reveal-delay="120">
        <p class="eyebrow">${team.nickname}</p>
        <h2>Una breve historia</h2>
        <p>${team.history}</p>
      </div>
    </div>
  </section>

  <!-- ===================== MOMENTO / ORGULLO DEL EQUIPO ===================== -->
  <section id="momento" class="section-band">
    <div class="section-watermark" aria-hidden="true"><span>Orgullo</span></div>
    <div class="container">
      <h2 class="pride-headline" data-reveal>Fieles a los <em>colores</em><br>de ${team.city}</h2>
      <div class="collage" data-reveal data-reveal-delay="150">
        <div class="collage-photo">
          <!--
            Foto 1 (acción / afición): guarda una imagen en
            assets/photos/${team.slug}-1.jpg (vertical, ideal 3:4) y
            descomenta o simplemente agrega el archivo: se mostrará
            automáticamente en cuanto exista.
          -->
          <img src="../assets/photos/${team.slug}-1.jpg" alt="Foto de ${team.name}"
            onerror="this.onerror=null;this.parentElement.innerHTML='<span class=&quot;photo-placeholder&quot;>📷<br>Foto pendiente<br>(${team.slug}-1.jpg)</span>';" />
        </div>
        <div class="collage-photo">
          <!--
            Foto 2 (estadio / celebración): guarda una imagen en
            assets/photos/${team.slug}-2.jpg (vertical, ideal 3:4).
          -->
          <img src="../assets/photos/${team.slug}-2.jpg" alt="Foto de ${team.name}"
            onerror="this.onerror=null;this.parentElement.innerHTML='<span class=&quot;photo-placeholder&quot;>📷<br>Foto pendiente<br>(${team.slug}-2.jpg)</span>';" />
        </div>
      </div>
    </div>
  </section>

  <!-- ============================= PALMARÉS ============================= -->
  <section id="palmares" class="section-dark torn-edge" style="--tear-color:${isLight(band) ? "#f1ede3" : band};">
    <div class="section-watermark" aria-hidden="true"><span>Palmarés</span></div>
    <div class="container">
      <p class="eyebrow">Títulos y logros</p>
      <h2 style="margin-top:14px;">${team.titles.length ? "Vitrina de títulos" : "Momentos que hicieron historia"}</h2>
      <div class="titles-grid" data-reveal>
        ${titlesOrAchievements(team)}
      </div>
    </div>
  </section>

  <!-- ========================== RIVAL HISTÓRICO ========================== -->
  <section class="section-paper">
    <div class="container" style="text-align:center;">
      <p class="eyebrow" style="justify-content:center;">La rivalidad</p>
      <h2 style="margin-top:14px;">El duelo que enciende a la afición</h2>
      <div class="rival-box" data-reveal>
        <div class="rival-card"><strong>${team.name}</strong></div>
        <span class="vs">VS</span>
        <div class="rival-card"><strong>${rival}</strong></div>
      </div>
    </div>
  </section>

  <!-- ============================== ESTADIO ============================== -->
  <section id="estadio" class="section-band">
    <div class="section-watermark" aria-hidden="true"><span>Estadio</span></div>
    <div class="container stadium-grid">
      <div class="stadium-map" data-reveal aria-hidden="true">
        <!-- Mapa ilustrativo (no interactivo) para no depender de servicios
             externos. Si quieres un mapa real, puedes incrustar aquí un
             iframe de Google Maps con la dirección del estadio. -->
      </div>
      <div class="stadium-facts" data-reveal data-reveal-delay="120">
        <div class="fact"><span>Estadio</span><b>${team.stadium.name}</b></div>
        <div class="fact"><span>Capacidad</span><b>${fmtNumber(team.stadium.capacity)} espectadores</b></div>
        <div class="fact"><span>Ciudad</span><b>${team.city}</b></div>
        <div class="fact"><span>Club fundado</span><b>${team.founded}</b></div>
        <a class="btn" style="margin-top:10px; border-color: var(--team-band-text); color: var(--team-band-text);"
          href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(team.stadium.name + ", " + team.city + ", España")}"
          target="_blank" rel="noopener">Cómo llegar</a>
      </div>
    </div>
  </section>

  <!-- ============================= PLANTILLA ============================= -->
  <section id="plantilla" class="section-dark">
    <div class="section-watermark" aria-hidden="true"><span>Plantilla</span></div>
    <div class="container">
      <p class="eyebrow">Temporada 2026 / 27</p>
      <h2 style="margin-top:14px;">Plantilla del primer equipo</h2>
      <p style="color:var(--grey); max-width:56ch; margin-top:10px;">
        <!-- Estas filas son un ejemplo: edita el arreglo "roster" del equipo
             en data/teams.js con los jugadores reales (número, nombre,
             posición) y vuelve a correr "node generate.js". -->
        Datos de ejemplo — reemplázalos con la plantilla real en data/teams.js.
      </p>
      <div class="roster-list" data-reveal>
        ${rosterRows(team)}
      </div>
    </div>
  </section>

</main>

<footer class="team-footer">
  <p><a href="../index.html">← Volver a LaLiga 26/27</a></p>
  <p style="margin-top:8px;">Actividad Integradora · Landing Page Interactiva 3D</p>
</footer>

<script src="../js/vendor/anime.min.js"></script>
<script src="../js/equipo.js"></script>
</body>
</html>
`;
}

/* --------------------------------- runner --------------------------------- */

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  TEAMS.forEach((team) => {
    const html = renderTeamPage(team);
    fs.writeFileSync(path.join(OUT_DIR, `${team.slug}.html`), html, "utf8");
  });

  // Versión "para navegador" de los datos (usada por index.html / main.js)
  const browserJS = `/* Generado automáticamente por generate.js a partir de data/teams.js. No editar a mano. */\nwindow.LALIGA_TEAMS = ${JSON.stringify(TEAMS, null, 2)};\n`;
  fs.writeFileSync(path.join(ROOT, "data", "teams-browser.js"), browserJS, "utf8");

  console.log(`Generadas ${TEAMS.length} sub-páginas en /equipos y data/teams-browser.js`);
}

main();
