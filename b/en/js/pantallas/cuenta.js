/* Veta demo · pantallas · cuenta.js · paquete C (Veta, cuenta y entrada)
   - A15 · Cuenta y privacidad · #/cuenta
   - A15b · Chats que no leo · #/cuenta/chats
   - A15c · Seguridad · #/cuenta/seguridad */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  let confirma = null;              // 'reinicio' | 'desconectar': la confirmación en el sitio de A15

  const enSitio = (pregunta, si, accion) => `<div class="c-confirma" data-vt="c-confirma"><p>${esc(pregunta)}</p>` +
    UI.botones([{texto: si, accion, clase: 'c-peligro'}, {texto: 'Cancel', accion: 'cancela'}]) + '</div>';

  // ---- A15 · Cuenta y privacidad ----
  // ronda 7 · arreglos (FC, defecto 10): cuatro filas con palabras llanas y lo demás dentro; fuera “Calendario”.
  // En dirección, “Conexiones y ajustes” y “Tus avisos” (de Veta de la oficina y de Decidir, FD) cuelgan de aquí.
  const DIR_EXTRA = {conexiones: 'conexiones', avisos: 'avisos'};   // rutas de FD (ver ESTADO_R7_FD.md); si no existen, la línea no sale
  VETA.pantalla('A15', {
    titulo: 'Account',
    frase: () => `${VETA.yo().nombre}. What I read, who sees what, and the app. Tap a row.`,
    pinta: () => {
      const yo = VETA.yo(), dir = yo.papel === 'direccion', desc = C.lee('desconectado', false), inicio = C.inicio();
      const caso = (t, o, sub) => `<button type="button" class="r7c-caso"${UI.attrs(o)}><span><b>${esc(t)}</b>${sub ? ' · ' + esc(sub) : ''}</span>${VETA.ic('chev', 16)}</button>`;
      const existe = r => { try { return !!VETA.MAPA && Object.values(VETA.MAPA).some(m => m.ruta === r); } catch (e) { return false; } };
      const x = dir ? null : VETA.dir.personaOps(yo.id);
      const arriba = desc ? UI.lineaHecho({texto: 'WhatsApp disconnected', hora: desc, boton: {texto: 'Undo', accion: 'reconecta'}, vt: 'c-confirma', i: 0})
        : confirma === 'desconectar' ? enSitio('Disconnect? Veta will stop reading your chats.', 'Disconnect', 'desconecta')
        : confirma === 'reinicio' ? enSitio('Start again? What you have done in the demo is deleted.', 'Start again', 'reinicia') : '';
      return arriba + VETA.r7.lista([
        {icono: 'chat', nombre: 'What I read', pasa: desc ? 'Nothing: WhatsApp is disconnected' : C.lecturaTexto(), abre:
          caso('Chats I don\'t read', {ir: 'cuenta/chats'}) +
          (dir ? '' : caso('What I found in your chats', {ir: 'mapa'})) +
          (dir ? '' : caso('See the first day again', {ir: 'primer-dia/0'})) +
          (dir && existe(DIR_EXTRA.conexiones) ? caso('Connections and settings', {ir: DIR_EXTRA.conexiones}) : '') +
          (desc ? '' : caso('Disconnect WhatsApp', {accion: 'pide-desconectar'}, 'I stop reading your chats'))},
        {icono: 'ojo', nombre: 'Who sees what', pasa: dir ? 'The chats you leave out, no one' : 'Montse sees work, not your chats', abre:
          (dir ? '<p>No one sees the chats you leave out.</p>'
            : `<p>Montse sees what you handle, what is pending and what I do for you (${esc(x.total)} things last week). She does not see your chats or your notes.</p>`) +
          caso('Password and code', {ir: 'cuenta/seguridad'}) +
          caso('Data agreement', {hoja: 'h29', datos: {texto: 'acuerdo'}}) +
          caso('If you leave the agency', {hoja: 'h29', datos: {texto: 'agencia'}})},
        {icono: 'paleta', nombre: 'The app', pasa: dir ? 'Language, looks and your alerts' : 'Language, looks and what Veta does', abre:
          caso('Change language', {accion: 'idioma'}, 'English') +
          (dir ? '' : caso('Veta in one minute', {ir: 'que-hace'})) +
          caso('How it looks', {hoja: 'h26'}) +
          caso('Alerts on your phone', {hoja: 'c-avisos'}, C.lee('avisos', false) ? 'yes' : 'no') +
          caso('Explain what I tap', {accion: 'guia'}, VETA.guia.on() ? 'yes' : 'no') +
          (dir && existe(DIR_EXTRA.avisos) ? caso('Your alerts', {ir: DIR_EXTRA.avisos}) : '') +
          (inicio === 'hecho' || inicio === 'ordenador' ? '' : caso('Put it on the home screen', {hoja: 'h31'}))},
        {icono: 'entra', nombre: 'Sign out or start again', pasa: 'Sign out or delete what you did', abre:
          caso('Start the demo again', {accion: 'pide-reinicio'}, 'what you did is deleted') +
          caso('Sign out', {accion: 'cierra-sesion'})}
      ], {i: 1}) + `<p class="pie" data-i="2">Example with made-up data.</p>`;
    },
    acciones: {
      guia() { VETA.guia.pon(!VETA.guia.on()); VETA.repinta(); VETA.aviso(VETA.guia.on() ? 'OK: I explain what you tap.' : 'OK: I no longer explain it.'); },
      idioma() { location.href = VETA.enlaceIngles(); },
      'pide-reinicio'() { confirma = 'reinicio'; VETA.repinta({hecho: 'c-confirma'}); },
      'pide-desconectar'() { confirma = 'desconectar'; VETA.repinta({hecho: 'c-confirma'}); },
      cancela() { confirma = null; VETA.repinta({hecho: 'c-confirma'}); },
      reinicia() { confirma = null; VETA.est.borraTodo(); location.href = '../?nuevo'; },
      desconecta() { confirma = null; C.pon('desconectado', VETA.ahora()); VETA.repinta({hecho: 'c-confirma'}); },
      reconecta() { C.pon('desconectado', false); VETA.repinta({hecho: 'c-confirma'}); }
    }
  });

  // ---- A15b · Chats que no leo ----
  C.personales = () => M.lectura().fuera;
  VETA.pantalla('A15b', {
    titulo: 'Chats I don\'t read',
    frase: () => `I do not read these ${C.fuera()} chats. No one sees them: not you on other screens, and not management.`,
    pinta: () => {
      const dentro = C.dentro(), clientes = M.lee('chats-fuera', []).filter(id => !VETA.ajeno(id)), borr = C.lee('borrados', []);
      // cada chat en una fila; al tocarla, su botón (sin doble negación)
      const b = (t, o) => `<button type="button" class="r7c-caso"${UI.attrs(o)}><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
      const filas = C.personales().map((n, k) => dentro.includes(n)
          ? {icono: 'chat', nombre: n, pasa: 'I read it again', abre: b('Leave out again', {accion: 'personal', datos: {n: k}})}
          : {icono: 'candado', nombre: n, pasa: 'I do not read it · since 3 September', abre: b('Remove from the list: let Veta read it', {accion: 'personal', datos: {n: k}})})
        .concat(clientes.map(id => ({cara: id, nombre: (M.quien(id) || {}).nombre || id, pasa: 'Client · I have not read it since today', abre: b('Remove from the list: let Veta read it', {accion: 'cliente', de: id})})));
      return borr.map(x => UI.lineaHecho({texto: `${x.nombre} · deleted before Thursday 26`, hora: x.hora, hoja: 'h30', de: x.nombre})).join('') +
        VETA.r7.lista(filas.concat([{icono: 'mas', nombre: 'Add a chat to this list', hoja: 'c-anadir'}, {icono: 'borrar', nombre: 'Delete a chat', pasa: 'Disappears in 72 hours', hoja: 'h30'}]), {i: 0});
    },
    acciones: {
      personal(ev, el) {
        const n = C.personales()[Number(el.dataset.n)], entra = !C.dentro().includes(n);
        const d = C.dentro().filter(x => x !== n); if (entra) d.push(n); C.pon('dentro', d);
        VETA.repinta();
        VETA.aviso(entra ? `${n} is off the list. Veta reads it again.` : `${n}: I am not reading it again.`, {deshacer: () => { C.pon('dentro', entra ? d.filter(x => x !== n) : d.concat(n)); VETA.repinta(); }});
      },
      cliente(ev, el) {
        const id = el.dataset.de, nombre = (M.quien(id) || {}).nombre || id;
        M.pon('chats-fuera', M.lee('chats-fuera', []).filter(x => x !== id));
        setTimeout(() => { VETA.repinta(); VETA.aviso(`${nombre} is in. Veta reads it again.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }}); }, 220);
      }
    }
  });

  // ---- A15c · Seguridad ----
  let clave = false;
  VETA.pantalla('A15c', {
    titulo: 'Security',
    frase: 'Your password and a code when you sign in, so no one can get into your account.',
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion', hecha = C.lee('claveCambiada', null);
      const abrir = `<button type="button" class="fila" data-accion="clave" aria-expanded="${clave}" aria-controls="c-clave"><span class="fila-ic">${VETA.ic('candado', 22)}</span>` +
        `<span class="fila-c"><span class="fila-t">Change the password</span>${hecha ? `<span class="fila-s">Password changed · ${esc(hecha)}</span>` : ''}</span><span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>`;
      const caja = `<div id="c-clave" class="c-clave"${clave ? '' : ' hidden'}>` +
        UI.campo({etiqueta: 'Current password', tipo: 'password', id: 'c-k1'}) + UI.campo({etiqueta: 'New password', tipo: 'password', id: 'c-k2'}) +
        UI.campo({etiqueta: 'New one again', tipo: 'password', id: 'c-k3'}) + UI.boton({texto: 'Save the new password', accion: 'guarda-clave'}) + '</div>';
      return `<div class="lista" data-i="0">${abrir}${caja}</div>` +
        `<div class="lista" data-i="1">${dir ? UI.fila({titulo: 'Two-step check', sub: 'On · required for management', icono: 'escudo'})
          : UI.interruptor({texto: 'Two-step check', sub: 'I ask for a code from your app when you sign in', on: C.lee('dosPasos', false), accion: 'dos-pasos'})}</div>` +
        `<p class="pie" data-i="2">In this demo no password is saved. Sign out is in Account.</p>`;
    },
    acciones: {
      clave(ev, el) { clave = !clave; el.setAttribute('aria-expanded', clave); const c = document.getElementById('c-clave'); if (c) { c.hidden = !clave; if (clave) VETA.mov.cascada(c); } },
      'guarda-clave'() { clave = false; C.pon('claveCambiada', VETA.ahora()); VETA.repinta({hecho: 'c-clave'}); },
      'dos-pasos'(ev, el) { C.pon('dosPasos', el.getAttribute('aria-checked') === 'true'); }
    }
  });
})();
