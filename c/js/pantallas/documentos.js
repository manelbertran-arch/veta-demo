/* Veta demo · pantallas · documentos.js · B (Clientes) · ronda 8
   - A6d · Papeles y fechas · #/cliente/<id>/documentos. Subtítulo: en qué punto va su operación. Dos listas con rótulo:
     «Papeles» (los que faltan, con la pastilla roja «Falta», y los que ya tienes) y «Fechas».
     Abajo, un botón: «Pedírselo a <nombre>» (H14); lo segundo, «Ya lo tengo», va de enlace al final. Pedido ya, el botón es «Ya lo tengo».
     Un papel recibido que se puede volver a pedir abre la hoja `b-doc` («Ponerlo como que falta»).
     Marcar recibido o reabrir avisa con «Deshacer». Claves de estado: b.docs, b.pedidos. */
(function () {
  'use strict';
  const UI = VETA.UI, B = VETA.B, M = VETA.modelo, r7 = VETA.r7;
  const pedible = id => B.faltan(id).find(d => d.pedir && !d.pedido);
  const sinFalta = d => String(d.falta || d.texto).replace(/^Falta /, '');
  // lo que se pidió desde aquí (no desde su tarjeta de lo que te toca): se puede decir «No se lo envié»
  const pedidoAqui = id => B.faltan(id).find(x => x.pedido && !x.cosa);
  const sitio = () => (VETA.yo().papel === 'direccion' ? '«Te toca a ti»' : 'Inicio');

  function papeles(c) {
    const docs = B.docs(c.id);
    return docs.filter(d => d.estado === 'falta').map(d => d.pedido ? {nombre: d.texto, pasa: `Se lo pediste hoy, a las ${d.pedido.hora}`, dato: 'Pedido'}
      : {nombre: d.texto, pasa: d.plazo || ('Plazo: ' + d.fecha), pastilla: 'Falta'})
      .concat(docs.filter(d => d.estado !== 'falta').map(d => ({nombre: d.texto, pasa: d.hora ? 'Recibido hoy, a las ' + d.hora : (d.cuando || 'Recibido'),
        hoja: d.reabrir ? 'b-doc' : null, de: d.reabrir ? c.id : null, datos: d.reabrir ? {k: d.k} : null})));
  }

  VETA.pantalla('A6d', {
    titulo: 'Papeles y fechas',
    sub: p => { const c = M.cliente(p.id); return c && !VETA.ajeno(c.id) && c.operacion && c.operacion.texto || ''; },
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'No encuentro a este cliente.'});
      if (VETA.ajeno(c.id)) return UI.vacio({titulo: `Lo lleva ${(M.persona(c.lleva) || {}).corto || 'otra persona'}.`, texto: 'Sus papeles y sus fechas con este cliente no salen en dirección.'});
      const pp = papeles(c), ff = B.fechas(c.id).map(f => ({nombre: f.cuando, pasa: f.texto}));
      if (!pp.length && !ff.length) return UI.vacio({titulo: 'No hay papeles ni fechas.', texto: `Cuando haga falta alguno, te lo pongo aquí y en ${sitio()}.`});
      const d = pedible(c.id), ped = pedidoAqui(c.id);
      return (pp.length ? r7.lista(pp, {rotulo: 'Papeles'}) : '') + (ff.length ? r7.lista(ff, {rotulo: 'Fechas'}) : '') +
        (d ? r7.enlace({texto: 'Ya lo tengo', accion: 'doc-recibido', datos: {k: d.k}}) : ped ? r7.enlace({texto: 'No se lo envié', accion: 'doc-no-pedido', datos: {k: ped.k}}) : '');
    },
    botonFijo: p => {
      const c = M.cliente(p.id); if (!c || VETA.ajeno(c.id)) return '';   // dirección no escribe al cliente de otra persona
      const d = pedible(c.id), f = B.faltan(c.id)[0];
      if (d) return r7.botones({texto: `Pedírselo a ${B.corto(c)}`, hoja: 'h14', de: c.id, datos: {k: d.k}});
      return f ? r7.botones({texto: 'Ya lo tengo', accion: 'doc-recibido', datos: {k: f.k}}) : '';
    },
    acciones: {
      'doc-recibido'(ev, el, p) { cambia(p.id, el.dataset.k, 'recibido'); },
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
    VETA.repinta();
    VETA.aviso(estado === 'recibido' ? `Apuntado: ya tienes ${sinFalta(d).toLowerCase()}.` : `Vuelve a faltar: ${String(d.texto || '').toLowerCase()}.`,
      {deshacer: () => { B.ponEn('docs', key, ant); VETA.repinta(); }});
  }

  // ---- hoja de un papel ya recibido que se puede volver a pedir (nace de su fila) ----
  VETA.hojaAcciones('b-doc', {
    titulo: d => (B.docs(d.de).find(x => x.k === d.k) || {}).texto || 'Papeles y fechas',
    texto: 'Si te lo tienen que volver a mandar, lo vuelvo a poner como que falta.',
    opciones: d => [{texto: 'Ponerlo como que falta', hace: () => cambia(d.de, d.k, 'falta')}]
  });
})();
