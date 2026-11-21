/* Veta demo · núcleo · aviso.js
   El aviso negro: solo cuando lo tocado ya no está en pantalla o la acción nace en una hoja.
   VETA.aviso('Texto copiado.', {deshacer: fn, ms: 5000}). Sale 12 px sobre la barra o sobre el botón fijo; nunca tapa un botón. */
(function () {
  'use strict';
  let t = null, deshacer = null;
  function sitio(el) {
    // el botón fijo de la columna activa, si lo hay; si no, la barra
    const fijo = VETA.$('.col.activa .fijo:not(:empty)');
    const barra = document.getElementById('barra');
    let b = 12;
    if (fijo && fijo.offsetHeight) b += window.innerHeight - fijo.getBoundingClientRect().top;
    else if (barra && barra.offsetHeight && getComputedStyle(barra).display !== 'none') b += window.innerHeight - barra.getBoundingClientRect().top;
    else b += 16;
    el.style.setProperty('--aviso-b', b + 'px');
  }
  VETA.aviso = (texto, o) => {
    o = o || {};
    const el = document.getElementById('aviso'); if (!el) return;
    deshacer = typeof o.deshacer === 'function' ? o.deshacer : null;
    el.innerHTML = `<span class="aviso-t">${VETA.esc(texto)}</span>` + (deshacer ? '<button type="button" class="btn btn-texto aviso-d">Deshacer</button>' : '');
    sitio(el);
    el.hidden = false; void el.offsetWidth; el.classList.add('on');
    clearTimeout(t); t = setTimeout(VETA.quitaAviso, o.ms || 5000);
  };
  VETA.quitaAviso = () => {
    const el = document.getElementById('aviso'); if (!el) return;
    el.classList.remove('on'); deshacer = null;
    setTimeout(() => { if (!el.classList.contains('on')) el.hidden = true; }, 220);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('#aviso .aviso-d'); if (!b) return;
    const fn = deshacer; VETA.quitaAviso(); if (fn) fn();
  });
})();
