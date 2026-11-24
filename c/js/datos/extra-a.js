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
        corto: 'Hola, Marta. ¿Os va bien el sábado a las 11:00 para ver el piso de Gràcia?',
        cercano: '¡Hola, Marta! Soy Laura. Sí, sigue disponible. ¿Os va bien el sábado a las 11:00? Te paso la dirección y nos vemos en el portal.',
        otroDia: 'Hola, Marta, soy Laura. El sábado lo tengo complicado: ¿os va bien el viernes a las 18:00 para ver el piso de Gràcia? Te paso la dirección.'},
      'c-jordi': {
        corto: 'Hola, Jordi. Te paso el informe del piso de Olzinelles: planos, nota simple y gastos de comunidad.',
        cercano: '¡Hola, Jordi! Soy Laura. Aquí tienes el informe del piso de Olzinelles para enseñárselo a tu hermana: planos, nota simple y gastos de comunidad.',
        otroDia: 'Hola, Jordi, soy Laura. Te paso el informe del piso de Olzinelles el miércoles, con planos, nota simple y gastos de comunidad. ¿Te va bien?'},
      'c-nuria': {
        corto: 'Hola, Núria. Ha entrado un piso en Sant Antoni con balcón: 2 habitaciones, 289.000 €. ¿Te paso fotos?',
        cercano: '¡Hola, Núria! Soy Laura. Me pediste que te avisara y aquí está: Sant Antoni, con balcón, 2 habitaciones, 289.000 €. ¿Te paso fotos?',
        otroDia: 'Hola, Núria, soy Laura. Ha entrado un piso en Sant Antoni con balcón. ¿Te va bien verlo el jueves por la tarde?'},
      'c-carmen': {
        corto: 'Hola, Carmen, soy Laura. Tenemos en Gràcia un piso de 3 habitaciones que encaja. ¿Lo vemos esta semana?',
        cercano: '¡Hola, Carmen! Soy Laura, de la agencia. Perdona la espera. Tenemos en la calle Verdi un piso de 3 habitaciones que encaja con lo que buscas. ¿Te va bien verlo esta semana?',
        otroDia: 'Hola, Carmen, soy Laura, de la agencia. Tenemos en Gràcia un piso de 3 habitaciones que encaja. ¿Te va bien verlo el jueves a las 18:00?'},
      'c-pere': {
        corto: 'Hola, Pere. La semana pasada: 3 visitas. A los 3 les parece alto el precio. ¿Hablamos el jueves?',
        cercano: 'Hola, Pere. Te cuento cómo ha ido: 3 visitas la semana pasada y a los 3 les parece alto el precio. Toni Ribas volverá con su arquitecto. ¿Te llamo el jueves y lo hablamos con calma?',
        otroDia: 'Hola, Pere. La semana pasada: 3 visitas. A los 3 les parece alto el precio. Toni Ribas volverá con su arquitecto. ¿Hablamos del precio el viernes?'}
    },

    // A12 · informe al propietario (el mensaje es el texto del plan; «texto» de la tarjeta con foto, inventado por el paquete A)
    informe: {
      pere: {cosa: 'c-pere', para: 'Para Pere Soler · semana del 16 al 22 de noviembre', piso: 'verdi', titulo: 'Así va tu piso de Gràcia', visitas: 3,
        texto: 'Han venido 3 personas a verlo. A las 3 les gusta la luz y a las 3 les parece alto el precio. Toni Ribas volverá con su arquitecto.',
        firma: 'Preparado por Laura Martí',
        mensaje: 'Hola, Pere. La semana pasada: 3 visitas. A los 3 les parece alto el precio. Toni Ribas volverá con su arquitecto. ¿Hablamos del precio el jueves?',
        voz: 'Pere te dejó un mensaje el sábado'}
    },

    // A4 · acta de la visita (textos del plan)
    acta: {
      elena: {cosa: 'c-elena', cliente: 'elena', nombre: 'Elena', entendido: 'He entendido: acta de la visita con Elena', donde: 'Hoy, 9:00 · piso de Gràcia, c/ Verdi 42',
        bloques: [
          {id: 'gusto', titulo: 'Lo que le gustó', texto: 'La luz del salón, la terraza y la cocina reformada.'},
          {id: 'preocupa', titulo: 'Lo que le preocupa', texto: 'El ruido de la calle por la noche. Que no haya ascensor: es un tercero.'},
          {id: 'siguiente', titulo: 'Siguiente paso', texto: 'Segunda visita el sábado por la tarde, con su pareja, para oír la calle.'}],
        tarea: 'Llamar a Elena el jueves 26 para confirmar la visita del sábado', tareaPie: 'La pongo en tu calendario.',
        lineaTarea: 'He apuntado: llamar a Elena el jueves 26', propietario: 'pere'}
    },

    // A4b · tarea o nota (textos del plan)
    entendido: {
      tarea: {tipo: 'tarea', entendido: 'He entendido: una tarea', que: 'Llamar a Jordi Ferrer', cliente: 'jordi',
        dias: [{id: 'jue', texto: 'Jueves 26, 10:00', fecha: 'Jue 26', fechaISO: '2026-11-26'},
          {id: 'vie', texto: 'Viernes 27, 10:00', fecha: 'Vie 27', fechaISO: '2026-11-27'},
          {id: 'lun', texto: 'Lunes 30, 10:00', fecha: 'Lun 30', fechaISO: '2026-11-30'}],
        pie: 'La vigilo yo y la pongo en tu calendario.', boton: 'Guardar la tarea', linea: 'Guardada · Llamar a Jordi'},
      nota: {tipo: 'nota', entendido: 'He entendido: una nota para la ficha de Pere Soler', texto: 'Pere prefiere que le llame por la tarde, después de las 16:00.', cliente: 'pere',
        pie: 'Queda en su Historia.', boton: 'Guardar la nota', linea: 'Guardada · Nota en la ficha de Pere'}
    },

    // A3 · contexto de cada guion y H08 · «¿Qué puedo decir?»
    contexto: {acta: 'Después de la visita con Elena Vives', nota: 'Una nota para la ficha de Pere Soler'},
    queDecir: [
      {guion: 'acta', texto: 'Cómo ha ido una visita'}, {guion: 'tarea', texto: 'Una tarea'},
      {guion: 'orden', texto: 'Una orden para Veta'},
      {guion: 'aviso', texto: 'Un aviso', papel: 'direccion'}, {guion: 'operacion', texto: 'Una pregunta sobre una operación', papel: 'direccion'},
      {guion: 'queja', texto: 'Una queja de un cliente', papel: 'direccion'}, {guion: 'mejorar', texto: 'Qué mejorar', papel: 'direccion'}],
    // duración por defecto de «Lo que dijiste» si se entra sin dictar (segundos)
    duracion: {acta: 72, tarea: 4, nota: 5, orden: 6, pregunta: 2},

    // H09 · «No es eso»
    noEsEso: [
      {guion: 'acta', texto: 'Un acta de la visita'}, {guion: 'tarea', texto: 'Una tarea'}, {guion: 'nota', texto: 'Una nota'},
      {guion: 'orden', texto: 'Una orden para Veta'}, {guion: 'pregunta', texto: 'Una pregunta'}],

    // H04 · lo que he leído (Detectado hoy y Ya no está aquí)
    detectado: ['Marta Puig pide ver el piso', 'El piso de Sant Antoni encaja con Núria Camps'],
    yaNo: {cosa: 'c-sergi', texto: 'Sergi Mas: Anna le contestó el viernes'},

    // A1 vacía · «¿Me enseñas esto?»
    ensenas: {regla: 'r-valoraciones', titulo: '¿Me enseñas esto?', texto: 'He visto que cuando alguien pide una valoración envías el informe del piso al día siguiente. ¿Lo preparo yo?', ir: 'regla/r-valoraciones'},

    // A7 · pie
    esperaPie: 'Tu familia y tus amigos nunca salen aquí. Veta solo sigue tu trabajo.'
  };
})();
