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
    frase: () => (VETA.yo().papel === 'direccion' ? 'What I did for you last week.' : 'What I did for you this week. Tap a row to see more.'),
    pinta: () => {
      const t = M.lee('tiempos', null), min = t ? M.minutosLaura(t) : 0;
      const s = C.semanaDe(), dir = VETA.yo().papel === 'direccion', R = VETA.r7;
      const cifras = [
        {icono: 'chat', oro: true, nombre: 'Messages I wrote for you', pasa: `You sent ${s.enviados} · you tweaked ${s.retocados}`, numero: s.preparados},
        {icono: 'doc', oro: true, nombre: s.actas === 1 ? 'Viewing notes saved' : 'Viewing notes saved', numero: s.actas},
        {icono: 'mano', oro: true, nombre: 'Promises noted', numero: s.promesas}];
      // dirección: solo lo suyo; lo del equipo está en Veta de la oficina
      if (dir) return R.lista(cifras.concat([
        {icono: 'escudo', nombre: 'What others see', pasa: 'Your numbers, not your chats', abre: '<p>In the team\'s week, your numbers appear next to each person\'s. Nobody sees what you write in your chats.</p>'},
        {icono: 'equipo', nombre: 'The team\'s week', pasa: 'Figures for the whole office', ir: 'semana-equipo'}]), {i: 0});
      // lo que cerré sola desde ayer (sale de Te toca a ti): se puede abrir otra vez
      const cerr = C.cerradas().map(x => ({cara: x.cliente || null, icono: x.icono || 'check', oro: true, nombre: x.titulo, pasa: 'I closed it · ' + x.texto.replace(/^Lo cerré /, '').replace(/\.$/, ''),
        abre: `<p>I took it as done without asking you.</p><button type="button" class="r7c-caso" data-accion="reabre" data-de="${esc(x.id)}"><span><b>Open it again</b> · your turn</span>${VETA.ic('chev', 16)}</button>`}));
      return R.lista(cerr.concat(cifras, [
        t ? {icono: 'reloj', nombre: 'Time I saved you', pasa: 'With your times · example', numero: VETA.horas(min), hoja: 'h24'}
          : {icono: 'reloj', nombre: 'Your times', pasa: 'Enter them and I tell you the hours', hoja: 'h24'},
        {icono: 'mano', nombre: 'What you still do by hand', pasa: '3 tasks', hoja: 'c-mano'},
        {icono: 'cal', nombre: 'Previous weeks', pasa: 'The earlier ones, one by one', hoja: 'h25'}]), {i: 0});
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
      // abrir otra vez lo que cerré: misma clave que Te toca a ti (a.r6.abiertas)
      reabre(ev, el) {
        const ab = VETA.est.lee('a.r6.abiertas', []) || []; if (!ab.includes(el.dataset.de)) ab.push(el.dataset.de);
        VETA.est.pon('a.r6.abiertas', ab); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('OK. It is in Your turn.');
      },
      ventana(ev, el) {
        ventana = el.dataset.valor;
        const v = VETA.datos.numeros[ventana];
        VETA.$$('.pant-A14 [data-n8]').forEach(x => { if (x.dataset.rueda == null) x.dataset.rueda = x.textContent.trim(); VETA.rueda(x, v[Number(x.dataset.n8)]); });
      }
    }
  });
  C.tiemposTexto = t => VETA.datos.c.tiempos.map(x => `${t[x.id]} min`).join(', ').replace(/, ([^,]*)$/, ' and $1');
})();
