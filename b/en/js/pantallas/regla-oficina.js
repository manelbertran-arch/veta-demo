/* Veta demo · pantallas · regla-oficina.js · paquete D (Dirección)
   G2b · Una regla para la oficina · #/regla-oficina/<id> — dossier (propuesta de Laura), mismo-dia (a prueba) y actas (en marcha).
   Estados: propuesta → “Ponerla a prueba” → “A prueba con todo el equipo hasta el 7 de diciembre · Deshacer”.
   Tras la prueba: “Extenderla a todo el equipo” → confirmación (a quién, qué cambia, desde cuándo) → “En marcha · la usa todo el equipo · Deshacer”. */
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
  const etq = f => ({propuesta: ['por-decidir', 'You have to decide'], 'a-prueba': ['a-prueba', null], 'en-marcha': ['en-marcha', null], descartada: ['cerrado', 'Dismissed'], luego: ['para-manana', 'For later']})[f] || ['por-decidir', null];

  VETA.pantalla('G2b', {
    titulo: p => R(p.id).titulo,
    frase: p => {
      const r = R(p.id), e = fase(p.id);
      if (confirmando === p.id) return 'You are going to extend it to the whole team. See to whom, what changes and from when.';
      return ({propuesta: 'Try it for two weeks with nothing going out, or choose something else. You decide.',
        'a-prueba': 'On trial until 7 December. No one receives anything. At the end, you decide if it stays.',
        'en-marcha': 'The office already does it. You can let me do it without asking permission.'})[e.f] || r.propone + '.';
    },
    // ronda 7 · D2: una ficha (la propuesta, en oro), “¿Quién lo hace?” y una lista; sin títulos de sección (R2)
    pinta: p => {
      const r = R(p.id), e = fase(p.id), tt = etq(e.f)[1];
      if (confirmando === p.id) {
        return `<div class="r7-ficha" data-i="0"><span class="r7-ficha-de">${esc(r.titulo)}</span>` +
          `<dl class="d-confirma">` +
          `<div><dt>Who</dt><dd>The 6 people on the team: Laura, Montse, Anna, Teresa, Marc and David.</dd></div>` +
          `<div><dt>What changes</dt><dd>${esc(r.frase)} Each agent keeps sending their own: Veta sends nothing on its own.</dd></div>` +
          `<div><dt>From when</dt><dd>From tomorrow, Tuesday 24 November. If it does not work, you take it off from here.</dd></div></dl></div>`;
      }
      let h = '';
      if (e.linea && !e.inicial) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: e.linea, hora: e.hora, vt: 'regla-' + p.id, boton: {texto: 'Undo', accion: 'deshacer-regla'}})}</div>`;
      h += `<div class="r7-ficha r7-oro" data-i="0"><span class="r7-ficha-de">${esc(r.propone)}</span><p>${esc(r.frase)}</p>` +
        (tt && e.f !== 'propuesta' ? `<p>${VETA.r7.pastilla(tt, 'gris')}</p>` : '') + VETA.r7.ensena({guion: 'orden', texto: 'Teach it another way'}) + `</div>`;
      // “¿Quién lo hace?”: los cinco pasos a la vista; la que ya está en marcha pregunta si sube uno, con sus casos contados
      const sube = X.lee('nivelOf', {})[p.id], niv = sube || ({propuesta: 1, 'a-prueba': 2, 'en-marcha': 3})[e.f] || 1;
      if (!['descartada', 'luego'].includes(e.f)) h += `<div class="r7-ficha d2-mas-abajo" data-i="1"><span class="r7-ficha-de">Who does it?</span>` + (e.f === 'en-marcha' && !sube
        ? VETA.vivo.escalera({nivel: niv, desde: 'since 3 September', sube: {hechas: 42, corregidas: 1, pregunta: 'Shall I stop asking permission and tell you afterwards?', boton: 'Yes, you do it', accion: 'subir-of', de: p.id}})
        : VETA.vivo.escalera({nivel: niv, desde: sube ? 'today' : e.f === 'a-prueba' ? 'day 1 of the trial' : 'today', mini: true})) + `</div>`;
      const filas = [];
      if (e.f === 'propuesta') filas.push({icono: 'probeta', nombre: 'If you try it for two weeks', pasa: 'No one receives anything',
        abre: '<p>For 14 days I show each agent what I would have done, without doing it. Nobody receives anything. Then you decide whether it stays for everyone.</p>'});
      else if (e.f === 'a-prueba') { const dia = r.dia || 1; filas.push({icono: 'reloj', nombre: `On trial · day ${dia} of 14`, pasa: 'Until 7 December',
        abre: `<p>Each agent sees what Veta would have done, without anything going out. ${dia >= 9 ? 'So far, the team would have left it unchanged in 9 out of 10 cases.' : 'When it ends, I\'ll ask you whether it stays.'}</p>`}); }
      else if (e.f === 'en-marcha') filas.push({icono: 'check', nombre: 'In use', pasa: e.propio ? 'The whole team uses it' : 'Used by ' + (r.usan || '4 of 6') + ' people on the team'});
      filas.push({icono: 'grafica', nombre: 'In the office, since we started', pasa: r.desde});
      h += VETA.r7.lista(filas, {i: 2, clase: 'd2-mas-abajo'});
      return h;
    },
    botonFijo: p => {
      const r = R(p.id), e = fase(p.id);
      if (confirmando === p.id) return VETA.r7.botones({texto: 'Extend to the 6 people', accion: 'extender'}, [{texto: 'Cancel', accion: 'cancelar'}]);
      if (e.f === 'propuesta') return VETA.r7.botones({texto: 'Try it', accion: 'probar'}, [{texto: 'Something else…', hoja: 'd-regla-otra', datos: {regla: p.id}}]);
      if ((e.f === 'a-prueba' && !r.decision) || (e.f === 'en-marcha' && e.inicial)) return VETA.r7.botones({texto: 'Extend it to the whole team', accion: 'confirmar'});
      return '';
    },
    acciones: {
      probar(ev, el, p) {
        const r = R(p.id);
        M.marca(r.decision, 'hecha', {fase: 'a-prueba', linea: 'On trial with the whole team until 7 December'});
        VETA.repinta({hecho: 'regla-' + p.id}); if (VETA.pintaBarra) VETA.pintaBarra();   // el número de “Decidir” se pone al día
      },
      confirmar(ev, el, p) { confirmando = p.id; VETA.repinta(); VETA.mov.cascada(VETA.$('.col.activa .pant')); },
      cancelar() { confirmando = null; VETA.repinta(); },
      'subir-of'(ev, el, p) {
        const t = X.lee('nivelOf', {}); t[p.id] = 4; X.guarda('nivelOf', t); VETA.repinta();
        VETA.aviso('Done: I do it myself and tell you afterwards.', {deshacer: () => { const u = X.lee('nivelOf', {}); delete u[p.id]; X.guarda('nivelOf', u); VETA.repinta(); }, ensena: 'OK. I will keep asking permission every time.'});
      },
      extender(ev, el, p) {
        confirmando = null;
        const t = X.lee('practicas', {}); t[p.id] = {hora: VETA.ahora()}; X.guarda('practicas', t);
        VETA.repinta({hecho: 'regla-' + p.id}); if (VETA.pintaBarra) VETA.pintaBarra();   // el número de “Decidir” se pone al día
      },
      'deshacer-regla'(ev, el, p) {
        const r = R(p.id);
        if (r.decision) M.deshaz(r.decision);
        else { const t = X.lee('practicas', {}); delete t[p.id]; X.guarda('practicas', t); }
        VETA.repinta({hecho: 'regla-' + p.id}); if (VETA.pintaBarra) VETA.pintaBarra();   // el número de “Decidir” se pone al día
      }
    }
  });
})();
