/* Veta demo · pantallas · entra.js · paquete D (Dirección)
   G9 · Lo que entra · #/entra — cuatro filas; cada una abre una hoja con su lista (d-entra). Principal: repartir los que nadie lleva (G5). */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir, D = VETA.datos;

  VETA.pantalla('G9', {
    titulo: 'What\'s coming in',
    guia: ['Here Veta shows you what reaches the office and nobody has replied to.', 'You open each group and allocate what has no owner.', 'That way no new contact goes cold waiting.'],
    frase: 'People who write to the office and no one has replied. Tap a group to see them.',
    pinta: () => {
      // ronda 7 · D1: una lista (R2, R3); cada fila abre su hoja (d-entra)
      const sin = X.sinResponder().length;
      return VETA.r7.lista([
        {icono: 'entra', nombre: 'No reply yet', pasa: 'New contacts waiting', numero: sin, hoja: 'd-entra', datos: {lista: 'contactos'}},
        {icono: 'chat', nombre: 'They write twice', pasa: 'And no one replies to them', numero: D.entra.dosVeces.length, hoja: 'd-entra', datos: {lista: 'dos'}},
        {icono: 'pregunta', nombre: 'Ask for what you lack', pasa: 'I note it down in case it comes in', numero: D.entra.noTenemos.length, hoja: 'd-entra', datos: {lista: 'no'}},
        {icono: 'rayo', nombre: 'Want what you have', pasa: 'A flat that suits them', numero: 1, hoja: 'd-entra', datos: {lista: 'si'}}
      ]);
    },
    botonFijo: () => {
      const sd = X.sinDueno().length;
      return sd ? VETA.r7.botones({texto: sd === 1 ? 'Allocate the one nobody handles' : 'Allocate the ' + sd + ' nobody handles', ir: 'reparto'}) : '';
    }
  });
})();
