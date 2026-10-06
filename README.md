# LaLiga 2026/27 — Landing Page Interactiva 3D

Actividad Integradora: Landing Page Interactiva 3D — tema asignado: **LaLiga**
(Primera División de España).

## Cómo abrir el proyecto

Es un sitio 100% estático (HTML + CSS + JS) — **abre `index.html` con doble
clic y ya**, no hace falta XAMPP ni ningún servidor local. Esto incluye el
Balón de Oro en 3D.

<details>
<summary>Detalle técnico (por si te preguntan en clase por qué no usa un servidor)</summary>

Al principio el balón SÍ necesitaba un servidor local: se cargaba como
archivo `.glb` aparte, y los navegadores (Chrome, Edge) bloquean por
seguridad que una página abierta con doble clic (protocolo `file://`) pida
OTRO archivo local por su cuenta. Se resolvió incrustando el modelo como
texto en `assets/models/ballon-dor.glb.b64.js` — un `<script>` normal, que
SÍ se puede cargar por doble clic sin problema — y `js/ballon3d.js` lo lee
directo desde ahí (ver los comentarios de ese archivo). Si algún día cambias
el modelo `.glb`, hay que regenerar ese archivo `.b64.js` (es el mismo
archivo pero codificado en base64 dentro de una variable de JavaScript).

Si por algún motivo prefieres verla por servidor local de todos modos
(por ejemplo si vas a subir el proyecto a un hosting real más adelante),
con XAMPP: copia la carpeta a `htdocs`, arranca Apache y entra a
`http://localhost/laliga-landing/` — o con Python, `python3 -m http.server
8000` dentro de la carpeta y abre `http://localhost:8000`. Ambos siguen
funcionando igual de bien, pero ya no son obligatorios.
</details>

## Qué incluye

- **`index.html`** — Landing principal: hero con el balón de oro 3D
  interactivo (renderizado con three.js a partir de un archivo `.glb`
  propio), estadísticas de LaLiga, tarjetas de los 4 grandes (con flip 3D
  en CSS) y el carril con los 20 equipos.
- **`equipos/*.html`** — Las 20 sub-páginas de equipo (historia, palmarés,
  rivalidad, estadio y plantilla), generadas automáticamente.
- **`data/teams.js`** — Toda la información de los 20 equipos en un solo
  lugar (historia, títulos, colores, estadio, etc.). **Aquí es donde debes
  editar contenido** (por ejemplo, para poner la plantilla real de un
  equipo — ver `assets/players/LEEME.txt`).
- **`generate.js`** — Script de Node.js que genera las 20 páginas de
  `/equipos` a partir de `data/teams.js`. Si editas los datos, vuelve a
  correr `node generate.js` para regenerar las páginas.
- **`css/`** — Estilos (`base.css` variables y utilidades compartidas,
  `style.css` landing, `equipo.css` sub-páginas).
- **`js/`** — `main.js` (landing), `equipo.js` (sub-páginas), `ballon3d.js`
  (visor 3D del trofeo, con three.js) y `js/vendor/` con las librerías
  incluidas localmente (Anime.js y three.js + sus módulos GLTFLoader/
  OrbitControls) para que el proyecto funcione sin depender de internet
  ni de ningún CDN.
- **`assets/models/ballon-dor.glb`** — El modelo 3D del Balón de Oro
  (descargado de Sketchfab, ver Créditos abajo).
- **`assets/models/ballon-dor.glb.b64.js`** — el mismo modelo de arriba,
  pero copiado como texto (base64) — es lo que la página usa de verdad
  para que el balón cargue incluso abriendo `index.html` con doble clic
  (ver el detalle técnico más arriba). **Importante:** si reemplazas
  `ballon-dor.glb` por otro modelo, este archivo `.b64.js` NO se actualiza
  solo — hay que regenerarlo corriendo `node regen-model-b64.js` (déjalo
  en la carpeta del proyecto) para que la página use el modelo nuevo en
  vez de quedarse con el viejo incrustado.
