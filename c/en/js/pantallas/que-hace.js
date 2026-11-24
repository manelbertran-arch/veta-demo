/* Veta demo · pantallas · que-hace.js · ronda 6 · paquete C (P2)
   A19 · #/que-hace · “Qué hace Veta”: el sitio que lo explica todo (lo pidió Manel), sin manual.
   Empieza con la escena en que Veta lee un chat y lo convierte en tarjeta. Después, tres grupos:
   “Esto ya lo hago yo” · “Esto lo hacemos entre los dos” · “Esto todavía no lo sé hacer”.
   Cada fila, con un ejemplo sacado de los datos de la demo y “Verlo”, que lleva a su sitio en la app.
   Se llega desde Veta (A8), desde Hoy (P1) y desde el primer día (A18, paso 4). */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const oro = (t, k) => VETA.vivo.oro(t, {clave: 'qh-' + k});

  // [qué hago, ejemplo (html), adónde lleva “Verlo”, rótulo opcional]
  const grupos = () => {
    const vis = C.visitas(), fuera = VETA.modelo.lectura().fuera;
    return [
      {id: 'yo', titulo: 'What I already do', icono: 'check', filas: [
        ['I read your work chats', `I read ${esc(VETA.num(C.leidos()))} chats. I do not read those of ${esc(fuera[0] || 'your family')} and ${fuera.length - 1} more.`, 'cuenta/chats'],
        ['I note what people promise you', `Elena told you: “${oro('I\'ll send you the payslip on Wednesday', 'elena')}”. If it does not come, I tell you.`, 'espera'],
        ['I mark who has replied to you', 'Jordi replied to you on Friday. This way you do not write the same thing to him twice.', 'regla/r-contestado'],
        ['I tell you before a signing', 'On Monday 30 I remind you about Laia Casas\'s signing and what to bring.', 'regla/r-firmas'],
        ['I remember every client', 'Marta can only see flats on Saturdays. I do not suggest another day.', 'cliente/marta'],
        ['I remove what is no longer needed', 'If the client has already replied to you, I take it off your list and tell you why.', 'hoy']
      ]},
      {id: 'dos', titulo: 'What we do together', icono: 'equipo', sub: 'I prepare it. You decide.', filas: [
        ['I write the replies for you', `Marta asked: “${oro('Is the Gràcia flat still available?', 'gracia')}”. The reply is already written. You send it.`, 'hoy'],
        ['I write the viewing notes', 'You leave Verdi with Elena, you tell me how it went and the notes are written.', 'visita/elena'],
        ['I prepare owner reports', 'Pere Soler\'s, every Monday since 7 Oct. You send it.', 'regla/r-informes'],
        ['I suggest another date if they cancel', 'Jordi cancelled on Friday. I would suggest Thursday 26 at 18:00.', 'regla/r-cancelaciones', 'I\'m trying it'],
        ['I learn when you correct me', 'If you change a message, I ask you once: “Shall I always do it this way?”', 'aprendido'],
        ['I tell you what you repeat', vis.estado === 'propuesta' ? 'Confirm viewings the day before: you have done it 9 times. Shall I do it?' : 'Confirm viewings the day before: ' + esc(vis.texto.toLowerCase()) + '.', 'regla/r-visitas'],
        ['I learn what you ask me by talking', '“If someone does not reply in three days, get a reminder ready for me.” I suggest it, and you decide.', 'dictar/orden']
      ]},
      {id: 'no', titulo: 'What I cannot do yet', icono: 'candado', filas: [
        ['Send messages without you', 'During the pilot I send nothing unless you say yes.', 'regla/r-visitas'],
        ['Put things in your calendar', 'I tell you the time of each viewing. You put it in your calendar.', 'visitas'],
        ['Do everything you ask me', 'I only learn jobs I have already seen in your chats. See which ones they are.', 'mapa']
      ]}
    ];
  };

  // ronda 7: la escena arriba y los tres grupos en filas con su número; cada grupo se abre en el sitio con sus trabajos (cada uno lleva a su sitio)
  const linea = ([t, ej, ir]) => `<button type="button" class="r7c-prop" data-ir="${esc(ir)}"><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
  // cuántas cosas ya hago yo: el mismo número aquí y en “Antes y ahora”
  C.yaHago = () => grupos()[0].filas.length;

  VETA.pantalla('A19', {
    titulo: 'Veta in one minute',
    frase: 'I read your work chats, get ready what you need to do and learn from you.',
    pinta: () => {
      const g = grupos(), NOMBRE = {yo: 'I do it', dos: 'We do it together', no: 'I cannot do it yet'}, PASA = {yo: 'Without you asking', dos: 'I prepare it. You decide', no: 'Not yet'};
      return `<div class="c-qh-escena" data-i="0">${VETA.vivo.escena({clave: 'que-hace', ir: 'hoy', boton: 'See it in Your turn'})}</div>` +
        VETA.r7.lista(g.map(x => ({icono: x.icono, oro: x.id !== 'no', nombre: NOMBRE[x.id], pasa: PASA[x.id], numero: x.filas.length,
          abre: `<div class="r7c-props">${x.filas.map(linea).join('')}</div>`})), {i: 1, clase: 'r7c-tras'});
    }
  });
  void M;
})();
