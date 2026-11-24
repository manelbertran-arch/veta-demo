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
    frase: 'What I read in the office. Turn each channel on or off. Each person chooses their chats.',
    guia: ['Here you see what I read in the office and how the trial is going.', 'You switch each channel on or off.', 'This is how you decide what I learn from, and each person decides about their chats.'],
    pinta: () => {
      const e = escucha(), coste = M.lee('coste', null);
      // ronda 7 · D2: los interruptores arriba y, debajo, una lista con lo demás; sin títulos de sección (R2)
      let h = `<div class="lista d-interrs" data-i="0">${D.escucha.map(c => UI.interruptor({texto: c.texto, sub: c.sub, on: e[c.id] !== false, accion: 'escucha', de: c.id})).join('')}</div>`;
      h += VETA.r7.lista([
        // arreglo FD (defecto 2): “Lo último que he leído” venía de Veta (oficina); ahora vive aquí, en Cuenta
        {icono: 'reloj', nombre: 'The last thing I read', pasa: `Today, until ${VETA.ahora(-3)}`, hoja: 'h04', datos: {quien: 'equipo'}},
        {icono: 'ojo', nombre: 'What you and others see', pasa: 'You do not see their chats', ir: 'confianza'},
        {icono: 'papel', nombre: 'Daily pilot wrap-up', pasa: 'Until 15 December', ir: 'piloto'},
        {icono: 'sello', nombre: 'Cost per hour', pasa: coste ? coste + ' € per hour' : 'Not set', hoja: 'h38'},
        {icono: 'escudo', nombre: 'Security', pasa: 'Your account and your data', ir: 'cuenta/seguridad'}], {i: 1, clase: 'd2-mas-abajo'});
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
  const col = (si, no) => `<div class="d-ve-col"><ul class="d-ve-l">${si.map(t => `<li class="d-ve-si">${VETA.ic('check', 18)}<span>${esc(t)}</span></li>`).join('')}` +
    `${no.map(t => `<li class="d-ve-no">${VETA.ic('candado', 18)}<span>${esc(t)}</span></li>`).join('')}</ul></div>`;
  VETA.pantalla('G7b', {
    titulo: 'What you and others see',
    frase: 'You see each deal and each person, with their name. You do not see their chats. No one is compared.',
    guia: ['Here you see, side by side, what you see and what each person on the team sees.', 'You open each point below to read it in full.', 'This way the team knows what is seen of their work and what is not.'],
    // ronda 7 · D2: las dos columnas pasan a dos filas que se abren aquí mismo; todo en una lista (R2)
    pinta: () => VETA.r7.lista([
        {icono: 'ojo', nombre: 'What you see', pasa: 'Each deal and person, no chats', abre: col(['Every deal: who handles it, how it is going, the last thing that happened and what is next', 'Each person: what they handle, what is waiting, how long they take to reply and what Veta does for them', 'What the team does by hand and asks Veta for'],
          ['What each person writes to their clients', 'Their notes, including those from their viewings', 'Their personal chats'])},
        {icono: 'equipo', nombre: 'What each one sees', pasa: 'All of their own, none of others\'', abre: col(['Their deals and their clients, in full, with their chats', 'The same as you see of her, in her app', 'What Veta has learned from her'],
          ['Other people\'s deals, inside', 'Lists of who sells the most: they do not exist'])},
        {icono: 'ojo', nombre: 'What you can and can\'t see', pasa: 'In plain words', hoja: 'h29', datos: {texto: 'ver'}},
        {icono: 'escudo', nombre: 'How Veta looks after data', pasa: 'What we signed, in short', hoja: 'h29', datos: {texto: 'resumen'}},
        {icono: 'borrar', nombre: 'What\'s kept and what\'s deleted', pasa: 'And what has been deleted', hoja: 'h29', datos: {texto: 'borrado'}},
        {icono: 'libro', nombre: 'What was read, what went out', pasa: 'To read it in full', hoja: 'h29', datos: {texto: 'leido'}},
        {icono: 'sello', nombre: 'Who said yes', pasa: VETA.c.lecturaTexto(), hoja: 'h29', datos: {texto: 'consentimientos'}}], {i: 0})
  });

  VETA.pantalla('G7c', {
    titulo: 'Daily pilot wrap-up',
    frase: 'Every afternoon I leave you the day\'s report, until 15 December, when the pilot ends.',
    guia: ['Here Veta leaves you the day\'s wrap-up every evening, in plain text.', 'You read it in a minute.', 'That way you know what Veta has done during the pilot, day by day.'],
    pinta: () => `<div class="r7-ficha r7-oro" data-i="0"><span class="r7-ficha-de">Today · ${esc(D.fecha.hoyTexto)}</span>` +
      `<p>Monday 23 November. Read 41 chats. Found 27 cases; prepared 22; completed 9 (at 9:38). 19 waiting for approval.</p></div>` +
      VETA.r7.lista([{icono: 'cal', nombre: 'Previous wrap-ups', pasa: 'The last five days', hoja: 'd-partes'}], {i: 1, clase: 'd2-mas-abajo'})
  });
})();
