/* Veta demo · pantallas · regla.js · paquete C (Veta, cuenta y entrada)
   - A10 · Una regla · #/regla/<id>   (una pantalla, cuatro estados: propuesta · a prueba · activa · descartada)
   - A10b · Hasta dónde llega · #/regla/<id>/nivel
   Sus hojas (H18 un caso, H19 los casos como yo, H20 otra cosa…, H22 subir un nivel) están en js/hojas/veta.js. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const D = () => VETA.datos.c;
  const linea = id => { const l = C.lee('linea', null); const r = M.regla(id); return l && r && l.id === id && l.estado === r.estado ? l : null; };
  // quién la ve: la prueba es solo tuya; si la propones a la oficina (Otra cosa…), Montse la ve con tu nombre
  const aQuien = id => {
    const ofi = C.lee('aOficina', {})[id];
    return `<div data-i="3">${UI.nota({texto: ofi ? `Se lo propusiste a la oficina a las ${ofi}: Montse lo ve con tu nombre.` : 'Esta prueba es solo tuya: Montse no la ve. Si se lo propones a la oficina, desde «Otra cosa…», Montse lo verá con tu nombre.', icono: ofi ? 'equipo' : 'candado', clase: 'nota-gris'})}</div>`;
  };
  C.excepciones = id => C.lee('excepciones', {})[id] || [];
  C.ponExcepcion = (id, cliente) => { const e = C.lee('excepciones', {}); e[id] = (e[id] || []).filter(x => x !== cliente).concat(cliente ? [cliente] : []); C.pon('excepciones', e); };
  C.quitaExcepcion = (id, cliente) => { const e = C.lee('excepciones', {}); e[id] = (e[id] || []).filter(x => x !== cliente); C.pon('excepciones', e); };
  // cambia el estado de una regla y deja la línea en el sitio
  C.cambiaRegla = (id, estado, texto) => {
    M.marca(id, estado);
    C.pon('linea', {id, estado, texto});
    VETA.repinta({hecho: 'c-regla'});
  };

  // ---- ronda 6 · «¿Quién lo hace?»: de «Lo haces tú» a «Lo hago yo», con la pregunta para subir un paso ----
  const NV = () => D().niveles;
  const subeDe = id => {
    if (id === 'r-visitas') { const v = C.visitas(), s = C.r6().visitas.sube[v.estado]; return s ? Object.assign({accion: 'subir', de: id}, s) : null; }   // solo pregunta mientras es una propuesta
    const x = C.r6().pasos[id]; return x && x.sube && C.paso(id) === x.paso && (M.regla(id) || {}).estado === 'activa' ? Object.assign({accion: 'subir', de: id}, x.sube) : null;
  };
  // lo que digo justo después de subir un paso, en el sitio de la pregunta: sin historial (empieza hoy) y sin otra pregunta
  const MAS = ' Cuando lo haya hecho unas cuantas veces, te pregunto si doy un paso más.';
  const notaDe = id => {
    if (id === 'r-visitas') return C.visitas().estado === 'prueba' ? C.r6().visitas.hecho : '';
    const l = C.lee('nivelLinea', null), n = C.paso(id); if (!l || l.id !== id) return '';
    return `Hecho. Desde hoy, ${n >= 4 ? 'lo hago yo y te lo cuento' : n === 3 ? 'lo apunto yo' : 'te lo dejo escrito'}.` + (n < 4 ? MAS : '');
  };
  C.quien = (id, i, desde) => `<section class="bloque c-quien"${i != null ? ` data-i="${i}"` : ''}><h2 class="bloque-t">¿Quién lo hace?</h2>` +
    VETA.vivo.escalera({nivel: C.paso(id), desde: (C.lee('nivelLinea', null) || {}).id === id ? 'hoy' : desde, sube: subeDe(id), nota: notaDe(id)}) + `</section>`;
  // el nombre del trabajo (el mismo que en la lista, en Hoy y en la pestaña Veta) y debajo, qué es
  const cabeza = (id, frase, apagada) => `<h2 class="c-frase c-frase-g${apagada ? ' c-apagada' : ''}" data-i="1">${esc(C.nombre(id))}</h2><p class="c-regla-que${apagada ? ' c-apagada' : ''}" data-i="1">${esc(frase)}</p>`;
  // la línea en el sitio al subir un paso, con «Deshacer»
  const lineaPaso = id => {
    const l = id === 'r-visitas' ? C.lee('visLinea', null) : C.lee('nivelLinea', null);
    if (!l || (id !== 'r-visitas' && l.id !== id) || (id === 'r-visitas' && l.estado !== VETA.r6.reglaVisitas())) return '';
    return UI.lineaHecho({texto: l.texto, hora: l.hora, boton: {texto: 'Deshacer', accion: 'baja'}, vt: 'c-paso', i: 0});
  };
  C.subir = id => {
    if (id === 'r-visitas') {
      const antes = VETA.r6.reglaVisitas(); if (antes !== 'propuesta') return;     // la prueba empieza hoy: no hay otro paso que dar todavía
      const v = VETA.r6.subeReglaVisitas();
      C.pon('visLinea', {estado: v, antes, hora: VETA.ahora(), texto: 'Lo estoy probando · desde hoy'});
    } else {
      const n = C.paso(id); C.ponNivel(id, n + 1);
      C.pon('nivelLinea', {id, texto: `${NV()[n].nombre} · desde hoy`, hora: VETA.ahora(), subido: n});
    }
    VETA.repinta({paso: true});
  };
  C.bajar = id => {
    if (id === 'r-visitas') { const l = C.lee('visLinea', null); if (l) VETA.r6.ponReglaVisitas(l.antes); C.pon('visLinea', null); }
    else { const l = C.lee('nivelLinea', null); if (l && l.subido) C.ponNivel(id, l.subido); C.pon('nivelLinea', null); }
    VETA.repinta({paso: true});
    VETA.aviso('Vale. Lo vuelvo a hacer como antes: no lo hago sin preguntarte.');
  };

  // confirmar las visitas el día antes: se sube aquí mismo (VETA.r6.reglaVisitas)
  let todos = false;
  function visitas() {
    const v = C.visitas(), d = C.r6().visitas, lin = lineaPaso('r-visitas');
    const casos = todos ? d.casos : d.casos.slice(0, 4);
    return (lin || `<div class="c-regla-etq" data-i="0" data-vt="c-paso">${UI.etiqueta(v.etq, v.texto)}</div>`) +
      cabeza('r-visitas', v.frase) +
      C.quien('r-visitas', 2, v.estado === 'propuesta' ? '' : 'hoy') +
      (v.estado === 'prueba' ? '' : UI.bloque({titulo: 'Lo que pasará', i: 3, html: `<p class="c-espero c-vivo-f">${esc(v.manana)}</p>`})) +
      UI.bloque({titulo: `Las ${d.hechas} veces que lo hiciste tú`, i: 4,
        html: UI.lista(casos.map(c => ({titulo: c.nombre, sub: `${c.cuando} · «${c.dijo}»${c.distinto ? ' · ' + c.distinto : ''}`, av: c.av}))) +
          (todos ? '' : UI.boton({tipo: 'texto', texto: `Ver las ${d.casos.length}`, accion: 'todos'}))}) +
      `<div data-i="4">${UI.nota({texto: 'Durante el piloto, no envío nada sin tu aprobación.', icono: 'candado', clase: 'nota-gris'})}</div>`;
  }

  function casos(r, id) {
    if (r.estado === 'propuesta' && r.casos && r.casos.distinto) {
      const n = r.casos.comoYo.length, m = r.casos.distinto.length, ex = C.excepciones(id);
      const abierto = C.lee('distintoAbierto', true);
      return `<section class="bloque" data-i="2"><h2 class="bloque-t">Las ${n + m} veces que lo hiciste tú</h2>` +
        `<div class="c-partes" style="--a:${n};--b:${m}">` +
          `<button type="button" class="c-parte c-parte-a" data-hoja="h19" data-regla="${esc(id)}" data-g="${n} igual|Las veces que al día siguiente enviaste el informe del piso."><b>${n}</b><span>igual ›</span></button>` +
          `<button type="button" class="c-parte c-parte-b" data-accion="distinto" aria-expanded="${abierto}" aria-controls="c-distinto"><b>${m}</b><span>distinto</span><i class="chev-gira">${VETA.ic('abajo', 16)}</i></button>` +
        `</div>` +
        `<div id="c-distinto" class="c-distinto"${abierto ? '' : ' hidden'}>${UI.lista(r.casos.distinto.map(c => ({
          titulo: c.nombre, sub: `${c.cuando} · ${(D().distinto[c.cliente] || {}).motivo || ''}${ex.includes(c.cliente) ? ' · con él, no' : ''}`,
          av: c.cliente, hoja: 'h18', datos: {regla: id, caso: c.cliente}})))}</div></section>` +
        UI.bloque({titulo: 'Lo que pasará', i: 3, html: `<p class="c-espero">Cuando alguien pida una valoración, te dejo preparado el informe del piso al día siguiente. Tú lo miras y lo envías.</p>`});
    }
    if (r.estado === 'a-prueba') {
      if (id === 'r-cancelaciones') {
        const l = D().aPrueba;
        return UI.bloque({titulo: `Lo que te habría propuesto · ${l.length} veces en ${r.dia || 5} días`, i: 2,
          html: UI.lista(l.map(c => ({titulo: c.nombre, sub: `${c.cuando} · ${c.propone}`, av: c.id, hoja: 'h18', datos: {regla: id, caso: c.id}}))) +
            UI.nota({texto: 'No he enviado nada: lo estoy probando.', icono: 'candado', clase: 'nota-gris'})});
      }
      return UI.bloque({titulo: 'Lo que voy haciendo', i: 2, html: UI.vacio({titulo: 'Todavía nada', texto: 'Empieza hoy. Te enseño aquí lo que haría, sin enviarlo.', icono: 'probeta'}) +
        (r.casos && !r.casos.comoYo ? UI.lista([{titulo: `${r.casos.length} casos de tus chats en los que habría tocado`, icono: 'cal', hoja: 'h19', datos: {regla: id}}]) : '')}) + aQuien(id);
    }
    if (r.estado === 'activa') {
      const hoy = (r.casosHoy || []).map(x => 'Hoy · ' + x);
      const ult = hoy.concat(r.ultimo || []).slice(0, 4);
      return UI.bloque({titulo: 'Lo último', i: 2, html: ult.length ? UI.lista(ult.map((t, k) => ({titulo: t, icono: 'check', clase: k < hoy.length ? 'c-hoy' : ''})))
        : UI.vacio({titulo: 'Todavía nada', texto: 'Te lo prepararé en Hoy cuando toque.', icono: 'hoy'})});
    }
    if (r.estado === 'descartada') return UI.nota({texto: 'No te lo volveré a proponer. Si cambias de idea, toca «Deshacer».', icono: 'info', clase: 'nota-gris'});
    return '';
  }

  VETA.pantalla('A10', {
    guia: ['Aquí ves un trabajo y quién lo hace: tú o yo.', 'Tú miras los casos y decides si doy un paso más.', 'Así cada paso lo decides tú, con los casos delante.'],
    pinta: p => {
      if (p.id === 'r-visitas') return visitas();
      const r = M.regla(p.id);
      if (!r) return UI.vacio({titulo: 'Este trabajo ya no está', texto: 'Vuelve a «Los trabajos, uno a uno» para ver los que hay.', icono: 'info', boton: {texto: 'Ver los trabajos', ir: 'reglas'}});
      const info = C.info(p.id), e = C.estadoRegla(r), l = linea(p.id);
      const desc = r.estado === 'descartada';
      const top = l || desc
        ? UI.lineaHecho({texto: l ? l.texto : 'Ya no lo hago · no te lo volveré a proponer', hora: l ? r.hora : '', boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-regla', i: 0})
        : `<div class="c-regla-etq" data-i="0" data-vt="c-regla">${UI.etiqueta(e.etq, e.texto)}</div>`;
      const ex = C.excepciones(p.id).map(id => (M.quien(id) || {}).nombre || id);
      return (lineaPaso(p.id) || top) + cabeza(p.id, info.frase || '', desc) +
        (desc ? '' : C.quien(p.id, 1, '')) + casos(r, p.id) +
        (ex.length ? UI.bloque({titulo: 'Con estos clientes, no', i: 4, html: UI.lista(ex.map(n => ({titulo: n, icono: 'usuario', sub: 'Excepción tuya'})))}) : '');
    },
    titulo: 'Un trabajo',
    botonFijo: p => {
      if (p.id === 'r-visitas') return '';
      const r = M.regla(p.id); if (!r) return '';
      const otra = {texto: 'Otra cosa…', tipo: 'texto', hoja: 'h20', de: p.id};
      if (r.estado === 'propuesta' || r.estado === 'nueva') return UI.boton({texto: 'Pruébalo dos semanas', accion: 'prueba', g: 'Pruébalo dos semanas|Dos semanas en que te enseño lo que haría, sin enviar nada.'}) + UI.boton(otra);
      // a prueba: no se empuja a saltarse la prueba; «Activarla ya» queda en «Otra cosa…»
      if (r.estado === 'a-prueba') return UI.boton({texto: 'Volver a Veta', ir: 'veta'}) + UI.boton(otra);
      if (r.estado === 'activa') return UI.boton(otra);
      return '';
    },
    acciones: {
      prueba(ev, el, p) { C.cambiaRegla(p.id, 'a-prueba', `Lo estoy probando · ${C.fechaPrueba}`); },
      activar(ev, el, p) { C.cambiaRegla(p.id, 'activa', 'Ya lo hago yo · te lo dejaré en Hoy'); },
      deshacer(ev, el, p) { M.deshaz(p.id); C.pon('linea', null); VETA.repinta({hecho: 'c-regla'}); },
      subir(ev, el, p) { C.subir(p.id); },
      baja(ev, el, p) { C.bajar(p.id); },
      todos() { todos = true; VETA.repinta(); },
      distinto(ev, el) {
        const abre = el.getAttribute('aria-expanded') !== 'true';
        el.setAttribute('aria-expanded', abre); C.pon('distintoAbierto', abre);
        const caja = document.getElementById('c-distinto'); if (!caja) return;
        caja.hidden = !abre; if (abre) VETA.mov.cascada(caja);
      }
    }
  });

  // ---- A10b · Hasta dónde llega ----
  C.nivel = id => C.paso(id);
  C.ponNivel = (id, n) => { const x = C.lee('nivel', {}); x[id] = n; C.pon('nivel', x); };
  VETA.pantalla('A10b', {
    titulo: '¿Quién lo hace?',
    guia: ['Aquí ves quién hace este trabajo: tú o yo.', 'Tú decides si doy un paso más, con los casos delante.', 'Así el último paso sigue cerrado: nada se envía sin ti.'],
    pinta: p => {
      const n = C.nivel(p.id), nom = C.nombre(p.id);
      return lineaPaso(p.id) + `<p class="intro" data-i="0">${esc(nom)}: ahora es «${esc(D().niveles[n - 1].nombre)}».</p>` + C.quien(p.id, 1);
    },
    botonFijo: p => {
      const l = C.lee('nivelLinea', null); if (l && l.id === p.id) return '';
      if (p.id === 'r-visitas' || C.nivel(p.id) >= 3 || VETA.yo().papel !== 'direccion') return '';
      return UI.boton({texto: 'Que suba un paso para todo el equipo', hoja: 'h22', de: p.id});
    },
    acciones: {
      subir(ev, el, p) { C.subir(p.id); },
      baja(ev, el, p) { C.bajar(p.id); },
      deshacer(ev, el, p) { C.bajar(p.id); }
    }
  });
})();
