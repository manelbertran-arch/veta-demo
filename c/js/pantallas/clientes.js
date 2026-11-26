/* Veta demo · pantallas · clientes.js · B (Clientes) · ronda 8
   - A5 · Clientes · #/clientes: el buscador siempre a la vista (un nombre o una pregunta a Veta; de marcador, una pregunta
     de verdad), cinco filtros con su cuenta (Todos · Te necesitan · Parados · Oportunidades · Esperando) y la lista: cada
     cliente con su cara y su motivo, en un renglón. Pastilla roja, solo en quien está «Sin contestar».
     Al tocar el buscador vacío salen las tres preguntas preparadas.
     Las caras (D16): quien tiene una operación contigo lleva su foto y va delante; quien solo ha pasado (una visita, una
     valoración) lleva sus iniciales y va detrás, por orden alfabético. Nunca una foto suelta entre iniciales.
     «Te necesitan» son las mismas personas que el Inicio (VETA.r7.quienes('hoy'), una sola fuente).
     Dirección ve solo sus clientes: a los de otra persona se llega desde Equipo, por un asunto concreto.
   - La ruta vieja #/clientes/al-dia la redirige el núcleo aquí y deja dicho el filtro «Todos» (VETA.est 'r8.filtroClientes').
   Ayudas comunes y motivos en VETA.B (datos/extra-b.js). */
