'use strict';
/**
 * Catálogo de características (modelo de características del producto).
 * - mandatory: debe estar siempre habilitada en cualquier variante.
 * - requires: características de las que depende (restricciones del modelo).
 */
const FEATURES = {
  auth: { mandatory: true, requires: [], descripcion: 'Inicio de sesión' },
  productos: { mandatory: true, requires: ['auth'], descripcion: 'Gestión de productos' },
  clientes: { mandatory: true, requires: ['auth'], descripcion: 'Gestión de clientes' },
  ventas: { mandatory: true, requires: ['productos', 'clientes'], descripcion: 'Registro de ventas' },
  reportes: { mandatory: false, requires: ['ventas'], descripcion: 'Reportes estadísticos' },
  descuentos: { mandatory: false, requires: ['ventas'], descripcion: 'Gestión de descuentos' },
  exportacion: { mandatory: false, requires: ['reportes'], descripcion: 'Exportación de reportes' }
};

module.exports = { FEATURES };
