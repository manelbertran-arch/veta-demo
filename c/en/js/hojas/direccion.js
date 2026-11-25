/* Veta demo · ronda 8 · hojas · direccion.js · carril D
   H34 Los 3 temas de hoy · H35 ¿A quién se lo asignas? / ¿A quién pasas la cartera? · H36 Cómo habría ido ·
   H40 Clientes con dos chats. Hojas propias de D: d-regla-otra (G2b “Otra cosa…”), d-tema (G3c), d-partes (G7c), d-entra (G9),
   d-preguntar y d-anotar (G18).
   Ronda 8 · nuevas, todas con las tres plantillas (acciones, texto, elegir):
   - “Más” de cada pantalla: d-asunto-mas (G2) · d-reparto-mas (G5) · d-op-mas (G18) · d-regla-mas (G2b) · d-resumen-mas (G3b)
   - r8-paradas (las operaciones paradas, con su enlace, y lo que espera decisión) · d-hoy (cómo va la oficina hoy, con sus cifras)
   - de lectura: d-pasos (G2) · d-decididas (Inicio) · d-hace (G19) · d-sola y d-aprendi (G3) · d-ensenado (G21) · d-decimos (G16) · d-ejemplos (G3e)
   Se fue H37 (“Un aviso puesto”): cada aviso lleva ya su interruptor en la lista de Tus avisos (G6). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, X = VETA.dir, D = VETA.datos;

  // ---------------- H34 · Los 3 temas de hoy (elige hasta 3) ----------------
  let eleccion = [];
  const pintaTemas = () => `<p class="hoja-x">Choose up to 3. They're the ones you'll see at the top and in the meeting.</p>` +
    `<div class="ops d-temas-h">${D.temas.map(t => {
      const on = eleccion.includes(t.id);
      return `<button type="button" class="op op-elige d-tema-op" role="checkbox" aria-checked="${on}" data-accion="tema" data-tema="${esc(t.id)}">` +
        `<span class="op-c"><span class="op-t">${esc(t.texto)}</span></span><b class="d-tema-n">${esc(t.cifra)}</b><span class="op-marca">${VETA.ic('check', 20)}</span></button>`;
    }).join('')}</div>` +
    `<p class="d-cuenta" aria-live="polite">${eleccion.length} of 3 chosen</p>` +
    UI.boton({texto: 'Save', accion: 'guardar', deshabilitado: !eleccion.length});
  VETA.hojaDef('h34', {
    titulo: 'Today\'s 3 topics',
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
        VETA.aviso('Topics saved.', {deshacer: () => { M.deshazFlag('temas'); VETA.repinta(); }});
      }
    }
  });

  // ---- ronda 6 · H35 con “para: 'op'”: cambiar quién lleva una operación (G18). Quien la deja y quien la recibe lo ven en su app. ----
  const opTexto = d => { const o = X.op(d.op); return o ? o.nombre + ' · ' + o.texto + '. Whoever handles it carries on as planned.' : ''; };
  const opOpciones = d => {
    const o = X.op(d.op) || {}, prop = ((D.contactos || []).find(c => c.id === d.op) || {}).propone;
    return ['anna', 'david', 'laura', 'marc', 'montse'].map(id => ({id, texto: X.persona(id).nombre + (id === VETA.yo().id ? ' (you)' : ''),
      sub: X.zona(id) + (id === o.lleva ? ' · has it now' : id === prop ? ' · I would give it to them' : ''), av: id}));
  };
  const opElige = (op, d) => {
    const antes = X.llevaOp(d.op), o = X.op(d.op);
    if (op.id === antes) { VETA.cierraHoja(); return; }
    X.ponLleva(d.op, op.id);
    VETA.cierraHoja(); VETA.repinta();
    setTimeout(() => VETA.aviso((o ? o.nombre : 'The deal') + ': now handled by ' + X.persona(op.id).corto + '.', {deshacer: () => {
      if (o && o.contacto && !antes) X.desasigna(d.op); else X.ponLleva(d.op, antes || (o && o.base.lleva));
      VETA.repinta();
    }}), 60);
  };

  // ---- ronda 6 · d-preguntar y d-anotar (G18): lo que dirección le pregunta a quien la lleva o anota para sí ----
  VETA.hojaAcciones('d-preguntar', {
    titulo: d => { const o = X.op(d.op); return o && o.persona ? 'Ask ' + o.persona.corto : 'Ask'; },
    texto: d => { const o = X.op(d.op); return o ? 'About ' + o.nombre + '. It reaches their Home, in their Veta. It doesn\'t go by WhatsApp.' : ''; },
    opciones: d => ['How is it going?', 'Do you need help with this one?', 'Can you call them today?'].map(t => ({texto: t, hace: () => {
      const o = X.op(d.op); X.pregunta(d.op, t); VETA.repinta();
      setTimeout(() => VETA.aviso('Question left for ' + (o && o.persona ? o.persona.corto : 'whoever handles it') + '.'), 60);
    }}))
  });
  VETA.hojaDef('d-anotar', {
    titulo: d => { const o = X.op(d.op); return o ? 'Add a note about ' + o.nombre : 'Add a note'; },
    pinta: d => UI.campo({etiqueta: 'Your note', area: true, id: 'd-nota-op', placeholder: 'For example: talk about it on Monday at the meeting'}) +
      UI.nota({icono: 'candado', texto: 'Your note is saved in this deal, with its time.'}) + UI.boton({texto: 'Save the note', accion: 'guardar-nota', datos: {op: d.op}}),
    acciones: {
      'guardar-nota'(ev, el, d) {
        const t = ((document.getElementById('d-nota-op') || {}).value || '').trim() || 'Talk about it on Monday at the meeting';
        X.anota(d.op, t); VETA.cierraHoja(); VETA.repinta();
        setTimeout(() => VETA.aviso('Note saved.'), 60);
      }
    }
  });

  // ---------------- H35 · ¿A quién se lo asignas? / ¿A quién pasas la cartera? ----------------
  VETA.hojaElegir('h35', {
    titulo: d => d.para === 'cartera' ? 'Who do you give their clients to?' : d.para === 'op' ? 'Who handles it?' : 'Who do you assign it to?',
    texto: d => d.para === 'cartera' ? 'Teresa Gil has 12 clients to share out.' : d.para === 'op' ? opTexto(d) : 'Whoever handles it decides when and what to reply.',
    opciones: d => {
      if (d.para === 'op') return opOpciones(d);
      if (d.para === 'cartera') return [{id: 'laura', texto: 'Laura Martí', sub: 'Gràcia · I would give it to her', av: 'laura'}, {id: 'anna', texto: 'Anna Costa', sub: 'Gràcia', av: 'anna'},
        {id: 'dos', texto: 'Split it between the two', sub: '17 and 17'}];
      const a = (D.asuntos || {})[d.para] || {};
      return ['laura', 'anna', 'marc', 'david', 'montse'].map(id => ({id, texto: id === VETA.yo().id ? 'You' : X.persona(id).nombre, sub: id === VETA.yo().id ? 'You handle it' : X.zona(id) + (id === a.propone ? ' · I would give it to them' : ''), av: id}));
    },
    valor: d => d.para === 'cartera' ? X.carteraA() : d.para === 'op' ? X.llevaOp(d.op) : (((D.asuntos || {})[d.para] || {}).propone || null),
    alElegir: (op, d) => {
      if (d.para === 'op') return opElige(op, d);
      if (d.para === 'cartera') { X.guarda('carteraA', op.id); VETA.repinta(); return; }
      X.asigna(d.para, op.id); AS().hecho(d.para);   // el asunto se repinta en el sitio con su “hecho” y “Deshacer"
    }
  });

  // ---------------- H36 · Cómo habría ido ----------------
  VETA.hojaTexto('h36', {
    titulo: 'How it would have gone',
    bloques: d => {
      const e = D.avisos.ejemplos.find(x => x.id === d.ejemplo);
      const casos = e ? e.casos : D.avisos.generico;
      return [{texto: (e ? 'In the last 30 days I would have alerted you ' + casos.length + ' times:' : 'With what you have written, in the last 30 days I would have alerted you ' + casos.length + ' times:')},
        {lista: casos},
        {texto: 'These are past cases: nothing went out. Once you create it, it\'ll trigger in Home.'}];
    }
  });

  // ---------------- H40 · Clientes con dos chats ----------------
  VETA.hojaTexto('h40', {
    titulo: 'Clients with two chats',
    bloques: () => [{texto: 'Veta merges chats from the same phone on its own. One client, one profile.'},
      {titulo: 'Put together last week · ' + D.dosChats.length, html: `<div class="lista">${D.dosChats.map(c => UI.fila({titulo: c.texto, sub: c.sub})).join('')}</div>`}]
  });

  // ---------------- d-regla-otra · G2b, “Más” de una propuesta: lo que no es probarla ----------------
  // (“¿Quién lo hace?” ya se toca en la pantalla: de ahí a “Subir un paso para todos” hay un toque)
  const marcaRegla = (d, estado, linea) => { const r = (D.reglasOficina || {})[d.regla] || {}; if (r.decision) { M.marca(r.decision, estado, {linea}); VETA.d1.decideRegla(d.regla); } };
  VETA.hojaMas('d-regla-otra', {
    titulo: d => { const r = (D.reglasOficina || {})[d.regla] || {}; return r.corto || r.titulo || 'This job'; },
    ensena: true,
    opciones: d => [
      {texto: 'For later', hace: () => marcaRegla(d, 'para-manana', 'For later')},
      {texto: 'Dismiss it', peligro: true, hace: () => marcaRegla(d, 'quitada', 'Dismissed')}]
  });

  // ---------------- d-tema · G3c, los casos de un tema (sin nombres de agentes) ----------------
  VETA.hojaTexto('d-tema', {
    titulo: d => ((D.temas || []).find(t => t.id === d.tema) || {texto: 'Topic'}).texto,
    bloques: d => {
      const t = (D.temas || []).find(x => x.id === d.tema) || {cifra: ''};
      const casos = d.tema === 'contactos' ? (D.contactos || []).map(c => c.nombre + ' · ' + c.cuando) : ((D.casosTema || {})[d.tema] || []);
      return [{html: `<p class="d-dato"><b>${esc(t.cifra)}</b> ${d.tema === 'respuesta' ? 'on average, last week' : 'last week'}</p>`}, {lista: casos},
        {texto: 'No agent names: it\'s for discussing as a team.'}];
    }
  });

  // ---------------- d-partes · G7c, los partes anteriores ----------------
  VETA.hojaTexto('d-partes', {
    titulo: 'Previous wrap-ups',
    bloques: () => (D.partesPiloto || []).map(p => ({titulo: p.dia, texto: p.texto}))
  });

  // ---------------- d-entra · G9, cada lista ----------------
  const TIT = {contactos: 'Contacts without a reply', dos: 'Write twice or more', no: 'Ask for what you lack', si: 'Want what you have'};
  VETA.hojaDef('d-entra', {
    titulo: d => TIT[d.lista] || 'What\'s coming in',
    pinta: d => {
      let h = '';
      if (d.lista === 'contactos') {
        h = `<div class="lista">${X.sinResponder().map(c => c.sinDueno
          ? UI.fila({titulo: c.nombre, sub: c.cuando + ' · no one has it', av: c.id, ir: 'asunto/' + c.id})
          : UI.fila({titulo: c.nombre, sub: c.cuando + (c.lleva ? ' · ' + X.persona(c.lleva).corto + ', on leave' : ' · no profile'), av: c.id})).join('')}</div>`;
        if (!X.sinResponder().length) h = `<p class="hoja-x">Everyone has someone handling them.</p>`;
      } else if (d.lista === 'dos') {
        h = `<div class="lista">${D.entra.dosVeces.map(c => UI.fila({titulo: c.texto, av: c.id})).join('')}</div>`;
      } else if (d.lista === 'no') {
        h = `<p class="hoja-x">I'll note it for when one comes in.</p><div class="lista">${D.entra.noTenemos.map(c => UI.fila({titulo: c.texto, sub: c.sub})).join('')}</div>`;
      } else {
        // sin citar su mensaje ni poner precios (25-nov-2026): el hecho, y de ahí a su asunto
        h = VETA.r7.lista([{foto: 'verdi', nombre: 'Verdi 42', pasa: '3 bedrooms. No lift (she\'d prefer one)'},
          {cara: 'carmen', nombre: 'Carmen López', pasa: 'Looking for a 3-bedroom flat in Gràcia · see what happened', ir: 'asunto/carmen'}]);
      }
      return h;
    }
  });

  // =====================================================================================================
  // ronda 8 · hojas nuevas del carril D

  // ---------------- “Más” de un asunto (G2): elegir a otra persona · para luego · descartarlo (capacidad 15 de la A) ----------------
  const AS = () => VETA.d1.asunto;
  const aparca = (id, que) => { X.aparca(id, que); AS().hecho(id); };
  const joan = (estado, linea, corto) => { M.marca('d-joan', estado, {linea, corto}); AS().hecho('joan-serra'); };
  VETA.hojaMas('d-asunto-mas', {
    titulo: d => AS().nombre(d.asunto),
    ensena: true,
    opciones: d => {
      const id = d.asunto;
      if (AS().A(id).tipo === 'queja') return [
        {texto: 'I\'ll call him', hace: () => joan('quitada', 'Joan Serra · you call him', 'You call them')},
        {texto: 'For later', hace: () => joan('para-manana', 'For later · Joan Serra', 'For later')},
        {texto: 'Dismiss the complaint', peligro: true, hace: () => joan('quitada', 'Dismissed · complaint from Joan Serra', 'Complaint dismissed')}];
      return [
        {texto: 'Choose someone else', hoja: 'h35', datos: {para: id}},
        {texto: 'For later', hace: () => aparca(id, 'luego')},
        {texto: 'Dismiss it', peligro: true, hace: () => aparca(id, 'descartado')}];
    }
  });

  // ---------------- d-pasos · G2, lo que ha pasado ----------------
  VETA.hojaTexto('d-pasos', {
    titulo: 'What has happened',
    bloques: d => AS().A(d.asunto).paso.map(x => ({titulo: x.cuando, texto: x.texto}))
  });

  // ---------------- “Más” de Reparto (G5) ----------------
  VETA.hojaMas('d-reparto-mas', {
    titulo: 'Teresa\'s clients',
    ensena: true,
    opciones: () => [{texto: 'Choose someone else', hoja: 'h35', datos: {para: 'cartera'}}, {texto: 'Clients with two chats', hoja: 'h40'}]
  });

  // ---------------- “Más” de una operación (G18) ----------------
  VETA.hojaMas('d-op-mas', {
    titulo: d => { const o = X.op(d.op); return o ? o.nombre : 'Deal'; },
    opciones: d => {
      const o = X.op(d.op); if (!o) return [];
      const yo = VETA.yo().id, per = o.persona, sin = !o.lleva || (o.deTeresa && o.lleva === 'teresa');
      const quien = {hoja: 'h35', datos: {para: 'op', op: o.id}}, anotar = {texto: 'Add a note', hoja: 'd-anotar', datos: {op: o.id}};
      return [
        sin ? null : Object.assign({texto: o.lleva === yo ? 'Give it to someone else' : 'Change who'}, quien),
        o.lleva === yo ? null : anotar,
        per && o.lleva !== yo ? {texto: `See ${per.corto}`, cara: o.lleva, ir: 'persona/' + o.lleva} : null,
        o.caso ? {texto: 'A case to learn from', ir: o.caso} : null].filter(Boolean);
    }
  });

  // ---------------- d-escalera-of · G2b, “¿Quién lo hace?”: los cinco pasos de ESTE trabajo de la oficina ----------------
  // (antes la fila abría el trabajo personal de la agente, con “Lo has hecho tú 14 veces”: un trabajo que no es el de la oficina)
  VETA.hojaTexto('d-escalera-of', {
    titulo: 'Who does it?',
    bloques: d => {
      const R = (D.reglasOficina || {})[d.regla] || {}, n = VETA.d1.pasoRegla ? VETA.d1.pasoRegla(d.regla) : 1;
      return [{texto: `${R.corto || R.titulo || 'This job'}, for the whole team. I move up a step when you say yes.`},
        {lista: VETA.vivo.niveles().map(x => `${x.nombre}${x.n === n ? ' · now' : ''}${x.n === n || x.cerrado ? '. ' + x.texto : ''}`)}];
    }
  });

  // ---------------- “Más” de un trabajo en marcha (G2b): dar un paso más ----------------
  VETA.hojaMas('d-regla-mas', {
    titulo: d => { const r = (D.reglasOficina || {})[d.regla] || {}; return r.corto || r.titulo || 'This job'; },
    texto: 'I\'ve done it 42 times and you corrected me once.',
    ensena: true,
    opciones: d => [{texto: 'Stop asking first', hace: () => VETA.d1.subeRegla(d.regla)}]
  });

  // ---------------- “Más” de Enviar el resumen (G3b) ----------------
  VETA.hojaMas('d-resumen-mas', {
    titulo: 'The summary',
    ensena: true,
    opciones: () => [{texto: 'Change the text', hace: () => VETA.d1.cambiaResumen()}]
  });

  // ---------------- r8-paradas · las que llevan más de 7 días paradas, con su enlace (capacidad 9 de la A) ----------------
  VETA.hojaAcciones('r8-paradas', {
    titulo: 'Stalled over 7 days',
    opciones: () => {
      const n = VETA.r7.cuentas().decidir;
      return X.paradas().map(o => {
        const c = M.cliente(o.cliente) || {};
        return {cara: o.cliente, texto: c.nombre || o.texto, sub: o.texto + ' · ' + o.estadoTexto.replace('Stalled · ', '').replace(/ · fase.*$/, ''), ir: 'operacion/' + o.cliente};
      }).concat(n ? [{texto: n === 1 ? '1 thing is waiting for your decision' : `${n} things are waiting for your decision`, ir: 'inicio'}] : []);
    }
  });

  // ---------------- d-hoy · cómo va la oficina hoy, con sus cifras (capacidad 14 de la A) ----------------
  const CORTO = {esperando: 'Waiting for a reply', promesas: 'Promises', quieren: 'Want to sell or buy', contactos: 'New contacts', respuesta: 'Reply time', visitas: 'Viewings'};
  VETA.hojaAcciones('d-hoy', {
    titulo: 'How the office is doing today',
    texto: '25 things under way. 8 waiting on the client.',
    opciones: () => [{texto: `Stalled over 7 days · ${X.paradas().length}`, hoja: 'r8-paradas'}]
      .concat(X.temas().map(t => ({texto: (CORTO[t.id] || t.texto) + ' · ' + t.cifra, hoja: 'd-tema', datos: {tema: t.id}})))
      .concat([{texto: 'Change the topics', hoja: 'h34'}])
  });

  // ---------------- d-decididas · Inicio, lo decidido hoy (cada fila lleva a su ficha, donde se deshace) ----------------
  VETA.hojaAcciones('d-decididas', {
    titulo: 'Decided today',
    opciones: () => VETA.d1.decididas().map(x => ({texto: x.linea, sub: x.hora ? `At ${VETA.fecha.hora(x.hora)}` : '', ir: x.ir}))
  });

  // ---------------- d-hace · G19, una persona. Sin cifras por persona (25-nov-2026): solo lo que Veta hace por ella, sin recuentos ----------------
  const ESTADO = {activa: 'I already do it', 'a-prueba': 'I\'m trying it', propuesta: 'I have suggested it'};
  VETA.hojaTexto('d-hace', {
    titulo: d => d.persona === VETA.yo().id ? 'What Veta does for you' : 'What Veta does for ' + X.persona(d.persona).corto,
    bloques: d => {
      const x = X.personaOps(d.persona), yo = d.persona === VETA.yo().id;
      const ap = x.aprendido.map(([id, t]) => { const r = id ? M.regla(id) : null; return t + ' · ' + (ESTADO[r ? r.estado : 'activa'] || ESTADO.activa); });
      const hoy = d.persona === 'laura' && VETA.r6 && VETA.r6.siempre ? VETA.r6.siempre() : null;
      if (hoy) ap.unshift(hoy.regla + ' · Taught me today');
      // lo de quien mira: los trabajos de la oficina, la MISMA lista que “Lo que Veta hace por ti” del Inicio
      const mios = yo && VETA.d1.trabajos ? VETA.d1.trabajos().filter(t => ['propuesta', 'a-prueba', 'en-marcha'].includes(t.estado)).map(t => t.nombre + ' · ' + (t.estado === 'propuesta' ? 'My suggestion' : t.estado === 'a-prueba' ? 'We\'re testing it' : 'In use')) : [];   // sin cifras: es la ficha de una persona
      return [!x.total ? {texto: 'Last week, nothing: on leave.'} : null,
        mios.length ? {titulo: 'Office jobs', lista: mios} : null,
        ap.length ? {titulo: yo ? 'What I\'ve learned from you' : `What I've learned from ${x.p.corto}`, lista: ap} : null].filter(Boolean);
    }
  });

  // ---------------- d-sola y d-aprendi · G3, lo que hice yo sola y lo que aprendí ----------------
  VETA.hojaTexto('d-sola', {
    titulo: 'What I did on my own',
    bloques: () => {
      const n = D.numeros;
      return [{texto: `You finished ${n['7d'][2]} things; the week before, ${n.semanaAnterior.completados}.`},
        {texto: `I'm following ${n['7d'][6]} tasks on my own: I watch for a document or a reply.`},
        {texto: 'Messages I send on my own: none. During the pilot I send nothing without your approval.'}];
    }
  });
  VETA.hojaTexto('d-aprendi', {
    titulo: 'What I learned',
    bloques: () => {
      const s = D.r6.direccion.semanas, k = s.corregidos.length, sig = D.r6.direccion.pide[0];
      return [{texto: 'For example: in Gràcia almost everyone asks to see the flat on a Saturday.'},
        {texto: `You corrected me ${s.corregidos[k - 1]} times; a month ago, ${s.corregidos[0]}.`},
        {texto: `Next up: ${sig.tema.toLowerCase()}. You've done it by hand ${sig.veces} times.`}];
    },
    boton: {texto: 'Teach me', ir: 'dictar/orden'}
  });

  // ---------------- d-ensenado · G21, lo que dirección le ha enseñado ----------------
  VETA.hojaTexto('d-ensenado', {
    titulo: 'You taught me this',
    bloques: () => [{lista: VETA.d1.ensenado().slice().reverse().map(x => (x.texto || x.que || '') + (x.hora ? ' · today, ' + x.hora : ''))}]
  });

  // ---------------- d-decimos · G16 · d-ejemplos · G3e ----------------
  VETA.hojaTexto('d-decimos', {
    titulo: 'What we say and what happens',
    bloques: () => {
      const a = D.r6.direccion.antesAhora;
      return [{titulo: 'What we say', texto: a.decimos + '.'}, {titulo: 'What happens', texto: `Half the time, in under ${a.pasa.mitad}. On Fridays, ${a.pasa.viernes}.`},
        {texto: 'I count the whole office together, from when the client writes until someone replies.'}];
    }
  });
  VETA.hojaTexto('d-ejemplos', {
    titulo: 'Two examples',
    bloques: () => [{texto: 'Viewing notes the same day: from none to 4 out of 4.'}, {texto: 'Each day\'s list: from 46 cards a week to 21.'}, {texto: 'These are examples.'}]
  });
})();
