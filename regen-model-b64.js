/* ==========================================================================
   regen-model-b64.js — Regenera assets/models/ballon-dor.glb.b64.js a
   partir de assets/models/ballon-dor.glb.

   Para qué sirve: la página NO carga el balón 3D desde ballon-dor.glb
   directo — lo carga desde ballon-dor.glb.b64.js (el mismo archivo, pero
   copiado como texto dentro de un <script>), porque así funciona incluso
   abriendo index.html con doble clic (ver README.md para el detalle).

   Si algún día reemplazas ballon-dor.glb por otro modelo, ese cambio NO
   se refleja solo en la página — hay que correr este script para que
   ballon-dor.glb.b64.js quede al día con el modelo nuevo:

     node regen-model-b64.js

   No hace falta instalar nada (usa solo Node.js, que ya necesitas para
   generate.js).
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "assets", "models", "ballon-dor.glb");
const OUT = path.join(__dirname, "assets", "models", "ballon-dor.glb.b64.js");

if (!fs.existsSync(SRC)) {
  console.error("No encontré " + SRC + " — revisa que el archivo exista con ese nombre exacto.");
  process.exit(1);
}

const bytes = fs.readFileSync(SRC);
const b64 = bytes.toString("base64");

const header =
  "/* ==========================================================================\n" +
  "   ballon-dor.glb.b64.js -- el modelo 3D del trofeo, pero codificado como\n" +
  "   texto (base64) en vez de un archivo binario aparte.\n" +
  "   Generado automáticamente por regen-model-b64.js a partir de\n" +
  "   assets/models/ballon-dor.glb -- no lo edites a mano, vuelve a correr\n" +
  "   ese script si cambias el modelo.\n" +
  "   ========================================================================== */\n";

const content = header + 'window.__BALLON_MODEL_B64__ = "' + b64 + '";\n';

fs.writeFileSync(OUT, content, "utf8");

console.log("Listo: " + OUT + " actualizado (" + Math.round(bytes.length / 1024) + " KB -> " + Math.round(content.length / 1024) + " KB en texto).");
