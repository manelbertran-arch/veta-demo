/* Veta demo · ronda 7 · js/datos/r7-a2.js · A2 · Visitas, acta e informe
   Todo inventado y casado con lo que ya dice la demo: hoy es lunes 23 nov; Verdi 42 es de Pere Soler; la semana del 16 al 22
   tuvo 3 visitas (Sergi Font el 17, Toni Ribas el 19, familia Casals el 21) y hoy viene Elena Vives a las 9:00.
   Las visitas son las que se quedaron por WhatsApp. Veta no estuvo: lo que pone el acta sale de lo que cuenta la persona.
   Fotos: «gracia» y «gracia_balcon» son las de la ficha del piso; «santgervasi» (terraza) y «sants» (cocina) hacen aquí de
   «fotos de la visita» (son de mentira: en la demo no hay cámara).

   VETA.datos.r7a2.visitas[] · una visita: id, cliente, nombre, corto, hoy, iso (de ahí salen `cuando`, para la fila, y `dia`, para el
     documento, por VETA.fecha: nadie escribe la fecha a mano), dur, piso, lugar,
     propietario, cosa (la de «Te toca a ti», si la hay), sabes, inicial (cómo está al empezar la demo),
     dicho (lo que cuenta la persona), acta {impresion, gusto[], no[], ahora, apunta}, informe {nombre, titulo, resumen, dijo, paso, cifras[]}
     informe.nombre: cómo se llama ese papel («Visita de hoy»): el de una visita y el de la semana no se llaman igual (D5). */
