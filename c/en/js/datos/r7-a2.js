/* Veta demo · ronda 7 · js/datos/r7-a2.js · A2 · Visitas, acta e informe
   Todo inventado y casado con lo que ya dice la demo: hoy es lunes 23 nov; Verdi 42 es de Pere Soler; la semana del 16 al 22
   tuvo 3 visitas (Sergi Font el 17, Toni Ribas el 19, familia Casals el 21) y hoy viene Elena Vives a las 9:00.
   Las visitas son las que se quedaron por WhatsApp. Veta no estuvo: lo que pone el acta sale de lo que cuenta la persona.
   Fotos: “gracia” y “gracia_balcon” son las de la ficha del piso; “santgervasi” (terraza) y “sants” (cocina) hacen aquí de
   “fotos de la visita” (son de mentira: en la demo no hay cámara).

   VETA.datos.r7a2.visitas[] · una visita: id, cliente, nombre, corto, hoy, iso (de ahí salen `cuando`, para la fila, y `dia`, para el
     documento, por VETA.fecha: nadie escribe la fecha a mano), dur, piso, lugar,
     propietario, cosa (la de “Te toca a ti”, si la hay), sabes, inicial (cómo está al empezar la demo),
     dicho (lo que cuenta la persona), acta {impresion, gusto[], no[], ahora, apunta}, informe {nombre, titulo, resumen, dijo, paso, cifras[]}
     informe.nombre: cómo se llama ese papel (“Visita de hoy”): el de una visita y el de la semana no se llaman igual (D5). */
