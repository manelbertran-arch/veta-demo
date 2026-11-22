/* Veta demo · pantallas · semana-equipo.js · paquete D (Dirección) · ronda 7 · D2
   G3 · La semana pasada · #/semana-equipo — el 156 grande, una frase, el gráfico de cuatro semanas (venía de Equipo) y “Enviar el resumen”.
   G3b · Enviar el resumen · #/semana-equipo/resumen — la vista previa de lo que recibirán las 4 personas (Teresa, de baja, no).
   G3c · Para la reunión del lunes · #/reunion · G3d · Por oficina · #/oficinas · G3e · El tiempo que gana el equipo · #/tiempo-equipo */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;
  let editando = false;

  const N = () => D.numeros;
  const RESUMEN = 'Week of 16 to 22 November. Veta got 156 messages and tasks ready and we completed 132 (the week before, 141 and 118). There are 4 deals that have not moved for more than 7 days: on Monday we go over them. That week Veta learned that in Gràcia almost everyone asks to see the flat on a Saturday.';
  const resumenTexto = () => X.lee('resumenTexto', RESUMEN);
  const enviado = () => X.lee('resumen', null);

  // ---------------- G3 · La semana pasada (ronda 7 · D2) ----------------
  // Una cosa: el 156 grande, una frase y un gráfico (las cuatro últimas semanas, que antes estaba en Equipo). Abajo, el botón negro
  // “Enviar el resumen al equipo”. Lo demás, en filas con su nombre. Lo que espera decisión vive en Decidir y lo parado en Operaciones (R9).
  const R6 = () => VETA.datos.r6.direccion;
  function cuatro() {
    const s = R6().semanas, n = s.listos.length, max = Math.max.apply(null, s.listos);
    return `<div class="d2-4s" role="img" aria-label="Things I got ready for you each week, the last four: from ${s.listos[0]} to ${s.listos[n - 1]}" data-i="1">` +
      s.etiquetas.map((e, k) => `<span class="d2-4s-c${k === n - 1 ? ' d2-4s-hoy' : ''}"><b class="d2-4s-n">${s.listos[k]}</b>` +
        `<span class="d2-4s-a" style="--v:${(s.listos[k] / max).toFixed(3)}"></span><span class="d2-4s-e">${esc(e)}</span></span>`).join('') + `</div>`;
  }
  VETA.pantalla('G3', {
    titulo: 'Last week',
    frase: 'From 16 to 22 November. Have a look and send the summary to the team.',
    pinta: () => {
      const n = N(), env = enviado(), s = R6().semanas, k = s.corregidos.length, sig = R6().pide[0];
      let h = '';
      if (env) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Summary sent to 4 people', hora: 'today, ' + env.hora, vt: 'd-resumen'})}</div>`;
      // el número que nadie tenía, de la misma función que la caja (R9)
      h += `<div class="d2-cifra" data-i="0"><b class="d2-cifra-n" id="d-cifra-156">${VETA.r7.cuentas().oficina}</b>` +
        `<p class="d2-cifra-t">things I left ready for you. You all corrected me <b>${s.corregidos[k - 1]}</b> times; a month ago, ${s.corregidos[0]}.</p></div>`;
      h += cuatro();
      h += VETA.r7.lista([
        {icono: 'check', oro: true, nombre: 'What I did on my own', pasa: `I keep doing ${n['7d'][6]} tasks for you all`,
          abre: `<p>You all finished <b>${n['7d'][2]}</b> things; the week before, ${n.semanaAnterior.completados}.</p><p>I follow <b>${n['7d'][6]}</b> tasks on my own: I check whether a document arrives or someone replies.</p><p>Messages I send on my own: <b>none</b>. During the pilot I send nothing without your approval.</p>`},
        {icono: 'aprende', oro: true, nombre: 'What I learned', pasa: '7 things this week',
          abre: `<p>For example: in Gràcia almost everyone asks to see the flat on a Saturday.</p><p>Next: <b>${esc(sig.tema.toLowerCase())}</b>. You have done it by hand ${sig.veces} times.</p>` + VETA.r7.ensena({guion: 'orden', texto: 'Teach me'})},
        {icono: 'tarea', nombre: 'For Monday\'s meeting', pasa: 'The 3 topics and the agenda', ir: 'reunion'},
        {icono: 'casa', nombre: 'By office', pasa: 'Gràcia and Sant Gervasi', ir: 'oficinas'},
        {icono: 'reloj', nombre: 'The time the team saves', pasa: 'With the times each person sets', ir: 'tiempo-equipo'},
        {icono: 'libro', nombre: 'Full report', pasa: 'All the numbers', ir: 'informe-completo'}], {i: 2});
      return h;
    },
    botonFijo: () => enviado() ? '' : VETA.r7.botones({texto: 'Send the summary to the team', icono: 'enviar', ir: 'semana-equipo/resumen'}),
    alMontar: el => {
      // la cifra rueda desde la de la semana anterior
      const c = el.querySelector('#d-cifra-156');
      if (c && !VETA.reducido()) { c.dataset.rueda = String(N().semanaAnterior.preparados); VETA.rueda(c, VETA.r7.cuentas().oficina); }
    }
  });

  // ---------------- G3b · Enviar el resumen ----------------
  VETA.pantalla('G3b', {
    titulo: 'Send the summary',
    frase: 'I write it for you. Laura, Anna, Marc and David will get it; Teresa, who is off sick, will not.',
    fraseCuerpo: true,   // a quién le llega, a la vista antes de enviar
    pinta: () => {
      const env = enviado();
      let h = '';
      if (env) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Summary sent to 4 people', hora: 'today, ' + env.hora})}</div>`;
      h += `<div class="r7-ficha r7-oro d2-resumen" data-i="0"><span class="r7-ficha-de">${resumenTexto() === RESUMEN ? 'I write it for you' : 'I wrote it for you · you changed it'}</span>` +
        (editando
          ? `<div class="campo"><label class="campo-e" for="d-resumen-t">You are changing it</label><div class="campo-caja"><textarea id="d-resumen-t" class="campo-i" rows="8">${esc(resumenTexto())}</textarea></div></div>`
          : `<p>${esc(resumenTexto())}</p>`) +
        VETA.r7.ensena({texto: 'Teach Veta how you want it'}) + `</div>`;
      h += VETA.r7.lista([{icono: 'equipo', nombre: 'For 4 people', pasa: 'It has no numbers for each person',
        abre: `<p>${['laura', 'anna', 'marc', 'david'].map(id => esc(X.persona(id).nombre)).join(', ')}.</p><p>Teresa is off sick: she does not get it.</p>`}], {i: 1});
      return h;
    },
    botonFijo: () => {
      if (enviado()) return '';
      return VETA.r7.botones({texto: 'Send to the 4 people', accion: 'enviar', icono: 'enviar'},
        [{texto: editando ? 'Done' : 'Change', accion: 'editar'}]);
    },
    alMontar: el => { if (editando) { const t = el.querySelector('#d-resumen-t'); if (t) try { t.focus({preventScroll: true}); } catch (e) {} } },
    acciones: {
      editar() {
        if (editando) { const t = VETA.$('#d-resumen-t'); if (t) X.guarda('resumenTexto', t.value.trim() || RESUMEN); }
        editando = !editando; VETA.repinta();
      },
      enviar() {
        if (editando) { const t = VETA.$('#d-resumen-t'); if (t) X.guarda('resumenTexto', t.value.trim() || RESUMEN); editando = false; }
        X.guarda('resumen', {hora: VETA.ahora()});
        X.vuelve();
      }
    }
  });

  // ---------------- G3c · Para la reunión del lunes ----------------
  VETA.pantalla('G3c', {
    titulo: 'For Monday\'s meeting',
    frase: 'The three topics you chose. Tap one to see its cases and send the agenda.',
    pinta: () => {
      const env = X.lee('reunion', null);
      let h = '';
      if (env) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Sent to 4 people', hora: 'today, ' + env.hora})}</div>`;
      h += VETA.r7.lista(X.temas().map((t, k) => ({icono: 'tarea', nombre: t.texto, pasa: 'Topic ' + (k + 1) + ' of the agenda', numero: t.cifra, hoja: 'd-tema', datos: {tema: t.id}})).concat([
        {icono: 'cambiar', nombre: 'Change the topics', pasa: 'Choose the three you want to see', hoja: 'h34'},
        {icono: 'papel', nombre: 'The 19:30 wrap-up', pasa: 'Yesterday, on one page', hoja: 'h41', datos: {parte: '1930'}},
        {icono: 'libro', nombre: 'Partners report · November', pasa: 'To read beforehand', hoja: 'h41', datos: {parte: 'socios'}}]), {i: 0});
      return h;
    },
    botonFijo: () => X.lee('reunion', null) ? '' : VETA.r7.botones({texto: 'Send the agenda to the team', accion: 'enviar', icono: 'enviar'}),
    acciones: { enviar() { X.guarda('reunion', {hora: VETA.ahora()}); VETA.repinta(); } }
  });

  // ---------------- G3d · Por oficina ----------------
  VETA.pantalla('G3d', {
    titulo: 'By office',
    frase: 'Each office is compared only with itself, week against week. There is no winner.',
    pinta: () => {
      const ofs = [
        {nombre: 'Gràcia', quien: 'Anna, Laura and Teresa', p: [92, 84], c: [78, 70], par: 3},
        {nombre: 'Sant Gervasi', quien: 'David, Marc and you', p: [64, 57], c: [54, 48], par: 1}];
      return VETA.r7.lista(ofs.map(o => ({icono: 'casa', nombre: o.nombre, pasa: `${o.p[0]} ready · ${o.c[0]} finished · ${o.par} ${o.par === 1 ? 'stalled' : 'stalled'}`,
        abre: `<p>${esc(o.quien)}.</p><p>Things ready: <b>${o.p[0]}</b> (the week before, ${o.p[1]}).</p><p>Finished: <b>${o.c[0]}</b> (before, ${o.c[1]}).</p><p>Stalled for more than 7 days: <b>${o.par}</b>.</p>`})), {i: 0});
    }
  });

  // ---------------- G3e · El tiempo que gana el equipo ----------------
  VETA.pantalla('G3e', {
    titulo: 'The time the team saves',
    frase: 'I do not make up hours: they come from the times each person sets.',
    pinta: () => {
      const t = D.tiempos.equipo, coste = M.lee('coste', null), pedido = X.lee('pedidoTiempos', null);
      const sem = D.semanas, max = Math.max.apply(null, sem.map(s => s.n));
      let h = '';
      if (pedido) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: 'Asked 2 people', hora: pedido.hora, vt: 'd-pedido', boton: {texto: 'Undo', accion: 'deshacer-pedido'}})}</div>`;
      h += `<div class="tarjeta d-horas" data-i="0">${UI.etiqueta('ejemplo')}${UI.cifra({valor: VETA.horas(t.minutos), unidad: 'week of 16 to 22, with those times'})}` +
        (coste ? `<p class="d-euros"><span>about</span> <b id="d-euros">${VETA.num(M.eurosEquipo(coste))}</b> <span>€ · a ${coste} € per hour · Example</span></p>` : '') + '</div>';
      h += `<div class="d-semanas d2-semanas" data-i="1" aria-label="Messages and tasks ready, week by week">${sem.map((s, k) => `<button type="button" class="d-sem" data-hoja="h25" data-semana="${esc(s.id)}" style="--v:${(s.n / max).toFixed(3)};--k:${k}" aria-label="Week of ${esc(s.texto)}: ${s.n} cases prepared"><b>${s.n}</b><i></i><span>${esc(s.texto)}</span></button>`).join('')}</div>`;
      h += VETA.r7.lista([
        {icono: 'usuario', nombre: 'Who has set their times', pasa: `${t.conTiempos} of ${t.personas} people`},
        {icono: 'sello', nombre: 'Cost per hour', pasa: coste ? coste + ' € per hour' : 'Not set', hoja: 'h38'},
        {icono: 'grafica', nombre: 'Before and now', pasa: 'Two examples', abre: `<p>Viewing notes the same day: from none to 4 out of 4.</p><p>Each day's list: from 46 cards a week to 21.</p><p>These are examples.</p>`}], {i: 2});
      return h;
    },
    botonFijo: () => X.lee('pedidoTiempos', null) ? '' : VETA.r7.botones({texto: 'Ask the 2 who are missing for their times', accion: 'pedir'}),
    alMontar: el => {
      const e = el.querySelector('#d-euros');
      if (e && X.lee('rodarEuros', false)) { X.guarda('rodarEuros', false); if (!VETA.reducido()) { e.dataset.rueda = '0'; VETA.rueda(e, Number(e.textContent.replace(/\./g, ''))); } }
    },
    acciones: {
      pedir() { X.guarda('pedidoTiempos', {hora: VETA.ahora()}); VETA.repinta({hecho: 'd-pedido'}); },
      'deshacer-pedido'() { X.guarda('pedidoTiempos', null); VETA.repinta({hecho: 'd-pedido'}); }
    }
  });
})();
