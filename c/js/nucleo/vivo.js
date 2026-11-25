/* Veta demo · núcleo · vivo.js · ronda 6 · «Piezas vivas» (VETA.vivo)
   Las piezas que hacen ver que Veta lee, aprende y trabaja sola. Todas devuelven HTML (como VETA.UI) y se despiertan solas
   al entrar en pantalla: un MutationObserver encuentra lo que lleve data-vivo, le pone su estado de salida (.v-antes) y un
   IntersectionObserver lo suelta cuando se ve. Con «Reducir movimiento» no se toca nada: el HTML ya es el estado final.
   Estilos en css/vivo.css. Guía de uso con ejemplos: PIEZAS_VIVAS.md. */
(function () {
  'use strict';
  const esc = VETA.esc, ic = VETA.ic, $ = VETA.$, $$ = VETA.$$, UI = VETA.UI;
  const V = VETA.vivo = {};
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

  // ---- 3 · los cinco pasos de «¿Quién lo hace?» (los lee js/pantallas/regla.js y regla-oficina.js). La escalera dibujada se fue en la ronda 8 ----
  const NIVELES = () => (VETA.datos.c && VETA.datos.c.niveles) || [
    {n: 1, nombre: 'Solo te aviso', texto: 'Te digo que toca. Lo haces tú.'}, {n: 2, nombre: 'Te lo dejo escrito', texto: 'Te dejo el mensaje listo. Tú lo envías.'},
    {n: 3, nombre: 'Lo apunto yo', texto: 'Apunto, marco y guardo yo. No envío nada.'}, {n: 4, nombre: 'Lo hago yo y te lo cuento', texto: 'Lo dejo hecho y te lo cuento.'},
    {n: 5, nombre: 'Lo envío yo', texto: 'Todavía no. Nada sale sin ti.', cerrado: true}];
  V.niveles = NIVELES;

  // ---- 7 · escena «Veta lee» ----
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
    const t = Object.assign({av: c.cliente, nombre: c.titulo, quienEs: c.quienEs, origen: c.cita && c.cita.origen, hecho: 'Te he dejado la respuesta preparada. Tú decides si sale.'}, o.tarjeta || {});
    const n = ms.length;
    return `<div class="v-escena" data-vivo="escena" data-n="${n}"${o.clave ? ` data-clave="${esc(o.clave)}"` : ''}>` +
      `<div class="v-es-cab">${V.pulso({texto: o.fin || `${n} chats leídos · 1 cosa preparada`, ahora: o.leyendo || 'Leyendo tus chats…', ms: 0})}` +
      `<button type="button" class="btn btn-texto v-es-salta" data-propio data-fin="Ver otra vez">Ver otra vez</button></div>` +
      `<div class="v-es-marco"><div class="v-es-chat" aria-hidden="true">${ms.map(m => `<div class="v-es-b${m.clave ? ' v-es-clave' : ''}"><b>${esc(m.quien)}</b><p>${m.clave && frase && m.texto.indexOf(frase) >= 0 ? esc(m.texto.slice(0, m.texto.indexOf(frase))) + `<span class="v-oro">${esc(frase)}</span>` + esc(m.texto.slice(m.texto.indexOf(frase) + frase.length)) : esc(m.texto)}</p></div>`).join('')}</div>` +
      `<div class="v-es-fin tarjeta"><div class="v-es-quien">${t.av ? VETA.av(t.av, 40) : ''}<span><b>${esc(t.nombre)}</b><span>${esc(t.quienEs || '')}</span></span></div>` +
      `<p class="v-es-cita"><span class="v-es-frase">«<span class="v-oro">${esc(frase)}</span>»</span></p>` +
      `<div class="v-es-prueba">${t.origen ? V.pastilla(t.origen, 'chat') : ''}<p class="v-es-hecho">${ic('check', 18)}<span>${esc(t.hecho)}</span></p>` +
      `${o.ir || o.accion || o.hoja ? UI.boton({tipo: 'secundario', texto: o.boton || 'Verla en Hoy', ir: o.ir, accion: o.accion, hoja: o.hoja, de: o.de}) : ''}</div></div></div></div>`;
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
    if (b) b.textContent = 'Saltar';
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
  // VETA.vivo.pulso({ahora: 'Leyendo 3 chats nuevos…', texto: 'Al día · leído hasta las 9:38'}) late 2,4 s y descansa en «texto»
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

  // ---- despertar ----
  function enciende(el) {
    const t = el.dataset.vivo;
    if (t === 'escena') { juega(el); return; }
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
      else if (t !== 'pulso') el.classList.add('v-antes');
      if (io) io.observe(el); else requestAnimationFrame(() => enciende(el));
    });
  };
  if ('MutationObserver' in window) {
    let pendiente = false;
    new MutationObserver(() => { if (pendiente) return; pendiente = true; Promise.resolve().then(() => { pendiente = false; V.despierta(); }); })
      .observe(document.body, {childList: true, subtree: true});
  }
  window.addEventListener('hashchange', () => V.halo(false));

  // ---- lo que comparten los paquetes de la ronda 6 (se borra con ?nuevo, como todo VETA.est) ----
  // r6_siempre: lo que Laura acaba de enseñar con «Sí, siempre» · r6_regla_visitas: 'propuesta' → 'prueba' → 'sola'
  const PASOS = ['propuesta', 'prueba', 'sola'];
  VETA.r6 = {
    PASOS,
    siempre: () => VETA.est.lee('r6_siempre', null),
    ensena: v => { VETA.est.pon('r6_siempre', Object.assign({cuando: VETA.ahora()}, v)); },
    olvida: () => VETA.est.quita('r6_siempre'),
    reglaVisitas: () => { const v = VETA.est.lee('r6_regla_visitas', 'propuesta'); return PASOS.includes(v) ? v : 'propuesta'; },
    subeReglaVisitas: () => { const i = PASOS.indexOf(VETA.r6.reglaVisitas()), v = PASOS[Math.min(i + 1, PASOS.length - 1)]; VETA.est.pon('r6_regla_visitas', v); return v; },
    ponReglaVisitas: v => { if (PASOS.includes(v)) VETA.est.pon('r6_regla_visitas', v); },
    // «Hoy te tocan N»: LA cuenta, una sola para el título de Hoy, el «1 de N» de la tarjeta, el número de la pestaña,
    // «Lo que dirección ve de ti» y la ficha de la persona. Son las tarjetas del día y lo que Veta cerró y Laura ha vuelto
    // a abrir con «Deshacer» (clave a.r6.abiertas). La visita de mañana no cuenta (no es ninguna de las tarjetas): visita siempre 0.
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
