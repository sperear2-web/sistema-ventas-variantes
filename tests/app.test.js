const request = require('supertest');
const { createApp } = require('../src/app');
const { loadConfig } = require('../src/config');

async function sesion(variant) {
  const app = createApp(loadConfig(variant, {}));
  const { body } = await request(app).post('/api/login').send({ usuario: 'admin', clave: 'admin123' });
  return { app, auth: { Authorization: `Bearer ${body.token}` } };
}
async function datos({ app, auth }) {
  const p = await request(app).post('/api/productos').set(auth).send({ nombre: 'Teclado', precio: 25, stock: 10 });
  const c = await request(app).post('/api/clientes').set(auth).send({ nombre: 'Ana', email: 'ana@mail.com' });
  return { productoId: p.body.id, clienteId: c.body.id };
}

describe('Núcleo común (ambas variantes)', () => {
  test('login válido entrega token y el inválido es rechazado', async () => {
    const app = createApp(loadConfig('basica', {}));
    expect((await request(app).post('/api/login').send({ usuario: 'admin', clave: 'x' })).status).toBe(401);
    expect((await request(app).post('/api/login').send({ usuario: 'admin', clave: 'admin123' })).status).toBe(200);
  });

  test('rutas protegidas exigen token', async () => {
    const app = createApp(loadConfig('basica', {}));
    expect((await request(app).get('/api/productos')).status).toBe(401);
  });

  test('crea producto y valida datos inválidos', async () => {
    const s = await sesion('basica');
    expect((await request(s.app).post('/api/productos').set(s.auth).send({ nombre: 'A', precio: 5, stock: 2 })).status).toBe(201);
    expect((await request(s.app).post('/api/productos').set(s.auth).send({ nombre: '', precio: -1, stock: 2 })).status).toBe(400);
  });

  test('registra venta y descuenta stock', async () => {
    const s = await sesion('basica');
    const { productoId, clienteId } = await datos(s);
    const v = await request(s.app).post('/api/ventas').set(s.auth).send({ clienteId, items: [{ productoId, cantidad: 2 }] });
    expect(v.status).toBe(201);
    expect(v.body.total).toBe(50);
    const prods = await request(s.app).get('/api/productos').set(s.auth);
    expect(prods.body[0].stock).toBe(8);
  });

  test('rechaza venta con stock insuficiente', async () => {
    const s = await sesion('basica');
    const { productoId, clienteId } = await datos(s);
    const v = await request(s.app).post('/api/ventas').set(s.auth).send({ clienteId, items: [{ productoId, cantidad: 99 }] });
    expect(v.status).toBe(400);
  });
});

describe('Variantes: Básica vs Premium', () => {
  test('Básica NO expone reportes ni exportación', async () => {
    const s = await sesion('basica');
    expect((await request(s.app).get('/api/reportes/resumen').set(s.auth)).status).toBe(404);
    expect((await request(s.app).get('/api/reportes/exportar').set(s.auth)).status).toBe(404);
  });

  test('Premium expone reportes y exportación CSV', async () => {
    const s = await sesion('premium');
    const { productoId, clienteId } = await datos(s);
    await request(s.app).post('/api/ventas').set(s.auth).send({ clienteId, items: [{ productoId, cantidad: 1 }] });
    const r = await request(s.app).get('/api/reportes/resumen').set(s.auth);
    expect(r.body.cantidadVentas).toBe(1);
    const csv = await request(s.app).get('/api/reportes/exportar').set(s.auth);
    expect(csv.text).toMatch(/^id,clienteId/);
  });

  test('Premium aplica descuentos; Básica ignora el código', async () => {
    const prem = await sesion('premium');
    let d = await datos(prem);
    const vp = await request(prem.app).post('/api/ventas').set(prem.auth).send({ clienteId: d.clienteId, items: [{ productoId: d.productoId, cantidad: 4 }], codigoDescuento: 'PROMO10' });
    expect(vp.body.descuento).toBe(10);
    expect(vp.body.total).toBe(90);

    const bas = await sesion('basica');
    d = await datos(bas);
    const vb = await request(bas.app).post('/api/ventas').set(bas.auth).send({ clienteId: d.clienteId, items: [{ productoId: d.productoId, cantidad: 4 }], codigoDescuento: 'PROMO10' });
    expect(vb.body.descuento).toBe(0);
    expect(vb.body.total).toBe(100);
  });

  test('/health informa la variante activa', async () => {
    const app = createApp(loadConfig('premium', {}));
    expect((await request(app).get('/health')).body.variant).toBe('premium');
  });
});
