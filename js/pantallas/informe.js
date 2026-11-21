/* Veta demo · pantallas · informe.js · paquete A (El día)
   A12 · Informe al propietario · #/informe/<cliente> (pere). La foto del piso viaja desde la tarjeta de Hoy (data-foco="piso").
   Estados en el botón fijo: borrador · «¿Lo enviaste?» · enviado (No lo envié) · guardado sin enviar · copiado. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic;
  const inf = p => ((VETA.datos.diaA || {}).informe || {})[p.id] || null;
  const est = id => VETA.est.lee('a.informe.' + id, {});
  const ponEst = (id, v) => VETA.est.pon('a.informe.' + id, Object.assign({}, est(id), v));
  const mensaje = (i, c) => { const x = (c && c.extra) || {}; return x.borrador ? String(x.borrador) : i.mensaje; };

  VETA.pantalla('A12', {
    titulo: 'Informe al propietario',
    guia: ['Aquí está el informe de la semana, tal como lo verá el propietario.', 'Tú lo revisas y lo envías desde tu WhatsApp.', 'Así el propietario sabe cómo va su piso sin que tengas que escribirlo.'],
    pinta: p => {
      const i = inf(p);
      if (!i) return UI.vacio({titulo: 'Sin informe esta semana', texto: 'Cuando haya visitas, lo preparo el lunes.', icono: 'doc', boton: {texto: 'Volver', atras: true}});
      const c = M.cosa(i.cosa), e = est(p.id);
      let h = `<div class="a-inf-cab" data-i="0"><p class="a-para">${esc(i.para)}</p>` +
        `<button type="button" class="enlace" data-hoja="h01" data-de="${esc(i.cosa)}">Porque se lo envías cada lunes ›</button></div>`;
      // el mensaje de Pere se va cuando se marca «Ya lo he leído» en H10 (paquete B pone la marca «nota-pere-escuchada»)
      if (i.voz && !M.lee('nota-pere-escuchada')) h += `<button type="button" class="a-voz-av" data-hoja="h10" data-de="${esc(p.id)}" data-i="0">${ic('chat', 20)}<span>${esc(i.voz)} · <b>Leer ›</b></span></button>`;
      if (e.pdf) h += `<div data-i="0">${UI.lineaHecho({texto: 'PDF preparado. Lo envías tú.', boton: {texto: 'Deshacer', accion: 'sin-pdf'}})}</div>`;
      h += `<article class="tarjeta a-inf" data-i="1"><span class="a-inf-r">Así lo verá ${esc((M.quien(p.id) || {}).corto || 'Pere')}</span>` +
        `<div class="a-inf-foto foto-encoge">${UI.foto(i.piso, {tam: 'ancha', foco: 'piso'})}</div>` +
        `<h2 class="a-inf-t">${esc(i.titulo)}</h2>${UI.cifra({valor: i.visitas, unidad: 'visitas', periodo: 'semana del 16 al 22', id: 'a-inf-cifra'})}` +
        `<p class="a-inf-x">${esc(i.texto)}</p><p class="a-inf-firma">${esc(i.firma)}</p></article>`;
      h += `<section class="bloque" data-i="2"><h2 class="bloque-t">Tu mensaje</h2>` +
        `<div class="a-msg-llano"><p>${esc(mensaje(i, c))}</p></div>` +
        `<p class="nota nota-gris a-inf-n">Va como texto. La versión con foto se guarda en PDF y la adjuntas tú.</p>` +
        UI.nota({texto: 'No sale hasta que tú lo envíes', icono: 'candado'}) + '</section>';
      const resuelta = c && ['enviada', 'pregunta-envio'].includes(c.estado);
      if (!resuelta) h += `<div data-i="3">${UI.botones([{texto: 'Editar', ir: 'mensaje/' + i.cosa, icono: 'editar'}, {texto: 'Otra cosa…', hoja: 'h42', datos: {informe: p.id}}])}</div>`;
      return h;
    },
    botonFijo: p => {
      const i = inf(p); if (!i) return '';
      const c = M.cosa(i.cosa), e = est(p.id), corto = (M.quien(p.id) || {}).corto || 'Pere';
      if (!c) return '';
      if (c.estado === 'pregunta-envio') {
        return `<div class="a-preg" data-vt="cola-${esc(c.id)}"><h3 class="tc-preg">¿Lo enviaste?</h3>` + UI.boton({texto: 'Sí, enviado', accion: 'si-enviado', de: c.id}) +
          UI.botones([{texto: 'Todavía no', accion: 'todavia-no', de: c.id}]) + UI.nota({texto: 'En esta demo WhatsApp no se abre: no sale ningún mensaje.', clase: 'nota-gris'}) + '</div>';
      }
      if (c.estado === 'enviada') return UI.lineaHecho({texto: 'Enviado a ' + corto, hora: (c.hora || '') + ' · queda en su historia', hoja: 'h03', de: c.id, vt: 'cola-' + c.id, boton: {texto: 'No lo envié', accion: 'no-lo-envie'}});
      if (e.guardado) return UI.lineaHecho({texto: 'Guardado sin enviar · lo tienes en Hoy', boton: {texto: 'Deshacer', accion: 'sin-guardar'}});
      if ((c.extra || {}).copiado) return UI.boton({texto: 'Ya lo envié', accion: 'ya-lo-envie', de: c.id});
      return UI.boton({texto: 'Abrir WhatsApp con el informe', accion: 'enviar', de: c.id, g: 'Abrir WhatsApp|Te abro tu WhatsApp con el texto. Lo envías tú.'});
    },
    alMontar: (el, p) => {
      const n = el.querySelector('#a-inf-cifra'); const i = inf(p);
      if (n && i && !VETA.reducido()) { n.dataset.rueda = '0'; n.textContent = '0'; setTimeout(() => VETA.rueda(n, i.visitas), 260); }
    },
    acciones: {
      enviar(ev, el, p) { const i = inf(p); ponEst(p.id, {guardado: false}); M.marca(i.cosa, 'pregunta-envio'); VETA.repinta({hecho: i.cosa}); },
      'sin-guardar'(ev, el, p) { ponEst(p.id, {guardado: false}); VETA.repinta(); },
      'sin-pdf'(ev, el, p) { ponEst(p.id, {pdf: false}); VETA.repinta(); }
    }
  });

  // H42 · ¿Cómo quieres enviarlo? (la «Otra cosa…» del informe)
  VETA.hojaAcciones('h42', {
    titulo: '¿Cómo quieres enviarlo?',
    opciones: d => {
      const id = d.informe || 'pere', i = inf({id}) || {};
      return [
        {texto: 'Guardar sin enviar', sub: 'Lo tienes en Hoy para luego', icono: 'caja', hace: () => { ponEst(id, {guardado: true}); VETA.repinta(); }},
        {texto: 'Guardar en PDF', sub: 'La versión con foto, para adjuntarla tú', icono: 'doc', hace: () => { ponEst(id, {pdf: true}); VETA.repinta(); }},
        {texto: 'Copiar el texto', sub: 'Lo pegas tú en WhatsApp', icono: 'copiar', hace: () => {
          const c = M.cosa(i.cosa); VETA.copia(mensaje(i, c));
          M.marca(i.cosa, 'por-hacer', {copiado: true}); VETA.repinta();
          VETA.aviso('Texto copiado. Envíalo desde tu WhatsApp.');
        }}];
    }
  });
})();
