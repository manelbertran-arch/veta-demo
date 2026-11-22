/* Veta demo · ronda 7 · pantallas · decidir.js · D1
   G20 · Decidir · #/decidir — la lista de lo que espera la decisión de dirección (antes, tarjetas dentro de Equipo).
   Una fila por cosa: cara o icono, quién o qué, qué pasa y una pastilla. Al tocarla, su ficha (asunto/:id, reparto o el trabajo
   para la oficina). Debajo, lo ya decidido hoy (se abre aquí). Arreglo FD: Pau Ríos y Lucía Gómez (nadie los lleva) son filas
   como Carmen; «Lo que entra» está al final de Operaciones y «Tus avisos», en Cuenta.
   El número sale de VETA.r7.cuentas().decidir: el mismo de la caja de Inicio, la barra y la frase. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir;

  // cómo se ve cada decisión en la lista (R3: una línea de nombre, una de qué pasa, una pastilla)
  const FILA = {
    'd-carmen': () => ({cara: 'carmen', nombre: 'Carmen López', pasa: 'Nadie le contesta desde ayer', pastilla: 'Nadie la lleva', tono: 'rojo'}),
    'd-regla': () => ({icono: 'estrella', oro: true, nombre: 'Informe del piso', pasa: 'Un trabajo nuevo para la oficina',
      pastilla: X.laPropuso() ? 'Lo propone Laura' : 'Lo propongo', tono: 'oro'}),
    'd-teresa': () => ({cara: 'teresa', nombre: 'Teresa Gil', pasa: 'Está de baja. 12 clientes esperan', pastilla: 'De baja'}),
    'd-joan': () => ({cara: 'joan-serra', nombre: 'Joan Serra se queja', pasa: 'Diez días sin noticias de su piso', pastilla: 'Queja'})
  };
  const filaDe = c => Object.assign({nombre: c.fila || c.titulo, pasa: c.filaSub, icono: 'estrella'}, FILA[c.id] ? FILA[c.id]() : {}, {ir: X.rutaDe(c), datos: {vt: 'cola-' + c.id}});

  // lo decidido hoy: una fila que se abre aquí con una línea por cosa
  const lineaDe = c => (c.extra && c.extra.linea) || (c.lineas && c.lineas[c.estado]) || (c.lineas && c.lineas.hecha) || c.titulo;
  function decididas() {
    const l = M.decisiones().filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
    if (!l.length) return null;
    return {icono: 'check', nombre: l.length === 1 ? 'Decidida hoy' : 'Decididas hoy', pasa: l.length === 1 ? lineaDe(l[0]) : 'Toca y las ves', numero: l.length > 1 ? l.length : null,
      abre: `<ul class="d1-hechas">${l.map(c => `<li>${VETA.ic('check', 16)}<span>${esc(lineaDe(c))}${c.hora ? ' · ' + esc(c.hora) : ''}</span></li>`).join('')}</ul>`};
  }
  // arreglo FD (defecto 8): «Lo que entra» pasa a ser la última fila de Operaciones y «Tus avisos» va a Cuenta.
  // Un contacto que no lleva nadie (Pau Ríos, Lucía Gómez) es una decisión más, como Carmen: su ficha es asunto/:id.
  const CONTACTO = {'pau-rios': 'Busca un local para alquilar', lucia: 'Quiere vender el piso de sus padres'};
  const filaContacto = x => ({cara: x.id, nombre: x.nombre, pasa: CONTACTO[x.id] || 'Contacto nuevo', pastilla: 'Nadie la lleva', tono: 'rojo', ir: 'asunto/' + x.id, datos: {vt: 'cola-' + x.id}});

  VETA.pantalla('G20', {
    titulo: 'Decidir',
    frase: () => {
      const n = VETA.r7.cuentas().decidir;
      return n ? `${n} ${n === 1 ? 'cosa espera' : 'cosas esperan'} tu decisión. Toca una.` : 'Ya lo has decidido todo. Si entra algo, te lo pongo aquí.';
    },
    guia: ['Aquí ves lo que espera tu decisión.', 'Tocas una y te digo qué haría yo.', 'Tú decides con un toque.'],
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
