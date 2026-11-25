/* Veta demo · ronda 8 · js/datos/r7-a1.js · carril A · las cosas del día
   Las palabras de cada persona de la lista: «qué pasa» (la segunda línea de su fila), la pastilla (como mucho una, y solo roja si nadie
   ha contestado) y el título de su pantalla (toca/:id): lo que se hace, no el nombre de la persona, en 22 caracteres como mucho.
   Además, «Ver su ficha» pasa a «Más» (H02). */
(function () {
  'use strict';
  VETA.datos = VETA.datos || {};
  VETA.datos.r7a1 = {
    cosas: {
      'c-marta': {titulo: 'Contestar a Marta', pasa: 'Quiere ver el piso', pastilla: 'Sin contestar', tono: 'rojo'},
      'c-elena': {pasa: 'Visita hoy a las 9:00', ir: 'visita/elena'},
      'c-pere': {titulo: 'Pere espera el informe', pasa: 'Espera el informe de la semana', boton: 'Abrir el informe', hecho: 'Te lo dejo hecho'},
      'c-nuria': {titulo: 'Un piso para Núria', pasa: 'Hay un piso para ella'},
      'c-jordi': {titulo: 'Contestar a Jordi', pasa: 'Le prometiste el informe'},
      'c-sergi': {titulo: 'Quitar a Sergi', pasa: 'Ya le contestó Anna: quítalo', boton: 'Quitarla de la lista'}
    }
  };
  // «Ver su ficha» al final de «Más» (cada cosa con su lista: la de r6-dia.js es compartida y no se toca)
  ((VETA.datos.cola || {}).laura || []).forEach(c => {
    if (!c.cliente || !Array.isArray(c.otraCosa) || c.otraCosa.some(o => o.ir)) return;
    c.otraCosa = c.otraCosa.concat([{texto: 'Ver su ficha', ir: 'cliente/' + c.cliente}]);
  });
})();
