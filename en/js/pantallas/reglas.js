/* Veta demo · pantallas · reglas.js · paquete C (Veta, cuenta y entrada)
   - A9 · Lo que hago por ti · #/reglas
   - A9b · La semana pasada · #/reglas/semana-pasada */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ORDEN = {propuesta: 0, 'a-prueba': 1, activa: 2, descartada: 3};

  // ---- A9 · Lo que hago por ti ----
  VETA.pantalla('A9', {
    titulo: 'The jobs, one by one',
    guia: ['Here you see each job and who does it: you or me.', 'You tap one to see its cases and decide if I take one more step.', 'This way nothing becomes mine to do without you having seen it.'],
    pinta: () => {
      const l = M.reglas().slice().sort((a, b) => (ORDEN[a.estado] ?? 2) - (ORDEN[b.estado] ?? 2));
      const v = C.visitas();
      // una sola etiqueta por fila: de color solo “¿Lo hago yo?” y “Lo estoy probando”; lo que ya hago, en gris con su paso y desde cuándo
      const filas = [v.etq === 'activa' ? {titulo: C.nombre('r-visitas'), subHtml: VETA.vivo.escalera({nivel: v.n, desde: 'today', mini: true}), ir: 'regla/r-visitas'}
        : {titulo: C.nombre('r-visitas'), etiqueta: v.etq, etiquetaTexto: v.lista || v.texto, ir: 'regla/r-visitas', clase: v.estado === 'propuesta' ? 'c-resalta' : ''}]
        .concat(l.map(r => {
          const e = C.estadoRegla(r);
          const gris = e.etq === 'neutro' || e.etq === 'activa';
          return {titulo: r.texto, etiqueta: gris ? null : e.etq, etiquetaTexto: e.lista || e.texto, sub: e.etq === 'neutro' ? e.texto : null,
            subHtml: e.etq === 'activa' ? VETA.vivo.escalera({nivel: C.paso(r.id), desde: (C.lee('nivelLinea', null) || {}).id === r.id ? 'today' : e.desde, mini: true}) : null,
            ir: 'regla/' + r.id, clase: r.estado === 'propuesta' ? 'c-resalta' : (r.estado === 'descartada' ? 'c-apagada' : '')};
        }));
      return `<p class="intro" data-i="0">Tap one to see who does it: you or me.</p>` +
        UI.lista(filas, {i: 1, clase: 'c-reglas'}) +
        UI.bloque({i: 2, html: UI.lista([
          {titulo: 'Teach me something new', sub: 'Tell me by talking. I suggest it, and you decide.', icono: 'mic', ir: 'dictar/orden'},
          {titulo: 'Last week', sub: C.lee('semanaConfirmada', null) ? 'You told me it is right' : '31 messages and 3 viewing notes · look at it and tell me if it is right', icono: 'cal', ir: 'reglas/semana-pasada'}
        ])});
    }
  });

  // ---- A9b · La semana pasada ----
  VETA.pantalla('A9b', {
    titulo: 'Last week',
    guia: ['Here you go over what I did last week.', 'You tell me with one tap if it is right.', 'That way you know what it did, without reading everything.'],
    pinta: () => {
      const hecha = C.lee('semanaConfirmada', null);
      return (hecha ? UI.lineaHecho({texto: 'You told me it is right', hora: hecha, boton: {texto: 'Undo', accion: 'deshacer'}, i: 0}) : '') +
        `<p class="intro" data-i="0">Week of 16 to 22 November.</p>` +
        UI.lista(VETA.datos.c.semanaPasada.map(f => ({titulo: f.titulo, sub: f.sub, derecha: f.derecha})), {i: 1, clase: 'c-cuentas'}) +
        UI.nota({texto: 'Everything that went out you sent yourself from your WhatsApp.', icono: 'candado', clase: 'nota-gris'});
    },
    botonFijo: () => (C.lee('semanaConfirmada', null) ? '' : UI.boton({texto: 'Yes, it is right', accion: 'confirmar'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); }
    }
  });
  void esc;
})();
