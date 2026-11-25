/* Veta demo · pantallas · cuenta.js · carril C (Veta y cuenta)
   - A15 · Cuenta · #/cuenta   (lista agrupada de una línea; se entra por tu cara, arriba a la derecha del Inicio)
   - A15b · Chats que no leo · #/cuenta/chats
   - A15c · Seguridad · #/cuenta/seguridad
   Lo que antes se desplegaba en el sitio ahora abre una hoja (js/hojas/veta.js): c-confirma (desconectar, volver a empezar),
   c-lee («Lo que dirección ve de ti»), c-chat (un chat de la lista), c-anadir, c-avisos, h26, h28, h29, h30, h31. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, C = VETA.c;
  const R7 = () => VETA.r7;
  const existe = r => { try { return !!VETA.MAPA && Object.values(VETA.MAPA).some(m => m.ruta === r); } catch (e) { return false; } };

  // ---- A15 · Cuenta ----
  // «Tu acceso» lo decide la cuenta (un acceso = una cuenta): va en el subtítulo, con tu nombre y tu oficina.
  // En dirección, «Conexiones y ajustes» y «Tus avisos» cuelgan de aquí; el primer día y el mapa salen de los chats de la agente.
  VETA.pantalla('A15', {
    titulo: 'Cuenta',
    sub: () => { const yo = VETA.yo(), acceso = yo.papel === 'direccion' ? 'Dirección y agente' : 'Agente'; return `${yo.nombre} · ${acceso} · oficina de ${(VETA.datos.oficinas[yo.oficina] || {}).nombre || ''}`; },
    pinta: () => {
      const R = R7(), dir = VETA.yo().papel === 'direccion', desc = C.lee('desconectado', false), inicio = C.inicio();
      return (desc ? R.hecho({texto: 'WhatsApp desconectado', hora: desc, deshacer: 'reconecta', vt: 'c-confirma'}) : '') +
        R.lista([{nombre: 'Cómo funciona Veta', ir: 'que-hace'}], {i: 1}) +
        R.lista([
          {nombre: 'Chats que no leo', dato: C.fuera(), ir: 'cuenta/chats'},
          dir ? null : {nombre: 'Lo que encontré en tus chats', ir: 'mapa'},
          dir ? null : {nombre: 'Ver el primer día', ir: 'primer-dia/0'},
          dir && existe('conexiones') ? {nombre: 'Conexiones y ajustes', ir: 'conexiones'} : null,
          desc ? null : {nombre: 'Desconectar WhatsApp', hoja: 'c-confirma', datos: {que: 'desconectar'}}
        ], {rotulo: 'Qué leo', i: 2}) +
        R.lista([
          dir ? null : {nombre: 'Lo que dirección ve de ti', hoja: 'c-lee', datos: {que: 'direccion-ve'}},
          {nombre: 'Contraseña y código', ir: 'cuenta/seguridad'},
          {nombre: 'Acuerdo de datos', hoja: 'h29', datos: {texto: 'acuerdo'}},
          {nombre: 'Si dejas la agencia', hoja: 'h29', datos: {texto: 'agencia'}}
        ], {rotulo: 'Quién ve qué', i: 3}) +
        R.lista([
          {nombre: 'Idioma', dato: 'Castellano', accion: 'idioma'},
          {nombre: 'Cómo se ve', hoja: 'h26'},
          {nombre: 'Avisos en el móvil', dato: C.lee('avisos', false) ? 'Sí' : 'No', hoja: 'c-avisos'},
          dir && existe('avisos') ? {nombre: 'Tus avisos', ir: 'avisos'} : null,
          {nombre: 'Usarlo sin conexión', hoja: 'h28'},
          inicio === 'hecho' || inicio === 'ordenador' ? null : {nombre: 'Ponerla en la pantalla de inicio', hoja: 'h31'}
        ], {rotulo: 'La app', i: 4}) +
        R.lista([
          {nombre: 'Volver a empezar', hoja: 'c-confirma', datos: {que: 'reinicio'}},
          {nombre: 'Cerrar sesión', accion: 'cierra-sesion'}
        ], {rotulo: 'Salir', i: 5});
    },
    acciones: {
      idioma() { location.href = VETA.enlaceIngles(); },
      reconecta() { C.pon('desconectado', false); VETA.repinta({hecho: 'c-confirma'}); }
    }
  });
  // lo que confirma la hoja c-confirma
  C.desconecta = () => { C.pon('desconectado', VETA.ahora()); VETA.repinta({hecho: 'c-confirma'}); };
  C.reinicia = () => { location.href = location.pathname + '?nuevo#/portada'; };

  // ---- A15b · Chats que no leo ----
  // cada chat, una fila de una línea que abre su hoja (c-chat). Los personales que vuelves a dejar leer siguen aquí, con «Lo leo»
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
      // el cliente sale de la lista: su fila se va y el aviso es la única confirmación, con «Deshacer»
      VETA.mov.seVa(`.r7-fila[data-cliente="${x.cliente}"]`, () => {
        M.pon('chats-fuera', M.lee('chats-fuera', []).filter(id => id !== x.cliente));
        VETA.repinta(); VETA.aviso(`${x.nombre} entra. Veta vuelve a leerlo.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }});
      });
      return;
    }
    const entra = !x.leo, l = C.dentro().filter(y => y !== x.n); if (entra) l.push(x.n); C.pon('dentro', l);
    VETA.repinta();
    VETA.aviso(entra ? `${x.n} sale de la lista. Veta vuelve a leerlo.` : `${x.n}: no lo leo otra vez.`, {deshacer: () => { C.pon('dentro', entra ? l.filter(y => y !== x.n) : l.concat(x.n)); VETA.repinta(); }});
  };
  VETA.pantalla('A15b', {
    titulo: 'Chats que no leo',
    sub: 'No los leo y no los ve nadie.',
    pinta: () => {
      const dentro = C.dentro(), borr = C.lee('borrados', []);
      const filas = personales().map((n, k) => ({nombre: n, dato: dentro.includes(n) ? 'Lo leo' : null, hoja: 'c-chat', datos: {n: k}}))
        .concat(fueraClientes().map(id => ({nombre: (M.quien(id) || {}).nombre || id, dato: 'Cliente', hoja: 'c-chat', datos: {cliente: id}})));
      return borr.map(x => R7().hecho({texto: `${x.nombre} · borrado pedido`, hora: x.hora, hoja: 'h30', de: x.nombre})).join('') +
        R7().lista(filas, {i: 0}) + R7().enlace({texto: 'Borrar un chat', hoja: 'h30', i: 1});
    },
    botonFijo: () => R7().botones({texto: 'Añadir un chat', hoja: 'c-anadir'})
  });

  // ---- A15c · Seguridad ----
  VETA.pantalla('A15c', {
    titulo: 'Seguridad',
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion', hecha = C.lee('claveCambiada', null);
      return (hecha ? R7().hecho({texto: 'Contraseña cambiada', hora: hecha, vt: 'c-clave'}) : '') +
        `<div class="r7c-campos" data-i="1">` + UI.campo({etiqueta: 'Contraseña de ahora', tipo: 'password', id: 'c-k1'}) + UI.campo({etiqueta: 'Contraseña nueva', tipo: 'password', id: 'c-k2'}) +
        UI.campo({etiqueta: 'Otra vez la nueva', tipo: 'password', id: 'c-k3'}) + '</div>' +
        R7().lista([dir ? {nombre: 'Código al entrar', pasa: 'Obligatorio para dirección', dato: 'Activado'}
          : UI.interruptor({texto: 'Pedirme un código al entrar', on: C.lee('dosPasos', false), accion: 'dos-pasos'})], {i: 2});
    },
    botonFijo: () => R7().botones({texto: 'Guardar la contraseña', accion: 'guarda-clave'}),
    acciones: {
      'guarda-clave'() {
        const k = document.getElementById('c-k2');
        if (k && !k.value) { k.focus(); VETA.aviso('Escribe primero la contraseña nueva.'); return; }
        C.pon('claveCambiada', VETA.ahora()); VETA.repinta({hecho: 'c-clave'});
      },
      'dos-pasos'(ev, el) { C.pon('dosPasos', el.getAttribute('aria-checked') === 'true'); }
    }
  });
})();
