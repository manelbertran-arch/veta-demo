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
      {id: 'yo', titulo: 'Esto ya lo hago yo', icono: 'check', filas: [
        ['Leo tus chats de trabajo', `Leo ${esc(VETA.num(C.leidos()))} chats. Los de ${esc(fuera[0] || 'tu familia')} y ${fuera.length - 1} más, no.`, 'cuenta/chats'],
        ['Apunto lo que te prometen', `Elena te dijo: «${oro('El miércoles te paso la nómina', 'elena')}». Si no llega, te aviso.`, 'espera'],
        ['Marco quién te ha contestado', 'Jordi te contestó el viernes. Así no le escribes dos veces lo mismo.', 'regla/r-contestado'],
        ['Te aviso antes de una firma', 'El lunes 30 te recuerdo la firma de Laia Casas y lo que hay que llevar.', 'regla/r-firmas'],
        ['Me acuerdo de cada cliente', 'Marta solo puede ver pisos los sábados. No le propongo otro día.', 'cliente/marta'],
        ['Quito lo que ya no hace falta', 'Si el cliente ya te ha contestado, lo quito de tu lista y te digo por qué.', 'hoy/veta']
      ]},
      {id: 'dos', titulo: 'Esto lo hacemos entre los dos', icono: 'equipo', sub: 'Yo lo preparo. Tú decides.', filas: [
        ['Te dejo escritas las respuestas', `Marta preguntó: «${oro('¿Sigue disponible el piso de Gràcia?', 'gracia')}». La respuesta ya está escrita. Tú la envías.`, 'hoy/cola'],
        ['Escribo la nota de la visita', 'Sales de Verdi con Elena, me cuentas cómo ha ido y la nota queda escrita.', 'dictar/acta'],
        ['Preparo informes de propietario', 'El de Pere Soler, cada lunes desde el 7 oct. Tú lo envías.', 'regla/r-informes'],
        ['Te propongo otra fecha si cancelan', 'Jordi canceló el viernes. Le propondría el jueves 26 a las 18:00.', 'regla/r-cancelaciones', 'Lo estoy probando'],
        ['Aprendo cuando me corriges', 'Si cambias un mensaje, te pregunto una vez: «¿Lo hago siempre así?».', 'aprendido'],
        ['Te digo lo que repites', vis.estado === 'propuesta' ? 'Confirmar las visitas el día antes: lo has hecho 9 veces. ¿Lo hago yo?' : 'Confirmar las visitas el día antes: ' + esc(vis.texto.toLowerCase()) + '.', 'regla/r-visitas'],
        ['Aprendo lo que me pides hablando', '«Si alguien no contesta en tres días, prepárame un recordatorio.» Yo te lo propongo y tú decides.', 'dictar/orden']
      ]},
      {id: 'no', titulo: 'Esto todavía no lo sé hacer', icono: 'candado', filas: [
        ['Enviar mensajes sin ti', 'Durante el piloto no envío nada sin que tú digas que sí.', 'regla/r-visitas'],
        ['Apuntar en tu calendario', 'Te digo la hora de cada visita. Pasarla a tu calendario lo haces tú.', 'cuenta'],
        ['Hacer todo lo que me pidas', 'Solo aprendo trabajos que ya he visto en tus chats. Mira cuáles son.', 'mapa']
      ]}
    ];
  };

  const fila = ([t, ej, ir, etq]) => `<li class="c-qh-f"><div class="c-qh-fc"><p class="c-qh-t">${esc(t)}${etq ? ' ' + UI.etiqueta('a-prueba', etq) : ''}</p>` +
    `<p class="c-qh-e">${ej}</p></div>` +
    `<button type="button" class="c-qh-ver" data-ir="${esc(ir)}">Verlo${VETA.ic('chev', 14)}</button></li>`;

  // cuántas cosas ya hago yo: el mismo número aquí y en «Antes y ahora»
  C.yaHago = () => grupos()[0].filas.length;

  VETA.pantalla('A19', {
    titulo: 'Qué hace Veta',
    guia: ['Aquí ves todo lo que hago por ti, con ejemplos de tus chats.', 'Tú tocas «Verlo» y vas a su sitio en la app.', 'Así sabes qué trabajo ya no es tuyo.'],
    // ronda 7: el ejemplo y los tres grupos entran plegados (VETA.pliega): título, una línea y su número. Se abren al tocarlos.
    pinta: () => {
      const g = grupos();
      return UI.bloque({titulo: 'Un ejemplo, paso a paso', texto: 'Veta lee un chat tuyo y te deja la respuesta escrita.', i: 1,
          html: `<div class="c-qh-escena">${VETA.vivo.escena({clave: 'que-hace', ir: 'hoy/cola', boton: 'Verla en lo de hoy'})}</div>`}) +
        g.map((x, k) => `<section class="bloque c-qh c-qh-${x.id}" id="c-qh-${x.id}" data-i="${Math.min(4, k + 2)}">` +
          `<h2 class="bloque-t c-qh-h">${esc(x.titulo)}</h2>${x.sub ? `<p class="bloque-sub">${esc(x.sub)}</p>` : ''}` +
          `<ul class="c-qh-l">${x.filas.map(fila).join('')}</ul></section>`).join('') +
        `<p class="c-qh-pie" data-i="4">Lo que cambia, lo ves en ${'<a data-ir="antes-ahora" href="#/antes-ahora">Antes y ahora</a>'}.</p>`;
    }
  });
  void M;
})();
