/* Veta demo · ronda 8 · js/datos/r7-b.js · B (Clientes)
   Textos cortos de la ficha. Lo que no está aquí sale de los datos de siempre (clientes.js, extra-b.js).
   - toca: «Qué toca ahora», en una línea. boton: el texto del botón negro de la ficha. ir: adónde lleva, si no es su tarjeta.
   - piso: cómo se llama la fila de su piso (28 letras como mucho). */
(function () {
  'use strict';
  VETA.datos.r7b = {
    toca: {
      marta: 'Contestarle. Te dejo el mensaje escrito.',
      elena: 'Su visita, hoy a las 9:00, en Verdi 42.',
      pere: 'Enviarle el informe de la semana. Te lo dejo hecho.',
      jordi: 'Pasarle el informe del piso antes del jueves.',
      nuria: 'Contarle un piso de Sant Antoni que le va bien.',
      albert: 'Llamarle por el local del Eixample.'
    },
    boton: {marta: 'Contestar a Marta', elena: 'Ir a la visita', pere: 'Ver el informe de la semana', jordi: 'Enviar el informe a Jordi', nuria: 'Contarle el piso a Núria'},
    // adónde lleva el botón negro, si no es su tarjeta de «Te toca a ti»: el informe de la semana, directo
    ir: {pere: 'informe/pere'},
    piso: {verdi: 'El piso de Verdi 42', olzinelles: 'El piso de Olzinelles'}
  };
})();
