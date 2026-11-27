# Sistema de ventas con variantes (Básica / Premium)

Componente Práctico 2 – Gestión de la Configuración de Software (UNEMI). Una única base de código genera dos variantes mediante *feature flags* definidos en `config/variants/*.json`.

| Característica | Básica | Premium |
|---|---|---|
| Inicio de sesión, productos, clientes, ventas | Sí | Sí |
| Reportes estadísticos | No | Sí |
| Gestión de descuentos | No | Sí |
| Exportación de reportes (CSV) | No | Sí |

## Uso
```bash
npm ci
npm test                 # 14 pruebas automatizadas con Jest + cobertura
npm run validate-config  # valida variantes contra el modelo de características
VARIANT=premium npm start
```
Endpoints: `POST /api/login`, `/api/productos`, `/api/clientes`, `/api/ventas`, `/api/reportes/resumen` y `/api/reportes/exportar` (Premium), `/health`, `/api/config`.

## Flujo de trabajo
Ramas `main` (estable), `develop` (integración), `feature/*` (Pull Request). CI: `.github/workflows/ci.yml`; CD: `.github/workflows/cd.yml`. Detalle en `docs/GUIA-EJECUCION.md` y `docs/modelo-caracteristicas.md`.
