/* Veta demo · núcleo · rutas.js
   El mapa entero (sección 2), el registro de pantallas, la navegación y el armazón (barra, barra lateral, columnas).
   - Cada pantalla se registra con VETA.pantalla('<código>', {...}) y hereda del mapa lo que no diga (ruta, destino, completa…).
     Toda fila del mapa tiene su pantalla (las provisionales de la ronda 1 se fueron en el cierre de la ronda 8).
   - Ronda 8 (PLAN_R8.md): cuatro sitios y el micro en la barra, cabecera de raíz (56) y de detalle (60, con el nombre de donde
     vienes sobre el título), sin “?”, redirecciones de las rutas que se funden, pie con nota. Referencia: analisis/PARTE_N.md.
   - Pila propia con el nombre real de la anterior, almohadilla (#/hoy) y botón atrás del navegador, dirección de la
     transición, memoria del desplazamiento, destino marcado, pantallas completas sin barra, dos columnas en ordenador.
   Ver CONTRATO.md. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;

  // ---- el mapa: [código, ruta, título, destino, paquete, archivo, padre, ejemplo, opciones] ----
  const G = {E: 'Entry', A: 'The day', B: 'Clients', C: 'Veta and account', D: 'Management', O: 'From the office'};
  const FILAS = [
    ['E1', 'portada', 'Welcome', null, 'N', 'portada.js', null, null, {completa: true, sinCabecera: true, grupo: G.E}],
    ['E2', 'entrar', 'Sign in', null, 'C', 'entrar.js', 'A15', null, {completa: true, grupo: G.E}],
    ['A18', 'primer-dia/:paso', 'First day', null, 'C', 'primer-dia.js', 'E1', 'primer-dia/0', {completa: true, grupo: G.E}],
    ['A18m', 'mapa', 'My work map', 'veta', 'C', 'mapa.js', 'A15', null, {grupo: G.E}],
    ['A1', 'hoy', 'Today', 'hoy', 'A', 'hoy.js', null, null, {grupo: G.A}],
    ['A2', 'mensaje/:id', 'Change the message', 'hoy', 'A', 'mensaje.js', 'A1', 'mensaje/c-marta', {grupo: G.A}],
    ['A3', 'dictar/:guion', 'Dictate', null, 'A', 'dictar.js', 'A1', 'dictar/libre', {completa: true, grupo: G.A}],
    ['A4', 'acta/:id', 'Viewing notes', 'hoy', 'A', 'acta.js', 'A1', 'acta/elena', {completa: true, grupo: G.A}],
    ['A4b', 'entendido-dictado/:id', 'What I understood', 'hoy', 'A', 'dictado.js', 'A1', 'entendido-dictado/tarea', {completa: true, grupo: G.A}],
    ['A7', 'espera', 'What I\'m watching for you', 'hoy', 'A', 'espera.js', 'A1', null, {grupo: G.A}],
    ['A12', 'informe/:id', 'Report for the owner', 'hoy', 'A', 'informe.js', 'A1', 'informe/pere', {grupo: G.A}],
    ['A5', 'clientes', 'Clients', 'clientes', 'B', 'clientes.js', null, null, {grupo: G.B}],
    ['A5p', 'pregunta/:id', 'Ask Veta', 'clientes', 'B', 'pregunta.js', 'A5', 'pregunta/jordi', {grupo: G.B}],
    ['A6', 'cliente/:id', 'Client profile', 'clientes', 'B', 'ficha.js', 'A5', 'cliente/pere', {grupo: G.B, tituloCliente: true}],
    ['A6d', 'cliente/:id/documentos', 'Documents and dates', 'clientes', 'B', 'documentos.js', 'A6', 'cliente/pere/documentos', {grupo: G.B}],
    ['A16', 'cliente/:id/historia', 'What has happened', 'clientes', 'B', 'historia.js', 'A6', 'cliente/pere/historia', {grupo: G.B}],
    ['A8', 'veta', 'Veta', 'veta', 'C', 'veta.js', null, null, {grupo: G.C}],
    ['A8b', 'veta/mia', 'What Veta does for you', 'veta', 'C', 'veta.js', 'R0', null, {grupo: G.C}],
    ['A9b', 'reglas/semana-pasada', 'Last week', 'veta', 'C', 'reglas.js', 'A8', null, {grupo: G.C}],
    ['A10', 'regla/:id', 'A job', 'veta', 'C', 'regla.js', 'A8', 'regla/r-valoraciones', {grupo: G.C}],
    ['A10b', 'regla/:id/nivel', 'Who does it?', 'veta', 'C', 'regla.js', 'A10', 'regla/r-valoraciones/nivel', {grupo: G.C}],
    ['A11', 'entendido/:id', 'What I understood', 'veta', 'C', 'entendido.js', 'A13', 'entendido/recordatorios', {grupo: G.C}],
    ['A13', 'aprendido', 'What I\'ve learned from you', 'veta', 'C', 'aprendido.js', 'A8', null, {grupo: G.C}],
    ['A13b', 'mejora', 'Propose an improvement', 'veta', 'C', 'aprendido.js', 'A13', null, {grupo: G.C}],
    ['A14', 'semana', 'Your week', 'veta', 'C', 'semana.js', 'A8', null, {grupo: G.C}],
    ['A15', 'cuenta', 'Account and privacy', 'veta', 'C', 'cuenta.js', 'A8', null, {grupo: G.C}],
    ['A15b', 'cuenta/chats', 'Chats I don\'t read', 'veta', 'C', 'cuenta.js', 'A15', null, {grupo: G.C}],
    ['A15c', 'cuenta/seguridad', 'Security', 'veta', 'C', 'cuenta.js', 'A15', null, {grupo: G.C}],
    ['G1', 'equipo', 'Team', 'equipo', 'D', 'equipo.js', null, null, {grupo: G.D}],
    ['G2', 'asunto/:id', 'What happened', 'equipo', 'D', 'asunto.js', 'G1', 'asunto/carmen', {grupo: G.D}],
    ['G2b', 'regla-oficina/:id', 'A job for the office', 'equipo', 'D', 'regla-oficina.js', 'G1', 'regla-oficina/dossier', {grupo: G.D}],
    ['G3', 'semana-equipo', 'Last week', 'equipo', 'D', 'semana-equipo.js', 'G1', null, {grupo: G.D}],
    ['G3b', 'semana-equipo/resumen', 'Send the summary', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3c', 'reunion', 'Monday meeting', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3d', 'oficinas', 'By office', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3e', 'tiempo-equipo', 'Time saved', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G5', 'reparto', 'Allocation', 'equipo', 'D', 'reparto.js', 'G1', null, {grupo: G.D}],
    ['G5b', 'reparto/confirmar', 'Handing over their clients', 'equipo', 'D', 'reparto.js', 'G5', null, {grupo: G.D}],
    ['G6', 'avisos', 'Your alerts', 'equipo', 'D', 'avisos.js', 'G1', null, {grupo: G.D}],
    ['G7', 'conexiones', 'Connections and settings', 'equipo', 'D', 'conexiones.js', 'G1', null, {grupo: G.D}],
    ['G7b', 'confianza', 'What each one sees', 'equipo', 'D', 'conexiones.js', 'G7', null, {grupo: G.D}],
    ['G7c', 'piloto', 'Daily pilot wrap-up', 'equipo', 'D', 'conexiones.js', 'G7', null, {grupo: G.D}],
    ['G8', 'informe-completo', 'Full report', 'equipo', 'D', 'informe-completo.js', 'G3', null, {grupo: G.D}],
    ['G9', 'entra', 'What\'s coming in', 'equipo', 'D', 'entra.js', 'G1', null, {grupo: G.D}],
    ['A19', 'que-hace', 'How Veta works', 'veta', 'C', 'que-hace.js', 'A8', null, {grupo: G.C}],
    ['A20', 'antes-ahora', 'Before and now', 'veta', 'C', 'antes-ahora.js', 'A8', null, {grupo: G.C}],
    ['G15', 'oficina-que-hace', 'What I already do', 'equipo', 'D', 'oficina-que-hace.js', 'G1', null, {grupo: G.D}],
    ['G16', 'oficina-antes-ahora', 'Before and now', 'equipo', 'D', 'oficina-antes-ahora.js', 'G1', null, {grupo: G.D}],
    ['G17', 'operaciones', 'Deals', 'equipo', 'D', 'operaciones.js', 'G1', null, {grupo: G.D}],
    ['G18', 'operacion/:id', 'A deal', 'equipo', 'D', 'operacion.js', 'G17', 'operacion/marta', {grupo: G.D}],
    ['G19', 'persona/:id', 'A person on the team', 'equipo', 'D', 'persona.js', 'G1', 'persona/laura', {grupo: G.D}],
    ['G10', 'oficina/practicas', 'How we work', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G11', 'oficina/aprende', 'What the office learns', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G12', 'oficina/falta', 'What Veta doesn\'t do yet', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G13', 'oficina/caso/:id', 'A case to learn from', 'veta', 'C', 'oficina-veta.js', 'G11', 'oficina/caso/claudia', {grupo: G.O}],
    ['G14', 'oficina/sabe', 'What your office knows', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    // ronda 7: Inicio (cuatro cajas) y las raíces nuevas de caja
    ['R0', 'inicio', 'Home', null, 'N', 'inicio.js', null, null, {sinCabecera: true, ancha: true, grupo: G.E}],
    ['A21', 'visitas', 'Viewings', 'visitas', 'A', 'visitas.js', 'R0', null, {grupo: G.A}],
    ['A22', 'visita/:id', 'A viewing', 'visitas', 'A', 'visita.js', 'A21', 'visita/elena', {grupo: G.A}],
    ['A24', 'salida/:id', 'How did it go?', 'visitas', 'A', 'visita.js', 'A22', 'salida/elena', {completa: true, grupo: G.A}],
    ['A23', 'toca/:id', 'Your turn', 'hoy', 'A', 'hoy.js', 'A1', 'toca/c-marta', {grupo: G.A}],
    ['G21', 'oficina', 'Veta', 'oficina', 'D', 'oficina.js', 'R0', null, {grupo: G.D}],
    // carril sitios · los dos sitios nuevos de la agente (esqueleto; el contenido lo pone otro carril). `soloPapel`: la ruta `operaciones` es de dirección (G17) y de la agente (S2); resuelve() elige por perfil
    ['S1', 'pisos', 'Flats', 'pisos', 'A', 'pisos.js', 'R0', null, {grupo: G.A, soloPapel: 'agente'}],
    ['S2', 'operaciones', 'Deals', 'operaciones', 'A', 'operaciones-mias.js', 'R0', null, {grupo: G.A, soloPapel: 'agente'}]
  ];
  const MAPA = {};
  FILAS.forEach(([cod, ruta, titulo, destino, paq, archivo, padre, ejemplo, o]) => {
    MAPA[cod] = Object.assign({cod, ruta, titulo, destino, paq, archivo, padre, ejemplo: ejemplo || ruta}, o || {});
  });
  // ronda 7 · el reparto va encima de la tabla: nombre, caja (destino) y padre. (Las frases del “?” y el número del título se fueron en la ronda 8.)
  const R7 = {
    A1: {titulo: 'Your turn', padre: 'R0'},
    A5: {padre: 'R0'},
    A8: {padre: 'R0'}, A8b: {padre: 'R0', destino: null},   // dirección también trabaja como agente: “Lo que Veta hace por ti” (fila fija de su Inicio) es A8 sin “Cómo voy”
    G1: {padre: 'R0'},
    G17: {padre: 'R0', destino: 'operaciones'},
    A3: {titulo: 'What\'s on your mind?', padre: 'R0'}, A4b: {padre: 'A3'},
    // FC (defectos 5 y 10): Cuenta no es ninguna caja, la barra no marca nada; “Veta en un minuto” vive en Cuenta; lo aprendido cuelga de “Ya lo hago yo” y “Tu semana” de “Antes y ahora”
    A15: {titulo: 'Account', padre: 'R0', destino: null}, A15b: {destino: null}, A15c: {destino: null}, A18m: {destino: null}, A19: {padre: 'A15', destino: null}, A14: {padre: 'A20'},
    A4: {titulo: 'Viewing notes', destino: 'visitas', padre: 'A22'}, A12: {titulo: 'Report for the owner', destino: 'visitas', padre: 'A22'},
    A2: {padre: 'A23'},   // FA · “Cambiar el mensaje” cuelga de la tarjeta de su persona (toca/:id), no de la lista
    G2: {destino: 'decidir'}, G18: {destino: 'operaciones'},
    G3: {destino: 'oficina', padre: 'G21'}, G3b: {destino: 'oficina'}, G3c: {destino: 'oficina'}, G3d: {destino: 'oficina'}, G3e: {destino: 'oficina'}, G8: {destino: 'oficina'},
    G15: {destino: 'oficina', padre: 'G21'}, G16: {destino: 'oficina', padre: 'G21'}, G2b: {destino: 'oficina', padre: 'G21'},
    // FD: Conexiones y Tus avisos cuelgan de Cuenta (A15), con su misma caja marcada; Lo que entra, de Operaciones
    G7: {padre: 'A15', destino: null}, G7b: {destino: null}, G7c: {destino: null}, G6: {padre: 'A15', destino: null},
    G5: {destino: 'decidir'}, G5b: {destino: 'decidir'}, G9: {destino: 'operaciones', padre: 'G17'},
    // FD: lo aprendido, lo que aún no hago y cómo trabajamos van dentro de “Lo que ya hago por la oficina” (G15)
    G10: {destino: 'oficina', padre: 'G15'}, G11: {destino: 'oficina', padre: 'G15'}, G12: {destino: 'oficina', padre: 'G15'}, G14: {destino: 'oficina', padre: 'G15'}, G13: {destino: 'oficina'}
  };
  Object.keys(R7).forEach(c => Object.assign(MAPA[c], R7[c]));
  // ronda 8 · el mapa nuevo (PLAN_R8.md, 2.3): padres para entrar en frío y para el “volver”, y los documentos a pantalla completa.
  // Las tres pantallas que se fundieron (A5b clientes/al-dia, A9 reglas, G20 decidir) ya no están en el mapa: sus rutas las lleva redirige().
  // “decidir” sigue siendo el `destino` de lo que solo abre dirección desde su Inicio (asunto, reparto): lo lee vedada().
  // Con la cuenta de dirección, “Te toca a ti” (A1) es un detalle que cuelga de Inicio, y de él cuelgan su tarjeta, lo que vigila y su semana.
  // La agente abre “Cómo trabajamos” (G10) y “Lo que sabe tu oficina” (G14) desde “Lo he aprendido de ti”.
  const esDir = () => VETA.yo().papel === 'direccion';
  const porA1 = () => (esDir() ? 'hoy' : null), porAprendido = () => (esDir() ? null : 'aprendido');
  const R8 = {
    A1: {destino: null, area: 'hoy'},   // “Te toca a ti” no es raíz: la ruta 'hoy' redirige a Inicio (agente) o es un detalle de Inicio (dirección), y ahí lleva “volver”
    A23: {padre: 'R0', padreRuta: porA1}, A7: {padre: 'R0', destino: 'hoy', padreRuta: porA1},
    A10: {padre: 'A8', padreRuta: () => (esDir() ? 'veta/mia' : null)}, A13: {padre: 'A8'}, A9b: {padre: 'A8'}, A20: {padre: 'A8'}, A14: {padre: 'A8', padreRuta: porA1}, A11: {padre: 'A13'},
    G2: {padre: 'R0'}, G2b: {padre: 'R0'}, G5: {padre: 'R0'},
    G11: {padre: 'G21'}, G13: {padre: 'G11'}, G14: {padre: 'G11', padreRuta: porAprendido}, G10: {padre: 'G15', padreRuta: porAprendido}, G12: {padre: 'G15'},
    A12: {completa: true}, G3b: {completa: true}, G8: {completa: true}
  };
  Object.keys(R8).forEach(c => Object.assign(MAPA[c], R8[c]));
  VETA.MAPA = MAPA;

  // ---- las hojas: lo que hay definido de verdad (VETA.hojaDef y las tres plantillas), id → código y título ----
  // La tabla fija de 42 de la ronda 1 se fue: nombraba hojas borradas (H08, H13, H37) y títulos viejos. El título de una hoja que
  // depende de sus datos sale vacío aquí (lo pone la hoja al abrirse). Las del muestrario (mu-…: página de trabajo, fuera del mapa) no cuentan.
  Object.defineProperty(VETA, 'HOJAS', {configurable: true, get: () => {
    const o = {}; Object.keys(VETA.hojaDefs || {}).filter(id => id.indexOf('mu-') !== 0).forEach(id => { const tt = VETA.hojaDefs[id].titulo; o[id] = {cod: id.toUpperCase(), id, titulo: typeof tt === 'string' ? tt : ''}; });
    return o;
  }});

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
      // misma ruta en dos pantallas (operaciones: dirección y agente): gana la del perfil; la que no tiene `soloPapel` va en medio; la del otro perfil, la última (vedada() la cierra)
      const rango = d => (d.soloPapel ? (d.soloPapel === VETA.yo().papel ? 2 : 0) : 1);
      if (!mejor || n < mejor.n || (n === mejor.n && rango(def) > rango(mejor.def))) mejor = {def, p, n};
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
  const INICIO = 'inicio';
  const entrada = () => INICIO;   // ronda 7: los dos papeles aterrizan en Inicio
  VETA.entrada = entrada;
  // una pantalla de dirección no se abre con la cuenta de agente ni escribiendo la dirección: vas a Inicio
  const SOLO_DIRECCION = ['decidir', 'equipo', 'operaciones', 'oficina'];
  // FN · y al revés (privacidad): con la cuenta de dirección no se abre lo que es solo de quien lo lleva. Sale del `destino` del mapa:
  // la caja Visitas entera (la visita, cómo ha ido, el acta y el informe) y, de “Te toca a ti”, la tarjeta y el mensaje de otra persona
  // (dirección también vende: lo suyo —toca/m-…, mensaje/m-…— sí lo abre).
  const SOLO_QUIEN_LO_LLEVA = ['visitas'];
  const deOtra = e => {
    if (SOLO_QUIEN_LO_LLEVA.includes(e.def.destino) || e.def.soloPapel === 'agente') return true;   // los sitios propios de la agente (pisos, su operaciones) no los abre dirección
    if (e.def.cod !== 'A23' && e.def.cod !== 'A2') return false;   // toca/:id y mensaje/:id: de quién es la cosa
    const c = VETA.modelo.cosa(e.p.id);
    if (c) return !!(c.quien && c.quien !== VETA.yo().id);
    const d = VETA.duenoDe ? VETA.duenoDe({de: e.p.id}) : null;
    return d ? VETA.ajeno(d) : true;
  };
  // ronda 8 · la agente sí abre “Cómo trabajamos” (G10) y “Lo que sabe tu oficina” (G14), aunque sean de la oficina
  const ABRE_LA_AGENTE = ['G10', 'G14'];
  const vedada = ruta => {
    const e = resuelve(redirige(ruta, true)); if (!e || !e.def.destino) return false;
    return VETA.yo().papel === 'direccion' ? deOtra(e) : (SOLO_DIRECCION.includes(e.def.destino) && !ABRE_LA_AGENTE.includes(e.def.cod) && e.def.soloPapel !== 'agente');
  };
  VETA.vedada = vedada;   // “Cómo funciona Veta” (A19) filtra con esto las filas que cada papel no puede abrir
  // ronda 8 · los sitios de la barra (y del menú de ordenador): Inicio y las raíces del papel (agente: cinco más Hoy = seis; dirección: tres más Inicio); en el centro, el micro (Dictar).
  // “hoy” y “decidir” ya no son sitios (son el Inicio); sus nombres se quedan en SITIOS por si alguien los lee.
  const CAJAS = {agente: ['visitas', 'clientes', 'pisos', 'operaciones', 'veta'], direccion: ['equipo', 'operaciones', 'oficina']};
  const SITIOS = {inicio: {texto: 'Home', icono: 'casa'}, hoy: {texto: 'Your turn', largo: 'Your turn', icono: 'hoy'}, visitas: {texto: 'Viewings', icono: 'cal'},
    clientes: {texto: 'Clients', icono: 'clientes'}, pisos: {texto: 'Flats', icono: 'pin'}, veta: {texto: 'Veta', icono: 'marca'}, decidir: {texto: 'Decide', icono: 'check'},
    equipo: {texto: 'Team', icono: 'equipo'}, operaciones: {texto: 'Deals', icono: 'caja'}, oficina: {texto: 'Veta', icono: 'marca'}};
  // el sitio de inicio de la agente se rotula “Hoy”; el de dirección sigue siendo “Inicio”
  const rotulo = d => (d === INICIO && VETA.yo().papel !== 'direccion' ? 'Today' : SITIOS[d].texto);
  const cajas = () => CAJAS[VETA.yo().papel] || CAJAS.agente;
  const sitios = () => [INICIO].concat(cajas());
  VETA.SITIOS = SITIOS; VETA.cajas = cajas;
  // tanda V · el ambiente (data-sitio): el sitio del que cuelga la pantalla. Inicio y sus detalles (destino “hoy”) = inicio; “decidir” = equipo; sin destino (portada, entrar, primer día) = ninguno
  // ola premium D · el tono de una pantalla es el del sitio cuya pestaña está ENCENDIDA en la barra (la misma fuente que destinoMarcado): detalle abierto desde Inicio = tono de Inicio;
  // abierto desde una raíz = el de esa raíz; Dictar y las pantallas que no cuelgan de ningún sitio (Cuenta, Avisos…) = “neutro”. Una copia que asoma al deslizar (peek) es una raíz: el suyo.
  const sitioDe = (e, peek) => {
    if (!e || !e.def) return null;
    if (peek) return e.ruta === INICIO ? INICIO : esRaiz(e) ? e.def.destino : 'neutro';
    const m = destinoMarcado();
    if (m === 'dictar') return 'neutro';
    if (m !== INICIO) return m;
    return e.ruta === INICIO || e.def.destino ? INICIO : 'neutro';
  };
  const AREA = {inicio: 'hoy', hoy: 'hoy', visitas: 'hoy', clientes: 'clientes', pisos: 'clientes', veta: 'aprende', equipo: 'direccion', decidir: 'direccion', operaciones: 'direccion', oficina: 'aprende'};
  // raíz = una pestaña de la barra de quien mira. “Clientes” es raíz para la agente y un detalle de Inicio para dirección; “Te toca a ti” ya no lo es
  const esRaiz = e => !!(e && e.def.destino && e.def.ruta === e.def.destino && cajas().includes(e.def.destino));
  // ---- ronda 8 · redirecciones (PLAN_R8.md, 2.2): las rutas que se funden con otra llevan a la que queda ----
  // hoy → inicio (agente) · decidir → inicio · reglas → veta · clientes/al-dia → clientes con el filtro “Todos” · veta → oficina (dirección)
  // {mira: true} solo calcula el destino; sin él, clientes/al-dia deja dicho el filtro en VETA.est('r8.filtroClientes') = 'todos'.
  function redirige(ruta, mira) {
    ruta = String(ruta || '');
    const dir = VETA.yo().papel === 'direccion';
    if (ruta === 'clientes/al-dia') { if (!mira) VETA.est.pon('r8.filtroClientes', 'todos'); return 'clientes'; }
    if (ruta === 'decidir' || (ruta === 'hoy' && !dir)) return INICIO;
    if (ruta === 'reglas') ruta = 'veta';
    if (ruta === 'veta' && dir) return 'oficina';
    if (ruta === 'veta/mia' && !dir) return 'veta';
    // las reglas de una agente (sus casos, con los nombres y las frases de sus clientes) y lo que ella dictó (entendido-dictado: su guion con Jordi y Pere) no las abre dirección: por la ruta escrita a mano va a su Oficina
    // (K2: van a “Veta” de dirección, la Oficina, y no a “Lo que Veta hace por ti”: su “volver” caía en Inicio; los trabajos de la oficina se abren desde ahí, en G2b)
    if (dir && /^(regla|entendido)\//.test(ruta)) return 'oficina';
    // lo que dicta la propia dirección (una tarea suya, o una nota de un cliente SUYO) llega a su “Lo que he entendido”; sin dictado propio, o de un contacto que no es suyo, no hay nada que enseñar
    if (dir && /^entendido-dictado\//.test(ruta)) { const u = VETA.est.lee('a.ultimoDictado', null); return u && u.texto && (!u.cliente || VETA.esSuyo(u.cliente)) ? ruta : 'veta/mia'; }
    return ruta;
  }
  VETA.redirige = ruta => redirige(ruta, true);
  const PRE = ['E1', 'E2', 'A18'];   // antes de entrar: portada, entrar y primer día (sin barra, con la cabecera de siempre)
  const esPre = e => !!e && PRE.indexOf(e.def.cod) >= 0;

  // ---- la pila = el camino (Inicio › caja › ficha…). El historial del navegador lleva las mismas entradas, una por nivel ----
  let pila = VETA.est.lee('pila', []);
  let actual = null;
  let cuenta = VETA.est.lee('serie', 0), serie = 0;   // cada entrada del historial lleva su número de serie: menor = está detrás
  const guardaPila = () => VETA.est.pon('pila', pila.map(x => ({ruta: x.ruta, titulo: x.titulo, scroll: x.scroll || 0})));
  let ignora = null;
  let quieto = false, quietoHasta = 0, alQuieto = null;   // tanda S: el próximo pinta con dirección va sin transición y avisa a alQuieto
  const pon = (ruta, n, reemplaza) => {
    const h = history.state, url = '#/' + ruta;
    const st = {veta: true, n, s: reemplaza && h && h.veta && h.s ? h.s : ++cuenta};
    serie = st.s; VETA.est.pon('serie', cuenta);
    try { if (reemplaza) history.replaceState(st, '', url); else history.pushState(st, '', url); }
    catch (e) { ignora = ruta; if (reemplaza) location.replace(url); else location.hash = url; }
  };

  function guardaScroll() {
    VETA.$$('#marco .col').forEach(col => {
      const d = col.querySelector('.desplaza'); const r = col.dataset.ruta; if (!d || !r) return;
      pila.forEach(x => { if (x.ruta === r) x.scroll = d.scrollTop; });
    });
  }
  const scrollDe = ruta => { const x = pila.slice().reverse().find(y => y.ruta === ruta); return x ? x.scroll || 0 : 0; };

  // ruta del padre (para entrar en frío y para el “‹”)
  function padreDe(e) {
    const m = MAPA[e.def.cod];
    // FA · una misma ruta con dos padres (informe/pere cuelga de cliente/pere; informe/elena, de visita/elena): la pantalla lo dice con `padreRuta`
    if (typeof e.def.padreRuta === 'function') { const r = e.def.padreRuta(e.p); if (r && resuelve(r)) return r; }
    if (m && m.padre && MAPA[m.padre]) {
      const pm = MAPA[m.padre];
      const r = conParams(pm.ruta, e.p);
      return r.split('/').some(s => !s) ? pm.ejemplo : r;
    }
    return INICIO;
  }
  // el camino entero de una ruta, por los padres del mapa (V5): Inicio › caja › …
  function camino(ruta) {
    const out = []; let e = resuelve(ruta), g = 0;
    while (e && g++ < 8) {
      out.unshift({ruta: e.ruta, titulo: titulo(e)});
      if (esPre(e) || e.ruta === INICIO) break;
      e = resuelve(padreDe(e));
    }
    return out;
  }

  // ---- cabeceras (ronda 8 · PLAN_R8.md, 4.1 pieza 1 y apartado 5) ----
  // Tres formas: RAÍZ (56 px, título de 28, sin “volver”) · DETALLE (60 px: flecha de 44 y, a su derecha, el nombre de donde vienes
  // sobre el título de 20) · PASO (como detalle, con los puntos de paso a la derecha). No hay “?”: el campo `frase` ya no se pinta.
  // Lo que la cabecera y el marco leen de cada pantalla (todo opcional; texto o `p => texto`):
  //   sub         subtítulo: primera línea del contenido (15 px, gris, 12 palabras como mucho)
  //   nota        nota sobre el botón del pie (10 palabras como mucho). Texto, o {texto, candado: true} si promete que nada sale solo
  //   mas         “Más” arriba a la derecha: id de hoja ('h02'), o {hoja, datos} · {accion} · {ir}
  //   cabDerecha  p => {tipo: 'cara' | 'telefono' | 'mas' | 'saltar' | 'puntos' | 'imprimir', …}. Una cosa o ninguna: si hay cabDerecha, `mas` no se pinta
  const val = (x, p) => (typeof x === 'function' ? x(p) : x);
  const seguro = (f, d) => { try { const v = f(); return v == null ? d : v; } catch (er) { setTimeout(() => { throw er; }); return d; } };
  const DER = {
    cara: o => `<button type="button" class="cab-b cab-cara"${UI.attrs(Object.assign({ir: 'cuenta'}, o))} aria-label="${esc(o.texto || 'Your account, ' + VETA.yo().nombre)}">${VETA.av(o.quien || VETA.yo().id, 40)}</button>`,
    telefono: o => `<button type="button" class="cab-b"${UI.attrs(o)} aria-label="${esc(o.texto || 'Call or write')}">${VETA.ic('telefono', 24)}</button>`,
    mas: o => `<button type="button" class="cab-b cab-b-t"${UI.attrs(o)}>${esc(o.texto || 'More')}</button>`,
    saltar: o => `<button type="button" class="cab-b cab-b-t"${UI.attrs(o)}>${esc(o.texto || 'Skip')}</button>`,
    imprimir: o => `<button type="button" class="cab-b cab-b-t"${UI.attrs(Object.assign({accion: 'imprimir'}, o))}>${esc(o.texto || 'Print')}</button>`,
    puntos: o => { const t = o.total || 4, n = Math.max(1, Math.min(t, o.paso || 1)); return `<span class="cab-puntos" role="img" aria-label="${esc(o.texto || `Step ${n} of ${t}`)}">${Array.from({length: t}, (_, k) => `<i${k < n ? ' class="on"' : ''}></i>`).join('')}</span>`; }
  };
  // VETA.cabDer({tipo: 'mas', hoja: 'h02'}) → el HTML de lo de arriba a la derecha (lo usa la cabecera; una pantalla no lo llama)
  const cabDer = o => {
    if (!o) return '';
    if (typeof o === 'string') return o;   // HTML ya hecho (lo de antes de la ronda 8): se pinta tal cual hasta que su carril lo pase a {tipo}
    if (!DER[o.tipo]) { console.warn('cabDerecha: type that does not exist', o.tipo); return ''; }
    return DER[o.tipo](o);
  };
  VETA.cabDer = cabDer;
  function derecha(e) {
    let d = e.def.cabDerecha ? seguro(() => e.def.cabDerecha(e.p), '') : '';
    if (!d) { const m = seguro(() => val(e.def.mas, e.p), null); if (m) d = Object.assign({tipo: 'mas'}, typeof m === 'string' ? {hoja: m} : m); }
    // en una raíz, si no hay otra cosa, tu cara: es la misma puerta de Cuenta que en Inicio, en el mismo sitio de las cuatro pestañas
    if (!d && esRaiz(e)) d = {tipo: 'cara'};
    const h = cabDer(d);
    return h ? `<span class="cab-der">${h}</span>` : '';
  }
  // el nombre de la pantalla de la que vienes: el título de la anterior de la pila; en frío, el del padre del mapa
  const origen = e => {
    const i = pila.findIndex(x => x.ruta === e.ruta);
    if (i > 0 && pila[i - 1].titulo) return pila[i - 1].titulo;
    const r = resuelve(padreDe(e)); return r ? titulo(r) : 'Home';
  };
  function cabecera(e, modo) {
    if (e.def.sinCabecera) return '';
    const t = esc(titulo(e));
    if (modo === 'lista') return `<header class="cab cab-lista"><h1 class="cab-t">${t}</h1></header>`;
    if (modo === 'panel') {
      const migas = pila.map((x, k) => ({x, k})).filter(o => o.k < pila.length - 1);
      // panel que se abre solo (primera fila de la lista): la pila no lo tiene, pero la miga dice de qué lista sale
      const top = pila[pila.length - 1], auto = top && top.ruta !== e.ruta;
      const raizMiga = auto ? `<span class="miga-b miga-quieta">${esc(top.titulo || '')}</span><span class="miga-s" aria-hidden="true">›</span>` : '';
      return `<header class="cab cab-panel"><nav class="miga" aria-label="Where you are">${raizMiga}${migas.map(o => `<button type="button" class="miga-b" data-atras-a="${o.k}">${esc(o.x.titulo || '')}</button><span class="miga-s" aria-hidden="true">›</span>`).join('')}<h1 class="cab-t">${t}</h1></nav>${derecha(e)}</header>`;
    }
    const tt = e.def.cabTitulo ? e.def.cabTitulo(e.p) : t;
    if (esRaiz(e)) return `<header class="cab cab-raiz"><h1 class="cab-t">${tt}</h1>${derecha(e)}</header>`;
    const ant = esc(origen(e));
    return `<header class="cab cab-det"><button type="button" class="cab-atras" data-atras aria-label="Back to ${ant}">${VETA.ic('atras', 24)}</button>` +
      `<div class="cab-c"><span class="cab-de">${ant}</span><h1 class="cab-t">${tt}</h1></div>${derecha(e)}</header>`;
  }
  // la línea de apoyo (pieza 15): el subtítulo, primera línea del contenido, y la nota, sobre el botón del pie.
  const subDe = e => {
    const s = seguro(() => val(e.def.sub, e.p), '');
    return s ? `<p class="r7-sub" data-i="0">${esc(s)}</p>` : '';
  };
  const notaDe = e => {
    const n = seguro(() => val(e.def.nota, e.p), '');
    if (!n) return '';
    const o = typeof n === 'string' ? {texto: n} : n;
    return o.texto ? VETA.r7.nota(o.texto, o) : '';   // con un nombre de VETA.PROMESA ('envio', 'nada', 'chats') pinta la frase canónica y su candado
  };

  // ---- montar una pantalla en una columna ----
  function monta(col, e, modo, o) {
    o = o || {};
    // si es la misma pantalla que se repinta, qué “hechos” había: el que aparezca ahora es nuevo y su ✓ se dibuja
    const antes = col.dataset.ruta === e.ruta && col.dataset.pant === e.def.cod ? VETA.r7.clavesHecho(col) : null;
    col.className = 'col col-' + modo + (o.activa ? ' activa' : '');
    col.dataset.area = e.def.area || AREA[e.def.destino] || (e.def.completa ? 'voz' : 'yo');
    { const st = sitioDe(e, o.peek); if (st) col.dataset.sitio = st; else delete col.dataset.sitio; }
    col.dataset.ruta = e.ruta; col.dataset.pant = e.def.cod;
    col._entrada = e;
    let cuerpo;
    try { cuerpo = VETA.tieneParam('error') && e.def.cod !== 'E1' ? UI.error() : e.def.pinta(e.p); }
    catch (err) { setTimeout(() => { throw err; }); cuerpo = UI.error({texto: 'This screen failed to render.'}); }
    const fijo = e.def.botonFijo ? e.def.botonFijo(e.p) : '';
    // el pie (80 px; 108 con nota): la nota va dentro, sobre el botón. Sin botón no hay pie ni nota
    col.innerHTML = cabecera(e, modo) + (navigator.onLine === false ? UI.sinRed() : '') +
      `<div class="desplaza" tabindex="-1"><section class="pant pant-${esc(e.def.cod)}" data-pant="${esc(e.def.cod)}" aria-label="${esc(titulo(e))}"><div class="pant-cuerpo">${modo === 'lista' ? '' : subDe(e)}${cuerpo}</div></section></div>` +
      (fijo ? `<div class="fijo">${notaDe(e)}${fijo}</div>` : '');
    const d = col.querySelector('.desplaza');
    if (o.scroll) d.scrollTop = o.scroll;
    VETA.mov.vigilaDesplazamiento(d, col);
    if (e.def.alMontar) { try { e.def.alMontar(col.querySelector('.pant'), e.p); } catch (err) { setTimeout(() => { throw err; }); } }
    // las piezas vivas: filtros, el ✓ del hecho nuevo y el centrado de las pantallas de una tarjeta (`centra: true | false` en la pantalla lo fuerza)
    VETA.r7.alMontar(col, {antes, pie: !!fijo, centra: modo === 'lista' ? false : e.def.centra});
    return col;
  }

  // ---- pintar lo que toca según la pila ----
  // en ordenador la lista de la izquierda se vuelve a montar si el modelo cambió desde la última vez (p. ej. tras decidir en el panel)
  let listaVieja = false;
  // ronda 8 · la lista de la izquierda es la raíz por la que se entró (la del camino). Lo que se abre desde Inicio va a una columna, como en móvil
  const raizDe = () => pila.map(x => resuelve(x.ruta)).find(esRaiz) || null;
  function pinta(dir, foco, soloRepinta) {
    const top = pila[pila.length - 1];
    let e = resuelve(top.ruta);
    if (!e) { top.ruta = entrada(); e = resuelve(top.ruta); pon(top.ruta, pila.length - 1, true); }
    top.titulo = titulo(e);
    actual = e;
    const app = document.getElementById('app'), a = document.getElementById('col-a'), b = document.getElementById('col-b');
    const ord = VETA.ordenador();
    // tanda S · un cambio de sitio hecho con el dedo (o con la barra) lo anima movimiento.js: aquí se pinta sin transición ni cascada
    const q = !!dir && quieto; if (dir && quieto) quieto = false;
    const cambio = () => {
      let donde;
      app.dataset.completa = e.def.completa ? 'si' : 'no';
      { const st = sitioDe(e); if (st) app.dataset.sitio = st; else delete app.dataset.sitio; }
      if (!ord) {
        app.dataset.vista = 'movil';
        donde = monta(a, e, e.def.completa ? 'completa' : 'movil', {activa: true, scroll: soloRepinta || dir === 'atras' ? scrollDe(e.ruta) : 0});
        b.innerHTML = ''; b.className = 'col'; delete b.dataset.ruta;
      } else if (e.def.completa || e.def.ancha || !raizDe(e)) {
        app.dataset.vista = e.def.completa && esPre(e) ? 'completa' : 'ancha';   // D20 · un documento no se queda sin el menú lateral
        donde = monta(a, e, e.def.completa ? 'completa' : 'detalle', {activa: true, scroll: soloRepinta || dir === 'atras' ? scrollDe(e.ruta) : 0});
        b.innerHTML = ''; b.className = 'col'; delete b.dataset.ruta;
      } else {
        app.dataset.vista = 'dos';
        // la lista: el destino de la base de la pila
        const raiz = raizDe(e);
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
          const pf = a.querySelector('.pant [data-panel]'), f = a.querySelector('.pant :is(.r7-fila,.fila)[data-ir]');   // las filas de la ronda 8 son .r7-fila
          panel = pf && resuelve(pf.dataset.panel) ? resuelve(pf.dataset.panel) : f ? resuelve(f.dataset.ir) : null;
        }
        if (panel) donde = monta(b, panel, 'panel', {activa: true, scroll: soloRepinta || dir === 'atras' ? scrollDe(panel.ruta) : 0});
        else { b.className = 'col col-panel activa'; b.innerHTML = VETA.r7.vacio('Choose something from the list'); delete b.dataset.ruta; donde = b; }
        VETA.$$('.marcada', a).forEach(x => x.classList.remove('marcada'));
        const r = panel ? panel.ruta : '';
        const m = VETA.$$('[data-ir]', a).find(x => x.dataset.ir === r) || VETA.$$('[data-ir]', a).find(x => r.indexOf(x.dataset.ir + '/') === 0);
        if (m) m.classList.add('marcada');
      }
      pintaBarra(); pintaLateral();
      if (VETA.avisoRecoloca) VETA.avisoRecoloca();
      document.title = (e.def.cod === 'E1' ? 'Veta' : titulo(e) + ' · Veta');
      // la cascada arranca ya dentro del cambio, para que se vea durante la transición (solo al ir adelante o cambiar de pestaña)
      // en una raíz (y en Inicio) no suben los bloques: entran escalonadas sus seis primeras filas. En el resto, la cascada de siempre
      if (!soloRepinta && !q && (dir === 'adelante' || dir === 'pestana')) {
        const pant = donde && donde.querySelector ? donde.querySelector('.pant') : null;
        if (esRaiz(e) || e.ruta === INICIO) VETA.mov.escalona(pant); else VETA.mov.cascada(pant);
      }
      return donde;
    };
    const fin = donde => {
      if (!soloRepinta) {
        const d = donde && donde.querySelector && donde.querySelector('.desplaza');
        if (d && dir) try { d.focus({preventScroll: true}); } catch (x) {}
      }
      guardaPila();
    };
    if (q && Date.now() < quietoHasta) {
      const donde = cambio(); fin(donde);
      if (alQuieto) { const f = alQuieto; alQuieto = null; f(); }
      return;
    }
    if (dir) {
      let donde = null;
      VETA.mov.transiciona(() => (donde = cambio()), dir, foco).then(() => fin(donde), () => fin(donde));
      return;
    }
    fin(cambio());
  }

  // ---- navegar ----
  // VETA.ir('cliente/pere', {foco: el, reemplaza: false, pestana: false, dir: 'adelante'})
  // al cambiar de ruta no se queda nada de la pantalla anterior: ni hoja abierta ni aviso negro
  const sueltaTodo = () => { if (VETA.cierraHoja) VETA.cierraHoja({foco: false}); if (VETA.quitaAviso) VETA.quitaAviso(); };
  const empuja = (ruta, dir, foco) => { pila.push({ruta}); pon(ruta, pila.length - 1, false); pinta(dir, foco); };
  // volver al nivel k del camino: el historial retrocede los mismos pasos (así flecha, gesto y “atrás” son lo mismo, V2)
  let esperado = null, tEsp = 0;
  function vuelveA(k, despues) {
    const pasos = pila.length - 1 - k, nueva = pila.slice(0, k + 1);
    const aplica = () => {
      esperado = null; clearTimeout(tEsp);
      pila = nueva; const st = history.state;
      if (st && st.veta && st.n === k && rutaHash() === pila[k].ruta) serie = st.s; else pon(pila[k].ruta, k, true);
      if (despues) despues(); else pinta('atras');
    };
    const st = history.state;
    if (pasos > 0 && st && st.veta && st.n === pila.length - 1) { esperado = aplica; tEsp = setTimeout(aplica, 600); history.go(-pasos); }
    else aplica();
  }
  // cambiar de caja (barra, menú o caja de Inicio): camino nuevo Inicio › caja, sin dejar rastro de la caja anterior (V4)
  function cambiaCaja(ruta, foco) {
    const fin = () => {
      if (pila.length > 1) { pila = [pila[0], {ruta}]; pon(ruta, 1, true); } else { pila.push({ruta}); pon(ruta, 1, false); }
      pinta('pestana', foco);
    };
    if (pila.length > 2) vuelveA(1, fin); else fin();
  }
  VETA.ir = (ruta, o) => {
    o = o || {};
    ruta = redirige(String(ruta).replace(/^#?\/?/, ''));
    let e = resuelve(ruta);
    if (!e) { VETA.aviso('That screen doesn\'t exist yet.'); return; }
    sueltaTodo();
    // sin permiso, o al acabar de entrar (portada, entrar, primer día): se aterriza en Inicio
    if (vedada(ruta) || (actual && esPre(actual) && esRaiz(e))) { ruta = INICIO; e = resuelve(ruta); }
    guardaScroll();
    const k = pila.findIndex(x => x.ruta === ruta), L = pila.length;
    if (L && k === L - 1) { if (!actual) pinta(null); return; }
    if (k >= 0) { vuelveA(k); return; }   // V3: ya está en el camino → se vuelve a ella, no se apila otra vez
    if (o.reemplaza && L) { pila[L - 1] = {ruta}; pon(ruta, L - 1, true); pinta(o.dir || 'adelante', o.foco); return; }
    // FN · el “Hecho” de un asistente: {sobre: k} quita del camino los pasos y apila la pantalla sobre el nivel k (la pantalla desde
    // la que se empezó). Así atrás —flecha, gesto o navegador— va de “Hecho” a esa pantalla, sin pasar otra vez por los pasos.
    if (typeof o.sobre === 'number' && o.sobre >= 0 && o.sobre < L - 1 && pila[0].ruta === INICIO) { vuelveA(o.sobre, () => empuja(ruta, o.dir || 'adelante', o.foco)); return; }
    if (!esPre(e) && !(L && pila[0].ruta === INICIO)) {   // se entra en la app: camino nuevo desde Inicio
      camino(ruta).forEach((x, i) => { pila = i ? pila.concat([x]) : [x]; pon(x.ruta, i, false); });
      pinta('pestana', o.foco); return;
    }
    if (esRaiz(e)) { cambiaCaja(ruta, o.foco); return; }
    if (o.desdeLista) {
      const r = pila.findIndex(x => esRaiz(resuelve(x.ruta)));
      if (r >= 0 && r < L - 1) { vuelveA(r, () => empuja(ruta, 'adelante', o.foco)); return; }
    }
    empuja(ruta, o.dir || 'adelante', o.foco);
  };
  VETA.inicio = () => VETA.ir(INICIO);
  VETA.atras = () => {
    sueltaTodo(); guardaScroll();
    if (pila.length > 1) { vuelveA(pila.length - 2); return; }
    if (!actual || actual.ruta === INICIO || esPre(actual)) return;   // Inicio no tiene “volver”
    pila = []; camino(padreDe(actual)).forEach((x, i) => { pila.push(x); pon(x.ruta, i, i === 0); }); pinta('atras');
  };
  // volver a un punto del camino (migas del panel en ordenador)
  VETA.atrasA = n => { n = Number(n); if (!(n >= 0 && n < pila.length - 1)) return; sueltaTodo(); guardaScroll(); vuelveA(n); };
  // repinta la pantalla actual (después de cambiar el modelo); {hecho: id} hace el “hecho en el sitio” (efecto 7)
  VETA.repinta = o => {
    o = o || {}; guardaScroll();
    if ((o.hecho || o.paso) && !VETA.reducido() && VETA.mov.hayVT()) { pinta('cambia', null, true); return; }   // {paso: true}: lo que lleve data-vt viaja a su sitio
    pinta(null, null, true);
  };
  VETA.actual = () => actual;
  VETA.pila = () => pila.slice();

  // el gesto del iPhone desde el borde ya trae su propia animación: la nuestra no se suma (V8)
  let tBorde = 0;
  document.addEventListener('touchstart', ev => { const t = ev.touches && ev.touches[0]; if (t && (t.clientX < 36 || t.clientX > window.innerWidth - 36)) tBorde = Date.now(); }, {passive: true, capture: true});
  const gesto = () => Date.now() - tBorde < 1500 || navigator.standalone === true;

  // “atrás” del navegador (botón o gesto). Con una hoja abierta: cierra la hoja y la pantalla se queda donde está (V7)
  // (el navegador ya retrocedió una entrada: se le hace avanzar y se ignoran los avisos de ese ir y venir)
  let restaura = null;
  function alVolverNavegador() {
    const ruta = rutaHash(), st = history.state, top = pila[pila.length - 1];
    if (restaura) { if (ruta === restaura.ruta) restaura = null; return; }
    if (ignora === ruta) { ignora = null; return; }
    if (esperado) { esperado(); return; }
    if (st && st.veta && st.s === serie && top && ruta === top.ruta) return;   // segundo aviso del mismo paso
    if (VETA.hojaActual && VETA.hojaActual() && actual) {
      VETA.cierraHoja({foco: false}); if (VETA.quitaAviso) VETA.quitaAviso();
      restaura = {ruta: actual.ruta}; setTimeout(() => { restaura = null; }, 800);
      try { history.forward(); } catch (e) { restaura = null; }
      return;
    }
    sueltaTodo(); guardaScroll();
    const anima = d => (gesto() ? null : d);
    const e0 = resuelve(ruta);
    if (!st || !st.veta || !e0 || vedada(ruta) || redirige(ruta, true) !== ruta) {   // dirección escrita a mano o enlace: camino nuevo por el mapa (V5)
      const r = e0 && !vedada(ruta) ? redirige(ruta) : (VETA.est.lee('dentro', false) ? INICIO : 'portada');
      pila = []; camino(r).forEach((x, i) => { pila.push(x); pon(x.ruta, i, i === 0); });
      pinta('adelante'); return;
    }
    if (st.n < pila.length - 1 && pila[st.n] && pila[st.n].ruta === ruta) { pila = pila.slice(0, st.n + 1); serie = st.s; pinta(anima('atras')); return; }
    if (st.s < serie) {   // atrás: un nivel menos del camino, pase lo que pase en el historial
      if (pila.length > 1) { pila.pop(); pon(pila[pila.length - 1].ruta, pila.length - 1, true); pinta(anima('atras')); return; }
      // en la primera pantalla (Inicio) atrás no hace nada: no sale a la portada ni a entrar (V4)
      pon(top.ruta, 0, true); pinta(null, null, true); return;
    }
    if (st.n === pila.length) pila.push({ruta}); else pila = camino(ruta);   // adelante del navegador
    pon(ruta, pila.length - 1, true); pinta(anima('adelante'));
  }

  // ---- barra de abajo (móvil) y menú de la izquierda (ordenador): Inicio, las tres raíces del papel y, en el centro, el micro ----
  // Pestaña marcada: la raíz por la que se entró (la del camino). Si no hay ninguna —Cuenta y lo que cuelga de ella, lo que se abre
  // desde Inicio— se marca Inicio. En Dictar y sus pasos, el micro.
  function destinoMarcado() {
    if (!actual) return null;
    if (actual.ruta === INICIO) return INICIO;
    if (/^dicta/.test(actual.def.archivo || '')) return 'dictar';
    const c = pila.map(x => resuelve(x.ruta)).find(esRaiz);
    return c ? c.def.destino : INICIO;
  }
  // lo que queda pendiente: “Te toca a ti” (agente) o lo que espera decisión (dirección). El número se dice una vez, en la frase de Inicio;
  // la barra solo pone un punto de 8 px en Inicio cuando hay algo y no estás allí.
  function pendiente() {
    const d = VETA.yo().papel === 'direccion' ? 'decidir' : 'hoy';
    let c = null; try { c = VETA.r7 && VETA.r7.cuentas && VETA.r7.cuentas(); } catch (e) {}
    if (c && typeof c[d] === 'number') return c[d];
    return d === 'hoy' ? VETA.modelo.contador(VETA.yo().id) : 0;
  }
  VETA.pendiente = pendiente;
  const puntoHtml = (n, marcado) => (n > 0 && marcado !== INICIO ? `<span class="tab-punto" role="img" aria-label="${n} to do"></span>` : '');
  const firmaDe = marcado => sitios().join() + '|' + marcado + '|' + (pendiente() > 0) + '|' + VETA.yo().id;
  // el micro: data-ir="dictar/libre" y data-mic (antes de ir se guarda de qué pantalla sale: ver el clic, más abajo)
  const microHtml = marcado => `<button type="button" class="tab-mic${marcado === 'dictar' ? ' on' : ''}" data-ir="dictar/libre" data-mic aria-label="Dictate"${marcado === 'dictar' ? ' aria-current="page"' : ''}><span class="tab-mic-c">${VETA.ic('mic', 24)}</span></button>`;
  function pintaBarra() {
    const el = document.getElementById('barra'); if (!el) return;
    const marcado = destinoMarcado(), firma = firmaDe(marcado);
    if (el.dataset.firma === firma) return;
    // FN · en mitad de una transición no se tocan las pestañas (llevan nombre de transición y Chromium se cae): se repinta al acabar
    if (VETA.mov.ocupada()) { VETA.mov.alAcabar('barra', pintaBarra); return; }
    el.dataset.firma = firma;
    const tab = d => `<button type="button" class="tab${d === marcado ? ' on' : ''}" data-tab="${d}"${d === marcado ? ' aria-current="page"' : ''} style="view-transition-name:tab-${d}">` +
      `<span class="tab-ic">${VETA.ic(SITIOS[d].icono, 24)}${d === INICIO ? puntoHtml(pendiente(), marcado) : ''}</span><span class="tab-p">${rotulo(d)}</span></button>`;
    const l = sitios();
    // tanda V · N sitios y el micro en el centro: la mitad a cada lado (con 4: 2 + micro + 2; con 6: 3 + micro + 3; con un número impar, el lado izquierdo lleva uno más)
    const k = Math.ceil(l.length / 2);
    el.innerHTML = `<div class="tabs" data-papel="${VETA.yo().papel === 'direccion' ? 'direccion' : 'agente'}" data-n="${l.length}"${l.length === 4 || l.length === 6 ? '' : ` style="grid-template-columns:repeat(${k},1fr) 64px repeat(${l.length - k},1fr)"`}>${l.slice(0, k).map(tab).join('')}${microHtml(marcado)}${l.slice(k).map(tab).join('')}</div>`;
  }
  function pintaLateral() {
    const el = document.getElementById('lateral'); if (!el) return;
    const marcado = destinoMarcado(), yo = VETA.yo(), firma = firmaDe(marcado);
    if (el.dataset.firma === firma) return;
    el.dataset.firma = firma;
    el.innerHTML = `<div class="lat-marca"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>` +
      `<div class="lat-dest">${sitios().map(d => `<button type="button" class="lat-d${d === marcado ? ' on' : ''}" data-tab="${d}"${d === marcado ? ' aria-current="page"' : ''}>${VETA.ic(SITIOS[d].icono, 22)}<span>${SITIOS[d].largo || rotulo(d)}</span>${d === INICIO ? puntoHtml(pendiente(), marcado) : ''}</button>`).join('')}</div>` +
      `<button type="button" class="lat-mic${marcado === 'dictar' ? ' on' : ''}" data-ir="dictar/libre" data-mic><span class="mic-c">${VETA.ic('mic', 22)}</span><span>Dictate</span></button>` +
      `<button type="button" class="lat-yo" data-ir="cuenta">${VETA.av(yo.id, 40)}<span class="lat-yo-c"><span class="lat-yo-n">${esc(yo.nombre)}</span><span class="lat-yo-p">${esc(yo.papelTexto)}</span></span></button>`;
  }
  VETA.pintaBarra = () => { ['barra', 'lateral'].forEach(id => { const el = document.getElementById(id); if (el) delete el.dataset.firma; }); pintaBarra(); pintaLateral(); };
  VETA.modelo.al(() => { pintaBarra(); pintaLateral(); });

  // ---- tanda S · lo que necesita movimiento.js para deslizar entre sitios (el gesto vive allí; aquí, el mapa y la navegación) ----
  // info(): qué hay a cada lado de la pantalla abierta. En un sitio (Inicio y las raíces de la barra): izq/dcha son sus vecinos en el orden de
  // la barra (el micro no cuenta: es una acción). En un detalle con flecha de volver: atras = a dónde lleva la flecha. Si no, null.
  const colActiva = () => VETA.$('#marco .col.activa');
  VETA.gestos = {
    sitios,
    marcado: destinoMarcado,
    info() {
      if (!actual || esPre(actual)) return null;
      const ss = sitios(), i = ss.indexOf(actual.ruta);
      if (i >= 0) return {tipo: 'sitio', izq: ss[i - 1] || null, dcha: ss[i + 1] || null};
      const c = colActiva();
      if (c && c.querySelector('[data-atras]')) return {tipo: 'detalle', atras: pila.length > 1 ? pila[pila.length - 2].ruta : padreDe(actual)};
      return null;
    },
    // una copia pintada de la pantalla `ruta` para que asome mientras se arrastra: no toca la pila ni el historial
    peek(ruta) {
      const e = resuelve(redirige(String(ruta), true)); if (!e) return null;
      const el = document.createElement('div');
      try { monta(el, e, e.def.completa ? 'completa' : 'movil', {activa: false, peek: true}); } catch (err) { return null; }
      el.classList.add('col-peek'); delete el.dataset.ruta; delete el.dataset.pant;
      el.setAttribute('aria-hidden', 'true'); el.inert = true;
      return el;
    },
    // navegar sin transición: alPintado se llama cuando la pantalla nueva ya está pintada (o a los 900 ms si no llega a pintarse)
    va(ruta, alPintado) { quieto = true; quietoHasta = Date.now() + 900; alQuieto = alPintado || null; VETA.ir(ruta, {pestana: true}); },
    atras(alPintado) { quieto = true; quietoHasta = Date.now() + 900; alQuieto = alPintado || null; VETA.atras(); },
    suelta() { quieto = false; if (alQuieto) { const f = alQuieto; alQuieto = null; f(); } }
  };

  // ---- entrar con una cuenta (E2): la barra gana o pierde “Equipo”, se abre el primer destino. No hay cambio de perfil dentro de la app ----
  VETA.cambiaPerfil = id => {
    if (!VETA.modelo.persona(id)) return;
    VETA.est.pon('perfil', id);
    VETA.pintaBarra();
    VETA.ir(INICIO);
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

  // ronda 8 · el micro de la barra: antes de ir a Dictar, si la pantalla abierta define `casoDictado(p)` se guarda lo que devuelva
  // ({de, quien, titulo, texto}) en VETA.est('r7.caso'), que es de donde Dictar saca “sobre qué” (lo que antes hacía cada
  // “Enséñale a Veta” incrustado). Si no lo define, no se deja ningún caso viejo.
  function guardaCaso() {
    const e = (VETA.$('.col.activa') || {})._entrada || actual;
    let c = null;
    if (e && typeof e.def.casoDictado === 'function') { try { c = e.def.casoDictado(e.p); } catch (er) { setTimeout(() => { throw er; }); } }
    if (c) VETA.est.pon('r7.caso', c); else VETA.est.quita('r7.caso');
  }
  VETA.dictar = guion => { guardaCaso(); VETA.ir('dictar/' + (guion || 'libre')); };

  document.addEventListener('click', ev => {
    const el = ev.target.closest && ev.target.closest('[data-tab],[data-ir],[data-atras],[data-atras-a],[data-hoja],[data-accion]');
    if (!el || el.closest('[inert]') || el.disabled) return;
    if (el.tagName === 'A') ev.preventDefault();
    // interruptor y selector de dos: el núcleo mueve el pomo; la acción recibe el valor nuevo
    if (el.getAttribute('role') === 'switch') el.setAttribute('aria-checked', el.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    if (el.getAttribute('role') === 'radio' && el.parentNode.classList.contains('selector')) {
      VETA.$$('[role=radio]', el.parentNode).forEach(x => x.setAttribute('aria-checked', x === el ? 'true' : 'false'));
      el.parentNode.style.setProperty('--pos', el.dataset.pos);
    }
    if (el.hasAttribute('data-tab')) {
      const d = el.dataset.tab;
      if (actual && actual.ruta === d) { const s = VETA.$('.col.activa .desplaza') || VETA.$('#col-a .desplaza'); if (s) s.scrollTo({top: 0, behavior: VETA.reducido() ? 'auto' : 'smooth'}); return; }
      if (VETA.mov.deslizaA && VETA.mov.deslizaA(d)) return;
      VETA.ir(d, {pestana: true}); return;
    }
    if (el.hasAttribute('data-accion')) { acciona(el.dataset.accion, ev, el); return; }
    if (el.hasAttribute('data-hoja')) { VETA.hoja(el.dataset.hoja, Object.assign({}, el.dataset)); return; }
    if (el.hasAttribute('data-atras-a')) { VETA.atrasA(el.dataset.atrasA); return; }
    if (el.hasAttribute('data-atras')) { if (el.closest('#hoja')) VETA.cierraHoja({foco: false}); VETA.atras(); return; }
    if (el.hasAttribute('data-ir')) {
      if (el.hasAttribute('data-mic')) guardaCaso();
      if (el.closest('#hoja')) VETA.cierraHoja({foco: false});
      const desdeLista = VETA.ordenador() && !!el.closest('#col-a.col-lista');
      VETA.ir(el.dataset.ir, {foco: el.closest('.tc') || el, desdeLista});
    }
  });

  // ---- arranque ----
  function arranca() {
    const rol = VETA.param('rol');
    if (rol === 'direccion') VETA.est.pon('perfil', 'montse'); else if (rol === 'agente') VETA.est.pon('perfil', 'laura');
    // el atajo ?rol= entra ya con esa cuenta (Hoy o Equipo), sin pasar por la portada; con ?nuevo se ve la entrada entera
    if ((rol === 'direccion' || rol === 'agente') && !VETA.tieneParam('nuevo')) VETA.est.pon('dentro', true);
    if (VETA.param('momento') === 'fin') VETA.modelo.momentoFin();
    const nuevo = VETA.tieneParam('nuevo');
    // se quitan de la dirección los atajos ya aplicados (se queda ?error=1, que es para revisar)
    try {
      const q = new URLSearchParams(location.search); ['nuevo', 'rol', 'momento', 'mov'].forEach(k => q.delete(k));
      const s = q.toString(); history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
    } catch (e) {}
    let ruta = nuevo ? 'portada' : rutaHash();
    // sin sesión (nadie ha entrado aún, o cerró sesión) se empieza siempre por la marca y el idioma (E1)
    if (!ruta || !resuelve(ruta)) ruta = VETA.est.lee('dentro', false) ? INICIO : 'portada';
    ruta = redirige(ruta);
    if (vedada(ruta)) ruta = INICIO;
    // recarga: el camino guardado sigue valiendo si acaba aquí y el historial lo acompaña; si no (entrada en frío), se reconstruye por el mapa (V5)
    const top = pila.length ? pila[pila.length - 1] : null, st = history.state;
    const sano = top && top.ruta === ruta && !nuevo && st && st.veta && st.n === pila.length - 1 && (pila[0].ruta === INICIO || esPre(resuelve(pila[0].ruta))) &&
      pila.every(x => redirige(x.ruta, true) === x.ruta);   // un camino guardado antes de la ronda 8 puede pasar por una ruta que ya no existe
    if (sano) { serie = st.s; cuenta = Math.max(cuenta, st.s); }
    else { pila = []; camino(ruta).forEach((x, i) => { pila.push(x); pon(x.ruta, i, i === 0); }); }
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
