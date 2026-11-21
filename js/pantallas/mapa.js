/* Veta demo · pantallas · mapa.js · paquete C (Veta, cuenta y entrada)
   - A18m · Mi mapa de trabajo · #/mapa
   Su contenido se usa también en el paso 3 del primer día (VETA.c.mapaHtml). Cada fila abre H32. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;

  C.mapaHtml = desde => `<p class="intro" data-i="${desde}">Del 23 de mayo al 23 de noviembre.</p>` +
    VETA.datos.c.mapa.map((b, k) => UI.bloque({titulo: `${b.titulo} · ${b.filas.length}`, i: Math.min(4, desde + 1 + k),
      html: UI.lista(b.filas.map(f => ({titulo: f.titulo, sub: f.sub, hoja: 'h32', datos: {hallazgo: f.id}})))})).join('') +
    `<p class="c-pista" data-i="4">${VETA.ic('estrella', 18)}<span>Empieza por los informes del piso: 14 casos en seis meses.</span></p>`;
  C.hallazgo = id => { let x = null; VETA.datos.c.mapa.forEach(b => b.filas.forEach(f => { if (f.id === id) x = f; })); return x; };

  VETA.pantalla('A18m', {
    titulo: 'Mi mapa de trabajo',
    guia: ['Aquí ves lo que Veta encontró en seis meses de tus chats.', 'Tú tocas cada fila para ver de qué mensajes sale.', 'Así sabes por dónde empezar: lo que más se repite.'],
    pinta: () => C.mapaHtml(0),
    botonFijo: () => UI.boton({texto: 'Ver los 14 casos', ir: 'regla/r-valoraciones'})
  });
  void esc;
})();
