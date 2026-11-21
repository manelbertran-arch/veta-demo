/* Veta demo · hojas · veta.js · paquete C (Veta, cuenta y entrada)
   H18 Un caso · H19 Los casos como yo · H20 Otra cosa… de la regla · H21 Cómo la he entendido · H22 Subir un nivel ·
   H23 Una práctica · H24 Tus tiempos · H25 Una semana anterior · H28 Sin señal · H30 ¿Qué chat borras? ·
   H31 Poner Veta en la pantalla de inicio · H32 Un hallazgo del mapa · H33 Calendario.
   Y cuatro hojas propias de C: c-lista (tu lista de cada día), c-mano (lo que aún haces a mano), c-avisos, c-anadir (añadir un chat a la lista).
   Datos que reciben (data-* del botón): h18 regla, caso · h19 regla · h20 de (regla) · h22 de (regla) · h23 practica ·
   h25 semana (26-oct | 2-nov | 9-nov | 16-nov; sin ella, elige) · h30 de (nombre ya borrado: enseña su recibo) · h32 hallazgo. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const D = () => VETA.datos.c;
  const cerrar = (t, tipo) => UI.boton({tipo: tipo || 'texto', texto: t || 'Cerrar', datos: {cierra: '1'}, clase: 'hoja-cancela'});
  const citaQuieta = (texto, origen) => `<blockquote class="cita c-cita-quieta"><span class="cita-t">«${esc(texto)}»</span><span class="cita-o">${esc(origen)}</span></blockquote>`;
  const nombre = id => (M.quien(id) || {}).nombre || id;
  const repintaSiVe = rutaEmpieza => { const a = VETA.actual(); if (a && a.ruta.indexOf(rutaEmpieza) === 0) VETA.repinta(); };

  // ---- H18 · Un caso ----
  const caso = d => {
    if (d.regla === 'r-cancelaciones') return {tipo: 'prueba', x: D().aPrueba.find(c => c.id === d.caso)};
    const r = M.regla(d.regla), c = r && r.casos && r.casos.distinto && r.casos.distinto.find(y => y.cliente === d.caso);
    return {tipo: 'distinto', x: c, extra: D().distinto[d.caso] || {}};
  };
  VETA.hojaDef('h18', {
    titulo: d => { const k = caso(d); return k.x ? `${k.x.nombre} · ${k.x.cuando}` : 'Un caso'; },
    pinta: d => {
      const k = caso(d); if (!k.x) return `<p class="hoja-x">Este caso ya no está.</p>` + cerrar(null, 'secundario');
      if (k.tipo === 'prueba') return citaQuieta(k.x.cita, k.x.origen) + `<p class="hoja-x">${esc(k.x.propone)}. Este es el mensaje que te habría dejado:</p>` +
        UI.borrador({texto: k.x.borrador}) + UI.nota({texto: 'No lo envié: la regla está a prueba.', icono: 'candado', caja: true}) + cerrar(null, 'secundario');
      const corto = k.x.nombre.split(' ')[0], ya = C.excepciones(d.regla).includes(d.caso);
      return citaQuieta(k.x.texto, k.extra.origen || '') + `<p class="hoja-x">${esc(k.extra.habria || '')}</p>` +
        (ya ? UI.nota({texto: `Con ${corto} ya no lo hago.`, icono: 'check', caja: true}) + cerrar(null, 'secundario')
          : UI.boton({texto: `Con ${corto}, no lo hagas`, accion: 'excepcion'}) + cerrar());
    },
    acciones: {
      excepcion(ev, el, d) {
        C.ponExcepcion(d.regla, d.caso); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`Excepción: con ${nombre(d.caso)} no`, {deshacer: () => { C.quitaExcepcion(d.regla, d.caso); VETA.repinta(); }});
      }
    }
  });

  // ---- H19 · Los casos como yo ----
  VETA.hojaDef('h19', {
    titulo: d => (d.regla === 'r-recordatorios' ? 'Los 6 casos' : 'Los 11 casos como yo'),
    pinta: d => {
      const r = M.regla(d.regla) || {}, l = d.regla === 'r-recordatorios' ? (r.casos || []) : ((r.casos || {}).comoYo || []);
      const txt = d.regla === 'r-recordatorios' ? 'Un comprador tardó más de tres días en contestarte. Te habría preparado el recordatorio.' : 'Alguien pidió una valoración y al día siguiente le enviaste el dossier, como lo habría hecho yo.';
      return `<p class="hoja-x">${esc(txt)}</p><div class="lista c-hoja-lista">${l.map(c => UI.fila({titulo: c.nombre, derecha: c.cuando, icono: 'check'})).join('')}</div>` + cerrar(null, 'secundario');
    }
  });

  // ---- H20 · Otra cosa… (de una regla) ----
  VETA.hojaDef('h20', {
    titulo: d => (d.paso === 'cliente' ? 'No con un cliente…' : C.info(d.de).nombre),
    pinta: d => {
      if (d.paso === 'cliente') {
        const ex = C.excepciones(d.de);
        return `<p class="hoja-x">Con quien elijas, no lo haré.</p><div class="ops">${M.clientes(VETA.yo().id).filter(c => !ex.includes(c.id)).map(c =>
          `<button type="button" class="op" data-accion="cliente" data-c="${esc(c.id)}">${VETA.av(c.id, 40)}<span class="op-c"><span class="op-t">${esc(c.nombre)}</span></span></button>`).join('')}</div>` + cerrar('Cancelar');
      }
      const r = M.regla(d.de) || {}, activa = r.estado === 'activa', ofi = C.lee('aOficina', {})[d.de];
      const ops = [
        r.estado === 'a-prueba' ? ['Activarla ya, sin esperar al 7 dic', 'activar', 'check'] : null,
        [activa ? 'Dejar de hacerlo' : 'Descartarla', 'descartar', 'borrar', true],
        ['Decirlo de otra forma', 'otra-forma', 'mic'],
        ['No con un cliente…', 'no-cliente', 'usuario'],
        ['Cambiar hasta dónde llega', 'nivel', 'escalera'],
        ofi ? null : ['Proponerla a la oficina', 'oficina', 'equipo', false, 'Montse la verá con tu nombre y decidirá si la prueba toda la oficina.']
      ].filter(Boolean);
      return `<div class="ops">${ops.map(([t, a, ic, pel, sub]) => `<button type="button" class="op${pel ? ' op-peligro' : ''}" data-accion="${a}">${VETA.ic(ic, 22)}<span class="op-c"><span class="op-t">${esc(t)}</span>${sub ? `<span class="op-s">${esc(sub)}</span>` : ''}</span></button>`).join('')}</div>` + cerrar('Cancelar');
    },
    acciones: {
      activar(ev, el, d) { VETA.cierraHoja({foco: false}); C.cambiaRegla(d.de, 'activa', 'Activa · Te lo prepararé en Hoy'); },
      descartar(ev, el, d) {
        const activa = (M.regla(d.de) || {}).estado === 'activa';
        VETA.cierraHoja({foco: false}); C.cambiaRegla(d.de, 'descartada', activa ? 'Ya no lo hago · lo dejé de hacer hoy' : 'Descartada · no volveré a proponerla');
      },
      'otra-forma'() { VETA.cierraHoja({foco: false}); VETA.ir('dictar/orden'); },
      'no-cliente'(ev, el, d) { VETA.hoja('h20', Object.assign({}, d, {paso: 'cliente'})); },
      cliente(ev, el, d) {
        const c = el.dataset.c; C.ponExcepcion(d.de, c); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`Excepción: con ${nombre(c)} no`, {deshacer: () => { C.quitaExcepcion(d.de, c); VETA.repinta(); }});
      },
      nivel(ev, el, d) { VETA.cierraHoja({foco: false}); VETA.ir('regla/' + d.de + '/nivel'); },
      oficina(ev, el, d) {
        const o = C.lee('aOficina', {}); o[d.de] = VETA.ahora(); C.pon('aOficina', o); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('Propuesta a la oficina, con tu nombre', {deshacer: () => { const x = C.lee('aOficina', {}); delete x[d.de]; C.pon('aOficina', x); VETA.repinta(); }});
      }
    }
  });

  // ---- H21 · Cómo la he entendido, por partes ----
  VETA.hojaDef('h21', {
    titulo: 'Cómo la he entendido, por partes',
    pinta: () => `<div class="c-partes-h">${D().orden.partes.map(x => `<div class="c-parte-h"><div class="c-parte-h-c"><p class="c-parte-h-t">${esc(x.titulo)}</p><p class="c-parte-h-x">${esc(x.texto)}</p></div>` +
      UI.boton({tipo: 'texto', texto: 'Cambiar', accion: 'cambiar', ancho: false, datos: {parte: x.id}}) + '</div>').join('')}</div>` + cerrar(null, 'secundario'),
    acciones: {
      cambiar(ev, el) { VETA.cierraHoja({foco: false}); VETA.ir(el.dataset.parte === 'llega' ? 'regla/r-recordatorios/nivel' : 'dictar/orden'); }
    }
  });

  // ---- H22 · Subir un nivel (dirección) ----
  VETA.hojaDef('h22', {
    titulo: 'Subir un nivel',
    pinta: d => `<div class="hoja-texto"><section class="ht-b"><h3 class="ht-t">Para quién</h3><p>Para todo el equipo.</p></section>` +
      `<section class="ht-b"><h3 class="ht-t">Qué cambia</h3><p>«${esc(C.info(d.de).nombre)}» pasa de «Prepara» a «Hace lo de dentro»: apunta, marca y guarda sola. No envía nada.</p></section></div>` +
      UI.boton({texto: 'Subir un nivel', accion: 'subir'}) + cerrar('Cancelar'),
    acciones: {
      subir(ev, el, d) {
        const antes = C.nivel(d.de); C.ponNivel(d.de, 3);
        C.pon('nivelLinea', {id: d.de, texto: 'Nivel subido', hora: VETA.ahora(), subido: antes});
        VETA.cierraHoja({foco: false}); VETA.repinta({hecho: 'c-nivel'});
      }
    }
  });

  // ---- H23 · Una práctica de la oficina ----
  const SIGUE = {propuesta: {texto: 'Ponerla a prueba', estado: 'a-prueba', estadoTexto: 'A prueba · día 1 de 14', aviso: 'A prueba dos semanas'},
    'a-prueba': {texto: 'Extenderla a todo el equipo', estado: 'en-marcha', estadoTexto: 'En marcha', aviso: 'Extendida a todo el equipo'}};
  VETA.hojaDef('h23', {
    titulo: d => (C.practicas().find(x => x.id === d.practica) || {}).titulo || 'Una práctica',
    pinta: d => {
      const x = C.practicas().find(y => y.id === d.practica);
      if (!x) return `<p class="hoja-x">Esta práctica ya no está.</p>` + cerrar(null, 'secundario');
      const dir = VETA.yo().papel === 'direccion', s = SIGUE[x.estado];
      return `<div>${UI.etiqueta(x.estado, x.estadoTexto)}</div>` + `<div class="lista c-hoja-lista">` +
        UI.fila({titulo: 'Quién la propuso', sub: x.propuso, icono: 'usuario'}) + UI.fila({titulo: 'Cuánta gente la usa', sub: x.usan, icono: 'equipo'}) +
        UI.fila({titulo: 'De qué caso nació', sub: x.caso, icono: 'libro'}) + `</div>` +
        (dir && s ? UI.boton({texto: s.texto, accion: 'sigue'}) + cerrar('Cancelar')
          : UI.nota({texto: dir ? 'Ya la usa todo el equipo.' : 'Lo decide dirección. Tú la ves aquí para saber cómo trabaja la oficina.', icono: 'info', clase: 'nota-gris'}) + cerrar(null, 'secundario'));
    },
    acciones: {
      sigue(ev, el, d) {
        const x = C.practicas().find(y => y.id === d.practica), s = x && SIGUE[x.estado]; if (!s) return;
        const todo = C.lee('practica', {}), antes = todo[x.id];
        todo[x.id] = {estado: s.estado, estadoTexto: s.estadoTexto, usan: s.estado === 'en-marcha' ? 'la usa todo el equipo' : 'a prueba con todo el equipo'};
        C.pon('practica', todo); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(s.aviso, {deshacer: () => { const t = C.lee('practica', {}); if (antes) t[x.id] = antes; else delete t[x.id]; C.pon('practica', t); VETA.repinta(); }});
      }
    }
  });

  // ---- H24 · Tus tiempos ----
  let borrador = null;
  VETA.hojaDef('h24', {
    titulo: 'Tus tiempos',
    pinta: () => {
      const t = borrador || M.lee('tiempos', null) || {};
      return `<p class="hoja-x">Veta no inventa horas. Dime cuánto tardas tú.</p><div class="c-tiempos">${D().tiempos.map(x => {
        const v = t[x.id] != null ? t[x.id] : x.min;
        return `<div class="c-tmp"><span class="c-tmp-n">${esc(x.texto)}</span><div class="c-paso">` +
          UI.boton({tipo: 'redondo', texto: 'Un minuto menos', icono: 'menos', accion: 'menos', datos: {t: x.id}}) +
          `<b class="c-paso-v" id="c-t-${x.id}">${v} min</b>` + UI.boton({tipo: 'redondo', texto: 'Un minuto más', icono: 'mas', accion: 'mas', datos: {t: x.id}}) + `</div></div>`;
      }).join('')}</div>` + UI.boton({texto: 'Guardar mis tiempos', accion: 'guardar'}) + cerrar('Cancelar');
    },
    alMontar: () => { if (!borrador) { const t = M.lee('tiempos', null); borrador = {}; D().tiempos.forEach(x => { borrador[x.id] = t && t[x.id] != null ? t[x.id] : x.min; }); } },
    alCerrar: () => { borrador = null; },
    acciones: {
      menos(ev, el) { cambia(el.dataset.t, -1); }, mas(ev, el) { cambia(el.dataset.t, 1); },
      guardar() {
        const t = Object.assign({}, borrador); borrador = null;
        M.pon('tiempos', t); VETA.cierraHoja({foco: false}); if (C.ruedaHoras) C.ruedaHoras(); VETA.repinta();
        VETA.aviso('Tiempos guardados', {deshacer: () => { M.deshazFlag('tiempos'); VETA.repinta(); }});
      }
    }
  });
  function cambia(id, d) {
    borrador[id] = Math.max(1, Math.min(60, (borrador[id] || 1) + d));
    const b = document.getElementById('c-t-' + id); if (b) { b.dataset.rueda = b.dataset.rueda || b.textContent; VETA.rueda(b, borrador[id] + ' min'); }
  }

  // ---- H25 · Una semana anterior ----
  VETA.hojaDef('h25', {
    titulo: d => { const s = D().semanas.find(x => x.id === d.semana); return s ? s.texto : 'Semanas anteriores'; },
    pinta: d => {
      const s = D().semanas.find(x => x.id === d.semana);
      if (!s) return `<div class="ops">${D().semanas.slice().reverse().map(x => `<button type="button" class="op" data-hoja="h25" data-semana="${x.id}">${VETA.ic('cal', 22)}<span class="op-c"><span class="op-t">${esc(x.texto)}</span><span class="op-s">${VETA.yo().papel === 'direccion' ? '' : x.mensajes + ' mensajes preparados · '}${x.preparados} listos en la oficina</span></span></button>`).join('')}</div>` + cerrar();
      // dirección: solo la cifra de la oficina (los mensajes y actas de la semana son de Laura)
      const dir = VETA.yo().papel === 'direccion';
      return `<div class="lista c-hoja-lista">${dir ? '' : UI.fila({titulo: 'Mensajes que te preparé', sub: `Enviaste ${s.enviados}`, derecha: String(s.mensajes), icono: 'chat'}) +
        UI.fila({titulo: 'Actas guardadas', derecha: String(s.actas), icono: 'doc'})}` + UI.fila({titulo: 'Mensajes y tareas listos en la oficina', derecha: VETA.num(s.preparados), icono: 'equipo'}) + `</div>` +
        UI.nota({texto: 'Sin horas: salen solo de los tiempos que pone cada persona.', icono: 'info', clase: 'nota-gris'}) +
        UI.boton({tipo: 'secundario', texto: 'Otras semanas', hoja: 'h25'}) + cerrar();
    }
  });

  // ---- H28 · Sin señal ----
  VETA.hojaTexto('h28', {
    titulo: 'Sin señal',
    bloques: () => [{texto: 'Sigues viendo tus clientes y sus fichas.'}, {html: UI.nota({texto: 'En cola: 2 dictados · 1 respuesta.', icono: 'reloj', caja: true})},
      {texto: 'Salen cuando vuelva la señal. Cada mensaje sigue necesitando tu aprobación.'}]
  });

  // ---- H30 · ¿Qué chat borras? y Recibo de borrado ----
  VETA.hojaDef('h30', {
    titulo: d => (d.de ? 'Recibo de borrado' : '¿Qué chat borras?'),
    pinta: d => {
      if (d.de) return `<div class="c-recibo"><p class="c-recibo-t">${VETA.ic('sello', 22)}<b>${esc(d.de)}</b></p>` +
        `<p>1 conversación · pedido hoy · borrado completo antes del jueves 26</p></div>` + UI.nota({texto: 'Lo que ya estaba en la ficha de un cliente se queda en la ficha.', icono: 'info', clase: 'nota-gris'}) + cerrar(null, 'secundario');
      const ya = C.lee('borrados', []).map(b => b.nombre);
      const chats = M.lectura().fuera.concat(M.clientes(VETA.yo().id).slice(0, 6).map(c => c.nombre)).filter(n => !ya.includes(n));
      return `<p class="hoja-x">Desaparece en 72 h y recibes un recibo.</p><div class="ops">${chats.map(n => `<button type="button" class="op op-peligro" data-accion="borra" data-n="${esc(n)}">${VETA.ic('borrar', 22)}<span class="op-c"><span class="op-t">${esc(n)}</span></span></button>`).join('')}</div>` + cerrar('Cancelar');
    },
    acciones: {
      borra(ev, el) { const n = el.dataset.n; C.pon('borrados', C.lee('borrados', []).concat([{nombre: n, hora: VETA.ahora()}])); VETA.hoja('h30', {de: n}); repintaSiVe('cuenta/chats'); }
    }
  });

  // ---- H31 · Poner Veta en la pantalla de inicio ----
  // Son instrucciones, no botones: pasos numerados sin marco. Lo único tocable hace algo («Copiar la dirección», «Cerrar»).
  // C.inicio(): 'hecho' (ya abierta desde el icono) · 'ios-safari' · 'ios-otro' (navegador de dentro de otra app, Chrome…) · 'android' · 'ordenador'
  C.inicio = () => {
    try { if (navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches)) return 'hecho'; } catch (e) {}
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (ios) return /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|DuckDuckGo|FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Line\/|Twitter|WhatsApp|Telegram|Snapchat|Pinterest/.test(ua) ? 'ios-safari' : 'ios-otro';
    return /Android/.test(ua) ? 'android' : 'ordenador';
  };
  const compartir = `<span class="c-paso-ic" aria-label="Compartir">${VETA.ic('compartir', 20)}</span>`;
  const pasosH = l => `<ol class="c-pasos-h">${l.map((t, k) => `<li><span class="c-paso-n" aria-hidden="true">${k + 1}</span><span class="c-paso-t">${t}</span></li>`).join('')}</ol>`;
  const copiarDir = UI.boton({tipo: 'secundario', texto: 'Copiar la dirección', icono: 'copiar', accion: 'copia-dir'});
  VETA.hojaDef('h31', {
    titulo: () => C.inicio() === 'hecho' ? 'Veta ya está en tu pantalla de inicio' : 'Poner Veta en la pantalla de inicio',
    pinta: () => {
      const v = C.inicio();
      if (v === 'hecho') return `<p class="hoja-x">Ya está hecho: has abierto Veta desde su icono, a pantalla completa.</p>` + cerrar(null, 'secundario');
      const gana = `<p class="hoja-x">Tendrás el icono de Veta en tu móvil y se abrirá a pantalla completa, sin la barra del navegador.</p>`;
      if (v === 'ios-safari') return gana + pasosH([`Toca Compartir ${compartir} en la barra de Safari. Si no lo ves, toca antes «···».`,
        'Baja en la lista y toca «Añadir a pantalla de inicio».', 'Toca «Añadir». El icono de Veta aparece en tu pantalla de inicio.']) + cerrar(null, 'secundario');
      if (v === 'android') return gana + pasosH(['Toca el menú ⋮ de Chrome, arriba a la derecha.', 'Toca «Añadir a pantalla de inicio» y luego «Añadir».']) +
        `<p class="hoja-x tenue">¿No ves ese menú? Abre esta dirección en Chrome.</p>` + copiarDir + cerrar();
      const donde = v === 'ordenador' ? 'Abre esta dirección en Safari, en tu iPhone.' : 'Abre esta dirección en Safari. Desde aquí no se puede: es el navegador de otra app.';
      return gana + pasosH([esc(donde), `En Safari, toca Compartir ${compartir}.`, 'Toca «Añadir a pantalla de inicio» y luego «Añadir».']) + copiarDir + cerrar();
    },
    acciones: {
      'copia-dir'() { VETA.copia(location.href.split('#')[0]); VETA.aviso('Dirección copiada. Pégala en Safari.'); }
    }
  });

  // ---- H32 · Un hallazgo del mapa ----
  VETA.hojaDef('h32', {
    titulo: d => (C.hallazgo(d.hallazgo) || {}).titulo || 'Un hallazgo',
    pinta: d => {
      const f = C.hallazgo(d.hallazgo); if (!f) return cerrar(null, 'secundario');
      return `<p class="hoja-x">${esc(f.texto)}</p>` + (f.citas || []).map(c => citaQuieta(c.texto, c.origen)).join('') +
        (f.boton ? UI.boton(f.boton) + cerrar() : cerrar(null, 'secundario'));
    }
  });

  // ---- H33 · Calendario ----
  VETA.hojaElegir('h33', {
    titulo: 'Calendario', texto: 'Leo tus citas; no las cambio.',
    opciones: () => D().calendarios.map(c => ({id: c, texto: c})),
    valor: () => C.calendario(),
    alElegir: op => {
      const antes = C.calendario(); C.pon('calendario', op.id); VETA.repinta();
      VETA.aviso('Calendario conectado: ' + op.id, {deshacer: () => { C.pon('calendario', antes); VETA.repinta(); }});
    }
  });

  // ---- c-lista · Tu lista de cada día (A14) ----
  VETA.hojaDef('c-lista', {
    titulo: 'Tu lista de cada día',
    pinta: () => {
      const l = D().lista, max = l.antes;
      return `<p class="hoja-x">Tarjetas en tu Hoy, por semana. Menos tarjetas: lo demás ya lo llevo yo.</p><div class="c-barras">` +
        [['Al empezar', l.antes]].concat(l.semanas).map(([t, n], k) => `<div class="c-barra" style="--v:${n / max};--k:${k}"><span class="c-barra-n">${esc(t)}</span><span class="c-barra-t" aria-hidden="true"><i></i></span><b class="c-barra-v">${n}</b></div>`).join('') +
        `</div>` + cerrar(null, 'secundario');
    }
  });

  // ---- c-mano · Lo que aún haces a mano (A14) ----
  VETA.hojaDef('c-mano', {
    titulo: 'Lo que aún haces a mano',
    pinta: () => `<p class="hoja-x">Trabajos que se repiten en tus chats y que todavía haces tú.</p><div class="lista c-hoja-lista">` +
      D().aMano.map(([t, n]) => UI.fila({titulo: t, derecha: n + ' veces', icono: 'mano'})).join('') + `</div>` +
      UI.boton({texto: 'Ver el primero', ir: 'regla/r-valoraciones'}) + cerrar()
  });

  // ---- c-avisos · Avisos (A15) ----
  VETA.hojaDef('c-avisos', {
    titulo: 'Avisos',
    pinta: () => {
      const av = C.lee('avisos', false);
      return `<p class="hoja-x">Te aviso solo de lo que no puede esperar.</p>` +
        (av ? UI.lineaHecho({texto: 'Avisos permitidos', hora: av, boton: {texto: 'Deshacer', accion: 'quita'}}) : UI.boton({texto: 'Permitir avisos', icono: 'campana', accion: 'permite'})) +
        `<div class="lista">${UI.interruptor({texto: 'Recibir el parte por correo a las 19:30', sub: 'El resumen del día, en tu correo', on: C.lee('parteCorreo', false), accion: 'parte'})}</div>` + cerrar(null, 'secundario');
    },
    acciones: {
      permite() { C.pon('avisos', VETA.ahora()); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      quita() { C.pon('avisos', false); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      parte(ev, el) { C.pon('parteCorreo', el.getAttribute('aria-checked') === 'true'); }
    }
  });

  // ---- c-anadir · Añadir un chat a la lista (A15b) ----
  VETA.hojaDef('c-anadir', {
    titulo: 'Añadir un chat a esta lista',
    pinta: () => `<p class="hoja-x">Veta deja de leerlo y desaparece de Hoy y de Clientes.</p><div class="ops">${M.clientes(VETA.yo().id).map(c =>
      `<button type="button" class="op" data-accion="fuera" data-c="${esc(c.id)}">${VETA.av(c.id, 40)}<span class="op-c"><span class="op-t">${esc(c.nombre)}</span>${c.quienEs ? `<span class="op-s">${esc(c.quienEs)}</span>` : ''}</span></button>`).join('')}</div>` + cerrar('Cancelar'),
    acciones: {
      fuera(ev, el) {
        const id = el.dataset.c; M.pon('chats-fuera', M.lee('chats-fuera', []).concat(id)); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`${nombre(id)} queda fuera. Veta no lo lee.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }});
      }
    }
  });
})();
