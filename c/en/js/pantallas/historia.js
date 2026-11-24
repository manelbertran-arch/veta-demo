/* Veta demo · pantallas · historia.js · B (Clientes) · ronda 8
   - A16 · Lo que ha pasado · #/cliente/<id>/historia: filtros “Todo · Notas de visita” y una lista, lo último arriba.
     Cada fila dice qué fue y, debajo, cuándo y el resumen. Las que tienen algo que leer abren H16 (acta, informe enviado
     o mensaje) o H10 (el mensaje de Pere). “Lo que sé de…” vive en la pantalla de pregunta (A5p).
   Dirección con el cliente de otra persona: los hitos, sin el texto del chat y sin abrir nada. */
(function () {
  'use strict';
  const UI = VETA.UI, B = VETA.B, M = VETA.modelo, r7 = VETA.r7;
  const st = {id: null, filtro: 'todo'};   // el filtro elegido vale mientras se mira a este cliente
  const nombre = t => String(t || '').replace(/^Nota de la visita/, 'Viewing notes');
  const CHAT = ['Message', 'You', 'Voice note', 'Report'];
  // un acta o una nota de visita (no la nota de voz de un cliente)
  const ACTA = h => /^(notes?|viewing notes?)\b/i.test(h.tipo || '') && h.tipo !== 'Voice note';

  VETA.pantalla('A16', {
    titulo: 'What has happened',
    sub: p => { const c = M.cliente(p.id); return c && VETA.ajeno(c.id) ? 'What is written belongs to whoever handles them.' : ''; },
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'I can\'t find this client.'});
      if (st.id !== c.id) { st.id = c.id; st.filtro = 'todo'; }
      const todo = B.historia(c.id), ajeno = VETA.ajeno(c.id), suyo = (M.persona(c.lleva) || {}).corto || 'their agent';
      if (!todo.length) return UI.vacio({titulo: 'Nothing has happened with this client yet.', texto: 'What happens in their chats will show here, by date.'});
      const actas = todo.filter(ACTA), l = st.filtro === 'actas' ? actas : todo;
      // FN · privacidad: de un acta o una nota de otra persona, dirección ve que existe y su fecha; el texto, no
      const fila = h => {
        if (ajeno) return {
          nombre: h.tipo === 'You' ? `Message from ${suyo}` : h.tipo === 'Message' ? `Message from ${B.corto(c)}` : h.tipo === 'Voice note' ? `Voice note from ${B.corto(c)}` : h.tipo === 'Report' ? 'Report sent' : nombre(h.titulo).split(' · ')[0],
          pasa: CHAT.includes(h.tipo) || ACTA(h) ? h.cuando : [h.cuando, h.texto].filter(Boolean).join(' · ')};
        const t = nombre(h.titulo).split(' · ');
        return {nombre: t[0], pasa: [h.cuando, t.slice(1).join(' · '), h.texto].filter(Boolean).join(' · '),
          hoja: h.hoja || null, de: h.hoja ? c.id : null, datos: h.hoja ? {k: h.k} : null};
      };
      return r7.filtros([{id: 'todo', texto: 'All', cuenta: todo.length}, {id: 'actas', texto: 'Viewing notes', cuenta: actas.length}], {valor: st.filtro, accion: 'filtro', etiqueta: 'What to show'}) +
        (l.length ? r7.lista(l.map(fila)) : UI.vacio({titulo: 'No viewing notes yet.', texto: 'When you dictate a viewing, its note shows up here.'}));
    },
    acciones: {
      filtro(ev, el) { st.filtro = el.dataset.valor; VETA.repinta(); }
    }
  });
})();
