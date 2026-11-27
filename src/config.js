'use strict';
const fs = require('fs');
const path = require('path');
const { FEATURES } = require('./features');

const VARIANTS_DIR = path.join(__dirname, '..', 'config', 'variants');

function listVariants() {
  return fs.readdirSync(VARIANTS_DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
}

/** Valida una configuración contra el modelo de características. Devuelve lista de errores. */
function validateConfig(config) {
  const errors = [];
  if (!config || typeof config !== 'object') return ['La configuración debe ser un objeto'];
  if (!config.variant || typeof config.variant !== 'string') errors.push('Falta el campo "variant"');
  const features = config.features;
  if (!features || typeof features !== 'object') {
    errors.push('Falta el objeto "features"');
    return errors;
  }
  for (const name of Object.keys(features)) {
    if (!FEATURES[name]) errors.push(`Característica desconocida: "${name}"`);
    else if (typeof features[name] !== 'boolean') errors.push(`La característica "${name}" debe ser booleana`);
  }
  for (const [name, def] of Object.entries(FEATURES)) {
    if (!(name in features)) {
      errors.push(`Falta declarar la característica "${name}"`);
      continue;
    }
    if (def.mandatory && features[name] !== true) errors.push(`La característica obligatoria "${name}" no puede estar deshabilitada`);
    if (features[name] === true) {
      for (const dep of def.requires) {
        if (features[dep] !== true) errors.push(`"${name}" requiere "${dep}" habilitada`);
      }
    }
  }
  return errors;
}

/** Carga la variante indicada y aplica sobrescrituras opcionales por variables de entorno FEATURE_<NOMBRE>=true|false */
function loadConfig(variant = process.env.VARIANT || 'basica', env = process.env) {
  const file = path.join(VARIANTS_DIR, `${variant}.json`);
  if (!fs.existsSync(file)) throw new Error(`Variante desconocida: "${variant}". Disponibles: ${listVariants().join(', ')}`);
  const config = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const name of Object.keys(FEATURES)) {
    const v = env[`FEATURE_${name.toUpperCase()}`];
    if (v === 'true' || v === 'false') config.features[name] = v === 'true';
  }
  const errors = validateConfig(config);
  if (errors.length) throw new Error(`Configuración inválida:\n- ${errors.join('\n- ')}`);
  return config;
}

module.exports = { loadConfig, validateConfig, listVariants, VARIANTS_DIR };
