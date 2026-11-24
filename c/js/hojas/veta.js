/* Veta demo · hojas · veta.js · carril C (Veta y cuenta)
   Todas salen de las tres plantillas (acciones, texto, elegir), salvo las que llevan campos (h24, c-avisos) y las instrucciones de h31;
   ninguna lleva iconos a la izquierda.
   De siempre: h18 Un caso · h19 Los casos iguales · h20 Cambiar algo (de un trabajo) · h21 Qué he entendido · h22 Subir un paso ·
   h23 Una práctica · h24 Tus tiempos · h25 Una semana anterior · h28 Sin señal · h30 ¿Qué chat borras? · h31 Poner Veta en la pantalla
   de inicio · h32 Un hallazgo del mapa · h33 Calendario · c-mano (lo que aún haces a mano) · c-avisos · c-anadir (añadir un chat).
   Ronda 8 (lo que antes se desplegaba en la fila, ahora en una hoja): c-lee (un texto corto, según `que`) · c-veces (los casos de un
   trabajo) · c-excepto (no con un cliente) · c-nohago (lo que ya no hago) · c-cerre (lo que cerré sola) · c-aprendido (una cosa
   aprendida) · c-chat (un chat que no leo) · c-confirma (desconectar WhatsApp, volver a empezar).
   Datos que reciben (data-* del botón): h18 regla, caso · h19 regla · h20 de (regla) · h22 de (regla) · h23 practica ·
   h25 semana (26-oct | 2-nov | 9-nov | 16-nov; sin ella, elige) · h30 de (nombre ya borrado: enseña su recibo) · h32 hallazgo ·
   c-lee que (+ regla) · c-veces regla · c-excepto de · c-aprendido de · c-chat n | cliente · c-confirma que. */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, M = VETA.modelo, C = VETA.c;
  const D = () => VETA.datos.c, R7 = () => VETA.r7;
  const nombre = id => (M.quien(id) || {}).nombre || id;
  const repintaSiVe = rutaEmpieza => { const a = VETA.actual(); if (a && a.ruta.indexOf(rutaEmpieza) === 0) VETA.repinta(); };
  const mayus = t => String(t || '').replace(/^./, c => c.toUpperCase());
  // una cita: tarjeta con comillas y de dónde sale
  const cita = (texto, origen) => R7().tarjeta({de: origen, texto: `«${texto}»`});

  // ---- h18 · Un caso ----
  const caso = d => {
    if (d.regla === 'r-cancelaciones') return {tipo: 'prueba', x: D().aPrueba.find(c => c.id === d.caso)};
    const r = M.regla(d.regla), c = r && r.casos && r.casos.distinto && r.casos.distinto.find(y => y.cliente === d.caso);
    return {tipo: 'distinto', x: c, extra: D().distinto[d.caso] || {}};
  };
  const cortoDe = k => k.x.nombre.split(' ')[0], yaExcepto = d => C.excepciones(d.regla).includes(d.caso);
  VETA.hojaTexto('h18', {
    titulo: d => { const k = caso(d); return k.x ? `${k.x.nombre} · ${k.x.cuando}` : 'Un caso'; },
    bloques: d => {
      const k = caso(d); if (!k.x) return [{texto: 'Este caso ya no está.'}];
      if (k.tipo === 'prueba') return [{html: cita(k.x.cita, k.x.origen)}, {texto: `${k.x.propone}. Este es el mensaje que te habría dejado:`},
        {html: R7().tarjeta({veta: true, de: 'No lo envié: lo estoy probando', texto: k.x.borrador})}];
      return [{html: cita(k.x.texto, k.extra.origen || '')}, {texto: k.extra.habria || ''}, yaExcepto(d) ? {texto: `Con ${cortoDe(k)} ya no lo hago.`} : null];
    },
    boton: d => { const k = caso(d); return k.x && k.tipo !== 'prueba' && !yaExcepto(d) ? {texto: `Con ${cortoDe(k)}, no lo hagas`, accion: 'excepcion'} : null; },
    acciones: {
      excepcion(ev, el, d) {
        C.ponExcepcion(d.regla, d.caso); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso(`Excepción: con ${nombre(d.caso)} no`, {deshacer: () => { C.quitaExcepcion(d.regla, d.caso); VETA.repinta(); }});
      }
    }
  });

  // ---- h19 · Los casos iguales ----
  VETA.hojaTexto('h19', {
    titulo: d => (d.regla === 'r-recordatorios' ? 'Los 6 casos' : 'Las 11 veces iguales'),
    bloques: d => {
      const r = M.regla(d.regla) || {}, l = d.regla === 'r-recordatorios' ? (r.casos || []) : ((r.casos || {}).comoYo || []);
      return [{texto: d.regla === 'r-recordatorios' ? 'Un comprador tardó más de tres días en contestarte. Aquí habría tocado un recordatorio.' : 'Alguien pidió una valoración y al día siguiente le enviaste el informe del piso.'},
        {lista: l.map(c => `${c.nombre} · ${c.cuando}`)}];
    }
  });

  // ---- c-veces · Los casos de un trabajo: los iguales (h19) y, uno a uno, los distintos o los de la prueba (h18) ----
  VETA.hojaAcciones('c-veces', {
    titulo: d => (d.regla === 'r-cancelaciones' ? 'Lo que te habría propuesto' : `Las ${C.veces(M.regla(d.regla))} veces`),
    opciones: d => {
      if (d.regla === 'r-cancelaciones') return D().aPrueba.map(c => ({texto: `${c.nombre} · ${c.cuando}`, sub: c.propone, hoja: 'h18', datos: {caso: c.id}}));
      const r = M.regla(d.regla) || {}, k = r.casos || {}, ex = C.excepciones(d.regla);
      return [{texto: `${(k.comoYo || []).length} veces lo hiciste igual`, sub: 'Al día siguiente enviaste el informe', hoja: 'h19'}].concat((k.distinto || []).map(c =>
        ({texto: `${c.nombre} · ${c.cuando}`, sub: ((D().distinto[c.cliente] || {}).motivo || 'Lo hiciste distinto') + (ex.includes(c.cliente) ? ' · con él, no' : ''), hoja: 'h18', datos: {caso: c.cliente}})));
    }
  });

  // ---- h20 · Cambiar algo (de un trabajo) ----
  VETA.hojaAcciones('h20', {
    titulo: 'Cambiar algo',
    opciones: d => {
      const r = M.regla(d.de) || {}, activa = r.estado === 'activa', ofi = C.lee('aOficina', {})[d.de];
      return [
        r.estado === 'a-prueba' ? {texto: 'Que lo haga ya, sin esperar al 7 dic', hace: () => C.cambiaRegla(d.de, 'activa', 'Ya lo hago yo · te lo dejaré en Inicio')} : null,
        {texto: activa ? 'Dejar de hacerlo' : 'No lo quiero', peligro: true, hace: () => C.cambiaRegla(d.de, 'descartada', activa ? 'Ya no lo hago · lo dejé de hacer hoy' : 'Ya no lo hago · no te lo volveré a proponer')},
        {texto: 'Decirlo de otra forma', ir: 'dictar/orden'},
        {texto: 'No con un cliente', hoja: 'c-excepto'},
        ofi ? null : {texto: 'Proponérselo a la oficina', sub: 'Montse lo verá con tu nombre y decidirá si lo prueba toda la oficina.', hace: () => {
          const o = C.lee('aOficina', {}); o[d.de] = VETA.ahora(); C.pon('aOficina', o); VETA.repinta();
          VETA.aviso('Se lo he propuesto a la oficina, con tu nombre', {deshacer: () => { const x = C.lee('aOficina', {}); delete x[d.de]; C.pon('aOficina', x); VETA.repinta(); }});
        }}
      ].filter(Boolean);
    }
  });
  // ---- c-excepto · No con un cliente ----
  VETA.hojaAcciones('c-excepto', {
    titulo: 'No con un cliente', texto: 'Con quien elijas, no lo haré.',
    opciones: d => { const ex = C.excepciones(d.de); return M.clientes(VETA.yo().id).filter(c => !ex.includes(c.id)).map(c => ({cara: c.id, texto: c.nombre, hace: () => {
      C.ponExcepcion(d.de, c.id); VETA.repinta();
      VETA.aviso(`Excepción: con ${c.nombre} no`, {deshacer: () => { C.quitaExcepcion(d.de, c.id); VETA.repinta(); }});
    }})); }
  });

  // ---- h21 · Qué he entendido, por partes: tocar una es cambiarla ----
  VETA.hojaAcciones('h21', {
    titulo: 'Qué he entendido', texto: 'Toca una parte para cambiarla.',
    opciones: () => D().orden.partes.map(x => ({texto: x.titulo, sub: x.texto, ir: x.id === 'llega' ? 'regla/r-recordatorios/nivel' : 'dictar/orden'}))
  });

  // ---- h22 · Subir un paso (dirección) ----
  VETA.hojaTexto('h22', {
    titulo: 'Subir un paso',
    bloques: d => [{titulo: 'Para quién', texto: 'Para todo el equipo.'},
      {titulo: 'Qué cambia', texto: `«${C.nombre(d.de)}» pasa de «Te lo dejo escrito» a «Lo apunto yo»: apunto, marco y guardo yo. No envío nada.`}],
    boton: {texto: 'Sí, que suba un paso', accion: 'subir'},
    acciones: {
      subir(ev, el, d) {
        const antes = C.nivel(d.de); C.ponNivel(d.de, 3);
        C.pon('nivelLinea', {id: d.de, texto: 'Lo apunto yo · desde hoy', hora: VETA.ahora(), subido: antes});
        VETA.cierraHoja({foco: false}); VETA.repinta({hecho: 'c-nivel'});
      }
    }
  });

  // ---- h23 · Una práctica de la oficina ----
  const SIGUE = {propuesta: {texto: 'Probarlo dos semanas', estado: 'a-prueba', estadoTexto: 'Lo estamos probando · día 1 de 14', aviso: 'Lo probamos dos semanas'},
    'a-prueba': {texto: 'Extenderla a todo el equipo', estado: 'en-marcha', estadoTexto: 'En marcha', aviso: 'Extendida a todo el equipo'}};
  // el botón solo en las prácticas que se deciden aquí; las que tienen pantalla en dirección (C.conPantalla) se deciden en ella
  const sigueDe = x => (x && VETA.yo().papel === 'direccion' && !(C.conPantalla && C.conPantalla(x.id)) && SIGUE[x.estado]) || null;
  VETA.hojaTexto('h23', {
    titulo: d => { const x = C.practicas().find(y => y.id === d.practica) || {}; return x.corto || x.titulo || 'Una práctica'; },
    bloques: d => {
      const x = C.practicas().find(y => y.id === d.practica);
      if (!x) return [{texto: 'Esta práctica ya no está.'}];
      const dir = VETA.yo().papel === 'direccion';
      return [{titulo: 'Qué es', texto: x.titulo}, {titulo: 'Cómo va', texto: x.estadoTexto}, {titulo: 'Quién la propuso', texto: mayus(x.propuso)}, {titulo: 'Cuánta gente la usa', texto: mayus(x.usan)},
        {titulo: 'De qué caso nació', texto: x.caso}, sigueDe(x) ? null : !dir ? {texto: 'Lo decide dirección. Tú la ves aquí para saber cómo trabaja la oficina.'} : x.estado === 'en-marcha' && !SIGUE[x.estado] ? {texto: 'Ya la usa todo el equipo.'} : null];
    },
    boton: d => { const s = sigueDe(C.practicas().find(y => y.id === d.practica)); return s ? {texto: s.texto, accion: 'sigue'} : null; },
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

  // ---- h24 · Tus tiempos ----
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
      }).join('')}</div>` + UI.boton({texto: 'Guardar mis tiempos', accion: 'guardar'});
    },
    alMontar: () => { if (!borrador) { const t = M.lee('tiempos', null); borrador = {}; D().tiempos.forEach(x => { borrador[x.id] = t && t[x.id] != null ? t[x.id] : x.min; }); } },
    alCerrar: () => { borrador = null; },
    acciones: {
      menos(ev, el) { cambia(el.dataset.t, -1); }, mas(ev, el) { cambia(el.dataset.t, 1); },
      guardar() {
        const t = Object.assign({}, borrador); borrador = null;
        M.pon('tiempos', t); VETA.cierraHoja({foco: false}); VETA.repinta();
        VETA.aviso('Tiempos guardados', {deshacer: () => { M.deshazFlag('tiempos'); VETA.repinta(); }});
      }
    }
  });
  function cambia(id, d) {
    borrador[id] = Math.max(1, Math.min(60, (borrador[id] || 1) + d));
    const b = document.getElementById('c-t-' + id); if (b) { b.dataset.rueda = b.dataset.rueda || b.textContent; VETA.rueda(b, borrador[id] + ' min'); }
  }

  // ---- h25 · Una semana anterior ----
  // Sin semana elegida, la lista de semanas; con ella, sus cifras y el botón para ver otra. Dirección ve solo la cifra de la oficina
  // (los mensajes y actas de la semana son de la agente).
  const semanaDe = d => D().semanas.find(x => x.id === d.semana);
  VETA.hojaAcciones('h25', {
    titulo: d => { const s = semanaDe(d); return s ? s.texto : 'Semanas anteriores'; },
    bloques: d => {
      const s = semanaDe(d), dir = VETA.yo().papel === 'direccion'; if (!s) return null;
      return [dir ? null : {titulo: 'Mensajes que te dejé escritos', texto: `${s.mensajes} · enviaste ${s.enviados}`}, dir ? null : {titulo: 'Actas de visita guardadas', texto: String(s.actas)},
        {titulo: 'Mensajes y tareas listos en la oficina', texto: VETA.num(s.preparados)}, {texto: 'Sin horas: salen solo de los tiempos que pone cada persona.'}];
    },
    opciones: d => {
      const dir = VETA.yo().papel === 'direccion'; if (semanaDe(d)) return [];
      return D().semanas.slice().reverse().map(x => ({texto: x.texto, sub: `${dir ? '' : x.mensajes + ' mensajes preparados · '}${x.preparados} listos en la oficina`, hoja: 'h25', datos: {semana: x.id}}));
    },
    boton: d => (semanaDe(d) ? {tipo: 'secundario', texto: 'Otras semanas', hoja: 'h25'} : null)
  });

  // ---- h28 · Sin señal ----
  VETA.hojaTexto('h28', {
    titulo: 'Sin señal',
    bloques: () => [{texto: 'Sigues viendo tus clientes y sus fichas.'}, {texto: 'En cola: 2 cosas que me contaste · 1 respuesta.'},
      {texto: 'Salen cuando vuelva la señal. Cada mensaje sigue necesitando tu aprobación.'}]
  });

  // ---- h30 · ¿Qué chat borras? y recibo de borrado ----
  const borrables = () => { const ya = C.lee('borrados', []).map(b => b.nombre); return M.lectura().fuera.concat(M.clientes(VETA.yo().id).slice(0, 6).map(c => c.nombre)).filter(n => !ya.includes(n)); };
  VETA.hojaAcciones('h30', {
    titulo: d => (d.de ? 'Qué se ha borrado' : '¿Qué chat borras?'),
    texto: d => (d.de ? '' : 'Desaparece en 72 h y te digo qué se ha borrado.'),
    bloques: d => (d.de ? [{titulo: d.de, texto: '1 conversación · pedido hoy · borrado completo antes del jueves 26'}, {texto: 'Lo que ya estaba en la ficha de un cliente se queda en la ficha.'}] : null),
    opciones: d => (d.de ? [] : borrables().map(n => ({texto: n, peligro: true, cierra: false,
      hace: () => { C.pon('borrados', C.lee('borrados', []).concat([{nombre: n, hora: VETA.ahora()}])); VETA.hoja('h30', {de: n}); repintaSiVe('cuenta/chats'); }})))
  });

  // ---- h31 · Poner Veta en la pantalla de inicio ----
  // Son instrucciones, no botones: pasos numerados sin marco. Lo único tocable hace algo («Copiar la dirección»).
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
      if (v === 'hecho') return `<p class="hoja-x">Ya está hecho: has abierto Veta desde su icono, a pantalla completa.</p>`;
      const gana = `<p class="hoja-x">Tendrás el icono de Veta en tu móvil y se abrirá a pantalla completa, sin la barra del navegador.</p>`;
      if (v === 'ios-safari') return gana + pasosH([`Toca Compartir ${compartir} en la barra de Safari. Si no lo ves, toca antes «···».`,
        'Baja en la lista y toca «Añadir a pantalla de inicio».', 'Toca «Añadir». El icono de Veta aparece en tu pantalla de inicio.']);
      if (v === 'android') return gana + pasosH(['Toca el menú ⋮ de Chrome, arriba a la derecha.', 'Toca «Añadir a pantalla de inicio» y luego «Añadir».']) +
        `<p class="hoja-x tenue">¿No ves ese menú? Abre esta dirección en Chrome.</p>` + copiarDir;
      const donde = v === 'ordenador' ? 'Abre esta dirección en Safari, en tu iPhone.' : 'Abre esta dirección en Safari. Desde aquí no se puede: es el navegador de otra app.';
      return gana + pasosH([esc(donde), `En Safari, toca Compartir ${compartir}.`, 'Toca «Añadir a pantalla de inicio» y luego «Añadir».']) + copiarDir;
    },
    acciones: {
      'copia-dir'() { VETA.copia(location.href.split('#')[0]); VETA.aviso('Dirección copiada. Pégala en Safari.'); }
    }
  });

  // ---- h32 · Un hallazgo del mapa ----
  VETA.hojaTexto('h32', {
    titulo: d => (C.hallazgo(d.hallazgo) || {}).titulo || 'Un hallazgo',
    bloques: d => { const f = C.hallazgo(d.hallazgo); return f ? [{texto: f.texto}].concat((f.citas || []).map(c => ({html: cita(c.texto, c.origen)}))) : []; },
    boton: d => (C.hallazgo(d.hallazgo) || {}).boton || null
  });

  // ---- h33 · Calendario ----
  VETA.hojaElegir('h33', {
    titulo: 'Calendario', texto: 'Leo tus citas; no las cambio.',
    opciones: () => D().calendarios.map(c => ({id: c, texto: c})),
    valor: () => C.calendario(),
    alElegir: op => {
      const antes = C.calendario(); C.pon('calendario', op.id); VETA.repinta();
      VETA.aviso('Calendario conectado: ' + op.id, {deshacer: () => { C.pon('calendario', antes); VETA.repinta(); }});
    }
  });

  // ---- c-mano · Lo que aún haces a mano (A14) ----
  VETA.hojaTexto('c-mano', {
    titulo: 'Lo que aún haces a mano',
    bloques: () => [{texto: 'Trabajos que se repiten en tus chats y que todavía haces tú.'}, {lista: D().aMano.map(([t, n]) => `${t} · ${n} veces`)}],
    boton: {texto: 'Ver el primero', ir: 'regla/r-valoraciones'}
  });

  // ---- c-avisos · Avisos (A15) ----
  VETA.hojaDef('c-avisos', {
    titulo: 'Avisos',
    pinta: () => {
      const av = C.lee('avisos', false);
      return `<p class="hoja-x">Te aviso solo de lo que no puede esperar.</p>` +
        (av ? UI.lineaHecho({texto: 'Avisos permitidos', hora: av, boton: {texto: 'Deshacer', accion: 'quita'}}) : UI.boton({texto: 'Permitir avisos', accion: 'permite'})) +
        R7().lista([UI.interruptor({texto: 'Recibir el parte a las 19:30', on: C.lee('parteCorreo', false), accion: 'parte'})]);
    },
    acciones: {
      permite() { C.pon('avisos', VETA.ahora()); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      quita() { C.pon('avisos', false); VETA.hoja('c-avisos', {}); repintaSiVe('cuenta'); },
      parte(ev, el) { C.pon('parteCorreo', el.getAttribute('aria-checked') === 'true'); }
    }
  });

  // ---- c-anadir · Añadir un chat a la lista (A15b) ----
  VETA.hojaAcciones('c-anadir', {
    titulo: 'Añadir un chat', texto: 'Veta deja de leerlo y desaparece de Inicio y de Clientes.',
    opciones: () => M.clientes(VETA.yo().id).map(c => ({cara: c.id, texto: c.nombre, sub: c.quienEs || null, hace: () => {
      M.pon('chats-fuera', M.lee('chats-fuera', []).concat(c.id)); VETA.repinta();
      VETA.aviso(`${c.nombre} queda fuera. Veta no lo lee.`, {deshacer: () => { M.deshazFlag('chats-fuera'); VETA.repinta(); }});
    }}))
  });

  // ---- c-chat · Un chat de «Chats que no leo» (A15b): sacarlo de la lista o dejarlo fuera otra vez ----
  VETA.hojaAcciones('c-chat', {
    titulo: d => (C.chat(d) || {}).nombre || 'Un chat',
    texto: d => { const x = C.chat(d) || {}; return x.cliente ? 'Es un cliente. No lo leo desde hoy.' : x.leo ? 'Lo vuelvo a leer.' : 'No lo leo desde el 3 de septiembre.'; },
    opciones: d => [{texto: (C.chat(d) || {}).leo ? 'Dejar fuera otra vez' : 'Quitar de la lista: que lo lea', hace: () => C.cambiaChat(d)}]
  });

  // ---- c-confirma · Desconectar WhatsApp o volver a empezar (A15): se confirma aquí ----
  VETA.hojaAcciones('c-confirma', {
    titulo: d => (d.que === 'reinicio' ? '¿Volver a empezar?' : '¿Desconectar WhatsApp?'),
    texto: d => (d.que === 'reinicio' ? 'Se borra lo que has hecho en la demo.' : 'Veta dejará de leer tus chats.'),
    opciones: d => [d.que === 'reinicio' ? {texto: 'Volver a empezar', peligro: true, hace: () => C.reinicia()} : {texto: 'Desconectar', peligro: true, hace: () => C.desconecta()}]
  });

  // ---- c-nohago · Lo que ya no hago (Veta › Además) ----
  VETA.hojaAcciones('c-nohago', {
    titulo: 'Lo que ya no hago', texto: 'Me dijiste que no. Toca uno si cambias de idea.',
    opciones: () => C.noHago().map(r => ({texto: C.corto(r.id), ir: 'regla/' + r.id}))
  });

  // ---- c-cerre · Lo que cerré yo sola (Tu semana): tocar una es abrirla otra vez (misma clave que el Inicio: a.r6.abiertas) ----
  VETA.hojaAcciones('c-cerre', {
    titulo: 'Lo que cerré yo sola', texto: 'Lo di por hecho sin preguntarte. Toca una y la abro otra vez.',
    opciones: () => C.cerradas().map(x => ({texto: x.titulo, sub: x.texto, hace: () => {
      const ab = VETA.est.lee('a.r6.abiertas', []) || []; if (!ab.includes(x.id)) ab.push(x.id);
      VETA.est.pon('a.r6.abiertas', ab); VETA.repinta(); VETA.pintaBarra(); VETA.aviso('Vale. Está en Inicio.');
    }}))
  });

  // ---- c-aprendido · Una cosa aprendida (A13): pararla un tiempo u olvidarla ----
  VETA.hojaAcciones('c-aprendido', {
    titulo: d => (C.aprendido(d.de) || {}).corto || 'Lo aprendido',
    opciones: d => { const x = C.aprendido(d.de); return x ? [{texto: x.on ? 'Pararlo un tiempo' : 'Volver a usarlo', hace: () => C.usaAprendido(d.de)}, {texto: 'Olvidarlo', peligro: true, hace: () => C.olvidaAprendido(d.de)}] : []; }
  });

  // ---- c-lee · Un texto corto, según `que` ----
  const LEE = {
    pasara: d => ({titulo: 'Lo que pasará', bloques: [{texto: d.regla === 'r-visitas' ? C.visitas().manana
      : 'Cuando alguien pida una valoración, te dejo preparado el informe del piso al día siguiente. Tú lo miras y lo envías.'}]}),
    veces: () => { const v = C.r6().visitas; return {titulo: `Las ${v.hechas} veces`, bloques: [{lista: v.casos.map(c => `${c.nombre} · ${c.distinto || c.cuando}`)}]}; },
    'quien-ve': d => { const ofi = C.lee('aOficina', {})[d.regla]; return {titulo: 'Quién lo ve', bloques: [{texto: ofi ? `Se lo propusiste a la oficina a las ${ofi}: Montse lo ve con tu nombre.`
      : 'Esta prueba es solo tuya: Montse no la ve. Si se lo propones a la oficina, desde «Cambiar algo», Montse lo verá con tu nombre.'}]}; },
    ultimo: d => ({titulo: 'Lo último que hice', bloques: [{lista: C.ultimo(M.regla(d.regla) || {})}]}),
    cambio: () => { const a = C.r6().antesAhora; return {titulo: 'Qué ha cambiado', bloques: [{titulo: 'Antes', lista: a.antes.filas}, {titulo: 'Ahora', lista: a.ahora.filas}]}; },
    aprende: () => ({titulo: 'Cómo aprende Veta', bloques: D().aprende.map(([t, x]) => ({titulo: t, texto: x}))}),
    ven: () => ({titulo: 'Lo que ven los demás', bloques: [{texto: 'En la semana del equipo salen tus cifras junto a las de cada persona. Nadie ve lo que escribes en tus chats.'}]}),
    'direccion-ve': () => ({titulo: 'Lo que dirección ve de ti', bloques: C.direccionVe()})
  };
  const leeDe = d => { try { return (LEE[d.que] || (() => null))(d) || {titulo: '', bloques: []}; } catch (e) { return {titulo: '', bloques: [{texto: 'No he podido cargar esto.'}]}; } };
  VETA.hojaTexto('c-lee', {titulo: d => leeDe(d).titulo, bloques: d => leeDe(d).bloques});
})();
