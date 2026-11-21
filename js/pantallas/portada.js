/* Veta demo · pantallas · portada.js (núcleo)
   E1 · Portada (P0). El momento de marca y la carga de letras y fotos. Avisa una vez de que los datos son inventados.
   La veta dorada se descubre de derecha a izquierda una sola vez por sesión (1,2 s); tocar en cualquier sitio lo termina;
   al volver se ve quieta. Con movimiento reducido sale ya dibujada. */
(function () {
  'use strict';
  const UI = VETA.UI;
  VETA.pantalla('E1', {
    ruta: 'portada', titulo: 'Portada', completa: true, sinCabecera: true, area: 'marca',
    guia: ['Aquí Veta se presenta: tú trabajas, Veta aprende y después lo hace por ti.', 'Tú entras eligiendo tu papel en la oficina.', 'Así sabes desde el principio que nada sale sin que tú lo envíes y que todo es un ejemplo.'],
    pinta: () => {
      const primera = !VETA.est.lee('portadaVista', false) && !VETA.reducido();
      return `<div class="portada">` +
        `<div class="port-luz" aria-hidden="true"></div><div class="port-veta${primera ? ' descubre' : ''}" aria-hidden="true"></div>` +
        `<div class="port-marca"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>` +
        `<h1 class="port-h"><span>Tú trabajas.</span><span class="oro">Veta aprende.</span><span class="oro">Después lo hace por ti.</span></h1>` +
        `<p class="port-que">Veta convierte tus conversaciones de trabajo en acciones preparadas y automatizaciones que aprenden de ti.</p>` +
        `<p class="port-dice">Cada semana, menos trabajo manual. Nada sale sin que tú lo envíes.</p>` +
        `<div class="port-acc">${UI.boton({tipo: 'claro', texto: 'Entrar', accion: 'entrar', g: 'Entrar|Eliges tu papel y entras con tu correo.'})}` +
        `${UI.boton({tipo: 'texto', texto: 'Ver cómo es el primer día', ir: 'primer-dia/0'})}</div>` +
        `<p class="port-aviso">Ejemplo con datos inventados. No sale ningún mensaje.</p></div>`;
    },
    alMontar: el => {
      VETA.est.pon('portadaVista', true);
      const v = el.querySelector('.port-veta.descubre');
      if (v) el.addEventListener('pointerdown', () => v.classList.remove('descubre'), {once: true});
    },
    acciones: {
      entrar() { VETA.entraDeCero(); }   // primero el papel, luego correo y contraseña: la cuenta decide a dónde vas
    }
  });
})();
