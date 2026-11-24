/* Veta demo · ronda 8 · pantallas · acta.js · carril A
   A4 · Acta de la visita · #/acta/<id de la visita> (elena, casals, toni, sergi-font). Documento a pantalla completa (PLAN_R8.md, 8.1):
   un papel (foto, datos, la impresión en una frase, lo que le gustó, lo que no y qué toca ahora), “Más” arriba y un botón abajo.
   · Pie: “Enviar el acta” (abre “¿Cómo lo envías?”), con su nota. Enviada o guardada: “Siguiente: informe para Pere” (sin flecha: ningún botón la lleva).
   · “Más”: Editar · Seguir dictando · Contarlo otra vez · Guardar para mí · Ver de dónde sale.
   · Al enviarla o guardarla se cierra su cosa del día (c-elena) y con eso queda apuntada la llamada (modelo.js): lo dice la línea
     “Apuntado: … · en tu calendario”, con “Deshacer”. */
(function () {
  'use strict';
  const UI = VETA.UI, r7 = VETA.r7, esc = VETA.esc, A2 = () => VETA.a2;
  const campo = (v, k) => A2().campo(v.id, 'acta', k, v.acta[k]);
  const area = (v, k, etiqueta, filas) => `<div class="campo"><label class="campo-e" for="a2-acta-${k}">${esc(etiqueta)}</label><div class="campo-caja"><textarea id="a2-acta-${k}" class="campo-i" rows="${filas}">${esc(campo(v, k))}</textarea></div></div>`;
  const CAMPOS = ['impresion', 'gusto', 'no', 'ahora'];
  const guarda = v => { A2().ponDoc(v.id, 'acta', {estado: 'guardada', como: 'mi', hora: VETA.ahora()}); if (v.cosa) { VETA.est.pon('a.sinTareaElena', false); A2().cierraCosa(v.cosa, 'hecha'); } };

  // el texto llano, para copiar o pegar en WhatsApp
  VETA.a2.textoActa = v => [`Viewing notes · ${v.dia}`, `${v.lugar} · ${v.calle}`, `${v.nombre} with ${VETA.yo().nombre}`, '', campo(v, 'impresion'), '',
    'What they liked:', ...A2().lineas(campo(v, 'gusto')).map(x => '· ' + x), '', 'What they did not like:', ...A2().lineas(campo(v, 'no')).map(x => '· ' + x), '', 'What happens next: ' + campo(v, 'ahora')].join('\n');

  // “Más” del acta (hoja r8-mas): todo lo que no es enviar
  VETA.a2.masActa = id => {
    const v = A2().de(id); if (!v) return [];
    const d = A2().doc(v.id, 'acta'), l = [];
    if (!d.estado) {
      l.push({texto: 'Edit', hace: () => { A2().ponDoc(v.id, 'acta', {edita: true}); VETA.repinta(); }});
      l.push({texto: 'Keep dictating', sub: 'Add something to what you told me', hace: () => A2().sigueDictando(v.id)});
      l.push({texto: 'Tell it again', hace: () => A2().otraVez(v.id)});
      l.push({texto: 'Save for me', hace: () => { guarda(v); VETA.repinta(); VETA.aviso('Notes saved in the profile of ' + v.corto + '.'); }});
    }
    // guardada para ti y aún sin enviar: el botón negro ya es el paso siguiente, así que enviarla queda aquí
    if (d.estado === 'guardada' && !A2().viejo(d)) l.push({texto: 'Send the notes', hoja: 'h42', datos: {que: 'acta', id: v.id}});
    l.push({texto: 'See where this comes from', sub: 'What you told me, in your words', hoja: 'h07', datos: {visita: v.id}});
    return l;
  };

  VETA.pantalla('A4', {
    titulo: p => { const v = A2().de(p.id); if (v) A2().llega(v.id); return 'Viewing notes'; },
    sub: p => {
      const v = A2().de(p.id); if (!v) return '';
      const d = A2().doc(v.id, 'acta');
      if (d.edita) return 'Change anything that is not right. One thing on each line.';
      if (d.estado) return d.estado === 'enviada' ? `Sent. It's in ${v.corto}'s profile.` : `Saved. It's in ${v.corto}'s profile.`;
      return '';
    },
    mas: p => { const v = A2().de(p.id); return v && !A2().doc(v.id, 'acta').edita ? {hoja: 'r8-mas', datos: {que: 'acta', id: v.id}} : null; },
    nota: p => { const v = A2().de(p.id), d = v ? A2().doc(v.id, 'acta') : {}; return v && !d.edita && !d.estado ? {texto: 'Nothing goes out without you.', candado: true} : ''; },
    // de qué va la pantalla, para cuando se toca el micro (“quiero las actas de otra manera”)
    casoDictado: p => { const v = A2().de(p.id); return v ? {tipo: 'acta', de: v.id, quien: v.cliente, titulo: 'Viewing notes for ' + v.corto, texto: campo(v, 'impresion')} : null; },
    pinta: p => {
      const v = A2().de(p.id);
      if (!v) return UI.vacio({titulo: 'There are no notes for this viewing', texto: 'Open the viewing and tell me how it went.', icono: 'doc'});
      A2().llega(v.id);   // si se llega aquí, la visita ya está contada (también por el dictado de “Una visita”)
      const d = A2().doc(v.id, 'acta');
      if (d.edita) return area(v, 'impresion', 'In one sentence', 2) + area(v, 'gusto', 'What they liked', 3) + area(v, 'no', 'What they did not like', 3) + area(v, 'ahora', 'What is next', 2);
      // la tarea que nace del acta: apuntada y en el calendario, con “Deshacer” (un acta de antes se enseña como quedó)
      const hecho = d.estado ? UI.lineaHecho({i: 0, texto: `Noted: ${v.acta.apunta} · in your calendar`, boton: A2().viejo(d) ? null : {texto: 'Undo', accion: 'deshacer'}}) : '';
      return hecho + r7.doc({i: 1, foto: v.piso, datos: [v.dia + ' · ' + v.calle.replace(/^c\/ /, ''), `${v.nombre} with ${VETA.yo().nombre}`], titular: campo(v, 'impresion'),
        secciones: [{rotulo: 'What they liked', lineas: A2().lineas(campo(v, 'gusto'))}, {rotulo: 'What they did not like', lineas: A2().lineas(campo(v, 'no'))}, {rotulo: 'What is next', texto: campo(v, 'ahora')}]});
    },
    botonFijo: p => {
      const v = A2().de(p.id); if (!v) return '';
      const d = A2().doc(v.id, 'acta');
      if (d.edita) return r7.botones({texto: 'Save', accion: 'guarda-cambios'}, {texto: 'Keep as is', accion: 'sin-cambios'});
      const enviar = {texto: 'Send the notes', hoja: 'h42', datos: {que: 'acta', id: v.id}};
      if (!d.estado) return r7.botones(enviar);
      if (A2().viejo(d)) return '';   // un acta de antes: se enseña como quedó
      // el camino recto: lo que sigue va en negro
      if (A2().falta(v.id) === 'informe') return r7.botones({texto: 'Next: report for ' + A2().corto(v.propietario), accion: 'sigue'});
      const fin = A2().fin();
      return d.estado === 'enviada' ? (fin ? r7.botones(fin) : '') : r7.botones(enviar);
    },
    acciones: {
      'sin-cambios'(ev, el, p) { const v = A2().de(p.id); if (!v) return; A2().ponDoc(v.id, 'acta', {edita: false}); VETA.repinta(); },
      'guarda-cambios'(ev, el, p) {
        const v = A2().de(p.id); if (!v) return;
        const t = Object.assign({}, A2().doc(v.id, 'acta').textos || {});
        CAMPOS.forEach(k => { const x = document.getElementById('a2-acta-' + k); if (x) t[k] = x.value.trim(); });
        A2().ponDoc(v.id, 'acta', {edita: false, textos: t}); VETA.repinta(); VETA.aviso('Changes saved.');
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
