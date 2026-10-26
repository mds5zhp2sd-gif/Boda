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
    ciudad: "Xixón, Asturias",
  },

  // Título de la pestaña del navegador y descripción para buscadores / WhatsApp.
  meta: {
    tituloPagina: "¡Nos casamos! · Sofía & Javi · 28.08.2027",
    descripcion: "Invitación de boda de Sofía y Javi. 28 de agosto de 2027, Xixón / Gijón (Asturias).",
  },

  /* ---------- Sección: PORTADA (#portada) ---------- */
  portada: {
    titulo: "¡Nos casamos!",
    imagenMar: "img/portada-mar.png",   // franja de mar en acuarela con el faro
    imagen: "img/ilus-pareja.png",       // vuestro dibujo, colocado encima del mar
    imagenAlt: "Ilustración de Javi pescando con una caña y de Sofía sonriendo dentro de la red, junto al mar, con un faro al fondo.",
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
        calendario: true,   // desplegable "Añadir al calendario" (textos en extras.calendario)
      },
      {
        id: "ceremonia",
        icono: "img/icono-capilla.svg",
        etiqueta: "Ceremonia",
        lineas: ["Capilla de la Providencia", "12:00"],
        mapa: "https://www.google.com/maps/search/?api=1&query=Capilla+de+la+Providencia+Gij%C3%B3n",
        // Desplegable "Aparcamiento y avisos". Cada aviso: título, texto, y opcionalmente
        // mapa (enlace) y foto (ruta en img/; si está vacía o no existe, no se muestra).
        avisos: [
          {
            titulo: "Aforo reducido",
            texto: "La capilla es muy pequeña, así que en el interior tendrán prioridad los familiares más cercanos.",
          },
          {
            titulo: "¿Prefieres esperar fuera?",
            texto: "Justo al lado está la mítica sidrería El Hórreo, un sitio perfecto para esperar con un culín mientras termina la ceremonia.",
            foto: "img/foto-el-horreo-terraza.jpg",
            fotoAlt: "Terraza de la sidrería El Hórreo, casa de piedra con flores",
          },
          {
            titulo: "Aparcamiento",
            texto: "El Hórreo tiene un gran aparcamiento, ideal si vienes en coche.",
            foto: "img/foto-el-horreo.jpg",
            fotoAlt: "Entrada al aparcamiento de la sidrería El Hórreo",
            mapa: "https://www.google.com/maps/search/?api=1&query=Sidrer%C3%ADa+El+H%C3%B3rreo+La+Providencia+Gij%C3%B3n",
          },
        ],
      },
      {
        id: "coctel",
        icono: "img/icono-coctel.svg",
        etiqueta: "Cóctel",
        lineas: ["abba Playa Gijón", "14:00"],
        mapa: "https://www.google.com/maps/search/?api=1&query=abba+Playa+Gij%C3%B3n",
        avisos: [
          {
            titulo: "Aparcamiento: explanada de los Hermanos Castro",
            texto: "Zona amplia para aparcar muy cerca del hotel.",
            mapa: "https://www.google.com/maps/search/?api=1&query=Explanada+Hermanos+Castro+Gij%C3%B3n",
            foto: "img/foto-explanada-hermanos-castro.jpg",
            fotoAlt: "Explanada de los Hermanos Castro, en Gijón",
          },
          {
            titulo: "Otra opción: bajos del Molinón",
            texto: "Si la explanada está llena, puedes aparcar en los bajos del estadio de El Molinón, al lado del hotel.",
            mapa: "https://www.google.com/maps/search/?api=1&query=Aparcamiento+El+Molin%C3%B3n+Gij%C3%B3n",
            foto: "img/foto-bajos-molinon.jpg",
            fotoAlt: "Aparcamiento en los bajos del estadio de El Molinón",
          },
        ],
      },
    ],
    // Botón principal bajo las columnas (con url "" está oculto: cada sitio ya tiene su "Cómo llegar").
    boton: {
      texto: "Ver en el mapa",
      url: "",
    },
    textoEnlaceMapa: "Cómo llegar",            // enlace pequeño en cada columna que tenga "mapa"
    textoAvisos: "Aparcamiento y avisos",      // botón del desplegable de cada columna con "avisos"
    textoMapaAviso: "Ver en el mapa",          // enlace dentro de cada aviso con "mapa"
  },

  /* ---------- Sección: PROGRAMA DEL DÍA (#programa) ---------- */
  programa: {
    titulo: "Programa del día",
    // Añade, quita o reordena eventos. Cada uno aparece automáticamente en la línea de tiempo.
    eventos: [
      { id: "ceremonia", hora: "12:00", nombre: "Ceremonia", icono: "img/icono-ceremonia.svg" },
      // Autobús quitado por ahora (aún no está decidido). Para volver a ponerlo:
      // { id: "autobus", hora: "13:30", nombre: "Autobús", icono: "img/icono-autobus.png" },
      { id: "coctel",    hora: "14:00", nombre: "Cóctel",    icono: "img/icono-programa-coctel.svg" },
      { id: "almuerzo",  hora: "16:30", nombre: "Almuerzo",  icono: "img/icono-almuerzo.svg" },
      { id: "fiesta",    hora: "18:30", nombre: "Fiesta",    icono: "img/icono-fiesta.svg" },
      { id: "recena",    hora: "21:30", nombre: "Recena",    icono: "img/icono-recena.svg" },
    ],
    ilustracion: "img/ilus-velero.png",
    frase: "¡Será un día inolvidable!",
  },

  /* ---------- Sección: ALOJAMIENTO (#alojamiento) ---------- */
  alojamiento: {
    titulo: "Alojamiento",
    texto: "Hemos llegado a un acuerdo con el hotel abba Playa Gijón para quien quiera alojarse allí y olvidarse del coche después de la fiesta. Pero podéis elegir el alojamiento que prefiráis (otro hotel, un Airbnb, un apartamento…): mientras sea en Gijón, todo queda cerca.",
    ilustracionIzquierda: "img/ilus-hotel-abba.svg",
    ilustracionDerecha: "img/ilus-ventanal-san-lorenzo.svg",
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
    // Tarifas que aparecen al desplegar (añade, quita o cambia precios aquí).
    introTarifas: "Para los que queráis alojaros en el mismo hotel y olvidaros del coche después de la fiesta, estas son las tarifas que nos han ofrecido:",
    tarifas: [
      { tipo: "Habitación doble", precio: "156 € / noche", detalle: "Desayuno incluido." },
      { tipo: "Habitación DUI (doble de uso individual)", precio: "135 € / noche", detalle: "Desayuno incluido. Ideal si vienes solo y quieres tu propia habitación." },
    ],
    // Bloques de información del desplegable. Cada uno con título (opcional) y texto.
    notas: [
      {
        titulo: "Cómo reservar",
        texto: "Podemos bloquearos la habitación nosotros: indícalo en el formulario de confirmación antes del 31 de diciembre de 2026. También podéis llamar al hotel sin problema diciendo nuestros nombres y la fecha de la boda, y os lo cuentan todo. El bloqueo es sin coste hasta 3 meses antes de la boda; después, en caso de cancelación, hay que abonarla.",
      },
      {
        titulo: "Check-in",
        texto: "Si reserváis la noche del sábado, el check-in está garantizado a partir de las 15:00 h. Si vuestra habitación está lista antes podréis entrar sin problema, aunque al ser temporada alta es posible que no esté disponible mucho antes.",
      },
      {
        titulo: "¿Necesitas cambiarte al llegar?",
        texto: "¡Que no cunda el pánico! El hotel nos deja un saloncito para que podáis cambiaros cómodamente, y en la zona fitness hay duchas disponibles.",
      },
      {
        titulo: "Otras opciones",
        texto: "Si preferís otra opción, ¡ningún problema! El hotel está en una zona muy céntrica de Gijón y hay muchísimos hoteles, apartamentos y alojamientos cerca para todos los gustos y presupuestos.",
      },
    ],
    textoBotonMapa: "Ver hotel en el mapa",
    textoBotonWeb: "Reservar",
  },

  /* ---------- Sección: CONFIRMA TU ASISTENCIA (#confirmacion) ---------- */
  confirmacion: {
    titulo: "Confirma tu asistencia",

    // URL de la aplicación web de Google Apps Script (ver README → "Conectar Google Sheets").
    // Mientras tenga el texto de ejemplo, el formulario funciona en "modo prueba" y no envía nada.
    urlGoogleSheets: "https://script.google.com/macros/s/AKfycbwI5E1W_8ApDBXtIOfnKXXx1U0YC_tCxgNGCP9yIbgPezMiTrpOY0DGAaIuMMOUwRDA/exec",

    // Texto opcional bajo el título, p. ej. "Por favor, confirma antes del 1 de julio".
    aviso: "",

    // Nota sobre acompañantes (déjala "" para quitarla). No hay desplegable de acompañantes:
    // cada persona confirma por sí misma.
    notaPersonal: "Cada persona confirma su propia asistencia. Por favor, no añadas “+1”: para nosotros todos los invitados son importantes.",

    campos: {
      nombre: "Nombre y apellidos",
      asistencia: "Asistencia",
      asistenciaSi: "Sí",
      asistenciaNo: "No",
      alergias: "Alergias o intolerancias (puedes marcar varias)",
      alergiasOtra: "¿Cuál? Escribe aquí tu alergia o intolerancia",
      transporte: "¿Necesitas transporte o irás en coche?",
      transporteSi: "Necesito transporte",
      transporteNo: "Iré en coche",
      mensaje: "Mensaje (opcional)",
    },

    // Casillas de alergias (se pueden marcar varias).
    // ninguna: true → al marcarla se desmarcan las demás. otra: true → muestra un campo para escribir cuál.
    opcionesAlergias: [
      { valor: "Ninguna", ninguna: true },
      { valor: "Sin marisco (cambiar por pescado)" },
      { valor: "Vegetariano" },
      { valor: "Vegano" },
      { valor: "Sin gluten (celiaquía)" },
      { valor: "Sin lactosa" },
      { valor: "Otra", otra: true },
    ],

    // Pregunta de habitación en el hotel (solo para quien viene).
    // Desaparece sola del formulario a partir de fechaLimite.
    hotel: {
      activo: true,
      fechaLimite: "2026-12-31T23:59:59+01:00",
      pregunta: "¿Quieres que te reservemos habitación en el hotel abba Playa Gijón?",
      ayuda: "La bloqueamos nosotros sin coste si nos lo dices antes del 31 de diciembre de 2026. Tienes las tarifas y la información en el apartado «Alojamiento».",
      // reserva: true → pregunta las noches. doble: true → pregunta con quién se comparte.
      opciones: [
        { valor: "No, gracias" },
        { valor: "Sí, habitación doble (156 €/noche)", reserva: true, doble: true },
        { valor: "Sí, habitación DUI, individual (135 €/noche)", reserva: true },
        { valor: "Llamaré yo al hotel" },
      ],
      noches: "¿Qué noches?",
      opcionesNoches: [
        "Solo la noche de la boda (sábado 28)",
        "Viernes 27 y sábado 28",
        "Sábado 28 y domingo 29",
        "Viernes 27, sábado 28 y domingo 29",
      ],
      comparte: "¿Con quién compartes la habitación? (nombre y apellidos)",
    },

    boton: "Confirmar participación",
    textos: {
      enviando: "Enviando…",
      graciasSi: "¡Gracias! Hemos recibido tu confirmación. ¡Qué ganas de celebrarlo contigo!",
      graciasNo: "Gracias por avisarnos. ¡Te echaremos de menos!",
      error: "No hemos podido enviar tu confirmación. Revisa tu conexión e inténtalo de nuevo, o escríbenos directamente.",
      faltanDatos: "Te falta completar los campos marcados en rojo (solo el mensaje es opcional).",
      modoPrueba: "Modo prueba: el formulario todavía no está conectado a Google Sheets, así que no se ha enviado nada.",
      otraRespuesta: "Enviar otra confirmación",
    },
    ilustracion: "img/icono-confirmacion.svg",
    iconos: {
      nombre: "img/icono-form-nombre.png",
      asistencia: "img/icono-form-asistencia.png",
      alergias: "img/icono-form-alergias.png",
      transporte: "img/icono-form-transporte.png",
      hotel: "img/icono-form-hotel.svg",
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
    // Cuenta atrás con reloj de arena (cuenta hasta boda.fechaISO)
    cuentaAtras: {
      activo: true,
      titulo: "Faltan",
      unidades: { dias: ["día", "días"], horas: ["hora", "horas"], minutos: ["min", "min"] },
      textoHoy: "¡Hoy es el gran día!",
      textoPasado: "¡Gracias por celebrarlo con nosotros!",
    },
    // Desplegable "Añadir al calendario" en la columna Fecha de Detalles
    calendario: {
      activo: true,
      texto: "Añadir al calendario",
      introDesplegable: "Guarda la fecha para no perdértela:",
      textoGoogle: "Google Calendar",
      textoApple: "Apple Calendar",
      textoOutlook: "Outlook / Hotmail",
      // Archivo .ics fijo (en iPhone se abre directamente en Calendario). Si cambias fecha,
      // hora o lugar, actualízalo también (instrucciones en el README).
      archivoIcs: "boda.ics",
      tituloEvento: "Boda de Sofía y Javi",
      lugar: "Capilla de la Providencia, Gijón",
      descripcion: "Ceremonia a las 12:00 en la Capilla de la Providencia; después, celebración en el hotel abba Playa Gijón. Toda la información: https://mds5zhp2sd-gif.github.io/Boda/",
      fin: "2027-08-29T02:00:00+02:00",
    },
    musica: {
      activo: true,
      archivo: "audio/cancion.mp3",   // crea la carpeta audio/ y sube aquí la canción
      textoPlay: "Poner música",
      textoPausa: "Pausar música",
    },
  },
};
