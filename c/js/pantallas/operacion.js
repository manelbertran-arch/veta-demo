/* Veta demo · pantallas · operacion.js · ronda 7 · D2 (antes: ronda 6, paquete D)
   G18 · Una operación · #/operacion/:id — lo que ve dirección de una operación. Ficha (R2, R4):
   1) «Qué toca ahora» (y, si hace falta, la pastilla roja); 2) una lista: quién la lleva (→ su persona), cómo va (los cinco pasos
   en una línea), «Lo que ha pasado · 4» (se abre aquí mismo) y qué ves tú y qué no; 3) abajo, tres botones como mucho.
   Sin el texto de los chats ni las notas de quien la lleva. Hojas: h35 (para: 'op'), d-preguntar, d-anotar (js/hojas/direccion.js, de D1). */
(function () {
  'use strict';
  const esc = VETA.esc, X = VETA.dir, r7 = VETA.r7;
  // FD (defecto 7): rojas solo «Sin contestar» y «Nadie la lleva»; «Queja», gris
  const ROJO = {'sin-contestar': 'Sin contestar', nadie: 'Nadie la lleva'};
  // lo que queda del aviso cuando la pastilla ya dice lo principal: «Sin contestar» + «desde ayer, 18:42»
  const queda = a => a.texto.replace(/^Sin contestar /, '').replace(/^Queja /, '').replace(/^No l[ao] lleva nadie · /, '');
  const sinDueno = o => !o.lleva || (o.deTeresa && o.lleva === 'teresa');

  VETA.pantalla('G18', {
    titulo: p => { const o = X.op(p.id); return o ? o.nombre : 'Una operación'; },
    frase: p => {
      const o = X.op(p.id); if (!o) return '';
      const yo = VETA.yo().id;
      if (sinDueno(o)) return `${o.texto}. Mira qué ha pasado y elige quién la lleva.`;
      if (o.lleva === yo) return `${o.texto}. La llevas tú. Mira cómo va y apunta lo que haga falta.`;
      return `${o.texto}. Mira cómo va y, si hace falta, pregunta a ${o.persona.corto}.`;
    },
    pinta: p => {
      const o = X.op(p.id);
      if (!o) return VETA.r7.lista([{icono: 'pregunta', nombre: 'No encuentro esta operación', pasa: 'Mira en la lista de todas', ir: 'operaciones'}]);
      const yo = VETA.yo().id, per = o.persona, corto = per ? (o.lleva === yo ? 'ti' : per.corto) : null;
      const rojo = o.aviso && ROJO[o.aviso.tipo];
      // 1 · qué toca ahora (y lo que pasa, si alguien espera)
      let h = `<div class="r7-ficha d2-ficha" data-i="0"><span class="r7-ficha-de">Qué toca ahora</span>` +
        `<p class="d2-toca">${esc(o.toca || 'Nada por ahora')}</p>` +
        (o.aviso ? `<p class="d2-toca-q">${rojo ? r7.pastilla(rojo, 'rojo') : o.aviso.tipo === 'queja' ? r7.pastilla('Queja') : ''}<span>${esc(rojo || o.aviso.tipo === 'queja' ? queda(o.aviso) : o.aviso.texto)}</span></p>` : '') + `</div>`;
      // 2 · quién la lleva · cómo va · lo que ha pasado · qué ves tú
      const filas = [];
      if (per) {
        // la cara del equipo con su tono (VETA.d1.fila, de D1): la misma en Equipo y aquí
        const fp = {cara: o.lleva, nombre: per.nombre + (o.lleva === yo ? ' (tú)' : ''), pasa: 'La lleva' + (per.baja && o.lleva === 'teresa' ? ' · está de baja' : ' · ' + X.zona(o.lleva)), ir: 'persona/' + o.lleva};
        filas.push(VETA.d1 && VETA.d1.fila ? VETA.d1.fila(fp) : fp);
      } else {
        filas.push({icono: 'usuario', nombre: 'No la lleva nadie', pasa: 'Nadie le ha contestado todavía'});
      }
      // cómo va: el paso de ahora y el siguiente; los cinco, al abrir la fila
      const pasos = (VETA.datos.pasos || {})[o.tipo] || [], fase = o.estado === 'cerrado' ? 5 : o.fase;
      const fin = /Cerrada|Se cayó/.test(o.comoCorto);
      filas.push({icono: 'tarea', nombre: 'Cómo va · ' + (fin ? o.comoCorto : pasos[fase - 1] || ''),
        pasa: fin ? 'Ya no hay pasos' : `Paso ${fase} de 5` + (pasos[fase] ? ' · luego, ' + pasos[fase] : ''),
        abre: `<ol class="d2-pasos">${pasos.map((x, k) => `<li${k + 1 === fase && !fin ? ' class="d2-aqui"' : k + 1 < fase ? ' class="d2-hecho-p"' : ''}>${esc(x)}</li>`).join('')}</ol>`});
      const hit = (o.hitos || []).slice().reverse();
      if (hit.length) filas.push({icono: 'reloj', nombre: 'Lo que ha pasado', numero: hit.length, pasa: hit[0].cuando + ' · ' + hit[0].texto,
        abre: `<ul class="d2-hitos">${hit.map(x => `<li><b>${esc(x.cuando)}</b> · ${esc(x.texto)}</li>`).join('')}</ul>`});
      if (o.caso) filas.push({icono: 'aprende', oro: true, nombre: 'Qué se puede aprender', pasa: 'Un caso para enseñar a Veta', ir: o.caso});
      const nombre = o.nombre.split(' ')[0];
      filas.push({icono: 'candado', nombre: 'Qué ves tú y qué no', pasa: corto && corto !== 'ti' ? `No ves sus chats ni sus notas` : 'Tus notas se guardan aquí',
        abre: `<p>${corto && corto !== 'ti' ? `No ves lo que se escriben ${esc(corto)} y ${esc(nombre)}, ni las notas de ${esc(corto)}. ${esc(corto)} ve en su app lo mismo que ves tú de esta operación.` : 'Tus notas y preguntas se guardan aquí, con su hora.'}</p>`});
      h += r7.lista(filas, {i: 1});
      return h;
    },
    // R4: tres como mucho; el negro, lo principal
    botonFijo: p => {
      const o = X.op(p.id); if (!o) return '';
      const yo = VETA.yo().id, per = o.persona;
      const elegir = {texto: 'Elegir quién la lleva', hoja: 'h35', datos: {para: 'op', op: o.id}};
      const anotar = {texto: 'Anotar algo', hoja: 'd-anotar', datos: {op: o.id}};
      if (sinDueno(o)) return r7.botones(elegir, [anotar]);
      if (o.lleva === yo) return r7.botones(anotar, [{texto: 'Dársela a otra persona', hoja: 'h35', datos: {para: 'op', op: o.id}}]);
      return r7.botones({texto: 'Preguntar a ' + per.corto, hoja: 'd-preguntar', datos: {op: o.id}},
        [{texto: 'Cambiar quién', hoja: 'h35', datos: {para: 'op', op: o.id}}, anotar]);
    }
  });
})();
