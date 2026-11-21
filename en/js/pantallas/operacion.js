/* Veta demo · pantallas · operacion.js · ronda 6 · paquete D (P3)
   G18 · Una operación · #/operacion/:id — lo que ve dirección de una operación: quién la lleva, cómo va, qué toca,
   lo ocurrido en orden (la línea de lo que pasó, VETA.vivo.hilo) y lo que puede hacer: preguntar, cambiar quién la lleva, anotar.
   Sin el texto de los chats ni las notas de quien la lleva. Hojas: h35 (para: 'op'), d-preguntar, d-anotar (js/hojas/direccion.js). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, X = VETA.dir;

  VETA.pantalla('G18', {
    titulo: p => { const o = X.op(p.id); return o ? o.nombre : 'A deal'; },
    guia: ['Here you see a whole deal: who handles it, how it is going and what has happened.', 'You can ask a question, change who handles it, or add a note.', 'This way you help without having to read anyone\'s chats.'],
    pinta: p => {
      const o = X.op(p.id);
      if (!o) return UI.vacio({titulo: 'I cannot find this deal.', icono: 'pregunta', boton: {texto: 'See all', ir: 'operaciones'}});
      const yo = VETA.yo().id, p2 = o.persona, corto = p2 ? (o.lleva === yo ? 'you' : p2.corto) : null;
      let h = `<div class="d-opd-cab" data-i="0">${VETA.av(o.id, 64, {nombre: o.nombre, foco: 'foto'})}<div><p class="d-opd-n" data-foco="nombre">${esc(o.nombre)}</p><p class="d-opd-q">${esc(o.texto)}</p></div></div>`;
      if (o.aviso) h += `<p class="d-op-aviso d-opd-aviso d-tono-${o.aviso.tono}" data-i="0">${VETA.ic(o.aviso.tono === 'rojo' ? 'aviso' : 'reloj', 20)}<span>${esc(o.aviso.texto)}</span></p>`;
      // quién la lleva
      const quien = p2 ? UI.fila({titulo: p2.nombre + (o.lleva === yo ? ' (you)' : ''), sub: (p2.baja && o.lleva === 'teresa' ? p2.baja : X.zona(o.lleva)), av: o.lleva, ir: 'persona/' + o.lleva})
        : UI.fila({titulo: 'Nobody', sub: 'Nobody has replied yet', icono: 'usuario'});
      h += UI.bloque({titulo: 'Who handles it', i: 1, html: UI.lista([quien])});
      // cómo va y qué toca
      const pasos = (VETA.datos.pasos || {})[o.tipo] || [];
      h += UI.bloque({titulo: 'How it is going', i: 1, html: UI.pasos({hecho: ['cerrado'].includes(o.estado) ? 5 : o.fase, total: 5, texto: o.como}) +
        `<p class="d-opd-pasos">${pasos.map((x, k) => `<span${k + 1 === o.fase ? ' class="d-aqui"' : ''}>${esc(x)}</span>`).join('<i aria-hidden="true">›</i>')}</p>`});
      h += UI.bloque({titulo: 'What is next', i: 2, html: `<p class="d-opd-toca">${esc(o.toca || 'Nothing for now')}</p>`});
      // lo ocurrido, en orden
      h += UI.bloque({titulo: 'What has happened', i: 2, html: VETA.vivo.hilo(o.hitos, {scroll: true})});
      // lo que puede hacer dirección
      const acc = [];
      if (!o.lleva || (o.deTeresa && o.lleva === 'teresa')) acc.push(UI.boton({texto: 'Choose who handles it', hoja: 'h35', datos: {para: 'op', op: o.id}}));
      if (p2 && o.lleva !== yo && !(o.deTeresa && o.lleva === 'teresa')) acc.push(UI.boton({tipo: 'secundario', texto: 'Ask ' + p2.corto, icono: 'pregunta', hoja: 'd-preguntar', datos: {op: o.id}}));
      if (p2) acc.push(UI.boton({tipo: 'secundario', texto: 'Change who handles it', icono: 'usuario', hoja: 'h35', datos: {para: 'op', op: o.id}}));
      acc.push(UI.boton({tipo: 'secundario', texto: 'Add a note', icono: 'editar', hoja: 'd-anotar', datos: {op: o.id}}));
      if (o.caso) acc.push(UI.boton({tipo: 'texto', texto: 'See what can be learned', ir: o.caso}));
      h += UI.bloque({titulo: 'What you can do', i: 3, html: `<div class="d-opd-acc">${acc.join('')}</div>`});
      h += UI.nota({icono: 'candado', i: 4, texto: corto && corto !== 'ti' ? `You cannot see what ${corto} and ${o.nombre.split(' ')[0]} write to each other, or the notes of ${corto}. ${corto} can see in their app the same as you see of this deal.` : 'Your notes and questions are saved here, with their time.'});
      return h;
    }
  });
})();
