/* Veta demo · núcleo · aviso.js
   El aviso negro: solo cuando lo tocado ya no está en pantalla o la acción nace en una hoja.
   VETA.aviso('Texto copiado.', {deshacer: fn, ms: 5000}; sin deshacer dura 2,5 s).
   Ronda 8 (D13, D25a): sale pegado al borde de arriba del pie (o de la barra), a lo ancho de la columna, y no tapa nada: mientras está,
   el contenido cede su alto (si lo último estaba a la vista, sube lo justo) y los toques lo atraviesan salvo en «Deshacer».
   Una sola confirmación: si la pantalla acaba de pintar un «hecho» nuevo con su «Deshacer» (VETA.r7.hecho), el aviso que llegue con él
   no sale, y el que ya estuviera se va. {siempre: true} lo salta (para un aviso que dice otra cosa).
   Ronda 6: con deshacer, un anillo cuenta atrás el tiempo que queda; con {ensena: 'Entendido: no lo cierro sin preguntarte.'},
   al deshacer el aviso no se va: dice lo que Veta ha entendido (3 s). */
(function () {
  'use strict';
  let t = null, deshacer = null, ensena = null;
  const anillo = '<svg class="aviso-an" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9" pathLength="1"/></svg>';
  let hueco = null;   // la zona de desplazamiento que ha cedido su alto al aviso
  const suelta = () => { if (hueco) { hueco.style.marginBottom = ''; hueco = null; } };
  function sitio(el) {
    // pegado al borde de arriba del botón fijo de la columna activa, si lo hay; si no, al de la barra; con una hoja abierta, al fondo
    const col = VETA.$('.col.activa'), hoja = document.body.classList.contains('hoja-on');
    const fijo = !hoja && VETA.$('.col.activa > .fijo:not(:empty)');   // el pie de la columna, no uno de muestra dentro del contenido
    const barra = document.getElementById('barra');
    let b = 0;
    if (fijo && fijo.offsetHeight) b = window.innerHeight - fijo.getBoundingClientRect().top;
    else if (!hoja && barra && barra.offsetHeight && getComputedStyle(barra).display !== 'none') b = window.innerHeight - barra.getBoundingClientRect().top;
    const r = !hoja && col ? col.getBoundingClientRect() : {left: 0, width: window.innerWidth};
    el.style.setProperty('--aviso-b', Math.max(0, Math.round(b)) + 'px');
    el.style.setProperty('--aviso-l', Math.round(r.left) + 'px'); el.style.setProperty('--aviso-w', Math.round(r.width) + 'px');
    el.classList.toggle('al-fondo', b === 0);
    // el contenido cede el alto del aviso; si lo último estaba a la vista, sube lo justo para seguir viéndose
    suelta();
    const d = !hoja && col && col.querySelector('.desplaza');
    if (d) {
      // «a la vista»: quedan menos de 40 px por desplazar (los 32 de aire del final de la pantalla no cuentan como contenido)
      const h = el.offsetHeight, abajo = d.scrollHeight - d.clientHeight - d.scrollTop < 40, toca = d.scrollHeight > d.clientHeight - h;
      d.style.marginBottom = h + 'px'; hueco = d;
      if (abajo && toca) { const t = d.scrollHeight - d.clientHeight; try { d.scrollTo({top: t, behavior: VETA.reducido() ? 'auto' : 'smooth'}); } catch (e) { d.scrollTop = t; } }
    }
  }
  // si la pantalla se monta de nuevo mientras el aviso está (se decide algo y se vuelve a Inicio, o se repinta), el aviso se recoloca
  // sobre el pie nuevo y el contenido nuevo le vuelve a ceder su alto (lo llama rutas.js al pintar)
  VETA.avisoRecoloca = () => { const el = document.getElementById('aviso'); if (el && !el.hidden && el.classList.contains('on')) sitio(el); };
  let mudo = false;   // el aviso que hay en pantalla se puede callar (no lleva {siempre: true})
  // lo llama el núcleo cuando aparece un «hecho» nuevo con su «Deshacer»: el aviso que dijera lo mismo sobra
  VETA.avisoCalla = () => { const el = document.getElementById('aviso'); if (el && el.classList.contains('on') && mudo) VETA.quitaAviso(); };
  VETA.aviso = (texto, o) => {
    o = o || {};
    const el = document.getElementById('aviso'); if (!el) return;
    if (!o.siempre && !o._ensena && VETA.r7 && VETA.r7.hechoReciente && VETA.r7.hechoReciente()) return;
    mudo = !o.siempre && !o._ensena;
    deshacer = typeof o.deshacer === 'function' ? o.deshacer : null;
    ensena = deshacer && o.ensena ? String(o.ensena) : null;
    el.classList.toggle('ensena', !!o._ensena);
    const ms = o.ms || (deshacer ? 5000 : 2500);   // el negro dura 2,5 s; el que lleva «Deshacer» mantiene su cuenta atrás
    el.style.setProperty('--v-ms', ms + 'ms');
    el.innerHTML = `<span class="aviso-t">${VETA.esc(texto)}</span>` + (deshacer ? `<button type="button" class="btn btn-texto aviso-d">${anillo}<span>Deshacer</span></button>` : '');
    el.hidden = false;
    sitio(el);
    void el.offsetWidth; el.classList.add('on');
    clearTimeout(t); t = setTimeout(VETA.quitaAviso, ms);
  };
  VETA.quitaAviso = () => {
    const el = document.getElementById('aviso'); if (!el) return;
    el.classList.remove('on'); deshacer = null; ensena = null; suelta();
    setTimeout(() => { if (!el.classList.contains('on')) el.hidden = true; }, 220);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('#aviso .aviso-d'); if (!b) return;
    const fn = deshacer, dice = ensena; VETA.quitaAviso(); if (fn) fn();
    if (dice) VETA.aviso(dice, {ms: 3000, _ensena: true});
  });
})();
