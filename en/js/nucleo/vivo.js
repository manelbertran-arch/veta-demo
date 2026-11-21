/* Veta demo · núcleo · vivo.js · ronda 6 · “Piezas vivas” (VETA.vivo)
   Las piezas que hacen ver que Veta lee, aprende y trabaja sola. Todas devuelven HTML (como VETA.UI) y se despiertan solas
   al entrar en pantalla: un MutationObserver encuentra lo que lleve data-vivo, le pone su estado de salida (.v-antes) y un
   IntersectionObserver lo suelta cuando se ve. Con “Reducir movimiento” no se toca nada: el HTML ya es el estado final.
   Estilos en css/vivo.css. Guía de uso con ejemplos: PIEZAS_VIVAS.md. */
(function () {
  'use strict';
  const esc = VETA.esc, ic = VETA.ic, $ = VETA.$, $$ = VETA.$$, UI = VETA.UI;
  const V = VETA.vivo = {};
  let nId = 0;
  const vistos = new Set();          // claves de lo que ya se dibujó una vez: la segunda vez sale quieto

  // ---- 1 · oro ----
  // VETA.vivo.oro('si baja de 300.000', {clave: 'pere-precio'}) · con clave, el trazo se dibuja solo la primera vez
  V.oro = (texto, o) => { o = o || {}; return `<span class="v-oro" data-vivo="oro"${o.clave ? ` data-clave="${esc(o.clave)}"` : ''}>${o.html || esc(texto)}</span>`; };
  // VETA.vivo.marca(mensaje, frase): el mensaje entero con la frase subrayada (si no está dentro, el mensaje tal cual)
  V.marca = (texto, frase, o) => {
    const t = String(texto || ''), i = frase ? t.indexOf(frase) : -1;
    return i < 0 ? esc(t) : esc(t.slice(0, i)) + V.oro(frase, o) + esc(t.slice(i + frase.length));
  };
  V.pastilla = (texto, icono) => `<span class="v-pastilla">${icono ? ic(icono, 16) : ''}${esc(texto)}</span>`;

  // ---- 2 · anillo ----
  // VETA.vivo.anillo({van: 11, de: 14, tam: 's'|'m'|'l', texto: '11 de 14 casos'}) · VETA.vivo.anillo({veces: 9})
  V.anillo = o => {
    const veces = o.veces != null, N = Math.max(1, veces ? o.veces : o.de), van = Math.min(veces ? o.veces : o.van, N), tam = o.tam || 'm';
    // a tamaño “s” caben como mucho 8 tramos que se lean: si hay más, cada tramo agrupa varias veces (14 veces → 7 tramos)
    const g = tam === 's' ? Math.ceil(N / 8) : 1, S = Math.ceil(N / g);
    const seg = N <= 24, L = S * 10, k = Math.round(van / N * L * 100) / 100, hueco = seg && S > 1 ? Math.round((tam === 's' ? 30 : 16) * S) / 100 : 0, id = 'v-m' + (++nId);
    const c = `cx="18" cy="18" r="15.9155" pathLength="${L}"`;
    const svg = `<svg viewBox="0 0 36 36" aria-hidden="true">` +
      (seg ? `<mask id="${id}"><circle ${c} fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="${10 - hueco} ${hueco}" stroke-dashoffset="${-hueco / 2}"/></mask>` : '') +
      `<g${seg ? ` mask="url(#${id})"` : ''}><circle class="v-an-p" ${c}/><circle class="v-an-o" ${c} stroke-dasharray="${k} ${L + 10}" style="--v-l:${k}"/></g></svg>`;
    const dentro = tam === 's' ? '' : `<span class="v-an-i"><b class="v-an-n">${van}</b>${tam === 'l' ? `<span class="v-an-de">${veces ? 'times' : 'of ' + N}</span>` : ''}</span>`;
    const voz = o.voz || (veces ? van + ' times' : van + ' of ' + N);
    return `<span class="v-anillo v-an-${tam}" data-vivo="anillo"><span class="v-an-c" role="img" aria-label="${esc(voz)}">${svg}${dentro}</span>${o.texto ? `<span class="v-an-t">${esc(o.texto)}</span>` : ''}</span>`;
  };

  // ---- 3 · escalera ----
  // mini: VETA.vivo.escalera({nivel: 2, desde: 'el 12 nov', mini: true})
  // completa (de arriba abajo, de “Lo haces tú” a “Lo hago yo”; `nota`: una frase bajo el paso de ahora, sin botón):
  // VETA.vivo.escalera({nivel: 2, desde: 'el 12 nov', nota: 'Hecho. …', sube: {hechas: 14, corregidas: 1, pregunta: '¿Apunto yo la tarea sin preguntarte?', boton: 'Sí, hazlo tú', accion: 'subir', de: 'r-x'}})
  const NIVELES = () => (VETA.datos.c && VETA.datos.c.niveles) || [
    {n: 1, nombre: 'I only tell you', texto: 'I tell you it is time. You do it.'}, {n: 2, nombre: 'I write it for you', texto: 'I get the message ready. You send it.'},
    {n: 3, nombre: 'I note it down', texto: 'I note it, tick it and save it. I send nothing.'}, {n: 4, nombre: 'I do it and tell you', texto: 'I get it done and tell you.'},
    {n: 5, nombre: 'I send it', texto: 'Not yet. Nothing is sent without you.', cerrado: true}];
  V.niveles = NIVELES;
  V.escalera = o => {
    const niv = NIVELES(), n = Math.max(1, Math.min(o.nivel || 1, niv.length)), aqui = niv[n - 1], desde = o.desde ? ' · since ' + esc(o.desde) : '';
    if (o.mini) {
      return `<span class="v-mini"><span class="v-mini-b" role="img" aria-label="Step ${n} of ${niv.length}">` +
        niv.map(x => `<i style="--n:${x.n}" class="${x.cerrado ? 'cerrado' : x.n === n ? 'aqui' : x.n < n ? 'on' : ''}"></i>`).join('') + `</span><span>${esc(aqui.enLista || aqui.nombre)}${desde}</span></span>`;
    }
    return '<div class="v-esc-c"><p class="v-esc-ext">You do it</p><ol class="v-esc">' + niv.map(x => {
      const est = x.cerrado ? 'cerrado' : x.n === n ? 'aqui-p' : x.n < n ? 'hecho' : 'falta';
      let h = `<li class="v-esc-p v-esc-${est}"><span class="v-esc-nom">${x.cerrado ? ic('candado', 18) : ''}${esc(x.nombre)}</span>`;
      if (x.n === n) h += `<span class="v-esc-aqui" data-vt="v-aqui" data-muda>It is here now${desde}</span>`;
      h += `<span class="v-esc-tx">${esc(x.texto)}</span>`;
      if (x.n === n && o.nota) h += `<p class="v-esc-nota">${esc(o.nota)}</p>`;
      const s = o.sube;
      if (s && x.n === n + 1 && !x.cerrado) {
        const cuenta = s.hechas != null ? `I have done it ${s.hechas} ${s.hechas === 1 ? 'time' : 'times'} and you corrected me ${s.corregidas || 0}. ` : '';
        h += `<div class="v-esc-sube"><p>${esc(cuenta + (s.pregunta || ''))}</p>${UI.boton({tipo: 'principal', texto: s.boton || 'Yes, go ahead', accion: s.accion, de: s.de, hoja: s.hoja, datos: s.datos})}</div>`;
      }
      return h + '</li>';
    }).join('') + '</ol><p class="v-esc-ext">I do it</p></div>';
  };

  // ---- 4 · hilo ----
  // VETA.vivo.hilo([{paso: 'Dijo', texto: '“Si baja de 300.000…”', cuando: 'Pere · 6 nov'}, …], {scroll: true})
  V.hilo = (nodos, o) => `<ol class="v-hilo" data-vivo="hilo"${o && o.scroll ? ' data-scroll' : ''}>` + (nodos || []).map((n, k) =>
    `<li class="v-hilo-n" style="--k:${k}"><span class="v-hilo-k">${esc(n.paso)}</span><p class="v-hilo-t">${n.html || esc(n.texto)}</p>${n.cuando ? `<span class="v-hilo-c">${esc(n.cuando)}</span>` : ''}</li>`).join('') + '</ol>';

  // ---- 5 · cuenta ----
  // `Hoy te tocan ${VETA.vivo.cuenta({de: 9, a: 6})}` · rueda de 9 a 6 al entrar en pantalla (formato: VETA.horas…)
  const formatos = {};
  V.cuenta = o => {
    const f = o.formato || VETA.num; let fk = '';
    if (o.formato) { fk = 'f' + (++nId); formatos[fk] = o.formato; }
    return `<span class="v-cuenta" data-vivo="cuenta" data-de="${Number(o.de) || 0}" data-a="${Number(o.a) || 0}"${fk ? ` data-f="${fk}"` : ''}${o.clave ? ` data-clave="${esc(o.clave)}"` : ''}>${esc(f(o.a))}</span>`;
  };

  // ---- 6 · antes y ahora ----
  // VETA.vivo.antesAhora({antes: {rotulo: 'El primer día', valor: 46, unidad: 'cosas tuyas por semana', filas: ['…']}, ahora: {rotulo: 'Hoy', valor: 21, …}, semanas: [46, 41, 37, 30, 25, 21]})
  V.antesAhora = o => {
    const s = o.semanas || [], max = Math.max.apply(null, s), min = Math.min.apply(null, s), n = s.length;
    const pts = s.map((v, i) => [n > 1 ? i / (n - 1) * 100 : 50, max === min ? 50 : 8 + (max - v) / (max - min) * 84]);
    const col = (c, hoy) => `<div class="v-aa-col${hoy ? ' v-aa-hoy' : ''}"><span class="v-aa-r">${esc(c.rotulo)}</span>` +
      `<b class="v-aa-n">${hoy && o.antes && o.antes.valor != null ? V.cuenta({de: o.antes.valor, a: c.valor}) : esc(VETA.num(c.valor))}</b>` +
      `<span class="v-aa-u">${esc(c.unidad || '')}</span>${c.filas && c.filas.length ? `<ul class="v-aa-l">${c.filas.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}</div>`;
    return `<div class="v-aa" data-vivo="aa"><div class="v-aa-cols">${col(o.antes, false)}${col(o.ahora, true)}</div>` +
      (n > 1 ? `<div class="v-aa-g" role="img" aria-label="${esc(o.voz || 'From ' + s[0] + ' a ' + s[n - 1] + ' since we started')}"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline pathLength="1" points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}"/></svg>` +
        pts.map(p => `<i style="left:${p[0].toFixed(1)}%;top:${p[1].toFixed(1)}%"></i>`).join('') + `</div>` +
        `<div class="v-aa-ejes"><span>${esc(o.ejeAntes || 'When we started · ' + s[0])}</span><span>${esc(o.ejeAhora || 'Last week · ' + s[n - 1])}</span></div>` : '') + '</div>';
  };

  // ---- 7 · escena “Veta lee” ----
  // VETA.vivo.escena() (Marta, con datos del modelo) · VETA.vivo.escena({cosa: 'c-pere', ir: 'hoy', boton: 'Verla en Hoy', clave: 'que-hace'})
  // o a mano: {mensajes: [{quien, texto, clave: true}], frase, tarjeta: {av, nombre, quienEs, origen, hecho}}
  V.escena = o => {
    o = o || {};
    const M = VETA.modelo, c = M.cosa(o.cosa || 'c-marta') || {};
    const frase = o.frase || (c.cita && c.cita.texto) || '';
    let ms = o.mensajes;
    if (!ms) {
      const ch = c.chat && M.chat(c.chat), suyo = ch && (ch.mensajes.find(m => !m.tu && m.texto.indexOf(frase) >= 0) || ch.mensajes[0]);
      const otros = Object.keys(VETA.datos.chats).filter(id => id !== c.chat && VETA.datos.clientes[id] && !(VETA.duenoDe && VETA.ajeno(VETA.duenoDe({chat: id}))))
        .map(id => ({quien: VETA.datos.clientes[id].corto || VETA.datos.clientes[id].nombre, m: (VETA.datos.chats[id].mensajes || []).find(m => !m.tu)})).filter(x => x.m).slice(0, 2);
      ms = [otros[0] && {quien: otros[0].quien, texto: otros[0].m.texto}, suyo && {quien: c.corto || c.titulo, texto: suyo.texto, clave: true}, otros[1] && {quien: otros[1].quien, texto: otros[1].m.texto}].filter(Boolean);
    }
    const t = Object.assign({av: c.cliente, nombre: c.titulo, quienEs: c.quienEs, origen: c.cita && c.cita.origen, hecho: 'I have left the answer ready for you. You decide if it goes out.'}, o.tarjeta || {});
    const n = ms.length;
    return `<div class="v-escena" data-vivo="escena" data-n="${n}"${o.clave ? ` data-clave="${esc(o.clave)}"` : ''}>` +
      `<div class="v-es-cab">${V.pulso({texto: o.fin || `${n} chats read · 1 thing ready`, ahora: o.leyendo || 'Reading your chats…', ms: 0})}` +
      `<button type="button" class="btn btn-texto v-es-salta" data-propio data-fin="Ver otra vez">Watch again</button></div>` +
      `<div class="v-es-marco"><div class="v-es-chat" aria-hidden="true">${ms.map(m => `<div class="v-es-b${m.clave ? ' v-es-clave' : ''}"><b>${esc(m.quien)}</b><p>${m.clave && frase && m.texto.indexOf(frase) >= 0 ? esc(m.texto.slice(0, m.texto.indexOf(frase))) + `<span class="v-oro">${esc(frase)}</span>` + esc(m.texto.slice(m.texto.indexOf(frase) + frase.length)) : esc(m.texto)}</p></div>`).join('')}</div>` +
      `<div class="v-es-fin tarjeta"><div class="v-es-quien">${t.av ? VETA.av(t.av, 40) : ''}<span><b>${esc(t.nombre)}</b><span>${esc(t.quienEs || '')}</span></span></div>` +
      `<p class="v-es-cita"><span class="v-es-frase">“<span class="v-oro">${esc(frase)}</span>”</span></p>` +
      `<div class="v-es-prueba">${t.origen ? V.pastilla(t.origen, 'chat') : ''}<p class="v-es-hecho">${ic('check', 18)}<span>${esc(t.hecho)}</span></p>` +
      `${o.ir || o.accion || o.hoja ? UI.boton({tipo: 'secundario', texto: o.boton || 'See it in Today', ir: o.ir, accion: o.accion, hoja: o.hoja, de: o.de}) : ''}</div></div></div></div>`;
  };
  const FASES = [[80, 'f1'], [950, 'f2'], [1800, 'f3'], [3000, 'lee'], [4500, 'carta'], [6000, 'prueba'], [6900, 'fin']];
  const pulsoDe = el => $('.v-pulso', el);
  function acaba(el) {
    (el._t || []).forEach(clearTimeout); el._t = [];
    const marco = $('.v-es-marco', el), fin = $('.v-es-fin', el);
    if (el.classList.contains('v-jugando') && marco && fin && !VETA.reducido()) {
      marco.style.minHeight = fin.offsetHeight + 'px'; setTimeout(() => { marco.style.minHeight = ''; }, 320);
    } else if (marco) marco.style.minHeight = '';
    el.classList.remove('v-jugando', 'f1', 'f2', 'f3', 'lee', 'carta', 'prueba');
    const p = pulsoDe(el), b = $('.v-es-salta', el);
    if (p) { p.classList.remove('vivo'); $('.v-pulso-t', p).textContent = p.dataset.luego; }
    if (b) b.textContent = b.dataset.fin;
    if (el.dataset.clave) vistos.add(el.dataset.clave);
  }
  function prepara(el) {            // estado de salida de la escena: nada a la vista, alto reservado
    el.classList.remove('f1', 'f2', 'f3', 'lee', 'carta', 'prueba'); el.classList.add('v-jugando');
    const marco = $('.v-es-marco', el), chat = $('.v-es-chat', el), fin = $('.v-es-fin', el);
    marco.style.minHeight = Math.max(chat.offsetHeight, fin.offsetHeight) + 'px';
    const p = pulsoDe(el), b = $('.v-es-salta', el);
    if (p) { p.classList.add('vivo'); $('.v-pulso-t', p).textContent = p.dataset.ahora; }
    if (b) b.textContent = 'Skip';
  }
  function juega(el) {
    (el._t || []).forEach(clearTimeout);
    if (VETA.reducido()) { acaba(el); return; }
    if (!el.classList.contains('v-jugando')) prepara(el);
    el._t = FASES.map(([ms, fase]) => setTimeout(() => {
      if (!el.isConnected) { (el._t || []).forEach(clearTimeout); return; }
      if (fase === 'fin') { acaba(el); return; }
      if (fase === 'carta') {      // la frase viaja de la burbuja a la tarjeta
        const a = $('.v-es-clave .v-oro', el), b = $('.v-es-frase', el), ra = a && a.getClientRects()[0], rb = b && $('.v-oro', b).getClientRects()[0];
        if (ra && rb) { b.style.transition = 'none'; b.style.translate = (ra.left - rb.left) + 'px ' + (ra.top - rb.top) + 'px'; void b.offsetWidth; b.style.transition = ''; b.style.translate = ''; }
      }
      el.classList.add(fase);
    }, ms));
  }
  V.juega = juega; V.acaba = acaba;
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.v-es-salta'); if (!b) return;
    const el = b.closest('.v-escena'); if (!el) return;
    if (el.classList.contains('v-jugando')) acaba(el); else juega(el);
  });

  // ---- 8 · pulso y halo ----
  // VETA.vivo.pulso({ahora: 'Leyendo 3 chats nuevos…', texto: 'Al día · leído hasta las 9:38'}) late 2,4 s y descansa en “texto”
  // VETA.vivo.pulso({texto: 'Te escucho', siempre: true}) late mientras esté en pantalla
  V.pulso = o => `<span class="v-pulso${o.siempre ? ' vivo' : ''}"${o.ahora ? ' data-vivo="pulso"' : ''} data-ahora="${esc(o.ahora || '')}" data-luego="${esc(o.texto)}" data-ms="${o.ms != null ? o.ms : 2400}"><i class="v-pulso-p" aria-hidden="true"></i><span class="v-pulso-t">${esc(o.texto)}</span></span>`;
  function late(el) {
    const ms = Number(el.dataset.ms), t = $('.v-pulso-t', el); if (!ms || !t) return;     // ms 0: lo lleva otro (la escena)
    el.classList.add('vivo'); t.textContent = el.dataset.ahora;
    setTimeout(() => { el.classList.add('cambia'); setTimeout(() => { t.textContent = el.dataset.luego; el.classList.remove('vivo', 'cambia'); }, 150); }, ms);
  }
  // VETA.vivo.halo(true) mientras Veta escucha; VETA.vivo.halo(false) al acabar (se apaga solo al cambiar de pantalla)
  V.halo = on => {
    let h = document.getElementById('v-halo');
    if (!h) { if (!on) return; h = document.createElement('div'); h.id = 'v-halo'; h.className = 'v-halo'; h.setAttribute('aria-hidden', 'true'); document.body.appendChild(h); void h.offsetWidth; }
    h.classList.toggle('on', !!on);
  };

  // ---- 9 · paso ----
  // VETA.vivo.paso(() => { …cambia el modelo…; VETA.repinta(); }) · lo que lleve data-vt="id" viaja a su sitio nuevo
  // (con data-muda no parpadea: para la fila que se muda de bloque). Sin View Transitions, cambia y ya.
  V.paso = fn => VETA.mov.transiciona(() => { fn(); return null; }, 'cambia');

  // ---- despertar ----
  function enciende(el) {
    const t = el.dataset.vivo;
    if (t === 'escena') { juega(el); return; }
    if (t === 'cuenta') VETA.rueda(el, Number(el.dataset.a), el.dataset.f ? {formato: formatos[el.dataset.f]} : null);
    if (t === 'pulso') late(el);
    el.classList.remove('v-antes');
    if (el.dataset.clave) vistos.add(el.dataset.clave);
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); enciende(e.target); }
  }), {threshold: .3}) : null;
  V.despierta = raiz => {
    const red = VETA.reducido();
    $$('[data-vivo]', raiz || document).forEach(el => {
      if (el._vivo) return; el._vivo = true;
      if (red || (el.dataset.clave && vistos.has(el.dataset.clave))) return;      // estado final, sin movimiento
      const t = el.dataset.vivo;
      if (t === 'escena') prepara(el);
      else if (t === 'cuenta') { const f = el.dataset.f ? formatos[el.dataset.f] : VETA.num, a = f(Number(el.dataset.de)); el.dataset.rueda = a; el.textContent = a; }
      else if (t !== 'pulso') el.classList.add('v-antes');
      if (io) io.observe(el); else requestAnimationFrame(() => enciende(el));
    });
  };
  V.olvida = clave => { if (clave) vistos.delete(clave); else vistos.clear(); };
  if ('MutationObserver' in window) {
    let pendiente = false;
    new MutationObserver(() => { if (pendiente) return; pendiente = true; Promise.resolve().then(() => { pendiente = false; V.despierta(); }); })
      .observe(document.body, {childList: true, subtree: true});
  }
  window.addEventListener('hashchange', () => V.halo(false));

  // ---- lo que comparten los paquetes de la ronda 6 (se borra con ?nuevo, como todo VETA.est) ----
  // r6_siempre: lo que Laura acaba de enseñar con “Sí, siempre” · r6_regla_visitas: 'propuesta' → 'prueba' → 'sola'
  const PASOS = ['propuesta', 'prueba', 'sola'];
  VETA.r6 = {
    PASOS,
    siempre: () => VETA.est.lee('r6_siempre', null),
    ensena: v => { VETA.est.pon('r6_siempre', Object.assign({cuando: VETA.ahora()}, v)); },
    olvida: () => VETA.est.quita('r6_siempre'),
    reglaVisitas: () => { const v = VETA.est.lee('r6_regla_visitas', 'propuesta'); return PASOS.includes(v) ? v : 'propuesta'; },
    subeReglaVisitas: () => { const i = PASOS.indexOf(VETA.r6.reglaVisitas()), v = PASOS[Math.min(i + 1, PASOS.length - 1)]; VETA.est.pon('r6_regla_visitas', v); return v; },
    ponReglaVisitas: v => { if (PASOS.includes(v)) VETA.est.pon('r6_regla_visitas', v); },
    // “Hoy te tocan N”: LA cuenta, una sola para el título de Hoy, el “1 de N” de la tarjeta, el número de la pestaña,
    // “Lo que dirección ve de ti” y la ficha de la persona. Son las tarjetas del día y lo que Veta cerró y Laura ha vuelto
    // a abrir con “Deshacer” (clave a.r6.abiertas). La visita de mañana no cuenta (no es ninguna de las tarjetas): visita siempre 0.
    tocan: q => {
      const M = VETA.modelo, re = q === 'laura' ? VETA.est.lee('a.r6.abiertas', []).length : 0;
      return {total: M.cola(q).length + re, quedan: M.pendientes(q).length + re, visita: 0};
    },
    // lo que dirección le pregunta por una operación (hoja d-preguntar) le llega a quien la lleva, en su Hoy
    preguntas: q => {
      const X = VETA.dir; if (!X || !X.lee || !X.op) return [];
      const t = X.lee('preguntasOp', {});
      return Object.keys(t).flatMap(id => { const o = X.op(id); return o && o.lleva === q ? t[id].map(n => ({op: id, nombre: o.nombre, texto: n.texto, hora: n.hora})) : []; });
    }
  };
})();
