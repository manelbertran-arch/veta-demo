/* Veta demo · núcleo · tema.js
   Tres ejes en <html>: data-modo (claro | oscuro, ya resuelto), data-color (una de las 12 paletas de temas.css)
   y data-mov (normal | reducido). El guion del <head> de index.html los pone antes del primer pintado;
   aquí se cambian. Se guardan en localStorage (VETA.pref). “Reducir movimiento” se enciende también con
   prefers-reduced-motion o con ?mov=reducido. */
(function () {
  'use strict';
  const raiz = document.documentElement;
  const COLORES = ['veta', 'joya', 'medianoche', 'nube', 'lima', 'coral', 'lavanda', 'mocha', 'cobalto', 'zafiro', 'aurora', 'salvia'];
  const NOMBRES = {veta: 'Veta', joya: 'Jewel', medianoche: 'Midnight', nube: 'Cloud and petrol', lima: 'Forest and lime', coral: 'Coral', lavanda: 'Lavanda', mocha: 'Mocha and moss', cobalto: 'Cobalt and lime', zafiro: 'Sapphire and amber', aurora: 'Aurora', salvia: 'Sage and terracotta'};
  const MODOS = {claro: 'Light', oscuro: 'Dark', auto: 'Automatic'};
  const mm = q => !!(window.matchMedia && matchMedia(q).matches);

  if (VETA.param('mov') === 'reducido') VETA.est.pon('mov', 'reducido');

  const modo = () => (VETA.pref.lee('modo', 'claro') in MODOS ? VETA.pref.lee('modo', 'claro') : 'claro');
  const color = () => (COLORES.includes(VETA.pref.lee('color', 'veta')) ? VETA.pref.lee('color', 'veta') : 'veta');
  const movPedido = () => VETA.est.lee('mov', null) || VETA.pref.lee('mov', 'normal');
  const reducido = () => movPedido() === 'reducido' || mm('(prefers-reduced-motion: reduce)');

  function aplica(conFundido) {
    const m = modo() === 'auto' ? (mm('(prefers-color-scheme: dark)') ? 'oscuro' : 'claro') : modo();
    if (conFundido && !reducido()) {
      raiz.classList.add('cambia-tema');
      clearTimeout(aplica._t); aplica._t = setTimeout(() => raiz.classList.remove('cambia-tema'), 260);
    }
    raiz.dataset.modo = m; raiz.dataset.color = color(); raiz.dataset.pref = modo();
    raiz.dataset.mov = reducido() ? 'reducido' : 'normal';
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) { const c = getComputedStyle(raiz).getPropertyValue('--top-b').trim(); if (c && c !== 'transparent') meta.setAttribute('content', c); }
    document.dispatchEvent(new CustomEvent('veta:tema'));
  }

  VETA.tema = {
    COLORES, NOMBRES, MODOS,
    modo, color, reducido,
    // VETA.tema.pon({modo: 'oscuro'}) · {color: 'joya'} · {mov: 'reducido' | 'normal'}
    pon(o) {
      if (o.modo && o.modo in MODOS) VETA.pref.pon('modo', o.modo);
      if (o.color && COLORES.includes(o.color)) VETA.pref.pon('color', o.color);
      if (o.mov) { VETA.pref.pon('mov', o.mov); VETA.est.quita('mov'); }
      aplica(true);
    },
    aplica
  };

  aplica(false);
  try {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => aplica(true));
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => aplica(false));
  } catch (e) {}
})();
