/* Veta demo · ronda 8 · pantallas · operacion.js · carril D
   G18 · Una operación · #/operacion/:id — lo que ve dirección de una operación:
   subtítulo (“Compra en Gràcia · la lleva Laura”), la tarjeta “Qué toca ahora” y una lista de plegables con “+” (cómo va,
   papeles, lo último, qué ves tú). Un botón: “Preguntar a Laura”. Lo demás, en “Más” (hoja d-op-mas): cambiar quién la lleva,
   anotar algo, ver a la persona y, si lo hay, el caso para aprender.
   Sin el texto de los chats ni las notas de quien la lleva. Hojas: h35 (para: 'op'), d-preguntar, d-anotar, d-op-mas (js/hojas/direccion.js). */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, r7 = VETA.r7;
  const ROJO = {'sin-contestar': 'No reply yet', nadie: 'No one has it'};
  // lo que queda del aviso cuando la pastilla ya dice lo principal: “Sin contestar” + “desde ayer, 18:42”
  const queda = a => a.texto.replace(/^Not answered /, '').replace(/^No one has (?:her|him|it) · /, '');
  const sinDueno = o => !o.lleva || (o.deTeresa && o.lleva === 'teresa');
  const lista = (l, clase) => `<ul class="${clase}">${l.join('')}</ul>`;

  VETA.pantalla('G18', {
    titulo: p => { const o = X.op(p.id); return o ? o.nombre : 'A deal'; },
    sub: p => {
      const o = X.op(p.id); if (!o) return '';
      const per = o.persona;
      if (!per) return `${o.texto} · no one has it`;
      if (o.lleva === VETA.yo().id) return `${o.texto} · you have it`;
      return per.baja && o.lleva === 'teresa' ? `${o.texto} · ${per.corto} has it, on leave` : `${o.texto} · ${per.corto} has it`;
    },
    mas: p => { const o = X.op(p.id); return o ? {hoja: 'd-op-mas', datos: {op: o.id}} : null; },
    pinta: p => {
      const o = X.op(p.id);
      if (!o) return VETA.UI.vacio({titulo: 'I can\'t find this deal.', boton: {texto: 'See all', ir: 'operaciones'}});
      const yo = VETA.yo().id, per = o.persona, corto = per ? (o.lleva === yo ? 'you' : per.corto) : null;
      const rojo = o.aviso && ROJO[o.aviso.tipo];
      // 1 · qué toca ahora (y, si alguien espera, la pastilla roja)
      let h = r7.tarjeta({de: 'What is next', i: 0, html: `<p>${esc(o.toca || 'Nothing for now')}</p>` +
        (rojo ? `<p class="d2-toca-q">${r7.pastilla(rojo)}<span>${esc(queda(o.aviso))}</span></p>` : o.aviso && o.aviso.tipo !== 'papel' ? `<p>${esc(o.aviso.texto)}</p>` : '')});
      // 2 · plegables: cómo va (los cinco pasos), papeles, lo último y qué ves tú
      const filas = [];
      const pasos = (VETA.datos.pasos || {})[o.tipo] || [], fase = o.estado === 'cerrado' ? 5 : o.fase;
      const fin = /Closed|Fell through/.test(o.comoCorto);
      filas.push({nombre: 'How it\'s going', pasa: fin ? o.comoCorto : `${pasos[fase - 1] || ''} · step ${fase} of 5`,
        abre: fin ? lista(pasos.map(x => `<li>${esc(x)}</li>`), 'd2-pasos') : VETA.v.pasos(fase, pasos, {sinLinea: true, lista: true})});
      if (o.aviso && o.aviso.tipo === 'papel') { const t = o.aviso.texto.replace(/^A document is missing: /, ''); filas.push({nombre: 'Documents', pasa: '1 missing', abre: `<p>${esc(t.charAt(0).toUpperCase() + t.slice(1))}.</p>`}); }
      const hit = (o.hitos || []).slice().reverse();
      // lo último: la fecha a la cola (es un dato) y, en la segunda línea, qué pasó
      if (hit.length) filas.push({nombre: 'Latest', pasa: hit[0].texto, dato: hit[0].cuando.replace(/, \d{1,2}:\d\d$/, ''),
        abre: lista(hit.map(x => `<li><b>${esc(x.cuando)}</b> · ${esc(x.texto)}</li>`), 'd2-hitos')});
      const nombre = o.nombre.split(' ')[0];
      filas.push({nombre: 'What you see, what you don\'t', pasa: corto && corto !== 'ti' ? VETA.PROMESA.chats : 'Your notes are saved here',
        abre: `<p>${corto && corto !== 'ti' ? `You do not see what ${esc(corto)} and ${esc(nombre)} write to each other, or ${esc(corto)}'s notes. ${esc(corto)} sees in their app the same as you see of this deal.` : 'Your notes and questions are saved here, with their time.'}</p>`});
      return h + r7.lista(filas, {i: 1});
    },
    // un botón: lo principal según quién la lleva. Lo demás, en “Más”
    botonFijo: p => {
      const o = X.op(p.id); if (!o) return '';
      if (sinDueno(o)) return r7.botones({texto: 'Choose who handles it', hoja: 'h35', datos: {para: 'op', op: o.id}});
      if (o.lleva === VETA.yo().id) return r7.botones({texto: 'Add a note', hoja: 'd-anotar', datos: {op: o.id}});
      return r7.botones({texto: 'Ask ' + o.persona.corto, hoja: 'd-preguntar', datos: {op: o.id}});
    }
  });
})();
