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

  // ---- ronda 7 · los cinco pasos en filas de una línea; solo el de ahora, abierto, con lo que pregunto (el botón, abajo) ----
  const R7 = () => VETA.r7;
  // lo que digo bajo el paso de ahora: la nota de lo que acabas de decidir, o la pregunta para dar un paso más
  const pide = (id, r) => {
    const nota = notaDe(id); if (nota) return {t: nota};
    const s = subeDe(id);
    if (s) return {t: (s.hechas != null ? `Lo he hecho ${s.hechas} veces y me corregiste ${s.corregidas || 0}. ` : '') + s.pregunta, oro: true};
    if (r && (r.estado === 'propuesta' || r.estado === 'nueva')) return {t: `Lo has hecho tú ${(r.casos && r.casos.comoYo) ? r.casos.comoYo.length + (r.casos.distinto || []).length : 14} veces. ¿Lo pruebo dos semanas?`, oro: true};
    if (r && r.estado === 'a-prueba') return {t: `Lo estoy probando ${C.fechaPrueba}. No envío nada.`};
    return null;
  };
  C.pasos = (id, r, o) => {
    const n = C.paso(id), p = o && o.sinPide ? null : pide(id, r);
    return `<div class="r7-lista r7c-escalera" data-i="1" data-vt="c-paso">` + VETA.vivo.niveles().map(x => {
      const est = x.cerrado ? 'cerrado' : x.n === n ? 'aqui' : x.n < n ? 'hecho' : 'falta';
      const ic = x.cerrado ? VETA.ic('candado', 18) : x.n < n ? VETA.ic('check', 18) : String(x.n);
      let c = `<span class="r7-fila-1"><span class="r7-fila-n">${esc(x.nombre)}</span>${est === 'aqui' ? R7().pastilla('Ahora', 'gris') : ''}</span>`;
      if (est === 'aqui') c += `<span class="r7c-ahora">${esc(x.texto)}</span>` + (p ? `<span class="r7c-pide${p.oro ? ' r7c-oro' : ''}">${esc(p.t)}</span>` : '');
      return `<div class="r7-fila r7-fila-quieta r7c-paso r7c-${est}"><span class="r7-fila-ic" aria-hidden="true">${ic}</span><span class="r7-fila-c">${c}</span></div>`;
    }).join('') + '</div>';
  };
  // una línea por caso, dentro de una fila que se abre
  const caso = (nombre, sub, o) => `<${o ? 'button type="button"' : 'div'} class="r7c-caso"${o ? UI.attrs(o) : ''}><span><b>${esc(nombre)}</b> · ${esc(sub)}</span>${o ? VETA.ic('chev', 16) : ''}</${o ? 'button' : 'div'}>`;
  const casosVis = () => C.r6().visitas.casos.map(c => caso(c.nombre, c.distinto ? c.distinto : c.cuando)).join('');

  // lo que va detrás de una fila, debajo de los pasos: los casos, lo que pasará, las excepciones y quién lo ve
  function detras(id, r) {
    const f = [];
    if (id === 'r-visitas') {
      const v = C.visitas(), d = C.r6().visitas;
      f.push({icono: 'usuario', nombre: `Las ${d.hechas} veces que lo hiciste tú`, abre: casosVis()});
      if (v.estado !== 'prueba') f.push({icono: 'cal', nombre: 'Lo que pasará', abre: `<p>${esc(v.manana)}</p>`});
      f.push({icono: 'candado', nombre: 'Nada sale sin ti'});
      return f;
    }
    if (r.estado === 'propuesta' && r.casos && r.casos.distinto) {
      const n = r.casos.comoYo.length, ex = C.excepciones(id);
      // FC (defecto 6): las veces igual y las distintas, en una sola fila (así nada queda debajo de los botones)
      f.push({icono: 'usuario', nombre: `Las ${n + r.casos.distinto.length} veces que lo hiciste tú`, pasa: `${n} igual y ${r.casos.distinto.length} distinto`, abre:
        caso(`${n} veces lo hiciste igual`, 'míralas', {hoja: 'h19', datos: {regla: id}}) +
        r.casos.distinto.map(c => caso(c.nombre, ((D().distinto[c.cliente] || {}).motivo || c.cuando) + (ex.includes(c.cliente) ? ' · con él, no' : ''), {hoja: 'h18', datos: {regla: id, caso: c.cliente}})).join('')});
      f.push({icono: 'cal', nombre: 'Lo que pasará', abre: '<p>Cuando alguien pida una valoración, te dejo preparado el informe del piso al día siguiente. Tú lo miras y lo envías.</p>'});
    } else if (r.estado === 'a-prueba') {
      if (id === 'r-cancelaciones') {
        const l = D().aPrueba;
        f.push({icono: 'probeta', nombre: 'Lo que te habría propuesto', pasa: `${l.length} veces en ${r.dia || 5} días`, numero: l.length,
          abre: l.map(c => caso(c.nombre, c.cuando, {hoja: 'h18', datos: {regla: id, caso: c.id}})).join('')});
      } else if (r.casos && !r.casos.comoYo) f.push({icono: 'cal', nombre: 'Dónde habría tocado', pasa: `${r.casos.length} casos de tus chats`, hoja: 'h19', datos: {regla: id}});
      const ofi = C.lee('aOficina', {})[id];
      f.push({icono: ofi ? 'equipo' : 'candado', nombre: 'Quién lo ve', pasa: ofi ? 'Montse, con tu nombre' : 'Solo tú', abre: `<p>${ofi ? `Se lo propusiste a la oficina a las ${esc(ofi)}: Montse lo ve con tu nombre.` : 'Esta prueba es solo tuya: Montse no la ve. Si se lo propones a la oficina, desde «Cambiar algo», Montse lo verá con tu nombre.'}</p>`});
    } else if (r.estado === 'activa') {
      const hoy = (r.casosHoy || []).map(x => 'Hoy · ' + x), ult = hoy.concat(r.ultimo || []).slice(0, 4);
      f.push(ult.length ? {icono: 'check', nombre: 'Lo último que hice', pasa: ult[0], numero: ult.length, abre: ult.map(t => `<p>${esc(t)}</p>`).join('')}
        : {icono: 'hoy', nombre: 'Lo último que hice', pasa: 'Todavía nada: te lo dejaré en Te toca a ti'});
    } else if (r.estado === 'descartada') f.push({icono: 'info', nombre: 'No te lo volveré a proponer', pasa: 'Si cambias de idea, toca «Deshacer»'});
    const ex = C.excepciones(id).map(c => (M.quien(c) || {}).nombre || c);
    if (ex.length) f.push({icono: 'usuario', nombre: 'Con estos clientes, no', pasa: ex.join(', '), numero: ex.length});
    return f;
  }

  // ---- ronda 7 · arreglos (FC, defecto 6): arriba solo «Ahora: …» y, si la hay, una pregunta con «Sí» / «No, sigue igual».
  // Los cinco pasos, detrás de la fila «Ver todos los pasos»; «Cambiar algo», otra fila. Nada queda debajo de los botones.
  const igual = id => !!(C.lee('igual', {}) || {})[id];
  // la pregunta de ahora (si hay que decidir algo): {antes: 'Lo he hecho 14 veces…', q: '¿Lo apunto yo…?', accion}
  const pregunta = (id, r) => {
    if (igual(id) || notaDe(id)) return null;
    const s = subeDe(id);
    if (s) return {antes: s.hechas != null ? `Lo he hecho ${s.hechas} veces y me corregiste ${s.corregidas || 0}.` : '', q: s.pregunta, accion: 'subir'};
    if (r && (r.estado === 'propuesta' || r.estado === 'nueva')) return {antes: `Lo has hecho tú ${(r.casos && r.casos.comoYo) ? r.casos.comoYo.length + (r.casos.distinto || []).length : 14} veces.`, q: '¿Lo pruebo yo dos semanas?', accion: 'prueba'};
    return null;
  };
  // dónde está, en una línea
  const ahora = (id, r) => {
    if (r && r.estado === 'descartada') return 'ya no lo hago';
    if (r && r.estado === 'a-prueba') return `lo estoy probando ${C.fechaPrueba}`;
    if (id === 'r-visitas' && C.visitas().estado === 'prueba') return 'lo estoy probando desde hoy';
    if (r && (r.estado === 'propuesta' || r.estado === 'nueva')) return 'lo haces tú';
    if (id === 'r-visitas' && C.visitas().estado === 'propuesta') return 'lo haces tú';
    const n = VETA.vivo.niveles()[C.paso(id) - 1] || {}; return (n.nombre || '').toLowerCase();
  };
  const ficha = (id, r) => {
    const q = pregunta(id, r), nota = notaDe(id);
    return `<div class="r7-ficha r7c-donde${q ? ' r7-oro' : ''}" data-i="1" data-vt="c-paso"><p class="r7c-donde-l">Ahora: <b>${esc(ahora(id, r))}</b></p>` +
      (q ? `${q.antes ? `<p class="r7c-donde-a">${esc(q.antes)}</p>` : ''}<p class="r7c-donde-q">${esc(q.q)}</p>` : nota ? `<p class="r7c-donde-a">${esc(nota)}</p>` : '') + '</div>';
  };
  VETA.pantalla('A10', {
    titulo: p => C.corto(p.id),
    frase: 'Mira cómo lo hago ahora y dime si doy un paso más.',
    pinta: p => {
      const r = p.id === 'r-visitas' ? null : M.regla(p.id);
      if (p.id !== 'r-visitas' && !r) return R7().lista([{icono: 'info', nombre: 'Este trabajo ya no está', pasa: 'Mira los que hago', ir: 'reglas'}]);
      const l = r ? linea(p.id) : null, desc = r && r.estado === 'descartada', ig = C.lee('igual', {})[p.id];
      const top = lineaPaso(p.id) || (l || desc ? UI.lineaHecho({texto: l ? l.texto : 'Ya no lo hago · no te lo volveré a proponer', hora: l ? r.hora : '', boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-regla', i: 0})
        : ig ? UI.lineaHecho({texto: 'Vale, sigue igual', hora: ig, boton: {texto: 'Deshacer', accion: 'pregunta'}, vt: 'c-regla', i: 0}) : '');
      const n = C.paso(p.id);
      const filas = (desc ? [] : [{icono: 'escalera', nombre: 'Ver todos los pasos', pasa: `Estás en el paso ${n} de 5`, abre: C.pasos(p.id, r, {sinPide: true})}])
        .concat(detras(p.id, r))
        .concat(r && !desc ? [{icono: 'editar', nombre: 'Cambiar algo', pasa: 'Una excepción, otra forma o dejarlo', hoja: 'h20', de: p.id}] : []);
      return top + (desc ? '' : ficha(p.id, r)) + R7().lista(filas, {i: 2, clase: 'r7c-tras'});
    },
    botonFijo: p => {
      const r = p.id === 'r-visitas' ? null : M.regla(p.id);
      if (p.id !== 'r-visitas' && !r) return '';
      const q = pregunta(p.id, r);
      return q ? R7().botones({texto: 'Sí', accion: q.accion}, [{texto: 'No, sigue igual', accion: 'igual'}]) : '';
    },
    acciones: {
      prueba(ev, el, p) { C.cambiaRegla(p.id, 'a-prueba', `Lo estoy probando · ${C.fechaPrueba}`); },
      activar(ev, el, p) { C.cambiaRegla(p.id, 'activa', 'Ya lo hago yo · te lo dejaré en Te toca a ti'); },
      deshacer(ev, el, p) { M.deshaz(p.id); C.pon('linea', null); VETA.repinta({hecho: 'c-regla'}); },
      subir(ev, el, p) { C.subir(p.id); VETA.pintaBarra(); },
      baja(ev, el, p) { C.bajar(p.id); VETA.pintaBarra(); },
      igual(ev, el, p) { const g = C.lee('igual', {}) || {}; g[p.id] = VETA.ahora(); C.pon('igual', g); VETA.repinta({hecho: 'c-regla'}); },
      pregunta(ev, el, p) { const g = C.lee('igual', {}) || {}; delete g[p.id]; C.pon('igual', g); VETA.repinta({hecho: 'c-regla'}); }
    }
  });

  // ---- A10b · ¿Quién lo hace? (los mismos pasos, sin lo de debajo) ----
  C.nivel = id => C.paso(id);
  C.ponNivel = (id, n) => { const x = C.lee('nivel', {}); x[id] = n; C.pon('nivel', x); };
  VETA.pantalla('A10b', {
    titulo: '¿Quién lo hace?',
    frase: p => `${C.corto(p.id)}: de «lo haces tú» a «lo hago yo».`,
    pinta: p => lineaPaso(p.id) + C.pasos(p.id, p.id === 'r-visitas' ? null : M.regla(p.id)),
    botonFijo: p => {
      const l = C.lee('nivelLinea', null); if (l && l.id === p.id) return '';
      const s = subeDe(p.id); if (s) return R7().botones({texto: s.boton, accion: 'subir'});
      if (p.id === 'r-visitas' || C.nivel(p.id) >= 3 || VETA.yo().papel !== 'direccion') return '';
      return R7().botones({texto: 'Que suba un paso para todo el equipo', hoja: 'h22', de: p.id});
    },
    acciones: {
      subir(ev, el, p) { C.subir(p.id); VETA.pintaBarra(); },
      baja(ev, el, p) { C.bajar(p.id); VETA.pintaBarra(); },
      deshacer(ev, el, p) { C.bajar(p.id); VETA.pintaBarra(); }
    }
  });
})();
