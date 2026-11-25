/* Veta demo · pantallas · ficha.js · B (Clientes) · ronda 8
   - A6 · #/cliente/<id>. Cabecera: su nombre y, a la derecha, el teléfono (abre H11 “Llamar o escribir”; sin teléfono, “Más”).
     Subtítulo: quién es y su teléfono. Debajo, la tarjeta de Veta “Qué toca ahora” y una lista de una línea:
     Lo que ha pasado · Papeles y fechas (pastilla “Falta 1”) · Lo que sé de <nombre> · (Pere, enviado) Informe de la semana ·
     Pisos o compradores que encajan · su piso, con foto (se amplía en H17).
     Un botón negro como mucho: lleva a su tarjeta (toca/<cosa>), a su visita o a su informe. Lo segundo va de enlace al final,
     o de par si es un sí o no.
   - Lo que se hace aquí mismo, paso a paso: la llamada de Albert, la recomendación de Carme, “Ya ha contestado” (H15), pedir un papel (H14).
     Todo termina igual (r7.hecho): arriba, la fila ✓ con lo hecho, su hora y “Deshacer”; debajo, “Qué toca ahora” con lo siguiente.
     Si hay siguiente paso, va en el botón negro; si no, no hay botón (es una ficha, no un paso: se sale con “volver” o por la barra).
   - Dirección con el cliente de otra persona: quién lo lleva, por qué lo abres y la operación; nada de sus chats. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos, r7 = VETA.r7;
  const X = () => D.r7b || {toca: {}, boton: {}, piso: {}};
  const PENDIENTE = ['por-hacer', 'pregunta-envio'];
  const RES = ['enviada', 'hecha', 'quitada'];
  const hecho = id => VETA.repinta({hecho: id});
  const nombreDe = id => ((M.persona(id) || {}).corto || id);
  const frase = t => { t = String(t || '').trim().replace(/;\s*(\w)/g, (m, l) => '. ' + l.toUpperCase()); return t && !/[.!?]$/.test(t) ? t + '.' : t; };
  // dónde sale lo que te toca: la agente lo tiene en Inicio; dirección, en “Te toca a ti”
  const sitio = () => (VETA.yo().papel === 'direccion' ? '“Your turn”' : 'Home');

  // la cosa de la cola de este cliente (solo si es de quien mira)
  const cosaMia = c => c.cosa && (c.cosa.quien === VETA.yo().id) ? c.cosa : null;
  // el informe de la semana aún te toca: el botón negro lleva a él (y no se repite en una fila)
  const hayInforme = c => { const k = cosaMia(c); return !!(k && k.tipo === 'informe' && PENDIENTE.includes(k.estado)); };
  // su tarjeta de lo que te toca (A23). Si no existe la ruta, Inicio.
  const rutaToca = k => (VETA.resuelve && VETA.resuelve('toca/' + k.id)) ? 'toca/' + k.id : 'inicio';
  // quién es: el subtítulo. Con su teléfono, si es tuyo.
  // FN · privacidad: dirección, del cliente de otra persona que vino a una visita, lee el hecho y la fecha (“Visitó el martes 17”);
  // lo que le pareció es el texto del acta de quien lo lleva y no sale
  const conActa = c => B.historia(c.id).some(h => /^(notes?|viewing notes?)\b/i.test(h.tipo || '') && h.tipo !== 'Voice note');
  // el teléfono no se parte entre dos líneas (espacios duros), y el punto de antes se va con él
  const quienEs = c => VETA.ajeno(c.id) ? (conActa(c) ? String(c.quienEs || '').split(';')[0] : c.quienEs || '')
    : [c.quienEs, c.tel && c.tel.replace(/ /g, '\u00a0')].filter(Boolean).join(' ·\u00a0');

  // ---- “Qué toca ahora”: {toca, negro, otro, de, nota, hecho} según en qué punto está. `hecho`: lo que acabas de hacer aquí (r7.hecho) ----
  function ahora(c) {
    const yo = VETA.yo(), k = cosaMia(c), nom = B.corto(c), x = X();
    const nada = `Nothing. If something comes up, I'll put it in ${sitio()}.`;

    // otra persona lo lleva (y no hay nada tuyo pendiente)
    if (c.lleva !== yo.id && !(k && PENDIENTE.includes(k.estado))) {
      return {toca: c.lleva ? `${nombreDe(c.lleva)} has it.` : 'No one has it yet. It\'s decided in Team.'};
    }
    // tiene algo tuyo por hacer: su tarjeta, o su visita
    if (k && PENDIENTE.includes(k.estado)) {
      if (k.tipo === 'visita') return {toca: x.toca[c.id] || (c.siguiente && c.siguiente.texto) || k.titulo, negro: {texto: x.boton[c.id] || 'Go to the viewing', ir: 'visita/' + c.id}};
      return {toca: x.toca[c.id] || (c.siguiente && c.siguiente.texto) || frase(B.motivo(c)) || k.titulo, negro: {texto: x.boton[c.id] || 'See what I wrote for you', ir: (x.ir || {})[c.id] || rutaToca(k)}};
    }
    // la llamada de Albert
    if (c.siguiente && c.siguiente.boton && c.siguiente.boton.accion === 'llamar') {
      const ll = B.mapa('llamada')[c.id];
      if (ll && ll.estado === 'hecha') return hablado(nom, ll);
      if (ll && ll.estado === 'pregunta') return {toca: `Have you spoken to ${nom}?`, negro: {texto: 'We spoke', accion: 'llamada-si'}, otro: {texto: 'No answer', accion: 'llamada-no'}};
      const no = ll && ll.estado === 'no' ? ` They did not answer at ${VETA.fecha.hora(ll.hora)}.` : '';
      return {toca: (x.toca[c.id] || c.siguiente.texto) + no, negro: {texto: c.siguiente.boton.texto, accion: 'llamada'}};
    }
    // esperas su respuesta
    if (c.estado === 'esperando') {
      return {toca: `You are waiting for ${nom} to reply. If not, I tell you on Thursday.`, negro: {texto: `${nom} has replied`, hoja: 'h15', de: c.id}};
    }
    // cerrado (Carme): pedirle una recomendación, con su “¿Lo enviaste?”
    if (c.estado === 'cerrado') {
      const r = D.b.recomendacion[c.id], e = B.mapa('reco')[c.id] || {};
      if (!r) return {toca: 'Nothing. The sale is closed.'};
      if (e.estado === 'enviada') return {hecho: {texto: `Recommendation requested from ${nom}`, hora: e.hora, deshacer: 'reco-no'}, toca: 'Nothing. The sale is closed.'};
      if (e.estado === 'pregunta') return {toca: 'Did you send them the message?', negro: {texto: 'Yes, sent', accion: 'reco-si'}, otro: {texto: 'Not yet', accion: 'reco-todavia'}};
      if (e.estado === 'borrador') return {de: 'I write it for you', toca: r.borrador, nota: 'envio',
        negro: {texto: 'Open WhatsApp', accion: 'reco-abre'}, otro: {texto: 'Not now', accion: 'reco-cancela'}};
      return {toca: 'They thanked you. You can ask them to recommend you.', negro: {texto: 'Ask for a recommendation', accion: 'reco-prepara'}};
    }
    // “Ya ha contestado” anotado
    if (c.bResp) return {hecho: {texto: String(c.bResp.texto).replace(/^Noted · /, '').replace(/^./, l => l.toUpperCase()), hora: c.bResp.hora, deshacer: 'resp-deshaz'}, toca: nada};
    // pedir un papel
    const bt = c.siguiente && c.siguiente.boton;
    if (bt && bt.hoja === 'h14' && c.estado !== 'al-dia') {
      const f = B.faltan(c.id).find(d => d.pedir), ped = f && f.pedido;
      if (!f) return {toca: nada};
      if (ped) return {hecho: {texto: `You asked ${B.sinFalta(f)} for`, hora: ped.hora, deshacer: {accion: 'pedido-deshaz', datos: {k: f.k}}}, toca: nada};
      return {toca: `${f.falta}. ${f.plazo || ''}`.trim(), negro: {texto: `Ask for it from ${nom}`, hoja: 'h14', de: c.id}};
    }
    // ya hecho hoy (lo enviaste desde su tarjeta)
    if (k && RES.includes(k.estado)) {
      const ex = k.extra || {}, t = ex.linea || (k.lineas && k.lineas[k.estado]) || (k.estado === 'enviada' ? 'Sent to ' + nom : 'Done');
      return {hecho: {texto: t, hora: k.hora}, toca: nada};
    }
    if (bt && (bt.ir || bt.hoja || bt.accion) && c.estado !== 'al-dia') return {toca: x.toca[c.id] || c.siguiente.texto, negro: {texto: bt.texto, ir: bt.ir, hoja: bt.hoja, accion: bt.accion}};
    if (c.bLlamada) return hablado(nom, c.bLlamada);
    const sig = c.siguiente && c.siguiente.texto && c.siguiente.texto !== 'Nothing pending' ? c.siguiente.texto : '';
    return {toca: sig ? frase(sig) : nada};
  }
  // la llamada, hecha: lo siguiente es contarla (el botón negro lleva a dictar la nota)
  const hablado = (nom, ll) => ({hecho: {texto: `You talked to ${nom}`, hora: ll.hora, deshacer: 'llamada-deshaz'}, toca: 'Note down what you discussed. You tell me.',
    negro: {texto: 'Tell me what you talked about', ir: 'dictar/nota'}});
  // un sí o no corto va de par en el pie; si no, lo segundo es un enlace al final del contenido
  const cabe = o => String((o || {}).texto || '').length <= 14;
  const esPar = a => !!(a.negro && a.otro && cabe(a.negro) && cabe(a.otro));

  // ---- marcas de dirección (Importante, Queja) con su “Deshacer” ----
  function marcas(c) {
    const m = B.mapa('marcas')[c.id] || {}, l = [];
    const des = marca => ({accion: 'marca-deshaz', datos: {marca}});
    if (m.seguir) l.push(r7.hecho({texto: `You're following closely: ${B.corto(c)}`, hora: m.seguir, deshacer: des('seguir')}));
    if (m.importante) l.push(r7.hecho({texto: 'Marked as important', hora: m.importante, deshacer: des('importante')}));
    if (m.queja) l.push(r7.hecho({texto: 'Complaint logged', hora: m.queja.hora, deshacer: des('queja')}));
    return l.length ? `<div class="b-marcas">${l.join('')}</div>` : '';
  }

  // ---- la lista de debajo: una línea por fila, y a la derecha un dato o la pastilla ----
  function filas(c) {
    const h = B.historia(c.id).length, n = B.faltan(c.id).length;
    const enc = c.encajan && String(c.encajan.titulo || '').split(' · ');
    const piso = c.piso && M.piso(c.piso);
    return r7.lista([
      // la cola de las cinco filas dice lo mismo: cuántas cosas hay dentro (y la pastilla, la excepción)
      {nombre: 'What has happened', dato: h || null, ir: `cliente/${c.id}/historia`},
      {nombre: 'Documents and dates', pastilla: n ? (n === 1 ? '1 missing' : `${n} missing`) : null, ir: `cliente/${c.id}/documentos`},
      {nombre: `What I know about ${B.corto(c)}`, dato: B.sabe(c.id).length || null, ir: 'pregunta/' + c.id},
      // el de cada lunes: mientras te toca, va en el botón negro; enviado, queda aquí para volver a leerlo
      c.id === 'pere' && !hayInforme(c) ? {nombre: 'Weekly report', ir: 'informe/pere'} : null,
      enc ? {nombre: enc[0], dato: enc[1] || null, hoja: 'b-encajan', de: c.id} : null,
      piso ? {foto: c.piso, nombre: (X().piso || {})[c.piso] || piso.nombre, hoja: 'h17', datos: {piso: c.piso, n: 0}} : null,
      // dirección anota la queja desde la ficha (sin pasar por “Más”): la cita de la queja queda a cuatro toques de Inicio
      VETA.yo().papel === 'direccion' ? {nombre: 'Log a complaint', hoja: 'h39', de: c.id} : null
    ]);
  }

  // ---- dirección con el cliente de otra persona: quién lo lleva, el asunto por el que lo abres y, con asunto, la operación ----
  function asuntoDe(c) {
    const m = B.mapa('marcas')[c.id] || {}, a = (D.asuntos || {})[c.id], X2 = VETA.dir;
    const ir = a && a.decision ? 'asunto/' + c.id : null;
    if (m.queja) return {titulo: 'Complaint logged', texto: `You logged it today, at ${m.queja.hora}: ${m.queja.texto}.`, ir};
    if (a && a.tipo === 'queja') return {titulo: 'Owner complaint', texto: `Your alert “An owner complains” triggered · ${a.pide.origen.replace('WhatsApp · ', '')}.`, ir};
    const asig = a && a.tipo === 'contacto' && X2 ? X2.asignado(c.id) : null;
    if (asig) return {titulo: 'No one has it', texto: `You assigned it today to ${(M.persona(asig.a) || {}).corto || asig.a}.`, ir: a ? 'asunto/' + c.id : null};
    if (c.lleva === 'teresa' && X2 && X2.cartera()) return {titulo: 'Teresa\'s portfolio', texto: `Teresa is on leave; you passed her portfolio to ${X2.carteraTexto(X2.carteraA())} today.`, ir: 'reparto'};
    return null;
  }
  function ajenaDe(c) {
    const lleva = c.lleva || ((VETA.dir && VETA.dir.asignado(c.id)) || {}).a;
    const p = M.persona(lleva) || {}, a = asuntoDe(c), o = M.operaciones().find(x => x.cliente === c.id);
    return {p, a, o, lleva, ahora: {toca: a ? `${a.titulo}. ${a.texto}` : `${p.corto || 'another person'} has it. You have nothing open with this client.`,
      negro: a && a.ir ? {texto: 'See what happened', ir: a.ir} : null}};
  }
  function ajena(c) {
    const j = ajenaDe(c);
    return r7.tarjeta({de: 'Why you\'re opening this', texto: j.ahora.toca, vt: 'b-paso-' + c.id}) + marcas(c) + r7.lista([
      j.lleva ? {cara: j.lleva, nombre: j.p.nombre || j.lleva, pasa: 'Handled by' + (VETA.dir && VETA.dir.zona(j.lleva) ? ' · ' + VETA.dir.zona(j.lleva) : '')} : null,
      j.a && j.o ? {nombre: j.o.texto, pasa: j.o.estadoTexto} : null
    ]);
  }
  const de = p => { const c = B.cli(p.id); return c ? {c, a: VETA.ajeno(c.id) ? ajenaDe(c).ahora : ahora(c)} : null; };

  VETA.pantalla('A6', {
    titulo: p => (B.cli(p.id) || {nombre: 'Client profile'}).nombre,
    sub: p => { const c = B.cli(p.id); return c ? quienEs(c) : ''; },
    // arriba a la derecha: su teléfono (llamar o escribir); sin teléfono, o si lo lleva otra persona, “Más” abre la misma hoja
    cabDerecha: p => { const c = B.cli(p.id); return c ? {tipo: c.tel && !VETA.ajeno(c.id) ? 'telefono' : 'mas', hoja: 'h11', de: c.id} : null; },
    // la promesa, por su nombre: al dejarte un mensaje escrito, “No sale hasta que tú lo envíes.”; con el cliente de otra persona, “No ves sus chats.”
    nota: p => { const x = de(p); return !x ? null : VETA.ajeno(x.c.id) ? 'chats' : x.a.nota || null; },
    casoDictado: p => { const c = B.cli(p.id); return c && !VETA.ajeno(c.id) ? {tipo: 'cliente', de: c.id, quien: c.id, titulo: c.nombre, texto: c.quienEs || ''} : null; },
    pinta: p => {
      const c = B.cli(p.id);
      if (!c) return r7.vacio('I can\'t find this client.');
      if (VETA.ajeno(c.id)) return ajena(c);
      const a = ahora(c);
      return (a.hecho ? r7.hecho(a.hecho) : '') + r7.tarjeta({veta: true, de: a.de || 'What is next', texto: a.toca, vt: 'b-paso-' + c.id}) + marcas(c) + filas(c) +
        (a.otro && !esPar(a) ? r7.enlace(a.otro) : '');
    },
    botonFijo: p => {
      const x = de(p); if (!x || !x.a.negro) return '';
      return r7.botones(x.a.negro, esPar(x.a) ? x.a.otro : null);
    },
    acciones: {
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
      // “Ya ha contestado”
      'resp-deshaz'(ev, el, p) { B.ponEn('resp', p.id, null); hecho('b-paso-' + p.id); },
      // el papel que pediste desde aquí: “Deshacer” = no se lo enviaste
      'pedido-deshaz'(ev, el, p) { B.noPedido(p.id, el.dataset.k); },
      // marcas de dirección
      'marca-deshaz'(ev, el, p) { const m = Object.assign({}, B.mapa('marcas')[p.id] || {}); delete m[el.dataset.marca]; B.ponEn('marcas', p.id, Object.keys(m).length ? m : null); VETA.repinta(); }
    }
  });

  // ---- hoja de cruces: “Pisos que le encajan” / “Compradores que encajan” (nace de su fila en la ficha) ----
  VETA.hojaDef('b-encajan', {
    titulo: d => String(((M.cliente(d.de) || {}).encajan || {}).titulo || 'What fits').split(' · ')[0],
    pinta: d => {
      const c = M.cliente(d.de) || {}, e = c.encajan || {};
      let h = '';
      if (e.pisos) h += e.pisos.map(id => { const pi = M.piso(id) || {}; return UI.tarjeta(UI.foto(id, {tam: 'ancha', ampliar: true}) +
        `<p class="b-paso-t">${esc(pi.nombre || '')}</p><p class="hoja-x tenue">${esc([pi.datos, pi.precio ? VETA.euros(pi.precio) : ''].filter(Boolean).join(' · '))}</p>` +
        (c.chat && M.chat(c.chat) && !VETA.ajeno(c.id) ? UI.cita({texto: M.chat(c.chat).mensajes.find(m => !m.tu).texto, origen: `${B.corto(c)} · ${M.chat(c.chat).mensajes.find(m => !m.tu).cuando}`, chat: c.chat}) : '') +
        (pi.nota ? UI.nota({texto: pi.nota, icono: 'info'}) : ''), {clase: 'b-cruce-c'}); }).join('');
      if (e.clientes) h += VETA.r7.lista(e.clientes.map(id => { const x = M.cliente(id) || {}; return {cara: id, nombre: x.nombre, pasa: x.quienEs, ir: 'cliente/' + id}; }));
      return `<p class="hoja-x tenue">I look for it in what your clients ask for in their chats.</p>${h}`;
    }
  });
})();
