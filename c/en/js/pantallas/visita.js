/* Veta demo · ronda 8 · pantallas · visita.js · carril A
   A22 · Una visita · #/visita/<id>. Dos caras de la misma pantalla:
     · antes de contarla: quién, cuándo y dónde, lo que sabes de la persona y el botón negro “He salido de la visita”.
     · contada: el índice de sus papeles (el acta y el de la visita para el propietario), con cómo está cada uno, y “Lo que me has
       contado”. Sin botón en el pie: repetiría una fila. Aquí se llega desde Visitas o volviendo del acta.
   A24 · ¿Cómo ha ido? · #/salida/<id>. El micro es de mentira: al tocarlo, el texto va saliendo como si se hablara (otro toque lo para);
     siempre hay “o escríbelo”. Al acabar abre el acta, que es lo que sigue (D6); el índice queda detrás, en “volver”.
     Cuando ya lo ha oído todo, el micro dice “Otra vez” y tocarlo es contarlo otra vez (D19).
     “Seguir dictando” (desde “Más” del acta) entra aquí con lo ya contado delante, para añadirle algo.
   Veta no estuvo en la visita: todo lo que escribe sale de lo que cuenta la persona. Nada se envía solo.
   Aguanta cualquier id (el de la visita, o el del cliente o el propietario: VETA.a2.de). */
