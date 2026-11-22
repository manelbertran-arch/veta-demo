/* Veta demo · hojas · dia.js · paquete A (El día)
   H03 Registro · H04 Lo que he leído · H05 Hechas hoy · H06 Día cerrado · H07 Lo que dijiste · H09 No es eso.
   (H08 “¿Qué puedo decir?” está en pantallas/dictar.js y H42 “¿Cómo quieres enviarlo?” en pantallas/informe.js,
   junto a la pantalla que las usa.) */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic;
  const DA = () => VETA.datos.diaA || {};
  const limpio = s => String(s || '').replace(/<[^>]+>/g, '');
  const cerrar = () => '';   // ronda 7: “Cerrar” va arriba a la derecha en todas las hojas (V7)
  const sec = (titulo, html) => `<section class="a-h-sec">${titulo ? `<h3 class="ht-t">${esc(titulo)}</h3>` : ''}${html}</section>`;

  // ---- H03 · Registro de lo enviado ----
  const preparado = c => { const inf = c.tipo === 'informe' ? ((DA().informe || {})[c.cliente] || {}).mensaje : null; return limpio((c.extra || {}).borradorHtml || c.borrador || inf || ''); };
  VETA.hojaDef('h03', {
    titulo: 'What you sent',
    pinta: d => {
      const c = M.cosa(d.de);
      if (!c) return `<p class="hoja-x">I can't find this send.</p>` + cerrar();
      const prep = preparado(c), env = (c.extra || {}).borrador ? limpio(c.extra.borrador) : prep;
      const llego = VETA.est.lee('a.llego.' + c.id, null), rec = VETA.A.local('a-rec-' + c.id);
      let h = `<p class="hoja-x">For ${esc(c.titulo)}, via WhatsApp · today</p>`;
      h += sec('What Veta prepared', `<p class="a-h-txt">${esc(prep)}</p>`);
      h += sec('What you sent', `<p class="a-h-txt">${esc(env)}</p>${env === prep ? '<p class="a-h-gris">Same as Veta\'s.</p>' : '<p class="a-h-gris">You changed it.</p>'}`);
      h += UI.nota({texto: 'You sent it. Veta has not sent anything.', icono: 'candado', caja: true});
      h += `<p class="a-h-gris a-h-marca">Marked by you · ${esc(c.hora || VETA.ahora())}</p>`;
      h += sec('Did it arrive?', llego
        ? UI.lineaHecho({texto: llego === 'si' ? 'Arrived · logged' : 'Didn\'t arrive · logged', boton: {texto: 'Change', accion: 'llego-borra'}})
        : UI.botones([{texto: 'Yes', accion: 'llego', datos: {v: 'si'}}, {texto: 'Didn\'t arrive', accion: 'llego', datos: {v: 'no'}}]));
      h += rec ? UI.lista([{titulo: 'Reminder ready', sub: 'I\'ll keep an eye on it: ' + rec.fecha.toLowerCase(), icono: 'reloj'}])
        : UI.lista([{titulo: 'Prepare a reminder if there\'s no reply', sub: 'I\'ll keep an eye on it', icono: 'reloj', accion: 'recordatorio'}]);
      return h + cerrar();
    },
    acciones: {
      llego(ev, el, d) { VETA.est.pon('a.llego.' + d.de, el.dataset.v); VETA.hoja('h03', d); },
      'llego-borra'(ev, el, d) { VETA.est.pon('a.llego.' + d.de, null); VETA.hoja('h03', d); },
      recordatorio(ev, el, d) {
        const c = M.cosa(d.de); if (!c) return;
        VETA.A.ponLocal({id: 'a-rec-' + c.id, tipo: 'recordatorio', cliente: c.cliente, titulo: c.titulo, texto: 'Reminder if there\'s no reply', fecha: 'Thu 26', fechaISO: '2026-11-26'});
        VETA.hoja('h03', d); VETA.repinta();
      }
    }
  });

  // ---- H04 · Lo que he leído ----
  VETA.hojaDef('h04', {
    titulo: 'What I\'ve read',
    pinta: d => {
      const L = M.lectura() || {}, hoy = L.hoy || {}, dir = VETA.yo().papel === 'direccion', equipo = dir && d && d.quien === 'equipo';
      const sergi = dir ? null : M.cosa((DA().yaNo || {}).cosa);
      let h = `<p class="hoja-x">Read up to today, ${esc(VETA.ahora(-3))}</p>`;
      h += `<ul class="a-canales">${(L.canales || []).filter(c => /whatsapp/i.test(c.nombre)).map(c => `<li><span class="a-verde" aria-hidden="true"></span><span class="a-can-n">${esc(c.nombre)}</span><span class="a-can-h">${esc(c.hace)}</span></li>`).join('')}</ul>`;
      h += `<p class="a-h-txt">${esc(equipo ? '46 work chats read today in the office' : hoy.chats + ' chats read today')}</p>`;
      // dirección: en Equipo, lo de la oficina (sin chats de nadie); en lo suyo, sus clientes
      const det = equipo ? ['Carmen López writes to the office WhatsApp and nobody replies', 'Joan Serra complains: ten days without news', 'Teresa is on leave: 34 unattended conversations']
        : dir ? ['Rubén Gil asks about the penthouse viewings', 'Guillem Roig asks you to confirm Wednesday\'s viewing', 'Sílvia Prat is waiting for a reply to her offer'] : (DA().detectado || []);
      h += sec('Detected today · ' + det.length, `<ul class="a-h-lista">${det.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`);
      if (sergi && sergi.estado === 'quitada') h += sec('No longer here · 1', `<ul class="a-h-lista"><li>${esc(DA().yaNo.texto)}</li></ul>`);
      h += `<p class="a-h-gris a-h-aun"><span><b>Not yet:</b> I don't read emails, calls or voice notes.</span></p>`;
      h += `<p class="a-h-gris">${ic('candado', 18)} ${equipo ? 'Only office matters show here: each person\'s chats don\'t show in management.' : 'I don\'t read your personal groups or the chats you left out.'}</p>`;
      return h + cerrar();
    }
  });

  // ---- H05 · Hechas hoy ----
  VETA.hojaDef('h05', {
    titulo: 'What you did today',
    pinta: () => {
      const l = VETA.A.hechas(VETA.A.q());
      if (!l.length) return `<p class="hoja-x">You haven't done anything yet today. Whatever you do shows here, with its time.</p>` + cerrar();
      return `<div class="a-h-hechas">${l.map(x => {
        const izq = `<span class="a-dia-h">${esc(x.hora || '')}</span><span class="a-dia-t">${esc(x.texto)}</span>`;
        const a = x.sale ? `<button type="button" class="a-hl-a" data-accion="registro" data-de="${esc(x.id)}">${izq}</button>` : `<div class="a-hl-a">${izq}</div>`;
        const b = UI.boton({tipo: 'texto', texto: x.sale ? 'I didn\'t send it' : 'Undo', accion: x.local ? 'deshacer-local' : 'deshacer', de: x.id, ancho: false});
        return `<div class="a-hl">${a}${b}</div>`;
      }).join('')}</div>` + cerrar();
    },
    acciones: {
      registro(ev, el) { VETA.hoja('h03', {de: el.dataset.de}); },
      deshacer(ev, el) { M.deshaz(el.dataset.de); VETA.repinta(); VETA.hoja('h05', {}); },
      'deshacer-local'(ev, el) { VETA.A.quitaLocal(el.dataset.de); VETA.repinta(); VETA.hoja('h05', {}); }
    }
  });

  // ---- H06 · Día cerrado ----
  VETA.hojaDef('h06', {
    titulo: 'Day closed',
    pinta: () => {
      const q = VETA.A.q(), cola = M.cola(q);
      const hecho = cola.filter(c => ['enviada', 'hecha', 'quitada'].includes(c.estado)).length;
      const espera = VETA.A.esperaPend(q).length, man = M.manana(q).length;
      const parte = ((VETA.datos.partes || {})['1930'] || {}).bloques || [];
      let h = `<div class="a-h-cifras">${[['Done', hecho], ['Watching', espera], ['Moved to tomorrow', man]].map(([t, n]) => `<div><b>${n}</b><span>${esc(t)}</span></div>`).join('')}</div>`;
      h += `<div class="hoja-texto">${parte.slice(1).map(b => `<section class="ht-b">${b.titulo ? `<h3 class="ht-t">${esc(b.titulo)}</h3>` : ''}${b.texto ? `<p>${esc(b.texto)}</p>` : ''}${b.lista ? `<ul>${b.lista.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</section>`).join('')}</div>`;
      h += UI.lista([{titulo: 'See the full wrap-up', icono: 'doc', hoja: 'h41', datos: {parte: '1930'}}]);
      return h;
    }
  });

  // ---- H07 · Lo que dijiste ----
  VETA.hojaDef('h07', {
    titulo: 'What you said',
    pinta: d => {
      const g = d.guion || 'acta', u = VETA.est.lee('a.ultimoDictado', null);
      const mio = u && u.guion === g ? u : null;
      const texto = mio ? mio.texto : ((VETA.datos.dictados || {})[g] || {}).frase;
      const seg = mio ? mio.seg : (DA().duracion || {})[g] || 0;
      return `<p class="hoja-x">Today, ${esc(mio ? mio.hora : '9:47')} · ${esc(VETA.A.mmss(seg))}</p>` +
        `<blockquote class="a-h-dijo">“${esc(texto || '')}”</blockquote>` +
        `<p class="a-h-gris">I don't keep the audio: only the text.</p>`;   // ronda 7: sin “Cerrar” abajo (ya está arriba a la derecha)
    }
  });

  // ---- H09 · No es eso ----
  VETA.hojaAcciones('h09', {
    titulo: 'That\'s not it',
    texto: 'What was it?', cancelar: false,   // ronda 7: sin “Cancelar” abajo
    opciones: d => (DA().noEsEso || []).filter(o => o.guion !== d.guion).map(o => ({texto: o.texto, hace: () => {
      const u = VETA.est.lee('a.ultimoDictado', null);
      if (u) VETA.est.pon('a.ultimoDictado', Object.assign({}, u, {guion: o.guion}));
      const va = ((VETA.datos.dictados || {})[o.guion] || {}).va || 'entendido-dictado/tarea';
      setTimeout(() => VETA.ir(va, {reemplaza: true}), 0);
    }}))
  });
})();
