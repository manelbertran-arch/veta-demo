/* Veta demo · pantallas · documentos.js · B (Clientes) · ronda 7
   - A6d · Papeles y fechas · #/cliente/<id>/documentos. Una sola lista: en qué punto va su operación, los papeles que faltan,
     los que ya tienes y las fechas. Abajo: “Pedírselo a <nombre>” (H14, negro) y “Ya tengo …” (claro).
     Marcar recibido o reabrir avisa con “Deshacer”. Mismas claves de estado que antes (b.docs, b.docUltima, b.pedidos). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo;
  const pedible = id => B.faltan(id).find(d => d.pedir && !d.pedido);
  const sinFalta = d => String(d.falta || d.texto).replace(/^Falta /, '');

  function filas(c) {
    const docs = B.docs(c.id), fechas = B.fechas(c.id), o = c.operacion, l = [];
    if (o && o.texto) {
      const t = o.texto.split(' · ');
      l.push({icono: o.tipo ? 'casa' : 'pausa', nombre: t[0], pasa: t.slice(1).join(' · ') || 'No steps yet'});
    }
    docs.filter(d => d.estado === 'falta').forEach(d => l.push({icono: 'papel', nombre: d.texto, pasa: d.pedido ? `You asked them for it today, at ${d.pedido.hora}` : (d.plazo || ('Deadline: ' + d.fecha)),
      pastilla: d.pedido ? 'Asked for' : 'Missing', tono: 'gris'}));
    docs.filter(d => d.estado !== 'falta').forEach(d => {
      const pasa = d.hora ? 'Received today, at ' + d.hora : (d.cuando || 'Received');
      l.push(d.reabrir ? {icono: 'check', nombre: d.texto, pasa, abre: `<p>If they have to send it again, I mark it as missing again.</p>` +
        UI.boton({tipo: 'texto', texto: 'Mark it as missing', accion: 'doc-reabre', datos: {k: d.k}, ancho: false})} : {icono: 'check', nombre: d.texto, pasa});
    });
    fechas.forEach(f => l.push({icono: 'cal', nombre: f.cuando, pasa: f.texto}));
    return l;
  }

  VETA.pantalla('A6d', {
    titulo: 'Documents and dates',
    frase: p => { const c = M.cliente(p.id); if (!c) return ''; const n = B.faltan(c.id).length;
      return n ? `${n === 1 ? 'Paper missing' : `${n} documents are missing`}. Ask ${B.corto(c)} for it from here.` : `You have all the documents of ${B.corto(c)}. Below, their dates.`; },
    guia: ['Here you see what paperwork is missing and what dates there are with this client.', 'You ask for what\'s missing or mark it received.', 'That way no deadline passes without you seeing it.'],
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'I can\'t find this client.', icono: 'pregunta'});
      if (VETA.ajeno(c.id)) return UI.vacio({titulo: `Handled by ${(M.persona(c.lleva) || {}).corto || 'another person'}.`, texto: 'Their documents and dates with this client do not show for management.', icono: 'candado'});
      const l = filas(c);
      return l.length ? VETA.r7.lista(l) : UI.vacio({titulo: 'No documents or dates.', texto: 'When one is needed, I put it here and in “Your turn”.', icono: 'check'});
    },
    botonFijo: p => {
      const c = M.cliente(p.id); if (!c || VETA.ajeno(c.id)) return '';   // dirección no escribe al cliente de otra persona
      const d = pedible(c.id), f = B.faltan(c.id)[0], ped = B.faltan(c.id).find(x => x.pedido && !x.cosa);
      const claros = [f ? {texto: 'I already have ' + sinFalta(f), accion: 'doc-recibido', datos: {k: f.k}} : null,
        ped ? {texto: 'I did not send it', accion: 'doc-no-pedido', datos: {k: ped.k}} : null].filter(Boolean);
      if (!d && !claros.length) return '';
      return VETA.r7.botones(d ? {texto: `Ask for it from ${B.corto(c)}`, hoja: 'h14', de: c.id, datos: {k: d.k}} : null, claros);
    },
    acciones: {
      'doc-recibido'(ev, el, p) { cambia(p.id, el.dataset.k, 'recibido'); },
      'doc-reabre'(ev, el, p) { cambia(p.id, el.dataset.k, 'falta'); },
      'doc-no-pedido'(ev, el, p) {
        const d = B.docs(p.id).find(x => x.k === el.dataset.k);
        if (d && d.cosa) M.deshaz(d.cosa); else B.ponEn('pedidos', p.id + '|' + el.dataset.k, null);
        VETA.repinta();
      }
    }
  });
  function cambia(id, k, estado) {
    const key = id + '|' + k, ant = B.mapa('docs')[key] || null, d = B.docs(id).find(x => x.k === k) || {};
    B.ponEn('docs', key, {estado, hora: VETA.ahora(), prev: ant});
    B.pon('docUltima', key);
    VETA.repinta();
    VETA.aviso(estado === 'recibido' ? `Noted: you now have ${sinFalta(d).toLowerCase()}.` : `Missing again: ${String(d.texto || '').toLowerCase()}.`,
      {deshacer: () => { B.ponEn('docs', key, ant); B.pon('docUltima', null); VETA.repinta(); }});
  }
})();
