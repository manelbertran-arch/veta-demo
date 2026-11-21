/* Veta demo · pantallas · reglas.js · paquete C (Veta, cuenta y entrada)
   - A9 · Lo que hago por ti · #/reglas
   - A9b · La semana pasada · #/reglas/semana-pasada */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ORDEN = {propuesta: 0, 'a-prueba': 1, activa: 2, descartada: 3};

  // ---- A9 · Lo que hago por ti ----
  VETA.pantalla('A9', {
    titulo: 'What I do for you',
    guia: ['Here you see everything Veta does for you and what state it\'s in.', 'You tap one to decide: try it, turn it on or drop it.', 'That way nothing starts happening on its own without you having seen it.'],
    pinta: () => {
      const l = M.reglas().slice().sort((a, b) => (ORDEN[a.estado] ?? 2) - (ORDEN[b.estado] ?? 2));
      const filas = l.map(r => {
        const e = C.estadoRegla(r);
        return {titulo: r.texto, etiqueta: e.etq === 'neutro' ? null : e.etq, etiquetaTexto: e.texto, sub: e.etq === 'neutro' ? e.texto : null,
          ir: 'regla/' + r.id, clase: r.estado === 'propuesta' ? 'c-resalta' : (r.estado === 'descartada' ? 'c-apagada' : '')};
      });
      return `<p class="intro" data-i="0">Each row says what I do and, underneath, where it stands. Nothing goes out without you sending it.</p>` +
        UI.lista(filas, {i: 1, clase: 'c-reglas'}) +
        UI.bloque({i: 2, html: UI.lista([
          {titulo: 'Teach it something new', sub: 'Tell me with your voice and I\'ll turn it into a rule', icono: 'mic', ir: 'dictar/orden'},
          {titulo: 'Last week', sub: C.lee('semanaConfirmada', null) ? 'Confirmed' : '31 messages and 3 viewing notes · review and confirm', icono: 'cal', ir: 'reglas/semana-pasada'}
        ])});
    }
  });

  // ---- A9b · La semana pasada ----
  VETA.pantalla('A9b', {
    titulo: 'Last week',
    guia: ['Here you go over what Veta did last week.', 'You confirm it with one tap if it\'s fine.', 'That way you know what it did, without reading everything.'],
    pinta: () => {
      const hecha = C.lee('semanaConfirmada', null);
      return (hecha ? UI.lineaHecho({texto: 'Confirmed · Monday 23 Nov', hora: hecha, boton: {texto: 'Undo', accion: 'deshacer'}, i: 0}) : '') +
        `<p class="intro" data-i="0">Week of 16 to 22 November.</p>` +
        UI.lista(VETA.datos.c.semanaPasada.map(f => ({titulo: f.titulo, sub: f.sub, derecha: f.derecha})), {i: 1, clase: 'c-cuentas'}) +
        UI.nota({texto: 'Everything that went out you sent yourself from your WhatsApp.', icono: 'candado', clase: 'nota-gris'});
    },
    botonFijo: () => (C.lee('semanaConfirmada', null) ? '' : UI.boton({texto: 'Confirm last week', accion: 'confirmar'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); }
    }
  });
  void esc;
})();
