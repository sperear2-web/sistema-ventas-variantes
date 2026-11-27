'use strict';
/** Característica opcional: exportación de reportes a CSV. */
function ventasACsv(store) {
  const filas = ['id,clienteId,subtotal,descuento,total,fecha'];
  store.ventas.forEach((v) => filas.push([v.id, v.clienteId, v.subtotal, v.descuento, v.total, v.fecha].join(',')));
  return filas.join('\n');
}
module.exports = { ventasACsv };
