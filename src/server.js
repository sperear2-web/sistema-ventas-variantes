'use strict';
const { loadConfig } = require('./config');
const { createApp } = require('./app');

const config = loadConfig();
const port = process.env.PORT || 3000;
createApp(config).listen(port, () => console.log(`Sistema de ventas [${config.variant}] en puerto ${port}`));
