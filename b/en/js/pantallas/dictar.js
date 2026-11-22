/* Veta demo · pantallas · dictar.js · ronda 7 · agente E · “Enséñale a Veta”
   Cuatro pasos, uno por pantalla, a pantalla completa (ESTRATEGIA_R7.md, 6):
   - A3  · #/dictar/<guion>            1 · “Enséñale a Veta”: micro grande, tres ejemplos que se tocan y “o escríbelo”
   - A3b · #/dictar/<guion>/entendido  2 · “Esto he entendido”: qué haré, cuándo, con quién y hasta dónde llego; cada una con “Cambiar”
   - A3c · #/dictar/<guion>/prueba     3 · “Pruébalo”: un caso de sus chats y lo que habría hecho
   - A3d · #/dictar/<guion>/hecho      4 · “Hecho. Ya lo sé hacer.” y un botón que lleva a verlo en Veta
   Guiones: “libre” y “orden” enseñan (los cuatro pasos); el id de una lección (recordatorios, visitas, valoraciones, contactos,
   acta-dia, informe-piso) enseña con esa lección por delante; acta, tarea, nota, pregunta, aviso, operacion, queja y mejorar
   son de un solo paso (se cuenta y se abre lo que sale); cualquier otro cae en “libre”.
   El micro es de mentira: al tocarlo el texto va saliendo. No se usa el dictado del navegador.
   Caso de partida: quien incrusta el botón deja antes VETA.est.pon('r7.caso', {de, quien, titulo, texto}); si no, se saca de la pantalla de antes.
   Estado: r7e.curso (lo que se está enseñando) · r7e.aprendido (lo ya enseñado; lo lee VETA.r7e.aprendidos()) · a.ultimoDictado (como antes). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, ic = VETA.ic, r7 = VETA.r7, M = VETA.modelo;
  const E = () => VETA.datos.r7e;
  const dir = () => VETA.yo().papel === 'direccion';
  const papel = () => (dir() ? 'direccion' : 'agente');
  const P = () => E()[papel()];
  const palabras = t => String(t || '').trim().split(/\s+/).filter(Boolean);

  // ---- qué es cada guion ----
  const dictado = p => {
    const d = (VETA.datos.dictados || {})[p.guion], c = E().dictados[p.guion];
    return d && c && !(d.papel === 'direccion' && !dir()) ? Object.assign({guion: p.guion, va: d.va, dices: d.frase}, c) : null;
  };
  const esMia = id => { const l = E().lecciones[id]; return !!l && l.papel === papel(); };

  // ---- de dónde se viene: si es un caso (un mensaje, un acta, una visita…), el paso 1 lo enseña arriba ----
  function caso(p) {
    const pila = VETA.pila(), i = pila.findIndex(x => x.ruta === 'dictar/' + p.guion), ant = i > 0 ? pila[i - 1] : null;
    // 1.º el caso que deja guardado quien incrusta el “Enséñale a Veta” (clave r7.caso: {de, quien, titulo, texto, tipo?, icono?}).
    // Vale solo viniendo de la pantalla que lo dejó: entrando desde Inicio, en frío o desde otra pantalla, se borra.
    const g = VETA.est.lee('r7.caso', null);
    if (g) {
      const desde = ant ? ant.ruta : '';
      if (!ant || desde === 'inicio' || (g._desde && g._desde !== desde)) VETA.est.quita('r7.caso');
      else {
        if (!g._desde) VETA.est.pon('r7.caso', Object.assign({}, g, {_desde: desde}));
        return {tipo: g.tipo || 'mensaje', cara: g.quien, icono: g.icono, nombre: g.titulo || '', pasa: g.texto || ''};
      }
    }
    if (!ant) return null;
    const [que, id] = ant.ruta.split('/');
    if (!id || !E().deCaso[que] && que !== 'cliente' && que !== 'regla') return null;
    if (que === 'mensaje') { const c = M.cosa(id); return c && c.titulo ? {tipo: que, cara: c.cliente, nombre: c.titulo, pasa: (c.cita || {}).texto || ant.titulo} : null; }
    if (que === 'regla') { const r = M.regla(id); return r ? {tipo: que, icono: 'aprende', nombre: r.texto, pasa: 'A job I already do'} : null; }
    const cl = M.cliente(id); return cl ? {tipo: que, cara: id, nombre: cl.nombre, pasa: ant.titulo} : null;
  }
  // la lección que sale si se toca el micro sin elegir ejemplo
  const defecto = p => {
    if (esMia(p.guion)) return p.guion;
    const c = caso(p), d = c && E().deCaso[c.tipo];
    return d && esMia(d) ? d : P().ejemplos[0];
  };
  const ejemplos = p => { const d = defecto(p); return [d].concat(P().ejemplos.filter(x => x !== d)).slice(0, 3); };

  // ---- lo que se está enseñando (aguanta recargar en mitad) ----
  const curso = p => { const c = VETA.est.lee('r7e.curso', null); return c && c.g === p.guion && c.papel === papel() ? c : {g: p.guion, papel: papel(), leccion: defecto(p), sel: {}, caso: 0}; };
  const ponCurso = c => VETA.est.pon('r7e.curso', c);
  function leccion(c) {
    if (c.leccion === 'tuya') {
      const t = E().tuya[papel()], txt = String(c.texto || '').replace(/[.\s]+$/, '');
      return Object.assign({id: 'tuya', dices: c.texto, que: txt, casos: []}, t);
    }
    return Object.assign({id: c.leccion}, E().lecciones[c.leccion] || E().lecciones[P().ejemplos[0]]);
  }
  const HASTA = () => (dir() ? E().hastaOficina : E().hasta);
  const corta = t => { const w = palabras(t); return w.length > 16 ? w.slice(0, 14).join(' ') + '…' : t; };
  const opciones = (l, campo) => (campo === 'hasta' ? HASTA().map(h => h.texto) : (l.opc || {})[campo] || []);
  const valor = (l, c, campo) => {
    const n = (c.sel || {})[campo] || 0;
    if (campo === 'hasta') return (HASTA()[n] || HASTA()[0]).fila;
    return opciones(l, campo)[n] || l[campo];
  };
  const soloAviso = c => ((c.sel || {}).hasta || 0) === 1;
  // la frase de lo aprendido sale de lo elegido en el paso 2 (cuándo + qué + hasta dónde): así los cuatro pasos dicen lo mismo
  const dice = (l, c) => {
    const cu = valor(l, c, 'cuando'), q = valor(l, c, 'que');
    if (l.id === 'tuya') return `“${q}”. ${cu}, ${soloAviso(c) ? 'I tell you' : 'I write it for you'}.`;
    return soloAviso(c) ? `${cu}, ${dir() ? 'I tell whoever it is for' : 'I tell you when it is time'}.` : `${cu}, ${dir() ? 'I prepare' : 'I make you'} ${q.charAt(0).toLowerCase() + q.slice(1)}.`;
  };
  const adivina = t => { t = String(t || '').toLowerCase(); return Object.keys(E().lecciones).find(id => esMia(id) && E().lecciones[id].claves.some(k => t.includes(k))) || 'tuya'; };

  // ---- lo ya enseñado: lo leen Veta (agente) y Veta de la oficina (dirección) ----
  VETA.r7e = {
    aprendidos: quien => VETA.est.lee('r7e.aprendido', []).filter(x => x.papel === (quien || papel())),
    olvida: id => { VETA.est.pon('r7e.aprendido', VETA.est.lee('r7e.aprendido', []).filter(x => x.id !== id)); }
  };
  function aprende(c) {
    const l = leccion(c), id = l.id === 'tuya' ? 'tuya-' + papel() : l.id;
    const lista = VETA.est.lee('r7e.aprendido', []).filter(x => x.id !== id);
    lista.push({id, papel: papel(), regla: l.regla || null, texto: dice(l, c), que: valor(l, c, 'que'), cuando: valor(l, c, 'cuando'), quien: valor(l, c, 'quien'), hasta: soloAviso(c) ? 'aviso' : 'escrito', hora: VETA.ahora()});
    VETA.est.pon('r7e.aprendido', lista);
    VETA.est.quita('r7.caso');   // terminado: el caso de partida no vuelve a salir
    // lo que ya tiene sitio en Veta pasa a “lo estoy probando”, con las claves de siempre
    if (l.regla === 'r-visitas') { if (VETA.r6 && VETA.r6.reglaVisitas() === 'propuesta') VETA.r6.ponReglaVisitas('prueba'); }
    else if (l.regla) { const r = M.regla(l.regla); if (r && (r.estado === 'nueva' || r.estado === 'propuesta')) M.marca(l.regla, 'a-prueba'); }
    if (VETA.pintaBarra) VETA.pintaBarra();
  }

  // ---- piezas propias ----
  const puntos = n => `<span class="e-pasos" role="img" aria-label="Step ${n} of 4">${[1, 2, 3, 4].map(k => `<i${k === n ? ' class="on"' : k < n ? ' class="ya"' : ''}></i>`).join('')}</span>`;
  const cabeza = x => (x.cara ? VETA.av(x.cara, 40, {nombre: x.nombre}) : `<span class="r7-fila-ic">${ic(x.icono || 'punto', 20)}</span>`);

  // ============ paso 1 · contarlo ============
  let v = null;   // {g, fase: 'quieto' | 'oye' | 'dicho' | 'escribe', texto, leccion, t}
  const vivo = p => { if (!v || v.g !== p.guion || Date.now() - v.t > 90000) v = {g: p.guion, fase: 'quieto', texto: '', leccion: null, t: Date.now()}; return v; };
  const halo = si => { if (VETA.vivo && VETA.vivo.halo) VETA.vivo.halo(si); };

  VETA.pantalla('A3', {
    titulo: p => (dictado(p) || {}).titulo || 'Teach Veta',
    frase: p => (dictado(p) || {}).frase || P().frase,
    cabDerecha: p => (dictado(p) ? '' : puntos(1)),
    pinta: p => {
      const s = vivo(p), d = dictado(p), c = caso(p);
      const arriba = c ? `<div class="e-caso" data-i="0"><span class="e-caso-t">About this</span>${r7.fila({cara: c.cara, icono: c.icono, nombre: c.nombre, pasa: c.pasa})}</div>`
        : d && ((VETA.datos.diaA || {}).contexto || {})[p.guion] ? `<p class="e-ctx" data-i="0">${esc(VETA.datos.diaA.contexto[p.guion])}</p>` : '';
      if (s.fase === 'escribe') {
        return arriba + `<div class="e-campo" data-i="1"><label for="e-texto">Write it as you would say it to a colleague</label>` +
          `<textarea id="e-texto" rows="5" placeholder="${esc(d ? 'For example: ' + corta(d.dices) : P().escribe)}">${esc(s.texto)}</textarea></div>`;
      }
      if (s.fase === 'oye' || s.fase === 'dicho') {
        return arriba + `<div class="e-voz e-voz-${s.fase}" data-i="1"><span class="e-mic" aria-hidden="true">${ic('mic', 32)}</span>` +
          `<span class="e-mic-t" role="status">${s.fase === 'oye' ? 'I am listening…' : 'This is what you said'}</span></div>` +
          `<p class="e-dicho" data-i="2">“<span class="e-dicho-t">${s.fase === 'dicho' ? esc(s.texto) : ''}</span>”</p>`;
      }
      const ejs = d ? [{t: corta(d.dices)}] : ejemplos(p).map(id => ({t: E().lecciones[id].dices, id}));
      return arriba + `<div class="e-voz" data-i="1"><button type="button" class="e-mic" data-accion="habla" aria-label="${esc(d ? d.toca : 'Tap and tell me')}">${ic('mic', 40)}</button>` +
        `<span class="e-mic-t">${esc(d ? d.toca : 'Tap and tell me')}</span></div>` +
        `<div class="e-ejs" data-i="2"><span class="e-ejs-t">${ejs.length > 1 ? 'Or tap an example' : 'For example'}</span>` +
        ejs.map(x => `<button type="button" class="e-ej" data-accion="habla"${x.id ? ` data-leccion="${esc(x.id)}"` : ''}>“${esc(x.t)}”</button>`).join('') + '</div>' +
        `<button type="button" class="e-link" data-accion="escribe" data-i="3">or write it</button>`;
    },
    botonFijo: p => {
      const s = vivo(p);
      if (s.fase === 'dicho') return r7.botones({texto: 'That\'s it', accion: 'listo'}, [{texto: 'Say it again', accion: 'otra'}]);
      if (s.fase === 'escribe') return r7.botones({texto: 'That\'s it', accion: 'listo'}, [{texto: 'I\'d rather say it', accion: 'otra'}]);
      return '';
    },
    alMontar: (el, p) => {
      const s = vivo(p);
      if (s.fase === 'escribe') {
        const t = el.querySelector('#e-texto');
        if (t) { t.addEventListener('input', () => { s.texto = t.value; s.t = Date.now(); }); try { t.focus({preventScroll: true}); } catch (x) {} }
        return;
      }
      if (s.fase !== 'oye') return;
      // el micro de mentira: las palabras van saliendo como si se hablara (2,6 s como mucho)
      const sal = el.querySelector('.e-dicho-t'), w = palabras(s.texto);
      const fin = () => { halo(false); if (v !== s || s.fase !== 'oye') return; s.fase = 'dicho'; s.t = Date.now(); if (el.isConnected) VETA.repinta(); };
      if (!sal || VETA.reducido()) { fin(); return; }
      halo(true);
      let n = 0; const paso = Math.max(30, Math.min(110, 2600 / w.length));
      const t = setInterval(() => {
        if (!el.isConnected || v !== s || s.fase !== 'oye') { clearInterval(t); halo(false); return; }
        n += 1; sal.textContent = w.slice(0, n).join(' ');
        if (n >= w.length) { clearInterval(t); setTimeout(fin, 450); }
      }, paso);
    },
    acciones: {
      habla(ev, el, p) {
        const s = vivo(p), d = dictado(p), id = el.dataset.leccion || (d ? null : defecto(p));
        s.leccion = id; s.texto = d ? d.dices : E().lecciones[id].dices; s.fase = 'oye'; s.t = Date.now();
        VETA.repinta();
      },
      escribe(ev, el, p) { const s = vivo(p); s.fase = 'escribe'; s.texto = ''; s.leccion = null; s.t = Date.now(); VETA.repinta(); },
      otra(ev, el, p) { const s = vivo(p); s.fase = 'quieto'; s.texto = ''; s.leccion = null; VETA.repinta(); },
      listo(ev, el, p) {
        const s = vivo(p), d = dictado(p), texto = String(s.texto || '').trim();
        if (!texto) { const t = document.getElementById('e-texto'); if (t) t.focus(); VETA.aviso(d ? 'First write what you wanted to say.' : 'First write what you want me to learn.'); return; }
        const seg = Math.max(2, Math.round(palabras(texto).length / 2.4));
        VETA.est.pon('a.ultimoDictado', {guion: d ? d.guion : 'orden', seg, texto, hora: VETA.ahora()});
        VETA.est.pon('a.dictado', null);
        v = null;
        if (d) {   // un solo paso: se abre lo que sale
          VETA.est.quita('r7.caso');
          VETA.ir(d.va || 'entendido-dictado/tarea', {reemplaza: true});
          if (d.guion === 'queja') setTimeout(() => VETA.hoja('h39', {de: 'joan-serra'}), VETA.reducido() ? 50 : 450);
          return;
        }
        ponCurso({g: p.guion, papel: papel(), leccion: s.leccion || adivina(texto), texto, sel: {}, caso: 0});
        VETA.ir('dictar/' + p.guion + '/entendido');
      }
    }
  });

  // los pasos 2, 3 y 4 cuelgan del 1: mismo guion, una pantalla cada uno (el mapa no los traía: se añaden aquí)
  const paso = (cod, cola, titulo, padre, def) => {
    VETA.MAPA[cod] = {cod, ruta: 'dictar/:guion/' + cola, titulo, destino: null, paq: 'A', archivo: 'dictar.js', padre, ejemplo: 'dictar/libre/' + cola, completa: true, grupo: 'The day'};
    VETA.pantalla(cod, def);
  };

  // ============ paso 2 · “Esto he entendido” ============
  const FILAS = [['que', 'What I will do', 'doc'], ['cuando', 'When', 'reloj'], ['quien', 'With whom', 'clientes'], ['hasta', 'How far I go', 'check']];
  paso('A3b', 'entendido', 'This is what I understood', 'A3', {
    frase: 'See if this is right. You can change each thing.',
    cabDerecha: () => puntos(2),
    pinta: p => {
      const c = curso(p), l = leccion(c);
      return `<p class="e-dijiste" data-i="0">“${esc(l.dices)}”</p>` +
        `<div class="e-filas" data-i="1">${FILAS.map(([campo, nombre, icono]) => {
          const cambia = opciones(l, campo).length > 1 ? {hoja: 'e-cambia', datos: {campo, guion: p.guion}} : {accion: 'no'};
          return `<button type="button" class="e-fila"${UI.attrs(cambia)}><span class="r7-fila-ic r7-oro">${ic(icono, 20)}</span>` +
            `<span class="e-fila-c"><span class="e-fila-e">${esc(nombre)}</span><span class="e-fila-v">${esc(valor(l, c, campo))}</span></span><span class="e-fila-x">Change</span></button>`;
        }).join('')}</div>`;
    },
    botonFijo: () => r7.botones({texto: 'Yes, that\'s it', accion: 'si'}, [{texto: 'That\'s not it', accion: 'no'}]),
    acciones: {
      si(ev, el, p) { ponCurso(curso(p)); VETA.ir('dictar/' + p.guion + '/prueba'); },
      no(ev, el, p) { v = null; VETA.ir('dictar/' + p.guion); }   // el paso 1 ya está en el camino: se vuelve a él para decirlo de otra forma
    }
  });

  // “Cambiar” una de las cuatro cosas
  VETA.hojaDef('e-cambia', {
    titulo: d => (FILAS.find(f => f[0] === d.campo) || FILAS[0])[1],
    pinta: d => {
      const c = curso({guion: d.guion}), l = leccion(c), n = (c.sel || {})[d.campo] || 0, hasta = d.campo === 'hasta';
      return `<div class="ops" role="radiogroup">${opciones(l, d.campo).map((t, k) => `<button type="button" class="op op-elige" role="radio" aria-checked="${k === n}" data-accion="elige" data-n="${k}">` +
        `<span class="op-c"><span class="op-t">${esc(t)}</span>${hasta ? `<span class="op-s">${esc(HASTA()[k].sub)}</span>` : ''}</span><span class="op-marca">${ic('check', 20)}</span></button>`).join('')}</div>` +
        (hasta ? `<p class="e-cerrado">${esc(E().hastaCerrado)}</p>` : '');
    },
    acciones: {
      elige(ev, el, d) {
        const c = curso({guion: d.guion}); c.sel = Object.assign({}, c.sel, {[d.campo]: Number(el.dataset.n)}); ponCurso(c);
        VETA.cierraHoja({foco: false}); VETA.repinta();
      }
    }
  });

  // ============ paso 3 · “Pruébalo” ============
  paso('A3c', 'prueba', 'Try it', 'A3b', {
    frase: p => (leccion(curso(p)).casos.length ? `This happened in ${P().chats}. See what I would have done.` : `It has not happened in ${P().chats} yet.`),
    cabDerecha: () => puntos(3),
    pinta: p => {
      const c = curso(p), l = leccion(c), k = l.casos[(c.caso || 0) % (l.casos.length || 1)];
      if (!k) return `<div class="r7-ficha r7-oro" data-i="0"><span class="r7-ficha-de">What I will do</span><p>${esc(E().tuya.sinCaso)}</p></div>`;
      return `<div class="r7-ficha e-paso" data-i="0"><span class="e-quien">${cabeza(k)}<span class="e-quien-c"><b>${esc(k.nombre)}</b><span>${esc(k.dia)}</span></span></span><p>${esc(k.paso)}</p></div>` +
        `<div class="r7-ficha r7-oro" data-i="1"><span class="r7-ficha-de">${soloAviso(c) ? 'I would have told you about this' : dir() ? 'This is what I would have done' : 'I would have written this for you'}</span><p>${esc(soloAviso(c) ? k.toca : k.hice)}</p></div>` +
        `<p class="e-veces" data-i="2">It has happened ${VETA.num ? VETA.num(l.veces) : l.veces} times in ${esc(P().chats)}.</p>`;
    },
    botonFijo: p => r7.botones({texto: 'Yes, do it this way', accion: 'si'}, leccion(curso(p)).casos.length > 1 ? [{texto: 'See another case', accion: 'otro'}] : []),
    acciones: {
      otro(ev, el, p) { const c = curso(p); c.caso = (c.caso || 0) + 1; ponCurso(c); VETA.repinta(); },
      // FN · al llegar a “Hecho” los pasos salen del camino: atrás lleva a la pantalla desde la que se empezó, no a “Pruébalo”
      si(ev, el, p) { const c = curso(p); ponCurso(c); aprende(c); VETA.ir('dictar/' + p.guion + '/hecho', {sobre: antesDe(p)}); }
    }
  });

  // ============ paso 4 · “Hecho. Ya lo sé hacer.” ============
  // la pantalla desde la que se empezó: la de antes del paso 1; si los pasos ya no están en el camino (se llegó a “Hecho”), la de antes de “Hecho”
  const antesDe = p => { const l = VETA.pila(), k = l.findIndex(x => x.ruta === 'dictar/' + p.guion); return (k >= 0 ? k : l.length - 1) - 1; };
  const desdeCaso = p => { const k = antesDe(p); return k > 0 ? k : -1; };                   // > 0: no es Inicio
  paso('A3d', 'hecho', 'Done. Now I know how to do it.', 'R0', {   // FN · abierto en frío cuelga de Inicio, no de “Pruébalo”
    frase: p => (dir() ? 'I start today. Nothing goes out without a person.' : soloAviso(curso(p)) ? 'I start today. I tell you and you do it.' : 'I start today. Nothing goes out without you.'),
    cabDerecha: () => puntos(4),
    pinta: p => {
      const c = curso(p), l = leccion(c);
      return `<div class="e-hecho" data-i="0"><span class="e-hecho-ic">${ic('check', 40)}</span></div>` +
        `<div class="r7-ficha r7-oro" data-i="1"><span class="r7-ficha-de">From today</span><p>${esc(dice(l, c))}</p></div>`;
    },
    botonFijo: p => r7.botones({texto: 'See it in Veta', ir: P().veta},
      [desdeCaso(p) > 0 ? {texto: 'Go back to what I was doing', accion: 'sigue'} : {texto: 'Teach Veta something else', accion: 'otra'}]),
    acciones: {
      sigue(ev, el, p) { const k = desdeCaso(p); VETA.est.quita('r7e.curso'); if (k > 0) VETA.atrasA(k); },
      otra(ev, el, p) { v = null; VETA.est.quita('r7e.curso'); VETA.ir('dictar/' + p.guion, {reemplaza: true}); }   // FN · “Hecho” no se queda detrás del paso 1
    }
  });
})();
