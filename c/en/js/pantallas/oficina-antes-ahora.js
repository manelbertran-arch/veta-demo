/* Veta demo · ronda 8 · pantallas · oficina-antes-ahora.js · carril D
   G16 · Antes y ahora (de la oficina) · #/oficina-antes-ahora — pantalla de resultado (PLAN_R8.md, 8.2): una cifra con su frase,
   dos barras (cuando empezamos y hoy) y una lista de filas de una línea. Cifras de ejemplo: lo dice el subtítulo.
   Datos: VETA.datos.r6.direccion.antesAhora. */
(function () {
  'use strict';
  const r7 = VETA.r7;
  VETA.pantalla('G16', {
    titulo: 'Before and now',
    sub: 'Example. Since 3 September, when we started.',
    pinta: () => {
      const a = VETA.datos.r6.direccion.antesAhora, n = VETA.datos.numeros, pi = a.primerInforme;
      return r7.cifra({valor: a.esperando.hoy, frase: `clients waiting for a reply. When we started, ${a.esperando.antes}.`, i: 0}) +
        r7.barras([{valor: a.esperando.antes, fecha: '3 Sep'}, {valor: a.esperando.hoy, fecha: 'Today'}], {etiqueta: 'Clients waiting for a reply', i: 1}) +
        r7.lista([
          {nombre: 'Still waiting since that day', dato: pi.siguen, ir: 'operaciones'},
          {nombre: 'Promises not yet kept', dato: `from ${a.promesas.antes} to ${a.promesas.hoy}`},
          {nombre: 'What we say and what happens', hoja: 'd-decimos'},
          {nombre: 'Things everyone does the same', dato: n.desde[7], ir: 'oficina/sabe'},
          {nombre: 'Times you corrected me', dato: n.desde[4]},
          {nombre: 'Things I got ready for you', dato: VETA.num(n.desde[1]), ir: 'semana-equipo'}], {i: 2});
    }
  });
})();
