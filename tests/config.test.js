const { loadConfig, validateConfig, listVariants } = require('../src/config');

describe('Validación de configuración', () => {
  test('la variante basica existe y es válida', () => {
    expect(listVariants()).toEqual(['basica']);
    expect(validateConfig(loadConfig('basica', {}))).toEqual([]);
  });

  test('rechaza deshabilitar una característica obligatoria', () => {
    const cfg = loadConfig('basica', {});
    cfg.features.ventas = false;
    expect(validateConfig(cfg).join()).toMatch(/obligatoria "ventas"/);
  });

  test('variante inexistente lanza error', () => {
    expect(() => loadConfig('gold', {})).toThrow(/Variante desconocida/);
  });
});
