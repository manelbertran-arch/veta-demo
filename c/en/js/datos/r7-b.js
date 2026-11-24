/* Veta demo · ronda 8 · js/datos/r7-b.js · B (Clientes)
   Textos cortos de la ficha. Lo que no está aquí sale de los datos de siempre (clientes.js, extra-b.js).
   - toca: “Qué toca ahora”, en una línea. boton: el texto del botón negro de la ficha. ir: adónde lleva, si no es su tarjeta.
   - piso: cómo se llama la fila de su piso (28 letras como mucho). */
(function () {
  'use strict';
  VETA.datos.r7b = {
    toca: {
      marta: 'Reply to her. I write the message for you.',
      elena: 'Their viewing, today at 9:00, at Verdi 42.',
      pere: 'Send him the weekly report. I made it for you.',
      jordi: 'Give him the flat report before Thursday.',
      nuria: 'Tell her about a flat in Sant Antoni that suits her.',
      albert: 'Call him about the Eixample unit.'
    },
    boton: {marta: 'Reply to Marta', elena: 'Go to the viewing', pere: 'See the weekly report', jordi: 'Send the report to Jordi', nuria: 'Tell Núria about the flat'},
    // adónde lleva el botón negro, si no es su tarjeta de “Te toca a ti”: el informe de la semana, directo
    ir: {pere: 'informe/pere'},
    piso: {verdi: 'The flat at Verdi 42', olzinelles: 'The Olzinelles flat'}
  };
})();
