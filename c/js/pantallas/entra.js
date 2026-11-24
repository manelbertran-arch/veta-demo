/* Veta demo · ronda 8 · pantallas · entra.js · carril D
   G9 · Lo que entra · #/entra — cuatro filas; cada una abre una hoja con su lista (d-entra). Botón: repartir los que nadie lleva (abre el primero, G2; al decidir, «Siguiente» lleva al otro). */
(function () {
  'use strict';
  const X = VETA.dir, D = VETA.datos, r7 = VETA.r7;

  VETA.pantalla('G9', {
    titulo: 'Lo que entra',
    pinta: () => r7.lista([
      {nombre: 'Sin contestar', pasa: 'Contactos nuevos que esperan', dato: X.sinResponder().length, hoja: 'd-entra', datos: {lista: 'contactos'}},
      {nombre: 'Escriben dos veces', pasa: 'Y nadie les contesta', dato: D.entra.dosVeces.length, hoja: 'd-entra', datos: {lista: 'dos'}},
      {nombre: 'Piden lo que no tenéis', pasa: 'Lo apunto por si entra', dato: D.entra.noTenemos.length, hoja: 'd-entra', datos: {lista: 'no'}},
      {nombre: 'Quieren lo que ya tenéis', pasa: 'Un piso que les encaja', dato: 1, hoja: 'd-entra', datos: {lista: 'si'}}
    ], {i: 0}),
    botonFijo: () => {
      // cada contacto que nadie lleva es una decisión: empieza por el primero y, al decidir, su botón lleva al siguiente
      const l = X.sinDueno(), sd = l.length;
      return sd ? r7.botones({texto: sd === 1 ? 'Repartir el que nadie lleva' : 'Repartir los ' + sd + ' que nadie lleva', ir: 'asunto/' + l[0].id}) : '';
    }
  });
})();
