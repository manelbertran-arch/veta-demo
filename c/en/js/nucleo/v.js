/* Veta demo · núcleo · v.js · tanda V (carril 0)
   Las ayudas del rediseño: funciones que devuelven HTML (texto) y dos “vivas” que cablean un carrusel y un conmutador ya montados.
   Bajo VETA.v. Clases en css/v-sistema.css (prefijo v-). Se carga después de ui.js. Manual: analisis/PARTE_V0.md.
   Los atributos de interacción (ir, hoja, accion, de, datos, id…) son los de VETA.UI.attrs. Ninguna función pinta efectos: el movimiento lo hacen
   el CSS y carruselVivo, y con VETA.reducido() no hay animación. */
(function () {
  'use strict';
  const esc = VETA.esc, ic = (n, w) => VETA.ic(n, w), at = o => (VETA.UI && VETA.UI.attrs ? VETA.UI.attrs(o) : '');
  const V = VETA.v = {};
  const reducido = () => (VETA.reducido ? VETA.reducido() : false);

  // ---- tipos de trabajo: clave del modelo (c.tipo) → icono, tono y rótulo. Las claves son las de verdad de hoy.js: mensaje, visita, informe, oportunidad, promesa, bloqueada ----
  const TIPOS = {
    mensaje: {icono: 'chat', tono: 'contestar', rotulo: 'Reply'},
    visita: {icono: 'pin', tono: 'visita', rotulo: 'Viewing'},
    informe: {icono: 'doc', tono: 'informe', rotulo: 'Report'},
    oportunidad: {icono: 'piso', tono: 'oportunidad', rotulo: 'Matching flat'},
    promesa: {icono: 'prom', tono: 'promesa', rotulo: 'Promise'},
    bloqueada: {icono: 'quita', tono: 'bloqueada', rotulo: 'Remove'}
  };
  TIPOS.contestar = TIPOS.mensaje; TIPOS.piso = TIPOS.oportunidad; TIPOS.quitar = TIPOS.bloqueada;
  // 'hecho' no es un tipo de trabajo: es el estado final de cualquiera (verde, ✓)
  V.tipo = clave => {
    const t = clave === 'hecho' ? {icono: 'ok', tono: 'hecho', rotulo: 'Done'} : (TIPOS[clave] || {icono: 'punto', tono: 'bloqueada', rotulo: ''});
    return {clave: clave, icono: t.icono, tono: t.tono, rotulo: t.rotulo, clase: 'v-tipo-' + t.tono};
  };

  // ---- caras: foto (≤ 64) o iniciales sobre degradado de un tono fijo por persona ----
  const quien = p => {
    if (p && typeof p === 'object') return {id: String(p.id || p.nombre || ''), nombre: p.nombre || '', foto: p.foto || null};
    const q = (VETA.modelo && VETA.modelo.quien && VETA.modelo.quien(p)) || {};
    return {id: String(p || ''), nombre: q.nombre || String(p || ''), foto: q.foto || null};
  };
  const tonoDe = id => { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return 1 + Math.abs(h) % 6; };
  const rutaFoto = f => `assets/perfiles/${esc(f)}.webp`;
  // una url dentro de una variable de CSS (--v-img) se resuelve contra la hoja de estilos (css/), no contra la página: se da absoluta
  const abs = r => { try { return new URL(r, document.baseURI).href; } catch (e) { return r; } };
  // VETA.v.cara(persona, {tam: 56, aro: true}) · persona = id del modelo o {id, nombre, foto}
  V.cara = (p, o) => {
    o = o || {}; const q = quien(p), tam = Math.min(o.tam || 56, 64), ini = VETA.iniciales(q.nombre || q.id), t = tonoDe(q.id);
    const aro = o.aro === false ? '' : ' v-aro', est = `width:${tam}px;height:${tam}px`;
    if (q.foto && !o.sinFoto) return `<img class="v-cara${aro}" src="${rutaFoto(q.foto)}" alt="" width="${tam}" height="${tam}" style="${est}" data-v-ini="${esc(ini)}" data-v-t="${t}" data-v-aro="${aro ? 1 : 0}" loading="eager" decoding="async">`;
    return `<span class="v-ini v-t${t}${aro}" style="${est};font-size:${Math.round(tam * .36)}px" aria-hidden="true">${esc(ini)}</span>`;
  };
  // si la foto no carga quedan las iniciales
  document.addEventListener('error', e => {
    const im = e.target;
    if (!im || im.tagName !== 'IMG' || !im.classList.contains('v-cara') || !im.dataset.vIni) return;
    const s = document.createElement('span');
    s.className = 'v-ini v-t' + im.dataset.vT + (im.dataset.vAro === '1' ? ' v-aro' : ''); s.setAttribute('style', im.getAttribute('style') + ';font-size:' + Math.round(im.width * .36) + 'px');
    s.setAttribute('aria-hidden', 'true'); s.textContent = im.dataset.vIni; im.replaceWith(s);
  }, true);

  // VETA.v.ambiente(persona, {tam}) → el fondo desenfocado (o el degradado de su tono) + su cara. El contenedor lo pone quien llama: class="v-amb" (y su contenido encima, con z-index normal)
  V.ambiente = (p, o) => {
    o = o || {}; const q = quien(p);
    const fondo = q.foto && !o.sinFoto
      ? `<span class="v-amb-fondo" aria-hidden="true" style="--v-img:url(${abs(rutaFoto(q.foto))})"></span>`
      : `<span class="v-amb-fondo v-sf v-t${tonoDe(q.id)}" aria-hidden="true"></span>`;
    return fondo + V.cara(p, {tam: o.tam || 64});
  };

  // ---- carrusel ----
  // VETA.v.carrusel({id, tarjetas: [html…], indice: 0, etiqueta: 'Tu día', clase: ''}) → HTML. Cada tarjeta se envuelve en .v-car-it. Después de montarlo: VETA.v.carruselVivo(document.getElementById(id), {alCambiar})
  V.carrusel = o => {
    const l = o.tarjetas || [];
    return `<div class="v-car-w"${o.id ? ` id="${esc(o.id)}"` : ''}><div class="v-car${o.clase ? ' ' + o.clase : ''}" role="group" aria-roledescription="carrusel"${o.etiqueta ? ` aria-label="${esc(o.etiqueta)}"` : ''} tabindex="0" data-indice="${o.indice || 0}">` +
      l.map((h, i) => `<div class="v-car-it" data-v-i="${i}">${h}</div>`).join('') + `</div>${o.indicador === false ? '' : indicador(l.length, o.indice || 0)}</div>`;
  };
  const indicador = (n, i) => n < 1 ? '<div class="v-ind" hidden></div>' : `<div class="v-ind" aria-live="polite">${Array.from({length: n}, (_, k) => `<i${k === i ? ' class="on"' : ''}></i>`).join('')}<span class="v-ind-n">${`${i + 1} of ${n}`}</span></div>`;
  V.indicador = indicador;

  // VETA.v.carruselVivo(el, {alCambiar(i, n)}) → {irA(i), quitar(i) → Promise, indice(), total(), actualiza()}
  V.carruselVivo = (el, o) => {
    o = o || {};
    const car = el.classList.contains('v-car') ? el : el.querySelector('.v-car'), caja = car.parentNode;
    const items = () => Array.from(car.children).filter(x => x.classList.contains('v-car-it') && !x.classList.contains('v-cierra'));
    const pad = () => parseFloat(getComputedStyle(car).scrollPaddingLeft) || 0;
    const izq = it => Math.max(0, it.offsetLeft - pad());
    let ult = -1, raf = 0, notifica = true;
    const indice = () => {
      const l = items(); if (!l.length) return 0;
      if (car.scrollLeft >= car.scrollWidth - car.clientWidth - 2) return l.length - 1;
      let mejor = 0, d = Infinity; l.forEach((it, i) => { const x = Math.abs(izq(it) - car.scrollLeft); if (x < d) { d = x; mejor = i; } });
      return mejor;
    };
    const pinta = i => {
      const n = items().length; let ind = caja.querySelector('.v-ind');
      if (!ind) { ind = document.createElement('div'); ind.className = 'v-ind'; caja.appendChild(ind); }
      ind.hidden = n < 1; ind.outerHTML = indicador(n, i);
    };
    const actualiza = () => {
      const i = indice(), n = items().length;
      if (i !== ult) { ult = i; pinta(i); if (notifica && o.alCambiar) o.alCambiar(i, n); }
    };
    const irA = (i, op) => {
      const l = items(); if (!l.length) return; i = Math.max(0, Math.min(i, l.length - 1));
      const x = izq(l[i]), rapido = (op && op.rapido) || reducido();
      try { car.scrollTo({left: x, behavior: rapido ? 'auto' : 'smooth'}); } catch (e) { car.scrollLeft = x; }
      if (rapido) actualiza();
    };
    const quitar = i => {
      const it = items()[i]; if (!it) return Promise.resolve();
      const fin = () => { it.remove(); car.classList.remove('v-car-quitando'); const n = items().length; ult = -1; if (n) irA(Math.min(i, n - 1), {rapido: true}); else pinta(0); };
      if (reducido()) { fin(); return Promise.resolve(); }
      return new Promise(res => {
        car.classList.add('v-car-quitando'); it.classList.add('v-sale');
        setTimeout(() => { it.classList.add('v-cierra'); setTimeout(() => { fin(); res(); }, 580); }, 330);
      });
    };
    car.addEventListener('scroll', () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; actualiza(); }); }, {passive: true});
    const ini = parseInt(car.dataset.indice, 10) || 0;
    notifica = false; if (ini > 0) irA(ini, {rapido: true}); else { ult = 0; pinta(0); } notifica = true;
    return {irA, quitar, indice, total: () => items().length, actualiza};
  };

  // ---- tira del día ----
  // VETA.v.tiraDia({piezas: [{tipo: 'mensaje', hecha: false, id}], actual: 0}) → HTML. “k de N” = las hechas. Debajo, el rótulo del tipo de la pieza actual con su pico (se coloca solo al montarse)
  V.tiraDia = o => {
    const l = o.piezas || [], hechas = l.filter(p => p.hecha).length, a = o.actual == null ? 0 : o.actual;
    const pz = l.map((p, i) => {
      const t = V.tipo(p.hecha ? 'hecho' : p.tipo), r = V.tipo(p.tipo).rotulo;
      return `<button type="button" class="v-pz ${V.tipo(p.tipo).clase}${p.hecha ? ' v-hecha' : ''}${i === a ? ' v-actual' : ''}" data-v-pz="${i}"${p.id != null ? ` data-id="${esc(p.id)}"` : ''} aria-label="${esc(p.hecha ? `${r} · Done` : r)}"${i === a ? ' aria-current="true"' : ''}>${ic(t.icono, 22)}</button>`;
    }).join('');
    const t0 = l[a] ? V.tipo(l[a].tipo) : null;
    return `<div class="v-tira-w"><div class="v-tira" role="group" aria-label="Your day">${pz}<span class="v-tira-cuenta">${`${hechas} of ${l.length}`}</span></div><div class="v-tira-rot" aria-live="polite">${t0 ? `<span class="${t0.clase}">${esc(t0.rotulo)}</span>` : ''}</div></div>`;
  };
  // coloca el rótulo bajo la pieza actual, dentro de los márgenes, con el pico apuntándole
  const coloca = w => {
    const r = w.querySelector('.v-tira-rot'), sp = r && r.firstElementChild, pz = w.querySelector('.v-pz.v-actual'); if (!sp || !pz) return;
    const R = r.getBoundingClientRect(), Z = pz.getBoundingClientRect(); if (!R.width) return;
    const ancho = sp.offsetWidth, cx = Z.left + Z.width / 2 - R.left, izq = Math.max(0, Math.min(R.width - ancho, cx - ancho / 2));
    sp.style.left = izq + 'px'; sp.style.setProperty('--pico', (cx - izq) + 'px'); w.dataset.vPos = '1';
  };
  V.tiraDiaColoca = coloca;
  try {
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      (n.matches && n.matches('.v-tira-w') ? [n] : Array.from(n.querySelectorAll ? n.querySelectorAll('.v-tira-w:not([data-v-pos])') : [])).forEach(w => requestAnimationFrame(() => coloca(w)));
    }))).observe(document.documentElement, {childList: true, subtree: true});
  } catch (e) {}
  // VETA.v.tiraDiaMarca(el, {actual: 2, hechas: [0, 1], tipo: 'visita'}) → cambia la pieza actual, las hechas, el rótulo (el del tipo de la pieza actual) y la cuenta sin repintar
  V.tiraDiaMarca = (el, o) => {
    const w = el.classList.contains('v-tira-w') ? el : el.closest('.v-tira-w') || el, pz = Array.from(w.querySelectorAll('.v-pz'));
    pz.forEach((b, i) => {
      if (o.actual != null) { b.classList.toggle('v-actual', i === o.actual); if (i === o.actual) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); }
      if (o.hechas) {
        const h = o.hechas.includes(i), era = b.classList.contains('v-hecha');
        b.classList.toggle('v-hecha', h);
        if (h !== era) { if (!b.dataset.vIc) b.dataset.vIc = b.innerHTML; b.innerHTML = h ? ic('check', 22) : b.dataset.vIc; }
      }
    });
    if (o.hechas) { const c = w.querySelector('.v-tira-cuenta'); if (c) c.textContent = `${o.hechas.length} of ${pz.length}`; }
    const r = w.querySelector('.v-tira-rot'); let tipo = o.tipo;
    if (!tipo && o.actual != null && pz[o.actual]) { const m = Array.from(pz[o.actual].classList).find(c => /^v-tipo-/.test(c)); if (m) tipo = m.slice(7); }
    if (r && tipo) { const t = V.tipo(tipo); r.innerHTML = `<span class="${t.clase}">${esc(o.rotulo != null ? o.rotulo : t.rotulo)}</span>`; }
    coloca(w);
  };

  // ---- conmutador de dos pastillas ----
  // VETA.v.conmutador({id, opciones: [{id: 'pend', texto: 'Pendiente', n: 6}, {id: 'hecho', texto: 'Hecho', n: 0}], valor: 'pend'}) → HTML
  V.conmutador = o => `<div class="v-conm" role="tablist"${o.id ? ` id="${esc(o.id)}"` : ''}>` + (o.opciones || []).map(x =>
    `<button type="button" role="tab" data-v-op="${esc(x.id)}" aria-selected="${x.id === o.valor}">${esc(x.texto)}${x.n != null ? `<em>${esc(x.n)}</em>` : ''}</button>`).join('') + '</div>';
  // VETA.v.conmutadorVivo(el, {alCambiar(id)}) → cambia la pastilla marcada y avisa
  V.conmutadorVivo = (el, o) => {
    el.addEventListener('click', ev => {
      const b = ev.target.closest('[data-v-op]'); if (!b || !el.contains(b)) return;
      el.querySelectorAll('[data-v-op]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
      if (o && o.alCambiar) o.alCambiar(b.dataset.vOp);
    });
  };

  // ---- días de calendario: VETA.v.tiraDias({dias: [{id, nombre: 'Mar', n: 17, pasa: true, hoy: false}], valor: id}) ----
  V.tiraDias = o => `<div class="v-dias" role="tablist">` + (o.dias || []).map(d =>
    `<button type="button" role="tab" class="v-dia${d.pasa ? ' v-pasa' : ''}${d.hoy ? ' v-hoy' : ''}${d.id === o.valor ? ' v-sel' : ''}" data-v-dia="${esc(d.id)}" aria-selected="${d.id === o.valor}"><span>${esc(d.nombre)}</span><b>${esc(d.n)}</b><u></u></button>`).join('') + '</div>';

  // ---- chapas y sello ----
  // VETA.v.chapa('urg' | 'esp' | 'hecho' | 'veta' | 'neutro', 'Sin contestar', {solida: true, icono: 'aviso'})
  V.chapa = (tono, texto, o) => { o = o || {}; return `<span class="v-chapa v-chapa-${esc(tono || 'neutro')}${o.solida ? ' v-sol' : ''}">${o.icono ? ic(o.icono, 16) : ''}${esc(texto)}</span>`; };
  // VETA.v.sello() → “Acta enviada” · VETA.v.sello('Enviado')
  V.sello = texto => `<span class="v-sello">${ic('check', 16)}${esc(texto || 'Notes sent')}</span>`;
  // VETA.v.marcas(9) → nueve marcas del mismo tamaño: la evidencia dibujada
  V.marcas = n => `<span class="v-marcas" role="img" aria-label="${n === 1 ? '1 time' : `${n} times`}">${'<i></i>'.repeat(Math.max(0, n))}</span>`;

  // ---- franja de Veta: VETA.v.franjaVeta({titulo: 'Veta ha hecho hoy', datos: [{n: 2, texto: 'cerradas'}, …], hoja: 'h…'}) ----
  V.franjaVeta = o => `<button type="button" class="v-franja-veta"${at(o)}><span class="v-franja-cab">${ic('aprende', 24)}<span>${esc(o.titulo || 'Veta did today')}</span></span>` +
    `<span class="v-franja-datos">${(o.datos || []).slice(0, 3).map(d => `<span><b>${esc(d.n)}</b>${esc(d.texto)}</span>`).join('')}</span></button>`;

  // ---- tarjeta de tarea (Hoy): VETA.v.tarea({tipo: 'mensaje', persona: 'marta', nombre: 'Marta Puig', frase: '…', boton: 'Ver mi respuesta', chapa: {tono: 'urg', texto: '…'}, piso: 'gracia', pisoTexto: 'Verdi 42, Gràcia', ir: '…'}) ----
  // el color sale del tipo (degradado de --v-tipo-<clave>-a/-b); la foto de la persona va desenfocada al 17 % debajo y el icono del tipo enorme al 13 %
  V.tarea = o => {
    const t = V.tipo(o.tipo), q = quien(o.persona), img = q.foto ? ` style="--v-img:url(${abs(rutaFoto(q.foto))})"` : '';
    return `<article class="v-tj ${t.clase}"${img}${at({id: o.id, datos: o.datos})}><span class="v-tj-marca" aria-hidden="true">${ic(t.icono)}</span>` +
      `<div class="v-tj-arr"><span class="v-tj-tp"><span class="v-tj-ic">${ic(t.icono, 32)}</span>${esc(o.rotulo || t.rotulo)}</span></div>` +
      `<div class="v-tj-quien">${V.cara(o.persona, {tam: 52})}<div><h2 class="v-tj-nom">${esc(o.nombre)}</h2><p class="v-tj-frase">${esc(o.frase || '')}</p>${o.chapa ? `<div style="margin-top:8px">${V.chapa(o.chapa.tono, o.chapa.texto, {solida: true})}</div>` : ''}</div></div>` +
      (o.piso ? `<div class="v-tj-piso"><img src="assets/pisos/${esc(o.piso)}.webp" alt="" width="60" height="44">${o.pisoTexto ? `<span>${esc(o.pisoTexto)}</span>` : ''}</div>` : '') +
      `<button type="button" class="v-btn v-btn-claro"${at(o)}><span>${esc(o.boton || '')}</span>${ic('flecha', 22)}</button></article>`;
  };

  // ---- hero de visita (Visitas): VETA.v.hero({hora: '9:00', nombre: 'Elena Vives', donde: 'Verdi 42, Gràcia', persona: 'elena', foto: 'gracia', boton: 'Abrir la visita', pasada: false, sello: true, chapa}) ----
  V.hero = o => `<article class="v-hero${o.foto ? '' : ' v-hero-sf'}${o.pasada ? ' v-hero-pas' : ''}"${o.foto ? ` style="--v-img:url(${abs('assets/pisos/' + esc(o.foto) + '.webp')})"` : ''}>${o.foto ? '' : `<span class="v-hero-casa" aria-hidden="true">${ic('casa', 210)}</span>`}` +
    `<div class="v-hero-arr"><span class="v-hora">${esc(o.hora)}</span>${o.chapa ? V.chapa(o.chapa.tono, o.chapa.texto, {solida: true}) : ''}</div><div>` +
    (o.sello ? V.sello(o.sello === true ? null : o.sello) : '') +
    `<div class="v-hero-gente">${V.cara(o.persona, {tam: 60})}<div><h2>${esc(o.nombre)}</h2><p class="v-hero-donde">${esc(o.donde || '')}</p></div></div>` +
    (o.boton ? `<button type="button" class="v-btn v-btn-claro"${at(o)}><span>${esc(o.boton)}</span>${ic('flecha', 22)}</button>` : '') + '</div></article>';

  // ---- sugerencia (“Te lo propongo”): VETA.v.propuesta({titulo, n: 9, vez: 'Lo has hecho <b>9/14 veces</b>' (html), boton: 'Ver este trabajo', accion…}); en un carrusel, con clase 'v-car-prop' ----
  V.propuesta = o => `<article class="v-prop"><span class="v-prop-sim"><img src="assets/veta-symbol-gold.png" alt="" width="24" height="19"></span><h3>${esc(o.titulo)}</h3>${V.marcas(o.n || 0)}<p class="v-prop-vez">${o.vez || ''}</p>` +
    (o.boton ? `<button type="button" class="v-btn v-btn-oro"${at(o)} aria-label="${esc(o.boton + ' · ' + o.titulo)}"><span>${esc(o.boton)}</span></button>` : '') + '</article>';

  // ---- baldosa de trabajo (“Ya lo hago yo”) ----
  // VETA.v.medidor(3) → cinco barras que suben, las tres primeras llenas; la quinta, discontinua (“todavía no”) salvo {quinta: true}
  V.medidor = (n, o) => `<span class="v-medidor" role="img" aria-label="${`Step ${n} of 5`}">${[1, 2, 3, 4, 5].map(k => `<i${k <= n ? ' class="l"' : k === 5 && !(o && o.quinta) ? ' class="c"' : ''}></i>`).join('')}</span>`;
  // VETA.v.baldosa({icono, nombre, paso: 3, pasoNombre: 'Lo apunto yo', pie: 'Desde 3 sep', progreso: {texto: 'Probando · día 5 de 14', valor: 5 / 14}, ir}) → HTML; en un <div class="v-baldosas"> (o VETA.v.baldosas([…]))
  V.baldosa = o => `<button type="button" class="v-baldosa"${at(o)}><span class="v-baldosa-ic">${ic(o.icono || 'tarea', 24)}</span><span class="v-baldosa-nom">${esc(o.nombre)}</span>${V.medidor(o.paso)}<span class="v-paso">${esc(o.pasoNombre || '')}</span>` +
    `<span class="v-baldosa-pie">${o.progreso ? `<span class="v-prog-b" aria-hidden="true">${Array.from({length: 14}, (_, k) => `<i${k < Math.round(Math.max(0, Math.min(1, o.progreso.valor || 0)) * 14) ? ' class="l"' : ''}></i>`).join('')}</span><span class="v-prog">${esc(o.progreso.texto)}</span>` : esc(o.pie || '')}</span></button>`;
  V.baldosas = l => `<div class="v-baldosas">${(l || []).map(V.baldosa).join('')}</div>`;

  // ---- fila compacta con ✓ (lo hecho): VETA.v.filaHecha({texto: 'Enviado a Marta', hora: '9:12', hoja…}) ----
  V.filaHecha = o => `<${o.hoja || o.ir || o.accion ? 'button type="button"' : 'div'} class="v-fila"${at(o)}><span class="v-fila-ok">${ic('check', 20)}</span><span class="v-fila-tx">${esc(o.texto)}</span>${o.hora ? `<span class="v-fila-hr">${esc(o.hora)}</span>` : ''}</${o.hoja || o.ir || o.accion ? 'button' : 'div'}>`;
  V.lista = l => `<div class="v-lista">${(l || []).join('')}</div>`;
  // ---- botón: VETA.v.boton({texto, tipo: 'claro' | 'oscuro' | 'oro' | 'contorno', icono, ir…}) ----
  V.boton = o => `<button type="button" class="v-btn v-btn-${esc(o.tipo || 'oscuro')}"${at(o)}>${o.icono ? ic(o.icono, 22) : ''}<span>${esc(o.texto)}</span></button>`;

  // ---- Clientes: ficha con retrato ----
  // VETA.v.retrato('marta', {nombre: 'Marta Puig', frase: 'Sin responder desde ayer', chapa: {tono: 'urg', texto: 'Sin contestar'}, ir}) → una ficha con la cara arriba a 64 px (la regla del sistema: caras ≤ 64;
  // el original de assets/perfiles/ es de 144 px, que a 3x dan de sobra), el nombre debajo, la frase y, al pie, la chapa. Sin foto, el mismo hueco lleva el monograma sobre el fondo sobrio del
  // sistema. Va en un carrusel 'v-car-rts' o en <div class="v-rej">
  V.tieneFoto = p => !!quien(p).foto;
  V.retrato = (p, o) => {
    o = o || {}; const q = quien(p), nom = o.nombre || q.nombre;
    const chapa = o.chapa ? V.chapa(o.chapa.tono, o.chapa.texto, {solida: true}) : '';
    const pie = `<span class="v-rt-pie"><span class="v-rt-nom">${esc(nom)}</span>${o.frase ? `<span class="v-rt-que">${esc(o.frase)}</span>` : ''}</span>`;
    if (!q.foto) return `<button type="button" class="v-rt v-rt-sf"${at(o)}><span class="v-rt-ret"><span class="v-rt-ini" aria-hidden="true">${esc(VETA.iniciales(nom))}</span></span>${pie}${chapa}</button>`;
    return `<button type="button" class="v-rt"${at(o)}><span class="v-rt-ret"><img class="v-rt-foto" src="${rutaFoto(q.foto)}" alt="" width="64" height="64" loading="eager" decoding="async"></span>${pie}${chapa}</button>`;
  };
  // caras diminutas solapadas (28 px): VETA.v.caras(['marta', 'toni'])
  V.caras = (l, o) => `<span class="v-mcs">${(l || []).map(p => V.cara(p, {tam: (o && o.tam) || 28, aro: false}).replace(/class="v-(cara|ini)/, 'class="v-mc v-$1')).join('')}</span>`;

  // ---- Pisos ----
  // VETA.v.piso({foto: 'gracia', foto2: 'gracia_balcon', zona: 'Gràcia', titulo: 'Verdi 42', datos: '3 hab. · terraza', texto: 'Visita hoy, 9:00', chapa: {tono, texto}, encajan: ['marta', 'toni'], enc: 'Les encaja a Marta y Toni', tam: 'grande' | 'alto' | 'normal', ir}) → HTML
  V.piso = o => {
    const g = o.tam === 'grande', url = `style="--v-img:url(${abs('assets/pisos/' + esc(o.foto) + '.webp')})"`;
    const enc = (o.encajan && o.encajan.length) || o.enc ? `<span class="v-enc">${o.encajan && o.encajan.length ? V.caras(o.encajan) : ''}${o.enc ? `<span>${esc(o.enc)}</span>` : ''}</span>` : '';
    return `<button type="button" class="${g ? 'v-pg' : 'v-pa' + (o.tam === 'alto' ? ' v-pa-alto' : '')}" ${url}${at(o)}>${o.chapa ? V.chapa(o.chapa.tono, o.chapa.texto, {solida: true}) : ''}` +
      (g && o.foto2 ? `<img class="v-pg-2" src="assets/pisos/${esc(o.foto2)}.webp" alt="" width="84" height="62">` : '') +
      `<span class="v-pie"><span class="v-zona" style="display:block">${esc(o.zona || '')}</span>${g ? `<h2>${esc(o.titulo)}</h2>` : `<h3>${esc(o.titulo)}</h3>`}` +
      (o.datos ? (g ? `<p>${esc(o.datos)}</p>` : `<span class="v-pa-det" style="display:block">${esc(o.datos)}</span>`) : '') + (o.texto ? (g ? `<p>${esc(o.texto)}</p>` : `<p>${esc(o.texto)}</p>`) : '') + enc + '</span></button>';
  };
  // VETA.v.mosaicoPisos([grande, alto, normal, normal]) → la grande arriba y, debajo, una alta y dos apiladas (cada elemento son las opciones de V.piso; el tamaño lo pone esta función)
  V.mosaicoPisos = l => { l = l || []; return (l[0] ? V.piso(Object.assign({}, l[0], {tam: 'grande'})) : '') + (l.length > 1 ? `<div class="v-mos2">${l.slice(1, 4).map((x, i) => V.piso(Object.assign({}, x, {tam: i === 0 ? 'alto' : 'normal'}))).join('')}</div>` : ''); };

  // ---- Operaciones: la línea de cinco pasos ----
  // VETA.v.pasos(3, ['Contacto', 'Visitas', 'Oferta', 'Arras', 'Notaría']) → los cinco nodos: los anteriores a `actual` hechos (llenos), `actual` en ámbar con aro, el resto vacíos. actual 0 = todos pendientes; 6 = todos hechos
  V.pasos = (actual, nombres) => `<ol class="v-cinco" aria-label="${`Step ${actual} of 5`}">${[1, 2, 3, 4, 5].map(k => `<li class="${k < actual ? 'v-hecho' : k === actual ? 'v-aqui' : ''}"${k === actual ? ' aria-current="step"' : ''}><i></i><span>${esc((nombres || [])[k - 1] || '')}</span></li>`).join('')}</ol>`;
  // VETA.v.operacion({persona, nombre, tipo: 'compra' | 'venta', etiqueta: 'La compra', actual: 2, nombres: [5], siguiente: 'Pasarle el informe', cerrada: false, ir}) → tarjeta con cara de 32, etiqueta, la línea y “lo siguiente”; en <div class="v-ops">
  V.operacion = o => `<button type="button" class="v-op${o.tipo === 'venta' ? ' v-op-venta' : ''}${o.cerrada ? ' v-op-cerrada' : ''}"${at(o)}><span class="v-op-top">${V.cara(o.persona, {tam: 32, aro: false})}<span class="v-op-nom">${esc(o.nombre)}</span><span class="v-op-tag">${esc(o.etiqueta || '')}</span></span>` +
    (o.cerrada ? '' : V.pasos(o.actual, o.nombres)) + (o.siguiente ? `<span class="v-op-sig" style="display:block">${esc(o.siguiente)}</span>` : '') + '</button>';

  // ---- Veta: hero “Enséñale a Veta”, presencia, cifras, subtítulo de sección y enlace ----
  // VETA.v.ensena({titulo: 'Enséñale a Veta', texto: '…', boton: 'Toca y dímelo', accion…}) → tarjeta dorada con el micro de 76 px y el botón oscuro; todo el botón dicta
  V.ensena = o => `<section class="v-ensena"><div class="v-ensena-fl"><div><h2>${esc(o.titulo)}</h2><p>${esc(o.texto || '')}</p></div><span class="v-ensena-mic" aria-hidden="true">${ic('mic', 38)}</span></div>` +
    `<button type="button" class="v-btn"${at(o)}>${ic('mic', 22)}<span>${esc(o.boton || '')}</span></button></section>`;
  // VETA.v.presencia({titulo: 'Lo que <em>Veta</em> hace por ti' (html), texto}) · VETA.v.cifras([{n: 2, texto: 'cerradas'}, …3])
  V.presencia = o => `<div class="v-pres"><span class="v-pres-sim"><img src="assets/veta-symbol-gold.png" alt="" width="56" height="44"></span><div><h1>${o.titulo}</h1><p>${esc(o.texto || '')}</p></div></div>`;
  V.cifras = l => `<div class="v-cifras">${(l || []).slice(0, 3).map(d => `<div><b>${esc(d.n)}</b>${esc(d.texto)}</div>`).join('')}</div>`;
  V.subSeccion = t => `<p class="v-sec-sub">${esc(t)}</p>`;
  V.enlaceOro = o => `<button type="button" class="v-quienlo"${at(o)}><span>${esc(o.texto)}</span>${ic('chev', 20)}</button>`;

  // ---- Clientes: buscador grande y filtros en una fila que se desplaza ----
  // VETA.v.buscador({texto: '¿Qué le prometí a Jordi?', accion…}) · VETA.v.pastillas({opciones: [{id, texto, n, punto: 'var(--urg-s)'}], valor})
  V.buscador = o => `<button type="button" class="v-busca"${at(o)}><span class="v-busca-lupa">${ic('pregunta', 26)}</span><span>${esc(o.texto)}</span></button>`;
  V.pastillas = o => `<div class="v-pastillas" role="group"${o.id ? ` id="${esc(o.id)}"` : ''}>${(o.opciones || []).map(x => `<button type="button" data-v-op="${esc(x.id)}" aria-pressed="${x.id === o.valor}">${x.punto ? `<u style="--c:${esc(x.punto)}"></u>` : ''}${esc(x.texto)}${x.n != null ? `<em>${esc(x.n)}</em>` : ''}</button>`).join('')}</div>`;
})();
