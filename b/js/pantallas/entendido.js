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
    titulo: 'Esto he entendido', completa: true,
    frase: p => (noEntendida(p) ? 'No lo he entendido. Dímelo de otra forma o escríbelo.' : 'Así he entendido lo que me pediste. Si es eso, lo pruebo.'),
    pinta: p => {
      const o = VETA.datos.c.orden;
      if (noEntendida(p)) return escribe ? campo() : '';
      const r = M.regla(ID), hecha = r && r.estado !== 'nueva';
      return (hecha ? UI.lineaHecho({texto: `Lo estoy probando ${C.fechaPrueba}`, hora: r.hora, boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-entendido', i: 0}) : '') +
        `<div class="r7-ficha" data-i="0"><span class="r7-ficha-de">Lo que dijiste · hoy</span><p>«${esc(o.dijiste)}»</p></div>` +
        `<div class="r7-ficha r7-oro" data-i="1" data-vt="c-entendido"><span class="r7-ficha-de">${hecha ? 'Lo estoy probando' : 'Esto haré'}</span><p>${esc(C.info(ID).frase)}</p></div>` +
        VETA.r7.lista([
          {icono: 'cal', nombre: 'Dónde habría tocado', pasa: '6 casos de tus chats', hoja: 'h19', datos: {regla: ID}},
          {icono: 'orden', nombre: 'Qué he entendido', pasa: 'Cuándo, qué y con quién', hoja: 'h21'},
          hecha ? {icono: 'probeta', nombre: 'Ver este trabajo', pasa: 'Y decidir quién lo hace', ir: 'regla/' + ID} : null
        ], {i: 2, clase: 'r7c-tras'}) +
        (escribe && !hecha ? campo() : '');
    },
    botonFijo: p => {
      const r = M.regla(ID), hecha = !noEntendida(p) && r && r.estado !== 'nueva', B = VETA.r7.botones;
      if (hecha) return '';
      const otra = {texto: 'Decirlo de otra forma', ir: 'dictar/orden'};
      if (noEntendida(p)) return escribe ? B({texto: 'Guardar y probarlo', accion: 'guardar'}, [otra]) : B({texto: 'Escribirlo yo', accion: 'escribir'}, [otra]);
      return escribe ? B({texto: 'Guardar y probarlo', accion: 'guardar'}, [{texto: 'No es eso', hoja: 'h09'}])
        : B({texto: 'Pruébalo', accion: 'prueba'}, [{texto: 'No es eso', hoja: 'h09'}, {texto: 'Escribirlo yo', accion: 'escribir'}]);
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
