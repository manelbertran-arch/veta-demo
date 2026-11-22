/* Veta demo · ronda 7 · js/datos/r7-a1.js · A1 “Te toca a ti”
   Las palabras de cada persona de la lista: “qué pasa” (una línea de la fila), la pastilla (como mucho una, y solo roja si nadie ha contestado)
   y el título (“lo que se hace”, no el nombre de la persona: FA, 9b) y la frase de su pantalla (toca/:id, 18 palabras como mucho). Además, “Ver su ficha” pasa a “Otra cosa…” (H02), para que la tarjeta lleve tres botones. */
(function () {
  'use strict';
  VETA.datos = VETA.datos || {};
  VETA.datos.r7a1 = {
    haceUnMes: 9,
    cosas: {
      'c-marta': {titulo: 'Reply to Marta', pasa: 'She wants to see the flat', pastilla: 'No reply yet', tono: 'rojo',
        frase: 'Marta wants to see the flat. See my reply and send it yourself.'},
      'c-elena': {pasa: 'Viewing today at 9:00', ir: 'visita/elena'},
      'c-pere': {titulo: 'Weekly report', pasa: 'Is waiting for the weekly report', boton: 'Open the report',
        frase: 'Pere waits for it every Monday. Open it, look at it and send it yourself.', hecho: 'I did it for you'},
      'c-nuria': {titulo: 'Tell Núria about the flat', pasa: 'There is a flat for her',
        frase: 'The flat Núria is looking for has come in. See my message and send it yourself.'},
      'c-jordi': {titulo: 'Reply to Jordi', pasa: 'You promised him the report',
        frase: 'You promised him the flat report. See my message and send it yourself.'},
      'c-sergi': {titulo: 'Take Sergi off the list', pasa: 'Anna already replied: take him off', boton: 'Take it off the list',
        frase: 'Anna already replied to him. No need to write to him: take it off your list.'}
    }
  };
  // “Ver su ficha” al final de “Otra cosa…” (cada cosa con su lista: la de r6-dia.js es compartida y no se toca)
  ((VETA.datos.cola || {}).laura || []).forEach(c => {
    if (!c.cliente || !Array.isArray(c.otraCosa) || c.otraCosa.some(o => o.ir)) return;
    c.otraCosa = c.otraCosa.concat([{texto: 'See their profile', ir: 'cliente/' + c.cliente}]);
  });
})();
