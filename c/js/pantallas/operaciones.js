/* Veta demo · pantallas · operaciones.js · ronda 7 · D2 (antes: ronda 6, paquete D)
   G17 · Operaciones · #/operaciones — raíz de la caja «Operaciones» de dirección (ESTRATEGIA_R7.md, sección 4).
   Una sola cosa: la lista. Arriba, dos pastillas: «Hay que mirarlas 5» (se abre aquí) y «Todas 22». Cada fila (R3):
   cara + «Marta Puig» con una pastilla (roja si alguien espera o no la lleva nadie; si no, gris: cómo va) + «Compra en Gràcia · Laura».
   (El encargo pedía «Marta Puig · Compra en Gràcia» en la primera línea: con la pastilla al lado se cortaba a «Marta Puig · C…».)
   Lo de «no la lleva nadie» se decide en Decidir (D1) y «por persona» se ve en Equipo (D1): aquí ya no hay esos filtros.
   Al final, «Cómo va la oficina hoy» (h34), que antes colgaba de «Más de la oficina» en Equipo. Cuentas: VETA.r7.cuentas(). */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, r7 = VETA.r7;
  let filtro = 'mirar';

  // la pastilla, una por fila y corta (R3, R5): roja si alguien espera respuesta o no la lleva nadie; si no, gris con cómo va
  // arreglo FD (defecto 7): una sola tabla de pastillas. Rojas: «Sin contestar» y «Nadie la lleva»; «Queja» y «De baja», grises.
  const ROJO = {'sin-contestar': 'Sin contestar', nadie: 'Nadie la lleva'};
  const GRIS = {queja: 'Queja', papel: 'Falta un papel', parada: 'Parada', espera: 'Parada'};
  const TIPO = {compra: 'Compra', venta: 'Venta', alquiler: 'Alquiler'};
  function pastilla(o) {
    const t = o.aviso && o.aviso.tipo;
    if (o.mirar && ROJO[t]) return [ROJO[t], 'rojo'];
    if (o.deBaja) return ['De baja', 'gris'];
    if (GRIS[t]) return [GRIS[t], 'gris'];
    return [String(o.comoCorto || '').replace(/^Parada en /, '').replace(/ \(\d de 5\)$/, ''), 'gris'];
  }
  // dos líneas (R3): «Marta Puig» + pastilla / «Compra en Gràcia · Laura». El nombre de la operación va abajo para que no se corte.
  const fila = o => {
    const [pt, tono] = pastilla(o);
    // arreglo FD (defecto 14): sin la zona, que cortaba la línea; queda qué es y quién la lleva
    const tipo = TIPO[o.tipo] || 'Operación';
    const pasa = !o.lleva ? 'Contacto nuevo' : tipo + ' · ' + (o.lleva === VETA.yo().id ? 'la llevas tú' : o.persona.corto);
    return {cara: o.id, nombre: o.nombre, pasa, pastilla: pt || null, tono, ir: 'operacion/' + o.id};
  };
  // el número de «Hay que mirarlas» y el de «Todas» salen de la misma función que la caja y la barra (R9)
  const cifras = () => { const c = r7.cuentas(); return {mirar: c.mirar, todas: c.operaciones}; };

  VETA.pantalla('G17', {
    titulo: 'Operaciones',
    frase: () => { const c = cifras(); return c.mirar ? `${c.todas} operaciones. Primero, las ${c.mirar} que hay que mirar hoy.` : `${c.todas} operaciones. Hoy no hay que mirar ninguna.`; },
    pinta: () => {
      const todas = X.ops(), ojo = todas.filter(o => o.mirar), c = cifras();
      if (filtro === 'mirar' && !ojo.length) filtro = 'todas';
      const l = filtro === 'mirar' ? ojo : todas;
      const pas = [['mirar', 'Hay que mirarlas', c.mirar], ['todas', 'Todas', c.todas]];
      let h = `<div class="d2-filtro" role="group" aria-label="Qué operaciones ver" data-i="0">${pas.map(([id, t, n]) =>
        `<button type="button" class="d2-filtro-b" data-accion="filtro" data-valor="${id}" aria-pressed="${filtro === id}">${esc(t)} <b>${n}</b></button>`).join('')}</div>`;
      const temas = {icono: 'grafica', nombre: 'Cómo va la oficina hoy', pasa: `${X.paradas().length} llevan más de 7 días paradas`, hoja: 'h34'};
      // arreglo FD (defecto 8): «Lo que entra» viene de Decidir y es la última fila, sin número
      const entra = {icono: 'entra', nombre: 'Lo que entra', pasa: 'Quién escribe a la oficina', ir: 'entra'};
      h += r7.lista(l.map(fila).concat([temas, entra]), {i: 1, clase: 'd2-ops'});
      return h;
    },
    acciones: {
      filtro(ev, el) { filtro = el.dataset.valor; VETA.repinta(); }
    }
  });
})();
