/* Veta demo · pantallas · entendido.js · paquete C (Veta, cuenta y entrada)
   - A11 · Así lo he entendido · #/entendido/<id>   (completa; llega desde Dictar con el guion de orden)
   #/entendido/recordatorios: la orden de ejemplo · #/entendido/no-entendida: el estado “no lo he entendido”. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ID = 'r-recordatorios';
  const noEntendida = p => p.id !== 'recordatorios';
  let escribe = false, texto = '';

  VETA.pantalla('A11', {
    titulo: 'This is what I understood', completa: true,
    frase: p => (noEntendida(p) ? 'I didn\'t understand it. Tell me another way or type it.' : 'This is how I understood what you asked. If that is right, I try it.'),
    pinta: p => {
      const o = VETA.datos.c.orden;
      if (noEntendida(p)) return escribe ? campo() : '';
      const r = M.regla(ID), hecha = r && r.estado !== 'nueva';
      return (hecha ? UI.lineaHecho({texto: `I'm trying it ${C.fechaPrueba}`, hora: r.hora, boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-entendido', i: 0}) : '') +
        `<div class="r7-ficha" data-i="0"><span class="r7-ficha-de">What you said · today</span><p>“${esc(o.dijiste)}”</p></div>` +
        `<div class="r7-ficha r7-oro" data-i="1" data-vt="c-entendido"><span class="r7-ficha-de">${hecha ? 'I\'m trying it' : 'I will do this'}</span><p>${esc(C.info(ID).frase)}</p></div>` +
        VETA.r7.lista([
          {icono: 'cal', nombre: 'Where it would have come up', pasa: '6 cases from your chats', hoja: 'h19', datos: {regla: ID}},
          {icono: 'orden', nombre: 'What I understood', pasa: 'When, what and with whom', hoja: 'h21'},
          hecha ? {icono: 'probeta', nombre: 'See this job', pasa: 'And decide who does it', ir: 'regla/' + ID} : null
        ], {i: 2, clase: 'r7c-tras'}) +
        (escribe && !hecha ? campo() : '');
    },
    botonFijo: p => {
      const r = M.regla(ID), hecha = !noEntendida(p) && r && r.estado !== 'nueva', B = VETA.r7.botones;
      if (hecha) return '';
      const otra = {texto: 'Put it another way', ir: 'dictar/orden'};
      if (noEntendida(p)) return escribe ? B({texto: 'Save and try it', accion: 'guardar'}, [otra]) : B({texto: 'Type it myself', accion: 'escribir'}, [otra]);
      return escribe ? B({texto: 'Save and try it', accion: 'guardar'}, [{texto: 'That\'s not it', hoja: 'h09'}])
        : B({texto: 'Try it', accion: 'prueba'}, [{texto: 'That\'s not it', hoja: 'h09'}, {texto: 'Type it myself', accion: 'escribir'}]);
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

  function campo() {
    return `<div data-i="3">${UI.campo({id: 'c-escribe', etiqueta: 'Type it yourself', area: true, filas: 3, valor: texto, placeholder: 'When… I want…'})}</div>`;
  }
})();
