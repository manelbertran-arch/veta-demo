/* Veta demo · pantallas · avisos.js · paquete D (Dirección)
   G6 · Avisos · #/avisos — «Avísame cuando…»: ejemplos con «Usar este», los avisos puestos (cada uno abre H37) y los que han saltado.
   El botón principal «Crear aviso» aparece al elegir o escribir uno. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, X = VETA.dir, D = VETA.datos;
  let texto = '', ejemplo = null;                                // lo que se está escribiendo

  const puestos = () => {
    const off = X.lee('avisosOff', {});
    return X.lee('avisos', []).map(a => Object.assign({salto: 'todavía no te ha avisado', nuevo: true}, a)).concat(D.avisos.puestos).map(a => Object.assign({}, a, {off: !!off[a.id]}));
  };

  VETA.pantalla('G6', {
    titulo: 'Tus avisos',
    frase: 'Dime cuándo quieres que te avise. Yo miro los chats por ti.',
    guia: ['Aquí Veta vigila por ti lo que no quieres que se escape.', 'Tú escribes cuándo quieres que te avise, o usas un ejemplo.', 'Así te enteras a tiempo, sin mirar cada chat.'],
    pinta: () => {
      const ps = puestos(), ult = X.lee('avisoNuevo', null);
      let h = `<div class="d-avisame" data-i="0"><span class="d-avisame-ic">${VETA.ic('campana', 24)}</span>` +
        `<label class="d-avisame-c" for="d-aviso-t"><span>Avísame cuando…</span><input id="d-aviso-t" class="d-avisame-i" type="text" value="${esc(texto)}" placeholder="escribe aquí, o usa un ejemplo" enterkeyhint="done"></label></div>`;
      if (ult) h += `<div data-i="0">${UI.lineaHecho({texto: 'Aviso creado · Cuando salte, lo verás en Equipo.', hora: ult.hora, vt: 'aviso-' + ult.id, boton: {texto: 'Deshacer', accion: 'deshacer-aviso', de: ult.id}})}</div>`;
      // ronda 7 · D1: los ejemplos, como botones bajo «Avísame cuando…» (se lee el texto entero); y una sola lista (R2):
      // «Cómo habría ido», tus avisos y el que ya saltó
      if (!texto.trim()) h += `<div class="d1-ejemplos"><span class="d1-nota">O toca un ejemplo:</span>${D.avisos.ejemplos.map(e => `<button type="button" class="d1-ej" data-accion="usar" data-de="${esc(e.id)}">${esc(e.texto)}</button>`).join('')}</div>`;
      const filas = [];
      if (texto.trim()) filas.push({icono: 'reloj', nombre: 'Cómo habría ido', pasa: 'Las veces que te habría avisado este mes', hoja: 'h36', datos: {ejemplo: ejemplo || ''}});
      ps.forEach(a => filas.push({icono: a.off ? 'pausa' : 'campana', nombre: a.texto, pasa: a.off ? 'Apagado' : a.salto.charAt(0).toUpperCase() + a.salto.slice(1), hoja: 'h37', datos: {aviso: a.id, vt: 'aviso-' + a.id}}));
      filas.push({cara: 'joan-serra', nombre: 'Queja de Joan Serra', pasa: 'Te avisé el sábado 21, 20:05', ir: 'asunto/joan-serra'});
      h += VETA.r7.lista(filas);
      return h;
    },
    botonFijo: () => texto.trim() ? VETA.r7.botones({texto: 'Crear el aviso', accion: 'crear'}) : '',
    alMontar: el => {
      const i = el.querySelector('#d-aviso-t'); if (!i) return;
      i.addEventListener('input', () => {
        const antes = !!texto.trim(); texto = i.value; ejemplo = null;
        if (antes !== !!texto.trim()) { VETA.repinta(); const j = VETA.$('.col.activa #d-aviso-t'); if (j) { j.focus(); j.setSelectionRange(j.value.length, j.value.length); } }
      });
      i.addEventListener('keydown', e => { if (e.key === 'Enter') i.blur(); });
    },
    acciones: {
      usar(ev, el) { const e = D.avisos.ejemplos.find(x => x.id === el.dataset.de); if (!e) return; ejemplo = e.id; texto = e.texto; X.guarda('avisoNuevo', null); VETA.repinta(); },
      crear() {
        const t = texto.trim(); if (!t) return;
        const id = 'av-n' + Date.now().toString(36);
        X.guarda('avisos', [{id, texto: t.charAt(0).toUpperCase() + t.slice(1), hora: VETA.ahora()}].concat(X.lee('avisos', [])));
        X.guarda('avisoNuevo', {id, hora: VETA.ahora()});
        texto = ''; ejemplo = null;
        VETA.repinta({hecho: 'aviso-' + id});
      },
      'deshacer-aviso'(ev, el) {
        const id = el.dataset.de;
        X.guarda('avisos', X.lee('avisos', []).filter(a => a.id !== id)); X.guarda('avisoNuevo', null);
        VETA.repinta();
      }
    }
  });
})();
