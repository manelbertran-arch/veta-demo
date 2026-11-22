/* Veta demo · ronda 7 · js/datos/r7-e.js · agente E · “Enséñale a Veta” (#/dictar/<guion>)
   VETA.datos.r7e: lo que se puede enseñar (lecciones), con qué palabras lo enseña cada papel y los guiones de un solo paso.
   Los casos de “Pruébalo” salen de clientes y fechas que ya están en la app (datos/veta.js, r6-veta.js);
   los mensajes que “habría dejado escritos” y los casos de dirección están inventados para la demo (ver ESTADO_R7_E.md). */
(function () {
  'use strict';
  const D = VETA.datos;

  D.r7e = {
    // paso 1, según quién entra
    agente: {frase: 'Tell me something you always do. I learn to do it myself.', ejemplos: ['recordatorios', 'visitas', 'valoraciones'],
      escribe: 'For example: when someone asks me for the keys, remind me to note it down', chats: 'your chats', veta: 'veta'},
    direccion: {frase: 'Tell me how your office works and I will do it that way for everyone.', ejemplos: ['contactos', 'acta-dia', 'informe-piso'],
      escribe: 'For example: when a client complains, call them the same day', chats: 'the office chats', veta: 'oficina'},

    // si se llega desde un caso (la pantalla de antes), qué lección sale la primera
    deCaso: {mensaje: 'recordatorios', visita: 'visitas', acta: 'visitas', informe: 'valoraciones'},

    // “Hasta dónde llego”: empieza en “Te lo dejo escrito”. Enviar sola, todavía no.
    hasta: [
      {id: 'escrito', texto: 'I write it for you', sub: 'I get it ready. You send it.', fila: 'I write it for you. Nothing goes out without you.'},
      {id: 'aviso', texto: 'I only tell you', sub: 'I tell you it is time. You do it.', fila: 'I only tell you. You do it.'}],
    hastaOficina: [
      {id: 'escrito', texto: 'I write it for you', sub: 'I get it ready for whoever it is for. That person sends it.', fila: 'I write it for you. Each person sends it.'},
      {id: 'aviso', texto: 'I only tell you', sub: 'I tell whoever it is for. That person does it.', fila: 'I only tell you. Each person does it.'}],
    hastaCerrado: 'I do not send it on my own yet. Nothing goes out without a person.',

    // lo que no está en ninguna lección (lo ha escrito la persona con sus palabras)
    tuya: {
      agente: {cuando: 'Every time it happens', quien: 'With all your clients', opc: {quien: ['With all your clients', 'Only with buyers', 'Only with owners']}},
      direccion: {cuando: 'Every time it happens', quien: 'With the whole team', opc: {}},
      sinCaso: 'I have not seen a case like this yet. The first time it happens I show you and you tell me if it is right.'
    },

    lecciones: {
      // ---- agente ----
      recordatorios: {papel: 'agente', regla: 'r-recordatorios', claves: ['reply', 'remind', 'three d'],
        dices: 'When a buyer doesn\'t reply to me in three days, prepare a reminder for me.',
        que: 'A reminder for the buyer', cuando: 'When they go three days without replying', quien: 'With your buyers',
        opc: {cuando: ['When they go three days without replying', 'When they go five days without replying', 'When they go a week without replying'],
          quien: ['With your buyers', 'With all your clients']},
        veces: 6, casos: [
          {cara: 'marta', nombre: 'Marta Puig', dia: 'on 9 November', paso: 'You wrote to her about the flat in Gràcia and she did not reply.',
            hice: 'Hi Marta. Have you had a chance to think about the flat in Gràcia? If you like, we can see it this week.', toca: 'Time to remind Marta about the flat in Gràcia.'},
          {cara: 'toni', nombre: 'Toni Ribas', dia: 'on 30 October', paso: 'You asked him if he wanted to see the flat again and he did not reply.',
            hice: 'Hi Toni. Would you like us to find another day to see the flat again?', toca: 'Time to ask Toni if he wants to see the flat again.'}]},
      visitas: {papel: 'agente', regla: 'r-visitas', claves: ['viewing', 'confirm'],
        dices: 'The day before each viewing, confirm it with the client.',
        que: 'A message to confirm the viewing', cuando: 'The day before each viewing', quien: 'With whoever is coming to the viewing',
        opc: {cuando: ['The day before each viewing', 'The morning of the viewing']},
        veces: 9, casos: [
          {cara: 'elena', nombre: 'Elena Vives', dia: 'on Friday 20 November', paso: 'She had a viewing on Saturday at 11:00. You confirmed it by hand.',
            hice: 'Hi Elena. Is tomorrow at 11:00 at the front door still OK for you?', toca: 'Time to confirm tomorrow\'s viewing with Elena.'},
          {cara: 'marta', nombre: 'Marta Puig', dia: 'on 13 November', paso: 'She had a viewing the next day. You confirmed it by hand.',
            hice: 'Hi Marta. Shall we meet at the flat tomorrow, as we agreed?', toca: 'Time to confirm tomorrow\'s viewing with Marta.'}]},
      valoraciones: {papel: 'agente', regla: 'r-valoraciones', claves: ['valuation', 'report'],
        dices: 'When someone asks for a valuation, prepare the flat report for me.',
        que: 'The flat report', cuando: 'When someone asks for a valuation', quien: 'With your owners',
        opc: {quien: ['With your owners', 'With all your clients']},
        veces: 11, casos: [
          {cara: 'rosa', nombre: 'Rosa Vidal', dia: 'on 13 November', paso: 'She asked you for a valuation. You sent her the report the next day.',
            hice: 'The report on their flat, with similar flats in their area, ready for you to send.', toca: 'Time to prepare the report for Rosa\'s flat.'},
          {cara: 'casals', nombre: 'Casals family', dia: 'on 5 November', paso: 'They asked for a valuation. You sent them the report the next day.',
            hice: 'The report on their flat, with similar flats in their area, ready for you to send.', toca: 'Time to prepare the report for the Casals\' flat.'}]},

      // ---- dirección (toda la oficina) ----
      contactos: {papel: 'direccion', claves: ['contact', 'two hours', 'new'],
        dices: 'When a new contact comes in, reply within two hours.',
        que: 'The first reply, for whoever it is for', cuando: 'When a new contact comes in', quien: 'With the whole team',
        opc: {cuando: ['When a new contact comes in', 'When it has gone an hour with no reply']},
        veces: 23, casos: [
          {icono: 'clientes', nombre: 'A new contact', dia: 'on Tuesday 17 November', paso: 'They wrote at 10:05. No one replied until 16:40.',
            hice: 'Hi, thanks for writing to us. Is it OK if we call you today at 12:00?', toca: 'There is a new contact with no reply.'}]},
      'acta-dia': {papel: 'direccion', claves: ['notes', 'viewing'],
        dices: 'After each viewing, the notes go out that same day.',
        que: 'The notes, for whoever did the viewing', cuando: 'When someone says they have come out of a viewing', quien: 'With the whole team',
        opc: {},
        veces: 14, casos: [
          {icono: 'cal', nombre: 'A viewing at Verdi 42', dia: 'on Thursday 12 November', paso: 'The viewing was in the morning. The notes were sent three days later.',
            hice: 'When they came out, I would have asked them to tell me about it and left the notes ready to send.', toca: 'The notes for the viewing at Verdi 42 are missing.'}]},
      'informe-piso': {papel: 'direccion', claves: ['valuation', 'report'],
        dices: 'When a valuation is asked for, the flat report goes out the next day.',
        que: 'The flat report, for whoever looks after the client', cuando: 'When someone asks for a valuation', quien: 'With the whole team',
        opc: {},
        veces: 14, casos: [
          {icono: 'doc', nombre: 'A valuation in Gràcia', dia: 'on 5 November', paso: 'It was asked for on a Thursday. The report went out the next Tuesday.',
            hice: 'The flat report, with similar flats in the area, ready on Friday morning.', toca: 'There is a valuation asked for with no report.'}]}
    },

    // guiones de un solo paso: se cuenta una cosa y se abre lo que sale (no enseñan nada a Veta)
    dictados: {
      acta: {titulo: 'How did it go?', frase: 'Tell me about the viewing as you would tell a colleague. I write the notes.', toca: 'Tap and tell me'},
      tarea: {titulo: 'Tell me what to note', frase: 'Tell me and I put it on your list, with its day.', toca: 'Tap and tell me'},
      nota: {titulo: 'Tell me what to note', frase: 'Tell me and I save it in the client\'s profile.', toca: 'Tap and tell me'},
      pregunta: {titulo: 'Ask me', frase: 'Ask anything you want about a client. I look in your chats.', toca: 'Tap and ask'},
      aviso: {titulo: 'Tell me what to alert you about', frase: 'Tell me and I tell you when it happens.', toca: 'Tap and tell me'},
      operacion: {titulo: 'Ask me', frase: 'Ask about a deal. I look in the office chats.', toca: 'Tap and ask'},
      queja: {titulo: 'Tell me what happened', frase: 'Tell me about the complaint and I note it in the client\'s profile.', toca: 'Tap and tell me'},
      mejorar: {titulo: 'Ask me', frase: 'Ask what could be better. I look at this week.', toca: 'Tap and ask'}
    }
  };
})();
