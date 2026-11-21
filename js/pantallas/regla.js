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
    return `<div data-i="3">${UI.nota({texto: ofi ? `La propusiste a la oficina a las ${ofi}: Montse la ve con tu nombre.` : 'Esta prueba es solo tuya: Montse no la ve. Si la propones a la oficina, desde «Otra cosa…», Montse la verá con tu nombre.', icono: ofi ? 'equipo' : 'candado', clase: 'nota-gris'})}</div>`;
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

  function casos(r, id) {
    if (r.estado === 'propuesta' && r.casos && r.casos.distinto) {
      const n = r.casos.comoYo.length, m = r.casos.distinto.length, ex = C.excepciones(id);
      const abierto = C.lee('distintoAbierto', true);
      return `<section class="bloque" data-i="2"><h2 class="bloque-t">${n + m} casos desde ${esc(C.info(id).desde || 'agosto')}</h2>` +
        `<div class="c-partes" style="--a:${n};--b:${m}">` +
          `<button type="button" class="c-parte c-parte-a" data-hoja="h19" data-regla="${esc(id)}" data-g="11 como yo|Los casos en que hiciste lo mismo que haría Veta."><b>${n}</b><span>como yo ›</span></button>` +
          `<button type="button" class="c-parte c-parte-b" data-accion="distinto" aria-expanded="${abierto}" aria-controls="c-distinto"><b>${m}</b><span>distinto</span><i class="chev-gira">${VETA.ic('abajo', 16)}</i></button>` +
        `</div>` +
        `<div id="c-distinto" class="c-distinto"${abierto ? '' : ' hidden'}>${UI.lista(r.casos.distinto.map(c => ({
          titulo: c.nombre, sub: `${c.cuando} · ${(D().distinto[c.cliente] || {}).motivo || ''}${ex.includes(c.cliente) ? ' · con él, no' : ''}`,
          av: c.cliente, hoja: 'h18', datos: {regla: id, caso: c.cliente}})))}</div></section>` +
        UI.bloque({titulo: 'Lo que espero que pase', i: 3, html: `<p class="c-espero">Habría actuado ${n + m} veces. En ${n} habrías enviado lo mismo. Ningún mensaje habría salido solo.</p>`});
    }
    if (r.estado === 'a-prueba') {
      if (id === 'r-cancelaciones') {
        const l = D().aPrueba;
        return UI.bloque({titulo: `Lo que habría hecho · ${l.length} casos en ${r.dia || 5} días`, i: 2,
          html: UI.lista(l.map(c => ({titulo: c.nombre, sub: `${c.cuando} · ${c.propone}`, av: c.id, hoja: 'h18', datos: {regla: id, caso: c.id}}))) +
            UI.nota({texto: 'No he enviado nada: la regla está a prueba.', icono: 'candado', clase: 'nota-gris'})});
      }
      return UI.bloque({titulo: 'Lo que habría hecho', i: 2, html: UI.vacio({titulo: 'Todavía nada', texto: 'Empieza hoy. Te enseño aquí lo que haría, sin enviarlo.', icono: 'probeta'}) +
        (r.casos && !r.casos.comoYo ? UI.lista([{titulo: `Lo habría hecho ${r.casos.length} veces desde septiembre`, icono: 'cal', hoja: 'h19', datos: {regla: id}}]) : '')}) + aQuien(id);
    }
    if (r.estado === 'activa') {
      const hoy = (r.casosHoy || []).map(x => 'Hoy · ' + x);
      const ult = hoy.concat(r.ultimo || []).slice(0, 4);
      return UI.bloque({titulo: 'Lo último', i: 2, html: ult.length ? UI.lista(ult.map((t, k) => ({titulo: t, icono: 'check', clase: k < hoy.length ? 'c-hoy' : ''})))
        : UI.vacio({titulo: 'Todavía nada', texto: 'Te lo prepararé en Hoy cuando toque.', icono: 'hoy'})});
    }
    if (r.estado === 'descartada') return UI.nota({texto: 'No la volveré a proponer. Si cambias de idea, toca «Deshacer».', icono: 'info', clase: 'nota-gris'});
    return '';
  }

  VETA.pantalla('A10', {
    titulo: p => C.info(p.id).nombre,
    guia: ['Aquí Veta te enseña una cosa que quiere hacer, con los casos en que la habría hecho.', 'Tú miras los casos y decides: probarla, activarla o dejarla.', 'Así nunca actúa sin que lo hayas probado antes.'],
    pinta: p => {
      const r = M.regla(p.id);
      if (!r) return UI.vacio({titulo: 'Esta regla ya no existe', texto: 'Vuelve a «Lo que hago por ti» para ver las que hay.', icono: 'info', boton: {texto: 'Lo que hago por ti', ir: 'reglas'}});
      const info = C.info(p.id), e = C.estadoRegla(r), l = linea(p.id);
      const desc = r.estado === 'descartada';
      const top = l || desc
        ? UI.lineaHecho({texto: l ? l.texto : 'Descartada · no volveré a proponerla', hora: l ? r.hora : '', boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-regla', i: 0})
        : `<div class="c-regla-etq" data-i="0" data-vt="c-regla">${UI.etiqueta(e.etq, e.texto)}</div>`;
      const ex = C.excepciones(p.id).map(id => (M.quien(id) || {}).nombre || id);
      return top + `<p class="c-frase c-frase-g${desc ? ' c-apagada' : ''}" data-i="1">${esc(info.frase || r.texto)}</p>` + casos(r, p.id) +
        (ex.length ? UI.bloque({titulo: 'Con estos clientes, no', i: 4, html: UI.lista(ex.map(n => ({titulo: n, icono: 'usuario', sub: 'Excepción tuya'})))}) : '');
    },
    botonFijo: p => {
      const r = M.regla(p.id); if (!r) return '';
      const otra = {texto: 'Otra cosa…', tipo: 'texto', hoja: 'h20', de: p.id};
      if (r.estado === 'propuesta' || r.estado === 'nueva') return UI.boton({texto: 'Ponerla a prueba', accion: 'prueba', g: 'Ponerla a prueba|Dos semanas en que te enseño lo que haría, sin enviar nada.'}) + UI.boton(otra);
      // a prueba: no se empuja a saltarse la prueba; «Activarla ya» queda en «Otra cosa…»
      if (r.estado === 'a-prueba') return UI.boton({texto: 'Volver a Veta', ir: 'veta'}) + UI.boton(otra);
      if (r.estado === 'activa') return UI.boton(otra);
      return '';
    },
    acciones: {
      prueba(ev, el, p) { C.cambiaRegla(p.id, 'a-prueba', `A prueba · ${C.fechaPrueba}`); },
      activar(ev, el, p) { C.cambiaRegla(p.id, 'activa', 'Activa · Te lo prepararé en Hoy'); },
      deshacer(ev, el, p) { M.deshaz(p.id); C.pon('linea', null); VETA.repinta({hecho: 'c-regla'}); },
      distinto(ev, el) {
        const abre = el.getAttribute('aria-expanded') !== 'true';
        el.setAttribute('aria-expanded', abre); C.pon('distintoAbierto', abre);
        const caja = document.getElementById('c-distinto'); if (!caja) return;
        caja.hidden = !abre; if (abre) VETA.mov.cascada(caja);
      }
    }
  });

  // ---- A10b · Hasta dónde llega ----
  C.nivel = id => C.lee('nivel', {})[id] || 2;
  C.ponNivel = (id, n) => { const x = C.lee('nivel', {}); x[id] = n; C.pon('nivel', x); };
  VETA.pantalla('A10b', {
    titulo: 'Hasta dónde llega',
    guia: ['Aquí ves cuánto le dejas hacer a Veta con esta regla.', 'Tú puedes pedir que suba un nivel; lo sube dirección.', 'Así el último nivel sigue cerrado: ningún mensaje sale solo.'],
    pinta: p => {
      const n = C.nivel(p.id), l = C.lee('nivelLinea', null);
      const top = l && l.id === p.id ? UI.lineaHecho({texto: l.texto, hora: l.hora, boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-nivel', i: 0}) : '';
      return top + `<p class="intro" data-i="0">${esc(C.info(p.id).nombre)}: ahora está en «${esc(D().niveles[n - 1].nombre)}».</p>` +
        `<ol class="c-niveles" data-i="1">${D().niveles.map(x => `<li class="c-nivel${x.n === n ? ' on' : ''}${x.n < n ? ' pasado' : ''}${x.cerrado ? ' cerrado' : ''}"${x.n === n ? ' aria-current="step"' : ''}>` +
          `<span class="c-nivel-n" aria-hidden="true">${x.cerrado ? VETA.ic('candado', 16) : x.n}</span>` +
          `<span class="c-nivel-c"><b>${esc(x.nombre)}</b><span>${esc(x.texto)}</span>${x.n === n ? UI.etiqueta('tuya', 'Ahora') : ''}</span></li>`).join('')}</ol>` +
        `<p class="c-apoyo" data-i="2">Lo he hecho 14 veces y me has corregido 1.</p>`;
    },
    botonFijo: p => {
      const l = C.lee('nivelLinea', null); if (l && l.id === p.id) return '';
      if (C.nivel(p.id) >= 3) return '';
      const dir = VETA.yo().papel === 'direccion';
      return (dir ? UI.boton({texto: 'Subir a «Hace lo de dentro»', hoja: 'h22', de: p.id}) : UI.boton({texto: 'Pedir a dirección que suba un nivel', accion: 'pedir'})) +
        UI.boton({tipo: 'texto', texto: 'Todavía no', accion: 'todavia'});
    },
    acciones: {
      pedir(ev, el, p) { C.pon('nivelLinea', {id: p.id, texto: 'Pedido a dirección: subir a «Hace lo de dentro»', hora: VETA.ahora()}); VETA.repinta({hecho: 'c-nivel'}); },
      todavia(ev, el, p) { C.pon('nivelLinea', {id: p.id, texto: 'No volveré a preguntar hasta que haya más casos', hora: ''}); VETA.repinta({hecho: 'c-nivel'}); },
      deshacer(ev, el, p) {
        const l = C.lee('nivelLinea', null);
        if (l && l.subido) C.ponNivel(p.id, l.subido);
        C.pon('nivelLinea', null); VETA.repinta({hecho: 'c-nivel'});
      }
    }
  });
})();
