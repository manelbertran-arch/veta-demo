/* Veta demo · ronda 8 · pantallas · oficina.js · carril D
   G21 · Veta (de la oficina) · #/oficina — raíz de la pestaña «Veta» de dirección. Cuatro filas de una línea y un botón:
   La semana pasada (con su 156 en gris) · Lo que ya hago · Lo que aprende la oficina · Antes y ahora; y «Me lo has enseñado tú»
   cuando dirección le ha enseñado algo (abre la hoja d-ensenado). Pie: «Enséñale a Veta» (el dictado).
   Pantallas de C: oficina/aprende y lo que cuelga de ella. */
(function () {
  'use strict';
  const r7 = VETA.r7;
  const ensenado = () => (VETA.r7e && VETA.r7e.aprendidos ? VETA.r7e.aprendidos('direccion') : []);
  VETA.d1.ensenado = ensenado;   // lo lee la hoja d-ensenado

  VETA.pantalla('G21', {
    titulo: 'Veta',
    pinta: () => {
      const n = ensenado().length;
      return r7.lista([
        {nombre: 'La semana pasada', dato: r7.cuentas().oficina, ir: 'semana-equipo'},
        {nombre: 'Lo que ya hago', ir: 'oficina-que-hace'},
        {nombre: 'Lo que aprende la oficina', ir: 'oficina/aprende'},
        {nombre: 'Antes y ahora', ir: 'oficina-antes-ahora'},
        n ? {nombre: 'Me lo has enseñado tú', dato: n, hoja: 'd-ensenado'} : null
      ], {i: 0});
    },
    // el mismo botón que en la raíz Veta de la agente: con su micro y a enseñar (dictar/orden); «¿Qué me cuentas?» ya es el micro de la barra
    botonFijo: () => r7.botones({texto: 'Enséñale a Veta', icono: 'mic', ir: 'dictar/orden'})
  });
})();
