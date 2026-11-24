/* Veta demo · ronda 8 · pantallas · regla-oficina.js · carril D
   G2b · Un trabajo para la oficina · #/regla-oficina/<id> — dossier (propuesta), mismo-dia (a prueba) y actas (en marcha).
   Una tarjeta de Veta (la propuesta) y una lista de datos: quién lo hace (“Paso 1 de 5”, en texto), cómo va la prueba y desde cuándo.
   Pie: propuesta → “Pruébalo” y la nota (lo demás, en “Más”, como en un asunto); tras la prueba → “Extenderla a todo el equipo” → confirmación
   (a quién, qué cambia, desde cuándo) → “En marcha · la usa todo el equipo · Deshacer”. Ya en marcha, pregunta si da un paso más. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, X = VETA.dir, r7 = VETA.r7;
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
  const subido = id => X.lee('nivelOf', {})[id];
  const nivel = (id, e) => subido(id) || ({propuesta: 1, 'a-prueba': 2, 'en-marcha': 3})[e.f] || 1;
  // ya en marcha y sin subir: puede dar un paso más (dejar de pedir permiso). Si el pie está libre, es el botón; si no, va en “Más”
  const puedeSubir = (id, e) => e.f === 'en-marcha' && !subido(id);
  const extiende = (id, e) => (e.f === 'a-prueba' && !R(id).decision) || (e.f === 'en-marcha' && e.inicial);
  const sube = id => {
    const t = X.lee('nivelOf', {}); t[id] = 4; X.guarda('nivelOf', t); VETA.repinta();
    VETA.aviso('Done: I do it myself and tell you afterwards.', {deshacer: () => { const u = X.lee('nivelOf', {}); delete u[id]; X.guarda('nivelOf', u); VETA.repinta(); }, ensena: 'OK. I will keep asking permission every time.'});
  };
  VETA.d1.subeRegla = sube;   // lo llama la hoja “Más” (d-regla-mas)
  // la fase de un trabajo de la oficina, para “Cómo trabajamos” (G10): la misma práctica no puede decir dos cosas. null si no tiene pantalla aquí
  VETA.d1.faseRegla = id => ((VETA.datos.reglasOficina || {})[id] ? fase(id) : null);

  VETA.pantalla('G2b', {
    titulo: p => R(p.id).corto || R(p.id).titulo,
    sub: p => confirmando === p.id ? 'You\'re rolling it out to the whole team.' : '',
    nota: p => confirmando !== p.id && fase(p.id).f === 'propuesta' ? 'A two-week trial. Nothing goes out.' : '',
    // “Más”: en la propuesta, lo que no es probarla (descartarla, para luego…), como en un asunto; en marcha y con el pie ocupado, dejar de pedir permiso
    mas: p => { const e = fase(p.id); if (confirmando === p.id) return null;
      return e.f === 'propuesta' ? {hoja: 'd-regla-otra', datos: {regla: p.id}} : puedeSubir(p.id, e) && extiende(p.id, e) ? {hoja: 'd-regla-mas', datos: {regla: p.id}} : null; },
    casoDictado: p => ({de: 'regla-' + p.id, titulo: R(p.id).titulo, texto: R(p.id).frase}),
    pinta: p => {
      const r = R(p.id), e = fase(p.id);
      if (confirmando === p.id) return r7.doc({i: 0, datos: [r.titulo], secciones: [
        {rotulo: 'Who', texto: 'The 6 people on the team: Laura, Montse, Anna, Teresa, Marc and David.'},
        {rotulo: 'What changes', texto: r.frase + ' Each agent keeps sending their own: Veta sends nothing on its own.'},
        {rotulo: 'From when', texto: 'From tomorrow, Tuesday 24 November. If it does not work, you take it off from here.'}]});
      let h = '';
      if (e.linea && !e.inicial) h += `<div data-i="0">${UI.lineaHecho({texto: e.linea, hora: e.hora, vt: 'regla-' + p.id, boton: {texto: 'Undo', accion: 'deshacer-regla'}})}</div>`;
      h += r7.tarjeta({veta: true, de: r.propone, texto: r.frase, i: 0});
      // ya en marcha: pregunta si da un paso más, con sus casos contados
      if (puedeSubir(p.id, e) && !extiende(p.id, e)) h += r7.tarjeta({veta: true, i: 1, de: 'Shall I stop asking first?', texto: 'I\'ve done it 42 times and you corrected me once. If you like, I\'ll do it and tell you afterwards.'});
      const filas = [];
      // “¿Quién lo hace?”: el paso de ahora, en texto (antes, cinco puntitos)
      if (!['descartada', 'luego'].includes(e.f)) { const n = nivel(p.id, e), niv = VETA.vivo.niveles(); filas.push({nombre: 'Who does it?', pasa: `Step ${n} of ${niv.length} · ${niv[n - 1].nombre}`}); }
      if (e.f === 'propuesta') filas.push({nombre: 'If you try it', pasa: 'Each agent sees what I\'d have done.'});
      else if (e.f === 'a-prueba') { const dia = r.dia || 1; filas.push({nombre: `On trial · day ${dia} of 14`,
        pasa: dia >= 9 ? 'So far, the team would have left it unchanged in 9 out of 10 cases.' : 'Until 7 December. When it ends, I\'ll ask if it stays.'}); }
      else if (e.f === 'en-marcha') filas.push({nombre: 'In use', pasa: e.propio ? 'The whole team uses it' : 'Used by ' + (r.usan || '4 of 6') + ' people on the team'});
      filas.push({nombre: 'Since we started', pasa: r.desde.replace(/( since we started)?\.$/, '')});
      h += r7.lista(filas, {i: 2});
      return h;
    },
    botonFijo: p => {
      const e = fase(p.id);
      if (confirmando === p.id) return r7.botones({texto: 'Yes, roll it out', accion: 'extender'}, {texto: 'Cancel', accion: 'cancelar'});
      if (e.f === 'propuesta') return r7.botones({texto: 'Try it', accion: 'probar'});
      if (extiende(p.id, e)) return r7.botones({texto: 'Extend it to the whole team', accion: 'confirmar'});
      if (puedeSubir(p.id, e)) return r7.botones({texto: 'Yes, you do it', accion: 'subir-of'});
      return '';
    },
    acciones: {
      probar(ev, el, p) {
        const r = R(p.id);
        M.marca(r.decision, 'hecha', {fase: 'a-prueba', linea: 'On trial with the whole team until 7 December'});
        VETA.repinta({hecho: 'regla-' + p.id}); VETA.d1.numeros();   // el punto de Inicio se pone al día
      },
      confirmar(ev, el, p) { confirmando = p.id; VETA.repinta(); },
      cancelar() { confirmando = null; VETA.repinta(); },
      'subir-of'(ev, el, p) { sube(p.id); },
      extender(ev, el, p) {
        confirmando = null;
        const t = X.lee('practicas', {}); t[p.id] = {hora: VETA.ahora()}; X.guarda('practicas', t);
        VETA.repinta({hecho: 'regla-' + p.id}); VETA.d1.numeros();
      },
      'deshacer-regla'(ev, el, p) {
        const r = R(p.id);
        if (r.decision) M.deshaz(r.decision);
        else { const t = X.lee('practicas', {}); delete t[p.id]; X.guarda('practicas', t); }
        VETA.repinta({hecho: 'regla-' + p.id}); VETA.d1.numeros();
      }
    }
  });
})();
