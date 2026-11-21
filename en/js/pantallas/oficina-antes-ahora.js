/* Veta demo · pantallas · oficina-antes-ahora.js · ronda 6 · paquete D (P3)
   G16 · #/oficina-antes-ahora · “Antes y ahora de la oficina”: el primer informe (3 oct) frente a hoy, qué pasó con los
   clientes de aquel informe, lo que decimos y lo que pasa (la mitad de las respuestas, de la oficina entera) y lo que ya es vuestro.
   Cifras de ejemplo, rotuladas “Ejemplo”. Datos: VETA.datos.r6.direccion.antesAhora. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  VETA.pantalla('G16', {
    guia: ['Here you see how the office was on the first day and how it is today.', 'You compare the first report with how things are now.', 'This way you see what has changed since Veta arrived.'],
    pinta: () => {
      const a = VETA.datos.r6.direccion.antesAhora, n = VETA.datos.numeros, pi = a.primerInforme;
      let h = `<p class="d-ops-intro" data-i="0">The first report was <b>when we started</b>, on 3 September. This is how the office was that day, and how it is today.</p><p data-i="0">${UI.etiqueta('ejemplo')}</p>`;
      h += UI.bloque({titulo: 'Clients waiting for a reply', i: 1, html: VETA.vivo.antesAhora({
        antes: {rotulo: 'When we started', valor: a.esperando.antes, unidad: 'were waiting for a reply', filas: [a.promesas.antes + ' promises not kept yet']},
        ahora: {rotulo: 'Today', valor: a.esperando.hoy, unidad: 'are waiting for a reply', filas: [a.promesas.hoy + ' promises not kept yet']},
        semanas: a.esperando.semanas})});
      h += UI.bloque({titulo: `The ${pi.total} from the first report`, texto: 'What has happened to the clients who were waiting that day.', i: 2, html:
        `<div class="d-tres"><p class="d-tres-c"><b>${pi.retomados}</b><span>you spoke to them again</span></p>` +
        `<p class="d-tres-c"><b>${pi.cerrados}</b><span>are already closed</span></p><p class="d-tres-c"><b>${pi.siguen}</b><span>are still waiting</span></p></div>` +
        UI.boton({tipo: 'texto', texto: 'See them in Deals', ir: 'operaciones', ancho: false})});
      h += UI.bloque({titulo: 'What we say and what happens', i: 3, html: `<div class="d-dice">` +
        `<p><span class="d-dice-r">What we say</span><b>${esc(a.decimos)}</b></p>` +
        `<p><span class="d-dice-r">What happens</span><b>Half of the time, in under ${esc(a.pasa.mitad)}. On Fridays, ${esc(a.pasa.viernes)}.</b></p></div>` +
        `<p class="d-per-pie">I count the whole office together, from when the client writes until someone replies.</p>`});
      h += UI.bloque({titulo: 'What is already yours', i: 4, html: UI.lista([
        {titulo: `${n.desde[7]} things I do the same way for the whole office`, sub: 'You decided them, one by one', icono: 'aprende', ir: 'oficina/sabe'},
        {titulo: `${n.desde[4]} times you have corrected me`, sub: 'Since we started. Each one teaches me something', icono: 'editar'},
        {titulo: `${VETA.num(n.desde[1])} things I have got ready for you`, sub: 'Since we started', icono: 'check', ir: 'semana-equipo'}])});
      return h;
    }
  });
})();