(function () {
  'use strict';
  const UI = VETA.UI, B = VETA.B, M = VETA.modelo, D = VETA.datos, r7 = VETA.r7;
  const RANGO = {'te-toca': 0, 'oportunidad': 1, 'parado': 2, 'esperando': 3};
  const ord = id => { const k = D.b.orden.indexOf(id); return k < 0 ? 99 : k; };
  // lo que se escribe y el filtro elegido (viven mientras la pestaña esté abierta); foco: el buscador está tocado
  const st = {q: '', vista: 'todos', foco: false};

  const mios = () => Object.keys(D.clientes).map(id => B.cli(id)).filter(c => c && !c.fuera && c.lleva === VETA.yo().id && c.cartera !== false);
  // te necesita = está en lo que te toca hoy: las mismas personas que el Inicio
  const hoyIds = () => [...new Set(r7.quienes('hoy'))];
  const necesita = (c, s) => (Array.isArray(s) ? s : hoyIds()).includes(c.id);
  // con operación (abierta o cerrada) = cliente de ficha completa, con su foto; el resto son contactos, con iniciales
  const conOperacion = c => !!c.operacion;
  const enOrden = l => { const s = hoyIds(); return l.slice().sort((a, b) => (necesita(b, s) - necesita(a, s)) || (RANGO[a.estado] ?? 4) - (RANGO[b.estado] ?? 4) ||
    (conOperacion(b) - conOperacion(a)) || (a.estado === 'cerrado') - (b.estado === 'cerrado') || (necesita(a, s) ? ord(a.id) - ord(b.id) : a.nombre.localeCompare(b.nombre, 'es'))); };
  const teNecesitan = () => hoyIds().map(id => B.cli(id)).filter(Boolean);   // en el orden del Inicio
  const todos = () => enOrden(mios());
  // lo que se ve en «Todos»: tu cartera y, además, quien te necesita hoy aunque no sea de ella (Sergi Mas): así la cuenta de «Todos» es la de las fichas que salen
  const verTodos = () => { const t = todos(), ids = new Set(t.map(c => c.id)); return t.concat(teNecesitan().filter(c => !ids.has(c.id))); };
  const de = estado => () => todos().filter(c => c.estado === estado);
  const FILTROS = [{id: 'todos', texto: 'Todos', l: verTodos}, {id: 'necesitan', texto: 'Te necesitan', l: teNecesitan},
    {id: 'parado', texto: 'Parados', l: de('parado')}, {id: 'oportunidad', texto: 'Ocasiones', l: de('oportunidad')}, {id: 'esperando', texto: 'Esperando', l: de('esperando')}];
  const VACIO = {todos: 'Todavía no llevas ningún cliente.', necesitan: 'Ahora nadie te necesita.', oportunidad: 'Ahora no hay oportunidades.',
    parado: 'No tienes a nadie parado.', esperando: 'No esperas la respuesta de nadie.'};

  // la pastilla: solo roja, en quien hoy está sin contestar (un mensaje suyo que aún no has enviado)
  const cosaHoy = c => necesita(c) ? (M.pendientes(VETA.yo().id) || []).find(y => y.cliente === c.id) || null : null;
  const sinContestar = c => { const k = cosaHoy(c); return !!k && k.tipo === 'mensaje' && k.estado !== 'pregunta-envio' && !(k.extra || {}).r6; };
  // ficha con la cara a 64 px; una sola chapa, al pie, y solo con dato (sin contestar, o su estado); lo demás, la frase de siempre
  const CHAPA = {parado: ['neutro', 'Parado'], oportunidad: ['veta', 'Ocasión'], esperando: ['esp', 'Esperando']};
  const chapaDe = c => { if (sinContestar(c)) return {tono: 'urg', texto: 'Sin contestar'}; const k = CHAPA[c.estado]; return k && !(B.motivo(c) || '').startsWith(k[1]) ? {tono: k[0], texto: k[1]} : null; };
  const retrato = c => VETA.v.retrato(c.id, {nombre: c.nombre, frase: B.motivo(c) || '', chapa: chapaDe(c), ir: 'cliente/' + c.id});
  const rotulo = (t, n) => `<h2 class="rb-et">${VETA.esc(t)}<small>${n}</small></h2>`;
  // la cartera: «Te necesitan» en carrusel y «El resto» (en un filtro, la parte de ese filtro): quien tiene foto, en fichas con su retrato de dos en dos;
  // quien no la tiene, en filas compactas debajo (nunca una losa vacía a toda tarjeta). Los de «Te necesitan» van todos en el carrusel, con foto o con monograma.
  // «Te necesitan» sale siempre de teNecesitan() (las personas del Inicio, Sergi Mas incluido aunque no sea de tu cartera): la misma cuenta en la pastilla, en el rótulo y en las fichas.
  function cartera(f, l) {
    if (!l.length) return r7.vacio(VACIO[f.id]);
    // «Todos» separa a quien te necesita; «Te necesitan» es solo eso; los demás filtros (Parados, Ocasiones, Esperando) son un solo grupo, sin rótulo que mienta
    const s = hoyIds(), parte = f.id === 'todos', ya = parte || f.id === 'necesitan' ? teNecesitan() : [], resto = parte ? l.filter(c => !necesita(c, s)) : f.id === 'necesitan' ? [] : l;
    const conFoto = resto.filter(c => VETA.v.tieneFoto(c.id)), sinFoto = resto.filter(c => !VETA.v.tieneFoto(c.id));
    return (ya.length ? `<section class="rb-sec">${rotulo('Te necesitan', ya.length)}${VETA.v.carrusel({id: 'rb-car', clase: 'v-car-rts', etiqueta: 'Te necesitan', tarjetas: ya.map(retrato)})}</section>` : '') +
      (resto.length ? `<section class="rb-sec">${parte ? rotulo('El resto', resto.length) : ''}` +
        (conFoto.length ? `<div class="v-rej">${conFoto.map(retrato).join('')}</div>` : '') + (sinFoto.length ? r7.lista(sinFoto.map(fila)) : '') + '</section>' : '');
  }
  const fila = c => ({cara: c.id, nombre: c.nombre, pasa: B.motivo(c) || null, pastilla: sinContestar(c) ? 'Sin contestar' : null, ir: 'cliente/' + c.id});

  // ---- preguntas: de lo escrito a una ruta de A5p ----
  B.rutaPregunta = q => {
    const n = B.norm(q);
    const P = B.preguntas();
    const id = Object.keys(P).find(k => P[k].claves.some(cl => cl.every(x => n.includes(x))) || B.norm(P[k].pregunta) === n);
    return 'pregunta/' + (id || encodeURIComponent(String(q).trim()));
  };
  // ¿lo escrito es una pregunta? (empieza por «¿» o por qué/quién/cuándo, acaba en «?» o tiene más de dos palabras)
  const INTERROGA = ['que', 'quien', 'quienes', 'cuando', 'cuanto', 'cuanta', 'cuantos', 'cuantas', 'como', 'donde', 'cual', 'cuales', 'por', 'hay', 'tengo'];
  const esPregunta = q => { const t = String(q || '').trim(), n = B.norm(t); return /^¿|\?$/.test(t) || INTERROGA.includes(n.split(' ')[0]) || n.split(' ').length > 2; };
  // los clientes cuyo nombre (o nombre corto) sale en lo escrito: «¿Qué le prometí a Jordi?» → Jordi Ferrer
  const nombrados = (base, q) => { const n = ' ' + B.norm(q) + ' '; return base.filter(c => n.includes(' ' + B.norm(c.nombre) + ' ') || n.includes(' ' + B.norm(B.corto(c)) + ' ')); };

  // ---- lo de debajo del buscador: lo que se busca, las tres preguntas (buscador tocado y vacío) o la lista del filtro ----
  function zona() {
    const q = B.norm(st.q);
    if (q) {
      const base = verTodos(), pregunta = esPregunta(st.q);
      const hay = (pregunta ? nombrados(base, st.q) : base.filter(c => B.norm(c.nombre).includes(q))).map(fila);
      const preg = {cara: 'veta', nombre: 'Preguntárselo a Veta', pasa: `«${st.q.trim()}»`, ir: B.rutaPregunta(st.q), datos: {limpia: '1'}};
      return (pregunta || hay.length ? '' : r7.vacio('Nadie se llama así.')) + r7.lista(pregunta ? [preg].concat(hay) : hay.concat([preg]));
    }
    if (st.foco) return r7.lista(Object.entries(B.preguntas()).map(([k, x]) => ({nombre: x.pregunta, ir: 'pregunta/' + k})), {rotulo: 'Pregunta a Veta'});
    const f = FILTROS.find(x => x.id === st.vista) || FILTROS[0], l = f.l();
    return cartera(f, l);
  }
  // el carrusel de «Te necesitan» se cablea cada vez que se repinta la zona
  const vivo = el => { const c = el.querySelector('#rb-car'); if (c) VETA.v.carruselVivo(c, {}); };
  const buscando = () => !!st.q.trim() || st.foco;
  const refresca = el => { const z = el.querySelector('.rb-zona'), f = el.querySelector('.rb-filtros'); if (z) z.innerHTML = zona(); if (f) f.hidden = buscando(); vivo(el); };
  // tocar «Preguntárselo a Veta» deja el buscador limpio para la vuelta
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.pant-A5 [data-limpia]')) st.q = ''; }, true);

  VETA.pantalla('A5', {
    titulo: 'Clientes',
    sub: 'Busca a quien sea y mira quién te necesita.',
    pinta: () => {
      // quien llega por la ruta vieja de «los que no te necesitan» ve a todos
      if (VETA.est.lee('r8.filtroClientes', null)) { st.vista = 'todos'; st.q = ''; VETA.est.quita('r8.filtroClientes'); }
      st.foco = false;
      // el marcador es una pregunta de verdad (la primera de las preparadas de quien mira): así se ve qué se puede preguntar
      return UI.campo({buscar: true, id: 'b-buscar', placeholder: (Object.values(B.preguntas())[0] || {}).pregunta || 'Busca un nombre', valor: st.q}) +
        `<div class="rb-filtros"${buscando() ? ' hidden' : ''}>${r7.filtros(FILTROS.map(f => ({id: f.id, texto: f.texto, cuenta: f.l().length})), {valor: st.vista, accion: 'vista', etiqueta: 'Qué clientes ver'})}</div>` +
        `<div class="rb-zona">${zona()}</div>`;
    },
    alMontar: el => {
      const inp = el.querySelector('#b-buscar'), z = el.querySelector('.rb-zona'); vivo(el); if (!inp) return;
      inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', 'Buscar un nombre o preguntar algo');
      inp.addEventListener('input', () => { st.q = inp.value; refresca(el); });
      inp.addEventListener('focus', () => { st.foco = true; refresca(el); });
      // al soltar el buscador vuelve la lista; con un respiro, para que el toque en una pregunta llegue antes
      inp.addEventListener('blur', () => setTimeout(() => { if (document.activeElement === inp || !el.isConnected) return; st.foco = false; refresca(el); }, 150));
      // tocar un resultado no le quita el foco al buscador antes de tiempo (la fila desaparecería bajo el dedo)
      if (z) z.addEventListener('mousedown', e => { if (st.foco && e.target.closest('.r7-fila')) e.preventDefault(); });
      inp.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || !inp.value.trim()) return;
        e.preventDefault();
        const n = B.norm(inp.value), uno = mios().filter(c => B.norm(c.nombre).includes(n));
        const ruta = uno.length === 1 && !esPregunta(inp.value) ? 'cliente/' + uno[0].id : B.rutaPregunta(inp.value);
        if (ruta.startsWith('pregunta/')) st.q = '';
        inp.blur(); VETA.ir(ruta);
      });
    },
    acciones: {
      vista(ev, el) { st.vista = el.dataset.valor; refresca(el.closest('.pant')); }
    }
  });
})();
