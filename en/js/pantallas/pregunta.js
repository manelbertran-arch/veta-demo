/* Veta demo · pantallas · pregunta.js · paquete B (Clientes)
   - A5p · Pregunta a Veta · #/pregunta/<id> (P0): responde con lo que está escrito en los chats, con la frase y su fecha.
   <id> = una de las tres preguntas preparadas (jordi · sant-antoni · verdi), un cliente (“¿Qué sé de…?”) o el texto
   escrito. Lo que no está preparado se dice: “No lo encuentro en tus chats”. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const vistas = new Set();            // preguntas ya contestadas en esta visita (la silueta sale solo la primera vez)

  // la respuesta a una ruta: {pregunta, respuesta, cita, cliente, filas} o {pregunta, nada: true}
  function responde(id) {
    const P = B.preguntas();
    if (P[id]) return Object.assign({id}, P[id]);
    const n = B.norm(id);
    const k = Object.keys(P).find(x => P[x].claves.some(cl => cl.every(w => n.includes(w))));
    if (k) return Object.assign({id: k}, P[k]);
    // un cliente: lo último que tengo de él, con su frase
    const c = M.cliente(id) || (D.b.preguntas[id] && M.cliente(D.b.preguntas[id].cliente));
    // dirección preguntando por el cliente de otra persona: no lee su chat
    if (c && VETA.ajeno(c.id)) return {pregunta: (P[id] || D.b.preguntas[id] || {}).pregunta || `What do I know about ${c.nombre}?`, ajeno: true, cliente: c.id};
    if (c) {
      const ch = c.chat && M.chat(c.chat), m = ch && ch.mensajes && ch.mensajes.find(x => !x.tu);
      const h = B.historia(id)[0];
      if (!m && !h) return {pregunta: `What do I know about ${c.nombre}?`, nada: true, cliente: id};
      return {id, pregunta: `What do I know about ${c.nombre}?`, cliente: id,
        respuesta: (c.quienEs ? c.quienEs + '.' : c.nombre + '.') + (h ? ` Latest: ${h.cuando.toLowerCase()}, ${String(h.titulo || h.tipo).toLowerCase()}.` : ''),
        cita: m ? {texto: m.texto, origen: `${B.corto(c)} · ${m.cuando} · chat with ${c.nombre}`, chat: c.chat} : null};
    }
    // dirección pregunta por el cliente de otra persona escribiéndolo (“¿Qué le prometí a Jordi?”): lo dice, sin leer su chat
    const nn = ' ' + n + ' ';
    const nombrado = Object.keys(D.clientes).map(M.cliente).find(x => x && (nn.includes(' ' + B.norm(x.nombre) + ' ') || nn.includes(' ' + B.norm(B.corto(x)) + ' ')));
    if (nombrado && VETA.ajeno(nombrado.id)) return {pregunta: id, ajeno: true, cliente: nombrado.id};
    return {pregunta: id, nada: true};
  }
  const otras = r => Object.entries(B.preguntas()).filter(([k]) => k !== r.id).map(([k, x]) => ({titulo: x.pregunta, icono: 'pregunta', ir: 'pregunta/' + k, datos: {reemplaza: '1'}}));

  function respuesta(r) {
    if (r.ajeno) {
      const c = M.cliente(r.cliente) || {};
      return `<div class="b-resp" data-i="1">${UI.tarjeta(`<p class="b-resp-t b-escribe">${esc(c.nombre)} handled by ${esc((M.persona(c.lleva) || {}).corto || 'another person')}.</p>` +
        `<p class="hoja-x">From management I don't read what they talk about in their chat. On their profile you see where things stand.</p>`, {clase: 'b-resp-c'})}</div>` +
        UI.bloque({titulo: 'You can ask', i: 2, html: UI.lista(otras({}))});
    }
    if (r.nada) {
      return `<div class="b-resp" data-i="1">${UI.tarjeta(`<p class="b-resp-t b-escribe">I can't find it in your chats.</p>` +
        `<p class="hoja-x">I only answer with what's written; if there's no record, I stay quiet.</p>` +
        UI.boton({tipo: 'secundario', texto: 'Try another question', accion: 'otra'}), {clase: 'b-resp-c'})}</div>` +
        UI.bloque({titulo: 'You can ask', i: 2, html: UI.lista(otras({}))});
    }
    let extra = '';
    if (r.id === 'jordi') {
      const c = M.cosa('c-jordi');
      if (c && c.estado === 'enviada') extra = UI.nota({texto: `You already sent it to them today, at ${c.hora}.`, icono: 'check', caja: true});
    }
    let filas = '';
    if (r.filas) {
      const l = r.filas.slice();
      const acta = M.cosa('c-elena');
      if (r.hoy && acta && acta.estado === 'hecha') l.push(r.hoy);
      filas = UI.lista(l.map(f => { const c = M.cliente(f.cliente) || {}; return {titulo: `${f.cuando} · ${c.nombre}`, sub: f.texto, av: f.cliente, ir: 'cliente/' + f.cliente}; }));
      if (l.length > r.filas.length) extra = UI.nota({texto: 'And today, Elena Vives\'s viewing: it is already in the viewing notes.', icono: 'info'});
    }
    return `<div class="b-resp" data-i="1">${UI.tarjeta(`<span class="b-resp-r">${VETA.ic('pregunta', 18)}<span>Veta answers</span></span>` +
      `<p class="b-resp-t b-escribe">${esc(r.respuesta)}</p>` +
      (r.cita ? UI.cita({texto: r.cita.texto, origen: r.cita.origen, chat: r.cita.chat}) : '') + extra + filas, {clase: 'b-resp-c'})}</div>` +
      UI.bloque({titulo: 'Other questions', i: 2, html: UI.lista(otras(r))});
  }

  VETA.pantalla('A5p', {
    titulo: 'Ask Veta',
    guia: ['Here Veta answers with what\'s written in your chats.', 'You ask the way you\'d say it out loud.', 'That way you get the sentence and its date, and if it isn\'t written, Veta stays quiet.'],
    pinta: p => {
      const r = responde(p.id);
      const primera = !vistas.has(p.id);
      return `<div class="b-caja" data-i="0">${UI.campo({buscar: true, id: 'b-pregunta', placeholder: 'Ask something else', valor: r.pregunta})}</div>` +
        (primera ? `<div class="b-carga" data-i="1"><p class="b-carga-t">${VETA.ic('pregunta', 18)}<span>Searching your chats…</span></p>${UI.silueta(3)}</div>` : '') +
        `<div class="b-respuesta"${primera ? ' hidden' : ''}>${respuesta(r)}</div>`;
    },
    botonFijo: p => {
      const r = responde(p.id);
      if (r.nada || !r.cliente) return '';
      const c = M.cliente(r.cliente);
      return UI.boton({texto: `Open the profile of ${B.corto(c)}`, ir: 'cliente/' + r.cliente});
    },
    alMontar: (el, p) => {
      const inp = el.querySelector('#b-pregunta');
      if (inp) {
        inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', 'Your question');
        inp.addEventListener('keydown', e => {
          if (e.key !== 'Enter' || !inp.value.trim()) return;
          e.preventDefault(); inp.blur(); VETA.ir(B.rutaPregunta(inp.value), {reemplaza: true});
        });
      }
      const carga = el.querySelector('.b-carga'); if (!carga) return;
      const col = el.closest('.col'), fijo = col && col.querySelector('.fijo');
      if (fijo) fijo.classList.add('b-espera');
      setTimeout(() => {
        vistas.add(p.id);
        if (!carga.isConnected) return;
        const r = el.querySelector('.b-respuesta');
        carga.remove(); r.hidden = false;
        if (fijo) fijo.classList.remove('b-espera');
        VETA.mov.cascada(r);
      }, 650);
    },
    acciones: {
      otra(ev, el) { const inp = el.closest('.pant').querySelector('#b-pregunta'); if (inp) { inp.value = ''; inp.focus(); } }
    }
  });

  // las filas de “Otras preguntas” cambian la pregunta en el sitio (sin apilar una pantalla por pregunta)
  document.addEventListener('click', e => {
    const f = e.target.closest && e.target.closest('.pant-A5p [data-ir][data-reemplaza]');
    if (!f) return;
    e.stopImmediatePropagation(); e.preventDefault();
    VETA.ir(f.dataset.ir, {reemplaza: true});
  }, true);
})();
