/* Veta demo · ronda 8 · pantallas · operaciones.js · carril D
   G17 · Operaciones · #/operaciones — raíz. Cuatro filtros (vuelven los de la versión A; capacidad 8) y la lista:
   «Mirar hoy» · «Todas» · «Sin dueño» · «De baja» (las de Teresa, mientras está de baja). Se fue «Por persona» (25-nov-2026: nada por persona en dirección);
   en «Mirar hoy» ya no va el nombre de quien la lleva: el motivo y cuánto lleva así.
   Cada fila: cara + nombre + una segunda línea. En «Mirar hoy» y «Sin dueño» no hay pastilla (todas lo serían):
   el motivo va en la segunda línea. En «Todas», qué es y cómo va; pastilla roja solo si alguien espera
   respuesta («sin dueño» va en la segunda línea: con tres o más pastillas dejan de ser la excepción); cómo va, al final de la segunda línea
   (en un renglón, de 36 caracteres como mucho; quién la lleva está en la operación).
   Aparte, la lista «De la oficina»: «Cómo va la oficina hoy» (hoja d-hoy, con sus seis cifras; capacidad 14) y «Lo que entra».
   Cuentas: VETA.r7.cuentas(). */
(function () {
  'use strict';
  const X = VETA.dir, r7 = VETA.r7;
  let filtro = 'mirar';

  const minus = t => t.charAt(0).toLowerCase() + t.slice(1), mayus = t => t.charAt(0).toUpperCase() + t.slice(1);
  // lo que pasa, sin repetir lo que ya dice el filtro
  const motivo = o => o.aviso ? o.aviso.texto.replace(/^No l[ao] lleva nadie · /, '').replace(/ · quien la lleva está de baja$/, '').replace(/^escribió( el)? /, 'desde ') : '';
  // la hora exacta ya está en la operación; en la lista basta «desde ayer», y «queja del propietario» es «queja» (un renglón, D17)
  const corto = t => t.replace(/, \d{1,2}:\d\d$/, '').replace(/^Queja del propietario/, 'Queja');
  // cómo va, corto y en gris a la derecha (12 caracteres como mucho)
  const GRIS = {queja: 'Queja', papel: 'Sin papel', parada: 'Parada', espera: 'Esperando'};
  const comoVa = o => {
    const t = o.aviso && o.aviso.tipo;
    if (o.deBaja) return 'De baja';
    if (t === 'sin-contestar' || t === 'nadie' || !o.lleva) return null;
    return GRIS[t] || String(o.comoCorto || '').replace(/^Parada en /, '').replace(/ \(\d de 5\)$/, '') || null;
  };
  const espera = o => !!(o.mirar && o.aviso && o.aviso.tipo === 'sin-contestar');   // la única pastilla: alguien espera respuesta
  function fila(o, modo) {
    const f = {cara: o.id, nombre: o.nombre, ir: 'operacion/' + o.id};
    if (modo === 'mirar') f.pasa = mayus(minus(corto(o.aviso ? o.aviso.texto : o.texto)).replace(/ · /g, ', '));
    else if (modo === 'nadie') f.pasa = [o.texto, motivo(o)].filter(Boolean).join(' · ');
    else if (modo === 'teresa') f.pasa = [o.texto, minus(motivo(o)).replace(/^sin contestar .*/, 'sin contestar').replace(/^(\d+) días sin moverse$/, 'parada $1 días')].filter(Boolean).join(' · ');
    else {
      // el estado ya no va a la derecha (D17): cierra la segunda línea, en minúscula
      const est = espera(o) ? '' : minus(comoVa(o) || '');
      // «Venta en Sant Antoni · anuncio»: qué es y cómo va; quién la lleva está en la propia operación
      f.pasa = [o.texto, !o.lleva ? 'sin dueño' : '', est].filter(Boolean).join(' · ');
      if (espera(o)) f.pastilla = 'Sin contestar';
    }
    return f;
  }
  const vacia = () => r7.vacio('Ahora no hay ninguna.');

  VETA.pantalla('G17', {
    titulo: 'Operaciones',
    sub: 'Qué operaciones mirar hoy y cuáles no lleva nadie.',
    pinta: () => {
      const todas = X.ops(), c = r7.cuentas();
      const nadie = todas.filter(o => !o.lleva), teresa = todas.filter(o => o.deBaja);
      if (filtro === 'teresa' && !teresa.length) filtro = 'mirar';
      let h = r7.filtros([
        {id: 'mirar', texto: 'Mirar hoy', cuenta: c.mirar}, {id: 'todas', texto: 'Todas', cuenta: c.operaciones},
        {id: 'nadie', texto: 'Sin dueño', cuenta: nadie.length}, teresa.length ? {id: 'teresa', texto: 'De baja', cuenta: teresa.length} : null],
        {valor: filtro, accion: 'filtro', etiqueta: 'Qué operaciones ver', i: 0});
      const l = filtro === 'mirar' ? todas.filter(o => o.mirar) : filtro === 'nadie' ? nadie : filtro === 'teresa' ? teresa : todas;
      h += l.length ? r7.lista(l.map(o => fila(o, filtro)), {i: 1}) : vacia();
      h += r7.lista([{nombre: 'Cómo va la oficina hoy', hoja: 'd-hoy'}, {nombre: 'Lo que entra', ir: 'entra'}], {rotulo: 'De la oficina', i: 2});
      // las de Teresa son una sola decisión: pasar sus clientes
      if (filtro === 'teresa') h += r7.enlace({texto: 'Pasar sus clientes a otra persona', ir: 'reparto'});
      return h;
    },
    acciones: {
      filtro(ev, el) { filtro = el.dataset.valor; VETA.repinta(); }
    }
  });
})();
