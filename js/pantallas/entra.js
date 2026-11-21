/* Veta demo · pantallas · entra.js · paquete D (Dirección)
   G9 · Lo que entra · #/entra — cuatro filas; cada una abre una hoja con su lista (d-entra). Principal: repartir los que nadie lleva (G5). */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir, D = VETA.datos;

  VETA.pantalla('G9', {
    titulo: 'Lo que entra',
    guia: ['Aquí Veta te enseña lo que llega a la oficina y nadie ha contestado.', 'Tú abres cada grupo y repartes lo que no tiene dueño.', 'Así ningún contacto nuevo se enfría esperando.'],
    pinta: () => {
      const sin = X.sinResponder().length, sd = X.sinDueno().length;
      return `<p class="intro" data-i="0">Lo que ha entrado por los canales de la oficina y sigue sin respuesta.</p>` +
        `<div class="d-entra" data-i="1">${[
          ['Contactos sin responder', sin, 'contactos', 'entra'],
          ['Escriben dos veces o más sin respuesta', D.entra.dosVeces.length, 'dos', 'chat'],
          ['Piden lo que no tenéis', D.entra.noTenemos.length, 'no', 'pregunta'],
          ['Quieren lo que ya tenéis', 1, 'si', 'rayo']
        ].map(([t, n, k, ic]) => `<button type="button" class="d-entra-c" data-hoja="d-entra" data-lista="${k}"><span class="d-entra-ic">${VETA.ic(ic, 22)}</span><b>${n}</b><span>${t}</span></button>`).join('')}</div>` +
        (sd ? '' : `<div data-i="2">${UI.lineaHecho({texto: 'Los contactos sin dueño ya tienen quien los lleve'})}</div>`);
    },
    botonFijo: () => {
      const sd = X.sinDueno().length;
      return sd ? UI.boton({texto: sd === 3 ? 'Repartir los 3 que nadie lleva' : sd === 1 ? 'Repartir el que nadie lleva' : 'Repartir los ' + sd + ' que nadie lleva', ir: 'reparto'}) : '';
    }
  });
})();
