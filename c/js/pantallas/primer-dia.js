/* Veta demo · pantallas · primer-dia.js · paquete C (Veta, cuenta y entrada)
   - A18 · Primer día · #/primer-dia/0 a /4 (completa; cabecera de paso: volver, los puntos de paso y «Saltar» arriba; un solo botón
     abajo, «Empezar» o «Siguiente»; la cita, en una tarjeta con comillas). Ronda 8, carril E.
   Modo repaso cuando se llega desde Cuenta (no vuelve a conectar: «Ya conectado» y «Siguiente»). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c, R = VETA.r7;
  let reloj = [];
  const para = () => { reloj.forEach(clearTimeout); reloj = []; };
  const paso = p => Math.max(0, Math.min(4, Number(p.paso) || 0));
  const NUDOS = ['Leo tus chats de trabajo', 'Encuentro lo que está pendiente', 'Te dejo el mensaje escrito', 'Tú decides', 'Aprendo de lo que decides'];
  // ronda 6 · lo que he encontrado en tus chats, antes de explicar nada (de los datos de Hoy y del mapa)
  const HALLADO = [
    {av: 'marta', nombre: 'Marta Puig', que: 'Te espera desde ayer', frase: '¿Sigue disponible el piso de Gràcia? Podríamos verlo este sábado', cuando: '2026-11-22T18:42'},
    {av: 'elena', nombre: 'Elena Vives', que: 'Te prometió un papel y no ha llegado', frase: 'El miércoles te paso la nómina', cuando: '2026-11-16'},
    {av: 'jordi', nombre: 'Jordi Ferrer', que: 'Le prometiste el informe del piso', frase: 'Perfecto, quedo a la espera del informe del piso', cuando: '2026-11-20'}];
  const hallado = () => HALLADO.map((h, k) => R.tarjeta({de: `${h.nombre} · ${h.que}`, html: `<p>«${esc(h.frase)}»</p><span class="r7-ficha-de c-pd-orig">${esc(h.nombre.split(' ')[0])} · ${esc(VETA.fecha.corta(h.cuando))}</span>`, i: Math.min(4, k + 1)})).join('');
  // cada título dice lo que enseña el paso
  const TITULOS = ['Un chat leído', 'Qué leo', 'Lo que encuentro', 'Tu mapa', 'Así trabajo'];
  const BUSCA = ['Busco a quién le debes respuesta', 'Busco tus promesas', 'Busco quién quería vender o comprar'];

  function cuerpo(n) {
    const repaso = C.repaso(), dir = VETA.yo().papel === 'direccion';
    if (n === 0) return `<div data-i="1">${VETA.vivo.escena({clave: 'primer-dia'})}</div>`;
    if (n === 1) {
      const dentro = C.dentro();
      return (repaso ? R.hecho({texto: 'WhatsApp Business conectado', i: 1}) : '') +
        R.lista(VETA.modelo.lectura().fuera.map((x, k) =>
          UI.interruptor({texto: x, sub: dentro.includes(x) ? 'Entra' : 'Fuera', on: !dentro.includes(x), accion: 'personal', datos: {n: k}})), {rotulo: 'Chats que dejo fuera', i: 2}) +
        (repaso ? '' : `<div data-i="3">${R.enlace({texto: 'Subir un archivo exportado', accion: 'sube'})}</div>`);
    }
    if (n === 2) {
      const leido = repaso || C.lee('leido', false);
      return `<ul class="c-busca" data-i="1"${leido ? ' hidden' : ''}>${BUSCA.map((t, k) => `<li class="c-busca-l${leido ? ' hecho-l' : ''}" data-k="${k}"><span class="c-busca-m" aria-hidden="true">` +
          `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" vector-effect="non-scaling-stroke" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>${esc(t)}</span></li>`).join('')}</ul>` +
        `<div class="c-leido" id="c-leido"${leido ? '' : ' hidden'} data-i="2">${hallado()}${R.hecho({texto: `He leído ${VETA.num(C.leidos())} chats de 6 meses. ${C.fuera()} quedan fuera`})}` + `</div>`;
    }
    if (n === 3) return C.mapaHtml(1);
    const av = C.lee('avisos', false);
    return R.lista(NUDOS.map(t => ({nombre: t})), {i: 1}) +
      `<div data-i="1">${R.lista([{nombre: 'Qué hace Veta', pasa: 'Todo lo que hago, con ejemplos de tus chats', ir: 'que-hace'}])}</div>` +
      (av ? R.hecho({texto: 'Avisos permitidos', hora: av, deshacer: 'sin-avisos', vt: 'c-pd-av'})
        : `<div data-i="2" data-vt="c-pd-av">${R.lista([{nombre: 'Permitir avisos', pasa: 'Te aviso solo de lo que no puede esperar', accion: 'avisos'}])}</div>`) +
      (['hecho', 'ordenador'].includes(C.inicio()) ? '' : `<div data-i="3">${R.enlace({texto: 'Poner Veta en la pantalla de inicio', hoja: 'h31'})}</div>`);
  }

  VETA.pantalla('A18', {
    titulo: p => TITULOS[paso(p)], completa: true,
    // una frase de apoyo por paso (≤12 palabras) y, sobre el botón, lo que promete (≤10)
    sub: p => ['Así trabajo: leo un chat y te dejo lista la respuesta.', 'Leo tus chats con clientes para prepararte el día.', '', '', ''][paso(p)],
    nota: p => [{texto: 'Conectas tu WhatsApp. No rellenas nada.'}, 'nada', null, null, null][paso(p)],
    // arriba a la derecha: los puntos de paso y «Saltar», la única salida (HTML de la cabecera: VETA.cabDer)
    cabDerecha: p => VETA.cabDer({tipo: 'puntos', paso: paso(p) + 1, total: 5, texto: `Paso ${paso(p) + 1} de 5`}) + VETA.cabDer({tipo: 'saltar', accion: 'hoy'}),
    pinta: p => `<div class="c-pd"><div class="c-pd-c">${cuerpo(paso(p))}</div></div>`,
    botonFijo: p => {
      const n = paso(p), repaso = C.repaso();
      if (n === 0) return R.botones({texto: 'Empezar', ir: 'primer-dia/1'});
      if (n === 1) return R.botones(repaso ? {texto: 'Siguiente', ir: 'primer-dia/2'} : {texto: 'Conectar WhatsApp Business', accion: 'conecta', id: 'c-pd-con'});
      if (n === 2) { const l = repaso || C.lee('leido', false); return R.botones({texto: l ? 'Siguiente' : 'Leyendo tus chats', ir: 'primer-dia/3', deshabilitado: !l, id: 'c-pd-sig'}); }
      if (n === 3) return R.botones({texto: 'Siguiente', ir: 'primer-dia/4'});
      return R.botones({texto: 'Ir a Inicio', accion: 'hoy'});
    },
    alMontar: (el, p) => {
      para();
      if (paso(p) !== 2 || C.repaso() || C.lee('leido', false)) return;
      const ls = VETA.$$('.c-busca-l', el), rapido = VETA.reducido();
      ls.forEach((l, k) => reloj.push(setTimeout(() => l.classList.add('hecho-l'), rapido ? 0 : 800 + k * 1000)));
      reloj.push(setTimeout(() => {
        C.pon('leido', true);
        const bl = el.querySelector('.c-busca'); if (bl) bl.hidden = true;
        const r = document.getElementById('c-leido'); if (r) { r.hidden = false; VETA.mov.cascada(r.parentNode); }
        const b = document.getElementById('c-pd-sig'); if (b) { b.disabled = false; b.querySelector('span').textContent = 'Siguiente'; }
      }, rapido ? 0 : 3000));
    },
    acciones: {
      hoy() { para(); VETA.ir('hoy', {pestana: true}); },
      conecta(ev, el) { espera(el, 'Conectando'); },
      sube(ev, el) { espera(el, 'Subiendo el archivo'); },
      personal(ev, el) {
        const x = VETA.modelo.lectura().fuera[Number(el.dataset.n)], fuera = el.getAttribute('aria-checked') === 'true';
        const d = C.dentro().filter(y => y !== x); if (!fuera) d.push(x); C.pon('dentro', d);
        const s = el.querySelector('.interr-s'); if (s) s.textContent = fuera ? 'Fuera' : 'Entra';
      },
      avisos() { C.pon('avisos', VETA.ahora()); VETA.repinta({hecho: 'c-pd-av'}); },
      'sin-avisos'() { C.pon('avisos', false); VETA.repinta({hecho: 'c-pd-av'}); }
    }
  });

  function espera(el, texto) {
    VETA.$$('.fijo .r7-boton').forEach(b => { b.disabled = true; });
    const s = el.querySelector('span'); if (s) s.textContent = texto;
    el.classList.add('c-cargando');
    reloj.push(setTimeout(() => { C.pon('leido', false); VETA.ir('primer-dia/2'); }, VETA.reducido() ? 300 : 1200));
  }
})();
