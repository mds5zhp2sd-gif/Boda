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
    // Copiar la ilustración en las 4 solapas
    const lamina = $("#sobre-lamina");
    $$(".solapa__cara", sobre).forEach((cara) => cara.append(lamina.content.cloneNode(true)));
    // Cintas en diagonal de esquina a esquina
    const medir = () => {
      const w = innerWidth, h = innerHeight;
      sobre.style.setProperty("--ang", `${Math.atan2(h, w) * 180 / Math.PI}deg`);
      sobre.style.setProperty("--diag", `${Math.hypot(w, h) + 60}px`);
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
      // sello → lazada → cintas → solapas laterales → arriba/abajo → fundido
      const pasos = [["paso1", 0], ["paso2", 280], ["paso3", 950], ["paso4", 1700], ["paso5", 2150], ["paso6", 3500]];
      pasos.forEach(([clase, ms]) => setTimeout(() => sobre.classList.add(clase), ms));
      setTimeout(cerrar, 4200);
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
