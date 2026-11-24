/* Veta demo · ronda 8 · pantallas · oficina-antes-ahora.js · carril D
   G16 · Antes y ahora (de la oficina) · #/oficina-antes-ahora — pantalla de resultado (PLAN_R8.md, 8.2): una cifra con su frase,
   dos barras (cuando empezamos y hoy) y una lista de filas de una línea. Cifras de ejemplo: lo dice el subtítulo.
   Datos: VETA.datos.r6.direccion.antesAhora. */
(function () {
  'use strict';
  const r7 = VETA.r7;
  VETA.pantalla('G16', {
    titulo: 'Antes y ahora',
    sub: 'Ejemplo. Desde el 3 de septiembre, cuando empezamos.',
    pinta: () => {
      const a = VETA.datos.r6.direccion.antesAhora, n = VETA.datos.numeros, pi = a.primerInforme;
      return r7.cifra({valor: a.esperando.hoy, frase: `clientes esperan respuesta. Cuando empezamos, ${a.esperando.antes}.`, i: 0}) +
        r7.barras([{valor: a.esperando.antes, fecha: '3 sep'}, {valor: a.esperando.hoy, fecha: 'Hoy'}], {etiqueta: 'Clientes que esperan respuesta', i: 1}) +
        r7.lista([
          {nombre: 'Aún esperan desde aquel día', dato: pi.siguen, ir: 'operaciones'},
          {nombre: 'Promesas sin hacer', dato: `de ${a.promesas.antes} a ${a.promesas.hoy}`},
          {nombre: 'Lo que decimos y lo que pasa', hoja: 'd-decimos'},
          {nombre: 'Cosas iguales para todos', dato: n.desde[7], ir: 'oficina/sabe'},
          {nombre: 'Veces que me corregisteis', dato: n.desde[4]},
          {nombre: 'Cosas que os dejé listas', dato: VETA.num(n.desde[1]), ir: 'semana-equipo'}], {i: 2});
    }
  });
})();
