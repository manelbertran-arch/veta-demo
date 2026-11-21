/* Veta demo · pantallas · portada.js (núcleo)
   E1 · Portada (P0) · paso 1 de la entrada: la marca y el idioma.
   Fondo antracita, el logotipo VETA y, debajo, «Elige idioma · Choose your language» con los dos idiomas de la demo.
   - ronda 7: los dos idiomas están quietos, uno a cada lado (Castellano a la izquierda, English a la derecha). Nada gira.
   - Cada idioma es su botón: se elige el que se toca.
   - «Castellano» lleva al paso 2 (Entrar: elegir la cuenta). «English» lleva a la versión en inglés (en/), directa a su
     paso de la cuenta (#/entrar), sin otra portada. */
(function () {
  'use strict';
  const esc = VETA.esc;
  const IDIOMAS = [
    {l: 'es', t: 'Castellano'},
    {l: 'en', t: 'English'}
  ];
  // la versión en inglés vive en en/ y empieza en su paso del papel; el movimiento reducido viaja con el enlace
  VETA.enlaceIngles = () => 'en/' + (VETA.reducido() ? '?mov=reducido' : '') + '#/entrar';
  // el fondo de la marca (también lo usa Entrar): el desfase sale del reloj, así la luz no salta al pasar de pantalla
  VETA.fondoMarca = () => {
    const s = Date.now() / 1000;
    return `<div class="m-fondo" aria-hidden="true"><i class="m-luz" style="animation-delay:-${(s % 84).toFixed(2)}s"></i>` +
      `<i class="m-luz dos" style="animation-delay:-${(s % 110).toFixed(2)}s"></i><i class="m-vin"></i><i class="m-grano"></i></div>`;
  };

  VETA.pantalla('E1', {
    ruta: 'portada', titulo: 'Home', completa: true, sinCabecera: true, area: 'marca',
    guia: ['Here you choose the language of the demo.', 'You tap “Castellano” or “English”: they stay still, one on each side.', 'This way anyone who does not speak Spanish gets the whole demo in English.'],
    pinta: () =>
      `<div class="portada m-marca">${VETA.fondoMarca()}` +
      `<div class="m-pick"><div class="m-logo"><div class="m-halo" aria-hidden="true"></div>` +
      `<img src="assets/veta-lockup-white.png" alt="Veta" width="860" height="164"></div>` +
      `<nav class="m-idiomas" aria-labelledby="m-elige">` +
      `<p class="m-elige" id="m-elige"><span lang="es">Elige idioma</span><i aria-hidden="true">·</i><span lang="en">Choose your language</span></p>` +
      `<div class="m-dos">` +
      IDIOMAS.map(x => `<button type="button" class="m-idioma" lang="${x.l}" data-accion="idioma" data-l="${x.l}"><span>${esc(x.t)}</span></button>`).join('') +
      `</div></nav></div></div>`,
    alMontar: () => { VETA.est.pon('portadaVista', true); },
    acciones: {
      idioma(ev, el) {
        const l = (el && el.dataset.l) || 'en';
        if (l === 'es') { location.href = '../' + (VETA.reducido() ? '?mov=reducido' : '') + '#/entrar'; return; }
        VETA.entraDeCero();
      }
    }
  });
})();
