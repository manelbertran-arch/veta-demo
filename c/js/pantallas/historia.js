/* Veta demo · pantallas · historia.js · B (Clientes) · ronda 8
   - A16 · Lo que ha pasado · #/cliente/<id>/historia: filtros «Todo · Notas de visita» y una lista, lo último arriba.
     Cada fila dice qué fue y, debajo, cuándo y el resumen. Las que tienen algo que leer abren H16 (acta, informe enviado
     o mensaje) o H10 (el mensaje de Pere). «Lo que sé de…» vive en la pantalla de pregunta (A5p).
   Dirección con el cliente de otra persona: los hitos, sin el texto del chat y sin abrir nada. */
(function () {
  'use strict';
  const UI = VETA.UI, B = VETA.B, M = VETA.modelo, r7 = VETA.r7;
  const st = {id: null, filtro: 'todo'};   // el filtro elegido vale mientras se mira a este cliente
  const nombre = t => String(t || '').replace(/^Nota de la visita/, 'Acta de la visita');
  const CHAT = ['Mensaje', 'Tú', 'Nota de voz', 'Informe'];
  // un acta o una nota de visita (no la nota de voz de un cliente)
  const ACTA = h => /^(acta|nota)\b/i.test(h.tipo || '') && h.tipo !== 'Nota de voz';

  VETA.pantalla('A16', {
    titulo: 'Lo que ha pasado',
    sub: p => { const c = M.cliente(p.id); return c && VETA.ajeno(c.id) ? 'Lo escrito es de quien lo lleva.' : ''; },
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'No encuentro a este cliente.'});
      if (st.id !== c.id) { st.id = c.id; st.filtro = 'todo'; }
      const todo = B.historia(c.id), ajeno = VETA.ajeno(c.id), suyo = (M.persona(c.lleva) || {}).corto || 'su agente';
      if (!todo.length) return UI.vacio({titulo: 'Todavía no ha pasado nada con este cliente.', texto: 'Lo que pase en sus chats saldrá aquí, por fecha.'});
      const actas = todo.filter(ACTA), l = st.filtro === 'actas' ? actas : todo;
      // FN · privacidad: de un acta o una nota de otra persona, dirección ve que existe y su fecha; el texto, no
      const fila = h => {
        if (ajeno) return {
          nombre: h.tipo === 'Tú' ? `Mensaje de ${suyo}` : h.tipo === 'Mensaje' ? `Mensaje de ${B.corto(c)}` : h.tipo === 'Nota de voz' ? `Nota de voz de ${B.corto(c)}` : h.tipo === 'Informe' ? 'Informe enviado' : nombre(h.titulo).split(' · ')[0],
          pasa: CHAT.includes(h.tipo) || ACTA(h) ? h.cuando : [h.cuando, h.texto].filter(Boolean).join(' · ')};
        const t = nombre(h.titulo).split(' · ');
        return {nombre: t[0], pasa: [h.cuando, t.slice(1).join(' · '), h.texto].filter(Boolean).join(' · '),
          hoja: h.hoja || null, de: h.hoja ? c.id : null, datos: h.hoja ? {k: h.k} : null};
      };
      return r7.filtros([{id: 'todo', texto: 'Todo', cuenta: todo.length}, {id: 'actas', texto: 'Notas de visita', cuenta: actas.length}], {valor: st.filtro, accion: 'filtro', etiqueta: 'Qué ver'}) +
        (l.length ? r7.lista(l.map(fila)) : UI.vacio({titulo: 'Todavía no hay notas de visita.', texto: 'Cuando dictes una visita, su nota sale aquí.'}));
    },
    acciones: {
      filtro(ev, el) { st.filtro = el.dataset.valor; VETA.repinta(); }
    }
  });
})();
