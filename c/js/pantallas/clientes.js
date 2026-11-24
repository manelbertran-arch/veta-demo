/* Veta demo · pantallas · clientes.js · B (Clientes) · ronda 7
   - A5 · Clientes · #/clientes: rejilla de caras, tres por fila. Debajo de cada cara, su nombre y una línea corta
     («Te ha escrito», «Visita hoy», «Al día»). Quien está en «Te toca a ti» lleva lo que le toca; quien no, su estado («Al día»).
     Punto rojo, solo en quien está «Sin contestar». Arriba, dos pastillas: «Te necesitan» (se abre aquí) y «Todos».
     El buscador (un nombre o una pregunta a Veta), detrás de la lupa de arriba a la derecha.
     Al final, una fila «Chats que no miro» (H13). El número sale de VETA.r7.cuentas().clientes (R9).
   - A5b · #/clientes/al-dia: la ruta sigue viva (enlaces viejos); hoy es la misma rejilla con los que no te necesitan.
   Ayudas comunes en VETA.B (datos/extra-b.js); textos cortos en VETA.datos.r7b (datos/r7-b.js). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const X = () => D.r7b || {corto: {}};
  const RANGO = {'te-toca': 0, 'oportunidad': 1, 'parado': 2, 'esperando': 3};
  const QUIETOS = ['al-dia', 'cerrado'];
  const ord = id => { const k = D.b.orden.indexOf(id); return k < 0 ? 99 : k; };
  // lo que se escribe y se marca arriba (vive mientras la pestaña esté abierta)
  const st = {q: '', vista: 'necesitan', abierto: false};   // se abre en «Te necesitan»; el buscador, cerrado tras la lupa

  const mios = () => Object.keys(D.clientes).map(B.cli).filter(c => c && !c.fuera && c.lleva === VETA.yo().id && c.cartera !== false);
  // te necesita = está en «Te toca a ti»: las mismas personas que esa caja y esa lista (VETA.r7.quienes('hoy'), una sola fuente)
  const hoyIds = () => [...new Set(VETA.r7.quienes('hoy'))];
  const necesita = (c, s) => (Array.isArray(s) ? s : hoyIds()).includes(c.id);
  const enOrden = l => { const s = hoyIds(); return l.slice().sort((a, b) => (necesita(b, s) - necesita(a, s)) || (RANGO[a.estado] ?? 4) - (RANGO[b.estado] ?? 4) ||
    (a.estado === 'cerrado') - (b.estado === 'cerrado') || (necesita(a, s) ? ord(a.id) - ord(b.id) : a.nombre.localeCompare(b.nombre, 'es'))); };
  const todos = () => enOrden(mios());
  const teNecesitan = () => hoyIds().map(B.cli).filter(Boolean);   // en el orden de «Te toca a ti»

  // su cosa de «Te toca a ti» (la misma lista que la caja), si está ahí
  const cosaHoy = c => necesita(c) ? (M.pendientes(VETA.yo().id) || []).find(y => y.cliente === c.id) || null : null;
  const deHoy = k => (((D.r7a1 || {}).cosas || {})[k.id]) || {};   // lo que dice su fila de «Te toca a ti»
  // la línea corta de debajo de la cara (cabe en un tercio de pantalla). Quien está en «Te toca a ti» lleva lo que toca;
  // quien no, su estado de verdad o «Al día»: nunca «Toca…».
  const GENERICO = {'parado': 'Parado', 'al-dia': 'Al día', 'cerrado': 'Cerrado'};
  function corto(c) {
    const k = cosaHoy(c);
    if (k) return X().hoy && X().hoy[k.id] || deHoy(k).pasa || 'Te espera';
    const igual = ((D.clientes[c.id] || {}).estado || null) === c.estado;   // aún en el estado del principio
    if (c.bCosaHecha) return 'Hecho hoy';
    if (c.bLlamada) return 'Hablasteis hoy';
    if (c.bResp) return 'Ya contestó';
    if (c.estado === 'esperando') return 'Le has escrito';
    return (igual && X().corto[c.id]) || GENERICO[c.estado] || 'Al día';
  }
  // el punto: solo rojo, en quien en «Te toca a ti» está «Sin contestar». Nada más.
  function punto(c) {
    const k = cosaHoy(c); if (!k || k.estado === 'pregunta-envio' || (k.extra || {}).r6) return '';   // como la pastilla de su fila
    const d = deHoy(k);
    return (d.tono ? d.tono === 'rojo' : k.tipo === 'mensaje') ? 'rojo' : '';
  }
  const DICE = {rojo: 'Sin contestar.'};
  function cara(c, k) {
    const p = punto(c), t = corto(c);
    return `<button type="button" class="rb-cara" data-ir="cliente/${esc(c.id)}" style="--k:${Math.min(k || 0, 9)}" aria-label="${esc([c.nombre, t, DICE[p]].filter(Boolean).join('. '))}">` +
      `<span class="rb-cara-f">${VETA.av(c.id, 64, {nombre: c.nombre})}${p ? `<i class="rb-punto rb-${p}" aria-hidden="true"></i>` : ''}</span>` +
      `<span class="rb-cara-n">${esc((X().nombre || {})[c.id] || c.nombre)}</span><span class="rb-cara-p">${esc(t)}</span></button>`;
  }
  const rejilla = l => `<div class="rb-rejilla">${l.map(cara).join('')}</div>`;
  VETA.rb = Object.assign(VETA.rb || {}, {necesita, corto, punto, rejilla, teNecesitan});

  // ---- preguntas: de lo escrito a una ruta de A5p ----
  B.rutaPregunta = q => {
    const n = B.norm(q);
    const P = B.preguntas();
    const id = Object.keys(P).find(k => P[k].claves.some(cl => cl.every(x => n.includes(x))) || B.norm(P[k].pregunta) === n);
    return 'pregunta/' + (id || encodeURIComponent(String(q).trim()));
  };
  // ¿lo escrito es una pregunta? (empieza por «¿» o por qué/quién/cuándo…, acaba en «?» o tiene más de dos palabras)
  const INTERROGA = ['que', 'quien', 'quienes', 'cuando', 'cuanto', 'cuanta', 'cuantos', 'cuantas', 'como', 'donde', 'cual', 'cuales', 'por', 'hay', 'tengo'];
  const esPregunta = q => { const t = String(q || '').trim(), n = B.norm(t); return /^¿|\?$/.test(t) || INTERROGA.includes(n.split(' ')[0]) || n.split(' ').length > 2; };
  // los clientes cuyo nombre (o nombre corto) sale en lo escrito: «¿Qué le prometí a Jordi?» → Jordi Ferrer
  const nombrados = (base, q) => { const n = ' ' + B.norm(q) + ' '; return base.filter(c => n.includes(' ' + B.norm(c.nombre) + ' ') || n.includes(' ' + B.norm(B.corto(c)) + ' ')); };

  // ---- lo de debajo del buscador: la rejilla (o lo que se busca) y la fila de los chats que no miro ----
  function zona() {
    const q = B.norm(st.q);
    if (q) {
      const base = todos(), pregunta = esPregunta(st.q);
      const hay = pregunta ? nombrados(base, st.q) : base.filter(c => B.norm(c.nombre).includes(q));
      const preg = VETA.r7.lista([{icono: 'pregunta', oro: true, nombre: 'Preguntárselo a Veta', pasa: `«${st.q.trim()}»`, ir: B.rutaPregunta(st.q), datos: {limpia: '1'}}]);
      if (pregunta) return preg + (hay.length ? rejilla(hay) : '');
      if (!hay.length) return `<p class="rb-nadie">Nadie se llama así.</p>` + preg;
      return rejilla(hay) + preg;
    }
    const l = st.vista === 'necesitan' ? teNecesitan() : todos();
    const fuera = M.chatsFuera();
    return (l.length ? rejilla(l) : `<p class="rb-nadie">Ahora nadie te necesita. Si alguien escribe, sale aquí.</p>`) +
      (VETA.yo().papel === 'direccion' || !fuera ? '' : VETA.r7.lista([{icono: 'escudo', nombre: 'Chats que no miro', pasa: `${fuera} chats tuyos, personales. No los leo.`, hoja: 'h13'}], {clase: 'rb-fuera'}));
  }
  const filtros = () => {
    const n = teNecesitan().length, t = VETA.r7.cuentas().clientes;
    const b = (id, texto, k) => `<button type="button" class="rb-filtro" data-accion="vista" data-valor="${id}" aria-pressed="${st.vista === id}">${esc(texto)} <b>${k}</b></button>`;
    return `<div class="rb-filtros" role="group" aria-label="Qué caras ver">${b('necesitan', 'Te necesitan', n)}${b('todos', 'Todos', t)}</div>`;
  };

  const limpia = () => { st.q = ''; st.abierto = false; };
  // la lupa de arriba a la derecha: abre el buscador; abierta, es la cruz que lo cierra y lo deja limpio
  const lupa = () => `<button type="button" class="rb-lupa" data-accion="lupa" aria-expanded="${st.abierto}" aria-label="${st.abierto ? 'Cerrar el buscador' : 'Buscar un nombre o preguntar a Veta'}">${VETA.ic(st.abierto ? 'cerrar' : 'pregunta', 22)}</button>`;
  // tocar «Preguntárselo a Veta» deja el buscador limpio para la vuelta
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.pant-A5 [data-limpia]')) limpia(); }, true);
  const refresca = el => { const r = el.querySelector('.rb-zona'); if (r) r.innerHTML = zona(); const f = el.querySelector('.rb-filtros'); if (f) f.hidden = !!st.q.trim(); };

  VETA.pantalla('A5', {
    titulo: 'Clientes',
    frase: () => { const n = teNecesitan().length; return `Tus ${VETA.r7.cuentas().clientes} clientes. ${n ? `Hoy te necesitan ${n}.` : 'Hoy no te necesita nadie.'} Toca una cara para ver qué pasa.`; },
    guia: ['Aquí ves a tus clientes, primero los que te necesitan.', 'Tú tocas una cara o buscas un nombre.', 'Así no repasas chats para saber qué pasa con cada uno.'],
    cabDerecha: lupa,
    pinta: () => {
      // dirección ve solo sus clientes: a los de otra persona se llega desde Equipo, por un asunto concreto
      return (st.abierto ? `<div class="b-caja rb-buscar">${UI.campo({buscar: true, id: 'b-buscar', placeholder: 'Un nombre o una pregunta', valor: st.q})}</div>` : '') +
        filtros() + `<div class="rb-zona">${zona()}</div>`;
    },
    alMontar: el => {
      const inp = el.querySelector('#b-buscar'); if (!inp) return;
      if (st.foco) { st.foco = false; inp.focus(); }
      inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', 'Un nombre o una pregunta');
      const f = el.querySelector('.rb-filtros'); if (f) f.hidden = !!st.q.trim();
      inp.addEventListener('input', () => { st.q = inp.value; refresca(el); });
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || !inp.value.trim()) return;
        e.preventDefault();
        const n = B.norm(inp.value), uno = mios().filter(c => B.norm(c.nombre).includes(n));
        const ruta = uno.length === 1 && !esPregunta(inp.value) ? 'cliente/' + uno[0].id : B.rutaPregunta(inp.value);
        if (ruta.startsWith('pregunta/')) limpia();
        inp.blur(); VETA.ir(ruta);
      });
    },
    acciones: {
      lupa() {
        if (st.abierto) limpia(); else { st.abierto = true; st.foco = true; }
        VETA.repinta();
      },
      vista(ev, el) {
        st.vista = el.dataset.valor;
        const pant = el.closest('.pant');
        VETA.$$('.rb-filtro', pant).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.valor === st.vista)));
        refresca(pant);
      }
    }
  });

  // ---- A5b · los que hoy no te necesitan (antes «Al día»; ahora es la pastilla «Todos», la ruta sigue viva) ----
  const quietos = () => todos().filter(c => !necesita(c));
  VETA.pantalla('A5b', {
    titulo: 'No te necesitan hoy',
    frase: () => `Estos ${quietos().length} hoy no te necesitan. Toca una cara para ver qué pasa.`,
    guia: ['Aquí están los clientes que hoy no te necesitan.', 'Tú abres cualquiera para ver su ficha.', 'Así ves la cartera entera sin que estorbe arriba.'],
    pinta: () => rejilla(quietos())
  });
})();
