/* ==========================================================================
   ballon3d.js — Balón de Oro en 3D real, con three.js (sin Sketchfab)
   ==========================================================================
   Qué cambió respecto a la versión anterior (la del iframe de Sketchfab):
   ahora el modelo se descargó como archivo .glb (assets/models/ballon-dor.glb)
   y lo dibujamos nosotros mismos con three.js, la misma librería que usa
   Sketchfab por dentro. Ventajas directas de este cambio:

   1) Ya no aparece ninguna barra/UI ajena (título, compartir, cerrar) — el
      <canvas> que se ve es 100% nuestro, sin nada superpuesto.
   2) El giro se limita con OrbitControls.minPolarAngle/maxPolarAngle, que
      es una función real y bien documentada de three.js — no un ajuste
      manual con nombres adivinados. Con min = max, es FÍSICAMENTE
      imposible inclinar la cámara arriba/abajo (el giro de lado a lado
      sigue libre).
   3) Ya no depende de internet en tiempo real: el .glb es un archivo del
      proyecto, así que carga rápido y funciona sin conexión.
   4) El zoom con scroll también se bloqueó (enableZoom=false): el tamaño
      del trofeo es fijo, el usuario no lo puede achicar/agrandar — solo
      girarlo de lado a lado.

   SOBRE ABRIR EL ARCHIVO CON DOBLE CLIC (file://): al principio esto SÍ
   requería un servidor local (XAMPP), porque el navegador bloquea que una
   página cargue OTRO archivo local con fetch/XHR bajo el protocolo
   file://. Para no depender de eso, el modelo ahora también viene
   incrustado como texto en assets/models/ballon-dor.glb.b64.js (ver ese
   archivo) — un <script> normal SÍ se puede cargar por doble clic sin
   problema. Este archivo intenta usar esa versión incrustada primero
   (variable global window.__BALLON_MODEL_B64__) y solo si no la
   encuentra, intenta pedir el .glb por separado (MODEL_URL) — eso sigue
   necesitando servidor local, pero ya es solo un respaldo, no lo normal.
   ========================================================================== */

import * as THREE from "./vendor/three/three.module.min.js";
import { GLTFLoader } from "./vendor/three/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./vendor/three/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "./vendor/three/jsm/environments/RoomEnvironment.js";

