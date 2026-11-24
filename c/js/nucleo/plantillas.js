/* Veta demo · núcleo · plantillas.js
   Las tres plantillas de hoja, hechas solo con datos: acciones (filas), texto (lectura) y elegir (opciones con una marcada).
   Nunca una hoja sobre otra. (Las dos plantillas de pantalla, VETA.lista y VETA.confirma, se fueron en la ronda 8: no las usaba nadie.) */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  const val = (x, a) => (typeof x === 'function' ? x(a) : x);
  // los bloques de lectura de una hoja: [{titulo, texto, lista: ['…'], html}]. Un bloque vacío (null, false) no se pinta.
  const bloques = l => { l = (l || []).filter(Boolean); return l.length ? `<div class="hoja-texto">${l.map(b => `<section class="ht-b">${b.titulo ? `<h3 class="ht-t">${esc(b.titulo)}</h3>` : ''}` +
    (b.texto ? `<p>${esc(b.texto)}</p>` : '') + (b.lista ? `<ul>${b.lista.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '') + (b.html || '') + '</section>').join('')}</div>` : ''; };
  // el botón del final de una hoja: un objeto de UI.boton, o una función que lo devuelve (o nada: entonces no hay botón)
  const boton = (b, d) => { b = val(b, d); return b ? UI.boton(b) : ''; };

  // ---- hoja de acciones: opciones como filas de 56 (sin «Cancelar» abajo: V7) ----
  // VETA.hojaAcciones('H11', {titulo: d => '…', texto, bloques, opciones: d => [{texto, sub, cara, hace: (d, el) => {}, ir, hoja, datos, peligro, cierra}], boton})
  // A la izquierda de una fila solo va una cara (`cara`). `texto` (una línea arriba), `bloques` (lectura, como en hojaTexto) y `boton` son
  // opcionales y pueden ser funciones de los datos: si devuelven nada, no se pinta nada. Sin opciones no hay lista. `cierra: false` deja la hoja abierta.
  VETA.hojaAcciones = (id, o) => VETA.hojaDef(id, {
    titulo: o.titulo,
    pinta: d => {
      const x = val(o.texto, d), ops = (val(o.opciones, d) || []).filter(Boolean);
      return (x ? `<p class="hoja-x">${esc(x)}</p>` : '') + bloques(val(o.bloques, d)) +
        (ops.length ? `<div class="ops">${ops.map((op, k) => `<button type="button" class="op${op.peligro ? ' op-peligro' : ''}" data-accion="op" data-n="${k}">` +
          `${op.cara ? VETA.av(op.cara, 40) : ''}<span class="op-c"><span class="op-t">${esc(op.texto)}</span>${op.sub ? `<span class="op-s">${esc(op.sub)}</span>` : ''}</span></button>`).join('')}</div>` : '') +
        boton(o.boton, d);
    },
    acciones: Object.assign({
      op(ev, el, d) {
        const op = (val(o.opciones, d) || []).filter(Boolean)[Number(el.dataset.n)]; if (!op) return;
        if (op.hoja) { VETA.hoja(op.hoja, Object.assign({}, d, op.datos || {})); return; }
        if (op.cierra !== false) VETA.cierraHoja({foco: false});
        if (op.hace) op.hace(d, el);
        if (op.ir) VETA.ir(op.ir);
      }
    }, o.acciones || {}),
    alMontar: o.alMontar
  });

  // ---- la hoja de «Más» (D23): una sola forma en toda la app ----
  // VETA.hojaMas('a-mas', {titulo: d => 'El acta', opciones: d => [{texto: 'Cambiar el texto', ir}, {texto: 'Borrar el acta', peligro: true, hace}], ensena: true})
  //   · Título: el nombre de la cosa de la que va («El acta», «Marta Puig», «El reparto»), nunca «Más».
  //   · Orden: lo frecuente primero, tal como venga; después «Enséñale a Veta con este caso» (con `ensena`); lo destructivo (`peligro`), al final y en rojo.
  //   · Todas las filas pesan igual: una línea de 56, sin segunda línea. Con una sola opción no se abre una hoja: es un enlace en la pantalla (r7.enlace).
  // `ensena: true` (o d => true, o el texto de la fila) añade la fila que lleva a dictar/orden con el caso de la pantalla abierta (su `casoDictado`):
  // por ahí vuelven los enlaces de enseñar que se quitaron de las tarjetas. VETA.opEnsena() da esa misma fila para una hojaAcciones que no sea «Más».
  VETA.opEnsena = texto => ({texto: texto || 'Enséñale a Veta con este caso', hace: () => VETA.dictar('orden')});
  VETA.hojaMas = (id, o) => VETA.hojaAcciones(id, Object.assign({}, o, {
    opciones: d => {
      const l = (val(o.opciones, d) || []).filter(Boolean), e = val(o.ensena, d);
      return l.filter(x => !x.peligro).concat(e ? [VETA.opEnsena(typeof e === 'string' ? e : null)] : [], l.filter(x => x.peligro));
    }
  }));

  // ---- hoja de texto: bloques de lectura (sin «Cerrar» abajo: V7) ----
  // VETA.hojaTexto('H29', {titulo: d => '…', bloques: d => [{titulo, texto, lista: ['…'], html}, null], boton: {texto, accion} | d => ({…}) | d => null})
  VETA.hojaTexto = (id, o) => VETA.hojaDef(id, {
    titulo: o.titulo,
    pinta: d => (bloques(val(o.bloques, d)) || '<div class="hoja-texto"></div>') + boton(o.boton, d),
    acciones: o.acciones || {},
    alMontar: o.alMontar
  });

  // ---- hoja de elegir: una opción entre varias ----
  // VETA.hojaElegir('H35', {titulo, texto, opciones: d => [{id, texto, sub, av}], valor: d => id, alElegir: (op, d) => {}})
  VETA.hojaElegir = (id, o) => VETA.hojaDef(id, {
    titulo: o.titulo,
    pinta: d => {
      const v = o.valor ? o.valor(d) : null;
      return (o.texto ? `<p class="hoja-x">${esc(val(o.texto, d))}</p>` : '') +
        `<div class="ops" role="radiogroup">${(val(o.opciones, d) || []).map((op, k) => `<button type="button" class="op op-elige" role="radio" aria-checked="${op.id === v}" data-accion="elige" data-n="${k}">` +
          `${op.av ? VETA.av(op.av, 40) : ''}<span class="op-c"><span class="op-t">${esc(op.texto)}</span>${op.sub ? `<span class="op-s">${esc(op.sub)}</span>` : ''}</span>` +
          `<span class="op-marca">${VETA.ic('check', 20)}</span></button>`).join('')}</div>`;   // F2 · V7: sin «Cancelar» abajo
    },
    acciones: {
      elige(ev, el, d) {
        const op = (val(o.opciones, d) || [])[Number(el.dataset.n)]; if (!op) return;
        VETA.cierraHoja({foco: false});
        if (o.alElegir) o.alElegir(op, d);
      }
    }
  });
})();
