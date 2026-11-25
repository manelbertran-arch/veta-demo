/* Veta demo · ronda 8 · pantallas · persona.js · carril D
   G19 · Una persona del equipo · #/persona/:id — subtítulo (dónde trabaja; ella ve esto mismo) y dos listas:
   1) sus operaciones: cara del cliente, qué es y, tras el punto, lo que pasa. Pastilla roja solo si alguien espera respuesta;
   2) «De Laura» (su nombre; con Montse, «Lo tuyo»): lo que Veta hace por ella (abre la hoja de texto d-hace). Con Montse, también «Te toca a ti» y «Tus clientes».
   Sin cifras por persona ni comparar con nadie (25-nov-2026): ni recuentos ni «cuánto tarda en contestar»; la hoja d-tarda se fue.
   Si está de baja: el botón negro «Pasar sus clientes» (reparto). Datos: VETA.dir.personaOps. */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7;
  const EL = {marc: true, david: true};                            // «Él ve esto mismo»
  // lo que pasa en una operación, en la segunda línea; en rojo (pastilla) solo «Sin contestar»
  const PASA = {queja: 'queja', parada: 'parada', papel: 'falta un papel', espera: 'esperando', nadie: 'nadie la lleva'};
  const paso = o => String(o.comoCorto || '').replace(/ \(\d de 5\)/, '');
  const filaOp = o => {
    const t = o.aviso && o.aviso.tipo, rojo = t === 'sin-contestar';
    const que = rojo ? '' : t ? (PASA[t] || '') : o.nota ? 'contestada' : paso(o);
    return {cara: o.id, nombre: o.nombre, pasa: o.texto + (que ? ' · ' + que : ''), pastilla: rojo ? 'Sin contestar' : null, ir: 'operacion/' + o.id};
  };

  VETA.pantalla('G19', {
    titulo: p => { const x = X.persona(p.id); return p.id === VETA.yo().id ? 'Tú' : (x.nombre || 'Una persona'); },
    sub: p => {
      if (!VETA.datos.personas[p.id]) return '';
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, n = x.ops.length;
      if (x.baja) return `${x.baja}. Sus clientes esperan.`;
      if (!n) return yo ? 'Ahora no llevas ninguna operación.' : 'Ahora no lleva ninguna operación.';
      if (yo) return `Trabajas en ${X.zona(p.id)}.`;
      return EL[p.id] ? `Trabaja en ${X.zona(p.id)}. Él ve esto mismo.` : `Trabaja en ${X.zona(p.id)}. Ella ve esto mismo.`;
    },
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return VETA.UI.vacio({titulo: 'No encuentro a esta persona.', texto: 'Vuelve al equipo y elige otra.'});
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id;
      const resto = [];
      // Montse también vende: su día y sus clientes, con su nombre
      if (yo) resto.push({nombre: 'Te toca a ti', ir: 'hoy'}, {nombre: 'Tus clientes', ir: 'clientes'});   // sin recuentos: ni los de ella van en esta ficha (25-nov-2026)
      resto.push({nombre: yo ? 'Lo que Veta hace por ti' : 'Lo que Veta hace por ' + x.p.corto, hoja: 'd-hace', datos: {persona: p.id}});
      return (x.ops.length ? r7.lista(x.ops.map(filaOp), {i: 0}) : '') + r7.lista(resto, {rotulo: yo ? 'Lo tuyo' : 'De ' + x.p.corto, i: 1});
    },
    botonFijo: p => {
      const x = VETA.datos.personas[p.id] ? X.personaOps(p.id) : null;
      return x && x.baja ? r7.botones({texto: 'Pasar sus clientes', ir: 'reparto'}) : '';
    }
  });
})();
