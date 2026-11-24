/* Veta demo · pantallas · hoy.js · paquete A (El día) · ronda 7: A1 “Te toca a ti”
   A1 · Te toca a ti · #/hoy (la lista) y A23 · #/toca/:id (la tarjeta de una persona). Además, VETA.A: lo que comparten las pantallas y hojas del paquete A
   (tareas y notas guardadas desde lo dictado, la línea “en el sitio”, el dictado a medias y el “principal” con el 409 de Jordi). */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic;
  const PEND = ['por-hacer', 'pregunta-envio'];
  const HECHAS = ['enviada', 'hecha', 'quitada'];
  const DA = () => VETA.datos.diaA || {};

  // ---- VETA.A: estado propio del paquete (prefijo “a.”) ----
  const A = VETA.A = {};
  A.q = () => VETA.yo().id;
  A.seq = () => VETA.est.lee('seq', 0);
  // cuenta como “acción siguiente” para la línea en el sitio (comparte el contador del modelo)
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

  // texto de lo hecho, con el nombre entero (H05 y “Hecho hoy”)
  A.textoHecho = c => {
    const x = c.extra || {};
    if (x.linea) return x.linea;
    if (c.estado === 'enviada') return c.tipo === 'informe' && (c.lineas || {}).enviada ? c.lineas.enviada : 'Sent to ' + c.titulo;   // el de Pere dice cuál: “Informe de la semana enviado a Pere”
    if (c.tipo === 'visita' && c.estado === 'hecha') return 'Viewing notes for ' + c.titulo;
    return (c.lineas && c.lineas[c.estado]) || (c.estado === 'quitada' ? 'Removed · ' + c.titulo : 'Done · ' + c.titulo);
  };
  // todo lo hecho hoy por orden: lo del modelo y lo guardado aquí
  A.hechas = q => {
    const m = M.hechas(q).map(c => ({id: c.id, hora: c.hora, orden: c.orden, texto: A.textoHecho(c), sale: c.estado === 'enviada', cosa: c}));
    const l = A.locales().filter(t => t.quien === q && t.hecha).map(t => ({id: t.id, hora: t.hora, orden: t.seq, texto: t.linea, local: true}));
    return m.concat(l).sort((a, b) => a.orden - b.orden);
  };

  // “principal” de una tarjeta: Jordi trae el 409 (el mensaje cambia una vez); lo demás, como el núcleo
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

  // vuelve a “Te toca a ti”: atrás si es la anterior; si no, a la caja (camino nuevo, V4)
  A.aHoy = () => {
    const p = VETA.pila();
    if (p.length > 1 && p[p.length - 2].ruta === 'hoy') VETA.atras(); else VETA.ir('hoy');
  };

  // ---- ronda 6 · lo que Veta aprende y hace sola (datos en VETA.datos.r6.dia; claves propias “a.r6.”) ----
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
  // qué ha enseñado: si ahora hay dos horas donde había una (o ninguna), es “dar dos horas”; si no, “escribir así”
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

  // ---- ronda 7 · “Te toca a ti” (A1, #/hoy) y la tarjeta de una persona (A23, #/toca/:id) ----
  // A1 es solo la lista (R2, R3). Lo de Veta (“Esto lo hago yo”, “Lo que he aprendido de ti”, “¿Lo hago yo?”) vive en la caja Veta.
  const R7 = VETA.r7, ic7 = (n, w) => ic(n, w);
  const P7 = () => (VETA.datos.r7a1 || {}), pal = c => ((P7().cosas || {})[c.id]) || {};
  const plural = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
  const pendientes = q => M.cola(q).filter(c => PEND.includes(c.estado));
  const abiertas = () => E('abiertas', []);
  const cerradas = () => (R6().cerradas || []).filter(x => !abiertas().includes(x.id));
  const reabiertas = q => q === 'laura' ? (R6().cerradas || []).filter(x => abiertas().includes(x.id)) : [];

  // lo que dirección le pregunta: cuenta en la lista hasta que dices “Ya le he contestado” (clave a.r7.contestadas)
  const idPreg = x => x.op + '|' + x.hora + '|' + x.texto;
  A.preguntas = q => (r6.preguntas ? r6.preguntas(q) : []).filter(x => !E('contestadas', []).includes(idPreg(x)));

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

  // la siguiente que te toca, por el orden de la lista (si Veta acaba de cambiar un mensaje con lo aprendido, esa)
  function siguiente(c) {
    const q = A.q(), cola = M.cola(q), l = pendientes(q).filter(y => y.id !== c.id);
    const k = E('cambio'), ap = R6().aplica, sig = ap && k && k.id === c.id && k.resuelto === 'siempre' && M.cosa(ap.cosa);
    if (sig && PEND.includes(sig.estado) && (sig.extra || {}).r6) return sig;
    const i = cola.findIndex(y => y.id === c.id);
    return l.find(y => cola.indexOf(y) > i) || l[0] || null;
  }

  // “¿Lo hago siempre así?”: toca preguntarlo cuando el mensaje que salió no era el mío
  const porAprender = c => { const k = E('cambio'); return k && k.id === c.id && c.estado === 'enviada' && !k.resuelto ? k : null; };
  const aprendido = c => { const k = E('cambio'); return k && k.id === c.id && k.resuelto && k.seq === A.seq() ? k : null; };

  // ---- A1 · la lista ----
  function filaCosa(c) {
    const d = pal(c), x = c.extra || {}, preg = c.estado === 'pregunta-envio';
    const pasa = preg ? 'Did you send it? Tell me here' : x.r6 ? 'Already changed with what you taught me' : x.cambiado ? 'They wrote to you again' : (d.pasa || c.filaSub || '');
    return {cara: c.av || c.cliente || null, icono: c.icono || 'punto', nombre: c.titulo, pasa, pastilla: preg || x.r6 ? null : d.pastilla, tono: d.tono, ir: rutaDe(c)};
  }
  const mini = (texto, o) => `<button type="button" class="a1-mini"${UI.attrs(o)}>${esc(texto)}</button>`;

  function filas(q) {
    const l = pendientes(q).map(filaCosa);
    reabiertas(q).forEach(x => l.push({cara: x.cliente || null, icono: x.icono || 'check', nombre: x.cliente ? ((M.quien(x.cliente) || {}).nombre || x.tuya) : x.tuya, pasa: 'You take it again', ir: 'toca/' + x.id}));
    A.preguntas(q).forEach(x => {
      const op = VETA.datos.clientes && VETA.datos.clientes[x.op], quien = ((VETA.datos.personas || {}).montse || {}).corto || 'Montse';
      l.push({cara: 'montse', nombre: quien + ' asks you', pasa: x.texto, abre: `<p>About ${esc(x.nombre)}, today at ${esc(x.hora)}: “${esc(x.texto)}”</p>` +
        `<p class="a1-minis">${mini('I already replied', {accion: 'r7-contestada', datos: {k: idPreg(x)}})}${op ? mini('See the profile', {ir: 'cliente/' + x.op}) : ''}</p>`});
    });
    const dic = A.dictado();
    if (dic) l.push({icono: 'mic', nombre: 'What you were telling me', pasa: 'You left it half done (' + A.mmss(dic.seg) + ')',
      abre: `<p class="a1-minis">${mini('Continue', {ir: 'dictar/' + dic.guion})}${mini('Delete it', {accion: 'borrar-dictado'})}</p>`});
    const hechas = A.hechas(q), nMan = M.manana(q).length;
    if (hechas.length) l.push({icono: 'check', nombre: 'What you did today', pasa: hechas[hechas.length - 1].texto + (nMan ? ' · ' + plural(nMan, 'moves', 'move') + ' to tomorrow' : ''), numero: hechas.length, hoja: 'h05'});
    if (VETA.est.lee('a.cerrado', null)) l.push({icono: 'reloj', nombre: 'Day closed', pasa: 'Tomorrow at 8:00, a new list', abre: `<p class="a1-minis">${mini('Open the day again', {accion: 'abrir-dia'})}</p>`});
    const cer = q === 'laura' ? cerradas() : [];
    if (cer.length) l.push({icono: 'check', oro: true, clase: 'a1-cerradas', nombre: 'I already closed these', pasa: cer.map(x => x.corto).join(' and '), numero: cer.length,
      abre: cer.map(x => `<div class="a1-cer"><p><b>${esc(x.titulo)}.</b> ${esc(x.texto)}</p>${mini('Undo', {accion: 'r6-reabre', de: x.id})}</div>`).join('')});
    return l;
  }

  function fraseHoy() {
    if (VETA.est.lee('a.cerrado', null)) return 'Day closed. Tomorrow at 8:00 I will leave you the new list.';
    const n = R7.cuentas().hoy, yo = A.q() === 'laura';
    const base = n === 0 ? 'Nothing is left for you today.' : `Today you ${n === 1 ? 'have 1 thing' : 'have ' + n + ' things'}.`;
    return base + (yo ? ` A month ago it was ${P7().haceUnMes || R6().haceUnMes || 9}: I already do the rest.` : ' Tap one and I will tell you what to do.');
  }

  // si en la caja Veta se olvidó lo aprendido, el mensaje que Veta cambió vuelve a ser el de antes
  function alDia() {
    if (A.q() !== 'laura' || r6.siempre()) return false;
    const k = E('cambio'); let toca = A.r6.limpia();
    if (k && k.resuelto === 'siempre') { P('cambio', null); toca = true; }
    return toca;
  }

  const comunes = {
    'borrar-dictado'() { VETA.est.pon('a.dictado', null); VETA.repinta(); VETA.pintaBarra(); },
    'abrir-dia'() { VETA.est.pon('a.cerrado', null); VETA.repinta(); },
    'r7-contestada'(ev, el) { P('contestadas', E('contestadas', []).concat([el.dataset.k])); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('Done. I will tell Montse.'); },
    // lo que Veta cerró sola: “Deshacer” lo vuelve a poner en tu lista
    'r6-reabre'(ev, el) {
      const id = el.dataset.de, ab = abiertas(); if (!ab.includes(id)) ab.push(id);
      P('abiertas', ab); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('OK. I won\'t close it without asking you.');
    }
  };

  VETA.pantalla('A1', {
    titulo: 'Your turn',
    frase: fraseHoy,
    guia: ['Here is what you have to do today: one row for each person.', 'Tap one to see their message and the one I wrote for you.', 'You send it. I already do the rest.'],
    pinta: () => R7.lista(filas(A.q()), {i: 0, clase: 'a1-lista'}),
    botonFijo: () => {
      const q = A.q();
      if (R7.cuentas().hoy || VETA.est.lee('a.cerrado', null) || !M.cola(q).length) return '';
      return R7.botones({texto: 'Close the day', accion: 'cerrar-dia'});
    },
    alMontar: () => { if (alDia()) VETA.repinta(); },
    acciones: Object.assign({
      'cerrar-dia'() { VETA.est.pon('a.cerrado', VETA.ahora()); VETA.repinta(); VETA.hoja('h06'); }
    }, comunes)
  });

  // ---- A23 · la tarjeta de una persona ----
  function estadoDe(c) {
    if (!c) return 'nada';
    if (c.reabierta) return c.estado === 'por-hacer' ? 'reabierta' : 'cerrada';
    if (porAprender(c)) return 'aprender';
    if (c.estado === 'pregunta-envio') return 'preguntar';
    return PEND.includes(c.estado) ? 'toca' : 'hecha';
  }
  const quedan = () => R7.cuentas().hoy;
  const borradorDe = c => { const x = c.extra || {}; return x.borradorHtml ? {html: x.borradorHtml} : (x.borrador || c.borrador) ? {texto: String(x.borrador || c.borrador).replace(/<[^>]+>/g, '')} : null; };
  const msgHtml = b => b ? `<p class="a1-msg">${b.html ? b.html : esc(b.texto)}</p>` : '';
  const suMensaje = c => c.cita ? `<div class="r7-ficha" data-i="0"><span class="r7-ficha-de">${esc(c.cita.origen || c.titulo)}</span><p>${esc(c.cita.texto)}</p></div>` : '';
  const tieneOtra = c => (c.secundarios || []).some(s => s.hoja === 'h02');
  const editar = c => (c.secundarios || []).find(s => s.ir && /^mensaje\//.test(s.ir));

  function fraseToca(p) {
    const c = cosaDe(p.id), st = estadoDe(c), n = quedan();
    const resto = n === 0 ? 'Nothing is left for you today.' : `You still ${n === 1 ? 'have 1 thing' : 'left ' + n + ' things'}.`;
    if (st === 'nada') return 'This is no longer on your list.';
    if (st === 'reabierta') return 'I had closed it. Now you take it, or you give it back to me.';
    if (st === 'cerrada') return 'I already closed this. ' + resto;
    if (st === 'aprender') return 'Sent. You changed my message: shall I always write it like this?';
    if (st === 'preguntar') return `Did you send the message to ${nombreCorto(c)}? Tell me and I will take it off your list.`;
    if (st === 'hecha') return 'Done. ' + resto;
    const d = pal(c);
    if (d.frase) return d.frase;
    if (c.tipo === 'visita') return 'You have a viewing. When you come out, tell me how it went.';
    return borradorDe(c) ? `${nombreCorto(c)} wrote to you. See my reply and send it yourself.` : (c.momento || c.filaSub || '');
  }

  function cuerpoToca(c) {
    const d = pal(c), x = c.extra || {}, b = borradorDe(c);
    let h = suMensaje(c);
    if (c.bloqueo) h += `<div class="r7-ficha r7-oro" data-i="1"><span class="r7-ficha-de">I looked at it myself</span><p>${esc(c.bloqueo)}</p></div>`;
    else if (b || c.resumen || c.encaja || c.momento) {
      let v = `<span class="r7-ficha-de">${esc(d.hecho || (b ? 'I write it for you' : 'What I know'))}</span>`;
      if (x.aviso) v += `<p class="a1-aviso">${esc(x.aviso)}</p>`;
      if (c.momento) v += `<p>${esc(c.momento)}</p>`;
      if (c.encaja) v += `<div class="a1-piso">${UI.foto(c.encaja.piso, {tam: 'mini'})}<span>${esc(c.encaja.texto)}</span></div>`;
      if (c.resumen) v += `<p>${esc(c.resumen)}</p>`;
      v += msgHtml(b);
      if (b || c.resumen) v += R7.ensena({datos: {caso: c.id}});
      h += `<div class="r7-ficha r7-oro" data-i="1">${v}</div>`;
    }
    if (c.sale) h += `<p class="a1-nota" data-i="2">${ic7('candado', 16)}<span>It does not go out until you send it.${c.pie ? ' ' + esc(c.pie) : ''}</span></p>`;
    if (tieneOtra(c)) h += `<button type="button" class="enlace a1-otra" data-hoja="h02" data-de="${esc(c.id)}" data-i="2">Do something else with ${esc(nombreCorto(c))}</button>`;
    return h;
  }

  function cuerpoHecha(c) {
    const sale = c.estado === 'enviada', k = aprendido(c);
    let h = `<div class="r7-ficha a1-hecho" data-i="0"><p class="a1-hecho-t">${ic7('check', 20)}<span>${esc((c.extra || {}).linea || (c.lineas || {})[c.estado] || (sale ? 'Sent to ' + nombreCorto(c) : 'Done'))}${c.hora && c.estado !== 'para-manana' ? ' · ' + esc(c.hora) : ''}</span></p>` +
      `<p class="a1-minis">${sale ? mini('See what you sent', {hoja: 'h03', de: c.id}) : ''}${mini(sale ? 'I didn\'t send it' : 'Undo', {accion: sale ? 'no-lo-envie' : 'deshacer', de: c.id})}</p></div>`;
    if (k) {
      const t = A.tipoCambio(k.antes, k.ahora), d = A.dif(k.antes, k.ahora), ap = R6().aplica, sig = k.resuelto === 'siempre' && ap && M.cosa(ap.cosa);
      const que = k.resuelto !== 'siempre' ? vivo.oro('With ' + nombreCorto(c) + ' I do it like this') + '.'
        : t.tipo === 'dos-horas' ? vivo.oro(R6().aprendidoDosHoras) + '.'
        : d.ahora && /v-oro/.test(d.ahora) ? 'From now on, in messages like this one I write: “' + d.ahora + '”' : 'From now on, in messages like this one I take out: “' + d.antes + '”';
      const aplicado = sig && (sig.extra || {}).r6 && sig.estado === 'por-hacer';
      h += `<div class="r7-ficha r7-oro" data-i="1" data-vt="a-r6-apr"><span class="r7-ficha-de">Learned</span><p>${que}</p>` +
        `<p class="a1-apl">${aplicado ? 'I already changed the message for ' + esc(ap.corto) + '.' : k.resuelto === 'siempre' ? 'You will see it in the next message like this one.' : 'You will see it in their next message.'}</p>` +
        `<p class="a1-minis">${mini('Undo', {accion: 'r6-desaprende'})}</p></div>`;
    }
    return h;
  }

  function cuerpoAprender(c, k) {
    const d = A.dif(k.antes, k.ahora);
    return `<div class="r7-ficha r7-oro a1-dif" data-i="0" data-vt="a-r6-apr">${d.quita ? `<span class="r7-ficha-de">I wrote</span><p>${d.antes}</p>` : ''}<span class="r7-ficha-de">You wrote</span><p>${d.ahora}</p></div>`;
  }

  VETA.pantalla('A23', {
    // el título dice lo que se hace (“Contestar a Marta”, “Informe de la semana”), no el nombre: así el volver nunca repite el título (9b)
    titulo: p => { const c = cosaDe(p.id); if (!c) return 'Your turn'; return pal(c).titulo || (c.reabierta ? c.titulo : c.tipo === 'visita' ? 'Viewing with ' + nombreCorto(c) : borradorDe(c) ? 'Reply to ' + nombreCorto(c) : c.titulo); },
    frase: fraseToca,
    // cuando la pantalla pregunta algo (“¿Lo has enviado?”, “¿lo escribo siempre así?”), la pregunta se queda en el cuerpo, sobre sus botones
    fraseCuerpo: p => ['aprender', 'preguntar'].includes(estadoDe(cosaDe(p.id))),
    guia: ['Here you see what they wrote to you and what I wrote for you.', 'You send it from your WhatsApp. If you change it, I ask if I should always do it this way.', 'When you finish, you go on to the next one.'],
    pinta: p => {
      const c = cosaDe(p.id), st = estadoDe(c);
      if (st === 'nada') return UI.vacio({titulo: 'This is not here any more', texto: 'What you have to do is on the list.', icono: 'check'});
      const panel = c.cliente ? ` data-panel="cliente/${esc(c.cliente)}"` : '';
      let h;
      if (st === 'reabierta' || st === 'cerrada') h = `<div class="r7-ficha r7-oro" data-i="0"><span class="r7-ficha-de">I had closed it</span><p><b>${esc(c.x.titulo)}.</b> ${esc(c.x.texto)}</p></div>`;
      else if (st === 'aprender') h = cuerpoAprender(c, porAprender(c));
      else if (st === 'preguntar') { const b = borradorDe(c); h = (b ? `<div class="r7-ficha r7-oro" data-i="0"><span class="r7-ficha-de">The message</span>${msgHtml(b)}</div>` : '') + `<p class="a1-nota" data-i="1">${ic7('info', 16)}<span>WhatsApp doesn't open in this demo: no message goes out.</span></p>`; }
      else if (st === 'hecha') h = cuerpoHecha(c);
      else h = cuerpoToca(c);
      return `<div class="a1-toca"${panel}>${h}</div>`;
    },
    botonFijo: p => {
      const c = cosaDe(p.id), st = estadoDe(c);
      if (st === 'nada' || st === 'cerrada') return '';
      if (st === 'reabierta') return R7.botones({texto: 'Close it yourself', accion: 'r6-recierra', de: c.id});
      if (st === 'preguntar') return R7.botones({texto: 'Yes, sent', accion: 'si-enviado', de: c.id}, [{texto: 'Not yet', accion: 'todavia-no', de: c.id}]);
      if (st === 'aprender') {
        const k = porAprender(c), t = A.tipoCambio(k.antes, k.ahora);
        return R7.botones({texto: t.si, accion: 'r6-aprende', datos: {ambito: 'siempre'}},
          [{texto: 'Only with ' + nombreCorto(c), accion: 'r6-aprende', datos: {ambito: 'cliente'}}, {texto: 'Only this time', accion: 'r6-aprende', datos: {ambito: 'vez'}}]);
      }
      if (st === 'hecha') { const s = siguiente(c); return s ? R7.botones({texto: 'Next: ' + nombreCorto(s) + ' ›', accion: 'r7-siguiente', datos: {ruta: rutaDe(s)}}) : ''; }
      // la tarjeta: el negro es lo principal de la cosa; claros, “Editar” o lo que traiga (sin “Otra cosa…” ni la ficha, que van en “Otra cosa…”)
      const d = pal(c), x = c.extra || {};
      if (d.ir) return R7.botones({texto: 'Open the viewing', ir: d.ir});
      const b = Object.assign({}, c.boton || {}, x.boton || {}); if (!b.ir && !b.hoja && !b.accion) b.accion = 'principal';
      if (d.boton && !x.boton) b.texto = d.boton;
      const ed = editar(c);
      const claros = (x.secundarios || c.secundarios || []).filter(s => s.hoja !== 'h02' && !(s.ir && /^cliente\//.test(s.ir)))
        .map(s => s === ed ? Object.assign({}, s, {texto: 'Edit'}) : s).map(s => Object.assign({de: c.id}, s));
      // todo mensaje que deja escrito Veta se puede cambiar (Núria no lo traía)
      if (!ed && borradorDe(c) && b.accion === 'principal') claros.unshift({texto: 'Edit', ir: 'mensaje/' + c.id});
      return R7.botones(Object.assign({de: c.id}, b), claros);
    },
    alMontar: () => { if (alDia()) VETA.repinta(); },
    acciones: Object.assign({
      principal(ev, el) { A.principal(el); VETA.pintaBarra(); },
      'r7-siguiente'(ev, el) { VETA.ir(el.dataset.ruta, {reemplaza: true}); },
      'r6-recierra'(ev, el) { P('abiertas', abiertas().filter(x => x !== el.dataset.de)); VETA.pintaBarra(); VETA.aviso('Done. I will close it myself.'); VETA.atras(); },
      // “Sí, siempre” · “Solo con Marta” · “Solo esta vez”
      'r6-aprende'(ev, el) {
        const k = E('cambio'), c = k && M.cosa(k.id); if (!c) return;
        const amb = el.dataset.ambito;
        if (amb === 'vez') { P('cambio', null); VETA.repinta(); VETA.aviso('OK. Only this time.'); return; }
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
    }, comunes)
  });

  // “Enséñale a Veta” junto a un mensaje: deja dicho de qué caso sale (clave r7.caso), para que el dictado lo enseñe arriba
  document.addEventListener('click', ev => {
    const b = ev.target.closest && ev.target.closest('.r7-ensena[data-caso]'); if (!b) return;
    const c = M.cosa(b.dataset.caso); if (!c) return;
    const br = borradorDe(c);
    VETA.est.pon('r7.caso', {de: c.id, quien: c.cliente, titulo: c.titulo, texto: br ? (br.texto || String(br.html).replace(/<[^>]+>/g, '')) : (c.resumen || '')});
  }, true);
})();
