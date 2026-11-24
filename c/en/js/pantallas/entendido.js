/* Veta demo · pantallas · entendido.js · carril C (Veta y cuenta)
   - A11 · Esto he entendido · #/entendido/<id>   (completa; llega desde Dictar con el guion de orden)
   #/entendido/recordatorios: la orden de ejemplo · #/entendido/no-entendida: el estado “no lo he entendido”.
   Pie: el par “No es eso” / “Pruébalo”. “Escribirlo yo” es el enlace del final. */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, C = VETA.c;
  const ID = 'r-recordatorios';
  const noEntendida = p => p.id !== 'recordatorios';
  const hecha = p => { const r = M.regla(ID); return !noEntendida(p) && !!r && r.estado !== 'nueva'; };
  let escribe = false, texto = '';
  const campo = () => `<div data-i="3">${UI.campo({id: 'c-escribe', etiqueta: 'Type it yourself', area: true, filas: 3, valor: texto, placeholder: 'When this happens, I want you to do this'})}</div>`;

  VETA.pantalla('A11', {
    titulo: 'What I understood', completa: true,
    sub: p => (noEntendida(p) ? 'I didn\'t understand it. Tell me another way or type it.' : 'Here\'s what I understood. If that\'s right, I\'ll try it.'),
    pinta: p => {
      const R = VETA.r7, o = VETA.datos.c.orden;
      if (noEntendida(p)) return escribe ? campo() : R.enlace({texto: 'Type it', accion: 'escribir', i: 1});
      const r = M.regla(ID), ya = hecha(p);
      return (ya ? UI.lineaHecho({texto: `I'm trying it ${C.fechaPrueba}`, hora: r.hora, boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-entendido', i: 0}) : '') +
        R.tarjeta({de: 'What you said · today', texto: `“${o.dijiste}”`, i: 0}) +
        R.tarjeta({veta: true, de: ya ? 'I\'m trying it' : 'I\'ll do this', texto: C.info(ID).frase, vt: 'c-entendido', i: 1}) +
        R.lista([
          {nombre: 'Where it applies', dato: '6 cases', hoja: 'h19', datos: {regla: ID}},
          {nombre: 'What I understood', hoja: 'h21'},
          ya ? {nombre: 'See this job', ir: 'regla/' + ID} : null
        ], {i: 2}) +
        (ya ? '' : escribe ? campo() : R.enlace({texto: 'Type it', accion: 'escribir', i: 3}));
    },
    botonFijo: p => {
      const B = VETA.r7.botones;
      if (hecha(p)) return '';
      if (noEntendida(p)) return escribe ? B({texto: 'Save and try it', accion: 'guardar'}) : B({texto: 'Put it another way', ir: 'dictar/orden'});
      return B(escribe ? {texto: 'Save', accion: 'guardar'} : {texto: 'Try it', accion: 'prueba'}, {texto: 'That\'s not it', hoja: 'h09'});
    },
    alMontar: el => { const t = el.querySelector('#c-escribe'); if (t && escribe) { t.addEventListener('input', () => { texto = t.value; }); } },
    acciones: {
      prueba() { escribe = false; M.marca(ID, 'a-prueba'); VETA.repinta({hecho: 'c-entendido'}); },
      guardar(ev, el, p) {
        const t = document.getElementById('c-escribe');
        if (t && !t.value.trim()) { t.focus(); VETA.aviso('First type what you want it to do.'); return; }
        escribe = false; M.marca(ID, 'a-prueba');
        if (noEntendida(p)) { VETA.ir('entendido/recordatorios', {reemplaza: true}); return; }
        VETA.repinta({hecho: 'c-entendido'});
      },
      escribir() { escribe = true; texto = VETA.datos.c.orden.dijiste; VETA.repinta(); setTimeout(() => { const t = document.getElementById('c-escribe'); if (t) t.focus(); }, 60); },
      deshacer() { M.deshaz(ID); VETA.repinta({hecho: 'c-entendido'}); }
    }
  });
})();
