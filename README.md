# Sofía & Javi · Invitación de boda

Web de la invitación (28 · 08 · 2027, Gijón). Es HTML + CSS + JavaScript sencillo, sin instalaciones ni compilación: GitHub Pages la publica tal cual.

- **Web publicada:** https://mds5zhp2sd-gif.github.io/Boda/
- **Diseño de referencia:** `referencia/invitacion-original.jpg`

---

## ¿Qué archivo toco para…?

| Quiero cambiar… | Archivo | Dónde |
|---|---|---|
| Nombres, fecha, ciudad | `js/config.js` | `pareja`, `boda` |
| Lugares, horas y enlaces de mapas | `js/config.js` | `detalles.columnas` |
| Programa del día (añadir/quitar eventos) | `js/config.js` | `programa.eventos` |
| Texto e información del hotel | `js/config.js` | `alojamiento` |
| Textos y opciones del formulario | `js/config.js` | `confirmacion` |
| Conectar el formulario a Google Sheets | `js/config.js` | `confirmacion.urlGoogleSheets` |
| Cuenta atrás, “Añadir al calendario”, música | `js/config.js` | `extras` (poner `activo: true`) |
| Una ilustración o icono | carpeta `img/` | sube la nueva **con el mismo nombre** (o cambia la ruta en `config.js`) |
| Colores, fuentes, tamaños | `css/estilos.css` | bloque `:root` al principio |
| Aspecto de una sección concreta | `css/estilos.css` | apartado con el nombre de la sección |

> `js/app.js` es la “maquinaria” que lee `config.js` y monta la página. Normalmente no hace falta tocarlo.

### Editar desde GitHub (sin instalar nada)
1. Abre el archivo en GitHub (por ejemplo `js/config.js`) y pulsa el lápiz ✏️.
2. Cambia el texto **respetando las comillas y las comas**.
3. Pulsa **Commit changes**. En 1–2 minutos la web se actualiza (recarga con `Ctrl/Cmd + Shift + R`).

---

## Estructura

```
index.html                  Estructura de la página (secciones con id)
css/estilos.css             Todo el aspecto visual
js/config.js                ★ Todos los datos editables
js/app.js                   Lógica: monta la página y envía el formulario
img/                        Ilustraciones e iconos (sustituibles)
google-apps-script/Code.gs  Código para recibir las confirmaciones en Google Sheets
referencia/                 Imagen original del diseño
```

### Secciones (ids en `index.html`)
| id | Sección |
|---|---|
| `#portada` | Mar con faro + dibujo de la pareja, “¡Nos casamos!”, nombres, fecha, ciudad |
| `#detalles` | Fecha, ceremonia y celebración (columnas generadas desde `config.js`) |
| `#programa` | Línea de tiempo del día + velero |
| `#alojamiento` | Hotel recomendado + panel desplegable |
| `#confirmacion` | Formulario de asistencia |
| `#pie` | Firma, ancla, concha y olas |

Los elementos generados también tienen id propio: `#detalle-ceremonia`, `#evento-fiesta`, etc. (salen del campo `id` de cada elemento en `config.js`). Los separadores de olas son `#separador-1` … `#separador-4`.

### Imágenes (`img/`)
Ahora mismo son **recortes de la imagen original** con el fondo quitado. Para cambiarlas por dibujos propios, sube un PNG con fondo transparente y el mismo nombre.

| Archivo | Dónde se ve | Tamaño aprox. |
|---|---|---|
| `portada-mar.png` | Cabecera: franja de mar en acuarela con el faro (fondo) | 848 × 172 |
| `ilus-pareja.png` | Cabecera: Javi pescando y Sofía en la red (encima del mar; posición y tamaño en `css/estilos.css` → `.portada__pareja`) | 708 × 943 |
| `ola-separador-1…4.png` | Separadores entre secciones | 848 × 40 |
| `pie-olas.png` | Olas del pie | 848 × 83 |
| `icono-fecha.png`, `icono-capilla.svg` (Capilla de la Providencia), `icono-aperitivo.png` (cóctel) | Detalles | 50 px alto |
| `icono-ceremonia/aperitivo/almuerzo/fiesta/recena.png` (+ `icono-autobus.png`, guardado por si vuelve el autobús) | Programa del día | 50 px alto |
| `icono-form-*.png`, `icono-form-hotel.svg` | Iconos de los campos del formulario | 22 px ancho |
| `ilus-velero.png` | Programa del día | 157 × 128 |
| `ilus-concha.png`, `ilus-farol.png` | Alojamiento | 80 / 122 px ancho |
| `ilus-concha-pequena.png` | Título de “Confirma tu asistencia” | 34 px |
| `ilus-ancla.png`, `ilus-concha-pie.png` | Pie | 86 / 102 px ancho |
| `mancha-titulo.svg` | Mancha verde detrás de los títulos | se estira |
| `rayitas.svg` | Rayitas decorativas junto a títulos | — |

Consejo: si los nuevos dibujos son más grandes (p. ej. al doble de tamaño), se verán más nítidos en móviles; la web los ajusta al tamaño indicado.

---

## Conectar el formulario a Google Sheets

Mientras `urlGoogleSheets` tenga el texto de ejemplo, el formulario funciona en **modo prueba** (se ve, valida, pero no envía nada y lo avisa).

1. Crea una hoja de cálculo en Google Sheets (por ejemplo “Confirmaciones boda”).
2. En la hoja: **Extensiones → Apps Script**.
3. Borra el contenido, pega todo `google-apps-script/Code.gs` y pulsa **Guardar** 💾.
4. **Implementar → Nueva implementación** → icono ⚙️ → **Aplicación web**:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier usuario**
5. Pulsa **Implementar** y acepta los permisos (Google avisará de que la app no está verificada: *Configuración avanzada → Ir a … → Permitir*; es tu propio script).
6. Copia la **URL de la aplicación web** (termina en `/exec`).
7. En `js/config.js`, pega la URL:
   ```js
   urlGoogleSheets: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
8. Haz una confirmación de prueba en la web: aparecerá una fila en la pestaña **Confirmaciones**.

Columnas: Fecha de envío · Nombre y apellidos · Asistencia · Alergias o intolerancias · Transporte · Hotel · Noches de hotel · Comparte habitación con · Mensaje.

La pregunta del hotel desaparece sola del formulario a partir de `confirmacion.hotel.fechaLimite` (31/12/2026). Las tarifas y la información del hotel se cambian en `config.js → alojamiento`.

Cada invitado confirma por sí mismo (no hay campo de acompañantes): una fila por persona.

Si ya habías pegado una versión anterior del script, pégalo de nuevo y publica una **nueva versión** (Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión). Si la hoja ya tenía cabeceras antiguas, borra la pestaña “Confirmaciones” para que se cree de nuevo.

Protecciones incluidas: campo trampa antispam, recorte de textos largos y bloqueo de fórmulas en las celdas.

---

## Pendiente
- [ ] Pegar la URL de Google Apps Script en `config.js`.
- [ ] Completar dirección, teléfono y web del hotel en `config.js → alojamiento.hotel`.
- [ ] Sustituir las ilustraciones recortadas por dibujos propios (mismos nombres).
- [ ] Revisar los textos de “gracias” y, si se quiere, añadir fecha límite en `confirmacion.aviso`.
