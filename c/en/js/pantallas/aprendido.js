/* Veta demo · pantallas · aprendido.js · carril C (Veta y cuenta)
   - A13 · Lo he aprendido de ti · #/aprendido
   - A13b · Proponer una mejora · #/mejora */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;

  // ---- A13 · Lo he aprendido de ti ----
  // Una lista de plegables (“+”): cada cosa se abre aquí con quién la pidió, cuántas veces la he usado y “Cambiarlo” (hoja c-aprendido:
  // pararlo un tiempo u olvidarlo). Debajo, “De tu oficina”, con filas que abren otra pantalla. Lo enseñado hoy va lo primero.
  const pausadas = () => C.lee('pausados', []);
  const dentro = (parrafos, enlace) => parrafos.filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('') + (enlace ? R7().enlace(enlace) : '');
  function fila(x) {
    const on = !pausadas().includes(x.id);
    const usos = x.hechas ? `I have used it ${x.hechas} ${x.hechas === 1 ? 'time' : 'times'} and you corrected me ${x.corregidas || 0}.` : (x.usos || '');
    return {nombre: x.corto || x.texto, pasa: x.hoy ? 'You taught me this today' : on ? null : 'Paused: I do not use it', datos: {apr: x.id},
      abre: dentro([x.texto, `${x.quien} ${x.cuando}. ${usos}`], {texto: 'Change it', hoja: 'c-aprendido', de: x.id})};
  }
  // una cosa aprendida, por su id (la lee la hoja c-aprendido)
  C.aprendido = id => {
    if (id === 'siempre') { const h = VETA.r6.siempre(); return h ? {id, corto: h.regla, on: !pausadas().includes(id)} : null; }
    const a = D().aprendido.find(x => x.id === id); return a ? {id, corto: a.corto, on: !pausadas().includes(id)} : null;
  };
  C.usaAprendido = id => {
    const p = pausadas(), on = !p.includes(id);
    C.pon('pausados', on ? p.concat(id) : p.filter(x => x !== id)); VETA.repinta(); VETA.aviso(on ? 'OK. I will not use it until you tell me.' : 'OK. I will use it again.');
  };
  C.olvidaAprendido = id => VETA.mov.seVa(`.r7-fila-d[data-apr="${id}"]`, () => {
    if (id === 'siempre') { C.pon('siempreOlvidado', VETA.r6.siempre()); VETA.r6.olvida(); }
    else C.pon('olvidados', C.lee('olvidados', []).concat(id));
    VETA.repinta({hecho: 'c-apr-' + id});
  });
  VETA.pantalla('A13', {
    titulo: 'What I\'ve learned from you',
    pinta: () => {
      const olv = C.lee('olvidados', []), r6 = C.r6().aprendido, hoy = VETA.r6.siempre();
      const arriba = [], filas = [];
      // lo que me enseñaste con el micro y no es un trabajo de la lista: lo primero
      C.ensenados().filter(x => !x.regla).reverse().forEach(x => filas.push({nombre: x.que || x.texto, pasa: 'You taught me this today, ' + x.hora,
        abre: dentro([x.texto], {texto: 'Forget it', accion: 'olvida-ensenado', de: x.id})}));
      if (hoy) filas.push(fila({id: 'siempre', hoy: true, texto: hoy.regla, corto: hoy.regla, quien: 'You taught me by changing a message,', cuando: 'today' + (hoy.cuando ? ' at ' + hoy.cuando : ''), usos: 'You will see it in the next viewing message.'}));
      else if (C.lee('siempreOlvidado', null)) arriba.push(R7().hecho({texto: 'Forgotten: ' + C.lee('siempreOlvidado', {}).regla, deshacer: 'recordar', de: 'siempre', vt: 'c-apr-siempre'}));
      D().aprendido.forEach(a => {
        if (olv.includes(a.id)) { arriba.push(R7().hecho({texto: 'Forgotten: ' + a.corto, deshacer: 'recordar', de: a.id, vt: 'c-apr-' + a.id})); return; }
        filas.push(fila(Object.assign({id: a.id, corto: a.corto}, r6[a.id] || {texto: a.texto, quien: a.origen, cuando: ''})));
      });
      filas.push({nombre: 'You corrected me 4 times', abre: dentro(['You corrected me 4 times and now I do it like you.', 'You changed 6 of 31 messages before sending them.'])});
      filas.push({nombre: 'What your office says', abre: dentro(D().oficinaDice)});
      return arriba.join('') + R7().lista(filas, {i: 0}) +
        R7().lista([
          {nombre: 'How we work', ir: 'oficina/practicas'},
          {nombre: 'What your office knows', ir: 'oficina/sabe'},
          {nombre: '1 thing I did not understand', ir: 'entendido/no-entendida'}
        ], {rotulo: 'From your office', i: 1}) +
        R7().enlace({texto: 'Propose an improvement', ir: 'mejora', i: 2});
    },
    acciones: {
      recordar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { const x = C.lee('siempreOlvidado', null); if (x) VETA.est.pon('r6_siempre', x); C.pon('siempreOlvidado', null); }
        else C.pon('olvidados', C.lee('olvidados', []).filter(x => x !== id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      'olvida-ensenado'(ev, el) { VETA.r7e.olvida(el.dataset.de); VETA.repinta(); VETA.aviso('OK. I forgot it.'); }
    }
  });

  // ---- A13b · Proponer una mejora ----
  let texto = '', busca = null;
  const conCasos = t => D().mejoras.some(m => m.toLowerCase() === String(t).trim().toLowerCase());
  const escrito = () => { const t = document.getElementById('c-mejora'); if (t) texto = t.value; return t; };
  VETA.pantalla('A13b', {
    titulo: 'Propose an improvement',
    nota: 'I look for cases in your chats. Montse decides.',
    pinta: () => {
      const R = R7(), env = C.lee('mejoraEnviada', null);
      if (env) return R.hecho({texto: 'Proposal sent to the office', hora: env.hora, deshacer: 'deshacer', vt: 'c-mejora'}) +
        R.tarjeta({de: 'Your proposal · today', texto: `“${env.texto}”`, i: 1});
      const k = D().mejoras.indexOf(texto);
      return `<div data-i="0" data-vt="c-mejora">${UI.campo({id: 'c-mejora', etiqueta: 'What would you do better?', area: true, filas: 3, valor: texto, placeholder: 'Write it in your own words'})}</div>` +
        R.elegir(D().mejoras.map((m, n) => ({id: n, texto: m})), {valor: k < 0 ? null : k, accion: 'ejemplo', rotulo: 'For example', i: 1}) +
        (busca ? R.tarjeta({veta: true, de: 'What I\'ve found', texto: busca, i: 2}) : '') +
        R.enlace({texto: 'Look for cases', accion: 'buscar', i: 3});
    },
    botonFijo: () => (C.lee('mejoraEnviada', null) ? R7().sigue() : R7().botones({texto: 'Propose it to the office', accion: 'proponer'})),
    alMontar: el => { const t = el.querySelector('#c-mejora'); if (t) t.addEventListener('input', () => { texto = t.value; }); },
    acciones: {
      ejemplo(ev, el) { texto = D().mejoras[Number(el.dataset.valor)] || ''; busca = null; VETA.repinta(); },
      buscar() {
        const t = escrito();
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('First write what you\'d do better.'); return; }
        busca = conCasos(texto) ? 'You\'ve done it 11 times in six months; in 8 the client asked for a viewing.' : 'I can\'t find cases in your chats yet. I\'ll save it and look when they come in.';
        VETA.repinta();
      },
      proponer() {
        const t = escrito();
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('First write what you\'d do better.'); return; }
        C.pon('mejoraEnviada', {texto: texto.trim(), hora: VETA.ahora()}); VETA.repinta({hecho: 'c-mejora'});
      },
      deshacer() { const e = C.lee('mejoraEnviada', null); if (e) texto = e.texto; C.pon('mejoraEnviada', null); VETA.repinta({hecho: 'c-mejora'}); }
    }
  });
})();
