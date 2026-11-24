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
  const G = {E: 'Entrada', A: 'El día', B: 'Clientes', C: 'Veta y cuenta', D: 'Dirección', O: 'De la oficina'};
  const FILAS = [
    ['E1', 'portada', 'Portada', null, 'N', 'portada.js', null, null, {completa: true, sinCabecera: true, grupo: G.E}],
    ['E2', 'entrar', 'Entrar', null, 'C', 'entrar.js', 'A15', null, {completa: true, grupo: G.E}],
    ['A18', 'primer-dia/:paso', 'Primer día', null, 'C', 'primer-dia.js', 'E1', 'primer-dia/0', {completa: true, grupo: G.E}],
    ['A18m', 'mapa', 'Mi mapa de trabajo', 'veta', 'C', 'mapa.js', 'A15', null, {grupo: G.E}],
    ['A1', 'hoy', 'Hoy', 'hoy', 'A', 'hoy.js', null, null, {grupo: G.A}],
    ['A2', 'mensaje/:id', 'Editar mensaje', 'hoy', 'A', 'mensaje.js', 'A1', 'mensaje/c-marta', {grupo: G.A}],
    ['A3', 'dictar/:guion', 'Dictar', null, 'A', 'dictar.js', 'A1', 'dictar/libre', {completa: true, grupo: G.A}],
    ['A4', 'acta/:id', 'Nota de la visita', 'hoy', 'A', 'acta.js', 'A1', 'acta/elena', {completa: true, grupo: G.A}],
    ['A4b', 'entendido-dictado/:id', 'Lo que he entendido', 'hoy', 'A', 'dictado.js', 'A1', 'entendido-dictado/tarea', {completa: true, grupo: G.A}],
    ['A7', 'espera', 'Lo que vigilo por ti', 'hoy', 'A', 'espera.js', 'A1', null, {grupo: G.A}],
    ['A12', 'informe/:id', 'Informe al propietario', 'hoy', 'A', 'informe.js', 'A1', 'informe/pere', {grupo: G.A}],
    ['A5', 'clientes', 'Clientes', 'clientes', 'B', 'clientes.js', null, null, {grupo: G.B}],
    ['A5b', 'clientes/al-dia', 'Los que no te necesitan hoy', 'clientes', 'B', 'clientes.js', 'A5', null, {grupo: G.B}],
    ['A5p', 'pregunta/:id', 'Pregunta a Veta', 'clientes', 'B', 'pregunta.js', 'A5', 'pregunta/jordi', {grupo: G.B}],
    ['A6', 'cliente/:id', 'Ficha de cliente', 'clientes', 'B', 'ficha.js', 'A5', 'cliente/pere', {grupo: G.B, tituloCliente: true}],
    ['A6d', 'cliente/:id/documentos', 'Documentos y fechas', 'clientes', 'B', 'documentos.js', 'A6', 'cliente/pere/documentos', {grupo: G.B}],
    ['A16', 'cliente/:id/historia', 'Historia', 'clientes', 'B', 'historia.js', 'A6', 'cliente/pere/historia', {grupo: G.B}],
    ['A8', 'veta', 'Veta', 'veta', 'C', 'veta.js', null, null, {grupo: G.C}],
    ['A9', 'reglas', 'Lo que hago por ti', 'veta', 'C', 'reglas.js', 'A8', null, {grupo: G.C}],
    ['A9b', 'reglas/semana-pasada', 'La semana pasada', 'veta', 'C', 'reglas.js', 'A9', null, {grupo: G.C}],
    ['A10', 'regla/:id', 'Un trabajo', 'veta', 'C', 'regla.js', 'A9', 'regla/r-valoraciones', {grupo: G.C}],
    ['A10b', 'regla/:id/nivel', 'Hasta dónde llega', 'veta', 'C', 'regla.js', 'A10', 'regla/r-valoraciones/nivel', {grupo: G.C}],
    ['A11', 'entendido/:id', 'Así lo he entendido', 'veta', 'C', 'entendido.js', 'A9', 'entendido/recordatorios', {grupo: G.C}],
    ['A13', 'aprendido', 'Lo que he aprendido', 'veta', 'C', 'aprendido.js', 'A8', null, {grupo: G.C}],
    ['A13b', 'mejora', 'Proponer una mejora', 'veta', 'C', 'aprendido.js', 'A13', null, {grupo: G.C}],
    ['A14', 'semana', 'Tu semana', 'veta', 'C', 'semana.js', 'A8', null, {grupo: G.C}],
    ['A15', 'cuenta', 'Cuenta y privacidad', 'veta', 'C', 'cuenta.js', 'A8', null, {grupo: G.C}],
    ['A15b', 'cuenta/chats', 'Chats que no leo', 'veta', 'C', 'cuenta.js', 'A15', null, {grupo: G.C}],
    ['A15c', 'cuenta/seguridad', 'Seguridad', 'veta', 'C', 'cuenta.js', 'A15', null, {grupo: G.C}],
    ['G1', 'equipo', 'Equipo', 'equipo', 'D', 'equipo.js', null, null, {grupo: G.D}],
    ['G2', 'asunto/:id', 'Qué ha pasado', 'equipo', 'D', 'asunto.js', 'G1', 'asunto/carmen', {grupo: G.D}],
    ['G2b', 'regla-oficina/:id', 'Un trabajo para la oficina', 'equipo', 'D', 'regla-oficina.js', 'G1', 'regla-oficina/dossier', {grupo: G.D}],
    ['G3', 'semana-equipo', 'Semana', 'equipo', 'D', 'semana-equipo.js', 'G1', null, {grupo: G.D}],
    ['G3b', 'semana-equipo/resumen', 'Enviar el resumen', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3c', 'reunion', 'Para la reunión del lunes', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3d', 'oficinas', 'Por oficina', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G3e', 'tiempo-equipo', 'El tiempo que gana el equipo', 'equipo', 'D', 'semana-equipo.js', 'G3', null, {grupo: G.D}],
    ['G5', 'reparto', 'Reparto', 'equipo', 'D', 'reparto.js', 'G1', null, {grupo: G.D}],
    ['G5b', 'reparto/confirmar', 'Pasar sus clientes', 'equipo', 'D', 'reparto.js', 'G5', null, {grupo: G.D}],
    ['G6', 'avisos', 'Avisos', 'equipo', 'D', 'avisos.js', 'G1', null, {grupo: G.D}],
    ['G7', 'conexiones', 'Conexiones y ajustes', 'equipo', 'D', 'conexiones.js', 'G1', null, {grupo: G.D}],
    ['G7b', 'confianza', 'Qué ves tú y qué ve cada persona', 'equipo', 'D', 'conexiones.js', 'G7', null, {grupo: G.D}],
    ['G7c', 'piloto', 'Parte diario del piloto', 'equipo', 'D', 'conexiones.js', 'G7', null, {grupo: G.D}],
    ['G8', 'informe-completo', 'Informe completo', 'equipo', 'D', 'informe-completo.js', 'G3', null, {grupo: G.D}],
    ['G9', 'entra', 'Lo que entra', 'equipo', 'D', 'entra.js', 'G1', null, {grupo: G.D}],
    ['A19', 'que-hace', 'Qué hace Veta por ti', 'veta', 'C', 'que-hace.js', 'A8', null, {grupo: G.C}],
    ['A20', 'antes-ahora', 'Antes y ahora', 'veta', 'C', 'antes-ahora.js', 'A8', null, {grupo: G.C}],
    ['G15', 'oficina-que-hace', 'Qué hace Veta por tu oficina', 'equipo', 'D', 'oficina-que-hace.js', 'G1', null, {grupo: G.D}],
    ['G16', 'oficina-antes-ahora', 'Antes y ahora de la oficina', 'equipo', 'D', 'oficina-antes-ahora.js', 'G1', null, {grupo: G.D}],
    ['G17', 'operaciones', 'Operaciones', 'equipo', 'D', 'operaciones.js', 'G1', null, {grupo: G.D}],
    ['G18', 'operacion/:id', 'Una operación', 'equipo', 'D', 'operacion.js', 'G17', 'operacion/marta', {grupo: G.D}],
    ['G19', 'persona/:id', 'Una persona del equipo', 'equipo', 'D', 'persona.js', 'G1', 'persona/laura', {grupo: G.D}],
    ['G10', 'oficina/practicas', 'Cómo trabajamos', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G11', 'oficina/aprende', 'Lo que aprende la oficina', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G12', 'oficina/falta', 'Lo que Veta aún no hace', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    ['G13', 'oficina/caso/:id', 'Un caso para aprender', 'veta', 'C', 'oficina-veta.js', 'G11', 'oficina/caso/claudia', {grupo: G.O}],
    ['G14', 'oficina/sabe', 'Lo que sabe tu oficina', 'veta', 'C', 'oficina-veta.js', 'A8', null, {grupo: G.O}],
    // ronda 7: Inicio (cuatro cajas) y las raíces nuevas de caja
    ['R0', 'inicio', 'Inicio', null, 'N', 'inicio.js', null, null, {sinCabecera: true, ancha: true, grupo: G.E}],
    ['A21', 'visitas', 'Visitas', 'visitas', 'A', 'visitas.js', 'R0', null, {grupo: G.A}],
    ['A22', 'visita/:id', 'Una visita', 'visitas', 'A', 'visita.js', 'A21', 'visita/elena', {grupo: G.A}],
    ['A24', 'salida/:id', '¿Cómo ha ido?', 'visitas', 'A', 'visita.js', 'A22', 'salida/elena', {completa: true, grupo: G.A}],
    ['A23', 'toca/:id', 'Te toca a ti', 'hoy', 'A', 'hoy.js', 'A1', 'toca/c-marta', {grupo: G.A}],
    ['G20', 'decidir', 'Decidir', 'decidir', 'D', 'decidir.js', 'R0', null, {grupo: G.D}],
    ['G21', 'oficina', 'Veta', 'oficina', 'D', 'oficina.js', 'R0', null, {grupo: G.D}]
  ];
  const MAPA = {};
  FILAS.forEach(([cod, ruta, titulo, destino, paq, archivo, padre, ejemplo, o]) => {
    MAPA[cod] = Object.assign({cod, ruta, titulo, destino, paq, archivo, padre, ejemplo: ejemplo || ruta}, o || {});
  });
  // ronda 7 · el reparto nuevo va encima de la tabla: nombre, caja (destino), padre y LA FRASE de cada raíz (ESTRATEGIA_R7.md, 4 y 7)
  const R7 = {
    A1: {titulo: 'Te toca a ti', padre: 'R0', cuenta: () => VETA.r7.cuentas().hoy, frase: 'Hoy te tocan 6 cosas. Hace un mes eran 9: el resto ya lo hago yo.'},
    A21: {cuenta: () => VETA.r7.cuentas().visitas, frase: 'Antes te la confirmo. Al salir me cuentas cómo ha ido y te dejo el acta y el informe listos.'},
    A5: {padre: 'R0', cuenta: () => VETA.r7.cuentas().clientes, frase: 'Toca una cara y ves qué pasa y qué toca ahora.'},
    A8: {padre: 'R0', frase: 'Esto ya lo hago yo. Esto te lo propongo. Y puedes enseñarme algo nuevo.'},
    G20: {cuenta: () => VETA.r7.cuentas().decidir, frase: '6 cosas esperan tu decisión. Toca una.'},
    G1: {padre: 'R0', frase: 'Toca una persona y ves qué lleva y cómo va.'},
    G17: {padre: 'R0', destino: 'operaciones', cuenta: () => VETA.r7.cuentas().operaciones, frase: '22 operaciones. Primero, las 5 que hay que mirar hoy.'},
    G21: {frase: 'Esto hace Veta por tu oficina. Puedes enviar el resumen al equipo.'},
    A3: {titulo: 'Enséñale a Veta', padre: 'R0'}, A4b: {padre: 'A3'},
    // FC (defectos 5 y 10): Cuenta no es ninguna caja, la barra no marca nada; «Veta en un minuto» vive en Cuenta; lo aprendido cuelga de «Ya lo hago yo» y «Tu semana» de «Antes y ahora»
    A15: {titulo: 'Cuenta', padre: 'R0', destino: null}, A15b: {destino: null}, A15c: {destino: null}, A18m: {destino: null}, A19: {padre: 'A15', destino: null}, A13: {padre: 'A9'}, A14: {padre: 'A20'},
    A4: {titulo: 'Acta de la visita', destino: 'visitas', padre: 'A22'}, A12: {titulo: 'Informe para el propietario', destino: 'visitas', padre: 'A22'},
    A2: {padre: 'A23'},   // FA · «Cambiar el mensaje» cuelga de la tarjeta de su persona (toca/:id), no de la lista
    A7: {padre: 'A9', destino: 'veta'},   // FN · «Lo que vigilo por ti» se abre desde Veta › «Ya lo hago yo»: en frío cuelga de ahí, no de Te toca
    G2: {destino: 'decidir', padre: 'G20'}, G18: {destino: 'operaciones'},
    G3: {destino: 'oficina', padre: 'G21'}, G3b: {destino: 'oficina'}, G3c: {destino: 'oficina'}, G3d: {destino: 'oficina'}, G3e: {destino: 'oficina'}, G8: {destino: 'oficina'},
    G15: {destino: 'oficina', padre: 'G21'}, G16: {destino: 'oficina', padre: 'G21'}, G2b: {destino: 'oficina', padre: 'G21'},
    // FD: Conexiones y Tus avisos cuelgan de Cuenta (A15), con su misma caja marcada; Lo que entra, de Operaciones
    G7: {padre: 'A15', destino: null}, G7b: {destino: null}, G7c: {destino: null}, G6: {padre: 'A15', destino: null},
    G5: {destino: 'decidir', padre: 'G20'}, G5b: {destino: 'decidir'}, G9: {destino: 'operaciones', padre: 'G17'},
    // FD: lo aprendido, lo que aún no hago y cómo trabajamos van dentro de «Lo que ya hago por la oficina» (G15)
    G10: {destino: 'oficina', padre: 'G15'}, G11: {destino: 'oficina', padre: 'G15'}, G12: {destino: 'oficina', padre: 'G15'}, G14: {destino: 'oficina', padre: 'G15'}, G13: {destino: 'oficina'}
  };
  Object.keys(R7).forEach(c => Object.assign(MAPA[c], R7[c]));
  VETA.MAPA = MAPA;

  // ---- las 42 hojas: código → título y quién la hace ----
  const H = [
    ['H01', 'De dónde sale', 'N', 'comunes.js'], ['H02', 'Otra cosa…', 'N', 'comunes.js'], ['H03', 'Registro', 'A', 'dia.js'], ['H04', 'Lo que he leído', 'A', 'dia.js'],
    ['H05', 'Hechas hoy', 'A', 'dia.js'], ['H06', 'Día cerrado', 'A', 'dia.js'], ['H07', 'Lo que dijiste', 'A', 'dia.js'], ['H08', '¿Qué puedo decir?', 'A', 'dia.js'],
    ['H09', 'No es eso', 'A', 'dia.js'], ['H10', 'Mensaje de Pere', 'B', 'clientes.js'], ['H11', 'Otras acciones', 'B', 'clientes.js'], ['H12', 'Compartir resumen', 'B', 'clientes.js'],
    ['H13', 'Fuera del radar', 'B', 'clientes.js'], ['H14', 'Petición lista', 'B', 'clientes.js'], ['H15', '¿Qué pasó con…?', 'B', 'clientes.js'], ['H16', 'Detalle de historia', 'B', 'clientes.js'],
    ['H17', 'Foto ampliada', 'N', 'comunes.js'], ['H18', 'Un caso', 'C', 'veta.js'], ['H19', 'Los 11 casos como yo', 'C', 'veta.js'], ['H20', 'Otra cosa…', 'C', 'veta.js'],
    ['H21', 'Qué he entendido', 'C', 'veta.js'], ['H22', 'Subir un nivel', 'C', 'veta.js'], ['H23', 'Una práctica de la oficina', 'C', 'veta.js'], ['H24', 'Tu tiempo en esta tarea', 'C', 'veta.js'],
    ['H25', 'Una semana anterior', 'C', 'veta.js'], ['H26', 'Aspecto', 'N', 'comunes.js'], ['H28', 'Sin señal', 'C', 'veta.js'],
    ['H29', 'Texto legal', 'N', 'comunes.js'], ['H30', '¿Qué chat borras?', 'C', 'veta.js'], ['H31', 'Poner Veta en la pantalla de inicio', 'C', 'veta.js'], ['H32', 'Un hallazgo del mapa', 'C', 'veta.js'],
    ['H33', 'Calendario', 'C', 'veta.js'], ['H34', 'Los 3 temas de hoy', 'D', 'direccion.js'], ['H35', '¿A quién se lo asignas?', 'D', 'direccion.js'], ['H36', 'Cómo habría ido', 'D', 'direccion.js'],
    ['H37', 'Un aviso puesto', 'D', 'direccion.js'], ['H38', 'Coste por hora', 'D', 'direccion.js'], ['H39', 'Anotar una queja', 'B', 'clientes.js'], ['H40', 'Clientes con dos chats', 'D', 'direccion.js'],
    ['H41', 'Texto de un parte', 'N', 'comunes.js'], ['H42', '¿Cómo quieres enviarlo?', 'A', 'dia.js']
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
      guia: [`Aquí irá «${m.titulo}».`, `La construye el paquete ${m.paq}.`, `Archivo: js/pantallas/${m.archivo}.`],
      pinta: () => {
        const h = hijos(m.cod);
        return `<div class="pendiente tarjeta" data-i="0">${UI.etiqueta('a-prueba', m.cod + ' · provisional')}<h2 class="bloque-t">${esc(m.titulo)}</h2>` +
          `<p class="bloque-sub">Pantalla provisional. La construye el paquete ${esc(m.paq)} en js/pantallas/${esc(m.archivo)}.</p></div>` +
          (h.length ? UI.bloque({titulo: 'Desde aquí se llega a', i: 1, html: UI.lista(h.map(x => ({titulo: x.titulo, sub: x.cod + ' · #/' + x.ejemplo, ir: x.ejemplo})))}) : '') +
          (m.cod === 'A1' ? UI.bloque({titulo: 'Del núcleo', i: 2, html: UI.lista([{titulo: 'Muestrario de componentes', sub: '#/muestrario', ir: 'muestrario', icono: 'paleta'}, {titulo: 'Portada', sub: 'E1 · #/portada', ir: 'portada', icono: 'casa'}])}) : '');
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
  const INICIO = 'inicio';
  const entrada = () => INICIO;   // ronda 7: los dos papeles aterrizan en Inicio
  VETA.entrada = entrada;
  // una pantalla de dirección no se abre con la cuenta de agente ni escribiendo la dirección: vas a Inicio
  const SOLO_DIRECCION = ['decidir', 'equipo', 'operaciones', 'oficina'];
  // FN · y al revés (privacidad): con la cuenta de dirección no se abre lo que es solo de quien lo lleva. Sale del `destino` del mapa:
  // la caja Visitas entera (la visita, cómo ha ido, el acta y el informe) y, de «Te toca a ti», la tarjeta y el mensaje de otra persona
  // (dirección también vende: lo suyo —toca/m-…, mensaje/m-…— sí lo abre).
  const SOLO_QUIEN_LO_LLEVA = ['visitas'];
  const deOtra = e => {
    if (SOLO_QUIEN_LO_LLEVA.includes(e.def.destino)) return true;
    if (e.def.cod !== 'A23' && e.def.cod !== 'A2') return false;   // toca/:id y mensaje/:id: de quién es la cosa
    const c = VETA.modelo.cosa(e.p.id);
    if (c) return !!(c.quien && c.quien !== VETA.yo().id);
    const d = VETA.duenoDe ? VETA.duenoDe({de: e.p.id}) : null;
    return d ? VETA.ajeno(d) : true;
  };
  const vedada = ruta => {
    const e = resuelve(ruta); if (!e || !e.def.destino) return false;
    return VETA.yo().papel === 'direccion' ? deOtra(e) : SOLO_DIRECCION.includes(e.def.destino);
  };
  VETA.vedada = vedada;
  // los cinco sitios de la barra (y del menú de ordenador): Inicio y las cuatro cajas del papel. Inicio lee de aquí nombres e iconos.
  const CAJAS = {agente: ['hoy', 'visitas', 'clientes', 'veta'], direccion: ['decidir', 'equipo', 'operaciones', 'oficina']};
  const SITIOS = {inicio: {texto: 'Inicio', icono: 'casa'}, hoy: {texto: 'Te toca', largo: 'Te toca a ti', icono: 'hoy'}, visitas: {texto: 'Visitas', icono: 'cal'},
    clientes: {texto: 'Clientes', icono: 'clientes'}, veta: {texto: 'Veta', icono: 'aprende'}, decidir: {texto: 'Decidir', icono: 'check'},
    equipo: {texto: 'Equipo', icono: 'equipo'}, operaciones: {texto: 'Operaciones', icono: 'caja'}, oficina: {texto: 'Veta', icono: 'aprende'}};
  const cajas = () => CAJAS[VETA.yo().papel] || CAJAS.agente;
  const sitios = () => [INICIO].concat(cajas());
  VETA.SITIOS = SITIOS; VETA.cajas = cajas;
  const AREA = {hoy: 'hoy', visitas: 'hoy', clientes: 'clientes', veta: 'aprende', equipo: 'direccion', decidir: 'direccion', operaciones: 'direccion', oficina: 'aprende'};
  const esRaiz = e => !!(e && e.def.destino && e.def.ruta === e.def.destino);
  const PRE = ['E1', 'E2', 'A18'];   // antes de entrar: portada, entrar y primer día (sin barra, con la cabecera de siempre)
  const esPre = e => !!e && PRE.indexOf(e.def.cod) >= 0;

  // ---- la pila = el camino (Inicio › caja › ficha…). El historial del navegador lleva las mismas entradas, una por nivel ----
  let pila = VETA.est.lee('pila', []);
  let actual = null;
  let cuenta = VETA.est.lee('serie', 0), serie = 0;   // cada entrada del historial lleva su número de serie: menor = está detrás
  const guardaPila = () => VETA.est.pon('pila', pila.map(x => ({ruta: x.ruta, titulo: x.titulo, scroll: x.scroll || 0})));
  let ignora = null;
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

  // ruta del padre (para entrar en frío y para el «‹»)
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

  // ---- cabeceras ----
  // Manel, 22-nov: la frase ya no va bajo el título. Va en una hoja pequeña que abre el «?» de arriba a la derecha
  // (siempre en el mismo sitio, solo si la pantalla tiene frase). Si la frase es la instrucción del paso
  // (`fraseCuerpo: true` o `p => …`), va arriba del cuerpo (.pant-frase) y no hay «?».
  // El número de la frase, si lo había, pasa al título, pequeño y en gris: campo `cuenta` (número o `p => número`).
  const val = (x, p) => (typeof x === 'function' ? x(p) : x);
  const fraseDe = e => { try { return val(e.def.frase, e.p) || ''; } catch (er) { return ''; } };
  const enCuerpo = e => { try { return !!val(e.def.fraseCuerpo, e.p); } catch (er) { return false; } };
  const numeroCab = e => {
    if (e.def.cuenta == null) return '';
    let n; try { n = val(e.def.cuenta, e.p); } catch (er) { return ''; }
    return n == null || n === '' ? '' : `<span class="cab-n">${esc(String(n))}</span>`;
  };
  const conNumero = (h1, e) => { const n = numeroCab(e); return n ? `<div class="cab-tit">${h1}${n}</div>` : h1; };
  const ayuda = e => {
    const f = enCuerpo(e) ? '' : fraseDe(e);
    return f ? `<button type="button" class="cab-ayuda" data-hoja="ayuda" data-frase="${esc(f)}" aria-label="Qué puedes hacer aquí"><span class="cab-ayuda-c" aria-hidden="true">?</span></button>` : '';
  };
  function cabecera(e, modo) {
    if (e.def.sinCabecera) return '';
    const t = esc(titulo(e));
    if (modo === 'lista') return `<header class="cab cab-lista">${conNumero(`<h1 class="cab-t">${t}</h1>`, e)}${ayuda(e)}</header>`;
    if (modo === 'panel') {
      const migas = pila.map((x, k) => ({x, k})).filter(o => o.k < pila.length - 1);
      // panel que se abre solo (primera fila de la lista): la pila no lo tiene, pero la miga dice de qué lista sale
      const top = pila[pila.length - 1], auto = top && top.ruta !== e.ruta;
      const raizMiga = auto ? `<span class="miga-b miga-quieta">${esc(top.titulo || '')}</span><span class="miga-s" aria-hidden="true">›</span>` : '';
      return `<header class="cab cab-panel"><nav class="miga" aria-label="Dónde estás">${raizMiga}${migas.map(o => `<button type="button" class="miga-b" data-atras-a="${o.k}">${esc(o.x.titulo || '')}</button><span class="miga-s" aria-hidden="true">›</span>`).join('')}<h1 class="cab-t">${t}</h1>${numeroCab(e)}</nav>${e.def.cabDerecha || ayuda(e) ? `<span class="cab-der">${e.def.cabDerecha ? e.def.cabDerecha(e.p) : ''}${ayuda(e)}</span>` : ''}</header>`;
    }
    // ronda 7 · cabecera única: «‹ de dónde vienes» (V1), título y, a la derecha, el «?» con la frase de la pantalla (campo `frase`)
    const i = pila.findIndex(x => x.ruta === e.ruta);
    const ant = i > 0 && pila[i - 1].titulo ? pila[i - 1].titulo : (() => { const r = resuelve(padreDe(e)); return r ? titulo(r) : 'Inicio'; })();
    const der = e.def.cabDerecha ? e.def.cabDerecha(e.p) : '', tt = e.def.cabTitulo ? e.def.cabTitulo(e.p) : t;
    if (esPre(e)) return `<header class="cab cab-detalle"><button type="button" class="cab-atras" data-atras aria-label="Volver a ${esc(ant)}">${VETA.ic('atras', 20)}</button><h1 class="cab-t">${tt}</h1><span class="cab-der">${der}</span></header>`;
    return `<header class="cab cab-r7"><div class="cab-fila"><button type="button" class="cab-atras" data-atras aria-label="Volver a ${esc(ant)}">${VETA.ic('atras', 20)}<span>${esc(ant)}</span></button><span class="cab-der">${der}${ayuda(e)}</span></div>` +
      conNumero(`<h1 class="cab-t">${tt}</h1>`, e) + '</header>';
  }
  // la instrucción del paso, arriba del cuerpo y con su letra (solo las pantallas con `fraseCuerpo`)
  const fraseCuerpo = e => { const f = enCuerpo(e) ? fraseDe(e) : ''; return f ? `<p class="pant-frase" data-i="0">${esc(f)}</p>` : ''; };
  VETA.fraseDe = e => fraseDe(e || actual || {def: {}});
  // la hoja del «?»: «Qué puedes hacer aquí» y la frase de la pantalla que lo abrió
  VETA.hojaDef('ayuda', {
    titulo: 'Qué puedes hacer aquí',
    pinta: d => `<p class="hoja-ayuda">${esc(d.frase || VETA.fraseDe() || 'Toca lo que quieras ver.')}</p>`
  });

  // el título de una cabecera de detalle nunca parte en dos líneas: si no cabe, la letra baja de 20 a 16 px como mucho
  function ajustaTitulo(col) {
    const t = col.querySelector('.cab-detalle .cab-t'); if (!t || !t.isConnected) return;
    t.style.fontSize = '';
    const un = parseFloat(getComputedStyle(t).lineHeight) || 22; let fs = parseFloat(getComputedStyle(t).fontSize) || 20;
    while (t.getBoundingClientRect().height > un * 1.5 && fs > 16) { fs -= 1; t.style.fontSize = fs + 'px'; }
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => VETA.$$('#marco .col').forEach(ajustaTitulo));

  // ---- montar una pantalla en una columna ----
  function monta(col, e, modo, o) {
    o = o || {};
    col.className = 'col col-' + modo + (o.activa ? ' activa' : '');
    col.dataset.area = e.def.area || AREA[e.def.destino] || (e.def.completa ? 'voz' : 'yo');
    col.dataset.ruta = e.ruta; col.dataset.pant = e.def.cod;
    col._entrada = e;
    let cuerpo;
    try { cuerpo = VETA.tieneParam('error') && e.def.cod !== 'E1' ? UI.error() : e.def.pinta(e.p); }
    catch (err) { setTimeout(() => { throw err; }); cuerpo = UI.error({texto: 'Esta pantalla ha fallado al pintarse.'}); }
    const fijo = e.def.botonFijo ? e.def.botonFijo(e.p) : '';
    col.innerHTML = cabecera(e, modo) + (navigator.onLine === false ? UI.sinRed() : '') +
      `<div class="desplaza" tabindex="-1"><section class="pant pant-${esc(e.def.cod)}${e.def.pendiente ? ' pant-pendiente' : ''}" data-pant="${esc(e.def.cod)}" aria-label="${esc(titulo(e))}"><div class="pant-cuerpo">${modo === 'lista' ? '' : fraseCuerpo(e)}${cuerpo}</div></section></div>` +
      (fijo ? `<div class="fijo">${fijo}</div>` : '');
    ajustaTitulo(col);
    const d = col.querySelector('.desplaza');
    if (o.scroll) d.scrollTop = o.scroll;
    VETA.mov.vigilaDesplazamiento(d, col);
    if (e.def.alMontar) { try { e.def.alMontar(col.querySelector('.pant'), e.p); } catch (err) { setTimeout(() => { throw err; }); } }
    return col;
  }

  // ---- pintar lo que toca según la pila ----
  // en ordenador la lista de la izquierda se vuelve a montar si el modelo cambió desde la última vez (p. ej. tras decidir en el panel)
  let listaVieja = false;
  const raizDe = e => pila.map(x => resuelve(x.ruta)).find(esRaiz) || (e.def.destino ? resuelve(e.def.destino) : null);
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
      } else if (e.def.completa || e.def.ancha || !raizDe(e)) {
        app.dataset.vista = e.def.completa ? 'completa' : 'ancha';
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
          const pf = a.querySelector('.pant [data-panel]'), f = a.querySelector('.pant .fila[data-ir]');
          panel = pf && resuelve(pf.dataset.panel) ? resuelve(pf.dataset.panel) : f ? resuelve(f.dataset.ir) : null;
        }
        if (panel) donde = monta(b, panel, 'panel', {activa: true, scroll: soloRepinta || dir === 'atras' ? scrollDe(panel.ruta) : 0});
        else { b.className = 'col col-panel activa'; b.innerHTML = UI.vacio({titulo: 'Elige algo de la lista', icono: 'hoy'}); delete b.dataset.ruta; donde = b; }
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
  // al cambiar de ruta no se queda nada de la pantalla anterior: ni hoja abierta ni aviso negro
  const sueltaTodo = () => { if (VETA.cierraHoja) VETA.cierraHoja({foco: false}); if (VETA.quitaAviso) VETA.quitaAviso(); };
  const empuja = (ruta, dir, foco) => { pila.push({ruta}); pon(ruta, pila.length - 1, false); pinta(dir, foco); };
  // volver al nivel k del camino: el historial retrocede los mismos pasos (así flecha, gesto y «atrás» son lo mismo, V2)
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
    ruta = String(ruta).replace(/^#?\/?/, '');
    let e = resuelve(ruta);
    if (!e) { VETA.aviso('Esa pantalla no existe todavía.'); return; }
    sueltaTodo();
    // sin permiso, o al acabar de entrar (portada, entrar, primer día): se aterriza en Inicio
    if (vedada(ruta) || (actual && esPre(actual) && esRaiz(e))) { ruta = INICIO; e = resuelve(ruta); }
    guardaScroll();
    const k = pila.findIndex(x => x.ruta === ruta), L = pila.length;
    if (L && k === L - 1) { if (!actual) pinta(null); return; }
    if (k >= 0) { vuelveA(k); return; }   // V3: ya está en el camino → se vuelve a ella, no se apila otra vez
    if (o.reemplaza && L) { pila[L - 1] = {ruta}; pon(ruta, L - 1, true); pinta(o.dir || 'adelante', o.foco); return; }
    // FN · el «Hecho» de un asistente: {sobre: k} quita del camino los pasos y apila la pantalla sobre el nivel k (la pantalla desde
    // la que se empezó). Así atrás —flecha, gesto o navegador— va de «Hecho» a esa pantalla, sin pasar otra vez por los pasos.
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
    if (!actual || actual.ruta === INICIO || esPre(actual)) return;   // Inicio no tiene «volver»
    pila = []; camino(padreDe(actual)).forEach((x, i) => { pila.push(x); pon(x.ruta, i, i === 0); }); pinta('atras');
  };
  // volver a un punto del camino (migas del panel en ordenador)
  VETA.atrasA = n => { n = Number(n); if (!(n >= 0 && n < pila.length - 1)) return; sueltaTodo(); guardaScroll(); vuelveA(n); };
  // repinta la pantalla actual (después de cambiar el modelo); {hecho: id} hace el «hecho en el sitio» (efecto 7)
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

  // «atrás» del navegador (botón o gesto). Con una hoja abierta: cierra la hoja y la pantalla se queda donde está (V7)
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
    if (!st || !st.veta || !e0 || vedada(ruta)) {   // dirección escrita a mano o enlace: camino nuevo por el mapa (V5)
      const r = e0 && !vedada(ruta) ? ruta : (VETA.est.lee('dentro', false) ? INICIO : 'portada');
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

  // ---- barra de abajo (móvil) y menú de la izquierda (ordenador): Inicio y las cuatro cajas del papel ----
  function destinoMarcado() {
    if (!actual) return null;
    if (actual.ruta === INICIO) return INICIO;
    if (/^dicta/.test(actual.def.archivo || '')) return 'ensenale';
    const c = pila.map(x => resuelve(x.ruta)).find(esRaiz);   // la caja por la que se entró
    return c ? c.def.destino : actual.def.destino;
  }
  // el número de «Te toca» y de «Decidir»: de VETA.r7.cuentas() (R9) si ya existe; si no, el contador de siempre
  function numero(d) {
    if (d !== 'hoy' && d !== 'decidir') return 0;
    let c = null; try { c = VETA.r7 && VETA.r7.cuentas && VETA.r7.cuentas(); } catch (e) {}
    if (c && typeof c[d] === 'number') return c[d];
    return d === 'hoy' ? VETA.modelo.contador(VETA.yo().id) : 0;
  }
  function contadorHtml(n) { return n > 0 ? `<span class="contador" aria-label="${n} por hacer"><span class="contador-n">${n}</span></span>` : ''; }
  const firmaDe = marcado => sitios().join() + '|' + marcado + '|' + numero('hoy') + '|' + numero('decidir') + '|' + VETA.yo().id;
  function pintaBarra() {
    const el = document.getElementById('barra'); if (!el) return;
    const marcado = destinoMarcado(), firma = firmaDe(marcado);
    if (el.dataset.firma === firma) return;
    // FN · en mitad de una transición no se tocan las pestañas (llevan nombre de transición y Chromium se cae): se repinta al acabar
    if (VETA.mov.ocupada()) { VETA.mov.alAcabar('barra', pintaBarra); return; }
    el.dataset.firma = firma;
    el.innerHTML = `<div class="tabs">${sitios().map(d => `<button type="button" class="tab${d === marcado ? ' on' : ''}" data-tab="${d}"${d === marcado ? ' aria-current="page"' : ''} style="view-transition-name:tab-${d}">` +
      `<span class="tab-ic">${VETA.ic(SITIOS[d].icono, 24)}${contadorHtml(numero(d))}</span><span class="tab-p">${SITIOS[d].texto}</span></button>`).join('')}</div>`;
  }
  function pintaLateral() {
    const el = document.getElementById('lateral'); if (!el) return;
    const marcado = destinoMarcado(), yo = VETA.yo(), firma = firmaDe(marcado);
    if (el.dataset.firma === firma) return;
    el.dataset.firma = firma;
    el.innerHTML = `<div class="lat-marca"><img src="assets/veta-symbol-gold.png" alt="" width="30" height="24"><b>VETA</b></div>` +
      `<div class="lat-dest">${sitios().map(d => `<button type="button" class="lat-d${d === marcado ? ' on' : ''}" data-tab="${d}"${d === marcado ? ' aria-current="page"' : ''}>${VETA.ic(SITIOS[d].icono, 22)}<span>${SITIOS[d].largo || SITIOS[d].texto}</span>${numero(d) ? `<span class="lat-n">${numero(d)}</span>` : ''}</button>`).join('')}</div>` +
      `<button type="button" class="lat-mic${marcado === 'ensenale' ? ' on' : ''}" data-ir="dictar/libre"><span class="mic-c">${VETA.ic('mic', 22)}</span><span>Enséñale a Veta</span></button>` +
      `<button type="button" class="lat-yo" data-ir="cuenta">${VETA.av(yo.id, 40)}<span class="lat-yo-c"><span class="lat-yo-n">${esc(yo.nombre)}</span><span class="lat-yo-p">${esc(yo.papelTexto)}</span></span></button>`;
  }
  VETA.pintaBarra = () => { ['barra', 'lateral'].forEach(id => { const el = document.getElementById(id); if (el) delete el.dataset.firma; }); pintaBarra(); pintaLateral(); };
  VETA.modelo.al(() => { pintaBarra(); pintaLateral(); });

  // ---- entrar con una cuenta (E2): la barra gana o pierde «Equipo», se abre el primer destino. No hay cambio de perfil dentro de la app ----
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
    VETA.aviso('Esto aún no está hecho en la demo.');
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
      if (actual && actual.ruta === d) { const s = VETA.$('.col.activa .desplaza') || VETA.$('#col-a .desplaza'); if (s) s.scrollTo({top: 0, behavior: VETA.reducido() ? 'auto' : 'smooth'}); return; }
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
    if (vedada(ruta)) ruta = INICIO;
    // recarga: el camino guardado sigue valiendo si acaba aquí y el historial lo acompaña; si no (entrada en frío), se reconstruye por el mapa (V5)
    const top = pila.length ? pila[pila.length - 1] : null, st = history.state;
    const sano = top && top.ruta === ruta && !nuevo && st && st.veta && st.n === pila.length - 1 && (pila[0].ruta === INICIO || esPre(resuelve(pila[0].ruta)));
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
