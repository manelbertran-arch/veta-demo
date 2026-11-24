/* Veta demo · ronda 8 · pantallas · muestrario.js (núcleo)
   #/muestrario: fuera del mapa. Las 18 piezas del juego (PLAN_R8.md, 4.1), una detrás de otra y con su número: es la prueba visual
   del núcleo, en claro y en oscuro. Lo que se toca aquí no cambia la demo. La propia pantalla enseña la cabecera de detalle con
   “Más”, el subtítulo, y el pie con nota y par de botones. Cómo se llama a cada pieza: analisis/PARTE_N.md. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, R = VETA.r7;
  let filtro = 'todos', elegido = 'si', interr = true;

  const pieza = (n, nombre, html) => `<section class="mu-sec" data-pieza="${n}"><h2 class="mu-n">${n} · ${esc(nombre)}</h2>${html}</section>`;
  // una cabecera o una barra de muestra, quietas (las de verdad las pinta el armazón)
  const cab = (forma, de, titulo, der) => `<div class="mu-banda">` + (forma === 'raiz'
    ? `<header class="cab cab-raiz"><h1 class="cab-t">${esc(titulo)}</h1>${der ? `<span class="cab-der">${VETA.cabDer(der)}</span>` : ''}</header>`
    : `<header class="cab cab-det"><span class="cab-atras">${VETA.ic('atras', 24)}</span><div class="cab-c"><span class="cab-de">${esc(de)}</span><h1 class="cab-t">${esc(titulo)}</h1></div>${der ? `<span class="cab-der">${VETA.cabDer(der)}</span>` : ''}</header>`) + '</div>';
  const barra = (sitios, papel, on) => {
    const tab = d => `<span class="tab${d === on ? ' on' : ''}"><span class="tab-ic">${VETA.ic(VETA.SITIOS[d].icono, 24)}${d === 'inicio' && on !== 'inicio' ? '<span class="tab-punto"></span>' : ''}</span><span class="tab-p">${esc(VETA.SITIOS[d].texto)}</span></span>`;
    return `<div class="mu-barra"><div class="barra"><div class="tabs" data-papel="${papel}">${sitios.slice(0, 2).map(tab).join('')}<span class="tab-mic"><span class="tab-mic-c">${VETA.ic('mic', 24)}</span></span>${sitios.slice(2).map(tab).join('')}</div></div></div>`;
  };

  VETA.pantalla('muestrario', {
    ruta: 'muestrario', titulo: 'The 18 pieces', destino: null, grupo: 'Core',
    sub: 'The round 8 set of pieces. Tap whatever you want to try.',
    nota: {texto: 'Nothing goes out without you.', candado: true},
    mas: 'mu-acciones',
    casoDictado: () => ({quien: 'marta', titulo: 'Marta Puig', texto: 'Wants to see the Gràcia flat'}),
    pinta: () => [
      pieza(1, 'Header: root, detail and step', cab('raiz', '', 'Clients') + cab('det', 'Clients', 'Pere Soler', {tipo: 'telefono'}) + cab('det', 'Home', 'What\'s on your mind?', {tipo: 'puntos', paso: 2})),
      pieza(2, 'Bar: four places and the mic', barra(['inicio', 'visitas', 'clientes', 'veta'], 'agente', 'clientes') + barra(['inicio', 'equipo', 'operaciones', 'oficina'], 'direccion', 'inicio')),
      pieza(3, 'Row: 72 with two lines, 56 with one', R.lista([
        {cara: 'marta', nombre: 'Marta Puig', pasa: 'Wants to see the Gràcia flat', pastilla: 'No reply yet', ir: 'cliente/marta'},
        {cara: 'veta', nombre: 'Flat report', pasa: 'A new job for the office', ir: 'muestrario'},
        {foto: 'verdi', nombre: 'The flat at Verdi 42', pasa: '3 viewings this week', ir: 'muestrario'},
        {nombre: 'What has happened', dato: 'Sat 21', ir: 'muestrario'},
        {nombre: 'Buyers who fit', dato: 2, ir: 'muestrario'},
        {nombre: 'A row you can\'t tap'}])),
      pieza(4, 'List with a label', R.lista([{nombre: 'Flat report for valuations', dato: '14 times', ir: 'muestrario'}, {nombre: 'Note down the viewings', dato: '9 times', ir: 'muestrario'}], {rotulo: 'My suggestion'})),
      pieza(5, 'Collapsible: “+” that opens here', R.lista([
        {nombre: 'Which chats do you read?', abre: '<p>Only the work ones you\'ve marked. I don\'t open personal ones.</p>'},
        {nombre: 'Who sees my messages?', abre: '<p>You. Management sees what happens with each deal, not what you write.</p>'}])),
      pieza(6, 'Card, Veta card and “first thing”', R.tarjeta({de: 'Marta · yesterday, 18:42', texto: 'Is the Gràcia flat still available? We could view it Saturday'}) +
        R.tarjeta({veta: true, de: 'I write it for you', texto: 'Hi Marta, it\'s Laura. Does this Saturday at 11:00 work for you to see the Gràcia flat?'}) +
        R.primero({cara: 'marta', nombre: 'Marta Puig', pasa: 'Wants to see the Gràcia flat', pastilla: 'No reply yet', boton: {texto: 'See my reply', ir: 'toca/c-marta'}})),
      pieza(7, 'Button: black, pair and link', `<div class="mu-pie"><div class="fijo">${R.botones({texto: 'Open WhatsApp with the message', accion: 'toca'})}</div></div>` +
        `<div class="mu-pie"><div class="fijo">${R.nota('Nothing goes out without you.', {candado: true})}${R.botones({texto: 'Yes, that\'s it', accion: 'toca'}, {texto: 'That\'s not it', accion: 'toca'})}</div></div>` +
        R.enlace({texto: 'Change the message', accion: 'toca'})),
      pieza(8, 'Pill: red only', `<div class="mu-fila">${R.pastilla('No reply yet')}${R.pastilla('No one has it')}${R.pastilla('1 missing')}</div>`),
      pieza(9, 'Filter', R.filtros([{id: 'todos', texto: 'All', cuenta: 18}, {id: 'necesitan', texto: 'Need you', cuenta: 6}, {id: 'oportunidades', texto: 'Opportunities', cuenta: 1}, {id: 'parados', texto: 'Stalled', cuenta: 3}], {valor: filtro, accion: 'filtra'})),
      pieza(10, 'Field and search', UI.campo({buscar: true, placeholder: 'Search a name or ask something'}) + UI.campo({etiqueta: 'When should I alert you?', placeholder: 'If someone waits more than two days'})),
      pieza(11, 'Face: 32, 40 and 48; initials and Veta', `<div class="mu-fila">${R.cara('pere', 32)}${R.cara('marta', 40)}${R.cara('elena', 48)}${VETA.av('x', 40, {nombre: 'Anna Bosch', sinFoto: true})}${R.cara('veta', 40)}${R.caras(['marta', 'elena', 'pere', 'nuria'], {max: 3})}</div>`),
      pieza(12, 'Figure and bars', R.cifra({valor: 156, frase: 'things I got ready for you. A month ago, 118.'}) +
        R.barras([{valor: 118, fecha: '26 Oct'}, {valor: 127, fecha: '2 Nov'}, {valor: 141, fecha: '9 Nov'}, {valor: 156, fecha: '16 Nov'}])),
      pieza(13, 'Document', R.doc({foto: 'verdi', datos: ['Monday 23 November, 9:00 · Verdi 42, 3.º 2.ª', 'Elena Vives with Laura Martí'], titular: 'She liked it a lot. She wants to come back with her partner.',
        secciones: [{rotulo: 'What they liked', lineas: ['The light in the living room', 'The terrace']}, {rotulo: 'What they did not like', lineas: ['The street noise at night']},
          {rotulo: 'This week', filas: [{nombre: 'Viewings', valor: 3}, {nombre: 'They find it expensive', valor: 3, sub: 'before 2'}]}]})),
      pieza(14, 'Sheet: actions, text and choose', R.lista([{nombre: 'Action sheet', hoja: 'mu-acciones'}, {nombre: 'Text sheet', hoja: 'mu-texto'}, {nombre: 'Choice sheet', hoja: 'mu-elegir'}])),
      pieza(15, 'Support line: subtitle and note', R.sub('Owner of the Verdi 42 flat · 612 48 39 07') + R.nota('Nothing goes out without you.', {candado: true})),
      pieza(16, 'Mic and steps', R.micro({accion: 'toca'}) + `<div class="mu-fila">${R.pasos(2, 4)}</div>` +
        R.elegir([{id: 'si', texto: 'Liked it'}, {id: 'duda', texto: 'Has doubts'}, {id: 'no', texto: 'Not a fit'}], {valor: elegido, accion: 'elige'})),
      pieza(17, 'Switch', R.lista([UI.interruptor({texto: 'Warn me before a signing', on: interr, accion: 'interr'}), UI.interruptor({texto: 'Reduce motion', on: false, accion: 'toca'})])),
      pieza(18, 'Done, alert and empty', UI.lineaHecho({texto: 'Sent to Marta', hora: '9:41', boton: {texto: 'Undo', accion: 'toca'}}) +
        R.lista([{nombre: 'Show an alert', accion: 'aviso'}, {nombre: 'Switch between light and dark', accion: 'tema'}]) +
        UI.vacio({titulo: 'Nothing is left for you today.', boton: {texto: 'Close the day', accion: 'toca'}}))
    ].join(''),
    botonFijo: () => R.botones({texto: 'Send', accion: 'toca'}, {texto: 'Not now', accion: 'toca'}),
    acciones: {
      toca() { VETA.aviso('Tapped.'); },
      aviso() { VETA.aviso('Sent to Marta.', {deshacer: () => VETA.aviso('Undone.')}); },
      filtra(ev, el) { filtro = el.dataset.valor; },
      elige(ev, el) { elegido = el.dataset.valor; },
      interr(ev, el) { interr = el.getAttribute('aria-checked') === 'true'; },
      tema() { VETA.tema.pon({modo: document.documentElement.dataset.modo === 'oscuro' ? 'claro' : 'oscuro'}); }
    }
  });

  // las tres plantillas de hoja, con datos de ejemplo
  VETA.hojaAcciones('mu-acciones', {
    titulo: 'More',
    opciones: [{texto: 'I already handled it by phone', hace: () => VETA.aviso('Resolved: you handled it by phone.')}, {texto: 'For later', hace: () => VETA.aviso('For later.')}, {texto: 'Dismiss it', peligro: true, hace: () => VETA.aviso('Dismissed.')}]
  });
  VETA.hojaTexto('mu-texto', {titulo: 'What I\'ve read', bloques: [{texto: 'I\'ve read 8 chats since yesterday. Only the work ones.'}, {titulo: 'What I don\'t read', lista: ['Your personal chats', 'The groups you haven\'t marked']}]});
  VETA.hojaElegir('mu-elegir', {
    titulo: 'Who do you assign it to?',
    opciones: [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'}, {id: 'marc', texto: 'Marc Vidal', sub: 'Sant Gervasi', av: 'marc'}],
    valor: () => 'laura', alElegir: op => VETA.aviso('Assigned to ' + op.texto + '.')
  });
})();
