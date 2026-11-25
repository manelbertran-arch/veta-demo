/* Veta demo · ronda 8 · pantallas · persona.js · carril D
   G19 · Una persona del equipo · #/persona/:id — subtítulo (dónde trabaja; ella ve esto mismo) y dos listas:
   1) sus operaciones: cara del cliente, qué es y, tras el punto, lo que pasa. Pastilla roja solo si alguien espera respuesta;
   2) “De Laura” (su nombre; con Montse, “Lo tuyo”): lo que Veta hace por ella (abre la hoja de texto d-hace). Con Montse, también “Te toca a ti” y “Tus clientes”.
   Sin cifras por persona ni comparar con nadie (25-nov-2026): ni recuentos ni “cuánto tarda en contestar”; la hoja d-tarda se fue.
   Si está de baja: el botón negro “Pasar sus clientes” (reparto). Datos: VETA.dir.personaOps. */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7;
  const EL = {marc: true, david: true};                            // “Él ve esto mismo”
  // lo que pasa en una operación, en la segunda línea; en rojo (pastilla) solo “Sin contestar”
  const PASA = {queja: 'complaint', parada: 'stalled', papel: 'doc missing', espera: 'waiting', nadie: 'no one has it'};
  const paso = o => String(o.comoCorto || '').replace(/ \(\d of 5\)/, '');
  const filaOp = o => {
    const t = o.aviso && o.aviso.tipo, rojo = t === 'sin-contestar';
    const que = rojo ? '' : t ? (PASA[t] || '') : o.nota ? 'answered' : paso(o);
    return {cara: o.id, nombre: o.nombre, pasa: o.texto + (que ? ' · ' + que : ''), pastilla: rojo ? 'No reply yet' : null, ir: 'operacion/' + o.id};
  };

  VETA.pantalla('G19', {
    titulo: p => { const x = X.persona(p.id); return p.id === VETA.yo().id ? 'You' : (x.nombre || 'A person'); },
    sub: p => {
      if (!VETA.datos.personas[p.id]) return '';
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, n = x.ops.length;
      if (x.baja) return `${x.baja}. Her clients are waiting.`;
      if (!n) return yo ? 'You have no deals right now.' : 'No deals right now.';
      if (yo) return `You work in ${X.zona(p.id)}.`;
      return EL[p.id] ? `Works in ${X.zona(p.id)}. He sees this same thing.` : `Works in ${X.zona(p.id)}. She sees this same thing.`;
    },
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return VETA.UI.vacio({titulo: 'I can\'t find this person.', texto: 'Go back to the team and pick another.'});
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id;
      const resto = [];
      // Montse también vende: su día y sus clientes, con su nombre
      if (yo) resto.push({nombre: 'Your turn', ir: 'hoy'}, {nombre: 'Your clients', ir: 'clientes'});   // sin recuentos: ni los de ella van en esta ficha (25-nov-2026)
      resto.push({nombre: yo ? 'What Veta does for you' : 'What Veta does for ' + x.p.corto, hoja: 'd-hace', datos: {persona: p.id}});
      return (x.ops.length ? r7.lista(x.ops.map(filaOp), {i: 0}) : '') + r7.lista(resto, {rotulo: yo ? 'Yours' : 'From ' + x.p.corto, i: 1});
    },
    botonFijo: p => {
      const x = VETA.datos.personas[p.id] ? X.personaOps(p.id) : null;
      return x && x.baja ? r7.botones({texto: 'Pass her clients', ir: 'reparto'}) : '';
    }
  });
})();
