/* Veta demo · datos · veta.js
   Lo que Veta hace sola (reglas, A9), sus casos (H18, H19), «Lo último», lo que lee (A15, A15b, H13)
   y los textos legales de H29. Reglas: 7 = 1 propuesta + 1 a prueba + 5 activas. Su estado se cambia con
   VETA.modelo.marca('r-<id>', 'a-prueba' | 'activa' | 'descartada' | 'propuesta'). */
(function () {
  'use strict';
  const D = VETA.datos;
  // las fechas, por la única regla (VETA.fecha.corta): «Sáb 21» hasta seis días, «13 nov» si hace más
  const F = iso => VETA.fecha.corta(iso);

  D.reglas = [
    {id: 'r-valoraciones', texto: 'Preparar el informe del piso antes de una valoración', estadoInicial: 'propuesta', estadoTexto: 'por decidir', pruebaDias: 14,
      casos: {
        comoYo: [[F('2026-11-13'), 'Rosa Vidal'], [F('2026-11-05'), 'Família Casals'], [F('2026-10-29'), 'Sergi Font'], [F('2026-10-22'), 'Anna Bosch'], [F('2026-10-15'), 'Pau Mir'], [F('2026-10-08'), 'Carme Roca'],
          [F('2026-09-30'), 'Lluís Pons'], [F('2026-09-24'), 'Marta Puig'], [F('2026-09-16'), 'Joan Vila'], [F('2026-09-05'), 'Elena Vives'], [F('2026-08-27'), 'Pere Soler']].map(([cuando, nombre]) => ({cuando, nombre})),
        distinto: [{cuando: F('2026-11-06'), nombre: 'Jordi Ferrer', cliente: 'jordi', texto: '¿Cuánto podría pedir por el piso de mi madre?'},
          {cuando: F('2026-10-21'), nombre: 'Núria Camps', cliente: 'nuria', texto: 'Antes de nada, ¿puedes venir a verlo?'},
          {cuando: F('2026-09-02'), nombre: 'Toni Ribas', cliente: 'toni', texto: 'No hace falta informe, dime una cifra aproximada.'}]
      }},
    {id: 'r-cancelaciones', texto: 'Proponer otra fecha cuando se cancela una visita', estadoInicial: 'a-prueba', dia: 5, pruebaDias: 14},
    {id: 'r-actas', texto: 'Pedirte el acta después de cada visita', estadoInicial: 'activa', desde: '3 sep',
      ultimo: [F('2026-11-21') + ' · Família Casals', F('2026-11-19') + ' · Toni Ribas', F('2026-11-17') + ' · Sergi Font']},
    {id: 'r-promesas', texto: 'Apuntar lo que te prometen y avisarte si no llega', estadoInicial: 'activa', desde: '3 sep',
      ultimo: [F('2026-11-20') + ' · Jordi (tú, el informe del piso)', F('2026-11-16') + ' · Elena (la nómina)', F('2026-11-13') + ' · Pere (el certificado)']},
    {id: 'r-informes', texto: 'Preparar el informe de cada propietario los lunes', estadoInicial: 'activa', desde: '7 oct',
      ultimo: [F('2026-11-16') + ' · Pere Soler · enviado', F('2026-11-09') + ' · Pere Soler · enviado', F('2026-11-02') + ' · Pere Soler · enviado']},
    {id: 'r-contestado', texto: 'Marcar quién te ha contestado', estadoInicial: 'activa', desde: '3 sep',
      ultimo: [F('2026-11-20') + ' · Jordi', F('2026-11-19') + ' · Toni', F('2026-11-18') + ' · Anna Bosch']},
    {id: 'r-firmas', texto: 'Avisarte el día antes de una firma', estadoInicial: 'activa', desde: '3 sep',
      ultimo: [F('2026-11-30') + ' · te avisaré de la firma de Laia Casas', F('2026-11-09') + ' · arras del piso de Sants', F('2026-10-15') + ' · arras del piso de Pujades']}
  ];
  // la regla que nace en A11 al dictar la orden; entra en la lista cuando se marca 'a-prueba'
  D.reglaNueva = {id: 'r-recordatorios', texto: 'Preparar un recordatorio cuando un comprador no contesta en tres días', estadoInicial: 'nueva', pruebaDias: 14,
    casos: [[F('2026-11-09'), 'Marta Puig'], [F('2026-10-30'), 'Toni Ribas'], [F('2026-10-28'), 'Elena Vives'], [F('2026-10-19'), 'Sergi Font'], [F('2026-10-15'), 'Jordi Ferrer'], [F('2026-10-02'), 'Anna Bosch']].map(([cuando, nombre]) => ({cuando, nombre}))};

  // A15, A15b, H13 · lo que lee Veta
  D.lectura = {chats: 212, canales: [
    {nombre: 'WhatsApp Business', hace: 'hace 4 min'}, {nombre: 'Correo de la oficina', hace: 'hace 9 min'}, {nombre: 'Llamadas de la oficina', hace: 'hace 12 min'}],
    hoy: {chats: 8, audios: 10, porEscuchar: 1},
    fuera: ['Mamá', 'Javi (hermano)', 'Grupo de la cena del viernes']};

  // lo mismo, de Montse (dirección también vende: sus chats y sus personales; no ve los de nadie más)
  D.lecturaPor = {montse: {chats: 64, canales: D.lectura.canales, hoy: {chats: 5, audios: 2, porEscuchar: 0},
    fuera: ['Familia Ribas', 'Pádel de los jueves']}};

  // H29 · textos legales (resúmenes inventados para la demo; no son textos jurídicos)
  D.textos = {
    acuerdo: {titulo: 'Acuerdo de datos', bloques: [
      {texto: 'Veta lee los chats de trabajo que tú eliges y los usa para prepararte el día. No envía nada sin que tú lo apruebes.'},
      {titulo: 'Lo que no lee', texto: 'Tus grupos personales y los chats que dejas fuera. No salen en ninguna pantalla.'},
      {titulo: 'Si dejas la agencia', texto: 'Las fichas y la historia de tus clientes se quedan en la oficina. Tus chats personales nunca han entrado.'}]},
    agencia: {titulo: 'Si dejas la agencia', bloques: [
      {texto: 'Las fichas y la historia de tus clientes se quedan en la oficina. Tus chats personales nunca han entrado.'}]},
    resumen: {titulo: 'Cómo cuida Veta los datos', bloques: [
      {lista: ['Lee solo los canales conectados por la oficina.', 'Cada mensaje que sale lo aprueba una persona.', 'Dirección ve cifras de equipo, nunca por persona.', 'Puedes dejar fuera cualquier chat cuando quieras.']}]},
    borrado: {titulo: 'Qué se guarda y qué se borra', bloques: [
      {texto: 'Cuando dejas un chat fuera, Veta borra lo que había leído de él y te deja escrito qué ha borrado, con la fecha y la hora.'},
      {texto: 'Lo que ya forma parte de la ficha de un cliente (una visita, un acta de la visita) se queda en la ficha.'}]},
    ver: {titulo: 'Qué puedes ver y qué no', bloques: [
      {texto: 'Cada persona ve lo suyo: sus clientes, su día y sus trabajos.'},
      {texto: 'Dirección ve los números del equipo y las decisiones de la oficina. No ve los números de cada persona por separado.'}]},
    leido: {titulo: 'Qué se ha leído y qué ha salido', bloques: [
      {texto: 'Leo 212 chats de trabajo, desde el 3 de septiembre.'},
      {texto: 'Salido: solo lo que una persona aprobó y envió desde su WhatsApp. Veta no ha enviado nada sola.'}]},
    consentimientos: {titulo: 'Quién ha dicho que sí', bloques: [
      {texto: '212 chats, desde el 3 de septiembre. Cada contacto nuevo recibe el aviso de privacidad de la agencia en su primer mensaje.'}]}
  };
})();
