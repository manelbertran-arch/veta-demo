/* Veta demo · ronda 8 · pantallas · regla-oficina.js · carril D
   G2b · Un trabajo para la oficina · #/regla-oficina/<id> — dossier (propuesta), mismo-dia (a prueba) y actas (en marcha).
   Una tarjeta de Veta (la propuesta) y una lista de datos: quién lo hace («Paso 1 de 5», en texto), cómo va la prueba y desde cuándo.
   Pie: propuesta → «Pruébalo» y la nota (lo demás, en «Más», como en un asunto); tras la prueba → «Extenderla a todo el equipo» → confirmación
   (a quién, qué cambia, desde cuándo) → «En marcha · la usa todo el equipo · Deshacer». Ya en marcha, pregunta si da un paso más. */
(function () {
  'use strict';
  const M = VETA.modelo, X = VETA.dir, r7 = VETA.r7, C = () => VETA.c;
  const R = id => (VETA.datos.reglasOficina || {})[id] || VETA.datos.reglasOficina.dossier;
  let confirmando = null;                                        // id de la regla que enseña su confirmación
  let recien = null;                                             // id de la regla recién decidida: mientras siga abierta, el pie dice lo siguiente
  window.addEventListener('hashchange', () => { recien = null; });
  const FIN = '2026-12-07', MANANA = '2026-11-24';               // fin de las dos semanas de prueba · desde cuándo se extiende
  const hasta = () => 'A prueba hasta el ' + VETA.fecha.corta(FIN, {frase: true});

  // fase de una regla: 'propuesta' | 'a-prueba' | 'en-marcha' | 'descartada' | 'luego'
  function fase(id) {
    const r = R(id);
    if (r.decision) {
      const c = M.cosa(r.decision);
      if (!c || !X.resuelta(c)) return {f: 'propuesta'};
      const x = c.extra || {};
      if (c.estado === 'quitada') return {f: 'descartada', linea: x.linea, hora: c.hora};
      if (c.estado === 'para-manana') return {f: 'luego', linea: x.linea, hora: c.hora};
      return {f: x.fase || 'a-prueba', linea: x.linea || hasta(), hora: c.hora};
    }
    const e = X.lee('practicas', {})[id];
    if (e) return {f: 'en-marcha', linea: 'En marcha con todo el equipo', hora: e.hora, propio: true};
    return {f: r.estado, inicial: true};
  }
  const subido = id => X.lee('nivelOf', {})[id];
  const nivel = (id, e) => subido(id) ? 4 : ({propuesta: 1, 'a-prueba': 2, 'en-marcha': 3})[e.f] || 1;
  // ya en marcha y sin subir: puede dar un paso más (dejar de pedir permiso). Si el pie está libre, es el botón; si no, va en «Más»
  const puedeSubir = (id, e) => e.f === 'en-marcha' && !subido(id);
  const extiende = (id, e) => (e.f === 'a-prueba' && !R(id).decision) || (e.f === 'en-marcha' && e.inicial);
  // dar el paso: el final de siempre («✓ Ya no pido permiso · 9:41 · Deshacer» arriba), sin aviso negro
  const sube = id => { const t = X.lee('nivelOf', {}); t[id] = {hora: VETA.ahora()}; X.guarda('nivelOf', t); recien = id; VETA.repinta({hecho: 'regla-' + id}); };
  VETA.d1.subeRegla = sube;   // lo llama la hoja «Más» (d-regla-mas)
  VETA.d1.subidaRegla = id => !!subido(id);   // lo lee la raíz Veta (oficina.js)
  // la fase de un trabajo de la oficina, para «Cómo trabajamos» (G10): la misma práctica no puede decir dos cosas. null si no tiene pantalla aquí
  VETA.d1.decideRegla = id => { recien = id; VETA.repinta({hecho: 'regla-' + id}); VETA.d1.numeros(); };   // lo llama «Más» (d-regla-otra)
  VETA.d1.pasoRegla = id => nivel(id, fase(id));   // en qué paso de «¿Quién lo hace?» va este trabajo de la OFICINA (lo lee la hoja d-escalera-of)
  VETA.d1.faseRegla = id => ((VETA.datos.reglasOficina || {})[id] ? fase(id) : null);
  // «Subir un paso para todos» (hoja h22, desde «¿Quién lo hace?»): el paso siguiente de ESTE trabajo y hacerlo. Es el mismo recorrido de la pantalla:
  // propuesta → a prueba («Pruébalo») → en marcha («Extenderla a todo el equipo») → «Ya no pido permiso». null si no hay otro paso que dar.
  const probar = id => { M.marca(R(id).decision, 'hecha', {fase: 'a-prueba', linea: hasta()}); recien = id; VETA.repinta({hecho: 'regla-' + id}); VETA.d1.numeros(); };
  const extender = id => { confirmando = null; recien = id; const t = X.lee('practicas', {}); t[id] = {hora: VETA.ahora()}; X.guarda('practicas', t); VETA.repinta({hecho: 'regla-' + id}); VETA.d1.numeros(); };
  VETA.d1.sigPaso = id => {
    if (!(VETA.datos.reglasOficina || {})[id]) return null;
    const e = fase(id); if (['descartada', 'luego'].includes(e.f) || subido(id)) return null;
    // solo hay paso que subir donde la pantalla lo da de verdad: probar una propuesta, extender lo que está a prueba (si no depende de una decisión: el dossier espera
    // a que acabe la prueba, «Al acabar, te pregunto») y dejar de pedir permiso a lo que ya está en marcha. Lo demás, sin botón: ni se ofrece ni se promete
    const hay = e.f === 'propuesta' ? !!R(id).decision : e.f === 'a-prueba' ? extiende(id, e) : e.f === 'en-marcha' ? puedeSubir(id, e) : false;
    const n = nivel(id, e), niv = VETA.vivo.niveles(); return hay && n < 4 ? {de: niv[n - 1], a: niv[n]} : null;
  };
  VETA.d1.subePaso = id => {
    const e = fase(id);
    if (!VETA.d1.sigPaso(id)) return;
    if (e.f === 'propuesta') { if (R(id).decision) probar(id); } else if (e.f === 'a-prueba') extender(id); else if (e.f === 'en-marcha') sube(id);
  };

  VETA.pantalla('G2b', {
    titulo: p => R(p.id).corto || R(p.id).titulo,
    sub: p => confirmando === p.id ? 'Vas a extenderlo a todo el equipo.' : '',
    nota: p => confirmando !== p.id && fase(p.id).f === 'propuesta' ? 'Dos semanas de prueba, sin que salga nada.' : '',
    // «Más»: en la propuesta, lo que no es probarla (descartarla, para luego…), como en un asunto; en marcha y con el pie ocupado, dejar de pedir permiso
    mas: p => { const e = fase(p.id); if (confirmando === p.id) return null;
      return e.f === 'propuesta' ? {hoja: 'd-regla-otra', datos: {regla: p.id}} : puedeSubir(p.id, e) && extiende(p.id, e) ? {hoja: 'd-regla-mas', datos: {regla: p.id}} : null; },
    casoDictado: p => ({de: 'regla-' + p.id, titulo: R(p.id).titulo, texto: R(p.id).frase}),
    pinta: p => {
      const r = R(p.id), e = fase(p.id);
      if (confirmando === p.id) return r7.doc({i: 0, datos: [r.titulo], secciones: [
        {rotulo: 'A quién', texto: 'Las 6 personas del equipo: Laura, Montse, Anna, Teresa, Marc y David.'},
        {rotulo: 'Qué cambia', texto: r.frase + ' Cada agente sigue enviando lo suyo: Veta no manda nada sola.'},
        {rotulo: 'Desde cuándo', texto: `Desde mañana, ${VETA.fecha.larga(MANANA, {frase: true})}. Si no convence, lo quitas desde aquí.`}]});
      let h = '';
      const sub4 = subido(p.id);
      if (sub4) h += r7.hecho({texto: 'Ya no pido permiso: lo hago yo', hora: sub4.hora ? VETA.fecha.hora(sub4.hora) : '', vt: 'regla-' + p.id, deshacer: 'bajar-of'});
      else if (e.linea && !e.inicial) h += r7.hecho({texto: e.linea, hora: e.hora ? VETA.fecha.hora(e.hora) : '', vt: 'regla-' + p.id, deshacer: 'deshacer-regla'});
      h += r7.tarjeta({veta: true, de: r.propone, texto: r.frase, i: 0});
      // ya en marcha: pregunta si da un paso más, con sus casos contados
      if (puedeSubir(p.id, e) && !extiende(p.id, e) && recien !== p.id) h += r7.tarjeta({veta: true, i: 1, de: '¿Dejo de pedir permiso?', texto: 'Lo he hecho 42 veces y me corregisteis 1. Si quieres, lo hago yo y os lo cuento después.'});
      const filas = [];
      // «¿Quién lo hace?»: el paso de ahora, en texto (antes, cinco puntitos)
      if (!['descartada', 'luego'].includes(e.f)) { const n = nivel(p.id, e), niv = VETA.vivo.niveles(); filas.push({nombre: '¿Quién lo hace?', pasa: `Paso ${n} de ${niv.length} · ${niv[n - 1].nombre}`, hoja: 'd-escalera-of', datos: {regla: p.id}}); }
      if (e.f === 'propuesta') filas.push({nombre: 'Si lo pruebas', pasa: 'Cada agente ve qué habría hecho yo.'});
      else if (e.f === 'a-prueba') { const dia = r.dia || 1; filas.push({nombre: `A prueba · día ${dia} de 14`,
        pasa: dia >= 9 ? 'El equipo lo habría dejado igual 9 de cada 10 veces.' : `Hasta el ${VETA.fecha.corta(FIN, {frase: true})}. Al acabar, te pregunto.`}); }
      else if (e.f === 'en-marcha') filas.push({nombre: 'En marcha', pasa: e.propio ? 'La usa todo el equipo' : 'La usan ' + (r.usan || '4 de 6') + ' personas del equipo'});
      // lo mismo que le abre A10 a una agente: las veces que se hizo distinto (cada una, su caso) y «Cambiar algo» (No con un cliente…)
      const k = r.casosDe && e.f === 'propuesta' && (M.regla(r.casosDe) || {}).casos, ex = C().excepciones(p.id);
      if (k && k.distinto) filas.push({nombre: `${k.distinto.length} veces se hizo distinto`, hoja: 'c-veces', datos: {regla: r.casosDe}});
      if (!['descartada', 'luego'].includes(e.f)) filas.push({nombre: 'Cambiar algo', hoja: 'h20', datos: {de: p.id}});
      if (ex.length) filas.push({nombre: 'No con un cliente', pasa: ex.length === 1 ? `Con ${(M.quien(ex[0]) || {}).nombre || ex[0]}, no` : `Con ${ex.length} clientes, no`});
      filas.push({nombre: 'Desde que empezamos', pasa: r.desde.replace(/( desde que empezamos)?\.$/, '')});
      h += r7.lista(filas, {i: 2});
      return h;
    },
    botonFijo: p => {
      const e = fase(p.id);
      if (confirmando === p.id) return r7.botones({texto: 'Sí, extenderla', accion: 'extender'}, {texto: 'Cancelar', accion: 'cancelar'});
      if (e.f === 'propuesta') return r7.botones({texto: 'Pruébalo', accion: 'probar'});
      // recién decidido (o ya descartado o dejado para luego): lo siguiente que espera, o Inicio
      if (recien === p.id || ['descartada', 'luego'].includes(e.f)) return r7.sigue(VETA.d1.siguiente());
      if (extiende(p.id, e)) return r7.botones({texto: 'Extenderla a todo el equipo', accion: 'confirmar'});
      if (puedeSubir(p.id, e)) return r7.botones({texto: 'Sí, hazlo tú', accion: 'subir-of'});
      return '';
    },
    acciones: {
      probar(ev, el, p) { probar(p.id); },   // el punto de Inicio se pone al día
      confirmar(ev, el, p) { confirmando = p.id; VETA.repinta(); },
      cancelar() { confirmando = null; VETA.repinta(); },
      'subir-of'(ev, el, p) { sube(p.id); },
      'bajar-of'(ev, el, p) { const t = X.lee('nivelOf', {}); delete t[p.id]; X.guarda('nivelOf', t); recien = null; VETA.repinta({hecho: 'regla-' + p.id}); },
      extender(ev, el, p) { extender(p.id); },
      'deshacer-regla'(ev, el, p) {
        const r = R(p.id);
        if (r.decision) M.deshaz(r.decision);
        else { const t = X.lee('practicas', {}); delete t[p.id]; X.guarda('practicas', t); }
        recien = null; VETA.repinta({hecho: 'regla-' + p.id}); VETA.d1.numeros();
      },
      'd-sigue': (ev, el) => VETA.d1.sigue(ev, el)
    }
  });
})();
