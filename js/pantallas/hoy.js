/* Veta demo · pantallas · hoy.js · paquete A (El día)
   A1 · Hoy · #/hoy. Además, VETA.A: lo que comparten las pantallas y hojas del paquete A
   (tareas y notas guardadas desde lo dictado, la línea «en el sitio», el dictado a medias y el «principal» con el 409 de Jordi). */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic;
  const PEND = ['por-hacer', 'pregunta-envio'];
  const HECHAS = ['enviada', 'hecha', 'quitada'];
  const DA = () => VETA.datos.diaA || {};

  // ---- VETA.A: estado propio del paquete (prefijo «a.») ----
  const A = VETA.A = {};
  A.q = () => VETA.yo().id;
  A.seq = () => VETA.est.lee('seq', 0);
  // cuenta como «acción siguiente» para la línea en el sitio (comparte el contador del modelo)
  A.sube = () => { const s = A.seq() + 1; VETA.est.pon('seq', s); return s; };
  // tareas, notas y recordatorios guardados en esta demo por el paquete A
  A.locales = () => VETA.est.lee('a.locales', []);
  A.ponLocal = t => { const l = A.locales().filter(x => x.id !== t.id); t.seq = A.sube(); t.hora = t.hora || VETA.ahora(); t.quien = t.quien || A.q(); l.push(t); VETA.est.pon('a.locales', l); return t; };
  A.quitaLocal = id => { VETA.est.pon('a.locales', A.locales().filter(x => x.id !== id)); };
  A.local = id => A.locales().find(x => x.id === id) || null;
  // la tarea de llamar a Elena (nace del acta, en modelo.js) se puede quitar sola
  A.sinTareaElena = () => VETA.est.lee('a.sinTareaElena', false);

  // En espera: lo del modelo más lo guardado aquí (tareas con fecha y recordatorios)
  A.espera = q => {
    const sinElena = A.sinTareaElena();
    const l = M.espera(q).filter(x => !(sinElena && x.id === 'e-llamar-elena'));
    A.locales().filter(t => t.quien === q && t.fechaISO && !t.cumplida).forEach(t => l.push({id: t.id, local: true, quien: q, tipo: 'espera', fechaISO: t.fechaISO, fecha: t.fecha,
      cliente: t.cliente, titulo: t.titulo, texto: t.texto, etiqueta: 'tuya', estado: 'por-hacer', extra: {}}));
    return l.sort((a, b) => (a.fechaISO < b.fechaISO ? -1 : a.fechaISO > b.fechaISO ? 1 : 0));
  };
  A.esperaPend = q => A.espera(q).filter(x => PEND.includes(x.estado));

  // texto de lo hecho, con el nombre entero (H05 y «Hecho hoy»)
  A.textoHecho = c => {
    const x = c.extra || {};
    if (x.linea) return x.linea;
    if (c.estado === 'enviada') return 'Sent to ' + c.titulo;
    if (c.tipo === 'visita' && c.estado === 'hecha') return 'Notes for ' + c.titulo;
    return (c.lineas && c.lineas[c.estado]) || (c.estado === 'quitada' ? 'Removed · ' + c.titulo : 'Done · ' + c.titulo);
  };
  // todo lo hecho hoy por orden: lo del modelo y lo guardado aquí
  A.hechas = q => {
    const m = M.hechas(q).map(c => ({id: c.id, hora: c.hora, orden: c.orden, texto: A.textoHecho(c), sale: c.estado === 'enviada', cosa: c}));
    const l = A.locales().filter(t => t.quien === q && t.hecha).map(t => ({id: t.id, hora: t.hora, orden: t.seq, texto: t.linea, local: true}));
    return m.concat(l).sort((a, b) => a.orden - b.orden);
  };

  // «principal» de una tarjeta: Jordi trae el 409 (el mensaje cambia una vez); lo demás, como el núcleo
  A.principal = (el, id) => {
    const c = M.cosa(id || el.dataset.de); if (!c) return;
    if (c.cambio && !(c.extra || {}).cambiado) {
      M.marca(c.id, 'por-hacer', {cambiado: true, aviso: c.cambio.aviso, borradorHtml: c.cambio.borradorHtml});
      VETA.repinta({hecho: c.id}); return;
    }
    M.marca(c.id, c.sale ? 'pregunta-envio' : 'hecha'); VETA.repinta({hecho: c.id});
  };

  // dictado a medias
  A.dictado = () => VETA.est.lee('a.dictado', null);
  A.mmss = s => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  // vuelve a Hoy: atrás si Hoy es la anterior; si no, como pestaña
  A.aHoy = () => {
    const p = VETA.pila();
    if (p.length > 1 && p[p.length - 2].ruta === 'hoy') VETA.atras(); else VETA.ir('hoy', {pestana: true});
  };

  // ---- A1 · Hoy ----
  const plural = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
  const manana = n => n === 0 ? 'nothing moves to tomorrow' : n === 1 ? '1 moves to tomorrow' : n + ' move to tomorrow';

  function lineaEnSitio(q) {
    const s = A.seq(); let h = '';
    const u = M.ultima(q);
    if (u && u.orden === s) {
      h += UI.lineaCosa(u);
      const ac = (DA().acta || {}).elena;
      if (u.id === 'c-elena' && u.estado === 'hecha' && ac && !A.sinTareaElena())
        h += UI.lineaHecho({texto: ac.lineaTarea, boton: {texto: 'Undo', accion: 'sin-tarea-elena'}});
    }
    const l = A.locales().find(t => t.quien === q && t.seq === s && t.hecha);
    if (l) h += UI.lineaHecho({texto: l.linea, hora: l.hora, vt: 'a-' + l.id, boton: {texto: 'Undo', accion: 'deshacer-local', de: l.id}});
    return h ? `<div class="a-sitio" data-i="1">${h}</div>` : '';
  }

  function medias() {
    const d = A.dictado(); if (!d) return '';
    return `<div class="hecho a-medias" data-i="2"><div class="hecho-a">${ic('mic', 20)}<span class="hecho-txt">Half-finished dictation <span class="hecho-h">(${esc(A.mmss(d.seg))})</span></span></div>` +
      UI.boton({tipo: 'texto', texto: 'Continue', ir: 'dictar/' + d.guion, ancho: false}) + UI.boton({tipo: 'texto', texto: 'Delete', accion: 'borrar-dictado', ancho: false}) + '</div>';
  }

  function vacia(q, cola) {
    const hechas = A.hechas(q), enCola = cola.filter(c => HECHAS.includes(c.estado)).length;
    const nMan = M.manana(q).length, cerrado = VETA.est.lee('a.cerrado', null);
    let h = '';
    if (cerrado) h += `<div class="a-sitio" data-i="0">${UI.lineaHecho({texto: 'Day closed · New queue tomorrow at 8:00', boton: {texto: 'Undo', accion: 'abrir-dia'}})}</div>`;
    h += `<div class="a-fin" data-i="0"><span class="a-fin-ic">${ic('check', 28)}</span><h2 class="a-fin-t">That's all for today</h2>` +
      `<p class="a-fin-x">${esc(plural(enCola, 'hecha', 'hechas') + ' · ' + manana(nMan))}</p></div>`;
    const en = DA().ensenas, r = en && M.regla(en.regla);
    if (q === 'laura' && r && r.estado === 'propuesta') {
      h += UI.tarjeta(`<div class="a-ens-cab"><span class="tc-ic">${ic('estrella', 22)}</span><h3 class="a-ens-t">${esc(en.titulo)}</h3></div>` +
        `<p class="a-ens-x">${esc(en.texto)}</p>` + UI.botones([{texto: 'See the cases', ir: en.ir}]), {clase: 'a-ens', i: 1});
    }
    if (hechas.length) {
      const ult = hechas.slice(-5), u = M.ultima(q);
      h += UI.bloque({titulo: 'Done today', i: 2, html: `<div class="a-dia">${ult.map(x => `<div class="a-dia-l"${u && x.id === u.id ? ` data-vt="cola-${esc(x.id)}"` : ''}>` +
        `<span class="a-dia-h">${esc(x.hora || '')}</span><span class="a-dia-t">${esc(x.texto)}</span></div>`).join('')}</div>` +
        `<button type="button" class="enlace" data-hoja="h05">See the ${hechas.length} ›</button>`});
    }
    const ne = A.esperaPend(q).length;
    h += UI.lista([{titulo: 'Waiting', sub: plural(ne, 'cosa', 'cosas'), icono: 'reloj', ir: 'espera'}], {i: 3});
    return h;
  }

  VETA.pantalla('A1', {
    guia: ['Here Veta leaves your day in order: first things at the top.', 'You send, dictate or leave it for later, one thing at a time.', 'That way the day has an end and you don\'t forget anything.'],
    pinta: () => {
      const q = A.q(), cola = M.cola(q);
      const pend = cola.filter(c => PEND.includes(c.estado));
      const fecha = (VETA.datos.fecha || {}).hoyTexto || 'Monday 23 November';
      let h = `<button type="button" class="a-leido" data-hoja="h04" data-i="0" data-g="What I've read|Which channels I've checked and what I've found today.">` +
        `<span>${esc(fecha)} · Read up to ${esc(VETA.ahora(-3))}</span><span class="a-leido-c">${ic('chev', 16)}</span></button>`;
      if (!pend.length) return h + vacia(q, cola);
      const prisa = pend.filter(c => !c.sinPrisa), calma = pend.filter(c => c.sinPrisa);
      const abierta = prisa[0] || calma[0];
      const resto = prisa.slice(1), sinPrisa = prisa.length ? calma : calma.slice(1);
      h += lineaEnSitio(q);
      // en ordenador, el panel de la derecha enseña la ficha del cliente de la tarjeta abierta (no el de la fila siguiente)
      h += `<div class="a-abierta" data-i="1"${abierta.cliente ? ` data-panel="cliente/${esc(abierta.cliente)}"` : ''}>${UI.tarjetaCosa(abierta, {n: cola.indexOf(abierta) + 1, total: cola.length})}</div>`;
      h += medias();
      if (resto.length) h += `<div class="a-filas" data-i="2">${UI.lista(resto.map(UI.filaCosa))}</div>`;
      const filas = [];
      if (sinPrisa.length) {
        const s = sinPrisa[0];
        filas.push({titulo: 'And ' + sinPrisa.length + ' more, no rush', sub: sinPrisa.map(x => x.titulo).join(' · '), av: s.cliente, ir: 'cliente/' + s.cliente, vt: 'cola-' + s.id, focoFoto: true});
      }
      const hechas = A.hechas(q), enSitio = (lineaEnSitio(q).match(/class="hecho"/g) || []).length, nMan = M.manana(q).length;
      if (hechas.length > enSitio || nMan) filas.push({titulo: plural(hechas.length, 'done today', 'done today'), sub: nMan ? manana(nMan) : null, icono: 'check', hoja: 'h05'});
      const ne = A.esperaPend(q).length;
      filas.push({titulo: 'Waiting', sub: plural(ne, 'cosa', 'cosas'), icono: 'reloj', ir: 'espera'});
      h += UI.lista(filas, {i: 3, clase: 'a-pies'});
      return h;
    },
    botonFijo: () => {
      const q = A.q();
      if (M.pendientes(q).length || VETA.est.lee('a.cerrado', null)) return '';
      return UI.boton({texto: 'Close the day', accion: 'cerrar-dia', g: 'Close the day|I\'ll show you how it ends up and what moves to tomorrow.'});
    },
    // si el botón de la tarjeta abierta queda bajo la barra, la lista sube lo justo para que se vea (sin que lo hagas tú)
    alMontar: el => {
      const d = el.closest('.desplaza'), b = el.querySelector('.a-abierta .btn-principal'); if (!d || !b) return;
      const sobra = b.getBoundingClientRect().bottom + 12 - d.getBoundingClientRect().bottom;
      if (sobra > 0) d.scrollTop += sobra;
    },
    acciones: {
      principal(ev, el) { A.principal(el); },
      llamar(ev, el) { M.marca(el.dataset.de, 'hecha'); VETA.repinta({hecho: el.dataset.de}); },
      'sin-tarea-elena'() { VETA.est.pon('a.sinTareaElena', true); VETA.repinta(); VETA.aviso('The call to Elena is no longer logged.', {deshacer: () => { VETA.est.pon('a.sinTareaElena', false); VETA.repinta(); }}); },
      'deshacer-local'(ev, el) { A.quitaLocal(el.dataset.de); VETA.repinta(); },
      'borrar-dictado'() { VETA.est.pon('a.dictado', null); VETA.repinta(); },
      'cerrar-dia'() { VETA.est.pon('a.cerrado', VETA.ahora()); VETA.repinta(); VETA.hoja('h06'); },
      'abrir-dia'() { VETA.est.pon('a.cerrado', null); VETA.repinta(); }
    }
  });
})();
