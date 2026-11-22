/* Veta demo · ronda 7 · js/datos/r7-b.js · B (Clientes)
   Textos cortos de la rejilla de caras y de la ficha. Lo que no está aquí sale de los datos de siempre (clientes.js, extra-b.js).
   - hoy y corto: la línea debajo de la cara (13 letras como mucho: cabe en un tercio de la pantalla).
   - quiere: la frase de la ficha (qué quiere esta persona).
   - toca: «Qué toca ahora», en una línea. boton: el texto del botón negro de la ficha. */
(function () {
  'use strict';
  VETA.datos.r7b = {
    // el nombre debajo de la cara, si el entero no cabe
    nombre: {casals: 'Los Casals'},
    // quien está en «Te toca a ti»: lo que le toca, por su cosa de esa lista (la misma fuente que la caja y la lista)
    hoy: {'c-marta': 'Te ha escrito', 'c-elena': 'Visita hoy', 'c-pere': 'Su informe', 'c-nuria': 'Hay un piso', 'c-jordi': 'Su informe', 'c-sergi': 'Ya atendido'},
    // quien no está: su estado de verdad (nunca «Toca…»); si no hay nada aquí, «Al día»
    corto: {albert: 'Parado', laia: 'Va a firmar', 'carme-font': 'Ya vendió'},
    quiere: {
      marta: 'Quiere comprar un piso de 3 habitaciones en Gràcia.',
      elena: 'Quiere comprar un piso de 2 habitaciones, con luz.',
      pere: 'Vende su piso de la calle Verdi 42.',
      jordi: 'Quiere comprar el piso de Sants, en la calle Olzinelles.',
      nuria: 'Quiere comprar en Sant Antoni, con balcón.',
      albert: 'Busca locales para alquilarlos.',
      laia: 'Compra un piso en Poblenou.',
      'carme-font': 'Vendió su piso de Horta en junio.'
    },
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
    ir: {pere: 'informe/pere'}
  };
})();
