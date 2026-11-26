/* Veta demo · ronda 8 · pantallas · dictar.js · carril A · Dictar (el micro del centro de la barra)
   - A3  · #/dictar/libre              “¿Qué me cuentas?”: micro grande, “O elige qué es” (cinco filas por papel) y “o escríbelo”.
           #/dictar/<guion>            lo elegido: una visita, una tarea, algo de un cliente, una pregunta (un solo paso: se cuenta y se
                                       abre lo que sale), o enseñarle algo a Veta (“orden” o el id de una lección: cuatro pasos).
   - A3b · #/dictar/<guion>/entendido  2 · “Esto he entendido”: qué haré, cuándo, con quién y hasta dónde llego; cada fila se puede cambiar
   - A3c · #/dictar/<guion>/prueba     3 · “Pruébalo”: un caso de sus chats y lo que habría hecho
   - A3d · #/dictar/<guion>/hecho      4 · “Hecho. Ya lo sé hacer.” y un botón que lleva a verlo en Veta
   Guiones de un solo paso: acta, tarea, nota, pregunta (agente) y aviso, operacion, queja, mejorar (dirección). Cualquier otro cae en “libre”.
   El micro es de mentira: al tocarlo el texto va saliendo, con su cronómetro; se puede pausar y seguir. No se usa el dictado del navegador.
   Mientras se dicta, lo dicho se guarda en a.dictado (el “dictado a medias” que enseña Inicio si se sale sin terminar); al terminar o borrar, se quita.
   Caso de partida: el micro de la barra deja VETA.est('r7.caso') = {de, quien, titulo, texto} con lo que dice `casoDictado` de la pantalla abierta.
   Estado: r7e.curso (lo que se está enseñando) · r7e.aprendido (lo ya enseñado; lo lee VETA.r7e.aprendidos()) · a.ultimoDictado · a.dictado. */
