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
    guia: ['Aquí ves qué leo de la oficina y cómo va el piloto.', 'Tú enciendes o apagas cada canal.', 'Así decides de dónde aprendo, y cada persona decide sus chats.'],
    pinta: () => {
      const e = escucha(), coste = M.lee('coste', null);
      let h = UI.bloque({titulo: 'Lo que leo', i: 0, html: `<div class="lista d-interrs">${D.escucha.map(c => UI.interruptor({texto: c.texto, sub: c.sub, on: e[c.id] !== false, accion: 'escucha', de: c.id})).join('')}</div>` +
        UI.nota({texto: 'Cada persona elige qué chats deja fuera. Tú no los ves.', icono: 'candado'})});
      h += UI.bloque({titulo: 'Mientras dure el piloto', i: 1, html: UI.lista([
        {titulo: 'Parte diario del piloto', sub: 'hasta el 15 de diciembre', icono: 'papel', ir: 'piloto'}])});
      h += UI.bloque({titulo: 'La oficina', i: 2, html: UI.lista([
        {titulo: 'Qué ves tú y qué ve cada persona', icono: 'ojo', ir: 'confianza'},
        {titulo: 'Coste por hora', sub: coste ? coste + ' € la hora' : 'sin poner', icono: 'sello', hoja: 'h38'},
        {titulo: 'Seguridad', icono: 'escudo', ir: 'cuenta/seguridad'}])});
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
  const col = (titulo, si, no) => `<div class="d-ve-col"><h3 class="d-ve-t">${esc(titulo)}</h3><ul class="d-ve-l">${si.map(t => `<li class="d-ve-si">${VETA.ic('check', 18)}<span>${esc(t)}</span></li>`).join('')}` +
    `${no.map(t => `<li class="d-ve-no">${VETA.ic('candado', 18)}<span>${esc(t)}</span></li>`).join('')}</ul></div>`;
  VETA.pantalla('G7b', {
    titulo: 'Lo que ves tú y lo que ve cada uno',
    guia: ['Aquí ves, lado a lado, lo que ves tú y lo que ve cada persona del equipo.', 'Tú abres cada punto de abajo para leerlo entero.', 'Así el equipo sabe qué se ve de su trabajo y qué no.'],
    pinta: () => `<p class="d-ops-intro" data-i="0">Ves cada operación y a cada persona, con su nombre. No ves lo que cada uno habla con sus clientes. Y nadie se compara con nadie.</p>` +
      `<div class="d-ve" data-i="1">` +
      col('Lo que ves tú', ['Cada operación: quién la lleva, cómo va, lo último que pasó y qué toca', 'Cada persona: lo que lleva, lo pendiente, cuánto tarda en contestar y lo que Veta hace por ella', 'Lo que el equipo hace a mano y le pide a Veta'],
        ['Lo que cada persona escribe con sus clientes', 'Sus notas, también las de sus visitas', 'Sus chats personales']) +
      col('Lo que ve cada uno', ['Sus operaciones y sus clientes, enteros, con sus chats', 'Lo mismo que tú ves de ella, en su app', 'Lo que Veta ha aprendido de ella'],
        ['Las operaciones de los demás por dentro', 'Listas de quién vende más: no existen']) + '</div>' +
      UI.bloque({titulo: 'Para leerlo entero', i: 2, html: UI.lista([
        {titulo: 'Qué puedes ver y qué no', sub: 'en palabras llanas', icono: 'ojo', hoja: 'h29', datos: {texto: 'ver'}},
        {titulo: 'Cómo cuida Veta los datos', sub: 'Lo que firmamos, en corto', icono: 'escudo', hoja: 'h29', datos: {texto: 'resumen'}},
        {titulo: 'Qué se guarda y qué se borra', sub: 'Qué se ha borrado', icono: 'borrar', hoja: 'h29', datos: {texto: 'borrado'}},
        {titulo: 'Qué se ha leído y qué ha salido', icono: 'libro', hoja: 'h29', datos: {texto: 'leido'}},
        {titulo: 'Quién ha dicho que sí', sub: 'Leo 212 chats · 3 no los leo', icono: 'sello', hoja: 'h29', datos: {texto: 'consentimientos'}}])})
  });

  VETA.pantalla('G7c', {
    titulo: 'Parte diario del piloto',
    guia: ['Aquí Veta te deja cada tarde el parte del día, en texto llano.', 'Tú lo lees en un minuto.', 'Así sabes qué ha hecho Veta durante el piloto, día a día.'],
    pinta: () => `<p class="d-periodo" data-i="0">Hoy · ${esc(D.fecha.hoyTexto)}</p>` +
      `<div class="tarjeta d-parte" data-i="1"><p>Lunes 23 de noviembre. Leídos 41 chats. Detectados 27 casos; preparados 22; completados 9 (a las 9:38). Esperan aprobación 19.</p></div>` +
      UI.lista([{titulo: 'Partes anteriores', sub: 'los cinco últimos días', icono: 'cal', hoja: 'd-partes'}], {i: 2}) +
      `<p class="pie" data-i="3">El piloto dura hasta el 15 de diciembre.</p>`
  });
})();
