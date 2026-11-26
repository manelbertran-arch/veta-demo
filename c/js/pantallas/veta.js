/* Veta demo · pantallas · veta.js · carril C (Veta y cuenta)
   - A8 · Veta · #/veta   (la raíz de la agente: lo que propone, lo que ya hace y «Cómo voy»; absorbe «Ya lo hago yo», A9)
   Y lo que comparten las pantallas del carril C (VETA.c): cuentas de chats, nombres y pasos de cada trabajo,
   lo que cerró sola, lo aprendido y «Lo que dirección ve de ti». Se carga antes que el resto de pantallas de C. */
(function () {
  'use strict';
  const M = VETA.modelo;
  const lee = (k, d) => VETA.est.lee('c.' + k, d), pon = (k, v) => VETA.est.pon('c.' + k, v);

  // ---- piezas comunes del carril C ----
  const C = VETA.c = {lee, pon};
  const D = () => VETA.datos.c;
  const R7 = () => VETA.r7;
  // chats: los personales que vuelven a entrar (A15b, A18 paso 1) y los clientes que se dejan fuera (modelo)
  C.dentro = () => lee('dentro', []);
  C.leidos = () => M.chatsLeidos() + C.dentro().length;
  C.fuera = () => M.chatsFuera() - C.dentro().length;
  C.lecturaTexto = () => `Leo ${VETA.num(C.leidos())} chats · ${C.fuera()} no ${C.fuera() === 1 ? 'lo' : 'los'} leo`;
  // un trabajo: su frase entera (D.reglas), su nombre largo (el del dato) y sus dos nombres cortos (js/datos/r7-c.js):
  // `corto` para las filas (28 letras como mucho) y `titulo` para la cabecera (24)
  C.info = id => D().reglas[id] || {nombre: 'Un trabajo', frase: ''};
  C.nombre = id => id === 'r-visitas' ? R6().visitas.nombre : ((M.regla(id) || {}).texto || C.info(id).nombre);
  C.corto = id => ((VETA.datos.r7c || {}).corto || {})[id] || C.nombre(id);
  C.titulo = id => ((VETA.datos.r7c || {}).titulo || {})[id] || C.corto(id);
  C.fechaPrueba = 'hasta el 7 dic';
  // ronda 6 · datos de este carril y la cosa que se sube de verdad (confirmar las visitas la víspera)
  const R6 = () => VETA.datos.r6.veta;
  C.r6 = R6;
  C.visitas = () => {
    const v = R6().visitas, est = VETA.r6.reglaVisitas();
    return {estado: est, n: v.paso[est], frase: v.frase[est], manana: v.manana[est]};
  };
  // en qué paso de «¿Quién lo hace?» está cada cosa (1 Solo te aviso … 5 Lo envío yo, cerrado)
  // lo que todavía es una propuesta lo haces tú: paso 1
  C.paso = id => id === 'r-visitas' ? C.visitas().n : (C.lee('nivel', {})[id] || (['propuesta', 'nueva'].includes((M.regla(id) || {}).estado) ? 1 : (R6().pasos[id] || {}).paso || 2));
  // la pila contiene Cuenta: el primer día va en repaso
  C.repaso = () => VETA.pila().some(x => x.ruta === 'cuenta');
  // la semana de quien mira (Laura: 31 mensajes; Montse: los suyos)
  C.semanaDe = () => VETA.yo().id === 'montse' ? {preparados: 9, enviados: 8, retocados: 2, actas: 1, promesas: 2} : {preparados: 31, enviados: 27, retocados: 6, actas: 3, promesas: 4};

  // lo que me has enseñado con el micro (VETA.r7e): si tiene trabajo (regla), sale en «Ya lo hago yo»; si no, en «Lo he aprendido de ti»
  C.ensenados = () => { try { return VETA.r7e ? VETA.r7e.aprendidos() : []; } catch (e) { return []; } };
  C.aprendidoQueda = () => D().aprendido.filter(a => !lee('olvidados', []).includes(a.id)).length;
  C.aprendidoN = () => C.aprendidoQueda() + (VETA.r6.siempre() ? 1 : 0) + C.ensenados().filter(x => !x.regla).length;
  // cuántas veces lo has hecho tú (lo que aún es propuesta)
  C.veces = r => (r && r.casos && r.casos.comoYo ? r.casos.comoYo.length + (r.casos.distinto || []).length : 14);
  const vecesTexto = n => (n === 1 ? '1 vez' : n + ' veces');
  // lo que te propongo: las reglas que aún son propuesta, con cuántas veces lo has hecho tú
  C.propuestas = () => {
    const l = [];
    if (VETA.r6.reglaVisitas() === 'propuesta') l.push({id: 'r-visitas', veces: R6().visitas.hechas});
    M.reglas().filter(r => r.estado === 'propuesta' || r.estado === 'nueva').forEach(r => l.push({id: r.id, veces: C.veces(r)}));
    return l;
  };
  // lo que ya hago: lo que está a prueba, primero
  C.hago = () => {
    const v = C.visitas(), l = [];
    if (v.estado !== 'propuesta') l.push({id: 'r-visitas', prueba: v.estado === 'prueba' ? 'Probando · desde hoy' : ''});
    M.reglas().filter(r => r.estado === 'activa' || r.estado === 'a-prueba').sort((a, b) => (a.estado === 'activa') - (b.estado === 'activa'))
      .forEach(r => l.push({id: r.id, prueba: r.estado === 'a-prueba' ? `Probando · día ${r.dia || 1} de ${r.pruebaDias || 14}` : ''}));
    return l;
  };
  // lo que me dijiste que no (la hoja c-nohago)
  C.noHago = () => M.reglas().filter(r => r.estado === 'descartada');
  // lo que cerré sola desde ayer (sale del Inicio; misma clave de estado que hoy.js: a.r6.abiertas)
  C.cerradas = () => { const ab = VETA.est.lee('a.r6.abiertas', []) || []; return ((VETA.datos.r6.dia || {}).cerradas || []).filter(x => !ab.includes(x.id)); };

  // «Lo que dirección ve de ti» (Cuenta › hoja c-lee): la misma ficha que Montse ve de Laura, dato a dato, y lo que no ve.
  // Una sola fuente: lo que dirección ve en la ficha de la persona (VETA.dir.personaOps), con las mismas frases
  C.direccionVe = () => {
    // 25-nov-2026: dirección ya no ve cifras por persona (ni lo que tardas en contestar ni cuántas cosas te dejó listas Veta): lo que ve es esto, sin números
    const x = VETA.dir.personaOps(VETA.yo().id);
    return [
      {texto: 'Montse ve de ti lo mismo que ves tú aquí.'},
      {titulo: 'Tus operaciones', texto: x.ops.length ? 'Cada una, con cómo va y si alguien espera respuesta.' : 'Ahora no llevas ninguna operación.'},
      {titulo: 'Lo que Veta hace por ti', texto: 'Los trabajos que ya hace por ti, sin cifras.'},
      {titulo: 'Lo que he aprendido de ti', texto: 'Lo que le has enseñado a Veta, uno a uno.'},
      {titulo: 'Lo que no ve', texto: 'No ve lo que escribes en tus chats ni tus notas. Tampoco los chats que dejas fuera. Y no hay cifras por persona.'}
    ];
  };

  // ---- A8 · Veta: el tablero. «Enséñale a Veta» de protagonista, lo que hace por ti (cifras con su título), «Te lo propongo» en carrusel con la
  // evidencia dibujada, «Ya lo hago yo» en baldosas con su medidor de cinco pasos y «Cómo voy» en piezas. Cada trabajo abre su pantalla (regla/:id).
  // Sin botón fijo (D2). Nada sube de peldaño aquí: subir se decide dentro de cada trabajo, con sus casos delante ----
  const V = () => VETA.v, esc = VETA.esc;
  const ICONO = {'r-visitas': 'cal', 'r-cancelaciones': 'cal', 'r-actas': 'doc', 'r-promesas': 'prom', 'r-informes': 'doc', 'r-valoraciones': 'doc', 'r-contestado': 'chat', 'r-firmas': 'campana', 'r-recordatorios': 'campana'};
  const et = t => `<h2 class="pv-et">${esc(t)}</h2>`;
  const pasoNombre = n => { const x = (D().niveles || []).find(k => k.n === n); return x ? x.nombre : ''; };
  // lo que Veta ha hecho hoy: las mismas tres cifras que la fila «Veta ha hecho hoy» del Inicio; solo salen las que tienen dato
  const cifrasHoy = () => {
    const A = VETA.A, q = VETA.yo().id, l = [];
    if (!A) return l;
    const nc = A.cerradas(q).length, nv = A.esperaPend(q).length, nl = ((M.lectura() || {}).hoy || {}).chats || 0;
    if (nc) l.push({n: nc, texto: nc === 1 ? 'Cerrada por Veta' : 'Cerradas por Veta'});
    if (nv) l.push({n: nv, texto: nv === 1 ? 'Espera vigilada' : 'Esperas vigiladas'});
    if (nl) l.push({n: nl, texto: nl === 1 ? 'Chat leído' : 'Chats leídos'});
    return l;
  };
  const cifrasHtml = l => l.length ? `<div class="v-cifras pv-cifras" style="grid-template-columns:repeat(${l.length},1fr)" role="group" aria-label="Lo que Veta ha hecho hoy">${l.map(d => `<div><b>${esc(d.n)}</b>${esc(d.texto)}</div>`).join('')}</div>` : '';
  const celda = (o, oro) => `<button type="button" class="v-celda${oro ? ' v-celda-oro' : ''}" ${VETA.UI.attrs({ir: o.ir})}><span class="v-celda-ic">${VETA.ic(o.icono, 26)}</span><span class="pv-celda-pie">${o.n != null ? `<span class="pv-celda-n">${esc(o.n)}</span>` : ''}<span class="pv-celda-t"><span class="pv-celda-nom">${esc(o.nombre)}</span>${o.sub ? `<span class="pv-celda-sub">${esc(o.sub)}</span>` : ''}</span><span class="pv-celda-ch">${VETA.ic('chev', 20)}</span></span></button>`;
  const baldosaDe = x => {
    const r = x.id === 'r-visitas' ? null : M.regla(x.id), n = C.paso(x.id), v = V();
    const o = {icono: ICONO[x.id] || 'tarea', nombre: C.corto(x.id), paso: n, pasoNombre: pasoNombre(n), ir: 'regla/' + x.id};
    if (r && r.estado === 'a-prueba') o.progreso = {texto: x.prueba, valor: (r.dia || 1) / (r.pruebaDias || 14)};
    else if (x.prueba) o.pie = x.prueba;
    else if (r && r.desde) o.pie = 'Desde ' + r.desde;
    return v.baldosa(o);
  };
  VETA.pantalla('A8', {
    titulo: 'Veta',
    sub: 'Lo que Veta te propone, lo que ya hace por ti y cómo aprende.',
    pinta: () => {
      const v = V(), pr = C.propuestas(), hago = C.hago(), fuera = C.noHago(), apr = C.aprendidoN(), cf = cifrasHoy();
      const props = pr.map(x => v.propuesta({titulo: C.corto(x.id), n: x.veces, vez: `Lo has hecho <b>${vecesTexto(x.veces)}</b>`, boton: 'Ver este trabajo', ir: 'regla/' + x.id}));
      const w = C.semanaDe();
      return '<div class="pv-veta">' +
        v.ensena({titulo: 'Enséñale a Veta', texto: 'Cuéntame algo que haces siempre. Aprendo a hacerlo yo.', boton: 'Toca y dímelo', ir: 'dictar/orden'}) +
        `<section class="pv-sec pv-pres">${v.presencia({titulo: 'Lo que <em>Veta</em> hace por ti', texto: 'Te propone, lo hace ella cuando tú dices y te cuenta cómo va.'})}${cifrasHtml(cf)}</section>` +
        (pr.length ? `<section class="pv-sec">${et('Te lo propongo')}${v.carrusel({id: 'pv-prop', tarjetas: props, etiqueta: 'Te lo propongo', clase: 'v-car-prop'})}</section>` : '') +
        (hago.length ? `<section class="pv-sec">${et('Ya lo hago yo')}${v.subSeccion('Las barras dicen quién lo hace. La última, todavía no: nada sale sin ti.')}<div class="v-baldosas">${hago.map(baldosaDe).join('')}</div></section>` : '') +
        (fuera.length ? `<button type="button" class="pv-nohago" ${VETA.UI.attrs({hoja: 'c-nohago'})}><span>Lo que ya no hago</span><span class="pv-nohago-n">${fuera.length}</span>${VETA.ic('chev', 20)}</button>` : '') +
        `<section class="pv-sec">${et('Cómo voy')}<div class="v-mos">` +
        celda({icono: 'aprende', nombre: 'Lo he aprendido de ti', n: apr || null, ir: 'aprendido'}, true) +
        celda({icono: 'grafica', nombre: 'Tu semana', n: w.preparados + w.actas + w.promesas, sub: 'cosas listas', ir: 'semana'}) +
        celda({icono: 'cambiar', nombre: 'Antes y ahora', ir: 'antes-ahora'}) +
        celda({icono: 'reloj', nombre: 'La semana pasada', ir: 'reglas/semana-pasada'}) +
        '</div></section></div>';
    },
    alMontar: el => { const c = el.querySelector('#pv-prop'); if (c) VETA.v.carruselVivo(c); }
  });

  // ---- A8b · Lo que Veta hace por ti · #/veta/mia: lo mismo que A8 para dirección, que también es agente (Montse lleva clientes). Su pestaña
  // «Veta» es la de la oficina; sus trabajos propios (los que acepta desde el atajo del Inicio) viven aquí, siempre en el mismo sitio:
  // lo que propongo, lo que ya hago y lo que dijo que no. Sin «Cómo voy»: eso es de la agente. ----
  VETA.pantalla('A8b', {
    titulo: 'Lo que Veta hace por ti',
    sub: 'Lo que hago con tus chats de clientes.',
    pinta: () => {
      // dirección: los trabajos de la OFICINA (los mismos que «Trabajos de la oficina» y que la ficha de Montse), nunca los de una agente
      if (VETA.yo().papel === 'direccion') {
        const t = VETA.d1.trabajos(), prop = t.filter(x => x.estado === 'propuesta'), vivos = t.filter(x => x.estado === 'a-prueba' || x.estado === 'en-marcha');
        if (!prop.length && !vivos.length) return R7().vacio({texto: 'Todavía no hago nada por ti. Cuando vea un trabajo que repites, te lo propongo.', i: 0});
        return (prop.length ? R7().lista(prop.map(x => ({nombre: x.nombre, pasa: 'Te lo propongo', ir: x.ir})), {rotulo: 'Te lo propongo', i: 0}) : '') +
          (vivos.length ? R7().lista(vivos.map(x => ({nombre: x.nombre, pasa: x.pasa, ir: x.ir})), {rotulo: 'Ya lo hago yo', i: 1}) : '');
      }
      const pr = C.propuestas(), hago = C.hago(), fuera = C.noHago();
      const yaNo = fuera.length ? [{nombre: 'Lo que ya no hago', dato: fuera.length, hoja: 'c-nohago'}] : [];
      if (!pr.length && !hago.length && !yaNo.length) return R7().vacio({texto: 'Todavía no hago nada por ti. Cuando vea un trabajo que repites, te lo propongo.', i: 0});
      return (pr.length ? R7().lista(pr.map(x => ({nombre: C.corto(x.id), pasa: `Lo has hecho ${vecesTexto(x.veces)}`, ir: 'regla/' + x.id})), {rotulo: 'Te lo propongo', i: 0}) : '') +
        (hago.length || yaNo.length ? R7().lista(hago.map(x => ({nombre: C.corto(x.id), pasa: x.prueba || null, ir: 'regla/' + x.id})).concat(yaNo), {rotulo: 'Ya lo hago yo', i: 1}) : '');
    }
  });
})();
