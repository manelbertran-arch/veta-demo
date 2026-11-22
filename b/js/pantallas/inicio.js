/* Veta demo · ronda 7 · js/pantallas/inicio.js · N2
   R0 · Inicio · #/inicio — el saludo, cuatro cajas con su número y la tira «Enséñale a Veta». Nada más (ESTRATEGIA_R7.md, sección 4).
   R1: cabe entero en 390×664 con la barra de abajo. Cada caja lleva a su ruta; la cara de arriba, a Cuenta.
   Los números salen de VETA.r7.cuentas() (R9). Piezas en js/nucleo/r7.js, estilos en css/r7.css. */
(function () {
  'use strict';
  const esc = VETA.esc, R = VETA.r7;

  const mirar = n => n === 0 ? 'Hoy no hay que mirar ninguna.' : n === 1 ? '1 hay que mirarla hoy.' : n + ' hay que mirarlas hoy.';
  // la frase de cada caja, por destino. El nombre y el icono son los de la barra (VETA.SITIOS); el número, VETA.r7.cuentas()[destino].
  const FRASE = {
    hoy: () => 'Te lo dejo escrito. Tú lo envías.', visitas: () => 'Al salir, te dejo el acta hecha.', clientes: () => 'Qué pasa con cada uno.', veta: () => 'Lo que ya hago yo sola.',
    decidir: () => 'Te digo qué haría yo. Tú decides.', equipo: () => 'Qué lleva cada persona.', operaciones: c => mirar(c.mirar), oficina: () => 'Lo que os dejé listo la semana pasada.'
  };
  const ORO = ['veta', 'oficina'];   // oro = Veta (R5)
  // Equipo: cada inicial con el tono de esa persona, el mismo que en Equipo (css/r7-d1.css, .d1-t-<id>)
  const tonos = (html, ids) => { let k = 0; return html.replace(/class="av /g, m => { const id = ids[k++]; return id ? `class="av d1-t-${id} ` : m; }); };
  const caja = (d, c, k) => {
    const s = VETA.SITIOS[d], ids = R.quienes(d);
    // «+3» solo donde las caras son las que cuenta el número (Te toca a ti); en las demás el número ya lo dice
    const h = R.caja({nombre: s.largo || s.texto, numero: c[d], frase: FRASE[d](c), ir: d, icono: s.icono, oro: ORO.includes(d),
      caras: ids, max: 3, total: d === 'hoy' ? c[d] : Math.min(ids.length, 3), i: 1 + (k >> 1)});
    return d === 'equipo' ? tonos(h, ids) : h;
  };
  const SALUDO = {
    agente: 'Leo tus chats de trabajo y te dejo listo lo que toca.',
    direccion: 'Leo los chats de la oficina y te digo qué pasa y qué hay que decidir.'
  };

  const cod = (Object.values(VETA.pantallas || {}).find(p => p.ruta === 'inicio') || {}).id || 'R0';
  VETA.pantalla(cod, {
    ruta: 'inicio', titulo: 'Inicio', sinCabecera: true, ancha: true,
    guia: ['Aquí ves las cuatro cosas que puedes hacer, cada una con su número.', 'Tú tocas una caja y dentro hay una sola cosa.', 'Así no tienes que recordar dónde está nada.'],
    pinta: () => {
      const yo = VETA.yo(), papel = yo.papel === 'direccion' ? 'direccion' : 'agente', c = R.cuentas();
      const hola = `<header class="r7-hola" data-i="0"><div class="r7-hola-c"><h1 class="r7-hola-t">Hola, ${esc(yo.corto || yo.nombre)}.</h1>` +
        `<p class="r7-hola-f">${esc(SALUDO[papel])}</p></div>` +
        `<button type="button" class="r7-yo" data-ir="cuenta" aria-label="Tu cuenta, ${esc(yo.nombre)}">${VETA.av(yo.id, 40)}</button></header>`;
      const cajas = `<div class="r7-cajas">${VETA.cajas().map((d, k) => caja(d, c, k)).join('')}</div>`;
      return `<div class="r7-inicio" data-papel="${papel}">${hola}${cajas}${R.tira({i: 3})}</div>`;
    }
  });
})();
