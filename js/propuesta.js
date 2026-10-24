/* ==========================================================================
   PROPUESTA: sobre de apertura, calendario del mes y animaciones al bajar
   ========================================================================== */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sobre de apertura ---------- */
  const sobre = $("#sobre");
  if (sobre) {
    document.body.classList.add("con-sobre");
    // Lienzo 1:2: se ve siempre entero (en móviles anchos quedan bandas azules a los lados)
    const lienzo = $(".sobre__lienzo", sobre);
    const medir = () => {
      const w = innerWidth, h = innerHeight;
      const ancho = w / h < 0.75 ? Math.min(w, h / 2) : Math.min(w, h / 2) * 0.96;  // siempre entero: la ilustración de abajo no se corta
      lienzo.style.setProperty("--lienzo-w", `${ancho}px`);
    };
    medir();
    addEventListener("resize", medir);
    const cerrar = () => {
      sobre.remove();
      document.body.classList.remove("con-sobre");
      window.scrollTo(0, 0);
      $("#portada-titulo").setAttribute("tabindex", "-1");
      $("#portada-titulo").focus({ preventScroll: true });
    };
    const abrir = () => {
      if (sobre.dataset.abriendo) return;
      sobre.dataset.abriendo = "si";
      if (sinMovimiento) return cerrar();
      // sello → se deshace el nudo → se retira el cordel → solapas → la tarjeta se acerca → fundido
      const pasos = [["paso1", 0], ["paso2", 500], ["pasoC", 2850], ["paso3", 4000], ["paso4", 5200], ["paso5", 6300], ["paso6", 7700], ["paso7", 9000]];
      pasos.forEach(([clase, ms]) => setTimeout(() => sobre.classList.add(clase), ms));
      setTimeout(cerrar, 9800);
    };
    $("#sobre-sello").addEventListener("click", abrir);
    $("#sobre-saltar").addEventListener("click", cerrar);
  }

  /* ---------- Calendario de agosto 2027 con el 28 marcado ---------- */
  const rejilla = $("#calendario-rejilla");
  if (rejilla) {
    ["L", "M", "X", "J", "V", "S", "D"].forEach((d) => rejilla.insertAdjacentHTML("beforeend", `<span class="cab">${d}</span>`));
    const primero = new Date(2027, 7, 1).getDay(); // 0 = domingo
    const hueco = (primero + 6) % 7;
    for (let i = 0; i < hueco; i++) rejilla.insertAdjacentHTML("beforeend", "<span></span>");
    for (let d = 1; d <= 31; d++) {
      rejilla.insertAdjacentHTML("beforeend", d === 28
        ? `<span class="dia-boda" aria-label="28 de agosto, día de la boda">${d}</span>`
        : `<span>${d}</span>`);
    }
  }

  /* ---------- Aparecer al bajar ---------- */
  if (sinMovimiento || !("IntersectionObserver" in window)) {
    $$(".cierre__firma").forEach((el) => el.classList.add("visible"));
    return;
  }
  const grupos = [
    ".titulo-seccion", ".versalitas", ".fecha-grande", ".frase-serif", ".calendario-mes", "#guarda-fecha .cuenta-atras",
    ".detalle", ".evento", ".programa__decoracion", ".alojamiento__cuerpo", "#alojamiento-boton",
    ".confirmacion__nota", "#formulario-confirmacion", ".cierre__ilustracion", ".pie__firma",
  ];
  // Esperar a que app.js haya montado detalles y programa
  requestAnimationFrame(() => {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        observador.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    grupos.forEach((sel) => {
      $$(sel).forEach((el, i) => {
        if (el.closest("#portada")) return;
        el.classList.add("revelar");
        // escalonar elementos hermanos (columnas de detalles, horas del programa)
        if (sel === ".detalle" || sel === ".evento") el.style.setProperty("--i", i);
        observador.observe(el);
      });
    });
    $$(".cierre__firma").forEach((el) => observador.observe(el));
  });
})();
