/* Veta demo · pantallas · reglas.js · carril C (Veta y cuenta)
   - A9b · La semana pasada · #/reglas/semana-pasada
   “Ya lo hago yo” (A9, #/reglas) se fundió con la raíz Veta (js/pantallas/veta.js): el núcleo lleva #/reglas a #/veta. */
(function () {
  'use strict';
  const UI = VETA.UI, C = VETA.c;

  VETA.pantalla('A9b', {
    titulo: 'Last week',
    sub: '16 to 22 November.',
    nota: () => ({texto: 'It all went out from your WhatsApp.', candado: true}),
    pinta: () => {
      const hecha = C.lee('semanaConfirmada', null);
      return (hecha ? UI.lineaHecho({texto: 'You told me it is right', hora: hecha, boton: {texto: 'Undo', accion: 'deshacer'}, i: 0}) : '') +
        VETA.r7.lista(VETA.datos.c.semanaPasada.map(f => ({nombre: f.titulo, dato: f.derecha})), {i: 1});
    },
    botonFijo: () => (C.lee('semanaConfirmada', null) ? '' : VETA.r7.botones({texto: 'Yes, it is right', accion: 'confirmar'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); }
    }
  });
})();
