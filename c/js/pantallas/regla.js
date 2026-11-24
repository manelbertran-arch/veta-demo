/* Veta demo · pantallas · regla.js · carril C (Veta y cuenta)
   - A10 · Un trabajo · #/regla/<id>   (una pantalla, cuatro estados: propuesta · a prueba · activa · descartada)
   - A10b · ¿Quién lo hace? · #/regla/<id>/nivel
   Arriba, una tarjeta: la pregunta de Veta (con el par «No, sigue igual» / «Sí» en el pie) o lo que hace ahora. Debajo, una lista
   de filas que abren otra cosa. Sus hojas (h18 un caso, h19 los casos iguales, h20 cambiar algo, h22 subir un paso, c-veces, c-lee)
   están en js/hojas/veta.js. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;
  const linea = id => { const l = C.lee('linea', null); const r = M.regla(id); return l && r && l.id === id && l.estado === r.estado ? l : null; };
  C.excepciones = id => C.lee('excepciones', {})[id] || [];
  C.ponExcepcion = (id, cliente) => { const e = C.lee('excepciones', {}); e[id] = (e[id] || []).filter(x => x !== cliente).concat(cliente ? [cliente] : []); C.pon('excepciones', e); };
  C.quitaExcepcion = (id, cliente) => { const e = C.lee('excepciones', {}); e[id] = (e[id] || []).filter(x => x !== cliente); C.pon('excepciones', e); };
  // cambia el estado de una regla y deja la línea en el sitio
  C.cambiaRegla = (id, estado, texto) => {
    M.marca(id, estado);
    C.pon('linea', {id, estado, texto});
    VETA.repinta({hecho: 'c-regla'});
  };

  // ---- «¿Quién lo hace?»: de «Lo haces tú» a «Lo hago yo», con la pregunta para subir un paso ----
  const NV = () => VETA.vivo.niveles();
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

  // ---- A10 · la pregunta de ahora (si hay que decidir algo): {de, antes: 'Lo he hecho 14 veces…', q: '¿Lo apunto yo…?', accion} ----
  const igual = id => !!(C.lee('igual', {}) || {})[id];
  const pregunta = (id, r) => {
    if (igual(id) || notaDe(id)) return null;
    const s = subeDe(id);
    if (s) return {de: id === 'r-visitas' ? 'Te lo propongo' : 'Un paso más', antes: s.hechas != null ? `Lo he hecho ${s.hechas} veces y me corregiste ${s.corregidas || 0}.` : '', q: s.pregunta, accion: 'subir'};
    if (r && (r.estado === 'propuesta' || r.estado === 'nueva')) return {de: 'Te lo propongo', antes: `Lo has hecho tú ${C.veces(r)} veces.`, q: '¿Lo pruebo yo dos semanas?', accion: 'prueba'};
    return null;
  };
  // sin pregunta: lo que hago ahora en este trabajo, en una frase
  const ahora = (id, r) => {
    const nota = notaDe(id); if (nota) return nota;
    if (r && r.estado === 'descartada') return 'Ya no lo hago. No te lo volveré a proponer.';
    if (r && r.estado === 'a-prueba') return `Lo estoy probando ${C.fechaPrueba}. No envío nada.`;
    if (id === 'r-visitas') return C.visitas().estado === 'propuesta' ? 'Lo haces tú.' : C.visitas().frase;
    if (r && (r.estado === 'propuesta' || r.estado === 'nueva')) return 'Lo haces tú.';
    return C.info(id).frase || (NV()[C.paso(id) - 1] || {}).texto || '';
  };
  const tarjeta = (id, r) => {
    const q = pregunta(id, r);
    return R7().tarjeta(q ? {veta: true, de: q.de, texto: (q.antes ? q.antes + ' ' : '') + q.q, vt: 'c-paso', i: 1} : {de: 'Ahora', texto: ahora(id, r), vt: 'c-paso', i: 1});
  };
  // lo que va debajo: cada fila abre otra cosa (una pantalla o una hoja)
  const abre = (que, id) => ({hoja: 'c-lee', datos: {que, regla: id}});
  function filas(id, r) {
    if (r && r.estado === 'descartada') return [];
    const f = [{nombre: '¿Quién lo hace?', dato: `Paso ${C.paso(id)} de 5`, ir: `regla/${id}/nivel`}];
    if (id === 'r-visitas') {
      f.push(Object.assign({nombre: `Las ${C.r6().visitas.hechas} veces que lo hiciste tú`}, abre('veces', id)));
      if (C.visitas().estado !== 'prueba') f.push(Object.assign({nombre: 'Lo que pasará'}, abre('pasara', id)));
      return f;
    }
    if (r.estado === 'propuesta' && r.casos && r.casos.distinto) {
      f.push({nombre: `Las ${C.veces(r)} veces que lo hiciste tú`, hoja: 'c-veces', datos: {regla: id}});
      f.push(Object.assign({nombre: 'Lo que pasará'}, abre('pasara', id)));
    } else if (r.estado === 'a-prueba') {
      if (id === 'r-cancelaciones') f.push({nombre: 'Lo que te habría propuesto', dato: D().aPrueba.length, hoja: 'c-veces', datos: {regla: id}});
      else if (r.casos && !r.casos.comoYo) f.push({nombre: 'Dónde habría tocado', dato: `${r.casos.length} casos`, hoja: 'h19', datos: {regla: id}});
      f.push(Object.assign({nombre: 'Quién lo ve', dato: C.lee('aOficina', {})[id] ? 'Montse' : 'Solo tú'}, abre('quien-ve', id)));
    } else if (r.estado === 'activa') {
      const n = C.ultimo(r).length;
      f.push(n ? Object.assign({nombre: 'Lo último que hice', dato: n}, abre('ultimo', id)) : {nombre: 'Lo último que hice', pasa: 'Todavía nada: te lo dejaré en Inicio'});
    }
    const ex = C.excepciones(id).map(c => (M.quien(c) || {}).nombre || c);
    if (ex.length) f.push({nombre: 'Con estos clientes, no', pasa: ex.join(', ')});
    f.push({nombre: 'Cambiar algo', hoja: 'h20', de: id});
    return f;
  }
  // lo último que hice en un trabajo (lo de hoy, primero)
  C.ultimo = r => (r.casosHoy || []).map(x => 'Hoy · ' + x).concat(r.ultimo || []).slice(0, 4);

  const reglaDe = p => (p.id === 'r-visitas' ? null : M.regla(p.id));
  const existe = p => p.id === 'r-visitas' || !!M.regla(p.id);
  VETA.pantalla('A10', {
    titulo: p => C.titulo(p.id),
    nota: p => (existe(p) && pregunta(p.id, reglaDe(p)) ? {texto: 'Nada sale sin ti.', candado: true} : ''),
    pinta: p => {
      const r = reglaDe(p);
      if (!existe(p)) return R7().lista([{nombre: 'Este trabajo ya no está', pasa: 'Mira los que hago', ir: 'veta'}]);
      const l = r ? linea(p.id) : null, desc = r && r.estado === 'descartada', ig = C.lee('igual', {})[p.id];
      const top = lineaPaso(p.id) || (l || desc ? UI.lineaHecho({texto: l ? l.texto : 'Ya no lo hago · no te lo volveré a proponer', hora: l ? r.hora : '', boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-regla', i: 0})
        : ig ? UI.lineaHecho({texto: 'Vale, sigue igual', hora: ig, boton: {texto: 'Deshacer', accion: 'pregunta'}, vt: 'c-regla', i: 0}) : '');
      const f = filas(p.id, r);
      return top + tarjeta(p.id, r) + (f.length ? R7().lista(f, {i: 2}) : '');
    },
    botonFijo: p => {
      if (!existe(p)) return '';
      const q = pregunta(p.id, reglaDe(p));
      return q ? R7().botones({texto: 'Sí', accion: q.accion}, {texto: 'No, sigue igual', accion: 'igual'}) : '';
    },
    acciones: {
      prueba(ev, el, p) { C.cambiaRegla(p.id, 'a-prueba', `Lo estoy probando · ${C.fechaPrueba}`); },
      deshacer(ev, el, p) { M.deshaz(p.id); C.pon('linea', null); VETA.repinta({hecho: 'c-regla'}); },
      subir(ev, el, p) { C.subir(p.id); VETA.pintaBarra(); },
      baja(ev, el, p) { C.bajar(p.id); VETA.pintaBarra(); },
      igual(ev, el, p) { const g = C.lee('igual', {}) || {}; g[p.id] = VETA.ahora(); C.pon('igual', g); VETA.repinta({hecho: 'c-regla'}); },
      pregunta(ev, el, p) { const g = C.lee('igual', {}) || {}; delete g[p.id]; C.pon('igual', g); VETA.repinta({hecho: 'c-regla'}); }
    }
  });

  // ---- A10b · ¿Quién lo hace?: los cinco pasos, con el de ahora marcado ----
  // El paso no se elige a dedo: Veta pregunta antes de dar uno más (con sus casos delante). Tocar el paso siguiente, cuando hay
  // pregunta pendiente, es decir que sí; tocar otro avisa de por qué no cambia. El último sigue cerrado: nada se envía sin ti.
  C.nivel = id => C.paso(id);
  C.ponNivel = (id, n) => { const x = C.lee('nivel', {}); x[id] = n; C.pon('nivel', x); };
  VETA.pantalla('A10b', {
    titulo: '¿Quién lo hace?',
    sub: 'De «lo haces tú» a «lo hago yo».',
    // como antes: los cinco en una línea, y solo el de ahora dice qué significa
    pinta: p => { const n = C.paso(p.id); return lineaPaso(p.id) + R7().elegir(NV().map(x => ({id: x.n, texto: x.nombre, sub: x.n === n ? x.texto : null})), {valor: n, accion: 'elige', etiqueta: '¿Quién lo hace?', i: 1}); },
    botonFijo: p => {
      const l = C.lee('nivelLinea', null); if (l && l.id === p.id) return '';
      if (p.id === 'r-visitas' || C.nivel(p.id) >= 3 || VETA.yo().papel !== 'direccion') return '';
      return R7().botones({texto: 'Subir un paso para todos', hoja: 'h22', de: p.id});
    },
    acciones: {
      elige(ev, el, p) {
        const n = Number(el.dataset.valor), ahoraN = C.paso(p.id); if (n === ahoraN) return;
        if (n === ahoraN + 1 && subeDe(p.id)) { C.subir(p.id); VETA.pintaBarra(); return; }
        VETA.repinta();
        VETA.aviso((NV()[n - 1] || {}).cerrado ? 'Todavía no. Nada se envía sin ti.' : 'El paso lo cambio cuando te lo pregunto y dices que sí.');
      },
      baja(ev, el, p) { C.bajar(p.id); VETA.pintaBarra(); },
      deshacer(ev, el, p) { C.bajar(p.id); VETA.pintaBarra(); }
    }
  });
})();
