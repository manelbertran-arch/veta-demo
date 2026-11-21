/* Veta demo · pantallas · avisos.js · paquete D (Dirección)
   G6 · Avisos · #/avisos — «Avísame cuando…»: ejemplos con «Usar este», los avisos puestos (cada uno abre H37) y los que han saltado.
   El botón principal «Crear aviso» aparece al elegir o escribir uno. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, X = VETA.dir, D = VETA.datos;
  let texto = '', ejemplo = null;                                // lo que se está escribiendo

  const puestos = () => {
    const off = X.lee('avisosOff', {});
    return X.lee('avisos', []).map(a => Object.assign({salto: 'hasn\'t triggered', nuevo: true}, a)).concat(D.avisos.puestos).map(a => Object.assign({}, a, {off: !!off[a.id]}));
  };

  VETA.pantalla('G6', {
    titulo: 'Alerts',
    guia: ['Here Veta watches for you what you don\'t want to slip through.', 'You write when you want it to alert you, or use an example.', 'That way you find out in time, without checking every chat.'],
    pinta: () => {
      const ps = puestos(), ult = X.lee('avisoNuevo', null);
      let h = `<div class="d-avisame" data-i="0"><span class="d-avisame-ic">${VETA.ic('campana', 24)}</span>` +
        `<label class="d-avisame-c" for="d-aviso-t"><span>Alert me when…</span><input id="d-aviso-t" class="d-avisame-i" type="text" value="${esc(texto)}" placeholder="type here, or use an example" enterkeyhint="done"></label></div>`;
      if (ult) h += `<div data-i="0">${UI.lineaHecho({texto: 'Alert created · When it triggers, you\'ll see it in Team.', hora: ult.hora, vt: 'aviso-' + ult.id, boton: {texto: 'Undo', accion: 'deshacer-aviso', de: ult.id}})}</div>`;
      if (texto.trim()) h += UI.lista([{titulo: 'How it would have gone', sub: 'The times it would have triggered this past month', icono: 'reloj', hoja: 'h36', datos: {ejemplo: ejemplo || ''}}], {i: 1});
      h += UI.bloque({titulo: 'Examples', i: 1, html: `<div class="lista">${D.avisos.ejemplos.map(e => `<div class="fila fila-quieta d-ej${ejemplo === e.id ? ' marcada' : ''}"><span class="fila-c"><span class="fila-t">${esc(e.texto)}</span></span>` +
        UI.boton({tipo: 'secundario', texto: ejemplo === e.id ? 'Chosen' : 'Use this one', accion: 'usar', de: e.id, ancho: false, clase: 'd-usar'}) + '</div>').join('')}</div>`});
      h += UI.bloque({titulo: 'Set · ' + ps.filter(a => !a.off).length, i: 2, html: UI.lista(ps.map(a => ({titulo: a.texto, sub: a.off ? 'apagado' : a.salto, icono: a.off ? 'pausa' : 'campana', hoja: 'h37', datos: {aviso: a.id}, vt: 'aviso-' + a.id})))});
      h += UI.bloque({titulo: 'Triggered · 1', i: 3, html: UI.lista([{titulo: 'Complaint from Joan Serra', sub: 'An owner complains · Saturday 21, 20:05', av: 'joan-serra', ir: 'asunto/joan-serra'}])});
      h += `<p class="pie" data-i="4">1 case has gone 5 days with no record. The agent has already been alerted; if it's the same on Thursday, you'll see the count, without name or client.</p>`;
      return h;
    },
    botonFijo: () => texto.trim() ? UI.boton({texto: 'Create alert', accion: 'crear', icono: 'campana'}) : '',
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
