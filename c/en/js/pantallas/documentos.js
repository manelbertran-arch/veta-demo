/* Veta demo · pantallas · documentos.js · B (Clientes) · ronda 8
   - A6d · Papeles y fechas · #/cliente/<id>/documentos. Subtítulo: en qué punto va su operación. Dos listas con rótulo:
     “Papeles” (los que faltan, con la pastilla roja “Falta”, y los que ya tienes) y “Fechas”.
     Todas las filas de “Papeles” se tocan y abren la hoja de ESE papel (`b-doc`): si falta, “Ya lo tengo” y “Pedírselo a <nombre>”
     (D11a: la acción vive en el papel al que se refiere); si ya lo tienes, “Ponerlo como que falta”. Las de “Fechas” son datos: ninguna se toca.
     Abajo, un botón: “Pedírselo a <nombre>” (H14). Si ya no hay nada que pedir y aún falta uno, “Ya tengo <el papel>”, con su nombre.
     Marcar recibido o reabrir cambia la fila en el sitio y avisa con “Deshacer”. Claves de estado: b.docs, b.pedidos. */
(function () {
  'use strict';
  const B = VETA.B, M = VETA.modelo, r7 = VETA.r7;
  const pedibles = id => B.faltan(id).filter(d => d.pedir && !d.pedido);
  // “Ya lo tengo” o “Ya la tengo”, según el papel (“Falta la nómina”)
  const yaLoTengo = d => (/^Falta la /.test(d.falta || '') ? 'I already have it' : 'I have it now');
  const sitio = () => (VETA.yo().papel === 'direccion' ? '“Your turn”' : 'Home');

  // la segunda línea de un papel: su plazo, cuándo lo pediste o cuándo llegó
  const estadoDe = d => d.estado === 'falta' ? (d.pedido ? `You asked for it ${B.hoy(d.pedido.hora, true)}` : d.plazo || (d.cambiado ? 'Missing again' : d.fecha ? 'Deadline: ' + d.fecha : 'Missing'))
    : d.hora ? `Arrived ${B.hoy(d.hora, true)}` : d.cuando || 'You have it';
  function papeles(c) {
    const docs = B.docs(c.id), fila = d => ({nombre: d.texto, pasa: estadoDe(d), pastilla: d.estado === 'falta' ? 'Missing' : null, hoja: 'b-doc', de: c.id, datos: {k: d.k}});
    return docs.filter(d => d.estado === 'falta').concat(docs.filter(d => d.estado !== 'falta')).map(fila);
  }

  // lo último que hiciste aquí, como único final: arriba, la fila ✓ con lo hecho, su hora y “Deshacer” (B.ultDoc lo pone “Pedírselo” o este cambio)
  function ultimo(c) {
    const u = B.ultDoc; if (!u || u.id !== c.id) return '';
    const d = B.docs(c.id).find(x => x.k === u.k); if (!d) return '';
    if (u.tipo === 'pedido') return d.pedido ? r7.hecho({texto: `Requested from ${B.corto(c)}`, hora: d.pedido.hora, deshacer: {accion: 'pedido-deshaz', datos: {k: d.k}}}) : '';
    const m = B.mapa('docs')[c.id + '|' + u.k];
    return m ? r7.hecho({texto: m.estado === 'recibido' ? 'Marked as received' : 'Missing again', hora: m.hora, deshacer: {accion: 'doc-deshaz', datos: {k: u.k}}}) : '';
  }

  VETA.pantalla('A6d', {
    titulo: 'Documents and dates',
    sub: p => { const c = M.cliente(p.id); return c && !VETA.ajeno(c.id) && c.operacion && c.operacion.texto || ''; },
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return r7.vacio('I can\'t find this client.');
      if (VETA.ajeno(c.id)) return r7.vacio(`${(M.persona(c.lleva) || {}).corto || 'another person'} handles their documents.`);
      const pp = papeles(c), ff = B.fechas(c.id).map(f => ({nombre: f.cuando, pasa: f.texto}));
      if (!pp.length && !ff.length) return r7.vacio(`If a document is needed, I'll put it in ${sitio()} for you.`);
      return ultimo(c) + (pp.length ? r7.lista(pp, {rotulo: 'Documents'}) : '') + (ff.length ? r7.lista(ff, {rotulo: 'Dates'}) : '');
    },
    botonFijo: p => {
      const c = M.cliente(p.id); if (!c || VETA.ajeno(c.id)) return '';   // dirección no escribe al cliente de otra persona
      const pd = pedibles(c.id), f = B.faltan(c.id)[0];
      // con un solo papel que pedir, “Pedírselo” se entiende (es la única fila en rojo); con más, el botón dice cuál
      if (pd.length) return r7.botones({texto: pd.length === 1 ? `Ask for it from ${B.corto(c)}` : `Ask them for ${B.sinFalta(pd[0])}`, hoja: 'h14', de: c.id, datos: {k: pd[0].k}});
      return f ? r7.botones({texto: `I already have ${B.sinFalta(f)}`, accion: 'doc-recibido', datos: {k: f.k}}) : '';
    },
    acciones: {
      'doc-recibido'(ev, el, p) { cambia(p.id, el.dataset.k, 'recibido'); },
      'doc-deshaz'(ev, el, p) { const key = p.id + '|' + el.dataset.k, m = B.mapa('docs')[key]; B.ponEn('docs', key, (m && m.prev) || null); B.ultDoc = null; VETA.repinta(); },
      'pedido-deshaz'(ev, el, p) { noPedido(p.id, el.dataset.k); B.ultDoc = null; }
    }
  });
  function cambia(id, k, estado) {
    const key = id + '|' + k, ant = B.mapa('docs')[key] || null;
    B.ponEn('docs', key, {estado, hora: VETA.ahora(), prev: ant});
    B.ultDoc = {id, k, tipo: 'cambio'};
    VETA.repinta();
  }
  // “No se lo envié”: deshace una petición hecha desde aquí o desde su tarjeta
  function noPedido(id, k) {
    const d = B.docs(id).find(x => x.k === k);
    if (d && d.cosa) M.deshaz(d.cosa); else B.ponEn('pedidos', id + '|' + k, null);
    VETA.repinta();
  }
  B.noPedido = noPedido;
  window.addEventListener('hashchange', () => { B.ultDoc = null; });

  // ---- la hoja de un papel (nace de su fila): arriba, cómo está; debajo, lo que se puede hacer con él ----
  const docDe = d => B.docs(d.de).find(x => x.k === d.k) || {};
  VETA.hojaAcciones('b-doc', {
    titulo: d => docDe(d).texto || 'Documents and dates',
    texto: d => { const x = docDe(d); return x.k ? estadoDe(x) + '.' : ''; },
    opciones: d => {
      const x = docDe(d), c = M.cliente(d.de) || {};
      if (x.estado !== 'falta') return [{texto: 'Mark it as missing', hace: () => cambia(d.de, d.k, 'falta')}];
      return [{texto: yaLoTengo(x), hace: () => cambia(d.de, d.k, 'recibido')},
        x.pedir && !x.pedido ? {texto: `Ask for it from ${B.corto(c)}`, hoja: 'h14', datos: {k: x.k}} : null,
        x.pedido ? {texto: 'I did not send it', hace: () => noPedido(d.de, d.k)} : null];
    }
  });
})();
