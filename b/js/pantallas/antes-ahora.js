/* Veta demo · pantallas · antes-ahora.js · ronda 6 · paquete C (P2)
   A20 · #/antes-ahora · «Antes y ahora»: la lista de cuando empezamos al lado de la de hoy, la línea de seis
   semanas (de 46 a 21 cosas por semana), lo que ya es tuyo (lo que hago yo, lo aprendido, tus correcciones)
   y las horas «con tus tiempos · ejemplo». Cifras: VETA.datos.r6.veta.antesAhora y las que ya tenía la app. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A20', {
    titulo: 'Antes y ahora',
    frase: () => { const a = C.r6().antesAhora; return `Antes te tocaban ${a.antes.valor} cosas por semana. Ahora, ${a.ahora.valor}. Las otras ${a.antes.valor - a.ahora.valor} las hago yo.`; },
    pinta: () => {
      const a = C.r6().antesAhora, s = a.semanas;
      const t = M.lee('tiempos', null), min = M.minutosLaura(t || {mensajes: 4, actas: 12, avisos: 2});
      // lo que ya hago, lo aprendido y lo que te propongo están en Veta: aquí, solo el antes y el ahora
      return `<div class="c-aa" data-i="0">${VETA.vivo.antesAhora({antes: Object.assign({}, a.antes, {filas: []}), ahora: Object.assign({}, a.ahora, {filas: []}), semanas: s, clave: 'c-aa',
          ejeAntes: ' ', ejeAhora: ' ', voz: `De ${s[0]} a ${s[s.length - 1]} cosas por semana desde que empezamos, el 3 de septiembre`})}</div>` +
        VETA.r7.lista([
          {icono: 'check', oro: true, nombre: 'Qué ha cambiado', pasa: 'Lo que hacías tú y ahora hago yo', abre: `<p><b>Antes:</b> ${esc((a.antes.filas || []).join('. '))}.</p><p><b>Ahora:</b> ${esc((a.ahora.filas || []).join('. '))}.</p>`},
          {icono: 'reloj', nombre: 'El tiempo que te ahorro', pasa: VETA.horas(min) + (t ? ' con tus tiempos' : ' con tiempos de ejemplo'), hoja: 'h24'},
          {icono: 'editar', nombre: 'Me corregiste 4 veces', pasa: 'Ahora lo hago como tú', ir: 'aprendido'},
          // ronda 7 · arreglos (FC, defecto 5): «Tu semana» ya no es fila de Veta: es el «ahora» de esta pantalla
          {icono: 'cal', nombre: 'Tu semana', pasa: (n => n ? `Cerré ${n === 1 ? '1 cosa' : n + ' cosas'} sola` : `Te dejé ${C.semanaDe().preparados} mensajes escritos`)(C.cerradas().length), ir: 'semana'}
        ], {i: 1, clase: 'r7c-tras'});
    }
  });
})();
