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
    titulo: 'Owner report',
    guia: ['Here\'s the weekly report, exactly as the owner will see it.', 'You review it and send it from your WhatsApp.', 'That way the owner knows how their flat is doing without you having to write it.'],
    pinta: p => {
      const i = inf(p);
      if (!i) return UI.vacio({titulo: 'No report this week', texto: 'When there are viewings, I\'ll prepare it on Monday.', icono: 'doc', boton: {texto: 'Back', atras: true}});
      const c = M.cosa(i.cosa), e = est(p.id);
      let h = `<div class="a-inf-cab" data-i="0"><p class="a-para">${esc(i.para)}</p>` +
        `<button type="button" class="enlace" data-hoja="h01" data-de="${esc(i.cosa)}">Because you send it to him every Monday ›</button></div>`;
      // la nota de voz se va cuando se marca «He escuchado» en H10 (paquete B pone la marca «nota-pere-escuchada»)
      if (i.voz && !M.lee('nota-pere-escuchada')) h += `<button type="button" class="a-voz-av" data-hoja="h10" data-de="${esc(p.id)}" data-i="0">${ic('play', 20)}<span>${esc(i.voz)} · <b>Listen ›</b></span></button>`;
      if (e.pdf) h += `<div data-i="0">${UI.lineaHecho({texto: 'PDF ready. You send it.', boton: {texto: 'Undo', accion: 'sin-pdf'}})}</div>`;
      h += `<article class="tarjeta a-inf" data-i="1"><span class="a-inf-r">How it will look to ${esc((M.quien(p.id) || {}).corto || 'Pere')}</span>` +
        `<div class="a-inf-foto foto-encoge">${UI.foto(i.piso, {tam: 'ancha', foco: 'piso'})}</div>` +
        `<h2 class="a-inf-t">${esc(i.titulo)}</h2>${UI.cifra({valor: i.visitas, unidad: 'visitas', periodo: 'week of 16 to 22', id: 'a-inf-cifra'})}` +
        `<p class="a-inf-x">${esc(i.texto)}</p><p class="a-inf-firma">${esc(i.firma)}</p></article>`;
      h += `<section class="bloque" data-i="2"><h2 class="bloque-t">Your message</h2>` +
        `<div class="a-msg-llano"><p>${esc(mensaje(i, c))}</p></div>` +
        `<p class="nota nota-gris a-inf-n">It goes as text. The version with a photo is saved as PDF and you attach it.</p>` +
        UI.nota({texto: 'It doesn\'t go out until you send it', icono: 'candado'}) + '</section>';
      const resuelta = c && ['enviada', 'pregunta-envio'].includes(c.estado);
      if (!resuelta) h += `<div data-i="3">${UI.botones([{texto: 'Edit', ir: 'mensaje/' + i.cosa, icono: 'editar'}, {texto: 'Something else…', hoja: 'h42', datos: {informe: p.id}}])}</div>`;
      return h;
    },
    botonFijo: p => {
      const i = inf(p); if (!i) return '';
      const c = M.cosa(i.cosa), e = est(p.id), corto = (M.quien(p.id) || {}).corto || 'Pere';
      if (!c) return '';
      if (c.estado === 'pregunta-envio') {
        return `<div class="a-preg" data-vt="cola-${esc(c.id)}"><h3 class="tc-preg">Did you send it?</h3>` + UI.boton({texto: 'Yes, sent', accion: 'si-enviado', de: c.id}) +
          UI.botones([{texto: 'Not yet', accion: 'todavia-no', de: c.id}]) + UI.nota({texto: 'WhatsApp doesn\'t open in this demo: no message goes out.', clase: 'nota-gris'}) + '</div>';
      }
      if (c.estado === 'enviada') return UI.lineaHecho({texto: 'Sent to ' + corto, hora: (c.hora || '') + ' · stays in their history', hoja: 'h03', de: c.id, vt: 'cola-' + c.id, boton: {texto: 'I didn\'t send it', accion: 'no-lo-envie'}});
      if (e.guardado) return UI.lineaHecho({texto: 'Saved without sending · you have it in Today', boton: {texto: 'Undo', accion: 'sin-guardar'}});
      if ((c.extra || {}).copiado) return UI.boton({texto: 'I\'ve sent it', accion: 'ya-lo-envie', de: c.id});
      return UI.boton({texto: 'Open WhatsApp with the report', accion: 'enviar', de: c.id, g: 'Open WhatsApp|I\'ll open your WhatsApp with the text. You send it.'});
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
    titulo: 'How do you want to send it?',
    opciones: d => {
      const id = d.informe || 'pere', i = inf({id}) || {};
      return [
        {texto: 'Save without sending', sub: 'You have it in Today for later', icono: 'caja', hace: () => { ponEst(id, {guardado: true}); VETA.repinta(); }},
        {texto: 'Save as PDF', sub: 'The version with a photo, for you to attach', icono: 'doc', hace: () => { ponEst(id, {pdf: true}); VETA.repinta(); }},
        {texto: 'Copy the text', sub: 'You paste it into WhatsApp', icono: 'copiar', hace: () => {
          const c = M.cosa(i.cosa); VETA.copia(mensaje(i, c));
          M.marca(i.cosa, 'por-hacer', {copiado: true}); VETA.repinta();
          VETA.aviso('Text copied. Send it from your WhatsApp.');
        }}];
    }
  });
})();
