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
  // ronda 7 · arreglos (FC, defecto 10): cuatro filas con palabras llanas y lo demás dentro; fuera «Calendario».
  // En dirección, «Conexiones y ajustes» y «Tus avisos» (de Veta de la oficina y de Decidir, FD) cuelgan de aquí.
  const DIR_EXTRA = {conexiones: 'conexiones', avisos: 'avisos'};   // rutas de FD (ver ESTADO_R7_FD.md); si no existen, la línea no sale
  VETA.pantalla('A15', {
    titulo: 'Cuenta',
    frase: () => `${VETA.yo().nombre}. Qué leo, quién ve qué y la app. Toca una fila.`,
    pinta: () => {
      const yo = VETA.yo(), dir = yo.papel === 'direccion', desc = C.lee('desconectado', false), inicio = C.inicio();
      const caso = (t, o, sub) => `<button type="button" class="r7c-caso"${UI.attrs(o)}><span><b>${esc(t)}</b>${sub ? ' · ' + esc(sub) : ''}</span>${VETA.ic('chev', 16)}</button>`;
      const existe = r => { try { return !!VETA.MAPA && Object.values(VETA.MAPA).some(m => m.ruta === r); } catch (e) { return false; } };
      const x = dir ? null : VETA.dir.personaOps(yo.id);
      const arriba = desc ? UI.lineaHecho({texto: 'WhatsApp desconectado', hora: desc, boton: {texto: 'Deshacer', accion: 'reconecta'}, vt: 'c-confirma', i: 0})
        : confirma === 'desconectar' ? enSitio('¿Desconectar? Veta dejará de leer tus chats.', 'Desconectar', 'desconecta')
        : confirma === 'reinicio' ? enSitio('¿Volver a empezar? Se borra lo que has hecho en la demo.', 'Volver a empezar', 'reinicia') : '';
      return arriba + VETA.r7.lista([
        {icono: 'chat', nombre: 'Qué leo', pasa: desc ? 'Nada: WhatsApp desconectado' : C.lecturaTexto(), abre:
          caso('Chats que no leo', {ir: 'cuenta/chats'}) +
          (dir ? '' : caso('Lo que encontré en tus chats', {ir: 'mapa'})) +
          (dir ? '' : caso('Ver el primer día otra vez', {ir: 'primer-dia/0'})) +
          (dir && existe(DIR_EXTRA.conexiones) ? caso('Conexiones y ajustes', {ir: DIR_EXTRA.conexiones}) : '') +
          (desc ? '' : caso('Desconectar WhatsApp', {accion: 'pide-desconectar'}, 'dejo de leer tus chats'))},
        {icono: 'ojo', nombre: 'Quién ve qué', pasa: dir ? 'Los chats que dejas fuera, nadie' : 'Montse ve tu trabajo, no tus chats', abre:
          (dir ? '<p>Los chats que dejas fuera no los ve nadie.</p>'
            : `<p>Montse ve lo que llevas, lo pendiente y lo que hago por ti (${esc(x.total)} cosas la semana pasada). No ve tus chats ni tus notas.</p>`) +
          caso('Contraseña y código', {ir: 'cuenta/seguridad'}) +
          caso('Acuerdo de datos', {hoja: 'h29', datos: {texto: 'acuerdo'}}) +
          caso('Si dejas la agencia', {hoja: 'h29', datos: {texto: 'agencia'}})},
        {icono: 'paleta', nombre: 'La app', pasa: dir ? 'Idioma, cómo se ve y tus avisos' : 'Idioma, cómo se ve y qué hace Veta', abre:
          caso('Cambiar de idioma', {accion: 'idioma'}, 'English') +
          (dir ? '' : caso('Veta en un minuto', {ir: 'que-hace'})) +
          caso('Cómo se ve', {hoja: 'h26'}) +
          caso('Avisos en el móvil', {hoja: 'c-avisos'}, C.lee('avisos', false) ? 'sí' : 'no') +
          caso('Explicarme lo que toco', {accion: 'guia'}, VETA.guia.on() ? 'sí' : 'no') +
          (dir && existe(DIR_EXTRA.avisos) ? caso('Tus avisos', {ir: DIR_EXTRA.avisos}) : '') +
          (inicio === 'hecho' || inicio === 'ordenador' ? '' : caso('Ponerla en la pantalla de inicio', {hoja: 'h31'}))},
        {icono: 'entra', nombre: 'Salir o empezar de nuevo', pasa: 'Cerrar sesión o borrar lo hecho', abre:
          caso('Volver a empezar la demo', {accion: 'pide-reinicio'}, 'se borra lo que has hecho') +
          caso('Cerrar sesión', {accion: 'cierra-sesion'})}
      ], {i: 1}) + `<p class="pie" data-i="2">Ejemplo con datos inventados.</p>`;
    },
    acciones: {
      guia() { VETA.guia.pon(!VETA.guia.on()); VETA.repinta(); VETA.aviso(VETA.guia.on() ? 'Vale: te explico lo que tocas.' : 'Vale: ya no te lo explico.'); },
      idioma() { location.href = VETA.enlaceIngles(); },
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
  VETA.pantalla('A15b', {
    titulo: 'Chats que no leo',
    frase: () => `Estos ${C.fuera()} chats no los leo. Nadie los ve: ni tú en otras pantallas, ni dirección.`,
    pinta: () => {
      const dentro = C.dentro(), clientes = M.lee('chats-fuera', []).filter(id => !VETA.ajeno(id)), borr = C.lee('borrados', []);
      // cada chat en una fila; al tocarla, su botón (sin doble negación)
      const b = (t, o) => `<button type="button" class="r7c-caso"${UI.attrs(o)}><span><b>${esc(t)}</b></span>${VETA.ic('chev', 16)}</button>`;
      const filas = C.personales().map((n, k) => dentro.includes(n)
          ? {icono: 'chat', nombre: n, pasa: 'Lo vuelvo a leer', abre: b('Dejar fuera otra vez', {accion: 'personal', datos: {n: k}})}
          : {icono: 'candado', nombre: n, pasa: 'No lo leo · desde el 3 de septiembre', abre: b('Quitar de la lista: que lo lea', {accion: 'personal', datos: {n: k}})})
        .concat(clientes.map(id => ({cara: id, nombre: (M.quien(id) || {}).nombre || id, pasa: 'Cliente · no lo leo desde hoy', abre: b('Quitar de la lista: que lo lea', {accion: 'cliente', de: id})})));
      return borr.map(x => UI.lineaHecho({texto: `${x.nombre} · borrado antes del jueves 26`, hora: x.hora, hoja: 'h30', de: x.nombre})).join('') +
        VETA.r7.lista(filas.concat([{icono: 'mas', nombre: 'Añadir un chat a esta lista', hoja: 'c-anadir'}, {icono: 'borrar', nombre: 'Borrar un chat', pasa: 'Desaparece en 72 horas', hoja: 'h30'}]), {i: 0});
    },
    acciones: {
      personal(ev, el) {
        const n = C.personales()[Number(el.dataset.n)], entra = !C.dentro().includes(n);
        const d = C.dentro().filter(x => x !== n); if (entra) d.push(n); C.pon('dentro', d);
        VETA.repinta();
        VETA.aviso(entra ? `${n} sale de la lista. Veta vuelve a leerlo.` : `${n}: no lo leo otra vez.`, {deshacer: () => { C.pon('dentro', entra ? d.filter(x => x !== n) : d.concat(n)); VETA.repinta(); }});
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
    frase: 'Tu contraseña y un código al entrar, para que nadie entre con tu cuenta.',
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
        `<p class="pie" data-i="2">En esta demo no se guarda ninguna contraseña. Cerrar sesión está en Cuenta.</p>`;
    },
    acciones: {
      clave(ev, el) { clave = !clave; el.setAttribute('aria-expanded', clave); const c = document.getElementById('c-clave'); if (c) { c.hidden = !clave; if (clave) VETA.mov.cascada(c); } },
      'guarda-clave'() { clave = false; C.pon('claveCambiada', VETA.ahora()); VETA.repinta({hecho: 'c-clave'}); },
      'dos-pasos'(ev, el) { C.pon('dosPasos', el.getAttribute('aria-checked') === 'true'); }
    }
  });
})();
