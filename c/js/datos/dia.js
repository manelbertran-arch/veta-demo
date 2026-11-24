/* Veta demo · datos · dia.js
   6.4 · la cola de Laura (seis cosas), En espera (seis) y lo que se «dicta» (6.5).
   Una «cosa» la pinta VETA.UI.tarjetaCosa. Campos: id, quien, tipo (mensaje · visita · informe · oportunidad · promesa ·
   bloqueada · llamada · asunto · regla · reparto · queja · espera), cliente, titulo, corto, quienEs, etiqueta, cita, chat,
   momento, piso, pisoTexto, saber, encaja, resumen, borrador, bloqueo, nota, pie, boton, secundarios, sale (sale hacia fuera:
   pregunta «¿Lo enviaste?» y dice «No lo envié»), fila/filaSub (la fila cuando espera turno), lineas (texto al resolver)
   y alResolver (lo que cambia en otras pantallas cuando se envía o se hace: tabla 6.8; lo aplica modelo.js). */
(function () {
  'use strict';
  const D = VETA.datos;
  const otra = {texto: 'Otra cosa…', hoja: 'h02'};

  D.cola = D.cola || {};
  D.cola.laura = [
    {id: 'c-marta', quien: 'laura', tipo: 'mensaje', cliente: 'marta', titulo: 'Marta Puig', corto: 'Marta', sale: true,
      quienEs: 'Compradora · piso de Gràcia', etiqueta: 'sin-responder', chat: 'marta',
      cita: {texto: '¿Sigue disponible el piso de Gràcia? Podríamos verlo este sábado', origen: 'Marta · ayer, 18:42'},
      borrador: 'Hola, Marta, soy Laura. ¿Os va bien este sábado a las 11:00 para ver el piso de Gràcia? Te paso la dirección.',
      boton: {texto: 'Abrir WhatsApp con el mensaje'}, secundarios: [{texto: 'Editar', ir: 'mensaje/c-marta'}, otra],
      fila: 'Marta Puig', filaSub: 'Pide ver el piso de Gràcia',
      lineas: {enviada: 'Enviado a Marta', 'para-manana': 'Para mañana · Marta'},
      alResolver: {estado: {marta: 'esperando'},
        espera: [{id: 'e-marta', fechaISO: '2026-11-26', fecha: 'Jue 26', cliente: 'marta', titulo: 'Marta Puig', texto: 'Esperas su respuesta'}],
        historia: [{cliente: 'marta', cuando: 'Hoy', tipo: 'Tú', texto: 'Mensaje enviado: propuesta para ver el piso el sábado a las 11:00'}]}},
    {id: 'c-elena', quien: 'laura', tipo: 'visita', cliente: 'elena', titulo: 'Elena Vives', corto: 'Elena', chat: 'elena',
      momento: 'Visita con Elena Vives · hoy, 9:00', piso: 'verdi', pisoTexto: 'Piso de Gràcia · c/ Verdi 42, 3.º 2.ª',
      saber: 'Lo que sabes de ella: busca 2 habitaciones con luz. Le preocupa el ruido de la calle.', deSusChats: true,
      pie: 'Cuando salgas, cuéntame cómo ha ido.', nota: false,
      boton: {texto: 'Cuéntame cómo ha ido', ir: 'visita/elena'}, secundarios: [{texto: 'Ver la ficha', ir: 'cliente/elena'}, otra],
      fila: '9:00 · Visita con Elena Vives', filaSub: 'Después me cuentas cómo ha ido',
      lineas: {hecha: 'Acta de la visita de Elena'},
      alResolver: {estado: {elena: 'al-dia'}, siguiente: {elena: {texto: 'Al día · la llamas el jueves 26'}},
        espera: [{id: 'e-llamar-elena', fechaISO: '2026-11-26', fecha: 'Jue 26', cliente: 'elena', titulo: 'Llamar a Elena', texto: 'Confirmar si vuelve el sábado con su pareja', etiqueta: 'tuya'}],
        historia: [{cliente: 'elena', cuando: 'Hoy', tipo: 'Acta', texto: 'Visita a Verdi 42: le encanta la luz; le preocupa el ruido'},
          {cliente: 'pere', cuando: 'Hoy', tipo: 'Acta', texto: 'Visita de Elena Vives a Verdi 42'}],
        regla: {id: 'r-actas', caso: 'Hoy · Elena Vives'}}},
    {id: 'c-pere', quien: 'laura', tipo: 'informe', cliente: 'pere', titulo: 'Pere Soler', corto: 'Pere', sale: true, nota: false, chat: 'pere',
      piso: 'verdi', pisoTexto: 'c/ Verdi 42, 3.º 2.ª', quienEs: 'Propietario · piso de Gràcia',
      cita: {texto: 'Laura, ¿me cuentas cada lunes cómo va? Así no te llamo tanto.', origen: 'Pere · 2 oct, 19:20'},
      resumen: 'Semana del 16 al 22: 3 visitas. A los 3 les parece alto el precio.',
      boton: {texto: 'Abrir el informe', ir: 'informe/pere'}, secundarios: [{texto: 'Ver la ficha', ir: 'cliente/pere'}, otra],
      fila: 'Pere Soler', filaSub: 'Informe de la semana',
      lineas: {enviada: 'Informe de la semana enviado a Pere'},
      alResolver: {siguiente: {pere: {texto: 'Falta el certificado energético', boton: {texto: 'Pedírselo a Pere', hoja: 'h14'}}},
        historia: [{cliente: 'pere', cuando: 'Hoy', tipo: 'Informe', texto: 'Informe enviado'}]}},
    {id: 'c-nuria', quien: 'laura', tipo: 'oportunidad', cliente: 'nuria', titulo: 'Núria Camps', corto: 'Núria', sale: true, nota: false, chat: 'nuria',
      quienEs: 'Compradora · Sant Antoni con balcón', etiqueta: 'oportunidad',
      cita: {texto: 'Si sale algo en Sant Antoni con balcón, avísame', origen: 'Núria · 3 nov, 20:15'},
      encaja: {titulo: 'Encaja con un piso que entró ayer', piso: 'santantoni', texto: 'Sant Antoni · 2 habitaciones · balcón · 289.000 €'},
      borrador: 'Hola, Núria, soy Laura. Ha entrado un piso en Sant Antoni con balcón: 2 habitaciones, 289.000 €. ¿Te paso fotos?',
      // la misma forma de enviar que Marta: Veta abre el WhatsApp de Laura con el texto escrito (decisión del 21-nov)
      boton: {texto: 'Abrir WhatsApp con el mensaje'}, secundarios: [{texto: 'Ver la ficha', ir: 'cliente/nuria'}, otra],
      fila: 'Núria Camps', filaSub: 'Ha entrado un piso que le encaja',
      lineas: {enviada: 'Enviado a Núria'},
      alResolver: {estado: {nuria: 'esperando'}, historia: [{cliente: 'nuria', cuando: 'Hoy', tipo: 'Tú', texto: 'Le cuentas el piso de Sant Antoni'}]}},
    {id: 'c-jordi', quien: 'laura', tipo: 'promesa', cliente: 'jordi', titulo: 'Jordi Ferrer', corto: 'Jordi', sale: true, chat: 'jordi',
      quienEs: 'Comprador · piso de Sants', etiqueta: 'prometiste',
      cita: {texto: '¿Me pasas el informe del piso antes del jueves? Quiero enseñárselo a mi hermana', origen: 'Jordi · vie 20, 12:05'},
      borrador: 'Hola, Jordi, soy Laura. Te paso el informe del piso de Olzinelles: planos y nota simple.',
      pie: 'Adjunta tú el PDF en WhatsApp',
      boton: {texto: 'Abrir WhatsApp con el mensaje'}, secundarios: [{texto: 'Editar', ir: 'mensaje/c-jordi'}, otra],
      // el mensaje cambia una vez (el 409 del servidor): el paquete A pone esto en extra con VETA.modelo.marca
      cambio: {aviso: 'Jordi te acaba de escribir: «¿Puedes añadir los gastos de comunidad?». He rehecho el mensaje: míralo otra vez.',
        borradorHtml: 'Hola, Jordi, soy Laura. Te paso el informe del piso de Olzinelles: planos, nota simple <mark>y gastos de comunidad</mark>.'},
      fila: 'Jordi Ferrer', filaSub: 'Informe del piso antes del jueves',
      lineas: {enviada: 'Enviado a Jordi'},
      alResolver: {estado: {jordi: 'esperando'}, historia: [{cliente: 'jordi', cuando: 'Hoy', tipo: 'Tú', texto: 'Informe del piso enviado: planos, nota simple y gastos de comunidad'}]}},
    {id: 'c-sergi', quien: 'laura', tipo: 'bloqueada', cliente: 'sergi', titulo: 'Sergi Mas', corto: 'Sergi', nota: false, chat: 'sergi', sinPrisa: true,
      quienEs: 'Contacto nuevo · alquiler en Les Corts', etiqueta: 'no-se-puede',
      cita: {texto: 'Buenas, ¿el alquiler de Les Corts admite mascotas?', origen: 'Sergi · 9 nov, 21:48'},
      bloqueo: 'No se puede enviar: Anna Costa ya le contestó el viernes 20 a las 12:15.',
      boton: {texto: 'Quitarla de la lista', accion: 'quitar'}, secundarios: [{texto: 'Ver de dónde sale', hoja: 'h01'}],
      fila: 'Sergi Mas', filaSub: 'Y 1 más, sin prisa',
      lineas: {quitada: 'Quitada · Sergi ya tenía respuesta'}}
  ];

  // aparece en el Hoy de Laura cuando Montse le asigna a Carmen (flag «carmen-asignada»). Texto del borrador: inventado por el núcleo.
  D.colaExtra = {
    'c-carmen': {id: 'c-carmen', quien: 'laura', tipo: 'mensaje', cliente: 'carmen', titulo: 'Carmen López', corto: 'Carmen', sale: true, chat: 'carmen',
      quienEs: 'Te la ha asignado Montse', etiqueta: 'sin-responder',
      cita: {texto: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', origen: 'Carmen · WhatsApp de la oficina · ayer, 19:10'},
      borrador: 'Hola, Carmen, soy Laura, de la agencia. Tenemos en Gràcia un piso de 3 habitaciones que encaja con lo que buscas, en la calle Verdi. ¿Te va bien verlo esta semana?',
      boton: {texto: 'Abrir WhatsApp con el mensaje'}, secundarios: [{texto: 'Editar', ir: 'mensaje/c-carmen'}, otra],
      fila: 'Carmen López', filaSub: 'Te la ha asignado Montse', lineas: {enviada: 'Enviado a Carmen'},
      alResolver: {estado: {carmen: 'esperando'}}}
  };

  // A7 · En espera, al empezar (6), por fecha
  D.espera = D.espera || {};
  D.espera.laura = [
    {id: 'e-elena', quien: 'laura', tipo: 'espera', fechaISO: '2026-11-25', fecha: 'Mié 25', cliente: 'elena', titulo: 'Elena Vives', texto: 'Prometió la nómina',
      depende: 'Ahora depende de Elena.', chat: 'elena-nomina', cita: {texto: 'El miércoles te paso la nómina', origen: 'Elena · lun 16, 19:02'},
      borrador: 'Hola, Elena, soy Laura. ¿Has podido encontrar la nómina? El banco la necesita para seguir.',
      boton: {texto: 'Preparar recordatorio a Elena'}, secundarios: [{texto: 'Se cumplió', accion: 'se-cumplio'}, otra],
      lineas: {hecha: 'Lo tendrás en Inicio el miércoles a las 9:00'}},
    {id: 'e-pere', quien: 'laura', tipo: 'espera', fechaISO: '2026-11-27', fecha: 'Vie 27', cliente: 'pere', titulo: 'Pere Soler', texto: 'Plazo del certificado energético',
      resumen: 'Si el viernes no consta, dirección verá que hay 1 cosa parada, sin tu nombre ni el del cliente.', boton: {texto: 'Pedírselo a Pere', hoja: 'h14'}},
    {id: 'e-jordi', quien: 'laura', tipo: 'espera', fechaISO: '2026-11-30', fecha: 'Lun 30', cliente: 'jordi', titulo: 'Jordi Ferrer', texto: 'Nota simple pedida al Registro'},
    {id: 'e-laia', quien: 'laura', tipo: 'espera', fechaISO: '2026-12-01', fecha: 'Mar 1 dic', cliente: 'laia', titulo: 'Laia Casas', texto: 'Firma en notaría, 12:00'},
    {id: 'e-pere-encargo', quien: 'laura', tipo: 'espera', fechaISO: '2026-12-02', fecha: 'Mié 2 dic', cliente: 'pere', titulo: 'Pere Soler', texto: 'Vence el encargo'},
    {id: 'e-nuria', quien: 'laura', tipo: 'espera', fechaISO: '2026-12-03', fecha: 'Jue 3 dic', cliente: 'nuria', titulo: 'Núria Camps', texto: 'Quedó en llamarte al volver'}
  ];

  // 6.5 · lo que se «dicta» (guiones de #/dictar/<guion>)
  D.dictados = {
    acta: {frase: 'Acabo de salir del piso de Verdi con Elena. Le ha encantado la luz del salón y la terraza, y la cocina reformada. Le preocupa el ruido de la calle por la noche y que no haya ascensor. Quiere volver el sábado por la tarde con su pareja para oír la calle. Llámala el jueves para confirmarlo.', va: 'acta/elena'},
    tarea: {frase: 'Recuérdame llamar a Jordi el jueves a las diez.', va: 'entendido-dictado/tarea'},
    nota: {frase: 'Pere prefiere que le llame por la tarde, después de las cuatro.', va: 'entendido-dictado/nota'},
    orden: {frase: 'Cuando un comprador no me conteste en tres días, prepárame un recordatorio.', va: 'entendido/recordatorios'},
    pregunta: {frase: '¿Qué le prometí a Jordi?', va: 'pregunta/jordi'},
    aviso: {frase: 'Avísame cuando un contacto nuevo lleve dos horas sin respuesta.', va: 'avisos', papel: 'direccion'},
    operacion: {frase: '¿Cómo va la operación de Rubén?', va: 'cliente/ruben', papel: 'direccion'},
    queja: {frase: 'Apunta una queja de Joan Serra: lleva diez días sin noticias.', va: 'cliente/joan-serra', papel: 'direccion'},
    mejorar: {frase: '¿Qué podríamos mejorar esta semana?', va: 'veta', papel: 'direccion'}
  };

  // H06 / H41 · el parte de las 19:30 de Laura (texto fijo de la sección 3.6)
  D.partes = D.partes || {};
  D.partes['1930'] = {titulo: 'El parte de las 19:30', bloques: [
    {texto: 'Hecho 6 · Vigilo 8 · Pasan a mañana 0'},
    {texto: 'Hoy hablaste con Marta, Elena, Pere, Núria y Jordi.'},
    {titulo: 'Prometiste', texto: 'Llamar a Elena el jueves 26.'},
    {titulo: 'Vence mañana', texto: 'Nada.'},
    // `semana`: lo mismo con su fecha, para la hoja «Día cerrado» (filas con la fecha a la derecha, por VETA.fecha)
    {titulo: 'Esta semana', lista: ['Mié 25 · la nómina de Elena', 'Jue 26 · llamar a Elena y la respuesta de Marta', 'Vie 27 · el certificado de Pere'],
      semana: [{iso: '2026-11-25', que: 'La nómina de Elena'}, {iso: '2026-11-26', que: 'Llamar a Elena'}, {iso: '2026-11-26', que: 'La respuesta de Marta'}, {iso: '2026-11-27', que: 'El certificado de Pere'}]},
    {texto: 'Sigo vigilando lo que queda abierto. Mañana abres la app y lo urgente ya está preparado.'}]};
})();
