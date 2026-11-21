/* Veta demo · pantallas · entra.js · paquete D (Dirección)
   G9 · Lo que entra · #/entra — cuatro filas; cada una abre una hoja con su lista (d-entra). Principal: repartir los que nadie lleva (G5). */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir, D = VETA.datos;

  VETA.pantalla('G9', {
    titulo: 'What\'s coming in',
    guia: ['Here Veta shows you what reaches the office and nobody has replied to.', 'You open each group and allocate what has no owner.', 'That way no new contact goes cold waiting.'],
    pinta: () => {
      const sin = X.sinResponder().length, sd = X.sinDueno().length;
      return `` +
        `<div class="d-entra" data-i="1">${[
          ['Contacts without a reply', sin, 'contactos', 'entra'],
          ['Write twice or more without a reply', D.entra.dosVeces.length, 'dos', 'chat'],
          ['Asked for what you don\'t have', D.entra.noTenemos.length, 'no', 'pregunta'],
          ['Want what you already have', 1, 'si', 'rayo']
        ].map(([t, n, k, ic]) => `<button type="button" class="d-entra-c" data-hoja="d-entra" data-lista="${k}"><span class="d-entra-ic">${VETA.ic(ic, 22)}</span><b>${n}</b><span>${t}</span></button>`).join('')}</div>` +
        (sd ? '' : `<div data-i="2">${UI.lineaHecho({texto: 'The unowned contacts now have someone handling them'})}</div>`);
    },
    botonFijo: () => {
      const sd = X.sinDueno().length;
      return sd ? UI.boton({texto: sd === 3 ? 'Allocate the 3 nobody handles' : sd === 1 ? 'Allocate the one nobody handles' : 'Allocate the ' + sd + ' nobody handles', ir: 'reparto'}) : '';
    }
  });
})();
