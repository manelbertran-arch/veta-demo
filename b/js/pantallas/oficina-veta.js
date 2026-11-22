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
    titulo: 'Cómo trabajamos',
    frase: () => VETA.yo().papel === 'direccion' ? 'Lo que la oficina hace igual, o está probando. Tú decides el paso siguiente de cada una.' : 'Lo que la oficina hace igual, o está probando. Lo decide dirección.',
    bloques: () => [{filas: C.practicas().map(filaPractica)}]
  });

  // ---- G11 · Lo que aprende la oficina ----
  VETA.pantalla('G11', {
    titulo: 'Lo que aprende la oficina',
    frase: 'Dónde se paran las operaciones y qué hemos aprendido de ello.',
    pinta: () => {
      const max = Math.max(...D().paradas.map(x => x[1]), 1), total = D().paradas.reduce((s, x) => s + x[1], 0);
      // arreglos: sin títulos de sección (R2). Las barras, en un bloque; lo demás, filas de VETA.r7 en una sola lista
      const n = C.practicas().length;
      return `<div class="r7-ficha" data-i="0"><span class="r7-ficha-de">${total} operaciones paradas ahora, por fase</span>` +
          `<div class="c-barras" role="list">${D().paradas.map(([f, n], k) => `<div class="c-barra" role="listitem" style="--v:${n / max};--k:${k}"><span class="c-barra-n">${esc(f)}</span>` +
            `<span class="c-barra-t" aria-hidden="true"><i></i></span><b class="c-barra-v">${n}</b></div>`).join('')}</div></div>` +
        VETA.r7.lista([
          {icono: 'equipo', nombre: 'Qué se ha propuesto', pasa: 'Y cuánta gente lo usa', numero: n, ir: 'oficina/practicas'},
          {icono: 'aprende', oro: true, nombre: 'Cómo aprende Veta', pasa: D().aprende.map(x => x[0]).join(', '),
            abre: D().aprende.map(([t, x]) => `<p><b>${esc(t)}.</b> ${esc(x)}</p>`).join('')},
          {icono: 'libro', nombre: 'Casos para aprender', pasa: 'Una operación caída', numero: 1, ir: 'oficina/caso/claudia'}
        ], {i: 1});
    }
  });

  // ---- G12 · Lo que Veta aún no hace ----
  VETA.lista('G12', {
    titulo: 'Lo que Veta aún no hace',
    frase: 'Lo que la oficina aún hace a mano: 43 veces en seis meses.',
    bloques: () => [{filas: D().falta.map(([t, n]) => ({titulo: t, derecha: String(n), icono: 'mano'}))}],
    pie: 'Veces que alguien de la oficina lo hizo a mano, contadas en los chats.',
    boton: {texto: 'Enséñame el primero', ir: 'dictar/orden'}
  });

  // ---- G13 · Un caso para aprender ----
  // F2 · R2: rótulos pequeños (como «Lo que le gustó» del acta), no títulos de sección
  const rotulado = (t, i, html) => `<section class="bloque" data-i="${i}"><p class="r7-ficha-de">${esc(t)}</p>${html}</section>`;
  VETA.pantalla('G13', {
    titulo: 'Un caso para aprender',
    frase: 'Una operación que se cayó, paso a paso. Lo que enseña, al final.',
    pinta: () => {
      const hecha = C.lee('practicaClaudia', false);
      return (hecha ? UI.lineaHecho({texto: 'Propuesta creada: llamar en 48 horas a quien pide una visita', hora: hecha, ir: 'oficina/practicas', boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-caso', i: 0}) : '') +
        `<div class="c-caso-cab" data-i="0">${VETA.av('claudia', 64)}<div><p class="c-yo-n">Clàudia Ribas</p><p class="c-yo-p">Operación caída · compra de un piso en Sants</p></div></div>` +
        rotulado('Qué pasó', 1, `<ol class="c-tiempo">${VETA.datos.casoClaudia.map(x => `<li><span class="c-tiempo-f">${esc(x.cuando)}</span><span class="c-tiempo-t${/^«/.test(x.texto) ? ' c-tiempo-cita' : ''}">${esc(x.texto)}</span></li>`).join('')}</ol>`) +
        rotulado('Lo que enseña', 2, UI.nota({texto: 'Quien pide ver un piso y no recibe una llamada en 48 horas, se va.', icono: 'estrella', caja: true}));
    },
    botonFijo: () => (C.lee('practicaClaudia', false) ? '' : UI.boton({texto: 'Sacar una práctica de este caso', accion: 'saca'})),
    acciones: {
      saca() { C.pon('practicaClaudia', VETA.ahora()); VETA.repinta({hecho: 'c-caso'}); },
      deshacer() { C.pon('practicaClaudia', false); VETA.repinta({hecho: 'c-caso'}); }
    }
  });

  // ---- G14 · Lo que sabe tu oficina ----
  VETA.pantalla('G14', {
    titulo: 'Lo que sabe tu oficina',
    frase: 'Lo que he encontrado en los chats de toda la oficina. Son cuentas, no opiniones.',
    pinta: () => `<div class="c-cifra" data-i="0">${UI.cifra({valor: 212, unidad: 'de 301 contactos acabaron en visita', periodo: 'desde que empezamos'})}</div>` +
      // arreglos: sin título de sección (R2); las tres cosas que se repiten, filas de VETA.r7
      VETA.r7.lista(D().sabe.map(([t, a, b]) => ({icono: 'estrella', oro: true, nombre: `${a} de ${b} veces`, pasa: t, abre: `<p>${esc(t)}: ${a} de cada ${b} veces.</p>`})), {i: 1}) +
      UI.nota({texto: 'Cuentas hechas con los chats de la oficina, sin nombres. Son de ejemplo.', icono: 'info', clase: 'nota-gris'})
  });
})();
