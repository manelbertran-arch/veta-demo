/* Veta demo · pantallas · asunto.js · paquete D (Dirección)
   G2 · Un asunto · #/asunto/<id> — un contacto sin dueño (Carmen López, Pau Ríos, Lucía Gómez) o una queja (Joan Serra).
   Acción principal fija abajo (en ordenador, al pie del panel): “Asignar a Laura” o “Pedir a Marc que le llame hoy”. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  const A = id => (VETA.datos.asuntos || {})[id] || VETA.datos.asuntos.carmen;
  const contacto = id => (VETA.datos.contactos || []).find(c => c.id === id) || {};
  const nombre = id => (M.quien(id) || {}).nombre || contacto(id).nombre || id;

  const linea = (cuando, texto) => `<li class="d-paso"><span class="d-paso-c">${esc(cuando)}</span><span class="d-paso-t">${esc(texto)}</span></li>`;
  const pasos = a => `<ol class="d-pasos">${a.paso.map(p => linea(p.cuando, p.texto)).join('')}</ol>`;

  // estado resuelto del asunto (para la línea en el sitio y quitar el botón)
  function resuelto(id) {
    const a = A(id);
    if (a.tipo === 'queja') { const c = M.cosa('d-joan'); return c && X.resuelta(c) && c.estado !== 'para-manana' ? {linea: (c.extra && c.extra.linea) || 'Asked Marc: call Joan Serra today', hora: c.hora} : null; }
    return X.asignado(id);
  }

  VETA.pantalla('G2', {
    titulo: p => nombre(p.id),
    cabDerecha: p => VETA.av(p.id, 32, {foco: 'foto'}),
    guia: ['Here you see what has happened: what this person asks for and who can handle it.', 'You choose who handles it or take it yourself.', 'That way nobody is left waiting for a reply.'],
    pinta: p => {
      const a = A(p.id), r = resuelto(p.id), nom = nombre(p.id);
      let h = `<div class="d-asunto-cab" data-i="0">${UI.etiqueta('por-decidir', a.etiqueta)}</div>`;
      if (r) h += `<div data-i="0">${UI.lineaHecho({texto: r.linea, hora: r.hora, vt: 'asunto-' + p.id, boton: {texto: 'Undo', accion: 'deshacer-asunto'}})}</div>`;
      // el cliente de otra persona (la queja de Joan, de Marc): dirección no lee su chat; lo sabe por su aviso
      if (VETA.ajeno(a.contacto)) h += UI.bloque({titulo: 'Why you\'re seeing this', i: 1, html: UI.nota({texto: `I alerted you, as you asked: an owner is complaining · ${a.pide.origen.replace('WhatsApp · ', '')}. What they write in ${(VETA.datos.personas[a.lleva] || {}).corto || 'their agent'}'s chat does not show in Management.`, icono: 'campana', caja: true})});
      else h += UI.bloque({titulo: a.tipo === 'queja' ? 'What they said' : 'What they\'re asking for', i: 1, html: UI.cita({texto: a.pide.texto, origen: nom.split(' ')[0] + ' · ' + a.pide.origen, chat: a.contacto})});
      h += UI.bloque({titulo: 'What has happened', i: 2, html: pasos(a)});
      if (a.encaja) {
        const piso = VETA.datos.pisos[a.encaja.piso] || {};
        h += UI.bloque({titulo: 'Fits what you already have', i: 3, html: `<div class="d-encaja">${UI.foto(a.encaja.piso, {tam: 'mini', ampliar: true})}` +
          `<span class="d-encaja-c"><b>${esc(a.encaja.texto)}</b><span>${esc(a.encaja.pega)}</span><span class="d-encaja-z">${esc(piso.zona || '')}</span></span></div>`});
      } else if (a.noHay) h += UI.bloque({titulo: 'With what you already have', i: 3, html: UI.nota({texto: a.noHay, icono: 'info', caja: true})});
      if (a.tipo === 'queja') {
        h += UI.bloque({titulo: 'Who handles it', i: 4, html: UI.lista([{titulo: 'Marc Roca', sub: 'Sant Gervasi · handling the sale since October', av: 'marc'},
          {titulo: a.operacion, icono: 'pausa'}])});
      } else {
        h += UI.bloque({titulo: 'Who can handle it', i: 4, html: UI.lista(a.pueden.map(q => ({titulo: q.tu ? 'You' : X.persona(q.id).nombre, sub: q.sub, av: q.id,
          etiqueta: q.id === a.propone ? 'propuesta' : null, etiquetaTexto: q.id === a.propone ? 'I would give it to them' : null})))});
        h += UI.nota({texto: 'I do not write to anyone: whoever handles it decides when to reply and what to say.', icono: 'candado'});
      }
      return h;
    },
    botonFijo: p => {
      const a = A(p.id); if (resuelto(p.id)) return '';
      if (a.tipo === 'queja') return UI.boton({texto: 'Ask Marc to call him today', accion: 'pedir'}) +
        UI.botones([{texto: 'I\'ll call him', accion: 'yo'}, {texto: 'Something else…', hoja: 'h02', de: 'd-joan'}]);
      return UI.boton({texto: 'Give it to ' + X.persona(a.propone).corto, accion: 'asignar'}) +
        UI.botones([{texto: 'I\'ll handle it', accion: 'yo'}, {texto: 'Someone else', hoja: 'h35', datos: {para: p.id}}]);
    },
    acciones: {
      asignar(ev, el, p) { X.asigna(p.id, A(p.id).propone); X.vuelve(); },
      pedir(ev, el, p) { M.marca('d-joan', 'hecha'); X.vuelve(); },
      yo(ev, el, p) {
        if (A(p.id).tipo === 'queja') M.marca('d-joan', 'quitada', {linea: 'Joan Serra · you call him'});
        else X.asigna(p.id, 'montse');
        X.vuelve();
      },
      'deshacer-asunto'(ev, el, p) {
        if (A(p.id).tipo === 'queja') M.deshaz('d-joan'); else X.desasigna(p.id);
        VETA.repinta({hecho: 'asunto-' + p.id});
      }
    }
  });
})();
