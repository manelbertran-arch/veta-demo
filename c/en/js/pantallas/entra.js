/* Veta demo · ronda 8 · pantallas · entra.js · carril D
   G9 · Lo que entra · #/entra — cuatro filas; cada una abre una hoja con su lista (d-entra). Botón: repartir los que nadie lleva (G5). */
(function () {
  'use strict';
  const X = VETA.dir, D = VETA.datos, r7 = VETA.r7;

  VETA.pantalla('G9', {
    titulo: 'What\'s coming in',
    pinta: () => r7.lista([
      {nombre: 'No reply yet', pasa: 'New contacts waiting', dato: X.sinResponder().length, hoja: 'd-entra', datos: {lista: 'contactos'}},
      {nombre: 'They write twice', pasa: 'And no one replies to them', dato: D.entra.dosVeces.length, hoja: 'd-entra', datos: {lista: 'dos'}},
      {nombre: 'Ask for what you lack', pasa: 'I note it down in case it comes in', dato: D.entra.noTenemos.length, hoja: 'd-entra', datos: {lista: 'no'}},
      {nombre: 'Want what you have', pasa: 'A flat that suits them', dato: 1, hoja: 'd-entra', datos: {lista: 'si'}}
    ], {i: 0}),
    botonFijo: () => {
      const sd = X.sinDueno().length;
      return sd ? r7.botones({texto: sd === 1 ? 'Allocate the one no one has' : 'Allocate the ' + sd + ' no one has', ir: 'reparto'}) : '';
    }
  });
})();
