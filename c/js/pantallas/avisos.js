/* Veta demo · ronda 8 · pantallas · avisos.js · carril D
   G6 · Tus avisos · #/avisos — el campo, con su rótulo fuera («¿Cuándo te aviso?»), tres ejemplos como filtros y dos listas:
   los avisos puestos, cada uno con su interruptor (se apagan y encienden aquí), y lo que ya ha saltado.
   Al escribir o elegir un ejemplo aparecen «Cómo habría ido» (hoja h36) y el botón «Crear el aviso». */
(function () {
  'use strict';
  const UI = VETA.UI, X = VETA.dir, D = VETA.datos, r7 = VETA.r7;
  let texto = '', ejemplo = null;                                // lo que se está escribiendo

  const puestos = () => {
    const off = X.lee('avisosOff', {});
    return X.lee('avisos', []).concat(D.avisos.puestos).map(a => Object.assign({}, a, {off: !!off[a.id]}));
  };

  VETA.pantalla('G6', {
    titulo: 'Tus avisos',
    pinta: () => {
      const ult = X.lee('avisoNuevo', null);
      let h = `<div data-i="0">${UI.campo({etiqueta: '¿Cuándo te aviso?', id: 'd-aviso-t', valor: texto, placeholder: 'Avísame cuando…'})}</div>`;
      h += r7.filtros(D.avisos.ejemplos.map(e => ({id: e.id, texto: e.corto})), {valor: ejemplo, accion: 'usar', etiqueta: 'Ejemplos', i: 0});
      if (ult) h += `<div data-i="0">${UI.lineaHecho({texto: 'Aviso creado. Cuando salte, lo verás en Inicio.', hora: ult.hora, vt: 'aviso-' + ult.id, boton: {texto: 'Deshacer', accion: 'deshacer-aviso', de: ult.id}})}</div>`;
      h += r7.lista(puestos().map(a => UI.interruptor({texto: a.texto, on: !a.off, accion: 'apagar', de: a.id})), {rotulo: 'Avisos puestos', i: 1});
      h += r7.lista([{cara: 'joan-serra', nombre: 'Queja de Joan Serra', pasa: 'Te avisé el sábado 21, 20:05', ir: 'asunto/joan-serra'}], {rotulo: 'Ya te avisé', i: 2});
      if (texto.trim()) h += r7.enlace({texto: 'Cómo habría ido', hoja: 'h36', datos: {ejemplo: ejemplo || ''}});
      return h;
    },
    botonFijo: () => texto.trim() ? r7.botones({texto: 'Crear el aviso', accion: 'crear'}) : '',
    alMontar: el => {
      const i = el.querySelector('#d-aviso-t'); if (!i) return;
      i.addEventListener('input', () => {
        const antes = !!texto.trim(), conEjemplo = !!ejemplo; texto = i.value; ejemplo = null;
        if (antes !== !!texto.trim() || conEjemplo) { VETA.repinta(); const j = VETA.$('.col.activa #d-aviso-t'); if (j) { j.focus(); j.setSelectionRange(j.value.length, j.value.length); } }
      });
      i.addEventListener('keydown', e => { if (e.key === 'Enter') i.blur(); });
    },
    acciones: {
      usar(ev, el) { const e = D.avisos.ejemplos.find(x => x.id === el.dataset.valor); if (!e) return; ejemplo = e.id; texto = e.texto; X.guarda('avisoNuevo', null); VETA.repinta(); },
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
      },
      // el interruptor de cada aviso (antes, dentro de la hoja h37)
      apagar(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true';
        const t = X.lee('avisosOff', {}); if (on) delete t[id]; else t[id] = true; X.guarda('avisosOff', t);
        if (!on) VETA.aviso('Aviso apagado.', {deshacer: () => { const u = X.lee('avisosOff', {}); delete u[id]; X.guarda('avisosOff', u); VETA.repinta(); }});
        else VETA.aviso('Aviso encendido.');
      }
    }
  });
})();
