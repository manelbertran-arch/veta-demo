/* Veta demo · pantallas · portada.js (núcleo)
   E1 · Portada (P0) · paso 1 de la entrada: la marca y el idioma, como la portada de la web (revision_valor/PORTADA_WEB.md, A).
   Fondo antracita con dos luces doradas que derivan, el logotipo VETA que respira con su halo y, debajo, “Elige idioma ·
   Choose your language” con los dos idiomas de la demo: Castellano y English. CSS en componentes.css (portada) y movimiento.css (17).
   - Los dos idiomas circulan, como el carrusel de la web, pero en una órbita vista un poco desde arriba: el de detrás sube
     y se atenúa en vez de esconderse, así los dos se ven y se tocan siempre, sin esperar a que pase de frente (una vuelta, 10 s).
   - Cada idioma es su botón: se elige el que se toca. Al apoyar el dedo la órbita se para (con ratón, al pasar por encima).
   - “Castellano” lleva al paso 2 (Entrar: el lema y el papel). “English” lleva a la versión en inglés (en/), directa a su
     paso del papel (#/entrar), sin otra portada.
   - Con “Reducir movimiento” nada gira ni respira: los dos idiomas quietos, en fila. */
(function () {
  'use strict';
  const esc = VETA.esc;
  const IDIOMAS = [
    {l: 'es', t: 'Castellano'},
    {l: 'en', t: 'English'}
  ];
  // la versión en inglés vive en en/ y empieza en su paso del papel; el movimiento reducido viaja con el enlace
  VETA.enlaceIngles = () => 'en/' + (VETA.reducido() ? '?mov=reducido' : '') + '#/entrar';
  let suelta = null;

  // el fondo de la marca (también lo usa Entrar): el desfase sale del reloj, así la luz no salta al pasar de pantalla
  VETA.fondoMarca = () => {
    const s = Date.now() / 1000;
    return `<div class="m-fondo" aria-hidden="true"><i class="m-luz" style="animation-delay:-${(s % 84).toFixed(2)}s"></i>` +
      `<i class="m-luz dos" style="animation-delay:-${(s % 110).toFixed(2)}s"></i><i class="m-vin"></i><i class="m-grano"></i></div>`;
  };

  const orbita = () => document.querySelector('.pant-E1 .m-orbita');
  const para = () => { const o = orbita(); if (o) { clearTimeout(suelta); o.classList.add('quieto'); } };
  const sigue = () => { const o = orbita(); if (o) { clearTimeout(suelta); o.classList.remove('quieto'); } };

  VETA.pantalla('E1', {
    ruta: 'portada', titulo: 'Home', completa: true, sinCabecera: true, area: 'marca',
    guia: ['Here Veta shows itself as on its website: the name and the language.', 'You choose “Castellano” or “English”: both are always visible and can be tapped, even while they move around.', 'This is how you come in, as on the website, and anyone who does not speak Spanish gets the whole demo in English.'],
    pinta: () =>
      `<div class="portada m-marca">${VETA.fondoMarca()}` +
      `<div class="m-pick"><div class="m-logo"><div class="m-halo" aria-hidden="true"></div>` +
      `<img src="assets/veta-lockup-white.png" alt="Veta" width="860" height="164"></div>` +
      `<nav class="m-idiomas" aria-labelledby="m-elige">` +
      `<p class="m-elige" id="m-elige"><span lang="es">Elige idioma</span><i aria-hidden="true">·</i><span lang="en">Choose your language</span></p>` +
      `<div class="m-orbita">` +
      IDIOMAS.map((x, i) => `<div class="m-via" style="--i:${i}"><button type="button" class="m-idioma" lang="${x.l}" data-accion="idioma" data-l="${x.l}">` +
        `<span>${esc(x.t)}</span></button></div>`).join('') +
      `</div></nav></div></div>`,
    alMontar: el => {
      VETA.est.pon('portadaVista', true);
      const nav = el.querySelector('.m-idiomas'); if (!nav || VETA.reducido()) return;
      nav.addEventListener('pointerdown', para);
      nav.addEventListener('pointerup', () => { clearTimeout(suelta); suelta = setTimeout(sigue, 450); });
      nav.addEventListener('pointercancel', sigue);
      nav.addEventListener('focusin', ev => { if (ev.target.matches(':focus-visible')) para(); });
      nav.addEventListener('focusout', ev => { if (!nav.contains(ev.relatedTarget)) sigue(); });
    },
    acciones: {
      idioma(ev, el) {
        clearTimeout(suelta);
        const l = (el && el.dataset.l) || 'en';
        if (l === 'es') { para(); location.href = '../' + (VETA.reducido() ? '?mov=reducido' : '') + '#/entrar'; return; }
        VETA.entraDeCero();
      }
    }
  });
})();
