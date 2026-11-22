/* Veta demo · pantallas · reglas.js · paquete C (Veta, cuenta y entrada)
   - A9 · Lo que hago por ti · #/reglas
   - A9b · La semana pasada · #/reglas/semana-pasada */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ORDEN = {propuesta: 0, 'a-prueba': 1, activa: 2, descartada: 3};

  // ---- A9 · Ya lo hago yo (ronda 7): los trabajos que ya hago, uno por fila. Su número es VETA.r7.cuentas().veta ----
  // lo que aún es propuesta está en Veta › “Te lo propongo”; lo que ya no hago, en la última fila
  const hago = () => {
    const v = C.visitas(), l = [];
    if (v.estado !== 'propuesta') l.push({id: 'r-visitas', nombre: C.corto('r-visitas'), prueba: v.estado === 'prueba'});
    M.reglas().filter(r => r.estado === 'activa' || r.estado === 'a-prueba').sort((a, b) => (ORDEN[a.estado] ?? 2) - (ORDEN[b.estado] ?? 2))
      .forEach(r => l.push({id: r.id, nombre: C.corto(r.id), prueba: r.estado === 'a-prueba', r}));
    return l;
  };
  const pasoTexto = id => { const n = VETA.vivo.niveles()[C.paso(id) - 1] || {}; return n.enLista || n.nombre || ''; };
  VETA.pantalla('A9', {
    titulo: 'I already do it',
    cuenta: () => VETA.r7.cuentas().veta,
    frase: () => `I already do these ${VETA.r7.cuentas().veta} jobs. Tap one to see how I do it.`,
    pinta: () => {
      const l = hago(), fuera = M.reglas().filter(r => r.estado === 'descartada');
      const nuevos = C.ensenados().map(x => x.regla).filter(Boolean);
      const filas = l.map(x => ({icono: x.prueba ? 'probeta' : 'check', oro: true, nombre: x.nombre, pastilla: nuevos.includes(x.id) ? 'New' : null, tono: 'oro',
        pasa: x.prueba ? `Trying · ${x.r ? 'day ' + (x.r.dia || 1) + ' of ' + (x.r.pruebaDias || 14) : 'from today'}` : pasoTexto(x.id),
        ir: 'regla/' + x.id}));
      // ronda 7 · arreglos (FC, defecto 5): lo aprendido y lo que vigilo también es “lo que ya hago yo”: cuelgan de aquí, después de los trabajos
      const apr = C.aprendidoN(), vig = C.vigilo ? C.vigilo() : 0;
      filas.push({icono: 'estrella', nombre: 'What I\'ve learned from you', pasa: 'I do it as you taught me', numero: apr, ir: 'aprendido'});
      filas.push({icono: 'reloj', nombre: 'What I\'m watching for you', pasa: 'Promised to you or with a date', numero: vig, ir: 'espera'});
      if (fuera.length) filas.push({icono: 'borrar', nombre: 'What I no longer do', pasa: 'You told me no', numero: fuera.length,
        abre: `<div class="r7c-props">${fuera.map(r => `<button type="button" class="r7c-prop" data-ir="regla/${esc(r.id)}"><span><b>${esc(C.corto(r.id))}</b></span>${VETA.ic('chev', 16)}</button>`).join('')}</div>`});
      filas.push({icono: 'cal', nombre: 'Did I do well last week?', ir: 'reglas/semana-pasada'});
      return VETA.r7.lista(filas, {i: 0});
    }
  });

  // ---- A9b · La semana pasada ----
  VETA.pantalla('A9b', {
    titulo: 'Last week',
    frase: 'From 16 to 22 November. Have a look and tell me if it is right.',
    guia: ['Here you go over what I did last week.', 'You tell me with one tap if it is right.', 'That way you know what it did, without reading everything.'],
    pinta: () => {
      const hecha = C.lee('semanaConfirmada', null);
      return (hecha ? UI.lineaHecho({texto: 'You told me it is right', hora: hecha, boton: {texto: 'Undo', accion: 'deshacer'}, i: 0}) : '') +
        VETA.r7.lista(VETA.datos.c.semanaPasada.map(f => ({icono: 'check', oro: true, nombre: f.titulo, pasa: f.sub || 'I got it ready', numero: f.derecha}))
          .concat([{icono: 'candado', nombre: 'You sent it', pasa: 'All sent from your WhatsApp'}]), {i: 1});
    },
    botonFijo: () => (C.lee('semanaConfirmada', null) ? '' : VETA.r7.botones({texto: 'Yes, it is right', accion: 'confirmar'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); }
    }
  });
  void esc;
})();
