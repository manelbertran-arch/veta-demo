/* Veta demo · ronda 7 · pantallas · persona.js · D1
   G19 · Una persona del equipo · #/persona/:id — una lista (R2, R3): primero sus operaciones (cara del cliente, qué es,
   en qué paso va y una pastilla si hace falta), y al final, en filas, lo que tiene hoy, cuánto tarda en contestar, lo que
   Veta hace por ella, lo que ha aprendido de ella y qué ve ella. Sin podio ni comparar con nadie: cada cifra es suya.
   Si está de baja: el botón negro «Pasar sus clientes a otra persona» (reparto). Datos: VETA.dir.personaOps. */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, M = VETA.modelo;
  const ESTADO = {activa: 'Ya lo hago yo', 'a-prueba': 'Lo estoy probando', propuesta: 'Se lo he propuesto'};
  // la pastilla de cada operación: corta; en rojo solo cuando alguien espera respuesta o no la lleva nadie (R5)
  const PASTILLA = {'sin-contestar': ['Sin contestar', 'rojo'], nadie: ['Nadie la lleva', 'rojo'], queja: ['Queja', 'gris'], parada: ['Parada', 'gris'], papel: ['Falta un papel', 'gris'], espera: ['Esperando', 'gris']};
  const pastillaDe = o => o.aviso ? (PASTILLA[o.aviso.tipo] || [o.aviso.texto.split(' · ')[0], o.aviso.tono === 'rojo' ? 'rojo' : 'gris']) : o.nota ? ['Contestada', 'gris'] : null;

  VETA.pantalla('G19', {
    titulo: p => { const x = X.persona(p.id); return p.id === VETA.yo().id ? 'Tú' : (x.nombre || 'Una persona'); },
    cabDerecha: p => VETA.datos.personas[p.id] ? VETA.d1.cara(p.id, 32) : '',
    frase: p => {
      if (!VETA.datos.personas[p.id]) return '';
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, n = x.ops.length;
      if (x.baja) return `${x.baja}. Sus clientes esperan: pásalos a otra persona.`;
      if (!n) return `${yo ? 'Ahora no llevas' : 'Ahora no lleva'} ninguna operación.`;
      return `${yo ? 'Llevas' : 'Lleva'} ${x.cuantas} en ${X.zona(p.id)}. Toca una y la ves entera.`;
    },
    guia: ['Aquí ves a una persona del equipo: lo que lleva y cómo va.', 'Tocas una operación para verla entera.', 'Así sabes dónde echar una mano. Ella ve esto mismo en su app.'],
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return VETA.r7.lista([{icono: 'usuario', nombre: 'No encuentro a esta persona', pasa: 'Vuelve al equipo y elige otra'}]);
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, ella = yo ? 'ti' : x.p.corto;
      // arreglo FD: una pastilla en cada fila (lo que pasa, o si no, en qué paso va) y una sola línea: qué es la operación
      const filas = x.ops.map(o => { const t = pastillaDe(o) || [String(o.comoCorto || '').replace(/ \(\d de 5\)/, '').replace(/^Parada en /, ''), 'gris'];
        return {cara: o.id, nombre: o.nombre, pasa: o.texto, pastilla: t[0] || null, tono: t[1], ir: 'operacion/' + o.id}; });
      // lo que no es una operación, después y separado por un poco de aire
      const resto = [];
      const pend = x.baja ? `${x.pendientes} conversaciones esperan a alguien` : x.pendientes ? X.tocanTexto(x, yo).replace(/\.$/, '') : 'Hoy no tiene nada pendiente';
      // Montse también vende: lo que antes veía en «Hoy» y «Clientes» de la barra cuelga de aquí, con su nombre (ESTADO_R7_D1.md)
      resto.push(yo ? {icono: 'reloj', nombre: 'Te toca a ti', pasa: pend, ir: 'hoy'} : {icono: 'reloj', nombre: 'Lo que tiene hoy', pasa: pend});
      if (yo) resto.push({icono: 'clientes', nombre: 'Tus clientes', pasa: 'Los que llevas tú, con su ficha', ir: 'clientes'});
      if (x.tarda) resto.push({icono: 'chat', nombre: 'Cuánto tarda en contestar', pasa: X.tardaTexto(x, yo).split('. ')[0],
        abre: `<p>${esc(X.tardaTexto(x, yo))}</p><p class="d1-nota">Decimos «Contestamos en el día». Cuento desde que el cliente escribe hasta que ${yo ? 'contestas' : 'contesta'}, la semana pasada. Es un ejemplo.</p>`});
      const h = x.hace;
      const ap = x.aprendido.map(([id, t]) => { const r = id ? M.regla(id) : null; return {t, s: ESTADO[r ? r.estado : 'activa'] || ESTADO.activa}; });
      const hoy = p.id === 'laura' && VETA.r6 && VETA.r6.siempre ? VETA.r6.siempre() : null;
      if (hoy) ap.unshift({t: hoy.regla, s: 'Me lo enseñó hoy · ya lo hago así'});
      // arreglo FD: lo que Veta hace por ella y lo que ha aprendido de ella, en una sola fila que se abre
      const hace = x.total ? `<p>${h.mensajes} mensajes, ${h.actas} ${h.actas === 1 ? 'acta de visita' : 'actas de visita'} y ${h.avisos} avisos que ${yo ? 'te' : 'le'} dejé listos la semana pasada.</p>` : '';
      const apr = ap.length ? `<ul class="d1-aprende">${ap.map(a => `<li><b>${esc(a.t)}</b><span>${esc(a.s)}</span></li>`).join('')}</ul>` : '';
      resto.push({icono: 'aprende', oro: true, nombre: 'Lo que Veta hace por ' + ella, pasa: x.total ? `${x.total} cosas listas la semana pasada` : 'La semana pasada, nada: está de baja',
        abre: (hace + apr) || null});
      resto.push({icono: 'candado', nombre: yo ? 'Lo mismo para todos' : x.p.corto + ' ve esto mismo', pasa: yo ? 'Cada persona ve esto de sí misma' : 'No ves sus chats ni sus notas'});
      resto.forEach(f => { if (f.abre == null) delete f.abre; });
      if (filas.length) resto[0].clase = 'd1-sep';
      return `<div class="d1-persona">${VETA.r7.lista(filas.map(f => VETA.r7.fila(f)).concat(resto.map(f => VETA.r7.fila(f))))}</div>`;
    },
    botonFijo: p => {
      const x = VETA.datos.personas[p.id] ? X.personaOps(p.id) : null;
      return x && x.baja ? VETA.r7.botones({texto: 'Pasar sus clientes a otra persona', ir: 'reparto'}) : '';
    }
  });
})();
