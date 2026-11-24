/* Veta demo · ronda 8 · pantallas · equipo.js · carril D
   G1 · Equipo · #/equipo — raíz. Una lista de personas con su cara: cuántas operaciones lleva y, en la segunda línea, lo que pasa.
   La única pastilla, roja: “1 sin contestar”. Teresa, de baja, va en la misma lista. Al tocar una persona, su ficha (persona/:id).
   Debajo, otra lista con “Pasar clientes a otra persona” (reparto).
   Nada de aquí ordena ni compara a las personas: el orden es el de siempre (quien necesita algo hoy, y luego por nombre). */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7;

  // la segunda línea: cuántas lleva y, si pasa algo que no sea “sin contestar” (eso va en la pastilla), qué. Si no pasa nada, dónde trabaja
  function fila(x, yo) {
    const soy = x.id === yo, rojo = x.partes.find(p => p.rojo), resto = x.partes.filter(p => !p.rojo).map(p => p.texto);
    let pasa;
    if (x.p.baja) pasa = x.baja ? `On leave · ${x.pendientes} conversations waiting` : `On leave · ${X.carteraTexto(X.carteraA())} has her clients`;
    else pasa = resto.length ? x.cuantas + ' · ' + resto.join(' · ') : rojo ? x.cuantas : `${x.cuantas} in ${X.zona(x.id)}`;
    return {cara: x.id, nombre: soy ? x.p.corto + ' (you)' : x.p.nombre, pasa, pastilla: rojo && !x.p.baja ? rojo.texto : null, ir: 'persona/' + x.id};
  }

  VETA.pantalla('G1', {
    titulo: 'Team',
    pinta: () => {
      const e = X.equipoOps(), yo = VETA.yo().id;
      const orden = e.todos.filter(x => !x.p.baja).sort((a, b) => (a.id === yo) - (b.id === yo)).concat(e.todos.filter(x => x.p.baja));
      return r7.lista(orden.map(x => fila(x, yo)), {i: 0}) +
        r7.lista([{nombre: 'Move clients to another person', ir: 'reparto'}], {i: 1});
    }
  });
})();
