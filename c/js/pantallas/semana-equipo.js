/* Veta demo · ronda 8 · pantallas · semana-equipo.js · carril D
   G3 · La semana pasada · #/semana-equipo — pantalla de resultado (PLAN_R8.md, 8.2 y bocetos/10_semana.png): la cifra (156) con su frase,
        las barras de cuatro semanas y una lista de filas de una línea. Sin subtítulo, como el boceto: con él, la última fila quedaba partida por el pie. Vuelve de la versión A lo que está parado, con su enlace (hoja r8-paradas).
   G3b · Enviar el resumen · #/semana-equipo/resumen — documento: el papel con el texto que recibirán las 4 personas. «Más»: cambiarlo.
   G3c · Reunión del lunes · #/reunion · G3d · Por oficina · #/oficinas · G3e · Tiempo ganado · #/tiempo-equipo (resultado) */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos, r7 = VETA.r7;
  let editando = false;

  const N = () => D.numeros;
  const RESUMEN = 'Semana del 16 al 22 de noviembre. Veta dejó listos 156 mensajes y tareas y completamos 132 (la de antes, 141 y 118). Hay 4 operaciones que llevan más de 7 días sin moverse: el lunes las repasamos. Esa semana Veta aprendió que en Gràcia casi todos piden ver el piso en sábado.';
  const resumenTexto = () => X.lee('resumenTexto', RESUMEN);
  const enviado = () => X.lee('resumen', null);
  const R6 = () => VETA.datos.r6.direccion;
  const hecho = o => `<div data-i="0">${UI.lineaHecho(o)}</div>`;

  // ---------------- G3 · La semana pasada ----------------
  VETA.pantalla('G3', {
    titulo: 'La semana pasada',
    pinta: () => {
      const n = N(), env = enviado(), s = R6().semanas;
      return (env ? hecho({texto: 'Resumen enviado a 4 personas', hora: 'hoy, ' + env.hora, vt: 'd-resumen'}) : '') +
        // el número sale de la misma función que la fila de «Veta» (R9)
        r7.cifra({valor: r7.cuentas().oficina, frase: `cosas que os dejé listas. Hace un mes, ${s.listos[0]}.`, id: 'd-cifra-156', i: 0}) +
        r7.barras(s.etiquetas.map((e, k) => ({valor: s.listos[k], fecha: e})), {etiqueta: 'Cosas que os dejé listas cada semana', i: 1}) +
        r7.lista([
          {nombre: 'Lo que hice yo sola', dato: n['7d'][6], hoja: 'd-sola'},
          {nombre: 'Lo que aprendí', dato: 7, hoja: 'd-aprendi'},
          {nombre: 'Paradas más de 7 días', dato: X.paradas().length, hoja: 'r8-paradas'},
          {nombre: 'Reunión del lunes', ir: 'reunion'},
          {nombre: 'Por oficina', ir: 'oficinas'},
          {nombre: 'Tiempo ganado', ir: 'tiempo-equipo'},
          {nombre: 'Informe completo', ir: 'informe-completo'}], {i: 2});
    },
    botonFijo: () => enviado() ? '' : r7.botones({texto: 'Enviar el resumen al equipo', ir: 'semana-equipo/resumen'}),
    alMontar: el => {
      // la cifra rueda desde la de la semana anterior
      const c = el.querySelector('#d-cifra-156 .r7-cifra-n');
      if (c && !VETA.reducido()) { c.dataset.rueda = String(N().semanaAnterior.preparados); VETA.rueda(c, r7.cuentas().oficina); }
    }
  });

  // ---------------- G3b · Enviar el resumen ----------------
  const guardaTexto = () => { const t = VETA.$('#d-resumen-t'); if (t) X.guarda('resumenTexto', t.value.trim() || RESUMEN); };
  VETA.d1.cambiaResumen = () => { editando = true; VETA.repinta(); };   // lo llama «Más» (hoja d-resumen-mas)
  VETA.pantalla('G3b', {
    titulo: 'Enviar el resumen',
    sub: 'Lo recibirán Laura, Anna, Marc y David; Teresa, de baja, no.',
    nota: () => editando ? '' : 'No lleva cifras por persona.',
    mas: () => enviado() || editando ? null : 'd-resumen-mas',
    casoDictado: () => ({de: 'resumen-semana', titulo: 'El resumen de la semana', texto: resumenTexto()}),
    pinta: () => {
      const env = enviado();
      return (env ? hecho({texto: 'Resumen enviado a 4 personas', hora: 'hoy, ' + env.hora}) : '') +
        (editando ? `<div data-i="0">${UI.campo({etiqueta: 'Lo estás cambiando', area: true, filas: 10, id: 'd-resumen-t', valor: resumenTexto()})}</div>`
          : r7.doc({i: 0, datos: [resumenTexto() === RESUMEN ? 'Te lo dejo escrito' : 'Te lo dejo escrito · lo cambiaste tú'], texto: resumenTexto()}));
    },
    botonFijo: () => enviado() ? '' : editando ? r7.botones({texto: 'Listo', accion: 'editar'}) : r7.botones({texto: 'Enviar a las 4 personas', accion: 'enviar'}),
    alMontar: el => { if (editando) { const t = el.querySelector('#d-resumen-t'); if (t) try { t.focus({preventScroll: true}); } catch (e) {} } },
    acciones: {
      editar() { if (editando) guardaTexto(); editando = !editando; VETA.repinta(); },
      enviar() { X.guarda('resumen', {hora: VETA.ahora()}); X.vuelve(); }
    }
  });

  // ---------------- G3c · Reunión del lunes ----------------
  VETA.pantalla('G3c', {
    titulo: 'Reunión del lunes',
    pinta: () => {
      const env = X.lee('reunion', null), t = X.temas();
      return (env ? hecho({texto: 'Enviado a 4 personas', hora: 'hoy, ' + env.hora}) : '') +
        r7.lista(t.map(x => ({nombre: x.corto || x.texto, dato: x.cifra, hoja: 'd-tema', datos: {tema: x.id}})), {rotulo: t.length === 3 ? 'Los tres temas' : 'Los temas', i: 0}) +
        r7.lista([
          {nombre: 'Cambiar los temas', hoja: 'h34'},
          {nombre: 'El parte de las 19:30', hoja: 'h41', datos: {parte: '1930'}},
          {nombre: 'Informe para socios', hoja: 'h41', datos: {parte: 'socios'}}], {rotulo: 'Además', i: 1});
    },
    botonFijo: () => X.lee('reunion', null) ? '' : r7.botones({texto: 'Enviar el orden del día', accion: 'enviar'}),
    acciones: { enviar() { X.guarda('reunion', {hora: VETA.ahora()}); VETA.repinta(); } }
  });

  // ---------------- G3d · Por oficina ----------------
  VETA.pantalla('G3d', {
    titulo: 'Por oficina',
    sub: 'Cada oficina se compara solo consigo misma.',
    pinta: () => {
      const ofs = [
        {nombre: 'Gràcia', quien: 'Anna, Laura y Teresa', p: [92, 84], c: [78, 70], par: 3},
        {nombre: 'Sant Gervasi', quien: 'David, Marc y tú', p: [64, 57], c: [54, 48], par: 1}];
      return r7.lista(ofs.map(o => ({nombre: o.nombre, pasa: `${o.p[0]} listas · ${o.c[0]} terminadas · ${o.par} ${o.par === 1 ? 'parada' : 'paradas'}`,
        abre: `<p>${esc(o.quien)}.</p><p>Cosas listas: <b>${o.p[0]}</b> (la semana de antes, ${o.p[1]}).</p><p>Terminadas: <b>${o.c[0]}</b> (antes, ${o.c[1]}).</p><p>Paradas más de 7 días: <b>${o.par}</b>.</p>`})), {i: 0});
    }
  });

  // ---------------- G3e · Tiempo ganado ----------------
  VETA.pantalla('G3e', {
    titulo: 'Tiempo ganado',
    sub: 'No me invento horas: las pone cada persona.',
    pinta: () => {
      const t = D.tiempos.equipo, coste = M.lee('coste', null), pedido = X.lee('pedidoTiempos', null);
      return (pedido ? hecho({texto: 'Pedido a 2 personas', hora: pedido.hora, vt: 'd-pedido', boton: {texto: 'Deshacer', accion: 'deshacer-pedido'}}) : '') +
        r7.cifra({valor: VETA.horas(t.minutos), i: 0, frase: 'la semana pasada. Es un ejemplo.'}) +
        r7.barras(D.semanas.map(s => ({valor: s.n, fecha: s.texto})), {etiqueta: 'Mensajes y tareas listos, semana a semana', i: 1}) +
        r7.lista([
          {nombre: 'Han puesto sus tiempos', dato: `${t.conTiempos} de ${t.personas}`},
          {nombre: 'Coste por hora', dato: coste ? coste + ' €' : 'Sin poner', hoja: 'h38'},
          coste ? {nombre: 'A ese coste (ejemplo)', dato: `unos ${VETA.num(M.eurosEquipo(coste))} €`} : null,
          {nombre: 'Semanas anteriores', hoja: 'h25'},
          {nombre: 'Dos ejemplos', hoja: 'd-ejemplos'}], {i: 2});
    },
    botonFijo: () => X.lee('pedidoTiempos', null) ? '' : r7.botones({texto: 'Pedir sus tiempos a las 2 que faltan', accion: 'pedir'}),
    acciones: {
      pedir() { X.guarda('pedidoTiempos', {hora: VETA.ahora()}); VETA.repinta({hecho: 'd-pedido'}); },
      'deshacer-pedido'() { X.guarda('pedidoTiempos', null); VETA.repinta({hecho: 'd-pedido'}); }
    }
  });
})();
