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
        {titulo: 'Lo que Veta ya hace por ti', sub: `${x.total} cosas que te dejé listas la semana pasada: ${h.mensajes} mensajes, ${h.actas} actas de visita y ${h.avisos} avisos`, icono: 'aprende'},
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

  // la semana de quien mira (Laura: 31 mensajes; Montse: los suyos)
  C.semanaDe = () => VETA.yo().id === 'montse' ? {preparados: 9, enviados: 8, retocados: 2, actas: 1, promesas: 2} : {preparados: 31, enviados: 27, retocados: 6, actas: 3, promesas: 4};

  // ---- A8 · Veta (ronda 7): una sola lista. Cada fila dice qué es y lleva su número; lo largo está detrás (ESTRATEGIA_R7 §4) ----
  const R7 = () => VETA.r7;
  // el nombre en una línea para las filas (js/datos/r7-c.js); también el título de regla/:id
  C.corto = id => ((VETA.datos.r7c || {}).corto || {})[id] || C.nombre(id);
  // lo que me has enseñado con «Enséñale a Veta» (E, VETA.r7e): si tiene trabajo (regla), sale en «Ya lo hago yo»; si no, en «Lo he aprendido de ti»
  C.ensenados = () => { try { return VETA.r7e ? VETA.r7e.aprendidos() : []; } catch (e) { return []; } };
  C.nuevoTrabajo = () => C.ensenados().filter(x => x.regla).map(x => x.regla).pop() || null;
  C.aprendidoN = () => C.aprendidoQueda() + (VETA.r6.siempre() ? 1 : 0) + C.ensenados().filter(x => !x.regla).length;
  // lo que te propongo: las reglas que aún son propuesta, con cuántas veces lo has hecho tú (mismos nombres que en Te toca a ti)
  C.propuestas = () => {
    const l = [];
    if (VETA.r6.reglaVisitas() === 'propuesta') l.push({id: 'r-visitas', nombre: C.corto('r-visitas'), veces: C.r6().visitas.hechas});
    M.reglas().filter(r => r.estado === 'propuesta' || r.estado === 'nueva').forEach(r => l.push({id: r.id, nombre: C.corto(r.id), veces: r.casos && r.casos.comoYo ? r.casos.comoYo.length + (r.casos.distinto || []).length : 14}));
    return l;
  };
  // lo que cerré sola desde ayer (sale de Te toca a ti; misma clave de estado que hoy.js: a.r6.abiertas)
  C.cerradas = () => { const ab = VETA.est.lee('a.r6.abiertas', []) || []; return ((VETA.datos.r6.dia || {}).cerradas || []).filter(x => !ab.includes(x.id)); };
  const vigilo = () => { try { return VETA.A.esperaPend(VETA.yo().id).length; } catch (e) { return 0; } };
  const veces = n => n === 1 ? '1 vez' : n + ' veces';

  // ronda 7 · arreglos (FC, defecto 5): tres filas, las tres cosas de la frase. Lo aprendido y lo que vigilo, dentro de
  // «Ya lo hago yo»; «Tu semana», dentro de «Antes y ahora»; «Veta en un minuto», en Cuenta
  C.vigilo = vigilo;
  function mias() {
    const aa = C.r6().antesAhora, pr = C.propuestas(), nuevo = C.nuevoTrabajo();
    const abre = `<div class="r7c-props">${pr.map(x => `<button type="button" class="r7c-prop" data-ir="regla/${esc(x.id)}"><span><b>${esc(x.nombre)}</b>` +
      `<span>Lo has hecho tú ${veces(x.veces)}</span></span>${VETA.ic('chev', 16)}</button>`).join('')}</div>`;
    return R7().lista([
      {icono: 'check', oro: true, nombre: 'Ya lo hago yo', pasa: nuevo ? 'Nuevo: ' + C.corto(nuevo) : 'Tú decides quién lo hace', numero: R7().cuentas().veta, ir: 'reglas'},
      pr.length ? {icono: 'aprende', oro: true, nombre: 'Te lo propongo', pasa: 'Lo haces siempre igual', numero: pr.length, abre}
        : {icono: 'aprende', nombre: 'Te lo propongo', pasa: 'Ahora no te propongo nada', numero: 0},
      {icono: 'grafica', nombre: 'Antes y ahora', pasa: `De ${aa.antes.valor} a ${aa.ahora.valor} cosas por semana`, ir: 'antes-ahora'}
    ], {i: 0});
  }
  // dirección: su Veta es «oficina» (D2); si llega aquí, lo suyo en dos filas
  function miasDir() {
    return R7().lista([
      {icono: 'equipo', oro: true, nombre: 'Lo que hago por tu oficina', pasa: 'La semana, antes y ahora', ir: 'oficina'},
      {icono: 'cal', nombre: 'Tu semana', pasa: `Te preparé ${C.semanaDe().preparados} mensajes`, ir: 'semana'}
    ], {i: 0});
  }

  VETA.pantalla('A8', {
    titulo: 'Veta',
    pinta: () => (VETA.yo().papel === 'direccion' ? miasDir() : mias()),
    botonFijo: () => (VETA.yo().papel === 'direccion' ? '' : R7().botones({texto: 'Enséñale a Veta', icono: 'mic', ir: 'dictar/libre', clase: 'r7c-ensena'}))
  });
})();
