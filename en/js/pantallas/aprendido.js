/* Veta demo · pantallas · aprendido.js · paquete C (Veta, cuenta y entrada)
   - A13 · Lo que he aprendido · #/aprendido
   - A13b · Proponer una mejora · #/mejora */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c;

  // ---- A13 · Lo que he aprendido ----
  // ronda 6: cada cosa con quién la pidió, cuándo, cuántas veces la he usado y cuántas me corregiste,
  // en qué paso está, si la uso o no (interruptor) y “Olvidar”. Lo enseñado hoy (“Sí, siempre” en Hoy) va el primero.
  const pausadas = () => C.lee('pausados', []);
  function tarjeta(x) {
    const on = !pausadas().includes(x.id);
    const usos = x.hechas ? `I have used it <b>${x.hechas}</b> ${x.hechas === 1 ? 'time' : 'times'} · you ${x.corregidas === 1 ? 'corrected 1' : x.corregidas ? 'corrected ' + x.corregidas : 'corrected 0'}` : esc(x.usos || '');
    return `<article class="c-ap-fila${x.hoy ? ' c-ap-hoy' : ''}${on ? '' : ' c-ap-off'}" data-vt="c-apr-${esc(x.id)}">` +
      (x.hoy ? `<p class="c-ap-cuando">${VETA.vivo.pastilla('Today' + (x.hora ? ', ' + x.hora : ''), 'reloj')}</p>` : '') +
      `<p class="c-ap-t">${x.hoy ? VETA.vivo.oro(x.texto, {clave: 'ap-hoy'}) : esc(x.texto)}</p>` +
      (x.antes ? `<p class="c-ap-cambio"><s>${esc(x.antes)}</s><span>${esc(x.ahora)}</span></p>` : '') +
      `<p class="c-ap-q">${esc(x.quien)} ${esc(x.cuando)}</p>` +
      `<p class="c-ap-n">${x.hechas ? VETA.vivo.anillo({van: x.hechas - x.corregidas, de: x.hechas, tam: 's'}) : ''}<span>${usos}</span></p>` +
      `<p class="c-ap-paso">${VETA.vivo.escalera({nivel: x.paso, mini: true})}</p>` +
      `<div class="c-ap-acc">${UI.interruptor({texto: 'I use it', sub: on ? 'Yes' : 'Paused: I do not use it', on, accion: 'usar', de: x.id})}` +
      UI.boton({tipo: 'texto', texto: 'Forget', accion: 'olvidar', de: x.id, ancho: false, g: 'Forget|I stop using it. You can undo it.'}) + `</div></article>`;
  }
  VETA.pantalla('A13', {
    titulo: 'What I\'ve learned from you',
    guia: ['Here you see what I\'ve learned from you: who told me, when, and how many times I\'ve used it.', 'You pause it or tell me to forget it.', 'This way you can always see and remove what I know about you.'],
    pinta: () => {
      const olv = C.lee('olvidados', []), r6 = C.r6().aprendido, hoy = VETA.r6.siempre();
      const items = [];
      if (hoy) items.push(tarjeta({id: 'siempre', hoy: true, hora: hoy.cuando, texto: hoy.regla, antes: hoy.antes, ahora: hoy.ahora,
        quien: 'You taught me by changing a message,', cuando: 'today', usos: 'I have not used it yet: you will see it in the next viewing message.', paso: 2}));
      else if (C.lee('siempreOlvidado', null)) items.push(UI.lineaHecho({texto: 'Forgotten: ' + C.lee('siempreOlvidado', {}).regla, boton: {texto: 'Undo', accion: 'recordar'}, de: 'siempre', vt: 'c-apr-siempre'}));
      D().aprendido.forEach(a => {
        const x = Object.assign({id: a.id}, r6[a.id] || {texto: a.texto, quien: a.origen, cuando: '', paso: 2});
        items.push(olv.includes(a.id) ? UI.lineaHecho({texto: 'Forgotten: ' + a.corto, boton: {texto: 'Undo', accion: 'recordar'}, de: a.id, vt: 'c-apr-' + a.id}) : tarjeta(x));
      });
      const n = C.aprendidoQueda() + (hoy ? 1 : 0);
      return `<p class="intro" data-i="0">${n ? `${n} ${n === 1 ? 'thing' : 'things'} I do the way you taught me.` : 'Right now I use nothing of what I have learned.'}</p>` +
        `<div class="c-aprendidos" data-i="1">${items.join('')}</div>` +
        UI.bloque({titulo: 'When you correct me', i: 2, html: UI.lista([
          {titulo: 'You corrected me 4 times and I changed it', icono: 'check'},
          {titulo: 'You changed 6 of 31 messages before sending them', icono: 'editar'},
          {titulo: '1 thing you told me that I did not understand', icono: 'orden', ir: 'entendido/no-entendida'}])}) +
        UI.bloque({titulo: 'From your office', i: 3, html: `<ul class="c-dice">${D().oficinaDice.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` + UI.lista([
          {titulo: 'How we work', icono: 'libro', ir: 'oficina/practicas'},
          {titulo: 'What your office knows', icono: 'ojo', ir: 'oficina/sabe'},
          {titulo: 'Propose an improvement', icono: 'estrella', ir: 'mejora'}])});
    },
    acciones: {
      olvidar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { C.pon('siempreOlvidado', VETA.r6.siempre()); VETA.r6.olvida(); }
        else C.pon('olvidados', C.lee('olvidados', []).concat(id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      recordar(ev, el) {
        const id = el.dataset.de;
        if (id === 'siempre') { const x = C.lee('siempreOlvidado', null); if (x) VETA.est.pon('r6_siempre', x); C.pon('siempreOlvidado', null); }
        else C.pon('olvidados', C.lee('olvidados', []).filter(x => x !== id));
        VETA.repinta({hecho: 'c-apr-' + id});
      },
      usar(ev, el) {
        const id = el.dataset.de, on = el.getAttribute('aria-checked') === 'true', p = pausadas().filter(x => x !== id);
        if (!on) p.push(id); C.pon('pausados', p);
        const f = el.closest('.c-ap-fila'); if (f) f.classList.toggle('c-ap-off', !on);
        const s = el.querySelector('.interr-s'); if (s) s.textContent = on ? 'Yes' : 'Paused: I do not use it';
      }
    }
  });

  // ---- A13b · Proponer una mejora ----
  let texto = '', busca = null;
  const conCasos = t => D().mejoras.some(m => m.toLowerCase() === String(t).trim().toLowerCase());
  VETA.pantalla('A13b', {
    titulo: 'Propose an improvement',
    guia: ['Here you propose to the office a better way of doing something.', 'You write it; Veta looks for whether it has already happened in your chats.', 'That way management decides with cases, not opinions.'],
    pinta: () => {
      const env = C.lee('mejoraEnviada', null);
      if (env) return UI.lineaHecho({texto: 'Proposal sent. Management decides whether to try it.', hora: env.hora, boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-mejora', i: 0}) +
        `<blockquote class="cita c-cita-quieta" data-i="1"><span class="cita-t">“${esc(env.texto)}”</span><span class="cita-o">Your proposal · today</span></blockquote>`;
      return `<div data-i="0" data-vt="c-mejora">${UI.campo({id: 'c-mejora', etiqueta: 'What would you do better?', area: true, filas: 3, valor: texto, placeholder: 'For example: call within 48 hours anyone who asks to see a flat'})}</div>` +
        UI.bloque({titulo: 'Examples', i: 1, html: `<div class="c-chips">${D().mejoras.map((m, k) => `<button type="button" class="c-chip" data-accion="ejemplo" data-n="${k}">${esc(m)}</button>`).join('')}</div>`}) +
        `<div data-i="2">${UI.boton({tipo: 'secundario', texto: 'Search our cases', accion: 'buscar', icono: 'pregunta'})}</div>` +
        (busca ? `<div class="c-hallado" data-i="3">${UI.nota({texto: busca, icono: 'info', caja: true})}</div>` : '');
    },
    botonFijo: () => (C.lee('mejoraEnviada', null) ? '' : UI.boton({texto: 'Propose it to the office', accion: 'proponer'})),
    alMontar: el => { const t = el.querySelector('#c-mejora'); if (t) t.addEventListener('input', () => { texto = t.value; }); },
    acciones: {
      ejemplo(ev, el) { texto = D().mejoras[Number(el.dataset.n)]; busca = null; const t = document.getElementById('c-mejora'); if (t) t.value = texto; const h = document.querySelector('.c-hallado'); if (h) h.remove(); },
      buscar() {
        const t = document.getElementById('c-mejora'); texto = t ? t.value : texto;
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('First write what you\'d do better.'); return; }
        busca = conCasos(texto) ? 'What I\'ve found: you\'ve done it 11 times in six months; in 8 of them the client asked for a viewing.' : 'I can\'t find cases in your chats yet. I\'ll save it and look when they come in.';
        VETA.repinta();
      },
      proponer() {
        const t = document.getElementById('c-mejora'); texto = t ? t.value : texto;
        if (!texto.trim()) { if (t) t.focus(); VETA.aviso('First write what you\'d do better.'); return; }
        C.pon('mejoraEnviada', {texto: texto.trim(), hora: VETA.ahora()}); VETA.repinta({hecho: 'c-mejora'});
      },
      deshacer() { const e = C.lee('mejoraEnviada', null); if (e) texto = e.texto; C.pon('mejoraEnviada', null); VETA.repinta({hecho: 'c-mejora'}); }
    }
  });
})();
