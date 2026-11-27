'use strict';
/** Almacén en memoria (suficiente para la práctica; el foco es la gestión de la configuración). */
function createStore() {
  return {
    usuarios: [{ usuario: 'admin', clave: 'admin123' }],
    tokens: new Set(),
    productos: [],
    clientes: [],
    ventas: [],
    seq: { producto: 1, cliente: 1, venta: 1 }
  };
}
module.exports = { createStore };
