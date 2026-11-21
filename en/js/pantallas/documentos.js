/* Veta demo · pantallas · documentos.js · paquete B (Clientes)
   - A6d · Documentos y fechas · #/cliente/<id>/documentos (P1): qué papeles faltan y qué fechas hay con este cliente.
   Acción principal: «Pedírselo a <nombre>» (H14) con el primer papel que falta y se le puede pedir. Sin faltas, sin botón.
   Estados: con faltas · «Recibido · … · Deshacer» · «Reabierta: … vuelve a Documentos · Deshacer» · todo recibido. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo;
  // la última acción sobre un papel se queda en su sitio hasta la siguiente
  const ultima = () => B.lee('docUltima', null);

  const pedible = id => B.faltan(id).find(d => d.pedir && !d.pedido);

  function papel(c, d, abierta) {
    const key = c.id + '|' + d.k, vt = 'b-doc-' + c.id + '-' + d.k;
    if (ultima() === key && d.cambiado) {
      const t = d.estado === 'recibido' ? `Received · ${d.texto}` : `Reopened: ${d.texto.toLowerCase()} goes back to Documents`;
      return UI.lineaHecho({texto: t, hora: d.hora, vt, boton: {texto: 'Undo', accion: 'doc-deshaz', datos: {k: d.k}}});
    }
    if (d.estado === 'falta') {
      const ped = d.pedido;
      return UI.tarjeta(`<div class="b-doc-cab"><span class="b-doc-t">${esc(d.texto)}</span>${UI.etiqueta('falta')}</div>` +
        `<p class="hoja-x tenue">${esc(d.plazo || ('Deadline: ' + d.fecha))}</p>` +
        (ped ? UI.lineaHecho({texto: `Requested from ${B.corto(c)}`, hora: ped.hora, hoja: 'h03', de: d.cosa || null, boton: {texto: 'I didn\'t send it', accion: 'doc-no-pedido', datos: {k: d.k}}}) : '') +
        UI.botones([{texto: 'Mark received', accion: 'doc-recibido', datos: {k: d.k}}]), {clase: 'b-doc' + (abierta ? ' abierta' : ''), vt});
    }
    return `<div class="fila fila-quieta b-doc-fila" data-vt="${esc(vt)}"><span class="fila-ic">${VETA.ic('check', 22)}</span>` +
      `<span class="fila-c"><span class="fila-t">${esc(d.texto)}</span><span class="fila-s">${esc(d.hora ? 'Received today, ' + d.hora : d.cuando || 'Received')}</span></span>` +
      (d.reabrir ? UI.boton({tipo: 'texto', texto: 'Reopen', accion: 'doc-reabre', datos: {k: d.k}, ancho: false}) : '') + '</div>';
  }

  VETA.pantalla('A6d', {
    titulo: 'Documents and dates',
    guia: ['Here you see what paperwork is missing and what dates there are with this client.', 'You ask for what\'s missing or mark it received.', 'That way no deadline passes without you seeing it.'],
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'I can\'t find this client.', icono: 'pregunta', boton: {texto: 'Back', atras: true}});
      if (VETA.ajeno(c.id)) return UI.vacio({titulo: `Handled by ${(M.persona(c.lleva) || {}).corto || 'another person'}.`, texto: 'Their paperwork and dates with this client: that doesn\'t show in management.', icono: 'candado', boton: {texto: 'Back', atras: true}});
      const docs = B.docs(c.id), fechas = B.fechas(c.id);
      const faltan = docs.filter(d => d.estado === 'falta' || (ultima() === c.id + '|' + d.k && d.cambiado));
      const resto = docs.filter(d => !faltan.includes(d));
      const primera = faltan.find(d => d.estado === 'falta');
      let h = '';
      h += `<section class="bloque" data-i="0"><h2 class="bloque-t">Documents</h2>` +
        (faltan.length ? faltan.map(d => papel(c, d, d === primera)).join('') : '') +
        (!docs.some(d => d.estado === 'falta') ? UI.vacio({titulo: 'No paperwork missing.', texto: docs.length ? 'What you already have is down here.' : 'When something is needed, I\'ll put it here and in Today.', icono: 'check'}) : '') +
        (resto.length ? `<div class="lista b-docs">${resto.map(d => papel(c, d)).join('')}</div>` : '') + '</section>';
      h += UI.bloque({titulo: 'Dates', i: 1, html: fechas.length ? UI.lista(fechas.map(f => ({titulo: f.cuando, sub: f.texto, icono: 'cal'})))
        : `<p class="bloque-sub">No dates logged with ${esc(c.nombre)}.</p>`});
      return h;
    },
    botonFijo: p => {
      const c = M.cliente(p.id); const d = c && !VETA.ajeno(c.id) && pedible(c.id);   // dirección no escribe al cliente de otra persona
      return d ? UI.boton({texto: `Ask for it from ${B.corto(c)}`, hoja: 'h14', de: c.id, datos: {k: d.k}}) : '';
    },
    acciones: {
      'doc-recibido'(ev, el, p) { cambia(p.id, el.dataset.k, 'recibido'); },
      'doc-reabre'(ev, el, p) { cambia(p.id, el.dataset.k, 'falta'); },
      'doc-deshaz'(ev, el, p) {
        const key = p.id + '|' + el.dataset.k, m = B.mapa('docs')[key], prev = m && m.prev;
        B.ponEn('docs', key, prev || null); B.pon('docUltima', null); VETA.repinta({hecho: 'b-doc-' + p.id + '-' + el.dataset.k});
      },
      'doc-no-pedido'(ev, el, p) {
        const d = B.docs(p.id).find(x => x.k === el.dataset.k);
        if (d && d.cosa) M.deshaz(d.cosa); else B.ponEn('pedidos', p.id + '|' + el.dataset.k, null);
        VETA.repinta({hecho: 'b-doc-' + p.id + '-' + el.dataset.k});
      }
    }
  });
  function cambia(id, k, estado) {
    const key = id + '|' + k, ant = B.mapa('docs')[key] || null;
    B.ponEn('docs', key, {estado, hora: VETA.ahora(), prev: ant});
    B.pon('docUltima', key);
    VETA.repinta({hecho: 'b-doc-' + id + '-' + k});
  }
})();
