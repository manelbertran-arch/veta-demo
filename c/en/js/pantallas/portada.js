/* Veta demo · pantallas · portada.js (núcleo)
   E1 · Portada (P0) · paso 1 de la entrada: la marca y el idioma, como la portada de la web (revision_valor/PORTADA_WEB.md, A).
   Fondo antracita con dos luces doradas que derivan, el logotipo VETA que respira con su halo y, debajo, “Elige idioma ·
   Choose your language” con los dos idiomas de la demo: Castellano y English, como un par de botones (ronda 8, E-1: ya no
   circulan ni van en versales). CSS en componentes.css (portada) y r8-entrada.css, que lo pisa.
   - Cada idioma es su botón: se elige el que se toca.
   - “Castellano” lleva al paso 2 (Entrar: el lema y el papel). “English” lleva a la versión en inglés (en/), directa a su
     paso del papel (#/entrar), sin otra portada.
   - Con “Reducir movimiento” el logotipo no respira ni la luz deriva. */
(function () {
  'use strict';
  const esc = VETA.esc;
  const IDIOMAS = [
    {l: 'es', t: 'Castellano'},
    {l: 'en', t: 'English'}
  ];
  // la versión en inglés vive en en/ y empieza en su paso del papel; el movimiento reducido viaja con el enlace
  VETA.enlaceIngles = () => '../' + (VETA.reducido() ? '?mov=reducido' : '') + '#/entrar';

  // el fondo de la marca (también lo usa Entrar): el desfase sale del reloj, así la luz no salta al pasar de pantalla
  VETA.fondoMarca = () => {
    const s = Date.now() / 1000;
    return `<div class="m-fondo" aria-hidden="true"><i class="m-luz" style="animation-delay:-${(s % 84).toFixed(2)}s"></i>` +
      `<i class="m-luz dos" style="animation-delay:-${(s % 110).toFixed(2)}s"></i><i class="m-vin"></i><i class="m-grano"></i></div>`;
  };

  VETA.pantalla('E1', {
    ruta: 'portada', titulo: 'Welcome', completa: true, sinCabecera: true, area: 'marca',
    pinta: () =>
      `<div class="portada m-marca">${VETA.fondoMarca()}` +
      `<div class="m-pick"><div class="m-logo"><div class="m-halo" aria-hidden="true"></div>` +
      `<img src="assets/veta-lockup-white.png" alt="Veta" width="860" height="164"></div>` +
      `<nav class="m-idiomas" aria-labelledby="m-elige">` +
      `<p class="m-elige" id="m-elige"><span lang="es">Elige idioma</span><i aria-hidden="true">·</i><span lang="en">Choose your language</span></p>` +
      `<div class="r7-par m-par">` +
      IDIOMAS.map((x, i) => `<button type="button" class="r7-boton m-idioma${i ? ' r7-boton-claro' : ''}" lang="${x.l}" data-accion="idioma" data-l="${x.l}"><span>${esc(x.t)}</span></button>`).join('') +
      `</div></nav></div></div>`,
    alMontar: () => { VETA.est.pon('portadaVista', true); },
    acciones: {
      idioma(ev, el) {
        const l = (el && el.dataset.l) || 'en';
        if (l === 'es') { location.href = VETA.enlaceIngles(); return; }
        VETA.entraDeCero();
      }
    }
  });
})();
