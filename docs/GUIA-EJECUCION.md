# Guía para reproducir las fases (evidencias para informe y video)

Cada integrante usa su propia cuenta/credenciales de Git; los commits deben ser reales de cada persona.

## Fase 2 – Repositorio, ramas, PR y releases
```bash
git checkout -b develop && git push -u origin develop
# cada integrante, en su máquina:
git checkout develop && git pull
git checkout -b feature/<nombre-funcionalidad>
# ...cambios...  git add . && git commit -m "feat: <descripción>"
git push -u origin feature/<nombre-funcionalidad>
# abrir Pull Request feature/* -> develop en GitHub, revisar y fusionar
# cuando develop esté estable: PR develop -> main
git tag -a v1.0.0 -m "Versión estable inicial" && git push origin v1.0.0
# ... tras agregar variantes (feature/variantes) ...
git tag -a v1.1.0 -m "Gestión de variabilidad" && git push origin v1.1.0
```
En GitHub: Releases → *Draft a new release* sobre cada etiqueta (v1.0.0 y v1.1.0).

## Fase 3 – Prueba fallida y corrección (evidencia CI)
```bash
git checkout -b fix/demo-fallo-prueba develop
# 1) Provocar el fallo: en src/services/core.js cambiar el cálculo del total, p. ej.
#    total: round2(subtotal - descuento)  ->  total: round2(subtotal + descuento)
git commit -am "test: provoca fallo intencional en cálculo de total" && git push -u origin fix/demo-fallo-prueba
# 2) En Actions se ve la ejecución FALLIDA (captura el log del test "registra venta..."/"Premium aplica descuentos")
# 3) Corregir:
git commit -am "fix: corrige cálculo del total" && git push
# 4) Se ve la ejecución EXITOSA (captura). Abrir PR -> develop.
```

## Fase 4 – Despliegue en Render
1. Render → *New → Blueprint* sobre el repositorio (usa `render.yaml`): se crean `ventas-basica` y `ventas-premium`.
2. En cada servicio copiar el *Deploy Hook* y guardarlo en GitHub → Settings → Secrets → Actions: `RENDER_DEPLOY_HOOK_BASICA` y `RENDER_DEPLOY_HOOK_PREMIUM`.
3. En Settings → Variables: `URL_BASICA` y `URL_PREMIUM` (URLs públicas de Render).
4. Al fusionar en `main`, CI corre; si es exitoso, CD despliega. Si CI falla, CD no se ejecuta.

## Fase 5 – Demostrar variantes
```bash
VARIANT=basica  npm start   # GET /api/reportes/resumen -> 404
VARIANT=premium npm start   # GET /api/reportes/resumen -> 200
npm run validate-config
```
Datos de acceso de prueba: usuario `admin`, clave `admin123`. Endpoint `/api/config` muestra los feature flags activos.

## Permisos
Dar acceso a la docente al repositorio (Settings → Collaborators o repositorio público) y al video (enlace "cualquiera con el enlace").
