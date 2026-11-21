/* Veta demo · datos · veta.js
   Lo que Veta hace sola (reglas, A9), sus casos (H18, H19), «Lo último», lo que lee (A15, A15b, H13)
   y los textos legales de H29. Reglas: 7 = 1 propuesta + 1 a prueba + 5 activas. Su estado se cambia con
   VETA.modelo.marca('r-<id>', 'a-prueba' | 'activa' | 'descartada' | 'propuesta'). */
(function () {
  'use strict';
  const D = VETA.datos;

  D.reglas = [
    {id: 'r-valoraciones', texto: 'Preparar el informe del piso antes de una valoración', estadoInicial: 'propuesta', estadoTexto: 'por decidir', pruebaDias: 14,
      casos: {
        comoYo: [['13 nov', 'Rosa Vidal'], ['5 nov', 'Família Casals'], ['29 oct', 'Sergi Font'], ['22 oct', 'Anna Bosch'], ['15 oct', 'Pau Mir'], ['8 oct', 'Carme Roca'],
          ['30 sep', 'Lluís Pons'], ['24 sep', 'Marta Puig'], ['16 sep', 'Joan Vila'], ['5 sep', 'Elena Vives'], ['27 ago', 'Pere Soler']].map(([cuando, nombre]) => ({cuando, nombre})),
        distinto: [{cuando: '6 nov', nombre: 'Jordi Ferrer', cliente: 'jordi', texto: '¿Cuánto podría pedir por el piso de mi madre?'},
          {cuando: '21 oct', nombre: 'Núria Camps', cliente: 'nuria', texto: 'Antes de nada, ¿puedes venir a verlo?'},
          {cuando: '2 sep', nombre: 'Toni Ribas', cliente: 'toni', texto: 'No hace falta informe, dime una cifra aproximada.'}]
      }},
    {id: 'r-cancelaciones', texto: 'Proponer otra fecha cuando se cancela una visita', estadoInicial: 'a-prueba', dia: 5, pruebaDias: 14},
    {id: 'r-actas', texto: 'Pedirte la nota después de cada visita', estadoInicial: 'activa', desde: '3 sep',
      ultimo: ['Sáb 21 · Família Casals', 'Jue 19 · Toni Ribas', 'Mar 17 · Sergi Font']},
    {id: 'r-promesas', texto: 'Apuntar lo que te prometen y avisarte si no llega', estadoInicial: 'activa', desde: '3 sep',
      ultimo: ['Vie 20 · Jordi (tú, el informe del piso)', 'Lun 16 · Elena (la nómina)', 'Vie 13 · Pere (el certificado)']},
    {id: 'r-informes', texto: 'Preparar el informe de cada propietario los lunes', estadoInicial: 'activa', desde: '7 oct',
      ultimo: ['Lun 16 · Pere Soler · enviado', 'Lun 9 · Pere Soler · enviado', 'Lun 2 · Pere Soler · enviado']},
    {id: 'r-contestado', texto: 'Marcar quién te ha contestado', estadoInicial: 'activa', desde: '3 sep',
      ultimo: ['Vie 20 · Jordi', 'Jue 19 · Toni', 'Mié 18 · Anna Bosch']},
    {id: 'r-firmas', texto: 'Avisarte el día antes de una firma', estadoInicial: 'activa', desde: '3 sep',
      ultimo: ['Lun 30 · te avisaré de la firma de Laia Casas', 'Lun 9 · arras del piso de Sants', '15 oct · arras del piso de Pujades']}
  ];
  // la regla que nace en A11 al dictar la orden; entra en la lista cuando se marca 'a-prueba'
  D.reglaNueva = {id: 'r-recordatorios', texto: 'Preparar un recordatorio cuando un comprador no contesta en tres días', estadoInicial: 'nueva', pruebaDias: 14,
    casos: [['9 nov', 'Marta Puig'], ['30 oct', 'Toni Ribas'], ['28 oct', 'Elena Vives'], ['19 oct', 'Sergi Font'], ['15 oct', 'Jordi Ferrer'], ['2 oct', 'Anna Bosch']].map(([cuando, nombre]) => ({cuando, nombre}))};

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
      {texto: 'Lo que ya forma parte de la ficha de un cliente (una visita, una nota de la visita) se queda en la ficha.'}]},
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
