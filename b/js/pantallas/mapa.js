/* Veta demo · pantallas · mapa.js · paquete C (Veta, cuenta y entrada)
   - A18m · Mi mapa de trabajo · #/mapa
   Su contenido se usa también en el paso 3 del primer día (VETA.c.mapaHtml). Cada fila abre H32. */
(function () {
  'use strict';
  const esc = VETA.esc, C = VETA.c;

  // ronda 7: un grupo por fila, con su número; al tocarlo se abre con lo encontrado (cada cosa abre H32)
  const ICONO = ['ojo', 'cal', 'check', 'aviso'];
  C.mapaHtml = desde => VETA.r7.lista(VETA.datos.c.mapa.map((b, k) => ({icono: ICONO[k] || 'punto', nombre: b.titulo, numero: b.filas.length,
    pasa: b.filas.slice(0, 2).map(f => f.titulo).join(', '),
    abre: `<div class="r7c-props">${b.filas.map(f => `<button type="button" class="r7c-caso" data-hoja="h32" data-hallazgo="${esc(f.id)}"><span><b>${esc(f.titulo)}</b> · ${esc(f.sub)}</span>${VETA.ic('chev', 16)}</button>`).join('')}</div>`})), {i: desde});
  C.hallazgo = id => { let x = null; VETA.datos.c.mapa.forEach(b => b.filas.forEach(f => { if (f.id === id) x = f; })); return x; };

  VETA.pantalla('A18m', {
    titulo: 'Mi mapa de trabajo',
    frase: 'Lo que encontré en seis meses de tus chats. Toca un grupo para verlo.',
    pinta: () => C.mapaHtml(0),
    botonFijo: () => VETA.r7.botones({texto: 'Empieza por los informes del piso', ir: 'regla/r-valoraciones'})
  });
})();
