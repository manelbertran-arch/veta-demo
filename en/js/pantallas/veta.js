/* Veta demo · pantallas · veta.js · paquete C (Veta, cuenta y entrada)
   - A8 · Veta · #/veta
   Y las piezas que comparten las pantallas del paquete C (VETA.c): cuentas de chats, estado de reglas,
   la «línea en el sitio» con su Deshacer y el pintado del mapa. Se carga antes que el resto de pantallas de C. */
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
  // una sola etiqueta: lo que hago ahora en ese trabajo y desde cuándo («Te aviso yo · desde el 3 sep»)
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
  // en qué paso de «¿Quién lo hace?» está cada cosa (1 Solo te aviso … 5 Lo envío yo, cerrado)
  // lo que todavía es una propuesta lo haces tú: paso 1
  C.paso = id => id === 'r-visitas' ? C.visitas().n : (C.lee('nivel', {})[id] || (['propuesta', 'nueva'].includes((M.regla(id) || {}).estado) ? 1 : (R6().pasos[id] || {}).paso || 2));
  C.mini = id => VETA.vivo.escalera({nivel: C.paso(id), mini: true});
  // «Lo que dirección ve de ti» (A14 y A15): la misma ficha que Montse ve de Laura, y lo que no ve
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
  // la marca dorada con «Ejemplo» al lado
  C.ejemplo = () => UI.etiqueta('ejemplo');
  // calendario conectado (H33)
  C.calendario = () => lee('calendario', null);
  // la pila contiene Cuenta: el primer día va en repaso
  C.repaso = () => VETA.pila().some(x => x.ruta === 'cuenta');

  // ---- A8 · Veta ----
  // ronda 7 · una pantalla corta de puertas: lo que puedes hacer con Veta, con su número. Lo demás, un toque más allá.
  // La primera puerta es enseñarle: es lo que la hace mejor, y no puede quedar escondido.
  // la semana de quien mira (Laura: 31 mensajes; Montse: los suyos)
  C.semanaDe = () => VETA.yo().id === 'montse' ? {preparados: 9, enviados: 8, retocados: 2, actas: 1, promesas: 2} : {preparados: 31, enviados: 27, retocados: 6, actas: 3, promesas: 4};
  const cortaFrase = t => { t = String(t || '').replace(/\.$/, ''); return t.length > 58 ? t.slice(0, 56).replace(/\s+\S*$/, '') + '…' : t; };

  function puertasAgente() {
    const aa = C.r6().antesAhora, vis = C.visitas(), r = M.regla('r-valoraciones');
    const nProp = (vis.estado === 'propuesta' ? 1 : 0) + (r && r.estado === 'propuesta' ? 1 : 0);
    const hoy = VETA.r6.siempre(), nApr = C.aprendidoQueda() + (hoy ? 1 : 0), a0 = C.r6().aprendido['pere-tarde'];
    return UI.puertas([
      {principal: true, icono: 'mic', titulo: 'Teach it something new', sub: 'You say it out loud. Veta makes a proposal and you decide.', ir: 'dictar/orden',
        g: 'Teach it something new|An instruction spoken in your voice becomes one of its jobs.'},
      nProp ? {icono: 'estrella', titulo: 'Decide on proposals', sub: 'Jobs you repeat that Veta could do.', n: nProp, ir: 'reglas'}
        : {icono: 'probeta', titulo: 'See its jobs, one by one', sub: 'You decide who does each one.', ir: 'reglas'},
      {icono: 'tarea', titulo: 'See what it does for you', sub: 'What it does alone, what you do together and what it cannot do yet.', ir: 'que-hace'},
      {icono: 'libro', titulo: 'See what it learned', sub: hoy ? 'Today: ' + cortaFrase(hoy.regla) + '.' : cortaFrase(a0.texto) + '.', n: nApr, ir: 'aprendido'},
      {icono: 'grafica', titulo: 'Compare before and now', sub: `From ${aa.antes.valor} things per week to ${aa.ahora.valor}.`, ir: 'antes-ahora'}
    ], {i: 1, panel: 'que-hace'}) + UI.menores([
      {titulo: 'Your week', icono: 'cal', ir: 'semana'},
      {titulo: 'Account and privacy', icono: 'escudo', ir: 'cuenta'}], {i: 2});
  }

  function puertasDireccion() {
    const d = M.cosa('d-regla'), decide = d && !M.RESUELTOS.includes(d.estado);
    const n = D().practicas.length + (lee('practicaClaudia', false) ? 1 : 0);
    const propone = VETA.dir && VETA.dir.laPropuso && VETA.dir.laPropuso() ? 'Proposed by Laura.' : 'Proposed by Veta.';
    return UI.puertas([
      {principal: true, icono: 'mic', titulo: 'Teach it something new', sub: 'You say it out loud. Veta makes a proposal and you decide.', ir: 'dictar/orden',
        g: 'Teach it something new|An instruction spoken in your voice becomes one of its jobs.'},
      decide ? {icono: 'estrella', titulo: 'Decide on a job', sub: 'Flat report the next day. ' + propone, n: 1, ir: 'regla-oficina/dossier'} : null,
      {icono: 'tarea', titulo: 'See what it does for all', sub: 'What it does alone, what you do together and what it cannot do yet.', ir: 'oficina-que-hace'},
      {icono: 'mano', titulo: 'See manual work', sub: 'Work the team repeats that Veta could learn.', n: 43, ir: 'oficina/falta'},
      {icono: 'libro', titulo: 'See how we work', sub: 'The practices the team uses.', n, ir: 'oficina/practicas'}
    ], {i: 1, panel: 'oficina-que-hace'}) + UI.menores([
      {titulo: 'What the office learns', icono: 'grafica', ir: 'oficina/aprende'},
      {titulo: 'What your office knows', icono: 'ojo', ir: 'oficina/sabe'},
      {titulo: 'Your week', icono: 'cal', ir: 'semana'},
      {titulo: 'Account and privacy', icono: 'escudo', ir: 'cuenta'}], {i: 2});
  }

  VETA.pantalla('A8', {
    titulo: 'Veta',
    guia: ['Here you see, in a few doors, what you can do with Veta.', 'You tap one: teach it something new, decide on what it proposes, or see what it does and what it has learned.', 'This way you know from the start what Veta does and how to make it better.'],
    pinta: () => VETA.yo().papel === 'direccion' ? puertasDireccion() : puertasAgente()
  });
})();
