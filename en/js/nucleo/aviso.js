/* Veta demo · núcleo · aviso.js
   El aviso negro: solo cuando lo tocado ya no está en pantalla o la acción nace en una hoja.
   VETA.aviso('Texto copiado.', {deshacer: fn, ms: 5000}; sin deshacer dura 2,5 s). Sale 12 px sobre la barra o sobre el botón fijo; nunca tapa un botón.
   Ronda 6: con deshacer, un anillo cuenta atrás el tiempo que queda; con {ensena: 'Entendido: no lo cierro sin preguntarte.'},
   al deshacer el aviso no se va: dice lo que Veta ha entendido (3 s). */
(function () {
  'use strict';
  let t = null, deshacer = null, ensena = null;
  const anillo = '<svg class="aviso-an" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9" pathLength="1"/></svg>';
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
    ensena = deshacer && o.ensena ? String(o.ensena) : null;
    el.classList.toggle('ensena', !!o._ensena);
    const ms = o.ms || (deshacer ? 5000 : 2500);   // el negro dura 2,5 s; el que lleva “Deshacer” mantiene su cuenta atrás
    el.style.setProperty('--v-ms', ms + 'ms');
    el.innerHTML = `<span class="aviso-t">${VETA.esc(texto)}</span>` + (deshacer ? `<button type="button" class="btn btn-texto aviso-d">${anillo}<span>Undo</span></button>` : '');
    sitio(el);
    el.hidden = false; void el.offsetWidth; el.classList.add('on');
    clearTimeout(t); t = setTimeout(VETA.quitaAviso, ms);
  };
  VETA.quitaAviso = () => {
    const el = document.getElementById('aviso'); if (!el) return;
    el.classList.remove('on'); deshacer = null; ensena = null;
    setTimeout(() => { if (!el.classList.contains('on')) el.hidden = true; }, 220);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('#aviso .aviso-d'); if (!b) return;
    const fn = deshacer, dice = ensena; VETA.quitaAviso(); if (fn) fn();
    if (dice) VETA.aviso(dice, {ms: 3000, _ensena: true});
  });
})();
