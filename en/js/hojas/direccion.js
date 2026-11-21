/* Veta demo · hojas · direccion.js · paquete D (Dirección)
   H34 Los 3 temas de hoy · H35 ¿A quién se lo asignas? / ¿A quién pasas la cartera? · H36 Cómo habría ido · H37 Un aviso puesto ·
   H38 Coste por hora · H40 Clientes con dos chats. Y cuatro hojas propias de D (no están en las 42): d-regla-otra (G2b «Otra cosa…»),
   d-tema (G3c, los casos de un tema), d-partes (G7c, partes anteriores) y d-entra (G9, cada lista). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;

  // ---------------- H34 · Los 3 temas de hoy (elige hasta 3) ----------------
  let eleccion = [];
  const pintaTemas = () => `<p class="hoja-x">Choose up to 3. They're the ones you'll see at the top and in the meeting.</p>` +
    `<div class="ops d-temas-h">${D.temas.map(t => {
      const on = eleccion.includes(t.id), lleno = !on && eleccion.length >= 3;
      return `<button type="button" class="op op-elige d-tema-op" role="checkbox" aria-checked="${on}"${lleno ? ' aria-disabled="true"' : ''} data-accion="tema" data-tema="${esc(t.id)}">` +
        `<span class="op-c"><span class="op-t">${esc(t.texto)}</span></span><b class="d-tema-n">${esc(t.cifra)}</b><span class="op-marca">${VETA.ic('check', 20)}</span></button>`;
    }).join('')}</div>` +
    `<p class="d-cuenta" aria-live="polite">${eleccion.length} of 3 chosen</p>` +
    UI.boton({texto: 'Save', accion: 'guardar', deshabilitado: !eleccion.length}) +
    UI.boton({tipo: 'texto', texto: 'Cancel', datos: {cierra: '1'}, clase: 'hoja-cancela'});
  VETA.hojaDef('h34', {
    titulo: 'Today\'s 3 topics',
    pinta: () => { eleccion = X.temas().map(t => t.id); return pintaTemas(); },
    acciones: {
      tema(ev, el) {
        const id = el.dataset.tema, k = eleccion.indexOf(id);
        if (k >= 0) eleccion.splice(k, 1); else if (eleccion.length < 3) eleccion.push(id); else return;
        const c = VETA.$('#hoja .hoja-c'); if (!c) return;
        const y = c.parentNode.scrollTop; c.innerHTML = pintaTemas(); c.parentNode.scrollTop = y;
        const b = VETA.$('#hoja [data-tema="' + id + '"]'); if (b) b.focus({preventScroll: true});
      },
      guardar() {
        if (!eleccion.length) return;
        M.pon('temas', eleccion.slice());
        VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('Topics saved.', {deshacer: () => { M.deshazFlag('temas'); VETA.repinta(); }});
      }
    }
  });

  // ---------------- H35 · ¿A quién se lo asignas? / ¿A quién pasas la cartera? ----------------
  VETA.hojaElegir('h35', {
    titulo: d => d.para === 'cartera' ? 'Who do you pass the portfolio to?' : 'Who do you assign it to?',
    texto: d => d.para === 'cartera' ? 'Teresa Gil has 34 conversations with 12 clients.' : 'Whoever handles it decides when and what to reply.',
    opciones: d => {
      if (d.para === 'cartera') return [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia · Veta\'s proposal', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'},
        {id: 'dos', texto: 'Split it between the two', sub: '17 and 17'}];
      const a = (D.asuntos || {})[d.para] || {};
      return ['laura', 'anna', 'marc', 'david'].map(id => ({id, texto: X.persona(id).nombre, sub: X.zona(id) + (id === a.propone ? ' · Veta\'s proposal' : ''), av: id}));
    },
    valor: d => d.para === 'cartera' ? X.carteraA() : (((D.asuntos || {})[d.para] || {}).propone || null),
    alElegir: (op, d) => {
      if (d.para === 'cartera') { X.guarda('carteraA', op.id); VETA.repinta(); return; }
      X.asigna(d.para, op.id);
      const r = X.asignado(d.para), id = d.para;
      X.vuelve();
      setTimeout(() => VETA.aviso((r && r.linea) || 'Asignado.', {deshacer: () => { X.desasigna(id); VETA.repinta(); }}), 60);
    }
  });

  // ---------------- H36 · Cómo habría ido ----------------
  VETA.hojaTexto('h36', {
    titulo: 'How it would have gone',
    bloques: d => {
      const e = D.avisos.ejemplos.find(x => x.id === d.ejemplo);
      const casos = e ? e.casos : D.avisos.generico;
      return [{texto: (e ? 'In the last 30 days it would have triggered ' + casos.length + ' times:' : 'With what you\'ve written, in the last 30 days it would have triggered ' + casos.length + ' times:')},
        {html: `<ul class="d-casos">${casos.map(c => `<li>${VETA.ic('campana', 18)}<span>${esc(c)}</span></li>`).join('')}</ul>`},
        {texto: 'These are past cases: nothing has gone out. Once you create it, it will trigger in Team.'}];
    }
  });

  // ---------------- H37 · Un aviso puesto ----------------
  const aviso = id => X.lee('avisos', []).map(a => Object.assign({salto: 'hasn\'t triggered'}, a)).concat(D.avisos.puestos).find(a => a.id === id) || D.avisos.puestos[0];
  VETA.hojaDef('h37', {
    titulo: d => aviso(d.aviso).texto,
    pinta: d => {
      const a = aviso(d.aviso), off = !!X.lee('avisosOff', {})[a.id];
      return `<p class="hoja-x">${esc(a.saltoLargo || (a.salto === 'hasn\'t triggered' ? 'It hasn\'t triggered yet. When it does, you\'ll see it in Team.' : a.salto))}</p>` +
        (a.saltoLargo ? `<div class="lista">${UI.fila({titulo: 'Complaint from Joan Serra', sub: 'See the matter', av: 'joan-serra', ir: 'asunto/joan-serra'})}</div>` : '') +
        `<div class="lista">${UI.interruptor({texto: off ? 'Off' : 'On', sub: 'Turn it off and stop watching it; switch it on whenever you want.', on: !off, accion: 'apagar', de: a.id})}</div>` +
        UI.boton({tipo: 'secundario', texto: 'Close', datos: {cierra: '1'}, clase: 'hoja-cancela'});
    },
    acciones: {
      apagar(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true';
        const t = X.lee('avisosOff', {}); if (on) delete t[id]; else t[id] = true; X.guarda('avisosOff', t);
        VETA.cierraHoja({foco: false}); VETA.repinta();
        if (!on) VETA.aviso('Alert turned off.', {deshacer: () => { const u = X.lee('avisosOff', {}); delete u[id]; X.guarda('avisosOff', u); VETA.repinta(); }});
        else VETA.aviso('Alert turned on.');
      }
    }
  });

  // ---------------- H38 · Coste por hora ----------------
  const etiquetaGuardar = v => (Number(v) > 0 ? 'Save ' + VETA.num(Number(v)) + ' € per hour' : 'Save');
  VETA.hojaDef('h38', {
    titulo: 'Cost per hour',
    pinta: () => {
      const c = M.lee('coste', null) || '';
      return `<p class="hoja-x">Veta never puts euros in for you. If you enter your cost per hour, I'll tell you what those hours are worth.</p>` +
        `<div class="campo"><label class="campo-e" for="d-coste">€ per hour</label><div class="campo-caja d-coste-caja"><input id="d-coste" class="campo-i" type="number" inputmode="decimal" min="1" max="999" step="1" value="${esc(c)}" placeholder="35"><span class="d-coste-u">€</span></div></div>` +
        UI.nota({texto: 'It shows with the “Example” label and says where it comes from.', icono: 'info', clase: 'nota-gris'}) +
        UI.boton({texto: etiquetaGuardar(c), accion: 'guardar', deshabilitado: !(Number(c) > 0), clase: 'd-coste-b'}) +
        (c ? UI.boton({tipo: 'texto', texto: 'Remove the cost', accion: 'quitar'}) : UI.boton({tipo: 'texto', texto: 'Cancel', datos: {cierra: '1'}, clase: 'hoja-cancela'}));
    },
    alMontar: h => {
      const i = h.querySelector('#d-coste'), b = h.querySelector('.d-coste-b'); if (!i || !b) return;
      i.addEventListener('input', () => { const v = Number(i.value); b.disabled = !(v > 0); b.querySelector('span').textContent = etiquetaGuardar(i.value); });
      i.addEventListener('keydown', e => { if (e.key === 'Enter' && !b.disabled) b.click(); });
    },
    acciones: {
      guardar() {
        const i = VETA.$('#d-coste'), v = Math.round(Number(i && i.value));
        if (!(v > 0)) return;
        M.pon('coste', v); X.guarda('rodarEuros', true);
        VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('Cost saved: ' + v + ' € per hour.', {deshacer: () => { M.deshazFlag('coste'); VETA.repinta(); }});
      },
      quitar() { M.pon('coste', null); VETA.cierraHoja({foco: false}); VETA.repinta(); VETA.aviso('Cost removed.', {deshacer: () => { M.deshazFlag('coste'); VETA.repinta(); }}); }
    }
  });

  // ---------------- H40 · Clientes con dos chats ----------------
  VETA.hojaTexto('h40', {
    titulo: 'Clients with two chats',
    bloques: () => [{texto: 'Veta merges chats from the same phone on its own. One client, one profile.'},
      {titulo: 'Merged this week · ' + D.dosChats.length, html: `<div class="lista">${D.dosChats.map(c => UI.fila({titulo: c.texto, sub: c.sub, icono: 'chat'})).join('')}</div>`}]
  });

  // ---------------- d-regla-otra · G2b «Otra cosa…» ----------------
  VETA.hojaAcciones('d-regla-otra', {
    titulo: d => ((D.reglasOficina || {})[d.regla] || {}).titulo || 'The rule',
    opciones: d => {
      const r = (D.reglasOficina || {})[d.regla] || {};
      return [
        {texto: 'Dismiss it', sub: 'It won\'t be tried; Laura will see it in her Veta', icono: 'borrar', hace: () => { if (r.decision) { M.marca(r.decision, 'quitada', {linea: 'Dismissed · ' + r.titulo}); VETA.repinta(); } }},
        {texto: 'For later', sub: 'Back in Team tomorrow', icono: 'luna', hace: () => { if (r.decision) { M.marca(r.decision, 'para-manana', {linea: 'For later · ' + r.titulo}); VETA.repinta(); } }},
        {texto: 'Change how far it goes', sub: 'What Veta prepares and what the agent does', icono: 'escalera', ir: 'regla/r-valoraciones/nivel'}];
    }
  });

  // ---------------- d-tema · G3c, los casos de un tema (sin nombres de agentes) ----------------
  VETA.hojaTexto('d-tema', {
    titulo: d => ((D.temas || []).find(t => t.id === d.tema) || {texto: 'Topic'}).texto,
    bloques: d => {
      const t = (D.temas || []).find(x => x.id === d.tema) || {cifra: ''};
      const casos = d.tema === 'contactos' ? (D.contactos || []).map(c => c.nombre + ' · ' + c.cuando) : ((D.casosTema || {})[d.tema] || []);
      return [{html: `<p class="d-dato"><b>${esc(t.cifra)}</b> ${d.tema === 'respuesta' ? 'on average, last week' : 'this week'}</p>`}, {lista: casos},
        {texto: 'No agent names: it\'s for discussing as a team.'}];
    }
  });

  // ---------------- d-partes · G7c, los partes anteriores ----------------
  VETA.hojaTexto('d-partes', {
    titulo: 'Previous wrap-ups',
    bloques: () => (D.partesPiloto || []).map(p => ({titulo: p.dia, texto: p.texto}))
  });

  // ---------------- d-entra · G9, cada lista ----------------
  const TIT = {contactos: 'Contacts without a reply', dos: 'Write twice or more', no: 'Asked for what you don\'t have', si: 'Want what you already have'};
  VETA.hojaDef('d-entra', {
    titulo: d => TIT[d.lista] || 'What\'s coming in',
    pinta: d => {
      let h = '';
      if (d.lista === 'contactos') {
        h = `<div class="lista">${X.sinResponder().map(c => c.sinDueno
          ? UI.fila({titulo: c.nombre, sub: c.cuando + ' · unowned', av: c.id, ir: 'asunto/' + c.id})
          : UI.fila({titulo: c.nombre, sub: c.cuando + (c.lleva ? ' · handled by ' + X.persona(c.lleva).corto + ', on leave' : ' · no profile'), av: c.id, hoja: 'h01', datos: {chat: c.id}})).join('')}</div>`;
        if (!X.sinResponder().length) h = `<p class="hoja-x">Everyone has someone handling them.</p>`;
      } else if (d.lista === 'dos') {
        h = `<div class="lista">${D.entra.dosVeces.map(c => UI.fila({titulo: c.texto, av: c.id, hoja: 'h01', datos: {chat: c.id}})).join('')}</div>`;
      } else if (d.lista === 'no') {
        h = `<p class="hoja-x">I'll note it for when something like that comes in.</p><div class="lista">${D.entra.noTenemos.map(c => UI.fila({titulo: c.texto, sub: c.sub, icono: 'pregunta'})).join('')}</div>`;
      } else {
        h = UI.cita({texto: 'Looking for a 3-bedroom flat in Gràcia, up to €450,000', origen: 'Carmen · Office WhatsApp · yesterday, 19:10', chat: 'carmen'}) +
          `<div class="d-encaja">${UI.foto('verdi', {tam: 'mini'})}<span class="d-encaja-c"><b>Verdi 42 · 3 bedrooms · €395,000</b><span>No lift (she'd prefer one with a lift)</span></span></div>` +
          `<div class="lista">${UI.fila({titulo: 'Carmen López', sub: 'See the matter', av: 'carmen', ir: 'asunto/carmen'})}</div>`;
      }
      return h + UI.boton({tipo: 'secundario', texto: 'Close', datos: {cierra: '1'}, clase: 'hoja-cancela'});
    }
  });
})();
