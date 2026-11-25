/* Veta demo · datos · extra-c.js · paquete C (Veta, cuenta y entrada)
   Datos que el paquete C necesita y no están en js/datos/ (base, dia, clientes, veta, oficina).
   Se añaden a VETA.datos.c sin pisar lo que ya hay. Lo inventado aquí está apuntado en ESTADO_C.md. */
(function () {
  'use strict';
  const C = VETA.datos.c = {};
  // fechas por la única regla: F (cola o título, con mayúscula) y f (dentro de una frase, en minúscula)
  const F = iso => VETA.fecha.corta(iso), f = iso => VETA.fecha.corta(iso, {frase: true});

  // A10 · nombre corto (cabecera) y frase entera de cada regla
  C.reglas = {
    'r-valoraciones': {nombre: 'Valoraciones', frase: 'Cuando alguien pide una valoración, te dejo preparado el informe del piso al día siguiente. Tú lo envías.', desde: 'agosto'},
    'r-cancelaciones': {nombre: 'Visitas canceladas', frase: 'Cuando se cancela una visita, te propongo otra fecha y tú decides si la envías.'},
    'r-actas': {nombre: 'Actas de visita', frase: 'Después de cada visita, te pido que me cuentes cómo ha ido. Yo escribo el acta.'},
    'r-promesas': {nombre: 'Promesas', frase: 'Cuando alguien te promete algo en el chat, lo apunto y te aviso si no llega.'},
    'r-informes': {nombre: 'Informes del lunes', frase: 'Cada lunes te preparo el informe de cada propietario y tú lo envías.'},
    'r-contestado': {nombre: 'Quién ha contestado', frase: 'Cuando un cliente te contesta, lo marco para que no le vuelvas a escribir lo mismo.'},
    'r-firmas': {nombre: 'Avisos de firma', frase: 'El día antes de una firma, te aviso con lo que hace falta llevar.'},
    'r-recordatorios': {nombre: 'Recordatorios', frase: 'Cuando un comprador no te conteste en 3 días, te preparo un recordatorio y tú lo envías.'}
  };
  // A10 · los 3 casos distintos de valoraciones (H18): hora del mensaje y qué habría hecho Veta
  C.distinto = {
    jordi: {origen: 'Jordi · WhatsApp · ' + f('2026-11-06T10:12'), habria: 'Esta vez no enviaste el informe del piso: escribiste otra cosa.', motivo: 'Escribiste otra cosa'},
    nuria: {origen: 'Núria · WhatsApp · ' + f('2026-10-21T17:40'), habria: 'Esta vez no enviaste el informe del piso ni nada más.', motivo: 'No enviaste nada'},
    toni: {origen: 'Toni · WhatsApp · ' + f('2026-09-02T12:05'), habria: 'Esta vez no enviaste el informe del piso: escribiste otra cosa.', motivo: 'Escribiste otra cosa'}
  };
  // A10 · la regla a prueba (visitas canceladas): lo que habría hecho, sin enviarlo
  C.aPrueba = [
    {id: 'jordi', cuando: F('2026-11-20'), nombre: 'Jordi Ferrer', propone: 'Propondría el jueves 26, 18:00',
      cita: 'Al final mañana no puedo ir a ver el piso, lo siento.', origen: 'Jordi · WhatsApp · ' + f('2026-11-20T09:05'),
      borrador: 'Hola, Jordi, soy Laura. No pasa nada. ¿Te va bien el jueves 26 a las 18:00 para verlo?'},
    {id: 'anna-bosch', cuando: F('2026-11-19'), nombre: 'Anna Bosch', propone: 'Propondría el sábado 21, 10:00',
      cita: 'Me ha surgido un viaje, ¿podemos cambiar la visita?', origen: 'Anna · WhatsApp · ' + f('2026-11-19T16:30'),
      borrador: 'Hola, Anna, soy Laura. Claro. ¿Te va bien el sábado 21 a las 10:00?'}
  ];
  // A11 · la orden dictada y sus partes (H21)
  C.orden = {
    dijiste: 'Cuando un comprador no me conteste en tres días, prepárame un recordatorio.',
    partes: [
      {id: 'cuando', titulo: 'Cuándo actúa', texto: 'Cuando un comprador lleva 3 días sin contestarte.'},
      {id: 'comprueba', titulo: 'Qué comprueba', texto: 'Que el último mensaje sea tuyo y que no haya una visita apuntada.'},
      {id: 'hace', titulo: 'Qué hace', texto: 'Te prepara un recordatorio en Inicio.'},
      {id: 'llega', titulo: 'Hasta dónde llega', texto: 'Prepara. Tú lo envías.'}
    ]
  };
  // A9b · la semana pasada: la del 16 al 22 (pulido 2: hoy es lunes 23; las mismas cifras que la pestaña Veta y C.semanas '16-nov')
  C.semanaPasada = [
    {titulo: 'Mensajes que te dejé escritos', derecha: '31'},
    {titulo: 'Actas de visita guardadas', derecha: '3'}, {titulo: 'Promesas apuntadas', derecha: '4'},
    {titulo: 'Informes de propietario', derecha: '1'}, {titulo: 'Respuestas marcadas', derecha: '8'}
  ];
  // A13 · lo que he aprendido
  C.aprendido = [
    {id: 'pere-tarde', texto: 'A Pere le escribes por la tarde, después de las 16:00.', corto: 'A Pere le escribes por la tarde', origen: 'De tus mensajes de octubre'},
    {id: 'marta-sabados', texto: 'Marta Puig solo puede ver pisos los sábados.', corto: 'Marta solo puede los sábados', origen: 'De su chat del ' + f('2026-11-03')},
    {id: 'arras-notaria', texto: 'Las arras las firmas en la notaría de Gran de Gràcia.', corto: 'Las arras, en Gran de Gràcia', origen: 'De tus 4 últimas arras'}
  ];
  C.oficinaDice = ['Las visitas se apuntan en la ficha el mismo día.', 'El certificado energético se pide antes de anunciar el precio.'];
  // A13b · ejemplos de mejora
  C.mejoras = ['Llamar en 48 h al que pide visita', 'Confirmar las visitas el día antes', 'Pedir el certificado al captar'];
  // A14 · lo que aún haces a mano (hoja c-mano)
  C.aMano = [['Preparar el informe del piso antes de una valoración', 14], ['Confirmar las visitas el día antes', 9], ['Pedir el certificado energético', 6]];
  // H25 · semanas anteriores (casos preparados de la oficina, los de G3e; mensajes de Laura inventados)
  C.semanas = [
    {id: '26-oct', texto: 'Semana del 26 oct al 1 nov', corto: '26 oct', preparados: 118, mensajes: 22, enviados: 19, actas: 2},
    {id: '2-nov', texto: 'Semana del 2 al 8 nov', corto: '2 nov', preparados: 127, mensajes: 25, enviados: 22, actas: 4},
    {id: '9-nov', texto: 'Semana del 9 al 15 nov', corto: '9 nov', preparados: 141, mensajes: 27, enviados: 24, actas: 2},
    {id: '16-nov', texto: 'Semana del 16 al 22 nov', corto: '16 nov', preparados: 156, mensajes: 31, enviados: 27, actas: 3}
  ];
  // H24 · tus tiempos (minutos de ejemplo; las cuentas salen de VETA.datos.tiempos.laura)
  C.tiempos = [{id: 'mensajes', texto: 'Responder un mensaje', min: 4}, {id: 'actas', texto: 'Un acta de la visita', min: 12}, {id: 'avisos', texto: 'Apuntar una promesa', min: 2}];

  // A18m · mi mapa de trabajo (H32 con sus citas)
  C.mapa = [
    {titulo: 'Lo que he encontrado', filas: [
      {id: 'sin-respuesta', titulo: 'Contactos sin respuesta', sub: '5 · el más antiguo, de ayer', texto: 'Personas que te escribieron y todavía esperan una respuesta tuya.',
        citas: [{texto: '¿Sigue disponible el piso de Gràcia? Podríamos verlo este sábado', origen: 'Marta · ayer, 18:42'}]},
      {id: 'quieren', titulo: 'Querían vender o comprar', sub: '9 personas', texto: 'Lo dijeron en el chat y no siempre se apuntó en ninguna ficha.',
        citas: [{texto: 'Antes de nada, ¿puedes venir a verlo?', origen: 'Núria · ' + f('2026-10-21')}, {texto: '¿Cuánto podría pedir por el piso de mi madre?', origen: 'Jordi · ' + f('2026-11-06')}]},
      {id: 'promesas', titulo: 'Promesas', sub: '7 sin constancia', texto: 'Lo que te prometieron, o prometiste tú, y no consta que se haya cumplido.',
        citas: [{texto: 'El miércoles te paso la nómina', origen: 'Elena · ' + f('2026-11-16')}]},
      {id: 'papeles', titulo: 'Papeles pendientes', sub: '4', texto: 'Documentos que alguien tiene que mandar antes de seguir.',
        citas: [{texto: 'Te mando el certificado energético cuando me lo den', origen: 'Pere · ' + f('2026-11-13')}]},
      {id: 'enfrian', titulo: 'Relaciones que se enfrían', sub: '3', texto: 'Clientes con los que hace semanas que no hablas.',
        citas: [{texto: 'Si sale algún local en el Eixample, avísame', origen: 'Albert · hace 7 semanas'}]}]},
    {titulo: 'Cosas abiertas', filas: [
      {id: 'visita-gracia', titulo: 'La visita del piso de Gràcia', sub: 'Marta Puig · el sábado', texto: 'Marta quiere ver Verdi 42 este sábado. Falta confirmarle la hora.',
        citas: [{texto: '¿Sigue disponible el piso de Gràcia? Podríamos verlo este sábado', origen: 'Marta · ayer, 18:42'}]},
      {id: 'dossier-sants', titulo: 'El informe del piso de Sants', sub: 'Jordi Ferrer · se lo prometiste', texto: 'Le dijiste a Jordi que le mandabas el informe del piso de Sants.',
        citas: [{texto: 'Perfecto, quedo a la espera del informe', origen: 'Jordi · ' + f('2026-11-20')}]},
      {id: 'papeles-verdi', titulo: 'Los papeles del piso de Verdi', sub: 'Pere Soler · el certificado', texto: 'Falta el certificado energético para poder anunciar el precio.',
        citas: [{texto: 'Te mando el certificado energético cuando me lo den', origen: 'Pere · ' + f('2026-11-13')}]}]},
    {titulo: 'Trabajos que se repiten', filas: [
      {id: 'dossier', titulo: 'Preparar el informe del piso antes de una valoración', sub: '14 veces en seis meses', texto: 'Cuando alguien pide una valoración, al día siguiente le mandas el informe del piso. Lo has hecho 14 veces; en 11 de la misma forma.',
        citas: [{texto: '¿Cuánto podría pedir por el piso de mi madre?', origen: 'Jordi · ' + f('2026-11-06')}], boton: {texto: 'Ver los 14 casos', ir: 'regla/r-valoraciones'}},
      {id: 'certificado', titulo: 'Pedir el certificado energético', sub: '6 veces', texto: 'Al captar un piso, pides el certificado energético al propietario.',
        citas: [{texto: 'Te mando el certificado energético cuando me lo den', origen: 'Pere · ' + f('2026-11-13')}]},
      {id: 'visitas', titulo: 'Confirmar las visitas el día antes', sub: '9 veces', texto: 'El día antes de una visita escribes para confirmarla.',
        citas: [{texto: 'Sí, mañana a las 11:00 nos vemos en el portal', origen: 'Elena · ' + f('2026-11-20')}]}]}
  ];

  // G10 · cómo trabajamos (H23). `corto`: el nombre en una línea para la fila y el título de la hoja
  C.practicas = [
    {id: 'actas', titulo: 'Actas de visita contadas al salir', corto: 'Actas contadas al salir', estado: 'en-marcha', estadoTexto: 'En marcha', usan: 'la usan 4 de 6', propuso: 'la propuso Anna Costa',
      caso: 'Nació de las visitas de septiembre: las actas de visita se escribían dos días después, o nunca.'},
    {id: 'mismo-dia', titulo: 'Responder el mismo día', estado: 'a-prueba', estadoTexto: 'Lo estamos probando · día 9 de 14', usan: 'a prueba con todo el equipo', propuso: 'vino con Veta',
      caso: 'Venía preparada con Veta: los contactos que esperan más de un día se enfrían.'},
    {id: 'dossier', titulo: 'Informe del piso al día siguiente', corto: 'Informe al día siguiente', estado: 'propuesta', estadoTexto: 'Te lo propongo', usan: 'la usa Laura Martí', propuso: 'de Laura Martí',
      caso: 'Nació de los chats de Laura: 14 valoraciones desde agosto, 11 con el informe del piso al día siguiente.'}
  ];
  C.practicaClaudia = {id: 'llamar-48', titulo: 'Llamar en 48 horas a quien pide una visita', corto: 'Llamar en 48 horas', estado: 'propuesta', estadoTexto: 'Te lo propongo', usan: 'todavía no la usa nadie',
    propuso: 'sale de un caso', caso: 'Nació del caso de Clàudia Ribas: pidió ver un piso de Sants y nadie la llamó.'};
  // G11 · dónde se paran las operaciones y cómo aprende Veta
  C.paradas = [['Contacto', 1], ['Visitas', 2], ['Oferta', 1], ['Arras', 0]];
  C.aprende = [['Escucha', 'Lee los chats de trabajo que cada persona deja leer.'], ['Detecta', 'Ve lo que se repite y lo que se queda parado.'],
    ['El equipo decide', 'Una persona lo propone; dirección decide si se prueba.'], ['La oficina mejora', 'Lo que funciona pasa a ser cómo trabajamos.']];
  // G12 · lo que Veta aún no hace
  C.falta = [['Responder a contactos nuevos', 23], ['Preparar informes del piso', 14], ['Pedir certificados energéticos', 6]];
  // G14 · lo que sabe tu oficina
  C.sabe = [['Quien pide fotos del balcón, visita', 31, 38], ['Sin noticias en 10 días, el propietario se queja', 5, 7], ['En Gràcia, casi todos quieren ver en sábado', 64, 92]];
  // E2 · cuentas de ejemplo
  C.cuentas = {laura: 'laura@ejemplo.es', montse: 'montse@ejemplo.es'};
})();
