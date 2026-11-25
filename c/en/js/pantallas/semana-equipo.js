/* Veta demo · ronda 8 · pantallas · semana-equipo.js · carril D
   G3 · La semana pasada · #/semana-equipo — pantalla de resultado (PLAN_R8.md, 8.2 y bocetos/10_semana.png): la cifra (156) con su frase,
        las barras de cuatro semanas y una lista de filas de una línea. Sin subtítulo, como el boceto: con él, la última fila quedaba partida por el pie. Vuelve de la versión A lo que está parado, con su enlace (hoja r8-paradas).
   G3b · Enviar el resumen · #/semana-equipo/resumen — documento: el papel con el texto que recibirán las 4 personas. “Más”: cambiarlo.
   G3c · Reunión del lunes · #/reunion · G3d · Por oficina · #/oficinas · G3e · Tiempo ganado · #/tiempo-equipo (resultado) */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos, r7 = VETA.r7;
  let editando = false;

  const N = () => D.numeros;
  const RESUMEN = 'Week of 16 to 22 November. Veta got 156 messages and tasks ready and we completed 132 (the week before, 141 and 118). There are 4 deals that have not moved for more than 7 days: on Monday we go over them. That week Veta learned that in Gràcia almost everyone asks to see the flat on a Saturday.';
  const resumenTexto = () => X.lee('resumenTexto', RESUMEN);
  const enviado = () => X.lee('resumen', null);
  const R6 = () => VETA.datos.r6.direccion;

  // deshacer el envío del resumen (desde su pantalla o desde la de la semana): el papel vuelve a estar sin enviar
  const deshaceResumen = () => { X.guarda('resumen', null); VETA.repinta({hecho: 'd-resumen'}); };

  // ---------------- G3 · La semana pasada ----------------
  VETA.pantalla('G3', {
    titulo: 'Last week',
    pinta: () => {
      const n = N(), env = enviado(), s = R6().semanas;
      return (env ? r7.hecho({texto: 'Summary sent', hora: env.hora, vt: 'd-resumen', deshacer: 'deshacer-resumen'}) : '') +
        // el número sale de la misma función que la fila de “Veta” (R9)
        r7.cifra({valor: r7.cuentas().oficina, frase: `things I got ready for you. A month ago, ${s.listos[0]}.`, id: 'd-cifra-156', i: 0}) +
        r7.barras(s.etiquetas.map((e, k) => ({valor: s.listos[k], fecha: e})), {etiqueta: 'Things I got ready each week', i: 1}) +
        r7.lista([
          {nombre: 'What I did on my own', dato: n['7d'][6], hoja: 'd-sola'},
          {nombre: 'What I learned', dato: 7, hoja: 'd-aprendi'},
          {nombre: 'Stalled over 7 days', dato: X.paradas().length, hoja: 'r8-paradas'},
          {nombre: 'Monday meeting', ir: 'reunion'},
          {nombre: 'By office', ir: 'oficinas'},
          {nombre: 'Time saved', ir: 'tiempo-equipo'},
          {nombre: 'Full report', ir: 'informe-completo'}], {i: 2});
    },
    botonFijo: () => enviado() ? r7.sigue() : r7.botones({texto: 'Send the summary to the team', ir: 'semana-equipo/resumen'}),
    acciones: { 'deshacer-resumen': deshaceResumen },
    alMontar: el => {
      // la cifra rueda desde la de la semana anterior
      const c = el.querySelector('#d-cifra-156 .r7-cifra-n');
      if (c && !VETA.reducido()) { c.dataset.rueda = String(N().semanaAnterior.preparados); VETA.rueda(c, r7.cuentas().oficina); }
    }
  });

  // ---------------- G3b · Enviar el resumen ----------------
  const guardaTexto = () => { const t = VETA.$('#d-resumen-t'); if (t) X.guarda('resumenTexto', t.value.trim() || RESUMEN); };
  VETA.d1.cambiaResumen = () => { editando = true; VETA.repinta(); };   // lo llama “Más” (hoja d-resumen-mas)
  VETA.pantalla('G3b', {
    titulo: 'Send the summary',
    sub: 'Laura, Anna, Marc and David get it; Teresa, on leave, doesn\'t.',
    nota: () => editando ? '' : 'No figures per person.',
    mas: () => enviado() || editando ? null : 'd-resumen-mas',
    casoDictado: () => ({de: 'resumen-semana', titulo: 'The weekly summary', texto: resumenTexto()}),
    pinta: () => {
      const env = enviado();
      return (env ? r7.hecho({texto: 'Sent to 4 people', hora: env.hora, vt: 'd-resumen', deshacer: 'deshacer-resumen'}) : '') +
        (editando ? `<div data-i="0">${UI.campo({etiqueta: 'You are changing it', area: true, filas: 10, id: 'd-resumen-t', valor: resumenTexto()})}</div>`
          : r7.doc({i: 0, datos: [resumenTexto() === RESUMEN ? 'I write it for you' : 'I wrote it for you · you changed it'], texto: resumenTexto()}));
    },
    botonFijo: () => enviado() ? r7.sigue() : editando ? r7.botones({texto: 'Save', accion: 'editar'}) : r7.botones({texto: 'Send to the 4 people', accion: 'enviar'}),
    alMontar: el => { if (editando) { const t = el.querySelector('#d-resumen-t'); if (t) try { t.focus({preventScroll: true}); } catch (e) {} } },
    acciones: {
      editar() { if (editando) guardaTexto(); editando = !editando; VETA.repinta(); },
      // el final de siempre: la pantalla se queda y enseña “✓ Resumen enviado · Deshacer” arriba y “Ir a Inicio” en el pie
      enviar() { X.guarda('resumen', {hora: VETA.ahora()}); VETA.repinta({hecho: 'd-resumen'}); },
      'deshacer-resumen': deshaceResumen
    }
  });

  // ---------------- G3c · Reunión del lunes ----------------
  VETA.pantalla('G3c', {
    titulo: 'Monday meeting',
    pinta: () => {
      const env = X.lee('reunion', null), t = X.temas();
      return (env ? r7.hecho({texto: 'Sent to 4 people', hora: env.hora, vt: 'd-reunion', deshacer: 'deshacer-reunion'}) : '') +
        r7.lista(t.map(x => ({nombre: x.corto || x.texto, dato: x.cifra, hoja: 'd-tema', datos: {tema: x.id}})), {rotulo: t.length === 3 ? 'The three topics' : 'The topics', i: 0}) +
        r7.lista([
          {nombre: 'Change the topics', hoja: 'h34'},
          {nombre: 'The office wrap-up', hoja: 'h41', datos: {parte: 'oficina'}},
          {nombre: 'Report for partners', hoja: 'h41', datos: {parte: 'socios'}}], {rotulo: 'For the meeting', i: 1});
    },
    botonFijo: () => X.lee('reunion', null) ? r7.sigue() : r7.botones({texto: 'Send the agenda', accion: 'enviar'}),
    acciones: {
      enviar() { X.guarda('reunion', {hora: VETA.ahora()}); VETA.repinta({hecho: 'd-reunion'}); },
      'deshacer-reunion'() { X.guarda('reunion', null); VETA.repinta({hecho: 'd-reunion'}); }
    }
  });

  // ---------------- G3d · Por oficina ----------------
  VETA.pantalla('G3d', {
    titulo: 'By office',
    sub: 'Each office is compared only with itself.',
    pinta: () => {
      const ofs = [
        {nombre: 'Gràcia', p: [92, 84], c: [78, 70], par: 3},
        {nombre: 'Sant Gervasi', p: [64, 57], c: [54, 48], par: 1}];
      return r7.lista(ofs.map(o => ({nombre: o.nombre, pasa: `${o.p[0]} ready · ${o.c[0]} finished · ${o.par} ${o.par === 1 ? 'stalled' : 'stalled'}`,
        abre: `<p>Things ready: <b>${o.p[0]}</b> (the week before, ${o.p[1]}).</p><p>Finished: <b>${o.c[0]}</b> (before, ${o.c[1]}).</p><p>Stalled for more than 7 days: <b>${o.par}</b>.</p>`})), {i: 0});
    }
  });

  // ---------------- G3e · Tiempo ganado ----------------
  VETA.pantalla('G3e', {
    titulo: 'Time saved',
    sub: 'I don\'t make up hours: each person sets them.',
    pinta: () => {
      const t = D.tiempos.equipo, pedido = X.lee('pedidoTiempos', null);
      // sin gráfica: las barras de antes eran mensajes y tareas, no horas (D9). La cifra dice con cuántos tiempos está hecha
      return (pedido ? r7.hecho({texto: 'Asked 2 people', hora: pedido.hora, vt: 'd-pedido', deshacer: 'deshacer-pedido'}) : '') +
        r7.cifra({valor: VETA.horas(t.minutos), i: 0, frase: `last week, according to ${t.conTiempos} of ${t.personas} people. It's an example.`}) +
        r7.lista([
          {nombre: 'Previous weeks', hoja: 'h25'},
          {nombre: 'Two examples', hoja: 'd-ejemplos'}], {i: 2});
    },
    botonFijo: () => X.lee('pedidoTiempos', null) ? r7.sigue() : r7.botones({texto: 'Ask the 2 who are missing for their times', accion: 'pedir'}),
    acciones: {
      pedir() { X.guarda('pedidoTiempos', {hora: VETA.ahora()}); VETA.repinta({hecho: 'd-pedido'}); },
      'deshacer-pedido'() { X.guarda('pedidoTiempos', null); VETA.repinta({hecho: 'd-pedido'}); }
    }
  });
})();
