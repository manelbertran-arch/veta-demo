/* Veta demo · ronda 8 · hojas · dia.js · carril A (El día)
   H03 Registro · H04 Lo que he leído · H05 Hechas hoy · H06 Día cerrado · H07 Lo que dijiste · H09 No es eso.
   Ronda 8: r8-hoy “Veta ha hecho hoy” · r8-cerradas “Ya lo he cerrado yo” · r8-mas “Más” de un documento · a-toca-mas “Más” de una cosa
   de hoy (las dos con la forma única, VETA.hojaMas, y “Enséñale a Veta con este caso”) · y las hojas de acciones de las
   filas que antes se desplegaban: r8-dictado “Lo que me contabas”, r8-pregunta “Montse te pregunta”, r8-dia “Día cerrado”, r8-vigilo (una cosa vigilada).
   (H08 “¿Qué puedo decir?” ya no existe: es la pantalla Dictar. H42 “¿Cómo lo envías?” está en pantallas/informe.js.) */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic, r7 = VETA.r7;
  const DA = () => VETA.datos.diaA || {};
  const limpio = s => String(s || '').replace(/<[^>]+>/g, '');
  const cerrar = () => '';   // ronda 7: “Cerrar” va arriba a la derecha en todas las hojas (V7)
  const sec = (titulo, html) => `<section class="a-h-sec">${titulo ? `<h3 class="ht-t">${esc(titulo)}</h3>` : ''}${html}</section>`;

  // ---- H03 · Lo que enviaste: a quién, el texto (una vez) y si llegó ----
  const preparado = c => { const inf = c.tipo === 'informe' ? ((DA().informe || {})[c.cliente] || {}).mensaje : null; return limpio((c.extra || {}).borradorHtml || c.borrador || inf || ''); };
  const REC = '2026-11-26';   // el día en que Veta avisa si no ha contestado
  VETA.hojaDef('h03', {
    titulo: 'What you sent',
    pinta: d => {
      const c = M.cosa(d.de);
      if (!c) return `<p class="hoja-x">I can't find this send.</p>`;
      const prep = preparado(c), env = (c.extra || {}).borrador ? limpio(c.extra.borrador) : prep;
      const llego = VETA.est.lee('a.llego.' + c.id, null), rec = VETA.A.local('a-rec-' + c.id);
      return `<p class="hoja-x">For ${esc(c.titulo)}, by WhatsApp · ${esc(VETA.fecha.corta(VETA.datos.fecha.hoyISO + 'T' + (c.hora || VETA.ahora()), {frase: true}))}</p>` +
        r7.tarjeta({de: env === prep ? 'Same as Veta\'s' : '', texto: env}) +
        r7.elegir([{id: 'si', texto: 'Yes, it arrived'}, {id: 'no', texto: 'Didn\'t arrive'}], {valor: llego, accion: 'llego', rotulo: 'Did it arrive?'}) +
        (rec ? `<p class="hoja-x">I'll tell you on ${esc(VETA.fecha.larga(rec.fechaISO || REC, {frase: true}).replace(/ de \S+$/, ''))} if they haven't replied.</p>` : r7.enlace({texto: 'Tell me if they don\'t reply', accion: 'recordatorio'}));
    },
    acciones: {
      llego(ev, el, d) { VETA.est.pon('a.llego.' + d.de, el.dataset.valor); },
      recordatorio(ev, el, d) {
        const c = M.cosa(d.de); if (!c) return;
        VETA.A.ponLocal({id: 'a-rec-' + c.id, tipo: 'recordatorio', cliente: c.cliente, titulo: c.titulo, texto: 'I\'ll tell you if they don\'t reply', fecha: VETA.fecha.corta(REC), fechaISO: REC});
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
      const det = equipo ? ['Carmen López writes to the office WhatsApp and nobody replies', 'Joan Serra complains: ten days without news', 'Teresa is on leave: her conversations are waiting']
        : dir ? ['Rubén Gil asks about the penthouse viewings', 'Guillem Roig asks you to confirm Wednesday\'s viewing', 'Sílvia Prat is waiting for a reply to her offer'] : (DA().detectado || []);
      h += sec('Detected today · ' + det.length, `<ul class="a-h-lista">${det.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`);
      if (sergi && sergi.estado === 'quitada') h += sec('No longer here · 1', `<ul class="a-h-lista"><li>${esc(DA().yaNo.texto)}</li></ul>`);
      h += `<p class="a-h-gris a-h-aun"><span><b>Voice notes:</b> I transcribe the voice note and delete the audio.</span></p>`;
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
        const b = UI.boton({tipo: 'texto', texto: 'Undo', accion: x.local ? 'deshacer-local' : 'deshacer', de: x.id, ancho: false});   // una sola palabra (D12)
        return `<div class="a-hl">${a}${b}</div>`;
      }).join('')}</div>` + cerrar();
    },
    acciones: {
      registro(ev, el) { VETA.hoja('h03', {de: el.dataset.de}); },
      deshacer(ev, el) { M.deshaz(el.dataset.de); VETA.repinta(); VETA.hoja('h05', {}); },
      'deshacer-local'(ev, el) { VETA.A.quitaLocal(el.dataset.de); VETA.repinta(); VETA.hoja('h05', {}); }
    }
  });

  // ---- H06 · Día cerrado: la noticia del día en una cifra, dos recuentos en fila y lo que viene esta semana ----
  VETA.hojaDef('h06', {
    titulo: 'Day closed',
    pinta: () => {
      const q = VETA.A.q(), cola = M.cola(q);
      const hecho = cola.filter(c => ['enviada', 'hecha', 'quitada'].includes(c.estado)).length;
      const espera = VETA.A.esperaPend(q).length, man = M.manana(q).length;
      const semana = (((VETA.datos.partes || {})['1930'] || {}).bloques || []).find(b => b.semana);
      return r7.cifra({valor: hecho, frase: hecho === 1 ? 'thing done today.' : 'things done today.'}) +
        r7.lista([{nombre: 'I\'ll keep an eye on it', dato: espera}, {nombre: 'Moved to tomorrow', dato: man}]) +
        (semana ? r7.lista(semana.semana.map(x => ({nombre: x.que, dato: VETA.fecha.corta(x.iso)})), {rotulo: semana.titulo}) : '') +
        r7.enlace({texto: 'See the full wrap-up', hoja: 'h41', datos: {parte: '1930'}});
    }
  });

  // ---- H07 · Lo que dijiste ---- datos: {guion} (lo último dictado) o {visita: id} (lo que contaste de esa visita)
  VETA.hojaDef('h07', {
    titulo: 'What you said',
    pinta: d => {
      const vis = d.visita && VETA.a2 ? VETA.a2.de(d.visita) : null;
      if (vis) {
        const e = VETA.a2.est(vis.id);
        return `<p class="hoja-x">${esc(vis.cuando)} · ${esc(e.escrito ? 'You wrote it yourself' : vis.dur)}</p><blockquote class="a-h-dijo">“${esc(e.dicho || vis.dicho)}”</blockquote>` +
          `<p class="a-h-gris">I transcribe the voice note and delete the audio.</p>`;
      }
      const g = d.guion || 'acta', u = VETA.est.lee('a.ultimoDictado', null);
      const mio = u && u.guion === g ? u : null;
      const texto = mio ? mio.texto : ((VETA.datos.dictados || {})[g] || {}).frase;
      const seg = mio ? mio.seg : (DA().duracion || {})[g] || 0;
      return `<p class="hoja-x">Today, ${esc(mio ? mio.hora : '9:47')} · ${esc(VETA.A.mmss(seg))}</p>` +
        `<blockquote class="a-h-dijo">“${esc(texto || '')}”</blockquote>` +
        `<p class="a-h-gris">I transcribe the voice note and delete the audio.</p>`;
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

  // ================= ronda 8 =================
  // la opción se llama como la pantalla que abre (“Lo que vigilo por ti”), con su número detrás, igual que “Ya lo he cerrado yo · 2”

  // ---- r8-hoy · Veta ha hecho hoy (Inicio): lo que Veta cerró sola, lo que vigila y lo que ha leído ----
  VETA.hojaAcciones('r8-hoy', {
    titulo: 'Veta did today',
    opciones: () => {
      const q = VETA.A.q(), nc = VETA.A.cerradas(q).length, nl = ((M.lectura() || {}).hoy || {}).chats || 0;
      return [nc ? {texto: `I already closed these · ${nc}`, hoja: 'r8-cerradas'} : null,
        {texto: `What I'm watching for you · ${VETA.A.esperaPend(q).length}`, ir: 'espera'},
        {texto: nl === 1 ? 'I have read 1 chat since yesterday' : `I have read ${nl} chats since yesterday`, hoja: 'h04'}].filter(Boolean);
    }
  });

  // ---- r8-cerradas · Ya lo he cerrado yo: cada cosa con su “Deshacer” (vuelve a tu lista) ----
  VETA.hojaDef('r8-cerradas', {
    titulo: 'I already closed these',
    pinta: () => {
      const l = VETA.A.cerradas(VETA.A.q());
      if (!l.length) return `<p class="hoja-x">Nothing closed by me right now.</p>`;
      return `<div class="a-h-hechas">${l.map(x => `<div class="a-hl"><div class="a-hl-a"><span class="a-dia-t"><b>${esc(x.titulo)}.</b> ${esc(x.texto)}</span></div>` +
        UI.boton({tipo: 'texto', texto: 'Undo', accion: 'reabre', de: x.id, ancho: false}) + '</div>').join('')}</div>`;
    },
    acciones: {
      reabre(ev, el) { VETA.A.reabre(el.dataset.de); VETA.cierraHoja({foco: false}); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('OK. I won\'t close it without asking you.'); }
    }
  });

  // ---- r8-mas · “Más” de un documento (acta o informe): todo lo que no es enviar. datos: {que: 'acta' | 'informe', id} ----
  VETA.hojaMas('r8-mas', {
    titulo: d => (d.que === 'acta' ? 'The notes' : 'The report'),   // como las demás hojas de “Más”: se llama como aquello de lo que va (“El resumen”, el nombre de la persona)
    ensena: d => d.que === 'acta',                                  // “Enséñale a Veta con este caso”: cómo quieres las actas (el caso es el `casoDictado` del acta)
    opciones: d => (d.que === 'acta' ? VETA.a2.masActa(d.id) : VETA.a2.masInforme(d.id))
  });

  // ---- a-toca-mas · “Más” de una cosa de hoy (Contestar a Marta): sus otras respuestas, su ficha y “Enséñale a Veta con este caso” ----
  // Las opciones son las de la cosa (c.otraCosa, en datos/r6-dia.js y r7-a1.js), las mismas que pintaba la hoja común h02.
  VETA.hojaMas('a-toca-mas', {
    titulo: d => (M.cosa(d.de) || {}).titulo || 'Today',
    ensena: true,
    opciones: d => {
      const c = M.cosa(d.de); if (!c) return [];
      return (Array.isArray(c.otraCosa) ? c.otraCosa : []).map(o => o.paso ? {texto: o.texto, hoja: 'h02', datos: {paso: o.paso}} : o.ir ? {texto: o.texto, ir: o.ir} : o.hoja ? {texto: o.texto, hoja: o.hoja}
        : {texto: o.texto, hace: () => { M.marca(d.de, o.estado, o.linea ? {linea: o.linea, motivo: o.motivo || o.texto} : {motivo: o.texto}); VETA.repinta({hecho: d.de}); if (VETA.pintaBarra) VETA.pintaBarra(); }});
    }
  });

  // ---- r8-dictado · Lo que me contabas (el dictado a medias) ----
  VETA.hojaAcciones('r8-dictado', {
    titulo: 'What you were telling me',
    texto: () => { const d = VETA.A.dictado(); return d ? `You left it halfway (${VETA.A.mmss(d.seg)}).` : ''; },
    opciones: () => {
      const d = VETA.A.dictado(); if (!d) return [];
      return [{texto: 'Continue', ir: 'dictar/' + d.guion}, {texto: 'Delete it', hace: () => { VETA.est.pon('a.dictado', null); VETA.repinta(); }}];
    }
  });

  // ---- r8-pregunta · Montse te pregunta. datos: {k} ----
  const pregunta = d => VETA.A.preguntas(VETA.A.q()).find(x => VETA.A.idPreg(x) === d.k) || null;
  VETA.hojaAcciones('r8-pregunta', {
    titulo: () => (((VETA.datos.personas || {}).montse || {}).corto || 'Montse') + ' asks you',
    texto: d => { const x = pregunta(d); return x ? `About ${x.nombre}, today at ${x.hora}: “${x.texto}”` : ''; },
    opciones: d => {
      const x = pregunta(d); if (!x) return [];
      return [{texto: 'I already replied', hace: () => { VETA.A.contesta(d.k); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('Done. I will tell Montse.'); }},
        (VETA.datos.clientes || {})[x.op] ? {texto: 'See the profile', ir: 'cliente/' + x.op} : null].filter(Boolean);
    }
  });

  // ---- r8-dia · Día cerrado ----
  VETA.hojaAcciones('r8-dia', {
    titulo: 'Day closed',
    texto: 'New list tomorrow at 8:00.',
    opciones: () => [{texto: 'Open the day again', hace: () => { VETA.est.pon('a.cerrado', null); VETA.repinta(); }}]
  });

  // ---- r8-vigilo · una cosa que vigilo (A7). data-de = id de la cosa ----
  VETA.hojaAcciones('r8-vigilo', {
    titulo: d => (VETA.A.vigilo.cosa(d.de) || {}).titulo || 'What I\'m watching for you',
    texto: d => { const c = VETA.A.vigilo.cosa(d.de); return c ? VETA.fecha.corta(c.fechaISO) + ' · ' + c.texto : ''; },
    opciones: d => {
      const c = VETA.A.vigilo.cosa(d.de), b = c && c.boton; if (!c) return [];
      return [b ? (b.hoja ? {texto: b.texto, hoja: b.hoja, datos: {de: c.id}} : b.ir ? {texto: b.texto, ir: b.ir} : {texto: b.texto, hace: () => VETA.A.vigilo.principal(c.id)}) : null,
        {texto: c.local ? 'Already done' : 'It was kept', hace: () => VETA.A.vigilo.cumplio(c.id)},
        c.cliente ? {texto: 'See their profile', ir: 'cliente/' + c.cliente} : null,
        c.chat || c.cita ? {texto: 'Where it comes from', hoja: 'h01', datos: {de: c.id}} : null].filter(Boolean);
    }
  });
})();
