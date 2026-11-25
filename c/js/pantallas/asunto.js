/* Veta demo · ronda 8 · pantallas · asunto.js · carril D
   G2 · Un asunto · #/asunto/<id> — un contacto que no lleva nadie (Carmen López, Pau Ríos, Lucía Gómez) o una queja (Joan Serra).
   Dos tarjetas: lo que escribió (o por qué lo ves) y, en oro, lo que haría Veta. Una fila, «Lo que ha pasado», abre su hoja (d-pasos).
   Un botón: hacer lo que propone Veta («Dársela a Laura»). Lo demás, en «Más» (hoja d-asunto-mas): elegir a otra persona,
   dejarlo para luego, enseñarle a Veta con este caso o descartarlo (capacidad 15 de la A). Nota sobre el botón: decides tú.
   Al decidir, el final de toda la app (D12): la pantalla se repinta en el sitio con «✓ Asignada a Laura · 9:41 · Deshacer» arriba y,
   en el pie, «Siguiente: Pau Ríos» (o «Ir a Inicio»). Sin aviso negro y sin «Deshacer» de botón. */
(function () {
  'use strict';
  const M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;
  const A = id => (VETA.datos.asuntos || {})[id] || null;   // un id que no existe no se pinta con los datos de otro (estado vacío en la pantalla)
  const contacto = id => (VETA.datos.contactos || []).find(c => c.id === id) || {};
  const nombre = id => (M.quien(id) || {}).nombre || contacto(id).nombre || id;
  const ELLA = {carmen: true, lucia: true};                       // «Dársela» / «Dárselo»: cada frase va entera (en inglés no hay «la» ni «lo»)
  const ella = id => !!ELLA[id];

  // lo que haría Veta y por qué, en palabras de todos los días
  const PORQUE = {
    carmen: 'Lleva Gràcia. Tenéis un piso que le encaja: Verdi 42.',
    'pau-rios': 'El Eixample le queda cerca. No tenéis ningún local ahí: lo dejo apuntado.',
    lucia: 'Lleva Sant Gervasi. Quiere vender: es un piso nuevo para la oficina.'
  };
  const propone = id => {
    const a = A(id);
    return a.tipo === 'queja' ? {de: 'Yo le pediría a Marc que le llame hoy', texto: 'Marc lleva la venta. Con una llamada hoy, Joan sabe que alguien se ocupa.'}
      : {de: ella(id) ? `Yo se la daría a ${X.persona(a.propone).corto}` : `Yo se lo daría a ${X.persona(a.propone).corto}`, texto: PORQUE[id] || ''};
  };

  // ya decidido: asignado, aparcado («Para luego», «Descartarlo») o, en la queja, pedido a Marc
  function resuelto(id) {
    const a = A(id); if (!a) return null;
    if (a.tipo === 'queja') { const c = M.cosa('d-joan'); return c && X.resuelta(c) ? {linea: (c.extra && c.extra.linea) || 'Pedido a Marc: llamar a Joan Serra hoy', corto: (c.extra && c.extra.corto) || 'Pedido a Marc: llamarle hoy', hora: c.hora} : null; }
    return X.asignado(id) || X.aparcado(id);
  }
  // lo que quiere, dicho por Veta, SIEMPRE: dirección no lee el texto de ningún contacto, ni el de la oficina sin dueño (M-29, 25-nov-2026): queda el hecho, sin cita.
  const QUIERE = {carmen: 'Busca un piso de 3 habitaciones en Gràcia.', 'pau-rios': 'Pregunta por un local para alquilar en el Eixample.', lucia: 'Quiere vender el piso de sus padres en Sant Gervasi.'};
  const dia = o => o.replace('WhatsApp de la oficina · ', '').replace('WhatsApp · ', '');
  const elDia = t => /^(hoy|ayer)/.test(t) ? t : 'el ' + t;      // «escribió ayer, 19:10» · «escribió el sáb 21, 13:20»
  // tras decidir (aquí o en su hoja «Más»): la pantalla se repinta en el sitio con su «hecho», y el punto de la barra se pone al día
  const hecho = id => { VETA.repinta({hecho: 'asunto-' + id}); VETA.d1.numeros(); };
  // lo decidido, sin repetir el nombre que ya está en la cabecera: «Asignada a Laura», «Para luego», «Le llamas tú»
  const corta = (r, n) => { const t = r.corto || String(r.linea || 'Hecho').replace(' · ' + n, '').replace(n + ' · ', '').replace(n + ', ', '').replace(/\.$/, ''); return t.charAt(0).toUpperCase() + t.slice(1); };
  const deshaz = id => { if (A(id).tipo === 'queja') M.deshaz('d-joan'); else if (X.aparcado(id)) X.desaparca(id); else X.desasigna(id); };
  // lo que comparte con su hoja «Más» (js/hojas/direccion.js)
  VETA.d1.asunto = {A, nombre, hecho, deshaz};

  VETA.pantalla('G2', {
    titulo: p => A(p.id) ? nombre(p.id) : 'Asunto',   // un id que no existe no se pinta nunca en la cabecera
    mas: p => !A(p.id) || resuelto(p.id) ? null : {hoja: 'd-asunto-mas', datos: {asunto: p.id}},
    nota: p => !A(p.id) || resuelto(p.id) ? '' : A(p.id).tipo === 'queja' ? 'Te digo qué haría yo. Tú decides.' : ella(p.id) ? 'Te digo a quién se la daría yo. Tú decides.' : 'Te digo a quién se lo daría yo. Tú decides.',
    // lo que se le enseña a Veta si se toca el micro desde aquí
    casoDictado: p => !A(p.id) ? null : ({de: 'asunto-' + p.id, quien: p.id, titulo: nombre(p.id), texto: propone(p.id).de + '. ' + propone(p.id).texto}),
    pinta: p => {
      const a = A(p.id);
      if (!a) return r7.vacio('No encuentro este asunto.');   // estado vacío honesto; «volver» lo pone la cabecera
      const r = resuelto(p.id), corto = nombre(p.id).split(' ')[0];
      // decidido: la fila de «hecho» arriba, con su «Deshacer»; debajo queda lo que escribió, sin la propuesta
      let h = r ? r7.hecho({texto: corta(r, nombre(p.id)), hora: r.hora ? VETA.fecha.hora(r.hora) : '', deshacer: 'deshacer-asunto', vt: 'asunto-' + p.id}) : '';
      // el cliente de otra persona (la queja de Joan, de Marc): dirección no lee su chat; lo sabe por su aviso
      h += a.tipo === 'queja' && VETA.ajeno(a.contacto)
        ? r7.tarjeta({de: 'Lo sé por tu aviso del ' + dia(a.pide.origen), texto: 'Diez días sin noticias de su casa. Dice que se irá a otra agencia.', i: 0})
        // ni el contacto sin dueño ni el que ya es de una agente: dirección ve el estado (quién es, qué pide en resumen de Veta, desde cuándo espera), nunca el texto
        : r7.tarjeta({de: corto + ' escribió ' + elDia(dia(a.pide.origen)), texto: (QUIERE[p.id] || 'Ha escrito al WhatsApp de la oficina.') + (r ? '' : ' Nadie le ha contestado.'), i: 0});
      if (!r) h += r7.tarjeta(Object.assign({veta: true, i: 1}, propone(p.id)));
      h += r7.lista([{nombre: 'Lo que ha pasado', dato: a.paso.length, hoja: 'd-pasos', datos: {asunto: p.id}}], {i: 2});
      return h;
    },
    botonFijo: p => {
      const a = A(p.id); if (!a) return '';
      if (resuelto(p.id)) return r7.sigue(VETA.d1.siguiente());
      if (a.tipo === 'queja') return r7.botones({texto: 'Pedir a Marc que le llame', accion: 'pedir'});
      return r7.botones({texto: ella(p.id) ? `Dársela a ${X.persona(a.propone).corto}` : `Dárselo a ${X.persona(a.propone).corto}`, accion: 'asignar'});
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
