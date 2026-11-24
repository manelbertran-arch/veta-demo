/* Veta demo · pantallas · antes-ahora.js · ronda 6 · paquete C (P2)
   A20 · #/antes-ahora · “Antes y ahora”: la lista de cuando empezamos al lado de la de hoy, la línea de seis
   semanas (de 46 a 21 cosas por semana), lo que ya es tuyo (lo que hago yo, lo aprendido, tus correcciones)
   y las horas “con tus tiempos · ejemplo”. Cifras: VETA.datos.r6.veta.antesAhora y las que ya tenía la app. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A20', {
    titulo: 'Before and now',
    frase: () => { const a = C.r6().antesAhora; return `Before, you had ${a.antes.valor} things to do each week. Now, ${a.ahora.valor}. I do the other ${a.antes.valor - a.ahora.valor}.`; },
    pinta: () => {
      const a = C.r6().antesAhora, s = a.semanas;
      const t = M.lee('tiempos', null), min = M.minutosLaura(t || {mensajes: 4, actas: 12, avisos: 2});
      // lo que ya hago, lo aprendido y lo que te propongo están en Veta: aquí, solo el antes y el ahora
      return `<div class="c-aa" data-i="0">${VETA.vivo.antesAhora({antes: Object.assign({}, a.antes, {filas: []}), ahora: Object.assign({}, a.ahora, {filas: []}), semanas: s, clave: 'c-aa',
          ejeAntes: ' ', ejeAhora: ' ', voz: `From ${s[0]} to ${s[s.length - 1]} things per week since we started, on 3 September`})}</div>` +
        VETA.r7.lista([
          {icono: 'check', oro: true, nombre: 'What changed', pasa: 'What you did and I do now', abre: `<p><b>Before:</b> ${esc((a.antes.filas || []).join('. '))}.</p><p><b>Now:</b> ${esc((a.ahora.filas || []).join('. '))}.</p>`},
          {icono: 'reloj', nombre: 'The time I save you', pasa: VETA.horas(min) + (t ? ' with your times' : ' with example times'), hoja: 'h24'},
          {icono: 'editar', nombre: 'You corrected me 4 times', pasa: 'Now I do it like you', ir: 'aprendido'},
          // ronda 7 · arreglos (FC, defecto 5): “Tu semana” ya no es fila de Veta: es el “ahora” de esta pantalla
          {icono: 'cal', nombre: 'Your week', pasa: (n => n ? `I closed ${n === 1 ? '1 thing' : n + ' things'} on my own` : `I left ${C.semanaDe().preparados} messages written for you`)(C.cerradas().length), ir: 'semana'}
        ], {i: 1, clase: 'r7c-tras'});
    }
  });
})();
