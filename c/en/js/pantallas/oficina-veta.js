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
    frase: () => VETA.yo().papel === 'direccion' ? 'What the office does the same way, or is trying out. You decide the next step for each one.' : 'What the office does the same way, or is trying out. Management decides.',
    bloques: () => [{filas: C.practicas().map(filaPractica)}]
  });

  // ---- G11 · Lo que aprende la oficina ----
  VETA.pantalla('G11', {
    titulo: 'What the office learns',
    frase: 'Where deals stall and what we learned from it.',
    pinta: () => {
      const max = Math.max(...D().paradas.map(x => x[1]), 1), total = D().paradas.reduce((s, x) => s + x[1], 0);
      // arreglos: sin títulos de sección (R2). Las barras, en un bloque; lo demás, filas de VETA.r7 en una sola lista
      const n = C.practicas().length;
      return `<div class="r7-ficha" data-i="0"><span class="r7-ficha-de">${total} deals stalled now, by stage</span>` +
          `<div class="c-barras" role="list">${D().paradas.map(([f, n], k) => `<div class="c-barra" role="listitem" style="--v:${n / max};--k:${k}"><span class="c-barra-n">${esc(f)}</span>` +
            `<span class="c-barra-t" aria-hidden="true"><i></i></span><b class="c-barra-v">${n}</b></div>`).join('')}</div></div>` +
        VETA.r7.lista([
          {icono: 'equipo', nombre: 'What was suggested', pasa: 'And how many people use it', numero: n, ir: 'oficina/practicas'},
          {icono: 'aprende', oro: true, nombre: 'How Veta learns', pasa: D().aprende.map(x => x[0]).join(', '),
            abre: D().aprende.map(([t, x]) => `<p><b>${esc(t)}.</b> ${esc(x)}</p>`).join('')},
          {icono: 'libro', nombre: 'Cases to learn from', pasa: 'A deal that fell through', numero: 1, ir: 'oficina/caso/claudia'}
        ], {i: 1});
    }
  });

  // ---- G12 · Lo que Veta aún no hace ----
  VETA.lista('G12', {
    titulo: 'What Veta doesn\'t do yet',
    frase: 'What the office still does by hand: 43 times in six months.',
    bloques: () => [{filas: D().falta.map(([t, n]) => ({titulo: t, derecha: String(n), icono: 'mano'}))}],
    pie: 'Times someone in the office did it by hand, counted in the chats.',
    boton: {texto: 'Show me the first one', ir: 'dictar/orden'}
  });

  // ---- G13 · Un caso para aprender ----
  // F2 · R2: rótulos pequeños (como “Lo que le gustó” del acta), no títulos de sección
  const rotulado = (t, i, html) => `<section class="bloque" data-i="${i}"><p class="r7-ficha-de">${esc(t)}</p>${html}</section>`;
  VETA.pantalla('G13', {
    titulo: 'A case to learn from',
    frase: 'A deal that fell through, step by step. What it teaches, at the end.',
    pinta: () => {
      const hecha = C.lee('practicaClaudia', false);
      return (hecha ? UI.lineaHecho({texto: 'Proposal created: call within 48 hours anyone who asks for a viewing', hora: hecha, ir: 'oficina/practicas', boton: {texto: 'Undo', accion: 'deshacer'}, vt: 'c-caso', i: 0}) : '') +
        `<div class="c-caso-cab" data-i="0">${VETA.av('claudia', 64)}<div><p class="c-yo-n">Clàudia Ribas</p><p class="c-yo-p">Deal fell through · purchase of a flat in Sants</p></div></div>` +
        rotulado('What happened', 1, `<ol class="c-tiempo">${VETA.datos.casoClaudia.map(x => `<li><span class="c-tiempo-f">${esc(x.cuando)}</span><span class="c-tiempo-t${/^“/.test(x.texto) ? ' c-tiempo-cita' : ''}">${esc(x.texto)}</span></li>`).join('')}</ol>`) +
        rotulado('What it teaches', 2, UI.nota({texto: 'Whoever asks to see a flat and doesn\'t get a call within 48 hours leaves.', icono: 'estrella', caja: true}));
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
    frase: 'What I found in the chats of the whole office. These are counts, not opinions.',
    pinta: () => `<div class="c-cifra" data-i="0">${UI.cifra({valor: 212, unidad: 'of 301 contacts ended in a viewing', periodo: 'since we started'})}</div>` +
      // arreglos: sin título de sección (R2); las tres cosas que se repiten, filas de VETA.r7
      VETA.r7.lista(D().sabe.map(([t, a, b]) => ({icono: 'estrella', oro: true, nombre: `${a} of ${b} times`, pasa: t, abre: `<p>${esc(t)}: ${a} out of every ${b} times.</p>`})), {i: 1}) +
      UI.nota({texto: 'Counts made from the office chats, without names. They\'re examples.', icono: 'info', clase: 'nota-gris'})
  });
})();
