/* Veta demo · ronda 8 · pantallas · decidir.js · carril D
   El Inicio de dirección (PLAN_R8.md, 3.2 y D-1). Rellena el gancho VETA.inicioDe.direccion, que pinta js/pantallas/inicio.js
   bajo el saludo y la frase («6 cosas esperan tu decisión.»):
   1) «lo primero»: la primera cosa que espera decisión, con su botón negro «Ver y decidir»;
   2) la lista del resto, una fila con cara por cosa (la propuesta de trabajo lleva la cara de Veta). Aquí no hay pastillas:
      lo que pasa va en la segunda línea. La única roja, «Nadie la lleva», solo en «lo primero»;
   3) una lista corta: «Te toca a ti» y «Tus clientes» (lo tuyo: Montse también vende) y, si hoy has decidido algo, «Decidido hoy».
   La pantalla G20 (#/decidir) ya no existe: el núcleo lleva esa ruta a Inicio.
   El número sale de VETA.r7.cuentas().decidir (VETA.d1.esperan): el mismo de la frase y del punto de la barra. */
(function () {
  'use strict';
  const M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;

  // cómo se ve cada decisión. `primero`: lo que dice cuando es «lo primero» (ahí cabe la pastilla y lo que haría Veta)
  const DECISION = {
    'd-carmen': () => ({cara: 'carmen', nombre: 'Carmen López', pasa: 'Nadie la lleva · busca piso en Gràcia', primero: 'Yo se la daría a Laura', pastilla: 'Nadie la lleva'}),
    'd-regla': () => ({cara: 'veta', nombre: 'Informe del piso', pasa: X.laPropuso() ? 'Un trabajo nuevo · lo propone Laura' : 'Un trabajo nuevo para la oficina'}),
    'd-teresa': () => ({cara: 'teresa', nombre: 'Teresa Gil', pasa: 'De baja · 12 clientes esperan'}),
    'd-joan': () => ({cara: 'joan-serra', nombre: 'Joan Serra', pasa: 'Se queja: diez días sin noticias'})
  };
  // un contacto que no lleva nadie (Pau Ríos, Lucía Gómez) es una decisión más, como Carmen: su ficha es asunto/:id
  const CONTACTO = {
    'pau-rios': {pasa: 'Nadie lo lleva · busca un local', primero: 'Yo se lo daría a David', pastilla: 'Nadie lo lleva'},
    lucia: {pasa: 'Nadie la lleva · quiere vender', primero: 'Yo se la daría a Marc'}
  };
  const cosa = e => {
    if (e.tipo === 'contacto') return Object.assign({cara: e.x.id, nombre: e.x.nombre, pasa: 'Contacto nuevo', pastilla: 'Nadie la lleva', ir: 'asunto/' + e.x.id}, CONTACTO[e.x.id]);
    const c = e.c;
    return Object.assign({cara: 'veta', nombre: c.fila || c.titulo, pasa: c.filaSub, ir: X.rutaDe(c)}, DECISION[c.id] ? DECISION[c.id]() : {});
  };

  // lo decidido hoy: una fila al final que abre su hoja (d-decididas)
  const decididas = () => M.decisiones().filter(c => X.resuelta(c)).length;

  VETA.inicioDe.direccion = () => {
    const l = VETA.d1.esperan().map(cosa), c = r7.cuentas(), hechas = decididas();
    let h = '';
    if (l.length) {
      const p = l[0];
      h += r7.primero({cara: p.cara, nombre: p.nombre, pasa: p.primero || p.pasa, pastilla: p.pastilla, i: 1, boton: {texto: 'Ver y decidir', ir: p.ir}});
      if (l.length > 1) h += r7.lista(l.slice(1).map(f => ({cara: f.cara, nombre: f.nombre, pasa: f.pasa, ir: f.ir})), {i: 2});
    }
    h += r7.lista([
      {nombre: 'Te toca a ti', dato: c.hoy || null, ir: 'hoy'},
      {nombre: 'Tus clientes', dato: c.clientes || null, ir: 'clientes'},
      hechas ? {nombre: 'Decidido hoy', dato: hechas, hoja: 'd-decididas'} : null
    ], {i: 3});
    return {html: h};
  };
})();
