/* Veta demo · pantallas · cuenta.js · carril C (Veta y cuenta)
   - A15 · Cuenta · #/cuenta   (lista agrupada de una línea; se entra por tu cara, arriba a la derecha del Inicio)
   - A15b · Chats que no leo · #/cuenta/chats
   - A15c · Seguridad · #/cuenta/seguridad
   Lo que antes se desplegaba en el sitio ahora abre una hoja (js/hojas/veta.js): c-confirma (desconectar, volver a empezar),
   c-lee (“Lo que dirección ve de ti”), c-chat (un chat de la lista), c-anadir, c-avisos, h26, h28, h29, h30, h31, h33. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, C = VETA.c;
  const R7 = () => VETA.r7;
  const existe = r => { try { return !!VETA.MAPA && Object.values(VETA.MAPA).some(m => m.ruta === r); } catch (e) { return false; } };

  // ---- A15 · Cuenta ----
  // “Tu acceso” lo decide la cuenta (un acceso = una cuenta): va en el subtítulo, con tu nombre y tu oficina.
  // En dirección, “Conexiones y ajustes” y “Tus avisos” cuelgan de aquí; el primer día y el mapa salen de los chats de la agente.
  VETA.pantalla('A15', {
    titulo: 'Account',
    sub: () => { const yo = VETA.yo(), acceso = yo.papel === 'direccion' ? 'Management and agent' : 'Agent'; return `${yo.nombre} · ${acceso} · ${(VETA.datos.oficinas[yo.oficina] || {}).nombre || ''} office`; },
    pinta: () => {
      const R = R7(), dir = VETA.yo().papel === 'direccion', desc = C.lee('desconectado', false), inicio = C.inicio();
      return (desc ? UI.lineaHecho({texto: 'WhatsApp disconnected', hora: desc, boton: {texto: 'Undo', accion: 'reconecta'}, vt: 'c-confirma', i: 0}) : '') +
        R.lista([{nombre: 'How Veta works', ir: 'que-hace'}], {i: 1}) +
        R.lista([
          {nombre: 'Chats I don\'t read', dato: C.fuera(), ir: 'cuenta/chats'},
          {nombre: 'Calendar', dato: C.calendario() || 'Not connected', hoja: 'h33'},
          dir ? null : {nombre: 'What I found in your chats', ir: 'mapa'},
          dir ? null : {nombre: 'See the first day', ir: 'primer-dia/0'},
          dir && existe('conexiones') ? {nombre: 'Connections and settings', ir: 'conexiones'} : null,
          desc ? null : {nombre: 'Disconnect WhatsApp', hoja: 'c-confirma', datos: {que: 'desconectar'}}
        ], {rotulo: 'What I read', i: 2}) +
        R.lista([
          dir ? null : {nombre: 'What management sees', hoja: 'c-lee', datos: {que: 'direccion-ve'}},
          {nombre: 'Password and code', ir: 'cuenta/seguridad'},
          {nombre: 'Data agreement', hoja: 'h29', datos: {texto: 'acuerdo'}},
          {nombre: 'If you leave the agency', hoja: 'h29', datos: {texto: 'agencia'}}
        ], {rotulo: 'Who sees what', i: 3}) +
        R.lista([
          {nombre: 'Language', dato: 'English', accion: 'idioma'},
          {nombre: 'How it looks', hoja: 'h26'},
          {nombre: 'Alerts on your phone', dato: C.lee('avisos', false) ? 'Yes' : 'No', hoja: 'c-avisos'},
          dir && existe('avisos') ? {nombre: 'Your alerts', ir: 'avisos'} : null,
          {nombre: 'Use it offline', hoja: 'h28'},
          inicio === 'hecho' || inicio === 'ordenador' ? null : {nombre: 'Put it on the home screen', hoja: 'h31'}
        ], {rotulo: 'The app', i: 4}) +
        R.lista([
          {nombre: 'Start again', hoja: 'c-confirma', datos: {que: 'reinicio'}},
          {nombre: 'Sign out', accion: 'cierra-sesion'}
        ], {rotulo: 'Sign out', i: 5});
    },
    acciones: {
      idioma() { location.href = VETA.enlaceIngles(); },
      reconecta() { C.pon('desconectado', false); VETA.repinta({hecho: 'c-confirma'}); }
    }
  });
  // lo que confirma la hoja c-confirma
  C.desconecta = () => { C.pon('desconectado', VETA.ahora()); VETA.repinta({hecho: 'c-confirma'}); };
  C.reinicia = () => { VETA.est.borraTodo(); location.href = '../?nuevo'; };

  // ---- A15b · Chats que no leo ----
  // cada chat, una fila de una línea que abre su hoja (c-chat). Los personales que vuelves a dejar leer siguen aquí, con “Lo leo”
  const personales = () => M.lectura().fuera;
  const fueraClientes = () => M.lee('chats-fuera', []).filter(id => !VETA.ajeno(id));
  C.chat = d => {
    if (d.cliente) return {cliente: d.cliente, nombre: (M.quien(d.cliente) || {}).nombre || d.cliente, leo: false};
    const n = personales()[Number(d.n)]; return n ? {n, nombre: n, leo: C.dentro().includes(n)} : null;
  };
  // sacar un chat de la lista (Veta vuelve a leerlo) o dejarlo fuera otra vez
  C.cambiaChat = d => {
    const x = C.chat(d); if (!x) return;
    if (x.cliente) {
      M.pon('chats-fuera', M.lee('chats-fuera', []).filter(id => id !== x.cliente));
      VETA.repinta(); VETA.aviso(`${x.nombre} is in. Veta reads it again.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }});
      return;
    }
    const entra = !x.leo, l = C.dentro().filter(y => y !== x.n); if (entra) l.push(x.n); C.pon('dentro', l);
    VETA.repinta();
    VETA.aviso(entra ? `${x.n} is off the list. Veta reads it again.` : `${x.n}: I am not reading it again.`, {deshacer: () => { C.pon('dentro', entra ? l.filter(y => y !== x.n) : l.concat(x.n)); VETA.repinta(); }});
  };
  VETA.pantalla('A15b', {
    titulo: 'Chats I don\'t read',
    sub: 'I don\'t read them. No one else sees them either.',
    pinta: () => {
      const dentro = C.dentro(), borr = C.lee('borrados', []);
      const filas = personales().map((n, k) => ({nombre: n, dato: dentro.includes(n) ? 'I read it' : null, hoja: 'c-chat', datos: {n: k}}))
        .concat(fueraClientes().map(id => ({nombre: (M.quien(id) || {}).nombre || id, dato: 'Client', hoja: 'c-chat', datos: {cliente: id}})));
      return borr.map(x => UI.lineaHecho({texto: `${x.nombre} · deleted before Thursday 26`, hora: x.hora, hoja: 'h30', de: x.nombre})).join('') +
        R7().lista(filas, {i: 0}) + R7().enlace({texto: 'Delete a chat', hoja: 'h30', i: 1});
    },
    botonFijo: () => R7().botones({texto: 'Add a chat', hoja: 'c-anadir'})
  });

  // ---- A15c · Seguridad ----
  VETA.pantalla('A15c', {
    titulo: 'Security',
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion', hecha = C.lee('claveCambiada', null);
      return (hecha ? UI.lineaHecho({texto: 'Password changed', hora: hecha, vt: 'c-clave', i: 0}) : '') +
        `<div class="r7c-campos" data-i="1">` + UI.campo({etiqueta: 'Current password', tipo: 'password', id: 'c-k1'}) + UI.campo({etiqueta: 'New password', tipo: 'password', id: 'c-k2'}) +
        UI.campo({etiqueta: 'New one again', tipo: 'password', id: 'c-k3'}) + '</div>' +
        R7().lista([dir ? {nombre: 'Code at sign-in', pasa: 'Required for management', dato: 'On'}
          : UI.interruptor({texto: 'Ask me for a code at sign-in', on: C.lee('dosPasos', false), accion: 'dos-pasos'})], {i: 2});
    },
    botonFijo: () => R7().botones({texto: 'Save the password', accion: 'guarda-clave'}),
    acciones: {
      'guarda-clave'() {
        const k = document.getElementById('c-k2');
        if (k && !k.value) { k.focus(); VETA.aviso('Type the new password first.'); return; }
        C.pon('claveCambiada', VETA.ahora()); VETA.repinta({hecho: 'c-clave'});
      },
      'dos-pasos'(ev, el) { C.pon('dosPasos', el.getAttribute('aria-checked') === 'true'); }
    }
  });
})();
