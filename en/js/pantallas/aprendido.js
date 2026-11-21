/* Veta demo · pantallas · aprendido.js · paquete C (Veta, cuenta y entrada)
   - A13 · Lo que he aprendido · #/aprendido
   - A13b · Proponer una mejora · #/mejora */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c;

  // ---- A13 · Lo que he aprendido ----
  VETA.pantalla('A13', {
    titulo: 'What I\'ve learned',
    guia: ['Here you see what Veta has learned from your chats, with where it got it from.', 'You tell it to forget it if it\'s not right.', 'That way you can always see and remove what it knows about you.'],
    pinta: () => {
      const olv = C.lee('olvidados', []), queda = C.aprendidoQueda();
      const items = D().aprendido.map(a => olv.includes(a.id)
        ? UI.lineaHecho({texto: 'Forgotten: ' + a.corto, boton: {texto: 'Undo', accion: 'recordar'}, de: a.id, vt: 'c-apr-' + a.id})
        : `<div class="c-aprendi" data-vt="c-apr-${esc(a.id)}"><div class="c-aprendi-c"><p class="c-aprendi-t">${esc(a.texto)}</p><p class="c-aprendi-o">${esc(a.origen)}</p></div>` +
          UI.boton({tipo: 'texto', texto: 'Forget', accion: 'olvidar', de: a.id, ancho: false, g: 'Forget|Veta stops using it. You can undo it.'}) + '</div>').join('');
      return UI.bloque({titulo: queda ? `This week · ${queda} ${queda === 1 ? 'new thing' : 'new things'}` : 'This week', i: 0,
          html: (queda ? '' : UI.vacio({titulo: 'I haven\'t learned anything new from your chats yet.', icono: 'aprende'})) + `<div class="c-aprendidos">${items}</div>`}) +
        UI.bloque({titulo: 'How I\'m doing', i: 1, html: UI.lista([
          {titulo: '4 of your corrections applied', icono: 'check'},
          {titulo: 'You tweaked 6 of 31 messages before sending', icono: 'editar'},
          {titulo: '1 instruction I couldn\'t turn into a rule', icono: 'orden', ir: 'entendido/no-entendida'}])}) +
        UI.bloque({titulo: 'From your office', i: 2, html: `<ul class="c-dice">${D().oficinaDice.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` + UI.lista([
          {titulo: 'How we work', icono: 'libro', ir: 'oficina/practicas'},
          {titulo: 'What your office knows', icono: 'ojo', ir: 'oficina/sabe'},
          {titulo: 'Propose an improvement', icono: 'estrella', ir: 'mejora'}])});
    },
    acciones: {
      olvidar(ev, el) { C.pon('olvidados', C.lee('olvidados', []).concat(el.dataset.de)); VETA.repinta({hecho: 'c-apr-' + el.dataset.de}); },
      recordar(ev, el) { C.pon('olvidados', C.lee('olvidados', []).filter(x => x !== el.dataset.de)); VETA.repinta({hecho: 'c-apr-' + el.dataset.de}); }
    }
  });

  // ---- A13b · Proponer una mejora ----
  let texto = '', busca = null;
  const conCasos = t => D().mejoras.some(m => m.toLowerCase() === String(t).trim().toLowerCase());
  VETA.pantalla('A13b', {
    titulo: 'Propose an improvement',
    guia: ['Here you propose to the office a better way of doing something.', 'You write it; Veta looks for whether it has already happened in your chats.', 'That way management decides with cases, not opinions.'],
    pinta: () => {
      const env = C.lee('mejoraEnviada', null);
      if (env) return UI.lineaHecho({texto: 'Proposal sent. Management decides whether to try it.', hora: env.hora, boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-mejora', i: 0}) +
        `<blockquote class="cita c-cita-quieta" data-i="1"><span class="cita-t">“${esc(env.texto)}”</span><span class="cita-o">Your proposal · today</span></blockquote>`;
      return `<div data-i="0" data-vt="c-mejora">${UI.campo({id: 'c-mejora', etiqueta: 'What would you do better?', area: true, filas: 3, valor: texto, placeholder: 'For example: call within 48 hours anyone who asks to see a flat'})}</div>` +
        UI.bloque({titulo: 'Examples', i: 1, html: `<div class="c-chips">${D().mejoras.map((m, k) => `<button type="button" class="c-chip" data-accion="ejemplo" data-n="${k}">${esc(m)}</button>`).join('')}</div>`}) +
        `<div data-i="2">${UI.boton({tipo: 'secundario', texto: 'Search our cases', accion: 'buscar', icono: 'pregunta'})}</div>` +
        (busca ? `<div class="c-hallado" data-i="3">${UI.nota({texto: busca, icono: 'info', caja: true})}</div>` : '');
    },
    botonFijo: () => (C.lee('mejoraEnviada', null) ? '' : UI.boton({texto: 'Propose it to the office', accion: 'proponer'})),
    alMontar: el => { const t = el.querySelector('#c-mejora'); if (t) t.addEventListener('input', () => { texto = t.value; }); },
    acciones: {
      ejemplo(ev, el) { texto = D().mejoras[Number(el.dataset.n)]; busca = null; const t = document.getElementById('c-mejora'); if (t) t.value = texto; const h = document.querySelector('.c-hallado'); if (h) h.remove(); },
      buscar() {
        const t = document.getElementById('c-mejora'); texto = t ? t.value : texto;
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('First write what you\'d do better.'); return; }
        busca = conCasos(texto) ? 'What I\'ve found: you\'ve done it 11 times in six months; in 8 of them the client asked for a viewing.' : 'I can\'t find cases in your chats yet. I\'ll save it and look when they come in.';
        VETA.repinta();
      },
      proponer() {
        const t = document.getElementById('c-mejora'); texto = t ? t.value : texto;
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('First write what you\'d do better.'); return; }
        C.pon('mejoraEnviada', {texto: texto.trim(), hora: VETA.ahora()}); VETA.repinta({hecho: 'c-mejora'});
      },
      deshacer() { const e = C.lee('mejoraEnviada', null); if (e) texto = e.texto; C.pon('mejoraEnviada', null); VETA.repinta({hecho: 'c-mejora'}); }
    }
  });
})();