(function () {
  "use strict";

  var MODEL_URL = "assets/models/ballon-dor.glb";

  // Ángulo de inclinación (medido desde arriba) donde queda "congelada"
  // la cámara: ~76° es casi de frente, viendo apenas un poco desde arriba
  // — se ve el trofeo derecho, sin sensación de estar flotando raro.
  var LOCKED_POLAR_DEG = 76;
  var INITIAL_AZIMUTH_DEG = 22;

  var container = document.getElementById("ballonInner");
  var loader = document.getElementById("ballonLoader");
  var loaderText = document.getElementById("ballonLoaderText");

  if (!container) return;

  function hideLoader() {
    if (loader) loader.classList.add("is-hidden");
  }

  function showLoadError() {
    if (loaderText) {
      loaderText.textContent =
        "El trofeo no carga porque esta página se abrió como archivo " +
        "(file:///...) — mira la barra de direcciones. Con XAMPP ya " +
        "instalado: abre el Panel de Control, dale \"Start\" a Apache, y " +
        "entra por http://localhost/laliga-landing/ en vez de abrir " +
        "index.html con doble clic (ver README.md).";
    }
    if (loader) {
      loader.classList.remove("is-hidden");
      loader.classList.add("is-error");
    }
  }

  // Red de seguridad: si el modelo no cargó (ni éxito ni error) después
  // de un rato, no dejamos el spinner girando para siempre — se asume
  // que algo salió mal (típicamente abrir con file:// en vez de por
  // servidor local, ver showLoadError) y se muestra el aviso igual,
  // aunque GLTFLoader nunca haya llegado a disparar su propio onError.
  var loadSettled = false;
  var loadTimeoutId = setTimeout(function () {
    if (!loadSettled) showLoadError();
  }, 8000);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.55;
  renderer.setClearColor(0x000000, 0); // fondo transparente: se ve la página detrás
  container.appendChild(renderer.domElement);

  // Iluminación de ambiente (image-based lighting): el material del
  // trofeo es metálico (oro/plata) y SIN un "entorno" que reflejar se ve
  // casi negro, por más luces que le pongamos — este truco genera un
  // estudio simple con three.js mismo, sin necesitar descargar ningún
  // archivo HDRI externo.
  var pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // Un par de luces suaves extra, para que el brillo tenga algo de
  // dirección y no se vea totalmente plano.
  var keyLight = new THREE.DirectionalLight(0xfff4e0, 1.6);
  keyLight.position.set(3, 6, 4);
  scene.add(keyLight);

  var rimLight = new THREE.DirectionalLight(0xffd27a, 0.9);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  var fillLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(fillLight);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  // Tamaño bloqueado a pedido: con enableZoom=false, la rueda del mouse
  // (o el pellizco en móvil) ya no acerca/aleja el trofeo — el usuario
  // solo puede girarlo de lado a lado, el tamaño se queda fijo siempre.
  controls.enableZoom = false;
  controls.minDistance = 0.1; // se ajusta de verdad una vez cargado el modelo
  controls.maxDistance = 100;
  var lockedPolar = THREE.MathUtils.degToRad(LOCKED_POLAR_DEG);
  controls.minPolarAngle = lockedPolar;
  controls.maxPolarAngle = lockedPolar;

  function frameModel(object) {
    var box = new THREE.Box3().setFromObject(object);
    var size = box.getSize(new THREE.Vector3());
    var maxHorizontal = Math.max(size.x, size.z) || 1;

    var fovRad = (camera.fov * Math.PI) / 180;

    // Encuadre MUY ajustado a propósito: el margen normal (que centra el
    // objeto completo con aire alrededor) hacía que la base del trofeo
    // quedara bien arriba, sin llegar nunca al borde inferior del
    // contenedor — y por eso no se veía "incrustada" detrás de la
    // siguiente sección (el recorte de .ballon-stage en CSS solo tapa
    // los PÍXELES que de verdad caen en esa franja, no algo automático).
    // Con poco margen vertical Y el punto al que mira la cámara corrido
    // hacia la parte de ARRIBA del trofeo (no al centro), la base queda
    // empujada hacia abajo en el encuadre, tocando/pasándose el borde
    // inferior — ahí sí la tapa de verdad el fondo de la sección de
    // abajo. Se ajustó a ojo viendo capturas; si алgún día se cambia el
    // modelo o el tamaño de .ballon-stage, puede que haga falta retocar
    // estos números (verticalFill / targetBias / bottomMargin).
    // Encuadre más ajustado todavía (a pedido: "más grande, casi como lo
    // agrandé yo con el scroll") — poco margen en los cuatro lados.
    var verticalFill = size.y * 1.05;
    var distanceForHeight = verticalFill / 2 / Math.tan(fovRad / 2);
    var distanceForWidth = (maxHorizontal / 2 / Math.tan(fovRad / 2)) * 1.12;
    var distance = Math.max(distanceForHeight, distanceForWidth);

    // targetBias corregido: con 0.62 (valor calibrado para el modelo
    // anterior) la cámara quedaba mirando tan arriba que la base entera
    // caía FUERA del frustum (el cono de visión de la cámara) — no es que
    // la tapara la siguiente sección, es que directamente no se dibujaba
    // ningún píxel de la base. Con este modelo nuevo (proporción distinta
    // entre balón y base) 0.56 sí deja la base completa dentro del
    // frustum: la mayor parte queda tapada por .liga-info como se quiere,
    // pero un pedazo (las "piedras"/base plateada) asoma justo arriba de
    // esa costura.
    var targetBias = 0.56; // 0 = base del trofeo, 1 = punta de arriba
    var target = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      box.min.y + size.y * targetBias,
      (box.min.z + box.max.z) / 2
    );

    var polar = lockedPolar;
    var azimuth = THREE.MathUtils.degToRad(INITIAL_AZIMUTH_DEG);

    camera.position.set(
      target.x + distance * Math.sin(polar) * Math.sin(azimuth),
      target.y + distance * Math.cos(polar),
      target.z + distance * Math.sin(polar) * Math.cos(azimuth)
    );
    camera.near = distance / 100;
    camera.far = distance * 20;
    camera.updateProjectionMatrix();

    controls.target.copy(target);
    controls.minDistance = distance * 0.55;
    controls.maxDistance = distance * 2.2;
    controls.update();
  }

  function resize() {
    var w = container.clientWidth || 1;
    var h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  var ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Convierte el texto base64 (assets/models/ballon-dor.glb.b64.js) de
  // vuelta a los bytes binarios originales del .glb, para pasárselo a
  // GLTFLoader.parse() directamente desde memoria — sin pedir ningún
  // archivo por separado, así que no choca con la restricción de
  // file://.
  function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function onModelReady(gltf) {
    loadSettled = true;
    clearTimeout(loadTimeoutId);
    scene.add(gltf.scene);
    frameModel(gltf.scene);
    hideLoader();
  }

  function onModelFail(err) {
    loadSettled = true;
    clearTimeout(loadTimeoutId);
    // eslint-disable-next-line no-console
    console.error("No se pudo cargar el modelo 3D del Balón de Oro:", err);
    showLoadError();
  }

  var loaderInstance = new GLTFLoader();

  if (window.__BALLON_MODEL_B64__) {
    // Camino normal: el modelo ya está en memoria (venía en un <script>
    // normal, assets/models/ballon-dor.glb.b64.js), así que no hace
    // falta pedir nada por la red — funciona igual por doble clic que
    // por servidor local.
    try {
      var buffer = base64ToArrayBuffer(window.__BALLON_MODEL_B64__);
      loaderInstance.parse(buffer, "", onModelReady, onModelFail);
    } catch (e) {
      onModelFail(e);
    }
  } else {
    // Respaldo (por si algún día se borra el .b64.js a propósito): pide
    // el .glb suelto como antes — esto sí necesita servidor local.
    loaderInstance.load(MODEL_URL, onModelReady, undefined, onModelFail);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // necesario para el "damping" (suavizado del giro)
    renderer.render(scene, camera);
  }
  animate();
})();