(function () {
  'use strict';
  const UI = VETA.UI, r7 = VETA.r7, esc = VETA.esc, A2 = () => VETA.a2;
  const noHay = () => r7.vacio('I can\'t find this viewing.');

  VETA.pantalla('A22', {
    titulo: p => { const v = A2().de(p.id); return v ? 'Viewing with ' + v.corto : 'A viewing'; },
    sub: p => { const v = A2().de(p.id); return v && A2().est(v.id).contada ? v.cuando + ' · ' + v.fila : ''; },
    nota: p => { const v = A2().de(p.id); return v && !A2().est(v.id).contada ? 'Tell me about it and I\'ll prepare the notes and the report.' : ''; },
    casoDictado: p => { const v = A2().de(p.id); return v ? {tipo: 'visita', de: v.id, quien: v.cliente, titulo: v.nombre, texto: v.cuando + ' · ' + v.fila} : null; },
    pinta: p => {
      const v = A2().de(p.id); if (!v) return noHay();
      const e = A2().est(v.id);
      if (!e.contada) {
        return r7.lista([{cara: v.cliente, nombre: v.nombre, pasa: v.cuando}, {foto: v.piso, nombre: v.lugar, pasa: v.calle}], {i: 0}) +
          (v.sabes ? r7.tarjeta({i: 1, de: 'What you know about ' + (v.corto || v.nombre), texto: v.sabes}) : '');
      }
      // el estado de cada papel va en la segunda línea (no es un número ni una fecha: no va en la cola)
      return r7.lista([{nombre: 'Viewing notes', pasa: 'For ' + v.corto + ' · ' + A2().estadoDoc(e.acta || {}, true).toLowerCase(), ir: 'acta/' + v.id},
        {nombre: A2().nombreInforme(v.id), pasa: A2().estadoDoc(e.informe || {}), ir: 'informe/' + v.id}], {i: 0}) +
        r7.lista([{nombre: 'What you told me', hoja: 'h07', datos: {visita: v.id}}], {i: 1});
    },
    botonFijo: p => {
      const v = A2().de(p.id); if (!v) return '';
      if (!A2().est(v.id).contada) return r7.botones({texto: v.hoy ? 'I\'ve left the viewing' : 'Tell me how it went', accion: 'salgo', icono: 'mic'});
      return '';   // contada: las filas ya abren cada papel
    },
    acciones: {
      // el botón lleva un micro: al llegar a “¿Cómo ha ido?” ya escucha, sin otro toque
      salgo(ev, el, p) { const v = A2().de(p.id); if (!v) return; solo = v.id; VETA.ir('salida/' + v.id); }
    }
  });

  // ---- A24 · ¿Cómo ha ido? ----
  let voz = null;    // {id, i, palabras, reloj, seg}
  let solo = null;   // id de la visita cuyo micro arranca solo al llegar (se viene del botón “He salido de la visita”)
  let sigue = null;  // id de la visita a la que se le añade algo (“Seguir dictando”): lo ya contado va delante
  const para = () => { if (voz) { clearInterval(voz.reloj); voz.reloj = null; } };
  const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const segundos = t => { const m = /^(\d+):(\d+)$/.exec(String(t || '')); return m ? Number(m[1]) * 60 + Number(m[2]) : 0; };
  const caja = () => document.querySelector('.a2-cuenta');
  const pon = (modo, txt) => { const c = caja(); if (!c) return; c.dataset.modo = modo; const t = c.querySelector('.r7-micro-t'); if (t && txt != null) t.textContent = txt; };
  const listo = si => { const b = document.querySelector('.fijo [data-accion="ya"]'); if (b) b.disabled = !si; };
  A2().sigueDictando = id => { const v = A2().de(id); if (!v) return; sigue = v.id; VETA.ir('salida/' + v.id); };
  A2().otraVez = id => { const v = A2().de(id); if (v) VETA.ir('salida/' + v.id); };

  // el micro de mentira: el texto va saliendo como si se hablara; otro toque lo para
  function habla(p) {
    const v = A2().de(p.id), c = caja(); if (!v || !c || c.dataset.modo === 'prepara') return;
    const d = c.querySelector('.a2-dicho');
    if (voz && voz.reloj) { para(); pon('dicho', 'Paused. Tap to carry on.'); return; }
    if (!voz || voz.id !== v.id) voz = {id: v.id, i: 0, palabras: v.dicho.split(' '), seg: 0};
    // ya lo había oído todo y se toca el micro (“Otra vez”): se cuenta otra vez desde el principio
    const otra = voz.i >= voz.palabras.length && !voz.mas;
    if (otra) { voz.i = 0; voz.seg = 0; d.textContent = ''; listo(false); }
    const fin = () => { para(); voz.i = voz.palabras.length; if (!voz.mas) d.textContent = v.dicho; pon('dicho', 'Again'); listo(true); };
    // con “Reducir movimiento” no hay fase de escucha: el primer toque lo da por dicho; “Otra vez” vuelve al principio, a la espera
    if (VETA.reducido()) { if (otra) { voz = null; pon('quieto', 'Tap and tell me'); } else fin(); return; }
    pon('habla', 'I am listening · ' + mmss(voz.seg));
    voz.reloj = setInterval(() => {
      if (!d.isConnected) { para(); return; }
      voz.seg += .085;
      // añadiendo a lo ya contado: el reloj sigue donde estaba y lo dicho se queda delante
      if (voz.mas) { pon('habla', 'I am listening · ' + mmss(voz.seg)); return; }
      voz.i++;
      d.textContent = voz.palabras.slice(0, voz.i).join(' ');
      d.scrollTop = d.scrollHeight;
      if (voz.i >= 3) listo(true);
      if (voz.i >= voz.palabras.length) fin(); else pon('habla', 'I am listening · ' + mmss(voz.seg));
    }, 85);
  }

  VETA.pantalla('A24', {
    titulo: 'How did it go?',
    sub: 'What they liked, what they didn\'t, and what\'s next.',
    pinta: p => {
      const v = A2().de(p.id); if (!v) return noHay();
      return `<div class="a2-cuenta" data-modo="quieto" data-i="0">` +
        r7.micro({accion: 'habla', texto: solo === v.id ? 'I am listening · 0:00' : 'Tap and tell me'}) +
        `<p class="r7-ficha a2-dicho" aria-live="polite"></p>` +
        `<div class="campo a2-escrito"><label class="campo-e" for="a2-escrito">Write here how it went</label><div class="campo-caja"><textarea id="a2-escrito" class="campo-i" rows="6"></textarea></div></div>` +
        r7.enlace({texto: 'or write it', accion: 'escribe', clase: 'a2-escribe'}) +
        `<p class="a2-prepara" role="status">Preparing the notes and the report.</p></div>`;
    },
    botonFijo: p => A2().de(p.id) ? r7.botones({texto: 'That\'s it', accion: 'ya', deshabilitado: true}) : '',
    alMontar: (el, p) => {
      para(); voz = null;
      const t = el.querySelector('#a2-escrito');
      if (t) t.addEventListener('input', () => listo(t.value.trim().length > 2));
      const v = A2().de(p.id), auto = v && solo === v.id, mas = v && sigue === v.id; solo = null; sigue = null;
      if (mas) {
        const dicho = A2().est(v.id).dicho || v.dicho, d = el.querySelector('.a2-dicho');
        voz = {id: v.id, mas: true, palabras: dicho.split(' '), seg: segundos(v.dur)}; voz.i = voz.palabras.length;
        if (d) d.textContent = dicho;
        pon('dicho', 'Paused. Tap to carry on.'); listo(true);
      }
      if (auto) setTimeout(() => { const c = caja(); if (c && c.isConnected && c.dataset.modo === 'quieto' && !voz) habla(p); }, VETA.reducido() ? 150 : 550);
    },
    acciones: {
      habla(ev, el, p) { habla(p); },
      escribe(ev, el, p) {
        const c = caja(); if (!c || c.dataset.modo === 'prepara') return;
        para(); pon('escribe', 'Or tap and tell me');
        const t = c.querySelector('#a2-escrito'), d = c.querySelector('.a2-dicho');
        if (t) { if (!t.value && d.textContent) t.value = d.textContent; listo(t.value.trim().length > 2); t.focus(); }
      },
      ya(ev, el, p) {
        const v = A2().de(p.id), c = caja(); if (!v || !c) return;
        const escrito = c.dataset.modo === 'escribe', t = c.querySelector('#a2-escrito'), mas = !!(voz && voz.mas);
        const dicho = escrito && t && t.value.trim() ? t.value.trim() : mas ? (A2().est(v.id).dicho || v.dicho) : v.dicho;
        para(); listo(false);
        // añadir a lo contado: se guarda y se vuelve al acta, sin rehacer nada más
        if (mas) { A2().pon(v.id, {contada: true, dicho, escrito: escrito || A2().est(v.id).escrito}); VETA.atras(); return; }
        pon('prepara');
        setTimeout(() => {
          A2().pon(v.id, {contada: true, dicho, escrito});
          // lo que sigue es el acta: se abre en el sitio de esta pantalla (volver lleva a la visita, con sus papeles)
          if (caja() && caja().isConnected) VETA.ir('acta/' + v.id, {reemplaza: true});
        }, VETA.reducido() ? 200 : 1300);
      }
    }
  });
})();
