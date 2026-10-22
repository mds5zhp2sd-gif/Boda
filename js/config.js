/* ==========================================================================
   CONFIGURACIÓN DE LA INVITACIÓN
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que hace falta tocar para cambiar textos, datos,
   horarios, enlaces o imágenes. Guarda el archivo, súbelo a GitHub y la web
   se actualiza sola.

   Reglas rápidas:
   - Los textos van siempre entre comillas: "así".
   - Cada elemento de una lista termina en coma.
   - Si un dato no se usa, déjalo vacío: ""  (lo que esté vacío no se muestra).
   - Las rutas de imágenes son relativas a la carpeta del proyecto (img/...).
   ========================================================================== */

window.BODA_CONFIG = {

  /* ---------- Datos generales ---------- */
  pareja: {
    nombre1: "Sofía",
    nombre2: "Javi",
  },

  boda: {
    // Fecha y hora de inicio en formato ISO (se usa para la cuenta atrás y el calendario).
    fechaISO: "2027-08-28T12:00:00+02:00",
    fechaTexto: "28 · 08 · 2027",   // como se ve en la portada
    fechaCorta: "28.08.2027",       // como se ve en el pie
    ciudad: "Gijón, Asturias",
  },

  // Título de la pestaña del navegador y descripción para buscadores / WhatsApp.
  meta: {
    tituloPagina: "¡Nos casamos! · Sofía & Javi · 28.08.2027",
    descripcion: "Invitación de boda de Sofía y Javi. 28 de agosto de 2027, Gijón (Asturias).",
  },

  /* ---------- Sección: PORTADA (#portada) ---------- */
  portada: {
    titulo: "¡Nos casamos!",
    imagen: "img/portada-escena.png",
    imagenAlt: "Ilustración en acuarela: un pescador con su caña y una chica con una red junto al mar, y un faro sobre una isla al fondo.",
  },

  /* ---------- Separadores de olas entre secciones ---------- */
  separadores: {
    // Un separador por hueco entre secciones (en orden). Si hay menos imágenes que huecos, se repiten.
    imagenes: [
      "img/ola-separador-1.png",
      "img/ola-separador-2.png",
      "img/ola-separador-3.png",
      "img/ola-separador-4.png",
    ],
  },

  /* ---------- Sección: DETALLES (#detalles) ---------- */
  detalles: {
    titulo: "Detalles",
    // Cada columna es un bloque. Puedes añadir, quitar o reordenar.
    columnas: [
      {
        id: "fecha",
        icono: "img/icono-fecha.png",
        etiqueta: "Fecha",
        lineas: ["28 · 08 · 2027"],
        mapa: "",
      },
      {
        id: "ceremonia",
        icono: "img/icono-lugar.png",
        etiqueta: "Ceremonia",
        lineas: ["Capilla de la Providencia", "12:00"],
        mapa: "https://www.google.com/maps/search/?api=1&query=Capilla+de+la+Providencia+Gij%C3%B3n",
      },
      {
        id: "celebracion",
        icono: "img/icono-hora.png",
        etiqueta: "Celebración",
        lineas: ["abba Playa Gijón", "14:00"],
        mapa: "https://www.google.com/maps/search/?api=1&query=abba+Playa+Gij%C3%B3n",
      },
    ],
    // Botón principal bajo las columnas (déjalo con url "" para ocultarlo).
    boton: {
      texto: "Ver en el mapa",
      url: "https://www.google.com/maps/search/?api=1&query=Capilla+de+la+Providencia+Gij%C3%B3n",
    },
    textoEnlaceMapa: "Cómo llegar",   // enlace pequeño en cada columna que tenga "mapa"
  },

  /* ---------- Sección: PROGRAMA DEL DÍA (#programa) ---------- */
  programa: {
    titulo: "Programa del día",
    // Añade, quita o reordena eventos. Cada uno aparece automáticamente en la línea de tiempo.
    eventos: [
      { id: "ceremonia", hora: "12:00", nombre: "Ceremonia", icono: "img/icono-ceremonia.png" },
      { id: "autobus",   hora: "13:30", nombre: "Autobús",   icono: "img/icono-autobus.png" },
      { id: "aperitivo", hora: "14:00", nombre: "Aperitivo", icono: "img/icono-aperitivo.png" },
      { id: "almuerzo",  hora: "16:30", nombre: "Almuerzo",  icono: "img/icono-almuerzo.png" },
      { id: "fiesta",    hora: "18:30", nombre: "Fiesta",    icono: "img/icono-fiesta.png" },
      { id: "recena",    hora: "21:30", nombre: "Recena",    icono: "img/icono-recena.png" },
    ],
    ilustracion: "img/ilus-velero.png",
    frase: "¡Será un día inolvidable!",
  },

  /* ---------- Sección: ALOJAMIENTO (#alojamiento) ---------- */
  alojamiento: {
    titulo: "Alojamiento",
    texto: "Te recomendamos el hotel abba Playa Gijón, a solo unos minutos de la celebración, con tarifa especial para nuestros invitados.",
    ilustracionIzquierda: "img/ilus-concha.png",
    ilustracionDerecha: "img/ilus-farol.png",
    botonAbrir: "Ver opciones de alojamiento",
    botonCerrar: "Ocultar alojamiento",
    // Lo que aparece al desplegar. Los campos vacíos no se muestran.
    hotel: {
      nombre: "abba Playa Gijón",
      direccion: "",          // PENDIENTE: dirección del hotel
      telefono: "",           // PENDIENTE: teléfono de reservas
      web: "",                // PENDIENTE: enlace a la web o a la reserva
      mapa: "https://www.google.com/maps/search/?api=1&query=abba+Playa+Gij%C3%B3n",
    },
    notas: [
      "Pregúntanos cómo reservar con la tarifa especial para invitados.",
    ],
    textoBotonMapa: "Ver hotel en el mapa",
    textoBotonWeb: "Reservar",
  },

  /* ---------- Sección: CONFIRMA TU ASISTENCIA (#confirmacion) ---------- */
  confirmacion: {
    titulo: "Confirma tu asistencia",

    // URL de la aplicación web de Google Apps Script (ver README → "Conectar Google Sheets").
    // Mientras tenga el texto de ejemplo, el formulario funciona en "modo prueba" y no envía nada.
    urlGoogleSheets: "PEGA_AQUI_LA_URL_DE_APPS_SCRIPT",

    // Texto opcional bajo el título, p. ej. "Por favor, confirma antes del 1 de julio".
    aviso: "",

    campos: {
      nombre: "Nombre y apellidos",
      asistencia: "Asistencia",
      asistenciaSi: "Sí",
      asistenciaNo: "No",
      acompanantes: "Número de acompañantes",
      alergias: "Alergias o intolerancias",
      alergiasOtra: "Indica tu alergia o intolerancia",
      autobus: "¿Necesitas el autobús?",
      autobusSi: "Sí",
      autobusNo: "No",
      mensaje: "Mensaje (opcional)",
    },

    // Opciones del desplegable de acompañantes (sin contarte a ti).
    opcionesAcompanantes: ["0", "1", "2", "3", "4", "5 o más"],

    // Opciones del desplegable de alergias. La opción marcada con otra: true muestra un campo de texto.
    opcionesAlergias: [
      { valor: "Ninguna" },
      { valor: "Vegetariano" },
      { valor: "Vegano" },
      { valor: "Sin gluten (celiaquía)" },
      { valor: "Sin lactosa" },
      { valor: "Otra", otra: true },
    ],

    boton: "Confirmar participación",
    textos: {
      enviando: "Enviando…",
      graciasSi: "¡Gracias! Hemos recibido tu confirmación. ¡Qué ganas de celebrarlo contigo!",
      graciasNo: "Gracias por avisarnos. ¡Te echaremos de menos!",
      error: "No hemos podido enviar tu confirmación. Revisa tu conexión e inténtalo de nuevo, o escríbenos directamente.",
      faltanDatos: "Por favor, completa tu nombre e indica si vendrás.",
      modoPrueba: "Modo prueba: el formulario todavía no está conectado a Google Sheets, así que no se ha enviado nada.",
      otraRespuesta: "Enviar otra confirmación",
    },
    ilustracion: "img/ilus-concha-pequena.png",
    iconos: {
      nombre: "img/icono-form-nombre.png",
      asistencia: "img/icono-form-asistencia.png",
      acompanantes: "img/icono-form-acompanantes.png",
      alergias: "img/icono-form-alergias.png",
      autobus: "img/icono-form-autobus.png",
      mensaje: "img/icono-form-mensaje.png",
    },
  },

  /* ---------- Sección: PIE (#pie) ---------- */
  pie: {
    imagenOlas: "img/pie-olas.png",
    ilustracionIzquierda: "img/ilus-ancla.png",
    ilustracionDerecha: "img/ilus-concha-pie.png",
  },

  /* ---------- EXTRAS (desactivados: cambia activo a true para usarlos) ---------- */
  extras: {
    cuentaAtras: {
      activo: false,
      texto: "Faltan {dias} días",     // {dias} se sustituye por el número
      textoHoy: "¡Hoy es el gran día!",
    },
    calendario: {
      activo: false,
      texto: "Añadir al calendario",
      tituloEvento: "Boda de Sofía y Javi",
      lugar: "Capilla de la Providencia, Gijón",
      fin: "2027-08-29T02:00:00+02:00",
    },
    musica: {
      activo: false,
      archivo: "audio/cancion.mp3",   // crea la carpeta audio/ y sube aquí la canción
      textoPlay: "Poner música",
      textoPausa: "Pausar música",
    },
  },
};
