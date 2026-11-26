/* Veta demo · núcleo · movimiento.js
   Los efectos de la sección 5.4 que necesitan código. Lo demás vive en css/movimiento.css.
   - VETA.mov.transiciona(cambio, dir, foco): cambio de pantalla con la API View Transitions (efectos 2, 3, 4, 7, 16).
     dir = 'adelante' | 'atras' | 'pestana' | 'cambia'. Sin la API, o con movimiento reducido, cambia sin ella y la
     pantalla nueva entra con una animación CSS (o un fundido de 100 ms).
   - VETA.mov.cascada(raiz): bloques con data-i (o los hijos directos de .pant-cuerpo) suben uno tras otro (efecto 5).
   - VETA.rueda(el, 156): cifra que rueda (efecto 9).
   - Sombra ligada al desplazamiento (efecto 10): en CSS con animation-timeline; aquí, la clase de reserva. */
(function () {
  'use strict';
  const raiz = document.documentElement;
  const hayVT = () => typeof document.startViewTransition === 'function';
  let vtActual = null;
  // FN · mientras dura una transición, Chromium se cae (el proceso de la página muere) si se cambian por fuera de su `cambio` los
  // elementos que la transición lleva con nombre (las pestañas de la barra, `view-transition-name: tab-…`). Quien quiera repintarlos
  // pregunta `ocupada()` y, si lo está, lo deja para `alAcabar(clave, fn)`: se hace una sola vez, al terminar la transición.
  let enCambio = false;
  const pendientes = new Map();
  const ocupada = () => !!vtActual && !enCambio;
  const alAcabar = (clave, fn) => { if (ocupada()) pendientes.set(clave, fn); else fn(); };
  const sueltaPendientes = () => { const l = [...pendientes.values()]; pendientes.clear(); l.forEach(fn => { try { fn(); } catch (e) { setTimeout(() => { throw e; }); } }); };

  // nombra con view-transition-name los elementos con un atributo (el primero de cada valor; un nombre repetido aborta la transición)
  function nombra(contenedor, attr, prefijo) {
    const hechos = [], vistos = new Set();
    if (!contenedor) return hechos;
    VETA.$$('[' + attr + ']', contenedor).forEach(el => {
      const k = prefijo + String(el.getAttribute(attr)).replace(/[^A-Za-z0-9_-]/g, '_');
      if (vistos.has(k)) return; vistos.add(k);
      el.style.viewTransitionName = k; if (prefijo === 'vt-') el.style.viewTransitionClass = el.hasAttribute('data-muda') ? 'muda' : 'sitio'; hechos.push(el);   // data-muda: viaja sin fundido (la fila que se muda de bloque)
    });
    return hechos;
  }
  const limpia = els => els.forEach(el => { el.style.viewTransitionName = ''; el.style.viewTransitionClass = ''; });

  // entrada de reserva, en CSS, cuando no hay View Transitions
  function entraSinVT(el, dir) {
    if (!el) return;
    const cls = VETA.reducido() ? 'entra-funde' : (dir === 'atras' ? 'entra-atras' : dir === 'pestana' ? 'entra-pestana' : dir === 'adelante' ? 'entra-adelante' : '');
    if (!cls) return;
    el.classList.remove('entra-funde', 'entra-atras', 'entra-pestana', 'entra-adelante');
    void el.offsetWidth; el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 500);
  }

  // cambio: función que pinta lo nuevo y devuelve el elemento donde buscar el destino del elemento compartido
  function transiciona(cambio, dir, foco) {
    if (!hayVT() || VETA.reducido() || document.hidden) {
      const el = cambio(); entraSinVT(el && el.nodeType ? el : null, dir); return Promise.resolve();
    }
    if (vtActual) { try { vtActual.skipTransition(); } catch (e) {} }
    raiz.dataset.dir = dir;
    // elemento compartido: lo marcado con data-foco dentro de lo tocado viaja a su sitio en la pantalla nueva
    let viejos = [], nuevos = [];
    const claves = [];
    if (foco && foco.nodeType === 1 && dir === 'adelante') {
      const lista = foco.matches('[data-foco]') ? [foco] : [];
      // la tarjeta se abre desde su sitio: si lo tocado está dentro de una tarjeta con data-foco="tarjeta", viaja la tarjeta entera
      const tj = foco.closest('[data-foco="tarjeta"]'); if (tj && tj !== foco) lista.push(tj);
      lista.push(...VETA.$$('[data-foco]', foco));
      lista.forEach(el => {
        const v = el.dataset.foco; if (claves.includes(v)) return; claves.push(v);
        el.style.viewTransitionName = 'foco-' + v; viejos.push(el);
      });
    }
    if (dir === 'cambia') viejos = viejos.concat(nombra(document.body, 'data-vt', 'vt-'));
    let t;
    const cb = () => {
      limpia(viejos);
      let el = null;
      enCambio = true;
      try { el = cambio(); } catch (e) { setTimeout(() => { throw e; }); } finally { enCambio = false; }
      const donde = el && el.nodeType ? el : document;
      claves.forEach(v => {
        const n = VETA.$('[data-foco="' + v + '"]', donde);
        if (n) { n.style.viewTransitionName = 'foco-' + v; nuevos.push(n); }
      });
      if (dir === 'cambia') nuevos = nuevos.concat(nombra(document.body, 'data-vt', 'vt-'));
    };
    try { t = document.startViewTransition(cb); } catch (e) { cb(); delete raiz.dataset.dir; return Promise.resolve(); }
    vtActual = t;
    const fin = () => { if (vtActual === t) { vtActual = null; delete raiz.dataset.dir; } limpia(nuevos); if (!vtActual) sueltaPendientes(); };
    t.ready.catch(() => {}); t.updateCallbackDone.catch(() => {});
    return t.finished.then(fin, fin);
  }

  // cascada al entrar: hasta cinco escalones de 40 ms
  function cascada(el) {
    if (!el || VETA.reducido()) return;
    let bloques = VETA.$$('[data-i]', el);
    if (!bloques.length) bloques = VETA.$$('.pant-cuerpo > *', el);
    bloques.forEach((b, n) => {
      const i = b.hasAttribute('data-i') ? Number(b.getAttribute('data-i')) || 0 : n;
      b.style.setProperty('--i', Math.min(i, 4));
      b.classList.add('tac-b');
    });
    el.classList.remove('tac'); void el.offsetWidth; el.classList.add('tac');
    clearTimeout(el._tac); el._tac = setTimeout(() => el.classList.remove('tac'), 700);
  }

  // escalonado (ronda 8, 6.6): las seis primeras filas de una raíz entran una tras otra, a 30 ms. Solo al entrar en una raíz o en Inicio
  // (lo llama rutas.js); nunca en una hoja ni al repintar. Con «Reducir movimiento», nada.
  function escalona(el) {
    if (!el || VETA.reducido()) return;
    VETA.$$('.r7-primero, .r7-lista > .r7-fila, .r7-lista > .r7-fila-d, .r7-lista > .interr', el).slice(0, 6).forEach((f, n) => { f.style.setProperty('--f', n); f.classList.add('r7-esc'); });
    el.classList.remove('esc'); void el.offsetWidth; el.classList.add('esc');
    clearTimeout(el._esc); el._esc = setTimeout(() => el.classList.remove('esc'), 900);
  }

  // la fila resuelta se va (ronda 8, 6.1 y 6.6): opacidad y alto a cero en 200 ms y las de debajo suben; al acabar se llama a `despues`,
  // que es quien cambia el modelo y repinta. VETA.mov.seVa(el, () => { M.resuelve(id); VETA.repinta(); })
  // `el`: la fila, la tarjeta de «lo primero» o cualquier bloque (o un selector dentro de la columna activa). Si era la única fila de su
  // lista, se va la lista entera (y su rótulo). Con «Reducir movimiento», o si no hay elemento, llama a `despues` sin más.
  function seVa(el, despues) {
    const fin = () => { if (typeof despues === 'function') despues(); };
    if (typeof el === 'string') el = VETA.$(el, VETA.$('.col.activa') || document);
    if (!el || !el.isConnected || VETA.reducido() || typeof el.animate !== 'function') { fin(); return Promise.resolve(); }
    while (el.parentNode && el.parentNode.matches && ((el.parentNode.matches('.r7-lista') && el.parentNode.children.length === 1) || el.parentNode.matches('.r7-grupo'))) el = el.parentNode;
    const cs = getComputedStyle(el), h = el.offsetHeight, sep = el.parentNode ? parseFloat(getComputedStyle(el.parentNode).rowGap) || 0 : 0;
    el.style.overflow = 'hidden'; el.style.pointerEvents = 'none';
    const a = el.animate([
      {height: h + 'px', minHeight: h + 'px', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom, opacity: 1},
      {opacity: 0, offset: .6},
      {height: '0px', minHeight: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: -sep + 'px', opacity: 0}
    ], {duration: 200, easing: 'ease-out', fill: 'forwards'});
    return a.finished.then(fin, fin);
  }

  // cifra que rueda: columnas de dígitos que se desplazan; cifras tabulares para que no bailen
  VETA.rueda = (el, n, o) => {
    if (!el) return;
    const txt = (o && o.formato) ? o.formato(n) : (typeof n === 'number' ? VETA.num(n) : String(n));
    const antes = el.dataset.rueda;
    el.dataset.rueda = txt;
    if (antes == null || antes === txt || VETA.reducido()) { el.textContent = txt; return; }
    const a = antes.padStart(txt.length, ' ');
    el.innerHTML = '<span class="solo-lector">' + VETA.esc(txt) + '</span>' + txt.split('').map((c, i) => {
      if (!/\d/.test(c)) return '<span aria-hidden="true">' + VETA.esc(c) + '</span>';
      const d0 = /\d/.test(a[i]) ? Number(a[i]) : 0;
      const tira = '0123456789'.split('').map(d => '<span>' + d + '</span>').join('');
      return '<span class="rueda-col" aria-hidden="true"><span class="rueda-tira" data-a="' + c + '" style="transform:translateY(-' + d0 * 10 + '%)">' + tira + '</span></span>';
    }).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      VETA.$$('.rueda-tira', el).forEach(t => { t.style.transform = 'translateY(-' + Number(t.dataset.a) * 10 + '%)'; });
    }));
    clearTimeout(el._rueda); el._rueda = setTimeout(() => { if (el.dataset.rueda === txt) el.textContent = txt; }, 480);
  };

  // sombra al desplazar: clase de reserva (el CSS la usa solo si no hay animation-timeline)
  function vigilaDesplazamiento(scroller, marca) {
    if (!scroller || scroller._vigila) return;
    scroller._vigila = true;
    const mira = () => marca.classList.toggle('desplazado', scroller.scrollTop > 8);
    scroller.addEventListener('scroll', mira, {passive: true}); mira();
  }

  // ---- tanda S · deslizar entre los sitios de la barra y volver con el dedo ----
  // En un sitio (Inicio y las raíces de la barra, en su orden; el micro es una acción y no cuenta): izquierda = el siguiente, derecha = el anterior.
  // En un detalle con flecha de volver: derecha = volver. La pantalla sigue al dedo y asoma la vecina; al soltar pasado el 28 % del ancho (o
  // con un gesto rápido) la vecina entra; si no, vuelve. Tocar la barra hace la misma transición lateral. No es nuestro (y no se llama a
  // preventDefault): lo vertical (ángulo en los primeros 10 px), lo que ya se desplaza en horizontal, una hoja abierta, un campo de texto,
  // los 24 px de cada borde (gesto del navegador). Con «Reducir movimiento» cambia de sitio sin animar. Estado, historial y hash: los mismos
  // que al tocar la barra (VETA.gestos.va / atras, que pasan por VETA.ir / VETA.atras).
  const CAMPO = 'input,textarea,select,[contenteditable]:not([contenteditable=false])';
  const UMBRAL = 0.28, BORDE = 24, MS = 220, CURVA = 'cubic-bezier(.2,.8,.2,1)';
  let g = null;
  const ancho = () => window.innerWidth || document.documentElement.clientWidth;
  const marco = () => document.getElementById('marco');
  const hayHoja = () => !!(VETA.hojaActual && VETA.hojaActual());
  // el contenedor con desplazamiento horizontal real más cercano al toque (hasta la columna), o null
  function desplazaLado(el, tope) {
    for (; el && el !== tope && el.nodeType === 1; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 1) { const o = getComputedStyle(el).overflowX; if (o === 'auto' || o === 'scroll') return el; }
    }
    return null;
  }
  function copiaDe(col) {   // lo que se ve ahora, congelado, para que se vaya mientras entra lo nuevo
    const ov = col.cloneNode(true);
    ov.classList.remove('activa'); ov.classList.add('col-vieja');
    delete ov.dataset.ruta; delete ov.dataset.pant;
    ov.setAttribute('aria-hidden', 'true'); ov.inert = true; ov.style.transform = ''; ov.style.willChange = ''; ov.style.zIndex = '';
    ov.style.viewTransitionName = 'none';
    ov.querySelectorAll('[style*="view-transition"]').forEach(x => { x.style.viewTransitionName = ''; x.style.viewTransitionClass = ''; });
    ov.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    ov.querySelectorAll('[data-foco],[data-vt]').forEach(x => { x.removeAttribute('data-foco'); x.removeAttribute('data-vt'); });
    return ov;
  }
  const sueltaMarco = () => { const m = marco(); if (m && !m.querySelector('.col-vieja,.col-peek')) m.classList.remove('desliza'); };
  // la vieja sale hacia `signo` desde `dx`; la nueva entra desde el otro lado (o, al volver, desde un poco atrás de la vieja)
  function animaCambio(col, vieja, dx, signo, atras) {
    const w = ancho();
    let n = 0; const fin = () => { if (++n < 2) return; vieja.remove(); sueltaMarco(); };
    const a = vieja.animate([{transform: 'translateX(' + dx + 'px)'}, {transform: 'translateX(' + signo * w + 'px)'}], {duration: MS, easing: CURVA, fill: 'forwards'});
    const desde = atras ? (-0.3 * w + dx * 0.3) : (-signo * w + dx);
    const b = col.animate([{transform: 'translateX(' + desde + 'px)', willChange: 'transform'}, {transform: 'translateX(0)'}], {duration: MS, easing: CURVA});
    a.finished.then(fin, fin); b.finished.then(fin, fin);
  }
  // cambia de sitio (o vuelve) con la copia vieja encima. accion(alPintado) navega sin transición
  function cambiaCon(col, dx, signo, atras, accion) {
    const m = marco(), G = VETA.gestos;
    if (!m || !G || typeof col.animate !== 'function') { accion(null); return; }
    m.querySelectorAll('.col-vieja').forEach(v => v.remove());   // una sola copia vieja a la vez (tocar la barra durante otra animación)
    const vieja = copiaDe(col);
    const sd = col.querySelector('.desplaza'), vd = vieja.querySelector('.desplaza');
    m.classList.add('desliza'); m.appendChild(vieja); if (sd && vd) vd.scrollTop = sd.scrollTop;
    let hecho = false;
    const entra = () => { if (hecho) return; hecho = true; clearTimeout(t); const c = VETA.$('#marco .col.activa') || col; animaCambio(c, vieja, dx, signo, atras); };
    const t = setTimeout(() => { G.suelta(); entra(); }, 900);
    accion(entra);
  }
  function quita(g0) {
    if (!g0) return;
    document.removeEventListener('touchmove', alMover);
    if (g0.peek) g0.peek.remove();
    if (g0.col) { g0.col.style.transform = ''; g0.col.style.willChange = ''; g0.col.style.zIndex = ''; g0.col.style.touchAction = ''; }
    sueltaMarco();
  }
  // la animación de «vuelve a su sitio» en curso (si la hay): un gesto nuevo la corta y la limpia antes de empezar
  let vuelta = null;
  function limpiaVuelta() { const v = vuelta; vuelta = null; if (!v) return; try { v.a.cancel(); } catch (e) {} quita(v.g0); }
  // LA ÚNICA salida limpia: más de un dedo, touchcancel, ángulo que no es nuestro, soltar sin llegar… todo pasa por aquí.
  // Deja pantalla, peek, estilos y escucha como si el gesto no hubiera existido, sin cambiar de sitio.
  function cancela() {
    const g0 = g; g = null;
    document.removeEventListener('touchmove', alMover);
    limpiaVuelta();
    if (g0) quita(g0);
  }
  function alEmpezar(ev) {
    if (ev.touches && ev.touches.length > 1) { cancela(); return; }   // un segundo dedo: el gesto se cancela entero
    cancela();
    const G = VETA.gestos; if (!G || !ev.touches || ev.touches.length !== 1) return;
    if (VETA.ordenador && VETA.ordenador()) return;
    const t = ev.touches[0], w = ancho();
    if (t.clientX < BORDE || t.clientX > w - BORDE) return;   // el gesto del borde del navegador es suyo
    if (hayHoja()) return;
    const col = VETA.$('#marco .col.activa'), el = ev.target;
    if (!col || !el || !col.contains || !col.contains(el) || (el.closest && el.closest('[inert]'))) return;
    if (el.closest && el.closest(CAMPO)) return;
    const lado = desplazaLado(el, col);   // relevo en el borde: es del contenedor mientras pueda moverse hacia donde se arrastra (se decide al empezar el gesto)
    const info = G.info(); if (!info) return;
    g = {x0: t.clientX, y0: t.clientY, lado: lado ? {sl: lado.scrollLeft, max: lado.scrollWidth - lado.clientWidth} : null, m: [[Date.now(), t.clientX]], vx: 0, col, info, estado: 'espera', signo: 0, objetivo: null, peek: null, dx: 0};
    document.addEventListener('touchmove', alMover, {passive: false});
  }
  function alMover(ev) {
    if (!g || !ev.touches || ev.touches.length !== 1) { cancela(); return; }
    const t = ev.touches[0], dx0 = t.clientX - g.x0, dy0 = t.clientY - g.y0, ahora = Date.now();
    // velocidad: sobre las muestras de los últimos 100 ms (una sola muestra pegada a otra no vale)
    g.m.push([ahora, t.clientX]); while (g.m.length > 2 && ahora - g.m[0][0] > 100) g.m.shift();
    { const o = g.m[0], dt = Math.max(ahora - o[0], 16); g.vx = (t.clientX - o[1]) / dt; }
    if (g.estado === 'espera') {
      if (Math.max(Math.abs(dx0), Math.abs(dy0)) < 10) return;
      // por ángulo: si no es claramente horizontal (menos de ~30° sobre el eje), el gesto no es nuestro
      if (Math.abs(dy0) > Math.abs(dx0) * 0.58) { cancela(); return; }
      const signo = dx0 < 0 ? -1 : 1, i = g.info;
      if (g.lado && (signo > 0 ? g.lado.sl > 2 : g.lado.sl < g.lado.max - 2)) { cancela(); return; }   // el contenedor aún puede desplazarse: el gesto es suyo
      const objetivo = i.tipo === 'sitio' ? (signo < 0 ? i.dcha : i.izq) : (signo > 0 ? i.atras : null);
      if (i.tipo === 'detalle' && signo < 0) { cancela(); return; }   // en un detalle, a la izquierda no hay nada
      g.signo = signo; g.objetivo = objetivo; g.estado = 'arrastra'; g.x0 = t.clientX - dx0;
      if (!VETA.reducido()) {
        const m = marco(); m.classList.add('desliza');
        g.col.style.willChange = 'transform'; g.col.style.zIndex = '1';
        if (objetivo) {
          g.peek = VETA.gestos.peek(objetivo);
          if (g.peek) { g.peek.style.willChange = 'transform'; g.peek.style.transform = 'translateX(' + (i.tipo === 'sitio' ? -signo * ancho() : -0.3 * ancho()) + 'px)'; m.appendChild(g.peek); }
        }
      }
    }
    if (g.estado !== 'arrastra') return;
    if (ev.cancelable) ev.preventDefault();   // ya es nuestro
    let dx = t.clientX - g.x0; dx = g.signo * Math.max(0, g.signo * dx);
    g.dx = dx;
    if (VETA.reducido()) return;
    const w = ancho();
    if (!g.objetivo) { const r = g.signo * Math.min(40, Math.abs(dx) * 0.3); g.col.style.transform = 'translateX(' + r + 'px)'; return; }   // en el extremo: resistencia elástica
    g.col.style.transform = 'translateX(' + dx + 'px)';
    if (g.peek) g.peek.style.transform = 'translateX(' + (g.info.tipo === 'sitio' ? -g.signo * w + dx : -0.3 * w * (1 - Math.abs(dx) / w)) + 'px)';
  }
  function alSoltar(cancelado) {
    const g0 = g; g = null;
    document.removeEventListener('touchmove', alMover);
    if (!g0 || g0.estado !== 'arrastra') { if (g0) quita(g0); return; }
    const w = ancho(), dx = g0.dx, pasa = !cancelado && g0.objetivo && (Math.abs(dx) > UMBRAL * w || (Math.abs(g0.vx) > 0.35 && Math.abs(dx) > 35 && Math.sign(g0.vx) === g0.signo));
    const col = g0.col;
    if (!pasa) {   // vuelve a su sitio
      if (cancelado || VETA.reducido() || typeof col.animate !== 'function') { quita(g0); return; }
      const actual = col.style.transform || 'translateX(0px)';
      col.style.transform = ''; col.style.willChange = '';
      const a = col.animate([{transform: actual}, {transform: 'translateX(0)'}], {duration: 180, easing: CURVA});
      const v = vuelta = {a, g0}; const fin = () => { if (vuelta === v) { vuelta = null; quita(g0); } }; a.finished.then(fin, fin);
      return;
    }
    const G = VETA.gestos, objetivo = g0.objetivo, atras = g0.info.tipo === 'detalle';
    if (VETA.reducido()) { quita(g0); if (atras) G.atras(); else G.va(objetivo); return; }
    // la copia de lo que se ve (con el dedo donde estaba) se va; la pantalla de verdad se recoloca y entra
    const m = marco();
    col.style.transform = ''; col.style.willChange = ''; col.style.zIndex = '';
    if (g0.peek) g0.peek.remove();
    cambiaCon(col, dx, g0.signo, atras, entra => { if (atras) G.atras(entra); else G.va(objetivo, entra); });
    if (m) sueltaMarco();
  }
  document.addEventListener('touchstart', alEmpezar, {passive: true});
  // levantar un dedo con otro aún apoyado no es soltar: se cancela (no cambia de sitio). Solo el último dedo suelta.
  document.addEventListener('touchend', ev => { if (ev.touches && ev.touches.length > 0) cancela(); else alSoltar(false); }, {passive: true});
  document.addEventListener('touchcancel', () => cancela(), {passive: true});

  // tocar un sitio de la barra: misma transición lateral, hacia el lado en que está el sitio en la barra. Devuelve true si la ha hecho él
  function deslizaA(d) {
    const G = VETA.gestos; if (!G || VETA.reducido() || document.hidden || (VETA.ordenador && VETA.ordenador())) return false;
    const col = VETA.$('#marco .col.activa'); if (!col) return false;
    const ss = G.sitios(), a = ss.indexOf(G.marcado()), b = ss.indexOf(d);
    if (a < 0 || b < 0 || a === b) return false;
    cambiaCon(col, 0, b > a ? -1 : 1, false, entra => G.va(d, entra));
    return true;
  }

  VETA.mov = {hayVT, transiciona, cascada, escalona, seVa, entraSinVT, vigilaDesplazamiento, nombra, ocupada, alAcabar, deslizaA};
})();
