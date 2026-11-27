'use strict';
/** Característica opcional: descuentos por código. */
const CODIGOS = { PROMO10: 0.1, PROMO20: 0.2 };

function calcularDescuento(subtotal, codigo) {
  if (!codigo) return 0;
  const pct = CODIGOS[String(codigo).toUpperCase()];
  if (pct === undefined) throw new Error('Código de descuento inválido');
  return subtotal * pct;
}
module.exports = { calcularDescuento, CODIGOS };
