'use strict';
const { round2 } = require('./core');
/** Característica opcional: reportes estadísticos. */
function resumenVentas(store) {
  const total = store.ventas.reduce((a, v) => a + v.total, 0);
  const porProducto = {};
  store.ventas.forEach((v) => v.items.forEach((i) => {
    porProducto[i.productoId] = (porProducto[i.productoId] || 0) + i.cantidad;
  }));
  const masVendido = Object.entries(porProducto).sort((a, b) => b[1] - a[1])[0];
  return {
    cantidadVentas: store.ventas.length,
    totalVendido: round2(total),
    ticketPromedio: store.ventas.length ? round2(total / store.ventas.length) : 0,
    productoMasVendido: masVendido ? { productoId: Number(masVendido[0]), unidades: masVendido[1] } : null
  };
}
module.exports = { resumenVentas };
