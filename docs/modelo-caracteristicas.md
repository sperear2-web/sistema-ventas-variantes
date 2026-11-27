# Modelo de características

```mermaid
graph TD
  SV[Sistema de ventas] --> AUTH[Inicio de sesión]:::m
  SV --> PROD[Productos]:::m
  SV --> CLI[Clientes]:::m
  SV --> VEN[Ventas]:::m
  SV --> REP[Reportes estadísticos]:::o
  SV --> DESC[Descuentos]:::o
  REP --> EXP[Exportación de reportes]:::o
  classDef m fill:#cfe8ff,stroke:#1f4e79;
  classDef o fill:#fff2cc,stroke:#b8860b,stroke-dasharray:4;
```

| Característica | Tipo | Requiere | Básica | Premium |
|---|---|---|---|---|
| Inicio de sesión | Obligatoria | — | Sí | Sí |
| Productos | Obligatoria | auth | Sí | Sí |
| Clientes | Obligatoria | auth | Sí | Sí |
| Ventas | Obligatoria | productos, clientes | Sí | Sí |
| Reportes estadísticos | Opcional | ventas | No | Sí |
| Gestión de descuentos | Opcional | ventas | No | Sí |
| Exportación de reportes | Opcional | reportes | No | Sí |

Mecanismos de variabilidad: archivos de configuración `config/variants/*.json`, variable de entorno `VARIANT` y sobrescritura `FEATURE_<NOMBRE>=true|false`. La validación automatizada está en `src/config.js` (`validateConfig`) y se ejecuta en CI.
