/* Veta demo · pantallas · conexiones.js · paquete D (Dirección)
   G7 · Conexiones y ajustes · #/conexiones — qué escucha Veta (cinco interruptores), el piloto y la oficina. Sin botón principal.
   G7b · Qué ves tú y qué ve cada persona · #/confianza (lista; cada fila abre H29)
   G7c · Parte diario del piloto · #/piloto */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;
  const escucha = () => X.lee('escucha', {});                    // {id: false} = apagado

  VETA.pantalla('G7', {
    titulo: 'Connections and settings',
    guia: ['Here Veta tells you what it listens to in the office and how the pilot is going.', 'You switch each channel on or off.', 'That way you decide where Veta learns from, and each person decides about their chats.'],
    pinta: () => {
      const e = escucha(), coste = M.lee('coste', null);
      let h = UI.bloque({titulo: 'What Veta listens to', i: 0, html: `<div class="lista d-interrs">${D.escucha.map(c => UI.interruptor({texto: c.texto, sub: c.sub, on: e[c.id] !== false, accion: 'escucha', de: c.id})).join('')}</div>` +
        UI.nota({texto: 'Each person chooses which chats to leave out. You don\'t see them.', icono: 'candado'})});
      h += UI.bloque({titulo: 'While the pilot lasts', i: 1, html: UI.lista([
        {titulo: 'Daily pilot wrap-up', sub: 'until 15 December', icono: 'papel', ir: 'piloto'}])});
      h += UI.bloque({titulo: 'The office', i: 2, html: UI.lista([
        {titulo: 'What you see and what each person sees', icono: 'ojo', ir: 'confianza'},
        {titulo: 'Cost per hour', sub: coste ? coste + ' € per hour' : 'not set', icono: 'sello', hoja: 'h38'},
        {titulo: 'Security', icono: 'escudo', ir: 'cuenta/seguridad'}])});
      return h;
    },
    acciones: {
      escucha(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true', c = D.escucha.find(x => x.id === id) || {texto: id};
        const t = escucha(); t[id] = on; X.guarda('escucha', t);
        if (!on) VETA.aviso('Veta stops listening to ' + c.texto + '.', {deshacer: () => { const u = escucha(); u[id] = true; X.guarda('escucha', u); VETA.repinta(); }});
        else VETA.aviso('Veta listens again to ' + c.texto + '.');
      }
    }
  });

  VETA.lista('G7b', {
    titulo: 'What you see and what each person sees',
    guia: ['Here Veta explains what\'s visible and what isn\'t, in plain words.', 'You open each point to read it in full.', 'That way the team knows management doesn\'t see their chats or their figures.'],
    intro: 'Management sees team figures, never each person\'s. Each agent sees their own.',
    bloques: () => [{filas: [
      {titulo: 'What you can and can\'t see', sub: 'each person sees their own', icono: 'ojo', hoja: 'h29', datos: {texto: 'ver'}},
      {titulo: 'How Veta looks after data', sub: 'summary of the agreement', icono: 'escudo', hoja: 'h29', datos: {texto: 'resumen'}},
      {titulo: 'What\'s kept and what\'s deleted', sub: 'deletion receipt', icono: 'borrar', hoja: 'h29', datos: {texto: 'borrado'}},
      {titulo: 'What has been read and what has gone out', icono: 'libro', hoja: 'h29', datos: {texto: 'leido'}},
      {titulo: 'Consents', sub: '128 chats, since 3 October', icono: 'sello', hoja: 'h29', datos: {texto: 'consentimientos'}}]}]
  });

  VETA.pantalla('G7c', {
    titulo: 'Daily pilot wrap-up',
    guia: ['Here Veta leaves you the day\'s wrap-up every evening, in plain text.', 'You read it in a minute.', 'That way you know what Veta has done during the pilot, day by day.'],
    pinta: () => `<p class="d-periodo" data-i="0">Today · ${esc(D.fecha.hoyTexto)}</p>` +
      `<div class="tarjeta d-parte" data-i="1"><p>Monday 23 November. Read 41 chats. Detected 27 cases; prepared 22; completed 9 (at 9:38). Awaiting approval: 19. Not understood: 1 audio clip.</p></div>` +
      UI.lista([{titulo: 'Previous wrap-ups', sub: 'the last five days', icono: 'cal', hoja: 'd-partes'}], {i: 2}) +
      `<p class="pie" data-i="3">The pilot lasts until 15 December.</p>`
  });
})();
