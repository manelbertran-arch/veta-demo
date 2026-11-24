/* Veta demo · ronda 8 · pantallas · visitas.js · carril A
   A21 · Visitas · #/visitas (raíz). Dos listas con rótulo: “Hoy” y “Con el acta enviada”. Cada visita con su cara, cuándo y dónde.
   Sin pastillas: la de hoy dice cómo está su acta (“Acta lista”, “Acta guardada”, “Acta enviada”) en la segunda línea. */
(function () {
  'use strict';
  const r7 = VETA.r7, A2 = () => VETA.a2;
  const fila = v => { const e = A2().estadoActa(v); return {cara: v.cliente, nombre: v.nombre, pasa: (v.hoy && e ? e : v.cuando) + ' · ' + v.fila, ir: 'visita/' + v.id}; };

  VETA.pantalla('A21', {
    titulo: 'Viewings',
    pinta: () => {
      const l = A2().visitas(), hoy = l.filter(v => v.hoy), antes = l.filter(v => !v.hoy);
      return (hoy.length ? r7.lista(hoy.map(fila), {rotulo: 'Today', i: 0}) : r7.sub('You have no viewings today.')) +
        (antes.length ? r7.lista(antes.map(fila), {rotulo: 'Notes sent', i: 1}) : '');
    }
  });
})();
