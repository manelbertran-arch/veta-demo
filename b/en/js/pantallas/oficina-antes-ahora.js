/* Veta demo · pantallas · oficina-antes-ahora.js · ronda 6 · paquete D (P3)
   G16 · #/oficina-antes-ahora · “Antes y ahora de la oficina”: el primer informe (3 oct) frente a hoy, qué pasó con los
   clientes de aquel informe, lo que decimos y lo que pasa (la mitad de las respuestas, de la oficina entera) y lo que ya es vuestro.
   Cifras de ejemplo, rotuladas “Ejemplo”. Datos: VETA.datos.r6.direccion.antesAhora. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  // ronda 7 · D2: una cifra que se compara (antes / hoy) y una lista; sin títulos de sección (R2)
  VETA.pantalla('G16', {
    titulo: 'Before and now',
    frase: 'How the office was on 3 September, when we started, and how it is today.',
    pinta: () => {
      const a = VETA.datos.r6.direccion.antesAhora, n = VETA.datos.numeros, pi = a.primerInforme;
      let h = `<div class="d2-antes" data-i="0">${VETA.r7.pastilla('Example', 'gris')}${VETA.vivo.antesAhora({
        antes: {rotulo: 'When we started', valor: a.esperando.antes, unidad: 'were waiting for a reply', filas: [a.promesas.antes + ' promises not kept yet']},
        ahora: {rotulo: 'Today', valor: a.esperando.hoy, unidad: 'are waiting for a reply', filas: [a.promesas.hoy + ' promises not kept yet']},
        semanas: a.esperando.semanas})}</div>`;
      h += VETA.r7.lista([
        {icono: 'reloj', nombre: `The ${pi.total} who were waiting that day`, pasa: `${pi.siguen} are still waiting. See them`, ir: 'operaciones'},
        {icono: 'chat', nombre: 'What we say and what happens', pasa: `Half of them, in under ${a.pasa.mitad}`,
          abre: `<p>What we say: <b>${esc(a.decimos)}</b></p><p>What happens: <b>half of the time, in under ${esc(a.pasa.mitad)}. On Fridays, ${esc(a.pasa.viernes)}.</b></p><p>I count the whole office together, from when the client writes until someone replies.</p>`},
        {icono: 'aprende', oro: true, nombre: `${n.desde[7]} things the same for everyone`, pasa: 'You decided them, one by one', ir: 'oficina/sabe'},
        {icono: 'editar', nombre: `You all corrected me ${n.desde[4]} times`, pasa: 'Since we started. Each time I learn'},
        {icono: 'check', oro: true, nombre: `${VETA.num(n.desde[1])} things I left ready for you`, pasa: 'Since we started', ir: 'semana-equipo'}], {i: 1});
      return h;
    }
  });
})();
