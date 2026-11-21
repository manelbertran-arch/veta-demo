/* Veta demo · núcleo · rutas.js
   El mapa entero (sección 2), el registro de pantallas, la navegación y el armazón (barra, barra lateral, columnas).
   - Toda ruta del mapa queda registrada al cargar con una pantalla «pendiente» que dice su código; el paquete que la
     construye la sustituye con VETA.pantalla('<código>', {...}) y hereda del mapa lo que no diga (ruta, destino, completa…).
   - Pila propia con el nombre real de la anterior, almohadilla (#/hoy) y botón atrás del navegador, dirección de la
     transición, memoria del desplazamiento, destino marcado, pantallas completas sin barra, dos columnas en ordenador.
   Ver CONTRATO.md. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;

  // ---- el mapa: [código, ruta, título, destino, paquete, archivo, padre, ejemplo, opciones] ----
  const G = {E: 'Entry', A: 'The day', B: 'Clients', C: 'Veta and account', D: 'Management', O: 'From the office'};
  const FILAS = [
    ['E1', 'portada', 'Home', null, 'N', 'portada.js', null, null, {completa: true, sinCabecera: true, grupo: G.E}],
    ['E2', 'entrar', 'Sign in', null, 'C', 'entrar.js', 'A15', null, {completa: true, grupo: G.E}],
    ['A18', 'primer-dia/:paso', 'First day', null, 'C', 'primer-dia.js', 'E1', 'primer-dia/0', {completa: true, grupo: G.E}],
    ['A18m', 'mapa', 'My work map', 'veta', 'C', 'mapa.js', 'A15', null, {grupo: G.E}],
    ['A1', 'hoy', 'Today', 'hoy', 'A', 'hoy.js', null, null, {grupo: G.A}],
    ['A2', 'mensaje/:id', 'Edit message', 'hoy', 'A', 'mensaje.js', 'A1', 'mensaje/c-marta', {grupo: G.A}],
    ['A3', 'dictar/:guion', 'Dictate', null, 'A', 'dictar.js', 'A1', 'dictar/libre', {completa: true, grupo: G.A}],
    ['A4', 'acta/:id', 'Viewing notes', 'hoy', 'A', 'acta.js', 'A1', 'acta/elena', {completa: true, grupo: G.A}],
    ['A4b', 'entendido-dictado/:id', 'What I\'ve understood', 'hoy', 'A', 'dictado.js', 'A1', 'entendido-dictado/tarea', {completa: true, grupo: G.A}],
    ['A7', 'espera', 'Waiting', 'hoy', 'A', 'espera.js', 'A1', null, {grupo: G.A}],
    ['A12', 'informe/:id', 'Owner report', 'hoy', 'A', 'informe.js', 'A1', 'informe/pere', {grupo: G.A}],
    ['A5', 'clientes', 'Clients', 'clientes', 'B', 'clientes.js', null, null, {grupo: G.B}],
    ['A5b', 'clientes/al-dia', 'The ones who don\'t need you today', 'clientes', 'B', 'clientes.js', 'A5', null, {grupo: G.B}],
    ['A5p', 'pregunta/:id', 'Ask Veta', 'clientes', 'B', 'pregunta.js', 'A5', 'pregunta/jordi', {grupo: G.B}],
    ['A6', 'cliente/:id', 'Client profile', 'clientes', 'B', 'ficha.js', 'A5', 'cliente/pere', {grupo: G.B, tituloCliente: true}],
    ['A6d', 'cliente/:id/documentos', 'Documents and dates', 'clientes', 'B', 'documentos.js', 'A6', 'cliente/pere/documentos', {grupo: G.B}],
    ['A16', 'cliente/:id/historia', 'History', 'clientes', 'B', 'historia.js', 'A6', 'cliente/pere/historia', {grupo: G.B}],
    ['A8', 'veta', 'Veta', 'veta', 'C', 'veta.js', null, null, {grupo: G.C}],
    ['A9', 'reglas', 'What I do for you', 'veta', 'C', 'reglas.js', 'A8', null, {grupo: G.C}],
    ['A9b', 'reglas/semana-pasada', 'Last week', 'veta', 'C', 'reglas.js', 'A9', null, {grupo: G.C}],
    ['A10', 'regla/:id', 'A rule', 'veta', 'C', 'regla.js', 'A9', 'regla/r-valoraciones', {grupo: G.C}],
    ['A10b', 'regla/:id/nivel', 'How far it goes', 'veta', 'C', 'regla.js', 'A10', 'regla/r-valoraciones/nivel', {grupo: G.C}],
    ['A11', 'entendido/:id', 'This is how I understood it', 'veta', 'C', 'entendido.js', 'A9', 'entendido/recordatorios', {grupo: G.C}],
    ['A13', 'aprendido', 'What I\'ve learned', 'veta', 'C', 'aprendido.js', 'A8', null, {grupo: G.C}],
    ['A13b', 'mejora', 'Propose an improvement', 'veta', 'C', 'aprendido.js', 'A13', null, {grupo: G.C}],
    ['A14', 'semana', 'Your week', 'veta', 'C', 'semana.js', 'A8', null, {grupo: G.C}],
    ['A15', 'cuenta', 'Account and privacy', 'veta', 'C', 'cuenta.js', 'A8', null, {grupo: G.C}],
    ['A15b', 'cuenta/chats', 'Chats I don\'t read', 'veta', 'C', 'cuenta.js', 'A15', null, {grupo: G.C}],
    ['A15c', 'cuenta/seguridad', 'Security', 'veta', 'C', 'cuenta.js', 'A15', null, {grupo: G.C}],
    ['G1', 'equipo', 'Team', 'equipo', 'D', 'equipo.js', null, null, {grupo: G.D}],
    ['G2', 'asunto/:id', 'A matter', 'equipo', 'D', 'asunto.js', 'G1', 'asunto/carmen', {grupo: G.D}],
    ['G2b', 'regla-oficina/:id', 'A rule for the office', 'equipo', 'D', 'regla-oficina.js', 'G1', 'regla-oficina/dossier', {grupo: G.D}],
    ['G3', 'semana-equipo', 'Week', 'equipo', 'D', 'semana-equipo.js', 'G1', null, {grupo: G.D}],
    ['G3b', 'semana-equipo/resumen', 'Send the summary', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3c', 'reunion', 'For Monday\'s meeting', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3d', 'oficinas', 'By office', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3e', 'tiempo-equipo', 'The time the team saves', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G5', 'reparto', 'Allocation', 'equipo', 'D', 'reparto.js', 'G1', null, {grupo: G.D}],
    ['G5b', 'reparto/confirmar', 'Hand over the portfolio', 'equipo', 'D', 'reparto.js', 'G5', null, {grupo: G.D}],
    ['G6', 'avisos', 'Alerts', 'equipo', 'D', 'avisos.js', 'G1', null, {grupo: G.D}],
    ['G7', 'conexiones', 'Connections and settings', 'equipo', 'D', 'conexiones.js', 'G1', null, {grupo: G.D}],
    ['G7b', 'confianza', 'What you see and what each person sees', 'equipo', 'D', 'conexiones.js', 'G7', null, {grupo: G.D}],
    ['G7c', 'piloto', 'Daily pilot wrap-up', 'equipo', 'D', 'conexiones.js', 'G7', null, {grupo: G.D}],
    ['G8', 'informe-completo', 'Full report', 'equipo', 'D', 'informe-completo.js', 'G3', null, {grupo: G.D}],
    ['G9', 'entra', 'What\'s coming in', 'equipo', 'D', 'entra.js', 'G1', null, {grupo: G.D}],
    ['G10', 'oficina/practicas', 'How we work', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G11', 'oficina/aprende', 'What the office learns', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G12', 'oficina/falta', 'What Veta doesn\'t do yet', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G13', 'oficina/caso/:id', 'A case to learn from', 'veta', 'C', 'oficina-veta.js', 'G11', 'oficina/caso/claudia', {grupo: G.O}],
    ['G14', 'oficina/sabe', 'What your office knows', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}]
  ];
  const MAPA = {};
  FILAS.forEach(([cod, ruta, titulo, destino, paq, archivo, padre, ejemplo, o]) => {
    MAPA[cod] = Object.assign({cod, ruta, titulo, destino, paq, archivo, padre, ejemplo: ejemplo || ruta}, o || {});
  });
  VETA.MAPA = MAPA;

  // ---- las 42 hojas: código → título y quién la hace ----
  const H = [
    ['H01', 'Where it comes from', 'N', 'comunes.js'], ['H02', 'Something else…', 'N', 'comunes.js'], ['H03', 'Log', 'A', 'dia.js'], ['H04', 'What I\'ve read', 'A', 'dia.js'],
    ['H05', 'Done today', 'A', 'dia.js'], ['H06', 'Day closed', 'A', 'dia.js'], ['H07', 'What you said', 'A', 'dia.js'], ['H08', 'What can I say?', 'A', 'dia.js'],
    ['H09', 'That\'s not it', 'A', 'dia.js'], ['H10', 'Voice note', 'B', 'clientes.js'], ['H11', 'Other actions', 'B', 'clientes.js'], ['H12', 'Share summary', 'B', 'clientes.js'],
    ['H13', 'Off the radar', 'B', 'clientes.js'], ['H14', 'Request ready', 'B', 'clientes.js'], ['H15', 'What happened with…?', 'B', 'clientes.js'], ['H16', 'History detail', 'B', 'clientes.js'],
    ['H17', 'Enlarged photo', 'N', 'comunes.js'], ['H18', 'A case', 'C', 'veta.js'], ['H19', 'The 11 cases like me', 'C', 'veta.js'], ['H20', 'Something else…', 'C', 'veta.js'],
    ['H21', 'How I understood it, step by step', 'C', 'veta.js'], ['H22', 'Raise one level', 'C', 'veta.js'], ['H23', 'An office practice', 'C', 'veta.js'], ['H24', 'Your time on this task', 'C', 'veta.js'],
    ['H25', 'A previous week', 'C', 'veta.js'], ['H26', 'Appearance', 'N', 'comunes.js'], ['H28', 'No signal', 'C', 'veta.js'],
    ['H29', 'Legal text', 'N', 'comunes.js'], ['H30', 'Which chat are you deleting?', 'C', 'veta.js'], ['H31', 'Add Veta to your home screen', 'C', 'veta.js'], ['H32', 'A finding from the map', 'C', 'veta.js'],
    ['H33', 'Calendar', 'C', 'veta.js'], ['H34', 'Today\'s 3 topics', 'D', 'direccion.js'], ['H35', 'Who do you assign it to?', 'D', 'direccion.js'], ['H36', 'How it would have gone', 'D', 'direccion.js'],
    ['H37', 'An alert set', 'D', 'direccion.js'], ['H38', 'Cost per hour', 'D', 'direccion.js'], ['H39', 'Log a complaint', 'B', 'clientes.js'], ['H40', 'Clients with two chats', 'D', 'direccion.js'],
    ['H41', 'Text of a wrap-up', 'N', 'comunes.js'], ['H42', 'How do you want to send it?', 'A', 'dia.js']
  ];
  VETA.HOJAS = {};
  H.forEach(([cod, titulo, paq, archivo]) => { VETA.HOJAS[cod.toLowerCase()] = {cod, id: cod.toLowerCase(), titulo, paq, archivo}; });

  // ---- registro ----
  const pantallas = {};
  VETA.pantallas = pantallas;
  VETA.pantalla = (id, def) => {
    const m = MAPA[id] || {};
    const d = Object.assign({id, cod: m.cod || id, destino: null, completa: false}, m, def);
    if (!d.ruta) { console.warn('VETA.pantalla sin ruta:', id); return; }
    d._partes = d.ruta.split('/');
    pantallas[id] = d;
  };

  // la pantalla provisional de cada ruta del mapa
  const hijos = cod => Object.values(MAPA).filter(m => m.padre === cod);
  Object.values(MAPA).forEach(m => {
    if (m.cod === 'E1') return;
    VETA.pantalla(m.cod, {
      pendiente: true,
      titulo: m.tituloCliente ? (p => ((VETA.modelo.cliente(p.id) || {}).nombre || m.titulo)) : m.titulo,
      guia: [`This will hold “${m.titulo}”.`, `Built by package ${m.paq}.`, `File: js/pantallas/${m.archivo}.`],
      pinta: () => {
        const h = hijos(m.cod);
        return `<div class="pendiente tarjeta" data-i="0">${UI.etiqueta('a-prueba', m.cod + ' · provisional')}<h2 class="bloque-t">${esc(m.titulo)}</h2>` +
          `<p class="bloque-sub">Provisional screen. Built by package ${esc(m.paq)} in js/pantallas/${esc(m.archivo)}.</p></div>` +
          (h.length ? UI.bloque({titulo: 'From here you can reach', i: 1, html: UI.lista(h.map(x => ({titulo: x.titulo, sub: x.cod + ' · #/' + x.ejemplo, ir: x.ejemplo})))}) : '') +
          (m.cod === 'A1' ? UI.bloque({titulo: 'From the core', i: 2, html: UI.lista([{titulo: 'Component showcase', sub: '#/muestrario', ir: 'muestrario', icono: 'paleta'}, {titulo: 'Home', sub: 'E1 · #/portada', ir: 'portada', icono: 'casa'}])}) : '');
      }
    });
  });

  // ---- buscar la pantalla de una ruta ----
  function resuelve(ruta) {
    const partes = String(ruta || '').split('/').filter(Boolean);
    let mejor = null;
    Object.values(pantallas).forEach(def => {
      const pp = def._partes; if (pp.length !== partes.length) return;
      const p = {}; let n = 0;
      for (let k = 0; k < pp.length; k++) {
        if (pp[k][0] === ':') { p[pp[k].slice(1)] = decodeURIComponent(partes[k]); n++; }
        else if (pp[k] !== partes[k]) return;
      }
      if (!mejor || n < mejor.n) mejor = {def, p, n};
    });
    if (!mejor) return null;
    mejor.p.ruta = partes.join('/');
    return {def: mejor.def, p: mejor.p, ruta: mejor.p.ruta};
  }
  VETA.resuelve = resuelve;
  const titulo = e => { const t = e.def.titulo; return typeof t === 'function' ? t(e.p) : (t || ''); };
  const rutaHash = () => decodeURIComponent((location.hash || '').replace(/^#\/?/, '').split('?')[0]).replace(/\/+$/, '');
  const conParams = (patron, p) => patron.split('/').map(s => (s[0] === ':' ? (p[s.slice(1)] || '') : s)).join('/');

  // ---- perfil ----
  VETA.yo = () => VETA.modelo.persona(VETA.est.lee('perfil', 'laura')) || VETA.modelo.persona('laura');
  const papel = () => VETA.datos.papeles[VETA.yo().papel] || VETA.datos.papeles.agente;
  const entrada = () => papel().entrada;
  VETA.entrada = entrada;
  // una pantalla de un destino que tu cuenta no tiene (Equipo, con la de agente) no se abre ni escribiendo la dirección: vas a tu entrada
  const vedada = ruta => { const e = resuelve(ruta); return !!(e && e.def.destino && !papel().destinos.includes(e.def.destino)); };
  VETA.vedada = vedada;
  const DESTINOS = {hoy: {texto: 'Today', icono: 'hoy'}, clientes: {texto: 'Clients', icono: 'clientes'}, equipo: {texto: 'Team', icono: 'equipo'}, veta: {texto: 'Veta', icono: 'aprende'}};
  const AREA = {hoy: 'hoy', clientes: 'clientes', veta: 'aprende', equipo: 'direccion'};
  const esRaiz = e => !!(e && e.def.destino && e.def.ruta === e.def.destino);

  // ---- la pila ----
  let pila = VETA.est.lee('pila', []);
  let actual = null;
  const guardaPila = () => VETA.est.pon('pila', pila.map(x => ({ruta: x.ruta, titulo: x.titulo, scroll: x.scroll || 0})));
  const pon = (ruta, n, reemplaza) => {
    const url = '#/' + ruta, st = {veta: true, n};
    try { if (reemplaza) history.replaceState(st, '', url); else history.pushState(st, '', url); }
    catch (e) { ignora = ruta; if (reemplaza) location.replace(url); else location.hash = url; }
  };
  let ignora = null;

  function guardaScroll() {
    VETA.$$('#marco .col').forEach(col => {
      const d = col.querySelector('.desplaza'); const r = col.dataset.ruta; if (!d || !r) return;
      pila.forEach(x => { if (x.ruta === r) x.scroll = d.scrollTop; });
    });
  }
  const scrollDe = ruta => { const x = pila.slice().reverse().find(y => y.ruta === ruta); return x ? x.scroll || 0 : 0; };

  // ruta del padre (para entrar en frío y para el «‹»)
  function padreDe(e) {
    const m = MAPA[e.def.cod];
    if (m && m.padre && MAPA[m.padre]) {
      const pm = MAPA[m.padre];
      const r = conParams(pm.ruta, e.p);
      return r.split('/').some(s => !s) ? pm.ejemplo : r;
    }
    return e.def.destino || entrada();
  }

  // ---- cabeceras ----
  function cabecera(e, modo) {
    if (e.def.sinCabecera) return '';
    const t = esc(titulo(e));
    if (modo === 'lista') return `<header class="cab cab-lista"><h1 class="cab-t">${t}</h1></header>`;
    if (esRaiz(e) && modo === 'movil') {
      const yo = VETA.yo();
      return `<header class="cab cab-banda"><h1 class="cab-t">${t}</h1><button type="button" class="cab-yo" data-ir="cuenta" aria-label="Account and privacy of ${esc(yo.nombre)}">${VETA.av(yo.id, 36, {aro: true})}</button></header>`;
    }
    if (modo === 'panel') {
      const migas = pila.map((x, k) => ({x, k})).filter(o => o.k < pila.length - 1);
      // panel que se abre solo (primera fila de la lista): la pila no lo tiene, pero la miga dice de qué lista sale
      const top = pila[pila.length - 1], auto = top && top.ruta !== e.ruta;
      const raizMiga = auto ? `<span class="miga-b miga-quieta">${esc(top.titulo || '')}</span><span class="miga-s" aria-hidden="true">›</span>` : '';
      return `<header class="cab cab-panel"><nav class="miga" aria-label="Where you are">${raizMiga}${migas.map(o => `<button type="button" class="miga-b" data-atras-a="${o.k}">${esc(o.x.titulo || '')}</button><span class="miga-s" aria-hidden="true">›</span>`).join('')}<h1 class="cab-t">${t}</h1></nav>${e.def.cabDerecha ? `<span class="cab-der">${e.def.cabDerecha(e.p)}</span>` : ''}</header>`;
    }
    const ant = pila.length > 1 ? pila[pila.length - 2].titulo : (() => { const r = resuelve(padreDe(e)); return r ? titulo(r) : 'Today'; })();
    return `<header class="cab cab-detalle"><button type="button" class="cab-atras" data-atras aria-label="Back to ${esc(ant)}">${VETA.ic('atras', 20)}<span>${esc(ant)}</span></button>` +
      `<h1 class="cab-t">${e.def.cabTitulo ? e.def.cabTitulo(e.p) : t}</h1><span class="cab-der">${e.def.cabDerecha ? e.def.cabDerecha(e.p) : ''}</span></header>`;
  }

  // ---- montar una pantalla en una columna ----
  function monta(col, e, modo, o) {
    o = o || {};
    col.className = 'col col-' + modo + (o.activa ? ' activa' : '');
    col.dataset.area = e.def.area || AREA[e.def.destino] || (e.def.completa ? 'voz' : 'yo');
    col.dataset.ruta = e.ruta; col.dataset.pant = e.def.cod;
    col._entrada = e;
    let cuerpo;
    try { cuerpo = VETA.tieneParam('error') && e.def.cod !== 'E1' ? UI.error() : e.def.pinta(e.p); }
    catch (err) { setTimeout(() => { throw err; }); cuerpo = UI.error({texto: 'This screen failed to render.'}); }
    const fijo = e.def.botonFijo ? e.def.botonFijo(e.p) : '';
    col.innerHTML = cabecera(e, modo) + (navigator.onLine === false ? UI.sinRed() : '') +
      `<div class="desplaza" tabindex="-1"><section class="pant pant-${esc(e.def.cod)}${e.def.pendiente ? ' pant-pendiente' : ''}" data-pant="${esc(e.def.cod)}" aria-label="${esc(titulo(e))}"><div class="pant-cuerpo">${cuerpo}</div></section></div>` +
      (fijo ? `<div class="fijo">${fijo}</div>` : '');
    const d = col.querySelector('.desplaza');
    if (o.scroll) d.scrollTop = o.scroll;
    VETA.mov.vigilaDesplazamiento(d, col);
    if (e.def.alMontar) { try { e.def.alMontar(col.querySelector('.pant'), e.p); } catch (err) { setTimeout(() => { throw err; }); } }
    return col;
  }

  // ---- pintar lo que toca según la pila ----
  // en ordenador la lista de la izquierda se vuelve a montar si el modelo cambió desde la última vez (p. ej. tras decidir en el panel)
  let listaVieja = false;
  function pinta(dir, foco, soloRepinta) {
    const top = pila[pila.length - 1];
    let e = resuelve(top.ruta);
    if (!e) { top.ruta = entrada(); e = resuelve(top.ruta); pon(top.ruta, pila.length - 1, true); }
    top.titulo = titulo(e);
    actual = e;
    const app = document.getElementById('app'), a = document.getElementById('col-a'), b = document.getElementById('col-b');
    const ord = VETA.ordenador();
    const cambio = () => {
      let donde;
      app.dataset.completa = e.def.completa ? 'si' : 'no';
      if (!ord) {
        app.dataset.vista = 'movil';
        donde = monta(a, e, e.def.completa ? 'completa' : 'movil', {activa: true, scroll: soloRepinta || dir === 'atras' ? scrollDe(e.ruta) : 0});
        b.innerHTML = ''; b.className = 'col'; delete b.dataset.ruta;
      } else if (e.def.completa || e.def.ancha) {
        app.dataset.vista = e.def.completa ? 'completa' : 'ancha';
        donde = monta(a, e, e.def.completa ? 'completa' : 'detalle', {activa: true, scroll: soloRepinta || dir === 'atras' ? scrollDe(e.ruta) : 0});
        b.innerHTML = ''; b.className = 'col'; delete b.dataset.ruta;
      } else {
        app.dataset.vista = 'dos';
        // la lista: el destino de la base de la pila
        const base = resuelve(pila[0].ruta);
        const raiz = esRaiz(base) ? base : resuelve(e.def.destino || entrada()) || base;
        if (a.dataset.ruta !== raiz.ruta || soloRepinta || listaVieja || a.dataset.perfil !== VETA.yo().id) {
          listaVieja = false;
          const s = a.querySelector('.desplaza'); const sc = a.dataset.ruta === raiz.ruta && s ? s.scrollTop : scrollDe(raiz.ruta);
          monta(a, raiz, 'lista', {scroll: sc}); a.dataset.perfil = VETA.yo().id;
          if (!pila.some(x => x.ruta === raiz.ruta)) { /* la lista no está en la pila: se queda solo como lista */ }
        }
        let panel = e;
        if (esRaiz(e)) {
          // panel vacío: se abre sola la primera fila de la lista
          // (si la lista marca qué va al panel con data-panel, manda eso: Hoy pone el cliente de su tarjeta abierta)
          const pf = a.querySelector('.pant [data-panel]'), f = a.querySelector('.pant .fila[data-ir]');
          panel = pf && resuelve(pf.dataset.panel) ? resuelve(pf.dataset.panel) : f ? resuelve(f.dataset.ir) : null;
        }
        if (panel) donde = monta(b, panel, 'panel', {activa: true, scroll: soloRepinta || dir === 'atras' ? scrollDe(panel.ruta) : 0});
        else { b.className = 'col col-panel activa'; b.innerHTML = UI.vacio({titulo: 'Choose something from the list', icono: 'hoy'}); delete b.dataset.ruta; donde = b; }
        VETA.$$('.marcada', a).forEach(x => x.classList.remove('marcada'));
        const r = panel ? panel.ruta : '';
        const m = VETA.$$('[data-ir]', a).find(x => x.dataset.ir === r) || VETA.$$('[data-ir]', a).find(x => r.indexOf(x.dataset.ir + '/') === 0);
        if (m) m.classList.add('marcada');
      }
      pintaBarra(); pintaLateral();
      document.title = (e.def.cod === 'E1' ? 'Veta' : titulo(e) + ' · Veta');
      // la cascada arranca ya dentro del cambio, para que se vea durante la transición (solo al ir adelante o cambiar de pestaña)
      if (!soloRepinta && (dir === 'adelante' || dir === 'pestana')) VETA.mov.cascada(donde && donde.querySelector ? donde.querySelector('.pant') : null);
      return donde;
    };
    const fin = donde => {
      if (!soloRepinta) {
        const d = donde && donde.querySelector && donde.querySelector('.desplaza');
        if (d && dir) try { d.focus({preventScroll: true}); } catch (x) {}
        if (VETA.guia) VETA.guia.entra(e.def);
      }
      guardaPila();
    };
    if (dir) {
      let donde = null;
      VETA.mov.transiciona(() => (donde = cambio()), dir, foco).then(() => fin(donde), () => fin(donde));
      return;
    }
    fin(cambio());
  }

  // ---- navegar ----
  // VETA.ir('cliente/pere', {foco: el, reemplaza: false, pestana: false, dir: 'adelante'})
  VETA.ir = (ruta, o) => {
    o = o || {};
    ruta = String(ruta).replace(/^#?\/?/, '');
    if (!resuelve(ruta)) { VETA.aviso('That screen doesn\'t exist yet.'); return; }
    if (vedada(ruta)) { ruta = entrada(); o = {pestana: true}; }
    guardaScroll();
    let dir = o.dir || 'adelante';
    if (o.pestana || (resuelve(ruta).def.destino === ruta && !o.dir)) {
      dir = 'pestana'; pila = [{ruta}]; pon(ruta, 0, false);
    } else if (o.desdeLista) {
      pila = [pila[0], {ruta}]; pon(ruta, 1, false);
    } else if (o.reemplaza) {
      pila[pila.length - 1] = {ruta}; pon(ruta, pila.length - 1, true);
    } else {
      pila.push({ruta}); pon(ruta, pila.length - 1, false);
    }
    pinta(dir, o.foco);
  };
  VETA.atras = () => {
    guardaScroll();
    if (pila.length > 1) {
      const st = history.state;
      if (st && st.veta && st.n === pila.length - 1) { history.back(); return; }
      pila.pop(); pon(pila[pila.length - 1].ruta, pila.length - 1, true); pinta('atras'); return;
    }
    const r = actual ? padreDe(actual) : entrada();
    pila = [{ruta: r}]; pon(r, 0, true); pinta('atras');
  };
  // volver a un punto de la pila (migas del panel en ordenador)
  VETA.atrasA = n => {
    n = Number(n); if (!(n >= 0 && n < pila.length - 1)) return;
    const pasos = pila.length - 1 - n; const st = history.state;
    if (st && st.veta && st.n === pila.length - 1) { history.go(-pasos); return; }
    pila = pila.slice(0, n + 1); pon(pila[n].ruta, n, true); pinta('atras');
  };
  // repinta la pantalla actual (después de cambiar el modelo); {hecho: id} hace el «hecho en el sitio» (efecto 7)
  VETA.repinta = o => {
    o = o || {}; guardaScroll();
    if (o.hecho && !VETA.reducido() && VETA.mov.hayVT()) { pinta('cambia', null, true); return; }
    pinta(null, null, true);
  };
  VETA.actual = () => actual;
  VETA.pila = () => pila.slice();

  function alVolverNavegador() {
    const ruta = rutaHash();
    if (ignora === ruta) { ignora = null; return; }
    if (vedada(ruta)) { VETA.ir(entrada(), {pestana: true}); return; }
    if (actual && ruta === actual.ruta && pila.length && pila[pila.length - 1].ruta === ruta) return;
    guardaScroll();
    const st = history.state; let dir = 'adelante';
    if (st && st.veta && pila[st.n] && pila[st.n].ruta === ruta) { dir = st.n < pila.length - 1 ? 'atras' : 'adelante'; pila = pila.slice(0, st.n + 1); }
    else if (st && st.veta) { pila = pila.slice(0, st.n).concat([{ruta}]); }
    else { pila.push({ruta}); }
    if (!resuelve(ruta)) { pila = [{ruta: entrada()}]; pon(entrada(), 0, true); }
    pinta(dir);
  }

  // ---- barra de abajo y barra lateral ----
  function destinoMarcado() {
    if (!actual) return null;
    const base = pila.length ? resuelve(pila[0].ruta) : null;
    if (base && esRaiz(base)) return base.def.destino;
    return actual.def.destino;
  }
  function contadorHtml(n) { return n > 0 ? `<span class="contador" aria-label="${n} to do"><span class="contador-n">${n}</span></span>` : ''; }
  function pintaBarra() {
    const el = document.getElementById('barra'); if (!el) return;
    const marcado = destinoMarcado(), yo = VETA.yo(), n = VETA.modelo.contador(yo.id);
    const firma = papel().destinos.join() + '|' + marcado + '|' + n + '|' + yo.id;
    if (el.dataset.firma === firma) return;
    el.dataset.firma = firma;
    el.innerHTML = `<div class="tabs">${papel().destinos.map(d => `<button type="button" class="tab${d === marcado ? ' on' : ''}" data-tab="${d}"${d === marcado ? ' aria-current="page"' : ''} style="view-transition-name:tab-${d}">` +
      `<span class="tab-ic">${VETA.ic(DESTINOS[d].icono, 24)}${d === 'hoy' ? contadorHtml(n) : ''}</span><span class="tab-p">${DESTINOS[d].texto}</span></button>`).join('')}</div>` +
      `<button type="button" class="mic" data-ir="dictar/libre" aria-label="Dictate"><span class="mic-c">${VETA.ic('mic', 26)}</span><span class="mic-p">Dictate</span></button>`;
  }
  function pintaLateral() {
    const el = document.getElementById('lateral'); if (!el) return;
    const marcado = destinoMarcado(), yo = VETA.yo(), n = VETA.modelo.contador(yo.id);
    const firma = papel().destinos.join() + '|' + marcado + '|' + n + '|' + yo.id;
    if (el.dataset.firma === firma) return;
    el.dataset.firma = firma;
    el.innerHTML = `<div class="lat-marca"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>` +
      `<div class="lat-dest">${papel().destinos.map(d => `<button type="button" class="lat-d${d === marcado ? ' on' : ''}" data-tab="${d}"${d === marcado ? ' aria-current="page"' : ''}>${VETA.ic(DESTINOS[d].icono, 22)}<span>${DESTINOS[d].texto}</span>${d === 'hoy' && n ? `<span class="lat-n">${n}</span>` : ''}</button>`).join('')}</div>` +
      `<button type="button" class="lat-mic" data-ir="dictar/libre"><span class="mic-c">${VETA.ic('mic', 22)}</span><span>Dictar</span></button>` +
      `<button type="button" class="lat-yo" data-ir="cuenta">${VETA.av(yo.id, 40)}<span class="lat-yo-c"><span class="lat-yo-n">${esc(yo.nombre)}</span><span class="lat-yo-p">${esc(yo.papelTexto)}</span></span></button>`;
  }
  VETA.pintaBarra = () => { ['barra', 'lateral'].forEach(id => { const el = document.getElementById(id); if (el) delete el.dataset.firma; }); pintaBarra(); pintaLateral(); };

  // el contador de Hoy rueda cuando cambia
  VETA.modelo.al(() => {
    const yo = VETA.yo(), n = VETA.modelo.contador(yo.id);
    const c = VETA.$('#barra .contador-n');
    if (c && n > 0) { VETA.rueda(c, n); const el = document.getElementById('barra'); el.dataset.firma = papel().destinos.join() + '|' + destinoMarcado() + '|' + n + '|' + yo.id; }
    else pintaBarra();
    pintaLateral();
  });

  // ---- entrar con una cuenta (E2): la barra gana o pierde «Equipo», se abre el primer destino. No hay cambio de perfil dentro de la app ----
  VETA.cambiaPerfil = id => {
    if (!VETA.modelo.persona(id)) return;
    VETA.est.pon('perfil', id);
    VETA.pintaBarra();
    VETA.ir(entrada(), {pestana: true});
  };

  // ---- acciones: hoja → pantalla → globales ----
  const globales = {};
  VETA.accionGlobal = (nombre, fn) => { globales[nombre] = fn; };
  VETA.hayAccionGlobal = nombre => !!globales[nombre];   // para las comprobaciones
  function acciona(nombre, ev, el) {
    if (el.closest('#hoja')) {
      const h = VETA.hojaActual();
      if (h && h.def.acciones && h.def.acciones[nombre]) return h.def.acciones[nombre](ev, el, h.d);
    }
    const col = el.closest('.col'); const e = (col && col._entrada) || actual;
    if (e && e.def.acciones && e.def.acciones[nombre]) return e.def.acciones[nombre](ev, el, e.p);
    if (globales[nombre]) return globales[nombre](ev, el, e ? e.p : {});
    VETA.aviso('This isn\'t built yet in the demo.');
  }

  document.addEventListener('click', ev => {
    const el = ev.target.closest && ev.target.closest('[data-tab],[data-ir],[data-atras],[data-atras-a],[data-hoja],[data-accion]');
    if (!el || el.closest('[inert]') || el.disabled) return;
    if (el.tagName === 'A') ev.preventDefault();
    if (el.dataset.g && VETA.guia) VETA.guia.toca(el.dataset.g);
    // interruptor y selector de dos: el núcleo mueve el pomo; la acción recibe el valor nuevo
    if (el.getAttribute('role') === 'switch') el.setAttribute('aria-checked', el.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    if (el.getAttribute('role') === 'radio' && el.parentNode.classList.contains('selector')) {
      VETA.$$('[role=radio]', el.parentNode).forEach(x => x.setAttribute('aria-checked', x === el ? 'true' : 'false'));
      el.parentNode.style.setProperty('--pos', el.dataset.pos);
    }
    if (el.hasAttribute('data-tab')) {
      const d = el.dataset.tab;
      if (actual && actual.ruta === d && pila.length === 1) { const s = VETA.$('.col.activa .desplaza') || VETA.$('#col-a .desplaza'); if (s) s.scrollTo({top: 0, behavior: VETA.reducido() ? 'auto' : 'smooth'}); return; }
      VETA.ir(d, {pestana: true}); return;
    }
    if (el.hasAttribute('data-accion')) { acciona(el.dataset.accion, ev, el); return; }
    if (el.hasAttribute('data-hoja')) { VETA.hoja(el.dataset.hoja, Object.assign({}, el.dataset)); return; }
    if (el.hasAttribute('data-atras-a')) { VETA.atrasA(el.dataset.atrasA); return; }
    if (el.hasAttribute('data-atras')) { if (el.closest('#hoja')) VETA.cierraHoja({foco: false}); VETA.atras(); return; }
    if (el.hasAttribute('data-ir')) {
      if (el.closest('#hoja')) VETA.cierraHoja({foco: false});
      const desdeLista = VETA.ordenador() && !!el.closest('#col-a.col-lista');
      VETA.ir(el.dataset.ir, {foco: el.closest('.tc') || el, desdeLista});
    }
  });

  // ---- arranque ----
  function arranca() {
    const rol = VETA.param('rol');
    if (rol === 'direccion') VETA.est.pon('perfil', 'montse'); else if (rol === 'agente') VETA.est.pon('perfil', 'laura');
    if (VETA.param('momento') === 'fin') VETA.modelo.momentoFin();
    const nuevo = VETA.tieneParam('nuevo');
    // se quitan de la dirección los atajos ya aplicados (se queda ?error=1, que es para revisar)
    try {
      const q = new URLSearchParams(location.search); ['nuevo', 'rol', 'momento', 'mov'].forEach(k => q.delete(k));
      const s = q.toString(); history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
    } catch (e) {}
    let ruta = nuevo ? 'portada' : rutaHash();
    if (!ruta || !resuelve(ruta)) ruta = VETA.est.lee('portadaVista', false) ? entrada() : 'portada';
    if (vedada(ruta)) ruta = entrada();
    const top = pila.length ? pila[pila.length - 1] : null;
    if (!top || top.ruta !== ruta || nuevo) pila = [{ruta}];
    pon(ruta, pila.length - 1, true);
    pinta(null);
    VETA.mov.cascada(VETA.$('.col.activa .pant'));
    if (VETA.modelo && VETA.modelo.al) VETA.modelo.al(() => { listaVieja = true; });
    window.addEventListener('popstate', alVolverNavegador);
    window.addEventListener('hashchange', alVolverNavegador);
    const mq = window.matchMedia && matchMedia('(min-width: 900px)');
    if (mq) mq.addEventListener('change', () => { document.getElementById('col-a').dataset.ruta = ''; pinta(null, null, true); });
    window.addEventListener('online', () => VETA.repinta());
    window.addEventListener('offline', () => VETA.repinta());
    document.addEventListener('veta:tema', () => VETA.pintaBarra());
    document.documentElement.classList.add('lista');
  }
  document.addEventListener('DOMContentLoaded', arranca);
})();
