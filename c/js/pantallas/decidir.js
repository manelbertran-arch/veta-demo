/* Veta demo · ronda 8 · pantallas · decidir.js · carril D
   El Inicio de dirección (PLAN_R8.md, 3.2 y D-1). Rellena el gancho VETA.inicioDe.direccion, que pinta js/pantallas/inicio.js
   bajo el saludo y la frase («6 cosas esperan tu decisión.»):
   1) «lo primero»: la primera cosa que espera decisión, con su botón negro «Ver y decidir»;
   2) la lista del resto, una fila con cara por cosa (la propuesta de trabajo lleva la cara de Veta). Aquí no hay pastillas:
      lo que pasa va en la segunda línea. La única roja, «Nadie la lleva», solo en «lo primero»;
   3) si hoy has decidido algo, la fila «Decidido hoy»; y la lista «Lo tuyo»: «Te toca a ti» y «Tus clientes» (Montse también vende).
   Al volver de decidir, la fila resuelta se va (opacidad y alto, 200 ms) y las demás suben.
   La pantalla G20 (#/decidir) ya no existe: el núcleo lleva esa ruta a Inicio.
   El número sale de VETA.r7.cuentas().decidir (VETA.d1.esperan): el mismo de la frase y del punto de la barra. */
(function () {
  'use strict';
  const M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;

  // cómo se ve cada decisión. `primero`: lo que dice cuando es «lo primero» (ahí cabe la pastilla y lo que haría Veta)
  const DECISION = {
    'd-carmen': () => ({cara: 'carmen', nombre: 'Carmen López', pasa: 'Nadie la lleva · busca piso en Gràcia', primero: 'Yo se la daría a Laura', pastilla: 'Nadie la lleva'}),
    'd-regla': () => ({cara: 'veta', nombre: 'Informe del piso', pasa: X.laPropuso() ? 'Un trabajo nuevo · lo propone Laura' : 'Un trabajo nuevo para la oficina'}),
    'd-teresa': () => ({cara: 'teresa', nombre: 'Teresa Gil', pasa: 'De baja · sus clientes esperan'}),
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

  // lo decidido hoy: una fila que abre su hoja (d-decididas). Cuentan las decisiones y los contactos ya repartidos o aparcados:
  // cada línea lleva a su ficha, que es donde se deshace
  const lineaDe = c => {
    const l = (c.extra && c.extra.linea) || (c.lineas && c.lineas[c.estado]) || (c.lineas && c.lineas.hecha) || c.titulo;
    return c.id === 'd-regla' && c.extra && c.extra.linea ? 'Informe del piso · ' + l.charAt(0).toLowerCase() + l.slice(1) : l;   // en su pantalla el nombre ya está en la cabecera; aquí hay que decirlo
  };
  VETA.d1.decididas = () => M.decisiones().filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden).map(c => ({linea: lineaDe(c), hora: c.hora, ir: X.rutaDe(c)}))
    .concat((VETA.datos.contactos || []).filter(c => c.id !== 'carmen').map(c => { const r = X.asignado(c.id) || X.aparcado(c.id); return r ? {linea: r.linea, hora: r.hora, ir: 'asunto/' + c.id} : null; }).filter(Boolean));
  const decididas = () => VETA.d1.decididas().length;

  // tras decidir, el botón del pie lleva a lo siguiente que espera (o a Inicio): VETA.r7.sigue(VETA.d1.siguiente())
  // `reemplaza`: «volver» sigue llevando a donde se empezó, no a la decisión anterior
  VETA.d1.siguiente = () => { const l = VETA.d1.esperan().map(cosa); return l.length ? {texto: 'Siguiente: ' + l[0].nombre, accion: 'd-sigue', datos: {ruta: l[0].ir}} : {}; };
  VETA.d1.sigue = (ev, el) => VETA.ir(el.dataset.ruta, {reemplaza: true});

  // la fila resuelta se va (6.6): Inicio recuerda lo que enseñó la última vez; si al volver falta algo, lo pinta una vez más
  // en su sitio y lo deja irse (VETA.mov.seVa). Con «Reducir movimiento» se pinta ya sin ello.
  let ultima = null, yendo = false;
  const clave = f => f.ir;
  const pintaLista = l => {
    let h = '';
    if (l.length) {
      const p = l[0];
      h += r7.primero({cara: p.cara, nombre: p.nombre, pasa: p.primero || p.pasa, pastilla: p.pastilla, i: 1, clase: p.seVa ? 'd-seva' : '', boton: {texto: 'Ver y decidir', ir: p.ir}});
      if (l.length > 1) h += r7.lista(l.slice(1).map(f => ({cara: f.cara, nombre: f.nombre, pasa: f.pasa, ir: f.ir, clase: f.seVa ? 'd-seva' : ''})), {i: 2});
    }
    return h;
  };

  VETA.inicioDe.direccion = () => {
    const l = VETA.d1.esperan().map(cosa), c = r7.cuentas(), hechas = decididas();
    const idas = ultima && !VETA.reducido() ? ultima.filter(f => !l.some(g => clave(g) === clave(f))) : [];
    // mientras se va: la lista de antes, con lo resuelto marcado; lo nuevo (algo deshecho) entra al repintar
    const ver = idas.length ? ultima.map(f => l.find(g => clave(g) === clave(f)) || Object.assign({}, f, {seVa: true})) : l;
    if (!idas.length) ultima = l;
    // con cero cosas, una frase sola en mitad de la pantalla y la de arriba dice otra cosa (para no decir lo mismo dos veces)
    let h = ver.length ? pintaLista(ver) : r7.vacio({texto: 'Hoy ya no queda nada por decidir.', i: 1});
    if (hechas) h += r7.lista([{nombre: 'Decidido hoy', dato: hechas, hoja: 'd-decididas'}], {i: 3});
    // lo suyo como agente (Montse también vende), con su rótulo: sin él no se sabe que esas dos filas son otra cosa
    // «Confirmar las visitas»: el trabajo que te propongo a ti, directo desde aquí (antes se llegaba a cuatro toques, por el informe del piso)
    // y lo mismo con el informe del piso al valorar mientras siga siendo propuesta (hasta dos trabajos: es lo tuyo, no un listado)
    // los trabajos de la OFICINA (VETA.d1.trabajos): dirección no usa las reglas de una agente
    const trab = VETA.d1.trabajos ? VETA.d1.trabajos() : [];
    const props = trab.filter(x => x.estado === 'propuesta').slice(0, 2);
    // «Lo que Veta hace por ti» es fija: lo que aceptas desde un atajo (y deja de ser propuesta) sigue ahí, en «Ya lo hago yo»
    const mios = trab.filter(x => ['propuesta', 'a-prueba', 'en-marcha'].includes(x.estado)).length;
    h += r7.lista([
      {nombre: 'Te toca a ti', dato: c.hoy || null, ir: 'hoy'},
      {nombre: 'Tus clientes', dato: c.clientes || null, ir: 'clientes'},
      {nombre: 'Lo que Veta hace por ti', dato: mios || null, ir: 'veta/mia'}
    ].concat(props.map(x => ({nombre: x.nombre, pasa: 'Te lo propongo', ir: x.ir}))), {rotulo: 'Lo tuyo', i: 3});
    return {html: h, frase: ver.length ? undefined : 'Todo decidido. Mañana a las 8:00, lista nueva.', alMontar: el => {
      if (!idas.length || yendo) return;
      const els = [...el.querySelectorAll('.d-seva')];
      yendo = true;
      Promise.all(els.map(x => VETA.mov.seVa(x))).then(() => { yendo = false; ultima = null; VETA.repinta(); });
    }};
  };
})();
