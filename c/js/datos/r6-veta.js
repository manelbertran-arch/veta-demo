/* Veta demo · datos · r6-veta.js · ronda 6 · paquete C · Veta: aprender (P2)
   Los datos nuevos de este paquete para la ronda 6, en VETA.datos.r6.veta.
   Reutiliza las cifras que ya tiene la app; lo inventado aquí se apunta en ESTADO_R6_P2.md.
   Además, con nombres que entiende un niño de 6 años (ESTRATEGIA_R6 §3 bis):
   - los cinco pasos de «¿Quién lo hace?» (VETA.datos.c.niveles, que lee VETA.vivo.escalera);
   - dos textos legales que decían que dirección no ve nada por persona (decisión 1 de Manel, 21-nov). */
(function () {
  'use strict';
  const D = VETA.datos, R = D.r6 = D.r6 || {};
  const V = R.veta = R.veta || {};

  // ---- «¿Quién lo hace?»: de «Lo haces tú» a «Lo hago yo» (mismo orden que los cinco niveles de antes) ----
  if (D.c) D.c.niveles = [
    {n: 1, nombre: 'Solo te aviso', enLista: 'Te aviso yo', texto: 'Te digo que toca. Lo haces tú.'},
    {n: 2, nombre: 'Te lo dejo escrito', texto: 'Te dejo el mensaje listo. Tú lo envías.'},
    {n: 3, nombre: 'Lo apunto yo', texto: 'Apunto, marco y guardo yo. No envío nada.'},
    {n: 4, nombre: 'Lo hago yo y te lo cuento', texto: 'Lo dejo hecho y te lo cuento. Si hay que enviar algo, antes me dices que sí.'},
    {n: 5, nombre: 'Lo envío yo', texto: 'Todavía no. Nada sale sin ti.', cerrado: true}
  ];

  // ---- dónde está cada cosa que hago (paso 1-4) y la pregunta para subir, con sus casos ----
  V.pasos = {
    'r-valoraciones': {paso: 2},
    'r-cancelaciones': {paso: 2},
    'r-actas': {paso: 2, sube: {hechas: 14, corregidas: 1, pregunta: '¿Lo apunto yo en tu lista, sin preguntarte?', boton: 'Sí, apúntalo tú'}},
    'r-promesas': {paso: 3},
    'r-informes': {paso: 2},
    'r-contestado': {paso: 3},
    'r-firmas': {paso: 1},
    'r-recordatorios': {paso: 2}
  };

  // ---- el trabajo nuevo que se puede subir de verdad: confirmar las visitas el día antes ----
  // pulido: al decir que sí pasa a 'prueba' y ahí se queda (una prueba que empieza hoy no tiene historial: no pregunta otra vez)
  // su sitio vive en VETA.r6.reglaVisitas(): 'propuesta' (paso 1) → 'prueba' (paso 2) → 'sola' (paso 3)
  const F = iso => VETA.fecha.corta(iso);
  V.visitas = {
    id: 'r-visitas', nombre: 'Confirmar las visitas el día antes', corto: 'Confirmar las visitas el día antes',
    paso: {propuesta: 1, prueba: 2, sola: 3},
    frase: {
      propuesta: 'El día antes de una visita, escribes al cliente para confirmarla.',
      prueba: 'El día antes de una visita, te dejo escrito el mensaje para confirmarla. Tú lo envías.',
      sola: 'El día antes de una visita, miro si el cliente ya ha dicho que viene. Si lo ha dicho, lo apunto yo y no te molesto.'
    },
    // la frase viva de lo que pasará (sábado 28: Marta y Elena tienen visita; datos de Hoy y del mapa)
    manana: {
      propuesta: 'El viernes te recordaré las visitas del sábado. Escribirles lo harás tú.',
      prueba: 'El viernes te dejo escritos los mensajes de Marta y Elena, que vienen el sábado.',
      sola: 'El viernes miraré si Marta y Elena han dicho que vienen el sábado. Si lo han dicho, lo apunto yo. Si no, te dejo el mensaje escrito en Inicio.'
    },
    // los 9 casos en que confirmaste tú (inventados para la demo, con clientes que ya existen)
    casos: [
      {cuando: F('2026-11-20'), nombre: 'Elena Vives', av: 'elena', dijo: 'Sí, mañana a las 11:00 nos vemos en el portal'},
      {cuando: F('2026-11-13'), nombre: 'Marta Puig', av: 'marta', dijo: 'Perfecto, allí estaré'},
      {cuando: F('2026-11-07'), nombre: 'Jordi Ferrer', av: 'jordi', dijo: 'Sí, a las 18:00 me va bien'},
      {cuando: F('2026-10-31'), nombre: 'Sergi Font', av: 'sergi', dijo: 'Confirmado, gracias'},
      {cuando: F('2026-10-24'), nombre: 'Anna Bosch', av: 'anna-bosch', dijo: 'Sí, vamos los dos'},
      {cuando: F('2026-10-17'), nombre: 'Toni Ribas', av: 'toni', dijo: '¿Podemos a las 12:00 en vez de a las 11:00?', distinto: 'Cambiasteis la hora'},
      {cuando: F('2026-10-10'), nombre: 'Família Casals', av: 'casals', dijo: 'Sí, allí estaremos'},
      {cuando: F('2026-10-03'), nombre: 'Núria Camps', av: 'nuria', dijo: 'Sí, perfecto'},
      {cuando: F('2026-09-26'), nombre: 'Rosa Vidal', av: 'rosa', dijo: 'Ahí estaré'}
    ],
    hechas: 9, corregidas: 1,
    // lo que digo al empezar la prueba, en el sitio de la pregunta (sin historial: empieza hoy)
    hecho: 'El viernes te dejo escritos los mensajes de Marta y Elena. Cuando lo haya hecho unas cuantas veces, te pregunto si doy un paso más.',
    // lo que pregunta cada paso para subir al siguiente
    sube: {
      propuesta: {pregunta: 'Esto lo has hecho 9 veces. ¿Te lo dejo escrito yo el día antes?', boton: 'Sí, déjamelo escrito'}
    }
  };

  // ---- lo aprendido: quién lo pidió, cuándo, veces que lo he usado y veces que me corregiste ----
  V.aprendido = {
    'pere-tarde': {texto: 'A Pere le escribo por la tarde, después de las 16:00.', quien: 'Lo vi en tus mensajes y me lo confirmaste', cuando: 'el 12 oct', hechas: 23, corregidas: 1, paso: 2},
    'marta-sabados': {texto: 'A Marta solo le propongo visitas en sábado.', quien: 'Lo dijo Marta en su chat', cuando: 'el 3 nov', hechas: 4, corregidas: 0, paso: 2},
    'arras-notaria': {texto: 'Las arras, en la notaría de Gran de Gràcia.', quien: 'Lo vi en tus 4 últimas arras', cuando: 'el 28 oct', hechas: 2, corregidas: 0, paso: 3}
  };

  // ---- Antes y ahora (A20) · 46 → 21 de la hoja «Tu lista de cada día»; 40 (19 oct) es nuevo ----
  V.antesAhora = {
    semanas: [46, 40, 34, 29, 25, 21],
    antes: {rotulo: 'Cuando empezamos', valor: 46, unidad: 'cosas tuyas por semana',
      filas: ['Escribías cada respuesta', 'Te acordabas tú de cada promesa', 'Mirabas quién había contestado', 'Escribías las actas de visita de noche']},
    ahora: {rotulo: 'La semana pasada', valor: 21, unidad: 'cosas tuyas por semana',
      filas: ['Lees y envías lo que te dejo escrito', 'Me cuentas la visita al salir', 'Haces lo nuevo, que aún no sé hacer']}
  };

  // «Lo que dirección ve de ti» (A14 y A15) ya no tiene datos propios: lee la ficha de la persona de dirección (VETA.dir.personaOps)

  // ---- textos legales que contradecían la decisión 1 ----
  if (D.textos && D.textos.resumen) D.textos.resumen.bloques = [{lista: ['Lee solo los canales conectados por la oficina.', 'Cada mensaje que sale lo aprueba una persona.',
    'Dirección ve tus operaciones y lo que Veta hace por ti, sin cifras por persona. No ve lo que escribes en tus chats ni tus notas.', 'Puedes dejar fuera cualquier chat cuando quieras.']}];
  if (D.textos && D.textos.ver) D.textos.ver.bloques = [{texto: 'Cada persona ve lo suyo: sus clientes, su día y sus trabajos.'},
    {texto: 'Dirección ve cada operación y a cada persona: sus operaciones y lo que Veta hace por ella, sin cifras por persona. No ve lo que se escribe en los chats ni las notas de nadie.'}];
})();
