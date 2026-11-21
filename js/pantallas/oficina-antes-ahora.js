/* Veta demo · pantallas · oficina-antes-ahora.js · ronda 6 · paquete D (P3)
   G16 · #/oficina-antes-ahora · «Antes y ahora de la oficina»: el primer informe (3 oct) frente a hoy, qué pasó con los
   clientes de aquel informe, lo que decimos y lo que pasa (la mitad de las respuestas, de la oficina entera) y lo que ya es vuestro.
   Cifras de ejemplo, rotuladas «Ejemplo». Datos: VETA.datos.r6.direccion.antesAhora. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  VETA.pantalla('G16', {
    guia: ['Aquí ves cómo estaba la oficina el primer día y cómo está hoy.', 'Tú comparas el primer informe con lo de ahora.', 'Así ves lo que ha cambiado desde que llegó Veta.'],
    pinta: () => {
      const a = VETA.datos.r6.direccion.antesAhora, n = VETA.datos.numeros, pi = a.primerInforme;
      let h = `<p class="d-ops-intro" data-i="0">El primer informe fue <b>cuando empezamos</b>, el 3 de septiembre. Así estaba la oficina aquel día, y así está hoy.</p><p data-i="0">${UI.etiqueta('ejemplo')}</p>`;
      h += UI.bloque({titulo: 'Clientes esperando respuesta', i: 1, html: VETA.vivo.antesAhora({
        antes: {rotulo: 'Cuando empezamos', valor: a.esperando.antes, unidad: 'esperaban respuesta', filas: [a.promesas.antes + ' promesas sin hacer todavía']},
        ahora: {rotulo: 'Hoy', valor: a.esperando.hoy, unidad: 'esperan respuesta', filas: [a.promesas.hoy + ' promesas sin hacer todavía']},
        semanas: a.esperando.semanas})});
      h += UI.bloque({titulo: `Los ${pi.total} del primer informe`, texto: 'Qué ha pasado con los clientes que esperaban aquel día.', i: 2, html:
        `<div class="d-tres"><p class="d-tres-c"><b>${pi.retomados}</b><span>volvisteis a hablar con ellos</span></p>` +
        `<p class="d-tres-c"><b>${pi.cerrados}</b><span>ya están cerrados</span></p><p class="d-tres-c"><b>${pi.siguen}</b><span>siguen esperando</span></p></div>` +
        UI.boton({tipo: 'texto', texto: 'Verlos en Operaciones', ir: 'operaciones', ancho: false})});
      h += UI.bloque({titulo: 'Lo que decimos y lo que pasa', i: 3, html: `<div class="d-dice">` +
        `<p><span class="d-dice-r">Lo que decimos</span><b>${esc(a.decimos)}</b></p>` +
        `<p><span class="d-dice-r">Lo que pasa</span><b>La mitad de las veces, en menos de ${esc(a.pasa.mitad)}. Los viernes, ${esc(a.pasa.viernes)}.</b></p></div>` +
        `<p class="d-per-pie">Cuento toda la oficina junta, desde que el cliente escribe hasta que alguien contesta.</p>`});
      h += UI.bloque({titulo: 'Lo que ya es vuestro', i: 4, html: UI.lista([
        {titulo: `${n.desde[7]} cosas que hago igual para toda la oficina`, sub: 'Las decidiste tú, una a una', icono: 'aprende', ir: 'oficina/sabe'},
        {titulo: `${n.desde[4]} veces que me habéis corregido`, sub: 'Desde que empezamos. Cada una me enseña algo', icono: 'editar'},
        {titulo: `${VETA.num(n.desde[1])} cosas que os he dejado listas`, sub: 'Desde que empezamos', icono: 'check', ir: 'semana-equipo'}])});
      return h;
    }
  });
})();
