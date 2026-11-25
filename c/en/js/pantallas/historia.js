/* Veta demo · pantallas · historia.js · B (Clientes) · ronda 8
   - A16 · Lo que ha pasado · #/cliente/<id>/historia: filtros “Todo · Notas de visita” y una lista, lo último arriba.
     Cada fila dice qué fue, debajo quién o qué en un renglón, y a la derecha el día (VETA.fecha). Todas las filas de la lista
     se tocan (D18): abren H16 (acta, informe enviado o mensaje), H10 (el mensaje de Pere) o, si es un papel firmado, “Papeles y fechas”.
     Lo que no tiene nada que abrir (un cliente con un solo hito) queda como dato, y entonces ninguna fila se toca.
     “Lo que sé de…” vive en la pantalla de pregunta (A5p).
   Dirección con el cliente de otra persona: los hitos, sin el texto del chat y sin abrir nada. */
(function () {
  'use strict';
  const B = VETA.B, M = VETA.modelo, r7 = VETA.r7;
  const st = {id: null, filtro: 'todo'};   // el filtro elegido vale mientras se mira a este cliente
  const nombre = t => String(t || '').replace(/^Viewing notes/, 'Viewing notes');
  const CHAT = ['Message', 'You', 'Voice note', 'Report'];
  // un acta o una nota de visita (no la nota de voz de un cliente)
  const ACTA = h => /^(notes?|viewing notes?)\b/i.test(h.tipo || '') && h.tipo !== 'Voice note';
  const dia = h => String(h.cuando || '').split(',')[0];   // la cola: el día, sin la hora (la hora está al abrirlo)
  // qué fue: su título propio; si no lo tiene, de quién es el mensaje, o el hito tal cual (“Arras firmadas”)
  function que(h, c, suyo) {
    const propio = h.titulo && h.titulo !== h.tipo && h.titulo !== 'You';
    if (propio) { const t = nombre(h.titulo).split(' · '); return {nombre: t[0], pasa: t.slice(1).concat(h.texto || []).filter(Boolean).join(' · ')}; }
    if (h.tipo === 'You') return {nombre: suyo ? `Message from ${suyo}` : 'Message from you', pasa: h.texto};
    if (h.tipo === 'Message') return {nombre: `Message from ${B.corto(c)}`, pasa: h.texto};
    if (h.tipo === 'Voice note') return {nombre: `Voice note from ${B.corto(c)}`, pasa: h.texto};
    return {nombre: h.texto || h.tipo, pasa: ''};
  }

  VETA.pantalla('A16', {
    titulo: 'What has happened',
    sub: p => { const c = M.cliente(p.id); return c && VETA.ajeno(c.id) ? 'What is written belongs to whoever handles them.' : ''; },
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return r7.vacio('I can\'t find this client.');
      if (st.id !== c.id) { st.id = c.id; st.filtro = 'todo'; }
      const todo = B.historia(c.id), ajeno = VETA.ajeno(c.id), suyo = (M.persona(c.lleva) || {}).corto || 'their agent';
      if (!todo.length) return r7.vacio('Nothing has happened yet.');
      const actas = todo.filter(ACTA), l = st.filtro === 'actas' ? actas : todo;
      const fila = h => {
        // FN · privacidad: de un acta o una nota de otra persona, dirección ve que existe y su día; el texto, no
        if (ajeno) { const q = que(h, c, suyo); return {nombre: q.nombre, pasa: CHAT.includes(h.tipo) || ACTA(h) ? null : q.pasa || null, dato: dia(h)}; }
        const q = que(h, c);
        return Object.assign({nombre: q.nombre, pasa: q.pasa || null, dato: dia(h)},
          h.hoja ? {hoja: h.hoja, de: c.id, datos: {k: h.k}} : h.papeles ? {ir: `cliente/${c.id}/documentos`} : {});
      };
      return r7.filtros([{id: 'todo', texto: 'All', cuenta: todo.length}, {id: 'actas', texto: 'Viewing notes', cuenta: actas.length}], {valor: st.filtro, accion: 'filtro', etiqueta: 'What to show'}) +
        (l.length ? r7.lista(l.map(fila)) : r7.vacio('No viewing notes yet.'));
    },
    acciones: {
      filtro(ev, el) { st.filtro = el.dataset.valor; VETA.repinta(); }
    }
  });
})();
