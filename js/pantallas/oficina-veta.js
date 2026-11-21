/* Veta demo · pantallas · oficina-veta.js · paquete C (Veta, cuenta y entrada)
   - G10 · Cómo trabajamos · #/oficina/practicas
   - G11 · Lo que aprende la oficina · #/oficina/aprende
   - G12 · Lo que Veta aún no hace · #/oficina/falta
   - G13 · Un caso para aprender · #/oficina/caso/<id>
   - G14 · Lo que sabe tu oficina · #/oficina/sabe */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, C = VETA.c;
  const D = () => VETA.datos.c;

  // prácticas con su estado (H23 las cambia en dirección)
  C.practicas = () => D().practicas.concat(C.lee('practicaClaudia', false) ? [D().practicaClaudia] : []).map(x => {
    const e = C.lee('practica', {})[x.id];
    return e ? Object.assign({}, x, e) : x;
  });
  const filaPractica = x => ({titulo: x.titulo, etiqueta: x.estado, etiquetaTexto: x.estadoTexto, sub: `${x.usan} · ${x.propuso}`, hoja: 'h23', datos: {practica: x.id}});

  // ---- G10 · Cómo trabajamos ----
  VETA.lista('G10', {
    titulo: 'How we work',
    guia: ['Here are the office\'s practices and where each one stands.', 'You tap one to see who proposed it and what case it came from.', 'That way what works becomes how the whole team works.'],
    intro: () => VETA.yo().papel === 'direccion' ? 'What the office does the same way, or is trying out. You decide the next step for each one.' : 'What the office does the same way, or is trying out. Management decides.',
    bloques: () => [{filas: C.practicas().map(filaPractica)}]
  });

  // ---- G11 · Lo que aprende la oficina ----
  VETA.pantalla('G11', {
    titulo: 'What the office learns',
    guia: ['Here you see where deals stall and what the office is learning.', 'You tap a practice or a case to see where it comes from.', 'That way you improve with what really happens, not with opinions.'],
    pinta: () => {
      const max = Math.max(...D().paradas.map(x => x[1]), 1), total = D().paradas.reduce((s, x) => s + x[1], 0);
      return UI.bloque({titulo: 'Where deals stall', texto: `${total} deals stalled now, by stage.`, i: 0, html:
          `<div class="c-barras" role="list">${D().paradas.map(([f, n], k) => `<div class="c-barra" role="listitem" style="--v:${n / max};--k:${k}"><span class="c-barra-n">${esc(f)}</span>` +
            `<span class="c-barra-t" aria-hidden="true"><i></i></span><b class="c-barra-v">${n}</b></div>`).join('')}</div>`}) +
        UI.bloque({titulo: 'What\'s been proposed and how many people use it', i: 1, html: UI.lista(C.practicas().map(filaPractica))}) +
        UI.bloque({titulo: 'How Veta learns', i: 2, html: `<ol class="c-hilo c-hilo-corto">${D().aprende.map(([t, x], k) => `<li class="c-nudo" style="--k:${k}"><span class="c-nudo-p" aria-hidden="true"></span><span><b>${esc(t)}</b><br><span class="c-nudo-s">${esc(x)}</span></span></li>`).join('')}</ol>`}) +
        UI.lista([{titulo: 'Cases to learn from', sub: '1 · a deal that fell through', derecha: '1', icono: 'libro', ir: 'oficina/caso/claudia'}], {i: 3});
    }
  });

  // ---- G12 · Lo que Veta aún no hace ----
  VETA.lista('G12', {
    titulo: 'What Veta doesn\'t do yet',
    guia: ['Here you see the work the office still does by hand.', 'You teach it the first one by dictating it with your voice.', 'That way Veta first learns what takes up the most time.'],
    intro: '43 times by hand in six months.',
    bloques: () => [{filas: D().falta.map(([t, n]) => ({titulo: t, derecha: String(n), icono: 'mano'}))}],
    pie: 'Times someone in the office did it by hand, counted in the chats.',
    boton: {texto: 'Teach it the first one', ir: 'dictar/orden'}
  });

  // ---- G13 · Un caso para aprender ----
  VETA.pantalla('G13', {
    titulo: 'A case to learn from',
    guia: ['Here\'s the story of a deal that fell through, with its messages and dates.', 'You draw a practice for the office from it.', 'That way what went wrong doesn\'t happen again.'],
    pinta: () => {
      const hecha = C.lee('practicaClaudia', false);
      return (hecha ? UI.lineaHecho({texto: 'Proposal created: call within 48 hours anyone who asks for a viewing', hora: hecha, ir: 'oficina/practicas', boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-caso', i: 0}) : '') +
        `<div class="c-caso-cab" data-i="0">${VETA.av('claudia', 64)}<div><p class="c-yo-n">Clàudia Ribas</p><p class="c-yo-p">Deal fell through · purchase of a flat in Sants</p></div></div>` +
        UI.bloque({titulo: 'What happened', i: 1, html: `<ol class="c-tiempo">${VETA.datos.casoClaudia.map(x => `<li><span class="c-tiempo-f">${esc(x.cuando)}</span><span class="c-tiempo-t${/^«/.test(x.texto) ? ' c-tiempo-cita' : ''}">${esc(x.texto)}</span></li>`).join('')}</ol>`}) +
        UI.bloque({titulo: 'What it teaches', i: 2, html: UI.nota({texto: 'Whoever asks to see a flat and doesn\'t get a call within 48 hours leaves.', icono: 'estrella', caja: true})});
    },
    botonFijo: () => (C.lee('practicaClaudia', false) ? '' : UI.boton({texto: 'Draw a practice from this case', accion: 'saca'})),
    acciones: {
      saca() { C.pon('practicaClaudia', VETA.ahora()); VETA.repinta({hecho: 'c-caso'}); },
      deshacer() { C.pon('practicaClaudia', false); VETA.repinta({hecho: 'c-caso'}); }
    }
  });

  // ---- G14 · Lo que sabe tu oficina ----
  VETA.pantalla('G14', {
    titulo: 'What your office knows',
    guia: ['Here you see what Veta has found in the chats of the whole office.', 'You read it: these are counts, not opinions.', 'That way you know what works in your area.'],
    pinta: () => `<div class="c-cifra" data-i="0">${UI.cifra({valor: 212, unidad: 'of 301 contacts ended in a viewing', periodo: 'since 3 October'})}</div>` +
      UI.bloque({titulo: 'Three things that repeat', i: 1, html: D().sabe.map(([t, a, b], k) =>
        `<div class="c-sabe" style="--v:${a / b};--k:${k}"><p class="c-sabe-t">${esc(t)}</p><div class="c-sabe-l"><span class="c-barra-t" aria-hidden="true"><i></i></span><b>${a} of ${b}</b>${C.ejemplo()}</div></div>`).join('')}) +
      UI.nota({texto: 'Counts made from the office chats, without names. They\'re examples.', icono: 'info', clase: 'nota-gris'})
  });
})();
