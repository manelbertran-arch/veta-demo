/* Veta demo · ronda 7 · js/datos/r7-a1.js · A1 «Te toca a ti»
   Las palabras de cada persona de la lista: «qué pasa» (una línea de la fila), la pastilla (como mucho una, y solo roja si nadie ha contestado)
   y el título («lo que se hace», no el nombre de la persona: FA, 9b) y la frase de su pantalla (toca/:id, 18 palabras como mucho). Además, «Ver su ficha» pasa a «Otra cosa…» (H02), para que la tarjeta lleve tres botones. */
(function () {
  'use strict';
  VETA.datos = VETA.datos || {};
  VETA.datos.r7a1 = {
    haceUnMes: 9,
    cosas: {
      'c-marta': {titulo: 'Contestar a Marta', pasa: 'Quiere ver el piso', pastilla: 'Sin contestar', tono: 'rojo',
        frase: 'Marta quiere ver el piso. Mira mi respuesta y envíala tú.'},
      'c-elena': {pasa: 'Visita hoy a las 9:00', ir: 'visita/elena'},
      'c-pere': {titulo: 'Informe de la semana', pasa: 'Espera el informe de la semana', boton: 'Abrir el informe',
        frase: 'Pere lo espera cada lunes. Ábrelo, míralo y envíalo tú.', hecho: 'Te lo dejo hecho'},
      'c-nuria': {titulo: 'Contarle el piso a Núria', pasa: 'Hay un piso para ella',
        frase: 'Ha entrado el piso que busca Núria. Mira mi mensaje y envíalo tú.'},
      'c-jordi': {titulo: 'Contestar a Jordi', pasa: 'Le prometiste el informe',
        frase: 'Le prometiste el informe del piso. Mira mi mensaje y envíalo tú.'},
      'c-sergi': {titulo: 'Quitar a Sergi de la lista', pasa: 'Ya le contestó Anna: quítalo', boton: 'Quitarla de la lista',
        frase: 'Anna ya le contestó. No hace falta escribirle: quítalo de tu lista.'}
    }
  };
  // «Ver su ficha» al final de «Otra cosa…» (cada cosa con su lista: la de r6-dia.js es compartida y no se toca)
  ((VETA.datos.cola || {}).laura || []).forEach(c => {
    if (!c.cliente || !Array.isArray(c.otraCosa) || c.otraCosa.some(o => o.ir)) return;
    c.otraCosa = c.otraCosa.concat([{texto: 'Ver su ficha', ir: 'cliente/' + c.cliente}]);
  });
})();
