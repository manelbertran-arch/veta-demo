/* Veta demo · pantallas · entendido.js · carril C (Veta y cuenta)
   - A11 · Esto he entendido · #/entendido/<id>   (completa; llega desde Dictar con el guion de orden)
   #/entendido/recordatorios: la orden de ejemplo · #/entendido/no-entendida: el estado «no lo he entendido».
   Pie: el par «No es eso» / «Pruébalo». «Escribirlo yo» es el enlace del final. Al probarlo, un solo final: la fila de hecho y «Ir a Inicio». */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, C = VETA.c;
  const ID = 'r-recordatorios';
  const noEntendida = p => p.id !== 'recordatorios';
  const hecha = p => { const r = M.regla(ID); return !noEntendida(p) && !!r && r.estado !== 'nueva'; };
  let escribe = false, texto = '';
  const campo = () => `<div data-i="3">${UI.campo({id: 'c-escribe', etiqueta: 'Escríbelo tú', area: true, filas: 3, valor: texto, placeholder: 'Cuando pase esto, quiero que hagas esto'})}</div>`;

  VETA.pantalla('A11', {
    titulo: 'Esto he entendido', completa: true,
    sub: p => (noEntendida(p) ? 'No lo he entendido. Dímelo de otra forma o escríbelo.' : 'Así lo he entendido. Si es eso, lo pruebo.'),
    pinta: p => {
      const R = VETA.r7, o = VETA.datos.c.orden;
      if (noEntendida(p)) return escribe ? campo() : R.enlace({texto: 'Escribirlo yo', accion: 'escribir', i: 1});
      const r = M.regla(ID), ya = hecha(p);
      return (ya ? R.hecho({texto: 'Lo estoy probando', hora: r.hora, deshacer: 'deshacer', vt: 'c-entendido'}) : '') +
        R.tarjeta({de: 'Lo que dijiste · hoy', texto: `«${o.dijiste}»`, i: 0}) +
        R.tarjeta({veta: true, de: ya ? 'Lo estoy probando' : 'Esto haré', texto: C.info(ID).frase, vt: 'c-entendido', i: 1}) +
        R.lista([
          {nombre: 'Dónde habría tocado', dato: ((r || {}).casos || []).length || null, hoja: 'h19', datos: {regla: ID}},
          {nombre: 'Qué he entendido', hoja: 'h21'},
          ya ? {nombre: 'Ver este trabajo', ir: 'regla/' + ID} : null
        ], {i: 2}) +
        (ya ? '' : escribe ? campo() : R.enlace({texto: 'Escribirlo yo', accion: 'escribir', i: 3}));
    },
    botonFijo: p => {
      const B = VETA.r7.botones;
      if (hecha(p)) return VETA.r7.sigue();
      if (noEntendida(p)) return escribe ? B({texto: 'Guardar y probarlo', accion: 'guardar'}) : B({texto: 'Decirlo de otra forma', ir: 'dictar/orden'});
      return B(escribe ? {texto: 'Guardar', accion: 'guardar'} : {texto: 'Pruébalo', accion: 'prueba'}, {texto: 'No es eso', hoja: 'h09'});
    },
    alMontar: el => { const t = el.querySelector('#c-escribe'); if (t && escribe) { t.addEventListener('input', () => { texto = t.value; }); } },
    acciones: {
      prueba() { escribe = false; M.marca(ID, 'a-prueba'); VETA.repinta({hecho: 'c-entendido'}); },
      guardar(ev, el, p) {
        const t = document.getElementById('c-escribe');
        if (t && !t.value.trim()) { t.focus(); VETA.aviso('Escribe primero qué quieres que haga.'); return; }
        escribe = false; M.marca(ID, 'a-prueba');
        if (noEntendida(p)) { VETA.ir('entendido/recordatorios', {reemplaza: true}); return; }
        VETA.repinta({hecho: 'c-entendido'});
      },
      escribir() { escribe = true; texto = VETA.datos.c.orden.dijiste; VETA.repinta(); setTimeout(() => { const t = document.getElementById('c-escribe'); if (t) t.focus(); }, 60); },
      deshacer() { M.deshaz(ID); VETA.repinta({hecho: 'c-entendido'}); }
    }
  });
})();
