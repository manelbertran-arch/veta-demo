/* Veta demo · datos · oficina.js
   6.6 · dirección: el Hoy de Montse (3), las decisiones de Equipo (4), En espera de Montse (3), contactos que nadie
   lleva y sin responder, las 12 operaciones, el caso de Clàudia (G13), los ocho números y los tiempos de ejemplo. */
(function () {
  'use strict';
  const D = VETA.datos;
  const otra = {texto: 'Otra cosa…', hoja: 'h02'};

  D.cola = D.cola || {};
  D.cola.montse = [
    {id: 'm-ruben', quien: 'montse', tipo: 'mensaje', cliente: 'ruben', titulo: 'Rubén Gil', corto: 'Rubén', sale: true, chat: 'ruben',
      quienEs: 'Vendedor · ático de Sant Gervasi', etiqueta: 'sin-responder',
      cita: {texto: '¿Ha venido alguien a ver el ático esta semana?', origen: 'Rubén · ayer, 20:15'},
      borrador: 'Hola, Rubén, soy Montse. La semana pasada vieron el ático dos parejas; una quiere volver el sábado. Te llamo el viernes con lo que digan.',
      boton: {texto: 'Abrir WhatsApp con el mensaje'}, secundarios: [{texto: 'Editar', ir: 'mensaje/m-ruben'}, otra],
      fila: 'Rubén Gil', filaSub: 'Pregunta por las visitas del ático', lineas: {enviada: 'Enviado a Rubén'}},
    {id: 'm-guillem', quien: 'montse', tipo: 'mensaje', cliente: 'guillem', titulo: 'Guillem Roig', corto: 'Guillem', sale: true, chat: 'guillem',
      quienEs: 'Comprador',
      cita: {texto: '¿Me confirmas la visita del miércoles?', origen: 'Guillem · hoy, 8:12'},
      borrador: 'Hola, Guillem, soy Montse. Confirmado: el miércoles a las 18:00 en Muntaner 214. Nos vemos en el portal.',
      boton: {texto: 'Abrir WhatsApp con el mensaje'}, secundarios: [{texto: 'Editar', ir: 'mensaje/m-guillem'}, otra],
      fila: 'Guillem Roig', filaSub: 'Confirmar la visita del miércoles', lineas: {enviada: 'Enviado a Guillem'}},
    {id: 'm-silvia', quien: 'montse', tipo: 'llamada', cliente: 'silvia', titulo: 'Sílvia Prat', corto: 'Sílvia', nota: false,
      quienEs: 'Compradora · ático de Sant Gervasi',
      antes: ['Ofreció 520.000 € por el ático.', 'El propietario pide 545.000 €.', 'El viernes dijo que se lo pensaba.'],
      boton: {texto: 'Llamar a Sílvia', accion: 'llamar'}, secundarios: [{texto: 'Ver la ficha', ir: 'cliente/silvia'}, otra],
      fila: 'Sílvia Prat', filaSub: 'Llamada', lineas: {hecha: 'Llamada a Sílvia'}}
  ];

  // G1 · las decisiones del equipo (4)
  D.cola.equipo = [
    {id: 'd-carmen', quien: 'equipo', tipo: 'asunto', cliente: 'carmen', titulo: 'Carmen López', corto: 'Carmen', nota: false, chat: 'carmen',
      quienEs: 'No la lleva nadie', etiqueta: 'por-decidir', etiquetaTexto: 'Tienes que decidir',
      momento: 'Nadie le contesta desde ayer, 19:10.',
      cita: {texto: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', origen: 'Carmen · WhatsApp de la oficina · ayer, 19:10'},
      propone: 'Yo se lo daría a Laura: lleva Gràcia. Encaja con un piso que ya tenéis: Verdi 42.',
      boton: {texto: 'Dárselo a Laura', accion: 'asignar'}, secundarios: [{texto: 'Ver qué ha pasado', ir: 'asunto/carmen'}, otra],
      otraCosa: [{texto: 'Dárselo a otra persona', hoja: 'h35'}, {texto: 'Lo llevo yo', llevoYo: true},
        {texto: 'Para luego', estado: 'para-manana', linea: 'Para luego · Carmen López'}, {texto: 'Descartarlo', estado: 'quitada', linea: 'Descartado · Carmen López'}],
      fila: 'Carmen López', filaSub: 'No la lleva nadie desde ayer', lineas: {hecha: 'Carmen López, asignada a Laura'},
      alResolver: {flag: 'carmen-asignada'}},
    {id: 'd-regla', quien: 'equipo', tipo: 'regla', titulo: 'Informe del piso al día siguiente', icono: 'estrella', nota: false,
      quienEs: 'Trabajo para la oficina', etiqueta: 'por-decidir', etiquetaTexto: 'Tienes que decidir',
      resumen: 'Cuando alguien pide una valoración, preparo el informe del piso al día siguiente y el agente lo envía.',
      get propone() { return VETA.dir.proponeRegla() + '. Han llegado 23 peticiones de valoración; Laura lo ha hecho a mano 14 veces.'; },
      boton: {texto: 'Ver los casos y decidir', ir: 'regla-oficina/dossier'},
      fila: 'Un trabajo para toda la oficina', get filaSub() { return 'Informe del piso al día siguiente · ' + (VETA.dir.laPropuso() ? 'lo propone Laura' : 'lo propongo yo'); }, ficha: 'regla-oficina/dossier', lineas: {hecha: 'Decidido · Informe del piso al día siguiente'}},
    {id: 'd-teresa', quien: 'equipo', tipo: 'reparto', titulo: 'Teresa Gil está de baja', av: 'teresa', nota: false,
      quienEs: 'Sus clientes, sin atender', etiqueta: 'por-decidir', etiquetaTexto: 'Tienes que decidir',
      resumen: 'Desde el lunes 16. Tiene 34 conversaciones abiertas con 12 clientes y 3 visitas esta semana.',
      propone: 'Yo se las pasaría a Laura, que trabaja en la misma oficina.',
      boton: {texto: 'Pasar sus clientes a otra persona', ir: 'reparto'},
      fila: 'Teresa está de baja', filaSub: '34 conversaciones sin atender', ficha: 'reparto', lineas: {hecha: 'Clientes de Teresa, pasados'}},
    {id: 'd-joan', quien: 'equipo', tipo: 'queja', cliente: 'joan-serra', titulo: 'Queja de Joan Serra', corto: 'Joan', nota: false, chat: 'joan-serra',
      quienEs: 'Queja de un propietario', etiqueta: 'por-decidir', etiquetaTexto: 'Tienes que decidir',
      // sin citar el chat de Marc: dirección lo sabe porque saltó su aviso de quejas
      resumen: 'Te avisé el sábado a las 20:05, como me pediste: un propietario se queja. Lleva diez días sin noticias del piso.',
      pie: 'Lo lleva Marc.',
      boton: {texto: 'Pedir a Marc que le llame hoy', accion: 'pedir-marc'}, secundarios: [{texto: 'Ver qué ha pasado', ir: 'asunto/joan-serra'}, otra],
      otraCosa: [{texto: 'Le llamo yo', estado: 'hecha', linea: 'Joan Serra · le llamas tú'}, {texto: 'Para luego', estado: 'para-manana', linea: 'Para luego · Joan Serra'},
        {texto: 'Descartarlo', estado: 'quitada', linea: 'Descartada · queja de Joan Serra'}],
      fila: 'Queja de Joan Serra, propietario', filaSub: 'Lo lleva Marc · sábado 21, 20:05', ficha: 'asunto/joan-serra', lineas: {hecha: 'Pedido a Marc: llamar a Joan Serra hoy'},
      alResolver: {flag: 'marc-llama-joan'}}
  ];

  D.espera = D.espera || {};
  D.espera.montse = [
    {id: 'em-guillem', quien: 'montse', tipo: 'espera', fechaISO: '2026-11-25', fecha: 'Mié 25', cliente: 'guillem', titulo: 'Guillem Roig', texto: 'Visita'},
    {id: 'em-ruben', quien: 'montse', tipo: 'espera', fechaISO: '2026-11-27', fecha: 'Vie 27', cliente: 'ruben', titulo: 'Rubén Gil', texto: 'Le llamas'},
    {id: 'em-silvia', quien: 'montse', tipo: 'espera', fechaISO: '2026-11-30', fecha: 'Lun 30', cliente: 'silvia', titulo: 'Sílvia Prat', texto: 'Respuesta del banco'}
  ];

  // contactos sin responder (5), de ellos 3 sin dueño
  D.contactos = [
    {id: 'carmen', nombre: 'Carmen López', sinDueno: true, cita: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', cuando: 'ayer, 19:10', propone: 'laura'},
    {id: 'pau-rios', nombre: 'Pau Ríos', sinDueno: true, cita: '¿Tenéis algún local en el Eixample para alquilar?', cuando: 'sábado 21, 13:20', propone: 'david'},
    {id: 'lucia', nombre: 'Lucía Gómez', sinDueno: true, cita: 'Quiero vender el piso de mis padres en Sant Gervasi. ¿Cómo trabajáis?', cuando: 'hoy, 7:40', propone: 'marc'},
    {id: 'ramon', nombre: 'Ramon Pujol', sinDueno: false, lleva: 'teresa', cita: '¿Sigue en pie la visita del jueves?', cuando: 'ayer, 17:30'},
    {id: 'sin-nombre', nombre: 'Número sin nombre', sinDueno: false, cita: '¿Precio del piso de Verdi?', cuando: 'hoy, 8:55'}
  ];

  // las 12 operaciones (Clientes › Todos): 6 en marcha + 4 paradas + 1 cerrada + 1 caída
  D.operaciones = [
    {cliente: 'marta', texto: 'Compra en Gràcia', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'En marcha', oficina: 'gracia'},
    {cliente: 'elena', texto: 'Compra en Gràcia', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'En marcha', oficina: 'gracia'},
    {cliente: 'pere', texto: 'Venta de Verdi 42', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'En marcha', oficina: 'gracia'},
    {cliente: 'jordi', texto: 'Compra en Sants', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'En marcha', oficina: 'gracia'},
    {cliente: 'laia', texto: 'Compra en Poblenou', lleva: 'laura', estado: 'en-marcha', estadoTexto: 'En marcha · firma el 1 dic', oficina: 'gracia'},
    {cliente: 'ruben', texto: 'Venta del ático de Sant Gervasi', lleva: 'montse', estado: 'en-marcha', estadoTexto: 'En marcha', oficina: 'santgervasi'},
    {cliente: 'albert', texto: 'Busca un local', lleva: 'laura', estado: 'parado', estadoTexto: 'Parada · 7 semanas · fase Contacto', oficina: 'gracia'},
    {cliente: 'dani-prats', texto: 'Compra en Gràcia', lleva: 'teresa', estado: 'parado', estadoTexto: 'Parada · 9 días · fase Visitas', oficina: 'gracia'},
    {cliente: 'rosa-vila', texto: 'Venta en Gràcia', lleva: 'teresa', estado: 'parado', estadoTexto: 'Parada · 12 días · fase Visitas', oficina: 'gracia'},
    {cliente: 'joan-serra', texto: 'Venta de la casa de Sant Cugat', lleva: 'marc', estado: 'parado', estadoTexto: 'Parada · 10 días · fase Oferta · queja', oficina: 'santgervasi'},
    {cliente: 'carme-font', texto: 'Venta en Horta', lleva: 'laura', estado: 'cerrado', estadoTexto: 'Cerrada · junio', oficina: 'gracia'},
    {cliente: 'claudia', texto: 'Compra en Sants', lleva: 'marc', estado: 'caida', estadoTexto: 'Caída · 12 nov', oficina: 'santgervasi'}
  ];

  // G13 · un caso para aprender
  // los hitos, sin citar el chat (Clàudia era clienta de Marc: dirección no lee los chats de cada persona)
  D.casoClaudia = [
    {cuando: '3 nov, 18:20', texto: 'Pide ver el piso de la calle Olzinelles'},
    {cuando: '4 nov, 9:15', texto: 'Se le propone una visita'},
    {cuando: 'Del 4 al 11 nov', texto: 'Espera una llamada que no llega'},
    {cuando: '12 nov, 10:02', texto: 'Avisa de que ya ha encontrado otro piso'}
  ];

  // los ocho números de la oficina (los del backend, con cifras inventadas)
  D.numeros = {
    nombres: ['Cosas que he visto', 'Mensajes y tareas listos', 'Completados', 'Esperan aprobación', 'Correcciones', 'Hechos sin que nadie los toque', 'Tareas que sigo yo', 'Trabajos de la oficina'],
    ventanas: {'7d': 'Últimos 7 días', desde: 'Desde que empezamos'},
    '7d': [184, 156, 132, 19, 14, 0, 23, 1],
    desde: [1196, 1012, 861, 24, 97, 0, 41, 6],
    semanaAnterior: {texto: 'del 9 al 15 de noviembre', preparados: 141, completados: 118},
    porOficina: {gracia: {preparados: 92, completados: 78}, santgervasi: {preparados: 64, completados: 54}}
  };

  // H34 · los temas de hoy (elige hasta 3)
  D.temas = [
    {id: 'esperando', texto: 'Esperando respuesta', cifra: '11'}, {id: 'promesas', texto: 'Promesas sin constancia', cifra: '7'},
    {id: 'quieren', texto: 'Quieren vender o comprar', cifra: '9'}, // la cifra de contactos sale de lo mismo que «Lo que entra» (baja al asignar)
    {id: 'contactos', texto: 'Contactos nuevos sin responder', get cifra() { return String(VETA.dir.sinResponder().length); }},
    {id: 'respuesta', texto: 'Tiempo de respuesta habitual', cifra: '2 h 40 min'}, {id: 'visitas', texto: 'Visitas sin confirmar', cifra: '4'}
  ];
  D.temasIniciales = ['contactos', 'promesas', 'visitas'];

  // tiempos (solo con la etiqueta «Ejemplo»; el código hace la cuenta, no se escribe el resultado a mano)
  D.tiempos = {
    laura: [{id: 'mensajes', texto: 'Mensajes preparados', n: 27, minEjemplo: 4}, {id: 'actas', texto: 'Actas de visita', n: 3, minEjemplo: 12}, {id: 'avisos', texto: 'Avisos y recordatorios', n: 4, minEjemplo: 2}],
    equipo: {minutos: 765, conTiempos: 4, personas: 6, costeEjemplo: 35}
  };

  // H41 · informe a socios
  D.partes = D.partes || {};
  D.partes.socios = {titulo: 'Informe a socios · noviembre', bloques: [
    {lista: ['Leído: 212 chats', 'Contestado: 94 en la última semana', 'Promesas: 12 halladas, 7 sin constancia', 'Punto de partida: el día 0 había 46 tarjetas por semana']}]};
})();
