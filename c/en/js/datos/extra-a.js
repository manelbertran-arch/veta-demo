/* Veta demo · datos · extra-a.js · paquete A (El día)
   Datos que el paquete A necesita y no están en js/datos/ (base, dia, clientes, veta, oficina).
   Se añaden a VETA.datos sin pisar lo que ya hay, y cada dato nuevo se apunta en ESTADO_A.md. */
(function () {
  'use strict';
  const D = VETA.datos;
  if (D.diaA) return;

  D.diaA = {
    // A2 · los tres ajustes del borrador (texto entero). Inventados por el paquete A.
    ajustes: {
      'c-marta': {
        corto: 'Hi Marta. Does Saturday at 11:00 work for you to see the Gràcia flat?',
        cercano: 'Hi Marta! It\'s Laura. Yes, it\'s still available. Does Saturday at 11:00 work for you? I\'ll send you the address and we\'ll meet at the door.',
        otroDia: 'Hi Marta, it\'s Laura. Saturday is tricky for me: does Friday at 18:00 work for you to see the Gràcia flat? I\'ll send you the address.'},
      'c-jordi': {
        corto: 'Hi Jordi. Here is the report for the Olzinelles flat: plans, land registry extract and community fees.',
        cercano: 'Hi Jordi! It\'s Laura. Here is the report for the Olzinelles flat, so you can show it to your sister: plans, land registry extract and community fees.',
        otroDia: 'Hi Jordi, it\'s Laura. I will send you the report for the Olzinelles flat on Wednesday, with plans, land registry extract and community fees. Does that suit you?'},
      'c-nuria': {
        corto: 'Hi Núria. A flat has come in in Sant Antoni with a balcony: 2 bedrooms, €289,000. Shall I send you photos?',
        cercano: 'Hi Núria! It\'s Laura. You asked me to let you know and here it is: Sant Antoni, with a balcony, 2 bedrooms, €289,000. Shall I send you photos?',
        otroDia: 'Hi Núria, it\'s Laura. A flat has come in in Sant Antoni with a balcony. Does Thursday afternoon work for you to see it?'},
      'c-carmen': {
        corto: 'Hi Carmen, it\'s Laura. We have a 3-bedroom flat in Gràcia that fits. Shall we see it this week?',
        cercano: 'Hi Carmen! It\'s Laura, from the agency. Sorry for the wait. We have a 3-bedroom flat on Verdi street that fits what you\'re looking for. Does it suit you to see it this week?',
        otroDia: 'Hi Carmen, it\'s Laura, from the agency. We have a 3-bedroom flat in Gràcia that fits. Does Thursday at 18:00 work for you to see it?'},
      'c-pere': {
        corto: 'Hi Pere. Last week: 3 viewings. All 3 think the price is high. Shall we talk on Thursday?',
        cercano: 'Hi Pere. Here is how it went: 3 viewings last week, and all 3 think the price is high. Toni Ribas will come back with his architect. Shall I call you on Thursday so we can talk it through?',
        otroDia: 'Hi Pere. Last week: 3 viewings. All 3 think the price is high. Toni Ribas will come back with his architect. Shall we talk about the price on Friday?'}
    },

    // A12 · informe al propietario (el mensaje es el texto del plan; “texto” de la tarjeta con foto, inventado por el paquete A)
    informe: {
      pere: {cosa: 'c-pere', para: 'For Pere Soler · week of 16 to 22 November', piso: 'verdi', titulo: 'How your Gràcia flat is doing', visitas: 3,
        texto: '3 people came to see it. All 3 like the light and all 3 think the price is high. Toni Ribas will come back with his architect.',
        firma: 'Prepared by Laura Martí',
        mensaje: 'Hi Pere. Last week: 3 viewings. All 3 think the price is high. Toni Ribas will come back with his architect. Shall we talk about the price on Thursday?',
        voz: 'Pere left you a message on Saturday'}
    },

    // A4b · tarea o nota (textos del plan)
    entendido: {
      tarea: {tipo: 'tarea', entendido: 'Understood: a task', que: 'Call Jordi Ferrer', cliente: 'jordi',
        dias: [{id: 'jue', texto: 'Thursday 26, 10:00', fecha: 'Thu 26', fechaISO: '2026-11-26'},
          {id: 'vie', texto: 'Friday 27, 10:00', fecha: 'Fri 27', fechaISO: '2026-11-27'},
          {id: 'lun', texto: 'Monday 30, 10:00', fecha: 'Mon 30', fechaISO: '2026-11-30'}],
        pie: 'I watch it and put it in your calendar.', boton: 'Save the task', linea: 'Saved · Call Jordi'},
      nota: {tipo: 'nota', entendido: 'Understood: a note for Pere Soler\'s profile', texto: 'Pere prefers me to call him in the afternoon, after 16:00.', cliente: 'pere',
        pie: 'It stays in his History.', boton: 'Save the note', linea: 'Saved · Note on Pere\'s profile'}
    },

    // duración por defecto de “Lo que dijiste” si se entra sin dictar (segundos)
    duracion: {acta: 72, tarea: 4, nota: 5, orden: 6, pregunta: 2},

    // H09 · “No es eso”
    noEsEso: [
      {guion: 'acta', texto: 'Viewing notes'}, {guion: 'tarea', texto: 'A task'}, {guion: 'nota', texto: 'A note'},
      {guion: 'orden', texto: 'An instruction for Veta'}, {guion: 'pregunta', texto: 'A question'}],

    // H04 · lo que he leído (Detectado hoy y Ya no está aquí)
    detectado: ['Marta Puig wants to see the flat', 'The Sant Antoni flat fits Núria Camps'],
    yaNo: {cosa: 'c-sergi', texto: 'Sergi Mas: Anna replied to him on Friday'},

    // A1 vacía · “¿Me enseñas esto?”
    ensenas: {regla: 'r-valoraciones', titulo: 'Will you show me this?', texto: 'I saw that when someone asks for a valuation, you send the flat report the next day. Shall I prepare it?', ir: 'regla/r-valoraciones'}
  };
})();
