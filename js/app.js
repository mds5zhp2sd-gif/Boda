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
    const notas = (A.notas || []).filter((n) => !estaVacio(n));
    if (notas.length) {
      panel.append(crear("ul", { clase: "alojamiento__notas" }, notas.map((n) => crear("li", { texto: n }))));
    }
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
    const selectAcompanantes = $("#acompanantes");
    const selectAlergias = $("#alergias");
    const campoOtra = $("#campo-alergias-otra");
    const gracias = $("#confirmacion-gracias");

    // Desplegables: primera opción vacía que actúa como "placeholder".
    function rellenarSelect(select, titulo, opciones) {
      select.append(crear("option", { value: "", texto: titulo, disabled: true, selected: true }));
      opciones.forEach((op) => select.append(crear("option", { value: op.valor, texto: op.valor, "data-otra": op.otra ? "si" : null })));
      select.classList.add("campo__vacio");
      select.addEventListener("change", () => select.classList.toggle("campo__vacio", !select.value));
    }
    rellenarSelect(selectAcompanantes, F.campos.acompanantes, F.opcionesAcompanantes.map((v) => ({ valor: v })));
    rellenarSelect(selectAlergias, F.campos.alergias, F.opcionesAlergias);

    selectAlergias.addEventListener("change", () => {
      const opcion = selectAlergias.selectedOptions[0];
      const esOtra = opcion && opcion.dataset.otra === "si";
      campoOtra.hidden = !esOtra;
      if (esOtra) $("#alergiasOtra").focus();
    });

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
      const alergia = d.get("alergias") || "";
      const opcionAlergia = selectAlergias.selectedOptions[0];
      const alergiaFinal = opcionAlergia && opcionAlergia.dataset.otra === "si"
        ? `${alergia}: ${(d.get("alergiasOtra") || "").trim()}`
        : alergia;
      return {
        nombre: (d.get("nombre") || "").trim(),
        asistencia: d.get("asistencia") || "",
        acompanantes: viene ? d.get("acompanantes") || "0" : "",
        alergias: viene ? alergiaFinal : "",
        autobus: viene ? d.get("autobus") || "" : "",
        mensaje: (d.get("mensaje") || "").trim(),
        web: d.get("web") || "", // antispam: debe ir vacío
      };
    }

    function validar(datos) {
      let ok = true;
      if (!datos.nombre) { $("#campo-nombre").classList.add("campo--error"); ok = false; }
      if (!datos.asistencia) { $("#campo-asistencia").classList.add("campo--error"); ok = false; }
      if (!ok) {
        mostrarEstado(F.textos.faltanDatos, "error");
        (datos.nombre ? $('input[name="asistencia"]') : $("#nombre")).focus();
      }
      return ok;
    }

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
        [selectAcompanantes, selectAlergias].forEach((s) => s.classList.add("campo__vacio"));
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

    if (X.cuentaAtras && X.cuentaAtras.activo) {
      const el = $("#cuenta-atras");
      const dias = Math.ceil((new Date(C.boda.fechaISO) - new Date()) / 86400000);
      if (dias > 0) el.textContent = X.cuentaAtras.texto.replace("{dias}", dias);
      else if (dias === 0) el.textContent = X.cuentaAtras.textoHoy;
      el.hidden = dias < 0;
    }

    if (X.calendario && X.calendario.activo) {
      const boton = $("#boton-calendario");
      boton.textContent = X.calendario.texto;
      boton.hidden = false;
      boton.addEventListener("click", () => {
        const formato = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
        const ics = [
          "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion boda//ES", "BEGIN:VEVENT",
          `UID:boda-${formato(C.boda.fechaISO)}@invitacion`,
          `DTSTAMP:${formato(new Date().toISOString())}`,
          `DTSTART:${formato(C.boda.fechaISO)}`,
          `DTEND:${formato(X.calendario.fin)}`,
          `SUMMARY:${X.calendario.tituloEvento}`,
          `LOCATION:${X.calendario.lugar}`,
          "END:VEVENT", "END:VCALENDAR",
        ].join("\r\n");
        const enlace = crear("a", {
          href: URL.createObjectURL(new Blob([ics], { type: "text/calendar" })),
          download: "boda.ics",
        });
        enlace.click();
        URL.revokeObjectURL(enlace.href);
      });
    }

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

  /* ARRANQUE ============================================================== */
  rellenarSimples();
  rellenarSeparadores();
  rellenarDetalles();
  rellenarPrograma();
  rellenarAlojamiento();
  prepararFormulario();
  prepararExtras();
})();
