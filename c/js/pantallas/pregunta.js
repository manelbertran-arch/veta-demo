/* Veta demo · pantallas · pregunta.js · B (Clientes) · ronda 8
   - A5p · Pregúntale a Veta · #/pregunta/<id>: responde con lo que está escrito en los chats. Arriba, el buscador con la
     pregunta; debajo, la tarjeta de Veta, la lista de donde sale (cada fila abre H01 con la frase literal) y las otras preguntas.
   <id> = una de las tres preguntas preparadas (jordi · sant-antoni · verdi), un cliente («Lo que sé de Pere»: sus dos cosas,
   cada una con su frase) o el texto escrito. Lo que no está preparado se dice: «No lo encuentro en tus chats». */
(function () {
  'use strict';
  const UI = VETA.UI, B = VETA.B, M = VETA.modelo, D = VETA.datos, r7 = VETA.r7;
  const min = t => { t = String(t || ''); return t.charAt(0).toLowerCase() + t.slice(1); };   // en mitad de la frase, sin tocar los nombres
  const vistas = new Set();            // preguntas ya contestadas en esta visita (la silueta sale solo la primera vez)

  // la respuesta a una ruta: {pregunta, respuesta, cita | sabe, cliente, filas} o {pregunta, nada: true}
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
      const sabe = B.sabe(c.id), h = B.historia(c.id)[0];
      if (!sabe.length && !h) return {pregunta: `¿Qué sé de ${c.nombre}?`, nada: true, cliente: c.id};
      return {id, pregunta: `¿Qué sé de ${c.nombre}?`, cliente: c.id, sabe,
        respuesta: (c.quienEs ? c.quienEs + '.' : c.nombre + '.') + (h ? ` Lo último: ${min(h.cuando)}, ${min(h.titulo || h.tipo)}.` : '')};
    }
    // dirección pregunta por el cliente de otra persona escribiéndolo («¿Qué le prometí a Jordi?»): lo dice, sin leer su chat
    const nn = ' ' + n + ' ';
    const nombrado = Object.keys(D.clientes).map(M.cliente).find(x => x && (nn.includes(' ' + B.norm(x.nombre) + ' ') || nn.includes(' ' + B.norm(B.corto(x)) + ' ')));
    if (nombrado && VETA.ajeno(nombrado.id)) return {pregunta: id, ajeno: true, cliente: nombrado.id};
    return {pregunta: id, nada: true};
  }
  // las otras preguntas preparadas: filas que cambian la pregunta en el sitio
  const otras = r => r7.lista(Object.entries(B.preguntas()).filter(([k]) => k !== r.id).map(([k, x]) => ({nombre: x.pregunta, ir: 'pregunta/' + k, datos: {reemplaza: '1'}})));
  const veta = (texto) => r7.tarjeta({veta: true, de: 'Veta responde', texto});
  // de dónde sale: una fila que abre H01 con la frase literal marcada
  const origen = (cita, nombre) => ({nombre: nombre || 'De dónde sale', pasa: cita.origen, hoja: 'h01', datos: {chat: cita.chat, frase: cita.cita || cita.texto}});

  // la respuesta: una tarjeta de Veta, la lista de donde sale (sus frases, o los clientes de la respuesta) y las otras preguntas
  function respuesta(r) {
    if (r.ajeno) {
      const c = M.cliente(r.cliente) || {};
      return veta(`${c.nombre} lo lleva ${(M.persona(c.lleva) || {}).corto || 'otra persona'}. Lo que hablan en su chat no lo leo desde dirección.`) + otras({});
    }
    if (r.nada) return veta('No lo encuentro en tus chats. Solo contesto con lo que está escrito.') + otras({});
    let texto = r.respuesta, filas = [];
    if (r.id === 'jordi') {
      const c = M.cosa('c-jordi');
      if (c && c.estado === 'enviada') texto += ` Ya se lo enviaste hoy, a las ${c.hora}.`;
    }
    if (r.sabe) filas = r.sabe.map(s => origen(s, s.texto));              // «Lo que sé de…»: cada cosa, con su frase
    else if (r.cita) filas = [origen(r.cita)];
    if (r.filas) {
      const l = r.filas.slice(), acta = M.cosa('c-elena');
      if (r.hoy && acta && acta.estado === 'hecha') l.push(r.hoy);
      filas = filas.concat(l.map(f => { const c = M.cliente(f.cliente) || {}; return {cara: f.cliente, nombre: c.nombre, pasa: `${f.cuando} · ${f.texto}`, ir: 'cliente/' + f.cliente}; }));
    }
    return veta(texto) + (filas.length ? r7.lista(filas, r.sabe ? {rotulo: 'De dónde sale'} : {}) : '') + otras(r);
  }
  // viniendo de su ficha, «Abrir la ficha» sobra: ya se vuelve con la flecha
  const deSuFicha = id => { const l = VETA.pila(), k = l.length - 2; return k >= 0 && l[k].ruta === 'cliente/' + id; };

  VETA.pantalla('A5p', {
    titulo: 'Pregúntale a Veta',
    sub: 'Contesto con lo escrito en tus chats. Si no está, lo digo.',
    pinta: p => {
      const r = responde(p.id);
      const primera = !vistas.has(p.id);
      return UI.campo({buscar: true, id: 'b-pregunta', placeholder: 'Pregunta otra cosa', valor: r.pregunta}) +
        (primera ? `<div class="b-carga"><p class="b-carga-t">Busco en tus chats</p>${UI.silueta(3)}</div>` : '') +
        `<div class="b-respuesta"${primera ? ' hidden' : ''}>${respuesta(r)}</div>`;
    },
    botonFijo: p => {
      const r = responde(p.id);
      if (r.nada || !r.cliente || deSuFicha(r.cliente)) return '';
      const c = M.cliente(r.cliente);
      return r7.botones({texto: `Abrir la ficha de ${B.corto(c)}`, ir: 'cliente/' + r.cliente});
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
