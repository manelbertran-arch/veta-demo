/* Veta demo · ronda 8 · js/datos/r7-a1.js · carril A · las cosas del día
   Las palabras de cada persona de la lista: “qué pasa” (la segunda línea de su fila), la pastilla (como mucho una, y solo roja si nadie
   ha contestado) y el título de su pantalla (toca/:id): lo que se hace, no el nombre de la persona, en 22 caracteres como mucho.
   Además, “Ver su ficha” pasa a “Más” (H02). */
(function () {
  'use strict';
  VETA.datos = VETA.datos || {};
  VETA.datos.r7a1 = {
    cosas: {
      'c-marta': {titulo: 'Reply to Marta', pasa: 'Wants to see the flat', pastilla: 'No reply yet', tono: 'rojo'},
      'c-elena': {pasa: 'Viewing today at 9:00', ir: 'visita/elena'},
      'c-pere': {titulo: 'Pere is waiting for the report', pasa: 'Expecting the weekly report', boton: 'Open the report', hecho: 'I did it for you'},
      'c-nuria': {titulo: 'A flat for Núria', pasa: 'A flat for her'},
      'c-jordi': {titulo: 'Reply to Jordi', pasa: 'You promised him the report'},
      'c-sergi': {titulo: 'Remove Sergi', pasa: 'Anna already replied: take him off', boton: 'Take it off the list'}
    }
  };
  // “Ver su ficha” al final de “Más” (cada cosa con su lista: la de r6-dia.js es compartida y no se toca)
  ((VETA.datos.cola || {}).laura || []).forEach(c => {
    if (!c.cliente || !Array.isArray(c.otraCosa) || c.otraCosa.some(o => o.ir)) return;
    c.otraCosa = c.otraCosa.concat([{texto: 'See their profile', ir: 'cliente/' + c.cliente}]);
  });
})();
