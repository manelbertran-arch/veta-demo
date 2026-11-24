/* Veta demo · núcleo · ui.js
   Los componentes de la sección 5.3 como funciones que devuelven HTML (texto). Ninguna pinta efectos:
   el movimiento lo pone el núcleo al montar. Clases en css/componentes.css.
   Atributos comunes que aceptan casi todos: ir, hoja, accion, de, g (guía “Título|Frase”), datos ({clave: valor} → data-clave),
   vt (nombre para el efecto “hecho en el sitio”), i (escalón de cascada). */
(function () {
  'use strict';
  const ic = (n, w) => VETA.ic(n, w);
  const esc = VETA.esc;

  // atributos data-* de interacción a partir de un objeto de opciones
  function attrs(o) {
    if (!o) return '';
    let s = '';
    if (o.ir) s += ` data-ir="${esc(o.ir)}"`;
    if (o.atras) s += ' data-atras';
    if (o.hoja) s += ` data-hoja="${esc(o.hoja)}"`;
    if (o.accion) s += ` data-accion="${esc(o.accion)}"`;
    if (o.de != null) s += ` data-de="${esc(o.de)}"`;
    if (o.g) s += ` data-g="${esc(o.g)}"`;
    if (o.vt) s += ` data-vt="${esc(o.vt)}"`;
    if (o.i != null) s += ` data-i="${esc(o.i)}"`;
    if (o.foco) s += ` data-foco="${esc(o.foco)}"`;
    if (o.id) s += ` id="${esc(o.id)}"`;
    if (o.datos) Object.keys(o.datos).forEach(k => { s += ` data-${k}="${esc(o.datos[k])}"`; });
    return s;
  }
  const interactivo = o => !!(o && (o.ir || o.hoja || o.accion || o.atras));

  // ---- etiquetas: color solo en lo que se sale de lo normal ----
  const ETQ = {
    'te-toca': ['neutro', 'punto', 'Your turn'], 'esperando': ['neutro', 'reloj', 'Waiting for a reply'], 'al-dia': ['neutro', 'check', 'Up to date'],
    'cerrado': ['neutro', 'caja', 'Closed'], 'activa': ['neutro', 'check', 'Active'], 'decidido': ['neutro', 'check', 'Decided'],
    'sin-responder': ['rojo', 'aviso', 'No reply since yesterday'], 'vencida': ['rojo', 'reloj', 'Overdue'], 'no-se-puede': ['rojo', 'candado', 'Can\'t be sent'],
    'prometiste': ['ambar', 'mano', 'You promised it'], 'parado': ['ambar', 'pausa', 'Stalled'], 'para-manana': ['ambar', 'luna', 'For tomorrow'], 'falta': ['ambar', 'papel', 'Missing'],
    'oportunidad': ['verde', 'rayo', 'Opportunity'], 'recibido': ['verde', 'check', 'Received'], 'en-marcha': ['verde', 'check', 'In use'],
    'a-prueba': ['azul', 'probeta', 'I\'m trying it'], 'ejemplo': ['azul', 'info', 'Example'], 'tuya': ['azul', 'usuario', 'Yours'],
    'propuesta': ['oro', 'estrella', 'My suggestion'], 'por-decidir': ['oro', 'estrella', 'You need to decide']
  };

  // ---- avatar: foto o iniciales; si la foto falla, quedan las iniciales ----
  VETA.av = (id, tam, o) => {
    tam = tam || 40; o = o || {};
    const q = (VETA.modelo && VETA.modelo.quien(id)) || {nombre: o.nombre || id};
    const ini = VETA.iniciales(q.nombre || o.nombre || id);
    const foto = o.sinFoto ? null : q.foto;
    return `<span class="av av-${tam}${foto ? ' con-foto' : ''}${o.aro ? ' av-aro' : ''}"${o.foco ? ` data-foco="${esc(o.foco)}"` : ''}>` +
      (foto ? `<img src="assets/perfiles/${esc(foto)}.webp" alt="" width="${tam}" height="${tam}" decoding="async">` : '') +
      `<b aria-hidden="true">${esc(ini)}</b></span>`;
  };

  // si una foto no carga, se quita y quedan las iniciales o el bloque con la casa (el error no sube: se escucha en captura)
  document.addEventListener('error', e => {
    const im = e.target, caja = im && im.tagName === 'IMG' && im.parentNode;
    if (caja && caja.classList && caja.classList.contains('con-foto')) { caja.classList.remove('con-foto'); im.remove(); }
  }, true);

  const UI = VETA.UI = {};
  UI.attrs = attrs;

  UI.etiqueta = (tipo, texto) => {
    const e = ETQ[tipo] || ['neutro', null, tipo];
    return `<span class="etq etq-${e[0]}">${e[1] ? ic(e[1], 16) : ''}<span>${esc(texto || e[2])}</span></span>`;
  };
  UI.ETIQUETAS = ETQ;

  // ---- botones ----
  // tipo: 'principal' (56, uno por pantalla) · 'secundario' (48, borde) · 'texto' (48 de zona, dorado) · 'redondo' (48×48, icono) · 'claro' (principal crema, sobre negro)
  UI.boton = o => {
    const t = o.tipo || 'principal';
    const cls = 'btn btn-' + t + (o.ancho === false ? ' btn-suelto' : '') + (o.clase ? ' ' + o.clase : '');
    const etiqueta = t === 'redondo' ? ` aria-label="${esc(o.texto)}"` : '';
    const contenido = t === 'redondo' ? ic(o.icono || 'mas', 22) : `${o.icono ? ic(o.icono, 20) : ''}<span>${o.html || esc(o.texto)}</span>`;
    return `<button type="button" class="${cls}"${attrs(o)}${etiqueta}${o.deshabilitado ? ' disabled' : ''}>${contenido}</button>`;
  };
  // fila de hasta dos botones secundarios
  UI.botones = lista => `<div class="btns">${(lista || []).filter(Boolean).map(b => UI.boton(Object.assign({tipo: 'secundario'}, b))).join('')}</div>`;

  // ---- tarjeta, bloque, lista, fila ----
  UI.tarjeta = (html, o) => { o = o || {}; return `<div class="tarjeta${o.clase ? ' ' + o.clase : ''}"${attrs({vt: o.vt, i: o.i, id: o.id})}>${html}</div>`; };
  UI.bloque = o => `<section class="bloque"${o.i != null ? ` data-i="${o.i}"` : ''}>${o.titulo ? `<h2 class="bloque-t">${esc(o.titulo)}</h2>` : ''}${o.texto ? `<p class="bloque-sub">${esc(o.texto)}</p>` : ''}${o.html || ''}</section>`;

  UI.fila = o => {
    const lead = o.av ? VETA.av(o.av, o.avTam || 40, {foco: o.focoFoto ? 'foto' : null, nombre: o.titulo})
      : o.foto ? UI.foto(o.foto, {tam: 'mini'})
      : o.icono ? `<span class="fila-ic">${ic(o.icono, 22)}</span>` : '';
    const chev = o.chev !== false && interactivo(o);
    const cuerpo = `${lead}<span class="fila-c"><span class="fila-t"${o.focoFoto ? ' data-foco="nombre"' : ''}>${o.tituloHtml || esc(o.titulo)}</span>` +
      (o.sub ? `<span class="fila-s">${o.subHtml || esc(o.sub)}</span>` : (o.subHtml ? `<span class="fila-s">${o.subHtml}</span>` : '')) +
      (o.etiqueta ? `<span class="fila-e">${UI.etiqueta(o.etiqueta, o.etiquetaTexto)}</span>` : '') + '</span>' +
      (o.derecha ? `<span class="fila-d">${esc(o.derecha)}</span>` : '') + (chev ? `<span class="fila-chev">${ic('chev', 16)}</span>` : '');
    const cls = 'fila' + (o.marcada ? ' marcada' : '') + (o.clase ? ' ' + o.clase : '');
    return interactivo(o) ? `<button type="button" class="${cls}"${attrs(o)}>${cuerpo}</button>` : `<div class="${cls} fila-quieta"${attrs({vt: o.vt, i: o.i, datos: o.datos})}>${cuerpo}</div>`;
  };
  UI.lista = (filas, o) => { o = o || {}; return `<div class="lista${o.clase ? ' ' + o.clase : ''}"${o.i != null ? ` data-i="${o.i}"` : ''}>${(filas || []).filter(Boolean).map(f => typeof f === 'string' ? f : UI.fila(f)).join('')}</div>`; };

  // ---- cita, borrador, nota ----
  // con dirección mirando el cliente de otra persona, la cita no enseña el texto del chat (VETA.ajeno)
  UI.cita = o => {
    const dueno = VETA.duenoDe ? VETA.duenoDe({chat: o.chat, de: o.de}) : null;
    if (dueno && VETA.ajeno(dueno)) return `<p class="cita cita-ajena">${ic('candado', 18)}<span>${esc(VETA.chatAjenoTexto(dueno))}</span></p>`;
    return `<button type="button" class="cita" data-hoja="h01"${o.de ? ` data-de="${esc(o.de)}"` : ''}${o.chat ? ` data-chat="${esc(o.chat)}"` : ''}>` +
      `<span class="cita-t">“${esc(o.texto)}”</span><span class="cita-o">${esc(o.origen)} ›</span></button>`;
  };
  UI.borrador = o => `<div class="borrador"${o.id ? ` id="${esc(o.id)}"` : ''}><span class="borrador-r">${esc(o.rotulo || 'I wrote this for you')}</span>` +
    `<p class="borrador-t">${o.html || esc(o.texto)}</p></div>`;
  UI.nota = o => `<p class="nota${o.caja ? ' nota-caja' : ''}${o.clase ? ' ' + o.clase : ''}">${o.icono ? ic(o.icono, 18) : ''}<span>${o.html || esc(o.texto)}</span></p>`;

  // ---- línea de hecho: sustituye a la tarjeta en su sitio ----
  const visto = '<svg class="visto" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  UI.lineaHecho = o => {
    const txt = `${visto}<span class="hecho-txt">${esc(o.texto)}${o.hora ? ` <span class="hecho-h">· ${esc(o.hora)}</span>` : ''}</span>`;
    const izq = (o.hoja || o.ir) ? `<button type="button" class="hecho-a"${attrs({hoja: o.hoja, ir: o.ir, de: o.de})}>${txt}</button>` : `<div class="hecho-a">${txt}</div>`;
    const b = o.boton ? UI.boton(Object.assign({tipo: 'texto', de: o.de}, o.boton)) : '';
    return `<div class="hecho"${attrs({vt: o.vt, i: o.i})}>${izq}${b}</div>`;
  };

  // ---- cifras ----
  UI.cifra = o => `<div class="cifra"${o.i != null ? ` data-i="${o.i}"` : ''}><b class="cifra-n"${o.id ? ` id="${esc(o.id)}"` : ''}>${esc(typeof o.valor === 'number' ? VETA.num(o.valor) : o.valor)}</b>` +
    `<span class="cifra-u">${esc([o.unidad, o.periodo].filter(Boolean).join(' · '))}</span></div>`;
  UI.ochoNumeros = v => {
    const filas = Array.isArray(v) ? v : VETA.modelo.numeros(v || '7d');
    return `<div class="n8">${filas.map((f, k) => `<div class="n8-c"><b class="n8-n" data-n8="${k}">${esc(typeof f.valor === 'number' ? VETA.num(f.valor) : f.valor)}</b><span class="n8-r">${esc(f.nombre)}</span></div>`).join('')}</div>`;
  };

  // ---- barra de pasos (no se toca ni lo parece) ----
  UI.pasos = o => {
    const total = o.total || 5, hecho = Math.max(0, Math.min(total, o.hecho || 0));
    return `<div class="pasos"><span class="pasos-l" aria-hidden="true"><i style="width:${(hecho / total) * 100}%"></i></span>` +
      `<span class="pasos-t">${esc(o.texto || ('step ' + hecho + ' of ' + total))}</span></div>`;
  };

  // ---- campo, interruptor, selector de dos ----
  UI.campo = o => {
    const id = o.id || ('campo-' + Math.random().toString(36).slice(2, 8));
    const ctl = o.area ? `<textarea id="${esc(id)}" class="campo-i" rows="${o.filas || 4}" placeholder="${esc(o.placeholder || '')}">${esc(o.valor || '')}</textarea>`
      : `<input id="${esc(id)}" class="campo-i" type="${o.buscar ? 'search' : (o.tipo || 'text')}" value="${esc(o.valor || '')}" placeholder="${esc(o.placeholder || '')}"${o.buscar ? ' enterkeyhint="search"' : ''}>`;
    return `<div class="campo${o.buscar ? ' campo-buscar' : ''}">${o.etiqueta ? `<label class="campo-e" for="${esc(id)}">${esc(o.etiqueta)}</label>` : ''}` +
      `<div class="campo-caja">${o.buscar ? ic('pregunta', 20) : ''}${ctl}</div></div>`;
  };
  UI.interruptor = o => `<button type="button" class="interr" role="switch" aria-checked="${o.on ? 'true' : 'false'}"${attrs(o)}>` +
    `<span class="interr-c"><span class="interr-t">${esc(o.texto)}</span>${o.sub ? `<span class="interr-s">${esc(o.sub)}</span>` : ''}</span><span class="interr-v" aria-hidden="true"></span></button>`;
  UI.selector = o => {
    const ops = o.opciones || [];
    const k = Math.max(0, ops.findIndex(x => x.id === o.valor));
    return `<div class="selector" role="radiogroup"${o.etiqueta ? ` aria-label="${esc(o.etiqueta)}"` : ''} style="--n:${ops.length};--pos:${k}"${o.id ? ` id="${esc(o.id)}"` : ''}>` +
      ops.map((x, n) => `<button type="button" role="radio" aria-checked="${n === k}" data-valor="${esc(x.id)}" data-pos="${n}"${attrs({accion: o.accion, de: o.de})}>${esc(x.texto)}</button>`).join('') + '</div>';
  };

  // ---- estados de pantalla ----
  UI.vacio = o => `<div class="vacio"${o.i != null ? ` data-i="${o.i}"` : ''}>${o.icono ? `<span class="vacio-ic">${ic(o.icono, 28)}</span>` : ''}<p class="vacio-t">${esc(o.titulo)}</p>` +   // F2 · R2: sin títulos de sección en el cuerpo
    (o.texto ? `<p class="vacio-x">${esc(o.texto)}</p>` : '') + (o.boton ? UI.boton(Object.assign({tipo: 'secundario'}, o.boton)) : '') + '</div>';
  UI.silueta = n => `<div class="silueta" aria-hidden="true">${Array.from({length: n || 3}, (_, k) => `<span class="sil-b${k % 3 === 0 ? ' sil-alta' : ''}"></span>`).join('')}</div><p class="solo-lector">Loading</p>`;
  UI.error = o => `<div class="error-p"><p>${esc((o && o.texto) || 'I couldn\'t load this.')}</p>${UI.boton({tipo: 'secundario', texto: 'Retry', accion: 'reintentar'})}${UI.boton({tipo: 'texto', texto: 'Back', atras: true})}</div>`;
  UI.sinRed = () => `<div class="sinred" role="status">${ic('sinred', 18)}<span>Offline. Whatever you do is saved and goes out when the signal is back.</span></div>`;
  UI.onda = o => `<span class="onda${o && o.pausada ? ' pausada' : ''}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>`;

  // ---- fotos de piso: si falla, bloque --s2 con la casa ----
  UI.foto = (pisoId, o) => {
    o = o || {};
    const piso = (VETA.datos.pisos || {})[pisoId] || {};
    const archivo = (piso.fotos || [])[o.n || 0] || pisoId;
    const cls = 'foto foto-' + (o.tam || 'mini');
    const dentro = `<img src="assets/pisos/${esc(archivo)}.webp" alt="${esc(piso.nombre ? 'Photo of the flat: ' + piso.nombre : 'Photo of the flat')}" decoding="async"><i class="foto-res" aria-hidden="true">${ic('casa', 24)}</i>`;
    if (o.ampliar) return `<button type="button" class="${cls} con-foto" data-hoja="h17" data-piso="${esc(pisoId)}" data-n="${o.n || 0}" data-foco="piso" aria-label="Enlarge the photo">${dentro}</button>`;
    return `<span class="${cls} con-foto"${o.foco ? ` data-foco="${esc(o.foco)}"` : ''}>${dentro}</span>`;
  };

  // ---- burbujas de chat (H01) ----
  UI.burbujas = mensajes => `<div class="burbujas">${(mensajes || []).map(m => `<div class="burbuja ${m.tu ? 'b-tu' : 'b-otro'}"><p>${esc(m.texto)}</p><span>${esc((m.tu ? 'You · ' : '') + (m.cuando || ''))}</span></div>`).join('')}</div>`;

  // ---- la tarjeta de una cosa de la cola (A1, A6, A7, G1): seis tipos y sus estados ----
  // cosa: un objeto de VETA.modelo.cola()/.cosa(). o: {n, total} para “1 de 6”.
  const RESUELTOS = ['enviada', 'hecha', 'quitada', 'para-manana'];
  UI.tarjetaCosa = (c, o) => {
    o = o || {};
    if (!c) return '';
    const vt = 'cola-' + c.id;
    if (RESUELTOS.includes(c.estado)) return UI.lineaCosa(c);
    const quien = c.av || c.cliente;
    const lead = quien ? VETA.av(quien, 40, {foco: 'foto', nombre: c.titulo}) : `<span class="tc-ic">${ic(c.icono || 'estrella', 22)}</span>`;
    const cab = `<div class="tc-cab">${lead}<span class="tc-nombre" data-foco="nombre">${esc(c.titulo)}</span>` +
      (o.n ? `<span class="tc-n">${o.n} of ${o.total}</span>` : '') + '</div>';
    const quienEs = (c.quienEs || c.etiqueta) ? `<div class="tc-quien">${c.quienEs ? `<span>${esc(c.quienEs)}</span>` : ''}${c.etiqueta ? UI.etiqueta(c.etiqueta, c.etiquetaTexto) : ''}</div>` : '';
    if (c.estado === 'pregunta-envio') {
      return UI.tarjeta(cab + quienEs + `<h3 class="tc-preg">Did you send it?</h3>` +
        UI.boton({texto: 'Yes, sent', accion: 'si-enviado', de: c.id}) +
        UI.botones([{texto: 'Not yet', accion: 'todavia-no', de: c.id}]) +
        UI.nota({texto: 'WhatsApp doesn\'t open in this demo: no message goes out.', clase: 'nota-gris'}), {clase: 'tc tc-' + c.tipo, vt});
    }
    const x = c.extra || {};
    let h = cab + quienEs;
    if (c.momento) h += `<p class="tc-momento">${esc(c.momento)}</p>`;
    if (c.piso && !c.encaja) h += `<div class="tc-piso">${UI.foto(c.piso, {tam: 'mini', ampliar: true})}<span>${esc(c.pisoTexto || (VETA.datos.pisos[c.piso] || {}).nombre || '')}</span></div>`;
    if (c.saber) h += `<p class="tc-saber">${esc(c.saber)}</p>`;
    if (c.deSusChats) h += `<button type="button" class="enlace" data-hoja="h01" data-de="${esc(c.id)}">From their chats ›</button>`;
    if (c.depende) h += `<p class="tc-pie">${esc(c.depende)}</p>`;
    if (c.cita) h += UI.cita({texto: c.cita.texto, origen: c.cita.origen, de: c.id});
    if (c.antes) h += `<div class="tc-antes"><b>Before calling</b><ul>${c.antes.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>`;
    if (c.encaja) h += `<div class="tc-encaja"><span class="tc-encaja-t">${esc(c.encaja.titulo)}</span><div class="tc-piso">${UI.foto(c.encaja.piso, {tam: 'mini', ampliar: true})}<span>${esc(c.encaja.texto)}</span></div></div>`;
    if (c.resumen) h += `<p class="tc-resumen">${esc(c.resumen)}</p>`;
    if (c.propone) h += `<p class="tc-resumen">${esc(c.propone)}</p>`;
    if (x.aviso) h += UI.nota({texto: x.aviso, icono: 'info', caja: true, clase: 'nota-cambio'});
    const borr = x.borradorHtml || x.borrador || c.borrador;
    if (borr) h += UI.borrador({html: x.borradorHtml || null, texto: x.borradorHtml ? null : borr});
    if (c.bloqueo) h += UI.nota({texto: c.bloqueo, icono: 'candado', caja: true});
    if (c.nota !== false && (c.nota || c.sale)) h += UI.nota({texto: c.nota || 'It doesn\'t go out until you send it', icono: 'candado'});
    if (c.pie) h += `<p class="tc-pie">${esc(c.pie)}</p>`;
    const b = Object.assign({}, c.boton || {}, x.boton || {});
    if (!b.ir && !b.hoja && !b.accion) b.accion = 'principal';
    if (c.boton || x.boton) h += UI.boton(Object.assign({de: c.id}, b));
    const sec = (x.secundarios || c.secundarios || []).map(s => Object.assign({de: c.id}, s));
    if (sec.length) h += UI.botones(sec);
    return UI.tarjeta(h, {clase: 'tc tc-' + c.tipo + ' abierta', vt});
  };
  // la línea en la que se recoge una cosa resuelta
  UI.lineaCosa = c => {
    const x = c.extra || {};
    const sale = c.estado === 'enviada';
    const def = {enviada: 'Sent to ' + (c.corto || c.titulo), hecha: 'Done · ' + c.titulo, quitada: 'Removed · ' + c.titulo, 'para-manana': 'For tomorrow · ' + (c.corto || c.titulo)};
    return UI.lineaHecho({
      texto: x.linea || (c.lineas && c.lineas[c.estado]) || def[c.estado] || c.titulo,
      hora: c.estado === 'para-manana' ? '' : c.hora,
      hoja: sale ? 'h03' : null, de: c.id, vt: 'cola-' + c.id,
      boton: {texto: sale ? 'I didn\'t send it' : 'Undo', accion: sale ? 'no-lo-envie' : 'deshacer'}
    });
  };
  // la fila de una cosa que espera turno (cola cerrada)
  UI.filaCosa = c => UI.fila({titulo: c.fila || c.titulo, sub: c.filaSub, av: c.av || c.cliente, ir: c.ficha || (c.cliente ? 'cliente/' + c.cliente : null), vt: 'cola-' + c.id, focoFoto: true});
})();
