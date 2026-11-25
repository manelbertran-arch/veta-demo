/* Veta demo · pantallas · oficina-veta.js · carril C (Veta y cuenta)
   - G10 · Cómo trabajamos · #/oficina/practicas   (la abre también la agente, desde “Lo he aprendido de ti”)
   - G11 · Lo que aprende la oficina · #/oficina/aprende
   - G12 · Lo que Veta aún no hace · #/oficina/falta
   - G13 · Un caso para aprender · #/oficina/caso/<id>
   - G14 · Lo que sabe tu oficina · #/oficina/sabe   (también la agente) */
(function () {
  'use strict';
  const C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;

  // prácticas con su estado. Las tres que son un trabajo de la oficina (dossier, mismo-dia, actas) lo cambian en su pantalla, que solo abre
  // dirección (#/regla-oficina/<id>): aquí se lee de allí, para que la fila y la pantalla digan lo mismo. Las demás (la que sale de un caso)
  // lo cambian en la hoja h23.
  const FASE = {'a-prueba': {estado: 'a-prueba', estadoTexto: 'We are trying it · day 1 of 14', usan: 'on trial with the whole team'},
    'en-marcha': {estado: 'en-marcha', estadoTexto: 'In use', usan: 'used by the whole team'}};
  const faseOf = id => { try { return VETA.d1 && VETA.d1.faseRegla ? VETA.d1.faseRegla(id) : null; } catch (e) { return null; } };
  C.conPantalla = id => !!faseOf(id);
  C.practicas = () => D().practicas.concat(C.lee('practicaClaudia', false) ? [D().practicaClaudia] : []).map(x => {
    const f = faseOf(x.id), e = f ? (!f.inicial && FASE[f.f]) : C.lee('practica', {})[x.id];
    return e ? Object.assign({}, x, e) : x;
  });
  // el estado, en texto: cómo va y quién la usa o quién la propuso
  const estado = x => (x.estado === 'a-prueba' ? x.estadoTexto : x.estado === 'en-marcha' ? `In use · ${x.usan}` : `Proposed · ${x.propuso}`);

  // ---- G10 · Cómo trabajamos ----
  VETA.pantalla('G10', {
    titulo: 'How we work',
    sub: 'What the office does the same way, or is trying.',
    // dirección abre el trabajo entero (ahí lo prueba, lo extiende o lo quita); la agente, la hoja que se lo cuenta
    pinta: () => { const dir = VETA.yo().papel === 'direccion'; return R7().lista(C.practicas().map(x => Object.assign({nombre: x.corto || x.titulo, pasa: estado(x)},
      dir && C.conPantalla(x.id) ? {ir: 'regla-oficina/' + x.id} : {hoja: 'h23', datos: {practica: x.id}})), {i: 1}); }
  });

  // ---- G11 · Lo que aprende la oficina ----
  VETA.pantalla('G11', {
    titulo: 'What the office learns',
    sub: () => `${D().paradas.reduce((s, x) => s + x[1], 0)} deals stalled now, by stage.`,
    pinta: () => R7().barras(D().paradas.map(([f, n]) => ({valor: n, fecha: f})), {etiqueta: 'Deals stalled now, by stage', serie: false, i: 1}) +
      R7().lista([
        {nombre: 'What your office knows', ir: 'oficina/sabe'},
        {nombre: 'What was suggested', dato: C.practicas().length, ir: 'oficina/practicas'},
        {nombre: 'Cases to learn from', dato: 1, ir: 'oficina/caso/claudia'},
        {nombre: 'How Veta learns', hoja: 'c-lee', datos: {que: 'aprende'}}
      ], {i: 2})
  });

  // ---- G12 · Lo que Veta aún no hace ----
  VETA.pantalla('G12', {
    titulo: 'What Veta doesn\'t do yet',
    sub: 'By hand, 43 times in six months.',
    pinta: () => R7().lista(D().falta.map(([t, n]) => ({nombre: t, dato: n})), {i: 1}),
    botonFijo: () => R7().botones({texto: 'Show me the first one', ir: 'dictar/orden'})
  });

  // ---- G13 · Un caso para aprender ----
  VETA.pantalla('G13', {
    titulo: 'A case to learn from',
    sub: 'Clàudia Ribas · deal fell through · buying a flat in Sants',
    pinta: () => {
      const hecha = C.lee('practicaClaudia', false);
      return (hecha ? R7().hecho({texto: 'Proposal created: call within 48 hours', hora: hecha, ir: 'oficina/practicas', deshacer: 'deshacer', vt: 'c-caso'}) : '') +
        R7().lista(VETA.datos.casoClaudia.map(x => ({nombre: x.cuando, pasa: x.texto})), {rotulo: 'What happened', i: 1}) +
        R7().tarjeta({veta: true, de: 'What it teaches', texto: 'Whoever asks to see a flat and doesn\'t get a call within 48 hours leaves.', i: 2});
    },
    botonFijo: () => (C.lee('practicaClaudia', false) ? R7().sigue() : R7().botones({texto: 'Draw a practice', accion: 'saca'})),
    acciones: {
      saca() { C.pon('practicaClaudia', VETA.ahora()); VETA.repinta({hecho: 'c-caso'}); },
      deshacer() { C.pon('practicaClaudia', false); VETA.repinta({hecho: 'c-caso'}); }
    }
  });

  // ---- G14 · Lo que sabe tu oficina ----
  VETA.pantalla('G14', {
    titulo: 'What your office knows',
    sub: 'Counts from the office\'s chats, with no names.',
    pinta: () => R7().cifra({valor: 212, frase: 'of 301 contacts ended in a viewing, since we started.', i: 1}) +
      R7().lista(D().sabe.map(([t, a, b]) => ({nombre: `${a} of ${b} times`, pasa: t})), {i: 2})
  });
})();
