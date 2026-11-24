/* Veta demo · pantallas · entra.js · paquete D (Dirección)
   G9 · Lo que entra · #/entra — cuatro filas; cada una abre una hoja con su lista (d-entra). Principal: repartir los que nadie lleva (G5). */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir, D = VETA.datos;

  VETA.pantalla('G9', {
    titulo: 'Lo que entra',
    guia: ['Aquí Veta te enseña lo que llega a la oficina y nadie ha contestado.', 'Tú abres cada grupo y repartes lo que no tiene dueño.', 'Así ningún contacto nuevo se enfría esperando.'],
    frase: 'Gente que escribe a la oficina y nadie ha contestado. Toca un grupo y lo ves.',
    pinta: () => {
      // ronda 7 · D1: una lista (R2, R3); cada fila abre su hoja (d-entra)
      const sin = X.sinResponder().length;
      return VETA.r7.lista([
        {icono: 'entra', nombre: 'Sin contestar', pasa: 'Contactos nuevos que esperan', numero: sin, hoja: 'd-entra', datos: {lista: 'contactos'}},
        {icono: 'chat', nombre: 'Escriben dos veces', pasa: 'Y nadie les contesta', numero: D.entra.dosVeces.length, hoja: 'd-entra', datos: {lista: 'dos'}},
        {icono: 'pregunta', nombre: 'Piden lo que no tenéis', pasa: 'Lo apunto por si entra', numero: D.entra.noTenemos.length, hoja: 'd-entra', datos: {lista: 'no'}},
        {icono: 'rayo', nombre: 'Quieren lo que ya tenéis', pasa: 'Un piso que les encaja', numero: 1, hoja: 'd-entra', datos: {lista: 'si'}}
      ]);
    },
    botonFijo: () => {
      const sd = X.sinDueno().length;
      return sd ? VETA.r7.botones({texto: sd === 1 ? 'Repartir el que nadie lleva' : 'Repartir los ' + sd + ' que nadie lleva', ir: 'reparto'}) : '';
    }
  });
})();
