/* Veta demo · pantallas · ficha.js · paquete B (Clientes)
   - A6 · Ficha de cliente · #/cliente/<id> (P0). Una sola ficha por cliente, para todos los del reparto.
   De arriba abajo: estado y quién es · teléfono una vez con llamar y WhatsApp · «Siguiente paso» · barra de la operación ·
   Historia, Documentos y fechas, Otras acciones (H11) · cruces («Pisos que le encajan», «Compradores que encajan»).
   Estados: te toca con mensaje (la misma tarjeta de Hoy) · te toca, llamar (Albert) · esperando respuesta · al día ·
   cerrado (Carme) · asignado por dirección · lo lleva otra persona (dirección mirando la ficha de un agente). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const PENDIENTE = ['por-hacer', 'pregunta-envio'];
  const ESCRIBE = ['mensaje', 'oportunidad', 'promesa'];
  const RES = ['enviada', 'hecha', 'quitada'];
  const hecho = id => VETA.repinta({hecho: id});
  const nombreDe = id => ((M.persona(id) || {}).corto || id);

  // la cosa de la cola de este cliente que se pinta como tarjeta aquí (solo si es de quien mira)
  const cosaMia = c => c.cosa && (c.cosa.quien === VETA.yo().id) ? c.cosa : null;
  // la tarjeta de Hoy, sin «Ver la ficha» (ya estás en ella)
  const sinFicha = (x, id) => (x || []).filter(s => s.ir !== 'cliente/' + id);
  const tarjetaHoy = (k, c) => UI.tarjetaCosa(Object.assign({}, k, {secundarios: sinFicha(k.secundarios, c.id),
    extra: Object.assign({}, k.extra, k.extra && k.extra.secundarios ? {secundarios: sinFicha(k.extra.secundarios, c.id)} : {})}));

  // ---- el «Siguiente paso» según el estado: {html, fijo, contacto: 'llamar'|'escribir'|null} ----
  // «Siguiente paso» enseña primero lo que falta; lo ya hecho («Enviado a Pere») va debajo, en una línea
  function paso(c) {
    const r = paso0(c), k = cosaMia(c), linea = k && RES.includes(k.estado) ? UI.lineaCosa(k) : '';
    if (linea && r.html.startsWith(linea) && r.html.length > linea.length) r.html = r.html.slice(linea.length) + `<div class="b-ya">${linea}</div>`;
    return r;
  }
  function paso0(c) {
    const yo = VETA.yo(), k = cosaMia(c), nom = B.corto(c);
    const tarjeta = (html, o) => UI.tarjeta(html, Object.assign({clase: 'b-paso abierta', vt: 'b-paso-' + c.id}, o || {}));
    const texto = t => `<p class="b-paso-t">${esc(t)}</p>`;
    const piso = c.piso ? `<div class="tc-piso">${UI.foto(c.piso, {tam: 'mini', ampliar: true})}<span>${esc((M.piso(c.piso) || {}).corto || '')}</span></div>` : '';
    const nada = 'Nada que hacer ahora. Si pasa algo, te lo pongo en Hoy.';

    // dirección (u otra persona) mirando un cliente que no lleva
    if (c.lleva !== yo.id && !(k && PENDIENTE.includes(k.estado))) {
      const quien = c.lleva ? `Lo lleva ${nombreDe(c.lleva)}.` : 'Todavía no lo lleva nadie. Se decide en Equipo.';
      const sig = c.siguiente && c.siguiente.texto && c.estado !== 'al-dia' ? c.siguiente.texto : (c.estado === 'al-dia' || c.estado === 'cerrado' ? 'Al día.' : '');
      const op = M.operaciones().find(o => o.cliente === c.id);
      return {html: tarjeta(texto(quien) + (op ? `<p class="hoja-x">${esc(op.texto)} · ${esc(op.estadoTexto)}</p>` : '') + (sig ? `<p class="hoja-x">${esc(sig)}</p>` : '') + piso + (c.antes ? antes(c.antes, 'Lo que hay') : '') + (c.aviso ? UI.nota({texto: c.aviso, icono: 'info', caja: true}) : ''), {clase: 'b-paso'})};
    }

    // te toca, con mensaje (o la cosa de Sergi): la misma tarjeta que en Hoy
    if (k && PENDIENTE.includes(k.estado) && (ESCRIBE.includes(k.tipo) || k.tipo === 'bloqueada' || !c.siguiente || !c.siguiente.boton)) {
      return {html: tarjetaHoy(k, c), contacto: ESCRIBE.includes(k.tipo) ? 'escribir' : null};
    }
    const linea = k && RES.includes(k.estado) ? UI.lineaCosa(k) : '';

    // te toca, llamar (Albert)
    if (c.siguiente && c.siguiente.boton && c.siguiente.boton.accion === 'llamar') {
      const ll = B.mapa('llamada')[c.id];
      if (ll && ll.estado === 'hecha') {
        return {html: UI.lineaHecho({texto: `Hecho · Llamada a ${nom}`, hora: ll.hora, vt: 'b-paso-' + c.id, boton: {texto: 'Deshacer', accion: 'llamada-deshaz'}}) +
          UI.lista([{titulo: '¿Qué habéis hablado? Díctalo y lo apunto', icono: 'mic', ir: 'dictar/nota'}])};
      }
      if (ll && ll.estado === 'pregunta') {
        return {html: tarjeta(`<h3 class="tc-preg">¿Has hablado con ${esc(nom)}?</h3>` + UI.boton({texto: 'Sí', accion: 'llamada-si'}) +
          UI.botones([{texto: 'No contestó', accion: 'llamada-no'}]) + UI.nota({texto: 'En esta demo no se marca ningún teléfono.', clase: 'nota-gris'}))};
      }
      return {html: tarjeta(texto(c.siguiente.texto) + antes(c.antes) +
          (ll && ll.estado === 'no' ? UI.nota({texto: `No contestó a las ${ll.hora}. Prueba otra vez más tarde.`, icono: 'reloj', caja: true}) : '')),
        fijo: UI.boton({texto: c.siguiente.boton.texto, icono: 'telefono', accion: 'llamada'}), contacto: 'llamar'};
    }

    // esperando respuesta
    if (c.estado === 'esperando') {
      const t = (D.b.espera[c.id] || 'Le escribiste') + (k && k.hora ? ` · hoy, ${k.hora}` : '') + '.';
      return {html: linea + tarjeta(`<span class="b-paso-r">${VETA.ic('reloj', 18)}<span>Esperando respuesta de ${esc(nom)}</span></span>` +
        `<p class="hoja-x">${esc(t)} Si no contesta, te aviso el jueves.</p>` + UI.botones([{texto: 'Ya respondió…', hoja: 'h15', de: c.id}]))};
    }

    // cerrado (Carme): pedir una recomendación, con su «¿Lo enviaste?»
    if (c.estado === 'cerrado') {
      const r = D.b.recomendacion[c.id], e = B.mapa('reco')[c.id] || {};
      const base = texto(r ? r.texto : 'Operación cerrada.');
      if (!r) return {html: tarjeta(base + `<p class="hoja-x">${esc(nada)}</p>`)};
      if (e.estado === 'enviada') return {html: UI.lineaHecho({texto: `Enviado a ${nom}`, hora: e.hora, hoja: 'h03', vt: 'b-paso-' + c.id, boton: {texto: 'No lo envié', accion: 'reco-no'}}) + tarjeta(base, {clase: 'b-paso'})};
      if (e.estado === 'pregunta') return {html: tarjeta(`<h3 class="tc-preg">¿Lo enviaste?</h3>` + UI.boton({texto: 'Sí, enviado', accion: 'reco-si'}) +
        UI.botones([{texto: 'Todavía no', accion: 'reco-todavia'}]) + UI.nota({texto: 'En esta demo WhatsApp no se abre: no sale ningún mensaje.', clase: 'nota-gris'}))};
      if (e.estado === 'borrador') return {html: tarjeta(base + UI.borrador({texto: r.borrador}) + UI.nota({texto: 'No sale hasta que tú lo envíes', icono: 'candado'}) +
        UI.botones([{texto: 'Ahora no', accion: 'reco-cancela'}])), fijo: UI.boton({texto: 'Abrir WhatsApp con el mensaje', accion: 'reco-abre'}), contacto: 'escribir'};
      return {html: tarjeta(base + UI.botones([{texto: 'Preparar un mensaje para pedirle una recomendación', accion: 'reco-prepara'}]))};
    }

    // «Ya respondió…» anotado
    if (c.bResp) {
      return {html: UI.lineaHecho({texto: c.bResp.texto, hora: c.bResp.hora, vt: 'b-paso-' + c.id, boton: {texto: 'Deshacer', accion: 'resp-deshaz'}}) + tarjeta(texto(nada), {clase: 'b-paso'})};
    }

    // te toca con un botón propio (Pere: informe o el certificado; Elena: dictar el acta)
    const bt0 = c.siguiente && c.siguiente.boton;
    if (bt0 && (bt0.ir || bt0.hoja || bt0.accion) && c.estado !== 'al-dia') {
      const bt = bt0;
      if (bt.hoja === 'h14') {
        const f = B.faltan(c.id).find(d => d.pedir), ped = f && f.pedido;
        if (!f) return {html: linea + tarjeta(texto(nada), {clase: 'b-paso'})};
        if (ped) return {html: linea + tarjeta(`<span class="b-paso-r">${VETA.ic('reloj', 18)}<span>Esperando el papel</span></span>` +
          `<p class="hoja-x">Le pediste ${esc(f.falta.replace(/^Falta /, ''))} · hoy, ${esc(ped.hora)}. ${esc(f.plazo || '')}.</p>`)};
        return {html: linea + tarjeta(texto(f.falta + '.') + `<p class="hoja-x">${esc(f.plazo || '')}</p>` + piso), fijo: UI.boton({texto: bt.texto, hoja: 'h14', de: c.id})};
      }
      const sig = c.siguiente.texto;
      return {html: linea + tarjeta(texto(sig) + piso + (c.antes ? antes(c.antes) : '')), fijo: UI.boton(Object.assign({}, bt))};
    }

    // al día (y lo que queda por delante, si lo hay)
    const sig = c.siguiente && c.siguiente.texto && c.siguiente.texto !== 'Nada pendiente' ? c.siguiente.texto : '';
    if (c.bLlamada) return {html: UI.lineaHecho({texto: `Hecho · Llamada a ${nom}`, hora: c.bLlamada.hora, vt: 'b-paso-' + c.id, boton: {texto: 'Deshacer', accion: 'llamada-deshaz'}}) +
      UI.lista([{titulo: '¿Qué habéis hablado? Díctalo y lo apunto', icono: 'mic', ir: 'dictar/nota'}])};
    return {html: linea + tarjeta((sig ? texto(sig) : '') + `<p class="${sig ? 'hoja-x tenue' : 'b-paso-t'}">${esc(nada)}</p>`, {clase: 'b-paso'})};
  }
  const antes = (l, t) => `<div class="tc-antes"><b>${esc(t || 'Antes de llamar')}</b><ul>${l.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>`;

  // ---- la parte de arriba: estado, quién es, teléfono y contacto ----
  function arriba(c, contacto) {
    const etq = c.estado ? UI.etiqueta(c.estado, c.estado === 'parado' ? (c.estadoTexto || 'Parado') : null) : '';
    let h = `<div class="b-quien">${etq}<span>${esc(c.quienEs || '')}</span></div>`;
    if (c.asignada) h += UI.nota({texto: `${c.asignada} · hoy`, icono: 'usuario', caja: true});
    if (c.estado === null && c.id === 'sergi') h += UI.nota({texto: 'No es de tu cartera: lo atendió Anna Costa.', icono: 'info'});
    if (c.tel) {
      h += `<div class="b-tel"><span class="b-tel-n">${VETA.ic('telefono', 18)}<span>${esc(c.tel)}</span></span><span class="b-tel-b">` +
        (contacto === 'llamar' ? '' : UI.boton({tipo: 'redondo', texto: `Llamar a ${B.corto(c)}`, icono: 'telefono', accion: 'contacto-llamar'})) +
        (contacto === 'escribir' ? '' : UI.boton({tipo: 'redondo', texto: `WhatsApp con ${B.corto(c)}`, icono: 'chat', accion: 'contacto-whatsapp'})) + '</span></div>';
    }
    return `<div class="b-arriba" data-i="0">${h}</div>`;
  }

  // ---- marcas de dirección (Seguir de cerca, Importante, Queja) con su línea y «Deshacer» ----
  function marcas(c) {
    const m = B.mapa('marcas')[c.id] || {};
    const l = [];
    if (m.seguir) l.push(UI.lineaHecho({texto: `Sigues de cerca a ${B.corto(c)}`, hora: m.seguir, boton: {texto: 'Deshacer', accion: 'marca-deshaz', datos: {marca: 'seguir'}}}));
    if (m.importante) l.push(UI.lineaHecho({texto: 'Marcado como importante', hora: m.importante, boton: {texto: 'Deshacer', accion: 'marca-deshaz', datos: {marca: 'importante'}}}));
    if (m.queja) l.push(UI.lineaHecho({texto: `Queja anotada · ${m.queja.texto}`, hora: m.queja.hora, boton: {texto: 'Deshacer', accion: 'marca-deshaz', datos: {marca: 'queja'}}}));
    return l.length ? `<div class="b-marcas" data-i="1">${l.join('')}</div>` : '';
  }

  function filas(c) {
    const f = B.faltan(c.id)[0];
    const l = [
      {titulo: 'Historia', icono: 'libro', ir: `cliente/${c.id}/historia`},
      {titulo: 'Documentos y fechas', sub: f ? `${f.falta} · ${f.fecha}` : (B.docs(c.id).length || B.fechas(c.id).length ? 'No falta ningún papel' : null), icono: 'cal', ir: `cliente/${c.id}/documentos`},
      {titulo: 'Otras acciones', icono: 'puntos', hoja: 'h11', de: c.id}];
    let h = UI.lista(l, {i: 3});
    if (c.encajan) h += UI.lista([{titulo: c.encajan.titulo, icono: c.encajan.pisos ? 'casa' : 'equipo', hoja: 'b-encajan', de: c.id, clase: 'b-cruce'}], {i: 4});
    return h;
  }
  function barra(c) {
    const o = c.operacion;
    if (!o || !o.texto) return '';
    if (!o.tipo) return `<p class="b-sinop" data-i="2">${VETA.ic('pausa', 18)}<span>${esc(o.texto)}</span></p>`;
    return `<div class="b-barra" data-i="2">${UI.pasos({hecho: o.fase || 0, total: 5, texto: o.texto})}</div>`;
  }

  // ---- dirección con el cliente de otra persona: quién lo lleva, el asunto por el que lo abres y, con asunto, la operación ----
  // nada de actas, notas, chats, «Te toca» ni días sin hablar
  function asuntoDe(c) {
    const m = B.mapa('marcas')[c.id] || {}, a = (D.asuntos || {})[c.id], X = VETA.dir;
    const ir = a && a.decision ? 'asunto/' + c.id : null;
    if (m.queja) return {titulo: 'Queja anotada', texto: `La anotaste hoy, a las ${m.queja.hora}: ${m.queja.texto}.`, ir};
    if (a && a.tipo === 'queja') return {titulo: 'Queja de un propietario', texto: `Saltó tu aviso «Un propietario se queje» · ${a.pide.origen.replace('WhatsApp · ', '')}.`, ir};
    const asig = a && a.tipo === 'contacto' && X ? X.asignado(c.id) : null;
    if (asig) return {titulo: 'No lo lleva nadie', texto: `Se lo asignaste hoy a ${(M.persona(asig.a) || {}).corto || asig.a}.`, ir: a ? 'asunto/' + c.id : null};
    if (c.lleva === 'teresa' && X && X.cartera()) return {titulo: 'La cartera de Teresa', texto: `Teresa está de baja; pasaste su cartera a ${X.carteraTexto(X.carteraA())} hoy.`, ir: 'reparto'};
    return null;
  }
  function ajena(c) {
    const lleva = c.lleva || ((VETA.dir && VETA.dir.asignado(c.id)) || {}).a;
    const p = M.persona(lleva) || {}, a = asuntoDe(c), o = M.operaciones().find(x => x.cliente === c.id);
    let h = UI.bloque({titulo: 'Quién lo lleva', i: 0, html: UI.lista([{titulo: p.nombre || lleva, sub: VETA.dir ? VETA.dir.zona(lleva) : null, av: lleva}])});
    if (a) {
      h += UI.bloque({titulo: 'Por qué lo abres', i: 1, html: UI.nota({texto: `${a.titulo}. ${a.texto}`, icono: 'info', caja: true}) + (a.ir ? UI.lista([{titulo: 'Ver qué ha pasado', icono: 'tarea', ir: a.ir}]) : '')});
      if (o) h += UI.bloque({titulo: 'La operación', i: 2, html: UI.lista([{titulo: o.texto, sub: o.estadoTexto, icono: o.estado === 'parado' ? 'pausa' : 'casa'}])});
    } else {
      h += UI.bloque({titulo: 'Por qué lo abres', i: 1, html: UI.nota({texto: 'No tienes ninguna cosa abierta con este cliente. Si surge uno (una queja, un reparto), te lo traigo a Equipo.', icono: 'info', caja: true})});
    }
    h += `<div data-i="3">${UI.nota({texto: `Lo que ${p.corto || 'su agente'} habla con este cliente, sus notas y sus notas de visita no salen en dirección.`, icono: 'candado'})}</div>`;
    return `<div class="b-ficha b-ficha-ajena">${h}</div>`;
  }

  VETA.pantalla('A6', {
    titulo: p => (B.cli(p.id) || {nombre: 'Ficha de cliente'}).nombre,
    cabTitulo: p => { const c = B.cli(p.id); if (!c) return 'Ficha de cliente'; return `<span class="b-cabt">${VETA.av(c.id, 32, {foco: 'foto', nombre: c.nombre})}<span class="b-cabt-n" data-foco="nombre">${esc(c.nombre)}</span></span>`; },
    guia: ['Aquí está el siguiente paso con este cliente y todo lo suyo a un toque.', 'Tú haces el paso o abres su historia y sus papeles.', 'Así no repasas el chat entero antes de llamar.'],
    pinta: p => {
      const c = B.cli(p.id);
      if (!c) return UI.vacio({titulo: 'No encuentro a este cliente.', texto: 'Vuelve a Clientes y búscalo por su nombre.', icono: 'pregunta', boton: {texto: 'Volver', atras: true}});
      if (VETA.ajeno(c.id)) return ajena(c);
      const s = paso(c);
      return `<div class="b-ficha">${arriba(c, s.contacto)}${marcas(c)}` +
        `<section class="bloque b-sig" data-i="1"><h2 class="bloque-t">Siguiente paso</h2>${s.html}</section>${barra(c)}${filas(c)}</div>`;
    },
    botonFijo: p => { const c = B.cli(p.id); return c && !VETA.ajeno(c.id) ? (paso(c).fijo || '') : ''; },
    acciones: {
      'contacto-llamar'() { VETA.aviso('En esta demo no se marca ningún teléfono.'); },
      'contacto-whatsapp'() { VETA.aviso('En esta demo WhatsApp no se abre.'); },
      // la llamada de Albert
      llamada(ev, el, p) { B.ponEn('llamada', p.id, {estado: 'pregunta', hora: VETA.ahora()}); hecho('b-paso-' + p.id); },
      'llamada-si'(ev, el, p) { B.ponEn('llamada', p.id, {estado: 'hecha', hora: VETA.ahora()}); hecho('b-paso-' + p.id); },
      'llamada-no'(ev, el, p) { B.ponEn('llamada', p.id, {estado: 'no', hora: VETA.ahora()}); hecho('b-paso-' + p.id); },
      'llamada-deshaz'(ev, el, p) { B.ponEn('llamada', p.id, null); hecho('b-paso-' + p.id); },
      // Carme: pedir una recomendación
      'reco-prepara'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'borrador'}); hecho('b-paso-' + p.id); },
      'reco-cancela'(ev, el, p) { B.ponEn('reco', p.id, null); hecho('b-paso-' + p.id); },
      'reco-abre'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'pregunta'}); hecho('b-paso-' + p.id); },
      'reco-si'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'enviada', hora: VETA.ahora()}); hecho('b-paso-' + p.id); },
      'reco-todavia'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'borrador'}); hecho('b-paso-' + p.id); },
      'reco-no'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'borrador'}); hecho('b-paso-' + p.id); },
      // «Ya respondió…»
      'resp-deshaz'(ev, el, p) { B.ponEn('resp', p.id, null); hecho('b-paso-' + p.id); },
      // marcas de dirección
      'marca-deshaz'(ev, el, p) { const m = Object.assign({}, B.mapa('marcas')[p.id] || {}); delete m[el.dataset.marca]; B.ponEn('marcas', p.id, Object.keys(m).length ? m : null); VETA.repinta(); }
    }
  });

  // ---- hoja de cruces: «Pisos que le encajan» / «Compradores que encajan» (sin código en el mapa; nace de la fila 6 de A6) ----
  VETA.hojaDef('b-encajan', {
    titulo: d => ((M.cliente(d.de) || {}).encajan || {}).titulo || 'Lo que encaja',
    pinta: d => {
      const c = M.cliente(d.de) || {}, e = c.encajan || {};
      let h = '';
      if (e.pisos) h += e.pisos.map(id => { const pi = M.piso(id) || {}; return UI.tarjeta(UI.foto(id, {tam: 'ancha', ampliar: true}) +
        `<p class="b-paso-t">${esc(pi.nombre || '')}</p><p class="hoja-x tenue">${esc([pi.datos, pi.precio ? VETA.euros(pi.precio) : ''].filter(Boolean).join(' · '))}</p>` +
        (c.chat && M.chat(c.chat) && !VETA.ajeno(c.id) ? UI.cita({texto: M.chat(c.chat).mensajes.find(m => !m.tu).texto, origen: `${B.corto(c)} · ${M.chat(c.chat).mensajes.find(m => !m.tu).cuando}`, chat: c.chat}) : '') +
        (pi.nota ? UI.nota({texto: pi.nota, icono: 'info'}) : ''), {clase: 'b-cruce-c'}); }).join('');
      if (e.clientes) h += UI.lista(e.clientes.map(id => { const x = M.cliente(id) || {}; return {titulo: x.nombre, sub: x.quienEs, av: id, ir: 'cliente/' + id}; }));
      if (e.clientes) {
        const ch = M.chat('marta');
        if (ch && e.clientes.includes('marta') && !VETA.ajeno('marta')) h += UI.cita({texto: ch.mensajes[0].texto, origen: 'Marta · ' + ch.mensajes[0].cuando, chat: 'marta'});
      }
      return `<p class="hoja-x tenue">Lo cruzo con lo que piden tus clientes en sus chats.</p>${h}` + UI.boton({tipo: 'secundario', texto: 'Cerrar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
    }
  });
})();
