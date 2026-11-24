/* Veta demo · ronda 7 · pantallas · equipo.js · D1
   G1 · Equipo · #/equipo — solo las personas: una rejilla de caras grandes con su nombre, cuántas operaciones lleva y,
   si hace falta, una pastilla (en rojo solo «sin contestar»). Teresa, de baja, aparte, en una fila debajo, con «Pasar
   clientes a otra persona» (reparto). Al tocar una persona, su ficha (persona/:id).
   Lo que había antes aquí y ya no está:
   - «Tienes que decidir» → caja Decidir (decidir.js).
   - La entrada a Operaciones → caja Operaciones.
   - El gráfico «Trabajo que Veta ya hace», «Me corregisteis», «Ver la semana», la fecha («Leído hasta…»), «Lo que tu equipo
     le pide a Veta» y «Más de la oficina» (cómo va hoy, semana, qué hace Veta, antes y ahora, qué ve cada uno, ajustes)
     → caja Veta de la oficina (oficina.js, D2). «Lo que entra» y «Avisos» → al final de Decidir. */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir;

  // una persona en la rejilla: cara grande, nombre, cuántas lleva y como mucho una pastilla
  function tarjeta(x, yo) {
    const p = x.partes[0], soy = x.id === yo;
    const pas = p ? VETA.r7.pastilla(p.texto, p.rojo ? 'rojo' : 'gris') : `<span class="d1-per-ok">Todo al día</span>`;
    const voz = `${x.p.nombre}${soy ? ', tú' : ''}. ${x.cuantas}. ${p ? p.texto : 'Todo al día'}.`;
    return `<button type="button" class="d1-per" data-ir="persona/${esc(x.id)}" aria-label="${esc(voz)}">${VETA.d1.cara(x.id, 64)}` +
      `<span class="d1-per-n">${esc(soy ? x.p.corto + ' (tú)' : x.p.nombre)}</span><span class="d1-per-q">${esc(x.cuantas)}</span>${pas}</button>`;
  }

  VETA.pantalla('G1', {
    titulo: 'Equipo',
    frase: 'Toca una persona y ves qué lleva y cómo va.',
    guia: ['Aquí ves a cada persona del equipo y cuánto lleva.', 'Tocas una y ves sus operaciones.', 'Así sabes dónde echar una mano.'],
    pinta: () => {
      const e = X.equipoOps(), yo = VETA.yo().id;
      const fuera = e.todos.filter(x => x.p.baja), dentro = e.todos.filter(x => !x.p.baja).sort((a, b) => (a.id === yo) - (b.id === yo));
      const filas = fuera.map(x => VETA.d1.fila({cara: x.id, nombre: x.p.nombre, pasa: x.baja ? x.pendientes + ' conversaciones esperan' : 'Sus clientes ya los lleva ' + X.carteraTexto(X.carteraA()),
        pastilla: 'De baja', tono: 'gris', ir: 'persona/' + x.id}));
      filas.push({icono: 'equipo', nombre: 'Pasar clientes a otra persona', pasa: 'Cuando alguien no está o se va', ir: 'reparto'});
      return `<div class="d1-equipo"><div class="d1-rejilla">${dentro.map(x => tarjeta(x, yo)).join('')}</div>${VETA.r7.lista(filas)}</div>`;
    }
  });
})();
