/* Veta demo · ronda 7 · pantallas · visitas.js · A2
   A21 · Visitas · #/visitas. Una lista y nada más: las visitas que se quedaron por WhatsApp (la de hoy y las pasadas),
   cada una con su cara, cuándo y dónde, y una pastilla que dice cómo está su acta.
   La frase lleva el número de la caja (cuentas().visitas): las de hoy. Las pasadas ya tienen su acta enviada. */
(function () {
  'use strict';
  const r7 = VETA.r7, A2 = () => VETA.a2;

  VETA.pantalla('A21', {
    titulo: 'Viewings',
    frase: () => {
      const n = r7.cuentas().visitas, hoy = A2().visitas().filter(v => v.hoy), listas = hoy.length && hoy.every(v => A2().est(v.id).contada && !A2().falta(v.id));
      if (n && listas) return `Today you had ${n} ${n === 1 ? 'viewing' : 'viewings'}. Now ${n === 1 ? 'it has' : 'they have'} notes and a report. Here they all are.`;
      return (n === 0 ? 'You have no viewings today.' : `Today you have ${n} ${n === 1 ? 'viewing' : 'viewings'}.`) + ' When you come out, you tell me how it went and I leave the notes and the report ready for you.';
    },
    pinta: () => r7.lista(A2().visitas().map(v => {
      const e = A2().pastilla(v);
      return {cara: v.cliente, nombre: v.nombre, pasa: v.cuando + ' · ' + v.fila, pastilla: e.texto, tono: e.tono, ir: 'visita/' + v.id};
    }))
  });
})();
