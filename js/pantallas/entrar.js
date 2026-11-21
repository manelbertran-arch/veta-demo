/* Veta demo · pantallas · entrar.js · paquete C (Veta, cuenta y entrada)
   - E2 · Entrar · #/entrar (completa, sin cabecera: se quitó «‹ Cuenta y privacidad»)
   El papel sale de la cuenta: con la de dirección hay un segundo paso (código de la app de verificación).
   Las cuentas y la contraseña son de ejemplo; nada sale del navegador. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  let paso = 1, correo = null, error = false;
  const CU = () => VETA.datos.c.cuentas;
  const quien = c => Object.keys(CU()).find(k => CU()[k] === String(c || '').trim().toLowerCase());

  VETA.pantalla('E2', {
    titulo: 'Entrar', completa: true, sinCabecera: true, area: 'marca',
    guia: ['Aquí vuelves a entrar después de salir.', 'Tú eliges una cuenta de ejemplo y entras.', 'Así se ve que el papel, agente o dirección, sale de la cuenta.'],
    pinta: () => {
      if (correo === null) correo = CU()[VETA.yo().id] || CU().laura;
      const marca = `<div class="port-marca" data-i="0"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>`;
      if (paso === 2) {
        return `<div class="portada c-entrar">${marca}<div class="c-entrar-c">` +
          `<h1 class="c-entrar-h" data-i="1">Un paso más</h1><p class="port-dice" data-i="1">Dirección entra con un código de su app de verificación.</p>` +
          `<div data-i="2">${UI.campo({etiqueta: 'Código de 6 cifras de tu app de verificación', id: 'c-codigo', valor: '482 913', tipo: 'text'})}</div>` +
          `<div class="port-acc" data-i="3">${UI.boton({tipo: 'claro', texto: 'Entrar', accion: 'codigo'})}${UI.boton({tipo: 'texto', texto: 'Usar otra cuenta', accion: 'otra'})}</div>` +
          `</div><p class="port-aviso">Ejemplo con datos inventados. No sale ningún mensaje.</p></div>`;
      }
      const elegida = quien(correo);
      return `<div class="portada c-entrar">${marca}<div class="c-entrar-c">` +
        `<h1 class="c-entrar-h" data-i="1">Entra en Veta</h1>` +
        `<div class="c-entrar-campos" data-i="2">${UI.campo({etiqueta: 'Correo', id: 'c-correo', valor: correo, tipo: 'email'})}${UI.campo({etiqueta: 'Contraseña', id: 'c-clave-e', valor: 'ejemplo-veta', tipo: 'password'})}</div>` +
        (error ? `<p class="c-entrar-err" role="alert" data-i="2">${VETA.ic('aviso', 18)}<span>El correo o la contraseña no coinciden.</span></p>` : '') +
        `<div class="c-entrar-cuentas" data-i="3"><p class="c-entrar-e">Cuentas de ejemplo</p>` +
          [['laura', 'Laura Martí · agente'], ['montse', 'Montse Ribas · dirección']].map(([id, t]) =>
            `<button type="button" class="c-cuenta" data-accion="cuenta" data-de="${id}" aria-pressed="${elegida === id}">${VETA.av(id, 40)}<span class="c-cuenta-t">${esc(t)}</span><i class="c-cuenta-m">${VETA.ic('check', 20)}</i></button>`).join('') +
        `</div><div class="port-acc" data-i="4">${UI.boton({tipo: 'claro', texto: 'Entrar', accion: 'entrar'})}</div>` +
        `</div><p class="port-aviso">Ejemplo con datos inventados. No sale ningún mensaje.</p></div>`;
    },
    acciones: {
      cuenta(ev, el) {
        correo = CU()[el.dataset.de]; error = false;
        const i = document.getElementById('c-correo'); if (i) i.value = correo;
        const k = document.getElementById('c-clave-e'); if (k) k.value = 'ejemplo-veta';
        VETA.$$('.c-cuenta').forEach(b => b.setAttribute('aria-pressed', b === el));
        const e = document.querySelector('.c-entrar-err'); if (e) e.remove();
      },
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
        if (!c || c.value.replace(/\D/g, '').length !== 6) { c && c.focus(); VETA.aviso('El código tiene 6 cifras.'); return; }
        fin('montse');
      },
      otra() { paso = 1; error = false; VETA.repinta(); }
    }
  });
  function fin(id) { paso = 1; correo = null; error = false; VETA.cambiaPerfil(id); }
})();
