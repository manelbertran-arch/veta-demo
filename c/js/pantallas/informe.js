/* Veta demo · ronda 8 · pantallas · informe.js · carril A
   A12 · Informe para el propietario · #/informe/<id>. Documento a pantalla completa (PLAN_R8.md, 8.1). Dos usos, un mismo papel:
     · informe/<id de la visita> (elena…): lo que pasó en esa visita, para el dueño del piso. Se llama «Visita de hoy, para Pere».
     · informe/pere: el de cada lunes (cosa c-pere del día): la semana entera. Se llama «Informe de la semana». Al enviarlo, esa cosa queda enviada.
     No se llaman igual (D5): quien envía el de la visita y ve en Inicio «Pere espera el informe de la semana» sabe que es otro papel.
   El papel: foto, datos, titular, un párrafo, las cifras en filas de dato, lo que dijeron y el siguiente paso.
   «Enviar a Pere» (abre «¿Cómo lo envías?») y la promesa van al final del papel, no en el pie: así el pie no parte ningún párrafo (D24).
   «Más»: Editar · Añadir fotos · Guardar para luego · Ver de dónde sale · Guardar en PDF.
   Enviar uno no toca el otro. Enviado: la fila de «hecho» con su «Deshacer» y, en el pie, el siguiente paso.
   H42 · ¿Cómo lo envías? · WhatsApp, PDF o copiar el texto (correo no). Vale para el acta y para el informe. Nada sale solo. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, r7 = VETA.r7, esc = VETA.esc, A2 = () => VETA.a2;

  // lo que hay que pintar, venga de una visita o del informe de la semana
  function datos(id) {
    const v = A2().visita(id), s = !v && A2().semana(id);
    if (v) return {id: v.id, clave: v.id, v, piso: v.piso, propietario: v.propietario, dia: v.dia.replace(/, \d+:\d+$/, '').replace(/^./, c => c.toLowerCase()), calle: v.calle, titulo: v.informe.titulo, cifras: v.informe.cifras,
      base: {resumen: v.informe.resumen, dijo: v.informe.dijo, paso: v.informe.paso}, hDijo: 'Lo que dijo ' + (v.corto === 'los Casals' ? 'la familia' : v.corto), cosa: null};
    if (s) return {id, clave: 'semana-' + id, piso: s.piso, propietario: s.propietario, dia: s.dia.replace(/^./, c => c.toLowerCase()), calle: (M.piso(s.piso) || {}).nombre || '', titulo: s.titulo, cifras: s.cifras,
      base: {resumen: s.resumen, dijo: s.dijeron.map(x => `${x.quien}: ${x.texto}`).join('\n'), paso: s.paso}, hDijo: 'Lo que dijeron', cosa: s.cosa, semana: true};
    return null;
  }
  const campo = (x, k) => A2().campo(x.clave, 'informe', k, x.base[k]);
  // cómo está: el de la semana manda su cosa (c-pere), para que «Te toca a ti» y esta pantalla digan lo mismo
  function estado(x) {
    const d = A2().doc(x.clave, 'informe'), c = x.cosa && M.cosa(x.cosa);
    if (c && c.estado === 'enviada') return {estado: 'enviada', hora: c.hora, como: d.como};
    return {estado: d.estado || null, hora: d.hora, dia: d.dia, como: d.como};
  }
  const area = (x, k, etiqueta, filas) => `<div class="campo"><label class="campo-e" for="a2-inf-${k}">${esc(etiqueta)}</label><div class="campo-caja"><textarea id="a2-inf-${k}" class="campo-i" rows="${filas}">${esc(campo(x, k))}</textarea></div></div>`;
  const CAMPOS = ['resumen', 'dijo', 'paso'];
  const mayus = t => String(t || '').replace(/^./, c => c.toUpperCase());
  const guardaLuego = (x, como) => A2().ponDoc(x.clave, 'informe', {estado: 'guardada', como, hora: VETA.ahora()});
  // tras enviar o guardar, la fila de «hecho» está arriba del papel: se sube a verla
  const arriba = VETA.a2.arriba = () => { const d = VETA.$('.col.activa .desplaza'); if (d) d.scrollTop = 0; };

  VETA.a2.textoInforme = id => {
    const x = datos(id); if (!x) return '';
    return [`Hola, ${A2().corto(x.propietario)}. ${x.titulo}.`, '', campo(x, 'resumen'), '', x.hDijo + ':', ...A2().lineas(campo(x, 'dijo')).map(l => '· ' + l), '', 'Siguiente paso: ' + campo(x, 'paso'), '', VETA.yo().nombre].join('\n');
  };

  // «Más» del informe (hoja r8-mas): todo lo que no es enviar
  VETA.a2.masInforme = id => {
    const x = datos(id); if (!x) return [];
    const d = A2().doc(x.clave, 'informe'), e = estado(x), l = [];
    if (e.estado !== 'enviada') {
      l.push({texto: 'Editar', hace: () => { A2().ponDoc(x.clave, 'informe', {edita: true}); VETA.repinta(); }});
      if (!d.fotos) l.push({texto: x.semana ? 'Añadir más fotos' : 'Añadir fotos de la visita', hace: () => {
        A2().ponDoc(x.clave, 'informe', {fotos: true}); VETA.repinta();
        const n = VETA.datos.r7a2.fotos.visita.length; VETA.aviso(`${n === 1 ? 'Foto añadida' : n + ' fotos añadidas'}. En la demo es de ejemplo.`);
      }});
      if (!e.estado) l.push({texto: 'Guardar para luego', hace: () => { guardaLuego(x, 'luego'); arriba(); VETA.repinta({hecho: true}); }});
    }
    // de dónde sale: el de la semana, del chat en el que Pere lo pidió; el de una visita, de lo que contaste
    l.push(x.semana ? {texto: 'Ver de dónde sale', hoja: 'h01', datos: {de: x.cosa}} : {texto: 'Ver de dónde sale', hoja: 'h07', datos: {visita: x.id}});
    if (e.estado !== 'enviada') l.push({texto: 'Guardar en PDF', hace: () => { guardaLuego(x, 'pdf'); arriba(); VETA.repinta({hecho: true}); }});
    return l;
  };

  VETA.pantalla('A12', {
    titulo: p => { A2().llega(p.id); const x = datos(p.id); return x ? A2().nombreInforme(x.id) : 'Informe'; },
    completa: true,   // como el acta: un papel para leer y enviar, sin la barra de abajo
    padreRuta: p => A2().semana(p.id) && !A2().visita(p.id) ? 'cliente/' + p.id : null,   // el de la semana cuelga de la ficha del propietario
    sub: p => {
      const x = datos(p.id); if (!x) return '';
      const corto = A2().corto(x.propietario);
      if (A2().doc(x.clave, 'informe').edita) return 'Cambia lo que quieras. Las fotos se quedan como están.';
      if (estado(x).estado) return '';   // enviado o guardado lo dice la fila de «hecho», y solo ella
      return x.semana ? `${corto} te lo pidió cada lunes.` : `Así lo verá ${corto}.`;
    },
    mas: p => { const x = datos(p.id); return x && !A2().doc(x.clave, 'informe').edita ? {hoja: 'r8-mas', datos: {que: 'informe', id: x.id}} : null; },
    casoDictado: p => { const x = datos(p.id); return x ? {tipo: 'informe', de: x.id, quien: x.propietario, titulo: A2().nombreInforme(x.id), texto: campo(x, 'resumen')} : null; },
    pinta: p => {
      const x = datos(p.id);
      if (!x) return r7.vacio('No hay informe de esta visita.');
      const d = A2().doc(x.clave, 'informe'), e = estado(x), yo = VETA.yo(), corto = A2().corto(x.propietario);
      if (d.edita) return area(x, 'resumen', 'En dos frases', 3) + area(x, 'dijo', x.hDijo, 3) + area(x, 'paso', 'Siguiente paso', 2);
      // el final: qué papel es y a quién fue («Visita de hoy enviada a Pere»), con su «Deshacer» (uno de antes se enseña como quedó, sin él)
      const hecho = e.estado ? r7.hecho({texto: e.estado === 'enviada' ? A2().hechoInforme(x.id) : e.como === 'pdf' ? 'Guardado en PDF' : 'Guardado sin enviar', hora: A2().horaDoc(e),
        deshacer: A2().viejo(e) ? null : 'deshacer'}) : '';
      let h = hecho + r7.doc({i: 1, foto: x.piso, datos: [`Para ${A2().nombre(x.propietario)} · ${x.dia}`, `De ${yo.nombre}, tu agente`], titular: x.titulo, texto: campo(x, 'resumen'),
        secciones: [{filas: x.cifras.map(c => ({nombre: mayus(c.t), valor: c.n}))}, {rotulo: x.hDijo, lineas: A2().lineas(campo(x, 'dijo'))}, {rotulo: 'Siguiente paso', texto: campo(x, 'paso')},
          d.fotos ? {rotulo: 'Más fotos', html: `<div class="a2-foto-mas">${UI.foto(x.piso, {tam: 'ancha', n: 1})}</div>`} : null]});
      // lo que ya había en el informe del lunes y no es del papel: el mensaje de Pere
      if (x.semana && !M.lee('nota-pere-escuchada') && e.estado !== 'enviada') h += r7.lista([{cara: x.propietario, nombre: corto + ' te dejó un mensaje', pasa: 'El sábado. Léelo antes de enviar.', hoja: 'h10', de: x.id}], {i: 2});
      // enviar va al final del papel, con la promesa encima: se llega a él leyendo y el pie no tapa nada (D24)
      if (e.estado !== 'enviada') h += `<div class="a2-fin" data-i="3">${r7.nota('envio')}${r7.boton({texto: 'Enviar a ' + corto, hoja: 'h42', datos: {que: 'informe', id: x.id}})}</div>`;
      return h;
    },
    botonFijo: p => {
      const x = datos(p.id); if (!x) return '';
      const d = A2().doc(x.clave, 'informe'), e = estado(x), corto = A2().corto(x.propietario);
      if (d.edita) return r7.botones({texto: 'Guardar', accion: 'guarda-cambios'}, {texto: 'No cambiar', accion: 'sin-cambios'});
      if (e.estado !== 'enviada') return '';   // «Enviar a Pere» está al final del papel
      if (A2().viejo(e)) return '';   // un informe de antes: se enseña como quedó
      // lo que sigue va en negro
      if (!x.semana && A2().falta(x.id) === 'acta') return r7.sigue({texto: 'Siguiente: el acta', accion: 'sigue'});
      const fin = A2().fin();
      return fin ? r7.sigue(fin) : r7.sigue();
    },
    acciones: {
      'sin-cambios'(ev, el, p) { const x = datos(p.id); if (!x) return; A2().ponDoc(x.clave, 'informe', {edita: false}); VETA.repinta(); },
      'guarda-cambios'(ev, el, p) {
        const x = datos(p.id); if (!x) return;
        const t = Object.assign({}, A2().doc(x.clave, 'informe').textos || {});
        CAMPOS.forEach(k => { const a = document.getElementById('a2-inf-' + k); if (a) t[k] = a.value.trim(); });
        A2().ponDoc(x.clave, 'informe', {edita: false, textos: t}); VETA.repinta(); VETA.aviso('Cambios guardados.');
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
    titulo: '¿Cómo lo envías?',
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
      const hecho = (como, estado) => {
        A2().ponDoc(clave, que, {estado, como, hora: VETA.ahora()});
        if (que === 'acta' && cosa) { VETA.est.pon('a.sinTareaElena', false); A2().cierraCosa(cosa, 'hecha'); }
        if (que === 'informe' && cosa && estado === 'enviada') A2().cierraCosa(cosa, 'enviada');
        // una sola confirmación: la fila de «hecho» del papel, que se pinta arriba (se sube a verla). Sin aviso
        VETA.hojaHecha(); arriba(); VETA.repinta({hecho: true});
      };
      return [
        {texto: 'WhatsApp', sub: fem ? 'Te abro WhatsApp con el acta. Eliges a quién y la envías tú.' : `Te abro el chat de ${corto} con el informe. Lo envías tú.`, cierra: false,
          hace: () => hecho('whatsapp', 'enviada')},
        {texto: 'PDF', sub: fem ? 'Para guardarla o adjuntarla tú' : 'Con las fotos, para adjuntarlo tú', cierra: false,
          hace: () => hecho('pdf', 'guardada')},
        {texto: 'Copiar el texto', sub: 'Lo pegas tú donde quieras', cierra: false,
          hace: () => { VETA.copia(texto()); VETA.hojaHecha('Texto copiado.'); }}];
    }
  });
})();
