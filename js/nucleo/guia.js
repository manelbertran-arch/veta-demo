/* Veta demo · núcleo · guia.js
   La guía (apagada por defecto; se enciende en Cuenta con VETA.guia.pon(true)).
   Móvil: al entrar en una pantalla sale sobre la barra una franja con sus tres frases (def.guia) y, al tocar algo con
   data-g="Título|Frase", su título y su frase. Ordenador: cajón de 320 px a la derecha con las frases y el índice de
   todas las pantallas, por grupos. Se guarda en localStorage. */
(function () {
  'use strict';
  const esc = VETA.esc;
  const on = () => !!VETA.pref.lee('guia', false);
  const $g = () => document.getElementById('guia');
  const $c = () => document.getElementById('cajon');
  let ultima = null;

  function frases(def) {
    const f = (def && def.guia) || [];
    return f.length ? `<ol class="guia-f">${f.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '<p class="guia-f">This screen doesn\'t have its sentences yet.</p>';
  }
  function indice() {
    const grupos = {};
    Object.values(VETA.MAPA).forEach(m => { (grupos[m.grupo] = grupos[m.grupo] || []).push(m); });
    return Object.keys(grupos).map(g => `<section class="guia-g"><h3>${esc(g)}</h3>${grupos[g].map(m => `<button type="button" class="guia-i" data-ir="${esc(m.ejemplo)}"><span>${esc(m.titulo)}</span><span class="guia-cod">${esc(m.cod)}</span></button>`).join('')}</section>`).join('');
  }
  function pintaCajon(def) {
    const c = $c(); if (!c) return;
    document.getElementById('app').classList.toggle('guia-on', on());
    if (!on()) { c.innerHTML = ''; return; }
    c.innerHTML = `<div class="cajon-c"><div class="cajon-cab"><h2>Guide</h2>${VETA.UI.boton({tipo: 'texto', texto: 'Turn off', accion: 'guia-apaga'})}</div>` +
      `<div class="guia-toque" id="guia-toque"></div><h3 class="guia-pt">${esc(def ? (typeof def.titulo === 'function' ? def.titulo((VETA.actual() || {}).p || {}) : def.titulo) : '')}</h3>${frases(def)}<h3 class="guia-pt">Index</h3>${indice()}</div>`;
  }

  VETA.guia = {
    on,
    pon(v) { VETA.pref.pon('guia', !!v); this.entra(ultima); },
    // al entrar en una pantalla
    entra(def) {
      ultima = def;
      const g = $g();
      if (VETA.ordenador()) { if (g) { g.hidden = true; g.innerHTML = ''; } pintaCajon(def); return; }
      pintaCajon(null);
      if (!g) return;
      if (!on() || !def || def.cod === 'E1') { g.hidden = true; g.innerHTML = ''; return; }
      g.innerHTML = `<div class="guia-c">${frases(def)}</div><button type="button" class="btn btn-texto guia-x" data-accion="guia-calla">Close</button>`;
      g.hidden = false;
    },
    // al tocar algo con data-g
    toca(g) {
      if (!on()) return;
      const [t, f] = String(g).split('|');
      const html = `<p class="guia-tt"><b>${esc(t)}</b>${f ? ' · ' + esc(f) : ''}</p>`;
      if (VETA.ordenador()) { const el = document.getElementById('guia-toque'); if (el) el.innerHTML = html; return; }
      const el = $g(); if (!el) return;
      el.innerHTML = `<div class="guia-c">${html}</div><button type="button" class="btn btn-texto guia-x" data-accion="guia-calla">Close</button>`;
      el.hidden = false;
    },
    calla() { const g = $g(); if (g) { g.hidden = true; g.innerHTML = ''; } }
  };
  VETA.accionGlobal('guia-calla', () => VETA.guia.calla());
  VETA.accionGlobal('guia-apaga', () => VETA.guia.pon(false));
})();
