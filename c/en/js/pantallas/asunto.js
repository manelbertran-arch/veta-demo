/* Veta demo · ronda 8 · pantallas · asunto.js · carril D
   G2 · Un asunto · #/asunto/<id> — un contacto que no lleva nadie (Carmen López, Pau Ríos, Lucía Gómez) o una queja (Joan Serra).
   Dos tarjetas: lo que escribió (o por qué lo ves) y, en oro, lo que haría Veta. Una fila, “Lo que ha pasado”, abre su hoja (d-pasos).
   Un botón: hacer lo que propone Veta (“Dársela a Laura”). Lo demás, en “Más” (hoja d-asunto-mas): elegir a otra persona,
   dejarlo para luego, enseñarle a Veta con este caso o descartarlo (capacidad 15 de la A). Nota sobre el botón: decides tú.
   Al decidir, el final de toda la app (D12): la pantalla se repinta en el sitio con “✓ Asignada a Laura · 9:41 · Deshacer” arriba y,
   en el pie, “Siguiente: Pau Ríos” (o “Ir a Inicio”). Sin aviso negro y sin “Deshacer” de botón. */
(function () {
  'use strict';
  const M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;
  const A = id => (VETA.datos.asuntos || {})[id] || null;   // un id que no existe no se pinta con los datos de otro (estado vacío en la pantalla)
  const contacto = id => (VETA.datos.contactos || []).find(c => c.id === id) || {};
  const nombre = id => (M.quien(id) || {}).nombre || contacto(id).nombre || '';   // nunca el id crudo
  const ELLA = {carmen: true, lucia: true};                       // “Dársela” / “Dárselo”: cada frase va entera (en inglés no hay “la” ni “lo”)
  const ella = id => !!ELLA[id];

  // lo que haría Veta y por qué, en palabras de todos los días
  const PORQUE = {
    carmen: 'Covers Gràcia. You have a flat that suits her: Verdi 42.',
    'pau-rios': 'The Eixample is close to him. You have no unit there: I note it down.',
    lucia: 'Marc covers Sant Gervasi. She wants to sell: it is a new flat for the office.'
  };
  const propone = id => {
    const a = A(id);
    return a.tipo === 'queja' ? {de: 'I would ask Marc to call him today', texto: 'Marc handles the sale. With a call today, Joan knows someone is looking after it.'}
      : {de: ella(id) ? `I'd give her to ${X.persona(a.propone).corto}` : `I'd give him to ${X.persona(a.propone).corto}`, texto: PORQUE[id] || ''};
  };

  // ya decidido: asignado, aparcado (“Para luego”, “Descartarlo”) o, en la queja, pedido a Marc
  function resuelto(id) {
    const a = A(id); if (!a) return null;
    if (a.tipo === 'queja') { const c = M.cosa('d-joan'); return c && X.resuelta(c) ? {linea: (c.extra && c.extra.linea) || 'Asked Marc: call Joan Serra today', corto: (c.extra && c.extra.corto) || 'Asked Marc: call him today', hora: c.hora} : null; }
    return X.asignado(id) || X.aparcado(id);
  }
  // lo que quiere, dicho por Veta, SIEMPRE: dirección no lee el texto de ningún contacto, ni el de la oficina sin dueño (M-29, 25-nov-2026): queda el hecho, sin cita.
  const QUIERE = {carmen: 'Looking for a 3-bedroom flat in Gràcia.', 'pau-rios': 'Asking about a place to rent in the Eixample.', lucia: 'Wants to sell her parents\' flat in Sant Gervasi.'};
  const dia = o => o.replace('Office WhatsApp · ', '').replace('WhatsApp · ', '');
  const elDia = t => /^(today|yesterday)/.test(t) ? t : 'on ' + t;      // “wrote yesterday, 19:10” · “wrote on Sat 21, 13:20”
  // tras decidir (aquí o en su hoja “Más”): la pantalla se repinta en el sitio con su “hecho”, y el punto de la barra se pone al día
  const hecho = id => { VETA.repinta({hecho: 'asunto-' + id}); VETA.d1.numeros(); };
  // lo decidido, sin repetir el nombre que ya está en la cabecera: “Asignada a Laura”, “Para luego”, “Le llamas tú”
  const corta = (r, n) => { const t = r.corto || String(r.linea || 'Done').replace(' · ' + n, '').replace(n + ' · ', '').replace(n + ', ', '').replace(/\.$/, ''); return t.charAt(0).toUpperCase() + t.slice(1); };
  const deshaz = id => { if (A(id).tipo === 'queja') M.deshaz('d-joan'); else if (X.aparcado(id)) X.desaparca(id); else X.desasigna(id); };
  // lo que comparte con su hoja “Más” (js/hojas/direccion.js)
  VETA.d1.asunto = {A, nombre, hecho, deshaz};

  VETA.pantalla('G2', {
    titulo: p => A(p.id) ? nombre(p.id) : 'Matter',   // un id que no existe no se pinta nunca en la cabecera
    mas: p => !A(p.id) || resuelto(p.id) ? null : {hoja: 'd-asunto-mas', datos: {asunto: p.id}},
    nota: p => !A(p.id) || resuelto(p.id) ? '' : A(p.id).tipo === 'queja' ? 'I say what I\'d do. You decide.' : ella(p.id) ? 'I\'ll tell you who I\'d give her to. You decide.' : 'I\'ll tell you who I\'d give him to. You decide.',
    // lo que se le enseña a Veta si se toca el micro desde aquí
    casoDictado: p => !A(p.id) ? null : ({de: 'asunto-' + p.id, quien: p.id, titulo: nombre(p.id), texto: propone(p.id).de + '. ' + propone(p.id).texto}),
    pinta: p => {
      const a = A(p.id);
      if (!a) return r7.vacio('I can\'t find this matter.');   // estado vacío honesto; “volver” lo pone la cabecera
      const r = resuelto(p.id), corto = nombre(p.id).split(' ')[0];
      // decidido: la fila de “hecho” arriba, con su “Deshacer”; debajo queda lo que escribió, sin la propuesta
      let h = r ? r7.hecho({texto: corta(r, nombre(p.id)), hora: r.hora ? VETA.fecha.hora(r.hora) : '', deshacer: 'deshacer-asunto', vt: 'asunto-' + p.id}) : '';
      // el cliente de otra persona (la queja de Joan, de Marc): dirección no lee su chat; lo sabe por su aviso
      h += a.tipo === 'queja' && VETA.ajeno(a.contacto)
        ? r7.tarjeta({de: 'I know from your alert on ' + dia(a.pide.origen), texto: 'Ten days with no news about his home. He says he will go to another agency.', i: 0})
        // ni el contacto sin dueño ni el que ya es de una agente: dirección ve el estado (quién es, qué pide en resumen de Veta, desde cuándo espera), nunca el texto
        : r7.tarjeta({de: corto + ' wrote ' + elDia(dia(a.pide.origen)), texto: (QUIERE[p.id] || 'Wrote to the office\'s WhatsApp.') + (r ? '' : ' No one has replied.'), i: 0});
      if (!r) h += r7.tarjeta(Object.assign({veta: true, i: 1}, propone(p.id)));
      h += r7.lista([{nombre: 'What has happened', dato: a.paso.length, hoja: 'd-pasos', datos: {asunto: p.id}}], {i: 2});
      return h;
    },
    botonFijo: p => {
      const a = A(p.id); if (!a) return '';
      if (resuelto(p.id)) return r7.sigue(VETA.d1.siguiente());
      if (a.tipo === 'queja') return r7.botones({texto: 'Ask Marc to call him', accion: 'pedir'});
      return r7.botones({texto: ella(p.id) ? `Give her to ${X.persona(a.propone).corto}` : `Give him to ${X.persona(a.propone).corto}`, accion: 'asignar'});
    },
    acciones: {
      asignar(ev, el, p) {
        X.asigna(p.id, A(p.id).propone); hecho(p.id);
      },
      pedir(ev, el, p) { M.marca('d-joan', 'hecha'); hecho(p.id); },
      'deshacer-asunto'(ev, el, p) { deshaz(p.id); hecho(p.id); },
      'd-sigue': (ev, el) => VETA.d1.sigue(ev, el)
    }
  });
})();
