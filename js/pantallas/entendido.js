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
    titulo: 'Así lo he entendido', completa: true,
    guia: ['Aquí Veta te dice cómo ha entendido lo que le has pedido.', 'Tú compruebas que es eso y la pones a prueba, o se lo dices de otra forma.', 'Así una orden tuya se convierte en una regla, sin escribir nada.'],
    pinta: p => {
      const o = VETA.datos.c.orden;
      if (noEntendida(p)) {
        return `<div class="c-entiende" data-i="0"><span class="c-entiende-t">No lo he entendido</span></div>` +
          `<p class="intro" data-i="1">No lo he entendido. Dímelo de otra forma o escríbelo.</p>` +
          (escribe ? campo() : '');
      }
      const r = M.regla(ID), hecha = r && r.estado !== 'nueva';
      const top = hecha ? UI.lineaHecho({texto: `A prueba · ${C.fechaPrueba}`, hora: r.hora, boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-entendido', i: 0}) :
        `<div class="c-entiende" data-i="0" data-vt="c-entendido"><span class="c-entiende-t">He entendido: una orden para mí</span>` +
        UI.boton({tipo: 'texto', texto: 'No es eso', hoja: 'h09', ancho: false, g: 'No es eso|Eliges qué era: un acta, una tarea, una nota o una pregunta.'}) + `</div>`;
      return top +
        UI.bloque({titulo: 'Lo que dijiste', i: 1, html: `<blockquote class="cita c-cita-quieta"><span class="cita-t">«${esc(o.dijiste)}»</span><span class="cita-o">Dictado hoy · 0:06</span></blockquote>`}) +
        UI.tarjeta(`<div>${UI.etiqueta('propuesta', hecha ? 'Regla nueva · A prueba' : 'Regla nueva · Propuesta')}</div><p class="c-frase">${esc(C.info(ID).frase)}</p>` +
          UI.lista([
            {titulo: 'Lo habría hecho 6 veces desde septiembre', icono: 'cal', hoja: 'h19', datos: {regla: ID}},
            {titulo: 'Cómo la he entendido, por partes', icono: 'orden', hoja: 'h21'},
            hecha ? {titulo: 'Ver la regla', icono: 'probeta', ir: 'regla/' + ID} : null
          ]), {i: 2, clase: 'c-propuesta'}) +
        (escribe && !hecha ? campo() : '');
    },
    botonFijo: p => {
      const r = M.regla(ID), hecha = !noEntendida(p) && r && r.estado !== 'nueva';
      const sec = UI.botones([{texto: 'Decirlo de otra forma', ir: 'dictar/orden'}, escribe || hecha ? null : {texto: 'Escribirlo yo', accion: 'escribir'}]);
      if (hecha) return UI.boton({tipo: 'secundario', texto: 'Volver a Veta', ir: 'veta'});
      if (noEntendida(p)) return escribe ? UI.boton({texto: 'Guardar y ponerla a prueba', accion: 'guardar'}) + sec : sec;
      return UI.boton({texto: escribe ? 'Guardar y ponerla a prueba' : 'Ponerla a prueba', accion: escribe ? 'guardar' : 'prueba'}) + sec;
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

  function campo() {
    return `<div data-i="3">${UI.campo({id: 'c-escribe', etiqueta: 'Escríbelo tú', area: true, filas: 3, valor: texto, placeholder: 'Cuando… quiero que…'})}</div>`;
  }
})();
