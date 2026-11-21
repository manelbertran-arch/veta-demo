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
        {titulo: 'Lo que Veta ya hace por ti', sub: `${x.total} cosas que te dejé listas la semana pasada: ${h.mensajes} mensajes, ${h.actas} notas de visita y ${h.avisos} avisos`, icono: 'aprende'},
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
      {principal: true, icono: 'mic', titulo: 'Enseñarle algo nuevo', sub: 'Se lo dices hablando. Te lo propone y tú decides.', ir: 'dictar/orden',
        g: 'Enseñarle algo nuevo|Una orden dicha con tu voz se convierte en un trabajo suyo.'},
      nProp ? {icono: 'estrella', titulo: 'Decidir propuestas', sub: 'Trabajos que repites y puede hacer ella.', n: nProp, ir: 'reglas'}
        : {icono: 'probeta', titulo: 'Ver sus trabajos, uno a uno', sub: 'Tú decides quién hace cada uno.', ir: 'reglas'},
      {icono: 'tarea', titulo: 'Ver qué hace por ti', sub: 'Lo que hace sola, lo que hacéis a medias y lo que aún no.', ir: 'que-hace'},
      {icono: 'libro', titulo: 'Ver lo aprendido', sub: hoy ? 'Hoy: ' + cortaFrase(hoy.regla) + '.' : cortaFrase(a0.texto) + '.', n: nApr, ir: 'aprendido'},
      {icono: 'grafica', titulo: 'Comparar antes y ahora', sub: `De ${aa.antes.valor} cosas por semana a ${aa.ahora.valor}.`, ir: 'antes-ahora'}
    ], {i: 1, panel: 'que-hace'}) + UI.menores([
      {titulo: 'Tu semana', icono: 'cal', ir: 'semana'},
      {titulo: 'Cuenta y privacidad', icono: 'escudo', ir: 'cuenta'}], {i: 2});
  }

  function puertasDireccion() {
    const d = M.cosa('d-regla'), decide = d && !M.RESUELTOS.includes(d.estado);
    const n = D().practicas.length + (lee('practicaClaudia', false) ? 1 : 0);
    const propone = VETA.dir && VETA.dir.laPropuso && VETA.dir.laPropuso() ? 'Lo propone Laura.' : 'Lo propone Veta.';
    return UI.puertas([
      {principal: true, icono: 'mic', titulo: 'Enseñarle algo nuevo', sub: 'Se lo dices hablando. Lo propone y tú decides.', ir: 'dictar/orden',
        g: 'Enseñarle algo nuevo|Una orden dicha con tu voz se convierte en un trabajo suyo.'},
      decide ? {icono: 'estrella', titulo: 'Decidir un trabajo', sub: 'Informe del piso al día siguiente. ' + propone, n: 1, ir: 'regla-oficina/dossier'} : null,
      {icono: 'tarea', titulo: 'Ver qué hace por todos', sub: 'Lo que hace sola, lo que hacéis a medias y lo que aún no.', ir: 'oficina-que-hace'},
      {icono: 'mano', titulo: 'Ver lo hecho a mano', sub: 'Trabajo que el equipo repite y ella puede aprender.', n: 43, ir: 'oficina/falta'},
      {icono: 'libro', titulo: 'Ver cómo trabajamos', sub: 'Las prácticas que usa el equipo.', n, ir: 'oficina/practicas'}
    ], {i: 1, panel: 'oficina-que-hace'}) + UI.menores([
      {titulo: 'Lo que aprende la oficina', icono: 'grafica', ir: 'oficina/aprende'},
      {titulo: 'Lo que sabe tu oficina', icono: 'ojo', ir: 'oficina/sabe'},
      {titulo: 'Tu semana', icono: 'cal', ir: 'semana'},
      {titulo: 'Cuenta y privacidad', icono: 'escudo', ir: 'cuenta'}], {i: 2});
  }

  VETA.pantalla('A8', {
    titulo: 'Veta',
    guia: ['Aquí ves, en pocas puertas, lo que puedes hacer con Veta.', 'Tú tocas una: enseñarle algo nuevo, decidir lo que te propone, o ver lo que hace y lo que ha aprendido.', 'Así sabes desde el principio qué hace Veta y cómo hacerla mejor.'],
    pinta: () => VETA.yo().papel === 'direccion' ? puertasDireccion() : puertasAgente()
  });
})();
