/* Veta demo · pantallas · semana-equipo.js · paquete D (Dirección)
   G3 · Semana · #/semana-equipo — la última semana cerrada, con cifras de equipo (nunca por persona).
   G3b · Enviar el resumen · #/semana-equipo/resumen — la vista previa de lo que recibirán las 4 personas (Teresa, de baja, no).
   G3c · Para la reunión del lunes · #/reunion · G3d · Por oficina · #/oficinas · G3e · El tiempo que gana el equipo · #/tiempo-equipo */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;
  let ventana = '7d', editando = false;

  const N = () => D.numeros;
  const RESUMEN = 'Semana del 16 al 22 de noviembre. Veta dejó listos 156 mensajes y tareas y completamos 132 (la anterior, 141 y 118). Hay 4 operaciones que llevan más de 7 días sin moverse: el lunes las repasamos. Esta semana Veta ha aprendido que en Gràcia casi todos piden ver el piso en sábado.';
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
    titulo: 'Semana',
    guia: ['Aquí Veta resume la semana cerrada con cifras del equipo, no de cada persona.', 'Tú la repasas y envías el resumen al equipo.', 'Así todos ven lo mismo y nadie inventa horas ni euros.'],
    pinta: () => {
      const n = N(), env = enviado(), par = X.paradas();
      let h = `<p class="d-periodo" data-i="0">Semana del 16 al 22 de noviembre</p>`;
      h += `<div class="d-cifra-semana" data-i="0">${UI.cifra({valor: n['7d'][1], unidad: 'mensajes y tareas que Veta dejó listos', id: 'd-cifra-156'})}` +
        `<p class="d-antes">La semana anterior: ${n.semanaAnterior.preparados}</p></div>`;
      h += `<div class="d-comps" data-i="1" aria-label="Esta semana y la anterior">${compara('Preparados', n['7d'][1], n.semanaAnterior.preparados)}${compara('Completados', n['7d'][2], n.semanaAnterior.completados)}` +
        `<p class="d-leyenda"><i class="d-ley-a"></i>Del 16 al 22 nov <i class="d-ley-b"></i>Del 9 al 15 nov</p></div>`;
      if (env) h += `<div data-i="1">${UI.lineaHecho({texto: 'Resumen enviado a 4 personas', hora: 'hoy, ' + env.hora, vt: 'd-resumen'})}</div>`;
      h += UI.bloque({titulo: 'La oficina, en ocho números', i: 2, html: UI.selector({etiqueta: 'Periodo', opciones: [{id: '7d', texto: 'Últimos 7 días'}, {id: 'desde', texto: 'Desde el 3 oct'}], valor: ventana, accion: 'ventana'}) + UI.ochoNumeros(ventana)});
      h += `<div class="d-tres-lineas" data-i="3">` +
        `<p><b>Lo que Veta ya hace.</b> Dejó listos 156 mensajes y tareas; el equipo completó 132.</p>` +
        `<div class="d-parado"><button type="button" class="d-parado-b" data-accion="paradas" aria-expanded="false"><span><b>Lo que está parado.</b> ${par.length} operaciones llevan más de 7 días sin moverse</span><span class="fila-chev chev-gira">${VETA.ic('abajo', 16)}</span></button>` +
        `<div class="lista d-parado-l" hidden>${par.map(o => UI.fila({titulo: o.texto, sub: o.estadoTexto.replace('Parada · ', '').replace(' · queja', ''), icono: 'pausa'})).join('')}</div></div>` +
        `<p><b>Lo aprendido.</b> 7 cosas nuevas; por ejemplo, que en Gràcia casi todos piden ver el piso en sábado.</p></div>`;
      h += UI.lista([
        {titulo: 'Para la reunión del lunes', sub: '3 temas', icono: 'tarea', ir: 'reunion'},
        {titulo: 'Por oficina', sub: 'Gràcia y Sant Gervasi', icono: 'casa', ir: 'oficinas'},
        {titulo: 'El tiempo que gana el equipo', icono: 'reloj', ir: 'tiempo-equipo'},
        {titulo: 'Informe completo', icono: 'libro', ir: 'informe-completo'}], {i: 4});
      return h;
    },
    botonFijo: () => enviado() ? '' : UI.boton({texto: 'Enviar el resumen al equipo', ir: 'semana-equipo/resumen', icono: 'enviar'}),
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
    titulo: 'Enviar el resumen',
    guia: ['Aquí Veta te enseña el correo tal como lo recibirá el equipo.', 'Tú lo lees, lo cambias si quieres y lo envías.', 'Así lo que llega al equipo lo has visto antes.'],
    pinta: () => {
      const env = enviado();
      let h = `<p class="intro" data-i="0">Lo recibirán 4 personas, por correo: Laura, Anna, Marc y David. Teresa, de baja, no lo recibe.</p>`;
      if (env) h += `<div data-i="0">${UI.lineaHecho({texto: 'Resumen enviado a 4 personas', hora: 'hoy, ' + env.hora})}</div>`;
      h += `<div class="tarjeta d-correo" data-i="1">` +
        `<div class="d-correo-cab"><span class="d-correo-f"><span>De</span><b>Montse Ribas</b></span>` +
        `<span class="d-correo-f"><span>Para</span><span class="d-para">${['laura', 'anna', 'marc', 'david'].map(id => VETA.av(id, 32)).join('')}</span><b>4 personas</b></span>` +
        `<span class="d-correo-f"><span>Asunto</span><b>La semana del 16 al 22 de noviembre</b></span></div>` +
        (editando
          ? `<div class="campo"><label class="campo-e" for="d-resumen-t">Borrador de Veta · lo estás cambiando</label><div class="campo-caja"><textarea id="d-resumen-t" class="campo-i" rows="8">${esc(resumenTexto())}</textarea></div></div>`
          : UI.borrador({texto: resumenTexto(), rotulo: resumenTexto() === RESUMEN ? 'Borrador de Veta' : 'Borrador de Veta · cambiado por ti'})) +
        `</div>`;
      h += UI.nota({texto: 'No lleva cifras por persona.', icono: 'candado'});
      return h;
    },
    botonFijo: () => {
      if (enviado()) return '';
      return UI.boton({texto: 'Enviar a las 4 personas del equipo', accion: 'enviar', icono: 'enviar'}) +
        UI.botones([{texto: editando ? 'Listo' : 'Editar', accion: 'editar', icono: editando ? 'check' : 'editar'}]);
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
    titulo: 'Para la reunión del lunes',
    guia: ['Aquí Veta prepara el orden del día con los tres temas que elegiste.', 'Tú lo repasas y lo envías al equipo.', 'Así la reunión empieza por lo que importa, sin nombres de nadie.'],
    pinta: () => {
      const env = X.lee('reunion', null);
      let h = `<p class="intro" data-i="0">Los tres temas que elegiste en «Cómo va la oficina hoy». Cada uno abre sus casos, sin nombres de agentes.</p>`;
      if (env) h += `<div data-i="0">${UI.lineaHecho({texto: 'Enviado a 4 personas', hora: 'hoy, ' + env.hora})}</div>`;
      h += UI.bloque({titulo: 'Orden del día', i: 1, html: UI.lista(X.temas().map((t, k) => ({titulo: t.texto, sub: 'Tema ' + (k + 1), derecha: t.cifra, icono: 'tarea', hoja: 'd-tema', datos: {tema: t.id}})))});
      h += UI.lista([{titulo: 'Cambiar los temas', icono: 'cambiar', hoja: 'h34'}], {i: 2});
      h += UI.bloque({titulo: 'Para leer antes', i: 3, html: UI.lista([
        {titulo: 'El parte de las 19:30', sub: 'Lo de ayer, en una página', icono: 'papel', hoja: 'h41', datos: {parte: '1930'}},
        {titulo: 'Informe a socios · noviembre', icono: 'libro', hoja: 'h41', datos: {parte: 'socios'}}])});
      return h;
    },
    botonFijo: () => X.lee('reunion', null) ? '' : UI.boton({texto: 'Enviar el orden del día al equipo', accion: 'enviar', icono: 'enviar'}),
    acciones: { enviar() { X.guarda('reunion', {hora: VETA.ahora()}); VETA.repinta(); } }
  });

  // ---------------- G3d · Por oficina ----------------
  VETA.pantalla('G3d', {
    titulo: 'Por oficina',
    guia: ['Aquí Veta compara cada oficina consigo misma, semana contra semana.', 'Tú ves dónde se avanza y dónde se para.', 'Así no hay ganadora ni perdedora: solo la tendencia.'],
    pinta: () => {
      const ofs = [
        {nombre: 'Gràcia', quien: 'Anna, Laura y Teresa', p: [92, 84], c: [78, 70], par: 3},
        {nombre: 'Sant Gervasi', quien: 'David, Marc y tú', p: [64, 57], c: [54, 48], par: 1}];
      const tarjetas = ofs.map((o, k) => `<div class="tarjeta d-ofi" data-i="${k}"><h2 class="bloque-t">${esc(o.nombre)}</h2><p class="bloque-sub">${esc(o.quien)}</p>` +
        `<div class="d-tres">${[[o.p[0], 'Casos preparados', 'antes ' + o.p[1]], [o.c[0], 'Completados', 'antes ' + o.c[1]], [o.par, 'Operaciones paradas', '']].map(([n, t, a]) => `<div class="d-tres-c"><b>${n}</b><span>${t}</span>${a ? `<span class="d-tres-a">${a}</span>` : ''}</div>`).join('')}</div></div>`).join('');
      const tabla = `<table class="d-tabla" data-i="0"><caption class="solo-lector">Por oficina</caption><thead><tr><th scope="col">Oficina</th><th scope="col">Casos preparados</th><th scope="col">Completados</th><th scope="col">Operaciones paradas</th></tr></thead><tbody>` +
        ofs.map(o => `<tr><th scope="row">${esc(o.nombre)}<span>${esc(o.quien)}</span></th><td>${o.p[0]} <span>antes ${o.p[1]}</span></td><td>${o.c[0]} <span>antes ${o.c[1]}</span></td><td>${o.par}</td></tr>`).join('') + '</tbody></table>';
      return `<div class="d-solo-movil">${tarjetas}</div><div class="d-solo-ord">${tabla}</div>` +
        `<p class="pie" data-i="2">Cada oficina se compara solo consigo misma. No hay ganadora.</p>`;
    }
  });

  // ---------------- G3e · El tiempo que gana el equipo ----------------
  VETA.pantalla('G3e', {
    titulo: 'El tiempo que gana el equipo',
    guia: ['Aquí Veta cuenta horas solo con los tiempos que pone cada persona.', 'Tú pides los que faltan y, si quieres, pones tu coste por hora.', 'Así ninguna cifra es inventada: todas dicen de dónde salen.'],
    pinta: () => {
      const t = D.tiempos.equipo, coste = M.lee('coste', null), pedido = X.lee('pedidoTiempos', null);
      const sem = D.semanas, max = Math.max.apply(null, sem.map(s => s.n));
      let h = `<p class="intro" data-i="0">Veta no inventa horas. Salen de los tiempos que pone cada persona.</p>`;
      h += `<p class="d-dato" data-i="0"><b>${t.conTiempos} de ${t.personas}</b> personas han puesto sus tiempos.</p>`;
      if (pedido) h += `<div data-i="0">${UI.lineaHecho({texto: 'Pedido a 2 personas', hora: pedido.hora, vt: 'd-pedido', boton: {texto: 'Deshacer', accion: 'deshacer-pedido'}})}</div>`;
      h += `<div class="tarjeta d-horas" data-i="1">${UI.etiqueta('ejemplo')}${UI.cifra({valor: VETA.horas(t.minutos), unidad: 'semana del 16 al 22, con esos tiempos'})}` +
        (coste ? `<p class="d-euros"><span>unos</span> <b id="d-euros">${VETA.num(M.eurosEquipo(coste))}</b> <span>€ · a ${coste} € la hora · Ejemplo</span></p>` : '') + '</div>';
      h += UI.bloque({titulo: 'Semana a semana', texto: 'Mensajes y tareas listos', i: 2, html: `<div class="d-semanas">${sem.map((s, k) => `<button type="button" class="d-sem" data-hoja="h25" data-semana="${esc(s.id)}" style="--v:${(s.n / max).toFixed(3)};--k:${k}" aria-label="Semana del ${esc(s.texto)}: ${s.n} casos preparados"><b>${s.n}</b><i></i><span>${esc(s.texto)}</span></button>`).join('')}</div>`});
      h += UI.lista([{titulo: 'Coste por hora', sub: coste ? coste + ' € la hora' : 'sin poner', icono: 'sello', hoja: 'h38'}], {i: 3});
      h += UI.bloque({titulo: 'Antes y ahora', i: 4, html: `<div class="d-antes-ahora">${UI.etiqueta('ejemplo')}<ul><li>Actas el mismo día: de ninguna a 4 de 4</li><li>Lista de cada día: de 46 tarjetas por semana a 21</li></ul></div>`});
      return h;
    },
    botonFijo: () => X.lee('pedidoTiempos', null) ? '' : UI.boton({texto: 'Pedir sus tiempos a las 2 personas que faltan', accion: 'pedir'}),
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
