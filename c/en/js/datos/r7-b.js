/* Veta demo · ronda 7 · js/datos/r7-b.js · B (Clientes)
   Textos cortos de la rejilla de caras y de la ficha. Lo que no está aquí sale de los datos de siempre (clientes.js, extra-b.js).
   - hoy y corto: la línea debajo de la cara (13 letras como mucho: cabe en un tercio de la pantalla).
   - quiere: la frase de la ficha (qué quiere esta persona).
   - toca: “Qué toca ahora”, en una línea. boton: el texto del botón negro de la ficha. */
(function () {
  'use strict';
  VETA.datos.r7b = {
    // el nombre debajo de la cara, si el entero no cabe
    nombre: {casals: 'The Casals'},
    // quien está en “Te toca a ti”: lo que le toca, por su cosa de esa lista (la misma fuente que la caja y la lista)
    hoy: {'c-marta': 'Wrote to you', 'c-elena': 'Visit today', 'c-pere': 'His report', 'c-nuria': 'There is a flat', 'c-jordi': 'His report', 'c-sergi': 'Handled'},
    // quien no está: su estado de verdad (nunca “Toca…”); si no hay nada aquí, “Al día”
    corto: {albert: 'Stalled', laia: 'Going to sign', 'carme-font': 'Already sold'},
    quiere: {
      marta: 'Wants to buy a 3-bedroom flat in Gràcia.',
      elena: 'Wants to buy a 2-bedroom flat, with light.',
      pere: 'Is selling their flat at Verdi 42.',
      jordi: 'Wants to buy the flat in Sants, on Olzinelles street.',
      nuria: 'Wants to buy in Sant Antoni, with a balcony.',
      albert: 'Is looking for premises to rent.',
      laia: 'Is buying a flat in Poblenou.',
      'carme-font': 'Sold their flat in Horta in June.'
    },
    toca: {
      marta: 'Reply to her. I write the message for you.',
      elena: 'Their viewing, today at 9:00, at Verdi 42.',
      pere: 'Send him the weekly report. I made it for you.',
      jordi: 'Give him the flat report before Thursday.',
      nuria: 'Tell her about a flat in Sant Antoni that suits her.',
      albert: 'Call him about the premises in the Eixample.'
    },
    boton: {marta: 'Reply to Marta', elena: 'Go to the viewing', pere: 'See the weekly report', jordi: 'Send the report to Jordi', nuria: 'Tell Núria about the flat'},
    // adónde lleva el botón negro, si no es su tarjeta de “Te toca a ti”: el informe de la semana, directo
    ir: {pere: 'informe/pere'}
  };
})();
