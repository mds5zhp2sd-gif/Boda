# Sofía & Javi — Invitación con acuarela original

Esta versión reproduce **exactamente la imagen original** aportada de la invitación. No se sustituye por dibujos vectoriales simples, tarjetas ni tipografías diferentes.

## Archivos del proyecto
- `index.html` — página web, accesos interactivos y formulario local.
- `styles.css` — presentación y accesibilidad del formulario emergente.
- `invitacion-original.jpg` — ilustración original entera, sin alteraciones.
- `titulo-confirmacion.jpg` — recorte de la propia ilustración para la cabecera del formulario emergente.

**No hay un archivo `script.js`**. El pequeño código necesario para abrir el formulario y generar el mensaje se encuentra al final de `index.html`. No utiliza servicios de terceros, `fetch`, XMLHttpRequest, trackers ni llamadas a APIs externas para enviar datos.

## Subir a GitHub (repositorio `Boda`)
1. Descomprime `boda-final-acuarela.zip`.
2. Entra en `https://github.com/mds5zhp2sd-gif/Boda`.
3. Selecciona `Add file` > `Upload files` y sube **los cuatro archivos**, no el ZIP, directamente a la raíz del repositorio. Confirma la sustitución de `index.html` y `styles.css` si GitHub te la solicita.
4. Pulsa `Commit changes`.
5. Comprueba que la rama publicada en `Settings` > `Pages` sigue siendo `main` y carpeta `/(root)`.
6. Entra a `https://mds5zhp2sd-gif.github.io/Boda/` y fuerza la recarga (`Cmd + Shift + R` en Mac; `Ctrl + Shift + R` en Windows). A veces GitHub Pages tarda unos minutos en mostrar el cambio.
7. Si siguen apareciendo `Nuestra historia` o tarjetas grandes, es la **versión anterior**: revisa que `index.html` se haya sustituido realmente y que aparezcan las dos imágenes JPG en la raíz del repositorio.

El archivo `script.js` de versiones antiguas se puede eliminar del repositorio porque ya no se utiliza (no hace falta eliminarlo para que esta web funcione).

## Interacción y límites
- El botón `Ver en el mapa` de la ilustración abre Google Maps de la Capilla de la Providencia (solo al pulsarlo).
- `Ver opciones de alojamiento` abre información del hotel y un enlace al mapa (solo al pulsarlo).
- Al pulsar cualquier campo de `Confirma tu asistencia` o el botón bajo la ilustración, se abre un formulario HTML real, legible y adaptado a móvil.
- El formulario **no manda datos**. El invitado puede generar y copiar un texto con sus respuestas y después enviarlo personalmente a los novios por su canal habitual. **No almacena respuestas en GitHub** ni manda mensajes automáticamente.
- El contenido visible de la invitación es la imagen aportada; para cambiar texto o diseño en ella hay que editar esa ilustración.
- En pantallas de móvil pequeñas, el texto de la imagen queda reducido. El formulario emergente sí se muestra con tamaño legible.

## Privacidad y seguridad
- No hay analítica, cookies de seguimiento, envío automático de datos ni fuentes remotas.
- La ilustración es local. Los únicos enlaces externos son a Google Maps y requieren pulsación del usuario.
- No garantiza pasar controles concretos de Zscaler; si hay un bloqueo, conviene revisar el informe de la regla con Seguridad.

## Antes de compartir
Verificar datos de boda y alojamiento con los novios. El formulario no recoge confirmaciones de forma centralizada: cada persona tiene que enviar por separado su mensaje copiado.
