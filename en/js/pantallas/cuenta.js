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
  VETA.pantalla('A15', {
    titulo: 'Account and privacy',
    guia: ['Here you decide what Veta reads and how you see it.', 'You can leave out any chat or disconnect WhatsApp.', 'This way you know what management sees about you and what it does not.'],
    pinta: () => {
      const yo = VETA.yo(), desc = C.lee('desconectado', false), cal = C.calendario();
      const aspecto = `${VETA.tema.MODOS[VETA.tema.modo()]}, ${VETA.tema.NOMBRES[VETA.tema.color()]} palette`;
      // “Tu acceso”: lo decide la cuenta (un acceso = una cuenta); solo informa, no se toca
      const acceso = yo.papel === 'direccion' ? 'Management and agent' : 'Agent', inicio = C.inicio();
      return `<div class="c-yo" data-i="0">${VETA.av(yo.id, 64)}<div><p class="c-yo-n">${esc(yo.nombre)}</p><p class="c-yo-p">${esc((VETA.datos.oficinas[yo.oficina] || {}).nombre || '')}</p>` +
          `<p class="c-yo-acc">Your access: <b>${acceso}</b></p>${yo.papel === 'direccion' ? '<p class="c-yo-p">Whoever runs the office decides it when they add you.</p>' : ''}</div></div>` +
        UI.bloque({titulo: 'What I read', i: 1, html: UI.lista([
          {titulo: 'Chats I don\'t read', sub: desc ? 'Disconnected · I read nothing' : C.lecturaTexto(), icono: 'chat', ir: 'cuenta/chats', g: 'Chats I do not read|You choose which chats I do not read.'},
          {titulo: 'Calendar', sub: cal ? cal + ' · I read your appointments' : 'not connected', icono: 'cal', hoja: 'h33'},
          {titulo: 'Data agreement', icono: 'doc', hoja: 'h29', datos: {texto: 'acuerdo'}},
          {titulo: 'Use it without a connection', icono: 'wifi', hoja: 'h28'},
          {titulo: 'If you leave the agency', icono: 'escudo', hoja: 'h29', datos: {texto: 'agencia'}}])}) +
        (yo.papel === 'direccion' ? '' : C.direccionVe(2)) +
        UI.bloque({titulo: 'Your account · ' + yo.nombre, i: 2, html: UI.lista([
          {titulo: 'Appearance', sub: aspecto, icono: 'paleta', hoja: 'h26'},
          UI.interruptor({texto: 'Guide', sub: 'explains what you touch', on: VETA.guia.on(), accion: 'guia'}),
          {titulo: 'Alerts', sub: C.lee('avisos', false) ? 'Allowed' : 'Not allowed', icono: 'campana', hoja: 'c-avisos'},
          {titulo: 'Security', icono: 'candado', ir: 'cuenta/seguridad'},
          // el primer día y el mapa salen de los chats de Laura: en dirección no se enseñan
          yo.papel === 'direccion' ? null : {titulo: 'See the first day again', icono: 'play', ir: 'primer-dia/0'},
          yo.papel === 'direccion' ? null : {titulo: 'What Veta does', sub: 'All I do for you', icono: 'aprende', ir: 'que-hace'},
          yo.papel === 'direccion' ? null : {titulo: 'My work map', icono: 'mapa', ir: 'mapa'},
          // ya abierta desde el icono, o en ordenador: la fila no sale
          inicio === 'hecho' || inicio === 'ordenador' ? null : {titulo: 'Add Veta to your home screen', sub: 'To open it like an app', icono: 'compartir', hoja: 'h31'}])}) +
        UI.bloque({titulo: 'Demo', i: 3, html: UI.lista([
          confirma === 'reinicio' ? enSitio('Start again? What you have done in the demo is deleted.', 'Start again', 'reinicia') : {titulo: 'Start the demo again', icono: 'borrar', accion: 'pide-reinicio', chev: false}])}) +
        `<div class="c-salidas" data-i="4">` +
          (desc ? UI.lineaHecho({texto: 'WhatsApp disconnected', hora: desc, boton: {texto: 'Undo', accion: 'reconecta'}, vt: 'c-confirma'})
            : confirma === 'desconectar' ? enSitio('Disconnect? Veta will stop reading your chats.', 'Disconnect', 'desconecta')
            : UI.boton({tipo: 'texto', texto: 'Disconnect WhatsApp', accion: 'pide-desconectar', vt: 'c-confirma'})) +
          UI.boton({tipo: 'texto', texto: 'Sign out', accion: 'cierra-sesion', g: 'Sign out|You go back to the sign-in page; there you sign in with another account.'}) +
        `</div><p class="pie" data-i="4">Example with made-up data.</p>`;
    },
    acciones: {
      guia(ev, el) { VETA.guia.pon(el.getAttribute('aria-checked') === 'true'); },
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
  const intro = () => `I read ${VETA.num(C.leidos())} work chats. ${C.fuera() === 1 ? 'I do not read this one and it does not show' : `I do not read these ${C.fuera()} and they do not show`} on any screen other than this one.`;
  VETA.pantalla('A15b', {
    titulo: 'Chats I don\'t read',
    guia: ['Here are the chats Veta does not read.', 'You put a chat in or take it out with one tap.', 'This way personal things do not show on any screen.'],
    pinta: () => {
      const dentro = C.dentro(), clientes = M.lee('chats-fuera', []).filter(id => !VETA.ajeno(id)), borr = C.lee('borrados', []);
      // una lista sin interruptores: cada chat con su “Quitar de la lista” (sin doble negación)
      const fila = (titulo, sub, boton) => `<div class="c-chat-f">${UI.fila({titulo, sub, icono: 'candado'})}${UI.boton(Object.assign({tipo: 'texto', ancho: false}, boton))}</div>`;
      const filas = C.personales().map((n, k) => dentro.includes(n)
          ? fila(n, 'I read it again', {texto: 'Leave out again', accion: 'personal', datos: {n: k}})
          : fila(n, 'I do not read it · since 3 September', {texto: 'Take off the list', accion: 'personal', datos: {n: k}}))
        .concat(clientes.map(id => fila((M.quien(id) || {}).nombre || id, 'Client · I have not read it since today', {texto: 'Take off the list', accion: 'cliente', de: id})));
      return `<p class="intro" id="c-intro-chats" data-i="0">${esc(intro())}</p>` +
        `<div class="lista c-chats" data-i="1">${filas.join('')}</div>` +
        UI.lista([{titulo: 'Add a chat to this list', icono: 'mas', hoja: 'c-anadir'}, {titulo: 'Delete a chat', icono: 'borrar', hoja: 'h30'}], {i: 2}) +
        (borr.length ? UI.bloque({titulo: 'Deletions asked for', i: 3, html: borr.map(b => UI.lineaHecho({texto: `${b.nombre} · fully deleted before Thursday 26`, hora: b.hora, hoja: 'h30', de: b.nombre})).join('')}) : '') +
        UI.nota({texto: 'Nobody sees what you leave out: not you on other screens, and not management.', icono: 'candado', clase: 'nota-gris'});
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
    guia: ['Here you change the password and the two-step check.', 'You decide; for management the two steps are required.', 'This way nobody gets in with your account from another phone.'],
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
        UI.lista([{titulo: 'Sign out on this phone', icono: 'entra', accion: 'cierra-sesion'}], {i: 2}) +
        UI.nota({texto: 'This demo does not save any password.', icono: 'info', clase: 'nota-gris'});
    },
    acciones: {
      clave(ev, el) { clave = !clave; el.setAttribute('aria-expanded', clave); const c = document.getElementById('c-clave'); if (c) { c.hidden = !clave; if (clave) VETA.mov.cascada(c); } },
      'guarda-clave'() { clave = false; C.pon('claveCambiada', VETA.ahora()); VETA.repinta({hecho: 'c-clave'}); },
      'dos-pasos'(ev, el) { C.pon('dosPasos', el.getAttribute('aria-checked') === 'true'); }
    }
  });
})();
