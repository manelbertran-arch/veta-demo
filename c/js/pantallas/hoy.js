/* Veta demo · ronda 8 · pantallas · hoy.js · carril A (El día)
   · El Inicio de la agente (gancho VETA.inicioDe.agente): «lo primero» con su botón, la lista del resto y la fila «Hoy he hecho yo».
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
  // «Hoy he hecho yo»: lo que Veta cerró sola, lo que vigila y lo que ha leído, en una fila que abre su hoja
  function deVeta(q) {
    const nc = A.cerradas(q).length, nv = A.esperaPend(q).length, nl = ((M.lectura() || {}).hoy || {}).chats || 0;
    const t = [];
    if (nc) t.push(cuantas(nc, '1 cerrada', `${nc} cerradas`));
    if (nv) t.push(cuantas(nv, '1 vigilada', `${nv} vigiladas`));
    if (nl) t.push(cuantas(nl, '1 chat leído', `${nl} chats leídos`));
    return {nombre: 'Hoy he hecho yo', pasa: t.join(' · '), hoja: 'r8-hoy'};
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
  // semana: la fila «Tu semana» del día de dirección (A1)
  function cuerpoDia(q, semana) {
    const l = pendientes(q).map(filaCosa);
    reabiertas(q).forEach(x => l.push({cara: x.cliente || null, nombre: x.cliente ? ((M.quien(x.cliente) || {}).nombre || x.tuya) : x.tuya, pasa: 'Lo vuelves a llevar tú', ir: 'toca/' + x.id, boton: 'Abrir'}));
    const uno = l[0], resto = l.slice(1).map(f => Object.assign({}, f, {boton: null}));
    return (uno ? R7.primero({i: 0, cara: uno.cara, nombre: uno.nombre, pasa: uno.pasa, pastilla: uno.pastilla, boton: {texto: uno.boton, ir: uno.ir}}) : '') +
      (resto.length ? R7.lista(resto, {i: 1}) : '') +
      R7.lista([deVeta(q)].concat(semana ? [{nombre: 'Tu semana', ir: 'semana'}] : [], ocasionales(q)), {i: 2});
  }
  const fraseDia = () => {
    if (cerrado()) return 'Día cerrado. Mañana a las 8:00, lista nueva.';
    const n = R7.cuentas().hoy;
    return n > 1 ? `Hoy te tocan ${n} cosas.` : n === 1 ? 'Hoy te toca 1 cosa.' : 'Hoy ya no te toca nada.';
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
  const montaDia = () => { if (alDia()) VETA.repinta(); };

  // el Inicio de la agente (la cáscara, la fecha y el saludo son de js/pantallas/inicio.js)
  VETA.inicioDe.agente = yo => ({
    html: cuerpoDia(yo.id),
    frase: cerrado() ? fraseDia() : '',
    pie: pieDia(yo.id),
    acciones: accionesDia,
    alMontar: montaDia
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
    let h = UI.lineaHecho({i: 0, texto: (c.extra || {}).linea || (c.lineas || {})[c.estado] || (sale ? 'Enviado a ' + nombreCorto(c) : 'Hecho'), hora: c.estado !== 'para-manana' ? c.hora : null,
      boton: {texto: sale ? 'No lo envié' : 'Deshacer', accion: sale ? 'no-lo-envie' : 'deshacer', de: c.id}});
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
    // «Más»: lo que no es lo principal («Ya lo llevé por teléfono», «Hoy no», «Está mal», su ficha)
    mas: p => { const c = cosaDe(p.id); return estadoDe(c) === 'toca' && tieneOtra(c) ? {hoja: 'h02', de: c.id} : null; },
    nota: p => {
      const c = cosaDe(p.id), st = estadoDe(c);
      if (st === 'preguntar') return 'En esta demo no sale ningún mensaje.';
      return st === 'toca' && c.sale && !pal(c).ir ? {texto: 'No sale hasta que tú lo envíes.', candado: true} : '';
    },
    // de qué va la pantalla, para cuando se toca el micro («Enséñale a Veta» sobre este mensaje)
    casoDictado: p => {
      const c = cosaDe(p.id); if (!c || c.reabierta) return null;
      const br = borradorDe(c);
      return {de: c.id, quien: c.cliente, titulo: c.titulo, texto: br ? (br.texto || String(br.html).replace(/<[^>]+>/g, '')) : (c.resumen || '')};
    },
    pinta: p => {
      const c = cosaDe(p.id), st = estadoDe(c);
      if (st === 'nada') return UI.vacio({titulo: 'Esto ya no está', texto: 'Lo que te toca está en Inicio.', icono: 'check'});
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
      if (st === 'nada' || st === 'cerrada' || st === 'aprender') return '';
      if (st === 'reabierta') return R7.botones({texto: 'Ciérralo tú', accion: 'r6-recierra', de: c.id});
      if (st === 'preguntar') return R7.botones({texto: 'Sí, enviado', accion: 'si-enviado', de: c.id}, {texto: 'Todavía no', accion: 'todavia-no', de: c.id});
      if (st === 'hecha') { const s = siguiente(c); return s ? R7.botones({texto: 'Siguiente: ' + nombreCorto(s) + ' ›', accion: 'r7-siguiente', datos: {ruta: rutaDe(s)}}) : ''; }
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
