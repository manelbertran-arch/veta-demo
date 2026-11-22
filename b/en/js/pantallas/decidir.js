/* Veta demo · ronda 7 · pantallas · decidir.js · D1
   G20 · Decidir · #/decidir — la lista de lo que espera la decisión de dirección (antes, tarjetas dentro de Equipo).
   Una fila por cosa: cara o icono, quién o qué, qué pasa y una pastilla. Al tocarla, su ficha (asunto/:id, reparto o el trabajo
   para la oficina). Debajo, lo ya decidido hoy (se abre aquí). Arreglo FD: Pau Ríos y Lucía Gómez (nadie los lleva) son filas
   como Carmen; “Lo que entra” está al final de Operaciones y “Tus avisos”, en Cuenta.
   El número sale de VETA.r7.cuentas().decidir: el mismo de la caja de Inicio, la barra y la frase. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir;

  // cómo se ve cada decisión en la lista (R3: una línea de nombre, una de qué pasa, una pastilla)
  const FILA = {
    'd-carmen': () => ({cara: 'carmen', nombre: 'Carmen López', pasa: 'No reply since yesterday', pastilla: 'No one has it', tono: 'rojo'}),
    'd-regla': () => ({icono: 'estrella', oro: true, nombre: 'Flat report', pasa: 'A new job for the office',
      pastilla: X.laPropuso() ? 'Laura suggests it' : 'I suggest it', tono: 'oro'}),
    'd-teresa': () => ({cara: 'teresa', nombre: 'Teresa Gil', pasa: 'She is off sick. 12 clients are waiting', pastilla: 'Off sick'}),
    'd-joan': () => ({cara: 'joan-serra', nombre: 'Joan Serra', pasa: 'Ten days with no news about their flat', pastilla: 'Complaint'})
  };
  const filaDe = c => Object.assign({nombre: c.fila || c.titulo, pasa: c.filaSub, icono: 'estrella'}, FILA[c.id] ? FILA[c.id]() : {}, {ir: X.rutaDe(c), datos: {vt: 'cola-' + c.id}});

  // lo decidido hoy: una fila que se abre aquí con una línea por cosa
  const lineaDe = c => (c.extra && c.extra.linea) || (c.lineas && c.lineas[c.estado]) || (c.lineas && c.lineas.hecha) || c.titulo;
  function decididas() {
    const l = M.decisiones().filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
    if (!l.length) return null;
    return {icono: 'check', nombre: l.length === 1 ? 'Decided today' : 'Decided today', pasa: l.length === 1 ? lineaDe(l[0]) : 'Tap to see them', numero: l.length > 1 ? l.length : null,
      abre: `<ul class="d1-hechas">${l.map(c => `<li>${VETA.ic('check', 16)}<span>${esc(lineaDe(c))}${c.hora ? ' · ' + esc(c.hora) : ''}</span></li>`).join('')}</ul>`};
  }
  // arreglo FD (defecto 8): “Lo que entra” pasa a ser la última fila de Operaciones y “Tus avisos” va a Cuenta.
  // Un contacto que no lleva nadie (Pau Ríos, Lucía Gómez) es una decisión más, como Carmen: su ficha es asunto/:id.
  const CONTACTO = {'pau-rios': 'Look for a place to rent', lucia: 'Wants to sell her parents\' flat'};
  const filaContacto = x => ({cara: x.id, nombre: x.nombre, pasa: CONTACTO[x.id] || 'New contact', pastilla: 'No one has it', tono: 'rojo', ir: 'asunto/' + x.id, datos: {vt: 'cola-' + x.id}});

  VETA.pantalla('G20', {
    titulo: 'Decide',
    frase: () => {
      const n = VETA.r7.cuentas().decidir;
      return n ? `${n} ${n === 1 ? 'thing is waiting for' : 'things are waiting for'} your decision. Tap one.` : 'You have decided everything. If something comes in, I put it here.';
    },
    guia: ['Here you see what is waiting for your decision.', 'You tap one and I tell you what I would do.', 'You decide with one tap.'],
    pinta: () => {
      const pend = VETA.d1.esperan();
      const filas = pend.map(e => VETA.d1.fila(e.tipo === 'contacto' ? filaContacto(e.x) : filaDe(e.c)));
      // lo ya decidido hoy va después, separado por un poco de aire
      const hechas = decididas();
      if (hechas) { if (pend.length) hechas.clase = 'd1-sep'; filas.push(VETA.r7.fila(hechas)); }
      return `<div class="d1-decidir">${VETA.r7.lista(filas)}</div>`;
    }
  });
})();
