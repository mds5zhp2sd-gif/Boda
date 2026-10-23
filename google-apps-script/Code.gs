/**
 * Recepción de confirmaciones de la boda en Google Sheets.
 *
 * Cómo instalarlo (resumen; pasos detallados en el README):
 *   1. Abre la hoja de Google → Extensiones → Apps Script.
 *   2. Borra lo que haya y pega este archivo entero. Guarda.
 *   3. Elige la función «prepararHoja» arriba y pulsa ▶ Ejecutar (una sola vez):
 *      crea las pestañas «Confirmaciones» y «Resumen» con su formato.
 *   4. Implementar → Nueva implementación → tipo "Aplicación web".
 *      - Ejecutar como: Yo
 *      - Quién tiene acceso: Cualquier usuario
 *   5. Copia la URL que termina en /exec y pégala en js/config.js → confirmacion.urlGoogleSheets.
 *
 * Si cambias este código, vuelve a "Implementar → Gestionar implementaciones → Editar → Nueva versión"
 * para que se aplique (la URL no cambia).
 */

// Nombre de la pestaña donde se guardan las respuestas (se crea sola si no existe).
const NOMBRE_HOJA = 'Confirmaciones';
const NOMBRE_RESUMEN = 'Resumen';

// Columnas de la hoja: [cabecera visible, nombre del campo que envía la web, ancho en píxeles].
const COLUMNAS = [
  ['Fecha de envío', null, 140],
  ['Nombre y apellidos', 'nombre', 200],
  ['Asistencia', 'asistencia', 90],
  ['Alergias o intolerancias', 'alergias', 220],
  ['Transporte', 'transporte', 150],
  ['Hotel', 'hotel', 250],
  ['Noches de hotel', 'hotelNoches', 230],
  ['Comparte habitación con', 'hotelComparte', 200],
  ['Mensaje', 'mensaje', 320],
];

const LONGITUD_MAXIMA = 600;

// Colores de la invitación
const COLOR_CABECERA = '#6d8677';
const COLOR_TEXTO_CABECERA = '#ffffff';
const COLOR_FILAS = '#f8f3ea';

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

/**
 * Ejecutar UNA VEZ a mano desde el editor de Apps Script.
 * Crea (o reordena) la pestaña de confirmaciones con formato y una pestaña de resumen con recuentos.
 * No borra respuestas que ya existan.
 */
function prepararHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = obtenerHoja();

  // Cabecera con los colores de la invitación
  const cabecera = hoja.getRange(1, 1, 1, COLUMNAS.length);
  cabecera.setValues([COLUMNAS.map(([titulo]) => titulo)])
    .setFontWeight('bold')
    .setBackground(COLOR_CABECERA)
    .setFontColor(COLOR_TEXTO_CABECERA)
    .setVerticalAlignment('middle');
  hoja.setFrozenRows(1);
  hoja.setRowHeight(1, 32);
  COLUMNAS.forEach(([, , ancho], i) => hoja.setColumnWidth(i + 1, ancho));

  // Formato de las filas de respuestas
  const filas = hoja.getRange(2, 1, hoja.getMaxRows() - 1, COLUMNAS.length);
  filas.setVerticalAlignment('top').setWrap(true);
  hoja.getRange(2, 1, hoja.getMaxRows() - 1, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  if (!hoja.getBandings().length) {
    filas.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false)
      .setFirstRowColor('#ffffff').setSecondRowColor(COLOR_FILAS);
  }

  // "Sí" en verde y "No" en terracota en la columna de asistencia
  const colAsistencia = hoja.getRange(2, columna('asistencia'), hoja.getMaxRows() - 1, 1);
  hoja.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Sí')
      .setBackground('#dfe8dc').setFontColor('#3f6b55').setRanges([colAsistencia]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No')
      .setBackground('#f3dfd8').setFontColor('#a2483a').setRanges([colAsistencia]).build(),
  ]);

  prepararResumen(libro);
  SpreadsheetApp.getUi().alert('Listo: se han preparado las pestañas «' + NOMBRE_HOJA + '» y «' + NOMBRE_RESUMEN + '».');
}

// Pestaña con los recuentos que se actualizan solos.
function prepararResumen(libro) {
  let resumen = libro.getSheetByName(NOMBRE_RESUMEN);
  if (!resumen) resumen = libro.insertSheet(NOMBRE_RESUMEN);
  resumen.clear();

  const rango = (campo) => {
    const letra = letraColumna(columna(campo));
    return "'" + NOMBRE_HOJA + "'!" + letra + '2:' + letra;
  };
  const filas = [
    ['Confirmaciones recibidas', '=COUNTA(' + rango('nombre') + ')'],
    ['Vienen', '=COUNTIF(' + rango('asistencia') + ',"Sí")'],
    ['No pueden venir', '=COUNTIF(' + rango('asistencia') + ',"No")'],
    ['', ''],
    ['Necesitan transporte', '=COUNTIF(' + rango('transporte') + ',"Necesito transporte")'],
    ['Irán en coche', '=COUNTIF(' + rango('transporte') + ',"Iré en coche")'],
    ['', ''],
    ['Hotel · habitación doble', '=COUNTIF(' + rango('hotel') + ',"Sí, habitación doble*")'],
    ['Hotel · habitación DUI (individual)', '=COUNTIF(' + rango('hotel') + ',"Sí, habitación DUI*")'],
    ['Llamarán ellos al hotel', '=COUNTIF(' + rango('hotel') + ',"Llamaré yo*")'],
    ['', ''],
    ['Con alergias o intolerancias', '=COUNTIFS(' + rango('asistencia') + ',"Sí",' + rango('alergias') + ',"<>",' + rango('alergias') + ',"<>Ninguna")'],
    ['Sin marisco (cambiar por pescado)', '=COUNTIF(' + rango('alergias') + ',"*Sin marisco*")'],
    ['Vegetarianos', '=COUNTIF(' + rango('alergias') + ',"*Vegetariano*")'],
    ['Veganos', '=COUNTIF(' + rango('alergias') + ',"*Vegano*")'],
    ['Sin gluten', '=COUNTIF(' + rango('alergias') + ',"*Sin gluten*")'],
    ['Sin lactosa', '=COUNTIF(' + rango('alergias') + ',"*Sin lactosa*")'],
  ];

  resumen.getRange(1, 1, 1, 2).setValues([['Resumen de la boda', '']])
    .setFontWeight('bold').setFontSize(14).setBackground(COLOR_CABECERA).setFontColor(COLOR_TEXTO_CABECERA);
  resumen.getRange(2, 1, filas.length, 2).setValues(filas);
  resumen.getRange(2, 2, filas.length, 1).setFontWeight('bold').setHorizontalAlignment('center');
  resumen.setColumnWidth(1, 280);
  resumen.setColumnWidth(2, 90);
  resumen.setFrozenRows(1);
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA, 0);
  }
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS.map(([cabecera]) => cabecera));
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }
  return hoja;
}

// Número de columna (1, 2, …) del campo que envía la web.
function columna(campo) {
  return COLUMNAS.findIndex(([, c]) => c === campo) + 1;
}

function letraColumna(numero) {
  let letra = '';
  while (numero > 0) {
    const resto = (numero - 1) % 26;
    letra = String.fromCharCode(65 + resto) + letra;
    numero = Math.floor((numero - 1) / 26);
  }
  return letra;
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
