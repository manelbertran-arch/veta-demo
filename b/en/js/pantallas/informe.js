/* Veta demo · ronda 7 · pantallas · informe.js · A2
   A12 · Informe para el propietario · #/informe/<id>. Dos usos, un mismo papel:
     · informe/<id de la visita> (elena…): lo que pasó en esa visita, para el dueño del piso, con las fotos.
     · informe/pere: el de cada lunes (cosa c-pere de “Te toca a ti”): la semana entera. Al enviarlo, esa cosa queda enviada.
   Fotos: salen las de la ficha del piso; “Añadir fotos de la visita” pone dos más (de mentira: en la demo no hay cámara).
   Abajo: “Enviar a Pere” (negro, abre “¿Cómo lo envías?”), “Editar” y “Guardar para luego”.
   FA · dos nombres para que no se confundan: “Informe de la visita” e “Informe de la semana” (van en la frase, bajo el título).
   Enviar uno no toca el otro. Enviado: “Hecho” y un botón negro a la caja por la que se entró. Padre: el de la visita, visita/<id>; el de la semana, cliente/<id>.
   H42 · ¿Cómo lo envías? · WhatsApp, PDF o copiar el texto (correo no). Vale para el acta y para el informe. Nada sale solo. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, r7 = VETA.r7, esc = VETA.esc, ic = VETA.ic, A2 = () => VETA.a2;
  const cuando = h => !h ? '' : /^\d/.test(h) ? ' at ' + h : ' el ' + h;

  // lo que hay que pintar, venga de una visita o del informe de la semana
  function datos(id) {
    const v = A2().visita(id), s = !v && A2().semana(id);
    if (v) return {id: v.id, clave: v.id, v, piso: v.piso, propietario: v.propietario, dia: v.dia.replace(/, \d+:\d+$/, ''), calle: v.calle, titulo: v.informe.titulo, cifras: v.informe.cifras,
      base: {resumen: v.informe.resumen, dijo: v.informe.dijo, paso: v.informe.paso}, hDijo: 'What ' + (v.corto === 'the Casals' ? 'the family' : v.corto) + ' said', cosa: null};
    if (s) return {id, clave: 'semana-' + id, piso: s.piso, propietario: s.propietario, dia: s.dia, calle: (M.piso(s.piso) || {}).nombre || '', titulo: s.titulo, cifras: s.cifras,
      base: {resumen: s.resumen, dijo: s.dijeron.map(x => `${x.quien}: ${x.texto}`).join('\n'), paso: s.paso}, hDijo: 'What they said', cosa: s.cosa, semana: true};
    return null;
  }
  const campo = (x, k) => A2().campo(x.clave, 'informe', k, x.base[k]);
  // cómo está: el de la semana manda su cosa (c-pere), para que “Te toca a ti” y esta pantalla digan lo mismo
  function estado(x) {
    const d = A2().doc(x.clave, 'informe'), c = x.cosa && M.cosa(x.cosa);
    if (c && c.estado === 'enviada') return {estado: 'enviada', hora: c.hora, como: d.como};
    return {estado: d.estado || null, hora: d.hora, como: d.como};
  }
  const area = (x, k, etiqueta, filas) => `<label class="a2-campo"><span class="a2-p-h">${esc(etiqueta)}</span><textarea id="a2-inf-${k}" rows="${filas}">${esc(campo(x, k))}</textarea></label>`;
  const CAMPOS = ['resumen', 'dijo', 'paso'];
  const foto = (f, k) => `<figure class="a2-f a2-f-${k}"><img src="assets/pisos/${esc(f.f)}.webp" alt="${esc(f.pie)}" decoding="async"><figcaption>${esc(f.pie)}</figcaption></figure>`;

  VETA.a2.textoInforme = id => {
    const x = datos(id); if (!x) return '';
    return [`Hi ${A2().corto(x.propietario)}. ${x.titulo}.`, '', campo(x, 'resumen'), '', x.hDijo + ':', ...A2().lineas(campo(x, 'dijo')).map(l => '· ' + l), '', 'Next step: ' + campo(x, 'paso'), '', VETA.yo().nombre].join('\n');
  };

  VETA.pantalla('A12', {
    titulo: p => { A2().llega(p.id); return 'Report for the owner'; },
    completa: true,   // como el acta: un papel para leer y enviar, sin la barra de abajo
    padreRuta: p => A2().semana(p.id) && !A2().visita(p.id) ? 'cliente/' + p.id : null,   // el de la semana cuelga de la ficha del propietario (9c)
    frase: p => {
      const x = datos(p.id); if (!x) return '';
      const corto = A2().corto(x.propietario);
      if (A2().doc(x.clave, 'informe').edita) return 'Change what you want. The photos stay as they are.';
      const que = x.semana ? 'Weekly report.' : 'Viewing report.', e = estado(x);
      if (e.estado === 'enviada') return A2().viejo(e) ? `${que} This is how ${corto} received it.`
        : x.semana ? `${que} Done: ${corto} already has it.` : `${que} Done: ${corto} already has it${A2().doc(x.id, 'acta').estado === 'enviada' ? ' and the notes have been sent' : ''}.`;
      if (e.estado === 'guardada') return `${que} Saved without sending. You send it when you want.`;
      return x.semana ? `${que} ${corto} asked you for it every Monday. You send it yourself.` : `${que} This is how ${corto} will see it. It does not go out by itself: you send it.`;
    },
    pinta: p => {
      const x = datos(p.id);
      if (!x) return UI.vacio({titulo: 'There is no report', texto: 'It appears when you tell me how a viewing went.', icono: 'doc'});
      const d = A2().doc(x.clave, 'informe'), e = estado(x), yo = VETA.yo(), fotos = A2().fotos(x.clave), prop = A2().nombre(x.propietario);
      const mas = !d.fotos && !d.edita && e.estado !== 'enviada';
      let h = `<article class="a2-papel a2-inf${d.edita ? ' a2-edita' : ''}" data-i="0">` +
        `<div class="a2-fotos a2-fotos-${fotos.length}">${fotos.map(foto).join('')}` +
        (mas ? `<button type="button" class="a2-f a2-f-mas" data-accion="fotos">${ic('foto', 24)}<span>${x.semana ? 'Add more photos' : 'Add photos of the viewing'}</span></button>` : '') + '</div>' +
        `<header class="a2-p-cab"><span class="a2-p-tipo">For ${esc(prop)}</span><span class="a2-p-fecha">${esc(x.dia)}</span></header>` +
        `<p class="a2-inf-t">${esc(x.titulo)}</p>`;
      if (d.edita) {
        h += area(x, 'resumen', 'In two sentences', 3) + area(x, 'dijo', x.hDijo, 3) + area(x, 'paso', 'Next step', 2);
      } else {
        const dijo = A2().lineas(campo(x, 'dijo'));
        h += `<p class="a2-inf-x">${esc(campo(x, 'resumen'))}</p>` +
          `<div class="a2-cifras">${x.cifras.map(c => `<div class="a2-cifra"><b>${esc(c.n)}</b><span>${esc(c.t)}</span></div>`).join('')}</div>` +
          `<section class="a2-p-s"><span class="a2-p-h">${esc(x.hDijo)}</span>` +
          (dijo.length > 1 ? `<ul class="a2-ul a2-dijeron">${dijo.map(l => { const k = l.indexOf(':'); return `<li><span>${k > 0 ? `<b>${esc(l.slice(0, k))}</b>${esc(l.slice(k))}` : esc(l)}</span></li>`; }).join('')}</ul>` : `<p>${esc(dijo[0] || '')}</p>`) + '</section>' +
          `<section class="a2-p-s a2-p-ahora"><span class="a2-p-h">Next step</span><p>${esc(campo(x, 'paso'))}</p></section>` +
          `<footer class="a2-firma">${VETA.av(yo.id, 40)}<div class="a2-q-c"><b>${esc(yo.nombre)}</b><span>Your agent</span></div></footer>`;
      }
      h += '</article>';
      // lo que ya había en el informe del lunes y no es del papel: el mensaje de Pere (el porqué, “te lo pidió cada lunes”, va en la frase)
      if (x.semana && !d.edita) {
        const filas = [];
        if (!M.lee('nota-pere-escuchada') && estado(x).estado !== 'enviada') filas.push({icono: 'chat', nombre: 'Pere left you a message', pasa: 'On Saturday. Read it before sending.', hoja: 'h10', de: x.id});
        if (filas.length) h += r7.lista(filas, {i: 1});
      }
      return h;
    },
    botonFijo: p => {
      const x = datos(p.id); if (!x) return '';
      const d = A2().doc(x.clave, 'informe'), e = estado(x), corto = A2().corto(x.propietario);
      if (d.edita) return r7.botones({texto: 'Save the changes', accion: 'guarda-cambios'}, [{texto: 'Change nothing', accion: 'sin-cambios'}]);
      const enviar = {texto: 'Send to ' + corto, hoja: 'h42', datos: {que: 'informe', id: x.id}, icono: 'enviar'};
      if (e.estado) {
        const hecho = `<div class="a2-hecho"><span class="a2-hecho-ic">${ic('check', 18)}</span><span class="a2-hecho-t"><b>${e.estado === 'enviada' ? 'Sent to ' + esc(corto) : e.como === 'pdf' ? 'Saved as a PDF' : 'Saved without sending'}${esc(cuando(e.hora))}</b>` +
          `<span>${e.estado === 'enviada' ? 'It stays in their profile.' : 'You send it when you want.'}</span></span>${e.hora && !/^\d/.test(e.hora) ? '' : '<button type="button" class="a2-enlace" data-accion="deshacer">Undo</button>'}</div>`;
        if (A2().viejo(e)) return hecho;   // un informe de antes: se enseña como quedó
        // lo que sigue va en negro; quien solo lo guardó aún puede enviarlo (botón claro)
        const otros = e.estado === 'enviada' ? [] : [Object.assign({}, enviar)];
        if (!x.semana && A2().falta(x.id) === 'acta') return hecho + r7.botones({texto: 'Next: the notes ›', accion: 'sigue'}, otros);
        const fin = A2().fin(x.semana ? null : 'visitas');
        if (!fin && otros.length) return hecho + r7.botones(enviar);
        return hecho + r7.botones(fin, otros);
      }
      return r7.botones(enviar, [{texto: 'Edit', accion: 'editar', icono: 'editar'}, {texto: 'Save for later', accion: 'guardar'}]);
    },
    acciones: {
      fotos(ev, el, p) { const x = datos(p.id); if (!x) return; A2().ponDoc(x.clave, 'informe', {fotos: true}); VETA.repinta(); const n = VETA.datos.r7a2.fotos.visita.length; VETA.aviso(`${n === 1 ? 'Photo added' : n + ' photos added'}. In the demo it is an example.`); },
      editar(ev, el, p) { const x = datos(p.id); if (!x) return; A2().ponDoc(x.clave, 'informe', {edita: true}); VETA.repinta(); },
      'sin-cambios'(ev, el, p) { const x = datos(p.id); if (!x) return; A2().ponDoc(x.clave, 'informe', {edita: false}); VETA.repinta(); },
      'guarda-cambios'(ev, el, p) {
        const x = datos(p.id); if (!x) return;
        const t = Object.assign({}, A2().doc(x.clave, 'informe').textos || {});
        CAMPOS.forEach(k => { const a = document.getElementById('a2-inf-' + k); if (a) t[k] = a.value.trim(); });
        A2().ponDoc(x.clave, 'informe', {edita: false, textos: t}); VETA.repinta(); VETA.aviso('Changes saved.');
      },
      guardar(ev, el, p) {
        const x = datos(p.id); if (!x) return;
        A2().ponDoc(x.clave, 'informe', {estado: 'guardada', como: 'luego', hora: VETA.ahora()}); VETA.repinta(); VETA.aviso('Saved without sending.');
      },
      sigue(ev, el, p) { const x = datos(p.id); if (x && !x.semana) VETA.ir('acta/' + x.id, {reemplaza: true}); },
      deshacer(ev, el, p) {
        const x = datos(p.id); if (!x) return;
        A2().ponDoc(x.clave, 'informe', {estado: null, como: null, hora: null});
        if (x.cosa) A2().abreCosa(x.cosa);
        VETA.repinta();
      }
    }
  });

  // ---- H42 · ¿Cómo lo envías? (acta o informe). datos: {que: 'acta' | 'informe', id}; antes llegaba {informe: 'pere'} ----
  VETA.hojaAcciones('h42', {
    titulo: 'How do you want to send it?',
    cancelar: false,
    opciones: d => {
      const que = d.que === 'acta' ? 'acta' : 'informe', id = d.id || d.informe || d.acta || 'pere';
      const v = A2().de(id), x = que === 'informe' ? datos(id) : null;
      if (que === 'acta' && !v) return [];
      if (que === 'informe' && !x) return [];
      const clave = que === 'acta' ? v.id : x.clave, cosa = que === 'acta' ? v.cosa : x.cosa;
      const texto = () => que === 'acta' ? A2().textoActa(v) : A2().textoInforme(id);
      const corto = que === 'informe' ? A2().corto(x.propietario) : '';
      const fem = que === 'acta';
      const hecho = (como, estado, aviso) => {
        A2().ponDoc(clave, que, {estado, como, hora: VETA.ahora()});
        if (que === 'acta' && cosa) { VETA.est.pon('a.sinTareaElena', false); A2().cierraCosa(cosa, 'hecha'); }
        if (que === 'informe' && cosa && estado === 'enviada') A2().cierraCosa(cosa, 'enviada');
        VETA.repinta(); VETA.hojaHecha(aviso);
      };
      return [
        {texto: 'WhatsApp', sub: fem ? 'I open WhatsApp with the notes. You choose who gets them and you send them.' : `I open the chat with ${corto} and the report. You send it.`, icono: 'chat', cierra: false,
          hace: () => hecho('whatsapp', 'enviada', (fem ? 'Notes sent.' : 'Sent to ' + corto + '.') + ' In the demo no real message goes out.')},
        {texto: 'PDF', sub: fem ? 'To save it or attach it yourself' : 'With the photos, for you to attach', icono: 'doc', cierra: false,
          hace: () => hecho('pdf', 'guardada', 'PDF saved. You attach it.')},
        {texto: 'Copy the text', sub: 'You paste it wherever you want', icono: 'copiar', cierra: false,
          hace: () => { VETA.copia(texto()); VETA.hojaHecha('Text copied.'); }}];
    }
  });
})();
