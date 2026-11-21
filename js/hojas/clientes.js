/* Veta demo · hojas · clientes.js · paquete B (Clientes)
   H10 Mensaje de Pere · H11 Otras acciones · H12 Compartir resumen · H13 Fuera del radar · H14 Petición lista ·
   H15 ¿Qué pasó con…? · H16 Detalle de historia · H39 Anotar una queja.
   data-de: un cliente («pere») o una cosa de la cola o de En espera («c-pere», «e-pere»); las hojas sacan de ahí el cliente. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const cerrar = (t, tipo) => UI.boton({tipo: tipo || 'texto', texto: t || 'Cancelar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
  const espera = id => M.espera(VETA.yo().id).find(x => x.id === id) || M.espera('laura').find(x => x.id === id) || null;
  const cosaDe = id => M.cosa(id) || espera(id);
  const cliDe = d => { if (M.cliente(d.de)) return d.de; const k = cosaDe(d.de); return (k && k.cliente) || 'pere'; };

  // ---- H10 · Mensaje de Pere (pulido 2: era una nota de voz; los audios de clientes no los leo, así que es un mensaje escrito) ----
  // Mismas claves que antes ('h10', 'notaPere', 'nota-pere-escuchada'): al marcarlo como leído se va el aviso del informe.
  VETA.hojaDef('h10', {
    titulo: 'Mensaje de Pere',
    pinta: () => {
      const leido = B.lee('notaPere', null);
      if (VETA.ajeno('pere')) return `<p class="hoja-x">${esc(VETA.chatAjenoTexto('pere'))}</p>` + cerrar('Cerrar');
      return `<div class="b-voz"><p class="hoja-x"><b>Lo que dice:</b> «Laura, si hace falta para cerrar, bajo a 385.000 €, pero no menos.»</p>` +
        `<p class="hoja-x tenue">Pere · WhatsApp · sáb 21, 21:10</p></div>` +
        (leido ? UI.nota({texto: `Lo leíste hoy a las ${leido}.`, icono: 'check', caja: true}) : UI.boton({texto: 'Ya lo he leído', icono: 'check', accion: 'oido'})) +
        cerrar(leido ? 'Cerrar' : 'Ahora no');
    },
    acciones: {
      oido() {
        B.pon('notaPere', VETA.ahora()); M.pon('nota-pere-escuchada', true);
        VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('Anotado: ya has leído el mensaje de Pere.', {deshacer: () => { B.pon('notaPere', null); M.deshazFlag('nota-pere-escuchada'); VETA.repinta(); }});
      }
    }
  });

  // ---- H11 · «Otras acciones» (título: el nombre del cliente) ----
  const marca = (id, k, v) => { const m = Object.assign({}, B.mapa('marcas')[id] || {}); if (v == null) delete m[k]; else m[k] = v; B.ponEn('marcas', id, Object.keys(m).length ? m : null); VETA.repinta(); };
  VETA.hojaAcciones('h11', {
    titulo: d => (M.cliente(cliDe(d)) || {}).nombre || 'Otras acciones',
    opciones: d => {
      const id = cliDe(d), c = M.cliente(id) || {}, nom = B.corto(c), m = B.mapa('marcas')[id] || {};
      // dirección con el cliente de otra persona: solo sus marcas (preguntar, resumir o dictar leerían su chat)
      const l = VETA.ajeno(id) ? [] : [
        {texto: `Preguntar sobre ${nom}`, sub: 'Te contesto con lo que está en sus chats', icono: 'pregunta', ir: id === 'jordi' ? 'pregunta/jordi' : 'pregunta/' + id},
        id === 'pere' ? {texto: 'Informe al propietario', sub: 'El de este lunes, como lo verá Pere', icono: 'casa', ir: 'informe/pere'} : null,
        {texto: 'Compartir resumen', sub: 'Cinco líneas para copiar o enviar', icono: 'compartir', hoja: 'h12'},
        {texto: 'Dictar una nota', sub: `Lo que quieras apuntar de ${nom}`, icono: 'mic', ir: 'dictar/nota'}];
      if (VETA.yo().papel === 'direccion') {
        // sin «Seguir de cerca»: dirección no vigila las operaciones de nadie; «importante», solo en sus clientes
        if (!VETA.ajeno(id)) l.push(m.importante ? {texto: 'Quitar «importante»', icono: 'aviso', hace: () => marca(id, 'importante', null)}
          : {texto: 'Marcar como importante', icono: 'aviso', hace: () => marca(id, 'importante', VETA.ahora())});
        l.push({texto: 'Anotar una queja', icono: 'globo', hoja: 'h39'});
      }
      return l.filter(Boolean);
    }
  });

  // ---- H12 · Compartir resumen ----
  const resumen = id => {
    const c = B.cli(id) || {}, h = B.historia(id)[0], et = UI.ETIQUETAS[c.estado];
    return [`${c.nombre}${c.tel ? ' · ' + c.tel : ''}`, c.quienEs || '', `Estado: ${et ? et[2] : 'Contacto nuevo'}${c.operacion && c.operacion.texto ? ' · ' + c.operacion.texto : ''}`,
      `Siguiente paso: ${c.siguiente && c.siguiente.texto ? c.siguiente.texto.replace(/\.$/, '') : 'nada pendiente'}`,
      h ? `Lo último: ${h.cuando} · ${h.titulo}${h.texto ? ' · ' + h.texto.replace(/[«»]/g, '') : ''}` : 'Lo último: nada todavía'].filter(Boolean).slice(0, 5);
  };
  VETA.hojaDef('h12', {
    titulo: 'Compartir resumen',
    pinta: d => {
      const id = cliDe(d);
      return `<div class="b-resumen">${resumen(id).map(l => `<p>${esc(l)}</p>`).join('')}</div>` +
        UI.nota({texto: 'Si cambias de agente, la historia se queda en la oficina.', icono: 'info'}) +
        UI.boton({texto: 'Copiar', icono: 'copiar', accion: 'copia'}) + cerrar();   // pulido 2: fuera «Enviar por correo» (Veta solo tiene WhatsApp Business)
    },
    acciones: {
      copia(ev, el, d) { VETA.copia(resumen(cliDe(d)).join('\n')); VETA.cierraHoja({foco: false}); VETA.aviso('Resumen copiado.'); }
    }
  });

  // ---- H13 · Fuera del radar ----
  VETA.hojaDef('h13', {
    titulo: 'Fuera del radar',
    pinta: () => {
      const l = (M.lectura().fuera || []).concat((M.lee('chats-fuera', []) || []).map(id => (M.cliente(id) || {}).nombre || id));
      return `<p class="hoja-x">${l.length} chats personales que no miro:</p>` +
        UI.lista(l.map(n => ({titulo: n, icono: 'candado'}))) +
        `<p class="hoja-x tenue">No salen en ninguna pantalla más que en esta.</p>` +
        UI.lista([{titulo: 'Cambiar esta lista', icono: 'editar', ir: 'cuenta/chats'}]) + cerrar('Cerrar', 'secundario');
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
    titulo: 'Petición lista',
    pinta: d => {
      const {id, c, doc} = docDe(d);
      if (!doc) return `<p class="hoja-x">No falta ningún papel que pedirle a ${esc(B.corto(c))}.</p>` + cerrar('Cerrar', 'secundario');
      const t = textoDe(id, doc);
      if (d.paso === 'editar') {
        return `<p class="hoja-x tenue">Para ${esc(c.nombre)}, por WhatsApp.</p>` + UI.campo({etiqueta: 'Tu mensaje', area: true, id: 'b-h14-t', valor: t, filas: 5}) +
          UI.boton({texto: 'Listo', accion: 'listo'}) + cerrar();
      }
      if (d.paso === 'pregunta') {
        return `<h3 class="tc-preg">¿Lo enviaste?</h3>` + UI.boton({texto: 'Sí, enviado', accion: 'si'}) + UI.botones([{texto: 'Todavía no', accion: 'todavia'}]) +
          UI.nota({texto: 'En esta demo WhatsApp no se abre: no sale ningún mensaje.', clase: 'nota-gris'});
      }
      return `<p class="hoja-x tenue">Para ${esc(c.nombre)}, por WhatsApp.</p>` + UI.borrador({texto: t}) +
        UI.nota({texto: 'No sale hasta que tú lo envíes', icono: 'candado'}) +
        UI.boton({texto: 'Abrir WhatsApp con el mensaje', accion: 'abrir'}) + UI.botones([{texto: 'Editar', icono: 'editar', accion: 'editar'}]) + cerrar();
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
        if (doc.cosa) M.marca(doc.cosa, 'enviada', {linea: `Pedido a ${B.corto(c)} · ${doc.texto.toLowerCase()}`});
        else B.ponEn('pedidos', id + '|' + doc.k, {hora: VETA.ahora()});
        VETA.cierraHoja({foco: false});
        VETA.repinta(doc.cosa && d.de === doc.cosa ? {hecho: doc.cosa} : {});
        VETA.aviso(`Pedido a ${B.corto(c)} · queda en su historia.`);
      }
    }
  });

  // ---- H15 · ¿Qué pasó con…? ----
  const opcionesH15 = d => {
    const id = cliDe(d), c = M.cliente(id) || {}, nom = B.corto(c);
    const prop = /^Propietari|^Vendedor/.test(c.quienEs || '');
    return [{texto: 'Respondió', linea: `Anotado · ${nom} respondió`},
      {texto: 'Quedamos para una visita', linea: `Anotado · visita con ${nom}`},
      prop ? {texto: 'Firmó la exclusiva', linea: `Anotado · ${nom} firmó la exclusiva`} : null,
      {texto: 'Nada todavía', nada: true}].filter(Boolean);
  };
  VETA.hojaDef('h15', {
    titulo: d => `¿Qué pasó con ${B.corto(M.cliente(cliDe(d)))}?`,
    pinta: d => `<div class="ops">${opcionesH15(d).map((o, k) => `<button type="button" class="op" data-accion="elige" data-n="${k}"><span class="op-c"><span class="op-t">${esc(o.texto)}</span></span></button>`).join('')}</div>` + cerrar(),
    acciones: {
      elige(ev, el, d) {
        const o = opcionesH15(d)[Number(el.dataset.n)]; if (!o) return;
        const id = cliDe(d), c = M.cliente(id) || {};
        VETA.cierraHoja({foco: false});
        if (o.nada) { VETA.aviso(`Sigo esperando. Si ${B.corto(c)} no contesta, te aviso el jueves.`); return; }
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
    titulo: d => { const h = entrada(d); return h ? h.titulo : 'Detalle'; },
    pinta: d => {
      const h = entrada(d), id = cliDe(d), c = M.cliente(id) || {};
      if (VETA.ajeno(id)) return `<p class="hoja-x">${esc(VETA.chatAjenoTexto(id))}</p>` + cerrar('Cerrar', 'secundario');
      if (!h) return `<p class="hoja-x">Esto ya no está en la historia.</p>` + cerrar('Cerrar', 'secundario');
      const x = h.det && D.b.detalles[h.det];
      if (x && x.tipo === 'acta') {
        return `<p class="hoja-x tenue">${esc(x.cuando)}</p>` +
          UI.borrador({rotulo: 'Nota de la visita', html: [['Lo que le gustó', x.gusta], ['Lo que le preocupa', x.preocupa], ['Siguiente paso', x.siguiente]]
            .map(([t, v]) => `<span class="b-acta"><b>${esc(t)}</b><span>${esc(v)}</span></span>`).join('')}) +
          UI.boton({tipo: 'secundario', texto: 'Guardar en PDF', icono: 'papel', accion: 'pdf'}) + cerrar('Cerrar');
      }
      if (x && x.tipo === 'informe') {
        const k = x === D.b.detalles['informe-hoy'] ? M.cosa('c-pere') : null;
        return `<p class="hoja-x tenue">${esc(k && k.hora ? 'Hoy, ' + k.hora + ' · WhatsApp' : x.cuando)}</p>` + UI.borrador({rotulo: 'Lo que le llegó a Pere', texto: x.texto}) +
          UI.nota({texto: 'Va como texto. La versión con foto se guarda en PDF.', clase: 'nota-gris'}) + cerrar('Cerrar', 'secundario');
      }
      // un mensaje: lo que enviaste hoy, o su chat
      const k = h.de && M.cosa(h.de);
      if (k && (k.borrador || (k.extra && k.extra.borradorHtml))) {
        const t = String((k.extra && (k.extra.borradorHtml || k.extra.borrador)) || k.borrador).replace(/<[^>]+>/g, '');
        return `<p class="hoja-x tenue">Chat de WhatsApp con ${esc(c.nombre)}</p>` + UI.burbujas([{texto: t, cuando: 'hoy, ' + (k.hora || ''), tu: true}]) + cerrar('Cerrar', 'secundario');
      }
      const ch = c.chat && M.chat(c.chat);
      return `<p class="hoja-x tenue">${esc(ch ? ch.titulo : 'Sin chat de origen')}</p>` + (ch ? UI.burbujas(ch.mensajes) : '') + cerrar('Cerrar', 'secundario');
    },
    acciones: { pdf() { VETA.cierraHoja({foco: false}); VETA.aviso('PDF preparado. Lo envías tú.'); } }
  });

  // ---- H39 · Anotar una queja (dirección) ----
  VETA.hojaDef('h39', {
    titulo: 'Anotar una queja',
    pinta: d => {
      const id = cliDe(d), c = M.cliente(id) || {}, ch = c.chat && M.chat(c.chat), m = ch && ch.mensajes.find(x => !x.tu);
      const q = D.b.quejas[id] || {};
      return `<p class="hoja-x">Queja de ${esc(c.nombre)}</p>` +
        (m ? UI.cita({texto: m.texto, origen: `${B.corto(c)} · ${m.cuando}`, chat: c.chat}) : '') +
        UI.campo({etiqueta: 'Qué pasa', area: true, id: 'b-h39-t', valor: q.texto || '', placeholder: 'En una frase, lo que se queja', filas: 3}) +
        (c.lleva ? UI.nota({texto: `Lo lleva ${(M.persona(c.lleva) || {}).corto || c.lleva}. La queja queda en su ficha y en Equipo.`, icono: 'info'}) : '') +
        UI.boton({texto: 'Anotar la queja', accion: 'anota'}) + cerrar();
    },
    acciones: {
      anota(ev, el, d) {
        const id = cliDe(d), t = document.getElementById('b-h39-t'), c = M.cliente(id) || {};
        const texto = (t && t.value.trim()) || 'sin detalle';
        const m = Object.assign({}, B.mapa('marcas')[id] || {}, {queja: {texto: texto.split(/\.\s/)[0].replace(/\.$/, '').slice(0, 70), hora: VETA.ahora()}});
        B.ponEn('marcas', id, m);
        VETA.cierraHoja({foco: false});
        if (!VETA.actual() || VETA.actual().ruta !== 'cliente/' + id) VETA.ir('cliente/' + id); else VETA.repinta();
        VETA.aviso(`Queja de ${c.nombre} anotada.`);
      }
    }
  });
})();