(function () {
  'use strict';
  const D = VETA.datos;
  const VERDI = {piso: 'verdi', lugar: 'Flat in Gràcia', calle: 'c/ Verdi 42, 3.º 2.ª', fila: 'Verdi 42, Gràcia', propietario: 'pere'};
  const v = o => Object.assign({quien: 'laura'}, VERDI, o);

  D.r7a2 = {
    // las fotos del informe: la primera ya está en la ficha del piso; la otra la “añade” la persona. Todas del mismo piso
    // (en assets/pisos solo hay dos de este: gracia y gracia_balcon; las demás son de otros pisos y no se usan aquí)
    fotos: {
      piso: [{f: 'gracia', pie: 'The living room'}],
      visita: [{f: 'gracia_balcon', pie: 'The front of the building'}]
    },
    visitas: [
      v({id: 'elena', cliente: 'elena', nombre: 'Elena Vives', corto: 'Elena', hoy: true, iso: '2026-11-23T09:00', dur: '0:38',
        cosa: 'c-elena', sabes: 'She is looking for 2 bedrooms with light. She is worried about the street noise.',
        dicho: 'I\'ve just left the Verdi flat with Elena. She loved the light in the living room, the terrace and the renovated kitchen. She\'s worried about street noise at night and that there\'s no lift. She wants to come back on Saturday afternoon with her partner to hear the street. Call her on Thursday to confirm.',
        acta: {impresion: 'She liked it a lot. She wants to come back with her partner.',
          gusto: ['The light in the living room', 'The terrace', 'The renovated kitchen'],
          no: ['The street noise at night', 'There is no lift: it is on the third floor'],
          ahora: 'Call Elena on Thursday 26 to confirm the second viewing on Saturday.', apunta: 'Call Elena on Thursday 26'},
        informe: {nombre: 'Today\'s viewing', titulo: 'Today\'s viewing of your flat in Gràcia',
          resumen: 'Elena Vives came today to see your flat. She liked it a lot and wants to come back on Saturday with her partner.',
          dijo: 'She loves the light in the living room, the terrace and the renovated kitchen. The street noise at night and the lack of a lift put her off.',
          paso: 'Second viewing on Saturday afternoon. I call her on Thursday to confirm it and I will tell you.',
          cifras: [{n: 4, t: 'viewings since 16 November'}, {n: 2, t: 'want to come back'}]}}),
      v({id: 'casals', cliente: 'casals', nombre: 'Casals family', corto: 'the Casals', iso: '2026-11-21T11:00', dur: '0:21',
        inicial: {contada: true, acta: {estado: 'enviada', hora: 'Sat 21', dia: '2026-11-21'}, informe: {estado: 'enviada', hora: 'Sat 21', dia: '2026-11-21'}},
        sabes: 'There are four of them. They are looking for 3 bedrooms in Gràcia.',
        dicho: 'The Casals came on Saturday to Verdi. They like the flat, above all the terrace and that it has three bedrooms. They think it is expensive. They want to think about it this week. Write to them on Wednesday.',
        acta: {impresion: 'They like it. They think it is expensive and want to think about it.',
          gusto: ['The terrace', 'The three bedrooms'],
          no: ['The price: they think it is expensive'],
          ahora: 'Write to the Casals on Wednesday 25 to find out what they thought.', apunta: 'Write to them on Wednesday 25'},
        informe: {nombre: 'Saturday\'s viewing', titulo: 'Saturday\'s viewing of your flat in Gràcia',
          resumen: 'The Casals family came on Saturday. They like the flat, but they think it is expensive and want to think about it.',
          dijo: 'They like the terrace and the three bedrooms. The price puts them off.',
          paso: 'I write to them on Wednesday to find out what they thought and I will tell you.',
          cifras: [{n: 3, t: 'viewings last week'}, {n: 3, t: 'think the price is high'}]}}),
      v({id: 'toni', cliente: 'toni', nombre: 'Toni Ribas', corto: 'Toni', iso: '2026-11-19T17:30', dur: '0:29',
        inicial: {contada: true, acta: {estado: 'enviada', hora: 'Thu 19', dia: '2026-11-19'}, informe: {estado: 'enviada', hora: 'Thu 19', dia: '2026-11-19'}},
        dicho: 'I showed Verdi to Toni Ribas. He likes the light and the terrace. He thinks the price is high and wants to know if the kitchen wall can be knocked down. He will come back with his architect.',
        acta: {impresion: 'He likes it. He will come back with his architect.',
          gusto: ['The light', 'The terrace'],
          no: ['The price: he thinks it is high', 'He does not know if the kitchen can be opened up'],
          ahora: 'Offer him two times to come back with his architect.', apunta: 'Suggest a time to come back'},
        informe: {nombre: 'Thursday\'s viewing', titulo: 'Thursday\'s viewing of your flat in Gràcia',
          resumen: 'Toni Ribas came on Thursday. He likes the flat and will come back with his architect.',
          dijo: 'He likes the light and the terrace. He thinks the price is high and wants to know if the kitchen can be opened up.',
          paso: 'I offer him two times to come back with his architect and I will tell you.',
          cifras: [{n: 2, t: 'viewings this week'}, {n: 1, t: 'wants to come back'}]}}),
      v({id: 'sergi-font', cliente: 'sergi-font', nombre: 'Sergi Font', corto: 'Sergi', iso: '2026-11-17T13:00', dur: '0:17',
        inicial: {contada: true, acta: {estado: 'enviada', hora: 'Tue 17', dia: '2026-11-17'}, informe: {estado: 'enviada', hora: 'Tue 17', dia: '2026-11-17'}},
        dicho: 'Sergi Font saw Verdi. He likes the light. He thinks it is expensive and does not want a third floor with no lift. I do not think he will come back.',
        acta: {impresion: 'It does not suit him: he thinks it is expensive and it has no lift.',
          gusto: ['The light'],
          no: ['The price: he thinks it is expensive', 'There is no lift'],
          ahora: 'Nothing more with this flat. Tell him if one with a lift comes in.', apunta: 'Let them know if one with a lift comes up'},
        informe: {nombre: 'Tuesday\'s viewing', titulo: 'Tuesday\'s viewing of your flat in Gràcia',
          resumen: 'Sergi Font came on Tuesday. He likes the light, but it does not suit him.',
          dijo: 'He thinks it is expensive and does not want a third floor with no lift.',
          paso: 'There are two more viewings this week. I will tell you after each one.',
          cifras: [{n: 1, t: 'viewing this week'}, {n: 2, t: 'more viewings, already arranged'}]}})
    ],
    // el informe de cada lunes para Pere (ruta informe/pere, cosa c-pere): la semana entera con el mismo papel
    semana: {
      pere: {cosa: 'c-pere', piso: 'verdi', propietario: 'pere', nombre: 'Weekly report', dia: '16-22 November',
        titulo: 'How your Gràcia flat is doing',
        resumen: 'Last week 3 people came to see it. All 3 like the light and all 3 think the price is high.',
        dijeron: [{quien: 'Sergi Font', texto: 'expensive and no lift.'},
          {quien: 'Toni Ribas', texto: 'coming back with his architect.'},
          {quien: 'Casals family', texto: 'they like it; find it expensive.'}],
        paso: 'Shall we talk about the price on Thursday?',
        cifras: [{n: 3, t: 'Viewings'}, {n: 3, t: 'They like the light'}, {n: 3, t: 'They find it expensive'}]}
    }
  };
  // cuándo fue cada visita, siempre con el mismo formato: “Sáb 21, 11:00” en la fila y “Sábado 21 de noviembre, 11:00” en el papel
  D.r7a2.visitas.forEach(x => {
    Object.defineProperty(x, 'cuando', {get: () => VETA.fecha.corta(x.iso)});
    Object.defineProperty(x, 'dia', {get: () => VETA.fecha.larga(x.iso)});
  });
})();

