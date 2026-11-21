/* Veta demo · pantallas · antes-ahora.js · ronda 6 · paquete C (P2)
   A20 · #/antes-ahora · «Antes y ahora»: la lista de cuando empezamos al lado de la de hoy, la línea de seis
   semanas (de 46 a 21 cosas por semana), lo que ya es tuyo (lo que hago yo, lo aprendido, tus correcciones)
   y las horas «con tus tiempos · ejemplo». Cifras: VETA.datos.r6.veta.antesAhora y las que ya tenía la app. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;

  VETA.pantalla('A20', {
    titulo: 'Antes y ahora',
    guia: ['Aquí ves lo que te tocaba hacer cuando empezamos y lo que te toca ahora.', 'Tú decides cada cosa que paso a hacer yo.', 'Así ves que cada semana te toca menos.'],
    pinta: () => {
      const a = C.r6().antesAhora, s = a.semanas, res = M.resumenReglas(), hoy = VETA.r6.siempre();
      const t = M.lee('tiempos', null), min = M.minutosLaura(t || {mensajes: 4, actas: 12, avisos: 2});
      const menos = a.antes.valor - a.ahora.valor;
      return `<p class="intro" data-i="0">Cuando empezamos te tocaban <b>${a.antes.valor}</b> cosas por semana. La semana pasada, <b>${a.ahora.valor}</b>. Las otras ${menos} las hago yo.</p>` +
        `<div class="c-aa" data-i="1">${VETA.vivo.antesAhora({antes: a.antes, ahora: a.ahora, semanas: s, clave: 'c-aa',
          ejeAntes: `Cuando empezamos · ${s[0]}`, ejeAhora: `La semana pasada · ${s[s.length - 1]}`, voz: `De ${s[0]} a ${s[s.length - 1]} cosas por semana desde que empezamos, el 3 de septiembre`})}</div>` +
        UI.bloque({titulo: 'Lo que has decidido tú', texto: 'Empezamos el 3 de septiembre. Desde entonces:', i: 2, html: UI.lista([
          {titulo: `${C.yaHago ? C.yaHago() : res.activas} cosas que ya hago yo`, sub: 'Apuntar promesas, marcar quién contestó, avisarte de las firmas…', icono: 'check', ir: 'que-hace'},
          {titulo: `${C.aprendidoQueda() + (hoy ? 1 : 0)} cosas que he aprendido de ti`, sub: hoy ? 'La última, hoy: ' + hoy.regla : 'A Pere, por la tarde; a Marta, en sábado…', icono: 'aprende', ir: 'aprendido'},
          {titulo: '4 veces me corregiste', sub: 'Y esas cosas ya las hago como tú', icono: 'editar', ir: 'aprendido'}])}) +
        UI.bloque({titulo: 'El tiempo que te ahorro', i: 3, html:
          `<p class="c-aa-horas"><b>${VETA.vivo.cuenta({de: 0, a: min, formato: VETA.horas, clave: 'c-aa-h'})}</b><span>la semana pasada · con tus tiempos ${UI.etiqueta('ejemplo')}</span></p>` +
          UI.lista([{titulo: 'Tus tiempos', sub: t ? C.tiemposTexto(t) : 'De ejemplo: 4 min un mensaje, 12 una nota de la visita, 2 una promesa', icono: 'reloj', hoja: 'h24'}])}) +
        UI.bloque({titulo: 'Lo siguiente que puedo hacer yo', i: 4, html: UI.lista([
          {titulo: C.nombre('r-visitas'), sub: C.visitas().estado === 'propuesta' ? 'Esto lo has hecho 9 veces. ¿Lo hago yo?' : C.visitas().texto, icono: 'cal', ir: 'regla/r-visitas'},
          {titulo: 'Qué hace Veta', sub: 'Todo lo que hago, con ejemplos tuyos', icono: 'libro', ir: 'que-hace'}])});
    }
  });
  void esc;
})();
