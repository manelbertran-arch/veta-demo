/* Veta demo · ronda 8 · pantallas · oficina.js · carril D
   G21 · Veta (de la oficina) · #/oficina — raíz de la pestaña «Veta» de dirección. Enseña trabajo, no un menú (D7):
   1) la cifra de la semana (156) con su frase;
   2) «lo primero»: el trabajo que Veta propone y espera decisión («Informe del piso»), con su botón;
   3) «Trabajos de la oficina»: los que ya están a prueba o en marcha, cada uno con cómo va (antes quedaban a cuatro toques);
   4) lo demás, en filas de una línea: La semana pasada · Lo que ya hago · Lo que aprende la oficina · Antes y ahora; y
      «Me lo has enseñado tú» cuando dirección le ha enseñado algo (abre la hoja d-ensenado).
   Sin botón en el pie: para enseñarle algo está el micro de la barra.
   Pantallas de C: oficina/aprende y lo que cuelga de ella. */
(function () {
  'use strict';
  const r7 = VETA.r7, X = VETA.dir;
  const ensenado = () => (VETA.r7e && VETA.r7e.aprendidos ? VETA.r7e.aprendidos('direccion') : []);
  VETA.d1.ensenado = ensenado;   // lo lee la hoja d-ensenado

  // cómo va cada trabajo, en una línea. El estado se lee de su pantalla (VETA.d1.faseRegla): la fila y la pantalla dicen lo mismo
  const comoVa = (r, e, id) => {
    if (e.f === 'a-prueba') return `A prueba · día ${r.dia || 1} de 14`;
    if (e.f === 'en-marcha') return VETA.d1.subidaRegla && VETA.d1.subidaRegla(id) ? 'En marcha · lo hago yo y os lo cuento' : e.propio ? 'En marcha · la usa todo el equipo' : `En marcha · la usan ${r.usan || '4 de 6'}`;
    return e.f === 'descartada' ? 'Descartado' : 'Para luego';
  };

  VETA.pantalla('G21', {
    titulo: 'Veta',
    pinta: () => {
      const n = ensenado().length, R = VETA.datos.reglasOficina || {};
      const fases = Object.keys(R).map(id => ({id, r: R[id], e: VETA.d1.faseRegla(id)}));
      const propuesta = fases.find(x => x.e.f === 'propuesta'), resto = fases.filter(x => x.e.f !== 'propuesta');
      return r7.cifra({valor: r7.cuentas().oficina, frase: 'cosas que os dejé listas la semana pasada.', i: 0}) +
        (propuesta ? r7.primero({cara: 'veta', nombre: propuesta.r.corto || propuesta.r.titulo, i: 1,
          pasa: X.laPropuso() ? 'Un trabajo nuevo · lo propone Laura' : 'Un trabajo nuevo para la oficina',
          boton: {texto: 'Verlo', ir: 'regla-oficina/' + propuesta.id}}) : '') +
        (resto.length ? r7.lista(resto.map(x => ({nombre: x.r.corto || x.r.titulo, pasa: comoVa(x.r, x.e, x.id), ir: 'regla-oficina/' + x.id})), {rotulo: 'Trabajos de la oficina', i: 2}) : '') +
        r7.lista([
          {nombre: 'La semana pasada', ir: 'semana-equipo'},
          {nombre: 'Lo que ya hago', ir: 'oficina-que-hace'},
          {nombre: 'Lo que aprende la oficina', ir: 'oficina/aprende'},
          {nombre: 'Antes y ahora', ir: 'oficina-antes-ahora'},
          n ? {nombre: 'Me lo has enseñado tú', dato: n, hoja: 'd-ensenado'} : null
        ], {i: 3});
    }
  });
})();
