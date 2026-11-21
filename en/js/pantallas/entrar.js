/* Veta demo · pantallas · entrar.js · paquete C (Veta, cuenta y entrada)
   - E2 · Entrar · #/entrar (completa, sin cabecera)
   La entrada son tres pasos antes de la app: 1 · la marca y el idioma (E1, portada.js) → 2 y 3, aquí.
   Un acceso = una cuenta, y cada papel tiene su propio acceso. Aquí:
   paso 0 · «Entrar» y las dos cuentas: «Agente» o «Dirección». Mismo fondo que la portada (VETA.fondoMarca).
            ronda 7: es una pantalla de acceso, no una presentación: fuera el lema, la frase de qué hace Veta y las notas.
            Quien quiera la historia tiene «Ver cómo es el primer día».
   paso 1 · correo y contraseña, ya rellenos con la cuenta de ejemplo de ese papel (Laura Martí; Montse Ribas, que además lleva clientes).
   paso 2 · solo dirección: el código de 6 números del móvil.
   No hay cambio de perfil dentro de la app: se cambia de persona con Cuenta › «Cerrar sesión», que vuelve al paso 0.
   Las cuentas y la contraseña son de ejemplo; nada sale del navegador. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  let paso = 0, correo = '', error = false;
  const CU = () => VETA.datos.c.cuentas;
  const quien = c => Object.keys(CU()).find(k => CU()[k] === String(c || '').trim().toLowerCase());
  const PAPELES = [
    {id: 'laura', titulo: 'Agent', sub: 'Your clients and your day', icono: 'clientes', entras: 'You sign in as an agent'},
    {id: 'montse', titulo: 'Management', sub: 'Your office and your team', icono: 'equipo', entras: 'You sign in as management'}
  ];
  const aviso = `<p class="port-aviso">Example with made-up data. No message goes out.</p>`;
  const marca = `<div class="port-marca" data-i="0"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>`;
  const cambiar = UI.boton({tipo: 'texto', texto: 'Switch account', accion: 'otra'});

  VETA.pantalla('E2', {
    titulo: 'Sign in', completa: true, sinCabecera: true, area: 'marca',
    guia: ['Here you choose which account you sign in with; then you enter your email.', 'You tap “Agent” or “Management” and then “Sign in”.', 'This way you see that each account has its own access and that your account decides what you see.'],
    pinta: () => {
      if (paso === 0) {
        return `<div class="portada c-entrar c-acceso">${VETA.fondoMarca()}${marca}<div class="c-entrar-c">` +
          `<h1 class="c-entrar-h" data-i="1">Sign in</h1><p class="port-dice" data-i="1">Choose the account you sign in with.</p>` +
          `<div class="c-entrar-cuentas" data-i="2">${PAPELES.map(p =>
            `<button type="button" class="c-cuenta c-papel" data-accion="papel" data-de="${p.id}"><span class="c-papel-ic">${VETA.ic(p.icono, 24)}</span>` +
            `<span class="c-cuenta-t"><span class="c-papel-t">${esc(p.titulo)}</span><span class="c-papel-s">${esc(p.sub)}</span></span><span class="c-papel-chev">${VETA.ic('chev', 16)}</span></button>`).join('')}</div>` +
          `<div class="c-primer" data-i="3">${UI.boton({tipo: 'texto', texto: 'See what the first day is like', ir: 'primer-dia/0'})}</div>` +
          `</div>${aviso}</div>`;
      }
      if (paso === 2) {
        return `<div class="portada c-entrar">${VETA.fondoMarca()}${marca}<div class="c-entrar-c">` +
          `<h1 class="c-entrar-h" data-i="1">One more step</h1><p class="port-dice" data-i="1">Type the 6-digit code from your phone.</p>` +
          `<div data-i="2">${UI.campo({etiqueta: '6-digit code', id: 'c-codigo', valor: '482 913', tipo: 'text'})}</div>` +
          `<div class="port-acc" data-i="3">${UI.boton({tipo: 'claro', texto: 'Sign in', accion: 'codigo'})}${cambiar}</div>` +
          `</div>${aviso}</div>`;
      }
      const p = PAPELES.find(x => CU()[x.id] === correo) || PAPELES[0];
      return `<div class="portada c-entrar">${VETA.fondoMarca()}${marca}<div class="c-entrar-c">` +
        `<p class="c-entrar-papel" data-i="1">${VETA.ic(p.icono, 20)}<span>${esc(p.entras)}</span></p>` +
        `<h1 class="c-entrar-h" data-i="1">Sign in to Veta</h1>` +
        `<div class="c-entrar-campos" data-i="2">${UI.campo({etiqueta: 'Email', id: 'c-correo', valor: correo, tipo: 'email'})}${UI.campo({etiqueta: 'Password', id: 'c-clave-e', valor: correo ? 'ejemplo-veta' : '', tipo: 'password'})}</div>` +
        (error ? `<p class="c-entrar-err" role="alert" data-i="2">${VETA.ic('aviso', 18)}<span>The email or password doesn't match.</span></p>` : '') +
        `<p class="c-papel-nota" data-i="3">Example account of ${esc(VETA.modelo.persona(p.id).nombre)}.</p>` +
        `<div class="port-acc" data-i="4">${UI.boton({tipo: 'claro', texto: 'Sign in', accion: 'entrar'})}${cambiar}</div>` +
        `</div>${aviso}</div>`;
    },
    acciones: {
      papel(ev, el) { correo = CU()[el.dataset.de]; error = false; paso = 1; VETA.repinta(); },
      entrar() {
        const i = document.getElementById('c-correo'), k = document.getElementById('c-clave-e');
        correo = i ? i.value : correo;
        const id = quien(correo);
        if (!id || !(k && k.value)) { error = true; VETA.repinta(); return; }
        error = false;
        if (id === 'montse') { paso = 2; VETA.repinta(); return; }
        fin('laura');
      },
      codigo() {
        const c = document.getElementById('c-codigo');
        if (!c || c.value.replace(/\D/g, '').length !== 6) { c && c.focus(); VETA.aviso('The code has 6 digits.'); return; }
        fin('montse');
      },
      otra() { paso = 0; error = false; VETA.repinta(); }
    }
  });
  const deCero = () => { paso = 0; correo = ''; error = false; };
  function fin(id) { deCero(); VETA.est.pon('dentro', true); VETA.cambiaPerfil(id); }
  // portada › «Castellano»: siempre empieza por el lema y el papel
  VETA.entraDeCero = () => { deCero(); VETA.ir('entrar'); };
  // Cuenta › «Cerrar sesión» (y Seguridad): vuelve a la entrada; ahí se elige el otro papel
  VETA.cierraSesion = () => { deCero(); VETA.est.pon('dentro', false); if (VETA.cierraHoja) VETA.cierraHoja({foco: false}); VETA.ir('entrar', {pestana: true}); };
  VETA.accionGlobal('cierra-sesion', () => VETA.cierraSesion());
})();
