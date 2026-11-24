/* Veta demo · pantallas · ficha.js · B (Clientes) · ronda 7
   - A6 · #/cliente/<id>. Arriba (cabecera): su nombre y qué quiere. Debajo, su cara y «Qué toca ahora» en una línea,
     con el botón negro si hay algo que hacer: lleva a su tarjeta de «Te toca a ti» (toca/<cosa>, de A1) o a su visita (visita/<id>, de A2).
     Debajo, filas cerradas: Lo que ha pasado · Papeles y fechas · Pregúntale a Veta · (Pere, enviado) Informe de la semana ·
     (si hay) Pisos o compradores que encajan · Llamar o escribir (H11: llamar, WhatsApp, compartir resumen, apuntar algo).
   - Lo que se hace aquí mismo, paso a paso y con los botones abajo: la llamada de Albert, la recomendación de Carme,
     «Ya ha contestado» (H15), pedir un papel (H14).
   - Dirección con el cliente de otra persona: quién lo lleva, por qué lo abres y la operación; nada de sus chats. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const X = () => D.r7b || {quiere: {}, toca: {}, boton: {}};
  const PENDIENTE = ['por-hacer', 'pregunta-envio'];
  const RES = ['enviada', 'hecha', 'quitada'];
  const hecho = id => VETA.repinta({hecho: id});
  const nombreDe = id => ((M.persona(id) || {}).corto || id);
  // una línea que cabe entera (si no, el lector la cuenta entera aunque se corte con «…»)
  const corta = (t, n) => { t = String(t || ''); n = n || 40; return t.length > n ? t.slice(0, n - 1).replace(/[\s,.;:·]+\S*$/, '') + '…' : t; };
  const frase = t => { t = String(t || '').trim().replace(/;\s*(\w)/g, (m, l) => '. ' + l.toUpperCase()); return t && !/[.!?]$/.test(t) ? t + '.' : t; };

  // la cosa de la cola de este cliente (solo si es de quien mira)
  const cosaMia = c => c.cosa && (c.cosa.quien === VETA.yo().id) ? c.cosa : null;
  // el informe de la semana aún te toca: el botón negro lleva a él (y no se repite en una fila)
  const hayInforme = c => { const k = cosaMia(c); return !!(k && k.tipo === 'informe' && PENDIENTE.includes(k.estado)); };
  // su tarjeta de «Te toca a ti» (A1). Si aún no existe la ruta, la lista de «Te toca a ti».
  const rutaToca = k => (VETA.resuelve && VETA.resuelve('toca/' + k.id)) ? 'toca/' + k.id : 'hoy';
  // qué quiere: la frase de la cabecera
  // FN · privacidad: dirección, del cliente de otra persona que vino a una visita, lee el hecho y la fecha («Visitó el martes 17.»);
  // lo que le pareció es el texto del acta de quien lo lleva y no sale
  const conActa = c => B.historia(c.id).some(h => /^(acta|nota)\b/i.test(h.tipo || '') && h.tipo !== 'Nota de voz');
  const quiere = c => VETA.ajeno(c.id) && conActa(c) ? frase(String(c.quienEs || '').split(';')[0]) || 'Cliente.' : X().quiere[c.id] || frase(c.quienEs) || 'Cliente.';

  // ---- «Qué toca ahora»: {toca, oro, negro, claros, extra} según en qué punto está ----
  function ahora(c) {
    const yo = VETA.yo(), k = cosaMia(c), nom = B.corto(c), x = X();
    const nada = 'Nada. Si pasa algo, te lo pongo en «Te toca a ti».';

    // otra persona lo lleva (y no hay nada tuyo pendiente)
    if (c.lleva !== yo.id && !(k && PENDIENTE.includes(k.estado))) {
      return {toca: c.lleva ? `Lo lleva ${nombreDe(c.lleva)}.` : 'Todavía no lo lleva nadie. Se decide en Equipo.'};
    }
    // tiene algo tuyo por hacer: su tarjeta en «Te toca a ti», o su visita
    if (k && PENDIENTE.includes(k.estado)) {
      if (k.tipo === 'visita') return {toca: x.toca[c.id] || (c.siguiente && c.siguiente.texto) || k.titulo, negro: {texto: x.boton[c.id] || 'Ir a la visita', ir: 'visita/' + c.id}};
      return {toca: x.toca[c.id] || (c.siguiente && c.siguiente.texto) || k.titulo, oro: true, negro: {texto: x.boton[c.id] || 'Ver lo que te dejo escrito', ir: (x.ir || {})[c.id] || rutaToca(k)}};
    }
    // la llamada de Albert
    if (c.siguiente && c.siguiente.boton && c.siguiente.boton.accion === 'llamar') {
      const ll = B.mapa('llamada')[c.id];
      if (ll && ll.estado === 'hecha') return {toca: `Hablasteis hoy, a las ${ll.hora}.`, negro: {texto: 'Contarme qué habéis hablado', icono: 'mic', ir: 'dictar/nota'}, claros: [{texto: 'Deshacer', accion: 'llamada-deshaz'}]};
      if (ll && ll.estado === 'pregunta') return {toca: `¿Has hablado con ${nom}?`, negro: {texto: 'Sí, hemos hablado', accion: 'llamada-si'}, claros: [{texto: 'No contestó', accion: 'llamada-no'}]};
      const no = ll && ll.estado === 'no' ? ` No contestó a las ${ll.hora}.` : '';
      return {toca: (x.toca[c.id] || c.siguiente.texto) + no, negro: {texto: c.siguiente.boton.texto, icono: 'telefono', accion: 'llamada'}};
    }
    // esperas su respuesta
    if (c.estado === 'esperando') {
      return {toca: `Esperas que ${nom} te conteste. Si no, te aviso el jueves.`, negro: {texto: `${nom} ya ha contestado`, hoja: 'h15', de: c.id}};
    }
    // cerrado (Carme): pedirle una recomendación, con su «¿Lo enviaste?»
    if (c.estado === 'cerrado') {
      const r = D.b.recomendacion[c.id], e = B.mapa('reco')[c.id] || {};
      if (!r) return {toca: 'Nada. La venta está cerrada.'};
      if (e.estado === 'enviada') return {toca: `Le pediste una recomendación hoy, a las ${e.hora}.`, claros: [{texto: 'No lo envié', accion: 'reco-no'}]};
      if (e.estado === 'pregunta') return {toca: '¿Le enviaste el mensaje?', negro: {texto: 'Sí, enviado', accion: 'reco-si'}, claros: [{texto: 'Todavía no', accion: 'reco-todavia'}]};
      if (e.estado === 'borrador') return {toca: 'Te dejo el mensaje escrito. No sale hasta que lo envíes.', oro: true,
        extra: `<p class="rb-borrador">${esc(r.borrador)}</p>${VETA.r7.ensena({texto: 'Enséñale a Veta cómo lo dices tú'})}`,
        negro: {texto: 'Abrir WhatsApp con el mensaje', accion: 'reco-abre'}, claros: [{texto: 'Ahora no', accion: 'reco-cancela'}]};
      return {toca: 'Te dio las gracias. Puedes pedirle que te recomiende.', negro: {texto: 'Pedirle una recomendación', accion: 'reco-prepara'}};
    }
    // «Ya ha contestado» anotado
    if (c.bResp) return {toca: `${c.bResp.texto}, a las ${c.bResp.hora}.`, claros: [{texto: 'Deshacer', accion: 'resp-deshaz'}]};
    // pedir un papel
    const bt = c.siguiente && c.siguiente.boton;
    if (bt && bt.hoja === 'h14' && c.estado !== 'al-dia') {
      const f = B.faltan(c.id).find(d => d.pedir), ped = f && f.pedido;
      if (!f) return {toca: nada};
      if (ped) return {toca: `Le pediste ${f.falta.replace(/^Falta /, '')} hoy, a las ${ped.hora}.`};
      return {toca: `${f.falta}. ${f.plazo || ''}`.trim(), negro: {texto: `Pedírselo a ${nom}`, hoja: 'h14', de: c.id}};
    }
    // ya hecho hoy (lo enviaste desde «Te toca a ti»)
    if (k && RES.includes(k.estado)) {
      const ex = k.extra || {}, t = ex.linea || (k.lineas && k.lineas[k.estado]) || (k.estado === 'enviada' ? 'Enviado a ' + nom : 'Hecho');
      return {toca: `${t}${k.hora ? ', hoy a las ' + k.hora : ''}. Ahora no toca nada más.`};
    }
    if (bt && (bt.ir || bt.hoja || bt.accion) && c.estado !== 'al-dia') return {toca: x.toca[c.id] || c.siguiente.texto, negro: Object.assign({}, bt)};
    if (c.bLlamada) return {toca: `Hablasteis hoy, a las ${c.bLlamada.hora}.`, negro: {texto: 'Contarme qué habéis hablado', icono: 'mic', ir: 'dictar/nota'}, claros: [{texto: 'Deshacer', accion: 'llamada-deshaz'}]};
    const sig = c.siguiente && c.siguiente.texto && c.siguiente.texto !== 'Nada pendiente' ? c.siguiente.texto : '';
    return {toca: sig ? frase(sig) : nada};
  }

  const bloque = (c, a, rotulo) => `<div class="r7-ficha rb-toca${a.oro ? ' r7-oro' : ''}" data-vt="b-paso-${esc(c.id)}">` +
    `<div class="rb-toca-a">${VETA.av(c.id, 64, {nombre: c.nombre})}<div class="rb-toca-c"><span class="r7-ficha-de">${esc(rotulo || 'Qué toca ahora')}</span>` +
    `<p class="rb-toca-t">${esc(a.toca)}</p></div></div>${a.extra || ''}</div>`;

  // ---- marcas de dirección (Importante, Queja) con su «Deshacer» ----
  function marcas(c) {
    const m = B.mapa('marcas')[c.id] || {}, l = [];
    if (m.seguir) l.push(UI.lineaHecho({texto: `Sigues de cerca a ${B.corto(c)}`, hora: m.seguir, boton: {texto: 'Deshacer', accion: 'marca-deshaz', datos: {marca: 'seguir'}}}));
    if (m.importante) l.push(UI.lineaHecho({texto: 'Marcado como importante', hora: m.importante, boton: {texto: 'Deshacer', accion: 'marca-deshaz', datos: {marca: 'importante'}}}));
    if (m.queja) l.push(UI.lineaHecho({texto: `Queja anotada · ${m.queja.texto}`, hora: m.queja.hora, boton: {texto: 'Deshacer', accion: 'marca-deshaz', datos: {marca: 'queja'}}}));
    return l.length ? `<div class="b-marcas">${l.join('')}</div>` : '';
  }

  // ---- las filas cerradas de debajo ----
  function filas(c) {
    const nom = B.corto(c), h = B.historia(c.id)[0], f = B.faltan(c.id)[0], fe = B.fechas(c.id)[0];
    const op = c.operacion && c.operacion.tipo ? c.operacion.texto : '';
    const papeles = f ? f.falta : fe ? `${fe.cuando}: ${fe.texto}` : op || (B.docs(c.id).length ? 'No falta ningún papel' : 'No hay papeles ni fechas');
    const enc = c.encajan && String(c.encajan.titulo || '').split(' · ');
    return VETA.r7.lista([
      {icono: 'reloj', nombre: 'Lo que ha pasado', pasa: h ? corta(`${h.cuando}: ${String(h.texto || h.titulo).replace(/[«»]/g, '')}`) : 'Todavía nada', ir: `cliente/${c.id}/historia`},
      {icono: 'cal', nombre: 'Papeles y fechas', pasa: corta(papeles), ir: `cliente/${c.id}/documentos`},
      {icono: 'pregunta', oro: true, nombre: `Pregúntale a Veta por ${nom}`, ir: 'pregunta/' + c.id},
      // el de cada lunes: mientras te toca, va en el botón negro; enviado, queda aquí para volver a leerlo
      c.id === 'pere' && !hayInforme(c) ? {icono: 'casa', nombre: 'Informe de la semana', pasa: 'El de cada lunes', ir: 'informe/pere'} : null,
      enc ? {icono: c.encajan.pisos ? 'casa' : 'equipo', oro: true, nombre: enc[0], numero: enc[1] || null, hoja: 'b-encajan', de: c.id} : null,
      {icono: 'telefono', nombre: `Llamar o escribir a ${nom}`, hoja: 'h11', de: c.id}
    ]);
  }

  // ---- dirección con el cliente de otra persona: quién lo lleva, el asunto por el que lo abres y, con asunto, la operación ----
  function asuntoDe(c) {
    const m = B.mapa('marcas')[c.id] || {}, a = (D.asuntos || {})[c.id], X2 = VETA.dir;
    const ir = a && a.decision ? 'asunto/' + c.id : null;
    if (m.queja) return {titulo: 'Queja anotada', texto: `La anotaste hoy, a las ${m.queja.hora}: ${m.queja.texto}.`, ir};
    if (a && a.tipo === 'queja') return {titulo: 'Queja de un propietario', texto: `Saltó tu aviso «Un propietario se queje» · ${a.pide.origen.replace('WhatsApp · ', '')}.`, ir};
    const asig = a && a.tipo === 'contacto' && X2 ? X2.asignado(c.id) : null;
    if (asig) return {titulo: 'No lo lleva nadie', texto: `Se lo asignaste hoy a ${(M.persona(asig.a) || {}).corto || asig.a}.`, ir: a ? 'asunto/' + c.id : null};
    if (c.lleva === 'teresa' && X2 && X2.cartera()) return {titulo: 'La cartera de Teresa', texto: `Teresa está de baja; pasaste su cartera a ${X2.carteraTexto(X2.carteraA())} hoy.`, ir: 'reparto'};
    return null;
  }
  function ajenaDe(c) {
    const lleva = c.lleva || ((VETA.dir && VETA.dir.asignado(c.id)) || {}).a;
    const p = M.persona(lleva) || {}, a = asuntoDe(c), o = M.operaciones().find(x => x.cliente === c.id);
    return {p, a, o, lleva, ahora: {toca: a ? `${a.titulo}. ${a.texto}` : `Lo lleva ${p.corto || 'otra persona'}. No tienes nada abierto con este cliente.`,
      negro: a && a.ir ? {texto: 'Ver qué ha pasado', ir: a.ir} : null}};
  }
  function ajena(c) {
    const j = ajenaDe(c);
    return bloque(c, j.ahora, 'Por qué lo abres') + marcas(c) + VETA.r7.lista([
      {cara: j.lleva, nombre: j.p.nombre || j.lleva, pasa: 'Lo lleva' + (VETA.dir && VETA.dir.zona(j.lleva) ? ' · ' + VETA.dir.zona(j.lleva) : '')},
      j.a && j.o ? {icono: j.o.estado === 'parado' ? 'pausa' : 'casa', nombre: j.o.texto, pasa: j.o.estadoTexto} : null,
      {icono: 'globo', nombre: 'Anotar una queja', hoja: 'h39', de: c.id},
      {icono: 'candado', nombre: 'Sus chats no salen aquí'}
    ]);
  }

  VETA.pantalla('A6', {
    titulo: p => (B.cli(p.id) || {nombre: 'Ficha de cliente'}).nombre,
    frase: p => { const c = B.cli(p.id); return c ? quiere(c) : ''; },
    guia: ['Aquí ves qué toca ahora con este cliente y todo lo suyo a un toque.', 'Tú haces lo que toca o abres lo que ha pasado y sus papeles.', 'Así no repasas el chat entero antes de llamar.'],
    pinta: p => {
      const c = B.cli(p.id);
      if (!c) return UI.vacio({titulo: 'No encuentro a este cliente.', texto: 'Búscalo por su nombre en Clientes.', icono: 'pregunta'});
      if (VETA.ajeno(c.id)) return ajena(c);
      return bloque(c, ahora(c)) + marcas(c) + filas(c);
    },
    botonFijo: p => {
      const c = B.cli(p.id); if (!c) return '';
      const a = VETA.ajeno(c.id) ? ajenaDe(c).ahora : ahora(c);
      return a.negro || (a.claros && a.claros.length) ? VETA.r7.botones(a.negro || null, a.claros || []) : '';
    },
    acciones: {
      // la llamada de Albert
      llamada(ev, el, p) { B.ponEn('llamada', p.id, {estado: 'pregunta', hora: VETA.ahora()}); hecho('b-paso-' + p.id); VETA.aviso('En esta demo no se marca ningún teléfono.'); },
      'llamada-si'(ev, el, p) { B.ponEn('llamada', p.id, {estado: 'hecha', hora: VETA.ahora()}); hecho('b-paso-' + p.id); },
      'llamada-no'(ev, el, p) { B.ponEn('llamada', p.id, {estado: 'no', hora: VETA.ahora()}); hecho('b-paso-' + p.id); },
      'llamada-deshaz'(ev, el, p) { B.ponEn('llamada', p.id, null); hecho('b-paso-' + p.id); },
      // Carme: pedir una recomendación
      'reco-prepara'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'borrador'}); hecho('b-paso-' + p.id); },
      'reco-cancela'(ev, el, p) { B.ponEn('reco', p.id, null); hecho('b-paso-' + p.id); },
      'reco-abre'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'pregunta'}); hecho('b-paso-' + p.id); VETA.aviso('En esta demo WhatsApp no se abre: no sale ningún mensaje.'); },
      'reco-si'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'enviada', hora: VETA.ahora()}); hecho('b-paso-' + p.id); },
      'reco-todavia'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'borrador'}); hecho('b-paso-' + p.id); },
      'reco-no'(ev, el, p) { B.ponEn('reco', p.id, {estado: 'borrador'}); hecho('b-paso-' + p.id); },
      // «Ya ha contestado»
      'resp-deshaz'(ev, el, p) { B.ponEn('resp', p.id, null); hecho('b-paso-' + p.id); },
      // marcas de dirección
      'marca-deshaz'(ev, el, p) { const m = Object.assign({}, B.mapa('marcas')[p.id] || {}); delete m[el.dataset.marca]; B.ponEn('marcas', p.id, Object.keys(m).length ? m : null); VETA.repinta(); }
    }
  });

  // ---- hoja de cruces: «Pisos que le encajan» / «Compradores que encajan» (nace de su fila en la ficha) ----
  VETA.hojaDef('b-encajan', {
    titulo: d => String(((M.cliente(d.de) || {}).encajan || {}).titulo || 'Lo que encaja').split(' · ')[0],
    pinta: d => {
      const c = M.cliente(d.de) || {}, e = c.encajan || {};
      let h = '';
      if (e.pisos) h += e.pisos.map(id => { const pi = M.piso(id) || {}; return UI.tarjeta(UI.foto(id, {tam: 'ancha', ampliar: true}) +
        `<p class="b-paso-t">${esc(pi.nombre || '')}</p><p class="hoja-x tenue">${esc([pi.datos, pi.precio ? VETA.euros(pi.precio) : ''].filter(Boolean).join(' · '))}</p>` +
        (c.chat && M.chat(c.chat) && !VETA.ajeno(c.id) ? UI.cita({texto: M.chat(c.chat).mensajes.find(m => !m.tu).texto, origen: `${B.corto(c)} · ${M.chat(c.chat).mensajes.find(m => !m.tu).cuando}`, chat: c.chat}) : '') +
        (pi.nota ? UI.nota({texto: pi.nota, icono: 'info'}) : ''), {clase: 'b-cruce-c'}); }).join('');
      if (e.clientes) h += VETA.r7.lista(e.clientes.map(id => { const x = M.cliente(id) || {}; return {cara: id, nombre: x.nombre, pasa: x.quienEs, ir: 'cliente/' + id}; }));
      return `<p class="hoja-x tenue">Lo busco en lo que piden tus clientes en sus chats.</p>${h}`;
    }
  });
})();