(function () {
  'use strict';
  const esc = VETA.esc, ic = VETA.ic, r7 = VETA.r7, M = VETA.modelo;
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
    const pila = VETA.pila(), i = pila.findIndex(x => /^dictar\//.test(x.ruta)), ant = i > 0 ? pila[i - 1] : null;
    // 1.º el caso que deja guardado el micro de la barra (clave r7.caso: {de, quien, titulo, texto, tipo?}).
    // Vale solo viniendo de la pantalla que lo dejó: entrando desde Inicio, en frío o desde otra pantalla, se borra.
    const g = VETA.est.lee('r7.caso', null);
    if (g) {
      const desde = ant ? ant.ruta : '';
      if (!ant || desde === 'inicio' || (g._desde && g._desde !== desde)) VETA.est.quita('r7.caso');
      else {
        if (!g._desde) VETA.est.pon('r7.caso', Object.assign({}, g, {_desde: desde}));
        return {tipo: g.tipo || 'mensaje', cara: g.quien, nombre: g.titulo || '', pasa: g.texto || ''};
      }
    }
    if (!ant) return null;
    const [que, id] = ant.ruta.split('/');
    if (!id || !E().deCaso[que] && que !== 'cliente' && que !== 'regla') return null;
    if (que === 'mensaje') { const c = M.cosa(id); return c && c.titulo ? {tipo: que, cara: c.cliente, nombre: c.titulo, pasa: (c.cita || {}).texto || ant.titulo} : null; }
    if (que === 'regla') { const r = M.regla(id); return r ? {tipo: que, cara: 'veta', nombre: r.texto, pasa: 'A job I already do'} : null; }
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
  const primera = t => (String(t || '').match(/^[^.?!]+[.?!]/) || [String(t || '')])[0];   // el ejemplo: la primera frase de lo que se dictaría
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

  // ---- lo que se puede dictar, por papel: las cinco filas de “O elige qué es” ----
  const ELIGE = {
    agente: [['acta', 'A viewing'], ['tarea', 'A task'], ['nota', 'Something about a client'], ['pregunta', 'A question'], ['orden', 'Teach Veta something']],
    direccion: [['aviso', 'An alert'], ['operacion', 'A question about a deal'], ['queja', 'A complaint'], ['mejorar', 'What to improve'], ['orden', 'How the office works']]
  };
  const puntos = n => ({tipo: 'puntos', paso: n});
  // la pantalla desde la que se empezó: la de antes de la primera de Dictar (se puede venir de “¿Qué me cuentas?”); si los pasos ya no
  // están en el camino (se llegó a “Hecho”), la de antes de “Hecho”
  const antesDe = () => { const l = VETA.pila(), k = l.findIndex(x => /^dictar\//.test(x.ruta)); return (k >= 0 ? k : l.length - 1) - 1; };

  // ============ paso 1 · contarlo ============
  const SIN_RED = 'No signal: saved on your phone.';
  let v = null;       // {g, fase: 'quieto' | 'oye' | 'dicho' | 'escribe', texto, leccion, n (palabras dichas), pausa, t}
  let reloj = null;
  const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const ritmo = s => Math.max(120, Math.min(350, 4500 / Math.max(1, palabras(s.texto).length)));   // ms por palabra
  const seg = s => Math.floor((s.n || 0) * ritmo(s) / 1000);
  // el dictado a medias: se guarda al empezar y a cada palabra; se quita al terminar o al borrarlo
  const guardaMedias = s => VETA.est.pon('a.dictado', {guion: s.g, seg: seg(s), n: s.n || 0, texto: s.texto, leccion: s.leccion || null, escrito: s.fase === 'escribe'});
  const sinMedias = () => VETA.est.pon('a.dictado', null);
  const vivo = p => {
    if (!v || v.g !== p.guion || Date.now() - v.t > 90000) {
      const m = VETA.est.lee('a.dictado', null), mio = m && m.guion === p.guion && m.texto ? m : null;
      v = mio ? {g: p.guion, fase: mio.escrito ? 'escribe' : 'oye', pausa: true, texto: mio.texto, leccion: mio.leccion, n: mio.n || 0, t: Date.now()}
        : {g: p.guion, fase: 'quieto', texto: '', leccion: null, n: 0, pausa: false, t: Date.now()};
    }
    return v;
  };
  // ¿hay algo que guardar? dictando, la primera palabra ya dicha; escribiendo, texto que no sea solo espacios
  const hayTexto = s => (s.fase === 'oye' ? (s.n || 0) > 0 : s.fase === 'dicho' ? palabras(s.texto).length > 0 : s.fase === 'escribe' ? !!String(s.texto || '').trim() : false);
  const ponListo = ok => { const b = document.querySelector('[data-accion="listo"]'); if (b) b.disabled = !ok; };
  const halo = si => { if (VETA.vivo && VETA.vivo.halo) VETA.vivo.halo(si); };
  const ensena = p => !dictado(p);   // enseñar algo a Veta: cuatro pasos

  VETA.pantalla('A3', {
    titulo: p => (dictado(p) || {}).titulo || (p.guion === 'libre' ? 'What\'s on your mind?' : 'Teach Veta'),
    sub: p => { const d = dictado(p); return d ? d.frase : p.guion === 'libre' ? '' : P().frase; },
    cabDerecha: p => (ensena(p) && !(p.guion === 'libre' && vivo(p).fase === 'quieto') ? puntos(1) : null),
    // sin señal, lo dictado no se pierde: se dice solo entonces
    nota: () => (navigator.onLine === false ? SIN_RED : ''),
    pinta: p => {
      const s = vivo(p), d = dictado(p), c = d ? null : caso(p);
      const arriba = c ? r7.lista([{cara: c.cara, nombre: c.nombre, pasa: c.pasa}], {rotulo: 'About this', i: 0}) : '';
      if (s.fase === 'escribe') {
        return arriba + `<div class="campo" data-i="1"><label class="campo-e" for="e-texto">Write it as you would say it to a colleague</label>` +
          `<div class="campo-caja"><textarea id="e-texto" class="campo-i" rows="5" placeholder="${esc(d ? 'For example: ' + primera(d.dices) : P().escribe)}">${esc(s.texto)}</textarea></div></div>`;
      }
      if (s.fase === 'oye' || s.fase === 'dicho') {
        const w = palabras(s.texto), dicho = s.fase === 'dicho';
        // ya lo ha oído todo: el micro dice “Otra vez” y tocarlo es dictarlo otra vez (D19); lo dicho queda en su tarjeta
        // desde el primer instante se ve que escucha (punto rojo que late, “Te escucho” y el cronómetro) y cómo parar: la frase de debajo lo dice
        const dice = dicho ? '' : s.pausa ? 'Paused: I am not listening. Tap “Continue” to carry on.' : 'To stop, tap “Pause”; to type instead, “or write it”.';
        return arriba + r7.micro({i: 1, clase: dicho || s.pausa ? '' : 'e-oye', texto: dicho ? 'Again' : (s.pausa ? 'Paused · ' : 'I am listening · ') + mmss(seg(s)), accion: dicho ? 'repite' : 'pausar'}) +
          (dice ? r7.nota(dice) : '') +
          r7.tarjeta({i: 2, html: `<p role="status">“<span class="e-dicho-t">${esc((dicho ? w : w.slice(0, s.n)).join(' '))}</span>”</p>`}) +
          r7.enlace({i: 3, texto: 'or write it', accion: 'escribe', clase: 'e-escribe'});
      }
      const micro = r7.micro({i: 1, accion: 'habla', texto: d ? d.toca : ''});
      // sin señal y sin pie (aún no hay botón): la nota va aquí, bajo “o escríbelo”
      const escribe = r7.enlace({i: 3, texto: 'or write it', accion: 'escribe', clase: 'e-escribe'}) + (navigator.onLine === false ? r7.nota(SIN_RED) : '');
      if (d) return micro + r7.tarjeta({i: 2, de: 'For example', texto: '“' + primera(d.dices) + '”'}) + escribe;
      // las cuatro primeras filas empiezan a escuchar al tocarlas (el rótulo lo dice); enseñarle algo a Veta no escucha todavía: va aparte, como enlace
      if (p.guion === 'libre') { const el = ELIGE[papel()], orden = el.find(x => x[0] === 'orden');
        return arriba + micro + r7.lista(el.filter(x => x[0] !== 'orden').map(([g, t]) => ({nombre: t, accion: 'cuenta', datos: {g}})), {rotulo: 'Or pick what it is · I listen as you tap', i: 2}) +
          r7.enlace({i: 3, texto: orden[1], ir: 'dictar/orden', clase: 'e-escribe'}) + escribe; }
      return arriba + micro + r7.lista(ejemplos(p).map(id => ({nombre: E().lecciones[id].corto, pasa: '“' + E().lecciones[id].dices + '”', accion: 'habla', datos: {leccion: id}})), {rotulo: 'Or tap an example', i: 2}) + escribe;
    },
    // “Ya está” no crea nada si no hay nada: apagado mientras no haya una palabra dicha o escrita (se enciende solo con la primera)
    botonFijo: p => {
      const s = vivo(p), ya = {texto: 'That\'s it', accion: 'listo', deshabilitado: !hayTexto(s)};
      if (s.fase === 'oye') return r7.botones(ya, {texto: s.pausa ? 'Continue' : 'Pause', accion: 'pausar'});
      if (s.fase === 'dicho') return r7.botones(ya);   // “Otra vez” es el micro
      if (s.fase === 'escribe') return r7.botones(ya, {texto: 'I\'d rather say it', accion: 'otra'});
      return '';
    },
    alMontar: (el, p) => {
      const s = vivo(p);
      clearInterval(reloj);
      if (s.fase === 'escribe') {
        const t = el.querySelector('#e-texto');
        if (t) { t.addEventListener('input', () => { s.texto = t.value; s.t = Date.now(); if (t.value.trim()) guardaMedias(s); else sinMedias(); ponListo(hayTexto(s)); }); try { t.focus({preventScroll: true}); } catch (x) {} }
        return;
      }
      if (s.fase !== 'oye') return;
      // el micro de mentira: las palabras van saliendo como si se hablara, con su cronómetro; “Pausar” lo para y “Seguir” lo reanuda
      const sal = el.querySelector('.e-dicho-t'), mt = el.querySelector('.r7-micro-t'), w = palabras(s.texto);
      const fin = () => { halo(false); if (v !== s || s.fase !== 'oye') return; s.n = w.length; s.fase = 'dicho'; s.pausa = false; s.t = Date.now(); guardaMedias(s); if (el.isConnected) VETA.repinta(); };
      if (s.pausa) { halo(false); return; }
      if (!sal || VETA.reducido()) { fin(); return; }   // con “Reducir movimiento” no hay fase de escucha
      halo(true);
      reloj = setInterval(() => {
        // si se sale de la pantalla a medias, se queda en pausa: al volver (“Seguir”) está como se dejó
        if (!el.isConnected) s.pausa = true;
        if (!el.isConnected || v !== s || s.fase !== 'oye' || s.pausa) { clearInterval(reloj); halo(false); return; }
        s.n += 1; s.t = Date.now(); sal.textContent = w.slice(0, s.n).join(' '); ponListo(true);
        if (mt) mt.textContent = 'I am listening · ' + mmss(seg(s));
        guardaMedias(s);
        if (s.n >= w.length) { clearInterval(reloj); setTimeout(fin, 450); }
      }, ritmo(s));
    },
    acciones: {
      habla(ev, el, p) {
        const s = vivo(p), d = dictado(p), id = el.dataset.leccion || (d ? null : defecto(p));
        s.leccion = id; s.texto = d ? d.dices : E().lecciones[id].dices; s.fase = 'oye'; s.n = 0; s.pausa = false; s.t = Date.now();
        guardaMedias(s);
        VETA.repinta();
      },
      // elegir qué es ya es empezar: la fila abre su pantalla con el micro escuchando (se ahorra el toque de “Toca y dímelo”; “Ya está” sigue siendo de la persona)
      cuenta(ev, el) {
        const g = el.dataset.g, d = dictado({guion: g});
        if (d) { v = {g, fase: 'oye', texto: d.dices, leccion: null, n: 0, pausa: false, t: Date.now()}; guardaMedias(v); }
        VETA.ir('dictar/' + g);
      },
      pausar(ev, el, p) { const s = vivo(p); if (s.fase !== 'oye') return; s.pausa = !s.pausa; s.t = Date.now(); VETA.repinta(); },
      escribe(ev, el, p) { const s = vivo(p); s.fase = 'escribe'; s.texto = ''; s.leccion = null; s.n = 0; s.t = Date.now(); VETA.repinta(); },
      otra(ev, el, p) { const s = vivo(p); s.fase = 'quieto'; s.texto = ''; s.leccion = null; s.n = 0; s.pausa = false; sinMedias(); VETA.repinta(); },
      // “Otra vez” (el micro, cuando ya lo ha oído): se dicta otra vez lo mismo, desde el principio.
      // Con “Reducir movimiento” no hay fase de escucha: vuelve al principio, a la espera de un toque
      repite(ev, el, p) {
        const s = vivo(p); if (s.fase !== 'dicho') return;
        if (VETA.reducido() || !s.texto) { s.fase = 'quieto'; s.texto = ''; s.leccion = null; s.n = 0; s.pausa = false; sinMedias(); VETA.repinta(); return; }
        s.fase = 'oye'; s.n = 0; s.pausa = false; s.t = Date.now(); guardaMedias(s); VETA.repinta();
      },
      listo(ev, el, p) {
        const s = vivo(p), d = dictado(p), texto = String(s.texto || '').trim();
        if (!hayTexto(s)) {   // sin una palabra dicha o escrita no se crea nada (el botón ya va apagado; esto cubre el teclado y los toques a destiempo)
          if (s.fase === 'escribe') { const t = document.getElementById('e-texto'); if (t) t.focus(); }
          return;
        }
        if (!texto) { const t = document.getElementById('e-texto'); if (t) t.focus(); VETA.aviso(d ? 'First write what you wanted to say.' : 'First write what you want me to learn.'); return; }
        const dur = Math.max(2, Math.round(palabras(texto).length / 2.4));
        clearInterval(reloj); halo(false);
        const cs = caso(p);   // el cliente de quien se habla, si se viene de su ficha: lo necesita “Lo que he entendido” de dirección
        VETA.est.pon('a.ultimoDictado', {guion: d ? d.guion : 'orden', seg: dur, texto, hora: VETA.ahora(), cliente: cs && cs.tipo === 'cliente' ? cs.cara : null});
        sinMedias();
        v = null;
        if (d) {   // un solo paso: se abre lo que sale, sobre la pantalla desde la que se empezó (Dictar sale del camino)
          VETA.est.quita('r7.caso');
          const va = d.va || 'entendido-dictado/tarea';
          VETA.ir(va, /\//.test(va) || va === 'avisos' ? {sobre: antesDe()} : {});
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
  const FILAS = [['que', 'What I\'ll do'], ['cuando', 'When'], ['quien', 'With whom'], ['hasta', 'How far I go']];
  paso('A3b', 'entendido', 'What I understood', 'A3', {
    sub: 'Check it. You can change each part.',
    cabDerecha: () => puntos(2),
    pinta: p => {
      const c = curso(p), l = leccion(c);
      // lo que haré, en oro (no se cambia tocando: se dice de otra forma con “No es eso”); debajo, lo que sí se cambia, con “›”
      return r7.tarjeta({i: 0, de: 'What you said', texto: '“' + l.dices + '”'}) +
        r7.tarjeta({i: 1, veta: true, de: FILAS[0][1], texto: valor(l, c, 'que')}) +
        r7.lista(FILAS.slice(1).map(([campo, nombre]) => Object.assign({nombre, pasa: valor(l, c, campo)}, opciones(l, campo).length > 1 ? {hoja: 'e-cambia', datos: {campo, guion: p.guion}} : {})), {i: 2});
    },
    botonFijo: () => r7.botones({texto: 'Yes, that\'s it', accion: 'si'}, {texto: 'That\'s not it', accion: 'no'}),
    acciones: {
      si(ev, el, p) { ponCurso(curso(p)); VETA.ir('dictar/' + p.guion + '/prueba'); },
      no(ev, el, p) { v = null; VETA.ir('dictar/' + p.guion); }   // el paso 1 ya está en el camino: se vuelve a él para decirlo de otra forma
    }
  });

  // cambiar una de las cuatro cosas
  VETA.hojaDef('e-cambia', {
    titulo: d => (FILAS.find(f => f[0] === d.campo) || FILAS[0])[1],
    pinta: d => {
      const c = curso({guion: d.guion}), l = leccion(c), n = (c.sel || {})[d.campo] || 0, hasta = d.campo === 'hasta';
      return `<div class="ops" role="radiogroup">${opciones(l, d.campo).map((t, k) => `<button type="button" class="op op-elige" role="radio" aria-checked="${k === n}" data-accion="elige" data-n="${k}">` +
        `<span class="op-c"><span class="op-t">${esc(t)}</span>${hasta ? `<span class="op-s">${esc(HASTA()[k].sub)}</span>` : ''}</span><span class="op-marca">${ic('check', 20)}</span></button>`).join('')}</div>` +
        (hasta ? `<p class="hoja-x">${esc(E().hastaCerrado)}</p>` : '');
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
    sub: p => { const l = leccion(curso(p)); return l.casos.length ? `It has happened ${VETA.num ? VETA.num(l.veces) : l.veces} times in ${P().chats}.` : `It has not happened in ${P().chats} yet.`; },
    cabDerecha: () => puntos(3),
    pinta: p => {
      const c = curso(p), l = leccion(c), k = l.casos[(c.caso || 0) % (l.casos.length || 1)];
      if (!k) return r7.tarjeta({i: 0, veta: true, de: 'What I\'ll do', texto: E().tuya.sinCaso});
      return r7.tarjeta({i: 0, de: k.nombre + ' · ' + k.dia, texto: k.paso}) +
        r7.tarjeta({i: 1, veta: true, de: soloAviso(c) ? 'I would have told you about this' : dir() ? 'This is what I would have done' : 'What I\'d have written', texto: soloAviso(c) ? k.toca : k.hice}) +
        (l.casos.length > 1 ? r7.enlace({i: 2, texto: 'See another case', accion: 'otro'}) : '');
    },
    botonFijo: () => r7.botones({texto: 'Yes, do it this way from today', accion: 'si'}),
    acciones: {
      otro(ev, el, p) { const c = curso(p); c.caso = (c.caso || 0) + 1; ponCurso(c); VETA.repinta(); },
      // al llegar a “Hecho” los pasos salen del camino: atrás lleva a la pantalla desde la que se empezó, no a “Pruébalo”
      si(ev, el, p) { const c = curso(p); ponCurso(c); aprende(c); VETA.ir('dictar/' + p.guion + '/hecho', {sobre: antesDe()}); }
    }
  });

  // ============ paso 4 · “Hecho. Ya lo sé hacer.” ============
  const desdeCaso = () => { const k = antesDe(); return k > 0 ? k : -1; };                   // > 0: no es Inicio
  paso('A3d', 'hecho', 'Done. I know how to do it.', 'R0', {   // abierto en frío cuelga de Inicio, no de “Pruébalo”
    sub: p => (dir() ? 'I start today. Nothing goes out without a person.' : soloAviso(curso(p)) ? 'I start today. I tell you and you do it.' : 'I start today. ' + VETA.PROMESA.nada),
    cabDerecha: () => puntos(4),
    pinta: p => {
      const c = curso(p), l = leccion(c);
      return r7.tarjeta({i: 0, veta: true, de: 'From today', texto: dice(l, c)}) +
        r7.enlace(desdeCaso() > 0 ? {i: 1, texto: 'Go back to what I was doing', accion: 'sigue'} : {i: 1, texto: 'Teach Veta something else', accion: 'otra'});
    },
    botonFijo: () => r7.botones({texto: 'See it in Veta', ir: P().veta}),
    acciones: {
      sigue() { const k = desdeCaso(); VETA.est.quita('r7e.curso'); if (k > 0) VETA.atrasA(k); },
      otra() { v = null; VETA.est.quita('r7e.curso'); VETA.ir('dictar/orden', {reemplaza: true}); }   // “Hecho” no se queda detrás del paso 1
    }
  });
})();
