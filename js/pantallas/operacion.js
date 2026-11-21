/* Veta demo · pantallas · operacion.js · ronda 6 · paquete D (P3)
   G18 · Una operación · #/operacion/:id — lo que ve dirección de una operación: quién la lleva, cómo va, qué toca,
   lo ocurrido en orden (la línea de lo que pasó, VETA.vivo.hilo) y lo que puede hacer: preguntar, cambiar quién la lleva, anotar.
   Sin el texto de los chats ni las notas de quien la lleva. Hojas: h35 (para: 'op'), d-preguntar, d-anotar (js/hojas/direccion.js). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, X = VETA.dir;

  VETA.pantalla('G18', {
    titulo: p => { const o = X.op(p.id); return o ? o.nombre : 'Una operación'; },
    guia: ['Aquí ves una operación entera: quién la lleva, cómo va y lo que ha pasado.', 'Tú puedes preguntar, cambiar quién la lleva o anotar algo.', 'Así ayudas sin tener que leer los chats de nadie.'],
    pinta: p => {
      const o = X.op(p.id);
      if (!o) return UI.vacio({titulo: 'No encuentro esta operación.', icono: 'pregunta', boton: {texto: 'Ver todas', ir: 'operaciones'}});
      const yo = VETA.yo().id, p2 = o.persona, corto = p2 ? (o.lleva === yo ? 'ti' : p2.corto) : null;
      let h = `<div class="d-opd-cab" data-i="0">${VETA.av(o.id, 64, {nombre: o.nombre, foco: 'foto'})}<div><p class="d-opd-n" data-foco="nombre">${esc(o.nombre)}</p><p class="d-opd-q">${esc(o.texto)}</p></div></div>`;
      if (o.aviso) h += `<p class="d-op-aviso d-opd-aviso d-tono-${o.aviso.tono}" data-i="0">${VETA.ic(o.aviso.tono === 'rojo' ? 'aviso' : 'reloj', 20)}<span>${esc(o.aviso.texto)}</span></p>`;
      // quién la lleva
      const quien = p2 ? UI.fila({titulo: p2.nombre + (o.lleva === yo ? ' (tú)' : ''), sub: (p2.baja && o.lleva === 'teresa' ? p2.baja : X.zona(o.lleva)), av: o.lleva, ir: 'persona/' + o.lleva})
        : UI.fila({titulo: 'Nadie', sub: 'Nadie le ha contestado todavía', icono: 'usuario'});
      h += UI.bloque({titulo: 'Quién la lleva', i: 1, html: UI.lista([quien])});
      // cómo va y qué toca
      const pasos = (VETA.datos.pasos || {})[o.tipo] || [];
      h += UI.bloque({titulo: 'Cómo va', i: 1, html: UI.pasos({hecho: ['cerrado'].includes(o.estado) ? 5 : o.fase, total: 5, texto: o.como}) +
        `<p class="d-opd-pasos">${pasos.map((x, k) => `<span${k + 1 === o.fase ? ' class="d-aqui"' : ''}>${esc(x)}</span>`).join('<i aria-hidden="true">›</i>')}</p>`});
      h += UI.bloque({titulo: 'Qué toca ahora', i: 2, html: `<p class="d-opd-toca">${esc(o.toca || 'Nada por ahora')}</p>`});
      // lo ocurrido, en orden
      h += UI.bloque({titulo: 'Lo que ha pasado', i: 2, html: VETA.vivo.hilo(o.hitos, {scroll: true})});
      // lo que puede hacer dirección
      const acc = [];
      if (!o.lleva || (o.deTeresa && o.lleva === 'teresa')) acc.push(UI.boton({texto: 'Elegir quién la lleva', hoja: 'h35', datos: {para: 'op', op: o.id}}));
      if (p2 && o.lleva !== yo && !(o.deTeresa && o.lleva === 'teresa')) acc.push(UI.boton({tipo: 'secundario', texto: 'Preguntar a ' + p2.corto, icono: 'pregunta', hoja: 'd-preguntar', datos: {op: o.id}}));
      if (p2) acc.push(UI.boton({tipo: 'secundario', texto: 'Cambiar quién la lleva', icono: 'usuario', hoja: 'h35', datos: {para: 'op', op: o.id}}));
      acc.push(UI.boton({tipo: 'secundario', texto: 'Anotar algo', icono: 'editar', hoja: 'd-anotar', datos: {op: o.id}}));
      if (o.caso) acc.push(UI.boton({tipo: 'texto', texto: 'Ver qué se puede aprender', ir: o.caso}));
      h += UI.bloque({titulo: 'Lo que puedes hacer', i: 3, html: `<div class="d-opd-acc">${acc.join('')}</div>`});
      h += UI.nota({icono: 'candado', i: 4, texto: corto && corto !== 'ti' ? `No ves lo que se escriben ${corto} y ${o.nombre.split(' ')[0]} ni las notas de ${corto}. ${corto} puede ver en su app lo mismo que ves tú de esta operación.` : 'Tus notas y preguntas se guardan aquí, con su hora.'});
      return h;
    }
  });
})();
