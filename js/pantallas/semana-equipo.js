/* Veta demo · pantallas · semana-equipo.js · paquete D (Dirección)
   G3 · Semana · #/semana-equipo — la última semana cerrada, con cifras de equipo (nunca por persona).
   G3b · Enviar el resumen · #/semana-equipo/resumen — la vista previa de lo que recibirán las 4 personas (Teresa, de baja, no).
   G3c · Para la reunión del lunes · #/reunion · G3d · Por oficina · #/oficinas · G3e · El tiempo que gana el equipo · #/tiempo-equipo */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;
  let ventana = '7d', editando = false;

  const N = () => D.numeros;
  const RESUMEN = 'Week of 16 to 22 November. Veta had 156 messages and tasks ready and we completed 132 (the previous week, 141 and 118). There are 4 deals that haven\'t moved for more than 7 days: we\'ll go over them on Monday. This week Veta has learned that in Gràcia almost everyone asks to see the flat on a Saturday.';
  const resumenTexto = () => X.lee('resumenTexto', RESUMEN);
  const enviado = () => X.lee('resumen', null);

  // barra comparada: esta semana y la anterior, sobre el mayor de los dos
  const compara = (titulo, ahora, antes) => {
    const max = Math.max(ahora, antes);
    return `<div class="d-comp"><span class="d-comp-t">${esc(titulo)}</span>` +
      `<span class="d-barra d-barra-a" style="--v:${(ahora / max).toFixed(3)}"><i></i><b>${ahora}</b></span>` +
      `<span class="d-barra d-barra-b" style="--v:${(antes / max).toFixed(3)}"><i></i><b>${antes}</b></span></div>`;
  };

  // ---------------- G3 · Semana ----------------
  VETA.pantalla('G3', {
    titulo: 'Week',
    guia: ['Here Veta summarises the closed week with team figures, not each person\'s.', 'You go over it and send the summary to the team.', 'That way everyone sees the same thing and nobody makes up hours or euros.'],
    pinta: () => {
      const n = N(), env = enviado(), par = X.paradas();
      let h = `<p class="d-periodo" data-i="0">Week of 16 to 22 November</p>`;
      h += `<div class="d-cifra-semana" data-i="0">${UI.cifra({valor: n['7d'][1], unidad: 'messages and tasks Veta had ready', id: 'd-cifra-156'})}` +
        `<p class="d-antes">The previous week: ${n.semanaAnterior.preparados}</p></div>`;
      h += `<div class="d-comps" data-i="1" aria-label="This week and the previous one">${compara('Prepared', n['7d'][1], n.semanaAnterior.preparados)}${compara('Completed', n['7d'][2], n.semanaAnterior.completados)}` +
        `<p class="d-leyenda"><i class="d-ley-a"></i>16 to 22 Nov <i class="d-ley-b"></i>9 to 15 Nov</p></div>`;
      if (env) h += `<div data-i="1">${UI.lineaHecho({texto: 'Summary sent to 4 people', hora: 'today, ' + env.hora, vt: 'd-resumen'})}</div>`;
      h += UI.bloque({titulo: 'The office, in eight numbers', i: 2, html: UI.selector({etiqueta: 'Period', opciones: [{id: '7d', texto: 'Last 7 days'}, {id: 'desde', texto: 'Since 3 Oct'}], valor: ventana, accion: 'ventana'}) + UI.ochoNumeros(ventana)});
      h += `<div class="d-tres-lineas" data-i="3">` +
        `<p><b>What Veta already does.</b> It had 156 messages and tasks ready; the team completed 132.</p>` +
        `<div class="d-parado"><button type="button" class="d-parado-b" data-accion="paradas" aria-expanded="false"><span><b>What's stalled.</b> ${par.length} deals haven't moved for more than 7 days</span><span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
        `<div class="lista d-parado-l" hidden>${par.map(o => UI.fila({titulo: o.texto, sub: o.estadoTexto.replace('Stalled · ', '').replace(' · complaint', ''), icono: 'pausa'})).join('')}</div></div>` +
        `<p><b>What was learned.</b> 7 new things; for example, that in Gràcia almost everyone asks to see the flat on a Saturday.</p></div>`;
      h += UI.lista([
        {titulo: 'For Monday\'s meeting', sub: '3 topics', icono: 'tarea', ir: 'reunion'},
        {titulo: 'By office', sub: 'Gràcia and Sant Gervasi', icono: 'casa', ir: 'oficinas'},
        {titulo: 'The time the team saves', icono: 'reloj', ir: 'tiempo-equipo'},
        {titulo: 'Full report', icono: 'libro', ir: 'informe-completo'}], {i: 4});
      return h;
    },
    botonFijo: () => enviado() ? '' : UI.boton({texto: 'Send the summary to the team', ir: 'semana-equipo/resumen', icono: 'enviar'}),
    alMontar: el => {
      // la cifra rueda desde la de la semana anterior
      const c = el.querySelector('#d-cifra-156');
      if (c && !VETA.reducido()) { c.dataset.rueda = String(N().semanaAnterior.preparados); VETA.rueda(c, N()['7d'][1]); }
    },
    acciones: {
      ventana(ev, el) { ventana = el.dataset.valor; M.numeros(ventana).forEach((n, k) => VETA.rueda(VETA.$('.col.activa [data-n8="' + k + '"]'), n.valor)); },
      paradas(ev, el) {
        const on = el.getAttribute('aria-expanded') !== 'true';
        el.setAttribute('aria-expanded', String(on));
        const l = el.parentNode.querySelector('.d-parado-l'); if (l) l.hidden = !on;
      }
    }
  });

  // ---------------- G3b · Enviar el resumen ----------------
  VETA.pantalla('G3b', {
    titulo: 'Send the summary',
    guia: ['Here Veta shows you the email exactly as the team will receive it.', 'You read it, change it if you want and send it.', 'That way you\'ve seen what reaches the team first.'],
    pinta: () => {
      const env = enviado();
      let h = `<p class="intro" data-i="0">4 people will receive it, by email: Laura, Anna, Marc and David. Teresa, on leave, doesn't get it.</p>`;
      if (env) h += `<div data-i="0">${UI.lineaHecho({texto: 'Summary sent to 4 people', hora: 'today, ' + env.hora})}</div>`;
      h += `<div class="tarjeta d-correo" data-i="1">` +
        `<div class="d-correo-cab"><span class="d-correo-f"><span>From</span><b>Montse Ribas</b></span>` +
        `<span class="d-correo-f"><span>To</span><span class="d-para">${['laura', 'anna', 'marc', 'david'].map(id => VETA.av(id, 32)).join('')}</span><b>4 people</b></span>` +
        `<span class="d-correo-f"><span>Subject</span><b>The week of 16 to 22 November</b></span></div>` +
        (editando
          ? `<div class="campo"><label class="campo-e" for="d-resumen-t">Veta's draft · you're changing it</label><div class="campo-caja"><textarea id="d-resumen-t" class="campo-i" rows="8">${esc(resumenTexto())}</textarea></div></div>`
          : UI.borrador({texto: resumenTexto(), rotulo: resumenTexto() === RESUMEN ? 'Veta\'s draft' : 'Veta\'s draft · changed by you'})) +
        `</div>`;
      h += UI.nota({texto: 'It carries no per-person figures.', icono: 'candado'});
      return h;
    },
    botonFijo: () => {
      if (enviado()) return '';
      return UI.boton({texto: 'Send to the 4 people on the team', accion: 'enviar', icono: 'enviar'}) +
        UI.botones([{texto: editando ? 'Done' : 'Edit', accion: 'editar', icono: editando ? 'check' : 'editar'}]);
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
    guia: ['Here Veta prepares the agenda with the three topics you chose.', 'You go over it and send it to the team.', 'That way the meeting starts with what matters, without anyone\'s names.'],
    pinta: () => {
      const env = X.lee('reunion', null);
      let h = `<p class="intro" data-i="0">The three topics you chose in “How the office is doing today”. Each one opens its cases, without agent names.</p>`;
      if (env) h += `<div data-i="0">${UI.lineaHecho({texto: 'Sent to 4 people', hora: 'today, ' + env.hora})}</div>`;
      h += UI.bloque({titulo: 'Agenda', i: 1, html: UI.lista(X.temas().map((t, k) => ({titulo: t.texto, sub: 'Topic ' + (k + 1), derecha: t.cifra, icono: 'tarea', hoja: 'd-tema', datos: {tema: t.id}})))});
      h += UI.lista([{titulo: 'Change the topics', icono: 'cambiar', hoja: 'h34'}], {i: 2});
      h += UI.bloque({titulo: 'To read beforehand', i: 3, html: UI.lista([
        {titulo: 'The 19:30 wrap-up', sub: 'Yesterday, on one page', icono: 'papel', hoja: 'h41', datos: {parte: '1930'}},
        {titulo: 'Partners report · November', icono: 'libro', hoja: 'h41', datos: {parte: 'socios'}}])});
      return h;
    },
    botonFijo: () => X.lee('reunion', null) ? '' : UI.boton({texto: 'Send the agenda to the team', accion: 'enviar', icono: 'enviar'}),
    acciones: { enviar() { X.guarda('reunion', {hora: VETA.ahora()}); VETA.repinta(); } }
  });

  // ---------------- G3d · Por oficina ----------------
  VETA.pantalla('G3d', {
    titulo: 'By office',
    guia: ['Here Veta compares each office with itself, week against week.', 'You see where things move forward and where they stall.', 'That way there\'s no winner or loser: only the trend.'],
    pinta: () => {
      const ofs = [
        {nombre: 'Gràcia', quien: 'Anna, Laura and Teresa', p: [92, 84], c: [78, 70], par: 3},
        {nombre: 'Sant Gervasi', quien: 'David, Marc and you', p: [64, 57], c: [54, 48], par: 1}];
      const tarjetas = ofs.map((o, k) => `<div class="tarjeta d-ofi" data-i="${k}"><h2 class="bloque-t">${esc(o.nombre)}</h2><p class="bloque-sub">${esc(o.quien)}</p>` +
        `<div class="d-tres">${[[o.p[0], 'Cases prepared', 'before ' + o.p[1]], [o.c[0], 'Completed', 'before ' + o.c[1]], [o.par, 'Stalled deals', '']].map(([n, t, a]) => `<div class="d-tres-c"><b>${n}</b><span>${t}</span>${a ? `<span class="d-tres-a">${a}</span>` : ''}</div>`).join('')}</div></div>`).join('');
      const tabla = `<table class="d-tabla" data-i="0"><caption class="solo-lector">By office</caption><thead><tr><th scope="col">Office</th><th scope="col">Cases prepared</th><th scope="col">Completed</th><th scope="col">Stalled deals</th></tr></thead><tbody>` +
        ofs.map(o => `<tr><th scope="row">${esc(o.nombre)}<span>${esc(o.quien)}</span></th><td>${o.p[0]} <span>before ${o.p[1]}</span></td><td>${o.c[0]} <span>before ${o.c[1]}</span></td><td>${o.par}</td></tr>`).join('') + '</tbody></table>';
      return `<div class="d-solo-movil">${tarjetas}</div><div class="d-solo-ord">${tabla}</div>` +
        `<p class="pie" data-i="2">Each office is only compared with itself. There's no winner.</p>`;
    }
  });

  // ---------------- G3e · El tiempo que gana el equipo ----------------
  VETA.pantalla('G3e', {
    titulo: 'The time the team saves',
    guia: ['Here Veta counts hours only with the times each person enters.', 'You ask for the missing ones and, if you want, enter your cost per hour.', 'That way no figure is made up: they all say where they come from.'],
    pinta: () => {
      const t = D.tiempos.equipo, coste = M.lee('coste', null), pedido = X.lee('pedidoTiempos', null);
      const sem = D.semanas, max = Math.max.apply(null, sem.map(s => s.n));
      let h = `<p class="intro" data-i="0">Veta doesn't make up hours. They come from the times each person enters.</p>`;
      h += `<p class="d-dato" data-i="0"><b>${t.conTiempos} of ${t.personas}</b> people have entered their times.</p>`;
      if (pedido) h += `<div data-i="0">${UI.lineaHecho({texto: 'Asked 2 people', hora: pedido.hora, vt: 'd-pedido', boton: {texto: 'Undo', accion: 'deshacer-pedido'}})}</div>`;
      h += `<div class="tarjeta d-horas" data-i="1">${UI.etiqueta('ejemplo')}${UI.cifra({valor: VETA.horas(t.minutos), unidad: 'week of 16 to 22, with those times'})}` +
        (coste ? `<p class="d-euros"><span>about</span> <b id="d-euros">${VETA.num(M.eurosEquipo(coste))}</b> <span>€ · a ${coste} € per hour · Example</span></p>` : '') + '</div>';
      h += UI.bloque({titulo: 'Week by week', texto: 'Messages and tasks ready', i: 2, html: `<div class="d-semanas">${sem.map((s, k) => `<button type="button" class="d-sem" data-hoja="h25" data-semana="${esc(s.id)}" style="--v:${(s.n / max).toFixed(3)};--k:${k}" aria-label="Week of ${esc(s.texto)}: ${s.n} cases prepared"><b>${s.n}</b><i></i><span>${esc(s.texto)}</span></button>`).join('')}</div>`});
      h += UI.lista([{titulo: 'Cost per hour', sub: coste ? coste + ' € per hour' : 'not set', icono: 'sello', hoja: 'h38'}], {i: 3});
      h += UI.bloque({titulo: 'Before and now', i: 4, html: `<div class="d-antes-ahora">${UI.etiqueta('ejemplo')}<ul><li>Viewing notes the same day: from none to 4 of 4</li><li>Daily list: from 46 cards per week to 21</li></ul></div>`});
      return h;
    },
    botonFijo: () => X.lee('pedidoTiempos', null) ? '' : UI.boton({texto: 'Ask the 2 missing people for their times', accion: 'pedir'}),
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
