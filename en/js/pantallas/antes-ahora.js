/* Veta demo · pantallas · antes-ahora.js · ronda 6 · paquete C (P2)
   A20 · #/antes-ahora · “Antes y ahora”: la lista de cuando empezamos al lado de la de hoy, la línea de seis
   semanas (de 46 a 21 cosas por semana), lo que ya es tuyo (lo que hago yo, lo aprendido, tus correcciones)
   y las horas “con tus tiempos · ejemplo”. Cifras: VETA.datos.r6.veta.antesAhora y las que ya tenía la app. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A20', {
    titulo: 'Before and now',
    guia: ['Here you see what you had to do when we started and what you have to do now.', 'You decide each thing I start doing.', 'This way you see that you have less to do each week.'],
    pinta: () => {
      const a = C.r6().antesAhora, s = a.semanas, res = M.resumenReglas(), hoy = VETA.r6.siempre();
      const t = M.lee('tiempos', null), min = M.minutosLaura(t || {mensajes: 4, actas: 12, avisos: 2});
      const menos = a.antes.valor - a.ahora.valor;
      return `<p class="intro" data-i="0">When we started you had <b>${a.antes.valor}</b> things to do per week. Last week, <b>${a.ahora.valor}</b>. I do the other ${menos}.</p>` +
        `<div class="c-aa" data-i="1">${VETA.vivo.antesAhora({antes: a.antes, ahora: a.ahora, semanas: s, clave: 'c-aa',
          ejeAntes: `When we started · ${s[0]}`, ejeAhora: `Last week · ${s[s.length - 1]}`, voz: `From ${s[0]} to ${s[s.length - 1]} things per week since we started, on 3 September`})}</div>` +
        UI.bloque({titulo: 'What you have decided', texto: 'We started on 3 September. Since then:', i: 2, html: UI.lista([
          {titulo: `${C.yaHago ? C.yaHago() : res.activas} things I already do`, sub: 'Noting down promises, marking who replied, alerting you about signings…', icono: 'check', ir: 'que-hace'},
          {titulo: `${C.aprendidoQueda() + (hoy ? 1 : 0)} things I've learned from you`, sub: hoy ? 'The last one, today: ' + hoy.regla : 'For Pere, in the afternoon; for Marta, on Saturday…', icono: 'aprende', ir: 'aprendido'},
          {titulo: 'You corrected me 4 times', sub: 'And I already do those things like you', icono: 'editar', ir: 'aprendido'}])}) +
        UI.bloque({titulo: 'The time I save you', i: 3, html:
          `<p class="c-aa-horas"><b>${VETA.vivo.cuenta({de: 0, a: min, formato: VETA.horas, clave: 'c-aa-h'})}</b><span>last week · with your times ${UI.etiqueta('ejemplo')}</span></p>` +
          UI.lista([{titulo: 'Your times', sub: t ? C.tiemposTexto(t) : 'Example: 4 min a message, 12 a viewing note, 2 a promise', icono: 'reloj', hoja: 'h24'}])}) +
        UI.bloque({titulo: 'What I can do next', i: 4, html: UI.lista([
          {titulo: C.nombre('r-visitas'), sub: C.visitas().estado === 'propuesta' ? 'You have done this 9 times. Shall I do it?' : C.visitas().texto, icono: 'cal', ir: 'regla/r-visitas'},
          {titulo: 'What Veta does', sub: 'All I do, with examples from you', icono: 'libro', ir: 'que-hace'}])});
    }
  });
  void esc;
})();
