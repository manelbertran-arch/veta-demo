/* Veta demo · núcleo · modelo.js
   Un solo estado compartido (decisión 11): lo que se hace en una pantalla se ve en las demás, también entre papeles.
   Los datos fijos están en VETA.datos (js/datos/); lo que cambia durante la demo, en VETA.est:
   - 'cosas': {id: {estado, hora, extra, orden, prev: [...]}} para cosas de la cola, de En espera, reglas (r-*) y decisiones (d-*)
   - 'flags': marcas sueltas de la tabla 6.8 ('carmen-asignada', 'marc-llama-joan', 'temas', 'tiempos', 'coste', 'chats-fuera'…)
   Lo que se ve en otra pantalla se calcula al leer (alResolver de cada cosa), así «Deshacer» lo devuelve todo atrás solo. */
(function () {
  'use strict';
  const D = () => VETA.datos;
  const RESUELTOS = ['enviada', 'hecha', 'quitada', 'para-manana'];
  const CUENTAN = ['enviada', 'hecha'];                     // los que aplican sus efectos en otras pantallas
  const HECHAS = ['enviada', 'hecha', 'quitada'];
  const PENDIENTES = ['por-hacer', 'pregunta-envio'];
  const oyentes = [];
  const lee = () => VETA.est.lee('cosas', {});
  const flags = () => VETA.est.lee('flags', {});
  const avisa = q => oyentes.forEach(f => { try { f(q); } catch (e) { setTimeout(() => { throw e; }); } });

  // ---- de dónde sale cada cosa ----
  function todasBase() {
    const d = D(), out = [];
    Object.keys(d.cola || {}).forEach(k => out.push(...d.cola[k]));
    Object.keys(d.espera || {}).forEach(k => out.push(...d.espera[k]));
    Object.keys(d.colaExtra || {}).forEach(k => out.push(d.colaExtra[k]));
    (d.reglas || []).forEach(r => out.push(r));
    if (d.reglaNueva) out.push(d.reglaNueva);
    return out;
  }
  function base(id) { return todasBase().find(c => c.id === id) || null; }
  function mezcla(c) {
    if (!c) return null;
    const e = lee()[c.id];
    return Object.assign({}, c, {estado: e ? e.estado : (c.estadoInicial || 'por-hacer'), hora: e ? e.hora : null, extra: (e && e.extra) || {}, orden: e ? e.orden : 0});
  }
  // efectos de lo resuelto (enviado o hecho), para las otras pantallas
  function efectos() {
    const out = {estado: {}, siguiente: {}, historia: [], espera: [], reglas: {}, flags: {}};
    todasBase().forEach(b => {
      if (!b.alResolver) return;
      const c = mezcla(b); if (!CUENTAN.includes(c.estado)) return;
      const a = b.alResolver;
      Object.assign(out.estado, a.estado || {}); Object.assign(out.siguiente, a.siguiente || {});
      (a.historia || []).forEach(h => out.historia.push(Object.assign({de: b.id, orden: c.orden}, h)));
      (a.espera || []).forEach(x => out.espera.push(Object.assign({quien: b.quien, tipo: 'espera', de: b.id}, x)));
      if (a.regla) (out.reglas[a.regla.id] = out.reglas[a.regla.id] || []).push(a.regla.caso);
      if (a.flag) out.flags[a.flag] = true;
    });
    return out;
  }
  const flag = (k, porDefecto) => { const f = flags(), ef = efectos().flags; return k in f ? f[k] : (k in ef ? ef[k] : porDefecto); };
  const fuera = () => flag('chats-fuera', []);

  const M = VETA.modelo = {};
  M.RESUELTOS = RESUELTOS;

  // ---- la cola ----
  M.cosa = id => mezcla(base(id));
  M.cola = quien => {
    const d = D(); let lista = (d.cola[quien] || []).slice();
    if (quien === 'laura' && flag('carmen-asignada', false) && d.colaExtra['c-carmen']) lista.push(d.colaExtra['c-carmen']);
    const f = fuera();
    return lista.filter(c => !f.includes(c.cliente)).map(mezcla);
  };
  M.pendientes = quien => M.cola(quien).filter(c => PENDIENTES.includes(c.estado));
  M.contador = quien => M.pendientes(quien).length;
  M.hechas = quien => M.cola(quien).concat(M.espera(quien)).filter(c => HECHAS.includes(c.estado)).sort((a, b) => a.orden - b.orden);
  M.manana = quien => M.cola(quien).filter(c => c.estado === 'para-manana');
  M.ultima = quien => { const id = VETA.est.lee('ultima.' + quien, null); const c = id && M.cosa(id); return c && RESUELTOS.includes(c.estado) ? c : null; };

  // cambia el estado de una cosa (o regla, o decisión); guarda el anterior para deshacer
  M.marca = (id, estado, extra) => {
    const todo = lee(), b = base(id);
    const ant = todo[id] || {estado: (b && b.estadoInicial) || 'por-hacer', extra: {}, prev: []};
    const seq = VETA.est.lee('seq', 0) + 1; VETA.est.pon('seq', seq);
    todo[id] = {estado, hora: VETA.ahora(), extra: Object.assign({}, ant.extra || {}, extra || {}), orden: seq,
      prev: (ant.prev || []).concat([{estado: ant.estado, hora: ant.hora, extra: ant.extra || {}, orden: ant.orden}])};
    VETA.est.pon('cosas', todo);
    if (RESUELTOS.includes(estado) && b) VETA.est.pon('ultima.' + b.quien, id);
    avisa({que: 'cosa', id, estado});
    return M.cosa(id);
  };
  // vuelve al estado anterior; se salta «¿Lo enviaste?» (No lo envié devuelve la tarjeta a por hacer)
  M.deshaz = id => {
    const todo = lee(), e = todo[id]; if (!e) return M.cosa(id);
    let prev = (e.prev || []).slice(), p = prev.pop();
    while (p && p.estado === 'pregunta-envio' && prev.length) p = prev.pop();
    if (!p || !prev.length && p.estado === ((base(id) || {}).estadoInicial || 'por-hacer') && !Object.keys(p.extra || {}).length) delete todo[id];
    else todo[id] = {estado: p.estado === 'pregunta-envio' ? 'por-hacer' : p.estado, hora: p.hora, extra: p.extra || {}, orden: p.orden || 0, prev};
    VETA.est.pon('cosas', todo);
    avisa({que: 'deshaz', id});
    return M.cosa(id);
  };

  // ---- clientes ----
  M.cliente = id => {
    const b = (D().clientes || {})[id]; if (!b) return null;
    const c = JSON.parse(JSON.stringify(b)), ef = efectos();
    if (ef.estado[id]) c.estado = ef.estado[id];
    if (ef.siguiente[id]) c.siguiente = Object.assign({}, ef.siguiente[id]);
    const nuevas = ef.historia.filter(h => h.cliente === id).sort((a, b2) => b2.orden - a.orden);
    c.historia = nuevas.concat(c.historia || []);
    if (id === 'carmen' && flag('carmen-asignada', false)) { c.lleva = 'laura'; c.cartera = true; c.asignada = 'Te la ha asignado Montse'; }
    if (id === 'joan-serra' && flag('marc-llama-joan', false)) c.aviso = 'Marc le llama hoy';
    c.fuera = fuera().includes(id);
    // la cosa de la cola de este cliente, si la tiene (para pintar su tarjeta en la ficha)
    const cs = todasBase().filter(x => x.cliente === id && x.tipo !== 'espera' && x.quien !== 'equipo').map(mezcla);
    c.cosa = cs.find(x => PENDIENTES.includes(x.estado)) || cs[0] || null;
    return c;
  };
  // filtro: nada (todos) · 'a-la-vista' · 'al-dia' (al día y cerrados) · un estado · una función
  M.clientes = (quien, filtro) => {
    const todos = Object.keys(D().clientes || {}).map(M.cliente);
    let l = todos.filter(c => !c.fuera && (quien === 'oficina' ? true : c.lleva === quien && c.cartera !== false));
    if (filtro === 'a-la-vista') l = l.filter(c => !['al-dia', 'cerrado'].includes(c.estado));
    else if (filtro === 'al-dia') l = l.filter(c => ['al-dia', 'cerrado'].includes(c.estado));
    else if (typeof filtro === 'function') l = l.filter(filtro);
    else if (filtro) l = l.filter(c => c.estado === filtro);
    return l;
  };

  // ---- En espera (por fecha) ----
  M.espera = quien => {
    const f = fuera();
    const l = (D().espera[quien] || []).concat(efectos().espera.filter(x => x.quien === quien)).filter(x => !f.includes(x.cliente));
    return l.map(mezcla).sort((a, b) => (a.fechaISO < b.fechaISO ? -1 : a.fechaISO > b.fechaISO ? 1 : 0));
  };

  // ---- reglas ----
  M.reglas = () => {
    const l = (D().reglas || []).map(mezcla), ef = efectos();
    const n = mezcla(D().reglaNueva); if (n && n.estado !== 'nueva') l.push(n);
    l.forEach(r => { r.casosHoy = ef.reglas[r.id] || []; });
    return l;
  };
  M.regla = id => M.reglas().find(r => r.id === id) || (id === (D().reglaNueva || {}).id ? mezcla(D().reglaNueva) : null);
  M.resumenReglas = () => {
    const l = M.reglas();
    return {activas: l.filter(r => r.estado === 'activa').length, aPrueba: l.filter(r => r.estado === 'a-prueba').length, propuestas: l.filter(r => r.estado === 'propuesta').length};
  };

  // ---- dirección ----
  M.decisiones = () => M.cola('equipo');
  M.operaciones = () => (D().operaciones || []).map(o => {
    const x = Object.assign({}, o);
    if (o.cliente === 'joan-serra' && flag('marc-llama-joan', false)) x.estadoTexto += ' · Marc le llama hoy';
    return x;
  });
  M.numeros = ventana => {
    const n = D().numeros, v = n[ventana] || n['7d'];
    return n.nombres.map((nombre, k) => ({nombre, valor: v[k]}));
  };

  // ---- tiempos y coste (solo con «Ejemplo») ----
  // tiempos de Laura: {mensajes: 4, actas: 12, avisos: 2} minutos por tarea → minutos totales
  M.minutosLaura = t => (D().tiempos.laura || []).reduce((s, x) => s + x.n * (Number((t || {})[x.id]) || 0), 0);
  M.eurosEquipo = costeHora => Math.round(D().tiempos.equipo.minutos / 60 * (Number(costeHora) || 0));

  // ---- marcas sueltas de la tabla 6.8 ----
  M.lee = (k, porDefecto) => flag(k, porDefecto);
  M.pon = (k, v) => {
    const f = flags(); const pila = f['_prev_' + k] || [];
    pila.push(k in f ? f[k] : null); f['_prev_' + k] = pila; f[k] = v;
    VETA.est.pon('flags', f); avisa({que: 'flag', k});
  };
  M.deshazFlag = k => {
    const f = flags(); const pila = f['_prev_' + k] || []; const v = pila.pop();
    if (v === null || v === undefined) delete f[k]; else f[k] = v;
    f['_prev_' + k] = pila; VETA.est.pon('flags', f); avisa({que: 'flag', k});
  };
  // lo que lee Veta es de cada persona: Montse tiene sus chats y sus personales (datos.lecturaPor), nunca los de Laura
  M.lectura = () => { const id = VETA.yo && VETA.yo().id; return (D().lecturaPor && D().lecturaPor[id]) || D().lectura; };
  const fueraMios = () => fuera().filter(id => { const c = (D().clientes || {})[id]; return !c || !c.lleva || c.lleva === VETA.yo().id; });
  M.chatsFuera = () => (M.lectura().fuera || []).length + fueraMios().length;
  M.chatsLeidos = () => M.lectura().chats - fueraMios().length;

  // ---- quién es quién (personas y clientes), pisos ----
  M.persona = id => (D().personas || {})[id] || null;
  M.quien = id => M.persona(id) || (D().clientes || {})[id] || null;
  M.piso = id => (D().pisos || {})[id] || null;
  M.chat = id => (D().chats || {})[id] || null;

  // ---- atajo ?momento=fin: la cola de Laura hecha ----
  M.momentoFin = () => {
    M.cola('laura').forEach(c => { if (PENDIENTES.includes(c.estado)) M.marca(c.id, c.sale ? 'enviada' : c.tipo === 'bloqueada' ? 'quitada' : 'hecha'); });
  };

  M.al = fn => { oyentes.push(fn); };
})();
