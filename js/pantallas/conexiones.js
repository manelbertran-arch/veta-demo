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
    guia: ['Aquí Veta te dice qué escucha de la oficina y cómo va el piloto.', 'Tú enciendes o apagas cada canal.', 'Así decides de dónde aprende Veta, y cada persona decide sus chats.'],
    pinta: () => {
      const e = escucha(), coste = M.lee('coste', null);
      let h = UI.bloque({titulo: 'Qué escucha Veta', i: 0, html: `<div class="lista d-interrs">${D.escucha.map(c => UI.interruptor({texto: c.texto, sub: c.sub, on: e[c.id] !== false, accion: 'escucha', de: c.id})).join('')}</div>` +
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
        if (!on) VETA.aviso('Veta deja de escuchar ' + c.texto + '.', {deshacer: () => { const u = escucha(); u[id] = true; X.guarda('escucha', u); VETA.repinta(); }});
        else VETA.aviso('Veta vuelve a escuchar ' + c.texto + '.');
      }
    }
  });

  VETA.lista('G7b', {
    titulo: 'Qué ves tú y qué ve cada persona',
    guia: ['Aquí Veta explica qué se ve y qué no, en palabras llanas.', 'Tú abres cada punto para leerlo entero.', 'Así el equipo sabe que dirección no ve sus chats ni sus cifras.'],
    intro: 'Dirección ve cifras del equipo, nunca de cada persona. Cada agente ve lo suyo.',
    bloques: () => [{filas: [
      {titulo: 'Qué puedes ver y qué no', sub: 'cada persona ve lo suyo', icono: 'ojo', hoja: 'h29', datos: {texto: 'ver'}},
      {titulo: 'Cómo cuida Veta los datos', sub: 'resumen del acuerdo', icono: 'escudo', hoja: 'h29', datos: {texto: 'resumen'}},
      {titulo: 'Qué se guarda y qué se borra', sub: 'recibo de borrado', icono: 'borrar', hoja: 'h29', datos: {texto: 'borrado'}},
      {titulo: 'Qué se ha leído y qué ha salido', icono: 'libro', hoja: 'h29', datos: {texto: 'leido'}},
      {titulo: 'Los consentimientos', sub: '128 chats, desde el 3 de octubre', icono: 'sello', hoja: 'h29', datos: {texto: 'consentimientos'}}]}]
  });

  VETA.pantalla('G7c', {
    titulo: 'Parte diario del piloto',
    guia: ['Aquí Veta te deja cada tarde el parte del día, en texto llano.', 'Tú lo lees en un minuto.', 'Así sabes qué ha hecho Veta durante el piloto, día a día.'],
    pinta: () => `<p class="d-periodo" data-i="0">Hoy · ${esc(D.fecha.hoyTexto)}</p>` +
      `<div class="tarjeta d-parte" data-i="1"><p>Lunes 23 de noviembre. Leídos 41 chats. Detectados 27 casos; preparados 22; completados 9 (a las 9:38). Esperan aprobación 19. Sin entender: 1 audio.</p></div>` +
      UI.lista([{titulo: 'Partes anteriores', sub: 'los cinco últimos días', icono: 'cal', hoja: 'd-partes'}], {i: 2}) +
      `<p class="pie" data-i="3">El piloto dura hasta el 15 de diciembre.</p>`
  });
})();
