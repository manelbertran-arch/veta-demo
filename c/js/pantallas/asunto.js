/* Veta demo · ronda 7 · pantallas · asunto.js · D1
   G2 · Un asunto · #/asunto/<id> — un contacto que no lleva nadie (Carmen López, Pau Ríos, Lucía Gómez) o una queja (Joan Serra).
   Ficha (R2): lo que ha pasado (su mensaje, o por qué lo ves), en oro lo que haría Veta y por qué, y una fila que se abre con los pasos.
   Botones (R4): el negro hace lo que propone Veta («Dársela a Laura»); el claro, «Elegir a otra persona» (H35, también «Tú»).
   Al decidir: aviso con deshacer, vuelta a Decidir con una menos y el número nuevo en caja y barra. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  const A = id => (VETA.datos.asuntos || {})[id] || VETA.datos.asuntos.carmen;
  const contacto = id => (VETA.datos.contactos || []).find(c => c.id === id) || {};
  const nombre = id => (M.quien(id) || {}).nombre || contacto(id).nombre || id;
  const ELLA = {carmen: true, lucia: true};                       // «Dársela» / «Dárselo»
  const la = id => ELLA[id] ? 'la' : 'lo';

  // lo que haría Veta y por qué, en palabras de todos los días
  const PORQUE = {
    carmen: 'Lleva Gràcia. Tenéis un piso que le encaja: Verdi 42, 395.000 €.',
    'pau-rios': 'El Eixample le queda cerca. No tenéis ningún local ahí: lo dejo apuntado.',
    lucia: 'Lleva Sant Gervasi. Quiere vender: es un piso nuevo para la oficina.'
  };

  function resuelto(id) {
    const a = A(id);
    if (a.tipo === 'queja') { const c = M.cosa('d-joan'); return c && X.resuelta(c) && c.estado !== 'para-manana' ? {linea: (c.extra && c.extra.linea) || 'Pedido a Marc: llamar a Joan Serra hoy', hora: c.hora} : null; }
    return X.asignado(id);
  }
  const dia = o => o.replace('WhatsApp de la oficina · ', '').replace('WhatsApp · ', '');
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
      if (resuelto(p.id)) return 'Ya está decidido. Si te equivocaste, puedes deshacerlo.';
      return A(p.id).tipo === 'queja' ? 'Un propietario se queja. Te digo qué haría yo. Tú decides.'
        : `No ${la(p.id)} lleva nadie. Te digo a quién se ${la(p.id)} daría yo. Tú decides.`;
    },
    guia: ['Aquí ves qué ha pasado y qué haría yo.', 'Tú decides con un toque o eliges a otra persona.', 'Así nadie se queda esperando.'],
    pinta: p => {
      const a = A(p.id), r = resuelto(p.id), nom = nombre(p.id), corto = nom.split(' ')[0];
      if (r) return `<div class="r7-ficha d1-hecho"><span class="r7-ficha-de">Decidido${r.hora ? ' a las ' + esc(r.hora) : ''}</span><p>${VETA.ic('check', 18)} ${esc(r.linea)}</p></div>`;
      let h;
      // el cliente de otra persona (la queja de Joan, de Marc): dirección no lee su chat; lo sabe por su aviso
      if (VETA.ajeno(a.contacto)) h = `<div class="r7-ficha"><span class="r7-ficha-de">Lo sé por tu aviso del ${esc(dia(a.pide.origen))}</span>` +
        `<p>Diez días sin noticias de su casa. Dice que se irá a otra agencia.</p></div>`;
      else h = `<div class="r7-ficha"><span class="r7-ficha-de">${esc(corto)} escribió ${esc(dia(a.pide.origen))}</span><p>«${esc(a.pide.texto)}»</p></div>`;
      // lo que haría Veta, en oro, con «Enséñale a Veta» a mano
      const quien = a.tipo === 'queja' ? 'Yo le pediría a Marc que le llame hoy' : `Yo se ${la(p.id)} daría a ${X.persona(a.propone).corto}`;
      const porque = a.tipo === 'queja' ? 'Marc lleva la venta. Con una llamada hoy, Joan sabe que alguien se ocupa.'
        : (PORQUE[p.id] || '');
      h += `<div class="r7-ficha r7-oro"><span class="r7-ficha-de">${esc(quien)}</span><p>${esc(porque)}</p>${VETA.r7.ensena({texto: 'Enséñame cómo lo harías tú'})}</div>`;
      h += VETA.r7.lista([{icono: 'reloj', nombre: 'Lo que ha pasado', pasa: a.paso.length + ' pasos, desde ' + a.paso[0].cuando.toLowerCase(), abre: pasos(a)}]);
      return `<div class="d1-asunto">${h}</div>`;
    },
    botonFijo: p => {
      const a = A(p.id);
      if (resuelto(p.id)) return VETA.r7.botones(null, [{texto: 'Deshacer', accion: 'deshacer-asunto'}]);
      if (a.tipo === 'queja') return VETA.r7.botones({texto: 'Pedir a Marc que le llame hoy', accion: 'pedir'},
        [{texto: 'Le llamo yo', accion: 'yo'}, {texto: 'Para luego', hoja: 'h02', de: 'd-joan'}]);
      return VETA.r7.botones({texto: `Dárse${la(p.id)} a ${X.persona(a.propone).corto}`, accion: 'asignar'},
        [{texto: 'Elegir a otra persona', hoja: 'h35', datos: {para: p.id}}]);
    },
    acciones: {
      asignar(ev, el, p) {
        const id = p.id; X.asigna(id, A(id).propone);
        const r = X.asignado(id); hecho((r && r.linea) || 'Hecho.', () => X.desasigna(id));
      },
      pedir() { M.marca('d-joan', 'hecha'); hecho('Pedido a Marc: llamar a Joan Serra hoy.', () => M.deshaz('d-joan')); },
      yo(ev, el, p) {
        if (A(p.id).tipo === 'queja') { M.marca('d-joan', 'quitada', {linea: 'Joan Serra · le llamas tú'}); hecho('Joan Serra: le llamas tú.', () => M.deshaz('d-joan')); }
        else { const id = p.id; X.asigna(id, 'montse'); hecho(nombre(id) + ': la llevas tú.', () => X.desasigna(id)); }
      },
      'deshacer-asunto'(ev, el, p) {
        if (A(p.id).tipo === 'queja') M.deshaz('d-joan'); else X.desasigna(p.id);
        VETA.repinta(); VETA.d1.numeros();
      }
    }
  });
})();
