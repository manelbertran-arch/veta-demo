/* Veta demo · ronda 8 · js/datos/r7-d1.js · carril D (Inicio de dirección y Equipo)
   VETA.d1: lo que comparten decidir.js (el Inicio de dirección), asunto.js y reparto.js.
   - pendientes(): las decisiones que esperan a dirección.
   - esperan(): todo lo que espera decisión, en orden. De aquí sale VETA.r7.cuentas().decidir (la frase de Inicio y el punto de la barra).
   - numeros(): repinta la barra tras decidir.
   Ronda 8: se fueron cara() y fila(), que daban un tono distinto a las iniciales de cada persona (pieza 11: siempre el mismo tono). */
(function () {
  'use strict';
  VETA.d1 = {
    pendientes: () => VETA.modelo.decisiones().filter(c => VETA.dir.pendiente(c)),
    // las decisiones y, detrás de Carmen, los otros contactos que no lleva nadie (Pau Ríos, Lucía Gómez)
    esperan: () => {
      const dec = VETA.d1.pendientes().sort((a, b) => a.orden - b.orden).map(c => ({tipo: 'decision', c}));
      const con = VETA.dir.sinDueno().filter(x => x.id !== 'carmen').map(x => ({tipo: 'contacto', x}));
      const i = dec.findIndex(d => d.c.id === 'd-carmen');
      dec.splice(i < 0 ? 0 : i + 1, 0, ...con);
      return dec;
    },
    // tras decidir: el punto de la barra se pone al día
    numeros: () => { if (VETA.pintaBarra) setTimeout(() => VETA.pintaBarra(), 30); }
  };
})();
