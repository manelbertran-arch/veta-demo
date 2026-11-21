/* Veta demo · pantallas · mensaje.js · paquete A (El día)
   A2 · Editar mensaje · #/mensaje/<id de la cosa>. El borrador en una caja que crece, tres ajustes y el mismo
   botón que tenía la tarjeta («Abrir WhatsApp con el mensaje» o, con la ventana de 24 h cerrada, «Copiar el texto»). */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc;
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
    guia: ['Aquí ves el mensaje que te ha preparado Veta.', 'Tú lo cambias como quieras, o le pides que lo acorte o lo haga más cercano.', 'Así sale con tus palabras. Si lo cambias, Veta te pregunta si lo hace siempre así.'],
    pinta: p => {
      const c = M.cosa(p.id);
      if (!c) return UI.vacio({titulo: 'Este mensaje ya no está', texto: 'Vuelve a Hoy para ver lo que queda.', icono: 'chat', boton: {texto: 'Volver', atras: true}});
      const texto = actual(c), veta = deVeta(c), e = ed(c.id) || {}, x = c.extra || {};
      // ronda 6 · el mensaje que Veta ha cambiado con lo recién aprendido: la frase nueva va subrayada en oro mientras no se toque
      const oro = !!(x.r6 && x.borradorHtml && texto === veta);
      const aj = ((VETA.datos.diaA || {}).ajustes || {})[c.id];
      const para = 'Para ' + c.titulo + ' · WhatsApp';
      let h = `<p class="a-para" data-i="0">${esc(para)}</p>`;
      if (c.cita) h += `<div data-i="0">${UI.cita({texto: c.cita.texto, origen: c.cita.origen, de: c.id})}</div>`;
      h += `<div class="campo a-msg" data-i="1"><label class="campo-e" for="a-msg">${oro ? 'Tu mensaje · lo nuevo va subrayado' : 'Tu mensaje'}</label><div class="campo-caja">${oro ? `<div class="a-msg-oro" aria-hidden="true">${x.borradorHtml}</div>` : ''}` +
        `<textarea id="a-msg" class="campo-i" rows="3">${esc(texto)}</textarea></div></div>`;
      if (texto.trim() && texto !== veta) {
        h += `<div class="hecho a-cambiado" data-i="1"><div class="hecho-a"><span class="hecho-txt">Has cambiado el mensaje</span></div>` +
          UI.boton({tipo: 'texto', texto: 'Volver a lo que escribí yo', accion: 'al-de-veta', ancho: false}) + '</div>';
      } else if (!texto.trim()) {
        h += `<p class="nota a-vacio" data-i="1">Escribe el mensaje o vuelve a lo que escribí yo.</p>` + UI.boton({tipo: 'texto', texto: 'Volver a lo que escribí yo', accion: 'al-de-veta', ancho: false});
      }
      const ajs = (dosHoras(c) ? [{id: 'dosHoras', texto: 'Dar dos horas'}] : []).concat(AJ);
      if (aj) h += `<div class="a-ajustes" data-i="2" role="group" aria-label="Ajustes del mensaje">${ajs.map(a => UI.boton({tipo: 'secundario', texto: a.texto, accion: 'ajusta', datos: {aj: a.id}, ancho: false, clase: 'a-aj' + (e.ajuste === a.id ? ' on' : '')})).join('')}</div>`;
      if (!copia24(c)) h += `<div data-i="3">${UI.botones([{texto: 'Copiar el texto', accion: 'copiar-a2'}])}</div>`;
      else h += `<div data-i="3">${UI.nota({texto: c.bloqueo, icono: 'candado', caja: true})}</div>`;
      return h;
    },
    botonFijo: p => {
      const c = M.cosa(p.id); if (!c || !actual(c).trim()) return '';
      return copia24(c) ? UI.boton({texto: 'Copiar el texto', accion: 'copiar-a2'}) : UI.boton({texto: c.tipo === 'informe' ? 'Abrir WhatsApp con el informe' : 'Abrir WhatsApp con el mensaje', accion: 'enviar'});
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
        const k = el.dataset.aj, txt = k === 'dosHoras' ? dosHoras(c) : aj[k]; if (!txt) return;
        ponEd(c.id, {texto: txt, antes: actual(c), ajuste: k}); VETA.repinta();
      },
      'deshacer-cambio'(ev, el, p) { const e = ed(p.id); if (!e) return; ponEd(p.id, {texto: e.antes, antes: null}); VETA.repinta(); },
      'al-de-veta'(ev, el, p) { const c = M.cosa(p.id); ponEd(p.id, {texto: deVeta(c), antes: actual(c)}); VETA.repinta(); },
      'copiar-a2'(ev, el, p) {
        const c = M.cosa(p.id); if (!c) return; const t = actual(c);
        VETA.copia(t); VETA.aviso('Texto copiado. Envíalo desde tu WhatsApp.');
        M.marca(c.id, 'por-hacer', {borrador: t, borradorHtml: null, copiado: true, boton: {texto: 'Ya lo envié', accion: 'ya-lo-envie'}, secundarios: [{texto: 'Copiar otra vez', accion: 'copiar'}]});
        VETA.est.pon('a.edita.' + c.id, null);
        VETA.A.aHoy();
      },
      enviar(ev, el, p) {
        const c = M.cosa(p.id); if (!c) return; const t = actual(c);
        // Jordi: si aún no ha llegado su mensaje nuevo, el borrador cambia aquí también
        if (c.cambio && !(c.extra || {}).cambiado) {
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
