/* Veta demo · pantallas · operacion.js · ronda 7 · D2 (antes: ronda 6, paquete D)
   G18 · Una operación · #/operacion/:id — lo que ve dirección de una operación. Ficha (R2, R4):
   1) “Qué toca ahora” (y, si hace falta, la pastilla roja); 2) una lista: quién la lleva (→ su persona), cómo va (los cinco pasos
   en una línea), “Lo que ha pasado · 4” (se abre aquí mismo) y qué ves tú y qué no; 3) abajo, tres botones como mucho.
   Sin el texto de los chats ni las notas de quien la lleva. Hojas: h35 (para: 'op'), d-preguntar, d-anotar (js/hojas/direccion.js, de D1). */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, r7 = VETA.r7;
  // FD (defecto 7): rojas solo “Sin contestar” y “Nadie la lleva”; “Queja”, gris
  const ROJO = {'sin-contestar': 'No reply yet', nadie: 'No one has it'};
  // lo que queda del aviso cuando la pastilla ya dice lo principal: “Sin contestar” + “desde ayer, 18:42”
  const queda = a => a.texto.replace(/^Sin contestar /, '').replace(/^Queja /, '').replace(/^No l[ao] lleva nadie · /, '');
  const sinDueno = o => !o.lleva || (o.deTeresa && o.lleva === 'teresa');

  VETA.pantalla('G18', {
    titulo: p => { const o = X.op(p.id); return o ? o.nombre : 'A deal'; },
    frase: p => {
      const o = X.op(p.id); if (!o) return '';
      const yo = VETA.yo().id;
      if (sinDueno(o)) return `${o.texto}. See what happened and choose who has it.`;
      if (o.lleva === yo) return `${o.texto}. You have it. See how it is going and note down what is needed.`;
      return `${o.texto}. See how it is going and, if needed, ask ${o.persona.corto}.`;
    },
    pinta: p => {
      const o = X.op(p.id);
      if (!o) return VETA.r7.lista([{icono: 'pregunta', nombre: 'I cannot find this deal', pasa: 'Look in the list of all of them', ir: 'operaciones'}]);
      const yo = VETA.yo().id, per = o.persona, corto = per ? (o.lleva === yo ? 'you' : per.corto) : null;
      const rojo = o.aviso && ROJO[o.aviso.tipo];
      // 1 · qué toca ahora (y lo que pasa, si alguien espera)
      let h = `<div class="r7-ficha d2-ficha" data-i="0"><span class="r7-ficha-de">What is next</span>` +
        `<p class="d2-toca">${esc(o.toca || 'Nothing for now')}</p>` +
        (o.aviso ? `<p class="d2-toca-q">${rojo ? r7.pastilla(rojo, 'rojo') : o.aviso.tipo === 'queja' ? r7.pastilla('Complaint') : ''}<span>${esc(rojo || o.aviso.tipo === 'queja' ? queda(o.aviso) : o.aviso.texto)}</span></p>` : '') + `</div>`;
      // 2 · quién la lleva · cómo va · lo que ha pasado · qué ves tú
      const filas = [];
      if (per) {
        // la cara del equipo con su tono (VETA.d1.fila, de D1): la misma en Equipo y aquí
        const fp = {cara: o.lleva, nombre: per.nombre + (o.lleva === yo ? ' (you)' : ''), pasa: 'Handled by' + (per.baja && o.lleva === 'teresa' ? ' · off sick' : ' · ' + X.zona(o.lleva)), ir: 'persona/' + o.lleva};
        filas.push(VETA.d1 && VETA.d1.fila ? VETA.d1.fila(fp) : fp);
      } else {
        filas.push({icono: 'usuario', nombre: 'No one has it', pasa: 'Nobody has replied yet'});
      }
      // cómo va: el paso de ahora y el siguiente; los cinco, al abrir la fila
      const pasos = (VETA.datos.pasos || {})[o.tipo] || [], fase = o.estado === 'cerrado' ? 5 : o.fase;
      const fin = /Cerrada|Se cayó/.test(o.comoCorto);
      filas.push({icono: 'tarea', nombre: 'How it is going · ' + (fin ? o.comoCorto : pasos[fase - 1] || ''),
        pasa: fin ? 'No more steps' : `Step ${fase} of 5` + (pasos[fase] ? ' · then, ' + pasos[fase] : ''),
        abre: `<ol class="d2-pasos">${pasos.map((x, k) => `<li${k + 1 === fase && !fin ? ' class="d2-aqui"' : k + 1 < fase ? ' class="d2-hecho-p"' : ''}>${esc(x)}</li>`).join('')}</ol>`});
      const hit = (o.hitos || []).slice().reverse();
      if (hit.length) filas.push({icono: 'reloj', nombre: 'What has happened', numero: hit.length, pasa: hit[0].cuando + ' · ' + hit[0].texto,
        abre: `<ul class="d2-hitos">${hit.map(x => `<li><b>${esc(x.cuando)}</b> · ${esc(x.texto)}</li>`).join('')}</ul>`});
      if (o.caso) filas.push({icono: 'aprende', oro: true, nombre: 'What can be learned', pasa: 'A case to teach Veta', ir: o.caso});
      const nombre = o.nombre.split(' ')[0];
      filas.push({icono: 'candado', nombre: 'What you see, what you don\'t', pasa: corto && corto !== 'ti' ? `You don't see their chats or notes` : 'Your notes are saved here',
        abre: `<p>${corto && corto !== 'ti' ? `You do not see what ${esc(corto)} and ${esc(nombre)} write to each other, or ${esc(corto)}'s notes. ${esc(corto)} sees in their app the same as you see of this deal.` : 'Your notes and questions are saved here, with their time.'}</p>`});
      h += r7.lista(filas, {i: 1});
      return h;
    },
    // R4: tres como mucho; el negro, lo principal
    botonFijo: p => {
      const o = X.op(p.id); if (!o) return '';
      const yo = VETA.yo().id, per = o.persona;
      const elegir = {texto: 'Choose who handles it', hoja: 'h35', datos: {para: 'op', op: o.id}};
      const anotar = {texto: 'Add a note', hoja: 'd-anotar', datos: {op: o.id}};
      if (sinDueno(o)) return r7.botones(elegir, [anotar]);
      if (o.lleva === yo) return r7.botones(anotar, [{texto: 'Give it to someone else', hoja: 'h35', datos: {para: 'op', op: o.id}}]);
      return r7.botones({texto: 'Ask ' + per.corto, hoja: 'd-preguntar', datos: {op: o.id}},
        [{texto: 'Change who', hoja: 'h35', datos: {para: 'op', op: o.id}}, anotar]);
    }
  });
})();
