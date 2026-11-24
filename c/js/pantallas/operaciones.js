/* Veta demo · ronda 8 · pantallas · operaciones.js · carril D
   G17 · Operaciones · #/operaciones — raíz. Cinco filtros (vuelven los de la versión A; capacidad 8) y la lista:
   «Hay que mirarlas» · «Todas» · «Nadie las lleva» · «De Teresa» (mientras está de baja) · «Por persona» (una lista por persona).
   Cada fila: cara + nombre + una segunda línea. En «Hay que mirarlas» y «Nadie las lleva» no hay pastilla (todas lo serían):
   el motivo va en la segunda línea. En «Todas» y «Por persona», qué es y quién la lleva; pastilla roja solo si alguien espera
   respuesta («Nadie la lleva» va en la segunda línea: con tres o más pastillas dejan de ser la excepción); cómo va, en gris a la derecha.
   Aparte, la lista «Además»: «Cómo va la oficina hoy» (hoja d-hoy, con sus seis cifras; capacidad 14) y «Lo que entra».
   Cuentas: VETA.r7.cuentas(). */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7, UI = VETA.UI;
  let filtro = 'mirar';

  const minus = t => t.charAt(0).toLowerCase() + t.slice(1), mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
  const quien = o => !o.persona ? '' : o.lleva === VETA.yo().id ? 'la llevas tú' : o.persona.corto;
  // lo que pasa, sin repetir lo que ya dice el filtro
  const motivo = o => o.aviso ? o.aviso.texto.replace(/^No l[ao] lleva nadie · /, '').replace(/ · Teresa está de baja$/, '') : '';
  // cómo va, corto y en gris a la derecha (12 caracteres como mucho)
  const GRIS = {queja: 'Queja', papel: 'Falta papel', parada: 'Parada', espera: 'Esperando'};
  const comoVa = o => {
    const t = o.aviso && o.aviso.tipo;
    if (o.deBaja) return 'De baja';
    if (t === 'sin-contestar' || t === 'nadie' || !o.lleva) return null;
    return GRIS[t] || String(o.comoCorto || '').replace(/^Parada en /, '').replace(/ \(\d de 5\)$/, '') || null;
  };
  const espera = o => !!(o.mirar && o.aviso && o.aviso.tipo === 'sin-contestar');   // la única pastilla: alguien espera respuesta
  function fila(o, modo) {
    const f = {cara: o.id, nombre: o.nombre, ir: 'operacion/' + o.id};
    if (modo === 'mirar') f.pasa = mayus([quien(o), minus(o.aviso ? o.aviso.texto : o.texto).replace(/ · /g, ', ')].filter(Boolean).join(' · '));
    else if (modo === 'nadie') f.pasa = [o.texto, motivo(o)].filter(Boolean).join(' · ');
    else if (modo === 'teresa') f.pasa = [o.texto, minus(motivo(o))].filter(Boolean).join(' · ');
    else {
      f.pasa = modo === 'persona' ? o.texto : !o.lleva ? `${o.texto} · nadie la lleva` : `${o.texto} · ${quien(o)}`;
      if (espera(o)) f.pastilla = 'Sin contestar'; else f.dato = comoVa(o);
    }
    return f;
  }
  const vacia = () => UI.vacio({titulo: 'Ninguna.', texto: 'Ahora mismo no hay operaciones así.'});

  VETA.pantalla('G17', {
    titulo: 'Operaciones',
    pinta: () => {
      const todas = X.ops(), c = r7.cuentas();
      const nadie = todas.filter(o => !o.lleva), teresa = todas.filter(o => o.deBaja);
      if (filtro === 'teresa' && !teresa.length) filtro = 'mirar';
      let h = r7.filtros([
        {id: 'mirar', texto: 'Hay que mirarlas', cuenta: c.mirar}, {id: 'todas', texto: 'Todas', cuenta: c.operaciones},
        {id: 'nadie', texto: 'Nadie las lleva', cuenta: nadie.length}, teresa.length ? {id: 'teresa', texto: 'De Teresa', cuenta: teresa.length} : null,
        {id: 'persona', texto: 'Por persona'}], {valor: filtro, accion: 'filtro', etiqueta: 'Qué operaciones ver', i: 0});
      if (filtro === 'persona') {
        // una lista por persona, con su nombre de rótulo; primero las que no lleva nadie
        const grupos = {};
        todas.forEach(o => { const k = o.lleva || '_'; (grupos[k] = grupos[k] || []).push(o); });
        h += Object.keys(grupos).sort((a, b) => a === '_' ? -1 : b === '_' ? 1 : X.persona(a).nombre.localeCompare(X.persona(b).nombre, 'es')).map((k, n) => {
          const l = grupos[k], p = k === '_' ? null : X.persona(k);
          const rot = p ? p.nombre + (k === VETA.yo().id ? ' (tú)' : '') + (l.some(o => o.deBaja) ? ' · de baja' : '') : 'Nadie las lleva';
          return r7.lista(l.map(o => fila(o, k === '_' ? 'nadie' : 'persona')), {rotulo: rot + ' · ' + l.length, i: Math.min(4, n + 1)});
        }).join('');
      } else {
        const l = filtro === 'mirar' ? todas.filter(o => o.mirar) : filtro === 'nadie' ? nadie : filtro === 'teresa' ? teresa : todas;
        h += l.length ? r7.lista(l.map(o => fila(o, filtro)), {i: 1}) : vacia();
      }
      h += r7.lista([{nombre: 'Cómo va la oficina hoy', hoja: 'd-hoy'}, {nombre: 'Lo que entra', ir: 'entra'}], {rotulo: 'Además', i: 2});
      // las de Teresa son una sola decisión: pasar sus clientes
      if (filtro === 'teresa') h += r7.enlace({texto: 'Pasar sus clientes a otra persona', ir: 'reparto'});
      return h;
    },
    acciones: {
      filtro(ev, el) { filtro = el.dataset.valor; VETA.repinta(); }
    }
  });
})();
