/* Veta demo · tanda V · pantallas · operaciones-mias.js
   S2 · Operaciones de la AGENTE · #/operaciones con la cuenta de agente (la de dirección es G17, operaciones.js, con la misma ruta: rutas.js elige
   por perfil con `soloPapel`). Maqueta C3: cada operación, una línea de cinco pasos (hechos en negro, el actual en dorado, los que faltan vacíos), la más
   cerca de la firma primero y la cerrada, al final y discontinua. Datos: `operacion` de las fichas de sus clientes (tipo, fase), los nombres de los pasos
   de D.pasos (los mismos de operacion.js) y `siguiente.texto`. Solo las suyas (lleva = quien mira, en su cartera). Sin euros. Tocar una lleva a su ficha. */
(function () {
  'use strict';
  const lista = q => {
    const D = VETA.datos;
    return Object.values(D.clientes).filter(c => c.lleva === q && c.cartera !== false && c.operacion && c.operacion.tipo && c.operacion.fase)
      .map((c, i) => ({c, i, cerrada: c.estado === 'cerrado'}))
      .sort((a, b) => (a.cerrada - b.cerrada) || (b.c.operacion.fase - a.c.operacion.fase) || (a.i - b.i));
  };
  VETA.operacionesMiasContenido = () => {
    const D = VETA.datos, l = lista(VETA.yo().id);
    if (!l.length) return '<p class="v-vacio">Ahora no llevas ninguna operación.</p>';
    return '<div class="v-ops">' + l.map(x => {
      const c = x.c, o = c.operacion;
      const h = VETA.v.operacion({persona: c.id, nombre: c.nombre, tipo: o.tipo, etiqueta: o.tipo === 'venta' ? 'La venta' : 'La compra', actual: o.fase,
        nombres: D.pasos[o.tipo], siguiente: c.siguiente && c.siguiente.texto, cerrada: x.cerrada, ir: 'cliente/' + c.id});
      // la flecha dice que la tarjeta se toca (lleva a la ficha): va al final de «lo siguiente»
      return h.replace(/<\/span><\/button>$/, VETA.ic('flecha', 20) + '</span></button>');
    }).join('') + '</div>';
  };

  VETA.pantalla('S2', {
    titulo: 'Operaciones',
    sub: 'Cada operación, en cinco pasos: la más cerca de la firma, primero.',
    pinta: () => {
      let html = '';
      if (typeof VETA.operacionesMiasContenido === 'function') { try { html = VETA.operacionesMiasContenido() || ''; } catch (e) { setTimeout(() => { throw e; }); } }
      return `<div class="operaciones-mias">${html}</div>`;
    },
    alMontar: el => {
      const c = el.querySelector('.operaciones-mias');
      if (c && typeof VETA.operacionesMiasAlMontar === 'function') { try { VETA.operacionesMiasAlMontar(c); } catch (e) { setTimeout(() => { throw e; }); } }
    }
  });
})();
