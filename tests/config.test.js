const { loadConfig, validateConfig, listVariants } = require('../src/config');

describe('Gestión de variabilidad: validación de configuración', () => {
  test('las variantes basica y premium existen y son válidas', () => {
    expect(listVariants().sort()).toEqual(['basica', 'premium']);
    listVariants().forEach((v) => expect(validateConfig(loadConfig(v, {}))).toEqual([]));
  });

  test('rechaza deshabilitar una característica obligatoria', () => {
    const cfg = loadConfig('premium', {});
    cfg.features.ventas = false;
    expect(validateConfig(cfg).join()).toMatch(/obligatoria "ventas"/);
  });

  test('rechaza dependencias incumplidas (exportación requiere reportes)', () => {
    const cfg = loadConfig('premium', {});
    cfg.features.reportes = false;
    expect(validateConfig(cfg).join()).toMatch(/"exportacion" requiere "reportes"/);
  });

  test('las variables de entorno FEATURE_* sobrescriben opcionales', () => {
    const cfg = loadConfig('basica', { FEATURE_DESCUENTOS: 'true' });
    expect(cfg.features.descuentos).toBe(true);
  });

  test('variante inexistente lanza error', () => {
    expect(() => loadConfig('gold', {})).toThrow(/Variante desconocida/);
  });
});
