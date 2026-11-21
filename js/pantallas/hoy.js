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
    if (c.estado === 'enviada') return 'Enviado a ' + c.titulo;
    if (c.tipo === 'visita' && c.estado === 'hecha') return 'Nota de la visita de ' + c.titulo;
    return (c.lineas && c.lineas[c.estado]) || (c.estado === 'quitada' ? 'Quitada · ' + c.titulo : 'Hecho · ' + c.titulo);
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
    if (horas(ahora) >= 2 && horas(antes) < 2) return {tipo: 'dos-horas', regla: R6().reglaDosHoras, si: 'Sí, siempre que proponga una visita'};
    return {tipo: 'libre', regla: 'Escribo así los mensajes como este', si: 'Sí, siempre'};
  };
  // quita de la cosa siguiente lo aplicado (al deshacer, o si en la pestaña Veta se olvidó lo aprendido)
  A.r6.limpia = () => {
    const ap = R6().aplica, c = ap && M.cosa(ap.cosa);
    if (c && (c.extra || {}).r6 && c.estado === 'por-hacer') { M.marca(ap.cosa, 'por-hacer', {r6: false, aviso: null, borradorHtml: null}); return true; }
    return false;
  };

  const calmo = () => matchMedia('(prefers-reduced-motion: reduce)').matches || /mov=reducido/.test(location.search);
  const plural = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
  const manana = n => n === 0 ? 'nada pasa a mañana' : n === 1 ? '1 pasa a mañana' : n + ' pasan a mañana';
  const fila6 = o => `<${o.ir || o.hoja ? 'button type="button"' : 'div'} class="a-r6-fila${o.oro ? ' a-r6-de-veta' : ''}${o.cerrada ? ' a-r6-cerrada' : ''}"${o.ir ? ` data-ir="${esc(o.ir)}"` : ''}${o.hoja ? ` data-hoja="${esc(o.hoja)}"` : ''}${o.vt ? ` data-vt="${esc(o.vt)}"` : ''}>` +
    `<span class="a-r6-f-i">${o.lead || ic(o.icono || 'check', 22)}</span><span class="a-r6-f-c"><span class="a-r6-f-t">${o.tituloHtml || esc(o.titulo)}</span>` +
    (o.sub ? `<span class="a-r6-f-s">${esc(o.sub)}</span>` : '') + (o.enlace ? `<span class="a-r6-f-e">${esc(o.enlace)} ›</span>` : '') + '</span>' +
    (o.boton || '') + ((o.ir || o.hoja) && !o.enlace ? `<span class="a-r6-f-ch">${ic('chev', 16)}</span>` : '') + `</${o.ir || o.hoja ? 'button' : 'div'}>`;

  // arriba: la cuenta, a tamaño de título, y en oro lo que Veta ha cerrado sola. La cifra es VETA.r6.tocan: la misma de la tarjeta y de la pestaña.
  function arriba(q) {
    const d = R6(), t = VETA.r6.tocan(q), n = t.total, k = t.quedan, ab = E('abiertas', []);
    const cerr = (d.cerradas || []).filter(x => !ab.includes(x.id));
    const c = (a, clave, de) => vivo.cuenta({de, a, clave: 'a-r6-' + clave});
    const hoy = () => c(n, 'hoy' + (ab.length ? n : ''), ab.length ? n - 1 : d.haceUnMes) + (n === 1 ? ' cosa.' : ' cosas.');
    const frase = k === 0 ? `Hoy te ${n === 1 ? 'tocaba' : 'tocaban'} ${hoy()}` : k < n ? `Te ${k === 1 ? 'queda' : 'quedan'} ${c(k, 'q' + k + 'de' + n, k + 1)} de ${n}.` : `Hoy te ${n === 1 ? 'toca' : 'tocan'} ${hoy()}`;
    return `<button type="button" class="a-r6-hoy" data-ir="antes-ahora" data-i="0" data-g="Antes y ahora|Tu lista del primer día al lado de la de hoy.">` +
      `<span class="a-r6-hoy-t">${frase} <span class="a-r6-hoy-a">Hace un mes eran ${d.haceUnMes}.</span></span><span class="a-r6-ch">${ic('chev', 16)}</span></button>` +
      (cerr.length ? `<button type="button" class="a-r6-tira" data-accion="r6-cerradas" data-i="0">${ic('check', 18)}<span class="a-r6-tira-t"><span>Ya he cerrado <b>${cerr.length}</b> ${cerr.length === 1 ? 'cosa' : 'cosas'} por ti:</span> <span>${esc(cerr.map(x => x.corto).join(' y '))}</span></span>` +
        `<span class="a-r6-ch">${ic('chev', 16)}</span></button>` : '');
  }

  // lo que Veta cerró y Laura ha vuelto a abrir con «Deshacer»: otra vez en su lista (y en la cuenta), con un botón para que Veta lo cierre de nuevo
  function reabiertas() {
    const ab = E('abiertas', []), l = (R6().cerradas || []).filter(x => ab.includes(x.id)); if (!l.length) return '';
    return `<div class="a-r6-lista a-r6-tuyas" data-i="2">${l.map(x => fila6({vt: 'a-r6-' + x.id, lead: x.cliente ? VETA.av(x.cliente, 40) : null, icono: x.icono, titulo: x.tuya || x.titulo, sub: x.abierta,
      boton: UI.boton({tipo: 'texto', texto: 'Ciérralo tú', accion: 'r6-recierra', de: x.id, ancho: false})})).join('')}</div>`;
  }

  // «¿Lo hago siempre así?»: sale una vez, cuando el mensaje cambiado ya se ha enviado
  function aprender() {
    const k = E('cambio'), c = k && M.cosa(k.id); if (!c || c.estado !== 'enviada') return '';
    const d = A.dif(k.antes, k.ahora), t = A.tipoCambio(k.antes, k.ahora), ap = R6().aplica;
    if (k.resuelto) {
      if (k.seq !== A.seq()) return '';
      const sig = k.resuelto === 'siempre' && ap && M.cosa(ap.cosa), aplicado = sig && (sig.extra || {}).r6 && sig.estado === 'por-hacer';
      // dice exactamente lo aprendido: las dos horas, o las palabras que Laura ha puesto (o quitado)
      const que = k.resuelto !== 'siempre' ? vivo.oro('Con ' + c.corto + ' lo hago así') + '.'
        : t.tipo === 'dos-horas' ? vivo.oro(R6().aprendidoDosHoras) + '.'
        : d.ahora && /v-oro/.test(d.ahora) ? 'Desde ahora, en los mensajes como este escribo: «' + d.ahora + '»' : 'Desde ahora, en los mensajes como este quito: «' + d.antes + '»';
      return `<section class="tarjeta a-r6-apr a-r6-ok" data-i="1" data-vt="a-r6-apr"><p class="a-r6-ok-t">${ic('check', 22)}<span><b>Aprendido.</b> ${que}</span></p>` +
        (aplicado ? `<button type="button" class="enlace a-r6-mira" data-ir="mensaje/${esc(ap.cosa)}">Ya he cambiado el mensaje de ${esc(ap.corto)}. Míralo ›</button>` :
          `<p class="a-r6-apl">${k.resuelto === 'siempre' ? 'Lo verás en el próximo mensaje como este.' : 'Lo verás en su próximo mensaje.'}</p>`) +
        UI.boton({tipo: 'texto', texto: 'Deshacer', accion: 'r6-desaprende', ancho: false}) + '</section>';
    }
    return `<section class="tarjeta a-r6-apr" data-i="1" data-vt="a-r6-apr"><h2 class="a-r6-apr-t">¿Lo hago siempre así?</h2>` +
      `<p class="a-r6-apr-x">Has cambiado mi mensaje para ${esc(c.corto || c.titulo)}.</p>` +
      `<div class="a-r6-dif">${d.quita ? `<p><span class="a-r6-dif-r">Yo puse</span>${d.antes}</p>` : ''}<p><span class="a-r6-dif-r">Tú has puesto</span>${d.ahora}</p></div>` +
      UI.boton({texto: t.si, accion: 'r6-aprende', datos: {ambito: 'siempre'}}) +
      UI.botones([{texto: 'Solo con ' + (c.corto || c.titulo), accion: 'r6-aprende', datos: {ambito: 'cliente'}}, {texto: 'Solo esta vez', accion: 'r6-aprende', datos: {ambito: 'vez'}}]) + '</section>';
  }

  // los tres bloques de Veta, debajo de «Hoy te toca»
  function bloques(q) {
    const d = R6(), vis = E('visitasVista', 'propuesta'), dv = d.visitas || {};
    // Esto lo hago yo
    const esp = A.esperaPend(q), cuenta = {};
    esp.forEach(x => { const t = (d.vigilo || {})[x.id] || 'respuestas'; cuenta[t] = (cuenta[t] || 0) + 1; });
    const uno = {promesas: 'promesa', papeles: 'papel', fechas: 'fecha', llamadas: 'llamada', respuestas: 'respuesta'};
    const porTipo = ['promesas', 'papeles', 'fechas', 'llamadas', 'respuestas'].filter(t => cuenta[t]).map(t => cuenta[t] + ' ' + (cuenta[t] === 1 ? uno[t] : t)).join(' · ');
    const ab = E('abiertas', []), leidos = ((VETA.datos.lectura || {}).hoy || {}).chats || 8;
    let yo = fila6({icono: 'chat', titulo: 'Desde ayer he leído ' + leidos + ' chats', sub: 'Te he dejado ' + plural(M.cola(q).length, 'cosa lista', 'cosas listas') + ' y he cerrado ' + ((d.cerradas || []).length - ab.length) + '.', hoja: 'h04'});
    yo += fila6({icono: 'reloj', titulo: 'Vigilo ' + plural(esp.length, 'cosa', 'cosas') + ' por ti', sub: porTipo, ir: 'espera'});
    if (vis === 'sola') yo += fila6({oro: true, vt: 'a-r6-visitas', icono: 'check', titulo: dv.solaT, sub: dv.sola, ir: dv.ir});
    (d.cerradas || []).forEach(x => {
      const abierta = false; if (ab.includes(x.id)) return;   // lo abierto otra vez está arriba, en lo tuyo
      yo += fila6({oro: true, cerrada: true, vt: 'a-r6-' + x.id, lead: x.cliente ? VETA.av(x.cliente, 40) : null, icono: x.icono, titulo: x.titulo, sub: abierta ? x.abierta : x.texto,
        boton: abierta ? '' : UI.boton({tipo: 'texto', texto: 'Deshacer', accion: 'r6-reabre', de: x.id, ancho: false})});
    });
    const pregs = r6.preguntas(q), quien = ((VETA.datos.personas || {}).montse || {}).corto || 'Dirección';
    let h = pregs.length ? UI.bloque({titulo: 'Te pregunta ' + quien, i: 3, html: `<div class="a-r6-lista">${pregs.map(x => fila6({lead: VETA.av('montse', 40), titulo: x.texto,
      sub: 'Sobre ' + x.nombre + ' · hoy, ' + x.hora, ir: VETA.datos.clientes[x.op] ? 'cliente/' + x.op : null})).join('')}</div>`}) : '';
    h += UI.bloque({titulo: 'Esto lo hago yo', i: 3, html: `<div class="a-r6-lista">${yo}</div><button type="button" class="enlace a-r6-en" data-ir="que-hace">Qué hace Veta ›</button>`});
    // Lo que he aprendido de ti
    const s = r6.siempre(), solo = E('solo'), ap = d.aprendido; let apr = '';
    if (s) apr += fila6({oro: true, vt: 'a-r6-siempre', icono: 'estrella', tituloHtml: vivo.oro(s.regla, {clave: 'a-r6-s'}), sub: 'Me lo has enseñado hoy a las ' + (s.cuando || VETA.ahora()), ir: 'aprendido'});
    if (solo) apr += fila6({oro: true, icono: 'estrella', titulo: 'Con ' + solo.corto + ': ' + solo.regla.charAt(0).toLowerCase() + solo.regla.slice(1), sub: 'Me lo has enseñado hoy a las ' + solo.cuando, ir: 'aprendido'});
    if (ap) apr += fila6({lead: vivo.anillo({van: ap.hechas - ap.cambiadas, de: ap.hechas, tam: 's'}), titulo: ap.titulo,
      sub: ap.origen + ' · Lo he hecho ' + plural(ap.hechas, 'vez', 'veces') + ' · Me corregiste ' + ap.cambiadas, ir: ap.ir});
    h += UI.bloque({titulo: 'Lo que he aprendido de ti', i: 4, html: `<div class="a-r6-lista">${apr}</div><button type="button" class="enlace a-r6-en" data-ir="aprendido">Ver todo lo que he aprendido ›</button>`});
    // ¿Lo hago yo?
    let pro = '';
    (d.loHagoYo || []).forEach(x => {
      if (x.id === 'visitas' && vis === 'sola') return;
      if (x.regla) { const r = M.regla(x.regla); if (!r || r.estado !== 'propuesta') return; }
      const prueba = x.id === 'visitas' && vis === 'prueba';
      pro += fila6({vt: x.id === 'visitas' ? 'a-r6-visitas' : null, lead: vivo.anillo({veces: x.veces, tam: 's'}), titulo: x.titulo,
        sub: prueba ? dv.prueba : 'Esto lo has hecho ' + x.veces + ' veces. ¿Lo hago yo?', enlace: 'Enséñame los casos', ir: x.ir});
    });
    if (pro) h += UI.bloque({titulo: '¿Lo hago yo?', i: 4, html: `<div class="a-r6-lista">${pro}</div>`});
    return h;
  }

  function lineaEnSitio(q) {
    const s = A.seq(); let h = '';
    const u = M.ultima(q);
    if (u && u.orden === s) {
      h += UI.lineaCosa(u);
      const ac = (DA().acta || {}).elena;
      if (u.id === 'c-elena' && u.estado === 'hecha' && ac && !A.sinTareaElena())
        h += UI.lineaHecho({texto: ac.lineaTarea, boton: {texto: 'Deshacer', accion: 'sin-tarea-elena'}});
    }
    const l = A.locales().find(t => t.quien === q && t.seq === s && t.hecha);
    if (l) h += UI.lineaHecho({texto: l.linea, hora: l.hora, vt: 'a-' + l.id, boton: {texto: 'Deshacer', accion: 'deshacer-local', de: l.id}});
    return h ? `<div class="a-sitio" data-i="1">${h}</div>` : '';
  }


  function medias() {
    const d = A.dictado(); if (!d) return '';
    return `<div class="hecho a-medias" data-i="2"><div class="hecho-a">${ic('mic', 20)}<span class="hecho-txt">Dictado a medias <span class="hecho-h">(${esc(A.mmss(d.seg))})</span></span></div>` +
      UI.boton({tipo: 'texto', texto: 'Seguir', ir: 'dictar/' + d.guion, ancho: false}) + UI.boton({tipo: 'texto', texto: 'Borrar', accion: 'borrar-dictado', ancho: false}) + '</div>';
  }


  function vacia(q, cola) {
    const hechas = A.hechas(q), enCola = cola.filter(c => HECHAS.includes(c.estado)).length;
    const nMan = M.manana(q).length, cerrado = VETA.est.lee('a.cerrado', null);
    let h = '';
    if (cerrado) h += `<div class="a-sitio" data-i="0">${UI.lineaHecho({texto: 'Día cerrado · Cola nueva mañana a las 8:00', boton: {texto: 'Deshacer', accion: 'abrir-dia'}})}</div>`;
    h += aprender() + reabiertas();
    h += `<div class="a-fin" data-i="0"><span class="a-fin-ic">${ic('check', 28)}</span><h2 class="a-fin-t">Eso es todo por hoy</h2>` +
      `<p class="a-fin-x">${esc(plural(enCola, 'hecha', 'hechas') + ' · ' + manana(nMan))}</p></div>`;
    if (hechas.length) {
      const ult = hechas.slice(-5), u = M.ultima(q);
      h += UI.bloque({titulo: 'Hecho hoy', i: 2, html: `<div class="a-dia">${ult.map(x => `<div class="a-dia-l"${u && x.id === u.id ? ` data-vt="cola-${esc(x.id)}"` : ''}>` +
        `<span class="a-dia-h">${esc(x.hora || '')}</span><span class="a-dia-t">${esc(x.texto)}</span></div>`).join('')}</div>` +
        `<button type="button" class="enlace" data-hoja="h05">Ver las ${hechas.length} ›</button>`});
    }
    return h + (q === 'laura' ? bloques(q) : UI.lista([{titulo: 'Lo que vigilo por ti', sub: plural(A.esperaPend(q).length, 'cosa', 'cosas'), icono: 'reloj', ir: 'espera'}], {i: 3}));
  }

  VETA.pantalla('A1', {
    guia: ['Aquí Veta te deja el día en orden: lo primero, arriba.', 'Tú envías, dictas o lo dejas para luego. Si cambias algo, Veta te pregunta si lo hace siempre así.', 'Así cada semana te tocan menos cosas, y las que deja de hacer las has decidido tú.'],
    pinta: () => {
      const q = A.q(), cola = M.cola(q), yo = q === 'laura';
      const pend = cola.filter(c => PEND.includes(c.estado));
      const fecha = (VETA.datos.fecha || {}).hoyTexto || 'lunes 23 de noviembre';
      let h = yo ? arriba(q) : `<button type="button" class="a-leido" data-hoja="h04" data-i="0" data-g="Lo que he leído|Qué canales he mirado y qué he encontrado hoy.">` +
        `<span>${esc(fecha)} · Leído hasta las ${esc(VETA.ahora(-3))}</span><span class="a-leido-c">${ic('chev', 16)}</span></button>`;
      if (!pend.length) return h + vacia(q, cola);
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
        filas.push({titulo: 'Y ' + sinPrisa.length + ' más, sin prisa', sub: sinPrisa.map(x => x.titulo).join(' · '), av: s.cliente, ir: 'cliente/' + s.cliente, vt: 'cola-' + s.id, focoFoto: true});
      }
      // Laura: lo que espera turno va recogido en una línea, para que «Esto lo hago yo» asome sin desplazar
      const mas = resto.concat(sinPrisa), abre = !yo || E('resto', false);
      if (yo && mas.length) h += `<button type="button" class="a-r6-mas" data-accion="r6-resto" aria-expanded="${abre ? 'true' : 'false'}" data-i="2">` +
        `<span class="a-r6-mas-av">${mas.slice(0, 3).map(x => VETA.av(x.av || x.cliente, 32)).join('')}</span>` +
        `<span class="a-r6-mas-t">Y ${mas.length} más</span><span class="chev-gira">${ic('chev', 16)}</span></button>`;
      if (abre && resto.length) h += `<div class="a-filas" data-i="2">${UI.lista(resto.map(c => (c.extra || {}).r6 ? UI.fila({titulo: c.fila || c.titulo, sub: 'Ya cambiado con lo que me has enseñado', av: c.cliente, ir: 'cliente/' + c.cliente, vt: 'cola-' + c.id, focoFoto: true}) : UI.filaCosa(c)))}</div>`;
      if (yo) h += reabiertas();
      const pies = abre ? filas : [];
      const hechas = A.hechas(q), enSitio = (lineaEnSitio(q).match(/class="hecho"/g) || []).length, nMan = M.manana(q).length;
      if (hechas.length > enSitio || nMan) pies.push({titulo: plural(hechas.length, 'hecha hoy', 'hechas hoy'), sub: nMan ? manana(nMan) : null, icono: 'check', hoja: 'h05'});
      if (!yo) pies.push({titulo: 'Lo que vigilo por ti', sub: plural(A.esperaPend(q).length, 'cosa', 'cosas'), icono: 'reloj', ir: 'espera'});
      if (pies.length) h += UI.lista(pies, {i: 3, clase: 'a-pies'});
      if (yo) h += bloques(q);
      return h;
    },
    botonFijo: () => {
      const q = A.q();
      if (VETA.r6.tocan(q).quedan || VETA.est.lee('a.cerrado', null)) return '';
      return UI.boton({texto: 'Cerrar el día', accion: 'cerrar-dia', g: 'Cerrar el día|Te enseño cómo queda y lo que pasa a mañana.'});
    },
    alMontar: el => {
      // lo que cambió en la pestaña Veta: si se olvidó lo aprendido, el mensaje siguiente vuelve a ser el de antes;
      // si la regla de las visitas subió, su fila se muda de bloque a la vista
      if (A.q() === 'laura') {
        const k = E('cambio');
        if (!r6.siempre()) { let toca = A.r6.limpia(); if (k && k.resuelto === 'siempre') { P('cambio', null); toca = true; } if (toca) { VETA.repinta(); return; } }
        const real = r6.reglaVisitas();
        if (real !== E('visitasVista', 'propuesta')) setTimeout(() => {
          if (!el.isConnected) return; P('visitasVista', real);
          const f = el.querySelector('[data-vt="a-r6-visitas"]'); if (f && f.scrollIntoView) f.scrollIntoView({block: 'center'});
          VETA.repinta({paso: true});
        }, 500);
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
      'sin-tarea-elena'() { VETA.est.pon('a.sinTareaElena', true); VETA.repinta(); VETA.aviso('La llamada a Elena ya no está apuntada.', {deshacer: () => { VETA.est.pon('a.sinTareaElena', false); VETA.repinta(); }}); },
      'deshacer-local'(ev, el) { A.quitaLocal(el.dataset.de); VETA.repinta(); },
      'borrar-dictado'() { VETA.est.pon('a.dictado', null); VETA.repinta(); },
      'cerrar-dia'() { VETA.est.pon('a.cerrado', VETA.ahora()); VETA.repinta(); VETA.hoja('h06'); },
      'abrir-dia'() { VETA.est.pon('a.cerrado', null); VETA.repinta(); },
      'r6-resto'() { P('resto', !E('resto', false)); VETA.repinta(); },
      // «Sí, siempre» · «Solo con Marta» · «Solo esta vez»
      'r6-aprende'(ev, el) {
        const k = E('cambio'), c = k && M.cosa(k.id); if (!c) return;
        const amb = el.dataset.ambito;
        if (amb === 'vez') { P('cambio', null); VETA.repinta({paso: true}); VETA.aviso('Vale. Solo esta vez.'); return; }
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
        P('abiertas', ab); VETA.repinta({paso: true}); VETA.aviso('Vale. No lo cierro sin preguntarte.');
        // vuelve a su lista: se sube para verlo arriba, con la cifra ya cambiada
        setTimeout(() => { const d = document.querySelector('.col.activa .desplaza'); if (d) d.scrollTo({top: 0, behavior: calmo() ? 'auto' : 'smooth'}); }, 350);
      },
      // «Ciérralo tú»: Laura se lo devuelve a Veta
      'r6-recierra'(ev, el) { P('abiertas', E('abiertas', []).filter(x => x !== el.dataset.de)); VETA.repinta({paso: true}); VETA.aviso('Hecho. Lo cierro yo.'); },
      // la tira dorada lleva a lo que Veta ha cerrado, más abajo en «Esto lo hago yo»
      'r6-cerradas'() { const f = document.querySelector('.col.activa .a-r6-cerrada'); if (f) f.scrollIntoView({block: 'center', behavior: calmo() ? 'auto' : 'smooth'}); }
    }
  });
})();
