/* Veta demo · pantallas · regla-oficina.js · paquete D (Dirección)
   G2b · Una regla para la oficina · #/regla-oficina/<id> — dossier (propuesta de Laura), mismo-dia (a prueba) y actas (en marcha).
   Estados: propuesta → «Ponerla a prueba» → «A prueba con todo el equipo hasta el 7 de diciembre · Deshacer».
   Tras la prueba: «Extenderla a todo el equipo» → confirmación (a quién, qué cambia, desde cuándo) → «En marcha · la usa todo el equipo · Deshacer». */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  const R = id => (VETA.datos.reglasOficina || {})[id] || VETA.datos.reglasOficina.dossier;
  let confirmando = null;                                        // id de la regla que enseña su confirmación

  // fase de una regla: 'propuesta' | 'a-prueba' | 'en-marcha' | 'descartada' | 'luego'
  function fase(id) {
    const r = R(id);
    if (r.decision) {
      const c = M.cosa(r.decision);
      if (!c || !X.resuelta(c)) return {f: 'propuesta'};
      const x = c.extra || {};
      if (c.estado === 'quitada') return {f: 'descartada', linea: x.linea, hora: c.hora};
      if (c.estado === 'para-manana') return {f: 'luego', linea: x.linea, hora: c.hora};
      return {f: x.fase || 'a-prueba', linea: x.linea || 'On trial with the whole team until 7 December', hora: c.hora};
    }
    const e = X.lee('practicas', {})[id];
    if (e) return {f: 'en-marcha', linea: 'In use · the whole team uses it', hora: e.hora, propio: true};
    return {f: r.estado, inicial: true};
  }
  const etq = f => ({propuesta: ['por-decidir', null], 'a-prueba': ['a-prueba', null], 'en-marcha': ['en-marcha', null], descartada: ['cerrado', 'Dismissed'], luego: ['para-manana', 'For later']})[f] || ['por-decidir', null];

  VETA.pantalla('G2b', {
    titulo: p => R(p.id).titulo,
    guia: ['Here Veta shows you a way of working that someone on the team proposes for everyone.', 'You try it for two weeks without anything going out, or dismiss it.', 'That way what works for one person reaches the whole office.'],
    pinta: p => {
      const r = R(p.id), e = fase(p.id), [tq, tt] = etq(e.f);
      if (confirmando === p.id) {
        return `<p class="intro" data-i="0">You're going to extend “${esc(r.titulo)}” to the whole team.</p>` +
          `<dl class="d-confirma" data-i="1">` +
          `<div><dt>Who</dt><dd>The 6 people on the team: Laura, Montse, Anna, Teresa, Marc and David.</dd></div>` +
          `<div><dt>What changes</dt><dd>${esc(r.frase)} Each agent keeps sending their own: Veta sends nothing on its own.</dd></div>` +
          `<div><dt>From when</dt><dd>From tomorrow, Tuesday 24 November.</dd></div></dl>` +
          UI.nota({texto: 'If it doesn\'t convince, you remove it from here with one tap.', icono: 'info', clase: 'nota-gris'});
      }
      let h = `<div class="d-regla-cab" data-i="0">${UI.etiqueta(tq, tt)}<span class="d-regla-quien">${esc(r.propone)}</span></div>`;
      if (e.linea && !e.inicial) h += `<div data-i="0">${UI.lineaHecho({texto: e.linea, hora: e.hora, vt: 'regla-' + p.id, boton: {texto: 'Undo', accion: 'deshacer-regla'}})}</div>`;
      h += `<blockquote class="d-frase" data-i="1">${esc(r.frase)}</blockquote>`;
      if (e.f === 'propuesta') {
        h += UI.bloque({titulo: 'If you try it for two weeks', i: 2, texto: 'For 14 days I show each agent what I would have done, without doing it. Nobody receives anything. Then you decide whether it stays for everyone.'});
      } else if (e.f === 'a-prueba') {
        const dia = r.dia || 1;
        h += UI.bloque({titulo: 'On trial', i: 2, html: UI.pasos({hecho: dia, total: 14, texto: 'day ' + dia + ' of 14 · until 7 December'}) +
          `<p class="bloque-sub">Each agent sees what Veta would have done, without anything going out. ${dia >= 9 ? 'So far, the team would have left it unchanged in 9 out of 10 cases.' : 'When it ends, I\'ll ask you whether it stays.'}</p>`});
      } else if (e.f === 'en-marcha') {
        h += UI.bloque({titulo: 'In use', i: 2, texto: e.propio ? 'The whole team uses it.' : 'Used by ' + (r.usan || '4 of 6') + ' people on the team.'});
      }
      h += UI.bloque({titulo: 'In the office, since ' + (r.decision ? 'August' : '3 October'), i: 3, html: `<p class="d-dato"><b>${esc(r.desde.split(' ')[0])}</b> ${esc(r.desde.split(' ').slice(1).join(' '))}</p>`});
      return h;
    },
    botonFijo: p => {
      const r = R(p.id), e = fase(p.id);
      if (confirmando === p.id) return UI.boton({texto: 'Extend to the 6 people', accion: 'extender'}) + UI.boton({tipo: 'texto', texto: 'Cancel', accion: 'cancelar'});
      if (e.f === 'propuesta') return UI.boton({texto: 'Put it on trial', accion: 'probar'}) + UI.botones([{texto: 'Something else…', hoja: 'd-regla-otra', datos: {regla: p.id}}]);
      if ((e.f === 'a-prueba' && !r.decision) || (e.f === 'en-marcha' && e.inicial)) return UI.boton({texto: 'Extend it to the whole team', accion: 'confirmar'});
      return '';
    },
    acciones: {
      probar(ev, el, p) {
        const r = R(p.id);
        M.marca(r.decision, 'hecha', {fase: 'a-prueba', linea: 'On trial with the whole team until 7 December'});
        VETA.repinta({hecho: 'regla-' + p.id});
      },
      confirmar(ev, el, p) { confirmando = p.id; VETA.repinta(); VETA.mov.cascada(VETA.$('.col.activa .pant')); },
      cancelar() { confirmando = null; VETA.repinta(); },
      extender(ev, el, p) {
        confirmando = null;
        const t = X.lee('practicas', {}); t[p.id] = {hora: VETA.ahora()}; X.guarda('practicas', t);
        VETA.repinta({hecho: 'regla-' + p.id});
      },
      'deshacer-regla'(ev, el, p) {
        const r = R(p.id);
        if (r.decision) M.deshaz(r.decision);
        else { const t = X.lee('practicas', {}); delete t[p.id]; X.guarda('practicas', t); }
        VETA.repinta({hecho: 'regla-' + p.id});
      }
    }
  });
})();
