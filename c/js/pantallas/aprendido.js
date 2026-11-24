/* Veta demo · pantallas · aprendido.js · carril C (Veta y cuenta)
   - A13 · Lo he aprendido de ti · #/aprendido
   - A13b · Proponer una mejora · #/mejora */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;

  // ---- A13 · Lo he aprendido de ti ----
  // Una lista de plegables («+»): cada cosa se abre aquí con quién la pidió, cuántas veces la he usado y «Cambiarlo» (hoja c-aprendido:
  // pararlo un tiempo u olvidarlo). Debajo, «De tu oficina», con filas que abren otra pantalla. Lo enseñado hoy va lo primero.
  const pausadas = () => C.lee('pausados', []);
  const dentro = (parrafos, enlace) => parrafos.filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('') + (enlace ? R7().enlace(enlace) : '');
  function fila(x) {
    const on = !pausadas().includes(x.id);
    const usos = x.hechas ? `Lo he usado ${x.hechas} ${x.hechas === 1 ? 'vez' : 'veces'} y me corregiste ${x.corregidas || 0}.` : (x.usos || '');
    return {nombre: x.corto || x.texto, pasa: x.hoy ? 'Me lo enseñaste hoy' : on ? null : 'En pausa: no lo uso',
      abre: dentro([x.texto, `${x.quien} ${x.cuando}. ${usos}`], {texto: 'Cambiarlo', hoja: 'c-aprendido', de: x.id})};
  }
  // una cosa aprendida, por su id (la lee la hoja c-aprendido)
  C.aprendido = id => {
    if (id === 'siempre') { const h = VETA.r6.siempre(); return h ? {id, corto: h.regla, on: !pausadas().includes(id)} : null; }
    const a = D().aprendido.find(x => x.id === id); return a ? {id, corto: a.corto, on: !pausadas().includes(id)} : null;
  };
  C.usaAprendido = id => {
    const p = pausadas(), on = !p.includes(id);
    C.pon('pausados', on ? p.concat(id) : p.filter(x => x !== id)); VETA.repinta(); VETA.aviso(on ? 'Vale. No lo uso hasta que me lo digas.' : 'Vale. Lo vuelvo a usar.');
  };
  C.olvidaAprendido = id => {
    if (id === 'siempre') { C.pon('siempreOlvidado', VETA.r6.siempre()); VETA.r6.olvida(); }
    else C.pon('olvidados', C.lee('olvidados', []).concat(id));
    VETA.repinta({hecho: 'c-apr-' + id});
  };
  VETA.pantalla('A13', {
    titulo: 'Lo he aprendido de ti',
    pinta: () => {
      const olv = C.lee('olvidados', []), r6 = C.r6().aprendido, hoy = VETA.r6.siempre();
      const arriba = [], filas = [];
      // lo que me enseñaste con el micro y no es un trabajo de la lista: lo primero
      C.ensenados().filter(x => !x.regla).reverse().forEach(x => filas.push({nombre: x.que || x.texto, pasa: 'Me lo enseñaste hoy, ' + x.hora,
        abre: dentro([x.texto], {texto: 'Olvidarlo', accion: 'olvida-ensenado', de: x.id})}));
      if (hoy) filas.push(fila({id: 'siempre', hoy: true, texto: hoy.regla, corto: hoy.regla, quien: 'Me lo enseñaste tú al cambiar un mensaje,', cuando: 'hoy' + (hoy.cuando ? ' a las ' + hoy.cuando : ''), usos: 'Lo verás en el próximo mensaje de visita.'}));
      else if (C.lee('siempreOlvidado', null)) arriba.push(UI.lineaHecho({texto: 'Olvidado: ' + C.lee('siempreOlvidado', {}).regla, boton: {texto: 'Deshacer', accion: 'recordar'}, de: 'siempre', vt: 'c-apr-siempre'}));
      D().aprendido.forEach(a => {
        if (olv.includes(a.id)) { arriba.push(UI.lineaHecho({texto: 'Olvidado: ' + a.corto, boton: {texto: 'Deshacer', accion: 'recordar'}, de: a.id, vt: 'c-apr-' + a.id})); return; }
        filas.push(fila(Object.assign({id: a.id, corto: a.corto}, r6[a.id] || {texto: a.texto, quien: a.origen, cuando: ''})));
      });
      filas.push({nombre: 'Me corregiste 4 veces', abre: dentro(['4 veces me corregiste y ahora lo hago como tú.', '6 de 31 mensajes los cambiaste antes de enviarlos.'])});
      filas.push({nombre: 'Lo que dice tu oficina', abre: dentro(D().oficinaDice)});
      return arriba.join('') + R7().lista(filas, {i: 0}) +
        R7().lista([
          {nombre: 'Cómo trabajamos', ir: 'oficina/practicas'},
          {nombre: 'Lo que sabe tu oficina', ir: 'oficina/sabe'},
          {nombre: '1 cosa que no entendí', ir: 'entendido/no-entendida'}
        ], {rotulo: 'De tu oficina', i: 1}) +
        R7().enlace({texto: 'Proponer una mejora', ir: 'mejora', i: 2});
    },
    acciones: {
      recordar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { const x = C.lee('siempreOlvidado', null); if (x) VETA.est.pon('r6_siempre', x); C.pon('siempreOlvidado', null); }
        else C.pon('olvidados', C.lee('olvidados', []).filter(x => x !== id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      'olvida-ensenado'(ev, el) { VETA.r7e.olvida(el.dataset.de); VETA.repinta(); VETA.aviso('Vale. Lo he olvidado.'); }
    }
  });

  // ---- A13b · Proponer una mejora ----
  let texto = '', busca = null;
  const conCasos = t => D().mejoras.some(m => m.toLowerCase() === String(t).trim().toLowerCase());
  const escrito = () => { const t = document.getElementById('c-mejora'); if (t) texto = t.value; return t; };
  VETA.pantalla('A13b', {
    titulo: 'Proponer una mejora',
    nota: 'Busco casos en tus chats. Decide Montse.',
    pinta: () => {
      const R = R7(), env = C.lee('mejoraEnviada', null);
      if (env) return UI.lineaHecho({texto: 'Propuesta enviada. Dirección decide si se prueba.', hora: env.hora, boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-mejora', i: 0}) +
        R.tarjeta({de: 'Tu propuesta · hoy', texto: `«${env.texto}»`, i: 1});
      const k = D().mejoras.indexOf(texto);
      return `<div data-i="0" data-vt="c-mejora">${UI.campo({id: 'c-mejora', etiqueta: '¿Qué haríais mejor?', area: true, filas: 3, valor: texto, placeholder: 'Escríbelo con tus palabras'})}</div>` +
        `<section class="r7-grupo" data-i="1"><h2 class="r7-rotulo">Por ejemplo</h2>${R.elegir(D().mejoras.map((m, n) => ({id: n, texto: m})), {valor: k < 0 ? null : k, accion: 'ejemplo', etiqueta: 'Por ejemplo'})}</section>` +
        (busca ? R.tarjeta({veta: true, de: 'Lo que he encontrado', texto: busca, i: 2}) : '') +
        R.enlace({texto: 'Buscar casos', accion: 'buscar', i: 3});
    },
    botonFijo: () => (C.lee('mejoraEnviada', null) ? '' : R7().botones({texto: 'Proponerlo a la oficina', accion: 'proponer'})),
    alMontar: el => { const t = el.querySelector('#c-mejora'); if (t) t.addEventListener('input', () => { texto = t.value; }); },
    acciones: {
      ejemplo(ev, el) { texto = D().mejoras[Number(el.dataset.valor)] || ''; busca = null; VETA.repinta(); },
      buscar() {
        const t = escrito();
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('Escribe primero qué haríais mejor.'); return; }
        busca = conCasos(texto) ? 'Lo has hecho 11 veces en seis meses; en 8 el cliente pidió una visita.' : 'Todavía no encuentro casos en tus chats. Lo guardo y lo miro cuando lleguen.';
        VETA.repinta();
      },
      proponer() {
        const t = escrito();
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('Escribe primero qué haríais mejor.'); return; }
        C.pon('mejoraEnviada', {texto: texto.trim(), hora: VETA.ahora()}); VETA.repinta({hecho: 'c-mejora'});
      },
      deshacer() { const e = C.lee('mejoraEnviada', null); if (e) texto = e.texto; C.pon('mejoraEnviada', null); VETA.repinta({hecho: 'c-mejora'}); }
    }
  });
})();
