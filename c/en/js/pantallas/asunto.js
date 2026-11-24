/* Veta demo · ronda 8 · pantallas · asunto.js · carril D
   G2 · Un asunto · #/asunto/<id> — un contacto que no lleva nadie (Carmen López, Pau Ríos, Lucía Gómez) o una queja (Joan Serra).
   Dos tarjetas: lo que escribió (o por qué lo ves) y, en oro, lo que haría Veta. Una fila, “Lo que ha pasado”, abre su hoja (d-pasos).
   Un botón: hacer lo que propone Veta (“Dársela a Laura”). Lo demás, en “Más” (hoja d-asunto-mas): elegir a otra persona,
   dejarlo para luego o descartarlo (capacidad 15 de la A). Nota sobre el botón: decides tú.
   Al decidir: aviso con deshacer y vuelta a Inicio con una cosa menos. */
(function () {
  'use strict';
  const M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;
  const A = id => (VETA.datos.asuntos || {})[id] || VETA.datos.asuntos.carmen;
  const contacto = id => (VETA.datos.contactos || []).find(c => c.id === id) || {};
  const nombre = id => (M.quien(id) || {}).nombre || contacto(id).nombre || id;
  const ELLA = {carmen: true, lucia: true};                       // “Dársela” / “Dárselo”: cada frase va entera (en inglés no hay “la” ni “lo”)
  const ella = id => !!ELLA[id];

  // lo que haría Veta y por qué, en palabras de todos los días
  const PORQUE = {
    carmen: 'She is looking in Gràcia. You have a flat that suits her: Verdi 42, €395,000.',
    'pau-rios': 'The Eixample is close to him. You have no unit there: I note it down.',
    lucia: 'She has a flat in Sant Gervasi. She wants to sell: it is a new flat for the office.'
  };
  const propone = id => {
    const a = A(id);
    return a.tipo === 'queja' ? {de: 'I would ask Marc to call him today', texto: 'Marc handles the sale. With a call today, Joan knows someone is looking after it.'}
      : {de: ella(id) ? `I'd give her to ${X.persona(a.propone).corto}` : `I'd give him to ${X.persona(a.propone).corto}`, texto: PORQUE[id] || ''};
  };

  // ya decidido: asignado, aparcado (“Para luego”, “Descartarlo”) o, en la queja, pedido a Marc
  function resuelto(id) {
    const a = A(id);
    if (a.tipo === 'queja') { const c = M.cosa('d-joan'); return c && X.resuelta(c) ? {linea: (c.extra && c.extra.linea) || 'Asked Marc: call Joan Serra today', hora: c.hora} : null; }
    return X.asignado(id) || X.aparcado(id);
  }
  const dia = o => o.replace('Office WhatsApp · ', '').replace('WhatsApp · ', '');
  // tras decidir: aviso con deshacer, vuelta a la lista y el punto de la barra al día
  const hecho = (linea, deshacer) => {
    X.vuelve(); VETA.d1.numeros();
    setTimeout(() => VETA.aviso(linea, {deshacer: () => { deshacer(); VETA.repinta(); VETA.d1.numeros(); }}), 60);
  };
  const deshaz = id => { if (A(id).tipo === 'queja') M.deshaz('d-joan'); else if (X.aparcado(id)) X.desaparca(id); else X.desasigna(id); };
  // lo que comparte con su hoja “Más” (js/hojas/direccion.js)
  VETA.d1.asunto = {A, nombre, hecho, deshaz};

  VETA.pantalla('G2', {
    titulo: p => nombre(p.id),
    mas: p => resuelto(p.id) ? null : {hoja: 'd-asunto-mas', datos: {asunto: p.id}},
    nota: p => A(p.id).tipo === 'queja' ? 'I say what I\'d do. You decide.' : ella(p.id) ? 'I\'ll tell you who I\'d give her to. You decide.' : 'I\'ll tell you who I\'d give him to. You decide.',
    // lo que se le enseña a Veta si se toca el micro desde aquí
    casoDictado: p => ({de: 'asunto-' + p.id, quien: p.id, titulo: nombre(p.id), texto: propone(p.id).de + '. ' + propone(p.id).texto}),
    pinta: p => {
      const a = A(p.id), r = resuelto(p.id), corto = nombre(p.id).split(' ')[0];
      if (r) return r7.tarjeta({de: 'Decided' + (r.hora ? ' at ' + r.hora : ''), texto: r.linea, i: 0});
      // el cliente de otra persona (la queja de Joan, de Marc): dirección no lee su chat; lo sabe por su aviso
      let h = VETA.ajeno(a.contacto)
        ? r7.tarjeta({de: 'I know from your alert on ' + dia(a.pide.origen), texto: 'Ten days with no news about their home. They say they will go to another agency.', i: 0})
        : r7.tarjeta({de: corto + ' wrote ' + dia(a.pide.origen), texto: '“' + a.pide.texto + '”', i: 0});
      h += r7.tarjeta(Object.assign({veta: true, i: 1}, propone(p.id)));
      h += r7.lista([{nombre: 'What has happened', dato: a.paso.length, hoja: 'd-pasos', datos: {asunto: p.id}}], {i: 2});
      return h;
    },
    botonFijo: p => {
      const a = A(p.id);
      if (resuelto(p.id)) return r7.botones(null, {texto: 'Undo', accion: 'deshacer-asunto'});
      if (a.tipo === 'queja') return r7.botones({texto: 'Ask Marc to call him', accion: 'pedir'});
      return r7.botones({texto: ella(p.id) ? `Give her to ${X.persona(a.propone).corto}` : `Give him to ${X.persona(a.propone).corto}`, accion: 'asignar'});
    },
    acciones: {
      asignar(ev, el, p) {
        const id = p.id; X.asigna(id, A(id).propone);
        const r = X.asignado(id); hecho((r && r.linea) || 'Done.', () => X.desasigna(id));
      },
      pedir() { M.marca('d-joan', 'hecha'); hecho('Marc is asked to call Joan Serra today.', () => M.deshaz('d-joan')); },
      'deshacer-asunto'(ev, el, p) { deshaz(p.id); VETA.repinta(); VETA.d1.numeros(); }
    }
  });
})();
