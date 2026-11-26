/* Veta demo · ronda 8 · pantallas · hoy.js · carril A (El día)
   · El Inicio de la agente (gancho VETA.inicioDe.agente): «lo primero» con su botón, la lista del resto y la fila «Veta ha hecho hoy».
     Lo que se resuelve se va de la lista a la vista (VETA.mov.seVa) y, cuando no queda nada, la frase sola (r7.vacio).
   · A1 · Te toca a ti · #/hoy: para dirección, su día como detalle (lo mismo, más «Tu semana»). La agente va a Inicio.
   · A23 · #/toca/:id: una cosa de hoy (el mensaje de la persona, el que deja escrito Veta y un botón).
   Además, VETA.A: lo que comparten las pantallas y hojas del carril (tareas y notas guardadas desde lo dictado, el dictado a medias,
   lo que Veta aprende de un mensaje cambiado y el «principal» con el 409 de Jordi). */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc;
  const PEND = ['por-hacer', 'pregunta-envio'];

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
    if (c.estado === 'enviada') return c.tipo === 'informe' && (c.lineas || {}).enviada ? c.lineas.enviada : 'Enviado a ' + c.titulo;   // el de Pere dice cuál: «Informe de la semana enviado a Pere»
    if (c.tipo === 'visita' && c.estado === 'hecha') return 'Acta de la visita de ' + c.titulo;
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
    const fin = w => /[.!?]$/.test(w);
    let pi = i; while (pi > 0 && i - pi < 6 && !fin(a[pi - 1])) pi--;
    let pf = a.length - j; while (pf < a.length && pf - (a.length - j) < 6 && !(pf > a.length - j && fin(a[pf - 1]))) pf++;
    const pre = a.slice(pi, i), post = a.slice(a.length - j, pf);
    const lado = (sig, env) => {
      const out = []; let run = [];
      const cierra = () => { if (run.length) { out.push(env(run.join(' '))); run = []; } };
      ops.forEach(([o, w]) => { if (o === sig) run.push(w); else if (o === '=') { cierra(); out.push(esc(w)); } });
      cierra();
      return pre.map(esc).concat(out, post.map(esc)).join(' ');
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

  // ---- el día: lo que te toca (Inicio de la agente y A1 de dirección) y una cosa de hoy (A23, #/toca/:id) ----
  const R7 = VETA.r7;
  const P7 = () => (VETA.datos.r7a1 || {}), pal = c => ((P7().cosas || {})[c.id]) || {};
  const pendientes = q => M.cola(q).filter(c => PEND.includes(c.estado));
  const abiertas = () => E('abiertas', []);
  const cerradas = () => (R6().cerradas || []).filter(x => !abiertas().includes(x.id));
  const reabiertas = q => q === 'laura' ? (R6().cerradas || []).filter(x => abiertas().includes(x.id)) : [];
  const cerrado = () => VETA.est.lee('a.cerrado', null);
  A.cerradas = q => (q === 'laura' ? cerradas() : []);
  A.reabre = id => { const ab = abiertas(); if (!ab.includes(id)) ab.push(id); P('abiertas', ab); };

  // lo que dirección le pregunta: cuenta en la lista hasta que dices «Ya le he contestado» (clave a.r6.contestadas)
  const idPreg = x => x.op + '|' + x.hora + '|' + x.texto;
  A.idPreg = idPreg;
  A.preguntas = q => (r6.preguntas ? r6.preguntas(q) : []).filter(x => !E('contestadas', []).includes(idPreg(x)));
  A.contesta = k => P('contestadas', E('contestadas', []).concat([k]));

  // la cosa de una tarjeta: una de la lista, lo que Veta cerró y has vuelto a abrir (x-…), o la que toca de un cliente (toca/marta)
  function cosaDe(id) {
    const c = M.cosa(id); if (c) return c;
    const x = (R6().cerradas || []).find(y => y.id === id);
    if (x) return {id: x.id, reabierta: true, cliente: x.cliente, titulo: x.cliente ? ((M.quien(x.cliente) || {}).nombre || x.tuya) : x.tuya, corto: x.corto, x, estado: abiertas().includes(x.id) ? 'por-hacer' : 'hecha'};
    const q = A.q(), l = M.cola(q).filter(y => y.cliente === id);
    return l.find(y => PEND.includes(y.estado)) || l[0] || null;
  }
  const nombreCorto = c => c.corto && !/\s/.test(c.corto) ? c.corto : String(c.titulo || '').split(' ')[0];
  const rutaDe = c => pal(c).ir || 'toca/' + c.id;
  const borradorDe = c => { const x = c.extra || {}; return x.borradorHtml ? {html: x.borradorHtml} : (x.borrador || c.borrador) ? {texto: String(x.borrador || c.borrador).replace(/<[^>]+>/g, '')} : null; };

  // la siguiente que te toca, por el orden de la lista (si Veta acaba de cambiar un mensaje con lo aprendido, esa)
  function siguiente(c) {
    const q = A.q(), cola = M.cola(q), l = pendientes(q).filter(y => y.id !== c.id);
    const k = E('cambio'), ap = R6().aplica, sig = ap && k && k.id === c.id && k.resuelto === 'siempre' && M.cosa(ap.cosa);
    if (sig && PEND.includes(sig.estado) && (sig.extra || {}).r6) return sig;
    const i = cola.findIndex(y => y.id === c.id);
    return l.find(y => cola.indexOf(y) > i) || l[0] || null;
  }

  // «¿Lo escribo siempre así?»: toca preguntarlo cuando el mensaje que salió no era el mío
  const porAprender = c => { const k = E('cambio'); return k && k.id === c.id && c.estado === 'enviada' && !k.resuelto ? k : null; };
  const aprendido = c => { const k = E('cambio'); return k && k.id === c.id && k.resuelto && k.seq === A.seq() ? k : null; };

  // ---- el día: «lo primero» con su botón, la lista del resto y lo de Veta ----
  // una fila por cosa. La pastilla, solo roja y solo si nadie ha contestado; lo demás lo dice la segunda línea
  function filaCosa(c) {
    const d = pal(c), x = c.extra || {}, preg = c.estado === 'pregunta-envio';
    const pasa = preg ? '¿Lo enviaste? Dímelo aquí' : x.r6 ? 'Ya cambiado con lo que me enseñaste' : x.cambiado ? 'Te ha vuelto a escribir' : (d.pasa || c.filaSub || '');
    const boton = preg ? 'Abrir' : c.tipo === 'visita' || d.ir ? 'Abrir la visita' : borradorDe(c) ? 'Ver mi respuesta' : 'Abrir';
    return {cara: c.av || c.cliente || null, nombre: c.titulo, pasa, pastilla: !preg && !x.r6 && d.tono === 'rojo' ? d.pastilla : null, ir: rutaDe(c), boton};
  }
  const cuantas = (n, uno, varias) => (n === 1 ? uno : varias);
  // «Veta ha hecho hoy»: lo que Veta cerró sola, lo que vigila y lo que ha leído, en una fila que abre su hoja
  function deVeta(q) {
    const nc = A.cerradas(q).length, nv = A.esperaPend(q).length, nl = ((M.lectura() || {}).hoy || {}).chats || 0;
    const t = [];
    if (nc) t.push(cuantas(nc, '1 cerrada', `${nc} cerradas`));
    if (nv) t.push(cuantas(nv, '1 vigilada', `${nv} vigiladas`));
    if (nl) t.push(cuantas(nl, '1 chat leído', `${nl} chats leídos`));
    return {nombre: 'Veta ha hecho hoy', pasa: t.join(' · '), hoja: 'r8-hoy'};
  }
  // las filas que solo salen cuando ocurren, de una línea: cada una abre su hoja
  function ocasionales(q) {
    const l = [], dic = A.dictado(), hechas = A.hechas(q);
    if (dic) l.push({nombre: 'Lo que me contabas', dato: A.mmss(dic.seg), hoja: 'r8-dictado'});
    A.preguntas(q).forEach(x => l.push({cara: 'montse', nombre: (((VETA.datos.personas || {}).montse || {}).corto || 'Montse') + ' te pregunta', hoja: 'r8-pregunta', datos: {k: idPreg(x)}}));
    if (hechas.length) l.push({nombre: 'Lo que has hecho hoy', dato: hechas.length, hoja: 'h05'});
    if (cerrado()) l.push({nombre: 'Día cerrado', hoja: 'r8-dia'});
    return l;
  }
  // lo que el día enseñaba la última vez, por persona. Lo que ya no esté pendiente se pinta una vez más en su sitio y se va a la vista
  // (VETA.mov.seVa, desde montaDia): se ve qué ha pasado sin leer nada. Con «Reducir movimiento», o si son más de tres, no se pinta.
  const vistas = {};
  const idasDe = (q, ids) => { const l = VETA.reducido() ? [] : (vistas[q] || []).filter(id => !ids.includes(id) && M.cosa(id)); return l.length <= 3 ? l : []; };
  const nadaQueda = q => !pendientes(q).length && !reabiertas(q).length && !R7.cuentas().hoy && (!!cerrado() || A.hechas(q).length > 0);
  // semana: la fila «Tu semana» del día de dirección (A1)
  function cuerpoDia(q, semana) {
    const pend = pendientes(q), ids = pend.map(c => c.id), antes = vistas[q] || [], idas = idasDe(q, ids);
    const l = pend.map(filaCosa);
    reabiertas(q).forEach(x => l.push({cara: x.cliente || null, nombre: x.cliente ? ((M.quien(x.cliente) || {}).nombre || x.tuya) : x.tuya, pasa: 'Lo vuelves a llevar tú', ir: 'toca/' + x.id, boton: 'Abrir'}));
    const uno = l[0], resto = l.slice(1).map(f => Object.assign({}, f, {boton: null}));
    // lo que se va: lo que era «lo primero», como tarjeta encima; lo demás, como fila en el sitio que tenía
    let ida1 = '';
    idas.forEach(id => {
      const f = Object.assign(filaCosa(M.cosa(id)), {pastilla: null});
      if (id === antes[0]) { ida1 = R7.primero({clase: 'a1-ida', cara: f.cara, nombre: f.nombre, pasa: f.pasa, boton: {texto: f.boton}}); return; }
      const delante = antes.slice(0, antes.indexOf(id)).filter(x => ids.includes(x)).length;
      resto.splice(Math.max(0, Math.min(resto.length, delante - 1)), 0, {cara: f.cara, nombre: f.nombre, pasa: f.pasa, clase: 'a1-ida'});
    });
    // «lo primero» se abre con su botón o tocando la tarjeta entera (data-ir en la tarjeta, como una fila)
    return ida1 + (uno ? R7.primero({i: 0, cara: uno.cara, nombre: uno.nombre, pasa: uno.pasa, pastilla: uno.pastilla, boton: {texto: uno.boton, ir: uno.ir}, datos: {ir: uno.ir}}) : '') +
      (resto.length ? R7.lista(resto, {i: 1}) : '') +
      // el final del día: la frase sola, en mitad de lo que queda de pantalla (arriba se dice otra cosa, para no repetirla)
      (nadaQueda(q) ? R7.vacio({i: 1, texto: 'Hoy ya no te toca nada.'}) : '') +
      R7.lista([deVeta(q)].concat(semana ? [{nombre: 'Tu semana', ir: 'semana'}] : [], ocasionales(q)), {i: 2});
  }
  const fraseDia = () => {
    if (cerrado()) return 'Día cerrado. Mañana a las 8:00, lista nueva.';
    const n = R7.cuentas().hoy;
    return n > 1 ? `Hoy te tocan ${n} cosas.` : n === 1 ? 'Hoy te toca 1 cosa.' : nadaQueda(A.q()) ? 'Puedes cerrar el día.' : 'Hoy ya no te toca nada.';
  };
  // con 0 cosas (y el día sin cerrar), el pie ofrece cerrarlo
  const pieDia = q => (R7.cuentas().hoy || cerrado() || !M.cola(q).length ? '' : R7.botones({texto: 'Cerrar el día', accion: 'cerrar-dia'}));

  // si en Veta se olvidó lo aprendido, el mensaje que Veta cambió vuelve a ser el de antes
  function alDia() {
    if (A.q() !== 'laura' || r6.siempre()) return false;
    const k = E('cambio'); let toca = A.r6.limpia();
    if (k && k.resuelto === 'siempre') { P('cambio', null); toca = true; }
    return toca;
  }
  const accionesDia = {
    'cerrar-dia'() { VETA.est.pon('a.cerrado', VETA.ahora()); VETA.repinta(); VETA.hoja('h06'); }
  };
  // al montar: lo resuelto se va (la tarjeta o la fila se encoge y las demás suben) y se apunta lo que queda a la vista
  function montaDia(el) {
    if (alDia()) { VETA.repinta(); return; }
    const q = A.q(), ids = pendientes(q).map(c => c.id), raiz = el && el.querySelectorAll ? el : document;
    const idas = Array.prototype.slice.call(raiz.querySelectorAll('.a1-ida'));
    if (!idas.length) { vistas[q] = ids; return; }
    // un momento para que se vea lo que había, y fuera
    setTimeout(() => {
      vistas[q] = pendientes(q).map(c => c.id);
      idas.forEach(x => {
        const sola = x.parentNode && x.parentNode.classList.contains('r7-lista') && x.parentNode.children.length === 1 ? x.parentNode : x;
        VETA.mov.seVa(x, () => { if (sola.parentNode) sola.parentNode.removeChild(sola); });
      });
    }, 420);
  }

  // ---- Hoy (Inicio de la agente): «tu día», una pila de tarjetas que se recorre deslizando, una cosa cada vez ----
  // Cada tarjeta lleva el botón que ya tenía esa cosa (su ruta). Completar es lo de siempre: se resuelve en su pantalla (M.marca) y, al volver,
  // la tarjeta se marca, sube y se va (hy-ida + hy-sale) y la cosa pasa a lo hecho (hoja h05, con su «Deshacer»). El único indicador son los puntos de
  // debajo de la tarjeta; el número de lo que queda y el enlace a lo hecho viven en una sola línea de la cabecera. No hay estado nuevo salvo el índice (de sesión).
  const HY = {indice: 0};
  const V = () => VETA.v, UA = VETA.UI.attrs;
  const personaDe = x => (x.cliente ? x.cliente : {id: x.id, nombre: x.nombre});
  // la única línea de la tarjeta; la visita dice la hora y la calle («Visita hoy, 9:00 · Verdi 42»), que es lo que se mira yendo a ella
  function pasaTarjeta(c, pasa) {
    const calle = String(c.pisoTexto || '').split(' · ').pop().split(',')[0].replace(/^c\/\s*/, '').trim();
    return c.tipo === 'visita' && c.horaVisita && calle ? `Visita hoy, ${c.horaVisita} · ${calle}` : pasa;
  }
  // lo que se pinta de una cosa: de la lista (c) o de lo que Veta cerró y has vuelto a abrir (x-…)
  function datosTarjeta(c, ida) {
    if (c.reabierta) {
      const nom = c.cliente ? ((M.quien(c.cliente) || {}).nombre || c.titulo) : c.titulo;
      return {id: c.id, rotulo: 'Veta', persona: personaDe({cliente: c.cliente, id: c.id, nombre: nom}), nombre: nom, pasa: 'Lo vuelves a llevar tú', ir: 'toca/' + c.id, boton: 'Abrir', ida};
    }
    const f = filaCosa(c), t = V().tipo(c.tipo);
    return {id: c.id, rotulo: t.rotulo, persona: personaDe({cliente: c.cliente, id: c.id, nombre: c.titulo}), nombre: c.titulo, pasa: pasaTarjeta(c, f.pasa), urgente: f.pastilla, ir: f.ir, boton: f.boton, ida};
  }
  // la tarjeta: el verbo en pequeño (y, si urge, su punto rojo), la persona con lo que quiere y el botón. Nada más
  function tarjetaHoy(d) {
    const ic = VETA.ic;
    return `<article class="hy-tj${d.ida ? ' hy-ida' : ''}" data-hy-id="${esc(d.id)}"${d.ida ? '' : UA({ir: d.ir})}>` +
      `<div class="hy-tj-arr"><span class="hy-tj-tipo">${esc(d.rotulo)}</span>${d.urgente ? `<span class="hy-tj-urg"><i aria-hidden="true"></i>${esc(d.urgente)}</span>` : ''}</div>` +
      `<div class="hy-tj-quien">${V().cara(d.persona, {tam: 56, aro: false})}<div class="hy-tj-tx"><h2 class="hy-tj-nom">${esc(d.nombre)}</h2><p class="hy-tj-pasa">${esc(d.pasa)}</p></div></div>` +
      `<button type="button" class="v-btn v-btn-oro hy-tj-btn"${d.ida ? ' tabindex="-1" aria-hidden="true"' : UA({ir: d.ir})}><span>${esc(d.boton)}</span>${ic('flecha', 22)}</button>` +
      (d.ida ? `<span class="hy-tj-ok" aria-hidden="true">${ic('check', 28)}</span>` : '') + '</article>';
  }
  // el único indicador: puntos juntos, como el control de páginas de iOS (el actual, una píldora; con más de 7, solo hay 7 y los de los extremos se hacen pequeños).
  // Los puntos no se tocan uno a uno: debajo van dos zonas invisibles de 44 × 44 como mínimo, la mitad izquierda = anterior y la derecha = siguiente
  function puntosDentro(l, idAct) {
    const n = l.length, a = Math.max(0, l.findIndex(x => x.id === idAct));
    const ini = n > 7 ? Math.max(0, Math.min(a - 3, n - 7)) : 0, fin = n > 7 ? ini + 7 : n;
    return l.slice(ini, fin).map((x, k) => { const j = ini + k, peq = (j === ini && ini > 0) || (j === fin - 1 && fin < n);
      return `<i class="hy-pt${peq ? ' hy-pt-peq' : ''}" role="img" aria-label="${esc(x.nombre)}"${j === a ? ' aria-current="true"' : ''}></i>`; }).join('');
  }
  function controlPuntos(l, idAct) {
    const a = Math.max(0, l.findIndex(x => x.id === idAct));
    // la zona que no tiene adónde ir no se ofrece (hidden: ni se pinta ni recibe toques); si tenía el foco, antes pasa a la otra (montaAgente)
    return `<div class="hy-pts-d">${puntosDentro(l, idAct)}</div><span class="hy-pos solo-lector" aria-live="polite" aria-atomic="true"></span>` +
      `<button type="button" class="hy-ir hy-ir-ant" data-hy-ir="-1" aria-label="${esc('Anterior')}"${a < 1 ? ' hidden' : ''}></button>` +
      `<button type="button" class="hy-ir hy-ir-sig" data-hy-ir="1" aria-label="${esc('Siguiente')}"${a >= l.length - 1 ? ' hidden' : ''}></button>`;
  }
  // lo que hay en la pila: las pendientes y lo que Veta cerró y has vuelto a abrir (las mismas tarjetas que cuentan los puntos)
  const enPila = q => pendientes(q).length + reabiertas(q).length;
  // la línea de la cabecera: lo que queda (tantas cosas como tarjetas) y, a un toque, lo hecho (con su «Deshacer»). Es la única que dice cuántas quedan
  function lineaHoy(q) {
    const n = enPila(q), h = A.hechas(q).length;
    if (!n) return esc(cerrado() ? 'Día cerrado. Mañana a las 8:00, lista nueva.' : h ? 'Todo hecho por hoy.' : 'Hoy ya no te toca nada.');
    const quedan = n === 1 ? 'Te queda 1 cosa' : `Te quedan ${n} cosas`;
    const hechas = h ? ' · ' + `<button type="button" class="hy-hechas"${UA({hoja: 'h05'})}>${esc(h === 1 ? '1 hecha' : `${h} hechas`)}</button>` : '';
    return esc(quedan) + hechas;
  }
  // «Veta ha hecho hoy»: una fila tranquila, de una línea, con lo que cerró y lo que vigila; sigue abriendo su hoja (de ahí: lo cerrado con «Deshacer», lo que vigila y los chats leídos)
  function filaVeta(q) {
    const nc = A.cerradas(q).length, nv = A.esperaPend(q).length, t = [];
    if (nc) t.push(`ha cerrado ${nc}`);
    if (nv) t.push(`vigila ${nv}`);
    const dice = !t.length ? 'Veta ha hecho hoy' : t.length === 1 ? `Veta ${t[0]}` : `Veta ${t[0]} y ${t[1]}`;
    return `<button type="button" class="hy-veta"${UA({hoja: 'r8-hoy'})}><span class="hy-veta-ic" aria-hidden="true">${VETA.ic('aprende', 20)}</span><span class="hy-veta-tx">${esc(dice)}</span><span class="hy-veta-ir" aria-hidden="true">${VETA.ic('flecha', 20)}</span></button>`;
  }
  function cuerpoAgente(q) {
    const cola = M.cola(q), pend = pendientes(q), ids = pend.map(c => c.id), idas = idasDe(q, ids), reab = reabiertas(q);
    // tarjetas pendientes en el orden de la lista (las que se van, en el sitio que tenían), y al final lo que Veta cerró y has vuelto a abrir
    const tarjetas = cola.filter(c => ids.includes(c.id) || idas.includes(c.id)).map(c => datosTarjeta(c, !ids.includes(c.id)))
      .concat(reab.map(x => datosTarjeta(cosaDe(x.id), false)));
    const reales = tarjetas.filter(t => !t.ida);
    const actual = Math.min(HY.indice, Math.max(0, tarjetas.length - 1)), idAct = (reales.find((t, i) => tarjetas.indexOf(t) >= actual) || reales[reales.length - 1] || {}).id;
    const fin = `<article class="hy-fin"><span class="hy-fin-ok" aria-hidden="true">${VETA.ic('check', 34)}</span>` + (cerrado() ? '' : `<p>${esc('Si entra algo, te lo pongo aquí.')}</p>`) +
      (A.hechas(q).length ? `<button type="button" class="hy-hechas hy-hechas-fin"${UA({hoja: 'h05'})}>Ver lo hecho</button>` : '') + '</article>';
    const car = tarjetas.length ? V().carrusel({id: 'hy-car', tarjetas: tarjetas.map(tarjetaHoy), indice: actual, etiqueta: 'Tu día', indicador: false}) +
      `<div class="hy-pts" role="group" aria-label="${esc('Posición')}"${reales.length < 2 ? ' hidden' : ''}>${controlPuntos(reales.map(t => ({id: t.id, nombre: t.nombre})), idAct)}</div>` : fin;
    // lo que haya debajo: solo lo que ocurre. «Lo que has hecho hoy» ya no repite fila: es el enlace «N hechas» de la cabecera
    const oc = ocasionales(q).filter(f => f.hoja !== 'h05');
    return `<section class="hy-pila">${car}</section>` + filaVeta(q) + (oc.length ? R7.lista(oc, {i: 2}) : '');
  }
  function montaAgente(el) {
    if (alDia()) { VETA.repinta(); return; }
    const q = A.q(), ids = pendientes(q).map(c => c.id), raiz = el && el.querySelector ? el : document;
    const cajaCar = raiz.querySelector('#hy-car'), pts = raiz.querySelector('.hy-pts');
    const items = () => (cajaCar ? Array.from(cajaCar.querySelectorAll('.v-car-it:not(.v-cierra)')) : []);
    const idDe = it => { const a = it && it.querySelector('[data-hy-id]'); return a ? a.dataset.hyId : null; };
    const esIda = it => !!(it && it.querySelector('.hy-ida'));
    const reales = () => items().filter(it => !esIda(it)).map(it => ({id: idDe(it), nombre: (it.querySelector('.hy-tj-nom') || {}).textContent || ''}));
    // la tarjeta marcada: la actual o, si esa se está yendo, la que ocupará su sitio. Solo la marcada se abre al tocarla; las demás, al tocarlas, se acercan
    let viva = null, destino = null, marcada = null;
    const sigReal = i => { const l = items(); return l.slice(i).find(it => !esIda(it)) || l.slice(0, i).reverse().find(it => !esIda(it)); };
    const marca = (i, anuncia) => {
      const sig = sigReal(i); items().forEach(it => it.classList.toggle('hy-act', it === sig));
      if (!pts) return; const r = reales(); if (!r.length) { pts.hidden = true; return; }
      marcada = idDe(sig); pts.hidden = r.length < 2;
      const k = r.findIndex(x => x.id === marcada), ant = pts.querySelector('[data-hy-ir="-1"]'), sg = pts.querySelector('[data-hy-ir="1"]'), pos = pts.querySelector('.hy-pos');
      pts.querySelector('.hy-pts-d').innerHTML = puntosDentro(r, marcada);
      // primero se ofrece la que toca y después se retira la que no tiene destino; si esa tenía el foco, el foco pasa a la otra (nunca cae a <body>)
      const offA = k < 1, offS = k >= r.length - 1;
      if (ant && !offA) ant.hidden = false; if (sg && !offS) sg.hidden = false;
      if (ant && offA) { if (document.activeElement === ant && sg && !sg.hidden) sg.focus(); ant.hidden = true; }
      if (sg && offS) { if (document.activeElement === sg && ant && !ant.hidden) ant.focus(); sg.hidden = true; }
      if (anuncia && pos && k >= 0) pos.textContent = `${k + 1} de ${r.length}`;   // para el lector de pantalla: no se pinta
    };
    if (cajaCar) viva = V().carruselVivo(cajaCar, {indicador: false, alCambiar: i => {
      const it = items()[i]; if (!it) return;
      if (destino) { if (idDe(it) !== destino) return; destino = null; }   // yendo a donde se ha tocado: no se enseñan las tarjetas de por medio
      if (!esIda(it)) HY.indice = i;
      marca(i, !esIda(it));
    }});
    if (viva) marca(viva.indice(), false);
    const ve = i => { HY.indice = i; destino = idDe(items()[i]); setTimeout(() => { destino = null; }, 900); marca(i, true); viva.irA(i); };
    // las dos zonas de debajo de los puntos: anterior y siguiente (entre las tarjetas que no se van)
    if (pts && viva) pts.addEventListener('click', ev => {
      const b = ev.target.closest('[data-hy-ir]'); if (!b) return;
      const r = reales(), meta = r[r.findIndex(x => x.id === marcada) + (+b.dataset.hyIr)]; if (!meta) return;
      const i = items().findIndex(it => idDe(it) === meta.id); if (i >= 0) ve(i);
    });
    // tocar lo que asoma de la tarjeta siguiente la acerca, no abre una cosa que no se ha visto
    if (cajaCar && viva) cajaCar.addEventListener('click', ev => {
      const it = ev.target.closest('.v-car-it'); if (!it || it.classList.contains('hy-act') || esIda(it)) return;
      const i = items().indexOf(it); if (i >= 0) ve(i);
    });
    const idas = Array.prototype.slice.call(raiz.querySelectorAll('.hy-ida'));
    if (!idas.length) { vistas[q] = ids; return; }
    // lo hecho se marca, sube y se va (< 300 ms, en CSS: .hy-sale); las demás ocupan su sitio, el punto desaparece y la línea de la cabecera ya dice lo que queda.
    // Sin movimiento no hay tarjetas que se vayan (idasDe), así que aquí siempre hay animación.
    vistas[q] = pendientes(q).map(c => c.id);
    if (!viva) return;
    const sale = () => {
      const it = idas[0] && idas[0].closest('.v-car-it'); if (!it) { VETA.repinta(); return; }
      cajaCar.querySelector('.v-car').classList.add('v-car-quitando'); it.classList.add('hy-sale');
      setTimeout(() => {
        if (!cajaCar.isConnected) return;
        const i = items().indexOf(it); it.remove(); cajaCar.querySelector('.v-car').classList.remove('v-car-quitando');
        const n = items().length; idas.shift();
        if (!n) { VETA.repinta(); return; }
        const j = Math.min(Math.max(i, 0), n - 1); viva.irA(j, {rapido: true}); HY.indice = j; marca(j, true);
        if (idas.length) sale();
      }, 255);   // lo que dura .hy-sale (260 ms) menos un fotograma: el conjunto queda dentro de 300 ms aun con la máquina cargada
    };
    requestAnimationFrame(sale);
  }

  // el Inicio de la agente (la cáscara, la fecha y el saludo son de js/pantallas/inicio.js)
  VETA.inicioDe.agente = yo => ({
    html: cuerpoAgente(yo.id),
    fraseHtml: lineaHoy(yo.id),
    pie: pieDia(yo.id),
    acciones: accionesDia,
    alMontar: montaAgente
  });

  // A1 · para dirección, su día: lo mismo que el Inicio de la agente, más «Tu semana»
  VETA.pantalla('A1', {
    titulo: 'Te toca a ti',
    sub: fraseDia,
    pinta: () => cuerpoDia(A.q(), VETA.yo().papel === 'direccion'),
    botonFijo: () => pieDia(A.q()),
    alMontar: montaDia,
    acciones: accionesDia
  });

  // ---- A23 · una cosa de hoy ----
  function estadoDe(c) {
    if (!c) return 'nada';
    if (c.reabierta) return c.estado === 'por-hacer' ? 'reabierta' : 'cerrada';
    if (porAprender(c)) return 'aprender';
    if (c.estado === 'pregunta-envio') return 'preguntar';
    return PEND.includes(c.estado) ? 'toca' : 'hecha';
  }
  const tieneOtra = c => (c.secundarios || []).some(s => s.hoja === 'h02');
  const editar = c => (c.secundarios || []).find(s => s.ir && /^mensaje\//.test(s.ir));
  // el botón negro de la cosa y, si la cosa trae otra cosa que hacer (copiar otra vez, ver de dónde sale), su enlace
  function botonDe(c) {
    const d = pal(c), x = c.extra || {};
    if (d.ir) return {negro: {texto: 'Abrir la visita', ir: d.ir}, enlace: null};
    const b = Object.assign({}, c.boton || {}, x.boton || {}); if (!b.ir && !b.hoja && !b.accion) b.accion = 'principal';
    if (d.boton && !x.boton) b.texto = d.boton;
    const ed = editar(c);
    const otros = (x.secundarios || c.secundarios || []).filter(s => s.hoja !== 'h02' && s !== ed && !(s.ir && /^(cliente|mensaje)\//.test(s.ir)));
    // todo mensaje que deja escrito Veta se puede cambiar
    const enlace = otros[0] ? Object.assign({de: c.id}, otros[0]) : borradorDe(c) && b.accion === 'principal' ? {texto: 'Cambiar el mensaje', ir: 'mensaje/' + c.id} : null;
    return {negro: Object.assign({de: c.id}, b), enlace};
  }

  function cuerpoToca(c) {
    const d = pal(c), x = c.extra || {}, b = borradorDe(c);
    let h = c.cita ? R7.tarjeta({i: 0, de: c.cita.origen || c.titulo, texto: c.cita.texto}) : '';
    if (c.bloqueo) h += R7.tarjeta({i: 1, veta: true, de: 'Lo he mirado yo', texto: c.bloqueo});
    else if (b || c.resumen || c.encaja || c.momento) {
      const v = (x.aviso ? `<p class="a1-aviso">${esc(x.aviso)}</p>` : '') + (c.momento ? `<p>${esc(c.momento)}</p>` : '') + (c.encaja ? `<p>${esc(c.encaja.texto)}</p>` : '') +
        (c.resumen ? `<p>${esc(c.resumen)}</p>` : '') + (b ? `<p class="a1-msg">${b.html ? b.html : esc(b.texto)}</p>` : '');
      h += R7.tarjeta({i: 1, veta: true, de: d.hecho || (b ? 'Te lo dejo escrito' : 'Lo que sé'), html: v});
    }
    const e = botonDe(c).enlace;
    return h + (e ? R7.enlace(Object.assign({i: 2}, e)) : '');
  }

  function cuerpoHecha(c) {
    const sale = c.estado === 'enviada', k = aprendido(c);
    // el final (regla del núcleo): ✓ + qué + hora + «Deshacer» (si salió un mensaje, deshacer es «no lo envié»)
    let h = R7.hecho({texto: (c.extra || {}).linea || (c.lineas || {})[c.estado] || (sale ? 'Enviado a ' + nombreCorto(c) : 'Hecho'), hora: c.estado !== 'para-manana' ? c.hora : null,
      deshacer: {accion: sale ? 'no-lo-envie' : 'deshacer', de: c.id}});
    if (k) {
      const t = A.tipoCambio(k.antes, k.ahora), d = A.dif(k.antes, k.ahora), ap = R6().aplica, sig = k.resuelto === 'siempre' && ap && M.cosa(ap.cosa);
      const que = k.resuelto !== 'siempre' ? vivo.oro('Con ' + nombreCorto(c) + ' lo hago así') + '.'
        : t.tipo === 'dos-horas' ? vivo.oro(R6().aprendidoDosHoras) + '.'
        : d.ahora && /v-oro/.test(d.ahora) ? 'Desde ahora, en los mensajes como este escribo: «' + d.ahora + '»' : 'Desde ahora, en los mensajes como este quito: «' + d.antes + '»';
      const aplicado = sig && (sig.extra || {}).r6 && sig.estado === 'por-hacer';
      h += R7.tarjeta({i: 1, veta: true, vt: 'a-r6-apr', de: 'Aprendido', html: `<p>${que}</p>` +
        `<p>${aplicado ? 'Ya he cambiado el mensaje de ' + esc(ap.corto) + '.' : k.resuelto === 'siempre' ? 'Lo verás en el próximo mensaje como este.' : 'Lo verás en su próximo mensaje.'}</p>`});
    }
    if (sale) h += R7.lista([{nombre: 'Lo que enviaste', hoja: 'h03', de: c.id}], {i: 2});
    if (k) h += R7.enlace({i: 3, texto: 'Deshacer lo aprendido', accion: 'r6-desaprende'});
    return h;
  }

  // «¿Lo escribo siempre así?»: lo que cambiaste y tres respuestas (tres filas de elegir, sin pie)
  function cuerpoAprender(c, k) {
    const d = A.dif(k.antes, k.ahora), t = A.tipoCambio(k.antes, k.ahora);
    return R7.tarjeta({i: 0, veta: true, vt: 'a-r6-apr', clase: 'a1-dif', html: (d.quita ? `<span class="r7-ficha-de">Yo puse</span><p>${d.antes}</p>` : '') + `<span class="r7-ficha-de">Tú has puesto</span><p>${d.ahora}</p>`}) +
      R7.elegir([{id: 'siempre', texto: t.si}, {id: 'cliente', texto: 'Solo con ' + nombreCorto(c)}, {id: 'vez', texto: 'Solo esta vez'}], {i: 1, accion: 'r6-aprende', etiqueta: '¿Lo escribo siempre así?'});
  }

  VETA.pantalla('A23', {
    // el título dice lo que se hace («Contestar a Marta», «Informe de la semana»), no el nombre: así el volver nunca repite el título
    titulo: p => { const c = cosaDe(p.id); if (!c) return 'Te toca a ti'; return pal(c).titulo || (c.reabierta ? c.titulo : c.tipo === 'visita' ? 'Visita con ' + nombreCorto(c) : borradorDe(c) ? 'Contestar a ' + nombreCorto(c) : c.titulo); },
    sub: p => {
      const c = cosaDe(p.id), st = estadoDe(c), n = R7.cuentas().hoy;
      const resto = n === 0 ? 'Ya no te queda nada hoy.' : n === 1 ? 'Te queda 1 cosa.' : `Te quedan ${n} cosas.`;
      if (st === 'reabierta') return 'Ahora lo llevas tú, o me lo devuelves.';
      if (st === 'cerrada') return 'Esto ya lo he cerrado yo. ' + resto;
      if (st === 'aprender') return 'Has cambiado mi mensaje. ¿Siempre así?';
      if (st === 'preguntar') return `¿Has enviado el mensaje a ${nombreCorto(c)}?`;
      if (st === 'hecha') return resto;
      return st === 'toca' && c.pie ? c.pie : '';
    },
    // «Más»: lo que no es lo principal («Ya lo llevé por teléfono», «Hoy no», «Está mal», su ficha) y «Enséñale a Veta con este caso».
    // Las cosas con su lista de opciones (c.otraCosa) abren la hoja del carril (a-toca-mas, en hojas/dia.js); las demás, la común (h02)
    mas: p => { const c = cosaDe(p.id); return estadoDe(c) === 'toca' && tieneOtra(c) ? {hoja: Array.isArray(c.otraCosa) ? 'a-toca-mas' : 'h02', de: c.id} : null; },
    nota: p => {
      const c = cosaDe(p.id), st = estadoDe(c);
      return st === 'toca' && c.sale && !pal(c).ir ? 'envio' : '';
    },
    // de qué va la pantalla, para cuando se toca el micro («Enséñale a Veta» sobre este mensaje)
    casoDictado: p => {
      const c = cosaDe(p.id); if (!c || c.reabierta) return null;
      const br = borradorDe(c);
      return {de: c.id, quien: c.cliente, titulo: c.titulo, texto: br ? (br.texto || String(br.html).replace(/<[^>]+>/g, '')) : (c.resumen || '')};
    },
    pinta: p => {
      const c = cosaDe(p.id), st = estadoDe(c);
      if (st === 'nada') return R7.vacio('Esto ya no está en tu lista.');
      const panel = c.cliente ? ` data-panel="cliente/${esc(c.cliente)}"` : '';
      let h;
      if (st === 'reabierta' || st === 'cerrada') h = R7.tarjeta({i: 0, veta: true, de: 'Lo había cerrado yo', html: `<p><b>${esc(c.x.titulo)}.</b> ${esc(c.x.texto)}</p>`});
      else if (st === 'aprender') h = cuerpoAprender(c, porAprender(c));
      else if (st === 'preguntar') { const b = borradorDe(c); h = b ? R7.tarjeta({i: 0, veta: true, de: 'El mensaje', html: `<p class="a1-msg">${b.html ? b.html : esc(b.texto)}</p>`}) : ''; }
      else if (st === 'hecha') h = cuerpoHecha(c);
      else h = cuerpoToca(c);
      return `<div class="a1-toca"${panel}>${h}</div>`;
    },
    botonFijo: p => {
      const c = cosaDe(p.id), st = estadoDe(c);
      if (st === 'nada') return R7.sigue();
      if (st === 'cerrada' || st === 'aprender') return '';
      if (st === 'reabierta') return R7.botones({texto: 'Ciérralo tú', accion: 'r6-recierra', de: c.id});
      if (st === 'preguntar') return R7.botones({texto: 'Sí, enviado', accion: 'si-enviado', de: c.id}, {texto: 'Todavía no', accion: 'todavia-no', de: c.id});
      // hecha: el paso siguiente, o «Ir a Inicio» si ya no queda nada
      if (st === 'hecha') { const s = siguiente(c); return s ? R7.sigue({texto: 'Siguiente: ' + nombreCorto(s), accion: 'r7-siguiente', datos: {ruta: rutaDe(s)}}) : R7.sigue(); }
      return R7.botones(botonDe(c).negro);
    },
    alMontar: montaDia,
    acciones: {
      principal(ev, el) { A.principal(el); VETA.pintaBarra(); },
      'r7-siguiente'(ev, el) { VETA.ir(el.dataset.ruta, {reemplaza: true}); },
      'r6-recierra'(ev, el) { P('abiertas', abiertas().filter(x => x !== el.dataset.de)); VETA.pintaBarra(); VETA.aviso('Hecho. Lo cierro yo.'); VETA.atras(); },
      // «Sí, siempre» · «Solo con Marta» · «Solo esta vez»
      'r6-aprende'(ev, el) {
        const k = E('cambio'), c = k && M.cosa(k.id); if (!c) return;
        const amb = el.dataset.valor;
        if (amb === 'vez') { P('cambio', null); VETA.repinta(); VETA.aviso('Vale. Solo esta vez.'); return; }
        const d = A.dif(k.antes, k.ahora), t = A.tipoCambio(k.antes, k.ahora), ap = R6().aplica;
        if (amb === 'siempre') {
          r6.ensena({regla: t.regla, antes: d.antesTxt, ahora: d.ahoraTxt, ambito: 'siempre', tipo: t.tipo, de: c.cliente});
          const sig = t.tipo === 'dos-horas' && ap && M.cosa(ap.cosa);
          if (sig && sig.estado === 'por-hacer') M.marca(ap.cosa, 'por-hacer', {r6: true, aviso: ap.aviso, borradorHtml: vivo.marca(ap.texto, ap.frase)});
        } else P('solo', {regla: t.regla, cliente: c.cliente, corto: c.corto || c.titulo, cuando: VETA.ahora()});
        k.resuelto = amb; k.regla = t.regla; k.seq = A.seq(); P('cambio', k);
        VETA.repinta();
      },
      'r6-desaprende'() {
        const k = E('cambio'); if (!k) return;
        if (k.resuelto === 'siempre') { r6.olvida(); A.r6.limpia(); } else P('solo', null);
        delete k.resuelto; delete k.seq; P('cambio', k); VETA.repinta();
      }
    }
  });
})();
