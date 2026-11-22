/* Veta demo · ronda 7 · js/nucleo/r7.js · N2 · las piezas comunes (ESTRATEGIA_R7.md, secciones 2 a 4)
   VETA.r7: funciones que devuelven HTML (texto), como VETA.UI. Estilos en css/r7.css. Cómo se usan: PIEZAS_R7.md, sección 2.
   - cuentas()  R9: el único sitio del que salen los números de las cajas, de la barra y de la frase de cada pantalla.
     Las claves son los destinos (VETA.SITIOS): hoy, visitas, clientes, veta, decidir, equipo, operaciones, oficina; y mirar.
   - caras · pastilla · caja · fila · lista · boton · botones · tira · ensena. La cabecera, el volver y la frase los pone el armazón (PIEZAS_R7.md, sección 1).
   Cada pieza acepta lo de siempre para tocar: ir, hoja, accion, de, datos, i (UI.attrs). */
(function () {
  'use strict';
  const esc = VETA.esc, ic = (n, w) => VETA.ic(n, w), UI = VETA.UI;
  const M = () => VETA.modelo, D = () => VETA.datos;
  const yo = () => VETA.yo();
  const tocable = o => !!(o && (o.ir || o.hoja || o.accion || o.atras));
  const conFoto = id => !!((M().quien(id) || {}).foto);

  // ---- R9 · las cuentas ----
  // Cada cifra sale de lo que la app ya enseña dentro (VETA.r6.tocan, VETA.dir.ops, M.decisiones…). Si tu pantalla cuenta
  // otra cosa, cambia aquí su fuente (VETA.r7.fuentes.visitas = quien => n) y la caja y tu pantalla dirán lo mismo.
  const mios = q => Object.values(D().clientes || {}).filter(c => c && !c.fuera && c.lleva === q && c.cartera !== false);
  const esperan = q => M().pendientes(q).map(c => c.cliente).filter(Boolean);
  const ops = () => (VETA.dir && VETA.dir.ops ? VETA.dir.ops() : []);
  const equipo = () => (VETA.dir && VETA.dir.equipoOps ? VETA.dir.equipoOps().todos.map(x => x.id) : []);
  const fuentes = {
    hoy: q => VETA.r6.tocan(q).quedan + (VETA.A && VETA.A.preguntas ? VETA.A.preguntas(q).length : 0),   // «Te toca a ti»: lo que queda de hoy (y lo que te pregunta dirección)
    visitas: q => M().cola(q).filter(c => c.tipo === 'visita').length,                // las visitas de hoy
    clientes: q => mios(q).length,                                                    // los clientes que llevas
    veta: () => { const r = M().resumenReglas(); return r.activas + r.aPrueba + (VETA.r6.reglaVisitas() === 'propuesta' ? 0 : 1); },   // trabajos que ya hace Veta
    decidir: () => VETA.d1 && VETA.d1.esperan ? VETA.d1.esperan().length : M().decisiones().filter(c => VETA.dir.pendiente(c)).length, // FD: decisiones + contactos que no lleva nadie
    equipo: () => equipo().length,                                                    // personas de la oficina
    operaciones: () => ops().length,
    mirar: () => ops().filter(o => o.mirar).length,                                   // las que hay que mirar hoy
    oficina: () => { const l = (((D().r6 || {}).direccion || {}).semanas || {}).listos || []; return l[l.length - 1] || 0; }   // lo que Veta dejó listo la semana pasada
  };
  // las caras de una caja: primero quien tiene foto
  const carasDe = {
    hoy: q => esperan(q),
    clientes: q => { const e = esperan(q); return mios(q).map(c => c.id).sort((a, b) => (conFoto(b) - conFoto(a)) || (e.includes(a) - e.includes(b))); },
    equipo: q => equipo().filter(id => id !== q).sort((a, b) => conFoto(b) - conFoto(a))
  };
  function cuentas(quien) {
    const q = quien || yo().id, o = {};
    Object.keys(fuentes).forEach(k => { try { o[k] = fuentes[k](q) || 0; } catch (e) { o[k] = 0; } });
    return o;
  }
  // quienes('hoy') → los ids de las caras de esa caja (hoy, clientes, equipo); las demás no llevan caras
  const quienes = (destino, quien) => { try { return carasDe[destino] ? carasDe[destino](quien || yo().id) : []; } catch (e) { return []; } };

  // ---- caras solapadas: caras(['marta','elena','pere','nuria'], {max: 3}) → tres caras y «+1» ----
  function caras(ids, o) {
    o = o || {}; ids = (ids || []).filter(Boolean);
    const max = o.max || 3, tam = o.tam || 32, ver = ids.slice(0, max), mas = (o.total || ids.length) - ver.length;
    if (!ver.length) return '';
    // sin foto, una sola inicial: dos letras no caben cuando la cara de al lado tapa un trozo
    const una = h => h.replace(/(<b[^>]*>)([^<])[^<]*(<\/b>)/, '$1$2$3');
    return `<span class="r7-caras r7-caras-${tam}" aria-hidden="true">${ver.map(id => una(VETA.av(id, tam))).join('')}${mas > 0 ? `<b class="r7-caras-mas">+${mas}</b>` : ''}</span>`;
  }

  // ---- pastilla: un solo estilo, tres tonos. gris = normal · oro = lo hizo o lo propone Veta · rojo = nadie ha contestado o no la lleva nadie ----
  const TONOS = ['gris', 'oro', 'rojo'];
  const pastilla = (texto, tono) => `<span class="r7-pastilla r7-p-${TONOS.includes(tono) ? tono : 'gris'}">${esc(texto)}</span>`;

  // ---- caja de Inicio: caras o icono, número grande, nombre y una frase (dos líneas como mucho) ----
  // caja({nombre, numero, frase, ir, caras: [ids] | icono: 'cal', total, oro: true (es de Veta)})
  function caja(o) {
    const arriba = o.caras && o.caras.length ? caras(o.caras, {max: o.max || 3, total: o.total, tam: 32})
      : `<span class="r7-caja-ic">${ic(o.icono || 'punto', 20)}</span>`;
    const num = o.numero == null ? '' : `<b class="r7-caja-n">${esc(typeof o.numero === 'number' ? VETA.num(o.numero) : o.numero)}</b>`;
    const voz = [o.nombre, o.numero != null ? o.numero : '', o.frase].filter(x => x !== '').join('. ');
    return `<button type="button" class="r7-caja${o.oro ? ' r7-caja-oro' : ''}${o.clase ? ' ' + o.clase : ''}"${UI.attrs(o)} aria-label="${esc(voz)}">` +
      `<span class="r7-caja-a">${arriba}${num}</span>` +
      `<span class="r7-caja-t">${esc(o.nombre)}</span>` +
      (o.frase ? `<span class="r7-caja-f">${esc(o.frase)}</span>` : '') + '</button>';
  }

  // ---- R3 · fila: cara o icono + nombre (1 línea) + qué pasa (1 línea) + como mucho UNA pastilla o UN número. Todas miden lo mismo ----
  // fila({cara: 'marta' | icono: 'cal', nombre, pasa, pastilla: 'Lo propongo', tono: 'oro' | numero: 3, ir | hoja | accion})
  // Variante que se abre en el sitio (contenido corto, 6 líneas como mucho): fila({…, abre: '<p>…</p>'}). Cerrada al entrar; una abierta a la vez.
  let serie = 0;
  function fila(o) {
    const lead = o.cara ? VETA.av(o.cara, 40, {nombre: o.nombre}) : `<span class="r7-fila-ic${o.oro ? ' r7-oro' : ''}">${ic(o.icono || 'punto', 20)}</span>`;
    // la pastilla va en la línea del nombre, para que «qué pasa» tenga la línea entera; el número, a la derecha
    const num = !o.pastilla && o.numero != null ? `<b class="r7-fila-num">${esc(o.numero)}</b>` : '';
    const cuerpo = `${lead}<span class="r7-fila-c"><span class="r7-fila-1"><span class="r7-fila-n">${esc(o.nombre)}</span>${o.pastilla ? pastilla(o.pastilla, o.tono) : ''}</span>` +
      `${o.pasa ? `<span class="r7-fila-p">${esc(o.pasa)}</span>` : ''}</span>${num}`;
    const cls = 'r7-fila' + (o.clase ? ' ' + o.clase : '');
    if (o.abre != null) {
      const id = 'r7-ab-' + (++serie);
      return `<div class="r7-fila-d"${UI.attrs({i: o.i, datos: o.datos})}><button type="button" class="${cls}" data-r7-abre aria-expanded="false" aria-controls="${id}">${cuerpo}<span class="r7-fila-chev r7-gira">${ic('abajo', 16)}</span></button>` +
        `<div class="r7-abierto" id="${id}" hidden>${o.abre}</div></div>`;
    }
    return tocable(o) ? `<button type="button" class="${cls}"${UI.attrs(o)}>${cuerpo}<span class="r7-fila-chev">${ic('chev', 16)}</span></button>`
      : `<div class="${cls} r7-fila-quieta"${UI.attrs({i: o.i, datos: o.datos, id: o.id})}>${cuerpo}</div>`;
  }
  // la lista: una sola por pantalla (R2). Acepta objetos de fila o HTML ya hecho.
  const lista = (filas, o) => { o = o || {}; return `<div class="r7-lista${o.clase ? ' ' + o.clase : ''}"${o.i != null ? ` data-i="${esc(o.i)}"` : ''}>${(filas || []).filter(Boolean).map(f => typeof f === 'string' ? f : fila(f)).join('')}</div>`; };

  // abrir en el sitio: una abierta a la vez dentro de su lista
  document.addEventListener('click', ev => {
    const b = ev.target.closest && ev.target.closest('[data-r7-abre]'); if (!b) return;
    const abrir = b.getAttribute('aria-expanded') !== 'true', zona = b.closest('.r7-lista') || b.closest('.pant-cuerpo') || document;
    VETA.$$('[data-r7-abre][aria-expanded="true"]', zona).forEach(x => { if (x !== b) { x.setAttribute('aria-expanded', 'false'); const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = true; } });
    b.setAttribute('aria-expanded', String(abrir));
    const p = document.getElementById(b.getAttribute('aria-controls')); if (p) p.hidden = !abrir;
  });

  // ---- R4 · botones: tres como mucho; el negro (lo principal) es siempre el último, abajo, en el mismo sitio ----
  // Van en botonFijo de la pantalla: botonFijo: () => VETA.r7.botones({texto: 'Enviar', accion: 'envia'}, [{texto: 'Cambiar', hoja: 'h03'}, {texto: 'Hoy no', accion: 'no'}])
  const boton = o => `<button type="button" class="r7-boton${o.tipo === 'claro' ? ' r7-boton-claro' : ''}${o.clase ? ' ' + o.clase : ''}"${UI.attrs(o)}${o.deshabilitado ? ' disabled' : ''}>${o.icono ? ic(o.icono, 20) : ''}<span>${esc(o.texto)}</span></button>`;
  const botones = (negro, otros) => {
    const l = (otros || []).filter(Boolean).slice(0, 2);
    return (l.length ? `<div class="r7-otros">${l.map(x => boton(Object.assign({}, x, {tipo: 'claro'}))).join('')}</div>` : '') + (negro ? boton(negro) : '');
  };

  // ---- la tira «Enséñale a Veta»: negra, ancha, con micro dorado (Inicio). tira() o tira({frase, ir}) ----
  const TIRA = {
    agente: 'Cuéntame algo que haces siempre. Aprendo a hacerlo yo.',
    direccion: 'Dime cómo trabaja tu oficina y lo hago así para todos.'
  };
  function tira(o) {
    o = Object.assign({ir: 'dictar/libre', titulo: 'Enséñale a Veta'}, o);
    const f = o.frase || TIRA[yo().papel === 'direccion' ? 'direccion' : 'agente'];
    return `<button type="button" class="r7-tira${o.clase ? ' ' + o.clase : ''}"${UI.attrs(o)}><span class="r7-tira-mic">${ic('mic', 24)}</span>` +
      `<span class="r7-tira-c"><b class="r7-tira-t">${esc(o.titulo)}</b><span class="r7-tira-f">${esc(f)}</span></span></button>`;
  }
  // ---- ensena: el «Enséñale a Veta» que va incrustado junto a lo que Veta deja preparado (un mensaje, un acta, una propuesta) ----
  // Discreto, en oro, con micro, una línea. ensena() → dictar/libre · ensena({guion: 'orden'}) → dictar/orden · ensena({texto: 'Enséñale otra forma'})
  const ensena = o => {
    o = o || {};
    return `<button type="button" class="r7-ensena${o.clase ? ' ' + o.clase : ''}"${UI.attrs(Object.assign({}, o, {ir: 'dictar/' + (o.guion || 'libre')}))}>` +
      `<span class="r7-ensena-mic">${ic('mic', 18)}</span><span>${esc(o.texto || 'Enséñale a Veta')}</span></button>`;
  };

  VETA.r7 = Object.assign(VETA.r7 || {}, {cuentas, fuentes, quienes, caras, pastilla, caja, fila, lista, boton, botones, tira, ensena});
})();
