/* Veta demo · pantallas · primer-dia.js · paquete C (Veta, cuenta y entrada)
   - A18 · Primer día · #/primer-dia/0 a /4 (completa, con su propia cabecera: «‹», la barra de pasos y «Saltar»)
   Modo repaso cuando se llega desde Cuenta (no vuelve a conectar: «Ya conectado» y «Siguiente»). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  let reloj = [];
  const para = () => { reloj.forEach(clearTimeout); reloj = []; };
  const paso = p => Math.max(0, Math.min(4, Number(p.paso) || 0));
  const NUDOS = ['Lee tus chats de trabajo', 'Encuentra lo que está pendiente', 'Prepara el mensaje', 'Tú decides', 'Aprende de lo que haces'];
  const BUSCA = ['Busco a quién le debes respuesta', 'Busco tus promesas', 'Busco quién quería vender o comprar'];

  const cab = n => `<div class="c-pd-top">` +
    `<button type="button" class="c-pd-atras" data-atras aria-label="Volver">${VETA.ic('atras', 22)}</button>` +
    `<div class="c-pd-pasos">${UI.pasos({hecho: n, total: 4, texto: n ? `Paso ${n} de 4` : 'Antes de empezar'})}</div>` +
    UI.boton({tipo: 'texto', texto: 'Saltar', accion: 'hoy', ancho: false}) + `</div>`;

  function cuerpo(n) {
    const repaso = C.repaso(), dir = VETA.yo().papel === 'direccion';
    if (n === 0) return `<h1 class="c-pd-h" data-i="0">Esto es lo que Veta hace por ${dir ? 'tu oficina' : 'ti'}</h1>` +
      `<ol class="c-hilo">${NUDOS.map((t, k) => `<li class="c-nudo" data-i="${k}" style="--k:${k}"><span class="c-nudo-p" aria-hidden="true"></span><span>${esc(t)}</span></li>`).join('')}</ol>`;
    if (n === 1) {
      const dentro = C.dentro();
      return `<h1 class="c-pd-h" data-i="0">Trae tu historial</h1>` +
        `<p class="intro" data-i="1">Leo tus chats con clientes para prepararte el día. No envío nada sin que lo toques.</p>` +
        (repaso ? `<div data-i="1">${UI.nota({texto: 'Ya conectado: WhatsApp Business.', icono: 'check', caja: true})}</div>` : '') +
        UI.bloque({titulo: 'Chats que dejo fuera', i: 2, html: `<div class="lista">${VETA.modelo.lectura().fuera.map((x, k) =>
          UI.interruptor({texto: x, sub: dentro.includes(x) ? `${x} entra. Puedes volver a dejarlo fuera.` : `${x} queda fuera`, on: !dentro.includes(x), accion: 'personal', datos: {n: k}})).join('')}</div>`});
    }
    if (n === 2) {
      const leido = repaso || C.lee('leido', false), cal = C.calendario();
      return `<h1 class="c-pd-h" data-i="0">${leido ? 'He leído tus chats' : 'Leyendo tus chats…'}</h1>` +
        `<ul class="c-busca" data-i="1">${BUSCA.map((t, k) => `<li class="c-busca-l${leido ? ' hecho-l' : ''}" data-k="${k}"><span class="c-busca-m" aria-hidden="true">` +
          `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>${esc(t)}</span></li>`).join('')}</ul>` +
        `<div class="c-leido" id="c-leido"${leido ? '' : ' hidden'} data-i="2">${UI.nota({texto: `Lo que he leído: ${VETA.num(C.leidos())} chats · 6 meses · 10 audios pasados a texto · ${C.fuera()} chats quedan fuera`, icono: 'check', caja: true})}` +
          UI.lista([{titulo: 'Calendario', sub: cal ? cal + ' · conectado' : 'sin conectar', icono: 'cal', hoja: 'h33'}]) + `</div>`;
    }
    if (n === 3) return `<h1 class="c-pd-h" data-i="0">Tu mapa de trabajo</h1>` + C.mapaHtml(1);
    const av = C.lee('avisos', false);
    return `<h1 class="c-pd-h" data-i="0">No tienes que aprender nada nuevo</h1>` +
      `<ul class="c-tres" data-i="1">${['Sigues en tu WhatsApp.', 'No apuntas nada.', 'Mientras dure el piloto, tú apruebas cada mensaje.'].map(t => `<li>${VETA.ic('check', 20)}<span>${esc(t)}</span></li>`).join('')}</ul>` +
      UI.bloque({titulo: 'Avisos', texto: 'Te aviso solo de lo que no puede esperar.', i: 2,
        html: av ? UI.lineaHecho({texto: 'Avisos permitidos', hora: av, boton: {texto: 'Deshacer', accion: 'sin-avisos'}, vt: 'c-pd-av'})
          : `<div data-vt="c-pd-av">${UI.boton({tipo: 'secundario', texto: 'Permitir avisos', icono: 'campana', accion: 'avisos'})}</div>`}) +
      `<div data-i="3">${UI.boton({tipo: 'texto', texto: 'Añadir a la pantalla de inicio', hoja: 'h31', icono: 'compartir'})}</div>`;
  }

  VETA.pantalla('A18', {
    titulo: 'Primer día', completa: true, sinCabecera: true,
    guia: ['Aquí ves cómo se empieza con Veta, sin rellenar nada.', 'Tú conectas tu WhatsApp y eliges qué chats quedan fuera.', 'Así el primer día ya tienes tu mapa de trabajo.'],
    pinta: p => `<div class="c-pd">${cab(paso(p))}<div class="c-pd-c">${cuerpo(paso(p))}</div></div>`,
    botonFijo: p => {
      const n = paso(p), repaso = C.repaso();
      if (n === 0) return UI.boton({texto: 'Empezar', ir: 'primer-dia/1'}) + UI.boton({tipo: 'texto', texto: 'Ahora no', accion: 'hoy'});
      if (n === 1) return repaso ? UI.boton({texto: 'Siguiente', ir: 'primer-dia/2'})
        : UI.boton({texto: 'Conectar WhatsApp Business', accion: 'conecta', id: 'c-pd-con'}) + UI.boton({tipo: 'secundario', texto: 'Subir un archivo exportado', accion: 'sube'});
      if (n === 2) { const l = repaso || C.lee('leido', false); return UI.boton({texto: l ? 'Ver tu mapa' : 'Leyendo tus chats…', ir: 'primer-dia/3', deshabilitado: !l, id: 'c-pd-sig'}); }
      if (n === 3) return UI.boton({texto: 'Empezar por aquí', ir: 'primer-dia/4'});
      return UI.boton({texto: 'Empezar con Hoy', accion: 'hoy'});
    },
    alMontar: (el, p) => {
      para();
      if (paso(p) !== 2 || C.repaso() || C.lee('leido', false)) return;
      const ls = VETA.$$('.c-busca-l', el), rapido = VETA.reducido();
      ls.forEach((l, k) => reloj.push(setTimeout(() => l.classList.add('hecho-l'), rapido ? 0 : 800 + k * 1000)));
      reloj.push(setTimeout(() => {
        C.pon('leido', true);
        const h = el.querySelector('.c-pd-h'); if (h) h.textContent = 'He leído tus chats';
        const r = document.getElementById('c-leido'); if (r) { r.hidden = false; VETA.mov.cascada(r.parentNode); }
        const b = document.getElementById('c-pd-sig'); if (b) { b.disabled = false; b.querySelector('span').textContent = 'Ver tu mapa'; }
      }, rapido ? 0 : 3000));
    },
    acciones: {
      hoy() { para(); VETA.ir('hoy', {pestana: true}); },
      conecta(ev, el) { espera(el, 'Conectando…'); },
      sube(ev, el) { espera(el, 'Subiendo el archivo…'); },
      personal(ev, el) {
        const x = VETA.modelo.lectura().fuera[Number(el.dataset.n)], fuera = el.getAttribute('aria-checked') === 'true';
        const d = C.dentro().filter(y => y !== x); if (!fuera) d.push(x); C.pon('dentro', d);
        const s = el.querySelector('.interr-s'); if (s) s.textContent = fuera ? `${x} queda fuera` : `${x} entra. Puedes volver a dejarlo fuera.`;
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
