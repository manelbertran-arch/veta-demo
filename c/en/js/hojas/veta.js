/* Veta demo · hojas · veta.js · carril C (Veta y cuenta)
   Todas salen de las tres plantillas (acciones, texto, elegir), salvo las que llevan campos (h24, c-avisos) y las instrucciones de h31;
   ninguna lleva iconos a la izquierda.
   De siempre: h18 Un caso · h19 Los casos iguales · h20 Cambiar algo (de un trabajo; con la forma de “Más”) · h21 Qué he entendido · h22 Subir un paso ·
   h23 Una práctica · h24 Tus tiempos · h25 Una semana anterior · h28 Sin señal · h30 ¿Qué chat borras? · h31 Poner Veta en la pantalla
   de inicio · h32 Un hallazgo del mapa  · c-mano (lo que aún haces a mano) · c-avisos · c-anadir (añadir un chat).
   Ronda 8 (lo que antes se desplegaba en la fila, ahora en una hoja): c-lee (un texto corto, según `que`) · c-veces (los casos de un
   trabajo) · c-excepto (no con un cliente) · c-nohago (lo que ya no hago) · c-cerre (lo que cerré sola) · c-aprendido (una cosa
   aprendida) · c-chat (un chat que no leo) · c-confirma (desconectar WhatsApp, volver a empezar).
   Datos que reciben (data-* del botón): h18 regla, caso · h19 regla · h20 de (regla) · h22 de (regla) · h23 practica ·
   h25 semana (26-oct | 2-nov | 9-nov | 16-nov; sin ella, elige) · h30 de (nombre ya borrado: enseña su recibo) · h32 hallazgo ·
   c-lee que (+ regla) · c-veces regla · c-excepto de · c-aprendido de · c-chat n | cliente · c-confirma que. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;
  const nombre = id => (M.quien(id) || {}).nombre || id;
  const repintaSiVe = rutaEmpieza => { const a = VETA.actual(); if (a && a.ruta.indexOf(rutaEmpieza) === 0) VETA.repinta(); };
  const mayus = t => String(t || '').replace(/^./, c => c.toUpperCase());
  // una cita: tarjeta con comillas y de dónde sale
  const cita = (texto, origen) => R7().tarjeta({de: origen, texto: `“${texto}”`});
  // dirección abre estas hojas desde G2b (un trabajo de la oficina): ve los casos como hechos de la oficina, nunca el texto de un cliente de una agente
  // (la cita pasa por la puerta de siempre, UI.cita) y sin “lo hiciste”; las excepciones y el “con él, no” son de quien lleva a ese cliente
  const dirige = () => VETA.yo().papel === 'direccion';
  const deOficina = id => !!(VETA.datos.reglasOficina || {})[id];

  // ---- h18 · Un caso ----
  const caso = d => {
    if (d.regla === 'r-cancelaciones') return {tipo: 'prueba', x: D().aPrueba.find(c => c.id === d.caso)};
    const r = M.regla(d.regla), c = r && r.casos && r.casos.distinto && r.casos.distinto.find(y => y.cliente === d.caso);
    return {tipo: 'distinto', x: c, extra: D().distinto[d.caso] || {}};
  };
  const cortoDe = k => k.x.nombre.split(' ')[0], yaExcepto = d => C.excepciones(d.regla).includes(d.caso);
  VETA.hojaTexto('h18', {
    titulo: d => { const k = caso(d); return k.x ? `${k.x.nombre} · ${k.x.cuando}` : 'A case'; },
    bloques: d => {
      const k = caso(d); if (!k.x) return [{texto: 'This case is no longer here.'}];
      if (k.tipo === 'prueba') return [{html: cita(k.x.cita, k.x.origen)}, {texto: `${k.x.propone}. This is the message I would have left you:`},
        {html: R7().tarjeta({veta: true, de: 'I didn\'t send it: I\'m trying it', texto: k.x.borrador})}];
      if (dirige()) return [{html: VETA.verLiteral(d.caso) ? UI.cita({chat: d.caso, texto: k.x.texto, origen: k.extra.origen || ''})
        : `<p class="cita cita-ajena">${VETA.ic('candado', 18)}<span>Management does not read each person's chats.</span></p>`}, {texto: k.extra.habriaOf || ''}];   // sin nombre de agente: nada por persona
      return [{html: cita(k.x.texto, k.extra.origen || '')}, {texto: k.extra.habria || ''}, yaExcepto(d) ? {texto: `With ${cortoDe(k)} I don't do it any more.`} : null];
    },
    boton: d => { const k = caso(d); return k.x && k.tipo !== 'prueba' && !yaExcepto(d) && !dirige() ? {texto: `With ${cortoDe(k)}, don't do it`, accion: 'excepcion'} : null; },
    acciones: {
      excepcion(ev, el, d) {
        C.ponExcepcion(d.regla, d.caso); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`Exception: not with ${nombre(d.caso)}`, {deshacer: () => { C.quitaExcepcion(d.regla, d.caso); VETA.repinta(); }});
      }
    }
  });

  // ---- h19 · Los casos iguales ----
  VETA.hojaTexto('h19', {
    titulo: d => (d.regla === 'r-recordatorios' ? 'Where it applies' : `${(((M.regla(d.regla) || {}).casos || {}).comoYo || []).length} times you did it the same way`),
    bloques: d => {
      const r = M.regla(d.regla) || {}, l = d.regla === 'r-recordatorios' ? (r.casos || []) : ((r.casos || {}).comoYo || []);
      return [{texto: d.regla === 'r-recordatorios' ? 'A buyer took more than three days to reply to you. A reminder would have been due here.' : 'Someone asked for a valuation and the next day you sent them the flat report.'},
        {lista: l.map(c => `${c.nombre} · ${c.cuando}`)}];
    }
  });

  // ---- c-veces · Las veces que lo hiciste distinto, una a una (h18). Las iguales (h19) y los casos de la prueba se abren desde la pantalla ----
  VETA.hojaAcciones('c-veces', {
    titulo: d => { const n = ((((M.regla(d.regla) || {}).casos || {}).distinto) || []).length; return dirige() ? `${n} times it was done differently` : `${n} times you did it differently`; },
    opciones: d => {
      const k = (M.regla(d.regla) || {}).casos || {}, ex = C.excepciones(d.regla);
      return (k.distinto || []).map(c => ({cara: c.cliente, texto: `${c.nombre} · ${c.cuando}`, sub: dirige() ? ((D().distinto[c.cliente] || {}).motivoOf || 'It was done differently') : ((D().distinto[c.cliente] || {}).motivo || 'You did it differently') + (ex.includes(c.cliente) ? ' · not with him' : ''), hoja: 'h18', datos: {caso: c.cliente}}));
    }
  });

  // ---- h20 · Cambiar algo (de un trabajo): la forma de “Más”. Lo frecuente primero, “Decirlo de otra forma” (lleva a Dictar con
  // este trabajo como caso) y lo que lo quita, al final y en rojo. “No con un cliente” sale aquí solo en una propuesta: cuando el
  // trabajo ya lo hago yo, es una fila de su pantalla ----
  VETA.hojaMas('h20', {
    titulo: 'Change something',
    ensena: 'Put it another way',
    opciones: d => {
      if (deOficina(d.de)) return [{texto: 'Not with one client', hoja: 'c-excepto'}];   // un trabajo de la oficina (G2b): lo demás —“Para luego”, “Descartarlo”— está en su “Más”
      const r = M.regla(d.de) || {}, activa = r.estado === 'activa', ofi = C.lee('aOficina', {})[d.de];
      return [
        r.estado === 'a-prueba' ? {texto: 'Make it do it now, without waiting for 7 Dec', hace: () => C.cambiaRegla(d.de, 'activa', 'I already do it · I\'ll leave it in Home')} : null,
        r.estado === 'propuesta' || r.estado === 'nueva' ? {texto: 'Not with one client', hoja: 'c-excepto'} : null,
        ofi ? null : {texto: 'Suggest it to the office', hace: () => {
          const o = C.lee('aOficina', {}); o[d.de] = VETA.ahora(); C.pon('aOficina', o); VETA.repinta();
          VETA.aviso('I have suggested it to the office, with your name', {deshacer: () => { const x = C.lee('aOficina', {}); delete x[d.de]; C.pon('aOficina', x); VETA.repinta(); }});
        }},
        {texto: activa ? 'Stop doing it' : 'I do not want it', peligro: true, hace: () => C.cambiaRegla(d.de, 'descartada', activa ? 'I don\'t do it any more · stopped today' : 'I no longer do it · I will not suggest it again')}
      ];
    }
  });
  // ---- c-excepto · No con un cliente ----
  VETA.hojaAcciones('c-excepto', {
    titulo: 'Not with one client', texto: 'With whoever you choose, I won\'t do it.',
    opciones: d => { const ex = C.excepciones(d.de); return M.clientes(VETA.yo().id).filter(c => !ex.includes(c.id)).map(c => ({cara: c.id, texto: c.nombre, hace: () => {
      C.ponExcepcion(d.de, c.id); VETA.repinta();
      VETA.aviso(`Exception: not with ${c.nombre}`, {deshacer: () => { C.quitaExcepcion(d.de, c.id); VETA.repinta(); }});
    }})); }
  });

  // ---- h21 · Qué he entendido, por partes: tocar una es cambiarla ----
  VETA.hojaAcciones('h21', {
    titulo: 'What I understood', texto: 'Tap a part to change it.',
    opciones: () => D().orden.partes.map(x => ({texto: x.titulo, sub: x.texto, ir: x.id === 'llega' ? 'regla/r-recordatorios/nivel' : 'dictar/orden'}))
  });

  // ---- h22 · Subir un paso (dirección) ----
  VETA.hojaTexto('h22', {
    titulo: 'Go up one step',
    bloques: d => {
      if (deOficina(d.de)) {   // un trabajo de la oficina (G2b): sus pasos son los de la pantalla, no los de una agente
        const s = VETA.d1.sigPaso(d.de), r = VETA.datos.reglasOficina[d.de];
        return [{titulo: 'Who it\'s for', texto: 'For the whole team.'},
          s ? {titulo: 'What changes', texto: `“${r.corto || r.titulo}” goes from “${s.de.nombre}” to “${s.a.nombre}”. ${s.a.texto}`} : null];
      }
      return [{titulo: 'Who it\'s for', texto: 'For the whole team.'},
        {titulo: 'What changes', texto: `“${C.nombre(d.de)}” goes from “I write it for you” to “I note it down”: I note, mark and save. I send nothing.`}];
    },
    boton: d => (deOficina(d.de) && !VETA.d1.sigPaso(d.de) ? null : {texto: 'Yes, go up one step', accion: 'subir'}),
    acciones: {
      subir(ev, el, d) {
        if (deOficina(d.de)) { VETA.cierraHoja({foco: false}); VETA.d1.subePaso(d.de); return; }
        const antes = C.nivel(d.de); C.ponNivel(d.de, 3);
        C.pon('nivelLinea', {id: d.de, texto: 'I note it down · from today', hora: VETA.ahora(), subido: antes});
        VETA.cierraHoja({foco: false}); VETA.repinta({hecho: 'c-nivel'});
      }
    }
  });

  // ---- h23 · Una práctica de la oficina ----
  const SIGUE = {propuesta: {texto: 'Try it for two weeks', estado: 'a-prueba', estadoTexto: 'We are trying it · day 1 of 14', aviso: 'We try it for two weeks'},
    'a-prueba': {texto: 'Extend it to the whole team', estado: 'en-marcha', estadoTexto: 'In use', aviso: 'Extended to the whole team'}};
  // el botón solo en las prácticas que se deciden aquí; las que tienen pantalla en dirección (C.conPantalla) se deciden en ella
  const sigueDe = x => (x && VETA.yo().papel === 'direccion' && !(C.conPantalla && C.conPantalla(x.id)) && SIGUE[x.estado]) || null;
  VETA.hojaTexto('h23', {
    titulo: d => { const x = C.practicas().find(y => y.id === d.practica) || {}; return x.corto || x.titulo || 'A practice'; },
    bloques: d => {
      const x = C.practicas().find(y => y.id === d.practica);
      if (!x) return [{texto: 'This practice is no longer here.'}];
      const dir = VETA.yo().papel === 'direccion';
      return [{titulo: 'What it is', texto: x.titulo}, {titulo: 'How it is going', texto: x.estadoTexto}, {titulo: 'Who proposed it', texto: mayus(x.propuso)}, {titulo: 'How many people use it', texto: mayus(x.usan)},
        {titulo: 'What case it came from', texto: x.caso}, sigueDe(x) ? null : !dir ? {texto: 'Management decides. You see it here so you know how the office works.'} : x.estado === 'en-marcha' && !SIGUE[x.estado] ? {texto: 'The whole team already uses it.'} : null];
    },
    boton: d => { const s = sigueDe(C.practicas().find(y => y.id === d.practica)); return s ? {texto: s.texto, accion: 'sigue'} : null; },
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

  // ---- h24 · Tus tiempos ----
  let borrador = null;
  VETA.hojaDef('h24', {
    titulo: 'Your times',
    pinta: () => {
      const t = borrador || M.lee('tiempos', null) || {};
      return `<p class="hoja-x">Veta doesn't make up hours. Tell me yours.</p><div class="c-tiempos">${D().tiempos.map(x => {
        const v = t[x.id] != null ? t[x.id] : x.min;
        return `<div class="c-tmp"><span class="c-tmp-n">${esc(x.texto)}</span><div class="c-paso">` +
          UI.boton({tipo: 'redondo', texto: 'One minute less', icono: 'menos', accion: 'menos', datos: {t: x.id}}) +
          `<b class="c-paso-v" id="c-t-${x.id}">${v} min</b>` + UI.boton({tipo: 'redondo', texto: 'One minute more', icono: 'mas', accion: 'mas', datos: {t: x.id}}) + `</div></div>`;
      }).join('')}</div>` + UI.boton({texto: 'Save my times', accion: 'guardar'});
    },
    alMontar: () => { if (!borrador) { const t = M.lee('tiempos', null); borrador = {}; D().tiempos.forEach(x => { borrador[x.id] = t && t[x.id] != null ? t[x.id] : x.min; }); } },
    alCerrar: () => { borrador = null; },
    acciones: {
      menos(ev, el) { cambia(el.dataset.t, -1); }, mas(ev, el) { cambia(el.dataset.t, 1); },
      guardar() {
        const t = Object.assign({}, borrador); borrador = null;
        M.pon('tiempos', t); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('Times saved', {deshacer: () => { M.deshazFlag('tiempos'); VETA.repinta(); }});
      }
    }
  });
  function cambia(id, d) {
    borrador[id] = Math.max(1, Math.min(60, (borrador[id] || 1) + d));
    const b = document.getElementById('c-t-' + id); if (b) { b.dataset.rueda = b.dataset.rueda || b.textContent; VETA.rueda(b, borrador[id] + ' min'); }
  }

  // ---- h25 · Una semana anterior ----
  // Sin semana elegida, la lista de semanas; con ella, sus cifras y el botón para ver otra. Dirección ve solo la cifra de la oficina
  // (los mensajes y actas de la semana son de la agente).
  const semanaDe = d => D().semanas.find(x => x.id === d.semana);
  VETA.hojaAcciones('h25', {
    titulo: d => { const s = semanaDe(d); return s ? s.texto : 'Previous weeks'; },
    bloques: d => {
      const s = semanaDe(d), dir = VETA.yo().papel === 'direccion'; if (!s) return null;
      return [dir ? null : {titulo: 'Messages I wrote for you', texto: `${s.mensajes} · you sent ${s.enviados}`}, dir ? null : {titulo: 'Viewing notes saved', texto: String(s.actas)},
        {titulo: 'Messages and tasks ready in the office', texto: VETA.num(s.preparados)}, {texto: 'No hours: they only come from the times each person enters.'}];
    },
    opciones: d => {
      const dir = VETA.yo().papel === 'direccion'; if (semanaDe(d)) return [];
      return D().semanas.slice().reverse().map(x => ({texto: x.texto, sub: `${dir ? '' : x.mensajes + ' messages prepared · '}${x.preparados} ready in the office`, hoja: 'h25', datos: {semana: x.id}}));
    },
    boton: d => (semanaDe(d) ? {tipo: 'secundario', texto: 'Other weeks', hoja: 'h25'} : null)
  });

  // ---- h28 · Sin señal ----
  VETA.hojaTexto('h28', {
    titulo: 'No signal',
    bloques: () => [{texto: 'You can still see your clients and their profiles.'}, {texto: 'In the queue: 2 things you told me · 1 reply.'},
      {texto: 'They go out when the signal is back. Every message still needs your approval.'}]
  });

  // ---- h30 · ¿Qué chat borras? y recibo de borrado ----
  const borrables = () => { const ya = C.lee('borrados', []).map(b => b.nombre); return M.lectura().fuera.concat(M.clientes(VETA.yo().id).slice(0, 6).map(c => c.nombre)).filter(n => !ya.includes(n)); };
  VETA.hojaAcciones('h30', {
    titulo: d => (d.de ? 'What was deleted' : 'Which chat to delete?'),
    texto: d => (d.de ? '' : 'You can ask me to delete a chat whenever you like. I\'ll tell you what I deleted.'),
    bloques: d => (d.de ? [{titulo: d.de, texto: '1 conversation · requested today · I\'ll tell you here once it\'s deleted'}, {texto: 'Whatever was already on a client\'s profile stays on the profile.'}] : null),
    opciones: d => (d.de ? [] : borrables().map(n => ({texto: n, peligro: true, cierra: false,
      hace: () => { C.pon('borrados', C.lee('borrados', []).concat([{nombre: n, hora: VETA.ahora()}])); VETA.hoja('h30', {de: n}); repintaSiVe('cuenta/chats'); }})))
  });

  // ---- h31 · Poner Veta en la pantalla de inicio ----
  // Son instrucciones, no botones: pasos numerados sin marco. Lo único tocable hace algo (“Copiar la dirección”).
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
      if (v === 'hecho') return `<p class="hoja-x">It's already done: you opened Veta from its icon, in full screen.</p>`;
      const gana = `<p class="hoja-x">You'll have the Veta icon on your phone and it will open in full screen, without the browser bar.</p>`;
      if (v === 'ios-safari') return gana + pasosH([`Tap Share ${compartir} in the Safari bar. If you don't see it, tap “···” first.`,
        'Scroll down the list and tap “Add to Home Screen”.', 'Tap “Add”. The Veta icon appears on your home screen.']);
      if (v === 'android') return gana + pasosH(['Tap Chrome\'s ⋮ menu, top right.', 'Tap “Add to Home screen” and then “Add”.']) +
        `<p class="hoja-x tenue">Can't see that menu? Open this address in Chrome.</p>` + copiarDir;
      const donde = v === 'ordenador' ? 'Open this address in Safari, on your iPhone.' : 'Open this address in Safari. It can\'t be done from here: this is another app\'s browser.';
      return gana + pasosH([esc(donde), `In Safari, tap Share ${compartir}.`, 'Tap “Add to Home screen” and then “Add”.']) + copiarDir;
    },
    acciones: {
      'copia-dir'() { VETA.copia(location.href.split('#')[0]); VETA.aviso('Address copied. Paste it into Safari.'); }
    }
  });

  // ---- h32 · Un hallazgo del mapa ----
  VETA.hojaTexto('h32', {
    titulo: d => (C.hallazgo(d.hallazgo) || {}).titulo || 'A finding',
    bloques: d => { const f = C.hallazgo(d.hallazgo); return f ? [{texto: f.texto}].concat((f.citas || []).map(c => ({html: cita(c.texto, c.origen)}))) : []; },
    boton: d => (C.hallazgo(d.hallazgo) || {}).boton || null
  });

  // ---- c-mano · Lo que aún haces a mano (A14) ----
  VETA.hojaTexto('c-mano', {
    titulo: 'What you still do by hand',
    bloques: () => [{texto: 'Work that repeats in your chats and that you still do yourself.'}, {lista: D().aMano.map(([t, n]) => `${t} · you've done it ${n} times`)}],
    boton: {texto: 'See the first one', ir: 'regla/r-valoraciones'}
  });

  // ---- c-avisos · Avisos (A15) ----
  VETA.hojaDef('c-avisos', {
    titulo: 'Alerts',
    pinta: () => {
      const av = C.lee('avisos', false);
      return `<p class="hoja-x">I only alert you about what can't wait.</p>` +
        (av ? R7().hecho({texto: 'Alerts allowed', hora: av, deshacer: 'quita'}) : UI.boton({texto: 'Allow alerts', accion: 'permite'})) +
        R7().lista([UI.interruptor({texto: 'Get the day\'s summary at 19:30', on: C.lee('parteCorreo', false), accion: 'parte'})]);
    },
    acciones: {
      permite() { C.pon('avisos', VETA.ahora()); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      quita() { C.pon('avisos', false); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      parte(ev, el) { C.pon('parteCorreo', el.getAttribute('aria-checked') === 'true'); }
    }
  });

  // ---- c-anadir · Añadir un chat a la lista (A15b) ----
  VETA.hojaAcciones('c-anadir', {
    titulo: 'Add a chat', texto: 'Veta stops reading it and it leaves Home and Clients.',
    opciones: () => M.clientes(VETA.yo().id).map(c => ({cara: c.id, texto: c.nombre, sub: c.quienEs || null, hace: () => {
      M.pon('chats-fuera', M.lee('chats-fuera', []).concat(c.id)); VETA.repinta();
      VETA.aviso(`${c.nombre} is left out. Veta doesn't read it.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }});
    }}))
  });

  // ---- c-chat · Un chat de “Chats que no leo” (A15b): sacarlo de la lista o dejarlo fuera otra vez ----
  VETA.hojaAcciones('c-chat', {
    titulo: d => (C.chat(d) || {}).nombre || 'A chat',
    texto: d => { const x = C.chat(d) || {}; return x.cliente ? 'It\'s a client. I stop reading it today.' : x.leo ? 'I\'m reading it again.' : 'I haven\'t read it since 3 September.'; },
    opciones: d => [{texto: (C.chat(d) || {}).leo ? 'Leave out again' : 'Remove from the list: let Veta read it', hace: () => C.cambiaChat(d)}]
  });

  // ---- c-confirma · Desconectar WhatsApp o volver a empezar (A15): se confirma aquí ----
  VETA.hojaAcciones('c-confirma', {
    titulo: d => (d.que === 'reinicio' ? 'Start again?' : 'Disconnect WhatsApp?'),
    texto: d => (d.que === 'reinicio' ? 'What you\'ve done in the demo is erased.' : 'Veta will stop reading your chats.'),
    opciones: d => [d.que === 'reinicio' ? {texto: 'Start again', peligro: true, hace: () => C.reinicia()} : {texto: 'Disconnect', peligro: true, hace: () => C.desconecta()}]
  });

  // ---- c-nohago · Lo que ya no hago (Veta › Además) ----
  VETA.hojaAcciones('c-nohago', {
    titulo: 'What I no longer do', texto: 'You told me no. Tap one if you change your mind.',
    opciones: () => C.noHago().map(r => ({texto: C.corto(r.id), ir: 'regla/' + r.id}))
  });

  // ---- c-cerre · Lo que cerré yo sola (Tu semana): tocar una es abrirla otra vez (misma clave que el Inicio: a.r6.abiertas) ----
  VETA.hojaAcciones('c-cerre', {
    titulo: 'What I closed on my own', texto: 'I took it as done without asking you. Tap one and I\'ll open it again.',
    opciones: () => C.cerradas().map(x => ({texto: x.titulo, sub: x.texto, hace: () => {
      const ab = VETA.est.lee('a.r6.abiertas', []) || []; if (!ab.includes(x.id)) ab.push(x.id);
      VETA.est.pon('a.r6.abiertas', ab); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('OK. It\'s in Home.');
    }}))
  });

  // ---- c-aprendido · Una cosa aprendida (A13): pararla un tiempo u olvidarla ----
  VETA.hojaAcciones('c-aprendido', {
    titulo: d => (C.aprendido(d.de) || {}).corto || 'What I\'ve learned',
    opciones: d => { const x = C.aprendido(d.de); return x ? [{texto: x.on ? 'Stop it for a while' : 'Use it again', hace: () => C.usaAprendido(d.de)}, {texto: 'Forget it', peligro: true, hace: () => C.olvidaAprendido(d.de)}] : []; }
  });

  // ---- c-lee · Un texto corto, según `que` ----
  const LEE = {
    pasara: d => ({titulo: 'What will happen', bloques: [{texto: d.regla === 'r-visitas' ? C.visitas().manana
      : 'When someone asks for a valuation, I get the flat report ready for you the next day. You check it and send it.'}]}),
    veces: () => { const v = C.r6().visitas; return {titulo: `The ${v.hechas} times`, bloques: [{lista: v.casos.map(c => `${c.nombre} · ${c.distinto || c.cuando}`)}]}; },
    'quien-ve': d => { const ofi = C.lee('aOficina', {})[d.regla]; return {titulo: 'Who sees it', bloques: [{texto: ofi ? `You suggested it to the office at ${ofi}: Montse sees it with your name.`
      : 'This trial is only yours: Montse does not see it. If you suggest it to the office, from “Change something”, Montse will see it with your name.'}]}; },
    ultimo: d => ({titulo: 'The last thing I did', bloques: [{lista: C.ultimo(M.regla(d.regla) || {})}]}),
    cambio: () => { const a = C.r6().antesAhora; return {titulo: 'What changed', bloques: [{titulo: 'Before', lista: a.antes.filas}, {titulo: 'Now', lista: a.ahora.filas}]}; },
    aprende: () => ({titulo: 'How Veta learns', bloques: D().aprende.map(([t, x]) => ({titulo: t, texto: x}))}),
    ven: () => ({titulo: 'What others see', bloques: [{texto: 'In the team\'s week, your numbers appear next to each person\'s. Nobody sees what you write in your chats.'}]}),
    'direccion-ve': () => ({titulo: 'What management sees', bloques: C.direccionVe()})
  };
  const leeDe = d => { try { return (LEE[d.que] || (() => null))(d) || {titulo: '', bloques: []}; } catch (e) { return {titulo: '', bloques: [{texto: 'I couldn\'t load this.'}]}; } };
  VETA.hojaTexto('c-lee', {titulo: d => leeDe(d).titulo, bloques: d => leeDe(d).bloques});
})();
