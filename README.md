# Inglés — práctica guiada (ES)

Webapp estática (HTML + CSS + JavaScript, sin build) para practicar inglés desde el español, con foco en hispanohablantes (incluye ejemplos neutros con matices colombianos donde aplica). Incluye **tracks** por tema, **juego por niveles**, **repaso espaciado (Leitner, 6 cajas)**, **prueba de ubicación**, **PWA offline**, **exportación/importación de progreso** y requisitos de **accesibilidad** (letra grande, contraste, botones grandes).

---

## Prueba de nivel (ubicación)

1. La **primera vez** verás una bienvenida con texto grande: puedes **Hacer la prueba** o **Saltar (empezar desde A1)**.
2. La prueba tiene **entre 12 y 20** preguntas (la app puede terminar antes si la estimación se estabiliza). Empieza en torno a **A2** y **sube o baja** según rachas de aciertos/fallos.
3. Tipos de pregunta: **opción múltiple**, **hueco**, **detectar error** y **traducción corta ES → EN**, con enunciados reales (ya no son plantillas genéricas).
4. Durante la prueba **no se muestra la respuesta correcta**; solo confirmación de que se registró tu respuesta. Hay **No sé / saltar** (puntuación parcial) y **Pausar y guardar** (se guarda en el navegador).
5. Al terminar verás el **nivel CEFR estimado**, un **texto con tu puntuación %** (ponderada por dificultad), **barras por categoría** y dos botones: **Empezar con esta ruta** (desbloqueo guiado) o **Quiero elegir yo** (más libertad hasta tu nivel).
6. Puedes repetir la prueba desde **Mi nivel** o **Configuración**.

Los datos de la prueba viven en `localStorage` bajo las claves `en_placement_test_partial` (pausa) y `en_placement_result_v1` (resultado).

---

## Tracks y niveles CEFR (referencia)

| Track | Contenido | Niveles | Foco CEFR (orientativo) |
|-------|-----------|---------|-------------------------|
| 1 | Presente y futuro cercano | 10 | A1–B1 |
| 2 | Pasado | 10 | A1–B2 |
| 3 | Futuro y condicional básico | 8 | A2–B1 |
| 4 | Tiempos perfectos | 10 | A2–C1 |
| 5 | Pasiva e indirecto | 6 | B1–C1 |
| 6 | Modales | 8 | A2–C1 |
| 7 | Verbos irregulares | 5 | A1–B2 |
| 8 | Phrasal verbs | 10 | A2–C1 |
| 9 | Modismos | 8 | B1–C1 |
| 10 | Falsos amigos | 5 | A2–B2 |
| 11 | Examen mixto C1 | 5 | B2–C1 |

En **Progreso** y **Tracks** verás barras de avance. Los tracks sugeridos tras la prueba aparecen como **Recomendado para ti**.

---

## Cómo usar el repaso espaciado (SRS)

Cada ítem se guarda con la clave: `` `${trackId}|${itemId}|${exerciseType}` ``. Hay **6 cajas** con intervalos crecientes si aciertas; si fallas, vuelve a la primera caja con intervalo corto.

Puedes **exportar** un JSON unificado (SRS + progreso + algunas preferencias) desde **Repaso** e **importarlo** en otro navegador.

---

## Inglés británico y americano

En los datos se aceptan, cuando tiene sentido pedagógico, **variantes de Reino Unido y de Estados Unidos** (por ejemplo `got` / `gotten` donde aplique). El **texto a voz (TTS)** depende del **motor del navegador** (suele sonar más cercano a EE. UU. en muchos equipos). Si necesitas un acento concreto, revisa la configuración de voz del sistema.

**Listening:** hay ejercicios donde puedes **escuchar** la frase con TTS y escribir lo que oyes. **No** hay modo de pronunciación con micrófono (SpeechRecognition) en esta versión; puede incorporarse más adelante como mejora opcional.

---

## Probar en local

El *service worker* no sirve con `file://`. Usa un servidor estático:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000/`.

---

## Instalar como PWA (Android / iOS)

### Android (Chrome / Edge)

1. Abre la URL publicada en **HTTPS**.
2. Toca **Instalar app** o el menú ⋮ → **Agregar a pantalla de inicio** / **Instalar aplicación**.

### iPhone / iPad (Safari)

1. Abre la URL en **Safari**.
2. **Compartir** → **Agregar a pantalla de inicio**.

---

## Publicar en GitHub Pages

1. Crea un repositorio público y sube estos archivos (rama `main`).
2. En el repo: **Settings → Pages** → despliegue desde **main** y carpeta **/ (root)**.
3. Espera unos minutos. La app quedará en `https://<usuario>.github.io/<repo>/`.
4. Rutas **relativas** y `start_url: "./"` en el manifiesto: compatible con subcarpeta del Pages.
5. Tras cambios importantes, **sube la versión** en `service-worker.js` (`CACHE_NAME`) para que los clientes actualicen caché.

---

## Cómo contribuir ítems

Cada archivo en `data/` asigna un arreglo global, por ejemplo `window.EN_DATA_TENSES = [ ... ]`.

Campos típicos por ítem:

- `id` (único), `trackId`, `levelIndex` (0-based dentro del track), `cefr`, `category`
- `exerciseType`: `mcq` | `cloze` | `translate_es_en` | `translate_en_es` | `spot_error` | `listen_type` | `word_order` | …
- `prompt_es`, opcional `context_en`, `choices` + `correctIndex` (MCQ), o `accept[]` + `correctDisplay` (abiertos)
- `hint`, `explanation`, `contrastive_note` (se puede mostrar al fallar como “Ojo aquí”)
- `register`: `neutral` | `informal` | `formal` | `business` | `slang`

**Prueba de nivel:** edita `data/placement-test.js` (`window.EN_PLACEMENT_BANK`). Cada pregunta lleva `cefr_level`, `category`, `type` y campos según el tipo.

Tras añadir datos, incrementa `CACHE_NAME` en `service-worker.js`.

---

## Accesibilidad

- **Tipografía y tamaños**: cuerpo amplio; preguntas más grandes; botones e inputs altos (ver `styles.css`).
- **Contraste**: tema claro por defecto (`#f7f9fc` / `#1a1f2c`); **tema oscuro** con el botón superior.
- **Aa (letra grande)**: escala global **1,25×**; la primera vez queda **activada** (puedes apagarla). Se guarda en `en_large_text`.
- **Foco visible** para teclado, **sin tooltips exclusivos** (la información va en pantalla o en “Pista”).
- **Animaciones** cortas y respeto a `prefers-reduced-motion`.

---

## Licencia

Uso educativo y personal. Si publicas cambios, conserva la atribución del proyecto.
