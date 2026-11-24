/* Veta demo · ronda 8 · pantallas · visitas.js · carril A
   A21 · Visitas · #/visitas (raíz). La de hoy, mientras le falte algo, es «lo primero»: su tarjeta con el botón de lo que toca
   («Abrir la visita», «Abrir el acta», «Abrir el informe»), como la primera tarjeta de Inicio. Debajo, «Con el acta enviada».
   Cada visita con su cara, cuándo y dónde. Sin pastillas. */
(function () {
  'use strict';
  const r7 = VETA.r7, A2 = () => VETA.a2;
  const fila = v => { const e = A2().estadoActa(v); return {cara: v.cliente, nombre: v.nombre, pasa: (v.hoy && e ? e : v.cuando) + ' · ' + v.fila, ir: 'visita/' + v.id}; };
  // lo que toca con la visita de hoy: contarla, enviar el acta o enviar el informe
  const toca = v => {
    const f = A2().est(v.id).contada ? A2().falta(v.id) : 'contar';
    return f === 'contar' ? {texto: 'Abrir la visita', ir: 'visita/' + v.id} : f === 'acta' ? {texto: 'Abrir el acta', ir: 'acta/' + v.id} : f === 'informe' ? {texto: 'Abrir el informe', ir: 'informe/' + v.id} : null;
  };

  VETA.pantalla('A21', {
    titulo: 'Visitas',
    pinta: () => {
      const l = A2().visitas(), hoy = l.filter(v => v.hoy && toca(v)), antes = l.filter(v => !hoy.includes(v));
      if (!l.length) return r7.vacio('Aún no tienes visitas.');
      return hoy.map((v, k) => { const b = toca(v); return r7.primero({i: k, cara: v.cliente, nombre: v.nombre, pasa: v.cuando + ' · ' + v.fila, boton: b, datos: {ir: 'visita/' + v.id}}); }).join('') +
        (antes.length ? r7.lista(antes.map(fila), {rotulo: 'Con el acta enviada', i: 1}) : '');
    }
  });
})();
