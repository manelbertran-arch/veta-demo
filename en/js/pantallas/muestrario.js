/* Veta demo · pantallas · muestrario.js (núcleo)
   #/muestrario: fuera del mapa. Todos los componentes de la sección 5.3, la tarjeta de la cola con sus seis tipos,
   las cinco plantillas, las hojas y los 16 efectos de movimiento para tocar. Lo que se toca aquí no cambia la demo:
   las tarjetas de muestra llevan su propio estado. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  const local = {};                                  // estado de las tarjetas de muestra
  let ventana = '7d', cifra = 156, carga = false, ondaPausa = false;

  const muestra = id => {
    const c = VETA.modelo.cosa(id); if (!c) return null;
    const e = local[id] || {estado: 'por-hacer'};
    return Object.assign({}, c, {id: 'mu-' + id, base: id, estado: e.estado, hora: e.hora, extra: e.extra || {}});
  };
  const sec = (titulo, html, cod) => `<section class="mu-sec bloque"><h2 class="bloque-t">${esc(titulo)}${cod ? ` <span class="mu-cod">${esc(cod)}</span>` : ''}</h2>${html}</section>`;
  const baseDe = el => String(el.dataset.de || '').replace(/^mu-/, '');
  const pon = (el, estado, extra) => { const id = baseDe(el); local[id] = {estado, hora: VETA.ahora(), extra: Object.assign({}, (local[id] || {}).extra, extra || {})}; VETA.repinta({hecho: 'mu-' + id}); };

  // ---- ronda 6 · piezas vivas (VETA.vivo): todas a la vista y con su botón para probarlas ----
  let vNivel = 2, vLleva = false;
  const pieza = (rotulo, html) => `<p class="v-mu-r">${esc(rotulo)}</p>${html}`;
  const vivas = () => {
    const Vv = VETA.vivo, m = VETA.modelo.cosa('c-marta');
    const fila = (id, t, sub) => UI.fila({titulo: t, sub, av: id, vt: 'mu-v-' + id, datos: {muda: '1'}});
    const mias = [vLleva ? null : fila('elena', 'Elena Vives', 'Confirm tomorrow\'s viewing'), fila('marta', 'Marta Puig', 'Reply: asks to see the flat'), fila('pere', 'Pere Soler', 'Send the weekly report')].filter(Boolean);
    return `<div class="v-mu">` +
      pieza('1 · Gold: the line is drawn once under the sentence that proves something', `<p class="hoja-x">Marta wrote: “${Vv.marca(m.cita.texto + ', morning is better', 'We could see it this Saturday')}”.</p>`) +
      pieza('2 · Ring: cases counted or times seen, in three sizes', `<div class="v-mu-fila">${Vv.anillo({van: 11, de: 14, tam: 's', texto: '11 of 14 cases'})}${Vv.anillo({van: 11, de: 14})}${Vv.anillo({veces: 9})}${Vv.anillo({van: 11, de: 14, tam: 'l'})}</div>`) +
      pieza('3 · Ladder: small (in a line) and full, with the cases first so you can go up', `<p class="hoja-x">Confirm viewings: ${Vv.escalera({nivel: vNivel, desde: '12 Nov', mini: true})}</p>` +
        UI.tarjeta(Vv.escalera({nivel: vNivel, desde: vNivel === 2 ? '12 Nov' : 'today', sube: {hechas: 14, corregidas: 1, pregunta: vNivel === 2 ? 'Shall I note the viewing down without asking you?' : 'Shall I leave it ready to send with one tap?', boton: 'Yes, go up a step', accion: 'v-sube'}})) +
        (vNivel > 2 ? UI.boton({tipo: 'texto', texto: 'Back to step 2', accion: 'v-baja'}) : '')) +
      pieza('4 · Thread: she said → I prepared → you decided → I learned', UI.tarjeta(Vv.hilo([
        {paso: 'She said', texto: '“' + m.cita.texto + '”', cuando: m.cita.origen},
        {paso: 'I prepared', texto: 'The reply, with day and time: Saturday at 11:00.'},
        {paso: 'You decided', texto: 'You changed “when suits you?” to two exact times.'},
        {paso: 'I learned', texto: 'When you suggest a viewing, I give two times.', cuando: 'Example'}]))) +
      pieza('5 · Count: the number rolls from one value to another', `<p class="hoja-x">Today you have <b>${Vv.cuenta({de: 9, a: 6})}</b> · a month ago, 9.</p>`) +
      pieza('6 · Before and now: two columns and the six-week line', UI.tarjeta(Vv.antesAhora({
        antes: {rotulo: 'The first day', valor: 46, unidad: 'things for you per week'}, ahora: {rotulo: 'Today', valor: 21, unidad: 'things for you per week'}, semanas: [46, 41, 37, 30, 25, 21]}))) +
      pieza('7 · “Veta reads” scene: the messages fall, the gold underlines and the sentence becomes the card', Vv.escena({ir: 'muestrario/abierta', boton: 'See the card'})) +
      pieza('8 · Pulse (Veta working) and halo while it listens', `<div class="v-mu-fila">${Vv.pulso({ahora: 'Reading 3 new chats…', texto: 'Up to date · read up to ' + VETA.ahora(-3)})}</div>` +
        UI.boton({tipo: 'secundario', texto: 'Listen for 3 seconds', accion: 'v-halo', icono: 'mic'})) +
      pieza('9 · Step: the row moves to another block, the list moves around and the card opens from its place',
        `<div class="tarjeta"><h3 class="bloque-t">For you today · ${Vv.cuenta({de: vLleva ? 3 : 2, a: vLleva ? 2 : 3, clave: 'mu-v-n' + vLleva})}</h3>${UI.lista(mias)}` +
        `<h3 class="bloque-t">I'll handle it</h3>${vLleva ? UI.lista([fila('elena', 'Elena Vives', 'Viewing confirmed · I did it')]) : '<p class="bloque-sub">Nothing yet.</p>'}</div>` +
        UI.boton({tipo: 'secundario', texto: vLleva ? 'Give it back to me' : 'Let Veta confirm the viewings', accion: 'v-lleva'}) +
        `<div class="tarjeta" data-foco="tarjeta"><div class="v-es-quien">${VETA.av('marta', 40)}<span><b>${esc(m.titulo)}</b><span>${esc(m.quienEs)}</span></span></div>` +
        UI.boton({tipo: 'secundario', texto: 'Open from its place', ir: 'muestrario/abierta'}) + `</div>`) +
      pieza('10 · Alert with undo: countdown ring; when you undo, it teaches', UI.boton({tipo: 'secundario', texto: 'Close something and undo', accion: 'v-aviso'})) +
      pieza('11 · “Where it comes from” (H01): the exact sentence underlined and the date in a pill', UI.tarjeta(UI.cita({texto: m.cita.texto, origen: m.cita.origen, de: 'c-marta'}))) +
      UI.boton({tipo: 'texto', texto: 'Draw it all again', accion: 'v-otra'}) + `</div>`;
  };
  VETA.pantalla('muestrario-abierta', {
    ruta: 'muestrario/abierta', titulo: 'Marta Puig', destino: null, grupo: 'Core',
    guia: ['Here you see a card that has opened from its place.', 'You go back.', 'This is how data-foco="tarjeta" is used.'],
    pinta: () => { const m = VETA.modelo.cosa('c-marta'); return `<div class="tarjeta" data-foco="tarjeta" data-i="0"><div class="v-es-quien">${VETA.av('marta', 40)}<span><b>${esc(m.titulo)}</b><span>${esc(m.quienEs)}</span></span></div>` +
      UI.cita({texto: m.cita.texto, origen: m.cita.origen, de: 'c-marta'}) + UI.borrador({texto: m.borrador}) + `</div><p class="intro" data-i="1">The card on the previous screen and this one both have data-foco="tarjeta": it travels and grows to its place.</p>`; }
  });

  VETA.pantalla('muestrario', {
    ruta: 'muestrario', titulo: 'Showcase', destino: null, ancha: true, grupo: 'Core',
    guia: ['Here are all the core components.', 'You tap them to see how they respond.', 'That way the packages know what to use.'],
    pinta: () => {
      const yo = VETA.yo();
      const tipos = ['c-marta', 'c-elena', 'c-pere', 'c-nuria', 'c-jordi', 'c-sergi'].map(muestra);
      const hojas = Object.values(VETA.HOJAS);
      return [
        `<p class="intro" data-i="0">Everything the core gives the packages. Whatever you tap here doesn't change the demo.</p>`,
        sec('Live parts', vivas(), 'ronda 6 · VETA.vivo'),
        sec('Destination band', `<div class="mu-banda"><div class="cab cab-banda"><span class="cab-t">Today</span><span class="cab-yo">${VETA.av(yo.id, 36, {aro: true})}</span></div></div>`),
        sec('Detail header', `<div class="mu-banda"><div class="cab cab-detalle"><button type="button" class="cab-atras" data-accion="toca">${VETA.ic('atras', 20)}</button><span class="cab-t">Pere Soler</span><span class="cab-der"></span></div></div>`),
        sec('Bar and “Dictate” mic', `<div class="mu-barra"><div class="barra"><div class="tabs">` +
          [['hoy', 'Today', 'hoy', 3], ['clientes', 'Clients', 'clientes'], ['aprende', 'Veta', 'veta']].map(([ic, t, k, n], i) =>
            `<button type="button" class="tab${i === 0 ? ' on' : ''}" data-accion="toca"><span class="tab-ic">${VETA.ic(ic, 24)}${n ? `<span class="contador"><span class="contador-n">${n}</span></span>` : ''}</span><span class="tab-p">${t}</span></button>`).join('') +
          `</div><button type="button" class="mic" data-accion="toca" aria-label="Dictate"><span class="mic-c">${VETA.ic('mic', 26)}</span><span class="mic-p">Dictate</span></button></div></div>`),
        sec('Buttons', UI.boton({texto: 'Primary button', accion: 'toca'}) + UI.botones([{texto: 'Secondary', accion: 'toca'}, {texto: 'Other', accion: 'toca'}]) +
          `<div class="mu-fila">${UI.boton({tipo: 'texto', texto: 'Undo', accion: 'toca'})}${UI.boton({tipo: 'texto', texto: 'I didn\'t send it', accion: 'toca'})}${UI.boton({tipo: 'redondo', texto: 'Call', icono: 'telefono', accion: 'toca'})}${UI.boton({tipo: 'redondo', texto: 'WhatsApp', icono: 'chat', accion: 'toca'})}</div>`),
        sec('Tags', `<div class="mu-fila">${Object.keys(UI.ETIQUETAS).map(k => UI.etiqueta(k)).join('')}</div>`),
        sec('Rows and list', UI.lista([
          {titulo: 'Pere Soler', sub: 'Owner of the Verdi 42 flat', av: 'pere', ir: 'muestrario/lista', focoFoto: true},
          {titulo: 'Carmen López', sub: 'Initials when there\'s no photo', av: 'carmen', etiqueta: 'te-toca', ir: 'muestrario/lista'},
          {titulo: 'Verdi 42, 3.º 2.ª', sub: 'With a flat thumbnail', foto: 'verdi', derecha: '€395,000', ir: 'muestrario/lista'},
          {titulo: 'With an icon', sub: 'And without “›” because it isn\'t tappable', icono: 'reloj'}])),
        sec('Card', UI.tarjeta(`<p class="hoja-x">Radius 20, thin border and shadow. One open per screen.</p>`)),
        sec('Quote and draft', UI.cita({texto: 'Is the Gràcia flat still available? We could see it this Saturday', origen: 'Marta · yesterday, 18:42', de: 'c-marta'}) +
          UI.borrador({texto: 'Hi Marta, it\'s Laura. Does this Saturday at 11:00 work for you to see the Gràcia flat?'}) +
          UI.borrador({html: 'Hi Jordi, it\'s Laura. Here is the flat report: floor plans, land registry extract <mark>and community fees</mark>.'}) +
          UI.nota({texto: 'It doesn\'t go out until you send it', icono: 'candado'}) + UI.nota({texto: 'Alert with a padlock, boxed.', icono: 'candado', caja: true})),
        sec('Done line', UI.lineaHecho({texto: 'Sent to Marta', hora: VETA.ahora(), hoja: 'h03', de: 'c-marta', boton: {texto: 'I didn\'t send it', accion: 'toca'}})),
        sec('The queue card · six types', tipos.map((c, k) => UI.tarjetaCosa(c, {n: k + 1, total: 6})).join('')),
        sec('Big figure and eight numbers', UI.cifra({valor: cifra, unidad: 'cases prepared', periodo: 'last 7 days', id: 'mu-cifra'}) +
          UI.boton({tipo: 'secundario', texto: 'Roll the figure', accion: 'rueda'}) +
          UI.selector({etiqueta: 'Period', opciones: [{id: '7d', texto: 'Last 7 days'}, {id: 'desde', texto: 'Since 3 Oct'}], valor: ventana, accion: 'ventana'}) +
          UI.ochoNumeros(ventana)),
        sec('Step bar', UI.pasos({hecho: 3, total: 5, texto: 'Sale · Viewings · step 3 of 5'})),
        sec('Field, switch and two-way selector', UI.campo({etiqueta: 'Name', placeholder: 'Type here'}) + UI.campo({buscar: true, placeholder: 'Ask Veta about a client'}) +
          UI.campo({etiqueta: 'Message', area: true, valor: 'Hi Marta, it\'s Laura.'}) +
          UI.interruptor({texto: 'Guide', sub: 'Explains what you tap', on: VETA.guia.on(), accion: 'guia'}) +
          UI.selector({etiqueta: 'Which clients', opciones: [{id: 'mios', texto: 'Mine'}, {id: 'todos', texto: 'All'}], valor: 'mios', accion: 'toca'})),
        sec('Photos and avatars', `<div class="mu-fila">${UI.foto('verdi', {tam: 'mini', ampliar: true})}${UI.foto('atico', {tam: 'mini', ampliar: true})}<span class="foto foto-mini" aria-label="No photo"><i class="foto-res">${VETA.ic('casa', 24)}</i></span></div>` +
          UI.foto('verdi', {tam: 'ancha'}) +
          `<div class="mu-fila">${VETA.av('laura', 32)}${VETA.av('laura', 36, {aro: true})}${VETA.av('marta', 40)}${VETA.av('pere', 64)}${VETA.av('montse', 40)}${VETA.av('toni', 64)}</div>`),
        sec('Screen states', (carga ? UI.silueta(3) : UI.tarjeta('<p class="hoja-x">The content has already arrived.</p>')) +
          UI.boton({tipo: 'secundario', texto: 'Load again', accion: 'carga'}) +
          UI.vacio({titulo: 'That\'s all for today', texto: 'A sentence that says what\'s happening and what the next step is.', icono: 'check'}) +
          UI.error({texto: 'I couldn\'t load this.'}) + `<div class="lista">${UI.sinRed()}</div>`),
        sec('Dictation wave', `<div class="mu-fila">${UI.onda({pausada: ondaPausa})}${UI.boton({tipo: 'secundario', texto: ondaPausa ? 'Continue' : 'Pause', accion: 'onda', ancho: false})}</div>`),
        sec('The 16 effects', `<div class="mu-efectos">` + [
          ['1 · Press', 'toca'], ['2 · Go forward', 'ir-lista'], ['3 · Switch tab', 'pestana'], ['4 · Travelling photo', 'foco'],
          ['5 · Cascade', 'cascada'], ['6 · Sheet', 'hoja'], ['7 · Done in place', 'hecho'], ['8 · Black alert', 'aviso'],
          ['9 · Rolling figure', 'rueda'], ['10 · Shadow on scroll', 'baja'], ['11 · Shrinking photo', 'encoge'], ['12 · Silhouette', 'carga'],
          ['13 · Wave', 'onda'], ['14 · Home', 'portada'], ['15 · Switch', 'guia-demo'], ['16 · Theme', 'tema']
        ].map(([t, a]) => UI.boton({tipo: 'secundario', texto: t, accion: a})).join('') + '</div>' +
          `<div class="mu-informe" id="mu-informe"><p>Scroll inside this box: the photo shrinks as it leaves (effect 11).</p>${UI.foto('verdi', {tam: 'ancha'}).replace('class="foto foto-ancha', 'class="foto foto-ancha foto-encoge')}<p>Report text that continues below the photo.</p><p>More text.</p><p>And more text so you can scroll.</p><p>End.</p></div>`),
        sec('Templates', UI.lista([
          {titulo: 'List screen', sub: 'VETA.lista', ir: 'muestrario/lista', icono: 'hoy'},
          {titulo: 'Confirmation screen', sub: 'VETA.confirma', ir: 'muestrario/confirma', icono: 'check'},
          {titulo: 'Action sheet', sub: 'VETA.hojaAcciones', hoja: 'mu-acciones', icono: 'puntos'},
          {titulo: 'Text sheet', sub: 'VETA.hojaTexto', hoja: 'mu-texto', icono: 'doc'},
          {titulo: 'Choice sheet', sub: 'VETA.hojaElegir', hoja: 'mu-elegir', icono: 'usuario'}])),
        sec('The 42 sheets', UI.lista(hojas.map(h => ({titulo: h.titulo, sub: h.cod + ' · ' + (VETA.hojaDefs[h.id] ? 'done' : 'pending from package ' + h.paq), hoja: h.id,
          datos: h.id === 'h01' || h.id === 'h02' ? {de: 'c-marta'} : h.id === 'h17' ? {piso: 'verdi'} : h.id === 'h29' ? {texto: 'acuerdo'} : h.id === 'h41' ? {parte: 'socios'} : null}))))
      ].join('');
    },
    acciones: {
      toca() {},
      // tarjetas de muestra: su propio estado
      principal(ev, el) { const c = VETA.modelo.cosa(baseDe(el)); pon(el, c && c.sale ? 'pregunta-envio' : 'done'); },
      'si-enviado'(ev, el) { pon(el, 'enviada'); }, 'ya-lo-envie'(ev, el) { pon(el, 'enviada'); },
      'todavia-no'(ev, el) { pon(el, 'por-hacer'); }, 'no-lo-envie'(ev, el) { delete local[baseDe(el)]; VETA.repinta({hecho: el.dataset.de}); },
      deshacer(ev, el) { delete local[baseDe(el)]; VETA.repinta({hecho: el.dataset.de}); },
      quitar(ev, el) { pon(el, 'quitada'); },
      copiar(ev, el) { VETA.aviso('Text copied. Send it from your WhatsApp.'); pon(el, 'por-hacer', {boton: {texto: 'I\'ve sent it', accion: 'ya-lo-envie'}, secundarios: [{texto: 'Copy again', accion: 'copiar'}]}); },
      // piezas vivas
      'v-sube'() { vNivel = Math.min(vNivel + 1, 4); VETA.repinta({paso: true}); },
      'v-baja'() { vNivel = 2; VETA.repinta({paso: true}); },
      'v-lleva'() { vLleva = !vLleva; VETA.repinta({paso: true}); },
      'v-halo'() { VETA.vivo.halo(true); setTimeout(() => VETA.vivo.halo(false), 3000); },
      'v-aviso'() { VETA.aviso('Closed: Marta has already replied.', {deshacer: () => {}, ensena: 'Got it: I won\'t close it without asking you.'}); },
      'v-otra'() { VETA.vivo.olvida(); VETA.repinta(); },
      // efectos
      'ir-lista'() { VETA.ir('muestrario/lista'); },
      pestana() { VETA.ir('clientes', {pestana: true}); },
      foco() { const f = VETA.$('.col.activa .fila[data-ir="muestrario/lista"]'); if (f) f.click(); },
      cascada() { VETA.mov.cascada(VETA.$('.col.activa .pant')); },
      hoja() { VETA.hoja('h26'); },
      hecho() { const b = VETA.$('.col.activa .tc [data-accion="principal"]'); if (b) { b.scrollIntoView({block: 'center'}); b.click(); } },
      aviso() { VETA.aviso('Text copied.', {deshacer: () => VETA.aviso('Deshecho.')}); },
      rueda() { cifra = cifra === 156 ? 1012 : 156; VETA.rueda(document.getElementById('mu-cifra'), cifra); },
      ventana(ev, el) { ventana = el.dataset.valor; VETA.modelo.numeros(ventana).forEach((n, k) => VETA.rueda(VETA.$('.col.activa [data-n8="' + k + '"]'), n.valor)); },
      baja() { const d = VETA.$('.col.activa .desplaza'); if (d) d.scrollBy({top: 240, behavior: VETA.reducido() ? 'auto' : 'smooth'}); },
      encoge() { const m = document.getElementById('mu-informe'); if (m) { m.scrollIntoView({block: 'center'}); m.scrollBy({top: 200, behavior: VETA.reducido() ? 'auto' : 'smooth'}); } },
      carga() { carga = true; VETA.repinta(); setTimeout(() => { carga = false; VETA.repinta(); }, 1200); },
      onda() { ondaPausa = !ondaPausa; const o = VETA.$('.col.activa .onda'); if (o) o.classList.toggle('pausada', ondaPausa); const b = VETA.$('.col.activa [data-accion="onda"].btn-suelto span'); if (b) b.textContent = ondaPausa ? 'Continue' : 'Pause'; },
      portada() { VETA.est.pon('portadaVista', false); VETA.ir('portada'); },
      guia(ev, el) { VETA.guia.pon(el.getAttribute('aria-checked') === 'true'); },
      'guia-demo'() { const i = VETA.$('.col.activa .interr'); if (i) { i.scrollIntoView({block: 'center'}); i.click(); } },
      tema() { VETA.tema.pon({modo: document.documentElement.dataset.modo === 'oscuro' ? 'claro' : 'oscuro'}); }
    }
  });

  // las plantillas, con datos de ejemplo
  VETA.lista('muestrario-lista', {
    ruta: 'muestrario/lista', titulo: 'Pere Soler', destino: null, grupo: 'Core',
    cabDerecha: () => VETA.av('pere', 32, {foco: 'foto'}),
    guia: ['Here you see a screen built only from data.', 'You tap a row.', 'That\'s how the priority 2 ones are built.'],
    intro: 'A list screen: blocks with a title and rows. The header photo is the one that travelled from the row.',
    bloques: [{titulo: 'Latest', filas: [{titulo: 'Report sent', sub: 'Mon 16', icono: 'papel', hoja: 'h41', datos: {parte: 'socios'}}, {titulo: 'Message', sub: 'Sat 21, 21:10', icono: 'chat'}]},
      {titulo: 'More', filas: [{titulo: 'Go to the confirmation', ir: 'muestrario/confirma', icono: 'check'}]}],
    pie: 'Example with made-up data.'
  });
  VETA.confirma('muestrario-confirma', {
    ruta: 'muestrario/confirma', titulo: 'Handing over their clients', destino: null, grupo: 'Core',
    texto: 'A confirmation screen: what\'s going to happen, the details and a button.',
    filas: [{titulo: '34 conversations', sub: 'From Teresa Gil to Laura Martí', av: 'teresa'}, {titulo: '3 viewings this week', icono: 'cal'}],
    nota: 'Nobody receives anything until you approve it.',
    boton: {texto: 'Hand the clients over to Laura'},
    alConfirmar: () => ({aviso: 'Clients handed over to Laura.'})
  });
  VETA.hojaAcciones('mu-acciones', {
    titulo: 'Marta Puig', texto: 'An action sheet: options as 56 px rows.',
    opciones: [{texto: 'I already handled it by phone', hace: () => VETA.aviso('Resolved · you handled it by phone.')}, {texto: 'See the profile', sub: 'Opens another screen', ir: 'muestrario/lista'}, {texto: 'Dismiss it', peligro: true, hace: () => VETA.aviso('Descartado.')}]
  });
  VETA.hojaTexto('mu-texto', {titulo: 'A text sheet', bloques: [{texto: 'Text blocks with an optional title.'}, {titulo: 'With a list', lista: ['One', 'Two', 'Three']}]});
  VETA.hojaElegir('mu-elegir', {
    titulo: 'Who do you assign it to?', texto: 'A choice sheet.',
    opciones: [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'}, {id: 'marc', texto: 'Marc Roca', sub: 'Sant Gervasi', av: 'marc'}],
    valor: () => 'laura', alElegir: op => VETA.aviso('Assigned to ' + op.texto + '.')
  });
})();
