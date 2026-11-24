/* Veta demo · pantallas · informe-completo.js · paquete D (Dirección)
   G8 · Informe completo · #/informe-completo — la semana entera, para leer o imprimir. Sin tabla por persona ni euros.
   En móvil se lee en una columna; en ordenador (y en papel, css/imprimir.css), tablas de verdad. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;

  const pares = (lista, i) => `<dl class="d-pares"${i != null ? ` data-i="${i}"` : ''}>${lista.map(([t, n]) => `<div><dt>${esc(t)}</dt><dd>${esc(n)}</dd></div>`).join('')}</dl>`;
  // F2 · R2: cada apartado lleva un rótulo pequeño (como “Lo que le gustó” del acta), no un título de sección
  const sec = (titulo, html, i) => `<section class="d-inf-s" data-i="${i}"><p class="d-inf-h">${esc(titulo)}</p>${html}</section>`;

  VETA.pantalla('G8', {
    titulo: 'Full report',
    frase: 'The whole week of 16 to 22 November on one sheet. Read it or print it.',
    guia: ['Here Veta puts the whole week into one report to read calmly.', 'You read it here or print it.', 'That way you have the paper for the meeting, with no per-person figures.'],
    pinta: () => {
      const n = D.numeros, I = D.informeSemana, par = X.paradas();
      const ocho = `<table class="d-tabla d-tabla-8"><caption class="solo-lector">The eight numbers</caption><thead><tr><th scope="col">Number</th><th scope="col">Last 7 days</th><th scope="col">Since 3 Oct</th></tr></thead><tbody>` +
        n.nombres.map((t, k) => `<tr><th scope="row">${esc(t)}</th><td>${VETA.num(n['7d'][k])}</td><td>${VETA.num(n.desde[k])}</td></tr>`).join('') + '</tbody></table>';
      const ofi = `<table class="d-tabla"><caption class="solo-lector">By office</caption><thead><tr><th scope="col">Office</th><th scope="col">Prepared</th><th scope="col">Completed</th><th scope="col">Stalled</th></tr></thead><tbody>` +
        `<tr><th scope="row">Gràcia</th><td>92 <span>before 84</span></td><td>78 <span>before 70</span></td><td>3</td></tr>` +
        `<tr><th scope="row">Sant Gervasi</th><td>64 <span>before 57</span></td><td>54 <span>before 48</span></td><td>1</td></tr></tbody></table>`;
      const ofiMovil = pares([['Gràcia · prepared', '92 (before 84)'], ['Gràcia · completed', '78 (before 70)'], ['Gràcia · stalled', '3'],
        ['Sant Gervasi · prepared', '64 (before 57)'], ['Sant Gervasi · completed', '54 (before 48)'], ['Sant Gervasi · stalled', '1']]);
      // ronda 7 · D2: la fecha va en la frase de arriba; el informe es un papel para leer de corrido (sus apartados se quedan)
      return sec('The eight numbers', ocho, 1) +
        `<div class="d-inf-dos" data-i="2">${sec('New business', pares(I.captacion.map(([t, n]) => [t === 'No reply yet' ? 'No reply yet' : t, n])), 2)}${sec('X-ray', pares(I.radiografia), 2)}</div>` +
        sec('By office', `<div class="d-solo-movil">${ofiMovil}</div><div class="d-solo-ord">${ofi}</div>`, 3) +
        sec('What\'s stalled · ' + par.length + ' deals', `<ul class="d-inf-l">${par.map(o => `<li>${esc(o.texto)} · ${esc(o.estadoTexto.replace('Stalled · ', ''))}</li>`).join('')}</ul>`, 3) +
        sec('What was learned · 7 things', `<ul class="d-inf-l">${D.aprendidoSemana.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`, 4) +
        sec('Team decisions', pares([I.decisiones[0], ['You have to decide today', String(VETA.r7.cuentas().decidir)]]), 4) +
        `<p class="pie d-inf-pie" data-i="4">Veta · example with made-up data · ${esc(D.fecha.hoyTexto)}</p>`;
    },
    botonFijo: () => VETA.r7.botones({texto: 'Print', accion: 'imprimir', icono: 'papel'}),
    acciones: { imprimir() { try { window.print(); } catch (e) { VETA.aviso('This browser doesn\'t allow printing from here.'); } } }
  });
})();
