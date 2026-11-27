'use strict';
const crypto = require('crypto');

/* ---- Núcleo común: auth, productos, clientes y ventas (todas las variantes) ---- */
function login(store, usuario, clave) {
  const u = store.usuarios.find((x) => x.usuario === usuario && x.clave === clave);
  if (!u) return null;
  const token = crypto.randomBytes(16).toString('hex');
  store.tokens.add(token);
  return token;
}

function crearProducto(store, { nombre, precio, stock }) {
  if (!nombre || typeof precio !== 'number' || precio <= 0 || !Number.isInteger(stock) || stock < 0) {
    throw new Error('Datos de producto inválidos');
  }
  const p = { id: store.seq.producto++, nombre, precio, stock };
  store.productos.push(p);
  return p;
}

function crearCliente(store, { nombre, email }) {
  if (!nombre || !email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Datos de cliente inválidos');
  const c = { id: store.seq.cliente++, nombre, email };
  store.clientes.push(c);
  return c;
}

/** Registra una venta. `calcularDescuento` es un punto de extensión inyectado por la variante. */
function registrarVenta(store, { clienteId, items, codigoDescuento }, calcularDescuento) {
  const cliente = store.clientes.find((c) => c.id === clienteId);
  if (!cliente) throw new Error('Cliente no encontrado');
  if (!Array.isArray(items) || items.length === 0) throw new Error('La venta requiere al menos un ítem');
  let subtotal = 0;
  const detalle = items.map((it) => {
    const prod = store.productos.find((p) => p.id === it.productoId);
    if (!prod) throw new Error(`Producto ${it.productoId} no encontrado`);
    if (!Number.isInteger(it.cantidad) || it.cantidad <= 0) throw new Error('Cantidad inválida');
    if (prod.stock < it.cantidad) throw new Error(`Stock insuficiente de ${prod.nombre}`);
    subtotal += prod.precio * it.cantidad;
    return { prod, cantidad: it.cantidad, precio: prod.precio };
  });
  detalle.forEach((d) => { d.prod.stock -= d.cantidad; });
  const descuento = calcularDescuento ? calcularDescuento(subtotal, codigoDescuento) : 0;
  const venta = {
    id: store.seq.venta++,
    clienteId,
    items: detalle.map((d) => ({ productoId: d.prod.id, cantidad: d.cantidad, precio: d.precio })),
    subtotal: round2(subtotal),
    descuento: round2(descuento),
    total: round2(subtotal - descuento),
    fecha: new Date().toISOString()
  };
  store.ventas.push(venta);
  return venta;
}

function round2(n) { return Math.round(n * 100) / 100; }

module.exports = { login, crearProducto, crearCliente, registrarVenta, round2 };
