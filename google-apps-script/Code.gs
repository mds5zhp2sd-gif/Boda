/**
 * Recepción de confirmaciones de la boda en Google Sheets.
 *
 * Cómo instalarlo (resumen; pasos detallados en el README):
 *   1. Abre la hoja de Google → Extensiones → Apps Script.
 *   2. Borra lo que haya y pega este archivo entero. Guarda.
 *   3. Implementar → Nueva implementación → tipo "Aplicación web".
 *      - Ejecutar como: Yo
 *      - Quién tiene acceso: Cualquier usuario
 *   4. Copia la URL que termina en /exec y pégala en js/config.js → confirmacion.urlGoogleSheets.
 *
 * Si cambias este código, vuelve a "Implementar → Gestionar implementaciones → Editar → Nueva versión"
 * para que se aplique (la URL no cambia).
 */

// Nombre de la pestaña donde se guardan las respuestas (se crea sola si no existe).
const NOMBRE_HOJA = 'Confirmaciones';

// Columnas de la hoja: [cabecera visible, nombre del campo que envía la web].
const COLUMNAS = [
  ['Fecha de envío', null],
  ['Nombre y apellidos', 'nombre'],
  ['Asistencia', 'asistencia'],
  ['Alergias o intolerancias', 'alergias'],
  ['Transporte', 'transporte'],
  ['Mensaje', 'mensaje'],
];

const LONGITUD_MAXIMA = 600;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Antispam: el campo "web" está oculto; si viene relleno, es un robot. Se responde "ok" sin guardar.
    if (p.web) return responder({ ok: true });

    if (!p.nombre || !p.asistencia) {
      return responder({ ok: false, error: 'Faltan el nombre o la asistencia' });
    }

    const hoja = obtenerHoja();
    const fila = COLUMNAS.map(([, campo]) => (campo ? limpiar(p[campo]) : new Date()));
    hoja.appendRow(fila);
    return responder({ ok: true });
  } catch (error) {
    return responder({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Permite comprobar en el navegador que la URL funciona.
function doGet() {
  return responder({ ok: true, mensaje: 'Servicio de confirmaciones activo' });
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
  }
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS.map(([cabecera]) => cabecera));
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

// Recorta el texto y evita que se interprete como fórmula (=, +, -, @).
function limpiar(valor) {
  const texto = String(valor || '').trim().slice(0, LONGITUD_MAXIMA);
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
