/* Veta demo · pantallas · conexiones.js · paquete D (Dirección)
   G7 · Conexiones y ajustes · #/conexiones — qué escucha Veta (cinco interruptores), el piloto y la oficina. Sin botón principal.
   G7b · Qué ves tú y qué ve cada persona · #/confianza (lista; cada fila abre H29)
   G7c · Parte diario del piloto · #/piloto */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;
  const escucha = () => X.lee('escucha', {});                    // {id: false} = apagado

  VETA.pantalla('G7', {
    titulo: 'Conexiones y ajustes',
    frase: 'Lo que leo de la oficina. Enciende o apaga cada canal. Cada persona elige sus chats.',
    guia: ['Aquí ves qué leo de la oficina y cómo va el piloto.', 'Tú enciendes o apagas cada canal.', 'Así decides de dónde aprendo, y cada persona decide sus chats.'],
    pinta: () => {
      const e = escucha(), coste = M.lee('coste', null);
      // ronda 7 · D2: los interruptores arriba y, debajo, una lista con lo demás; sin títulos de sección (R2)
      let h = `<div class="lista d-interrs" data-i="0">${D.escucha.map(c => UI.interruptor({texto: c.texto, sub: c.sub, on: e[c.id] !== false, accion: 'escucha', de: c.id})).join('')}</div>`;
      h += VETA.r7.lista([
        // arreglo FD (defecto 2): «Lo último que he leído» venía de Veta (oficina); ahora vive aquí, en Cuenta
        {icono: 'reloj', nombre: 'Lo último que he leído', pasa: `Hoy, hasta las ${VETA.ahora(-3)}`, hoja: 'h04', datos: {quien: 'equipo'}},
        {icono: 'ojo', nombre: 'Qué ves tú y qué ve cada uno', pasa: 'Sus chats no los ves', ir: 'confianza'},
        {icono: 'papel', nombre: 'Parte diario del piloto', pasa: 'Hasta el 15 de diciembre', ir: 'piloto'},
        {icono: 'sello', nombre: 'Coste por hora', pasa: coste ? coste + ' € la hora' : 'Sin poner', hoja: 'h38'},
        {icono: 'escudo', nombre: 'Seguridad', pasa: 'Tu cuenta y tus datos', ir: 'cuenta/seguridad'}], {i: 1, clase: 'd2-mas-abajo'});
      return h;
    },
    acciones: {
      escucha(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true', c = D.escucha.find(x => x.id === id) || {texto: id};
        const t = escucha(); t[id] = on; X.guarda('escucha', t);
        if (!on) VETA.aviso('Dejo de leer ' + c.texto + '.', {deshacer: () => { const u = escucha(); u[id] = true; X.guarda('escucha', u); VETA.repinta(); }});
        else VETA.aviso('Veta vuelve a escuchar ' + c.texto + '.');
      }
    }
  });

  // ronda 6 · G7b · «Lo que ves tú · Lo que ve cada uno», en dos columnas (decisión de Manel, 21-nov: dirección ve nombres)
  const col = (si, no) => `<div class="d-ve-col"><ul class="d-ve-l">${si.map(t => `<li class="d-ve-si">${VETA.ic('check', 18)}<span>${esc(t)}</span></li>`).join('')}` +
    `${no.map(t => `<li class="d-ve-no">${VETA.ic('candado', 18)}<span>${esc(t)}</span></li>`).join('')}</ul></div>`;
  VETA.pantalla('G7b', {
    titulo: 'Qué ves tú y qué ve cada uno',
    frase: 'Ves cada operación y a cada persona, con su nombre. No ves sus chats. Nadie se compara.',
    guia: ['Aquí ves, lado a lado, lo que ves tú y lo que ve cada persona del equipo.', 'Tú abres cada punto de abajo para leerlo entero.', 'Así el equipo sabe qué se ve de su trabajo y qué no.'],
    // ronda 7 · D2: las dos columnas pasan a dos filas que se abren aquí mismo; todo en una lista (R2)
    pinta: () => VETA.r7.lista([
        {icono: 'ojo', nombre: 'Lo que ves tú', pasa: 'Cada operación y cada persona, sin sus chats', abre: col(['Cada operación: quién la lleva, cómo va, lo último que pasó y qué toca', 'Cada persona: lo que lleva, lo pendiente, cuánto tarda en contestar y lo que Veta hace por ella', 'Lo que el equipo hace a mano y le pide a Veta'],
          ['Lo que cada persona escribe con sus clientes', 'Sus notas, también las de sus visitas', 'Sus chats personales'])},
        {icono: 'equipo', nombre: 'Lo que ve cada uno', pasa: 'Lo suyo entero; de los demás, nada por dentro', abre: col(['Sus operaciones y sus clientes, enteros, con sus chats', 'Lo mismo que tú ves de ella, en su app', 'Lo que Veta ha aprendido de ella'],
          ['Las operaciones de los demás por dentro', 'Listas de quién vende más: no existen'])},
        {icono: 'ojo', nombre: 'Qué puedes ver y qué no', pasa: 'En palabras llanas', hoja: 'h29', datos: {texto: 'ver'}},
        {icono: 'escudo', nombre: 'Cómo cuida Veta los datos', pasa: 'Lo que firmamos, en corto', hoja: 'h29', datos: {texto: 'resumen'}},
        {icono: 'borrar', nombre: 'Qué se guarda y qué se borra', pasa: 'Y qué se ha borrado', hoja: 'h29', datos: {texto: 'borrado'}},
        {icono: 'libro', nombre: 'Qué se ha leído y qué ha salido', pasa: 'Para leerlo entero', hoja: 'h29', datos: {texto: 'leido'}},
        {icono: 'sello', nombre: 'Quién ha dicho que sí', pasa: VETA.c.lecturaTexto(), hoja: 'h29', datos: {texto: 'consentimientos'}}], {i: 0})
  });

  VETA.pantalla('G7c', {
    titulo: 'Parte diario del piloto',
    frase: 'Cada tarde te dejo el parte del día, hasta el 15 de diciembre, cuando acaba el piloto.',
    guia: ['Aquí Veta te deja cada tarde el parte del día, en texto llano.', 'Tú lo lees en un minuto.', 'Así sabes qué ha hecho Veta durante el piloto, día a día.'],
    pinta: () => `<div class="r7-ficha r7-oro" data-i="0"><span class="r7-ficha-de">Hoy · ${esc(D.fecha.hoyTexto)}</span>` +
      `<p>Lunes 23 de noviembre. Leídos 41 chats. Detectados 27 casos; preparados 22; completados 9 (a las 9:38). Esperan aprobación 19.</p></div>` +
      VETA.r7.lista([{icono: 'cal', nombre: 'Partes anteriores', pasa: 'Los cinco últimos días', hoja: 'd-partes'}], {i: 1, clase: 'd2-mas-abajo'})
  });
})();
