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
    UI.boton({texto: 'Guardar', accion: 'guardar', deshabilitado: !eleccion.length});
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

  // ---- ronda 6 · H35 con «para: 'op'»: cambiar quién lleva una operación (G18). Quien la deja y quien la recibe lo ven en su app. ----
  const opTexto = d => { const o = X.op(d.op); return o ? o.nombre + ' · ' + o.texto + '. Quien la lleve sigue con lo que toca.' : ''; };
  const opOpciones = d => {
    const o = X.op(d.op) || {}, prop = ((D.contactos || []).find(c => c.id === d.op) || {}).propone;
    return ['anna', 'david', 'laura', 'marc', 'montse'].map(id => ({id, texto: X.persona(id).nombre + (id === VETA.yo().id ? ' (tú)' : ''),
      sub: X.zona(id) + (id === o.lleva ? ' · la lleva ahora' : id === prop ? ' · yo se lo daría' : ''), av: id}));
  };
  const opElige = (op, d) => {
    const antes = X.llevaOp(d.op), o = X.op(d.op);
    if (op.id === antes) { VETA.cierraHoja(); return; }
    X.ponLleva(d.op, op.id);
    VETA.cierraHoja(); VETA.repinta();
    setTimeout(() => VETA.aviso((o ? o.nombre : 'La operación') + ': ahora la lleva ' + X.persona(op.id).corto + '.', {deshacer: () => {
      if (o && o.contacto && !antes) X.desasigna(d.op); else X.ponLleva(d.op, antes || (o && o.base.lleva));
      VETA.repinta();
    }}), 60);
  };

  // ---- ronda 6 · d-preguntar y d-anotar (G18): lo que dirección le pregunta a quien la lleva o anota para sí ----
  VETA.hojaAcciones('d-preguntar', {
    titulo: d => { const o = X.op(d.op); return o && o.persona ? 'Preguntar a ' + o.persona.corto : 'Preguntar'; },
    texto: d => { const o = X.op(d.op); return o ? 'Sobre ' + o.nombre + '. Le llega a su Hoy, en su Veta. No va por WhatsApp.' : ''; },
    opciones: d => ['¿Cómo va?', '¿Necesitas ayuda con esta?', '¿Puedes llamarle hoy?'].map(t => ({texto: t, icono: 'pregunta', hace: () => {
      const o = X.op(d.op); X.pregunta(d.op, t); VETA.repinta();
      setTimeout(() => VETA.aviso('Pregunta dejada a ' + (o && o.persona ? o.persona.corto : 'quien la lleva') + '.'), 60);
    }}))
  });
  VETA.hojaDef('d-anotar', {
    titulo: d => { const o = X.op(d.op); return o ? 'Anotar sobre ' + o.nombre : 'Anotar algo'; },
    pinta: d => UI.campo({etiqueta: 'Tu nota', area: true, id: 'd-nota-op', placeholder: 'Por ejemplo: hablarlo el lunes en la reunión'}) +
      UI.nota({icono: 'candado', texto: 'Tu nota se guarda en esta operación, con su hora.'}) + UI.boton({texto: 'Guardar la nota', accion: 'guardar-nota', datos: {op: d.op}}),
    acciones: {
      'guardar-nota'(ev, el, d) {
        const t = ((document.getElementById('d-nota-op') || {}).value || '').trim() || 'Hablarlo el lunes en la reunión';
        X.anota(d.op, t); VETA.cierraHoja(); VETA.repinta();
        setTimeout(() => VETA.aviso('Nota guardada.'), 60);
      }
    }
  });

  // ---------------- H35 · ¿A quién se lo asignas? / ¿A quién pasas la cartera? ----------------
  VETA.hojaElegir('h35', {
    titulo: d => d.para === 'cartera' ? '¿A quién pasas sus clientes?' : d.para === 'op' ? '¿Quién la lleva?' : '¿A quién se lo asignas?',
    texto: d => d.para === 'cartera' ? 'Teresa Gil tiene 34 conversaciones con 12 clientes.' : d.para === 'op' ? opTexto(d) : 'Quien lo lleve decide cuándo y qué le contesta.',
    opciones: d => {
      if (d.para === 'op') return opOpciones(d);
      if (d.para === 'cartera') return [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia · yo se lo daría', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'},
        {id: 'dos', texto: 'Repartirla entre las dos', sub: '17 y 17'}];
      const a = (D.asuntos || {})[d.para] || {};
      return ['laura', 'anna', 'marc', 'david', 'montse'].map(id => ({id, texto: id === VETA.yo().id ? 'Tú' : X.persona(id).nombre, sub: id === VETA.yo().id ? 'Lo llevas tú' : X.zona(id) + (id === a.propone ? ' · yo se lo daría' : ''), av: id}));
    },
    valor: d => d.para === 'cartera' ? X.carteraA() : d.para === 'op' ? X.llevaOp(d.op) : (((D.asuntos || {})[d.para] || {}).propone || null),
    alElegir: (op, d) => {
      if (d.para === 'op') return opElige(op, d);
      if (d.para === 'cartera') { X.guarda('carteraA', op.id); VETA.repinta(); return; }
      X.asigna(d.para, op.id);
      const r = X.asignado(d.para), id = d.para;
      X.vuelve(); if (VETA.d1) VETA.d1.numeros();
      setTimeout(() => VETA.aviso((r && r.linea) || 'Asignado.', {deshacer: () => { X.desasigna(id); VETA.repinta(); if (VETA.d1) VETA.d1.numeros(); }}), 60);
    }
  });

  // ---------------- H36 · Cómo habría ido ----------------
  VETA.hojaTexto('h36', {
    titulo: 'Cómo habría ido',
    bloques: d => {
      const e = D.avisos.ejemplos.find(x => x.id === d.ejemplo);
      const casos = e ? e.casos : D.avisos.generico;
      return [{texto: (e ? 'En los últimos 30 días te habría avisado ' + casos.length + ' veces:' : 'Con lo que has escrito, en los últimos 30 días te habría avisado ' + casos.length + ' veces:')},
        {html: `<ul class="d-casos">${casos.map(c => `<li>${VETA.ic('campana', 18)}<span>${esc(c)}</span></li>`).join('')}</ul>`},
        {texto: 'Son casos pasados: no ha salido nada. Cuando lo crees, saltará en Equipo.'}];
    }
  });

  // ---------------- H37 · Un aviso puesto ----------------
  const aviso = id => X.lee('avisos', []).map(a => Object.assign({salto: 'todavía no te ha avisado'}, a)).concat(D.avisos.puestos).find(a => a.id === id) || D.avisos.puestos[0];
  VETA.hojaDef('h37', {
    titulo: d => aviso(d.aviso).texto,
    pinta: d => {
      const a = aviso(d.aviso), off = !!X.lee('avisosOff', {})[a.id];
      return `<p class="hoja-x">${esc(a.saltoLargo || (a.salto === 'todavía no te ha avisado' ? 'Todavía no te ha avisado. Cuando lo haga, lo verás en Equipo.' : a.salto))}</p>` +
        (a.saltoLargo ? `<div class="lista">${UI.fila({titulo: 'Queja de Joan Serra', sub: 'Ver qué ha pasado', av: 'joan-serra', ir: 'asunto/joan-serra'})}</div>` : '') +
        `<div class="lista">${UI.interruptor({texto: off ? 'Apagado' : 'Encendido', sub: 'Apágalo y deja de vigilarlo; lo enciendes cuando quieras.', on: !off, accion: 'apagar', de: a.id})}</div>`;
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
        (c ? UI.boton({tipo: 'texto', texto: 'Quitar el coste', accion: 'quitar'}) : '');
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
      {titulo: 'Unidos la semana pasada · ' + D.dosChats.length, html: `<div class="lista">${D.dosChats.map(c => UI.fila({titulo: c.texto, sub: c.sub, icono: 'chat'})).join('')}</div>`}]
  });

  // ---------------- d-regla-otra · G2b «Otra cosa…» ----------------
  VETA.hojaAcciones('d-regla-otra', {
    titulo: d => ((D.reglasOficina || {})[d.regla] || {}).titulo || 'Este trabajo',
    opciones: d => {
      const r = (D.reglasOficina || {})[d.regla] || {};
      return [
        {texto: 'Descartarla', sub: 'No se prueba; Laura lo verá en su Veta', icono: 'borrar', hace: () => { if (r.decision) { M.marca(r.decision, 'quitada', {linea: 'Descartada · ' + r.titulo}); VETA.repinta(); } }},
        {texto: 'Para luego', sub: 'Vuelve mañana a Equipo', icono: 'luna', hace: () => { if (r.decision) { M.marca(r.decision, 'para-manana', {linea: 'Para luego · ' + r.titulo}); VETA.repinta(); } }},
        {texto: '¿Quién lo hace? Cambiarlo', sub: 'Qué hace Veta y qué hace el agente', icono: 'escalera', ir: 'regla/r-valoraciones/nivel'}];
    }
  });

  // ---------------- d-tema · G3c, los casos de un tema (sin nombres de agentes) ----------------
  VETA.hojaTexto('d-tema', {
    titulo: d => ((D.temas || []).find(t => t.id === d.tema) || {texto: 'Tema'}).texto,
    bloques: d => {
      const t = (D.temas || []).find(x => x.id === d.tema) || {cifra: ''};
      const casos = d.tema === 'contactos' ? (D.contactos || []).map(c => c.nombre + ' · ' + c.cuando) : ((D.casosTema || {})[d.tema] || []);
      return [{html: `<p class="d-dato"><b>${esc(t.cifra)}</b> ${d.tema === 'respuesta' ? 'de media, la semana pasada' : 'la semana pasada'}</p>`}, {lista: casos},
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
          ? UI.fila({titulo: c.nombre, sub: c.cuando + ' · no lo lleva nadie', av: c.id, ir: 'asunto/' + c.id})
          : UI.fila({titulo: c.nombre, sub: c.cuando + (c.lleva ? ' · lo lleva ' + X.persona(c.lleva).corto + ', de baja' : ' · sin ficha'), av: c.id, hoja: 'h01', datos: {chat: c.id}})).join('')}</div>`;
        if (!X.sinResponder().length) h = `<p class="hoja-x">Todos tienen quien los lleve.</p>`;
      } else if (d.lista === 'dos') {
        h = `<div class="lista">${D.entra.dosVeces.map(c => UI.fila({titulo: c.texto, av: c.id, hoja: 'h01', datos: {chat: c.id}})).join('')}</div>`;
      } else if (d.lista === 'no') {
        h = `<p class="hoja-x">Lo apunto para cuando entre algo así.</p><div class="lista">${D.entra.noTenemos.map(c => UI.fila({titulo: c.texto, sub: c.sub, icono: 'pregunta'})).join('')}</div>`;
      } else {
        h = UI.cita({texto: 'Busco piso de 3 habitaciones en Gràcia, hasta 450.000 €', origen: 'Carmen · WhatsApp de la oficina · ayer, 19:10', chat: 'carmen'}) +
          `<div class="d-encaja">${UI.foto('verdi', {tam: 'mini'})}<span class="d-encaja-c"><b>Verdi 42 · 3 habitaciones · 395.000 €</b><span>Sin ascensor (ella lo prefiere con ascensor)</span></span></div>` +
          `<div class="lista">${UI.fila({titulo: 'Carmen López', sub: 'Ver qué ha pasado', av: 'carmen', ir: 'asunto/carmen'})}</div>`;
      }
      return h;
    }
  });
})();
