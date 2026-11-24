/* Veta demo · pantallas · aprendido.js · paquete C (Veta, cuenta y entrada)
   - A13 · Lo que he aprendido · #/aprendido
   - A13b · Proponer una mejora · #/mejora */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c;

  // ---- A13 · Lo que he aprendido ----
  // ronda 6: cada cosa con quién la pidió, cuándo, cuántas veces la he usado y cuántas me corregiste,
  // en qué paso está, si la uso o no (interruptor) y “Olvidar”. Lo enseñado hoy (“Sí, siempre” en Hoy) va el primero.
  const pausadas = () => C.lee('pausados', []);
  // ronda 7: cada cosa en una fila; al tocarla se abre con quién la pidió, cuántas veces la he usado y “Pararlo” u “Olvidarlo”
  const boton = (t, accion, id) => `<button type="button" class="r7c-caso" data-accion="${accion}" data-de="${esc(id)}"><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
  function fila(x) {
    const on = !pausadas().includes(x.id);
    const usos = x.hechas ? `I have used it ${x.hechas} ${x.hechas === 1 ? 'time' : 'times'} and you corrected me ${x.corregidas || 0}.` : (x.usos || '');
    return {icono: 'estrella', oro: on, nombre: x.corto || x.texto, pasa: x.hoy ? 'You taught me this today' : on ? (x.hechas ? `I have used it ${x.hechas} times` : 'I use it') : 'Paused: I do not use it',
      abre: `<p>${esc(x.texto)}</p><p>${esc(x.quien)} ${esc(x.cuando)}. ${esc(usos)}</p>` + boton(on ? 'Stop it for a while' : 'Use it again', 'usar', x.id) + boton('Forget it', 'olvidar', x.id)};
  }
  VETA.pantalla('A13', {
    titulo: 'What I\'ve learned from you',
    frase: () => { const n = C.aprendidoN(); return n ? `${n} ${n === 1 ? 'thing I do' : 'things I do'}, as you taught me. Tap one to see it.` : 'I am not using anything I have learned now.'; },
    pinta: () => {
      const olv = C.lee('olvidados', []), r6 = C.r6().aprendido, hoy = VETA.r6.siempre();
      const arriba = [], filas = [];
      // lo que me enseñaste con “Enséñale a Veta” y no es un trabajo de la lista: el primero
      C.ensenados().filter(x => !x.regla).reverse().forEach(x => filas.push({icono: 'mic', oro: true, nombre: x.que || x.texto, pasa: 'You taught me this today, ' + x.hora,
        abre: `<p>${esc(x.texto)}</p>` + boton('Forget it', 'olvida-ensenado', x.id)}));
      if (hoy) filas.push(fila({id: 'siempre', hoy: true, texto: hoy.regla, corto: hoy.regla, quien: 'You taught me by changing a message,', cuando: 'today' + (hoy.cuando ? ' at ' + hoy.cuando : ''), usos: 'You will see it in the next viewing message.'}));
      else if (C.lee('siempreOlvidado', null)) arriba.push(UI.lineaHecho({texto: 'Forgotten: ' + C.lee('siempreOlvidado', {}).regla, boton: {texto: 'Undo', accion: 'recordar'}, de: 'siempre', vt: 'c-apr-siempre'}));
      D().aprendido.forEach(a => {
        if (olv.includes(a.id)) { arriba.push(UI.lineaHecho({texto: 'Forgotten: ' + a.corto, boton: {texto: 'Undo', accion: 'recordar'}, de: a.id, vt: 'c-apr-' + a.id})); return; }
        filas.push(fila(Object.assign({id: a.id, corto: a.corto}, r6[a.id] || {texto: a.texto, quien: a.origen, cuando: ''})));
      });
      const ir = (t, r) => `<button type="button" class="r7c-prop" data-ir="${r}"><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
      filas.push({icono: 'editar', nombre: 'You corrected me 4 times', pasa: 'And I changed it', abre: '<p>You corrected me 4 times and now I do it like you.</p><p>You changed 6 of 31 messages before sending them.</p>'});
      filas.push({icono: 'orden', nombre: '1 thing I did not understand', pasa: 'Tell me what you wanted', ir: 'entendido/no-entendida'});
      filas.push({icono: 'equipo', nombre: 'What your office says', pasa: 'How you all work', abre: `<p>${D().oficinaDice.map(esc).join(' ')}</p><div class="r7c-props">${ir('How we work', 'oficina/practicas')}${ir('What your office knows', 'oficina/sabe')}${ir('Suggest an improvement', 'mejora')}</div>`});
      return arriba.join('') + VETA.r7.lista(filas, {i: 0});
    },
    acciones: {
      olvidar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { C.pon('siempreOlvidado', VETA.r6.siempre()); VETA.r6.olvida(); }
        else C.pon('olvidados', C.lee('olvidados', []).concat(id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      recordar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { const x = C.lee('siempreOlvidado', null); if (x) VETA.est.pon('r6_siempre', x); C.pon('siempreOlvidado', null); }
        else C.pon('olvidados', C.lee('olvidados', []).filter(x => x !== id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      'olvida-ensenado'(ev, el) { VETA.r7e.olvida(el.dataset.de); VETA.repinta(); VETA.aviso('OK. I forgot it.'); },
      usar(ev, el) {
        const id = el.dataset.de, p = pausadas(), on = !p.includes(id);
        C.pon('pausados', on ? p.concat(id) : p.filter(x => x !== id)); VETA.repinta(); VETA.aviso(on ? 'OK. I will not use it until you tell me.' : 'OK. I will use it again.');
      }
    }
  });

  // ---- A13b · Proponer una mejora ----
  let texto = '', busca = null;
  const conCasos = t => D().mejoras.some(m => m.toLowerCase() === String(t).trim().toLowerCase());
  VETA.pantalla('A13b', {
    titulo: 'Propose an improvement',
    frase: 'Write what you would do better. I look for cases in your chats and Montse decides.',
    pinta: () => {
      const env = C.lee('mejoraEnviada', null);
      if (env) return UI.lineaHecho({texto: 'Proposal sent. Management decides whether to try it.', hora: env.hora, boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-mejora', i: 0}) +
        `<blockquote class="cita c-cita-quieta" data-i="1"><span class="cita-t">“${esc(env.texto)}”</span><span class="cita-o">Your proposal · today</span></blockquote>`;
      return `<div data-i="0" data-vt="c-mejora">${UI.campo({id: 'c-mejora', etiqueta: 'What would you do better?', area: true, filas: 3, valor: texto, placeholder: 'For example: call within 48 hours anyone who asks to see a flat'})}</div>` +
        `<div class="c-chips" data-i="1">${D().mejoras.map((m, k) => `<button type="button" class="c-chip" data-accion="ejemplo" data-n="${k}">${esc(m)}</button>`).join('')}</div>` +
        (busca ? `<div class="c-hallado" data-i="3">${UI.nota({texto: busca, icono: 'info', caja: true})}</div>` : '');
    },
    botonFijo: () => (C.lee('mejoraEnviada', null) ? '' : VETA.r7.botones({texto: 'Propose it to the office', accion: 'proponer'}, [{texto: 'Look for cases', accion: 'buscar'}])),
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