(function () {
  'use strict';
  const D = VETA.datos;
  const VERDI = {piso: 'verdi', lugar: 'Piso de Gràcia', calle: 'c/ Verdi 42, 3.º 2.ª', fila: 'Verdi 42, Gràcia', propietario: 'pere'};
  const v = o => Object.assign({quien: 'laura'}, VERDI, o);

  D.r7a2 = {
    // las fotos del informe: la primera ya está en la ficha del piso; la otra la «añade» la persona. Todas del mismo piso
    // (en assets/pisos solo hay dos de este: gracia y gracia_balcon; las demás son de otros pisos y no se usan aquí)
    fotos: {
      piso: [{f: 'gracia', pie: 'El salón'}],
      visita: [{f: 'gracia_balcon', pie: 'La fachada'}]
    },
    visitas: [
      v({id: 'elena', cliente: 'elena', nombre: 'Elena Vives', corto: 'Elena', hoy: true, iso: '2026-11-23T09:00', dur: '0:38',
        cosa: 'c-elena', sabes: 'Busca 2 habitaciones con luz. Le preocupa el ruido de la calle.',
        dicho: 'Acabo de salir del piso de Verdi con Elena. Le ha encantado la luz del salón y la terraza, y la cocina reformada. Le preocupa el ruido de la calle por la noche y que no haya ascensor. Quiere volver el sábado por la tarde con su pareja para oír la calle. Llámala el jueves para confirmarlo.',
        acta: {impresion: 'Le ha gustado mucho. Quiere volver con su pareja.',
          gusto: ['La luz del salón', 'La terraza', 'La cocina reformada'],
          no: ['El ruido de la calle por la noche', 'Que no haya ascensor: es un tercero'],
          ahora: 'Llamar a Elena el jueves 26 para confirmar la segunda visita del sábado.', apunta: 'Llamar a Elena el jueves 26'},
        informe: {nombre: 'Visita de hoy', titulo: 'Visita de hoy a tu piso de Gràcia',
          resumen: 'Hoy ha venido Elena Vives a ver tu piso. Le ha gustado mucho y quiere volver el sábado con su pareja.',
          dijo: 'Le encantan la luz del salón, la terraza y la cocina reformada. Le frenan el ruido de la calle por la noche y que no haya ascensor.',
          paso: 'Segunda visita el sábado por la tarde. La llamo el jueves para confirmarla y te cuento.',
          cifras: [{n: 4, t: 'visitas desde el 16 de noviembre'}, {n: 2, t: 'quieren volver'}]}}),
      v({id: 'casals', cliente: 'casals', nombre: 'Família Casals', corto: 'los Casals', iso: '2026-11-21T11:00', dur: '0:21',
        inicial: {contada: true, acta: {estado: 'enviada', hora: 'sáb 21', dia: '2026-11-21'}, informe: {estado: 'enviada', hora: 'sáb 21', dia: '2026-11-21'}},
        sabes: 'Son cuatro. Buscan 3 habitaciones en Gràcia.',
        dicho: 'Los Casals vinieron el sábado a Verdi. Les gusta el piso, sobre todo la terraza y que tenga tres habitaciones. Lo ven caro. Quieren pensarlo esta semana. Escríbeles el miércoles.',
        acta: {impresion: 'Les gusta. Lo ven caro y quieren pensarlo.',
          gusto: ['La terraza', 'Las tres habitaciones'],
          no: ['El precio: lo ven caro'],
          ahora: 'Escribir a los Casals el miércoles 25 para saber qué han pensado.', apunta: 'Escribirles el miércoles 25'},
        informe: {nombre: 'Visita del sábado', titulo: 'Visita del sábado a tu piso de Gràcia',
          resumen: 'El sábado vino la familia Casals. Les gusta el piso, pero lo ven caro y quieren pensarlo.',
          dijo: 'Les gustan la terraza y las tres habitaciones. Les frena el precio.',
          paso: 'Les escribo el miércoles para saber qué han pensado y te cuento.',
          cifras: [{n: 3, t: 'visitas la semana pasada'}, {n: 3, t: 'ven alto el precio'}]}}),
      v({id: 'toni', cliente: 'toni', nombre: 'Toni Ribas', corto: 'Toni', iso: '2026-11-19T17:30', dur: '0:29',
        inicial: {contada: true, acta: {estado: 'enviada', hora: 'jue 19', dia: '2026-11-19'}, informe: {estado: 'enviada', hora: 'jue 19', dia: '2026-11-19'}},
        dicho: 'He enseñado Verdi a Toni Ribas. Le gusta la luz y la terraza. Le parece alto el precio y quiere saber si se puede tirar el tabique de la cocina. Volverá con su arquitecto.',
        acta: {impresion: 'Le gusta. Volverá con su arquitecto.',
          gusto: ['La luz', 'La terraza'],
          no: ['El precio: le parece alto', 'No sabe si se puede abrir la cocina'],
          ahora: 'Proponerle dos horas para volver con su arquitecto.', apunta: 'Proponerle hora para volver'},
        informe: {nombre: 'Visita del jueves', titulo: 'Visita del jueves a tu piso de Gràcia',
          resumen: 'El jueves vino Toni Ribas. Le gusta el piso y volverá con su arquitecto.',
          dijo: 'Le gustan la luz y la terraza. Le parece alto el precio y quiere saber si se puede abrir la cocina.',
          paso: 'Le propongo dos horas para volver con su arquitecto y te cuento.',
          cifras: [{n: 2, t: 'visitas esta semana'}, {n: 1, t: 'quiere volver'}]}}),
      v({id: 'sergi-font', cliente: 'sergi-font', nombre: 'Sergi Font', corto: 'Sergi', iso: '2026-11-17T13:00', dur: '0:17',
        inicial: {contada: true, acta: {estado: 'enviada', hora: 'mar 17', dia: '2026-11-17'}, informe: {estado: 'enviada', hora: 'mar 17', dia: '2026-11-17'}},
        dicho: 'Sergi Font ha visto Verdi. Le gusta la luz. Lo ve caro y no quiere un tercero sin ascensor. No creo que vuelva.',
        acta: {impresion: 'No le encaja: lo ve caro y sin ascensor.',
          gusto: ['La luz'],
          no: ['El precio: lo ve caro', 'Que no haya ascensor'],
          ahora: 'Nada más con este piso. Avisarle si entra uno con ascensor.', apunta: 'Avisarle si entra uno con ascensor'},
        informe: {nombre: 'Visita del martes', titulo: 'Visita del martes a tu piso de Gràcia',
          resumen: 'El martes vino Sergi Font. Le gusta la luz, pero no le encaja.',
          dijo: 'Lo ve caro y no quiere un tercero sin ascensor.',
          paso: 'Esta semana hay dos visitas más. Te cuento después de cada una.',
          cifras: [{n: 1, t: 'visita esta semana'}, {n: 2, t: 'visitas más, ya quedadas'}]}})
    ],
    // el informe de cada lunes para Pere (ruta informe/pere, cosa c-pere): la semana entera con el mismo papel
    semana: {
      pere: {cosa: 'c-pere', piso: 'verdi', propietario: 'pere', nombre: 'Informe de la semana', dia: '16-22 de noviembre',
        titulo: 'Así va tu piso de Gràcia',
        resumen: 'La semana pasada vinieron 3 personas a verlo. A las 3 les gusta la luz y a las 3 les parece alto el precio.',
        dijeron: [{quien: 'Sergi Font', texto: 'caro y sin ascensor.'},
          {quien: 'Toni Ribas', texto: 'volverá con su arquitecto.'},
          {quien: 'Família Casals', texto: 'les gusta; lo ven caro.'}],
        paso: '¿Hablamos del precio el jueves?',
        cifras: [{n: 3, t: 'Visitas'}, {n: 3, t: 'Les gusta la luz'}, {n: 3, t: 'Lo ven caro'}]}
    }
  };
  // cuándo fue cada visita, siempre con el mismo formato: «Sáb 21, 11:00» en la fila y «Sábado 21 de noviembre, 11:00» en el papel
  D.r7a2.visitas.forEach(x => {
    Object.defineProperty(x, 'cuando', {get: () => VETA.fecha.corta(x.iso)});
    Object.defineProperty(x, 'dia', {get: () => VETA.fecha.larga(x.iso)});
  });
})();

