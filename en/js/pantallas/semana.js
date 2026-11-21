/* Veta demo · pantallas · semana.js · paquete C (Veta, cuenta y entrada)
   - A14 · Tu semana · #/semana
   La única pantalla con cifras para el agente. Sin horas hasta que la persona pone sus tiempos (H24). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  let ventana = '7d', ruedaHoras = false, primera = true;
  C.ruedaHoras = () => { ruedaHoras = true; };

  VETA.pantalla('A14', {
    titulo: 'Your week',
    guia: ['Here you see what I did for you last week, in numbers.', 'You enter your times if you want to see hours; Veta doesn\'t make them up.', 'This way you know what management sees about you, and what it does not.'],
    pinta: () => {
      const t = M.lee('tiempos', null), min = t ? M.minutosLaura(t) : 0;
      const s = C.semanaDe(), dir = VETA.yo().papel === 'direccion';
      const cab = `<p class="intro" data-i="0">Week of 16 to 22 November.</p>` +
        `<div class="c-cifra" data-i="0">${UI.cifra({valor: s.preparados, unidad: 'messages I wrote for you', id: 'c-cifra-31'})}<p class="c-apoyo">You sent ${s.enviados} · you tweaked ${s.retocados}</p>`;
      // dirección: solo lo suyo; lo del equipo está en Equipo › Semana
      if (dir) return cab + '</div>' +
        UI.bloque({titulo: 'Also', i: 1, html: UI.lista([{titulo: `Viewing notes saved: ${s.actas}`, icono: 'doc'}, {titulo: `${s.promesas} promises noted`, icono: 'mano'}])}) +
        UI.bloque({titulo: 'What others see', i: 2, html: UI.nota({texto: 'In the team\'s week, your numbers appear next to each person\'s. Nobody sees what you write in your chats.', icono: 'escudo', caja: true})}) +
        UI.lista([{titulo: 'The team\'s week', sub: 'Figures for the whole office', icono: 'equipo', ir: 'semana-equipo'}], {i: 3});
      return cab +
          (t ? `<p class="c-horas"><b id="c-horas">${esc(VETA.horas(min))}</b> last week · with your times ${C.ejemplo()}</p>` : '') + `</div>` +
        UI.bloque({titulo: 'Also', i: 1, html: UI.lista([{titulo: '3 viewing notes saved', icono: 'doc'}, {titulo: '4 promises noted', icono: 'mano'}])}) +
        // los ocho números de la oficina no van aquí: su número es el suyo (crítica 2.13)
        C.direccionVe(2) +
        UI.lista([
          {titulo: 'Your times', sub: t ? C.tiemposTexto(t) : 'not set', icono: 'reloj', hoja: 'h24'},
          {titulo: 'Before and now', sub: 'from 46 things per week to 21', icono: 'hoy', ir: 'antes-ahora'},
          {titulo: 'What you still do by hand', sub: '3 tasks', icono: 'mano', hoja: 'c-mano'},
          {titulo: 'Previous weeks', icono: 'cal', hoja: 'h25'}
        ], {i: 4});
    },
    alMontar: el => {
      // la cifra grande rueda al entrar la primera vez; las horas, al guardar los tiempos
      const c = el.querySelector('#c-cifra-31');
      if (c && primera) { primera = false; c.dataset.rueda = '0'; c.textContent = '0'; setTimeout(() => VETA.rueda(c, C.semanaDe().preparados), 160); }
      const h = el.querySelector('#c-horas');
      if (h && ruedaHoras) {
        ruedaHoras = false; const t = M.lee('tiempos', null);
        h.dataset.rueda = '0 h 00 min'; setTimeout(() => VETA.rueda(h, M.minutosLaura(t), {formato: VETA.horas}), 120);
      }
    },
    acciones: {
      ventana(ev, el) {
        ventana = el.dataset.valor;
        const v = VETA.datos.numeros[ventana];
        VETA.$$('.pant-A14 [data-n8]').forEach(x => { if (x.dataset.rueda == null) x.dataset.rueda = x.textContent.trim(); VETA.rueda(x, v[Number(x.dataset.n8)]); });
      }
    }
  });
  C.tiemposTexto = t => VETA.datos.c.tiempos.map(x => `${t[x.id]} min`).join(', ').replace(/, ([^,]*)$/, ' and $1');
})();
