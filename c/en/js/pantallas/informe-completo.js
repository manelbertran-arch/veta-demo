/* Veta demo · ronda 8 · pantallas · informe-completo.js · carril D
   G8 · Informe completo · #/informe-completo — documento (PLAN_R8.md, 8.1): la semana entera, para leer o imprimir.
   En pantalla: un papel por bloque, con su rótulo fuera y filas de dato dentro; lo que está parado, una operación por fila con su enlace.
   “Imprimir” va arriba a la derecha y no hay pie. Sin tabla por persona ni euros.
   En papel (css/imprimir.css) sale como siempre, con tablas de verdad: es el bloque .d-papel, que en pantalla no se ve. */
(function () {
  'use strict';
  const esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos, r7 = VETA.r7;

  // ---- en pantalla ----
  const grupo = (rotulo, html, i) => VETA.r7.grupo(rotulo, html, {i});
  const papel = (rotulo, filas, i) => grupo(rotulo, r7.doc({secciones: [{filas}]}), i);
  const filasDe = pares => pares.map(([nombre, valor]) => ({nombre, valor}));
  const captacion = I => I.captacion.map(([t, n]) => [t === 'No reply yet' ? 'No reply yet' : t, n]);

  // ---- en papel: las tablas de siempre ----
  const pares = lista => `<dl class="d-pares">${lista.map(([t, n]) => `<div><dt>${esc(t)}</dt><dd>${esc(n)}</dd></div>`).join('')}</dl>`;
  const sec = (titulo, html) => `<section class="d-inf-s"><p class="d-inf-h">${esc(titulo)}</p>${html}</section>`;
  function enPapel(n, I, par, decidir) {
    const ocho = `<table class="d-tabla d-tabla-8"><thead><tr><th scope="col">Number</th><th scope="col">Last 7 days</th><th scope="col">Since ${esc(VETA.fecha.corta('2026-10-03', {frase: true}))}</th></tr></thead><tbody>` +
      n.nombres.map((t, k) => `<tr><th scope="row">${esc(t)}</th><td>${VETA.num(n['7d'][k])}</td><td>${VETA.num(n.desde[k])}</td></tr>`).join('') + '</tbody></table>';
    const ofi = `<table class="d-tabla"><thead><tr><th scope="col">Office</th><th scope="col">Prepared</th><th scope="col">Completed</th><th scope="col">Stalled</th></tr></thead><tbody>` +
      `<tr><th scope="row">Gràcia</th><td>92 <span>before 84</span></td><td>78 <span>before 70</span></td><td>3</td></tr>` +
      `<tr><th scope="row">Sant Gervasi</th><td>64 <span>before 57</span></td><td>54 <span>before 48</span></td><td>1</td></tr></tbody></table>`;
    return `<div class="d-papel">` + sec('The eight numbers', ocho) +
      `<div class="d-inf-dos">${sec('New business', pares(captacion(I)))}${sec('X-ray', pares(I.radiografia))}</div>` +
      sec('By office', ofi) +
      sec('What\'s stalled · ' + par.length + ' deals', `<ul class="d-inf-l">${par.map(o => `<li>${esc(o.texto)} · ${esc(o.estadoTexto.replace('Stalled · ', ''))}</li>`).join('')}</ul>`) +
      sec('What was learned · 7 things', `<ul class="d-inf-l">${D.aprendidoSemana.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`) +
      sec('Team decisions', pares([I.decisiones[0], ['You have to decide today', decidir]])) +
      `<p class="pie">Veta · example with made-up data · ${esc(D.fecha.hoyTexto)}</p></div>`;
  }

  VETA.pantalla('G8', {
    titulo: 'Full report',
    sub: 'Week of 16 to 22 November.',
    cabDerecha: () => ({tipo: 'imprimir'}),
    pinta: () => {
      const n = D.numeros, I = D.informeSemana, par = X.paradas(), decidir = String(r7.cuentas().decidir);
      const oficina = (rotulo, p, c, parn) => ({rotulo, filas: [{nombre: 'Prepared', valor: p[0], sub: `before ${p[1]}`}, {nombre: 'Completed', valor: c[0], sub: `before ${c[1]}`}, {nombre: 'Stalled', valor: parn}]});
      const ocho = (rotulo, v) => ({rotulo, filas: n.nombres.map((t, k) => ({nombre: t, valor: VETA.num(v[k])}))});
      return grupo('Summary', r7.doc({secciones: [ocho('Last 7 days', n['7d']), ocho('Since  ' + VETA.fecha.corta('2026-10-03', {frase: true}), n.desde)]}), 0) +
        papel('New business', filasDe(captacion(I)), 1) +
        papel('X-ray', filasDe(I.radiografia), 1) +
        grupo('By office', r7.doc({secciones: [oficina('Gràcia', [92, 84], [78, 70], 3), oficina('Sant Gervasi', [64, 57], [54, 48], 1)]}), 2) +
        r7.lista(par.map(o => ({nombre: (M.cliente(o.cliente) || {}).nombre || o.texto, pasa: o.texto + ' · ' + o.estadoTexto.replace('Stalled · ', '').replace(/ · [A-Za-z]+ stage.*$/, ''), ir: 'operacion/' + o.cliente})),
          {rotulo: 'What\'s stalled · ' + par.length, i: 3}) +
        grupo('What I\'ve learned · 7', r7.doc({secciones: [{lineas: D.aprendidoSemana}]}), 4) +
        papel('Decisions', filasDe([I.decisiones[0], ['You have to decide today', decidir]]), 4) +
        enPapel(n, I, par, decidir);
    },
    acciones: { imprimir() { try { window.print(); } catch (e) { VETA.aviso('This browser doesn\'t allow printing from here.'); } } }
  });
})();
