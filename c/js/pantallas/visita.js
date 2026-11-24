/* Veta demo · ronda 7 · pantallas · visita.js · A2
   A22 · Una visita · #/visita/<id>. Dos caras de la misma pantalla:
     · antes de contarla: la foto del piso, quién, cuándo y dónde, y el botón negro «He salido de la visita».
     · contada: «Listo para enviar», con dos papeles grandes (Acta de la visita e Informe para el propietario).
   A24 · ¿Cómo ha ido? · #/salida/<id>. El micro es de mentira: al tocarlo, el texto va saliendo como si se hablara;
     siempre hay «o escríbelo». Al acabar vuelve a la visita, ya con los dos papeles hechos.
   Veta no estuvo en la visita: todo lo que escribe sale de lo que cuenta la persona. Nada se envía solo.
   Aguanta cualquier id (el de la visita, o el del cliente o el propietario: VETA.a2.de). */
(function () {
  'use strict';
  const UI = VETA.UI, r7 = VETA.r7, esc = VETA.esc, ic = VETA.ic, A2 = () => VETA.a2;
  const noHay = () => UI.vacio({titulo: 'No encuentro esta visita', texto: 'Mira en tus visitas: ahí están todas.', icono: 'cal'});
  const enviados = e => (e.acta || {}).estado === 'enviada' && (e.informe || {}).estado === 'enviada';
  const barras = n => '<i></i>'.repeat(n);

  // un papel grande de «Listo para enviar»: la hoja en pequeño, el nombre, para quién es y cómo está
  const papel = o => `<button type="button" class="a2-doc" data-ir="${esc(o.ir)}" data-i="${o.i}">` +
    `<span class="a2-mini" aria-hidden="true">${o.mini}</span>` +
    `<span class="a2-doc-c"><b class="a2-doc-t">${esc(o.titulo)}</b><span class="a2-doc-p">${esc(o.para)}</span>${r7.pastilla(o.estado.texto, o.estado.tono)}</span>` +
    `<span class="a2-doc-chev">${ic('chev', 16)}</span></button>`;

  VETA.pantalla('A22', {
    titulo: p => { const v = A2().de(p.id); if (!v) return 'Una visita'; const e = A2().est(v.id); return e.contada && !enviados(e) ? 'Listo para enviar' : 'Visita con ' + v.corto; },
    frase: p => {
      const v = A2().de(p.id); if (!v) return '';
      const e = A2().est(v.id);
      if (!e.contada) return v.hoy ? 'Cuando salgas, toca el botón y cuéntame cómo ha ido. Te dejo el acta y el informe.'
        : 'Falta el acta. Cuéntame cómo fue y te la dejo hecha, con el informe para el propietario.';
      if (enviados(e)) return 'Ya enviaste el acta y el informe. Puedes abrirlos cuando quieras.';
      const falta = A2().falta(v.id), prop = A2().corto(v.propietario);
      if (falta === 'acta') return 'Te dejo hechos el acta y el informe. Empieza por el acta.';
      if (falta === 'informe') return `El acta ya está. Ahora, el informe para ${prop}: lo lees y lo envías tú.`;
      return 'Los dos están guardados sin enviar. Ábrelos y envíalos cuando quieras.';
    },
    // «Listo para enviar»: la frase dice por dónde empezar, se queda a la vista en el cuerpo
    fraseCuerpo: p => { const v = A2().de(p.id); if (!v) return false; const e = A2().est(v.id); return !!(e.contada && !enviados(e)); },
    pinta: p => {
      const v = A2().de(p.id); if (!v) return noHay();
      const e = A2().est(v.id), prop = A2().nombre(v.propietario);
      if (!e.contada) {
        return `<div class="a2-foto" data-i="0">${UI.foto(v.piso, {tam: 'ancha'})}</div>` +
          `<div class="r7-ficha a2-quien" data-i="1"><div class="a2-q">${VETA.av(v.cliente, 40, {nombre: v.nombre})}<div class="a2-q-c"><b>${esc(v.nombre)}</b><span>${esc(v.cuando)}</span></div></div>` +
          `<div class="a2-q a2-q-donde"><span class="r7-fila-ic">${ic('casa', 20)}</span><div class="a2-q-c"><b>${esc(v.lugar)}</b><span>${esc(v.calle)}</span></div></div></div>` +
          (v.sabes ? r7.lista([{icono: 'chat', nombre: 'Lo que sabes de ' + (v.corto || v.nombre), pasa: 'De vuestro chat', abre: `<p>${esc(v.sabes)}</p>`}], {i: 2}) : '');
      }
      const nFotos = A2().fotos(v.id).length;
      return `<div class="a2-de" data-i="0">${VETA.av(v.cliente, 40, {nombre: v.nombre})}<span><b>${esc(v.nombre)}</b> · ${esc(v.cuando)} · ${esc(v.fila)}</span></div>` +
        papel({i: 1, ir: 'acta/' + v.id, titulo: 'Acta de la visita', para: 'Qué le gustó, qué no y qué toca ahora.', estado: A2().pastillaDoc(e.acta || {}, true),
          mini: `<span class="a2-mini-cara">${VETA.av(v.cliente, 32, {nombre: v.nombre})}</span>${barras(5)}`}) +
        papel({i: 2, ir: 'informe/' + v.id, titulo: 'Informe para el propietario', para: `Para ${prop}, con ${nFotos === 1 ? 'una foto' : nFotos + ' fotos'} del piso.`, estado: A2().pastillaDoc(e.informe || {}),
          mini: `<img src="assets/pisos/${esc(A2().fotos(v.id)[0].f)}.webp" alt="">${barras(3)}`}) +
        r7.lista([{icono: 'mic', nombre: 'Lo que me has contado', pasa: e.escrito ? 'Lo escribiste tú' : 'Con tus palabras, tal cual',
          abre: `<p>«${esc(e.dicho || v.dicho)}»</p><button type="button" class="a2-enlace" data-accion="otra-vez">Contarlo otra vez</button>`}], {i: 3});
    },
    botonFijo: p => {
      const v = A2().de(p.id); if (!v) return '';
      if (!A2().est(v.id).contada) return r7.botones({texto: v.hoy ? 'He salido de la visita' : 'Cuéntame cómo ha ido', accion: 'salgo', icono: 'mic'});
      const falta = A2().falta(v.id);
      if (falta === 'acta') return r7.botones({texto: 'Abrir el acta', ir: 'acta/' + v.id});
      if (falta === 'informe') return r7.botones({texto: 'Abrir el informe para ' + A2().corto(v.propietario), ir: 'informe/' + v.id});
      return '';
    },
    acciones: {
      // el botón lleva un micro: al llegar a «¿Cómo ha ido?» ya escucha, sin otro toque
      salgo(ev, el, p) { const v = A2().de(p.id); if (!v) return; solo = v.id; VETA.ir('salida/' + v.id); },
      'otra-vez'(ev, el, p) { const v = A2().de(p.id); if (v) VETA.ir('salida/' + v.id); }
    }
  });

  // ---- A24 · ¿Cómo ha ido? ----
  let voz = null;   // {id, i, palabras, reloj, seg, t0}
  let solo = null;  // id de la visita cuyo micro arranca solo al llegar (se viene del botón «He salido de la visita»)
  const para = () => { if (voz) { clearInterval(voz.reloj); voz.reloj = null; } };
  const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const caja = () => document.querySelector('.a2-cuenta');
  const pon = (modo, txt) => { const c = caja(); if (!c) return; c.dataset.modo = modo; const t = c.querySelector('.a2-mic-t'); if (t && txt != null) t.textContent = txt; };
  const listo = si => { const b = document.querySelector('.fijo [data-accion="ya"]'); if (b) b.disabled = !si; };

  // el micro de mentira: el texto va saliendo como si se hablara; otro toque lo para
  function habla(p) {
    const v = A2().de(p.id), c = caja(); if (!v || !c || c.dataset.modo === 'prepara') return;
    const d = c.querySelector('.a2-dicho');
    if (voz && voz.reloj) { para(); pon('dicho', 'En pausa. Toca para seguir.'); return; }
    if (!voz || voz.id !== v.id) voz = {id: v.id, i: 0, palabras: v.dicho.split(' '), seg: 0};
    if (voz.i >= voz.palabras.length) { voz.i = 0; voz.seg = 0; d.textContent = ''; }
    const fin = () => { para(); voz.i = voz.palabras.length; d.textContent = v.dicho; pon('dicho', 'Ya lo tengo.'); listo(true); };
    if (VETA.reducido()) { fin(); return; }
    pon('habla', 'Te escucho · ' + mmss(voz.seg));
    voz.reloj = setInterval(() => {
      if (!d.isConnected) { para(); return; }
      voz.i++; voz.seg += .085;
      d.textContent = voz.palabras.slice(0, voz.i).join(' ');
      d.scrollTop = d.scrollHeight;
      if (voz.i >= 3) listo(true);
      if (voz.i >= voz.palabras.length) fin(); else pon('habla', 'Te escucho · ' + mmss(voz.seg));
    }, 85);
  }

  VETA.pantalla('A24', {
    titulo: '¿Cómo ha ido?',
    frase: 'Cuéntamelo como a un compañero: qué le gustó, qué no y qué toca ahora.',
    fraseCuerpo: true,   // la instrucción del paso se queda a la vista, en el cuerpo (sin «?»)
    pinta: p => {
      const v = A2().de(p.id); if (!v) return noHay();
      return `<div class="a2-cuenta" data-modo="quieto" data-i="0">` +
        `<button type="button" class="a2-mic" data-accion="habla" aria-label="Hablar">${ic('mic', 40)}</button>` +
        `<p class="a2-mic-t" aria-live="polite">${solo === v.id ? 'Te escucho · 0:00' : 'Toca y cuéntamelo'}</p>` +
        `<p class="a2-dicho"></p>` +
        `<textarea class="a2-escrito" rows="6" placeholder="Escribe aquí cómo ha ido" aria-label="Cómo ha ido"></textarea>` +
        `<button type="button" class="a2-enlace a2-escribe" data-accion="escribe">o escríbelo</button>` +
        `<p class="a2-nota">En la demo hablo yo: es un ejemplo.</p>` +
        `<div class="a2-prepara" role="status"><span class="a2-prepara-ic">${ic('estrella', 28)}</span><b>Preparo el acta y el informe…</b></div></div>`;
    },
    botonFijo: p => A2().de(p.id) ? r7.botones({texto: 'Ya está', accion: 'ya', deshabilitado: true}) : '',
    alMontar: (el, p) => {
      para(); voz = null;
      const t = el.querySelector('.a2-escrito');
      if (t) t.addEventListener('input', () => listo(t.value.trim().length > 2));
      const v = A2().de(p.id), auto = v && solo === v.id; solo = null;
      if (auto) setTimeout(() => { const c = caja(); if (c && c.isConnected && c.dataset.modo === 'quieto' && !voz) habla(p); }, VETA.reducido() ? 150 : 550);
    },
    acciones: {
      habla(ev, el, p) { habla(p); },
      escribe(ev, el, p) {
        const c = caja(); if (!c || c.dataset.modo === 'prepara') return;
        para(); pon('escribe', 'O toca y cuéntamelo');
        const t = c.querySelector('.a2-escrito'), d = c.querySelector('.a2-dicho');
        if (t) { if (!t.value && d.textContent) t.value = d.textContent; listo(t.value.trim().length > 2); t.focus(); }
      },
      ya(ev, el, p) {
        const v = A2().de(p.id), c = caja(); if (!v || !c) return;
        const escrito = c.dataset.modo === 'escribe', t = c.querySelector('.a2-escrito');
        const dicho = escrito && t && t.value.trim() ? t.value.trim() : v.dicho;
        para(); listo(false); pon('prepara');
        setTimeout(() => {
          A2().pon(v.id, {contada: true, dicho, escrito});
          if (caja() && caja().isConnected) VETA.ir('visita/' + v.id);
        }, VETA.reducido() ? 200 : 1300);
      }
    }
  });
})();
