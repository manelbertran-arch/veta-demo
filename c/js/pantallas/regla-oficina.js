/* Veta demo · pantallas · regla-oficina.js · paquete D (Dirección)
   G2b · Una regla para la oficina · #/regla-oficina/<id> — dossier (propuesta de Laura), mismo-dia (a prueba) y actas (en marcha).
   Estados: propuesta → «Ponerla a prueba» → «A prueba con todo el equipo hasta el 7 de diciembre · Deshacer».
   Tras la prueba: «Extenderla a todo el equipo» → confirmación (a quién, qué cambia, desde cuándo) → «En marcha · la usa todo el equipo · Deshacer». */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir;
  const R = id => (VETA.datos.reglasOficina || {})[id] || VETA.datos.reglasOficina.dossier;
  let confirmando = null;                                        // id de la regla que enseña su confirmación

  // fase de una regla: 'propuesta' | 'a-prueba' | 'en-marcha' | 'descartada' | 'luego'
  function fase(id) {
    const r = R(id);
    if (r.decision) {
      const c = M.cosa(r.decision);
      if (!c || !X.resuelta(c)) return {f: 'propuesta'};
      const x = c.extra || {};
      if (c.estado === 'quitada') return {f: 'descartada', linea: x.linea, hora: c.hora};
      if (c.estado === 'para-manana') return {f: 'luego', linea: x.linea, hora: c.hora};
      return {f: x.fase || 'a-prueba', linea: x.linea || 'A prueba con todo el equipo hasta el 7 de diciembre', hora: c.hora};
    }
    const e = X.lee('practicas', {})[id];
    if (e) return {f: 'en-marcha', linea: 'En marcha · la usa todo el equipo', hora: e.hora, propio: true};
    return {f: r.estado, inicial: true};
  }
  const etq = f => ({propuesta: ['por-decidir', 'Tienes que decidir'], 'a-prueba': ['a-prueba', null], 'en-marcha': ['en-marcha', null], descartada: ['cerrado', 'Descartada'], luego: ['para-manana', 'Para luego']})[f] || ['por-decidir', null];

  VETA.pantalla('G2b', {
    titulo: p => R(p.id).titulo,
    frase: p => {
      const r = R(p.id), e = fase(p.id);
      if (confirmando === p.id) return 'Vas a extenderlo a todo el equipo. Mira a quién, qué cambia y desde cuándo.';
      return ({propuesta: 'Pruébalo dos semanas sin que salga nada, o elige otra cosa. Decides tú.',
        'a-prueba': 'A prueba hasta el 7 de diciembre. Nadie recibe nada. Al acabar, decides si se queda.',
        'en-marcha': 'Ya lo hace la oficina. Puedes dejar que lo haga yo sin pedir permiso.'})[e.f] || r.propone + '.';
    },
    // ronda 7 · D2: una ficha (la propuesta, en oro), «¿Quién lo hace?» y una lista; sin títulos de sección (R2)
    pinta: p => {
      const r = R(p.id), e = fase(p.id), tt = etq(e.f)[1];
      if (confirmando === p.id) {
        return `<div class="r7-ficha" data-i="0"><span class="r7-ficha-de">${esc(r.titulo)}</span>` +
          `<dl class="d-confirma">` +
          `<div><dt>A quién</dt><dd>Las 6 personas del equipo: Laura, Montse, Anna, Teresa, Marc y David.</dd></div>` +
          `<div><dt>Qué cambia</dt><dd>${esc(r.frase)} Cada agente sigue enviando lo suyo: Veta no manda nada sola.</dd></div>` +
          `<div><dt>Desde cuándo</dt><dd>Desde mañana, martes 24 de noviembre. Si no convence, lo quitas desde aquí.</dd></div></dl></div>`;
      }
      let h = '';
      if (e.linea && !e.inicial) h += `<div class="d2-hecho" data-i="0">${UI.lineaHecho({texto: e.linea, hora: e.hora, vt: 'regla-' + p.id, boton: {texto: 'Deshacer', accion: 'deshacer-regla'}})}</div>`;
      h += `<div class="r7-ficha r7-oro" data-i="0"><span class="r7-ficha-de">${esc(r.propone)}</span><p>${esc(r.frase)}</p>` +
        (tt && e.f !== 'propuesta' ? `<p>${VETA.r7.pastilla(tt, 'gris')}</p>` : '') + VETA.r7.ensena({guion: 'orden', texto: 'Enséñale otra forma'}) + `</div>`;
      // «¿Quién lo hace?»: los cinco pasos a la vista; la que ya está en marcha pregunta si sube uno, con sus casos contados
      const sube = X.lee('nivelOf', {})[p.id], niv = sube || ({propuesta: 1, 'a-prueba': 2, 'en-marcha': 3})[e.f] || 1;
      if (!['descartada', 'luego'].includes(e.f)) h += `<div class="r7-ficha d2-mas-abajo" data-i="1"><span class="r7-ficha-de">¿Quién lo hace?</span>` + (e.f === 'en-marcha' && !sube
        ? VETA.vivo.escalera({nivel: niv, desde: 'el 3 de septiembre', sube: {hechas: 42, corregidas: 1, pregunta: '¿Dejo de pedir permiso y os lo cuento después?', boton: 'Sí, hazlo tú', accion: 'subir-of', de: p.id}})
        : VETA.vivo.escalera({nivel: niv, desde: sube ? 'hoy' : e.f === 'a-prueba' ? 'el día 1 de la prueba' : 'hoy', mini: true})) + `</div>`;
      const filas = [];
      if (e.f === 'propuesta') filas.push({icono: 'probeta', nombre: 'Si lo pruebas dos semanas', pasa: 'Nadie recibe nada',
        abre: '<p>Durante 14 días enseño a cada agente lo que habría hecho, sin hacerlo. Nadie recibe nada. Después decides si se queda para todos.</p>'});
      else if (e.f === 'a-prueba') { const dia = r.dia || 1; filas.push({icono: 'reloj', nombre: `A prueba · día ${dia} de 14`, pasa: 'Hasta el 7 de diciembre',
        abre: `<p>Cada agente ve lo que Veta habría hecho, sin que salga nada. ${dia >= 9 ? 'Hasta hoy, el equipo lo habría dejado igual en 9 de cada 10 casos.' : 'Al acabar, te pregunto si se queda.'}</p>`}); }
      else if (e.f === 'en-marcha') filas.push({icono: 'check', nombre: 'En marcha', pasa: e.propio ? 'La usa todo el equipo' : 'La usan ' + (r.usan || '4 de 6') + ' personas del equipo'});
      filas.push({icono: 'grafica', nombre: 'En la oficina, desde que empezamos', pasa: r.desde});
      h += VETA.r7.lista(filas, {i: 2, clase: 'd2-mas-abajo'});
      return h;
    },
    botonFijo: p => {
      const r = R(p.id), e = fase(p.id);
      if (confirmando === p.id) return VETA.r7.botones({texto: 'Extender a las 6 personas', accion: 'extender'}, [{texto: 'Cancelar', accion: 'cancelar'}]);
      if (e.f === 'propuesta') return VETA.r7.botones({texto: 'Pruébalo', accion: 'probar'}, [{texto: 'Otra cosa…', hoja: 'd-regla-otra', datos: {regla: p.id}}]);
      if ((e.f === 'a-prueba' && !r.decision) || (e.f === 'en-marcha' && e.inicial)) return VETA.r7.botones({texto: 'Extenderla a todo el equipo', accion: 'confirmar'});
      return '';
    },
    acciones: {
      probar(ev, el, p) {
        const r = R(p.id);
        M.marca(r.decision, 'hecha', {fase: 'a-prueba', linea: 'A prueba con todo el equipo hasta el 7 de diciembre'});
        VETA.repinta({hecho: 'regla-' + p.id}); if (VETA.pintaBarra) VETA.pintaBarra();   // el número de «Decidir» se pone al día
      },
      confirmar(ev, el, p) { confirmando = p.id; VETA.repinta(); VETA.mov.cascada(VETA.$('.col.activa .pant')); },
      cancelar() { confirmando = null; VETA.repinta(); },
      'subir-of'(ev, el, p) {
        const t = X.lee('nivelOf', {}); t[p.id] = 4; X.guarda('nivelOf', t); VETA.repinta();
        VETA.aviso('Hecho: lo hago yo y os lo cuento después.', {deshacer: () => { const u = X.lee('nivelOf', {}); delete u[p.id]; X.guarda('nivelOf', u); VETA.repinta(); }, ensena: 'Vale. Sigo pidiendo permiso cada vez.'});
      },
      extender(ev, el, p) {
        confirmando = null;
        const t = X.lee('practicas', {}); t[p.id] = {hora: VETA.ahora()}; X.guarda('practicas', t);
        VETA.repinta({hecho: 'regla-' + p.id}); if (VETA.pintaBarra) VETA.pintaBarra();   // el número de «Decidir» se pone al día
      },
      'deshacer-regla'(ev, el, p) {
        const r = R(p.id);
        if (r.decision) M.deshaz(r.decision);
        else { const t = X.lee('practicas', {}); delete t[p.id]; X.guarda('practicas', t); }
        VETA.repinta({hecho: 'regla-' + p.id}); if (VETA.pintaBarra) VETA.pintaBarra();   // el número de «Decidir» se pone al día
      }
    }
  });
})();
