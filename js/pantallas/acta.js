/* Veta demo · pantallas · acta.js · paquete A (El día)
   A4 · La visita contada · #/acta/<cliente> (elena). Pantalla completa.
   ronda 7: al salir de una visita se cuenta hablando y Veta deja DOS cosas hechas, con fotos y listas para enviar:
     1 · el acta de la visita (queda en la ficha del cliente) y
     2 · el informe para el propietario del piso (tal como lo verá, con las fotos y el mensaje ya escrito).
   Las dos entran plegadas (foto, título y estado): se abren al tocarlas, de una en una.
   «Guardar y enviar el informe» guarda el acta, apunta la tarea y abre WhatsApp con el informe; «Solo guardar» vuelve a lo de hoy.
   Estados: borrador · corrigiendo a mano · PDF preparado · guardada · «¿Lo enviaste?» · informe enviado. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic;
  const acta = p => ((VETA.datos.diaA || {}).acta || {})[p.id] || null;
  const informe = p => ((VETA.datos.diaA || {}).informeVisita || {})[p.id] || null;
  const est = id => VETA.est.lee('a.acta.' + id, {});
  const ponEst = (id, v) => VETA.est.pon('a.acta.' + id, Object.assign({}, est(id), v));
  const dijiste = g => {
    const u = VETA.est.lee('a.ultimoDictado', null);
    const seg = u && u.guion === g ? u.seg : ((VETA.datos.diaA || {}).duracion || {})[g] || 0;
    return VETA.A.mmss(seg);
  };
  const textoDe = (e, b) => ((e.textos || {})[b.id] != null ? e.textos[b.id] : b.texto);

  // la cabecera de cada documento: foto, título, una línea y su estado; se abre al tocarla
  const cabDoc = (id, abierto, o) => `<button type="button" class="a-doc-b" data-accion="doc" data-doc="${id}" aria-expanded="${abierto}">` +
    `${UI.foto(o.piso, {tam: 'mini', n: o.n || 0})}<span class="a-doc-c"><span class="a-doc-t">${esc(o.titulo)}</span><span class="a-doc-s">${esc(o.sub)}</span></span>` +
    `<span class="a-doc-e${o.hecho ? ' a-doc-ok' : ''}">${o.hecho ? ic('check', 16) : ''}${esc(o.estado)}</span><span class="a-doc-ch">${ic('chev', 16)}</span></button>`;

  VETA.pantalla('A4', {
    titulo: p => { const a = acta(p); return a ? 'Visita con ' + a.nombre : 'La visita'; },
    guia: ['Aquí está lo que Veta ha hecho con la visita que le has contado: el acta y el informe para el propietario, con fotos.', 'Tú abres cada uno, lo corriges si hace falta y lo envías.', 'Así el acta queda en la ficha, el propietario sabe cómo ha ido y la llamada queda apuntada.'],
    pinta: p => {
      const a = acta(p);
      if (!a) return UI.vacio({titulo: 'No hay nada de esta visita', texto: 'Cuéntame cómo ha ido y lo preparo.', icono: 'mic', boton: {texto: 'Cuéntame cómo ha ido', ir: 'dictar/acta'}});
      const e = est(p.id), c = M.cosa(a.cosa), guardada = c && c.estado === 'hecha', inf = informe(p);
      const piso = inf ? inf.piso : (c && c.piso) || 'verdi';
      const abre = e.corrige && !guardada ? 'acta' : e.abre;
      let h = `<div class="a-ent" data-i="0"><p class="a-ent-t"><span>${esc(a.donde)}</span></p>` +
        (guardada ? '' : UI.boton({tipo: 'texto', texto: 'No es eso', hoja: 'h09', datos: {guion: 'acta'}, ancho: false})) + '</div>';
      if (e.pdf) h += `<div data-i="0">${UI.lineaHecho({texto: 'PDF preparado, con las fotos. Lo envías tú.', boton: {texto: 'Deshacer', accion: 'sin-pdf'}})}</div>`;

      // 1 · el acta
      let cuerpoActa;
      if (e.corrige && !guardada) {
        cuerpoActa = a.bloques.map(b => UI.campo({etiqueta: b.titulo, area: true, filas: 2, valor: textoDe(e, b), id: 'a-acta-' + b.id})).join('') +
          UI.boton({tipo: 'secundario', texto: 'Dejarlo así', accion: 'deja-corregir', icono: 'check'});
      } else {
        cuerpoActa = `<div class="a-doc-foto">${UI.foto(piso, {tam: 'ancha', ampliar: true})}</div>` +
          a.bloques.map(b => `<section class="a-acta-b"><h3 class="a-acta-t">${esc(b.titulo)}</h3><p class="a-acta-x">${esc(textoDe(e, b))}</p></section>`).join('') +
          (guardada ? '' : UI.boton({tipo: 'texto', texto: 'Corregir a mano', accion: 'corregir', icono: 'editar', ancho: false}));
      }
      h += `<section class="a-doc${abre === 'acta' ? ' abierta' : ''}" data-i="1">` +
        cabDoc('acta', abre === 'acta', {piso, titulo: 'Acta de la visita', sub: a.docSub || a.donde, estado: guardada ? 'Guardada' : 'Hecha', hecho: true}) +
        (abre === 'acta' ? `<div class="a-doc-x a-acta">${cuerpoActa}</div>` : '') + '</section>';

      // 2 · el informe para el propietario, con las fotos, tal como lo verá
      if (inf) {
        const corto = (M.quien(inf.para) || {}).corto || 'el propietario';
        const enviado = guardada && e.inf === 'enviado';
        const cuerpoInf = `<article class="a-doc-carta"><span class="a-inf-r">Así lo verá ${esc(corto)}</span>` +
          `<div class="a-doc-fotos">${UI.foto(inf.piso, {tam: 'ancha', n: 0, ampliar: true})}${UI.foto(inf.piso, {tam: 'ancha', n: 1, ampliar: true})}</div>` +
          `<h3 class="a-inf-t">${esc(inf.titulo)}</h3><p class="a-doc-cuando">${esc(inf.cuando)}</p>` +
          a.bloques.map(b => `<section class="a-acta-b"><h4 class="a-acta-t">${esc((inf.rotulos || {})[b.id] || b.titulo)}</h4><p class="a-acta-x">${esc(textoDe(e, b))}</p></section>`).join('') +
          `<p class="a-inf-firma">${esc(inf.firma)}</p></article>` +
          `<div class="a-doc-msg"><span class="a-doc-msg-r">Tu mensaje para ${esc(corto)}</span><p>${esc(inf.mensaje)}</p></div>` +
          UI.nota({texto: enviado ? 'Enviado desde tu WhatsApp.' : 'No sale hasta que tú lo envíes', icono: enviado ? 'check' : 'candado'});
        h += `<section class="a-doc${abre === 'informe' ? ' abierta' : ''}" data-i="2">` +
          cabDoc('informe', abre === 'informe', {piso: inf.piso, n: 1, titulo: 'Informe al propietario', sub: 'Para ' + ((M.quien(inf.para) || {}).nombre || corto) + ' · 2 fotos',
            estado: enviado ? 'Enviado' : 'Listo', hecho: true}) +
          (abre === 'informe' ? `<div class="a-doc-x">${cuerpoInf}</div>` : '') + '</section>';
      }

      // 3 · la tarea que nace de la visita
      h += `<div class="a-tarea" data-i="3"><span class="a-tarea-ic">${ic('cal', 22)}</span><div class="a-tarea-c"><span class="a-tarea-r">${guardada ? 'He apuntado esta tarea' : 'Al guardar, apunto esta tarea'}</span>` +
        `<p class="a-tarea-t">${esc(a.tarea)}</p><span class="a-tarea-p">${esc(a.tareaPie)}</span></div></div>`;
      h += UI.menores([{titulo: 'Lo que dijiste · ' + dijiste('acta'), icono: 'mic', hoja: 'h07', datos: {guion: 'acta'}}], {i: 3});
      return h;
    },
    botonFijo: p => {
      const a = acta(p); if (!a) return '';
      const c = M.cosa(a.cosa), e = est(p.id), inf = informe(p), guardada = c && c.estado === 'hecha';
      const corto = inf ? ((M.quien(inf.para) || {}).corto || 'el propietario') : '';
      if (inf && guardada && e.inf === 'pregunta') {
        return `<div class="a-preg"><h3 class="tc-preg">¿Enviaste el informe a ${esc(corto)}?</h3>` + UI.boton({texto: 'Sí, enviado', accion: 'inf-si'}) +
          UI.botones([{texto: 'Todavía no', accion: 'inf-no'}]) + UI.nota({texto: 'En esta demo WhatsApp no se abre: no sale ningún mensaje.', clase: 'nota-gris'}) + '</div>';
      }
      if (guardada) {
        const guard = UI.lineaHecho({texto: 'Guardada · Acta de la visita de ' + a.nombre, hora: c.hora, boton: {texto: 'Deshacer', accion: 'deshacer', de: c.id}, vt: 'cola-' + c.id});
        if (inf && e.inf === 'enviado') return UI.lineaHecho({texto: 'Informe enviado a ' + corto, hora: e.infHora, boton: {texto: 'No lo envié', accion: 'inf-no'}}) + guard +
          UI.boton({tipo: 'secundario', texto: 'Volver a lo de hoy', accion: 'volver'});
        return guard + (inf ? UI.boton({texto: 'Abrir WhatsApp con el informe para ' + corto, accion: 'inf-enviar', g: 'Abrir WhatsApp|Te abro tu WhatsApp con el informe. Lo envías tú.'}) : '');
      }
      if (!inf) return UI.boton({texto: 'Guardar el acta de ' + a.nombre, accion: 'guardar'});
      return UI.boton({texto: 'Guardar y enviar el informe a ' + corto, accion: 'guardar-enviar', g: 'Guardar y enviar|Guardo el acta, apunto la llamada y te abro WhatsApp con el informe.'}) +
        UI.botones([{texto: 'Solo guardar', accion: 'guardar'}, {texto: 'Otra cosa…', hoja: 'a-acta', datos: {acta: p.id}}]);
    },
    acciones: {
      doc(ev, el, p) { guardaTextos(p); const e = est(p.id), d = el.dataset.doc; ponEst(p.id, {abre: e.abre === d ? null : d, corrige: d === 'acta' && e.abre === 'acta' ? false : e.corrige}); VETA.repinta(); },
      corregir(ev, el, p) { ponEst(p.id, {corrige: true, abre: 'acta'}); VETA.repinta(); },
      seguir() { const u = VETA.est.lee('a.ultimoDictado', null); VETA.est.pon('a.dictado', {guion: 'acta', seg: u && u.guion === 'acta' ? u.seg : 0}); VETA.ir('dictar/acta', {reemplaza: true}); },
      'deja-corregir'(ev, el, p) { guardaTextos(p); ponEst(p.id, {corrige: false}); VETA.repinta(); },
      'sin-pdf'(ev, el, p) { ponEst(p.id, {pdf: false}); VETA.repinta(); },
      guardar(ev, el, p) { if (guarda(p)) VETA.A.aHoy(); },
      // guarda el acta, apunta la tarea y «abre» WhatsApp con el informe: pregunta si salió
      'guardar-enviar'(ev, el, p) { if (guarda(p)) { ponEst(p.id, {inf: 'pregunta', abre: 'informe'}); VETA.repinta(); } },
      'inf-enviar'(ev, el, p) { ponEst(p.id, {inf: 'pregunta', abre: 'informe'}); VETA.repinta(); },
      'inf-si'(ev, el, p) { ponEst(p.id, {inf: 'enviado', infHora: VETA.ahora(), abre: null}); VETA.repinta(); },
      'inf-no'(ev, el, p) { ponEst(p.id, {inf: null}); VETA.repinta(); },
      volver() { VETA.A.aHoy(); }
    }
  });
  function guarda(p) {
    const a = acta(p); if (!a) return false;
    guardaTextos(p); ponEst(p.id, {corrige: false});
    M.marca(a.cosa, 'hecha');
    VETA.est.pon('a.sinTareaElena', false);
    return true;
  }
  function guardaTextos(p) {
    const a = acta(p); if (!a) return;
    const t = Object.assign({}, est(p.id).textos || {});
    a.bloques.forEach(b => { const x = VETA.$('#a-acta-' + b.id); if (x) t[b.id] = x.value; });
    ponEst(p.id, {textos: t});
  }

  // hoja «Otra cosa…» de la visita
  VETA.hojaAcciones('a-acta', {
    titulo: d => 'Visita con ' + ((acta({id: d.acta || 'elena'}) || {}).nombre || 'el cliente'),
    opciones: d => [
      {texto: 'Corregir el acta a mano', icono: 'editar', hace: () => { ponEst(d.acta || 'elena', {corrige: true, abre: 'acta'}); VETA.repinta(); }},
      {texto: 'Seguir dictando', sub: 'Añades algo a lo que has contado', icono: 'mic', hace: () => { const u = VETA.est.lee('a.ultimoDictado', null); VETA.est.pon('a.dictado', {guion: 'acta', seg: u && u.guion === 'acta' ? u.seg : 0}); VETA.ir('dictar/acta', {reemplaza: true}); }},
      {texto: 'Guardar los dos en PDF', sub: 'El acta y el informe, con las fotos', icono: 'doc', hace: () => { ponEst(d.acta || 'elena', {pdf: true}); VETA.repinta(); }}]
  });
})();
