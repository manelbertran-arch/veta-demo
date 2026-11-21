/* Veta demo · núcleo · plantillas.js
   Las cinco plantillas: pantallas hechas solo con datos (lista y confirmación) y hojas hechas solo con datos
   (acciones, texto y elegir). Ver CONTRATO.md. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc;
  const val = (x, a) => (typeof x === 'function' ? x(a) : x);

  // ---- pantalla de lista: bloques con título y filas ----
  // VETA.lista('A5b', {ruta, titulo, destino, grupo, guia, intro, bloques: p => [{titulo, texto, filas: [UI.fila opciones]}], pie, boton, acciones})
  VETA.lista = (id, o) => VETA.pantalla(id, Object.assign({}, o, {
    pinta: p => {
      const bl = val(o.bloques, p) || [];
      return (o.intro ? `<p class="intro" data-i="0">${esc(val(o.intro, p))}</p>` : '') +
        bl.map((b, k) => UI.bloque({titulo: b.titulo, texto: b.texto, i: k + 1, html: (b.html || '') + (b.filas ? UI.lista(b.filas) : '')})).join('') +
        (o.pie ? `<p class="pie" data-i="${bl.length + 1}">${esc(val(o.pie, p))}</p>` : '');
    },
    botonFijo: o.boton ? p => UI.boton(val(o.boton, p)) : null
  }));

  // ---- pantalla de confirmación: qué va a pasar, detalles y un botón ----
  // VETA.confirma('G5b', {ruta, titulo, destino, grupo, guia, texto: p => '…', filas: p => [...], boton: {texto},
  //   alConfirmar: p => ({aviso: 'Hecho.', ir: 'reparto'})  // sin ir, vuelve atrás
  VETA.confirma = (id, o) => VETA.pantalla(id, Object.assign({}, o, {
    pinta: p => `<p class="intro" data-i="0">${esc(val(o.texto, p) || '')}</p>` +
      (o.filas ? UI.lista(val(o.filas, p), {i: 1}) : '') +
      (o.nota ? UI.nota({texto: val(o.nota, p), icono: 'info', clase: 'nota-gris'}) : ''),
    botonFijo: p => UI.boton(Object.assign({accion: 'confirmar'}, val(o.boton, p))) + UI.boton({tipo: 'texto', texto: 'Cancelar', atras: true}),
    acciones: Object.assign({
      confirmar(ev, el, p) {
        const r = (o.alConfirmar && o.alConfirmar(p)) || {};
        if (r.ir) VETA.ir(r.ir, {dir: 'atras', reemplaza: true}); else VETA.atras();
        if (r.aviso) setTimeout(() => VETA.aviso(r.aviso, {deshacer: r.deshacer}), 50);
      }
    }, o.acciones || {})
  }));

  // ---- hoja de acciones: opciones como filas de 56 y «Cancelar» ----
  // VETA.hojaAcciones('H11', {titulo: d => '…', texto, opciones: d => [{texto, sub, icono, hace: (d, el) => {}, ir, hoja, datos, peligro}], cancelar: 'Cancelar'})
  VETA.hojaAcciones = (id, o) => VETA.hojaDef(id, {
    titulo: o.titulo,
    pinta: d => (o.texto ? `<p class="hoja-x">${esc(val(o.texto, d))}</p>` : '') +
      `<div class="ops">${(val(o.opciones, d) || []).map((op, k) => `<button type="button" class="op${op.peligro ? ' op-peligro' : ''}" data-accion="op" data-n="${k}">` +
        `${op.icono ? VETA.ic(op.icono, 22) : ''}<span class="op-c"><span class="op-t">${esc(op.texto)}</span>${op.sub ? `<span class="op-s">${esc(op.sub)}</span>` : ''}</span></button>`).join('')}</div>` +
      (o.cancelar === false ? '' : UI.boton({tipo: 'texto', texto: o.cancelar || 'Cancelar', datos: {cierra: '1'}, clase: 'hoja-cancela'})),
    acciones: Object.assign({
      op(ev, el, d) {
        const op = (val(o.opciones, d) || [])[Number(el.dataset.n)]; if (!op) return;
        if (op.hoja) { VETA.hoja(op.hoja, Object.assign({}, d, op.datos || {})); return; }
        if (op.cierra !== false) VETA.cierraHoja({foco: false});
        if (op.hace) op.hace(d, el);
        if (op.ir) VETA.ir(op.ir);
      }
    }, o.acciones || {}),
    alMontar: o.alMontar
  });

  // ---- hoja de texto: bloques de texto y «Cerrar» ----
  // VETA.hojaTexto('H29', {titulo: d => '…', bloques: d => [{titulo, texto, lista: ['…'], html}], cerrar: 'Cerrar', boton: {texto, accion}})
  VETA.hojaTexto = (id, o) => VETA.hojaDef(id, {
    titulo: o.titulo,
    pinta: d => `<div class="hoja-texto">${(val(o.bloques, d) || []).map(b => `<section class="ht-b">${b.titulo ? `<h3 class="ht-t">${esc(b.titulo)}</h3>` : ''}` +
      (b.texto ? `<p>${esc(b.texto)}</p>` : '') + (b.lista ? `<ul>${b.lista.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '') + (b.html || '') + '</section>').join('')}</div>` +
      (o.boton ? UI.boton(val(o.boton, d)) : '') +
      UI.boton({tipo: o.boton ? 'texto' : 'secundario', texto: o.cerrar || 'Cerrar', datos: {cierra: '1'}, clase: 'hoja-cancela'}),
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
          `<span class="op-marca">${VETA.ic('check', 20)}</span></button>`).join('')}</div>` +
        UI.boton({tipo: 'texto', texto: o.cancelar || 'Cancelar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
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
