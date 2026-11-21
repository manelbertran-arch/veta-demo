/* Veta demo · pantallas · clientes.js · paquete B (Clientes)
   - A5 · Clientes · #/clientes (P0): quién te necesita, arriba; la caja busca por nombre o pregunta a Veta.
   - A5b · Los que no te necesitan hoy · #/clientes/al-dia (P1): los que están al día y los cerrados, por orden alfabético.
   En dirección, A5 enseña solo los clientes de Montse (sin «Todos»: los de otra persona se abren desde Equipo). Ayudas comunes en VETA.B (datos/extra-b.js). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, B = VETA.B, M = VETA.modelo, D = VETA.datos;
  const RANGO = {'te-toca': 0, 'oportunidad': 1, 'parado': 2, 'esperando': 3};
  const ord = id => { const k = D.b.orden.indexOf(id); return k < 0 ? 99 : k; };
  // lo que se escribe y se marca en la caja (vive mientras la pestaña esté abierta)
  const st = {q: '', filtro: null, vista: 'mios', anima: false};

  const yoDir = () => VETA.yo().papel === 'direccion';
  const mios = () => Object.keys(D.clientes).map(B.cli).filter(c => c && !c.fuera && c.lleva === VETA.yo().id && c.cartera !== false);
  const aLaVista = () => mios().filter(c => !['al-dia', 'cerrado'].includes(c.estado))
    .sort((a, b) => (RANGO[a.estado] ?? 4) - (RANGO[b.estado] ?? 4) || ord(a.id) - ord(b.id));
  const alDia = () => mios().filter(c => ['al-dia', 'cerrado'].includes(c.estado)).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  // «Te toca», «Esperando» y «Al día» van en texto neutro; solo lo que se sale de lo normal lleva color
  const NEUTRO = {'te-toca': 'Te toca', 'esperando': 'Esperando', 'al-dia': 'Al día'};
  const subCli = c => NEUTRO[c.estado || 'te-toca']
    ? `<span class="b-mot"><span class="b-mot-t"><b class="b-mot-e">${NEUTRO[c.estado || 'te-toca']}</b> · ${esc(B.motivo(c))}</span></span>`
    : `<span class="b-mot">${UI.etiqueta(c.estado, c.estado === 'parado' ? 'Parado' : c.estado === 'cerrado' ? 'Cerrado' : null)}<span class="b-mot-t">${esc(B.motivo(c))}</span></span>`;
  const filaCli = (c, k) => UI.fila({titulo: c.nombre, subHtml: subCli(c), av: c.id, focoFoto: true, ir: 'cliente/' + c.id, clase: 'b-fila', datos: {k: Math.min(k || 0, 6)}});

  // ---- las operaciones de la oficina (dirección › Todos) ----
  const ETQ_OP = {'en-marcha': 'en-marcha', parado: 'parado', cerrado: 'cerrado', caida: 'vencida'};
  const ops = () => {
    const sigo = B.mapa('marcas');
    return M.operaciones().map(o => Object.assign({}, o, {c: M.cliente(o.cliente) || {nombre: o.cliente}, sigo: !!(sigo[o.cliente] && sigo[o.cliente].seguir)}));
  };
  const filaOp = (o, k) => UI.fila({titulo: o.c.nombre, av: o.cliente, focoFoto: true, ir: 'cliente/' + o.cliente, clase: 'b-fila', datos: {k: Math.min(k, 6)},
    subHtml: `<span class="b-mot">${UI.etiqueta(ETQ_OP[o.estado] || 'te-toca', o.estadoTexto)}<span class="b-mot-t">${esc(o.texto)} · ${esc((M.persona(o.lleva) || {}).corto || '')}</span></span>`});
  const FILTROS_OP = [{id: 'todas', texto: 'Todas', f: () => true}, {id: 'parado', texto: 'Paradas', f: o => o.estado === 'parado'}, {id: 'en-marcha', texto: 'En marcha', f: o => o.estado === 'en-marcha'},
    {id: 'cerrado', texto: 'Cerradas', f: o => o.estado === 'cerrado'}, {id: 'caida', texto: 'Caídas', f: o => o.estado === 'caida'}, {id: 'sigo', texto: 'Las que sigues', f: o => o.sigo}];
  const FILTROS = [{id: 'te-toca', texto: 'Te tocan'}, {id: 'oportunidad', texto: 'Oportunidades'}, {id: 'parado', texto: 'Parados'}, {id: 'esperando', texto: 'Esperando respuesta'}];
  const filtros = () => st.vista === 'todos'
    ? FILTROS_OP.map(f => ({id: f.id, texto: f.texto, n: ops().filter(f.f).length}))
    : FILTROS.map(f => ({id: f.id, texto: f.texto, n: mios().filter(c => c.estado === f.id).length}));

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

  // ---- lo que hay debajo de la caja: sugerencias, filtro, resultados o la lista ----
  function sugerencias() {
    const fl = filtros();
    return `<div class="b-sug-in"><p class="b-sug-r">Ver solo</p><div class="b-chips">${fl.map((f, k) =>
      `<button type="button" class="b-chip" data-accion="filtro" data-valor="${esc(f.id)}" style="--k:${k}">${esc(f.texto)} · <b>${f.n}</b></button>`).join('')}</div>` +
      (st.vista === 'todos' ? '' : `<p class="b-sug-r">Pregunta a Veta</p>` + UI.lista(Object.entries(B.preguntas()).map(([k, x]) => ({titulo: x.pregunta, icono: 'pregunta', ir: 'pregunta/' + k})), {clase: 'b-preg'})) +
      '</div>';
  }
  function resultados() {
    const anima = st.anima ? ' b-entra' : ''; st.anima = false;
    const q = B.norm(st.q);
    // escribiendo: el nombre filtra al momento; lo demás se pregunta
    if (q) {
      const base = st.vista === 'todos' ? ops().map(o => Object.assign({}, o.c, {op: o})) : mios();
      const pregunta = esPregunta(st.q);
      const hay = pregunta ? nombrados(base, st.q) : base.filter(c => B.norm(c.nombre).includes(q));
      const preg = UI.lista([{titulo: `Preguntar a Veta: «${st.q.trim()}»`, icono: 'pregunta', ir: B.rutaPregunta(st.q), clase: 'b-preguntar', datos: {limpia: '1'}}]);
      // una pregunta: primero «Preguntar a Veta», y debajo los clientes que nombra (sin aviso de vacío)
      if (pregunta) return `<div class="b-res${anima}">${preg}${hay.length ? UI.lista(hay.map((c, k) => c.op ? filaOp(c.op, k) : filaCli(c, k))) : ''}</div>`;
      if (!hay.length) return `<div class="b-res${anima}">` + UI.vacio({titulo: 'No hay ningún cliente con ese nombre.', texto: 'Prueba a preguntarlo.', icono: 'pregunta'}) + preg + '</div>';
      return `<div class="b-res${anima}">${UI.lista(hay.map((c, k) => c.op ? filaOp(c.op, k) : filaCli(c, k)))}${preg}</div>`;
    }
    if (st.vista === 'todos') {
      const f = FILTROS_OP.find(x => x.id === st.filtro) || FILTROS_OP[0];
      const l = ops().filter(f.f);
      return `<div class="b-res${anima}">${barraFiltro(f.texto, l.length, f.id !== 'todas')}` +
        (l.length ? UI.lista(l.map(filaOp)) : UI.vacio({titulo: 'Ninguna operación aquí.', texto: 'Las que marques con «Seguir de cerca» en su ficha salen en esta lista.', icono: 'estrella'})) + '</div>';
    }
    if (st.filtro) {
      const f = FILTROS.find(x => x.id === st.filtro);
      const l = mios().filter(c => c.estado === st.filtro);
      return `<div class="b-res${anima}">${barraFiltro(f.texto, l.length, true)}` +
        (l.length ? UI.lista(l.map(filaCli)) : UI.vacio({titulo: 'Nadie en este grupo ahora.', texto: 'Cuando alguien entre aquí, te lo pongo arriba.', icono: 'check'})) + '</div>';
    }
    const vista = aLaVista(), resto = alDia().length, fuera = M.chatsFuera();
    return `<div class="b-res${anima}">` +
      (vista.length ? UI.lista(vista.map(filaCli), {i: 1}) : UI.vacio({titulo: 'Nadie te necesita ahora.', texto: 'Si alguien escribe o se para una operación, sale aquí.', icono: 'check', i: 1})) +
      UI.lista([
        resto ? {titulo: `Los otros ${resto} no te necesitan hoy`, icono: 'check', ir: 'clientes/al-dia'} : null,
        yoDir() ? null : {titulo: 'Fuera del radar', sub: `${fuera} chats personales que no miro`, icono: 'escudo', hoja: 'h13'}
      ], {i: 2}) + '</div>';
  }
  const barraFiltro = (texto, n, quitar) => `<div class="b-filtro" data-i="1"><span class="b-filtro-t">${VETA.ic('check', 18)}<span>${esc(texto)} · ${n}</span></span>` +
    (quitar ? UI.boton({tipo: 'texto', texto: 'Quitar filtro', accion: 'quita-filtro', ancho: false}) : '') + '</div>';

  const limpia = () => { st.q = ''; st.filtro = null; };
  // tocar «Preguntar a Veta: «…»» también deja la caja limpia para la vuelta
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.pant-A5 [data-limpia]')) limpia(); }, true);

  // pinta solo lo de debajo de la caja (escribir no repinta la pantalla: no se pierde el foco)
  const refresca = el => { const r = el.querySelector('.b-zona'); if (r) r.innerHTML = resultados(); };
  const abreSug = (el, on) => { const s = el.querySelector('.b-sug'); if (s) { s.classList.toggle('on', on); s.setAttribute('aria-hidden', on ? 'false' : 'true'); s.inert = !on; } };

  VETA.pantalla('A5', {
    titulo: 'Clientes',
    guia: ['Aquí Veta ordena tus clientes por quién te necesita hoy.', 'Tú buscas un nombre o le preguntas algo a Veta.', 'Así no buscas por orden alfabético ni repasas chats.'],
    pinta: () => {
      // dirección ve solo sus clientes: a los de otra persona se llega desde Equipo, por un asunto concreto
      st.vista = 'mios';
      return `<div class="b-caja" data-i="0">${UI.campo({buscar: true, id: 'b-buscar', placeholder: 'Busca un nombre o pregunta algo', valor: st.q})}</div>` +
        `<div class="b-sug" aria-hidden="true" inert>${sugerencias()}</div>` +
        `<div class="b-zona">${resultados()}</div>`;
    },
    alMontar: el => {
      const inp = el.querySelector('#b-buscar'); if (!inp) return;
      inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', 'Busca un nombre o pregunta algo');
      const sug = el.querySelector('.b-sug');
      // tocar una sugerencia no le quita el foco a la caja
      sug.addEventListener('pointerdown', e => { if (e.target.closest('button')) e.preventDefault(); });
      inp.addEventListener('focus', () => abreSug(el, !inp.value.trim()));
      inp.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== inp) abreSug(el, false); }, 120));
      inp.addEventListener('input', () => { st.q = inp.value; st.filtro = null; st.anima = true; abreSug(el, !inp.value.trim()); refresca(el); });
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || !inp.value.trim()) return;
        e.preventDefault();
        const n = B.norm(inp.value), uno = mios().filter(c => B.norm(c.nombre).includes(n));
        const ruta = uno.length === 1 && !esPregunta(inp.value) ? 'cliente/' + uno[0].id : B.rutaPregunta(inp.value);
        // al volver de la respuesta, la caja está vacía y la lista entera
        if (ruta.startsWith('pregunta/')) limpia();
        inp.blur(); VETA.ir(ruta);
      });
    },
    acciones: {
      filtro(ev, el) {
        st.filtro = el.dataset.valor; st.q = ''; st.anima = true;
        const pant = el.closest('.pant'), inp = pant.querySelector('#b-buscar');
        if (inp) { inp.value = ''; inp.blur(); }
        abreSug(pant, false); refresca(pant);
      },
      'quita-filtro'(ev, el) { st.filtro = null; st.anima = true; refresca(el.closest('.pant')); },
      vista(ev, el) { st.vista = el.dataset.valor; st.filtro = null; st.q = ''; st.anima = true; VETA.repinta(); }
    }
  });

  // ---- A5b · Los que no te necesitan hoy ----
  const stb = {q: ''};
  const filasAlDia = () => {
    const q = B.norm(stb.q);
    const l = alDia().filter(c => !q || B.norm(c.nombre).includes(q));
    if (!l.length) return UI.vacio({titulo: 'No hay ningún cliente con ese nombre.', texto: 'Prueba a preguntarlo desde Clientes.', icono: 'pregunta'});
    return UI.lista(l.map((c, k) => UI.fila({titulo: c.nombre, av: c.id, focoFoto: true, ir: 'cliente/' + c.id, clase: 'b-fila', datos: {k: Math.min(k, 6)},
      subHtml: c.estado === 'cerrado' ? `<span class="b-mot">${UI.etiqueta('cerrado', c.id === 'carme-font' ? 'Cerrado · vendió en junio' : 'Cerrado')}</span>`
        : `<span class="b-mot"><span class="b-mot-t"><b class="b-mot-e">Al día</b> · ${esc(c.bLlamada ? 'hablasteis hoy' : c.quienEs || '')}</span></span>`})));
  };
  VETA.pantalla('A5b', {
    titulo: 'Al día',
    guia: ['Aquí están los clientes que hoy no te necesitan.', 'Tú abres cualquiera para ver su ficha.', 'Así ves la cartera entera sin que estorbe arriba.'],
    pinta: () => `<div class="b-caja" data-i="0">${UI.campo({buscar: true, id: 'b-buscar-b', placeholder: 'Busca un nombre', valor: stb.q})}</div>` +
      `<p class="intro" data-i="1">${alDia().length} clientes al día o cerrados, por orden alfabético.</p><div class="b-zona" data-i="2">${filasAlDia()}</div>`,
    alMontar: el => {
      const inp = el.querySelector('#b-buscar-b'); if (!inp) return;
      inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', 'Busca un nombre');
      inp.addEventListener('input', () => { stb.q = inp.value; el.querySelector('.b-zona').innerHTML = `<div class="b-entra">${filasAlDia()}</div>`; });
    }
  });
})();
