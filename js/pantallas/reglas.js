/* Veta demo · pantallas · reglas.js · paquete C (Veta, cuenta y entrada)
   - A9 · Lo que hago por ti · #/reglas
   - A9b · La semana pasada · #/reglas/semana-pasada */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ORDEN = {propuesta: 0, 'a-prueba': 1, activa: 2, descartada: 3};

  // ---- A9 · Lo que hago por ti ----
  VETA.pantalla('A9', {
    titulo: 'Lo que hago por ti',
    guia: ['Aquí ves cada cosa que Veta hace por ti y en qué estado está.', 'Tú tocas una para decidir: probarla, activarla o dejarla.', 'Así nada pasa a hacerse solo sin que lo hayas visto.'],
    pinta: () => {
      const l = M.reglas().slice().sort((a, b) => (ORDEN[a.estado] ?? 2) - (ORDEN[b.estado] ?? 2));
      const filas = l.map(r => {
        const e = C.estadoRegla(r);
        return {titulo: r.texto, etiqueta: e.etq === 'neutro' ? null : e.etq, etiquetaTexto: e.texto, sub: e.etq === 'neutro' ? e.texto : null,
          ir: 'regla/' + r.id, clase: r.estado === 'propuesta' ? 'c-resalta' : (r.estado === 'descartada' ? 'c-apagada' : '')};
      });
      return `<p class="intro" data-i="0">Cada fila dice qué hago y, debajo, en qué está. Nada sale sin que tú lo envíes.</p>` +
        UI.lista(filas, {i: 1, clase: 'c-reglas'}) +
        UI.bloque({i: 2, html: UI.lista([
          {titulo: 'Enseñarle algo nuevo', sub: 'Dímelo con tu voz y lo convierto en una regla', icono: 'mic', ir: 'dictar/orden'},
          {titulo: 'La semana pasada', sub: C.lee('semanaConfirmada', null) ? 'Confirmada' : '31 mensajes y 3 actas · revisar y confirmar', icono: 'cal', ir: 'reglas/semana-pasada'}
        ])});
    }
  });

  // ---- A9b · La semana pasada ----
  VETA.pantalla('A9b', {
    titulo: 'La semana pasada',
    guia: ['Aquí repasas lo que Veta hizo la semana pasada.', 'Tú lo confirmas de un toque si está bien.', 'Así sabes qué ha hecho, sin leerlo todo.'],
    pinta: () => {
      const hecha = C.lee('semanaConfirmada', null);
      return (hecha ? UI.lineaHecho({texto: 'Confirmada · lunes 23 nov', hora: hecha, boton: {texto: 'Deshacer', accion: 'deshacer'}, i: 0}) : '') +
        `<p class="intro" data-i="0">Semana del 16 al 22 de noviembre.</p>` +
        UI.lista(VETA.datos.c.semanaPasada.map(f => ({titulo: f.titulo, sub: f.sub, derecha: f.derecha})), {i: 1, clase: 'c-cuentas'}) +
        UI.nota({texto: 'Todo lo que salió lo enviaste tú desde tu WhatsApp.', icono: 'candado', clase: 'nota-gris'});
    },
    botonFijo: () => (C.lee('semanaConfirmada', null) ? '' : UI.boton({texto: 'Confirmar la semana pasada', accion: 'confirmar'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); }
    }
  });
  void esc;
})();
