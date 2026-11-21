/* Veta demo · pantallas · equipo.js · paquete D (Dirección)
   G1 · Equipo · #/equipo — ronda 6: trabajo que Veta ya hace por la oficina, «Tienes que decidir» (la cola, que se vacía),
   lo que el equipo le pide a Veta, la entrada a Operaciones y las personas del equipo (con nombres, sin podio).
   En móvil: una tarjeta abierta y las demás en filas. En ordenador (lista de 380 a la izquierda): las decisiones son filas
   y la elegida se abre en el panel con su pantalla (G2, G2b o G5), como una bandeja de entrada. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  let abiertas = false;                                          // «N decididas hoy» desplegado
  let mas = false;                                               // «Más de la oficina» desplegado

  // lo que se ve de cada decisión en la fila (y en ordenador, en la lista)
  const FILA = {
    'd-carmen': {titulo: 'Carmen López', sub: 'No la lleva nadie · ayer, 19:10'},
    'd-regla': {titulo: 'Un trabajo para toda la oficina', get sub() { return 'Informe del piso al día siguiente · ' + (X.laPropuso() ? 'lo propone Laura' : 'lo propongo yo'); }},
    'd-teresa': {titulo: 'Teresa está de baja', sub: '34 conversaciones sin atender'},
    'd-joan': {titulo: 'Queja de Joan Serra, propietario', sub: 'Lo lleva Marc · sábado 21, 20:05'}
  };
  const filaDe = (c, n) => {
    const f = FILA[c.id] || {titulo: c.fila || c.titulo, sub: c.filaSub};
    return {titulo: f.titulo, sub: f.sub, av: c.av || c.cliente || null, icono: c.av || c.cliente ? null : (c.icono || 'estrella'),
      ir: X.rutaDe(c), vt: 'cola-' + c.id, derecha: n ? n : null, focoFoto: !!(c.av || c.cliente)};
  };
  // la tarjeta abierta: «Por decidir» va en la etiqueta y no se repite en la línea de quién es (así el botón se ve sin desplazar)
  const QUIEN = {'d-carmen': 'No la lleva nadie', 'd-regla': 'Trabajo para la oficina', 'd-teresa': 'Sus clientes, sin atender', 'd-joan': 'Queja de un propietario'};
  const tarjeta = (c, n, total) => UI.tarjetaCosa(Object.assign({}, c, {quienEs: QUIEN[c.id] || c.quienEs, etiqueta: null}), {n, total});

  // «Cómo va la oficina hoy»: en ordenador, tarjeta con los tres temas en cifras; en móvil, una fila de tres líneas
  const CORTO = {esperando: 'Esperando', promesas: 'Promesas', quieren: 'Quieren vender o comprar', contactos: 'Contactos nuevos', respuesta: 'Respuesta', visitas: 'Visitas'};
  function oficina(ord) {
    const temas = X.temas(), g = 'Cómo va la oficina hoy|Elige los tres temas que quieres ver arriba y en la reunión.';
    // «parada» tiene una sola definición en toda la app: más de 7 días sin moverse (las mismas que cuenta Semana)
    const np = X.paradas().length;
    const sub = `25 cosas en marcha · 8 esperan al cliente · ${np} ${np === 1 ? 'operación parada' : 'operaciones paradas'} más de 7 días`;
    if (!ord) return `<button type="button" class="fila d-oficina-m" data-hoja="h34" data-i="1" data-g="${esc(g)}"><span class="fila-ic">${VETA.ic('grafica', 22)}</span>` +
      `<span class="fila-c"><span class="fila-t">Cómo va la oficina hoy</span><span class="fila-s">${sub}</span>` +
      `<span class="d-temas-l">${temas.map(t => `<span>${esc(CORTO[t.id] || t.texto)} <b>${esc(t.cifra)}</b></span>`).join('<i aria-hidden="true">·</i>')}</span></span>` +
      `<span class="fila-chev">${VETA.ic('chev', 16)}</span></button>`;
    return `<button type="button" class="d-oficina" data-hoja="h34" data-i="1" data-g="${esc(g)}">` +
      `<span class="d-oficina-cab"><span class="d-oficina-t">Cómo va la oficina hoy</span><span class="fila-chev">${VETA.ic('chev', 16)}</span></span>` +
      `<span class="d-oficina-s">${sub}</span>` +
      `<span class="d-temas d-temas-ord">${temas.map(t => `<span class="d-tema"><b>${esc(t.cifra)}</b><span>${esc(t.texto)}</span></span>`).join('')}</span></button>`;
  }

  // ---- ronda 6 · «Trabajo que Veta ya hace por la oficina»: cuatro semanas, lo que dejé listo arriba y lo que me corregisteis abajo ----
  const R6 = () => VETA.datos.r6.direccion;
  function trabajo(i) {
    const s = R6().semanas, n = s.listos.length, maxL = Math.max.apply(null, s.listos);
    const cols = s.etiquetas.map((e, k) => `<span class="d-4s-c${k === n - 1 ? ' d-4s-hoy' : ''}"><b class="d-4s-n">${s.listos[k]}</b>` +
      `<span class="d-4s-a" style="--v:${(s.listos[k] / maxL).toFixed(3)}"></span><span class="d-4s-e">${esc(e)}</span></span>`).join('');
    return `<section class="bloque d-trabajo" data-i="${i}"><h2 class="bloque-t">Trabajo que Veta ya hace por la oficina</h2>` +
      `<p class="d-4s-t">La semana pasada os dejé listas <b>${VETA.vivo.cuenta({de: s.listos[0], a: s.listos[n - 1], clave: 'd-4s'})}</b> cosas. Hace un mes, ${s.listos[0]}.</p>` +
      `<div class="d-4s" role="img" aria-label="Cosas que os dejé listas cada semana, las cuatro últimas: de ${s.listos[0]} a ${s.listos[n - 1]}">${cols}</div>` +
      `<p class="d-4s-t">Me corregisteis <b>${s.corregidos[n - 1]}</b> veces. Hace un mes, ${s.corregidos[0]}.</p>` +
      UI.boton({tipo: 'texto', texto: 'Ver la semana', ir: 'semana-equipo', ancho: false}) + '</section>';
  }
  // ---- «Lo que tu equipo le pide a Veta»: lo que aún se hace a mano, por tema y quién ----
  function pide(i) {
    const l = R6().pide, total = l.reduce((a, x) => a + x.veces, 0);
    return `<section class="bloque d-pide" data-i="${i}"><h2 class="bloque-t">Lo que tu equipo le pide a Veta</h2>` +
      `<p class="bloque-sub">Cosas que el equipo ha hecho a mano ${total} veces. Puedo aprenderlas.</p>` +
      `<div class="lista">${l.map(x => UI.fila({titulo: x.tema, sub: x.quien, derecha: x.veces + ' veces', icono: 'mano'})).join('')}</div>` +
      UI.boton({tipo: 'secundario', texto: 'Enséñame el primero', ir: 'dictar/orden', icono: 'mic'}) + '</section>';
  }
  // ---- la entrada a Operaciones y las personas ----
  // «hay que mirarlas» es solo lo que pide que alguien haga algo hoy (nadie contesta, una queja, parada o sin nadie): la misma cuenta
  // que el filtro de Operaciones y que la suma de las fichas. Un papel con fecha o una promesa para el jueves es trabajo normal.
  function operaciones(i) {
    const l = X.ops(), ojo = l.filter(o => o.mirar).length;
    const sub = `${l.length} operaciones · ` + (ojo ? `${ojo} hay que mirar${ojo === 1 ? 'la' : 'las'} hoy` : 'hoy no hay que mirar ninguna');
    return UI.lista([{titulo: 'Operaciones', sub, icono: 'orden', ir: 'operaciones', clase: 'd-ir-ops'}], {i, clase: 'd-ops-entrada'});
  }
  // una sola lista, sin rótulos que clasifiquen a nadie. De cada persona se dice lo que pasa; en rojo, solo «sin contestar».
  function equipo(i) {
    const e = X.equipoOps(), yo = VETA.yo().id;
    const fila = x => {
      const partes = x.partes.map(p => p.rojo ? `<span class="d-rojo-t">${esc(p.texto)}</span>` : esc(p.texto));
      const sub = x.baja ? `De baja · ${x.pendientes} conversaciones sin atender` : x.resumen;
      return {titulo: x.p.nombre + (x.id === yo ? ' (tú)' : ''), av: x.id, ir: 'persona/' + x.id, sub,
        subHtml: x.baja ? null : esc(x.cuantas) + ' · ' + (partes.length ? partes.join(' · ') : 'todo al día')};
    };
    return `<section class="bloque d-personas" data-i="${i}"><h2 class="bloque-t">El equipo</h2>${UI.lista(e.todos.map(fila))}</section>`;
  }

  function deLaOficina(i) {
    const avisosOff = X.lee('avisosOff', {}), creados = X.lee('avisos', []);
    const puestos = (VETA.datos.avisos.puestos.filter(a => !avisosOff[a.id]).length) + creados.filter(a => !avisosOff[a.id]).length;
    const sin = X.sinResponder().length;
    return UI.lista([
      {titulo: 'Semana', sub: '156 mensajes y tareas listos', icono: 'cal', ir: 'semana-equipo'},
      {titulo: 'Lo que entra', sub: sin === 1 ? '1 contacto sin responder' : sin + ' contactos sin responder', icono: 'entra', ir: 'entra'},
      {titulo: 'Avisos', sub: (puestos === 1 ? 'tienes 1' : 'tienes ' + puestos) + ' · 1 te avisó el sábado', icono: 'campana', ir: 'avisos'},
      {titulo: 'Qué hace Veta por tu oficina', icono: 'aprende', ir: 'oficina-que-hace'},
      {titulo: 'Antes y ahora de la oficina', icono: 'grafica', ir: 'oficina-antes-ahora'},
      {titulo: 'Lo que ves tú y lo que ve cada uno', icono: 'candado', ir: 'confianza'},
      {titulo: 'Conexiones y ajustes', icono: 'wifi', ir: 'conexiones'}]);
  }
  // «Cómo va la oficina hoy» y las siete filas de la oficina, en una sola fila que se abre aquí mismo
  function masOficina(ord, i) {
    return `<div class="d-mas" data-i="${i}"><button type="button" class="fila d-mas-b" data-accion="mas" aria-expanded="${mas}">` +
      `<span class="fila-ic">${VETA.ic('grafica', 22)}</span><span class="fila-c"><span class="fila-t">Más de la oficina</span>` +
      `<span class="fila-s">Cómo va hoy, la semana, lo que entra, avisos y ajustes</span></span>` +
      `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
      `<div class="d-mas-l"${mas ? '' : ' hidden'}>${oficina(ord)}${deLaOficina()}</div></div>`;
  }

  function decididas(lista) {
    if (!lista.length) return '';
    const n = lista.length;
    return `<div class="d-decididas"><button type="button" class="fila d-decididas-b" data-accion="decididas" aria-expanded="${abiertas}">` +
      `<span class="fila-ic">${VETA.ic('check', 22)}</span><span class="fila-c"><span class="fila-t">${n} ${n === 1 ? 'decidida' : 'decididas'} hoy</span></span>` +
      `<span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
      `<div class="d-decididas-l"${abiertas ? '' : ' hidden'}>${lista.map(c => UI.lineaCosa(c)).join('')}</div></div>`;
  }

  VETA.pantalla('G1', {
    titulo: 'Equipo',
    guia: ['Aquí ves el trabajo que Veta ya hace por la oficina, lo que tienes que decidir y cada operación y persona.', 'Tú decides con un toque o abres una operación o una persona para verla entera.', 'Así sabes qué pasa en la oficina sin tener que preguntar.'],
    pinta: () => {
      const ord = VETA.ordenador();
      const ds = M.decisiones();
      const pend = ds.filter(X.pendiente);
      const ult = M.ultima('equipo');
      // «N decididas hoy» cuenta todas, también la última: Por decidir + decididas = las 4 de hoy
      const resueltas = ds.filter(c => X.resuelta(c)).sort((a, b) => a.orden - b.orden);
      const leido = UI.fila({titulo: VETA.datos.fecha.hoyTexto, sub: 'Leído hasta las ' + VETA.ahora(-3), icono: 'reloj', hoja: 'h04', datos: {quien: 'equipo'}, clase: 'd-leido', i: 0,
        g: 'Lo que he leído|Los canales de la oficina y hasta qué hora los he leído.'});
      let cola;
      if (!pend.length) {
        cola = `<div>${ult ? UI.lineaCosa(ult) : ''}${UI.vacio({titulo: 'Nada por decidir en el equipo.', texto: 'Cuando entre algo que necesite tu decisión, aparecerá aquí.', icono: 'check'})}</div>`;
      } else if (ord) {
        // ordenador: todas las decisiones en filas; la primera se abre sola en el panel
        cola = (ult ? UI.lineaCosa(ult) : '') + UI.lista(pend.map((c, k) => filaDe(c, (k + 1) + ' de ' + pend.length)), {clase: 'd-cola'});
      } else {
        // se cuenta sobre lo que queda («1 de 3»): el número no salta al decidir otra cosa
        cola = `<div class="d-cola-m">${ult ? UI.lineaCosa(ult) : ''}${tarjeta(pend[0], 1, pend.length)}</div>` +
          (pend.length > 1 ? UI.lista(pend.slice(1).map(c => filaDe(c)), {clase: 'd-cola'}) : '');
      }
      // pulido: trabajo de Veta → Tienes que decidir → Operaciones → El equipo → Lo que tu equipo le pide a Veta → «Más de la oficina»
      const decide = `<section class="bloque d-decide" data-i="2"><h2 class="bloque-t">Tienes que decidir${pend.length ? ' · ' + pend.length : ''}</h2>${cola}${decididas(resueltas)}</section>`;
      return `<div class="d-equipo${ord ? ' d-equipo-ord' : ''}">` + leido + trabajo(1) + decide + operaciones(3) + equipo(3) + pide(4) + masOficina(ord, 4) + '</div>';
    },
    acciones: {
      asignar(ev, el) {
        if (el.dataset.de === 'd-carmen') X.asigna('carmen', 'laura'); else M.marca(el.dataset.de, 'hecha');
        VETA.repinta({hecho: el.dataset.de});
      },
      mas(ev, el) {
        mas = !mas;
        el.setAttribute('aria-expanded', String(mas));
        const l = el.parentNode.querySelector('.d-mas-l'); if (l) l.hidden = !mas;
      },
      decididas(ev, el) {
        abiertas = !abiertas;
        el.setAttribute('aria-expanded', String(abiertas));
        const l = el.parentNode.querySelector('.d-decididas-l'); if (l) l.hidden = !abiertas;
      }
    }
  });
})();
