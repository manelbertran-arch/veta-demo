/* Veta demo · pantallas · documentos.js · B (Clientes) · ronda 7
   - A6d · Papeles y fechas · #/cliente/<id>/documentos. Una sola lista: en qué punto va su operación, los papeles que faltan,
     los que ya tienes y las fechas. Abajo: «Pedírselo a <nombre>» (H14, negro) y «Ya tengo …» (claro).
     Marcar recibido o reabrir avisa con «Deshacer». Mismas claves de estado que antes (b.docs, b.docUltima, b.pedidos). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo;
  const pedible = id => B.faltan(id).find(d => d.pedir && !d.pedido);
  const sinFalta = d => String(d.falta || d.texto).replace(/^Falta /, '');

  function filas(c) {
    const docs = B.docs(c.id), fechas = B.fechas(c.id), o = c.operacion, l = [];
    if (o && o.texto) {
      const t = o.texto.split(' · ');
      l.push({icono: o.tipo ? 'casa' : 'pausa', nombre: t[0], pasa: t.slice(1).join(' · ') || 'Sin pasos todavía'});
    }
    docs.filter(d => d.estado === 'falta').forEach(d => l.push({icono: 'papel', nombre: d.texto, pasa: d.pedido ? `Se lo pediste hoy, a las ${d.pedido.hora}` : (d.plazo || ('Plazo: ' + d.fecha)),
      pastilla: d.pedido ? 'Pedido' : 'Falta', tono: 'gris'}));
    docs.filter(d => d.estado !== 'falta').forEach(d => {
      const pasa = d.hora ? 'Recibido hoy, a las ' + d.hora : (d.cuando || 'Recibido');
      l.push(d.reabrir ? {icono: 'check', nombre: d.texto, pasa, abre: `<p>Si te lo tienen que volver a mandar, lo vuelvo a poner como que falta.</p>` +
        UI.boton({tipo: 'texto', texto: 'Ponerlo como que falta', accion: 'doc-reabre', datos: {k: d.k}, ancho: false})} : {icono: 'check', nombre: d.texto, pasa});
    });
    fechas.forEach(f => l.push({icono: 'cal', nombre: f.cuando, pasa: f.texto}));
    return l;
  }

  VETA.pantalla('A6d', {
    titulo: 'Papeles y fechas',
    frase: p => { const c = M.cliente(p.id); if (!c) return ''; const n = B.faltan(c.id).length;
      return n ? `${n === 1 ? 'Falta un papel' : `Faltan ${n} papeles`}. Pídeselo a ${B.corto(c)} desde aquí.` : `Tienes todos los papeles de ${B.corto(c)}. Abajo, sus fechas.`; },
    guia: ['Aquí ves qué papeles faltan y qué fechas hay con este cliente.', 'Tú pides lo que falta o lo marcas recibido.', 'Así ningún plazo se pasa sin que lo veas.'],
    pinta: p => {
      const c = M.cliente(p.id);
      if (!c) return UI.vacio({titulo: 'No encuentro a este cliente.', icono: 'pregunta'});
      if (VETA.ajeno(c.id)) return UI.vacio({titulo: `Lo lleva ${(M.persona(c.lleva) || {}).corto || 'otra persona'}.`, texto: 'Sus papeles y sus fechas con este cliente no salen en dirección.', icono: 'candado'});
      const l = filas(c);
      return l.length ? VETA.r7.lista(l) : UI.vacio({titulo: 'No hay papeles ni fechas.', texto: 'Cuando haga falta alguno, te lo pongo aquí y en «Te toca a ti».', icono: 'check'});
    },
    botonFijo: p => {
      const c = M.cliente(p.id); if (!c || VETA.ajeno(c.id)) return '';   // dirección no escribe al cliente de otra persona
      const d = pedible(c.id), f = B.faltan(c.id)[0], ped = B.faltan(c.id).find(x => x.pedido && !x.cosa);
      const claros = [f ? {texto: 'Ya tengo ' + sinFalta(f), accion: 'doc-recibido', datos: {k: f.k}} : null,
        ped ? {texto: 'No se lo envié', accion: 'doc-no-pedido', datos: {k: ped.k}} : null].filter(Boolean);
      if (!d && !claros.length) return '';
      return VETA.r7.botones(d ? {texto: `Pedírselo a ${B.corto(c)}`, hoja: 'h14', de: c.id, datos: {k: d.k}} : null, claros);
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
    VETA.aviso(estado === 'recibido' ? `Apuntado: ya tienes ${sinFalta(d).toLowerCase()}.` : `Vuelve a faltar: ${String(d.texto || '').toLowerCase()}.`,
      {deshacer: () => { B.ponEn('docs', key, ant); B.pon('docUltima', null); VETA.repinta(); }});
  }
})();
