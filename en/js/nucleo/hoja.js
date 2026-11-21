/* Veta demo · núcleo · hoja.js
   Hojas que suben desde abajo (en ordenador, diálogos centrados de 480 px). Solo una a la vez.
   VETA.hojaDef(id, {titulo: d => '…', pinta: d => '<html>', acciones: {nombre(ev, el, d){}}, alMontar(el, d), alCerrar(d)})
   VETA.hoja(id, datos) abre (o cambia la que está abierta, sin volver a animar) · VETA.cierraHoja()
   Se cierra con su botón (data-cierra), tocando el velo, con Escape o arrastrando el asa (lógica de fuente/core.js:
   más de 96 px, o rápida y más de 16 px). El fondo queda inerte y el foco vuelve a quien la abrió. */
(function () {
  'use strict';
  const defs = {};
  let actual = null, abridor = null;
  VETA.hojaDefs = defs;
  VETA.hojaDef = (id, def) => { defs[id] = def; };
  VETA.hojaActual = () => actual;

  const $h = () => document.getElementById('hoja');
  const $v = () => document.getElementById('velo');
  const FONDO = ['#lateral', '#marco', '#barra', '#guia'];
  const inerte = on => FONDO.forEach(q => { const el = document.querySelector(q); if (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } });

  // una hoja que aún no existe: dice su código y quién la hace
  function provisional(id) {
    const h = (VETA.HOJAS || {})[id];
    return {
      titulo: () => h ? h.titulo : 'Sheet',
      pinta: () => `<p class="hoja-x">${h ? `${h.cod} · pending from package ${h.paq}` : 'This sheet doesn\'t exist yet.'}</p>` +
        (h ? `<p class="hoja-x tenue">Goes in js/hojas/${h.archivo}.</p>` : '') +
        VETA.UI.boton({tipo: 'secundario', texto: 'Close', datos: {cierra: '1'}})
    };
  }

  VETA.hoja = (id, d) => {
    const h = $h(); if (!h) return;
    d = Object.assign({}, d || {});
    const def = defs[id] || provisional(id);
    const yaAbierta = h.classList.contains('on');
    if (!yaAbierta) { abridor = document.activeElement; if (VETA.quitaAviso) VETA.quitaAviso(); }
    actual = {id, d, def};
    const titulo = typeof def.titulo === 'function' ? def.titulo(d) : (def.titulo || '');
    h.style.transform = ''; h.style.transition = '';
    h.dataset.id = id;   // no «data-hoja»: rutas.js abre hojas con [data-hoja] y el clic dentro la volvería a abrir
    h.innerHTML = `<div class="asa" aria-hidden="true"><i></i></div><button type="button" class="hoja-x-b" data-cierra="1" aria-label="Close">${VETA.ic('cerrar', 18)}</button>` +
      `<h2 class="hoja-t" id="hoja-titulo">${VETA.esc(titulo)}</h2><div class="hoja-c">${def.pinta ? def.pinta(d) : ''}</div>`;
    h.setAttribute('aria-labelledby', 'hoja-titulo');
    if (!yaAbierta) {
      h.hidden = false; $v().hidden = false;
      void h.offsetWidth;
      h.classList.add('on'); $v().classList.add('on'); document.body.classList.add('hoja-on'); inerte(true);
    }
    if (def.alMontar) def.alMontar(h, d);
    if (VETA.guia) VETA.guia.calla();
    try { (h.querySelector('[autofocus]') || h).focus({preventScroll: true}); } catch (e) {}
  };

  VETA.cierraHoja = o => {
    const h = $h(); if (!h || !h.classList.contains('on')) return;
    const fue = actual; actual = null;
    h.classList.remove('on'); $v().classList.remove('on'); document.body.classList.remove('hoja-on'); inerte(false);
    h.style.transform = ''; h.style.transition = '';
    const ms = VETA.reducido() ? 100 : 220;
    clearTimeout(VETA.cierraHoja._t);
    VETA.cierraHoja._t = setTimeout(() => { if (!h.classList.contains('on')) { h.hidden = true; $v().hidden = true; h.innerHTML = ''; } }, ms);
    const a = abridor; abridor = null;
    if (!(o && o.foco === false) && a && a.isConnected && a.focus) { try { a.focus({preventScroll: true}); } catch (e) {} }
    if (fue && fue.def.alCerrar) fue.def.alCerrar(fue.d);
  };

  // velo, Escape y foco atrapado
  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'velo') VETA.cierraHoja();
    const c = e.target.closest && e.target.closest('[data-cierra]');
    if (c && c.closest('#hoja')) VETA.cierraHoja();
  });
  document.addEventListener('keydown', e => {
    const h = $h(); if (!h || !h.classList.contains('on')) return;
    if (e.key === 'Escape') { e.preventDefault(); VETA.cierraHoja(); return; }
    if (e.key !== 'Tab') return;
    const f = VETA.$$('button:not([disabled]),input,textarea,select,[tabindex="0"]', h).filter(x => x.offsetParent !== null);
    if (!f.length) { e.preventDefault(); return; }
    const pri = f[0], ult = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === pri || document.activeElement === h)) { e.preventDefault(); ult.focus(); }
    else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
  });

  // arrastrar el asa (copiado de la demo antigua, sin el escalado del marco de escritorio)
  document.addEventListener('pointerdown', e => {
    const asa = e.target.closest && e.target.closest('#hoja .asa'); if (!asa) return;
    const h = $h(); const y0 = e.clientY; let dy = 0, v = 0, ly = y0, lt = e.timeStamp;
    h.style.transition = 'none';
    try { asa.setPointerCapture(e.pointerId); } catch (x) {}
    const mueve = ev => {
      dy = Math.max(0, ev.clientY - y0); h.style.transform = 'translateY(' + dy + 'px)';
      const dt = ev.timeStamp - lt; if (dt > 0) v = (ev.clientY - ly) / dt; ly = ev.clientY; lt = ev.timeStamp;
    };
    const suelta = () => {
      asa.removeEventListener('pointermove', mueve); asa.removeEventListener('pointerup', suelta); asa.removeEventListener('pointercancel', suelta);
      h.style.transition = '';
      if (dy > 96 || (v > .6 && dy > 16)) VETA.cierraHoja(); else h.style.transform = '';
    };
    asa.addEventListener('pointermove', mueve); asa.addEventListener('pointerup', suelta); asa.addEventListener('pointercancel', suelta);
  });
})();
