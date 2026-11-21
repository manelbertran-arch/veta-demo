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
  C.lecturaTexto = () => `Leo ${VETA.num(C.leidos())} chats · ${C.fuera()} no ${C.fuera() === 1 ? 'lo' : 'los'} leo`;
  // reglas
  C.info = id => D().reglas[id] || {nombre: 'Un trabajo', frase: ''};
  // un solo nombre por trabajo: el del dato (D.reglas[].texto; el de las visitas, en r6-veta.js)
  C.nombre = id => id === 'r-visitas' ? R6().visitas.nombre : ((M.regla(id) || {}).texto || C.info(id).nombre);
  // una sola etiqueta: lo que hago ahora en ese trabajo y desde cuándo («Te aviso yo · desde el 3 sep»)
  C.hagoDesde = (id, desde) => { const p = VETA.vivo.niveles()[C.paso(id) - 1] || {}; return `${p.enLista || p.nombre} · desde ${desde}`; };
  C.fechaPrueba = 'hasta el 7 dic';
  // nombres de cada estado que entiende un niño de 6 años (ESTRATEGIA_R6 §3 bis)
  C.estadoRegla = r => {
    if (!r) return {etq: 'neutro', texto: ''};
    if (r.estado === 'propuesta') return {etq: 'propuesta', texto: 'Te lo propongo', lista: '¿Lo hago yo?'};
    if (r.estado === 'a-prueba') return {etq: 'a-prueba', texto: `Lo estoy probando · día ${r.hora && !r.dia ? 1 : (r.dia || 1)} de ${r.pruebaDias || 14}`};
    if (r.estado === 'activa') return {etq: 'activa', texto: C.hagoDesde(r.id, r.desde && (C.lee('nivelLinea', null) || {}).id !== r.id ? 'el ' + r.desde : 'hoy'), desde: r.desde ? 'el ' + r.desde : 'hoy'};
    if (r.estado === 'descartada') return {etq: 'neutro', texto: 'Ya no lo hago'};
    return {etq: 'propuesta', texto: 'Te lo propongo', lista: '¿Lo hago yo?'};
  };
  // ronda 6 · datos de este paquete y la cosa que se sube de verdad (confirmar las visitas la víspera)
  const R6 = () => VETA.datos.r6.veta;
  C.r6 = R6;
  C.visitas = () => {
    const v = R6().visitas, est = VETA.r6.reglaVisitas();
    const etq = est === 'sola' ? {etq: 'activa', texto: 'Lo apunto yo · desde hoy'} : est === 'prueba' ? {etq: 'a-prueba', texto: 'Lo estoy probando · desde hoy'} : {etq: 'propuesta', texto: 'Te lo propongo', lista: '¿Lo hago yo?'};
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
    return `<section class="bloque c-dv"${i != null ? ` data-i="${i}"` : ''}><h2 class="bloque-t">Lo que dirección ve de ti</h2>` +
      `<p class="bloque-sub">Montse ve de ti lo mismo que ves tú aquí.</p>` + UI.lista([
        {titulo: 'Lo que llevas', sub: (x.ops.length ? x.resumen : 'Ahora no llevas ninguna operación.'), icono: 'casa'},
        {titulo: 'Lo que tienes pendiente', sub: x.pendientes ? VETA.dir.tocanTexto(x, true) : 'Hoy no tienes nada pendiente.', icono: 'hoy'},
        {titulo: 'Cuánto tardas en contestar', sub: x.tarda ? VETA.dir.tardaTexto(x, true) + ' · Ejemplo' : 'Todavía no lo sé.', icono: 'reloj'},
        {titulo: 'Lo que Veta ya hace por ti', sub: `${x.total} cosas que te dejé listas esta semana: ${h.mensajes} mensajes, ${h.actas} notas de visita y ${h.avisos} avisos`, icono: 'aprende'},
        {titulo: 'Lo que he aprendido de ti', sub: `${apr} ${apr === 1 ? 'cosa' : 'cosas'}`, icono: 'estrella'}]) +
      UI.nota({texto: 'No ve lo que escribes en tus chats ni tus notas. Tampoco los chats que dejas fuera.', icono: 'candado', caja: true}) + '</section>';
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
  // dirección abre en «De la oficina»; su «Mías» es suya (sus mensajes y sus chats), nunca la de Laura
  const vista = () => (VETA.yo().papel === 'direccion' ? lee('vetaVista', 'oficina') : 'mias');

  function miasDir() {
    return UI.vacio({titulo: 'Nada por decidir', texto: 'Cuando vea algo que se repite en tus chats, te lo propongo aquí.', icono: 'check', i: 0}) + UI.lista([
      {titulo: 'Tu semana', sub: `te preparé ${C.semanaDe().preparados} mensajes`, icono: 'grafica', ir: 'semana'},
      {titulo: 'Cuenta y privacidad', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
    ], {i: 1});
  }
  // la semana de quien mira (Laura: 31 mensajes; Montse: los suyos)
  C.semanaDe = () => VETA.yo().id === 'montse' ? {preparados: 9, enviados: 8, retocados: 2, actas: 1, promesas: 2} : {preparados: 31, enviados: 27, retocados: 6, actas: 3, promesas: 4};

  // A8 · agente (ronda 6): primero lo que ya hago yo, después lo que te propongo y lo que he aprendido
  function mias() {
    if (VETA.yo().papel === 'direccion') return miasDir();
    const s = C.semanaDe(), aa = C.r6().antesAhora, res = M.resumenReglas(), vis = C.visitas();
    const cifra = (n, t, k) => `<li><b>${VETA.vivo.cuenta({de: 0, a: n, clave: 'c-veta-' + k})}</b><span>${esc(t)}</span></li>`;
    const cab = `<section class="c-ya" data-i="0"><h2 class="c-ya-h">Lo que ya preparo yo</h2><p class="c-ya-s">Esta semana, sin que me lo pidas:</p>` +
      `<ul class="c-ya-n">${cifra(s.preparados, 'mensajes te dejé escritos', 'm')}${cifra(s.promesas, 'promesas apunté', 'p')}${cifra(s.actas, 'notas de visita guardé', 'a')}</ul>` +
      `<a class="c-ya-aa" data-ir="antes-ahora" href="#/antes-ahora"><span>Cuando empezamos te tocaban <b>${aa.antes.valor}</b> cosas por semana. Ahora, <b>${aa.ahora.valor}</b>.</span>${VETA.ic('chev', 16)}</a></section>`;
    const que = `<a class="c-qh-entra" data-i="1" data-ir="que-hace" href="#/que-hace"><span class="c-qh-ic">${VETA.ic('aprende', 26)}</span>` +
      `<span class="c-qh-tx"><b>Qué hace Veta</b><span>Todo lo que hago por ti, con ejemplos de tus chats</span></span>${VETA.ic('chev', 16)}</a>`;
    // lo que te propongo: confirmar las visitas el día antes y el informe del piso; mismo nombre y misma pregunta que en Hoy
    const r = M.regla('r-valoraciones'), prop = [];
    prop.push(UI.fila({titulo: R6v().corto, subHtml: vis.estado === 'propuesta' ? `Esto lo has hecho ${R6v().hechas} veces. <b>¿Lo hago yo?</b>` : esc(vis.texto),
      ir: 'regla/r-visitas', clase: 'c-prop-f'}).replace('<span class="fila-c">', `${VETA.vivo.anillo({veces: R6v().hechas, tam: 'm'})}<span class="fila-c">`));
    if (r && r.estado === 'propuesta') prop.push(UI.fila({titulo: r.texto, subHtml: 'Esto lo has hecho 14 veces. <b>¿Lo hago yo?</b>',
      ir: 'regla/r-valoraciones', clase: 'c-prop-f'}).replace('<span class="fila-c">', `${VETA.vivo.anillo({veces: 14, tam: 'm'})}<span class="fila-c">`));
    const propone = UI.bloque({titulo: 'Te lo propongo', i: 2, html: `<div class="lista">${prop.join('')}</div>`});
    // lo aprendido: lo de hoy primero
    const hoy = VETA.r6.siempre(), a0 = C.r6().aprendido['pere-tarde'];
    const apr = UI.bloque({titulo: 'Lo que he aprendido de ti', i: 3, html: UI.lista([
      hoy ? {titulo: hoy.regla, subHtml: `<b class="c-hoy-t">Hoy</b> · me lo enseñaste tú${hoy.cuando ? ' a las ' + esc(hoy.cuando) : ''}`, icono: 'aprende', ir: 'aprendido'}
        : {titulo: a0.texto, sub: `${a0.quien} ${a0.cuando} · lo he usado ${a0.hechas} veces`, icono: 'aprende', ir: 'aprendido'},
      {titulo: 'Todo lo que he aprendido', sub: `${C.aprendidoQueda() + (hoy ? 1 : 0)} cosas`, icono: 'libro', ir: 'aprendido'}])});
    return cab + que + propone + apr + UI.lista([
      {titulo: 'Los trabajos, uno a uno', sub: 'tú decides quién hace cada uno', icono: 'probeta', ir: 'reglas'},
      {titulo: 'Antes y ahora', sub: `de ${aa.antes.valor} cosas por semana a ${aa.ahora.valor}`, icono: 'grafica', ir: 'antes-ahora'},
      {titulo: 'Tu semana', sub: `te dejé ${s.preparados} mensajes escritos`, icono: 'cal', ir: 'semana'},
      {titulo: 'Cuenta y privacidad', sub: C.lecturaTexto(), icono: 'escudo', ir: 'cuenta'}
    ], {i: 4});
  }
  const R6v = () => C.r6().visitas;

  function oficina() {
    const d = M.cosa('d-regla');
    const arriba = d && !M.RESUELTOS.includes(d.estado)
      ? UI.tarjeta(`<div class="c-prop-cab">${UI.etiqueta('por-decidir', 'Tienes que decidir · un trabajo para la oficina')}</div>` +
          `<p class="c-frase">Informe del piso al día siguiente</p><p class="c-apoyo">La propone Laura Martí. Desde agosto han llegado 23 peticiones de valoración; ella lo ha hecho a mano 14 veces.</p>` +
          UI.boton({texto: 'Ver los casos y decidir', ir: 'regla-oficina/dossier'}), {clase: 'abierta c-propuesta', i: 0})
      : UI.vacio({titulo: 'Nada por decidir en la oficina', texto: 'Cuando alguien proponga un trabajo para todos, sale aquí.', icono: 'check', i: 0});
    const n = D().practicas.length + (lee('practicaClaudia', false) ? 1 : 0);
    return arriba + UI.lista([
      {titulo: 'Cómo trabajamos', sub: `${n} prácticas`, icono: 'libro', ir: 'oficina/practicas'},
      {titulo: 'Lo que aprende la oficina', sub: 'Dónde se paran las operaciones', icono: 'grafica', ir: 'oficina/aprende'},
      {titulo: 'Lo que Veta aún no hace', sub: '43 veces a mano', icono: 'mano', ir: 'oficina/falta'},
      {titulo: 'Lo que sabe tu oficina', sub: 'De 301 contactos, 212 visitas', icono: 'ojo', ir: 'oficina/sabe'},
      {titulo: 'Qué hace Veta por tu oficina', sub: 'Todo lo que hago, con ejemplos de la oficina', icono: 'aprende', ir: 'oficina-que-hace'}
    ], {i: 1});
  }

  VETA.pantalla('A8', {
    titulo: 'Veta',
    guia: ['Aquí ves lo que ya hago yo por ti, lo que te propongo y lo que he aprendido.', 'Tú decides qué hago yo y qué haces tú, paso a paso.', 'Así cada semana te toca menos trabajo.'],
    pinta: () => {
      const dir = VETA.yo().papel === 'direccion';
      const sel = dir ? `<div class="c-sel" data-i="0">${UI.selector({etiqueta: 'Qué ver', opciones: [{id: 'mias', texto: 'Mías'}, {id: 'oficina', texto: 'De la oficina'}], valor: vista(), accion: 'vista'})}</div>` : '';
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
