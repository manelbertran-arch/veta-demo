/* Veta demo · pantallas · semana.js · paquete C (Veta, cuenta y entrada)
   - A14 · Tu semana · #/semana
   La única pantalla con cifras para el agente. Sin horas hasta que la persona pone sus tiempos (H24). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  let ventana = '7d', ruedaHoras = false, primera = true;
  C.ruedaHoras = () => { ruedaHoras = true; };

  VETA.pantalla('A14', {
    titulo: 'Tu semana',
    guia: ['Aquí ves lo que hice por ti esta semana, en números.', 'Tú pones tus tiempos si quieres ver horas; Veta no las inventa.', 'Así sabes lo que ve dirección de ti, y lo que no ve.'],
    pinta: () => {
      const t = M.lee('tiempos', null), min = t ? M.minutosLaura(t) : 0;
      const s = C.semanaDe(), dir = VETA.yo().papel === 'direccion';
      const cab = `<p class="intro" data-i="0">Semana del 16 al 22 de noviembre.</p>` +
        `<div class="c-cifra" data-i="0">${UI.cifra({valor: s.preparados, unidad: 'mensajes que te dejé escritos', id: 'c-cifra-31'})}<p class="c-apoyo">Enviaste ${s.enviados} · retocaste ${s.retocados}</p>`;
      // dirección: solo lo suyo; lo del equipo está en Equipo › Semana
      if (dir) return cab + '</div>' +
        UI.bloque({titulo: 'Además', i: 1, html: UI.lista([{titulo: `${s.actas} nota de la visita guardada`, icono: 'doc'}, {titulo: `${s.promesas} promesas apuntadas`, icono: 'mano'}])}) +
        UI.bloque({titulo: 'Lo que ven los demás', i: 2, html: UI.nota({texto: 'En la semana del equipo salen tus cifras junto a las de cada persona. Nadie ve lo que escribes en tus chats.', icono: 'escudo', caja: true})}) +
        UI.lista([{titulo: 'La semana del equipo', sub: 'Cifras de toda la oficina', icono: 'equipo', ir: 'semana-equipo'}], {i: 3});
      return cab +
          (t ? `<p class="c-horas"><b id="c-horas">${esc(VETA.horas(min))}</b> esta semana · con tus tiempos ${C.ejemplo()}</p>` : '') + `</div>` +
        UI.bloque({titulo: 'Además', i: 1, html: UI.lista([{titulo: '3 notas de visita guardadas', icono: 'doc'}, {titulo: '4 promesas apuntadas', icono: 'mano'}])}) +
        // los ocho números de la oficina no van aquí: su número es el suyo (crítica 2.13)
        C.direccionVe(2) +
        UI.lista([
          {titulo: 'Tus tiempos', sub: t ? C.tiemposTexto(t) : 'sin poner', icono: 'reloj', hoja: 'h24'},
          {titulo: 'Antes y ahora', sub: 'de 46 cosas por semana a 21', icono: 'hoy', ir: 'antes-ahora'},
          {titulo: 'Lo que aún haces a mano', sub: '3 trabajos', icono: 'mano', hoja: 'c-mano'},
          {titulo: 'Semanas anteriores', icono: 'cal', hoja: 'h25'}
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
  C.tiemposTexto = t => VETA.datos.c.tiempos.map(x => `${t[x.id]} min`).join(', ').replace(/, ([^,]*)$/, ' y $1');
})();
