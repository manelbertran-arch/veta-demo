/* Veta demo · pantallas · acta.js · paquete A (El día)
   A4 · Acta de la visita · #/acta/<cliente> (elena). Pantalla completa. “Guardar el acta de Elena” (fijo) vuelve a Hoy
   con las dos líneas en el sitio. Estados: borrador · corrigiendo a mano · PDF preparado · guardada. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic;
  const acta = p => ((VETA.datos.diaA || {}).acta || {})[p.id] || null;
  const est = id => VETA.est.lee('a.acta.' + id, {});
  const ponEst = (id, v) => VETA.est.pon('a.acta.' + id, Object.assign({}, est(id), v));
  const dijiste = g => {
    const u = VETA.est.lee('a.ultimoDictado', null);
    const seg = u && u.guion === g ? u.seg : ((VETA.datos.diaA || {}).duracion || {})[g] || 0;
    return VETA.A.mmss(seg);
  };

  VETA.pantalla('A4', {
    titulo: 'Viewing notes',
    guia: ['Here\'s how I understood the viewing: what she liked, what worries her and the next step.', 'You review it, correct it by hand if needed and save it.', 'This way the notes stay in their profile and the call is written down.'],
    pinta: p => {
      const a = acta(p);
      if (!a) return UI.vacio({titulo: 'No notes for this viewing', texto: 'Tell me how it went and I\'ll write the notes.', icono: 'mic', boton: {texto: 'Tell me how it went', ir: 'dictar/acta'}});
      const e = est(p.id), c = M.cosa(a.cosa), guardada = c && c.estado === 'hecha';
      const texto = e.textos || {};
      let h = `<div class="a-ent" data-i="0"><p class="a-ent-t"><b>${esc(a.entendido)}</b><span>${esc(a.donde)}</span></p>` +
        (guardada ? '' : UI.boton({tipo: 'texto', texto: 'That\'s not it', hoja: 'h09', datos: {guion: 'acta'}, ancho: false})) + '</div>';
      if (e.pdf) h += `<div data-i="0">${UI.lineaHecho({texto: 'PDF ready. You send it.', boton: {texto: 'Undo', accion: 'sin-pdf'}})}</div>`;
      if (e.corrige && !guardada) {
        h += `<div class="borrador a-acta a-corrige" data-i="1"><span class="borrador-r">I wrote this for you · you can correct it</span>` +
          a.bloques.map(b => UI.campo({etiqueta: b.titulo, area: true, filas: 2, valor: texto[b.id] != null ? texto[b.id] : b.texto, id: 'a-acta-' + b.id})).join('') + '</div>';
      } else {
        h += `<div class="borrador a-acta" data-i="1"><span class="borrador-r">${guardada ? 'Notes saved' : 'I wrote this for you'}</span>` +
          a.bloques.map(b => `<section class="a-acta-b"><h3 class="a-acta-t">${esc(b.titulo)}</h3><p class="a-acta-x">${esc(texto[b.id] != null ? texto[b.id] : b.texto)}</p></section>`).join('') + '</div>';
      }
      h += `<div class="a-tarea" data-i="2"><span class="a-tarea-ic">${ic('cal', 22)}</span><div class="a-tarea-c"><span class="a-tarea-r">${guardada ? 'I\'ve logged this task' : 'When you save, I\'ll log this task'}</span>` +
        `<p class="a-tarea-t">${esc(a.tarea)}</p><span class="a-tarea-p">${esc(a.tareaPie)}</span></div></div>`;
      h += UI.lista([{titulo: 'What you said · ' + dijiste('acta'), icono: 'mic', hoja: 'h07', datos: {guion: 'acta'}}], {i: 3});
      if (!guardada) h += `<div data-i="3">${UI.botones([{texto: e.corrige ? 'Leave it like this' : 'Keep dictating', accion: e.corrige ? 'deja-corregir' : 'seguir', icono: e.corrige ? 'check' : 'mic'}, {texto: 'Something else…', hoja: 'a-acta', datos: {acta: p.id}}])}</div>`;
      return h;
    },
    botonFijo: p => {
      const a = acta(p); if (!a) return '';
      const c = M.cosa(a.cosa);
      if (c && c.estado === 'hecha') return UI.lineaHecho({texto: 'Saved · Viewing notes for ' + a.nombre, hora: c.hora, boton: {texto: 'Undo', accion: 'deshacer', de: c.id}, vt: 'cola-' + c.id});
      return UI.boton({texto: 'Save the notes for ' + a.nombre, accion: 'guardar', g: 'Save the notes|I put them in their profile and write down the call on Thursday.'});
    },
    acciones: {
      seguir() { const u = VETA.est.lee('a.ultimoDictado', null); VETA.est.pon('a.dictado', {guion: 'acta', seg: u && u.guion === 'acta' ? u.seg : 0}); VETA.ir('dictar/acta', {reemplaza: true}); },
      'deja-corregir'(ev, el, p) { guardaTextos(p); ponEst(p.id, {corrige: false}); VETA.repinta(); },
      'sin-pdf'(ev, el, p) { ponEst(p.id, {pdf: false}); VETA.repinta(); },
      guardar(ev, el, p) {
        const a = acta(p); if (!a) return;
        guardaTextos(p); ponEst(p.id, {corrige: false});
        M.marca(a.cosa, 'hecha');
        VETA.est.pon('a.sinTareaElena', false);
        VETA.A.aHoy();
      }
    }
  });
  function guardaTextos(p) {
    const a = acta(p); if (!a) return;
    const t = Object.assign({}, est(p.id).textos || {});
    a.bloques.forEach(b => { const x = VETA.$('#a-acta-' + b.id); if (x) t[b.id] = x.value; });
    ponEst(p.id, {textos: t});
  }

  // hoja “Acta de Elena” (la “Otra cosa…” del acta)
  VETA.hojaAcciones('a-acta', {
    titulo: d => 'Viewing notes for ' + ((acta({id: d.acta || 'elena'}) || {}).nombre || 'the viewing'),
    opciones: d => [
      {texto: 'Correct them by hand', icono: 'editar', hace: () => { ponEst(d.acta || 'elena', {corrige: true}); VETA.repinta(); }},
      {texto: 'Save as PDF', icono: 'doc', hace: () => { ponEst(d.acta || 'elena', {pdf: true}); VETA.repinta(); }},
      {texto: 'Pass it to the owner', sub: 'I\'ll add it to Pere\'s report', icono: 'compartir', ir: 'informe/' + ((acta({id: d.acta || 'elena'}) || {}).propietario || 'pere')}]
  });
})();
