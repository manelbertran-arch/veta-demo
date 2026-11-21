/* Veta demo · hojas · comunes.js (núcleo)
   Las 6 hojas comunes: H01 De dónde sale · H02 Otra cosa… · H17 Foto ampliada · H26 Aspecto ·
   H29 Texto legal · H41 Texto de un parte. Y las acciones de la tarjeta de la cola, que valen en cualquier pantalla
   (una pantalla puede sustituirlas definiendo una acción con el mismo nombre). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo;
  const cosaDe = id => M.cosa(id) || M.cosa(String(id || '').replace(/^mu-/, ''));
  const cerrar = (tipo) => UI.boton({tipo: tipo || 'secundario', texto: 'Cerrar', datos: {cierra: '1'}, clase: 'hoja-cancela'});

  // ---- H01 · De dónde sale ----
  // data-hoja="h01" con data-de="<id de cosa o de cliente>" o data-chat="<id de chat>"
  const chatDe = d => {
    if (d.chat) return M.chat(d.chat);
    const c = d.de && cosaDe(d.de); if (c && c.chat) return M.chat(c.chat);
    const cl = d.de && M.cliente(d.de); if (cl && cl.chat) return M.chat(cl.chat);
    return null;
  };
  VETA.hojaDef('h01', {
    titulo: 'De dónde sale',
    pinta: d => {
      const ch = chatDe(d), dueno = VETA.duenoDe({chat: d.chat, de: d.de});
      if (dueno && VETA.ajeno(dueno)) return `<p class="hoja-x">${esc(VETA.chatAjenoTexto(dueno))}</p>${cerrar()}`;
      if (!ch) return `<p class="hoja-x">No encuentro el chat de origen.</p>${cerrar()}`;
      return `<p class="hoja-x tenue">${esc(ch.titulo)}</p>${UI.burbujas(ch.mensajes)}${cerrar()}`;
    }
  });

  // ---- H02 · Otra cosa… (título: el nombre del asunto) ----
  const OPC = {
    normal: [
      {texto: 'Ya lo llevé por teléfono', estado: 'hecha', linea: 'Resuelto · lo llevaste por teléfono'},
      {texto: 'Para mañana', estado: 'para-manana'},
      {texto: 'Ya está resuelto', estado: 'quitada', linea: 'Quitada · ya estaba resuelto'},
      {texto: 'No hace falta', estado: 'quitada', linea: 'Quitada · no hacía falta'},
      {texto: 'Veta se equivoca', paso: 'mal'}],
    mal: ['No es un cliente', 'El mensaje no suena a mí', 'No es urgente', 'Otra cosa'].map(t => ({texto: t, estado: 'quitada', linea: 'Anotado · lo tendré en cuenta', motivo: t})),
    espera: c => [{texto: 'Ya no aplica', estado: 'quitada', linea: 'Quitada · ya no aplica'}, {texto: '¿Qué pasó?', hoja: 'h15'}, c.cliente ? {texto: 'Ver la ficha', ir: 'cliente/' + c.cliente} : null].filter(Boolean)
  };
  const opcionesH02 = d => {
    const c = cosaDe(d.de); if (!c) return [];
    if (d.paso === 'mal') return OPC.mal;
    if (c.otraCosa) return c.otraCosa;
    if (c.tipo === 'espera') return OPC.espera(c);
    return OPC.normal;
  };
  VETA.hojaDef('h02', {
    titulo: d => { const c = cosaDe(d.de); return d.paso === 'mal' ? '¿Qué está mal?' : (c ? c.titulo : 'Otra cosa…'); },
    pinta: d => `<div class="ops">${opcionesH02(d).map((o, k) => `<button type="button" class="op" data-accion="elige" data-n="${k}"><span class="op-c"><span class="op-t">${esc(o.texto)}</span></span></button>`).join('')}</div>` +
      UI.boton({tipo: 'texto', texto: 'Cancelar', datos: {cierra: '1'}, clase: 'hoja-cancela'}),
    acciones: {
      elige(ev, el, d) {
        const o = opcionesH02(d)[Number(el.dataset.n)]; if (!o) return;
        if (o.paso) { VETA.hoja('h02', Object.assign({}, d, {paso: o.paso})); return; }
        if (o.hoja) { VETA.hoja(o.hoja, {de: d.de}); return; }
        VETA.cierraHoja({foco: false});
        if (o.ir) { VETA.ir(o.ir); return; }
        // «Lo llevo yo»: se asigna a quien mira (Montse: queda suyo y no llega al Hoy de Laura; Laura: pasa a su Hoy)
        if (o.llevoYo) {
          const c = cosaDe(d.de), yo = VETA.yo().id;
          if (VETA.dir && VETA.dir.asigna && c && c.cliente) VETA.dir.asigna(c.cliente, yo);
          else M.marca(d.de, yo === 'laura' ? 'hecha' : 'quitada', {a: yo, linea: (c ? c.titulo : '') + ' · lo llevas tú'});
          VETA.repinta({hecho: d.de}); return;
        }
        if (o.accion) { const b = document.querySelector(`[data-accion="${o.accion}"][data-de="${d.de}"]`); if (b) b.click(); return; }
        M.marca(d.de, o.estado, o.linea ? {linea: o.linea, motivo: o.motivo || o.texto} : {motivo: o.texto});
        VETA.repinta({hecho: d.de});
      }
    }
  });

  // ---- H17 · Foto ampliada ----  data-hoja="h17" data-piso="verdi" data-n="0"
  VETA.hojaDef('h17', {
    titulo: 'Foto ampliada',
    pinta: d => {
      const p = M.piso(d.piso) || {nombre: '', fotos: []}, n = Number(d.n) || 0;
      return UI.foto(d.piso, {tam: 'ancha', n}) +
        `<p class="hoja-x">${esc(p.nombre)}${p.datos ? ' · ' + esc(p.datos) : ''}</p>` +
        ((p.fotos || []).length > 1 ? `<div class="fotos-mini">${p.fotos.map((f, k) => `<button type="button" class="foto foto-mini con-foto" data-accion="otra" data-n="${k}" aria-pressed="${k === n}" aria-label="Foto ${k + 1}"><img src="assets/pisos/${esc(f)}.webp" alt=""><i class="foto-res">${VETA.ic('casa', 24)}</i></button>`).join('')}</div>` : '') +
        cerrar();
    },
    acciones: {otra(ev, el, d) { VETA.hoja('h17', Object.assign({}, d, {n: el.dataset.n})); }}
  });

  // ---- H26 · Aspecto ----
  VETA.hojaDef('h26', {
    titulo: 'Aspecto',
    pinta: () => `<p class="hoja-x">Elige cómo quieres ver Veta. Cambia al momento.</p>` +
      UI.selector({etiqueta: 'Modo', opciones: Object.keys(VETA.tema.MODOS).map(k => ({id: k, texto: VETA.tema.MODOS[k]})), valor: VETA.tema.modo(), accion: 'modo'}) +
      `<div class="paletas" role="group" aria-label="Paletas">${VETA.tema.COLORES.map(c => `<button type="button" class="paleta" data-accion="color" data-color="${c}" aria-pressed="${c === VETA.tema.color()}">` +
        `<span class="muestra" data-color="${c}" data-modo="${document.documentElement.dataset.modo}"><i></i><i></i><i></i></span><span>${esc(VETA.tema.NOMBRES[c])}</span></button>`).join('')}</div>` +
      UI.interruptor({texto: 'Reducir movimiento', sub: 'Sin desplazamientos ni cifras que ruedan', on: VETA.tema.reducido(), accion: 'mov'}) +
      UI.boton({texto: 'Listo', datos: {cierra: '1'}}),
    acciones: {
      modo(ev, el) { VETA.tema.pon({modo: el.dataset.valor}); VETA.hoja('h26', {}); },
      color(ev, el) { VETA.tema.pon({color: el.dataset.color}); VETA.hoja('h26', {}); },
      mov(ev, el) { VETA.tema.pon({mov: el.getAttribute('aria-checked') === 'true' ? 'reducido' : 'normal'}); }
    }
  });

  // ---- H29 · Texto legal ----  data-hoja="h29" data-texto="acuerdo | resumen | borrado | ver | leido | consentimientos"
  VETA.hojaTexto('h29', {
    titulo: d => ((VETA.datos.textos || {})[d.texto] || {}).titulo || 'Texto legal',
    bloques: d => ((VETA.datos.textos || {})[d.texto] || {bloques: [{texto: 'Este texto no existe todavía.'}]}).bloques
  });

  // ---- H41 · Texto de un parte ----  data-hoja="h41" data-parte="1930 | socios"
  VETA.hojaTexto('h41', {
    titulo: d => ((VETA.datos.partes || {})[d.parte] || {}).titulo || 'Parte',
    bloques: d => ((VETA.datos.partes || {})[d.parte] || {bloques: [{texto: 'Este parte no existe todavía.'}]}).bloques
  });

  // ---- acciones de la tarjeta de la cola (data-de = id de la cosa) ----
  const hecho = id => VETA.repinta({hecho: id});
  const de = el => el.dataset.de;
  // «principal»: si la cosa trae «El mensaje ha cambiado» (Jordi), la primera vez cambia el borrador en vez de enviarlo; vale en Hoy, A2 y la ficha
  VETA.accionGlobal('principal', (ev, el) => {
    const c = M.cosa(de(el)); if (!c) return;
    if (c.cambio && !(c.extra || {}).cambiado) { M.marca(c.id, 'por-hacer', {cambiado: true, aviso: c.cambio.aviso, borradorHtml: c.cambio.borradorHtml}); hecho(c.id); return; }
    M.marca(c.id, c.sale ? 'pregunta-envio' : 'hecha'); hecho(c.id);
  });
  VETA.accionGlobal('si-enviado', (ev, el) => { M.marca(de(el), 'enviada'); hecho(de(el)); });
  VETA.accionGlobal('ya-lo-envie', (ev, el) => { M.marca(de(el), 'enviada'); hecho(de(el)); });
  VETA.accionGlobal('todavia-no', (ev, el) => { M.deshaz(de(el)); hecho(de(el)); });
  VETA.accionGlobal('no-lo-envie', (ev, el) => { M.deshaz(de(el)); hecho(de(el)); });
  VETA.accionGlobal('deshacer', (ev, el) => { M.deshaz(de(el)); hecho(de(el)); });
  VETA.accionGlobal('quitar', (ev, el) => { M.marca(de(el), 'quitada'); hecho(de(el)); });
  VETA.accionGlobal('se-cumplio', (ev, el) => { M.marca(de(el), 'hecha', {linea: 'Se cumplió · ' + (M.cosa(de(el)) || {}).titulo}); hecho(de(el)); });
  VETA.accionGlobal('asignar', (ev, el) => { M.marca(de(el), 'hecha'); hecho(de(el)); });
  VETA.accionGlobal('pedir-marc', (ev, el) => { M.marca(de(el), 'hecha'); hecho(de(el)); });
  VETA.accionGlobal('llamar', () => VETA.aviso('En esta demo no se marca ningún teléfono.'));
  VETA.accionGlobal('reintentar', () => VETA.repinta());
  // copiar de verdad al portapapeles (regla de las 24 h)
  VETA.copia = texto => {
    const reserva = () => { try { const t = document.createElement('textarea'); t.value = texto; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); } catch (e) {} };
    try { if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).catch(reserva); else reserva(); } catch (e) { reserva(); }
  };
  VETA.accionGlobal('copiar', (ev, el) => {
    const c = M.cosa(de(el)); if (!c) return;
    VETA.copia(String((c.extra && c.extra.borrador) || c.borrador || '').replace(/<[^>]+>/g, ''));
    VETA.aviso('Texto copiado. Envíalo desde tu WhatsApp.');
    M.marca(c.id, 'por-hacer', {copiado: true, boton: {texto: 'Ya lo envié', accion: 'ya-lo-envie'}, secundarios: [{texto: 'Copiar otra vez', accion: 'copiar'}]});
    VETA.repinta();
  });
})();
