/* Veta demo · ronda 8 · pantallas · persona.js · carril D
   G19 · Una persona del equipo · #/persona/:id — subtítulo (cuántas lleva y dónde; ella ve esto mismo) y dos listas:
   1) sus operaciones: cara del cliente, qué es y, tras el punto, lo que pasa. Pastilla roja solo si alguien espera respuesta;
   2) «Además»: lo que tiene hoy, cuánto tarda en contestar y lo que Veta hace por ella (las dos últimas abren una hoja de texto:
      d-tarda y d-hace). Con Montse, también «Te toca a ti» y «Tus clientes».
   Sin podio ni comparar con nadie: cada cifra es suya y ninguna se pone al lado de la de otra persona.
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
      if (yo) return `Llevas ${x.cuantas} en ${X.zona(p.id)}.`;
      return EL[p.id] ? `Lleva ${x.cuantas} en ${X.zona(p.id)}. Él ve esto mismo.` : `Lleva ${x.cuantas} en ${X.zona(p.id)}. Ella ve esto mismo.`;
    },
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return VETA.UI.vacio({titulo: 'No encuentro a esta persona.', texto: 'Vuelve al equipo y elige otra.'});
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, ella = yo ? 'ti' : x.p.corto;
      const resto = [];
      // Montse también vende: su día y sus clientes, con su nombre
      if (yo) resto.push({nombre: 'Te toca a ti', dato: x.pendientes || null, ir: 'hoy'}, {nombre: 'Tus clientes', dato: r7.cuentas().clientes || null, ir: 'clientes'});
      else resto.push({nombre: 'Lo que tiene hoy', pasa: x.baja ? `${x.pendientes} conversaciones esperan a alguien` : x.pendientes ? X.tocanTexto(x, yo) : 'Hoy no tiene nada pendiente.'});
      if (x.tarda) resto.push({nombre: 'Cuánto tarda en contestar', hoja: 'd-tarda', datos: {persona: p.id}});
      resto.push({nombre: 'Lo que Veta hace por ' + ella, hoja: 'd-hace', datos: {persona: p.id}});
      return (x.ops.length ? r7.lista(x.ops.map(filaOp), {i: 0}) : '') + r7.lista(resto, {rotulo: 'Además', i: 1});
    },
    botonFijo: p => {
      const x = VETA.datos.personas[p.id] ? X.personaOps(p.id) : null;
      return x && x.baja ? r7.botones({texto: 'Pasar sus clientes', ir: 'reparto'}) : '';
    }
  });
})();
