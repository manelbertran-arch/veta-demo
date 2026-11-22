/* Veta demo · pantallas · historia.js · B (Clientes) · ronda 7
   - A16 · Lo que ha pasado · #/cliente/<id>/historia: una lista, lo último arriba. Las filas con algo que leer abren H16
     (acta, informe enviado o mensaje) o H10 (el mensaje de Pere). “Lo que sé de…” vive ahora en “Pregúntale a Veta” (A5p).
   Dirección con el cliente de otra persona: los hitos, sin el texto del chat y sin abrir nada. */
(function () {
  'use strict';
  const UI = VETA.UI, B = VETA.B, M = VETA.modelo;
  const ICONO = {'Notes': 'tarea', 'Voice note': 'mic', 'Report': 'casa', 'Message': 'chat', 'You': 'enviar', 'Mandate': 'sello', 'Notary': 'sello', 'Deposit': 'sello', 'Viewing': 'casa'};
  const nombre = t => String(t || '').replace(/^Nota de la visita/, 'Acta de la visita');
  const corta = (t, n) => { t = String(t || ''); n = n || 40; return t.length > n ? t.slice(0, n - 1).replace(/[\s,.;:·]+\S*$/, '') + '…' : t; };
  const limpio = t => String(t || '').replace(/[“”]/g, '');

  VETA.pantalla('A16', {
    titulo: 'What has happened',
    frase: p => { const c = M.cliente(p.id); return !c ? '' : VETA.ajeno(c.id) ? 'Latest at the top. You see what happened and when; what is written belongs to whoever has the client.' : `Latest at the top. Tap a row to read it in full.`; },
    guia: ['Here\'s everything that has happened with this client, by date.', 'You open viewing notes, a report or a message to read it in full.', 'That way you know what it\'s about before calling.'],
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'I can\'t find this client.', icono: 'pregunta'});
      const todo = B.historia(c.id), ajeno = VETA.ajeno(c.id), suyo = (M.persona(c.lleva) || {}).corto || 'their agent';
      if (!todo.length) return UI.vacio({titulo: 'Nothing has happened with this client yet.', texto: 'What happens in their chats will show here, by date.', icono: 'libro'});
      const CHAT = ['Message', 'You', 'Voice note', 'Report'];
      // FN · privacidad: de un acta o una nota de otra persona, dirección ve que existe y su fecha; el texto, no
      const ACTA = h => /^(acta|nota)\b/i.test(h.tipo || '');
      return VETA.r7.lista(todo.map(h => ajeno ? {
        icono: ICONO[h.tipo] || 'reloj',
        nombre: h.tipo === 'You' ? `Message from ${suyo}` : h.tipo === 'Message' ? `Message from ${B.corto(c)}` : h.tipo === 'Voice note' ? `Voice note from ${B.corto(c)}` : h.tipo === 'Report' ? (/^informe-(\d+|hoy)$/.test(h.det || '') ? 'Weekly report, sent' : 'Report sent') : nombre(h.titulo),
        pasa: CHAT.includes(h.tipo) || ACTA(h) ? h.cuando : corta(`${h.cuando}: ${limpio(h.texto)}`)} : {
        icono: ICONO[h.tipo] || 'reloj', nombre: corta(nombre(h.titulo), 30), pasa: h.texto ? corta(`${h.cuando}: ${limpio(h.texto)}`, 34) : h.cuando,
        hoja: h.hoja || null, de: h.hoja ? c.id : null, datos: h.hoja ? {k: h.k} : null}));
    }
  });
})();
