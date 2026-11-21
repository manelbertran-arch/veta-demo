/* Veta demo · pantallas · persona.js · ronda 6 · paquete D (P3)
   G19 · Una persona del equipo · #/persona/:id — lo que lleva, lo que tiene pendiente, cuánto tarda en contestar,
   lo que Veta ya hace por ella y lo que Veta ha aprendido de ella. Sin podio ni puntuación, y sin comparar con nadie:
   cada cifra es suya. La persona ve en su app esto mismo. Datos: js/datos/r6-direccion.js (VETA.dir.personaOps). */
(function () {
  'use strict';
  const UI = VETA.UI, esc = VETA.esc, X = VETA.dir, M = VETA.modelo;
  const ESTADO = {activa: 'Ya lo hago yo', 'a-prueba': 'Lo estoy probando', propuesta: 'Se lo he propuesto'};
  // en rojo solo cuando alguien espera respuesta; un papel con fecha o una operación que espera es trabajo normal y va en neutro
  const etq = a => a.tono === 'rojo' ? 'sin-responder' : 'esperando';

  VETA.pantalla('G19', {
    titulo: p => { const x = X.persona(p.id); return p.id === VETA.yo().id ? 'Tú' : (x.nombre || 'Una persona'); },
    guia: ['Aquí ves a una persona del equipo: lo que lleva, lo que tiene pendiente y lo que Veta ya hace por ella.', 'Tú tocas una operación para verla entera.', 'Así sabes dónde echar una mano. Ella ve esto mismo en su app.'],
    pinta: p => {
      if (!VETA.datos.personas[p.id]) return UI.vacio({titulo: 'No encuentro a esta persona.', icono: 'usuario', boton: {texto: 'Volver al equipo', ir: 'equipo'}});
      const x = X.personaOps(p.id), yo = p.id === VETA.yo().id, ella = x.p.corto;
      let h = `<div class="d-opd-cab" data-i="0">${VETA.av(p.id, 64, {foco: 'foto'})}<div><p class="d-opd-n" data-foco="nombre">${esc(x.p.nombre)}${yo ? ' (tú)' : ''}</p>` +
        `<p class="d-opd-q">${esc((x.p.papel === 'direccion' ? 'Dirección; también vende' : 'Agente') + ' · ' + X.zona(p.id))}</p></div></div>`;
      if (x.baja) h += `<p class="d-op-aviso d-opd-aviso d-tono-rojo" data-i="0">${VETA.ic('aviso', 20)}<span>${esc(x.baja)} · ${x.pendientes} conversaciones sin atender</span></p>` +
        `<div data-i="0">${UI.boton({texto: 'Pasar sus clientes a otra persona', ir: 'reparto'})}</div>`;
      // lo que lleva
      const filas = x.ops.map(o => ({titulo: o.nombre, sub: o.texto + ' · ' + o.como, av: o.id, ir: 'operacion/' + o.id,
        etiqueta: o.aviso ? etq(o.aviso) : null, etiquetaTexto: o.aviso ? o.aviso.texto.replace(' · Teresa está de baja', '') : null}));
      h += UI.bloque({titulo: 'Lo que lleva', texto: x.ops.length ? x.resumen : 'Ahora no lleva ninguna operación.',
        i: 1, html: x.ops.length ? UI.lista(filas) : ''});
      // lo que tiene pendiente
      const pend = x.baja ? `${x.pendientes} conversaciones esperan a alguien.` : x.pendientes ? VETA.dir.tocanTexto(x, yo) : 'Hoy no tiene nada pendiente.';
      h += UI.bloque({titulo: 'Lo que tiene pendiente', i: 2, html: `<p class="d-per-p">${esc(pend)}</p>`});
      // cuánto tarda en contestar: lo que decimos y lo que pasa
      if (x.tarda) h += UI.bloque({titulo: 'Cuánto tarda en contestar', i: 2, html: `<p class="d-per-p"><b>${esc(X.tardaTexto(x, yo))}</b></p>` +
        `<p class="d-per-pie">${UI.etiqueta('ejemplo')} Decimos «Contestamos en el día». Cuento desde que el cliente escribe hasta que ${yo ? 'contestas' : 'contesta'}, esta semana.</p>`});
      // lo que Veta ya hace por ella
      const hace = x.hace;
      h += UI.bloque({titulo: 'Lo que Veta ya hace por ' + (yo ? 'ti' : ella), i: 3, html: x.total
        ? `<p class="d-per-cifra">${VETA.vivo.cuenta({de: 0, a: x.total, clave: 'd-per-' + p.id})}<span>cosas que ${yo ? 'te' : 'le'} dejé listas esta semana</span></p>` +
          `<p class="d-per-p">${hace.mensajes} mensajes, ${hace.actas} ${hace.actas === 1 ? 'nota de visita' : 'notas de visita'} y ${hace.avisos} avisos.</p>`
        : `<p class="d-per-p">Esta semana no, porque está de baja.</p>`});
      // lo que Veta ha aprendido de ella
      const ap = x.aprendido.map(([id, t]) => {
        const r = id ? M.regla(id) : null, est = r ? r.estado : 'activa';
        return {titulo: t, sub: ESTADO[est] || ESTADO.activa, icono: 'aprende'};
      });
      const hoy = p.id === 'laura' && VETA.r6 && VETA.r6.siempre ? VETA.r6.siempre() : null;
      if (hoy) ap.unshift({titulo: hoy.regla, sub: 'Me lo enseñó hoy · ya lo hago así', icono: 'aprende'});
      if (ap.length) h += UI.bloque({titulo: 'Lo que he aprendido de ' + (yo ? 'ti' : ella), i: 3, html: UI.lista(ap)});
      h += UI.nota({icono: 'candado', texto: yo ? 'Cada persona del equipo ve lo mismo que tú de ella.' : `${ella} ve esto mismo en su app. No ves sus chats ni sus notas.`});
      return h;
    }
  });
})();
