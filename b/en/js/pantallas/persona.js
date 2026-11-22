/* Veta demo · ronda 7 · pantallas · persona.js · D1
   G19 · Una persona del equipo · #/persona/:id — una lista (R2, R3): primero sus operaciones (cara del cliente, qué es,
   en qué paso va y una pastilla si hace falta), y al final, en filas, lo que tiene hoy, cuánto tarda en contestar, lo que
   Veta hace por ella, lo que ha aprendido de ella y qué ve ella. Sin podio ni comparar con nadie: cada cifra es suya.
   Si está de baja: el botón negro “Pasar sus clientes a otra persona” (reparto). Datos: VETA.dir.personaOps. */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, M = VETA.modelo;
  const ESTADO = {activa: 'I already do it', 'a-prueba': 'I\'m trying it', propuesta: 'I have suggested it'};
  // la pastilla de cada operación: corta; en rojo solo cuando alguien espera respuesta o no la lleva nadie (R5)
  const PASTILLA = {'sin-contestar': ['No reply yet', 'rojo'], nadie: ['No one has it', 'rojo'], queja: ['Complaint', 'gris'], parada: ['Stalled', 'gris'], papel: ['Paper missing', 'gris'], espera: ['Waiting', 'gris']};
  const pastillaDe = o => o.aviso ? (PASTILLA[o.aviso.tipo] || [o.aviso.texto.split(' · ')[0], o.aviso.tono === 'rojo' ? 'rojo' : 'gris']) : o.nota ? ['Replied', 'gris'] : null;

  VETA.pantalla('G19', {
    titulo: p => { const x = X.persona(p.id); return p.id === VETA.yo().id ? 'You' : (x.nombre || 'A person'); },
    cabDerecha: p => VETA.datos.personas[p.id] ? VETA.d1.cara(p.id, 32) : '',
    frase: p => {
      if (!VETA.datos.personas[p.id]) return '';
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, n = x.ops.length;
      if (x.baja) return `${x.baja}. Their clients are waiting: pass them to someone else.`;
      if (!n) return `${yo ? 'Now you have' : 'Now they have'} no deals.`;
      return `${yo ? 'You have' : 'They have'} ${x.cuantas} in ${X.zona(p.id)}. Tap one to see it all.`;
    },
    guia: ['Here you see one person on the team: what they handle and how it is going.', 'You tap a deal to see it all.', 'This way you know where to lend a hand. They see this same thing in their app.'],
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return VETA.r7.lista([{icono: 'usuario', nombre: 'I cannot find this person', pasa: 'Go back to the team and choose another'}]);
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, ella = yo ? 'you' : x.p.corto;
      // arreglo FD: una pastilla en cada fila (lo que pasa, o si no, en qué paso va) y una sola línea: qué es la operación
      const filas = x.ops.map(o => { const t = pastillaDe(o) || [String(o.comoCorto || '').replace(/ \(\d de 5\)/, '').replace(/^Parada en /, ''), 'gris'];
        return {cara: o.id, nombre: o.nombre, pasa: o.texto, pastilla: t[0] || null, tono: t[1], ir: 'operacion/' + o.id}; });
      // lo que no es una operación, después y separado por un poco de aire
      const resto = [];
      const pend = x.baja ? `${x.pendientes} conversations are waiting for someone` : x.pendientes ? X.tocanTexto(x, yo).replace(/\.$/, '') : 'Nothing is pending for them today';
      // Montse también vende: lo que antes veía en “Hoy” y “Clientes” de la barra cuelga de aquí, con su nombre (ESTADO_R7_D1.md)
      resto.push(yo ? {icono: 'reloj', nombre: 'Your turn', pasa: pend, ir: 'hoy'} : {icono: 'reloj', nombre: 'What they have today', pasa: pend});
      if (yo) resto.push({icono: 'clientes', nombre: 'Your clients', pasa: 'The ones you have, with their profile', ir: 'clientes'});
      if (x.tarda) resto.push({icono: 'chat', nombre: 'How long they take to reply', pasa: X.tardaTexto(x, yo).split('. ')[0],
        abre: `<p>${esc(X.tardaTexto(x, yo))}</p><p class="d1-nota">We say “We reply within the day”. I count from when the client writes until ${yo ? 'you reply' : 'they reply'}, last week. It is an example.</p>`});
      const h = x.hace;
      const ap = x.aprendido.map(([id, t]) => { const r = id ? M.regla(id) : null; return {t, s: ESTADO[r ? r.estado : 'activa'] || ESTADO.activa}; });
      const hoy = p.id === 'laura' && VETA.r6 && VETA.r6.siempre ? VETA.r6.siempre() : null;
      if (hoy) ap.unshift({t: hoy.regla, s: 'They showed me today · I already do it this way'});
      // arreglo FD: lo que Veta hace por ella y lo que ha aprendido de ella, en una sola fila que se abre
      const hace = x.total ? `<p>${h.mensajes} messages, ${h.actas} ${h.actas === 1 ? 'viewing note' : 'viewing notes'} and ${h.avisos} alerts that I left ready for ${yo ? 'you' : 'them'} last week.</p>` : '';
      const apr = ap.length ? `<ul class="d1-aprende">${ap.map(a => `<li><b>${esc(a.t)}</b><span>${esc(a.s)}</span></li>`).join('')}</ul>` : '';
      resto.push({icono: 'aprende', oro: true, nombre: 'What Veta does for ' + ella, pasa: x.total ? `${x.total} things ready last week` : 'Nothing last week: off sick',
        abre: (hace + apr) || null});
      resto.push({icono: 'candado', nombre: yo ? 'The same for everyone' : x.p.corto + ' sees the same', pasa: yo ? 'Each person sees this about themselves' : 'You don\'t see their chats or notes'});
      resto.forEach(f => { if (f.abre == null) delete f.abre; });
      if (filas.length) resto[0].clase = 'd1-sep';
      return `<div class="d1-persona">${VETA.r7.lista(filas.map(f => VETA.r7.fila(f)).concat(resto.map(f => VETA.r7.fila(f))))}</div>`;
    },
    botonFijo: p => {
      const x = VETA.datos.personas[p.id] ? X.personaOps(p.id) : null;
      return x && x.baja ? VETA.r7.botones({texto: 'Pass her clients to someone else', ir: 'reparto'}) : '';
    }
  });
})();
