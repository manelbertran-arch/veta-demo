/* Veta demo · ronda 8 · pantallas · persona.js · carril D
   G19 · Una persona del equipo · #/persona/:id — subtítulo (cuántas lleva y dónde; ella ve esto mismo) y dos listas:
   1) sus operaciones: cara del cliente, qué es y, tras el punto, lo que pasa. Pastilla roja solo si alguien espera respuesta;
   2) “Además”: lo que tiene hoy, cuánto tarda en contestar y lo que Veta hace por ella (las dos últimas abren una hoja de texto:
      d-tarda y d-hace). Con Montse, también “Te toca a ti” y “Tus clientes”.
   Sin podio ni comparar con nadie: cada cifra es suya y ninguna se pone al lado de la de otra persona.
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
      if (yo) return `You have ${x.cuantas} in ${X.zona(p.id)}.`;
      return EL[p.id] ? `He has ${x.cuantas} in ${X.zona(p.id)}. He sees this too.` : `She has ${x.cuantas} in ${X.zona(p.id)}. She sees this too.`;
    },
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return VETA.UI.vacio({titulo: 'I can\'t find this person.', texto: 'Go back to the team and pick another.'});
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, ella = yo ? 'you' : x.p.corto;
      const resto = [];
      // Montse también vende: su día y sus clientes, con su nombre
      if (yo) resto.push({nombre: 'Your turn', dato: x.pendientes || null, ir: 'hoy'}, {nombre: 'Your clients', dato: r7.cuentas().clientes || null, ir: 'clientes'});
      else resto.push({nombre: 'What they have today', pasa: x.baja ? `${x.pendientes} conversations are waiting for someone` : x.pendientes ? X.tocanTexto(x, yo) : 'Nothing pending today.'});
      if (x.tarda) resto.push({nombre: 'How long they take to reply', hoja: 'd-tarda', datos: {persona: p.id}});
      resto.push({nombre: 'What Veta does for ' + ella, hoja: 'd-hace', datos: {persona: p.id}});
      return (x.ops.length ? r7.lista(x.ops.map(filaOp), {i: 0}) : '') + r7.lista(resto, {rotulo: 'Also', i: 1});
    },
    botonFijo: p => {
      const x = VETA.datos.personas[p.id] ? X.personaOps(p.id) : null;
      return x && x.baja ? r7.botones({texto: 'Pass her clients', ir: 'reparto'}) : '';
    }
  });
})();
