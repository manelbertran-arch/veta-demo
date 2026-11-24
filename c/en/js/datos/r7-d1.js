/* Veta demo · ronda 7 · js/datos/r7-d1.js · D1 (Decidir y Equipo)
   VETA.d1: lo que comparten decidir.js, asunto.js, equipo.js y persona.js.
   - cara(id, tam): la cara de una persona del equipo. Solo Laura tiene foto; las demás llevan sus iniciales en un círculo
     de tono suave distinto por persona (css/r7-d1.css, .d1-t-<id>). Nunca la cara de un cliente.
   - fila(o): VETA.r7.fila con ese mismo tono en la cara (si o.cara es del equipo).
   - pendientes(): las decisiones que esperan a dirección (la misma cuenta que VETA.r7.cuentas().decidir). */
(function () {
  'use strict';
  const EQUIPO = ['laura', 'montse', 'anna', 'teresa', 'marc', 'david'];
  const tono = (html, id) => EQUIPO.includes(id) ? html.replace('class="av ', `class="av d1-t-${id} `) : html;
  VETA.d1 = {
    EQUIPO,
    cara: (id, tam, o) => tono(VETA.av(id, tam || 40, o), id),
    fila: o => tono(VETA.r7.fila(o), o.cara),
    pendientes: () => VETA.modelo.decisiones().filter(c => VETA.dir.pendiente(c)),
    // arreglo FD (defecto 8): todo lo que espera decisión. Las decisiones y, detrás de Carmen, los otros contactos que no lleva nadie
    // (Pau Ríos, Lucía Gómez: en Operaciones dicen “Nadie la lleva”). De aquí sale VETA.r7.cuentas().decidir.
    esperan: () => {
      const dec = VETA.d1.pendientes().sort((a, b) => a.orden - b.orden).map(c => ({tipo: 'decision', c}));
      const con = VETA.dir.sinDueno().filter(x => x.id !== 'carmen').map(x => ({tipo: 'contacto', x}));
      const i = dec.findIndex(d => d.c.id === 'd-carmen');
      dec.splice(i < 0 ? 0 : i + 1, 0, ...con);
      return dec;
    },
    // tras decidir: el número nuevo en la caja de Inicio y en la barra (R9)
    numeros: () => { if (VETA.pintaBarra) setTimeout(() => VETA.pintaBarra(), 30); }
  };
})();
