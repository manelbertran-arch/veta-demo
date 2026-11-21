/* Veta demo · pantallas · primer-dia.js · paquete C (Veta, cuenta y entrada)
   - A18 · Primer día · #/primer-dia/0 a /4 (completa, con su propia cabecera: «‹», la barra de pasos y «Saltar»)
   Modo repaso cuando se llega desde Cuenta (no vuelve a conectar: «Ya conectado» y «Siguiente»). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  let reloj = [];
  const para = () => { reloj.forEach(clearTimeout); reloj = []; };
  const paso = p => Math.max(0, Math.min(4, Number(p.paso) || 0));
  const NUDOS = ['Reads your work chats', 'Finds what\'s pending', 'Prepares the message', 'You decide', 'Learns from what you do'];
  const BUSCA = ['Looking for who you owe a reply', 'Looking for your promises', 'Looking for who wanted to sell or buy'];

  const cab = n => `<div class="c-pd-top">` +
    `<button type="button" class="c-pd-atras" data-atras aria-label="Back">${VETA.ic('atras', 22)}</button>` +
    `<div class="c-pd-pasos">${UI.pasos({hecho: n, total: 4, texto: n ? `Step ${n} of 4` : 'Before you start'})}</div>` +
    UI.boton({tipo: 'texto', texto: 'Skip', accion: 'hoy', ancho: false}) + `</div>`;

  function cuerpo(n) {
    const repaso = C.repaso(), dir = VETA.yo().papel === 'direccion';
    if (n === 0) return `<h1 class="c-pd-h" data-i="0">This is what Veta does for ${dir ? 'your office' : 'you'}</h1>` +
      `<ol class="c-hilo">${NUDOS.map((t, k) => `<li class="c-nudo" data-i="${k}" style="--k:${k}"><span class="c-nudo-p" aria-hidden="true"></span><span>${esc(t)}</span></li>`).join('')}</ol>`;
    if (n === 1) {
      const dentro = C.dentro();
      return `<h1 class="c-pd-h" data-i="0">Bring your history</h1>` +
        `<p class="intro" data-i="1">I read your chats with clients to prepare your day. I send nothing unless you touch it.</p>` +
        (repaso ? `<div data-i="1">${UI.nota({texto: 'Already connected: WhatsApp Business.', icono: 'check', caja: true})}</div>` : '') +
        UI.bloque({titulo: 'Chats I leave out', i: 2, html: `<div class="lista">${VETA.modelo.lectura().fuera.map((x, k) =>
          UI.interruptor({texto: x, sub: dentro.includes(x) ? `${x} is in. You can leave it out again.` : `${x} is left out`, on: !dentro.includes(x), accion: 'personal', datos: {n: k}})).join('')}</div>`});
    }
    if (n === 2) {
      const leido = repaso || C.lee('leido', false), cal = C.calendario();
      return `<h1 class="c-pd-h" data-i="0">${leido ? 'I\'ve read your chats' : 'Reading your chats…'}</h1>` +
        `<ul class="c-busca" data-i="1">${BUSCA.map((t, k) => `<li class="c-busca-l${leido ? ' hecho-l' : ''}" data-k="${k}"><span class="c-busca-m" aria-hidden="true">` +
          `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>${esc(t)}</span></li>`).join('')}</ul>` +
        `<div class="c-leido" id="c-leido"${leido ? '' : ' hidden'} data-i="2">${UI.nota({texto: `What I've read: ${VETA.num(C.leidos())} chats · 6 months · 10 audio clips transcribed · ${C.fuera()} chats left out`, icono: 'check', caja: true})}` +
          UI.lista([{titulo: 'Calendar', sub: cal ? cal + ' · connected' : 'not connected', icono: 'cal', hoja: 'h33'}]) + `</div>`;
    }
    if (n === 3) return `<h1 class="c-pd-h" data-i="0">Your work map</h1>` + C.mapaHtml(1);
    const av = C.lee('avisos', false);
    return `<h1 class="c-pd-h" data-i="0">You don't have to learn anything new</h1>` +
      `<ul class="c-tres" data-i="1">${['You stay in your WhatsApp.', 'You don\'t write anything down.', 'While the pilot lasts, you approve every message.'].map(t => `<li>${VETA.ic('check', 20)}<span>${esc(t)}</span></li>`).join('')}</ul>` +
      UI.bloque({titulo: 'Alerts', texto: 'I only alert you about what can\'t wait.', i: 2,
        html: av ? UI.lineaHecho({texto: 'Alerts allowed', hora: av, boton: {texto: 'Undo', accion: 'sin-avisos'}, vt: 'c-pd-av'})
          : `<div data-vt="c-pd-av">${UI.boton({tipo: 'secundario', texto: 'Allow alerts', icono: 'campana', accion: 'avisos'})}</div>`}) +
      (['hecho', 'ordenador'].includes(C.inicio()) ? '' : `<div data-i="3">${UI.boton({tipo: 'texto', texto: 'Add Veta to your home screen', hoja: 'h31', icono: 'compartir'})}</div>`);
  }

  VETA.pantalla('A18', {
    titulo: 'First day', completa: true, sinCabecera: true,
    guia: ['Here you see how getting started with Veta works, without filling anything in.', 'You connect your WhatsApp and choose which chats are left out.', 'That way on the first day you already have your work map.'],
    pinta: p => `<div class="c-pd">${cab(paso(p))}<div class="c-pd-c">${cuerpo(paso(p))}</div></div>`,
    botonFijo: p => {
      const n = paso(p), repaso = C.repaso();
      if (n === 0) return UI.boton({texto: 'Start', ir: 'primer-dia/1'}) + UI.boton({tipo: 'texto', texto: 'Not now', accion: 'hoy'});
      if (n === 1) return repaso ? UI.boton({texto: 'Next', ir: 'primer-dia/2'})
        : UI.boton({texto: 'Connect WhatsApp Business', accion: 'conecta', id: 'c-pd-con'}) + UI.boton({tipo: 'secundario', texto: 'Upload an exported file', accion: 'sube'});
      if (n === 2) { const l = repaso || C.lee('leido', false); return UI.boton({texto: l ? 'See your map' : 'Reading your chats…', ir: 'primer-dia/3', deshabilitado: !l, id: 'c-pd-sig'}); }
      if (n === 3) return UI.boton({texto: 'Start here', ir: 'primer-dia/4'});
      return UI.boton({texto: 'Start with Today', accion: 'hoy'});
    },
    alMontar: (el, p) => {
      para(); VETA.est.pon('tourVisto', true);
      if (paso(p) !== 2 || C.repaso() || C.lee('leido', false)) return;
      const ls = VETA.$$('.c-busca-l', el), rapido = VETA.reducido();
      ls.forEach((l, k) => reloj.push(setTimeout(() => l.classList.add('hecho-l'), rapido ? 0 : 800 + k * 1000)));
      reloj.push(setTimeout(() => {
        C.pon('leido', true);
        const h = el.querySelector('.c-pd-h'); if (h) h.textContent = 'I\'ve read your chats';
        const r = document.getElementById('c-leido'); if (r) { r.hidden = false; VETA.mov.cascada(r.parentNode); }
        const b = document.getElementById('c-pd-sig'); if (b) { b.disabled = false; b.querySelector('span').textContent = 'See your map'; }
      }, rapido ? 0 : 3000));
    },
    acciones: {
      hoy() { para(); VETA.ir('hoy', {pestana: true}); },
      conecta(ev, el) { espera(el, 'Conectando…'); },
      sube(ev, el) { espera(el, 'Uploading the file…'); },
      personal(ev, el) {
        const x = VETA.modelo.lectura().fuera[Number(el.dataset.n)], fuera = el.getAttribute('aria-checked') === 'true';
        const d = C.dentro().filter(y => y !== x); if (!fuera) d.push(x); C.pon('dentro', d);
        const s = el.querySelector('.interr-s'); if (s) s.textContent = fuera ? `${x} is left out` : `${x} is in. You can leave it out again.`;
      },
      avisos() { C.pon('avisos', VETA.ahora()); VETA.repinta({hecho: 'c-pd-av'}); },
      'sin-avisos'() { C.pon('avisos', false); VETA.repinta({hecho: 'c-pd-av'}); }
    }
  });

  function espera(el, texto) {
    VETA.$$('.fijo .btn').forEach(b => { b.disabled = true; });
    const s = el.querySelector('span'); if (s) s.textContent = texto;
    el.classList.add('c-cargando');
    reloj.push(setTimeout(() => { C.pon('leido', false); VETA.ir('primer-dia/2'); }, VETA.reducido() ? 300 : 1200));
  }
})();
