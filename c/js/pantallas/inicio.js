/* Veta demo · ronda 8 · js/pantallas/inicio.js · núcleo
   R0 · Inicio · #/inicio — la cáscara (PLAN_R8.md, 3.2): fecha, saludo, la frase (la única explicación) y tu cara, que abre Cuenta.
   Lo de dentro lo pone cada papel con su gancho, desde su propio fichero:
     VETA.inicioDe.agente    = yo => ({html, frase, pie, nota, acciones, alMontar})      // carril A (hoy.js)
     VETA.inicioDe.direccion = yo => ({html, frase, pie, nota, acciones, alMontar})      // carril D (decidir.js)
   - html      lo que va bajo el saludo: «lo primero» (VETA.r7.primero), la lista del resto y lo demás. Obligatorio (vale devolver solo el texto).
   - frase     la frase de arriba. Si falta, la del núcleo: «Hoy te tocan 6 cosas.» / «6 cosas esperan tu decisión.»
   - pie       el botón del pie (VETA.r7.botones(…)); solo si hace falta («Cerrar el día» con 0 cosas). nota: la nota sobre él.
   - acciones  {nombre(ev, el, p) {}} de lo que se toca dentro · alMontar(el, p)
   Mientras un papel no tenga su gancho, Inicio pinta la lista de siempre: la de «Te toca a ti» (A1) o la de «Decidir» (G20). */
(function () {
  'use strict';
  const esc = VETA.esc, R = VETA.r7;
  VETA.inicioDe = VETA.inicioDe || {};

  const papel = () => (VETA.yo().papel === 'direccion' ? 'direccion' : 'agente');
  const mayus = t => String(t || '').replace(/^./, c => c.toUpperCase());
  // la frase con su número, entera (en inglés el orden cambia)
  const FRASE = {
    agente: n => (n > 1 ? `Hoy te tocan ${n} cosas.` : n === 1 ? 'Hoy te toca 1 cosa.' : 'Hoy ya no te toca nada.'),
    direccion: n => (n > 1 ? `${n} cosas esperan tu decisión.` : n === 1 ? '1 cosa espera tu decisión.' : 'Hoy no hay nada que decidir.')
  };
  // la lista de siempre, mientras el carril no entregue su gancho: lo que pintaba la pantalla que Inicio absorbe
  const VIEJA = {agente: 'A1', direccion: 'G20'};
  const vieja = () => VETA.pantallas[VIEJA[papel()]] || {};
  const deSiempre = () => {
    const v = vieja(), dir = papel() === 'direccion';
    let h = ''; try { h = v.pinta && !v.pendiente ? v.pinta({}) : ''; } catch (e) { setTimeout(() => { throw e; }); }
    // dirección también lleva lo suyo: su día y sus clientes ya no están en la barra
    return {html: h + (dir ? R.lista([{nombre: 'Te toca a ti', dato: R.cuentas().hoy || null, ir: 'hoy'}, {nombre: 'Tus clientes', dato: R.cuentas().clientes || null, ir: 'clientes'}], {rotulo: 'Lo tuyo'}) : ''),
      pie: v.botonFijo ? v.botonFijo({}) : '', acciones: v.acciones, alMontar: v.alMontar};
  };
  // lo que dice el gancho del papel (o la lista de siempre), ya normalizado
  function dentro() {
    const g = VETA.inicioDe[papel()];
    let r = null;
    if (typeof g === 'function') { try { r = g(VETA.yo()); } catch (e) { setTimeout(() => { throw e; }); } }
    if (typeof r === 'string') r = {html: r};
    return r && r.html != null ? r : deSiempre();
  }
  // las acciones son las del gancho en cada toque (el gancho puede cambiar de respuesta según el estado)
  const acciones = new Proxy({}, {get: (t, k) => { const a = dentro().acciones; return a ? a[k] : undefined; }, has: (t, k) => { const a = dentro().acciones; return !!(a && k in a); }});

  const cod = (Object.values(VETA.pantallas || {}).find(p => p.ruta === 'inicio') || {}).id || 'R0';
  VETA.pantalla(cod, {
    ruta: 'inicio', titulo: 'Inicio', sinCabecera: true, ancha: true,
    pinta: () => {
      const yo = VETA.yo(), p = papel(), d = dentro(), c = R.cuentas();
      const frase = d.frase || FRASE[p](p === 'direccion' ? c.decidir : c.hoy);
      const hola = `<header class="r7-hola" data-i="0"><div class="r7-hola-c"><p class="r7-hola-d">${esc(mayus((VETA.datos.fecha || {}).hoyTexto))}</p>` +
        `<h1 class="r7-hola-t">Hola, ${esc(yo.corto || yo.nombre)}.</h1><p class="r7-hola-f">${esc(frase)}</p></div>` +
        `<button type="button" class="r7-yo" data-ir="cuenta" aria-label="Tu cuenta, ${esc(yo.nombre)}">${VETA.av(yo.id, 40)}</button></header>`;
      return `<div class="r7-inicio" data-papel="${p}">${hola}${d.html || ''}</div>`;
    },
    botonFijo: () => dentro().pie || '',
    nota: () => dentro().nota || '',
    casoDictado: () => { const f = dentro().casoDictado; return typeof f === 'function' ? f() : null; },
    alMontar: (el, p) => { const f = dentro().alMontar; if (typeof f === 'function') f(el, p); },
    acciones
  });
})();