- **`assets/logos/`, `assets/photos/`, `assets/players/`** — Ya vienen con
  las imágenes reales puestas: los 20 escudos, 2 fotos por equipo (afición/
  estadio) y las fotos de cada jugador de la plantilla. Cada carpeta
  todavía trae su `LEEME.txt` por si más adelante quieres reemplazar
  alguna imagen puntual — basta con guardar un archivo nuevo con el mismo
  nombre exacto y ya, no hace falta tocar código. Si alguna imagen
  faltara, la página no se rompe: muestra un reemplazo genérico (insignia
  con iniciales, ícono de silueta, etc.).
- **`data/rosters.json`** — Los datos de las plantillas reales (número,
  nombre y posición de cada jugador, ~580 en total). `data/teams.js` los
  toma de aquí automáticamente al generar las páginas — si quieres
  corregir un dato de un jugador (por un fichaje nuevo, por ejemplo),
  edítalo en este archivo y vuelve a correr `node generate.js`.

## Cómo cambiar imágenes o datos de jugadores

- Escudos/fotos: guarda el archivo nuevo en `assets/logos/`, `assets/photos/`
  o `assets/players/` con el mismo nombre exacto del que quieres
  reemplazar (ver los `LEEME.txt` de cada carpeta) y recarga la página —
  no hace falta tocar código.
- Plantillas: edita `data/rosters.json` (busca el equipo por su slug) y
  corre `node generate.js` de nuevo para regenerar las 20 sub-páginas.

## Tecnologías usadas (requisitos de la actividad)

- HTML5 semántico (`header`, `main`, `section`, `footer`, `nav`).
- CSS3 con transformaciones 3D reales: tarjetas de los 4 grandes con
  flip 3D (`perspective` + `rotateY`), tilt 3D en los escudos del carril
  y del hero de cada equipo.
- **three.js** (WebGL): el Balón de Oro es un modelo 3D real (`.glb`)
  renderizado directamente en la página — no un iframe ni un visor
  externo. El giro del usuario se limita a horizontal con
  `OrbitControls.minPolarAngle`/`maxPolarAngle` de la propia librería.
  Ver `js/ballon3d.js`.
- **Anime.js** (obligatorio): animaciones de entrada del hero, flotación
  del trofeo, contadores animados, y revelado de secciones al hacer
  scroll — usado en `js/main.js` y `js/equipo.js`.
- Diseño responsivo (probado en escritorio y en móvil ~390px de ancho).

## Fuentes de las imágenes (para citar si tu maestro lo pide)

`FUENTES-IMAGENES.csv` y `FUENTES-JUGADORES.json` (en la raíz del
proyecto) traen, para cada imagen de `assets/`, de dónde salió, el autor,
la licencia y el enlace original. Dos cosas a tener en cuenta:

- Las **fotos de estadios/afición** son de Wikimedia Commons, casi todas
  con licencia CC BY-SA — el CSV trae el autor y el enlace de cada una
  exactamente como pide esa licencia.
- Los **escudos de los clubes** son marcas registradas de cada equipo:
  no tienen una licencia libre como tal, se usan aquí solo con fines
  educativos (identificar a cada club), como es habitual en trabajos
  escolares — el CSV lo aclara en cada fila.

## Créditos

- Modelo 3D "BALLON D'OR" por
  [tahahosseini](https://sketchfab.com/tahahosseini) en
  [Sketchfab](https://sketchfab.com/3d-models/ballon-dor-31aa899c67a74d1aad94e7ec62b39dac),
  licencia [CC Attribution (CC-BY-4.0)](http://creativecommons.org/licenses/by/4.0/).
- Librería 3D: [three.js](https://threejs.org) (MIT license).
- Librería de animación: [Anime.js](https://animejs.com) v3 (MIT license).
- Datos históricos y de palmarés verificados hasta la temporada 2025/26
  (campeón: FC Barcelona). Si tu maestro pide cifras más recientes,
  actualízalas en `data/teams.js` y vuelve a correr `node generate.js`.

## Antes de entregar

- [ ] Escribe tu nombre y grupo en el comentario al inicio de `index.html`.
- [ ] Revisa `data/teams.js` por si quieres ajustar algún dato histórico.
- [ ] Revisa `data/rosters.json` por si algún jugador cambió (fichaje,
      lesión, etc.) desde que se armó la lista.
- [ ] Prueba la página con doble clic en `index.html` antes de entregar —
      incluyendo que el balón 3D cargue y gire.
