/* Veta demo · ronda 8 · pantallas · mensaje.js · carril A (El día)
   A2 · Cambiar el mensaje · #/mensaje/<id de la cosa> (cuelga de la cosa de hoy, toca/:id). El mensaje en una caja que crece, los ajustes
   rápidos en una fila de filtros (cuatro como mucho, y «Volver al mío» si lo has cambiado), el enlace «Copiar el texto» y un botón. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, r7 = VETA.r7;
  const AJ = [{id: 'corto', texto: 'Más corto'}, {id: 'cercano', texto: 'Más cercano'}, {id: 'otroDia', texto: 'Proponer otro día'}];
  const limpio = s => String(s || '').replace(/<[^>]+>/g, '');
  const informe = c => c && c.tipo === 'informe' ? ((VETA.datos.diaA || {}).informe || {})[c.cliente] : null;
  // el texto de Veta: el borrador de la cosa (o el que rehízo tras el cambio, o el mensaje del informe)
  const deVeta = c => { const x = c.extra || {}; const inf = informe(c); return limpio(x.borradorHtml || c.borrador || (inf && inf.mensaje) || ''); };
  // lo que se está editando (vive en la pestaña, por si se sale y se vuelve)
  const ed = id => VETA.est.lee('a.edita.' + id, null);
  const ponEd = (id, v) => VETA.est.pon('a.edita.' + id, v);
  const actual = c => { const e = ed(c.id); if (e) return e.texto; const x = c.extra || {}; return x.borrador ? limpio(x.borrador) : deVeta(c); };
  // ronda 6 · atajo de demostración: un ajuste más, «Dar dos horas», mientras Veta no lo haya aprendido
  const dosHoras = c => { const d = ((VETA.datos.r6 || {}).dia || {}).dosHoras || {}; return c && d[c.id] && !VETA.r6.siempre() ? d[c.id] : null; };
  const copia24 = c => !!(c.bloqueo && c.boton && c.boton.accion === 'copiar');

  function crece(t) { if (!t) return; t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; }

  VETA.pantalla('A2', {
    titulo: 'Cambiar el mensaje',
    nota: 'Si lo cambias, te pregunto si lo aprendo.',
    pinta: p => {
      const c = M.cosa(p.id);
      if (!c) return r7.vacio('Este mensaje ya no está.');
      const texto = actual(c), veta = deVeta(c), e = ed(c.id) || {}, x = c.extra || {};
      // el mensaje que Veta ha cambiado con lo recién aprendido: la frase nueva va subrayada en oro mientras no se toque
      const oro = !!(x.r6 && x.borradorHtml && texto === veta);
      const aj = ((VETA.datos.diaA || {}).ajustes || {})[c.id];
      let h = `<div class="campo a-msg" data-i="0"><label class="campo-e" for="a-msg">${oro ? 'Tu mensaje · lo nuevo va subrayado' : 'Tu mensaje'}</label><div class="campo-caja">${oro ? `<div class="a-msg-oro" aria-hidden="true">${x.borradorHtml}</div>` : ''}` +
        `<textarea id="a-msg" class="campo-i" rows="3">${esc(texto)}</textarea></div></div>`;
      // cuatro ajustes como mucho («Dar dos horas» delante mientras Veta no lo haya aprendido); y, si lo has cambiado, volver al mío
      const ajs = (aj ? (dosHoras(c) ? [{id: 'dosHoras', texto: 'Dar dos horas'}] : []).concat(AJ).slice(0, 4) : []).concat(texto !== veta ? [{id: 'mio', texto: 'Volver al mío'}] : []);
      if (ajs.length) h += r7.filtros(ajs, {i: 1, valor: e.ajuste, accion: 'ajusta', etiqueta: 'Pídeme un cambio'});
      if (copia24(c)) h += r7.tarjeta({i: 2, veta: true, de: 'Lo he mirado yo', texto: c.bloqueo});
      else if (texto.trim()) h += r7.enlace({i: 2, texto: 'Copiar el texto', accion: 'copiar-a2'});
      return h;
    },
    botonFijo: p => {
      const c = M.cosa(p.id); if (!c || !actual(c).trim()) return '';
      if (copia24(c)) return r7.botones({texto: 'Copiar el texto', accion: 'copiar-a2'});
      return r7.botones({texto: c.tipo === 'informe' ? 'Abrir WhatsApp con el informe' : 'Abrir WhatsApp con el mensaje', accion: 'enviar'});
    },
    alMontar: (el, p) => {
      const t = el.querySelector('#a-msg'); if (!t) return;
      crece(t);
      // el subrayado va justo debajo de las letras: misma letra, mismo sitio y mismo ancho que la caja de escribir
      const oro = el.querySelector('.a-msg-oro');
      if (oro) { const cs = getComputedStyle(t); Object.assign(oro.style, {font: cs.font, letterSpacing: cs.letterSpacing, padding: cs.padding, left: t.offsetLeft + 'px', top: t.offsetTop + 'px', width: t.offsetWidth + 'px', right: 'auto'}); }
      let vacioAntes = !t.value.trim();
      t.addEventListener('input', () => {
        crece(t); if (oro) oro.remove();
        const c = M.cosa(p.id); if (!c) return;
        const e = ed(c.id) || {};
        ponEd(c.id, {texto: t.value, antes: e.antes, ajuste: null});
        const vacio = !t.value.trim();
        // al vaciarse o volver a tener texto cambia el botón: se repinta sin perder el cursor
        const cambiado = t.value !== deVeta(c);
        const marca = el.querySelector('[data-valor="mio"]');
        if (vacio !== vacioAntes || (!!marca) !== cambiado) {
          vacioAntes = vacio; const pos = t.selectionStart; VETA.repinta();
          const n = VETA.$('#a-msg'); if (n) { n.focus({preventScroll: true}); try { n.setSelectionRange(pos, pos); } catch (x) {} }
        }
      });
    },
    acciones: {
      ajusta(ev, el, p) {
        const c = M.cosa(p.id), aj = ((VETA.datos.diaA || {}).ajustes || {})[p.id] || {}; if (!c) return;
        const k = el.dataset.valor;
        if (k === 'mio') { ponEd(p.id, {texto: deVeta(c), antes: actual(c)}); VETA.repinta(); return; }
        const txt = k === 'dosHoras' ? dosHoras(c) : aj[k]; if (!txt) return;
        ponEd(c.id, {texto: txt, antes: actual(c), ajuste: k}); VETA.repinta();
      },
      'copiar-a2'(ev, el, p) {
        const c = M.cosa(p.id); if (!c) return; const t = actual(c);
        VETA.copia(t); VETA.aviso('Texto copiado. Envíalo desde tu WhatsApp.');
        M.marca(c.id, 'por-hacer', {borrador: t, borradorHtml: null, copiado: true, boton: {texto: 'Ya lo envié', accion: 'ya-lo-envie'}, secundarios: [{texto: 'Copiar otra vez', accion: 'copiar'}]});
        VETA.est.pon('a.edita.' + c.id, null);
        VETA.atras();
      },
      enviar(ev, el, p) {
        const c = M.cosa(p.id); if (!c) return; const t = actual(c);
        // Jordi: si aún no ha llegado su mensaje nuevo, el borrador cambia aquí también.
        // FN · Solo si el mensaje sigue siendo el de Veta: si la persona ha escrito el suyo, sale el suyo al primer toque (como con
        // Marta). Antes el primer toque lo cambiaba por el de Veta y lo escrito se perdía.
        if (c.cambio && !(c.extra || {}).cambiado && t.trim() === deVeta(c).trim()) {
          M.marca(c.id, 'por-hacer', {cambiado: true, aviso: c.cambio.aviso, borradorHtml: c.cambio.borradorHtml});
          ponEd(c.id, null); VETA.repinta(); VETA.aviso('Jordi te acaba de escribir. He rehecho el mensaje: míralo otra vez.'); return;
        }
        // ronda 6 · el momento de aprender: si el mensaje sale cambiado, Hoy pregunta una vez «¿Lo hago siempre así?»
        if (t.trim() !== deVeta(c).trim() && c.tipo !== 'informe' && !VETA.r6.siempre()) VETA.est.pon('a.r6.cambio', {id: c.id, antes: deVeta(c), ahora: t.trim()});
        else if ((VETA.est.lee('a.r6.cambio', null) || {}).id === c.id) VETA.est.pon('a.r6.cambio', null);
        M.marca(c.id, 'pregunta-envio', t !== deVeta(c) ? {borrador: t, borradorHtml: null} : {});
        ponEd(c.id, null);
        // el informe vuelve a su pantalla, que pregunta «¿Lo enviaste?»; lo demás, a la anterior
        VETA.atras();
      }
    }
  });
})();
