/* Veta demo · pantallas · veta.js · paquete C (Veta, cuenta y entrada)
   - A8 · Veta · #/veta
   Y las piezas que comparten las pantallas del paquete C (VETA.c): cuentas de chats, estado de reglas,
   la “línea en el sitio” con su Deshacer y el pintado del mapa. Se carga antes que el resto de pantallas de C. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo;
  const lee = (k, d) => VETA.est.lee('c.' + k, d), pon = (k, v) => VETA.est.pon('c.' + k, v);

  // ---- piezas comunes del paquete C ----
  const C = VETA.c = {lee, pon};
  const D = () => VETA.datos.c;
  // chats: los personales que vuelven a entrar (A15b, A18 paso 1) y los clientes que se dejan fuera (modelo)
  C.dentro = () => lee('dentro', []);
  C.leidos = () => M.chatsLeidos() + C.dentro().length;
  C.fuera = () => M.chatsFuera() - C.dentro().length;
  C.lecturaTexto = () => `I read ${VETA.num(C.leidos())} chats · ${C.fuera()} ${C.fuera() === 1 ? 'is' : 'are'} not read`;
  // reglas
  C.info = id => D().reglas[id] || {nombre: 'A job', frase: ''};
  // un solo nombre por trabajo: el del dato (D.reglas[].texto; el de las visitas, en r6-veta.js)
  C.nombre = id => id === 'r-visitas' ? R6().visitas.nombre : ((M.regla(id) || {}).texto || C.info(id).nombre);
  // una sola etiqueta: lo que hago ahora en ese trabajo y desde cuándo (“Te aviso yo · desde el 3 sep”)
  C.hagoDesde = (id, desde) => { const p = VETA.vivo.niveles()[C.paso(id) - 1] || {}; return `${p.enLista || p.nombre} · since ${desde}`; };
  C.fechaPrueba = 'until 7 Dec';
  // nombres de cada estado que entiende un niño de 6 años (ESTRATEGIA_R6 §3 bis)
  C.estadoRegla = r => {
    if (!r) return {etq: 'neutro', texto: ''};
    if (r.estado === 'propuesta') return {etq: 'propuesta', texto: 'My suggestion', lista: 'Shall I do it?'};
    if (r.estado === 'a-prueba') return {etq: 'a-prueba', texto: `I'm trying it · day ${r.hora && !r.dia ? 1 : (r.dia || 1)} of ${r.pruebaDias || 14}`};
    if (r.estado === 'activa') return {etq: 'activa', texto: C.hagoDesde(r.id, r.desde && (C.lee('nivelLinea', null) || {}).id !== r.id ? r.desde : 'today'), desde: r.desde ? r.desde : 'today'};
    if (r.estado === 'descartada') return {etq: 'neutro', texto: 'I no longer do it'};
    return {etq: 'propuesta', texto: 'My suggestion', lista: 'Shall I do it?'};
  };
  // ronda 6 · datos de este paquete y la cosa que se sube de verdad (confirmar las visitas la víspera)
  const R6 = () => VETA.datos.r6.veta;
  C.r6 = R6;
  C.visitas = () => {
    const v = R6().visitas, est = VETA.r6.reglaVisitas();
    const etq = est === 'sola' ? {etq: 'activa', texto: 'I note it down · from today'} : est === 'prueba' ? {etq: 'a-prueba', texto: 'I\'m trying it · from today'} : {etq: 'propuesta', texto: 'My suggestion', lista: 'Shall I do it?'};
    return Object.assign({estado: est, n: v.paso[est], frase: v.frase[est], manana: v.manana[est]}, etq);
  };
  // en qué paso de “¿Quién lo hace?” está cada cosa (1 Solo te aviso … 5 Lo envío yo, cerrado)
  // lo que todavía es una propuesta lo haces tú: paso 1
  C.paso = id => id === 'r-visitas' ? C.visitas().n : (C.lee('nivel', {})[id] || (['propuesta', 'nueva'].includes((M.regla(id) || {}).estado) ? 1 : (R6().pasos[id] || {}).paso || 2));
  C.mini = id => VETA.vivo.escalera({nivel: C.paso(id), mini: true});
  // “Lo que dirección ve de ti” (A14 y A15): la misma ficha que Montse ve de Laura, y lo que no ve
  C.direccionVe = i => {
    // una sola fuente: lo que Montse ve en la ficha de la persona (VETA.dir.personaOps, P3), con las mismas frases
    const yo = VETA.yo(), x = VETA.dir.personaOps(yo.id), h = x.hace || {}, n = x.ops.length;
    const apr = x.aprendido.length + (yo.id === 'laura' && VETA.r6.siempre() ? 1 : 0);
    return `<section class="bloque c-dv"${i != null ? ` data-i="${i}"` : ''}><h2 class="bloque-t">What management sees about you</h2>` +
      `<p class="bloque-sub">Montse sees the same about you as you see here.</p>` + UI.lista([
        {titulo: 'What you handle', sub: (x.ops.length ? x.resumen : 'You have no deals right now.'), icono: 'casa'},
        {titulo: 'What you have pending', sub: x.pendientes ? VETA.dir.tocanTexto(x, true) : 'You have nothing pending today.', icono: 'hoy'},
        {titulo: 'How long you take to reply', sub: x.tarda ? VETA.dir.tardaTexto(x, true) + ' · Example' : 'I do not know yet.', icono: 'reloj'},
        {titulo: 'What Veta already does for you', sub: `${x.total} things I got ready for you last week: ${h.mensajes} messages, ${h.actas} viewing notes and ${h.avisos} alerts`, icono: 'aprende'},
        {titulo: 'What I\'ve learned from you', sub: `${apr} ${apr === 1 ? 'thing' : 'things'}`, icono: 'estrella'}]) +
      UI.nota({texto: 'Management does not see what you write in your chats or your notes. Nor the chats you leave out.', icono: 'candado', caja: true}) + '</section>';
  };
  // la cuenta de lo aprendido que queda
  C.aprendidoQueda = () => D().aprendido.filter(a => !lee('olvidados', []).includes(a.id)).length;
  // la marca dorada con “Ejemplo” al lado
  C.ejemplo = () => UI.etiqueta('ejemplo');
  // calendario conectado (H33)
  C.calendario = () => lee('calendario', null);
  // la pila contiene Cuenta: el primer día va en repaso
  C.repaso = () => VETA.pila().some(x => x.ruta === 'cuenta');

  // ---- A8 · Veta ----
  // dirección abre en “De la oficina”; su “Mías” es suya (sus mensajes y sus chats), nunca la de Laura
  const vista = () => (VETA.yo().papel === 'direccion' ? lee('vetaVista', 'oficina') : 'mias');

  function miasDir() {
    return UI.vacio({titulo: 'Nothing to decide', texto: 'When I see something you do again and again in your chats, I suggest it here.', icono: 'check', i: 0}) + UI.lista([
      {titulo: 'Your week', sub: `I got ${C.semanaDe().preparados} messages ready for you`, icono: 'grafica', ir: 'semana'},
      {titulo: 'Account and privacy', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
    ], {i: 1});
  }
  // la semana de quien mira (Laura: 31 mensajes; Montse: los suyos)
  C.semanaDe = () => VETA.yo().id === 'montse' ? {preparados: 9, enviados: 8, retocados: 2, actas: 1, promesas: 2} : {preparados: 31, enviados: 27, retocados: 6, actas: 3, promesas: 4};

  // A8 · agente (ronda 6): primero lo que ya hago yo, después lo que te propongo y lo que he aprendido
  function mias() {
    if (VETA.yo().papel === 'direccion') return miasDir();
    const s = C.semanaDe(), aa = C.r6().antesAhora, res = M.resumenReglas(), vis = C.visitas();
    const cifra = (n, t, k) => `<li><b>${VETA.vivo.cuenta({de: 0, a: n, clave: 'c-veta-' + k})}</b><span>${esc(t)}</span></li>`;
    const cab = `<section class="c-ya" data-i="0"><h2 class="c-ya-h">What I already prepare</h2><p class="c-ya-s">Last week, without you asking me:</p>` +
      `<ul class="c-ya-n">${cifra(s.preparados, 'messages I wrote for you', 'm')}${cifra(s.promesas, 'promises I noted', 'p')}${cifra(s.actas, 'viewing notes I saved', 'a')}</ul>` +
      `<a class="c-ya-aa" data-ir="antes-ahora" href="#/antes-ahora"><span>When we started you had <b>${aa.antes.valor}</b> things to do per week. Now, <b>${aa.ahora.valor}</b>.</span>${VETA.ic('chev', 16)}</a></section>`;
    const que = `<a class="c-qh-entra" data-i="1" data-ir="que-hace" href="#/que-hace"><span class="c-qh-ic">${VETA.ic('aprende', 26)}</span>` +
      `<span class="c-qh-tx"><b>What Veta does</b><span>All I do for you, with examples from your chats</span></span>${VETA.ic('chev', 16)}</a>`;
    // lo que te propongo: confirmar las visitas el día antes y el informe del piso; mismo nombre y misma pregunta que en Hoy
    const r = M.regla('r-valoraciones'), prop = [];
    prop.push(UI.fila({titulo: R6v().corto, subHtml: vis.estado === 'propuesta' ? `You have done this ${R6v().hechas} times. <b>Shall I do it?</b>` : esc(vis.texto),
      ir: 'regla/r-visitas', clase: 'c-prop-f'}).replace('<span class="fila-c">', `${VETA.vivo.anillo({veces: R6v().hechas, tam: 'm'})}<span class="fila-c">`));
    if (r && r.estado === 'propuesta') prop.push(UI.fila({titulo: r.texto, subHtml: 'You have done this 14 times. <b>Shall I do it?</b>',
      ir: 'regla/r-valoraciones', clase: 'c-prop-f'}).replace('<span class="fila-c">', `${VETA.vivo.anillo({veces: 14, tam: 'm'})}<span class="fila-c">`));
    const propone = UI.bloque({titulo: 'Things I could do for you', i: 2, html: `<div class="lista">${prop.join('')}</div>`});
    // lo aprendido: lo de hoy primero
    const hoy = VETA.r6.siempre(), a0 = C.r6().aprendido['pere-tarde'];
    const apr = UI.bloque({titulo: 'What I\'ve learned from you', i: 3, html: UI.lista([
      hoy ? {titulo: hoy.regla, subHtml: `<b class="c-hoy-t">Today</b> · you taught me${hoy.cuando ? ' at ' + esc(hoy.cuando) : ''}`, icono: 'aprende', ir: 'aprendido'}
        : {titulo: a0.texto, sub: `${a0.quien} ${a0.cuando} · I have used it ${a0.hechas} times`, icono: 'aprende', ir: 'aprendido'},
      {titulo: 'All I have learned', sub: `${C.aprendidoQueda() + (hoy ? 1 : 0)} things`, icono: 'libro', ir: 'aprendido'}])});
    return cab + que + propone + apr + UI.lista([
      {titulo: 'The jobs, one by one', sub: 'you decide who does each one', icono: 'probeta', ir: 'reglas'},
      {titulo: 'Before and now', sub: `from ${aa.antes.valor} things per week to ${aa.ahora.valor}`, icono: 'grafica', ir: 'antes-ahora'},
      {titulo: 'Your week', sub: `I wrote ${s.preparados} messages for you`, icono: 'cal', ir: 'semana'},
      {titulo: 'Account and privacy', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
    ], {i: 4});
  }
  const R6v = () => C.r6().visitas;

  function oficina() {
    const d = M.cosa('d-regla');
    const arriba = d && !M.RESUELTOS.includes(d.estado)
      ? UI.tarjeta(`<div class="c-prop-cab">${UI.etiqueta('por-decidir', 'You have to decide · a job for the office')}</div>` +
          `<p class="c-frase">Flat report the next day</p><p class="c-apoyo">Laura Martí suggests it. Since August there have been 23 valuation requests; she did it by hand 14 times.</p>` +
          UI.boton({texto: 'See the cases and decide', ir: 'regla-oficina/dossier'}), {clase: 'abierta c-propuesta', i: 0})
      : UI.vacio({titulo: 'Nothing to decide in the office', texto: 'When someone suggests a job for everyone, it shows up here.', icono: 'check', i: 0});
    const n = D().practicas.length + (lee('practicaClaudia', false) ? 1 : 0);
    return arriba + UI.lista([
      {titulo: 'How we work', sub: `${n} ways of working`, icono: 'libro', ir: 'oficina/practicas'},
      {titulo: 'What the office learns', sub: 'Where deals stall', icono: 'grafica', ir: 'oficina/aprende'},
      {titulo: 'What Veta doesn\'t do yet', sub: '43 times by hand', icono: 'mano', ir: 'oficina/falta'},
      {titulo: 'What your office knows', sub: 'Of 301 contacts, 212 viewings', icono: 'ojo', ir: 'oficina/sabe'},
      {titulo: 'What Veta does for your office', sub: 'All I do, with examples from the office', icono: 'aprende', ir: 'oficina-que-hace'}
    ], {i: 1});
  }

  VETA.pantalla('A8', {
    titulo: 'Veta',
    guia: ['Here you see what I already do for you, what I could do for you, and what I\'ve learned.', 'You decide what I do and what you do, step by step.', 'This way you have less work each week.'],
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion';
      const sel = dir ? `<div class="c-sel" data-i="0">${UI.selector({etiqueta: 'What to see', opciones: [{id: 'mias', texto: 'Mine'}, {id: 'oficina', texto: 'From the office'}], valor: vista(), accion: 'vista'})}</div>` : '';
      return sel + `<div class="c-vista" id="c-vista">${vista() === 'oficina' ? oficina() : mias()}</div>`;
    },
    acciones: {
      vista(ev, el) {
        pon('vetaVista', el.dataset.valor);
        const caja = document.getElementById('c-vista'); if (!caja) return;
        const pinta = () => { caja.innerHTML = el.dataset.valor === 'oficina' ? oficina() : mias(); VETA.mov.cascada(caja); };
        if (VETA.mov.hayVT() && !VETA.reducido()) { caja.style.viewTransitionName = 'c-vista'; document.startViewTransition(pinta).finished.finally(() => { caja.style.viewTransitionName = ''; }); }
        else pinta();
      }
    }
  });
})();
