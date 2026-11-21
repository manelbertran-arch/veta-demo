/* Veta demo · pantallas · historia.js · paquete B (Clientes)
   - A16 · Historia · #/cliente/<id>/historia (P1): todo lo que ha pasado con el cliente, por fecha. Existe para todos.
   Selector «Todo · Actas». Las filas con detalle abren H16 (acta, informe enviado o mensaje) o H10 (nota de voz).
   Al final, «Lo que sé de…» con su cita. Estados: todo · solo actas · vacío. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const st = {filtro: 'todo', anima: false};
  const ICONO = {'Acta': 'tarea', 'Nota de voz': 'mic', 'Informe': 'casa', 'Mensaje': 'chat', 'Tú': 'enviar', 'Encargo': 'sello', 'Notaría': 'sello', 'Arras': 'sello', 'Visita': 'casa'};

  VETA.pantalla('A16', {
    titulo: 'Historia',
    guia: ['Aquí está todo lo que ha pasado con este cliente, por fecha.', 'Tú abres una nota de la visita, un informe o un mensaje para leerlo entero.', 'Así sabes de qué va antes de llamar.'],
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'No encuentro a este cliente.', icono: 'pregunta', boton: {texto: 'Volver', atras: true}});
      if (VETA.ajeno(c.id)) return UI.vacio({titulo: `Lo lleva ${(M.persona(c.lleva) || {}).corto || 'otra persona'}.`, texto: 'Su historia con este cliente, sus notas de visita y sus notas: nada de eso se ve en dirección.', icono: 'candado', boton: {texto: 'Volver', atras: true}});
      if (st.id !== c.id) { st.id = c.id; st.filtro = 'todo'; }
      const todo = B.historia(c.id);
      const l = st.filtro === 'actas' ? todo.filter(h => h.tipo === 'Acta') : todo;
      const anima = st.anima ? ' b-entra' : ''; st.anima = false;
      // dirección mirando el cliente de otra persona: los hitos, sin el texto del chat y sin abrir nada
      const ajeno = VETA.ajeno(c.id), CHAT = ['Mensaje', 'Tú', 'Nota de voz', 'Informe'];
      const filas = l.map(h => ajeno ? {
        titulo: h.tipo === 'Tú' ? `Mensaje de ${(M.persona(c.lleva) || {}).corto || 'su agente'}` : h.tipo === 'Mensaje' ? `Mensaje de ${B.corto(c)}` : h.tipo === 'Nota de voz' ? `Nota de voz de ${B.corto(c)}` : h.tipo === 'Informe' ? 'Informe enviado' : h.titulo,
        sub: CHAT.includes(h.tipo) ? null : h.texto, derecha: h.cuando, icono: ICONO[h.tipo] || 'reloj', clase: 'b-hfila'} : {
        titulo: h.titulo, sub: h.texto, derecha: h.cuando, icono: ICONO[h.tipo] || 'reloj',
        hoja: h.hoja || null, de: h.hoja ? c.id : null, datos: h.hoja ? {k: h.k} : null, clase: 'b-hfila'});
      const sabe = ajeno ? [] : D.b.sabe[c.id] || (() => {
        const ch = c.chat && M.chat(c.chat), m = ch && ch.mensajes.find(x => !x.tu);
        return m ? [{texto: c.quienEs ? c.quienEs + '.' : '', cita: m.texto, origen: `${B.corto(c)} · ${m.cuando}`, chat: c.chat}] : [];
      })();
      const aviso = ajeno ? UI.nota({texto: `Lo lleva ${(M.persona(c.lleva) || {}).corto || 'otra persona'}. Ves los hitos; lo que hablan en su chat no sale en dirección.`, icono: 'candado', caja: true}) : '';
      return aviso + `<div data-i="0">${UI.selector({etiqueta: 'Qué ver', opciones: [{id: 'todo', texto: 'Todo'}, {id: 'actas', texto: 'Notas de visita'}], valor: st.filtro, accion: 'filtro'})}</div>` +
        (l.length ? `<div class="b-hist${anima}" data-i="1">${UI.lista(filas)}</div>`
          : UI.vacio({i: 1, titulo: st.filtro === 'actas' ? 'Todavía no hay notas de visita con este cliente.' : 'Todavía no hay nada con este cliente.',
            texto: st.filtro === 'actas' ? 'Cuando dictes una visita, la nota de la visita sale aquí.' : 'Lo que pase en sus chats y lo que dictes saldrá aquí, por fecha.', icono: 'libro'})) +
        (sabe.length ? UI.bloque({titulo: `Lo que sé de ${B.corto(c)}`, i: 2, html: sabe.map(s => `<div class="b-sabe">${s.texto ? `<p class="b-sabe-t">${esc(s.texto)}</p>` : ''}` +
          UI.cita({texto: s.cita, origen: s.origen, chat: s.chat}) + '</div>').join('')}) : '');
    },
    acciones: {
      filtro(ev, el) { st.filtro = el.dataset.valor; st.anima = true; setTimeout(() => VETA.repinta(), VETA.reducido() ? 0 : 160); }
    }
  });
})();
