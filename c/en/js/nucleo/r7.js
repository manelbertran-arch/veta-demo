/* Veta demo · ronda 8 · js/nucleo/r7.js · el juego de piezas (PLAN_R8.md, apartado 4). Referencia con ejemplos: analisis/PARTE_N.md
   VETA.r7: funciones que devuelven HTML (texto), como VETA.UI. Estilos en css/r7.css. Una pantalla no pinta HTML propio para nada de esto.
   - cuentas()  el único sitio del que salen los números (la frase de Inicio, el punto de la barra, los filtros).
   - fila · lista · grupo · primero · tarjeta · sub · nota · boton · botones · enlace · filtros · cifra · barras · doc · elegir · cara · pastilla · micro · pasos · caras
   - La cabecera, el “volver”, el subtítulo (`sub`), la nota del pie (`nota`) y “Más” (`mas`) los pone el armazón: js/nucleo/rutas.js.
   Cada pieza acepta lo de siempre para tocar: ir, hoja, accion, de, datos, i (UI.attrs).
   De la ronda 7 se fueron caja(), tira() y ensena() (lo sustituye el micro de la barra: la pantalla dice de qué va con `casoDictado`). */
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
    hoy: q => VETA.r6.tocan(q).quedan + (VETA.A && VETA.A.preguntas ? VETA.A.preguntas(q).length : 0),   // “Te toca a ti”: lo que queda de hoy (y lo que te pregunta dirección)
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

  const avisa = (...a) => { try { console.warn('[r7]', ...a); } catch (e) {} };
  const texto = x => (x == null ? '' : String(x));

  // ---- caras solapadas: caras(['marta','elena','pere','nuria'], {max: 3}) → tres caras y “+1” ----
  function caras(ids, o) {
    o = o || {}; ids = (ids || []).filter(Boolean);
    const max = o.max || 3, tam = o.tam || 32, ver = ids.slice(0, max), mas = (o.total || ids.length) - ver.length;
    if (!ver.length) return '';
    // sin foto, una sola inicial: dos letras no caben cuando la cara de al lado tapa un trozo
    const una = h => h.replace(/(<b[^>]*>)([^<])[^<]*(<\/b>)/, '$1$2$3');
    return `<span class="r7-caras r7-caras-${tam}" aria-hidden="true">${ver.map(id => una(VETA.av(id, tam))).join('')}${mas > 0 ? `<b class="r7-caras-mas">+${mas}</b>` : ''}</span>`;
  }

  // ---- pieza 11 · cara: foto o iniciales en círculo. 40 en filas, 48 en “lo primero”, 32 dentro de un documento ----
  // cara('marta') · cara('veta') → la de Veta: círculo negro con el símbolo oro · cara('marta', 48)
  const cara = (id, tam, o) => {
    tam = tam || 40;
    if (id === 'veta') return `<span class="av av-${tam} r7-veta" aria-hidden="true"><img src="assets/veta-symbol-gold.png" alt="" width="${Math.round(tam / 2)}" height="${Math.round(tam * .4)}"></span>`;
    return VETA.av(id, tam, o);
  };

  // ---- pieza 8 · pastilla: solo roja, para la excepción (“Sin contestar”, “Nadie la lleva”, “Falta 1”). Dos palabras como mucho ----
  // pastilla('Sin contestar'). Lo de antes: con un tono que no sea 'rojo' (gris, oro) ya no es una pastilla, sale como texto gris.
  const pastilla = (t, tono) => (tono && tono !== 'rojo' ? `<span class="r7-dato">${esc(t)}</span>` : `<span class="r7-pastilla">${esc(t)}</span>`);

  // ---- pieza 3 · fila ----
  // fila({cara: 'marta' | 'veta', foto: 'verdi-42', nombre, pasa, pastilla: 'Sin contestar', dato: 3 | 'Sáb 21', ir | hoja | accion})
  //   Dos altos: 56 (una línea, sin `pasa`) y 72 (dos líneas). A la izquierda solo una cara o una foto; si no, nada.
  //   A la derecha: una pastilla roja O un dato gris, y “›” si se toca.
  //   Plegable: fila({nombre, abre: '<p>…</p>'}) → se despliega aquí, con “+” (pieza 5). Solo en listas donde todas lo son.
  //   Lo de antes no rompe: `icono`, `oro` y `tono` se ignoran; `numero` vale como `dato`; una pastilla con tono gris u oro sale como dato.
  let serie = 0;
  function fila(o) {
    o = o || {};
    const lead = o.cara ? cara(o.cara, 40, {nombre: o.nombre}) : o.foto ? `<span class="r7-foto">${UI.foto(o.foto, {tam: 'mini'})}</span>` : '';
    const roja = o.pastilla && (!o.tono || o.tono === 'rojo') ? pastilla(o.pastilla) : '';
    const d = roja ? '' : texto(o.dato != null ? o.dato : o.pastilla ? o.pastilla : o.numero != null ? o.numero : '');
    const cuerpo = `${lead}<span class="r7-fila-c"><span class="r7-fila-1"><span class="r7-fila-n">${esc(o.nombre)}</span>${roja}</span>` +
      `${o.pasa ? `<span class="r7-fila-p">${esc(o.pasa)}</span>` : ''}</span>${d !== '' ? `<span class="r7-dato">${esc(d)}</span>` : ''}`;
    const cls = 'r7-fila' + (o.pasa ? '' : ' r7-fila-1l') + (lead ? ' r7-con' : '') + (o.clase ? ' ' + o.clase : '');
    if (o.abre != null) {
      const id = 'r7-ab-' + (++serie);
      return `<div class="r7-fila-d${lead ? ' r7-con' : ''}"${UI.attrs({i: o.i, datos: o.datos})}><button type="button" class="${cls}" data-r7-abre aria-expanded="false" aria-controls="${id}">${cuerpo}<span class="r7-fila-mas" aria-hidden="true"></span></button>` +
        `<div class="r7-abierto" id="${id}" hidden>${o.abre}</div></div>`;
    }
    return tocable(o) ? `<button type="button" class="${cls}"${UI.attrs(o)}>${cuerpo}<span class="r7-fila-chev">${ic('chev', 16)}</span></button>`
      : `<div class="${cls} r7-fila-quieta"${UI.attrs({i: o.i, datos: o.datos, id: o.id})}>${cuerpo}</div>`;
  }
  // ---- pieza 4 · lista: tarjeta de radio 20 con filas. lista(filas, {rotulo: 'Ya lo hago yo', i, clase}) ----
  // Acepta objetos de fila o HTML ya hecho. Con `rotulo` devuelve <section class="r7-grupo"> con el rótulo encima
  // (lo lleva siempre que la pantalla tenga tres listas o más). “›” y “+” nunca en la misma lista: si se mezclan, avisa por consola.
  // grupo('Por ejemplo', html, {i}) → el rótulo de grupo (15 px, 700, gris) sobre lo que sea: una lista, un elegir, unas barras
  const grupo = (rotulo, html, o) => `<section class="r7-grupo"${o && o.i != null ? ` data-i="${esc(o.i)}"` : ''}><h2 class="r7-rotulo">${esc(rotulo)}</h2>${html}</section>`;
  const lista = (filas, o) => {
    o = o || {};
    const l = (filas || []).filter(Boolean), obj = l.filter(f => typeof f !== 'string');
    if (obj.some(f => f.abre != null) && obj.some(f => f.abre == null && tocable(f))) avisa('list mixing rows that navigate (“›”) and collapsibles (“+”):', o.rotulo || obj[0].nombre);
    const h = `<div class="r7-lista${o.clase ? ' ' + o.clase : ''}"${!o.rotulo && o.i != null ? ` data-i="${esc(o.i)}"` : ''}>${l.map(f => typeof f === 'string' ? f : fila(f)).join('')}</div>`;
    return o.rotulo ? grupo(o.rotulo, h, o) : h;
  };

  // abrir en el sitio: una abierta a la vez dentro de su lista
  document.addEventListener('click', ev => {
    const b = ev.target.closest && ev.target.closest('[data-r7-abre]'); if (!b) return;
    const abrir = b.getAttribute('aria-expanded') !== 'true', zona = b.closest('.r7-lista') || b.closest('.pant-cuerpo') || document;
    VETA.$$('[data-r7-abre][aria-expanded="true"]', zona).forEach(x => { if (x !== b) { x.setAttribute('aria-expanded', 'false'); const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = true; } });
    b.setAttribute('aria-expanded', String(abrir));
    const p = document.getElementById(b.getAttribute('aria-controls')); if (p) p.hidden = !abrir;
  });

  // ---- pieza 7 · botones ----
  // boton({texto, ir | accion | hoja, icono, deshabilitado}) → el negro (56 px). Va en `botonFijo` de la pantalla: uno por pantalla.
  // botones(negro) → uno · botones(negro, claro) → par: claro a la izquierda y negro a la derecha, solo para un sí o no (14 caracteres
  // como mucho cada uno). Lo demás va a “Más” (campo `mas`) o a un enlace. Un tercero se ignora y avisa por consola.
  // Lo de antes no rompe: botones(negro, [claro]) vale; de botones(negro, [a, b]) solo se pinta `a`.
  const boton = o => `<button type="button" class="r7-boton${o.tipo === 'claro' ? ' r7-boton-claro' : ''}${o.clase ? ' ' + o.clase : ''}"${UI.attrs(o)}${o.deshabilitado ? ' disabled' : ''}>${o.icono ? ic(o.icono, 20) : ''}<span>${esc(o.texto)}</span></button>`;
  const botones = (negro, otro, ...mas) => {
    const l = (Array.isArray(otro) ? otro : [otro]).concat(mas).filter(Boolean);
    if (l.length > 1) avisa('buttons: the footer fits one or a pair; ignored', l.slice(1).map(x => x.texto).join(' · '));
    const claro = l[0] ? boton(Object.assign({}, l[0], {tipo: 'claro'})) : '';
    if (claro && negro) return `<div class="r7-par">${claro}${boton(negro)}</div>`;
    return claro || (negro ? boton(negro) : '');
  };
  // enlace({texto, ir | hoja | accion}) → texto subrayado, zona de 44. Uno suelto por pantalla y al final del contenido
  const enlace = o => `<button type="button" class="r7-enlace${o.clase ? ' ' + o.clase : ''}"${UI.attrs(o)}>${esc(o.texto)}</button>`;

  // ---- pieza 6 · tarjeta: bloque de lectura. tarjeta({de: 'Marta · ayer, 18:42', texto | html}) · de Veta (aro y origen en oro): {veta: true} ----
  // Dos por pantalla como mucho, y dentro no hay nada que se toque.
  const tarjeta = o => `<div class="r7-ficha${o.veta ? ' r7-oro' : ''}${o.clase ? ' ' + o.clase : ''}"${UI.attrs({i: o.i, id: o.id, vt: o.vt})}>${o.de ? `<span class="r7-ficha-de">${esc(o.de)}</span>` : ''}${o.html || `<p>${esc(o.texto)}</p>`}</div>`;
  // ---- “lo primero” de Inicio: la primera cosa, con su botón negro de 48. Es la única tarjeta que lleva algo que se toca ----
  // primero({cara, nombre, pasa, pastilla, boton: {texto: 'Ver mi respuesta', ir: 'toca/c-marta'}})
  const primero = o => `<div class="r7-primero${o.clase ? ' ' + o.clase : ''}"${UI.attrs({i: o.i, vt: o.vt, datos: o.datos})}><div class="r7-primero-a">${o.cara ? cara(o.cara, 48, {nombre: o.nombre}) : ''}` +
    `<span class="r7-fila-c"><span class="r7-fila-1"><span class="r7-fila-n">${esc(o.nombre)}</span>${o.pastilla ? pastilla(o.pastilla) : ''}</span>${o.pasa ? `<span class="r7-fila-p">${esc(o.pasa)}</span>` : ''}</span></div>` +
    (o.boton ? boton(Object.assign({}, o.boton, {clase: 'r7-boton-48'})) : '') + '</div>';

  // ---- pieza 15 · línea de apoyo. Lo normal es declararlas en la pantalla (`sub`, `nota`) y que las pinte el armazón ----
  // sub('Propietario del piso de Verdi 42') · nota('No sale hasta que tú lo envíes.', {candado: true})
  const sub = (t, o) => `<p class="r7-sub"${o && o.i != null ? ` data-i="${esc(o.i)}"` : ''}>${esc(t)}</p>`;
  const nota = (t, o) => `<p class="r7-nota">${o && o.candado ? ic('candado', 16) : ''}<span>${esc(t)}</span></p>`;

  // ---- pieza 9 · filtros: pastillas de 40 que se deslizan de lado. La elegida, negra; cada una con su cuenta en gris ----
  // filtros([{id: 'todos', texto: 'Todos', cuenta: 18}, {id: 'necesitan', texto: 'Te necesitan', cuenta: 6}], {valor: 'todos', accion: 'filtra'})
  // La acción recibe el elegido en el.dataset.valor (y repinta). Cinco como mucho, 16 caracteres. Sirve también para los ajustes rápidos.
  const filtros = (l, o) => {
    o = o || {}; l = (l || []).filter(Boolean);
    if (l.length > 5) avisa('filters: five at most; there are', l.length);
    return `<div class="r7-filtros" role="group"${o.etiqueta ? ` aria-label="${esc(o.etiqueta)}"` : ''}${o.i != null ? ` data-i="${esc(o.i)}"` : ''}>${l.map(f =>
      `<button type="button" class="r7-filtro" data-r7-filtro aria-pressed="${f.id === o.valor}"${UI.attrs({accion: f.accion || o.accion, de: o.de, datos: {valor: f.id}})}>${esc(f.texto)}${f.cuenta != null ? ` <b>${esc(f.cuenta)}</b>` : ''}</button>`).join('')}</div>`;
  };
  // el elegido se marca al tocar (la acción de la pantalla llega después y repinta)
  document.addEventListener('click', ev => {
    const b = ev.target.closest && ev.target.closest('[data-r7-filtro]'); if (!b) return;
    VETA.$$('[data-r7-filtro]', b.parentNode).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }, true);

  // ---- pieza 12 · cifra y barras (solo en pantallas de resultado) ----
  // cifra({valor: 156, frase: 'cosas que os dejé listas. Hace un mes, 118.'}) → un número a 40 px con su frase al lado. Una por pantalla.
  const cifra = o => `<div class="r7-cifra"${UI.attrs({i: o.i, id: o.id})}><b class="r7-cifra-n">${esc(typeof o.valor === 'number' ? VETA.num(o.valor) : o.valor)}</b><span class="r7-cifra-f">${esc(o.frase || '')}</span></div>`;
  // barras([{valor: 118, fecha: '26 oct'}, …, {valor: 156, fecha: '16 nov'}]) → la única gráfica: cuatro columnas como mucho, la última en oro,
  // el valor encima y la fecha debajo, sin ejes. Ya es una tarjeta: no se mete en otra. {texto: '156'} si el valor se escribe distinto de como se mide.
  // Si las columnas no son una serie en el tiempo (paradas por fase), {serie: false}: ninguna se destaca.
  const barras = (l, o) => {
    o = o || {}; l = (l || []).filter(Boolean);
    if (l.length > 4) { avisa('bars: four columns at most; the last four are drawn'); l = l.slice(-4); }
    const max = Math.max(1, ...l.map(x => Number(x.valor) || 0));
    const voz = l.map(x => `${x.fecha || ''}: ${x.texto != null ? x.texto : x.valor}`).join(', ');
    return `<div class="r7-barras"${UI.attrs({i: o.i})} role="img" aria-label="${esc(o.etiqueta ? o.etiqueta + '. ' + voz : voz)}" style="--n:${l.length}">${l.map((x, k) =>
      `<div class="r7-barra${o.serie !== false && k === l.length - 1 ? ' on' : ''}" aria-hidden="true"><span class="r7-barra-v">${esc(x.texto != null ? x.texto : typeof x.valor === 'number' ? VETA.num(x.valor) : x.valor)}</span><i style="height:${Math.max(4, Math.round(56 * (Number(x.valor) || 0) / max))}px"></i><span class="r7-barra-f">${esc(x.fecha || '')}</span></div>`).join('')}</div>`;
  };

  // ---- pieza 13 · documento: el papel (PLAN_R8.md, 8.1). Una sola tarjeta de radio 20 con aro; dentro no hay ninguna otra caja ----
  // doc({foto: 'verdi-42', datos: ['Lunes 23 de noviembre, 9:00 · Verdi 42, 3.º 2.ª', 'Elena Vives con Laura Martí'], titular: 'Le ha gustado mucho.',
  //      texto: 'Un párrafo', secciones: [{rotulo: 'Lo que le gustó', lineas: ['La luz del salón', 'La terraza']},
  //      {rotulo: 'Esta semana', filas: [{nombre: 'Visitas', valor: 3, sub: 'antes 2'}]}], html})
  // Cinco estilos de texto: datos (15 gris), titular (20), rótulo (15/700 gris), texto (17) y el valor (17/700). Sin viñetas, ✓ ni rayas.
  const docFila = f => `<div class="r7-doc-fila"><span class="r7-doc-fn">${esc(f.nombre)}${f.sub ? `<span class="r7-doc-fs">${esc(f.sub)}</span>` : ''}</span><b class="r7-doc-fv">${esc(f.valor)}</b></div>`;
  const doc = o => {
    const sec = (o.secciones || []).filter(Boolean).map(s2 => `<section class="r7-doc-s">${s2.rotulo ? `<h3 class="r7-doc-r">${esc(s2.rotulo)}</h3>` : ''}` +
      (s2.texto ? `<p>${esc(s2.texto)}</p>` : '') + (s2.lineas ? `<ul>${s2.lineas.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '') + (s2.filas ? s2.filas.map(docFila).join('') : '') + (s2.html || '') + '</section>').join('');
    return `<article class="r7-doc${o.clase ? ' ' + o.clase : ''}"${UI.attrs({i: o.i, id: o.id})}>${o.foto ? `<div class="r7-doc-foto">${UI.foto(o.foto, {tam: 'ancha', n: o.fotoN || 0})}</div>` : ''}<div class="r7-doc-in">` +
      ((o.datos || []).length ? `<p class="r7-doc-datos">${o.datos.slice(0, 2).map(x => `<span>${esc(x)}</span>`).join('')}</p>` : '') +
      (o.titular ? `<h2 class="r7-doc-t">${esc(o.titular)}</h2>` : '') + (o.texto ? `<p>${esc(o.texto)}</p>` : '') + sec + (o.html || '') + '</div></article>';
  };

  // ---- elegir: tres respuestas no son tres botones, son tres filas con una marcada ----
  // elegir([{id: 'si', texto: 'Sí, le interesa', sub}, {id: 'duda', texto: 'Tiene dudas'}], {valor: 'si', accion: 'elige', rotulo}) → la acción recibe el.dataset.valor
  // Con `rotulo` lleva el rótulo de grupo encima (y es su nombre para el lector de pantalla), igual que lista().
  const elegir = (l, o) => {
    o = o || {};
    const voz = o.etiqueta || o.rotulo;
    const h = `<div class="r7-lista r7-elegir" role="radiogroup"${voz ? ` aria-label="${esc(voz)}"` : ''}${!o.rotulo && o.i != null ? ` data-i="${esc(o.i)}"` : ''}>${(l || []).filter(Boolean).map(x =>
      `<button type="button" class="r7-fila${x.sub ? '' : ' r7-fila-1l'}${x.cara ? ' r7-con' : ''}" role="radio" data-r7-elige aria-checked="${x.id === o.valor}"${UI.attrs({accion: x.accion || o.accion, de: o.de, datos: {valor: x.id}})}>` +
      `${x.cara ? cara(x.cara, 40, {nombre: x.texto}) : ''}<span class="r7-fila-c"><span class="r7-fila-1"><span class="r7-fila-n">${esc(x.texto)}</span></span>${x.sub ? `<span class="r7-fila-p">${esc(x.sub)}</span>` : ''}</span><span class="r7-marca">${ic('check', 20)}</span></button>`).join('')}</div>`;
    return o.rotulo ? grupo(o.rotulo, h, o) : h;
  };
  document.addEventListener('click', ev => {
    const b = ev.target.closest && ev.target.closest('[data-r7-elige]'); if (!b) return;
    VETA.$$('[data-r7-elige]', b.parentNode).forEach(x => x.setAttribute('aria-checked', String(x === b)));
  }, true);

  // ---- pieza 16 · micro grande (104, oro) y pasos. Solo en Dictar y “¿Cómo ha ido?” ----
  // micro({texto: 'Toca y dímelo', accion: 'graba'}) · pasos(2, 4) → cuatro puntos (lo normal: cabDerecha: () => ({tipo: 'puntos', paso: 2}))
  // Sin acción (ya se ha dicho: “Esto has dicho”) no es un botón: se ve igual y no se toca.
  const micro = o => { o = o || {}; const b = tocable(o);
    return `<${b ? 'button type="button"' : 'div'} class="r7-micro${b ? '' : ' r7-micro-quieto'}${o.clase ? ' ' + o.clase : ''}"${UI.attrs(o)}><span class="r7-micro-c">${ic(o.icono || 'mic', 40)}</span><span class="r7-micro-t">${esc(o.texto || 'Tap and tell me')}</span></${b ? 'button' : 'div'}>`; };
  const pasos = (n, total) => VETA.cabDer({tipo: 'puntos', paso: n, total});

  // los ganchos de Inicio (los rellenan A y D desde sus ficheros; los lee js/pantallas/inicio.js)
  VETA.inicioDe = VETA.inicioDe || {};
  VETA.r7 = Object.assign(VETA.r7 || {}, {cuentas, fuentes, quienes, caras, cara, pastilla, fila, lista, grupo, boton, botones, enlace, tarjeta, primero, sub, nota, filtros, cifra, barras, doc, elegir, micro, pasos});
})();
