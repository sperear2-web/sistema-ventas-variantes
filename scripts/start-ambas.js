// Levanta las dos variantes a la vez: Básica en 3000 y Premium en 3001.
const { spawn } = require('child_process');
const path = require('path');
const server = path.join(__dirname, '..', 'src', 'server.js');
const lanzar = (variant, port) => {
  const p = spawn(process.execPath, [server], {
    stdio: 'inherit',
    env: { ...process.env, VARIANT: variant, PORT: String(port) },
  });
  p.on('exit', (c) => { console.log(`[${variant}] terminó (${c})`); });
  return p;
};
const hijos = [lanzar('basica', 3000), lanzar('premium', 3001)];
console.log('Básica: http://localhost:3000/health | Premium: http://localhost:3001/health');
process.on('SIGINT', () => { hijos.forEach((h) => h.kill()); process.exit(0); });
