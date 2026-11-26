/* Veta demo · ronda 8 · pantallas · equipo.js · carril D
   G1 · Equipo · #/equipo — raíz. Una lista de personas con su cara: cuántas operaciones lleva y, en la segunda línea, lo que pasa.
   Sin cifras ni pastillas por persona (25-nov-2026): el total de la oficina va en el subtítulo. Teresa, de baja, va en la misma lista. Al tocar una persona, su ficha (persona/:id).
   Debajo, otra lista con “Pasar clientes a otra persona” (reparto).
   Nada de aquí ordena ni compara a las personas: el orden es el de siempre (quien necesita algo hoy, y luego por nombre). */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7;

  // la segunda línea: solo dónde trabaja (o, si está de baja, quién lleva sus clientes). Ninguna cifra y ninguna pastilla por persona:
  // lo que hay en la oficina va, junto y sin nombres, en el subtítulo (decisión del CTO del 25-nov-2026: nada por persona en dirección)
  function fila(x, yo) {
    const soy = x.id === yo;
    const pasa = x.p.baja ? (x.baja ? 'On leave · her clients are waiting' : `On leave · ${X.carteraTexto(X.carteraA())} has her clients`) : 'Works in ' + X.zona(x.id);
    return {cara: x.id, nombre: soy ? x.p.corto + ' (you)' : x.p.nombre, pasa, ir: 'persona/' + x.id};
  }

  // tanda V · la forma de Equipo: una rejilla de dos columnas, cada persona con su cara de 64 y debajo dónde trabaja (o su baja). Mismos datos y destinos
  // que antes (persona/:id); el resumen de la oficina, que antes era el subtítulo, pasa a una línea quieta sobre la rejilla.
  const ficha = f => `<button type="button" class="dq-p${f.baja ? ' dq-baja' : ''}"${VETA.UI.attrs({ir: f.ir})}>${r7.cara(f.cara, 64, {nombre: f.nombre})}` +
    `<span class="dq-n">${VETA.esc(f.nombre)}</span><span class="dq-z">${VETA.esc(f.pasa)}</span></button>`;

  VETA.pantalla('G1', {
    titulo: 'Team',
    sub: 'Who is in the office, and who to hand clients to.',
    pinta: () => {
      const e = X.equipoOps(), yo = VETA.yo().id;
      const todas = X.ops(), sin = todas.filter(o => o.mirar && o.aviso && o.aviso.tipo === 'sin-contestar').length;
      const resumen = `${todas.length} deals in the office` + (sin ? ` · ${sin} unanswered` : '') + '.';
      const orden = e.todos.filter(x => !x.p.baja).sort((a, b) => (a.id === yo) - (b.id === yo)).concat(e.todos.filter(x => x.p.baja));
      return `<p class="dq-meta" data-i="0">${VETA.esc(resumen)}</p>` +
        `<div class="dq-rej" data-i="1">${orden.map(x => { const f = fila(x, yo); f.baja = !!x.p.baja; return ficha(f); }).join('')}</div>` +
        r7.lista([{nombre: 'Move clients to another person', ir: 'reparto'}], {i: 2});
    }
  });
})();
