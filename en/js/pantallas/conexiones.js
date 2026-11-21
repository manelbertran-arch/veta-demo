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
    guia: ['Here you see what I read in the office and how the trial is going.', 'You switch each channel on or off.', 'This is how you decide what I learn from, and each person decides about their chats.'],
    pinta: () => {
      const e = escucha(), coste = M.lee('coste', null);
      let h = UI.bloque({titulo: 'What I read', i: 0, html: `<div class="lista d-interrs">${D.escucha.map(c => UI.interruptor({texto: c.texto, sub: c.sub, on: e[c.id] !== false, accion: 'escucha', de: c.id})).join('')}</div>` +
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
        if (!on) VETA.aviso('I stop reading ' + c.texto + '.', {deshacer: () => { const u = escucha(); u[id] = true; X.guarda('escucha', u); VETA.repinta(); }});
        else VETA.aviso('Veta listens again to ' + c.texto + '.');
      }
    }
  });

  // ronda 6 · G7b · “Lo que ves tú · Lo que ve cada uno”, en dos columnas (decisión de Manel, 21-nov: dirección ve nombres)
  const col = (titulo, si, no) => `<div class="d-ve-col"><h3 class="d-ve-t">${esc(titulo)}</h3><ul class="d-ve-l">${si.map(t => `<li class="d-ve-si">${VETA.ic('check', 18)}<span>${esc(t)}</span></li>`).join('')}` +
    `${no.map(t => `<li class="d-ve-no">${VETA.ic('candado', 18)}<span>${esc(t)}</span></li>`).join('')}</ul></div>`;
  VETA.pantalla('G7b', {
    titulo: 'What you see and what everyone sees',
    guia: ['Here you see, side by side, what you see and what each person on the team sees.', 'You open each point below to read it in full.', 'This way the team knows what is seen of their work and what is not.'],
    pinta: () => `<p class="d-ops-intro" data-i="0">You see every deal and every person, by name. You do not see what each one says to their clients. And nobody is compared with anybody.</p>` +
      `<div class="d-ve" data-i="1">` +
      col('What you see', ['Every deal: who handles it, how it is going, the last thing that happened and what is next', 'Each person: what they handle, what is waiting, how long they take to reply and what Veta does for them', 'What the team does by hand and asks Veta for'],
        ['What each person writes to their clients', 'Their notes, including those from their viewings', 'Their personal chats']) +
      col('What each one sees', ['Their deals and their clients, in full, with their chats', 'The same as you see of her, in her app', 'What Veta has learned from her'],
        ['Other people\'s deals, inside', 'Lists of who sells the most: they do not exist']) + '</div>' +
      UI.bloque({titulo: 'To read it in full', i: 2, html: UI.lista([
        {titulo: 'What you can and can\'t see', sub: 'in plain words', icono: 'ojo', hoja: 'h29', datos: {texto: 'ver'}},
        {titulo: 'How Veta looks after data', sub: 'What we signed, in short', icono: 'escudo', hoja: 'h29', datos: {texto: 'resumen'}},
        {titulo: 'What\'s kept and what\'s deleted', sub: 'What has been deleted', icono: 'borrar', hoja: 'h29', datos: {texto: 'borrado'}},
        {titulo: 'What has been read and what has gone out', icono: 'libro', hoja: 'h29', datos: {texto: 'leido'}},
        {titulo: 'Who said yes', sub: 'I read 212 chats · I do not read 3', icono: 'sello', hoja: 'h29', datos: {texto: 'consentimientos'}}])})
  });

  VETA.pantalla('G7c', {
    titulo: 'Daily pilot wrap-up',
    guia: ['Here Veta leaves you the day\'s wrap-up every evening, in plain text.', 'You read it in a minute.', 'That way you know what Veta has done during the pilot, day by day.'],
    pinta: () => `<p class="d-periodo" data-i="0">Today · ${esc(D.fecha.hoyTexto)}</p>` +
      `<div class="tarjeta d-parte" data-i="1"><p>Monday 23 November. Read 41 chats. Found 27 cases; prepared 22; completed 9 (at 9:38). 19 waiting for approval.</p></div>` +
      UI.lista([{titulo: 'Previous wrap-ups', sub: 'the last five days', icono: 'cal', hoja: 'd-partes'}], {i: 2}) +
      `<p class="pie" data-i="3">The pilot lasts until 15 December.</p>`
  });
})();
