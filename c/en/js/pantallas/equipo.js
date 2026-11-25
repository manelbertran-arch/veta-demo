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

  VETA.pantalla('G1', {
    titulo: 'Team',
    sub: () => {
      const todas = X.ops(), sin = todas.filter(o => o.mirar && o.aviso && o.aviso.tipo === 'sin-contestar').length;
      return `${todas.length} deals in the office` + (sin ? ` · ${sin} unanswered` : '') + '.';
    },
    pinta: () => {
      const e = X.equipoOps(), yo = VETA.yo().id;
      const orden = e.todos.filter(x => !x.p.baja).sort((a, b) => (a.id === yo) - (b.id === yo)).concat(e.todos.filter(x => x.p.baja));
      return r7.lista(orden.map(x => fila(x, yo)), {i: 0}) +
        r7.lista([{nombre: 'Move clients to another person', ir: 'reparto'}], {i: 1});
    }
  });
})();
