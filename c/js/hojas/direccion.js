/* Veta demo · ronda 8 · hojas · direccion.js · carril D
   H34 Los 3 temas de hoy · H35 ¿A quién se lo asignas? / ¿A quién pasas la cartera? · H36 Cómo habría ido ·
   H40 Clientes con dos chats. Hojas propias de D: d-regla-otra (G2b «Otra cosa…»), d-tema (G3c), d-partes (G7c), d-entra (G9),
   d-preguntar y d-anotar (G18).
   Ronda 8 · nuevas, todas con las tres plantillas (acciones, texto, elegir):
   - «Más» de cada pantalla: d-asunto-mas (G2) · d-reparto-mas (G5) · d-op-mas (G18) · d-regla-mas (G2b) · d-resumen-mas (G3b)
   - r8-paradas (las operaciones paradas, con su enlace, y lo que espera decisión) · d-hoy (cómo va la oficina hoy, con sus cifras)
   - de lectura: d-pasos (G2) · d-decididas (Inicio) · d-hace (G19) · d-sola y d-aprendi (G3) · d-ensenado (G21) · d-decimos (G16) · d-ejemplos (G3e)
   Se fue H37 («Un aviso puesto»): cada aviso lleva ya su interruptor en la lista de Tus avisos (G6). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;

  // ---------------- H34 · Los 3 temas de hoy (elige hasta 3) ----------------
  let eleccion = [];
  const pintaTemas = () => `<p class="hoja-x">Elige hasta 3. Son los que verás arriba y en la reunión.</p>` +
    `<div class="ops d-temas-h">${D.temas.map(t => {
      const on = eleccion.includes(t.id);
      return `<button type="button" class="op op-elige d-tema-op" role="checkbox" aria-checked="${on}" data-accion="tema" data-tema="${esc(t.id)}">` +
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
        if (k >= 0) eleccion.splice(k, 1); else { if (eleccion.length >= 3) eleccion.shift(); eleccion.push(id); }   // con tres elegidas, la nueva sustituye a la primera: nunca un toque que no hace nada
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
    texto: d => { const o = X.op(d.op); return o ? 'Sobre ' + o.nombre + '. Le llega a su Inicio, en su Veta. No va por WhatsApp.' : ''; },
    opciones: d => ['¿Cómo va?', '¿Necesitas ayuda con esta?', '¿Puedes llamarle hoy?'].map(t => ({texto: t, hace: () => {
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
    texto: d => d.para === 'cartera' ? 'De Teresa Gil quedan 12 clientes por repartir.' : d.para === 'op' ? opTexto(d) : 'Quien lo lleve decide cuándo y qué le contesta.',
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
      X.asigna(d.para, op.id); AS().hecho(d.para);   // el asunto se repinta en el sitio con su «hecho» y «Deshacer"
    }
  });

  // ---------------- H36 · Cómo habría ido ----------------
  VETA.hojaTexto('h36', {
    titulo: 'Cómo habría ido',
    bloques: d => {
      const e = D.avisos.ejemplos.find(x => x.id === d.ejemplo);
      const casos = e ? e.casos : D.avisos.generico;
      return [{texto: (e ? 'En los últimos 30 días te habría avisado ' + casos.length + ' veces:' : 'Con lo que has escrito, en los últimos 30 días te habría avisado ' + casos.length + ' veces:')},
        {lista: casos},
        {texto: 'Son casos pasados: no ha salido nada. Cuando lo crees, saltará en Inicio.'}];
    }
  });

  // ---------------- H40 · Clientes con dos chats ----------------
  VETA.hojaTexto('h40', {
    titulo: 'Clientes con dos chats',
    bloques: () => [{texto: 'Veta une sola los chats del mismo teléfono. Un cliente, una ficha.'},
      {titulo: 'Unidos la semana pasada · ' + D.dosChats.length, html: `<div class="lista">${D.dosChats.map(c => UI.fila({titulo: c.texto, sub: c.sub})).join('')}</div>`}]
  });

  // ---------------- d-regla-otra · G2b, «Más» de una propuesta: lo que no es probarla ----------------
  // («¿Quién lo hace?» ya se toca en la pantalla: de ahí a «Subir un paso para todos» hay un toque)
  const marcaRegla = (d, estado, linea) => { const r = (D.reglasOficina || {})[d.regla] || {}; if (r.decision) { M.marca(r.decision, estado, {linea}); VETA.d1.decideRegla(d.regla); } };
  VETA.hojaMas('d-regla-otra', {
    titulo: d => { const r = (D.reglasOficina || {})[d.regla] || {}; return r.corto || r.titulo || 'Este trabajo'; },
    ensena: true,
    opciones: d => [
      {texto: 'Para luego', hace: () => marcaRegla(d, 'para-manana', 'Para luego')},
      {texto: 'Descartarlo', peligro: true, hace: () => marcaRegla(d, 'quitada', 'Descartado')}]
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
          : UI.fila({titulo: c.nombre, sub: c.cuando + (c.lleva ? ' · lo lleva ' + X.persona(c.lleva).corto + ', de baja' : ' · sin ficha'), av: c.id})).join('')}</div>`;
        if (!X.sinResponder().length) h = `<p class="hoja-x">Todos tienen quien los lleve.</p>`;
      } else if (d.lista === 'dos') {
        h = `<div class="lista">${D.entra.dosVeces.map(c => UI.fila({titulo: c.texto, av: c.id})).join('')}</div>`;
      } else if (d.lista === 'no') {
        h = `<p class="hoja-x">Lo apunto para cuando entre algo así.</p><div class="lista">${D.entra.noTenemos.map(c => UI.fila({titulo: c.texto, sub: c.sub})).join('')}</div>`;
      } else {
        // sin citar su mensaje ni poner precios (25-nov-2026): el hecho, y de ahí a su asunto
        h = VETA.r7.lista([{foto: 'verdi', nombre: 'Verdi 42', pasa: '3 habitaciones. Sin ascensor (ella lo prefiere con ascensor)'},
          {cara: 'carmen', nombre: 'Carmen López', pasa: 'Busca piso de 3 habitaciones en Gràcia · ver qué ha pasado', ir: 'asunto/carmen'}]);
      }
      return h;
    }
  });

  // =====================================================================================================
  // ronda 8 · hojas nuevas del carril D

  // ---------------- «Más» de un asunto (G2): elegir a otra persona · para luego · descartarlo (capacidad 15 de la A) ----------------
  const AS = () => VETA.d1.asunto;
  const aparca = (id, que) => { X.aparca(id, que); AS().hecho(id); };
  const joan = (estado, linea, corto) => { M.marca('d-joan', estado, {linea, corto}); AS().hecho('joan-serra'); };
  VETA.hojaMas('d-asunto-mas', {
    titulo: d => AS().nombre(d.asunto),
    ensena: true,
    opciones: d => {
      const id = d.asunto;
      if (AS().A(id).tipo === 'queja') return [
        {texto: 'Le llamo yo', hace: () => joan('quitada', 'Joan Serra · le llamas tú', 'Le llamas tú')},
        {texto: 'Para luego', hace: () => joan('para-manana', 'Para luego · Joan Serra', 'Para luego')},
        {texto: 'Descartar la queja', peligro: true, hace: () => joan('quitada', 'Descartada · queja de Joan Serra', 'Queja descartada')}];
      return [
        {texto: 'Elegir a otra persona', hoja: 'h35', datos: {para: id}},
        {texto: 'Para luego', hace: () => aparca(id, 'luego')},
        {texto: 'Descartarlo', peligro: true, hace: () => aparca(id, 'descartado')}];
    }
  });

  // ---------------- d-pasos · G2, lo que ha pasado ----------------
  VETA.hojaTexto('d-pasos', {
    titulo: 'Lo que ha pasado',
    bloques: d => AS().A(d.asunto).paso.map(x => ({titulo: x.cuando, texto: x.texto}))
  });

  // ---------------- «Más» de Reparto (G5) ----------------
  VETA.hojaMas('d-reparto-mas', {
    titulo: 'Los clientes de Teresa',
    ensena: true,
    opciones: () => [{texto: 'Elegir a otra persona', hoja: 'h35', datos: {para: 'cartera'}}, {texto: 'Clientes con dos chats', hoja: 'h40'}]
  });

  // ---------------- «Más» de una operación (G18) ----------------
  VETA.hojaMas('d-op-mas', {
    titulo: d => { const o = X.op(d.op); return o ? o.nombre : 'Operación'; },
    opciones: d => {
      const o = X.op(d.op); if (!o) return [];
      const yo = VETA.yo().id, per = o.persona, sin = !o.lleva || (o.deTeresa && o.lleva === 'teresa');
      const quien = {hoja: 'h35', datos: {para: 'op', op: o.id}}, anotar = {texto: 'Anotar algo', hoja: 'd-anotar', datos: {op: o.id}};
      return [
        sin ? null : Object.assign({texto: o.lleva === yo ? 'Dársela a otra persona' : 'Cambiar quién'}, quien),
        o.lleva === yo ? null : anotar,
        per && o.lleva !== yo ? {texto: `Ver a ${per.corto}`, cara: o.lleva, ir: 'persona/' + o.lleva} : null,
        o.caso ? {texto: 'Un caso para aprender', ir: o.caso} : null].filter(Boolean);
    }
  });

  // ---------------- d-escalera-of · G2b, «¿Quién lo hace?»: los cinco pasos de ESTE trabajo de la oficina ----------------
  // (antes la fila abría el trabajo personal de la agente, con «Lo has hecho tú 14 veces»: un trabajo que no es el de la oficina)
  VETA.hojaTexto('d-escalera-of', {
    titulo: '¿Quién lo hace?',
    bloques: d => {
      const R = (D.reglasOficina || {})[d.regla] || {}, n = VETA.d1.pasoRegla ? VETA.d1.pasoRegla(d.regla) : 1;
      return [{texto: `${R.corto || R.titulo || 'Este trabajo'}, para todo el equipo. Voy subiendo de paso cuando me dices que sí.`},
        {lista: VETA.vivo.niveles().map(x => `${x.nombre}${x.n === n ? ' · ahora' : ''}${x.n === n || x.cerrado ? '. ' + x.texto : ''}`)}];
    },
    // el mismo botón que A10b le da a dirección: sube el paso de ESTE trabajo para todo el equipo (h22 pide la confirmación)
    boton: d => (VETA.d1.sigPaso && VETA.d1.sigPaso(d.regla) ? {texto: 'Subir un paso para todos', hoja: 'h22', de: d.regla} : null)
  });

  // ---------------- «Más» de un trabajo en marcha (G2b): dar un paso más ----------------
  VETA.hojaMas('d-regla-mas', {
    titulo: d => { const r = (D.reglasOficina || {})[d.regla] || {}; return r.corto || r.titulo || 'Este trabajo'; },
    texto: 'Lo he hecho 42 veces y me corregisteis 1.',
    ensena: true,
    opciones: d => [{texto: 'Dejar de pedir permiso', hace: () => VETA.d1.subeRegla(d.regla)}]
  });

  // ---------------- «Más» de Enviar el resumen (G3b) ----------------
  VETA.hojaMas('d-resumen-mas', {
    titulo: 'El resumen',
    ensena: true,
    opciones: () => [{texto: 'Cambiar el texto', hace: () => VETA.d1.cambiaResumen()}]
  });

  // ---------------- r8-paradas · las que llevan más de 7 días paradas, con su enlace (capacidad 9 de la A) ----------------
  VETA.hojaAcciones('r8-paradas', {
    titulo: 'Paradas más de 7 días',
    opciones: () => {
      const n = VETA.r7.cuentas().decidir;
      return X.paradas().map(o => {
        const c = M.cliente(o.cliente) || {};
        return {cara: o.cliente, texto: c.nombre || o.texto, sub: o.texto + ' · ' + o.estadoTexto.replace('Parada · ', '').replace(/ · fase.*$/, ''), ir: 'operacion/' + o.cliente};
      }).concat(n ? [{texto: n === 1 ? '1 cosa espera tu decisión' : `${n} cosas esperan tu decisión`, ir: 'inicio'}] : []);
    }
  });

  // ---------------- d-hoy · cómo va la oficina hoy, con sus cifras (capacidad 14 de la A) ----------------
  const CORTO = {esperando: 'Esperando respuesta', promesas: 'Promesas', quieren: 'Quieren vender o comprar', contactos: 'Contactos nuevos', respuesta: 'Respuesta', visitas: 'Visitas'};
  VETA.hojaAcciones('d-hoy', {
    titulo: 'Cómo va la oficina hoy',
    texto: '25 cosas en marcha. 8 esperan al cliente.',
    opciones: () => [{texto: `Paradas más de 7 días · ${X.paradas().length}`, hoja: 'r8-paradas'}]
      .concat(X.temas().map(t => ({texto: (CORTO[t.id] || t.texto) + ' · ' + t.cifra, hoja: 'd-tema', datos: {tema: t.id}})))
      .concat([{texto: 'Cambiar los temas', hoja: 'h34'}])
  });

  // ---------------- d-decididas · Inicio, lo decidido hoy (cada fila lleva a su ficha, donde se deshace) ----------------
  VETA.hojaAcciones('d-decididas', {
    titulo: 'Decidido hoy',
    opciones: () => VETA.d1.decididas().map(x => ({texto: x.linea, sub: x.hora ? `A las ${VETA.fecha.hora(x.hora)}` : '', ir: x.ir}))
  });

  // ---------------- d-hace · G19, una persona. Sin cifras por persona (25-nov-2026): solo lo que Veta hace por ella, sin recuentos ----------------
  const ESTADO = {activa: 'Ya lo hago yo', 'a-prueba': 'Lo estoy probando', propuesta: 'Se lo he propuesto'};
  VETA.hojaTexto('d-hace', {
    titulo: d => d.persona === VETA.yo().id ? 'Lo que Veta hace por ti' : 'Lo que Veta hace por ' + X.persona(d.persona).corto,
    bloques: d => {
      const x = X.personaOps(d.persona), yo = d.persona === VETA.yo().id;
      const ap = x.aprendido.map(([id, t]) => { const r = id ? M.regla(id) : null; return t + ' · ' + (ESTADO[r ? r.estado : 'activa'] || ESTADO.activa); });
      const hoy = d.persona === 'laura' && VETA.r6 && VETA.r6.siempre ? VETA.r6.siempre() : null;
      if (hoy) ap.unshift(hoy.regla + ' · Me lo enseñó hoy');
      // lo de quien mira: los trabajos de la oficina, la MISMA lista que «Lo que Veta hace por ti» del Inicio
      const mios = yo && VETA.d1.trabajos ? VETA.d1.trabajos().filter(t => ['propuesta', 'a-prueba', 'en-marcha'].includes(t.estado)).map(t => t.nombre + ' · ' + (t.estado === 'propuesta' ? 'Te lo propongo' : t.estado === 'a-prueba' ? 'Lo estamos probando' : 'En marcha')) : [];   // sin cifras: es la ficha de una persona
      return [!x.total ? {texto: 'La semana pasada, nada: está de baja.'} : null,
        mios.length ? {titulo: 'Los trabajos de la oficina', lista: mios} : null,
        ap.length ? {titulo: yo ? 'Lo que he aprendido de ti' : `Lo que he aprendido de ${x.p.corto}`, lista: ap} : null].filter(Boolean);
    }
  });

  // ---------------- d-sola y d-aprendi · G3, lo que hice yo sola y lo que aprendí ----------------
  VETA.hojaTexto('d-sola', {
    titulo: 'Lo que hice yo sola',
    bloques: () => {
      const n = D.numeros;
      return [{texto: `Terminasteis ${n['7d'][2]} cosas; la de antes, ${n.semanaAnterior.completados}.`},
        {texto: `Sigo yo sola ${n['7d'][6]} tareas: miro si llega un papel o si alguien contesta.`},
        {texto: 'Mensajes que envío yo sola: ninguno. Durante el piloto no envío nada sin vuestra aprobación.'}];
    }
  });
  VETA.hojaTexto('d-aprendi', {
    titulo: 'Lo que aprendí',
    bloques: () => {
      const s = D.r6.direccion.semanas, k = s.corregidos.length, sig = D.r6.direccion.pide[0];
      return [{texto: 'Por ejemplo: en Gràcia casi todos piden ver el piso en sábado.'},
        {texto: `Me corregisteis ${s.corregidos[k - 1]} veces; hace un mes, ${s.corregidos[0]}.`},
        {texto: `Lo siguiente: ${sig.tema.toLowerCase()}. Lo habéis hecho a mano ${sig.veces} veces.`}];
    },
    boton: {texto: 'Enséñamelo', ir: 'dictar/orden'}
  });

  // ---------------- d-ensenado · G21, lo que dirección le ha enseñado ----------------
  VETA.hojaTexto('d-ensenado', {
    titulo: 'Me lo has enseñado tú',
    bloques: () => [{lista: VETA.d1.ensenado().slice().reverse().map(x => (x.texto || x.que || '') + (x.hora ? ' · hoy, ' + x.hora : ''))}]
  });

  // ---------------- d-decimos · G16 · d-ejemplos · G3e ----------------
  VETA.hojaTexto('d-decimos', {
    titulo: 'Lo que decimos y lo que pasa',
    bloques: () => {
      const a = D.r6.direccion.antesAhora;
      return [{titulo: 'Lo que decimos', texto: a.decimos + '.'}, {titulo: 'Lo que pasa', texto: `La mitad de las veces, en menos de ${a.pasa.mitad}. Los viernes, ${a.pasa.viernes}.`},
        {texto: 'Cuento toda la oficina junta, desde que el cliente escribe hasta que alguien contesta.'}];
    }
  });
  VETA.hojaTexto('d-ejemplos', {
    titulo: 'Dos ejemplos',
    bloques: () => [{texto: 'Actas de visita el mismo día: de ninguna a 4 de 4.'}, {texto: 'Lista de cada día: de 46 tarjetas por semana a 21.'}, {texto: 'Son ejemplos.'}]
  });
})();
