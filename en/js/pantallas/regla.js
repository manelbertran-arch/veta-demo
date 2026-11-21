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
    return `<div data-i="3">${UI.nota({texto: ofi ? `You proposed it to the office at ${ofi}: Montse sees it with your name.` : 'This trial is only yours: Montse doesn\'t see it. If you propose it to the office, from “Something else…”, Montse will see it with your name.', icono: ofi ? 'equipo' : 'candado', clase: 'nota-gris'})}</div>`;
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
      return `<section class="bloque" data-i="2"><h2 class="bloque-t">${n + m} cases since ${esc(C.info(id).desde || 'agosto')}</h2>` +
        `<div class="c-partes" style="--a:${n};--b:${m}">` +
          `<button type="button" class="c-parte c-parte-a" data-hoja="h19" data-regla="${esc(id)}" data-g="11 like me|The cases where you did the same as Veta would."><b>${n}</b><span>like me ›</span></button>` +
          `<button type="button" class="c-parte c-parte-b" data-accion="distinto" aria-expanded="${abierto}" aria-controls="c-distinto"><b>${m}</b><span>different</span><i class="chev-gira">${VETA.ic('abajo', 16)}</i></button>` +
        `</div>` +
        `<div id="c-distinto" class="c-distinto"${abierto ? '' : ' hidden'}>${UI.lista(r.casos.distinto.map(c => ({
          titulo: c.nombre, sub: `${c.cuando} · ${(D().distinto[c.cliente] || {}).motivo || ''}${ex.includes(c.cliente) ? ' · not with him' : ''}`,
          av: c.cliente, hoja: 'h18', datos: {regla: id, caso: c.cliente}})))}</div></section>` +
        UI.bloque({titulo: 'What I expect to happen', i: 3, html: `<p class="c-espero">I would have acted ${n + m} times. In ${n} you would have sent the same. No message would have gone out on its own.</p>`});
    }
    if (r.estado === 'a-prueba') {
      if (id === 'r-cancelaciones') {
        const l = D().aPrueba;
        return UI.bloque({titulo: `What I would have done · ${l.length} cases in ${r.dia || 5} days`, i: 2,
          html: UI.lista(l.map(c => ({titulo: c.nombre, sub: `${c.cuando} · ${c.propone}`, av: c.id, hoja: 'h18', datos: {regla: id, caso: c.id}}))) +
            UI.nota({texto: 'I haven\'t sent anything: the rule is on trial.', icono: 'candado', clase: 'nota-gris'})});
      }
      return UI.bloque({titulo: 'What I would have done', i: 2, html: UI.vacio({titulo: 'Nothing yet', texto: 'It starts today. I\'ll show you here what I\'d do, without sending it.', icono: 'probeta'}) +
        (r.casos && !r.casos.comoYo ? UI.lista([{titulo: `I would have done it ${r.casos.length} times since September`, icono: 'cal', hoja: 'h19', datos: {regla: id}}]) : '')}) + aQuien(id);
    }
    if (r.estado === 'activa') {
      const hoy = (r.casosHoy || []).map(x => 'Today · ' + x);
      const ult = hoy.concat(r.ultimo || []).slice(0, 4);
      return UI.bloque({titulo: 'Latest', i: 2, html: ult.length ? UI.lista(ult.map((t, k) => ({titulo: t, icono: 'check', clase: k < hoy.length ? 'c-hoy' : ''})))
        : UI.vacio({titulo: 'Nothing yet', texto: 'I\'ll prepare it for you in Today when it\'s time.', icono: 'hoy'})});
    }
    if (r.estado === 'descartada') return UI.nota({texto: 'I won\'t propose it again. If you change your mind, tap “Undo”.', icono: 'info', clase: 'nota-gris'});
    return '';
  }

  VETA.pantalla('A10', {
    titulo: p => C.info(p.id).nombre,
    guia: ['Here Veta shows you something it wants to do, with the cases where it would have done it.', 'You look at the cases and decide: try it, turn it on or drop it.', 'That way it never acts without you having tried it first.'],
    pinta: p => {
      const r = M.regla(p.id);
      if (!r) return UI.vacio({titulo: 'This rule no longer exists', texto: 'Go back to “What I do for you” to see the ones there are.', icono: 'info', boton: {texto: 'What I do for you', ir: 'reglas'}});
      const info = C.info(p.id), e = C.estadoRegla(r), l = linea(p.id);
      const desc = r.estado === 'descartada';
      const top = l || desc
        ? UI.lineaHecho({texto: l ? l.texto : 'Dismissed · I won\'t propose it again', hora: l ? r.hora : '', boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-regla', i: 0})
        : `<div class="c-regla-etq" data-i="0" data-vt="c-regla">${UI.etiqueta(e.etq, e.texto)}</div>`;
      const ex = C.excepciones(p.id).map(id => (M.quien(id) || {}).nombre || id);
      return top + `<p class="c-frase c-frase-g${desc ? ' c-apagada' : ''}" data-i="1">${esc(info.frase || r.texto)}</p>` + casos(r, p.id) +
        (ex.length ? UI.bloque({titulo: 'Not with these clients', i: 4, html: UI.lista(ex.map(n => ({titulo: n, icono: 'usuario', sub: 'Your exception'})))}) : '');
    },
    botonFijo: p => {
      const r = M.regla(p.id); if (!r) return '';
      const otra = {texto: 'Something else…', tipo: 'texto', hoja: 'h20', de: p.id};
      if (r.estado === 'propuesta' || r.estado === 'nueva') return UI.boton({texto: 'Put it on trial', accion: 'prueba', g: 'Put it on trial|Two weeks in which I show you what I\'d do, without sending anything.'}) + UI.boton(otra);
      // a prueba: no se empuja a saltarse la prueba; «Activarla ya» queda en «Otra cosa…»
      if (r.estado === 'a-prueba') return UI.boton({texto: 'Back to Veta', ir: 'veta'}) + UI.boton(otra);
      if (r.estado === 'activa') return UI.boton(otra);
      return '';
    },
    acciones: {
      prueba(ev, el, p) { C.cambiaRegla(p.id, 'a-prueba', `On trial · ${C.fechaPrueba}`); },
      activar(ev, el, p) { C.cambiaRegla(p.id, 'activa', 'Active · I\'ll prepare it for you in Today'); },
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
    titulo: 'How far it goes',
    guia: ['Here you see how much you let Veta do with this rule.', 'You can ask for it to go up one level; management raises it.', 'That way the last level stays closed: no message goes out on its own.'],
    pinta: p => {
      const n = C.nivel(p.id), l = C.lee('nivelLinea', null);
      const top = l && l.id === p.id ? UI.lineaHecho({texto: l.texto, hora: l.hora, boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-nivel', i: 0}) : '';
      return top + `<p class="intro" data-i="0">${esc(C.info(p.id).nombre)}: it's now at “${esc(D().niveles[n - 1].nombre)}”.</p>` +
        `<ol class="c-niveles" data-i="1">${D().niveles.map(x => `<li class="c-nivel${x.n === n ? ' on' : ''}${x.n < n ? ' pasado' : ''}${x.cerrado ? ' cerrado' : ''}"${x.n === n ? ' aria-current="step"' : ''}>` +
          `<span class="c-nivel-n" aria-hidden="true">${x.cerrado ? VETA.ic('candado', 16) : x.n}</span>` +
          `<span class="c-nivel-c"><b>${esc(x.nombre)}</b><span>${esc(x.texto)}</span>${x.n === n ? UI.etiqueta('tuya', 'Now') : ''}</span></li>`).join('')}</ol>` +
        `<p class="c-apoyo" data-i="2">I've done it 14 times and you've corrected me once.</p>`;
    },
    botonFijo: p => {
      const l = C.lee('nivelLinea', null); if (l && l.id === p.id) return '';
      if (C.nivel(p.id) >= 3) return '';
      const dir = VETA.yo().papel === 'direccion';
      return (dir ? UI.boton({texto: 'Raise to “Does the internal stuff”', hoja: 'h22', de: p.id}) : UI.boton({texto: 'Ask management to raise one level', accion: 'pedir'})) +
        UI.boton({tipo: 'texto', texto: 'Not yet', accion: 'todavia'});
    },
    acciones: {
      pedir(ev, el, p) { C.pon('nivelLinea', {id: p.id, texto: 'Asked management: raise to “Does the internal stuff”', hora: VETA.ahora()}); VETA.repinta({hecho: 'c-nivel'}); },
      todavia(ev, el, p) { C.pon('nivelLinea', {id: p.id, texto: 'I won\'t ask again until there are more cases', hora: ''}); VETA.repinta({hecho: 'c-nivel'}); },
      deshacer(ev, el, p) {
        const l = C.lee('nivelLinea', null);
        if (l && l.subido) C.ponNivel(p.id, l.subido);
        C.pon('nivelLinea', null); VETA.repinta({hecho: 'c-nivel'});
      }
    }
  });
})();