/* ---- VETA.a2 · lo que comparten visitas.js, visita.js, acta.js e informe.js (todo se calcula al llamar, no al cargar) ----
   Estado de una visita, en VETA.est, clave «r7a2.v.<id>»: {contada, dicho, acta: {estado: 'guardada'|'enviada', como, hora, textos, pdf}, informe: {…, fotos}} */
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
  // que el armazón pide antes que el del padre: así el volver dice «Listo para enviar» y no «Visita con Elena»
  A2.llega = id => { const v = A2.visita(id); if (v && !A2.est(v.id).contada) A2.pon(v.id, {contada: true}); };
  // cómo está el acta de una visita, en palabras (va en la segunda línea de su fila: ya no hay pastillas)
  A2.estadoActa = v => {
    const e = A2.est(v.id), a = e.acta || {};
    if (!e.contada) return v.hoy ? '' : 'Falta el acta';
    return a.estado === 'enviada' ? 'Acta enviada' : a.estado === 'guardada' ? 'Acta guardada' : 'Acta lista';
  };
  // cómo está un papel (segunda línea de su fila: un estado no va en la cola): «Sin enviar» · «Enviada» / «Guardada» (el acta) · «Enviado» / «Guardado» (el informe)
  A2.estadoDoc = (d, fem) => d.estado === 'enviada' ? (fem ? 'Enviada' : 'Enviado') : d.estado === 'guardada' ? (fem ? 'Guardada' : 'Guardado') : 'Sin enviar';
  // la hora de un papel ya enviado o guardado: la de hoy tal cual («9:41»); la de otro día, por VETA.fecha («Sáb 21»)
  A2.horaDoc = d => (d && d.dia ? VETA.fecha.corta(d.dia) : (d || {}).hora || null);
  // cómo se llama el informe: el de una visita, «Visita de hoy, para Pere»; el de cada lunes, «Informe de la semana» (D5: no se llaman igual)
  A2.nombreInforme = id => { const v = A2.visita(id), s = !v && A2.semana(id); return v ? (v.informe.nombre || 'Visita') + ', para ' + A2.corto(v.propietario) : s ? s.nombre : 'Informe'; };
  // la fila de «hecho» de cada uno, en un renglón: el título de la pantalla ya dice qué papel es («Enviada a Pere», la visita; «Enviado a Pere», el informe)
  A2.hechoInforme = id => { const v = A2.visita(id), s = !v && A2.semana(id); return v ? 'Enviada a ' + A2.corto(v.propietario) : s ? 'Enviado a ' + A2.corto(s.propietario) : 'Enviado'; };
  // el camino recto (FA): qué papel de la visita falta por enviar o guardar. Primero el acta, luego el informe; null = ya están los dos
  A2.falta = id => { const e = A2.est(id); return !(e.acta || {}).estado ? 'acta' : !(e.informe || {}).estado ? 'informe' : null; };
  // un papel de antes (su hora no es de hoy: «jue 19»): se enseña como quedó, sin botones de camino
  A2.viejo = d => !!(d && d.hora && !/^\d/.test(d.hora));
  // el botón negro del final: lleva al sitio por el que se entró (Visitas, o Inicio si se vino de la lista del día)
  A2.fin = () => { const p = VETA.pila ? VETA.pila() : [];
    if (p.some(x => x.ruta === 'visitas')) return {texto: 'Ir a Visitas', ir: 'visitas'};
    return p.length <= 3 && p[0] && p[0].ruta === 'inicio' && !p.some(x => /^cliente\//.test(x.ruta)) ? {texto: 'Ir a Inicio', ir: 'inicio'} : null; };
  A2.corto = id => ((VETA.modelo.quien(id) || {}).corto) || ((VETA.modelo.quien(id) || {}).nombre || '').split(' ')[0] || '';
  A2.nombre = id => (VETA.modelo.quien(id) || {}).nombre || id;
  // el texto de un campo: lo que cambió la persona o lo que dejó Veta. Las listas viajan como líneas.
  A2.campo = (id, que, k, porDefecto) => { const t = (A2.doc(id, que).textos || {})[k]; return t != null ? t : (Array.isArray(porDefecto) ? porDefecto.join('\n') : porDefecto || ''); };
  A2.lineas = t => String(t || '').split('\n').map(x => x.trim()).filter(Boolean);
  // las fotos del informe: las de la ficha y, si la persona las añadió, las de la visita
  A2.fotos = (id, que) => D().fotos.piso.concat(A2.doc(id, que || 'informe').fotos ? D().fotos.visita : []);
  // cerrar o reabrir la cosa de «Te toca a ti» que va con este papel, para que caja, barra y lista digan lo mismo
  A2.cierraCosa = (cosa, estado) => { const c = cosa && VETA.modelo.cosa(cosa); if (c && !VETA.modelo.RESUELTOS.includes(c.estado)) VETA.modelo.marca(cosa, estado); if (VETA.pintaBarra) VETA.pintaBarra(); };
  A2.abreCosa = cosa => { const c = cosa && VETA.modelo.cosa(cosa); if (c && VETA.modelo.RESUELTOS.includes(c.estado)) VETA.modelo.deshaz(cosa); if (VETA.pintaBarra) VETA.pintaBarra(); };
})();
