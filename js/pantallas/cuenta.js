/* Veta demo · pantallas · cuenta.js · paquete C (Veta, cuenta y entrada)
   - A15 · Cuenta y privacidad · #/cuenta
   - A15b · Chats que no leo · #/cuenta/chats
   - A15c · Seguridad · #/cuenta/seguridad */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  let confirma = null;              // 'reinicio' | 'desconectar': la confirmación en el sitio de A15

  const enSitio = (pregunta, si, accion) => `<div class="c-confirma" data-vt="c-confirma"><p>${esc(pregunta)}</p>` +
    UI.botones([{texto: si, accion, clase: 'c-peligro'}, {texto: 'Cancelar', accion: 'cancela'}]) + '</div>';

  // ---- A15 · Cuenta y privacidad ----
  VETA.pantalla('A15', {
    titulo: 'Cuenta y privacidad',
    guia: ['Aquí decides qué lee Veta y cómo la ves.', 'Tú puedes dejar fuera cualquier chat o desconectar WhatsApp.', 'Así dirección no ve tus chats ni tus cifras.'],
    pinta: () => {
      const yo = VETA.yo(), desc = C.lee('desconectado', false), cal = C.calendario();
      const aspecto = `${VETA.tema.MODOS[VETA.tema.modo()]}, paleta ${VETA.tema.NOMBRES[VETA.tema.color()]}`;
      // «Tu acceso»: lo decide la cuenta (un acceso = una cuenta); solo informa, no se toca
      const acceso = yo.papel === 'direccion' ? 'Dirección y agente' : 'Agente', inicio = C.inicio();
      return `<div class="c-yo" data-i="0">${VETA.av(yo.id, 64)}<div><p class="c-yo-n">${esc(yo.nombre)}</p><p class="c-yo-p">${esc((VETA.datos.oficinas[yo.oficina] || {}).nombre || '')}</p>` +
          `<p class="c-yo-acc">Tu acceso: <b>${acceso}</b></p>${yo.papel === 'direccion' ? '<p class="c-yo-p">Lo decide quien administra la oficina al darte de alta.</p>' : ''}</div></div>` +
        UI.bloque({titulo: 'Lo que leo', i: 1, html: UI.lista([
          {titulo: 'Chats que no leo', sub: desc ? 'Desconectado · no leo nada' : C.lecturaTexto(), icono: 'chat', ir: 'cuenta/chats', g: 'Chats que no leo|Eliges qué chats quedan fuera.'},
          {titulo: 'Calendario', sub: cal ? cal + ' · leo tus citas' : 'sin conectar', icono: 'cal', hoja: 'h33'},
          {titulo: 'Acuerdo de datos', icono: 'doc', hoja: 'h29', datos: {texto: 'acuerdo'}},
          {titulo: 'Usarlo sin conexión', icono: 'wifi', hoja: 'h28'},
          {titulo: 'Si dejas la agencia', icono: 'escudo', hoja: 'h29', datos: {texto: 'agencia'}}])}) +
        UI.bloque({titulo: 'Tu cuenta · ' + yo.nombre, i: 2, html: UI.lista([
          {titulo: 'Aspecto', sub: aspecto, icono: 'paleta', hoja: 'h26'},
          UI.interruptor({texto: 'Guía', sub: 'explica lo que tocas', on: VETA.guia.on(), accion: 'guia'}),
          {titulo: 'Avisos', sub: C.lee('avisos', false) ? 'Permitidos' : 'Sin permitir', icono: 'campana', hoja: 'c-avisos'},
          {titulo: 'Seguridad', icono: 'candado', ir: 'cuenta/seguridad'},
          // el primer día y el mapa salen de los chats de Laura: en dirección no se enseñan
          yo.papel === 'direccion' ? null : {titulo: 'Ver el primer día otra vez', icono: 'play', ir: 'primer-dia/0'},
          yo.papel === 'direccion' ? null : {titulo: 'Mi mapa de trabajo', icono: 'mapa', ir: 'mapa'},
          // ya abierta desde el icono, o en ordenador: la fila no sale
          inicio === 'hecho' || inicio === 'ordenador' ? null : {titulo: 'Poner Veta en la pantalla de inicio', sub: 'Para abrirla como una app', icono: 'compartir', hoja: 'h31'}])}) +
        UI.bloque({titulo: 'Demo', i: 3, html: UI.lista([
          confirma === 'reinicio' ? enSitio('¿Volver a empezar? Se borra lo que has hecho en la demo.', 'Volver a empezar', 'reinicia') : {titulo: 'Volver a empezar la demo', icono: 'borrar', accion: 'pide-reinicio', chev: false}])}) +
        `<div class="c-salidas" data-i="4">` +
          (desc ? UI.lineaHecho({texto: 'WhatsApp desconectado', hora: desc, boton: {texto: 'Deshacer', accion: 'reconecta'}, vt: 'c-confirma'})
            : confirma === 'desconectar' ? enSitio('¿Desconectar? Veta dejará de leer tus chats.', 'Desconectar', 'desconecta')
            : UI.boton({tipo: 'texto', texto: 'Desconectar WhatsApp', accion: 'pide-desconectar', vt: 'c-confirma'})) +
          UI.boton({tipo: 'texto', texto: 'Cerrar sesión', accion: 'cierra-sesion', g: 'Cerrar sesión|Vuelves a la entrada; ahí entras con otra cuenta.'}) +
        `</div><p class="pie" data-i="4">Ejemplo con datos inventados.</p>`;
    },
    acciones: {
      guia(ev, el) { VETA.guia.pon(el.getAttribute('aria-checked') === 'true'); },
      'pide-reinicio'() { confirma = 'reinicio'; VETA.repinta({hecho: 'c-confirma'}); },
      'pide-desconectar'() { confirma = 'desconectar'; VETA.repinta({hecho: 'c-confirma'}); },
      cancela() { confirma = null; VETA.repinta({hecho: 'c-confirma'}); },
      reinicia() { confirma = null; location.href = location.pathname + '?nuevo#/portada'; },
      desconecta() { confirma = null; C.pon('desconectado', VETA.ahora()); VETA.repinta({hecho: 'c-confirma'}); },
      reconecta() { C.pon('desconectado', false); VETA.repinta({hecho: 'c-confirma'}); }
    }
  });

  // ---- A15b · Chats que no leo ----
  C.personales = () => M.lectura().fuera;
  const intro = () => `Leo ${VETA.num(C.leidos())} chats de trabajo. ${C.fuera() === 1 ? 'Este no lo leo ni sale' : `Estos ${C.fuera()} no los leo ni salen`} en ninguna pantalla más que en esta.`;
  VETA.pantalla('A15b', {
    titulo: 'Chats que no leo',
    guia: ['Aquí están los chats que Veta no lee.', 'Tú metes o sacas un chat con un toque.', 'Así lo personal no sale en ninguna pantalla.'],
    pinta: () => {
      const dentro = C.dentro(), clientes = M.lee('chats-fuera', []).filter(id => !VETA.ajeno(id)), borr = C.lee('borrados', []);
      // una lista sin interruptores: cada chat con su «Quitar de la lista» (sin doble negación)
      const fila = (titulo, sub, boton) => `<div class="c-chat-f">${UI.fila({titulo, sub, icono: 'candado'})}${UI.boton(Object.assign({tipo: 'texto', ancho: false}, boton))}</div>`;
      const filas = C.personales().map((n, k) => dentro.includes(n)
          ? fila(n, 'Lo vuelvo a leer', {texto: 'Dejar fuera otra vez', accion: 'personal', datos: {n: k}})
          : fila(n, 'Fuera desde el 3 de octubre', {texto: 'Quitar de la lista', accion: 'personal', datos: {n: k}}))
        .concat(clientes.map(id => fila((M.quien(id) || {}).nombre || id, 'Cliente · fuera desde hoy', {texto: 'Quitar de la lista', accion: 'cliente', de: id})));
      return `<p class="intro" id="c-intro-chats" data-i="0">${esc(intro())}</p>` +
        `<div class="lista c-chats" data-i="1">${filas.join('')}</div>` +
        UI.lista([{titulo: 'Añadir un chat a esta lista', icono: 'mas', hoja: 'c-anadir'}, {titulo: 'Borrar un chat', icono: 'borrar', hoja: 'h30'}], {i: 2}) +
        (borr.length ? UI.bloque({titulo: 'Borrados pedidos', i: 3, html: borr.map(b => UI.lineaHecho({texto: `${b.nombre} · borrado completo antes del jueves 26`, hora: b.hora, hoja: 'h30', de: b.nombre})).join('')}) : '') +
        UI.nota({texto: 'Lo que dejas fuera no lo ve nadie: ni tú en otras pantallas, ni dirección.', icono: 'candado', clase: 'nota-gris'});
    },
    acciones: {
      personal(ev, el) {
        const n = C.personales()[Number(el.dataset.n)], entra = !C.dentro().includes(n);
        const d = C.dentro().filter(x => x !== n); if (entra) d.push(n); C.pon('dentro', d);
        VETA.repinta();
        VETA.aviso(entra ? `${n} sale de la lista. Veta vuelve a leerlo.` : `${n} queda fuera otra vez.`, {deshacer: () => { C.pon('dentro', entra ? d.filter(x => x !== n) : d.concat(n)); VETA.repinta(); }});
      },
      cliente(ev, el) {
        const id = el.dataset.de, nombre = (M.quien(id) || {}).nombre || id;
        M.pon('chats-fuera', M.lee('chats-fuera', []).filter(x => x !== id));
        setTimeout(() => { VETA.repinta(); VETA.aviso(`${nombre} entra. Veta vuelve a leerlo.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }}); }, 220);
      }
    }
  });

  // ---- A15c · Seguridad ----
  let clave = false;
  VETA.pantalla('A15c', {
    titulo: 'Seguridad',
    guia: ['Aquí cambias la contraseña y la verificación en dos pasos.', 'Tú decides; en dirección los dos pasos son obligatorios.', 'Así nadie entra con tu cuenta desde otro móvil.'],
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion', hecha = C.lee('claveCambiada', null);
      const abrir = `<button type="button" class="fila" data-accion="clave" aria-expanded="${clave}" aria-controls="c-clave"><span class="fila-ic">${VETA.ic('candado', 22)}</span>` +
        `<span class="fila-c"><span class="fila-t">Cambiar la contraseña</span>${hecha ? `<span class="fila-s">Contraseña cambiada · ${esc(hecha)}</span>` : ''}</span><span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>`;
      const caja = `<div id="c-clave" class="c-clave"${clave ? '' : ' hidden'}>` +
        UI.campo({etiqueta: 'Contraseña de ahora', tipo: 'password', id: 'c-k1'}) + UI.campo({etiqueta: 'Contraseña nueva', tipo: 'password', id: 'c-k2'}) +
        UI.campo({etiqueta: 'Otra vez la nueva', tipo: 'password', id: 'c-k3'}) + UI.boton({texto: 'Guardar la contraseña nueva', accion: 'guarda-clave'}) + '</div>';
      return `<div class="lista" data-i="0">${abrir}${caja}</div>` +
        `<div class="lista" data-i="1">${dir ? UI.fila({titulo: 'Verificación en dos pasos', sub: 'Activada · obligatoria para dirección', icono: 'escudo'})
          : UI.interruptor({texto: 'Verificación en dos pasos', sub: 'Te pido un código de tu app al entrar', on: C.lee('dosPasos', false), accion: 'dos-pasos'})}</div>` +
        UI.lista([{titulo: 'Cerrar sesión en este móvil', icono: 'entra', accion: 'cierra-sesion'}], {i: 2}) +
        UI.nota({texto: 'En esta demo no se guarda ninguna contraseña.', icono: 'info', clase: 'nota-gris'});
    },
    acciones: {
      clave(ev, el) { clave = !clave; el.setAttribute('aria-expanded', clave); const c = document.getElementById('c-clave'); if (c) { c.hidden = !clave; if (clave) VETA.mov.cascada(c); } },
      'guarda-clave'() { clave = false; C.pon('claveCambiada', VETA.ahora()); VETA.repinta({hecho: 'c-clave'}); },
      'dos-pasos'(ev, el) { C.pon('dosPasos', el.getAttribute('aria-checked') === 'true'); }
    }
  });
})();
