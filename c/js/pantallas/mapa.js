/* Veta demo · pantallas · mapa.js · carril C (Veta y cuenta)
   - A18m · Mi mapa de trabajo · #/mapa
   Tres plegables («+») con su cuenta en gris. Dentro, lo encontrado, una línea por cosa; cada una abre su hoja (h32) con las citas.
   Su contenido se usa también en el paso 3 del primer día (VETA.c.mapaHtml). */
(function () {
  'use strict';
  const esc = VETA.esc, C = VETA.c;

  const linea = f => `<button type="button" class="r7c-caso" data-hoja="h32" data-hallazgo="${esc(f.id)}"><span><b>${esc(f.titulo)}</b> · ${esc(f.sub)}</span>${VETA.ic('chev', 16)}</button>`;
  C.mapaHtml = desde => VETA.r7.lista(VETA.datos.c.mapa.map(b => ({nombre: b.titulo, dato: b.filas.length, abre: b.filas.map(linea).join('')})), {i: desde});
  C.hallazgo = id => { let x = null; VETA.datos.c.mapa.forEach(b => b.filas.forEach(f => { if (f.id === id) x = f; })); return x; };

  VETA.pantalla('A18m', {
    titulo: 'Mi mapa de trabajo',
    sub: 'Lo que encontré en seis meses de tus chats.',
    pinta: () => C.mapaHtml(1),
    botonFijo: () => VETA.r7.botones({texto: 'Empieza por los informes', ir: 'regla/r-valoraciones'})
  });
})();
