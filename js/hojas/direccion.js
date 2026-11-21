/* Veta demo · hojas · direccion.js · paquete D (Dirección)
   H34 Los 3 temas de hoy · H35 ¿A quién se lo asignas? / ¿A quién pasas la cartera? · H36 Cómo habría ido · H37 Un aviso puesto ·
   H38 Coste por hora · H40 Clientes con dos chats. Y cuatro hojas propias de D (no están en las 42): d-regla-otra (G2b «Otra cosa…»),
   d-tema (G3c, los casos de un tema), d-partes (G7c, partes anteriores) y d-entra (G9, cada lista). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;

  // ---------------- H34 · Los 3 temas de hoy (elige hasta 3) ----------------
  let eleccion = [];
  const pintaTemas = () => `<p class="hoja-x">Elige hasta 3. Son los que verás arriba y en la reunión.</p>` +
    `<div class="ops d-temas-h">${D.temas.map(t => {
      const on = eleccion.includes(t.id), lleno = !on && eleccion.length >= 3;
      return `<button type="button" class="op op-elige d-tema-op" role="checkbox" aria-checked="${on}"${lleno ? ' aria-disabled="true"' : ''} data-accion="tema" data-tema="${esc(t.id)}">` +
        `<span class="op-c"><span class="op-t">${esc(t.texto)}</span></span><b class="d-tema-n">${esc(t.cifra)}</b><span class="op-marca">${VETA.ic('check', 20)}</span></button>`;
    }).join('')}</div>` +
    `<p class="d-cuenta" aria-live="polite">${eleccion.length} de 3 elegidos</p>` +
    UI.boton({texto: 'Guardar', accion: 'guardar', deshabilitado: !eleccion.length}) +
    UI.boton({tipo: 'texto', texto: 'Cancelar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
  VETA.hojaDef('h34', {
    titulo: 'Los 3 temas de hoy',
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
        VETA.aviso('Temas guardados.', {deshacer: () => { M.deshazFlag('temas'); VETA.repinta(); }});
      }
    }
  });

  // ---------------- H35 · ¿A quién se lo asignas? / ¿A quién pasas la cartera? ----------------
  VETA.hojaElegir('h35', {
    titulo: d => d.para === 'cartera' ? '¿A quién pasas la cartera?' : '¿A quién se lo asignas?',
    texto: d => d.para === 'cartera' ? 'Teresa Gil tiene 34 conversaciones con 12 clientes.' : 'Quien lo lleve decide cuándo y qué le contesta.',
    opciones: d => {
      if (d.para === 'cartera') return [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia · la propuesta de Veta', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'},
        {id: 'dos', texto: 'Repartirla entre las dos', sub: '17 y 17'}];
      const a = (D.asuntos || {})[d.para] || {};
      return ['laura', 'anna', 'marc', 'david'].map(id => ({id, texto: X.persona(id).nombre, sub: X.zona(id) + (id === a.propone ? ' · la propuesta de Veta' : ''), av: id}));
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
    titulo: 'Cómo habría ido',
    bloques: d => {
      const e = D.avisos.ejemplos.find(x => x.id === d.ejemplo);
      const casos = e ? e.casos : D.avisos.generico;
      return [{texto: (e ? 'En los últimos 30 días habría saltado ' + casos.length + ' veces:' : 'Con lo que has escrito, en los últimos 30 días habría saltado ' + casos.length + ' veces:')},
        {html: `<ul class="d-casos">${casos.map(c => `<li>${VETA.ic('campana', 18)}<span>${esc(c)}</span></li>`).join('')}</ul>`},
        {texto: 'Son casos pasados: no ha salido nada. Cuando lo crees, saltará en Equipo.'}];
    }
  });

  // ---------------- H37 · Un aviso puesto ----------------
  const aviso = id => X.lee('avisos', []).map(a => Object.assign({salto: 'no ha saltado'}, a)).concat(D.avisos.puestos).find(a => a.id === id) || D.avisos.puestos[0];
  VETA.hojaDef('h37', {
    titulo: d => aviso(d.aviso).texto,
    pinta: d => {
      const a = aviso(d.aviso), off = !!X.lee('avisosOff', {})[a.id];
      return `<p class="hoja-x">${esc(a.saltoLargo || (a.salto === 'no ha saltado' ? 'No ha saltado todavía. Cuando salte, lo verás en Equipo.' : a.salto))}</p>` +
        (a.saltoLargo ? `<div class="lista">${UI.fila({titulo: 'Queja de Joan Serra', sub: 'Ver el asunto', av: 'joan-serra', ir: 'asunto/joan-serra'})}</div>` : '') +
        `<div class="lista">${UI.interruptor({texto: off ? 'Apagado' : 'Encendido', sub: 'Apágalo y deja de vigilarlo; lo enciendes cuando quieras.', on: !off, accion: 'apagar', de: a.id})}</div>` +
        UI.boton({tipo: 'secundario', texto: 'Cerrar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
    },
    acciones: {
      apagar(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true';
        const t = X.lee('avisosOff', {}); if (on) delete t[id]; else t[id] = true; X.guarda('avisosOff', t);
        VETA.cierraHoja({foco: false}); VETA.repinta();
        if (!on) VETA.aviso('Aviso apagado.', {deshacer: () => { const u = X.lee('avisosOff', {}); delete u[id]; X.guarda('avisosOff', u); VETA.repinta(); }});
        else VETA.aviso('Aviso encendido.');
      }
    }
  });

  // ---------------- H38 · Coste por hora ----------------
  const etiquetaGuardar = v => (Number(v) > 0 ? 'Guardar ' + VETA.num(Number(v)) + ' € la hora' : 'Guardar');
  VETA.hojaDef('h38', {
    titulo: 'Coste por hora',
    pinta: () => {
      const c = M.lee('coste', null) || '';
      return `<p class="hoja-x">Veta nunca pone euros por ti. Si escribes tu coste por hora, te digo cuánto son esas horas.</p>` +
        `<div class="campo"><label class="campo-e" for="d-coste">€ la hora</label><div class="campo-caja d-coste-caja"><input id="d-coste" class="campo-i" type="number" inputmode="decimal" min="1" max="999" step="1" value="${esc(c)}" placeholder="35"><span class="d-coste-u">€</span></div></div>` +
        UI.nota({texto: 'Se ve con la etiqueta «Ejemplo» y dice de dónde sale.', icono: 'info', clase: 'nota-gris'}) +
        UI.boton({texto: etiquetaGuardar(c), accion: 'guardar', deshabilitado: !(Number(c) > 0), clase: 'd-coste-b'}) +
        (c ? UI.boton({tipo: 'texto', texto: 'Quitar el coste', accion: 'quitar'}) : UI.boton({tipo: 'texto', texto: 'Cancelar', datos: {cierra: '1'}, clase: 'hoja-cancela'}));
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
        VETA.aviso('Coste guardado: ' + v + ' € la hora.', {deshacer: () => { M.deshazFlag('coste'); VETA.repinta(); }});
      },
      quitar() { M.pon('coste', null); VETA.cierraHoja({foco: false}); VETA.repinta(); VETA.aviso('Coste quitado.', {deshacer: () => { M.deshazFlag('coste'); VETA.repinta(); }}); }
    }
  });

  // ---------------- H40 · Clientes con dos chats ----------------
  VETA.hojaTexto('h40', {
    titulo: 'Clientes con dos chats',
    bloques: () => [{texto: 'Veta une sola los chats del mismo teléfono. Un cliente, una ficha.'},
      {titulo: 'Unidos esta semana · ' + D.dosChats.length, html: `<div class="lista">${D.dosChats.map(c => UI.fila({titulo: c.texto, sub: c.sub, icono: 'chat'})).join('')}</div>`}]
  });

  // ---------------- d-regla-otra · G2b «Otra cosa…» ----------------
  VETA.hojaAcciones('d-regla-otra', {
    titulo: d => ((D.reglasOficina || {})[d.regla] || {}).titulo || 'La regla',
    opciones: d => {
      const r = (D.reglasOficina || {})[d.regla] || {};
      return [
        {texto: 'Descartarla', sub: 'No se prueba; Laura lo verá en su Veta', icono: 'borrar', hace: () => { if (r.decision) { M.marca(r.decision, 'quitada', {linea: 'Descartada · ' + r.titulo}); VETA.repinta(); } }},
        {texto: 'Para luego', sub: 'Vuelve mañana a Equipo', icono: 'luna', hace: () => { if (r.decision) { M.marca(r.decision, 'para-manana', {linea: 'Para luego · ' + r.titulo}); VETA.repinta(); } }},
        {texto: 'Cambiar hasta dónde llega', sub: 'Qué prepara Veta y qué hace el agente', icono: 'escalera', ir: 'regla/r-valoraciones/nivel'}];
    }
  });

  // ---------------- d-tema · G3c, los casos de un tema (sin nombres de agentes) ----------------
  VETA.hojaTexto('d-tema', {
    titulo: d => ((D.temas || []).find(t => t.id === d.tema) || {texto: 'Tema'}).texto,
    bloques: d => {
      const t = (D.temas || []).find(x => x.id === d.tema) || {cifra: ''};
      const casos = d.tema === 'contactos' ? (D.contactos || []).map(c => c.nombre + ' · ' + c.cuando) : ((D.casosTema || {})[d.tema] || []);
      return [{html: `<p class="d-dato"><b>${esc(t.cifra)}</b> ${d.tema === 'respuesta' ? 'de media, la última semana' : 'esta semana'}</p>`}, {lista: casos},
        {texto: 'Sin nombres de agentes: es para hablarlo en equipo.'}];
    }
  });

  // ---------------- d-partes · G7c, los partes anteriores ----------------
  VETA.hojaTexto('d-partes', {
    titulo: 'Partes anteriores',
    bloques: () => (D.partesPiloto || []).map(p => ({titulo: p.dia, texto: p.texto}))
  });

  // ---------------- d-entra · G9, cada lista ----------------
  const TIT = {contactos: 'Contactos sin responder', dos: 'Escriben dos veces o más', no: 'Piden lo que no tenéis', si: 'Quieren lo que ya tenéis'};
  VETA.hojaDef('d-entra', {
    titulo: d => TIT[d.lista] || 'Lo que entra',
    pinta: d => {
      let h = '';
      if (d.lista === 'contactos') {
        h = `<div class="lista">${X.sinResponder().map(c => c.sinDueno
          ? UI.fila({titulo: c.nombre, sub: c.cuando + ' · sin dueño', av: c.id, ir: 'asunto/' + c.id})
          : UI.fila({titulo: c.nombre, sub: c.cuando + (c.lleva ? ' · lo lleva ' + X.persona(c.lleva).corto + ', de baja' : ' · sin ficha'), av: c.id, hoja: 'h01', datos: {chat: c.id}})).join('')}</div>`;
        if (!X.sinResponder().length) h = `<p class="hoja-x">Todos tienen quien los lleve.</p>`;
      } else if (d.lista === 'dos') {
        h = `<div class="lista">${D.entra.dosVeces.map(c => UI.fila({titulo: c.texto, av: c.id, hoja: 'h01', datos: {chat: c.id}})).join('')}</div>`;
      } else if (d.lista === 'no') {
        h = `<p class="hoja-x">Lo apunto para cuando entre algo así.</p><div class="lista">${D.entra.noTenemos.map(c => UI.fila({titulo: c.texto, sub: c.sub, icono: 'pregunta'})).join('')}</div>`;
      } else {
        h = UI.cita({texto: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', origen: 'Carmen · WhatsApp de la oficina · ayer, 19:10', chat: 'carmen'}) +
          `<div class="d-encaja">${UI.foto('verdi', {tam: 'mini'})}<span class="d-encaja-c"><b>Verdi 42 · 3 habitaciones · 395.000 €</b><span>Sin ascensor (ella lo prefiere con ascensor)</span></span></div>` +
          `<div class="lista">${UI.fila({titulo: 'Carmen López', sub: 'Ver el asunto', av: 'carmen', ir: 'asunto/carmen'})}</div>`;
      }
      return h + UI.boton({tipo: 'secundario', texto: 'Cerrar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
    }
  });
})();
