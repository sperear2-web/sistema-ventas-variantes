'use strict';
/** Valida TODAS las variantes en config/variants contra el modelo de características (usado en CI). */
const fs = require('fs');
const path = require('path');
const { validateConfig, listVariants, VARIANTS_DIR } = require('../src/config');

let fallo = false;
for (const v of listVariants()) {
  const cfg = JSON.parse(fs.readFileSync(path.join(VARIANTS_DIR, `${v}.json`), 'utf8'));
  const errores = validateConfig(cfg);
  if (errores.length) { fallo = true; console.error(`✖ ${v}:\n  - ${errores.join('\n  - ')}`); }
  else console.log(`✔ ${v}: configuración válida`);
}
process.exit(fallo ? 1 : 0);
