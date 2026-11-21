/* Veta demo · pantallas · entendido.js · paquete C (Veta, cuenta y entrada)
   - A11 · Así lo he entendido · #/entendido/<id>   (completa; llega desde Dictar con el guion de orden)
   #/entendido/recordatorios: la orden de ejemplo · #/entendido/no-entendida: el estado «no lo he entendido». */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const ID = 'r-recordatorios';
  const noEntendida = p => p.id !== 'recordatorios';
  let escribe = false, texto = '';

  VETA.pantalla('A11', {
    titulo: 'This is how I understood it', completa: true,
    guia: ['Here Veta tells you how it understood what you asked.', 'You check that it is right and try it, or you say it another way.', 'This way an order from you becomes a job, without writing anything.'],
    pinta: p => {
      const o = VETA.datos.c.orden;
      if (noEntendida(p)) {
        return `<div class="c-entiende" data-i="0"><span class="c-entiende-t">I didn't understand it</span></div>` +
          `<p class="intro" data-i="1">I didn't understand it. Tell me another way or type it.</p>` +
          (escribe ? campo() : '');
      }
      const r = M.regla(ID), hecha = r && r.estado !== 'nueva';
      const top = hecha ? UI.lineaHecho({texto: `I'm trying it ${C.fechaPrueba}`, hora: r.hora, boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-entendido', i: 0}) :
        `<div class="c-entiende" data-i="0" data-vt="c-entendido"><span class="c-entiende-t">Understood: an instruction for me</span>` +
        UI.boton({tipo: 'texto', texto: 'That\'s not it', hoja: 'h09', ancho: false, g: 'That\'s not it|You choose what it was: a viewing note, a task, a note or a question.'}) + `</div>`;
      return top +
        UI.bloque({titulo: 'What you said', i: 1, html: `<blockquote class="cita c-cita-quieta"><span class="cita-t">“${esc(o.dijiste)}”</span><span class="cita-o">Dictated today · 0:06</span></blockquote>`}) +
        UI.tarjeta(`<div class="c-etqs">${UI.etiqueta('propuesta', hecha ? 'New job · I\'m trying it' : 'New job · My suggestion')}${UI.etiqueta('ejemplo', 'Example')}</div><p class="c-frase">${esc(C.info(ID).frase)}</p>` +
          UI.lista([
            {titulo: '6 cases from your chats where it would have been due', icono: 'cal', hoja: 'h19', datos: {regla: ID}},
            {titulo: 'What I understood', icono: 'orden', hoja: 'h21'},
            hecha ? {titulo: 'See this job', icono: 'probeta', ir: 'regla/' + ID} : null
          ]), {i: 2, clase: 'c-propuesta'}) +
        (escribe && !hecha ? campo() : '');
    },
    botonFijo: p => {
      const r = M.regla(ID), hecha = !noEntendida(p) && r && r.estado !== 'nueva';
      const sec = UI.botones([{texto: 'Put it another way', ir: 'dictar/orden'}, escribe || hecha ? null : {texto: 'Type it myself', accion: 'escribir'}]);
      if (hecha) return UI.boton({tipo: 'secundario', texto: 'Back', atras: true});
      if (noEntendida(p)) return escribe ? UI.boton({texto: 'Save and try it', accion: 'guardar'}) + sec : sec;
      return UI.boton({texto: escribe ? 'Save and try it' : 'Try it', accion: escribe ? 'guardar' : 'prueba'}) + sec;
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