/* ---- VETA.a2 · lo que comparten visitas.js, visita.js, acta.js e informe.js (todo se calcula al llamar, no al cargar) ----
   Estado de una visita, en VETA.est, clave “r7a2.v.<id>”: {contada, dicho, acta: {estado: 'guardada'|'enviada', como, hora, textos, pdf}, informe: {…, fotos}} */
(function () {
  'use strict';
  const D = () => VETA.datos.r7a2, K = id => 'r7a2.v.' + id;
  const A2 = VETA.a2 = {};
  A2.visitas = () => D().visitas.slice();
  A2.visita = id => D().visitas.find(v => v.id === id) || null;
  // aguanta cualquier id: el de la visita, o el del propietario o el cliente (entrada en frío desde informe/pere)
  A2.de = id => A2.visita(id) || D().visitas.find(v => v.propietario === id && v.hoy) || D().visitas.find(v => v.cliente === id) || null;
  A2.semana = id => D().semana[id] || null;
  A2.est = id => { const v = A2.visita(id); return Object.assign({}, (v && v.inicial) || {}, VETA.est.lee(K(id), {})); };
  A2.pon = (id, cambios) => VETA.est.pon(K(id), Object.assign(A2.est(id), cambios));
  A2.doc = (id, que) => A2.est(id)[que] || {};
  A2.ponDoc = (id, que, cambios) => A2.pon(id, {[que]: Object.assign({}, A2.doc(id, que), cambios)});
  A2.quita = id => VETA.est.pon(K(id), {});
  // quien llega a un papel de una visita (también por enlace o recarga) la tiene ya contada. Se llama desde el título del papel,
  // que el armazón pide antes que el del padre: así el volver dice “Listo para enviar” y no “Visita con Elena”
  A2.llega = id => { const v = A2.visita(id); if (v && !A2.est(v.id).contada) A2.pon(v.id, {contada: true}); };
  // cómo está el acta de una visita, en palabras (va en la segunda línea de su fila: ya no hay pastillas)
  A2.estadoActa = v => {
    const e = A2.est(v.id), a = e.acta || {};
    if (!e.contada) return v.hoy ? '' : 'Notes missing';
    return a.estado === 'enviada' ? 'Notes sent' : a.estado === 'guardada' ? 'Notes saved' : 'Notes ready';
  };
  // cómo está un papel (segunda línea de su fila: un estado no va en la cola): “Sin enviar” · “Enviada” / “Guardada” (el acta) · “Enviado” / “Guardado” (el informe)
  A2.estadoDoc = (d, fem) => d.estado === 'enviada' ? (fem ? 'Sent' : 'Sent') : d.estado === 'guardada' ? (fem ? 'Saved' : 'Saved') : 'Not sent';
  // la hora de un papel ya enviado o guardado: la de hoy tal cual (“9:41”); la de otro día, por VETA.fecha (“Sáb 21”)
  A2.horaDoc = d => (d && d.dia ? VETA.fecha.corta(d.dia) : (d || {}).hora || null);
  // cómo se llama el informe: el de una visita, “Visita de hoy, para Pere”; el de cada lunes, “Informe de la semana” (D5: no se llaman igual)
  A2.nombreInforme = id => { const v = A2.visita(id), s = !v && A2.semana(id); return v ? (v.informe.nombre || 'Viewing') + ', for  ' + A2.corto(v.propietario) : s ? s.nombre : 'Report'; };
  // la fila de “hecho” de cada uno, en un renglón: el título de la pantalla ya dice qué papel es (“Enviada a Pere”, la visita; “Enviado a Pere”, el informe)
  A2.hechoInforme = id => { const v = A2.visita(id), s = !v && A2.semana(id); return v ? 'Sent to  ' + A2.corto(v.propietario) : s ? 'Sent to ' + A2.corto(s.propietario) : 'Sent'; };
  // el camino recto (FA): qué papel de la visita falta por enviar o guardar. Primero el acta, luego el informe; null = ya están los dos
  A2.falta = id => { const e = A2.est(id); return !(e.acta || {}).estado ? 'acta' : !(e.informe || {}).estado ? 'informe' : null; };
  // un papel de antes (su hora no es de hoy: “jue 19”): se enseña como quedó, sin botones de camino
  A2.viejo = d => !!(d && d.hora && !/^\d/.test(d.hora));
  // el botón negro del final: lleva al sitio por el que se entró (Visitas, o Inicio si se vino de la lista del día)
  A2.fin = () => { const p = VETA.pila ? VETA.pila() : [];
    if (p.some(x => x.ruta === 'visitas')) return {texto: 'Go to Viewings', ir: 'visitas'};
    return p.length <= 3 && p[0] && p[0].ruta === 'inicio' && !p.some(x => /^cliente\//.test(x.ruta)) ? {texto: 'Go to Home', ir: 'inicio'} : null; };
  A2.corto = id => ((VETA.modelo.quien(id) || {}).corto) || ((VETA.modelo.quien(id) || {}).nombre || '').split(' ')[0] || '';
  A2.nombre = id => (VETA.modelo.quien(id) || {}).nombre || id;
  // el texto de un campo: lo que cambió la persona o lo que dejó Veta. Las listas viajan como líneas.
  A2.campo = (id, que, k, porDefecto) => { const t = (A2.doc(id, que).textos || {})[k]; return t != null ? t : (Array.isArray(porDefecto) ? porDefecto.join('\n') : porDefecto || ''); };
  A2.lineas = t => String(t || '').split('\n').map(x => x.trim()).filter(Boolean);
  // las fotos del informe: las de la ficha y, si la persona las añadió, las de la visita
  A2.fotos = (id, que) => D().fotos.piso.concat(A2.doc(id, que || 'informe').fotos ? D().fotos.visita : []);
  // cerrar o reabrir la cosa de “Te toca a ti” que va con este papel, para que caja, barra y lista digan lo mismo
  A2.cierraCosa = (cosa, estado) => { const c = cosa && VETA.modelo.cosa(cosa); if (c && !VETA.modelo.RESUELTOS.includes(c.estado)) VETA.modelo.marca(cosa, estado); if (VETA.pintaBarra) VETA.pintaBarra(); };
  A2.abreCosa = cosa => { const c = cosa && VETA.modelo.cosa(cosa); if (c && VETA.modelo.RESUELTOS.includes(c.estado)) VETA.modelo.deshaz(cosa); if (VETA.pintaBarra) VETA.pintaBarra(); };
})();
