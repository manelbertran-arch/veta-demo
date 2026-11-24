/* Veta demo · pantallas · oficina-antes-ahora.js · ronda 6 · paquete D (P3)
   G16 · #/oficina-antes-ahora · «Antes y ahora de la oficina»: el primer informe (3 oct) frente a hoy, qué pasó con los
   clientes de aquel informe, lo que decimos y lo que pasa (la mitad de las respuestas, de la oficina entera) y lo que ya es vuestro.
   Cifras de ejemplo, rotuladas «Ejemplo». Datos: VETA.datos.r6.direccion.antesAhora. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  // ronda 7 · D2: una cifra que se compara (antes / hoy) y una lista; sin títulos de sección (R2)
  VETA.pantalla('G16', {
    titulo: 'Antes y ahora',
    frase: 'Cómo estaba la oficina el 3 de septiembre, cuando empezamos, y cómo está hoy.',
    pinta: () => {
      const a = VETA.datos.r6.direccion.antesAhora, n = VETA.datos.numeros, pi = a.primerInforme;
      let h = `<div class="d2-antes" data-i="0">${VETA.r7.pastilla('Ejemplo', 'gris')}${VETA.vivo.antesAhora({
        antes: {rotulo: 'Cuando empezamos', valor: a.esperando.antes, unidad: 'esperaban respuesta', filas: [a.promesas.antes + ' promesas sin hacer todavía']},
        ahora: {rotulo: 'Hoy', valor: a.esperando.hoy, unidad: 'esperan respuesta', filas: [a.promesas.hoy + ' promesas sin hacer todavía']},
        semanas: a.esperando.semanas})}</div>`;
      h += VETA.r7.lista([
        {icono: 'reloj', nombre: `Los ${pi.total} que esperaban aquel día`, pasa: `${pi.siguen} siguen esperando. Míralos`, ir: 'operaciones'},
        {icono: 'chat', nombre: 'Lo que decimos y lo que pasa', pasa: `La mitad, en menos de ${a.pasa.mitad}`,
          abre: `<p>Lo que decimos: <b>${esc(a.decimos)}</b></p><p>Lo que pasa: <b>la mitad de las veces, en menos de ${esc(a.pasa.mitad)}. Los viernes, ${esc(a.pasa.viernes)}.</b></p><p>Cuento toda la oficina junta, desde que el cliente escribe hasta que alguien contesta.</p>`},
        {icono: 'aprende', oro: true, nombre: `${n.desde[7]} cosas iguales para todos`, pasa: 'Las decidiste tú, una a una', ir: 'oficina/sabe'},
        {icono: 'editar', nombre: `Me corregisteis ${n.desde[4]} veces`, pasa: 'Desde que empezamos. Cada vez aprendo'},
        {icono: 'check', oro: true, nombre: `${VETA.num(n.desde[1])} cosas que os dejé listas`, pasa: 'Desde que empezamos', ir: 'semana-equipo'}], {i: 1});
      return h;
    }
  });
})();
