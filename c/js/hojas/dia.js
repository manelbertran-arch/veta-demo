/* Veta demo · ronda 8 · hojas · dia.js · carril A (El día)
   H03 Registro · H04 Lo que he leído · H05 Hechas hoy · H06 Día cerrado · H07 Lo que dijiste · H09 No es eso.
   Ronda 8: r8-hoy «Hoy he hecho yo» · r8-cerradas «Ya lo he cerrado yo» · r8-mas «Más» de un documento · y las hojas de acciones de las
   filas que antes se desplegaban: r8-dictado «Lo que me contabas», r8-pregunta «Montse te pregunta», r8-dia «Día cerrado», r8-vigilo (una cosa vigilada).
   (H08 «¿Qué puedo decir?» ya no existe: es la pantalla Dictar. H42 «¿Cómo lo envías?» está en pantallas/informe.js.) */
(function () {
  'use strict';
  const UI = VETA.UI, M = VETA.modelo, esc = VETA.esc, ic = VETA.ic;
  const DA = () => VETA.datos.diaA || {};
  const limpio = s => String(s || '').replace(/<[^>]+>/g, '');
  const cerrar = () => '';   // ronda 7: «Cerrar» va arriba a la derecha en todas las hojas (V7)
  const sec = (titulo, html) => `<section class="a-h-sec">${titulo ? `<h3 class="ht-t">${esc(titulo)}</h3>` : ''}${html}</section>`;

  // ---- H03 · Registro de lo enviado ----
  const preparado = c => { const inf = c.tipo === 'informe' ? ((DA().informe || {})[c.cliente] || {}).mensaje : null; return limpio((c.extra || {}).borradorHtml || c.borrador || inf || ''); };
  VETA.hojaDef('h03', {
    titulo: 'Lo que enviaste',
    pinta: d => {
      const c = M.cosa(d.de);
      if (!c) return `<p class="hoja-x">No encuentro este envío.</p>` + cerrar();
      const prep = preparado(c), env = (c.extra || {}).borrador ? limpio(c.extra.borrador) : prep;
      const llego = VETA.est.lee('a.llego.' + c.id, null), rec = VETA.A.local('a-rec-' + c.id);
      let h = `<p class="hoja-x">Para ${esc(c.titulo)}, por WhatsApp · hoy</p>`;
      h += sec('Lo que preparó Veta', `<p class="a-h-txt">${esc(prep)}</p>`);
      h += sec('Lo que enviaste', `<p class="a-h-txt">${esc(env)}</p>${env === prep ? '<p class="a-h-gris">Igual que el de Veta.</p>' : '<p class="a-h-gris">Lo cambiaste tú.</p>'}`);
      h += UI.nota({texto: 'Lo enviaste tú. Veta no ha enviado nada.', icono: 'candado', caja: true});
      h += `<p class="a-h-gris a-h-marca">Marcado por ti · ${esc(c.hora || VETA.ahora())}</p>`;
      h += sec('¿Llegó?', llego
        ? UI.lineaHecho({texto: llego === 'si' ? 'Llegó · queda apuntado' : 'No llegó · queda apuntado', boton: {texto: 'Cambiar', accion: 'llego-borra'}})
        : UI.botones([{texto: 'Sí', accion: 'llego', datos: {v: 'si'}}, {texto: 'No llegó', accion: 'llego', datos: {v: 'no'}}]));
      h += rec ? UI.lista([{titulo: 'Recordatorio preparado', sub: 'Lo vigilo yo: ' + rec.fecha.toLowerCase(), icono: 'reloj'}])
        : UI.lista([{titulo: 'Preparar un recordatorio si no contesta', sub: 'Lo vigilo yo', icono: 'reloj', accion: 'recordatorio'}]);
      return h + cerrar();
    },
    acciones: {
      llego(ev, el, d) { VETA.est.pon('a.llego.' + d.de, el.dataset.v); VETA.hoja('h03', d); },
      'llego-borra'(ev, el, d) { VETA.est.pon('a.llego.' + d.de, null); VETA.hoja('h03', d); },
      recordatorio(ev, el, d) {
        const c = M.cosa(d.de); if (!c) return;
        VETA.A.ponLocal({id: 'a-rec-' + c.id, tipo: 'recordatorio', cliente: c.cliente, titulo: c.titulo, texto: 'Recordatorio si no contesta', fecha: 'Jue 26', fechaISO: '2026-11-26'});
        VETA.hoja('h03', d); VETA.repinta();
      }
    }
  });

  // ---- H04 · Lo que he leído ----
  VETA.hojaDef('h04', {
    titulo: 'Lo que he leído',
    pinta: d => {
      const L = M.lectura() || {}, hoy = L.hoy || {}, dir = VETA.yo().papel === 'direccion', equipo = dir && d && d.quien === 'equipo';
      const sergi = dir ? null : M.cosa((DA().yaNo || {}).cosa);
      let h = `<p class="hoja-x">Leído hasta hoy, ${esc(VETA.ahora(-3))}</p>`;
      h += `<ul class="a-canales">${(L.canales || []).filter(c => /whatsapp/i.test(c.nombre)).map(c => `<li><span class="a-verde" aria-hidden="true"></span><span class="a-can-n">${esc(c.nombre)}</span><span class="a-can-h">${esc(c.hace)}</span></li>`).join('')}</ul>`;
      h += `<p class="a-h-txt">${esc(equipo ? '46 chats de trabajo leídos hoy en la oficina' : hoy.chats + ' chats leídos hoy')}</p>`;
      // dirección: en Equipo, lo de la oficina (sin chats de nadie); en lo suyo, sus clientes
      const det = equipo ? ['Carmen López escribe al WhatsApp de la oficina y nadie le contesta', 'Joan Serra se queja: lleva diez días sin noticias', 'Teresa está de baja: 34 conversaciones sin atender']
        : dir ? ['Rubén Gil pregunta por las visitas del ático', 'Guillem Roig pide que le confirmes la visita del miércoles', 'Sílvia Prat espera respuesta a su oferta'] : (DA().detectado || []);
      h += sec('Detectado hoy · ' + det.length, `<ul class="a-h-lista">${det.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`);
      if (sergi && sergi.estado === 'quitada') h += sec('Ya no está aquí · 1', `<ul class="a-h-lista"><li>${esc(DA().yaNo.texto)}</li></ul>`);
      h += `<p class="a-h-gris a-h-aun"><span><b>Todavía no:</b> el correo, las llamadas y los audios no los leo.</span></p>`;
      h += `<p class="a-h-gris">${ic('candado', 18)} ${equipo ? 'Aquí solo sale lo de la oficina: los chats de cada persona no salen en dirección.' : 'Tus grupos personales y los chats que dejaste fuera no los leo.'}</p>`;
      return h + cerrar();
    }
  });

  // ---- H05 · Hechas hoy ----
  VETA.hojaDef('h05', {
    titulo: 'Lo que has hecho hoy',
    pinta: () => {
      const l = VETA.A.hechas(VETA.A.q());
      if (!l.length) return `<p class="hoja-x">Todavía no has hecho nada hoy. Lo que hagas sale aquí, con su hora.</p>` + cerrar();
      return `<div class="a-h-hechas">${l.map(x => {
        const izq = `<span class="a-dia-h">${esc(x.hora || '')}</span><span class="a-dia-t">${esc(x.texto)}</span>`;
        const a = x.sale ? `<button type="button" class="a-hl-a" data-accion="registro" data-de="${esc(x.id)}">${izq}</button>` : `<div class="a-hl-a">${izq}</div>`;
        const b = UI.boton({tipo: 'texto', texto: x.sale ? 'No lo envié' : 'Deshacer', accion: x.local ? 'deshacer-local' : 'deshacer', de: x.id, ancho: false});
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
    titulo: 'Día cerrado',
    pinta: () => {
      const q = VETA.A.q(), cola = M.cola(q);
      const hecho = cola.filter(c => ['enviada', 'hecha', 'quitada'].includes(c.estado)).length;
      const espera = VETA.A.esperaPend(q).length, man = M.manana(q).length;
      const parte = ((VETA.datos.partes || {})['1930'] || {}).bloques || [];
      let h = `<div class="a-h-cifras">${[['Hecho', hecho], ['Vigilo', espera], ['Pasan a mañana', man]].map(([t, n]) => `<div><b>${n}</b><span>${esc(t)}</span></div>`).join('')}</div>`;
      h += `<div class="hoja-texto">${parte.slice(1).map(b => `<section class="ht-b">${b.titulo ? `<h3 class="ht-t">${esc(b.titulo)}</h3>` : ''}${b.texto ? `<p>${esc(b.texto)}</p>` : ''}${b.lista ? `<ul>${b.lista.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</section>`).join('')}</div>`;
      h += UI.lista([{titulo: 'Ver el parte completo', icono: 'doc', hoja: 'h41', datos: {parte: '1930'}}]);
      return h;
    }
  });

  // ---- H07 · Lo que dijiste ---- datos: {guion} (lo último dictado) o {visita: id} (lo que contaste de esa visita)
  VETA.hojaDef('h07', {
    titulo: 'Lo que dijiste',
    pinta: d => {
      const vis = d.visita && VETA.a2 ? VETA.a2.de(d.visita) : null;
      if (vis) {
        const e = VETA.a2.est(vis.id);
        return `<p class="hoja-x">${esc(vis.cuando)} · ${esc(e.escrito ? 'Lo escribiste tú' : vis.dur)}</p><blockquote class="a-h-dijo">«${esc(e.dicho || vis.dicho)}»</blockquote>` +
          `<p class="a-h-gris">No guardo el audio: solo el texto.</p>`;
      }
      const g = d.guion || 'acta', u = VETA.est.lee('a.ultimoDictado', null);
      const mio = u && u.guion === g ? u : null;
      const texto = mio ? mio.texto : ((VETA.datos.dictados || {})[g] || {}).frase;
      const seg = mio ? mio.seg : (DA().duracion || {})[g] || 0;
      return `<p class="hoja-x">Hoy, ${esc(mio ? mio.hora : '9:47')} · ${esc(VETA.A.mmss(seg))}</p>` +
        `<blockquote class="a-h-dijo">«${esc(texto || '')}»</blockquote>` +
        `<p class="a-h-gris">No guardo el audio: solo el texto.</p>`;
    }
  });

  // ---- H09 · No es eso ----
  VETA.hojaAcciones('h09', {
    titulo: 'No es eso',
    texto: '¿Qué era?', cancelar: false,   // ronda 7: sin «Cancelar» abajo
    opciones: d => (DA().noEsEso || []).filter(o => o.guion !== d.guion).map(o => ({texto: o.texto, hace: () => {
      const u = VETA.est.lee('a.ultimoDictado', null);
      if (u) VETA.est.pon('a.ultimoDictado', Object.assign({}, u, {guion: o.guion}));
      const va = ((VETA.datos.dictados || {})[o.guion] || {}).va || 'entendido-dictado/tarea';
      setTimeout(() => VETA.ir(va, {reemplaza: true}), 0);
    }}))
  });

  // ================= ronda 8 =================
  const cuantas = n => (n === 1 ? 'Vigilo 1 cosa' : `Vigilo ${n} cosas`);

  // ---- r8-hoy · Hoy he hecho yo (Inicio): lo que Veta cerró sola, lo que vigila y lo que ha leído ----
  VETA.hojaAcciones('r8-hoy', {
    titulo: 'Hoy he hecho yo',
    opciones: () => {
      const q = VETA.A.q(), nc = VETA.A.cerradas(q).length, nl = ((M.lectura() || {}).hoy || {}).chats || 0;
      return [nc ? {texto: `Ya lo he cerrado yo · ${nc}`, hoja: 'r8-cerradas'} : null,
        {texto: cuantas(VETA.A.esperaPend(q).length), ir: 'espera'},
        {texto: nl === 1 ? 'He leído 1 chat desde ayer' : `He leído ${nl} chats desde ayer`, hoja: 'h04'}].filter(Boolean);
    }
  });

  // ---- r8-cerradas · Ya lo he cerrado yo: cada cosa con su «Deshacer» (vuelve a tu lista) ----
  VETA.hojaDef('r8-cerradas', {
    titulo: 'Ya lo he cerrado yo',
    pinta: () => {
      const l = VETA.A.cerradas(VETA.A.q());
      if (!l.length) return `<p class="hoja-x">Ahora no hay nada cerrado por mí.</p>`;
      return `<div class="a-h-hechas">${l.map(x => `<div class="a-hl"><div class="a-hl-a"><span class="a-dia-t"><b>${esc(x.titulo)}.</b> ${esc(x.texto)}</span></div>` +
        UI.boton({tipo: 'texto', texto: 'Deshacer', accion: 'reabre', de: x.id, ancho: false}) + '</div>').join('')}</div>`;
    },
    acciones: {
      reabre(ev, el) { VETA.A.reabre(el.dataset.de); VETA.cierraHoja({foco: false}); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('Vale. No lo cierro sin preguntarte.'); }
    }
  });

  // ---- r8-mas · «Más» de un documento (acta o informe): todo lo que no es enviar. datos: {que: 'acta' | 'informe', id} ----
  VETA.hojaAcciones('r8-mas', {
    titulo: 'Más',
    opciones: d => (d.que === 'acta' ? VETA.a2.masActa(d.id) : VETA.a2.masInforme(d.id))
  });

  // ---- r8-dictado · Lo que me contabas (el dictado a medias) ----
  VETA.hojaAcciones('r8-dictado', {
    titulo: 'Lo que me contabas',
    texto: () => { const d = VETA.A.dictado(); return d ? `Lo dejaste a medias (${VETA.A.mmss(d.seg)}).` : ''; },
    opciones: () => {
      const d = VETA.A.dictado(); if (!d) return [];
      return [{texto: 'Seguir', ir: 'dictar/' + d.guion}, {texto: 'Borrarlo', hace: () => { VETA.est.pon('a.dictado', null); VETA.repinta(); }}];
    }
  });

  // ---- r8-pregunta · Montse te pregunta. datos: {k} ----
  const pregunta = d => VETA.A.preguntas(VETA.A.q()).find(x => VETA.A.idPreg(x) === d.k) || null;
  VETA.hojaAcciones('r8-pregunta', {
    titulo: () => (((VETA.datos.personas || {}).montse || {}).corto || 'Montse') + ' te pregunta',
    texto: d => { const x = pregunta(d); return x ? `Sobre ${x.nombre}, hoy a las ${x.hora}: «${x.texto}»` : ''; },
    opciones: d => {
      const x = pregunta(d); if (!x) return [];
      return [{texto: 'Ya le he contestado', hace: () => { VETA.A.contesta(d.k); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('Hecho. Se lo digo a Montse.'); }},
        (VETA.datos.clientes || {})[x.op] ? {texto: 'Ver la ficha', ir: 'cliente/' + x.op} : null].filter(Boolean);
    }
  });

  // ---- r8-dia · Día cerrado ----
  VETA.hojaAcciones('r8-dia', {
    titulo: 'Día cerrado',
    texto: 'Mañana a las 8:00, lista nueva.',
    opciones: () => [{texto: 'Abrir el día otra vez', hace: () => { VETA.est.pon('a.cerrado', null); VETA.repinta(); }}]
  });

  // ---- r8-vigilo · una cosa que vigilo (A7). data-de = id de la cosa ----
  VETA.hojaAcciones('r8-vigilo', {
    titulo: d => (VETA.A.vigilo.cosa(d.de) || {}).titulo || 'Lo que vigilo por ti',
    texto: d => { const c = VETA.A.vigilo.cosa(d.de); return c ? c.fecha + ' · ' + c.texto : ''; },
    opciones: d => {
      const c = VETA.A.vigilo.cosa(d.de), b = c && c.boton; if (!c) return [];
      return [b ? (b.hoja ? {texto: b.texto, hoja: b.hoja, datos: {de: c.id}} : b.ir ? {texto: b.texto, ir: b.ir} : {texto: b.texto, hace: () => VETA.A.vigilo.principal(c.id)}) : null,
        {texto: c.local ? 'Ya está hecha' : 'Se cumplió', hace: () => VETA.A.vigilo.cumplio(c.id)},
        c.cliente ? {texto: 'Ver su ficha', ir: 'cliente/' + c.cliente} : null,
        c.chat || c.cita ? {texto: 'De dónde sale', hoja: 'h01', datos: {de: c.id}} : null].filter(Boolean);
    }
  });
})();
