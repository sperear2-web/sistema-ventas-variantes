'use strict';
/** Empaqueta el software en dist/ (código común + configuraciones de variantes). */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const d of ['src', 'config']) fs.cpSync(path.join(root, d), path.join(dist, d), { recursive: true });
const pkg = require('../package.json');
fs.writeFileSync(path.join(dist, 'package.json'), JSON.stringify({ name: pkg.name, version: pkg.version, main: 'src/server.js', scripts: { start: 'node src/server.js' }, dependencies: pkg.dependencies }, null, 2));
fs.writeFileSync(path.join(dist, 'BUILD_INFO.txt'), `version=${pkg.version}\ncommit=${process.env.GITHUB_SHA || 'local'}\nfecha=${new Date().toISOString()}\n`);
console.log(`Build generado en dist/ (v${pkg.version})`);
