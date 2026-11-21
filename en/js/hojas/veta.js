/* Veta demo · hojas · veta.js · paquete C (Veta, cuenta y entrada)
   H18 Un caso · H19 Los casos como yo · H20 Otra cosa… de la regla · H21 Cómo la he entendido · H22 Subir un nivel ·
   H23 Una práctica · H24 Tus tiempos · H25 Una semana anterior · H28 Sin señal · H30 ¿Qué chat borras? ·
   H31 Poner Veta en la pantalla de inicio · H32 Un hallazgo del mapa · H33 Calendario.
   Y cuatro hojas propias de C: c-lista (tu lista de cada día), c-mano (lo que aún haces a mano), c-avisos, c-anadir (añadir un chat a la lista).
   Datos que reciben (data-* del botón): h18 regla, caso · h19 regla · h20 de (regla) · h22 de (regla) · h23 practica ·
   h25 semana (26-oct | 2-nov | 9-nov | 16-nov; sin ella, elige) · h30 de (nombre ya borrado: enseña su recibo) · h32 hallazgo. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const D = () => VETA.datos.c;
  const cerrar = (t, tipo) => UI.boton({tipo: tipo || 'texto', texto: t || 'Close', datos: {cierra: '1'}, clase: 'hoja-cancela'});
  const citaQuieta = (texto, origen) => `<blockquote class="cita c-cita-quieta"><span class="cita-t">“${esc(texto)}”</span><span class="cita-o">${esc(origen)}</span></blockquote>`;
  const nombre = id => (M.quien(id) || {}).nombre || id;
  const repintaSiVe = rutaEmpieza => { const a = VETA.actual(); if (a && a.ruta.indexOf(rutaEmpieza) === 0) VETA.repinta(); };

  // ---- H18 · Un caso ----
  const caso = d => {
    if (d.regla === 'r-cancelaciones') return {tipo: 'prueba', x: D().aPrueba.find(c => c.id === d.caso)};
    const r = M.regla(d.regla), c = r && r.casos && r.casos.distinto && r.casos.distinto.find(y => y.cliente === d.caso);
    return {tipo: 'distinto', x: c, extra: D().distinto[d.caso] || {}};
  };
  VETA.hojaDef('h18', {
    titulo: d => { const k = caso(d); return k.x ? `${k.x.nombre} · ${k.x.cuando}` : 'A case'; },
    pinta: d => {
      const k = caso(d); if (!k.x) return `<p class="hoja-x">This case is no longer here.</p>` + cerrar(null, 'secundario');
      if (k.tipo === 'prueba') return citaQuieta(k.x.cita, k.x.origen) + `<p class="hoja-x">${esc(k.x.propone)}. This is the message I would have left you:</p>` +
        UI.borrador({texto: k.x.borrador}) + UI.nota({texto: 'I did not send it: I\'m trying it.', icono: 'candado', caja: true}) + cerrar(null, 'secundario');
      const corto = k.x.nombre.split(' ')[0], ya = C.excepciones(d.regla).includes(d.caso);
      return citaQuieta(k.x.texto, k.extra.origen || '') + `<p class="hoja-x">${esc(k.extra.habria || '')}</p>` +
        (ya ? UI.nota({texto: `With ${corto} I don't do it any more.`, icono: 'check', caja: true}) + cerrar(null, 'secundario')
          : UI.boton({texto: `With ${corto}, don't do it`, accion: 'excepcion'}) + cerrar());
    },
    acciones: {
      excepcion(ev, el, d) {
        C.ponExcepcion(d.regla, d.caso); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`Exception: not with ${nombre(d.caso)}`, {deshacer: () => { C.quitaExcepcion(d.regla, d.caso); VETA.repinta(); }});
      }
    }
  });

  // ---- H19 · Los casos como yo ----
  VETA.hojaDef('h19', {
    titulo: d => (d.regla === 'r-recordatorios' ? 'The 6 cases' : 'The 11 times you did it the same way'),
    pinta: d => {
      const r = M.regla(d.regla) || {}, l = d.regla === 'r-recordatorios' ? (r.casos || []) : ((r.casos || {}).comoYo || []);
      const txt = d.regla === 'r-recordatorios' ? 'A buyer took more than three days to reply to you. A reminder would have been due here.' : 'Someone asked for a valuation and the next day you sent them the flat report.';
      return `<p class="hoja-x">${esc(txt)}</p><div class="lista c-hoja-lista">${l.map(c => UI.fila({titulo: c.nombre, derecha: c.cuando, icono: 'check'})).join('')}</div>` + cerrar(null, 'secundario');
    }
  });

  // ---- H20 · Otra cosa… (de una regla) ----
  VETA.hojaDef('h20', {
    titulo: d => (d.paso === 'cliente' ? 'Not with a client…' : 'Something else…'),
    pinta: d => {
      if (d.paso === 'cliente') {
        const ex = C.excepciones(d.de);
        return `<p class="hoja-x">With whoever you choose, I won't do it.</p><div class="ops">${M.clientes(VETA.yo().id).filter(c => !ex.includes(c.id)).map(c =>
          `<button type="button" class="op" data-accion="cliente" data-c="${esc(c.id)}">${VETA.av(c.id, 40)}<span class="op-c"><span class="op-t">${esc(c.nombre)}</span></span></button>`).join('')}</div>` + cerrar('Cancel');
      }
      const r = M.regla(d.de) || {}, activa = r.estado === 'activa', ofi = C.lee('aOficina', {})[d.de];
      const ops = [
        r.estado === 'a-prueba' ? ['Make it do it now, without waiting for 7 Dec', 'activar', 'check'] : null,
        [activa ? 'Stop doing it' : 'I do not want it', 'descartar', 'borrar', true],
        ['Put it another way', 'otra-forma', 'mic'],
        ['Not with a client…', 'no-cliente', 'usuario'],
        ['Who does it? Change it', 'nivel', 'escalera'],
        ofi ? null : ['Suggest it to the office', 'oficina', 'equipo', false, 'Montse will see it with your name and decide if the whole office tries it.']
      ].filter(Boolean);
      return `<div class="ops">${ops.map(([t, a, ic, pel, sub]) => `<button type="button" class="op${pel ? ' op-peligro' : ''}" data-accion="${a}">${VETA.ic(ic, 22)}<span class="op-c"><span class="op-t">${esc(t)}</span>${sub ? `<span class="op-s">${esc(sub)}</span>` : ''}</span></button>`).join('')}</div>` + cerrar('Cancel');
    },
    acciones: {
      activar(ev, el, d) { VETA.cierraHoja({foco: false}); C.cambiaRegla(d.de, 'activa', 'I already do it · I\'ll leave it for you in Today'); },
      descartar(ev, el, d) {
        const activa = (M.regla(d.de) || {}).estado === 'activa';
        VETA.cierraHoja({foco: false}); C.cambiaRegla(d.de, 'descartada', activa ? 'I don\'t do it any more · stopped today' : 'I no longer do it · I will not suggest it again');
      },
      'otra-forma'() { VETA.cierraHoja({foco: false}); VETA.ir('dictar/orden'); },
      'no-cliente'(ev, el, d) { VETA.hoja('h20', Object.assign({}, d, {paso: 'cliente'})); },
      cliente(ev, el, d) {
        const c = el.dataset.c; C.ponExcepcion(d.de, c); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`Exception: not with ${nombre(c)}`, {deshacer: () => { C.quitaExcepcion(d.de, c); VETA.repinta(); }});
      },
      nivel(ev, el, d) { VETA.cierraHoja({foco: false}); VETA.ir('regla/' + d.de + '/nivel'); },
      oficina(ev, el, d) {
        const o = C.lee('aOficina', {}); o[d.de] = VETA.ahora(); C.pon('aOficina', o); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('I have suggested it to the office, with your name', {deshacer: () => { const x = C.lee('aOficina', {}); delete x[d.de]; C.pon('aOficina', x); VETA.repinta(); }});
      }
    }
  });

  // ---- H21 · Cómo la he entendido, por partes ----
  VETA.hojaDef('h21', {
    titulo: 'What I understood',
    pinta: () => `<div class="c-partes-h">${D().orden.partes.map(x => `<div class="c-parte-h"><div class="c-parte-h-c"><p class="c-parte-h-t">${esc(x.titulo)}</p><p class="c-parte-h-x">${esc(x.texto)}</p></div>` +
      UI.boton({tipo: 'texto', texto: 'Change', accion: 'cambiar', ancho: false, datos: {parte: x.id}}) + '</div>').join('')}</div>` + cerrar(null, 'secundario'),
    acciones: {
      cambiar(ev, el) { VETA.cierraHoja({foco: false}); VETA.ir(el.dataset.parte === 'llega' ? 'regla/r-recordatorios/nivel' : 'dictar/orden'); }
    }
  });

  // ---- H22 · Subir un nivel (dirección) ----
  VETA.hojaDef('h22', {
    titulo: 'Go up one step',
    pinta: d => `<div class="hoja-texto"><section class="ht-b"><h3 class="ht-t">Who it's for</h3><p>For the whole team.</p></section>` +
      `<section class="ht-b"><h3 class="ht-t">What changes</h3><p>“${esc(C.nombre(d.de))}” goes from “I write it for you” to “I note it down”: I note, mark and save. I send nothing.</p></section></div>` +
      UI.boton({texto: 'Yes, go up one step', accion: 'subir'}) + cerrar('Cancel'),
    acciones: {
      subir(ev, el, d) {
        const antes = C.nivel(d.de); C.ponNivel(d.de, 3);
        C.pon('nivelLinea', {id: d.de, texto: 'I note it down · from today', hora: VETA.ahora(), subido: antes});
        VETA.cierraHoja({foco: false}); VETA.repinta({hecho: 'c-nivel'});
      }
    }
  });

  // ---- H23 · Una práctica de la oficina ----
  const SIGUE = {propuesta: {texto: 'Try it for two weeks', estado: 'a-prueba', estadoTexto: 'We are trying it · day 1 of 14', aviso: 'We try it for two weeks'},
    'a-prueba': {texto: 'Extend it to the whole team', estado: 'en-marcha', estadoTexto: 'In use', aviso: 'Extended to the whole team'}};
  VETA.hojaDef('h23', {
    titulo: d => (C.practicas().find(x => x.id === d.practica) || {}).titulo || 'A practice',
    pinta: d => {
      const x = C.practicas().find(y => y.id === d.practica);
      if (!x) return `<p class="hoja-x">This practice is no longer here.</p>` + cerrar(null, 'secundario');
      const dir = VETA.yo().papel === 'direccion', s = SIGUE[x.estado];
      return `<div>${UI.etiqueta(x.estado, x.estadoTexto)}</div>` + `<div class="lista c-hoja-lista">` +
        UI.fila({titulo: 'Who proposed it', sub: x.propuso, icono: 'usuario'}) + UI.fila({titulo: 'How many people use it', sub: x.usan, icono: 'equipo'}) +
        UI.fila({titulo: 'What case it came from', sub: x.caso, icono: 'libro'}) + `</div>` +
        (dir && s ? UI.boton({texto: s.texto, accion: 'sigue'}) + cerrar('Cancel')
          : UI.nota({texto: dir ? 'The whole team already uses it.' : 'Management decides. You see it here so you know how the office works.', icono: 'info', clase: 'nota-gris'}) + cerrar(null, 'secundario'));
    },
    acciones: {
      sigue(ev, el, d) {
        const x = C.practicas().find(y => y.id === d.practica), s = x && SIGUE[x.estado]; if (!s) return;
        const todo = C.lee('practica', {}), antes = todo[x.id];
        todo[x.id] = {estado: s.estado, estadoTexto: s.estadoTexto, usan: s.estado === 'en-marcha' ? 'used by the whole team' : 'on trial with the whole team'};
        C.pon('practica', todo); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(s.aviso, {deshacer: () => { const t = C.lee('practica', {}); if (antes) t[x.id] = antes; else delete t[x.id]; C.pon('practica', t); VETA.repinta(); }});
      }
    }
  });

  // ---- H24 · Tus tiempos ----
  let borrador = null;
  VETA.hojaDef('h24', {
    titulo: 'Your times',
    pinta: () => {
      const t = borrador || M.lee('tiempos', null) || {};
      return `<p class="hoja-x">Veta doesn't make up hours. Tell me how long it takes you.</p><div class="c-tiempos">${D().tiempos.map(x => {
        const v = t[x.id] != null ? t[x.id] : x.min;
        return `<div class="c-tmp"><span class="c-tmp-n">${esc(x.texto)}</span><div class="c-paso">` +
          UI.boton({tipo: 'redondo', texto: 'One minute less', icono: 'menos', accion: 'menos', datos: {t: x.id}}) +
          `<b class="c-paso-v" id="c-t-${x.id}">${v} min</b>` + UI.boton({tipo: 'redondo', texto: 'One minute more', icono: 'mas', accion: 'mas', datos: {t: x.id}}) + `</div></div>`;
      }).join('')}</div>` + UI.boton({texto: 'Save my times', accion: 'guardar'}) + cerrar('Cancel');
    },
    alMontar: () => { if (!borrador) { const t = M.lee('tiempos', null); borrador = {}; D().tiempos.forEach(x => { borrador[x.id] = t && t[x.id] != null ? t[x.id] : x.min; }); } },
    alCerrar: () => { borrador = null; },
    acciones: {
      menos(ev, el) { cambia(el.dataset.t, -1); }, mas(ev, el) { cambia(el.dataset.t, 1); },
      guardar() {
        const t = Object.assign({}, borrador); borrador = null;
        M.pon('tiempos', t); VETA.cierraHoja({foco: false}); if (C.ruedaHoras) C.ruedaHoras(); VETA.repinta();
        VETA.aviso('Times saved', {deshacer: () => { M.deshazFlag('tiempos'); VETA.repinta(); }});
      }
    }
  });
  function cambia(id, d) {
    borrador[id] = Math.max(1, Math.min(60, (borrador[id] || 1) + d));
    const b = document.getElementById('c-t-' + id); if (b) { b.dataset.rueda = b.dataset.rueda || b.textContent; VETA.rueda(b, borrador[id] + ' min'); }
  }

  // ---- H25 · Una semana anterior ----
  VETA.hojaDef('h25', {
    titulo: d => { const s = D().semanas.find(x => x.id === d.semana); return s ? s.texto : 'Previous weeks'; },
    pinta: d => {
      const s = D().semanas.find(x => x.id === d.semana);
      if (!s) return `<div class="ops">${D().semanas.slice().reverse().map(x => `<button type="button" class="op" data-hoja="h25" data-semana="${x.id}">${VETA.ic('cal', 22)}<span class="op-c"><span class="op-t">${esc(x.texto)}</span><span class="op-s">${VETA.yo().papel === 'direccion' ? '' : x.mensajes + ' messages prepared · '}${x.preparados} ready in the office</span></span></button>`).join('')}</div>` + cerrar();
      // dirección: solo la cifra de la oficina (los mensajes y actas de la semana son de Laura)
      const dir = VETA.yo().papel === 'direccion';
      return `<div class="lista c-hoja-lista">${dir ? '' : UI.fila({titulo: 'Messages I wrote for you', sub: `You sent ${s.enviados}`, derecha: String(s.mensajes), icono: 'chat'}) +
        UI.fila({titulo: 'Viewing notes saved', derecha: String(s.actas), icono: 'doc'})}` + UI.fila({titulo: 'Messages and tasks ready in the office', derecha: VETA.num(s.preparados), icono: 'equipo'}) + `</div>` +
        UI.nota({texto: 'No hours: they only come from the times each person enters.', icono: 'info', clase: 'nota-gris'}) +
        UI.boton({tipo: 'secundario', texto: 'Other weeks', hoja: 'h25'}) + cerrar();
    }
  });

  // ---- H28 · Sin señal ----
  VETA.hojaTexto('h28', {
    titulo: 'No signal',
    bloques: () => [{texto: 'You can still see your clients and their profiles.'}, {html: UI.nota({texto: 'Queued: 2 dictations · 1 reply.', icono: 'reloj', caja: true})},
      {texto: 'They go out when the signal is back. Every message still needs your approval.'}]
  });

  // ---- H30 · ¿Qué chat borras? y Recibo de borrado ----
  VETA.hojaDef('h30', {
    titulo: d => (d.de ? 'What was deleted' : 'Which chat are you deleting?'),
    pinta: d => {
      if (d.de) return `<div class="c-recibo"><p class="c-recibo-t">${VETA.ic('sello', 22)}<b>${esc(d.de)}</b></p>` +
        `<p>1 conversation · requested today · fully deleted before Thursday 26</p></div>` + UI.nota({texto: 'Whatever was already on a client\'s profile stays on the profile.', icono: 'info', clase: 'nota-gris'}) + cerrar(null, 'secundario');
      const ya = C.lee('borrados', []).map(b => b.nombre);
      const chats = M.lectura().fuera.concat(M.clientes(VETA.yo().id).slice(0, 6).map(c => c.nombre)).filter(n => !ya.includes(n));
      return `<p class="hoja-x">It goes away in 72 h and I tell you what was deleted.</p><div class="ops">${chats.map(n => `<button type="button" class="op op-peligro" data-accion="borra" data-n="${esc(n)}">${VETA.ic('borrar', 22)}<span class="op-c"><span class="op-t">${esc(n)}</span></span></button>`).join('')}</div>` + cerrar('Cancel');
    },
    acciones: {
      borra(ev, el) { const n = el.dataset.n; C.pon('borrados', C.lee('borrados', []).concat([{nombre: n, hora: VETA.ahora()}])); VETA.hoja('h30', {de: n}); repintaSiVe('cuenta/chats'); }
    }
  });

  // ---- H31 · Poner Veta en la pantalla de inicio ----
  // Son instrucciones, no botones: pasos numerados sin marco. Lo único tocable hace algo (“Copiar la dirección”, “Cerrar”).
  // C.inicio(): 'hecho' (ya abierta desde el icono) · 'ios-safari' · 'ios-otro' (navegador de dentro de otra app, Chrome…) · 'android' · 'ordenador'
  C.inicio = () => {
    try { if (navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches)) return 'hecho'; } catch (e) {}
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (ios) return /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|DuckDuckGo|FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Line\/|Twitter|WhatsApp|Telegram|Snapchat|Pinterest/.test(ua) ? 'ios-safari' : 'ios-otro';
    return /Android/.test(ua) ? 'android' : 'ordenador';
  };
  const compartir = `<span class="c-paso-ic" aria-label="Share">${VETA.ic('compartir', 20)}</span>`;
  const pasosH = l => `<ol class="c-pasos-h">${l.map((t, k) => `<li><span class="c-paso-n" aria-hidden="true">${k + 1}</span><span class="c-paso-t">${t}</span></li>`).join('')}</ol>`;
  const copiarDir = UI.boton({tipo: 'secundario', texto: 'Copy the address', icono: 'copiar', accion: 'copia-dir'});
  VETA.hojaDef('h31', {
    titulo: () => C.inicio() === 'hecho' ? 'Veta is already on your home screen' : 'Add Veta to your home screen',
    pinta: () => {
      const v = C.inicio();
      if (v === 'hecho') return `<p class="hoja-x">It's already done: you opened Veta from its icon, in full screen.</p>` + cerrar(null, 'secundario');
      const gana = `<p class="hoja-x">You'll have the Veta icon on your phone and it will open in full screen, without the browser bar.</p>`;
      if (v === 'ios-safari') return gana + pasosH([`Tap Share ${compartir} in the Safari bar. If you don't see it, tap “···” first.`,
        'Scroll down the list and tap “Add to Home Screen”.', 'Tap “Add”. The Veta icon appears on your home screen.']) + cerrar(null, 'secundario');
      if (v === 'android') return gana + pasosH(['Tap Chrome\'s ⋮ menu, top right.', 'Tap “Add to Home screen” and then “Add”.']) +
        `<p class="hoja-x tenue">Can't see that menu? Open this address in Chrome.</p>` + copiarDir + cerrar();
      const donde = v === 'ordenador' ? 'Open this address in Safari, on your iPhone.' : 'Open this address in Safari. It can\'t be done from here: this is another app\'s browser.';
      return gana + pasosH([esc(donde), `In Safari, tap Share ${compartir}.`, 'Tap “Add to Home screen” and then “Add”.']) + copiarDir + cerrar();
    },
    acciones: {
      'copia-dir'() { VETA.copia(location.href.split('#')[0]); VETA.aviso('Address copied. Paste it into Safari.'); }
    }
  });

  // ---- H32 · Un hallazgo del mapa ----
  VETA.hojaDef('h32', {
    titulo: d => (C.hallazgo(d.hallazgo) || {}).titulo || 'A finding',
    pinta: d => {
      const f = C.hallazgo(d.hallazgo); if (!f) return cerrar(null, 'secundario');
      return `<p class="hoja-x">${esc(f.texto)}</p>` + (f.citas || []).map(c => citaQuieta(c.texto, c.origen)).join('') +
        (f.boton ? UI.boton(f.boton) + cerrar() : cerrar(null, 'secundario'));
    }
  });

  // ---- H33 · Calendario ----
  VETA.hojaElegir('h33', {
    titulo: 'Calendar', texto: 'I read your appointments; I don\'t change them.',
    opciones: () => D().calendarios.map(c => ({id: c, texto: c})),
    valor: () => C.calendario(),
    alElegir: op => {
      const antes = C.calendario(); C.pon('calendario', op.id); VETA.repinta();
      VETA.aviso('Calendar connected: ' + op.id, {deshacer: () => { C.pon('calendario', antes); VETA.repinta(); }});
    }
  });

  // ---- c-lista · Tu lista de cada día (A14) ----
  VETA.hojaDef('c-lista', {
    titulo: 'Your daily list',
    pinta: () => {
      const l = D().lista, max = l.antes;
      return `<p class="hoja-x">Cards in your Today, per week. Fewer cards: I handle the rest.</p><div class="c-barras">` +
        [['At the start', l.antes]].concat(l.semanas).map(([t, n], k) => `<div class="c-barra" style="--v:${n / max};--k:${k}"><span class="c-barra-n">${esc(t)}</span><span class="c-barra-t" aria-hidden="true"><i></i></span><b class="c-barra-v">${n}</b></div>`).join('') +
        `</div>` + cerrar(null, 'secundario');
    }
  });

  // ---- c-mano · Lo que aún haces a mano (A14) ----
  VETA.hojaDef('c-mano', {
    titulo: 'What you still do by hand',
    pinta: () => `<p class="hoja-x">Work that repeats in your chats and that you still do yourself.</p><div class="lista c-hoja-lista">` +
      D().aMano.map(([t, n]) => UI.fila({titulo: t, derecha: n + ' times', icono: 'mano'})).join('') + `</div>` +
      UI.boton({texto: 'See the first one', ir: 'regla/r-valoraciones'}) + cerrar()
  });

  // ---- c-avisos · Avisos (A15) ----
  VETA.hojaDef('c-avisos', {
    titulo: 'Alerts',
    pinta: () => {
      const av = C.lee('avisos', false);
      return `<p class="hoja-x">I only alert you about what can't wait.</p>` +
        (av ? UI.lineaHecho({texto: 'Alerts allowed', hora: av, boton: {texto: 'Undo', accion: 'quita'}}) : UI.boton({texto: 'Allow alerts', icono: 'campana', accion: 'permite'})) +
        `<div class="lista">${UI.interruptor({texto: 'Get the wrap-up by email at 19:30', sub: 'The day\'s summary, in your email', on: C.lee('parteCorreo', false), accion: 'parte'})}</div>` + cerrar(null, 'secundario');
    },
    acciones: {
      permite() { C.pon('avisos', VETA.ahora()); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      quita() { C.pon('avisos', false); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      parte(ev, el) { C.pon('parteCorreo', el.getAttribute('aria-checked') === 'true'); }
    }
  });

  // ---- c-anadir · Añadir un chat a la lista (A15b) ----
  VETA.hojaDef('c-anadir', {
    titulo: 'Add a chat to this list',
    pinta: () => `<p class="hoja-x">Veta stops reading it and it disappears from Today and Clients.</p><div class="ops">${M.clientes(VETA.yo().id).map(c =>
      `<button type="button" class="op" data-accion="fuera" data-c="${esc(c.id)}">${VETA.av(c.id, 40)}<span class="op-c"><span class="op-t">${esc(c.nombre)}</span>${c.quienEs ? `<span class="op-s">${esc(c.quienEs)}</span>` : ''}</span></button>`).join('')}</div>` + cerrar('Cancel'),
    acciones: {
      fuera(ev, el) {
        const id = el.dataset.c; M.pon('chats-fuera', M.lee('chats-fuera', []).concat(id)); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`${nombre(id)} is left out. Veta doesn't read it.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }});
      }
    }
  });
})();
