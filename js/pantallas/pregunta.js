/* Veta demo · pantallas · pregunta.js · paquete B (Clientes)
   - A5p · Pregunta a Veta · #/pregunta/<id> (P0): responde con lo que está escrito en los chats, con la frase y su fecha.
   <id> = una de las tres preguntas preparadas (jordi · sant-antoni · verdi), un cliente («¿Qué sé de…?») o el texto
   escrito. Lo que no está preparado se dice: «No lo encuentro en tus chats». */
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
    if (c && VETA.ajeno(c.id)) return {pregunta: (P[id] || D.b.preguntas[id] || {}).pregunta || `¿Qué sé de ${c.nombre}?`, ajeno: true, cliente: c.id};
    if (c) {
      const ch = c.chat && M.chat(c.chat), m = ch && ch.mensajes && ch.mensajes.find(x => !x.tu);
      const h = B.historia(id)[0];
      if (!m && !h) return {pregunta: `¿Qué sé de ${c.nombre}?`, nada: true, cliente: id};
      return {id, pregunta: `¿Qué sé de ${c.nombre}?`, cliente: id,
        respuesta: (c.quienEs ? c.quienEs + '.' : c.nombre + '.') + (h ? ` Lo último: ${h.cuando.toLowerCase()}, ${String(h.titulo || h.tipo).toLowerCase()}.` : ''),
        cita: m ? {texto: m.texto, origen: `${B.corto(c)} · ${m.cuando} · chat con ${c.nombre}`, chat: c.chat} : null};
    }
    // dirección pregunta por el cliente de otra persona escribiéndolo («¿Qué le prometí a Jordi?»): lo dice, sin leer su chat
    const nn = ' ' + n + ' ';
    const nombrado = Object.keys(D.clientes).map(M.cliente).find(x => x && (nn.includes(' ' + B.norm(x.nombre) + ' ') || nn.includes(' ' + B.norm(B.corto(x)) + ' ')));
    if (nombrado && VETA.ajeno(nombrado.id)) return {pregunta: id, ajeno: true, cliente: nombrado.id};
    return {pregunta: id, nada: true};
  }
  const otras = r => Object.entries(B.preguntas()).filter(([k]) => k !== r.id).map(([k, x]) => ({titulo: x.pregunta, icono: 'pregunta', ir: 'pregunta/' + k, datos: {reemplaza: '1'}}));

  function respuesta(r) {
    if (r.ajeno) {
      const c = M.cliente(r.cliente) || {};
      return `<div class="b-resp" data-i="1">${UI.tarjeta(`<p class="b-resp-t b-escribe">${esc(c.nombre)} lo lleva ${esc((M.persona(c.lleva) || {}).corto || 'otra persona')}.</p>` +
        `<p class="hoja-x">Lo que hablan en su chat no lo leo desde dirección. En su ficha ves en qué punto está.</p>`, {clase: 'b-resp-c'})}</div>` +
        UI.bloque({titulo: 'Puedes preguntar', i: 2, html: UI.lista(otras({}))});
    }
    if (r.nada) {
      return `<div class="b-resp" data-i="1">${UI.tarjeta(`<p class="b-resp-t b-escribe">No lo encuentro en tus chats.</p>` +
        `<p class="hoja-x">Solo contesto con lo que está escrito; si no hay constancia, me callo.</p>` +
        UI.boton({tipo: 'secundario', texto: 'Probar con otra pregunta', accion: 'otra'}), {clase: 'b-resp-c'})}</div>` +
        UI.bloque({titulo: 'Puedes preguntar', i: 2, html: UI.lista(otras({}))});
    }
    let extra = '';
    if (r.id === 'jordi') {
      const c = M.cosa('c-jordi');
      if (c && c.estado === 'enviada') extra = UI.nota({texto: `Ya se lo enviaste hoy, a las ${c.hora}.`, icono: 'check', caja: true});
    }
    let filas = '';
    if (r.filas) {
      const l = r.filas.slice();
      const acta = M.cosa('c-elena');
      if (r.hoy && acta && acta.estado === 'hecha') l.push(r.hoy);
      filas = UI.lista(l.map(f => { const c = M.cliente(f.cliente) || {}; return {titulo: `${f.cuando} · ${c.nombre}`, sub: f.texto, av: f.cliente, ir: 'cliente/' + f.cliente}; }));
      if (l.length > r.filas.length) extra = UI.nota({texto: 'Y hoy, la visita de Elena Vives: ya está en su nota de la visita.', icono: 'info'});
    }
    return `<div class="b-resp" data-i="1">${UI.tarjeta(`<span class="b-resp-r">${VETA.ic('pregunta', 18)}<span>Veta responde</span></span>` +
      `<p class="b-resp-t b-escribe">${esc(r.respuesta)}</p>` +
      (r.cita ? UI.cita({texto: r.cita.texto, origen: r.cita.origen, chat: r.cita.chat}) : '') + extra + filas, {clase: 'b-resp-c'})}</div>` +
      UI.bloque({titulo: 'Otras preguntas', i: 2, html: UI.lista(otras(r))});
  }

  VETA.pantalla('A5p', {
    titulo: 'Pregunta a Veta',
    guia: ['Aquí Veta contesta con lo que está escrito en tus chats.', 'Tú preguntas como lo dirías en voz alta.', 'Así tienes la frase y su fecha, y si no está escrito, Veta calla.'],
    pinta: p => {
      const r = responde(p.id);
      const primera = !vistas.has(p.id);
      return `<div class="b-caja" data-i="0">${UI.campo({buscar: true, id: 'b-pregunta', placeholder: 'Pregunta otra cosa', valor: r.pregunta})}</div>` +
        (primera ? `<div class="b-carga" data-i="1"><p class="b-carga-t">${VETA.ic('pregunta', 18)}<span>Buscando en tus chats…</span></p>${UI.silueta(3)}</div>` : '') +
        `<div class="b-respuesta"${primera ? ' hidden' : ''}>${respuesta(r)}</div>`;
    },
    botonFijo: p => {
      const r = responde(p.id);
      if (r.nada || !r.cliente) return '';
      const c = M.cliente(r.cliente);
      return UI.boton({texto: `Abrir la ficha de ${B.corto(c)}`, ir: 'cliente/' + r.cliente});
    },
    alMontar: (el, p) => {
      const inp = el.querySelector('#b-pregunta');
      if (inp) {
        inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', 'Tu pregunta');
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

  // las filas de «Otras preguntas» cambian la pregunta en el sitio (sin apilar una pantalla por pregunta)
  document.addEventListener('click', e => {
    const f = e.target.closest && e.target.closest('.pant-A5p [data-ir][data-reemplaza]');
    if (!f) return;
    e.stopImmediatePropagation(); e.preventDefault();
    VETA.ir(f.dataset.ir, {reemplaza: true});
  }, true);
})();
