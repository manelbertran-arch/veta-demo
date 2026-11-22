/* Veta demo · pantallas · reglas.js · paquete C (Veta, cuenta y entrada)
   - A9 · Lo que hago por ti · #/reglas
   - A9b · La semana pasada · #/reglas/semana-pasada */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ORDEN = {propuesta: 0, 'a-prueba': 1, activa: 2, descartada: 3};

  // ---- A9 · Ya lo hago yo (ronda 7): los trabajos que ya hago, uno por fila. Su número es VETA.r7.cuentas().veta ----
  // lo que aún es propuesta está en Veta › «Te lo propongo»; lo que ya no hago, en la última fila
  const hago = () => {
    const v = C.visitas(), l = [];
    if (v.estado !== 'propuesta') l.push({id: 'r-visitas', nombre: C.corto('r-visitas'), prueba: v.estado === 'prueba'});
    M.reglas().filter(r => r.estado === 'activa' || r.estado === 'a-prueba').sort((a, b) => (ORDEN[a.estado] ?? 2) - (ORDEN[b.estado] ?? 2))
      .forEach(r => l.push({id: r.id, nombre: C.corto(r.id), prueba: r.estado === 'a-prueba', r}));
    return l;
  };
  const pasoTexto = id => { const n = VETA.vivo.niveles()[C.paso(id) - 1] || {}; return n.enLista || n.nombre || ''; };
  VETA.pantalla('A9', {
    titulo: 'Ya lo hago yo',
    frase: () => `Estos ${VETA.r7.cuentas().veta} trabajos ya los hago yo. Toca uno para ver cómo lo hago.`,
    pinta: () => {
      const l = hago(), fuera = M.reglas().filter(r => r.estado === 'descartada');
      const nuevos = C.ensenados().map(x => x.regla).filter(Boolean);
      const filas = l.map(x => ({icono: x.prueba ? 'probeta' : 'check', oro: true, nombre: x.nombre, pastilla: nuevos.includes(x.id) ? 'Nuevo' : null, tono: 'oro',
        pasa: x.prueba ? `Probando · ${x.r ? 'día ' + (x.r.dia || 1) + ' de ' + (x.r.pruebaDias || 14) : 'desde hoy'}` : pasoTexto(x.id),
        ir: 'regla/' + x.id}));
      // ronda 7 · arreglos (FC, defecto 5): lo aprendido y lo que vigilo también es «lo que ya hago yo»: cuelgan de aquí, después de los trabajos
      const apr = C.aprendidoN(), vig = C.vigilo ? C.vigilo() : 0;
      filas.push({icono: 'estrella', nombre: 'Lo he aprendido de ti', pasa: 'Lo hago como tú me enseñaste', numero: apr, ir: 'aprendido'});
      filas.push({icono: 'reloj', nombre: 'Lo que vigilo por ti', pasa: 'Lo que te prometieron o tiene fecha', numero: vig, ir: 'espera'});
      if (fuera.length) filas.push({icono: 'borrar', nombre: 'Lo que ya no hago', pasa: 'Me dijiste que no', numero: fuera.length,
        abre: `<div class="r7c-props">${fuera.map(r => `<button type="button" class="r7c-prop" data-ir="regla/${esc(r.id)}"><span><b>${esc(C.corto(r.id))}</b></span>${VETA.ic('chev', 16)}</button>`).join('')}</div>`});
      filas.push({icono: 'cal', nombre: '¿Lo hice bien la semana pasada?', ir: 'reglas/semana-pasada'});
      return VETA.r7.lista(filas, {i: 0});
    }
  });

  // ---- A9b · La semana pasada ----
  VETA.pantalla('A9b', {
    titulo: 'La semana pasada',
    frase: 'Del 16 al 22 de noviembre. Míralo y dime si está bien.',
    guia: ['Aquí repasas lo que hice la semana pasada.', 'Tú me dices de un toque si está bien.', 'Así sabes qué ha hecho, sin leerlo todo.'],
    pinta: () => {
      const hecha = C.lee('semanaConfirmada', null);
      return (hecha ? UI.lineaHecho({texto: 'Me dijiste que está bien', hora: hecha, boton: {texto: 'Deshacer', accion: 'deshacer'}, i: 0}) : '') +
        VETA.r7.lista(VETA.datos.c.semanaPasada.map(f => ({icono: 'check', oro: true, nombre: f.titulo, pasa: f.sub || 'Lo dejé listo yo', numero: f.derecha}))
          .concat([{icono: 'candado', nombre: 'Lo enviaste tú', pasa: 'Todo salió desde tu WhatsApp'}]), {i: 1});
    },
    botonFijo: () => (C.lee('semanaConfirmada', null) ? '' : VETA.r7.botones({texto: 'Sí, está bien', accion: 'confirmar'})),
    acciones: {
      confirmar() { C.pon('semanaConfirmada', VETA.ahora()); VETA.repinta({hecho: 'semana'}); },
      deshacer() { C.pon('semanaConfirmada', null); VETA.repinta({hecho: 'semana'}); }
    }
  });
  void esc;
})();
