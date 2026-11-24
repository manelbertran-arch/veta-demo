/* Veta demo · pantallas · entrar.js · paquete C (Veta, cuenta y entrada) · ronda 8, carril E
   - E2 · Entrar · #/entrar (completa, sin cabecera)
   La entrada son dos toques: 1 · la marca y el idioma (E1, portada.js) → 2, aquí: elegir el papel entra (ronda 8, D25d).
   Un acceso = una cuenta, y cada papel tiene su propio acceso. Aquí:
   paso 0 · el lema («Tú trabajas. Veta aprende. Después lo hace por ti.») y las dos tarjetas del papel, de una línea
            cada una: «Soy agente» y «Soy de dirección». Tocar una entra con la cuenta de ejemplo de ese papel (Laura Martí;
            Montse Ribas, que además lleva clientes). Debajo, dos enlaces: «Ver cómo es el primer día» y «Entrar con mi correo»
            (lo que en la versión anterior era el segundo paso: ahora no estorba, pero sigue). Al pie, el aviso de demo, que
            vive solo aquí (E-4). Mismo fondo y luz que la portada (VETA.fondoMarca).
   paso 1 · solo con «Entrar con mi correo»: correo, contraseña y el código de 6 números del móvil (dirección; Laura no lo lleva).
   No hay cambio de perfil dentro de la app: se cambia de persona con Cuenta › «Cerrar sesión», que vuelve al paso 0.
   Las cuentas y la contraseña son de ejemplo; nada sale del navegador. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  let paso = 0, correo = '', error = false;
  const CU = () => VETA.datos.c.cuentas;
  const quien = c => Object.keys(CU()).find(k => CU()[k] === String(c || '').trim().toLowerCase());
  const PAPELES = [
    {id: 'laura', titulo: 'Soy agente'},
    {id: 'montse', titulo: 'Soy de dirección'}
  ];
  const aviso = `<p class="port-aviso">Ejemplo con datos inventados. No sale ningún mensaje.</p>`;
  const marca = `<div class="port-marca" data-i="0"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>`;
  const cambiar = UI.boton({tipo: 'texto', texto: 'Volver', accion: 'otra'});

  VETA.pantalla('E2', {
    titulo: 'Entrar', completa: true, sinCabecera: true, area: 'marca',
    pinta: () => {
      if (paso === 0) {
        return `<div class="portada c-entrar c-lema">${VETA.fondoMarca()}${marca}<div class="c-entrar-c">` +
          `<h1 class="solo-lector">Entra en Veta</h1><p class="port-h" data-i="1"><span>Tú trabajas.</span><span class="oro">Veta aprende.</span><span class="oro">Después lo hace por ti.</span></p>` +
          `<div class="c-entrar-cuentas" data-i="2">${PAPELES.map(p =>
            `<button type="button" class="c-cuenta c-papel" data-accion="papel" data-de="${p.id}"><span class="c-cuenta-t">${esc(p.titulo)}</span>` +
            `<span class="c-papel-chev">${VETA.ic('chev', 16)}</span></button>`).join('')}</div>` +
          `<div class="c-primer" data-i="3">${VETA.r7.enlace({texto: 'Ver cómo es el primer día', ir: 'primer-dia/0'})}${VETA.r7.enlace({texto: 'Entrar con mi correo', accion: 'correo'})}</div>` +
          `</div>${aviso}</div>`;
      }
      return `<div class="portada c-entrar">${VETA.fondoMarca()}${marca}<div class="c-entrar-c">` +
        `<h1 class="c-entrar-h" data-i="1">Entra con tu correo</h1>` +
        `<div class="c-entrar-campos" data-i="2">${UI.campo({etiqueta: 'Correo', id: 'c-correo', valor: correo, tipo: 'email'})}${UI.campo({etiqueta: 'Contraseña', id: 'c-clave-e', valor: correo ? 'ejemplo-veta' : '', tipo: 'password'})}` +
        UI.campo({etiqueta: 'Código de 6 números (dirección)', id: 'c-codigo', valor: '', tipo: 'text'}) + `</div>` +
        (error ? `<p class="c-entrar-err" role="alert" data-i="2">${VETA.ic('aviso', 18)}<span>${esc(error === 'codigo' ? 'El código tiene 6 números.' : 'El correo o la contraseña no coinciden.')}</span></p>` : '') +
        `<div class="port-acc" data-i="4">${UI.boton({tipo: 'claro', texto: 'Entrar', accion: 'entrar'})}${cambiar}</div>` +
        `</div>${aviso}</div>`;
    },
    acciones: {
      papel(ev, el) { fin(el.dataset.de); },
      correo() { correo = ''; error = false; paso = 1; VETA.repinta(); },
      entrar() {
        const i = document.getElementById('c-correo'), k = document.getElementById('c-clave-e'), c = document.getElementById('c-codigo');
        correo = i ? i.value : correo;
        const id = quien(correo);
        if (!id || !(k && k.value)) { error = true; VETA.repinta(); return; }
        if (id === 'montse' && (!c || c.value.replace(/\D/g, '').length !== 6)) { error = 'codigo'; VETA.repinta(); return; }
        fin(id);
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
