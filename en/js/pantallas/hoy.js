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
    if (c.tipo === 'visita' && c.estado === 'hecha') return 'Viewing notes for ' + c.titulo;
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
    if (p.length > 1 && ['hoy', 'hoy/cola'].includes(p[p.length - 2].ruta)) VETA.atras(); else VETA.ir('hoy', {pestana: true});
  };

  // ---- ronda 6 · lo que Veta aprende y hace sola (datos en VETA.datos.r6.dia; claves propias «a.r6.») ----
  const R6 = () => (VETA.datos.r6 || {}).dia || {};
  const vivo = VETA.vivo, r6 = VETA.r6;
  const E = (k, d) => VETA.est.lee('a.r6.' + k, d === undefined ? null : d), P = (k, v) => VETA.est.pon('a.r6.' + k, v);
  A.r6 = {lee: E, pon: P};

  // diferencia palabra a palabra entre el mensaje de Veta y el que sale: lo quitado, tachado; lo nuevo, en oro
  A.dif = (antes, ahora) => {
    const a = String(antes).trim().split(/\s+/), b = String(ahora).trim().split(/\s+/);
    let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    let j = 0; while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
    const ma = a.slice(i, a.length - j), mb = b.slice(i, b.length - j), n = ma.length, m = mb.length, T = [];
    for (let x = 0; x <= n; x++) T.push(new Array(m + 1).fill(0));
    for (let x = n - 1; x >= 0; x--) for (let y = m - 1; y >= 0; y--) T[x][y] = ma[x] === mb[y] ? T[x + 1][y + 1] + 1 : Math.max(T[x + 1][y], T[x][y + 1]);
    const ops = []; let x = 0, y = 0;
    while (x < n && y < m) { if (ma[x] === mb[y]) { ops.push(['=', ma[x]]); x++; y++; } else if (T[x + 1][y] >= T[x][y + 1]) ops.push(['-', ma[x++]]); else ops.push(['+', mb[y++]]); }
    while (x < n) ops.push(['-', ma[x++]]); while (y < m) ops.push(['+', mb[y++]]);
    // contexto: lo que queda de la misma frase a cada lado (seis palabras como mucho)
    const fin = w => /[.!?…]$/.test(w);
    let pi = i; while (pi > 0 && i - pi < 6 && !fin(a[pi - 1])) pi--;
    let pf = a.length - j; while (pf < a.length && pf - (a.length - j) < 6 && !(pf > a.length - j && fin(a[pf - 1]))) pf++;
    const pre = a.slice(pi, i), post = a.slice(a.length - j, pf);
    const lado = (sig, env) => {
      const out = []; let run = [];
      const cierra = () => { if (run.length) { out.push(env(run.join(' '))); run = []; } };
      ops.forEach(([o, w]) => { if (o === sig) run.push(w); else if (o === '=') { cierra(); out.push(esc(w)); } });
      cierra();
      return (pi > 0 ? '… ' : '') + pre.map(esc).concat(out, post.map(esc)).join(' ') + (pf < a.length ? ' …' : '');
    };
    return {cambia: n + m > 0, quita: n > 0,
      antes: lado('-', t => `<s class="a-r6-quita">${esc(t)}</s>`), ahora: lado('+', t => vivo.oro(t)),
      antesTxt: pre.concat(ma, post).join(' '), ahoraTxt: pre.concat(mb, post).join(' ')};
  };
  // qué ha enseñado: si ahora hay dos horas donde había una (o ninguna), es «dar dos horas»; si no, «escribir así»
  A.tipoCambio = (antes, ahora) => {
    const horas = t => (String(t).match(/\b\d{1,2}[:.]\d{2}\b/g) || []).length;
    if (horas(ahora) >= 2 && horas(antes) < 2) return {tipo: 'dos-horas', regla: R6().reglaDosHoras, si: 'Yes, whenever I suggest a viewing'};
    return {tipo: 'libre', regla: 'I write messages like this one this way', si: 'Yes, always'};
  };
  // quita de la cosa siguiente lo aplicado (al deshacer, o si en la pestaña Veta se olvidó lo aprendido)
  A.r6.limpia = () => {
    const ap = R6().aplica, c = ap && M.cosa(ap.cosa);
    if (c && (c.extra || {}).r6 && c.estado === 'por-hacer') { M.marca(ap.cosa, 'por-hacer', {r6: false, aviso: null, borradorHtml: null}); return true; }
    return false;
  };

  const calmo = () => matchMedia('(prefers-reduced-motion: reduce)').matches || /mov=reducido/.test(location.search);
  const plural = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
  const manana = n => n === 0 ? 'nothing moves to tomorrow' : n === 1 ? '1 moves to tomorrow' : n + ' move to tomorrow';
  const fila6 = o => `<${o.ir || o.hoja ? 'button type="button"' : 'div'} class="a-r6-fila${o.oro ? ' a-r6-de-veta' : ''}${o.cerrada ? ' a-r6-cerrada' : ''}"${o.ir ? ` data-ir="${esc(o.ir)}"` : ''}${o.hoja ? ` data-hoja="${esc(o.hoja)}"` : ''}${o.vt ? ` data-vt="${esc(o.vt)}"` : ''}>` +
    `<span class="a-r6-f-i">${o.lead || ic(o.icono || 'check', 22)}</span><span class="a-r6-f-c"><span class="a-r6-f-t">${o.tituloHtml || esc(o.titulo)}</span>` +
    (o.sub ? `<span class="a-r6-f-s">${esc(o.sub)}</span>` : '') + (o.enlace ? `<span class="a-r6-f-e">${esc(o.enlace)} ›</span>` : '') + '</span>' +
    (o.boton || '') + ((o.ir || o.hoja) && !o.enlace ? `<span class="a-r6-f-ch">${ic('chev', 16)}</span>` : '') + `</${o.ir || o.hoja ? 'button' : 'div'}>`;

  // lo que Veta cerró y Laura ha vuelto a abrir con «Deshacer»: otra vez en su lista (y en la cuenta), con un botón para que Veta lo cierre de nuevo
  function reabiertas() {
    const ab = E('abiertas', []), l = (R6().cerradas || []).filter(x => ab.includes(x.id)); if (!l.length) return '';
    return `<div class="a-r6-lista a-r6-tuyas" data-i="2">${l.map(x => fila6({vt: 'a-r6-' + x.id, lead: x.cliente ? VETA.av(x.cliente, 40) : null, icono: x.icono, titulo: x.tuya || x.titulo, sub: x.abierta,
      boton: UI.boton({tipo: 'texto', texto: 'Close it yourself', accion: 'r6-recierra', de: x.id, ancho: false})})).join('')}</div>`;
  }

  // «¿Lo hago siempre así?»: sale una vez, cuando el mensaje cambiado ya se ha enviado
  function aprender() {
    const k = E('cambio'), c = k && M.cosa(k.id); if (!c || c.estado !== 'enviada') return '';
    const d = A.dif(k.antes, k.ahora), t = A.tipoCambio(k.antes, k.ahora), ap = R6().aplica;
    if (k.resuelto) {
      if (k.seq !== A.seq()) return '';
      const sig = k.resuelto === 'siempre' && ap && M.cosa(ap.cosa), aplicado = sig && (sig.extra || {}).r6 && sig.estado === 'por-hacer';
      // dice exactamente lo aprendido: las dos horas, o las palabras que Laura ha puesto (o quitado)
      const que = k.resuelto !== 'siempre' ? vivo.oro('With ' + c.corto + ' I do it like this') + '.'
        : t.tipo === 'dos-horas' ? vivo.oro(R6().aprendidoDosHoras) + '.'
        : d.ahora && /v-oro/.test(d.ahora) ? 'From now on, in messages like this one I write: “' + d.ahora + '”' : 'From now on, in messages like this one I take out: “' + d.antes + '”';
      return `<section class="tarjeta a-r6-apr a-r6-ok" data-i="1" data-vt="a-r6-apr"><p class="a-r6-ok-t">${ic('check', 22)}<span><b>Learned.</b> ${que}</span></p>` +
        (aplicado ? `<button type="button" class="enlace a-r6-mira" data-ir="mensaje/${esc(ap.cosa)}">I have changed the message for ${esc(ap.corto)}. Have a look ›</button>` :
          `<p class="a-r6-apl">${k.resuelto === 'siempre' ? 'You will see it in the next message like this one.' : 'You will see it in their next message.'}</p>`) +
        UI.boton({tipo: 'texto', texto: 'Undo', accion: 'r6-desaprende', ancho: false}) + '</section>';
    }
    return `<section class="tarjeta a-r6-apr" data-i="1" data-vt="a-r6-apr"><h2 class="a-r6-apr-t">Shall I always do it like this?</h2>` +
      `<p class="a-r6-apr-x">You changed my message for ${esc(c.corto || c.titulo)}.</p>` +
      `<div class="a-r6-dif">${d.quita ? `<p><span class="a-r6-dif-r">I wrote</span>${d.antes}</p>` : ''}<p><span class="a-r6-dif-r">You wrote</span>${d.ahora}</p></div>` +
      UI.boton({texto: t.si, accion: 'r6-aprende', datos: {ambito: 'siempre'}}) +
      UI.botones([{texto: 'Only with ' + (c.corto || c.titulo), accion: 'r6-aprende', datos: {ambito: 'cliente'}}, {texto: 'Only this time', accion: 'r6-aprende', datos: {ambito: 'vez'}}]) + '</section>';
  }

  // ronda 7 · lo que Veta ha hecho sola (hoy/veta): lo leído, lo que vigila y lo que ha cerrado, con su «Deshacer».
  // Lo aprendido y lo que propone viven en la pestaña Veta: aquí no se repiten.
  function hechoPorVeta(q) {
    const d = R6(), yo = q === 'laura', vis = r6.reglaVisitas(), dv = d.visitas || {};
    const esp = A.esperaPend(q), cuenta = {};
    esp.forEach(x => { const t = (d.vigilo || {})[x.id] || 'respuestas'; cuenta[t] = (cuenta[t] || 0) + 1; });
    const uno = {promesas: 'promise', papeles: 'document', fechas: 'date', llamadas: 'call', respuestas: 'reply'}, varios = {promesas: 'promises', papeles: 'documents', fechas: 'dates', llamadas: 'calls', respuestas: 'replies'};
    const porTipo = ['promesas', 'papeles', 'fechas', 'llamadas', 'respuestas'].filter(t => cuenta[t]).map(t => cuenta[t] + ' ' + (cuenta[t] === 1 ? uno[t] : varios[t])).join(' · ');
    const ab = E('abiertas', []), leidos = ((VETA.datos.lectura || {}).hoy || {}).chats || 8;
    const cerr = yo ? (d.cerradas || []).filter(x => !ab.includes(x.id)) : [];
    let yoH = fila6({icono: 'chat', titulo: 'Since yesterday I have read ' + leidos + ' chats', sub: 'I have left you ' + plural(M.cola(q).length, 'thing ready', 'things ready') + (yo ? ' and I have closed ' + cerr.length + '.' : '.'), hoja: 'h04'});
    yoH += fila6({icono: 'reloj', titulo: 'I\'m watching ' + plural(esp.length, 'thing', 'things') + ' for you', sub: porTipo, ir: 'espera'});
    if (yo && vis === 'sola') yoH += fila6({oro: true, icono: 'check', titulo: dv.solaT, sub: dv.sola, ir: dv.ir});
    cerr.forEach(x => {
      yoH += fila6({oro: true, cerrada: true, vt: 'a-r6-' + x.id, lead: x.cliente ? VETA.av(x.cliente, 40) : null, icono: x.icono, titulo: x.titulo, sub: x.texto,
        boton: UI.boton({tipo: 'texto', texto: 'Undo', accion: 'r6-reabre', de: x.id, ancho: false})});
    });
    return (yo ? reabiertas() : '') + `<div class="a-r6-lista" data-i="1">${yoH}</div>` +
      `<button type="button" class="enlace a-r6-en" data-ir="${VETA.yo().papel === 'direccion' ? 'oficina-que-hace' : 'que-hace'}" data-i="2">Everything Veta does ›</button>`;
  }

  // ronda 7 · las puertas de Hoy: lo que puedes hacer al entrar, con su número. Nada desplegado.
  function puertas(q) {
    const yo = q === 'laura', d = R6(), cola = M.cola(q), pend = cola.filter(c => PEND.includes(c.estado));
    const t = VETA.r6.tocan(q), ab = E('abiertas', []), Pu = [];
    // lo que dirección pregunta por una operación llega aquí, lo primero
    const quien = ((VETA.datos.personas || {}).montse || {}).corto || 'Management';
    r6.preguntas(q).forEach(x => Pu.push({av: 'montse', titulo: 'Question from ' + quien, sub: x.texto + ' · ' + x.nombre, ir: VETA.datos.clientes[x.op] ? 'cliente/' + x.op : 'hoy/cola'}));
    if (t.quedan) {
      const caras = pend.map(c => c.av || c.cliente).filter(Boolean);
      Pu.push({principal: true, caras, icono: 'hoy', titulo: 'Handle today\'s list', sub: pend[0] ? 'Start with ' + pend[0].titulo + '. It is already written.' : 'What Veta closed and you reopened.', n: t.quedan, ir: 'hoy/cola',
        g: 'Handle today\'s list|One thing at a time, with the message already written.'});
    } else {
      Pu.push({principal: true, icono: 'check', titulo: 'All done for today', sub: VETA.est.lee('a.cerrado', null) ? 'Day closed. New queue tomorrow at 8:00.' : 'Look at what is done and close the day.', ir: 'hoy/cola'});
    }
    // la visita de hoy: al salir se cuenta, y salen el acta y el informe con fotos (solo quien lleva la visita)
    const v = cola.find(c => c.tipo === 'visita');
    if (v) {
      const hecha = v.estado === 'hecha';
      Pu.push({foto: v.piso, clase: hecha ? 'puerta-hecha' : '', titulo: hecha ? 'Viewing with ' + (v.corto || v.titulo) + ', written up' : 'Describe a viewing',
        sub: hecha ? 'The notes and the report with photos are done.' : v.momento.replace(/^Viewing with /, '') + '. You get notes and a photo report.', ir: hecha ? 'acta/' + v.cliente : 'dictar/acta',
        g: 'Describe a viewing|You talk for a minute when you leave and Veta writes the notes and the report for the owner.'});
    }
    Pu.push({icono: 'mic', titulo: 'Teach Veta something', sub: 'You say it out loud. Veta makes a proposal and you decide.', ir: 'dictar/orden', g: 'Teach Veta something|An instruction spoken in your voice becomes one of its jobs.'});
    const esp = A.esperaPend(q).length, cerr = yo ? (d.cerradas || []).filter(x => !ab.includes(x.id)).length : 0;
    Pu.push({icono: 'check', clase: 'puerta-hecha', titulo: 'See what Veta did', sub: (yo ? plural(cerr, 'thing closed', 'things closed') + ' and ' : '') + plural(esp, 'watched', 'watched') + '.', n: cerr + esp, ir: 'hoy/veta'});
    return UI.puertas(Pu, {i: 1, panel: 'hoy/cola'});
  }

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
    h += aprender() + reabiertas();
    h += `<div class="a-fin" data-i="0"><span class="a-fin-ic">${ic('check', 28)}</span><h2 class="a-fin-t">That's all for today</h2>` +
      `<p class="a-fin-x">${esc(plural(enCola, 'done', 'done') + ' · ' + manana(nMan))}</p></div>`;
    if (hechas.length) {
      const ult = hechas.slice(-5), u = M.ultima(q);
      h += UI.bloque({titulo: 'Done today', i: 2, html: `<div class="a-dia">${ult.map(x => `<div class="a-dia-l"${u && x.id === u.id ? ` data-vt="cola-${esc(x.id)}"` : ''}>` +
        `<span class="a-dia-h">${esc(x.hora || '')}</span><span class="a-dia-t">${esc(x.texto)}</span></div>`).join('')}</div>` +
        `<button type="button" class="enlace" data-hoja="h05">See the ${hechas.length} ›</button>`});
    }
    return h;
  }

  // ---- A1 · Hoy: pocas puertas. Cada una dice lo que puedes hacer y cuántas cosas hay detrás ----
  VETA.pantalla('A1', {
    guia: ['Here you see, in a few doors, what you can do today.', 'You tap one: handle what is yours to do, describe a viewing, teach Veta something or see what it did on its own.', 'This way there is nothing to read or remember: you go straight into what you want to do.'],
    pinta: () => medias() + puertas(A.q()),
    acciones: {
      'borrar-dictado'() { VETA.est.pon('a.dictado', null); VETA.repinta(); }
    }
  });

  // ---- A1v · Lo que Veta ha hecho sola ----
  VETA.pantalla('A1v', {
    guia: ['Here is what Veta has done without being asked: what it has read, what it is watching and what it has closed.', 'You undo anything that is not right.', 'This way you know what it does on its own and you correct it with one tap.'],
    pinta: () => hechoPorVeta(A.q()),
    acciones: {
      'r6-reabre'(ev, el) {
        const id = el.dataset.de, ab = E('abiertas', []); if (!ab.includes(id)) ab.push(id);
        P('abiertas', ab); VETA.repinta({paso: true}); VETA.aviso('OK. I won\'t close it without asking you. It is back in today\'s list.');
      },
      'r6-recierra'(ev, el) { P('abiertas', E('abiertas', []).filter(x => x !== el.dataset.de)); VETA.repinta({paso: true}); VETA.aviso('Done. I will close it myself.'); }
    }
  });

  // ---- A1c · Lo de hoy: la cola, una cosa cada vez ----
  VETA.pantalla('A1c', {
    guia: ['Here Veta leaves your day in order: first things at the top.', 'You send, dictate or leave it for later. If you change something, I will ask if I should always do it like that.', 'This way you get fewer things to do each week, and you decide which ones I stop doing.'],
    pinta: () => {
      const q = A.q(), cola = M.cola(q), yo = q === 'laura';
      const pend = cola.filter(c => PEND.includes(c.estado));
      let h = '';
      if (!pend.length) return vacia(q, cola);
      const prisa = pend.filter(c => !c.sinPrisa), calma = pend.filter(c => c.sinPrisa);
      const abierta = prisa[0] || calma[0];
      const resto = prisa.slice(1), sinPrisa = prisa.length ? calma : calma.slice(1);
      h += lineaEnSitio(q);
      if (yo) h += aprender();
      // en ordenador, el panel de la derecha enseña la ficha del cliente de la tarjeta abierta (no el de la fila siguiente)
      h += `<div class="a-abierta" data-i="1"${abierta.cliente ? ` data-panel="cliente/${esc(abierta.cliente)}"` : ''}>${UI.tarjetaCosa(yo ? Object.assign({}, abierta, {quienEs: null}) : abierta, {n: 1, total: VETA.r6.tocan(q).quedan})}</div>`;
      h += medias();
      const filas = [];
      if (sinPrisa.length) {
        const s = sinPrisa[0];
        filas.push({titulo: 'And ' + sinPrisa.length + ' more, no rush', sub: sinPrisa.map(x => x.titulo).join(' · '), av: s.cliente, ir: 'cliente/' + s.cliente, vt: 'cola-' + s.id, focoFoto: true});
      }
      // lo que espera turno va recogido en una línea con sus caras: se abre al tocarla
      const mas = resto.concat(sinPrisa), abre = E('resto', false);
      if (mas.length) h += `<button type="button" class="a-r6-mas" data-accion="r6-resto" aria-expanded="${abre ? 'true' : 'false'}" data-i="2">` +
        `<span class="a-r6-mas-av">${mas.slice(0, 3).map(x => VETA.av(x.av || x.cliente, 32)).join('')}</span>` +
        `<span class="a-r6-mas-t">And ${mas.length} more</span><span class="chev-gira">${ic('chev', 16)}</span></button>`;
      if (abre && resto.length) h += `<div class="a-filas" data-i="2">${UI.lista(resto.map(c => (c.extra || {}).r6 ? UI.fila({titulo: c.fila || c.titulo, sub: 'Already changed with what you showed me', av: c.cliente, ir: 'cliente/' + c.cliente, vt: 'cola-' + c.id, focoFoto: true}) : UI.filaCosa(c)))}</div>`;
      if (yo) h += reabiertas();
      const pies = abre ? filas : [];
      const hechas = A.hechas(q), enSitio = (lineaEnSitio(q).match(/class="hecho"/g) || []).length, nMan = M.manana(q).length;
      if (hechas.length > enSitio || nMan) pies.push({titulo: plural(hechas.length, 'done today', 'done today'), sub: nMan ? manana(nMan) : null, icono: 'check', hoja: 'h05'});
      if (pies.length) h += UI.lista(pies, {i: 3, clase: 'a-pies'});
      return h;
    },
    botonFijo: () => {
      const q = A.q();
      if (VETA.r6.tocan(q).quedan || VETA.est.lee('a.cerrado', null)) return '';
      return UI.boton({texto: 'Close the day', accion: 'cerrar-dia', g: 'Close the day|I\'ll show you how it ends up and what moves to tomorrow.'});
    },
    alMontar: el => {
      // lo que cambió en la pestaña Veta: si se olvidó lo aprendido, el mensaje siguiente vuelve a ser el de antes;
      // si la regla de las visitas subió, su fila se muda de bloque a la vista
      if (A.q() === 'laura') {
        const k = E('cambio');
        if (!r6.siempre()) { let toca = A.r6.limpia(); if (k && k.resuelto === 'siempre') { P('cambio', null); toca = true; } if (toca) { VETA.repinta(); return; } }
        P('visitasVista', r6.reglaVisitas());
      }
      // si el botón de la tarjeta abierta queda bajo la barra, la lista sube lo justo para que se vea (sin que lo hagas tú)
      const d = el.closest('.desplaza'), b = el.querySelector('.a-abierta .btn-principal'); if (!d || !b) return;
      // con la pregunta de aprender delante, manda ella: se ve entera desde arriba
      const apr = el.querySelector('.a-r6-apr');
      if (apr) { if (apr.getBoundingClientRect().top < d.getBoundingClientRect().top + 8) d.scrollTop = 0; return; }
      // el botón redondo de dictar sube sobre la lista: el botón de la tarjeta tampoco puede quedar debajo de él
      const br = b.getBoundingClientRect(), mic = document.querySelector('#barra .mic-c'), m = mic && mic.getBoundingClientRect();
      let tope = d.getBoundingClientRect().bottom;
      if (m && m.width && br.right > m.left && br.left < m.right) tope = Math.min(tope, m.top);
      const sobra = br.bottom + 12 - tope;
      if (sobra > 0) d.scrollTop += sobra;
    },
    acciones: {
      principal(ev, el) { A.principal(el); },
      llamar(ev, el) { M.marca(el.dataset.de, 'hecha'); VETA.repinta({hecho: el.dataset.de}); },
      'sin-tarea-elena'() { VETA.est.pon('a.sinTareaElena', true); VETA.repinta(); VETA.aviso('The call to Elena is no longer logged.', {deshacer: () => { VETA.est.pon('a.sinTareaElena', false); VETA.repinta(); }}); },
      'deshacer-local'(ev, el) { A.quitaLocal(el.dataset.de); VETA.repinta(); },
      'borrar-dictado'() { VETA.est.pon('a.dictado', null); VETA.repinta(); },
      'cerrar-dia'() { VETA.est.pon('a.cerrado', VETA.ahora()); VETA.repinta(); VETA.hoja('h06'); },
      'abrir-dia'() { VETA.est.pon('a.cerrado', null); VETA.repinta(); },
      'r6-resto'() { P('resto', !E('resto', false)); VETA.repinta(); },
      // «Sí, siempre» · «Solo con Marta» · «Solo esta vez»
      'r6-aprende'(ev, el) {
        const k = E('cambio'), c = k && M.cosa(k.id); if (!c) return;
        const amb = el.dataset.ambito;
        if (amb === 'vez') { P('cambio', null); VETA.repinta({paso: true}); VETA.aviso('OK. Only this time.'); return; }
        const d = A.dif(k.antes, k.ahora), t = A.tipoCambio(k.antes, k.ahora), ap = R6().aplica;
        if (amb === 'siempre') {
          r6.ensena({regla: t.regla, antes: d.antesTxt, ahora: d.ahoraTxt, ambito: 'siempre', tipo: t.tipo, de: c.cliente});
          const sig = t.tipo === 'dos-horas' && ap && M.cosa(ap.cosa);
          if (sig && sig.estado === 'por-hacer') M.marca(ap.cosa, 'por-hacer', {r6: true, aviso: ap.aviso, borradorHtml: vivo.marca(ap.texto, ap.frase)});
        } else P('solo', {regla: t.regla, cliente: c.cliente, corto: c.corto || c.titulo, cuando: VETA.ahora()});
        k.resuelto = amb; k.regla = t.regla; k.seq = A.seq(); P('cambio', k);
        VETA.repinta({paso: true});
      },
      'r6-desaprende'() {
        const k = E('cambio'); if (!k) return;
        if (k.resuelto === 'siempre') { r6.olvida(); A.r6.limpia(); } else P('solo', null);
        delete k.resuelto; delete k.seq; P('cambio', k); VETA.repinta({paso: true});
      },
      // lo que Veta cerró sola: «Deshacer» lo abre otra vez y Veta dice lo que ha entendido
      'r6-reabre'(ev, el) {
        const id = el.dataset.de, ab = E('abiertas', []); if (!ab.includes(id)) ab.push(id);
        P('abiertas', ab); VETA.repinta({paso: true}); VETA.aviso('OK. I won\'t close it without asking you.');
        // vuelve a su lista: se sube para verlo arriba, con la cifra ya cambiada
        setTimeout(() => { const d = document.querySelector('.col.activa .desplaza'); if (d) d.scrollTo({top: 0, behavior: calmo() ? 'auto' : 'smooth'}); }, 350);
      },
      // «Ciérralo tú»: Laura se lo devuelve a Veta
      'r6-recierra'(ev, el) { P('abiertas', E('abiertas', []).filter(x => x !== el.dataset.de)); VETA.repinta({paso: true}); VETA.aviso('Done. I will close it myself.'); }
    }
  });
})();
