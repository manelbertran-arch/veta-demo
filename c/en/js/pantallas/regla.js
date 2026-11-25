/* Veta demo · pantallas · regla.js · carril C (Veta y cuenta)
   - A10 · Un trabajo · #/regla/<id>   (una pantalla, cuatro estados: propuesta · a prueba · activa · descartada)
   - A10b · ¿Quién lo hace? · #/regla/<id>/nivel
   Arriba, una tarjeta: la pregunta de Veta (con el par “No, sigue igual” / “Sí” en el pie) o lo que hace ahora. Debajo, una lista
   de filas que abren otra cosa. Sus hojas (h18 un caso, h19 los casos iguales, h20 cambiar algo, h22 subir un paso, c-veces, c-lee,
   c-excepto) están en js/hojas/veta.js. Las dos pantallas comparten la pregunta, su respuesta y el final (segunda vuelta de la ronda 8):
   la fila de hecho con “Deshacer” arriba y, en el pie, el siguiente trabajo que propongo o “Ir a Inicio”. */
(function () {
  'use strict';
  const M = VETA.modelo, C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;
  const linea = id => { const l = C.lee('linea', null); const r = M.regla(id); return l && r && l.id === id && l.estado === r.estado ? l : null; };
  C.excepciones = id => C.lee('excepciones', {})[id] || [];
  C.ponExcepcion = (id, cliente) => { const e = C.lee('excepciones', {}); e[id] = (e[id] || []).filter(x => x !== cliente).concat(cliente ? [cliente] : []); C.pon('excepciones', e); };
  C.quitaExcepcion = (id, cliente) => { const e = C.lee('excepciones', {}); e[id] = (e[id] || []).filter(x => x !== cliente); C.pon('excepciones', e); };
  // cambia el estado de una regla y deja la línea en el sitio
  C.cambiaRegla = (id, estado, texto) => {
    M.marca(id, estado);
    C.pon('linea', {id, estado, texto});
    VETA.repinta({hecho: 'c-regla'});
  };

  // ---- “¿Quién lo hace?”: de “Lo haces tú” a “Lo hago yo”, con la pregunta para subir un paso ----
  const NV = () => VETA.vivo.niveles();
  const subeDe = id => {
    if (id === 'r-visitas') { const v = C.visitas(), s = C.r6().visitas.sube[v.estado]; return s ? Object.assign({accion: 'subir', de: id}, s) : null; }   // solo pregunta mientras es una propuesta
    const x = C.r6().pasos[id]; return x && x.sube && C.paso(id) === x.paso && (M.regla(id) || {}).estado === 'activa' ? Object.assign({accion: 'subir', de: id}, x.sube) : null;
  };
  // lo que digo justo después de subir un paso, en el sitio de la pregunta: sin historial (empieza hoy) y sin otra pregunta
  const MAS = ' When I have done it a few times, I ask you if I should do one more step.';
  const notaDe = id => {
    if (id === 'r-visitas') return C.visitas().estado === 'prueba' ? C.r6().visitas.hecho : '';
    const l = C.lee('nivelLinea', null), n = C.paso(id); if (!l || l.id !== id) return '';
    return `From today, ${n >= 4 ? 'I do it and tell you' : n === 3 ? 'I note it down' : 'I write it for you'}.` + (n < 4 ? MAS : '');
  };
  // la línea en el sitio al subir un paso, con “Deshacer”
  const lineaPaso = id => {
    const l = id === 'r-visitas' ? C.lee('visLinea', null) : C.lee('nivelLinea', null);
    if (!l || (id !== 'r-visitas' && l.id !== id) || (id === 'r-visitas' && l.estado !== VETA.r6.reglaVisitas())) return '';
    return R7().hecho({texto: l.texto, hora: l.hora, deshacer: 'baja', vt: 'c-paso'});
  };
  C.subir = id => {
    if (id === 'r-visitas') {
      const antes = VETA.r6.reglaVisitas(); if (antes !== 'propuesta') return;     // la prueba empieza hoy: no hay otro paso que dar todavía
      const v = VETA.r6.subeReglaVisitas();
      C.pon('visLinea', {estado: v, antes, hora: VETA.ahora(), texto: 'I\'m trying it · from today'});
    } else {
      const n = C.paso(id); C.ponNivel(id, n + 1);
      C.pon('nivelLinea', {id, texto: `${NV()[n].nombre} · from today`, hora: VETA.ahora(), subido: n});
    }
    VETA.repinta({paso: true});
  };
  C.bajar = id => {
    if (id === 'r-visitas') { const l = C.lee('visLinea', null); if (l) VETA.r6.ponReglaVisitas(l.antes); C.pon('visLinea', null); }
    else { const l = C.lee('nivelLinea', null); if (l && l.subido) C.ponNivel(id, l.subido); C.pon('nivelLinea', null); }
    VETA.repinta({paso: true});
    VETA.aviso('OK. I go back to doing it as before: I do not do it without asking you.');
  };

  // ---- A10 · la pregunta de ahora (si hay que decidir algo): {de, antes: 'Lo he hecho 14 veces…', q: '¿Lo apunto yo…?', accion} ----
  const igual = id => !!(C.lee('igual', {}) || {})[id];
  const pregunta = (id, r) => {
    if (igual(id) || notaDe(id)) return null;
    const s = subeDe(id);
    if (s) return {de: id === 'r-visitas' ? 'My suggestion' : 'One more step', antes: s.hechas != null ? `I have done it ${s.hechas} times and you corrected me ${s.corregidas || 0}.` : '', q: s.pregunta, accion: 'subir'};
    if (r && (r.estado === 'propuesta' || r.estado === 'nueva')) return {de: 'My suggestion', antes: `You have done it ${C.veces(r)} times.`, q: 'Shall I try it for two weeks?', accion: 'prueba'};
    return null;
  };
  // sin pregunta: lo que hago ahora en este trabajo, en una frase
  const ahora = (id, r) => {
    const nota = notaDe(id); if (nota) return nota;
    if (r && r.estado === 'descartada') return 'I\'ve stopped doing it. I won\'t suggest it again.';
    if (r && r.estado === 'a-prueba') return `I'm trying it ${C.fechaPrueba}. I send nothing.`;
    if (id === 'r-visitas') return C.visitas().estado === 'propuesta' ? 'You do it.' : C.visitas().frase;
    if (r && (r.estado === 'propuesta' || r.estado === 'nueva')) return 'You do it.';
    return C.info(id).frase || (NV()[C.paso(id) - 1] || {}).texto || '';
  };
  const tarjeta = (id, r) => {
    const q = pregunta(id, r);
    return R7().tarjeta(q ? {veta: true, de: q.de, texto: (q.antes ? q.antes + ' ' : '') + q.q, vt: 'c-paso', i: 1} : {de: 'Now', texto: ahora(id, r), vt: 'c-paso', i: 1});
  };
  // lo que va debajo: cada fila abre otra cosa (una pantalla o una hoja). La cola solo lleva números: el estado va en la segunda línea
  const abre = (que, id) => ({hoja: 'c-lee', datos: {que, regla: id}});
  function filas(id, r) {
    if (r && r.estado === 'descartada') return [];
    const n = C.paso(id), f = [{nombre: 'Who does it?', pasa: `${(NV()[n - 1] || {}).nombre} · step ${n} of 5`, ir: `regla/${id}/nivel`}];
    if (id === 'r-visitas') {
      f.push(Object.assign({nombre: `The ${C.r6().visitas.hechas} times you did it yourself`}, abre('veces', id)));
      if (C.visitas().estado !== 'prueba') f.push(Object.assign({nombre: 'What will happen'}, abre('pasara', id)));
      return f;
    }
    const k = r.casos || {};
    if (r.estado === 'propuesta' && k.distinto) {
      // las veces que lo hiciste tú, en dos filas: cada una abre lo suyo desde aquí (nada a más de tres toques de Inicio)
      f.push({nombre: `${(k.comoYo || []).length} times you did it the same way`, hoja: 'h19', datos: {regla: id}});
      f.push({nombre: `${k.distinto.length} times you did it differently`, hoja: 'c-veces', datos: {regla: id}});
      f.push(Object.assign({nombre: 'What will happen'}, abre('pasara', id)));
    } else if (r.estado === 'a-prueba') {
      if (id !== 'r-cancelaciones' && r.casos && !r.casos.comoYo) f.push({nombre: 'Where it applies', dato: r.casos.length, hoja: 'h19', datos: {regla: id}});
      f.push(Object.assign({nombre: 'Who sees it', pasa: C.lee('aOficina', {})[id] ? 'Montse, with your name' : 'Only you'}, abre('quien-ve', id)));
    } else if (r.estado === 'activa') {
      const u = C.ultimo(r).length;
      f.push(u ? Object.assign({nombre: 'The last thing I did', dato: u}, abre('ultimo', id)) : {nombre: 'The last thing I did', pasa: 'Nothing yet: I\'ll leave it in Home'});
    }
    // “No con un cliente” se abre desde aquí cuando el trabajo ya lo hago yo (en una propuesta sigue en “Cambiar algo”)
    if (r.estado === 'a-prueba' || r.estado === 'activa') {
      const ex = C.excepciones(id).map(c => (M.quien(c) || {}).nombre || c);
      f.push({nombre: 'Not with one client', pasa: ex.length === 1 ? `With ${ex[0]}, no` : ex.length ? `With ${ex.length} clients, no` : null, hoja: 'c-excepto', de: id});
    }
    f.push({nombre: 'Change something', hoja: 'h20', de: id});
    return f;
  }
  // el trabajo a prueba enseña en la pantalla lo que habría hecho: cada caso abre el suyo (h18)
  const casosPrueba = (id, r) => (id === 'r-cancelaciones' && r && r.estado === 'a-prueba'
    ? R7().lista(D().aPrueba.map(c => ({cara: c.id, nombre: c.nombre, pasa: c.propone, dato: c.cuando, hoja: 'h18', datos: {regla: id, caso: c.id}})), {rotulo: 'What I would have suggested', i: 2}) : '');
  // lo último que hice en un trabajo (lo de hoy, primero)
  C.ultimo = r => (r.casosHoy || []).map(x => 'Today · ' + x).concat(r.ultimo || []).slice(0, 4);

  const reglaDe = p => (p.id === 'r-visitas' ? null : M.regla(p.id));
  const existe = p => p.id === 'r-visitas' || !!M.regla(p.id);
  // ---- lo que comparten A10 y A10b: la fila de hecho, el pie y las acciones ----
  const arriba = p => {
    const r = reglaDe(p), l = r ? linea(p.id) : null, desc = r && r.estado === 'descartada', ig = (C.lee('igual', {}) || {})[p.id];
    return lineaPaso(p.id) || (l || desc ? R7().hecho({texto: l ? l.texto : 'I no longer do it · I will not suggest it again', hora: l ? r.hora : '', deshacer: 'deshacer', vt: 'c-regla'})
      : ig ? R7().hecho({texto: 'OK, keep it as is', hora: ig, deshacer: 'pregunta', vt: 'c-regla'}) : '');
  };
  const reciente = p => !!(lineaPaso(p.id) || (reglaDe(p) && linea(p.id)) || igual(p.id));
  // el pie: si hay pregunta, el sí o el no; recién contestada, el siguiente trabajo que te propongo o “Ir a Inicio”
  const pie = (p, nivel) => {
    if (!existe(p)) return '';
    const q = pregunta(p.id, reglaDe(p));
    if (q) return R7().botones({texto: nivel ? 'Yes, go ahead' : 'Yes', accion: q.accion}, {texto: nivel ? 'Not yet' : 'No, keep it as is', accion: 'igual'});
    if (!reciente(p)) return '';
    const otra = C.propuestas().filter(x => x.id !== p.id && !igual(x.id))[0];
    return otra ? R7().sigue({texto: 'Next: ' + C.titulo(otra.id), ir: 'regla/' + otra.id}) : R7().sigue();
  };
  const acciones = {
    prueba(ev, el, p) { C.cambiaRegla(p.id, 'a-prueba', 'I\'m trying it'); },
    deshacer(ev, el, p) { M.deshaz(p.id); C.pon('linea', null); VETA.repinta({hecho: 'c-regla'}); },
    subir(ev, el, p) { C.subir(p.id); VETA.pintaBarra(); },
    baja(ev, el, p) { C.bajar(p.id); VETA.pintaBarra(); },
    igual(ev, el, p) { const g = C.lee('igual', {}) || {}; g[p.id] = VETA.ahora(); C.pon('igual', g); VETA.repinta({hecho: 'c-regla'}); },
    pregunta(ev, el, p) { const g = C.lee('igual', {}) || {}; delete g[p.id]; C.pon('igual', g); VETA.repinta({hecho: 'c-regla'}); }
  };
  // el caso que se lleva a Dictar (“Decirlo de otra forma”, o el micro de la barra con este trabajo delante)
  const caso = p => (existe(p) ? {de: 'regla-' + p.id, titulo: C.titulo(p.id), texto: p.id === 'r-visitas' ? C.visitas().frase : (C.info(p.id).frase || C.nombre(p.id))} : null);

  VETA.pantalla('A10', {
    titulo: p => C.titulo(p.id),
    nota: p => (existe(p) && pregunta(p.id, reglaDe(p)) ? 'nada' : ''),
    casoDictado: caso,
    pinta: p => {
      const r = reglaDe(p);
      if (!existe(p)) return R7().lista([{nombre: 'This job is no longer here', pasa: 'See the ones I do', ir: 'veta'}]);
      const f = filas(p.id, r), casos = casosPrueba(p.id, r);
      return arriba(p) + tarjeta(p.id, r) + casos + (f.length ? R7().lista(f, casos ? {rotulo: 'How I do it', i: 3} : {i: 2}) : '');
    },
    botonFijo: pie,
    acciones
  });

  // ---- A10b · ¿Quién lo hace?: los cinco pasos, como una escalera que se lee y no se toca (D3) ----
  // El paso no se elige a dedo: Veta pregunta antes de dar uno más. Cuando pregunta, la pregunta va en su tarjeta y el sí o el no
  // en el pie, igual que en A10. Solo el paso de ahora dice qué significa; el último sigue cerrado y lo dice.
  C.nivel = id => C.paso(id);
  C.ponNivel = (id, n) => { const x = C.lee('nivel', {}); x[id] = n; C.pon('nivel', x); };
  VETA.pantalla('A10b', {
    titulo: 'Who does it?',
    sub: 'I change the step when I ask you and you say yes.',
    casoDictado: caso,
    pinta: p => {
      const n = C.paso(p.id), q = existe(p) ? pregunta(p.id, reglaDe(p)) : null;
      return arriba(p) + (q ? R7().tarjeta({veta: true, de: q.de, texto: (q.antes ? q.antes + ' ' : '') + q.q, vt: 'c-paso', i: 1}) : '') +
        R7().lista(NV().map(x => ({nombre: x.nombre, pasa: x.n === n || x.cerrado ? x.texto : null, dato: x.n === n ? 'Now' : null, clase: x.n === n ? 'r7c-aqui' : 'r7c-otro'})), {clase: 'r7c-pasos', i: 2});
    },
    botonFijo: p => {
      const b = pie(p, true); if (b) return b;
      if (!existe(p) || p.id === 'r-visitas' || C.nivel(p.id) >= 3 || VETA.yo().papel !== 'direccion') return '';
      return R7().botones({texto: 'One step up for everyone', hoja: 'h22', de: p.id});
    },
    acciones
  });
})();
