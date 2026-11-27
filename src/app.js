'use strict';
const express = require('express');
const { createStore } = require('./store');
const core = require('./services/core');

/**
 * Fábrica de la aplicación. Las rutas de las características opcionales sólo se
 * registran cuando la configuración de la variante las habilita (feature flags).
 */
function createApp(config) {
  const app = express();
  const store = createStore();
  app.use(express.json());

  const wrap = (fn) => (req, res) => {
    try { fn(req, res); } catch (e) { res.status(400).json({ error: e.message }); }
  };
  const auth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!store.tokens.has(token)) return res.status(401).json({ error: 'No autorizado' });
    next();
  };

  app.get('/health', (_req, res) => res.json({ status: 'ok', variant: config.variant }));
  app.get('/api/config', (_req, res) => res.json(config));

  // --- Núcleo obligatorio ---
  app.post('/api/login', (req, res) => {
    const token = core.login(store, req.body.usuario, req.body.clave);
    if (!token) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ token });
  });
  app.get('/api/productos', auth, (_req, res) => res.json(store.productos));
  app.post('/api/productos', auth, wrap((req, res) => res.status(201).json(core.crearProducto(store, req.body))));
  app.get('/api/clientes', auth, (_req, res) => res.json(store.clientes));
  app.post('/api/clientes', auth, wrap((req, res) => res.status(201).json(core.crearCliente(store, req.body))));
  app.get('/api/ventas', auth, (_req, res) => res.json(store.ventas));

  app.post('/api/ventas', auth, wrap((req, res) => res.status(201).json(core.registrarVenta(store, req.body, null))));

  return app;
}

module.exports = { createApp };
