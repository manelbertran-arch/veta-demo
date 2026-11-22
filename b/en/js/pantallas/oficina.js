/* Veta demo · pantallas · oficina.js · ronda 7 · D2
   G21 · Veta (de la oficina) · #/oficina — raíz de la caja “Veta” de dirección (ESTRATEGIA_R7.md, sección 4).
   Una sola lista (R2): lo que Veta hace por la oficina, cada cosa en su fila con su nombre de verdad, y abajo el botón negro
   “Enséñale a Veta”. Recoge lo que antes estaba en Equipo (“Trabajo que Veta ya hace”, el gráfico, “Me corregisteis…” → dentro de
   “La semana pasada”; y “Más de la oficina”: semana, qué hace, antes y ahora, conexiones). “Lo que tu equipo le pide a Veta” y la fecha “Leído hasta…” (h04) también vienen de Equipo. “Lo que entra” y “Avisos” los cuelga D1;
   “Cómo va la oficina hoy” (h34) cuelga de Operaciones. Pantallas de C: oficina/practicas, oficina/sabe, oficina/aprende, oficina/falta. */
(function () {
  'use strict';
  const r7 = VETA.r7, esc = VETA.esc;

  VETA.pantalla('G21', {
    titulo: 'Veta',
    frase: 'This is what I do for your office. Tap a row to see it, or teach me something new.',
    // arreglo FD (defecto 2): cuatro filas como mucho. Lo demás va dentro de “Lo que ya hago por la oficina” (G15);
    // “Conexiones y ajustes” y “Lo último que he leído”, a Cuenta (conexiones).
    pinta: () => {
      const c = r7.cuentas();
      const ens = VETA.r7e && VETA.r7e.aprendidos ? VETA.r7e.aprendidos('direccion') : [];
      return r7.lista([
        {icono: 'cal', oro: true, nombre: 'Last week', pasa: 'What I left ready for you all', numero: c.oficina, ir: 'semana-equipo'},
        {icono: 'check', oro: true, nombre: 'What I do for the office', pasa: 'What I do and what I learn', ir: 'oficina-que-hace'},
        {icono: 'grafica', nombre: 'Before and now', pasa: 'How long clients wait', ir: 'oficina-antes-ahora'},
        // lo que dirección le enseña en “Enséñale a Veta” (E: VETA.r7e.aprendidos), con su número al día; sale cuando hay algo
        ens.length ? {icono: 'mic', oro: true, nombre: 'You taught me this', pasa: 'The last one: ' + String((ens[ens.length - 1] || {}).que || '').toLowerCase(), numero: ens.length,
          abre: `<ul class="d2-hitos">${ens.slice().reverse().map(x => `<li><b>${esc(x.texto || x.que || '')}</b>${x.hora ? ' · today, ' + esc(x.hora) : ''}</li>`).join('')}</ul>`} : null
      ], {i: 0});
    },
    botonFijo: () => r7.botones({texto: 'Teach Veta', icono: 'mic', ir: 'dictar/libre'})
  });
})();
