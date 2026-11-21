/* Veta demo · hojas · clientes.js · paquete B (Clientes)
   H10 Nota de voz · H11 Otras acciones · H12 Compartir resumen · H13 Fuera del radar · H14 Petición lista ·
   H15 ¿Qué pasó con…? · H16 Detalle de historia · H39 Anotar una queja.
   data-de: un cliente («pere») o una cosa de la cola o de En espera («c-pere», «e-pere»); las hojas sacan de ahí el cliente. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const cerrar = (t, tipo) => UI.boton({tipo: tipo || 'texto', texto: t || 'Cancel', datos: {cierra: '1'}, clase: 'hoja-cancela'});
  const espera = id => M.espera(VETA.yo().id).find(x => x.id === id) || M.espera('laura').find(x => x.id === id) || null;
  const cosaDe = id => M.cosa(id) || espera(id);
  const cliDe = d => { if (M.cliente(d.de)) return d.de; const k = cosaDe(d.de); return (k && k.cliente) || 'pere'; };

  // ---- H10 · Nota de voz de Pere · 0:48 ----
  const DUR = 4000;
  let reloj = null;
  VETA.hojaDef('h10', {
    titulo: 'Pere\'s voice note · 0:48',
    pinta: d => {
      const oida = B.lee('notaPere', null), fase = d.fase || '';
      if (VETA.ajeno('pere')) return `<p class="hoja-x">${esc(VETA.chatAjenoTexto('pere'))}</p>` + cerrar('Close');
      return `<div class="b-voz"><p class="hoja-x"><b>What he says:</b> “Laura, if it's needed to close, I'll go down to €385,000, but no lower.”</p>` +
        `<p class="hoja-x tenue">Pere · WhatsApp · Sat 21, 21:10</p>` +
        `<div class="b-audio${fase === 'oido' ? ' end' : ''}" aria-hidden="true"><span class="b-audio-l"><i></i></span><span class="b-audio-t"><span class="b-audio-a">${fase === 'oido' ? '0:48' : '0:00'}</span> / 0:48</span></div>` +
        UI.nota({texto: 'It doesn\'t play in this demo: this is the text of the note.', clase: 'nota-gris'}) + '</div>' +
        (fase === 'oido' ? UI.boton({texto: 'I\'ve listened', icono: 'check', accion: 'oido'})
          : oida ? UI.nota({texto: `You listened to it today at ${oida}.`, icono: 'check', caja: true}) + UI.boton({tipo: 'secundario', texto: 'Listen again', icono: 'play', accion: 'escuchar'})
          : UI.boton({texto: 'Listen', icono: 'play', accion: 'escuchar'})) +
        cerrar(oida || fase === 'oido' ? 'Close' : 'Not now');
    },
    acciones: {
      escuchar(ev, el, d) {
        const h = el.closest('#hoja'), a = h.querySelector('.b-audio'), t = h.querySelector('.b-audio-a');
        el.disabled = true; el.querySelector('span').textContent = 'Escuchando…';
        const fin = () => { reloj = null; if (VETA.hojaActual() && VETA.hojaActual().id === 'h10') VETA.hoja('h10', Object.assign({}, d, {fase: 'oido'})); };
        if (VETA.reducido()) { fin(); return; }
        a.style.setProperty('--dur', DUR + 'ms'); a.classList.add('on');
        const t0 = performance.now();
        const paso = now => {
          const s = Math.min(48, Math.floor((now - t0) / DUR * 48));
          t.textContent = '0:' + String(s).padStart(2, '0');
          if (now - t0 < DUR) reloj = requestAnimationFrame(paso); else fin();
        };
        reloj = requestAnimationFrame(paso);
      },
      oido() {
        B.pon('notaPere', VETA.ahora()); M.pon('nota-pere-escuchada', true);
        VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('Noted: you\'ve already listened to Pere\'s note.', {deshacer: () => { B.pon('notaPere', null); M.deshazFlag('nota-pere-escuchada'); VETA.repinta(); }});
      }
    },
    alCerrar() { if (reloj) cancelAnimationFrame(reloj); reloj = null; }
  });

  // ---- H11 · «Otras acciones» (título: el nombre del cliente) ----
  const marca = (id, k, v) => { const m = Object.assign({}, B.mapa('marcas')[id] || {}); if (v == null) delete m[k]; else m[k] = v; B.ponEn('marcas', id, Object.keys(m).length ? m : null); VETA.repinta(); };
  VETA.hojaAcciones('h11', {
    titulo: d => (M.cliente(cliDe(d)) || {}).nombre || 'Other actions',
    opciones: d => {
      const id = cliDe(d), c = M.cliente(id) || {}, nom = B.corto(c), m = B.mapa('marcas')[id] || {};
      // dirección con el cliente de otra persona: solo sus marcas (preguntar, resumir o dictar leerían su chat)
      const l = VETA.ajeno(id) ? [] : [
        {texto: `Ask about ${nom}`, sub: 'I\'ll answer with what\'s in their chats', icono: 'pregunta', ir: id === 'jordi' ? 'pregunta/jordi' : 'pregunta/' + id},
        id === 'pere' ? {texto: 'Owner report', sub: 'This week\'s, as Pere will see it', icono: 'casa', ir: 'informe/pere'} : null,
        {texto: 'Share summary', sub: 'Five lines to copy or send', icono: 'compartir', hoja: 'h12'},
        {texto: 'Dictate a note', sub: `Whatever you want to note about ${nom}`, icono: 'mic', ir: 'dictar/nota'}];
      if (VETA.yo().papel === 'direccion') {
        // sin «Seguir de cerca»: dirección no vigila las operaciones de nadie; «importante», solo en sus clientes
        if (!VETA.ajeno(id)) l.push(m.importante ? {texto: 'Remove “important”', icono: 'aviso', hace: () => marca(id, 'importante', null)}
          : {texto: 'Mark as important', icono: 'aviso', hace: () => marca(id, 'importante', VETA.ahora())});
        l.push({texto: 'Log a complaint', icono: 'globo', hoja: 'h39'});
      }
      return l.filter(Boolean);
    }
  });

  // ---- H12 · Compartir resumen ----
  const resumen = id => {
    const c = B.cli(id) || {}, h = B.historia(id)[0], et = UI.ETIQUETAS[c.estado];
    return [`${c.nombre}${c.tel ? ' · ' + c.tel : ''}`, c.quienEs || '', `Status: ${et ? et[2] : 'New contact'}${c.operacion && c.operacion.texto ? ' · ' + c.operacion.texto : ''}`,
      `Next step: ${c.siguiente && c.siguiente.texto ? c.siguiente.texto.replace(/\.$/, '') : 'nothing pending'}`,
      h ? `Latest: ${h.cuando} · ${h.titulo}${h.texto ? ' · ' + h.texto.replace(/[«»]/g, '') : ''}` : 'Latest: nothing yet'].filter(Boolean).slice(0, 5);
  };
  VETA.hojaDef('h12', {
    titulo: 'Share summary',
    pinta: d => {
      const id = cliDe(d);
      return `<div class="b-resumen">${resumen(id).map(l => `<p>${esc(l)}</p>`).join('')}</div>` +
        UI.nota({texto: 'If you change agent, the history stays with the office.', icono: 'info'}) +
        UI.boton({texto: 'Copy', icono: 'copiar', accion: 'copia'}) + UI.botones([{texto: 'Send by email', accion: 'correo'}]) + cerrar();
    },
    acciones: {
      copia(ev, el, d) { VETA.copia(resumen(cliDe(d)).join('\n')); VETA.cierraHoja({foco: false}); VETA.aviso('Summary copied.'); },
      correo(ev, el, d) { VETA.copia(resumen(cliDe(d)).join('\n')); VETA.cierraHoja({foco: false}); VETA.aviso('No email goes out in this demo. I\'ve copied it for you.'); }
    }
  });

  // ---- H13 · Fuera del radar ----
  VETA.hojaDef('h13', {
    titulo: 'Off the radar',
    pinta: () => {
      const l = (M.lectura().fuera || []).concat((M.lee('chats-fuera', []) || []).map(id => (M.cliente(id) || {}).nombre || id));
      return `<p class="hoja-x">${l.length} personal chats I don't look at:</p>` +
        UI.lista(l.map(n => ({titulo: n, icono: 'candado'}))) +
        `<p class="hoja-x tenue">They don't appear on any screen except this one.</p>` +
        UI.lista([{titulo: 'Change this list', icono: 'editar', ir: 'cuenta/chats'}]) + cerrar('Close', 'secundario');
    }
  });

  // ---- H14 · Petición lista ----
  const docDe = d => {
    const id = cliDe(d), docs = B.docs(id);
    const doc = (d.k && docs.find(x => x.k === d.k)) || docs.find(x => x.estado === 'falta' && x.pedir && !x.pedido) || docs.find(x => x.estado === 'falta' && x.pedir);
    return {id, c: M.cliente(id), doc};
  };
  const textoDe = (id, doc) => B.mapa('textos')[id + '|' + doc.k] || doc.borrador;
  VETA.hojaDef('h14', {
    titulo: 'Request ready',
    pinta: d => {
      const {id, c, doc} = docDe(d);
      if (!doc) return `<p class="hoja-x">No paperwork is missing to ask for from ${esc(B.corto(c))}.</p>` + cerrar('Close', 'secundario');
      const t = textoDe(id, doc);
      if (d.paso === 'editar') {
        return `<p class="hoja-x tenue">For ${esc(c.nombre)}, via WhatsApp.</p>` + UI.campo({etiqueta: 'Your message', area: true, id: 'b-h14-t', valor: t, filas: 5}) +
          UI.boton({texto: 'Done', accion: 'listo'}) + cerrar();
      }
      if (d.paso === 'pregunta') {
        return `<h3 class="tc-preg">Did you send it?</h3>` + UI.boton({texto: 'Yes, sent', accion: 'si'}) + UI.botones([{texto: 'Not yet', accion: 'todavia'}]) +
          UI.nota({texto: 'WhatsApp doesn\'t open in this demo: no message goes out.', clase: 'nota-gris'});
      }
      return `<p class="hoja-x tenue">For ${esc(c.nombre)}, via WhatsApp.</p>` + UI.borrador({texto: t}) +
        UI.nota({texto: 'It doesn\'t go out until you send it', icono: 'candado'}) +
        UI.boton({texto: 'Open WhatsApp with the message', accion: 'abrir'}) + UI.botones([{texto: 'Edit', icono: 'editar', accion: 'editar'}]) + cerrar();
    },
    alMontar: (h, d) => { if (d.paso === 'editar') { const t = h.querySelector('#b-h14-t'); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } } },
    acciones: {
      editar(ev, el, d) { VETA.hoja('h14', Object.assign({}, d, {paso: 'editar'})); },
      listo(ev, el, d) {
        const {id, doc} = docDe(d), t = document.getElementById('b-h14-t');
        if (t && doc) B.ponEn('textos', id + '|' + doc.k, t.value.trim() || null);
        VETA.hoja('h14', Object.assign({}, d, {paso: ''}));
      },
      abrir(ev, el, d) { VETA.hoja('h14', Object.assign({}, d, {paso: 'pregunta'})); },
      todavia(ev, el, d) { VETA.hoja('h14', Object.assign({}, d, {paso: ''})); },
      si(ev, el, d) {
        const {id, c, doc} = docDe(d); if (!doc) return;
        if (doc.cosa) M.marca(doc.cosa, 'enviada', {linea: `Requested from ${B.corto(c)} · ${doc.texto.toLowerCase()}`});
        else B.ponEn('pedidos', id + '|' + doc.k, {hora: VETA.ahora()});
        VETA.cierraHoja({foco: false});
        VETA.repinta(doc.cosa && d.de === doc.cosa ? {hecho: doc.cosa} : {});
        VETA.aviso(`Requested from ${B.corto(c)} · stays in their history.`);
      }
    }
  });

  // ---- H15 · ¿Qué pasó con…? ----
  const opcionesH15 = d => {
    const id = cliDe(d), c = M.cliente(id) || {}, nom = B.corto(c);
    const prop = /^Propietari|^Vendedor|^Owner|^Seller/.test(c.quienEs || '');
    return [{texto: 'Replied', linea: `Noted · ${nom} replied`},
      {texto: 'We arranged a viewing', linea: `Noted · viewing with ${nom}`},
      prop ? {texto: 'Signed the exclusive', linea: `Noted · ${nom} signed the exclusive`} : null,
      {texto: 'Nothing yet', nada: true}].filter(Boolean);
  };
  VETA.hojaDef('h15', {
    titulo: d => `What happened with ${B.corto(M.cliente(cliDe(d)))}?`,
    pinta: d => `<div class="ops">${opcionesH15(d).map((o, k) => `<button type="button" class="op" data-accion="elige" data-n="${k}"><span class="op-c"><span class="op-t">${esc(o.texto)}</span></span></button>`).join('')}</div>` + cerrar(),
    acciones: {
      elige(ev, el, d) {
        const o = opcionesH15(d)[Number(el.dataset.n)]; if (!o) return;
        const id = cliDe(d), c = M.cliente(id) || {};
        VETA.cierraHoja({foco: false});
        if (o.nada) { VETA.aviso(`I'll keep waiting. If ${B.corto(c)} doesn't reply, I'll let you know on Thursday.`); return; }
        // la cosa de En espera de este cliente (la tocada o la suya), se recoge con su línea
        const esp = (espera(d.de) && d.de) || ((M.espera(VETA.yo().id).find(x => x.cliente === id && x.tipo === 'espera' && !M.RESUELTOS.includes(x.estado)) || {}).id);
        if (esp) M.marca(esp, 'hecha', {linea: o.linea});
        B.ponEn('resp', id, {texto: o.linea, hora: VETA.ahora(), cosa: esp || null});
        VETA.repinta(esp ? {hecho: esp} : {hecho: 'b-paso-' + id});
      }
    }
  });

  // ---- H16 · Detalle de historia: acta (en frases, como A4), informe enviado o mensaje ----
  const entrada = d => B.historia(cliDe(d))[Number(d.k) || 0] || null;
  VETA.hojaDef('h16', {
    titulo: d => { const h = entrada(d); return h ? h.titulo : 'Detail'; },
    pinta: d => {
      const h = entrada(d), id = cliDe(d), c = M.cliente(id) || {};
      if (VETA.ajeno(id)) return `<p class="hoja-x">${esc(VETA.chatAjenoTexto(id))}</p>` + cerrar('Close', 'secundario');
      if (!h) return `<p class="hoja-x">This is no longer in the history.</p>` + cerrar('Close', 'secundario');
      const x = h.det && D.b.detalles[h.det];
      if (x && x.tipo === 'acta') {
        return `<p class="hoja-x tenue">${esc(x.cuando)}</p>` +
          UI.borrador({rotulo: 'Viewing notes', html: [['What she liked', x.gusta], ['What worries her', x.preocupa], ['Next step', x.siguiente]]
            .map(([t, v]) => `<span class="b-acta"><b>${esc(t)}</b><span>${esc(v)}</span></span>`).join('')}) +
          UI.boton({tipo: 'secundario', texto: 'Save as PDF', icono: 'papel', accion: 'pdf'}) + cerrar('Close');
      }
      if (x && x.tipo === 'informe') {
        const k = x === D.b.detalles['informe-hoy'] ? M.cosa('c-pere') : null;
        return `<p class="hoja-x tenue">${esc(k && k.hora ? 'Today, ' + k.hora + ' · WhatsApp' : x.cuando)}</p>` + UI.borrador({rotulo: 'What Pere received', texto: x.texto}) +
          UI.nota({texto: 'It goes as text. The version with a photo is saved as PDF.', clase: 'nota-gris'}) + cerrar('Close', 'secundario');
      }
      // un mensaje: lo que enviaste hoy, o su chat
      const k = h.de && M.cosa(h.de);
      if (k && (k.borrador || (k.extra && k.extra.borradorHtml))) {
        const t = String((k.extra && (k.extra.borradorHtml || k.extra.borrador)) || k.borrador).replace(/<[^>]+>/g, '');
        return `<p class="hoja-x tenue">WhatsApp chat with ${esc(c.nombre)}</p>` + UI.burbujas([{texto: t, cuando: 'today, ' + (k.hora || ''), tu: true}]) + cerrar('Close', 'secundario');
      }
      const ch = c.chat && M.chat(c.chat);
      return `<p class="hoja-x tenue">${esc(ch ? ch.titulo : 'No source chat')}</p>` + (ch ? UI.burbujas(ch.mensajes) : '') + cerrar('Close', 'secundario');
    },
    acciones: { pdf() { VETA.cierraHoja({foco: false}); VETA.aviso('PDF ready. You send it.'); } }
  });

  // ---- H39 · Anotar una queja (dirección) ----
  VETA.hojaDef('h39', {
    titulo: 'Log a complaint',
    pinta: d => {
      const id = cliDe(d), c = M.cliente(id) || {}, ch = c.chat && M.chat(c.chat), m = ch && ch.mensajes.find(x => !x.tu);
      const q = D.b.quejas[id] || {};
      return `<p class="hoja-x">Complaint from ${esc(c.nombre)}</p>` +
        (m ? UI.cita({texto: m.texto, origen: `${B.corto(c)} · ${m.cuando}`, chat: c.chat}) : '') +
        UI.campo({etiqueta: 'What\'s happening', area: true, id: 'b-h39-t', valor: q.texto || '', placeholder: 'In one sentence, what they\'re complaining about', filas: 3}) +
        (c.lleva ? UI.nota({texto: `Handled by ${(M.persona(c.lleva) || {}).corto || c.lleva}. The complaint stays on their profile and in Team.`, icono: 'info'}) : '') +
        UI.boton({texto: 'Log the complaint', accion: 'anota'}) + cerrar();
    },
    acciones: {
      anota(ev, el, d) {
        const id = cliDe(d), t = document.getElementById('b-h39-t'), c = M.cliente(id) || {};
        const texto = (t && t.value.trim()) || 'no detail';
        const m = Object.assign({}, B.mapa('marcas')[id] || {}, {queja: {texto: texto.split(/\.\s/)[0].replace(/\.$/, '').slice(0, 70), hora: VETA.ahora()}});
        B.ponEn('marcas', id, m);
        VETA.cierraHoja({foco: false});
        if (!VETA.actual() || VETA.actual().ruta !== 'cliente/' + id) VETA.ir('cliente/' + id); else VETA.repinta();
        VETA.aviso(`Complaint from ${c.nombre} logged.`);
      }
    }
  });
})();
