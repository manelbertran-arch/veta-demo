/* Veta demo · ronda 7 · pantallas · acta.js · A2
   A4 · Acta de la visita · #/acta/<id de la visita> (elena, casals, toni, sergi-font). Pantalla completa (sin barra).
   Un papel: piso, quién y cuándo, la impresión en una frase, lo que le gustó, lo que no y qué toca ahora.
   Abajo, tres botones: “Enviar el acta” (negro, abre “¿Cómo lo envías?”), “Editar” y “Guardar para mí”.
   FA · camino recto: enviada o guardada, el negro pasa a “Siguiente: informe para Pere ›” (sin volver atrás); si el informe ya está, “Hecho. Ir a Visitas ›”.
   Al guardarla o enviarla se cierra su cosa de “Te toca a ti” (c-elena) y con eso queda apuntada la llamada (modelo.js).
   Lo de antes (“Corregirla a mano”, “Guardar en PDF”, “Pasarlo al propietario”) sigue: Editar, la hoja de enviar y la fila del informe. */
(function () {
  'use strict';
  const UI = VETA.UI, r7 = VETA.r7, esc = VETA.esc, ic = VETA.ic, A2 = () => VETA.a2;
  const cuando = h => !h ? '' : /^\d/.test(h) ? ' at ' + h : ' el ' + h;
  const campo = (v, k) => A2().campo(v.id, 'acta', k, v.acta[k]);
  const lista = (v, k, cls, icono) => `<ul class="a2-ul ${cls}">${A2().lineas(campo(v, k)).map(x => `<li>${ic(icono, 18)}<span>${esc(x)}</span></li>`).join('')}</ul>`;
  const area = (v, k, etiqueta, filas) => `<label class="a2-campo"><span class="a2-p-h">${esc(etiqueta)}</span><textarea id="a2-acta-${k}" rows="${filas}">${esc(campo(v, k))}</textarea></label>`;
  const CAMPOS = ['impresion', 'gusto', 'no', 'ahora'];

  // el texto llano, para copiar o pegar en WhatsApp
  VETA.a2.textoActa = v => [`Viewing notes · ${v.dia}`, `${v.lugar} · ${v.calle}`, `${v.nombre} with ${VETA.yo().nombre}`, '', campo(v, 'impresion'), '',
    'What they liked:', ...A2().lineas(campo(v, 'gusto')).map(x => '· ' + x), '', 'What they did not like:', ...A2().lineas(campo(v, 'no')).map(x => '· ' + x), '', 'What happens next: ' + campo(v, 'ahora')].join('\n');

  VETA.pantalla('A4', {
    titulo: p => { const v = A2().de(p.id); if (v) A2().llega(v.id); return 'Viewing notes'; },
    frase: p => {
      const v = A2().de(p.id); if (!v) return '';
      const d = A2().doc(v.id, 'acta');
      if (d.edita) return 'Change anything that is not right. One thing on each line.';
      if (d.estado && !A2().viejo(d)) {
        const hecho = d.estado === 'enviada' ? 'Sent.' : 'Saved.';
        return A2().falta(v.id) === 'informe' ? `${hecho} It is saved in ${v.corto}'s profile. Next, the report for ${A2().corto(v.propietario)}.` : `${hecho} It is saved in ${v.corto}'s profile. Nothing else is missing from this viewing.`;
      }
      if (d.estado === 'enviada') return 'That is how you sent it. It is saved in the profile of ' + v.corto + '.';
      return 'Read it and change anything that is not right. It does not go out by itself: you send it.';
    },
    pinta: p => {
      const v = A2().de(p.id);
      if (!v) return UI.vacio({titulo: 'There are no notes for this viewing', texto: 'Open the viewing and tell me how it went.', icono: 'doc'});
      A2().llega(v.id);   // si se llega aquí, la visita ya está contada (también por el dictado de antes)
      const d = A2().doc(v.id, 'acta'), yo = VETA.yo();
      const f0 = A2().fotos(v.id)[0];
      const cab = (d.edita ? '' : `<div class="a2-fotos a2-fotos-1"><figure class="a2-f a2-f-0"><img src="assets/pisos/${esc(f0.f)}.webp" alt="Photo of the flat" decoding="async"><figcaption>${esc(v.lugar)} · ${esc(v.calle)}</figcaption></figure></div>`) +
        `<header class="a2-p-cab"><span class="a2-p-tipo">${esc(v.dia)}</span></header>` +
        `<div class="a2-p-quien">${r7.caras([v.cliente, yo.id], {max: 2})}<span>${esc(v.nombre)} with ${esc(yo.nombre)}</span></div>`;
      let cuerpo;
      if (d.edita) {
        cuerpo = area(v, 'impresion', 'In one sentence', 2) + area(v, 'gusto', 'What she liked', 3) + area(v, 'no', 'What they did not like', 3) + area(v, 'ahora', 'What is next', 2);
      } else {
        cuerpo = `<p class="a2-p-imp">${esc(campo(v, 'impresion'))}</p>` +
          `<section class="a2-p-s"><span class="a2-p-h">What she liked</span>${lista(v, 'gusto', 'a2-si', 'check')}</section>` +
          `<section class="a2-p-s"><span class="a2-p-h">What they did not like</span>${lista(v, 'no', 'a2-no', 'menos')}</section>` +
          `<section class="a2-p-s a2-p-ahora"><span class="a2-p-h">What is next</span><p>${esc(campo(v, 'ahora'))}</p></section>` +
          `<footer class="a2-p-pie">${ic('estrella', 16)}<span>Veta wrote this from what you told it</span></footer>`;
      }
      let h = `<article class="a2-papel${d.edita ? ' a2-edita' : ' a2-inf'}" data-i="0">${cab}${cuerpo}</article>`;
      if (!d.edita) {
        const e = A2().est(v.id);
        h += `<div class="a2-ens" data-i="1">${r7.ensena({texto: 'Do you want the notes written another way?'})}</div>` +
          r7.lista([{icono: 'mic', nombre: 'What you said', pasa: e.escrito ? 'You wrote it yourself' : 'In your words, as you said them', abre: `<p>“${esc(e.dicho || v.dicho)}”</p>`}], {i: 2});
      }
      return h;
    },
    botonFijo: p => {
      const v = A2().de(p.id); if (!v) return '';
      const d = A2().doc(v.id, 'acta');
      if (d.edita) return r7.botones({texto: 'Save the changes', accion: 'guarda-cambios'}, [{texto: 'Change nothing', accion: 'sin-cambios'}]);
      const enviar = {texto: 'Send the notes', hoja: 'h42', datos: {que: 'acta', id: v.id}, icono: 'enviar'};
      if (d.estado) {
        const hecho = `<div class="a2-hecho"><span class="a2-hecho-ic">${ic('check', 18)}</span><span class="a2-hecho-t"><b>${d.estado === 'enviada' ? 'Sent' : d.como === 'pdf' ? 'Saved as a PDF' : 'Saved for you'}${esc(cuando(d.hora))}</b>` +
          `<span>Noted: ${esc(v.acta.apunta)}</span></span>${d.hora && !/^\d/.test(d.hora) ? '' : '<button type="button" class="a2-enlace" data-accion="deshacer">Undo</button>'}</div>`;
        if (A2().viejo(d)) return hecho;   // un acta de antes: se enseña como quedó
        // el camino recto: lo que sigue va en negro; quien solo la guardó aún puede enviarla (botón claro)
        const otros = d.estado === 'enviada' ? [] : [Object.assign({}, enviar)];
        if (A2().falta(v.id) === 'informe') return hecho + r7.botones({texto: 'Next: report for ' + A2().corto(v.propietario) + ' ›', accion: 'sigue'}, otros);
        const fin = A2().fin('visitas');
        return hecho + r7.botones(fin, otros);
      }
      return r7.botones(enviar, [{texto: 'Edit', accion: 'editar', icono: 'editar'}, {texto: 'Save for me', accion: 'guardar'}]);
    },
    acciones: {
      editar(ev, el, p) { const v = A2().de(p.id); if (!v) return; A2().ponDoc(v.id, 'acta', {edita: true}); VETA.repinta(); },
      'sin-cambios'(ev, el, p) { const v = A2().de(p.id); if (!v) return; A2().ponDoc(v.id, 'acta', {edita: false}); VETA.repinta(); },
      'guarda-cambios'(ev, el, p) {
        const v = A2().de(p.id); if (!v) return;
        const t = Object.assign({}, A2().doc(v.id, 'acta').textos || {});
        CAMPOS.forEach(k => { const x = document.getElementById('a2-acta-' + k); if (x) t[k] = x.value.trim(); });
        A2().ponDoc(v.id, 'acta', {edita: false, textos: t}); VETA.repinta(); VETA.aviso('Changes saved.');
      },
      guardar(ev, el, p) {
        const v = A2().de(p.id); if (!v) return;
        A2().ponDoc(v.id, 'acta', {estado: 'guardada', como: 'mi', hora: VETA.ahora()});
        if (v.cosa) { VETA.est.pon('a.sinTareaElena', false); A2().cierraCosa(v.cosa, 'hecha'); }
        VETA.repinta(); VETA.aviso('Notes saved in the profile of ' + v.corto + '.');
      },
      // del acta al informe sin volver atrás: el informe ocupa el sitio del acta en el camino
      sigue(ev, el, p) { const v = A2().de(p.id); if (v) VETA.ir('informe/' + v.id, {reemplaza: true}); },
      deshacer(ev, el, p) {
        const v = A2().de(p.id); if (!v) return;
        A2().ponDoc(v.id, 'acta', {estado: null, como: null, hora: null});
        A2().abreCosa(v.cosa); VETA.repinta();
      }
    }
  });
})();
