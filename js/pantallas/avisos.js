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
    titulo: 'Avisos',
    guia: ['Aquí Veta vigila por ti lo que no quieres que se escape.', 'Tú escribes cuándo quieres que te avise, o usas un ejemplo.', 'Así te enteras a tiempo, sin mirar cada chat.'],
    pinta: () => {
      const ps = puestos(), ult = X.lee('avisoNuevo', null);
      let h = `<div class="d-avisame" data-i="0"><span class="d-avisame-ic">${VETA.ic('campana', 24)}</span>` +
        `<label class="d-avisame-c" for="d-aviso-t"><span>Avísame cuando…</span><input id="d-aviso-t" class="d-avisame-i" type="text" value="${esc(texto)}" placeholder="escribe aquí, o usa un ejemplo" enterkeyhint="done"></label></div>`;
      if (ult) h += `<div data-i="0">${UI.lineaHecho({texto: 'Aviso creado · Cuando salte, lo verás en Equipo.', hora: ult.hora, vt: 'aviso-' + ult.id, boton: {texto: 'Deshacer', accion: 'deshacer-aviso', de: ult.id}})}</div>`;
      if (texto.trim()) h += UI.lista([{titulo: 'Cómo habría ido', sub: 'Las veces que te habría avisado este último mes', icono: 'reloj', hoja: 'h36', datos: {ejemplo: ejemplo || ''}}], {i: 1});
      h += UI.bloque({titulo: 'Ejemplos', i: 1, html: `<div class="lista">${D.avisos.ejemplos.map(e => `<div class="fila fila-quieta d-ej${ejemplo === e.id ? ' marcada' : ''}"><span class="fila-c"><span class="fila-t">${esc(e.texto)}</span></span>` +
        UI.boton({tipo: 'secundario', texto: ejemplo === e.id ? 'Elegido' : 'Usar este', accion: 'usar', de: e.id, ancho: false, clase: 'd-usar'}) + '</div>').join('')}</div>`});
      h += UI.bloque({titulo: 'Tus avisos · ' + ps.filter(a => !a.off).length, i: 2, html: UI.lista(ps.map(a => ({titulo: a.texto, sub: a.off ? 'apagado' : a.salto, icono: a.off ? 'pausa' : 'campana', hoja: 'h37', datos: {aviso: a.id}, vt: 'aviso-' + a.id})))});
      h += UI.bloque({titulo: 'Te han avisado · 1', i: 3, html: UI.lista([{titulo: 'Queja de Joan Serra', sub: 'Un propietario se queje · sábado 21, 20:05', av: 'joan-serra', ir: 'asunto/joan-serra'}])});
      h += `<p class="pie" data-i="4">1 caso lleva 5 días sin constancia. El agente ya está avisado; si el jueves sigue igual, verás el recuento, sin nombre ni cliente.</p>`;
      return h;
    },
    botonFijo: () => texto.trim() ? UI.boton({texto: 'Crear aviso', accion: 'crear', icono: 'campana'}) : '',
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
