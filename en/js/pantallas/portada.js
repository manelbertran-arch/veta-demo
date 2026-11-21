/* Veta demo · pantallas · portada.js (núcleo)
   E1 · Portada (P0). El momento de marca y la carga de letras y fotos. Avisa una vez de que los datos son inventados.
   La veta dorada se descubre de derecha a izquierda una sola vez por sesión (1,2 s); tocar en cualquier sitio lo termina;
   al volver se ve quieta. Con movimiento reducido sale ya dibujada. */
(function () {
  'use strict';
  const UI = VETA.UI;
  VETA.pantalla('E1', {
    ruta: 'portada', titulo: 'Home', completa: true, sinCabecera: true, area: 'marca',
    guia: ['Here Veta introduces itself: you work, Veta learns and then does it for you.', 'You sign in by choosing your role in the office.', 'That way you know from the start that nothing goes out without you sending it and that everything is an example.'],
    pinta: () => {
      const primera = !VETA.est.lee('portadaVista', false) && !VETA.reducido();
      const tour = !VETA.est.lee('tourVisto', false);   // la primera vez manda el tour; después, entrar
      return `<div class="portada">` +
        `<div class="port-luz" aria-hidden="true"></div><div class="port-veta${primera ? ' descubre' : ''}" aria-hidden="true"></div>` +
        `<div class="port-marca"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>` +
        `<h1 class="port-h"><span>You work.</span><span class="oro">Veta learns.</span><span class="oro">Then it does it for you.</span></h1>` +
        `<p class="port-que">Veta turns your work conversations into prepared actions and automations that learn from you.</p>` +
        `<p class="port-dice">Less manual work every week. Nothing goes out without you sending it.</p>` +
        `<div class="port-acc">${tour
          ? UI.boton({tipo: 'claro', texto: 'Show me the tour', ir: 'primer-dia/0'}) + UI.boton({tipo: 'texto', texto: 'Sign in', accion: 'entrar', g: 'Sign in|You choose your role and sign in with your email.'})
          : UI.boton({tipo: 'claro', texto: 'Sign in', accion: 'entrar', g: 'Sign in|You choose your role and sign in with your email.'}) + UI.boton({tipo: 'texto', texto: 'Show me the tour', ir: 'primer-dia/0'})}</div>` +
        `<p class="port-aviso">Example with made-up data. No message goes out.</p></div>`;
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
