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
    guia: ['Aquí están las prácticas de la oficina y en qué punto está cada una.', 'Tú tocas una para ver quién la propuso y de qué caso nació.', 'Así lo que funciona pasa a ser cómo trabaja todo el equipo.'],
    intro: () => VETA.yo().papel === 'direccion' ? 'Lo que la oficina hace igual, o está probando. Tú decides el paso siguiente de cada una.' : 'Lo que la oficina hace igual, o está probando. Lo decide dirección.',
    bloques: () => [{filas: C.practicas().map(filaPractica)}]
  });

  // ---- G11 · Lo que aprende la oficina ----
  VETA.pantalla('G11', {
    titulo: 'Lo que aprende la oficina',
    guia: ['Aquí ves dónde se paran las operaciones y qué está aprendiendo la oficina.', 'Tú tocas una práctica o un caso para ver de dónde sale.', 'Así se mejora con lo que pasa de verdad, no con opiniones.'],
    pinta: () => {
      const max = Math.max(...D().paradas.map(x => x[1]), 1), total = D().paradas.reduce((s, x) => s + x[1], 0);
      return UI.bloque({titulo: 'Dónde se paran las operaciones', texto: `${total} operaciones paradas ahora, por fase.`, i: 0, html:
          `<div class="c-barras" role="list">${D().paradas.map(([f, n], k) => `<div class="c-barra" role="listitem" style="--v:${n / max};--k:${k}"><span class="c-barra-n">${esc(f)}</span>` +
            `<span class="c-barra-t" aria-hidden="true"><i></i></span><b class="c-barra-v">${n}</b></div>`).join('')}</div>`}) +
        UI.bloque({titulo: 'Qué se ha propuesto y cuánta gente lo usa', i: 1, html: UI.lista(C.practicas().map(filaPractica))}) +
        UI.bloque({titulo: 'Cómo aprende Veta', i: 2, html: `<ol class="c-hilo c-hilo-corto">${D().aprende.map(([t, x], k) => `<li class="c-nudo" style="--k:${k}"><span class="c-nudo-p" aria-hidden="true"></span><span><b>${esc(t)}</b><br><span class="c-nudo-s">${esc(x)}</span></span></li>`).join('')}</ol>`}) +
        UI.lista([{titulo: 'Casos para aprender', sub: '1 · una operación caída', derecha: '1', icono: 'libro', ir: 'oficina/caso/claudia'}], {i: 3});
    }
  });

  // ---- G12 · Lo que Veta aún no hace ----
  VETA.lista('G12', {
    titulo: 'Lo que Veta aún no hace',
    guia: ['Aquí ves los trabajos que la oficina todavía hace a mano.', 'Tú le enseñas el primero dictándolo con tu voz.', 'Así Veta aprende primero lo que más tiempo quita.'],
    intro: '43 veces a mano en seis meses.',
    bloques: () => [{filas: D().falta.map(([t, n]) => ({titulo: t, derecha: String(n), icono: 'mano'}))}],
    pie: 'Veces que alguien de la oficina lo hizo a mano, contadas en los chats.',
    boton: {texto: 'Enséñame el primero', ir: 'dictar/orden'}
  });

  // ---- G13 · Un caso para aprender ----
  VETA.pantalla('G13', {
    titulo: 'Un caso para aprender',
    guia: ['Aquí se cuenta una operación que se cayó, con sus mensajes y fechas.', 'Tú sacas de ella una práctica para la oficina.', 'Así lo que salió mal no vuelve a pasar.'],
    pinta: () => {
      const hecha = C.lee('practicaClaudia', false);
      return (hecha ? UI.lineaHecho({texto: 'Propuesta creada: llamar en 48 horas a quien pide una visita', hora: hecha, ir: 'oficina/practicas', boton: {texto: 'Deshacer', accion: 'deshacer'}, vt: 'c-caso', i: 0}) : '') +
        `<div class="c-caso-cab" data-i="0">${VETA.av('claudia', 64)}<div><p class="c-yo-n">Clàudia Ribas</p><p class="c-yo-p">Operación caída · compra de un piso en Sants</p></div></div>` +
        UI.bloque({titulo: 'Qué pasó', i: 1, html: `<ol class="c-tiempo">${VETA.datos.casoClaudia.map(x => `<li><span class="c-tiempo-f">${esc(x.cuando)}</span><span class="c-tiempo-t${/^«/.test(x.texto) ? ' c-tiempo-cita' : ''}">${esc(x.texto)}</span></li>`).join('')}</ol>`}) +
        UI.bloque({titulo: 'Lo que enseña', i: 2, html: UI.nota({texto: 'Quien pide ver un piso y no recibe una llamada en 48 horas, se va.', icono: 'estrella', caja: true})});
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
    guia: ['Aquí ves lo que Veta ha encontrado en los chats de toda la oficina.', 'Tú lo lees: son cuentas, no opiniones.', 'Así sabes qué funciona en tu zona.'],
    pinta: () => `<div class="c-cifra" data-i="0">${UI.cifra({valor: 212, unidad: 'de 301 contactos acabaron en visita', periodo: 'desde que empezamos'})}</div>` +
      UI.bloque({titulo: 'Tres cosas que se repiten', i: 1, html: D().sabe.map(([t, a, b], k) =>
        `<div class="c-sabe" style="--v:${a / b};--k:${k}"><p class="c-sabe-t">${esc(t)}</p><div class="c-sabe-l"><span class="c-barra-t" aria-hidden="true"><i></i></span><b>${a} de ${b}</b>${C.ejemplo()}</div></div>`).join('')}) +
      UI.nota({texto: 'Cuentas hechas con los chats de la oficina, sin nombres. Son de ejemplo.', icono: 'info', clase: 'nota-gris'})
  });
})();
