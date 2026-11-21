/* Veta demo · pantallas · historia.js · paquete B (Clientes)
   - A16 · Historia · #/cliente/<id>/historia (P1): todo lo que ha pasado con el cliente, por fecha. Existe para todos.
   Selector “Todo · Actas”. Las filas con detalle abren H16 (acta, informe enviado o mensaje) o H10 (el mensaje de Pere).
   Al final, “Lo que sé de…” con su cita. Estados: todo · solo actas · vacío. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const st = {filtro: 'todo', anima: false};
  const ICONO = {'Notes': 'tarea', 'Voice note': 'mic', 'Report': 'casa', 'Message': 'chat', 'You': 'enviar', 'Mandate': 'sello', 'Notary': 'sello', 'Deposit': 'sello', 'Viewing': 'casa'};

  VETA.pantalla('A16', {
    titulo: 'History',
    guia: ['Here\'s everything that has happened with this client, by date.', 'You open viewing notes, a report or a message to read it all.', 'That way you know what it\'s about before calling.'],
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'I can\'t find this client.', icono: 'pregunta', boton: {texto: 'Back', atras: true}});
      if (VETA.ajeno(c.id)) return UI.vacio({titulo: `Handled by ${(M.persona(c.lleva) || {}).corto || 'another person'}.`, texto: 'Their history with this client, viewing notes and notes: none of this shows in Management.', icono: 'candado', boton: {texto: 'Back', atras: true}});
      if (st.id !== c.id) { st.id = c.id; st.filtro = 'todo'; }
      const todo = B.historia(c.id);
      const l = st.filtro === 'actas' ? todo.filter(h => h.tipo === 'Notes') : todo;
      const anima = st.anima ? ' b-entra' : ''; st.anima = false;
      // dirección mirando el cliente de otra persona: los hitos, sin el texto del chat y sin abrir nada
      const ajeno = VETA.ajeno(c.id), CHAT = ['Message', 'You', 'Voice note', 'Report'];
      const filas = l.map(h => ajeno ? {
        titulo: h.tipo === 'You' ? `Message from ${(M.persona(c.lleva) || {}).corto || 'their agent'}` : h.tipo === 'Message' ? `Message from ${B.corto(c)}` : h.tipo === 'Voice note' ? `Voice note from ${B.corto(c)}` : h.tipo === 'Report' ? 'Report sent' : h.titulo,
        sub: CHAT.includes(h.tipo) ? null : h.texto, derecha: h.cuando, icono: ICONO[h.tipo] || 'reloj', clase: 'b-hfila'} : {
        titulo: h.titulo, sub: h.texto, derecha: h.cuando, icono: ICONO[h.tipo] || 'reloj',
        hoja: h.hoja || null, de: h.hoja ? c.id : null, datos: h.hoja ? {k: h.k} : null, clase: 'b-hfila'});
      const sabe = ajeno ? [] : D.b.sabe[c.id] || (() => {
        const ch = c.chat && M.chat(c.chat), m = ch && ch.mensajes.find(x => !x.tu);
        return m ? [{texto: c.quienEs ? c.quienEs + '.' : '', cita: m.texto, origen: `${B.corto(c)} · ${m.cuando}`, chat: c.chat}] : [];
      })();
      const aviso = ajeno ? UI.nota({texto: `Handled by ${(M.persona(c.lleva) || {}).corto || 'another person'}. You see the milestones; what they talk about in their chat doesn't show in management.`, icono: 'candado', caja: true}) : '';
      return aviso + `<div data-i="0">${UI.selector({etiqueta: 'What to see', opciones: [{id: 'todo', texto: 'All'}, {id: 'actas', texto: 'Viewing notes'}], valor: st.filtro, accion: 'filtro'})}</div>` +
        (l.length ? `<div class="b-hist${anima}" data-i="1">${UI.lista(filas)}</div>`
          : UI.vacio({i: 1, titulo: st.filtro === 'actas' ? 'There are no viewing notes with this client yet.' : 'There\'s nothing with this client yet.',
            texto: st.filtro === 'actas' ? 'When you dictate a viewing, the viewing notes show up here.' : 'Whatever happens in their chats and whatever you dictate will show here, by date.', icono: 'libro'})) +
        (sabe.length ? UI.bloque({titulo: `What I know about ${B.corto(c)}`, i: 2, html: sabe.map(s => `<div class="b-sabe">${s.texto ? `<p class="b-sabe-t">${esc(s.texto)}</p>` : ''}` +
          UI.cita({texto: s.cita, origen: s.origen, chat: s.chat}) + '</div>').join('')}) : '');
    },
    acciones: {
      filtro(ev, el) { st.filtro = el.dataset.valor; st.anima = true; setTimeout(() => VETA.repinta(), VETA.reducido() ? 0 : 160); }
    }
  });
})();
