/* Veta demo · pantallas · que-hace.js · ronda 6 · paquete C (P2)
   A19 · #/que-hace · «Qué hace Veta»: el sitio que lo explica todo (lo pidió Manel), sin manual.
   Un ejemplo (la escena en que Veta lee un chat y lo convierte en tarjeta) y tres grupos; en la ronda 7, todo entra plegado:
   «Esto ya lo hago yo» · «Esto lo hacemos entre los dos» · «Esto todavía no lo sé hacer».
   Cada fila, con un ejemplo sacado de los datos de la demo y «Verlo», que lleva a su sitio en la app.
   Se llega desde Veta (A8), desde Hoy (P1) y desde el primer día (A18, paso 4). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const oro = (t, k) => VETA.vivo.oro(t, {clave: 'qh-' + k});

  // [qué hago, ejemplo (html), adónde lleva «Verlo», rótulo opcional]
  const grupos = () => {
    const vis = C.visitas(), fuera = VETA.modelo.lectura().fuera;
    return [
      {id: 'yo', titulo: 'What I already do', icono: 'check', filas: [
        ['I read your work chats', `I read ${esc(VETA.num(C.leidos()))} chats. I do not read those of ${esc(fuera[0] || 'your family')} and ${fuera.length - 1} more.`, 'cuenta/chats'],
        ['I note what people promise you', `Elena told you: “${oro('I\'ll send you the payslip on Wednesday', 'elena')}”. If it does not come, I tell you.`, 'espera'],
        ['I mark who has replied to you', 'Jordi replied to you on Friday. This way you do not write the same thing to him twice.', 'regla/r-contestado'],
        ['I tell you before a signing', 'On Monday 30 I remind you about Laia Casas\'s signing and what to bring.', 'regla/r-firmas'],
        ['I remember every client', 'Marta can only see flats on Saturdays. I do not suggest another day.', 'cliente/marta'],
        ['I remove what is no longer needed', 'If the client has already replied to you, I take it off your list and tell you why.', 'hoy/veta']
      ]},
      {id: 'dos', titulo: 'What we do together', icono: 'equipo', sub: 'I prepare it. You decide.', filas: [
        ['I write the replies for you', `Marta asked: “${oro('Is the Gràcia flat still available?', 'gracia')}”. The reply is already written. You send it.`, 'hoy/cola'],
        ['I write the viewing note', 'You leave Verdi with Elena, you tell me how it went and the note is written.', 'dictar/acta'],
        ['I prepare owner reports', 'Pere Soler\'s, every Monday since 7 Oct. You send it.', 'regla/r-informes'],
        ['I suggest another date if they cancel', 'Jordi cancelled on Friday. I would suggest Thursday 26 at 18:00.', 'regla/r-cancelaciones', 'I\'m trying it'],
        ['I learn when you correct me', 'If you change a message, I ask you once: “Shall I always do it this way?”', 'aprendido'],
        ['I tell you what you repeat', vis.estado === 'propuesta' ? 'Confirm viewings the day before: you have done it 9 times. Shall I do it?' : 'Confirm viewings the day before: ' + esc(vis.texto.toLowerCase()) + '.', 'regla/r-visitas'],
        ['I learn what you ask me by talking', '“If someone does not reply in three days, get a reminder ready for me.” I suggest it, and you decide.', 'dictar/orden']
      ]},
      {id: 'no', titulo: 'What I cannot do yet', icono: 'candado', filas: [
        ['Send messages without you', 'During the pilot I send nothing unless you say yes.', 'regla/r-visitas'],
        ['Put things in your calendar', 'I tell you the time of each viewing. You put it in your calendar.', 'cuenta'],
        ['Do everything you ask me', 'I only learn jobs I have already seen in your chats. See which ones they are.', 'mapa']
      ]}
    ];
  };

  const fila = ([t, ej, ir, etq]) => `<li class="c-qh-f"><div class="c-qh-fc"><p class="c-qh-t">${esc(t)}${etq ? ' ' + UI.etiqueta('a-prueba', etq) : ''}</p>` +
    `<p class="c-qh-e">${ej}</p></div>` +
    `<button type="button" class="c-qh-ver" data-ir="${esc(ir)}">See it${VETA.ic('chev', 14)}</button></li>`;

  // cuántas cosas ya hago yo: el mismo número aquí y en «Antes y ahora»
  C.yaHago = () => grupos()[0].filas.length;

  VETA.pantalla('A19', {
    titulo: 'What Veta does',
    guia: ['Here you see everything I do for you, with examples from your chats.', 'You tap “See it” and go to its place in the app.', 'This way you know which work is no longer yours.'],
    // ronda 7: el ejemplo y los tres grupos entran plegados (VETA.pliega): título, una línea y su número. Se abren al tocarlos.
    pinta: () => {
      const g = grupos();
      return UI.bloque({titulo: 'An example, step by step', texto: 'Veta reads one of your chats and leaves the reply written for you.', i: 1,
          html: `<div class="c-qh-escena">${VETA.vivo.escena({clave: 'que-hace', ir: 'hoy/cola', boton: 'See it in today\'s list'})}</div>`}) +
        g.map((x, k) => `<section class="bloque c-qh c-qh-${x.id}" id="c-qh-${x.id}" data-i="${Math.min(4, k + 2)}">` +
          `<h2 class="bloque-t c-qh-h">${esc(x.titulo)}</h2>${x.sub ? `<p class="bloque-sub">${esc(x.sub)}</p>` : ''}` +
          `<ul class="c-qh-l">${x.filas.map(fila).join('')}</ul></section>`).join('') +
        `<p class="c-qh-pie" data-i="4">You see what changes in ${'<a data-ir="antes-ahora" href="#/antes-ahora">Before and now</a>'}.</p>`;
    }
  });
  void M;
})();
