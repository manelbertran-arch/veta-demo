/* Veta demo · pantallas · mensaje.js · paquete A (El día)
   A2 · Editar mensaje · #/mensaje/<id de la cosa>. El borrador en una caja que crece, tres ajustes y el mismo
   botón que tenía la tarjeta («Abrir WhatsApp con el mensaje» o, con la ventana de 24 h cerrada, «Copiar el texto»). */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc;
  const AJ = [{id: 'corto', texto: 'Shorter'}, {id: 'cercano', texto: 'Warmer'}, {id: 'otroDia', texto: 'Suggest another day'}];
  const limpio = s => String(s || '').replace(/<[^>]+>/g, '');
  const informe = c => c && c.tipo === 'informe' ? ((VETA.datos.diaA || {}).informe || {})[c.cliente] : null;
  // el texto de Veta: el borrador de la cosa (o el que rehízo tras el cambio, o el mensaje del informe)
  const deVeta = c => { const x = c.extra || {}; const inf = informe(c); return limpio(x.borradorHtml || c.borrador || (inf && inf.mensaje) || ''); };
  // lo que se está editando (vive en la pestaña, por si se sale y se vuelve)
  const ed = id => VETA.est.lee('a.edita.' + id, null);
  const ponEd = (id, v) => VETA.est.pon('a.edita.' + id, v);
  const actual = c => { const e = ed(c.id); if (e) return e.texto; const x = c.extra || {}; return x.borrador ? limpio(x.borrador) : deVeta(c); };
  const copia24 = c => !!(c.bloqueo && c.boton && c.boton.accion === 'copiar');

  function crece(t) { if (!t) return; t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; }

  VETA.pantalla('A2', {
    guia: ['Here you see the message Veta has prepared for you.', 'You change it however you like, or ask it to shorten it or make it warmer.', 'That way it goes out in your words, and only when you send it.'],
    pinta: p => {
      const c = M.cosa(p.id);
      if (!c) return UI.vacio({titulo: 'This message is no longer here', texto: 'Go back to Today to see what\'s left.', icono: 'chat', boton: {texto: 'Back', atras: true}});
      const texto = actual(c), veta = deVeta(c), e = ed(c.id) || {};
      const aj = ((VETA.datos.diaA || {}).ajustes || {})[c.id];
      const para = 'For ' + c.titulo + ' · WhatsApp';
      let h = `<p class="a-para" data-i="0">${esc(para)}</p>`;
      if (c.cita) h += `<div data-i="0">${UI.cita({texto: c.cita.texto, origen: c.cita.origen, de: c.id})}</div>`;
      h += `<div class="campo a-msg" data-i="1"><label class="campo-e" for="a-msg">Your message</label><div class="campo-caja">` +
        `<textarea id="a-msg" class="campo-i" rows="3">${esc(texto)}</textarea></div></div>`;
      if (texto.trim() && texto !== veta) {
        h += `<div class="hecho a-cambiado" data-i="1"><div class="hecho-a"><span class="hecho-txt">You've changed the message</span></div>` +
          (e.antes != null ? UI.boton({tipo: 'texto', texto: 'Undo the change', accion: 'deshacer-cambio', ancho: false}) : '') +
          UI.boton({tipo: 'texto', texto: 'Back to Veta\'s', accion: 'al-de-veta', ancho: false}) + '</div>';
      } else if (!texto.trim()) {
        h += `<p class="nota a-vacio" data-i="1">Type the message or go back to Veta's.</p>` + UI.boton({tipo: 'texto', texto: 'Back to Veta\'s', accion: 'al-de-veta', ancho: false});
      }
      if (aj) h += `<div class="a-ajustes" data-i="2" role="group" aria-label="Message settings">${AJ.map(a => UI.boton({tipo: 'secundario', texto: a.texto, accion: 'ajusta', datos: {aj: a.id}, ancho: false, clase: 'a-aj' + (e.ajuste === a.id ? ' on' : '')})).join('')}</div>`;
      if (!copia24(c)) h += `<div data-i="3">${UI.botones([{texto: 'Copy the text', accion: 'copiar-a2'}])}</div>`;
      else h += `<div data-i="3">${UI.nota({texto: c.bloqueo, icono: 'candado', caja: true})}</div>`;
      h += `<div data-i="3">${UI.nota({texto: 'It doesn\'t go out until you send it', icono: 'candado'})}</div>`;
      return h;
    },
    botonFijo: p => {
      const c = M.cosa(p.id); if (!c || !actual(c).trim()) return '';
      return copia24(c) ? UI.boton({texto: 'Copy the text', accion: 'copiar-a2'}) : UI.boton({texto: c.tipo === 'informe' ? 'Open WhatsApp with the report' : 'Open WhatsApp with the message', accion: 'enviar'});
    },
    alMontar: (el, p) => {
      const t = el.querySelector('#a-msg'); if (!t) return;
      crece(t);
      let vacioAntes = !t.value.trim();
      t.addEventListener('input', () => {
        crece(t);
        const c = M.cosa(p.id); if (!c) return;
        const e = ed(c.id) || {};
        ponEd(c.id, {texto: t.value, antes: e.antes, ajuste: null});
        const vacio = !t.value.trim();
        // al vaciarse o volver a tener texto cambia el botón: se repinta sin perder el cursor
        const cambiado = t.value !== deVeta(c);
        const marca = el.querySelector('.a-cambiado');
        if (vacio !== vacioAntes || (!!marca) !== (cambiado && !vacio)) {
          vacioAntes = vacio; const pos = t.selectionStart; VETA.repinta();
          const n = VETA.$('#a-msg'); if (n) { n.focus({preventScroll: true}); try { n.setSelectionRange(pos, pos); } catch (x) {} }
        }
      });
    },
    acciones: {
      ajusta(ev, el, p) {
        const c = M.cosa(p.id), aj = ((VETA.datos.diaA || {}).ajustes || {})[p.id]; if (!c || !aj) return;
        const k = el.dataset.aj; ponEd(c.id, {texto: aj[k], antes: actual(c), ajuste: k}); VETA.repinta();
      },
      'deshacer-cambio'(ev, el, p) { const e = ed(p.id); if (!e) return; ponEd(p.id, {texto: e.antes, antes: null}); VETA.repinta(); },
      'al-de-veta'(ev, el, p) { const c = M.cosa(p.id); ponEd(p.id, {texto: deVeta(c), antes: actual(c)}); VETA.repinta(); },
      'copiar-a2'(ev, el, p) {
        const c = M.cosa(p.id); if (!c) return; const t = actual(c);
        VETA.copia(t); VETA.aviso('Text copied. Send it from your WhatsApp.');
        M.marca(c.id, 'por-hacer', {borrador: t, borradorHtml: null, copiado: true, boton: {texto: 'I\'ve sent it', accion: 'ya-lo-envie'}, secundarios: [{texto: 'Copy again', accion: 'copiar'}]});
        VETA.est.pon('a.edita.' + c.id, null);
        VETA.A.aHoy();
      },
      enviar(ev, el, p) {
        const c = M.cosa(p.id); if (!c) return; const t = actual(c);
        // Jordi: si aún no ha llegado su mensaje nuevo, el borrador cambia aquí también
        if (c.cambio && !(c.extra || {}).cambiado) {
          M.marca(c.id, 'por-hacer', {cambiado: true, aviso: c.cambio.aviso, borradorHtml: c.cambio.borradorHtml});
          ponEd(c.id, null); VETA.repinta(); VETA.aviso('Jordi just wrote to you. I\'ve redone the message: take another look.'); return;
        }
        M.marca(c.id, 'pregunta-envio', t !== deVeta(c) ? {borrador: t, borradorHtml: null} : {});
        ponEd(c.id, null);
        // el informe vuelve a su pantalla, que pregunta «¿Lo enviaste?»; lo demás, a la anterior
        VETA.atras();
      }
    }
  });
})();
