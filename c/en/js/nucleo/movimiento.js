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
  // (lo llama rutas.js); nunca en una hoja ni al repintar. Con “Reducir movimiento”, nada.
  function escalona(el) {
    if (!el || VETA.reducido()) return;
    VETA.$$('.r7-primero, .r7-lista > .r7-fila, .r7-lista > .r7-fila-d, .r7-lista > .interr', el).slice(0, 6).forEach((f, n) => { f.style.setProperty('--f', n); f.classList.add('r7-esc'); });
    el.classList.remove('esc'); void el.offsetWidth; el.classList.add('esc');
    clearTimeout(el._esc); el._esc = setTimeout(() => el.classList.remove('esc'), 900);
  }

  // la fila resuelta se va (ronda 8, 6.1 y 6.6): opacidad y alto a cero en 200 ms y las de debajo suben; al acabar se llama a `despues`,
  // que es quien cambia el modelo y repinta. VETA.mov.seVa(el, () => { M.resuelve(id); VETA.repinta(); })
  // `el`: la fila, la tarjeta de “lo primero” o cualquier bloque (o un selector dentro de la columna activa). Si era la única fila de su
  // lista, se va la lista entera (y su rótulo). Con “Reducir movimiento”, o si no hay elemento, llama a `despues` sin más.
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

  VETA.mov = {hayVT, transiciona, cascada, escalona, seVa, entraSinVT, vigilaDesplazamiento, nombra, ocupada, alAcabar};
})();
