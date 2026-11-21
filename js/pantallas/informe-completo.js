/* Veta demo · pantallas · informe-completo.js · paquete D (Dirección)
   G8 · Informe completo · #/informe-completo — la semana entera, para leer o imprimir. Sin tabla por persona ni euros.
   En móvil se lee en una columna; en ordenador (y en papel, css/imprimir.css), tablas de verdad. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;

  const pares = (lista, i) => `<dl class="d-pares"${i != null ? ` data-i="${i}"` : ''}>${lista.map(([t, n]) => `<div><dt>${esc(t)}</dt><dd>${esc(n)}</dd></div>`).join('')}</dl>`;
  const sec = (titulo, html, i) => `<section class="d-inf-s" data-i="${i}"><h2 class="bloque-t">${esc(titulo)}</h2>${html}</section>`;

  VETA.pantalla('G8', {
    titulo: 'Informe completo',
    guia: ['Aquí Veta junta toda la semana en un informe para leer con calma.', 'Tú lo lees aquí o lo imprimes.', 'Así tienes el papel para la reunión, sin cifras por persona.'],
    pinta: () => {
      const n = D.numeros, I = D.informeSemana, par = X.paradas();
      const ocho = `<table class="d-tabla d-tabla-8"><caption class="solo-lector">Los ocho números</caption><thead><tr><th scope="col">Número</th><th scope="col">Últimos 7 días</th><th scope="col">Desde el 3 oct</th></tr></thead><tbody>` +
        n.nombres.map((t, k) => `<tr><th scope="row">${esc(t)}</th><td>${VETA.num(n['7d'][k])}</td><td>${VETA.num(n.desde[k])}</td></tr>`).join('') + '</tbody></table>';
      const ofi = `<table class="d-tabla"><caption class="solo-lector">Por oficina</caption><thead><tr><th scope="col">Oficina</th><th scope="col">Preparados</th><th scope="col">Completados</th><th scope="col">Paradas</th></tr></thead><tbody>` +
        `<tr><th scope="row">Gràcia</th><td>92 <span>antes 84</span></td><td>78 <span>antes 70</span></td><td>3</td></tr>` +
        `<tr><th scope="row">Sant Gervasi</th><td>64 <span>antes 57</span></td><td>54 <span>antes 48</span></td><td>1</td></tr></tbody></table>`;
      const ofiMovil = pares([['Gràcia · preparados', '92 (antes 84)'], ['Gràcia · completados', '78 (antes 70)'], ['Gràcia · paradas', '3'],
        ['Sant Gervasi · preparados', '64 (antes 57)'], ['Sant Gervasi · completados', '54 (antes 48)'], ['Sant Gervasi · paradas', '1']]);
      return `<header class="d-inf-cab" data-i="0"><p class="d-periodo">Semana del 16 al 22 de noviembre · Gràcia y Sant Gervasi</p>` +
        `<p class="bloque-sub">Informe de la oficina. Cifras del equipo, nunca de cada persona.</p></header>` +
        sec('Los ocho números', ocho, 1) +
        `<div class="d-inf-dos" data-i="2">${sec('Captación', pares(I.captacion), 2)}${sec('Radiografía', pares(I.radiografia), 2)}</div>` +
        sec('Por oficina', `<div class="d-solo-movil">${ofiMovil}</div><div class="d-solo-ord">${ofi}</div>`, 3) +
        sec('Lo que está parado · ' + par.length + ' operaciones', `<ul class="d-inf-l">${par.map(o => `<li>${esc(o.texto)} · ${esc(o.estadoTexto.replace('Parada · ', ''))}</li>`).join('')}</ul>`, 3) +
        sec('Lo aprendido · 7 cosas', `<ul class="d-inf-l">${D.aprendidoSemana.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`, 4) +
        sec('Decisiones del equipo', pares([I.decisiones[0], ['Por decidir hoy', String(VETA.modelo.decisiones().filter(X.pendiente).length)]]), 4) +
        `<p class="pie d-inf-pie" data-i="4">Veta · ejemplo con datos inventados · ${esc(D.fecha.hoyTexto)}</p>`;
    },
    botonFijo: () => UI.boton({texto: 'Imprimir', accion: 'imprimir', icono: 'papel'}),
    acciones: { imprimir() { try { window.print(); } catch (e) { VETA.aviso('Este navegador no deja imprimir desde aquí.'); } } }
  });
})();
