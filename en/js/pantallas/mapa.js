/* Veta demo · pantallas · mapa.js · paquete C (Veta, cuenta y entrada)
   - A18m · Mi mapa de trabajo · #/mapa
   Su contenido se usa también en el paso 3 del primer día (VETA.c.mapaHtml). Cada fila abre H32. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;

  C.mapaHtml = desde => `<p class="intro" data-i="${desde}">From 23 May to 23 November.</p>` +
    VETA.datos.c.mapa.map((b, k) => UI.bloque({titulo: `${b.titulo} · ${b.filas.length}`, i: Math.min(4, desde + 1 + k),
      html: UI.lista(b.filas.map(f => ({titulo: f.titulo, sub: f.sub, hoja: 'h32', datos: {hallazgo: f.id}})))})).join('') +
    `<p class="c-pista" data-i="4">${VETA.ic('estrella', 18)}<span>Start with the dossiers: 14 cases in six months.</span></p>`;
  C.hallazgo = id => { let x = null; VETA.datos.c.mapa.forEach(b => b.filas.forEach(f => { if (f.id === id) x = f; })); return x; };

  VETA.pantalla('A18m', {
    titulo: 'My work map',
    guia: ['Here you see what Veta found in six months of your chats.', 'You tap each row to see which messages it comes from.', 'That way you know where to start: what repeats the most.'],
    pinta: () => C.mapaHtml(0),
    botonFijo: () => UI.boton({texto: 'See the 14 cases', ir: 'regla/r-valoraciones'})
  });
  void esc;
})();
