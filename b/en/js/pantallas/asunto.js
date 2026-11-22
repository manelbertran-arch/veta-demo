/* Veta demo · ronda 7 · pantallas · asunto.js · D1
   G2 · Un asunto · #/asunto/<id> — un contacto que no lleva nadie (Carmen López, Pau Ríos, Lucía Gómez) o una queja (Joan Serra).
   Ficha (R2): lo que ha pasado (su mensaje, o por qué lo ves), en oro lo que haría Veta y por qué, y una fila que se abre con los pasos.
   Botones (R4): el negro hace lo que propone Veta (“Dársela a Laura”); el claro, “Elegir a otra persona” (H35, también “Tú”).
   Al decidir: aviso con deshacer, vuelta a Decidir con una menos y el número nuevo en caja y barra. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  const A = id => (VETA.datos.asuntos || {})[id] || VETA.datos.asuntos.carmen;
  const contacto = id => (VETA.datos.contactos || []).find(c => c.id === id) || {};
  const nombre = id => (M.quien(id) || {}).nombre || contacto(id).nombre || id;
  const ELLA = {carmen: true, lucia: true};                       // “Dársela” / “Dárselo”
  const la = id => ELLA[id] ? 'her' : 'him';

  // lo que haría Veta y por qué, en palabras de todos los días
  const PORQUE = {
    carmen: 'She is looking in Gràcia. You have a flat that suits her: Verdi 42, €395,000.',
    'pau-rios': 'The Eixample is close to him. You have no premises there: I note it down.',
    lucia: 'She has a flat in Sant Gervasi. She wants to sell: it is a new flat for the office.'
  };

  function resuelto(id) {
    const a = A(id);
    if (a.tipo === 'queja') { const c = M.cosa('d-joan'); return c && X.resuelta(c) && c.estado !== 'para-manana' ? {linea: (c.extra && c.extra.linea) || 'Asked Marc: call Joan Serra today', hora: c.hora} : null; }
    return X.asignado(id);
  }
  const dia = o => o.replace('WhatsApp from the office · ', '').replace('WhatsApp · ', '');
  const pasos = a => `<ol class="d1-pasos">${a.paso.map(p => `<li><b>${esc(p.cuando)}</b><span>${esc(p.texto)}</span></li>`).join('')}</ol>`;
  // tras decidir: aviso con deshacer, vuelta a la lista y números nuevos
  const hecho = (linea, deshacer) => {
    X.vuelve(); VETA.d1.numeros();
    setTimeout(() => VETA.aviso(linea, {deshacer: () => { deshacer(); VETA.repinta(); VETA.d1.numeros(); }}), 60);
  };

  VETA.pantalla('G2', {
    titulo: p => nombre(p.id),
    cabDerecha: p => VETA.av(p.id, 32, {foco: 'foto'}),
    frase: p => {
      if (resuelto(p.id)) return 'It is decided. If you got it wrong, you can undo it.';
      return A(p.id).tipo === 'queja' ? 'An owner is complaining. I tell you what I would do. You decide.'
        : `No one has ${la(p.id)}. I tell you who I would give ${la(p.id)} to. You decide.`;
    },
    guia: ['Here you see what happened and what I would do.', 'You decide with one tap or you choose someone else.', 'This way no one is left waiting.'],
    pinta: p => {
      const a = A(p.id), r = resuelto(p.id), nom = nombre(p.id), corto = nom.split(' ')[0];
      if (r) return `<div class="r7-ficha d1-hecho"><span class="r7-ficha-de">Decided${r.hora ? ' at ' + esc(r.hora) : ''}</span><p>${VETA.ic('check', 18)} ${esc(r.linea)}</p></div>`;
      let h;
      // el cliente de otra persona (la queja de Joan, de Marc): dirección no lee su chat; lo sabe por su aviso
      if (VETA.ajeno(a.contacto)) h = `<div class="r7-ficha"><span class="r7-ficha-de">I know because of your alert on ${esc(dia(a.pide.origen))}</span>` +
        `<p>Ten days with no news about their home. They say they will go to another agency.</p></div>`;
      else h = `<div class="r7-ficha"><span class="r7-ficha-de">${esc(corto)} wrote ${esc(dia(a.pide.origen))}</span><p>“${esc(a.pide.texto)}”</p></div>`;
      // lo que haría Veta, en oro, con “Enséñale a Veta” a mano
      const quien = a.tipo === 'queja' ? 'I would ask Marc to call him today' : `I would give ${la(p.id)} to ${X.persona(a.propone).corto}`;
      const porque = a.tipo === 'queja' ? 'Marc handles the sale. With a call today, Joan knows someone is looking after it.'
        : (PORQUE[p.id] || '');
      h += `<div class="r7-ficha r7-oro"><span class="r7-ficha-de">${esc(quien)}</span><p>${esc(porque)}</p>${VETA.r7.ensena({texto: 'Show me how you would do it'})}</div>`;
      h += VETA.r7.lista([{icono: 'reloj', nombre: 'What has happened', pasa: a.paso.length + ' steps, since ' + a.paso[0].cuando.toLowerCase(), abre: pasos(a)}]);
      return `<div class="d1-asunto">${h}</div>`;
    },
    botonFijo: p => {
      const a = A(p.id);
      if (resuelto(p.id)) return VETA.r7.botones(null, [{texto: 'Undo', accion: 'deshacer-asunto'}]);
      if (a.tipo === 'queja') return VETA.r7.botones({texto: 'Ask Marc to call him today', accion: 'pedir'},
        [{texto: 'I\'ll call him', accion: 'yo'}, {texto: 'For later', hoja: 'h02', de: 'd-joan'}]);
      return VETA.r7.botones({texto: `Give ${la(p.id)} to ${X.persona(a.propone).corto}`, accion: 'asignar'},
        [{texto: 'Choose someone else', hoja: 'h35', datos: {para: p.id}}]);
    },
    acciones: {
      asignar(ev, el, p) {
        const id = p.id; X.asigna(id, A(id).propone);
        const r = X.asignado(id); hecho((r && r.linea) || 'Done.', () => X.desasigna(id));
      },
      pedir() { M.marca('d-joan', 'hecha'); hecho('Marc is asked to call Joan Serra today.', () => M.deshaz('d-joan')); },
      yo(ev, el, p) {
        if (A(p.id).tipo === 'queja') { M.marca('d-joan', 'quitada', {linea: 'Joan Serra · you call him'}); hecho('Joan Serra: you call him.', () => M.deshaz('d-joan')); }
        else { const id = p.id; X.asigna(id, 'montse'); hecho(nombre(id) + ': you take it.', () => X.desasigna(id)); }
      },
      'deshacer-asunto'(ev, el, p) {
        if (A(p.id).tipo === 'queja') M.deshaz('d-joan'); else X.desasigna(p.id);
        VETA.repinta(); VETA.d1.numeros();
      }
    }
  });
})();
