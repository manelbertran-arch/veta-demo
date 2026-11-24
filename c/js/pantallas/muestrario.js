/* Veta demo · ronda 8 · pantallas · muestrario.js (núcleo)
   #/muestrario: fuera del mapa. Las 18 piezas del juego (PLAN_R8.md, 4.1), una detrás de otra y con su número: es la prueba visual
   del núcleo, en claro y en oscuro. Lo que se toca aquí no cambia la demo. La propia pantalla enseña la cabecera de detalle con
   «Más», el subtítulo, y el pie con nota y par de botones. Cómo se llama a cada pieza: analisis/PARTE_N.md. */
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
    ruta: 'muestrario', titulo: 'Las 18 piezas', destino: null, grupo: 'Núcleo',
    sub: 'El juego de piezas de la ronda 8. Toca lo que quieras probar.',
    nota: {texto: 'No sale hasta que tú lo envíes.', candado: true},
    mas: 'mu-acciones',
    casoDictado: () => ({quien: 'marta', titulo: 'Marta Puig', texto: 'Quiere ver el piso de Gràcia'}),
    pinta: () => [
      pieza(1, 'Cabecera: raíz, detalle y paso', cab('raiz', '', 'Clientes') + cab('det', 'Clientes', 'Pere Soler', {tipo: 'telefono'}) + cab('det', 'Inicio', '¿Qué me cuentas?', {tipo: 'puntos', paso: 2})),
      pieza(2, 'Barra: cuatro sitios y el micro', barra(['inicio', 'visitas', 'clientes', 'veta'], 'agente', 'clientes') + barra(['inicio', 'equipo', 'operaciones', 'oficina'], 'direccion', 'inicio')),
      pieza(3, 'Fila: 72 con dos líneas, 56 con una', R.lista([
        {cara: 'marta', nombre: 'Marta Puig', pasa: 'Quiere ver el piso de Gràcia', pastilla: 'Sin contestar', ir: 'cliente/marta'},
        {cara: 'veta', nombre: 'Informe del piso', pasa: 'Un trabajo nuevo para la oficina', ir: 'muestrario'},
        {foto: 'verdi', nombre: 'El piso de Verdi 42', pasa: '3 visitas esta semana', ir: 'muestrario'},
        {nombre: 'Lo que ha pasado', dato: 'Sáb 21', ir: 'muestrario'},
        {nombre: 'Compradores que encajan', dato: 2, ir: 'muestrario'},
        {nombre: 'Una fila que no se toca'}])),
      pieza(4, 'Lista con rótulo', R.lista([{nombre: 'Informe del piso al valorar', dato: '14 veces', ir: 'muestrario'}, {nombre: 'Apuntar las visitas', dato: '9 veces', ir: 'muestrario'}], {rotulo: 'Te lo propongo'})),
      pieza(5, 'Plegable: «+» que despliega aquí', R.lista([
        {nombre: '¿Qué chats lees?', abre: '<p>Solo los de trabajo que tú has marcado. Los personales no los abro.</p>'},
        {nombre: '¿Quién ve mis mensajes?', abre: '<p>Tú. Dirección ve qué pasa con cada operación, no lo que escribes.</p>'}])),
      pieza(6, 'Tarjeta, tarjeta de Veta y «lo primero»', R.tarjeta({de: 'Marta · ayer, 18:42', texto: '¿Sigue disponible el piso de Gràcia? Podríamos verlo este sábado'}) +
        R.tarjeta({veta: true, de: 'Te lo dejo escrito', texto: 'Hola, Marta, soy Laura. ¿Os va bien este sábado a las 11:00 para ver el piso de Gràcia?'}) +
        R.primero({cara: 'marta', nombre: 'Marta Puig', pasa: 'Quiere ver el piso de Gràcia', pastilla: 'Sin contestar', boton: {texto: 'Ver mi respuesta', ir: 'toca/c-marta'}})),
      pieza(7, 'Botón: negro, par y enlace', `<div class="mu-pie"><div class="fijo">${R.botones({texto: 'Abrir WhatsApp con el mensaje', accion: 'toca'})}</div></div>` +
        `<div class="mu-pie"><div class="fijo">${R.nota('No sale hasta que tú lo envíes.', {candado: true})}${R.botones({texto: 'Sí, es eso', accion: 'toca'}, {texto: 'No es eso', accion: 'toca'})}</div></div>` +
        R.enlace({texto: 'Cambiar el mensaje', accion: 'toca'})),
      pieza(8, 'Pastilla: solo roja', `<div class="mu-fila">${R.pastilla('Sin contestar')}${R.pastilla('Nadie la lleva')}${R.pastilla('Falta 1')}</div>`),
      pieza(9, 'Filtro', R.filtros([{id: 'todos', texto: 'Todos', cuenta: 18}, {id: 'necesitan', texto: 'Te necesitan', cuenta: 6}, {id: 'oportunidades', texto: 'Oportunidades', cuenta: 1}, {id: 'parados', texto: 'Parados', cuenta: 3}], {valor: filtro, accion: 'filtra'})),
      pieza(10, 'Campo y buscador', UI.campo({buscar: true, placeholder: 'Busca un nombre o pregunta algo'}) + UI.campo({etiqueta: '¿Cuándo te aviso?', placeholder: 'Si alguien espera más de dos días'})),
      pieza(11, 'Cara: 32, 40 y 48; iniciales y Veta', `<div class="mu-fila">${R.cara('pere', 32)}${R.cara('marta', 40)}${R.cara('elena', 48)}${VETA.av('x', 40, {nombre: 'Anna Bosch', sinFoto: true})}${R.cara('veta', 40)}${R.caras(['marta', 'elena', 'pere', 'nuria'], {max: 3})}</div>`),
      pieza(12, 'Cifra y barras', R.cifra({valor: 156, frase: 'cosas que os dejé listas. Hace un mes, 118.'}) +
        R.barras([{valor: 118, fecha: '26 oct'}, {valor: 127, fecha: '2 nov'}, {valor: 141, fecha: '9 nov'}, {valor: 156, fecha: '16 nov'}])),
      pieza(13, 'Documento', R.doc({foto: 'verdi', datos: ['Lunes 23 de noviembre, 9:00 · Verdi 42, 3.º 2.ª', 'Elena Vives con Laura Martí'], titular: 'Le ha gustado mucho. Quiere volver con su pareja.',
        secciones: [{rotulo: 'Lo que le gustó', lineas: ['La luz del salón', 'La terraza']}, {rotulo: 'Lo que no', lineas: ['El ruido de la calle por la noche']},
          {rotulo: 'Esta semana', filas: [{nombre: 'Visitas', valor: 3}, {nombre: 'Lo ven caro', valor: 3, sub: 'antes 2'}]}]})),
      pieza(14, 'Hoja: acciones, texto y elegir', R.lista([{nombre: 'Hoja de acciones', hoja: 'mu-acciones'}, {nombre: 'Hoja de texto', hoja: 'mu-texto'}, {nombre: 'Hoja de elegir', hoja: 'mu-elegir'}])),
      pieza(15, 'Línea de apoyo: subtítulo y nota', R.sub('Propietario del piso de Verdi 42 · 612 48 39 07') + R.nota('No sale sola: la envías tú.', {candado: true})),
      pieza(16, 'Micro y pasos', R.micro({accion: 'toca'}) + `<div class="mu-fila">${R.pasos(2, 4)}</div>` +
        R.elegir([{id: 'si', texto: 'Le ha gustado'}, {id: 'duda', texto: 'Tiene dudas'}, {id: 'no', texto: 'No le encaja'}], {valor: elegido, accion: 'elige'})),
      pieza(17, 'Interruptor', R.lista([UI.interruptor({texto: 'Avisarme antes de una firma', on: interr, accion: 'interr'}), UI.interruptor({texto: 'Reducir movimiento', on: false, accion: 'toca'})])),
      pieza(18, 'Hecho, aviso y vacío', UI.lineaHecho({texto: 'Enviado a Marta', hora: '9:41', boton: {texto: 'Deshacer', accion: 'toca'}}) +
        R.lista([{nombre: 'Sacar un aviso', accion: 'aviso'}, {nombre: 'Cambiar entre claro y oscuro', accion: 'tema'}]) +
        UI.vacio({titulo: 'Hoy ya no te toca nada.', boton: {texto: 'Cerrar el día', accion: 'toca'}}))
    ].join(''),
    botonFijo: () => R.botones({texto: 'Enviar', accion: 'toca'}, {texto: 'Ahora no', accion: 'toca'}),
    acciones: {
      toca() { VETA.aviso('Tocado.'); },
      aviso() { VETA.aviso('Enviado a Marta.', {deshacer: () => VETA.aviso('Deshecho.')}); },
      filtra(ev, el) { filtro = el.dataset.valor; },
      elige(ev, el) { elegido = el.dataset.valor; },
      interr(ev, el) { interr = el.getAttribute('aria-checked') === 'true'; },
      tema() { VETA.tema.pon({modo: document.documentElement.dataset.modo === 'oscuro' ? 'claro' : 'oscuro'}); }
    }
  });

  // las tres plantillas de hoja, con datos de ejemplo
  VETA.hojaAcciones('mu-acciones', {
    titulo: 'Más',
    opciones: [{texto: 'Ya lo llevé por teléfono', hace: () => VETA.aviso('Resuelto: lo llevaste por teléfono.')}, {texto: 'Para luego', hace: () => VETA.aviso('Para luego.')}, {texto: 'Descartarlo', peligro: true, hace: () => VETA.aviso('Descartado.')}]
  });
  VETA.hojaTexto('mu-texto', {titulo: 'Lo que he leído', bloques: [{texto: 'He leído 8 chats desde ayer. Solo los de trabajo.'}, {titulo: 'Lo que no leo', lista: ['Tus chats personales', 'Los grupos que no has marcado']}]});
  VETA.hojaElegir('mu-elegir', {
    titulo: '¿A quién se lo asignas?',
    opciones: [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'}, {id: 'marc', texto: 'Marc Vidal', sub: 'Sant Gervasi', av: 'marc'}],
    valor: () => 'laura', alElegir: op => VETA.aviso('Asignado a ' + op.texto + '.')
  });
})();
