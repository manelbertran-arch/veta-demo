/* Veta demo · datos · clientes.js
   6.3 · los 18 clientes de Laura (8 con ficha completa, 10 con ficha corta) y Sergi Mas, contacto nuevo que no es
   de su cartera (cartera: false; no cuenta en los 18). Además, los clientes de Montse y los de la oficina (6.6).
   Estados: te-toca · oportunidad · parado · esperando · al-dia · cerrado. La foto es assets/perfiles/<foto>.webp.
   VETA.datos.chats: lo que enseña H01 «De dónde sale» (mensajes literales; tu: true = lo escribió quien usa la app). */
(function () {
  'use strict';
  const D = VETA.datos;
  const c = (id, o) => Object.assign({id, lleva: 'laura', cartera: true, historia: [], documentos: []}, o);
  // las fechas no se escriben a mano: f('2026-11-21') → «Sáb 21» (cola de una fila) · ff(…) → «sáb 21» (dentro de una frase)
  const f = iso => VETA.fecha.corta(iso), ff = iso => VETA.fecha.corta(iso, {frase: true});

  D.clientes = {
    // ---- Laura · ficha completa ----
    marta: c('marta', {nombre: 'Marta Puig', corto: 'Marta', tel: '634 90 56 21', foto: 'marta', quienEs: 'Compradora; busca 3 habitaciones en Gràcia', estado: 'te-toca',
      operacion: {tipo: 'compra', fase: 1, texto: 'La compra · Contacto · paso 1 de 5'}, siguiente: {texto: 'Contestar a Marta', cosa: 'c-marta'},
      encajan: {titulo: 'Pisos que le encajan · 1', pisos: ['verdi']},
      historia: [{cuando: f('2026-11-22T18:42'), tipo: 'Mensaje', texto: 'Pide ver el piso de Gràcia'}], chat: 'marta'}),
    elena: c('elena', {nombre: 'Elena Vives', corto: 'Elena', tel: '655 21 70 34', foto: 'elena', quienEs: 'Compradora; busca 2 habitaciones con luz', estado: 'te-toca',
      operacion: {tipo: 'compra', fase: 2, texto: 'La compra · Visitas · paso 2 de 5'}, siguiente: {texto: 'Visita hoy a las 9:00 en Verdi 42', boton: {texto: 'Cuéntame cómo ha ido', ir: 'visita/elena'}, cosa: 'c-elena'},
      documentos: [{texto: 'Nómina, para el banco', estado: 'falta', fecha: ff('2026-11-25')}],
      historia: [{cuando: f('2026-11-16'), tipo: 'Mensaje', texto: '«El miércoles te paso la nómina»'}, {cuando: f('2026-10-28'), tipo: 'Mensaje', texto: '«Esta semana estoy liada»'}], chat: 'elena'}),
    pere: c('pere', {nombre: 'Pere Soler', corto: 'Pere', tel: '612 48 39 07', foto: 'pere', quienEs: 'Propietario del piso de Verdi 42', estado: 'te-toca', piso: 'verdi',
      operacion: {tipo: 'venta', fase: 3, texto: 'La venta · Visitas · paso 3 de 5'}, siguiente: {texto: 'Enviarle el informe de la semana.', boton: {texto: 'Ver el informe para Pere', ir: 'informe/pere'}, cosa: 'c-pere'},
      encajan: {titulo: 'Compradores que encajan · 2', clientes: ['marta', 'toni']},
      documentos: [{texto: 'Certificado energético', estado: 'falta', fecha: ff('2026-11-27')}],
      historia: [{cuando: f('2026-11-21T21:10'), tipo: 'Mensaje', texto: '«Bajo a 385.000 €, no menos.»'}, {cuando: f('2026-11-16'), tipo: 'Informe', texto: 'Informe de la semana enviado'}], chat: 'pere'}),
    jordi: c('jordi', {nombre: 'Jordi Ferrer', corto: 'Jordi', tel: '609 77 14 52', foto: 'jordi', quienEs: 'Comprador; piso de Sants, c/ Olzinelles', estado: 'te-toca', piso: 'olzinelles',
      operacion: {tipo: 'compra', fase: 2, texto: 'La compra · Visitas · paso 2 de 5'}, siguiente: {texto: 'Pasarle el informe del piso antes del jueves', cosa: 'c-jordi'},
      documentos: [{texto: 'Nota simple de Olzinelles', estado: 'falta', fecha: ff('2026-11-30'), nota: 'Pedida al Registro'}],
      historia: [{cuando: f('2026-11-20T12:05'), tipo: 'Mensaje', texto: 'Pide el informe del piso'}, {cuando: f('2026-11-20T12:20'), tipo: 'Tú', texto: '«Claro, te lo paso antes del jueves.»'}], chat: 'jordi'}),
    nuria: c('nuria', {nombre: 'Núria Camps', corto: 'Núria', tel: '678 03 92 15', foto: 'nuria', quienEs: 'Compradora; busca en Sant Antoni, con balcón', estado: 'oportunidad',
      operacion: {tipo: 'compra', fase: 1, texto: 'La compra · Contacto · paso 1 de 5'}, siguiente: {texto: 'Contarle el piso de Sant Antoni', cosa: 'c-nuria'},
      encajan: {titulo: 'Pisos que le encajan · 1', pisos: ['santantoni']},
      historia: [{cuando: f('2026-11-03T20:15'), tipo: 'Mensaje', texto: '«Si sale algo en Sant Antoni, avísame»'}], chat: 'nuria'}),
    albert: c('albert', {nombre: 'Albert Roca', corto: 'Albert', tel: '620 15 84 03', foto: 'albert', quienEs: 'Inversor; busca locales para alquilar', estado: 'parado', estadoTexto: 'Parado · 7 semanas sin hablar',
      operacion: {texto: 'Sin operación abierta'}, siguiente: {texto: 'Llamarle por el local del Eixample', boton: {texto: 'Llamar a Albert', accion: 'llamar'}},
      antes: ['Qué quiere: un local por el centro, para alquilar.', `Qué se habló: «Si sale algún local por el centro, avísame» (${ff('2026-10-03')}).`, 'Qué falta: enseñarle el local del Eixample que entró el día 12.'],
      historia: [{cuando: f('2026-10-03'), tipo: 'Mensaje', texto: '«Si sale algún local, avísame»'}], chat: 'albert'}),
    laia: c('laia', {nombre: 'Laia Casas', corto: 'Laia', tel: '646 37 29 18', foto: 'laia', quienEs: 'Compradora; piso en Poblenou', estado: 'al-dia',
      operacion: {tipo: 'compra', fase: 5, texto: 'La compra · Notaría · paso 5 de 5'}, siguiente: {texto: `Firma en notaría el ${VETA.fecha.larga('2026-12-01T12:00', {frase: true})}.`},
      historia: [{cuando: f('2026-11-09'), tipo: 'Arras', texto: 'Arras firmadas', papeles: true}]}),
    'carme-font': c('carme-font', {nombre: 'Carme Font', corto: 'Carme', tel: '699 02 41 76', foto: 'carme', quienEs: 'Vendió en Horta en junio', estado: 'cerrado',
      operacion: {tipo: 'venta', fase: 5, texto: 'La venta · cerrada'}, siguiente: {texto: 'Nada pendiente', secundario: {texto: 'Preparar un mensaje para pedirle una recomendación'}},
      historia: [{cuando: f('2026-06-18'), tipo: 'Notaría', texto: 'Venta firmada en Horta'}]}),
    // ---- contacto nuevo, fuera de su cartera ----
    sergi: c('sergi', {nombre: 'Sergi Mas', corto: 'Sergi', foto: 'sergi', quienEs: 'Contacto nuevo; preguntó por un alquiler en Les Corts', estado: null, cartera: false,
      siguiente: {texto: 'Anna Costa ya le contestó', boton: {texto: 'Quitarla de Hoy'}, cosa: 'c-sergi'}, chat: 'sergi'}),
    // ---- Laura · ficha corta (Al día, iniciales) ----
    toni: c('toni', {nombre: 'Toni Ribas', estado: 'al-dia', quienEs: `Visitó Verdi 42 el ${ff('2026-11-19')}; volverá con su arquitecto`, historia: [{cuando: f('2026-11-19'), tipo: 'Visita', texto: 'Visitó Verdi 42; volverá con su arquitecto'}]}),
    casals: c('casals', {nombre: 'Família Casals', estado: 'al-dia', quienEs: `Visitaron Verdi 42 el ${ff('2026-11-21')}; les gusta, lo ven caro`, historia: [{cuando: f('2026-11-21'), tipo: 'Visita', texto: 'Les gusta; lo ven caro'}]}),
    'sergi-font': c('sergi-font', {nombre: 'Sergi Font', estado: 'al-dia', quienEs: `Visitó Verdi 42 el ${ff('2026-11-17')}; lo ve caro y sin ascensor`, historia: [{cuando: f('2026-11-17'), tipo: 'Visita', texto: 'Lo ve caro y sin ascensor'}]}),
    'anna-bosch': c('anna-bosch', {nombre: 'Anna Bosch', estado: 'al-dia', quienEs: `Canceló una visita el ${ff('2026-11-19')}`, historia: [{cuando: f('2026-11-19'), tipo: 'Visita', texto: 'Canceló la visita'}]}),
    'rosa-vidal': c('rosa-vidal', {nombre: 'Rosa Vidal', estado: 'al-dia', quienEs: `Pidió una valoración el ${ff('2026-11-13')}`, historia: [{cuando: f('2026-11-13'), tipo: 'Mensaje', texto: 'Pide una valoración'}]}),
    'pau-mir': c('pau-mir', {nombre: 'Pau Mir', estado: 'al-dia', quienEs: `Pidió una valoración el ${ff('2026-10-15')}`, historia: [{cuando: f('2026-10-15'), tipo: 'Mensaje', texto: 'Pide una valoración'}]}),
    'carme-roca': c('carme-roca', {nombre: 'Carme Roca', estado: 'al-dia', quienEs: `Pidió una valoración el ${ff('2026-10-08')}`, historia: [{cuando: f('2026-10-08'), tipo: 'Mensaje', texto: 'Pide una valoración'}]}),
    'lluis-pons': c('lluis-pons', {nombre: 'Lluís Pons', estado: 'al-dia', quienEs: `Pidió una valoración el ${ff('2026-09-30')}`, historia: [{cuando: f('2026-09-30'), tipo: 'Mensaje', texto: 'Pide una valoración'}]}),
    'joan-vila': c('joan-vila', {nombre: 'Joan Vila', estado: 'al-dia', quienEs: `Pidió una valoración el ${ff('2026-09-16')}`, historia: [{cuando: f('2026-09-16'), tipo: 'Mensaje', texto: 'Pide una valoración'}]}),
    'oriol-bas': c('oriol-bas', {nombre: 'Oriol Bas', estado: 'al-dia', quienEs: 'Nada pendiente', historia: []}),

    // ---- Montse (6.6) ----
    ruben: c('ruben', {nombre: 'Rubén Gil', corto: 'Rubén', lleva: 'montse', quienEs: 'Vendedor del ático de Sant Gervasi', estado: 'te-toca', piso: 'atico', operacion: {tipo: 'venta', fase: 3, texto: 'La venta · Visitas · paso 3 de 5'}, chat: 'ruben'}),
    guillem: c('guillem', {nombre: 'Guillem Roig', corto: 'Guillem', lleva: 'montse', quienEs: 'Comprador', estado: 'te-toca', chat: 'guillem'}),
    silvia: c('silvia', {nombre: 'Sílvia Prat', corto: 'Sílvia', lleva: 'montse', quienEs: 'Compradora; ofreció 520.000 € por el ático', estado: 'te-toca',
      antes: ['Ofreció 520.000 € por el ático.', 'El propietario pide 545.000 €.', 'El viernes dijo que se lo pensaba.']}),
    'merce-soler': c('merce-soler', {nombre: 'Mercè Soler', lleva: 'montse', estado: 'al-dia'}),
    'xavier-coll': c('xavier-coll', {nombre: 'Xavier Coll', lleva: 'montse', estado: 'al-dia'}),
    'imma-bonet': c('imma-bonet', {nombre: 'Imma Bonet', lleva: 'montse', estado: 'al-dia'}),
    'ferran-cots': c('ferran-cots', {nombre: 'Ferran Cots', lleva: 'montse', estado: 'al-dia'}),
    'gloria-mas': c('gloria-mas', {nombre: 'Glòria Mas', lleva: 'montse', estado: 'al-dia'}),
    'ignasi-puig': c('ignasi-puig', {nombre: 'Ignasi Puig', lleva: 'montse', estado: 'al-dia'}),

    // ---- la oficina: contactos sin dueño, sin responder y operaciones de otros (6.6) ----
    carmen: c('carmen', {nombre: 'Carmen López', corto: 'Carmen', lleva: null, cartera: false, quienEs: 'Contacto nuevo; busca 3 habitaciones en Gràcia, hasta 450.000 €', estado: 'te-toca', chat: 'carmen',
      operacion: {tipo: 'compra', fase: 1, texto: 'La compra · Contacto · paso 1 de 5'}, encajan: {titulo: 'Pisos que le encajan · 1', pisos: ['verdi']}}),
    'pau-rios': c('pau-rios', {nombre: 'Pau Ríos', lleva: null, cartera: false, quienEs: 'Contacto nuevo; busca un local en el Eixample para alquilar', chat: 'pau-rios'}),
    lucia: c('lucia', {nombre: 'Lucía Gómez', lleva: null, cartera: false, quienEs: 'Contacto nuevo; quiere vender el piso de sus padres en Sant Gervasi', chat: 'lucia'}),
    ramon: c('ramon', {nombre: 'Ramon Pujol', lleva: 'teresa', cartera: false, foto: 'ramon', quienEs: 'Cliente de Teresa', chat: 'ramon'}),
    'dani-prats': c('dani-prats', {nombre: 'Dani Prats', lleva: 'teresa', cartera: false, quienEs: 'Comprador en Gràcia'}),
    'rosa-vila': c('rosa-vila', {nombre: 'Rosa Vila', lleva: 'teresa', cartera: false, quienEs: 'Vendedora en Gràcia'}),
    'joan-serra': c('joan-serra', {nombre: 'Joan Serra', corto: 'Joan', lleva: 'marc', cartera: false, foto: 'joan', quienEs: 'Propietario de la casa de Sant Cugat', piso: 'santcugat', chat: 'joan-serra',
      operacion: {tipo: 'venta', fase: 3, texto: 'La venta · Oferta · paso 3 de 5'}}),
    claudia: c('claudia', {nombre: 'Clàudia Ribas', lleva: 'marc', cartera: false, quienEs: `Compradora en Sants; la operación cayó el ${ff('2026-11-12')}`})
  };

  // H01 · de dónde sale cada cosa
  D.chats = {
    marta: {titulo: 'Chat de WhatsApp con Marta Puig', mensajes: [{texto: 'Hola, Laura. ¿Sigue disponible el piso de Gràcia? Podríamos verlo este sábado, por la mañana mejor.', cuando: ff('2026-11-22T18:42')}]},
    elena: {titulo: 'De sus chats', mensajes: [{texto: 'Busco dos habitaciones, pero sobre todo luz.', cuando: ff('2026-11-12')}, {texto: '¿Se oye mucho la calle?', cuando: ff('2026-11-19')}]},
    'elena-nomina': {titulo: 'Chat de WhatsApp con Elena Vives', mensajes: [{texto: 'El miércoles te paso la nómina', cuando: ff('2026-11-16T19:02')}]},
    pere: {titulo: 'Chat de WhatsApp con Pere Soler', mensajes: [{texto: 'Laura, ¿me cuentas cada lunes cómo va? Así no te llamo tanto.', cuando: ff('2026-10-02T19:20')}]},
    nuria: {titulo: 'Chat de WhatsApp con Núria Camps', mensajes: [{texto: 'Al final lo de Poble-sec no nos convence. Si sale algo en Sant Antoni con balcón, avísame, porfa.', cuando: ff('2026-11-03T20:15')}]},
    jordi: {titulo: 'Chat de WhatsApp con Jordi Ferrer', mensajes: [{texto: '¿Me pasas el informe del piso antes del jueves? Quiero enseñárselo a mi hermana', cuando: ff('2026-11-20T12:05')}, {texto: 'Claro, te lo paso antes del jueves.', cuando: ff('2026-11-20T12:20'), tu: true}]},
    sergi: {titulo: 'Chat de WhatsApp con Sergi Mas', mensajes: [{texto: 'Buenas, ¿el alquiler de Les Corts admite mascotas?', cuando: ff('2026-11-09T21:48')}]},
    albert: {titulo: 'Chat de WhatsApp con Albert Roca', mensajes: [{texto: 'Si sale algún local por el centro, avísame', cuando: ff('2026-10-03')}]},
    carmen: {titulo: 'WhatsApp de la oficina · Carmen López', mensajes: [{texto: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', cuando: ff('2026-11-22T19:10')}]},
    ruben: {titulo: 'Chat de WhatsApp con Rubén Gil', mensajes: [{texto: '¿Ha venido alguien a ver el ático esta semana?', cuando: ff('2026-11-22T20:15')}]},
    guillem: {titulo: 'Chat de WhatsApp con Guillem Roig', mensajes: [{texto: '¿Me confirmas la visita del miércoles?', cuando: ff('2026-11-23T08:12')}]},
    'joan-serra': {titulo: 'Chat de WhatsApp con Joan Serra', mensajes: [{texto: 'Llevo diez días sin noticias del piso. Si nadie me dice nada, me voy a otra agencia.', cuando: ff('2026-11-21T20:05')}]},
    'pau-rios': {titulo: 'WhatsApp de la oficina · Pau Ríos', mensajes: [{texto: '¿Tenéis algún local en el Eixample para alquilar?', cuando: ff('2026-11-21T13:20')}]},
    lucia: {titulo: 'WhatsApp de la oficina · Lucía Gómez', mensajes: [{texto: 'Quiero vender el piso de mis padres en Sant Gervasi. ¿Cómo trabajáis?', cuando: ff('2026-11-23T07:40')}]},
    ramon: {titulo: 'Chat de WhatsApp con Ramon Pujol', mensajes: [{texto: '¿Sigue en pie la visita del jueves?', cuando: ff('2026-11-22T17:30')}]},
    'sin-nombre': {titulo: 'WhatsApp de la oficina · número sin nombre', mensajes: [{texto: '¿Precio del piso de Verdi?', cuando: ff('2026-11-23T08:55')}]},
    claudia: {titulo: 'Chat de WhatsApp con Clàudia Ribas', mensajes: [{texto: 'Hola, me interesa el piso de la calle Olzinelles. ¿Puedo verlo?', cuando: ff('2026-11-03T18:20')}, {texto: 'Ya he encontrado otro piso, gracias.', cuando: ff('2026-11-12T10:02')}]}
  };
})();
