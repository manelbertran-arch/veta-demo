/* Veta demo · ronda 8 · js/pantallas/inicio.js · núcleo
   R0 · Inicio · #/inicio — la cáscara (PLAN_R8.md, 3.2): fecha, saludo, la frase (la única explicación) y tu cara, que abre Cuenta.
   Lo de dentro lo pone cada papel con su gancho, desde su propio fichero:
     VETA.inicioDe.agente    = yo => ({html, frase, pie, nota, acciones, alMontar})      // carril A (hoy.js)
     VETA.inicioDe.direccion = yo => ({html, frase, pie, nota, acciones, alMontar})      // carril D (decidir.js)
   - html      lo que va bajo el saludo: “lo primero” (VETA.r7.primero), la lista del resto y lo demás. Obligatorio (vale devolver solo el texto).
   - frase     la frase de arriba. Si falta, la del núcleo: “Hoy te tocan 6 cosas.” / “6 cosas esperan tu decisión.”
   - pie       el botón del pie (VETA.r7.botones(…)); solo si hace falta (“Cerrar el día” con 0 cosas). nota: la nota sobre él.
   - acciones  {nombre(ev, el, p) {}} de lo que se toca dentro · alMontar(el, p)
   Los dos papeles tienen ya su gancho; si uno fallara, Inicio se queda con la cabecera y la frase. */
(function () {
  'use strict';
  const esc = VETA.esc, R = VETA.r7;
  VETA.inicioDe = VETA.inicioDe || {};

  const papel = () => (VETA.yo().papel === 'direccion' ? 'direccion' : 'agente');
  const mayus = t => String(t || '').replace(/^./, c => c.toUpperCase());
  // la frase con su número, entera (en inglés el orden cambia)
  const FRASE = {
    agente: n => (n > 1 ? `You have ${n} things today.` : n === 1 ? 'You have 1 thing today.' : 'Nothing is left for you today.'),
    direccion: n => (n > 1 ? `${n} things are waiting for your decision.` : n === 1 ? '1 thing is waiting for your decision.' : 'Nothing to decide today.')
  };
  // lo que dice el gancho del papel, ya normalizado
  function dentro() {
    const g = VETA.inicioDe[papel()];
    let r = null;
    if (typeof g === 'function') { try { r = g(VETA.yo()); } catch (e) { setTimeout(() => { throw e; }); } }
    if (typeof r === 'string') r = {html: r};
    return r && r.html != null ? r : {html: ''};
  }
  // las acciones son las del gancho en cada toque (el gancho puede cambiar de respuesta según el estado)
  const acciones = new Proxy({}, {get: (t, k) => { const a = dentro().acciones; return a ? a[k] : undefined; }, has: (t, k) => { const a = dentro().acciones; return !!(a && k in a); }});

  const cod = (Object.values(VETA.pantallas || {}).find(p => p.ruta === 'inicio') || {}).id || 'R0';
  VETA.pantalla(cod, {
    ruta: 'inicio', titulo: 'Home', sinCabecera: true, ancha: true,
    pinta: () => {
      const yo = VETA.yo(), p = papel(), d = dentro(), c = R.cuentas();
      const frase = d.frase || FRASE[p](p === 'direccion' ? c.decidir : c.hoy);
      const hola = `<header class="r7-hola" data-i="0"><div class="r7-hola-c"><p class="r7-hola-d">${esc(VETA.fecha.larga((VETA.datos.fecha || {}).hoyISO) || mayus((VETA.datos.fecha || {}).hoyTexto))}</p>` +
        `<h1 class="r7-hola-t">Hello, ${esc(yo.corto || yo.nombre)}.</h1><p class="r7-hola-f">${esc(frase)}</p></div>` +
        `<button type="button" class="r7-yo" data-ir="cuenta" aria-label="Your account, ${esc(yo.nombre)}">${VETA.av(yo.id, 40)}</button></header>`;
      return `<div class="r7-inicio" data-papel="${p}">${hola}${d.html || ''}</div>`;
    },
    botonFijo: () => dentro().pie || '',
    nota: () => dentro().nota || '',
    casoDictado: () => { const f = dentro().casoDictado; return typeof f === 'function' ? f() : null; },
    alMontar: (el, p) => { const f = dentro().alMontar; if (typeof f === 'function') f(el, p); },
    acciones
  });
})();
