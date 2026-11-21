/* Veta demo · pantallas · reglas.js · paquete C (Veta, cuenta y entrada)
   - A9 · Lo que hago por ti · #/reglas
   - A9b · La semana pasada · #/reglas/semana-pasada */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ORDEN = {propuesta: 0, 'a-prueba': 1, activa: 2, descartada: 3};

  // ---- A9 · Lo que hago por ti ----
  VETA.pantalla('A9', {
    titulo: 'Los trabajos, uno a uno',
    guia: ['Aquí ves cada trabajo y quién lo hace: tú o yo.', 'Tú tocas uno para ver sus casos y decidir si doy un paso más.', 'Así nada pasa a hacerlo yo sin que lo hayas visto.'],
    pinta: () => {
      const l = M.reglas().slice().sort((a, b) => (ORDEN[a.estado] ?? 2) - (ORDEN[b.estado] ?? 2));
      const v = C.visitas();
      // una sola etiqueta por fila: de color solo «¿Lo hago yo?» y «Lo estoy probando»; lo que ya hago, en gris con su paso y desde cuándo
      const filas = [v.etq === 'activa' ? {titulo: C.nombre('r-visitas'), subHtml: VETA.vivo.escalera({nivel: v.n, desde: 'hoy', mini: true}), ir: 'regla/r-visitas'}
        : {titulo: C.nombre('r-visitas'), etiqueta: v.etq, etiquetaTexto: v.lista || v.texto, ir: 'regla/r-visitas', clase: v.estado === 'propuesta' ? 'c-resalta' : ''}]
        .concat(l.map(r => {
          const e = C.estadoRegla(r);
          const gris = e.etq === 'neutro' || e.etq === 'activa';
          return {titulo: r.texto, etiqueta: gris ? null : e.etq, etiquetaTexto: e.lista || e.texto, sub: e.etq === 'neutro' ? e.texto : null,
            subHtml: e.etq === 'activa' ? VETA.vivo.escalera({nivel: C.paso(r.id), desde: (C.lee('nivelLinea', null) || {}).id === r.id ? 'hoy' : e.desde, mini: true}) : null,
            ir: 'regla/' + r.id, clase: r.estado === 'propuesta' ? 'c-resalta' : (r.estado === 'descartada' ? 'c-apagada' : '')};
        }));
      return `<p class="intro" data-i="0">Toca uno para ver quién lo hace: tú o yo.</p>` +
        UI.lista(filas, {i: 1, clase: 'c-reglas'}) +
        UI.bloque({i: 2, html: UI.lista([
          {titulo: 'Enséñame algo nuevo', sub: 'Dímelo hablando. Yo te lo propongo y tú decides.', icono: 'mic', ir: 'dictar/orden'},
          {titulo: 'La semana pasada', sub: C.lee('semanaConfirmada', null) ? 'Me dijiste que está bien' : '31 mensajes y 3 notas de visita · míralo y dime si está bien', icono: 'cal', ir: 'reglas/semana-pasada'}
        ])});
    }
  });

  // ---- A9b · La semana pasada ----
  VETA.pantalla('A9b', {
    titulo: 'La semana pasada',
    guia: ['Aquí repasas lo que hice la semana pasada.', 'Tú me dices de un toque si está bien.', 'Así sabes qué ha hecho, sin leerlo todo.'],
    pinta: () => {
      const hecha = C.lee('semanaConfirmada', null);
      return (hecha ? UI.lineaHecho({texto: 'Me dijiste que está bien', hora: hecha, boton: {texto: 'Deshacer', accion: 'deshacer'}, i: 0}) : '') +
        `<p class="intro" data-i="0">Semana del 16 al 22 de noviembre.</p>` +
        UI.lista(VETA.datos.c.semanaPasada.map(f => ({titulo: f.titulo, sub: f.sub, derecha: f.derecha})), {i: 1, clase: 'c-cuentas'}) +
        UI.nota({texto: 'Todo lo que salió lo enviaste tú desde tu WhatsApp.', icono: 'candado', clase: 'nota-gris'});
    },
    botonFijo: () => (C.lee('semanaConfirmada', null) ? '' : UI.boton({texto: 'Sí, está bien', accion: 'confirmar'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); }
    }
  });
  void esc;
})();
