/* Veta demo · pantallas · reglas.js · carril C (Veta y cuenta)
   - A9b · La semana pasada · #/reglas/semana-pasada
   «Ya lo hago yo» (A9, #/reglas) se fundió con la raíz Veta (js/pantallas/veta.js): el núcleo lleva #/reglas a #/veta. */
(function () {
  'use strict';
  const C = VETA.c, R = VETA.r7;

  // La pregunta va escrita (D11b): el subtítulo la hace y el pie la contesta con un sí o un no. Al decir que sí, un solo final:
  // la fila de hecho con «Deshacer» y «Ir a Inicio». «No del todo» lleva a decírselo a Veta, con la semana como caso.
  const hecha = () => C.lee('semanaConfirmada', null);
  VETA.pantalla('A9b', {
    titulo: 'La semana pasada',
    sub: () => 'Del 16 al 22 de noviembre.' + (hecha() ? '' : ' ¿Lo hice bien?'),
    nota: () => ({texto: 'Todo salió desde tu WhatsApp.', candado: true}),
    casoDictado: () => ({de: 'semana-pasada', titulo: 'La semana pasada', texto: 'Lo que hice del 16 al 22 de noviembre'}),
    pinta: () => (hecha() ? R.hecho({texto: 'Me dijiste que está bien', hora: hecha(), deshacer: 'deshacer'}) : '') +
      R.lista(VETA.datos.c.semanaPasada.map(f => ({nombre: f.titulo, dato: f.derecha})), {i: 1}),
    botonFijo: () => (hecha() ? R.sigue() : R.botones({texto: 'Sí, está bien', accion: 'confirmar'}, {texto: 'No del todo', accion: 'no'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); },
      no() { VETA.dictar('orden'); }
    }
  });
})();
