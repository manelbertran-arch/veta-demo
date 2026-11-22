/* Veta demo · pantallas · historia.js · B (Clientes) · ronda 7
   - A16 · Lo que ha pasado · #/cliente/<id>/historia: una lista, lo último arriba. Las filas con algo que leer abren H16
     (acta, informe enviado o mensaje) o H10 (el mensaje de Pere). «Lo que sé de…» vive ahora en «Pregúntale a Veta» (A5p).
   Dirección con el cliente de otra persona: los hitos, sin el texto del chat y sin abrir nada. */
(function () {
  'use strict';
  const UI = VETA.UI, B = VETA.B, M = VETA.modelo;
  const ICONO = {'Acta': 'tarea', 'Nota de voz': 'mic', 'Informe': 'casa', 'Mensaje': 'chat', 'Tú': 'enviar', 'Encargo': 'sello', 'Notaría': 'sello', 'Arras': 'sello', 'Visita': 'casa'};
  const nombre = t => String(t || '').replace(/^Nota de la visita/, 'Acta de la visita');
  const corta = (t, n) => { t = String(t || ''); n = n || 40; return t.length > n ? t.slice(0, n - 1).replace(/[\s,.;:·]+\S*$/, '') + '…' : t; };
  const limpio = t => String(t || '').replace(/[«»]/g, '');

  VETA.pantalla('A16', {
    titulo: 'Lo que ha pasado',
    frase: p => { const c = M.cliente(p.id); return !c ? '' : VETA.ajeno(c.id) ? 'Lo último, arriba. Ves qué pasó y cuándo; lo escrito es de quien lo lleva.' : `Lo último, arriba. Toca una fila para leerla entera.`; },
    guia: ['Aquí está todo lo que ha pasado con este cliente, por fecha.', 'Tú abres un acta, un informe o un mensaje para leerlo entero.', 'Así sabes de qué va antes de llamar.'],
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'No encuentro a este cliente.', icono: 'pregunta'});
      const todo = B.historia(c.id), ajeno = VETA.ajeno(c.id), suyo = (M.persona(c.lleva) || {}).corto || 'su agente';
      if (!todo.length) return UI.vacio({titulo: 'Todavía no ha pasado nada con este cliente.', texto: 'Lo que pase en sus chats saldrá aquí, por fecha.', icono: 'libro'});
      const CHAT = ['Mensaje', 'Tú', 'Nota de voz', 'Informe'];
      // FN · privacidad: de un acta o una nota de otra persona, dirección ve que existe y su fecha; el texto, no
      const ACTA = h => /^(acta|nota)\b/i.test(h.tipo || '');
      return VETA.r7.lista(todo.map(h => ajeno ? {
        icono: ICONO[h.tipo] || 'reloj',
        nombre: h.tipo === 'Tú' ? `Mensaje de ${suyo}` : h.tipo === 'Mensaje' ? `Mensaje de ${B.corto(c)}` : h.tipo === 'Nota de voz' ? `Nota de voz de ${B.corto(c)}` : h.tipo === 'Informe' ? (/^informe-(\d+|hoy)$/.test(h.det || '') ? 'Informe de la semana, enviado' : 'Informe enviado') : nombre(h.titulo),
        pasa: CHAT.includes(h.tipo) || ACTA(h) ? h.cuando : corta(`${h.cuando}: ${limpio(h.texto)}`)} : {
        icono: ICONO[h.tipo] || 'reloj', nombre: corta(nombre(h.titulo), 30), pasa: h.texto ? corta(`${h.cuando}: ${limpio(h.texto)}`, 34) : h.cuando,
        hoja: h.hoja || null, de: h.hoja ? c.id : null, datos: h.hoja ? {k: h.k} : null}));
    }
  });
})();
