/* ==========================================================================
   LÓGICA DE LA INVITACIÓN
   Lee los datos de js/config.js (window.BODA_CONFIG) y construye la página.
   Normalmente NO hace falta tocar este archivo: los cambios de contenido van
   en config.js y los de aspecto en css/estilos.css.

   Índice:
     1. Utilidades
     2. Textos e imágenes simples (atributos data-texto / data-src / ...)
     3. Separadores
     4. #detalles
     5. #programa
     6. #alojamiento
     7. #confirmacion (formulario → Google Sheets)
     8. Extras (cuenta atrás, calendario, música)
   ========================================================================== */
(function () {
  "use strict";

  const C = window.BODA_CONFIG;
  if (!C) {
    console.error("No se ha encontrado la configuración (js/config.js).");
    return;
  }

  /* 1. UTILIDADES ========================================================= */
  const $ = (selector, raiz = document) => raiz.querySelector(selector);
  const $$ = (selector, raiz = document) => Array.from(raiz.querySelectorAll(selector));

  // Valores calculados disponibles en el HTML con "@nombre".
  const calculados = {
    nombres: `${C.pareja.nombre1} & ${C.pareja.nombre2}`,
    firma: `${C.pareja.nombre1} & ${C.pareja.nombre2}\u00a0 · \u00a0${C.boda.fechaCorta}`,
  };

  // Lee un valor de la configuración a partir de una ruta tipo "detalles.boton.texto".
  function leer(ruta) {
    if (ruta.startsWith("@")) return calculados[ruta.slice(1)];
    return ruta.split(".").reduce((obj, clave) => (obj == null ? undefined : obj[clave]), C);
  }

  // Crea un elemento con clase, atributos e hijos.
  function crear(etiqueta, atributos = {}, hijos = []) {
    const el = document.createElement(etiqueta);
    Object.entries(atributos).forEach(([clave, valor]) => {
      if (valor === undefined || valor === null || valor === false) return;
      if (clave === "clase") el.className = valor;
      else if (clave === "texto") el.textContent = valor;
      else el.setAttribute(clave, valor === true ? "" : valor);
    });
    [].concat(hijos).forEach((hijo) => hijo && el.append(hijo));
    return el;
  }

  function corazon(claseExtra = "") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `corazon ${claseExtra}`.trim());
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#corazon");
    svg.append(use);
    return svg;
  }

  const estaVacio = (valor) => valor === undefined || valor === null || String(valor).trim() === "";

  /* 2. TEXTOS E IMÁGENES SIMPLES ========================================= */
  function rellenarSimples() {
    document.title = C.meta.tituloPagina;
    const descripcion = $('meta[name="description"]');
    if (descripcion) descripcion.content = C.meta.descripcion;

    $$("[data-texto]").forEach((el) => {
      const valor = leer(el.dataset.texto);
      if (estaVacio(valor)) return;
      el.textContent = valor;
      el.hidden = false;
    });
    $$("[data-src]").forEach((el) => {
      const valor = leer(el.dataset.src);
      if (estaVacio(valor)) el.hidden = true;
      else el.src = valor;
    });
    // La nota de acompañantes solo se muestra si tiene texto.
    $("#confirmacion-nota").hidden = estaVacio(C.confirmacion.notaPersonal);
    $$("[data-alt]").forEach((el) => { el.alt = leer(el.dataset.alt) || ""; });
    $$("[data-placeholder]").forEach((el) => { el.placeholder = leer(el.dataset.placeholder) || ""; });
  }

  /* 3. SEPARADORES ======================================================== */
  function rellenarSeparadores() {
    const imagenes = C.separadores.imagenes || [];
    if (!imagenes.length) return;
    $$(".separador").forEach((el, i) => {
      el.id = `separador-${i + 1}`;
      el.style.backgroundImage = `url("${imagenes[i % imagenes.length]}")`;
    });
  }

  /* 4. DETALLES =========================================================== */
  function rellenarDetalles() {
    const lista = $("#detalles-columnas");
    const columnas = C.detalles.columnas || [];
    lista.style.setProperty("--columnas", Math.max(1, columnas.length));

    columnas.forEach((col) => {
      const item = crear("li", { id: `detalle-${col.id}`, clase: "detalle" }, [
        col.icono && crear("img", { clase: "detalle__icono", src: col.icono, alt: "", height: 50 }),
        crear("p", { clase: "detalle__etiqueta", texto: col.etiqueta }),
        ...(col.lineas || []).map((linea) => crear("p", { clase: "detalle__linea", texto: linea })),
        !estaVacio(col.mapa) && crear("a", {
          clase: "detalle__mapa",
          href: col.mapa,
          target: "_blank",
          rel: "noopener noreferrer",
          texto: C.detalles.textoEnlaceMapa,
          "aria-label": `${C.detalles.textoEnlaceMapa}: ${(col.lineas || [])[0] || col.etiqueta}`,
        }),
      ]);
      lista.append(item);

      // Desplegable "Aparcamiento y avisos" de esta columna
      const avisos = (col.avisos || []).filter((a) => !estaVacio(a.texto));
      if (!avisos.length) return;
      const idPanel = `avisos-${col.id}`;
      const boton = crear("button", {
        id: `boton-avisos-${col.id}`, clase: "detalle__avisos-boton", type: "button",
        "aria-expanded": "false", "aria-controls": idPanel,
      }, [C.detalles.textoAvisos, crear("span", { clase: "detalle__avisos-flecha", "aria-hidden": "true", texto: "▾" })]);
      item.append(boton);

      const panel = crear("li", { id: idPanel, clase: "detalle-avisos", hidden: true, "aria-label": `${C.detalles.textoAvisos} · ${col.etiqueta}` }, [
        crear("p", { clase: "detalle-avisos__lugar", texto: `${col.etiqueta}\u00a0 · \u00a0${(col.lineas || [])[0] || ""}` }),
        ...avisos.map((a) => {
          const aviso = crear("div", { clase: "aviso" }, [
            !estaVacio(a.titulo) && crear("h3", { clase: "aviso__titulo", texto: a.titulo }),
            crear("p", { clase: "aviso__texto", texto: a.texto }),
            !estaVacio(a.mapa) && crear("a", {
              clase: "aviso__mapa", href: a.mapa, target: "_blank", rel: "noopener noreferrer",
            }, [C.detalles.textoMapaAviso, crear("span", { "aria-hidden": "true", texto: " →" })]),
          ]);
          if (!estaVacio(a.foto)) {
            // La foto solo aparece si el archivo existe.
            const img = crear("img", { clase: "aviso__foto", src: a.foto, alt: a.fotoAlt || "", loading: "lazy" });
            img.addEventListener("error", () => img.remove());
            aviso.prepend(img);
          }
          return aviso;
        }),
      ]);
      lista.append(panel);

      boton.addEventListener("click", () => {
        const abrir = boton.getAttribute("aria-expanded") !== "true";
        // Solo un desplegable abierto a la vez
        $$(".detalle__avisos-boton", lista).forEach((b) => b.setAttribute("aria-expanded", "false"));
        $$(".detalle-avisos", lista).forEach((p) => { p.hidden = true; });
        boton.setAttribute("aria-expanded", String(abrir));
        panel.hidden = !abrir;
      });
    });

    const boton = $("#detalles-boton-mapa");
    if (C.detalles.boton && !estaVacio(C.detalles.boton.url)) {
      boton.href = C.detalles.boton.url;
      boton.hidden = false;
    }
  }

  /* 5. PROGRAMA =========================================================== */
  function rellenarPrograma() {
    const lista = $("#programa-eventos");
    (C.programa.eventos || []).forEach((ev) => {
      lista.append(crear("li", { id: `evento-${ev.id}`, clase: "evento" }, [
        corazon("evento__corazon"),
        ev.icono ? crear("img", { clase: "evento__icono", src: ev.icono, alt: "", height: 50 }) : crear("span"),
        crear("span", { clase: "evento__punto", "aria-hidden": "true" }),
        crear("time", { clase: "evento__hora", texto: ev.hora }),
        crear("span", { clase: "evento__nombre", texto: ev.nombre }),
      ]));
    });
  }

  /* 6. ALOJAMIENTO ======================================================== */
  function rellenarAlojamiento() {
    const A = C.alojamiento;
    const panel = $("#alojamiento-panel");
    const boton = $("#alojamiento-boton");
    const textoBoton = $("#alojamiento-boton-texto");
    const h = A.hotel || {};

    const datos = [
      crear("p", { clase: "alojamiento__hotel", texto: h.nombre }),
      !estaVacio(h.direccion) && crear("p", { clase: "alojamiento__dato alojamiento__direccion", texto: h.direccion }),
      !estaVacio(h.telefono) && crear("p", { clase: "alojamiento__dato alojamiento__telefono" }, [
        "Teléfono: ",
        crear("a", { href: `tel:${h.telefono.replace(/\s+/g, "")}`, texto: h.telefono }),
      ]),
    ];
    panel.append(...datos.filter(Boolean));

    const tarifas = A.tarifas || [];
    if (tarifas.length) {
      if (!estaVacio(A.introTarifas)) panel.append(crear("p", { clase: "alojamiento__intro", texto: A.introTarifas }));
      panel.append(crear("ul", { id: "alojamiento-tarifas", clase: "alojamiento__tarifas" }, tarifas.map((t) =>
        crear("li", { clase: "tarifa" }, [
          crear("span", { clase: "tarifa__tipo", texto: t.tipo }),
          crear("span", { clase: "tarifa__precio", texto: t.precio }),
          !estaVacio(t.detalle) && crear("span", { clase: "tarifa__detalle", texto: t.detalle }),
        ]))));
    }

    // Cada nota puede ser un texto o un bloque { titulo, texto }.
    (A.notas || []).filter((n) => !estaVacio(typeof n === "string" ? n : n.texto)).forEach((n) => {
      const nota = typeof n === "string" ? { texto: n } : n;
      panel.append(crear("div", { clase: "alojamiento__nota" }, [
        !estaVacio(nota.titulo) && crear("h3", { clase: "alojamiento__nota-titulo", texto: nota.titulo }),
        crear("p", { texto: nota.texto }),
      ]));
    });
    const enlaces = crear("div", { clase: "alojamiento__enlaces" });
    if (!estaVacio(h.mapa)) {
      enlaces.append(crear("a", { id: "alojamiento-mapa", clase: "boton", href: h.mapa, target: "_blank", rel: "noopener noreferrer" }, [
        A.textoBotonMapa, crear("span", { clase: "boton__flecha", "aria-hidden": "true", texto: "→" }),
      ]));
    }
    if (!estaVacio(h.web)) {
      enlaces.append(crear("a", { id: "alojamiento-web", clase: "boton boton--secundario", href: h.web, target: "_blank", rel: "noopener noreferrer", texto: A.textoBotonWeb }));
    }
    if (enlaces.children.length) panel.append(enlaces);

    boton.addEventListener("click", () => {
      const abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", String(!abierto));
      panel.hidden = abierto;
      textoBoton.textContent = abierto ? A.botonAbrir : A.botonCerrar;
    });
  }

  /* 7. CONFIRMACIÓN ======================================================= */
  function prepararFormulario() {
    const F = C.confirmacion;
    const form = $("#formulario-confirmacion");
    const estado = $("#formulario-estado");
    const botonEnviar = $("#formulario-boton");
    const textoBotonEnviar = $("#formulario-boton-texto");
    const gruposSi = $("#campos-si-asiste");
    const contAlergias = $("#alergias-opciones");
    const campoOtra = $("#campo-alergias-otra");
    const H = F.hotel || {};
    const bloqueHotel = $("#bloque-hotel");
    const campoNoches = $("#campo-hotel-noches");
    const campoComparte = $("#campo-hotel-comparte");
    const selectNoches = $("#hotelNoches");
    const gracias = $("#confirmacion-gracias");

    // Desplegables: primera opción vacía que actúa como "placeholder".
    function rellenarSelect(select, titulo, opciones) {
      select.append(crear("option", { value: "", texto: titulo, disabled: true, selected: true }));
      opciones.forEach((op) => select.append(crear("option", { value: op.valor, texto: op.valor, "data-otra": op.otra ? "si" : null })));
      select.classList.add("campo__vacio");
      select.addEventListener("change", () => select.classList.toggle("campo__vacio", !select.value));
    }

    // Casillas o botones de opción a partir de una lista de { valor, ...marcas }.
    function crearOpciones(contenedor, nombre, tipo, opciones) {
      opciones.forEach((op, i) => {
        const input = crear("input", { type: tipo, name: nombre, value: op.valor, id: `${nombre}-${i + 1}` });
        Object.keys(op).filter((k) => k !== "valor" && op[k]).forEach((k) => { input.dataset[k] = "si"; });
        contenedor.append(crear("label", { clase: "casilla", for: input.id }, [input, crear("span", { texto: op.valor })]));
      });
    }

    // Alergias: varias a la vez; "Ninguna" es excluyente y "Otra" muestra un campo de texto.
    crearOpciones(contAlergias, "alergias", "checkbox", F.opcionesAlergias);
    const casillasAlergias = $$('input[name="alergias"]', contAlergias);
    contAlergias.addEventListener("change", (e) => {
      const marcada = e.target;
      if (marcada.checked) {
        casillasAlergias
          .filter((c) => c !== marcada && (marcada.dataset.ninguna || c.dataset.ninguna))
          .forEach((c) => { c.checked = false; });
      }
      const otra = casillasAlergias.find((c) => c.dataset.otra);
      campoOtra.hidden = !(otra && otra.checked);
      if (marcada.dataset.otra && marcada.checked) $("#alergiasOtra").focus();
    });

    // Hotel: solo hasta la fecha límite.
    const hotelDisponible = H.activo && (!H.fechaLimite || new Date() <= new Date(H.fechaLimite));
    if (hotelDisponible) {
      bloqueHotel.hidden = false;
      crearOpciones($("#hotel-opciones"), "hotel", "radio", H.opciones || []);
      rellenarSelect(selectNoches, H.noches, (H.opcionesNoches || []).map((v) => ({ valor: v })));
      $("#hotel-opciones").addEventListener("change", (e) => {
        campoNoches.hidden = !e.target.dataset.reserva;
        campoComparte.hidden = !e.target.dataset.doble;
      });
    }

    // Si no viene, se ocultan los campos que no aplican.
    form.addEventListener("change", (e) => {
      if (e.target.name === "asistencia") {
        gruposSi.hidden = e.target.value === "No";
        $("#campo-asistencia").classList.remove("campo--error");
      }
    });
    $("#nombre").addEventListener("input", () => $("#campo-nombre").classList.remove("campo--error"));

    function mostrarEstado(texto, tipo = "") {
      estado.textContent = texto;
      estado.className = `formulario__estado${tipo ? ` formulario__estado--${tipo}` : ""}`;
    }

    function recogerDatos() {
      const d = new FormData(form);
      const viene = d.get("asistencia") === "Sí";
      const alergias = casillasAlergias.filter((c) => c.checked).map((c) =>
        c.dataset.otra ? `${c.value}: ${(d.get("alergiasOtra") || "").trim()}` : c.value);
      const opcionHotel = $('input[name="hotel"]:checked');
      const reserva = viene && opcionHotel && opcionHotel.dataset.reserva;
      return {
        nombre: (d.get("nombre") || "").trim(),
        asistencia: d.get("asistencia") || "",
        alergias: viene ? alergias.join(", ") : "",
        transporte: viene ? d.get("transporte") || "" : "",
        hotel: viene && opcionHotel ? opcionHotel.value : "",
        hotelNoches: reserva ? d.get("hotelNoches") || "" : "",
        hotelComparte: reserva && opcionHotel.dataset.doble ? (d.get("hotelComparte") || "").trim() : "",
        mensaje: (d.get("mensaje") || "").trim(),
        web: d.get("web") || "", // antispam: debe ir vacío
      };
    }

    // Todo es obligatorio salvo el mensaje. Si no viene, basta con nombre y asistencia.
    function validar(datos) {
      $$(".campo--error", form).forEach((c) => c.classList.remove("campo--error"));
      const faltan = []; // [campo, elemento al que llevar el foco, nombre para el aviso]
      const exigir = (vacio, campo, foco, nombre) => { if (vacio) faltan.push([campo, foco, nombre]); };
      const C = F.campos;

      exigir(!datos.nombre, "#campo-nombre", "#nombre", C.nombre);
      exigir(!datos.asistencia, "#campo-asistencia", 'input[name="asistencia"]', C.asistencia);
      if (datos.asistencia === "Sí") {
        const marcadas = casillasAlergias.filter((c) => c.checked);
        exigir(!marcadas.length, "#campo-alergias", 'input[name="alergias"]', C.alergias.replace(/\s*\(.*\)$/, ""));
        exigir(marcadas.some((c) => c.dataset.otra) && !$("#alergiasOtra").value.trim(),
          "#campo-alergias-otra", "#alergiasOtra", C.alergiasOtra);
        exigir(!datos.transporte, "#campo-transporte", 'input[name="transporte"]', C.transporte);
        if (!bloqueHotel.hidden) {
          const opcionHotel = $('input[name="hotel"]:checked');
          exigir(!opcionHotel, "#campo-hotel", 'input[name="hotel"]', H.pregunta);
          if (opcionHotel && opcionHotel.dataset.reserva) exigir(!datos.hotelNoches, "#campo-hotel-noches", "#hotelNoches", H.noches);
          if (opcionHotel && opcionHotel.dataset.doble) exigir(!datos.hotelComparte, "#campo-hotel-comparte", "#hotelComparte", H.comparte);
        }
      }

      if (!faltan.length) return true;
      faltan.forEach(([campo]) => $(campo).classList.add("campo--error"));
      mostrarEstado(F.textos.faltanDatos, "error");
      $(faltan[0][1]).focus();
      $(faltan[0][0]).scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    // Al corregir un campo se quita su marca de error.
    ["input", "change"].forEach((evento) => form.addEventListener(evento, (e) => {
      const campo = e.target.closest(".campo");
      if (campo) campo.classList.remove("campo--error");
    }));

    function mostrarGracias(datos) {
      $("#confirmacion-gracias-texto").textContent = datos.asistencia === "Sí" ? F.textos.graciasSi : F.textos.graciasNo;
      form.hidden = true;
      gracias.hidden = false;
      gracias.focus();
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const datos = recogerDatos();
      if (!validar(datos)) return;

      const url = (F.urlGoogleSheets || "").trim();
      if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) {
        console.info("Modo prueba. Datos que se enviarían:", datos);
        mostrarEstado(F.textos.modoPrueba, "aviso");
        return;
      }

      botonEnviar.disabled = true;
      textoBotonEnviar.textContent = F.textos.enviando;
      mostrarEstado("");
      try {
        // Se envía como formulario normal (sin cabeceras especiales) para que Google lo acepte.
        const respuesta = await fetch(url, { method: "POST", body: new URLSearchParams(datos) });
        const resultado = await respuesta.json();
        if (!resultado.ok) throw new Error(resultado.error || "Respuesta no válida");
        mostrarGracias(datos);
        form.reset();
        gruposSi.hidden = false;
        campoOtra.hidden = true;
        campoNoches.hidden = true;
        campoComparte.hidden = true;
        selectNoches.classList.add("campo__vacio");
      } catch (error) {
        console.error("Error al enviar la confirmación:", error);
        mostrarEstado(F.textos.error, "error");
      } finally {
        botonEnviar.disabled = false;
        textoBotonEnviar.textContent = F.boton;
      }
    });

    $("#confirmacion-otra").addEventListener("click", () => {
      gracias.hidden = true;
      form.hidden = false;
      mostrarEstado("");
      $("#nombre").focus();
    });
  }

  /* 8. EXTRAS ============================================================= */
  function prepararExtras() {
    const X = C.extras || {};

    if (X.cuentaAtras && X.cuentaAtras.activo) prepararCuentaAtras(X.cuentaAtras);
    if (X.calendario && X.calendario.activo) prepararCalendario(X.calendario);

    if (X.musica && X.musica.activo) {
      const boton = $("#boton-musica");
      const audio = new Audio(X.musica.archivo);
      audio.loop = true;
      boton.hidden = false;
      boton.setAttribute("aria-label", X.musica.textoPlay);
      boton.addEventListener("click", () => {
        const sonando = !audio.paused;
        if (sonando) audio.pause(); else audio.play().catch((err) => console.warn("No se pudo reproducir la música:", err));
        boton.setAttribute("aria-pressed", String(!sonando));
        boton.setAttribute("aria-label", sonando ? X.musica.textoPlay : X.musica.textoPausa);
      });
    }
  }

  // Cuenta atrás con reloj de arena: se actualiza cada segundo hasta boda.fechaISO.
  function prepararCuentaAtras(CA) {
    const bloque = $("#cuenta-atras");
    const titulo = $("#cuenta-atras-titulo");
    const numeros = $("#cuenta-atras-numeros");
    const objetivo = new Date(C.boda.fechaISO);
    // Días tal cual; horas, minutos y segundos con dos cifras para que no "baile" el ancho
    const unidad = (n, [singular, plural], cifras = 1) =>
      crear("span", { clase: "cuenta-atras__unidad" }, [
        crear("strong", { texto: String(n).padStart(cifras, "0") }),
        crear("small", { texto: n === 1 ? singular : plural }),
      ]);
    let intervalo;

    function pintar() {
      const ms = objetivo - new Date();
      const hoy = new Date().toDateString() === objetivo.toDateString();
      if (ms <= 0) {
        clearInterval(intervalo);
        bloque.classList.add("cuenta-atras--fin");
        titulo.textContent = hoy ? CA.textoHoy : CA.textoPasado;
        numeros.textContent = "";
        return;
      }
      const s = Math.floor(ms / 1000);
      const U = CA.unidades;
      titulo.textContent = CA.titulo;
      numeros.replaceChildren(
        unidad(Math.floor(s / 86400), U.dias),
        unidad(Math.floor(s / 3600) % 24, U.horas, 2),
        unidad(Math.floor(s / 60) % 60, U.minutos, 2),
        unidad(s % 60, U.segundos, 2),
      );
    }
    bloque.hidden = false;
    pintar();
    intervalo = setInterval(pintar, 1000);
  }

  // "Añadir al calendario": Google Calendar (enlace) y Apple / Outlook (archivo .ics).
  function prepararCalendario(CAL) {
    const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const google = new URL("https://calendar.google.com/calendar/render");
    google.search = new URLSearchParams({
      action: "TEMPLATE",
      text: CAL.tituloEvento,
      dates: `${utc(C.boda.fechaISO)}/${utc(CAL.fin)}`,
      location: CAL.lugar,
      details: CAL.descripcion || "",
    });
    const enlaceGoogle = $("#calendario-google");
    enlaceGoogle.href = google.toString();
    enlaceGoogle.textContent = CAL.textoGoogle;
    const enlaceApple = $("#calendario-apple");
    enlaceApple.href = CAL.archivoIcs;
    enlaceApple.textContent = CAL.textoApple;

    const boton = $("#boton-calendario");
    const opciones = $("#calendario-opciones");
    $("#boton-calendario-texto").textContent = CAL.texto;
    boton.addEventListener("click", () => {
      const abrir = boton.getAttribute("aria-expanded") !== "true";
      boton.setAttribute("aria-expanded", String(abrir));
      opciones.hidden = !abrir;
    });
    $("#calendario").hidden = false;
  }

  /* ARRANQUE ============================================================== */
  rellenarSimples();
  rellenarSeparadores();
  rellenarDetalles();
  rellenarPrograma();
  rellenarAlojamiento();
  prepararFormulario();
  prepararExtras();
})();
