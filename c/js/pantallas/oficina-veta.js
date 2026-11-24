/* Veta demo · pantallas · oficina-veta.js · carril C (Veta y cuenta)
   - G10 · Cómo trabajamos · #/oficina/practicas   (la abre también la agente, desde «Lo he aprendido de ti»)
   - G11 · Lo que aprende la oficina · #/oficina/aprende
   - G12 · Lo que Veta aún no hace · #/oficina/falta
   - G13 · Un caso para aprender · #/oficina/caso/<id>
   - G14 · Lo que sabe tu oficina · #/oficina/sabe   (también la agente) */
(function () {
  'use strict';
  const UI = VETA.UI, C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;

  // prácticas con su estado (h23 las cambia en dirección)
  C.practicas = () => D().practicas.concat(C.lee('practicaClaudia', false) ? [D().practicaClaudia] : []).map(x => {
    const e = C.lee('practica', {})[x.id];
    return e ? Object.assign({}, x, e) : x;
  });
  // el estado, en texto: cómo va y quién la usa o quién la propuso
  const estado = x => (x.estado === 'a-prueba' ? x.estadoTexto : x.estado === 'en-marcha' ? `En marcha · ${x.usan}` : `Propuesta · ${x.propuso}`);

  // ---- G10 · Cómo trabajamos ----
  VETA.pantalla('G10', {
    titulo: 'Cómo trabajamos',
    sub: 'Lo que la oficina hace igual, o está probando.',
    pinta: () => R7().lista(C.practicas().map(x => ({nombre: x.corto || x.titulo, pasa: estado(x), hoja: 'h23', datos: {practica: x.id}})), {i: 1})
  });

  // ---- G11 · Lo que aprende la oficina ----
  VETA.pantalla('G11', {
    titulo: 'Lo que aprende la oficina',
    sub: () => `${D().paradas.reduce((s, x) => s + x[1], 0)} operaciones paradas ahora, por fase.`,
    pinta: () => R7().barras(D().paradas.map(([f, n]) => ({valor: n, fecha: f})), {etiqueta: 'Operaciones paradas ahora, por fase', i: 1}) +
      R7().lista([
        {nombre: 'Lo que sabe tu oficina', ir: 'oficina/sabe'},
        {nombre: 'Qué se ha propuesto', dato: C.practicas().length, ir: 'oficina/practicas'},
        {nombre: 'Casos para aprender', dato: 1, ir: 'oficina/caso/claudia'},
        {nombre: 'Cómo aprende Veta', hoja: 'c-lee', datos: {que: 'aprende'}}
      ], {i: 2})
  });

  // ---- G12 · Lo que Veta aún no hace ----
  VETA.pantalla('G12', {
    titulo: 'Lo que Veta aún no hace',
    sub: 'A mano, 43 veces en seis meses.',
    pinta: () => R7().lista(D().falta.map(([t, n]) => ({nombre: t, dato: n})), {i: 1}),
    botonFijo: () => R7().botones({texto: 'Enséñame el primero', ir: 'dictar/orden'})
  });

  // ---- G13 · Un caso para aprender ----
  VETA.pantalla('G13', {
    titulo: 'Un caso para aprender',
    sub: 'Clàudia Ribas · operación caída · compra de un piso en Sants',
    pinta: () => {
      const hecha = C.lee('practicaClaudia', false);
      return (hecha ? UI.lineaHecho({texto: 'Propuesta creada: llamar en 48 horas a quien pide una visita', hora: hecha, ir: 'oficina/practicas', boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-caso', i: 0}) : '') +
        R7().lista(VETA.datos.casoClaudia.map(x => ({nombre: x.cuando, pasa: x.texto})), {rotulo: 'Qué pasó', i: 1}) +
        R7().tarjeta({veta: true, de: 'Lo que enseña', texto: 'Quien pide ver un piso y no recibe una llamada en 48 horas, se va.', i: 2});
    },
    botonFijo: () => (C.lee('practicaClaudia', false) ? '' : R7().botones({texto: 'Sacar una práctica', accion: 'saca'})),
    acciones: {
      saca() { C.pon('practicaClaudia', VETA.ahora()); VETA.repinta({hecho: 'c-caso'}); },
      deshacer() { C.pon('practicaClaudia', false); VETA.repinta({hecho: 'c-caso'}); }
    }
  });

  // ---- G14 · Lo que sabe tu oficina ----
  VETA.pantalla('G14', {
    titulo: 'Lo que sabe tu oficina',
    sub: 'Son cuentas de los chats de la oficina, sin nombres.',
    pinta: () => R7().cifra({valor: 212, frase: 'de 301 contactos acabaron en visita, desde que empezamos.', i: 1}) +
      R7().lista(D().sabe.map(([t, a, b]) => ({nombre: `${a} de ${b} veces`, pasa: t})), {i: 2})
  });
})();
